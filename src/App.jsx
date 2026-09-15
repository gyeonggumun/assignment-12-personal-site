import { useEffect, useState } from 'react';
import EvidenceSection from './components/EvidenceSection';
import HeroSection from './components/HeroSection';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import StorySection from './components/StorySection';
import WorksSection from './components/WorksSection';
import DocumentsSection from './components/DocumentsSection';

const observedSectionIds = ['story', 'evidence', 'works', 'documents', 'updater'];

function useActiveSection() {
  const [activeId, setActiveId] = useState('story');

  useEffect(() => {
    const sections = observedSectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveId(visibleEntry.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem('mg-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const activeId = useActiveSection();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('mg-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <SiteHeader activeId={activeId} theme={theme} onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} />
      <main>
        <HeroSection />
        <StorySection />
        <EvidenceSection />
        <WorksSection />
        <DocumentsSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
