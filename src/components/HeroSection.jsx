import { skills } from '../data';

export default function HeroSection() {
  return (
    <section className="hero section-shell" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">PORTFOLIO <span>·</span> ASSIGNMENT 12</p>
        <p className="hero-kicker"><span className="status-dot" /> AVAILABLE FOR A TEAM THAT BUILDS</p>
        <h1 id="hero-title">문경구</h1>
        <p className="hero-line">문제를 작게 나누고, 먼저 손을 내밀며, 팀과 함께 끝까지 완주하는 사람</p>
        <p className="hero-intro">시스템의 오류를 혼자 끌어안기보다 함께 나눌 때 더 빠르고 정확하게 풀린다는 사실을, 실제 구축과 협업의 장면으로 증명해 왔습니다.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#story">3분 이야기 읽기 <span aria-hidden="true">↓</span></a>
          <a className="text-link" href="self-introduction.html">자기소개서 읽기 <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-meta">
          <span>REACT + VITE</span>
          <span>GITHUB PAGES</span>
          <span>2026</span>
        </div>
      </div>
      <div className="hero-visual" aria-label="핵심 기록 요약">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-core">
          <span className="core-label">MY WORKING LOOP</span>
          <strong>Observe<br />→ Break down<br />→ Finish together</strong>
          <span className="core-mark">MG.</span>
        </div>
        <div className="floating-card floating-card-top"><span>RITUAL LOG</span><strong>23<span>/24</span></strong><small>96% complete</small></div>
        <div className="floating-card floating-card-bottom"><span>FIRST STEP</span><strong>+10<span> min</span></strong><small>early arrival routine</small></div>
      </div>
      <aside className="hero-skills" aria-label="핵심 역량 요약">
        {skills.map((skill) => (
          <div className={`skill-summary skill-${skill.tone}`} key={skill.name}>
            <span>{skill.number}</span>
            <div><strong>{skill.name}</strong><em>{skill.description}</em></div>
          </div>
        ))}
      </aside>
    </section>
  );
}
