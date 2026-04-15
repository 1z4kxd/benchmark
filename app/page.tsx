import Link from 'next/link';

const GAMES = [
  { num: '01', href: '/reaction-time', dot: '#16a34a', title: 'Reaction Time', desc: 'Click the moment the screen turns green. Measures simple visual reaction.', stat: 'avg ~284ms' },
  { num: '02', href: '/sequence-memory', dot: '#2563eb', title: 'Sequence Memory', desc: 'Memorize an expanding sequence of squares. How many can you hold?', stat: 'avg ~8 levels' },
  { num: '03', href: '/chimp-test', dot: '#7c3aed', title: 'Chimp Test', desc: 'Click numbered squares in order after they disappear. Beat the chimps.', stat: 'avg ~7 numbers' },
  { num: '04', href: '/dashboard', dot: '#d97706', title: 'Dashboard', desc: 'View your scores, overall performance grade, and tips to improve.', stat: 'your results' },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <p className="home-eyebrow">COGNITIVE BENCHMARK SUITE</p>
      <h1 className="home-h1">MEASURE<br /><span className="dim">YOUR</span><br />MIND.</h1>
      <p className="home-sub">A suite of scientifically-grounded tests to benchmark your reaction speed, working memory, and cognitive performance.</p>
      <div className="game-cards">
        {GAMES.map(g => (
          <Link key={g.href} href={g.href} className="game-card">
            <p className="card-num">{g.num}</p>
            <div className="card-title-row">
              <div className="card-dot" style={{background: g.dot}} />
              <span className="card-title">{g.title}</span>
            </div>
            <p className="card-desc">{g.desc}</p>
            <div className="card-footer">
              <span className="card-stat">{g.stat}</span>
              <span className="card-cta">START →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
