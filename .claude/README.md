# Issue #36653 実装ドキュメント

## 📚 ドキュメント一覧

### 1. CLAUDE.md
プロジェクト全体のガイド
- プロジェクト概要
- 技術スタック
- コーディング規約
- 開発ワークフロー
- Issue #36653の概要

👉 **最初に読むべきドキュメント**

---

### 2. implementation-summary.md
修正の概要とクイックリファレンス
- 🎯 目的
- 📋 修正の概要
- 📝 修正ファイル
- ✅ 後方互換性
- 🧪 テスト概要
- 📖 使用例

👉 **修正内容を素早く理解したい場合**

---

### 3. implementation-plan.md
詳細な実装計画
- インターフェース設計（詳細）
- コード実装例（修正前後）
- テストケース（5つの詳細なユニットテスト）
- 実装手順（フェーズ分け）
- 後方互換性の詳細分析
- コミットメッセージ案

👉 **実装時の詳細なリファレンス**

---

### 4. integration-test-plan.md
インテグレーションテストの完全ガイド
- テストシナリオ（3つのクラスタ、1つのスタック）
- 完全な実装コード（最適化版）
- スナップショット検証ポイント
- テスト実行方法
- CloudFormationテンプレート検証
- **時間・コスト最適化**（1VPC、並行クラスタ作成）

👉 **インテグレーションテストを作成・実行する際**

---

## 🚀 クイックスタート

### Issue #36653とは？

**問題**: EKS v2で`KubectlProviderOptions`に`securityGroup`を指定しても無視され、ClusterのSecurityGroupがKubectl Handler (Lambda)に適用されてしまう。

**解決策**:
1. 既存の`securityGroup`を維持（後方互換性）
2. 新しい`securityGroups`を追加（複数SG対応）
3. 優先順位: `securityGroups` > `securityGroup` > `clusterSecurityGroup`

### 実装の流れ

```
1. ドキュメントを読む
   ↓
2. コードを修正
   ├─ kubectl-provider.ts
   └─ cluster.ts
   ↓
3. ユニットテストを追加
   └─ cluster.test.ts
   ↓
4. ビルド・テスト
   ↓
5. インテグレーションテストを作成
   └─ integ.eks-kubectl-security-groups.ts
   ↓
6. 完了！
```

## 📂 修正対象ファイル

### コード
```
packages/aws-cdk-lib/aws-eks-v2/lib/
├── kubectl-provider.ts    # インターフェース + ロジック修正
└── cluster.ts             # KubectlProvider呼び出し修正
```

### ユニットテスト
```
packages/aws-cdk-lib/aws-eks-v2/test/
└── cluster.test.ts        # 新しいテストケース追加
```

### インテグレーションテスト
```
packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/
└── integ.eks-kubectl-security-groups.ts  # 新規作成
```

## 🎯 重要な原則

### 1. 後方互換性は必須
- ✅ EKS v2はGA版（安定版）
- ✅ 既存コードを壊してはいけない
- ✅ デフォルト動作は変更しない

### 2. 優先順位
```
securityGroups（配列）     ← 最優先
    ↓
securityGroup（単一）      ← 次点
    ↓
clusterSecurityGroup       ← デフォルト
```

### 3. 競合時の動作
両方指定された場合：
- 警告を表示（`Annotations.of(this).addWarningV2`）
- `securityGroups`を使用

## 📖 読む順番（推奨）

### 初めての方
1. **CLAUDE.md** - プロジェクト全体を理解
2. **implementation-summary.md** - 修正内容を把握
3. **implementation-plan.md** - 実装の詳細を確認

### 実装時
1. **implementation-plan.md** - コードを書く
2. **integration-test-plan.md** - テストを書く

### レビュー時
1. **implementation-summary.md** - 変更点を確認
2. 実際のコード差分を確認

## 🔗 関連リンク

- **Issue**: https://github.com/aws/aws-cdk/issues/36653
- **Contributing Guide**: ../CONTRIBUTING.md
- **Design Guidelines**: ../docs/DESIGN_GUIDELINES.md

## 📝 チェックリスト

実装完了前に確認：

### コード
- [ ] `kubectl-provider.ts` のインターフェースに`securityGroups`追加
- [ ] `kubectl-provider.ts` のロジックを実装
- [ ] `cluster.ts` でKubectlProviderに`securityGroups`を渡す
- [ ] JSDocコメント追加

### テスト
- [ ] ユニットテスト5ケース追加
- [ ] 既存のユニットテストが全てパス
- [ ] インテグレーションテスト作成
- [ ] スナップショット生成

### 品質
- [ ] `yarn build` 成功
- [ ] `yarn test` 全て成功
- [ ] `yarn lint` エラーなし
- [ ] `yarn pkglint` エラーなし

### ドキュメント
- [ ] JSDocに`@default`タグ記載
- [ ] 競合時の動作を明記

## 🆘 トラブルシューティング

### ビルドエラー
```bash
cd packages/aws-cdk-lib
yarn build
# エラーメッセージを確認
```

### テストエラー
```bash
cd packages/aws-cdk-lib
yarn test aws-eks-v2 --verbose
# 詳細なエラーを確認
```

### インテグレーションテストエラー
```bash
cd packages/@aws-cdk-testing/framework-integ
yarn integ test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts --verbose
```

## 💡 Tips

1. **小さく段階的に実装**
   - まずインターフェース
   - 次にロジック
   - 最後にテスト

2. **既存テストを先に実行**
   - 変更前に全テストが通ることを確認
   - 後方互換性の検証

3. **コミットは論理的に分割**
   - インターフェース追加
   - ロジック実装
   - テスト追加

4. **警告メッセージは明確に**
   - ユーザーが何をすべきか分かるように
   - 例: "Using securityGroups instead of securityGroup"

---

**作成日**: 2026-03-13
**Issue**: #36653
**対象パッケージ**: aws-cdk-lib/aws-eks-v2 (GA版)
