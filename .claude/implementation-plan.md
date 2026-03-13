# Issue #36653 実装計画

## 問題の概要

`KubectlProviderOptions`で`securityGroup`を指定しても無視され、EKS ClusterのSecurityGroupがKubectl Handler (Lambda)に適用されてしまう。

## 修正方針

### 後方互換性を保ちながら機能を拡張

1. **既存の`securityGroup`プロパティを維持**（後方互換性）
2. **新しい`securityGroups`プロパティを追加**（配列で複数のSGを設定可能）
3. **優先順位の明確化**
4. **競合時の警告表示**

## インターフェース設計

### KubectlProviderOptions の修正

```typescript
export interface KubectlProviderOptions {
  // ... 既存のプロパティ ...

  /**
   * A security group to use for `kubectl` execution.
   *
   * If you specify both `securityGroup` and `securityGroups`, a warning will be issued
   * and `securityGroups` will be used.
   *
   * @default - If not specified, the k8s endpoint is expected to be accessible
   * publicly.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Security groups to use for `kubectl` execution.
   *
   * If you specify both `securityGroup` and `securityGroups`, a warning will be issued
   * and `securityGroups` will be used.
   *
   * @default - If not specified, the k8s endpoint is expected to be accessible
   * publicly.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  // ... その他の既存プロパティ ...
}
```

## セキュリティグループの優先順位

以下の優先順位で決定：

1. **`securityGroups`（配列）** - 最優先
2. **`securityGroup`（単一）** - 次点
3. **`clusterSecurityGroup`** - デフォルト（後方互換性）

```typescript
// 疑似コード
if (privateSubnets) {
  if (securityGroups && securityGroups.length > 0) {
    // securityGroupsを使用
    if (securityGroup) {
      // 警告: 両方指定されている
    }
    return securityGroups;
  } else if (securityGroup) {
    // securityGroupを使用（配列に変換）
    return [securityGroup];
  } else if (clusterSecurityGroup) {
    // デフォルト: clusterSecurityGroupを使用
    return [clusterSecurityGroup];
  }
}
```

## 実装の詳細

### 1. kubectl-provider.ts の修正

#### 場所
`packages/aws-cdk-lib/aws-eks-v2/lib/kubectl-provider.ts`

#### 修正箇所
コンストラクタ内のセキュリティグループ決定ロジック（L177-185付近）

#### 修正内容

```typescript
constructor(scope: Construct, id: string, props: KubectlProviderProps) {
  super(scope, id);

  const vpc = props.privateSubnets ? props.cluster.vpc : undefined;
  let securityGroups: ec2.ISecurityGroup[] | undefined;

  if (props.privateSubnets) {
    // セキュリティグループの優先順位を決定
    if (props.securityGroups && props.securityGroups.length > 0) {
      securityGroups = props.securityGroups;

      // 両方指定されている場合は警告
      if (props.securityGroup) {
        Annotations.of(this).addWarningV2('@aws-cdk/aws-eks-v2:securityGroupConflict',
          'Both securityGroup and securityGroups are specified. Using securityGroups.');
      }
    } else if (props.securityGroup) {
      // 単一のセキュリティグループを配列に変換
      securityGroups = [props.securityGroup];
    } else if (props.cluster.clusterSecurityGroup) {
      // デフォルト: クラスターのセキュリティグループ（後方互換性）
      securityGroups = [props.cluster.clusterSecurityGroup];
    }
  }

  const privateSubnets = props.privateSubnets ? { subnets: props.privateSubnets } : undefined;

  const handler = new lambda.Function(this, 'Handler', {
    timeout: Duration.minutes(15),
    description: 'onEvent handler for EKS kubectl resource provider',
    memorySize: props.memory?.toMebibytes() ?? 1024,
    environment: {
      // required and recommended for boto3
      AWS_STS_REGIONAL_ENDPOINTS: 'regional',
      ...props.environment,
    },
    role: props.role,
    code: lambda.Code.fromAsset(path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-eks-v2', 'kubectl-handler')),
    handler: 'index.handler',
    runtime: lambda.Runtime.determineLatestPythonRuntime(this),
    // defined only when using private access
    vpc,
    securityGroups,  // ここに適用
    vpcSubnets: privateSubnets,
  });

  // ... 残りのコード ...
}
```

### 2. cluster.ts の修正

#### 場所
`packages/aws-cdk-lib/aws-eks-v2/lib/cluster.ts`

#### 修正箇所
KubectlProvider作成部分（L1425付近）

#### 修正内容

```typescript
if (props.kubectlProviderOptions) {
  this._kubectlProvider = new KubectlProvider(this, 'KubectlProvider', {
    cluster: this,
    role: this._kubectlProviderOptions?.role,
    awscliLayer: this._kubectlProviderOptions?.awscliLayer,
    kubectlLayer: this._kubectlProviderOptions!.kubectlLayer,
    environment: this._kubectlProviderOptions?.environment,
    memory: this._kubectlProviderOptions?.memory,
    privateSubnets: kubectlSubnets,
    securityGroup: this._kubectlProviderOptions?.securityGroup,      // 既存
    securityGroups: this._kubectlProviderOptions?.securityGroups,    // 新規追加
  });

  // ... 残りのコード ...
}
```

## テストケース

### 新規テストケース

#### 1. securityGroupsが指定された場合
```typescript
test('respects securityGroups when specified', () => {
  // Given
  const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
  const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });

  // When
  const cluster = new Cluster(stack, 'Cluster', {
    // ... 基本設定 ...
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV34Layer(stack, 'KubectlLayer'),
      privateSubnets: vpc.privateSubnets,
      securityGroups: [sg1, sg2],
    },
  });

  // Then
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        { 'Fn::GetAtt': [Match.stringLikeRegexp('SG1.*'), 'GroupId'] },
        { 'Fn::GetAtt': [Match.stringLikeRegexp('SG2.*'), 'GroupId'] },
      ],
    },
  });
});
```

#### 2. securityGroupが指定された場合（後方互換性）
```typescript
test('respects securityGroup when specified (backwards compatibility)', () => {
  // Given
  const sg = new ec2.SecurityGroup(stack, 'CustomSG', { vpc });

  // When
  const cluster = new Cluster(stack, 'Cluster', {
    // ... 基本設定 ...
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV34Layer(stack, 'KubectlLayer'),
      privateSubnets: vpc.privateSubnets,
      securityGroup: sg,
    },
  });

  // Then
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        { 'Fn::GetAtt': [Match.stringLikeRegexp('CustomSG.*'), 'GroupId'] },
      ],
    },
  });
});
```

#### 3. 両方指定された場合（警告とsecurityGroupsの優先）
```typescript
test('prefers securityGroups when both are specified and issues warning', () => {
  // Given
  const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
  const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });
  const singleSG = new ec2.SecurityGroup(stack, 'SingleSG', { vpc });

  // When
  const cluster = new Cluster(stack, 'Cluster', {
    // ... 基本設定 ...
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV34Layer(stack, 'KubectlLayer'),
      privateSubnets: vpc.privateSubnets,
      securityGroup: singleSG,       // 無視される
      securityGroups: [sg1, sg2],    // こちらが使われる
    },
  });

  // Then
  // securityGroupsが使われることを確認
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        { 'Fn::GetAtt': [Match.stringLikeRegexp('SG1.*'), 'GroupId'] },
        { 'Fn::GetAtt': [Match.stringLikeRegexp('SG2.*'), 'GroupId'] },
      ],
    },
  });

  // 警告が発行されることを確認
  Annotations.fromStack(stack).hasWarning('*',
    'Both securityGroup and securityGroups are specified. Using securityGroups.');
});
```

#### 4. どちらも指定しない場合（デフォルト動作・後方互換性）
```typescript
test('uses cluster security group when neither is specified (default behavior)', () => {
  // When
  const cluster = new Cluster(stack, 'Cluster', {
    // ... 基本設定 ...
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV34Layer(stack, 'KubectlLayer'),
      privateSubnets: vpc.privateSubnets,
      // securityGroup も securityGroups も指定しない
    },
  });

  // Then
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        // クラスターのセキュリティグループが使われる
        { 'Fn::GetAtt': [Match.stringLikeRegexp('Cluster.*ControlPlaneSecurityGroup.*'), 'GroupId'] },
      ],
    },
  });
});
```

#### 5. 既存テストが壊れていないことの確認
```bash
# 既存のすべてのテストを実行
cd packages/aws-cdk-lib
yarn test aws-eks-v2
```

## 実装手順

### Phase 1: インターフェース更新
1. [ ] `kubectl-provider.ts`の`KubectlProviderOptions`インターフェースに`securityGroups`を追加
2. [ ] JSDocコメントを両方のプロパティに追加

### Phase 2: ロジック実装
3. [ ] `kubectl-provider.ts`のコンストラクタでセキュリティグループ決定ロジックを実装
4. [ ] 競合時の警告メッセージを実装（Annotations.of(this).addWarningV2）
5. [ ] `cluster.ts`でKubectlProvider作成時に`securityGroups`を渡す

### Phase 3: テスト
6. [ ] 新規テストケースを追加
   - [ ] securityGroupsのみ指定
   - [ ] securityGroupのみ指定（後方互換性）
   - [ ] 両方指定（警告と優先順位）
   - [ ] どちらも指定しない（デフォルト動作）
7. [ ] すべてのテストを実行して既存テストが壊れていないことを確認

### Phase 4: ドキュメント
8. [ ] JSDocコメントの最終確認
9. [ ] 必要に応じてREADMEに使用例を追加

### Phase 5: ビルド・リント
10. [ ] `yarn build`でビルド確認
11. [ ] `yarn lint`でリントエラー確認
12. [ ] `yarn pkglint`でパッケージ構造確認

## 後方互換性の確認

### 既存コードへの影響
- **影響なし**: `securityGroups`はオプショナルなので、既存のコードは変更不要
- **デフォルト動作**: 変更なし（clusterSecurityGroupを使用）
- **既存の`securityGroup`**: 引き続き動作（配列に変換されて使用される）

### 移行パス
1. **現在**: `securityGroup`を使用（または未指定）
2. **将来的に推奨**: `securityGroups`を使用（複数SG対応）
3. **段階的移行**: 両方使用可能、将来的に`securityGroup`を`@deprecated`にできる

## 注意事項

### Annotationsの使用
```typescript
import { Annotations } from '../../core';

// 警告の発行
Annotations.of(this).addWarningV2('@aws-cdk/aws-eks-v2:securityGroupConflict',
  'Both securityGroup and securityGroups are specified. Using securityGroups.');
```

### 配列の扱い
- 空配列 `[]` は「指定なし」と同じ扱い（`length > 0`でチェック）
- `undefined` と空配列を区別しない

### エラーハンドリング
- 不正な値が渡された場合はLambda作成時に自然にエラーになる
- 追加のバリデーションは不要（Lambdaのコンストラクタに任せる）

## コミットメッセージ案

```
fix(eks-v2): respect securityGroup(s) in KubectlProviderOptions

The securityGroup specified in KubectlProviderOptions was being
ignored and the cluster security group was used instead.

This change adds support for both single and multiple security groups:
- Maintains backwards compatibility with existing `securityGroup` property
- Adds new `securityGroups` property for multiple security groups
- Priority: securityGroups > securityGroup > clusterSecurityGroup
- Issues warning when both properties are specified

Fixes #36653
```
