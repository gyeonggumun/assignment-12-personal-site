import SectionHeader from './SectionHeader';
import { ritualHistory } from '../data';

function MetricCard({ value, label, source, accent }) {
  return (
    <article className={`metric-card${accent ? ' metric-card-accent' : ''}`}>
      <span className="metric-value">{value}</span>
      <h3>{label}</h3>
      <p>{source}</p>
    </article>
  );
}

export default function EvidenceSection() {
  const completedDays = ritualHistory.filter(([, complete]) => complete).length;

  return (
    <>
      <section className="evidence section-shell" id="evidence" aria-labelledby="evidence-title">
        <SectionHeader eyebrow="02 · EVIDENCE" title={<>말을 기록으로<br />확인하는 자리</>} description="회복탄력성과 과제지속력은 인상적인 문장이 아니라 확인 가능한 기록으로 보여 줍니다. 실제 13주 수치는 검증된 원자료를 연결한 뒤 공개합니다." />
        <div className="evidence-panel">
          <div className="metric-grid">
            <MetricCard value="입력 대기" label="회복탄력성" source="출처 · 내 리추얼 기록" />
            <MetricCard value="입력 대기" label="과제지속력" source="출처 · 내 제출 현황" />
            <MetricCard value="13주" label="검증 범위" source="출처 · 업로드 파일" accent />
          </div>
          <div className="evidence-pair">
            <div><span className="pair-label">SCENE ↔ SIGNAL</span><strong>2026년 5월 KVM 오류</strong></div>
            <p>문제를 하드웨어·BIOS·운영체제 단위로 쪼개 해결한 장면입니다. 실제 기록이 연결되면 이 장면 옆에 확인 가능한 수치를 함께 표시합니다.</p>
          </div>
        </div>
      </section>
      <section className="published-log section-shell" id="published-log" aria-labelledby="published-log-title">
        <div className="log-header-row">
          <SectionHeader eyebrow="03 · RITUAL HISTORY" title={<>오늘까지의<br />기록 흐름</>} description="2026년 9월 14일까지 업로드된 공개용 요약입니다. 원문 일기와 동료 정보는 제외했습니다." />
          <div className="log-stat"><strong>{completedDays}<span>/{ritualHistory.length}</span></strong><small>ritual days complete</small></div>
        </div>
        <div className="log-summary-grid">
          <article className="log-summary-card"><span>24일</span><h3>기록 기간</h3><p>2026.08.11–09.14</p></article>
          <article className="log-summary-card"><span>96%</span><h3>완료율</h3><p>완료 23일 / 전체 24일</p></article>
          <article className="log-summary-card log-summary-card-accent"><span>1일</span><h3>진행 중</h3><p>오늘 기록은 마감 전 상태</p></article>
        </div>
        <div className="ritual-timeline" aria-label="리추얼 날짜별 기록">
          {ritualHistory.map(([date, complete, highlight]) => (
            <article className={`log-row${complete ? '' : ' log-row-current'}`} key={date}>
              <div className="log-date"><time dateTime={date.replaceAll('.', '-')}>{date}</time><span className="log-status">{complete ? '완료' : '진행 중'}</span></div>
              <p>{highlight}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
