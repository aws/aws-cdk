# Issue #36653 インテグレーションテスト計画

## 概要

KubectlProviderOptionsのsecurityGroup/securityGroupsが正しく適用されることを検証するインテグレーションテストを作成する。

## テストファイル

### 新規作成するファイル
```
packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/
  └── integ.eks-kubectl-security-groups.ts
```

## テストシナリオ

**重要**: 時間とコストの削減のため、1つのスタック内で3つのクラスタをテストします。
- 1つのVPC（共有）
- 3つのEKSクラスタ（異なるSecurityGroup設定）
- CloudFormationが並行してクラスタを作成

### シナリオ1: securityGroups（複数SG）を使用
- カスタムセキュリティグループを2つ作成
- `kubectlProviderOptions.securityGroups`で指定
- kubectl handler (Lambda)に正しく適用されることを検証

### シナリオ2: securityGroup（単一SG）を使用（後方互換性）
- カスタムセキュリティグループを1つ作成
- `kubectlProviderOptions.securityGroup`で指定
- kubectl handler (Lambda)に正しく適用されることを検証

### シナリオ3: privateSubnetsのみ指定（デフォルト動作）
- カスタムSGは指定しない
- クラスターのセキュリティグループが使用されることを検証

## 実装コード

### integ.eks-kubectl-security-groups.ts

```typescript
/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV34Layer } from '@aws-cdk/lambda-layer-kubectl-v34';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

/**
 * Integration test for kubectl security group configurations.
 *
 * This test creates a single stack with one VPC and three EKS clusters,
 * each demonstrating different security group configurations:
 * 1. Multiple security groups (securityGroups)
 * 2. Single security group (securityGroup - backwards compatibility)
 * 3. Default behavior (cluster security group)
 *
 * Benefits of single-stack approach:
 * - Shared VPC reduces costs
 * - Clusters may be created in parallel by CloudFormation
 * - Faster test execution compared to sequential stack deployment
 * - Simpler resource management
 */
class EksKubectlSecurityGroupsStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // Shared VPC for all three clusters
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const privateSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    }).subnets;

    // ========================================================================
    // Test Case 1: Multiple security groups (securityGroups)
    // ========================================================================

    const kubectlSg1 = new ec2.SecurityGroup(this, 'KubectlSG1', {
      vpc,
      description: 'First security group for kubectl handler (Cluster1)',
      allowAllOutbound: true,
    });

    const kubectlSg2 = new ec2.SecurityGroup(this, 'KubectlSG2', {
      vpc,
      description: 'Second security group for kubectl handler (Cluster1)',
      allowAllOutbound: true,
    });

    kubectlSg1.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS from VPC',
    );

    const cluster1 = new eks.Cluster(this, 'Cluster1-MultipleSecurityGroups', {
      vpc,
      version: eks.KubernetesVersion.V1_34,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      defaultCapacity: 0, // No default capacity to speed up test
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer1'),
        privateSubnets,
        securityGroups: [kubectlSg1, kubectlSg2], // Multiple SGs
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    cluster1.clusterSecurityGroup.addIngressRule(
      kubectlSg1,
      ec2.Port.tcp(443),
      'Allow kubectl from custom SG1',
    );
    cluster1.clusterSecurityGroup.addIngressRule(
      kubectlSg2,
      ec2.Port.tcp(443),
      'Allow kubectl from custom SG2',
    );

    // Validation: Add a manifest to verify kubectl works
    cluster1.addManifest('TestConfigMap1', {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'test-configmap-multiple-sgs',
        namespace: 'default',
      },
      data: {
        test: 'security-groups-multiple',
        cluster: 'cluster1',
      },
    });

    // ========================================================================
    // Test Case 2: Single security group (securityGroup - backwards compatibility)
    // ========================================================================

    const kubectlSg3 = new ec2.SecurityGroup(this, 'KubectlSG3', {
      vpc,
      description: 'Custom security group for kubectl handler (Cluster2)',
      allowAllOutbound: true,
    });

    kubectlSg3.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS from VPC',
    );

    const cluster2 = new eks.Cluster(this, 'Cluster2-SingleSecurityGroup', {
      vpc,
      version: eks.KubernetesVersion.V1_34,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      defaultCapacity: 0,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer2'),
        privateSubnets,
        securityGroup: kubectlSg3, // Single SG (backwards compatibility)
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    cluster2.clusterSecurityGroup.addIngressRule(
      kubectlSg3,
      ec2.Port.tcp(443),
      'Allow kubectl from custom SG',
    );

    cluster2.addManifest('TestConfigMap2', {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'test-configmap-single-sg',
        namespace: 'default',
      },
      data: {
        test: 'security-group-single',
        cluster: 'cluster2',
      },
    });

    // ========================================================================
    // Test Case 3: Default behavior (no custom security group)
    // ========================================================================

    const cluster3 = new eks.Cluster(this, 'Cluster3-DefaultSecurityGroup', {
      vpc,
      version: eks.KubernetesVersion.V1_34,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      defaultCapacity: 0,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV34Layer(this, 'KubectlLayer3'),
        privateSubnets,
        // No securityGroup or securityGroups specified
        // Should use cluster security group by default
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    cluster3.addManifest('TestConfigMap3', {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'test-configmap-default-sg',
        namespace: 'default',
      },
      data: {
        test: 'default-security-group',
        cluster: 'cluster3',
      },
    });
  }
}

// CDK App
const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

// Single stack with all three test cases
const stack = new EksKubectlSecurityGroupsStack(
  app,
  'aws-cdk-eks-kubectl-security-groups-test',
);

// Integration test
new integ.IntegTest(app, 'EksKubectlSecurityGroupsTest', {
  testCases: [stack],
  // Test includes assets that are updated weekly
  diffAssets: false,
  // Longer timeout for cluster creation (3 clusters)
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
});

app.synth();
```

## スナップショットテストの検証ポイント

### 生成されるCloudFormationテンプレートで確認する項目

1つのスタックに3つのクラスタ（3つのKubectl Handler Lambda）が含まれます。

#### Cluster1のLambda（securityGroupsを使用）

```json
{
  "Type": "AWS::Lambda::Function",
  "Properties": {
    "FunctionName": "...Cluster1...Handler...",
    "VpcConfig": {
      "SecurityGroupIds": [
        { "Fn::GetAtt": ["KubectlSG1...", "GroupId"] },
        { "Fn::GetAtt": ["KubectlSG2...", "GroupId"] }
      ],
      "SubnetIds": [...]
    }
  }
}
```

#### Cluster2のLambda（securityGroupを使用）

```json
{
  "Type": "AWS::Lambda::Function",
  "Properties": {
    "FunctionName": "...Cluster2...Handler...",
    "VpcConfig": {
      "SecurityGroupIds": [
        { "Fn::GetAtt": ["KubectlSG3...", "GroupId"] }
      ],
      "SubnetIds": [...]
    }
  }
}
```

#### Cluster3のLambda（デフォルト）

```json
{
  "Type": "AWS::Lambda::Function",
  "Properties": {
    "FunctionName": "...Cluster3...Handler...",
    "VpcConfig": {
      "SecurityGroupIds": [
        { "Fn::GetAtt": ["Cluster3...ControlPlaneSecurityGroup...", "GroupId"] }
      ],
      "SubnetIds": [...]
    }
  }
}
```

## テスト実行方法

### スナップショットの作成
```bash
cd packages/@aws-cdk-testing/framework-integ

# 新しいスナップショットを生成
yarn integ test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts \
  --update-on-failed

# スナップショットの確認（1つのスタックのみ）
ls -la test/aws-eks-v2/test/integ.eks-kubectl-security-groups.js.snapshot/
```

### 実際のデプロイテスト（オプション）
```bash
# 警告: 実際にAWS環境にデプロイされ、コストが発生します
# 注意: 3つのEKSクラスタが作成されます（約15-20分 + コスト）
yarn integ test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts \
  --app "node test/aws-eks-v2/test/integ.eks-kubectl-security-groups.js" \
  --disable-update-workflow

# デプロイ後のクリーンアップ
# CDKが自動的にスタックを削除します
```

### スナップショット差分の確認
```bash
# コード変更後、スナップショットとの差分を確認
yarn integ test/aws-eks-v2/test/integ.eks-kubectl-security-groups.ts

# 変更がない場合は成功
# 変更がある場合は差分が表示される
```

## 検証内容

### 1. CloudFormationテンプレートの検証
- [ ] Lambda Functionに正しいセキュリティグループが設定されている
- [ ] securityGroupsを指定した場合、複数のSGが設定される
- [ ] securityGroupを指定した場合、単一のSGが設定される
- [ ] 未指定の場合、clusterSecurityGroupが設定される

### 2. 実行時の検証（実際にデプロイする場合）
- [ ] Kubectlコマンドが正常に動作する（manifestが適用される）
- [ ] Lambda関数がEKSクラスターと通信できる
- [ ] セキュリティグループのルールが正しく機能する

### 3. 後方互換性の検証
- [ ] securityGroupプロパティが引き続き動作する
- [ ] 既存の動作が変わっていない

## CI/CDでの実行

### 自動実行されるテスト
- スナップショット比較テスト（毎回実行）
- CloudFormationテンプレートの構文チェック

### 手動実行が必要なテスト
- 実際のAWSへのデプロイテスト（コスト・時間の関係で手動）

## 競合警告のテスト

両方指定した場合の警告テストは**ユニットテストで実施**します。

インテグレーションテストでは実際のAWSデプロイが必要になりコストがかかるため、
競合警告（`securityGroup`と`securityGroups`の両方指定）のテストはユニットテストで行います。

ユニットテストでの実装例：
```typescript
test('issues warning when both securityGroup and securityGroups are specified', () => {
  // Given
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  const vpc = new ec2.Vpc(stack, 'VPC');
  const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
  const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });
  const singleSg = new ec2.SecurityGroup(stack, 'SingleSG', { vpc });

  // When
  new eks.Cluster(stack, 'Cluster', {
    vpc,
    version: eks.KubernetesVersion.V1_34,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV34Layer(stack, 'Layer'),
      privateSubnets: vpc.privateSubnets,
      securityGroup: singleSg,           // 無視される
      securityGroups: [sg1, sg2],        // こちらが使われる
    },
  });

  // Then
  Annotations.fromStack(stack).hasWarning('*',
    Match.stringLikeRegexp('.*securityGroup.*securityGroups.*'));
});
```

## 注意事項

### テストの範囲
- このインテグレーションテストはCloudFormationテンプレートの正しさを検証
- 実際の動作検証（manifest適用）は基本的な動作確認のみ
- セキュリティグループルールの詳細な動作は別途検証が必要

### コストと時間
- **実際のデプロイ**:
  - 3つのクラスタをCloudFormationが並行作成（推定15-20分）
  - 従来の順次実行（45-60分）より大幅に短縮
- **コスト削減**:
  - VPC: 3つ → 1つ
  - NAT Gateway: 3つ → 1つ
  - その他共有リソース
- **通常はスナップショットテストのみで十分**

### メンテナンス
- Kubernetes バージョンアップ時にkubectlLayerのバージョン更新が必要
- スナップショットは定期的に更新される可能性がある

## 期待される成果

### 1. スナップショットファイル
```
integ.eks-kubectl-security-groups.js.snapshot/
├── asset.xxx.../             # kubectl-handler assets (共有)
├── EksKubectlSecurityGroupsTestDefaultTestDeployAssertxxx.assets.json
├── EksKubectlSecurityGroupsTestDefaultTestDeployAssertxxx.template.json
├── aws-cdk-eks-kubectl-security-groups-test.assets.json    # 単一スタック
├── aws-cdk-eks-kubectl-security-groups-test.template.json  # 3つのクラスタを含む
├── cdk.out
├── integ.json
├── manifest.json
└── tree.json
```

### 2. テスト結果
- ✅ securityGroupsが正しく適用される（Cluster1）
- ✅ securityGroupが正しく適用される（Cluster2・後方互換性）
- ✅ デフォルト動作が維持される（Cluster3）
- ✅ CloudFormationテンプレートが正しく生成される
- ✅ 1つのVPCで3つのクラスタが動作

### 3. リソース効率
- **VPC**: 3つ → **1つ** （コスト削減）
- **デプロイ時間**: 順次45-60分 → **並行15-20分**（推定）
- **NAT Gateway**: 3つ → **1つ** （コスト削減）
- **管理**: 3スタック → **1スタック** （シンプル）

## まとめ

このインテグレーションテストにより：
1. 修正が正しく機能することを検証（3つのシナリオ）
2. 後方互換性が保たれることを確認
3. 将来の変更で機能が壊れないことを保証
4. ドキュメントとしても機能（使用例）

### 最適化の効果
- **1つのスタック、1つのVPC、3つのクラスタ**
- **時間短縮**: 45-60分 → 15-20分（推定）
- **コスト削減**: VPC×3、NAT Gateway×3 → 各1つ
- **管理簡素化**: 3スタック → 1スタック
