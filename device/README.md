# 기록 갱신 장치

13주 기록 CSV 또는 리추얼 앱의 JSON 내보내기 파일을 읽어 기록률과 역량별 문단 후보를 만듭니다. 외부 AI API를 호출하지 않는 결정적 스크립트이므로 같은 입력은 같은 결과를 냅니다. JSON은 `days` 배열과 `peerNamesMasked: true`가 있어야 하며, 동료 이름이 마스킹되지 않은 파일은 거부합니다.

## 실행 방법

1. CSV를 사용할 경우 `sample-records.csv`를 복사해 본인의 검증된 기록으로 교체합니다. 열 이름은 `week,date,attendance,ritual,submission,evidence`를 유지합니다. JSON을 사용할 경우 다운로드한 파일을 이 폴더 밖에 두어도 됩니다.
2. 이 폴더에서 `node update-site.js <기록파일> output`을 실행합니다. 예: `node update-site.js ritual-history-2026-09-14.json output`
3. `output/last-result.json`과 `output/paragraph-candidates.md`를 열어 날짜와 근거를 직접 확인한 뒤 사이트와 문서에 승인된 내용만 옮깁니다.

원문 일기, 다른 사람의 실명·연락처, 비밀번호·토큰·API 키는 입력하거나 저장하지 않습니다. 이 장치는 지원 문장을 자동 승인하지 않으며, 최종 판단은 작성자에게 있습니다.
