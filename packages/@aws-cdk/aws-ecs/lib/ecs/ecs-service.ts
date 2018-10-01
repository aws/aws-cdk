import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps } from '../base/base-service';
import { BaseTaskDefinition } from '../base/base-task-definition';
import { EcsCluster } from './ecs-cluster';
import { EcsTaskDefinition } from './ecs-task-definition';

export interface EcsServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: EcsCluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: EcsTaskDefinition;
}

export class EcsService extends BaseService implements elb.ILoadBalancerTarget {
  protected readonly taskDef: BaseTaskDefinition;
  private readonly taskDefinition: EcsTaskDefinition;

  constructor(parent: cdk.Construct, name: string, props: EcsServiceProps) {
    super(parent, name, props, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'EC2'
    });

    if (!this.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    this.taskDefinition = props.taskDefinition;
    this.taskDef = props.taskDefinition;
  }

  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    // FIXME: Security Groups
    this.loadBalancers.push({
      loadBalancerName: loadBalancer.loadBalancerName,
      containerName: this.taskDefinition.defaultContainer!.name,
      containerPort: this.taskDefinition.defaultContainer!.loadBalancerPort(true),
    });
    this.createLoadBalancerRole();
  }
}
