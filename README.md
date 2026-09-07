# 할일 공유 앱 (todo-sharing-app)

담당자를 지정해 할일을 공유하는 안드로이드/iOS 앱 프로토타입입니다.
Expo(React Native) + Firebase(Firestore)로 만들어졌고, Expo Go 앱 하나로
안드로이드/iOS 양쪽에서 바로 실행해볼 수 있습니다.

## 주요 기능

1. 할일 항목 = 담당자 + 할일 내용
2. 리스트는 메인 리스트와 서브 리스트로 구성되며, 서브 리스트는 메인 리스트에 연결됩니다.
3. 메인 리스트를 열면 자신 + 하위 서브 리스트의 할일을 모두 볼 수 있고,
   "전체보기" / "담당자별" 탭으로 보기 방식을 바꿀 수 있습니다.
4. 각 리스트 옆에 남은(미완료) 할일 개수가 뱃지로 표시되고,
   앱 아이콘 뱃지도 전체 미완료 개수로 자동 갱신됩니다.
5. 설정 화면에서 원하는 시간을 지정하면 매일 그 시간에 할일 알림(로컬 푸시)이 옵니다.

## 아키텍처

- 모든 기기가 같은 Firebase 프로젝트(Firestore)를 바라보며 실시간으로 동기화됩니다.
  별도 로그인 없이 "내 이름"만 설정하면 담당자로 표시/필터링됩니다.
- `lists` 컬렉션: `{ name, type: 'main' | 'sub', parentId, createdAt }`
- `todos` 컬렉션: `{ listId, title, assignee, done, createdAt }`

## 시작하기

### 1. Firebase 프로젝트 준비

1. https://console.firebase.google.com 에서 새 프로젝트 생성
2. 왼쪽 메뉴 **Firestore Database** → 데이터베이스 만들기 (테스트 모드로 시작해도 됩니다)
3. 프로젝트 설정 → 일반 → "내 앱"에서 웹 앱(</>) 추가 → 나오는 설정 값을 복사
4. `src/firebaseConfig.ts` 파일을 열어 복사한 값으로 교체
5. (선택) Firestore 규칙을 이 저장소의 `firestore.rules` 내용으로 교체 —
   지금은 프로토타입용으로 누구나 읽고 쓸 수 있게 열려 있습니다. 실제 배포 전에는
   반드시 인증 기반으로 강화하세요.

### 2. 앱 실행

```bash
npm install
npx expo start
```

터미널에 뜨는 QR코드를 스마트폰의 **Expo Go** 앱(App Store/Play 스토어에서 설치)으로
스캔하면 안드로이드/iOS 실기기에서 바로 실행됩니다.

### 3. 안드로이드에서 알림까지 테스트하려면: 개발 빌드(Development Build)

Expo Go(SDK 53 이후)는 안드로이드에서 `expo-notifications` 기능을 지원하지
않습니다(구글 정책 변경으로 Expo 팀이 제거). 매일 알림 기능까지 실기기에서
확인하려면 Expo Go 대신 이 프로젝트 전용 "개발 빌드" APK를 한 번 만들어서
설치해야 합니다. (할일/리스트/뱃지 등 나머지 기능은 Expo Go로도 계속 확인 가능)

```bash
npm install -g eas-cli
eas login                                   # https://expo.dev 계정으로 로그인 (무료 가입 가능)
eas build:configure                         # 최초 1회, 프로젝트를 Expo 계정에 연결
eas build --profile development --platform android
```

빌드가 끝나면(클라우드에서 10~20분 정도 걸림) 터미널에 다운로드 링크/QR코드가
나옵니다. 그 QR을 폰 카메라로 스캔해서 APK를 내려받아 설치하세요(출처를 알 수
없는 앱 설치 허용 필요). 설치한 앱 아이콘으로 실행한 뒤, 컴퓨터에서는:

```bash
npm run start:dev-client
```

을 실행하고 뜨는 QR을 그 개발 빌드 앱으로 스캔하면 연결됩니다. 이 앱은 알림
기능이 정상 동작합니다.

### 4. 실제 스토어 배포가 필요할 때

프로토타입 검증 후 실제 앱스토어/플레이스토어에 낼 때는 같은 EAS Build를
`production` 프로필로 사용합니다.

```bash
eas build --platform android
eas build --platform ios
```

(iOS 빌드에는 Apple Developer 계정, Android 스토어 배포에는 Google Play Console
계정이 필요합니다.)

## 알림/뱃지 참고사항

- 알림 권한은 설정 화면에서 알림을 켤 때 요청합니다.
- **안드로이드 + Expo Go 조합에서는 알림이 지원되지 않습니다** — 위 3번 항목의
  개발 빌드를 사용하세요. (iOS는 Expo Go에서도 로컬 알림이 동작합니다.)
- iOS 시뮬레이터에서는 푸시/로컬 알림이 정상 동작하지 않을 수 있어 실기기 테스트를
  권장합니다.
- 이 저장소를 만든 세션에는 모바일 기기/에뮬레이터가 없어 실제 앱 실행 화면은
  검증하지 못했습니다. 위 방법으로 직접 Expo Go에서 확인해주세요.

## 폴더 구조

```
App.tsx                     앱 진입점, 배지 동기화
src/
  types.ts                  TodoList, Todo 타입
  firebase.ts                Firebase 초기화
  firebaseConfig.ts          Firebase 프로젝트 설정값 (직접 채워넣기)
  services/
    firestoreService.ts      리스트/할일 CRUD + 실시간 구독
    notifications.ts         알림 권한, 매일 알림 예약, 뱃지 갱신
  hooks/
    useLists.ts, useTodos.ts Firestore 데이터를 구독하는 훅
  context/
    UserContext.tsx          "내 이름"(담당자) 로컬 저장
  navigation/
    RootNavigator.tsx         하단 탭(홈/설정) + 홈 스택 네비게이션
  screens/
    HomeScreen.tsx            메인/서브 리스트 목록 + 뱃지
    ListDetailScreen.tsx       할일 목록(전체보기/담당자별) + 추가
    SettingsScreen.tsx         이름 설정, 매일 알림 시간 설정
  components/
    Badge.tsx, TodoItem.tsx, AddTodoModal.tsx, AddListModal.tsx
firestore.rules             Firestore 보안 규칙 (프로토타입용, 배포 전 강화 필요)
```
