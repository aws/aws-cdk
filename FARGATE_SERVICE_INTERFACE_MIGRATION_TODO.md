# FargateService Interface Migration TODO

## 概要
FargateServiceでインポートされたTaskDefinitionを使用できるようにするための修正タスク。
`TaskDefinition`具象クラスから`ITaskDefinition`インターフェースへの移行を行う。

## 目標
- FargateServiceのpropsで`ITaskDefinition`を受け入れる
- インポートされたTaskDefinitionでも基本機能が動作
- Owned TaskDefinitionでは完全な機能を維持
- JSII互換の型チェック実装

---

## Phase 1: TaskDefinition基盤の整備

### Task 1.1: TaskDefinitionに静的型チェックメソッドを追加
**File:** `packages/aws-cdk-lib/aws-ecs/lib/base/task-definition.ts`

- [ ] ファイル冒頭にSymbol定義を追加
```typescript
const TASK_DEFINITION_SYMBOL = Symbol.for('@aws-cdk/aws-ecs.TaskDefinition');
```

- [ ] `TaskDefinition`クラスに静的メソッドを追加
```typescript
/**
 * Return whether the given object is a TaskDefinition (owned construct)
 */
public static isTaskDefinition(x: any): x is TaskDefinition {
  return x !== null && typeof(x) === 'object' && TASK_DEFINITION_SYMBOL in x;
}
```

- [ ] `TaskDefinition`のコンストラクタ内でSymbolを設定
```typescript
constructor(scope: Construct, id: string, props: TaskDefinitionProps) {
  super(scope, id);
  // ... 既存のコード ...

  // Symbolを設定
  Object.defineProperty(this, TASK_DEFINITION_SYMBOL, { value: true });

  // ... 残りのコード ...
}
```

**検証:**
- [ ] ビルドが通ること
- [ ] `TaskDefinition.isTaskDefinition()`が正しく動作すること

---

## Phase 2: FargateServiceの修正

### Task 2.1: FargateServicePropsのtaskDefinition型を変更
**File:** `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts`

- [ ] `FargateServiceProps`インターフェースを修正
```typescript
export interface FargateServiceProps extends BaseServiceOptions {
  /**
   * The task definition to use for tasks in the service.
   *
   * You can use either an owned TaskDefinition or an imported one.
   */
  readonly taskDefinition: ITaskDefinition;  // ✅ 変更: TaskDefinition -> ITaskDefinition

  // ... 他のプロパティ
}
```

- [ ] importステートメントを確認・追加
```typescript
import type { ITaskDefinition, TaskDefinition } from '../base/task-definition';
```

### Task 2.2: FargateServiceコンストラクタの修正
**File:** `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts`

- [ ] ephemeralStorageGiBチェックを条件付きに変更
```typescript
// ✅ Owned TaskDefinitionの場合のみチェック
if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
  if (props.taskDefinition.ephemeralStorageGiB && isUnsupportedPlatformVersion) {
    throw new ValidationError(
      `The ephemeralStorageGiB feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later, got ${props.platformVersion}.`,
      scope
    );
  }
}
```

- [ ] pidModeチェックを条件付きに変更
```typescript
if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
  if (props.taskDefinition.pidMode && isUnsupportedPlatformVersion) {
    throw new ValidationError(
      `The pidMode feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later, got ${props.platformVersion}.`,
      scope
    );
  }
}
```

- [ ] referencesSecretJsonFieldバリデーションを条件付きに変更
```typescript
if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
  this.node.addValidation({
    validate: () => props.taskDefinition.referencesSecretJsonField && isUnsupportedPlatformVersion
      ? [`The task definition of this service uses at least one container that references a secret JSON field. This feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later.`]
      : [],
  });
}
```

- [ ] defaultContainerバリデーションを条件付きに変更
```typescript
if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
  this.node.addValidation({
    validate: () => !props.taskDefinition.defaultContainer
      ? ['A TaskDefinition must have at least one essential container']
      : [],
  });
} else {
  // インポートされたタスク定義の場合は情報メッセージを追加
  Annotations.of(this).addInfo(
    'Using an imported TaskDefinition. Some validations related to ephemeralStorage, pidMode, and container configuration will be skipped.'
  );
}
```

**検証:**
- [ ] ビルドが通ること
- [ ] 既存のテストが通ること

---

## Phase 3: BaseServiceの修正

### Task 3.1: BaseServiceのtaskDefinitionプロパティ型を変更
**File:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts`

- [ ] プロパティの型を変更
```typescript
/**
 * The task definition to use for tasks in the service.
 */
public readonly taskDefinition: ITaskDefinition;  // ✅ 変更: TaskDefinition -> ITaskDefinition
```

- [ ] コンストラクタのシグネチャを変更
```typescript
constructor(
  scope: Construct,
  id: string,
  props: BaseServiceProps,
  additionalProps: any,
  taskDefinition: ITaskDefinition) {  // ✅ 変更: TaskDefinition -> ITaskDefinition
  // ...
}
```

- [ ] importステートメントを確認・追加
```typescript
import type { ITaskDefinition, TaskDefinition } from '../base/task-definition';
```

### Task 3.2: Execute Command関連メソッドの修正
**File:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts`

- [ ] `enableExecuteCommand()`メソッドを修正
```typescript
private enableExecuteCommand() {
  // ✅ Owned TaskDefinitionの場合のみポリシー追加
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    Annotations.of(this).addInfo(
      'Using an imported TaskDefinition. Execute Command SSM permissions must be manually configured on the task role.'
    );
    return;
  }

  this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
    actions: [
      'ssmmessages:CreateControlChannel',
      'ssmmessages:CreateDataChannel',
      'ssmmessages:OpenControlChannel',
      'ssmmessages:OpenDataChannel',
    ],
    resources: ['*'],
  }));
}
```

- [ ] `executeCommandLogConfiguration()`メソッドを修正
```typescript
private executeCommandLogConfiguration() {
  // ✅ Owned TaskDefinitionの場合のみポリシー追加
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    Annotations.of(this).addInfo(
      'Using an imported TaskDefinition. Execute Command permissions must be manually configured on the task role.'
    );
    return;
  }

  const reducePermissions = FeatureFlags.of(this).isEnabled(cxapi.REDUCE_EC2_FARGATE_CLOUDWATCH_PERMISSIONS);
  const logConfiguration = this.cluster.executeCommandConfiguration?.logConfiguration;

  // ... 既存のポリシー追加コード ...
}
```

- [ ] `enableExecuteCommandEncryption()`メソッドを修正
```typescript
private enableExecuteCommandEncryption(logging: ExecuteCommandLogging) {
  // ✅ Owned TaskDefinitionの場合のみポリシー追加
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    return;
  }

  this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
    actions: [
      'kms:Decrypt',
      'kms:GenerateDataKey',
    ],
    resources: [`${this.cluster.executeCommandConfiguration?.kmsKey?.keyArn}`],
  }));

  // ... 残りのコード ...
}
```

### Task 3.3: Service Connect関連メソッドの修正
**File:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts`

- [ ] `validateServiceConnectConfiguration()`メソッドを修正
```typescript
private validateServiceConnectConfiguration(config?: ServiceConnectProps) {
  // ✅ defaultContainerチェック
  const hasDefaultContainer = TaskDefinition.isTaskDefinition(this.taskDefinition) &&
                              this.taskDefinition.defaultContainer !== undefined;

  if (!hasDefaultContainer) {
    throw new ValidationError('Task definition must have at least one container to enable service connect.', this);
  }

  if ((!config || !config.namespace) && !this.cluster.defaultCloudMapNamespace) {
    throw new ValidationError('Namespace must be defined either in serviceConnectConfig or cluster.defaultCloudMapNamespace', this);
  }

  if (!config || !config.services) {
    return;
  }

  // ✅ インポートされたタスク定義ではService Connectは使用不可
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    throw new ValidationError(
      'Service Connect requires an owned TaskDefinition. Cannot use imported task definitions with Service Connect.',
      this
    );
  }

  // ... 残りのバリデーション ...
}
```

- [ ] `enableServiceConnect()`メソッドのservices配列生成部分を修正
```typescript
// ✅ Owned TaskDefinitionの場合のみfindPortMappingByNameを使用
const services = cfg.services?.map(svc => {
  let containerPort: number | undefined;

  if (TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    containerPort = this.taskDefinition.findPortMappingByName(svc.portMappingName)?.containerPort;
    if (!containerPort) {
      throw new ValidationError(`Port mapping with name ${svc.portMappingName} does not exist.`, this);
    }
  } else {
    throw new ValidationError(
      'Service Connect requires an owned TaskDefinition. Cannot use imported task definitions with Service Connect.',
      this
    );
  }

  // ... 残りのコード ...
});
```

- [ ] `enableServiceConnect()`メソッドのlogConfig部分を修正
```typescript
let logConfig: LogDriverConfig | undefined;

// ✅ defaultContainerチェック
const hasDefaultContainer = TaskDefinition.isTaskDefinition(this.taskDefinition) &&
                            this.taskDefinition.defaultContainer !== undefined;

if (cfg.logDriver && hasDefaultContainer) {
  const taskDef = this.taskDefinition as TaskDefinition;
  logConfig = cfg.logDriver.bind(this, taskDef.defaultContainer!);
}
```

### Task 3.4: Load Balancer関連メソッドの修正
**File:** `packages/aws-cdk-lib/aws-ecs/lib/base/base-service.ts`

- [ ] `loadBalancerTarget()`メソッドを修正
```typescript
public loadBalancerTarget(options: LoadBalancerTargetOptions): IEcsLoadBalancerTarget {
  if (options.alternateTarget && !this.isEcsDeploymentController) {
    throw new ValidationError('Deployment lifecycle hooks requires the ECS deployment controller.', this);
  }

  // ✅ _validateTargetはOwned TaskDefinitionでのみ使用可能
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition)) {
    throw new ValidationError(
      'Cannot create load balancer target from imported TaskDefinition. ' +
      'Use a concrete TaskDefinition created in this stack.',
      this
    );
  }

  const self = this;
  const target = this.taskDefinition._validateTarget(options);
  // ... 残りのコード ...
}
```

- [ ] `defaultLoadBalancerTarget`ゲッターを修正
```typescript
private get defaultLoadBalancerTarget() {
  // ✅ defaultContainerチェック
  if (!TaskDefinition.isTaskDefinition(this.taskDefinition) ||
      !this.taskDefinition.defaultContainer) {
    throw new ValidationError(
      'Cannot create default load balancer target. TaskDefinition must have a default container.',
      this
    );
  }

  return this.loadBalancerTarget({
    containerName: this.taskDefinition.defaultContainer.containerName,
  });
}
```

**検証:**
- [ ] ビルドが通ること
- [ ] 既存のテストが通ること

---

## Phase 4: テストの追加

### Task 4.1: FargateServiceのテスト追加
**File:** `packages/aws-cdk-lib/aws-ecs/test/fargate/fargate-service.test.ts`

- [ ] インポートされたTaskDefinitionでFargateServiceを作成するテストを追加
```typescript
test('can create FargateService with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    TaskDefinition: 'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1',
  });
});
```

- [ ] インポートされたTaskDefinitionでバリデーションがスキップされることを確認
```typescript
test('skips ephemeralStorage validation for imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN/THEN - エラーにならないこと
  expect(() => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition: taskDef,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_3,
    });
  }).not.toThrow();
});
```

- [ ] Service Connectがインポートされたタスク定義でエラーになることを確認
```typescript
test('throws error when using Service Connect with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc,
    defaultCloudMapNamespace: { name: 'test' },
  });

  const taskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  const service = new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // WHEN/THEN
  expect(() => {
    service.enableServiceConnect();
  }).toThrow(/Service Connect requires an owned TaskDefinition/);
});
```

### Task 4.2: BaseServiceのテスト追加
**File:** `packages/aws-cdk-lib/aws-ecs/test/base-service.test.ts`

- [ ] Execute Commandがインポートされたタスク定義で警告を出すことを確認
```typescript
test('adds info annotation when using Execute Command with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
    enableExecuteCommand: true,
  });

  // THEN
  const annotations = Annotations.fromStack(stack);
  annotations.hasInfo('/Default/Service', Match.stringLikeRegexp('.*Execute Command.*manually configured.*'));
});
```

- [ ] Load Balancer Targetがインポートされたタスク定義でエラーになることを確認
```typescript
test('throws error when creating load balancer target with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  const service = new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // WHEN/THEN
  expect(() => {
    service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
    });
  }).toThrow(/Cannot create load balancer target from imported TaskDefinition/);
});
```

**検証:**
- [ ] すべてのテストが通ること
- [ ] カバレッジが適切であること

---

## Phase 5: インテグレーションテストの追加

### Task 5.1: インテグレーションテストの作成
**File:** `packages/@aws-cdk/aws-ecs-v2-alpha/test/integ.fargate-service-imported-taskdef.ts`

- [ ] インポートされたタスク定義を使用するインテグレーションテストを作成
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'IntegTestImportedTaskDef');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// まずタスク定義を作成
const taskDef = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDef.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ containerPort: 80 }],
});

// 別のスタックでインポート
const stack2 = new cdk.Stack(app, 'IntegTestImportedTaskDefConsumer');
const vpc2 = ec2.Vpc.fromLookup(stack2, 'Vpc', { isDefault: true });
const cluster2 = new ecs.Cluster(stack2, 'Cluster', { vpc: vpc2 });

const importedTaskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
  stack2,
  'ImportedTaskDef',
  taskDef.taskDefinitionArn,
);

new ecs.FargateService(stack2, 'Service', {
  cluster: cluster2,
  taskDefinition: importedTaskDef,
});

app.synth();
```

**検証:**
- [ ] インテグレーションテストが実行できること
- [ ] デプロイが成功すること

---

## Phase 6: ドキュメントの更新

### Task 6.1: READMEの更新
**File:** `packages/aws-cdk-lib/aws-ecs/README.md`

- [ ] インポートされたタスク定義の使用例を追加
```markdown
### Using Imported Task Definitions

You can use task definitions that are imported from existing resources:

```typescript
const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
  this,
  'ImportedTaskDef',
  'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
);

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
});
```

**Limitations when using imported task definitions:**

- Service Connect is not supported
- Load balancer targets cannot be automatically configured
- Execute Command requires manual IAM permissions configuration
- Some validations (ephemeralStorage, pidMode, etc.) are skipped
```

- [ ] 制限事項のセクションを追加
```markdown
### Limitations with Imported Task Definitions

When using imported task definitions (`fromFargateTaskDefinitionArn`),
the following features are not available:

1. **Service Connect**: Requires an owned task definition with port mappings
2. **Automatic Load Balancer Configuration**: Container information is not available
3. **Execute Command Permissions**: IAM policies must be manually configured on the task role
4. **Advanced Validations**: Some platform version validations are skipped

For full functionality, create task definitions within your CDK stack.
```

### Task 6.2: APIドキュメントの更新
**File:** `packages/aws-cdk-lib/aws-ecs/lib/fargate/fargate-service.ts`

- [ ] `FargateServiceProps.taskDefinition`のドキュメントを更新
```typescript
/**
 * The task definition to use for tasks in the service.
 *
 * You can use either an owned TaskDefinition (created in this stack) or an imported one
 * (using `FargateTaskDefinition.fromFargateTaskDefinitionArn()`).
 *
 * Note: Some features like Service Connect and automatic load balancer configuration
 * require an owned TaskDefinition.
 *
 * [disable-awslint:ref-via-interface]
 */
readonly taskDefinition: ITaskDefinition;
```

**検証:**
- [ ] ドキュメントがビルドできること
- [ ] 説明が明確であること

---

## Phase 7: 最終検証

### Task 7.1: ビルドとテスト
- [ ] `yarn build`が成功すること
- [ ] `yarn test`が成功すること
- [ ] `yarn integ-runner`が成功すること
- [ ] Lintエラーがないこと

### Task 7.2: 手動検証
- [ ] 新しいTaskDefinitionでFargateServiceが作成できること
- [ ] インポートされたTaskDefinitionでFargateServiceが作成できること
- [ ] Execute Commandが適切に動作すること（警告が表示されること）
- [ ] Service Connectが適切にエラーを返すこと

### Task 7.3: 後方互換性確認
- [ ] 既存のコードが変更なしで動作すること
- [ ] 既存のテストがすべて通ること
- [ ] 既存のインテグレーションテストが通ること

---

## Phase 8: クリーンアップ

### Task 8.1: コードレビュー準備
- [ ] コミットメッセージを整理
- [ ] 不要なコメントを削除
- [ ] コードフォーマットを統一

### Task 8.2: PRの作成
- [ ] PR説明を記載
- [ ] Breaking Changesを明記（なし）
- [ ] 関連Issueをリンク
- [ ] レビュワーをアサイン

---

## 注意事項

### JSII互換性
- `instanceof`の代わりに`Symbol.for()`ベースの型チェックを使用
- すべてのpublicメソッドはJSII互換であること

### エラーメッセージ
- ユーザーが理解しやすい明確なエラーメッセージを提供
- 回避策や代替手段を示唆

### 後方互換性
- 既存のコードは変更なしで動作すること
- 新しい機能はオプトイン形式

### ドキュメント
- すべての変更をREADMEに記載
- 制限事項を明確に説明
- コード例を提供

---

## 完了条件

- [ ] すべてのPhaseのタスクが完了
- [ ] すべてのテストが通過
- [ ] ドキュメントが更新済み
- [ ] コードレビューが完了
- [ ] PRがマージ済み

---

## 関連リンク

- [DESIGN_GUIDELINES.md](/home/m5295/work/github-letsgomeow/aws-cdk/docs/DESIGN_GUIDELINES.md)
- [aws-ecs README](../packages/aws-cdk-lib/aws-ecs/README.md)

---

**作成日:** 2026-02-12
**最終更新:** 2026-02-12
