export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-lead">{description}</p> : null}
    </div>
  );
}
