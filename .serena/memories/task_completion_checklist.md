# タスク完了時のチェックリスト

## 必須手順

### 1. コードのビルド確認
```bash
cd packages/aws-cdk-lib
yarn build
```

### 2. 変更モジュールのユニットテスト実行
```bash
cd packages/aws-cdk-lib
yarn test <module-name>   # 例: yarn test aws-lambda
```

### 3. ESLint チェック
```bash
cd packages/aws-cdk-lib
yarn eslint
```

### 4. package.json の検証（package.json を変更した場合）
```bash
yarn pkglint
```

### 5. awslint チェック（新規コンストラクトを追加・変更した場合）
```bash
yarn awslint
```

## README のコードサンプルを変更した場合
```bash
/bin/bash ./scripts/run-rosetta.sh
```

## インテグレーションテストのスナップショット更新（インフラ変更時）
- `*.snapshot/` ファイルをコミットする必要あり
- AWS 認証情報が必要

## 破壊的変更がある場合
- `allowed-breaking-changes.txt` に記載
- API 互換性チェック: `./scripts/check-api-compatibility.sh`

## PR 作成前の確認事項
- [ ] ビルドが通る (`yarn build`)
- [ ] テストが通る (`yarn test`)
- [ ] ESLint エラーがない (`yarn eslint`)
- [ ] jsii の公開 API 制約に違反していない
- [ ] 新規コンストラクトは `docs/DESIGN_GUIDELINES.md` に従っている
- [ ] README のコードサンプルが動作する（変更した場合）
- [ ] スナップショットファイルが更新されている（インフラ変更の場合）
