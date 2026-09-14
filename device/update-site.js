const fs = require('node:fs');
const path = require('node:path');

const inputPath = process.argv[2];
const outputDir = process.argv[3] || 'output';
if (!inputPath) {
  console.error('사용법: node update-site.js <records.csv|ritual-history.json> [output-dir]');
  process.exit(1);
}

function splitCSV(line) {
  const fields = []; let field = ''; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === ',' && !quoted) { fields.push(field.trim()); field = ''; }
    else field += character;
  }
  fields.push(field.trim());
  return fields;
}

const raw = fs.readFileSync(inputPath, 'utf8');
let sourceType = 'CSV';
let records;
if (path.extname(inputPath).toLowerCase() === '.json') {
  let payload;
  try { payload = JSON.parse(raw); } catch { throw new Error('JSON 형식을 읽을 수 없습니다.'); }
  if (!payload || !Array.isArray(payload.days) || !payload.days.length) throw new Error('days 배열이 있는 리추얼 JSON이 필요합니다.');
  if (payload.peerNamesMasked === false) throw new Error('동료 이름이 마스킹되지 않은 파일은 사용할 수 없습니다.');
  sourceType = 'Ritual JSON';
  const extractEvidence = (day) => {
    const lines = [...(Array.isArray(day.open) ? day.open : []), ...(Array.isArray(day.close) ? day.close : [])];
    const preferred = lines.find((line) => /오늘의 첫 행동/.test(line)) || lines.find((line) => /강점 행동/.test(line)) || lines.find((line) => /그 결과·알게 된 점/.test(line));
    return preferred ? preferred.replace(/^[^:]+:\s*/, '') : '기록 내용 확인';
  };
  records = payload.days.map((day, index) => ({ week: index + 1, date: day.date || '', attendance: null, ritual: Array.isArray(day.close) && day.close.length > 0 ? 1 : 0, submission: null, evidence: extractEvidence(day) }));
} else {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('헤더와 데이터 행이 필요합니다.');
  const headers = splitCSV(lines[0]).map((header) => header.toLowerCase());
  const required = ['week', 'attendance', 'ritual', 'submission', 'evidence'];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`필수 열이 없습니다: ${missing.join(', ')}`);
  records = lines.slice(1).map((line) => {
    const values = splitCSV(line); const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    ['week', 'attendance', 'ritual', 'submission'].forEach((key) => { row[key] = Number(row[key]); });
    if (!Number.isFinite(row.week) || ![0, 1].includes(row.attendance) || ![0, 1].includes(row.ritual) || ![0, 1].includes(row.submission) || !row.evidence) throw new Error(`잘못된 기록: ${line}`);
    return row;
  }).sort((a, b) => a.week - b.week);
}

const total = records.length;
const numericTotal = (key) => records.filter((record) => Number.isFinite(record[key])).length;
const sum = (key) => records.filter((record) => Number.isFinite(record[key])).reduce((value, record) => value + record[key], 0);
const pct = (key) => (numericTotal(key) ? Math.round((sum(key) / numericTotal(key)) * 100) : null);
const first = records.find((record) => record.attendance === 1 || record.ritual === 1);
const collaborative = records.find((record) => /동료|함께|설명|질문|교차/.test(record.evidence));
const persistent = records.find((record) => record.ritual === 1 && (record.submission === 1 || record.submission === null));
const candidates = [
  first && ['자기조절력', `${first.date || `${first.week}주차`} 기록의 “${first.evidence}”를 통해 작은 단위로 확인하는 태도를 이어 갔습니다.`],
  collaborative && ['대인관계력', `${collaborative.date || `${collaborative.week}주차`} 기록의 “${collaborative.evidence}”처럼 시선을 나누어 문제를 더 빠르게 풀었습니다.`],
  persistent && ['자기동기력', `${persistent.date || `${persistent.week}주차`} 기록의 “${persistent.evidence}”를 바탕으로 루틴과 제출을 끝까지 연결했습니다.`],
].filter(Boolean).map(([skill, sentence]) => ({ skill, sentence }));

const output = { generatedAt: 'deterministic', sourceType, records: total, metrics: { attendanceRate: pct('attendance'), ritualRate: pct('ritual'), submissionRate: pct('submission') }, candidates };
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'last-result.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'paragraph-candidates.md'), `# 문단 후보\n\n${candidates.map((candidate) => `- **${candidate.skill}** ${candidate.sentence}`).join('\n')}\n`, 'utf8');
const format = (value) => value === null ? '입력 없음' : `${value}%`;
console.log(`완료: ${total}${sourceType === 'Ritual JSON' ? '일' : '주'} · ${format(output.metrics.attendanceRate)} 출석 · ${format(output.metrics.ritualRate)} 리추얼 · ${format(output.metrics.submissionRate)} 제출`);
