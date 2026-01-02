# Vercel 배포 가이드

RyuKimSongMeet을 Vercel에 배포하는 방법입니다.

## ⚠️ 중요: Redis 데이터베이스 필수!

이 앱은 모임 데이터를 저장하기 위해 **Redis**를 사용합니다. Redis를 설정하지 않으면 "모임 생성에 실패했습니다" 오류가 발생합니다.

**지원하는 데이터베이스:**
- ✅ Vercel KV (추천)
- ✅ Redis (Upstash Redis)
- ✅ 기타 Redis 호환 데이터베이스

---

## 📝 빠른 시작 가이드

### 1️⃣ Vercel에 프로젝트 배포

1. [Vercel](https://vercel.com)에 로그인
2. **"Add New Project"** 클릭
3. GitHub 레포지토리 연결
4. **"Deploy"** 클릭하고 배포 완료 대기

### 2️⃣ Redis 데이터베이스 생성

배포가 완료되면 **둘 중 하나** 선택:

#### 옵션 A: Vercel KV (추천)

1. Vercel 대시보드에서 **프로젝트** 선택
2. 상단 메뉴에서 **"Storage"** 탭 클릭
3. **"Create Database"** 버튼 클릭
4. **"KV"** 선택 (Vercel의 네이티브 KV)
5. 설정:
   - **Database Name**: 아무거나 (예: `ryukimsonmeet-kv`)
   - **Region**: Seoul (또는 가까운 지역)
6. **"Create"** 클릭

#### 옵션 B: Redis (Upstash)

1. Vercel 대시보드에서 **프로젝트** 선택
2. 상단 메뉴에서 **"Storage"** 탭 클릭
3. **"Create Database"** 버튼 클릭
4. **"Redis"** 선택 (Upstash Redis)
5. 설정:
   - **Database Name**: 아무거나 (예: `RyuKimSongMeet-db`)
   - **Region**: Seoul (또는 가까운 지역)
6. **"Create"** 클릭

### 3️⃣ 데이터베이스를 프로젝트에 연결

**매우 중요한 단계!**

1. 생성된 데이터베이스 페이지에서
2. **"Connect Project"** 탭/버튼 클릭
3. 프로젝트 선택 (RyuKimSongMeet)
4. **환경**: **Production**, **Preview**, **Development** 모두 선택
5. **"Connect"** 클릭

✅ 환경 변수가 자동으로 추가됩니다:
- **Vercel KV 사용 시**: `KV_URL`, `KV_REST_API_URL`, etc.
- **Redis 사용 시**: `REDIS_URL`

### 4️⃣ 확인: 환경 변수 체크

1. 프로젝트 대시보드 → **"Settings"** 탭
2. **"Environment Variables"** 메뉴
3. 다음 중 하나가 있는지 확인:
   - ✅ `REDIS_URL` (Redis 사용 시)
   - ✅ `KV_URL` + `KV_REST_API_URL` (Vercel KV 사용 시)

### 5️⃣ 재배포 (필수!)

환경 변수를 추가했으므로 **반드시 재배포**해야 합니다:

**방법 1: Vercel 대시보드에서**
1. **"Deployments"** 탭
2. 최신 배포 옆의 **"..."** (점 3개) 메뉴
3. **"Redeploy"** 클릭

**방법 2: Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy after Redis setup"
git push
```

---

## 🧪 연결 테스트

배포 후 다음 URL을 방문하여 Redis 연결을 테스트하세요:

```
https://your-app.vercel.app/api/health
```

**성공한 경우:**
```json
{
  "status": "healthy",
  "redis": "connected",
  "test": "passed",
  "env": {
    "hasRedisUrl": true,
    "hasKvUrl": false,
    "usingUrl": "REDIS_URL"
  }
}
```

**실패한 경우:**
```json
{
  "status": "unhealthy",
  "redis": "disconnected",
  "error": "Redis URL not found...",
  "env": {
    "hasRedisUrl": false,
    "hasKvUrl": false
  }
}
```

---

## 🐛 문제 해결

### ❌ "모임 생성에 실패했습니다" 오류

**원인:**
- Redis 데이터베이스가 설정되지 않음
- 환경 변수가 없음
- Redis가 프로젝트에 연결되지 않음

**해결 방법:**
1. `/api/health` 엔드포인트 확인 (위 참조)
2. Vercel 대시보드 → Storage → 데이터베이스 존재 확인
3. Settings → Environment Variables → `REDIS_URL` 또는 `KV_URL` 확인
4. 데이터베이스 → Connect Project → 프로젝트 연결 확인
5. **재배포** (매우 중요!)

### ❌ env 변수가 false로 나옴

**해결:**
1. Storage 탭에서 데이터베이스가 프로젝트에 연결되었는지 확인
2. "Connect Project" 다시 클릭
3. **Production, Preview, Development** 모두 선택했는지 확인
4. 재배포

### ❌ 재배포했는데도 안됨

**해결:**
1. Vercel 대시보드에서 **완전히 새로운 배포** 트리거:
   - Deployments → 최신 → ... → Redeploy
2. 브라우저 캐시 클리어
3. 시크릿/프라이빗 브라우징 모드로 테스트

### ❌ "Redis connection error" 로그

**해결:**
1. Vercel 대시보드 → Storage에서 데이터베이스 상태 확인
2. 데이터베이스가 활성 상태인지 확인
3. Region이 가까운 곳으로 설정되었는지 확인

---

## 💰 비용

### Vercel 호스팅
- ✅ **무료** (Hobby 플랜)

### Vercel KV
- ✅ **무료 시작**
  - 256MB 스토리지
  - 월 10,000개 명령어
  - 친구 그룹에는 **충분**

### Redis (Upstash)
- ✅ **무료 시작**
  - 256MB 스토리지
  - 일일 10,000개 명령어
  - 친구 그룹에는 **충분**

---

## 🎉 완료 확인

다음이 모두 작동하면 성공:

1. ✅ `/api/health` → `"status": "healthy"`
2. ✅ 홈페이지에서 모임 생성 → 링크 생성됨
3. ✅ 링크 열기 → 모임 정보 표시
4. ✅ 가능 시간 추가 → 저장됨
5. ✅ 페이지 새로고침 → 데이터 유지됨

---

## 📞 추가 도움

- [Vercel KV 문서](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Redis 문서](https://vercel.com/docs/storage/vercel-redis)
- [환경 변수 설정](https://vercel.com/docs/projects/environment-variables)

---

## 🖥️ 로컬 개발

로컬에서 테스트하려면:

1. Vercel 대시보드 → Storage → 데이터베이스 → .env.local 탭
2. 변수 복사
3. 프로젝트 루트에 `.env.local` 파일 생성
4. 붙여넣기

```bash
# .env.local

# Redis를 사용하는 경우:
REDIS_URL="redis://default:password@host:port"

# 또는 Vercel KV를 사용하는 경우:
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

5. 개발 서버 실행:
```bash
npm run dev
```

---

## 🔍 어떤 데이터베이스를 선택해야 하나요?

**Vercel KV 추천 (더 빠름):**
- Vercel의 네이티브 솔루션
- 더 빠른 응답 시간
- 더 나은 통합

**Redis도 괜찮음:**
- 이미 생성했다면 그대로 사용 가능
- 충분히 빠르고 안정적
- 무료 티어 사용 가능

**둘 다 잘 작동합니다!** 이미 설정한 것을 사용하시면 됩니다.
