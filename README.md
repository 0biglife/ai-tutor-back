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
