import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { CfnTag, Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrCreateCluster
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_RunJobFlow.html
 *
 * @experimental
 */
export interface EmrCreateClusterProps {
  /**
   * A specification of the number and type of Amazon EC2 instances.
   */
  readonly instances: {[key: string]: any};

  /**
   * Also called instance profile and EC2 role. An IAM role for an EMR cluster. The EC2 instances of the cluster assume this role.
   *
   * This attribute has been renamed from jobFlowRole to clusterRole to align with other ERM/StepFunction integration parameters.
   * A Role will be created if one is not provided.
   *
   * @default None
   */
  readonly clusterRole?: iam.IRole;

  /**
   * The Name of the Cluster
   */
  readonly name: string;

  /**
   * The IAM role that will be assumed by the Amazon EMR service to access AWS resources on your behalf. A Role will be created if
   * one is not provided.
   *
   * @default None
   */
  readonly serviceRole?: iam.IRole;

  /**
   * A JSON string for selecting additional features.
   */
  readonly additionalInfo?: string;

  /**
   * A case-insensitive list of applications for Amazon EMR to install and configure when launching the cluster.
   */
  readonly applications?: Array<{[key: string]: any}>;

  /**
   * An IAM role for automatic scaling policies. A Role will be created if one is not provided.
   *
   * @default None
   */
  readonly autoScalingRole?: iam.IRole;

  /**
   * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
   */
  readonly bootstrapActions?: Array<{[key: string]: any}>;

  /**
   * The list of configurations supplied for the EMR cluster you are creating.
   */
  readonly configurations?: Array<{[key: string]: any}>;

  /**
   * The ID of a custom Amazon EBS-backed Linux AMI.
   */
  readonly customAmiId?: string;

  /**
   * The size, in GiB, of the EBS root device volume of the Linux AMI that is used for each EC2 instance.
   */
  readonly ebsRootVolumeSize?: number;

  /**
   * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration.
   */
  readonly kerberosAttributes?: {[key: string]: string};

  /**
   * The location in Amazon S3 to write the log files of the job flow.
   */
  readonly logUri?: string;

  /**
   * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster.
   */
  readonly releaseLabel?: string;

  /**
   * Specifies the way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized.
   */
  readonly scaleDownBehavior?: string;

  /**
   * The name of a security configuration to apply to the cluster.
   */
  readonly securityConfiguration?: string;

  /**
   * A list of tags to associate with a cluster and propagate to Amazon EC2 instances.
   */
  readonly tags?: CfnTag[];

  /**
   * A value of true indicates that all IAM users in the AWS account can perform cluster actions if they have the proper IAM policy permissions.
   *
   * @default true
   */
  readonly visibleToAllUsers?: boolean;

  /**
   * The service integration pattern indicates different ways to call CreateCluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to create an EMR Cluster.
 *
 * The ClusterConfiguration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the ClusterId.
 *
 * @experimental
 */
export class EmrCreateCluster implements sfn.IStepFunctionsTask {

  private readonly visibleToAllUsers: boolean;
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  private _serviceRole?: iam.IRole;
  private _clusterRole?: iam.IRole;
  private _autoScalingRole?: iam.IRole;

  constructor(private readonly props: EmrCreateClusterProps) {
    this.visibleToAllUsers = (this.props.visibleToAllUsers !== undefined) ? this.props.visibleToAllUsers : true;
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    this._serviceRole = this.props.serviceRole;
    this._clusterRole = this.props.clusterRole;
    this._autoScalingRole = this.props.autoScalingRole;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call CreateCluster.`);
    }
  }

  /**
   * The service role for the EMR Cluster.
   *
   * Only available after task has been added to a state machine.
   */
  public get serviceRole(): iam.IRole {
    if (this._serviceRole === undefined) {
        throw new Error(`role not available yet--use the object in a Task first`);
    }
    return this._serviceRole;
  }

  /**
   * The instance role for the EMR Cluster.
   *
   * Only available after task has been added to a state machine.
   */
  public get clusterRole(): iam.IRole {
    if (this._clusterRole === undefined) {
        throw new Error(`role not available yet--use the object in a Task first`);
    }
    return this._clusterRole;
  }

  /**
   * The autoscaling role for the EMR Cluster.
   *
   * Only available after task has been added to a state machine.
   */
  public get autoScalingRole(): iam.IRole {
    if (this._autoScalingRole === undefined) {
        throw new Error(`role not available yet--use the object in a Task first`);
    }
    return this._autoScalingRole;
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig {
    // If the Roles are undefined then they weren't provided, so create them
    this._serviceRole = this._serviceRole || this.createServiceRole(task);
    this._clusterRole = this._clusterRole || this.createClusterRole(task);
    this._autoScalingRole = this._autoScalingRole || this.createAutoScalingRole(task);

    return {
      resourceArn: getResourceArn('elasticmapreduce', 'createCluster', this.integrationPattern),
      policyStatements: this.createPolicyStatements(task, this._serviceRole, this._clusterRole, this._autoScalingRole),
      parameters: {
        Instances: this.props.instances,
        JobFlowRole: this._clusterRole.roleName,
        Name: this.props.name,
        ServiceRole: this._serviceRole.roleName,
        AdditionalInfo: this.props.additionalInfo,
        Applications: this.props.applications,
        AutoScalingRole: (this.props.autoScalingRole === undefined) ?
          this.props.autoScalingRole :
          this.props.autoScalingRole.roleName,
        BootstrapActions: this.props.bootstrapActions,
        Configurations: this.props.configurations,
        CustomAmiId: this.props.customAmiId,
        EbsRootVolumeSize: this.props.ebsRootVolumeSize,
        KerberosAttributes: this.props.kerberosAttributes,
        LogUri: this.props.logUri,
        ReleaseLabel: this.props.releaseLabel,
        ScaleDownBehavior: this.props.scaleDownBehavior,
        SecurityConfiguration: this.props.securityConfiguration,
        Tags: (this.props.tags === undefined) ?
          this.props.tags :
          this.props.tags.map(t => ({
            Key: t.key,
            Value: t.value
          })),
        VisibleToAllUsers: this.visibleToAllUsers
      }
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call CreateCluster.
   */
  private createPolicyStatements(task: sfn.Task, serviceRole: iam.IRole, clusterRole: iam.IRole,
                                 autoScalingRole: iam.IRole): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:RunJobFlow',
          'elasticmapreduce:DescribeCluster',
          'elasticmapreduce:TerminateJobFlows'
        ],
        resources: ['*']
      })
    ];

    // Allow the StateMachine to PassRole to Cluster roles
    policyStatements.push(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: [
        serviceRole.roleArn,
        clusterRole.roleArn,
        autoScalingRole.roleArn
      ]
    }));

    if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRRunJobFlowRule'
        })]
      }));
    }

    return policyStatements;
  }

  /**
   * Generate the Role used by the EMR Service
   */
  private createServiceRole(task: sfn.Task): iam.IRole {
    return new iam.Role(task, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceRole')
      ]
    });
  }

  /**
   * Generate the Role used by the EC2 instances
   *
   * Data access permissions will need to be updated by the user
   */
  private createClusterRole(task: sfn.Task): iam.IRole {
    return new iam.Role(task, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });
  }

  /**
   * Generate the Role used to AutoScale the Cluster
   */
  private createAutoScalingRole(task: sfn.Task): iam.IRole {
    const role = new iam.Role(task, 'AutoScalingRole', {
      assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceforAutoScalingRole')
      ]
    });

    role.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('application-autoscaling.amazonaws.com')
        ],
        actions: [
          'sts:AssumeRole'
        ]
      })
    );

    return role;
  }
}