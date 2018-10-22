import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { ContainerImage } from './container-image';
import { IEcsCluster } from './ecs/ecs-cluster';
import { EcsService } from './ecs/ecs-service';
import { EcsTaskDefinition } from './ecs/ecs-task-definition';

export interface LoadBalancedEcsServiceProps {
  /**
   * The cluster where your Fargate service will be deployed
   */
  cluster: IEcsCluster;

  /**
   * The image to use for a container.
   *
   * You can use images in the Docker Hub registry or specify other
   * repositories (repository-url/image:tag).
   */
  image: ContainerImage;

  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required.
   */
  memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required.
   */
  memoryReservationMiB?: number;

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
}

export class LoadBalancedEcsService extends cdk.Construct {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  constructor(parent: cdk.Construct, id: string, props: LoadBalancedEcsServiceProps) {
    super(parent, id);

    const taskDefinition = new EcsTaskDefinition(this, 'TaskDef', {});

    const container = taskDefinition.addContainer('web', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
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

    const listener = lb.addListener('PublicListener', { port: 80, open: true });
    listener.addTargets('ECS', {
      port: 80,
      targets: [service]
    });
  }
}
