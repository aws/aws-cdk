import { StringParameter } from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';
import { SubnetType } from '../lib';

const app = new cdk.App();
const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;

const stackLookup = new cdk.Stack(app, 'StackUnderTest', {
  env: {
    region: 'us-east-1',
    account: account,
  },
  crossRegionReferences: true,
});

const vpcFromLookup = ec2.Vpc.fromLookup(stackLookup, 'VpcFromLookup', {
  isDefault: true,
  region: 'eu-west-1',
});

new StringParameter(stackLookup, 'StringParameter', {
  stringValue: `Region fromLookup: ${vpcFromLookup.env.region}`,
  parameterName: 'lookup-region',
  description: 'Region of the looked up vpc',
});

new cdk.CfnOutput(stackLookup, 'OutputFromLookup', { value: `Region fromLookup: ${vpcFromLookup.env.region}` });
new cdk.CfnOutput(stackLookup, 'SuccessfulLookup', { value: `Lookup pending: ${vpcFromLookup.selectSubnets({ subnetType: SubnetType.PUBLIC }).isPendingLookup}` });

const testCase = new IntegTest(app, 'ArchiveTest', {
  testCases: [stackLookup],
  enableLookups: true,
  stackUpdateWorkflow: false,
  diffAssets: false,
  hooks: {
    preDeploy: [
      'yarn cdk deploy --app "node ./test/integ.vpc-lookup.js" StackUnderTest',
    ],
    postDestroy: [
      'yarn cdk destroy --app "node ./test/integ.vpc-lookup.js" StackUnderTest',
    ],
  },
});

const getParameter = testCase.assertions.awsApiCall('SSM', 'getParameter', {
  Name: 'lookup-region',
});
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Value: 'Region fromLookup: eu-west-1',
  },
}));

app.synth();


