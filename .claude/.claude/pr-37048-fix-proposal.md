# PR #37048 マージ修正案

## 背景

`ValidationError` のコンストラクタシグネチャが main ブランチで変更された。

| 旧 (HEAD/feature branch) | 新 (main) |
|---|---|
| `new ValidationError(msg: string, scope: IConstruct)` | `new ValidationError(name: string, msg: string, scope: IConstruct)` |

`packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts` を手動マージした際に以下2種類の問題が残っている。

---

## 問題1: マージコンフリクトマーカーが残存 (2箇所)

### 箇所A: `validateServiceConnectConfiguration` 冒頭 (約1203行目)

```
<<<<<<< HEAD
    const hasDefaultContainer = TaskDefinition.isTaskDefinition(this.taskDefinition) &&
      this.taskDefinition.defaultContainer !== undefined;

    if (!hasDefaultContainer) {
      throw new ValidationError('Task definition must have at least one container to enable service connect.', this);
=======
    if (!this.taskDefinition.defaultContainer) {
      throw new ValidationError('TaskDefinitionLeastContainer', 'Task definition must have at least one container to enable service connect.', this);
>>>>>>> main
```

**修正方針**: HEAD 側を採用する。`taskDefinition` はコンストラクタで `ITaskDefinition` を受け付けるように変更されており、`defaultContainer` は `TaskDefinition` クラス固有のメンバーのため `isTaskDefinition()` で型ガードする。エラー名は main 側のものを採用。

**修正後:**
```typescript
    const hasDefaultContainer = TaskDefinition.isTaskDefinition(this.taskDefinition) &&
      this.taskDefinition.defaultContainer !== undefined;

    if (!hasDefaultContainer) {
      throw new ValidationError('TaskDefinitionLeastContainer', 'Task definition must have at least one container to enable service connect.', this);
    }
```

---

### 箇所B: `config.services.forEach` 内のポートマッピング確認 (約1240行目)

```
<<<<<<< HEAD
      if (!(this.taskDefinition as TaskDefinition).findPortMappingByName(serviceConnectService.portMappingName)) {
        throw new ValidationError(`Port Mapping '${serviceConnectService.portMappingName}' does not exist on the task definition.`, this);
=======
      if (!this.taskDefinition.findPortMappingByName(serviceConnectService.portMappingName)) {
        throw new ValidationError('PortMappingDoesExist', `Port Mapping '${serviceConnectService.portMappingName}' does not exist on the task definition.`, this);
>>>>>>> main
```

**修正方針**: HEAD 側を採用する。`findPortMappingByName` は `ITaskDefinition` にないため `as TaskDefinition` キャストは維持。エラー名は main 側のものを採用。

**修正後:**
```typescript
      if (!(this.taskDefinition as TaskDefinition).findPortMappingByName(serviceConnectService.portMappingName)) {
        throw new ValidationError('PortMappingDoesExist', `Port Mapping '${serviceConnectService.portMappingName}' does not exist on the task definition.`, this);
      }
```

---

## 問題2: 旧シグネチャ (2引数) の `ValidationError` 呼び出しが残存 (6箇所)

これらは HEAD 側のコードとして取り込まれたが、エラー名 (`name`) が欠落しているためコンパイルエラーになる。

### 箇所1: CODE_DEPLOY + imported TaskDefinition チェック (約887行目)

**現状:**
```typescript
        throw new ValidationError(
          'CODE_DEPLOY deployment controller requires an owned TaskDefinition. Cannot use imported task definitions.',
          this,
        );
```

**修正後:**
```typescript
        throw new ValidationError(
          'CodeDeployRequiresOwnedTaskDefinition',
          'CODE_DEPLOY deployment controller requires an owned TaskDefinition. Cannot use imported task definitions.',
          this,
        );
```

---

### 箇所2: taskDefinitionRevision + imported TaskDefinition チェック (約897行目)

**現状:**
```typescript
        throw new ValidationError(
          'taskDefinitionRevision requires an owned TaskDefinition. Cannot use imported task definitions.',
          this,
        );
```

**修正後:**
```typescript
        throw new ValidationError(
          'TaskDefinitionRevisionRequiresOwnedTaskDefinition',
          'taskDefinitionRevision requires an owned TaskDefinition. Cannot use imported task definitions.',
          this,
        );
```

---

### 箇所3: Service Connect + imported TaskDefinition チェック (約1231行目)

**現状:**
```typescript
      throw new ValidationError(
        'Service Connect requires an owned TaskDefinition. Cannot use imported task definitions with Service Connect.',
        this,
      );
```

**修正後:**
```typescript
      throw new ValidationError(
        'ServiceConnectRequiresOwnedTaskDefinition',
        'Service Connect requires an owned TaskDefinition. Cannot use imported task definitions with Service Connect.',
        this,
      );
```

---

### 箇所4: `loadBalancerTarget` + imported TaskDefinition チェック (約1519行目)

**現状:**
```typescript
      throw new ValidationError(
        'Cannot create load balancer target from imported TaskDefinition. ' +
        'Use a concrete TaskDefinition created in this stack.',
        this,
      );
```

**修正後:**
```typescript
      throw new ValidationError(
        'LoadBalancerTargetRequiresOwnedTaskDefinition',
        'Cannot create load balancer target from imported TaskDefinition. ' +
        'Use a concrete TaskDefinition created in this stack.',
        this,
      );
```

---

### 箇所5: `defaultLoadBalancerTarget` getter (約1826行目)

**現状:**
```typescript
      throw new ValidationError(
        'Cannot create default load balancer target. TaskDefinition must have a default container.',
        this,
      );
```

**修正後:**
```typescript
      throw new ValidationError(
        'DefaultLoadBalancerTargetRequiresDefaultContainer',
        'Cannot create default load balancer target. TaskDefinition must have a default container.',
        this,
      );
```

---

### 箇所6: Cloud Map + imported TaskDefinition チェック (約2132行目)

**現状:**
```typescript
      throw new ValidationError('Cloud Map service discovery requires an owned TaskDefinition with container configuration', scope);
```

**修正後:**
```typescript
      throw new ValidationError('CloudMapRequiresOwnedTaskDefinition', 'Cloud Map service discovery requires an owned TaskDefinition with container configuration', scope);
```

---

## 修正の全体フロー

1. **コンフリクト解消**: マーカー (`<<<<<<<`, `=======`, `>>>>>>>`) を削除し、main 側のコードを採用
2. **引数追加**: 旧 2引数呼び出し 6箇所に、先頭の `name` 文字列を追加
3. **コンパイル確認**: `cd packages/aws-cdk-lib && yarn build` でエラーがないことを確認
4. **テスト確認**: `cd packages/aws-cdk-lib && yarn test aws-ecs` でユニットテストが通ることを確認

---

## awslint 対応状況

### 完了: `prefer-ref-interface` を awslint.json に移動

以下3エントリを `packages/aws-cdk-lib/awslint.json` に追加し、各ファイルのインラインコメントを削除済み。

```json
"prefer-ref-interface:aws-cdk-lib.aws_ecs.Ec2ServiceProps.taskDefinition",
"prefer-ref-interface:aws-cdk-lib.aws_ecs.FargateServiceProps.taskDefinition",
"prefer-ref-interface:aws-cdk-lib.aws_ecs.ExternalServiceProps.taskDefinition",
```

### 要確認: `ref-via-interface` インラインコメントの扱い

以下3ファイルに `[disable-awslint:ref-via-interface]` のインラインコメントが残っている。

- `aws-ecs/lib/ec2/ec2-service.ts` (Ec2ServiceProps.taskDefinition)
- `aws-ecs/lib/fargate/fargate-service.ts` (FargateServiceProps.taskDefinition)
- `aws-ecs/lib/external/external-service.ts` (ExternalServiceProps.taskDefinition)

`awslint.json` には ECS 向けの `ref-via-interface` エントリが存在しないため、**インラインのままでよいか、awslint.json に移動すべきか**をメンテナに確認すること。

また、これら3つのプロパティはすでに `ITaskDefinition`（インターフェース）型を使っているため、`ref-via-interface` ルール（「コンクリートクラスではなくインターフェースを使うべき」）がそもそも適用されるべきか自体も確認する。

---

## 注意事項

- エラー名 (`name`) は他の `ValidationError` の命名規則に合わせて PascalCase のキャメルケース (単語を省略しない) を採用した
- 同一エラーIDが既存コードと重複しないよう確認済み
