import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
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
  readonly instances: EmrCreateCluster.InstancesConfigProperty;

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
  readonly applications?: EmrCreateCluster.ApplicationConfigProperty[];

  /**
   * An IAM role for automatic scaling policies. A Role will be created if one is not provided.
   *
   * @default None
   */
  readonly autoScalingRole?: iam.IRole;

  /**
   * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
   */
  readonly bootstrapActions?: EmrCreateCluster.BootstrapActionConfigProperty[];

  /**
   * The list of configurations supplied for the EMR cluster you are creating.
   */
  readonly configurations?: EmrCreateCluster.ConfigurationProperty[];

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
  readonly kerberosAttributes?: EmrCreateCluster.KerberosAttributesProperty;

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
  readonly tags?: cdk.CfnTag[];

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
 * Properties for the EMR Cluster EC2 Instances
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_JobFlowInstancesConfig.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface InstancesConfigProperty {

  }
}

/**
 * Properties for the EMR Cluster Applications
 *
 * Applies to Amazon EMR releases 4.0 and later. A case-insensitive list of applications for Amazon EMR to install and configure when launching
 * the cluster.
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_Application.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface ApplicationConfigProperty {
    /**
     * This option is for advanced users only. This is meta information about third-party applications that third-party vendors use
     * for testing purposes.
     */
    readonly additionalInfo?: {[key: string]: string};

    /**
     * Arguments for Amazon EMR to pass to the application.
     */
    readonly args?: string[];

    /**
     * The name of the application.
     */
    readonly name: string;

    /**
     * The version of the application.
     */
    readonly version?: string;
  }
}

/**
 * Render the ApplicationConfigProperty as JSON
 *
 * @param property
 */
function ApplicationConfigPropertyToJson(property: EmrCreateCluster.ApplicationConfigProperty) {
  return {
    Name: cdk.stringToCloudFormation(property.name),
    Args: cdk.listMapper(cdk.stringToCloudFormation)(property.args),
    Version: cdk.stringToCloudFormation(property.version),
    AdditionalInfo: cdk.objectToCloudFormation(property.additionalInfo)
  };
}

/**
 * Properties for the EMR Cluster Bootstrap Actions
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_BootstrapActionConfig.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface BootstrapActionConfigProperty {
    /**
     * The name of the bootstrap action.
     */
    readonly name: string;

    /**
     * Location of the script to run during a bootstrap action. Can be either a location in Amazon S3 or on a local file system.
     */
    readonly path: string;

    /**
     * A list of command line arguments to pass to the bootstrap action script.
     */
    readonly args?: string[];
  }
}

/**
 * Render the BootstrapActionProperty as JSON
 *
 * @param property
 */
function BootstrapActionConfigToJson(property: EmrCreateCluster.BootstrapActionConfigProperty) {
  return {
    Name: cdk.stringToCloudFormation(property.name),
    ScriptBootstrapAction: {
      Path: cdk.stringToCloudFormation(property.path),
      Args: cdk.listMapper(cdk.stringToCloudFormation)(property.args)
    }
  };
}

/**
 * Properties for the EMR Cluster Configurations
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_Configuration.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface ConfigurationProperty {
    /**
     * The classification within a configuration.
     */
    readonly classification?: string;

    /**
     * A set of properties specified within a configuration classification.
     */
    readonly properties?: {[key: string]: string};

    /**
     * A list of additional configurations to apply within a configuration object.
     */
    readonly configurations?: ConfigurationProperty[];
  }
}

/**
 * Render the ConfigurationProperty as JSON
 *
 * @param property
 */
function ConfigurationPropertyToJson(property: EmrCreateCluster.ConfigurationProperty) {
  return {
    Classification: cdk.stringToCloudFormation(property.classification),
    Properties: cdk.objectToCloudFormation(property.properties),
    Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations)
  };
}

/**
 * Properties for the EMR Cluster Kerberos Attributes
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_KerberosAttributes.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface KerberosAttributesProperty {
    /**
     * The Active Directory password for ADDomainJoinUser.
     */
    readonly adDomainJoinPassword?: string;

    /**
     * Required only when establishing a cross-realm trust with an Active Directory domain. A user with sufficient privileges to join
     * resources to the domain.
     */
    readonly adDomainJoinUser?: string;

    /**
     * Required only when establishing a cross-realm trust with a KDC in a different realm. The cross-realm principal password, which
     * must be identical across realms.
     */
    readonly crossRealmTrustPrincipalPassword?: string;

    /**
     * The password used within the cluster for the kadmin service on the cluster-dedicated KDC, which maintains Kerberos principals,
     * password policies, and keytabs for the cluster.
     */
    readonly kdcAdminPassword?: string;

    /**
     * The name of the Kerberos realm to which all nodes in a cluster belong. For example, EC2.INTERNAL.
     */
    readonly realm: string;
  }
}

/**
 * Render the KerberosAttributesProperty as JSON
 *
 * @param property
 */
function KerberosAttributesPropertyToJson(property: EmrCreateCluster.KerberosAttributesProperty) {
  return {
    ADDomainJoinPassword: cdk.stringToCloudFormation(property.adDomainJoinPassword),
    ADDomainJoinUser: cdk.stringToCloudFormation(property.adDomainJoinUser),
    CrossRealmTrustPrincipalPassword: cdk.stringToCloudFormation(property.crossRealmTrustPrincipalPassword),
    KdcAdminPassword: cdk.stringToCloudFormation(property.kdcAdminPassword),
    Realm: cdk.stringToCloudFormation(property.realm)
  };
}

/**
 * Properties for the EMR Cluster Placement Type
 *
 * See the RunJobFlow API for complete documentation on input parameters
 *
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_PlacementType.html
 *
 * @experimental
 */
export namespace EmrCreateCluster {
  export interface PlacementTypeProperty {

  }
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
        JobFlowRole: cdk.stringToCloudFormation(this._clusterRole.roleName),
        Name: cdk.stringToCloudFormation(this.props.name),
        ServiceRole: cdk.stringToCloudFormation(this._serviceRole.roleName),
        AdditionalInfo: cdk.stringToCloudFormation(this.props.additionalInfo),
        Applications: cdk.listMapper(ApplicationConfigPropertyToJson)(this.props.applications),
        AutoScalingRole: cdk.stringToCloudFormation(this._autoScalingRole.roleName),
        BootstrapActions: cdk.listMapper(BootstrapActionConfigToJson)(this.props.bootstrapActions),
        Configurations: cdk.listMapper(ConfigurationPropertyToJson)(this.props.configurations),
        CustomAmiId: cdk.stringToCloudFormation(this.props.customAmiId),
        EbsRootVolumeSize: cdk.numberToCloudFormation(this.props.ebsRootVolumeSize),
        KerberosAttributes: (this.props.kerberosAttributes === undefined) ?
          this.props.kerberosAttributes :
          KerberosAttributesPropertyToJson(this.props.kerberosAttributes),
        LogUri: cdk.stringToCloudFormation(this.props.logUri),
        ReleaseLabel: cdk.stringToCloudFormation(this.props.releaseLabel),
        ScaleDownBehavior: cdk.stringToCloudFormation(this.props.scaleDownBehavior),
        SecurityConfiguration: cdk.stringToCloudFormation(this.props.securityConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(this.props.tags),
        VisibleToAllUsers: cdk.booleanToCloudFormation(this.visibleToAllUsers)
      }
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call CreateCluster.
   */
  private createPolicyStatements(task: sfn.Task, serviceRole: iam.IRole, clusterRole: iam.IRole,
                                 autoScalingRole: iam.IRole): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(task);

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