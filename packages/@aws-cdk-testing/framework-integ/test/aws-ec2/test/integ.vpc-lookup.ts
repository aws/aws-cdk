import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StackUnderTest', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
});
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpcFromLookup = ec2.Vpc.fromLookup(stack, 'VpcFromLookup', {
  isDefault: true,
});

new cdk.CfnOutput(stack, 'OutputFromLookup', {
  value: `Region fromLookup: ${vpcFromLookup.env.region}`,
});

new IntegTest(app, 'VpcLookupTest', {
  testCases: [stack],
  regions: ['us-east-1'], // Snapshot contains region-specific output, must match synth region
});
app.synth();
