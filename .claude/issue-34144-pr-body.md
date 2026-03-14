### Issue # (if applicable)

Closes #34144.

### Reason for this change

The `principal` property of `AccessEntry` only accepts a raw ARN `string`, which means users cannot pass IAM constructs (`IRole`, `IUser`, etc.) directly.

For example, the following natural pattern is currently impossible:

```ts
// Currently not possible — the ARN must be unwrapped manually
new eks.AccessEntry(stack, 'Entry', { principal: role.roleArn, ... });

// Desired usage
new eks.AccessEntry(stack, 'Entry', { iamPrincipal: role, ... });
```

Other CDK constructs accept IAM roles and users directly, but `AccessEntry` uniquely requires a raw ARN string, forcing users to manually unwrap `.roleArn` / `.userArn` and resulting in an inconsistent API experience.

Because jsii prohibits Union types in public APIs, using `string | IPrincipal` is not an option. Instead, a new `iamPrincipal?: iam.IPrincipal` property is added while making the existing `principal` optional and marking it `@deprecated`, preserving full backwards compatibility.

### Description of changes

```
  packages/aws-cdk-lib/aws-eks-v2/lib/access-entry.ts
  ┌─────────────────────────────────────────────────────────────────┐
  │  AccessEntryProps                                               │
  │    principal?: string   (made optional + @deprecated)          │
  │    iamPrincipal?: iam.IPrincipal   <-- NEW                      │
  │                                                                 │
  │  constructor                                                    │
  │    - mutual exclusion validation for iamPrincipal / principal   │
  │    - ARN resolution from IPrincipal:                            │
  │        'roleArn' in p  → IRole.roleArn                         │
  │        'userArn' in p  → IUser.userArn                         │
  │        otherwise       → ValidationError                        │
  └─────────────────────────────────────────────────────────────────┘

  packages/aws-cdk-lib/aws-eks-v2/test/access-entry.test.ts
  ┌─────────────────────────────────────────────────────────────────┐
  │  + describe('iamPrincipal', () => {                             │
  │      + test: creates AccessEntry with an IAM role               │
  │      + test: creates AccessEntry with an IAM user               │
  │      + test: both iamPrincipal + principal → ValidationError    │
  │      + test: neither specified → ValidationError                │
  │      + test: unsupported principal (ServicePrincipal) →         │
  │              ValidationError                                    │
  │    })                                                           │
  └─────────────────────────────────────────────────────────────────┘

  packages/@aws-cdk-testing/framework-integ/test/aws-eks-v2/test/
    integ.eks-access-entry-iam-principal.ts   <-- NEW
  ┌─────────────────────────────────────────────────────────────────┐
  │  Test 1: creates AccessEntry with iamPrincipal: role            │
  │  Test 2: creates AccessEntry with iamPrincipal: user            │
  └─────────────────────────────────────────────────────────────────┘

  packages/aws-cdk-lib/aws-eks-v2/README.md
  ┌─────────────────────────────────────────────────────────────────┐
  │  + #### Using AccessEntry directly with IAM principals          │
  │    (examples showing iamPrincipal usage with role and user)     │
  └─────────────────────────────────────────────────────────────────┘
```

**Design notes**

- Duck typing on `IPrincipal` (`'roleArn' in p` / `'userArn' in p`) is an **internal implementation detail** and does not violate jsii's public API constraints.
- EKS Access Entries natively support only IAM roles and users; this restriction aligns with the AWS service specification.
- `aws-eks-v2` already depends on `../../aws-iam`, so no new package dependency is introduced.

### Describe any new or updated permissions being added

None. The `iamPrincipal` property only resolves the construct to an ARN string. No IAM policies or permissions are added or modified.

### Description of how you validated changes

Added 5 unit tests under a new `describe('iamPrincipal', ...)` block, covering:

1. `AccessEntry` created with an IAM role — verifies `PrincipalArn` is set to the role ARN
2. `AccessEntry` created with an IAM user — verifies `PrincipalArn` is set to the user ARN
3. Both `iamPrincipal` and `principal` specified — expects `ValidationError`
4. Neither `iamPrincipal` nor `principal` specified — expects `ValidationError`
5. Unsupported `IPrincipal` type (e.g. `ServicePrincipal`) passed — expects `ValidationError`

CloudFormation template assertions use `Template.fromStack` and all 33 unit tests pass.

A new integration test (`integ.eks-access-entry-iam-principal.ts`) was also added, covering both the IAM role and IAM user cases against a real EKS cluster.

### Checklist
- [x] My code adheres to the [CONTRIBUTING GUIDE](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) and [DESIGN GUIDELINES](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md)

----

*By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license*
