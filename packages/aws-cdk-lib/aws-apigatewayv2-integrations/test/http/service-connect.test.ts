import { Template } from '../../../assertions';
import { HttpApi, HttpRoute, HttpRouteKey, VpcLink } from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import { Stack } from '../../../core';
import { HttpServiceConnectIntegration } from './../../lib/http/service-connect';

describe('HttpServiceConnectIntegration', () => {
  function createService(stack: Stack) {
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
    taskDefinition.addContainer('Web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ name: 'api', containerPort: 80 }],
    });
    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
    });
    service.enableServiceConnect({
      services: [{ portMappingName: 'api' }],
      namespace: 'test.local',
    });
    return { vpc, service };
  }

  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const { vpc, service } = createService(stack);
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceConnectIntegration('Integration', service, { vpcLink }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      ConnectionType: 'VPC_LINK',
      IntegrationMethod: 'ANY',
      PayloadFormatVersion: '1.0',
    });
    const integrations = template.findResources('AWS::ApiGatewayV2::Integration');
    expect(Object.keys(integrations)).toHaveLength(1);
    expect(JSON.stringify(Object.values(integrations)[0])).toContain(
      'services.0.deployments.0.serviceConnectResources.0.discoveryArn');
    expect(Object.keys(template.findResources('Custom::ServiceConnectDiscoveryArn'))).toHaveLength(1);
  });

  test('fails if vpcLink is not specified', () => {
    const stack = new Stack();
    const { service } = createService(stack);
    const api = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceConnectIntegration('Integration', service),
      routeKey: HttpRouteKey.with('/pets'),
    })).toThrow(/vpcLink property is mandatory/);
  });

  test('fails if Service Connect is not enabled on the service', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
    taskDefinition.addContainer('Web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ name: 'api', containerPort: 80 }],
    });
    const service = new ecs.FargateService(stack, 'Service', { cluster, taskDefinition });
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const api = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceConnectIntegration('Integration', service, { vpcLink }),
      routeKey: HttpRouteKey.with('/pets'),
    })).toThrow(/Service Connect is not enabled on this service/);
  });
});
