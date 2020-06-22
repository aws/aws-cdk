## AWS Key Management Service Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

Define a KMS key:

```ts
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'MyKey', {
    enableKeyRotation: true
});
```

Add a couple of aliases:

```ts
const key = new kms.Key(this, 'MyKey');
key.addAlias('alias/foo');
key.addAlias('alias/bar');
```

### Sharing keys between stacks

> see Trust Account Identities for additional details

To use a KMS key in a different stack in the same CDK application,
pass the construct to the other stack:

[sharing key between stacks](test/integ.key-sharing.lit.ts)


### Importing existing keys

> see Trust Account Identities for additional details

To use a KMS key that is not defined in this CDK app, but is created through other means, use
`Key.fromKeyArn(parent, name, ref)`:

```ts
const myKeyImported = kms.Key.fromKeyArn(this, 'MyImportedKey', 'arn:aws:...');

// you can do stuff with this imported key.
myKeyImported.addAlias('alias/foo');
```

Note that a call to `.addToPolicy(statement)` on `myKeyImported` will not have
an affect on the key's policy because it is not owned by your stack. The call
will be a no-op.

If a Key has an associated Alias, the Alias can be imported by name and used in place
of the Key as a reference. A common scenario for this is in referencing AWS managed keys.

```ts
const myKeyAlias = kms.Alias.fromAliasName(this, 'myKey', 'alias/aws/s3');
const trail = new cloudtrail.Trail(this, 'myCloudTrail', {
    sendToCloudWatchLogs: true,
    kmsKey: myKeyAlias
});
```

Note that calls to `addToResourcePolicy` and `grant*` methods on `myKeyAlias` will be
no-ops, and `addAlias` and `aliasTargetKey` will fail, as the imported alias does not
have a reference to the underlying KMS Key.

### Trust Account Identities

KMS keys can be created to trust IAM policies. This is the default behavior in
the console and is described
[here](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html).
This same behavior can be enabled by:

```ts
new Key(stack, 'MyKey', { trustAccountIdentities: true });
```

Using `trustAccountIdentities` solves many issues around cyclic dependencies
between stacks. The most common use case is creating an S3 Bucket with CMK
default encryption which is later accessed by IAM roles in other stacks.

stack-1 (bucket and key created)

```ts
// ... snip
const myKmsKey = new kms.Key(this, 'MyKey', { trustAccountIdentities: true });

const bucket = new Bucket(this, 'MyEncryptedBucket', {
    bucketName: 'myEncryptedBucket',
    encryption: BucketEncryption.KMS,
    encryptionKey: myKmsKey
});
```

stack-2 (lambda that operates on bucket and key)

```ts
// ... snip

const fn = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});

const bucket = s3.Bucket.fromBucketName(this, 'BucketId', 'myEncryptedBucket');

const key = kms.Key.fromKeyArn(this, 'KeyId', 'arn:aws:...'); // key ARN passed via stack props

bucket.grantReadWrite(fn);
key.grantEncryptDecrypt(fn);
```

The challenge in this scenario is the KMS key policy behavior. The simple way to understand
this, is IAM policies for account entities can only grant the permissions granted to the
account root principle in the key policy. When `trustAccountIdentities` is true,
the following policy statement is added:

```json
{
  "Sid": "Enable IAM User Permissions",
  "Effect": "Allow",
  "Principal": {"AWS": "arn:aws:iam::111122223333:root"},
  "Action": "kms:*",
  "Resource": "*"
}
```

As the name suggests this trusts IAM policies to control access to the key.
If account root does not have permissions to the specific actions, then the key
policy and the IAM policy for the entity (e.g. Lambda) both need to grant
permission.


