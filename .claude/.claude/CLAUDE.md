# AWS CDK プロジェクト - Claude Code ガイド

## プロジェクト概要

AWS Cloud Development Kit (AWS CDK) のモノレポ。TypeScript 製のオープンソース IaC フレームワーク。

- メインブランチ: `main`
- 言語: TypeScript (jsii)
- パッケージ管理: Yarn + Lerna + Nx

## リポジトリ構成

```
packages/
  aws-cdk-lib/          # メインライブラリ (旧 @aws-cdk/* の統合)
  @aws-cdk/             # 個別パッケージ群 (alpha/experimental 含む)
  @aws-cdk-testing/     # テストユーティリティ
tools/                  # ビルド・開発ツール
scripts/                # CI/CD スクリプト
design/                 # RFC・設計ドキュメント
```

## ビルド・テストコマンド

```bash
# 全体ビルド
./build.sh

# 特定パッケージのビルド
cd packages/aws-cdk-lib && yarn build

# ユニットテスト
yarn test

# 特定パッケージのテスト
cd packages/aws-cdk-lib && yarn test

# Linter
yarn eslint

# pkglint (パッケージ規約チェック)
yarn pkglint
```

## コーディング規約

- **jsii 互換**: 公開 API は jsii の制約に従う (Java/Python/C# 向けバインディング生成のため)
- **breaking changes 禁止**: 既存の公開 API シグネチャは変更しない。変更が必要な場合は `allowed-breaking-changes.txt` を参照
- **Feature Flags**: 動作変更は `@aws-cdk/cx-api` の Feature Flag 経由で導入する
- **テスト必須**: ユニットテスト (`*.test.ts`) と可能であればインテグレーションテスト (`integ.*.ts`) を追加する

## PR・コントリビューション

- PRタイトル: `feat(module): ...` / `fix(module): ...` / `chore: ...` の conventional commits 形式
- CHANGELOG は自動生成されるため手動編集不要
- 新機能追加時は `README.md` のドキュメント更新も必要

## コード調査・編集ツール

**Serena MCP を常に優先して使用すること。**

- コードの調査・検索には `mcp__serena__find_symbol` / `mcp__serena__get_symbols_overview` / `mcp__serena__search_for_pattern` を使う
- シンボル単位の編集には `mcp__serena__replace_symbol_body` / `mcp__serena__insert_after_symbol` を使う
- ファイル全体を読む前に、まずシンボルレベルで必要な箇所だけ取得する
- セッション開始時に `mcp__serena__check_onboarding_performed` で初期化状態を確認する

## 注意事項

- `node_modules` や `.jsii` ファイルは読まない
- jsii の型制約により、`any` や非直列化可能な型は公開 API に使えない
- インテグレーションテストはAWSアカウントが必要なため、CI以外では通常スキップ
