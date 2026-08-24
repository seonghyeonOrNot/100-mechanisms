<aside>

**MQ-001 · Slider-Crank — Mechanical UX 관점 연구 노트**

회전 운동을 직선 왕복 운동으로 바꾸는 대표 메커니즘을 단순 원리 학습으로 끝내지 않고, **사용자의 어떤 물리 행동을 줄일 수 있는가**까지 연결해 연구한다.

</aside>

# 0. 핵심 질문

> **Slider-Crank는 사용자의 어떤 반복 행동을 없애거나 줄일 수 있는가?**
> 

기존 질문이 `회전을 어떻게 직선 왕복으로 바꾸는가?`였다면, 제품 관점에서는 한 단계 더 나아가야 한다.

**Problem → Mechanical UX → Motion Design → Mechanism → Engineering → Product**

Slider-Crank의 핵심 가치는 큰 왕복 운동 자체보다, **필요한 순간 5~30mm 정도의 작은 직선 변위를 반복 가능하게 만들어 다른 구조를 작동시키는 것**에 있을 수 있다.

# 1. 한 줄 정의

Slider-Crank는 **회전 운동 ↔ 직선 왕복 운동을 변환하는 4절 링크 계열의 메커니즘**이다.

- 입력: 회전 운동
- 출력: 직선 왕복 운동
- 역방향 사용도 가능
- 대표 구성: Crank / Connecting Rod / Slider / Guide

# 2. 어떤 물리 문제를 해결하는가?

모터, 손잡이, 바퀴 등에서 얻기 쉬운 운동은 대부분 회전이다. 반면 제품 안에서는 다음과 같은 작은 직선 움직임이 자주 필요하다.

- 손잡이를 밖으로 밀어 올리기
- 래치를 밀어 잠그거나 해제하기
- 슬롯이나 커버를 열고 닫기
- 작은 부품을 왕복시키기
- 반복적으로 누르거나 당기기

이때 Slider-Crank는 `회전 입력 → 반복 가능한 직선 변위`를 만든다.

<aside>
💡

**Mechanical UX 관점의 해석**

사용자가 직접 `밀기 → 당기기 → 다시 원위치`해야 하던 행동을, 회전 입력 하나로 반복 수행하게 만드는 것이 핵심이다.

</aside>

# 3. Motion Analysis

## 기본 운동

크랭크가 한 바퀴 회전하면 슬라이더는 한 번 왕복한다.

`회전 → 가속 → 최대 속도 → 감속 → 데드센터 → 반대 방향 왕복`

슬라이더 속도는 일정하지 않다. 크랭크 각도에 따라 속도와 가속도가 계속 달라져 **기계적으로 리듬감 있는 비등속 왕복 운동**이 만들어진다.

## 스트로크

기본적인 inline Slider-Crank에서는 슬라이더 스트로크가 대략 **크랭크 반경의 2배**로 결정된다.

!슬라이더 스트로크 다이어그램

슬라이더 스트로크 다이어그램

- Crank radius 2.5mm → 약 5mm stroke
- Crank radius 5mm → 약 10mm stroke
- Crank radius 10mm → 약 20mm stroke
- Crank radius 15mm → 약 30mm stroke

따라서 Helixbeam 관점에서는 먼저 **필요한 UX 동작의 이동거리**를 정하고, 그다음 크랭크 반경을 역으로 설계하는 방식이 적합하다.

# 4. Mechanism과 Machine Parts를 구분해서 보기

## Mechanism

메커니즘은 **기능을 만드는 원리와 관계**다.

Slider-Crank에서 중요한 것은 Crank, Connecting Rod, Slider가 어떤 운동 관계를 만드는지다.

## Machine Parts

기계부품은 그 원리를 실제로 구현하는 단품이다.

- Shaft / Pin
- Bushing
- Bearing
- Washer
- Spacer
- Snap ring
- Bolt / Nut

> **메커니즘은 관계이고, 기계부품은 그 관계를 실제 구조로 만드는 재료다.**
> 

# 5. Joint와 실제 부품

대표적인 Slider-Crank에서는 다음 운동 조건이 필요하다.

| 연결 | Joint | 실물 구현 |
| --- | --- | --- |
| Frame ↔ Crank | Revolute | Shaft / Pin + Bushing 또는 Bearing |
| Crank ↔ Connecting Rod | Revolute | Crank pin + Washer / Spacer |
| Connecting Rod ↔ Slider | Revolute | Pin / Shaft |
| Slider ↔ Guide | Prismatic | Guide rail / Slot / Linear surface |

**축은 부품이고 Joint는 운동 조건이다.** Fusion에서는 축과 홀을 실제로 모델링한 뒤, 조립 단계에서 해당 축 중심으로 회전하도록 Revolute Joint를 설정한다.

# 6. 부싱·베어링·와셔를 왜 쓰는가?

## Bushing

축과 하우징 사이에서 마찰과 마모를 관리하고 축을 지지한다.

- 부싱은 하우징에 고정
- 샤프트가 부싱 내부에서 회전
- 축을 양쪽에서 지지하면 기울어짐을 줄일 수 있음

## Bearing

부싱보다 낮은 마찰과 더 안정적인 회전을 얻기 쉽다. 반복 속도와 하중이 높아질수록 비교 가치가 커진다.

## Washer / Spacer

- 축 방향 간극 조정
- 부품끼리 직접 마찰하는 것 방지
- 체결 하중 분산
- 링크 위치 정렬

제품화 단계에서는 단순히 돌아가는지가 아니라 **마찰, 유격, 소음, 수명, 조립 편의성**까지 함께 본다.

# 7. 편심과 Slider-Crank의 관계

편심의 핵심은 **회전 중심과 힘을 전달하는 작동점이 서로 다르다는 것**이다.

`회전 중심 ≠ 작동점`

회전축에서 벗어난 위치에 핀을 배치하면 그 핀은 회전하면서 원을 그린다. 이 원운동을 Connecting Rod와 Slider에 전달하면 직선 왕복이 만들어진다.

따라서 크랭크 핀 자체가 일종의 **off-center 작동점**이라고 이해할 수 있다.

### 편심 디스크와 구분

- 디스크 중심축이 디스크 정중앙 → 일반 크랭크 디스크에 가까움
- 디스크 자체가 중심에서 치우친 축으로 회전 → Eccentric disc
- 중심축은 정상이나 연결 핀만 중심에서 벗어남 → Crank pin 방식

둘 다 `회전 중심에서 벗어난 위치 변화`를 이용하지만 구조와 부품 형태가 다르다.

# 8. Motion Quality — 어떤 움직임이 좋은가?

같은 Slider-Crank라도 설계값에 따라 움직임의 질감이 달라진다.

- Crank radius ↑ → Stroke ↑
    - 크랭크 핀이 그리는 원의 지름이 곧 슬라이더의 이동폭입니다. 반경이 커질수록 같은 1회전으로 **더 멀리 밀고 당깁니다.**
    - radius 2.5mm → stroke ≈ 5mm
    - radius 5mm → stroke ≈ 10mm
    - radius 10mm → stroke ≈ 20mm
    - radius 15mm → stroke ≈ 30mm
- Connecting rod가 짧아짐 → 비선형성 및 측압 ↑
    - 로드가 짧으먼 크랭크가 옆으로 돌 때 로드가 더 크게 기울어 집니다.
    - 그 기울어진 힘이 슬라이더를 앞으로만 밀지 않고 가이드벽을 누르는 데 그것을 축압이라고 합니다.
- RPM ↑ → 관성력·진동·소음 ↑
    - 크랭크가 빨라질 수록 슬라이더는 끝점에서 더 세계 멈추고 더 세계 반대 방향으로 꺾입니다.
    - 슬라이더 가속도는 회전 속도의 제곱에 비례합니다.
    - 질량이 작아도 속도가 높으면 충격이 됩니다.
- Joint clearance ↑ → 흔들림·충격음 ↑
    - 유격은 핀, 홀, 부싱 사이에 의도치 않은 틈인데, 도면상과 다르게 실물은 항상 헐거울 수 있습니다.
    - 슬라이드 크랭크의 경우, 한 주기 동안 힘의 방향이 여러번 바뀌게 되는 데 틈이 생기면 부품이 한쪽 벽에 붙어 가다가 힘 방향이 바뀌는 순간 반대벽응로 이동하게 되는 데, 이때 그 충격으로 흔들림과 소음이 발생합니다.
    - 따라서 샤프트 + 부싱 + 와셔, 베이링 각각의 사용 버전에 따라 소음이 달라집니다. (베어링이 회전 마찰이 작고 정렬만 맞으면 가능 조용)
- Guide friction ↑ → 필요한 입력 토크 ↑
    - 슬라이더는 가이드 위를 미끄러지듯 움직여야 하는 데, 마칠이 커지면 크랭크를 돌리는 데 더 큰 토크가 필요 합니다.
    - 마찰을 키우는 것들 → 가이드 표면이 거칠거나 기울어짐, 윤활 없음, 슬라이더가 가이드에 쐐기처럼 낌 , 출력부에 하중이 걸림

연구 목표는 단순히 **움직이는가**가 아니라 다음을 비교하는 것이다.

- 얼마나 부드러운가
- 얼마나 조용한가
- 목표 위치에 반복적으로 도달하는가
- 데드센터에서 걸리지 않는가
- 손으로 느꼈을 때 거칠지 않은가

# 9. Mechanical UX로 번역하기

| 기계적 기능 | 사용자 행동 | UX로 바뀌는 방식 |
| --- | --- | --- |
| 직선 밀기 | 사용자가 손으로 밀어야 함 | 자동 팝업 / 래치 작동 |
| 직선 당기기 | 사용자가 다시 당겨야 함 | 자동 복귀 동작 |
| 반복 왕복 | 같은 동작을 반복 | 회전 입력 하나로 반복 수행 |
| 주기적 미세 변위 | 작은 위치 조절 반복 | 기계적으로 일정한 스트로크 유지 |

핵심은 **Slider-Crank를 어디에 넣을까?**가 아니라 먼저 **어떤 물리 행동을 줄일까?**를 찾는 것이다.

# 10. Helixbeam 제품 응용 가설

## A. 숨겨진 손잡이 / 후크 팝업

사용자가 별도 버튼을 잡아당기지 않아도 작은 회전 입력을 이용해 10~30mm 정도의 직선 상승을 만든다.

**Mechanical UX**

`찾기 → 손가락 넣기 → 당기기`를 `노출됨 → 바로 잡기`로 줄일 수 있는가?

## B. 수동 브레이크 보조

작은 레버 또는 휠 회전에서 직선 변위를 얻어 브레이크 패드나 래치를 밀어주는 구조.

검토할 것:

- 필요한 Stroke
- 필요한 Clamp force
- 해제 후 자동 복귀 여부
- Fail-safe 구조

## C. 캐리어 휠을 입력원으로 사용

`Wheel → Reduction → Crank → Slider`

캐리어가 이동할 때 이미 존재하는 휠 회전을 별도 모터 없이 활용해 작은 직선 동작을 추출한다.

가능한 출력:

- 작은 슬롯 개폐
- 기계식 상태 표시
- 내부 래치 반복 작동
- 캐릭터/오브제의 미세 왕복 움직임

다만 **움직임이 재미있다는 이유만으로 적용하지 않는다.** 반드시 사용자 가치 또는 브랜드 경험과 연결되어야 한다.

## D. Living Object

5~20mm 정도의 작은 왕복만으로도 다음 동작을 만들 수 있다.

- 몸통의 미세한 호흡
- 발 두드리기
- 고개 또는 귀의 반복 움직임
- 작은 표면의 펄스 운동

여기서는 기능 효용보다 **Motion UX / Behavior 표현**이 중심이 된다.

# 11. 어디에는 Slider-Crank를 쓰지 않는가?

다른 메커니즘이 더 적합할 수 있는 경우도 명확히 기록한다.

- 단순한 순수 사인형 직선 왕복만 필요 → Scotch Yoke 비교
- 임의 위치에 정지해야 함 → Lead screw / Linear actuator 검토
- 아주 긴 직선 이동 → Rack & Pinion 또는 Belt 검토
- 특정 시점에만 밀고 오래 유지 → Cam / Toggle / Latch 조합 검토
- 출력 경로가 직선이 아니라 특정 곡선 → 4-bar linkage 검토

즉 메커니즘을 사랑해서 쓰는 것이 아니라 **제품 요구조건에 가장 적합할 때 선택한다.**

# 12. CAD Challenge

## 목표

Fusion에서 Slider-Crank를 **Mechanical UX 요구사항으로부터 역설계**한다.

### Case A — 5mm 팝업

- 목표 stroke: 5mm
- Crank radius: 약 2.5mm부터 시작

### Case B — 10mm 래치

- 목표 stroke: 10mm
- Crank radius: 약 5mm부터 시작

### Case C — 20mm 손잡이

- 목표 stroke: 20mm
- Crank radius: 약 10mm부터 시작

### Case D — 30mm 전개 구조

- 목표 stroke: 30mm
- Crank radius: 약 15mm부터 시작

비교 변수:

- Connecting rod length
- Crank radius
- RPM
- Joint clearance
- Guide clearance
- Bushing vs Bearing

# 13. Prototype Roadmap

## P0 — 원리 확인

- 3D 프린팅 Crank
- Connecting Rod
- Slider
- Guide
- 단순 Pin
- 수동 구동

목표: 스트로크와 데드센터를 체감한다.

## P1 — 실제 Machine Parts 적용

- Metal shaft
- Bushing
- Washer
- Spacer
- Snap ring 또는 고정 구조

목표: 플라스틱 핀 버전과 유격·마찰·소음을 비교한다.

## P2 — Bearing Version

- Bearing 적용
- 정렬 구조 개선
- 하우징 강성 개선

목표: 반복 운동 품질과 내구성을 비교한다.

## P3 — Product UX Prototype

5~30mm 중 하나의 명확한 사용 시나리오를 선택한다.

예: `숨겨진 캐리어 후크가 자동으로 15mm 상승`

메커니즘 시연이 아니라 **실제 사용 행동 전후를 비교**한다.

# 14. 측정 항목

| 분류 | 측정값 |
| --- | --- |
| Motion | Stroke / RPM / 왕복 주기 / Dead Center |
| Precision | 반복 위치 오차 / Joint play |
| Mechanical | 필요 Torque / Guide friction / 하중 |
| Quality | 진동 / 소음 / 충격감 |
| Durability | 마모 / 축 흔들림 / 부싱·베어링 상태 |
| UX | 사용자 행동 수 / 필요한 힘 / 소요 시간 |

# 15. BOM 초안

| Part No. | Part | 역할 | 초기 버전 |
| --- | --- | --- | --- |
| P-001 | Frame / Guide | 전체 구조 지지·직선 구속 | 3D Print |
| P-002 | Crank | 회전 입력·스트로크 결정 | 3D Print |
| P-003 | Connecting Rod | 힘과 운동 전달 | 3D Print |
| P-004 | Slider | 직선 출력 | 3D Print |
| P-005 | Shaft / Pin | Revolute Joint 구현 | Metal 권장 |
| P-006 | Bushing / Bearing | 축 지지·마찰 관리 | 비교 실험 |
| P-007 | Washer / Spacer | 축방향 위치·간극 조정 | Standard part |
| P-008 | Retainer | 축 이탈 방지 | Snap ring / Nut 등 |

# 16. Design Review 질문

프로토타입을 만들 때 반드시 답한다.

- 이 제품에서 **왜 직선 왕복이 필요한가?**
- 사용자의 어떤 행동을 줄였는가?
- 필요한 실제 Stroke는 몇 mm인가?
- 왜 Slider-Crank이고 Cam / Rack / Scotch Yoke가 아닌가?
- 왜 이 Crank radius인가?
- Connecting rod 길이가 UX에 어떤 차이를 만드는가?
- Dead Center에서 필요한 torque는 충분한가?
- Slider 측압과 마찰은 허용 가능한가?
- Shaft / Pin은 왜 이 직경인가?
- Bushing과 Bearing 중 어느 것이 원가 대비 적합한가?
- 1,000회 / 10,000회 반복 후 어떤 부품이 먼저 마모되는가?
- 조립 단계를 줄일 수 있는가?

# 17. 이번 연구에서 얻은 핵심 인사이트

1. **Slider-Crank의 제품 가치는 왕복 그 자체보다 작은 직선 운동을 반복적으로 생성하는 능력에 있다.**
2. **5~30mm의 작은 Stroke는 팝업, 래치, 자동 복귀, 미세 전개 같은 Mechanical UX에 특히 유용할 가능성이 있다.**
3. **회전 중심과 작동점의 어긋남이 주기적 변위를 만든다.** 편심 개념은 Slider-Crank를 이해하는 핵심 사고방식이다.
4. **Joint와 Part를 구분해야 실제 설계가 가능하다.** Revolute는 운동 조건이고 Shaft, Pin, Bushing, Bearing은 이를 구현하는 부품이다.
5. **좋은 제품은 메커니즘을 보여주는 것이 아니라 사용자의 물리 행동을 줄인다.** 따라서 다음 연구는 실제 문제에서 시작해야 한다.
