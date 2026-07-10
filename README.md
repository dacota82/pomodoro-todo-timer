# Pomodoro Todo Timer

> 집중 타이머와 할 일 목록을 한 화면에서 쓰는 미니 웹 앱  
> **버전:** v1.0.1 · 바이브코딩 교육 과제

---

## 1. 프로젝트명

**Pomodoro Todo Timer** (뽀모도로 투두 타이머)

---

## 2. 프로젝트 소개

뽀모도로 기법(25분 집중 + 휴식)과 할 일(To-Do) 관리를 하나로 합친 웹 애플리케이션입니다.

상단에서는 **플립 클럭 스타일**의 다크 모드 타이머로 집중/휴식을 관리하고,  
하단에서는 **할 일을 추가·완료·선택**하며 지금 집중할 작업을 고를 수 있습니다.

프레임워크 없이 **HTML / CSS / JavaScript**만으로 만들었으며,  
브라우저에 데이터를 저장해 새로고침 후에도 할 일과 상태가 유지됩니다.

---

## 3. 배포 링크

| 구분 | 링크 |
|------|------|
| **GitHub Pages (실사용)** | https://dacota82.github.io/pomodoro-todo-timer/ |
| **GitHub 저장소** | https://github.com/dacota82/pomodoro-todo-timer |
| **릴리즈** | https://github.com/dacota82/pomodoro-todo-timer/releases/tag/v1.0.1 |

> 스마트폰(iPhone)에서도 세로 화면에 맞춰 보이도록 구성했습니다.

---

## 4. 주요 기능

### 타이머
- 집중 **25분** / 짧은 휴식 **5분** / 긴 휴식 **15분** 모드 전환
- 시작 · 일시정지 · 리셋
- 플립 클럭 UI (시 · 분 · 초)
- 집중 모드에서는 **할 일을 선택한 뒤에만** 시작 가능
- Space 키로 시작/일시정지 토글

### TO-DO
- 할 일 입력 후 **「+ 추가」**로 목록에 추가
- 완료 체크 / 삭제
- 할 일 클릭 시 **지금 집중할 작업**으로 선택
- 필터: **전체 / 진행중 / 완료**
- 상단 **오늘 완료** 숫자에 오늘 체크 완료한 할 일 개수 반영

### 데이터 저장
- `localStorage`로 할 일, 타이머 상태, 오늘 완료 수 저장
- 새로고침 후에도 목록과 완료 상태 유지

---

## 5. 사용 기술

| 구분 | 기술 |
|------|------|
| 마크업 | HTML5 |
| 스타일 | CSS3 (Flexbox, 다크 테마, 모바일 safe-area) |
| 동작 | Vanilla JavaScript (ES Modules) |
| 저장 | Web Storage API (`localStorage`) |
| 배포 | GitHub / GitHub Pages |
| 버전 관리 | Git + Semantic Versioning (`v1.0.0`) |

---

## 6. 실행 방법

### A. 배포 사이트에서 바로 사용
브라우저에서 아래 주소를 엽니다.

https://dacota82.github.io/pomodoro-todo-timer/

### B. 로컬에서 실행 (Windows)

> ES Module을 사용하므로 `index.html`을 파일로 더블클릭하기보다 **로컬 서버**로 여는 것을 권장합니다.

1. 프로젝트 폴더로 이동합니다.
2. 아래 중 하나를 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```

또는

```bat
start-server.bat
```

3. 브라우저에서 **http://localhost:8080** 으로 접속합니다.
4. 종료는 터미널에서 `Ctrl + C` 입니다.

---

## 7. 폴더 구조

```text
pomodoro-todo-timer/
├── index.html          # 메인 화면 구조
├── styles.css          # 다크 모드 · 플립 클럭 · TO-DO 스타일
├── app.js              # 앱 초기화 · 타이머/할 일 연결
├── js/
│   ├── timer.js        # 뽀모도로 타이머 로직
│   ├── todo.js         # 할 일 추가/완료/필터
│   ├── storage.js      # localStorage 저장/불러오기
│   ├── flip-clock.js   # 플립 클럭 UI
│   └── analog-clock.js # (이전 버전 시계, 참고용)
├── VERSION             # 현재 버전 번호
├── CHANGELOG.md        # 버전별 변경 이력
├── README.md           # 프로젝트 설명 (본 문서)
├── start-server.ps1    # 로컬 서버 실행 (PowerShell)
└── start-server.bat    # 로컬 서버 실행 (배치)
```

---

## 8. 구현하면서 배운 점

- **HTML / CSS / JS를 역할별로 나누면** 화면·동작·저장을 따로 고치기 쉽다는 것을 배웠습니다.
- 타이머와 할 일을 **연결**하면(할 일 선택 후 집중 시작) 단순 타이머보다 실제로 쓰기 좋아집니다.
- `localStorage`로 새로고침 후에도 데이터가 남게 하는 방법을 익혔습니다.
- GitHub에 올리고 **GitHub Pages**로 배포하면, 다른 기기·폰에서도 바로 확인할 수 있습니다.
- `v1.0.0`처럼 **버전 번호와 CHANGELOG**를 남기면 과제·협업 때 “무엇이 바뀌었는지”를 설명하기 쉽습니다.
- 모바일(특히 iPhone)에서는 입력창·버튼이 **눈에 잘 띄게** 만드는 것이 사용성에 중요하다는 것을 느꼈습니다.

---

## 9. 향후 개선 방향

- [ ] 알림음 / 브라우저 알림으로 세션 종료를 더 명확히 알리기
- [ ] 다크/라이트 테마 전환
- [ ] 주간·월간 집중 통계 차트
- [ ] 할 일 수정(이름 바꾸기) 기능
- [ ] PWA로 홈 화면에 추가해 앱처럼 사용하기
- [ ] 집중 시간·휴식 시간을 사용자가 직접 설정하기

---

## 사용 흐름 (간단)

1. 하단에 할 일을 입력하고 **+ 추가**
2. 할 일을 클릭해 **지금 집중** 대상으로 선택
3. **시작**을 눌러 25분 집중
4. 끝나면 휴식 모드로 전환 · 할 일 완료 시 체크
5. 상단 **오늘 완료**로 하루 성과 확인

---

Made for **바이브코딩** 교육 과제 · Deployed with GitHub Pages
