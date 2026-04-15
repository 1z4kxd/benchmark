// lib/store/reactionTimeStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ReactionTimeState, ReactionAttempt, ReactionGamePhase } from '@/types';
import { now, elapsedMs, randomDelay, mean } from '@/lib/utils/timing';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_ATTEMPTS = 5;

// ─── Internal State (not exposed to consumers) ────────────────────────────────

/**
 * We keep the timer reference and the green-screen start timestamp OUTSIDE
 * the Zustand state to avoid React re-renders when they change.
 *
 * CRITICAL: These must not be part of Zustand state because:
 * 1. timeoutRef changes every attempt — would cause excessive re-renders
 * 2. greenStartTime is set imperatively inside rAF callback
 */
let _waitingTimeoutRef: ReturnType<typeof setTimeout> | null = null;
let _greenStartTime: number | null = null;

// ─── Helper: clear any pending timeout ───────────────────────────────────────

const _clearWaitingTimeout = () => {
  if (_waitingTimeoutRef !== null) {
    clearTimeout(_waitingTimeoutRef);
    _waitingTimeoutRef = null;
  }
};

// ─── Store Definition ─────────────────────────────────────────────────────────

export const useReactionTimeStore = create<ReactionTimeState>()(
  devtools(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────

      phase: 'idle' as ReactionGamePhase,
      attempts: [],
      currentAttemptNumber: 1,
      averageMs: null,

      // ── Actions ────────────────────────────────────────────────────────────

      /**
       * startTest / advance to next attempt.
       * Transitions: idle → waiting, result → waiting, early → waiting
       *
       * Schedules the green-screen appearance after a random delay.
       * The timeout ID is stored outside Zustand to avoid re-render churn.
       */
      startTest: () => {
        const { phase } = get();

        // Guard: only allow starting from valid phases
        const validStartPhases: ReactionGamePhase[] = ['idle', 'result', 'early'];
        if (!validStartPhases.includes(phase)) return;

        // Clear any previous timeout (safety net)
        _clearWaitingTimeout();
        _greenStartTime = null;

        // Transition to WAITING (red screen)
        set({ phase: 'waiting' }, false, 'startTest/waiting');

        // Schedule the green screen after a random delay
        const delay = randomDelay(1500, 4000);

        _waitingTimeoutRef = setTimeout(() => {
          _waitingTimeoutRef = null;

          // 1) Tell React to switch to the green screen
          set({ phase: 'active' }, false, 'startTest/active');

          // 2) Record T0 only AFTER the browser has actually painted the green
          //    frame to the screen.
          //
          //    WHY double rAF?
          //    - First rAF fires just before the browser is about to paint —
          //      the green frame hasn't reached pixels yet.
          //    - Second rAF fires after that paint has committed, meaning the
          //      user's screen is now actually showing green.
          //
          //    Without this, _greenStartTime is set ~16–50ms before the user
          //    can physically see the green screen, inflating every result by
          //    that amount — matching the 50–60ms discrepancy you observed.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              _greenStartTime = now();
            });
          });
        }, delay);
      },

      /**
       * handleScreenClick — the core game event handler.
       * Called any time the user clicks/taps the game screen.
       *
       * Transitions:
       *   waiting → early   (clicked before green — too fast!)
       *   active  → result  (valid click — calculate reaction time)
       *   early   → (no-op, UI shows retry button instead)
       *   result  → (no-op, UI shows next/continue button)
       */
      handleScreenClick: () => {
        // Capture click time IMMEDIATELY — first line, before anything else.
        // Every line after this adds latency to the measurement.
        const clickTime = now();

        const { phase, attempts, currentAttemptNumber } = get();

        // ── Case 1: Clicked too early (still waiting/red) ──────────────────
        if (phase === 'waiting') {
          _clearWaitingTimeout(); // Cancel the pending green-screen timer

          const earlyAttempt: ReactionAttempt = {
            attemptNumber: currentAttemptNumber,
            reactionMs: null,
            isEarly: true,
            timestamp: clickTime,
          };

          set(
            {
              phase: 'early',
              attempts: [...attempts, earlyAttempt],
              // NOTE: We do NOT increment currentAttemptNumber here.
              // An early click doesn't count as a completed attempt.
              // The attempt IS recorded (so the user sees their mistake)
              // but the attempt number doesn't advance until retry.
            },
            false,
            'handleScreenClick/early'
          );
          return;
        }

        // ── Case 2: Valid click (screen is green) ──────────────────────────
        if (phase === 'active') {
          // Edge case: user clicked before the double-rAF had a chance to set
          // _greenStartTime (i.e., they clicked within the same frame the green
          // screen appeared). Treat this as a near-zero valid reaction.
          if (_greenStartTime === null) {
            console.warn('[ReactionTimeStore] click arrived before greenStartTime was set — defaulting to 0ms');
            _greenStartTime = clickTime;
          }

          const reactionMs = elapsedMs(_greenStartTime, clickTime);
          _greenStartTime = null; // Reset for next attempt

          const newAttempt: ReactionAttempt = {
            attemptNumber: currentAttemptNumber,
            reactionMs,
            isEarly: false,
            timestamp: clickTime,
          };

          const updatedAttempts = [...attempts, newAttempt];
          const validAttempts = updatedAttempts.filter((a) => !a.isEarly);
          const isComplete = validAttempts.length >= TOTAL_ATTEMPTS;

          if (isComplete) {
            // All 5 valid attempts collected — calculate average
            const avg = mean(validAttempts.map((a) => a.reactionMs));
            set(
              {
                phase: 'complete',
                attempts: updatedAttempts,
                averageMs: avg,
              },
              false,
              'handleScreenClick/complete'
            );
          } else {
            set(
              {
                phase: 'result',
                attempts: updatedAttempts,
                currentAttemptNumber: currentAttemptNumber + 1,
              },
              false,
              'handleScreenClick/result'
            );
          }
          return;
        }

        // ── All other phases: clicks are no-ops ────────────────────────────
        // (idle, early, result, complete — interaction handled by buttons)
      },

      /**
       * resetTest — returns to idle state, clears all attempts.
       * Called from the complete screen's "Try Again" button.
       */
      resetTest: () => {
        _clearWaitingTimeout();
        _greenStartTime = null;

        set(
          {
            phase: 'idle',
            attempts: [],
            currentAttemptNumber: 1,
            averageMs: null,
          },
          false,
          'resetTest'
        );
      },
    }),
    { name: 'reaction-time-store' }
  )
);