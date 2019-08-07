import ec2 = require('@aws-cdk/aws-ec2');
import { App, Stack } from '@aws-cdk/core';

export function testFixture() {
  const app = new App();
  const stack = new Stack(app, 'Stack', { env: { region: 'us-east-1' }});
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}
