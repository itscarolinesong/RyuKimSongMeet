# Vercel 배포 가이드

RyuKimSongMeet을 Vercel에 배포하는 방법입니다.

## 필수 설정: Vercel KV 데이터베이스

이 앱은 모임 데이터를 저장하기 위해 Vercel KV (Redis 기반 키-값 저장소)를 사용합니다.

### 1단계: Vercel에 프로젝트 배포

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 레포지토리 연결
4. "Deploy" 클릭

### 2단계: Vercel KV 데이터베이스 생성

배포가 완료되면:

1. Vercel 대시보드에서 프로젝트 선택
2. 상단 메뉴에서 **"Storage"** 탭 클릭
3. **"Create Database"** 클릭
4. **"KV"** 선택 (Redis 기반)
5. 데이터베이스 이름 입력 (예: `ryukimsonmeet-db`)
6. 리전 선택 (가까운 지역 선택, 예: `Seoul`)
7. **"Create"** 클릭

### 3단계: KV를 프로젝트에 연결

1. 생성된 KV 데이터베이스 페이지에서
2. **"Connect Project"** 버튼 클릭
3. 프로젝트 선택
4. **"Connect"** 클릭

이제 환경 변수가 자동으로 설정됩니다:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 4단계: 재배포

환경 변수가 추가되었으므로:

1. Vercel 대시보드에서 **"Deployments"** 탭
2. 최신 배포 옆의 **"..."** 메뉴
3. **"Redeploy"** 클릭

또는:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## 완료!

이제 앱이 정상적으로 작동합니다:
- ✅ 모임 생성 가능
- ✅ 링크 공유 가능
- ✅ 여러 사람이 동시에 가능 시간 입력 가능
- ✅ 데이터가 영구적으로 저장됨

## 문제 해결

### "모임 생성에 실패했습니다" 오류

이 오류는 Vercel KV가 설정되지 않았을 때 발생합니다.

**해결 방법:**
1. Vercel 대시보드 → Storage 탭
2. KV 데이터베이스가 생성되었는지 확인
3. 프로젝트에 연결되었는지 확인 (환경 변수 확인)
4. 재배포

### 로컬 개발

로컬에서 개발하려면:

1. `.env.local` 파일 생성
2. Vercel 대시보드에서 환경 변수 복사
3. `.env.local`에 붙여넣기:

```bash
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

4. 개발 서버 실행:

```bash
npm run dev
```

## 비용

- **Vercel 호스팅**: 무료 (Hobby 플랜)
- **Vercel KV**: 무료로 시작 (256MB 스토리지, 월 3000개 명령어)
  - 소규모 친구 그룹에는 충분함
  - 필요시 유료 플랜으로 업그레이드 가능

## 추가 정보

- [Vercel KV 문서](https://vercel.com/docs/storage/vercel-kv)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
