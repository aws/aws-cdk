import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ServiceAddon } from './addon-interfaces';

export class XRayAddon extends ServiceAddon {
  constructor() {
    super('xray');
  }

  // @ts-ignore - Ignore unused params that are required for abstract class extend
  public prehook(service: Service, scope: cdk.Stack) {
    this.parentService = service;
  }

  public useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
    // Add the XRay Daemon to the task
    this.container = taskDefinition.addContainer('xray', {
      image: ecs.ContainerImage.fromRegistry('amazon/aws-xray-daemon'),
      essential: true,
      memoryReservationMiB: 256,
      environment: {
        AWS_REGION: cdk.Stack.of(this.parentService).region,
      },
      healthCheck: {
        command: [
          'CMD-SHELL',
          'curl -s http://localhost:2000',
        ],
        startPeriod: cdk.Duration.seconds(10),
        interval: cdk.Duration.seconds(5),
        timeout: cdk.Duration.seconds(2),
        retries: 3,
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'xray' }),
      user: '1337', // X-Ray traffic should not go through Envoy proxy
    });

    // Add permissions to this task to allow it to talk to X-Ray
    taskDefinition.taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
    );
  }

  public bakeContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appmeshAddon = this.parentService.getAddon('appmesh');
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}