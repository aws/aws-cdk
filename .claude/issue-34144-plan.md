# Issue #34144 実装方針

## 対象 Issue

https://github.com/aws/aws-cdk/issues/34144

## 問題の概要

`AccessEntry` の `principal` プロパティが `string`（ARN）のみ受け付けており、CDK の慣習である
`IPrincipal` オブジェクト（例: `role`, `user`）を直接渡せない。

## 制約

| 制約 | 内容 |
|------|------|
| 後方互換必須 | `principal: string` は削除不可（eks-v2 は alpha 版ではなくなっているため） |
| jsii 制約 | Union 型 (`string \| IPrincipal`) は公開 API では使用不可 |
| ARN の解決 | `IPrincipal` は ARN を直接公開しないため、duck typing で解決する |

## インターフェース設計の検討

`IGrantable` ではなく `IPrincipal` を採用する。

| 観点 | `IGrantable` | `IPrincipal` |
|------|-------------|-------------|
| 意味 | 権限を付与される対象（grantee） | IAM プリンシパル（ユーザー・ロール等） |
| AccessEntry との適合 | △ ポリシーを書き換えるわけではないためずれがある | ○ 「このプリンシパルのエントリを作る」と自然 |
| `IRole` / `IUser` が実装しているか | ○ | ○ |
| ARN を直接公開 | ✗ | ✗（duck typing が必要） |

`AccessEntry` は権限の付与（grant）を行わず、プリンシパルを識別子として扱うため、
`IGrantable` より `IPrincipal` の方が意味的に正確。

## 対象ファイル

各パッケージ（`aws-eks-v2` / `aws-eks`）ごとに以下の 4 ファイルを変更する。

| ファイル | 変更内容 |
|---|---|
| `packages/aws-cdk-lib/aws-eks-v2/lib/access-entry.ts` | インターフェース・コンストラクタの修正 |
| `packages/aws-cdk-lib/aws-eks-v2/test/access-entry.test.ts` | ユニットテスト追加 |
| `packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/integ.eks-access-entry-iam-principal.ts` | インテグレーションテスト追加 |
| `packages/aws-cdk-lib/aws-eks-v2/README.md` | ドキュメント追加 |

`aws-eks` への適用時は、上記の `aws-eks-v2` を `aws-eks` に読み替える。

## 実装方針

### 方針：新しいオプション `iamPrincipal` プロパティを追加

| 変更点 | 内容 |
|--------|------|
| `principal: string` | → `principal?: string`（optional 化 + `@deprecated` 追加） |
| `iamPrincipal?: iam.IPrincipal` | 新規追加（IAM ロール・ユーザーを直接渡せる） |
| コンストラクタ | `principal` / `iamPrincipal` の排他バリデーション + ARN 解決ロジック追加 |

`iamPrincipal` という命名は、既存の `principal: string` との命名衝突を避けつつ、
意味的に「IAM プリンシパル」であることを明示する。

---

## 変更詳細

### 1. import 追加（access-entry.ts）

```ts
import type * as iam from '../../aws-iam';
```

`aws-eks` モジュールはすでに `../../aws-iam` に依存しているため、依存関係の追加は不要。

---

### 2. `AccessEntryProps` インターフェースの変更

```ts
// 変更前
/**
 * The Amazon Resource Name (ARN) of the principal (user or role) to associate the access entry with.
 */
readonly principal: string;

// 変更後
/**
 * The Amazon Resource Name (ARN) of the principal (user or role) to associate the access entry with.
 *
 * Mutually exclusive with `iamPrincipal`. Either `principal` or `iamPrincipal` must be specified.
 *
 * @deprecated Use `iamPrincipal` to pass an IAM principal construct directly.
 */
readonly principal?: string;

/**
 * The IAM principal (role or user) to associate with the access entry.
 *
 * Only IAM roles and users are supported.
 * Mutually exclusive with `principal`. Either `principal` or `iamPrincipal` must be specified.
 */
readonly iamPrincipal?: iam.IPrincipal;
```

---

### 3. コンストラクタ内の ARN 解決ロジック

現在の `this.principal = props.principal;` を以下に置き換える。

```ts
// 排他バリデーション
if (props.iamPrincipal !== undefined && props.principal !== undefined) {
  throw new ValidationError(
    'Only one of `iamPrincipal` or `principal` can be specified, not both.',
    this,
  );
}

// ARN を解決
let resolvedPrincipalArn: string;
if (props.iamPrincipal !== undefined) {
  if ('roleArn' in props.iamPrincipal) {
    resolvedPrincipalArn = (props.iamPrincipal as iam.IRole).roleArn;
  } else if ('userArn' in props.iamPrincipal) {
    resolvedPrincipalArn = (props.iamPrincipal as iam.IUser).userArn;
  } else {
    throw new ValidationError(
      'Cannot determine the ARN from the provided `iamPrincipal`. ' +
      'Only IAM roles and users are supported. ' +
      'Use the `principal` property with an explicit ARN string instead.',
      this,
    );
  }
} else if (props.principal !== undefined) {
  resolvedPrincipalArn = props.principal;
} else {
  throw new ValidationError(
    'Either `iamPrincipal` or `principal` must be specified.',
    this,
  );
}

this.principal = resolvedPrincipalArn;
```

---

## 設計上のポイント

- `IPrincipal` に対する duck typing（`'roleArn' in p` / `'userArn' in p`）は
  **内部実装** であるため jsii の公開 API 制約に抵触しない
- `IRole`, `IUser` は aws-eks がすでに依存している `../../aws-iam` に存在するため追加依存不要
- EKS Access Entry が実際に対応している主体は IAM ロール・ユーザーのみであり、この制限は AWS の仕様に合致している

## 後方互換性

```ts
const role = new iam.Role(stack, 'Role', { ... });
const user = new iam.User(stack, 'User', { ... });

// 既存の書き方（そのまま動く）
new AccessEntry(stack, 'Entry1', { principal: role.roleArn, ... });

// 新しい書き方（IPrincipal を直接渡す）
new AccessEntry(stack, 'Entry2', { iamPrincipal: role, ... });
new AccessEntry(stack, 'Entry3', { iamPrincipal: user, ... });
```

## テストケース追加方針（access-entry.test.ts）

以下のテストケースを `describe('iamPrincipal', ...)` ブロックとして追加する。

1. `iamPrincipal` に IAM ロールを渡した場合、`PrincipalArn` にロールの ARN が設定されること
2. `iamPrincipal` に IAM ユーザーを渡した場合、`PrincipalArn` にユーザーの ARN が設定されること
3. `iamPrincipal` と `principal` を両方指定した場合に `ValidationError` がスローされること
4. `iamPrincipal` も `principal` も指定しない場合に `ValidationError` がスローされること
5. `iamPrincipal` にロール・ユーザー以外（サポート外）を渡した場合に `ValidationError` がスローされること

## インテグレーションテスト追加方針

`integ.eks-access-entry-iam-principal.ts` を新規作成する。

インターフェースの変更（新プロパティの追加）はインテグレーションテストによる実環境での確認が必要なため、
以下の 2 ケースを 1 つのスタックにまとめて検証する。

| テスト | 内容 |
|---|---|
| Test 1 | `iamPrincipal: role`（IAM ロール）で `AccessEntry` を作成できること |
| Test 2 | `iamPrincipal: user`（IAM ユーザー）で `AccessEntry` を作成できること |

既存のインテグレーションテスト（`integ.eks-standard-access-entry.ts` 等）と同じ構造に従い、
`IntegTest` コンストラクトでラップする。

## README 追記方針（aws-eks-v2/README.md）

Access Entry セクション内の `grantAccess()` の例と `#### Access Entry Types` の間に、
`#### Using AccessEntry directly with IAM principals` サブセクションを追加する。

記載内容：
- `iamPrincipal` を使った IAM ロールの渡し方
- `iamPrincipal` を使った IAM ユーザーの渡し方
- ロール・ユーザー以外には `principal`（ARN 文字列）を使う旨の注記

## PR title

feat(eks-v2): allow AccessEntry to accept IAM principals directly via iamPrincipal

