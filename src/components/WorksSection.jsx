import SectionHeader from './SectionHeader';

export default function WorksSection() {
  return (
    <section className="works section-shell" id="works" aria-labelledby="works-title">
      <SectionHeader eyebrow="04 · SELECTED WORKS" title={<>생각을 실험으로,<br />실험을 도구로</>} description="문제를 관찰하고, 근거를 정리하고, 다음 사람이 쓸 수 있는 형태로 남깁니다." />
      <div className="work-grid">
        <article className="work-card work-featured">
          <div className="work-number">10</div>
          <div className="work-card-body">
            <p className="card-kicker">RESEARCH PAPER · LIVE</p>
            <h3>긍정적 회고와<br />다음 날 자기효능감</h3>
            <p>대학생의 14일 일상기록을 위한 문헌고찰 및 반복측정 연구계획. 가설·측정·분석·윤리 기준을 실제 앱 요구사항으로 번역했습니다.</p>
            <a className="arrow-link" href="https://positive-reflection-research-paper.vercel.app/" target="_blank" rel="noreferrer">논문 웹사이트 열기 <span>↗</span></a>
          </div>
          <span className="work-corner-mark">↗</span>
        </article>
        <article className="work-card work-placeholder">
          <div className="work-number">13</div>
          <div className="work-card-body">
            <p className="card-kicker">APP · RESERVED</p>
            <h3>긍정적 회고<br />기록 앱</h3>
            <p>13번 과제 완료 후 연결할 자리입니다. 로그인 없이 개인 기록을 안전하게 남기는 MVP를 설계합니다.</p>
            <span className="status-chip">제작 예정</span>
          </div>
          <span className="work-corner-mark">+</span>
        </article>
      </div>
    </section>
  );
}
