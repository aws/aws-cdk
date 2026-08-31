import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elb from '../../aws-elasticloadbalancing';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as cdk from '../../core';
import * as ecs from '../lib';

describe('service monitoring', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let fargateTaskDefinition: ecs.FargateTaskDefinition;
  let ec2TaskDefinition: ecs.Ec2TaskDefinition;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    fargateTaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ containerPort: 80 }],
    });

    ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
    ec2TaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
      portMappings: [{ containerPort: 80 }],
    });
  });

  describe('FargateService', () => {
    test('renders high-resolution metrics for CPU and memory', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: ['CPUUtilization', 'MemoryUtilization'],
            resolutionSeconds: 20,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization', 'MemoryUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('renders a separate resolution per metric', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [
            { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
            { metricNames: ['MemoryUtilization'], resolutionSeconds: 60 },
          ],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [
            { MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 },
            { MetricNames: ['MemoryUtilization'], ResolutionSeconds: 60 },
          ],
        },
      });
    });

    test('omits Monitoring when not specified', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: Match.absent(),
      });
    });

    test('renders alongside other service properties', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        desiredCount: 2,
        availabilityZoneRebalancing: ecs.AvailabilityZoneRebalancing.ENABLED,
        maxHealthyPercent: 200,
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        DesiredCount: 2,
        AvailabilityZoneRebalancing: 'ENABLED',
        Monitoring: {
          MetricConfigurations: [{ MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 }],
        },
      });
    });
  });

  describe('Ec2Service', () => {
    test('renders high-resolution metrics for CPU and memory', () => {
      // WHEN
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition: ec2TaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: ['CPUUtilization', 'MemoryUtilization'],
            resolutionSeconds: 20,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization', 'MemoryUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('renders a separate resolution per metric', () => {
      // WHEN
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition: ec2TaskDefinition,
        monitoring: {
          metricConfigurations: [
            { metricNames: ['MemoryUtilization'], resolutionSeconds: 20 },
            { metricNames: ['CPUUtilization'], resolutionSeconds: 60 },
          ],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [
            { MetricNames: ['MemoryUtilization'], ResolutionSeconds: 20 },
            { MetricNames: ['CPUUtilization'], ResolutionSeconds: 60 },
          ],
        },
      });
    });

    test('omits Monitoring when not specified', () => {
      // WHEN
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition: ec2TaskDefinition,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: Match.absent(),
      });
    });

    test('renders for a daemon service', () => {
      // WHEN
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition: ec2TaskDefinition,
        daemon: true,
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        SchedulingStrategy: 'DAEMON',
        Monitoring: {
          MetricConfigurations: [{ MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 }],
        },
      });
    });
  });

  describe('metric configurations', () => {
    test.each([
      ['CPUUtilization'],
      ['MemoryUtilization'],
    ])('renders a single %s configuration', (metricName) => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{ metricNames: [metricName], resolutionSeconds: 20 }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{ MetricNames: [metricName], ResolutionSeconds: 20 }],
        },
      });
    });

    test.each([20, 60])('renders a resolution of %d seconds', (resolutionSeconds) => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{ MetricNames: ['CPUUtilization'], ResolutionSeconds: resolutionSeconds }],
        },
      });
    });

    test('renders both metrics at high resolution as two configurations', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [
            { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
            { metricNames: ['MemoryUtilization'], resolutionSeconds: 20 },
          ],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [
            { MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 },
            { MetricNames: ['MemoryUtilization'], ResolutionSeconds: 20 },
          ],
        },
      });
    });

    test('preserves the order of metricNames', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: ['MemoryUtilization', 'CPUUtilization'],
            resolutionSeconds: 20,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['MemoryUtilization', 'CPUUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('renders both metrics at standard resolution', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: ['CPUUtilization', 'MemoryUtilization'],
            resolutionSeconds: 60,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization', 'MemoryUtilization'],
            ResolutionSeconds: 60,
          }],
        },
      });
    });
  });

  describe('validation', () => {
    const createFargateService = (monitoring: ecs.ServiceMonitoringConfiguration) => {
      return () => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring,
      });
    };

    test('fails when metricConfigurations is empty', () => {
      expect(createFargateService({ metricConfigurations: [] }))
        .toThrow(/monitoring must contain between 1 and 2 metricConfigurations, got 0/);
    });

    test('fails when there are more than two metricConfigurations', () => {
      expect(createFargateService({
        metricConfigurations: [
          { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
          { metricNames: ['MemoryUtilization'], resolutionSeconds: 20 },
          { metricNames: ['CPUUtilization'], resolutionSeconds: 60 },
        ],
      })).toThrow(/monitoring must contain between 1 and 2 metricConfigurations, got 3/);
    });

    test.each([0, -1, 10, 19, 21, 30, 59, 61, 120, 20.5])('fails for invalid resolutionSeconds %p', (resolutionSeconds) => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds }],
      })).toThrow(new RegExp(`monitoring resolutionSeconds must be one of \\[20,60\\], got ${resolutionSeconds}`));
    });

    test('fails when metricNames is empty', () => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: [], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must contain at least one metric name/);
    });

    test.each(['DiskUtilization', 'cpuutilization', 'CPUUtilization ', 'CPUReservation', ''])('fails for unsupported metric name %p', (metricName) => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: [metricName], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must only contain \["CPUUtilization","MemoryUtilization"\], got/);
    });

    test('fails for an unsupported metric name alongside a supported one', () => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: ['CPUUtilization', 'DiskUtilization'], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must only contain \["CPUUtilization","MemoryUtilization"\], got "DiskUtilization"/);
    });

    test('fails on the second configuration when only it is invalid', () => {
      expect(createFargateService({
        metricConfigurations: [
          { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
          { metricNames: ['MemoryUtilization'], resolutionSeconds: 45 },
        ],
      })).toThrow(/monitoring resolutionSeconds must be one of \[20,60\], got 45/);
    });

    test('fails when a metric name is repeated within one configuration', () => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: ['CPUUtilization', 'CPUUtilization'], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must not repeat a metric name across metricConfigurations, got "CPUUtilization" more than once/);
    });

    test('fails when a metric name is repeated across configurations', () => {
      expect(createFargateService({
        metricConfigurations: [
          { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
          { metricNames: ['CPUUtilization'], resolutionSeconds: 60 },
        ],
      })).toThrow(/monitoring metricNames must not repeat a metric name across metricConfigurations, got "CPUUtilization" more than once/);
    });

    test.each([
      ecs.DeploymentControllerType.CODE_DEPLOY,
      ecs.DeploymentControllerType.EXTERNAL,
    ])('fails for the %s deployment controller', (type) => {
      expect(() => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        deploymentController: { type },
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      })).toThrow(new RegExp(`monitoring requires the ECS deployment controller, got "${type}"`));
    });

    test.each([
      ecs.DeploymentControllerType.CODE_DEPLOY,
      ecs.DeploymentControllerType.EXTERNAL,
    ])('fails for an EC2 service using the %s deployment controller', (type) => {
      expect(() => new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition: ec2TaskDefinition,
        deploymentController: { type },
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      })).toThrow(new RegExp(`monitoring requires the ECS deployment controller, got "${type}"`));
    });

    test('fails for a non-ECS deployment controller even at standard resolution', () => {
      // The controller restriction applies to the monitoring configuration itself,
      // not only to the high-resolution case.
      expect(() => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        deploymentController: { type: ecs.DeploymentControllerType.CODE_DEPLOY },
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 60 }],
        },
      })).toThrow(/monitoring requires the ECS deployment controller/);
    });

    test('allows an explicit ECS deployment controller', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        deploymentController: { type: ecs.DeploymentControllerType.ECS },
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{ MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 }],
        },
      });
    });

    test('allows the implicit ECS deployment controller derived from circuitBreaker', () => {
      // circuitBreaker can derive an explicit ECS controller, which remains supported.
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        circuitBreaker: { rollback: true },
        monitoring: {
          metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{ MetricNames: ['CPUUtilization'], ResolutionSeconds: 20 }],
        },
      });
    });

    test('allows a non-ECS deployment controller when monitoring is not set', () => {
      expect(() => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        deploymentController: { type: ecs.DeploymentControllerType.CODE_DEPLOY },
      })).not.toThrow();
    });

    describe('Classic Load Balancer', () => {
      const attachToClassicLB = (service: ecs.BaseService) => {
        const lb = new elb.LoadBalancer(stack, `LB${service.node.id}`, { vpc });
        return () => lb.addTarget(service);
      };

      test('fails for a Fargate service using high-resolution metrics', () => {
        const service = new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition: fargateTaskDefinition,
          monitoring: {
            metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
          },
        });

        expect(attachToClassicLB(service))
          .toThrow(/high-resolution monitoring disallows using the service as a target of a Classic Load Balancer/);
      });

      test('fails for an EC2 service using high-resolution metrics', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
          },
        });

        expect(attachToClassicLB(service))
          .toThrow(/high-resolution monitoring disallows using the service as a target of a Classic Load Balancer/);
      });

      test('fails when only the second configuration is high resolution', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [
              { metricNames: ['CPUUtilization'], resolutionSeconds: 60 },
              { metricNames: ['MemoryUtilization'], resolutionSeconds: 20 },
            ],
          },
        });

        expect(attachToClassicLB(service))
          .toThrow(/high-resolution monitoring disallows using the service as a target of a Classic Load Balancer/);
      });

      test('fails when attached directly via attachToClassicLB', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
          },
        });
        const lb = new elb.LoadBalancer(stack, 'LB', { vpc });

        expect(() => service.attachToClassicLB(lb))
          .toThrow(/high-resolution monitoring disallows using the service as a target of a Classic Load Balancer/);
      });

      test('allows a service that explicitly opts into standard resolution', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 60 }],
          },
        });

        expect(attachToClassicLB(service)).not.toThrow();
      });

      test('allows a service without monitoring', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
        });

        expect(attachToClassicLB(service)).not.toThrow();
      });

      test('allows a service with a tokenized resolution', () => {
        // An un-inspectable resolution is treated as standard rather than blocking
        // a configuration that may well be valid.
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [{
              metricNames: ['CPUUtilization'],
              resolutionSeconds: cdk.Lazy.number({ produce: () => 20 }),
            }],
          },
        });

        expect(attachToClassicLB(service)).not.toThrow();
      });

      test('allows a service with a tokenized metricConfigurations list', () => {
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: cdk.Token.asAny([]) as any,
          },
        });

        expect(attachToClassicLB(service)).not.toThrow();
      });
    });

    describe('Application and Network Load Balancers', () => {
      test('allows a Fargate service using high-resolution metrics behind an ALB', () => {
        // GIVEN
        const service = new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition: fargateTaskDefinition,
          monitoring: {
            metricConfigurations: [{
              metricNames: ['CPUUtilization', 'MemoryUtilization'],
              resolutionSeconds: 20,
            }],
          },
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        expect(() => listener.addTargets('target', { port: 80, targets: [service] })).not.toThrow();
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
          Monitoring: {
            MetricConfigurations: [{
              MetricNames: ['CPUUtilization', 'MemoryUtilization'],
              ResolutionSeconds: 20,
            }],
          },
        });
      });

      test('allows an EC2 service using high-resolution metrics behind an NLB', () => {
        // GIVEN
        const service = new ecs.Ec2Service(stack, 'Ec2Service', {
          cluster,
          taskDefinition: ec2TaskDefinition,
          monitoring: {
            metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds: 20 }],
          },
        });

        // WHEN
        const lb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        expect(() => listener.addTargets('target', { port: 80, targets: [service] })).not.toThrow();
      });
    });

    test('skips validation for a tokenized metricConfigurations list', () => {
      // A tokenized list always reports a length of 1, so the per-configuration
      // checks are skipped rather than run against a placeholder.
      expect(() => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: cdk.Token.asAny([]) as any,
        },
      })).not.toThrow();
    });

    test('skips per-name validation for a tokenized metricNames list', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: cdk.Lazy.list({ produce: () => ['CPUUtilization'] }),
            resolutionSeconds: 20,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('skips per-name validation for a tokenized metric name', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: [cdk.Lazy.string({ produce: () => 'CPUUtilization' })],
            resolutionSeconds: 20,
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('skips validation for a tokenized resolutionSeconds', () => {
      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        monitoring: {
          metricConfigurations: [{
            metricNames: ['CPUUtilization'],
            resolutionSeconds: cdk.Lazy.number({ produce: () => 20 }),
          }],
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Monitoring: {
          MetricConfigurations: [{
            MetricNames: ['CPUUtilization'],
            ResolutionSeconds: 20,
          }],
        },
      });
    });

    test('still validates a concrete resolutionSeconds alongside a tokenized metric name', () => {
      expect(createFargateService({
        metricConfigurations: [{
          metricNames: [cdk.Lazy.string({ produce: () => 'CPUUtilization' })],
          resolutionSeconds: 45,
        }],
      })).toThrow(/monitoring resolutionSeconds must be one of \[20,60\], got 45/);
    });
  });
});
