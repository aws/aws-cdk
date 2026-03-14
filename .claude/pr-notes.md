# PR提出時の補足事項

## Issue #36653: KubectlProviderOptionsのSecurityGroup対応

### awslint警告の抑制について

#### 警告内容
```
error: [awslint:prefer-ref-interface] API should prefer to use the L1 reference interface (ISecurityGroupRef)
and not the L2 interface (aws-cdk-lib.aws_ec2.ISecurityGroup).
```

#### 対応方針: `[disable-awslint:prefer-ref-interface]`で警告を抑制

#### 理由

1. **Lambda Functionの制約**
   - `lambda.Function`の`securityGroups`プロパティは`ISecurityGroup[]`を期待
   - `ISecurityGroupRef[]`を受け取った場合、内部で`SecurityGroup.fromSecurityGroupId()`を使って`ISecurityGroup[]`に変換する必要がある
   - これは不要な変換処理で、実装が複雑になる

2. **既存コードとの一貫性**
   - 既存の`securityGroup`プロパティも`ec2.ISecurityGroup`を使用
   - 新しい`securityGroups`プロパティも同じ型を使うことで一貫性を保つ

3. **段階的な対応**
   - Lambda側が`ISecurityGroupRef[]`に対応してから、このインターフェースも変更すべき
   - 現時点での対応は過剰なエンジニアリング

4. **実用性**
   - ユーザーは通常`new SecurityGroup()`や既存の`ISecurityGroup`インスタンスを渡す
   - `ISecurityGroup`は`ISecurityGroupRef`を継承しているため、型の互換性はある

#### 参考実装

aws-apigatewayv2の`VpcLink`は`ISecurityGroupRef[]`を使用していますが、これは内部で以下のように変換しています：

```typescript
private renderSecurityGroups() {
  return this.securityGroups.map(sg => sg.securityGroupRef.securityGroupId);
}
```

しかし、Lambda Functionは`ISecurityGroup[]`を直接受け取るため、この変換パターンは適用できません。

#### メンテナへの確認事項

PR提出時に以下を確認：

> **Question for maintainers:**
>
> The `securityGroup` and `securityGroups` properties use `ec2.ISecurityGroup` instead of `ec2.ISecurityGroupRef`,
> which triggers an awslint warning. I've suppressed this warning with `[disable-awslint:prefer-ref-interface]` for the following reasons:
>
> 1. The underlying `lambda.Function` expects `securityGroups: ISecurityGroup[]`, not `ISecurityGroupRef[]`
> 2. Converting from `ISecurityGroupRef[]` to `ISecurityGroup[]` would add unnecessary complexity
> 3. The existing `securityGroup` property already uses `ISecurityGroup` for consistency
> 4. `ISecurityGroup` extends `ISecurityGroupRef`, so there's type compatibility
>
> Is this approach acceptable, or would you prefer a different solution?

#### 将来的な対応

Lambda Functionが`ISecurityGroupRef[]`をサポートした場合：
1. `KubectlProviderOptions`を`ISecurityGroupRef[]`に変更
2. awslintディレクティブを削除
3. 後方互換性のために既存の`ISecurityGroup`も引き続きサポート（型の互換性により自動対応）

---

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

Note: Uses `ISecurityGroup` instead of `ISecurityGroupRef` with awslint
suppression for consistency with the underlying lambda.Function API and
the existing securityGroup property.

Fixes #36653
```
