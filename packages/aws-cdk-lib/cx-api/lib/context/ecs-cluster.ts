/**
   * Properties of a discovered load balancer
   */
export interface EcsClusterContextResponse {
  readonly clusterName: string;
  readonly clusterArn: string;
  readonly vpcId: string;
  // connectionsの生成に用いる。ALBのLookupを参照
  readonly securityGroupIds: string[];
  readonly hasEc2Capacity: boolean;
//   readonly defaultCloudMapNamespace?: cloudmap.INamespace;
//   readonly autoscalingGroup?: autoscaling.IAutoScalingGroup;
//   readonly executeCommandConfiguration?: ExecuteCommandConfiguration;
}
