import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

/**
 * Creates several secrets, with varying names and IDs, with the parseOwnedSecretName feature flag set,
 * to verify the secretName returned by `Secret.secretName` matches the `Name` returned by `DescribeSecrets`.
 */

class SecretsManagerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const defaultSecret = new secretsmanager.Secret(this, 'DefaultSecret');
    const namedSecret = new secretsmanager.Secret(this, 'NamedSecret', { secretName: 'namedSecret' });
    const namedSecretWithHyphen = new secretsmanager.Secret(this, 'NamedSecretWithHyphen', { secretName: 'named-secret-1' });
    const longSecret = new secretsmanager.Secret(this, 'AReallyLongLogicalIThatWillBeTrimmedBeforeItsUsedInTheName');

    const secrets = [defaultSecret, namedSecret, namedSecretWithHyphen, longSecret];

    const resourceType = 'Custom::IntegVerificationSecretNameMatches';
    const serviceToken = cdk.CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: path.join(__dirname, 'integ.secret-name-parsed.handler'),
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
      policyStatements: [{
        Effect: 'Allow',
        Resource: secrets.map(s => s.secretArn),
        Action: ['secretsmanager:DescribeSecret'],
      }],
    });
    new cdk.CustomResource(this, 'SecretNameVerification', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        Secrets: secrets.map(s => ({ secretArn: s.secretArn, secretName: s.secretName })),
      },
    });
  }
}

const app = new cdk.App();
new SecretsManagerStack(app, 'Integ-SecretsManager-ParsedSecretName');
app.synth();
