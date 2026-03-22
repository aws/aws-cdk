# Issue #37299 修正提案

## 概要

`eks.ServiceAccount` を `IdentityType.POD_IDENTITY` で使用する際に、既存の IAM ロールを `role` プロパティで渡せるようにする。

- 対象パッケージ: `aws-eks-v2`（まず対応）、のちに `aws-eks` も同様に対応
- 対象ファイル:
  - `packages/aws-cdk-lib/aws-eks-v2/lib/service-account.ts`
  - `packages/aws-cdk-lib/aws-eks-v2/test/service-account.test.ts`

---

## 型の方針: `IRole` ではなく `IRoleRef` を使う

### 根拠

CDK の昨今のスタイルでは、ロールを受け取るプロパティには `IRole` ではなく `IRoleRef` を使うことが推奨されている。

- `IRoleRef` は `{ roleRef: { roleArn: string; roleName: string } }` を持つ軽量インターフェース
- `IRole extends IRoleRef` のため、`iam.Role` / `iam.Role.fromRoleArn()` など既存の `IRole` はすべて `IRoleRef` として渡せる
- 後方互換性を損なわず、より広い型を受け入れられる

### 参考実装

`aws-stepfunctions-tasks` の `BedrockCreateModelCustomizationJob` が全く同じパターンを採用している：

```
packages/aws-cdk-lib/aws-stepfunctions-tasks/lib/bedrock/create-model-customization-job.ts
```

- `props.role?: iam.IRoleRef` で受け取る
- 内部フィールド `private _role: iam.IRoleRef` で保持
- `public get role(): iam.IRole` で公開（duck typing でダウンキャスト）
- ARN 参照は `this._role.roleRef.roleArn` を使う
- ロール決定ロジックを private メソッドに集約（自動生成フォールバックパターン）

### 自動生成フォールバックパターンの役割

`props.role` が渡されたか否かの分岐を private メソッド 1 か所に集約し、コンストラクタ冒頭でその結果を `_role` に格納する。これにより、その後の ARN 参照箇所（`CfnPodIdentityAssociation`・`KubernetesManifest` アノテーション）で条件分岐が不要になる。

```typescript
// コンストラクタ内: 1回だけ決定する
this._role = this.resolvePodIdentityRole();

// 以降: 条件分岐なしで参照できる
roleArn: this._role.roleRef.roleArn
```

---

## 変更 1: `import` 文の更新

**ファイル**: `service-account.ts` L5

`IRoleRef` を追加で import する：

```typescript
import type { AddToPrincipalPolicyResult, IPrincipal, IRole, IRoleRef, PrincipalPolicyFragment } from '../../aws-iam';
```

---

## 変更 2: `ServiceAccountOptions` に `role` プロパティ追加

**ファイル**: `service-account.ts`（`ServiceAccountOptions` インターフェース末尾）

型は `IRoleRef`（`IRole` ではない）：

```typescript
/**
 * An existing IAM role to associate with this service account via Pod Identity.
 * Only valid when `identityType` is `IdentityType.POD_IDENTITY`.
 *
 * When specified, the provided role is used instead of auto-generating one.
 * The caller is responsible for configuring the trust policy of the role correctly.
 *
 * @default - a new IAM role is created automatically
 */
readonly role?: IRoleRef;
```

---

## 変更 3: クラスフィールドの変更

**ファイル**: `service-account.ts`（`ServiceAccount` クラス内）

`public readonly role: IRole` を **getter** に変更し、内部保持用フィールドを追加する：

```typescript
// 変更: readonly プロパティから getter へ
// （TypeScript の API 互換性は維持される。消費者側から見た挙動は同じ）
public get role(): IRole { ... }  // 変更 3-b で定義

// 追加: IRSA 時のロールを保持
private _irsaRole?: IRole;

// 追加: POD_IDENTITY 時のロールを IRoleRef として保持
private _podIdentityRole?: IRoleRef;
```

> **補足**: `BedrockCreateModelCustomizationJob` では `_role` を常に `IRoleRef` で保持しているが、`ServiceAccount` は IRSA / POD_IDENTITY の両モードがあるため、モード別にフィールドを分けて持つ設計とする。

### 変更 3-b: `role` getter の追加

```typescript
/**
 * The role which is linked to the service account.
 *
 * Note: If an L1 construct (e.g. CfnRole) was provided as the `role` option,
 * accessing this property will throw an error. Use `roleRef.roleArn` via the
 * CfnPodIdentityAssociation directly in that case.
 */
public get role(): IRole {
  if (this._podIdentityRole !== undefined) {
    // POD_IDENTITY の場合: IRole かどうか確認してキャスト
    if ('grant' in this._podIdentityRole) {
      return this._podIdentityRole as IRole;
    }
    throw new ValidationError(
      'ServiceAccountRole',
      'The provided role is not an instance of IRole. ' +
      'Cannot access role grants when using an L1 construct (e.g. CfnRole) as the role.',
      this,
    );
  }
  // IRSA の場合: 常に IRole として保持されている
  return this._irsaRole!;
}
```

**この設計の意図**:

| 操作 | L2 `Role` を渡した場合 | L1 `CfnRole` を渡した場合 |
|---|---|---|
| ServiceAccount の作成 | ✅ 成功 | ✅ 成功 |
| PodIdentityAssociation の作成 | ✅ 成功 | ✅ 成功 |
| `sa.role.addManagedPolicy(...)` | ✅ 成功 | ❌ getter でエラー |
| `sa.role.grant(...)` | ✅ 成功 | ❌ getter でエラー |

コンストラクタでエラーにすると L1 を渡した場合に ServiceAccount 自体が作れなくなるが、`CfnPodIdentityAssociation` の作成には `roleRef.roleArn` があれば十分なため、getter でのみエラーにするほうが意図した設計となる。

---

## 変更 4: コンストラクタのバリデーション追加

**ファイル**: `service-account.ts`（DNS バリデーションの直後）

```typescript
if (props.role !== undefined && props.identityType !== IdentityType.POD_IDENTITY) {
  throw new Error(
    'The `role` option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.',
  );
}
```

---

## 変更 5: コンストラクタの `principal` / `role` 決定ロジック置き換え

**ファイル**: `service-account.ts` L161〜211（`let principal: IPrincipal;` から `this.role = role;` まで）

```typescript
let role: IRole;
if (props.identityType !== IdentityType.POD_IDENTITY) {
  /* Add conditions to the role to improve security. This prevents other pods in the same namespace to assume the role.
  * See documentation: https://docs.aws.amazon.com/eks/latest/userguide/create-service-account-iam-policy-and-role.html
  */
  const conditions = new CfnJson(this, 'ConditionJson', {
    value: {
      [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
      [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: `system:serviceaccount:${this.serviceAccountNamespace}:${this.serviceAccountName}`,
    },
  });
  const principal = new OpenIdConnectPrincipal(cluster.openIdConnectProvider).withConditions({
    StringEquals: conditions,
  });
  role = new Role(this, 'Role', { assumedBy: principal });
} else {
  // EKS Pod Identity does not support Fargate
  // TODO: raise an error when using Fargate

  // ロール決定ロジックを private メソッドに集約（自動生成フォールバックパターン）
  this._podIdentityRole = this.resolvePodIdentityRole();

  // ensure the pod identity agent
  cluster.eksPodIdentityAgent;

  // associate this service account with the pod role for the cluster
  new CfnPodIdentityAssociation(this, 'Association', {
    clusterName: cluster.clusterName,
    namespace: props.namespace ?? 'default',
    roleArn: this._podIdentityRole.roleRef.roleArn,
    serviceAccount: this.serviceAccountName,
  });

}

// IRSA の場合のみ _irsaRole に格納（POD_IDENTITY は getter 経由で _podIdentityRole から返す）
if (props.identityType !== IdentityType.POD_IDENTITY) {
  this._irsaRole = role;
}
```

---

## 変更 6: private メソッド `resolvePodIdentityRole` の追加

**ファイル**: `service-account.ts`（クラス末尾）

```typescript
/**
 * Resolves the IAM role to use for Pod Identity.
 * Returns the provided role if specified, otherwise auto-generates one.
 */
private resolvePodIdentityRole(): IRoleRef {
  if (this.props.role) {
    return this.props.role;
  }
  const role = new Role(this, 'Role', {
    assumedBy: new ServicePrincipal('pods.eks.amazonaws.com'),
  });
  // EKS Pod Identities requires both assumed role actions otherwise it would fail.
  role.assumeRolePolicy!.addStatements(new PolicyStatement({
    actions: ['sts:AssumeRole', 'sts:TagSession'],
    principals: [new ServicePrincipal('pods.eks.amazonaws.com')],
  }));
  return role;
}
```

> **注意**: `props` をメソッド内から参照するため、`props` をクラスフィールドとして保持する必要がある（`BedrockCreateModelCustomizationJob` と同様に `private readonly props` として保持）。あるいはコンストラクタ引数を private メソッドに渡す形でも可。

---

## 変更 7: インテグレーションテスト追加

**ファイル**: `packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/integ.eks-pod-identities.ts`（新規作成）

`aws-eks`（v1）の `integ.eks-pod-identities.ts` を参考に、v2 向けに作成する。
既存の auto-generate ケース（Case 1）に加え、外部ロールを `role` prop で渡すケース（Case 2）を同一 Stack 内に含める。

```typescript
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * After deployment, verify with:
 *
 * $ kubectl get po
 *
 * You should see two pods named `demo` and `demo-external-role` in Completed STATUS.
 *
 * $ kubectl logs -f demo
 * $ kubectl logs -f demo-external-role
 *
 * Both pods should show a log message with UserId, Account and Arn,
 * indicating they are running with the correct eks pod identity defined with ServiceAccount.
 * The `demo-external-role` pod uses an externally-created IAM role passed via the `role` prop.
 */

class EksPodIdentitiesStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 1,
      ...getClusterVersionConfig(this),
    });

    // Case 1: auto-generated IAM role (existing behavior)
    const sa = new eks.ServiceAccount(this, 'ServiceAccount', {
      cluster,
      name: 'test-sa',
      namespace: 'default',
      identityType: eks.IdentityType.POD_IDENTITY,
    });

    sa.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    const pod = cluster.addManifest('demopod', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'demo' },
      spec: {
        serviceAccountName: sa.serviceAccountName,
        containers: [
          {
            name: 'demo',
            image: 'public.ecr.aws/amazonlinux/amazonlinux:2023',
            command: ['/bin/bash', '-c', 'yum update -y && yum install -y awscli && aws sts get-caller-identity'],
          },
        ],
      },
    });
    pod.node.addDependency(sa);

    // Case 2: externally-created IAM role passed via the `role` prop
    // The trust policy must allow pods.eks.amazonaws.com with sts:AssumeRole and sts:TagSession.
    const externalRole = new iam.Role(this, 'ExternalRole', {
      assumedBy: new iam.SessionTagsPrincipal(
        new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      ),
    });
    externalRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    const saWithExternalRole = new eks.ServiceAccount(this, 'ServiceAccountWithExternalRole', {
      cluster,
      name: 'test-sa-external-role',
      namespace: 'default',
      identityType: eks.IdentityType.POD_IDENTITY,
      role: externalRole,
    });

    const podWithExternalRole = cluster.addManifest('demopod-external-role', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'demo-external-role' },
      spec: {
        serviceAccountName: saWithExternalRole.serviceAccountName,
        containers: [
          {
            name: 'demo',
            image: 'public.ecr.aws/amazonlinux/amazonlinux:2023',
            command: ['/bin/bash', '-c', 'yum update -y && yum install -y awscli && aws sts get-caller-identity'],
          },
        ],
      },
    });
    podWithExternalRole.node.addDependency(saWithExternalRole);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksPodIdentitiesStack(app, 'eks-pod-identities-v2');

new IntegTest(app, 'integ-eks-pod-identities-v2', {
  testCases: [stack],
});
```

### ポイント

- **Case 1**: 既存動作の確認。`role` prop なしで auto-generate されたロールが正しく機能すること
- **Case 2**: 新機能の確認。`SessionTagsPrincipal(ServicePrincipal('pods.eks.amazonaws.com'))` で事前作成したロールを `role` prop で渡し、Pod Identity Association が正しく作成されること
- 両ケースとも Pod が `Completed` になり `aws sts get-caller-identity` の出力が確認できることが検証の基準

---

## 変更 8: ユニットテスト追加

**ファイル**: `service-account.test.ts` の `describe('Service Account with eks.IdentityType.POD_IDENTITY')` ブロック内に追記

```typescript
test('uses provided role when role prop is specified', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();
  const existingRole = new iam.Role(stack, 'ExistingRole', {
    assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
  });

  // WHEN
  new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    identityType: eks.IdentityType.POD_IDENTITY,
    role: existingRole,
  });
  const t = Template.fromStack(stack);

  // THEN
  // provided role ARN が PodIdentityAssociation に使われること
  t.hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
    ClusterName: { Ref: 'ClusterEB0386A7' },
    Namespace: 'default',
    RoleArn: { 'Fn::GetAtt': ['ExistingRole...', 'Arn'] },
    ServiceAccount: 'stackmyserviceaccount58b9529e',
  });
  // ServiceAccount 用の IAM Role が auto-generate されないこと（ExistingRole のみ存在）
  t.resourceCountIs('AWS::IAM::Role', 1);
  // Pod Identity Agent addon が作られること
  t.hasResourceProperties('AWS::EKS::Addon', {
    AddonName: 'eks-pod-identity-agent',
  });
});

test('throws if role is specified without POD_IDENTITY identity type', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();
  const existingRole = new iam.Role(stack, 'ExistingRole', {
    assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
  });

  // WHEN / THEN
  expect(() => new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    identityType: eks.IdentityType.IRSA,
    role: existingRole,
  })).toThrow('The `role` option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.');
});

test('throws if role is specified with default identity type (IRSA)', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();
  const existingRole = new iam.Role(stack, 'ExistingRole', {
    assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
  });

  // WHEN / THEN
  expect(() => new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    // identityType 未指定 → デフォルト IRSA
    role: existingRole,
  })).toThrow('The `role` option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.');
});

test('sa.role getter returns the provided L2 role', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();
  const existingRole = new iam.Role(stack, 'ExistingRole', {
    assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
  });

  // WHEN
  const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    identityType: eks.IdentityType.POD_IDENTITY,
    role: existingRole,
  });

  // THEN: getter が提供した L2 ロールをそのまま返すこと
  expect(sa.role).toBe(existingRole);
});

test('ServiceAccount creation succeeds when L1 CfnRole is provided, but sa.role getter throws', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();
  const cfnRole = new iam.CfnRole(stack, 'CfnRole', {
    assumeRolePolicyDocument: {
      Statement: [{
        Action: ['sts:AssumeRole', 'sts:TagSession'],
        Effect: 'Allow',
        Principal: { Service: 'pods.eks.amazonaws.com' },
      }],
    },
  });

  // WHEN: ServiceAccount の作成自体は成功すること（コンストラクタでエラーにならない）
  const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    identityType: eks.IdentityType.POD_IDENTITY,
    role: cfnRole,
  });

  // THEN: PodIdentityAssociation は正常に作成されること
  Template.fromStack(stack).hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
    ClusterName: { Ref: 'ClusterEB0386A7' },
    Namespace: 'default',
    ServiceAccount: 'stackmyserviceaccount58b9529e',
  });

  // THEN: sa.role にアクセスすると getter でエラーになること
  expect(() => sa.role).toThrow(
    'The provided role is not an instance of IRole.',
  );
});

test('sa.role getter returns auto-generated role when no role prop is provided with POD_IDENTITY', () => {
  // GIVEN
  const { stack, cluster } = testFixtureCluster();

  // WHEN
  const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
    cluster,
    identityType: eks.IdentityType.POD_IDENTITY,
  });

  // THEN: getter が IRole を返すこと
  expect(sa.role).toBeDefined();
  // addToPrincipalPolicy が呼べること（IRole として機能すること）
  expect(() => sa.addToPrincipalPolicy(
    new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }),
  )).not.toThrow();
});
```

---

## 変更のポイント

| 項目 | 詳細 |
|---|---|
| **`props.role` の型** | `IRoleRef`（`IRole` より広い型。`IRole` は `IRoleRef` を継承しているため渡せる） |
| **`this.role` の実装** | `readonly` プロパティから getter に変更。TypeScript API 互換性は維持される |
| **後方互換性** | `role` 未指定時は従来通りロールを自動生成する |
| **バリデーション** | IRSA（またはデフォルト）で `role` を指定するとコンストラクタ内でエラー |
| **既存ロール使用時の trust policy** | 変更しない（ユーザー責任） |
| **`CfnPodIdentityAssociation`** | 既存ロール・自動生成どちらでも必ず作成される |
| **`cluster.eksPodIdentityAgent`** | 既存ロール・自動生成どちらでも必ず呼ばれる |
| **ARN 参照** | `role.roleArn` ではなく `_podIdentityRole.roleRef.roleArn` を使う |
| **L1 CfnRole を渡した場合** | ServiceAccount・PodIdentityAssociation の作成は成功。`sa.role` アクセス時のみ getter でエラー |

---

## 変更 9: README 追記

**ファイル**: `packages/aws-cdk-lib/aws-eks-v2/README.md`

### 追記箇所

Service Accounts セクション（L830〜）の末尾、`#### Migrating from the deprecated eks.OpenIdConnectProvider` セクションの直前に追記する。

v2 README には Pod Identities セクションが完全に存在しないため、新設する。

### 追記内容

```markdown
### Pod Identities

[Amazon EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) is a feature that simplifies how
Kubernetes applications running on Amazon EKS can obtain AWS IAM credentials. It provides a way to associate an IAM role with a
Kubernetes service account, allowing pods to retrieve temporary AWS credentials without the need
to manage IAM roles and policies directly.

By default, `ServiceAccount` creates an `OpenIdConnectProvider` for
[IRSA (IAM roles for service accounts)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) if
`identityType` is `undefined` or `IdentityType.IRSA`.

You may opt in to Amazon EKS Pod Identities as below:

```ts
declare const cluster: eks.Cluster;

new eks.ServiceAccount(this, 'ServiceAccount', {
  cluster,
  name: 'test-sa',
  namespace: 'default',
  identityType: eks.IdentityType.POD_IDENTITY,
});
```

When you create the `ServiceAccount` with the `identityType` set to `POD_IDENTITY`,
the `ServiceAccount` construct will perform the following actions behind the scenes:

1. It will create an IAM role with the necessary trust policy to allow the `pods.eks.amazonaws.com` principal to assume the role.
   This trust policy grants the EKS service the permission to retrieve temporary AWS credentials on behalf of the pods using this service account.

2. It will enable the "Amazon EKS Pod Identity Agent" add-on on the EKS cluster. This add-on is responsible for managing the temporary
   AWS credentials and making them available to the pods.

3. It will create an association between the IAM role and the Kubernetes service account. This association allows the pods using this
   service account to obtain the temporary AWS credentials from the associated IAM role.

#### Using an existing IAM role with Pod Identity

If you want to manage IAM roles centrally (e.g., in a dedicated `IamConstruct`) or reuse an existing role created via
`iam.Role.fromRoleArn()`, you can pass it to `ServiceAccount` via the `role` property.

The `role` property accepts any `IRoleRef`, including `iam.Role`, `iam.Role.fromRoleArn()`, and L1 `iam.CfnRole`.
**This option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.**

The caller is responsible for configuring the trust policy of the role correctly. For Pod Identity, the role must allow
`pods.eks.amazonaws.com` to perform `sts:AssumeRole` and `sts:TagSession`.

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
declare const cluster: eks.Cluster;

// Create and manage the IAM role separately
const appRole = new iam.Role(this, 'AppRole', {
  assumedBy: new iam.SessionTagsPrincipal(
    new iam.ServicePrincipal('pods.eks.amazonaws.com'),
  ),
});
appRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

// Pass the existing role to ServiceAccount
new eks.ServiceAccount(this, 'AppServiceAccount', {
  cluster,
  name: 'app-sa',
  namespace: 'production',
  identityType: eks.IdentityType.POD_IDENTITY,
  role: appRole,
});
```

When `role` is specified, the auto-generation of an IAM role is skipped.
The provided role's ARN is used directly in the `PodIdentityAssociation`.

> **Note:** If you pass an L1 construct (`iam.CfnRole`) as the `role`, the `ServiceAccount` and `PodIdentityAssociation`
> are created successfully. However, accessing `serviceAccount.role` to call methods such as `grant()` or
> `addManagedPolicy()` will throw an error, as those methods are only available on L2 `IRole` instances.
```

---

## 注意事項

- `IRoleRef` の import を追加する必要がある（現在は `IRole` のみ import 済み）
- `ServiceAccountProps extends ServiceAccountOptions` のため、`ServiceAccountProps` にも自動的に `role` が追加される
- `props` を private メソッドから参照するため、コンストラクタ引数の扱いを調整する（メソッドに引数として渡すか、クラスフィールドとして保持するか、実装時に判断）
- `aws-eks`（v1）パッケージへの同様の対応は別途実施

---

## 検討経緯: IRSA への `role` プロパティ対応について

### 検討内容

POD_IDENTITY だけでなく IRSA でも既存 IAM ロールを受け入れるべきか検討した。

### IRSA における実装上の特性

`service-account.ts` の IRSA ブロックを確認すると、Trust Policy の条件式は以下のようにコンストラクタ内で動的に生成されている：

```typescript
const conditions = new CfnJson(this, 'ConditionJson', {
  value: {
    [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
    [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]:
      `system:serviceaccount:${this.serviceAccountNamespace}:${this.serviceAccountName}`,
  },
});
```

つまり、OIDC Issuer URL・namespace・SA 名はいずれも `ServiceAccount` コンストラクト内で解決される値であり、**クラスターが存在して初めて確定する**。

### 結論: 今回は POD_IDENTITY のみ対応

| 観点 | POD_IDENTITY | IRSA |
|---|---|---|
| Trust Policy に必要な情報 | 静的（`pods.eks.amazonaws.com`） | 動的（OIDC Issuer URL・namespace・SA 名） |
| クラスター外での事前ロール作成 | ✅ 容易 | ❌ クラスター作成後でないと OIDC Issuer URL が確定しない |
| 原 issue の要求スコープ | ✅ 明示的に要求 | ❌ 要求外 |

IRSA の場合、ユーザーが外で IAM ロールを作成するには OIDC Issuer URL を別途取得する必要があり、CDK を使うメリットが薄れる。実装難易度は低いが、**ユーザーにとっての実用性が限られる**ため、今回のスコープから外した。

IRSA 対応が必要な場合は別途 issue/PR として扱う。
