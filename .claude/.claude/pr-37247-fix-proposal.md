# PR #37247 修正提案

**PR タイトル**: fix(eks-v2): respect securityGroup(s) in KubectlProviderOptions
**PR URL**: https://github.com/aws/aws-cdk/pull/37247
**レビュアー**: @leonmk-aws
**参照 PR**: https://github.com/aws/aws-cdk/pull/7857 (feat(events-targets): support multiple security groups for an ECS task)

---

## 参照 PR (#7857) との比較・検証結果

PR #7857 は同じパターン（`securityGroup` → `securityGroups` への移行）の先行実装。以下を確認した。

| 項目 | PR #7857 の実装 | 今回の方針 | 判定 |
|------|----------------|-----------|------|
| `@deprecated` タグ | `@deprecated use securityGroups instead` | 同様 | ✅ 妥当 |
| 両方指定時の挙動 | `throw new Error(...)` | `throw new ValidationError(...)` | ✅ 妥当（現代の CDK 規約に合わせ upgrade） |
| `awslint.json` への移動 | 対応なし（旧 PR のため） | awslint.json に追加 | ✅ メンテナ指示通り |

**特記事項**: PR #7857 は 2020 年の旧コードのため `new Error()` を使用しているが、現在の aws-eks-v2 コードベースでは `cluster.ts` の実装に倣い `ValidationError(message, this)` を使うのが正しい。

---

## メンテナから指摘された修正点

### 1. `securityGroup` を `@deprecated` にする

**コメント**: 「`securityGroups` オプションを導入するなら、`securityGroup` を deprecated にすべき」
**対象ファイル**: `packages/aws-cdk-lib/aws-eks-v2/lib/kubectl-provider.ts` (line 50付近)

#### 現在のコード
```typescript
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
```

#### 修正後
```typescript
/**
 * A security group to use for `kubectl` execution.
 *
 * @default - If not specified, the k8s endpoint is expected to be accessible
 * publicly.
 * @deprecated Use `securityGroups` instead.
 */
readonly securityGroup?: ec2.ISecurityGroup;
```

> **補足**: `@deprecated` を付けると JSDoc の説明に `securityGroups` オプションへの移行を促すメッセージを含める。両プロパティを同時指定したときの説明は `securityGroup` 側のコメントから削除する（#3 の変更と合わせて不要になる）。

---

### 2. `[disable-awslint:prefer-ref-interface]` を `awslint.json` に移動する

**コメント**: 「lint 抑制コメントをコード内に書かず、`packages/aws-cdk-lib/awslint.json` の既存エントリ群（line 1926付近）へ移動すること」
**対象ファイル**:
- `packages/aws-cdk-lib/aws-eks-v2/lib/kubectl-provider.ts` (line 62付近) — 削除
- `packages/aws-cdk-lib/awslint.json` (line 1926付近) — 追加

#### kubectl-provider.ts の修正（コメント削除）
```typescript
/**
 * Security groups to use for `kubectl` execution.
 *
 * @default - If not specified, the k8s endpoint is expected to be accessible
 * publicly.
 */
readonly securityGroups?: ec2.ISecurityGroup[];
```

#### awslint.json への追加
既存の `prefer-ref-interface` エントリ群（`KubectlProviderProps.securityGroup` など）の直後に追加する:

```json
"prefer-ref-interface:aws-cdk-lib.aws_eks_v2.KubectlProviderOptions.securityGroups",
```

追加位置のイメージ（awslint.json line 1926付近）:
```json
"prefer-ref-interface:aws-cdk-lib.aws_eks_v2.KubectlProviderProps.securityGroup",
"prefer-ref-interface:aws-cdk-lib.aws_eks_v2.KubectlProviderOptions.securityGroups",  ← 追加
"prefer-ref-interface:aws-cdk-lib.aws_eks_v2.KubectlProviderProps.cluster",
```

---

### 3. 両プロパティが同時指定された場合は warning ではなく error を throw する

**コメント**: 「両プロパティを同時に指定した場合はサポート外であり、ユーザーの設定ミスを示す可能性があるため、warning ではなく throw すべき」
**対象ファイル**: `packages/aws-cdk-lib/aws-eks-v2/lib/kubectl-provider.ts` (line 209付近)

#### 現在のコード
```typescript
if (props.securityGroups && props.securityGroups.length > 0) {
  securityGroups = props.securityGroups;

  // Issue warning if both properties are specified
  if (props.securityGroup) {
    Annotations.of(this).addWarningV2('@aws-cdk/aws-eks-v2:securityGroupConflict',
      'Both securityGroup and securityGroups are specified. Using securityGroups.');
  }
} else if (props.securityGroup) {
```

#### 修正後
`ValidationError` を throw するよう変更する（CDK では `ValidationError` を使う）:

```typescript
if (props.securityGroups && props.securityGroups.length > 0 && props.securityGroup) {
  throw new ValidationError(
    'SecurityGroupConflict',
    'Cannot specify both "securityGroup" and "securityGroups". Use "securityGroups" only.',
    this,
  );
}

if (props.securityGroups && props.securityGroups.length > 0) {
  securityGroups = props.securityGroups;
} else if (props.securityGroup) {
```

> **補足**:
> - `ValidationError` は `../../core/lib/errors` からインポートする（`cluster.ts` で同様に使われている）
> - `kubectl-provider.ts` の現在のインポート文に `ValidationError` が含まれていないため、追加が必要
> - PR #7857 ではエラーチェックをコンストラクタ冒頭（`privateSubnets` 分岐の外側）で行っているが、今回は `privateSubnets` がない場合はセキュリティグループ自体が無視されるため、**チェックは `privateSubnets` 分岐の内側 or 外側どちらでも機能的には同じ**。ただし PR #7857 に倣い、コンストラクタの冒頭（`super()` の直後）で早期チェックする方が明快
> - `securityGroup` JSDoc の両プロパティ同時指定に関する記述も削除する（動作が変わるため）

---

## ユニットテストの修正

`packages/aws-cdk-lib/aws-eks-v2/test/cluster.test.ts`

### 3 の変更に伴い、「両方指定したときのテスト」を変更する

#### 現在のテスト（warning を期待）
```typescript
it('warns when both securityGroup and securityGroups are specified', () => {
  // ...
  expect(Annotations.fromStack(stack).hasWarning(...));
});
```

#### 修正後（throw を期待）
```typescript
it('throws when both securityGroup and securityGroups are specified', () => {
  expect(() => {
    // securityGroup と securityGroups を両方指定するコード
  }).toThrow('Cannot specify both "securityGroup" and "securityGroups"');
});
```

---

## 修正作業の順序

1. `kubectl-provider.ts`:
   - `securityGroup` に `@deprecated` タグを追加
   - `[disable-awslint:prefer-ref-interface]` コメントを削除
   - warning → throw に変更
2. `awslint.json`:
   - `prefer-ref-interface:aws-cdk-lib.aws_eks_v2.KubectlProviderOptions.securityGroups` を追加
3. `cluster.test.ts`:
   - warning テスト → throw テストに変更
4. ビルド・テスト確認:
   ```bash
   cd packages/aws-cdk-lib && yarn build && yarn test aws-eks-v2
   cd packages/aws-cdk-lib && yarn lint
   ```
