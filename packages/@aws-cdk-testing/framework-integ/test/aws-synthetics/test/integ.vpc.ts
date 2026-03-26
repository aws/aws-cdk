import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

const app = new cdk.App({ context: { '@aws-cdk/core:disableGitSource': true } });
const stack = new cdk.Stack(app, 'canary-vpc');

const vpc = new ec2.Vpc(stack, 'MyVpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new synthetics.Canary(stack, 'MyVpcCanary', {
  canaryName: 'canary-vpc',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
  vpc,
});

new IntegTest(app, 'integ-vpc', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // The canary's Lambda function creates Hyperplane ENIs in the VPC.
      // Lambda requires up to 20 minutes to delete these ENIs after the function is removed.
      // CloudFormation attempts to delete subnets/SGs before ENIs are released, causing DELETE_FAILED.
      // See: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html#configuration-vpc-enis
      expectError: true,
    },
  },
});
