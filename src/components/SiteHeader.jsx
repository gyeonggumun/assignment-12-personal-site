import { navItems } from '../data';

function SunIcon() {
  return <span aria-hidden="true">☼</span>;
}

function MoonIcon() {
  return <span aria-hidden="true">☾</span>;
}

export default function SiteHeader({ activeId, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="문경구 포트폴리오 첫 화면">
        MG<span>.</span>
      </a>
      <nav className="main-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <a className={activeId === item.id ? 'is-active' : ''} href={`#${item.id}`} key={item.id}>
            {item.label}
          </a>
        ))}
      </nav>
      <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="테마 전환">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </header>
  );
}
