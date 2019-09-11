import ec2 = require('@aws-cdk/aws-ec2');
import { App, Construct, Stack } from '@aws-cdk/core';

export function testFixture() {
  const { stack, app } = testFixtureNoVpc();
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}

export function testFixtureNoVpc() {
  const app = new App();
  const stack = new Stack(app, 'Stack', { env: { region: 'us-east-1' }});
  return { stack, app };
}

// we must specify an explicit environment because we have an AMI map that is
// keyed from the target region.
const env = {
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

export class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, { env });
  }
}