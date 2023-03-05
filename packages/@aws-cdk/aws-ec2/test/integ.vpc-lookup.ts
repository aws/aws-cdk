import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new cdk.App();
const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
/**
 * Since the VPC lookup happens at synthesis time, a manual setup is required beforehand to run this.
 *
 * The following stack with its VPC has to be deployed, so that the context can be filled. Otherwise the context
 * must be set manually so that the lookup works.
 */
const stack = new cdk.Stack(app, 'StackWithVpc', {
  env: {
    region: 'eu-west-1',
    account: account,
  },
  crossRegionReferences: true,
});
const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
});

const stackLookup = new cdk.Stack(app, 'StackUnderTest', {
  env: {
    region: 'us-east-1',
    account: account,
  },
  crossRegionReferences: true,
});

const vpcFromVpcAttributes = ec2.Vpc.fromVpcAttributes(stackLookup, 'VpcFromVpcAttributes', {
  region: 'eu-west-1',
  availabilityZones: ['eu-west-1a'],
  vpcId: testVpc.vpcId,
});

const vpcFromLookup = ec2.Vpc.fromLookup(stackLookup, 'VpcFromLookup', {
  region: 'eu-west-1',
  vpcName: 'my-vpc-name',
});

new cdk.CfnOutput(stackLookup, 'OutputFromVpcAttributes', {
  value: `Region fromVpcAttributes: ${vpcFromVpcAttributes.env.region}`,
});

new cdk.CfnOutput(stackLookup, 'OutputFromLookup', {
  value: `Region fromLookup: ${vpcFromLookup.env.region}`,
});

new IntegTest(app, 'ArchiveTest', {
  testCases: [stackLookup],
  enableLookups: true,
  stackUpdateWorkflow: false,
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        context: {
          [`vpc-provider:account=${account}:filter.tag:Name=my-vpc-name:region=eu-west-1:returnAsymmetricSubnets=true`]:
          JSON.stringify({
            vpcId: 'vpc-0edda5760b8914d41',
            vpcCidrBlock: '10.0.0.0/24',
            availabilityZones: [],
            subnetGroups: [],
          }),
        },
      },
    },
  },
});
app.synth();
