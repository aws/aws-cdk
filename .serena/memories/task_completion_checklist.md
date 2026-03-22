# タスク完了時のチェックリスト

## コード変更後に必ず実施すること

1. **ビルド確認**
   ```bash
   cd packages/aws-cdk-lib && yarn build
   # または変更したパッケージのディレクトリで
   yarn build
   ```

2. **ユニットテスト実行**
   ```bash
   cd packages/aws-cdk-lib && yarn test <モジュール名>
   # 例: yarn test aws-s3
   ```

3. **Lint チェック**
   ```bash
   cd packages/aws-cdk-lib && yarn lint
   ```

4. **pkglint チェック** (package.json 変更時)
   ```bash
   yarn pkglint
   ```

5. **README サンプルコード確認** (README 変更時)
   ```bash
   ./scripts/run-rosetta.sh
   ```

6. **自動生成ファイルの確認**
   - `*.generated.ts` を手動編集していないか確認
   - `.jsii` ファイルがビルドで正しく生成されているか確認

## PR 作成前チェック
- [ ] 新機能には JSDoc コメントがある
- [ ] 公開 API の breaking change がない (または `allowed-breaking-changes.txt` に記載)
- [ ] ユニットテストが追加・更新されている
- [ ] コミットメッセージが conventional commits 形式
