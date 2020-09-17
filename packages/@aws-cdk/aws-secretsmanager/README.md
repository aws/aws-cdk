## AWS Secrets Manager Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

```ts
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
```

### Create a new Secret in a Stack

In order to have SecretsManager generate a new secret value automatically,
you can get started with the following:

[example of creating a secret](test/integ.secret.lit.ts)

The `Secret` construct does not allow specifying the `SecretString` property
of the `AWS::SecretsManager::Secret` resource (as this will almost always
lead to the secret being surfaced in plain text and possibly committed to
your source control).

If you need to use a pre-existing secret, the recommended way is to manually
provision the secret in *AWS SecretsManager* and use the `Secret.fromSecretArn`
or `Secret.fromSecretAttributes` method to make it available in your CDK Application:

```ts
const secret = secretsmanager.Secret.fromSecretAttributes(scope, 'ImportedSecret', {
  secretArn: 'arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>',
  // If the secret is encrypted using a KMS-hosted CMK, either import or reference that key:
  encryptionKey,
});
```

SecretsManager secret values can only be used in select set of properties. For the
list of properties, see [the CloudFormation Dynamic References documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html).

A secret can set `RemovalPolicy`. If it set to `RETAIN`, that removing a secret will fail.

### Grant permission to use the secret to a role

You must grant permission to a resource for that resource to be allowed to
use a secret. This can be achieved with the `Secret.grantRead` and/or `Secret.grantUpdate`
 method, depending on your need:

```ts
const role = new iam.Role(stack, 'SomeRole', { assumedBy: new iam.AccountRootPrincipal() });
const secret = new secretsmanager.Secret(stack, 'Secret');
secret.grantRead(role);
secret.grantWrite(role);
```

If, as in the following example, your secret was created with a KMS key:

```ts
const key = new kms.Key(stack, 'KMS');
const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
secret.grantRead(role);
secret.grantWrite(role);
```

then `Secret.grantRead` and `Secret.grantWrite` will also grant the role the
relevant encrypt and decrypt permissions to the KMS key through the
SecretsManager service principal.

### Rotating a Secret with a custom Lambda function

A rotation schedule can be added to a Secret using a custom Lambda function:

```ts
const fn = new lambda.Function(...);
const secret = new secretsmanager.Secret(this, 'Secret');

secret.addRotationSchedule('RotationSchedule', {
  rotationLambda: fn,
  automaticallyAfter: Duration.days(15)
});
```

See [Overview of the Lambda Rotation Function](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-lambda-function-overview.html) on how to implement a Lambda Rotation Function.

### Rotating database credentials

Define a `SecretRotation` to rotate database credentials:

```ts
new secretsmanager.SecretRotation(this, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, // MySQL single user scheme
  secret: mySecret,
  target: myDatabase, // a Connectable
  vpc: myVpc, // The VPC where the secret rotation application will be deployed
  excludeCharacters: ` ;+%{}` + `@'"\`/\\#`, // A string of characters to never use when generating new passwords. Example is a superset of the characters which will break DMS endpoints and characters which cause problems in BASH scripts.
});
```

The secret must be a JSON string with the following format:

```json
{
  "engine": "<required: database engine>",
  "host": "<required: instance host name>",
  "username": "<required: username>",
  "password": "<required: password>",
  "dbname": "<optional: database name>",
  "port": "<optional: if not specified, default port will be used>",
  "masterarn": "<required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>"
}
```

For the multi user scheme, a `masterSecret` must be specified:

```ts
new secretsmanager.SecretRotation(stack, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
  secret: myUserSecret, // The secret that will be rotated
  masterSecret: myMasterSecret, // The secret used for the rotation
  target: myDatabase,
  vpc: myVpc,
});
```

See also [aws-rds](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-rds/README.md) where
credentials generation and rotation is integrated.

### Importing Secrets

Existing secrets can be imported by ARN, name, and other attributes (including the KMS key used to encrypt the secret).
Secrets imported by name can used the short-form of the name (without the SecretsManager-provided suffx);
the secret name must exist in the same account and region as the stack.
Importing by name makes it easier to reference secrets created in different regions, each with their own suffix and ARN.

```ts
import * as kms from '@aws-cdk/aws-kms';

const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
const encryptionKey = kms.Key.fromKeyArn(stack, 'MyEncKey', 'arn:aws:kms:eu-west-1:111111111111:key/21c4b39b-fde2-4273-9ac0-d9bb5c0d0030');
const mySecretFromArn = secretsmanager.Secret.fromSecretArn(stack, 'SecretFromArn', secretArn);
const mySecretFromName = secretsmanager.Secret.fromSecretName(stack, 'SecretFromName', 'MySecret') // Note: the -f3gDy9 suffix is optional
const mySecretFromAttrs = secretsmanager.Secret.fromSecretAttributes(stack, 'SecretFromAttributes', {
  secretArn,
  encryptionKey,
  secretName: 'MySecret', // Optional, will be calculated from the ARN
});
```
