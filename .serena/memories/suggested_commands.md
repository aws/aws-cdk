# AWS CDK - よく使うコマンド

## ビルド関連

### プロジェクト全体のビルド
```bash
./build.sh                    # 全パッケージをビルド・テスト
./build.sh --no-bail          # エラーがあっても続行
./build.sh --skip-test        # テストをスキップしてビルドのみ
./build.sh --skip-prereqs     # 前提条件チェックをスキップ
./build.sh --skip-compat      # 互換性チェックをスキップ
./build.sh -f                 # 強制ビルド (キャッシュ無視)
yarn build-all                # tsc -b で全体をビルド
```

### 個別パッケージのビルド
```bash
cd packages/aws-cdk-lib
yarn build                    # ビルド
yarn build+test               # ビルド+テスト
yarn build+test+package       # ビルド+テスト+パッケージング
yarn watch                    # ファイル変更を監視して自動ビルド
```

## テスト関連

```bash
yarn test                     # 現在のパッケージをテスト (Jest)
cd packages/aws-cdk-lib && yarn test  # aws-cdk-lib をテスト
```

## リンティング

```bash
yarn lint                     # ESLintでコードをチェック
yarn pkglint                  # パッケージ構造をチェック
lerna run pkglint             # 全パッケージでpkglintを実行
```

### Linter種類
- **ESLint** - コードスタイルチェック
- **pkglint** - パッケージ構造とメタデータのチェック
- **awslint** - AWS CDK設計ガイドライン準拠チェック

## パッケージング

```bash
./pack.sh                     # 全パッケージをパッケージング
yarn package                  # 現在のパッケージをパッケージング
```

## ワークスペース管理

```bash
lerna run <command>           # 全パッケージでコマンド実行
lerna run build --scope <pkg> # 特定パッケージをビルド
lerna run build --include-dependencies  # 依存関係も含めてビルド
```

## Git関連

```bash
git status                    # 変更確認
git diff                      # 差分確認
git log --oneline -10         # 最近のコミット10件
```

## その他の便利なコマンド

```bash
./scripts/foreach.sh <cmd>    # 全パッケージでシェルコマンド実行
yarn rosetta                  # Rosetta (ドキュメント生成)
```

## Linuxシステムコマンド (WSL2環境)

```bash
ls -la                        # ファイル一覧
find . -name "*.ts"           # TypeScriptファイル検索
grep -r "pattern" .           # パターン検索
cd <path>                     # ディレクトリ移動
pwd                           # 現在のディレクトリ表示
```