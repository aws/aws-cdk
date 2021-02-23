import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';

describe('service extensions', () => {
  test('allows the user to add an extension', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const cluster = new ecs.Cluster(stack, 'Cluster');

    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
    const mainContainer = taskDefinition.addContainer('main', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
    });
    mainContainer.addPortMappings({ containerPort: 80 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    class MyStandardScaling implements ecs.IServiceExtension {
      extend(s: ecs.BaseService): void {
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

    // WHEN
    service.addExtension(myStandardScalingExtension);

    // THEN
    expect(extendSpy).toBeCalledWith(service);
    expectCDK(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget'));
  });
});