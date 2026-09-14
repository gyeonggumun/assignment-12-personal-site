const exampleCSV = `week,date,attendance,ritual,submission,evidence
1,2026-05-04,1,1,0,교육장 환경 세팅
2,2026-05-11,1,1,1,오류 원인 분해
3,2026-05-18,1,1,1,작은 단위 검증
4,2026-05-25,1,0,1,동료와 로그 교차 검증
5,2026-06-01,1,1,1,라우팅 과제 제출
6,2026-06-08,0,1,1,화이트보드로 데이터 흐름 설명
7,2026-06-15,1,1,0,아침 루틴 유지
8,2026-06-22,1,1,1,과제 마감까지 반복
9,2026-06-29,1,1,1,동료 포트 설정 함께 확인
10,2026-07-06,1,0,1,실습 결과 정리
11,2026-07-13,1,1,1,새로운 문제 재시도
12,2026-07-20,1,1,1,먼저 질문하고 설명
13,2026-07-27,1,1,1,제출 현황 점검`;

const input = document.querySelector('#records-input');
const exampleButton = document.querySelector('#load-example');
const generateButton = document.querySelector('#generate');
const status = document.querySelector('#tool-status');
const result = document.querySelector('#generated-result');
const metricGrid = document.querySelector('#metric-grid');

function splitCSV(line) {
  const fields = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];
    if (character === '"') {
      if (quoted && line[i + 1] === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (character === ',' && !quoted) {
      fields.push(field.trim()); field = '';
    } else field += character;
  }
  fields.push(field.trim());
  return fields;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('헤더와 데이터 행을 모두 입력해 주세요.');
  const headers = splitCSV(lines[0]).map((header) => header.toLowerCase());
  const required = ['week', 'attendance', 'ritual', 'submission', 'evidence'];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`필수 열이 없습니다: ${missing.join(', ')}`);
  return lines.slice(1).map((line, index) => {
    const values = splitCSV(line);
    const row = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] || '']));
    const numeric = ['week', 'attendance', 'ritual', 'submission'];
    numeric.forEach((key) => { row[key] = Number(row[key]); });
    if (!Number.isFinite(row.week) || ![0, 1].includes(row.attendance) || ![0, 1].includes(row.ritual) || ![0, 1].includes(row.submission)) {
      throw new Error(`${index + 2}행의 week/attendance/ritual/submission 값을 확인해 주세요.`);
    }
    if (!row.evidence) throw new Error(`${index + 2}행의 evidence를 입력해 주세요.`);
    return row;
  }).sort((a, b) => a.week - b.week);
}

function percent(value, total) {
  return total ? `${Math.round((value / total) * 100)}%` : '입력 대기';
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function buildCandidates(records) {
  const candidates = [];
  const first = records.find((record) => record.attendance === 1);
  const collaborative = records.find((record) => /동료|함께|설명|질문|교차/.test(record.evidence));
  const persistent = records.find((record) => record.ritual === 1 && record.submission === 1);
  if (first) candidates.push({ skill: '자기조절력', text: `${first.date || `${first.week}주차`} 기록의 “${first.evidence}”를 통해 작은 단위로 확인하는 태도를 이어 갔습니다.` });
  if (collaborative) candidates.push({ skill: '대인관계력', text: `${collaborative.date || `${collaborative.week}주차`} 기록의 “${collaborative.evidence}”처럼 시선을 나누어 문제를 더 빠르게 풀었습니다.` });
  if (persistent) candidates.push({ skill: '자기동기력', text: `${persistent.date || `${persistent.week}주차`} 기록의 “${persistent.evidence}”를 바탕으로 루틴과 제출을 끝까지 연결했습니다.` });
  return candidates;
}

function renderRecords(records) {
  const total = records.length;
  const attendance = records.reduce((sum, record) => sum + record.attendance, 0);
  const ritual = records.reduce((sum, record) => sum + record.ritual, 0);
  const submission = records.reduce((sum, record) => sum + record.submission, 0);
  metricGrid.innerHTML = `
    <article class="metric-card"><span class="metric-value">${percent(attendance, total)}</span><h3>회복탄력성</h3><p>출처: 내 출석 기록 · ${attendance}/${total}주</p></article>
    <article class="metric-card"><span class="metric-value">${percent(submission, total)}</span><h3>과제지속력</h3><p>출처: 내 제출 현황 · ${submission}/${total}주</p></article>
    <article class="metric-card metric-card-accent"><span class="metric-value">${total}주</span><h3>기록 범위</h3><p>출처: 내 리추얼 기록 · ${ritual}/${total}주 작성</p></article>`;
  const candidates = buildCandidates(records);
  result.innerHTML = `<h3>검토용 결과 · ${total}개 행</h3><div class="result-metrics"><span><b>${percent(attendance, total)}</b>출석</span><span><b>${percent(ritual, total)}</b>리추얼</span><span><b>${percent(submission, total)}</b>제출</span></div>${candidates.map((candidate) => `<p class="candidate"><strong>${escapeHTML(candidate.skill)}</strong> · ${escapeHTML(candidate.text)}</p>`).join('') || '<p class="candidate">역량 후보를 만들려면 evidence 내용을 입력해 주세요.</p>'}`;
  result.hidden = false;
  status.textContent = '같은 CSV를 다시 넣으면 같은 결과가 생성됩니다. 실제 제출 전 날짜와 출처를 확인하세요.';
}

exampleButton?.addEventListener('click', () => {
  input.value = exampleCSV;
  status.textContent = '예시 데이터가 들어갔습니다. 실제 13주 기록으로 교체한 뒤 결과를 만드세요.';
  input.focus();
});

generateButton?.addEventListener('click', () => {
  try { renderRecords(parseCSV(input.value)); }
  catch (error) { result.hidden = true; status.textContent = error.message; }
});
