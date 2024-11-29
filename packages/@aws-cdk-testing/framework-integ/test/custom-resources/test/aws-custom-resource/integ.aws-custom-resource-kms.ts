import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cr from 'aws-cdk-lib/custom-resources';

class AWSCustomResourceKms extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create key
    const kmsKey = new kms.Key(this, 'TestKey', {
      keySpec: kms.KeySpec.ECC_NIST_P256,
      keyUsage: kms.KeyUsage.SIGN_VERIFY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Export public key
    const publicKeyApiCall = new cr.AwsCustomResource(this, 'KmsTestCr', {
      onCreate: {
        service: 'KMS',
        action: 'GetPublicKey',
        physicalResourceId: cr.PhysicalResourceId.of('KmsTestCrPhysicalResourceId'),
        parameters: {
          KeyId: kmsKey.keyArn,
        },
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      installLatestAwsSdk: true,
    });

    const publicKey = publicKeyApiCall.getResponseField('PublicKey');
    this.exportValue(publicKey, { name: 'PublicKey' });
  }
}

const app = new cdk.App();
new IntegTest(app, 'AWSCustomResourceKmsIntegTest', {
  testCases: [
    new AWSCustomResourceKms(app, 'aws-custom-resource-kms'),
  ],
  diffAssets: true,
});
