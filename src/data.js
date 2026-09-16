import ritualHistoryPayload from './data/ritual-history-2026-09-16.json';

export const navItems = [
  { id: 'story', label: '이야기' },
  { id: 'evidence', label: '기록' },
  { id: 'works', label: '대표작' },
  { id: 'documents', label: '문서' },
  { id: 'updater', label: '새 기록' },
];

export const skills = [
  { number: '01', name: '자기조절력', description: '감정을 낮추고 원인을 분해합니다.', tone: 'blue' },
  { number: '02', name: '대인관계력', description: '질문하고 설명하며 시선을 나눕니다.', tone: 'violet' },
  { number: '03', name: '자기동기력', description: '작은 루틴을 반복해 완주합니다.', tone: 'orange' },
];

export const storyScenes = [
  {
    date: '2026. 05',
    dateTime: '2026-05',
    title: '거대한 오류를 작은 질문으로 바꾸다',
    text: '포트폴리오용 GNS3 가상화 환경을 구축하다 KVM 지원 오류를 만났습니다. 실패가 반복되자 감정을 통제하고 “왜 안 되지?”를 “어디까지가 정상인가?”로 바꾸었습니다. 하드웨어·BIOS·운영체제로 문제를 쪼개 하나씩 검증했고, 운영체제 충돌 요인을 찾아 해결했습니다.',
    skill: '자기조절력',
    index: '01',
  },
  {
    date: '2026. 08. 12',
    dateTime: '2026-08-12',
    title: '혼자 버티는 대신 시선을 나누다',
    text: '첫 바이브 코딩 실습에서 프롬프트와 컴포넌트 변수가 엉켜 화면 렌더링이 멈췄습니다. 옆자리 동료에게 먼저 화면을 함께 보자고 요청했고, 교차 검증으로 변수명 오타를 찾았습니다. 저는 컴포넌트 간 데이터 흐름을 화이트보드로 설명하며 질문과 설명의 힘을 배웠습니다.',
    skill: '대인관계력',
    index: '02',
  },
  {
    date: '2026. 08. 20',
    dateTime: '2026-08-20',
    title: '내 문제를 넘어 팀의 완주를 돕다',
    text: '패킷 트레이서 망 구축에서 라우팅 오류로 막힌 동료에게 먼저 다가가 에러 로그를 함께 읽고 포트 설정 오류를 찾았습니다. 매일 교육장에 10분 먼저 도착해 환경을 세팅하고 전날 내용을 복습하는 루틴도 이어 갔습니다.',
    skill: '자기동기력',
    index: '03',
  },
  {
    date: '2026. 08. 24',
    dateTime: '2026-08-24',
    title: '더 나아진 지금',
    text: '새로운 자리에서 먼저 인사를 건네고 대화를 열었습니다. 기술을 공유하는 데서 멈추지 않고 일상적인 소통을 주도하며 팀에 긍정적인 에너지를 보태는 사람으로 바뀌었습니다.',
    skill: '회복탄력성 · 과제지속력',
    index: '04',
  },
];

function extractRitualEvidence(day) {
  if (day.evidence) return day.evidence;
  const lines = [...(Array.isArray(day.open) ? day.open : []), ...(Array.isArray(day.close) ? day.close : [])];
  const preferred = lines.find((line) => /오늘의 첫 행동/.test(line)) || lines.find((line) => /강점 행동/.test(line)) || lines.find((line) => /그 결과·알게 된 점/.test(line));
  return preferred ? preferred.replace(/^[^:]+:\s*/, '') : '';
}

export const ritualHistory = ritualHistoryPayload.days.map((day) => [
  day.date.replace(/-/g, '.'),
  day.ritual === 1 || (Array.isArray(day.close) && day.close.length > 0),
  extractRitualEvidence(day),
]);

export const defaultRitualPayload = ritualHistoryPayload;

export const documentLinks = [
  { number: '01', title: '이력서', description: '핵심 역량과 과제 경험을 한 장에 정리했습니다.', href: 'docs/resume.pdf', downloadName: '이력서.pdf' },
  { number: '02', title: '자기소개서', description: '한글 PDF 자기소개서를 내려받을 수 있습니다.', href: 'docs/self-introduction.pdf', downloadName: '자기소개서.pdf' },
  { number: '03', title: '경력기술서', description: '과제별 상황·행동·결과와 연결 역량을 담았습니다.', href: 'docs/career-description.pdf', downloadName: '경력기술서.pdf' },
];
