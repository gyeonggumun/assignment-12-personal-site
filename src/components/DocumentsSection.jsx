import SectionHeader from './SectionHeader';
import { documentLinks } from '../data';
import careerDescription from '../../docs/career-description.md?raw';
import resume from '../../docs/resume.md?raw';
import selfIntroduction from '../../docs/self-introduction.md?raw';

const documentContents = {
  'docs/resume.md': resume,
  'docs/self-introduction.md': selfIntroduction,
  'docs/career-description.md': careerDescription,
};

function downloadDocument(event, documentRecord) {
  const content = documentContents[documentRecord.href];
  if (!content) return;

  event.preventDefault();
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = `${documentRecord.title}.md`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function DocumentsSection() {
  return (
    <section className="documents section-shell" id="documents" aria-labelledby="documents-title">
      <SectionHeader eyebrow="05 · APPLICATION FILES" title={<>필요한 문서를<br />바로 내려받기</>} description="지원 상황에 맞춰 최종 연락 수단과 검증된 기록 수치를 확인한 뒤 제출합니다." />
      <div className="document-grid">
        {documentLinks.map((document) => (
          <a className="document-card" href={document.href} download key={document.number} onClick={(event) => downloadDocument(event, document)}>
            <span className="document-number">{document.number}</span>
            <div><h3>{document.title}</h3><p>{document.description}</p></div>
            <b aria-hidden="true">↓</b>
          </a>
        ))}
      </div>
    </section>
  );
}
