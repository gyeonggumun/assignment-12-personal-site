export const exampleCSV = `week,date,attendance,ritual,submission,evidence
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

export function splitCSV(line) {
  const fields = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(field.trim());
      field = '';
    } else {
      field += character;
    }
  }

  fields.push(field.trim());
  return fields;
}

export function parseCSV(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('헤더와 데이터 행을 모두 입력해 주세요.');

  const headers = splitCSV(lines[0]).map((header) => header.toLowerCase());
  const required = ['week', 'attendance', 'ritual', 'submission', 'evidence'];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`필수 열이 없습니다: ${missing.join(', ')}`);

  return lines.slice(1).map((line, index) => {
    const values = splitCSV(line);
    const row = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] || '']));
    ['week', 'attendance', 'ritual', 'submission'].forEach((key) => { row[key] = Number(row[key]); });
    const isValid = Number.isFinite(row.week) && [0, 1].includes(row.attendance) && [0, 1].includes(row.ritual) && [0, 1].includes(row.submission) && row.evidence;
    if (!isValid) throw new Error(`${index + 2}행의 값을 확인해 주세요.`);
    return row;
  }).sort((first, second) => first.week - second.week);
}

function extractJSONEvidence(day) {
  if (day.evidence) return day.evidence;
  const lines = [...(Array.isArray(day.open) ? day.open : []), ...(Array.isArray(day.close) ? day.close : [])];
  const preferred = lines.find((line) => /오늘의 첫 행동/.test(line)) || lines.find((line) => /강점 행동/.test(line)) || lines.find((line) => /그 결과·알게 된 점/.test(line));
  return preferred ? preferred.replace(/^[^:]+:\s*/, '') : '기록 내용 확인';
}

export function parseRitualJSON(text) {
  let payload;
  try { payload = JSON.parse(text); } catch { throw new Error('JSON 형식을 읽을 수 없습니다.'); }
  if (!payload || !Array.isArray(payload.days) || !payload.days.length) throw new Error('days 배열이 있는 리추얼 JSON을 선택해 주세요.');
  if (payload.peerNamesMasked !== true) throw new Error('동료 이름이 마스킹된 JSON만 사용할 수 있습니다.');

  return payload.days.map((day, index) => ({
    week: index + 1,
    date: day.date || '',
    attendance: null,
    ritual: day.ritual === 1 || (Array.isArray(day.close) && day.close.length > 0) ? 1 : 0,
    submission: null,
    evidence: extractJSONEvidence(day),
  }));
}

export function parseInput(text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('CSV 또는 JSON 내용을 입력해 주세요.');
  return trimmed.startsWith('{') || trimmed.startsWith('[')
    ? { records: parseRitualJSON(trimmed), source: 'Ritual JSON' }
    : { records: parseCSV(trimmed), source: 'CSV' };
}

export function recordKey(record) {
  return record.date || `week:${record.week}`;
}

export function appendOnlyRecords(existing, incoming) {
  const seen = new Set(existing.map(recordKey));
  const additions = incoming.filter((record) => {
    const key = recordKey(record);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [...existing, ...additions];
}

function percentage(value, total) {
  return Number.isFinite(value) && total ? `${Math.round((value / total) * 100)}%` : '입력 없음';
}

export function summarizeRecords(records, source) {
  const metric = (key) => {
    const available = records.filter((record) => Number.isFinite(record[key]));
    const total = available.length;
    const sum = available.reduce((result, record) => result + record[key], 0);
    return { value: percentage(sum, total), count: total, sum };
  };

  return {
    total: records.length,
    unit: source.includes('Ritual JSON') ? '일' : '주',
    source,
    attendance: metric('attendance'),
    ritual: metric('ritual'),
    submission: metric('submission'),
  };
}

export function buildCandidates(records) {
  const collaborativePattern = /동료|함께|설명|질문|교차/;
  const first = records.find((record) => record.attendance === 1 || record.ritual === 1);
  const collaborative = records.find((record) => collaborativePattern.test(record.evidence));
  const persistent = records.find((record) => record.ritual === 1 && (record.submission === 1 || record.submission === null));

  return [
    first && { skill: '자기조절력', sentence: `${first.date || `${first.week}주차`} 기록의 “${first.evidence}”를 통해 작은 단위로 확인하는 태도를 이어 갔습니다.` },
    collaborative && { skill: '대인관계력', sentence: `${collaborative.date || `${collaborative.week}주차`} 기록의 “${collaborative.evidence}”처럼 시선을 나누어 문제를 더 빠르게 풀었습니다.` },
    persistent && { skill: '자기동기력', sentence: `${persistent.date || `${persistent.week}주차`} 기록의 “${persistent.evidence}”를 바탕으로 루틴과 제출을 끝까지 연결했습니다.` },
  ].filter(Boolean);
}
