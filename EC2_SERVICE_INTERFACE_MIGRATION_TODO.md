# Ec2Service Interface Migration TODO

## 概要
Ec2ServiceでインポートされたTaskDefinitionを使用できるようにするための修正タスク。
`TaskDefinition`具象クラスから`ITaskDefinition`インターフェースへの移行を行う。

## 前提条件
- FargateServiceの修正（FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md）が完了していること
- Phase 1（TaskDefinition基盤の整備）が完了していること
- Phase 3（BaseServiceの修正）が完了していること

## 目標
- Ec2Serviceのpropsで`ITaskDefinition`を受け入れる
- インポートされたTaskDefinitionでも基本機能が動作
- Owned TaskDefinitionでは完全な機能を維持
- EC2固有の機能（placement strategies/constraints）は引き続きサポート

---

## Phase 1: Ec2ServicePropsの修正

### Task 1.1: Ec2ServicePropsのtaskDefinition型を変更
**File:** `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`

- [ ] importステートメントを確認・追加
```typescript
import type { ITaskDefinition, TaskDefinition } from '../base/task-definition';
```

- [ ] `Ec2ServiceProps`インターフェースを修正
```typescript
export interface Ec2ServiceProps extends BaseServiceOptions {
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

## Phase 2: Ec2Serviceコンストラクタの修正

### Task 2.1: 初期バリデーションの条件付き化
**File:** `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`

- [ ] isEc2Compatibleチェックを条件付きに変更
```typescript
constructor(scope: Construct, id: string, props: Ec2ServiceProps) {
  if (props.daemon && props.desiredCount !== undefined) {
    throw new ValidationError('Daemon mode launches one task on every instance. Don\'t supply desiredCount.', scope);
  }

  if (props.daemon && props.maxHealthyPercent !== undefined && props.maxHealthyPercent !== 100) {
    throw new ValidationError('Maximum percent must be 100 for daemon mode.', scope);
  }

  if (props.minHealthyPercent !== undefined && props.maxHealthyPercent !== undefined && props.minHealthyPercent >= props.maxHealthyPercent) {
    throw new ValidationError('Minimum healthy percent must be less than maximum healthy percent.', scope);
  }

  // ✅ Owned TaskDefinitionの場合のみEC2互換性チェック
  if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
    if (!props.taskDefinition.isEc2Compatible) {
      throw new ValidationError('Supplied TaskDefinition is not configured for compatibility with EC2', scope);
    }
  } else {
    // インポートされたタスク定義の場合は警告
    Annotations.of(scope).addInfo(
      'Using an imported TaskDefinition. EC2 compatibility cannot be verified. ' +
      'Ensure the task definition is configured for EC2 launch type.'
    );
  }

  if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
    throw new ValidationError('Only one of SecurityGroup or SecurityGroups can be populated.', scope);
  }

  // ... AvailabilityZoneRebalancingのバリデーションは変更なし ...

  super(scope, id, {
    // ... 既存のコード ...
  });
  // ... 残りのコード ...
}
```

### Task 2.2: defaultContainerバリデーションの条件付き化
**File:** `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`

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

this.node.addValidation({ validate: this.validateEc2Service.bind(this) });

// ... 残りのコード ...
```

**検証:**
- [ ] ビルドが通ること
- [ ] 既存のテストが通ること

---

## Phase 3: networkMode関連の修正

### Task 3.1: networkModeアクセスの安全化
**File:** `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`

- [ ] networkModeのチェックを条件付きに変更
```typescript
constructor(scope: Construct, id: string, props: Ec2ServiceProps) {
  // ... 前のバリデーション ...

  super(scope, id, {
    // ... 既存のコード ...
  });
  // Enhanced CDK Analytics Telemetry
  addConstructMetadata(this, props);

  this.daemon = props.daemon || false;
  this.availabilityZoneRebalancingEnabled = props.availabilityZoneRebalancing === AvailabilityZoneRebalancing.ENABLED;

  let securityGroups;
  if (props.securityGroup !== undefined) {
    securityGroups = [props.securityGroup];
  } else if (props.securityGroups !== undefined) {
    securityGroups = props.securityGroups;
  }

  // ✅ networkModeチェックを条件付きに
  if (TaskDefinition.isTaskDefinition(props.taskDefinition)) {
    if (props.taskDefinition.networkMode === NetworkMode.AWS_VPC) {
      this.configureAwsVpcNetworkingWithSecurityGroups(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, securityGroups);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroups from ASG.
      validateNoNetworkingProps(scope, props);
      this.connections.addSecurityGroup(...securityGroupsInThisStack(this, props.cluster.connections.securityGroups));
    }
  } else {
    // インポートされたタスク定義の場合
    if (props.vpcSubnets !== undefined || props.securityGroup !== undefined ||
        props.securityGroups !== undefined || props.assignPublicIp) {
      // ネットワーク設定が指定されている場合は、awsvpcモードを仮定
      Annotations.of(this).addInfo(
        'Using an imported TaskDefinition with networking configuration. ' +
        'Assuming awsvpc network mode. Verify the task definition uses awsvpc mode.'
      );
      this.configureAwsVpcNetworkingWithSecurityGroups(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, securityGroups);
    } else {
      // ネットワーク設定がない場合は、Bridge/Host/Noneモードを仮定
      this.connections.addSecurityGroup(...securityGroupsInThisStack(this, props.cluster.connections.securityGroups));
    }
  }

  // ... 残りのコード ...
}
```

**検証:**
- [ ] ビルドが通ること
- [ ] awsvpcモードのテストが通ること
- [ ] bridge/host/noneモードのテストが通ること

---

## Phase 4: テストの追加

### Task 4.1: Ec2Serviceのテスト追加
**File:** `packages/aws-cdk-lib/aws-ecs/test/ec2/ec2-service.test.ts`

- [ ] インポートされたTaskDefinitionでEc2Serviceを作成するテストを追加
```typescript
test('can create Ec2Service with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    TaskDefinition: 'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1',
    LaunchType: 'EC2',
  });
});
```

- [ ] EC2互換性チェックがスキップされることを確認
```typescript
test('skips EC2 compatibility validation for imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN/THEN - エラーにならないこと（EC2互換性チェックがスキップされる）
  expect(() => {
    new ecs.Ec2Service(stack, 'Service', {
      cluster,
      taskDefinition: taskDef,
    });
  }).not.toThrow();

  // 情報メッセージが追加されていることを確認
  const annotations = Annotations.fromStack(stack);
  annotations.hasInfo('*', Match.stringLikeRegexp('.*imported TaskDefinition.*EC2 compatibility.*'));
});
```

- [ ] defaultContainerバリデーションがスキップされることを確認
```typescript
test('skips defaultContainer validation for imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.Ec2Service(stack, 'Service', {
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

- [ ] インポートされたTaskDefinitionでネットワーク設定を使用した場合
```typescript
test('can use networking configuration with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
    assignPublicIp: true,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'ENABLED',
      },
    },
  });

  // awsvpcモードを仮定する情報メッセージが追加されていることを確認
  const annotations = Annotations.fromStack(stack);
  annotations.hasInfo('*', Match.stringLikeRegexp('.*awsvpc network mode.*'));
});
```

- [ ] placement strategies/constraintsは引き続き使用可能であることを確認
```typescript
test('can use placement strategies with imported TaskDefinition', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
    stack,
    'ImportedTaskDef',
    'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
  );

  // WHEN
  new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition: taskDef,
    placementStrategies: [
      ecs.PlacementStrategy.spreadAcrossInstances(),
      ecs.PlacementStrategy.packedByCpu(),
    ],
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    PlacementStrategies: [
      { Type: 'spread', Field: 'instanceId' },
      { Type: 'binpack', Field: 'cpu' },
    ],
  });
});
```

**検証:**
- [ ] すべてのテストが通ること
- [ ] カバレッジが適切であること

---

## Phase 5: ドキュメントの更新

### Task 5.1: READMEの更新
**File:** `packages/aws-cdk-lib/aws-ecs/README.md`

- [ ] Ec2Serviceでインポートされたタスク定義の使用例を追加
```markdown
### Using Imported Task Definitions with EC2 Service

You can use task definitions that are imported from existing resources with EC2 services:

```typescript
const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(
  this,
  'ImportedTaskDef',
  'arn:aws:ecs:us-east-1:123456789012:task-definition/my-task:1'
);

const service = new ecs.Ec2Service(this, 'Service', {
  cluster,
  taskDefinition,
  // Placement strategies and constraints are still supported
  placementStrategies: [
    ecs.PlacementStrategy.spreadAcrossInstances(),
  ],
});
```

**Notes for imported task definitions with EC2 services:**

- EC2 compatibility cannot be verified automatically
- Network mode cannot be determined (awsvpc is assumed if networking props are provided)
- Container configuration validations are skipped
- Placement strategies and constraints work normally
- For full functionality, create task definitions within your CDK stack
```

### Task 5.2: APIドキュメントの更新
**File:** `packages/aws-cdk-lib/aws-ecs/lib/ec2/ec2-service.ts`

- [ ] `Ec2ServiceProps.taskDefinition`のドキュメントを更新
```typescript
/**
 * The task definition to use for tasks in the service.
 *
 * You can use either an owned TaskDefinition (created in this stack) or an imported one
 * (using `TaskDefinition.fromTaskDefinitionArn()`).
 *
 * Note: When using imported task definitions, EC2 compatibility and network mode
 * cannot be verified automatically.
 *
 * [disable-awslint:ref-via-interface]
 */
readonly taskDefinition: ITaskDefinition;
```

**検証:**
- [ ] ドキュメントがビルドできること
- [ ] 説明が明確であること

---

## Phase 6: 最終検証

### Task 6.1: ビルドとテスト
- [ ] `yarn build`が成功すること
- [ ] `yarn test`が成功すること（aws-ecs関連）
- [ ] Lintエラーがないこと

### Task 6.2: 手動検証
- [ ] 新しいTaskDefinitionでEc2Serviceが作成できること
- [ ] インポートされたTaskDefinitionでEc2Serviceが作成できること
- [ ] placement strategies/constraintsが適切に動作すること
- [ ] ネットワーク設定が適切に動作すること

### Task 6.3: 後方互換性確認
- [ ] 既存のEc2Serviceコードが変更なしで動作すること
- [ ] 既存のテストがすべて通ること

---

## 注意事項

### EC2固有の考慮事項
- **Network Mode**: インポートされたタスク定義ではnetworkModeプロパティにアクセスできないため、ネットワーク設定プロパティの有無で判断
- **Placement**: placement strategiesとconstraintsはタスク定義に依存しないため、引き続きフルサポート
- **EC2 Compatibility**: インポートされたタスク定義ではisEc2Compatibleにアクセスできないため、情報メッセージで警告

### エラーメッセージ
- ユーザーが理解しやすい明確なメッセージを提供
- インポートされたタスク定義の制限事項を説明
- 必要に応じて代替手段を示唆

### 後方互換性
- 既存のコードは変更なしで動作すること
- 新しい機能はオプトイン形式

---

## 完了条件

- [ ] すべてのPhaseのタスクが完了
- [ ] すべてのテストが通過
- [ ] ドキュメントが更新済み
- [ ] FargateServiceの修正と整合性が取れている

---

## 関連リンク

- [FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md](./FARGATE_SERVICE_INTERFACE_MIGRATION_TODO.md)
- [EXTERNAL_SERVICE_INTERFACE_MIGRATION_TODO.md](./EXTERNAL_SERVICE_INTERFACE_MIGRATION_TODO.md)
- [DESIGN_GUIDELINES.md](./docs/DESIGN_GUIDELINES.md)

---

**作成日:** 2026-02-13
**最終更新:** 2026-02-13
