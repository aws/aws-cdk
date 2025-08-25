# AWS Batch L2 EnableExecuteCommand サポート 設計

## 1. アーキテクチャ概要

### クラス構造
```
IEcsContainerDefinition (interface)
    ↑
EcsContainerDefinitionBase (abstract class)
    ├── enableExecuteCommand?: boolean  [新規追加]
    ├── jobRole?: IRole                 [既存、ECS Exec権限追加必要]
    └── _renderContainerDefinition()
            ↑
        ├── EcsEc2ContainerDefinition
        └── EcsFargateContainerDefinition

EcsJobDefinition
    └── container: IEcsContainerDefinition
        └── _renderContainerDefinition() → ContainerProperties
```

## 2. インターフェース設計

### 2.1 EcsContainerDefinitionProps の拡張

```typescript
export interface EcsContainerDefinitionProps {
  // 既存のプロパティ...
  
  /**
   * Whether to enable execute command functionality for this container.
   * 
   * This allows you to use ECS Exec to access containers interactively.
   * 
   * When enabled, a default job role with required SSM permissions will be created
   * automatically if no job role is provided.
   * 
   * @default - undefined (uses CloudFormation default, which is false)
   * @see https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-exec.html
   */
  readonly enableExecuteCommand?: boolean;
}
```

### 2.2 IEcsContainerDefinition の拡張

```typescript
export interface IEcsContainerDefinition extends IConstruct {
  // 既存のプロパティ...
  
  /**
   * Whether to enable execute command functionality for this container.
   * 
   * @default - undefined
   */
  readonly enableExecuteCommand?: boolean;
}
```

## 3. 実装設計

### 3.1 EcsContainerDefinitionBase クラスの変更

```typescript
abstract class EcsContainerDefinitionBase extends Construct implements IEcsContainerDefinition {
  // 既存のプロパティ...
  public readonly enableExecuteCommand?: boolean;
  public readonly jobRole?: iam.IRole;

  constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
    super(scope, id);
    
    // 既存の初期化...
    this.enableExecuteCommand = props.enableExecuteCommand;
    
    // ECS Execが有効で、jobRoleが未指定の場合は自動作成
    if (props.enableExecuteCommand && !props.jobRole) {
      this.jobRole = this.createJobRoleWithEcsExecPermissions();
    } else {
      this.jobRole = props.jobRole;
      // ECS Execが有効な場合、既存のjobRoleに権限を追加
      if (props.enableExecuteCommand && this.jobRole) {
        this.addEcsExecPermissions(this.jobRole);
      }
    }
  }

  private createJobRoleWithEcsExecPermissions(): iam.IRole {
    const role = new iam.Role(this, 'JobRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: PhysicalName.GENERATE_IF_NEEDED,
    });
    
    this.addEcsExecPermissions(role);
    return role;
  }

  private addEcsExecPermissions(role: iam.IRole): void {
    // ECS Exec用のSSM権限を追加
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ssmmessages:CreateControlChannel',
        'ssmmessages:CreateDataChannel',
        'ssmmessages:OpenControlChannel',
        'ssmmessages:OpenDataChannel',
      ],
      resources: ['*'],
    }));
  }

  public _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty {
    return {
      // 既存のプロパティ...
      enableExecuteCommand: this.enableExecuteCommand,
      jobRoleArn: this.jobRole?.roleArn,
      // 他のプロパティ...
    };
  }
}
```

## 4. IAM権限設計

### 4.1 Task Role（Job Role）の権限
ECS Execを有効にする場合、以下の権限が必要：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4.2 権限の自動付与ロジック

1. **jobRoleが未指定の場合**：
   - ECS Execが有効なら、必要な権限を持つ新しいRoleを自動作成
   - ECS Execが無効なら、jobRoleはundefinedのまま

2. **jobRoleが指定されている場合**：
   - ECS Execが有効なら、既存のRoleに必要な権限を追加
   - ECS Execが無効なら、何もしない

### 4.3 Execution Roleについて
- Execution RoleはECS Execには直接関係ない
- 既存の実装のまま変更なし
- コンテナイメージの取得やログ出力のための権限のみ

## 5. CloudFormation マッピング

### 5.1 レンダリングフロー

1. ユーザーがコンテナ定義を作成
   ```typescript
   new EcsEc2ContainerDefinition(scope, 'Container', {
     enableExecuteCommand: true,
     // jobRoleは自動作成される
   });
   ```

2. 最終的なCloudFormationテンプレート
   ```yaml
   Type: AWS::Batch::JobDefinition
   Properties:
     Type: container
     ContainerProperties:
       EnableExecuteCommand: true
       JobRoleArn: !GetAtt JobRole.Arn  # 自動作成されたRole
       # 他のプロパティ
   ```

## 6. バリデーション設計

### 6.1 入力値検証
- `enableExecuteCommand`は`boolean`型のため、TypeScriptの型システムで自動的に検証
- jobRoleの権限チェックは実行時（CloudFormationデプロイ時）に行われる

### 6.2 警告メッセージ
- ECS Execを有効にした場合、セキュリティ上の考慮事項についてJSDocで警告

## 7. 後方互換性

### 7.1 既存コードへの影響
- 新規プロパティはオプショナルのため、既存コードは変更不要
- デフォルト値は`undefined`で、CloudFormationのデフォルト動作（false）に従う
- 既存のjobRoleの権限は、ECS Execが明示的に有効化されない限り変更されない

## 8. セキュリティ考慮事項

### 8.1 ECS Exec のセキュリティリスク
- コンテナへの直接アクセスを許可するため、以下のリスクがある：
  - 本番環境での誤操作
  - 機密情報へのアクセス
  - コンテナ内でのコマンド実行履歴

### 8.2 推奨事項
- 開発/テスト環境でのみ有効化を推奨
- 本番環境では慎重に検討
- CloudTrailでの監査ログ有効化を推奨
- 必要最小限の期間のみ有効化

### 8.3 デフォルト値
- デフォルトで無効（undefined → CloudFormationデフォルトのfalse）
- 明示的な有効化が必要で、意図しない有効化を防ぐ

## 9. テスト設計

### 9.1 ユニットテスト
- `enableExecuteCommand: true`の場合、jobRoleが自動作成されることを確認
- 自動作成されたjobRoleに正しいSSM権限があることを確認
- 既存のjobRoleに権限が追加されることを確認
- `enableExecuteCommand: false`またはundefinedの場合、jobRoleが作成されないことを確認

### 9.2 統合テスト
- CloudFormationテンプレートに`EnableExecuteCommand`が正しく出力されることを確認
- JobRoleArnが正しく設定されることを確認