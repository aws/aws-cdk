import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Container, Environment, Service, ServiceBuild, ServiceDescription, ServiceExtension } from '../lib';

class MyCustomAutoscaling extends ServiceExtension {
  constructor() {
    super('my-custom-autoscaling');
  }

  // This service modifies properties of the service prior
  // to construct creation.
  public modifyServiceProps(props: ServiceBuild) {
    return {
      ...props,

      // Initially launch 10 copies of the service
      desiredCount: 10,
    } as ServiceBuild;
  }

  // This hook utilizes the resulting service construct
  // once it is created
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    const scalingTarget = service.autoScaleTaskCount({
      minCapacity: 5, // Min 5 tasks
      maxCapacity: 20, // Max 20 tasks
    });

    scalingTarget.scaleOnCpuUtilization('TargetCpuUtilization50', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const environment = new Environment(stack, 'production');

/** Name service */
const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
nameDescription.add(new MyCustomAutoscaling());

new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});

/**
 * Expectation is that the user is able to implement their own extension
 * using the abstract class, and that it will function. This will help
 * catch breaking changes to extensions. (Might need to make this example
 * custom extension more complex eventually)
 */