// components/SequenceMemory/SequenceGrid.tsx
'use client';

import type { SequenceGamePhase } from '@/types';

interface Props {
  phase: SequenceGamePhase;
  highlightedSquare: number | null; // Which square is lit during playback
  userInput: number[];              // Squares user has clicked this round
  sequence: number[];               // Full sequence (used to show wrong square)
  onSquareClick: (index: number) => void;
}

export default function SequenceGrid({
  phase,
  highlightedSquare,
  userInput,
  sequence,
  onSquareClick,
}: Props) {
  const isInputPhase = phase === 'input';
  const isShowingPhase = phase === 'showing';
  const isWrong = phase === 'wrong';

  return (
    <div
      className="seq-grid-wrapper"
      // Dim the grid with a slight overlay during showing phase
      data-phase={phase}
    >
      <div className="seq-grid">
        {Array.from({ length: 9 }).map((_, i) => {
          // Determine square state
          const isHighlighted = highlightedSquare === i;

          // During wrong phase: show which square was next in sequence
          const isNextCorrect = isWrong && sequence[userInput.length - 1] === i;
          const isWrongClick = isWrong && userInput[userInput.length - 1] === i && userInput[userInput.length - 1] !== sequence[userInput.length - 1];

          let squareClass = 'seq-square';
          if (isHighlighted) squareClass += ' lit';
          if (isWrongClick) squareClass += ' wrong';
          if (isNextCorrect) squareClass += ' correct-reveal';
          if (phase === 'correct') squareClass += ' success-flash';
          if (isInputPhase) squareClass += ' clickable';

          return (
            <button
              key={i}
              className={squareClass}
              onClick={() => isInputPhase && onSquareClick(i)}
              disabled={!isInputPhase}
              aria-label={`Square ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Overlay message during showing phase */}
      {isShowingPhase && (
        <div className="seq-overlay-msg">
          <span>Watch the sequence...</span>
        </div>
      )}
    </div>
  );
}
