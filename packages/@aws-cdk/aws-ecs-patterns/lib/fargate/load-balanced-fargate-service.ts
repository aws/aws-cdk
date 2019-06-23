import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { LoadBalancedServiceBase, LoadBalancedServiceBaseProps } from '../base/load-balanced-service-base';

/**
 * Properties for a LoadBalancedFargateService
 */
export interface LoadBalancedFargateServiceProps extends LoadBalancedServiceBaseProps {
  /**
   * The number of cpu units used by the task.
   * Valid values, which determines your range of valid values for the memory parameter:
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
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
   * 0.5GB, 1GB, 2GB - Available cpu values: 256 (.25 vCPU)
   *
   * 1GB, 2GB, 3GB, 4GB - Available cpu values: 512 (.5 vCPU)
   *
   * 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * Override for the Fargate Task Definition execution role
   *
   * @default - No value
   */
  readonly executionRole?: iam.IRole;

  /**
   * Override for the Fargate Task Definition task role
   *
   * @default - No value
   */
  readonly taskRole?: iam.IRole;

  /**
   * Override value for the container name
   *
   * @default - No value
   */
  readonly containerName?: string;

  /**
   * Override value for the service name
   *
   * @default CloudFormation-generated name
   */
  readonly serviceName?: string;
}

/**
 * A Fargate service running on an ECS cluster fronted by a load balancer
 */
export class LoadBalancedFargateService extends LoadBalancedServiceBase {

  /**
   * The Fargate service in this construct
   */
  public readonly service: ecs.FargateService;

  constructor(scope: cdk.Construct, id: string, props: LoadBalancedFargateServiceProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: props.memoryLimitMiB,
      cpu: props.cpu,
      executionRole: props.executionRole !== undefined ? props.executionRole : undefined,
      taskRole: props.taskRole !== undefined ? props.taskRole : undefined
    });

    const containerName = props.containerName !== undefined ? props.containerName : 'web';

    const container = taskDefinition.addContainer(containerName, {
      image: props.image,
      logging: this.logDriver,
      environment: props.environment
    });

    container.addPortMappings({
      containerPort: props.containerPort || 80,
    });
    const assignPublicIp = props.publicTasks !== undefined ? props.publicTasks : false;
    const service = new ecs.FargateService(this, "Service", {
      cluster: props.cluster,
      desiredCount: props.desiredCount || 1,
      taskDefinition,
      assignPublicIp,
      serviceName: props.serviceName,
    });
    this.service = service;

    this.addServiceAsTarget(service);
  }
}
