# AWS CDK プロジェクト概要

## 目的
AWS Cloud Development Kit (AWS CDK) の公式リポジトリ。TypeScript でインフラをコードとして定義し、CloudFormation テンプレートを生成するフレームワーク。

## テックスタック
- **言語**: TypeScript (Node.js >= 20.x)
- **パッケージマネージャ**: Yarn 1.x (ワークスペース機能使用)
- **モノレポ管理**: Lerna 8 + Nx 20
- **コンパイラ**: jsii (通常の tsc ではなく、多言語バインディング生成のため)
- **テスト**: Jest + ts-jest
- **TypeScript**: ~5.5.4、`target: es2022`、`module: commonjs`、strict モード有効

## ライセンス
Apache-2.0

## 多言語サポート
jsii を使って TypeScript ソースから Python、Java、.NET、Go の言語バインディングを自動生成。

## モノレポ構造
```
packages/
  aws-cdk-lib/          # メインライブラリ — 330+ の AWS サービスモジュール
  @aws-cdk/             # Alpha/実験的パッケージ (例: @aws-cdk/aws-glue-alpha)
  @aws-cdk-testing/     # インテグレーションテストフレームワーク (framework-integ/)
  awslint/              # AWS API リンター
tools/@aws-cdk/
  cdk-build-tools/      # コアビルドシステムと共有設定
  pkglint/              # package.json リンタールール
  eslint-config/        # 共有 ESLint 設定
scripts/                # ビルドユーティリティスクリプト
docs/
  DESIGN_GUIDELINES.md  # 新規コンストラクト作成時の必読ドキュメント
```

## コンストラクトの種類
- **L1 (Cfn*)**: CloudFormation spec から自動生成。`packages/aws-cdk-lib/aws-<service>/` に配置
- **L2**: L1 の上位に手書きで作成する高レベルの抽象
- **Alpha パッケージ**: `packages/@aws-cdk/aws-<service>-alpha/` の実験的モジュール

## jsii の制約
- 公開 API に TypeScript 固有の機能 (union types 等) を使用不可
- ビルド成果物は `.jsii` ファイルに格納
