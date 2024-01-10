import { Construct } from 'constructs';
import * as ec2 from '../../../aws-ec2';
import { FargateService, FargateTaskDefinition, HealthCheck } from '../../../aws-ecs';
import { FeatureFlags } from '../../../core';
import * as cxapi from '../../../cx-api';
import { FargateServiceBaseProps } from '../base/fargate-service-base';
import { QueueProcessingServiceBase, QueueProcessingServiceBaseProps } from '../base/queue-processing-service-base';

/**
 * The properties for the QueueProcessingFargateService service.
 */
export interface QueueProcessingFargateServiceProps extends QueueProcessingServiceBaseProps, FargateServiceBaseProps {
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
}

/**
 * Class to create a queue processing Fargate service
 */
export class QueueProcessingFargateService extends QueueProcessingServiceBase {
  /**
   * The Fargate service in this construct.
   */
  public readonly service: FargateService;
  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * Constructs a new instance of the QueueProcessingFargateService class.
   */
  constructor(scope: Construct, id: string, props: QueueProcessingFargateServiceProps = {}) {
    super(scope, id, props);

    if (props.taskDefinition && props.image) {
      throw new Error('You must specify only one of taskDefinition or image');
    } else if (props.taskDefinition) {
      this.taskDefinition = props.taskDefinition;
    } else if (props.image) {
      // Create a Task Definition for the container to start
      this.taskDefinition = new FargateTaskDefinition(this, 'QueueProcessingTaskDef', {
        memoryLimitMiB: props.memoryLimitMiB || 512,
        cpu: props.cpu || 256,
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
      });
    } else {
      throw new Error('You must specify one of: taskDefinition or image');
    }

    // The desiredCount should be removed from the fargate service when the feature flag is removed.
    const desiredCount = FeatureFlags.of(this).isEnabled(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT) ? undefined : this.desiredCount;

    // Create a Fargate service with the previously defined Task Definition and configure
    // autoscaling based on cpu utilization and number of messages visible in the SQS queue.
    this.service = new FargateService(this, 'QueueProcessingFargateService', {
      cluster: this.cluster,
      desiredCount: desiredCount,
      taskDefinition: this.taskDefinition,
      serviceName: props.serviceName,
      minHealthyPercent: props.minHealthyPercent,
      maxHealthyPercent: props.maxHealthyPercent,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
      platformVersion: props.platformVersion,
      deploymentController: props.deploymentController,
      securityGroups: props.securityGroups,
      vpcSubnets: props.taskSubnets,
      assignPublicIp: props.assignPublicIp,
      circuitBreaker: props.circuitBreaker,
      capacityProviderStrategies: props.capacityProviderStrategies,
      enableExecuteCommand: props.enableExecuteCommand,
    });

    this.configureAutoscalingForService(this.service);
    this.grantPermissionsToService(this.service);
  }
}
