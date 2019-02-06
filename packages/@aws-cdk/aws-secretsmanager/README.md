## AWS SecretsManager Construct Library

```ts
const secretsmanager = require('@aws-cdk/aws-secretsmanager');
```

### Create a new Secret in a Stack

In order to have SecretsManager generate a new secret value automatically, you can get started with the following:

[example of creating a secret](test/integ.secret.lit.ts)

The `Secret` construct does not allow specifying the `SecretString` property of the `AWS::SecretsManager::Secret`
resource as this will almost always lead to the secret being surfaced in plain text. If you need to use a pre-existing
secret, the recommended way to proceed is to manually provision the secret in *AWS SecretsManager* and use the
`Secret.import` method to make it available in your CDK Application:

```ts
const secret = Secret.import(scope, 'ImportedSecret', {
  secretArn: 'arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>',
  // If the secret is encrypted using a KMS-hosted CMK, either import or reference that key:
  encryptionKey,
});
```
