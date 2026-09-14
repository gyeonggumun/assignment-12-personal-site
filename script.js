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
const fileInput = document.querySelector('#records-file');
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

function extractJSONEvidence(day) {
  const lines = [...(Array.isArray(day.open) ? day.open : []), ...(Array.isArray(day.close) ? day.close : [])];
  const preferred = lines.find((line) => /오늘의 첫 행동/.test(line)) || lines.find((line) => /강점 행동/.test(line)) || lines.find((line) => /그 결과·알게 된 점/.test(line));
  return preferred ? preferred.replace(/^[^:]+:\s*/, '') : '기록 내용 확인';
}

function parseRitualJSON(text) {
  let payload;
  try { payload = JSON.parse(text); } catch { throw new Error('JSON 형식을 읽을 수 없습니다.'); }
  if (!payload || !Array.isArray(payload.days) || !payload.days.length) throw new Error('days 배열이 있는 리추얼 JSON을 선택해 주세요.');
  if (payload.peerNamesMasked === false) throw new Error('동료 이름이 마스킹되지 않은 파일은 사용할 수 없습니다.');
  return payload.days.map((day, index) => ({
    week: index + 1,
    date: day.date || '',
    attendance: null,
    ritual: Array.isArray(day.close) && day.close.length > 0 ? 1 : 0,
    submission: null,
    evidence: extractJSONEvidence(day),
  }));
}

function parseInput(text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('CSV 또는 JSON 내용을 입력해 주세요.');
  return trimmed.startsWith('{') || trimmed.startsWith('[')
    ? { records: parseRitualJSON(trimmed), source: 'Ritual JSON' }
    : { records: parseCSV(trimmed), source: 'CSV' };
}

function percent(value, total) {
  return Number.isFinite(value) && total ? `${Math.round((value / total) * 100)}%` : '입력 대기';
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function buildCandidates(records) {
  const candidates = [];
  const first = records.find((record) => record.attendance === 1 || record.ritual === 1);
  const collaborative = records.find((record) => /동료|함께|설명|질문|교차/.test(record.evidence));
  const persistent = records.find((record) => record.ritual === 1 && (record.submission === 1 || record.submission === null));
  if (first) candidates.push({ skill: '자기조절력', text: `${first.date || `${first.week}주차`} 기록의 “${first.evidence}”를 통해 작은 단위로 확인하는 태도를 이어 갔습니다.` });
  if (collaborative) candidates.push({ skill: '대인관계력', text: `${collaborative.date || `${collaborative.week}주차`} 기록의 “${collaborative.evidence}”처럼 시선을 나누어 문제를 더 빠르게 풀었습니다.` });
  if (persistent) candidates.push({ skill: '자기동기력', text: `${persistent.date || `${persistent.week}주차`} 기록의 “${persistent.evidence}”를 바탕으로 루틴과 제출을 끝까지 연결했습니다.` });
  return candidates;
}

function renderRecords({ records, source }) {
  const total = records.length;
  const attendance = records.filter((record) => Number.isFinite(record.attendance)).reduce((sum, record) => sum + record.attendance, 0);
  const ritual = records.filter((record) => Number.isFinite(record.ritual)).reduce((sum, record) => sum + record.ritual, 0);
  const submission = records.filter((record) => Number.isFinite(record.submission)).reduce((sum, record) => sum + record.submission, 0);
  const attendanceTotal = records.filter((record) => Number.isFinite(record.attendance)).length;
  const ritualTotal = records.filter((record) => Number.isFinite(record.ritual)).length;
  const submissionTotal = records.filter((record) => Number.isFinite(record.submission)).length;
  const unit = source === 'Ritual JSON' ? '일' : '주';
  metricGrid.innerHTML = `
    <article class="metric-card"><span class="metric-value">${percent(attendance, attendanceTotal)}</span><h3>출석 기록</h3><p>출처: 내 출석 기록 · ${attendanceTotal ? `${attendance}/${attendanceTotal}${unit}` : 'JSON에 없음'}</p></article>
    <article class="metric-card"><span class="metric-value">${percent(submission, submissionTotal)}</span><h3>과제 제출</h3><p>출처: 내 제출 현황 · ${submissionTotal ? `${submission}/${submissionTotal}${unit}` : 'JSON에 없음'}</p></article>
    <article class="metric-card metric-card-accent"><span class="metric-value">${percent(ritual, ritualTotal)}</span><h3>리추얼 기록</h3><p>출처: ${source} · ${ritual}/${ritualTotal}${unit} 완료</p></article>`;
  const candidates = buildCandidates(records);
  result.innerHTML = `<h3>검토용 결과 · ${source} · ${total}개 기록</h3><div class="result-metrics"><span><b>${percent(attendance, attendanceTotal)}</b>출석</span><span><b>${percent(ritual, ritualTotal)}</b>리추얼</span><span><b>${percent(submission, submissionTotal)}</b>제출</span></div>${candidates.map((candidate) => `<p class="candidate"><strong>${escapeHTML(candidate.skill)}</strong> · ${escapeHTML(candidate.text)}</p>`).join('') || '<p class="candidate">역량 후보를 만들려면 evidence 내용을 입력해 주세요.</p>'}`;
  result.hidden = false;
  status.textContent = `같은 ${source}를 다시 넣으면 같은 결과가 생성됩니다. 실제 제출 전 날짜와 출처를 확인하세요.`;
}

exampleButton?.addEventListener('click', () => {
  input.value = exampleCSV;
  status.textContent = 'CSV 예시가 들어갔습니다. 실제 기록으로 교체한 뒤 결과를 만드세요.';
  input.focus();
});

fileInput?.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  try {
    input.value = await file.text();
    status.textContent = `${file.name}을(를) 불러왔습니다. 원문에 이름이 포함되지 않았는지 확인한 뒤 결과를 만드세요.`;
  } catch { status.textContent = '파일을 읽지 못했습니다. CSV 또는 JSON 파일을 다시 선택해 주세요.'; }
});

generateButton?.addEventListener('click', () => {
  try { renderRecords(parseInput(input.value)); }
  catch (error) { result.hidden = true; status.textContent = error.message; }
});
