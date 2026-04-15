'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'REACTION TIME', href: '/reaction-time' },
  { label: 'SEQUENCE MEMORY', href: '/sequence-memory' },
  { label: 'CHIMP TEST', href: '/chimp-test' },
  { label: 'DASHBOARD', href: '/dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="navbar">
      <Link href="/" className="navbar-logo">
        <span className="pulse-dot" />
        HUMANBENCH
      </Link>
      <ul className="navbar-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={pathname === l.href ? 'active' : ''}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
