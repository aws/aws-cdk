/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Neptune::DBCluster` resource creates an Amazon Neptune DB cluster. Neptune is a fully managed graph database.
 *
 * > Currently, you can create this resource only in AWS Regions in which Amazon Neptune is supported.
 *
 * If no `DeletionPolicy` is set for `AWS::Neptune::DBCluster` resources, the default deletion behavior is that the entire volume will be deleted without a snapshot. To retain a backup of the volume, the `DeletionPolicy` should be set to `Snapshot` . For more information about how AWS CloudFormation deletes resources, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * You can use `AWS::Neptune::DBCluster.DeletionProtection` to help guard against unintended deletion of your DB cluster.
 *
 * @cloudformationResource AWS::Neptune::DBCluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html
 */
export class CfnDBCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Neptune::DBCluster";

  /**
   * Build a CfnDBCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The resource id for the DB cluster. For example: `cluster-ABCD1234EFGH5678IJKL90MNOP` . The cluster ID uniquely identifies the cluster and is used in things like IAM authentication policies.
   *
   * @cloudformationAttribute ClusterResourceId
   */
  public readonly attrClusterResourceId: string;

  /**
   * The connection endpoint for the DB cluster. For example: `mystack-mydbcluster-1apw1j4phylrk.cg034hpkmmjt.us-east-2.rds.amazonaws.com`
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * The port number on which the DB instances in the DB cluster accept connections.
   *
   * @cloudformationAttribute Port
   */
  public readonly attrPort: string;

  /**
   * The reader endpoint for the DB cluster. For example: `mystack-mydbcluster-ro-1apw1j4phylrk.cg034hpkmmjt.us-east-2.rds.amazonaws.com`
   *
   * @cloudformationAttribute ReadEndpoint
   */
  public readonly attrReadEndpoint: string;

  /**
   * Provides a list of the Amazon Identity and Access Management (IAM) roles that are associated with the DB cluster.
   */
  public associatedRoles?: Array<CfnDBCluster.DBClusterRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Provides the list of EC2 Availability Zones that instances in the DB cluster can be created in.
   */
  public availabilityZones?: Array<string>;

  /**
   * Specifies the number of days for which automatic DB snapshots are retained.
   */
  public backupRetentionPeriod?: number;

  /**
   * *If set to `true` , tags are copied to any snapshot of the DB cluster that is created.*.
   */
  public copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * Contains a user-supplied DB cluster identifier.
   */
  public dbClusterIdentifier?: string;

  /**
   * Provides the name of the DB cluster parameter group.
   */
  public dbClusterParameterGroupName?: string;

  /**
   * The name of the DB parameter group to apply to all instances of the DB cluster.
   */
  public dbInstanceParameterGroupName?: string;

  /**
   * The port number on which the DB instances in the DB cluster accept connections.
   */
  public dbPort?: number;

  /**
   * Specifies information on the subnet group associated with the DB cluster, including the name, description, and subnets in the subnet group.
   */
  public dbSubnetGroupName?: string;

  /**
   * Indicates whether or not the DB cluster has deletion protection enabled.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Specifies a list of log types that are enabled for export to CloudWatch Logs.
   */
  public enableCloudwatchLogsExports?: Array<string>;

  /**
   * Indicates the database engine version.
   */
  public engineVersion?: string;

  /**
   * True if mapping of Amazon Identity and Access Management (IAM) accounts to database accounts is enabled, and otherwise false.
   */
  public iamAuthEnabled?: boolean | cdk.IResolvable;

  /**
   * If `StorageEncrypted` is true, the Amazon KMS key identifier for the encrypted DB cluster.
   */
  public kmsKeyId?: string;

  /**
   * Specifies the daily time range during which automated backups are created if automated backups are enabled, as determined by the `BackupRetentionPeriod` .
   */
  public preferredBackupWindow?: string;

  /**
   * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   */
  public restoreToTime?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   */
  public restoreType?: string;

  /**
   * Contains the scaling configuration of an Neptune Serverless DB cluster.
   */
  public serverlessScalingConfiguration?: cdk.IResolvable | CfnDBCluster.ServerlessScalingConfigurationProperty;

  /**
   * Specifies the identifier for a DB cluster snapshot. Must match the identifier of an existing snapshot.
   */
  public snapshotIdentifier?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   */
  public sourceDbClusterIdentifier?: string;

  /**
   * Indicates whether the DB cluster is encrypted.
   */
  public storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to this cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   */
  public useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * Provides a list of VPC security groups that the DB cluster belongs to.
   */
  public vpcSecurityGroupIds?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBClusterProps = {}) {
    super(scope, id, {
      "type": CfnDBCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrClusterResourceId = cdk.Token.asString(this.getAtt("ClusterResourceId", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrPort = cdk.Token.asString(this.getAtt("Port", cdk.ResolutionTypeHint.STRING));
    this.attrReadEndpoint = cdk.Token.asString(this.getAtt("ReadEndpoint", cdk.ResolutionTypeHint.STRING));
    this.associatedRoles = props.associatedRoles;
    this.availabilityZones = props.availabilityZones;
    this.backupRetentionPeriod = props.backupRetentionPeriod;
    this.copyTagsToSnapshot = props.copyTagsToSnapshot;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbClusterParameterGroupName = props.dbClusterParameterGroupName;
    this.dbInstanceParameterGroupName = props.dbInstanceParameterGroupName;
    this.dbPort = props.dbPort;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.deletionProtection = props.deletionProtection;
    this.enableCloudwatchLogsExports = props.enableCloudwatchLogsExports;
    this.engineVersion = props.engineVersion;
    this.iamAuthEnabled = props.iamAuthEnabled;
    this.kmsKeyId = props.kmsKeyId;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.restoreToTime = props.restoreToTime;
    this.restoreType = props.restoreType;
    this.serverlessScalingConfiguration = props.serverlessScalingConfiguration;
    this.snapshotIdentifier = props.snapshotIdentifier;
    this.sourceDbClusterIdentifier = props.sourceDbClusterIdentifier;
    this.storageEncrypted = props.storageEncrypted;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Neptune::DBCluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.useLatestRestorableTime = props.useLatestRestorableTime;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Neptune::DBCluster' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associatedRoles": this.associatedRoles,
      "availabilityZones": this.availabilityZones,
      "backupRetentionPeriod": this.backupRetentionPeriod,
      "copyTagsToSnapshot": this.copyTagsToSnapshot,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbClusterParameterGroupName": this.dbClusterParameterGroupName,
      "dbInstanceParameterGroupName": this.dbInstanceParameterGroupName,
      "dbPort": this.dbPort,
      "dbSubnetGroupName": this.dbSubnetGroupName,
      "deletionProtection": this.deletionProtection,
      "enableCloudwatchLogsExports": this.enableCloudwatchLogsExports,
      "engineVersion": this.engineVersion,
      "iamAuthEnabled": this.iamAuthEnabled,
      "kmsKeyId": this.kmsKeyId,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "restoreToTime": this.restoreToTime,
      "restoreType": this.restoreType,
      "serverlessScalingConfiguration": this.serverlessScalingConfiguration,
      "snapshotIdentifier": this.snapshotIdentifier,
      "sourceDbClusterIdentifier": this.sourceDbClusterIdentifier,
      "storageEncrypted": this.storageEncrypted,
      "tags": this.tags.renderTags(),
      "useLatestRestorableTime": this.useLatestRestorableTime,
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBClusterPropsToCloudFormation(props);
  }
}

export namespace CfnDBCluster {
  /**
   * Describes an Amazon Identity and Access Management (IAM) role that is associated with a DB cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-dbclusterrole.html
   */
  export interface DBClusterRoleProperty {
    /**
     * The name of the feature associated with the Amazon Identity and Access Management (IAM) role.
     *
     * For the list of supported feature names, see [DescribeDBEngineVersions](https://docs.aws.amazon.com/neptune/latest/userguide/api-other-apis.html#DescribeDBEngineVersions) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-dbclusterrole.html#cfn-neptune-dbcluster-dbclusterrole-featurename
     */
    readonly featureName?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that is associated with the DB cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-dbclusterrole.html#cfn-neptune-dbcluster-dbclusterrole-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Contains the scaling configuration of a Neptune Serverless DB cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-serverlessscalingconfiguration.html
   */
  export interface ServerlessScalingConfigurationProperty {
    /**
     * The maximum number of Neptune capacity units (NCUs) for a DB instance in a Neptune Serverless cluster.
     *
     * You can specify NCU values in half-step increments, such as 40, 40.5, 41, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-serverlessscalingconfiguration.html#cfn-neptune-dbcluster-serverlessscalingconfiguration-maxcapacity
     */
    readonly maxCapacity: number;

    /**
     * The minimum number of Neptune capacity units (NCUs) for a DB instance in a Neptune Serverless cluster.
     *
     * You can specify NCU values in half-step increments, such as 8, 8.5, 9, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptune-dbcluster-serverlessscalingconfiguration.html#cfn-neptune-dbcluster-serverlessscalingconfiguration-mincapacity
     */
    readonly minCapacity: number;
  }
}

/**
 * Properties for defining a `CfnDBCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html
 */
export interface CfnDBClusterProps {
  /**
   * Provides a list of the Amazon Identity and Access Management (IAM) roles that are associated with the DB cluster.
   *
   * IAM roles that are associated with a DB cluster grant permission for the DB cluster to access other Amazon services on your behalf.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-associatedroles
   */
  readonly associatedRoles?: Array<CfnDBCluster.DBClusterRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Provides the list of EC2 Availability Zones that instances in the DB cluster can be created in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * Specifies the number of days for which automatic DB snapshots are retained.
   *
   * An update may require some interruption. See [ModifyDBInstance](https://docs.aws.amazon.com/neptune/latest/userguide/api-instances.html#ModifyDBInstance) in the Amazon Neptune User Guide for more information.
   *
   * @default - 1
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-backupretentionperiod
   */
  readonly backupRetentionPeriod?: number;

  /**
   * *If set to `true` , tags are copied to any snapshot of the DB cluster that is created.*.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-copytagstosnapshot
   */
  readonly copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * Contains a user-supplied DB cluster identifier.
   *
   * This identifier is the unique key that identifies a DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-dbclusteridentifier
   */
  readonly dbClusterIdentifier?: string;

  /**
   * Provides the name of the DB cluster parameter group.
   *
   * An update may require some interruption. See [ModifyDBInstance](https://docs.aws.amazon.com/neptune/latest/userguide/api-instances.html#ModifyDBInstance) in the Amazon Neptune User Guide for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-dbclusterparametergroupname
   */
  readonly dbClusterParameterGroupName?: string;

  /**
   * The name of the DB parameter group to apply to all instances of the DB cluster.
   *
   * Used only in case of a major engine version upgrade request
   *
   * Note that when you apply a parameter group using `DBInstanceParameterGroupName` , parameter changes are applied immediately, not during the next maintenance window.
   *
   * **Constraints** - The DB parameter group must be in the same DB parameter group family as the target DB cluster version.
   * - The `DBInstanceParameterGroupName` parameter is only valid for major engine version upgrades.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-dbinstanceparametergroupname
   */
  readonly dbInstanceParameterGroupName?: string;

  /**
   * The port number on which the DB instances in the DB cluster accept connections.
   *
   * If not specified, the default port used is `8182` .
   *
   * > The `Port` property will soon be deprecated. Please update existing templates to use the new `DBPort` property that has the same functionality.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-dbport
   */
  readonly dbPort?: number;

  /**
   * Specifies information on the subnet group associated with the DB cluster, including the name, description, and subnets in the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * Indicates whether or not the DB cluster has deletion protection enabled.
   *
   * The database can't be deleted when deletion protection is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Specifies a list of log types that are enabled for export to CloudWatch Logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-enablecloudwatchlogsexports
   */
  readonly enableCloudwatchLogsExports?: Array<string>;

  /**
   * Indicates the database engine version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-engineversion
   */
  readonly engineVersion?: string;

  /**
   * True if mapping of Amazon Identity and Access Management (IAM) accounts to database accounts is enabled, and otherwise false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-iamauthenabled
   */
  readonly iamAuthEnabled?: boolean | cdk.IResolvable;

  /**
   * If `StorageEncrypted` is true, the Amazon KMS key identifier for the encrypted DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies the daily time range during which automated backups are created if automated backups are enabled, as determined by the `BackupRetentionPeriod` .
   *
   * An update may require some interruption.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   *
   * If a DB snapshot is specified, the target DB cluster is created from the source DB snapshot with a default configuration and default security group.
   *
   * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB cluster restore point with the same configuration as the original source DB cluster, except that the new DB cluster is created with the default security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-restoretotime
   */
  readonly restoreToTime?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   *
   * If a DB snapshot is specified, the target DB cluster is created from the source DB snapshot with a default configuration and default security group.
   *
   * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB cluster restore point with the same configuration as the original source DB cluster, except that the new DB cluster is created with the default security group.
   *
   * @default - "full-copy"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-restoretype
   */
  readonly restoreType?: string;

  /**
   * Contains the scaling configuration of an Neptune Serverless DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-serverlessscalingconfiguration
   */
  readonly serverlessScalingConfiguration?: cdk.IResolvable | CfnDBCluster.ServerlessScalingConfigurationProperty;

  /**
   * Specifies the identifier for a DB cluster snapshot. Must match the identifier of an existing snapshot.
   *
   * After you restore a DB cluster using a `SnapshotIdentifier` , you must specify the same `SnapshotIdentifier` for any future updates to the DB cluster. When you specify this property for an update, the DB cluster is not restored from the snapshot again, and the data in the database is not changed.
   *
   * However, if you don't specify the `SnapshotIdentifier` , an empty DB cluster is created, and the original DB cluster is deleted. If you specify a property that is different from the previous snapshot restore property, the DB cluster is restored from the snapshot specified by the `SnapshotIdentifier` , and the original DB cluster is deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-snapshotidentifier
   */
  readonly snapshotIdentifier?: string;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   *
   * If a DB snapshot is specified, the target DB cluster is created from the source DB snapshot with a default configuration and default security group.
   *
   * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB cluster restore point with the same configuration as the original source DB cluster, except that the new DB cluster is created with the default security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-sourcedbclusteridentifier
   */
  readonly sourceDbClusterIdentifier?: string;

  /**
   * Indicates whether the DB cluster is encrypted.
   *
   * If you specify the `DBClusterIdentifier` , `DBSnapshotIdentifier` , or `SourceDBInstanceIdentifier` property, don't specify this property. The value is inherited from the cluster, snapshot, or source DB instance. If you specify the `KmsKeyId` property, you must enable encryption.
   *
   * If you specify the `KmsKeyId` , you must enable encryption by setting `StorageEncrypted` to true.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-storageencrypted
   */
  readonly storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * The tags assigned to this cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
   *
   * If a DB snapshot is specified, the target DB cluster is created from the source DB snapshot with a default configuration and default security group.
   *
   * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB cluster restore point with the same configuration as the original source DB cluster, except that the new DB cluster is created with the default security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-uselatestrestorabletime
   */
  readonly useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * Provides a list of VPC security groups that the DB cluster belongs to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbcluster.html#cfn-neptune-dbcluster-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `DBClusterRoleProperty`
 *
 * @param properties - the TypeScript properties of a `DBClusterRoleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterDBClusterRolePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("featureName", cdk.validateString)(properties.featureName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"DBClusterRoleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterDBClusterRolePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterDBClusterRolePropertyValidator(properties).assertSuccess();
  return {
    "FeatureName": cdk.stringToCloudFormation(properties.featureName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDBClusterDBClusterRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBCluster.DBClusterRoleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.DBClusterRoleProperty>();
  ret.addPropertyResult("featureName", "FeatureName", (properties.FeatureName != null ? cfn_parse.FromCloudFormation.getString(properties.FeatureName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerlessScalingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerlessScalingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterServerlessScalingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.requiredValidator)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.requiredValidator)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  return errors.wrap("supplied properties not correct for \"ServerlessScalingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterServerlessScalingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterServerlessScalingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity)
  };
}

// @ts-ignore TS6133
function CfnDBClusterServerlessScalingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBCluster.ServerlessScalingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.ServerlessScalingConfigurationProperty>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDBClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associatedRoles", cdk.listValidator(CfnDBClusterDBClusterRolePropertyValidator))(properties.associatedRoles));
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("backupRetentionPeriod", cdk.validateNumber)(properties.backupRetentionPeriod));
  errors.collect(cdk.propertyValidator("copyTagsToSnapshot", cdk.validateBoolean)(properties.copyTagsToSnapshot));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterParameterGroupName", cdk.validateString)(properties.dbClusterParameterGroupName));
  errors.collect(cdk.propertyValidator("dbInstanceParameterGroupName", cdk.validateString)(properties.dbInstanceParameterGroupName));
  errors.collect(cdk.propertyValidator("dbPort", cdk.validateNumber)(properties.dbPort));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("enableCloudwatchLogsExports", cdk.listValidator(cdk.validateString))(properties.enableCloudwatchLogsExports));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("iamAuthEnabled", cdk.validateBoolean)(properties.iamAuthEnabled));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("restoreToTime", cdk.validateString)(properties.restoreToTime));
  errors.collect(cdk.propertyValidator("restoreType", cdk.validateString)(properties.restoreType));
  errors.collect(cdk.propertyValidator("serverlessScalingConfiguration", CfnDBClusterServerlessScalingConfigurationPropertyValidator)(properties.serverlessScalingConfiguration));
  errors.collect(cdk.propertyValidator("snapshotIdentifier", cdk.validateString)(properties.snapshotIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbClusterIdentifier", cdk.validateString)(properties.sourceDbClusterIdentifier));
  errors.collect(cdk.propertyValidator("storageEncrypted", cdk.validateBoolean)(properties.storageEncrypted));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("useLatestRestorableTime", cdk.validateBoolean)(properties.useLatestRestorableTime));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  return errors.wrap("supplied properties not correct for \"CfnDBClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterPropsValidator(properties).assertSuccess();
  return {
    "AssociatedRoles": cdk.listMapper(convertCfnDBClusterDBClusterRolePropertyToCloudFormation)(properties.associatedRoles),
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "BackupRetentionPeriod": cdk.numberToCloudFormation(properties.backupRetentionPeriod),
    "CopyTagsToSnapshot": cdk.booleanToCloudFormation(properties.copyTagsToSnapshot),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBClusterParameterGroupName": cdk.stringToCloudFormation(properties.dbClusterParameterGroupName),
    "DBInstanceParameterGroupName": cdk.stringToCloudFormation(properties.dbInstanceParameterGroupName),
    "DBPort": cdk.numberToCloudFormation(properties.dbPort),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "EnableCloudwatchLogsExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.enableCloudwatchLogsExports),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "IamAuthEnabled": cdk.booleanToCloudFormation(properties.iamAuthEnabled),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "RestoreToTime": cdk.stringToCloudFormation(properties.restoreToTime),
    "RestoreType": cdk.stringToCloudFormation(properties.restoreType),
    "ServerlessScalingConfiguration": convertCfnDBClusterServerlessScalingConfigurationPropertyToCloudFormation(properties.serverlessScalingConfiguration),
    "SnapshotIdentifier": cdk.stringToCloudFormation(properties.snapshotIdentifier),
    "SourceDBClusterIdentifier": cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
    "StorageEncrypted": cdk.booleanToCloudFormation(properties.storageEncrypted),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UseLatestRestorableTime": cdk.booleanToCloudFormation(properties.useLatestRestorableTime),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds)
  };
}

// @ts-ignore TS6133
function CfnDBClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBClusterProps>();
  ret.addPropertyResult("associatedRoles", "AssociatedRoles", (properties.AssociatedRoles != null ? cfn_parse.FromCloudFormation.getArray(CfnDBClusterDBClusterRolePropertyFromCloudFormation)(properties.AssociatedRoles) : undefined));
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("backupRetentionPeriod", "BackupRetentionPeriod", (properties.BackupRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionPeriod) : undefined));
  ret.addPropertyResult("copyTagsToSnapshot", "CopyTagsToSnapshot", (properties.CopyTagsToSnapshot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshot) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbClusterParameterGroupName", "DBClusterParameterGroupName", (properties.DBClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterParameterGroupName) : undefined));
  ret.addPropertyResult("dbInstanceParameterGroupName", "DBInstanceParameterGroupName", (properties.DBInstanceParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceParameterGroupName) : undefined));
  ret.addPropertyResult("dbPort", "DBPort", (properties.DBPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.DBPort) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("enableCloudwatchLogsExports", "EnableCloudwatchLogsExports", (properties.EnableCloudwatchLogsExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EnableCloudwatchLogsExports) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("iamAuthEnabled", "IamAuthEnabled", (properties.IamAuthEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IamAuthEnabled) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("restoreToTime", "RestoreToTime", (properties.RestoreToTime != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreToTime) : undefined));
  ret.addPropertyResult("restoreType", "RestoreType", (properties.RestoreType != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreType) : undefined));
  ret.addPropertyResult("serverlessScalingConfiguration", "ServerlessScalingConfiguration", (properties.ServerlessScalingConfiguration != null ? CfnDBClusterServerlessScalingConfigurationPropertyFromCloudFormation(properties.ServerlessScalingConfiguration) : undefined));
  ret.addPropertyResult("snapshotIdentifier", "SnapshotIdentifier", (properties.SnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotIdentifier) : undefined));
  ret.addPropertyResult("sourceDbClusterIdentifier", "SourceDBClusterIdentifier", (properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined));
  ret.addPropertyResult("storageEncrypted", "StorageEncrypted", (properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("useLatestRestorableTime", "UseLatestRestorableTime", (properties.UseLatestRestorableTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLatestRestorableTime) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Neptune::DBClusterParameterGroup` resource creates a new Amazon Neptune DB cluster parameter group.
 *
 * > Applying a parameter group to a DB cluster might require instances to reboot, resulting in a database outage while the instances reboot. > If you provide a custom `DBClusterParameterGroup` that you associate with the `DBCluster` , it is best to specify an `EngineVersion` property in the `DBCluster` . That `EngineVersion` needs to be compatible with the value of the `Family` property in the `DBClusterParameterGroup` .
 *
 * @cloudformationResource AWS::Neptune::DBClusterParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html
 */
export class CfnDBClusterParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Neptune::DBClusterParameterGroup";

  /**
   * Build a CfnDBClusterParameterGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBClusterParameterGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBClusterParameterGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBClusterParameterGroup(scope, id, propsResult.value);
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
   * Provides the customer-specified description for this DB cluster parameter group.
   */
  public description: string;

  /**
   * Must be `neptune1` for engine versions prior to [1.2.0.0](https://docs.aws.amazon.com/neptune/latest/userguide/engine-releases-1.2.0.0.html) , or `neptune1.2` for engine version `1.2.0.0` and higher.
   */
  public family: string;

  /**
   * Provides the name of the DB cluster parameter group.
   */
  public name?: string;

  /**
   * The parameters to set for this DB cluster parameter group.
   */
  public parameters: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that you want to attach to this parameter group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBClusterParameterGroupProps) {
    super(scope, id, {
      "type": CfnDBClusterParameterGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "family", this);
    cdk.requireProperty(props, "parameters", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.family = props.family;
    this.name = props.name;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Neptune::DBClusterParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "family": this.family,
      "name": this.name,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBClusterParameterGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBClusterParameterGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDBClusterParameterGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html
 */
export interface CfnDBClusterParameterGroupProps {
  /**
   * Provides the customer-specified description for this DB cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html#cfn-neptune-dbclusterparametergroup-description
   */
  readonly description: string;

  /**
   * Must be `neptune1` for engine versions prior to [1.2.0.0](https://docs.aws.amazon.com/neptune/latest/userguide/engine-releases-1.2.0.0.html) , or `neptune1.2` for engine version `1.2.0.0` and higher.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html#cfn-neptune-dbclusterparametergroup-family
   */
  readonly family: string;

  /**
   * Provides the name of the DB cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html#cfn-neptune-dbclusterparametergroup-name
   */
  readonly name?: string;

  /**
   * The parameters to set for this DB cluster parameter group.
   *
   * The parameters are expressed as a JSON object consisting of key-value pairs.
   *
   * If you update the parameters, some interruption may occur depending on which parameters you update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html#cfn-neptune-dbclusterparametergroup-parameters
   */
  readonly parameters: any | cdk.IResolvable;

  /**
   * The tags that you want to attach to this parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbclusterparametergroup.html#cfn-neptune-dbclusterparametergroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDBClusterParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterParameterGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("family", cdk.requiredValidator)(properties.family));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.requiredValidator)(properties.parameters));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBClusterParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Family": cdk.stringToCloudFormation(properties.family),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDBClusterParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBClusterParameterGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBClusterParameterGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Neptune::DBInstance` type creates an Amazon Neptune DB instance.
 *
 * *Updating DB Instances*
 *
 * You can set a deletion policy for your DB instance to control how AWS CloudFormation handles the instance when the stack is deleted. For Neptune DB instances, you can choose to *retain* the instance, to *delete* the instance, or to *create a snapshot* of the instance. The default AWS CloudFormation behavior depends on the `DBClusterIdentifier` property:
 *
 * - For `AWS::Neptune::DBInstance` resources that don't specify the `DBClusterIdentifier` property, AWS CloudFormation saves a snapshot of the DB instance.
 * - For `AWS::Neptune::DBInstance` resources that do specify the `DBClusterIdentifier` property, AWS CloudFormation deletes the DB instance.
 *
 * *Deleting DB Instances*
 *
 * > If a DB instance is deleted or replaced during an update, AWS CloudFormation deletes all automated snapshots. However, it retains manual DB snapshots. During an update that requires replacement, you can apply a stack policy to prevent DB instances from being replaced.
 *
 * When properties labeled *Update requires: Replacement* are updated, AWS CloudFormation first creates a replacement DB instance, changes references from other dependent resources to point to the replacement DB instance, and finally deletes the old DB instance.
 *
 * > We highly recommend that you take a snapshot of the database before updating the stack. If you don't, you lose the data when AWS CloudFormation replaces your DB instance. To preserve your data, perform the following procedure:
 * >
 * > - Deactivate any applications that are using the DB instance so that there's no activity on the DB instance.
 * > - Create a snapshot of the DB instance.
 * > - If you want to restore your instance using a DB snapshot, modify the updated template with your DB instance changes and add the `DBSnapshotIdentifier` property with the ID of the DB snapshot that you want to use.
 * > - Update the stack.
 *
 * @cloudformationResource AWS::Neptune::DBInstance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html
 */
export class CfnDBInstance extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Neptune::DBInstance";

  /**
   * Build a CfnDBInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The connection endpoint for the database. For example: `mystack-mydb-1apw1j4phylrk.cg034hpkmmjt.us-east-2.rds.amazonaws.com` .
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The port number on which the database accepts connections. For example: `8182` .
   *
   * @cloudformationAttribute Port
   */
  public readonly attrPort: string;

  /**
   * Indicates that major version upgrades are allowed.
   */
  public allowMajorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * Indicates that minor version patches are applied automatically.
   */
  public autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the Availability Zone the DB instance is located in.
   */
  public availabilityZone?: string;

  /**
   * If the DB instance is a member of a DB cluster, contains the name of the DB cluster that the DB instance is a member of.
   */
  public dbClusterIdentifier?: string;

  /**
   * Contains the name of the compute and memory capacity class of the DB instance.
   */
  public dbInstanceClass: string;

  /**
   * Contains a user-supplied database identifier.
   */
  public dbInstanceIdentifier?: string;

  /**
   * The name of an existing DB parameter group or a reference to an AWS::Neptune::DBParameterGroup resource created in the template.
   */
  public dbParameterGroupName?: string;

  /**
   * This parameter is not supported.
   */
  public dbSnapshotIdentifier?: string;

  /**
   * A DB subnet group to associate with the DB instance.
   */
  public dbSubnetGroupName?: string;

  /**
   * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key-value pairs) for this DB instance.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBInstanceProps) {
    super(scope, id, {
      "type": CfnDBInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbInstanceClass", this);

    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPort = cdk.Token.asString(this.getAtt("Port", cdk.ResolutionTypeHint.STRING));
    this.allowMajorVersionUpgrade = props.allowMajorVersionUpgrade;
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.availabilityZone = props.availabilityZone;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbInstanceClass = props.dbInstanceClass;
    this.dbInstanceIdentifier = props.dbInstanceIdentifier;
    this.dbParameterGroupName = props.dbParameterGroupName;
    this.dbSnapshotIdentifier = props.dbSnapshotIdentifier;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Neptune::DBInstance", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Neptune::DBInstance' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowMajorVersionUpgrade": this.allowMajorVersionUpgrade,
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "availabilityZone": this.availabilityZone,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbInstanceClass": this.dbInstanceClass,
      "dbInstanceIdentifier": this.dbInstanceIdentifier,
      "dbParameterGroupName": this.dbParameterGroupName,
      "dbSnapshotIdentifier": this.dbSnapshotIdentifier,
      "dbSubnetGroupName": this.dbSubnetGroupName,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBInstancePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDBInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html
 */
export interface CfnDBInstanceProps {
  /**
   * Indicates that major version upgrades are allowed.
   *
   * Changing this parameter doesn't result in an outage and the change is asynchronously applied as soon as possible. This parameter must be set to true when specifying a value for the EngineVersion parameter that is a different major version than the DB instance's current version.
   *
   * When you change this parameter for an existing DB cluster, CloudFormation will replace your existing DB cluster with a new, empty one that uses the engine version you specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-allowmajorversionupgrade
   */
  readonly allowMajorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * Indicates that minor version patches are applied automatically.
   *
   * When updating this property, some interruptions may occur.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the Availability Zone the DB instance is located in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * If the DB instance is a member of a DB cluster, contains the name of the DB cluster that the DB instance is a member of.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbclusteridentifier
   */
  readonly dbClusterIdentifier?: string;

  /**
   * Contains the name of the compute and memory capacity class of the DB instance.
   *
   * If you update this property, some interruptions may occur.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbinstanceclass
   */
  readonly dbInstanceClass: string;

  /**
   * Contains a user-supplied database identifier.
   *
   * This identifier is the unique key that identifies a DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbinstanceidentifier
   */
  readonly dbInstanceIdentifier?: string;

  /**
   * The name of an existing DB parameter group or a reference to an AWS::Neptune::DBParameterGroup resource created in the template.
   *
   * If any of the data members of the referenced parameter group are changed during an update, the DB instance might need to be restarted, which causes some interruption. If the parameter group contains static parameters, whether they were changed or not, an update triggers a reboot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbparametergroupname
   */
  readonly dbParameterGroupName?: string;

  /**
   * This parameter is not supported.
   *
   * `AWS::Neptune::DBInstance` does not support restoring from snapshots.
   *
   * `AWS::Neptune::DBCluster` does support restoring from snapshots.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbsnapshotidentifier
   */
  readonly dbSnapshotIdentifier?: string;

  /**
   * A DB subnet group to associate with the DB instance.
   *
   * If you update this value, the new subnet group must be a subnet group in a new virtual private cloud (VPC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * An arbitrary set of tags (key-value pairs) for this DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbinstance.html#cfn-neptune-dbinstance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDBInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowMajorVersionUpgrade", cdk.validateBoolean)(properties.allowMajorVersionUpgrade));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbInstanceClass", cdk.requiredValidator)(properties.dbInstanceClass));
  errors.collect(cdk.propertyValidator("dbInstanceClass", cdk.validateString)(properties.dbInstanceClass));
  errors.collect(cdk.propertyValidator("dbInstanceIdentifier", cdk.validateString)(properties.dbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("dbParameterGroupName", cdk.validateString)(properties.dbParameterGroupName));
  errors.collect(cdk.propertyValidator("dbSnapshotIdentifier", cdk.validateString)(properties.dbSnapshotIdentifier));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnDBInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstancePropsValidator(properties).assertSuccess();
  return {
    "AllowMajorVersionUpgrade": cdk.booleanToCloudFormation(properties.allowMajorVersionUpgrade),
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBInstanceClass": cdk.stringToCloudFormation(properties.dbInstanceClass),
    "DBInstanceIdentifier": cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
    "DBParameterGroupName": cdk.stringToCloudFormation(properties.dbParameterGroupName),
    "DBSnapshotIdentifier": cdk.stringToCloudFormation(properties.dbSnapshotIdentifier),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDBInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstanceProps>();
  ret.addPropertyResult("allowMajorVersionUpgrade", "AllowMajorVersionUpgrade", (properties.AllowMajorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowMajorVersionUpgrade) : undefined));
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbInstanceClass", "DBInstanceClass", (properties.DBInstanceClass != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceClass) : undefined));
  ret.addPropertyResult("dbInstanceIdentifier", "DBInstanceIdentifier", (properties.DBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier) : undefined));
  ret.addPropertyResult("dbParameterGroupName", "DBParameterGroupName", (properties.DBParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBParameterGroupName) : undefined));
  ret.addPropertyResult("dbSnapshotIdentifier", "DBSnapshotIdentifier", (properties.DBSnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBSnapshotIdentifier) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * `AWS::Neptune::DBParameterGroup` creates a new DB parameter group.
 *
 * This type can be declared in a template and referenced in the `DBParameterGroupName` parameter of `AWS::Neptune::DBInstance` .
 *
 * > Applying a parameter group to a DB instance might require the instance to reboot, resulting in a database outage for the duration of the reboot. > If you provide a custom `DBParameterGroup` that you associate with `DBInstance` , it is best to specify an `EngineVersion` property in `DBCluster` . That `EngineVersion` needs to be compatible with the value of the `Family` property in the `DBParameterGroup` .
 *
 * A DB parameter group is initially created with the default parameters for the database engine used by the DB instance. To provide custom values for any of the parameters, you must modify the group after creating it using *ModifyDBParameterGroup* . Once you've created a DB parameter group, you need to associate it with your DB instance using *ModifyDBInstance* . When you associate a new DB parameter group with a running DB instance, you need to reboot the DB instance without failover for the new DB parameter group and associated settings to take effect.
 *
 * > After you create a DB parameter group, you should wait at least 5 minutes before creating your first DB instance that uses that DB parameter group as the default parameter group. This allows Amazon Neptune to fully complete the create action before the parameter group is used as the default for a new DB instance. This is especially important for parameters that are critical when creating the default database for a DB instance, such as the character set for the default database defined by the `character_set_database` parameter. You can use the *Parameter Groups* option of the Amazon Neptune console or the *DescribeDBParameters* command to verify that your DB parameter group has been created or modified.
 *
 * @cloudformationResource AWS::Neptune::DBParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html
 */
export class CfnDBParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Neptune::DBParameterGroup";

  /**
   * Build a CfnDBParameterGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBParameterGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBParameterGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBParameterGroup(scope, id, propsResult.value);
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
   * Provides the customer-specified description for this DB parameter group.
   */
  public description: string;

  /**
   * Must be `neptune1` for engine versions prior to [1.2.0.0](https://docs.aws.amazon.com/neptune/latest/userguide/engine-releases-1.2.0.0.html) , or `neptune1.2` for engine version `1.2.0.0` and higher.
   */
  public family: string;

  /**
   * Provides the name of the DB parameter group.
   */
  public name?: string;

  /**
   * The parameters to set for this DB parameter group.
   */
  public parameters: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that you want to attach to this parameter group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBParameterGroupProps) {
    super(scope, id, {
      "type": CfnDBParameterGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "family", this);
    cdk.requireProperty(props, "parameters", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.family = props.family;
    this.name = props.name;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Neptune::DBParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "family": this.family,
      "name": this.name,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBParameterGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBParameterGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDBParameterGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html
 */
export interface CfnDBParameterGroupProps {
  /**
   * Provides the customer-specified description for this DB parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html#cfn-neptune-dbparametergroup-description
   */
  readonly description: string;

  /**
   * Must be `neptune1` for engine versions prior to [1.2.0.0](https://docs.aws.amazon.com/neptune/latest/userguide/engine-releases-1.2.0.0.html) , or `neptune1.2` for engine version `1.2.0.0` and higher.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html#cfn-neptune-dbparametergroup-family
   */
  readonly family: string;

  /**
   * Provides the name of the DB parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html#cfn-neptune-dbparametergroup-name
   */
  readonly name?: string;

  /**
   * The parameters to set for this DB parameter group.
   *
   * The parameters are expressed as a JSON object consisting of key-value pairs.
   *
   * Changes to dynamic parameters are applied immediately. During an update, if you have static parameters (whether they were changed or not), it triggers AWS CloudFormation to reboot the associated DB instance without failover.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html#cfn-neptune-dbparametergroup-parameters
   */
  readonly parameters: any | cdk.IResolvable;

  /**
   * The tags that you want to attach to this parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbparametergroup.html#cfn-neptune-dbparametergroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDBParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBParameterGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("family", cdk.requiredValidator)(properties.family));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.requiredValidator)(properties.parameters));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Family": cdk.stringToCloudFormation(properties.family),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDBParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBParameterGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBParameterGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Neptune::DBSubnetGroup` type creates an Amazon Neptune DB subnet group.
 *
 * Subnet groups must contain at least two subnets in two different Availability Zones in the same AWS Region.
 *
 * @cloudformationResource AWS::Neptune::DBSubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html
 */
export class CfnDBSubnetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Neptune::DBSubnetGroup";

  /**
   * Build a CfnDBSubnetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBSubnetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBSubnetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBSubnetGroup(scope, id, propsResult.value);
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
   * Provides the description of the DB subnet group.
   */
  public dbSubnetGroupDescription: string;

  /**
   * The name of the DB subnet group.
   */
  public dbSubnetGroupName?: string;

  /**
   * The Amazon EC2 subnet IDs for the DB subnet group.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that you want to attach to the DB subnet group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBSubnetGroupProps) {
    super(scope, id, {
      "type": CfnDBSubnetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbSubnetGroupDescription", this);
    cdk.requireProperty(props, "subnetIds", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.dbSubnetGroupDescription = props.dbSubnetGroupDescription;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Neptune::DBSubnetGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dbSubnetGroupDescription": this.dbSubnetGroupDescription,
      "dbSubnetGroupName": this.dbSubnetGroupName,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBSubnetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBSubnetGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDBSubnetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html
 */
export interface CfnDBSubnetGroupProps {
  /**
   * Provides the description of the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html#cfn-neptune-dbsubnetgroup-dbsubnetgroupdescription
   */
  readonly dbSubnetGroupDescription: string;

  /**
   * The name of the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html#cfn-neptune-dbsubnetgroup-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * The Amazon EC2 subnet IDs for the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html#cfn-neptune-dbsubnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * The tags that you want to attach to the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptune-dbsubnetgroup.html#cfn-neptune-dbsubnetgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDBSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbSubnetGroupDescription", cdk.requiredValidator)(properties.dbSubnetGroupDescription));
  errors.collect(cdk.propertyValidator("dbSubnetGroupDescription", cdk.validateString)(properties.dbSubnetGroupDescription));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBSubnetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBSubnetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBSubnetGroupPropsValidator(properties).assertSuccess();
  return {
    "DBSubnetGroupDescription": cdk.stringToCloudFormation(properties.dbSubnetGroupDescription),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDBSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBSubnetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBSubnetGroupProps>();
  ret.addPropertyResult("dbSubnetGroupDescription", "DBSubnetGroupDescription", (properties.DBSubnetGroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupDescription) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}