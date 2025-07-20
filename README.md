## AI Tutor - Backend

AI Tutor는 영어 회화 연습을 위해 개발된 음성 기반의 튜터 서비스로 다음 백엔드 기능을 제공합니다.

- 유저 조회

- 멤버십 및 멤버십 플랜 관리

- Multer 기반 음성 파일 업로드

- SST 처리 및 TTS, GPT 대화 처리

- 배치 Cron으로 멤버십 만료 검증

<br />

## 기술 스택

- **Framework**: NestJS

- **ORM**: TypeORM + PostgreSQL

- **File Upload**: Multer

- **Schedule**: @nestjs/schedule (Cron)

- **External APIs**: OpenAI (chat, TTS, Whisper)

<br />

## 실행 방법

```bash
# 설치
yarn install

# 빌드
yarn build

# 실행
yarn dev

# 초기 데이터 세팅: 멤버십 플랜 등 테스트용 샘플 데이터 삽입
yarn seed
```

<br />

## 환경변수 (`.env`)

```bash
# 서버 포트
PORT=3001

# JWT 서명용 시크릿 키 > 사용자 인증 토큰 발급
JWT_SECRET=big-life-secret

# OpenAI API 키
OPENAI_API_KEY=sk-p...v4A

# 배포된 NeonDB PostgreSQL 연결 정보
DB_HOST=ep-late-breeze-a74uj1cc-pooler.ap-southeast-2.aws.neon.tech
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_1XyqFt8KAEpQ
DB_DATABASE=neondb
DB_PORT=5432
DB_SSL=true
```

<br />

## 디렉토리 구조

```bash
src
├── admin # 관리자 기능 모듈
├── app.module.ts
├── auth # JWT 인증 및 가드
├── config
├── enums # Enum 정의
├── membership # 멤서비 및 멤버십 플랜 기능 모듈
├── openai # Open API 연동
├── seeds # 초기 데이터 설정
├── tutor # AI 튜터 모듈
├── users # 사용자 모듈
└── types
```

<br />

## APIs

### User API

- **[GET]** `/api/users/me`: 현재 테스트용으로 마련해둔 사용자 정보 조회

### Membership API

- **[GET]** `/api/membership`: 조회한 유저의 구매 가능한 멤버십 조회

- **[POST]** `/api/membership`: 멤버십 구매

### Tutor API

- **[POST]** `/api/tutor/init`: GPT의 초기 환여 메시지 + TTS URL 반환

- **[POST]** `/api/tutor/chat`: 유저 음성 입력을 `STT → GPT 응답 → TTS` 처리하여 반환하며, 채팅을 위해 선택한 멤버십의 채팅 횟수 차감

### Admin API

- **[POST]** `/api/admin/plan`: 새로운 멤버십 플랜 생성

- **[POST]** `/api/admin/plans/:planId/delete`: 특정 멤버십 플랜 삭제

- **[POST]** `/api/admin/users/:userId/plans/:planId/assign`: 특정 유저에게 특정 플랜 강제 할당

- **[POST]** `/api/admin/users/:userId/memberships/:membershipId/delete`: 특정 유저의 멤버십 제거

### Admin API Postman 으로 테스트하기

1. Postman 설치 및 실행

2. [Postman Collection JSON 다운](https://drive.google.com/uc?export=download&id=1kJtkYQBQpSEmGZhX56gy2wAZk7V-aBJA) 받은 뒤 Postman으로 Import 하기

3. API 실행

- `baseUrl`, `planId`, `membershipId` 유의

- ![](/public/postman.png)

<br />

## Database

본 프로젝트는 [Neon](https://console.neon.tech)의 PostgreSQL 서비스를 기반으로 데이터베이스를 구성하고 있습니다. TypeORM을 사용하여 NestJS 애플리케이션과 연동되어 있으며, 주요 Entity는 도메인별 `*.entity.ts` 파일을 참고해주시면 감사하겠습니다.

<br />

## Cron 모듈 설계

NestJS의 `@nestjs/schedule` 패키지를 활용하여 주기적인 배치 작업을 수행합니다. 현재는 멤버십 만료 처리를 위한 Cron 작업이 구성되어 있으며, `membership/membership.cron.ts`에서 동작을 관리합니다.

- 실행 주기는 테스트 서버이기 때문에 매 정시마다 검증하고 있습니다.

- 멤버십 만료일이 현재 시간 전이라면 `isExpired` 값을 `true`로 갱신합니다.

<br />

<br />

<br />

# AI Tutor - Frontend

[AI Tutor Frontend Project](https://github.com/0biglife/ai-tutor-front)는 AI Tutor 서비스의 프론트엔드 기능을 제공합니다.

## 주요 기능

### 메인 페이지 (`/`)

- 유저 정보 및 보유 멤버십 조회

- 튜터 기능 및 멤버십 구매 기능 접근 가능

- - 튜터 기능 접근 전, 보유한 멤버십 선택 후 입장

- - 무제한 멤버십이 아닌 경우, 보유한 채팅 횟수 차감

### 멤버십 구매 페이지 (`/membership`)

- 개인용(`B2C`) 멤버십: 기본 제공

- 기업용 멤버십: 기업 코드 인증 필요 (모달만 구현된 상태며, 요구사항 밖인 인증 구현은 미제공)

- 사용중인 멤버십 사용중 처리

### GPT 기반 AI 튜터 기능 (`/tutor`)

#### 시작하기 모달 기능

- 입장 시, 시작하기 모달 제공

- - 페이지 마운트 시, 음성 자동 재생은 브라우저 정책에 어긋나기 때문에 사용자 인터랙션 유도를 위해 구현

- 시작하기 모달 언마운트 시, AI 튜터 시작 음성 재생

#### 음성 대화 기능

- 사용자 음성 녹음 및 마이크 Waveform 시각화

- - 음성 녹음 후 취소 + 전송 기능 제공

- 음성 전송 후 사용자 말풍선 및 AI 튜터 응답 말풍선 생성

- 말풍선별 음성 재생

#### 멤버십 소진 안내 기능

- 멤버십 채팅 횟수 소진시 모달 안내 + 마이크 Disabled

### 그 외

- Light/Dark 테마 지원

<br />

## 기술 스택

- **Framework**: Next.js 15+ (App Router)

- **UI**: Chakra UI

- **State**: Zustand

- **Networking**: Axios

- **Etc**: TypeScript, Yarn

<br />

## 설치 및 실행

```bash
# 설치
yarn install

# 빌드
yarn build

# 실행
yarn dev
```

## 환경변수(`.env`)

```bash
# 루트 경로로, 백엔드가 제공하는 정적 파일(url) 접근 시 사용됩니다.
NEXT_PUBLIC_ROOT_URL=http://localhost:3001

# 기본 API 요청 경로입니다.
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 개발 환경에서 로그인 없이 API를 호출하기 위한 테스트용 (만료 8월 17일)JWT 토큰입니다.
NEXT_PUBLIC_TEST_BEARER_TOKEN=eyJhbGc...8Rk
```

<br />

## 디렉토리 구조

```bash
src
├── app
│   ├── layout.tsx
│   ├── membership
│   │   └── page.tsx
│   ├── page.tsx
│   └── tutor
│       └── page.tsx
├── components # 공통 및 페이지 UI 컴포넌트 모음
│   ├── index.ts
│   ├── home
│   │   ├── HomeContainer.tsx
│   │   ├── ...
│   ├── layout
│   │   ├── ThemeToggle.tsx
│   │   ├── ...
│   ├── membership
│   │   ├── MembershipContainer.tsx
│   │   ├── ...
│   └── tutor
│       ├── TutorContainer.tsx
│       ├── ...
├── hooks # 커스텀 훅 모음
│   ├── index.ts
│   ├── useOpenModal.tsx
│   ├── ...
├── lib # API 호출, Axios 인스턴스, 유틸 함수
│   ├── apis
│   │   ├── membership.ts
│   │   ├── tutor.ts
│   │   └── user.ts
│   ├── axios.ts
│   ├── endpoints.ts
│   └── utils.tsx
├── providers
│   ├── index.ts
│   └── Chakra.tsx
├── store
│   └── useUserStore.tsx
├── styles
│   ├── globals.css
│   └── theme.ts
└── types # 공통 타입 및 enum
    ├── chat.ts
    ├── enums.ts
    ├── index.ts
    └── user.ts
17 directories, 43 files
```

<br />

## 데모 자료

### 메인 페이지

![](/public/demo1.png)

### 멤버십 구매

![](/public/demo2.png)

### B2C 고객이 B2B 멤버십 조회 시

![](/public/demo3.png)

### B2B 멤버십 조회

![](/public/demo4.png)

### AI 튜터 입장 전 멤버십 선택

![](/public/demo5.png)

### AI 튜터 기능

![](/public/demo6.png)

### 멤버십 채팅 횟수 소진 시

![](/public/demo7.png)
