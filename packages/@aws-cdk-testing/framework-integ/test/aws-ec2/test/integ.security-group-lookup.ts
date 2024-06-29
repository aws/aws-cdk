/// !cdk-integ pragma:enable-lookups
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StackWithSg', {
  env,
});

/// !show
const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
});
const testSgA = new ec2.SecurityGroup(stack, 'MySgA', { vpc: testVpc, description: 'my-description' });
new ec2.SecurityGroup(stack, 'MySgB', { vpc: testVpc, description: 'my-description' });
cdk.Tags.of(testSgA).add('myTag', 'my-value');

const lookupSg = ec2.SecurityGroup.fromLookupByFilters(stack, 'SgFromLookup', {
  description: 'my-description',
  tags: {
    myTag: ['my-value'],
  },
});
lookupSg.node.addDependency(testSgA);
/// !hide

new IntegTest(app, 'SgLookupTest', {
  testCases: [stack],
});

app.synth();

