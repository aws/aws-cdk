import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'key-from-lookup-dummy', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const dummy = Key.fromLookup(stack, 'Key', { aliasName: 'alias/foo', returnDummyKeyOnMissing: true });

new cdk.CfnOutput(stack, 'KeyId', { value: dummy.keyId });

new integ.IntegTest(app, 'key-from-lookup-dummy-integ', {
  enableLookups: true,
  testCases: [stack],
});
