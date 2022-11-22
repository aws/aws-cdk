import { Template, Match } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { App, Stack } from '@aws-cdk/core';
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