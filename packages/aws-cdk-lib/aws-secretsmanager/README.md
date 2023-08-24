# AWS Secrets Manager Construct Library



```ts nofixture
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
```

## Create a new Secret in a Stack

To have SecretsManager generate a new secret value automatically,
follow this example:

```ts
declare const vpc: ec2.IVpc;

const instance1 = new rds.DatabaseInstance(this, "PostgresInstance1", {
  engine: rds.DatabaseInstanceEngine.POSTGRES,
  // Generate the secret with admin username `postgres` and random password
  credentials: rds.Credentials.fromGeneratedSecret('postgres'),
  vpc
});
// Templated secret with username and password fields
const templatedSecret = new secretsmanager.Secret(this, 'TemplatedSecret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: 'postgres' }),
    generateStringKey: 'password',
    excludeCharacters: '/@"',
  },
});
// Using the templated secret as credentials
const instance2 = new rds.DatabaseInstance(this, "PostgresInstance2", {
  engine: rds.DatabaseInstanceEngine.POSTGRES,
  credentials: {
    username: templatedSecret.secretValueFromJson('username').toString(),
    password: templatedSecret.secretValueFromJson('password')
  },
  vpc
});
```

If you need to use a pre-existing secret, the recommended way is to manually
provision the secret in *AWS SecretsManager* and use the `Secret.fromSecretArn`
or `Secret.fromSecretAttributes` method to make it available in your CDK Application:

```ts
declare const encryptionKey: kms.Key;
const secret = secretsmanager.Secret.fromSecretAttributes(this, 'ImportedSecret', {
  secretArn: 'arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>',
  // If the secret is encrypted using a KMS-hosted CMK, either import or reference that key:
  encryptionKey,
});
```

SecretsManager secret values can only be used in select set of properties. For the
list of properties, see [the CloudFormation Dynamic References documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html).

A secret can set `RemovalPolicy`. If it set to `RETAIN`, removing that secret will fail.

## Grant permission to use the secret to a role

You must grant permission to a resource for that resource to be allowed to
use a secret. This can be achieved with the `Secret.grantRead` and/or `Secret.grantWrite`
 method, depending on your need:

```ts
const role = new iam.Role(this, 'SomeRole', { assumedBy: new iam.AccountRootPrincipal() });
const secret = new secretsmanager.Secret(this, 'Secret');
secret.grantRead(role);
secret.grantWrite(role);
```

If, as in the following example, your secret was created with a KMS key:

```ts
declare const role: iam.Role;
const key = new kms.Key(this, 'KMS');
const secret = new secretsmanager.Secret(this, 'Secret', { encryptionKey: key });
secret.grantRead(role);
secret.grantWrite(role);
```

then `Secret.grantRead` and `Secret.grantWrite` will also grant the role the
relevant encrypt and decrypt permissions to the KMS key through the
SecretsManager service principal.

The principal is automatically added to Secret resource policy and KMS Key policy for cross account access:

```ts
const otherAccount = new iam.AccountPrincipal('1234');
const key = new kms.Key(this, 'KMS');
const secret = new secretsmanager.Secret(this, 'Secret', { encryptionKey: key });
secret.grantRead(otherAccount);
```

### Using a Custom Lambda Function

A rotation schedule can be added to a Secret using a custom Lambda function:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const fn: lambda.Function;
const secret = new secretsmanager.Secret(this, 'Secret');

secret.addRotationSchedule('RotationSchedule', {
  rotationLambda: fn,
  automaticallyAfter: Duration.days(15),
  rotateImmediatelyOnUpdate: false, // default is true
});
```

Note: The required permissions for Lambda to call SecretsManager and the other way round are automatically granted based on [AWS Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions.html) as long as the Lambda is not imported.

See [Overview of the Lambda Rotation Function](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-lambda-function-overview.html) on how to implement a Lambda Rotation Function.

### Using a Hosted Lambda Function

Use the `hostedRotation` prop to rotate a secret with a hosted Lambda function:

```ts
const secret = new secretsmanager.Secret(this, 'Secret');

secret.addRotationSchedule('RotationSchedule', {
  hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
});
```

Hosted rotation is available for secrets representing credentials for MySQL, PostgreSQL, Oracle,
MariaDB, SQLServer, Redshift and MongoDB (both for the single and multi user schemes).

When deployed in a VPC, the hosted rotation implements `ec2.IConnectable`:

```ts
declare const myVpc: ec2.IVpc;
declare const dbConnections: ec2.Connections;
declare const secret: secretsmanager.Secret;

const myHostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({ vpc: myVpc });
secret.addRotationSchedule('RotationSchedule', { hostedRotation: myHostedRotation });
dbConnections.allowDefaultPortFrom(myHostedRotation);
```

Use the `excludeCharacters` option to customize the characters excluded from
the generated password when it is rotated. By default, the rotation excludes
the same characters as the ones excluded for the secret. If none are defined
then the following set is used: ``% +~`#$&*()|[]{}:;<>?!'/@"\``.


See also [Automating secret creation in AWS CloudFormation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_cloudformation.html).

## Rotating database credentials

Define a `SecretRotation` to rotate database credentials:

```ts
declare const mySecret: secretsmanager.Secret;
declare const myDatabase: ec2.IConnectable;
declare const myVpc: ec2.Vpc;

new secretsmanager.SecretRotation(this, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, // MySQL single user scheme
  secret: mySecret,
  target: myDatabase, // a Connectable
  vpc: myVpc, // The VPC where the secret rotation application will be deployed
  excludeCharacters: ' %+:;{}', // characters to never use when generating new passwords;
                                // by default, no characters are excluded,
                                // which might cause problems with some services, like DMS
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
declare const myUserSecret: secretsmanager.Secret;
declare const myMasterSecret: secretsmanager.Secret;
declare const myDatabase: ec2.IConnectable;
declare const myVpc: ec2.Vpc;

new secretsmanager.SecretRotation(this, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
  secret: myUserSecret, // The secret that will be rotated
  masterSecret: myMasterSecret, // The secret used for the rotation
  target: myDatabase,
  vpc: myVpc,
});
```

By default, any stack updates will cause AWS Secrets Manager to rotate a secret immediately. To prevent this behavior and wait until the next scheduled rotation window specified via the `automaticallyAfter` property, set the `rotateImmediatelyOnUpdate` property to false:

```ts
declare const myUserSecret: secretsmanager.Secret;
declare const myMasterSecret: secretsmanager.Secret;
declare const myDatabase: ec2.IConnectable;
declare const myVpc: ec2.Vpc;

new secretsmanager.SecretRotation(this, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
  secret: myUserSecret, // The secret that will be rotated
  masterSecret: myMasterSecret, // The secret used for the rotation
  target: myDatabase,
  vpc: myVpc,
  automaticallyAfter: Duration.days(7),
  rotateImmediatelyOnUpdate: false,
});
```

See also [aws-rds](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-rds/README.md) where
credentials generation and rotation is integrated.

## Importing Secrets

Existing secrets can be imported by ARN, name, and other attributes (including the KMS key used to encrypt the secret).
Secrets imported by name should use the short-form of the name (without the SecretsManager-provided suffix);
the secret name must exist in the same account and region as the stack.
Importing by name makes it easier to reference secrets created in different regions, each with their own suffix and ARN.

```ts
const secretCompleteArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
const secretPartialArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret'; // No Secrets Manager suffix
const encryptionKey = kms.Key.fromKeyArn(this, 'MyEncKey', 'arn:aws:kms:eu-west-1:111111111111:key/21c4b39b-fde2-4273-9ac0-d9bb5c0d0030');
const mySecretFromCompleteArn = secretsmanager.Secret.fromSecretCompleteArn(this, 'SecretFromCompleteArn', secretCompleteArn);
const mySecretFromPartialArn = secretsmanager.Secret.fromSecretPartialArn(this, 'SecretFromPartialArn', secretPartialArn);
const mySecretFromName = secretsmanager.Secret.fromSecretNameV2(this, 'SecretFromName', 'MySecret')
const mySecretFromAttrs = secretsmanager.Secret.fromSecretAttributes(this, 'SecretFromAttributes', {
  secretCompleteArn,
  encryptionKey,
});
```

## Replicating secrets

Secrets can be replicated to multiple regions by specifying `replicaRegions`:

```ts
declare const myKey: kms.Key;
new secretsmanager.Secret(this, 'Secret', {
  replicaRegions: [
    {
      region: 'eu-west-1',
    },
    {
      region: 'eu-central-1',
      encryptionKey: myKey,
    }
  ]
});
```

Alternatively, use `addReplicaRegion()`:

```ts
const secret = new secretsmanager.Secret(this, 'Secret');
secret.addReplicaRegion('eu-west-1');
```

## Creating JSON Secrets

Sometimes it is necessary to create a secret in SecretsManager that contains a JSON object.
For example:

```json
{
  "username": "myUsername",
  "database": "foo",
  "password": "mypassword"
}
```

In order to create this type of secret, use the `secretObjectValue` input prop.

```ts
const user = new iam.User(this, 'User');
const accessKey = new iam.AccessKey(this, 'AccessKey', { user });
declare const stack: Stack;

new secretsmanager.Secret(this, 'Secret', {
  secretObjectValue: {
    username: SecretValue.unsafePlainText(user.userName),
    database: SecretValue.unsafePlainText('foo'),
    password: accessKey.secretAccessKey,
  },
})
```

In this case both the `username` and `database` are not a `Secret` so `SecretValue.unsafePlainText` needs to be used.
This means that they will be rendered as plain text in the template, but in this case neither of those
are actual "secrets".
