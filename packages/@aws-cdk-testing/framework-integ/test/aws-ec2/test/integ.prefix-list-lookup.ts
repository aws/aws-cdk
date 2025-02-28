import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { PrefixList } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'prefixlist-from-lookup', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const prefixList = PrefixList.fromLookup(stack, 'PrefixList', {
  prefixListName: 'com.amazonaws.global.cloudfront.origin-facing',
});

new cdk.CfnOutput(stack, 'PrefixListId', { value: prefixList.prefixListId });

new integ.IntegTest(app, 'prefixlist-from-lookup-integ', {
  enableLookups: true,
  testCases: [stack],
});
