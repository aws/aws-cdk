import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as emrcontainers from '@aws-cdk/aws-emrcontainers'
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The props for a EMR Containers CreateVirtualCluster Task
 */
export interface EMRContainersCreateVirtualClusterProps extends sfn.TaskStateBaseProps {

  /**
   * Name of the specified virtual cluster.
   * 
   * @default - No name
   */
   readonly clusterName: string;

  /**
   * The container provider of the virtual cluster 
   * 
   * Note: EKS Cluster is the only supported type as of 06/21
   * 
   * @default - No container provider
   */
  readonly containerProvider: emrcontainers.CfnVirtualCluster.ContainerProviderProperty;

  /**
   * The tags assigned to virtual clusters
   * 
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Creates a Virtual Cluster from a EKS cluster in a Task State
 * 
 * Output: the output of this task is a Virtual Cluster structure
 * @see https://docs.amazonaws.cn/en_us/step-functions/latest/dg/connect-emr-eks.html
 */
export class EMRContainersCreateVirtualCluster extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EMRContainersCreateVirtualClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EMRContainersCreateVirtualCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.createPolicyStatements(); 
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('emr-containers', 'createVirtualCluster', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
          ClusterName: this.props.clusterName,
          ContainerProvider: this.props.containerProvider
        })
      }
  };

  private createPolicyStatements(): iam.PolicyStatement[] {
    return [new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'emr-containers',
          resource: 'virtualcluster',
          resourceName: this.props.clusterName,
        }),
      ],
      actions: ['emr-containers:CreateVirtualCluster']
    })];
  }
}