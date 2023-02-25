# AWS Key Management Service Construct Library


Define a KMS key:

```ts
new kms.Key(this, 'MyKey', {
  enableKeyRotation: true,
});
```

Define a KMS key with waiting period:

Specifies the number of days in the waiting period before AWS KMS deletes a CMK that has been removed from a CloudFormation stack.

```ts
const key = new kms.Key(this, 'MyKey', {
  pendingWindow: Duration.days(10), // Default to 30 Days
});
```


Add a couple of aliases:

```ts
const key = new kms.Key(this, 'MyKey');
key.addAlias('alias/foo');
key.addAlias('alias/bar');
```


Define a key with specific key spec and key usage:

Valid `keySpec` values depends on `keyUsage` value.

```ts
const key = new kms.Key(this, 'MyKey', {
  keySpec: kms.KeySpec.ECC_SECG_P256K1, // Default to SYMMETRIC_DEFAULT
  keyUsage: kms.KeyUsage.SIGN_VERIFY,    // and ENCRYPT_DECRYPT
});
```

## Sharing keys between stacks

To use a KMS key in a different stack in the same CDK application,
pass the construct to the other stack:

[sharing key between stacks](test/integ.key-sharing.lit.ts)


## Importing existing keys

### Import key by ARN

To use a KMS key that is not defined in this CDK app, but is created through other means, use
`Key.fromKeyArn(parent, name, ref)`:

```ts
const myKeyImported = kms.Key.fromKeyArn(this, 'MyImportedKey', 'arn:aws:...');

// you can do stuff with this imported key.
myKeyImported.addAlias('alias/foo');
```

Note that a call to `.addToResourcePolicy(statement)` on `myKeyImported` will not have
an affect on the key's policy because it is not owned by your stack. The call
will be a no-op.

### Import key by alias

If a Key has an associated Alias, the Alias can be imported by name and used in place
of the Key as a reference. A common scenario for this is in referencing AWS managed keys.

```ts
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

const myKeyAlias = kms.Alias.fromAliasName(this, 'myKey', 'alias/aws/s3');
const trail = new cloudtrail.Trail(this, 'myCloudTrail', {
  sendToCloudWatchLogs: true,
  kmsKey: myKeyAlias,
});
```

Note that calls to `addToResourcePolicy` and `grant*` methods on `myKeyAlias` will be
no-ops, and `addAlias` and `aliasTargetKey` will fail, as the imported alias does not
have a reference to the underlying KMS Key.

### Lookup key by alias

If you can't use a KMS key imported by alias (e.g. because you need access to the key id), you can lookup the key with `Key.fromLookup()`.

In general, the preferred method would be to use `Alias.fromAliasName()` which returns an `IAlias` object which extends `IKey`. However, some services need to have access to the underlying key id. In this case, `Key.fromLookup()` allows to lookup the key id.

The result of the `Key.fromLookup()` operation will be written to a file
called `cdk.context.json`. You must commit this file to source control so
that the lookup values are available in non-privileged environments such
as CI build steps, and to ensure your template builds are repeatable.

Here's how `Key.fromLookup()` can be used:

```ts
const myKeyLookup = kms.Key.fromLookup(this, 'MyKeyLookup', {
  aliasName: 'alias/KeyAlias',
});

const role = new iam.Role(this, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
myKeyLookup.grantEncryptDecrypt(role);
```

Note that a call to `.addToResourcePolicy(statement)` on `myKeyLookup` will not have
an affect on the key's policy because it is not owned by your stack. The call
will be a no-op.

## Key Policies

Controlling access and usage of KMS Keys requires the use of key policies (resource-based policies attached to the key);
this is in contrast to most other AWS resources where access can be entirely controlled with IAM policies,
and optionally complemented with resource policies. For more in-depth understanding of KMS key access and policies, see

* https://docs.aws.amazon.com/kms/latest/developerguide/control-access-overview.html
* https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html

KMS keys can be created to trust IAM policies. This is the default behavior for both the KMS APIs and in
the console. This behavior is enabled by the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag,
which is set for all new projects; for existing projects, this same behavior can be enabled by
passing the `trustAccountIdentities` property as `true` when creating the key:

```ts
new kms.Key(this, 'MyKey', { trustAccountIdentities: true });
```

With either the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag set,
or the `trustAccountIdentities` prop set, the Key will be given the following default key policy:

```json
{
  "Effect": "Allow",
  "Principal": {"AWS": "arn:aws:iam::111122223333:root"},
  "Action": "kms:*",
  "Resource": "*"
}
```

This policy grants full access to the key to the root account user.
This enables the root account user -- via IAM policies -- to grant access to other IAM principals.
With the above default policy, future permissions can be added to either the key policy or IAM principal policy.

```ts
const key = new kms.Key(this, 'MyKey');
const user = new iam.User(this, 'MyUser');
key.grantEncrypt(user); // Adds encrypt permissions to user policy; key policy is unmodified.
```

Adopting the default KMS key policy (and so trusting account identities)
solves many issues around cyclic dependencies between stacks.
Without this default key policy, future permissions must be added to both the key policy and IAM principal policy,
which can cause cyclic dependencies if the permissions cross stack boundaries.
(For example, an encrypted bucket in one stack, and Lambda function that accesses it in another.)

### Appending to or replacing the default key policy

The default key policy can be amended or replaced entirely, depending on your use case and requirements.
A common addition to the key policy would be to add other key admins that are allowed to administer the key
(e.g., change permissions, revoke, delete). Additional key admins can be specified at key creation or after
via the `grantAdmin` method.

```ts
const myTrustedAdminRole = iam.Role.fromRoleArn(this, 'TrustedRole', 'arn:aws:iam:....');
const key = new kms.Key(this, 'MyKey', {
  admins: [myTrustedAdminRole],
});

const secondKey = new kms.Key(this, 'MyKey2');
secondKey.grantAdmin(myTrustedAdminRole);
```

Alternatively, a custom key policy can be specified, which will replace the default key policy.

> **Note**: In applications without the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag set
and with `trustedAccountIdentities` set to false (the default), specifying a policy at key creation _appends_ the
provided policy to the default key policy, rather than _replacing_ the default policy.

```ts
const myTrustedAdminRole = iam.Role.fromRoleArn(this, 'TrustedRole', 'arn:aws:iam:....');
// Creates a limited admin policy and assigns to the account root.
const myCustomPolicy = new iam.PolicyDocument({
  statements: [new iam.PolicyStatement({
    actions: [
      'kms:Create*',
      'kms:Describe*',
      'kms:Enable*',
      'kms:List*',
      'kms:Put*',
    ],
    principals: [new iam.AccountRootPrincipal()],
    resources: ['*'],
  })],
});
const key = new kms.Key(this, 'MyKey', {
  policy: myCustomPolicy,
});
```

> **Warning:** Replacing the default key policy with one that only grants access to a specific user or role
runs the risk of the key becoming unmanageable if that user or role is deleted.
It is highly recommended that the key policy grants access to the account root, rather than specific principals.
See https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html for more information.
