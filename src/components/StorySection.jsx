import SectionHeader from './SectionHeader';
import { storyScenes } from '../data';

export default function StorySection() {
  return (
    <section className="story section-shell" id="story" aria-labelledby="story-title">
      <SectionHeader eyebrow="01 · THE STORY" title={<>고난에서 시작해,<br />함께 더 나아진 지금</>} />
      <div className="story-body">
        <p className="lead-paragraph">완벽한 코드와 결점 없는 인프라만이 훌륭한 엔지니어의 조건이라고 믿던 때가 있었습니다. 문제가 생기면 질문을 부끄러워했고, 며칠 밤낮을 혼자 버티는 것을 성실함이라고 착각했습니다.</p>
        <div className="timeline-story">
          {storyScenes.map((scene) => (
            <article className="story-scene" key={scene.dateTime}>
              <div className="scene-index">{scene.index}</div>
              <time dateTime={scene.dateTime}>{scene.date}</time>
              <div className="scene-copy">
                <h3>{scene.title}</h3>
                <p>{scene.text}</p>
                <span className="skill-tag">{scene.skill}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
