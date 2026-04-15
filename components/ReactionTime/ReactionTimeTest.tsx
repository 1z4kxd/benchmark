'use client';
import { useReactionTimeStore } from '@/lib/store/reactionTimeStore';
import GameScreen from './GameScreen';
import ResultCard from './ResultCard';
import SummaryPanel from './SummaryPanel';

const TOTAL = 5;

export default function ReactionTimeTest() {
  const { phase, attempts, currentAttemptNumber, averageMs, startTest, handleScreenClick, resetTest } = useReactionTimeStore();
  const valid = attempts.filter(a => !a.isEarly);
  const last = attempts[attempts.length - 1] ?? null;
  const isActive = phase === 'waiting' || phase === 'active';

  if (phase === 'complete' && averageMs !== null) {
    return <SummaryPanel averageMs={averageMs} attempts={attempts} onReset={resetTest} />;
  }

  return (
    <div className="game-layout">
      {/* Game Screen */}
      <GameScreen phase={phase} onClick={handleScreenClick} />

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-eyebrow">REACTION TIME</p>
          <p className="sidebar-title">Attempt {Math.min(currentAttemptNumber, TOTAL)} of {TOTAL}</p>
          <div className="progress-row">
            {Array.from({length: TOTAL}).map((_, i) => (
              <div key={i} className={`prog-bar ${i < valid.length ? 'done' : i === valid.length ? 'active-bar' : ''}`} />
            ))}
          </div>
        </div>

        <div className="sidebar-body">
          {attempts.length === 0 ? (
            <>
              <p className="instr-label">HOW IT WORKS</p>
              <div className="instr-step"><span className="instr-n">1.</span><span>Click <strong>Start Test</strong> below.</span></div>
              <div className="instr-step"><span className="instr-n">2.</span><span>Screen turns <span style={{color:'#fca5a5'}}>red</span> — wait.</span></div>
              <div className="instr-step"><span className="instr-n">3.</span><span>Click the instant it turns <span style={{color:'#86efac'}}>green</span>.</span></div>
              <div className="instr-step"><span className="instr-n">4.</span><span>5 valid attempts → your average.</span></div>
              <hr className="instr-divider" />
              <p className="instr-label">EDGE CASES</p>
              <p className="edge-item">• Clicking on <span style={{color:'#fca5a5'}}>red</span> = disqualified</p>
              <p className="edge-item">• Early clicks shown in <span style={{color:'#93c5fd'}}>blue</span></p>
              <p className="edge-item">• Only green-clicks count toward average</p>
            </>
          ) : (
            <>
              <p className="instr-label">RESULTS</p>
              {attempts.map((a, i) => (
                <ResultCard key={i} attempt={a} isCurrent={i === attempts.length - 1} />
              ))}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {phase === 'idle' && (
            <button className="cta-btn green" onClick={startTest}>START TEST</button>
          )}
          {isActive && (
            <p className="cta-hint">{phase === 'waiting' ? 'WATCH THE SCREEN →' : 'CLICK THE SCREEN →'}</p>
          )}
          {phase === 'early' && (
            <>
              <p className="early-notice">← Clicked too early. Doesn't count.</p>
              <button className="cta-btn blue" onClick={startTest}>TRY AGAIN</button>
            </>
          )}
          {phase === 'result' && (
            <>
              {last && !last.isEarly && (
                <div className="result-readout">
                  <span className="result-big">{last.reactionMs}</span>
                  <span className="result-unit">ms</span>
                </div>
              )}
              <button className="cta-btn neutral" onClick={startTest}>
                NEXT ATTEMPT ({valid.length}/{TOTAL})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
