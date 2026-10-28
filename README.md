# ARC 2027 — 36.5℃

ARC EXHIBITION VOL. 2 웹사이트. Figma `2027 ARC 웹팀 / 웹 디자인` 시안을 기반으로 제작했습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입 검사 후 dist/ 로 빌드
```

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | Intro 모션 (클릭 또는 6.5초 후 Home으로 이동, PC에서 마우스를 움직이면 자동 이동 취소) |
| `/home` | 메인 |
| `/about` | Exhibition · Overview · ARC Team |
| `/project` | 카테고리별 작품 목록 + 상세 모달 |
| `/map` | 2F / 3F 평면도와 작품 목록 |
| `/behind` | The History Archive (캐러셀 모달) |

## 콘텐츠 수정

- 전시 정보, 팀원: `src/data/exhibition.ts` (팀 사진은 `public/assets/team/`)
- 작품, 지도 목록, Behind 카드: `src/data/projects.ts`
  - `image`가 `null`인 작품은 시안의 회색 썸네일 플레이스홀더로 표시됩니다.

## 레이아웃

데스크톱은 1920px 시안 좌표를 `--u` 단위(`calc(var(--u) * N)` = 시안의 N px)로 옮겨 화면 너비에 비례해 축소됩니다.
900px 이하에서는 세로로 쌓이는 모바일 레이아웃으로 전환됩니다.

## 배포

BrowserRouter를 사용하므로 SPA rewrite가 필요합니다. Vercel은 `vercel.json`이 포함되어 있습니다.
