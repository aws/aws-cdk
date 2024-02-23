/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a cluster. A *cluster* is a fully managed data warehouse that consists of a set of compute nodes.
 *
 * To create a cluster in Virtual Private Cloud (VPC), you must provide a cluster subnet group name. The cluster subnet group identifies the subnets of your VPC that Amazon Redshift uses when creating the cluster. For more information about managing clusters, go to [Amazon Redshift Clusters](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html) in the *Amazon Redshift Cluster Management Guide* .
 *
 * @cloudformationResource AWS::Redshift::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::Cluster";

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
   * The namespace Amazon Resource Name (ARN) of the cluster.
   *
   * @cloudformationAttribute ClusterNamespaceArn
   */
  public readonly attrClusterNamespaceArn: string;

  /**
   * A unique identifier for the maintenance window.
   *
   * @cloudformationAttribute DeferMaintenanceIdentifier
   */
  public readonly attrDeferMaintenanceIdentifier: string;

  /**
   * @cloudformationAttribute Endpoint.Address
   */
  public readonly attrEndpointAddress: string;

  /**
   * @cloudformationAttribute Endpoint.Port
   */
  public readonly attrEndpointPort: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) for the cluster's admin user credentials secret.
   *
   * @cloudformationAttribute MasterPasswordSecretArn
   */
  public readonly attrMasterPasswordSecretArn: string;

  /**
   * If `true` , major version upgrades can be applied during the maintenance window to the Amazon Redshift engine that is running on the cluster.
   */
  public allowVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * This parameter is retired.
   */
  public aquaConfigurationStatus?: string;

  /**
   * The number of days that automated snapshots are retained.
   */
  public automatedSnapshotRetentionPeriod?: number;

  /**
   * The EC2 Availability Zone (AZ) in which you want Amazon Redshift to provision the cluster.
   */
  public availabilityZone?: string;

  /**
   * The option to enable relocation for an Amazon Redshift cluster between Availability Zones after the cluster is created.
   */
  public availabilityZoneRelocation?: boolean | cdk.IResolvable;

  /**
   * Describes the status of the Availability Zone relocation operation.
   */
  public availabilityZoneRelocationStatus?: string;

  /**
   * A boolean value indicating whether the resize operation is using the classic resize process.
   */
  public classic?: boolean | cdk.IResolvable;

  /**
   * A unique identifier for the cluster.
   */
  public clusterIdentifier?: string;

  /**
   * The name of the parameter group to be associated with this cluster.
   */
  public clusterParameterGroupName?: string;

  /**
   * A list of security groups to be associated with this cluster.
   */
  public clusterSecurityGroups?: Array<string>;

  /**
   * The name of a cluster subnet group to be associated with this cluster.
   */
  public clusterSubnetGroupName?: string;

  /**
   * The type of the cluster. When cluster type is specified as.
   */
  public clusterType: string;

  /**
   * The version of the Amazon Redshift engine software that you want to deploy on the cluster.
   */
  public clusterVersion?: string;

  /**
   * The name of the first database to be created when the cluster is created.
   */
  public dbName: string;

  /**
   * A Boolean indicating whether to enable the deferred maintenance window.
   */
  public deferMaintenance?: boolean | cdk.IResolvable;

  /**
   * An integer indicating the duration of the maintenance window in days.
   */
  public deferMaintenanceDuration?: number;

  /**
   * A timestamp for the end of the time period when we defer maintenance.
   */
  public deferMaintenanceEndTime?: string;

  /**
   * A timestamp indicating the start time for the deferred maintenance window.
   */
  public deferMaintenanceStartTime?: string;

  /**
   * The destination region that snapshots are automatically copied to when cross-region snapshot copy is enabled.
   */
  public destinationRegion?: string;

  /**
   * The Elastic IP (EIP) address for the cluster.
   */
  public elasticIp?: string;

  /**
   * If `true` , the data in the cluster is encrypted at rest.
   */
  public encrypted?: boolean | cdk.IResolvable;

  /**
   * The connection endpoint.
   */
  public endpoint?: CfnCluster.EndpointProperty | cdk.IResolvable;

  /**
   * An option that specifies whether to create the cluster with enhanced VPC routing enabled.
   */
  public enhancedVpcRouting?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
   */
  public hsmClientCertificateIdentifier?: string;

  /**
   * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
   */
  public hsmConfigurationIdentifier?: string;

  /**
   * A list of AWS Identity and Access Management (IAM) roles that can be used by the cluster to access other AWS services.
   */
  public iamRoles?: Array<string>;

  /**
   * The AWS Key Management Service (KMS) key ID of the encryption key that you want to use to encrypt data in the cluster.
   */
  public kmsKeyId?: string;

  /**
   * Specifies logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   */
  public loggingProperties?: cdk.IResolvable | CfnCluster.LoggingPropertiesProperty;

  /**
   * An optional parameter for the name of the maintenance track for the cluster.
   */
  public maintenanceTrackName?: string;

  /**
   * If `true` , Amazon Redshift uses AWS Secrets Manager to manage this cluster's admin credentials.
   */
  public manageMasterPassword?: boolean | cdk.IResolvable;

  /**
   * The default number of days to retain a manual snapshot.
   */
  public manualSnapshotRetentionPeriod?: number;

  /**
   * The ID of the AWS Key Management Service (KMS) key used to encrypt and store the cluster's admin credentials secret.
   */
  public masterPasswordSecretKmsKeyId?: string;

  /**
   * The user name associated with the admin user account for the cluster that is being created.
   */
  public masterUsername: string;

  /**
   * The password associated with the admin user account for the cluster that is being created.
   */
  public masterUserPassword?: string;

  /**
   * A boolean indicating whether Amazon Redshift should deploy the cluster in two Availability Zones.
   */
  public multiAz?: boolean | cdk.IResolvable;

  /**
   * The policy that is attached to a resource.
   */
  public namespaceResourcePolicy?: any | cdk.IResolvable;

  /**
   * The node type to be provisioned for the cluster.
   */
  public nodeType: string;

  /**
   * The number of compute nodes in the cluster.
   */
  public numberOfNodes?: number;

  /**
   * The AWS account used to create or copy the snapshot.
   */
  public ownerAccount?: string;

  /**
   * The port number on which the cluster accepts incoming connections.
   */
  public port?: number;

  /**
   * The weekly time range (in UTC) during which automated cluster maintenance can occur.
   */
  public preferredMaintenanceWindow?: string;

  /**
   * If `true` , the cluster can be accessed from a public network.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The Amazon Redshift operation to be performed.
   */
  public resourceAction?: string;

  /**
   * Describes a `RevisionTarget` object.
   */
  public revisionTarget?: string;

  /**
   * Rotates the encryption keys for a cluster.
   */
  public rotateEncryptionKey?: boolean | cdk.IResolvable;

  /**
   * The name of the cluster the source snapshot was created from.
   */
  public snapshotClusterIdentifier?: string;

  /**
   * The name of the snapshot copy grant.
   */
  public snapshotCopyGrantName?: string;

  /**
   * Indicates whether to apply the snapshot retention period to newly copied manual snapshots instead of automated snapshots.
   */
  public snapshotCopyManual?: boolean | cdk.IResolvable;

  /**
   * The number of days to retain automated snapshots in the destination AWS Region after they are copied from the source AWS Region .
   */
  public snapshotCopyRetentionPeriod?: number;

  /**
   * The name of the snapshot from which to create the new cluster.
   */
  public snapshotIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tag instances.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of Virtual Private Cloud (VPC) security groups to be associated with the cluster.
   */
  public vpcSecurityGroupIds?: Array<string>;

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

    cdk.requireProperty(props, "clusterType", this);
    cdk.requireProperty(props, "dbName", this);
    cdk.requireProperty(props, "masterUsername", this);
    cdk.requireProperty(props, "nodeType", this);

    this.attrClusterNamespaceArn = cdk.Token.asString(this.getAtt("ClusterNamespaceArn", cdk.ResolutionTypeHint.STRING));
    this.attrDeferMaintenanceIdentifier = cdk.Token.asString(this.getAtt("DeferMaintenanceIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointAddress = cdk.Token.asString(this.getAtt("Endpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointPort = cdk.Token.asString(this.getAtt("Endpoint.Port", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrMasterPasswordSecretArn = cdk.Token.asString(this.getAtt("MasterPasswordSecretArn", cdk.ResolutionTypeHint.STRING));
    this.allowVersionUpgrade = props.allowVersionUpgrade;
    this.aquaConfigurationStatus = props.aquaConfigurationStatus;
    this.automatedSnapshotRetentionPeriod = props.automatedSnapshotRetentionPeriod;
    this.availabilityZone = props.availabilityZone;
    this.availabilityZoneRelocation = props.availabilityZoneRelocation;
    this.availabilityZoneRelocationStatus = props.availabilityZoneRelocationStatus;
    this.classic = props.classic;
    this.clusterIdentifier = props.clusterIdentifier;
    this.clusterParameterGroupName = props.clusterParameterGroupName;
    this.clusterSecurityGroups = props.clusterSecurityGroups;
    this.clusterSubnetGroupName = props.clusterSubnetGroupName;
    this.clusterType = props.clusterType;
    this.clusterVersion = props.clusterVersion;
    this.dbName = props.dbName;
    this.deferMaintenance = props.deferMaintenance;
    this.deferMaintenanceDuration = props.deferMaintenanceDuration;
    this.deferMaintenanceEndTime = props.deferMaintenanceEndTime;
    this.deferMaintenanceStartTime = props.deferMaintenanceStartTime;
    this.destinationRegion = props.destinationRegion;
    this.elasticIp = props.elasticIp;
    this.encrypted = props.encrypted;
    this.endpoint = props.endpoint;
    this.enhancedVpcRouting = props.enhancedVpcRouting;
    this.hsmClientCertificateIdentifier = props.hsmClientCertificateIdentifier;
    this.hsmConfigurationIdentifier = props.hsmConfigurationIdentifier;
    this.iamRoles = props.iamRoles;
    this.kmsKeyId = props.kmsKeyId;
    this.loggingProperties = props.loggingProperties;
    this.maintenanceTrackName = props.maintenanceTrackName;
    this.manageMasterPassword = props.manageMasterPassword;
    this.manualSnapshotRetentionPeriod = props.manualSnapshotRetentionPeriod;
    this.masterPasswordSecretKmsKeyId = props.masterPasswordSecretKmsKeyId;
    this.masterUsername = props.masterUsername;
    this.masterUserPassword = props.masterUserPassword;
    this.multiAz = props.multiAz;
    this.namespaceResourcePolicy = props.namespaceResourcePolicy;
    this.nodeType = props.nodeType;
    this.numberOfNodes = props.numberOfNodes;
    this.ownerAccount = props.ownerAccount;
    this.port = props.port;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.publiclyAccessible = props.publiclyAccessible;
    this.resourceAction = props.resourceAction;
    this.revisionTarget = props.revisionTarget;
    this.rotateEncryptionKey = props.rotateEncryptionKey;
    this.snapshotClusterIdentifier = props.snapshotClusterIdentifier;
    this.snapshotCopyGrantName = props.snapshotCopyGrantName;
    this.snapshotCopyManual = props.snapshotCopyManual;
    this.snapshotCopyRetentionPeriod = props.snapshotCopyRetentionPeriod;
    this.snapshotIdentifier = props.snapshotIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Redshift::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Redshift::Cluster' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowVersionUpgrade": this.allowVersionUpgrade,
      "aquaConfigurationStatus": this.aquaConfigurationStatus,
      "automatedSnapshotRetentionPeriod": this.automatedSnapshotRetentionPeriod,
      "availabilityZone": this.availabilityZone,
      "availabilityZoneRelocation": this.availabilityZoneRelocation,
      "availabilityZoneRelocationStatus": this.availabilityZoneRelocationStatus,
      "classic": this.classic,
      "clusterIdentifier": this.clusterIdentifier,
      "clusterParameterGroupName": this.clusterParameterGroupName,
      "clusterSecurityGroups": this.clusterSecurityGroups,
      "clusterSubnetGroupName": this.clusterSubnetGroupName,
      "clusterType": this.clusterType,
      "clusterVersion": this.clusterVersion,
      "dbName": this.dbName,
      "deferMaintenance": this.deferMaintenance,
      "deferMaintenanceDuration": this.deferMaintenanceDuration,
      "deferMaintenanceEndTime": this.deferMaintenanceEndTime,
      "deferMaintenanceStartTime": this.deferMaintenanceStartTime,
      "destinationRegion": this.destinationRegion,
      "elasticIp": this.elasticIp,
      "encrypted": this.encrypted,
      "endpoint": this.endpoint,
      "enhancedVpcRouting": this.enhancedVpcRouting,
      "hsmClientCertificateIdentifier": this.hsmClientCertificateIdentifier,
      "hsmConfigurationIdentifier": this.hsmConfigurationIdentifier,
      "iamRoles": this.iamRoles,
      "kmsKeyId": this.kmsKeyId,
      "loggingProperties": this.loggingProperties,
      "maintenanceTrackName": this.maintenanceTrackName,
      "manageMasterPassword": this.manageMasterPassword,
      "manualSnapshotRetentionPeriod": this.manualSnapshotRetentionPeriod,
      "masterPasswordSecretKmsKeyId": this.masterPasswordSecretKmsKeyId,
      "masterUsername": this.masterUsername,
      "masterUserPassword": this.masterUserPassword,
      "multiAz": this.multiAz,
      "namespaceResourcePolicy": this.namespaceResourcePolicy,
      "nodeType": this.nodeType,
      "numberOfNodes": this.numberOfNodes,
      "ownerAccount": this.ownerAccount,
      "port": this.port,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "publiclyAccessible": this.publiclyAccessible,
      "resourceAction": this.resourceAction,
      "revisionTarget": this.revisionTarget,
      "rotateEncryptionKey": this.rotateEncryptionKey,
      "snapshotClusterIdentifier": this.snapshotClusterIdentifier,
      "snapshotCopyGrantName": this.snapshotCopyGrantName,
      "snapshotCopyManual": this.snapshotCopyManual,
      "snapshotCopyRetentionPeriod": this.snapshotCopyRetentionPeriod,
      "snapshotIdentifier": this.snapshotIdentifier,
      "tags": this.tags.renderTags(),
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds
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
   * Describes a connection endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-endpoint.html
   */
  export interface EndpointProperty {
    /**
     * The DNS address of the cluster.
     *
     * This property is read only.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-endpoint.html#cfn-redshift-cluster-endpoint-address
     */
    readonly address?: string;

    /**
     * The port that the database engine is listening on.
     *
     * This property is read only.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-endpoint.html#cfn-redshift-cluster-endpoint-port
     */
    readonly port?: string;
  }

  /**
   * Specifies logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html
   */
  export interface LoggingPropertiesProperty {
    /**
     * The name of an existing S3 bucket where the log files are to be stored.
     *
     * Constraints:
     *
     * - Must be in the same region as the cluster
     * - The cluster must have read bucket and put object permissions
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html#cfn-redshift-cluster-loggingproperties-bucketname
     */
    readonly bucketName?: string;

    /**
     * The prefix applied to the log file names.
     *
     * Constraints:
     *
     * - Cannot exceed 512 characters
     * - Cannot contain spaces( ), double quotes ("), single quotes ('), a backslash (\), or control characters. The hexadecimal codes for invalid characters are:
     *
     * - x00 to x20
     * - x22
     * - x27
     * - x5c
     * - x7f or larger
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html#cfn-redshift-cluster-loggingproperties-s3keyprefix
     */
    readonly s3KeyPrefix?: string;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html
 */
export interface CfnClusterProps {
  /**
   * If `true` , major version upgrades can be applied during the maintenance window to the Amazon Redshift engine that is running on the cluster.
   *
   * When a new major version of the Amazon Redshift engine is released, you can request that the service automatically apply upgrades during the maintenance window to the Amazon Redshift engine that is running on your cluster.
   *
   * Default: `true`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-allowversionupgrade
   */
  readonly allowVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * This parameter is retired.
   *
   * It does not set the AQUA configuration status. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-aquaconfigurationstatus
   */
  readonly aquaConfigurationStatus?: string;

  /**
   * The number of days that automated snapshots are retained.
   *
   * If the value is 0, automated snapshots are disabled. Even if automated snapshots are disabled, you can still create manual snapshots when you want with [CreateClusterSnapshot](https://docs.aws.amazon.com/redshift/latest/APIReference/API_CreateClusterSnapshot.html) in the *Amazon Redshift API Reference* .
   *
   * Default: `1`
   *
   * Constraints: Must be a value from 0 to 35.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-automatedsnapshotretentionperiod
   */
  readonly automatedSnapshotRetentionPeriod?: number;

  /**
   * The EC2 Availability Zone (AZ) in which you want Amazon Redshift to provision the cluster.
   *
   * For example, if you have several EC2 instances running in a specific Availability Zone, then you might want the cluster to be provisioned in the same zone in order to decrease network latency.
   *
   * Default: A random, system-chosen Availability Zone in the region that is specified by the endpoint.
   *
   * Example: `us-east-2d`
   *
   * Constraint: The specified Availability Zone must be in the same region as the current endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The option to enable relocation for an Amazon Redshift cluster between Availability Zones after the cluster is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-availabilityzonerelocation
   */
  readonly availabilityZoneRelocation?: boolean | cdk.IResolvable;

  /**
   * Describes the status of the Availability Zone relocation operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-availabilityzonerelocationstatus
   */
  readonly availabilityZoneRelocationStatus?: string;

  /**
   * A boolean value indicating whether the resize operation is using the classic resize process.
   *
   * If you don't provide this parameter or set the value to `false` , the resize type is elastic.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-classic
   */
  readonly classic?: boolean | cdk.IResolvable;

  /**
   * A unique identifier for the cluster.
   *
   * You use this identifier to refer to the cluster for any subsequent cluster operations such as deleting or modifying. The identifier also appears in the Amazon Redshift console.
   *
   * Constraints:
   *
   * - Must contain from 1 to 63 alphanumeric characters or hyphens.
   * - Alphabetic characters must be lowercase.
   * - First character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   * - Must be unique for all clusters within an AWS account .
   *
   * Example: `myexamplecluster`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clusteridentifier
   */
  readonly clusterIdentifier?: string;

  /**
   * The name of the parameter group to be associated with this cluster.
   *
   * Default: The default Amazon Redshift cluster parameter group. For information about the default parameter group, go to [Working with Amazon Redshift Parameter Groups](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html)
   *
   * Constraints:
   *
   * - Must be 1 to 255 alphanumeric characters or hyphens.
   * - First character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clusterparametergroupname
   */
  readonly clusterParameterGroupName?: string;

  /**
   * A list of security groups to be associated with this cluster.
   *
   * Default: The default cluster security group for Amazon Redshift.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clustersecuritygroups
   */
  readonly clusterSecurityGroups?: Array<string>;

  /**
   * The name of a cluster subnet group to be associated with this cluster.
   *
   * If this parameter is not provided the resulting cluster will be deployed outside virtual private cloud (VPC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clustersubnetgroupname
   */
  readonly clusterSubnetGroupName?: string;

  /**
   * The type of the cluster. When cluster type is specified as.
   *
   * - `single-node` , the *NumberOfNodes* parameter is not required.
   * - `multi-node` , the *NumberOfNodes* parameter is required.
   *
   * Valid Values: `multi-node` | `single-node`
   *
   * Default: `multi-node`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clustertype
   */
  readonly clusterType: string;

  /**
   * The version of the Amazon Redshift engine software that you want to deploy on the cluster.
   *
   * The version selected runs on all the nodes in the cluster.
   *
   * Constraints: Only version 1.0 is currently available.
   *
   * Example: `1.0`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-clusterversion
   */
  readonly clusterVersion?: string;

  /**
   * The name of the first database to be created when the cluster is created.
   *
   * To create additional databases after the cluster is created, connect to the cluster with a SQL client and use SQL commands to create a database. For more information, go to [Create a Database](https://docs.aws.amazon.com/redshift/latest/dg/t_creating_database.html) in the Amazon Redshift Database Developer Guide.
   *
   * Default: `dev`
   *
   * Constraints:
   *
   * - Must contain 1 to 64 alphanumeric characters.
   * - Must contain only lowercase letters.
   * - Cannot be a word that is reserved by the service. A list of reserved words can be found in [Reserved Words](https://docs.aws.amazon.com/redshift/latest/dg/r_pg_keywords.html) in the Amazon Redshift Database Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-dbname
   */
  readonly dbName: string;

  /**
   * A Boolean indicating whether to enable the deferred maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-defermaintenance
   */
  readonly deferMaintenance?: boolean | cdk.IResolvable;

  /**
   * An integer indicating the duration of the maintenance window in days.
   *
   * If you specify a duration, you can't specify an end time. The duration must be 45 days or less.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-defermaintenanceduration
   */
  readonly deferMaintenanceDuration?: number;

  /**
   * A timestamp for the end of the time period when we defer maintenance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-defermaintenanceendtime
   */
  readonly deferMaintenanceEndTime?: string;

  /**
   * A timestamp indicating the start time for the deferred maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-defermaintenancestarttime
   */
  readonly deferMaintenanceStartTime?: string;

  /**
   * The destination region that snapshots are automatically copied to when cross-region snapshot copy is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-destinationregion
   */
  readonly destinationRegion?: string;

  /**
   * The Elastic IP (EIP) address for the cluster.
   *
   * Constraints: The cluster must be provisioned in EC2-VPC and publicly-accessible through an Internet gateway. Don't specify the Elastic IP address for a publicly accessible cluster with availability zone relocation turned on. For more information about provisioning clusters in EC2-VPC, go to [Supported Platforms to Launch Your Cluster](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#cluster-platforms) in the Amazon Redshift Cluster Management Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-elasticip
   */
  readonly elasticIp?: string;

  /**
   * If `true` , the data in the cluster is encrypted at rest.
   *
   * Default: false
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-encrypted
   */
  readonly encrypted?: boolean | cdk.IResolvable;

  /**
   * The connection endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-endpoint
   */
  readonly endpoint?: CfnCluster.EndpointProperty | cdk.IResolvable;

  /**
   * An option that specifies whether to create the cluster with enhanced VPC routing enabled.
   *
   * To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see [Enhanced VPC Routing](https://docs.aws.amazon.com/redshift/latest/mgmt/enhanced-vpc-routing.html) in the Amazon Redshift Cluster Management Guide.
   *
   * If this option is `true` , enhanced VPC routing is enabled.
   *
   * Default: false
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-enhancedvpcrouting
   */
  readonly enhancedVpcRouting?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-hsmclientcertificateidentifier
   */
  readonly hsmClientCertificateIdentifier?: string;

  /**
   * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-hsmconfigurationidentifier
   */
  readonly hsmConfigurationIdentifier?: string;

  /**
   * A list of AWS Identity and Access Management (IAM) roles that can be used by the cluster to access other AWS services.
   *
   * You must supply the IAM roles in their Amazon Resource Name (ARN) format.
   *
   * The maximum number of IAM roles that you can associate is subject to a quota. For more information, go to [Quotas and limits](https://docs.aws.amazon.com/redshift/latest/mgmt/amazon-redshift-limits.html) in the *Amazon Redshift Cluster Management Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-iamroles
   */
  readonly iamRoles?: Array<string>;

  /**
   * The AWS Key Management Service (KMS) key ID of the encryption key that you want to use to encrypt data in the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-loggingproperties
   */
  readonly loggingProperties?: cdk.IResolvable | CfnCluster.LoggingPropertiesProperty;

  /**
   * An optional parameter for the name of the maintenance track for the cluster.
   *
   * If you don't provide a maintenance track name, the cluster is assigned to the `current` track.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-maintenancetrackname
   */
  readonly maintenanceTrackName?: string;

  /**
   * If `true` , Amazon Redshift uses AWS Secrets Manager to manage this cluster's admin credentials.
   *
   * You can't use `MasterUserPassword` if `ManageMasterPassword` is true. If `ManageMasterPassword` is false or not set, Amazon Redshift uses `MasterUserPassword` for the admin user account's password.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-managemasterpassword
   */
  readonly manageMasterPassword?: boolean | cdk.IResolvable;

  /**
   * The default number of days to retain a manual snapshot.
   *
   * If the value is -1, the snapshot is retained indefinitely. This setting doesn't change the retention period of existing snapshots.
   *
   * The value must be either -1 or an integer between 1 and 3,653.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-manualsnapshotretentionperiod
   */
  readonly manualSnapshotRetentionPeriod?: number;

  /**
   * The ID of the AWS Key Management Service (KMS) key used to encrypt and store the cluster's admin credentials secret.
   *
   * You can only use this parameter if `ManageMasterPassword` is true.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-masterpasswordsecretkmskeyid
   */
  readonly masterPasswordSecretKmsKeyId?: string;

  /**
   * The user name associated with the admin user account for the cluster that is being created.
   *
   * Constraints:
   *
   * - Must be 1 - 128 alphanumeric characters or hyphens. The user name can't be `PUBLIC` .
   * - Must contain only lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.
   * - The first character must be a letter.
   * - Must not contain a colon (:) or a slash (/).
   * - Cannot be a reserved word. A list of reserved words can be found in [Reserved Words](https://docs.aws.amazon.com/redshift/latest/dg/r_pg_keywords.html) in the Amazon Redshift Database Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-masterusername
   */
  readonly masterUsername: string;

  /**
   * The password associated with the admin user account for the cluster that is being created.
   *
   * You can't use `MasterUserPassword` if `ManageMasterPassword` is `true` .
   *
   * Constraints:
   *
   * - Must be between 8 and 64 characters in length.
   * - Must contain at least one uppercase letter.
   * - Must contain at least one lowercase letter.
   * - Must contain one number.
   * - Can be any printable ASCII character (ASCII code 33-126) except `'` (single quote), `"` (double quote), `\` , `/` , or `@` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-masteruserpassword
   */
  readonly masterUserPassword?: string;

  /**
   * A boolean indicating whether Amazon Redshift should deploy the cluster in two Availability Zones.
   *
   * The default is false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-multiaz
   */
  readonly multiAz?: boolean | cdk.IResolvable;

  /**
   * The policy that is attached to a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-namespaceresourcepolicy
   */
  readonly namespaceResourcePolicy?: any | cdk.IResolvable;

  /**
   * The node type to be provisioned for the cluster.
   *
   * For information about node types, go to [Working with Clusters](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#how-many-nodes) in the *Amazon Redshift Cluster Management Guide* .
   *
   * Valid Values: `ds2.xlarge` | `ds2.8xlarge` | `dc1.large` | `dc1.8xlarge` | `dc2.large` | `dc2.8xlarge` | `ra3.xlplus` | `ra3.4xlarge` | `ra3.16xlarge`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-nodetype
   */
  readonly nodeType: string;

  /**
   * The number of compute nodes in the cluster.
   *
   * This parameter is required when the *ClusterType* parameter is specified as `multi-node` .
   *
   * For information about determining how many nodes you need, go to [Working with Clusters](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#how-many-nodes) in the *Amazon Redshift Cluster Management Guide* .
   *
   * If you don't specify this parameter, you get a single-node cluster. When requesting a multi-node cluster, you must specify the number of nodes that you want in the cluster.
   *
   * Default: `1`
   *
   * Constraints: Value must be at least 1 and no more than 100.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-numberofnodes
   */
  readonly numberOfNodes?: number;

  /**
   * The AWS account used to create or copy the snapshot.
   *
   * Required if you are restoring a snapshot you do not own, optional if you own the snapshot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-owneraccount
   */
  readonly ownerAccount?: string;

  /**
   * The port number on which the cluster accepts incoming connections.
   *
   * The cluster is accessible only via the JDBC and ODBC connection strings. Part of the connection string requires the port on which the cluster will listen for incoming connections.
   *
   * Default: `5439`
   *
   * Valid Values: `1150-65535`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-port
   */
  readonly port?: number;

  /**
   * The weekly time range (in UTC) during which automated cluster maintenance can occur.
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   *
   * Default: A 30-minute window selected at random from an 8-hour block of time per region, occurring on a random day of the week. For more information about the time blocks for each region, see [Maintenance Windows](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#rs-maintenance-windows) in Amazon Redshift Cluster Management Guide.
   *
   * Valid Days: Mon | Tue | Wed | Thu | Fri | Sat | Sun
   *
   * Constraints: Minimum 30-minute window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * If `true` , the cluster can be accessed from a public network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The Amazon Redshift operation to be performed.
   *
   * Supported operations are `pause-cluster` , `resume-cluster` , and `failover-primary-compute` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-resourceaction
   */
  readonly resourceAction?: string;

  /**
   * Describes a `RevisionTarget` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-revisiontarget
   */
  readonly revisionTarget?: string;

  /**
   * Rotates the encryption keys for a cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-rotateencryptionkey
   */
  readonly rotateEncryptionKey?: boolean | cdk.IResolvable;

  /**
   * The name of the cluster the source snapshot was created from.
   *
   * This parameter is required if your user or role has a policy containing a snapshot resource element that specifies anything other than * for the cluster name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-snapshotclusteridentifier
   */
  readonly snapshotClusterIdentifier?: string;

  /**
   * The name of the snapshot copy grant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-snapshotcopygrantname
   */
  readonly snapshotCopyGrantName?: string;

  /**
   * Indicates whether to apply the snapshot retention period to newly copied manual snapshots instead of automated snapshots.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-snapshotcopymanual
   */
  readonly snapshotCopyManual?: boolean | cdk.IResolvable;

  /**
   * The number of days to retain automated snapshots in the destination AWS Region after they are copied from the source AWS Region .
   *
   * By default, this only changes the retention period of copied automated snapshots.
   *
   * If you decrease the retention period for automated snapshots that are copied to a destination AWS Region , Amazon Redshift deletes any existing automated snapshots that were copied to the destination AWS Region and that fall outside of the new retention period.
   *
   * Constraints: Must be at least 1 and no more than 35 for automated snapshots.
   *
   * If you specify the `manual` option, only newly copied manual snapshots will have the new retention period.
   *
   * If you specify the value of -1 newly copied manual snapshots are retained indefinitely.
   *
   * Constraints: The number of days must be either -1 or an integer between 1 and 3,653 for manual snapshots.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-snapshotcopyretentionperiod
   */
  readonly snapshotCopyRetentionPeriod?: number;

  /**
   * The name of the snapshot from which to create the new cluster.
   *
   * This parameter isn't case sensitive. You must specify this parameter or `snapshotArn` , but not both.
   *
   * Example: `my-snapshot-id`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-snapshotidentifier
   */
  readonly snapshotIdentifier?: string;

  /**
   * A list of tag instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of Virtual Private Cloud (VPC) security groups to be associated with the cluster.
   *
   * Default: The default VPC security group is associated with the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-cluster.html#cfn-redshift-cluster-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `EndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  return errors.wrap("supplied properties not correct for \"EndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Port": cdk.stringToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnClusterEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterLoggingPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("s3KeyPrefix", cdk.validateString)(properties.s3KeyPrefix));
  return errors.wrap("supplied properties not correct for \"LoggingPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterLoggingPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterLoggingPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "S3KeyPrefix": cdk.stringToCloudFormation(properties.s3KeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnClusterLoggingPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.LoggingPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingPropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("s3KeyPrefix", "S3KeyPrefix", (properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined));
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
  errors.collect(cdk.propertyValidator("allowVersionUpgrade", cdk.validateBoolean)(properties.allowVersionUpgrade));
  errors.collect(cdk.propertyValidator("aquaConfigurationStatus", cdk.validateString)(properties.aquaConfigurationStatus));
  errors.collect(cdk.propertyValidator("automatedSnapshotRetentionPeriod", cdk.validateNumber)(properties.automatedSnapshotRetentionPeriod));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("availabilityZoneRelocation", cdk.validateBoolean)(properties.availabilityZoneRelocation));
  errors.collect(cdk.propertyValidator("availabilityZoneRelocationStatus", cdk.validateString)(properties.availabilityZoneRelocationStatus));
  errors.collect(cdk.propertyValidator("classic", cdk.validateBoolean)(properties.classic));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterParameterGroupName", cdk.validateString)(properties.clusterParameterGroupName));
  errors.collect(cdk.propertyValidator("clusterSecurityGroups", cdk.listValidator(cdk.validateString))(properties.clusterSecurityGroups));
  errors.collect(cdk.propertyValidator("clusterSubnetGroupName", cdk.validateString)(properties.clusterSubnetGroupName));
  errors.collect(cdk.propertyValidator("clusterType", cdk.requiredValidator)(properties.clusterType));
  errors.collect(cdk.propertyValidator("clusterType", cdk.validateString)(properties.clusterType));
  errors.collect(cdk.propertyValidator("clusterVersion", cdk.validateString)(properties.clusterVersion));
  errors.collect(cdk.propertyValidator("dbName", cdk.requiredValidator)(properties.dbName));
  errors.collect(cdk.propertyValidator("dbName", cdk.validateString)(properties.dbName));
  errors.collect(cdk.propertyValidator("deferMaintenance", cdk.validateBoolean)(properties.deferMaintenance));
  errors.collect(cdk.propertyValidator("deferMaintenanceDuration", cdk.validateNumber)(properties.deferMaintenanceDuration));
  errors.collect(cdk.propertyValidator("deferMaintenanceEndTime", cdk.validateString)(properties.deferMaintenanceEndTime));
  errors.collect(cdk.propertyValidator("deferMaintenanceStartTime", cdk.validateString)(properties.deferMaintenanceStartTime));
  errors.collect(cdk.propertyValidator("destinationRegion", cdk.validateString)(properties.destinationRegion));
  errors.collect(cdk.propertyValidator("elasticIp", cdk.validateString)(properties.elasticIp));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("endpoint", CfnClusterEndpointPropertyValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("enhancedVpcRouting", cdk.validateBoolean)(properties.enhancedVpcRouting));
  errors.collect(cdk.propertyValidator("hsmClientCertificateIdentifier", cdk.validateString)(properties.hsmClientCertificateIdentifier));
  errors.collect(cdk.propertyValidator("hsmConfigurationIdentifier", cdk.validateString)(properties.hsmConfigurationIdentifier));
  errors.collect(cdk.propertyValidator("iamRoles", cdk.listValidator(cdk.validateString))(properties.iamRoles));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("loggingProperties", CfnClusterLoggingPropertiesPropertyValidator)(properties.loggingProperties));
  errors.collect(cdk.propertyValidator("maintenanceTrackName", cdk.validateString)(properties.maintenanceTrackName));
  errors.collect(cdk.propertyValidator("manageMasterPassword", cdk.validateBoolean)(properties.manageMasterPassword));
  errors.collect(cdk.propertyValidator("manualSnapshotRetentionPeriod", cdk.validateNumber)(properties.manualSnapshotRetentionPeriod));
  errors.collect(cdk.propertyValidator("masterPasswordSecretKmsKeyId", cdk.validateString)(properties.masterPasswordSecretKmsKeyId));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.requiredValidator)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.validateString)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("multiAz", cdk.validateBoolean)(properties.multiAz));
  errors.collect(cdk.propertyValidator("namespaceResourcePolicy", cdk.validateObject)(properties.namespaceResourcePolicy));
  errors.collect(cdk.propertyValidator("nodeType", cdk.requiredValidator)(properties.nodeType));
  errors.collect(cdk.propertyValidator("nodeType", cdk.validateString)(properties.nodeType));
  errors.collect(cdk.propertyValidator("numberOfNodes", cdk.validateNumber)(properties.numberOfNodes));
  errors.collect(cdk.propertyValidator("ownerAccount", cdk.validateString)(properties.ownerAccount));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("resourceAction", cdk.validateString)(properties.resourceAction));
  errors.collect(cdk.propertyValidator("revisionTarget", cdk.validateString)(properties.revisionTarget));
  errors.collect(cdk.propertyValidator("rotateEncryptionKey", cdk.validateBoolean)(properties.rotateEncryptionKey));
  errors.collect(cdk.propertyValidator("snapshotClusterIdentifier", cdk.validateString)(properties.snapshotClusterIdentifier));
  errors.collect(cdk.propertyValidator("snapshotCopyGrantName", cdk.validateString)(properties.snapshotCopyGrantName));
  errors.collect(cdk.propertyValidator("snapshotCopyManual", cdk.validateBoolean)(properties.snapshotCopyManual));
  errors.collect(cdk.propertyValidator("snapshotCopyRetentionPeriod", cdk.validateNumber)(properties.snapshotCopyRetentionPeriod));
  errors.collect(cdk.propertyValidator("snapshotIdentifier", cdk.validateString)(properties.snapshotIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "AllowVersionUpgrade": cdk.booleanToCloudFormation(properties.allowVersionUpgrade),
    "AquaConfigurationStatus": cdk.stringToCloudFormation(properties.aquaConfigurationStatus),
    "AutomatedSnapshotRetentionPeriod": cdk.numberToCloudFormation(properties.automatedSnapshotRetentionPeriod),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "AvailabilityZoneRelocation": cdk.booleanToCloudFormation(properties.availabilityZoneRelocation),
    "AvailabilityZoneRelocationStatus": cdk.stringToCloudFormation(properties.availabilityZoneRelocationStatus),
    "Classic": cdk.booleanToCloudFormation(properties.classic),
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "ClusterParameterGroupName": cdk.stringToCloudFormation(properties.clusterParameterGroupName),
    "ClusterSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.clusterSecurityGroups),
    "ClusterSubnetGroupName": cdk.stringToCloudFormation(properties.clusterSubnetGroupName),
    "ClusterType": cdk.stringToCloudFormation(properties.clusterType),
    "ClusterVersion": cdk.stringToCloudFormation(properties.clusterVersion),
    "DBName": cdk.stringToCloudFormation(properties.dbName),
    "DeferMaintenance": cdk.booleanToCloudFormation(properties.deferMaintenance),
    "DeferMaintenanceDuration": cdk.numberToCloudFormation(properties.deferMaintenanceDuration),
    "DeferMaintenanceEndTime": cdk.stringToCloudFormation(properties.deferMaintenanceEndTime),
    "DeferMaintenanceStartTime": cdk.stringToCloudFormation(properties.deferMaintenanceStartTime),
    "DestinationRegion": cdk.stringToCloudFormation(properties.destinationRegion),
    "ElasticIp": cdk.stringToCloudFormation(properties.elasticIp),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "Endpoint": convertCfnClusterEndpointPropertyToCloudFormation(properties.endpoint),
    "EnhancedVpcRouting": cdk.booleanToCloudFormation(properties.enhancedVpcRouting),
    "HsmClientCertificateIdentifier": cdk.stringToCloudFormation(properties.hsmClientCertificateIdentifier),
    "HsmConfigurationIdentifier": cdk.stringToCloudFormation(properties.hsmConfigurationIdentifier),
    "IamRoles": cdk.listMapper(cdk.stringToCloudFormation)(properties.iamRoles),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LoggingProperties": convertCfnClusterLoggingPropertiesPropertyToCloudFormation(properties.loggingProperties),
    "MaintenanceTrackName": cdk.stringToCloudFormation(properties.maintenanceTrackName),
    "ManageMasterPassword": cdk.booleanToCloudFormation(properties.manageMasterPassword),
    "ManualSnapshotRetentionPeriod": cdk.numberToCloudFormation(properties.manualSnapshotRetentionPeriod),
    "MasterPasswordSecretKmsKeyId": cdk.stringToCloudFormation(properties.masterPasswordSecretKmsKeyId),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword),
    "MasterUsername": cdk.stringToCloudFormation(properties.masterUsername),
    "MultiAZ": cdk.booleanToCloudFormation(properties.multiAz),
    "NamespaceResourcePolicy": cdk.objectToCloudFormation(properties.namespaceResourcePolicy),
    "NodeType": cdk.stringToCloudFormation(properties.nodeType),
    "NumberOfNodes": cdk.numberToCloudFormation(properties.numberOfNodes),
    "OwnerAccount": cdk.stringToCloudFormation(properties.ownerAccount),
    "Port": cdk.numberToCloudFormation(properties.port),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "ResourceAction": cdk.stringToCloudFormation(properties.resourceAction),
    "RevisionTarget": cdk.stringToCloudFormation(properties.revisionTarget),
    "RotateEncryptionKey": cdk.booleanToCloudFormation(properties.rotateEncryptionKey),
    "SnapshotClusterIdentifier": cdk.stringToCloudFormation(properties.snapshotClusterIdentifier),
    "SnapshotCopyGrantName": cdk.stringToCloudFormation(properties.snapshotCopyGrantName),
    "SnapshotCopyManual": cdk.booleanToCloudFormation(properties.snapshotCopyManual),
    "SnapshotCopyRetentionPeriod": cdk.numberToCloudFormation(properties.snapshotCopyRetentionPeriod),
    "SnapshotIdentifier": cdk.stringToCloudFormation(properties.snapshotIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds)
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
  ret.addPropertyResult("allowVersionUpgrade", "AllowVersionUpgrade", (properties.AllowVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowVersionUpgrade) : undefined));
  ret.addPropertyResult("aquaConfigurationStatus", "AquaConfigurationStatus", (properties.AquaConfigurationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AquaConfigurationStatus) : undefined));
  ret.addPropertyResult("automatedSnapshotRetentionPeriod", "AutomatedSnapshotRetentionPeriod", (properties.AutomatedSnapshotRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomatedSnapshotRetentionPeriod) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("availabilityZoneRelocation", "AvailabilityZoneRelocation", (properties.AvailabilityZoneRelocation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AvailabilityZoneRelocation) : undefined));
  ret.addPropertyResult("availabilityZoneRelocationStatus", "AvailabilityZoneRelocationStatus", (properties.AvailabilityZoneRelocationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZoneRelocationStatus) : undefined));
  ret.addPropertyResult("classic", "Classic", (properties.Classic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Classic) : undefined));
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("clusterParameterGroupName", "ClusterParameterGroupName", (properties.ClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterParameterGroupName) : undefined));
  ret.addPropertyResult("clusterSecurityGroups", "ClusterSecurityGroups", (properties.ClusterSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClusterSecurityGroups) : undefined));
  ret.addPropertyResult("clusterSubnetGroupName", "ClusterSubnetGroupName", (properties.ClusterSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterSubnetGroupName) : undefined));
  ret.addPropertyResult("clusterType", "ClusterType", (properties.ClusterType != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterType) : undefined));
  ret.addPropertyResult("clusterVersion", "ClusterVersion", (properties.ClusterVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterVersion) : undefined));
  ret.addPropertyResult("dbName", "DBName", (properties.DBName != null ? cfn_parse.FromCloudFormation.getString(properties.DBName) : undefined));
  ret.addPropertyResult("deferMaintenance", "DeferMaintenance", (properties.DeferMaintenance != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeferMaintenance) : undefined));
  ret.addPropertyResult("deferMaintenanceDuration", "DeferMaintenanceDuration", (properties.DeferMaintenanceDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.DeferMaintenanceDuration) : undefined));
  ret.addPropertyResult("deferMaintenanceEndTime", "DeferMaintenanceEndTime", (properties.DeferMaintenanceEndTime != null ? cfn_parse.FromCloudFormation.getString(properties.DeferMaintenanceEndTime) : undefined));
  ret.addPropertyResult("deferMaintenanceStartTime", "DeferMaintenanceStartTime", (properties.DeferMaintenanceStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.DeferMaintenanceStartTime) : undefined));
  ret.addPropertyResult("destinationRegion", "DestinationRegion", (properties.DestinationRegion != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationRegion) : undefined));
  ret.addPropertyResult("elasticIp", "ElasticIp", (properties.ElasticIp != null ? cfn_parse.FromCloudFormation.getString(properties.ElasticIp) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? CfnClusterEndpointPropertyFromCloudFormation(properties.Endpoint) : undefined));
  ret.addPropertyResult("enhancedVpcRouting", "EnhancedVpcRouting", (properties.EnhancedVpcRouting != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedVpcRouting) : undefined));
  ret.addPropertyResult("hsmClientCertificateIdentifier", "HsmClientCertificateIdentifier", (properties.HsmClientCertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.HsmClientCertificateIdentifier) : undefined));
  ret.addPropertyResult("hsmConfigurationIdentifier", "HsmConfigurationIdentifier", (properties.HsmConfigurationIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.HsmConfigurationIdentifier) : undefined));
  ret.addPropertyResult("iamRoles", "IamRoles", (properties.IamRoles != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IamRoles) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("loggingProperties", "LoggingProperties", (properties.LoggingProperties != null ? CfnClusterLoggingPropertiesPropertyFromCloudFormation(properties.LoggingProperties) : undefined));
  ret.addPropertyResult("maintenanceTrackName", "MaintenanceTrackName", (properties.MaintenanceTrackName != null ? cfn_parse.FromCloudFormation.getString(properties.MaintenanceTrackName) : undefined));
  ret.addPropertyResult("manageMasterPassword", "ManageMasterPassword", (properties.ManageMasterPassword != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ManageMasterPassword) : undefined));
  ret.addPropertyResult("manualSnapshotRetentionPeriod", "ManualSnapshotRetentionPeriod", (properties.ManualSnapshotRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManualSnapshotRetentionPeriod) : undefined));
  ret.addPropertyResult("masterPasswordSecretKmsKeyId", "MasterPasswordSecretKmsKeyId", (properties.MasterPasswordSecretKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.MasterPasswordSecretKmsKeyId) : undefined));
  ret.addPropertyResult("masterUsername", "MasterUsername", (properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addPropertyResult("multiAz", "MultiAZ", (properties.MultiAZ != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiAZ) : undefined));
  ret.addPropertyResult("namespaceResourcePolicy", "NamespaceResourcePolicy", (properties.NamespaceResourcePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.NamespaceResourcePolicy) : undefined));
  ret.addPropertyResult("nodeType", "NodeType", (properties.NodeType != null ? cfn_parse.FromCloudFormation.getString(properties.NodeType) : undefined));
  ret.addPropertyResult("numberOfNodes", "NumberOfNodes", (properties.NumberOfNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfNodes) : undefined));
  ret.addPropertyResult("ownerAccount", "OwnerAccount", (properties.OwnerAccount != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerAccount) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("resourceAction", "ResourceAction", (properties.ResourceAction != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceAction) : undefined));
  ret.addPropertyResult("revisionTarget", "RevisionTarget", (properties.RevisionTarget != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionTarget) : undefined));
  ret.addPropertyResult("rotateEncryptionKey", "RotateEncryptionKey", (properties.RotateEncryptionKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RotateEncryptionKey) : undefined));
  ret.addPropertyResult("snapshotClusterIdentifier", "SnapshotClusterIdentifier", (properties.SnapshotClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotClusterIdentifier) : undefined));
  ret.addPropertyResult("snapshotCopyGrantName", "SnapshotCopyGrantName", (properties.SnapshotCopyGrantName != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotCopyGrantName) : undefined));
  ret.addPropertyResult("snapshotCopyManual", "SnapshotCopyManual", (properties.SnapshotCopyManual != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SnapshotCopyManual) : undefined));
  ret.addPropertyResult("snapshotCopyRetentionPeriod", "SnapshotCopyRetentionPeriod", (properties.SnapshotCopyRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.SnapshotCopyRetentionPeriod) : undefined));
  ret.addPropertyResult("snapshotIdentifier", "SnapshotIdentifier", (properties.SnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Describes a parameter group.
 *
 * @cloudformationResource AWS::Redshift::ClusterParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html
 */
export class CfnClusterParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::ClusterParameterGroup";

  /**
   * Build a CfnClusterParameterGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterParameterGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterParameterGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterParameterGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the parameter group.
   */
  public description: string;

  /**
   * The name of the cluster parameter group family that this cluster parameter group is compatible with.
   */
  public parameterGroupFamily: string;

  /**
   * The name of the cluster parameter group.
   */
  public parameterGroupName?: string;

  /**
   * An array of parameters to be modified. A maximum of 20 parameters can be modified in a single request.
   */
  public parameters?: Array<cdk.IResolvable | CfnClusterParameterGroup.ParameterProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of tags for the cluster parameter group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterParameterGroupProps) {
    super(scope, id, {
      "type": CfnClusterParameterGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "parameterGroupFamily", this);

    this.description = props.description;
    this.parameterGroupFamily = props.parameterGroupFamily;
    this.parameterGroupName = props.parameterGroupName;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Redshift::ClusterParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "parameterGroupFamily": this.parameterGroupFamily,
      "parameterGroupName": this.parameterGroupName,
      "parameters": this.parameters,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterParameterGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterParameterGroupPropsToCloudFormation(props);
  }
}

export namespace CfnClusterParameterGroup {
  /**
   * Describes a parameter in a cluster parameter group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-clusterparametergroup-parameter.html
   */
  export interface ParameterProperty {
    /**
     * The name of the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-clusterparametergroup-parameter.html#cfn-redshift-clusterparametergroup-parameter-parametername
     */
    readonly parameterName: string;

    /**
     * The value of the parameter.
     *
     * If `ParameterName` is `wlm_json_configuration` , then the maximum size of `ParameterValue` is 8000 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-clusterparametergroup-parameter.html#cfn-redshift-clusterparametergroup-parameter-parametervalue
     */
    readonly parameterValue: string;
  }
}

/**
 * Properties for defining a `CfnClusterParameterGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html
 */
export interface CfnClusterParameterGroupProps {
  /**
   * The description of the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-description
   */
  readonly description: string;

  /**
   * The name of the cluster parameter group family that this cluster parameter group is compatible with.
   *
   * You can create a custom parameter group and then associate your cluster with it. For more information, see [Amazon Redshift parameter groups](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-parametergroupfamily
   */
  readonly parameterGroupFamily: string;

  /**
   * The name of the cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-parametergroupname
   */
  readonly parameterGroupName?: string;

  /**
   * An array of parameters to be modified. A maximum of 20 parameters can be modified in a single request.
   *
   * For each parameter to be modified, you must supply at least the parameter name and parameter value; other name-value pairs of the parameter are optional.
   *
   * For the workload management (WLM) configuration, you must supply all the name-value pairs in the wlm_json_configuration parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-parameters
   */
  readonly parameters?: Array<cdk.IResolvable | CfnClusterParameterGroup.ParameterProperty> | cdk.IResolvable;

  /**
   * The list of tags for the cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterParameterGroupParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterParameterGroupParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterParameterGroupParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnClusterParameterGroupParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnClusterParameterGroup.ParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterParameterGroup.ParameterProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterParameterGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("parameterGroupFamily", cdk.requiredValidator)(properties.parameterGroupFamily));
  errors.collect(cdk.propertyValidator("parameterGroupFamily", cdk.validateString)(properties.parameterGroupFamily));
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.validateString)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnClusterParameterGroupParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ParameterGroupFamily": cdk.stringToCloudFormation(properties.parameterGroupFamily),
    "ParameterGroupName": cdk.stringToCloudFormation(properties.parameterGroupName),
    "Parameters": cdk.listMapper(convertCfnClusterParameterGroupParameterPropertyToCloudFormation)(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterParameterGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterParameterGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("parameterGroupFamily", "ParameterGroupFamily", (properties.ParameterGroupFamily != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupFamily) : undefined));
  ret.addPropertyResult("parameterGroupName", "ParameterGroupName", (properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterParameterGroupParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new Amazon Redshift security group. You use security groups to control access to non-VPC clusters.
 *
 * For information about managing security groups, go to [Amazon Redshift Cluster Security Groups](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-security-groups.html) in the *Amazon Redshift Cluster Management Guide* .
 *
 * @cloudformationResource AWS::Redshift::ClusterSecurityGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroup.html
 */
export class CfnClusterSecurityGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::ClusterSecurityGroup";

  /**
   * Build a CfnClusterSecurityGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterSecurityGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterSecurityGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterSecurityGroup(scope, id, propsResult.value);
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
   * A description for the security group.
   */
  public description: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies an arbitrary set of tags (key–value pairs) to associate with this security group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterSecurityGroupProps) {
    super(scope, id, {
      "type": CfnClusterSecurityGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Redshift::ClusterSecurityGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterSecurityGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterSecurityGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnClusterSecurityGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroup.html
 */
export interface CfnClusterSecurityGroupProps {
  /**
   * A description for the security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroup.html#cfn-redshift-clustersecuritygroup-description
   */
  readonly description: string;

  /**
   * Specifies an arbitrary set of tags (key–value pairs) to associate with this security group.
   *
   * Use tags to manage your resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroup.html#cfn-redshift-clustersecuritygroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnClusterSecurityGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterSecurityGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSecurityGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterSecurityGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterSecurityGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSecurityGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterSecurityGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterSecurityGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterSecurityGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds an inbound (ingress) rule to an Amazon Redshift security group.
 *
 * Depending on whether the application accessing your cluster is running on the Internet or an Amazon EC2 instance, you can authorize inbound access to either a Classless Interdomain Routing (CIDR)/Internet Protocol (IP) range or to an Amazon EC2 security group. You can add as many as 20 ingress rules to an Amazon Redshift security group.
 *
 * If you authorize access to an Amazon EC2 security group, specify *EC2SecurityGroupName* and *EC2SecurityGroupOwnerId* . The Amazon EC2 security group and Amazon Redshift cluster must be in the same AWS Region .
 *
 * If you authorize access to a CIDR/IP address range, specify *CIDRIP* . For an overview of CIDR blocks, see the Wikipedia article on [Classless Inter-Domain Routing](https://docs.aws.amazon.com/http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
 *
 * You must also associate the security group with a cluster so that clients running on these IP addresses or the EC2 instance are authorized to connect to the cluster. For information about managing security groups, go to [Working with Security Groups](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-security-groups.html) in the *Amazon Redshift Cluster Management Guide* .
 *
 * @cloudformationResource AWS::Redshift::ClusterSecurityGroupIngress
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html
 */
export class CfnClusterSecurityGroupIngress extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::ClusterSecurityGroupIngress";

  /**
   * Build a CfnClusterSecurityGroupIngress from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterSecurityGroupIngress {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterSecurityGroupIngressPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterSecurityGroupIngress(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies an inbound (ingress) rule for an Amazon Redshift security group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The IP range to be added the Amazon Redshift security group.
   */
  public cidrip?: string;

  /**
   * The name of the security group to which the ingress rule is added.
   */
  public clusterSecurityGroupName: string;

  /**
   * The EC2 security group to be added the Amazon Redshift security group.
   */
  public ec2SecurityGroupName?: string;

  /**
   * The AWS account number of the owner of the security group specified by the *EC2SecurityGroupName* parameter.
   */
  public ec2SecurityGroupOwnerId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterSecurityGroupIngressProps) {
    super(scope, id, {
      "type": CfnClusterSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterSecurityGroupName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.cidrip = props.cidrip;
    this.clusterSecurityGroupName = props.clusterSecurityGroupName;
    this.ec2SecurityGroupName = props.ec2SecurityGroupName;
    this.ec2SecurityGroupOwnerId = props.ec2SecurityGroupOwnerId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cidrip": this.cidrip,
      "clusterSecurityGroupName": this.clusterSecurityGroupName,
      "ec2SecurityGroupName": this.ec2SecurityGroupName,
      "ec2SecurityGroupOwnerId": this.ec2SecurityGroupOwnerId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterSecurityGroupIngressPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnClusterSecurityGroupIngress`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html
 */
export interface CfnClusterSecurityGroupIngressProps {
  /**
   * The IP range to be added the Amazon Redshift security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-cidrip
   */
  readonly cidrip?: string;

  /**
   * The name of the security group to which the ingress rule is added.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-clustersecuritygroupname
   */
  readonly clusterSecurityGroupName: string;

  /**
   * The EC2 security group to be added the Amazon Redshift security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-ec2securitygroupname
   */
  readonly ec2SecurityGroupName?: string;

  /**
   * The AWS account number of the owner of the security group specified by the *EC2SecurityGroupName* parameter.
   *
   * The AWS Access Key ID is not an acceptable value.
   *
   * Example: `111122223333`
   *
   * Conditional. If you specify the `EC2SecurityGroupName` property, you must specify this property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-ec2securitygroupownerid
   */
  readonly ec2SecurityGroupOwnerId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnClusterSecurityGroupIngressProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterSecurityGroupIngressProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSecurityGroupIngressPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrip", cdk.validateString)(properties.cidrip));
  errors.collect(cdk.propertyValidator("clusterSecurityGroupName", cdk.requiredValidator)(properties.clusterSecurityGroupName));
  errors.collect(cdk.propertyValidator("clusterSecurityGroupName", cdk.validateString)(properties.clusterSecurityGroupName));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupName", cdk.validateString)(properties.ec2SecurityGroupName));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupOwnerId", cdk.validateString)(properties.ec2SecurityGroupOwnerId));
  return errors.wrap("supplied properties not correct for \"CfnClusterSecurityGroupIngressProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterSecurityGroupIngressPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSecurityGroupIngressPropsValidator(properties).assertSuccess();
  return {
    "CIDRIP": cdk.stringToCloudFormation(properties.cidrip),
    "ClusterSecurityGroupName": cdk.stringToCloudFormation(properties.clusterSecurityGroupName),
    "EC2SecurityGroupName": cdk.stringToCloudFormation(properties.ec2SecurityGroupName),
    "EC2SecurityGroupOwnerId": cdk.stringToCloudFormation(properties.ec2SecurityGroupOwnerId)
  };
}

// @ts-ignore TS6133
function CfnClusterSecurityGroupIngressPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterSecurityGroupIngressProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterSecurityGroupIngressProps>();
  ret.addPropertyResult("cidrip", "CIDRIP", (properties.CIDRIP != null ? cfn_parse.FromCloudFormation.getString(properties.CIDRIP) : undefined));
  ret.addPropertyResult("clusterSecurityGroupName", "ClusterSecurityGroupName", (properties.ClusterSecurityGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterSecurityGroupName) : undefined));
  ret.addPropertyResult("ec2SecurityGroupName", "EC2SecurityGroupName", (properties.EC2SecurityGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupName) : undefined));
  ret.addPropertyResult("ec2SecurityGroupOwnerId", "EC2SecurityGroupOwnerId", (properties.EC2SecurityGroupOwnerId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupOwnerId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an Amazon Redshift subnet group.
 *
 * You must provide a list of one or more subnets in your existing Amazon Virtual Private Cloud ( Amazon VPC ) when creating Amazon Redshift subnet group.
 *
 * For information about subnet groups, go to [Amazon Redshift Cluster Subnet Groups](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-cluster-subnet-groups.html) in the *Amazon Redshift Cluster Management Guide* .
 *
 * @cloudformationResource AWS::Redshift::ClusterSubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersubnetgroup.html
 */
export class CfnClusterSubnetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::ClusterSubnetGroup";

  /**
   * Build a CfnClusterSubnetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterSubnetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterSubnetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterSubnetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the cluster subnet group.
   *
   * @cloudformationAttribute ClusterSubnetGroupName
   */
  public readonly attrClusterSubnetGroupName: string;

  /**
   * A description for the subnet group.
   */
  public description: string;

  /**
   * An array of VPC subnet IDs.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies an arbitrary set of tags (key–value pairs) to associate with this subnet group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterSubnetGroupProps) {
    super(scope, id, {
      "type": CfnClusterSubnetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "subnetIds", this);

    this.attrClusterSubnetGroupName = cdk.Token.asString(this.getAtt("ClusterSubnetGroupName", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Redshift::ClusterSubnetGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterSubnetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterSubnetGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnClusterSubnetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersubnetgroup.html
 */
export interface CfnClusterSubnetGroupProps {
  /**
   * A description for the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersubnetgroup.html#cfn-redshift-clustersubnetgroup-description
   */
  readonly description: string;

  /**
   * An array of VPC subnet IDs.
   *
   * A maximum of 20 subnets can be modified in a single request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersubnetgroup.html#cfn-redshift-clustersubnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * Specifies an arbitrary set of tags (key–value pairs) to associate with this subnet group.
   *
   * Use tags to manage your resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersubnetgroup.html#cfn-redshift-clustersubnetgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnClusterSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterSubnetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterSubnetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSubnetGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterSubnetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterSubnetGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a Redshift-managed VPC endpoint.
 *
 * @cloudformationResource AWS::Redshift::EndpointAccess
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html
 */
export class CfnEndpointAccess extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::EndpointAccess";

  /**
   * Build a CfnEndpointAccess from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpointAccess {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEndpointAccessPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEndpointAccess(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The DNS address of the endpoint.
   *
   * @cloudformationAttribute Address
   */
  public readonly attrAddress: string;

  /**
   * The time (UTC) that the endpoint was created.
   *
   * @cloudformationAttribute EndpointCreateTime
   */
  public readonly attrEndpointCreateTime: string;

  /**
   * The status of the endpoint.
   *
   * @cloudformationAttribute EndpointStatus
   */
  public readonly attrEndpointStatus: string;

  /**
   * The port number on which the cluster accepts incoming connections.
   *
   * @cloudformationAttribute Port
   */
  public readonly attrPort: number;

  /**
   * The connection endpoint for connecting to an Amazon Redshift cluster through the proxy.
   *
   * @cloudformationAttribute VpcEndpoint
   */
  public readonly attrVpcEndpoint: cdk.IResolvable;

  /**
   * @cloudformationAttribute VpcEndpoint.NetworkInterfaces
   */
  public readonly attrVpcEndpointNetworkInterfaces: cdk.IResolvable;

  /**
   * The connection endpoint ID for connecting an Amazon Redshift cluster through the proxy.
   *
   * @cloudformationAttribute VpcEndpoint.VpcEndpointId
   */
  public readonly attrVpcEndpointVpcEndpointId: string;

  /**
   * The VPC identifier that the endpoint is associated.
   *
   * @cloudformationAttribute VpcEndpoint.VpcId
   */
  public readonly attrVpcEndpointVpcId: string;

  /**
   * The security groups associated with the endpoint.
   *
   * @cloudformationAttribute VpcSecurityGroups
   */
  public readonly attrVpcSecurityGroups: cdk.IResolvable;

  /**
   * The cluster identifier of the cluster associated with the endpoint.
   */
  public clusterIdentifier: string;

  /**
   * The name of the endpoint.
   */
  public endpointName: string;

  /**
   * The AWS account ID of the owner of the cluster.
   */
  public resourceOwner?: string;

  /**
   * The subnet group name where Amazon Redshift chooses to deploy the endpoint.
   */
  public subnetGroupName: string;

  /**
   * The security group that defines the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
   */
  public vpcSecurityGroupIds: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEndpointAccessProps) {
    super(scope, id, {
      "type": CfnEndpointAccess.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterIdentifier", this);
    cdk.requireProperty(props, "endpointName", this);
    cdk.requireProperty(props, "subnetGroupName", this);
    cdk.requireProperty(props, "vpcSecurityGroupIds", this);

    this.attrAddress = cdk.Token.asString(this.getAtt("Address", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointCreateTime = cdk.Token.asString(this.getAtt("EndpointCreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointStatus = cdk.Token.asString(this.getAtt("EndpointStatus", cdk.ResolutionTypeHint.STRING));
    this.attrPort = cdk.Token.asNumber(this.getAtt("Port", cdk.ResolutionTypeHint.NUMBER));
    this.attrVpcEndpoint = this.getAtt("VpcEndpoint");
    this.attrVpcEndpointNetworkInterfaces = this.getAtt("VpcEndpoint.NetworkInterfaces");
    this.attrVpcEndpointVpcEndpointId = cdk.Token.asString(this.getAtt("VpcEndpoint.VpcEndpointId", cdk.ResolutionTypeHint.STRING));
    this.attrVpcEndpointVpcId = cdk.Token.asString(this.getAtt("VpcEndpoint.VpcId", cdk.ResolutionTypeHint.STRING));
    this.attrVpcSecurityGroups = this.getAtt("VpcSecurityGroups");
    this.clusterIdentifier = props.clusterIdentifier;
    this.endpointName = props.endpointName;
    this.resourceOwner = props.resourceOwner;
    this.subnetGroupName = props.subnetGroupName;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterIdentifier": this.clusterIdentifier,
      "endpointName": this.endpointName,
      "resourceOwner": this.resourceOwner,
      "subnetGroupName": this.subnetGroupName,
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpointAccess.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEndpointAccessPropsToCloudFormation(props);
  }
}

export namespace CfnEndpointAccess {
  /**
   * The connection endpoint for connecting to an Amazon Redshift cluster through the proxy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcendpoint.html
   */
  export interface VpcEndpointProperty {
    /**
     * One or more network interfaces of the endpoint.
     *
     * Also known as an interface endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcendpoint.html#cfn-redshift-endpointaccess-vpcendpoint-networkinterfaces
     */
    readonly networkInterfaces?: Array<cdk.IResolvable | CfnEndpointAccess.NetworkInterfaceProperty> | cdk.IResolvable;

    /**
     * The connection endpoint ID for connecting an Amazon Redshift cluster through the proxy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcendpoint.html#cfn-redshift-endpointaccess-vpcendpoint-vpcendpointid
     */
    readonly vpcEndpointId?: string;

    /**
     * The VPC identifier that the endpoint is associated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcendpoint.html#cfn-redshift-endpointaccess-vpcendpoint-vpcid
     */
    readonly vpcId?: string;
  }

  /**
   * Describes a network interface.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-networkinterface.html
   */
  export interface NetworkInterfaceProperty {
    /**
     * The Availability Zone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-networkinterface.html#cfn-redshift-endpointaccess-networkinterface-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The network interface identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-networkinterface.html#cfn-redshift-endpointaccess-networkinterface-networkinterfaceid
     */
    readonly networkInterfaceId?: string;

    /**
     * The IPv4 address of the network interface within the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-networkinterface.html#cfn-redshift-endpointaccess-networkinterface-privateipaddress
     */
    readonly privateIpAddress?: string;

    /**
     * The subnet identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-networkinterface.html#cfn-redshift-endpointaccess-networkinterface-subnetid
     */
    readonly subnetId?: string;
  }

  /**
   * The security groups associated with the endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcsecuritygroup.html
   */
  export interface VpcSecurityGroupProperty {
    /**
     * The status of the endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcsecuritygroup.html#cfn-redshift-endpointaccess-vpcsecuritygroup-status
     */
    readonly status?: string;

    /**
     * The identifier of the VPC security group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-endpointaccess-vpcsecuritygroup.html#cfn-redshift-endpointaccess-vpcsecuritygroup-vpcsecuritygroupid
     */
    readonly vpcSecurityGroupId?: string;
  }
}

/**
 * Properties for defining a `CfnEndpointAccess`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html
 */
export interface CfnEndpointAccessProps {
  /**
   * The cluster identifier of the cluster associated with the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html#cfn-redshift-endpointaccess-clusteridentifier
   */
  readonly clusterIdentifier: string;

  /**
   * The name of the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html#cfn-redshift-endpointaccess-endpointname
   */
  readonly endpointName: string;

  /**
   * The AWS account ID of the owner of the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html#cfn-redshift-endpointaccess-resourceowner
   */
  readonly resourceOwner?: string;

  /**
   * The subnet group name where Amazon Redshift chooses to deploy the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html#cfn-redshift-endpointaccess-subnetgroupname
   */
  readonly subnetGroupName: string;

  /**
   * The security group that defines the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointaccess.html#cfn-redshift-endpointaccess-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds: Array<string>;
}

/**
 * Determine whether the given properties match those of a `NetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointAccessNetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("networkInterfaceId", cdk.validateString)(properties.networkInterfaceId));
  errors.collect(cdk.propertyValidator("privateIpAddress", cdk.validateString)(properties.privateIpAddress));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"NetworkInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointAccessNetworkInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointAccessNetworkInterfacePropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "NetworkInterfaceId": cdk.stringToCloudFormation(properties.networkInterfaceId),
    "PrivateIpAddress": cdk.stringToCloudFormation(properties.privateIpAddress),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnEndpointAccessNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpointAccess.NetworkInterfaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointAccess.NetworkInterfaceProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("networkInterfaceId", "NetworkInterfaceId", (properties.NetworkInterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkInterfaceId) : undefined));
  ret.addPropertyResult("privateIpAddress", "PrivateIpAddress", (properties.PrivateIpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateIpAddress) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `VpcEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointAccessVpcEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("networkInterfaces", cdk.listValidator(CfnEndpointAccessNetworkInterfacePropertyValidator))(properties.networkInterfaces));
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointAccessVpcEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointAccessVpcEndpointPropertyValidator(properties).assertSuccess();
  return {
    "NetworkInterfaces": cdk.listMapper(convertCfnEndpointAccessNetworkInterfacePropertyToCloudFormation)(properties.networkInterfaces),
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnEndpointAccessVpcEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpointAccess.VpcEndpointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointAccess.VpcEndpointProperty>();
  ret.addPropertyResult("networkInterfaces", "NetworkInterfaces", (properties.NetworkInterfaces != null ? cfn_parse.FromCloudFormation.getArray(CfnEndpointAccessNetworkInterfacePropertyFromCloudFormation)(properties.NetworkInterfaces) : undefined));
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcSecurityGroupProperty`
 *
 * @param properties - the TypeScript properties of a `VpcSecurityGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointAccessVpcSecurityGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupId", cdk.validateString)(properties.vpcSecurityGroupId));
  return errors.wrap("supplied properties not correct for \"VpcSecurityGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointAccessVpcSecurityGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointAccessVpcSecurityGroupPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status),
    "VpcSecurityGroupId": cdk.stringToCloudFormation(properties.vpcSecurityGroupId)
  };
}

// @ts-ignore TS6133
function CfnEndpointAccessVpcSecurityGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpointAccess.VpcSecurityGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointAccess.VpcSecurityGroupProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("vpcSecurityGroupId", "VpcSecurityGroupId", (properties.VpcSecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcSecurityGroupId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointAccessProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointAccessProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointAccessPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("endpointName", cdk.requiredValidator)(properties.endpointName));
  errors.collect(cdk.propertyValidator("endpointName", cdk.validateString)(properties.endpointName));
  errors.collect(cdk.propertyValidator("resourceOwner", cdk.validateString)(properties.resourceOwner));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.requiredValidator)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.validateString)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.requiredValidator)(properties.vpcSecurityGroupIds));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  return errors.wrap("supplied properties not correct for \"CfnEndpointAccessProps\"");
}

// @ts-ignore TS6133
function convertCfnEndpointAccessPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointAccessPropsValidator(properties).assertSuccess();
  return {
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "EndpointName": cdk.stringToCloudFormation(properties.endpointName),
    "ResourceOwner": cdk.stringToCloudFormation(properties.resourceOwner),
    "SubnetGroupName": cdk.stringToCloudFormation(properties.subnetGroupName),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds)
  };
}

// @ts-ignore TS6133
function CfnEndpointAccessPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointAccessProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointAccessProps>();
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("endpointName", "EndpointName", (properties.EndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointName) : undefined));
  ret.addPropertyResult("resourceOwner", "ResourceOwner", (properties.ResourceOwner != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceOwner) : undefined));
  ret.addPropertyResult("subnetGroupName", "SubnetGroupName", (properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Describes an endpoint authorization for authorizing Redshift-managed VPC endpoint access to a cluster across AWS accounts .
 *
 * @cloudformationResource AWS::Redshift::EndpointAuthorization
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html
 */
export class CfnEndpointAuthorization extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::EndpointAuthorization";

  /**
   * Build a CfnEndpointAuthorization from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpointAuthorization {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEndpointAuthorizationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEndpointAuthorization(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Indicates whether all VPCs in the grantee account are allowed access to the cluster.
   *
   * @cloudformationAttribute AllowedAllVPCs
   */
  public readonly attrAllowedAllVpCs: cdk.IResolvable;

  /**
   * The VPCs allowed access to the cluster.
   *
   * @cloudformationAttribute AllowedVPCs
   */
  public readonly attrAllowedVpCs: Array<string>;

  /**
   * The time (UTC) when the authorization was created.
   *
   * @cloudformationAttribute AuthorizeTime
   */
  public readonly attrAuthorizeTime: string;

  /**
   * The status of the cluster.
   *
   * @cloudformationAttribute ClusterStatus
   */
  public readonly attrClusterStatus: string;

  /**
   * The number of Redshift-managed VPC endpoints created for the authorization.
   *
   * @cloudformationAttribute EndpointCount
   */
  public readonly attrEndpointCount: number;

  /**
   * The AWS account ID of the grantee of the cluster.
   *
   * @cloudformationAttribute Grantee
   */
  public readonly attrGrantee: string;

  /**
   * The AWS account ID of the cluster owner.
   *
   * @cloudformationAttribute Grantor
   */
  public readonly attrGrantor: string;

  /**
   * The status of the authorization action.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The AWS account ID of either the cluster owner (grantor) or grantee.
   */
  public account: string;

  /**
   * The cluster identifier.
   */
  public clusterIdentifier: string;

  /**
   * Indicates whether to force the revoke action.
   */
  public force?: boolean | cdk.IResolvable;

  /**
   * The virtual private cloud (VPC) identifiers to grant access to.
   */
  public vpcIds?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEndpointAuthorizationProps) {
    super(scope, id, {
      "type": CfnEndpointAuthorization.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "account", this);
    cdk.requireProperty(props, "clusterIdentifier", this);

    this.attrAllowedAllVpCs = this.getAtt("AllowedAllVPCs");
    this.attrAllowedVpCs = cdk.Token.asList(this.getAtt("AllowedVPCs", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrAuthorizeTime = cdk.Token.asString(this.getAtt("AuthorizeTime", cdk.ResolutionTypeHint.STRING));
    this.attrClusterStatus = cdk.Token.asString(this.getAtt("ClusterStatus", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointCount = cdk.Token.asNumber(this.getAtt("EndpointCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrGrantee = cdk.Token.asString(this.getAtt("Grantee", cdk.ResolutionTypeHint.STRING));
    this.attrGrantor = cdk.Token.asString(this.getAtt("Grantor", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.account = props.account;
    this.clusterIdentifier = props.clusterIdentifier;
    this.force = props.force;
    this.vpcIds = props.vpcIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "account": this.account,
      "clusterIdentifier": this.clusterIdentifier,
      "force": this.force,
      "vpcIds": this.vpcIds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpointAuthorization.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEndpointAuthorizationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEndpointAuthorization`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html
 */
export interface CfnEndpointAuthorizationProps {
  /**
   * The AWS account ID of either the cluster owner (grantor) or grantee.
   *
   * If `Grantee` parameter is true, then the `Account` value is of the grantor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html#cfn-redshift-endpointauthorization-account
   */
  readonly account: string;

  /**
   * The cluster identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html#cfn-redshift-endpointauthorization-clusteridentifier
   */
  readonly clusterIdentifier: string;

  /**
   * Indicates whether to force the revoke action.
   *
   * If true, the Redshift-managed VPC endpoints associated with the endpoint authorization are also deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html#cfn-redshift-endpointauthorization-force
   */
  readonly force?: boolean | cdk.IResolvable;

  /**
   * The virtual private cloud (VPC) identifiers to grant access to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-endpointauthorization.html#cfn-redshift-endpointauthorization-vpcids
   */
  readonly vpcIds?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointAuthorizationProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointAuthorizationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointAuthorizationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("account", cdk.requiredValidator)(properties.account));
  errors.collect(cdk.propertyValidator("account", cdk.validateString)(properties.account));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("force", cdk.validateBoolean)(properties.force));
  errors.collect(cdk.propertyValidator("vpcIds", cdk.listValidator(cdk.validateString))(properties.vpcIds));
  return errors.wrap("supplied properties not correct for \"CfnEndpointAuthorizationProps\"");
}

// @ts-ignore TS6133
function convertCfnEndpointAuthorizationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointAuthorizationPropsValidator(properties).assertSuccess();
  return {
    "Account": cdk.stringToCloudFormation(properties.account),
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "Force": cdk.booleanToCloudFormation(properties.force),
    "VpcIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcIds)
  };
}

// @ts-ignore TS6133
function CfnEndpointAuthorizationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointAuthorizationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointAuthorizationProps>();
  ret.addPropertyResult("account", "Account", (properties.Account != null ? cfn_parse.FromCloudFormation.getString(properties.Account) : undefined));
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("force", "Force", (properties.Force != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Force) : undefined));
  ret.addPropertyResult("vpcIds", "VpcIds", (properties.VpcIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html.
 *
 * @cloudformationResource AWS::Redshift::EventSubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html
 */
export class CfnEventSubscription extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::EventSubscription";

  /**
   * Build a CfnEventSubscription from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventSubscription {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventSubscriptionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventSubscription(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The AWS account associated with the Amazon Redshift event notification subscription.
   *
   * @cloudformationAttribute CustomerAwsId
   */
  public readonly attrCustomerAwsId: string;

  /**
   * The name of the Amazon Redshift event notification subscription.
   *
   * @cloudformationAttribute CustSubscriptionId
   */
  public readonly attrCustSubscriptionId: string;

  /**
   * The list of Amazon Redshift event categories specified in the event notification subscription.
   *
   * Values: Configuration, Management, Monitoring, Security, Pending
   *
   * @cloudformationAttribute EventCategoriesList
   */
  public readonly attrEventCategoriesList: Array<string>;

  /**
   * A list of the sources that publish events to the Amazon Redshift event notification subscription.
   *
   * @cloudformationAttribute SourceIdsList
   */
  public readonly attrSourceIdsList: Array<string>;

  /**
   * The status of the Amazon Redshift event notification subscription.
   *
   * Constraints:
   *
   * - Can be one of the following: active | no-permission | topic-not-exist
   * - The status "no-permission" indicates that Amazon Redshift no longer has permission to post to the Amazon SNS topic. The status "topic-not-exist" indicates that the topic was deleted after the subscription was created.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The date and time the Amazon Redshift event notification subscription was created.
   *
   * @cloudformationAttribute SubscriptionCreationTime
   */
  public readonly attrSubscriptionCreationTime: string;

  /**
   * A boolean value;
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * Specifies the Amazon Redshift event categories to be published by the event notification subscription.
   */
  public eventCategories?: Array<string>;

  /**
   * Specifies the Amazon Redshift event severity to be published by the event notification subscription.
   */
  public severity?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic used to transmit the event notifications.
   */
  public snsTopicArn?: string;

  /**
   * A list of one or more identifiers of Amazon Redshift source objects.
   */
  public sourceIds?: Array<string>;

  /**
   * The type of source that will be generating the events.
   */
  public sourceType?: string;

  /**
   * The name of the event subscription to be created.
   */
  public subscriptionName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tag instances.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventSubscriptionProps) {
    super(scope, id, {
      "type": CfnEventSubscription.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "subscriptionName", this);

    this.attrCustomerAwsId = cdk.Token.asString(this.getAtt("CustomerAwsId", cdk.ResolutionTypeHint.STRING));
    this.attrCustSubscriptionId = cdk.Token.asString(this.getAtt("CustSubscriptionId", cdk.ResolutionTypeHint.STRING));
    this.attrEventCategoriesList = cdk.Token.asList(this.getAtt("EventCategoriesList", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrSourceIdsList = cdk.Token.asList(this.getAtt("SourceIdsList", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrSubscriptionCreationTime = cdk.Token.asString(this.getAtt("SubscriptionCreationTime", cdk.ResolutionTypeHint.STRING));
    this.enabled = props.enabled;
    this.eventCategories = props.eventCategories;
    this.severity = props.severity;
    this.snsTopicArn = props.snsTopicArn;
    this.sourceIds = props.sourceIds;
    this.sourceType = props.sourceType;
    this.subscriptionName = props.subscriptionName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Redshift::EventSubscription", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enabled": this.enabled,
      "eventCategories": this.eventCategories,
      "severity": this.severity,
      "snsTopicArn": this.snsTopicArn,
      "sourceIds": this.sourceIds,
      "sourceType": this.sourceType,
      "subscriptionName": this.subscriptionName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventSubscription.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventSubscriptionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEventSubscription`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html
 */
export interface CfnEventSubscriptionProps {
  /**
   * A boolean value;
   *
   * set to `true` to activate the subscription, and set to `false` to create the subscription but not activate it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * Specifies the Amazon Redshift event categories to be published by the event notification subscription.
   *
   * Values: configuration, management, monitoring, security, pending
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-eventcategories
   */
  readonly eventCategories?: Array<string>;

  /**
   * Specifies the Amazon Redshift event severity to be published by the event notification subscription.
   *
   * Values: ERROR, INFO
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-severity
   */
  readonly severity?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic used to transmit the event notifications.
   *
   * The ARN is created by Amazon SNS when you create a topic and subscribe to it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-snstopicarn
   */
  readonly snsTopicArn?: string;

  /**
   * A list of one or more identifiers of Amazon Redshift source objects.
   *
   * All of the objects must be of the same type as was specified in the source type parameter. The event subscription will return only events generated by the specified objects. If not specified, then events are returned for all objects within the source type specified.
   *
   * Example: my-cluster-1, my-cluster-2
   *
   * Example: my-snapshot-20131010
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-sourceids
   */
  readonly sourceIds?: Array<string>;

  /**
   * The type of source that will be generating the events.
   *
   * For example, if you want to be notified of events generated by a cluster, you would set this parameter to cluster. If this value is not specified, events are returned for all Amazon Redshift objects in your AWS account . You must specify a source type in order to specify source IDs.
   *
   * Valid values: cluster, cluster-parameter-group, cluster-security-group, cluster-snapshot, and scheduled-action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-sourcetype
   */
  readonly sourceType?: string;

  /**
   * The name of the event subscription to be created.
   *
   * Constraints:
   *
   * - Cannot be null, empty, or blank.
   * - Must contain from 1 to 255 alphanumeric characters or hyphens.
   * - First character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-subscriptionname
   */
  readonly subscriptionName: string;

  /**
   * A list of tag instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-eventsubscription.html#cfn-redshift-eventsubscription-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnEventSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventSubscriptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("eventCategories", cdk.listValidator(cdk.validateString))(properties.eventCategories));
  errors.collect(cdk.propertyValidator("severity", cdk.validateString)(properties.severity));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("sourceIds", cdk.listValidator(cdk.validateString))(properties.sourceIds));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  errors.collect(cdk.propertyValidator("subscriptionName", cdk.requiredValidator)(properties.subscriptionName));
  errors.collect(cdk.propertyValidator("subscriptionName", cdk.validateString)(properties.subscriptionName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEventSubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnEventSubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSubscriptionPropsValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "EventCategories": cdk.listMapper(cdk.stringToCloudFormation)(properties.eventCategories),
    "Severity": cdk.stringToCloudFormation(properties.severity),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn),
    "SourceIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceIds),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType),
    "SubscriptionName": cdk.stringToCloudFormation(properties.subscriptionName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEventSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSubscriptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSubscriptionProps>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("eventCategories", "EventCategories", (properties.EventCategories != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EventCategories) : undefined));
  ret.addPropertyResult("severity", "Severity", (properties.Severity != null ? cfn_parse.FromCloudFormation.getString(properties.Severity) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addPropertyResult("sourceIds", "SourceIds", (properties.SourceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceIds) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addPropertyResult("subscriptionName", "SubscriptionName", (properties.SubscriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a scheduled action.
 *
 * A scheduled action contains a schedule and an Amazon Redshift API action. For example, you can create a schedule of when to run the `ResizeCluster` API operation.
 *
 * @cloudformationResource AWS::Redshift::ScheduledAction
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html
 */
export class CfnScheduledAction extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Redshift::ScheduledAction";

  /**
   * Build a CfnScheduledAction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledAction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScheduledActionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScheduledAction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * List of times when the scheduled action will run.
   *
   * @cloudformationAttribute NextInvocations
   */
  public readonly attrNextInvocations: Array<string>;

  /**
   * The state of the scheduled action. For example, `DISABLED` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * If true, the schedule is enabled.
   */
  public enable?: boolean | cdk.IResolvable;

  /**
   * The end time in UTC when the schedule is no longer active.
   */
  public endTime?: string;

  /**
   * The IAM role to assume to run the scheduled action.
   */
  public iamRole?: string;

  /**
   * The schedule for a one-time (at format) or recurring (cron format) scheduled action.
   */
  public schedule?: string;

  /**
   * The description of the scheduled action.
   */
  public scheduledActionDescription?: string;

  /**
   * The name of the scheduled action.
   */
  public scheduledActionName: string;

  /**
   * The start time in UTC when the schedule is active.
   */
  public startTime?: string;

  /**
   * A JSON format string of the Amazon Redshift API operation with input parameters.
   */
  public targetAction?: cdk.IResolvable | CfnScheduledAction.ScheduledActionTypeProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduledActionProps) {
    super(scope, id, {
      "type": CfnScheduledAction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "scheduledActionName", this);

    this.attrNextInvocations = cdk.Token.asList(this.getAtt("NextInvocations", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.enable = props.enable;
    this.endTime = props.endTime;
    this.iamRole = props.iamRole;
    this.schedule = props.schedule;
    this.scheduledActionDescription = props.scheduledActionDescription;
    this.scheduledActionName = props.scheduledActionName;
    this.startTime = props.startTime;
    this.targetAction = props.targetAction;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enable": this.enable,
      "endTime": this.endTime,
      "iamRole": this.iamRole,
      "schedule": this.schedule,
      "scheduledActionDescription": this.scheduledActionDescription,
      "scheduledActionName": this.scheduledActionName,
      "startTime": this.startTime,
      "targetAction": this.targetAction
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduledAction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScheduledActionPropsToCloudFormation(props);
  }
}

export namespace CfnScheduledAction {
  /**
   * The action type that specifies an Amazon Redshift API operation that is supported by the Amazon Redshift scheduler.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-scheduledactiontype.html
   */
  export interface ScheduledActionTypeProperty {
    /**
     * An action that runs a `PauseCluster` API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-scheduledactiontype.html#cfn-redshift-scheduledaction-scheduledactiontype-pausecluster
     */
    readonly pauseCluster?: cdk.IResolvable | CfnScheduledAction.PauseClusterMessageProperty;

    /**
     * An action that runs a `ResizeCluster` API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-scheduledactiontype.html#cfn-redshift-scheduledaction-scheduledactiontype-resizecluster
     */
    readonly resizeCluster?: cdk.IResolvable | CfnScheduledAction.ResizeClusterMessageProperty;

    /**
     * An action that runs a `ResumeCluster` API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-scheduledactiontype.html#cfn-redshift-scheduledaction-scheduledactiontype-resumecluster
     */
    readonly resumeCluster?: cdk.IResolvable | CfnScheduledAction.ResumeClusterMessageProperty;
  }

  /**
   * Describes a pause cluster operation.
   *
   * For example, a scheduled action to run the `PauseCluster` API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-pauseclustermessage.html
   */
  export interface PauseClusterMessageProperty {
    /**
     * The identifier of the cluster to be paused.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-pauseclustermessage.html#cfn-redshift-scheduledaction-pauseclustermessage-clusteridentifier
     */
    readonly clusterIdentifier: string;
  }

  /**
   * Describes a resume cluster operation.
   *
   * For example, a scheduled action to run the `ResumeCluster` API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resumeclustermessage.html
   */
  export interface ResumeClusterMessageProperty {
    /**
     * The identifier of the cluster to be resumed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resumeclustermessage.html#cfn-redshift-scheduledaction-resumeclustermessage-clusteridentifier
     */
    readonly clusterIdentifier: string;
  }

  /**
   * Describes a resize cluster operation.
   *
   * For example, a scheduled action to run the `ResizeCluster` API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html
   */
  export interface ResizeClusterMessageProperty {
    /**
     * A boolean value indicating whether the resize operation is using the classic resize process.
     *
     * If you don't provide this parameter or set the value to `false` , the resize type is elastic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html#cfn-redshift-scheduledaction-resizeclustermessage-classic
     */
    readonly classic?: boolean | cdk.IResolvable;

    /**
     * The unique identifier for the cluster to resize.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html#cfn-redshift-scheduledaction-resizeclustermessage-clusteridentifier
     */
    readonly clusterIdentifier: string;

    /**
     * The new cluster type for the specified cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html#cfn-redshift-scheduledaction-resizeclustermessage-clustertype
     */
    readonly clusterType?: string;

    /**
     * The new node type for the nodes you are adding.
     *
     * If not specified, the cluster's current node type is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html#cfn-redshift-scheduledaction-resizeclustermessage-nodetype
     */
    readonly nodeType?: string;

    /**
     * The new number of nodes for the cluster.
     *
     * If not specified, the cluster's current number of nodes is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-scheduledaction-resizeclustermessage.html#cfn-redshift-scheduledaction-resizeclustermessage-numberofnodes
     */
    readonly numberOfNodes?: number;
  }
}

/**
 * Properties for defining a `CfnScheduledAction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html
 */
export interface CfnScheduledActionProps {
  /**
   * If true, the schedule is enabled.
   *
   * If false, the scheduled action does not trigger. For more information about `state` of the scheduled action, see `ScheduledAction` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-enable
   */
  readonly enable?: boolean | cdk.IResolvable;

  /**
   * The end time in UTC when the schedule is no longer active.
   *
   * After this time, the scheduled action does not trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-endtime
   */
  readonly endTime?: string;

  /**
   * The IAM role to assume to run the scheduled action.
   *
   * This IAM role must have permission to run the Amazon Redshift API operation in the scheduled action. This IAM role must allow the Amazon Redshift scheduler (Principal scheduler.redshift.amazonaws.com) to assume permissions on your behalf. For more information about the IAM role to use with the Amazon Redshift scheduler, see [Using Identity-Based Policies for Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/redshift-iam-access-control-identity-based.html) in the *Amazon Redshift Cluster Management Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-iamrole
   */
  readonly iamRole?: string;

  /**
   * The schedule for a one-time (at format) or recurring (cron format) scheduled action.
   *
   * Schedule invocations must be separated by at least one hour.
   *
   * Format of at expressions is " `at(yyyy-mm-ddThh:mm:ss)` ". For example, " `at(2016-03-04T17:27:00)` ".
   *
   * Format of cron expressions is " `cron(Minutes Hours Day-of-month Month Day-of-week Year)` ". For example, " `cron(0 10 ? * MON *)` ". For more information, see [Cron Expressions](https://docs.aws.amazon.com//AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions) in the *Amazon CloudWatch Events User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-schedule
   */
  readonly schedule?: string;

  /**
   * The description of the scheduled action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-scheduledactiondescription
   */
  readonly scheduledActionDescription?: string;

  /**
   * The name of the scheduled action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-scheduledactionname
   */
  readonly scheduledActionName: string;

  /**
   * The start time in UTC when the schedule is active.
   *
   * Before this time, the scheduled action does not trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-starttime
   */
  readonly startTime?: string;

  /**
   * A JSON format string of the Amazon Redshift API operation with input parameters.
   *
   * " `{\"ResizeCluster\":{\"NodeType\":\"ds2.8xlarge\",\"ClusterIdentifier\":\"my-test-cluster\",\"NumberOfNodes\":3}}` ".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-scheduledaction.html#cfn-redshift-scheduledaction-targetaction
   */
  readonly targetAction?: cdk.IResolvable | CfnScheduledAction.ScheduledActionTypeProperty;
}

/**
 * Determine whether the given properties match those of a `PauseClusterMessageProperty`
 *
 * @param properties - the TypeScript properties of a `PauseClusterMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionPauseClusterMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  return errors.wrap("supplied properties not correct for \"PauseClusterMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionPauseClusterMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionPauseClusterMessagePropertyValidator(properties).assertSuccess();
  return {
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionPauseClusterMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledAction.PauseClusterMessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledAction.PauseClusterMessageProperty>();
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResumeClusterMessageProperty`
 *
 * @param properties - the TypeScript properties of a `ResumeClusterMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionResumeClusterMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  return errors.wrap("supplied properties not correct for \"ResumeClusterMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionResumeClusterMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionResumeClusterMessagePropertyValidator(properties).assertSuccess();
  return {
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionResumeClusterMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledAction.ResumeClusterMessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledAction.ResumeClusterMessageProperty>();
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResizeClusterMessageProperty`
 *
 * @param properties - the TypeScript properties of a `ResizeClusterMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionResizeClusterMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classic", cdk.validateBoolean)(properties.classic));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterType", cdk.validateString)(properties.clusterType));
  errors.collect(cdk.propertyValidator("nodeType", cdk.validateString)(properties.nodeType));
  errors.collect(cdk.propertyValidator("numberOfNodes", cdk.validateNumber)(properties.numberOfNodes));
  return errors.wrap("supplied properties not correct for \"ResizeClusterMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionResizeClusterMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionResizeClusterMessagePropertyValidator(properties).assertSuccess();
  return {
    "Classic": cdk.booleanToCloudFormation(properties.classic),
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "ClusterType": cdk.stringToCloudFormation(properties.clusterType),
    "NodeType": cdk.stringToCloudFormation(properties.nodeType),
    "NumberOfNodes": cdk.numberToCloudFormation(properties.numberOfNodes)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionResizeClusterMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledAction.ResizeClusterMessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledAction.ResizeClusterMessageProperty>();
  ret.addPropertyResult("classic", "Classic", (properties.Classic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Classic) : undefined));
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("clusterType", "ClusterType", (properties.ClusterType != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterType) : undefined));
  ret.addPropertyResult("nodeType", "NodeType", (properties.NodeType != null ? cfn_parse.FromCloudFormation.getString(properties.NodeType) : undefined));
  ret.addPropertyResult("numberOfNodes", "NumberOfNodes", (properties.NumberOfNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfNodes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduledActionTypeProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledActionTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionScheduledActionTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pauseCluster", CfnScheduledActionPauseClusterMessagePropertyValidator)(properties.pauseCluster));
  errors.collect(cdk.propertyValidator("resizeCluster", CfnScheduledActionResizeClusterMessagePropertyValidator)(properties.resizeCluster));
  errors.collect(cdk.propertyValidator("resumeCluster", CfnScheduledActionResumeClusterMessagePropertyValidator)(properties.resumeCluster));
  return errors.wrap("supplied properties not correct for \"ScheduledActionTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionScheduledActionTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionScheduledActionTypePropertyValidator(properties).assertSuccess();
  return {
    "PauseCluster": convertCfnScheduledActionPauseClusterMessagePropertyToCloudFormation(properties.pauseCluster),
    "ResizeCluster": convertCfnScheduledActionResizeClusterMessagePropertyToCloudFormation(properties.resizeCluster),
    "ResumeCluster": convertCfnScheduledActionResumeClusterMessagePropertyToCloudFormation(properties.resumeCluster)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionScheduledActionTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledAction.ScheduledActionTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledAction.ScheduledActionTypeProperty>();
  ret.addPropertyResult("pauseCluster", "PauseCluster", (properties.PauseCluster != null ? CfnScheduledActionPauseClusterMessagePropertyFromCloudFormation(properties.PauseCluster) : undefined));
  ret.addPropertyResult("resizeCluster", "ResizeCluster", (properties.ResizeCluster != null ? CfnScheduledActionResizeClusterMessagePropertyFromCloudFormation(properties.ResizeCluster) : undefined));
  ret.addPropertyResult("resumeCluster", "ResumeCluster", (properties.ResumeCluster != null ? CfnScheduledActionResumeClusterMessagePropertyFromCloudFormation(properties.ResumeCluster) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScheduledActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduledActionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledActionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  errors.collect(cdk.propertyValidator("endTime", cdk.validateString)(properties.endTime));
  errors.collect(cdk.propertyValidator("iamRole", cdk.validateString)(properties.iamRole));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  errors.collect(cdk.propertyValidator("scheduledActionDescription", cdk.validateString)(properties.scheduledActionDescription));
  errors.collect(cdk.propertyValidator("scheduledActionName", cdk.requiredValidator)(properties.scheduledActionName));
  errors.collect(cdk.propertyValidator("scheduledActionName", cdk.validateString)(properties.scheduledActionName));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  errors.collect(cdk.propertyValidator("targetAction", CfnScheduledActionScheduledActionTypePropertyValidator)(properties.targetAction));
  return errors.wrap("supplied properties not correct for \"CfnScheduledActionProps\"");
}

// @ts-ignore TS6133
function convertCfnScheduledActionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledActionPropsValidator(properties).assertSuccess();
  return {
    "Enable": cdk.booleanToCloudFormation(properties.enable),
    "EndTime": cdk.stringToCloudFormation(properties.endTime),
    "IamRole": cdk.stringToCloudFormation(properties.iamRole),
    "Schedule": cdk.stringToCloudFormation(properties.schedule),
    "ScheduledActionDescription": cdk.stringToCloudFormation(properties.scheduledActionDescription),
    "ScheduledActionName": cdk.stringToCloudFormation(properties.scheduledActionName),
    "StartTime": cdk.stringToCloudFormation(properties.startTime),
    "TargetAction": convertCfnScheduledActionScheduledActionTypePropertyToCloudFormation(properties.targetAction)
  };
}

// @ts-ignore TS6133
function CfnScheduledActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledActionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledActionProps>();
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? cfn_parse.FromCloudFormation.getString(properties.EndTime) : undefined));
  ret.addPropertyResult("iamRole", "IamRole", (properties.IamRole != null ? cfn_parse.FromCloudFormation.getString(properties.IamRole) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addPropertyResult("scheduledActionDescription", "ScheduledActionDescription", (properties.ScheduledActionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledActionDescription) : undefined));
  ret.addPropertyResult("scheduledActionName", "ScheduledActionName", (properties.ScheduledActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledActionName) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addPropertyResult("targetAction", "TargetAction", (properties.TargetAction != null ? CfnScheduledActionScheduledActionTypePropertyFromCloudFormation(properties.TargetAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}