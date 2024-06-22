import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StackWithSg', {
  env: {
    region: 'eu-west-1',
    account: '123456',
  },
});
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
});
const testSgA = new ec2.SecurityGroup(stack, 'MySgA', { vpc: testVpc, description: 'my-description' });
new ec2.SecurityGroup(stack, 'MySgB', { vpc: testVpc, description: 'my-description' });
cdk.Tags.of(testSgA).add('myTag', 'my-value');

ec2.SecurityGroup.fromLookupByFilters(stack, 'SgFromLookup', {
  description: 'my-description',
  tags: {
    myTag: ['my-value'],
  },
});

new IntegTest(app, 'ArchiveTest', {
  testCases: [stack],
  enableLookups: true,
});
app.synth();

