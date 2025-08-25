# AWS Batch L2 EnableExecuteCommand サポート 実装計画

## 実装ステップ

### ステップ 1: インターフェースの拡張

#### 1.1 `IEcsContainerDefinition` インターフェースの更新
**ファイル**: `aws-batch/lib/ecs-container-definition.ts`
- `enableExecuteCommand?: boolean` プロパティを追加
- JSDocコメントを追加

#### 1.2 `EcsContainerDefinitionProps` インターフェースの更新
**ファイル**: `aws-batch/lib/ecs-container-definition.ts`
- `enableExecuteCommand?: boolean` プロパティを追加
- 詳細なJSDocコメントを追加（セキュリティ警告含む）

### ステップ 2: 基底クラスの実装

#### 2.1 `EcsContainerDefinitionBase` クラスの更新
**ファイル**: `aws-batch/lib/ecs-container-definition.ts`

**追加するプロパティ**:
```typescript
public readonly enableExecuteCommand?: boolean;
```

**コンストラクタの変更**:
1. `enableExecuteCommand` プロパティの初期化
2. Job Role の自動作成/権限追加ロジックの実装

**追加するメソッド**:
```typescript
private createJobRoleWithEcsExecPermissions(): iam.IRole
private addEcsExecPermissions(role: iam.IRole): void
```

**`_renderContainerDefinition()` メソッドの更新**:
- `enableExecuteCommand` プロパティをレンダリング結果に追加

### ステップ 3: テストの作成

#### 3.1 ユニットテスト
**ファイル**: `aws-batch/test/ecs-container-definition.test.ts`

**テストケース**:
1. `enableExecuteCommand: true` でjobRole未指定の場合
   - 新しいjobRoleが作成される
   - jobRoleにSSM権限が付与される
   - CloudFormationテンプレートに正しく出力される

2. `enableExecuteCommand: true` でjobRole指定済みの場合
   - 既存のjobRoleにSSM権限が追加される
   - CloudFormationテンプレートに正しく出力される

3. `enableExecuteCommand: false` の場合
   - jobRoleは作成されない（未指定の場合）
   - CloudFormationテンプレートでfalseが出力される

4. `enableExecuteCommand` 未指定の場合
   - jobRoleは作成されない（未指定の場合）
   - CloudFormationテンプレートでプロパティが出力されない

#### 3.2 統合テスト
**ファイル**: `aws-batch/test/integ.ecs-job-definition.ts`

新しい統合テストを作成:
- ECS Execが有効なJob Definitionのデプロイ
- EC2とFargateの両方でテスト

### ステップ 4: ドキュメントの更新

#### 4.1 README の更新
**ファイル**: `aws-batch/README.md`

追加する内容:
- EnableExecuteCommand機能の説明
- 使用例（EC2とFargate）
- セキュリティに関する注意事項
- IAM権限の自動設定について

### ステップ 5: スナップショットテストの更新

#### 5.1 既存のスナップショット更新
- 新しいプロパティによる既存テストへの影響を確認
- 必要に応じてスナップショットを更新

## 実装の詳細

### Job Role 自動作成ロジック

```typescript
constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps) {
  super(scope, id);
  
  // ... 既存の初期化 ...
  
  this.enableExecuteCommand = props.enableExecuteCommand;
  
  // Job Role の処理
  if (props.enableExecuteCommand && !props.jobRole) {
    // ECS Exec有効で jobRole未指定 → 自動作成
    this.jobRole = this.createJobRoleWithEcsExecPermissions();
  } else if (props.enableExecuteCommand && props.jobRole) {
    // ECS Exec有効で jobRole指定済み → 権限追加
    this.jobRole = props.jobRole;
    this.addEcsExecPermissions(this.jobRole);
  } else {
    // ECS Exec無効 → そのまま使用
    this.jobRole = props.jobRole;
  }
  
  // ... 残りの初期化 ...
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
```

## 実装順序

1. **Phase 1**: コア実装
   - インターフェースの更新
   - 基底クラスの実装
   - 基本的なユニットテスト

2. **Phase 2**: テストとドキュメント
   - 追加のテストケース作成
   - 統合テスト作成
   - READMEの更新

3. **Phase 3**: 最終確認
   - lintの実行と修正
   - 全テストの実行
   - スナップショットの更新

## チェックリスト

- [ ] `IEcsContainerDefinition` インターフェース更新
- [ ] `EcsContainerDefinitionProps` インターフェース更新
- [ ] `EcsContainerDefinitionBase` クラス実装
- [ ] Job Role 自動作成ロジック実装
- [ ] SSM権限追加ロジック実装
- [ ] `_renderContainerDefinition()` メソッド更新
- [ ] ユニットテスト作成
- [ ] 統合テスト作成
- [ ] README更新
- [ ] JSDocコメント追加
- [ ] lintチェック
- [ ] 全テスト実行
- [ ] スナップショット更新

## リスクと対策

### リスク 1: 既存コードへの影響
**対策**: 
- すべての新規プロパティをオプショナルにする
- デフォルト値を明確に定義
- 既存のテストがパスすることを確認

### リスク 2: IAM権限の過剰付与
**対策**:
- 最小権限の原則に従う
- リソースを`*`にする必要性をドキュメント化
- セキュリティ警告を明確に記載

### リスク 3: 後方互換性の破壊
**対策**:
- 既存のAPIを変更しない
- 新機能はオプトイン方式にする
- 既存の動作をデフォルトにする