import { FargateService, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { NetworkTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct } from '@aws-cdk/core';
import { NetworkMultipleTargetGroupsServiceBase,
  NetworkMultipleTargetGroupsServiceBaseProps } from '../base/network-multiple-target-groups-service-base';

/**
 * The properties for the NetworkMultipleTargetGroupsFargateService service.
 */
export interface NetworkMultipleTargetGroupsFargateServiceProps extends NetworkMultipleTargetGroupsServiceBaseProps {

  /**
   * The task definition to use for tasks in the service. Only one of TaskDefinition or TaskImageOptions must be specified.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - none
   */
  readonly taskDefinition?: FargateTaskDefinition;

  /**
   * The number of cpu units used by the task.
   *
   * Valid values, which determines your range of valid values for the memory parameter:
   *
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   *
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   *
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   *
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   *
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * This field is required and you must use one of the following values, which determines your range of valid values
   * for the cpu parameter:
   *
   * 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB) - Available cpu values: 256 (.25 vCPU)
   *
   * 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB) - Available cpu values: 512 (.5 vCPU)
   *
   * 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB) - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB) - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB) - Available cpu values: 4096 (4 vCPU)
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * Determines whether the service will be assigned a public IP address.
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;
}

/**
 * A Fargate service running on an ECS cluster fronted by a network load balancer.
 */
export class NetworkMultipleTargetGroupsFargateService extends NetworkMultipleTargetGroupsServiceBase {

  /**
   * Determines whether the service will be assigned a public IP address.
   */
  public readonly assignPublicIp: boolean;

  /**
   * The Fargate service in this construct.
   */
  public readonly service: FargateService;

  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * The default target group for the service.
   */
  public readonly targetGroup: NetworkTargetGroup;

  /**
   * Constructs a new instance of the NetworkMultipleTargetGroupsFargateService class.
   */
  constructor(scope: Construct, id: string, props: NetworkMultipleTargetGroupsFargateServiceProps = {}) {
    super(scope, id, props);

    this.assignPublicIp = props.assignPublicIp !== undefined ? props.assignPublicIp : false;

    if (props.taskDefinition && props.taskImageOptions) {
      throw new Error('You must specify only one of TaskDefinition or TaskImageOptions.');
    } else if (props.taskDefinition) {
      this.taskDefinition = props.taskDefinition;
    } else if (props.taskImageOptions) {
      const taskImageOptions = props.taskImageOptions;
      this.taskDefinition = new FargateTaskDefinition(this, 'TaskDef', {
        memoryLimitMiB: props.memoryLimitMiB,
        cpu: props.cpu,
        executionRole: taskImageOptions.executionRole,
        taskRole: taskImageOptions.taskRole,
        family: taskImageOptions.family,
      });

      const containerName = taskImageOptions.containerName !== undefined ? taskImageOptions.containerName : 'web';
      const container = this.taskDefinition.addContainer(containerName, {
        image: taskImageOptions.image,
        logging: this.logDriver,
        environment: taskImageOptions.environment,
        secrets: taskImageOptions.secrets,
      });
      if (taskImageOptions.containerPorts) {
        for (const containerPort of taskImageOptions.containerPorts) {
          container.addPortMappings({
            containerPort
          });
        }
      }
    } else {
      throw new Error('You must specify one of: taskDefinition or image');
    }
    if (!this.taskDefinition.defaultContainer) {
      throw new Error('At least one essential container must be specified');
    }
    if (this.taskDefinition.defaultContainer.portMappings.length === 0) {
      this.taskDefinition.defaultContainer.addPortMappings({
        containerPort: 80
      });
    }

    this.service = this.createFargateService(props);
    if (props.targetGroups) {
      this.addPortMappingForTargets(this.taskDefinition.defaultContainer, props.targetGroups);
      this.targetGroup = this.registerECSTargets(this.service, this.taskDefinition.defaultContainer, props.targetGroups);
    } else {
      this.targetGroup = this.listener.addTargets('ECS', {
        targets: [this.service],
        port: this.taskDefinition.defaultContainer.portMappings[0].containerPort
      });
    }
  }

  private createFargateService(props: NetworkMultipleTargetGroupsFargateServiceProps): FargateService {
    return new FargateService(this, 'Service', {
      cluster: this.cluster,
      desiredCount: this.desiredCount,
      taskDefinition: this.taskDefinition,
      assignPublicIp: this.assignPublicIp,
      serviceName: props.serviceName,
      healthCheckGracePeriod: props.healthCheckGracePeriod,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
      cloudMapOptions: props.cloudMapOptions,
    });
  }
}