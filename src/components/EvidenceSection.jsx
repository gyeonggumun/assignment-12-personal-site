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
  const totalDays = ritualHistory.length;
  const completionRate = Math.round((completedDays / totalDays) * 100);

  return (
    <>
      <section className="evidence section-shell" id="evidence" aria-labelledby="evidence-title">
        <SectionHeader eyebrow="02 · EVIDENCE" title={<>말을 기록으로<br />확인하는 자리</>} description="현재 공개 화면에는 검증된 리추얼 JSON의 24일 기록만 반영했습니다. 출석·제출 수치는 실제 13주 CSV를 확인한 뒤 추가합니다." />
        <div className="evidence-panel">
          <div className="metric-grid">
            <MetricCard value={`${totalDays}일`} label="리추얼 기록" source="출처 · 내 리추얼 기록" />
            <MetricCard value="입력 대기" label="출석 기록" source="출처 · 내 출석 기록" />
            <MetricCard value="입력 대기" label="제출 현황" source="출처 · 내 제출 현황" accent />
          </div>
          <div className="evidence-pair">
            <div><span className="pair-label">RITUAL ↔ PRACTICE</span><strong>휴식·경청·긍정적 소통의 반복</strong></div>
            <p>24일의 기록에서 휴식으로 컨디션을 조절하고, 동료의 이야기를 경청하며, 막힌 문제는 함께 풀어 갔습니다. 출석·제출 지표는 검증된 13주 CSV를 입력한 뒤 계산하며, 이 섹션은 원문 일기와 동료 정보 없이 행동 요약만 공개합니다.</p>
          </div>
        </div>
      </section>
      <section className="published-log section-shell" id="published-log" aria-labelledby="published-log-title">
        <div className="log-header-row">
          <SectionHeader eyebrow="03 · RITUAL HISTORY" title={<>오늘까지의<br />기록 흐름</>} description="2026년 9월 14일까지 업로드된 리추얼 JSON 공개 요약입니다. 원문 일기와 동료 정보는 제외했습니다." />
          <div className="log-stat"><strong>{completedDays}<span>/{ritualHistory.length}</span></strong><small>ritual days complete</small></div>
        </div>
        <div className="log-summary-grid">
          <article className="log-summary-card"><span>{totalDays}일</span><h3>공개 기록 기간</h3><p>내 리추얼 기록 · 2026.08.11–09.14</p></article>
          <article className="log-summary-card"><span>{completionRate}%</span><h3>리추얼 완료율</h3><p>내 리추얼 기록 · 완료 {completedDays}일 / 전체 {totalDays}일</p></article>
          <article className="log-summary-card log-summary-card-accent"><span>입력 대기</span><h3>출석·제출 지표</h3><p>검증된 13주 CSV 입력 후 표시</p></article>
        </div>
      </section>
    </>
  );
}
