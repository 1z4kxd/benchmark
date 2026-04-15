// lib/store/sequenceMemoryStore.ts
import { create } from 'zustand';
import type { SequenceMemoryState, SequenceGamePhase } from '@/types';

const GRID_SIZE = 9;
const FLASH_ON_MS = 600;
const FLASH_OFF_MS = 250;
const NEXT_LEVEL_DELAY = 800;

let _sequenceTimeout: ReturnType<typeof setTimeout> | null = null;

const _clearTimeout = () => {
  if (_sequenceTimeout) { clearTimeout(_sequenceTimeout); _sequenceTimeout = null; }
};

const randomSquare = (): number => Math.floor(Math.random() * GRID_SIZE);

export const useSequenceMemoryStore = create<SequenceMemoryState>()((set, get) => ({
  phase: 'idle' as SequenceGamePhase,
  level: 1,
  sequence: [],
  userInput: [],
  highlightedSquare: null,
  bestLevel: 0,

  startGame: () => {
    const { sequence } = get();
    const newSequence = [...sequence, randomSquare()];

    set({
      phase: 'showing',
      sequence: newSequence,
      userInput: [],
      highlightedSquare: null,
    });

    _playSequence(newSequence, set);
  },

  handleSquareClick: (index: number) => {
    const { phase, sequence, userInput, level, bestLevel } = get();
    if (phase !== 'input') return;

    const newInput = [...userInput, index];
    const currentStep = newInput.length - 1;

    if (index !== sequence[currentStep]) {
      _clearTimeout();
      set({
        phase: 'wrong',
        userInput: newInput,
        bestLevel: Math.max(bestLevel, level),
      });
      return;
    }

    if (newInput.length === sequence.length) {
      set({
        phase: 'correct',
        userInput: newInput,
        level: level + 1,
        bestLevel: Math.max(bestLevel, level + 1),
      });

      _sequenceTimeout = setTimeout(() => {
        get().startGame();
      }, NEXT_LEVEL_DELAY);
    } else {
      set({ userInput: newInput });
    }
  },

  resetGame: () => {
    _clearTimeout();
    set({
      phase: 'idle',
      level: 1,
      sequence: [],
      userInput: [],
      highlightedSquare: null,
    });
  },
}));

// Sequence playback engine — outside the store to avoid stale closure issues
function _playSequence(
  sequence: number[],
  set: (partial: Partial<SequenceMemoryState>) => void
) {
  _clearTimeout();
  let i = 0;

  const showNext = () => {
    if (i >= sequence.length) {
      set({ phase: 'input', highlightedSquare: null });
      return;
    }

    set({ highlightedSquare: sequence[i] });

    _sequenceTimeout = setTimeout(() => {
      set({ highlightedSquare: null });
      _sequenceTimeout = setTimeout(() => {
        i++;
        showNext();
      }, FLASH_OFF_MS);
    }, FLASH_ON_MS);
  };

  _sequenceTimeout = setTimeout(showNext, 600);
}
