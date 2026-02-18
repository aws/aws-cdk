import * as cdk from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as integ from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create a default secret
    const secret = new secretsmanager.Secret(this, 'Secret');

    // Create a JSON secret containing cfnDynamicReferenceKey values extracted from the default secret
    new secretsmanager.Secret(this, 'JSONSecret', {
      secretObjectValue: {
        cfnDynamicReferenceKeyWithDefaults: SecretValue.unsafePlainText(secret.cfnDynamicReferenceKey()),
        cfnDynamicReferenceKeyWithJsonFieldAndVersionStage: SecretValue.unsafePlainText(secret.cfnDynamicReferenceKey({
          jsonField: 'json-key',
          versionStage: 'version-stage',
        })),
        cfnDynamicReferenceKeyWithJsonFieldAndVersionId: SecretValue.unsafePlainText(secret.cfnDynamicReferenceKey({
          jsonField: 'json-key',
          versionId: 'version-id',
        })),
      },
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'cdk-integ-secrets-dynamic-reference-key');

new integ.IntegTest(app, 'cdk-integ-secrets-dynamic-reference-key-test', {
  testCases: [stack],
});

app.synth();
