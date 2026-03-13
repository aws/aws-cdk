# AWS CDK - タスク完了時の確認事項

タスクを完了する前に、以下を実行・確認してください。

## 1. ビルド確認

```bash
yarn build
```

または特定のパッケージで：
```bash
cd packages/aws-cdk-lib
yarn build
```

エラーがないことを確認します。

## 2. テスト実行

```bash
yarn test
```

新しいコードには必ずテストを追加します：
- ユニットテスト: `*.test.ts`
- 統合テスト: `integ.*.ts` (該当する場合)

## 3. Linting

### ESLint
```bash
yarn lint
```

### パッケージ構造チェック (pkglint)
```bash
yarn pkglint
```

### AWS CDK設計ガイドライン (awslint)
aws-cdk-libを変更した場合：
```bash
cd packages/aws-cdk-lib
yarn pkglint -f
```

## 4. ドキュメント確認

以下を確認：
- [ ] public APIにJSDocコメントを追加
- [ ] 新機能の場合、READMEに使用例を追加
- [ ] 破壊的変更の場合、CHANGELOG記載を検討

## 5. コードレビュー前チェックリスト

- [ ] ビルドが成功する
- [ ] すべてのテストがパスする
- [ ] Linterエラーがない
- [ ] 適切なドキュメントが追加されている
- [ ] デザインガイドラインに準拠している
- [ ] 不要なコメントアウトやデバッグコードを削除
- [ ] 適切なエラーハンドリングが実装されている

## 6. 統合テスト (該当する場合)

新しいL2構文や重要な変更の場合：
```bash
# 統合テストを追加し実行
cd packages/aws-cdk-lib
yarn build+test
```

## 7. パッケージング確認 (リリース前)

```bash
yarn package
```

## 注意事項

### 破壊的変更
破壊的変更が必要な場合：
1. 代替APIの提供を検討
2. 既存APIを非推奨化 (`@deprecated`)
3. マイグレーションガイドを提供

### テストの重要性
- カバレッジを維持・向上させる
- エッジケースのテストも含める
- 失敗時のエラーメッセージを確認

### コミット前
- ファイル変更の確認: `git status`, `git diff`
- 意図しない変更が含まれていないか確認
- コミットメッセージは明確に