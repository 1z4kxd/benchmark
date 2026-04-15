'use client';
import type { ReactionGamePhase } from '@/types';

const HEADLINES: Partial<Record<ReactionGamePhase, string>> = {
  waiting: 'Wait for green...',
  active: 'CLICK!',
  early: 'Too early.',
};
const SUBS: Partial<Record<ReactionGamePhase, string>> = {
  waiting: "Don't click yet.",
  active: 'Click as fast as you can.',
  early: 'Wait for the screen to turn green.',
};
const COLORS: Partial<Record<ReactionGamePhase, string>> = {
  waiting: '#f72626',
  active: '#27f171',
  early: '#2b89f5',
};

interface Props { phase: ReactionGamePhase; onClick: () => void; }

export default function GameScreen({ phase, onClick }: Props) {
  const clickable = phase === 'waiting' || phase === 'active';
  return (
    <button
      className="game-screen"
      data-phase={phase}
      onClick={clickable ? onClick : undefined}
      onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && clickable) { e.preventDefault(); onClick(); }}}
    >
      {HEADLINES[phase] && (
        <div style={{textAlign:'center'}}>
          <p className="screen-headline" style={{color: COLORS[phase]}}>{HEADLINES[phase]}</p>
          <p className="screen-sub">{SUBS[phase]}</p>
        </div>
      )}
      {phase === 'active' && (
        <p style={{position:'absolute',bottom:20,fontSize:10,letterSpacing:2,opacity:0.25}}>TAP ANYWHERE</p>
      )}
    </button>
  );
}
