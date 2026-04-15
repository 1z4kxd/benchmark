'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSequenceMemoryStore } from '@/lib/store/sequenceMemoryStore';
import { useScoreStore } from '@/lib/store/scoreStore';
import SequenceGrid from './SequenceGrid';

export default function SequenceMemoryTest() {
  const { phase, level, sequence, userInput, highlightedSquare, bestLevel, startGame, handleSquareClick, resetGame } = useSequenceMemoryStore();
  const { setSequenceMemory } = useScoreStore();
  const savedRef = useRef(false);
  const isIdle = phase === 'idle';

  useEffect(() => {
    if (phase === 'wrong' && !savedRef.current && level > 1) {
      setSequenceMemory(level - 1);
      savedRef.current = true;
    }
    if (phase === 'idle') savedRef.current = false;
  }, [phase, level, setSequenceMemory]);

  const progress = (phase === 'input' || phase === 'correct' || phase === 'wrong') ? userInput.length : 0;
  const total = sequence.length;

  return (
    <div className="seq-layout">
      <div className="seq-game-area">
        <div className="seq-phase-header">
          {isIdle && <p className="seq-phase-label" style={{color:'var(--text-muted)'}}>READY WHEN YOU ARE</p>}
          {phase === 'showing' && <p className="seq-phase-label" style={{color:'var(--blue)'}}>WATCH CAREFULLY</p>}
          {phase === 'input' && <p className="seq-phase-label" style={{color:'var(--green)'}}>YOUR TURN</p>}
          {phase === 'correct' && <p className="seq-phase-label" style={{color:'var(--green)'}}>CORRECT! ✓</p>}
          {phase === 'wrong' && <p className="seq-phase-label" style={{color:'var(--red)'}}>WRONG!</p>}
        </div>

        {!isIdle && (
          <div className="seq-level-display">
            <span className="seq-level-num">{level - (phase === 'wrong' ? 1 : 0)}</span>
            <span className="seq-level-label">LEVEL</span>
          </div>
        )}

        <SequenceGrid phase={phase} highlightedSquare={highlightedSquare} userInput={userInput} sequence={sequence} onSquareClick={handleSquareClick} />

        {(phase === 'input' || phase === 'correct') && total > 0 && (
          <div className="seq-progress-track">
            {Array.from({length: total}).map((_, i) => (
              <div key={i} className={`seq-progress-pip ${i < progress ? 'filled' : ''}`} />
            ))}
          </div>
        )}

        {phase === 'wrong' && (
          <div className="seq-gameover fade-in">
            <p className="seq-gameover-label">GAME OVER</p>
            <p className="seq-gameover-score">You reached <strong>level {level - 1}</strong></p>
            {bestLevel > 0 && <p className="seq-gameover-best">Session best: level {bestLevel}</p>}
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
          <p className="sidebar-eyebrow">SEQUENCE MEMORY</p>
          <p className="sidebar-title">
            {isIdle ? 'Ready' : phase === 'showing' ? `Level ${level} — Watch` : phase === 'input' ? `Level ${level} — Repeat` : phase === 'correct' ? `Level ${level} — Next up!` : `Game Over — Level ${level - 1}`}
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
              <div className="instr-step"><span className="instr-n">1.</span><span>Squares will flash in a sequence.</span></div>
              <div className="instr-step"><span className="instr-n">2.</span><span>Watch carefully — then repeat the exact order.</span></div>
              <div className="instr-step"><span className="instr-n">3.</span><span>Each round adds one more square.</span></div>
              <div className="instr-step"><span className="instr-n">4.</span><span>One wrong click ends the game.</span></div>
              <hr className="instr-divider" />
              <p className="instr-label">TIPS</p>
              <p className="edge-item">• Average person reaches level 8–10</p>
              <p className="edge-item">• Try to group squares mentally</p>
              <p className="edge-item">• Watch the whole pattern before clicking</p>
            </>
          ) : (
            <>
              <p className="instr-label">CURRENT GAME</p>
              <div className="seq-stat-row"><span className="seq-stat-label">LEVEL</span><span className="seq-stat-val">{phase === 'wrong' ? level - 1 : level}</span></div>
              <div className="seq-stat-row"><span className="seq-stat-label">SEQUENCE LENGTH</span><span className="seq-stat-val">{sequence.length}</span></div>
              <div className="seq-stat-row"><span className="seq-stat-label">SESSION BEST</span><span className="seq-stat-val" style={{color:'var(--green)'}}>{bestLevel > 0 ? `Level ${bestLevel}` : '—'}</span></div>
              {sequence.length > 0 && (
                <>
                  <hr className="instr-divider" />
                  <p className="instr-label">SEQUENCE</p>
                  <div className="seq-history">
                    {sequence.map((sq, i) => {
                      const userWrongHere = phase === 'wrong' && i === userInput.length - 1 && userInput[i] !== sq;
                      return (
                        <div key={i} className={`seq-history-item ${i < userInput.length ? (userWrongHere ? 'wrong' : 'done') : i === userInput.length ? 'current' : 'pending'}`}>
                          <span className="seq-history-step">#{i + 1}</span>
                          <span className="seq-history-square">{i < userInput.length || phase === 'wrong' ? `SQ ${sq + 1}` : '?'}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {phase === 'wrong' ? null : (
            <button className={isIdle ? 'cta-btn green' : 'cta-btn neutral'} onClick={isIdle ? startGame : resetGame}>
              {isIdle ? 'START GAME' : 'RESTART'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
