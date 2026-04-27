import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as integ from '@aws-cdk/integ-tests-alpha';

class SecretGrantReadKmsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create a KMS key
    const key = new kms.Key(this, 'Key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a secret encrypted with the KMS key
    const secret = new secretsmanager.Secret(this, 'Secret', {
      encryptionKey: key,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a role and grant it read access to the secret
    const role = new iam.Role(this, 'TestRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    // Suppress guard check: AccountRootPrincipal is intentional here for integ test purposes;
    // the role is used only to verify grantRead grants kms:Decrypt to the grantee.
    (role.node.defaultChild as cdk.CfnResource).addMetadata('guard', {
      SuppressedRules: ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'],
    });

    // grantRead should also grant kms:Decrypt directly to the role
    secret.grantRead(role);
  }
}

const app = new cdk.App();

const stack = new SecretGrantReadKmsStack(app, 'cdk-integ-secret-grant-read-kms');

new integ.IntegTest(app, 'cdk-integ-secret-grant-read-kms-test', {
  testCases: [stack],
});

app.synth();
