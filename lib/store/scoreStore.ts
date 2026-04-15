// lib/store/scoreStore.ts
import { create } from 'zustand';

export interface GameScore {
  reactionTime: number | null;   // average ms (lower = better)
  sequenceMemory: number | null; // highest level reached
  chimpTest: number | null;      // highest number count reached
  lastUpdated: number;           // timestamp
}

interface ScoreStore {
  scores: GameScore;
  setReactionTime: (ms: number) => void;
  setSequenceMemory: (level: number) => void;
  setChimpTest: (level: number) => void;
  clearScores: () => void;
}

const DEFAULT: GameScore = {
  reactionTime: null,
  sequenceMemory: null,
  chimpTest: null,
  lastUpdated: 0,
};

export const useScoreStore = create<ScoreStore>()((set) => ({
  scores: DEFAULT,

  setReactionTime: (ms) =>
    set((s) => ({
      scores: {
        ...s.scores,
        // Keep best (lowest) reaction time
        reactionTime: s.scores.reactionTime === null
          ? ms
          : Math.min(s.scores.reactionTime, ms),
        lastUpdated: Date.now(),
      },
    })),

  setSequenceMemory: (level) =>
    set((s) => ({
      scores: {
        ...s.scores,
        sequenceMemory: Math.max(s.scores.sequenceMemory ?? 0, level),
        lastUpdated: Date.now(),
      },
    })),

  setChimpTest: (level) =>
    set((s) => ({
      scores: {
        ...s.scores,
        chimpTest: Math.max(s.scores.chimpTest ?? 0, level),
        lastUpdated: Date.now(),
      },
    })),

  clearScores: () => set({ scores: DEFAULT }),
}));

// ── Grading System ────────────────────────────────────────────────────────────
// Calculates an overall performance grade from 0–100
// Each game contributes equally (33.3% weight)

export interface GradeResult {
  score: number;       // 0–100
  title: string;
  emoji: string;
  color: string;
  description: string;
}

function scoreReaction(ms: number): number {
  // Lower is better. 150ms = 100pts, 500ms = 0pts
  return Math.max(0, Math.min(100, Math.round(((500 - ms) / 350) * 100)));
}

function scoreMemory(level: number): number {
  // Higher is better. Level 15+ = 100pts, Level 1 = 5pts
  return Math.max(0, Math.min(100, Math.round((level / 15) * 100)));
}

function scoreChimp(level: number): number {
  // Higher is better. 12+ numbers = 100pts
  return Math.max(0, Math.min(100, Math.round((level / 12) * 100)));
}

export function calculateGrade(scores: GameScore): GradeResult | null {
  const parts: number[] = [];
  if (scores.reactionTime !== null) parts.push(scoreReaction(scores.reactionTime));
  if (scores.sequenceMemory !== null) parts.push(scoreMemory(scores.sequenceMemory));
  if (scores.chimpTest !== null) parts.push(scoreChimp(scores.chimpTest));

  if (parts.length === 0) return null;

  const avg = Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);

  if (avg >= 95) return { score: avg, title: 'Superhuman',    emoji: '⚡', color: '#7c3aed', description: 'Your cognitive abilities are in the top fraction of a percent. You may not be human.' };
  if (avg >= 80) return { score: avg, title: 'Elite',         emoji: '🔥', color: '#ea580c', description: 'Exceptional performance across the board. You are significantly faster and sharper than average.' };
  if (avg >= 65) return { score: avg, title: 'Above Average', emoji: '🎯', color: '#16a34a', description: 'You are performing better than most people. Strong reaction speed and good memory.' };
  if (avg >= 45) return { score: avg, title: 'Average',       emoji: '🧠', color: '#2563eb', description: 'Right in the middle of the pack. Perfectly normal cognitive performance for a healthy adult.' };
  if (avg >= 25) return { score: avg, title: 'Below Average', emoji: '🐢', color: '#d97706', description: 'A bit slow today? Try again after some rest — reaction time varies with fatigue.' };
  return              { score: avg, title: 'Turtle Mode',    emoji: '🐌', color: '#dc2626', description: 'Are you testing with your eyes closed? No judgement — everyone starts somewhere.' };
}

export function reactionGrade(ms: number): { label: string; color: string } {
  if (ms < 150) return { label: 'SUPERHUMAN', color: '#7c3aed' };
  if (ms < 200) return { label: 'EXCELLENT',  color: '#16a34a' };
  if (ms < 250) return { label: 'GOOD',        color: '#65a30d' };
  if (ms < 300) return { label: 'AVERAGE',     color: '#d97706' };
  if (ms < 400) return { label: 'BELOW AVG',   color: '#ea580c' };
  return               { label: 'KEEP TRYING', color: '#dc2626' };
}
