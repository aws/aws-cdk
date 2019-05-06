import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { VpcNetwork } from '@aws-cdk/aws-ec2';
import { HostedZoneProvider } from '@aws-cdk/aws-route53';
import cdk = require('@aws-cdk/cdk');
import { Cluster } from './cluster';
import { ContainerImage } from './container-image';
import { LoadBalancedFargateService } from './load-balanced-fargate-service';

/**
 * Properties for a LoadBalancedEcsServiceApplet
 */
export interface LoadBalancedFargateServiceAppletProps extends cdk.StackProps {
  /**
   * The image to start (from DockerHub)
   */
  readonly image: string;

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
   * The container port of the application load balancer attached to your Fargate service. Corresponds to container port mapping.
   *
   * @default 80
   */
  readonly containerPort?: number;

  /**
   * Determines whether the Application Load Balancer will be internet-facing
   *
   * @default true
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * Determines whether your Fargate Service will be assigned a public IP address.
   *
   * @default false
   */
  readonly publicTasks?: boolean;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredCount?: number;

  /*
   * Domain name for the service, e.g. api.example.com
   */
  readonly domainName?: string;

  /**
   * Route53 hosted zone for the domain, e.g. "example.com."
   */
  readonly domainZone?: string;

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   */
  readonly certificate?: string;

  /**
   * Environment variables to pass to the container
   *
   * @default No environment variables
   */
  readonly environment?: { [key: string]: string };
}

/**
 * An applet for a LoadBalancedFargateService. Sets up a Fargate service, Application
 * load balancer, ECS cluster, VPC, and (optionally) Route53 alias record.
 */
export class LoadBalancedFargateServiceApplet extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: LoadBalancedFargateServiceAppletProps) {
    super(scope, id, props);

    const vpc = new VpcNetwork(this, 'MyVpc', { maxAZs: 2 });
    const cluster = new Cluster(this, 'Cluster', { vpc });

    let domainZone;
    if (props.domainZone) {
      domainZone = new HostedZoneProvider(this, { domainName: props.domainZone }).findAndImport(this, 'Zone');
    }
    let certificate;
    if (props.certificate) {
      certificate = Certificate.fromCertificateArn(this, 'Cert', props.certificate);
    }

    // Instantiate Fargate Service with just cluster and image
    new LoadBalancedFargateService(this, "FargateService", {
      cluster,
      cpu: props.cpu,
      containerPort: props.containerPort,
      memoryMiB: props.memoryMiB,
      publicLoadBalancer: props.publicLoadBalancer,
      publicTasks: props.publicTasks,
      image: ContainerImage.fromRegistry(props.image),
      desiredCount: props.desiredCount,
      environment: props.environment,
      certificate,
      domainName: props.domainName,
      domainZone
    });
  }
}