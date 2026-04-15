// types/index.ts

// ─── Game State Machine ───────────────────────────────────────────────────────

/**
 * The five discrete states of the Reaction Time game.
 * Drives screen color, user interactivity, and UI copy.
 */
export type ReactionGamePhase =
  | 'idle'      // Before the test starts — shows instructions
  | 'waiting'   // Screen is RED — waiting for the random delay to fire
  | 'active'    // Screen is GREEN — timer running, user must click
  | 'early'     // Screen is BLUE — user clicked too early, penalty screen
  | 'result'    // Showing the result of a single attempt
  | 'complete'; // All 5 attempts done — showing final average

// ─── Attempt Result ───────────────────────────────────────────────────────────

/**
 * Data captured from a single completed reaction attempt.
 * `reactionMs` is null only for 'early' attempts.
 */
export interface ReactionAttempt {
  attemptNumber: number;  // 1-indexed (1–5)
  reactionMs: number | null; // null if user clicked too early
  isEarly: boolean;
  timestamp: number; // performance.now() when click landed
}

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface ReactionTimeState {
  phase: ReactionGamePhase;
  attempts: ReactionAttempt[];
  currentAttemptNumber: number; // Starts at 1, increments after each valid result
  averageMs: number | null; // Calculated only in 'complete' phase

  // Actions
  startTest: () => void;
  handleScreenClick: () => void;
  resetTest: () => void;
}

// ─── Score / Leaderboard ─────────────────────────────────────────────────────

export type GameType = 'reaction_time' | 'sequence_memory' | 'chimp_test';

export interface ScoreRecord {
  id: string;
  userId: string;
  gameType: GameType;
  score: number;       // ms for reaction time; level number for memory/chimp
  attempts: number[];  // Raw array of individual attempt values
  createdAt: string;
}

export interface PercentileResult {
  percentile: number;  // 0–100. Higher = better (beat X% of users)
  totalSamples: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  description: string;
}

// ─── Sequence Memory ──────────────────────────────────────────────────────────

export type SequenceGamePhase =
  | 'idle'       // Pre-game, show instructions
  | 'showing'    // Animating the sequence to the user
  | 'input'      // User is clicking squares to repeat the sequence
  | 'correct'    // Brief flash: user got it right, next level loading
  | 'wrong'      // User clicked wrong square — game over
  | 'complete';  // User beat a milestone (shown after every 5 levels)

export interface SequenceMemoryState {
  phase: SequenceGamePhase;
  level: number;               // Current level (= sequence length)
  sequence: number[];          // Array of square indices (0–8)
  userInput: number[];         // What the user has clicked so far this round
  highlightedSquare: number | null; // Which square is lit during playback
  bestLevel: number;           // Session best

  // Actions
  startGame: () => void;
  handleSquareClick: (index: number) => void;
  resetGame: () => void;
}

// ─── Chimp Test ───────────────────────────────────────────────────────────────

export type ChimpGamePhase =
  | 'idle'      // Pre-game, show instructions
  | 'memorize'  // Numbers visible — user studies the grid
  | 'recall'    // User clicked 1 — numbers hidden, click in order
  | 'wrong'     // Wrong square clicked — game over
  | 'correct';  // Round complete — brief flash before next round

export interface ChimpSquare {
  index: number;   // Grid position (0 to gridSize-1)
  value: number;   // The number shown (1 to N)
  visible: boolean; // Whether the number is currently shown
}

export interface ChimpTestState {
  phase: ChimpGamePhase;
  level: number;          // Current level = number of squares (starts at 4)
  squares: ChimpSquare[]; // All squares in the current round
  nextExpected: number;   // The next number the user must click (starts at 1)
  wrongIndex: number | null; // Which square was wrongly clicked
  bestLevel: number;      // Session best

  // Actions
  startGame: () => void;
  handleSquareClick: (index: number) => void;
  resetGame: () => void;
}
