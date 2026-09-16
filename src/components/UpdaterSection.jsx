import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import { defaultRitualPayload } from '../data';
import { appendOnlyRecords, buildCandidates, exampleCSV, parseInput, parseRitualJSON, summarizeRecords } from '../utils/records';

const ADDITIONS_STORAGE_KEY = 'mg-ritual-additions-v1';

function loadSavedAdditions() {
  try {
    const saved = window.localStorage.getItem(ADDITIONS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeResult(records, source) {
  return { summary: summarizeRecords(records, source), candidates: buildCandidates(records) };
}

function OutputMetric({ label, value, detail }) {
  return <span><b>{value}</b><small>{label}</small><em>{detail}</em></span>;
}

export default function UpdaterSection() {
  const baseRecords = useMemo(() => parseRitualJSON(JSON.stringify(defaultRitualPayload)), []);
  const [additions, setAdditions] = useState(loadSavedAdditions);
  const [input, setInput] = useState('');
  const records = useMemo(() => appendOnlyRecords(baseRecords, additions), [additions, baseRecords]);
  const [result, setResult] = useState(() => makeResult(records, 'Ritual JSON'));
  const [status, setStatus] = useState(`기본 리추얼 JSON ${baseRecords.length}일이 보존되어 있습니다. 새 입력은 기존 날짜를 덮어쓰지 않고 새 날짜만 추가합니다.`);

  const persistAdditions = (nextAdditions) => {
    setAdditions(nextAdditions);
    try {
      window.localStorage.setItem(ADDITIONS_STORAGE_KEY, JSON.stringify(nextAdditions));
    } catch {
      setStatus('새 기록은 화면에 반영했지만 브라우저 저장 공간에 저장하지 못했습니다.');
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      setResult(makeResult(records, additions.length ? 'Ritual JSON + 추가 기록' : 'Ritual JSON'));
      setStatus(`기본 기록 ${baseRecords.length}일${additions.length ? `과 추가 기록 ${additions.length}건` : ''}을 그대로 검증했습니다.`);
      return;
    }

    try {
      const parsed = parseInput(input);
      const mergedRecords = appendOnlyRecords(records, parsed.records);
      const newRecords = mergedRecords.slice(records.length);
      const nextAdditions = appendOnlyRecords(additions, newRecords);
      persistAdditions(nextAdditions);
      const nextRecords = appendOnlyRecords(baseRecords, nextAdditions);
      setResult(makeResult(nextRecords, parsed.source === 'CSV' ? 'Ritual JSON + CSV' : 'Ritual JSON'));
      setStatus(newRecords.length ? `${newRecords.length}개 새 기록만 추가했습니다. 기존 기록은 변경하지 않았습니다.` : '새로운 날짜가 없어 기존 기록을 그대로 유지했습니다.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setInput(await file.text());
      setStatus(`${file.name}을(를) 불러왔습니다. 결과 생성 시 새 날짜만 보존 기록에 추가됩니다.`);
    } catch {
      setStatus('파일을 읽지 못했습니다. CSV 또는 JSON 파일을 다시 선택해 주세요.');
    }
  };

  return (
    <section className="updater section-shell" id="updater" aria-labelledby="updater-title">
      <SectionHeader eyebrow="06 · KEEP WRITING" title={<>새 기록을 넣으면<br />사이트가 다시 씁니다</>} description="기본 리추얼 JSON은 사이트에 보존되어 별도 입력 없이 검증됩니다. 이후 CSV·JSON을 추가하면 기존 날짜는 덮어쓰지 않고 새 날짜만 누적합니다." />
      <div className="updater-content">
        <div className="updater-copy">
          <div className="implementation-note"><span className="code-bracket">{'{ }'}</span><div><strong>Deterministic by design</strong><p>외부 AI API 없이 같은 입력을 같은 함수로 계산합니다. 결과는 제안일 뿐, 최종 승인은 작성자가 합니다.</p></div></div>
          <ol className="steps">
            <li><b>CSV 또는 JSON 입력</b><span>13주 표 형식이나 ritual-history JSON을 사용합니다.</span></li>
            <li><b>결과 생성</b><span>출석률·기록률·제출률과 역량별 후보를 계산합니다.</span></li>
            <li><b>검토 후 반영</b><span>날짜·근거를 확인한 문장만 문서에 옮깁니다.</span></li>
          </ol>
        </div>
        <div className="tool-panel">
          <div className="tool-panel-heading"><label htmlFor="records-input">추가 기록 붙여넣기</label><span>기본 JSON {baseRecords.length}일 보존</span></div>
          <textarea id="records-input" rows="8" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" placeholder="추가할 CSV 또는 JSON만 입력하세요. 비워 두면 보존된 기본 기록으로 검증합니다." />
          <div className="file-input-row"><label className="file-label" htmlFor="records-file">파일 선택</label><input id="records-file" type="file" accept=".json,.csv,application/json,text/csv" onChange={handleFileChange} /><button className="ghost-button" type="button" onClick={() => { setInput(exampleCSV); setStatus('CSV 예시가 들어갔습니다. 실제 기록으로 교체한 뒤 결과를 만드세요.'); }}>예시 불러오기</button></div>
          <button className="button button-primary button-full" type="button" onClick={handleGenerate}>새 기록만 추가·검증 <span aria-hidden="true">→</span></button>
          <p className="tool-status" role="status">{status}</p>
          {result ? <div className="generated-result"><div className="result-heading"><div><span className="eyebrow">GENERATED RESULT</span><h3>{result.summary.source} · {result.summary.total}{result.summary.unit}</h3></div><span className="result-check">✓</span></div><div className="result-metrics"><OutputMetric label="출석" value={result.summary.attendance.value} detail={`${result.summary.attendance.sum}/${result.summary.attendance.count}`} /><OutputMetric label="리추얼" value={result.summary.ritual.value} detail={`${result.summary.ritual.sum}/${result.summary.ritual.count}`} /><OutputMetric label="제출" value={result.summary.submission.value} detail={`${result.summary.submission.sum}/${result.summary.submission.count}`} /></div><div className="candidate-list">{result.candidates.map((candidate) => <p className="candidate" key={candidate.skill}><strong>{candidate.skill}</strong><span>{candidate.sentence}</span></p>)}</div></div> : null}
        </div>
      </div>
    </section>
  );
}
