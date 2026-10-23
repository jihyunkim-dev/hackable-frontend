# API 연동 체크리스트

> 기준: 2026-10-23, `api.hackable.co.kr` OpenAPI + 실제 응답 확인
> 표시: ✅ 완료 · 🟢 API 준비됨(바로 작업 가능) · 🟡 일부만 가능 · 🔴 API 없음/막힘(백엔드 요청 필요)

---

## 추천 작업 순서

1. **공통 기반** – 필터·정렬을 URL 파라미터로 옮기기 (모든 목록 화면이 이걸 씀)
2. **로그인 없이 되는 조회 화면** – 프로젝트 상세 → 지원사업 → 메인 → 클립 → 뉴스레터 구독
3. **백엔드 요청 정리 후** – 팀빌딩, 카테고리 묶음, 검색
4. **로그인 이후** – 인증 → 북마크 → 팀빌딩 작성/수정 → 마이페이지

---

## 0. 공통 기반

- [x] `utils/requestToSrv.tsx` 요청 함수 작성
- [x] 페이지네이션: `total_count` 기반 계산 (`getPagination`, `toSkip`)
- [x] 썸네일 없을 때 "이미지 준비중" 이미지
- [x] 외부 썸네일 도메인 허용 (`next.config.ts`)
- [ ] **FilterBar 필터·정렬 → URL 파라미터(`?status=open&sort=...`)로 반영** (지금은 화면 상태만 바뀜) → ServerContainer가 읽어서 요청에 넣는 구조
- [ ] 화면별 필터 옵션을 API 값에 맞게 정리 (아래 각 화면 표 참고)
- [ ] 상세 본문 `description`이 **HTML** → 렌더링 방식 결정 (sanitize 후 `dangerouslySetInnerHTML` 등)
- [ ] 목록이 비었을 때 / 요청 실패 시 화면 (빈 상태 UI)
- [ ] 더미 ↔ 실제 데이터 전환 주석 패턴 나머지 컨테이너에 적용

---

## 1. 메인 `/`

| 영역 | 필요한 요청 | 상태 |
|---|---|---|
| 히어로 캐러셀 | 없음 (설정 파일 고정 콘텐츠) | – |
| 기회 탭 · 해커톤 | `GET /project?category=…&limit=4` | 🟡 카테고리 묶음 확정 필요 |
| 기회 탭 · 공모전 | `GET /project?category=…&limit=4` | 🟡 〃 |
| 기회 탭 · 지원사업 | `GET /startup-support?limit=4` | 🟢 |
| 클립 섹션 | `GET /clips/?limit=4` | 🟡 클립 데이터 3건뿐, 카테고리 없음 |

- [ ] 탭별 목록 연동 (마감 임박순 등 정렬 기준 결정 필요 – 프로젝트 API에 정렬 파라미터 없음)
- [ ] 클립 섹션 연동

---

## 2. 프로젝트 (해커톤 메뉴)

### 2-1. 목록 `/project`, `/project/ai-hackathon`, `/project/ai-contest`, `/project/startup-competition`

| UI 요소 | API | 상태 |
|---|---|---|
| 목록 + 페이지 | `GET /project?skip&limit` → `total_count` | ✅ `/project` 완료 |
| 카테고리 탭 3개 | `category` (단일 값만) | 🟡 API는 9종, 화면은 3종. **여러 카테고리 한 번에 조회 불가** |
| 모집 상태 필터 | `status=open/upcoming/closed` | 🟢 (기본 조회는 마감 제외로 보임) |
| 포지션·기간·진행방식 필터 | 없음 | 🔴 |
| 정렬 (최신순/마감임박순) | 없음 | 🔴 |
| 검색창 | 없음 (`q` 무시됨) | 🔴 |
| 북마크 아이콘 | `POST/DELETE /project/{id}/bookmark` | 🔴 로그인 필요 + 목록에 `is_bookmarked` 없음 |

- [x] `/project` 전체 목록
- [ ] 카테고리 3개 페이지 목록 (묶음 확정 → 백엔드에 다중 카테고리 요청 or 화면 카테고리 재정의)
- [ ] 모집 상태 필터 연결
- [ ] 필터 옵션을 API가 지원하는 것만 남길지 결정

### 2-2. 상세 `/project/{카테고리}/[id]`

| UI 요소 | API 필드 | 상태 |
|---|---|---|
| 제목·주최·기간·D-day·조회수 | `title`, `hosted`, `start_date~end_date`, `view_count` | 🟢 |
| 포스터 | `thumbnail_img` (없으면 placeholder) | 🟢 |
| 본문 | `description` (HTML) | 🟢 렌더링 방식 결정 필요 |
| 참여하기 버튼 | `external_url` | 🟢 |
| 북마크 | bookmark API | 🔴 로그인 필요 |

- [ ] `[id]`(= `seo_url`, 예: `1017-jekkeoton-...`)에서 앞 숫자로 `GET /project/{id}` 조회
- [ ] 없는 id → `notFound()`
- [ ] 카테고리 경로와 실제 카테고리가 다를 때 처리 (리다이렉트 or 허용)
- [ ] `generateMetadata`에 실제 제목·canonical 반영

---

## 3. 지원사업 `/startup-support`

| UI 요소 | API | 상태 |
|---|---|---|
| 목록 + 페이지 | `GET /startup-support` → `total_count` | 🟢 |
| 분야 필터 | `category=space/business` | 🟢 |
| 지역 필터 | `region=서울…` | 🟢 |
| 모집 상태 필터 | `status` | 🟢 |
| 검색·정렬 | 없음 | 🔴 |
| 상세 | `GET /startup-support/{id}` (+ `external_url`, HTML 본문) | 🟢 |

- [ ] 목록 연동 (`/project`와 같은 패턴)
- [ ] **필터 옵션 교체** – 지금은 프로젝트 필터(포지션 등)를 그대로 씀 → 분야/지역/모집상태로
- [ ] 상세 연동
- [ ] 카드 문구: 지원사업은 `prize`가 대부분 없음 → "지원규모" 표시 방식 결정

---

## 4. 클립 `/clip`

| UI 요소 | API | 상태 |
|---|---|---|
| 추천 클립 캐러셀 | `GET /clips/carousel` | 🟡 현재 데이터 0건 |
| 목록 + 페이지 | `GET /clips/?skip&limit` | 🟡 `total_count` 없음 → 전체 페이지 수 계산 불가 |
| 카테고리 탭 | `category` | 🟡 화면 값(ai, vibe-coding…)과 API 값 합의 필요, 데이터 카테고리 전부 null |
| 정렬 | `sort_by` | 🟡 `latest` 외 값 미정 (아무 값이나 받음) |
| 이번 주 클립 / 추천 클립 | 없음 | 🔴 |
| 카드: 읽는 시간 | `duration`? (단위 확인 필요) | 🟡 |
| 썸네일 | `thumbnail_img` (빈 문자열 `""`로 옴) | 🟢 placeholder 처리 |

### 상세 `/clip/[id]`
| UI 요소 | API | 상태 |
|---|---|---|
| 제목·카테고리·날짜·조회·북마크 수 | `GET /clips/{id}` | 🟢 |
| 본문 블록 + 목차 | 없음 (`description` 한 줄뿐) | 🔴 본문 구조 백엔드와 합의 필요 |
| 북마크 | `POST/DELETE /clips/{id}/bookmark` | 🔴 로그인 필요 |

- [ ] 목록·상세 기본 정보 연동
- [ ] 카테고리 값 합의 후 탭 연결

---

## 5. 팀빌딩 `/teambuilding`

| UI 요소 | API | 상태 |
|---|---|---|
| 목록 | `GET /teambuildings/` | 🟡 `total_count` 없음 |
| 프로젝트/스터디 탭 | 없음 (필드 없음) | 🔴 |
| 포지션·기술스택·모집상태 필터 | 없음 (정렬만 있음) | 🔴 |
| 검색 | `GET /search/teambuildings` | 🔴 서버 오류 ("Search engine error") |
| 카드: 작성자 이름 | `author_id`만 있음 | 🔴 |
| 카드: D-day | `end_date` | 🟢 |
| 상세 `/teambuilding/[id]` | 없음 (`GET /teambuildings/{id}` 미제공) | 🔴 |
| 작성 `/teambuilding/create` | `POST /teambuildings/` | 🟡 로그인 필요, 이미지 업로드 방식 미정 |
| 수정 `/teambuilding/[id]/edit` | `PATCH /teambuildings/{id}` | 🔴 상세 조회가 없어 기존 값 불러오기 불가 |

- [ ] 백엔드 요청 정리 후 진행 (아래 백엔드 요청 목록)

---

## 6. 뉴스레터 `/newsletter/subscribe`

- [ ] 🟢 구독 `POST /newsletter/subscribe` 연동 (로그인 불필요, 응답 형식만 확인)
- [ ] 성공/실패 메시지 UI (이미 구독 중이어도 같은 응답이 옴)

---

## 7. 로그인 이후 기능 (인증 먼저)

- [ ] 🔴 카카오 로그인 – 콜백 후 토큰 전달 방식 확인 필요 (보류 중)
- [ ] 🔴 구글 로그인 – 백엔드 미완성
- [ ] 토큰 저장 방식 결정 (httpOnly 쿠키 권장)
- [ ] 헤더 로그인 상태 표시 (`GET /auth/me`)
- [ ] 북마크 (프로젝트·지원사업·팀빌딩·클립)
- [ ] 팀빌딩 작성·수정
- [ ] 마이페이지 `/mypage`: 내 정보 `GET /auth/me` 🟢 / 내 북마크·내 글 🔴 / 프로필 수정 🔴 / 모집 상태 변경 (`PATCH /teambuildings/{id}` 🟡) / 탈퇴 🔴 미구현

---

## 백엔드 요청 목록

**우선 (조회 화면 막힘)**
- [ ] 프로젝트 카테고리 9종 → 화면 3종 묶음 기준 확정 (또는 `category` 다중 값 지원)
- [ ] 팀빌딩 상세 `GET /teambuildings/{id}`
- [ ] 팀빌딩·클립 목록에 `total_count` (프로젝트처럼 `{ total_count, items }`)
- [ ] 팀빌딩에 유형(프로젝트/스터디) 필드, 작성자 닉네임
- [ ] 클립 본문 구조 (블록/HTML), 카테고리 값

**다음**
- [ ] 프로젝트·지원사업 검색(`q`)과 정렬(`sort_by`) 파라미터
- [ ] `sort_by` 허용 값 명시 (지금은 아무 값이나 받음)
- [ ] 팀빌딩 검색 서버 오류 수정
- [ ] 목록·상세 응답에 로그인 사용자의 `is_bookmarked`
- [ ] 로그인·구독 응답 스키마 문서화, 카카오 콜백 후 프론트로 토큰 전달 방식
- [ ] 마이페이지용 API (내 북마크, 내 글, 프로필 수정), 탈퇴 구현
- [ ] 이미지 업로드 API (팀빌딩 작성용)
