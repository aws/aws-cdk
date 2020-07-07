import { ServiceAddon, MutateContainerDefinition } from './addon-interfaces';
import ecs = require('@aws-cdk/aws-ecs');
import { Service } from '../service';
import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');

export class XRayAddon extends ServiceAddon {
  public container!: ecs.ContainerDefinition;

  // List of registered hooks from other addons that want to
  // mutate the application's container definition prior to
  // container creation
  public mutateContainerProps: MutateContainerDefinition[] = [];

  constructor() {
    super('xray');
  }

  prehook(service: Service) {
    this.parentService = service;
  }

  useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
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

  bakeContainerDependencies() {
    const appmeshAddon = this.parentService.addons.get('appmesh')
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      })
    }
  }
};