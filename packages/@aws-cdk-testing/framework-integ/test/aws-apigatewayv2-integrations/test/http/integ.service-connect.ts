import { HttpApi, VpcLink } from 'aws-cdk-lib/aws-apigatewayv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpServiceConnectIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new App();

const stack = new Stack(app, 'integ-service-connect-integration');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  defaultCloudMapNamespace: {
    name: 'example.com',
    useForServiceConnect: true,
  },
});
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('Web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ name: 'api', containerPort: 80 }],
});
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  serviceConnectConfiguration: {
    services: [{ portMappingName: 'api' }],
  },
});

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpServiceConnectIntegration('DefaultIntegration', service, {
    vpcLink,
  }),
});

new CfnOutput(stack, 'Endpoint', {
  value: httpEndpoint.url!,
});
