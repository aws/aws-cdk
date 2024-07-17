import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

// Deploy the security groups to lookup
const stack = new cdk.Stack(app, 'StackWithSg', { env });
const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  subnetConfiguration: [],
  natGateways: 0,
});
const testSgA = new ec2.SecurityGroup(stack, 'MySgA', { vpc: testVpc });
cdk.Tags.of(testSgA).add('myTag', 'my-value');
const testSgB = new ec2.SecurityGroup(stack, 'MySgB', { vpc: testVpc });
cdk.Tags.of(testSgB).add('myTagKey', 'true');
new ec2.SecurityGroup(stack, 'MySgC', { vpc: testVpc, description: 'my-description' });
new ec2.SecurityGroup(stack, 'MySgD', { vpc: testVpc, description: 'ownerId description' });

// Now perform the lookups
const lookupStack = new cdk.Stack(app, 'LookupStack', { env });
lookupStack.addDependency(stack);
ec2.SecurityGroup.fromLookupByFilters(lookupStack, 'SgFromLookupTags', {
  tags: {
    myTag: ['my-value'],
  },
});

ec2.SecurityGroup.fromLookupByFilters(lookupStack, 'SgFromLookupTagKeys', {
  tagKeys: ['myTagKey'],
});

ec2.SecurityGroup.fromLookupByFilters(lookupStack, 'SgFromLookupDescription', {
  description: 'my-description',
});

ec2.SecurityGroup.fromLookupByFilters(lookupStack, 'SgFromLookupOwnerId', {
  description: 'ownerId description',
  ownerId: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
});

new IntegTest(app, 'SgLookupTest', {
  testCases: [stack],
  enableLookups: true,
});

app.synth();

