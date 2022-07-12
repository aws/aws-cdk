import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Container, Environment, ScaleOnCpuUtilization, Service, ServiceDescription } from '../lib';

describe('scale on cpu utilization', () => {
  test('scale on cpu utilization extension with no parameters should create a default autoscaling setup', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    serviceDescription.add(new ScaleOnCpuUtilization());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 200,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 8,
      MinCapacity: 2,
      ResourceId: {
        'Fn::Join': [
          '',
          [
            'service/',
            {
              Ref: 'productionenvironmentclusterC6599D2D',
            },
            '/',
            {
              'Fn::GetAtt': [
                'myserviceserviceServiceE9A5732D',
                'Name',
              ],
            },
          ],
        ],
      },
      RoleARN: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::',
            {
              Ref: 'AWS::AccountId',
            },
            ':role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService',
          ],
        ],
      },
      ScalableDimension: 'ecs:service:DesiredCount',
      ServiceNamespace: 'ecs',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyName: 'myserviceserviceTaskCountTargetmyservicetargetcpuutilization50E6628660',
      PolicyType: 'TargetTrackingScaling',
      ScalingTargetId: {
        Ref: 'myserviceserviceTaskCountTarget4268918D',
      },
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'ECSServiceAverageCPUUtilization',
        },
        ScaleInCooldown: 60,
        ScaleOutCooldown: 60,
        TargetValue: 50,
      },
    });
  });

  test('should be able to set a custom scaling policy as well', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    serviceDescription.add(new ScaleOnCpuUtilization({
      initialTaskCount: 25,
      minTaskCount: 15,
      maxTaskCount: 30,
      targetCpuUtilization: 75,
      scaleInCooldown: cdk.Duration.minutes(3),
      scaleOutCooldown: cdk.Duration.minutes(3),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 200,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 25,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 30,
      MinCapacity: 15,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        ScaleInCooldown: 180,
        ScaleOutCooldown: 180,
        TargetValue: 75,
      },
    });
  });

  test('should error if configuring autoscaling target both in the extension and the Service', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    serviceDescription.add(new ScaleOnCpuUtilization());
    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
        autoScaleTaskCount: {
          maxTaskCount: 5,
        },
      });
    }).toThrow('Cannot specify \'autoScaleTaskCount\' in the Service construct and also provide a  \'ScaleOnCpuUtilization\' extension. \'ScaleOnCpuUtilization\' is deprecated. Please only provide \'autoScaleTaskCount\'.');
  });
});