# AWS CDK - プロジェクト概要

## 目的
AWS Cloud Development Kit (CDK)は、クラウドインフラストラクチャをコードで定義し、AWS CloudFormationを通じてプロビジョニングするためのオープンソースフレームワークです。

## 特徴
- 高レベルのオブジェクト指向抽象化でAWSリソースを定義
- 複数のプログラミング言語をサポート (TypeScript, Python, Java, .NET, Go)
- コンストラクトと呼ばれる再利用可能なクラウドコンポーネント
- AWS Construct Library - 全AWSサービスのリッチなクラスライブラリ

## リポジトリ構造
このリポジトリはLernaを使用したmonorepoで、以下の主要コンポーネントで構成されています：

### packages/
- **aws-cdk-lib/** - メインのCDKライブラリ (V2、stable)
- **@aws-cdk/*/** - アルファ版の実験的パッケージ
- **@aws-cdk-testing/*/** - 統合テストパッケージ
- **awslint/** - AWS CDK API設計ガイドライン検証ツール

### tools/
ビルドツール、リンター、その他の開発ツール：
- **@aws-cdk/cdk-build-tools/** - ビルドツール
- **@aws-cdk/eslint-config/** - ESLint設定
- **@aws-cdk/pkglint/** - パッケージ構造のリンター
- **@aws-cdk/prlint/** - Pull Requestのリンター
- **@aws-cdk/spec2cdk/** - CloudFormation specからコード生成

### scripts/
各種スクリプトツール

### docs/
- **DESIGN_GUIDELINES.md** - API設計ガイドライン

## バージョン体系
- V2 (現在): aws-cdk-lib パッケージ (stable)
- V2-alpha: @aws-cdk/* パッケージ (experimental)

## 開発環境
- OS: Linux (WSL2環境で動作確認済み)
- Node.js >= 20.x推奨 (Active LTS)
- Yarn workspacesによるパッケージ管理
- TypeScript 5.5.4

## ビルドシステム
- Lernaによるmonorepo管理
- TypeScript composite projectsによる増分ビルド
- NXによる並列実行最適化