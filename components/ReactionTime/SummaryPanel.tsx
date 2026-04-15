'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useScoreStore, reactionGrade } from '@/lib/store/scoreStore';
import type { ReactionAttempt } from '@/types';

export default function SummaryPanel({ averageMs, attempts, onReset }: {
  averageMs: number; attempts: ReactionAttempt[]; onReset: () => void;
}) {
  const { setReactionTime } = useScoreStore();
  const { label, color } = reactionGrade(averageMs);
  const valid = attempts.filter(a => !a.isEarly);
  const earlyCount = attempts.filter(a => a.isEarly).length;
  const ms = valid.map(a => a.reactionMs!);
  const best = ms.length > 0 ? Math.min(...ms) : 0;
  const worst = ms.length > 0 ? Math.max(...ms) : 0;

  useEffect(() => { setReactionTime(averageMs); }, [averageMs, setReactionTime]);

  return (
    <div className="summary-page fade-in">
      <p className="summary-label">REACTION TIME</p>
      <div>
        <span className="summary-score" style={{ color }}>{averageMs}</span>
        <span className="summary-score-unit">ms</span>
      </div>
      <p className="summary-grade" style={{ color }}>{label}</p>
      <div className="stats-grid">
        {[['BEST', best], ['AVG', averageMs], ['WORST', worst]].map(([l, v]) => (
          <div className="stat-cell" key={l as string}>
            <p className="stat-cell-label">{l}</p>
            <p className="stat-cell-val">{v}ms</p>
          </div>
        ))}
      </div>
      {earlyCount > 0 && <p className="early-count-note">{earlyCount} early click{earlyCount > 1 ? 's' : ''} not counted</p>}
      <div className="history-list">
        {attempts.map((a, i) => (
          <div key={i} className={`history-row ${a.isEarly ? 'early-row' : ''}`}>
            <span className="history-row-n">#{a.attemptNumber}</span>
            {a.isEarly ? <span className="history-row-early">EARLY</span> : <span className="history-row-ms">{a.reactionMs}ms</span>}
          </div>
        ))}
      </div>
      <div className="summary-actions">
        <button className="summary-btn primary" onClick={onReset}>TRY AGAIN</button>
        <Link href="/dashboard" className="summary-btn primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>VIEW DASHBOARD</Link>
      </div>
      <p className="summary-footnote">Score saved to your session dashboard.</p>
    </div>
  );
}
