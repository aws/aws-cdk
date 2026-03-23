import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new App();
const stack = new Stack(app, 'ALBBooleanAttrsStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  dropInvalidHeaderFields: false,
  preserveHostHeader: false,
  preserveXffClientPort: false,
  wafFailOpen: false,
});

new IntegTest(app, 'ALBBooleanAttrsInteg', {
  testCases: [stack],
});
