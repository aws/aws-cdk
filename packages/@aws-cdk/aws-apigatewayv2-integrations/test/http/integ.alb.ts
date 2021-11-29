import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { HttpAlbIntegration } from '../../lib';

/*
 * Stack verification steps:
 * * <step-1> Deploy the stack and wait for the API endpoint output to get printed
 * * <step-2> Hit the above endpoint using curl and expect a 200 response
 */

const app = new App();

const stack = new Stack(app, 'integ-alb-integration');

const vpc = new ec2.Vpc(stack, 'VPC');
const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', { port: 80 });
listener.addAction('dsf', { action: elbv2.ListenerAction.fixedResponse(200) });

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegration('DefaultIntegration', listener),
});

new CfnOutput(stack, 'Endpoint', {
  value: httpEndpoint.url!,
});
