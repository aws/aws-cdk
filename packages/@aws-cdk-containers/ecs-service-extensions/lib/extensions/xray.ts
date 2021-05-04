import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ServiceExtension } from './extension-interfaces';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

const XRAY_DAEMON_IMAGE = 'amazon/aws-xray-daemon:latest';

/**
 * This extension adds an X-Ray daemon inside the task definition, for
 * capturing application trace spans and submitting them to the AWS
 * X-Ray service.
 */
export class XRayExtension extends ServiceExtension {
  constructor() {
    super('xray');
  }

  // @ts-ignore - Ignore unused params that are required for abstract class extend
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
  }

  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    // Add the XRay Daemon to the task
    this.container = taskDefinition.addContainer('xray', {
      image: ecs.ContainerImage.fromRegistry(XRAY_DAEMON_IMAGE),
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

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}