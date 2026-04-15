import type { ReactionAttempt } from '@/types';

export default function ResultCard({ attempt, isCurrent = false }: { attempt: ReactionAttempt; isCurrent?: boolean }) {
  return (
    <div className={`attempt-card fade-in ${isCurrent ? 'is-current' : ''} ${attempt.isEarly ? 'is-early' : ''}`}>
      <span className="attempt-num">#{attempt.attemptNumber}</span>
      {attempt.isEarly
        ? <span className="attempt-early-label">EARLY</span>
        : <span className={`attempt-ms ${isCurrent ? 'current-ms' : ''}`}>
            {attempt.reactionMs}<span className="attempt-ms-unit">ms</span>
          </span>
      }
    </div>
  );
}
