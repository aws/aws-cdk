# 主要コマンド一覧

## セットアップ
```bash
yarn install                    # 依存パッケージのインストール
```

## ビルド
```bash
./build.sh                      # 全体ビルド (時間がかかる)
cd packages/aws-cdk-lib && yarn build   # aws-cdk-lib だけビルド
yarn watch                      # ウォッチモード (変更時に再ビルド)
```

## テスト
```bash
# 特定モジュールのユニットテスト
cd packages/aws-cdk-lib && yarn test aws-lambda
cd packages/aws-cdk-lib && yarn test aws-s3

# 特定テストファイル
cd packages/aws-cdk-lib && yarn test aws-s3/test/bucket.test.ts

# インテグレーションテスト (AWS アカウント必要)
cd packages/@aws-cdk-testing/framework-integ
yarn integ test/aws-lambda/test/integ.lambda.js --update-on-failed
```

## Lint / フォーマット
```bash
cd packages/aws-cdk-lib && yarn lint   # ESLint
yarn pkglint                           # パッケージ規約チェック
```

## その他
```bash
yarn build+test                        # ビルド + テスト
./scripts/run-rosetta.sh               # README サンプルコードのコンパイル確認
```

## Nx (モノレポ向け)
```bash
npx nx build aws-cdk-lib               # Nx 経由でビルド
npx nx test aws-cdk-lib                # Nx 経由でテスト
```
