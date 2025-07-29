import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'LambdaAllowAllIpv6Outbound');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new lambda.Function(stack, 'Lambda_with_IPv6_VPC', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.PYTHON_3_9,
  vpc,
  allowAllIpv6Outbound: true,
});

new IntegTest(app, 'lambda-allow-all-ipv6-outbound', {
  testCases: [stack],
});

app.synth();
