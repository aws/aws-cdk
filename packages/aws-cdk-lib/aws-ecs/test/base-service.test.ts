import { Template, Match } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { App, Stack } from '../../core';
import * as ecs from '../lib';

describe('When import an ECS Service', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('with serviceArnWithCluster', () => {
    // GIVEN
    const clusterName = 'cluster-name';
    const serviceName = 'my-http-service';
    const region = 'service-region';
    const account = 'service-account';
    const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;

    // WHEN
    const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);

    // THEN
    expect(service.serviceArn).toEqual(serviceArn);
    expect(service.serviceName).toEqual(serviceName);
    expect(service.env.account).toEqual(account);
    expect(service.env.region).toEqual(region);

    expect(service.cluster.clusterName).toEqual(clusterName);
    expect(service.cluster.env.account).toEqual(account);
    expect(service.cluster.env.region).toEqual(region);
  });

  test('throws an expection if no resourceName provided on fromServiceArnWithCluster', () => {
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service');
    }).toThrowError(/Missing resource Name from service ARN/);
  });

  test('throws an expection if not using cluster arn format on fromServiceArnWithCluster', () => {
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service/my-http-service');
    }).toThrowError(/is not using the ARN cluster format/);
  });

  test('should add a dependency on task role', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: ['test:SpecialName'],
      resources: ['*'],
    }));

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECS::Service', {
      DependsOn: [
        'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        'FargateTaskDefTaskRole0B257552',
      ],
    });
  });
});

describe('For alarm-based rollbacks', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('deploymentAlarms is set by default for ECS deployment controller', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS,
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        Alarms: {
          AlarmNames: [],
          Enable: false,
          Rollback: false,
        },
      },
    });
  });

  test('deploymentAlarms is set by default when deployment controller is not specified', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        Alarms: {
          AlarmNames: [],
          Enable: false,
          Rollback: false,
        },
      },
    });
  });

  test('should omit deploymentAlarms for CodeDeploy deployment controller', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.CODE_DEPLOY,
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        Alarms: Match.absent(),
      },
    });
  });

  test('should omit deploymentAlarms for External deployment controller', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.EXTERNAL,
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        Alarms: Match.absent(),
      },
    });
  });
});

describe('When specifying a task definition revision', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('specifies the revision if set to something other than latest', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS,
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
      taskDefinitionRevision: ecs.TaskDefinitionRevision.of(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      TaskDefinition: 'FargateTaskDef:1',
    });
  });

  test('omits the revision if set to latest', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });

    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS,
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
      taskDefinitionRevision: ecs.TaskDefinitionRevision.LATEST,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      TaskDefinition: 'FargateTaskDef',
    });
  });
});

test.each([
  /* breaker, flag => controller in template */
  /* Flag off => value present if circuitbreaker */
  [false, false, false],
  [true, false, true],
  /* Flag on => value never present */
  [false, true, false],
  [true, true, false],
])('circuitbreaker is %p /\\ flag is %p => DeploymentController in output: %p', (circuitBreaker, flagValue, controllerInTemplate) => {
  // GIVEN
  const app = new App({
    context: {
      '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker': flagValue,
    },
  });
  const stack = new Stack(app, 'Stack');
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
  taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  });

  // WHEN
  new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
    circuitBreaker: circuitBreaker ? { } : undefined,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ECS::Service', {
    DeploymentController: controllerInTemplate ? { Type: 'ECS' } : Match.absent(),
  });
});