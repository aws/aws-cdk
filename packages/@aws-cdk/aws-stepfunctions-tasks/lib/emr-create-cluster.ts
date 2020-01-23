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
  readonly scaleDownBehavior?: EmrCreateCluster.EmrClusterScaleDownBehavior;

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
        Instances: EmrCreateCluster.InstancesConfigPropertyToJson(this.props.instances),
        JobFlowRole: cdk.stringToCloudFormation(this._clusterRole.roleName),
        Name: cdk.stringToCloudFormation(this.props.name),
        ServiceRole: cdk.stringToCloudFormation(this._serviceRole.roleName),
        AdditionalInfo: cdk.stringToCloudFormation(this.props.additionalInfo),
        Applications: cdk.listMapper(EmrCreateCluster.ApplicationConfigPropertyToJson)(this.props.applications),
        AutoScalingRole: cdk.stringToCloudFormation(this._autoScalingRole.roleName),
        BootstrapActions: cdk.listMapper(EmrCreateCluster.BootstrapActionConfigToJson)(this.props.bootstrapActions),
        Configurations: cdk.listMapper(EmrCreateCluster.ConfigurationPropertyToJson)(this.props.configurations),
        CustomAmiId: cdk.stringToCloudFormation(this.props.customAmiId),
        EbsRootVolumeSize: cdk.numberToCloudFormation(this.props.ebsRootVolumeSize),
        KerberosAttributes: (this.props.kerberosAttributes === undefined) ?
          this.props.kerberosAttributes :
          EmrCreateCluster.KerberosAttributesPropertyToJson(this.props.kerberosAttributes),
        LogUri: cdk.stringToCloudFormation(this.props.logUri),
        ReleaseLabel: cdk.stringToCloudFormation(this.props.releaseLabel),
        ScaleDownBehavior: cdk.stringToCloudFormation(this.props.scaleDownBehavior?.valueOf()),
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

export namespace EmrCreateCluster {
  /**
   * Valid valus for the Cluster ScaleDownBehavior
   *
   * @experimental
   */
  export enum EmrClusterScaleDownBehavior {
    /**
     * Indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was
     * submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version
     */
    TERMINATE_AT_INSTANCE_HOUR = 'TERMINATE_AT_INSTANCE_HOUR',

    /**
     * Indicates that Amazon EMR blacklists and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the
     * instance-hour boundary.
     */
    TERMINATE_AT_TASK_COMPLETION = 'TERMINATE_AT_TASK_COMPLETION'
  }

  /**
   * Instance Role Types
   *
   * @experimental
   */
  export enum InstanceRoleType {
    MASTER = 'MASTER',
    CORE = 'CORE',
    TASK = 'TASK'
  }

  export enum EbsBlockDeviceVolumeType {
    GP2 = 'gp2',
    IO1 = 'io1',
    STANDARD = 'standard'
  }

  /**
   * Configuration of requested EBS block device associated with the instance group with count of volumes that will be
   * associated to every instance.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_EbsBlockDeviceConfig.html
   *
   * @experimental
   */
  export interface EbsBlockDeviceConfigProperty {
    /**
     * Number of EBS volumes with a specific volume configuration that will be associated with every instance in the instance group
     */
    readonly volumesPerInstance?: number;

    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     */
    readonly iops?: number;

    /**
     * The volume size, in gibibytes (GiB). This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
     */
    readonly sizeInGB: number;

    /**
     * The volume type. Volume types supported are gp2, io1, standard.
     */
    readonly volumeType: EbsBlockDeviceVolumeType
  }

  /**
   * Render the EbsBlockDeviceConfigProperty as JSON
   *
   * @param property
   */
  export function EbsBlockDeviceConfigPropertyToJson(property: EbsBlockDeviceConfigProperty) {
    return {
      VolumeSpecification: {
        Iops: cdk.numberToCloudFormation(property.iops),
        SizeInGB: cdk.numberToCloudFormation(property.sizeInGB),
        VolumeType: cdk.stringToCloudFormation(property.volumeType.valueOf())
      },
      VolumesPerInstance: cdk.numberToCloudFormation(property.volumesPerInstance)
    };
  }

  /**
   * The Amazon EBS configuration of a cluster instance.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_EbsConfiguration.html
   *
   * @experimental
   */
  export interface EbsConfigurationProperty {
    /**
     * An array of Amazon EBS volume specifications attached to a cluster instance.
     */
    readonly ebsBlockDeviceConfigs?: EbsBlockDeviceConfigProperty[];

    /**
     * Indicates whether an Amazon EBS volume is EBS-optimized.
     */
    readonly ebsOptimized?: boolean;
  }

  /**
   * Render the EbsConfigurationProperty to JSON
   *
   * @param property
   */
  export function EbsConfigurationPropertyToJson(property: EbsConfigurationProperty) {
    return {
      EbsBlockDeviceConfigs: cdk.listMapper(EbsBlockDeviceConfigPropertyToJson)(property.ebsBlockDeviceConfigs),
      EbsOptimized: cdk.booleanToCloudFormation(property.ebsOptimized)
    };
  }

  /**
   * An instance type configuration for each instance type in an instance fleet, which determines the EC2 instances Amazon EMR attempts to
   * provision to fulfill On-Demand and Spot target capacities.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceTypeConfig.html
   *
   * @experimental
   */
  export interface InstanceTypeConfigProperty {
    /**
     * The bid price for each EC2 Spot instance type as defined by InstanceType. Expressed in USD.
     */
    readonly bidPrice?: string;

    /**
     * The bid price, as a percentage of On-Demand price.
     */
    readonly bidPriceAsPercentageOfOnDemandPrice?: number;

    /**
     * A configuration classification that applies when provisioning cluster instances, which can include configurations for applications
     * and software that run on the cluster.
     */
    readonly configurations?: ConfigurationProperty[];

    /**
     * The configuration of Amazon Elastic Block Storage (EBS) attached to each instance as defined by InstanceType.
     */
    readonly ebsConfiguration?: EbsConfigurationProperty;

    /**
     * An EC2 instance type
     */
    readonly instanceType: string;

    /**
     * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined
     * in the InstanceFleetConfig.
     */
    readonly weightedCapacity?: number;
  }

  /**
   * Render the InstanceTypeConfigProperty to JSON]
   *
   * @param property
   */
  export function InstanceTypeConfigPropertyToJson(property: InstanceTypeConfigProperty) {
    return {
      BidPrice: cdk.stringToCloudFormation(property.bidPrice),
      BidPriceAsPercentageOfOnDemandPrice: cdk.numberToCloudFormation(property.bidPriceAsPercentageOfOnDemandPrice),
      Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations),
      EbsConfiguration: (property.ebsConfiguration === undefined) ?
        property.ebsConfiguration :
        EbsConfigurationPropertyToJson(property.ebsConfiguration),
      InstanceType: cdk.stringToCloudFormation(property.instanceType.valueOf()),
      WeightedCapacity: cdk.numberToCloudFormation(property.weightedCapacity)
    };
  }

  /**
   * Spot Timeout Actions
   *
   * @experimental
   */
  export enum SpotTimeoutAction {
    SWITCH_TO_ON_DEMAND = 'SWITCH_TO_ON_DEMAND',
    TERMINATE_CLUSTER = 'TERMINATE_CLUSTER'
  }

  /**
   * The launch specification for Spot instances in the fleet, which determines the defined duration and provisioning timeout behavior.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_SpotProvisioningSpecification.html
   *
   * @experimental
   */
  export interface SpotProvisioningSpecificationProperty {
    /**
     * The defined duration for Spot instances (also known as Spot blocks) in minutes.
     */
    readonly blockDurationMinutes?: number;

    /**
     * The action to take when TargetSpotCapacity has not been fulfilled when the TimeoutDurationMinutes has expired
     */
    readonly timeoutAction: SpotTimeoutAction;

    /**
     * The spot provisioning timeout period in minutes.
     */
    readonly timeoutDurationMinutes: number;
  }

  /**
   * Render the SpotProvisioningSpecificationProperty to JSON
   *
   * @param property
   */
  export function SpotProvisioningSpecificationPropertyToJson(property: SpotProvisioningSpecificationProperty) {
    return {
      SpotSpecification: {
        BlockDurationMinutes: cdk.numberToCloudFormation(property.blockDurationMinutes),
        TimeoutAction: cdk.stringToCloudFormation(property.timeoutAction.valueOf()),
        TimeoutDurationMinutes: cdk.numberToCloudFormation(property.timeoutDurationMinutes)
      }
    };
  }

  /**
   * The configuration that defines an instance fleet.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceFleetConfig.html
   *
   * @experimental
   */
  export interface InstanceFleetConfigProperty {
    /**
     * The node type that the instance fleet hosts. Valid values are MASTER,CORE,and TASK.
     */
    readonly instanceFleeType: InstanceRoleType;

    /**
     * The instance type configurations that define the EC2 instances in the instance fleet.
     */
    readonly instanceTypeConfigs?: InstanceTypeConfigProperty[];

    /**
     * The launch specification for the instance fleet.
     */
    readonly launchSpecifications?: SpotProvisioningSpecificationProperty;

    /**
     * The friendly name of the instance fleet.
     */
    readonly name?: string;

    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision.
     */
    readonly targetOnDemandCapacity?: number;

    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision
     */
    readonly targetSpotCapacity?: number;
  }

  /**
   * Render the InstanceFleetConfigProperty as JSON
   *
   * @param property
   */
  export function InstanceFleetConfigPropertyToJson(property: InstanceFleetConfigProperty) {
    return {
      InstanceFleetType: cdk.stringToCloudFormation(property.instanceFleeType.valueOf()),
      InstanceTypeConfigs: cdk.listMapper(InstanceTypeConfigPropertyToJson)(property.instanceTypeConfigs),
      LaunchSpecifications: (property.launchSpecifications === undefined) ?
        property.launchSpecifications :
        SpotProvisioningSpecificationPropertyToJson(property.launchSpecifications),
      Name: cdk.stringToCloudFormation(property.name),
      TargetOnDemandCapacity: cdk.numberToCloudFormation(property.targetOnDemandCapacity),
      TargetSpotCapacity: cdk.numberToCloudFormation(property.targetSpotCapacity)
    };
  }

  /**
   * The Amazon EC2 Availability Zone configuration of the cluster (job flow).
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_PlacementType.html
   */
  export interface PlacementTypeProperty {
    /**
     * The Amazon EC2 Availability Zone for the cluster. AvailabilityZone is used for uniform instance groups, while AvailabilityZones
     * (plural) is used for instance fleets.
     */
    readonly availabilityZone?: string;

    /**
     * When multiple Availability Zones are specified, Amazon EMR evaluates them and launches instances in the optimal Availability Zone.
     * AvailabilityZones is used for instance fleets, while AvailabilityZone (singular) is used for uniform instance groups.
     */
    readonly availabilityZones?: string[];
  }

  /**
   * Render the PlacementTypeProperty to JSON
   *
   * @param property
   */
  export function PlacementTypePropertyToJson(property: PlacementTypeProperty) {
    return {
      AvailabilityZone: cdk.stringToCloudFormation(property.availabilityZone),
      AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(property.availabilityZones)
    };
  }

  /**
   * A specification of the number and type of Amazon EC2 instances.
   *
   * See the RunJobFlow API for complete documentation on input parameters
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_JobFlowInstancesConfig.html
   *
   * @experimental
   */
  export interface InstancesConfigProperty {
    /**
     * A list of additional Amazon EC2 security group IDs for the master node.
     */
    readonly additionalMasterSecurityGroups?: string[];

    /**
     * A list of additional Amazon EC2 security group IDs for the core and task nodes.
     */
    readonly additionalSlaveSecurityGroups?: string[];

    /**
     * The name of the EC2 key pair that can be used to ssh to the master node as the user called "hadoop."
     */
    readonly ec2KeyName?: string;

    /**
     * Applies to clusters that use the uniform instance group configuration. To launch the cluster in Amazon Virtual Private Cloud (Amazon VPC),
     * set this parameter to the identifier of the Amazon VPC subnet where you want the cluster to launch.
     */
    readonly ec2SubnetId?: string;

    /**
     * Applies to clusters that use the instance fleet configuration. When multiple EC2 subnet IDs are specified, Amazon EMR evaluates them and
     * launches instances in the optimal subnet.
     */
    readonly ec2SubnetIds?: string[];

    /**
     * The identifier of the Amazon EC2 security group for the master node.
     */
    readonly emrManagedMasterSecurityGroup?: string;

    /**
     * The identifier of the Amazon EC2 security group for the core and task nodes.
     */
    readonly emrManagedSlaveSecurityGroup?: string;

    /**
     * Applies only to Amazon EMR release versions earlier than 4.0. The Hadoop version for the cluster.
     */
    readonly hadoopVersion?: string;

    /**
     * The number of EC2 instances in the cluster.
     */
    readonly instanceCount?: number;

    /**
     * Describes the EC2 instances and instance configurations for clusters that use the instance fleet configuration.
     */
    readonly instanceFleets?: InstanceFleetConfigProperty[];

    /**
     * Configuration for the instance groups in a cluster.
     */
    // readonly instanceGroups?: InstanceGroupConfigProperty[];

    /**
     * The EC2 instance type of the master node.
     */
    readonly masterInstanceType?: string;

    /**
     * The Availability Zone in which the cluster runs.
     */
    readonly placement?: PlacementTypeProperty;

    /**
     * The identifier of the Amazon EC2 security group for the Amazon EMR service to access clusters in VPC private subnets.
     */
    readonly serviceAccessSecurityGroup?: string;

    /**
     * The EC2 instance type of the core and task nodes.
     */
    readonly slaveInstanceType?: string;

    /**
     * Specifies whether to lock the cluster to prevent the Amazon EC2 instances from being terminated by API call, user intervention,
     * or in the event of a job-flow error.
     */
    readonly terminationProtected?: boolean;
  }

  /**
   * Render the InstancesConfigProperty to JSON
   *
   * @param property
   */
  export function InstancesConfigPropertyToJson(property: InstancesConfigProperty) {
    return {
      AdditionalMasterSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(property.additionalMasterSecurityGroups),
      AdditionalSlaveSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(property.additionalSlaveSecurityGroups),
      Ec2KeyName: cdk.stringToCloudFormation(property.ec2KeyName),
      Ec2SubnetId: cdk.stringToCloudFormation(property.ec2SubnetId),
      Ec2SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(property.ec2SubnetIds),
      EmrManagedMasterSecurityGroup: cdk.stringToCloudFormation(property.emrManagedMasterSecurityGroup),
      EmrManagedSlaveSecurityGroup: cdk.stringToCloudFormation(property.emrManagedSlaveSecurityGroup),
      HadoopVersion: cdk.stringToCloudFormation(property.hadoopVersion),
      InstanceCount: cdk.numberToCloudFormation(property.instanceCount),
      InstanceFleets: cdk.listMapper(InstanceFleetConfigPropertyToJson)(property.instanceFleets),
      InstanceGroups: undefined,
      KeepJobFlowAliveWhenNoSteps: true,
      MasterInstanceType: cdk.stringToCloudFormation(property.masterInstanceType),
      Placement: (property.placement === undefined) ?
        property.placement :
        PlacementTypePropertyToJson(property.placement),
      ServiceAccessSecurityGroup: cdk.stringToCloudFormation(property.serviceAccessSecurityGroup),
      SlaveInstanceType: cdk.stringToCloudFormation(property.slaveInstanceType),
      TerminationProtected: cdk.booleanToCloudFormation(property.terminationProtected)
    };
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

  /**
   * Render the ApplicationConfigProperty as JSON
   *
   * @param property
   */
  export function ApplicationConfigPropertyToJson(property: ApplicationConfigProperty) {
    return {
      Name: cdk.stringToCloudFormation(property.name),
      Args: cdk.listMapper(cdk.stringToCloudFormation)(property.args),
      Version: cdk.stringToCloudFormation(property.version),
      AdditionalInfo: cdk.objectToCloudFormation(property.additionalInfo)
    };
  }

  /**
   * Configuration of a bootstrap action.
   *
   * See the RunJobFlow API for complete documentation on input parameters
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_BootstrapActionConfig.html
   *
   * @experimental
   */
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

  /**
   * Render the BootstrapActionProperty as JSON
   *
   * @param property
   */
  export function BootstrapActionConfigToJson(property: BootstrapActionConfigProperty) {
    return {
      Name: cdk.stringToCloudFormation(property.name),
      ScriptBootstrapAction: {
        Path: cdk.stringToCloudFormation(property.path),
        Args: cdk.listMapper(cdk.stringToCloudFormation)(property.args)
      }
    };
  }

  /**
   * An optional configuration specification to be used when provisioning cluster instances, which can include configurations for
   * applications and software bundled with Amazon EMR.
   *
   * See the RunJobFlow API for complete documentation on input parameters
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_Configuration.html
   *
   * @experimental
   */
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

  /**
   * Render the ConfigurationProperty as JSON
   *
   * @param property
   */
  export function ConfigurationPropertyToJson(property: ConfigurationProperty) {
    return {
      Classification: cdk.stringToCloudFormation(property.classification),
      Properties: cdk.objectToCloudFormation(property.properties),
      Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations)
    };
  }

  /**
   * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration.
   *
   * See the RunJobFlow API for complete documentation on input parameters
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_KerberosAttributes.html
   *
   * @experimental
   */
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

  /**
   * Render the KerberosAttributesProperty as JSON
   *
   * @param property
   */
  export function KerberosAttributesPropertyToJson(property: KerberosAttributesProperty) {
    return {
      ADDomainJoinPassword: cdk.stringToCloudFormation(property.adDomainJoinPassword),
      ADDomainJoinUser: cdk.stringToCloudFormation(property.adDomainJoinUser),
      CrossRealmTrustPrincipalPassword: cdk.stringToCloudFormation(property.crossRealmTrustPrincipalPassword),
      KdcAdminPassword: cdk.stringToCloudFormation(property.kdcAdminPassword),
      Realm: cdk.stringToCloudFormation(property.realm)
    };
  }
}