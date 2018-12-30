import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { AliasRecord, IHostedZone } from '@aws-cdk/aws-route53';
import cdk = require('@aws-cdk/cdk');
import { ICluster } from './cluster';
import { IContainerImage } from './container-image';
import { FargateService } from './fargate/fargate-service';
import { FargateTaskDefinition } from './fargate/fargate-task-definition';
import { AwsLogDriver } from './log-drivers/aws-log-driver';

/**
 * Properties for a LoadBalancedEcsService
 */
export interface LoadBalancedFargateServiceProps {
  /**
   * The cluster where your Fargate service will be deployed
   */
  cluster: ICluster;

  /**
   * The image to start
   */
  image: IContainerImage;

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
  cpu?: string;

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
  memoryMiB?: string;

  /**
   * The container port of the application load balancer attached to your Fargate service. Corresponds to container port mapping.
   *
   * @default 80
   */
  containerPort?: number;

  /**
   * Determines whether the Application Load Balancer will be internet-facing
   *
   * @default true
   */
  publicLoadBalancer?: boolean;

  /**
   * Determines whether your Fargate Service will be assigned a public IP address.
   *
   * @default false
   */
  publicTasks?: boolean;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  desiredCount?: number;

  /*
   * Domain name for the service, e.g. api.example.com
   */
  domainName?: string;

  /**
   * Route53 hosted zone for the domain, e.g. "example.com."
   */
  domainZone?: IHostedZone;

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   */
  certificate?: ICertificate;
  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  createLogs?: boolean;
}

/**
 * A Fargate service running on an ECS cluster fronted by a load balancer
 */
export class LoadBalancedFargateService extends cdk.Construct {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  public readonly targetGroup: elbv2.ApplicationTargetGroup;

  public readonly service: FargateService;

  constructor(scope: cdk.Construct, scid: string, props: LoadBalancedFargateServiceProps) {
    super(scope, scid);

    const taskDefinition = new FargateTaskDefinition(this, 'TaskDef', {
      memoryMiB: props.memoryMiB,
      cpu: props.cpu
    });

    const optIn = props.createLogs !== undefined ? props.createLogs : true;

    const container = taskDefinition.addContainer('web', {
      image: props.image,
      logging: optIn ? this.createAWSLogDriver(this.node.scid) : undefined
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

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc: props.cluster.vpc,
      internetFacing
    });

    this.loadBalancer = lb;

    let listener;
    if (typeof props.certificate !== 'undefined') {
      listener = lb.addListener('PublicListener', {
        port: 443,
        open: true,
        certificateArns: [props.certificate.certificateArn]
      });
    } else {
      listener = lb.addListener('PublicListener', { port: 80, open: true });
    }

    this.targetGroup = listener.addTargets('ECS', {
      port: 80,
      targets: [service]
    });

    new cdk.Output(this, 'LoadBalancerDNS', { value: lb.dnsName });

    if (typeof props.domainName !== 'undefined') {
      if (typeof props.domainZone === 'undefined') {
        throw new Error('A Route53 hosted domain zone name is required to configure the specified domain name');
      }

      new AliasRecord(this, "DNS", {
        zone: props.domainZone,
        recordName: props.domainName,
        target: lb
      });
    }
  }

  private createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver(this, 'Logging', { streamPrefix: prefix });
  }
}
