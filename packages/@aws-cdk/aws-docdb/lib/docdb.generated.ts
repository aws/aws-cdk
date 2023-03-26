// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:58.835Z","fingerprint":"GICy2FcdzV8EPQTCtkhhBNBKElwsDnpq1pkj3V3QBWI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDBCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html
 */
export interface CfnDBClusterProps {

    /**
     * A list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-availabilityzones
     */
    readonly availabilityZones?: string[];

    /**
     * The number of days for which automated backups are retained. You must specify a minimum value of 1.
     *
     * Default: 1
     *
     * Constraints:
     *
     * - Must be a value from 1 to 35.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-backupretentionperiod
     */
    readonly backupRetentionPeriod?: number;

    /**
     * `AWS::DocDB::DBCluster.CopyTagsToSnapshot`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-copytagstosnapshot
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusteridentifier
     */
    readonly dbClusterIdentifier?: string;

    /**
     * The name of the cluster parameter group to associate with this cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusterparametergroupname
     */
    readonly dbClusterParameterGroupName?: string;

    /**
     * A subnet group to associate with this cluster.
     *
     * Constraints: Must match the name of an existing `DBSubnetGroup` . Must not be default.
     *
     * Example: `mySubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbsubnetgroupname
     */
    readonly dbSubnetGroupName?: string;

    /**
     * Protects clusters from being accidentally deleted. If enabled, the cluster cannot be deleted unless it is modified and `DeletionProtection` is disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-deletionprotection
     */
    readonly deletionProtection?: boolean | cdk.IResolvable;

    /**
     * The list of log types that need to be enabled for exporting to Amazon CloudWatch Logs. You can enable audit logs or profiler logs. For more information, see [Auditing Amazon DocumentDB Events](https://docs.aws.amazon.com/documentdb/latest/developerguide/event-auditing.html) and [Profiling Amazon DocumentDB Operations](https://docs.aws.amazon.com/documentdb/latest/developerguide/profiling.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-enablecloudwatchlogsexports
     */
    readonly enableCloudwatchLogsExports?: string[];

    /**
     * The version number of the database engine to use. The `--engine-version` will default to the latest major engine version. For production workloads, we recommend explicitly declaring this parameter with the intended major engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-engineversion
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-kmskeyid
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masterusername
     */
    readonly masterUsername?: string;

    /**
     * The password for the master database user. This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@).
     *
     * Constraints: Must contain from 8 to 100 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masteruserpassword
     */
    readonly masterUserPassword?: string;

    /**
     * Specifies the port that the database engine is listening on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-port
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredbackupwindow
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredmaintenancewindow
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretotime
     */
    readonly restoreToTime?: string;

    /**
     * The type of restore to be performed. You can specify one of the following values:
     *
     * - `full-copy` - The new DB cluster is restored as a full copy of the source DB cluster.
     * - `copy-on-write` - The new DB cluster is restored as a clone of the source DB cluster.
     *
     * Constraints: You can't specify `copy-on-write` if the engine version of the source DB cluster is earlier than 1.11.
     *
     * If you don't specify a `RestoreType` value, then the new DB cluster is restored as a full copy of the source DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretype
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-snapshotidentifier
     */
    readonly snapshotIdentifier?: string;

    /**
     * The identifier of the source cluster from which to restore.
     *
     * Constraints:
     *
     * - Must match the identifier of an existing `DBCluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-sourcedbclusteridentifier
     */
    readonly sourceDbClusterIdentifier?: string;

    /**
     * Specifies whether the cluster is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-storageencrypted
     */
    readonly storageEncrypted?: boolean | cdk.IResolvable;

    /**
     * The tags to be assigned to the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A value that is set to `true` to restore the cluster to the latest restorable backup time, and `false` otherwise.
     *
     * Default: `false`
     *
     * Constraints: Cannot be specified if the `RestoreToTime` parameter is provided.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-uselatestrestorabletime
     */
    readonly useLatestRestorableTime?: boolean | cdk.IResolvable;

    /**
     * A list of EC2 VPC security groups to associate with this cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-vpcsecuritygroupids
     */
    readonly vpcSecurityGroupIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnDBClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnDBClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZones', cdk.listValidator(cdk.validateString))(properties.availabilityZones));
    errors.collect(cdk.propertyValidator('backupRetentionPeriod', cdk.validateNumber)(properties.backupRetentionPeriod));
    errors.collect(cdk.propertyValidator('copyTagsToSnapshot', cdk.validateBoolean)(properties.copyTagsToSnapshot));
    errors.collect(cdk.propertyValidator('dbClusterIdentifier', cdk.validateString)(properties.dbClusterIdentifier));
    errors.collect(cdk.propertyValidator('dbClusterParameterGroupName', cdk.validateString)(properties.dbClusterParameterGroupName));
    errors.collect(cdk.propertyValidator('dbSubnetGroupName', cdk.validateString)(properties.dbSubnetGroupName));
    errors.collect(cdk.propertyValidator('deletionProtection', cdk.validateBoolean)(properties.deletionProtection));
    errors.collect(cdk.propertyValidator('enableCloudwatchLogsExports', cdk.listValidator(cdk.validateString))(properties.enableCloudwatchLogsExports));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('masterUserPassword', cdk.validateString)(properties.masterUserPassword));
    errors.collect(cdk.propertyValidator('masterUsername', cdk.validateString)(properties.masterUsername));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('preferredBackupWindow', cdk.validateString)(properties.preferredBackupWindow));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('restoreToTime', cdk.validateString)(properties.restoreToTime));
    errors.collect(cdk.propertyValidator('restoreType', cdk.validateString)(properties.restoreType));
    errors.collect(cdk.propertyValidator('snapshotIdentifier', cdk.validateString)(properties.snapshotIdentifier));
    errors.collect(cdk.propertyValidator('sourceDbClusterIdentifier', cdk.validateString)(properties.sourceDbClusterIdentifier));
    errors.collect(cdk.propertyValidator('storageEncrypted', cdk.validateBoolean)(properties.storageEncrypted));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('useLatestRestorableTime', cdk.validateBoolean)(properties.useLatestRestorableTime));
    errors.collect(cdk.propertyValidator('vpcSecurityGroupIds', cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
    return errors.wrap('supplied properties not correct for "CfnDBClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DocDB::DBCluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DocDB::DBCluster` resource.
 */
// @ts-ignore TS6133
function cfnDBClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDBClusterPropsValidator(properties).assertSuccess();
    return {
        AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
        BackupRetentionPeriod: cdk.numberToCloudFormation(properties.backupRetentionPeriod),
        CopyTagsToSnapshot: cdk.booleanToCloudFormation(properties.copyTagsToSnapshot),
        DBClusterIdentifier: cdk.stringToCloudFormation(properties.dbClusterIdentifier),
        DBClusterParameterGroupName: cdk.stringToCloudFormation(properties.dbClusterParameterGroupName),
        DBSubnetGroupName: cdk.stringToCloudFormation(properties.dbSubnetGroupName),
        DeletionProtection: cdk.booleanToCloudFormation(properties.deletionProtection),
        EnableCloudwatchLogsExports: cdk.listMapper(cdk.stringToCloudFormation)(properties.enableCloudwatchLogsExports),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        MasterUsername: cdk.stringToCloudFormation(properties.masterUsername),
        MasterUserPassword: cdk.stringToCloudFormation(properties.masterUserPassword),
        Port: cdk.numberToCloudFormation(properties.port),
        PreferredBackupWindow: cdk.stringToCloudFormation(properties.preferredBackupWindow),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        RestoreToTime: cdk.stringToCloudFormation(properties.restoreToTime),
        RestoreType: cdk.stringToCloudFormation(properties.restoreType),
        SnapshotIdentifier: cdk.stringToCloudFormation(properties.snapshotIdentifier),
        SourceDBClusterIdentifier: cdk.stringToCloudFormation(properties.sourceDbClusterIdentifier),
        StorageEncrypted: cdk.booleanToCloudFormation(properties.storageEncrypted),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UseLatestRestorableTime: cdk.booleanToCloudFormation(properties.useLatestRestorableTime),
        VpcSecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds),
    };
}

// @ts-ignore TS6133
function CfnDBClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBClusterProps>();
    ret.addPropertyResult('availabilityZones', 'AvailabilityZones', properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AvailabilityZones) : undefined);
    ret.addPropertyResult('backupRetentionPeriod', 'BackupRetentionPeriod', properties.BackupRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackupRetentionPeriod) : undefined);
    ret.addPropertyResult('copyTagsToSnapshot', 'CopyTagsToSnapshot', properties.CopyTagsToSnapshot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshot) : undefined);
    ret.addPropertyResult('dbClusterIdentifier', 'DBClusterIdentifier', properties.DBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier) : undefined);
    ret.addPropertyResult('dbClusterParameterGroupName', 'DBClusterParameterGroupName', properties.DBClusterParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBClusterParameterGroupName) : undefined);
    ret.addPropertyResult('dbSubnetGroupName', 'DBSubnetGroupName', properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined);
    ret.addPropertyResult('deletionProtection', 'DeletionProtection', properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined);
    ret.addPropertyResult('enableCloudwatchLogsExports', 'EnableCloudwatchLogsExports', properties.EnableCloudwatchLogsExports != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EnableCloudwatchLogsExports) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('masterUsername', 'MasterUsername', properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined);
    ret.addPropertyResult('masterUserPassword', 'MasterUserPassword', properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('preferredBackupWindow', 'PreferredBackupWindow', properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('restoreToTime', 'RestoreToTime', properties.RestoreToTime != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreToTime) : undefined);
    ret.addPropertyResult('restoreType', 'RestoreType', properties.RestoreType != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreType) : undefined);
    ret.addPropertyResult('snapshotIdentifier', 'SnapshotIdentifier', properties.SnapshotIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotIdentifier) : undefined);
    ret.addPropertyResult('sourceDbClusterIdentifier', 'SourceDBClusterIdentifier', properties.SourceDBClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDBClusterIdentifier) : undefined);
    ret.addPropertyResult('storageEncrypted', 'StorageEncrypted', properties.StorageEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StorageEncrypted) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('useLatestRestorableTime', 'UseLatestRestorableTime', properties.UseLatestRestorableTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLatestRestorableTime) : undefined);
    ret.addPropertyResult('vpcSecurityGroupIds', 'VpcSecurityGroupIds', properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.VpcSecurityGroupIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DocDB::DBCluster`
 *
 * The `AWS::DocDB::DBCluster` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBCluster. Amazon DocumentDB is a fully managed, MongoDB-compatible document database engine. For more information, see [DBCluster](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBCluster.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBCluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html
 */
export class CfnDBCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DocDB::DBCluster";

    /**
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
        const ret = new CfnDBCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The resource id for the cluster; for example: `cluster-ABCD1234EFGH5678IJKL90MNOP` . The cluster ID uniquely identifies the cluster and is used in things like IAM authentication policies.
     * @cloudformationAttribute ClusterResourceId
     */
    public readonly attrClusterResourceId: string;

    /**
     * The connection endpoint for the cluster, such as `sample-cluster.cluster-cozrlsfrcjoc.us-east-1.docdb.amazonaws.com` .
     * @cloudformationAttribute Endpoint
     */
    public readonly attrEndpoint: string;

    /**
     * The port number on which the cluster accepts connections. For example: `27017` .
     * @cloudformationAttribute Port
     */
    public readonly attrPort: string;

    /**
     * The reader endpoint for the cluster. For example: `sample-cluster.cluster-ro-cozrlsfrcjoc.us-east-1.docdb.amazonaws.com` .
     * @cloudformationAttribute ReadEndpoint
     */
    public readonly attrReadEndpoint: string;

    /**
     * A list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-availabilityzones
     */
    public availabilityZones: string[] | undefined;

    /**
     * The number of days for which automated backups are retained. You must specify a minimum value of 1.
     *
     * Default: 1
     *
     * Constraints:
     *
     * - Must be a value from 1 to 35.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-backupretentionperiod
     */
    public backupRetentionPeriod: number | undefined;

    /**
     * `AWS::DocDB::DBCluster.CopyTagsToSnapshot`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-copytagstosnapshot
     */
    public copyTagsToSnapshot: boolean | cdk.IResolvable | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusteridentifier
     */
    public dbClusterIdentifier: string | undefined;

    /**
     * The name of the cluster parameter group to associate with this cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbclusterparametergroupname
     */
    public dbClusterParameterGroupName: string | undefined;

    /**
     * A subnet group to associate with this cluster.
     *
     * Constraints: Must match the name of an existing `DBSubnetGroup` . Must not be default.
     *
     * Example: `mySubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-dbsubnetgroupname
     */
    public dbSubnetGroupName: string | undefined;

    /**
     * Protects clusters from being accidentally deleted. If enabled, the cluster cannot be deleted unless it is modified and `DeletionProtection` is disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-deletionprotection
     */
    public deletionProtection: boolean | cdk.IResolvable | undefined;

    /**
     * The list of log types that need to be enabled for exporting to Amazon CloudWatch Logs. You can enable audit logs or profiler logs. For more information, see [Auditing Amazon DocumentDB Events](https://docs.aws.amazon.com/documentdb/latest/developerguide/event-auditing.html) and [Profiling Amazon DocumentDB Operations](https://docs.aws.amazon.com/documentdb/latest/developerguide/profiling.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-enablecloudwatchlogsexports
     */
    public enableCloudwatchLogsExports: string[] | undefined;

    /**
     * The version number of the database engine to use. The `--engine-version` will default to the latest major engine version. For production workloads, we recommend explicitly declaring this parameter with the intended major engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-engineversion
     */
    public engineVersion: string | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The name of the master user for the cluster.
     *
     * Constraints:
     *
     * - Must be from 1 to 63 letters or numbers.
     * - The first character must be a letter.
     * - Cannot be a reserved word for the chosen database engine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masterusername
     */
    public masterUsername: string | undefined;

    /**
     * The password for the master database user. This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@).
     *
     * Constraints: Must contain from 8 to 100 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-masteruserpassword
     */
    public masterUserPassword: string | undefined;

    /**
     * Specifies the port that the database engine is listening on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-port
     */
    public port: number | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredbackupwindow
     */
    public preferredBackupWindow: string | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretotime
     */
    public restoreToTime: string | undefined;

    /**
     * The type of restore to be performed. You can specify one of the following values:
     *
     * - `full-copy` - The new DB cluster is restored as a full copy of the source DB cluster.
     * - `copy-on-write` - The new DB cluster is restored as a clone of the source DB cluster.
     *
     * Constraints: You can't specify `copy-on-write` if the engine version of the source DB cluster is earlier than 1.11.
     *
     * If you don't specify a `RestoreType` value, then the new DB cluster is restored as a full copy of the source DB cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-restoretype
     */
    public restoreType: string | undefined;

    /**
     * The identifier for the snapshot or cluster snapshot to restore from.
     *
     * You can use either the name or the Amazon Resource Name (ARN) to specify a cluster snapshot. However, you can use only the ARN to specify a snapshot.
     *
     * Constraints:
     *
     * - Must match the identifier of an existing snapshot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-snapshotidentifier
     */
    public snapshotIdentifier: string | undefined;

    /**
     * The identifier of the source cluster from which to restore.
     *
     * Constraints:
     *
     * - Must match the identifier of an existing `DBCluster` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-sourcedbclusteridentifier
     */
    public sourceDbClusterIdentifier: string | undefined;

    /**
     * Specifies whether the cluster is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-storageencrypted
     */
    public storageEncrypted: boolean | cdk.IResolvable | undefined;

    /**
     * The tags to be assigned to the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A value that is set to `true` to restore the cluster to the latest restorable backup time, and `false` otherwise.
     *
     * Default: `false`
     *
     * Constraints: Cannot be specified if the `RestoreToTime` parameter is provided.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-uselatestrestorabletime
     */
    public useLatestRestorableTime: boolean | cdk.IResolvable | undefined;

    /**
     * A list of EC2 VPC security groups to associate with this cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbcluster.html#cfn-docdb-dbcluster-vpcsecuritygroupids
     */
    public vpcSecurityGroupIds: string[] | undefined;

    /**
     * Create a new `AWS::DocDB::DBCluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDBClusterProps = {}) {
        super(scope, id, { type: CfnDBCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrClusterResourceId = cdk.Token.asString(this.getAtt('ClusterResourceId', cdk.ResolutionTypeHint.STRING));
        this.attrEndpoint = cdk.Token.asString(this.getAtt('Endpoint', cdk.ResolutionTypeHint.STRING));
        this.attrPort = cdk.Token.asString(this.getAtt('Port', cdk.ResolutionTypeHint.STRING));
        this.attrReadEndpoint = cdk.Token.asString(this.getAtt('ReadEndpoint', cdk.ResolutionTypeHint.STRING));

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
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBCluster", props.tags, { tagPropertyName: 'tags' });
        this.useLatestRestorableTime = props.useLatestRestorableTime;
        this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::DocDB::DBCluster\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            availabilityZones: this.availabilityZones,
            backupRetentionPeriod: this.backupRetentionPeriod,
            copyTagsToSnapshot: this.copyTagsToSnapshot,
            dbClusterIdentifier: this.dbClusterIdentifier,
            dbClusterParameterGroupName: this.dbClusterParameterGroupName,
            dbSubnetGroupName: this.dbSubnetGroupName,
            deletionProtection: this.deletionProtection,
            enableCloudwatchLogsExports: this.enableCloudwatchLogsExports,
            engineVersion: this.engineVersion,
            kmsKeyId: this.kmsKeyId,
            masterUsername: this.masterUsername,
            masterUserPassword: this.masterUserPassword,
            port: this.port,
            preferredBackupWindow: this.preferredBackupWindow,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            restoreToTime: this.restoreToTime,
            restoreType: this.restoreType,
            snapshotIdentifier: this.snapshotIdentifier,
            sourceDbClusterIdentifier: this.sourceDbClusterIdentifier,
            storageEncrypted: this.storageEncrypted,
            tags: this.tags.renderTags(),
            useLatestRestorableTime: this.useLatestRestorableTime,
            vpcSecurityGroupIds: this.vpcSecurityGroupIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDBClusterPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDBClusterParameterGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html
 */
export interface CfnDBClusterParameterGroupProps {

    /**
     * The description for the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-description
     */
    readonly description: string;

    /**
     * The cluster parameter group family name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-family
     */
    readonly family: string;

    /**
     * Provides a list of parameters for the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-parameters
     */
    readonly parameters: any | cdk.IResolvable;

    /**
     * The name of the DB cluster parameter group.
     *
     * Constraints:
     *
     * - Must not match the name of an existing `DBClusterParameterGroup` .
     *
     * > This value is stored as a lowercase string.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-name
     */
    readonly name?: string;

    /**
     * The tags to be assigned to the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDBClusterParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterParameterGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnDBClusterParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('family', cdk.requiredValidator)(properties.family));
    errors.collect(cdk.propertyValidator('family', cdk.validateString)(properties.family));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parameters', cdk.requiredValidator)(properties.parameters));
    errors.collect(cdk.propertyValidator('parameters', cdk.validateObject)(properties.parameters));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDBClusterParameterGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DocDB::DBClusterParameterGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnDBClusterParameterGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DocDB::DBClusterParameterGroup` resource.
 */
// @ts-ignore TS6133
function cfnDBClusterParameterGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDBClusterParameterGroupPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Family: cdk.stringToCloudFormation(properties.family),
        Parameters: cdk.objectToCloudFormation(properties.parameters),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDBClusterParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBClusterParameterGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBClusterParameterGroupProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('family', 'Family', cfn_parse.FromCloudFormation.getString(properties.Family));
    ret.addPropertyResult('parameters', 'Parameters', cfn_parse.FromCloudFormation.getAny(properties.Parameters));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DocDB::DBClusterParameterGroup`
 *
 * The `AWS::DocDB::DBClusterParameterGroup` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBClusterParameterGroup. For more information, see [DBClusterParameterGroup](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBClusterParameterGroup.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * Parameters in a cluster parameter group apply to all of the instances in a cluster.
 *
 * A cluster parameter group is initially created with the default parameters for the database engine used by instances in the cluster. To provide custom values for any of the parameters, you must modify the group after you create it. After you create a DB cluster parameter group, you must associate it with your cluster. For the new cluster parameter group and associated settings to take effect, you must then reboot the DB instances in the cluster without failover.
 *
 * > After you create a cluster parameter group, you should wait at least 5 minutes before creating your first cluster that uses that cluster parameter group as the default parameter group. This allows Amazon DocumentDB to fully complete the create action before the cluster parameter group is used as the default for a new cluster. This step is especially important for parameters that are critical when creating the default database for a cluster, such as the character set for the default database defined by the `character_set_database` parameter.
 *
 * @cloudformationResource AWS::DocDB::DBClusterParameterGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html
 */
export class CfnDBClusterParameterGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DocDB::DBClusterParameterGroup";

    /**
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
        const ret = new CfnDBClusterParameterGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The description for the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-description
     */
    public description: string;

    /**
     * The cluster parameter group family name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-family
     */
    public family: string;

    /**
     * Provides a list of parameters for the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-parameters
     */
    public parameters: any | cdk.IResolvable;

    /**
     * The name of the DB cluster parameter group.
     *
     * Constraints:
     *
     * - Must not match the name of an existing `DBClusterParameterGroup` .
     *
     * > This value is stored as a lowercase string.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-name
     */
    public name: string | undefined;

    /**
     * The tags to be assigned to the cluster parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbclusterparametergroup.html#cfn-docdb-dbclusterparametergroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DocDB::DBClusterParameterGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDBClusterParameterGroupProps) {
        super(scope, id, { type: CfnDBClusterParameterGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'family', this);
        cdk.requireProperty(props, 'parameters', this);

        this.description = props.description;
        this.family = props.family;
        this.parameters = props.parameters;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBClusterParameterGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBClusterParameterGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            family: this.family,
            parameters: this.parameters,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDBClusterParameterGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDBInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html
 */
export interface CfnDBInstanceProps {

    /**
     * The identifier of the cluster that the instance will belong to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbclusteridentifier
     */
    readonly dbClusterIdentifier: string;

    /**
     * The compute and memory capacity of the instance; for example, `db.m4.large` . If you change the class of an instance there can be some interruption in the cluster's service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceclass
     */
    readonly dbInstanceClass: string;

    /**
     * This parameter does not apply to Amazon DocumentDB. Amazon DocumentDB does not perform minor version upgrades regardless of the value set.
     *
     * Default: `false`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-autominorversionupgrade
     */
    readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

    /**
     * The Amazon EC2 Availability Zone that the instance is created in.
     *
     * Default: A random, system-chosen Availability Zone in the endpoint's AWS Region .
     *
     * Example: `us-east-1d`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-availabilityzone
     */
    readonly availabilityZone?: string;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceidentifier
     */
    readonly dbInstanceIdentifier?: string;

    /**
     * A value that indicates whether to enable Performance Insights for the DB Instance. For more information, see [Using Amazon Performance Insights](https://docs.aws.amazon.com/documentdb/latest/developerguide/performance-insights.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-enableperformanceinsights
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * The tags to be assigned to the instance. You can assign up to 10 tags to an instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDBInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBInstanceProps`
 *
 * @returns the result of the validation.
 */
function CfnDBInstancePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('dbClusterIdentifier', cdk.requiredValidator)(properties.dbClusterIdentifier));
    errors.collect(cdk.propertyValidator('dbClusterIdentifier', cdk.validateString)(properties.dbClusterIdentifier));
    errors.collect(cdk.propertyValidator('dbInstanceClass', cdk.requiredValidator)(properties.dbInstanceClass));
    errors.collect(cdk.propertyValidator('dbInstanceClass', cdk.validateString)(properties.dbInstanceClass));
    errors.collect(cdk.propertyValidator('dbInstanceIdentifier', cdk.validateString)(properties.dbInstanceIdentifier));
    errors.collect(cdk.propertyValidator('enablePerformanceInsights', cdk.validateBoolean)(properties.enablePerformanceInsights));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDBInstanceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DocDB::DBInstance` resource
 *
 * @param properties - the TypeScript properties of a `CfnDBInstanceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DocDB::DBInstance` resource.
 */
// @ts-ignore TS6133
function cfnDBInstancePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDBInstancePropsValidator(properties).assertSuccess();
    return {
        DBClusterIdentifier: cdk.stringToCloudFormation(properties.dbClusterIdentifier),
        DBInstanceClass: cdk.stringToCloudFormation(properties.dbInstanceClass),
        AutoMinorVersionUpgrade: cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        DBInstanceIdentifier: cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
        EnablePerformanceInsights: cdk.booleanToCloudFormation(properties.enablePerformanceInsights),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDBInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBInstanceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBInstanceProps>();
    ret.addPropertyResult('dbClusterIdentifier', 'DBClusterIdentifier', cfn_parse.FromCloudFormation.getString(properties.DBClusterIdentifier));
    ret.addPropertyResult('dbInstanceClass', 'DBInstanceClass', cfn_parse.FromCloudFormation.getString(properties.DBInstanceClass));
    ret.addPropertyResult('autoMinorVersionUpgrade', 'AutoMinorVersionUpgrade', properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined);
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('dbInstanceIdentifier', 'DBInstanceIdentifier', properties.DBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier) : undefined);
    ret.addPropertyResult('enablePerformanceInsights', 'EnablePerformanceInsights', properties.EnablePerformanceInsights != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePerformanceInsights) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DocDB::DBInstance`
 *
 * The `AWS::DocDB::DBInstance` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBInstance. For more information, see [DBInstance](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBInstance.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBInstance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html
 */
export class CfnDBInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DocDB::DBInstance";

    /**
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
        const ret = new CfnDBInstance(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The connection endpoint for the instance. For example: `sample-cluster.cluster-abcdefghijkl.us-east-1.docdb.amazonaws.com` .
     * @cloudformationAttribute Endpoint
     */
    public readonly attrEndpoint: string;

    /**
     * The port number on which the database accepts connections, such as `27017` .
     * @cloudformationAttribute Port
     */
    public readonly attrPort: string;

    /**
     * The identifier of the cluster that the instance will belong to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbclusteridentifier
     */
    public dbClusterIdentifier: string;

    /**
     * The compute and memory capacity of the instance; for example, `db.m4.large` . If you change the class of an instance there can be some interruption in the cluster's service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceclass
     */
    public dbInstanceClass: string;

    /**
     * This parameter does not apply to Amazon DocumentDB. Amazon DocumentDB does not perform minor version upgrades regardless of the value set.
     *
     * Default: `false`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-autominorversionupgrade
     */
    public autoMinorVersionUpgrade: boolean | cdk.IResolvable | undefined;

    /**
     * The Amazon EC2 Availability Zone that the instance is created in.
     *
     * Default: A random, system-chosen Availability Zone in the endpoint's AWS Region .
     *
     * Example: `us-east-1d`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-availabilityzone
     */
    public availabilityZone: string | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-dbinstanceidentifier
     */
    public dbInstanceIdentifier: string | undefined;

    /**
     * A value that indicates whether to enable Performance Insights for the DB Instance. For more information, see [Using Amazon Performance Insights](https://docs.aws.amazon.com/documentdb/latest/developerguide/performance-insights.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-enableperformanceinsights
     */
    public enablePerformanceInsights: boolean | cdk.IResolvable | undefined;

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * The tags to be assigned to the instance. You can assign up to 10 tags to an instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbinstance.html#cfn-docdb-dbinstance-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DocDB::DBInstance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDBInstanceProps) {
        super(scope, id, { type: CfnDBInstance.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dbClusterIdentifier', this);
        cdk.requireProperty(props, 'dbInstanceClass', this);
        this.attrEndpoint = cdk.Token.asString(this.getAtt('Endpoint', cdk.ResolutionTypeHint.STRING));
        this.attrPort = cdk.Token.asString(this.getAtt('Port', cdk.ResolutionTypeHint.STRING));

        this.dbClusterIdentifier = props.dbClusterIdentifier;
        this.dbInstanceClass = props.dbInstanceClass;
        this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
        this.availabilityZone = props.availabilityZone;
        this.dbInstanceIdentifier = props.dbInstanceIdentifier;
        this.enablePerformanceInsights = props.enablePerformanceInsights;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBInstance", props.tags, { tagPropertyName: 'tags' });
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::DocDB::DBInstance\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBInstance.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dbClusterIdentifier: this.dbClusterIdentifier,
            dbInstanceClass: this.dbInstanceClass,
            autoMinorVersionUpgrade: this.autoMinorVersionUpgrade,
            availabilityZone: this.availabilityZone,
            dbInstanceIdentifier: this.dbInstanceIdentifier,
            enablePerformanceInsights: this.enablePerformanceInsights,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDBInstancePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDBSubnetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html
 */
export interface CfnDBSubnetGroupProps {

    /**
     * The description for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupdescription
     */
    readonly dbSubnetGroupDescription: string;

    /**
     * The Amazon EC2 subnet IDs for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The name for the subnet group. This value is stored as a lowercase string.
     *
     * Constraints: Must contain no more than 255 letters, numbers, periods, underscores, spaces, or hyphens. Must not be default.
     *
     * Example: `mySubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupname
     */
    readonly dbSubnetGroupName?: string;

    /**
     * The tags to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDBSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDBSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnDBSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dbSubnetGroupDescription', cdk.requiredValidator)(properties.dbSubnetGroupDescription));
    errors.collect(cdk.propertyValidator('dbSubnetGroupDescription', cdk.validateString)(properties.dbSubnetGroupDescription));
    errors.collect(cdk.propertyValidator('dbSubnetGroupName', cdk.validateString)(properties.dbSubnetGroupName));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDBSubnetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DocDB::DBSubnetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnDBSubnetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DocDB::DBSubnetGroup` resource.
 */
// @ts-ignore TS6133
function cfnDBSubnetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDBSubnetGroupPropsValidator(properties).assertSuccess();
    return {
        DBSubnetGroupDescription: cdk.stringToCloudFormation(properties.dbSubnetGroupDescription),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        DBSubnetGroupName: cdk.stringToCloudFormation(properties.dbSubnetGroupName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDBSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDBSubnetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDBSubnetGroupProps>();
    ret.addPropertyResult('dbSubnetGroupDescription', 'DBSubnetGroupDescription', cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupDescription));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('dbSubnetGroupName', 'DBSubnetGroupName', properties.DBSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DBSubnetGroupName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DocDB::DBSubnetGroup`
 *
 * The `AWS::DocDB::DBSubnetGroup` Amazon DocumentDB (with MongoDB compatibility) resource describes a DBSubnetGroup. subnet groups must contain at least one subnet in at least two Availability Zones in the AWS Region . For more information, see [DBSubnetGroup](https://docs.aws.amazon.com/documentdb/latest/developerguide/API_DBSubnetGroup.html) in the *Amazon DocumentDB Developer Guide* .
 *
 * @cloudformationResource AWS::DocDB::DBSubnetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html
 */
export class CfnDBSubnetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DocDB::DBSubnetGroup";

    /**
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
        const ret = new CfnDBSubnetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The description for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupdescription
     */
    public dbSubnetGroupDescription: string;

    /**
     * The Amazon EC2 subnet IDs for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-subnetids
     */
    public subnetIds: string[];

    /**
     * The name for the subnet group. This value is stored as a lowercase string.
     *
     * Constraints: Must contain no more than 255 letters, numbers, periods, underscores, spaces, or hyphens. Must not be default.
     *
     * Example: `mySubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-dbsubnetgroupname
     */
    public dbSubnetGroupName: string | undefined;

    /**
     * The tags to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdb-dbsubnetgroup.html#cfn-docdb-dbsubnetgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DocDB::DBSubnetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDBSubnetGroupProps) {
        super(scope, id, { type: CfnDBSubnetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dbSubnetGroupDescription', this);
        cdk.requireProperty(props, 'subnetIds', this);

        this.dbSubnetGroupDescription = props.dbSubnetGroupDescription;
        this.subnetIds = props.subnetIds;
        this.dbSubnetGroupName = props.dbSubnetGroupName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDB::DBSubnetGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDBSubnetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dbSubnetGroupDescription: this.dbSubnetGroupDescription,
            subnetIds: this.subnetIds,
            dbSubnetGroupName: this.dbSubnetGroupName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDBSubnetGroupPropsToCloudFormation(props);
    }
}
