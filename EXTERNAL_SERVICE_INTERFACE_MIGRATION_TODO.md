# ExternalService Interface Migration TODO

## 概要
ExternalServiceでインポートされたTaskDefinitionを使用できるようにするための修正タスク。
`TaskDefinition`具象クラスから`ITaskDefinition`インターフェースへの移行を行う。

## 前提条件
- FargateServiceの修正（FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md）が完了していること
- Phase 1（TaskDefinition基盤の整備）が完了していること
- Phase 3（BaseServiceの修正）が完了していること

## 目標
- ExternalServiceのpropsで`ITaskDefinition`を受け入れる
- インポートされたTaskDefinitionでも基本機能が動作
- Owned TaskDefinitionでは完全な機能を維持
- ECS Anywhere固有の制限事項を適切に処理

---

## Phase 1: ExternalServicePropsの修正

### Task 1.1: ExternalServicePropsのtaskDefinition型を変更
**File:** `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`

- [ ] importステートメントを確認・追加
```typescript
import type { ITaskDefinition, TaskDefinition } from '../base/task-definition';
```

- [ ] `ExternalServiceProps`インターフェースを修正
```typescript
export interface ExternalServiceProps extends BaseServiceOptions {
  /**
   * The task definition to use for tasks in the service.
   *
   * You can use either an owned TaskDefinition or an imported one.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: ITaskDefinition;  // ✅ 変更: TaskDefinition -> ITaskDefinition

  // ... 他のプロパティ
}
```

**検証:**
- [ ] ビルドが通ること

---

## Phase 2: ExternalServiceコンストラクタの修正

### Task 2.1: 初期バリデーションの条件付き化
**File:** `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`

- [ ] compatibilityチェックを条件付きに変更
```typescript
constructor(scope: Construct, id: string, props: ExternalServiceProps) {
  if (props.daemon) {
    if (props.deploymentController?.type === DeploymentControllerType.EXTERNAL ||
      props.deploymentController?.type === DeploymentControllerType.CODE_DEPLOY) {
      throw new ValidationError('CODE_DEPLOY or EXTERNAL deployment controller types don\'t support the DAEMON scheduling strategy.', scope);
    }
    if (props.desiredCount !== undefined) {
      throw new ValidationError('Daemon mode launches one task on every instance. Cannot specify desiredCount when daemon mode is enabled.', scope);
    }
    if (props.maxHealthyPercent !== undefined && props.maxHealthyPercent !== 100) {
      throw new ValidationError('Maximum percent must be 100 when daemon mode is enabled.', scope);
    }
  }

  if (props.minHealthyPercent !== undefined && props.maxHealthyPercent !== undefined && props.minHealthyPercent >= props.maxHealthyPercent) {
    throw new ValidationError('Minimum healthy percent must be less than maximum healthy percent.', scope);
  }

  // ✅ Owned TaskDefinitionの場合のみEXTERNAL互換性チェック
  if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
    if (props.taskDefinition.compatibility !== Compatibility.EXTERNAL) {
      throw new ValidationError('Supplied TaskDefinition is not configured for compatibility with ECS Anywhere cluster', scope);
    }
  } else {
    // インポートされたタスク定義の場合は警告
    Annotations.of(scope).addInfo(
      'Using an imported TaskDefinition. EXTERNAL compatibility cannot be verified. ' +
      'Ensure the task definition is configured for ECS Anywhere (EXTERNAL launch type).'
    );
  }

  // ExternalService固有の制限チェック（変更なし）
  if (props.cluster.defaultCloudMapNamespace !== undefined) {
    throw new ValidationError(`Cloud map integration is not supported for External service ${props.cluster.defaultCloudMapNamespace}`, scope);
  }

  if (props.cloudMapOptions !== undefined) {
    throw new ValidationError('Cloud map options are not supported for External service', scope);
  }

  if (props.capacityProviderStrategies !== undefined) {
    throw new ValidationError('Capacity Providers are not supported for External service', scope);
  }

  const propagateTagsFromSource = props.propagateTags ?? PropagatedTagSource.NONE;

  super(scope, id, {
    // ... 既存のコード ...
  });
  // ... 残りのコード ...
}
```

### Task 2.2: defaultContainerバリデーションの条件付き化
**File:** `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`

- [ ] defaultContainerバリデーションを条件付きに変更
```typescript
// コンストラクタの最後の方
if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
  this.node.addValidation({
    validate: () => !this.taskDefinition.defaultContainer
      ? ['A TaskDefinition must have at least one essential container']
      : [],
  });
} else {
  // インポートされたタスク定義の場合は情報メッセージを追加
  Annotations.of(this).addInfo(
    'Using an imported TaskDefinition. Container configuration validations will be skipped.'
  );
}

// networkConfigurationバリデーションは変更なし
this.node.addValidation({
  validate: () => this.networkConfiguration !== undefined ? ['Network configurations not supported for an external service'] : [],
});

// ... 残りのコード ...
```

**検証:**
- [ ] ビルドが通ること
- [ ] 既存のテストが通ること

---

## Phase 3: テストの追加

### Task 3.1: ExternalServiceのテスト追加
**File:** `packages/aws-cdk-lib/aws-ecs/test/external/external-service.test.ts`

- [ ] インポートされたTaskDefinitionでExternalServiceを作成するテストを追加
```typescript
test('can create ExternalService with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    TaskDefinition: 'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1',
    LaunchType: 'EXTERNAL',
  });
});
```

- [ ] EXTERNAL互換性チェックがスキップされることを確認
```typescript
test('skips EXTERNAL compatibility validation for imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN/THEN - エラーにならないこと（EXTERNAL互換性チェックがスキップされる）
  expect(() => {
    new ecs.ExternalService(stack, 'Service', {
      cluster,
      taskDefinition: taskDef,
    });
  }).not.toThrow();

  // 情報メッセージが追加されていることを確認
  const annotations = Annotations.fromStack(stack);
  annotations.hasInfo('*', Match.stringLikeRegexp('.*imported TaskDefinition.*EXTERNAL compatibility.*'));
});
```

- [ ] defaultContainerバリデーションがスキップされることを確認
```typescript
test('skips defaultContainer validation for imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // THEN - エラーにならないこと
  expect(() => {
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ECS::Service', 1);
  }).not.toThrow();
});
```

- [ ] daemon modeとの組み合わせテスト
```typescript
test('can create ExternalService with daemon mode and imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
    daemon: true,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    SchedulingStrategy: 'DAEMON',
  });
});
```

- [ ] ExternalService固有の制限が引き続き機能することを確認
```typescript
test('load balancer target still throws error with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  const service = new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // WHEN/THEN
  expect(() => {
    service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
    });
  }).toThrow(/External service cannot be attached as load balancer targets/);
});

test('auto scaling still throws error with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  const service = new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // WHEN/THEN
  expect(() => {
    service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });
  }).toThrow(/Autoscaling not supported for external service/);
});

test('cloud map still throws error with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  const service = new ecs.ExternalService(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // WHEN/THEN
  expect(() => {
    service.enableCloudMap({
      name: 'myApp',
    });
  }).toThrow(/Cloud map integration not supported for an external service/);
});
```

**検証:**
- [ ] すべてのテストが通ること
- [ ] カバレッジが適切であること

---

## Phase 4: ドキュメントの更新

### Task 4.1: READMEの更新
**File:** `packages/aws-cdk-lib/aws-ecs/README.md`

- [ ] ExternalServiceでインポートされたタスク定義の使用例を追加
```markdown
### Using Imported Task Definitions with External Service (ECS Anywhere)

You can use task definitions that are imported from existing resources with External services:

```typescript
const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(
  this,
  'ImportedTaskDef',
  'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
);

const service = new ecs.ExternalService(this, 'Service', {
  cluster,
  taskDefinition,
  daemon: true, // Optional: use daemon scheduling strategy
});
```

**Notes for imported task definitions with External services:**

- EXTERNAL compatibility cannot be verified automatically
- Container configuration validations are skipped
- All External service limitations still apply (no load balancers, no auto scaling, no Cloud Map)
- For full functionality, create task definitions within your CDK stack
```

### Task 4.2: APIドキュメントの更新
**File:** `packages/aws-cdk-lib/aws-ecs/lib/external/external-service.ts`

- [ ] `ExternalServiceProps.taskDefinition`のドキュメントを更新
```typescript
/**
 * The task definition to use for tasks in the service.
 *
 * You can use either an owned TaskDefinition (created in this stack) or an imported one
 * (using `TaskDefinition.fromTaskDefinitionArn()`).
 *
 * Note: When using imported task definitions, EXTERNAL (ECS Anywhere) compatibility
 * cannot be verified automatically. Ensure the task definition is configured for
 * ECS Anywhere.
 *
 * [disable-awslint:ref-via-interface]
 */
readonly taskDefinition: ITaskDefinition;
```

**検証:**
- [ ] ドキュメントがビルドできること
- [ ] 説明が明確であること

---

## Phase 5: 最終検証

### Task 5.1: ビルドとテスト
- [ ] `yarn build`が成功すること
- [ ] `yarn test`が成功すること（aws-ecs関連）
- [ ] Lintエラーがないこと

### Task 5.2: 手動検証
- [ ] 新しいTaskDefinitionでExternalServiceが作成できること
- [ ] インポートされたTaskDefinitionでExternalServiceが作成できること
- [ ] daemon modeが適切に動作すること
- [ ] External service固有の制限が引き続き機能すること

### Task 5.3: 後方互換性確認
- [ ] 既存のExternalServiceコードが変更なしで動作すること
- [ ] 既存のテストがすべて通ること

---

## 注意事項

### ExternalService固有の考慮事項
- **ECS Anywhere**: インポートされたタスク定義ではcompatibilityプロパティにアクセスできないため、情報メッセージで警告
- **Network Mode**: ExternalServiceはBridgeモードのみサポート、configureAwsVpcNetworkingWithSecurityGroups()は既にエラーを投げる実装
- **制限事項**: Load Balancer、Auto Scaling、Cloud Mapの制限は変更なし（既にエラーを投げる実装）
- **Daemon Mode**: daemon modeはサポートされており、インポートされたタスク定義でも使用可能

### エラーメッセージ
- ユーザーが理解しやすい明確なメッセージを提供
- インポートされたタスク定義の制限事項を説明
- ECS Anywhereの要件を明確に伝える

### 後方互換性
- 既存のコードは変更なしで動作すること
- 新しい機能はオプトイン形式
- ExternalService固有の制限は維持

---

## 完了条件

- [ ] すべてのPhaseのタスクが完了
- [ ] すべてのテストが通過
- [ ] ドキュメントが更新済み
- [ ] FargateServiceとEc2Serviceの修正と整合性が取れている

---

## 関連リンク

- [FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md](./FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md)
- [EC2_SERVICE_INTERFACE_MIGRATION_TODO.md](./EC2_SERVICE_INTERFACE_MIGRATION_TODO.md)
- [DESIGN_GUIDELINES.md](./docs/DESIGN_GUIDELINES.md)

---

**作成日:** 2026-02-13
**最終更新:** 2026-02-13
