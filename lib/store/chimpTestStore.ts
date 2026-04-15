// lib/store/chimpTestStore.ts
import { create } from 'zustand';
import type { ChimpTestState, ChimpGamePhase, ChimpSquare } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_COLS = 5;
const GRID_ROWS = 4;
const GRID_SIZE = GRID_COLS * GRID_ROWS; // 20 cells total
const STARTING_LEVEL = 4;               // Start with 4 numbers
const NEXT_ROUND_DELAY = 600;           // ms before next round starts

let _roundTimeout: ReturnType<typeof setTimeout> | null = null;
const _clearRoundTimeout = () => {
  if (_roundTimeout) { clearTimeout(_roundTimeout); _roundTimeout = null; }
};

// ─── Helper: generate a new round ────────────────────────────────────────────
// Picks `count` random unique grid positions, assigns numbers 1..count

function generateSquares(count: number): ChimpSquare[] {
  // Shuffle all grid indices and pick the first `count`
  const allIndices = Array.from({ length: GRID_SIZE }, (_, i) => i);
  for (let i = allIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }
  const chosen = allIndices.slice(0, count);

  // Assign values 1..count to the chosen positions
  return chosen.map((gridIndex, i) => ({
    index: gridIndex,
    value: i + 1,
    visible: true, // Numbers shown initially
  }));
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChimpTestStore = create<ChimpTestState>()((set, get) => ({
  phase: 'idle' as ChimpGamePhase,
  level: STARTING_LEVEL,
  squares: [],
  nextExpected: 1,
  wrongIndex: null,
  bestLevel: 0,

  // ── startGame ──────────────────────────────────────────────────────────────
  // Generates a new round at the current level
  startGame: () => {
    _clearRoundTimeout();
    const { level } = get();
    const squares = generateSquares(level);

    set({
      phase: 'memorize',
      squares,
      nextExpected: 1,
      wrongIndex: null,
    });
  },

  // ── handleSquareClick ──────────────────────────────────────────────────────
  handleSquareClick: (gridIndex: number) => {
    const { phase, squares, nextExpected, level, bestLevel } = get();

    // ── Memorize phase: clicking "1" hides all numbers ──
    if (phase === 'memorize') {
      const clicked = squares.find(s => s.index === gridIndex);
      if (!clicked) return;

      // Only clicking "1" triggers the hide — clicking any other number does nothing
      if (clicked.value !== 1) return;

      // Hide all numbers except keep square "1" visible briefly
      // then transition to recall phase
      set({
        phase: 'recall',
        nextExpected: 2, // User already clicked 1, next is 2
        squares: squares.map(s => ({
          ...s,
          visible: false, // All numbers hidden
        })),
      });
      return;
    }

    // ── Recall phase: user clicks squares in order ──
    if (phase === 'recall') {
      const clicked = squares.find(s => s.index === gridIndex);
      if (!clicked) return;

      // ── Wrong square ──
      if (clicked.value !== nextExpected) {
        set({
          phase: 'wrong',
          wrongIndex: gridIndex,
          bestLevel: Math.max(bestLevel, level),
          // Reveal all squares so user sees what they missed
          squares: squares.map(s => ({ ...s, visible: true })),
        });
        return;
      }

      // ── Correct click ──
      const newSquares = squares.map(s =>
        s.index === gridIndex ? { ...s, visible: true } : s
      );
      const isRoundComplete = nextExpected === level;

      if (isRoundComplete) {
        // Round won — advance to next level
        set({
          phase: 'correct',
          squares: newSquares,
          bestLevel: Math.max(bestLevel, level + 1),
        });

        _roundTimeout = setTimeout(() => {
          const nextLevel = get().level + 1;
          const nextSquares = generateSquares(nextLevel);
          set({
            phase: 'memorize',
            level: nextLevel,
            squares: nextSquares,
            nextExpected: 1,
            wrongIndex: null,
          });
        }, NEXT_ROUND_DELAY);
      } else {
        set({
          squares: newSquares,
          nextExpected: nextExpected + 1,
        });
      }
      return;
    }
  },

  // ── resetGame ──────────────────────────────────────────────────────────────
  resetGame: () => {
    _clearRoundTimeout();
    set({
      phase: 'idle',
      level: STARTING_LEVEL,
      squares: [],
      nextExpected: 1,
      wrongIndex: null,
    });
  },
}));
