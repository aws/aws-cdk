import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/** Properties for creating a cluster with EksCreateCluster */
export interface EksCreateClusterProps extends sfn.TaskStateBaseProps {
  /** Name of the cluster */
  readonly name: string;

  /**
   * The desired Kubernetes version for your cluster.
   * @default - latest
   */
  readonly kubernetesVersion?: string;

  /** EKS Role ARN to create a cluster */
  readonly role: string;

  /** VPC configuration used by the cluster control plane */
  readonly resourcesVpcConfig: VpcConfigRequest;

  /**
   * Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs.
   * @default - no logging configuration
   */
  readonly loggingConfiguration?: LoggingConfig;

  /**
   * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
   * @default - no client request token
   */
  readonly clientRequestToken?: string;

  /**
   * Metadata that you apply to the cluster to assist with categorization and organization
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * The encryption configuration for the cluster.
   * @default - No encryption config
   */
  readonly encryptionConfig?: EncryptionConfig[];
}

/**
 * Create a cluster as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
 */
export class EksCreateCluster extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EksCreateClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EksCreateCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['eks:CreateCluster'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [props.role],
        conditions: {
          StringEquals: { 'iam:PassedToService': 'eks.amazonaws.com' },
        },
      }),
    ];
  }

  /**
   * Provides the EKS create cluster service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    if (this.props.loggingConfiguration?.clusterLoggingList) {
      return {
        Resource: integrationResourceArn('eks', 'createCluster', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          Name: this.props.name,
          Version: this.props.kubernetesVersion,
          RoleArn: this.props.role,
          ResourcesVpcConfig: {
            SubnetIds: this.props.resourcesVpcConfig.subnetIds,
            SecurityGroupIds: this.props.resourcesVpcConfig.securityGroupIds,
            EndpointPublicAccess: this.props.resourcesVpcConfig.endpointPublicAccess,
            EndpointPrivateAccess: this.props.resourcesVpcConfig.endpointPrivateAccess,
            PublicAccessCidrs: this.props.resourcesVpcConfig.publicAccessCidrs,
          },
          Logging: {
            ClusterLogging: this.props.loggingConfiguration?.clusterLoggingList,
          },
          ClientRequestToken: this.props.clientRequestToken,
          Tags: this.props.tags,
          EncryptionConfig: this.props.encryptionConfig,
        }),
      };
    } else {
      return {
        Resource: integrationResourceArn('eks', 'createCluster', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          Name: this.props.name,
          Version: this.props.kubernetesVersion,
          RoleArn: this.props.role,
          ResourcesVpcConfig: {
            SubnetIds: this.props.resourcesVpcConfig.subnetIds,
            SecurityGroupIds: this.props.resourcesVpcConfig.securityGroupIds,
            EndpointPublicAccess: this.props.resourcesVpcConfig.endpointPublicAccess,
            EndpointPrivateAccess: this.props.resourcesVpcConfig.endpointPrivateAccess,
            PublicAccessCidrs: this.props.resourcesVpcConfig.publicAccessCidrs,
          },
          ClientRequestToken: this.props.clientRequestToken,
          Tags: this.props.tags,
          EncryptionConfig: this.props.encryptionConfig,
        }),
      };
    }
  }
}

/** VPC configuration used by the cluster control plane */
export interface VpcConfigRequest {
  /** Subnets associated with your cluster */
  readonly subnetIds: string[];

  /**
   * Security groups associated with the cross-account elastic network interfaces
   * @default - default security group for your VPC is used
   */
  readonly securityGroupIds?: string[];

  /**
   * Parameter indicates whether the Amazon EKS public API server endpoint is enabled
   * @default - true
   */
  readonly endpointPublicAccess?: boolean;

  /**
   * Parameter indicates whether the Amazon EKS private API server endpoint is enabled
   * @default - false
   */
  readonly endpointPrivateAccess?: boolean;

  /**
   * CIDR blocks that are allowed access to your cluster's public Kubernetes API server endpoint
   * @default - no public access CIDRs
   */
  readonly publicAccessCidrs?: string[];
}

/** Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs */
export interface LoggingConfig {

  /**
   * The cluster control plane logging configuration for your cluster
   *
   * @default - no cluster logging
   */
  readonly clusterLoggingList?: ClusterLogging[];
}

/**
 * The cluster control plane logging configuration for your cluster */
export interface ClusterLogging {

  /**
   * The available cluster control plane log types
   *
   * @default - no types
   */
  readonly types?: string[];

  /**
   * Flag for log type exports of its control plane logs to CloudWatch Logs
   *
   * @default - false
   */
  readonly enabled?: boolean;
}

/** The encryption configuration for the cluster. */
export interface EncryptionConfig {

  /**
   * Specifies the resources to be encrypted. The only supported value is "secrets".
   *
   * @default - no resources
  */
  readonly resources?: string[];

  /**
   * AWS Key Management Service (AWS KMS) customer master key (CMK). Either the ARN or the alias can be used.
   *
   * @default - no provider
   */
  readonly provider?: Provider
}

/** The encryption configuration for the cluster. */
export interface Provider {

  /**
   * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
   *
   * @default - no keyArn
  */
  readonly keyArn?: String;
}