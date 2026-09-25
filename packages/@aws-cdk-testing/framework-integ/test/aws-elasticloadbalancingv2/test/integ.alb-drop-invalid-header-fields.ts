import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-alb-drop-invalid-header-fields');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  dropInvalidHeaderFields: false,
});

new integ.IntegTest(app, 'AlbDropInvalidHeaderFields', {
  testCases: [stack],
});

app.synth();
