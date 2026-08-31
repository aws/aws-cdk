import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
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
    });

    ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
    ec2TaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
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

    test.each([0, 10, 30, 59, 61])('fails for invalid resolutionSeconds %d', (resolutionSeconds) => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: ['CPUUtilization'], resolutionSeconds }],
      })).toThrow(new RegExp(`monitoring resolutionSeconds must be one of \\[20,60\\], got ${resolutionSeconds}`));
    });

    test('fails when metricNames is empty', () => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: [], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must contain at least one metric name/);
    });

    test('fails for an unsupported metric name', () => {
      expect(createFargateService({
        metricConfigurations: [{ metricNames: ['DiskUtilization'], resolutionSeconds: 20 }],
      })).toThrow(/monitoring metricNames must only contain \["CPUUtilization","MemoryUtilization"\], got "DiskUtilization"/);
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

    test('allows a non-ECS deployment controller when monitoring is not set', () => {
      expect(() => new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition: fargateTaskDefinition,
        deploymentController: { type: ecs.DeploymentControllerType.CODE_DEPLOY },
      })).not.toThrow();
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
            metricNames: cdk.Token.asList(['CPUUtilization']),
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
            resolutionSeconds: cdk.Token.asNumber(20),
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
  });
});
