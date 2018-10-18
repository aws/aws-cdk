import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { IContainerImage } from './container-image';
import { IEcsCluster } from './ecs/ecs-cluster';
import { EcsService } from './ecs/ecs-service';
import { EcsTaskDefinition } from './ecs/ecs-task-definition';

export interface LoadBalancedEcsServiceProps {
  /**
   * The cluster where your ECS service will be deployed
   */
  cluster: IEcsCluster;

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
   * This default is set in the underlying EcsTaskDefinition construct.
   *
   * @default 256
   */
  cpu?: string;

  /**
   * Hard limit on memory
   */
  memoryLimitMiB?: number;

  /**
   * Memory reservation
   */
  memoryReservationMiB?: number;

  /**
   * The container port of the application load balancer attached to your Ecs service. Corresponds to container port mapping.
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
}

export class LoadBalancedEcsService extends cdk.Construct {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  constructor(parent: cdk.Construct, id: string, props: LoadBalancedEcsServiceProps) {
    super(parent, id);

    const taskDefinition = new EcsTaskDefinition(this, 'TaskDef', {
    });

    const container = taskDefinition.addContainer('web', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
    });

    container.addPortMappings({
      containerPort: props.containerPort || 80,
    });

    const service = new EcsService(this, "Service", {
      cluster: props.cluster,
      taskDefinition,
    });

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc: props.cluster.vpc,
      internetFacing
    });

    this.loadBalancer = lb;

    const listener = lb.addListener('Listener', { port: 80, open: true });
    listener.addTargets('ECS', {
      port: 80,
      targets: [service]
    });

    // Always output load balancer address, because why not?
    new cdk.Output(this, 'LoadBalancerDNS', { value: lb.dnsName });
  }
}
