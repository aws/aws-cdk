import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpNlbIntegration } from '../../lib';

const app = new App();

const stack = new Stack(app, 'integ-nlb-integration');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', { port: 80 });

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpNlbIntegration('DefaultIntegration', listener),
});

new CfnOutput(stack, 'Endpoint', {
  value: httpEndpoint.url!,
});
