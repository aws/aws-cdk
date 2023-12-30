/**
   * Properties of a discovered load balancer
   */
export interface EcsClusterContextResponse {
  /**
   * cluster name
   */
  readonly clusterName: string;

  /**
   * cluster arn
   */
  readonly clusterArn: string;

  /**
   * vpc id
   */
  readonly vpcId: string;

  /**
   * security group ids
   */
  readonly securityGroupIds: string[];

  /**
   * security group names
   */
  readonly hasEc2Capacity: boolean;
//   readonly defaultCloudMapNamespace?: cloudmap.INamespace;
//   readonly autoscalingGroup?: autoscaling.IAutoScalingGroup;
//   readonly executeCommandConfiguration?: ExecuteCommandConfiguration;
}
