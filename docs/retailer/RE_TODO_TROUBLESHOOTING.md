# RE_TODO.md 오류 해결 가이드

> **목적:** `RE_TODO.md` 파일 관련 오류 발생 시 원인 파악 및 해결 방법 안내

---

## 🔍 주요 오류 원인 및 해결 방법

### 1. 파일 경로 오류

#### 증상
```
❌ [TODO] RE_TODO.md 파일 읽기 실패: ENOENT: no such file or directory
```

#### 원인
- `docs/retailer/RE_TODO.md` 파일이 존재하지 않음
- 프로젝트 루트 디렉토리에서 실행하지 않음
- 파일 경로가 잘못됨

#### 해결 방법
```bash
# 1. 파일 존재 확인
ls docs/retailer/RE_TODO.md

# 2. 프로젝트 루트에서 실행 확인
pwd  # 현재 디렉토리가 프로젝트 루트인지 확인

# 3. 파일 읽기 테스트
npx tsx scripts/update-todo.ts --read
```

#### 코드 위치
- `lib/utils/todo-updater.ts` 11번째 줄: `TODO_FILE_PATH` 상수 확인

---

### 2. 파일 읽기/쓰기 권한 오류

#### 증상
```
❌ [TODO] RE_TODO.md 파일 읽기 실패: EACCES: permission denied
❌ [TODO] RE_TODO.md 파일 업데이트 실패: EACCES: permission denied
```

#### 원인
- 파일 또는 디렉토리에 읽기/쓰기 권한이 없음
- 파일이 다른 프로세스에 의해 잠겨있음
- Git 작업 중 파일이 잠김

#### 해결 방법
```bash
# Windows (PowerShell)
# 파일 속성 확인
Get-Item docs/retailer/RE_TODO.md | Select-Object FullName, Attributes

# 읽기 전용 해제
Set-ItemProperty -Path "docs/retailer/RE_TODO.md" -Name IsReadOnly -Value $false

# Linux/Mac
chmod 644 docs/retailer/RE_TODO.md
```

---

### 3. 정규식 패턴 매칭 실패

#### 증상
```
⚠️ [TODO] "작업명"을 찾을 수 없습니다
```

#### 원인
- 체크박스 앞의 텍스트가 정확히 일치하지 않음
- 마크다운 형식이 예상과 다름
- 특수문자 이스케이프 문제

#### 현재 체크박스 형식
```markdown
- [X] **작업명**
- [ ] **작업명**
```

#### 해결 방법
1. **정확한 텍스트 확인**
   ```bash
   # 파일 내용에서 정확한 텍스트 확인
   npx tsx scripts/update-todo.ts --read
   ```

2. **체크박스 형식 확인**
   - 올바른 형식: `- [X] **작업명**` 또는 `- [ ] **작업명**`
   - 잘못된 형식: `- [x] 작업명` (소문자 X, 볼드 없음)
   - 잘못된 형식: `* [X] **작업명**` (별표 사용)

3. **특수문자 포함 시**
   - 괄호 `()`, 대괄호 `[]`, 별표 `*` 등은 자동 이스케이프 처리됨
   - 하지만 정확한 텍스트 매칭이 필요함

#### 코드 위치
- `lib/utils/todo-updater.ts` 51-54번째 줄: 정규식 패턴 확인

---

### 4. 날짜 업데이트 패턴 불일치

#### 증상
```
⚠️ [TODO] 업데이트 날짜 패턴을 찾을 수 없습니다
```

#### 원인
- 파일 상단의 날짜 형식이 예상과 다름
- 날짜 라인이 없거나 형식이 변경됨

#### 현재 날짜 형식
```markdown
> **업데이트:** 2024-11-28
```

#### 해결 방법
1. **파일 상단 확인**
   ```markdown
   > **업데이트:** YYYY-MM-DD
   ```

2. **형식이 다른 경우 수동 수정**
   - `> 업데이트: 2024-11-28` (볼드 없음) → 수동 수정 필요
   - `**업데이트:** 2024-11-28` (인용구 없음) → 수동 수정 필요

#### 코드 위치
- `lib/utils/todo-updater.ts` 80번째 줄: 날짜 패턴 확인

---

### 5. 인코딩 문제

#### 증상
```
❌ [TODO] RE_TODO.md 파일 읽기 실패: (인코딩 관련 에러)
파일 내용이 깨져서 보임
```

#### 원인
- 파일이 UTF-8이 아닌 다른 인코딩으로 저장됨
- BOM(Byte Order Mark) 포함

#### 해결 방법
1. **파일 인코딩 확인 및 변환**
   ```bash
   # Windows: PowerShell에서 인코딩 확인
   Get-Content docs/retailer/RE_TODO.md -Encoding UTF8 | Set-Content docs/retailer/RE_TODO.md -Encoding UTF8
   ```

2. **에디터에서 저장 시 UTF-8 선택**
   - VS Code: 우측 하단 인코딩 표시 클릭 → "Save with Encoding" → "UTF-8"

#### 코드 위치
- `lib/utils/todo-updater.ts` 18번째 줄: `readFileSync(..., "utf-8")`
- `lib/utils/todo-updater.ts` 32번째 줄: `writeFileSync(..., "utf-8")`

---

### 6. 파일이 Git에 의해 잠김

#### 증상
```
❌ [TODO] RE_TODO.md 파일 업데이트 실패: (파일이 사용 중)
```

#### 원인
- Git 작업 중 파일이 잠김
- 다른 프로세스가 파일을 사용 중

#### 해결 방법
```bash
# Git 상태 확인
git status

# 파일이 스테이징 영역에 있으면 커밋 또는 reset
git reset HEAD docs/retailer/RE_TODO.md

# 또는 파일 잠금 해제 (Windows)
# 작업 관리자에서 관련 프로세스 종료
```

---

### 7. 체크박스 텍스트 매칭 실패 (자주 발생)

#### 증상
```
⚠️ [TODO] "Clerk 초기 설정"을 찾을 수 없습니다
```

#### 원인 분석
현재 `RE_TODO.md` 파일의 체크박스 형식:
```markdown
- [x] **Clerk 초기 설정**
```

정규식 패턴이 찾는 형식:
```regex
(- \[)([ X])(\] \*\*작업명\*\*)
```

#### 문제점
- 텍스트가 정확히 일치해야 함
- 대소문자 구분
- 공백 포함 여부 확인

#### 해결 방법
1. **정확한 텍스트 복사**
   ```bash
   # 파일에서 정확한 텍스트 확인
   npx tsx scripts/update-todo.ts --read | Select-String "Clerk"
   ```

2. **체크박스 앞의 텍스트만 사용**
   - ✅ 올바름: `"Clerk 초기 설정"` (볼드 마크다운 제외)
   - ❌ 잘못됨: `"**Clerk 초기 설정**"` (볼드 포함)
   - ❌ 잘못됨: `"- [x] **Clerk 초기 설정**"` (전체 라인)

---

## 🛠️ 디버깅 방법

### 1. 파일 읽기 테스트
```bash
npx tsx scripts/update-todo.ts --read
```

### 2. 파일 경로 확인
```bash
# Node.js에서 경로 확인
node -e "const path = require('path'); console.log(path.join(process.cwd(), 'docs', 'retailer', 'RE_TODO.md'));"
```

### 3. 파일 존재 확인
```bash
# Windows
Test-Path docs/retailer/RE_TODO.md

# Linux/Mac
test -f docs/retailer/RE_TODO.md && echo "파일 존재" || echo "파일 없음"
```

### 4. 파일 내용 검색
```bash
# 특정 텍스트가 포함된 라인 찾기
npx tsx scripts/update-todo.ts --read | Select-String "작업명"
```

---

## 📋 체크리스트

오류 발생 시 다음을 순서대로 확인:

- [ ] 파일이 `docs/retailer/RE_TODO.md` 경로에 존재하는가?
- [ ] 프로젝트 루트 디렉토리에서 실행했는가?
- [ ] 파일 읽기/쓰기 권한이 있는가?
- [ ] 파일 인코딩이 UTF-8인가?
- [ ] 체크박스 형식이 `- [X] **작업명**` 또는 `- [ ] **작업명**`인가?
- [ ] 업데이트하려는 텍스트가 정확히 일치하는가? (대소문자, 공백 포함)
- [ ] Git 작업 중 파일이 잠겨있지 않은가?
- [ ] 다른 프로세스가 파일을 사용 중이지 않은가?

---

## 🔧 자주 발생하는 오류 패턴

### 패턴 1: 텍스트 불일치
```
요청: "Clerk 초기 설정"
실제: "Clerk 초기 설정 " (뒤에 공백)
```
→ **해결:** 정확한 텍스트 복사 (공백 포함)

### 패턴 2: 볼드 마크다운 포함
```
요청: "**Clerk 초기 설정**"
실제 파일: - [x] **Clerk 초기 설정**
```
→ **해결:** 볼드 마크다운(`**`) 제외하고 텍스트만 사용

### 패턴 3: 대소문자 불일치
```
요청: "clerk 초기 설정"
실제: "Clerk 초기 설정"
```
→ **해결:** 대소문자 정확히 일치시켜야 함

---

## 📞 추가 도움

위 방법으로 해결되지 않으면:
1. 전체 에러 메시지 확인
2. `npx tsx scripts/update-todo.ts --read` 실행 결과 확인
3. 파일 내용과 요청한 텍스트를 정확히 비교

---

**마지막 업데이트:** 2024-11-28

