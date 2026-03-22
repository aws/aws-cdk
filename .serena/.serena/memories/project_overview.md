# AWS CDK プロジェクト概要

## 目的
AWS Cloud Development Kit (AWS CDK) - TypeScript 製のオープンソース IaC フレームワーク。
CloudFormation テンプレートをプログラマブルに生成できる。jsii により Java/Python/C#/.NET 向けバインディングも生成。

## 技術スタック
- 言語: TypeScript (jsii)
- パッケージ管理: Yarn (v1) + Lerna + Nx
- テスト: Jest
- Linter: ESLint + pkglint + awslint
- ビルド: cdk-build-tools (tools/@aws-cdk/cdk-build-tools)
- Node.js: >= 20.x

## リポジトリ構成
```
packages/
  aws-cdk-lib/          # メインライブラリ (全サービスモジュール統合)
    aws-s3/             # 例: S3 モジュール (lib/, test/, index.ts)
    aws-lambda/
    core/               # CDK コア (Construct, Stack, App など)
    cx-api/             # Cloud Assembly API / Feature Flags
    ...                 # 200以上の AWS サービスモジュール
  @aws-cdk/             # 個別パッケージ (alpha/experimental)
  @aws-cdk-testing/     # テストユーティリティ
  aws-cdk/              # CDK CLI
  cdk/                  # CDK CLI エイリアス
tools/
  @aws-cdk/cdk-build-tools/   # ビルドツール
  @aws-cdk/pkglint/           # パッケージ規約チェック
  @aws-cdk/eslint-config/     # ESLint 設定
  @aws-cdk/spec2cdk/          # CloudFormation spec → CDK コード生成
scripts/                # CI/CD スクリプト
design/                 # RFC・設計ドキュメント
```

## モジュール構造 (例: aws-cdk-lib/aws-s3)
```
aws-s3/
  lib/
    bucket.ts           # メイン実装
    bucket-policy.ts
    s3.generated.ts     # CloudFormation spec から自動生成 (編集不可)
  test/
    bucket.test.ts      # Jest ユニットテスト
  index.ts              # 公開 API のエクスポート
  README.md
```
