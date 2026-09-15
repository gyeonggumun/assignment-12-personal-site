import SectionHeader from './SectionHeader';
import { documentLinks } from '../data';

export default function DocumentsSection() {
  return (
    <section className="documents section-shell" id="documents" aria-labelledby="documents-title">
      <SectionHeader eyebrow="05 · APPLICATION FILES" title={<>필요한 문서를<br />바로 내려받기</>} description="지원 상황에 맞춰 최종 연락 수단과 검증된 기록 수치를 확인한 뒤 제출합니다." />
      <div className="document-grid">
        {documentLinks.map((document) => (
          <a className="document-card" href={`./${document.href}`} download={`${document.title}.md`} key={document.number}>
            <span className="document-number">{document.number}</span>
            <div><h3>{document.title}</h3><p>{document.description}</p></div>
            <b aria-hidden="true">↓</b>
          </a>
        ))}
      </div>
    </section>
  );
}
