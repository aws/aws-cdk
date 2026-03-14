# AWS CDK 開発コマンド一覧

## ビルド

```bash
# 初回 / テスト込みフルビルド
yarn install
npx lerna run build --skip-nx-cache   # キャッシュを使わず強制フルビルド

# aws-cdk-lib とその依存関係のみビルド
npx lerna run build --scope=aws-cdk-lib

# パッケージ内でのビルド
cd packages/aws-cdk-lib
yarn build

# 開発中のインクリメンタルリビルド
cd packages/aws-cdk-lib
yarn watch

# リポジトリ全体をビルド (Nx キャッシュ使用)
npx lerna run build
```

## テスト

```bash
# 特定モジュールのユニットテスト
cd packages/aws-cdk-lib
yarn test aws-lambda       # モジュール名を指定

# aws-cdk-lib 全ユニットテスト
cd packages/aws-cdk-lib
yarn test

# インテグレーションテスト (AWS 認証情報が必要)
cd packages/@aws-cdk-testing/framework-integ
yarn integ test/aws-lambda/test/integ.lambda.js --update-on-failed
```

## リント

```bash
# ESLint
cd packages/aws-cdk-lib
yarn eslint

# pkglint — package.json の構造と規約を検証
yarn pkglint         # チェック
yarn pkglint -f      # 自動修正

# awslint — AWS コンストラクトライブラリ設計ガイドライン
yarn awslint
yarn awslint list    # 全ルール一覧
```

## コードサンプル検証

```bash
# README のコードサンプルを変更した場合
/bin/bash ./scripts/run-rosetta.sh
```

## ユーティリティスクリプト

```bash
# 全パッケージでコマンドを実行
scripts/foreach.sh yarn build

# 現在のパッケージ + 全依存関係をビルド
scripts/buildup

# 現在のパッケージ + 全利用元をビルド (トポロジカル順)
scripts/builddown

# CDK アプリにローカルリポジトリをリンクして手動テスト
../aws-cdk/link-all.sh    # CDK アプリのディレクトリから実行
```

## 環境変数

```bash
# 大規模ビルド時のヒープサイズ増加 (JavaScript heap out of memory 対策)
export NODE_OPTIONS="--max-old-space-size=8192"

# Docker の代わりに Finch を使用
export CDK_DOCKER=finch

# カスタム Docker ソケット (例: Podman)
export DOCKER_HOST=unix://...
```

## Git ユーティリティ

```bash
git status
git log --oneline
git diff
git add <file>
git commit -m "message"
git push
```
