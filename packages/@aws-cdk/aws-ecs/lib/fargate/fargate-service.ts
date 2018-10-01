import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps } from '../base/base-service';
import { BaseTaskDefinition } from '../base/base-task-definition';
import { FargateCluster } from './fargate-cluster';
import { FargateTaskDefinition } from './fargate-task-definition';

export interface FargateServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: FargateCluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: FargateTaskDefinition;
}

export class FargateService extends BaseService {
  protected readonly taskDef: BaseTaskDefinition;
  private readonly taskDefinition: FargateTaskDefinition;

  constructor(parent: cdk.Construct, name: string, props: FargateServiceProps) {
    super(parent, name, props, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'FARGATE'
    });

    if (!this.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    this.taskDefinition = props.taskDefinition;
    this.taskDef = props.taskDefinition;
  }
}
