import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const appWithVpc = new cdk.App();
const stack = new cdk.Stack(appWithVpc, 'StackWithVpc', {
  env: {
    region: 'eu-west-1',
    account: '123456',
  },
});
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
});

const appUnderTest = new cdk.App();
const stackLookup = new cdk.Stack(appUnderTest, 'StackUnderTest', {
  env: {
    region: 'us-east-2',
    account: '123456',
  },
});

const vpcFromVpcAttributes = ec2.Vpc.fromVpcAttributes(stackLookup, 'VpcFromVpcAttributes', {
  region: 'eu-west-1',
  availabilityZones: ['eu-west-1a'],
  vpcId: testVpc.vpcId,
});

const vpcFromLookup = ec2.Vpc.fromLookup(stack, 'VpcFromLookup', {
  region: 'eu-west-1',
  vpcName: 'my-vpc-name',
});

new cdk.CfnOutput(stackLookup, 'OutputFromVpcAttributes', {
  value: `Region fromVpcAttributes: ${vpcFromVpcAttributes.env.region}`,
});

new cdk.CfnOutput(stackLookup, 'OutputFromLookup', {
  value: `Region fromLookup: ${vpcFromLookup.env.region}`,
});

new IntegTest(appUnderTest, 'ArchiveTest', {
  testCases: [stackLookup],
});
appWithVpc.synth();
appUnderTest.synth();
