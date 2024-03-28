import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-route53-dnssec');

const kmsKey = new kms.Key(stack, 'KmsKskBase', {
  keySpec: kms.KeySpec.ECC_NIST_P256,
  keyUsage: kms.KeyUsage.SIGN_VERIFY,
});

const hostedZone = new route53.HostedZone(stack, 'HostedZone', {
  zoneName: 'cdk.test',
});
hostedZone.enableDnssec({ kmsKey });

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
