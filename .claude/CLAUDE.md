# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code (claude.ai/code) へのガイダンスを提供します。

## リポジトリ概要

AWS Cloud Development Kit (AWS CDK) の TypeScript モノレポです。Lerna 8 + Nx 20 で管理されており、[jsii](https://github.com/aws/jsii/) を使って TypeScript ソースから多言語ライブラリ (Python、Java、.NET、Go) を生成します。Node.js >= 20.x と Yarn 1.x が必要です。

## ビルドコマンド

```bash
# 初回 / テスト込みフルビルド
yarn install
npx lerna run build --skip-nx-cache   # キャッシュを使わず強制フルビルド

# aws-cdk-lib とその依存関係のみビルド
npx lerna run build --scope=aws-cdk-lib

# パッケージ内でのビルドとテスト
cd packages/aws-cdk-lib
yarn build
yarn watch   # 開発中のインクリメンタルリビルド

# リポジトリ全体をビルド (Nx キャッシュ使用)
npx lerna run build
```

`JavaScript heap out of memory` が発生した場合:
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
```

## テストコマンド

```bash
# 特定モジュールのユニットテスト (例: aws-lambda)
cd packages/aws-cdk-lib
yarn test aws-lambda

# aws-cdk-lib 全ユニットテスト
cd packages/aws-cdk-lib
yarn test

# インテグレーションテスト (AWS 認証情報が必要)
cd packages/@aws-cdk-testing/framework-integ
yarn integ test/aws-lambda/test/integ.lambda.js --update-on-failed
```

## リントコマンド

3 つのリンターが `yarn build` の一部として実行されますが、個別にも実行できます:

```bash
# ESLint
cd packages/aws-cdk-lib
yarn eslint

# pkglint — package.json の構造と規約を検証
yarn pkglint         # チェック
yarn pkglint -f      # 自動修正

# awslint — AWS コンストラクトライブラリ設計ガイドライン (docs/DESIGN_GUIDELINES.md) を強制
yarn awslint
yarn awslint list    # 全ルール一覧
```

## コードサンプルの検証

README のコードサンプルを変更した場合:
```bash
/bin/bash ./scripts/run-rosetta.sh
```

## モノレポのレイアウト

```
packages/
  aws-cdk-lib/          # メインライブラリ — 330+ の AWS サービスモジュール (例: aws-lambda/, aws-iam/)
  @aws-cdk/             # Alpha/実験的パッケージ (例: @aws-cdk/aws-glue-alpha)
  @aws-cdk-testing/     # インテグレーションテストフレームワーク (framework-integ/)
  awslint/              # AWS API リンター
tools/@aws-cdk/
  cdk-build-tools/      # コアビルドシステムと共有設定 (eslintrc, jest 設定)
  pkglint/              # package.json リンタールール
  eslint-config/        # 共有 ESLint 設定
scripts/
  foreach.sh            # 全パッケージでコマンドを実行
  buildup               # 現在のパッケージ + 全依存関係をビルド
  builddown             # 現在のパッケージ + 全利用元をビルド
  check-api-compatibility.sh
  run-rosetta.sh
docs/
  DESIGN_GUIDELINES.md  # 新規コンストラクト作成時の必読ドキュメント — awslint で強制
```

## アーキテクチャ

**L1 コンストラクト (Cfn*)**: CloudFormation spec から自動生成。L2 コンストラクトと同じ `packages/aws-cdk-lib/aws-<service>/` に配置されます。

**L2 コンストラクト**: L1 の上位に手書きで作成する高レベルの抽象。各 AWS サービスモジュールは `packages/aws-cdk-lib/aws-<service>/` に存在し、`packages/aws-cdk-lib/index.ts` からエクスポートされます。

**Alpha パッケージ**: `packages/@aws-cdk/aws-<service>-alpha/` に存在する、まだ安定していない実験的モジュール。独立したバージョン管理に従います。

**jsii コンパイル**: TypeScript は通常の `tsc` ではなく jsii でコンパイルされます。jsii は追加の制約 (公開 API に TypeScript 固有の機能を使用不可) を強制し、言語バインディングを生成します。ビルド成果物は `.jsii` ファイルに格納されます。

**インテグレーションテスト**: `@aws-cdk-testing/framework-integ` の `IntegTest` コンストラクトを使用します。スナップショットファイル (`*.snapshot/`) はコミットされており、インフラ変更時に更新が必要です。

## 主要な開発ユーティリティ

```bash
# CDK アプリにローカルリポジトリをリンクして手動テスト
../aws-cdk/link-all.sh    # CDK アプリのディレクトリから実行

# 全パッケージでコマンドを実行
scripts/foreach.sh yarn build

# モジュールとその全依存元をビルド (トポロジカル順)
scripts/builddown
```

## 環境変数

| 変数 | 用途 |
|------|------|
| `NODE_OPTIONS="--max-old-space-size=8192"` | 大規模ビルド時のヒープサイズ増加 |
| `CDK_DOCKER=finch` | Docker の代わりに Finch を使用 |
| `DOCKER_HOST=unix://...` | カスタム Docker ソケット (例: Podman) |
