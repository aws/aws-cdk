import { Match, Template, Annotations } from '../../../assertions';
import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import * as cdk from '../../../core';
import * as ecsPatterns from '../../lib';

describe('NetworkMultipleTargetGroupsFargateService', () => {
  test('minHealthyPercent and maxHealthyPercent are passed to the CFN resource template', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      minHealthyPercent: 120,
      maxHealthyPercent: 240,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MinimumHealthyPercent: 120,
        MaximumPercent: 240,
      },
    });
  });

  test('setting minHealthyPercent prevents the minHealthyPercent warning from being displayed', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      minHealthyPercent: 100,
    });

    // THEN - no warning about minHealthyPercent
    Annotations.fromStack(stack).hasNoWarning('*', Match.anyValue());
  });

  test('not setting minHealthyPercent shows the minHealthyPercent warning', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    });

    // THEN: shows warning about minHealthyPercent
    Annotations.fromStack(stack).hasWarning('*', 'minHealthyPercent has not been configured so the default value of 50% is used. The number of running tasks will decrease below the desired count during deployments etc. See https://github.com/aws/aws-cdk/issues/31705 [ack: @aws-cdk/aws-ecs:minHealthyPercent]');
  });
});
