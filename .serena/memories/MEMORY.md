# AWS CDK プロジェクト - メインメモリ

## プロジェクト概要
AWS Cloud Development Kit (CDK) - AWSリソースをコードで定義し、CloudFormationを通じてプロビジョニングするオープンソースフレームワーク

**リポジトリ**: https://github.com/aws/aws-cdk

## 技術スタック
- **言語**: TypeScript (主要言語)
- **ランタイム**: Node.js >= 20.x
- **パッケージマネージャー**: Yarn (workspaces使用)
- **ビルドシステム**: Lerna monorepo
- **テストフレームワーク**: Jest
- **TypeScript設定**: strict mode有効 (target: es2022)

## 重要なディレクトリ
- `packages/aws-cdk-lib/` - メインライブラリパッケージ (V2)
- `packages/@aws-cdk/*` - アルファ版パッケージ
- `packages/@aws-cdk-testing/*` - テストパッケージ
- `tools/@aws-cdk/*` - ビルドツール、linter等
- `docs/` - デザインガイドライン等のドキュメント

## 詳細情報
- プロジェクト詳細: project_overview.md
- コマンドリスト: suggested_commands.md
- コードスタイル: code_style.md
- タスク完了時の手順: task_completion.md