import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Cluster } from './cluster';
import { DockerHub } from './container-image';
import { LoadBalancedFargateService } from './load-balanced-fargate-service';

/**
 * Properties for a LoadBalancedEcsServiceApplet
 */
export interface LoadBalancedFargateServiceAppletProps extends cdk.StackProps {
  /**
   * The image to start (from DockerHub)
   */
  image: string;

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
}

/**
 * An applet for a LoadBalancedFargateService
 */
export class LoadBalancedFargateServiceApplet extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props: LoadBalancedFargateServiceAppletProps) {
    super(parent, id, props);

    const vpc = new ec2.VpcNetwork(this, 'MyVpc', { maxAZs: 2 });
    const cluster = new Cluster(this, 'Cluster', { vpc });

    // Instantiate Fargate Service with just cluster and image
    new LoadBalancedFargateService(this, "FargateService", {
      cluster,
      cpu: props.cpu,
      containerPort: props.containerPort,
      memoryMiB: props.memoryMiB,
      publicLoadBalancer: props.publicLoadBalancer,
      publicTasks: props.publicTasks,
      image: DockerHub.image(props.image),
    });
  }
}