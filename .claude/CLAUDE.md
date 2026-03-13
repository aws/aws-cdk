# AWS CDK プロジェクト - Claude Code ガイド

## プロジェクト概要

AWS Cloud Development Kit (CDK) - クラウドインフラをコードで定義し、AWS CloudFormationを通じてプロビジョニングするオープンソースフレームワーク。

- **リポジトリ**: https://github.com/aws/aws-cdk
- **ライセンス**: Apache-2.0
- **言語**: TypeScript (メイン)、Python、Java、.NET、Go対応

## 現在の作業

### Issue #36653: EKS v2 - KubectlProviderOptionsのSecurityGroupが無視される

**問題**:
- `KubectlProviderOptions`で`securityGroup`を指定しても無視される
- 代わりにEKS ClusterのSecurityGroupがKubectl Handler (Lambda)に適用されてしまう

**対象パッケージ**: `aws-cdk-lib/aws-eks-v2` (GA版 - Stable)

**修正箇所**:
1. `packages/aws-cdk-lib/aws-eks-v2/lib/cluster.ts`
2. `packages/aws-cdk-lib/aws-eks-v2/lib/kubectl-provider.ts`

**提案された解決策**:
- cluster.tsでKubectlProviderにsecurityGroupを渡す
- kubectl-provider.tsでpropsのsecurityGroupをlambda.Functionに設定

**重要**: EKS v2はすでにGA（General Availability）しているため、後方互換性を完全に維持する必要があります。

## 技術スタック

- **言語**: TypeScript 5.5.4
- **ランタイム**: Node.js >= 20.x (Active LTS推奨)
- **パッケージマネージャー**: Yarn (workspaces)
- **ビルドシステム**: Lerna monorepo + NX
- **テストフレームワーク**: Jest
- **TypeScript**: strict mode有効 (target: es2022)

## ディレクトリ構造

```
aws-cdk/
├── packages/
│   ├── aws-cdk-lib/           # メインライブラリ (V2 stable)
│   │   └── aws-eks-v2/        # ← 今回の作業対象 (GA版)
│   ├── @aws-cdk/              # アルファ版パッケージ
│   └── @aws-cdk-testing/      # テストパッケージ
├── tools/@aws-cdk/            # ビルドツール・linter
├── scripts/                   # スクリプト
└── docs/                      # ドキュメント
    └── DESIGN_GUIDELINES.md   # API設計ガイドライン
```

## 開発ワークフロー

### 1. ビルド

```bash
# プロジェクト全体
./build.sh                    # ビルド+テスト
./build.sh --skip-test        # ビルドのみ
./build.sh -f                 # 強制ビルド

# 個別パッケージ (aws-cdk-libは巨大なので時間がかかる)
cd packages/aws-cdk-lib
yarn build                    # ビルド
yarn build+test               # ビルド+テスト
```

### 2. テスト

```bash
yarn test                     # Jestでユニットテスト実行
```

新しいコードには必ずテストを追加：
- ユニットテスト: `*.test.ts`
- 統合テスト: `integ.*.ts`

### 3. Linting

```bash
yarn lint                     # ESLint
yarn pkglint                  # パッケージ構造チェック
```

Linterの種類：
- **ESLint**: コードスタイル
- **pkglint**: パッケージ構造・メタデータ
- **awslint**: AWS CDK設計ガイドライン準拠

### 4. タスク完了前のチェックリスト

**GA版のため、後方互換性は必須です！**

- [ ] ビルドが成功する (`yarn build`)
- [ ] **既存のすべてのテストがパスする** (`yarn test`) - 破壊的変更がないことの確認
- [ ] 新しい機能のテストを追加済み
- [ ] Linterエラーがない (`yarn lint`, `yarn pkglint`)
- [ ] 適切なドキュメントが追加されている (JSDoc、`@default`タグ)
- [ ] デザインガイドラインに準拠している
- [ ] 既存のデフォルト動作を変更していない
- [ ] 新しいプロパティはすべてオプショナル

## コーディング規約

### TypeScript設定

```typescript
// strict mode 有効
"strict": true
"noImplicitAny": true
"noImplicitReturns": true
"noUnusedLocals": true
"noUnusedParameters": true
"strictNullChecks": true
```

### 命名規則

- リソースクラス: `Foo` (例: `Cluster`, `KubectlProvider`)
- インターフェース: `IFoo` (例: `ICluster`)
- Props: `FooProps` (例: `ClusterProps`, `KubectlProviderProps`)
- 読み取り専用プロパティ: `readonly`キーワードを使用

### コードスタイル例

```typescript
/**
 * Properties for KubectlProvider
 */
export interface KubectlProviderProps {
  /**
   * Security group to associate with the Lambda function
   * @default - cluster security group is used
   */
  readonly securityGroup?: ec2.ISecurityGroup;
}

/**
 * Kubectl Provider implementation
 */
export class KubectlProvider extends Construct {
  constructor(scope: Construct, id: string, props: KubectlProviderProps) {
    super(scope, id);
    // implementation
  }
}
```

### ベストプラクティス

1. **イミュータビリティ**: propsは`readonly`
2. **デフォルト値**: 合理的なデフォルトを提供
3. **型安全性**: `any`を避け、厳密な型定義
4. **エラー処理**: 明確なエラーメッセージ、fail fast
5. **ドキュメント**: publicメソッド・プロパティにJSDoc

## デザインガイドライン (重要)

詳細は `docs/DESIGN_GUIDELINES.md` を参照。

### 主要原則

1. **Props設計**
   - フラットな構造
   - わかりやすく簡潔な命名
   - `@default`タグでデフォルト値を明記

2. **後方互換性 (重要)**
   - **GA版では既存APIの破壊的変更は絶対に避ける**
   - デフォルト動作を変更しない
   - 新しいオプションは常にオプショナルで、デフォルトは既存の動作を維持
   - 必要な場合は`@deprecated`タグを使用し、段階的に移行

3. **エラーメッセージ**
   - ユーザーがアクションを取れる情報を提供
   - 何が問題で、どう修正すべきかを明記

4. **テスト**
   - すべての公開APIをテスト
   - エッジケースも含める
   - 統合テストで実際のデプロイを検証

## Git ワークフロー

### コミット前

```bash
git status                    # 変更確認
git diff                      # 差分確認
```

### コミット規約

```
<type>(<scope>): <subject>

<body>

<footer>
```

例:
```
fix(eks-v2): respect securityGroup in KubectlProviderOptions

The securityGroup specified in KubectlProviderOptions was being
ignored and the cluster security group was used instead.

Fixes #36653
```

## 参考リソース

- [Contributing Guide](../CONTRIBUTING.md)
- [Design Guidelines](../docs/DESIGN_GUIDELINES.md)
- [AWS CDK Developer Guide](https://docs.aws.amazon.com/cdk/latest/guide)

## 注意事項

### GA (Stable) パッケージ

`aws-cdk-lib/aws-eks-v2`はGA版（安定版）：
- **後方互換性は必須** - 既存のユーザーコードを壊してはいけない
- セマンティックバージョニングに従う
- デフォルト動作の変更は破壊的変更とみなされる
- 新しいオプションは常にオプショナルで、既存動作を維持するデフォルト値を持つ
- 十分なテストカバレッジが必要

### セキュリティ

- SecurityGroupの扱いは慎重に
- デフォルトで安全な設定を提供
- ユーザーが明示的に指定した設定を尊重

### テストの重要性

EKS関連の変更は実際のAWS環境に影響し、GA版のため後方互換性が必須：
- **既存のすべてのテストがパスすることを確認** (破壊的変更がないことの証明)
- ユニットテストで新しい論理を検証
- 統合テストで実際のデプロイを確認
- 新しい機能には必ずテストを追加
- エッジケースやデフォルト動作のテストも含める

## よく使うコマンド

```bash
# パッケージに移動
cd packages/aws-cdk-lib

# ビルド+テスト (aws-cdk-libは大きいので時間がかかる)
yarn build+test

# watch mode
yarn watch

# Linting
yarn lint
yarn pkglint

# EKS v2のテストのみ実行
yarn test aws-eks-v2

# Git
git status
git diff
git log --oneline -10
```
