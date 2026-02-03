import { HttpApi, VpcLink } from 'aws-cdk-lib/aws-apigatewayv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpServiceDiscoveryIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new App();

const stack = new Stack(app, 'integ-service-discovery-integration');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
  name: 'foobar.com',
  vpc,
});
const service = namespace.createService('Service');

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpServiceDiscoveryIntegration('DefaultIntegration', service, {
    vpcLink,
  }),
});

new CfnOutput(stack, 'Endpoint', {
  value: httpEndpoint.url!,
});
