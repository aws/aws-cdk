import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Class for supported types of Container Providers
 */
export class ContainerProviderTypes {

  static type: string;

  /**
   * Supported container provider type for a EKS Cluster
   */
  static EKS(): ContainerProviderTypes {
    return new ContainerProviderTypes('EKS');
  }

  constructor(public readonly type: string) {
    ContainerProviderTypes.type = type;
  }
}

/**
 * The information about the container provider.
 */
export interface ContainerProvider {

  /**
   * The ID of the container cluster.
   *
   * @default - No Cluster Id
   */
  readonly id: string;

  /**
   * The namespace of an EKS cluster
   *
   * @default - No namespace
   */
  readonly namespace?: string;

  /**
   * The type of the container provider.
   */
  readonly type: ContainerProviderTypes;
}

/**
 * The props for a EMR Containers CreateVirtualCluster Task.
 */
export interface EmrContainersCreateVirtualClusterProps extends sfn.TaskStateBaseProps {

  /**
   * Name of the specified virtual cluster.
   *
   */
  readonly name: string;

  /**
   * The container provider of the virtual cluster
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_ContainerProvider.html
   *
   * @default - No containerProvider
   */
  readonly containerProvider: ContainerProvider

  /**
   * The tags assigned to the virtual cluster
   *
   * @default {}
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Creates a Virtual Cluster from a EKS cluster in a Task State
 *
 * @see https://docs.amazonaws.cn/en_us/step-functions/latest/dg/connect-emr-eks.html
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
        Name: this.props.name,
        ContainerProvider: {
          Id: this.props.containerProvider.id,
          Info: {
            EksInfo: {
              Namespace: this.props.containerProvider.namespace,
            },
          },
          Type: this.props.containerProvider.type,
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
          cdk.Stack.of(this).formatArn({
            service: 'iam',
            resource: 'role/aws-service-role/emr-containers.amazonaws.com',
            resourceName: 'AWSServiceRoleForAmazonEMRContainers',
          }),
        ],
        actions: ['iam:CreateServiceLinkedRole'],
        conditions: {
          stringLike: {
            'iam:AWSServiceName': 'emr-containers.amazonaws.com',
          },
        },
      }),
    ];
  }
}
