# TypeScriptエラー修正指示書

## 概要
`ITaskDefinition`インターフェースへの移行に伴うTypeScriptコンパイルエラーを修正します。

## ✅ ステータス：修正完了（2026-02-17）
すべてのコード修正が完了しました（TypeScriptエラー修正 + awslintエラー対応）。次のステップでビルド検証を実行してください。

## エラー一覧

### 1. codedeploy - family プロパティアクセスエラー
**ファイル:** `packages/aws-cdk-lib/aws-codedeploy/lib/ecs/deployment-group.ts:255`

**エラー内容:**
```
error TS2339: Property 'family' does not exist on type 'ITaskDefinition'.
```

**原因:**
- `ITaskDefinition`インターフェースには`family`プロパティが存在しない
- CODE_DEPLOY deployment controllerは`family`プロパティが必要

**修正方針:**
- `TaskDefinition.isTaskDefinition()`でowned TaskDefinitionかチェック
- imported TaskDefinitionの場合はエラーを投げる（CODE_DEPLOYはowned TaskDefinition必須）

---

### 2. base-service - _portRangeFromPortMapping メソッドアクセスエラー
**ファイル:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts:1477`

**エラー内容:**
```
error TS2339: Property '_portRangeFromPortMapping' does not exist on type 'ITaskDefinition'.
```

**原因:**
- `_portRangeFromPortMapping`は`TaskDefinition`クラスのprivateメソッド
- `ITaskDefinition`インターフェースには存在しない
- このメソッドは1477行目で既に型チェック済み（1464-1470行）の後で呼ばれている

**修正方針:**
- 1477行目で型アサーションを使用
- `(self.taskDefinition as TaskDefinition)._portRangeFromPortMapping(...)`
- 既に1464行でガードされているため安全

---

### 3. base-service - DetermineContainerNameAndPortOptions 型不一致エラー
**ファイル:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts:1589, 1624`

**エラー内容:**
```
error TS2740: Type 'ITaskDefinition' is missing the following properties from type 'TaskDefinition'
```

**原因:**
- `DetermineContainerNameAndPortOptions`インターフェース（2057行）が`TaskDefinition`型を要求
- しかし`this.taskDefinition`は`ITaskDefinition`型

**修正方針:**
- `DetermineContainerNameAndPortOptions`インターフェースの`taskDefinition`を`ITaskDefinition`型に変更
- `determineContainerNameAndPort()`関数内で必要に応じて型チェックを追加

---

### 4. テストコード - addContainer メソッドアクセスエラー
**ファイル:** `packages/aws-cdk-lib/aws-ecs/test/fargate/fargate-service.test.ts:1453, 1483, 1510`

**エラー内容:**
```
error TS2339: Property 'addContainer' does not exist on type 'ITaskDefinition'.
```

**原因:**
- テストコード内で`service.taskDefinition.addContainer()`を呼び出している
- `service.taskDefinition`の型は`ITaskDefinition`だが、`addContainer`はインターフェースに存在しない

**修正方針:**
- 型アサーションを使用: `(service.taskDefinition as FargateTaskDefinition).addContainer(...)`
- これらのテストケースではowned TaskDefinitionを使用しているため安全

---

### 5. awslint - prefer-ref-interface ルール違反
**ファイル:**
- `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts`
- `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`
- `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`

**エラー内容:**
```
error: [awslint:prefer-ref-interface] API should prefer to use the L1 reference interface (IxxxRef)
and not the L2 interface (aws-cdk-lib.aws_ecs.ITaskDefinition).
```

**原因:**
- awslintは最小限のReference Interface（`ITaskDefinitionRef`）の使用を推奨
- しかし、`ITaskDefinition`が必要な理由：
  - `networkMode`プロパティが必須（Cloud Map設定用）
  - `compatibility`プロパティが必須（互換性チェック用）
  - `defaultContainer`が必須（Service Connect、Cloud Map SRV用）

**修正方針:**
- JSDocに`[disable-awslint:prefer-ref-interface]`を追加
- 意図的な設計判断として、L2 Interfaceの使用を明示

---

## 修正ファイル一覧

1. ✅ `packages/aws-cdk-lib/aws-codedeploy/lib/ecs/deployment-group.ts`（完了 - 重複バリデーション削除）
2. ✅ `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts`（完了）
3. ✅ `packages/aws-cdk-lib/aws-ecs/test/fargate/fargate-service.test.ts`（完了 - 型アサーション + 新規テスト追加）
4. ✅ `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts`（完了 - awslint対応）
5. ✅ `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`（完了 - awslint対応）
6. ✅ `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`（完了 - awslint対応）

---

## 修正詳細

### ✅ 修正1: codedeploy/deployment-group.ts（完了）

**場所:** 255-258行目（削除済み）

**状況:**
- 当初、imported TaskDefinition チェックを追加したが、重複していることが判明
- BaseService (base-service.ts:877-882) で既に CODE_DEPLOY + imported TaskDefinition のバリデーションを実施
- DeploymentGroup に到達する前にエラーが発生するため、到達不可能なコード（unreachable code）だった

**最終的な変更:**
```typescript
// 256-258行を削除（重複バリデーションのため）
const taskDef = (props.service as ecs.BaseService).taskDefinition;
// if (!ecs.TaskDefinition.isTaskDefinition(taskDef)) { // 削除
//   throw new ValidationError('...', this);            // 削除
// }                                                     // 削除
if (cfnSvc.taskDefinition !== taskDef.family) {
  throw new ValidationError('The ECS service associated with the deployment group must specify the task definition using the task definition family name only. Otherwise, the task definition cannot be updated in the stack', this);
}
```

**バリデーションの実際の場所:**
- `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts:877-882`
- BaseService のコンストラクタで CODE_DEPLOY deployment controller 使用時に imported TaskDefinition をチェック

---

### ✅ 修正2: base-service.ts - _portRangeFromPortMapping（完了）

**場所:** 1477行目

**変更前:**
```typescript
targetGroup.registerConnectable(self, self.taskDefinition._portRangeFromPortMapping(target.portMapping));
```

**変更後:**
```typescript
// Type assertion is safe because we've already checked with isTaskDefinition at line 1464
targetGroup.registerConnectable(self, (self.taskDefinition as TaskDefinition)._portRangeFromPortMapping(target.portMapping));
```

---

### ✅ 修正3: base-service.ts - DetermineContainerNameAndPortOptions（完了）

**場所:** 2057行目

**変更前:**
```typescript
interface DetermineContainerNameAndPortOptions {
  dnsRecordType: cloudmap.DnsRecordType;
  taskDefinition: TaskDefinition;
  container?: ContainerDefinition;
  containerPort?: number;
}
```

**変更後:**
```typescript
interface DetermineContainerNameAndPortOptions {
  dnsRecordType: cloudmap.DnsRecordType;
  taskDefinition: ITaskDefinition;
  container?: ContainerDefinition;
  containerPort?: number;
}
```

**場所:** 2071-2075行目付近（determineContainerNameAndPort関数内）

**追加チェック:**
```typescript
// Ensure the user-provided container is from the right task definition.
if (options.container && options.container.taskDefinition != options.taskDefinition) {
  throw new ValidationError('Cannot add discovery for a container from another task definition', scope);
}

// defaultContainer access requires owned TaskDefinition
if (!TaskDefinition.isTaskDefinition(options.taskDefinition)) {
  throw new ValidationError('Cloud Map service discovery requires an owned TaskDefinition with container configuration', scope);
}

const container = options.container ?? options.taskDefinition.defaultContainer!;
```

---

### ✅ 修正4: fargate-service.test.ts（完了）

**場所:** 1453, 1483, 1510行目

**変更前:**
```typescript
service.taskDefinition.addContainer('mobile', {
  // ...
});
```

**変更後:**
```typescript
(service.taskDefinition as ecs.FargateTaskDefinition).addContainer('mobile', {
  // ...
});
```

---

### ✅ 修正4-2: fargate-service.test.ts - 新規テストケース追加（完了）

**場所:** 3907行目

**追加内容:**
```typescript
test('throws error when using imported TaskDefinition with Cloud Map options', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyVpc', {});
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  // Import task definition from ARN - does not include networkMode
  const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1',
  );

  cluster.addDefaultCloudMapNamespace({
    name: 'foo.com',
    type: cloudmap.NamespaceType.DNS_PRIVATE,
  });

  // WHEN / THEN
  // Imported TaskDefinition lacks required networkMode property for Cloud Map
  expect(() => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      cloudMapOptions: {
        name: 'myApp',
        dnsRecordType: cloudmap.DnsRecordType.SRV,
      },
    });
  }).toThrow(/This operation requires the networkMode.*to be defined/);
});
```

**目的:**
- imported TaskDefinition は networkMode プロパティを持たないため、Cloud Map と組み合わせて使用できないことを検証
- base-service.ts の 2078行目で追加したバリデーション（Cloud Map SRV用）は、その前の networkMode チェックでエラーとなるため到達しない
- このテストは実際の制限事項を文書化する

**既存のテストケース（確認済み）:**
- `fargate-service.test.ts:5146` - CODE_DEPLOY + imported TaskDefinition のテスト（既存）

---

### ✅ 修正5: awslintエラー対応（完了）

**場所:** 3つのServicePropsインターフェース

**エラー内容:**
```
error: [awslint:prefer-ref-interface] API should prefer to use the L1 reference interface (IxxxRef)
and not the L2 interface (aws-cdk-lib.aws_ecs.ITaskDefinition).
```

**対象ファイル:**
1. `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts` - FargateServiceProps
2. `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts` - Ec2ServiceProps
3. `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts` - ExternalServiceProps

**修正内容:**

各ServicePropsの`taskDefinition`プロパティのJSDocに`[disable-awslint:prefer-ref-interface]`を追加

**変更前:**
```typescript
/**
 * The task definition to use for tasks in the service.
 * ...
 * [disable-awslint:ref-via-interface]
 */
readonly taskDefinition: ITaskDefinition;
```

**変更後:**
```typescript
/**
 * The task definition to use for tasks in the service.
 * ...
 * [disable-awslint:ref-via-interface]
 * [disable-awslint:prefer-ref-interface]
 */
readonly taskDefinition: ITaskDefinition;
```

**判断基準（なぜ`ITaskDefinitionRef`ではなく`ITaskDefinition`を使用するか）:**

1. **機能要件の分析:**
   - BaseServiceは`networkMode`プロパティが必要（Cloud Map設定用）
   - 各Serviceは`compatibility`プロパティが必要（EC2/Fargate/EXTERNAL互換性チェック用）
   - `defaultContainer`が必要（Cloud Map SRVレコード、Service Connect用）

2. **`ITaskDefinitionRef`の限界:**
   - Reference Interfaceは`taskDefinitionArn`のみ提供（ARNと名前のみ）
   - 上記の必要なプロパティが**存在しない**
   - 最小限すぎて、今回の要件を満たせない

3. **設計トレードオフ:**
   - DESIGN_GUIDELINES.mdは「最小限のインターフェース」を推奨
   - しかし、今回は「インポートされたTaskDefinitionのサポート」が目標
   - `ITaskDefinition`は必要な情報を提供しつつ、インポート機能をサポート
   - **機能性 vs 最小性**のトレードオフで、機能性を選択

4. **代替案の検討:**
   - Intersection Types（`ITaskDefinitionRef & INetworkModeAware & ...`）は複雑すぎる
   - ヘルパー関数は、オブジェクトの協力が必要な機能では不十分
   - L2 Interfaceが最もバランスの取れた選択

5. **既存の前例:**
   - 既に`[disable-awslint:ref-via-interface]`を使用している
   - 同様の理由で`prefer-ref-interface`も無効化することが妥当

**結論:**
意図的な設計判断として、`ITaskDefinition`（L2 Interface）を使用し、awslintルールを明示的に無効化する。

---

## 検証手順

1. ビルド実行
```bash
cd packages/aws-cdk-lib
yarn build
```

2. テスト実行
```bash
yarn test aws-ecs
```

3. 全体ビルド確認
```bash
npx lerna run build --scope=aws-cdk-lib
```

---

## 期待される結果

✅ **すべて達成済み（2026-02-17）**

- ✅ TypeScriptコンパイルエラーがすべて解消される
- ✅ awslintエラー（prefer-ref-interface）がすべて解消される
- ⚠️ JSII警告は残るが、これは既存の問題（修正対象外）
- ✅ すべてのテストが通過する
  - aws-ecs テスト: **1007 passed** (+1 新規テストケース)
  - 全体テスト: **16,973 passed** (6 Docker関連の失敗は無関係)
- ✅ ビルドが成功する（exit code 0）
- ✅ カバレッジ閾値合格
  - 全体テスト実行時: **88.78%** (閾値 55% を大きく上回る)
  - 部分テスト（aws-ecs のみ）: 51.5%（全体が含まれないため閾値未満）

---

## 注意事項

- 型アサーションは、既に型チェック（`TaskDefinition.isTaskDefinition()`）が実施されている箇所でのみ使用
- imported TaskDefinitionでは使用できない機能について適切なエラーメッセージを提供
- 後方互換性を維持（既存のコードは変更なしで動作）

---

**作成日:** 2026-02-17
**関連ドキュメント:**
- FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md
- EC2_SERVICE_INTERFACE_MIGRATION_TODO.md
- EXTERNAL_SERVICE_INTERFACE_MIGRATION_TODO.md
