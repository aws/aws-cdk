/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::EMR::Cluster` resource specifies an Amazon EMR cluster.
 *
 * This cluster is a collection of Amazon EC2 instances that run open source big data frameworks and applications to process and analyze vast amounts of data. For more information, see the [Amazon EMR Management Guide](https://docs.aws.amazon.com//emr/latest/ManagementGuide/) .
 *
 * Amazon EMR now supports launching task instance groups and task instance fleets as part of the `AWS::EMR::Cluster` resource. This can be done by using the `JobFlowInstancesConfig` property type's `TaskInstanceGroups` and `TaskInstanceFleets` subproperties. Using these subproperties reduces delays in provisioning task nodes compared to specifying task nodes with the `AWS::EMR::InstanceGroupConfig` and `AWS::EMR::InstanceFleetConfig` resources. Please refer to the examples at the bottom of this page to learn how to use these subproperties.
 *
 * @cloudformationResource AWS::EMR::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::Cluster";

  /**
   * Build a CfnCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the cluster.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The public DNS name of the master node (instance), such as `ec2-12-123-123-123.us-west-2.compute.amazonaws.com` .
   *
   * @cloudformationAttribute MasterPublicDNS
   */
  public readonly attrMasterPublicDns: string;

  /**
   * A JSON string for selecting additional features.
   */
  public additionalInfo?: any | cdk.IResolvable;

  /**
   * The applications to install on this cluster, for example, Spark, Flink, Oozie, Zeppelin, and so on.
   */
  public applications?: Array<CfnCluster.ApplicationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An IAM role for automatic scaling policies.
   */
  public autoScalingRole?: string;

  /**
   * An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates.
   */
  public autoTerminationPolicy?: CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable;

  /**
   * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
   */
  public bootstrapActions?: Array<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Applies only to Amazon EMR releases 4.x and later. The list of configurations that are supplied to the Amazon EMR cluster.
   */
  public configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Available only in Amazon EMR releases 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI if the cluster uses a custom AMI.
   */
  public customAmiId?: string;

  /**
   * The IOPS, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   */
  public ebsRootVolumeIops?: number;

  /**
   * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   */
  public ebsRootVolumeSize?: number;

  /**
   * The throughput, in MiB/s, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   */
  public ebsRootVolumeThroughput?: number;

  /**
   * A specification of the number and type of Amazon EC2 instances.
   */
  public instances: cdk.IResolvable | CfnCluster.JobFlowInstancesConfigProperty;

  /**
   * Also called instance profile and Amazon EC2 role.
   */
  public jobFlowRole: string;

  /**
   * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration.
   */
  public kerberosAttributes?: cdk.IResolvable | CfnCluster.KerberosAttributesProperty;

  /**
   * The AWS KMS key used for encrypting log files.
   */
  public logEncryptionKmsKeyId?: string;

  /**
   * The path to the Amazon S3 location where logs for this cluster are stored.
   */
  public logUri?: string;

  /**
   * Creates or updates a managed scaling policy for an Amazon EMR cluster.
   */
  public managedScalingPolicy?: cdk.IResolvable | CfnCluster.ManagedScalingPolicyProperty;

  /**
   * The name of the cluster.
   */
  public name: string;

  /**
   * The Amazon Linux release specified in a cluster launch RunJobFlow request.
   */
  public osReleaseLabel?: string;

  public placementGroupConfigs?: Array<cdk.IResolvable | CfnCluster.PlacementGroupConfigProperty> | cdk.IResolvable;

  /**
   * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster.
   */
  public releaseLabel?: string;

  /**
   * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized.
   */
  public scaleDownBehavior?: string;

  /**
   * The name of the security configuration applied to the cluster.
   */
  public securityConfiguration?: string;

  /**
   * The IAM role that Amazon EMR assumes in order to access AWS resources on your behalf.
   */
  public serviceRole: string;

  /**
   * Specifies the number of steps that can be executed concurrently.
   */
  public stepConcurrencyLevel?: number;

  /**
   * A list of steps to run.
   */
  public steps?: Array<cdk.IResolvable | CfnCluster.StepConfigProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags associated with a cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the cluster is visible to all IAM users of the AWS account associated with the cluster.
   */
  public visibleToAllUsers?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
    super(scope, id, {
      "type": CfnCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instances", this);
    cdk.requireProperty(props, "jobFlowRole", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "serviceRole", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMasterPublicDns = cdk.Token.asString(this.getAtt("MasterPublicDNS", cdk.ResolutionTypeHint.STRING));
    this.additionalInfo = props.additionalInfo;
    this.applications = props.applications;
    this.autoScalingRole = props.autoScalingRole;
    this.autoTerminationPolicy = props.autoTerminationPolicy;
    this.bootstrapActions = props.bootstrapActions;
    this.configurations = props.configurations;
    this.customAmiId = props.customAmiId;
    this.ebsRootVolumeIops = props.ebsRootVolumeIops;
    this.ebsRootVolumeSize = props.ebsRootVolumeSize;
    this.ebsRootVolumeThroughput = props.ebsRootVolumeThroughput;
    this.instances = props.instances;
    this.jobFlowRole = props.jobFlowRole;
    this.kerberosAttributes = props.kerberosAttributes;
    this.logEncryptionKmsKeyId = props.logEncryptionKmsKeyId;
    this.logUri = props.logUri;
    this.managedScalingPolicy = props.managedScalingPolicy;
    this.name = props.name;
    this.osReleaseLabel = props.osReleaseLabel;
    this.placementGroupConfigs = props.placementGroupConfigs;
    this.releaseLabel = props.releaseLabel;
    this.scaleDownBehavior = props.scaleDownBehavior;
    this.securityConfiguration = props.securityConfiguration;
    this.serviceRole = props.serviceRole;
    this.stepConcurrencyLevel = props.stepConcurrencyLevel;
    this.steps = props.steps;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMR::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.visibleToAllUsers = props.visibleToAllUsers;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::EMR::Cluster' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalInfo": this.additionalInfo,
      "applications": this.applications,
      "autoScalingRole": this.autoScalingRole,
      "autoTerminationPolicy": this.autoTerminationPolicy,
      "bootstrapActions": this.bootstrapActions,
      "configurations": this.configurations,
      "customAmiId": this.customAmiId,
      "ebsRootVolumeIops": this.ebsRootVolumeIops,
      "ebsRootVolumeSize": this.ebsRootVolumeSize,
      "ebsRootVolumeThroughput": this.ebsRootVolumeThroughput,
      "instances": this.instances,
      "jobFlowRole": this.jobFlowRole,
      "kerberosAttributes": this.kerberosAttributes,
      "logEncryptionKmsKeyId": this.logEncryptionKmsKeyId,
      "logUri": this.logUri,
      "managedScalingPolicy": this.managedScalingPolicy,
      "name": this.name,
      "osReleaseLabel": this.osReleaseLabel,
      "placementGroupConfigs": this.placementGroupConfigs,
      "releaseLabel": this.releaseLabel,
      "scaleDownBehavior": this.scaleDownBehavior,
      "securityConfiguration": this.securityConfiguration,
      "serviceRole": this.serviceRole,
      "stepConcurrencyLevel": this.stepConcurrencyLevel,
      "steps": this.steps,
      "tags": this.tags.renderTags(),
      "visibleToAllUsers": this.visibleToAllUsers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPropsToCloudFormation(props);
  }
}

export namespace CfnCluster {
  /**
   * `Application` is a property of `AWS::EMR::Cluster` .
   *
   * The `Application` property type defines the open-source big data applications for EMR to install and configure when a cluster is created.
   *
   * With Amazon EMR release version 4.0 and later, the only accepted parameter is the application `Name` . To pass arguments to these applications, you use configuration classifications specified using JSON objects in a `Configuration` property. For more information, see [Configuring Applications](https://docs.aws.amazon.com//emr/latest/ReleaseGuide/emr-configure-apps.html) .
   *
   * With earlier Amazon EMR releases, the application is any AWS or third-party software that you can add to the cluster. You can specify the version of the application and arguments to pass to it. Amazon EMR accepts and forwards the argument list to the corresponding installation script as a bootstrap action argument.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-application.html
   */
  export interface ApplicationProperty {
    /**
     * This option is for advanced users only.
     *
     * This is meta information about clusters and applications that are used for testing and troubleshooting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-application.html#cfn-emr-cluster-application-additionalinfo
     */
    readonly additionalInfo?: cdk.IResolvable | Record<string, string>;

    /**
     * Arguments for Amazon EMR to pass to the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-application.html#cfn-emr-cluster-application-args
     */
    readonly args?: Array<string>;

    /**
     * The name of the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-application.html#cfn-emr-cluster-application-name
     */
    readonly name?: string;

    /**
     * The version of the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-application.html#cfn-emr-cluster-application-version
     */
    readonly version?: string;
  }

  /**
   * An auto-termination policy for an Amazon EMR cluster.
   *
   * An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates. For alternative cluster termination options, see [Control cluster termination](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-termination.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-autoterminationpolicy.html
   */
  export interface AutoTerminationPolicyProperty {
    /**
     * Specifies the amount of idle time in seconds after which the cluster automatically terminates.
     *
     * You can specify a minimum of 60 seconds and a maximum of 604800 seconds (seven days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-autoterminationpolicy.html#cfn-emr-cluster-autoterminationpolicy-idletimeout
     */
    readonly idleTimeout?: number;
  }

  /**
   * `BootstrapActionConfig` is a property of `AWS::EMR::Cluster` that can be used to run bootstrap actions on EMR clusters.
   *
   * You can use a bootstrap action to install software and configure EC2 instances for all cluster nodes before EMR installs and configures open-source big data applications on cluster instances. For more information, see [Create Bootstrap Actions to Install Additional Software](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-plan-bootstrap.html) in the *Amazon EMR Management Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-bootstrapactionconfig.html
   */
  export interface BootstrapActionConfigProperty {
    /**
     * The name of the bootstrap action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-bootstrapactionconfig.html#cfn-emr-cluster-bootstrapactionconfig-name
     */
    readonly name: string;

    /**
     * The script run by the bootstrap action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-bootstrapactionconfig.html#cfn-emr-cluster-bootstrapactionconfig-scriptbootstrapaction
     */
    readonly scriptBootstrapAction: cdk.IResolvable | CfnCluster.ScriptBootstrapActionConfigProperty;
  }

  /**
   * `ScriptBootstrapActionConfig` is a subproperty of the `BootstrapActionConfig` property type.
   *
   * `ScriptBootstrapActionConfig` specifies the arguments and location of the bootstrap script for EMR to run on all cluster nodes before it installs open-source big data applications on them.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scriptbootstrapactionconfig.html
   */
  export interface ScriptBootstrapActionConfigProperty {
    /**
     * A list of command line arguments to pass to the bootstrap action script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scriptbootstrapactionconfig.html#cfn-emr-cluster-scriptbootstrapactionconfig-args
     */
    readonly args?: Array<string>;

    /**
     * Location in Amazon S3 of the script to run during a bootstrap action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scriptbootstrapactionconfig.html#cfn-emr-cluster-scriptbootstrapactionconfig-path
     */
    readonly path: string;
  }

  /**
   * > Used only with Amazon EMR release 4.0 and later.
   *
   * `Configuration` is a subproperty of `InstanceFleetConfig` or `InstanceGroupConfig` . `Configuration` specifies optional configurations for customizing open-source big data applications and environment parameters. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) in the *Amazon EMR Release Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html
   */
  export interface ConfigurationProperty {
    /**
     * The classification within a configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-classification
     */
    readonly classification?: string;

    /**
     * A list of additional configurations to apply within a configuration object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-configurationproperties
     */
    readonly configurationProperties?: cdk.IResolvable | Record<string, string>;

    /**
     * A list of additional configurations to apply within a configuration object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-configuration.html#cfn-emr-cluster-configuration-configurations
     */
    readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * `JobFlowInstancesConfig` is a property of the `AWS::EMR::Cluster` resource.
   *
   * `JobFlowInstancesConfig` defines the instance groups or instance fleets that comprise the cluster. `JobFlowInstancesConfig` must contain either `InstanceFleetConfig` or `InstanceGroupConfig` . They cannot be used together.
   *
   * You can now define task instance groups or task instance fleets using the `TaskInstanceGroups` and `TaskInstanceFleets` subproperties. Using these subproperties reduces delays in provisioning task nodes compared to specifying task nodes with the `InstanceFleetConfig` and `InstanceGroupConfig` resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html
   */
  export interface JobFlowInstancesConfigProperty {
    /**
     * A list of additional Amazon EC2 security group IDs for the master node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-additionalmastersecuritygroups
     */
    readonly additionalMasterSecurityGroups?: Array<string>;

    /**
     * A list of additional Amazon EC2 security group IDs for the core and task nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-additionalslavesecuritygroups
     */
    readonly additionalSlaveSecurityGroups?: Array<string>;

    /**
     * Describes the EC2 instances and instance configurations for the core instance fleet when using clusters with the instance fleet configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-coreinstancefleet
     */
    readonly coreInstanceFleet?: CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable;

    /**
     * Describes the EC2 instances and instance configurations for core instance groups when using clusters with the uniform instance group configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-coreinstancegroup
     */
    readonly coreInstanceGroup?: CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable;

    /**
     * The name of the Amazon EC2 key pair that can be used to connect to the master node using SSH as the user called "hadoop.".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-ec2keyname
     */
    readonly ec2KeyName?: string;

    /**
     * Applies to clusters that use the uniform instance group configuration.
     *
     * To launch the cluster in Amazon Virtual Private Cloud (Amazon VPC), set this parameter to the identifier of the Amazon VPC subnet where you want the cluster to launch. If you do not specify this value and your account supports EC2-Classic, the cluster launches in EC2-Classic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-ec2subnetid
     */
    readonly ec2SubnetId?: string;

    /**
     * Applies to clusters that use the instance fleet configuration.
     *
     * When multiple Amazon EC2 subnet IDs are specified, Amazon EMR evaluates them and launches instances in the optimal subnet.
     *
     * > The instance fleet configuration is available only in Amazon EMR releases 4.8.0 and later, excluding 5.0.x versions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-ec2subnetids
     */
    readonly ec2SubnetIds?: Array<string>;

    /**
     * The identifier of the Amazon EC2 security group for the master node.
     *
     * If you specify `EmrManagedMasterSecurityGroup` , you must also specify `EmrManagedSlaveSecurityGroup` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-emrmanagedmastersecuritygroup
     */
    readonly emrManagedMasterSecurityGroup?: string;

    /**
     * The identifier of the Amazon EC2 security group for the core and task nodes.
     *
     * If you specify `EmrManagedSlaveSecurityGroup` , you must also specify `EmrManagedMasterSecurityGroup` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-emrmanagedslavesecuritygroup
     */
    readonly emrManagedSlaveSecurityGroup?: string;

    /**
     * Applies only to Amazon EMR release versions earlier than 4.0. The Hadoop version for the cluster. Valid inputs are "0.18" (no longer maintained), "0.20" (no longer maintained), "0.20.205" (no longer maintained), "1.0.3", "2.2.0", or "2.4.0". If you do not set this value, the default of 0.18 is used, unless the `AmiVersion` parameter is set in the RunJobFlow call, in which case the default version of Hadoop for that AMI version is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-hadoopversion
     */
    readonly hadoopVersion?: string;

    /**
     * Specifies whether the cluster should remain available after completing all steps.
     *
     * Defaults to `true` . For more information about configuring cluster termination, see [Control Cluster Termination](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-termination.html) in the *EMR Management Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-keepjobflowalivewhennosteps
     */
    readonly keepJobFlowAliveWhenNoSteps?: boolean | cdk.IResolvable;

    /**
     * Describes the EC2 instances and instance configurations for the master instance fleet when using clusters with the instance fleet configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-masterinstancefleet
     */
    readonly masterInstanceFleet?: CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable;

    /**
     * Describes the EC2 instances and instance configurations for the master instance group when using clusters with the uniform instance group configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-masterinstancegroup
     */
    readonly masterInstanceGroup?: CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable;

    /**
     * The Availability Zone in which the cluster runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-placement
     */
    readonly placement?: cdk.IResolvable | CfnCluster.PlacementTypeProperty;

    /**
     * The identifier of the Amazon EC2 security group for the Amazon EMR service to access clusters in VPC private subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-serviceaccesssecuritygroup
     */
    readonly serviceAccessSecurityGroup?: string;

    /**
     * Describes the EC2 instances and instance configurations for the task instance fleets when using clusters with the instance fleet configuration.
     *
     * These task instance fleets are added to the cluster as part of the cluster launch. Each task instance fleet must have a unique name specified so that CloudFormation can differentiate between the task instance fleets.
     *
     * > You can currently specify only one task instance fleet for a cluster. After creating the cluster, you can only modify the mutable properties of `InstanceFleetConfig` , which are `TargetOnDemandCapacity` and `TargetSpotCapacity` . Modifying any other property results in cluster replacement. > To allow a maximum of 30 Amazon EC2 instance types per fleet, include `TaskInstanceFleets` when you create your cluster. If you create your cluster without `TaskInstanceFleets` , Amazon EMR uses its default allocation strategy, which allows for a maximum of five Amazon EC2 instance types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-taskinstancefleets
     */
    readonly taskInstanceFleets?: Array<CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Describes the EC2 instances and instance configurations for task instance groups when using clusters with the uniform instance group configuration.
     *
     * These task instance groups are added to the cluster as part of the cluster launch. Each task instance group must have a unique name specified so that CloudFormation can differentiate between the task instance groups.
     *
     * > After creating the cluster, you can only modify the mutable properties of `InstanceGroupConfig` , which are `AutoScalingPolicy` and `InstanceCount` . Modifying any other property results in cluster replacement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-taskinstancegroups
     */
    readonly taskInstanceGroups?: Array<CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether to lock the cluster to prevent the Amazon EC2 instances from being terminated by API call, user intervention, or in the event of a job-flow error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig.html#cfn-emr-cluster-jobflowinstancesconfig-terminationprotected
     */
    readonly terminationProtected?: boolean | cdk.IResolvable;
  }

  /**
   * Use `InstanceFleetConfig` to define instance fleets for an EMR cluster.
   *
   * A cluster can not use both instance fleets and instance groups. For more information, see [Configure Instance Fleets](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html
   */
  export interface InstanceFleetConfigProperty {
    /**
     * The instance type configurations that define the Amazon EC2 instances in the instance fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html#cfn-emr-cluster-instancefleetconfig-instancetypeconfigs
     */
    readonly instanceTypeConfigs?: Array<CfnCluster.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The launch specification for the instance fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html#cfn-emr-cluster-instancefleetconfig-launchspecifications
     */
    readonly launchSpecifications?: CfnCluster.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable;

    /**
     * The friendly name of the instance fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html#cfn-emr-cluster-instancefleetconfig-name
     */
    readonly name?: string;

    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision.
     *
     * When the instance fleet launches, Amazon EMR tries to provision On-Demand instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When an On-Demand instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only Spot instances are provisioned for the instance fleet using `TargetSpotCapacity` . At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html#cfn-emr-cluster-instancefleetconfig-targetondemandcapacity
     */
    readonly targetOnDemandCapacity?: number;

    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision.
     *
     * When the instance fleet launches, Amazon EMR tries to provision Spot instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When a Spot instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
     *
     * > If not specified or set to 0, only On-Demand instances are provisioned for the instance fleet. At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetconfig.html#cfn-emr-cluster-instancefleetconfig-targetspotcapacity
     */
    readonly targetSpotCapacity?: number;
  }

  /**
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * `InstanceTypeConfig` is a sub-property of `InstanceFleetConfig` . `InstanceTypeConfig` determines the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html
   */
  export interface InstanceTypeConfigProperty {
    /**
     * The bid price for each Amazon EC2 Spot Instance type as defined by `InstanceType` .
     *
     * Expressed in USD. If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-bidprice
     */
    readonly bidPrice?: string;

    /**
     * The bid price, as a percentage of On-Demand price, for each Amazon EC2 Spot Instance as defined by `InstanceType` .
     *
     * Expressed as a number (for example, 20 specifies 20%). If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-bidpriceaspercentageofondemandprice
     */
    readonly bidPriceAsPercentageOfOnDemandPrice?: number;

    /**
     * A configuration classification that applies when provisioning cluster instances, which can include configurations for applications and software that run on the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-configurations
     */
    readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The custom AMI ID to use for the instance type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-customamiid
     */
    readonly customAmiId?: string;

    /**
     * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by `InstanceType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-ebsconfiguration
     */
    readonly ebsConfiguration?: CfnCluster.EbsConfigurationProperty | cdk.IResolvable;

    /**
     * An Amazon EC2 instance type, such as `m3.xlarge` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-instancetype
     */
    readonly instanceType: string;

    /**
     * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in `InstanceFleetConfig` .
     *
     * This value is 1 for a master instance fleet, and must be 1 or greater for core and task instance fleets. Defaults to 1 if not specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancetypeconfig.html#cfn-emr-cluster-instancetypeconfig-weightedcapacity
     */
    readonly weightedCapacity?: number;
  }

  /**
   * `EbsConfiguration` is a subproperty of `InstanceFleetConfig` or `InstanceGroupConfig` .
   *
   * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsconfiguration.html
   */
  export interface EbsConfigurationProperty {
    /**
     * An array of Amazon EBS volume specifications attached to a cluster instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsconfiguration.html#cfn-emr-cluster-ebsconfiguration-ebsblockdeviceconfigs
     */
    readonly ebsBlockDeviceConfigs?: Array<CfnCluster.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether an Amazon EBS volume is EBS-optimized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsconfiguration.html#cfn-emr-cluster-ebsconfiguration-ebsoptimized
     */
    readonly ebsOptimized?: boolean | cdk.IResolvable;
  }

  /**
   * `EbsBlockDeviceConfig` is a subproperty of the `EbsConfiguration` property type.
   *
   * `EbsBlockDeviceConfig` defines the number and type of EBS volumes to associate with all EC2 instances in an EMR cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsblockdeviceconfig.html
   */
  export interface EbsBlockDeviceConfigProperty {
    /**
     * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an Amazon EC2 instance in the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsblockdeviceconfig.html#cfn-emr-cluster-ebsblockdeviceconfig-volumespecification
     */
    readonly volumeSpecification: cdk.IResolvable | CfnCluster.VolumeSpecificationProperty;

    /**
     * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ebsblockdeviceconfig.html#cfn-emr-cluster-ebsblockdeviceconfig-volumesperinstance
     */
    readonly volumesPerInstance?: number;
  }

  /**
   * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type.
   *
   * `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-volumespecification.html
   */
  export interface VolumeSpecificationProperty {
    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-volumespecification.html#cfn-emr-cluster-volumespecification-iops
     */
    readonly iops?: number;

    /**
     * The volume size, in gibibytes (GiB).
     *
     * This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-volumespecification.html#cfn-emr-cluster-volumespecification-sizeingb
     */
    readonly sizeInGb: number;

    /**
     * The throughput, in mebibyte per second (MiB/s).
     *
     * This optional parameter can be a number from 125 - 1000 and is valid only for gp3 volumes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-volumespecification.html#cfn-emr-cluster-volumespecification-throughput
     */
    readonly throughput?: number;

    /**
     * The volume type.
     *
     * Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-volumespecification.html#cfn-emr-cluster-volumespecification-volumetype
     */
    readonly volumeType: string;
  }

  /**
   * `InstanceFleetProvisioningSpecification` is a subproperty of `InstanceFleetConfig` .
   *
   * `InstanceFleetProvisioningSpecification` defines the launch specification for Spot instances in an instance fleet, which determines the defined duration and provisioning timeout behavior for Spot instances.
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetprovisioningspecifications.html
   */
  export interface InstanceFleetProvisioningSpecificationsProperty {
    /**
     * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
     *
     * > The instance fleet configuration is available only in Amazon EMR releases 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR releases 5.12.1 and later.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetprovisioningspecifications.html#cfn-emr-cluster-instancefleetprovisioningspecifications-ondemandspecification
     */
    readonly onDemandSpecification?: cdk.IResolvable | CfnCluster.OnDemandProvisioningSpecificationProperty;

    /**
     * The launch specification for Spot instances in the fleet, which determines the defined duration, provisioning timeout behavior, and allocation strategy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancefleetprovisioningspecifications.html#cfn-emr-cluster-instancefleetprovisioningspecifications-spotspecification
     */
    readonly spotSpecification?: cdk.IResolvable | CfnCluster.SpotProvisioningSpecificationProperty;
  }

  /**
   * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
   *
   * > The instance fleet configuration is available only in Amazon EMR releases 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR releases 5.12.1 and later.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ondemandprovisioningspecification.html
   */
  export interface OnDemandProvisioningSpecificationProperty {
    /**
     * Specifies the strategy to use in launching On-Demand instance fleets.
     *
     * Currently, the only option is `lowest-price` (the default), which launches the lowest price first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-ondemandprovisioningspecification.html#cfn-emr-cluster-ondemandprovisioningspecification-allocationstrategy
     */
    readonly allocationStrategy: string;
  }

  /**
   * `SpotProvisioningSpecification` is a subproperty of the `InstanceFleetProvisioningSpecifications` property type.
   *
   * `SpotProvisioningSpecification` determines the launch specification for Spot instances in the instance fleet, which includes the defined duration and provisioning timeout behavior.
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-spotprovisioningspecification.html
   */
  export interface SpotProvisioningSpecificationProperty {
    /**
     * Specifies one of the following strategies to launch Spot Instance fleets: `price-capacity-optimized` , `capacity-optimized` , `lowest-price` , or `diversified` .
     *
     * For more information on the provisioning strategies, see [Allocation strategies for Spot Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * > When you launch a Spot Instance fleet with the old console, it automatically launches with the `capacity-optimized` strategy. You can't change the allocation strategy from the old console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-spotprovisioningspecification.html#cfn-emr-cluster-spotprovisioningspecification-allocationstrategy
     */
    readonly allocationStrategy?: string;

    /**
     * The defined duration for Spot Instances (also known as Spot blocks) in minutes.
     *
     * When specified, the Spot Instance does not terminate before the defined duration expires, and defined duration pricing for Spot Instances applies. Valid values are 60, 120, 180, 240, 300, or 360. The duration period starts as soon as a Spot Instance receives its instance ID. At the end of the duration, Amazon EC2 marks the Spot Instance for termination and provides a Spot Instance termination notice, which gives the instance a two-minute warning before it terminates.
     *
     * > Spot Instances with a defined duration (also known as Spot blocks) are no longer available to new customers from July 1, 2021. For customers who have previously used the feature, we will continue to support Spot Instances with a defined duration until December 31, 2022.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-spotprovisioningspecification.html#cfn-emr-cluster-spotprovisioningspecification-blockdurationminutes
     */
    readonly blockDurationMinutes?: number;

    /**
     * The action to take when `TargetSpotCapacity` has not been fulfilled when the `TimeoutDurationMinutes` has expired;
     *
     * that is, when all Spot Instances could not be provisioned within the Spot provisioning timeout. Valid values are `TERMINATE_CLUSTER` and `SWITCH_TO_ON_DEMAND` . SWITCH_TO_ON_DEMAND specifies that if no Spot Instances are available, On-Demand Instances should be provisioned to fulfill any remaining Spot capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-spotprovisioningspecification.html#cfn-emr-cluster-spotprovisioningspecification-timeoutaction
     */
    readonly timeoutAction: string;

    /**
     * The Spot provisioning timeout period in minutes.
     *
     * If Spot Instances are not provisioned within this time period, the `TimeOutAction` is taken. Minimum value is 5 and maximum value is 1440. The timeout applies only during initial provisioning, when the cluster is first created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-spotprovisioningspecification.html#cfn-emr-cluster-spotprovisioningspecification-timeoutdurationminutes
     */
    readonly timeoutDurationMinutes: number;
  }

  /**
   * Use `InstanceGroupConfig` to define instance groups for an EMR cluster.
   *
   * A cluster can not use both instance groups and instance fleets. For more information, see [Create a Cluster with Instance Fleets or Uniform Instance Groups](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html
   */
  export interface InstanceGroupConfigProperty {
    /**
     * `AutoScalingPolicy` is a subproperty of the [InstanceGroupConfig](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-jobflowinstancesconfig-instancegroupconfig.html) property type that specifies the constraints and rules of an automatic scaling policy in Amazon EMR . The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. Only core and task instance groups can use automatic scaling policies. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-autoscalingpolicy
     */
    readonly autoScalingPolicy?: CfnCluster.AutoScalingPolicyProperty | cdk.IResolvable;

    /**
     * If specified, indicates that the instance group uses Spot Instances.
     *
     * This is the maximum price you are willing to pay for Spot Instances. Specify `OnDemandPrice` to set the amount equal to the On-Demand price, or specify an amount in USD.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-bidprice
     */
    readonly bidPrice?: string;

    /**
     * > Amazon EMR releases 4.x or later.
     *
     * The list of configurations supplied for an Amazon EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-configurations
     */
    readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The custom AMI ID to use for the provisioned instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-customamiid
     */
    readonly customAmiId?: string;

    /**
     * EBS configurations that will be attached to each Amazon EC2 instance in the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-ebsconfiguration
     */
    readonly ebsConfiguration?: CfnCluster.EbsConfigurationProperty | cdk.IResolvable;

    /**
     * Target number of instances for the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-instancecount
     */
    readonly instanceCount: number;

    /**
     * The Amazon EC2 instance type for all instances in the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-instancetype
     */
    readonly instanceType: string;

    /**
     * Market type of the Amazon EC2 instances used to create a cluster node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-market
     */
    readonly market?: string;

    /**
     * Friendly name given to the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-instancegroupconfig.html#cfn-emr-cluster-instancegroupconfig-name
     */
    readonly name?: string;
  }

  /**
   * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` .
   *
   * `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-autoscalingpolicy.html
   */
  export interface AutoScalingPolicyProperty {
    /**
     * The upper and lower Amazon EC2 instance limits for an automatic scaling policy.
     *
     * Automatic scaling activity will not cause an instance group to grow above or below these limits.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-autoscalingpolicy.html#cfn-emr-cluster-autoscalingpolicy-constraints
     */
    readonly constraints: cdk.IResolvable | CfnCluster.ScalingConstraintsProperty;

    /**
     * The scale-in and scale-out rules that comprise the automatic scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-autoscalingpolicy.html#cfn-emr-cluster-autoscalingpolicy-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnCluster.ScalingRuleProperty> | cdk.IResolvable;
  }

  /**
   * `ScalingConstraints` is a subproperty of the `AutoScalingPolicy` property type.
   *
   * `ScalingConstraints` defines the upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activities triggered by automatic scaling rules will not cause an instance group to grow above or shrink below these limits.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingconstraints.html
   */
  export interface ScalingConstraintsProperty {
    /**
     * The upper boundary of Amazon EC2 instances in an instance group beyond which scaling activities are not allowed to grow.
     *
     * Scale-out activities will not add instances beyond this boundary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingconstraints.html#cfn-emr-cluster-scalingconstraints-maxcapacity
     */
    readonly maxCapacity: number;

    /**
     * The lower boundary of Amazon EC2 instances in an instance group below which scaling activities are not allowed to shrink.
     *
     * Scale-in activities will not terminate instances below this boundary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingconstraints.html#cfn-emr-cluster-scalingconstraints-mincapacity
     */
    readonly minCapacity: number;
  }

  /**
   * `ScalingRule` is a subproperty of the `AutoScalingPolicy` property type.
   *
   * `ScalingRule` defines the scale-in or scale-out rules for scaling activity, including the CloudWatch metric alarm that triggers activity, how EC2 instances are added or removed, and the periodicity of adjustments. The automatic scaling policy for an instance group can comprise one or more automatic scaling rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingrule.html
   */
  export interface ScalingRuleProperty {
    /**
     * The conditions that trigger an automatic scaling activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingrule.html#cfn-emr-cluster-scalingrule-action
     */
    readonly action: cdk.IResolvable | CfnCluster.ScalingActionProperty;

    /**
     * A friendly, more verbose description of the automatic scaling rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingrule.html#cfn-emr-cluster-scalingrule-description
     */
    readonly description?: string;

    /**
     * The name used to identify an automatic scaling rule.
     *
     * Rule names must be unique within a scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingrule.html#cfn-emr-cluster-scalingrule-name
     */
    readonly name: string;

    /**
     * The CloudWatch alarm definition that determines when automatic scaling activity is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingrule.html#cfn-emr-cluster-scalingrule-trigger
     */
    readonly trigger: cdk.IResolvable | CfnCluster.ScalingTriggerProperty;
  }

  /**
   * `ScalingAction` is a subproperty of the `ScalingRule` property type.
   *
   * `ScalingAction` determines the type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingaction.html
   */
  export interface ScalingActionProperty {
    /**
     * Not available for instance groups.
     *
     * Instance groups use the market type specified for the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingaction.html#cfn-emr-cluster-scalingaction-market
     */
    readonly market?: string;

    /**
     * The type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingaction.html#cfn-emr-cluster-scalingaction-simplescalingpolicyconfiguration
     */
    readonly simpleScalingPolicyConfiguration: cdk.IResolvable | CfnCluster.SimpleScalingPolicyConfigurationProperty;
  }

  /**
   * `SimpleScalingPolicyConfiguration` is a subproperty of the `ScalingAction` property type.
   *
   * `SimpleScalingPolicyConfiguration` determines how an automatic scaling action adds or removes instances, the cooldown period, and the number of EC2 instances that are added each time the CloudWatch metric alarm condition is satisfied.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-simplescalingpolicyconfiguration.html
   */
  export interface SimpleScalingPolicyConfigurationProperty {
    /**
     * The way in which Amazon EC2 instances are added (if `ScalingAdjustment` is a positive number) or terminated (if `ScalingAdjustment` is a negative number) each time the scaling activity is triggered.
     *
     * `CHANGE_IN_CAPACITY` is the default. `CHANGE_IN_CAPACITY` indicates that the Amazon EC2 instance count increments or decrements by `ScalingAdjustment` , which should be expressed as an integer. `PERCENT_CHANGE_IN_CAPACITY` indicates the instance count increments or decrements by the percentage specified by `ScalingAdjustment` , which should be expressed as an integer. For example, 20 indicates an increase in 20% increments of cluster capacity. `EXACT_CAPACITY` indicates the scaling activity results in an instance group with the number of Amazon EC2 instances specified by `ScalingAdjustment` , which should be expressed as a positive integer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-simplescalingpolicyconfiguration.html#cfn-emr-cluster-simplescalingpolicyconfiguration-adjustmenttype
     */
    readonly adjustmentType?: string;

    /**
     * The amount of time, in seconds, after a scaling activity completes before any further trigger-related scaling activities can start.
     *
     * The default value is 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-simplescalingpolicyconfiguration.html#cfn-emr-cluster-simplescalingpolicyconfiguration-cooldown
     */
    readonly coolDown?: number;

    /**
     * The amount by which to scale in or scale out, based on the specified `AdjustmentType` .
     *
     * A positive value adds to the instance group's Amazon EC2 instance count while a negative number removes instances. If `AdjustmentType` is set to `EXACT_CAPACITY` , the number should only be a positive integer. If `AdjustmentType` is set to `PERCENT_CHANGE_IN_CAPACITY` , the value should express the percentage as an integer. For example, -20 indicates a decrease in 20% increments of cluster capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-simplescalingpolicyconfiguration.html#cfn-emr-cluster-simplescalingpolicyconfiguration-scalingadjustment
     */
    readonly scalingAdjustment: number;
  }

  /**
   * `ScalingTrigger` is a subproperty of the `ScalingRule` property type.
   *
   * `ScalingTrigger` determines the conditions that trigger an automatic scaling activity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingtrigger.html
   */
  export interface ScalingTriggerProperty {
    /**
     * The definition of a CloudWatch metric alarm.
     *
     * When the defined alarm conditions are met along with other trigger parameters, scaling activity begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-scalingtrigger.html#cfn-emr-cluster-scalingtrigger-cloudwatchalarmdefinition
     */
    readonly cloudWatchAlarmDefinition: CfnCluster.CloudWatchAlarmDefinitionProperty | cdk.IResolvable;
  }

  /**
   * `CloudWatchAlarmDefinition` is a subproperty of the `ScalingTrigger` property, which determines when to trigger an automatic scaling activity.
   *
   * Scaling activity begins when you satisfy the defined alarm conditions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html
   */
  export interface CloudWatchAlarmDefinitionProperty {
    /**
     * Determines how the metric specified by `MetricName` is compared to the value specified by `Threshold` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * A CloudWatch metric dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnCluster.MetricDimensionProperty> | cdk.IResolvable;

    /**
     * The number of periods, in five-minute increments, during which the alarm condition must exist before the alarm triggers automatic scaling activity.
     *
     * The default value is `1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-evaluationperiods
     */
    readonly evaluationPeriods?: number;

    /**
     * The name of the CloudWatch metric that is watched to determine an alarm condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-metricname
     */
    readonly metricName: string;

    /**
     * The namespace for the CloudWatch metric.
     *
     * The default is `AWS/ElasticMapReduce` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-namespace
     */
    readonly namespace?: string;

    /**
     * The period, in seconds, over which the statistic is applied.
     *
     * CloudWatch metrics for Amazon EMR are emitted every five minutes (300 seconds), so if you specify a CloudWatch metric, specify `300` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-period
     */
    readonly period: number;

    /**
     * The statistic to apply to the metric associated with the alarm.
     *
     * The default is `AVERAGE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-statistic
     */
    readonly statistic?: string;

    /**
     * The value against which the specified statistic is compared.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-threshold
     */
    readonly threshold: number;

    /**
     * The unit of measure associated with the CloudWatch metric being watched.
     *
     * The value specified for `Unit` must correspond to the units specified in the CloudWatch metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-cloudwatchalarmdefinition.html#cfn-emr-cluster-cloudwatchalarmdefinition-unit
     */
    readonly unit?: string;
  }

  /**
   * `MetricDimension` is a subproperty of the `CloudWatchAlarmDefinition` property type.
   *
   * `MetricDimension` specifies a CloudWatch dimension, which is specified with a `Key` `Value` pair. The key is known as a `Name` in CloudWatch. By default, Amazon EMR uses one dimension whose `Key` is `JobFlowID` and `Value` is a variable representing the cluster ID, which is `${emr.clusterId}` . This enables the automatic scaling rule for EMR to bootstrap when the cluster ID becomes available during cluster creation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * The dimension name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-metricdimension.html#cfn-emr-cluster-metricdimension-key
     */
    readonly key: string;

    /**
     * The dimension value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-metricdimension.html#cfn-emr-cluster-metricdimension-value
     */
    readonly value: string;
  }

  /**
   * `PlacementType` is a property of the `AWS::EMR::Cluster` resource.
   *
   * `PlacementType` determines the Amazon EC2 Availability Zone configuration of the cluster (job flow).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-placementtype.html
   */
  export interface PlacementTypeProperty {
    /**
     * The Amazon EC2 Availability Zone for the cluster.
     *
     * `AvailabilityZone` is used for uniform instance groups, while `AvailabilityZones` (plural) is used for instance fleets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-placementtype.html#cfn-emr-cluster-placementtype-availabilityzone
     */
    readonly availabilityZone: string;
  }

  /**
   * `KerberosAttributes` is a property of the `AWS::EMR::Cluster` resource.
   *
   * `KerberosAttributes` define the cluster-specific Kerberos configuration when Kerberos authentication is enabled using a security configuration. The cluster-specific configuration must be compatible with the security configuration. For more information see [Use Kerberos Authentication](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-kerberos.html) in the *EMR Management Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html
   */
  export interface KerberosAttributesProperty {
    /**
     * The Active Directory password for `ADDomainJoinUser` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html#cfn-emr-cluster-kerberosattributes-addomainjoinpassword
     */
    readonly adDomainJoinPassword?: string;

    /**
     * Required only when establishing a cross-realm trust with an Active Directory domain.
     *
     * A user with sufficient privileges to join resources to the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html#cfn-emr-cluster-kerberosattributes-addomainjoinuser
     */
    readonly adDomainJoinUser?: string;

    /**
     * Required only when establishing a cross-realm trust with a KDC in a different realm.
     *
     * The cross-realm principal password, which must be identical across realms.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html#cfn-emr-cluster-kerberosattributes-crossrealmtrustprincipalpassword
     */
    readonly crossRealmTrustPrincipalPassword?: string;

    /**
     * The password used within the cluster for the kadmin service on the cluster-dedicated KDC, which maintains Kerberos principals, password policies, and keytabs for the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html#cfn-emr-cluster-kerberosattributes-kdcadminpassword
     */
    readonly kdcAdminPassword: string;

    /**
     * The name of the Kerberos realm to which all nodes in a cluster belong.
     *
     * For example, `EC2.INTERNAL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-kerberosattributes.html#cfn-emr-cluster-kerberosattributes-realm
     */
    readonly realm: string;
  }

  /**
   * Managed scaling policy for an Amazon EMR cluster.
   *
   * The policy specifies the limits for resources that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-managedscalingpolicy.html
   */
  export interface ManagedScalingPolicyProperty {
    /**
     * The Amazon EC2 unit limits for a managed scaling policy.
     *
     * The managed scaling activity of a cluster is not allowed to go above or below these limits. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-managedscalingpolicy.html#cfn-emr-cluster-managedscalingpolicy-computelimits
     */
    readonly computeLimits?: CfnCluster.ComputeLimitsProperty | cdk.IResolvable;
  }

  /**
   * The Amazon EC2 unit limits for a managed scaling policy.
   *
   * The managed scaling activity of a cluster can not be above or below these limits. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html
   */
  export interface ComputeLimitsProperty {
    /**
     * The upper boundary of Amazon EC2 units.
     *
     * It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html#cfn-emr-cluster-computelimits-maximumcapacityunits
     */
    readonly maximumCapacityUnits: number;

    /**
     * The upper boundary of Amazon EC2 units for core node type in a cluster.
     *
     * It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The core units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between core and task nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html#cfn-emr-cluster-computelimits-maximumcorecapacityunits
     */
    readonly maximumCoreCapacityUnits?: number;

    /**
     * The upper boundary of On-Demand Amazon EC2 units.
     *
     * It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The On-Demand units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between On-Demand and Spot Instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html#cfn-emr-cluster-computelimits-maximumondemandcapacityunits
     */
    readonly maximumOnDemandCapacityUnits?: number;

    /**
     * The lower boundary of Amazon EC2 units.
     *
     * It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html#cfn-emr-cluster-computelimits-minimumcapacityunits
     */
    readonly minimumCapacityUnits: number;

    /**
     * The unit type used for specifying a managed scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-computelimits.html#cfn-emr-cluster-computelimits-unittype
     */
    readonly unitType: string;
  }

  /**
   * `StepConfig` is a property of the `AWS::EMR::Cluster` resource.
   *
   * The `StepConfig` property type specifies a cluster (job flow) step, which runs only on the master node. Steps are used to submit data processing jobs to the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-stepconfig.html
   */
  export interface StepConfigProperty {
    /**
     * The action to take when the cluster step fails.
     *
     * Possible values are `CANCEL_AND_WAIT` and `CONTINUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-stepconfig.html#cfn-emr-cluster-stepconfig-actiononfailure
     */
    readonly actionOnFailure?: string;

    /**
     * The JAR file used for the step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-stepconfig.html#cfn-emr-cluster-stepconfig-hadoopjarstep
     */
    readonly hadoopJarStep: CfnCluster.HadoopJarStepConfigProperty | cdk.IResolvable;

    /**
     * The name of the step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-stepconfig.html#cfn-emr-cluster-stepconfig-name
     */
    readonly name: string;
  }

  /**
   * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed.
   *
   * The main function submits a job for the cluster to execute as a step on the master node, and then waits for the job to finish or fail before executing subsequent steps.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-hadoopjarstepconfig.html
   */
  export interface HadoopJarStepConfigProperty {
    /**
     * A list of command line arguments passed to the JAR file's main function when executed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-hadoopjarstepconfig.html#cfn-emr-cluster-hadoopjarstepconfig-args
     */
    readonly args?: Array<string>;

    /**
     * A path to a JAR file run during the step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-hadoopjarstepconfig.html#cfn-emr-cluster-hadoopjarstepconfig-jar
     */
    readonly jar: string;

    /**
     * The name of the main class in the specified Java file.
     *
     * If not specified, the JAR file should specify a Main-Class in its manifest file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-hadoopjarstepconfig.html#cfn-emr-cluster-hadoopjarstepconfig-mainclass
     */
    readonly mainClass?: string;

    /**
     * A list of Java properties that are set when the step runs.
     *
     * You can use these properties to pass key-value pairs to your main function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-hadoopjarstepconfig.html#cfn-emr-cluster-hadoopjarstepconfig-stepproperties
     */
    readonly stepProperties?: Array<cdk.IResolvable | CfnCluster.KeyValueProperty> | cdk.IResolvable;
  }

  /**
   * `KeyValue` is a subproperty of the `HadoopJarStepConfig` property type.
   *
   * `KeyValue` is used to pass parameters to a step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-keyvalue.html
   */
  export interface KeyValueProperty {
    /**
     * The unique identifier of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-keyvalue.html#cfn-emr-cluster-keyvalue-key
     */
    readonly key?: string;

    /**
     * The value part of the identified key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-keyvalue.html#cfn-emr-cluster-keyvalue-value
     */
    readonly value?: string;
  }

  /**
   * Placement group configuration for an Amazon EMR cluster.
   *
   * The configuration specifies the placement strategy that can be applied to instance roles during cluster creation.
   *
   * To use this configuration, consider attaching managed policy AmazonElasticMapReducePlacementGroupPolicy to the Amazon EMR role.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-placementgroupconfig.html
   */
  export interface PlacementGroupConfigProperty {
    /**
     * Role of the instance in the cluster.
     *
     * Starting with Amazon EMR release 5.23.0, the only supported instance role is `MASTER` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-placementgroupconfig.html#cfn-emr-cluster-placementgroupconfig-instancerole
     */
    readonly instanceRole: string;

    /**
     * Amazon EC2 Placement Group strategy associated with instance role.
     *
     * Starting with Amazon EMR release 5.23.0, the only supported placement strategy is `SPREAD` for the `MASTER` instance role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-cluster-placementgroupconfig.html#cfn-emr-cluster-placementgroupconfig-placementstrategy
     */
    readonly placementStrategy?: string;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html
 */
export interface CfnClusterProps {
  /**
   * A JSON string for selecting additional features.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-additionalinfo
   */
  readonly additionalInfo?: any | cdk.IResolvable;

  /**
   * The applications to install on this cluster, for example, Spark, Flink, Oozie, Zeppelin, and so on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-applications
   */
  readonly applications?: Array<CfnCluster.ApplicationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An IAM role for automatic scaling policies.
   *
   * The default role is `EMR_AutoScaling_DefaultRole` . The IAM role provides permissions that the automatic scaling feature requires to launch and terminate Amazon EC2 instances in an instance group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-autoscalingrole
   */
  readonly autoScalingRole?: string;

  /**
   * An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates.
   *
   * For alternative cluster termination options, see [Control cluster termination](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-termination.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-autoterminationpolicy
   */
  readonly autoTerminationPolicy?: CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable;

  /**
   * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-bootstrapactions
   */
  readonly bootstrapActions?: Array<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Applies only to Amazon EMR releases 4.x and later. The list of configurations that are supplied to the Amazon EMR cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-configurations
   */
  readonly configurations?: Array<CfnCluster.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Available only in Amazon EMR releases 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI if the cluster uses a custom AMI.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-customamiid
   */
  readonly customAmiId?: string;

  /**
   * The IOPS, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   *
   * Available in Amazon EMR releases 6.15.0 and later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-ebsrootvolumeiops
   */
  readonly ebsRootVolumeIops?: number;

  /**
   * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   *
   * Available in Amazon EMR releases 4.x and later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-ebsrootvolumesize
   */
  readonly ebsRootVolumeSize?: number;

  /**
   * The throughput, in MiB/s, of the Amazon EBS root device volume of the Linux AMI that is used for each Amazon EC2 instance.
   *
   * Available in Amazon EMR releases 6.15.0 and later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-ebsrootvolumethroughput
   */
  readonly ebsRootVolumeThroughput?: number;

  /**
   * A specification of the number and type of Amazon EC2 instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-instances
   */
  readonly instances: cdk.IResolvable | CfnCluster.JobFlowInstancesConfigProperty;

  /**
   * Also called instance profile and Amazon EC2 role.
   *
   * An IAM role for an Amazon EMR cluster. The Amazon EC2 instances of the cluster assume this role. The default role is `EMR_EC2_DefaultRole` . In order to use the default role, you must have already created it using the AWS CLI or console.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-jobflowrole
   */
  readonly jobFlowRole: string;

  /**
   * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration.
   *
   * For more information see [Use Kerberos Authentication](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-kerberos.html) in the *Amazon EMR Management Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-kerberosattributes
   */
  readonly kerberosAttributes?: cdk.IResolvable | CfnCluster.KerberosAttributesProperty;

  /**
   * The AWS KMS key used for encrypting log files.
   *
   * This attribute is only available with Amazon EMR 5.30.0 and later, excluding Amazon EMR 6.0.0.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-logencryptionkmskeyid
   */
  readonly logEncryptionKmsKeyId?: string;

  /**
   * The path to the Amazon S3 location where logs for this cluster are stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-loguri
   */
  readonly logUri?: string;

  /**
   * Creates or updates a managed scaling policy for an Amazon EMR cluster.
   *
   * The managed scaling policy defines the limits for resources, such as Amazon EC2 instances that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-managedscalingpolicy
   */
  readonly managedScalingPolicy?: cdk.IResolvable | CfnCluster.ManagedScalingPolicyProperty;

  /**
   * The name of the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-name
   */
  readonly name: string;

  /**
   * The Amazon Linux release specified in a cluster launch RunJobFlow request.
   *
   * If no Amazon Linux release was specified, the default Amazon Linux release is shown in the response.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-osreleaselabel
   */
  readonly osReleaseLabel?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-placementgroupconfigs
   */
  readonly placementGroupConfigs?: Array<cdk.IResolvable | CfnCluster.PlacementGroupConfigProperty> | cdk.IResolvable;

  /**
   * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster.
   *
   * Release labels are in the form `emr-x.x.x` , where x.x.x is an Amazon EMR release version such as `emr-5.14.0` . For more information about Amazon EMR release versions and included application versions and features, see [](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/) . The release label applies only to Amazon EMR releases version 4.0 and later. Earlier versions use `AmiVersion` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-releaselabel
   */
  readonly releaseLabel?: string;

  /**
   * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized.
   *
   * `TERMINATE_AT_INSTANCE_HOUR` indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. `TERMINATE_AT_TASK_COMPLETION` indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. `TERMINATE_AT_TASK_COMPLETION` is available only in Amazon EMR releases 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-scaledownbehavior
   */
  readonly scaleDownBehavior?: string;

  /**
   * The name of the security configuration applied to the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-securityconfiguration
   */
  readonly securityConfiguration?: string;

  /**
   * The IAM role that Amazon EMR assumes in order to access AWS resources on your behalf.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-servicerole
   */
  readonly serviceRole: string;

  /**
   * Specifies the number of steps that can be executed concurrently.
   *
   * The default value is `1` . The maximum value is `256` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-stepconcurrencylevel
   */
  readonly stepConcurrencyLevel?: number;

  /**
   * A list of steps to run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-steps
   */
  readonly steps?: Array<cdk.IResolvable | CfnCluster.StepConfigProperty> | cdk.IResolvable;

  /**
   * A list of tags associated with a cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the cluster is visible to all IAM users of the AWS account associated with the cluster.
   *
   * If this value is set to `true` , all IAM users of that AWS account can view and manage the cluster if they have the proper policy permissions set. If this value is `false` , only the IAM user that created the cluster can view and manage it. This value can be changed using the SetVisibleToAllUsers action.
   *
   * > When you create clusters directly through the EMR console or API, this value is set to `true` by default. However, for `AWS::EMR::Cluster` resources in CloudFormation, the default is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-cluster.html#cfn-emr-cluster-visibletoallusers
   */
  readonly visibleToAllUsers?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ApplicationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterApplicationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalInfo", cdk.hashValidator(cdk.validateString))(properties.additionalInfo));
  errors.collect(cdk.propertyValidator("args", cdk.listValidator(cdk.validateString))(properties.args));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"ApplicationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterApplicationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterApplicationPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalInfo": cdk.hashMapper(cdk.stringToCloudFormation)(properties.additionalInfo),
    "Args": cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnClusterApplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ApplicationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ApplicationProperty>();
  ret.addPropertyResult("additionalInfo", "AdditionalInfo", (properties.AdditionalInfo != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdditionalInfo) : undefined));
  ret.addPropertyResult("args", "Args", (properties.Args != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Args) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoTerminationPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoTerminationPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterAutoTerminationPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idleTimeout", cdk.validateNumber)(properties.idleTimeout));
  return errors.wrap("supplied properties not correct for \"AutoTerminationPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterAutoTerminationPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterAutoTerminationPolicyPropertyValidator(properties).assertSuccess();
  return {
    "IdleTimeout": cdk.numberToCloudFormation(properties.idleTimeout)
  };
}

// @ts-ignore TS6133
function CfnClusterAutoTerminationPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.AutoTerminationPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.AutoTerminationPolicyProperty>();
  ret.addPropertyResult("idleTimeout", "IdleTimeout", (properties.IdleTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScriptBootstrapActionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptBootstrapActionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScriptBootstrapActionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("args", cdk.listValidator(cdk.validateString))(properties.args));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"ScriptBootstrapActionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScriptBootstrapActionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScriptBootstrapActionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Args": cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnClusterScriptBootstrapActionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScriptBootstrapActionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScriptBootstrapActionConfigProperty>();
  ret.addPropertyResult("args", "Args", (properties.Args != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Args) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BootstrapActionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BootstrapActionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterBootstrapActionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("scriptBootstrapAction", cdk.requiredValidator)(properties.scriptBootstrapAction));
  errors.collect(cdk.propertyValidator("scriptBootstrapAction", CfnClusterScriptBootstrapActionConfigPropertyValidator)(properties.scriptBootstrapAction));
  return errors.wrap("supplied properties not correct for \"BootstrapActionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterBootstrapActionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterBootstrapActionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ScriptBootstrapAction": convertCfnClusterScriptBootstrapActionConfigPropertyToCloudFormation(properties.scriptBootstrapAction)
  };
}

// @ts-ignore TS6133
function CfnClusterBootstrapActionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.BootstrapActionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.BootstrapActionConfigProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("scriptBootstrapAction", "ScriptBootstrapAction", (properties.ScriptBootstrapAction != null ? CfnClusterScriptBootstrapActionConfigPropertyFromCloudFormation(properties.ScriptBootstrapAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("configurationProperties", cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnClusterConfigurationPropertyValidator))(properties.configurations));
  return errors.wrap("supplied properties not correct for \"ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "ConfigurationProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
    "Configurations": cdk.listMapper(convertCfnClusterConfigurationPropertyToCloudFormation)(properties.configurations)
  };
}

// @ts-ignore TS6133
function CfnClusterConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ConfigurationProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("configurationProperties", "ConfigurationProperties", (properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.requiredValidator)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.validateNumber)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeType", cdk.requiredValidator)(properties.volumeType));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"VolumeSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVolumeSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVolumeSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "SizeInGB": cdk.numberToCloudFormation(properties.sizeInGb),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnClusterVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VolumeSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VolumeSpecificationProperty>();
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("sizeInGb", "SizeInGB", (properties.SizeInGB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("volumeSpecification", cdk.requiredValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumeSpecification", CfnClusterVolumeSpecificationPropertyValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumesPerInstance", cdk.validateNumber)(properties.volumesPerInstance));
  return errors.wrap("supplied properties not correct for \"EbsBlockDeviceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
  return {
    "VolumeSpecification": convertCfnClusterVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
    "VolumesPerInstance": cdk.numberToCloudFormation(properties.volumesPerInstance)
  };
}

// @ts-ignore TS6133
function CfnClusterEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EbsBlockDeviceConfigProperty>();
  ret.addPropertyResult("volumeSpecification", "VolumeSpecification", (properties.VolumeSpecification != null ? CfnClusterVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification) : undefined));
  ret.addPropertyResult("volumesPerInstance", "VolumesPerInstance", (properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsBlockDeviceConfigs", cdk.listValidator(CfnClusterEbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
  errors.collect(cdk.propertyValidator("ebsOptimized", cdk.validateBoolean)(properties.ebsOptimized));
  return errors.wrap("supplied properties not correct for \"EbsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEbsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEbsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EbsBlockDeviceConfigs": cdk.listMapper(convertCfnClusterEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
    "EbsOptimized": cdk.booleanToCloudFormation(properties.ebsOptimized)
  };
}

// @ts-ignore TS6133
function CfnClusterEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EbsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EbsConfigurationProperty>();
  ret.addPropertyResult("ebsBlockDeviceConfigs", "EbsBlockDeviceConfigs", (properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined));
  ret.addPropertyResult("ebsOptimized", "EbsOptimized", (properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterInstanceTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bidPrice", cdk.validateString)(properties.bidPrice));
  errors.collect(cdk.propertyValidator("bidPriceAsPercentageOfOnDemandPrice", cdk.validateNumber)(properties.bidPriceAsPercentageOfOnDemandPrice));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnClusterConfigurationPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("customAmiId", cdk.validateString)(properties.customAmiId));
  errors.collect(cdk.propertyValidator("ebsConfiguration", CfnClusterEbsConfigurationPropertyValidator)(properties.ebsConfiguration));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("weightedCapacity", cdk.validateNumber)(properties.weightedCapacity));
  return errors.wrap("supplied properties not correct for \"InstanceTypeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterInstanceTypeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterInstanceTypeConfigPropertyValidator(properties).assertSuccess();
  return {
    "BidPrice": cdk.stringToCloudFormation(properties.bidPrice),
    "BidPriceAsPercentageOfOnDemandPrice": cdk.numberToCloudFormation(properties.bidPriceAsPercentageOfOnDemandPrice),
    "Configurations": cdk.listMapper(convertCfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
    "CustomAmiId": cdk.stringToCloudFormation(properties.customAmiId),
    "EbsConfiguration": convertCfnClusterEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "WeightedCapacity": cdk.numberToCloudFormation(properties.weightedCapacity)
  };
}

// @ts-ignore TS6133
function CfnClusterInstanceTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceTypeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceTypeConfigProperty>();
  ret.addPropertyResult("bidPrice", "BidPrice", (properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined));
  ret.addPropertyResult("bidPriceAsPercentageOfOnDemandPrice", "BidPriceAsPercentageOfOnDemandPrice", (properties.BidPriceAsPercentageOfOnDemandPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.BidPriceAsPercentageOfOnDemandPrice) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("customAmiId", "CustomAmiId", (properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined));
  ret.addPropertyResult("ebsConfiguration", "EbsConfiguration", (properties.EbsConfiguration != null ? CfnClusterEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("weightedCapacity", "WeightedCapacity", (properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.WeightedCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnDemandProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterOnDemandProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.requiredValidator)(properties.allocationStrategy));
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.validateString)(properties.allocationStrategy));
  return errors.wrap("supplied properties not correct for \"OnDemandProvisioningSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterOnDemandProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterOnDemandProvisioningSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllocationStrategy": cdk.stringToCloudFormation(properties.allocationStrategy)
  };
}

// @ts-ignore TS6133
function CfnClusterOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.OnDemandProvisioningSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.OnDemandProvisioningSpecificationProperty>();
  ret.addPropertyResult("allocationStrategy", "AllocationStrategy", (properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SpotProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSpotProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.validateString)(properties.allocationStrategy));
  errors.collect(cdk.propertyValidator("blockDurationMinutes", cdk.validateNumber)(properties.blockDurationMinutes));
  errors.collect(cdk.propertyValidator("timeoutAction", cdk.requiredValidator)(properties.timeoutAction));
  errors.collect(cdk.propertyValidator("timeoutAction", cdk.validateString)(properties.timeoutAction));
  errors.collect(cdk.propertyValidator("timeoutDurationMinutes", cdk.requiredValidator)(properties.timeoutDurationMinutes));
  errors.collect(cdk.propertyValidator("timeoutDurationMinutes", cdk.validateNumber)(properties.timeoutDurationMinutes));
  return errors.wrap("supplied properties not correct for \"SpotProvisioningSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterSpotProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSpotProvisioningSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllocationStrategy": cdk.stringToCloudFormation(properties.allocationStrategy),
    "BlockDurationMinutes": cdk.numberToCloudFormation(properties.blockDurationMinutes),
    "TimeoutAction": cdk.stringToCloudFormation(properties.timeoutAction),
    "TimeoutDurationMinutes": cdk.numberToCloudFormation(properties.timeoutDurationMinutes)
  };
}

// @ts-ignore TS6133
function CfnClusterSpotProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.SpotProvisioningSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SpotProvisioningSpecificationProperty>();
  ret.addPropertyResult("allocationStrategy", "AllocationStrategy", (properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined));
  ret.addPropertyResult("blockDurationMinutes", "BlockDurationMinutes", (properties.BlockDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockDurationMinutes) : undefined));
  ret.addPropertyResult("timeoutAction", "TimeoutAction", (properties.TimeoutAction != null ? cfn_parse.FromCloudFormation.getString(properties.TimeoutAction) : undefined));
  ret.addPropertyResult("timeoutDurationMinutes", "TimeoutDurationMinutes", (properties.TimeoutDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutDurationMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterInstanceFleetProvisioningSpecificationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onDemandSpecification", CfnClusterOnDemandProvisioningSpecificationPropertyValidator)(properties.onDemandSpecification));
  errors.collect(cdk.propertyValidator("spotSpecification", CfnClusterSpotProvisioningSpecificationPropertyValidator)(properties.spotSpecification));
  return errors.wrap("supplied properties not correct for \"InstanceFleetProvisioningSpecificationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterInstanceFleetProvisioningSpecificationsPropertyValidator(properties).assertSuccess();
  return {
    "OnDemandSpecification": convertCfnClusterOnDemandProvisioningSpecificationPropertyToCloudFormation(properties.onDemandSpecification),
    "SpotSpecification": convertCfnClusterSpotProvisioningSpecificationPropertyToCloudFormation(properties.spotSpecification)
  };
}

// @ts-ignore TS6133
function CfnClusterInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceFleetProvisioningSpecificationsProperty>();
  ret.addPropertyResult("onDemandSpecification", "OnDemandSpecification", (properties.OnDemandSpecification != null ? CfnClusterOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties.OnDemandSpecification) : undefined));
  ret.addPropertyResult("spotSpecification", "SpotSpecification", (properties.SpotSpecification != null ? CfnClusterSpotProvisioningSpecificationPropertyFromCloudFormation(properties.SpotSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceFleetConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterInstanceFleetConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceTypeConfigs", cdk.listValidator(CfnClusterInstanceTypeConfigPropertyValidator))(properties.instanceTypeConfigs));
  errors.collect(cdk.propertyValidator("launchSpecifications", CfnClusterInstanceFleetProvisioningSpecificationsPropertyValidator)(properties.launchSpecifications));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("targetOnDemandCapacity", cdk.validateNumber)(properties.targetOnDemandCapacity));
  errors.collect(cdk.propertyValidator("targetSpotCapacity", cdk.validateNumber)(properties.targetSpotCapacity));
  return errors.wrap("supplied properties not correct for \"InstanceFleetConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterInstanceFleetConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterInstanceFleetConfigPropertyValidator(properties).assertSuccess();
  return {
    "InstanceTypeConfigs": cdk.listMapper(convertCfnClusterInstanceTypeConfigPropertyToCloudFormation)(properties.instanceTypeConfigs),
    "LaunchSpecifications": convertCfnClusterInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties.launchSpecifications),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TargetOnDemandCapacity": cdk.numberToCloudFormation(properties.targetOnDemandCapacity),
    "TargetSpotCapacity": cdk.numberToCloudFormation(properties.targetSpotCapacity)
  };
}

// @ts-ignore TS6133
function CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceFleetConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceFleetConfigProperty>();
  ret.addPropertyResult("instanceTypeConfigs", "InstanceTypeConfigs", (properties.InstanceTypeConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceTypeConfigPropertyFromCloudFormation)(properties.InstanceTypeConfigs) : undefined));
  ret.addPropertyResult("launchSpecifications", "LaunchSpecifications", (properties.LaunchSpecifications != null ? CfnClusterInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties.LaunchSpecifications) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("targetOnDemandCapacity", "TargetOnDemandCapacity", (properties.TargetOnDemandCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetOnDemandCapacity) : undefined));
  ret.addPropertyResult("targetSpotCapacity", "TargetSpotCapacity", (properties.TargetSpotCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetSpotCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScalingConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.requiredValidator)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.requiredValidator)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  return errors.wrap("supplied properties not correct for \"ScalingConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScalingConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScalingConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity)
  };
}

// @ts-ignore TS6133
function CfnClusterScalingConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScalingConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingConstraintsProperty>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSimpleScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adjustmentType", cdk.validateString)(properties.adjustmentType));
  errors.collect(cdk.propertyValidator("coolDown", cdk.validateNumber)(properties.coolDown));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.requiredValidator)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  return errors.wrap("supplied properties not correct for \"SimpleScalingPolicyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSimpleScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdjustmentType": cdk.stringToCloudFormation(properties.adjustmentType),
    "CoolDown": cdk.numberToCloudFormation(properties.coolDown),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment)
  };
}

// @ts-ignore TS6133
function CfnClusterSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.SimpleScalingPolicyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SimpleScalingPolicyConfigurationProperty>();
  ret.addPropertyResult("adjustmentType", "AdjustmentType", (properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined));
  ret.addPropertyResult("coolDown", "CoolDown", (properties.CoolDown != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoolDown) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScalingActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("market", cdk.validateString)(properties.market));
  errors.collect(cdk.propertyValidator("simpleScalingPolicyConfiguration", cdk.requiredValidator)(properties.simpleScalingPolicyConfiguration));
  errors.collect(cdk.propertyValidator("simpleScalingPolicyConfiguration", CfnClusterSimpleScalingPolicyConfigurationPropertyValidator)(properties.simpleScalingPolicyConfiguration));
  return errors.wrap("supplied properties not correct for \"ScalingActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScalingActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScalingActionPropertyValidator(properties).assertSuccess();
  return {
    "Market": cdk.stringToCloudFormation(properties.market),
    "SimpleScalingPolicyConfiguration": convertCfnClusterSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties.simpleScalingPolicyConfiguration)
  };
}

// @ts-ignore TS6133
function CfnClusterScalingActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScalingActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingActionProperty>();
  ret.addPropertyResult("market", "Market", (properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined));
  ret.addPropertyResult("simpleScalingPolicyConfiguration", "SimpleScalingPolicyConfiguration", (properties.SimpleScalingPolicyConfiguration != null ? CfnClusterSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties.SimpleScalingPolicyConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnClusterMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.MetricDimensionProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchAlarmDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterCloudWatchAlarmDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnClusterMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("evaluationPeriods", cdk.validateNumber)(properties.evaluationPeriods));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("period", cdk.requiredValidator)(properties.period));
  errors.collect(cdk.propertyValidator("period", cdk.validateNumber)(properties.period));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"CloudWatchAlarmDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterCloudWatchAlarmDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterCloudWatchAlarmDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "Dimensions": cdk.listMapper(convertCfnClusterMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "EvaluationPeriods": cdk.numberToCloudFormation(properties.evaluationPeriods),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Period": cdk.numberToCloudFormation(properties.period),
    "Statistic": cdk.stringToCloudFormation(properties.statistic),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnClusterCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.CloudWatchAlarmDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.CloudWatchAlarmDefinitionProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("evaluationPeriods", "EvaluationPeriods", (properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScalingTriggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchAlarmDefinition", cdk.requiredValidator)(properties.cloudWatchAlarmDefinition));
  errors.collect(cdk.propertyValidator("cloudWatchAlarmDefinition", CfnClusterCloudWatchAlarmDefinitionPropertyValidator)(properties.cloudWatchAlarmDefinition));
  return errors.wrap("supplied properties not correct for \"ScalingTriggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScalingTriggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScalingTriggerPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchAlarmDefinition": convertCfnClusterCloudWatchAlarmDefinitionPropertyToCloudFormation(properties.cloudWatchAlarmDefinition)
  };
}

// @ts-ignore TS6133
function CfnClusterScalingTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScalingTriggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingTriggerProperty>();
  ret.addPropertyResult("cloudWatchAlarmDefinition", "CloudWatchAlarmDefinition", (properties.CloudWatchAlarmDefinition != null ? CfnClusterCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties.CloudWatchAlarmDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScalingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnClusterScalingActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("trigger", cdk.requiredValidator)(properties.trigger));
  errors.collect(cdk.propertyValidator("trigger", CfnClusterScalingTriggerPropertyValidator)(properties.trigger));
  return errors.wrap("supplied properties not correct for \"ScalingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScalingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScalingRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnClusterScalingActionPropertyToCloudFormation(properties.action),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Trigger": convertCfnClusterScalingTriggerPropertyToCloudFormation(properties.trigger)
  };
}

// @ts-ignore TS6133
function CfnClusterScalingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScalingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScalingRuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnClusterScalingActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("trigger", "Trigger", (properties.Trigger != null ? CfnClusterScalingTriggerPropertyFromCloudFormation(properties.Trigger) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterAutoScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constraints", cdk.requiredValidator)(properties.constraints));
  errors.collect(cdk.propertyValidator("constraints", CfnClusterScalingConstraintsPropertyValidator)(properties.constraints));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnClusterScalingRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"AutoScalingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterAutoScalingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterAutoScalingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Constraints": convertCfnClusterScalingConstraintsPropertyToCloudFormation(properties.constraints),
    "Rules": cdk.listMapper(convertCfnClusterScalingRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnClusterAutoScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.AutoScalingPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.AutoScalingPolicyProperty>();
  ret.addPropertyResult("constraints", "Constraints", (properties.Constraints != null ? CfnClusterScalingConstraintsPropertyFromCloudFormation(properties.Constraints) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterScalingRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterInstanceGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingPolicy", CfnClusterAutoScalingPolicyPropertyValidator)(properties.autoScalingPolicy));
  errors.collect(cdk.propertyValidator("bidPrice", cdk.validateString)(properties.bidPrice));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnClusterConfigurationPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("customAmiId", cdk.validateString)(properties.customAmiId));
  errors.collect(cdk.propertyValidator("ebsConfiguration", CfnClusterEbsConfigurationPropertyValidator)(properties.ebsConfiguration));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.requiredValidator)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.validateNumber)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("market", cdk.validateString)(properties.market));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"InstanceGroupConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterInstanceGroupConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterInstanceGroupConfigPropertyValidator(properties).assertSuccess();
  return {
    "AutoScalingPolicy": convertCfnClusterAutoScalingPolicyPropertyToCloudFormation(properties.autoScalingPolicy),
    "BidPrice": cdk.stringToCloudFormation(properties.bidPrice),
    "Configurations": cdk.listMapper(convertCfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
    "CustomAmiId": cdk.stringToCloudFormation(properties.customAmiId),
    "EbsConfiguration": convertCfnClusterEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
    "InstanceCount": cdk.numberToCloudFormation(properties.instanceCount),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "Market": cdk.stringToCloudFormation(properties.market),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.InstanceGroupConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.InstanceGroupConfigProperty>();
  ret.addPropertyResult("autoScalingPolicy", "AutoScalingPolicy", (properties.AutoScalingPolicy != null ? CfnClusterAutoScalingPolicyPropertyFromCloudFormation(properties.AutoScalingPolicy) : undefined));
  ret.addPropertyResult("bidPrice", "BidPrice", (properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("customAmiId", "CustomAmiId", (properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined));
  ret.addPropertyResult("ebsConfiguration", "EbsConfiguration", (properties.EbsConfiguration != null ? CfnClusterEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined));
  ret.addPropertyResult("instanceCount", "InstanceCount", (properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("market", "Market", (properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementTypeProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPlacementTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.requiredValidator)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  return errors.wrap("supplied properties not correct for \"PlacementTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterPlacementTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPlacementTypePropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone)
  };
}

// @ts-ignore TS6133
function CfnClusterPlacementTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.PlacementTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.PlacementTypeProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobFlowInstancesConfigProperty`
 *
 * @param properties - the TypeScript properties of a `JobFlowInstancesConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterJobFlowInstancesConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalMasterSecurityGroups", cdk.listValidator(cdk.validateString))(properties.additionalMasterSecurityGroups));
  errors.collect(cdk.propertyValidator("additionalSlaveSecurityGroups", cdk.listValidator(cdk.validateString))(properties.additionalSlaveSecurityGroups));
  errors.collect(cdk.propertyValidator("coreInstanceFleet", CfnClusterInstanceFleetConfigPropertyValidator)(properties.coreInstanceFleet));
  errors.collect(cdk.propertyValidator("coreInstanceGroup", CfnClusterInstanceGroupConfigPropertyValidator)(properties.coreInstanceGroup));
  errors.collect(cdk.propertyValidator("ec2KeyName", cdk.validateString)(properties.ec2KeyName));
  errors.collect(cdk.propertyValidator("ec2SubnetId", cdk.validateString)(properties.ec2SubnetId));
  errors.collect(cdk.propertyValidator("ec2SubnetIds", cdk.listValidator(cdk.validateString))(properties.ec2SubnetIds));
  errors.collect(cdk.propertyValidator("emrManagedMasterSecurityGroup", cdk.validateString)(properties.emrManagedMasterSecurityGroup));
  errors.collect(cdk.propertyValidator("emrManagedSlaveSecurityGroup", cdk.validateString)(properties.emrManagedSlaveSecurityGroup));
  errors.collect(cdk.propertyValidator("hadoopVersion", cdk.validateString)(properties.hadoopVersion));
  errors.collect(cdk.propertyValidator("keepJobFlowAliveWhenNoSteps", cdk.validateBoolean)(properties.keepJobFlowAliveWhenNoSteps));
  errors.collect(cdk.propertyValidator("masterInstanceFleet", CfnClusterInstanceFleetConfigPropertyValidator)(properties.masterInstanceFleet));
  errors.collect(cdk.propertyValidator("masterInstanceGroup", CfnClusterInstanceGroupConfigPropertyValidator)(properties.masterInstanceGroup));
  errors.collect(cdk.propertyValidator("placement", CfnClusterPlacementTypePropertyValidator)(properties.placement));
  errors.collect(cdk.propertyValidator("serviceAccessSecurityGroup", cdk.validateString)(properties.serviceAccessSecurityGroup));
  errors.collect(cdk.propertyValidator("taskInstanceFleets", cdk.listValidator(CfnClusterInstanceFleetConfigPropertyValidator))(properties.taskInstanceFleets));
  errors.collect(cdk.propertyValidator("taskInstanceGroups", cdk.listValidator(CfnClusterInstanceGroupConfigPropertyValidator))(properties.taskInstanceGroups));
  errors.collect(cdk.propertyValidator("terminationProtected", cdk.validateBoolean)(properties.terminationProtected));
  return errors.wrap("supplied properties not correct for \"JobFlowInstancesConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterJobFlowInstancesConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterJobFlowInstancesConfigPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalMasterSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalMasterSecurityGroups),
    "AdditionalSlaveSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalSlaveSecurityGroups),
    "CoreInstanceFleet": convertCfnClusterInstanceFleetConfigPropertyToCloudFormation(properties.coreInstanceFleet),
    "CoreInstanceGroup": convertCfnClusterInstanceGroupConfigPropertyToCloudFormation(properties.coreInstanceGroup),
    "Ec2KeyName": cdk.stringToCloudFormation(properties.ec2KeyName),
    "Ec2SubnetId": cdk.stringToCloudFormation(properties.ec2SubnetId),
    "Ec2SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SubnetIds),
    "EmrManagedMasterSecurityGroup": cdk.stringToCloudFormation(properties.emrManagedMasterSecurityGroup),
    "EmrManagedSlaveSecurityGroup": cdk.stringToCloudFormation(properties.emrManagedSlaveSecurityGroup),
    "HadoopVersion": cdk.stringToCloudFormation(properties.hadoopVersion),
    "KeepJobFlowAliveWhenNoSteps": cdk.booleanToCloudFormation(properties.keepJobFlowAliveWhenNoSteps),
    "MasterInstanceFleet": convertCfnClusterInstanceFleetConfigPropertyToCloudFormation(properties.masterInstanceFleet),
    "MasterInstanceGroup": convertCfnClusterInstanceGroupConfigPropertyToCloudFormation(properties.masterInstanceGroup),
    "Placement": convertCfnClusterPlacementTypePropertyToCloudFormation(properties.placement),
    "ServiceAccessSecurityGroup": cdk.stringToCloudFormation(properties.serviceAccessSecurityGroup),
    "TaskInstanceFleets": cdk.listMapper(convertCfnClusterInstanceFleetConfigPropertyToCloudFormation)(properties.taskInstanceFleets),
    "TaskInstanceGroups": cdk.listMapper(convertCfnClusterInstanceGroupConfigPropertyToCloudFormation)(properties.taskInstanceGroups),
    "TerminationProtected": cdk.booleanToCloudFormation(properties.terminationProtected)
  };
}

// @ts-ignore TS6133
function CfnClusterJobFlowInstancesConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.JobFlowInstancesConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.JobFlowInstancesConfigProperty>();
  ret.addPropertyResult("additionalMasterSecurityGroups", "AdditionalMasterSecurityGroups", (properties.AdditionalMasterSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalMasterSecurityGroups) : undefined));
  ret.addPropertyResult("additionalSlaveSecurityGroups", "AdditionalSlaveSecurityGroups", (properties.AdditionalSlaveSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalSlaveSecurityGroups) : undefined));
  ret.addPropertyResult("coreInstanceFleet", "CoreInstanceFleet", (properties.CoreInstanceFleet != null ? CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties.CoreInstanceFleet) : undefined));
  ret.addPropertyResult("coreInstanceGroup", "CoreInstanceGroup", (properties.CoreInstanceGroup != null ? CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties.CoreInstanceGroup) : undefined));
  ret.addPropertyResult("ec2KeyName", "Ec2KeyName", (properties.Ec2KeyName != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2KeyName) : undefined));
  ret.addPropertyResult("ec2SubnetId", "Ec2SubnetId", (properties.Ec2SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2SubnetId) : undefined));
  ret.addPropertyResult("ec2SubnetIds", "Ec2SubnetIds", (properties.Ec2SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Ec2SubnetIds) : undefined));
  ret.addPropertyResult("emrManagedMasterSecurityGroup", "EmrManagedMasterSecurityGroup", (properties.EmrManagedMasterSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.EmrManagedMasterSecurityGroup) : undefined));
  ret.addPropertyResult("emrManagedSlaveSecurityGroup", "EmrManagedSlaveSecurityGroup", (properties.EmrManagedSlaveSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.EmrManagedSlaveSecurityGroup) : undefined));
  ret.addPropertyResult("hadoopVersion", "HadoopVersion", (properties.HadoopVersion != null ? cfn_parse.FromCloudFormation.getString(properties.HadoopVersion) : undefined));
  ret.addPropertyResult("keepJobFlowAliveWhenNoSteps", "KeepJobFlowAliveWhenNoSteps", (properties.KeepJobFlowAliveWhenNoSteps != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeepJobFlowAliveWhenNoSteps) : undefined));
  ret.addPropertyResult("masterInstanceFleet", "MasterInstanceFleet", (properties.MasterInstanceFleet != null ? CfnClusterInstanceFleetConfigPropertyFromCloudFormation(properties.MasterInstanceFleet) : undefined));
  ret.addPropertyResult("masterInstanceGroup", "MasterInstanceGroup", (properties.MasterInstanceGroup != null ? CfnClusterInstanceGroupConfigPropertyFromCloudFormation(properties.MasterInstanceGroup) : undefined));
  ret.addPropertyResult("placement", "Placement", (properties.Placement != null ? CfnClusterPlacementTypePropertyFromCloudFormation(properties.Placement) : undefined));
  ret.addPropertyResult("serviceAccessSecurityGroup", "ServiceAccessSecurityGroup", (properties.ServiceAccessSecurityGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessSecurityGroup) : undefined));
  ret.addPropertyResult("taskInstanceFleets", "TaskInstanceFleets", (properties.TaskInstanceFleets != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceFleetConfigPropertyFromCloudFormation)(properties.TaskInstanceFleets) : undefined));
  ret.addPropertyResult("taskInstanceGroups", "TaskInstanceGroups", (properties.TaskInstanceGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterInstanceGroupConfigPropertyFromCloudFormation)(properties.TaskInstanceGroups) : undefined));
  ret.addPropertyResult("terminationProtected", "TerminationProtected", (properties.TerminationProtected != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminationProtected) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KerberosAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `KerberosAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterKerberosAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adDomainJoinPassword", cdk.validateString)(properties.adDomainJoinPassword));
  errors.collect(cdk.propertyValidator("adDomainJoinUser", cdk.validateString)(properties.adDomainJoinUser));
  errors.collect(cdk.propertyValidator("crossRealmTrustPrincipalPassword", cdk.validateString)(properties.crossRealmTrustPrincipalPassword));
  errors.collect(cdk.propertyValidator("kdcAdminPassword", cdk.requiredValidator)(properties.kdcAdminPassword));
  errors.collect(cdk.propertyValidator("kdcAdminPassword", cdk.validateString)(properties.kdcAdminPassword));
  errors.collect(cdk.propertyValidator("realm", cdk.requiredValidator)(properties.realm));
  errors.collect(cdk.propertyValidator("realm", cdk.validateString)(properties.realm));
  return errors.wrap("supplied properties not correct for \"KerberosAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterKerberosAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterKerberosAttributesPropertyValidator(properties).assertSuccess();
  return {
    "ADDomainJoinPassword": cdk.stringToCloudFormation(properties.adDomainJoinPassword),
    "ADDomainJoinUser": cdk.stringToCloudFormation(properties.adDomainJoinUser),
    "CrossRealmTrustPrincipalPassword": cdk.stringToCloudFormation(properties.crossRealmTrustPrincipalPassword),
    "KdcAdminPassword": cdk.stringToCloudFormation(properties.kdcAdminPassword),
    "Realm": cdk.stringToCloudFormation(properties.realm)
  };
}

// @ts-ignore TS6133
function CfnClusterKerberosAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.KerberosAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KerberosAttributesProperty>();
  ret.addPropertyResult("adDomainJoinPassword", "ADDomainJoinPassword", (properties.ADDomainJoinPassword != null ? cfn_parse.FromCloudFormation.getString(properties.ADDomainJoinPassword) : undefined));
  ret.addPropertyResult("adDomainJoinUser", "ADDomainJoinUser", (properties.ADDomainJoinUser != null ? cfn_parse.FromCloudFormation.getString(properties.ADDomainJoinUser) : undefined));
  ret.addPropertyResult("crossRealmTrustPrincipalPassword", "CrossRealmTrustPrincipalPassword", (properties.CrossRealmTrustPrincipalPassword != null ? cfn_parse.FromCloudFormation.getString(properties.CrossRealmTrustPrincipalPassword) : undefined));
  ret.addPropertyResult("kdcAdminPassword", "KdcAdminPassword", (properties.KdcAdminPassword != null ? cfn_parse.FromCloudFormation.getString(properties.KdcAdminPassword) : undefined));
  ret.addPropertyResult("realm", "Realm", (properties.Realm != null ? cfn_parse.FromCloudFormation.getString(properties.Realm) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComputeLimitsProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeLimitsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterComputeLimitsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumCapacityUnits", cdk.requiredValidator)(properties.maximumCapacityUnits));
  errors.collect(cdk.propertyValidator("maximumCapacityUnits", cdk.validateNumber)(properties.maximumCapacityUnits));
  errors.collect(cdk.propertyValidator("maximumCoreCapacityUnits", cdk.validateNumber)(properties.maximumCoreCapacityUnits));
  errors.collect(cdk.propertyValidator("maximumOnDemandCapacityUnits", cdk.validateNumber)(properties.maximumOnDemandCapacityUnits));
  errors.collect(cdk.propertyValidator("minimumCapacityUnits", cdk.requiredValidator)(properties.minimumCapacityUnits));
  errors.collect(cdk.propertyValidator("minimumCapacityUnits", cdk.validateNumber)(properties.minimumCapacityUnits));
  errors.collect(cdk.propertyValidator("unitType", cdk.requiredValidator)(properties.unitType));
  errors.collect(cdk.propertyValidator("unitType", cdk.validateString)(properties.unitType));
  return errors.wrap("supplied properties not correct for \"ComputeLimitsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterComputeLimitsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterComputeLimitsPropertyValidator(properties).assertSuccess();
  return {
    "MaximumCapacityUnits": cdk.numberToCloudFormation(properties.maximumCapacityUnits),
    "MaximumCoreCapacityUnits": cdk.numberToCloudFormation(properties.maximumCoreCapacityUnits),
    "MaximumOnDemandCapacityUnits": cdk.numberToCloudFormation(properties.maximumOnDemandCapacityUnits),
    "MinimumCapacityUnits": cdk.numberToCloudFormation(properties.minimumCapacityUnits),
    "UnitType": cdk.stringToCloudFormation(properties.unitType)
  };
}

// @ts-ignore TS6133
function CfnClusterComputeLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ComputeLimitsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ComputeLimitsProperty>();
  ret.addPropertyResult("maximumCapacityUnits", "MaximumCapacityUnits", (properties.MaximumCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumCapacityUnits) : undefined));
  ret.addPropertyResult("maximumCoreCapacityUnits", "MaximumCoreCapacityUnits", (properties.MaximumCoreCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumCoreCapacityUnits) : undefined));
  ret.addPropertyResult("maximumOnDemandCapacityUnits", "MaximumOnDemandCapacityUnits", (properties.MaximumOnDemandCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumOnDemandCapacityUnits) : undefined));
  ret.addPropertyResult("minimumCapacityUnits", "MinimumCapacityUnits", (properties.MinimumCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumCapacityUnits) : undefined));
  ret.addPropertyResult("unitType", "UnitType", (properties.UnitType != null ? cfn_parse.FromCloudFormation.getString(properties.UnitType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManagedScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterManagedScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeLimits", CfnClusterComputeLimitsPropertyValidator)(properties.computeLimits));
  return errors.wrap("supplied properties not correct for \"ManagedScalingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterManagedScalingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterManagedScalingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ComputeLimits": convertCfnClusterComputeLimitsPropertyToCloudFormation(properties.computeLimits)
  };
}

// @ts-ignore TS6133
function CfnClusterManagedScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ManagedScalingPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ManagedScalingPolicyProperty>();
  ret.addPropertyResult("computeLimits", "ComputeLimits", (properties.ComputeLimits != null ? CfnClusterComputeLimitsPropertyFromCloudFormation(properties.ComputeLimits) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KeyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterKeyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterKeyValuePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnClusterKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.KeyValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KeyValueProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HadoopJarStepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterHadoopJarStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("args", cdk.listValidator(cdk.validateString))(properties.args));
  errors.collect(cdk.propertyValidator("jar", cdk.requiredValidator)(properties.jar));
  errors.collect(cdk.propertyValidator("jar", cdk.validateString)(properties.jar));
  errors.collect(cdk.propertyValidator("mainClass", cdk.validateString)(properties.mainClass));
  errors.collect(cdk.propertyValidator("stepProperties", cdk.listValidator(CfnClusterKeyValuePropertyValidator))(properties.stepProperties));
  return errors.wrap("supplied properties not correct for \"HadoopJarStepConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterHadoopJarStepConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterHadoopJarStepConfigPropertyValidator(properties).assertSuccess();
  return {
    "Args": cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
    "Jar": cdk.stringToCloudFormation(properties.jar),
    "MainClass": cdk.stringToCloudFormation(properties.mainClass),
    "StepProperties": cdk.listMapper(convertCfnClusterKeyValuePropertyToCloudFormation)(properties.stepProperties)
  };
}

// @ts-ignore TS6133
function CfnClusterHadoopJarStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.HadoopJarStepConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.HadoopJarStepConfigProperty>();
  ret.addPropertyResult("args", "Args", (properties.Args != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Args) : undefined));
  ret.addPropertyResult("jar", "Jar", (properties.Jar != null ? cfn_parse.FromCloudFormation.getString(properties.Jar) : undefined));
  ret.addPropertyResult("mainClass", "MainClass", (properties.MainClass != null ? cfn_parse.FromCloudFormation.getString(properties.MainClass) : undefined));
  ret.addPropertyResult("stepProperties", "StepProperties", (properties.StepProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterKeyValuePropertyFromCloudFormation)(properties.StepProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `StepConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionOnFailure", cdk.validateString)(properties.actionOnFailure));
  errors.collect(cdk.propertyValidator("hadoopJarStep", cdk.requiredValidator)(properties.hadoopJarStep));
  errors.collect(cdk.propertyValidator("hadoopJarStep", CfnClusterHadoopJarStepConfigPropertyValidator)(properties.hadoopJarStep));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"StepConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterStepConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterStepConfigPropertyValidator(properties).assertSuccess();
  return {
    "ActionOnFailure": cdk.stringToCloudFormation(properties.actionOnFailure),
    "HadoopJarStep": convertCfnClusterHadoopJarStepConfigPropertyToCloudFormation(properties.hadoopJarStep),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnClusterStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.StepConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.StepConfigProperty>();
  ret.addPropertyResult("actionOnFailure", "ActionOnFailure", (properties.ActionOnFailure != null ? cfn_parse.FromCloudFormation.getString(properties.ActionOnFailure) : undefined));
  ret.addPropertyResult("hadoopJarStep", "HadoopJarStep", (properties.HadoopJarStep != null ? CfnClusterHadoopJarStepConfigPropertyFromCloudFormation(properties.HadoopJarStep) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPlacementGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceRole", cdk.requiredValidator)(properties.instanceRole));
  errors.collect(cdk.propertyValidator("instanceRole", cdk.validateString)(properties.instanceRole));
  errors.collect(cdk.propertyValidator("placementStrategy", cdk.validateString)(properties.placementStrategy));
  return errors.wrap("supplied properties not correct for \"PlacementGroupConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterPlacementGroupConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPlacementGroupConfigPropertyValidator(properties).assertSuccess();
  return {
    "InstanceRole": cdk.stringToCloudFormation(properties.instanceRole),
    "PlacementStrategy": cdk.stringToCloudFormation(properties.placementStrategy)
  };
}

// @ts-ignore TS6133
function CfnClusterPlacementGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.PlacementGroupConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.PlacementGroupConfigProperty>();
  ret.addPropertyResult("instanceRole", "InstanceRole", (properties.InstanceRole != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRole) : undefined));
  ret.addPropertyResult("placementStrategy", "PlacementStrategy", (properties.PlacementStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalInfo", cdk.validateObject)(properties.additionalInfo));
  errors.collect(cdk.propertyValidator("applications", cdk.listValidator(CfnClusterApplicationPropertyValidator))(properties.applications));
  errors.collect(cdk.propertyValidator("autoScalingRole", cdk.validateString)(properties.autoScalingRole));
  errors.collect(cdk.propertyValidator("autoTerminationPolicy", CfnClusterAutoTerminationPolicyPropertyValidator)(properties.autoTerminationPolicy));
  errors.collect(cdk.propertyValidator("bootstrapActions", cdk.listValidator(CfnClusterBootstrapActionConfigPropertyValidator))(properties.bootstrapActions));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnClusterConfigurationPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("customAmiId", cdk.validateString)(properties.customAmiId));
  errors.collect(cdk.propertyValidator("ebsRootVolumeIops", cdk.validateNumber)(properties.ebsRootVolumeIops));
  errors.collect(cdk.propertyValidator("ebsRootVolumeSize", cdk.validateNumber)(properties.ebsRootVolumeSize));
  errors.collect(cdk.propertyValidator("ebsRootVolumeThroughput", cdk.validateNumber)(properties.ebsRootVolumeThroughput));
  errors.collect(cdk.propertyValidator("instances", cdk.requiredValidator)(properties.instances));
  errors.collect(cdk.propertyValidator("instances", CfnClusterJobFlowInstancesConfigPropertyValidator)(properties.instances));
  errors.collect(cdk.propertyValidator("jobFlowRole", cdk.requiredValidator)(properties.jobFlowRole));
  errors.collect(cdk.propertyValidator("jobFlowRole", cdk.validateString)(properties.jobFlowRole));
  errors.collect(cdk.propertyValidator("kerberosAttributes", CfnClusterKerberosAttributesPropertyValidator)(properties.kerberosAttributes));
  errors.collect(cdk.propertyValidator("logEncryptionKmsKeyId", cdk.validateString)(properties.logEncryptionKmsKeyId));
  errors.collect(cdk.propertyValidator("logUri", cdk.validateString)(properties.logUri));
  errors.collect(cdk.propertyValidator("managedScalingPolicy", CfnClusterManagedScalingPolicyPropertyValidator)(properties.managedScalingPolicy));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("osReleaseLabel", cdk.validateString)(properties.osReleaseLabel));
  errors.collect(cdk.propertyValidator("placementGroupConfigs", cdk.listValidator(CfnClusterPlacementGroupConfigPropertyValidator))(properties.placementGroupConfigs));
  errors.collect(cdk.propertyValidator("releaseLabel", cdk.validateString)(properties.releaseLabel));
  errors.collect(cdk.propertyValidator("scaleDownBehavior", cdk.validateString)(properties.scaleDownBehavior));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.validateString)(properties.securityConfiguration));
  errors.collect(cdk.propertyValidator("serviceRole", cdk.requiredValidator)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("serviceRole", cdk.validateString)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("stepConcurrencyLevel", cdk.validateNumber)(properties.stepConcurrencyLevel));
  errors.collect(cdk.propertyValidator("steps", cdk.listValidator(CfnClusterStepConfigPropertyValidator))(properties.steps));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("visibleToAllUsers", cdk.validateBoolean)(properties.visibleToAllUsers));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "AdditionalInfo": cdk.objectToCloudFormation(properties.additionalInfo),
    "Applications": cdk.listMapper(convertCfnClusterApplicationPropertyToCloudFormation)(properties.applications),
    "AutoScalingRole": cdk.stringToCloudFormation(properties.autoScalingRole),
    "AutoTerminationPolicy": convertCfnClusterAutoTerminationPolicyPropertyToCloudFormation(properties.autoTerminationPolicy),
    "BootstrapActions": cdk.listMapper(convertCfnClusterBootstrapActionConfigPropertyToCloudFormation)(properties.bootstrapActions),
    "Configurations": cdk.listMapper(convertCfnClusterConfigurationPropertyToCloudFormation)(properties.configurations),
    "CustomAmiId": cdk.stringToCloudFormation(properties.customAmiId),
    "EbsRootVolumeIops": cdk.numberToCloudFormation(properties.ebsRootVolumeIops),
    "EbsRootVolumeSize": cdk.numberToCloudFormation(properties.ebsRootVolumeSize),
    "EbsRootVolumeThroughput": cdk.numberToCloudFormation(properties.ebsRootVolumeThroughput),
    "Instances": convertCfnClusterJobFlowInstancesConfigPropertyToCloudFormation(properties.instances),
    "JobFlowRole": cdk.stringToCloudFormation(properties.jobFlowRole),
    "KerberosAttributes": convertCfnClusterKerberosAttributesPropertyToCloudFormation(properties.kerberosAttributes),
    "LogEncryptionKmsKeyId": cdk.stringToCloudFormation(properties.logEncryptionKmsKeyId),
    "LogUri": cdk.stringToCloudFormation(properties.logUri),
    "ManagedScalingPolicy": convertCfnClusterManagedScalingPolicyPropertyToCloudFormation(properties.managedScalingPolicy),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OSReleaseLabel": cdk.stringToCloudFormation(properties.osReleaseLabel),
    "PlacementGroupConfigs": cdk.listMapper(convertCfnClusterPlacementGroupConfigPropertyToCloudFormation)(properties.placementGroupConfigs),
    "ReleaseLabel": cdk.stringToCloudFormation(properties.releaseLabel),
    "ScaleDownBehavior": cdk.stringToCloudFormation(properties.scaleDownBehavior),
    "SecurityConfiguration": cdk.stringToCloudFormation(properties.securityConfiguration),
    "ServiceRole": cdk.stringToCloudFormation(properties.serviceRole),
    "StepConcurrencyLevel": cdk.numberToCloudFormation(properties.stepConcurrencyLevel),
    "Steps": cdk.listMapper(convertCfnClusterStepConfigPropertyToCloudFormation)(properties.steps),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VisibleToAllUsers": cdk.booleanToCloudFormation(properties.visibleToAllUsers)
  };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
  ret.addPropertyResult("additionalInfo", "AdditionalInfo", (properties.AdditionalInfo != null ? cfn_parse.FromCloudFormation.getAny(properties.AdditionalInfo) : undefined));
  ret.addPropertyResult("applications", "Applications", (properties.Applications != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterApplicationPropertyFromCloudFormation)(properties.Applications) : undefined));
  ret.addPropertyResult("autoScalingRole", "AutoScalingRole", (properties.AutoScalingRole != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingRole) : undefined));
  ret.addPropertyResult("autoTerminationPolicy", "AutoTerminationPolicy", (properties.AutoTerminationPolicy != null ? CfnClusterAutoTerminationPolicyPropertyFromCloudFormation(properties.AutoTerminationPolicy) : undefined));
  ret.addPropertyResult("bootstrapActions", "BootstrapActions", (properties.BootstrapActions != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterBootstrapActionConfigPropertyFromCloudFormation)(properties.BootstrapActions) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("customAmiId", "CustomAmiId", (properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined));
  ret.addPropertyResult("ebsRootVolumeIops", "EbsRootVolumeIops", (properties.EbsRootVolumeIops != null ? cfn_parse.FromCloudFormation.getNumber(properties.EbsRootVolumeIops) : undefined));
  ret.addPropertyResult("ebsRootVolumeSize", "EbsRootVolumeSize", (properties.EbsRootVolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.EbsRootVolumeSize) : undefined));
  ret.addPropertyResult("ebsRootVolumeThroughput", "EbsRootVolumeThroughput", (properties.EbsRootVolumeThroughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.EbsRootVolumeThroughput) : undefined));
  ret.addPropertyResult("instances", "Instances", (properties.Instances != null ? CfnClusterJobFlowInstancesConfigPropertyFromCloudFormation(properties.Instances) : undefined));
  ret.addPropertyResult("jobFlowRole", "JobFlowRole", (properties.JobFlowRole != null ? cfn_parse.FromCloudFormation.getString(properties.JobFlowRole) : undefined));
  ret.addPropertyResult("kerberosAttributes", "KerberosAttributes", (properties.KerberosAttributes != null ? CfnClusterKerberosAttributesPropertyFromCloudFormation(properties.KerberosAttributes) : undefined));
  ret.addPropertyResult("logEncryptionKmsKeyId", "LogEncryptionKmsKeyId", (properties.LogEncryptionKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.LogEncryptionKmsKeyId) : undefined));
  ret.addPropertyResult("logUri", "LogUri", (properties.LogUri != null ? cfn_parse.FromCloudFormation.getString(properties.LogUri) : undefined));
  ret.addPropertyResult("managedScalingPolicy", "ManagedScalingPolicy", (properties.ManagedScalingPolicy != null ? CfnClusterManagedScalingPolicyPropertyFromCloudFormation(properties.ManagedScalingPolicy) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("osReleaseLabel", "OSReleaseLabel", (properties.OSReleaseLabel != null ? cfn_parse.FromCloudFormation.getString(properties.OSReleaseLabel) : undefined));
  ret.addPropertyResult("placementGroupConfigs", "PlacementGroupConfigs", (properties.PlacementGroupConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterPlacementGroupConfigPropertyFromCloudFormation)(properties.PlacementGroupConfigs) : undefined));
  ret.addPropertyResult("releaseLabel", "ReleaseLabel", (properties.ReleaseLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ReleaseLabel) : undefined));
  ret.addPropertyResult("scaleDownBehavior", "ScaleDownBehavior", (properties.ScaleDownBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.ScaleDownBehavior) : undefined));
  ret.addPropertyResult("securityConfiguration", "SecurityConfiguration", (properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityConfiguration) : undefined));
  ret.addPropertyResult("serviceRole", "ServiceRole", (properties.ServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRole) : undefined));
  ret.addPropertyResult("stepConcurrencyLevel", "StepConcurrencyLevel", (properties.StepConcurrencyLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.StepConcurrencyLevel) : undefined));
  ret.addPropertyResult("steps", "Steps", (properties.Steps != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterStepConfigPropertyFromCloudFormation)(properties.Steps) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("visibleToAllUsers", "VisibleToAllUsers", (properties.VisibleToAllUsers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.VisibleToAllUsers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use `InstanceFleetConfig` to define instance fleets for an EMR cluster.
 *
 * A cluster can not use both instance fleets and instance groups. For more information, see [Configure Instance Fleets](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. > You can currently only add a task instance fleet to a cluster with this resource. If you use this resource, CloudFormation waits for the cluster launch to complete before adding the task instance fleet to the cluster. In order to add a task instance fleet to the cluster as part of the cluster launch and minimize delays in provisioning task nodes, use the `TaskInstanceFleets` subproperty for the [AWS::EMR::Cluster JobFlowInstancesConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html) property instead. To use this subproperty, see [AWS::EMR::Cluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html) for examples.
 *
 * @cloudformationResource AWS::EMR::InstanceFleetConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html
 */
export class CfnInstanceFleetConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::InstanceFleetConfig";

  /**
   * Build a CfnInstanceFleetConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceFleetConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstanceFleetConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstanceFleetConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique identifier of the EMR cluster.
   */
  public clusterId: string;

  /**
   * The node type that the instance fleet hosts.
   */
  public instanceFleetType: string;

  /**
   * `InstanceTypeConfigs` determine the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
   */
  public instanceTypeConfigs?: Array<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The launch specification for the instance fleet.
   */
  public launchSpecifications?: CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable;

  /**
   * The friendly name of the instance fleet.
   */
  public name?: string;

  /**
   * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision.
   */
  public targetOnDemandCapacity?: number;

  /**
   * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision.
   */
  public targetSpotCapacity?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceFleetConfigProps) {
    super(scope, id, {
      "type": CfnInstanceFleetConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterId", this);
    cdk.requireProperty(props, "instanceFleetType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.clusterId = props.clusterId;
    this.instanceFleetType = props.instanceFleetType;
    this.instanceTypeConfigs = props.instanceTypeConfigs;
    this.launchSpecifications = props.launchSpecifications;
    this.name = props.name;
    this.targetOnDemandCapacity = props.targetOnDemandCapacity;
    this.targetSpotCapacity = props.targetSpotCapacity;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterId": this.clusterId,
      "instanceFleetType": this.instanceFleetType,
      "instanceTypeConfigs": this.instanceTypeConfigs,
      "launchSpecifications": this.launchSpecifications,
      "name": this.name,
      "targetOnDemandCapacity": this.targetOnDemandCapacity,
      "targetSpotCapacity": this.targetSpotCapacity
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceFleetConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceFleetConfigPropsToCloudFormation(props);
  }
}

export namespace CfnInstanceFleetConfig {
  /**
   * `InstanceType` config is a subproperty of `InstanceFleetConfig` .
   *
   * An instance type configuration specifies each instance type in an instance fleet. The configuration determines the EC2 instances Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html
   */
  export interface InstanceTypeConfigProperty {
    /**
     * The bid price for each Amazon EC2 Spot Instance type as defined by `InstanceType` .
     *
     * Expressed in USD. If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-bidprice
     */
    readonly bidPrice?: string;

    /**
     * The bid price, as a percentage of On-Demand price, for each Amazon EC2 Spot Instance as defined by `InstanceType` .
     *
     * Expressed as a number (for example, 20 specifies 20%). If neither `BidPrice` nor `BidPriceAsPercentageOfOnDemandPrice` is provided, `BidPriceAsPercentageOfOnDemandPrice` defaults to 100%.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-bidpriceaspercentageofondemandprice
     */
    readonly bidPriceAsPercentageOfOnDemandPrice?: number;

    /**
     * > Amazon EMR releases 4.x or later.
     *
     * An optional configuration specification to be used when provisioning cluster instances, which can include configurations for applications and software bundled with Amazon EMR. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-configurations
     */
    readonly configurations?: Array<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The custom AMI ID to use for the instance type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-customamiid
     */
    readonly customAmiId?: string;

    /**
     * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by `InstanceType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-ebsconfiguration
     */
    readonly ebsConfiguration?: CfnInstanceFleetConfig.EbsConfigurationProperty | cdk.IResolvable;

    /**
     * An Amazon EC2 instance type, such as `m3.xlarge` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-instancetype
     */
    readonly instanceType: string;

    /**
     * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in `InstanceFleetConfig` .
     *
     * This value is 1 for a master instance fleet, and must be 1 or greater for core and task instance fleets. Defaults to 1 if not specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancetypeconfig.html#cfn-emr-instancefleetconfig-instancetypeconfig-weightedcapacity
     */
    readonly weightedCapacity?: number;
  }

  /**
   * > Used only with Amazon EMR release 4.0 and later.
   *
   * `Configuration` specifies optional configurations for customizing open-source big data applications and environment parameters. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) in the *Amazon EMR Release Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-configuration.html
   */
  export interface ConfigurationProperty {
    /**
     * The classification within a configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-configuration.html#cfn-emr-instancefleetconfig-configuration-classification
     */
    readonly classification?: string;

    /**
     * Within a configuration classification, a set of properties that represent the settings that you want to change in the configuration file.
     *
     * Duplicates not allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-configuration.html#cfn-emr-instancefleetconfig-configuration-configurationproperties
     */
    readonly configurationProperties?: cdk.IResolvable | Record<string, string>;

    /**
     * A list of additional configurations to apply within a configuration object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-configuration.html#cfn-emr-instancefleetconfig-configuration-configurations
     */
    readonly configurations?: Array<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsconfiguration.html
   */
  export interface EbsConfigurationProperty {
    /**
     * An array of Amazon EBS volume specifications attached to a cluster instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsconfiguration.html#cfn-emr-instancefleetconfig-ebsconfiguration-ebsblockdeviceconfigs
     */
    readonly ebsBlockDeviceConfigs?: Array<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether an Amazon EBS volume is EBS-optimized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsconfiguration.html#cfn-emr-instancefleetconfig-ebsconfiguration-ebsoptimized
     */
    readonly ebsOptimized?: boolean | cdk.IResolvable;
  }

  /**
   * `EbsBlockDeviceConfig` is a subproperty of the `EbsConfiguration` property type.
   *
   * `EbsBlockDeviceConfig` defines the number and type of EBS volumes to associate with all EC2 instances in an EMR cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsblockdeviceconfig.html
   */
  export interface EbsBlockDeviceConfigProperty {
    /**
     * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an Amazon EC2 instance in the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsblockdeviceconfig.html#cfn-emr-instancefleetconfig-ebsblockdeviceconfig-volumespecification
     */
    readonly volumeSpecification: cdk.IResolvable | CfnInstanceFleetConfig.VolumeSpecificationProperty;

    /**
     * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ebsblockdeviceconfig.html#cfn-emr-instancefleetconfig-ebsblockdeviceconfig-volumesperinstance
     */
    readonly volumesPerInstance?: number;
  }

  /**
   * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type.
   *
   * `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-volumespecification.html
   */
  export interface VolumeSpecificationProperty {
    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-volumespecification.html#cfn-emr-instancefleetconfig-volumespecification-iops
     */
    readonly iops?: number;

    /**
     * The volume size, in gibibytes (GiB).
     *
     * This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-volumespecification.html#cfn-emr-instancefleetconfig-volumespecification-sizeingb
     */
    readonly sizeInGb: number;

    /**
     * The throughput, in mebibyte per second (MiB/s).
     *
     * This optional parameter can be a number from 125 - 1000 and is valid only for gp3 volumes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-volumespecification.html#cfn-emr-instancefleetconfig-volumespecification-throughput
     */
    readonly throughput?: number;

    /**
     * The volume type.
     *
     * Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-volumespecification.html#cfn-emr-instancefleetconfig-volumespecification-volumetype
     */
    readonly volumeType: string;
  }

  /**
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * `InstanceTypeConfig` is a sub-property of `InstanceFleetConfig` . `InstanceTypeConfig` determines the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancefleetprovisioningspecifications.html
   */
  export interface InstanceFleetProvisioningSpecificationsProperty {
    /**
     * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
     *
     * > The instance fleet configuration is available only in Amazon EMR releases 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR releases 5.12.1 and later.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancefleetprovisioningspecifications.html#cfn-emr-instancefleetconfig-instancefleetprovisioningspecifications-ondemandspecification
     */
    readonly onDemandSpecification?: cdk.IResolvable | CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty;

    /**
     * The launch specification for Spot instances in the fleet, which determines the defined duration, provisioning timeout behavior, and allocation strategy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-instancefleetprovisioningspecifications.html#cfn-emr-instancefleetconfig-instancefleetprovisioningspecifications-spotspecification
     */
    readonly spotSpecification?: cdk.IResolvable | CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty;
  }

  /**
   * The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.
   *
   * > The instance fleet configuration is available only in Amazon EMR releases 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR releases 5.12.1 and later.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ondemandprovisioningspecification.html
   */
  export interface OnDemandProvisioningSpecificationProperty {
    /**
     * Specifies the strategy to use in launching On-Demand instance fleets.
     *
     * Currently, the only option is `lowest-price` (the default), which launches the lowest price first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-ondemandprovisioningspecification.html#cfn-emr-instancefleetconfig-ondemandprovisioningspecification-allocationstrategy
     */
    readonly allocationStrategy: string;
  }

  /**
   * `SpotProvisioningSpecification` is a subproperty of the `InstanceFleetProvisioningSpecifications` property type.
   *
   * `SpotProvisioningSpecification` determines the launch specification for Spot instances in the instance fleet, which includes the defined duration and provisioning timeout behavior.
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-spotprovisioningspecification.html
   */
  export interface SpotProvisioningSpecificationProperty {
    /**
     * Specifies one of the following strategies to launch Spot Instance fleets: `price-capacity-optimized` , `capacity-optimized` , `lowest-price` , or `diversified` .
     *
     * For more information on the provisioning strategies, see [Allocation strategies for Spot Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * > When you launch a Spot Instance fleet with the old console, it automatically launches with the `capacity-optimized` strategy. You can't change the allocation strategy from the old console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-spotprovisioningspecification.html#cfn-emr-instancefleetconfig-spotprovisioningspecification-allocationstrategy
     */
    readonly allocationStrategy?: string;

    /**
     * The defined duration for Spot Instances (also known as Spot blocks) in minutes.
     *
     * When specified, the Spot Instance does not terminate before the defined duration expires, and defined duration pricing for Spot Instances applies. Valid values are 60, 120, 180, 240, 300, or 360. The duration period starts as soon as a Spot Instance receives its instance ID. At the end of the duration, Amazon EC2 marks the Spot Instance for termination and provides a Spot Instance termination notice, which gives the instance a two-minute warning before it terminates.
     *
     * > Spot Instances with a defined duration (also known as Spot blocks) are no longer available to new customers from July 1, 2021. For customers who have previously used the feature, we will continue to support Spot Instances with a defined duration until December 31, 2022.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-spotprovisioningspecification.html#cfn-emr-instancefleetconfig-spotprovisioningspecification-blockdurationminutes
     */
    readonly blockDurationMinutes?: number;

    /**
     * The action to take when `TargetSpotCapacity` has not been fulfilled when the `TimeoutDurationMinutes` has expired;
     *
     * that is, when all Spot Instances could not be provisioned within the Spot provisioning timeout. Valid values are `TERMINATE_CLUSTER` and `SWITCH_TO_ON_DEMAND` . SWITCH_TO_ON_DEMAND specifies that if no Spot Instances are available, On-Demand Instances should be provisioned to fulfill any remaining Spot capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-spotprovisioningspecification.html#cfn-emr-instancefleetconfig-spotprovisioningspecification-timeoutaction
     */
    readonly timeoutAction: string;

    /**
     * The Spot provisioning timeout period in minutes.
     *
     * If Spot Instances are not provisioned within this time period, the `TimeOutAction` is taken. Minimum value is 5 and maximum value is 1440. The timeout applies only during initial provisioning, when the cluster is first created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancefleetconfig-spotprovisioningspecification.html#cfn-emr-instancefleetconfig-spotprovisioningspecification-timeoutdurationminutes
     */
    readonly timeoutDurationMinutes: number;
  }
}

/**
 * Properties for defining a `CfnInstanceFleetConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html
 */
export interface CfnInstanceFleetConfigProps {
  /**
   * The unique identifier of the EMR cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-clusterid
   */
  readonly clusterId: string;

  /**
   * The node type that the instance fleet hosts.
   *
   * *Allowed Values* : TASK
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-instancefleettype
   */
  readonly instanceFleetType: string;

  /**
   * `InstanceTypeConfigs` determine the EC2 instances that Amazon EMR attempts to provision to fulfill On-Demand and Spot target capacities.
   *
   * > The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-instancetypeconfigs
   */
  readonly instanceTypeConfigs?: Array<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The launch specification for the instance fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-launchspecifications
   */
  readonly launchSpecifications?: CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable;

  /**
   * The friendly name of the instance fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-name
   */
  readonly name?: string;

  /**
   * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand instances to provision.
   *
   * When the instance fleet launches, Amazon EMR tries to provision On-Demand instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When an On-Demand instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
   *
   * > If not specified or set to 0, only Spot instances are provisioned for the instance fleet using `TargetSpotCapacity` . At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-targetondemandcapacity
   */
  readonly targetOnDemandCapacity?: number;

  /**
   * The target capacity of Spot units for the instance fleet, which determines how many Spot instances to provision.
   *
   * When the instance fleet launches, Amazon EMR tries to provision Spot instances as specified by `InstanceTypeConfig` . Each instance configuration has a specified `WeightedCapacity` . When a Spot instance is provisioned, the `WeightedCapacity` units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a `WeightedCapacity` of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.
   *
   * > If not specified or set to 0, only On-Demand instances are provisioned for the instance fleet. At least one of `TargetSpotCapacity` and `TargetOnDemandCapacity` should be greater than 0. For a master instance fleet, only one of `TargetSpotCapacity` and `TargetOnDemandCapacity` can be specified, and its value must be 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancefleetconfig.html#cfn-emr-instancefleetconfig-targetspotcapacity
   */
  readonly targetSpotCapacity?: number;
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("configurationProperties", cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnInstanceFleetConfigConfigurationPropertyValidator))(properties.configurations));
  return errors.wrap("supplied properties not correct for \"ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "ConfigurationProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
    "Configurations": cdk.listMapper(convertCfnInstanceFleetConfigConfigurationPropertyToCloudFormation)(properties.configurations)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.ConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.ConfigurationProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("configurationProperties", "ConfigurationProperties", (properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigVolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.requiredValidator)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.validateNumber)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeType", cdk.requiredValidator)(properties.volumeType));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"VolumeSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigVolumeSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigVolumeSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "SizeInGB": cdk.numberToCloudFormation(properties.sizeInGb),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceFleetConfig.VolumeSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.VolumeSpecificationProperty>();
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("sizeInGb", "SizeInGB", (properties.SizeInGB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("volumeSpecification", cdk.requiredValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumeSpecification", CfnInstanceFleetConfigVolumeSpecificationPropertyValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumesPerInstance", cdk.validateNumber)(properties.volumesPerInstance));
  return errors.wrap("supplied properties not correct for \"EbsBlockDeviceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
  return {
    "VolumeSpecification": convertCfnInstanceFleetConfigVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
    "VolumesPerInstance": cdk.numberToCloudFormation(properties.volumesPerInstance)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.EbsBlockDeviceConfigProperty>();
  ret.addPropertyResult("volumeSpecification", "VolumeSpecification", (properties.VolumeSpecification != null ? CfnInstanceFleetConfigVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification) : undefined));
  ret.addPropertyResult("volumesPerInstance", "VolumesPerInstance", (properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsBlockDeviceConfigs", cdk.listValidator(CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
  errors.collect(cdk.propertyValidator("ebsOptimized", cdk.validateBoolean)(properties.ebsOptimized));
  return errors.wrap("supplied properties not correct for \"EbsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigEbsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigEbsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EbsBlockDeviceConfigs": cdk.listMapper(convertCfnInstanceFleetConfigEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
    "EbsOptimized": cdk.booleanToCloudFormation(properties.ebsOptimized)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.EbsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.EbsConfigurationProperty>();
  ret.addPropertyResult("ebsBlockDeviceConfigs", "EbsBlockDeviceConfigs", (properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined));
  ret.addPropertyResult("ebsOptimized", "EbsOptimized", (properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bidPrice", cdk.validateString)(properties.bidPrice));
  errors.collect(cdk.propertyValidator("bidPriceAsPercentageOfOnDemandPrice", cdk.validateNumber)(properties.bidPriceAsPercentageOfOnDemandPrice));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnInstanceFleetConfigConfigurationPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("customAmiId", cdk.validateString)(properties.customAmiId));
  errors.collect(cdk.propertyValidator("ebsConfiguration", CfnInstanceFleetConfigEbsConfigurationPropertyValidator)(properties.ebsConfiguration));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("weightedCapacity", cdk.validateNumber)(properties.weightedCapacity));
  return errors.wrap("supplied properties not correct for \"InstanceTypeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigInstanceTypeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigInstanceTypeConfigPropertyValidator(properties).assertSuccess();
  return {
    "BidPrice": cdk.stringToCloudFormation(properties.bidPrice),
    "BidPriceAsPercentageOfOnDemandPrice": cdk.numberToCloudFormation(properties.bidPriceAsPercentageOfOnDemandPrice),
    "Configurations": cdk.listMapper(convertCfnInstanceFleetConfigConfigurationPropertyToCloudFormation)(properties.configurations),
    "CustomAmiId": cdk.stringToCloudFormation(properties.customAmiId),
    "EbsConfiguration": convertCfnInstanceFleetConfigEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "WeightedCapacity": cdk.numberToCloudFormation(properties.weightedCapacity)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.InstanceTypeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.InstanceTypeConfigProperty>();
  ret.addPropertyResult("bidPrice", "BidPrice", (properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined));
  ret.addPropertyResult("bidPriceAsPercentageOfOnDemandPrice", "BidPriceAsPercentageOfOnDemandPrice", (properties.BidPriceAsPercentageOfOnDemandPrice != null ? cfn_parse.FromCloudFormation.getNumber(properties.BidPriceAsPercentageOfOnDemandPrice) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("customAmiId", "CustomAmiId", (properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined));
  ret.addPropertyResult("ebsConfiguration", "EbsConfiguration", (properties.EbsConfiguration != null ? CfnInstanceFleetConfigEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("weightedCapacity", "WeightedCapacity", (properties.WeightedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.WeightedCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnDemandProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `OnDemandProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.requiredValidator)(properties.allocationStrategy));
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.validateString)(properties.allocationStrategy));
  return errors.wrap("supplied properties not correct for \"OnDemandProvisioningSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllocationStrategy": cdk.stringToCloudFormation(properties.allocationStrategy)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.OnDemandProvisioningSpecificationProperty>();
  ret.addPropertyResult("allocationStrategy", "AllocationStrategy", (properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SpotProvisioningSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SpotProvisioningSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.validateString)(properties.allocationStrategy));
  errors.collect(cdk.propertyValidator("blockDurationMinutes", cdk.validateNumber)(properties.blockDurationMinutes));
  errors.collect(cdk.propertyValidator("timeoutAction", cdk.requiredValidator)(properties.timeoutAction));
  errors.collect(cdk.propertyValidator("timeoutAction", cdk.validateString)(properties.timeoutAction));
  errors.collect(cdk.propertyValidator("timeoutDurationMinutes", cdk.requiredValidator)(properties.timeoutDurationMinutes));
  errors.collect(cdk.propertyValidator("timeoutDurationMinutes", cdk.validateNumber)(properties.timeoutDurationMinutes));
  return errors.wrap("supplied properties not correct for \"SpotProvisioningSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigSpotProvisioningSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllocationStrategy": cdk.stringToCloudFormation(properties.allocationStrategy),
    "BlockDurationMinutes": cdk.numberToCloudFormation(properties.blockDurationMinutes),
    "TimeoutAction": cdk.stringToCloudFormation(properties.timeoutAction),
    "TimeoutDurationMinutes": cdk.numberToCloudFormation(properties.timeoutDurationMinutes)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.SpotProvisioningSpecificationProperty>();
  ret.addPropertyResult("allocationStrategy", "AllocationStrategy", (properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined));
  ret.addPropertyResult("blockDurationMinutes", "BlockDurationMinutes", (properties.BlockDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockDurationMinutes) : undefined));
  ret.addPropertyResult("timeoutAction", "TimeoutAction", (properties.TimeoutAction != null ? cfn_parse.FromCloudFormation.getString(properties.TimeoutAction) : undefined));
  ret.addPropertyResult("timeoutDurationMinutes", "TimeoutDurationMinutes", (properties.TimeoutDurationMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutDurationMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceFleetProvisioningSpecificationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onDemandSpecification", CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyValidator)(properties.onDemandSpecification));
  errors.collect(cdk.propertyValidator("spotSpecification", CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyValidator)(properties.spotSpecification));
  return errors.wrap("supplied properties not correct for \"InstanceFleetProvisioningSpecificationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyValidator(properties).assertSuccess();
  return {
    "OnDemandSpecification": convertCfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyToCloudFormation(properties.onDemandSpecification),
    "SpotSpecification": convertCfnInstanceFleetConfigSpotProvisioningSpecificationPropertyToCloudFormation(properties.spotSpecification)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfig.InstanceFleetProvisioningSpecificationsProperty>();
  ret.addPropertyResult("onDemandSpecification", "OnDemandSpecification", (properties.OnDemandSpecification != null ? CfnInstanceFleetConfigOnDemandProvisioningSpecificationPropertyFromCloudFormation(properties.OnDemandSpecification) : undefined));
  ret.addPropertyResult("spotSpecification", "SpotSpecification", (properties.SpotSpecification != null ? CfnInstanceFleetConfigSpotProvisioningSpecificationPropertyFromCloudFormation(properties.SpotSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceFleetConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceFleetConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceFleetConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterId", cdk.requiredValidator)(properties.clusterId));
  errors.collect(cdk.propertyValidator("clusterId", cdk.validateString)(properties.clusterId));
  errors.collect(cdk.propertyValidator("instanceFleetType", cdk.requiredValidator)(properties.instanceFleetType));
  errors.collect(cdk.propertyValidator("instanceFleetType", cdk.validateString)(properties.instanceFleetType));
  errors.collect(cdk.propertyValidator("instanceTypeConfigs", cdk.listValidator(CfnInstanceFleetConfigInstanceTypeConfigPropertyValidator))(properties.instanceTypeConfigs));
  errors.collect(cdk.propertyValidator("launchSpecifications", CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyValidator)(properties.launchSpecifications));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("targetOnDemandCapacity", cdk.validateNumber)(properties.targetOnDemandCapacity));
  errors.collect(cdk.propertyValidator("targetSpotCapacity", cdk.validateNumber)(properties.targetSpotCapacity));
  return errors.wrap("supplied properties not correct for \"CfnInstanceFleetConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceFleetConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceFleetConfigPropsValidator(properties).assertSuccess();
  return {
    "ClusterId": cdk.stringToCloudFormation(properties.clusterId),
    "InstanceFleetType": cdk.stringToCloudFormation(properties.instanceFleetType),
    "InstanceTypeConfigs": cdk.listMapper(convertCfnInstanceFleetConfigInstanceTypeConfigPropertyToCloudFormation)(properties.instanceTypeConfigs),
    "LaunchSpecifications": convertCfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyToCloudFormation(properties.launchSpecifications),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TargetOnDemandCapacity": cdk.numberToCloudFormation(properties.targetOnDemandCapacity),
    "TargetSpotCapacity": cdk.numberToCloudFormation(properties.targetSpotCapacity)
  };
}

// @ts-ignore TS6133
function CfnInstanceFleetConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceFleetConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceFleetConfigProps>();
  ret.addPropertyResult("clusterId", "ClusterId", (properties.ClusterId != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterId) : undefined));
  ret.addPropertyResult("instanceFleetType", "InstanceFleetType", (properties.InstanceFleetType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceFleetType) : undefined));
  ret.addPropertyResult("instanceTypeConfigs", "InstanceTypeConfigs", (properties.InstanceTypeConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceFleetConfigInstanceTypeConfigPropertyFromCloudFormation)(properties.InstanceTypeConfigs) : undefined));
  ret.addPropertyResult("launchSpecifications", "LaunchSpecifications", (properties.LaunchSpecifications != null ? CfnInstanceFleetConfigInstanceFleetProvisioningSpecificationsPropertyFromCloudFormation(properties.LaunchSpecifications) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("targetOnDemandCapacity", "TargetOnDemandCapacity", (properties.TargetOnDemandCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetOnDemandCapacity) : undefined));
  ret.addPropertyResult("targetSpotCapacity", "TargetSpotCapacity", (properties.TargetSpotCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetSpotCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use `InstanceGroupConfig` to define instance groups for an EMR cluster.
 *
 * A cluster can not use both instance groups and instance fleets. For more information, see [Create a Cluster with Instance Fleets or Uniform Instance Groups](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-instance-group-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * > You can currently only add task instance groups to a cluster with this resource. If you use this resource, CloudFormation waits for the cluster launch to complete before adding the task instance group to the cluster. In order to add task instance groups to the cluster as part of the cluster launch and minimize delays in provisioning task nodes, use the `TaskInstanceGroups` subproperty for the [AWS::EMR::Cluster JobFlowInstancesConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-jobflowinstancesconfig.html) property instead. To use this subproperty, see [AWS::EMR::Cluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html) for examples.
 *
 * @cloudformationResource AWS::EMR::InstanceGroupConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html
 */
export class CfnInstanceGroupConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::InstanceGroupConfig";

  /**
   * Build a CfnInstanceGroupConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceGroupConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstanceGroupConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstanceGroupConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` .
   */
  public autoScalingPolicy?: CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable;

  /**
   * If specified, indicates that the instance group uses Spot Instances.
   */
  public bidPrice?: string;

  /**
   * > Amazon EMR releases 4.x or later.
   */
  public configurations?: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The custom AMI ID to use for the provisioned instance group.
   */
  public customAmiId?: string;

  /**
   * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
   */
  public ebsConfiguration?: CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable;

  /**
   * Target number of instances for the instance group.
   */
  public instanceCount: number;

  /**
   * The role of the instance group in the cluster.
   */
  public instanceRole: string;

  /**
   * The Amazon EC2 instance type for all instances in the instance group.
   */
  public instanceType: string;

  /**
   * The ID of an Amazon EMR cluster that you want to associate this instance group with.
   */
  public jobFlowId: string;

  /**
   * Market type of the Amazon EC2 instances used to create a cluster node.
   */
  public market?: string;

  /**
   * Friendly name given to the instance group.
   */
  public name?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceGroupConfigProps) {
    super(scope, id, {
      "type": CfnInstanceGroupConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceCount", this);
    cdk.requireProperty(props, "instanceRole", this);
    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "jobFlowId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.autoScalingPolicy = props.autoScalingPolicy;
    this.bidPrice = props.bidPrice;
    this.configurations = props.configurations;
    this.customAmiId = props.customAmiId;
    this.ebsConfiguration = props.ebsConfiguration;
    this.instanceCount = props.instanceCount;
    this.instanceRole = props.instanceRole;
    this.instanceType = props.instanceType;
    this.jobFlowId = props.jobFlowId;
    this.market = props.market;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingPolicy": this.autoScalingPolicy,
      "bidPrice": this.bidPrice,
      "configurations": this.configurations,
      "customAmiId": this.customAmiId,
      "ebsConfiguration": this.ebsConfiguration,
      "instanceCount": this.instanceCount,
      "instanceRole": this.instanceRole,
      "instanceType": this.instanceType,
      "jobFlowId": this.jobFlowId,
      "market": this.market,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceGroupConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceGroupConfigPropsToCloudFormation(props);
  }
}

export namespace CfnInstanceGroupConfig {
  /**
   * `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric.
   *
   * For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-autoscalingpolicy.html
   */
  export interface AutoScalingPolicyProperty {
    /**
     * The upper and lower Amazon EC2 instance limits for an automatic scaling policy.
     *
     * Automatic scaling activity will not cause an instance group to grow above or below these limits.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-autoscalingpolicy.html#cfn-emr-instancegroupconfig-autoscalingpolicy-constraints
     */
    readonly constraints: cdk.IResolvable | CfnInstanceGroupConfig.ScalingConstraintsProperty;

    /**
     * The scale-in and scale-out rules that comprise the automatic scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-autoscalingpolicy.html#cfn-emr-instancegroupconfig-autoscalingpolicy-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnInstanceGroupConfig.ScalingRuleProperty> | cdk.IResolvable;
  }

  /**
   * `ScalingConstraints` is a subproperty of the `AutoScalingPolicy` property type.
   *
   * `ScalingConstraints` defines the upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activities triggered by automatic scaling rules will not cause an instance group to grow above or shrink below these limits.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingconstraints.html
   */
  export interface ScalingConstraintsProperty {
    /**
     * The upper boundary of Amazon EC2 instances in an instance group beyond which scaling activities are not allowed to grow.
     *
     * Scale-out activities will not add instances beyond this boundary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingconstraints.html#cfn-emr-instancegroupconfig-scalingconstraints-maxcapacity
     */
    readonly maxCapacity: number;

    /**
     * The lower boundary of Amazon EC2 instances in an instance group below which scaling activities are not allowed to shrink.
     *
     * Scale-in activities will not terminate instances below this boundary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingconstraints.html#cfn-emr-instancegroupconfig-scalingconstraints-mincapacity
     */
    readonly minCapacity: number;
  }

  /**
   * `ScalingRule` is a subproperty of the `AutoScalingPolicy` property type.
   *
   * `ScalingRule` defines the scale-in or scale-out rules for scaling activity, including the CloudWatch metric alarm that triggers activity, how EC2 instances are added or removed, and the periodicity of adjustments. The automatic scaling policy for an instance group can comprise one or more automatic scaling rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingrule.html
   */
  export interface ScalingRuleProperty {
    /**
     * The conditions that trigger an automatic scaling activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingrule.html#cfn-emr-instancegroupconfig-scalingrule-action
     */
    readonly action: cdk.IResolvable | CfnInstanceGroupConfig.ScalingActionProperty;

    /**
     * A friendly, more verbose description of the automatic scaling rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingrule.html#cfn-emr-instancegroupconfig-scalingrule-description
     */
    readonly description?: string;

    /**
     * The name used to identify an automatic scaling rule.
     *
     * Rule names must be unique within a scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingrule.html#cfn-emr-instancegroupconfig-scalingrule-name
     */
    readonly name: string;

    /**
     * The CloudWatch alarm definition that determines when automatic scaling activity is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingrule.html#cfn-emr-instancegroupconfig-scalingrule-trigger
     */
    readonly trigger: cdk.IResolvable | CfnInstanceGroupConfig.ScalingTriggerProperty;
  }

  /**
   * `ScalingAction` is a subproperty of the `ScalingRule` property type.
   *
   * `ScalingAction` determines the type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingaction.html
   */
  export interface ScalingActionProperty {
    /**
     * Not available for instance groups.
     *
     * Instance groups use the market type specified for the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingaction.html#cfn-emr-instancegroupconfig-scalingaction-market
     */
    readonly market?: string;

    /**
     * The type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingaction.html#cfn-emr-instancegroupconfig-scalingaction-simplescalingpolicyconfiguration
     */
    readonly simpleScalingPolicyConfiguration: cdk.IResolvable | CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty;
  }

  /**
   * `SimpleScalingPolicyConfiguration` is a subproperty of the `ScalingAction` property type.
   *
   * `SimpleScalingPolicyConfiguration` determines how an automatic scaling action adds or removes instances, the cooldown period, and the number of EC2 instances that are added each time the CloudWatch metric alarm condition is satisfied.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-simplescalingpolicyconfiguration.html
   */
  export interface SimpleScalingPolicyConfigurationProperty {
    /**
     * The way in which Amazon EC2 instances are added (if `ScalingAdjustment` is a positive number) or terminated (if `ScalingAdjustment` is a negative number) each time the scaling activity is triggered.
     *
     * `CHANGE_IN_CAPACITY` is the default. `CHANGE_IN_CAPACITY` indicates that the Amazon EC2 instance count increments or decrements by `ScalingAdjustment` , which should be expressed as an integer. `PERCENT_CHANGE_IN_CAPACITY` indicates the instance count increments or decrements by the percentage specified by `ScalingAdjustment` , which should be expressed as an integer. For example, 20 indicates an increase in 20% increments of cluster capacity. `EXACT_CAPACITY` indicates the scaling activity results in an instance group with the number of Amazon EC2 instances specified by `ScalingAdjustment` , which should be expressed as a positive integer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-emr-instancegroupconfig-simplescalingpolicyconfiguration-adjustmenttype
     */
    readonly adjustmentType?: string;

    /**
     * The amount of time, in seconds, after a scaling activity completes before any further trigger-related scaling activities can start.
     *
     * The default value is 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-emr-instancegroupconfig-simplescalingpolicyconfiguration-cooldown
     */
    readonly coolDown?: number;

    /**
     * The amount by which to scale in or scale out, based on the specified `AdjustmentType` .
     *
     * A positive value adds to the instance group's Amazon EC2 instance count while a negative number removes instances. If `AdjustmentType` is set to `EXACT_CAPACITY` , the number should only be a positive integer. If `AdjustmentType` is set to `PERCENT_CHANGE_IN_CAPACITY` , the value should express the percentage as an integer. For example, -20 indicates a decrease in 20% increments of cluster capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-emr-instancegroupconfig-simplescalingpolicyconfiguration-scalingadjustment
     */
    readonly scalingAdjustment: number;
  }

  /**
   * `ScalingTrigger` is a subproperty of the `ScalingRule` property type.
   *
   * `ScalingTrigger` determines the conditions that trigger an automatic scaling activity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingtrigger.html
   */
  export interface ScalingTriggerProperty {
    /**
     * The definition of a CloudWatch metric alarm.
     *
     * When the defined alarm conditions are met along with other trigger parameters, scaling activity begins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-scalingtrigger.html#cfn-emr-instancegroupconfig-scalingtrigger-cloudwatchalarmdefinition
     */
    readonly cloudWatchAlarmDefinition: CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty | cdk.IResolvable;
  }

  /**
   * `CloudWatchAlarmDefinition` is a subproperty of the `ScalingTrigger` property, which determines when to trigger an automatic scaling activity.
   *
   * Scaling activity begins when you satisfy the defined alarm conditions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html
   */
  export interface CloudWatchAlarmDefinitionProperty {
    /**
     * Determines how the metric specified by `MetricName` is compared to the value specified by `Threshold` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * A CloudWatch metric dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnInstanceGroupConfig.MetricDimensionProperty> | cdk.IResolvable;

    /**
     * The number of periods, in five-minute increments, during which the alarm condition must exist before the alarm triggers automatic scaling activity.
     *
     * The default value is `1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-evaluationperiods
     */
    readonly evaluationPeriods?: number;

    /**
     * The name of the CloudWatch metric that is watched to determine an alarm condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-metricname
     */
    readonly metricName: string;

    /**
     * The namespace for the CloudWatch metric.
     *
     * The default is `AWS/ElasticMapReduce` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-namespace
     */
    readonly namespace?: string;

    /**
     * The period, in seconds, over which the statistic is applied.
     *
     * CloudWatch metrics for Amazon EMR are emitted every five minutes (300 seconds), so if you specify a CloudWatch metric, specify `300` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-period
     */
    readonly period: number;

    /**
     * The statistic to apply to the metric associated with the alarm.
     *
     * The default is `AVERAGE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-statistic
     */
    readonly statistic?: string;

    /**
     * The value against which the specified statistic is compared.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-threshold
     */
    readonly threshold: number;

    /**
     * The unit of measure associated with the CloudWatch metric being watched.
     *
     * The value specified for `Unit` must correspond to the units specified in the CloudWatch metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-cloudwatchalarmdefinition.html#cfn-emr-instancegroupconfig-cloudwatchalarmdefinition-unit
     */
    readonly unit?: string;
  }

  /**
   * `MetricDimension` is a subproperty of the `CloudWatchAlarmDefinition` property type.
   *
   * `MetricDimension` specifies a CloudWatch dimension, which is specified with a `Key` `Value` pair. The key is known as a `Name` in CloudWatch. By default, Amazon EMR uses one dimension whose `Key` is `JobFlowID` and `Value` is a variable representing the cluster ID, which is `${emr.clusterId}` . This enables the automatic scaling rule for EMR to bootstrap when the cluster ID becomes available during cluster creation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * The dimension name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-metricdimension.html#cfn-emr-instancegroupconfig-metricdimension-key
     */
    readonly key: string;

    /**
     * The dimension value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-metricdimension.html#cfn-emr-instancegroupconfig-metricdimension-value
     */
    readonly value: string;
  }

  /**
   * `Configurations` is a property of the `AWS::EMR::Cluster` resource that specifies the configuration of applications on an Amazon EMR cluster.
   *
   * Configurations are optional. You can use them to have EMR customize applications and software bundled with Amazon EMR when a cluster is created. A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file. For more information, see [Configuring Applications](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html) .
   *
   * > Applies only to Amazon EMR releases 4.0 and later.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-configuration.html
   */
  export interface ConfigurationProperty {
    /**
     * The classification within a configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-configuration.html#cfn-emr-instancegroupconfig-configuration-classification
     */
    readonly classification?: string;

    /**
     * Within a configuration classification, a set of properties that represent the settings that you want to change in the configuration file.
     *
     * Duplicates not allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-configuration.html#cfn-emr-instancegroupconfig-configuration-configurationproperties
     */
    readonly configurationProperties?: cdk.IResolvable | Record<string, string>;

    /**
     * A list of additional configurations to apply within a configuration object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-configuration.html#cfn-emr-instancegroupconfig-configuration-configurations
     */
    readonly configurations?: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The Amazon EBS configuration of a cluster instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsconfiguration.html
   */
  export interface EbsConfigurationProperty {
    /**
     * An array of Amazon EBS volume specifications attached to a cluster instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsconfiguration.html#cfn-emr-instancegroupconfig-ebsconfiguration-ebsblockdeviceconfigs
     */
    readonly ebsBlockDeviceConfigs?: Array<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether an Amazon EBS volume is EBS-optimized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsconfiguration.html#cfn-emr-instancegroupconfig-ebsconfiguration-ebsoptimized
     */
    readonly ebsOptimized?: boolean | cdk.IResolvable;
  }

  /**
   * Configuration of requested EBS block device associated with the instance group with count of volumes that are associated to every instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsblockdeviceconfig.html
   */
  export interface EbsBlockDeviceConfigProperty {
    /**
     * EBS volume specifications such as volume type, IOPS, size (GiB) and throughput (MiB/s) that are requested for the EBS volume attached to an Amazon EC2 instance in the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsblockdeviceconfig.html#cfn-emr-instancegroupconfig-ebsblockdeviceconfig-volumespecification
     */
    readonly volumeSpecification: cdk.IResolvable | CfnInstanceGroupConfig.VolumeSpecificationProperty;

    /**
     * Number of EBS volumes with a specific volume configuration that are associated with every instance in the instance group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-ebsblockdeviceconfig.html#cfn-emr-instancegroupconfig-ebsblockdeviceconfig-volumesperinstance
     */
    readonly volumesPerInstance?: number;
  }

  /**
   * `VolumeSpecification` is a subproperty of the `EbsBlockDeviceConfig` property type.
   *
   * `VolumeSecification` determines the volume type, IOPS, and size (GiB) for EBS volumes attached to EC2 instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-volumespecification.html
   */
  export interface VolumeSpecificationProperty {
    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-volumespecification.html#cfn-emr-instancegroupconfig-volumespecification-iops
     */
    readonly iops?: number;

    /**
     * The volume size, in gibibytes (GiB).
     *
     * This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-volumespecification.html#cfn-emr-instancegroupconfig-volumespecification-sizeingb
     */
    readonly sizeInGb: number;

    /**
     * The throughput, in mebibyte per second (MiB/s).
     *
     * This optional parameter can be a number from 125 - 1000 and is valid only for gp3 volumes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-volumespecification.html#cfn-emr-instancegroupconfig-volumespecification-throughput
     */
    readonly throughput?: number;

    /**
     * The volume type.
     *
     * Volume types supported are gp3, gp2, io1, st1, sc1, and standard.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-instancegroupconfig-volumespecification.html#cfn-emr-instancegroupconfig-volumespecification-volumetype
     */
    readonly volumeType: string;
  }
}

/**
 * Properties for defining a `CfnInstanceGroupConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html
 */
export interface CfnInstanceGroupConfigProps {
  /**
   * `AutoScalingPolicy` is a subproperty of `InstanceGroupConfig` .
   *
   * `AutoScalingPolicy` defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. For more information, see [Using Automatic Scaling in Amazon EMR](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-automatic-scaling.html) in the *Amazon EMR Management Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-autoscalingpolicy
   */
  readonly autoScalingPolicy?: CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable;

  /**
   * If specified, indicates that the instance group uses Spot Instances.
   *
   * This is the maximum price you are willing to pay for Spot Instances. Specify `OnDemandPrice` to set the amount equal to the On-Demand price, or specify an amount in USD.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-bidprice
   */
  readonly bidPrice?: string;

  /**
   * > Amazon EMR releases 4.x or later.
   *
   * The list of configurations supplied for an Amazon EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-configurations
   */
  readonly configurations?: Array<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The custom AMI ID to use for the provisioned instance group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-customamiid
   */
  readonly customAmiId?: string;

  /**
   * `EbsConfiguration` determines the EBS volumes to attach to EMR cluster instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-ebsconfiguration
   */
  readonly ebsConfiguration?: CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable;

  /**
   * Target number of instances for the instance group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancecount
   */
  readonly instanceCount: number;

  /**
   * The role of the instance group in the cluster.
   *
   * *Allowed Values* : TASK
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancerole
   */
  readonly instanceRole: string;

  /**
   * The Amazon EC2 instance type for all instances in the instance group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-instancetype
   */
  readonly instanceType: string;

  /**
   * The ID of an Amazon EMR cluster that you want to associate this instance group with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-jobflowid
   */
  readonly jobFlowId: string;

  /**
   * Market type of the Amazon EC2 instances used to create a cluster node.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-market
   */
  readonly market?: string;

  /**
   * Friendly name given to the instance group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html#cfn-emr-instancegroupconfig-name
   */
  readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `ScalingConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.requiredValidator)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.requiredValidator)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  return errors.wrap("supplied properties not correct for \"ScalingConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigScalingConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigScalingConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.ScalingConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingConstraintsProperty>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SimpleScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adjustmentType", cdk.validateString)(properties.adjustmentType));
  errors.collect(cdk.propertyValidator("coolDown", cdk.validateNumber)(properties.coolDown));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.requiredValidator)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  return errors.wrap("supplied properties not correct for \"SimpleScalingPolicyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdjustmentType": cdk.stringToCloudFormation(properties.adjustmentType),
    "CoolDown": cdk.numberToCloudFormation(properties.coolDown),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.SimpleScalingPolicyConfigurationProperty>();
  ret.addPropertyResult("adjustmentType", "AdjustmentType", (properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined));
  ret.addPropertyResult("coolDown", "CoolDown", (properties.CoolDown != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoolDown) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("market", cdk.validateString)(properties.market));
  errors.collect(cdk.propertyValidator("simpleScalingPolicyConfiguration", cdk.requiredValidator)(properties.simpleScalingPolicyConfiguration));
  errors.collect(cdk.propertyValidator("simpleScalingPolicyConfiguration", CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyValidator)(properties.simpleScalingPolicyConfiguration));
  return errors.wrap("supplied properties not correct for \"ScalingActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigScalingActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigScalingActionPropertyValidator(properties).assertSuccess();
  return {
    "Market": cdk.stringToCloudFormation(properties.market),
    "SimpleScalingPolicyConfiguration": convertCfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyToCloudFormation(properties.simpleScalingPolicyConfiguration)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.ScalingActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingActionProperty>();
  ret.addPropertyResult("market", "Market", (properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined));
  ret.addPropertyResult("simpleScalingPolicyConfiguration", "SimpleScalingPolicyConfiguration", (properties.SimpleScalingPolicyConfiguration != null ? CfnInstanceGroupConfigSimpleScalingPolicyConfigurationPropertyFromCloudFormation(properties.SimpleScalingPolicyConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.MetricDimensionProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchAlarmDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchAlarmDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnInstanceGroupConfigMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("evaluationPeriods", cdk.validateNumber)(properties.evaluationPeriods));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("period", cdk.requiredValidator)(properties.period));
  errors.collect(cdk.propertyValidator("period", cdk.validateNumber)(properties.period));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"CloudWatchAlarmDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "Dimensions": cdk.listMapper(convertCfnInstanceGroupConfigMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "EvaluationPeriods": cdk.numberToCloudFormation(properties.evaluationPeriods),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Period": cdk.numberToCloudFormation(properties.period),
    "Statistic": cdk.stringToCloudFormation(properties.statistic),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.CloudWatchAlarmDefinitionProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("evaluationPeriods", "EvaluationPeriods", (properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingTriggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingTriggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchAlarmDefinition", cdk.requiredValidator)(properties.cloudWatchAlarmDefinition));
  errors.collect(cdk.propertyValidator("cloudWatchAlarmDefinition", CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyValidator)(properties.cloudWatchAlarmDefinition));
  return errors.wrap("supplied properties not correct for \"ScalingTriggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigScalingTriggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigScalingTriggerPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchAlarmDefinition": convertCfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyToCloudFormation(properties.cloudWatchAlarmDefinition)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.ScalingTriggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingTriggerProperty>();
  ret.addPropertyResult("cloudWatchAlarmDefinition", "CloudWatchAlarmDefinition", (properties.CloudWatchAlarmDefinition != null ? CfnInstanceGroupConfigCloudWatchAlarmDefinitionPropertyFromCloudFormation(properties.CloudWatchAlarmDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnInstanceGroupConfigScalingActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("trigger", cdk.requiredValidator)(properties.trigger));
  errors.collect(cdk.propertyValidator("trigger", CfnInstanceGroupConfigScalingTriggerPropertyValidator)(properties.trigger));
  return errors.wrap("supplied properties not correct for \"ScalingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigScalingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigScalingRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnInstanceGroupConfigScalingActionPropertyToCloudFormation(properties.action),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Trigger": convertCfnInstanceGroupConfigScalingTriggerPropertyToCloudFormation(properties.trigger)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigScalingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.ScalingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ScalingRuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnInstanceGroupConfigScalingActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("trigger", "Trigger", (properties.Trigger != null ? CfnInstanceGroupConfigScalingTriggerPropertyFromCloudFormation(properties.Trigger) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigAutoScalingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constraints", cdk.requiredValidator)(properties.constraints));
  errors.collect(cdk.propertyValidator("constraints", CfnInstanceGroupConfigScalingConstraintsPropertyValidator)(properties.constraints));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnInstanceGroupConfigScalingRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"AutoScalingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigAutoScalingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigAutoScalingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Constraints": convertCfnInstanceGroupConfigScalingConstraintsPropertyToCloudFormation(properties.constraints),
    "Rules": cdk.listMapper(convertCfnInstanceGroupConfigScalingRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigAutoScalingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.AutoScalingPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.AutoScalingPolicyProperty>();
  ret.addPropertyResult("constraints", "Constraints", (properties.Constraints != null ? CfnInstanceGroupConfigScalingConstraintsPropertyFromCloudFormation(properties.Constraints) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigScalingRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("configurationProperties", cdk.hashValidator(cdk.validateString))(properties.configurationProperties));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnInstanceGroupConfigConfigurationPropertyValidator))(properties.configurations));
  return errors.wrap("supplied properties not correct for \"ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "ConfigurationProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurationProperties),
    "Configurations": cdk.listMapper(convertCfnInstanceGroupConfigConfigurationPropertyToCloudFormation)(properties.configurations)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.ConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.ConfigurationProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("configurationProperties", "ConfigurationProperties", (properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConfigurationProperties) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigVolumeSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.requiredValidator)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.validateNumber)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeType", cdk.requiredValidator)(properties.volumeType));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"VolumeSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigVolumeSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigVolumeSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "SizeInGB": cdk.numberToCloudFormation(properties.sizeInGb),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigVolumeSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceGroupConfig.VolumeSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.VolumeSpecificationProperty>();
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("sizeInGb", "SizeInGB", (properties.SizeInGB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGB) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("volumeSpecification", cdk.requiredValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumeSpecification", CfnInstanceGroupConfigVolumeSpecificationPropertyValidator)(properties.volumeSpecification));
  errors.collect(cdk.propertyValidator("volumesPerInstance", cdk.validateNumber)(properties.volumesPerInstance));
  return errors.wrap("supplied properties not correct for \"EbsBlockDeviceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigEbsBlockDeviceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyValidator(properties).assertSuccess();
  return {
    "VolumeSpecification": convertCfnInstanceGroupConfigVolumeSpecificationPropertyToCloudFormation(properties.volumeSpecification),
    "VolumesPerInstance": cdk.numberToCloudFormation(properties.volumesPerInstance)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.EbsBlockDeviceConfigProperty>();
  ret.addPropertyResult("volumeSpecification", "VolumeSpecification", (properties.VolumeSpecification != null ? CfnInstanceGroupConfigVolumeSpecificationPropertyFromCloudFormation(properties.VolumeSpecification) : undefined));
  ret.addPropertyResult("volumesPerInstance", "VolumesPerInstance", (properties.VolumesPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumesPerInstance) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsBlockDeviceConfigs", cdk.listValidator(CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyValidator))(properties.ebsBlockDeviceConfigs));
  errors.collect(cdk.propertyValidator("ebsOptimized", cdk.validateBoolean)(properties.ebsOptimized));
  return errors.wrap("supplied properties not correct for \"EbsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigEbsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigEbsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EbsBlockDeviceConfigs": cdk.listMapper(convertCfnInstanceGroupConfigEbsBlockDeviceConfigPropertyToCloudFormation)(properties.ebsBlockDeviceConfigs),
    "EbsOptimized": cdk.booleanToCloudFormation(properties.ebsOptimized)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigEbsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfig.EbsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfig.EbsConfigurationProperty>();
  ret.addPropertyResult("ebsBlockDeviceConfigs", "EbsBlockDeviceConfigs", (properties.EbsBlockDeviceConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigEbsBlockDeviceConfigPropertyFromCloudFormation)(properties.EbsBlockDeviceConfigs) : undefined));
  ret.addPropertyResult("ebsOptimized", "EbsOptimized", (properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceGroupConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceGroupConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceGroupConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingPolicy", CfnInstanceGroupConfigAutoScalingPolicyPropertyValidator)(properties.autoScalingPolicy));
  errors.collect(cdk.propertyValidator("bidPrice", cdk.validateString)(properties.bidPrice));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnInstanceGroupConfigConfigurationPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("customAmiId", cdk.validateString)(properties.customAmiId));
  errors.collect(cdk.propertyValidator("ebsConfiguration", CfnInstanceGroupConfigEbsConfigurationPropertyValidator)(properties.ebsConfiguration));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.requiredValidator)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.validateNumber)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceRole", cdk.requiredValidator)(properties.instanceRole));
  errors.collect(cdk.propertyValidator("instanceRole", cdk.validateString)(properties.instanceRole));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("jobFlowId", cdk.requiredValidator)(properties.jobFlowId));
  errors.collect(cdk.propertyValidator("jobFlowId", cdk.validateString)(properties.jobFlowId));
  errors.collect(cdk.propertyValidator("market", cdk.validateString)(properties.market));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnInstanceGroupConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceGroupConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceGroupConfigPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingPolicy": convertCfnInstanceGroupConfigAutoScalingPolicyPropertyToCloudFormation(properties.autoScalingPolicy),
    "BidPrice": cdk.stringToCloudFormation(properties.bidPrice),
    "Configurations": cdk.listMapper(convertCfnInstanceGroupConfigConfigurationPropertyToCloudFormation)(properties.configurations),
    "CustomAmiId": cdk.stringToCloudFormation(properties.customAmiId),
    "EbsConfiguration": convertCfnInstanceGroupConfigEbsConfigurationPropertyToCloudFormation(properties.ebsConfiguration),
    "InstanceCount": cdk.numberToCloudFormation(properties.instanceCount),
    "InstanceRole": cdk.stringToCloudFormation(properties.instanceRole),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "JobFlowId": cdk.stringToCloudFormation(properties.jobFlowId),
    "Market": cdk.stringToCloudFormation(properties.market),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnInstanceGroupConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceGroupConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceGroupConfigProps>();
  ret.addPropertyResult("autoScalingPolicy", "AutoScalingPolicy", (properties.AutoScalingPolicy != null ? CfnInstanceGroupConfigAutoScalingPolicyPropertyFromCloudFormation(properties.AutoScalingPolicy) : undefined));
  ret.addPropertyResult("bidPrice", "BidPrice", (properties.BidPrice != null ? cfn_parse.FromCloudFormation.getString(properties.BidPrice) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceGroupConfigConfigurationPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("customAmiId", "CustomAmiId", (properties.CustomAmiId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAmiId) : undefined));
  ret.addPropertyResult("ebsConfiguration", "EbsConfiguration", (properties.EbsConfiguration != null ? CfnInstanceGroupConfigEbsConfigurationPropertyFromCloudFormation(properties.EbsConfiguration) : undefined));
  ret.addPropertyResult("instanceCount", "InstanceCount", (properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined));
  ret.addPropertyResult("instanceRole", "InstanceRole", (properties.InstanceRole != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRole) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("jobFlowId", "JobFlowId", (properties.JobFlowId != null ? cfn_parse.FromCloudFormation.getString(properties.JobFlowId) : undefined));
  ret.addPropertyResult("market", "Market", (properties.Market != null ? cfn_parse.FromCloudFormation.getString(properties.Market) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use a `SecurityConfiguration` resource to configure data encryption, Kerberos authentication (available in Amazon EMR release version 5.10.0 and later), and Amazon S3 authorization for EMRFS (available in EMR 5.10.0 and later). You can re-use a security configuration for any number of clusters in your account. For more information and example security configuration JSON objects, see [Create a Security Configuration](https://docs.aws.amazon.com//emr/latest/ManagementGuide/emr-create-security-configuration.html) in the *Amazon EMR Management Guide* .
 *
 * @cloudformationResource AWS::EMR::SecurityConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html
 */
export class CfnSecurityConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::SecurityConfiguration";

  /**
   * Build a CfnSecurityConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the security configuration.
   */
  public name?: string;

  /**
   * The security configuration details in JSON format.
   */
  public securityConfiguration: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityConfigurationProps) {
    super(scope, id, {
      "type": CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "securityConfiguration", this);

    this.name = props.name;
    this.securityConfiguration = props.securityConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "securityConfiguration": this.securityConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSecurityConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html
 */
export interface CfnSecurityConfigurationProps {
  /**
   * The name of the security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-name
   */
  readonly name?: string;

  /**
   * The security configuration details in JSON format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html#cfn-emr-securityconfiguration-securityconfiguration
   */
  readonly securityConfiguration: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.requiredValidator)(properties.securityConfiguration));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.validateObject)(properties.securityConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnSecurityConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SecurityConfiguration": cdk.objectToCloudFormation(properties.securityConfiguration)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfigurationProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("securityConfiguration", "SecurityConfiguration", (properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.SecurityConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use `Step` to specify a cluster (job flow) step, which runs only on the master node.
 *
 * Steps are used to submit data processing jobs to a cluster.
 *
 * @cloudformationResource AWS::EMR::Step
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html
 */
export class CfnStep extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::Step";

  /**
   * Build a CfnStep from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStep {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStepPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStep(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the cluster step.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * This specifies what action to take when the cluster step fails.
   */
  public actionOnFailure: string;

  /**
   * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed.
   */
  public hadoopJarStep: CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable;

  /**
   * A string that uniquely identifies the cluster (job flow).
   */
  public jobFlowId: string;

  /**
   * The name of the cluster step.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStepProps) {
    super(scope, id, {
      "type": CfnStep.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actionOnFailure", this);
    cdk.requireProperty(props, "hadoopJarStep", this);
    cdk.requireProperty(props, "jobFlowId", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.actionOnFailure = props.actionOnFailure;
    this.hadoopJarStep = props.hadoopJarStep;
    this.jobFlowId = props.jobFlowId;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actionOnFailure": this.actionOnFailure,
      "hadoopJarStep": this.hadoopJarStep,
      "jobFlowId": this.jobFlowId,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStep.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStepPropsToCloudFormation(props);
  }
}

export namespace CfnStep {
  /**
   * A job flow step consisting of a JAR file whose main function will be executed.
   *
   * The main function submits a job for Hadoop to execute and waits for the job to finish or fail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-hadoopjarstepconfig.html
   */
  export interface HadoopJarStepConfigProperty {
    /**
     * A list of command line arguments passed to the JAR file's main function when executed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-hadoopjarstepconfig.html#cfn-emr-step-hadoopjarstepconfig-args
     */
    readonly args?: Array<string>;

    /**
     * A path to a JAR file run during the step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-hadoopjarstepconfig.html#cfn-emr-step-hadoopjarstepconfig-jar
     */
    readonly jar: string;

    /**
     * The name of the main class in the specified Java file.
     *
     * If not specified, the JAR file should specify a Main-Class in its manifest file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-hadoopjarstepconfig.html#cfn-emr-step-hadoopjarstepconfig-mainclass
     */
    readonly mainClass?: string;

    /**
     * A list of Java properties that are set when the step runs.
     *
     * You can use these properties to pass key value pairs to your main function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-hadoopjarstepconfig.html#cfn-emr-step-hadoopjarstepconfig-stepproperties
     */
    readonly stepProperties?: Array<cdk.IResolvable | CfnStep.KeyValueProperty> | cdk.IResolvable;
  }

  /**
   * `KeyValue` is a subproperty of the `HadoopJarStepConfig` property type.
   *
   * `KeyValue` is used to pass parameters to a step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-keyvalue.html
   */
  export interface KeyValueProperty {
    /**
     * The unique identifier of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-keyvalue.html#cfn-emr-step-keyvalue-key
     */
    readonly key?: string;

    /**
     * The value part of the identified key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-step-keyvalue.html#cfn-emr-step-keyvalue-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnStep`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html
 */
export interface CfnStepProps {
  /**
   * This specifies what action to take when the cluster step fails.
   *
   * Possible values are `CANCEL_AND_WAIT` and `CONTINUE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-emr-step-actiononfailure
   */
  readonly actionOnFailure: string;

  /**
   * The `HadoopJarStepConfig` property type specifies a job flow step consisting of a JAR file whose main function will be executed.
   *
   * The main function submits a job for the cluster to execute as a step on the master node, and then waits for the job to finish or fail before executing subsequent steps.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-emr-step-hadoopjarstep
   */
  readonly hadoopJarStep: CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable;

  /**
   * A string that uniquely identifies the cluster (job flow).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-emr-step-jobflowid
   */
  readonly jobFlowId: string;

  /**
   * The name of the cluster step.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-step.html#cfn-emr-step-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `KeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStepKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KeyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnStepKeyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStepKeyValuePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnStepKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStep.KeyValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStep.KeyValueProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HadoopJarStepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HadoopJarStepConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStepHadoopJarStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("args", cdk.listValidator(cdk.validateString))(properties.args));
  errors.collect(cdk.propertyValidator("jar", cdk.requiredValidator)(properties.jar));
  errors.collect(cdk.propertyValidator("jar", cdk.validateString)(properties.jar));
  errors.collect(cdk.propertyValidator("mainClass", cdk.validateString)(properties.mainClass));
  errors.collect(cdk.propertyValidator("stepProperties", cdk.listValidator(CfnStepKeyValuePropertyValidator))(properties.stepProperties));
  return errors.wrap("supplied properties not correct for \"HadoopJarStepConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnStepHadoopJarStepConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStepHadoopJarStepConfigPropertyValidator(properties).assertSuccess();
  return {
    "Args": cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
    "Jar": cdk.stringToCloudFormation(properties.jar),
    "MainClass": cdk.stringToCloudFormation(properties.mainClass),
    "StepProperties": cdk.listMapper(convertCfnStepKeyValuePropertyToCloudFormation)(properties.stepProperties)
  };
}

// @ts-ignore TS6133
function CfnStepHadoopJarStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStep.HadoopJarStepConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStep.HadoopJarStepConfigProperty>();
  ret.addPropertyResult("args", "Args", (properties.Args != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Args) : undefined));
  ret.addPropertyResult("jar", "Jar", (properties.Jar != null ? cfn_parse.FromCloudFormation.getString(properties.Jar) : undefined));
  ret.addPropertyResult("mainClass", "MainClass", (properties.MainClass != null ? cfn_parse.FromCloudFormation.getString(properties.MainClass) : undefined));
  ret.addPropertyResult("stepProperties", "StepProperties", (properties.StepProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnStepKeyValuePropertyFromCloudFormation)(properties.StepProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStepProps`
 *
 * @param properties - the TypeScript properties of a `CfnStepProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStepPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionOnFailure", cdk.requiredValidator)(properties.actionOnFailure));
  errors.collect(cdk.propertyValidator("actionOnFailure", cdk.validateString)(properties.actionOnFailure));
  errors.collect(cdk.propertyValidator("hadoopJarStep", cdk.requiredValidator)(properties.hadoopJarStep));
  errors.collect(cdk.propertyValidator("hadoopJarStep", CfnStepHadoopJarStepConfigPropertyValidator)(properties.hadoopJarStep));
  errors.collect(cdk.propertyValidator("jobFlowId", cdk.requiredValidator)(properties.jobFlowId));
  errors.collect(cdk.propertyValidator("jobFlowId", cdk.validateString)(properties.jobFlowId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnStepProps\"");
}

// @ts-ignore TS6133
function convertCfnStepPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStepPropsValidator(properties).assertSuccess();
  return {
    "ActionOnFailure": cdk.stringToCloudFormation(properties.actionOnFailure),
    "HadoopJarStep": convertCfnStepHadoopJarStepConfigPropertyToCloudFormation(properties.hadoopJarStep),
    "JobFlowId": cdk.stringToCloudFormation(properties.jobFlowId),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnStepPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStepProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStepProps>();
  ret.addPropertyResult("actionOnFailure", "ActionOnFailure", (properties.ActionOnFailure != null ? cfn_parse.FromCloudFormation.getString(properties.ActionOnFailure) : undefined));
  ret.addPropertyResult("hadoopJarStep", "HadoopJarStep", (properties.HadoopJarStep != null ? CfnStepHadoopJarStepConfigPropertyFromCloudFormation(properties.HadoopJarStep) : undefined));
  ret.addPropertyResult("jobFlowId", "JobFlowId", (properties.JobFlowId != null ? cfn_parse.FromCloudFormation.getString(properties.JobFlowId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::EMR::Studio` resource specifies an Amazon EMR Studio.
 *
 * An EMR Studio is a web-based, integrated development environment for fully managed Jupyter notebooks that run on Amazon EMR clusters. For more information, see the [*Amazon EMR Management Guide*](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-studio.html) .
 *
 * @cloudformationResource AWS::EMR::Studio
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html
 */
export class CfnStudio extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::Studio";

  /**
   * Build a CfnStudio from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudio {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStudioPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStudio(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Amazon EMR Studio. For example: `arn:aws:elasticmapreduce:us-east-1:653XXXXXXXXX:studio/es-EXAMPLE12345678XXXXXXXXXXX` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the Amazon EMR Studio. For example: `es-EXAMPLE12345678XXXXXXXXXXX` .
   *
   * @cloudformationAttribute StudioId
   */
  public readonly attrStudioId: string;

  /**
   * The unique access URL of the Amazon EMR Studio. For example: `https://es-EXAMPLE12345678XXXXXXXXXXX.emrstudio-prod.us-east-1.amazonaws.com` .
   *
   * @cloudformationAttribute Url
   */
  public readonly attrUrl: string;

  /**
   * Specifies whether the Studio authenticates users using IAM Identity Center or IAM.
   */
  public authMode: string;

  /**
   * The Amazon S3 location to back up EMR Studio Workspaces and notebook files.
   */
  public defaultS3Location: string;

  /**
   * A detailed description of the Amazon EMR Studio.
   */
  public description?: string;

  /**
   * The AWS KMS key identifier (ARN) used to encrypt Amazon EMR Studio workspace and notebook files when backed up to Amazon S3.
   */
  public encryptionKeyArn?: string;

  /**
   * The ID of the Amazon EMR Studio Engine security group.
   */
  public engineSecurityGroupId: string;

  /**
   * The ARN of the IAM Identity Center instance the Studio application belongs to.
   */
  public idcInstanceArn?: string;

  /**
   * Indicates whether the Studio has `REQUIRED` or `OPTIONAL` IAM Identity Center user assignment.
   */
  public idcUserAssignment?: string;

  /**
   * Your identity provider's authentication endpoint.
   */
  public idpAuthUrl?: string;

  /**
   * The name of your identity provider's `RelayState` parameter.
   */
  public idpRelayStateParameterName?: string;

  /**
   * A descriptive name for the Amazon EMR Studio.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that will be assumed by the Amazon EMR Studio.
   */
  public serviceRole: string;

  /**
   * A list of subnet IDs to associate with the Amazon EMR Studio.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the Studio has Trusted identity propagation enabled.
   */
  public trustedIdentityPropagationEnabled?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM user role that will be assumed by users and groups logged in to a Studio.
   */
  public userRole?: string;

  /**
   * The ID of the Amazon Virtual Private Cloud (Amazon VPC) to associate with the Studio.
   */
  public vpcId: string;

  /**
   * The ID of the Workspace security group associated with the Amazon EMR Studio.
   */
  public workspaceSecurityGroupId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStudioProps) {
    super(scope, id, {
      "type": CfnStudio.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authMode", this);
    cdk.requireProperty(props, "defaultS3Location", this);
    cdk.requireProperty(props, "engineSecurityGroupId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "serviceRole", this);
    cdk.requireProperty(props, "subnetIds", this);
    cdk.requireProperty(props, "vpcId", this);
    cdk.requireProperty(props, "workspaceSecurityGroupId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrStudioId = cdk.Token.asString(this.getAtt("StudioId", cdk.ResolutionTypeHint.STRING));
    this.attrUrl = cdk.Token.asString(this.getAtt("Url", cdk.ResolutionTypeHint.STRING));
    this.authMode = props.authMode;
    this.defaultS3Location = props.defaultS3Location;
    this.description = props.description;
    this.encryptionKeyArn = props.encryptionKeyArn;
    this.engineSecurityGroupId = props.engineSecurityGroupId;
    this.idcInstanceArn = props.idcInstanceArn;
    this.idcUserAssignment = props.idcUserAssignment;
    this.idpAuthUrl = props.idpAuthUrl;
    this.idpRelayStateParameterName = props.idpRelayStateParameterName;
    this.name = props.name;
    this.serviceRole = props.serviceRole;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMR::Studio", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.trustedIdentityPropagationEnabled = props.trustedIdentityPropagationEnabled;
    this.userRole = props.userRole;
    this.vpcId = props.vpcId;
    this.workspaceSecurityGroupId = props.workspaceSecurityGroupId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authMode": this.authMode,
      "defaultS3Location": this.defaultS3Location,
      "description": this.description,
      "encryptionKeyArn": this.encryptionKeyArn,
      "engineSecurityGroupId": this.engineSecurityGroupId,
      "idcInstanceArn": this.idcInstanceArn,
      "idcUserAssignment": this.idcUserAssignment,
      "idpAuthUrl": this.idpAuthUrl,
      "idpRelayStateParameterName": this.idpRelayStateParameterName,
      "name": this.name,
      "serviceRole": this.serviceRole,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags(),
      "trustedIdentityPropagationEnabled": this.trustedIdentityPropagationEnabled,
      "userRole": this.userRole,
      "vpcId": this.vpcId,
      "workspaceSecurityGroupId": this.workspaceSecurityGroupId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudio.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStudioPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStudio`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html
 */
export interface CfnStudioProps {
  /**
   * Specifies whether the Studio authenticates users using IAM Identity Center or IAM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-authmode
   */
  readonly authMode: string;

  /**
   * The Amazon S3 location to back up EMR Studio Workspaces and notebook files.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-defaults3location
   */
  readonly defaultS3Location: string;

  /**
   * A detailed description of the Amazon EMR Studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-description
   */
  readonly description?: string;

  /**
   * The AWS KMS key identifier (ARN) used to encrypt Amazon EMR Studio workspace and notebook files when backed up to Amazon S3.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-encryptionkeyarn
   */
  readonly encryptionKeyArn?: string;

  /**
   * The ID of the Amazon EMR Studio Engine security group.
   *
   * The Engine security group allows inbound network traffic from the Workspace security group, and it must be in the same VPC specified by `VpcId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-enginesecuritygroupid
   */
  readonly engineSecurityGroupId: string;

  /**
   * The ARN of the IAM Identity Center instance the Studio application belongs to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idcinstancearn
   */
  readonly idcInstanceArn?: string;

  /**
   * Indicates whether the Studio has `REQUIRED` or `OPTIONAL` IAM Identity Center user assignment.
   *
   * If the value is set to `REQUIRED` , users must be explicitly assigned to the Studio application to access the Studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idcuserassignment
   */
  readonly idcUserAssignment?: string;

  /**
   * Your identity provider's authentication endpoint.
   *
   * Amazon EMR Studio redirects federated users to this endpoint for authentication when logging in to a Studio with the Studio URL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idpauthurl
   */
  readonly idpAuthUrl?: string;

  /**
   * The name of your identity provider's `RelayState` parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-idprelaystateparametername
   */
  readonly idpRelayStateParameterName?: string;

  /**
   * A descriptive name for the Amazon EMR Studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that will be assumed by the Amazon EMR Studio.
   *
   * The service role provides a way for Amazon EMR Studio to interoperate with other AWS services.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-servicerole
   */
  readonly serviceRole: string;

  /**
   * A list of subnet IDs to associate with the Amazon EMR Studio.
   *
   * A Studio can have a maximum of 5 subnets. The subnets must belong to the VPC specified by `VpcId` . Studio users can create a Workspace in any of the specified subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the Studio has Trusted identity propagation enabled.
   *
   * The default value is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-trustedidentitypropagationenabled
   */
  readonly trustedIdentityPropagationEnabled?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM user role that will be assumed by users and groups logged in to a Studio.
   *
   * The permissions attached to this IAM role can be scoped down for each user or group using session policies. You only need to specify `UserRole` when you set `AuthMode` to `SSO` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-userrole
   */
  readonly userRole?: string;

  /**
   * The ID of the Amazon Virtual Private Cloud (Amazon VPC) to associate with the Studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-vpcid
   */
  readonly vpcId: string;

  /**
   * The ID of the Workspace security group associated with the Amazon EMR Studio.
   *
   * The Workspace security group allows outbound network traffic to resources in the Engine security group and to the internet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studio.html#cfn-emr-studio-workspacesecuritygroupid
   */
  readonly workspaceSecurityGroupId: string;
}

/**
 * Determine whether the given properties match those of a `CfnStudioProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authMode", cdk.requiredValidator)(properties.authMode));
  errors.collect(cdk.propertyValidator("authMode", cdk.validateString)(properties.authMode));
  errors.collect(cdk.propertyValidator("defaultS3Location", cdk.requiredValidator)(properties.defaultS3Location));
  errors.collect(cdk.propertyValidator("defaultS3Location", cdk.validateString)(properties.defaultS3Location));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("engineSecurityGroupId", cdk.requiredValidator)(properties.engineSecurityGroupId));
  errors.collect(cdk.propertyValidator("engineSecurityGroupId", cdk.validateString)(properties.engineSecurityGroupId));
  errors.collect(cdk.propertyValidator("idcInstanceArn", cdk.validateString)(properties.idcInstanceArn));
  errors.collect(cdk.propertyValidator("idcUserAssignment", cdk.validateString)(properties.idcUserAssignment));
  errors.collect(cdk.propertyValidator("idpAuthUrl", cdk.validateString)(properties.idpAuthUrl));
  errors.collect(cdk.propertyValidator("idpRelayStateParameterName", cdk.validateString)(properties.idpRelayStateParameterName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("serviceRole", cdk.requiredValidator)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("serviceRole", cdk.validateString)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trustedIdentityPropagationEnabled", cdk.validateBoolean)(properties.trustedIdentityPropagationEnabled));
  errors.collect(cdk.propertyValidator("userRole", cdk.validateString)(properties.userRole));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  errors.collect(cdk.propertyValidator("workspaceSecurityGroupId", cdk.requiredValidator)(properties.workspaceSecurityGroupId));
  errors.collect(cdk.propertyValidator("workspaceSecurityGroupId", cdk.validateString)(properties.workspaceSecurityGroupId));
  return errors.wrap("supplied properties not correct for \"CfnStudioProps\"");
}

// @ts-ignore TS6133
function convertCfnStudioPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioPropsValidator(properties).assertSuccess();
  return {
    "AuthMode": cdk.stringToCloudFormation(properties.authMode),
    "DefaultS3Location": cdk.stringToCloudFormation(properties.defaultS3Location),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "EngineSecurityGroupId": cdk.stringToCloudFormation(properties.engineSecurityGroupId),
    "IdcInstanceArn": cdk.stringToCloudFormation(properties.idcInstanceArn),
    "IdcUserAssignment": cdk.stringToCloudFormation(properties.idcUserAssignment),
    "IdpAuthUrl": cdk.stringToCloudFormation(properties.idpAuthUrl),
    "IdpRelayStateParameterName": cdk.stringToCloudFormation(properties.idpRelayStateParameterName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ServiceRole": cdk.stringToCloudFormation(properties.serviceRole),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrustedIdentityPropagationEnabled": cdk.booleanToCloudFormation(properties.trustedIdentityPropagationEnabled),
    "UserRole": cdk.stringToCloudFormation(properties.userRole),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId),
    "WorkspaceSecurityGroupId": cdk.stringToCloudFormation(properties.workspaceSecurityGroupId)
  };
}

// @ts-ignore TS6133
function CfnStudioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioProps>();
  ret.addPropertyResult("authMode", "AuthMode", (properties.AuthMode != null ? cfn_parse.FromCloudFormation.getString(properties.AuthMode) : undefined));
  ret.addPropertyResult("defaultS3Location", "DefaultS3Location", (properties.DefaultS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultS3Location) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("engineSecurityGroupId", "EngineSecurityGroupId", (properties.EngineSecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.EngineSecurityGroupId) : undefined));
  ret.addPropertyResult("idcInstanceArn", "IdcInstanceArn", (properties.IdcInstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.IdcInstanceArn) : undefined));
  ret.addPropertyResult("idcUserAssignment", "IdcUserAssignment", (properties.IdcUserAssignment != null ? cfn_parse.FromCloudFormation.getString(properties.IdcUserAssignment) : undefined));
  ret.addPropertyResult("idpAuthUrl", "IdpAuthUrl", (properties.IdpAuthUrl != null ? cfn_parse.FromCloudFormation.getString(properties.IdpAuthUrl) : undefined));
  ret.addPropertyResult("idpRelayStateParameterName", "IdpRelayStateParameterName", (properties.IdpRelayStateParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.IdpRelayStateParameterName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("serviceRole", "ServiceRole", (properties.ServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRole) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trustedIdentityPropagationEnabled", "TrustedIdentityPropagationEnabled", (properties.TrustedIdentityPropagationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TrustedIdentityPropagationEnabled) : undefined));
  ret.addPropertyResult("userRole", "UserRole", (properties.UserRole != null ? cfn_parse.FromCloudFormation.getString(properties.UserRole) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addPropertyResult("workspaceSecurityGroupId", "WorkspaceSecurityGroupId", (properties.WorkspaceSecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceSecurityGroupId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::EMR::StudioSessionMapping` resource is an Amazon EMR resource type that maps a user or group to the Amazon EMR Studio specified by `StudioId` , and applies a session policy that defines Studio permissions for that user or group.
 *
 * @cloudformationResource AWS::EMR::StudioSessionMapping
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html
 */
export class CfnStudioSessionMapping extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::StudioSessionMapping";

  /**
   * Build a CfnStudioSessionMapping from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudioSessionMapping {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStudioSessionMappingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStudioSessionMapping(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the user or group.
   */
  public identityName: string;

  /**
   * Specifies whether the identity to map to the Amazon EMR Studio is a user or a group.
   */
  public identityType: string;

  /**
   * The Amazon Resource Name (ARN) for the session policy that will be applied to the user or group.
   */
  public sessionPolicyArn: string;

  /**
   * The ID of the Amazon EMR Studio to which the user or group will be mapped.
   */
  public studioId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStudioSessionMappingProps) {
    super(scope, id, {
      "type": CfnStudioSessionMapping.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "identityName", this);
    cdk.requireProperty(props, "identityType", this);
    cdk.requireProperty(props, "sessionPolicyArn", this);
    cdk.requireProperty(props, "studioId", this);

    this.identityName = props.identityName;
    this.identityType = props.identityType;
    this.sessionPolicyArn = props.sessionPolicyArn;
    this.studioId = props.studioId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identityName": this.identityName,
      "identityType": this.identityType,
      "sessionPolicyArn": this.sessionPolicyArn,
      "studioId": this.studioId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudioSessionMapping.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStudioSessionMappingPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStudioSessionMapping`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html
 */
export interface CfnStudioSessionMappingProps {
  /**
   * The name of the user or group.
   *
   * For more information, see [UserName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_User.html#singlesignon-Type-User-UserName) and [DisplayName](https://docs.aws.amazon.com/singlesignon/latest/IdentityStoreAPIReference/API_Group.html#singlesignon-Type-Group-DisplayName) in the *IAM Identity Center Identity Store API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identityname
   */
  readonly identityName: string;

  /**
   * Specifies whether the identity to map to the Amazon EMR Studio is a user or a group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-identitytype
   */
  readonly identityType: string;

  /**
   * The Amazon Resource Name (ARN) for the session policy that will be applied to the user or group.
   *
   * Session policies refine Studio user permissions without the need to use multiple IAM user roles. For more information, see [Create an EMR Studio user role with session policies](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-studio-user-role.html) in the *Amazon EMR Management Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-sessionpolicyarn
   */
  readonly sessionPolicyArn: string;

  /**
   * The ID of the Amazon EMR Studio to which the user or group will be mapped.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-studiosessionmapping.html#cfn-emr-studiosessionmapping-studioid
   */
  readonly studioId: string;
}

/**
 * Determine whether the given properties match those of a `CfnStudioSessionMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioSessionMappingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioSessionMappingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityName", cdk.requiredValidator)(properties.identityName));
  errors.collect(cdk.propertyValidator("identityName", cdk.validateString)(properties.identityName));
  errors.collect(cdk.propertyValidator("identityType", cdk.requiredValidator)(properties.identityType));
  errors.collect(cdk.propertyValidator("identityType", cdk.validateString)(properties.identityType));
  errors.collect(cdk.propertyValidator("sessionPolicyArn", cdk.requiredValidator)(properties.sessionPolicyArn));
  errors.collect(cdk.propertyValidator("sessionPolicyArn", cdk.validateString)(properties.sessionPolicyArn));
  errors.collect(cdk.propertyValidator("studioId", cdk.requiredValidator)(properties.studioId));
  errors.collect(cdk.propertyValidator("studioId", cdk.validateString)(properties.studioId));
  return errors.wrap("supplied properties not correct for \"CfnStudioSessionMappingProps\"");
}

// @ts-ignore TS6133
function convertCfnStudioSessionMappingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioSessionMappingPropsValidator(properties).assertSuccess();
  return {
    "IdentityName": cdk.stringToCloudFormation(properties.identityName),
    "IdentityType": cdk.stringToCloudFormation(properties.identityType),
    "SessionPolicyArn": cdk.stringToCloudFormation(properties.sessionPolicyArn),
    "StudioId": cdk.stringToCloudFormation(properties.studioId)
  };
}

// @ts-ignore TS6133
function CfnStudioSessionMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioSessionMappingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioSessionMappingProps>();
  ret.addPropertyResult("identityName", "IdentityName", (properties.IdentityName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityName) : undefined));
  ret.addPropertyResult("identityType", "IdentityType", (properties.IdentityType != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityType) : undefined));
  ret.addPropertyResult("sessionPolicyArn", "SessionPolicyArn", (properties.SessionPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.SessionPolicyArn) : undefined));
  ret.addPropertyResult("studioId", "StudioId", (properties.StudioId != null ? cfn_parse.FromCloudFormation.getString(properties.StudioId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A WAL workspace is a logical container of write-ahead logs (WALs).
 *
 * All WALs in Amazon EMR WAL are encapsulated by a WAL workspace.
 *
 * @cloudformationResource AWS::EMR::WALWorkspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-walworkspace.html
 */
export class CfnWALWorkspace extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMR::WALWorkspace";

  /**
   * Build a CfnWALWorkspace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWALWorkspace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWALWorkspacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWALWorkspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * You can add tags when you create a new workspace.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name of the WAL workspace.
   */
  public walWorkspaceName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWALWorkspaceProps = {}) {
    super(scope, id, {
      "type": CfnWALWorkspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.tags = props.tags;
    this.walWorkspaceName = props.walWorkspaceName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "tags": this.tags,
      "walWorkspaceName": this.walWorkspaceName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWALWorkspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWALWorkspacePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWALWorkspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-walworkspace.html
 */
export interface CfnWALWorkspaceProps {
  /**
   * You can add tags when you create a new workspace.
   *
   * You can add, remove, or list tags from an active workspace, but you can't update tags. Instead, remove the tag and add a new one. For more information, see see [Tag your Amazon EMR WAL workspaces](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hbase-wal.html#emr-hbase-wal-tagging) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-walworkspace.html#cfn-emr-walworkspace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the WAL workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-walworkspace.html#cfn-emr-walworkspace-walworkspacename
   */
  readonly walWorkspaceName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnWALWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWALWorkspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWALWorkspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("walWorkspaceName", cdk.validateString)(properties.walWorkspaceName));
  return errors.wrap("supplied properties not correct for \"CfnWALWorkspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnWALWorkspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWALWorkspacePropsValidator(properties).assertSuccess();
  return {
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WALWorkspaceName": cdk.stringToCloudFormation(properties.walWorkspaceName)
  };
}

// @ts-ignore TS6133
function CfnWALWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWALWorkspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWALWorkspaceProps>();
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("walWorkspaceName", "WALWorkspaceName", (properties.WALWorkspaceName != null ? cfn_parse.FromCloudFormation.getString(properties.WALWorkspaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}