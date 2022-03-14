import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Class for supported types of EMR Containers' Container Providers
 */
enum ContainerProviderTypes {

  /**
   * Supported container provider type for a EKS Cluster
   */
  EKS = 'EKS'
}

/**
 * Class that supports methods which return the EKS cluster name depending on input type.
 */
export class EksClusterInput {

  /**
   * Specify an existing EKS Cluster as the name for this Cluster
   */
  static fromCluster(cluster: eks.ICluster): EksClusterInput {
    return new EksClusterInput(cluster.clusterName);
  }

  /**
   * Specify a Task Input as the name for this Cluster
   */
  static fromTaskInput(taskInput: sfn.TaskInput): EksClusterInput {
    return new EksClusterInput(taskInput.value);
  }

  /**
   * Initializes the clusterName
   *
   * @param clusterName The name of the EKS Cluster
   */
  private constructor(readonly clusterName: string) { }
}

/**
 * Properties to define a EMR Containers CreateVirtualCluster Task on an EKS cluster
 */
export interface EmrContainersCreateVirtualClusterProps extends sfn.TaskStateBaseProps {

  /**
   * EKS Cluster or task input that contains the name of the cluster
   */
  readonly eksCluster: EksClusterInput;

  /**
   * The namespace of an EKS cluster
   *
   * @default - 'default'
   */
  readonly eksNamespace?: string;

  /**
   * Name of the virtual cluster that will be created.
   *
   * @default - the name of the state machine execution that runs this task and state name
   */
  readonly virtualClusterName?: string;

  /**
   * The tags assigned to the virtual cluster
   *
   * @default {}
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Task that creates an EMR Containers virtual cluster from an EKS cluster
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr-eks.html
 */
export class EmrContainersCreateVirtualCluster extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrContainersCreateVirtualClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, EmrContainersCreateVirtualCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('emr-containers', 'createVirtualCluster', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Name: this.props.virtualClusterName ?? sfn.JsonPath.stringAt('States.Format(\'{}/{}\', $$.Execution.Name, $$.State.Name)'),
        ContainerProvider: {
          Id: this.props.eksCluster.clusterName,
          Info: {
            EksInfo: {
              Namespace: this.props.eksNamespace ?? 'default',
            },
          },
          Type: ContainerProviderTypes.EKS,
        },
        Tags: this.props.tags,
      }),
    };
  };

  private createPolicyStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        resources: ['*'], // We need * permissions for creating a virtual cluster https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-iam.html
        actions: ['emr-containers:CreateVirtualCluster'],
      }),
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'iam',
            region: '',
            resource: 'role/aws-service-role/emr-containers.amazonaws.com',
            resourceName: 'AWSServiceRoleForAmazonEMRContainers',
          }),
        ],
        actions: ['iam:CreateServiceLinkedRole'],
        conditions: {
          StringLike: { 'iam:AWSServiceName': 'emr-containers.amazonaws.com' },
        },
      }),
    ];
  }
}
