import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { Duration, Stack, App, Validations } from '../../core';
import * as ecs from '../lib';
import { ClusterSettings, ServiceGatewayConnector } from '../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('ECS Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('ClusterSettings', () => {
    test('applies setting to ECS cluster', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(cluster)).toBe(true);
      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enabled' },
      ]);
    });

    test('updates existing setting with same name', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'containerInsights', value: 'disabled' },
        ],
      });
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('adds setting when different name exists', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'otherSetting', value: 'someValue' },
        ],
      });
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'otherSetting', value: 'someValue' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('wraps non-array clusterSettings and preserves existing value', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      (cluster as any).clusterSettings = { Ref: 'ExistingSettings' };
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { Ref: 'ExistingSettings' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('does not support non-ECS cluster constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('ServiceGatewayConnector', () => {
    const PUBLIC_ACCESS_WARNING = Match.stringLikeRegexp('internet-facing gateways.*gatewayConnectorPublicAccess');

    test('supports CfnService and no other construct', () => {
      const service = new ecs.CfnService(stack, 'Service');
      const mixin = new ServiceGatewayConnector({ portName: 'web' });

      expect(mixin.supports(service)).toBe(true);
      expect(mixin.supports(new ecs.CfnCluster(stack, 'Cluster'))).toBe(false);
      expect(mixin.supports(new TestConstruct(stack, 'test'))).toBe(false);
    });

    test('renders the connector on a CfnService', () => {
      Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'DeregistrationDelay is a newly launched property not yet in the bundled schema' });
      new ecs.CfnService(stack, 'Service').with(new ServiceGatewayConnector({
        portName: 'web',
        accessTypes: [ecs.GatewayAccessType.PRIVATE],
        deregistrationDelay: Duration.seconds(30),
        healthCheck: {
          path: '/health',
          interval: Duration.seconds(10),
          timeout: Duration.seconds(5),
          healthyHttpCodes: '200-299',
        },
      }));

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        GatewayConnectors: [{
          PortName: 'web',
          Filters: { AccessTypes: ['PRIVATE'] },
          DeregistrationDelay: { TimeoutSeconds: 30 },
          HealthCheck: {
            HealthCheckPath: '/health',
            HealthCheckIntervalSeconds: 10,
            HealthCheckTimeoutSeconds: 5,
            Matcher: { HttpCode: '200-299' },
          },
        }],
      });
      Annotations.fromStack(stack).hasNoWarning('*', PUBLIC_ACCESS_WARNING);
    });

    test('replaces existing gateway connectors', () => {
      new ecs.CfnService(stack, 'Service', { gatewayConnectors: [{ portName: 'old' }] })
        .with(new ServiceGatewayConnector({ portName: 'web', accessTypes: [ecs.GatewayAccessType.PRIVATE] }));

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        GatewayConnectors: [{ PortName: 'web', Filters: { AccessTypes: ['PRIVATE'] } }],
      });
    });

    test('warns on the CfnService about public access when accessTypes is omitted', () => {
      new ecs.CfnService(stack, 'Service').with(new ServiceGatewayConnector({ portName: 'web' }));

      Annotations.fromStack(stack).hasWarning('/TestStack/Service', PUBLIC_ACCESS_WARNING);
    });

    test.each<[string, ecs.GatewayConnectorOptions, string]>([
      ['empty accessTypes', { portName: 'web', accessTypes: [] }, 'gatewayConnector accessTypes must be a non-empty list without duplicates, got []'],
      ['health check port', { portName: 'web', healthCheck: { port: 0 } }, 'gatewayConnector health check port must be between 1 and 65535, got 0'],
      ['health check interval', { portName: 'web', healthCheck: { interval: Duration.seconds(1) } }, 'gatewayConnector health check interval must be a whole number of seconds between 5 and 300, got 1 seconds'],
      ['deregistrationDelay', { portName: 'web', deregistrationDelay: Duration.hours(2) }, 'gatewayConnector deregistrationDelay must be a whole number of seconds between 0 and 3600, got 7200 seconds'],
    ])('fails on creation for invalid %s', (_name, options, message) => {
      expect(() => new ServiceGatewayConnector(options)).toThrow(message);
    });

    test('applies to an existing FargateService and warns on the L2', () => {
      const cluster = new ecs.Cluster(stack, 'Cluster', { vpc: new ec2.Vpc(stack, 'Vpc') });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('nginx'),
        portMappings: [{ containerPort: 80, name: 'web' }],
      });
      const service = new ecs.FargateService(stack, 'FargateService', { cluster, taskDefinition });

      service.with(new ServiceGatewayConnector({ portName: 'web' }));

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        GatewayConnectors: [{ PortName: 'web' }],
      });
      Annotations.fromStack(stack).hasWarning('/TestStack/FargateService', PUBLIC_ACCESS_WARNING);
    });
  });
});
