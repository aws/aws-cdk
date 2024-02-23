/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a custom DB engine version (CEV).
 *
 * @cloudformationResource AWS::RDS::CustomDBEngineVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html
 */
export class CfnCustomDBEngineVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::CustomDBEngineVersion";

  /**
   * Build a CfnCustomDBEngineVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomDBEngineVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomDBEngineVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomDBEngineVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the custom engine version.
   *
   * @cloudformationAttribute DBEngineVersionArn
   */
  public readonly attrDbEngineVersionArn: string;

  /**
   * The name of an Amazon S3 bucket that contains database installation files for your CEV.
   */
  public databaseInstallationFilesS3BucketName: string;

  /**
   * The Amazon S3 directory that contains the database installation files for your CEV.
   */
  public databaseInstallationFilesS3Prefix?: string;

  /**
   * An optional description of your CEV.
   */
  public description?: string;

  /**
   * The database engine to use for your custom engine version (CEV).
   */
  public engine: string;

  /**
   * The name of your CEV.
   */
  public engineVersion: string;

  /**
   * The AWS KMS key identifier for an encrypted CEV.
   */
  public kmsKeyId?: string;

  /**
   * The CEV manifest, which is a JSON document that describes the installation .zip files stored in Amazon S3. Specify the name/value pairs in a file or a quoted string. RDS Custom applies the patches in the order in which they are listed.
   */
  public manifest?: string;

  /**
   * A value that indicates the status of a custom engine version (CEV).
   */
  public status?: string;

  /**
   * A list of tags.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomDBEngineVersionProps) {
    super(scope, id, {
      "type": CfnCustomDBEngineVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "databaseInstallationFilesS3BucketName", this);
    cdk.requireProperty(props, "engine", this);
    cdk.requireProperty(props, "engineVersion", this);

    this.attrDbEngineVersionArn = cdk.Token.asString(this.getAtt("DBEngineVersionArn", cdk.ResolutionTypeHint.STRING));
    this.databaseInstallationFilesS3BucketName = props.databaseInstallationFilesS3BucketName;
    this.databaseInstallationFilesS3Prefix = props.databaseInstallationFilesS3Prefix;
    this.description = props.description;
    this.engine = props.engine;
    this.engineVersion = props.engineVersion;
    this.kmsKeyId = props.kmsKeyId;
    this.manifest = props.manifest;
    this.status = props.status;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "databaseInstallationFilesS3BucketName": this.databaseInstallationFilesS3BucketName,
      "databaseInstallationFilesS3Prefix": this.databaseInstallationFilesS3Prefix,
      "description": this.description,
      "engine": this.engine,
      "engineVersion": this.engineVersion,
      "kmsKeyId": this.kmsKeyId,
      "manifest": this.manifest,
      "status": this.status,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomDBEngineVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomDBEngineVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomDBEngineVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html
 */
export interface CfnCustomDBEngineVersionProps {
  /**
   * The name of an Amazon S3 bucket that contains database installation files for your CEV.
   *
   * For example, a valid bucket name is `my-custom-installation-files` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-databaseinstallationfiless3bucketname
   */
  readonly databaseInstallationFilesS3BucketName: string;

  /**
   * The Amazon S3 directory that contains the database installation files for your CEV.
   *
   * For example, a valid bucket name is `123456789012/cev1` . If this setting isn't specified, no prefix is assumed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-databaseinstallationfiless3prefix
   */
  readonly databaseInstallationFilesS3Prefix?: string;

  /**
   * An optional description of your CEV.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-description
   */
  readonly description?: string;

  /**
   * The database engine to use for your custom engine version (CEV).
   *
   * Valid values:
   *
   * - `custom-oracle-ee`
   * - `custom-oracle-ee-cdb`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-engine
   */
  readonly engine: string;

  /**
   * The name of your CEV.
   *
   * The name format is `major version.customized_string` . For example, a valid CEV name is `19.my_cev1` . This setting is required for RDS Custom for Oracle, but optional for Amazon RDS. The combination of `Engine` and `EngineVersion` is unique per customer per Region.
   *
   * *Constraints:* Minimum length is 1. Maximum length is 60.
   *
   * *Pattern:* `^[a-z0-9_.-]{1,60$` }
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-engineversion
   */
  readonly engineVersion: string;

  /**
   * The AWS KMS key identifier for an encrypted CEV.
   *
   * A symmetric encryption KMS key is required for RDS Custom, but optional for Amazon RDS.
   *
   * If you have an existing symmetric encryption KMS key in your account, you can use it with RDS Custom. No further action is necessary. If you don't already have a symmetric encryption KMS key in your account, follow the instructions in [Creating a symmetric encryption KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk) in the *AWS Key Management Service Developer Guide* .
   *
   * You can choose the same symmetric encryption key when you create a CEV and a DB instance, or choose different keys.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The CEV manifest, which is a JSON document that describes the installation .zip files stored in Amazon S3. Specify the name/value pairs in a file or a quoted string. RDS Custom applies the patches in the order in which they are listed.
   *
   * The following JSON fields are valid:
   *
   * - **MediaImportTemplateVersion** - Version of the CEV manifest. The date is in the format `YYYY-MM-DD` .
   * - **databaseInstallationFileNames** - Ordered list of installation files for the CEV.
   * - **opatchFileNames** - Ordered list of OPatch installers used for the Oracle DB engine.
   * - **psuRuPatchFileNames** - The PSU and RU patches for this CEV.
   * - **OtherPatchFileNames** - The patches that are not in the list of PSU and RU patches. Amazon RDS applies these patches after applying the PSU and RU patches.
   *
   * For more information, see [Creating the CEV manifest](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/custom-cev.html#custom-cev.preparing.manifest) in the *Amazon RDS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-manifest
   */
  readonly manifest?: string;

  /**
   * A value that indicates the status of a custom engine version (CEV).
   *
   * @default - "available"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-status
   */
  readonly status?: string;

  /**
   * A list of tags.
   *
   * For more information, see [Tagging Amazon RDS Resources](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Tagging.html) in the *Amazon RDS User Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-customdbengineversion.html#cfn-rds-customdbengineversion-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCustomDBEngineVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomDBEngineVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomDBEngineVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseInstallationFilesS3BucketName", cdk.requiredValidator)(properties.databaseInstallationFilesS3BucketName));
  errors.collect(cdk.propertyValidator("databaseInstallationFilesS3BucketName", cdk.validateString)(properties.databaseInstallationFilesS3BucketName));
  errors.collect(cdk.propertyValidator("databaseInstallationFilesS3Prefix", cdk.validateString)(properties.databaseInstallationFilesS3Prefix));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engine", cdk.requiredValidator)(properties.engine));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.requiredValidator)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("manifest", cdk.validateString)(properties.manifest));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCustomDBEngineVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomDBEngineVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomDBEngineVersionPropsValidator(properties).assertSuccess();
  return {
    "DatabaseInstallationFilesS3BucketName": cdk.stringToCloudFormation(properties.databaseInstallationFilesS3BucketName),
    "DatabaseInstallationFilesS3Prefix": cdk.stringToCloudFormation(properties.databaseInstallationFilesS3Prefix),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "KMSKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Manifest": cdk.stringToCloudFormation(properties.manifest),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCustomDBEngineVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomDBEngineVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomDBEngineVersionProps>();
  ret.addPropertyResult("databaseInstallationFilesS3BucketName", "DatabaseInstallationFilesS3BucketName", (properties.DatabaseInstallationFilesS3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseInstallationFilesS3BucketName) : undefined));
  ret.addPropertyResult("databaseInstallationFilesS3Prefix", "DatabaseInstallationFilesS3Prefix", (properties.DatabaseInstallationFilesS3Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseInstallationFilesS3Prefix) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("kmsKeyId", "KMSKeyId", (properties.KMSKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyId) : undefined));
  ret.addPropertyResult("manifest", "Manifest", (properties.Manifest != null ? cfn_parse.FromCloudFormation.getString(properties.Manifest) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBCluster` resource creates an Amazon Aurora DB cluster or Multi-AZ DB cluster.
 *
 * For more information about creating an Aurora DB cluster, see [Creating an Amazon Aurora DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.CreateInstance.html) in the *Amazon Aurora User Guide* .
 *
 * For more information about creating a Multi-AZ DB cluster, see [Creating a Multi-AZ DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/create-multi-az-db-cluster.html) in the *Amazon RDS User Guide* .
 *
 * > You can only create this resource in AWS Regions where Amazon Aurora or Multi-AZ DB clusters are supported.
 *
 * *Updating DB clusters*
 *
 * When properties labeled " *Update requires:* [Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) " are updated, AWS CloudFormation first creates a replacement DB cluster, then changes references from other dependent resources to point to the replacement DB cluster, and finally deletes the old DB cluster.
 *
 * > We highly recommend that you take a snapshot of the database before updating the stack. If you don't, you lose the data when AWS CloudFormation replaces your DB cluster. To preserve your data, perform the following procedure:
 * >
 * > - Deactivate any applications that are using the DB cluster so that there's no activity on the DB instance.
 * > - Create a snapshot of the DB cluster. For more information, see [Creating a DB Cluster Snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_CreateSnapshotCluster.html) .
 * > - If you want to restore your DB cluster using a DB cluster snapshot, modify the updated template with your DB cluster changes and add the `SnapshotIdentifier` property with the ID of the DB cluster snapshot that you want to use.
 * >
 * > After you restore a DB cluster with a `SnapshotIdentifier` property, you must specify the same `SnapshotIdentifier` property for any future updates to the DB cluster. When you specify this property for an update, the DB cluster is not restored from the DB cluster snapshot again, and the data in the database is not changed. However, if you don't specify the `SnapshotIdentifier` property, an empty DB cluster is created, and the original DB cluster is deleted. If you specify a property that is different from the previous snapshot restore property, a new DB cluster is restored from the specified `SnapshotIdentifier` property, and the original DB cluster is deleted.
 * > - Update the stack.
 *
 * Currently, when you are updating the stack for an Aurora Serverless DB cluster, you can't include changes to any other properties when you specify one of the following properties: `PreferredBackupWindow` , `PreferredMaintenanceWindow` , and `Port` . This limitation doesn't apply to provisioned DB clusters.
 *
 * For more information about updating other properties of this resource, see `[ModifyDBCluster](https://docs.aws.amazon.com//AmazonRDS/latest/APIReference/API_ModifyDBCluster.html)` . For more information about updating stacks, see [AWS CloudFormation Stacks Updates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html) .
 *
 * *Deleting DB clusters*
 *
 * The default `DeletionPolicy` for `AWS::RDS::DBCluster` resources is `Snapshot` . For more information about how AWS CloudFormation deletes resources, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * @cloudformationResource AWS::RDS::DBCluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html
 */
export class CfnDBCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBCluster";

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
   * The Amazon Resource Name (ARN) for the DB cluster.
   *
   * @cloudformationAttribute DBClusterArn
   */
  public readonly attrDbClusterArn: string;

  /**
   * The AWS Region -unique, immutable identifier for the DB cluster. This identifier is found in AWS CloudTrail log entries whenever the KMS key for the DB cluster is accessed.
   *
   * @cloudformationAttribute DBClusterResourceId
   */
  public readonly attrDbClusterResourceId: string;

  /**
   * The connection endpoint for the primary instance of the DB cluster.
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: cdk.IResolvable;

  /**
   * The connection endpoint for the DB cluster.
   *
   * @cloudformationAttribute Endpoint.Address
   */
  public readonly attrEndpointAddress: string;

  /**
   * The port number that will accept connections on this DB cluster.
   *
   * @cloudformationAttribute Endpoint.Port
   */
  public readonly attrEndpointPort: string;

  /**
   * The Amazon Resource Name (ARN) of the secret.
   *
   * @cloudformationAttribute MasterUserSecret.SecretArn
   */
  public readonly attrMasterUserSecretSecretArn: string;

  /**
   * @cloudformationAttribute ReadEndpoint
   */
  public readonly attrReadEndpoint: cdk.IResolvable;

  /**
   * The reader endpoint for the DB cluster.
   *
   * @cloudformationAttribute ReadEndpoint.Address
   */
  public readonly attrReadEndpointAddress: string;

  /**
   * The amount of storage in gibibytes (GiB) to allocate to each DB instance in the Multi-AZ DB cluster.
   */
  public allocatedStorage?: number;

  /**
   * Provides a list of the AWS Identity and Access Management (IAM) roles that are associated with the DB cluster.
   */
  public associatedRoles?: Array<CfnDBCluster.DBClusterRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether minor engine upgrades are applied automatically to the DB cluster during the maintenance window.
   */
  public autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * A list of Availability Zones (AZs) where instances in the DB cluster can be created.
   */
  public availabilityZones?: Array<string>;

  /**
   * The target backtrack window, in seconds. To disable backtracking, set this value to 0.
   */
  public backtrackWindow?: number;

  /**
   * The number of days for which automated backups are retained.
   */
  public backupRetentionPeriod?: number;

  /**
   * A value that indicates whether to copy all tags from the DB cluster to snapshots of the DB cluster.
   */
  public copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The name of your database.
   */
  public databaseName?: string;

  /**
   * The DB cluster identifier. This parameter is stored as a lowercase string.
   */
  public dbClusterIdentifier?: string;

  /**
   * The compute and memory capacity of each DB instance in the Multi-AZ DB cluster, for example `db.m6gd.xlarge` . Not all DB instance classes are available in all AWS Regions , or for all database engines.
   */
  public dbClusterInstanceClass?: string;

  /**
   * The name of the DB cluster parameter group to associate with this DB cluster.
   */
  public dbClusterParameterGroupName?: string;

  /**
   * The name of the DB parameter group to apply to all instances of the DB cluster.
   */
  public dbInstanceParameterGroupName?: string;

  /**
   * A DB subnet group that you want to associate with this DB cluster.
   */
  public dbSubnetGroupName?: string;

  /**
   * Reserved for future use.
   */
  public dbSystemId?: string;

  /**
   * A value that indicates whether the DB cluster has deletion protection enabled.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Indicates the directory ID of the Active Directory to create the DB cluster.
   */
  public domain?: string;

  /**
   * Specifies the name of the IAM role to use when making API calls to the Directory Service.
   */
  public domainIamRoleName?: string;

  /**
   * The list of log types that need to be enabled for exporting to CloudWatch Logs.
   */
  public enableCloudwatchLogsExports?: Array<string>;

  /**
   * Specifies whether to enable this DB cluster to forward write operations to the primary cluster of a global cluster (Aurora global database).
   */
  public enableGlobalWriteForwarding?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to enable the HTTP endpoint for an Aurora Serverless DB cluster.
   */
  public enableHttpEndpoint?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to enable mapping of AWS Identity and Access Management (IAM) accounts to database accounts.
   */
  public enableIamDatabaseAuthentication?: boolean | cdk.IResolvable;

  /**
   * The name of the database engine to be used for this DB cluster.
   */
  public engine?: string;

  /**
   * The DB engine mode of the DB cluster, either `provisioned` or `serverless` .
   */
  public engineMode?: string;

  /**
   * The version number of the database engine to use.
   */
  public engineVersion?: string;

  /**
   * If you are configuring an Aurora global database cluster and want your Aurora DB cluster to be a secondary member in the global database cluster, specify the global cluster ID of the global database cluster.
   */
  public globalClusterIdentifier?: string;

  /**
   * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster.
   */
  public iops?: number;

  /**
   * The Amazon Resource Name (ARN) of the AWS KMS key that is used to encrypt the database instances in the DB cluster, such as `arn:aws:kms:us-east-1:012345678910:key/abcd1234-a123-456a-a12b-a123b4cd56ef` .
   */
  public kmsKeyId?: string;

  /**
   * Specifies whether to manage the master user password with AWS Secrets Manager.
   */
  public manageMasterUserPassword?: boolean | cdk.IResolvable;

  /**
   * The name of the master user for the DB cluster.
   */
  public masterUsername?: string;

  /**
   * The master password for the DB instance.
   */
  public masterUserPassword?: string;

  /**
   * The secret managed by RDS in AWS Secrets Manager for the master user password.
   */
  public masterUserSecret?: cdk.IResolvable | CfnDBCluster.MasterUserSecretProperty;

  /**
   * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster.
   */
  public monitoringInterval?: number;

  /**
   * The Amazon Resource Name (ARN) for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs.
   */
  public monitoringRoleArn?: string;

  /**
   * The network type of the DB cluster.
   */
  public networkType?: string;

  /**
   * Specifies whether to turn on Performance Insights for the DB cluster.
   */
  public performanceInsightsEnabled?: boolean | cdk.IResolvable;

  /**
   * The AWS KMS key identifier for encryption of Performance Insights data.
   */
  public performanceInsightsKmsKeyId?: string;

  /**
   * The number of days to retain Performance Insights data.
   */
  public performanceInsightsRetentionPeriod?: number;

  /**
   * The port number on which the DB instances in the DB cluster accept connections.
   */
  public port?: number;

  /**
   * The daily time range during which automated backups are created.
   */
  public preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * Specifies whether the DB cluster is publicly accessible.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the source DB instance or DB cluster if this DB cluster is created as a read replica.
   */
  public replicationSourceIdentifier?: string;

  /**
   * The date and time to restore the DB cluster to.
   */
  public restoreToTime?: string;

  /**
   * The type of restore to be performed. You can specify one of the following values:.
   */
  public restoreType?: string;

  /**
   * The `ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless DB cluster.
   */
  public scalingConfiguration?: cdk.IResolvable | CfnDBCluster.ScalingConfigurationProperty;

  /**
   * The `ServerlessV2ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless V2 DB cluster.
   */
  public serverlessV2ScalingConfiguration?: cdk.IResolvable | CfnDBCluster.ServerlessV2ScalingConfigurationProperty;

  /**
   * The identifier for the DB snapshot or DB cluster snapshot to restore from.
   */
  public snapshotIdentifier?: string;

  /**
   * When restoring a DB cluster to a point in time, the identifier of the source DB cluster from which to restore.
   */
  public sourceDbClusterIdentifier?: string;

  /**
   * The AWS Region which contains the source DB cluster when replicating a DB cluster. For example, `us-east-1` .
   */
  public sourceRegion?: string;

  /**
   * Indicates whether the DB cluster is encrypted.
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
   * An optional array of key-value pairs to apply to this DB cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A value that indicates whether to restore the DB cluster to the latest restorable backup time.
   */
  public useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of EC2 VPC security groups to associate with this DB cluster.
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

    this.attrDbClusterArn = cdk.Token.asString(this.getAtt("DBClusterArn", cdk.ResolutionTypeHint.STRING));
    this.attrDbClusterResourceId = cdk.Token.asString(this.getAtt("DBClusterResourceId", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = this.getAtt("Endpoint");
    this.attrEndpointAddress = cdk.Token.asString(this.getAtt("Endpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointPort = cdk.Token.asString(this.getAtt("Endpoint.Port", cdk.ResolutionTypeHint.STRING));
    this.attrMasterUserSecretSecretArn = cdk.Token.asString(this.getAtt("MasterUserSecret.SecretArn", cdk.ResolutionTypeHint.STRING));
    this.attrReadEndpoint = this.getAtt("ReadEndpoint");
    this.attrReadEndpointAddress = cdk.Token.asString(this.getAtt("ReadEndpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.allocatedStorage = props.allocatedStorage;
    this.associatedRoles = props.associatedRoles;
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.availabilityZones = props.availabilityZones;
    this.backtrackWindow = props.backtrackWindow;
    this.backupRetentionPeriod = props.backupRetentionPeriod;
    this.copyTagsToSnapshot = props.copyTagsToSnapshot;
    this.databaseName = props.databaseName;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbClusterInstanceClass = props.dbClusterInstanceClass;
    this.dbClusterParameterGroupName = props.dbClusterParameterGroupName;
    this.dbInstanceParameterGroupName = props.dbInstanceParameterGroupName;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.dbSystemId = props.dbSystemId;
    this.deletionProtection = props.deletionProtection;
    this.domain = props.domain;
    this.domainIamRoleName = props.domainIamRoleName;
    this.enableCloudwatchLogsExports = props.enableCloudwatchLogsExports;
    this.enableGlobalWriteForwarding = props.enableGlobalWriteForwarding;
    this.enableHttpEndpoint = props.enableHttpEndpoint;
    this.enableIamDatabaseAuthentication = props.enableIamDatabaseAuthentication;
    this.engine = props.engine;
    this.engineMode = props.engineMode;
    this.engineVersion = props.engineVersion;
    this.globalClusterIdentifier = props.globalClusterIdentifier;
    this.iops = props.iops;
    this.kmsKeyId = props.kmsKeyId;
    this.manageMasterUserPassword = props.manageMasterUserPassword;
    this.masterUsername = props.masterUsername;
    this.masterUserPassword = props.masterUserPassword;
    this.masterUserSecret = props.masterUserSecret;
    this.monitoringInterval = props.monitoringInterval;
    this.monitoringRoleArn = props.monitoringRoleArn;
    this.networkType = props.networkType;
    this.performanceInsightsEnabled = props.performanceInsightsEnabled;
    this.performanceInsightsKmsKeyId = props.performanceInsightsKmsKeyId;
    this.performanceInsightsRetentionPeriod = props.performanceInsightsRetentionPeriod;
    this.port = props.port;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.publiclyAccessible = props.publiclyAccessible;
    this.replicationSourceIdentifier = props.replicationSourceIdentifier;
    this.restoreToTime = props.restoreToTime;
    this.restoreType = props.restoreType;
    this.scalingConfiguration = props.scalingConfiguration;
    this.serverlessV2ScalingConfiguration = props.serverlessV2ScalingConfiguration;
    this.snapshotIdentifier = props.snapshotIdentifier;
    this.sourceDbClusterIdentifier = props.sourceDbClusterIdentifier;
    this.sourceRegion = props.sourceRegion;
    this.storageEncrypted = props.storageEncrypted;
    this.storageType = props.storageType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBCluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.useLatestRestorableTime = props.useLatestRestorableTime;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::RDS::DBCluster' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allocatedStorage": this.allocatedStorage,
      "associatedRoles": this.associatedRoles,
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "availabilityZones": this.availabilityZones,
      "backtrackWindow": this.backtrackWindow,
      "backupRetentionPeriod": this.backupRetentionPeriod,
      "copyTagsToSnapshot": this.copyTagsToSnapshot,
      "databaseName": this.databaseName,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbClusterInstanceClass": this.dbClusterInstanceClass,
      "dbClusterParameterGroupName": this.dbClusterParameterGroupName,
      "dbInstanceParameterGroupName": this.dbInstanceParameterGroupName,
      "dbSubnetGroupName": this.dbSubnetGroupName,
      "dbSystemId": this.dbSystemId,
      "deletionProtection": this.deletionProtection,
      "domain": this.domain,
      "domainIamRoleName": this.domainIamRoleName,
      "enableCloudwatchLogsExports": this.enableCloudwatchLogsExports,
      "enableGlobalWriteForwarding": this.enableGlobalWriteForwarding,
      "enableHttpEndpoint": this.enableHttpEndpoint,
      "enableIamDatabaseAuthentication": this.enableIamDatabaseAuthentication,
      "engine": this.engine,
      "engineMode": this.engineMode,
      "engineVersion": this.engineVersion,
      "globalClusterIdentifier": this.globalClusterIdentifier,
      "iops": this.iops,
      "kmsKeyId": this.kmsKeyId,
      "manageMasterUserPassword": this.manageMasterUserPassword,
      "masterUsername": this.masterUsername,
      "masterUserPassword": this.masterUserPassword,
      "masterUserSecret": this.masterUserSecret,
      "monitoringInterval": this.monitoringInterval,
      "monitoringRoleArn": this.monitoringRoleArn,
      "networkType": this.networkType,
      "performanceInsightsEnabled": this.performanceInsightsEnabled,
      "performanceInsightsKmsKeyId": this.performanceInsightsKmsKeyId,
      "performanceInsightsRetentionPeriod": this.performanceInsightsRetentionPeriod,
      "port": this.port,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "publiclyAccessible": this.publiclyAccessible,
      "replicationSourceIdentifier": this.replicationSourceIdentifier,
      "restoreToTime": this.restoreToTime,
      "restoreType": this.restoreType,
      "scalingConfiguration": this.scalingConfiguration,
      "serverlessV2ScalingConfiguration": this.serverlessV2ScalingConfiguration,
      "snapshotIdentifier": this.snapshotIdentifier,
      "sourceDbClusterIdentifier": this.sourceDbClusterIdentifier,
      "sourceRegion": this.sourceRegion,
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

export namespace CfnDBCluster {
  /**
   * The `ServerlessV2ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless V2 DB cluster.
   *
   * For more information, see [Using Amazon Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html) in the *Amazon Aurora User Guide* .
   *
   * If you have an Aurora cluster, you must set the `ScalingConfigurationInfo` attribute before you add a DB instance that uses the `db.serverless` DB instance class. For more information, see [Clusters that use Aurora Serverless v2 must have a capacity range specified](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.requirements.html#aurora-serverless-v2.requirements.capacity-range) in the *Amazon Aurora User Guide* .
   *
   * This property is only supported for Aurora Serverless v2. For Aurora Serverless v1, use `ScalingConfiguration` property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-serverlessv2scalingconfiguration.html
   */
  export interface ServerlessV2ScalingConfigurationProperty {
    /**
     * The maximum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster.
     *
     * You can specify ACU values in half-step increments, such as 40, 40.5, 41, and so on. The largest value that you can use is 128.
     *
     * The maximum capacity must be higher than 0.5 ACUs. For more information, see [Choosing the maximum Aurora Serverless v2 capacity setting for a cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2.max_capacity_considerations) in the *Amazon Aurora User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-serverlessv2scalingconfiguration.html#cfn-rds-dbcluster-serverlessv2scalingconfiguration-maxcapacity
     */
    readonly maxCapacity?: number;

    /**
     * The minimum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster.
     *
     * You can specify ACU values in half-step increments, such as 8, 8.5, 9, and so on. The smallest value that you can use is 0.5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-serverlessv2scalingconfiguration.html#cfn-rds-dbcluster-serverlessv2scalingconfiguration-mincapacity
     */
    readonly minCapacity?: number;
  }

  /**
   * The `MasterUserSecret` return value specifies the secret managed by RDS in AWS Secrets Manager for the master user password.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide* and [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-secrets-manager.html) in the *Amazon Aurora User Guide.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html
   */
  export interface MasterUserSecretProperty {
    /**
     * The AWS KMS key identifier that is used to encrypt the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html#cfn-rds-dbcluster-masterusersecret-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The Amazon Resource Name (ARN) of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html#cfn-rds-dbcluster-masterusersecret-secretarn
     */
    readonly secretArn?: string;
  }

  /**
   * The `ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless DB cluster.
   *
   * For more information, see [Using Amazon Aurora Serverless](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html) in the *Amazon Aurora User Guide* .
   *
   * This property is only supported for Aurora Serverless v1. For Aurora Serverless v2, use `ServerlessV2ScalingConfiguration` property.
   *
   * Valid for: Aurora DB clusters only
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html
   */
  export interface ScalingConfigurationProperty {
    /**
     * Indicates whether to allow or disallow automatic pause for an Aurora DB cluster in `serverless` DB engine mode.
     *
     * A DB cluster can be paused only when it's idle (it has no connections).
     *
     * > If a DB cluster is paused for more than seven days, the DB cluster might be backed up with a snapshot. In this case, the DB cluster is restored when there is a request to connect to it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-autopause
     */
    readonly autoPause?: boolean | cdk.IResolvable;

    /**
     * The maximum capacity for an Aurora DB cluster in `serverless` DB engine mode.
     *
     * For Aurora MySQL, valid capacity values are `1` , `2` , `4` , `8` , `16` , `32` , `64` , `128` , and `256` .
     *
     * For Aurora PostgreSQL, valid capacity values are `2` , `4` , `8` , `16` , `32` , `64` , `192` , and `384` .
     *
     * The maximum capacity must be greater than or equal to the minimum capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-maxcapacity
     */
    readonly maxCapacity?: number;

    /**
     * The minimum capacity for an Aurora DB cluster in `serverless` DB engine mode.
     *
     * For Aurora MySQL, valid capacity values are `1` , `2` , `4` , `8` , `16` , `32` , `64` , `128` , and `256` .
     *
     * For Aurora PostgreSQL, valid capacity values are `2` , `4` , `8` , `16` , `32` , `64` , `192` , and `384` .
     *
     * The minimum capacity must be less than or equal to the maximum capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-mincapacity
     */
    readonly minCapacity?: number;

    /**
     * The amount of time, in seconds, that Aurora Serverless v1 tries to find a scaling point to perform seamless scaling before enforcing the timeout action.
     *
     * The default is 300.
     *
     * Specify a value between 60 and 600 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-secondsbeforetimeout
     */
    readonly secondsBeforeTimeout?: number;

    /**
     * The time, in seconds, before an Aurora DB cluster in `serverless` mode is paused.
     *
     * Specify a value between 300 and 86,400 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-secondsuntilautopause
     */
    readonly secondsUntilAutoPause?: number;

    /**
     * The action to take when the timeout is reached, either `ForceApplyCapacityChange` or `RollbackCapacityChange` .
     *
     * `ForceApplyCapacityChange` sets the capacity to the specified value as soon as possible.
     *
     * `RollbackCapacityChange` , the default, ignores the capacity change if a scaling point isn't found in the timeout period.
     *
     * > If you specify `ForceApplyCapacityChange` , connections that prevent Aurora Serverless v1 from finding a scaling point might be dropped.
     *
     * For more information, see [Autoscaling for Aurora Serverless v1](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html#aurora-serverless.how-it-works.auto-scaling) in the *Amazon Aurora User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-scalingconfiguration.html#cfn-rds-dbcluster-scalingconfiguration-timeoutaction
     */
    readonly timeoutAction?: string;
  }

  /**
   * Describes an AWS Identity and Access Management (IAM) role that is associated with a DB cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-dbclusterrole.html
   */
  export interface DBClusterRoleProperty {
    /**
     * The name of the feature associated with the AWS Identity and Access Management (IAM) role.
     *
     * IAM roles that are associated with a DB cluster grant permission for the DB cluster to access other AWS services on your behalf. For the list of supported feature names, see the `SupportedFeatureNames` description in [DBEngineVersion](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DBEngineVersion.html) in the *Amazon RDS API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-dbclusterrole.html#cfn-rds-dbcluster-dbclusterrole-featurename
     */
    readonly featureName?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that is associated with the DB cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-dbclusterrole.html#cfn-rds-dbcluster-dbclusterrole-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * The `Endpoint` return value specifies the connection endpoint for the primary instance of the DB cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-endpoint.html
   */
  export interface EndpointProperty {
    /**
     * Specifies the connection endpoint for the primary instance of the DB cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-endpoint.html#cfn-rds-dbcluster-endpoint-address
     */
    readonly address?: string;

    /**
     * Specifies the port that the database engine is listening on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-endpoint.html#cfn-rds-dbcluster-endpoint-port
     */
    readonly port?: string;
  }

  /**
   * The `ReadEndpoint` return value specifies the reader endpoint for the DB cluster.
   *
   * The reader endpoint for a DB cluster load-balances connections across the Aurora Replicas that are available in a DB cluster. As clients request new connections to the reader endpoint, Aurora distributes the connection requests among the Aurora Replicas in the DB cluster. This functionality can help balance your read workload across multiple Aurora Replicas in your DB cluster.
   *
   * If a failover occurs, and the Aurora Replica that you are connected to is promoted to be the primary instance, your connection is dropped. To continue sending your read workload to other Aurora Replicas in the cluster, you can then reconnect to the reader endpoint.
   *
   * For more information about Aurora endpoints, see [Amazon Aurora connection management](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html) in the *Amazon Aurora User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-readendpoint.html
   */
  export interface ReadEndpointProperty {
    /**
     * The host address of the reader endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-readendpoint.html#cfn-rds-dbcluster-readendpoint-address
     */
    readonly address?: string;
  }
}

/**
 * Properties for defining a `CfnDBCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html
 */
export interface CfnDBClusterProps {
  /**
   * The amount of storage in gibibytes (GiB) to allocate to each DB instance in the Multi-AZ DB cluster.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * This setting is required to create a Multi-AZ DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-allocatedstorage
   */
  readonly allocatedStorage?: number;

  /**
   * Provides a list of the AWS Identity and Access Management (IAM) roles that are associated with the DB cluster.
   *
   * IAM roles that are associated with a DB cluster grant permission for the DB cluster to access other Amazon Web Services on your behalf.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-associatedroles
   */
  readonly associatedRoles?: Array<CfnDBCluster.DBClusterRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether minor engine upgrades are applied automatically to the DB cluster during the maintenance window.
   *
   * By default, minor engine upgrades are applied automatically.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * A list of Availability Zones (AZs) where instances in the DB cluster can be created.
   *
   * For information on AWS Regions and Availability Zones, see [Choosing the Regions and Availability Zones](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.RegionsAndAvailabilityZones.html) in the *Amazon Aurora User Guide* .
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * The target backtrack window, in seconds. To disable backtracking, set this value to 0.
   *
   * > Currently, Backtrack is only supported for Aurora MySQL DB clusters.
   *
   * Default: 0
   *
   * Constraints:
   *
   * - If specified, this value must be set to a number from 0 to 259,200 (72 hours).
   *
   * Valid for: Aurora MySQL DB clusters only
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-backtrackwindow
   */
  readonly backtrackWindow?: number;

  /**
   * The number of days for which automated backups are retained.
   *
   * Default: 1
   *
   * Constraints:
   *
   * - Must be a value from 1 to 35
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @default - 1
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-backupretentionperiod
   */
  readonly backupRetentionPeriod?: number;

  /**
   * A value that indicates whether to copy all tags from the DB cluster to snapshots of the DB cluster.
   *
   * The default is not to copy them.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-copytagstosnapshot
   */
  readonly copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The name of your database.
   *
   * If you don't provide a name, then Amazon RDS won't create a database in this DB cluster. For naming constraints, see [Naming Constraints](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html#RDS_Limits.Constraints) in the *Amazon Aurora User Guide* .
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-databasename
   */
  readonly databaseName?: string;

  /**
   * The DB cluster identifier. This parameter is stored as a lowercase string.
   *
   * Constraints:
   *
   * - Must contain from 1 to 63 letters, numbers, or hyphens.
   * - First character must be a letter.
   * - Can't end with a hyphen or contain two consecutive hyphens.
   *
   * Example: `my-cluster1`
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbclusteridentifier
   */
  readonly dbClusterIdentifier?: string;

  /**
   * The compute and memory capacity of each DB instance in the Multi-AZ DB cluster, for example `db.m6gd.xlarge` . Not all DB instance classes are available in all AWS Regions , or for all database engines.
   *
   * For the full list of DB instance classes and availability for your engine, see [DB instance class](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html) in the *Amazon RDS User Guide* .
   *
   * This setting is required to create a Multi-AZ DB cluster.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbclusterinstanceclass
   */
  readonly dbClusterInstanceClass?: string;

  /**
   * The name of the DB cluster parameter group to associate with this DB cluster.
   *
   * > If you apply a parameter group to an existing DB cluster, then its DB instances might need to reboot. This can result in an outage while the DB instances are rebooting.
   * >
   * > If you apply a change to parameter group associated with a stopped DB cluster, then the update stack waits until the DB cluster is started.
   *
   * To list all of the available DB cluster parameter group names, use the following command:
   *
   * `aws rds describe-db-cluster-parameter-groups --query "DBClusterParameterGroups[].DBClusterParameterGroupName" --output text`
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @default - "default.aurora5.6"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbclusterparametergroupname
   */
  readonly dbClusterParameterGroupName?: string;

  /**
   * The name of the DB parameter group to apply to all instances of the DB cluster.
   *
   * > When you apply a parameter group using the `DBInstanceParameterGroupName` parameter, the DB cluster isn't rebooted automatically. Also, parameter changes are applied immediately rather than during the next maintenance window.
   *
   * Default: The existing name setting
   *
   * Constraints:
   *
   * - The DB parameter group must be in the same DB parameter group family as this DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbinstanceparametergroupname
   */
  readonly dbInstanceParameterGroupName?: string;

  /**
   * A DB subnet group that you want to associate with this DB cluster.
   *
   * If you are restoring a DB cluster to a point in time with `RestoreType` set to `copy-on-write` , and don't specify a DB subnet group name, then the DB cluster is restored with a default DB subnet group.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * Reserved for future use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-dbsystemid
   */
  readonly dbSystemId?: string;

  /**
   * A value that indicates whether the DB cluster has deletion protection enabled.
   *
   * The database can't be deleted when deletion protection is enabled. By default, deletion protection is disabled.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Indicates the directory ID of the Active Directory to create the DB cluster.
   *
   * For Amazon Aurora DB clusters, Amazon RDS can use Kerberos authentication to authenticate users that connect to the DB cluster.
   *
   * For more information, see [Kerberos authentication](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/kerberos-authentication.html) in the *Amazon Aurora User Guide* .
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-domain
   */
  readonly domain?: string;

  /**
   * Specifies the name of the IAM role to use when making API calls to the Directory Service.
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-domainiamrolename
   */
  readonly domainIamRoleName?: string;

  /**
   * The list of log types that need to be enabled for exporting to CloudWatch Logs.
   *
   * The values in the list depend on the DB engine being used. For more information, see [Publishing Database Logs to Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_LogAccess.html#USER_LogAccess.Procedural.UploadtoCloudWatch) in the *Amazon Aurora User Guide* .
   *
   * *Aurora MySQL*
   *
   * Valid values: `audit` , `error` , `general` , `slowquery`
   *
   * *Aurora PostgreSQL*
   *
   * Valid values: `postgresql`
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-enablecloudwatchlogsexports
   */
  readonly enableCloudwatchLogsExports?: Array<string>;

  /**
   * Specifies whether to enable this DB cluster to forward write operations to the primary cluster of a global cluster (Aurora global database).
   *
   * By default, write operations are not allowed on Aurora DB clusters that are secondary clusters in an Aurora global database.
   *
   * You can set this value only on Aurora DB clusters that are members of an Aurora global database. With this parameter enabled, a secondary cluster can forward writes to the current primary cluster, and the resulting changes are replicated back to this cluster. For the primary DB cluster of an Aurora global database, this value is used immediately if the primary is demoted by a global cluster API operation, but it does nothing until then.
   *
   * Valid for Cluster Type: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-enableglobalwriteforwarding
   */
  readonly enableGlobalWriteForwarding?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to enable the HTTP endpoint for an Aurora Serverless DB cluster.
   *
   * By default, the HTTP endpoint is disabled.
   *
   * When enabled, the HTTP endpoint provides a connectionless web service API for running SQL queries on the Aurora Serverless DB cluster. You can also query your database from inside the RDS console with the query editor.
   *
   * For more information, see [Using the Data API for Aurora Serverless](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) in the *Amazon Aurora User Guide* .
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-enablehttpendpoint
   */
  readonly enableHttpEndpoint?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to enable mapping of AWS Identity and Access Management (IAM) accounts to database accounts.
   *
   * By default, mapping is disabled.
   *
   * For more information, see [IAM Database Authentication](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.IAMDBAuth.html) in the *Amazon Aurora User Guide.*
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-enableiamdatabaseauthentication
   */
  readonly enableIamDatabaseAuthentication?: boolean | cdk.IResolvable;

  /**
   * The name of the database engine to be used for this DB cluster.
   *
   * Valid Values:
   *
   * - `aurora-mysql`
   * - `aurora-postgresql`
   * - `mysql`
   * - `postgres`
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-engine
   */
  readonly engine?: string;

  /**
   * The DB engine mode of the DB cluster, either `provisioned` or `serverless` .
   *
   * The `serverless` engine mode only supports Aurora Serverless v1.
   *
   * Limitations and requirements apply to some DB engine modes. For more information, see the following sections in the *Amazon Aurora User Guide* :
   *
   * - [Limitations of Aurora Serverless v1](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html#aurora-serverless.limitations)
   * - [Requirements for Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.requirements.html)
   * - [Limitations of parallel query](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-mysql-parallel-query.html#aurora-mysql-parallel-query-limitations)
   * - [Limitations of Aurora global databases](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html#aurora-global-database.limitations)
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-enginemode
   */
  readonly engineMode?: string;

  /**
   * The version number of the database engine to use.
   *
   * To list all of the available engine versions for Aurora MySQL version 2 (5.7-compatible) and version 3 (8.0-compatible), use the following command:
   *
   * `aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[].EngineVersion"`
   *
   * You can supply either `5.7` or `8.0` to use the default engine version for Aurora MySQL version 2 or version 3, respectively.
   *
   * To list all of the available engine versions for Aurora PostgreSQL, use the following command:
   *
   * `aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[].EngineVersion"`
   *
   * To list all of the available engine versions for RDS for MySQL, use the following command:
   *
   * `aws rds describe-db-engine-versions --engine mysql --query "DBEngineVersions[].EngineVersion"`
   *
   * To list all of the available engine versions for RDS for PostgreSQL, use the following command:
   *
   * `aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[].EngineVersion"`
   *
   * *Aurora MySQL*
   *
   * For information, see [Database engine updates for Amazon Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Updates.html) in the *Amazon Aurora User Guide* .
   *
   * *Aurora PostgreSQL*
   *
   * For information, see [Amazon Aurora PostgreSQL releases and engine versions](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Updates.20180305.html) in the *Amazon Aurora User Guide* .
   *
   * *MySQL*
   *
   * For information, see [Amazon RDS for MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html#MySQL.Concepts.VersionMgmt) in the *Amazon RDS User Guide* .
   *
   * *PostgreSQL*
   *
   * For information, see [Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts) in the *Amazon RDS User Guide* .
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-engineversion
   */
  readonly engineVersion?: string;

  /**
   * If you are configuring an Aurora global database cluster and want your Aurora DB cluster to be a secondary member in the global database cluster, specify the global cluster ID of the global database cluster.
   *
   * To define the primary database cluster of the global cluster, use the [AWS::RDS::GlobalCluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html) resource.
   *
   * If you aren't configuring a global database cluster, don't specify this property.
   *
   * > To remove the DB cluster from a global database cluster, specify an empty value for the `GlobalClusterIdentifier` property.
   *
   * For information about Aurora global databases, see [Working with Amazon Aurora Global Databases](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html) in the *Amazon Aurora User Guide* .
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-globalclusteridentifier
   */
  readonly globalClusterIdentifier?: string;

  /**
   * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster.
   *
   * For information about valid IOPS values, see [Provisioned IOPS storage](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#USER_PIOPS) in the *Amazon RDS User Guide* .
   *
   * This setting is required to create a Multi-AZ DB cluster.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * Constraints:
   *
   * - Must be a multiple between .5 and 50 of the storage amount for the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-iops
   */
  readonly iops?: number;

  /**
   * The Amazon Resource Name (ARN) of the AWS KMS key that is used to encrypt the database instances in the DB cluster, such as `arn:aws:kms:us-east-1:012345678910:key/abcd1234-a123-456a-a12b-a123b4cd56ef` .
   *
   * If you enable the `StorageEncrypted` property but don't specify this property, the default KMS key is used. If you specify this property, you must set the `StorageEncrypted` property to `true` .
   *
   * If you specify the `SnapshotIdentifier` property, the `StorageEncrypted` property value is inherited from the snapshot, and if the DB cluster is encrypted, the specified `KmsKeyId` property is used.
   *
   * If you create a read replica of an encrypted DB cluster in another AWS Region, make sure to set `KmsKeyId` to a KMS key identifier that is valid in the destination AWS Region. This KMS key is used to encrypt the read replica in that AWS Region.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies whether to manage the master user password with AWS Secrets Manager.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide* and [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-secrets-manager.html) in the *Amazon Aurora User Guide.*
   *
   * Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
   *
   * Constraints:
   *
   * - Can't manage the master user password with AWS Secrets Manager if `MasterUserPassword` is specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-managemasteruserpassword
   */
  readonly manageMasterUserPassword?: boolean | cdk.IResolvable;

  /**
   * The name of the master user for the DB cluster.
   *
   * > If you specify the `SourceDBClusterIdentifier` , `SnapshotIdentifier` , or `GlobalClusterIdentifier` property, don't specify this property. The value is inherited from the source DB cluster, the snapshot, or the primary DB cluster for the global database cluster, respectively.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-masterusername
   */
  readonly masterUsername?: string;

  /**
   * The master password for the DB instance.
   *
   * > If you specify the `SourceDBClusterIdentifier` , `SnapshotIdentifier` , or `GlobalClusterIdentifier` property, don't specify this property. The value is inherited from the source DB cluster, the snapshot, or the primary DB cluster for the global database cluster, respectively.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-masteruserpassword
   */
  readonly masterUserPassword?: string;

  /**
   * The secret managed by RDS in AWS Secrets Manager for the master user password.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide* and [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-secrets-manager.html) in the *Amazon Aurora User Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-masterusersecret
   */
  readonly masterUserSecret?: cdk.IResolvable | CfnDBCluster.MasterUserSecretProperty;

  /**
   * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster.
   *
   * To turn off collecting Enhanced Monitoring metrics, specify `0` .
   *
   * If `MonitoringRoleArn` is specified, also set `MonitoringInterval` to a value other than `0` .
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * Valid Values: `0 | 1 | 5 | 10 | 15 | 30 | 60`
   *
   * Default: `0`
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-monitoringinterval
   */
  readonly monitoringInterval?: number;

  /**
   * The Amazon Resource Name (ARN) for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs.
   *
   * An example is `arn:aws:iam:123456789012:role/emaccess` . For information on creating a monitoring role, see [Setting up and enabling Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html#USER_Monitoring.OS.Enabling) in the *Amazon RDS User Guide* .
   *
   * If `MonitoringInterval` is set to a value other than `0` , supply a `MonitoringRoleArn` value.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-monitoringrolearn
   */
  readonly monitoringRoleArn?: string;

  /**
   * The network type of the DB cluster.
   *
   * Valid values:
   *
   * - `IPV4`
   * - `DUAL`
   *
   * The network type is determined by the `DBSubnetGroup` specified for the DB cluster. A `DBSubnetGroup` can support only the IPv4 protocol or the IPv4 and IPv6 protocols ( `DUAL` ).
   *
   * For more information, see [Working with a DB instance in a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html) in the *Amazon Aurora User Guide.*
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-networktype
   */
  readonly networkType?: string;

  /**
   * Specifies whether to turn on Performance Insights for the DB cluster.
   *
   * For more information, see [Using Amazon Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html) in the *Amazon RDS User Guide* .
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-performanceinsightsenabled
   */
  readonly performanceInsightsEnabled?: boolean | cdk.IResolvable;

  /**
   * The AWS KMS key identifier for encryption of Performance Insights data.
   *
   * The AWS KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
   *
   * If you don't specify a value for `PerformanceInsightsKMSKeyId` , then Amazon RDS uses your default KMS key. There is a default KMS key for your AWS account . Your AWS account has a different default KMS key for each AWS Region .
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-performanceinsightskmskeyid
   */
  readonly performanceInsightsKmsKeyId?: string;

  /**
   * The number of days to retain Performance Insights data.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * Valid Values:
   *
   * - `7`
   * - *month* * 31, where *month* is a number of months from 1-23. Examples: `93` (3 months * 31), `341` (11 months * 31), `589` (19 months * 31)
   * - `731`
   *
   * Default: `7` days
   *
   * If you specify a retention period that isn't valid, such as `94` , Amazon RDS issues an error.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-performanceinsightsretentionperiod
   */
  readonly performanceInsightsRetentionPeriod?: number;

  /**
   * The port number on which the DB instances in the DB cluster accept connections.
   *
   * Default:
   *
   * - When `EngineMode` is `provisioned` , `3306` (for both Aurora MySQL and Aurora PostgreSQL)
   * - When `EngineMode` is `serverless` :
   *
   * - `3306` when `Engine` is `aurora` or `aurora-mysql`
   * - `5432` when `Engine` is `aurora-postgresql`
   *
   * > The `No interruption` on update behavior only applies to DB clusters. If you are updating a DB instance, see [Port](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-port) for the AWS::RDS::DBInstance resource.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-port
   */
  readonly port?: number;

  /**
   * The daily time range during which automated backups are created.
   *
   * For more information, see [Backup Window](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html#Aurora.Managing.Backups.BackupWindow) in the *Amazon Aurora User Guide.*
   *
   * Constraints:
   *
   * - Must be in the format `hh24:mi-hh24:mi` .
   * - Must be in Universal Coordinated Time (UTC).
   * - Must not conflict with the preferred maintenance window.
   * - Must be at least 30 minutes.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   *
   * The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region, occurring on a random day of the week. To see the time blocks available, see [Adjusting the Preferred DB Cluster Maintenance Window](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_UpgradeDBInstance.Maintenance.html#AdjustingTheMaintenanceWindow.Aurora) in the *Amazon Aurora User Guide.*
   *
   * Valid Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
   *
   * Constraints: Minimum 30-minute window.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * Specifies whether the DB cluster is publicly accessible.
   *
   * When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it.
   *
   * When the DB cluster isn't publicly accessible, it is an internal DB cluster with a DNS name that resolves to a private IP address.
   *
   * Valid for Cluster Type: Multi-AZ DB clusters only
   *
   * Default: The default behavior varies depending on whether `DBSubnetGroupName` is specified.
   *
   * If `DBSubnetGroupName` isn't specified, and `PubliclyAccessible` isn't specified, the following applies:
   *
   * - If the default VPC in the target Region doesn’t have an internet gateway attached to it, the DB cluster is private.
   * - If the default VPC in the target Region has an internet gateway attached to it, the DB cluster is public.
   *
   * If `DBSubnetGroupName` is specified, and `PubliclyAccessible` isn't specified, the following applies:
   *
   * - If the subnets are part of a VPC that doesn’t have an internet gateway attached to it, the DB cluster is private.
   * - If the subnets are part of a VPC that has an internet gateway attached to it, the DB cluster is public.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the source DB instance or DB cluster if this DB cluster is created as a read replica.
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-replicationsourceidentifier
   */
  readonly replicationSourceIdentifier?: string;

  /**
   * The date and time to restore the DB cluster to.
   *
   * Valid Values: Value must be a time in Universal Coordinated Time (UTC) format
   *
   * Constraints:
   *
   * - Must be before the latest restorable time for the DB instance
   * - Must be specified if `UseLatestRestorableTime` parameter isn't provided
   * - Can't be specified if the `UseLatestRestorableTime` parameter is enabled
   * - Can't be specified if the `RestoreType` parameter is `copy-on-write`
   *
   * This property must be used with `SourceDBClusterIdentifier` property. The resulting cluster will have the identifier that matches the value of the `DBclusterIdentifier` property.
   *
   * Example: `2015-03-07T23:45:00Z`
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-restoretotime
   */
  readonly restoreToTime?: string;

  /**
   * The type of restore to be performed. You can specify one of the following values:.
   *
   * - `full-copy` - The new DB cluster is restored as a full copy of the source DB cluster.
   * - `copy-on-write` - The new DB cluster is restored as a clone of the source DB cluster.
   *
   * If you don't specify a `RestoreType` value, then the new DB cluster is restored as a full copy of the source DB cluster.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @default - "full-copy"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-restoretype
   */
  readonly restoreType?: string;

  /**
   * The `ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless DB cluster.
   *
   * This property is only supported for Aurora Serverless v1. For Aurora Serverless v2, use `ServerlessV2ScalingConfiguration` property.
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-scalingconfiguration
   */
  readonly scalingConfiguration?: cdk.IResolvable | CfnDBCluster.ScalingConfigurationProperty;

  /**
   * The `ServerlessV2ScalingConfiguration` property type specifies the scaling configuration of an Aurora Serverless V2 DB cluster.
   *
   * This property is only supported for Aurora Serverless v2. For Aurora Serverless v1, use `ScalingConfiguration` property.
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-serverlessv2scalingconfiguration
   */
  readonly serverlessV2ScalingConfiguration?: cdk.IResolvable | CfnDBCluster.ServerlessV2ScalingConfigurationProperty;

  /**
   * The identifier for the DB snapshot or DB cluster snapshot to restore from.
   *
   * You can use either the name or the Amazon Resource Name (ARN) to specify a DB cluster snapshot. However, you can use only the ARN to specify a DB snapshot.
   *
   * After you restore a DB cluster with a `SnapshotIdentifier` property, you must specify the same `SnapshotIdentifier` property for any future updates to the DB cluster. When you specify this property for an update, the DB cluster is not restored from the snapshot again, and the data in the database is not changed. However, if you don't specify the `SnapshotIdentifier` property, an empty DB cluster is created, and the original DB cluster is deleted. If you specify a property that is different from the previous snapshot restore property, a new DB cluster is restored from the specified `SnapshotIdentifier` property, and the original DB cluster is deleted.
   *
   * If you specify the `SnapshotIdentifier` property to restore a DB cluster (as opposed to specifying it for DB cluster updates), then don't specify the following properties:
   *
   * - `GlobalClusterIdentifier`
   * - `MasterUsername`
   * - `MasterUserPassword`
   * - `ReplicationSourceIdentifier`
   * - `RestoreType`
   * - `SourceDBClusterIdentifier`
   * - `SourceRegion`
   * - `StorageEncrypted` (for an encrypted snapshot)
   * - `UseLatestRestorableTime`
   *
   * Constraints:
   *
   * - Must match the identifier of an existing Snapshot.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-snapshotidentifier
   */
  readonly snapshotIdentifier?: string;

  /**
   * When restoring a DB cluster to a point in time, the identifier of the source DB cluster from which to restore.
   *
   * Constraints:
   *
   * - Must match the identifier of an existing DBCluster.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-sourcedbclusteridentifier
   */
  readonly sourceDbClusterIdentifier?: string;

  /**
   * The AWS Region which contains the source DB cluster when replicating a DB cluster. For example, `us-east-1` .
   *
   * Valid for: Aurora DB clusters only
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-sourceregion
   */
  readonly sourceRegion?: string;

  /**
   * Indicates whether the DB cluster is encrypted.
   *
   * If you specify the `KmsKeyId` property, then you must enable encryption.
   *
   * If you specify the `SourceDBClusterIdentifier` property, don't specify this property. The value is inherited from the source DB cluster, and if the DB cluster is encrypted, the specified `KmsKeyId` property is used.
   *
   * If you specify the `SnapshotIdentifier` and the specified snapshot is encrypted, don't specify this property. The value is inherited from the snapshot, and the specified `KmsKeyId` property is used.
   *
   * If you specify the `SnapshotIdentifier` and the specified snapshot isn't encrypted, you can use this property to specify that the restored DB cluster is encrypted. Specify the `KmsKeyId` property for the KMS key to use for encryption. If you don't want the restored DB cluster to be encrypted, then don't set this property or set it to `false` .
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-storageencrypted
   */
  readonly storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * The storage type to associate with the DB cluster.
   *
   * For information on storage types for Aurora DB clusters, see [Storage configurations for Amazon Aurora DB clusters](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html#aurora-storage-type) . For information on storage types for Multi-AZ DB clusters, see [Settings for creating Multi-AZ DB clusters](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/create-multi-az-db-cluster.html#create-multi-az-db-cluster-settings) .
   *
   * This setting is required to create a Multi-AZ DB cluster.
   *
   * When specified for a Multi-AZ DB cluster, a value for the `Iops` parameter is required.
   *
   * Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
   *
   * Valid Values:
   *
   * - Aurora DB clusters - `aurora | aurora-iopt1`
   * - Multi-AZ DB clusters - `io1`
   *
   * Default:
   *
   * - Aurora DB clusters - `aurora`
   * - Multi-AZ DB clusters - `io1`
   *
   * > When you create an Aurora DB cluster with the storage type set to `aurora-iopt1` , the storage type is returned in the response. The storage type isn't returned when you set it to `aurora` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-storagetype
   */
  readonly storageType?: string;

  /**
   * An optional array of key-value pairs to apply to this DB cluster.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A value that indicates whether to restore the DB cluster to the latest restorable backup time.
   *
   * By default, the DB cluster is not restored to the latest restorable backup time.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-uselatestrestorabletime
   */
  readonly useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of EC2 VPC security groups to associate with this DB cluster.
   *
   * If you plan to update the resource, don't specify VPC security groups in a shared VPC.
   *
   * Valid for: Aurora DB clusters and Multi-AZ DB clusters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `ServerlessV2ScalingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerlessV2ScalingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterServerlessV2ScalingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  return errors.wrap("supplied properties not correct for \"ServerlessV2ScalingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterServerlessV2ScalingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterServerlessV2ScalingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity)
  };
}

// @ts-ignore TS6133
function CfnDBClusterServerlessV2ScalingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBCluster.ServerlessV2ScalingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.ServerlessV2ScalingConfigurationProperty>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MasterUserSecretProperty`
 *
 * @param properties - the TypeScript properties of a `MasterUserSecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterMasterUserSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"MasterUserSecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterMasterUserSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterMasterUserSecretPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnDBClusterMasterUserSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBCluster.MasterUserSecretProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.MasterUserSecretProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterScalingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoPause", cdk.validateBoolean)(properties.autoPause));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("secondsBeforeTimeout", cdk.validateNumber)(properties.secondsBeforeTimeout));
  errors.collect(cdk.propertyValidator("secondsUntilAutoPause", cdk.validateNumber)(properties.secondsUntilAutoPause));
  errors.collect(cdk.propertyValidator("timeoutAction", cdk.validateString)(properties.timeoutAction));
  return errors.wrap("supplied properties not correct for \"ScalingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterScalingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterScalingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AutoPause": cdk.booleanToCloudFormation(properties.autoPause),
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity),
    "SecondsBeforeTimeout": cdk.numberToCloudFormation(properties.secondsBeforeTimeout),
    "SecondsUntilAutoPause": cdk.numberToCloudFormation(properties.secondsUntilAutoPause),
    "TimeoutAction": cdk.stringToCloudFormation(properties.timeoutAction)
  };
}

// @ts-ignore TS6133
function CfnDBClusterScalingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBCluster.ScalingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.ScalingConfigurationProperty>();
  ret.addPropertyResult("autoPause", "AutoPause", (properties.AutoPause != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoPause) : undefined));
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addPropertyResult("secondsBeforeTimeout", "SecondsBeforeTimeout", (properties.SecondsBeforeTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SecondsBeforeTimeout) : undefined));
  ret.addPropertyResult("secondsUntilAutoPause", "SecondsUntilAutoPause", (properties.SecondsUntilAutoPause != null ? cfn_parse.FromCloudFormation.getNumber(properties.SecondsUntilAutoPause) : undefined));
  ret.addPropertyResult("timeoutAction", "TimeoutAction", (properties.TimeoutAction != null ? cfn_parse.FromCloudFormation.getString(properties.TimeoutAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
 * Determine whether the given properties match those of a `EndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterEndpointPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnDBClusterEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Port": cdk.stringToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnDBClusterEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBCluster.EndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.EndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReadEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `ReadEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBClusterReadEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  return errors.wrap("supplied properties not correct for \"ReadEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBClusterReadEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBClusterReadEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address)
  };
}

// @ts-ignore TS6133
function CfnDBClusterReadEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBCluster.ReadEndpointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBCluster.ReadEndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
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
  errors.collect(cdk.propertyValidator("allocatedStorage", cdk.validateNumber)(properties.allocatedStorage));
  errors.collect(cdk.propertyValidator("associatedRoles", cdk.listValidator(CfnDBClusterDBClusterRolePropertyValidator))(properties.associatedRoles));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("backtrackWindow", cdk.validateNumber)(properties.backtrackWindow));
  errors.collect(cdk.propertyValidator("backupRetentionPeriod", cdk.validateNumber)(properties.backupRetentionPeriod));
  errors.collect(cdk.propertyValidator("copyTagsToSnapshot", cdk.validateBoolean)(properties.copyTagsToSnapshot));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterInstanceClass", cdk.validateString)(properties.dbClusterInstanceClass));
  errors.collect(cdk.propertyValidator("dbClusterParameterGroupName", cdk.validateString)(properties.dbClusterParameterGroupName));
  errors.collect(cdk.propertyValidator("dbInstanceParameterGroupName", cdk.validateString)(properties.dbInstanceParameterGroupName));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("dbSystemId", cdk.validateString)(properties.dbSystemId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("domainIamRoleName", cdk.validateString)(properties.domainIamRoleName));
  errors.collect(cdk.propertyValidator("enableCloudwatchLogsExports", cdk.listValidator(cdk.validateString))(properties.enableCloudwatchLogsExports));
  errors.collect(cdk.propertyValidator("enableGlobalWriteForwarding", cdk.validateBoolean)(properties.enableGlobalWriteForwarding));
  errors.collect(cdk.propertyValidator("enableHttpEndpoint", cdk.validateBoolean)(properties.enableHttpEndpoint));
  errors.collect(cdk.propertyValidator("enableIamDatabaseAuthentication", cdk.validateBoolean)(properties.enableIamDatabaseAuthentication));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("engineMode", cdk.validateString)(properties.engineMode));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("globalClusterIdentifier", cdk.validateString)(properties.globalClusterIdentifier));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("manageMasterUserPassword", cdk.validateBoolean)(properties.manageMasterUserPassword));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  errors.collect(cdk.propertyValidator("masterUserSecret", CfnDBClusterMasterUserSecretPropertyValidator)(properties.masterUserSecret));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.validateString)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("monitoringInterval", cdk.validateNumber)(properties.monitoringInterval));
  errors.collect(cdk.propertyValidator("monitoringRoleArn", cdk.validateString)(properties.monitoringRoleArn));
  errors.collect(cdk.propertyValidator("networkType", cdk.validateString)(properties.networkType));
  errors.collect(cdk.propertyValidator("performanceInsightsEnabled", cdk.validateBoolean)(properties.performanceInsightsEnabled));
  errors.collect(cdk.propertyValidator("performanceInsightsKmsKeyId", cdk.validateString)(properties.performanceInsightsKmsKeyId));
  errors.collect(cdk.propertyValidator("performanceInsightsRetentionPeriod", cdk.validateNumber)(properties.performanceInsightsRetentionPeriod));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("replicationSourceIdentifier", cdk.validateString)(properties.replicationSourceIdentifier));
  errors.collect(cdk.propertyValidator("restoreToTime", cdk.validateString)(properties.restoreToTime));
  errors.collect(cdk.propertyValidator("restoreType", cdk.validateString)(properties.restoreType));
  errors.collect(cdk.propertyValidator("scalingConfiguration", CfnDBClusterScalingConfigurationPropertyValidator)(properties.scalingConfiguration));
  errors.collect(cdk.propertyValidator("serverlessV2ScalingConfiguration", CfnDBClusterServerlessV2ScalingConfigurationPropertyValidator)(properties.serverlessV2ScalingConfiguration));
  errors.collect(cdk.propertyValidator("snapshotIdentifier", cdk.validateString)(properties.snapshotIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbClusterIdentifier", cdk.validateString)(properties.sourceDbClusterIdentifier));
  errors.collect(cdk.propertyValidator("sourceRegion", cdk.validateString)(properties.sourceRegion));
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
    "AllocatedStorage": cdk.numberToCloudFormation(properties.allocatedStorage),
    "AssociatedRoles": cdk.listMapper(convertCfnDBClusterDBClusterRolePropertyToCloudFormation)(properties.associatedRoles),
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "BacktrackWindow": cdk.numberToCloudFormation(properties.backtrackWindow),
    "BackupRetentionPeriod": cdk.numberToCloudFormation(properties.backupRetentionPeriod),
    "CopyTagsToSnapshot": cdk.booleanToCloudFormation(properties.copyTagsToSnapshot),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBClusterInstanceClass": cdk.stringToCloudFormation(properties.dbClusterInstanceClass),
    "DBClusterParameterGroupName": cdk.stringToCloudFormation(properties.dbClusterParameterGroupName),
    "DBInstanceParameterGroupName": cdk.stringToCloudFormation(properties.dbInstanceParameterGroupName),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "DBSystemId": cdk.stringToCloudFormation(properties.dbSystemId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "DomainIAMRoleName": cdk.stringToCloudFormation(properties.domainIamRoleName),
    "EnableCloudwatchLogsExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.enableCloudwatchLogsExports),
    "EnableGlobalWriteForwarding": cdk.booleanToCloudFormation(properties.enableGlobalWriteForwarding),
    "EnableHttpEndpoint": cdk.booleanToCloudFormation(properties.enableHttpEndpoint),
    "EnableIAMDatabaseAuthentication": cdk.booleanToCloudFormation(properties.enableIamDatabaseAuthentication),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "EngineMode": cdk.stringToCloudFormation(properties.engineMode),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "GlobalClusterIdentifier": cdk.stringToCloudFormation(properties.globalClusterIdentifier),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "ManageMasterUserPassword": cdk.booleanToCloudFormation(properties.manageMasterUserPassword),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword),
    "MasterUserSecret": convertCfnDBClusterMasterUserSecretPropertyToCloudFormation(properties.masterUserSecret),
    "MasterUsername": cdk.stringToCloudFormation(properties.masterUsername),
    "MonitoringInterval": cdk.numberToCloudFormation(properties.monitoringInterval),
    "MonitoringRoleArn": cdk.stringToCloudFormation(properties.monitoringRoleArn),
    "NetworkType": cdk.stringToCloudFormation(properties.networkType),
    "PerformanceInsightsEnabled": cdk.booleanToCloudFormation(properties.performanceInsightsEnabled),
    "PerformanceInsightsKmsKeyId": cdk.stringToCloudFormation(properties.performanceInsightsKmsKeyId),
    "PerformanceInsightsRetentionPeriod": cdk.numberToCloudFormation(properties.performanceInsightsRetentionPeriod),
    "Port": cdk.numberToCloudFormation(properties.port),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "ReplicationSourceIdentifier": cdk.stringToCloudFormation(properties.replicationSourceIdentifier),
    "RestoreToTime": cdk.stringToCloudFormation(properties.restoreToTime),
    "RestoreType": cdk.stringToCloudFormation(properties.restoreType),
    "ScalingConfiguration": convertCfnDBClusterScalingConfigurationPropertyToCloudFormation(properties.scalingConfiguration),
    "ServerlessV2ScalingConfiguration": convertCfnDBClusterServerlessV2ScalingConfigurationPropertyToCloudFormation(properties.serverlessV2ScalingConfiguration),
    "SnapshotIdentifier": cdk.stringToCloudFormation(properties.snapshotIdentifier),
    "SourceDBClusterIdentifier": cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
    "SourceRegion": cdk.stringToCloudFormation(properties.sourceRegion),
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
  ret.addPropertyResult("allocatedStorage", "AllocatedStorage", (properties.AllocatedStorage != null ? cfn_parse.FromCloudFormation.getNumber(properties.AllocatedStorage) : undefined));
  ret.addPropertyResult("associatedRoles", "AssociatedRoles", (properties.AssociatedRoles != null ? cfn_parse.FromCloudFormation.getArray(CfnDBClusterDBClusterRolePropertyFromCloudFormation)(properties.AssociatedRoles) : undefined));
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("backtrackWindow", "BacktrackWindow", (properties.BacktrackWindow != null ? cfn_parse.FromCloudFormation.getNumber(properties.BacktrackWindow) : undefined));
  ret.addPropertyResult("backupRetentionPeriod", "BackupRetentionPeriod", (properties.BackupRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionPeriod) : undefined));
  ret.addPropertyResult("copyTagsToSnapshot", "CopyTagsToSnapshot", (properties.CopyTagsToSnapshot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshot) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbClusterInstanceClass", "DBClusterInstanceClass", (properties.DBClusterInstanceClass != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterInstanceClass) : undefined));
  ret.addPropertyResult("dbClusterParameterGroupName", "DBClusterParameterGroupName", (properties.DBClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterParameterGroupName) : undefined));
  ret.addPropertyResult("dbInstanceParameterGroupName", "DBInstanceParameterGroupName", (properties.DBInstanceParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceParameterGroupName) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("dbSystemId", "DBSystemId", (properties.DBSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.DBSystemId) : undefined));
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("domainIamRoleName", "DomainIAMRoleName", (properties.DomainIAMRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainIAMRoleName) : undefined));
  ret.addPropertyResult("enableCloudwatchLogsExports", "EnableCloudwatchLogsExports", (properties.EnableCloudwatchLogsExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EnableCloudwatchLogsExports) : undefined));
  ret.addPropertyResult("enableGlobalWriteForwarding", "EnableGlobalWriteForwarding", (properties.EnableGlobalWriteForwarding != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableGlobalWriteForwarding) : undefined));
  ret.addPropertyResult("enableHttpEndpoint", "EnableHttpEndpoint", (properties.EnableHttpEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableHttpEndpoint) : undefined));
  ret.addPropertyResult("enableIamDatabaseAuthentication", "EnableIAMDatabaseAuthentication", (properties.EnableIAMDatabaseAuthentication != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableIAMDatabaseAuthentication) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("engineMode", "EngineMode", (properties.EngineMode != null ? cfn_parse.FromCloudFormation.getString(properties.EngineMode) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("globalClusterIdentifier", "GlobalClusterIdentifier", (properties.GlobalClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalClusterIdentifier) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("manageMasterUserPassword", "ManageMasterUserPassword", (properties.ManageMasterUserPassword != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ManageMasterUserPassword) : undefined));
  ret.addPropertyResult("masterUsername", "MasterUsername", (properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addPropertyResult("masterUserSecret", "MasterUserSecret", (properties.MasterUserSecret != null ? CfnDBClusterMasterUserSecretPropertyFromCloudFormation(properties.MasterUserSecret) : undefined));
  ret.addPropertyResult("monitoringInterval", "MonitoringInterval", (properties.MonitoringInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.MonitoringInterval) : undefined));
  ret.addPropertyResult("monitoringRoleArn", "MonitoringRoleArn", (properties.MonitoringRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.MonitoringRoleArn) : undefined));
  ret.addPropertyResult("networkType", "NetworkType", (properties.NetworkType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkType) : undefined));
  ret.addPropertyResult("performanceInsightsEnabled", "PerformanceInsightsEnabled", (properties.PerformanceInsightsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PerformanceInsightsEnabled) : undefined));
  ret.addPropertyResult("performanceInsightsKmsKeyId", "PerformanceInsightsKmsKeyId", (properties.PerformanceInsightsKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.PerformanceInsightsKmsKeyId) : undefined));
  ret.addPropertyResult("performanceInsightsRetentionPeriod", "PerformanceInsightsRetentionPeriod", (properties.PerformanceInsightsRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PerformanceInsightsRetentionPeriod) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("replicationSourceIdentifier", "ReplicationSourceIdentifier", (properties.ReplicationSourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationSourceIdentifier) : undefined));
  ret.addPropertyResult("restoreToTime", "RestoreToTime", (properties.RestoreToTime != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreToTime) : undefined));
  ret.addPropertyResult("restoreType", "RestoreType", (properties.RestoreType != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreType) : undefined));
  ret.addPropertyResult("scalingConfiguration", "ScalingConfiguration", (properties.ScalingConfiguration != null ? CfnDBClusterScalingConfigurationPropertyFromCloudFormation(properties.ScalingConfiguration) : undefined));
  ret.addPropertyResult("serverlessV2ScalingConfiguration", "ServerlessV2ScalingConfiguration", (properties.ServerlessV2ScalingConfiguration != null ? CfnDBClusterServerlessV2ScalingConfigurationPropertyFromCloudFormation(properties.ServerlessV2ScalingConfiguration) : undefined));
  ret.addPropertyResult("snapshotIdentifier", "SnapshotIdentifier", (properties.SnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotIdentifier) : undefined));
  ret.addPropertyResult("sourceDbClusterIdentifier", "SourceDBClusterIdentifier", (properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined));
  ret.addPropertyResult("sourceRegion", "SourceRegion", (properties.SourceRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SourceRegion) : undefined));
  ret.addPropertyResult("storageEncrypted", "StorageEncrypted", (properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined));
  ret.addPropertyResult("storageType", "StorageType", (properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("useLatestRestorableTime", "UseLatestRestorableTime", (properties.UseLatestRestorableTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLatestRestorableTime) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBClusterParameterGroup` resource creates a new Amazon RDS DB cluster parameter group.
 *
 * For information about configuring parameters for Amazon Aurora DB clusters, see [Working with parameter groups](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_WorkingWithParamGroups.html) in the *Amazon Aurora User Guide* .
 *
 * > If you apply a parameter group to a DB cluster, then its DB instances might need to reboot. This can result in an outage while the DB instances are rebooting.
 * >
 * > If you apply a change to parameter group associated with a stopped DB cluster, then the update stack waits until the DB cluster is started.
 *
 * @cloudformationResource AWS::RDS::DBClusterParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html
 */
export class CfnDBClusterParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBClusterParameterGroup";

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
   * The name of the DB cluster parameter group.
   */
  public dbClusterParameterGroupName?: string;

  /**
   * A friendly description for this DB cluster parameter group.
   */
  public description: string;

  /**
   * The DB cluster parameter group family name.
   */
  public family: string;

  /**
   * Provides a list of parameters for the DB cluster parameter group.
   */
  public parameters: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this DB cluster parameter group.
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

    this.dbClusterParameterGroupName = props.dbClusterParameterGroupName;
    this.description = props.description;
    this.family = props.family;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBClusterParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dbClusterParameterGroupName": this.dbClusterParameterGroupName,
      "description": this.description,
      "family": this.family,
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html
 */
export interface CfnDBClusterParameterGroupProps {
  /**
   * The name of the DB cluster parameter group.
   *
   * Constraints:
   *
   * - Must not match the name of an existing DB cluster parameter group.
   *
   * If you don't specify a value for `DBClusterParameterGroupName` property, a name is automatically created for the DB cluster parameter group.
   *
   * > This value is stored as a lowercase string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html#cfn-rds-dbclusterparametergroup-dbclusterparametergroupname
   */
  readonly dbClusterParameterGroupName?: string;

  /**
   * A friendly description for this DB cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html#cfn-rds-dbclusterparametergroup-description
   */
  readonly description: string;

  /**
   * The DB cluster parameter group family name.
   *
   * A DB cluster parameter group can be associated with one and only one DB cluster parameter group family, and can be applied only to a DB cluster running a DB engine and engine version compatible with that DB cluster parameter group family.
   *
   * > The DB cluster parameter group family can't be changed when updating a DB cluster parameter group.
   *
   * To list all of the available parameter group families, use the following command:
   *
   * `aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily"`
   *
   * The output contains duplicates.
   *
   * For more information, see `[CreateDBClusterParameterGroup](https://docs.aws.amazon.com//AmazonRDS/latest/APIReference/API_CreateDBClusterParameterGroup.html)` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html#cfn-rds-dbclusterparametergroup-family
   */
  readonly family: string;

  /**
   * Provides a list of parameters for the DB cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html#cfn-rds-dbclusterparametergroup-parameters
   */
  readonly parameters: any | cdk.IResolvable;

  /**
   * An optional array of key-value pairs to apply to this DB cluster parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbclusterparametergroup.html#cfn-rds-dbclusterparametergroup-tags
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
  errors.collect(cdk.propertyValidator("dbClusterParameterGroupName", cdk.validateString)(properties.dbClusterParameterGroupName));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("family", cdk.requiredValidator)(properties.family));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
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
    "DBClusterParameterGroupName": cdk.stringToCloudFormation(properties.dbClusterParameterGroupName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Family": cdk.stringToCloudFormation(properties.family),
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
  ret.addPropertyResult("dbClusterParameterGroupName", "DBClusterParameterGroupName", (properties.DBClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterParameterGroupName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBInstance` resource creates an Amazon DB instance.
 *
 * The new DB instance can be an RDS DB instance, or it can be a DB instance in an Aurora DB cluster.
 *
 * For more information about creating an RDS DB instance, see [Creating an Amazon RDS DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.html) in the *Amazon RDS User Guide* .
 *
 * For more information about creating a DB instance in an Aurora DB cluster, see [Creating an Amazon Aurora DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.CreateInstance.html) in the *Amazon Aurora User Guide* .
 *
 * If you import an existing DB instance, and the template configuration doesn't match the actual configuration of the DB instance, AWS CloudFormation applies the changes in the template during the import operation.
 *
 * > If a DB instance is deleted or replaced during an update, AWS CloudFormation deletes all automated snapshots. However, it retains manual DB snapshots. During an update that requires replacement, you can apply a stack policy to prevent DB instances from being replaced. For more information, see [Prevent Updates to Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html) .
 *
 * *Updating DB instances*
 *
 * When properties labeled " *Update requires:* [Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) " are updated, AWS CloudFormation first creates a replacement DB instance, then changes references from other dependent resources to point to the replacement DB instance, and finally deletes the old DB instance.
 *
 * > We highly recommend that you take a snapshot of the database before updating the stack. If you don't, you lose the data when AWS CloudFormation replaces your DB instance. To preserve your data, perform the following procedure:
 * >
 * > - Deactivate any applications that are using the DB instance so that there's no activity on the DB instance.
 * > - Create a snapshot of the DB instance. For more information, see [Creating a DB Snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html) .
 * > - If you want to restore your instance using a DB snapshot, modify the updated template with your DB instance changes and add the `DBSnapshotIdentifier` property with the ID of the DB snapshot that you want to use.
 * >
 * > After you restore a DB instance with a `DBSnapshotIdentifier` property, you can delete the `DBSnapshotIdentifier` property. When you specify this property for an update, the DB instance is not restored from the DB snapshot again, and the data in the database is not changed. However, if you don't specify the `DBSnapshotIdentifier` property, an empty DB instance is created, and the original DB instance is deleted. If you specify a property that is different from the previous snapshot restore property, a new DB instance is restored from the specified `DBSnapshotIdentifier` property, and the original DB instance is deleted.
 * > - Update the stack.
 *
 * For more information about updating other properties of this resource, see `[ModifyDBInstance](https://docs.aws.amazon.com//AmazonRDS/latest/APIReference/API_ModifyDBInstance.html)` . For more information about updating stacks, see [AWS CloudFormation Stacks Updates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html) .
 *
 * *Deleting DB instances*
 *
 * For DB instances that are part of an Aurora DB cluster, you can set a deletion policy for your DB instance to control how AWS CloudFormation handles the DB instance when the stack is deleted. For Amazon RDS DB instances, you can choose to *retain* the DB instance, to *delete* the DB instance, or to *create a snapshot* of the DB instance. The default AWS CloudFormation behavior depends on the `DBClusterIdentifier` property:
 *
 * - For `AWS::RDS::DBInstance` resources that don't specify the `DBClusterIdentifier` property, AWS CloudFormation saves a snapshot of the DB instance.
 * - For `AWS::RDS::DBInstance` resources that do specify the `DBClusterIdentifier` property, AWS CloudFormation deletes the DB instance.
 *
 * For more information, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * @cloudformationResource AWS::RDS::DBInstance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html
 */
export class CfnDBInstance extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBInstance";

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
   * The CA identifier of the CA certificate used for the DB instance's server certificate.
   *
   * @cloudformationAttribute CertificateDetails.CAIdentifier
   */
  public readonly attrCertificateDetailsCaIdentifier: string;

  /**
   * The expiration date of the DB instance’s server certificate.
   *
   * @cloudformationAttribute CertificateDetails.ValidTill
   */
  public readonly attrCertificateDetailsValidTill: string;

  /**
   * The Amazon Resource Name (ARN) for the DB instance.
   *
   * @cloudformationAttribute DBInstanceArn
   */
  public readonly attrDbInstanceArn: string;

  /**
   * The AWS Region-unique, immutable identifier for the DB instance. This identifier is found in AWS CloudTrail log entries whenever the AWS KMS key for the DB instance is accessed.
   *
   * @cloudformationAttribute DbiResourceId
   */
  public readonly attrDbiResourceId: string;

  /**
   * The Oracle system ID (Oracle SID) for a container database (CDB). The Oracle SID is also the name of the CDB.
   *
   * This setting is valid for RDS Custom only.
   *
   * @cloudformationAttribute DBSystemId
   */
  public readonly attrDbSystemId: string;

  /**
   * Specifies the DNS address of the DB instance.
   *
   * @cloudformationAttribute Endpoint.Address
   */
  public readonly attrEndpointAddress: string;

  /**
   * Specifies the ID that Amazon Route 53 assigns when you create a hosted zone.
   *
   * @cloudformationAttribute Endpoint.HostedZoneId
   */
  public readonly attrEndpointHostedZoneId: string;

  /**
   * Specifies the port that the database engine is listening on.
   *
   * @cloudformationAttribute Endpoint.Port
   */
  public readonly attrEndpointPort: string;

  /**
   * The Amazon Resource Name (ARN) of the secret.
   *
   * @cloudformationAttribute MasterUserSecret.SecretArn
   */
  public readonly attrMasterUserSecretSecretArn: string;

  /**
   * The amount of storage in gibibytes (GiB) to be initially allocated for the database instance.
   */
  public allocatedStorage?: string;

  /**
   * A value that indicates whether major version upgrades are allowed.
   */
  public allowMajorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The AWS Identity and Access Management (IAM) roles associated with the DB instance.
   */
  public associatedRoles?: Array<CfnDBInstance.DBInstanceRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The destination region for the backup replication of the DB instance.
   */
  public automaticBackupReplicationRegion?: string;

  /**
   * A value that indicates whether minor engine upgrades are applied automatically to the DB instance during the maintenance window.
   */
  public autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The Availability Zone (AZ) where the database will be created.
   */
  public availabilityZone?: string;

  /**
   * The number of days for which automated backups are retained.
   */
  public backupRetentionPeriod?: number;

  /**
   * The identifier of the CA certificate for this DB instance.
   */
  public caCertificateIdentifier?: string;

  /**
   * The details of the DB instance's server certificate.
   */
  public certificateDetails?: CfnDBInstance.CertificateDetailsProperty | cdk.IResolvable;

  /**
   * Specifies whether the DB instance is restarted when you rotate your SSL/TLS certificate.
   */
  public certificateRotationRestart?: boolean | cdk.IResolvable;

  /**
   * For supported engines, indicates that the DB instance should be associated with the specified character set.
   */
  public characterSetName?: string;

  /**
   * Specifies whether to copy tags from the DB instance to snapshots of the DB instance.
   */
  public copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance.
   */
  public customIamInstanceProfile?: string;

  /**
   * The identifier of the DB cluster that the instance will belong to.
   */
  public dbClusterIdentifier?: string;

  /**
   * The identifier for the RDS for MySQL Multi-AZ DB cluster snapshot to restore from.
   */
  public dbClusterSnapshotIdentifier?: string;

  /**
   * The compute and memory capacity of the DB instance, for example, `db.m4.large` . Not all DB instance classes are available in all AWS Regions, or for all database engines.
   */
  public dbInstanceClass?: string;

  /**
   * A name for the DB instance.
   */
  public dbInstanceIdentifier?: string;

  /**
   * The meaning of this parameter differs according to the database engine you use.
   */
  public dbName?: string;

  /**
   * The name of an existing DB parameter group or a reference to an [AWS::RDS::DBParameterGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbparametergroup.html) resource created in the template.
   */
  public dbParameterGroupName?: string;

  /**
   * A list of the DB security groups to assign to the DB instance.
   */
  public dbSecurityGroups?: Array<string>;

  /**
   * The name or Amazon Resource Name (ARN) of the DB snapshot that's used to restore the DB instance.
   */
  public dbSnapshotIdentifier?: string;

  /**
   * A DB subnet group to associate with the DB instance.
   */
  public dbSubnetGroupName?: string;

  /**
   * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
   */
  public dedicatedLogVolume?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to remove automated backups immediately after the DB instance is deleted.
   */
  public deleteAutomatedBackups?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether the DB instance has deletion protection enabled.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The Active Directory directory ID to create the DB instance in.
   */
  public domain?: string;

  /**
   * The ARN for the Secrets Manager secret with the credentials for the user joining the domain.
   */
  public domainAuthSecretArn?: string;

  /**
   * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers.
   */
  public domainDnsIps?: Array<string>;

  /**
   * The fully qualified domain name (FQDN) of an Active Directory domain.
   */
  public domainFqdn?: string;

  /**
   * The name of the IAM role to use when making API calls to the Directory Service.
   */
  public domainIamRoleName?: string;

  /**
   * The Active Directory organizational unit for your DB instance to join.
   */
  public domainOu?: string;

  /**
   * The list of log types that need to be enabled for exporting to CloudWatch Logs.
   */
  public enableCloudwatchLogsExports?: Array<string>;

  /**
   * A value that indicates whether to enable mapping of AWS Identity and Access Management (IAM) accounts to database accounts.
   */
  public enableIamDatabaseAuthentication?: boolean | cdk.IResolvable;

  /**
   * Specifies whether to enable Performance Insights for the DB instance.
   */
  public enablePerformanceInsights?: boolean | cdk.IResolvable;

  /**
   * The connection endpoint for the DB instance.
   */
  public endpoint?: CfnDBInstance.EndpointProperty | cdk.IResolvable;

  /**
   * The name of the database engine that you want to use for this DB instance.
   */
  public engine?: string;

  /**
   * The version number of the database engine to use.
   */
  public engineVersion?: string;

  /**
   * The number of I/O operations per second (IOPS) that the database provisions.
   */
  public iops?: number;

  /**
   * The ARN of the AWS KMS key that's used to encrypt the DB instance, such as `arn:aws:kms:us-east-1:012345678910:key/abcd1234-a123-456a-a12b-a123b4cd56ef` .
   */
  public kmsKeyId?: string;

  /**
   * License model information for this DB instance.
   */
  public licenseModel?: string;

  /**
   * Specifies whether to manage the master user password with AWS Secrets Manager.
   */
  public manageMasterUserPassword?: boolean | cdk.IResolvable;

  /**
   * The master user name for the DB instance.
   */
  public masterUsername?: string;

  /**
   * The password for the master user. The password can include any printable ASCII character except "/", """, or "@".
   */
  public masterUserPassword?: string;

  /**
   * The secret managed by RDS in AWS Secrets Manager for the master user password.
   */
  public masterUserSecret?: cdk.IResolvable | CfnDBInstance.MasterUserSecretProperty;

  /**
   * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance.
   */
  public maxAllocatedStorage?: number;

  /**
   * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance.
   */
  public monitoringInterval?: number;

  /**
   * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs.
   */
  public monitoringRoleArn?: string;

  /**
   * Specifies whether the database instance is a Multi-AZ DB instance deployment.
   */
  public multiAz?: boolean | cdk.IResolvable;

  /**
   * The name of the NCHAR character set for the Oracle DB instance.
   */
  public ncharCharacterSetName?: string;

  /**
   * The network type of the DB instance.
   */
  public networkType?: string;

  /**
   * Indicates that the DB instance should be associated with the specified option group.
   */
  public optionGroupName?: string;

  /**
   * The AWS KMS key identifier for encryption of Performance Insights data.
   */
  public performanceInsightsKmsKeyId?: string;

  /**
   * The number of days to retain Performance Insights data.
   */
  public performanceInsightsRetentionPeriod?: number;

  /**
   * The port number on which the database accepts connections.
   */
  public port?: string;

  /**
   * The daily time range during which automated backups are created if automated backups are enabled, using the `BackupRetentionPeriod` parameter.
   */
  public preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
   */
  public processorFeatures?: Array<cdk.IResolvable | CfnDBInstance.ProcessorFeatureProperty> | cdk.IResolvable;

  /**
   * The order of priority in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance.
   */
  public promotionTier?: number;

  /**
   * Indicates whether the DB instance is an internet-facing instance.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The open mode of an Oracle read replica.
   */
  public replicaMode?: string;

  /**
   * The date and time to restore from.
   */
  public restoreTime?: string;

  /**
   * The identifier of the Multi-AZ DB cluster that will act as the source for the read replica.
   */
  public sourceDbClusterIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) of the replicated automated backups from which to restore, for example, `arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE` .
   */
  public sourceDbInstanceAutomatedBackupsArn?: string;

  /**
   * If you want to create a read replica DB instance, specify the ID of the source DB instance.
   */
  public sourceDbInstanceIdentifier?: string;

  /**
   * The resource ID of the source DB instance from which to restore.
   */
  public sourceDbiResourceId?: string;

  /**
   * The ID of the region that contains the source DB instance for the read replica.
   */
  public sourceRegion?: string;

  /**
   * A value that indicates whether the DB instance is encrypted. By default, it isn't encrypted.
   */
  public storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * Specifies the storage throughput value for the DB instance. This setting applies only to the `gp3` storage type.
   */
  public storageThroughput?: number;

  /**
   * Specifies the storage type to be associated with the DB instance.
   */
  public storageType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this DB instance.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN from the key store with which to associate the instance for TDE encryption.
   *
   * @deprecated this property has been deprecated
   */
  public tdeCredentialArn?: string;

  /**
   * The password for the given ARN from the key store in order to access the device.
   *
   * @deprecated this property has been deprecated
   */
  public tdeCredentialPassword?: string;

  /**
   * The time zone of the DB instance.
   */
  public timezone?: string;

  /**
   * Specifies whether the DB instance class of the DB instance uses its default processor features.
   */
  public useDefaultProcessorFeatures?: boolean | cdk.IResolvable;

  /**
   * Specifies whether the DB instance is restored from the latest backup time.
   */
  public useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of the VPC security group IDs to assign to the DB instance.
   */
  public vpcSecurityGroups?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBInstanceProps = {}) {
    super(scope, id, {
      "type": CfnDBInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCertificateDetailsCaIdentifier = cdk.Token.asString(this.getAtt("CertificateDetails.CAIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrCertificateDetailsValidTill = cdk.Token.asString(this.getAtt("CertificateDetails.ValidTill", cdk.ResolutionTypeHint.STRING));
    this.attrDbInstanceArn = cdk.Token.asString(this.getAtt("DBInstanceArn", cdk.ResolutionTypeHint.STRING));
    this.attrDbiResourceId = cdk.Token.asString(this.getAtt("DbiResourceId", cdk.ResolutionTypeHint.STRING));
    this.attrDbSystemId = cdk.Token.asString(this.getAtt("DBSystemId", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointAddress = cdk.Token.asString(this.getAtt("Endpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointHostedZoneId = cdk.Token.asString(this.getAtt("Endpoint.HostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointPort = cdk.Token.asString(this.getAtt("Endpoint.Port", cdk.ResolutionTypeHint.STRING));
    this.attrMasterUserSecretSecretArn = cdk.Token.asString(this.getAtt("MasterUserSecret.SecretArn", cdk.ResolutionTypeHint.STRING));
    this.allocatedStorage = props.allocatedStorage;
    this.allowMajorVersionUpgrade = props.allowMajorVersionUpgrade;
    this.associatedRoles = props.associatedRoles;
    this.automaticBackupReplicationRegion = props.automaticBackupReplicationRegion;
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.availabilityZone = props.availabilityZone;
    this.backupRetentionPeriod = props.backupRetentionPeriod;
    this.caCertificateIdentifier = props.caCertificateIdentifier;
    this.certificateDetails = props.certificateDetails;
    this.certificateRotationRestart = props.certificateRotationRestart;
    this.characterSetName = props.characterSetName;
    this.copyTagsToSnapshot = props.copyTagsToSnapshot;
    this.customIamInstanceProfile = props.customIamInstanceProfile;
    this.dbClusterIdentifier = props.dbClusterIdentifier;
    this.dbClusterSnapshotIdentifier = props.dbClusterSnapshotIdentifier;
    this.dbInstanceClass = props.dbInstanceClass;
    this.dbInstanceIdentifier = props.dbInstanceIdentifier;
    this.dbName = props.dbName;
    this.dbParameterGroupName = props.dbParameterGroupName;
    this.dbSecurityGroups = props.dbSecurityGroups;
    this.dbSnapshotIdentifier = props.dbSnapshotIdentifier;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.dedicatedLogVolume = props.dedicatedLogVolume;
    this.deleteAutomatedBackups = props.deleteAutomatedBackups;
    this.deletionProtection = props.deletionProtection;
    this.domain = props.domain;
    this.domainAuthSecretArn = props.domainAuthSecretArn;
    this.domainDnsIps = props.domainDnsIps;
    this.domainFqdn = props.domainFqdn;
    this.domainIamRoleName = props.domainIamRoleName;
    this.domainOu = props.domainOu;
    this.enableCloudwatchLogsExports = props.enableCloudwatchLogsExports;
    this.enableIamDatabaseAuthentication = props.enableIamDatabaseAuthentication;
    this.enablePerformanceInsights = props.enablePerformanceInsights;
    this.endpoint = props.endpoint;
    this.engine = props.engine;
    this.engineVersion = props.engineVersion;
    this.iops = props.iops;
    this.kmsKeyId = props.kmsKeyId;
    this.licenseModel = props.licenseModel;
    this.manageMasterUserPassword = props.manageMasterUserPassword;
    this.masterUsername = props.masterUsername;
    this.masterUserPassword = props.masterUserPassword;
    this.masterUserSecret = props.masterUserSecret;
    this.maxAllocatedStorage = props.maxAllocatedStorage;
    this.monitoringInterval = props.monitoringInterval;
    this.monitoringRoleArn = props.monitoringRoleArn;
    this.multiAz = props.multiAz;
    this.ncharCharacterSetName = props.ncharCharacterSetName;
    this.networkType = props.networkType;
    this.optionGroupName = props.optionGroupName;
    this.performanceInsightsKmsKeyId = props.performanceInsightsKmsKeyId;
    this.performanceInsightsRetentionPeriod = props.performanceInsightsRetentionPeriod;
    this.port = props.port;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.processorFeatures = props.processorFeatures;
    this.promotionTier = props.promotionTier;
    this.publiclyAccessible = props.publiclyAccessible;
    this.replicaMode = props.replicaMode;
    this.restoreTime = props.restoreTime;
    this.sourceDbClusterIdentifier = props.sourceDbClusterIdentifier;
    this.sourceDbInstanceAutomatedBackupsArn = props.sourceDbInstanceAutomatedBackupsArn;
    this.sourceDbInstanceIdentifier = props.sourceDbInstanceIdentifier;
    this.sourceDbiResourceId = props.sourceDbiResourceId;
    this.sourceRegion = props.sourceRegion;
    this.storageEncrypted = props.storageEncrypted;
    this.storageThroughput = props.storageThroughput;
    this.storageType = props.storageType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBInstance", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tdeCredentialArn = props.tdeCredentialArn;
    this.tdeCredentialPassword = props.tdeCredentialPassword;
    this.timezone = props.timezone;
    this.useDefaultProcessorFeatures = props.useDefaultProcessorFeatures;
    this.useLatestRestorableTime = props.useLatestRestorableTime;
    this.vpcSecurityGroups = props.vpcSecurityGroups;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::RDS::DBInstance' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allocatedStorage": this.allocatedStorage,
      "allowMajorVersionUpgrade": this.allowMajorVersionUpgrade,
      "associatedRoles": this.associatedRoles,
      "automaticBackupReplicationRegion": this.automaticBackupReplicationRegion,
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "availabilityZone": this.availabilityZone,
      "backupRetentionPeriod": this.backupRetentionPeriod,
      "caCertificateIdentifier": this.caCertificateIdentifier,
      "certificateDetails": this.certificateDetails,
      "certificateRotationRestart": this.certificateRotationRestart,
      "characterSetName": this.characterSetName,
      "copyTagsToSnapshot": this.copyTagsToSnapshot,
      "customIamInstanceProfile": this.customIamInstanceProfile,
      "dbClusterIdentifier": this.dbClusterIdentifier,
      "dbClusterSnapshotIdentifier": this.dbClusterSnapshotIdentifier,
      "dbInstanceClass": this.dbInstanceClass,
      "dbInstanceIdentifier": this.dbInstanceIdentifier,
      "dbName": this.dbName,
      "dbParameterGroupName": this.dbParameterGroupName,
      "dbSecurityGroups": this.dbSecurityGroups,
      "dbSnapshotIdentifier": this.dbSnapshotIdentifier,
      "dbSubnetGroupName": this.dbSubnetGroupName,
      "dedicatedLogVolume": this.dedicatedLogVolume,
      "deleteAutomatedBackups": this.deleteAutomatedBackups,
      "deletionProtection": this.deletionProtection,
      "domain": this.domain,
      "domainAuthSecretArn": this.domainAuthSecretArn,
      "domainDnsIps": this.domainDnsIps,
      "domainFqdn": this.domainFqdn,
      "domainIamRoleName": this.domainIamRoleName,
      "domainOu": this.domainOu,
      "enableCloudwatchLogsExports": this.enableCloudwatchLogsExports,
      "enableIamDatabaseAuthentication": this.enableIamDatabaseAuthentication,
      "enablePerformanceInsights": this.enablePerformanceInsights,
      "endpoint": this.endpoint,
      "engine": this.engine,
      "engineVersion": this.engineVersion,
      "iops": this.iops,
      "kmsKeyId": this.kmsKeyId,
      "licenseModel": this.licenseModel,
      "manageMasterUserPassword": this.manageMasterUserPassword,
      "masterUsername": this.masterUsername,
      "masterUserPassword": this.masterUserPassword,
      "masterUserSecret": this.masterUserSecret,
      "maxAllocatedStorage": this.maxAllocatedStorage,
      "monitoringInterval": this.monitoringInterval,
      "monitoringRoleArn": this.monitoringRoleArn,
      "multiAz": this.multiAz,
      "ncharCharacterSetName": this.ncharCharacterSetName,
      "networkType": this.networkType,
      "optionGroupName": this.optionGroupName,
      "performanceInsightsKmsKeyId": this.performanceInsightsKmsKeyId,
      "performanceInsightsRetentionPeriod": this.performanceInsightsRetentionPeriod,
      "port": this.port,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "processorFeatures": this.processorFeatures,
      "promotionTier": this.promotionTier,
      "publiclyAccessible": this.publiclyAccessible,
      "replicaMode": this.replicaMode,
      "restoreTime": this.restoreTime,
      "sourceDbClusterIdentifier": this.sourceDbClusterIdentifier,
      "sourceDbInstanceAutomatedBackupsArn": this.sourceDbInstanceAutomatedBackupsArn,
      "sourceDbInstanceIdentifier": this.sourceDbInstanceIdentifier,
      "sourceDbiResourceId": this.sourceDbiResourceId,
      "sourceRegion": this.sourceRegion,
      "storageEncrypted": this.storageEncrypted,
      "storageThroughput": this.storageThroughput,
      "storageType": this.storageType,
      "tags": this.tags.renderTags(),
      "tdeCredentialArn": this.tdeCredentialArn,
      "tdeCredentialPassword": this.tdeCredentialPassword,
      "timezone": this.timezone,
      "useDefaultProcessorFeatures": this.useDefaultProcessorFeatures,
      "useLatestRestorableTime": this.useLatestRestorableTime,
      "vpcSecurityGroups": this.vpcSecurityGroups
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

export namespace CfnDBInstance {
  /**
   * Returns the details of the DB instance’s server certificate.
   *
   * For more information, see [Using SSL/TLS to encrypt a connection to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html) in the *Amazon RDS User Guide* and [Using SSL/TLS to encrypt a connection to a DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL.html) in the *Amazon Aurora User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-certificatedetails.html
   */
  export interface CertificateDetailsProperty {
    /**
     * The CA identifier of the CA certificate used for the DB instance's server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-certificatedetails.html#cfn-rds-dbinstance-certificatedetails-caidentifier
     */
    readonly caIdentifier?: string;

    /**
     * The expiration date of the DB instance’s server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-certificatedetails.html#cfn-rds-dbinstance-certificatedetails-validtill
     */
    readonly validTill?: string;
  }

  /**
   * This data type represents the information you need to connect to an Amazon RDS DB instance.
   *
   * This data type is used as a response element in the following actions:
   *
   * - `CreateDBInstance`
   * - `DescribeDBInstances`
   * - `DeleteDBInstance`
   *
   * For the data structure that represents Amazon Aurora DB cluster endpoints, see `DBClusterEndpoint` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html
   */
  export interface EndpointProperty {
    /**
     * Specifies the DNS address of the DB instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html#cfn-rds-dbinstance-endpoint-address
     */
    readonly address?: string;

    /**
     * Specifies the ID that Amazon Route 53 assigns when you create a hosted zone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html#cfn-rds-dbinstance-endpoint-hostedzoneid
     */
    readonly hostedZoneId?: string;

    /**
     * Specifies the port that the database engine is listening on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-endpoint.html#cfn-rds-dbinstance-endpoint-port
     */
    readonly port?: string;
  }

  /**
   * The `MasterUserSecret` return value specifies the secret managed by RDS in AWS Secrets Manager for the master user password.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide* and [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-secrets-manager.html) in the *Amazon Aurora User Guide.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-masterusersecret.html
   */
  export interface MasterUserSecretProperty {
    /**
     * The AWS KMS key identifier that is used to encrypt the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-masterusersecret.html#cfn-rds-dbinstance-masterusersecret-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The Amazon Resource Name (ARN) of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-masterusersecret.html#cfn-rds-dbinstance-masterusersecret-secretarn
     */
    readonly secretArn?: string;
  }

  /**
   * Information about an AWS Identity and Access Management (IAM) role that is associated with a DB instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-dbinstancerole.html
   */
  export interface DBInstanceRoleProperty {
    /**
     * The name of the feature associated with the AWS Identity and Access Management (IAM) role.
     *
     * IAM roles that are associated with a DB instance grant permission for the DB instance to access other AWS services on your behalf. For the list of supported feature names, see the `SupportedFeatureNames` description in [DBEngineVersion](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DBEngineVersion.html) in the *Amazon RDS API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-dbinstancerole.html#cfn-rds-dbinstance-dbinstancerole-featurename
     */
    readonly featureName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that is associated with the DB instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-dbinstancerole.html#cfn-rds-dbinstance-dbinstancerole-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * The `ProcessorFeature` property type specifies the processor features of a DB instance class status.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-processorfeature.html
   */
  export interface ProcessorFeatureProperty {
    /**
     * The name of the processor feature.
     *
     * Valid names are `coreCount` and `threadsPerCore` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-processorfeature.html#cfn-rds-dbinstance-processorfeature-name
     */
    readonly name?: string;

    /**
     * The value of a processor feature name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbinstance-processorfeature.html#cfn-rds-dbinstance-processorfeature-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDBInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html
 */
export interface CfnDBInstanceProps {
  /**
   * The amount of storage in gibibytes (GiB) to be initially allocated for the database instance.
   *
   * > If any value is set in the `Iops` parameter, `AllocatedStorage` must be at least 100 GiB, which corresponds to the minimum Iops value of 1,000. If you increase the `Iops` value (in 1,000 IOPS increments), then you must also increase the `AllocatedStorage` value (in 100-GiB increments).
   *
   * *Amazon Aurora*
   *
   * Not applicable. Aurora cluster volumes automatically grow as the amount of data in your database increases, though you are only charged for the space that you use in an Aurora cluster volume.
   *
   * *Db2*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp3): Must be an integer from 20 to 64000.
   * - Provisioned IOPS storage (io1): Must be an integer from 100 to 64000.
   *
   * *MySQL*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp2): Must be an integer from 20 to 65536.
   * - Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.
   * - Magnetic storage (standard): Must be an integer from 5 to 3072.
   *
   * *MariaDB*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp2): Must be an integer from 20 to 65536.
   * - Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.
   * - Magnetic storage (standard): Must be an integer from 5 to 3072.
   *
   * *PostgreSQL*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp2): Must be an integer from 20 to 65536.
   * - Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.
   * - Magnetic storage (standard): Must be an integer from 5 to 3072.
   *
   * *Oracle*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp2): Must be an integer from 20 to 65536.
   * - Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.
   * - Magnetic storage (standard): Must be an integer from 10 to 3072.
   *
   * *SQL Server*
   *
   * Constraints to the amount of storage for each storage type are the following:
   *
   * - General Purpose (SSD) storage (gp2):
   *
   * - Enterprise and Standard editions: Must be an integer from 20 to 16384.
   * - Web and Express editions: Must be an integer from 20 to 16384.
   * - Provisioned IOPS storage (io1):
   *
   * - Enterprise and Standard editions: Must be an integer from 20 to 16384.
   * - Web and Express editions: Must be an integer from 20 to 16384.
   * - Magnetic storage (standard):
   *
   * - Enterprise and Standard editions: Must be an integer from 20 to 1024.
   * - Web and Express editions: Must be an integer from 20 to 1024.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-allocatedstorage
   */
  readonly allocatedStorage?: string;

  /**
   * A value that indicates whether major version upgrades are allowed.
   *
   * Changing this parameter doesn't result in an outage and the change is asynchronously applied as soon as possible.
   *
   * Constraints: Major version upgrades must be allowed when specifying a value for the `EngineVersion` parameter that is a different major version than the DB instance's current version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-allowmajorversionupgrade
   */
  readonly allowMajorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The AWS Identity and Access Management (IAM) roles associated with the DB instance.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The associated roles are managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-associatedroles
   */
  readonly associatedRoles?: Array<CfnDBInstance.DBInstanceRoleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The destination region for the backup replication of the DB instance.
   *
   * For more info, see [Replicating automated backups to another AWS Region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReplicateBackups.html) in the *Amazon RDS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-automaticbackupreplicationregion
   */
  readonly automaticBackupReplicationRegion?: string;

  /**
   * A value that indicates whether minor engine upgrades are applied automatically to the DB instance during the maintenance window.
   *
   * By default, minor engine upgrades are applied automatically.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The Availability Zone (AZ) where the database will be created.
   *
   * For information on AWS Regions and Availability Zones, see [Regions and Availability Zones](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) .
   *
   * For Amazon Aurora, each Aurora DB cluster hosts copies of its storage in three separate Availability Zones. Specify one of these Availability Zones. Aurora automatically chooses an appropriate Availability Zone if you don't specify one.
   *
   * Default: A random, system-chosen Availability Zone in the endpoint's AWS Region .
   *
   * Constraints:
   *
   * - The `AvailabilityZone` parameter can't be specified if the DB instance is a Multi-AZ deployment.
   * - The specified Availability Zone must be in the same AWS Region as the current endpoint.
   *
   * Example: `us-east-1d`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The number of days for which automated backups are retained.
   *
   * Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The retention period for automated backups is managed by the DB cluster.
   *
   * Default: 1
   *
   * Constraints:
   *
   * - Must be a value from 0 to 35
   * - Can't be set to 0 if the DB instance is a source to read replicas
   *
   * @default - 1
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-backupretentionperiod
   */
  readonly backupRetentionPeriod?: number;

  /**
   * The identifier of the CA certificate for this DB instance.
   *
   * Specifying or updating this property triggers a reboot. For more information about CA certificate identifiers for RDS DB engines, see [Rotating Your SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html) in the *Amazon RDS User Guide* . For more information about CA certificate identifiers for Aurora DB engines, see [Rotating Your SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL-certificate-rotation.html) in the *Amazon Aurora User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-cacertificateidentifier
   */
  readonly caCertificateIdentifier?: string;

  /**
   * The details of the DB instance's server certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-certificatedetails
   */
  readonly certificateDetails?: CfnDBInstance.CertificateDetailsProperty | cdk.IResolvable;

  /**
   * Specifies whether the DB instance is restarted when you rotate your SSL/TLS certificate.
   *
   * By default, the DB instance is restarted when you rotate your SSL/TLS certificate. The certificate is not updated until the DB instance is restarted.
   *
   * > Set this parameter only if you are *not* using SSL/TLS to connect to the DB instance.
   *
   * If you are using SSL/TLS to connect to the DB instance, follow the appropriate instructions for your DB engine to rotate your SSL/TLS certificate:
   *
   * - For more information about rotating your SSL/TLS certificate for RDS DB engines, see [Rotating Your SSL/TLS Certificate.](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html) in the *Amazon RDS User Guide.*
   * - For more information about rotating your SSL/TLS certificate for Aurora DB engines, see [Rotating Your SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL-certificate-rotation.html) in the *Amazon Aurora User Guide* .
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-certificaterotationrestart
   */
  readonly certificateRotationRestart?: boolean | cdk.IResolvable;

  /**
   * For supported engines, indicates that the DB instance should be associated with the specified character set.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The character set is managed by the DB cluster. For more information, see [AWS::RDS::DBCluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-charactersetname
   */
  readonly characterSetName?: string;

  /**
   * Specifies whether to copy tags from the DB instance to snapshots of the DB instance.
   *
   * By default, tags are not copied.
   *
   * This setting doesn't apply to Amazon Aurora DB instances. Copying tags to snapshots is managed by the DB cluster. Setting this value for an Aurora DB instance has no effect on the DB cluster setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-copytagstosnapshot
   */
  readonly copyTagsToSnapshot?: boolean | cdk.IResolvable;

  /**
   * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance.
   *
   * This setting is required for RDS Custom.
   *
   * Constraints:
   *
   * - The profile must exist in your account.
   * - The profile must have an IAM role that Amazon EC2 has permissions to assume.
   * - The instance profile name and the associated IAM role name must start with the prefix `AWSRDSCustom` .
   *
   * For the list of permissions required for the IAM role, see [Configure IAM and your VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/custom-setup-orcl.html#custom-setup-orcl.iam-vpc) in the *Amazon RDS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-customiaminstanceprofile
   */
  readonly customIamInstanceProfile?: string;

  /**
   * The identifier of the DB cluster that the instance will belong to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbclusteridentifier
   */
  readonly dbClusterIdentifier?: string;

  /**
   * The identifier for the RDS for MySQL Multi-AZ DB cluster snapshot to restore from.
   *
   * For more information on Multi-AZ DB clusters, see [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html) in the *Amazon RDS User Guide* .
   *
   * Constraints:
   *
   * - Must match the identifier of an existing Multi-AZ DB cluster snapshot.
   * - Can't be specified when `DBSnapshotIdentifier` is specified.
   * - Must be specified when `DBSnapshotIdentifier` isn't specified.
   * - If you are restoring from a shared manual Multi-AZ DB cluster snapshot, the `DBClusterSnapshotIdentifier` must be the ARN of the shared snapshot.
   * - Can't be the identifier of an Aurora DB cluster snapshot.
   * - Can't be the identifier of an RDS for PostgreSQL Multi-AZ DB cluster snapshot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbclustersnapshotidentifier
   */
  readonly dbClusterSnapshotIdentifier?: string;

  /**
   * The compute and memory capacity of the DB instance, for example, `db.m4.large` . Not all DB instance classes are available in all AWS Regions, or for all database engines.
   *
   * For the full list of DB instance classes, and availability for your engine, see [DB Instance Class](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html) in the *Amazon RDS User Guide.* For more information about DB instance class pricing and AWS Region support for DB instance classes, see [Amazon RDS Pricing](https://docs.aws.amazon.com/rds/pricing/) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbinstanceclass
   */
  readonly dbInstanceClass?: string;

  /**
   * A name for the DB instance.
   *
   * If you specify a name, AWS CloudFormation converts it to lowercase. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the DB instance. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * For information about constraints that apply to DB instance identifiers, see [Naming constraints in Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints) in the *Amazon RDS User Guide* .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbinstanceidentifier
   */
  readonly dbInstanceIdentifier?: string;

  /**
   * The meaning of this parameter differs according to the database engine you use.
   *
   * > If you specify the `[DBSnapshotIdentifier](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-dbsnapshotidentifier)` property, this property only applies to RDS for Oracle.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The database name is managed by the DB cluster.
   *
   * *Db2*
   *
   * The name of the database to create when the DB instance is created. If this parameter isn't specified, no database is created in the DB instance.
   *
   * Constraints:
   *
   * - Must contain 1 to 64 letters or numbers.
   * - Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0-9).
   * - Can't be a word reserved by the specified database engine.
   *
   * *MySQL*
   *
   * The name of the database to create when the DB instance is created. If this parameter is not specified, no database is created in the DB instance.
   *
   * Constraints:
   *
   * - Must contain 1 to 64 letters or numbers.
   * - Can't be a word reserved by the specified database engine
   *
   * *MariaDB*
   *
   * The name of the database to create when the DB instance is created. If this parameter is not specified, no database is created in the DB instance.
   *
   * Constraints:
   *
   * - Must contain 1 to 64 letters or numbers.
   * - Can't be a word reserved by the specified database engine
   *
   * *PostgreSQL*
   *
   * The name of the database to create when the DB instance is created. If this parameter is not specified, the default `postgres` database is created in the DB instance.
   *
   * Constraints:
   *
   * - Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0-9).
   * - Must contain 1 to 63 characters.
   * - Can't be a word reserved by the specified database engine
   *
   * *Oracle*
   *
   * The Oracle System ID (SID) of the created DB instance. If you specify `null` , the default value `ORCL` is used. You can't specify the string NULL, or any other reserved word, for `DBName` .
   *
   * Default: `ORCL`
   *
   * Constraints:
   *
   * - Can't be longer than 8 characters
   *
   * *SQL Server*
   *
   * Not applicable. Must be null.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbname
   */
  readonly dbName?: string;

  /**
   * The name of an existing DB parameter group or a reference to an [AWS::RDS::DBParameterGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbparametergroup.html) resource created in the template.
   *
   * To list all of the available DB parameter group names, use the following command:
   *
   * `aws rds describe-db-parameter-groups --query "DBParameterGroups[].DBParameterGroupName" --output text`
   *
   * > If any of the data members of the referenced parameter group are changed during an update, the DB instance might need to be restarted, which causes some interruption. If the parameter group contains static parameters, whether they were changed or not, an update triggers a reboot.
   *
   * If you don't specify a value for `DBParameterGroupName` property, the default DB parameter group for the specified engine and engine version is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbparametergroupname
   */
  readonly dbParameterGroupName?: string;

  /**
   * A list of the DB security groups to assign to the DB instance.
   *
   * The list can include both the name of existing DB security groups or references to AWS::RDS::DBSecurityGroup resources created in the template.
   *
   * If you set DBSecurityGroups, you must not set VPCSecurityGroups, and vice versa. Also, note that the DBSecurityGroups property exists only for backwards compatibility with older regions and is no longer recommended for providing security information to an RDS DB instance. Instead, use VPCSecurityGroups.
   *
   * > If you specify this property, AWS CloudFormation sends only the following properties (if specified) to Amazon RDS during create operations:
   * >
   * > - `AllocatedStorage`
   * > - `AutoMinorVersionUpgrade`
   * > - `AvailabilityZone`
   * > - `BackupRetentionPeriod`
   * > - `CharacterSetName`
   * > - `DBInstanceClass`
   * > - `DBName`
   * > - `DBParameterGroupName`
   * > - `DBSecurityGroups`
   * > - `DBSubnetGroupName`
   * > - `Engine`
   * > - `EngineVersion`
   * > - `Iops`
   * > - `LicenseModel`
   * > - `MasterUsername`
   * > - `MasterUserPassword`
   * > - `MultiAZ`
   * > - `OptionGroupName`
   * > - `PreferredBackupWindow`
   * > - `PreferredMaintenanceWindow`
   * >
   * > All other properties are ignored. Specify a virtual private cloud (VPC) security group if you want to submit other properties, such as `StorageType` , `StorageEncrypted` , or `KmsKeyId` . If you're already using the `DBSecurityGroups` property, you can't use these other properties by updating your DB instance to use a VPC security group. You must recreate the DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbsecuritygroups
   */
  readonly dbSecurityGroups?: Array<string>;

  /**
   * The name or Amazon Resource Name (ARN) of the DB snapshot that's used to restore the DB instance.
   *
   * If you're restoring from a shared manual DB snapshot, you must specify the ARN of the snapshot.
   *
   * By specifying this property, you can create a DB instance from the specified DB snapshot. If the `DBSnapshotIdentifier` property is an empty string or the `AWS::RDS::DBInstance` declaration has no `DBSnapshotIdentifier` property, AWS CloudFormation creates a new database. If the property contains a value (other than an empty string), AWS CloudFormation creates a database from the specified snapshot. If a snapshot with the specified name doesn't exist, AWS CloudFormation can't create the database and it rolls back the stack.
   *
   * Some DB instance properties aren't valid when you restore from a snapshot, such as the `MasterUsername` and `MasterUserPassword` properties. For information about the properties that you can specify, see the `RestoreDBInstanceFromDBSnapshot` action in the *Amazon RDS API Reference* .
   *
   * After you restore a DB instance with a `DBSnapshotIdentifier` property, you must specify the same `DBSnapshotIdentifier` property for any future updates to the DB instance. When you specify this property for an update, the DB instance is not restored from the DB snapshot again, and the data in the database is not changed. However, if you don't specify the `DBSnapshotIdentifier` property, an empty DB instance is created, and the original DB instance is deleted. If you specify a property that is different from the previous snapshot restore property, a new DB instance is restored from the specified `DBSnapshotIdentifier` property, and the original DB instance is deleted.
   *
   * If you specify the `DBSnapshotIdentifier` property to restore a DB instance (as opposed to specifying it for DB instance updates), then don't specify the following properties:
   *
   * - `CharacterSetName`
   * - `DBClusterIdentifier`
   * - `DBName`
   * - `DeleteAutomatedBackups`
   * - `EnablePerformanceInsights`
   * - `KmsKeyId`
   * - `MasterUsername`
   * - `MasterUserPassword`
   * - `PerformanceInsightsKMSKeyId`
   * - `PerformanceInsightsRetentionPeriod`
   * - `PromotionTier`
   * - `SourceDBInstanceIdentifier`
   * - `SourceRegion`
   * - `StorageEncrypted` (for an encrypted snapshot)
   * - `Timezone`
   *
   * *Amazon Aurora*
   *
   * Not applicable. Snapshot restore is managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbsnapshotidentifier
   */
  readonly dbSnapshotIdentifier?: string;

  /**
   * A DB subnet group to associate with the DB instance.
   *
   * If you update this value, the new subnet group must be a subnet group in a new VPC.
   *
   * If there's no DB subnet group, then the DB instance isn't a VPC DB instance.
   *
   * For more information about using Amazon RDS in a VPC, see [Using Amazon RDS with Amazon Virtual Private Cloud (VPC)](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.html) in the *Amazon RDS User Guide* .
   *
   * *Amazon Aurora*
   *
   * Not applicable. The DB subnet group is managed by the DB cluster. If specified, the setting must match the DB cluster setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-dedicatedlogvolume
   */
  readonly dedicatedLogVolume?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether to remove automated backups immediately after the DB instance is deleted.
   *
   * This parameter isn't case-sensitive. The default is to remove automated backups immediately after the DB instance is deleted.
   *
   * *Amazon Aurora*
   *
   * Not applicable. When you delete a DB cluster, all automated backups for that DB cluster are deleted and can't be recovered. Manual DB cluster snapshots of the DB cluster are not deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-deleteautomatedbackups
   */
  readonly deleteAutomatedBackups?: boolean | cdk.IResolvable;

  /**
   * A value that indicates whether the DB instance has deletion protection enabled.
   *
   * The database can't be deleted when deletion protection is enabled. By default, deletion protection is disabled. For more information, see [Deleting a DB Instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_DeleteInstance.html) .
   *
   * *Amazon Aurora*
   *
   * Not applicable. You can enable or disable deletion protection for the DB cluster. For more information, see `CreateDBCluster` . DB instances in a DB cluster can be deleted even when deletion protection is enabled for the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The Active Directory directory ID to create the DB instance in.
   *
   * Currently, only Db2, MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances can be created in an Active Directory Domain.
   *
   * For more information, see [Kerberos Authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/kerberos-authentication.html) in the *Amazon RDS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domain
   */
  readonly domain?: string;

  /**
   * The ARN for the Secrets Manager secret with the credentials for the user joining the domain.
   *
   * Example: `arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domainauthsecretarn
   */
  readonly domainAuthSecretArn?: string;

  /**
   * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers.
   *
   * Constraints:
   *
   * - Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.
   *
   * Example: `123.124.125.126,234.235.236.237`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domaindnsips
   */
  readonly domainDnsIps?: Array<string>;

  /**
   * The fully qualified domain name (FQDN) of an Active Directory domain.
   *
   * Constraints:
   *
   * - Can't be longer than 64 characters.
   *
   * Example: `mymanagedADtest.mymanagedAD.mydomain`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domainfqdn
   */
  readonly domainFqdn?: string;

  /**
   * The name of the IAM role to use when making API calls to the Directory Service.
   *
   * This setting doesn't apply to the following DB instances:
   *
   * - Amazon Aurora (The domain is managed by the DB cluster.)
   * - RDS Custom
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domainiamrolename
   */
  readonly domainIamRoleName?: string;

  /**
   * The Active Directory organizational unit for your DB instance to join.
   *
   * Constraints:
   *
   * - Must be in the distinguished name format.
   * - Can't be longer than 64 characters.
   *
   * Example: `OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-domainou
   */
  readonly domainOu?: string;

  /**
   * The list of log types that need to be enabled for exporting to CloudWatch Logs.
   *
   * The values in the list depend on the DB engine being used. For more information, see [Publishing Database Logs to Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_LogAccess.html#USER_LogAccess.Procedural.UploadtoCloudWatch) in the *Amazon Relational Database Service User Guide* .
   *
   * *Amazon Aurora*
   *
   * Not applicable. CloudWatch Logs exports are managed by the DB cluster.
   *
   * *Db2*
   *
   * Valid values: `diag.log` , `notify.log`
   *
   * *MariaDB*
   *
   * Valid values: `audit` , `error` , `general` , `slowquery`
   *
   * *Microsoft SQL Server*
   *
   * Valid values: `agent` , `error`
   *
   * *MySQL*
   *
   * Valid values: `audit` , `error` , `general` , `slowquery`
   *
   * *Oracle*
   *
   * Valid values: `alert` , `audit` , `listener` , `trace` , `oemagent`
   *
   * *PostgreSQL*
   *
   * Valid values: `postgresql` , `upgrade`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-enablecloudwatchlogsexports
   */
  readonly enableCloudwatchLogsExports?: Array<string>;

  /**
   * A value that indicates whether to enable mapping of AWS Identity and Access Management (IAM) accounts to database accounts.
   *
   * By default, mapping is disabled.
   *
   * This property is supported for RDS for MariaDB, RDS for MySQL, and RDS for PostgreSQL. For more information, see [IAM Database Authentication for MariaDB, MySQL, and PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) in the *Amazon RDS User Guide.*
   *
   * *Amazon Aurora*
   *
   * Not applicable. Mapping AWS IAM accounts to database accounts is managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-enableiamdatabaseauthentication
   */
  readonly enableIamDatabaseAuthentication?: boolean | cdk.IResolvable;

  /**
   * Specifies whether to enable Performance Insights for the DB instance.
   *
   * For more information, see [Using Amazon Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html) in the *Amazon RDS User Guide* .
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-enableperformanceinsights
   */
  readonly enablePerformanceInsights?: boolean | cdk.IResolvable;

  /**
   * The connection endpoint for the DB instance.
   *
   * > The endpoint might not be shown for instances with the status of `creating` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-endpoint
   */
  readonly endpoint?: CfnDBInstance.EndpointProperty | cdk.IResolvable;

  /**
   * The name of the database engine that you want to use for this DB instance.
   *
   * Not every database engine is available in every AWS Region.
   *
   * > When you are creating a DB instance, the `Engine` property is required.
   *
   * Valid Values:
   *
   * - `aurora-mysql` (for Aurora MySQL DB instances)
   * - `aurora-postgresql` (for Aurora PostgreSQL DB instances)
   * - `custom-oracle-ee` (for RDS Custom for Oracle DB instances)
   * - `custom-oracle-ee-cdb` (for RDS Custom for Oracle DB instances)
   * - `custom-sqlserver-ee` (for RDS Custom for SQL Server DB instances)
   * - `custom-sqlserver-se` (for RDS Custom for SQL Server DB instances)
   * - `custom-sqlserver-web` (for RDS Custom for SQL Server DB instances)
   * - `db2-ae`
   * - `db2-se`
   * - `mariadb`
   * - `mysql`
   * - `oracle-ee`
   * - `oracle-ee-cdb`
   * - `oracle-se2`
   * - `oracle-se2-cdb`
   * - `postgres`
   * - `sqlserver-ee`
   * - `sqlserver-se`
   * - `sqlserver-ex`
   * - `sqlserver-web`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-engine
   */
  readonly engine?: string;

  /**
   * The version number of the database engine to use.
   *
   * For a list of valid engine versions, use the `DescribeDBEngineVersions` action.
   *
   * The following are the database engines and links to information about the major and minor versions that are available with Amazon RDS. Not every database engine is available for every AWS Region.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The version number of the database engine to be used by the DB instance is managed by the DB cluster.
   *
   * *Db2*
   *
   * See [Amazon RDS for Db2](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Db2.html#Db2.Concepts.VersionMgmt) in the *Amazon RDS User Guide.*
   *
   * *MariaDB*
   *
   * See [MariaDB on Amazon RDS Versions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MariaDB.html#MariaDB.Concepts.VersionMgmt) in the *Amazon RDS User Guide.*
   *
   * *Microsoft SQL Server*
   *
   * See [Microsoft SQL Server Versions on Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_SQLServer.html#SQLServer.Concepts.General.VersionSupport) in the *Amazon RDS User Guide.*
   *
   * *MySQL*
   *
   * See [MySQL on Amazon RDS Versions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html#MySQL.Concepts.VersionMgmt) in the *Amazon RDS User Guide.*
   *
   * *Oracle*
   *
   * See [Oracle Database Engine Release Notes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.Oracle.PatchComposition.html) in the *Amazon RDS User Guide.*
   *
   * *PostgreSQL*
   *
   * See [Supported PostgreSQL Database Versions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.DBVersions) in the *Amazon RDS User Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-engineversion
   */
  readonly engineVersion?: string;

  /**
   * The number of I/O operations per second (IOPS) that the database provisions.
   *
   * The value must be equal to or greater than 1000.
   *
   * If you specify this property, you must follow the range of allowed ratios of your requested IOPS rate to the amount of storage that you allocate (IOPS to allocated storage). For example, you can provision an Oracle database instance with 1000 IOPS and 200 GiB of storage (a ratio of 5:1), or specify 2000 IOPS with 200 GiB of storage (a ratio of 10:1). For more information, see [Amazon RDS Provisioned IOPS Storage to Improve Performance](https://docs.aws.amazon.com/AmazonRDS/latest/DeveloperGuide/CHAP_Storage.html#USER_PIOPS) in the *Amazon RDS User Guide* .
   *
   * > If you specify `io1` for the `StorageType` property, then you must also specify the `Iops` property.
   *
   * Constraints:
   *
   * - For RDS for Db2, MariaDB, MySQL, Oracle, and PostgreSQL - Must be a multiple between .5 and 50 of the storage amount for the DB instance.
   * - For RDS for SQL Server - Must be a multiple between 1 and 50 of the storage amount for the DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-iops
   */
  readonly iops?: number;

  /**
   * The ARN of the AWS KMS key that's used to encrypt the DB instance, such as `arn:aws:kms:us-east-1:012345678910:key/abcd1234-a123-456a-a12b-a123b4cd56ef` .
   *
   * If you enable the StorageEncrypted property but don't specify this property, AWS CloudFormation uses the default KMS key. If you specify this property, you must set the StorageEncrypted property to true.
   *
   * If you specify the `SourceDBInstanceIdentifier` property, the value is inherited from the source DB instance if the read replica is created in the same region.
   *
   * If you create an encrypted read replica in a different AWS Region, then you must specify a KMS key for the destination AWS Region. KMS encryption keys are specific to the region that they're created in, and you can't use encryption keys from one region in another region.
   *
   * If you specify the `SnapshotIdentifier` property, the `StorageEncrypted` property value is inherited from the snapshot, and if the DB instance is encrypted, the specified `KmsKeyId` property is used.
   *
   * If you specify `DBSecurityGroups` , AWS CloudFormation ignores this property. To specify both a security group and this property, you must use a VPC security group. For more information about Amazon RDS and VPC, see [Using Amazon RDS with Amazon VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.html) in the *Amazon RDS User Guide* .
   *
   * *Amazon Aurora*
   *
   * Not applicable. The KMS key identifier is managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * License model information for this DB instance.
   *
   * Valid Values:
   *
   * - Aurora MySQL - `general-public-license`
   * - Aurora PostgreSQL - `postgresql-license`
   * - RDS for Db2 - `bring-your-own-license` . For more information about RDS for Db2 licensing, see [](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/db2-licensing.html) in the *Amazon RDS User Guide.*
   * - RDS for MariaDB - `general-public-license`
   * - RDS for Microsoft SQL Server - `license-included`
   * - RDS for MySQL - `general-public-license`
   * - RDS for Oracle - `bring-your-own-license` or `license-included`
   * - RDS for PostgreSQL - `postgresql-license`
   *
   * > If you've specified `DBSecurityGroups` and then you update the license model, AWS CloudFormation replaces the underlying DB instance. This will incur some interruptions to database availability.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-licensemodel
   */
  readonly licenseModel?: string;

  /**
   * Specifies whether to manage the master user password with AWS Secrets Manager.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide.*
   *
   * Constraints:
   *
   * - Can't manage the master user password with AWS Secrets Manager if `MasterUserPassword` is specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-managemasteruserpassword
   */
  readonly manageMasterUserPassword?: boolean | cdk.IResolvable;

  /**
   * The master user name for the DB instance.
   *
   * > If you specify the `SourceDBInstanceIdentifier` or `DBSnapshotIdentifier` property, don't specify this property. The value is inherited from the source DB instance or snapshot.
   * >
   * > When migrating a self-managed Db2 database, we recommend that you use the same master username as your self-managed Db2 instance name.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The name for the master user is managed by the DB cluster.
   *
   * *RDS for Db2*
   *
   * Constraints:
   *
   * - Must be 1 to 16 letters or numbers.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * *RDS for MariaDB*
   *
   * Constraints:
   *
   * - Must be 1 to 16 letters or numbers.
   * - Can't be a reserved word for the chosen database engine.
   *
   * *RDS for Microsoft SQL Server*
   *
   * Constraints:
   *
   * - Must be 1 to 128 letters or numbers.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * *RDS for MySQL*
   *
   * Constraints:
   *
   * - Must be 1 to 16 letters or numbers.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * *RDS for Oracle*
   *
   * Constraints:
   *
   * - Must be 1 to 30 letters or numbers.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * *RDS for PostgreSQL*
   *
   * Constraints:
   *
   * - Must be 1 to 63 letters or numbers.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-masterusername
   */
  readonly masterUsername?: string;

  /**
   * The password for the master user. The password can include any printable ASCII character except "/", """, or "@".
   *
   * *Amazon Aurora*
   *
   * Not applicable. The password for the master user is managed by the DB cluster.
   *
   * *RDS for Db2*
   *
   * Must contain from 8 to 255 characters.
   *
   * *RDS for MariaDB*
   *
   * Constraints: Must contain from 8 to 41 characters.
   *
   * *RDS for Microsoft SQL Server*
   *
   * Constraints: Must contain from 8 to 128 characters.
   *
   * *RDS for MySQL*
   *
   * Constraints: Must contain from 8 to 41 characters.
   *
   * *RDS for Oracle*
   *
   * Constraints: Must contain from 8 to 30 characters.
   *
   * *RDS for PostgreSQL*
   *
   * Constraints: Must contain from 8 to 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-masteruserpassword
   */
  readonly masterUserPassword?: string;

  /**
   * The secret managed by RDS in AWS Secrets Manager for the master user password.
   *
   * For more information, see [Password management with AWS Secrets Manager](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html) in the *Amazon RDS User Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-masterusersecret
   */
  readonly masterUserSecret?: cdk.IResolvable | CfnDBInstance.MasterUserSecretProperty;

  /**
   * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance.
   *
   * For more information about this setting, including limitations that apply to it, see [Managing capacity automatically with Amazon RDS storage autoscaling](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling) in the *Amazon RDS User Guide* .
   *
   * This setting doesn't apply to the following DB instances:
   *
   * - Amazon Aurora (Storage is managed by the DB cluster.)
   * - RDS Custom
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-maxallocatedstorage
   */
  readonly maxAllocatedStorage?: number;

  /**
   * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance.
   *
   * To disable collection of Enhanced Monitoring metrics, specify 0. The default is 0.
   *
   * If `MonitoringRoleArn` is specified, then you must set `MonitoringInterval` to a value other than 0.
   *
   * This setting doesn't apply to RDS Custom.
   *
   * Valid Values: `0, 1, 5, 10, 15, 30, 60`
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-monitoringinterval
   */
  readonly monitoringInterval?: number;

  /**
   * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs.
   *
   * For example, `arn:aws:iam:123456789012:role/emaccess` . For information on creating a monitoring role, see [Setting Up and Enabling Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html#USER_Monitoring.OS.Enabling) in the *Amazon RDS User Guide* .
   *
   * If `MonitoringInterval` is set to a value other than `0` , then you must supply a `MonitoringRoleArn` value.
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-monitoringrolearn
   */
  readonly monitoringRoleArn?: string;

  /**
   * Specifies whether the database instance is a Multi-AZ DB instance deployment.
   *
   * You can't set the `AvailabilityZone` parameter if the `MultiAZ` parameter is set to true.
   *
   * For more information, see [Multi-AZ deployments for high availability](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html) in the *Amazon RDS User Guide* .
   *
   * *Amazon Aurora*
   *
   * Not applicable. Amazon Aurora storage is replicated across all of the Availability Zones and doesn't require the `MultiAZ` option to be set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-multiaz
   */
  readonly multiAz?: boolean | cdk.IResolvable;

  /**
   * The name of the NCHAR character set for the Oracle DB instance.
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-ncharcharactersetname
   */
  readonly ncharCharacterSetName?: string;

  /**
   * The network type of the DB instance.
   *
   * Valid values:
   *
   * - `IPV4`
   * - `DUAL`
   *
   * The network type is determined by the `DBSubnetGroup` specified for the DB instance. A `DBSubnetGroup` can support only the IPv4 protocol or the IPv4 and IPv6 protocols ( `DUAL` ).
   *
   * For more information, see [Working with a DB instance in a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html) in the *Amazon RDS User Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-networktype
   */
  readonly networkType?: string;

  /**
   * Indicates that the DB instance should be associated with the specified option group.
   *
   * Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group. Also, that option group can't be removed from a DB instance once it is associated with a DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-optiongroupname
   */
  readonly optionGroupName?: string;

  /**
   * The AWS KMS key identifier for encryption of Performance Insights data.
   *
   * The KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
   *
   * If you do not specify a value for `PerformanceInsightsKMSKeyId` , then Amazon RDS uses your default KMS key. There is a default KMS key for your AWS account. Your AWS account has a different default KMS key for each AWS Region.
   *
   * For information about enabling Performance Insights, see [EnablePerformanceInsights](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-enableperformanceinsights) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-performanceinsightskmskeyid
   */
  readonly performanceInsightsKmsKeyId?: string;

  /**
   * The number of days to retain Performance Insights data.
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * Valid Values:
   *
   * - `7`
   * - *month* * 31, where *month* is a number of months from 1-23. Examples: `93` (3 months * 31), `341` (11 months * 31), `589` (19 months * 31)
   * - `731`
   *
   * Default: `7` days
   *
   * If you specify a retention period that isn't valid, such as `94` , Amazon RDS returns an error.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-performanceinsightsretentionperiod
   */
  readonly performanceInsightsRetentionPeriod?: number;

  /**
   * The port number on which the database accepts connections.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The port number is managed by the DB cluster.
   *
   * *Db2*
   *
   * Default value: `50000`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-port
   */
  readonly port?: string;

  /**
   * The daily time range during which automated backups are created if automated backups are enabled, using the `BackupRetentionPeriod` parameter.
   *
   * For more information, see [Backup Window](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow) in the *Amazon RDS User Guide.*
   *
   * Constraints:
   *
   * - Must be in the format `hh24:mi-hh24:mi` .
   * - Must be in Universal Coordinated Time (UTC).
   * - Must not conflict with the preferred maintenance window.
   * - Must be at least 30 minutes.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The daily time range for creating automated backups is managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   *
   * The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region, occurring on a random day of the week. To see the time blocks available, see [Adjusting the Preferred DB Instance Maintenance Window](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html#AdjustingTheMaintenanceWindow) in the *Amazon RDS User Guide.*
   *
   * > This property applies when AWS CloudFormation initially creates the DB instance. If you use AWS CloudFormation to update the DB instance, those updates are applied immediately.
   *
   * Constraints: Minimum 30-minute window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
   *
   * This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-processorfeatures
   */
  readonly processorFeatures?: Array<cdk.IResolvable | CfnDBInstance.ProcessorFeatureProperty> | cdk.IResolvable;

  /**
   * The order of priority in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance.
   *
   * For more information, see [Fault Tolerance for an Aurora DB Cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html#Aurora.Managing.FaultTolerance) in the *Amazon Aurora User Guide* .
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * Default: `1`
   *
   * Valid Values: `0 - 15`
   *
   * @default - 1
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-promotiontier
   */
  readonly promotionTier?: number;

  /**
   * Indicates whether the DB instance is an internet-facing instance.
   *
   * If you specify true, AWS CloudFormation creates an instance with a publicly resolvable DNS name, which resolves to a public IP address. If you specify false, AWS CloudFormation creates an internal instance with a DNS name that resolves to a private IP address.
   *
   * The default behavior value depends on your VPC setup and the database subnet group. For more information, see the `PubliclyAccessible` parameter in the [CreateDBInstance](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html) in the *Amazon RDS API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The open mode of an Oracle read replica.
   *
   * For more information, see [Working with Oracle Read Replicas for Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/oracle-read-replicas.html) in the *Amazon RDS User Guide* .
   *
   * This setting is only supported in RDS for Oracle.
   *
   * Default: `open-read-only`
   *
   * Valid Values: `open-read-only` or `mounted`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-replicamode
   */
  readonly replicaMode?: string;

  /**
   * The date and time to restore from.
   *
   * Constraints:
   *
   * - Must be a time in Universal Coordinated Time (UTC) format.
   * - Must be before the latest restorable time for the DB instance.
   * - Can't be specified if the `UseLatestRestorableTime` parameter is enabled.
   *
   * Example: `2009-09-07T23:45:00Z`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-restoretime
   */
  readonly restoreTime?: string;

  /**
   * The identifier of the Multi-AZ DB cluster that will act as the source for the read replica.
   *
   * Each DB cluster can have up to 15 read replicas.
   *
   * Constraints:
   *
   * - Must be the identifier of an existing Multi-AZ DB cluster.
   * - Can't be specified if the `SourceDBInstanceIdentifier` parameter is also specified.
   * - The specified DB cluster must have automatic backups enabled, that is, its backup retention period must be greater than 0.
   * - The source DB cluster must be in the same AWS Region as the read replica. Cross-Region replication isn't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-sourcedbclusteridentifier
   */
  readonly sourceDbClusterIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) of the replicated automated backups from which to restore, for example, `arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE` .
   *
   * This setting doesn't apply to RDS Custom.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-sourcedbinstanceautomatedbackupsarn
   */
  readonly sourceDbInstanceAutomatedBackupsArn?: string;

  /**
   * If you want to create a read replica DB instance, specify the ID of the source DB instance.
   *
   * Each DB instance can have a limited number of read replicas. For more information, see [Working with Read Replicas](https://docs.aws.amazon.com/AmazonRDS/latest/DeveloperGuide/USER_ReadRepl.html) in the *Amazon RDS User Guide* .
   *
   * For information about constraints that apply to DB instance identifiers, see [Naming constraints in Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints) in the *Amazon RDS User Guide* .
   *
   * The `SourceDBInstanceIdentifier` property determines whether a DB instance is a read replica. If you remove the `SourceDBInstanceIdentifier` property from your template and then update your stack, AWS CloudFormation promotes the Read Replica to a standalone DB instance.
   *
   * > - If you specify a source DB instance that uses VPC security groups, we recommend that you specify the `VPCSecurityGroups` property. If you don't specify the property, the read replica inherits the value of the `VPCSecurityGroups` property from the source DB when you create the replica. However, if you update the stack, AWS CloudFormation reverts the replica's `VPCSecurityGroups` property to the default value because it's not defined in the stack's template. This change might cause unexpected issues.
   * > - Read replicas don't support deletion policies. AWS CloudFormation ignores any deletion policy that's associated with a read replica.
   * > - If you specify `SourceDBInstanceIdentifier` , don't specify the `DBSnapshotIdentifier` property. You can't create a read replica from a snapshot.
   * > - Don't set the `BackupRetentionPeriod` , `DBName` , `MasterUsername` , `MasterUserPassword` , and `PreferredBackupWindow` properties. The database attributes are inherited from the source DB instance, and backups are disabled for read replicas.
   * > - If the source DB instance is in a different region than the read replica, specify the source region in `SourceRegion` , and specify an ARN for a valid DB instance in `SourceDBInstanceIdentifier` . For more information, see [Constructing a Amazon RDS Amazon Resource Name (ARN)](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Tagging.html#USER_Tagging.ARN) in the *Amazon RDS User Guide* .
   * > - For DB instances in Amazon Aurora clusters, don't specify this property. Amazon RDS automatically assigns writer and reader DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-sourcedbinstanceidentifier
   */
  readonly sourceDbInstanceIdentifier?: string;

  /**
   * The resource ID of the source DB instance from which to restore.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-sourcedbiresourceid
   */
  readonly sourceDbiResourceId?: string;

  /**
   * The ID of the region that contains the source DB instance for the read replica.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-sourceregion
   */
  readonly sourceRegion?: string;

  /**
   * A value that indicates whether the DB instance is encrypted. By default, it isn't encrypted.
   *
   * If you specify the `KmsKeyId` property, then you must enable encryption.
   *
   * If you specify the `SourceDBInstanceIdentifier` property, don't specify this property. The value is inherited from the source DB instance, and if the DB instance is encrypted, the specified `KmsKeyId` property is used.
   *
   * If you specify the `DBSnapshotIdentifier` and the specified snapshot is encrypted, don't specify this property. The value is inherited from the snapshot, and the specified `KmsKeyId` property is used.
   *
   * If you specify the `DBSnapshotIdentifier` and the specified snapshot isn't encrypted, you can use this property to specify that the restored DB instance is encrypted. Specify the `KmsKeyId` property for the KMS key to use for encryption. If you don't want the restored DB instance to be encrypted, then don't set this property or set it to `false` .
   *
   * *Amazon Aurora*
   *
   * Not applicable. The encryption for DB instances is managed by the DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-storageencrypted
   */
  readonly storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * Specifies the storage throughput value for the DB instance. This setting applies only to the `gp3` storage type.
   *
   * This setting doesn't apply to RDS Custom or Amazon Aurora.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-storagethroughput
   */
  readonly storageThroughput?: number;

  /**
   * Specifies the storage type to be associated with the DB instance.
   *
   * Valid values: `gp2 | gp3 | io1 | standard`
   *
   * The `standard` value is also known as magnetic.
   *
   * If you specify `io1` or `gp3` , you must also include a value for the `Iops` parameter.
   *
   * Default: `io1` if the `Iops` parameter is specified, otherwise `gp2`
   *
   * For more information, see [Amazon RDS DB Instance Storage](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html) in the *Amazon RDS User Guide* .
   *
   * *Amazon Aurora*
   *
   * Not applicable. Aurora data is stored in the cluster volume, which is a single, virtual volume that uses solid state drives (SSDs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-storagetype
   */
  readonly storageType?: string;

  /**
   * An optional array of key-value pairs to apply to this DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN from the key store with which to associate the instance for TDE encryption.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-tdecredentialarn
   */
  readonly tdeCredentialArn?: string;

  /**
   * The password for the given ARN from the key store in order to access the device.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-tdecredentialpassword
   */
  readonly tdeCredentialPassword?: string;

  /**
   * The time zone of the DB instance.
   *
   * The time zone parameter is currently supported only by [Microsoft SQL Server](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_SQLServer.html#SQLServer.Concepts.General.TimeZone) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-timezone
   */
  readonly timezone?: string;

  /**
   * Specifies whether the DB instance class of the DB instance uses its default processor features.
   *
   * This setting doesn't apply to RDS Custom DB instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-usedefaultprocessorfeatures
   */
  readonly useDefaultProcessorFeatures?: boolean | cdk.IResolvable;

  /**
   * Specifies whether the DB instance is restored from the latest backup time.
   *
   * By default, the DB instance isn't restored from the latest backup time.
   *
   * Constraints:
   *
   * - Can't be specified if the `RestoreTime` parameter is provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-uselatestrestorabletime
   */
  readonly useLatestRestorableTime?: boolean | cdk.IResolvable;

  /**
   * A list of the VPC security group IDs to assign to the DB instance.
   *
   * The list can include both the physical IDs of existing VPC security groups and references to [AWS::EC2::SecurityGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html) resources created in the template.
   *
   * If you plan to update the resource, don't specify VPC security groups in a shared VPC.
   *
   * If you set `VPCSecurityGroups` , you must not set [`DBSecurityGroups`](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-dbsecuritygroups) , and vice versa.
   *
   * > You can migrate a DB instance in your stack from an RDS DB security group to a VPC security group, but keep the following in mind:
   * >
   * > - You can't revert to using an RDS security group after you establish a VPC security group membership.
   * > - When you migrate your DB instance to VPC security groups, if your stack update rolls back because the DB instance update fails or because an update fails in another AWS CloudFormation resource, the rollback fails because it can't revert to an RDS security group.
   * > - To use the properties that are available when you use a VPC security group, you must recreate the DB instance. If you don't, AWS CloudFormation submits only the property values that are listed in the [`DBSecurityGroups`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-dbsecuritygroups) property.
   *
   * To avoid this situation, migrate your DB instance to using VPC security groups only when that is the only change in your stack template.
   *
   * *Amazon Aurora*
   *
   * Not applicable. The associated list of EC2 VPC security groups is managed by the DB cluster. If specified, the setting must match the DB cluster setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html#cfn-rds-dbinstance-vpcsecuritygroups
   */
  readonly vpcSecurityGroups?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CertificateDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstanceCertificateDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caIdentifier", cdk.validateString)(properties.caIdentifier));
  errors.collect(cdk.propertyValidator("validTill", cdk.validateString)(properties.validTill));
  return errors.wrap("supplied properties not correct for \"CertificateDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBInstanceCertificateDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstanceCertificateDetailsPropertyValidator(properties).assertSuccess();
  return {
    "CAIdentifier": cdk.stringToCloudFormation(properties.caIdentifier),
    "ValidTill": cdk.stringToCloudFormation(properties.validTill)
  };
}

// @ts-ignore TS6133
function CfnDBInstanceCertificateDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBInstance.CertificateDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstance.CertificateDetailsProperty>();
  ret.addPropertyResult("caIdentifier", "CAIdentifier", (properties.CAIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CAIdentifier) : undefined));
  ret.addPropertyResult("validTill", "ValidTill", (properties.ValidTill != null ? cfn_parse.FromCloudFormation.getString(properties.ValidTill) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstanceEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("hostedZoneId", cdk.validateString)(properties.hostedZoneId));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  return errors.wrap("supplied properties not correct for \"EndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBInstanceEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstanceEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "HostedZoneId": cdk.stringToCloudFormation(properties.hostedZoneId),
    "Port": cdk.stringToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnDBInstanceEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBInstance.EndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstance.EndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("hostedZoneId", "HostedZoneId", (properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MasterUserSecretProperty`
 *
 * @param properties - the TypeScript properties of a `MasterUserSecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstanceMasterUserSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"MasterUserSecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBInstanceMasterUserSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstanceMasterUserSecretPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnDBInstanceMasterUserSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBInstance.MasterUserSecretProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstance.MasterUserSecretProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DBInstanceRoleProperty`
 *
 * @param properties - the TypeScript properties of a `DBInstanceRoleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstanceDBInstanceRolePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("featureName", cdk.requiredValidator)(properties.featureName));
  errors.collect(cdk.propertyValidator("featureName", cdk.validateString)(properties.featureName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"DBInstanceRoleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBInstanceDBInstanceRolePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstanceDBInstanceRolePropertyValidator(properties).assertSuccess();
  return {
    "FeatureName": cdk.stringToCloudFormation(properties.featureName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDBInstanceDBInstanceRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBInstance.DBInstanceRoleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstance.DBInstanceRoleProperty>();
  ret.addPropertyResult("featureName", "FeatureName", (properties.FeatureName != null ? cfn_parse.FromCloudFormation.getString(properties.FeatureName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProcessorFeatureProperty`
 *
 * @param properties - the TypeScript properties of a `ProcessorFeatureProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBInstanceProcessorFeaturePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ProcessorFeatureProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBInstanceProcessorFeaturePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstanceProcessorFeaturePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDBInstanceProcessorFeaturePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBInstance.ProcessorFeatureProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstance.ProcessorFeatureProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
  errors.collect(cdk.propertyValidator("allocatedStorage", cdk.validateString)(properties.allocatedStorage));
  errors.collect(cdk.propertyValidator("allowMajorVersionUpgrade", cdk.validateBoolean)(properties.allowMajorVersionUpgrade));
  errors.collect(cdk.propertyValidator("associatedRoles", cdk.listValidator(CfnDBInstanceDBInstanceRolePropertyValidator))(properties.associatedRoles));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("automaticBackupReplicationRegion", cdk.validateString)(properties.automaticBackupReplicationRegion));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("backupRetentionPeriod", cdk.validateNumber)(properties.backupRetentionPeriod));
  errors.collect(cdk.propertyValidator("caCertificateIdentifier", cdk.validateString)(properties.caCertificateIdentifier));
  errors.collect(cdk.propertyValidator("certificateDetails", CfnDBInstanceCertificateDetailsPropertyValidator)(properties.certificateDetails));
  errors.collect(cdk.propertyValidator("certificateRotationRestart", cdk.validateBoolean)(properties.certificateRotationRestart));
  errors.collect(cdk.propertyValidator("characterSetName", cdk.validateString)(properties.characterSetName));
  errors.collect(cdk.propertyValidator("copyTagsToSnapshot", cdk.validateBoolean)(properties.copyTagsToSnapshot));
  errors.collect(cdk.propertyValidator("customIamInstanceProfile", cdk.validateString)(properties.customIamInstanceProfile));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterSnapshotIdentifier", cdk.validateString)(properties.dbClusterSnapshotIdentifier));
  errors.collect(cdk.propertyValidator("dbInstanceClass", cdk.validateString)(properties.dbInstanceClass));
  errors.collect(cdk.propertyValidator("dbInstanceIdentifier", cdk.validateString)(properties.dbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("dbName", cdk.validateString)(properties.dbName));
  errors.collect(cdk.propertyValidator("dbParameterGroupName", cdk.validateString)(properties.dbParameterGroupName));
  errors.collect(cdk.propertyValidator("dbSecurityGroups", cdk.listValidator(cdk.validateString))(properties.dbSecurityGroups));
  errors.collect(cdk.propertyValidator("dbSnapshotIdentifier", cdk.validateString)(properties.dbSnapshotIdentifier));
  errors.collect(cdk.propertyValidator("dbSubnetGroupName", cdk.validateString)(properties.dbSubnetGroupName));
  errors.collect(cdk.propertyValidator("dedicatedLogVolume", cdk.validateBoolean)(properties.dedicatedLogVolume));
  errors.collect(cdk.propertyValidator("deleteAutomatedBackups", cdk.validateBoolean)(properties.deleteAutomatedBackups));
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("domainAuthSecretArn", cdk.validateString)(properties.domainAuthSecretArn));
  errors.collect(cdk.propertyValidator("domainDnsIps", cdk.listValidator(cdk.validateString))(properties.domainDnsIps));
  errors.collect(cdk.propertyValidator("domainFqdn", cdk.validateString)(properties.domainFqdn));
  errors.collect(cdk.propertyValidator("domainIamRoleName", cdk.validateString)(properties.domainIamRoleName));
  errors.collect(cdk.propertyValidator("domainOu", cdk.validateString)(properties.domainOu));
  errors.collect(cdk.propertyValidator("enableCloudwatchLogsExports", cdk.listValidator(cdk.validateString))(properties.enableCloudwatchLogsExports));
  errors.collect(cdk.propertyValidator("enableIamDatabaseAuthentication", cdk.validateBoolean)(properties.enableIamDatabaseAuthentication));
  errors.collect(cdk.propertyValidator("enablePerformanceInsights", cdk.validateBoolean)(properties.enablePerformanceInsights));
  errors.collect(cdk.propertyValidator("endpoint", CfnDBInstanceEndpointPropertyValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("licenseModel", cdk.validateString)(properties.licenseModel));
  errors.collect(cdk.propertyValidator("manageMasterUserPassword", cdk.validateBoolean)(properties.manageMasterUserPassword));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  errors.collect(cdk.propertyValidator("masterUserSecret", CfnDBInstanceMasterUserSecretPropertyValidator)(properties.masterUserSecret));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.validateString)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("maxAllocatedStorage", cdk.validateNumber)(properties.maxAllocatedStorage));
  errors.collect(cdk.propertyValidator("monitoringInterval", cdk.validateNumber)(properties.monitoringInterval));
  errors.collect(cdk.propertyValidator("monitoringRoleArn", cdk.validateString)(properties.monitoringRoleArn));
  errors.collect(cdk.propertyValidator("multiAz", cdk.validateBoolean)(properties.multiAz));
  errors.collect(cdk.propertyValidator("ncharCharacterSetName", cdk.validateString)(properties.ncharCharacterSetName));
  errors.collect(cdk.propertyValidator("networkType", cdk.validateString)(properties.networkType));
  errors.collect(cdk.propertyValidator("optionGroupName", cdk.validateString)(properties.optionGroupName));
  errors.collect(cdk.propertyValidator("performanceInsightsKmsKeyId", cdk.validateString)(properties.performanceInsightsKmsKeyId));
  errors.collect(cdk.propertyValidator("performanceInsightsRetentionPeriod", cdk.validateNumber)(properties.performanceInsightsRetentionPeriod));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("processorFeatures", cdk.listValidator(CfnDBInstanceProcessorFeaturePropertyValidator))(properties.processorFeatures));
  errors.collect(cdk.propertyValidator("promotionTier", cdk.validateNumber)(properties.promotionTier));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("replicaMode", cdk.validateString)(properties.replicaMode));
  errors.collect(cdk.propertyValidator("restoreTime", cdk.validateString)(properties.restoreTime));
  errors.collect(cdk.propertyValidator("sourceDbClusterIdentifier", cdk.validateString)(properties.sourceDbClusterIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbInstanceAutomatedBackupsArn", cdk.validateString)(properties.sourceDbInstanceAutomatedBackupsArn));
  errors.collect(cdk.propertyValidator("sourceDbInstanceIdentifier", cdk.validateString)(properties.sourceDbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbiResourceId", cdk.validateString)(properties.sourceDbiResourceId));
  errors.collect(cdk.propertyValidator("sourceRegion", cdk.validateString)(properties.sourceRegion));
  errors.collect(cdk.propertyValidator("storageEncrypted", cdk.validateBoolean)(properties.storageEncrypted));
  errors.collect(cdk.propertyValidator("storageThroughput", cdk.validateNumber)(properties.storageThroughput));
  errors.collect(cdk.propertyValidator("storageType", cdk.validateString)(properties.storageType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tdeCredentialArn", cdk.validateString)(properties.tdeCredentialArn));
  errors.collect(cdk.propertyValidator("tdeCredentialPassword", cdk.validateString)(properties.tdeCredentialPassword));
  errors.collect(cdk.propertyValidator("timezone", cdk.validateString)(properties.timezone));
  errors.collect(cdk.propertyValidator("useDefaultProcessorFeatures", cdk.validateBoolean)(properties.useDefaultProcessorFeatures));
  errors.collect(cdk.propertyValidator("useLatestRestorableTime", cdk.validateBoolean)(properties.useLatestRestorableTime));
  errors.collect(cdk.propertyValidator("vpcSecurityGroups", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroups));
  return errors.wrap("supplied properties not correct for \"CfnDBInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnDBInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBInstancePropsValidator(properties).assertSuccess();
  return {
    "AllocatedStorage": cdk.stringToCloudFormation(properties.allocatedStorage),
    "AllowMajorVersionUpgrade": cdk.booleanToCloudFormation(properties.allowMajorVersionUpgrade),
    "AssociatedRoles": cdk.listMapper(convertCfnDBInstanceDBInstanceRolePropertyToCloudFormation)(properties.associatedRoles),
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "AutomaticBackupReplicationRegion": cdk.stringToCloudFormation(properties.automaticBackupReplicationRegion),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "BackupRetentionPeriod": cdk.numberToCloudFormation(properties.backupRetentionPeriod),
    "CACertificateIdentifier": cdk.stringToCloudFormation(properties.caCertificateIdentifier),
    "CertificateDetails": convertCfnDBInstanceCertificateDetailsPropertyToCloudFormation(properties.certificateDetails),
    "CertificateRotationRestart": cdk.booleanToCloudFormation(properties.certificateRotationRestart),
    "CharacterSetName": cdk.stringToCloudFormation(properties.characterSetName),
    "CopyTagsToSnapshot": cdk.booleanToCloudFormation(properties.copyTagsToSnapshot),
    "CustomIAMInstanceProfile": cdk.stringToCloudFormation(properties.customIamInstanceProfile),
    "DBClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "DBClusterSnapshotIdentifier": cdk.stringToCloudFormation(properties.dbClusterSnapshotIdentifier),
    "DBInstanceClass": cdk.stringToCloudFormation(properties.dbInstanceClass),
    "DBInstanceIdentifier": cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
    "DBName": cdk.stringToCloudFormation(properties.dbName),
    "DBParameterGroupName": cdk.stringToCloudFormation(properties.dbParameterGroupName),
    "DBSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.dbSecurityGroups),
    "DBSnapshotIdentifier": cdk.stringToCloudFormation(properties.dbSnapshotIdentifier),
    "DBSubnetGroupName": cdk.stringToCloudFormation(properties.dbSubnetGroupName),
    "DedicatedLogVolume": cdk.booleanToCloudFormation(properties.dedicatedLogVolume),
    "DeleteAutomatedBackups": cdk.booleanToCloudFormation(properties.deleteAutomatedBackups),
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "DomainAuthSecretArn": cdk.stringToCloudFormation(properties.domainAuthSecretArn),
    "DomainDnsIps": cdk.listMapper(cdk.stringToCloudFormation)(properties.domainDnsIps),
    "DomainFqdn": cdk.stringToCloudFormation(properties.domainFqdn),
    "DomainIAMRoleName": cdk.stringToCloudFormation(properties.domainIamRoleName),
    "DomainOu": cdk.stringToCloudFormation(properties.domainOu),
    "EnableCloudwatchLogsExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.enableCloudwatchLogsExports),
    "EnableIAMDatabaseAuthentication": cdk.booleanToCloudFormation(properties.enableIamDatabaseAuthentication),
    "EnablePerformanceInsights": cdk.booleanToCloudFormation(properties.enablePerformanceInsights),
    "Endpoint": convertCfnDBInstanceEndpointPropertyToCloudFormation(properties.endpoint),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LicenseModel": cdk.stringToCloudFormation(properties.licenseModel),
    "ManageMasterUserPassword": cdk.booleanToCloudFormation(properties.manageMasterUserPassword),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword),
    "MasterUserSecret": convertCfnDBInstanceMasterUserSecretPropertyToCloudFormation(properties.masterUserSecret),
    "MasterUsername": cdk.stringToCloudFormation(properties.masterUsername),
    "MaxAllocatedStorage": cdk.numberToCloudFormation(properties.maxAllocatedStorage),
    "MonitoringInterval": cdk.numberToCloudFormation(properties.monitoringInterval),
    "MonitoringRoleArn": cdk.stringToCloudFormation(properties.monitoringRoleArn),
    "MultiAZ": cdk.booleanToCloudFormation(properties.multiAz),
    "NcharCharacterSetName": cdk.stringToCloudFormation(properties.ncharCharacterSetName),
    "NetworkType": cdk.stringToCloudFormation(properties.networkType),
    "OptionGroupName": cdk.stringToCloudFormation(properties.optionGroupName),
    "PerformanceInsightsKMSKeyId": cdk.stringToCloudFormation(properties.performanceInsightsKmsKeyId),
    "PerformanceInsightsRetentionPeriod": cdk.numberToCloudFormation(properties.performanceInsightsRetentionPeriod),
    "Port": cdk.stringToCloudFormation(properties.port),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "ProcessorFeatures": cdk.listMapper(convertCfnDBInstanceProcessorFeaturePropertyToCloudFormation)(properties.processorFeatures),
    "PromotionTier": cdk.numberToCloudFormation(properties.promotionTier),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "ReplicaMode": cdk.stringToCloudFormation(properties.replicaMode),
    "RestoreTime": cdk.stringToCloudFormation(properties.restoreTime),
    "SourceDBClusterIdentifier": cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
    "SourceDBInstanceAutomatedBackupsArn": cdk.stringToCloudFormation(properties.sourceDbInstanceAutomatedBackupsArn),
    "SourceDBInstanceIdentifier": cdk.stringToCloudFormation(properties.sourceDbInstanceIdentifier),
    "SourceDbiResourceId": cdk.stringToCloudFormation(properties.sourceDbiResourceId),
    "SourceRegion": cdk.stringToCloudFormation(properties.sourceRegion),
    "StorageEncrypted": cdk.booleanToCloudFormation(properties.storageEncrypted),
    "StorageThroughput": cdk.numberToCloudFormation(properties.storageThroughput),
    "StorageType": cdk.stringToCloudFormation(properties.storageType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TdeCredentialArn": cdk.stringToCloudFormation(properties.tdeCredentialArn),
    "TdeCredentialPassword": cdk.stringToCloudFormation(properties.tdeCredentialPassword),
    "Timezone": cdk.stringToCloudFormation(properties.timezone),
    "UseDefaultProcessorFeatures": cdk.booleanToCloudFormation(properties.useDefaultProcessorFeatures),
    "UseLatestRestorableTime": cdk.booleanToCloudFormation(properties.useLatestRestorableTime),
    "VPCSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroups)
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
  ret.addPropertyResult("allocatedStorage", "AllocatedStorage", (properties.AllocatedStorage != null ? cfn_parse.FromCloudFormation.getString(properties.AllocatedStorage) : undefined));
  ret.addPropertyResult("allowMajorVersionUpgrade", "AllowMajorVersionUpgrade", (properties.AllowMajorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowMajorVersionUpgrade) : undefined));
  ret.addPropertyResult("associatedRoles", "AssociatedRoles", (properties.AssociatedRoles != null ? cfn_parse.FromCloudFormation.getArray(CfnDBInstanceDBInstanceRolePropertyFromCloudFormation)(properties.AssociatedRoles) : undefined));
  ret.addPropertyResult("automaticBackupReplicationRegion", "AutomaticBackupReplicationRegion", (properties.AutomaticBackupReplicationRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AutomaticBackupReplicationRegion) : undefined));
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("backupRetentionPeriod", "BackupRetentionPeriod", (properties.BackupRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionPeriod) : undefined));
  ret.addPropertyResult("caCertificateIdentifier", "CACertificateIdentifier", (properties.CACertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CACertificateIdentifier) : undefined));
  ret.addPropertyResult("certificateDetails", "CertificateDetails", (properties.CertificateDetails != null ? CfnDBInstanceCertificateDetailsPropertyFromCloudFormation(properties.CertificateDetails) : undefined));
  ret.addPropertyResult("certificateRotationRestart", "CertificateRotationRestart", (properties.CertificateRotationRestart != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CertificateRotationRestart) : undefined));
  ret.addPropertyResult("characterSetName", "CharacterSetName", (properties.CharacterSetName != null ? cfn_parse.FromCloudFormation.getString(properties.CharacterSetName) : undefined));
  ret.addPropertyResult("copyTagsToSnapshot", "CopyTagsToSnapshot", (properties.CopyTagsToSnapshot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshot) : undefined));
  ret.addPropertyResult("customIamInstanceProfile", "CustomIAMInstanceProfile", (properties.CustomIAMInstanceProfile != null ? cfn_parse.FromCloudFormation.getString(properties.CustomIAMInstanceProfile) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DBClusterIdentifier", (properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined));
  ret.addPropertyResult("dbClusterSnapshotIdentifier", "DBClusterSnapshotIdentifier", (properties.DBClusterSnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterSnapshotIdentifier) : undefined));
  ret.addPropertyResult("dbInstanceClass", "DBInstanceClass", (properties.DBInstanceClass != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceClass) : undefined));
  ret.addPropertyResult("dbInstanceIdentifier", "DBInstanceIdentifier", (properties.DBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier) : undefined));
  ret.addPropertyResult("dbName", "DBName", (properties.DBName != null ? cfn_parse.FromCloudFormation.getString(properties.DBName) : undefined));
  ret.addPropertyResult("dbParameterGroupName", "DBParameterGroupName", (properties.DBParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBParameterGroupName) : undefined));
  ret.addPropertyResult("dbSecurityGroups", "DBSecurityGroups", (properties.DBSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DBSecurityGroups) : undefined));
  ret.addPropertyResult("dbSnapshotIdentifier", "DBSnapshotIdentifier", (properties.DBSnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBSnapshotIdentifier) : undefined));
  ret.addPropertyResult("dbSubnetGroupName", "DBSubnetGroupName", (properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined));
  ret.addPropertyResult("dedicatedLogVolume", "DedicatedLogVolume", (properties.DedicatedLogVolume != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DedicatedLogVolume) : undefined));
  ret.addPropertyResult("deleteAutomatedBackups", "DeleteAutomatedBackups", (properties.DeleteAutomatedBackups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteAutomatedBackups) : undefined));
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("domainAuthSecretArn", "DomainAuthSecretArn", (properties.DomainAuthSecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.DomainAuthSecretArn) : undefined));
  ret.addPropertyResult("domainDnsIps", "DomainDnsIps", (properties.DomainDnsIps != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DomainDnsIps) : undefined));
  ret.addPropertyResult("domainFqdn", "DomainFqdn", (properties.DomainFqdn != null ? cfn_parse.FromCloudFormation.getString(properties.DomainFqdn) : undefined));
  ret.addPropertyResult("domainIamRoleName", "DomainIAMRoleName", (properties.DomainIAMRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainIAMRoleName) : undefined));
  ret.addPropertyResult("domainOu", "DomainOu", (properties.DomainOu != null ? cfn_parse.FromCloudFormation.getString(properties.DomainOu) : undefined));
  ret.addPropertyResult("enableCloudwatchLogsExports", "EnableCloudwatchLogsExports", (properties.EnableCloudwatchLogsExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EnableCloudwatchLogsExports) : undefined));
  ret.addPropertyResult("enableIamDatabaseAuthentication", "EnableIAMDatabaseAuthentication", (properties.EnableIAMDatabaseAuthentication != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableIAMDatabaseAuthentication) : undefined));
  ret.addPropertyResult("enablePerformanceInsights", "EnablePerformanceInsights", (properties.EnablePerformanceInsights != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePerformanceInsights) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? CfnDBInstanceEndpointPropertyFromCloudFormation(properties.Endpoint) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("licenseModel", "LicenseModel", (properties.LicenseModel != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseModel) : undefined));
  ret.addPropertyResult("manageMasterUserPassword", "ManageMasterUserPassword", (properties.ManageMasterUserPassword != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ManageMasterUserPassword) : undefined));
  ret.addPropertyResult("masterUsername", "MasterUsername", (properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addPropertyResult("masterUserSecret", "MasterUserSecret", (properties.MasterUserSecret != null ? CfnDBInstanceMasterUserSecretPropertyFromCloudFormation(properties.MasterUserSecret) : undefined));
  ret.addPropertyResult("maxAllocatedStorage", "MaxAllocatedStorage", (properties.MaxAllocatedStorage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAllocatedStorage) : undefined));
  ret.addPropertyResult("monitoringInterval", "MonitoringInterval", (properties.MonitoringInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.MonitoringInterval) : undefined));
  ret.addPropertyResult("monitoringRoleArn", "MonitoringRoleArn", (properties.MonitoringRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.MonitoringRoleArn) : undefined));
  ret.addPropertyResult("multiAz", "MultiAZ", (properties.MultiAZ != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiAZ) : undefined));
  ret.addPropertyResult("ncharCharacterSetName", "NcharCharacterSetName", (properties.NcharCharacterSetName != null ? cfn_parse.FromCloudFormation.getString(properties.NcharCharacterSetName) : undefined));
  ret.addPropertyResult("networkType", "NetworkType", (properties.NetworkType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkType) : undefined));
  ret.addPropertyResult("optionGroupName", "OptionGroupName", (properties.OptionGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.OptionGroupName) : undefined));
  ret.addPropertyResult("performanceInsightsKmsKeyId", "PerformanceInsightsKMSKeyId", (properties.PerformanceInsightsKMSKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.PerformanceInsightsKMSKeyId) : undefined));
  ret.addPropertyResult("performanceInsightsRetentionPeriod", "PerformanceInsightsRetentionPeriod", (properties.PerformanceInsightsRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PerformanceInsightsRetentionPeriod) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("processorFeatures", "ProcessorFeatures", (properties.ProcessorFeatures != null ? cfn_parse.FromCloudFormation.getArray(CfnDBInstanceProcessorFeaturePropertyFromCloudFormation)(properties.ProcessorFeatures) : undefined));
  ret.addPropertyResult("promotionTier", "PromotionTier", (properties.PromotionTier != null ? cfn_parse.FromCloudFormation.getNumber(properties.PromotionTier) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("replicaMode", "ReplicaMode", (properties.ReplicaMode != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicaMode) : undefined));
  ret.addPropertyResult("restoreTime", "RestoreTime", (properties.RestoreTime != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreTime) : undefined));
  ret.addPropertyResult("sourceDbClusterIdentifier", "SourceDBClusterIdentifier", (properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined));
  ret.addPropertyResult("sourceDbInstanceAutomatedBackupsArn", "SourceDBInstanceAutomatedBackupsArn", (properties.SourceDBInstanceAutomatedBackupsArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBInstanceAutomatedBackupsArn) : undefined));
  ret.addPropertyResult("sourceDbInstanceIdentifier", "SourceDBInstanceIdentifier", (properties.SourceDBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBInstanceIdentifier) : undefined));
  ret.addPropertyResult("sourceDbiResourceId", "SourceDbiResourceId", (properties.SourceDbiResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDbiResourceId) : undefined));
  ret.addPropertyResult("sourceRegion", "SourceRegion", (properties.SourceRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SourceRegion) : undefined));
  ret.addPropertyResult("storageEncrypted", "StorageEncrypted", (properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined));
  ret.addPropertyResult("storageThroughput", "StorageThroughput", (properties.StorageThroughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageThroughput) : undefined));
  ret.addPropertyResult("storageType", "StorageType", (properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tdeCredentialArn", "TdeCredentialArn", (properties.TdeCredentialArn != null ? cfn_parse.FromCloudFormation.getString(properties.TdeCredentialArn) : undefined));
  ret.addPropertyResult("tdeCredentialPassword", "TdeCredentialPassword", (properties.TdeCredentialPassword != null ? cfn_parse.FromCloudFormation.getString(properties.TdeCredentialPassword) : undefined));
  ret.addPropertyResult("timezone", "Timezone", (properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined));
  ret.addPropertyResult("useDefaultProcessorFeatures", "UseDefaultProcessorFeatures", (properties.UseDefaultProcessorFeatures != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseDefaultProcessorFeatures) : undefined));
  ret.addPropertyResult("useLatestRestorableTime", "UseLatestRestorableTime", (properties.UseLatestRestorableTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLatestRestorableTime) : undefined));
  ret.addPropertyResult("vpcSecurityGroups", "VPCSecurityGroups", (properties.VPCSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VPCSecurityGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBParameterGroup` resource creates a custom parameter group for an RDS database family.
 *
 * This type can be declared in a template and referenced in the `DBParameterGroupName` property of an `[AWS::RDS::DBInstance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html)` resource.
 *
 * For information about configuring parameters for Amazon RDS DB instances, see [Working with parameter groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html) in the *Amazon RDS User Guide* .
 *
 * For information about configuring parameters for Amazon Aurora DB instances, see [Working with parameter groups](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_WorkingWithParamGroups.html) in the *Amazon Aurora User Guide* .
 *
 * > Applying a parameter group to a DB instance may require the DB instance to reboot, resulting in a database outage for the duration of the reboot.
 *
 * @cloudformationResource AWS::RDS::DBParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html
 */
export class CfnDBParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBParameterGroup";

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
   * The name of the DB parameter group.
   *
   * @cloudformationAttribute DBParameterGroupName
   */
  public readonly attrDbParameterGroupName: string;

  /**
   * The name of the DB parameter group.
   */
  public dbParameterGroupName?: string;

  /**
   * Provides the customer-specified description for this DB parameter group.
   */
  public description: string;

  /**
   * The DB parameter group family name.
   */
  public family: string;

  /**
   * An array of parameter names and values for the parameter update.
   */
  public parameters?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this DB parameter group.
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

    this.attrDbParameterGroupName = cdk.Token.asString(this.getAtt("DBParameterGroupName", cdk.ResolutionTypeHint.STRING));
    this.dbParameterGroupName = props.dbParameterGroupName;
    this.description = props.description;
    this.family = props.family;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dbParameterGroupName": this.dbParameterGroupName,
      "description": this.description,
      "family": this.family,
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html
 */
export interface CfnDBParameterGroupProps {
  /**
   * The name of the DB parameter group.
   *
   * Constraints:
   *
   * - Must be 1 to 255 letters, numbers, or hyphens.
   * - First character must be a letter
   * - Can't end with a hyphen or contain two consecutive hyphens
   *
   * If you don't specify a value for `DBParameterGroupName` property, a name is automatically created for the DB parameter group.
   *
   * > This value is stored as a lowercase string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html#cfn-rds-dbparametergroup-dbparametergroupname
   */
  readonly dbParameterGroupName?: string;

  /**
   * Provides the customer-specified description for this DB parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html#cfn-rds-dbparametergroup-description
   */
  readonly description: string;

  /**
   * The DB parameter group family name.
   *
   * A DB parameter group can be associated with one and only one DB parameter group family, and can be applied only to a DB instance running a DB engine and engine version compatible with that DB parameter group family.
   *
   * > The DB parameter group family can't be changed when updating a DB parameter group.
   *
   * To list all of the available parameter group families, use the following command:
   *
   * `aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily"`
   *
   * The output contains duplicates.
   *
   * For more information, see `[CreateDBParameterGroup](https://docs.aws.amazon.com//AmazonRDS/latest/APIReference/API_CreateDBParameterGroup.html)` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html#cfn-rds-dbparametergroup-family
   */
  readonly family: string;

  /**
   * An array of parameter names and values for the parameter update.
   *
   * At least one parameter name and value must be supplied. Subsequent arguments are optional.
   *
   * RDS for Db2 requires you to bring your own Db2 license. You must enter your IBM customer ID ( `rds.ibm_customer_id` ) and site number ( `rds.ibm_site_id` ) before starting a Db2 instance.
   *
   * For more information about DB parameters and DB parameter groups for Amazon RDS DB engines, see [Working with DB Parameter Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html) in the *Amazon RDS User Guide* .
   *
   * For more information about DB cluster and DB instance parameters and parameter groups for Amazon Aurora DB engines, see [Working with DB Parameter Groups and DB Cluster Parameter Groups](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_WorkingWithParamGroups.html) in the *Amazon Aurora User Guide* .
   *
   * > AWS CloudFormation doesn't support specifying an apply method for each individual parameter. The default apply method for each parameter is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html#cfn-rds-dbparametergroup-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * An optional array of key-value pairs to apply to this DB parameter group.
   *
   * > Currently, this is the only property that supports drift detection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbparametergroup.html#cfn-rds-dbparametergroup-tags
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
  errors.collect(cdk.propertyValidator("dbParameterGroupName", cdk.validateString)(properties.dbParameterGroupName));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("family", cdk.requiredValidator)(properties.family));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "DBParameterGroupName": cdk.stringToCloudFormation(properties.dbParameterGroupName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Family": cdk.stringToCloudFormation(properties.family),
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
  ret.addPropertyResult("dbParameterGroupName", "DBParameterGroupName", (properties.DBParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBParameterGroupName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBProxy` resource creates or updates a DB proxy.
 *
 * For information about RDS Proxy for Amazon RDS, see [Managing Connections with Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) in the *Amazon RDS User Guide* .
 *
 * For information about RDS Proxy for Amazon Aurora, see [Managing Connections with Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy.html) in the *Amazon Aurora User Guide* .
 *
 * > Limitations apply to RDS Proxy, including DB engine version limitations and AWS Region limitations.
 * >
 * > For information about limitations that apply to RDS Proxy for Amazon RDS, see [Limitations for RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy.limitations) in the *Amazon RDS User Guide* .
 * >
 * > For information about that apply to RDS Proxy for Amazon Aurora, see [Limitations for RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy.html#rds-proxy.limitations) in the *Amazon Aurora User Guide* .
 *
 * @cloudformationResource AWS::RDS::DBProxy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html
 */
export class CfnDBProxy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBProxy";

  /**
   * Build a CfnDBProxy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBProxy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBProxyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBProxy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) representing the target group.
   *
   * @cloudformationAttribute DBProxyArn
   */
  public readonly attrDbProxyArn: string;

  /**
   * The writer endpoint for the RDS DB instance or Aurora DB cluster.
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * The VPC ID to associate with the DB proxy.
   *
   * @cloudformationAttribute VpcId
   */
  public readonly attrVpcId: string;

  /**
   * The authorization mechanism that the proxy uses.
   */
  public auth: Array<CfnDBProxy.AuthFormatProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The identifier for the proxy.
   */
  public dbProxyName: string;

  /**
   * Specifies whether the proxy includes detailed information about SQL statements in its logs.
   */
  public debugLogging?: boolean | cdk.IResolvable;

  /**
   * The kinds of databases that the proxy can connect to.
   */
  public engineFamily: string;

  /**
   * The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it.
   */
  public idleClientTimeout?: number;

  /**
   * Specifies whether Transport Layer Security (TLS) encryption is required for connections to the proxy.
   */
  public requireTls?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that the proxy uses to access secrets in AWS Secrets Manager.
   */
  public roleArn: string;

  /**
   * An optional set of key-value pairs to associate arbitrary data of your choosing with the proxy.
   */
  public tags?: Array<CfnDBProxy.TagFormatProperty>;

  /**
   * One or more VPC security group IDs to associate with the new proxy.
   */
  public vpcSecurityGroupIds?: Array<string>;

  /**
   * One or more VPC subnet IDs to associate with the new proxy.
   */
  public vpcSubnetIds: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBProxyProps) {
    super(scope, id, {
      "type": CfnDBProxy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "auth", this);
    cdk.requireProperty(props, "dbProxyName", this);
    cdk.requireProperty(props, "engineFamily", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "vpcSubnetIds", this);

    this.attrDbProxyArn = cdk.Token.asString(this.getAtt("DBProxyArn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrVpcId = cdk.Token.asString(this.getAtt("VpcId", cdk.ResolutionTypeHint.STRING));
    this.auth = props.auth;
    this.dbProxyName = props.dbProxyName;
    this.debugLogging = props.debugLogging;
    this.engineFamily = props.engineFamily;
    this.idleClientTimeout = props.idleClientTimeout;
    this.requireTls = props.requireTls;
    this.roleArn = props.roleArn;
    this.tags = props.tags;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    this.vpcSubnetIds = props.vpcSubnetIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "auth": this.auth,
      "dbProxyName": this.dbProxyName,
      "debugLogging": this.debugLogging,
      "engineFamily": this.engineFamily,
      "idleClientTimeout": this.idleClientTimeout,
      "requireTls": this.requireTls,
      "roleArn": this.roleArn,
      "tags": this.tags,
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds,
      "vpcSubnetIds": this.vpcSubnetIds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBProxy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBProxyPropsToCloudFormation(props);
  }
}

export namespace CfnDBProxy {
  /**
   * Specifies the details of authentication used by a proxy to log in as a specific database user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html
   */
  export interface AuthFormatProperty {
    /**
     * The type of authentication that the proxy uses for connections from the proxy to the underlying database.
     *
     * Valid Values: `SECRETS`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html#cfn-rds-dbproxy-authformat-authscheme
     */
    readonly authScheme?: string;

    /**
     * Specifies the details of authentication used by a proxy to log in as a specific database user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html#cfn-rds-dbproxy-authformat-clientpasswordauthtype
     */
    readonly clientPasswordAuthType?: string;

    /**
     * A user-specified description about the authentication used by a proxy to log in as a specific database user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html#cfn-rds-dbproxy-authformat-description
     */
    readonly description?: string;

    /**
     * Whether to require or disallow AWS Identity and Access Management (IAM) authentication for connections to the proxy.
     *
     * The `ENABLED` value is valid only for proxies with RDS for Microsoft SQL Server.
     *
     * Valid Values: `ENABLED | DISABLED | REQUIRED`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html#cfn-rds-dbproxy-authformat-iamauth
     */
    readonly iamAuth?: string;

    /**
     * The Amazon Resource Name (ARN) representing the secret that the proxy uses to authenticate to the RDS DB instance or Aurora DB cluster.
     *
     * These secrets are stored within Amazon Secrets Manager.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-authformat.html#cfn-rds-dbproxy-authformat-secretarn
     */
    readonly secretArn?: string;
  }

  /**
   * Metadata assigned to a DB proxy consisting of a key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-tagformat.html
   */
  export interface TagFormatProperty {
    /**
     * A key is the required name of the tag.
     *
     * The string value can be 1-128 Unicode characters in length and can't be prefixed with `aws:` . The string can contain only the set of Unicode letters, digits, white-space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-tagformat.html#cfn-rds-dbproxy-tagformat-key
     */
    readonly key?: string;

    /**
     * A value is the optional value of the tag.
     *
     * The string value can be 1-256 Unicode characters in length and can't be prefixed with `aws:` . The string can contain only the set of Unicode letters, digits, white-space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxy-tagformat.html#cfn-rds-dbproxy-tagformat-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDBProxy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html
 */
export interface CfnDBProxyProps {
  /**
   * The authorization mechanism that the proxy uses.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-auth
   */
  readonly auth: Array<CfnDBProxy.AuthFormatProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The identifier for the proxy.
   *
   * This name must be unique for all proxies owned by your AWS account in the specified AWS Region . An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-dbproxyname
   */
  readonly dbProxyName: string;

  /**
   * Specifies whether the proxy includes detailed information about SQL statements in its logs.
   *
   * This information helps you to debug issues involving SQL behavior or the performance and scalability of the proxy connections. The debug information includes the text of SQL statements that you submit through the proxy. Thus, only enable this setting when needed for debugging, and only when you have security measures in place to safeguard any sensitive information that appears in the logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-debuglogging
   */
  readonly debugLogging?: boolean | cdk.IResolvable;

  /**
   * The kinds of databases that the proxy can connect to.
   *
   * This value determines which database network protocol the proxy recognizes when it interprets network traffic to and from the database. For Aurora MySQL, RDS for MariaDB, and RDS for MySQL databases, specify `MYSQL` . For Aurora PostgreSQL and RDS for PostgreSQL databases, specify `POSTGRESQL` . For RDS for Microsoft SQL Server, specify `SQLSERVER` .
   *
   * *Valid Values* : `MYSQL` | `POSTGRESQL` | `SQLSERVER`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-enginefamily
   */
  readonly engineFamily: string;

  /**
   * The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it.
   *
   * You can set this value higher or lower than the connection timeout limit for the associated database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-idleclienttimeout
   */
  readonly idleClientTimeout?: number;

  /**
   * Specifies whether Transport Layer Security (TLS) encryption is required for connections to the proxy.
   *
   * By enabling this setting, you can enforce encrypted TLS connections to the proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-requiretls
   */
  readonly requireTls?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that the proxy uses to access secrets in AWS Secrets Manager.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-rolearn
   */
  readonly roleArn: string;

  /**
   * An optional set of key-value pairs to associate arbitrary data of your choosing with the proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-tags
   */
  readonly tags?: Array<CfnDBProxy.TagFormatProperty>;

  /**
   * One or more VPC security group IDs to associate with the new proxy.
   *
   * If you plan to update the resource, don't specify VPC security groups in a shared VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;

  /**
   * One or more VPC subnet IDs to associate with the new proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#cfn-rds-dbproxy-vpcsubnetids
   */
  readonly vpcSubnetIds: Array<string>;
}

/**
 * Determine whether the given properties match those of a `AuthFormatProperty`
 *
 * @param properties - the TypeScript properties of a `AuthFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyAuthFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authScheme", cdk.validateString)(properties.authScheme));
  errors.collect(cdk.propertyValidator("clientPasswordAuthType", cdk.validateString)(properties.clientPasswordAuthType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("iamAuth", cdk.validateString)(properties.iamAuth));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"AuthFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyAuthFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyAuthFormatPropertyValidator(properties).assertSuccess();
  return {
    "AuthScheme": cdk.stringToCloudFormation(properties.authScheme),
    "ClientPasswordAuthType": cdk.stringToCloudFormation(properties.clientPasswordAuthType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IAMAuth": cdk.stringToCloudFormation(properties.iamAuth),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnDBProxyAuthFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBProxy.AuthFormatProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxy.AuthFormatProperty>();
  ret.addPropertyResult("authScheme", "AuthScheme", (properties.AuthScheme != null ? cfn_parse.FromCloudFormation.getString(properties.AuthScheme) : undefined));
  ret.addPropertyResult("clientPasswordAuthType", "ClientPasswordAuthType", (properties.ClientPasswordAuthType != null ? cfn_parse.FromCloudFormation.getString(properties.ClientPasswordAuthType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("iamAuth", "IAMAuth", (properties.IAMAuth != null ? cfn_parse.FromCloudFormation.getString(properties.IAMAuth) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagFormatProperty`
 *
 * @param properties - the TypeScript properties of a `TagFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyTagFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyTagFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyTagFormatPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDBProxyTagFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBProxy.TagFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxy.TagFormatProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDBProxyProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBProxyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("auth", cdk.requiredValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("auth", cdk.listValidator(CfnDBProxyAuthFormatPropertyValidator))(properties.auth));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.requiredValidator)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.validateString)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("debugLogging", cdk.validateBoolean)(properties.debugLogging));
  errors.collect(cdk.propertyValidator("engineFamily", cdk.requiredValidator)(properties.engineFamily));
  errors.collect(cdk.propertyValidator("engineFamily", cdk.validateString)(properties.engineFamily));
  errors.collect(cdk.propertyValidator("idleClientTimeout", cdk.validateNumber)(properties.idleClientTimeout));
  errors.collect(cdk.propertyValidator("requireTls", cdk.validateBoolean)(properties.requireTls));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDBProxyTagFormatPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  errors.collect(cdk.propertyValidator("vpcSubnetIds", cdk.requiredValidator)(properties.vpcSubnetIds));
  errors.collect(cdk.propertyValidator("vpcSubnetIds", cdk.listValidator(cdk.validateString))(properties.vpcSubnetIds));
  return errors.wrap("supplied properties not correct for \"CfnDBProxyProps\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyPropsValidator(properties).assertSuccess();
  return {
    "Auth": cdk.listMapper(convertCfnDBProxyAuthFormatPropertyToCloudFormation)(properties.auth),
    "DBProxyName": cdk.stringToCloudFormation(properties.dbProxyName),
    "DebugLogging": cdk.booleanToCloudFormation(properties.debugLogging),
    "EngineFamily": cdk.stringToCloudFormation(properties.engineFamily),
    "IdleClientTimeout": cdk.numberToCloudFormation(properties.idleClientTimeout),
    "RequireTLS": cdk.booleanToCloudFormation(properties.requireTls),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(convertCfnDBProxyTagFormatPropertyToCloudFormation)(properties.tags),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds),
    "VpcSubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSubnetIds)
  };
}

// @ts-ignore TS6133
function CfnDBProxyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBProxyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxyProps>();
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? cfn_parse.FromCloudFormation.getArray(CfnDBProxyAuthFormatPropertyFromCloudFormation)(properties.Auth) : undefined));
  ret.addPropertyResult("dbProxyName", "DBProxyName", (properties.DBProxyName != null ? cfn_parse.FromCloudFormation.getString(properties.DBProxyName) : undefined));
  ret.addPropertyResult("debugLogging", "DebugLogging", (properties.DebugLogging != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DebugLogging) : undefined));
  ret.addPropertyResult("engineFamily", "EngineFamily", (properties.EngineFamily != null ? cfn_parse.FromCloudFormation.getString(properties.EngineFamily) : undefined));
  ret.addPropertyResult("idleClientTimeout", "IdleClientTimeout", (properties.IdleClientTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleClientTimeout) : undefined));
  ret.addPropertyResult("requireTls", "RequireTLS", (properties.RequireTLS != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireTLS) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDBProxyTagFormatPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addPropertyResult("vpcSubnetIds", "VpcSubnetIds", (properties.VpcSubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBProxyEndpoint` resource creates or updates a DB proxy endpoint.
 *
 * You can use custom proxy endpoints to access a proxy through a different VPC than the proxy's default VPC.
 *
 * For more information about RDS Proxy, see [AWS::RDS::DBProxy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html) .
 *
 * @cloudformationResource AWS::RDS::DBProxyEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html
 */
export class CfnDBProxyEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBProxyEndpoint";

  /**
   * Build a CfnDBProxyEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBProxyEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBProxyEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBProxyEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) representing the DB proxy endpoint.
   *
   * @cloudformationAttribute DBProxyEndpointArn
   */
  public readonly attrDbProxyEndpointArn: string;

  /**
   * The custom endpoint for the RDS DB instance or Aurora DB cluster.
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * A value that indicates whether this endpoint is the default endpoint for the associated DB proxy. Default DB proxy endpoints always have read/write capability. Other endpoints that you associate with the DB proxy can be either read/write or read-only.
   *
   * @cloudformationAttribute IsDefault
   */
  public readonly attrIsDefault: cdk.IResolvable;

  /**
   * The VPC ID of the DB proxy endpoint.
   *
   * @cloudformationAttribute VpcId
   */
  public readonly attrVpcId: string;

  /**
   * The name of the DB proxy endpoint to create.
   */
  public dbProxyEndpointName: string;

  /**
   * The name of the DB proxy associated with the DB proxy endpoint that you create.
   */
  public dbProxyName: string;

  /**
   * An optional set of key-value pairs to associate arbitrary data of your choosing with the proxy.
   */
  public tags?: Array<CfnDBProxyEndpoint.TagFormatProperty>;

  /**
   * A value that indicates whether the DB proxy endpoint can be used for read/write or read-only operations.
   */
  public targetRole?: string;

  /**
   * The VPC security group IDs for the DB proxy endpoint that you create.
   */
  public vpcSecurityGroupIds?: Array<string>;

  /**
   * The VPC subnet IDs for the DB proxy endpoint that you create.
   */
  public vpcSubnetIds: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBProxyEndpointProps) {
    super(scope, id, {
      "type": CfnDBProxyEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbProxyEndpointName", this);
    cdk.requireProperty(props, "dbProxyName", this);
    cdk.requireProperty(props, "vpcSubnetIds", this);

    this.attrDbProxyEndpointArn = cdk.Token.asString(this.getAtt("DBProxyEndpointArn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrIsDefault = this.getAtt("IsDefault");
    this.attrVpcId = cdk.Token.asString(this.getAtt("VpcId", cdk.ResolutionTypeHint.STRING));
    this.dbProxyEndpointName = props.dbProxyEndpointName;
    this.dbProxyName = props.dbProxyName;
    this.tags = props.tags;
    this.targetRole = props.targetRole;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    this.vpcSubnetIds = props.vpcSubnetIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dbProxyEndpointName": this.dbProxyEndpointName,
      "dbProxyName": this.dbProxyName,
      "tags": this.tags,
      "targetRole": this.targetRole,
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds,
      "vpcSubnetIds": this.vpcSubnetIds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBProxyEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBProxyEndpointPropsToCloudFormation(props);
  }
}

export namespace CfnDBProxyEndpoint {
  /**
   * Metadata assigned to a DB proxy endpoint consisting of a key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxyendpoint-tagformat.html
   */
  export interface TagFormatProperty {
    /**
     * A value is the optional value of the tag.
     *
     * The string value can be 1-256 Unicode characters in length and can't be prefixed with `aws:` . The string can contain only the set of Unicode letters, digits, white-space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxyendpoint-tagformat.html#cfn-rds-dbproxyendpoint-tagformat-key
     */
    readonly key?: string;

    /**
     * Metadata assigned to a DB instance consisting of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxyendpoint-tagformat.html#cfn-rds-dbproxyendpoint-tagformat-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDBProxyEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html
 */
export interface CfnDBProxyEndpointProps {
  /**
   * The name of the DB proxy endpoint to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-dbproxyendpointname
   */
  readonly dbProxyEndpointName: string;

  /**
   * The name of the DB proxy associated with the DB proxy endpoint that you create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-dbproxyname
   */
  readonly dbProxyName: string;

  /**
   * An optional set of key-value pairs to associate arbitrary data of your choosing with the proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-tags
   */
  readonly tags?: Array<CfnDBProxyEndpoint.TagFormatProperty>;

  /**
   * A value that indicates whether the DB proxy endpoint can be used for read/write or read-only operations.
   *
   * Valid Values: `READ_WRITE | READ_ONLY`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-targetrole
   */
  readonly targetRole?: string;

  /**
   * The VPC security group IDs for the DB proxy endpoint that you create.
   *
   * You can specify a different set of security group IDs than for the original DB proxy. The default is the default security group for the VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;

  /**
   * The VPC subnet IDs for the DB proxy endpoint that you create.
   *
   * You can specify a different set of subnet IDs than for the original DB proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxyendpoint.html#cfn-rds-dbproxyendpoint-vpcsubnetids
   */
  readonly vpcSubnetIds: Array<string>;
}

/**
 * Determine whether the given properties match those of a `TagFormatProperty`
 *
 * @param properties - the TypeScript properties of a `TagFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyEndpointTagFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyEndpointTagFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyEndpointTagFormatPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDBProxyEndpointTagFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDBProxyEndpoint.TagFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxyEndpoint.TagFormatProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDBProxyEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBProxyEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbProxyEndpointName", cdk.requiredValidator)(properties.dbProxyEndpointName));
  errors.collect(cdk.propertyValidator("dbProxyEndpointName", cdk.validateString)(properties.dbProxyEndpointName));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.requiredValidator)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.validateString)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDBProxyEndpointTagFormatPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("targetRole", cdk.validateString)(properties.targetRole));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  errors.collect(cdk.propertyValidator("vpcSubnetIds", cdk.requiredValidator)(properties.vpcSubnetIds));
  errors.collect(cdk.propertyValidator("vpcSubnetIds", cdk.listValidator(cdk.validateString))(properties.vpcSubnetIds));
  return errors.wrap("supplied properties not correct for \"CfnDBProxyEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyEndpointPropsValidator(properties).assertSuccess();
  return {
    "DBProxyEndpointName": cdk.stringToCloudFormation(properties.dbProxyEndpointName),
    "DBProxyName": cdk.stringToCloudFormation(properties.dbProxyName),
    "Tags": cdk.listMapper(convertCfnDBProxyEndpointTagFormatPropertyToCloudFormation)(properties.tags),
    "TargetRole": cdk.stringToCloudFormation(properties.targetRole),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds),
    "VpcSubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSubnetIds)
  };
}

// @ts-ignore TS6133
function CfnDBProxyEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBProxyEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxyEndpointProps>();
  ret.addPropertyResult("dbProxyEndpointName", "DBProxyEndpointName", (properties.DBProxyEndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.DBProxyEndpointName) : undefined));
  ret.addPropertyResult("dbProxyName", "DBProxyName", (properties.DBProxyName != null ? cfn_parse.FromCloudFormation.getString(properties.DBProxyName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDBProxyEndpointTagFormatPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("targetRole", "TargetRole", (properties.TargetRole != null ? cfn_parse.FromCloudFormation.getString(properties.TargetRole) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addPropertyResult("vpcSubnetIds", "VpcSubnetIds", (properties.VpcSubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBProxyTargetGroup` resource represents a set of RDS DB instances, Aurora DB clusters, or both that a proxy can connect to.
 *
 * Currently, each target group is associated with exactly one RDS DB instance or Aurora DB cluster.
 *
 * This data type is used as a response element in the `DescribeDBProxyTargetGroups` action.
 *
 * For information about RDS Proxy for Amazon RDS, see [Managing Connections with Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) in the *Amazon RDS User Guide* .
 *
 * For information about RDS Proxy for Amazon Aurora, see [Managing Connections with Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy.html) in the *Amazon Aurora User Guide* .
 *
 * For a sample template that creates a DB proxy and registers a DB instance, see [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxy.html#aws-resource-rds-dbproxy--examples) in AWS::RDS::DBProxy.
 *
 * > Limitations apply to RDS Proxy, including DB engine version limitations and AWS Region limitations.
 * >
 * > For information about limitations that apply to RDS Proxy for Amazon RDS, see [Limitations for RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy.limitations) in the *Amazon RDS User Guide* .
 * >
 * > For information about that apply to RDS Proxy for Amazon Aurora, see [Limitations for RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy.html#rds-proxy.limitations) in the *Amazon Aurora User Guide* .
 *
 * @cloudformationResource AWS::RDS::DBProxyTargetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html
 */
export class CfnDBProxyTargetGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBProxyTargetGroup";

  /**
   * Build a CfnDBProxyTargetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBProxyTargetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBProxyTargetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBProxyTargetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) representing the target group.
   *
   * @cloudformationAttribute TargetGroupArn
   */
  public readonly attrTargetGroupArn: string;

  /**
   * Settings that control the size and behavior of the connection pool associated with a `DBProxyTargetGroup` .
   */
  public connectionPoolConfigurationInfo?: CfnDBProxyTargetGroup.ConnectionPoolConfigurationInfoFormatProperty | cdk.IResolvable;

  /**
   * One or more DB cluster identifiers.
   */
  public dbClusterIdentifiers?: Array<string>;

  /**
   * One or more DB instance identifiers.
   */
  public dbInstanceIdentifiers?: Array<string>;

  /**
   * The identifier of the `DBProxy` that is associated with the `DBProxyTargetGroup` .
   */
  public dbProxyName: string;

  /**
   * The identifier for the target group.
   */
  public targetGroupName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBProxyTargetGroupProps) {
    super(scope, id, {
      "type": CfnDBProxyTargetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbProxyName", this);
    cdk.requireProperty(props, "targetGroupName", this);

    this.attrTargetGroupArn = cdk.Token.asString(this.getAtt("TargetGroupArn", cdk.ResolutionTypeHint.STRING));
    this.connectionPoolConfigurationInfo = props.connectionPoolConfigurationInfo;
    this.dbClusterIdentifiers = props.dbClusterIdentifiers;
    this.dbInstanceIdentifiers = props.dbInstanceIdentifiers;
    this.dbProxyName = props.dbProxyName;
    this.targetGroupName = props.targetGroupName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionPoolConfigurationInfo": this.connectionPoolConfigurationInfo,
      "dbClusterIdentifiers": this.dbClusterIdentifiers,
      "dbInstanceIdentifiers": this.dbInstanceIdentifiers,
      "dbProxyName": this.dbProxyName,
      "targetGroupName": this.targetGroupName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBProxyTargetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBProxyTargetGroupPropsToCloudFormation(props);
  }
}

export namespace CfnDBProxyTargetGroup {
  /**
   * Specifies the settings that control the size and behavior of the connection pool associated with a `DBProxyTargetGroup` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html
   */
  export interface ConnectionPoolConfigurationInfoFormatProperty {
    /**
     * The number of seconds for a proxy to wait for a connection to become available in the connection pool.
     *
     * This setting only applies when the proxy has opened its maximum number of connections and all connections are busy with client sessions. For an unlimited wait time, specify `0` .
     *
     * Default: `120`
     *
     * Constraints:
     *
     * - Must be between 0 and 3600.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat-connectionborrowtimeout
     */
    readonly connectionBorrowTimeout?: number;

    /**
     * One or more SQL statements for the proxy to run when opening each new database connection.
     *
     * Typically used with `SET` statements to make sure that each connection has identical settings such as time zone and character set. For multiple statements, use semicolons as the separator. You can also include multiple variables in a single `SET` statement, such as `SET x=1, y=2` .
     *
     * Default: no initialization query
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat-initquery
     */
    readonly initQuery?: string;

    /**
     * The maximum size of the connection pool for each target in a target group.
     *
     * The value is expressed as a percentage of the `max_connections` setting for the RDS DB instance or Aurora DB cluster used by the target group.
     *
     * If you specify `MaxIdleConnectionsPercent` , then you must also include a value for this parameter.
     *
     * Default: `10` for RDS for Microsoft SQL Server, and `100` for all other engines
     *
     * Constraints:
     *
     * - Must be between 1 and 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat-maxconnectionspercent
     */
    readonly maxConnectionsPercent?: number;

    /**
     * A value that controls how actively the proxy closes idle database connections in the connection pool.
     *
     * The value is expressed as a percentage of the `max_connections` setting for the RDS DB instance or Aurora DB cluster used by the target group. With a high value, the proxy leaves a high percentage of idle database connections open. A low value causes the proxy to close more idle connections and return them to the database.
     *
     * If you specify this parameter, then you must also include a value for `MaxConnectionsPercent` .
     *
     * Default: The default value is half of the value of `MaxConnectionsPercent` . For example, if `MaxConnectionsPercent` is 80, then the default value of `MaxIdleConnectionsPercent` is 40. If the value of `MaxConnectionsPercent` isn't specified, then for SQL Server, `MaxIdleConnectionsPercent` is `5` , and for all other engines, the default is `50` .
     *
     * Constraints:
     *
     * - Must be between 0 and the value of `MaxConnectionsPercent` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat-maxidleconnectionspercent
     */
    readonly maxIdleConnectionsPercent?: number;

    /**
     * Each item in the list represents a class of SQL operations that normally cause all later statements in a session using a proxy to be pinned to the same underlying database connection.
     *
     * Including an item in the list exempts that class of SQL operations from the pinning behavior.
     *
     * Default: no session pinning filters
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfoformat-sessionpinningfilters
     */
    readonly sessionPinningFilters?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDBProxyTargetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html
 */
export interface CfnDBProxyTargetGroupProps {
  /**
   * Settings that control the size and behavior of the connection pool associated with a `DBProxyTargetGroup` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html#cfn-rds-dbproxytargetgroup-connectionpoolconfigurationinfo
   */
  readonly connectionPoolConfigurationInfo?: CfnDBProxyTargetGroup.ConnectionPoolConfigurationInfoFormatProperty | cdk.IResolvable;

  /**
   * One or more DB cluster identifiers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html#cfn-rds-dbproxytargetgroup-dbclusteridentifiers
   */
  readonly dbClusterIdentifiers?: Array<string>;

  /**
   * One or more DB instance identifiers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html#cfn-rds-dbproxytargetgroup-dbinstanceidentifiers
   */
  readonly dbInstanceIdentifiers?: Array<string>;

  /**
   * The identifier of the `DBProxy` that is associated with the `DBProxyTargetGroup` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html#cfn-rds-dbproxytargetgroup-dbproxyname
   */
  readonly dbProxyName: string;

  /**
   * The identifier for the target group.
   *
   * > Currently, this property must be set to `default` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbproxytargetgroup.html#cfn-rds-dbproxytargetgroup-targetgroupname
   */
  readonly targetGroupName: string;
}

/**
 * Determine whether the given properties match those of a `ConnectionPoolConfigurationInfoFormatProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionPoolConfigurationInfoFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionBorrowTimeout", cdk.validateNumber)(properties.connectionBorrowTimeout));
  errors.collect(cdk.propertyValidator("initQuery", cdk.validateString)(properties.initQuery));
  errors.collect(cdk.propertyValidator("maxConnectionsPercent", cdk.validateNumber)(properties.maxConnectionsPercent));
  errors.collect(cdk.propertyValidator("maxIdleConnectionsPercent", cdk.validateNumber)(properties.maxIdleConnectionsPercent));
  errors.collect(cdk.propertyValidator("sessionPinningFilters", cdk.listValidator(cdk.validateString))(properties.sessionPinningFilters));
  return errors.wrap("supplied properties not correct for \"ConnectionPoolConfigurationInfoFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionBorrowTimeout": cdk.numberToCloudFormation(properties.connectionBorrowTimeout),
    "InitQuery": cdk.stringToCloudFormation(properties.initQuery),
    "MaxConnectionsPercent": cdk.numberToCloudFormation(properties.maxConnectionsPercent),
    "MaxIdleConnectionsPercent": cdk.numberToCloudFormation(properties.maxIdleConnectionsPercent),
    "SessionPinningFilters": cdk.listMapper(cdk.stringToCloudFormation)(properties.sessionPinningFilters)
  };
}

// @ts-ignore TS6133
function CfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBProxyTargetGroup.ConnectionPoolConfigurationInfoFormatProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxyTargetGroup.ConnectionPoolConfigurationInfoFormatProperty>();
  ret.addPropertyResult("connectionBorrowTimeout", "ConnectionBorrowTimeout", (properties.ConnectionBorrowTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionBorrowTimeout) : undefined));
  ret.addPropertyResult("initQuery", "InitQuery", (properties.InitQuery != null ? cfn_parse.FromCloudFormation.getString(properties.InitQuery) : undefined));
  ret.addPropertyResult("maxConnectionsPercent", "MaxConnectionsPercent", (properties.MaxConnectionsPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConnectionsPercent) : undefined));
  ret.addPropertyResult("maxIdleConnectionsPercent", "MaxIdleConnectionsPercent", (properties.MaxIdleConnectionsPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxIdleConnectionsPercent) : undefined));
  ret.addPropertyResult("sessionPinningFilters", "SessionPinningFilters", (properties.SessionPinningFilters != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SessionPinningFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDBProxyTargetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBProxyTargetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBProxyTargetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionPoolConfigurationInfo", CfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyValidator)(properties.connectionPoolConfigurationInfo));
  errors.collect(cdk.propertyValidator("dbClusterIdentifiers", cdk.listValidator(cdk.validateString))(properties.dbClusterIdentifiers));
  errors.collect(cdk.propertyValidator("dbInstanceIdentifiers", cdk.listValidator(cdk.validateString))(properties.dbInstanceIdentifiers));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.requiredValidator)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("dbProxyName", cdk.validateString)(properties.dbProxyName));
  errors.collect(cdk.propertyValidator("targetGroupName", cdk.requiredValidator)(properties.targetGroupName));
  errors.collect(cdk.propertyValidator("targetGroupName", cdk.validateString)(properties.targetGroupName));
  return errors.wrap("supplied properties not correct for \"CfnDBProxyTargetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBProxyTargetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBProxyTargetGroupPropsValidator(properties).assertSuccess();
  return {
    "ConnectionPoolConfigurationInfo": convertCfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyToCloudFormation(properties.connectionPoolConfigurationInfo),
    "DBClusterIdentifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.dbClusterIdentifiers),
    "DBInstanceIdentifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.dbInstanceIdentifiers),
    "DBProxyName": cdk.stringToCloudFormation(properties.dbProxyName),
    "TargetGroupName": cdk.stringToCloudFormation(properties.targetGroupName)
  };
}

// @ts-ignore TS6133
function CfnDBProxyTargetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBProxyTargetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBProxyTargetGroupProps>();
  ret.addPropertyResult("connectionPoolConfigurationInfo", "ConnectionPoolConfigurationInfo", (properties.ConnectionPoolConfigurationInfo != null ? CfnDBProxyTargetGroupConnectionPoolConfigurationInfoFormatPropertyFromCloudFormation(properties.ConnectionPoolConfigurationInfo) : undefined));
  ret.addPropertyResult("dbClusterIdentifiers", "DBClusterIdentifiers", (properties.DBClusterIdentifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DBClusterIdentifiers) : undefined));
  ret.addPropertyResult("dbInstanceIdentifiers", "DBInstanceIdentifiers", (properties.DBInstanceIdentifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DBInstanceIdentifiers) : undefined));
  ret.addPropertyResult("dbProxyName", "DBProxyName", (properties.DBProxyName != null ? cfn_parse.FromCloudFormation.getString(properties.DBProxyName) : undefined));
  ret.addPropertyResult("targetGroupName", "TargetGroupName", (properties.TargetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBSecurityGroup` resource creates or updates an Amazon RDS DB security group.
 *
 * > EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see [Migrate from EC2-Classic to a VPC](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/vpc-migrate.html) in the *Amazon EC2 User Guide* , the blog [EC2-Classic Networking is Retiring – Here’s How to Prepare](https://docs.aws.amazon.com/aws/ec2-classic-is-retiring-heres-how-to-prepare/) , and [Moving a DB instance not in a VPC into a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Non-VPC2VPC.html) in the *Amazon RDS User Guide* .
 *
 * @cloudformationResource AWS::RDS::DBSecurityGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html
 */
export class CfnDBSecurityGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBSecurityGroup";

  /**
   * Build a CfnDBSecurityGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBSecurityGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBSecurityGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBSecurityGroup(scope, id, propsResult.value);
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
   * Ingress rules to be applied to the DB security group.
   */
  public dbSecurityGroupIngress: Array<CfnDBSecurityGroup.IngressProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The identifier of an Amazon VPC. This property indicates the VPC that this DB security group belongs to.
   */
  public ec2VpcId?: string;

  /**
   * Provides the description of the DB security group.
   */
  public groupDescription: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this DB security group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBSecurityGroupProps) {
    super(scope, id, {
      "type": CfnDBSecurityGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbSecurityGroupIngress", this);
    cdk.requireProperty(props, "groupDescription", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.dbSecurityGroupIngress = props.dbSecurityGroupIngress;
    this.ec2VpcId = props.ec2VpcId;
    this.groupDescription = props.groupDescription;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBSecurityGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dbSecurityGroupIngress": this.dbSecurityGroupIngress,
      "ec2VpcId": this.ec2VpcId,
      "groupDescription": this.groupDescription,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBSecurityGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBSecurityGroupPropsToCloudFormation(props);
  }
}

export namespace CfnDBSecurityGroup {
  /**
   * The `Ingress` property type specifies an individual ingress rule within an `AWS::RDS::DBSecurityGroup` resource.
   *
   * > EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see [Migrate from EC2-Classic to a VPC](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/vpc-migrate.html) in the *Amazon EC2 User Guide* , the blog [EC2-Classic Networking is Retiring – Here’s How to Prepare](https://docs.aws.amazon.com/aws/ec2-classic-is-retiring-heres-how-to-prepare/) , and [Moving a DB instance not in a VPC into a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Non-VPC2VPC.html) in the *Amazon RDS User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbsecuritygroup-ingress.html
   */
  export interface IngressProperty {
    /**
     * The IP range to authorize.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbsecuritygroup-ingress.html#cfn-rds-dbsecuritygroup-ingress-cidrip
     */
    readonly cidrip?: string;

    /**
     * Id of the EC2 security group to authorize.
     *
     * For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbsecuritygroup-ingress.html#cfn-rds-dbsecuritygroup-ingress-ec2securitygroupid
     */
    readonly ec2SecurityGroupId?: string;

    /**
     * Name of the EC2 security group to authorize.
     *
     * For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbsecuritygroup-ingress.html#cfn-rds-dbsecuritygroup-ingress-ec2securitygroupname
     */
    readonly ec2SecurityGroupName?: string;

    /**
     * AWS account number of the owner of the EC2 security group specified in the `EC2SecurityGroupName` parameter.
     *
     * The AWS access key ID isn't an acceptable value. For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbsecuritygroup-ingress.html#cfn-rds-dbsecuritygroup-ingress-ec2securitygroupownerid
     */
    readonly ec2SecurityGroupOwnerId?: string;
  }
}

/**
 * Properties for defining a `CfnDBSecurityGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html
 */
export interface CfnDBSecurityGroupProps {
  /**
   * Ingress rules to be applied to the DB security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html#cfn-rds-dbsecuritygroup-dbsecuritygroupingress
   */
  readonly dbSecurityGroupIngress: Array<CfnDBSecurityGroup.IngressProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The identifier of an Amazon VPC. This property indicates the VPC that this DB security group belongs to.
   *
   * > The `EC2VpcId` property is for backward compatibility with older regions, and is no longer recommended for providing security information to an RDS DB instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html#cfn-rds-dbsecuritygroup-ec2vpcid
   */
  readonly ec2VpcId?: string;

  /**
   * Provides the description of the DB security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html#cfn-rds-dbsecuritygroup-groupdescription
   */
  readonly groupDescription: string;

  /**
   * An optional array of key-value pairs to apply to this DB security group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroup.html#cfn-rds-dbsecuritygroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `IngressProperty`
 *
 * @param properties - the TypeScript properties of a `IngressProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBSecurityGroupIngressPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrip", cdk.validateString)(properties.cidrip));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupId", cdk.validateString)(properties.ec2SecurityGroupId));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupName", cdk.validateString)(properties.ec2SecurityGroupName));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupOwnerId", cdk.validateString)(properties.ec2SecurityGroupOwnerId));
  return errors.wrap("supplied properties not correct for \"IngressProperty\"");
}

// @ts-ignore TS6133
function convertCfnDBSecurityGroupIngressPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBSecurityGroupIngressPropertyValidator(properties).assertSuccess();
  return {
    "CIDRIP": cdk.stringToCloudFormation(properties.cidrip),
    "EC2SecurityGroupId": cdk.stringToCloudFormation(properties.ec2SecurityGroupId),
    "EC2SecurityGroupName": cdk.stringToCloudFormation(properties.ec2SecurityGroupName),
    "EC2SecurityGroupOwnerId": cdk.stringToCloudFormation(properties.ec2SecurityGroupOwnerId)
  };
}

// @ts-ignore TS6133
function CfnDBSecurityGroupIngressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBSecurityGroup.IngressProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBSecurityGroup.IngressProperty>();
  ret.addPropertyResult("cidrip", "CIDRIP", (properties.CIDRIP != null ? cfn_parse.FromCloudFormation.getString(properties.CIDRIP) : undefined));
  ret.addPropertyResult("ec2SecurityGroupId", "EC2SecurityGroupId", (properties.EC2SecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupId) : undefined));
  ret.addPropertyResult("ec2SecurityGroupName", "EC2SecurityGroupName", (properties.EC2SecurityGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupName) : undefined));
  ret.addPropertyResult("ec2SecurityGroupOwnerId", "EC2SecurityGroupOwnerId", (properties.EC2SecurityGroupOwnerId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupOwnerId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDBSecurityGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBSecurityGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBSecurityGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbSecurityGroupIngress", cdk.requiredValidator)(properties.dbSecurityGroupIngress));
  errors.collect(cdk.propertyValidator("dbSecurityGroupIngress", cdk.listValidator(CfnDBSecurityGroupIngressPropertyValidator))(properties.dbSecurityGroupIngress));
  errors.collect(cdk.propertyValidator("ec2VpcId", cdk.validateString)(properties.ec2VpcId));
  errors.collect(cdk.propertyValidator("groupDescription", cdk.requiredValidator)(properties.groupDescription));
  errors.collect(cdk.propertyValidator("groupDescription", cdk.validateString)(properties.groupDescription));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDBSecurityGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDBSecurityGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBSecurityGroupPropsValidator(properties).assertSuccess();
  return {
    "DBSecurityGroupIngress": cdk.listMapper(convertCfnDBSecurityGroupIngressPropertyToCloudFormation)(properties.dbSecurityGroupIngress),
    "EC2VpcId": cdk.stringToCloudFormation(properties.ec2VpcId),
    "GroupDescription": cdk.stringToCloudFormation(properties.groupDescription),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDBSecurityGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBSecurityGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBSecurityGroupProps>();
  ret.addPropertyResult("dbSecurityGroupIngress", "DBSecurityGroupIngress", (properties.DBSecurityGroupIngress != null ? cfn_parse.FromCloudFormation.getArray(CfnDBSecurityGroupIngressPropertyFromCloudFormation)(properties.DBSecurityGroupIngress) : undefined));
  ret.addPropertyResult("ec2VpcId", "EC2VpcId", (properties.EC2VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2VpcId) : undefined));
  ret.addPropertyResult("groupDescription", "GroupDescription", (properties.GroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.GroupDescription) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBSecurityGroupIngress` resource enables ingress to a DB security group using one of two forms of authorization.
 *
 * First, you can add EC2 or VPC security groups to the DB security group if the application using the database is running on EC2 or VPC instances. Second, IP ranges are available if the application accessing your database is running on the Internet.
 *
 * This type supports updates. For more information about updating stacks, see [AWS CloudFormation Stacks Updates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html) .
 *
 * For details about the settings for DB security group ingress, see [AuthorizeDBSecurityGroupIngress](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_AuthorizeDBSecurityGroupIngress.html) .
 *
 * > EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see [Migrate from EC2-Classic to a VPC](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/vpc-migrate.html) in the *Amazon EC2 User Guide* , the blog [EC2-Classic Networking is Retiring – Here’s How to Prepare](https://docs.aws.amazon.com/aws/ec2-classic-is-retiring-heres-how-to-prepare/) , and [Moving a DB instance not in a VPC into a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Non-VPC2VPC.html) in the *Amazon RDS User Guide* .
 *
 * @cloudformationResource AWS::RDS::DBSecurityGroupIngress
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html
 */
export class CfnDBSecurityGroupIngress extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBSecurityGroupIngress";

  /**
   * Build a CfnDBSecurityGroupIngress from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDBSecurityGroupIngress {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDBSecurityGroupIngressPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDBSecurityGroupIngress(scope, id, propsResult.value);
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
   * The IP range to authorize.
   */
  public cidrip?: string;

  /**
   * The name of the DB security group to add authorization to.
   */
  public dbSecurityGroupName: string;

  /**
   * Id of the EC2 security group to authorize.
   */
  public ec2SecurityGroupId?: string;

  /**
   * Name of the EC2 security group to authorize.
   */
  public ec2SecurityGroupName?: string;

  /**
   * AWS account number of the owner of the EC2 security group specified in the `EC2SecurityGroupName` parameter.
   */
  public ec2SecurityGroupOwnerId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDBSecurityGroupIngressProps) {
    super(scope, id, {
      "type": CfnDBSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dbSecurityGroupName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.cidrip = props.cidrip;
    this.dbSecurityGroupName = props.dbSecurityGroupName;
    this.ec2SecurityGroupId = props.ec2SecurityGroupId;
    this.ec2SecurityGroupName = props.ec2SecurityGroupName;
    this.ec2SecurityGroupOwnerId = props.ec2SecurityGroupOwnerId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cidrip": this.cidrip,
      "dbSecurityGroupName": this.dbSecurityGroupName,
      "ec2SecurityGroupId": this.ec2SecurityGroupId,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDBSecurityGroupIngressPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDBSecurityGroupIngress`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html
 */
export interface CfnDBSecurityGroupIngressProps {
  /**
   * The IP range to authorize.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html#cfn-rds-dbsecuritygroupingress-cidrip
   */
  readonly cidrip?: string;

  /**
   * The name of the DB security group to add authorization to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html#cfn-rds-dbsecuritygroupingress-dbsecuritygroupname
   */
  readonly dbSecurityGroupName: string;

  /**
   * Id of the EC2 security group to authorize.
   *
   * For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html#cfn-rds-dbsecuritygroupingress-ec2securitygroupid
   */
  readonly ec2SecurityGroupId?: string;

  /**
   * Name of the EC2 security group to authorize.
   *
   * For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html#cfn-rds-dbsecuritygroupingress-ec2securitygroupname
   */
  readonly ec2SecurityGroupName?: string;

  /**
   * AWS account number of the owner of the EC2 security group specified in the `EC2SecurityGroupName` parameter.
   *
   * The AWS access key ID isn't an acceptable value. For VPC DB security groups, `EC2SecurityGroupId` must be provided. Otherwise, `EC2SecurityGroupOwnerId` and either `EC2SecurityGroupName` or `EC2SecurityGroupId` must be provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsecuritygroupingress.html#cfn-rds-dbsecuritygroupingress-ec2securitygroupownerid
   */
  readonly ec2SecurityGroupOwnerId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDBSecurityGroupIngressProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBSecurityGroupIngressProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDBSecurityGroupIngressPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrip", cdk.validateString)(properties.cidrip));
  errors.collect(cdk.propertyValidator("dbSecurityGroupName", cdk.requiredValidator)(properties.dbSecurityGroupName));
  errors.collect(cdk.propertyValidator("dbSecurityGroupName", cdk.validateString)(properties.dbSecurityGroupName));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupId", cdk.validateString)(properties.ec2SecurityGroupId));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupName", cdk.validateString)(properties.ec2SecurityGroupName));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupOwnerId", cdk.validateString)(properties.ec2SecurityGroupOwnerId));
  return errors.wrap("supplied properties not correct for \"CfnDBSecurityGroupIngressProps\"");
}

// @ts-ignore TS6133
function convertCfnDBSecurityGroupIngressPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDBSecurityGroupIngressPropsValidator(properties).assertSuccess();
  return {
    "CIDRIP": cdk.stringToCloudFormation(properties.cidrip),
    "DBSecurityGroupName": cdk.stringToCloudFormation(properties.dbSecurityGroupName),
    "EC2SecurityGroupId": cdk.stringToCloudFormation(properties.ec2SecurityGroupId),
    "EC2SecurityGroupName": cdk.stringToCloudFormation(properties.ec2SecurityGroupName),
    "EC2SecurityGroupOwnerId": cdk.stringToCloudFormation(properties.ec2SecurityGroupOwnerId)
  };
}

// @ts-ignore TS6133
function CfnDBSecurityGroupIngressPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBSecurityGroupIngressProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBSecurityGroupIngressProps>();
  ret.addPropertyResult("cidrip", "CIDRIP", (properties.CIDRIP != null ? cfn_parse.FromCloudFormation.getString(properties.CIDRIP) : undefined));
  ret.addPropertyResult("dbSecurityGroupName", "DBSecurityGroupName", (properties.DBSecurityGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSecurityGroupName) : undefined));
  ret.addPropertyResult("ec2SecurityGroupId", "EC2SecurityGroupId", (properties.EC2SecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupId) : undefined));
  ret.addPropertyResult("ec2SecurityGroupName", "EC2SecurityGroupName", (properties.EC2SecurityGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupName) : undefined));
  ret.addPropertyResult("ec2SecurityGroupOwnerId", "EC2SecurityGroupOwnerId", (properties.EC2SecurityGroupOwnerId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupOwnerId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::DBSubnetGroup` resource creates a database subnet group.
 *
 * Subnet groups must contain at least two subnets in two different Availability Zones in the same region.
 *
 * For more information, see [Working with DB subnet groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html#USER_VPC.Subnets) in the *Amazon RDS User Guide* .
 *
 * @cloudformationResource AWS::RDS::DBSubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html
 */
export class CfnDBSubnetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::DBSubnetGroup";

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
   * The description for the DB subnet group.
   */
  public dbSubnetGroupDescription: string;

  /**
   * The name for the DB subnet group. This value is stored as a lowercase string.
   */
  public dbSubnetGroupName?: string;

  /**
   * The EC2 Subnet IDs for the DB subnet group.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this DB subnet group.
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

    this.dbSubnetGroupDescription = props.dbSubnetGroupDescription;
    this.dbSubnetGroupName = props.dbSubnetGroupName;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::DBSubnetGroup", props.tags, {
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html
 */
export interface CfnDBSubnetGroupProps {
  /**
   * The description for the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html#cfn-rds-dbsubnetgroup-dbsubnetgroupdescription
   */
  readonly dbSubnetGroupDescription: string;

  /**
   * The name for the DB subnet group. This value is stored as a lowercase string.
   *
   * Constraints: Must contain no more than 255 lowercase alphanumeric characters or hyphens. Must not be "Default".
   *
   * Example: `mysubnetgroup`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html#cfn-rds-dbsubnetgroup-dbsubnetgroupname
   */
  readonly dbSubnetGroupName?: string;

  /**
   * The EC2 Subnet IDs for the DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html#cfn-rds-dbsubnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * An optional array of key-value pairs to apply to this DB subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbsubnetgroup.html#cfn-rds-dbsubnetgroup-tags
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
 * The `AWS::RDS::EventSubscription` resource allows you to receive notifications for Amazon Relational Database Service events through the Amazon Simple Notification Service (Amazon SNS).
 *
 * For more information, see [Using Amazon RDS Event Notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the *Amazon RDS User Guide* .
 *
 * @cloudformationResource AWS::RDS::EventSubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html
 */
export class CfnEventSubscription extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::EventSubscription";

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
   * Specifies whether to activate the subscription.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * A list of event categories for a particular source type ( `SourceType` ) that you want to subscribe to.
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
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this subscription.
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

    cdk.requireProperty(props, "snsTopicArn", this);

    this.enabled = props.enabled;
    this.eventCategories = props.eventCategories;
    this.snsTopicArn = props.snsTopicArn;
    this.sourceIds = props.sourceIds;
    this.sourceType = props.sourceType;
    this.subscriptionName = props.subscriptionName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::EventSubscription", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enabled": this.enabled,
      "eventCategories": this.eventCategories,
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html
 */
export interface CfnEventSubscriptionProps {
  /**
   * Specifies whether to activate the subscription.
   *
   * If the event notification subscription isn't activated, the subscription is created but not active.
   *
   * @default - true
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * A list of event categories for a particular source type ( `SourceType` ) that you want to subscribe to.
   *
   * You can see a list of the categories for a given source type in the "Amazon RDS event categories and event messages" section of the [*Amazon RDS User Guide*](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Messages.html) or the [*Amazon Aurora User Guide*](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_Events.Messages.html) . You can also see this list by using the `DescribeEventCategories` operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-eventcategories
   */
  readonly eventCategories?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the SNS topic created for event notification.
   *
   * SNS automatically creates the ARN when you create a topic and subscribe to it.
   *
   * > RDS doesn't support FIFO (first in, first out) topics. For more information, see [Message ordering and deduplication (FIFO topics)](https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html) in the *Amazon Simple Notification Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-snstopicarn
   */
  readonly snsTopicArn: string;

  /**
   * The list of identifiers of the event sources for which events are returned.
   *
   * If not specified, then all sources are included in the response. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens. It can't end with a hyphen or contain two consecutive hyphens.
   *
   * Constraints:
   *
   * - If a `SourceIds` value is supplied, `SourceType` must also be provided.
   * - If the source type is a DB instance, a `DBInstanceIdentifier` value must be supplied.
   * - If the source type is a DB cluster, a `DBClusterIdentifier` value must be supplied.
   * - If the source type is a DB parameter group, a `DBParameterGroupName` value must be supplied.
   * - If the source type is a DB security group, a `DBSecurityGroupName` value must be supplied.
   * - If the source type is a DB snapshot, a `DBSnapshotIdentifier` value must be supplied.
   * - If the source type is a DB cluster snapshot, a `DBClusterSnapshotIdentifier` value must be supplied.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-sourceids
   */
  readonly sourceIds?: Array<string>;

  /**
   * The type of source that is generating the events.
   *
   * For example, if you want to be notified of events generated by a DB instance, set this parameter to `db-instance` . If this value isn't specified, all events are returned.
   *
   * Valid values: `db-instance` | `db-cluster` | `db-parameter-group` | `db-security-group` | `db-snapshot` | `db-cluster-snapshot`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-sourcetype
   */
  readonly sourceType?: string;

  /**
   * The name of the subscription.
   *
   * Constraints: The name must be less than 255 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-subscriptionname
   */
  readonly subscriptionName?: string;

  /**
   * An optional array of key-value pairs to apply to this subscription.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html#cfn-rds-eventsubscription-tags
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
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.requiredValidator)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("sourceIds", cdk.listValidator(cdk.validateString))(properties.sourceIds));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
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
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addPropertyResult("sourceIds", "SourceIds", (properties.SourceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceIds) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addPropertyResult("subscriptionName", "SubscriptionName", (properties.SubscriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::GlobalCluster` resource creates or updates an Amazon Aurora global database spread across multiple AWS Regions.
 *
 * The global database contains a single primary cluster with read-write capability, and a read-only secondary cluster that receives data from the primary cluster through high-speed replication performed by the Aurora storage subsystem.
 *
 * You can create a global database that is initially empty, and then add a primary cluster and a secondary cluster to it.
 *
 * For information about Aurora global databases, see [Working with Amazon Aurora Global Databases](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html) in the *Amazon Aurora User Guide* .
 *
 * @cloudformationResource AWS::RDS::GlobalCluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html
 */
export class CfnGlobalCluster extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::GlobalCluster";

  /**
   * Build a CfnGlobalCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGlobalCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGlobalClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGlobalCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies whether to enable deletion protection for the new global database cluster.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The database engine to use for this global database cluster.
   */
  public engine?: string;

  /**
   * The engine version to use for this global database cluster.
   */
  public engineVersion?: string;

  /**
   * The cluster identifier for this global database cluster.
   */
  public globalClusterIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) to use as the primary cluster of the global database.
   */
  public sourceDbClusterIdentifier?: string;

  /**
   * Specifies whether to enable storage encryption for the new global database cluster.
   */
  public storageEncrypted?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGlobalClusterProps = {}) {
    super(scope, id, {
      "type": CfnGlobalCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.deletionProtection = props.deletionProtection;
    this.engine = props.engine;
    this.engineVersion = props.engineVersion;
    this.globalClusterIdentifier = props.globalClusterIdentifier;
    this.sourceDbClusterIdentifier = props.sourceDbClusterIdentifier;
    this.storageEncrypted = props.storageEncrypted;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deletionProtection": this.deletionProtection,
      "engine": this.engine,
      "engineVersion": this.engineVersion,
      "globalClusterIdentifier": this.globalClusterIdentifier,
      "sourceDbClusterIdentifier": this.sourceDbClusterIdentifier,
      "storageEncrypted": this.storageEncrypted
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGlobalCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGlobalClusterPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGlobalCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html
 */
export interface CfnGlobalClusterProps {
  /**
   * Specifies whether to enable deletion protection for the new global database cluster.
   *
   * The global database can't be deleted when deletion protection is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The database engine to use for this global database cluster.
   *
   * Valid Values: `aurora-mysql | aurora-postgresql`
   *
   * Constraints:
   *
   * - Can't be specified if `SourceDBClusterIdentifier` is specified. In this case, Amazon Aurora uses the engine of the source DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-engine
   */
  readonly engine?: string;

  /**
   * The engine version to use for this global database cluster.
   *
   * Constraints:
   *
   * - Can't be specified if `SourceDBClusterIdentifier` is specified. In this case, Amazon Aurora uses the engine version of the source DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-engineversion
   */
  readonly engineVersion?: string;

  /**
   * The cluster identifier for this global database cluster.
   *
   * This parameter is stored as a lowercase string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-globalclusteridentifier
   */
  readonly globalClusterIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) to use as the primary cluster of the global database.
   *
   * If you provide a value for this parameter, don't specify values for the following settings because Amazon Aurora uses the values from the specified source DB cluster:
   *
   * - `DatabaseName`
   * - `Engine`
   * - `EngineVersion`
   * - `StorageEncrypted`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-sourcedbclusteridentifier
   */
  readonly sourceDbClusterIdentifier?: string;

  /**
   * Specifies whether to enable storage encryption for the new global database cluster.
   *
   * Constraints:
   *
   * - Can't be specified if `SourceDBClusterIdentifier` is specified. In this case, Amazon Aurora uses the setting from the source DB cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-globalcluster.html#cfn-rds-globalcluster-storageencrypted
   */
  readonly storageEncrypted?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGlobalClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnGlobalClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGlobalClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("globalClusterIdentifier", cdk.validateString)(properties.globalClusterIdentifier));
  errors.collect(cdk.propertyValidator("sourceDbClusterIdentifier", cdk.validateString)(properties.sourceDbClusterIdentifier));
  errors.collect(cdk.propertyValidator("storageEncrypted", cdk.validateBoolean)(properties.storageEncrypted));
  return errors.wrap("supplied properties not correct for \"CfnGlobalClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnGlobalClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGlobalClusterPropsValidator(properties).assertSuccess();
  return {
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "GlobalClusterIdentifier": cdk.stringToCloudFormation(properties.globalClusterIdentifier),
    "SourceDBClusterIdentifier": cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
    "StorageEncrypted": cdk.booleanToCloudFormation(properties.storageEncrypted)
  };
}

// @ts-ignore TS6133
function CfnGlobalClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalClusterProps>();
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("globalClusterIdentifier", "GlobalClusterIdentifier", (properties.GlobalClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalClusterIdentifier) : undefined));
  ret.addPropertyResult("sourceDbClusterIdentifier", "SourceDBClusterIdentifier", (properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined));
  ret.addPropertyResult("storageEncrypted", "StorageEncrypted", (properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RDS::OptionGroup` resource creates or updates an option group, to enable and configure features that are specific to a particular DB engine.
 *
 * @cloudformationResource AWS::RDS::OptionGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html
 */
export class CfnOptionGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RDS::OptionGroup";

  /**
   * Build a CfnOptionGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOptionGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOptionGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOptionGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies the name of the engine that this option group should be associated with.
   */
  public engineName: string;

  /**
   * Specifies the major version of the engine that this option group should be associated with.
   */
  public majorEngineVersion: string;

  /**
   * A list of options and the settings for each option.
   */
  public optionConfigurations?: Array<cdk.IResolvable | CfnOptionGroup.OptionConfigurationProperty> | cdk.IResolvable;

  /**
   * The description of the option group.
   */
  public optionGroupDescription: string;

  /**
   * The name of the option group to be created.
   */
  public optionGroupName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional array of key-value pairs to apply to this option group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOptionGroupProps) {
    super(scope, id, {
      "type": CfnOptionGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "engineName", this);
    cdk.requireProperty(props, "majorEngineVersion", this);
    cdk.requireProperty(props, "optionGroupDescription", this);

    this.engineName = props.engineName;
    this.majorEngineVersion = props.majorEngineVersion;
    this.optionConfigurations = props.optionConfigurations;
    this.optionGroupDescription = props.optionGroupDescription;
    this.optionGroupName = props.optionGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RDS::OptionGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "engineName": this.engineName,
      "majorEngineVersion": this.majorEngineVersion,
      "optionConfigurations": this.optionConfigurations,
      "optionGroupDescription": this.optionGroupDescription,
      "optionGroupName": this.optionGroupName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOptionGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOptionGroupPropsToCloudFormation(props);
  }
}

export namespace CfnOptionGroup {
  /**
   * The `OptionConfiguration` property type specifies an individual option, and its settings, within an `AWS::RDS::OptionGroup` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html
   */
  export interface OptionConfigurationProperty {
    /**
     * A list of DBSecurityGroupMembership name strings used for this option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-dbsecuritygroupmemberships
     */
    readonly dbSecurityGroupMemberships?: Array<string>;

    /**
     * The configuration of options to include in a group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-optionname
     */
    readonly optionName: string;

    /**
     * The option settings to include in an option group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-optionsettings
     */
    readonly optionSettings?: Array<cdk.IResolvable | CfnOptionGroup.OptionSettingProperty> | cdk.IResolvable;

    /**
     * The version for the option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-optionversion
     */
    readonly optionVersion?: string;

    /**
     * The optional port for the option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-port
     */
    readonly port?: number;

    /**
     * A list of VpcSecurityGroupMembership name strings used for this option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionconfiguration.html#cfn-rds-optiongroup-optionconfiguration-vpcsecuritygroupmemberships
     */
    readonly vpcSecurityGroupMemberships?: Array<string>;
  }

  /**
   * The `OptionSetting` property type specifies the value for an option within an `OptionSetting` property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionsetting.html
   */
  export interface OptionSettingProperty {
    /**
     * The name of the option that has settings that you can set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionsetting.html#cfn-rds-optiongroup-optionsetting-name
     */
    readonly name?: string;

    /**
     * The current value of the option setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-optiongroup-optionsetting.html#cfn-rds-optiongroup-optionsetting-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnOptionGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html
 */
export interface CfnOptionGroupProps {
  /**
   * Specifies the name of the engine that this option group should be associated with.
   *
   * Valid Values:
   *
   * - `mariadb`
   * - `mysql`
   * - `oracle-ee`
   * - `oracle-ee-cdb`
   * - `oracle-se2`
   * - `oracle-se2-cdb`
   * - `postgres`
   * - `sqlserver-ee`
   * - `sqlserver-se`
   * - `sqlserver-ex`
   * - `sqlserver-web`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-enginename
   */
  readonly engineName: string;

  /**
   * Specifies the major version of the engine that this option group should be associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-majorengineversion
   */
  readonly majorEngineVersion: string;

  /**
   * A list of options and the settings for each option.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-optionconfigurations
   */
  readonly optionConfigurations?: Array<cdk.IResolvable | CfnOptionGroup.OptionConfigurationProperty> | cdk.IResolvable;

  /**
   * The description of the option group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-optiongroupdescription
   */
  readonly optionGroupDescription: string;

  /**
   * The name of the option group to be created.
   *
   * Constraints:
   *
   * - Must be 1 to 255 letters, numbers, or hyphens
   * - First character must be a letter
   * - Can't end with a hyphen or contain two consecutive hyphens
   *
   * Example: `myoptiongroup`
   *
   * If you don't specify a value for `OptionGroupName` property, a name is automatically created for the option group.
   *
   * > This value is stored as a lowercase string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-optiongroupname
   */
  readonly optionGroupName?: string;

  /**
   * An optional array of key-value pairs to apply to this option group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `OptionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `OptionSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOptionGroupOptionSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"OptionSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnOptionGroupOptionSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOptionGroupOptionSettingPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnOptionGroupOptionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOptionGroup.OptionSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOptionGroup.OptionSettingProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOptionGroupOptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbSecurityGroupMemberships", cdk.listValidator(cdk.validateString))(properties.dbSecurityGroupMemberships));
  errors.collect(cdk.propertyValidator("optionName", cdk.requiredValidator)(properties.optionName));
  errors.collect(cdk.propertyValidator("optionName", cdk.validateString)(properties.optionName));
  errors.collect(cdk.propertyValidator("optionSettings", cdk.listValidator(CfnOptionGroupOptionSettingPropertyValidator))(properties.optionSettings));
  errors.collect(cdk.propertyValidator("optionVersion", cdk.validateString)(properties.optionVersion));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupMemberships", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupMemberships));
  return errors.wrap("supplied properties not correct for \"OptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOptionGroupOptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOptionGroupOptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DBSecurityGroupMemberships": cdk.listMapper(cdk.stringToCloudFormation)(properties.dbSecurityGroupMemberships),
    "OptionName": cdk.stringToCloudFormation(properties.optionName),
    "OptionSettings": cdk.listMapper(convertCfnOptionGroupOptionSettingPropertyToCloudFormation)(properties.optionSettings),
    "OptionVersion": cdk.stringToCloudFormation(properties.optionVersion),
    "Port": cdk.numberToCloudFormation(properties.port),
    "VpcSecurityGroupMemberships": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupMemberships)
  };
}

// @ts-ignore TS6133
function CfnOptionGroupOptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOptionGroup.OptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOptionGroup.OptionConfigurationProperty>();
  ret.addPropertyResult("dbSecurityGroupMemberships", "DBSecurityGroupMemberships", (properties.DBSecurityGroupMemberships != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DBSecurityGroupMemberships) : undefined));
  ret.addPropertyResult("optionName", "OptionName", (properties.OptionName != null ? cfn_parse.FromCloudFormation.getString(properties.OptionName) : undefined));
  ret.addPropertyResult("optionSettings", "OptionSettings", (properties.OptionSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnOptionGroupOptionSettingPropertyFromCloudFormation)(properties.OptionSettings) : undefined));
  ret.addPropertyResult("optionVersion", "OptionVersion", (properties.OptionVersion != null ? cfn_parse.FromCloudFormation.getString(properties.OptionVersion) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("vpcSecurityGroupMemberships", "VpcSecurityGroupMemberships", (properties.VpcSecurityGroupMemberships != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupMemberships) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOptionGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnOptionGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOptionGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("engineName", cdk.requiredValidator)(properties.engineName));
  errors.collect(cdk.propertyValidator("engineName", cdk.validateString)(properties.engineName));
  errors.collect(cdk.propertyValidator("majorEngineVersion", cdk.requiredValidator)(properties.majorEngineVersion));
  errors.collect(cdk.propertyValidator("majorEngineVersion", cdk.validateString)(properties.majorEngineVersion));
  errors.collect(cdk.propertyValidator("optionConfigurations", cdk.listValidator(CfnOptionGroupOptionConfigurationPropertyValidator))(properties.optionConfigurations));
  errors.collect(cdk.propertyValidator("optionGroupDescription", cdk.requiredValidator)(properties.optionGroupDescription));
  errors.collect(cdk.propertyValidator("optionGroupDescription", cdk.validateString)(properties.optionGroupDescription));
  errors.collect(cdk.propertyValidator("optionGroupName", cdk.validateString)(properties.optionGroupName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnOptionGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnOptionGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOptionGroupPropsValidator(properties).assertSuccess();
  return {
    "EngineName": cdk.stringToCloudFormation(properties.engineName),
    "MajorEngineVersion": cdk.stringToCloudFormation(properties.majorEngineVersion),
    "OptionConfigurations": cdk.listMapper(convertCfnOptionGroupOptionConfigurationPropertyToCloudFormation)(properties.optionConfigurations),
    "OptionGroupDescription": cdk.stringToCloudFormation(properties.optionGroupDescription),
    "OptionGroupName": cdk.stringToCloudFormation(properties.optionGroupName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnOptionGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOptionGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOptionGroupProps>();
  ret.addPropertyResult("engineName", "EngineName", (properties.EngineName != null ? cfn_parse.FromCloudFormation.getString(properties.EngineName) : undefined));
  ret.addPropertyResult("majorEngineVersion", "MajorEngineVersion", (properties.MajorEngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MajorEngineVersion) : undefined));
  ret.addPropertyResult("optionConfigurations", "OptionConfigurations", (properties.OptionConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnOptionGroupOptionConfigurationPropertyFromCloudFormation)(properties.OptionConfigurations) : undefined));
  ret.addPropertyResult("optionGroupDescription", "OptionGroupDescription", (properties.OptionGroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.OptionGroupDescription) : undefined));
  ret.addPropertyResult("optionGroupName", "OptionGroupName", (properties.OptionGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.OptionGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}