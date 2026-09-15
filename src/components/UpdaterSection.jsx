import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { buildCandidates, exampleCSV, parseInput, summarizeRecords } from '../utils/records';

function OutputMetric({ label, value, detail }) {
  return <span><b>{value}</b><small>{label}</small><em>{detail}</em></span>;
}

export default function UpdaterSection() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('개인정보가 포함된 원문 일기는 붙여 넣지 마세요.');

  const handleGenerate = () => {
    try {
      const parsed = parseInput(input);
      setResult({ summary: summarizeRecords(parsed.records, parsed.source), candidates: buildCandidates(parsed.records) });
      setStatus('결과를 만들었습니다. 날짜·근거를 확인한 문장만 문서에 옮기세요.');
    } catch (error) {
      setResult(null);
      setStatus(error.message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setInput(await file.text());
      setStatus(`${file.name}을(를) 불러왔습니다. 원문에 이름이 포함되지 않았는지 확인하세요.`);
    } catch {
      setStatus('파일을 읽지 못했습니다. CSV 또는 JSON 파일을 다시 선택해 주세요.');
    }
  };

  return (
    <section className="updater section-shell" id="updater" aria-labelledby="updater-title">
      <SectionHeader eyebrow="06 · KEEP WRITING" title={<>새 기록을 넣으면<br />사이트가 다시 씁니다</>} description="리추얼 기록·과제 목록·출석 숫자를 CSV로 붙여 넣거나, 마스킹된 리추얼 JSON을 선택하세요. 브라우저 안에서만 계산하고, 같은 입력은 같은 결과를 만듭니다." />
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
          <div className="tool-panel-heading"><label htmlFor="records-input">기록 내용 붙여넣기</label><span>CSV / JSON</span></div>
          <textarea id="records-input" rows="8" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" placeholder="CSV: week,date,attendance,ritual,submission,evidence\n1,2026-05-04,1,1,0,환경 세팅" />
          <div className="file-input-row"><label className="file-label" htmlFor="records-file">파일 선택</label><input id="records-file" type="file" accept=".json,.csv,application/json,text/csv" onChange={handleFileChange} /><button className="ghost-button" type="button" onClick={() => { setInput(exampleCSV); setStatus('CSV 예시가 들어갔습니다. 실제 기록으로 교체한 뒤 결과를 만드세요.'); }}>예시 불러오기</button></div>
          <button className="button button-primary button-full" type="button" onClick={handleGenerate}>결과 만들기 <span aria-hidden="true">→</span></button>
          <p className="tool-status" role="status">{status}</p>
          {result ? <div className="generated-result"><div className="result-heading"><div><span className="eyebrow">GENERATED RESULT</span><h3>{result.summary.source} · {result.summary.total}{result.summary.unit}</h3></div><span className="result-check">✓</span></div><div className="result-metrics"><OutputMetric label="출석" value={result.summary.attendance.value} detail={`${result.summary.attendance.sum}/${result.summary.attendance.count}`} /><OutputMetric label="리추얼" value={result.summary.ritual.value} detail={`${result.summary.ritual.sum}/${result.summary.ritual.count}`} /><OutputMetric label="제출" value={result.summary.submission.value} detail={`${result.summary.submission.sum}/${result.summary.submission.count}`} /></div><div className="candidate-list">{result.candidates.map((candidate) => <p className="candidate" key={candidate.skill}><strong>{candidate.skill}</strong><span>{candidate.sentence}</span></p>)}</div></div> : null}
        </div>
      </div>
    </section>
  );
}
