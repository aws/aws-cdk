import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';

describe('service extensions', () => {
  test('allows the user to create an extension that works for both ec2 and fargate services', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const cluster = new ecs.Cluster(stack, 'Cluster');

    // A very compatible task definition
    const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDefinition', {
      compatibility: ecs.Compatibility.EC2_AND_FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });
    const mainContainer = taskDefinition.addContainer('main', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
      memoryLimitMiB: 512,
    });
    mainContainer.addPortMappings({ containerPort: 80 });

    // A very compatible service extension
    class MyStandardScaling implements ecs.IFargateServiceExtension, ecs.IEc2ServiceExtension {
      extend(s: ecs.FargateService | ecs.Ec2Service): void {
        s.autoScaleTaskCount({
          maxCapacity: 100,
          minCapacity: 2,
        }).scaleOnCpuUtilization('Target40', {
          targetUtilizationPercent: 40,
        });
      }
    }

    const myStandardScalingExtension = new MyStandardScaling();
    const extendSpy = jest.spyOn(myStandardScalingExtension, 'extend');

    const fargateService = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const ec2Service = new ecs.FargateService(stack, 'Ec2Service', {
      cluster,
      taskDefinition,
    });

    // WHEN
    fargateService.addExtension(myStandardScalingExtension);
    ec2Service.addExtension(myStandardScalingExtension);

    // THEN
    expect(extendSpy).toBeCalledWith(fargateService);
    expect(extendSpy).toBeCalledWith(ec2Service);

    expectCDK(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ResourceId: {
        'Fn::Join': [
          '',
          [
            'service/',
            { Ref: 'ClusterEB0386A7' },
            '/',
            { 'Fn::GetAtt': ['FargateServiceAC2B3B85', 'Name'] },
          ],
        ],
      },
    }));

    expectCDK(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ResourceId: {
        'Fn::Join': [
          '',
          [
            'service/',
            { Ref: 'ClusterEB0386A7' },
            '/',
            { 'Fn::GetAtt': ['Ec2Service04A33183', 'Name'] },
          ],
        ],
      },
    }));
  });
});