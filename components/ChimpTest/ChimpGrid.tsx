// components/ChimpTest/ChimpGrid.tsx
'use client';

import type { ChimpGamePhase, ChimpSquare } from '@/types';

const GRID_COLS = 5;
const GRID_ROWS = 4;
const GRID_SIZE = GRID_COLS * GRID_ROWS;

interface Props {
  phase: ChimpGamePhase;
  squares: ChimpSquare[];
  nextExpected: number;
  wrongIndex: number | null;
  onSquareClick: (index: number) => void;
}

export default function ChimpGrid({ phase, squares, nextExpected, wrongIndex, onSquareClick }: Props) {
  // Build a lookup map: gridIndex → square data
  const squareMap = new Map<number, ChimpSquare>();
  squares.forEach(s => squareMap.set(s.index, s));

  const isMemorize = phase === 'memorize';
  const isRecall = phase === 'recall';
  const isWrong = phase === 'wrong';
  const isCorrect = phase === 'correct';

  return (
    <div className="chimp-grid">
      {Array.from({ length: GRID_SIZE }).map((_, gridIndex) => {
        const square = squareMap.get(gridIndex);

        // Empty cell — no square here
        if (!square) {
          return <div key={gridIndex} className="chimp-cell empty" />;
        }

        // Determine cell state
        const isWrongCell = isWrong && square.index === wrongIndex;
        const isClickable = (isMemorize && square.value === 1) || isRecall;
        const showNumber = square.visible;

        // Figure out if this was already correctly clicked (recall phase)
        const isClicked = isRecall && square.visible;

        let cellClass = 'chimp-cell';
        if (isWrongCell) cellClass += ' chimp-wrong';
        else if (isCorrect) cellClass += ' chimp-correct';
        else if (isClicked) cellClass += ' chimp-clicked';
        else if (isClickable) cellClass += ' chimp-clickable';
        else if (square) cellClass += ' chimp-active';

        return (
          <button
            key={gridIndex}
            className={cellClass}
            onClick={() => isClickable && onSquareClick(gridIndex)}
            disabled={!isClickable}
            aria-label={showNumber ? `Square ${square.value}` : 'Hidden square'}
          >
            {showNumber && (
              <span className="chimp-number">{square.value}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
