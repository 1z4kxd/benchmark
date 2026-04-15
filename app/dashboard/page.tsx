'use client';

import Link from 'next/link';
import { useScoreStore, calculateGrade, reactionGrade } from '@/lib/store/scoreStore';

export default function DashboardPage() {
  const { scores, clearScores } = useScoreStore();
  const grade = calculateGrade(scores);
  const hasAnyScore = scores.reactionTime !== null || scores.sequenceMemory !== null || scores.chimpTest !== null;

  return (
    <div className="dashboard fade-in">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <p className="dashboard-eyebrow">PERFORMANCE DASHBOARD</p>
        <h1 className="dashboard-title">Your Results</h1>
        <p className="dashboard-sub">
          Scores are saved for this session. Play any game to populate your dashboard.
        </p>
      </div>

      {/* ── Overall Grade ── */}
      {grade ? (
        <div className="grade-card fade-in">
          <div className="grade-emoji">{grade.emoji}</div>
          <div className="grade-info">
            <p className="grade-label">OVERALL PERFORMANCE GRADE</p>
            <p className="grade-title" style={{ color: grade.color }}>{grade.title}</p>
            <p className="grade-desc">{grade.description}</p>
          </div>
          <div className="grade-score-badge">
            <span className="grade-score-num" style={{ color: grade.color }}>{grade.score}</span>
            <span className="grade-score-label">/ 100</span>
          </div>
        </div>
      ) : (
        <div className="no-scores-banner">
          <p>You haven't played any games yet. Complete at least one test to see your overall grade.</p>
          <div className="no-scores-links">
            <Link href="/reaction-time" className="no-scores-link">REACTION TIME →</Link>
            <Link href="/sequence-memory" className="no-scores-link">SEQUENCE MEMORY →</Link>
            <Link href="/chimp-test" className="no-scores-link">CHIMP TEST →</Link>
          </div>
        </div>
      )}

      {/* ── Per-Game Stats ── */}
      <p className="section-label">GAME BREAKDOWN</p>
      <div className="game-stat-grid">

        {/* Reaction Time */}
        <div className={`game-stat-card ${scores.reactionTime === null ? 'no-data' : ''}`}>
          <div className="game-stat-top">
            <div className="game-stat-name">
              <div className="game-stat-dot" style={{ background: '#16a34a' }} />
              <span className="game-stat-title">Reaction Time</span>
            </div>
            {scores.reactionTime !== null && (() => {
              const g = reactionGrade(scores.reactionTime);
              return (
                <span className="game-stat-badge" style={{ color: g.color, borderColor: g.color }}>
                  {g.label}
                </span>
              );
            })()}
          </div>

          {scores.reactionTime !== null ? (
            <>
              <div>
                <span className="game-stat-score" style={{ color: reactionGrade(scores.reactionTime).color }}>
                  {scores.reactionTime}
                </span>
                <span className="game-stat-unit">ms</span>
              </div>
              <p className="game-stat-sublabel">Average over 5 attempts</p>
              <div className="game-stat-meta">
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">HUMAN AVG</span>
                  <span className="game-stat-meta-val">284ms</span>
                </div>
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">VS AVERAGE</span>
                  <span className="game-stat-meta-val" style={{
                    color: scores.reactionTime < 284 ? '#16a34a' : '#dc2626'
                  }}>
                    {scores.reactionTime < 284
                      ? `${284 - scores.reactionTime}ms faster`
                      : `${scores.reactionTime - 284}ms slower`}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="game-stat-empty">No score recorded yet.</p>
              <Link href="/reaction-time" className="game-stat-play-link">PLAY NOW →</Link>
            </>
          )}
        </div>

        {/* Sequence Memory */}
        <div className={`game-stat-card ${scores.sequenceMemory === null ? 'no-data' : ''}`}>
          <div className="game-stat-top">
            <div className="game-stat-name">
              <div className="game-stat-dot" style={{ background: '#2563eb' }} />
              <span className="game-stat-title">Sequence Memory</span>
            </div>
            {scores.sequenceMemory !== null && (
              <span className="game-stat-badge" style={{
                color: scores.sequenceMemory >= 12 ? '#7c3aed' :
                       scores.sequenceMemory >= 9  ? '#16a34a' :
                       scores.sequenceMemory >= 6  ? '#d97706' : '#dc2626',
                borderColor: scores.sequenceMemory >= 12 ? '#7c3aed' :
                             scores.sequenceMemory >= 9  ? '#16a34a' :
                             scores.sequenceMemory >= 6  ? '#d97706' : '#dc2626',
              }}>
                {scores.sequenceMemory >= 12 ? 'ELITE' :
                 scores.sequenceMemory >= 9  ? 'GOOD' :
                 scores.sequenceMemory >= 6  ? 'AVERAGE' : 'NOVICE'}
              </span>
            )}
          </div>

          {scores.sequenceMemory !== null ? (
            <>
              <div>
                <span className="game-stat-score" style={{ color: '#2563eb' }}>
                  {scores.sequenceMemory}
                </span>
                <span className="game-stat-unit">levels</span>
              </div>
              <p className="game-stat-sublabel">Highest level reached</p>
              <div className="game-stat-meta">
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">HUMAN AVG</span>
                  <span className="game-stat-meta-val">8 levels</span>
                </div>
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">VS AVERAGE</span>
                  <span className="game-stat-meta-val" style={{
                    color: scores.sequenceMemory >= 8 ? '#16a34a' : '#dc2626'
                  }}>
                    {scores.sequenceMemory >= 8
                      ? `+${scores.sequenceMemory - 8} levels`
                      : `${scores.sequenceMemory - 8} levels`}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="game-stat-empty">No score recorded yet.</p>
              <Link href="/sequence-memory" className="game-stat-play-link">PLAY NOW →</Link>
            </>
          )}
        </div>

        {/* Chimp Test */}
        <div className={`game-stat-card ${scores.chimpTest === null ? 'no-data' : ''}`}>
          <div className="game-stat-top">
            <div className="game-stat-name">
              <div className="game-stat-dot" style={{ background: '#7c3aed' }} />
              <span className="game-stat-title">Chimp Test</span>
            </div>
            {scores.chimpTest !== null && (
              <span className="game-stat-badge" style={{
                color: scores.chimpTest >= 10 ? '#7c3aed' :
                       scores.chimpTest >= 8  ? '#16a34a' :
                       scores.chimpTest >= 6  ? '#d97706' : '#dc2626',
                borderColor: scores.chimpTest >= 10 ? '#7c3aed' :
                             scores.chimpTest >= 8  ? '#16a34a' :
                             scores.chimpTest >= 6  ? '#d97706' : '#dc2626',
              }}>
                {scores.chimpTest >= 10 ? 'CHIMP LEVEL' :
                 scores.chimpTest >= 8  ? 'GOOD' :
                 scores.chimpTest >= 6  ? 'AVERAGE' : 'NOVICE'}
              </span>
            )}
          </div>

          {scores.chimpTest !== null ? (
            <>
              <div>
                <span className="game-stat-score" style={{ color: '#7c3aed' }}>
                  {scores.chimpTest}
                </span>
                <span className="game-stat-unit">numbers</span>
              </div>
              <p className="game-stat-sublabel">Highest count reached</p>
              <div className="game-stat-meta">
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">HUMAN AVG</span>
                  <span className="game-stat-meta-val">7 numbers</span>
                </div>
                <div className="game-stat-meta-item">
                  <span className="game-stat-meta-label">CHIMP RECORD</span>
                  <span className="game-stat-meta-val">9+ numbers</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="game-stat-empty">No score recorded yet.</p>
              <Link href="/chimp-test" className="game-stat-play-link">PLAY NOW →</Link>
            </>
          )}
        </div>
      </div>

      {/* ── Tips ── */}
      <p className="section-label">PERFORMANCE TIPS</p>
      <div className="tips-grid" style={{ marginBottom: 36 }}>
        {[
          { icon: '😴', title: 'Sleep matters', text: 'Reaction time improves by up to 15% after a full night of sleep. Test when rested.' },
          { icon: '☕', title: 'Caffeine helps', text: 'A moderate dose of caffeine (~200mg) measurably improves reaction time for 3–4 hours.' },
          { icon: '🎮', title: 'Practice effect', text: 'Repeated testing leads to real improvement. Sequence memory can be trained significantly.' },
          { icon: '👀', title: 'Watch, don\'t predict', text: 'In the Chimp Test, don\'t move your eyes — use peripheral vision to catch all numbers at once.' },
        ].map(tip => (
          <div className="tip-card" key={tip.title}>
            <div className="tip-icon">{tip.icon}</div>
            <p className="tip-title">{tip.title.toUpperCase()}</p>
            <p className="tip-text">{tip.text}</p>
          </div>
        ))}
      </div>

      {/* ── Reset ── */}
      {hasAnyScore && (
        <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button
            className="cta-btn neutral"
            style={{ maxWidth: 200, margin: '0 auto' }}
            onClick={clearScores}
          >
            CLEAR SESSION
          </button>
          <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8, fontFamily: 'Arial, sans-serif' }}>
            Scores are session-only. Sign in (Phase 4) to save permanently.
          </p>
        </div>
      )}
    </div>
  );
}
