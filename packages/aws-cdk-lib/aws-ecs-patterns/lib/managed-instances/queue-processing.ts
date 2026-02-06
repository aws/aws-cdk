import { Construct } from 'constructs';
import * as ec2 from '../../../aws-ec2';
import {
  HealthCheck,
  ManagedInstancesCapacityProvider,
  ManagedInstancesService,
  ManagedInstancesTaskDefinition,
} from '../../../aws-ecs';
import { Duration, FeatureFlags, ValidationError } from '../../../core';
import * as cxapi from '../../../cx-api';
import { ManagedInstancesServiceBaseProps } from '../base/managed-instances-service-base';
import { QueueProcessingServiceBase, QueueProcessingServiceBaseProps } from '../base/queue-processing-service-base';

/**
 * The properties for the QueueProcessingManagedInstancesService service.
 */
export interface QueueProcessingManagedInstancesServiceProps
  extends QueueProcessingServiceBaseProps,
  ManagedInstancesServiceBaseProps {
  /**
   * Optional name for the container added.
   * This name is not used when `taskDefinition` is provided.
   *
   * @default - QueueProcessingContainer
   */
  readonly containerName?: string;

  /**
   * The health check command and associated configuration parameters for the container.
   *
   * @default - Health check configuration from container.
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The subnets to associate with the service.
   *
   * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
   */
  readonly taskSubnets?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
   *
   * @default - A new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   *
   * If true, each task will receive a public IP address.
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy
   * Elastic Load Balancing target health checks after a task has first started.
   *
   * @default - defaults to 60 seconds if at least one load balancer is in-use and it is not already set
   */
  readonly healthCheckGracePeriod?: Duration;

  /**
   * If provided and `capacityProviderStrategies` is omitted, we’ll default to using this provider.
   * (You still need to have added it to the cluster elsewhere or do so yourself before service creation.)
   *
   * @default - none
   */
  readonly managedInstancesCapacityProvider?: ManagedInstancesCapacityProvider;
}

/**
 * Class to create a queue processing Managed Instances service.
 */
export class QueueProcessingManagedInstancesService extends QueueProcessingServiceBase {
  /**
   * The service in this construct.
   */
  public readonly service: ManagedInstancesService;
  /**
   * The task definition in this construct.
   */
  public readonly taskDefinition: ManagedInstancesTaskDefinition;

  constructor(scope: Construct, id: string, props: QueueProcessingManagedInstancesServiceProps = {}) {
    super(scope, id, props);

    if (props.taskDefinition && props.image) {
      throw new ValidationError('You must specify only one of taskDefinition or image', this);
    } else if (props.taskDefinition) {
      if (!props.taskDefinition.isManagedInstancesCompatible) {
        throw new ValidationError('Supplied TaskDefinition is not configured for compatibility with Managed Instances', this);
      }
      this.taskDefinition = props.taskDefinition;
    } else if (props.image) {
      if (props.ephemeralStorageGiB !== undefined) {
        throw new ValidationError('Ephemeral storage is not supported for Managed Instances tasks', this);
      }

      // Create a Task Definition for the container to start
      const cpu = props.cpu ?? 256;
      const memoryMiB = props.memoryMib ?? props.memoryLimitMiB ?? 512;
      this.taskDefinition = new ManagedInstancesTaskDefinition(this, 'QueueProcessingTaskDef', {
        cpu: cpu,
        memoryLimitMiB: memoryMiB,
        family: props.family,
        runtimePlatform: props.runtimePlatform,
      });

      const containerName = props.containerName ?? 'QueueProcessingContainer';
      this.taskDefinition.addContainer(containerName, {
        image: props.image,
        command: props.command,
        environment: this.environment,
        secrets: this.secrets,
        logging: this.logDriver,
        healthCheck: props.healthCheck,
        readonlyRootFilesystem: props.readonlyRootFilesystem,
      });
    } else {
      throw new ValidationError('You must specify one of: taskDefinition or image', this);
    }

    const capacityProviderStrategies = props.capacityProviderStrategies ?? (props.managedInstancesCapacityProvider ? [{
      capacityProvider: props.managedInstancesCapacityProvider.capacityProviderName,
      weight: 1,
    }] : undefined);

    // The desiredCount should be removed from the managed instances service when the feature flag is removed.
    const desiredCount = FeatureFlags.of(this).isEnabled(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT) ? undefined : this.desiredCount;

    this.service = new ManagedInstancesService(this, 'QueueProcessingManagedInstancesService', {
      cluster: this.cluster,
      desiredCount: desiredCount,
      taskDefinition: this.taskDefinition,
      serviceName: props.serviceName,
      minHealthyPercent: props.minHealthyPercent,
      maxHealthyPercent: props.maxHealthyPercent,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
      deploymentController: props.deploymentController,
      securityGroups: props.securityGroups,
      vpcSubnets: props.taskSubnets,
      assignPublicIp: props.assignPublicIp,
      circuitBreaker: props.circuitBreaker,
      capacityProviderStrategies: capacityProviderStrategies,
      enableExecuteCommand: props.enableExecuteCommand,
      healthCheckGracePeriod: props.healthCheckGracePeriod,
    });

    this.configureAutoscalingForService(this.service);
    this.grantPermissionsToService(this.service);
  }
}
