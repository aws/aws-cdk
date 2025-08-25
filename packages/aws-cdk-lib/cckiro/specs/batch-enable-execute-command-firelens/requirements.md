# AWS Batch L2 EnableExecuteCommand サポート 要件

## 概要
AWS Batch Job DefinitionのL1レベルで追加された`EnableExecuteCommand`プロパティを、L2コンストラクトから設定できるようにする。

## 背景
CloudFormationで以下のプロパティが追加された：
- `ContainerProperties.EnableExecuteCommand`: ECS Exec機能を有効化
- `EcsTaskProperties.EnableExecuteCommand`: ECS Task定義でのECS Exec機能
- `MultiNodeContainerProperties.EnableExecuteCommand`: マルチノードジョブでのECS Exec
- `MultiNodeEcsTaskProperties.EnableExecuteCommand`: マルチノードECSタスクでのECS Exec

これにより、実行中のコンテナに対してインタラクティブなシェルアクセスが可能になる。

## 機能要件

### 1. EcsJobDefinition での EnableExecuteCommand サポート

#### 1.1 コンテナ定義レベルでの設定
- `EcsContainerDefinitionProps`に`enableExecuteCommand`プロパティを追加
  - 型: `boolean`（オプショナル）
  - デフォルト値: `undefined`（CloudFormationのデフォルトに従う）
- `EcsEc2ContainerDefinitionProps`と`EcsFargateContainerDefinitionProps`は`EcsContainerDefinitionProps`を継承しているため、自動的に利用可能になる
- `_renderContainerDefinition()`メソッドで`enableExecuteCommand`を`ContainerProperties`にマッピング

#### 1.2 実装の流れ
1. ユーザーがコンテナ定義作成時に`enableExecuteCommand`を設定
2. コンテナ定義が`EcsJobDefinition`に渡される
3. `EcsJobDefinition`がCloudFormationテンプレートを生成する際、コンテナの`enableExecuteCommand`が`ContainerProperties.EnableExecuteCommand`にマッピングされる

### 2. 実装詳細

#### 2.1 変更対象ファイル
- `aws-batch/lib/ecs-container-definition.ts`
  - `EcsContainerDefinitionProps`インターフェースに`enableExecuteCommand`プロパティを追加
  - `EcsContainerDefinitionBase`クラスに`enableExecuteCommand`フィールドを追加
  - `_renderContainerDefinition()`メソッドで`enableExecuteCommand`をレンダリング

#### 2.2 使用例
```typescript
// EC2コンテナでECS Execを有効化
const container = new batch.EcsEc2ContainerDefinition(this, 'Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
  cpu: 256,
  memory: cdk.Size.mebibytes(2048),
  enableExecuteCommand: true, // ECS Execを有効化
});

// Fargateコンテナでも同様
const fargateContainer = new batch.EcsFargateContainerDefinition(this, 'FargateContainer', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
  cpu: 0.25,
  memory: cdk.Size.mebibytes(512),
  enableExecuteCommand: true,
});
```

## 非機能要件

### 互換性
- 既存のコードに影響を与えない（すべて新規オプショナルプロパティ）
- 既存のJob Definitionの動作を変更しない
- デフォルト値は`undefined`とし、CloudFormationのデフォルト動作に従う

### ドキュメント
- 各プロパティにJSDocコメントを追加
- AWS公式ドキュメントへのリンクを含める
- 使用例をREADMEに追加

### テスト
- ユニットテスト：
  - `enableExecuteCommand`が正しくL1にマッピングされることを確認
  - デフォルト値（undefined）の動作確認
  - true/false設定時の動作確認
- 統合テスト：CloudFormationテンプレートが正しく生成されることを確認
- スナップショットテスト：生成されるテンプレートの回帰テスト

## 制約事項
- FirelensConfigurationのサポートは今回のスコープ外
- MultiNodeJobDefinitionのenableExecuteCommandサポートは今回のスコープ外
- ECS Task定義を使用するJob Definition（EcsTaskProperties）のL2サポートは現在存在しないため、対応しない

## 成功基準
1. EcsEc2ContainerDefinitionで`enableExecuteCommand`を設定できる
2. EcsFargateContainerDefinitionで`enableExecuteCommand`を設定できる
3. 設定した値がCloudFormationテンプレートの`ContainerProperties.EnableExecuteCommand`に正しく反映される
4. 既存のテストがすべてパスする
5. 新規追加したテストがすべてパスする
6. デフォルト動作（未指定時）が変更されない