import { AliasRecord, IHostedZone } from '@aws-cdk/aws-route53';
import cdk = require('@aws-cdk/cdk');
import { FargateService } from './fargate/fargate-service';
import { FargateTaskDefinition } from './fargate/fargate-task-definition';
import { LoadBalancedServiceBase, LoadBalancedServiceBaseProps } from './load-balanced-service-base';
import { AwsLogDriver } from './log-drivers/aws-log-driver';

/**
 * Properties for a LoadBalancedEcsService
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
  readonly cpu?: string;

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
  readonly memoryMiB?: string;

  /**
   * Determines whether your Fargate Service will be assigned a public IP address.
   *
   * @default false
   */
  readonly publicTasks?: boolean;

  /**
   * Domain name for the service, e.g. api.example.com
   *
   * @default - No domain name.
   */
  readonly domainName?: string;

  /**
   * Route53 hosted zone for the domain, e.g. "example.com."
   *
   * @default - No Route53 hosted domain zone.
   */
  readonly domainZone?: IHostedZone;

  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  readonly createLogs?: boolean;
}

/**
 * A Fargate service running on an ECS cluster fronted by a load balancer
 */
export class LoadBalancedFargateService extends LoadBalancedServiceBase {

  /**
   * The Fargate service in this construct
   */
  public readonly service: FargateService;

  constructor(scope: cdk.Construct, id: string, props: LoadBalancedFargateServiceProps) {
    super(scope, id, props);

    const taskDefinition = new FargateTaskDefinition(this, 'TaskDef', {
      memoryMiB: props.memoryMiB,
      cpu: props.cpu
    });

    const optIn = props.createLogs !== undefined ? props.createLogs : true;

    const container = taskDefinition.addContainer('web', {
      image: props.image,
      logging: optIn ? this.createAWSLogDriver(this.node.id) : undefined,
      environment: props.environment
    });

    container.addPortMappings({
      containerPort: props.containerPort || 80,
    });

    const assignPublicIp = props.publicTasks !== undefined ? props.publicTasks : false;
    const service = new FargateService(this, "Service", {
      cluster: props.cluster,
      desiredCount: props.desiredCount || 1,
      taskDefinition,
      assignPublicIp
    });
    this.service = service;

    this.addServiceAsTarget(service);

    if (typeof props.domainName !== 'undefined') {
      if (typeof props.domainZone === 'undefined') {
        throw new Error('A Route53 hosted domain zone name is required to configure the specified domain name');
      }

      new AliasRecord(this, "DNS", {
        zone: props.domainZone,
        recordName: props.domainName,
        target: this.loadBalancer
      });
    }
  }

  private createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver(this, 'Logging', { streamPrefix: prefix });
  }
}
