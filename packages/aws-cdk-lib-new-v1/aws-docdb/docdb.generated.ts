/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::DocDB::DBCluster` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBCluster.
 *
 * Amazon DocumentDB is a fully managed, MongoDB-compatible document database engine. For more information, see [DBCluster](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBCluster.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBCluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html
 */
export class CfnDBCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDB::DBCluster";

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
   * The resource id for the cluster; for example: `cluster-ABCD1234EFGH5678IJKL90MNOP` . The cluster ID uniquely identifies the cluster and is used in things like IAM authentication policies.
   *
   * @cloudformationAttribute ClusterResourceId
   */
  public readonly attrClusterResourceId: string;

  /**
   * The connection endpoint for the cluster, such as `sample-cluster.cluster-cozrlsfrcjoc.us-east-1.docdb.amazonaws.com` .
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The port number on which the cluster accepts connections. For example: `27017` .
   *
   * @cloudformationAttribute Port
   */
  public readonly attrPort: string;

  /**
   * The reader endpoint for the cluster. For example: `sample-cluster.cluster-ro-cozrlsfrcjoc.us-east-1.docdb.amazonaws.com` .
   *
   * @cloudformationAttribute ReadEndpoint
   */
  public readonly attrReadEndpoint: string;

  /**
   * A list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
   */
  public availabilityZones?: Array<string>;

  /**
   * The number of days for which automated backups are retained. You must specify a minimum value of 1.
   */
  public backupRetentionPeriod?: number;

  public copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The cluster identifier. This parameter is stored as a lowercase string.
   */
  public dbClusterIdentifier?: string;

  /**
   * The name of the cluster parameter group to associate with this cluster.
   */
  public dbClusterParameterGroupName?: string;

  /**
   * A subnet group to associate with this cluster.
   */
  public dbSubnetGroupName?: string;

  /**
   * Protects clusters from being accidentally deleted.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The list of log types that need to be enabled for exporting to Amazon CloudWatch Logs.
   */
  public enableCloudwatchLogsExports?: Array<string>;

  /**
   * The version number of the database engine to use.
   */
  public engineVersion?: string;

  /**
   * The AWS KMS key identifier for an encrypted cluster.
   */
  public kmsKeyId?: string;

  /**
   * The name of the master user for the cluster.
   */
  public masterUsername?: string;

  /**
   * The password for the master database user.
   */
  public masterUserPassword?: string;

  /**
   * Specifies the port that the database engine is listening on.
   */
  public port?: number;

  /**
   * The daily time range during which automated backups are created if automated backups are enabled using the `BackupRetentionPeriod` parameter.
   */
  public preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * The date and time to restore the cluster to.
   */
  public restoreToTime?: string;

  /**
   * The type of restore to be performed. You can specify one of the following values:.
   */
  public restoreType?: string;

  /**
   * The identifier for the snapshot or cluster snapshot to restore from.
   */
  public snapshotIdentifier?: string;

  /**
   * The identifier of the source cluster from which to restore.
   */
  public sourceDbClusterIdentifier?: string;

  /**
   * Specifies whether the cluster is encrypted.
   */
  public storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * The storage type to associate with the DB cluster.
   */
  public storageType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be assigned to the cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A value that is set to `true` to restore the cluster to the latest restorable backup time, and `false` otherwise.
   */
  public useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of EC2 VPC security groups to associate with this cluster.
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
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPort = cdk.Token.asString(this.getAtt("Port", cdk.ResolutionTypeHint.STRING));
    this.attrReadEndpoint = cdk.Token.asString(this.getAtt("ReadEndpoint", cdk.ResolutionTypeHint.STRING));
    this.availabilityZones = props.availabilityZones;
    this.backupRetentionPeriod = props.backupRetentionPeriod;
    this.copyTagsToSnapshot = props.copyTagsToSnapshot;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbClusterParameterGroupName = props.dbClusterParameterGroupName;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.deletionProtection = props.deletionProtection;
    this.enableCloudwatchLogsExports = props.enableCloudwatchLogsExports;
    this.engineVersion = props.engineVersion;
    this.kmsKeyId = props.kmsKeyId;
    this.masterUsername = props.masterUsername;
    this.masterUserPassword = props.masterUserPassword;
    this.port = props.port;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.restoreToTime = props.restoreToTime;
    this.restoreType = props.restoreType;
    this.snapshotIdentifier = props.snapshotIdentifier;
    this.sourceDbClusterIdentifier = props.sourceDbClusterIdentifier;
    this.storageEncrypted = props.storageEncrypted;
    this.storageType = props.storageType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBCluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.useLatestRestorableTime = props.useLatestRestorableTime;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::DocDB::DBCluster' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availabilityZones": this.availabilityZones,
      "backupRetentionPeriod": this.backupRetentionPeriod,
      "copyTagsToSnapshot": this.copyTagsToSnapshot,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbClusterParameterGroupName": this.dbClusterParameterGroupName,
      "dbSubnetGroupName": this.dbSubnetGroupName,
      "deletionProtection": this.deletionProtection,
      "enableCloudwatchLogsExports": this.enableCloudwatchLogsExports,
      "engineVersion": this.engineVersion,
      "kmsKeyId": this.kmsKeyId,
      "masterUsername": this.masterUsername,
      "masterUserPassword": this.masterUserPassword,
      "port": this.port,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "restoreToTime": this.restoreToTime,
      "restoreType": this.restoreType,
      "snapshotIdentifier": this.snapshotIdentifier,
      "sourceDbClusterIdentifier": this.sourceDbClusterIdentifier,
      "storageEncrypted": this.storageEncrypted,
      "storageType": this.storageType,
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

/**
 * Properties for defining a `CfnDBCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html
 */
export interface CfnDBClusterProps {
  /**
   * A list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * The number of days for which automated backups are retained. You must specify a minimum value of 1.
   *
   * Default: 1
   *
   * Constraints:
   *
   * - Must be a value from 1 to 35.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-backupretentionperiod
   */
  readonly backupRetentionPeriod?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-copytagstosnapshot
   */
  readonly copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The cluster identifier. This parameter is stored as a lowercase string.
   *
   * Constraints:
   *
   * - Must contain from 1 to 63 letters, numbers, or hyphens.
   * - The first character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   *
   * Example: `my-cluster`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusteridentifier
   */
  readonly dbClusterIdentifier?: string;

  /**
   * The name of the cluster parameter group to associate with this cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusterparametergroupname
   */
  readonly dbClusterParameterGroupName?: string;

  /**
   * A subnet group to associate with this cluster.
   *
   * Constraints: Must match the name of an existing `DBSubnetGroup` . Must not be default.
   *
   * Example: `mySubnetgroup`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * Protects clusters from being accidentally deleted.
   *
   * If enabled, the cluster cannot be deleted unless it is modified and `DeletionProtection` is disabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The list of log types that need to be enabled for exporting to Amazon CloudWatch Logs.
   *
   * You can enable audit logs or profiler logs. For more information, see [Auditing Amazon DocumentDB Events](https://docs.aws.amazon.com/documentdb/latest/developerguide/event-auditing.html) and [Profiling Amazon DocumentDB Operations](https://docs.aws.amazon.com/documentdb/latest/developerguide/profiling.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-enablecloudwatchlogsexports
   */
  readonly enableCloudwatchLogsExports?: Array<string>;

  /**
   * The version number of the database engine to use.
   *
   * The `--engine-version` will default to the latest major engine version. For production workloads, we recommend explicitly declaring this parameter with the intended major engine version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-engineversion
   */
  readonly engineVersion?: string;

  /**
   * The AWS KMS key identifier for an encrypted cluster.
   *
   * The AWS KMS key identifier is the Amazon Resource Name (ARN) for the AWS KMS encryption key. If you are creating a cluster using the same AWS account that owns the AWS KMS encryption key that is used to encrypt the new cluster, you can use the AWS KMS key alias instead of the ARN for the AWS KMS encryption key.
   *
   * If an encryption key is not specified in `KmsKeyId` :
   *
   * - If the `StorageEncrypted` parameter is `true` , Amazon DocumentDB uses your default encryption key.
   *
   * AWS KMS creates the default encryption key for your AWS account . Your AWS account has a different default encryption key for each AWS Regions .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the master user for the cluster.
   *
   * Constraints:
   *
   * - Must be from 1 to 63 letters or numbers.
   * - The first character must be a letter.
   * - Cannot be a reserved word for the chosen database engine.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masterusername
   */
  readonly masterUsername?: string;

  /**
   * The password for the master database user.
   *
   * This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@).
   *
   * Constraints: Must contain from 8 to 100 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masteruserpassword
   */
  readonly masterUserPassword?: string;

  /**
   * Specifies the port that the database engine is listening on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-port
   */
  readonly port?: number;

  /**
   * The daily time range during which automated backups are created if automated backups are enabled using the `BackupRetentionPeriod` parameter.
   *
   * The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region .
   *
   * Constraints:
   *
   * - Must be in the format `hh24:mi-hh24:mi` .
   * - Must be in Universal Coordinated Time (UTC).
   * - Must not conflict with the preferred maintenance window.
   * - Must be at least 30 minutes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   *
   * The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region , occurring on a random day of the week.
   *
   * Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
   *
   * Constraints: Minimum 30-minute window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The date and time to restore the cluster to.
   *
   * Valid values: A time in Universal Coordinated Time (UTC) format.
   *
   * Constraints:
   *
   * - Must be before the latest restorable time for the instance.
   * - Must be specified if the `UseLatestRestorableTime` parameter is not provided.
   * - Cannot be specified if the `UseLatestRestorableTime` parameter is `true` .
   * - Cannot be specified if the `RestoreType` parameter is `copy-on-write` .
   *
   * Example: `2015-03-07T23:45:00Z`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretotime
   */
  readonly restoreToTime?: string;

  /**
   * The type of restore to be performed. You can specify one of the following values:.
   *
   * - `full-copy` - The new DB cluster is restored as a full copy of the source DB cluster.
   * - `copy-on-write` - The new DB cluster is restored as a clone of the source DB cluster.
   *
   * Constraints: You can't specify `copy-on-write` if the engine version of the source DB cluster is earlier than 1.11.
   *
   * If you don't specify a `RestoreType` value, then the new DB cluster is restored as a full copy of the source DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretype
   */
  readonly restoreType?: string;

  /**
   * The identifier for the snapshot or cluster snapshot to restore from.
   *
   * You can use either the name or the Amazon Resource Name (ARN) to specify a cluster snapshot. However, you can use only the ARN to specify a snapshot.
   *
   * Constraints:
   *
   * - Must match the identifier of an existing snapshot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-snapshotidentifier
   */
  readonly snapshotIdentifier?: string;

  /**
   * The identifier of the source cluster from which to restore.
   *
   * Constraints:
   *
   * - Must match the identifier of an existing `DBCluster` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-sourcedbclusteridentifier
   */
  readonly sourceDbClusterIdentifier?: string;

  /**
   * Specifies whether the cluster is encrypted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-storageencrypted
   */
  readonly storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * The storage type to associate with the DB cluster.
   *
   * For information on storage types for Amazon DocumentDB clusters, see Cluster storage configurations in the *Amazon DocumentDB Developer Guide* .
   *
   * Valid values for storage type - `standard | iopt1`
   *
   * Default value is `standard`
   *
   * > When you create a DocumentDB DB cluster with the storage type set to `iopt1` , the storage type is returned in the response. The storage type isn't returned when you set it to `standard` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-storagetype
   */
  readonly storageType?: string;

  /**
   * The tags to be assigned to the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A value that is set to `true` to restore the cluster to the latest restorable backup time, and `false` otherwise.
   *
   * Default: `false`
   *
   * Constraints: Cannot be specified if the `RestoreToTime` parameter is provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-uselatestrestorabletime
   */
  readonly useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of EC2 VPC security groups to associate with this cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;
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
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("backupRetentionPeriod", cdk.validateNumber)(properties.backupRetentionPeriod));
  errors.collect(cdk.propertyValidator("copyTagsToSnapshot", cdk.validateBoolean)(properties.copyTagsToSnapshot));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterParameterGroupName", cdk.validateString)(properties.dbClusterParameterGroupName));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("enableCloudwatchLogsExports", cdk.listValidator(cdk.validateString))(properties.enableCloudwatchLogsExports));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.validateString)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("restoreToTime", cdk.validateString)(properties.restoreToTime));
  errors.collect(cdk.propertyValidator("restoreType", cdk.validateString)(properties.restoreType));
  errors.collect(cdk.propertyValidator("snapshotIdentifier", cdk.validateString)(properties.snapshotIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbClusterIdentifier", cdk.validateString)(properties.sourceDbClusterIdentifier));
  errors.collect(cdk.propertyValidator("storageEncrypted", cdk.validateBoolean)(properties.storageEncrypted));
  errors.collect(cdk.propertyValidator("storageType", cdk.validateString)(properties.storageType));
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
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "BackupRetentionPeriod": cdk.numberToCloudFormation(properties.backupRetentionPeriod),
    "CopyTagsToSnapshot": cdk.booleanToCloudFormation(properties.copyTagsToSnapshot),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBClusterParameterGroupName": cdk.stringToCloudFormation(properties.dbClusterParameterGroupName),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "EnableCloudwatchLogsExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.enableCloudwatchLogsExports),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword),
    "MasterUsername": cdk.stringToCloudFormation(properties.masterUsername),
    "Port": cdk.numberToCloudFormation(properties.port),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "RestoreToTime": cdk.stringToCloudFormation(properties.restoreToTime),
    "RestoreType": cdk.stringToCloudFormation(properties.restoreType),
    "SnapshotIdentifier": cdk.stringToCloudFormation(properties.snapshotIdentifier),
    "SourceDBClusterIdentifier": cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
    "StorageEncrypted": cdk.booleanToCloudFormation(properties.storageEncrypted),
    "StorageType": cdk.stringToCloudFormation(properties.storageType),
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
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("backupRetentionPeriod", "BackupRetentionPeriod", (properties.BackupRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionPeriod) : undefined));
  ret.addPropertyResult("copyTagsToSnapshot", "CopyTagsToSnapshot", (properties.CopyTagsToSnapshot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshot) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbClusterParameterGroupName", "DBClusterParameterGroupName", (properties.DBClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterParameterGroupName) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("enableCloudwatchLogsExports", "EnableCloudwatchLogsExports", (properties.EnableCloudwatchLogsExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EnableCloudwatchLogsExports) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("masterUsername", "MasterUsername", (properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("restoreToTime", "RestoreToTime", (properties.RestoreToTime != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreToTime) : undefined));
  ret.addPropertyResult("restoreType", "RestoreType", (properties.RestoreType != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreType) : undefined));
  ret.addPropertyResult("snapshotIdentifier", "SnapshotIdentifier", (properties.SnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotIdentifier) : undefined));
  ret.addPropertyResult("sourceDbClusterIdentifier", "SourceDBClusterIdentifier", (properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined));
  ret.addPropertyResult("storageEncrypted", "StorageEncrypted", (properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined));
  ret.addPropertyResult("storageType", "StorageType", (properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("useLatestRestorableTime", "UseLatestRestorableTime", (properties.UseLatestRestorableTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLatestRestorableTime) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DocDB::DBClusterParameterGroup` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBClusterParameterGroup.
 *
 * For more information, see [DBClusterParameterGroup](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBClusterParameterGroup.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * Parameters in a cluster parameter group apply to all of the instances in a cluster.
 *
 * A cluster parameter group is initially created with the default parameters for the database engine used by instances in the cluster. To provide custom values for any of the parameters, you must modify the group after you create it. After you create a DB cluster parameter group, you must associate it with your cluster. For the new cluster parameter group and associated settings to take effect, you must then reboot the DB instances in the cluster without failover.
 *
 * > After you create a cluster parameter group, you should wait at least 5 minutes before creating your first cluster that uses that cluster parameter group as the default parameter group. This allows Amazon DocumentDB to fully complete the create action before the cluster parameter group is used as the default for a new cluster. This step is especially important for parameters that are critical when creating the default database for a cluster, such as the character set for the default database defined by the `character_set_database` parameter.
 *
 * @cloudformationResource AWS::DocDB::DBClusterParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html
 */
export class CfnDBClusterParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDB::DBClusterParameterGroup";

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
   * The description for the cluster parameter group.
   */
  public description: string;

  /**
   * The cluster parameter group family name.
   */
  public family: string;

  /**
   * The name of the DB cluster parameter group.
   */
  public name?: string;

  /**
   * Provides a list of parameters for the cluster parameter group.
   */
  public parameters: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be assigned to the cluster parameter group.
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
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBClusterParameterGroup", props.tags, {
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html
 */
export interface CfnDBClusterParameterGroupProps {
  /**
   * The description for the cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-description
   */
  readonly description: string;

  /**
   * The cluster parameter group family name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-family
   */
  readonly family: string;

  /**
   * The name of the DB cluster parameter group.
   *
   * Constraints:
   *
   * - Must not match the name of an existing `DBClusterParameterGroup` .
   *
   * > This value is stored as a lowercase string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-name
   */
  readonly name?: string;

  /**
   * Provides a list of parameters for the cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-parameters
   */
  readonly parameters: any | cdk.IResolvable;

  /**
   * The tags to be assigned to the cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-tags
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
 * The `AWS::DocDB::DBInstance` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBInstance.
 *
 * For more information, see [DBInstance](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBInstance.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBInstance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html
 */
export class CfnDBInstance extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDB::DBInstance";

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
   * The connection endpoint for the instance. For example: `sample-cluster.cluster-abcdefghijkl.us-east-1.docdb.amazonaws.com` .
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The port number on which the database accepts connections, such as `27017` .
   *
   * @cloudformationAttribute Port
   */
  public readonly attrPort: string;

  /**
   * This parameter does not apply to Amazon DocumentDB.
   */
  public autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The Amazon EC2 Availability Zone that the instance is created in.
   */
  public availabilityZone?: string;

  /**
   * The CA certificate identifier to use for the DB instance's server certificate.
   */
  public caCertificateIdentifier?: string;

  /**
   * Specifies whether the DB instance is restarted when you rotate your SSL/TLS certificate.
   */
  public certificateRotationRestart?: boolean | cdk.IResolvable;

  /**
   * The identifier of the cluster that the instance will belong to.
   */
  public dbClusterIdentifier: string;

  /**
   * The compute and memory capacity of the instance;
   */
  public dbInstanceClass: string;

  /**
   * The instance identifier. This parameter is stored as a lowercase string.
   */
  public dbInstanceIdentifier?: string;

  /**
   * A value that indicates whether to enable Performance Insights for the DB Instance.
   */
  public enablePerformanceInsights?: boolean | cdk.IResolvable;

  /**
   * The time range each week during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be assigned to the instance.
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

    cdk.requireProperty(props, "dbClusterIdentifier", this);
    cdk.requireProperty(props, "dbInstanceClass", this);

    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPort = cdk.Token.asString(this.getAtt("Port", cdk.ResolutionTypeHint.STRING));
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.availabilityZone = props.availabilityZone;
    this.caCertificateIdentifier = props.caCertificateIdentifier;
    this.certificateRotationRestart = props.certificateRotationRestart;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbInstanceClass = props.dbInstanceClass;
    this.dbInstanceIdentifier = props.dbInstanceIdentifier;
    this.enablePerformanceInsights = props.enablePerformanceInsights;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBInstance", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::DocDB::DBInstance' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "availabilityZone": this.availabilityZone,
      "caCertificateIdentifier": this.caCertificateIdentifier,
      "certificateRotationRestart": this.certificateRotationRestart,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbInstanceClass": this.dbInstanceClass,
      "dbInstanceIdentifier": this.dbInstanceIdentifier,
      "enablePerformanceInsights": this.enablePerformanceInsights,
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html
 */
export interface CfnDBInstanceProps {
  /**
   * This parameter does not apply to Amazon DocumentDB.
   *
   * Amazon DocumentDB does not perform minor version upgrades regardless of the value set.
   *
   * Default: `false`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The Amazon EC2 Availability Zone that the instance is created in.
   *
   * Default: A random, system-chosen Availability Zone in the endpoint's AWS Region .
   *
   * Example: `us-east-1d`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The CA certificate identifier to use for the DB instance's server certificate.
   *
   * For more information, see [Updating Your Amazon DocumentDB TLS Certificates](https://docs.aws.amazon.com/documentdb/latest/developerguide/ca_cert_rotation.html) and [Encrypting Data in Transit](https://docs.aws.amazon.com/documentdb/latest/developerguide/security.encryption.ssl.html) in the *Amazon DocumentDB Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-cacertificateidentifier
   */
  readonly caCertificateIdentifier?: string;

  /**
   * Specifies whether the DB instance is restarted when you rotate your SSL/TLS certificate.
   *
   * By default, the DB instance is restarted when you rotate your SSL/TLS certificate. The certificate is not updated until the DB instance is restarted.
   *
   * > Set this parameter only if you are *not* using SSL/TLS to connect to the DB instance.
   *
   * If you are using SSL/TLS to connect to the DB instance, see [Updating Your Amazon DocumentDB TLS Certificates](https://docs.aws.amazon.com/documentdb/latest/developerguide/ca_cert_rotation.html) and [Encrypting Data in Transit](https://docs.aws.amazon.com/documentdb/latest/developerguide/security.encryption.ssl.html) in the *Amazon DocumentDB Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-certificaterotationrestart
   */
  readonly certificateRotationRestart?: boolean | cdk.IResolvable;

  /**
   * The identifier of the cluster that the instance will belong to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbclusteridentifier
   */
  readonly dbClusterIdentifier: string;

  /**
   * The compute and memory capacity of the instance;
   *
   * for example, `db.m4.large` . If you change the class of an instance there can be some interruption in the cluster's service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceclass
   */
  readonly dbInstanceClass: string;

  /**
   * The instance identifier. This parameter is stored as a lowercase string.
   *
   * Constraints:
   *
   * - Must contain from 1 to 63 letters, numbers, or hyphens.
   * - The first character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   *
   * Example: `mydbinstance`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceidentifier
   */
  readonly dbInstanceIdentifier?: string;

  /**
   * A value that indicates whether to enable Performance Insights for the DB Instance.
   *
   * For more information, see [Using Amazon Performance Insights](https://docs.aws.amazon.com/documentdb/latest/developerguide/performance-insights.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-enableperformanceinsights
   */
  readonly enablePerformanceInsights?: boolean | cdk.IResolvable;

  /**
   * The time range each week during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   *
   * The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region , occurring on a random day of the week.
   *
   * Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
   *
   * Constraints: Minimum 30-minute window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The tags to be assigned to the instance.
   *
   * You can assign up to 10 tags to an instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-tags
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
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("caCertificateIdentifier", cdk.validateString)(properties.caCertificateIdentifier));
  errors.collect(cdk.propertyValidator("certificateRotationRestart", cdk.validateBoolean)(properties.certificateRotationRestart));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.requiredValidator)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbInstanceClass", cdk.requiredValidator)(properties.dbInstanceClass));
  errors.collect(cdk.propertyValidator("dbInstanceClass", cdk.validateString)(properties.dbInstanceClass));
  errors.collect(cdk.propertyValidator("dbInstanceIdentifier", cdk.validateString)(properties.dbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("enablePerformanceInsights", cdk.validateBoolean)(properties.enablePerformanceInsights));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnDBInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstancePropsValidator(properties).assertSuccess();
  return {
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "CACertificateIdentifier": cdk.stringToCloudFormation(properties.caCertificateIdentifier),
    "CertificateRotationRestart": cdk.booleanToCloudFormation(properties.certificateRotationRestart),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBInstanceClass": cdk.stringToCloudFormation(properties.dbInstanceClass),
    "DBInstanceIdentifier": cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
    "EnablePerformanceInsights": cdk.booleanToCloudFormation(properties.enablePerformanceInsights),
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
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("caCertificateIdentifier", "CACertificateIdentifier", (properties.CACertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CACertificateIdentifier) : undefined));
  ret.addPropertyResult("certificateRotationRestart", "CertificateRotationRestart", (properties.CertificateRotationRestart != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CertificateRotationRestart) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbInstanceClass", "DBInstanceClass", (properties.DBInstanceClass != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceClass) : undefined));
  ret.addPropertyResult("dbInstanceIdentifier", "DBInstanceIdentifier", (properties.DBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier) : undefined));
  ret.addPropertyResult("enablePerformanceInsights", "EnablePerformanceInsights", (properties.EnablePerformanceInsights != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePerformanceInsights) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DocDB::DBSubnetGroup` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBSubnetGroup.
 *
 * subnet groups must contain at least one subnet in at least two Availability Zones in the AWS Region . For more information, see [DBSubnetGroup](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBSubnetGroup.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBSubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html
 */
export class CfnDBSubnetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDB::DBSubnetGroup";

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
   * The description for the subnet group.
   */
  public dbSubnetGroupDescription: string;

  /**
   * The name for the subnet group. This value is stored as a lowercase string.
   */
  public dbSubnetGroupName?: string;

  /**
   * The Amazon EC2 subnet IDs for the subnet group.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be assigned to the subnet group.
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
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBSubnetGroup", props.tags, {
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html
 */
export interface CfnDBSubnetGroupProps {
  /**
   * The description for the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupdescription
   */
  readonly dbSubnetGroupDescription: string;

  /**
   * The name for the subnet group. This value is stored as a lowercase string.
   *
   * Constraints: Must contain no more than 255 letters, numbers, periods, underscores, spaces, or hyphens. Must not be default.
   *
   * Example: `mySubnetgroup`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * The Amazon EC2 subnet IDs for the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * The tags to be assigned to the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-tags
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

/**
 * Creates an Amazon DocumentDB event notification subscription.
 *
 * This action requires a topic Amazon Resource Name (ARN) created by using the Amazon DocumentDB console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the Amazon SNS console.
 *
 * You can specify the type of source ( `SourceType` ) that you want to be notified of. You can also provide a list of Amazon DocumentDB sources ( `SourceIds` ) that trigger the events, and you can provide a list of event categories ( `EventCategories` ) for events that you want to be notified of. For example, you can specify `SourceType = db-instance` , `SourceIds = mydbinstance1, mydbinstance2` and `EventCategories = Availability, Backup` .
 *
 * If you specify both the `SourceType` and `SourceIds` (such as `SourceType = db-instance` and `SourceIdentifier = myDBInstance1` ), you are notified of all the `db-instance` events for the specified source. If you specify a `SourceType` but do not specify a `SourceIdentifier` , you receive notice of the events for that source type for all your Amazon DocumentDB sources. If you do not specify either the `SourceType` or the `SourceIdentifier` , you are notified of events generated from all Amazon DocumentDB sources belonging to your customer account.
 *
 * @cloudformationResource AWS::DocDB::EventSubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html
 */
export class CfnEventSubscription extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDB::EventSubscription";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A Boolean value;
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * A list of event categories for a `SourceType` that you want to subscribe to.
   */
  public eventCategories?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the SNS topic created for event notification.
   */
  public snsTopicArn: string;

  /**
   * The list of identifiers of the event sources for which events are returned.
   */
  public sourceIds?: Array<string>;

  /**
   * The type of source that is generating the events.
   */
  public sourceType?: string;

  /**
   * The name of the subscription.
   */
  public subscriptionName?: string;

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

    cdk.requireProperty(props, "snsTopicArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.enabled = props.enabled;
    this.eventCategories = props.eventCategories;
    this.snsTopicArn = props.snsTopicArn;
    this.sourceIds = props.sourceIds;
    this.sourceType = props.sourceType;
    this.subscriptionName = props.subscriptionName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enabled": this.enabled,
      "eventCategories": this.eventCategories,
      "snsTopicArn": this.snsTopicArn,
      "sourceIds": this.sourceIds,
      "sourceType": this.sourceType,
      "subscriptionName": this.subscriptionName
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html
 */
export interface CfnEventSubscriptionProps {
  /**
   * A Boolean value;
   *
   * set to `true` to activate the subscription, set to `false` to create the subscription but not active it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * A list of event categories for a `SourceType` that you want to subscribe to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-eventcategories
   */
  readonly eventCategories?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the SNS topic created for event notification.
   *
   * Amazon SNS creates the ARN when you create a topic and subscribe to it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-snstopicarn
   */
  readonly snsTopicArn: string;

  /**
   * The list of identifiers of the event sources for which events are returned.
   *
   * If not specified, then all sources are included in the response. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
   *
   * Constraints:
   *
   * - If `SourceIds` are provided, `SourceType` must also be provided.
   * - If the source type is an instance, a `DBInstanceIdentifier` must be provided.
   * - If the source type is a security group, a `DBSecurityGroupName` must be provided.
   * - If the source type is a parameter group, a `DBParameterGroupName` must be provided.
   * - If the source type is a snapshot, a `DBSnapshotIdentifier` must be provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-sourceids
   */
  readonly sourceIds?: Array<string>;

  /**
   * The type of source that is generating the events.
   *
   * For example, if you want to be notified of events generated by an instance, you would set this parameter to `db-instance` . If this value is not specified, all events are returned.
   *
   * Valid values: `db-instance` , `db-cluster` , `db-parameter-group` , `db-security-group` , `db-cluster-snapshot`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-sourcetype
   */
  readonly sourceType?: string;

  /**
   * The name of the subscription.
   *
   * Constraints: The name must be fewer than 255 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-eventsubscription.html#cfn-docdb-eventsubscription-subscriptionname
   */
  readonly subscriptionName?: string;
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
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.requiredValidator)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("sourceIds", cdk.listValidator(cdk.validateString))(properties.sourceIds));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  errors.collect(cdk.propertyValidator("subscriptionName", cdk.validateString)(properties.subscriptionName));
  return errors.wrap("supplied properties not correct for \"CfnEventSubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnEventSubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSubscriptionPropsValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "EventCategories": cdk.listMapper(cdk.stringToCloudFormation)(properties.eventCategories),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn),
    "SourceIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceIds),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType),
    "SubscriptionName": cdk.stringToCloudFormation(properties.subscriptionName)
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
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addPropertyResult("sourceIds", "SourceIds", (properties.SourceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceIds) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addPropertyResult("subscriptionName", "SubscriptionName", (properties.SubscriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}