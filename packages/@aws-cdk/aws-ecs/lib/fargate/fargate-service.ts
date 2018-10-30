import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps } from '../base/base-service';
import { BaseTaskDefinition } from '../base/base-task-definition';
import { IFargateCluster } from './fargate-cluster';
import { FargateTaskDefinition } from './fargate-task-definition';

/**
 * Properties to define a Fargate service
 */
export interface FargateServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: IFargateCluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: FargateTaskDefinition;

  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default Private subnet if assignPublicIp, public subnets otherwise
   */
  vpcPlacement?: ec2.VpcPlacementStrategy;

  /**
   * Existing security group to use for the tasks
   *
   * @default A new security group is created
   */
  securityGroup?: ec2.SecurityGroupRef;
}

/**
 * Start a service on an ECS cluster
 */
export class FargateService extends BaseService {
  /**
   * Manage allowed network traffic for this construct
   */
  public readonly connections: ec2.Connections;

  /**
   * The Task Definition for this service
   */
  public readonly taskDefinition: FargateTaskDefinition;
  protected readonly taskDef: BaseTaskDefinition;

  constructor(parent: cdk.Construct, name: string, props: FargateServiceProps) {
    super(parent, name, props, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'FARGATE',
    }, props.cluster.clusterName);

    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcPlacement, props.securityGroup);
    this.connections = new ec2.Connections({ securityGroup: this.securityGroup });

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    this.taskDefinition = props.taskDefinition;
    this.taskDef = props.taskDefinition;
  }
}
