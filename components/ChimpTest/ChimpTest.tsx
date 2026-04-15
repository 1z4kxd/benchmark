'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useChimpTestStore } from '@/lib/store/chimpTestStore';
import { useScoreStore } from '@/lib/store/scoreStore';
import ChimpGrid from './ChimpGrid';

export default function ChimpTest() {
  const { phase, level, squares, nextExpected, wrongIndex, bestLevel, startGame, handleSquareClick, resetGame } = useChimpTestStore();
  const { setChimpTest } = useScoreStore();
  const savedRef = useRef(false);
  const isIdle = phase === 'idle';
  const isWrong = phase === 'wrong';
  const isMemorize = phase === 'memorize';

  useEffect(() => {
    if (phase === 'wrong' && !savedRef.current && level > 4) {
      setChimpTest(level - 1);
      savedRef.current = true;
    }
    if (phase === 'idle') savedRef.current = false;
  }, [phase, level, setChimpTest]);

  return (
    <div className="chimp-layout">
      <div className="chimp-game-area">
        <div className="seq-phase-header">
          {isIdle && <p className="seq-phase-label" style={{color:'var(--text-muted)'}}>READY WHEN YOU ARE</p>}
          {isMemorize && <p className="seq-phase-label" style={{color:'var(--amber)'}}>MEMORIZE — CLICK 1 FIRST</p>}
          {phase === 'recall' && <p className="seq-phase-label" style={{color:'var(--green)'}}>CLICK IN ORDER: {nextExpected}</p>}
          {phase === 'correct' && <p className="seq-phase-label" style={{color:'var(--green)'}}>CORRECT! ✓</p>}
          {isWrong && <p className="seq-phase-label" style={{color:'var(--red)'}}>WRONG!</p>}
        </div>

        {!isIdle && (
          <div className="seq-level-display">
            <span className="seq-level-num">{isWrong ? level - 1 : level}</span>
            <span className="seq-level-label">NUMBERS</span>
          </div>
        )}

        {!isIdle ? (
          <ChimpGrid phase={phase} squares={squares} nextExpected={nextExpected} wrongIndex={wrongIndex} onSquareClick={handleSquareClick} />
        ) : (
          <div className="chimp-idle-preview">
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} className={`chimp-cell ${i < 4 ? 'chimp-active' : 'empty'}`}>
                {i < 4 && <span className="chimp-number">{i + 1}</span>}
              </div>
            ))}
          </div>
        )}

        {isWrong && (
          <div className="seq-gameover fade-in">
            <p className="seq-gameover-label">GAME OVER</p>
            <p className="seq-gameover-score">You reached <strong>{level - 1} numbers</strong></p>
            {bestLevel > 0 && <p className="seq-gameover-best">Session best: {bestLevel} numbers</p>}
            <div className="seq-gameover-actions" style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button className="cta-btn green" onClick={resetGame} style={{maxWidth:180}}>PLAY AGAIN</button>
              <Link href="/dashboard" className="cta-btn neutral" style={{maxWidth:180,textDecoration:'none',textAlign:'center',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>DASHBOARD</Link>
            </div>
          </div>
        )}

        {isIdle && (
          <div style={{marginTop:32}}>
            <button className="cta-btn green" onClick={startGame} style={{maxWidth:200}}>START GAME</button>
          </div>
        )}
      </div>

      <div className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-eyebrow">CHIMP TEST</p>
          <p className="sidebar-title">
            {isIdle ? 'Ready' : isMemorize ? `${level} numbers — Memorize` : phase === 'recall' ? `Click ${nextExpected} of ${level}` : phase === 'correct' ? 'Round complete!' : `Game Over — ${level - 1} numbers`}
          </p>
          {!isIdle && (
            <div className="progress-row" style={{marginTop:14}}>
              {Array.from({length: Math.min(level + 2, 20)}).map((_, i) => (
                <div key={i} className={`prog-bar ${i < level - 1 ? 'done' : i === level - 1 ? 'active-bar' : ''}`} />
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-body">
          {isIdle ? (
            <>
              <p className="instr-label">HOW IT WORKS</p>
              <div className="instr-step"><span className="instr-n">1.</span><span>Numbers appear on a grid. Memorize their positions.</span></div>
              <div className="instr-step"><span className="instr-n">2.</span><span>Click <strong>1</strong> — all numbers disappear.</span></div>
              <div className="instr-step"><span className="instr-n">3.</span><span>Click blank squares in order: 2, 3, 4...</span></div>
              <div className="instr-step"><span className="instr-n">4.</span><span>Each round adds one more number.</span></div>
              <hr className="instr-divider" />
              <p className="instr-label">DID YOU KNOW?</p>
              <p className="edge-item">• Chimps outperform humans on this test</p>
              <p className="edge-item">• Average human reaches 7–9 numbers</p>
              <p className="edge-item">• Ayumu the chimp scored 9+ consistently</p>
            </>
          ) : (
            <>
              <p className="instr-label">CURRENT GAME</p>
              <div className="seq-stat-row"><span className="seq-stat-label">NUMBERS</span><span className="seq-stat-val">{isWrong ? level - 1 : level}</span></div>
              <div className="seq-stat-row"><span className="seq-stat-label">NEXT TO CLICK</span><span className="seq-stat-val" style={{color:'var(--green)'}}>{phase === 'recall' ? nextExpected : isMemorize ? 1 : '—'}</span></div>
              <div className="seq-stat-row"><span className="seq-stat-label">SESSION BEST</span><span className="seq-stat-val" style={{color:'var(--green)'}}>{bestLevel > 0 ? `${bestLevel} numbers` : '—'}</span></div>
              <hr className="instr-divider" />
              <p className="instr-label">{isMemorize ? 'MEMORIZE THESE' : 'CLICK IN ORDER'}</p>
              <div className="chimp-number-list">
                {squares.sort((a, b) => a.value - b.value).map(sq => {
                  const isClicked = phase === 'recall' && sq.visible;
                  const isNext = phase === 'recall' && sq.value === nextExpected;
                  const isMissed = isWrong && sq.index === wrongIndex;
                  return (
                    <div key={sq.value} className={`chimp-number-item ${isClicked ? 'done' : isNext ? 'next' : isMissed ? 'wrong' : ''}`}>
                      <span className="chimp-num-val">{sq.value}</span>
                      <span className="chimp-num-status">{isClicked ? '✓' : isNext ? '←' : isMissed ? '✗' : '·'}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {isWrong ? null : (
            <button className={isIdle ? 'cta-btn green' : 'cta-btn neutral'} onClick={isIdle ? startGame : resetGame}>
              {isIdle ? 'START GAME' : 'RESTART'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
