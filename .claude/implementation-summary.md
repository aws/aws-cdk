# Issue #36653 実装サマリー

## 🎯 目的

KubectlProviderOptionsで指定したSecurityGroupがKubectl Handler (Lambda)に正しく適用されるようにする。

## 📋 修正の概要

### インターフェース変更

```typescript
export interface KubectlProviderOptions {
  // 既存（後方互換性のため維持）
  readonly securityGroup?: ec2.ISecurityGroup;

  // 新規追加（複数SG対応）
  readonly securityGroups?: ec2.ISecurityGroup[];
}
```

### セキュリティグループの優先順位

```
1. securityGroups（配列）    ← 最優先
2. securityGroup（単一）     ← 次点
3. clusterSecurityGroup      ← デフォルト（後方互換性）
```

### 動作

| 指定内容 | 動作 | 備考 |
|---------|------|------|
| `securityGroups`のみ | 指定されたSG群を使用 | 推奨 |
| `securityGroup`のみ | 指定されたSGを使用 | 後方互換性 |
| 両方指定 | `securityGroups`を使用 + 警告表示 | 競合を明示 |
| どちらも未指定 | `clusterSecurityGroup`を使用 | デフォルト（既存動作） |

## 📝 修正ファイル

### 1. kubectl-provider.ts
- `KubectlProviderOptions`インターフェースに`securityGroups`追加
- セキュリティグループ決定ロジックの実装
- 競合時の警告メッセージ

### 2. cluster.ts
- KubectlProvider作成時に`securityGroups`を渡す

## ✅ 後方互換性

- ✅ インターフェース変更なし（追加のみ）
- ✅ デフォルト動作は変更なし
- ✅ 既存の`securityGroup`プロパティは引き続き動作
- ✅ 既存コードは修正不要

## 🧪 テスト

### ユニットテスト（packages/aws-cdk-lib/aws-eks-v2/test/cluster.test.ts）
- [ ] `securityGroups`のみ指定
- [ ] `securityGroup`のみ指定（後方互換性）
- [ ] 両方指定（警告と優先順位）
- [ ] どちらも未指定（デフォルト動作）
- [ ] 既存テストが全てパス

### インテグレーションテスト（packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/）
- [ ] `integ.eks-kubectl-security-groups.ts` を新規作成
  - [ ] **1つのスタック、1つのVPC、3つのクラスタ**（時間・コスト削減）
  - [ ] Cluster1: 複数SG（securityGroups）
  - [ ] Cluster2: 単一SG（securityGroup）後方互換性
  - [ ] Cluster3: デフォルト動作
- [ ] スナップショット生成・検証
- [ ] CloudFormationテンプレートの正しさを確認（3つのLambda関数）

詳細は `integration-test-plan.md` を参照

## 🔧 実装手順

```bash
# 1. パッケージに移動
cd packages/aws-cdk-lib

# 2. コード修正
# - kubectl-provider.ts を修正
# - cluster.ts を修正

# 3. ユニットテスト追加
# - aws-eks-v2/test/cluster.test.ts にテストケース追加

# 4. ビルド・ユニットテスト
yarn build
yarn test aws-eks-v2

# 5. Lint
yarn lint
yarn pkglint

# 6. インテグレーションテスト作成
cd ../packages/@aws-cdk-testing/framework-integ
# - test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts を作成

# 7. インテグレーションテストのスナップショット生成
yarn integ test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts \
  --update-on-failed
```

## 📖 使用例

### 推奨方法（複数SG）
```typescript
const cluster = new eksv2.Cluster(this, 'Cluster', {
  version: eksv2.KubernetesVersion.V1_34,
  kubectlProviderOptions: {
    kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer'),
    privateSubnets: vpc.privateSubnets,
    securityGroups: [sg1, sg2, sg3],  // ← 複数指定可能
  },
  vpc,
});
```

### 後方互換（単一SG）
```typescript
const cluster = new eksv2.Cluster(this, 'Cluster', {
  version: eksv2.KubernetesVersion.V1_34,
  kubectlProviderOptions: {
    kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer'),
    privateSubnets: vpc.privateSubnets,
    securityGroup: sg,  // ← 既存コードはそのまま動作
  },
  vpc,
});
```

### デフォルト動作
```typescript
const cluster = new eksv2.Cluster(this, 'Cluster', {
  version: eksv2.KubernetesVersion.V1_34,
  kubectlProviderOptions: {
    kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer'),
    privateSubnets: vpc.privateSubnets,
    // securityGroup も securityGroups も指定しない
    // → clusterSecurityGroup が自動的に使われる
  },
  vpc,
});
```

## 🚨 注意点

1. **GA版なので後方互換性は必須**
2. **既存の全テストが通ることを確認**
3. **警告メッセージは`Annotations.of(this).addWarningV2`を使用**
4. **空配列は「指定なし」と同じ扱い**

## 📦 関連Issue

- Issue: https://github.com/aws/aws-cdk/issues/36653
- Label: `@aws-cdk/aws-eks-v2`, `bug`, `p1`, `effort/small`
