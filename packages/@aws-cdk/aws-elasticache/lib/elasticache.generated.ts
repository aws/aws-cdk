// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:58.339Z","fingerprint":"avxA0XtsmnVBaV+8Y3VwVthEUVo/RbM/3bsJ/gKsNbE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCacheCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html
 */
export interface CfnCacheClusterProps {

    /**
     * The compute and memory capacity of the nodes in the node group (shard).
     *
     * The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts. Changing the CacheNodeType of a Memcached instance is currently not supported. If you need to scale using Memcached, we recommend forcing a replacement update by changing the `LogicalResourceId` of the resource.
     *
     * - General purpose:
     *
     * - Current generation:
     *
     * *M6g node types:* `cache.m6g.large` , `cache.m6g.xlarge` , `cache.m6g.2xlarge` , `cache.m6g.4xlarge` , `cache.m6g.8xlarge` , `cache.m6g.12xlarge` , `cache.m6g.16xlarge` , `cache.m6g.24xlarge`
     *
     * *M5 node types:* `cache.m5.large` , `cache.m5.xlarge` , `cache.m5.2xlarge` , `cache.m5.4xlarge` , `cache.m5.12xlarge` , `cache.m5.24xlarge`
     *
     * *M4 node types:* `cache.m4.large` , `cache.m4.xlarge` , `cache.m4.2xlarge` , `cache.m4.4xlarge` , `cache.m4.10xlarge`
     *
     * *T4g node types:* `cache.t4g.micro` , `cache.t4g.small` , `cache.t4g.medium`
     *
     * *T3 node types:* `cache.t3.micro` , `cache.t3.small` , `cache.t3.medium`
     *
     * *T2 node types:* `cache.t2.micro` , `cache.t2.small` , `cache.t2.medium`
     * - Previous generation: (not recommended)
     *
     * *T1 node types:* `cache.t1.micro`
     *
     * *M1 node types:* `cache.m1.small` , `cache.m1.medium` , `cache.m1.large` , `cache.m1.xlarge`
     *
     * *M3 node types:* `cache.m3.medium` , `cache.m3.large` , `cache.m3.xlarge` , `cache.m3.2xlarge`
     * - Compute optimized:
     *
     * - Previous generation: (not recommended)
     *
     * *C1 node types:* `cache.c1.xlarge`
     * - Memory optimized:
     *
     * - Current generation:
     *
     * *R6gd node types:* `cache.r6gd.xlarge` , `cache.r6gd.2xlarge` , `cache.r6gd.4xlarge` , `cache.r6gd.8xlarge` , `cache.r6gd.12xlarge` , `cache.r6gd.16xlarge`
     *
     * > The `r6gd` family is available in the following regions: `us-east-2` , `us-east-1` , `us-west-2` , `us-west-1` , `eu-west-1` , `eu-central-1` , `ap-northeast-1` , `ap-southeast-1` , `ap-southeast-2` .
     *
     * *R6g node types:* `cache.r6g.large` , `cache.r6g.xlarge` , `cache.r6g.2xlarge` , `cache.r6g.4xlarge` , `cache.r6g.8xlarge` , `cache.r6g.12xlarge` , `cache.r6g.16xlarge` , `cache.r6g.24xlarge`
     *
     * *R5 node types:* `cache.r5.large` , `cache.r5.xlarge` , `cache.r5.2xlarge` , `cache.r5.4xlarge` , `cache.r5.12xlarge` , `cache.r5.24xlarge`
     *
     * *R4 node types:* `cache.r4.large` , `cache.r4.xlarge` , `cache.r4.2xlarge` , `cache.r4.4xlarge` , `cache.r4.8xlarge` , `cache.r4.16xlarge`
     * - Previous generation: (not recommended)
     *
     * *M2 node types:* `cache.m2.xlarge` , `cache.m2.2xlarge` , `cache.m2.4xlarge`
     *
     * *R3 node types:* `cache.r3.large` , `cache.r3.xlarge` , `cache.r3.2xlarge` , `cache.r3.4xlarge` , `cache.r3.8xlarge`
     *
     * For region availability, see [Supported Node Types by Region](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html#CacheNodes.SupportedTypesByRegion)
     *
     * *Additional node type info*
     *
     * - All current generation instance types are created in Amazon VPC by default.
     * - Redis append-only files (AOF) are not supported for T1 or T2 instances.
     * - Redis Multi-AZ with automatic failover is not supported on T1 instances.
     * - Redis configuration variables `appendonly` and `appendfsync` are not supported on Redis version 2.8.22 and later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachenodetype
     */
    readonly cacheNodeType: string;

    /**
     * The name of the cache engine to be used for this cluster.
     *
     * Valid values for this parameter are: `memcached` | `redis`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engine
     */
    readonly engine: string;

    /**
     * The number of cache nodes that the cache cluster should have.
     *
     * > However, if the `PreferredAvailabilityZone` and `PreferredAvailabilityZones` properties were not previously specified and you don't specify any new values, an update requires [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-numcachenodes
     */
    readonly numCacheNodes: number;

    /**
     * If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next minor version upgrade campaign. This parameter is disabled for previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-autominorversionupgrade
     */
    readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

    /**
     * Specifies whether the nodes in this Memcached cluster are created in a single Availability Zone or created across multiple Availability Zones in the cluster's region.
     *
     * This parameter is only supported for Memcached clusters.
     *
     * If the `AZMode` and `PreferredAvailabilityZones` are not specified, ElastiCache assumes `single-az` mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-azmode
     */
    readonly azMode?: string;

    /**
     * The name of the parameter group to associate with this cluster. If this argument is omitted, the default parameter group for the specified engine is used. You cannot use any parameter group which has `cluster-enabled='yes'` when creating a cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cacheparametergroupname
     */
    readonly cacheParameterGroupName?: string;

    /**
     * A list of security group names to associate with this cluster.
     *
     * Use this parameter only when you are creating a cluster outside of an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesecuritygroupnames
     */
    readonly cacheSecurityGroupNames?: string[];

    /**
     * The name of the subnet group to be used for the cluster.
     *
     * Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * > If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see [AWS::ElastiCache::SubnetGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-subnetgroup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesubnetgroupname
     */
    readonly cacheSubnetGroupName?: string;

    /**
     * A name for the cache cluster. If you don't specify a name, AWSCloudFormation generates a unique physical ID and uses that ID for the cache cluster. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * The name must contain 1 to 50 alphanumeric characters or hyphens. The name must start with a letter and cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-clustername
     */
    readonly clusterName?: string;

    /**
     * The version number of the cache engine to be used for this cluster. To view the supported cache engine versions, use the DescribeCacheEngineVersions operation.
     *
     * *Important:* You can upgrade to a newer engine version (see [Selecting a Cache Engine and Version](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SelectEngine.html#VersionManagement) ), but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engineversion
     */
    readonly engineVersion?: string;

    /**
     * The network type you choose when modifying a cluster, either `ipv4` | `ipv6` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-ipdiscovery
     */
    readonly ipDiscovery?: string;

    /**
     * Specifies the destination, format and type of the logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-logdeliveryconfigurations
     */
    readonly logDeliveryConfigurations?: Array<CfnCacheCluster.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Must be either `ipv4` | `ipv6` | `dual_stack` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-networktype
     */
    readonly networkType?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.
     *
     * > The Amazon SNS topic owner must be the same as the cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-notificationtopicarn
     */
    readonly notificationTopicArn?: string;

    /**
     * The port number on which each of the cache nodes accepts connections.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-port
     */
    readonly port?: number;

    /**
     * The EC2 Availability Zone in which the cluster is created.
     *
     * All nodes belonging to this cluster are placed in the preferred Availability Zone. If you want to create your nodes across multiple Availability Zones, use `PreferredAvailabilityZones` .
     *
     * Default: System chosen Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzone
     */
    readonly preferredAvailabilityZone?: string;

    /**
     * A list of the Availability Zones in which cache nodes are created. The order of the zones in the list is not important.
     *
     * This option is only supported on Memcached.
     *
     * > If you are creating your cluster in an Amazon VPC (recommended) you can only locate nodes in Availability Zones that are associated with the subnets in the selected subnet group.
     * >
     * > The number of Availability Zones listed must equal the value of `NumCacheNodes` .
     *
     * If you want all the nodes in the same Availability Zone, use `PreferredAvailabilityZone` instead, or repeat the Availability Zone multiple times in the list.
     *
     * Default: System chosen Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzones
     */
    readonly preferredAvailabilityZones?: string[];

    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for `ddd` are:
     *
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period.
     *
     * Valid values for `ddd` are:
     *
     * - `sun`
     * - `mon`
     * - `tue`
     * - `wed`
     * - `thu`
     * - `fri`
     * - `sat`
     *
     * Example: `sun:23:00-mon:01:30`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * A single-element string list containing an Amazon Resource Name (ARN) that uniquely identifies a Redis RDB snapshot file stored in Amazon S3. The snapshot file is used to populate the node group (shard). The Amazon S3 object name in the ARN cannot contain any commas.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * Example of an Amazon S3 ARN: `arn:aws:s3:::my_bucket/snapshot1.rdb`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotarns
     */
    readonly snapshotArns?: string[];

    /**
     * The name of a Redis snapshot from which to restore data into the new node group (shard). The snapshot status changes to `restoring` while the new node group (shard) is being created.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotname
     */
    readonly snapshotName?: string;

    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set `SnapshotRetentionLimit` to 5, a snapshot taken today is retained for 5 days before being deleted.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * Default: 0 (i.e., automatic backups are disabled for this cache cluster).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotretentionlimit
     */
    readonly snapshotRetentionLimit?: number;

    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard).
     *
     * Example: `05:00-09:00`
     *
     * If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotwindow
     */
    readonly snapshotWindow?: string;

    /**
     * A list of tags to be added to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A flag that enables in-transit encryption when set to true.
     *
     * Only available when creating a cache cluster in an Amazon VPC using Memcached version 1.6.12 or later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-transitencryptionenabled
     */
    readonly transitEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * One or more VPC security groups associated with the cluster.
     *
     * Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-vpcsecuritygroupids
     */
    readonly vpcSecurityGroupIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnCacheClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnCacheClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnCacheClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('azMode', cdk.validateString)(properties.azMode));
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('cacheNodeType', cdk.requiredValidator)(properties.cacheNodeType));
    errors.collect(cdk.propertyValidator('cacheNodeType', cdk.validateString)(properties.cacheNodeType));
    errors.collect(cdk.propertyValidator('cacheParameterGroupName', cdk.validateString)(properties.cacheParameterGroupName));
    errors.collect(cdk.propertyValidator('cacheSecurityGroupNames', cdk.listValidator(cdk.validateString))(properties.cacheSecurityGroupNames));
    errors.collect(cdk.propertyValidator('cacheSubnetGroupName', cdk.validateString)(properties.cacheSubnetGroupName));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('engine', cdk.requiredValidator)(properties.engine));
    errors.collect(cdk.propertyValidator('engine', cdk.validateString)(properties.engine));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('ipDiscovery', cdk.validateString)(properties.ipDiscovery));
    errors.collect(cdk.propertyValidator('logDeliveryConfigurations', cdk.listValidator(CfnCacheCluster_LogDeliveryConfigurationRequestPropertyValidator))(properties.logDeliveryConfigurations));
    errors.collect(cdk.propertyValidator('networkType', cdk.validateString)(properties.networkType));
    errors.collect(cdk.propertyValidator('notificationTopicArn', cdk.validateString)(properties.notificationTopicArn));
    errors.collect(cdk.propertyValidator('numCacheNodes', cdk.requiredValidator)(properties.numCacheNodes));
    errors.collect(cdk.propertyValidator('numCacheNodes', cdk.validateNumber)(properties.numCacheNodes));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('preferredAvailabilityZone', cdk.validateString)(properties.preferredAvailabilityZone));
    errors.collect(cdk.propertyValidator('preferredAvailabilityZones', cdk.listValidator(cdk.validateString))(properties.preferredAvailabilityZones));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('snapshotArns', cdk.listValidator(cdk.validateString))(properties.snapshotArns));
    errors.collect(cdk.propertyValidator('snapshotName', cdk.validateString)(properties.snapshotName));
    errors.collect(cdk.propertyValidator('snapshotRetentionLimit', cdk.validateNumber)(properties.snapshotRetentionLimit));
    errors.collect(cdk.propertyValidator('snapshotWindow', cdk.validateString)(properties.snapshotWindow));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('transitEncryptionEnabled', cdk.validateBoolean)(properties.transitEncryptionEnabled));
    errors.collect(cdk.propertyValidator('vpcSecurityGroupIds', cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
    return errors.wrap('supplied properties not correct for "CfnCacheClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnCacheClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster` resource.
 */
// @ts-ignore TS6133
function cfnCacheClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCacheClusterPropsValidator(properties).assertSuccess();
    return {
        CacheNodeType: cdk.stringToCloudFormation(properties.cacheNodeType),
        Engine: cdk.stringToCloudFormation(properties.engine),
        NumCacheNodes: cdk.numberToCloudFormation(properties.numCacheNodes),
        AutoMinorVersionUpgrade: cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
        AZMode: cdk.stringToCloudFormation(properties.azMode),
        CacheParameterGroupName: cdk.stringToCloudFormation(properties.cacheParameterGroupName),
        CacheSecurityGroupNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.cacheSecurityGroupNames),
        CacheSubnetGroupName: cdk.stringToCloudFormation(properties.cacheSubnetGroupName),
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        IpDiscovery: cdk.stringToCloudFormation(properties.ipDiscovery),
        LogDeliveryConfigurations: cdk.listMapper(cfnCacheClusterLogDeliveryConfigurationRequestPropertyToCloudFormation)(properties.logDeliveryConfigurations),
        NetworkType: cdk.stringToCloudFormation(properties.networkType),
        NotificationTopicArn: cdk.stringToCloudFormation(properties.notificationTopicArn),
        Port: cdk.numberToCloudFormation(properties.port),
        PreferredAvailabilityZone: cdk.stringToCloudFormation(properties.preferredAvailabilityZone),
        PreferredAvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.preferredAvailabilityZones),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        SnapshotArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.snapshotArns),
        SnapshotName: cdk.stringToCloudFormation(properties.snapshotName),
        SnapshotRetentionLimit: cdk.numberToCloudFormation(properties.snapshotRetentionLimit),
        SnapshotWindow: cdk.stringToCloudFormation(properties.snapshotWindow),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TransitEncryptionEnabled: cdk.booleanToCloudFormation(properties.transitEncryptionEnabled),
        VpcSecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds),
    };
}

// @ts-ignore TS6133
function CfnCacheClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCacheClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCacheClusterProps>();
    ret.addPropertyResult('cacheNodeType', 'CacheNodeType', cfn_parse.FromCloudFormation.getString(properties.CacheNodeType));
    ret.addPropertyResult('engine', 'Engine', cfn_parse.FromCloudFormation.getString(properties.Engine));
    ret.addPropertyResult('numCacheNodes', 'NumCacheNodes', cfn_parse.FromCloudFormation.getNumber(properties.NumCacheNodes));
    ret.addPropertyResult('autoMinorVersionUpgrade', 'AutoMinorVersionUpgrade', properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined);
    ret.addPropertyResult('azMode', 'AZMode', properties.AZMode != null ? cfn_parse.FromCloudFormation.getString(properties.AZMode) : undefined);
    ret.addPropertyResult('cacheParameterGroupName', 'CacheParameterGroupName', properties.CacheParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheParameterGroupName) : undefined);
    ret.addPropertyResult('cacheSecurityGroupNames', 'CacheSecurityGroupNames', properties.CacheSecurityGroupNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CacheSecurityGroupNames) : undefined);
    ret.addPropertyResult('cacheSubnetGroupName', 'CacheSubnetGroupName', properties.CacheSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheSubnetGroupName) : undefined);
    ret.addPropertyResult('clusterName', 'ClusterName', properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('ipDiscovery', 'IpDiscovery', properties.IpDiscovery != null ? cfn_parse.FromCloudFormation.getString(properties.IpDiscovery) : undefined);
    ret.addPropertyResult('logDeliveryConfigurations', 'LogDeliveryConfigurations', properties.LogDeliveryConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnCacheClusterLogDeliveryConfigurationRequestPropertyFromCloudFormation)(properties.LogDeliveryConfigurations) : undefined);
    ret.addPropertyResult('networkType', 'NetworkType', properties.NetworkType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkType) : undefined);
    ret.addPropertyResult('notificationTopicArn', 'NotificationTopicArn', properties.NotificationTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTopicArn) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('preferredAvailabilityZone', 'PreferredAvailabilityZone', properties.PreferredAvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredAvailabilityZone) : undefined);
    ret.addPropertyResult('preferredAvailabilityZones', 'PreferredAvailabilityZones', properties.PreferredAvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PreferredAvailabilityZones) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('snapshotArns', 'SnapshotArns', properties.SnapshotArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SnapshotArns) : undefined);
    ret.addPropertyResult('snapshotName', 'SnapshotName', properties.SnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotName) : undefined);
    ret.addPropertyResult('snapshotRetentionLimit', 'SnapshotRetentionLimit', properties.SnapshotRetentionLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.SnapshotRetentionLimit) : undefined);
    ret.addPropertyResult('snapshotWindow', 'SnapshotWindow', properties.SnapshotWindow != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotWindow) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('transitEncryptionEnabled', 'TransitEncryptionEnabled', properties.TransitEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransitEncryptionEnabled) : undefined);
    ret.addPropertyResult('vpcSecurityGroupIds', 'VpcSecurityGroupIds', properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.VpcSecurityGroupIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::CacheCluster`
 *
 * The AWS::ElastiCache::CacheCluster type creates an Amazon ElastiCache cache cluster.
 *
 * @cloudformationResource AWS::ElastiCache::CacheCluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html
 */
export class CfnCacheCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::CacheCluster";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCacheCluster {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCacheClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCacheCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The DNS hostname of the cache node.
     *
     * > Redis (cluster mode disabled) replication groups don't have this attribute. Therefore, `Fn::GetAtt` returns a value for this attribute only if the replication group is clustered. Otherwise, `Fn::GetAtt` fails.
     * @cloudformationAttribute ConfigurationEndpoint.Address
     */
    public readonly attrConfigurationEndpointAddress: string;

    /**
     * The port number of the configuration endpoint for the Memcached cache cluster.
     *
     * > Redis (cluster mode disabled) replication groups don't have this attribute. Therefore, `Fn::GetAtt` returns a value for this attribute only if the replication group is clustered. Otherwise, `Fn::GetAtt` fails.
     * @cloudformationAttribute ConfigurationEndpoint.Port
     */
    public readonly attrConfigurationEndpointPort: string;

    /**
     * The DNS address of the configuration endpoint for the Redis cache cluster.
     * @cloudformationAttribute RedisEndpoint.Address
     */
    public readonly attrRedisEndpointAddress: string;

    /**
     * The port number of the configuration endpoint for the Redis cache cluster.
     * @cloudformationAttribute RedisEndpoint.Port
     */
    public readonly attrRedisEndpointPort: string;

    /**
     * The compute and memory capacity of the nodes in the node group (shard).
     *
     * The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts. Changing the CacheNodeType of a Memcached instance is currently not supported. If you need to scale using Memcached, we recommend forcing a replacement update by changing the `LogicalResourceId` of the resource.
     *
     * - General purpose:
     *
     * - Current generation:
     *
     * *M6g node types:* `cache.m6g.large` , `cache.m6g.xlarge` , `cache.m6g.2xlarge` , `cache.m6g.4xlarge` , `cache.m6g.8xlarge` , `cache.m6g.12xlarge` , `cache.m6g.16xlarge` , `cache.m6g.24xlarge`
     *
     * *M5 node types:* `cache.m5.large` , `cache.m5.xlarge` , `cache.m5.2xlarge` , `cache.m5.4xlarge` , `cache.m5.12xlarge` , `cache.m5.24xlarge`
     *
     * *M4 node types:* `cache.m4.large` , `cache.m4.xlarge` , `cache.m4.2xlarge` , `cache.m4.4xlarge` , `cache.m4.10xlarge`
     *
     * *T4g node types:* `cache.t4g.micro` , `cache.t4g.small` , `cache.t4g.medium`
     *
     * *T3 node types:* `cache.t3.micro` , `cache.t3.small` , `cache.t3.medium`
     *
     * *T2 node types:* `cache.t2.micro` , `cache.t2.small` , `cache.t2.medium`
     * - Previous generation: (not recommended)
     *
     * *T1 node types:* `cache.t1.micro`
     *
     * *M1 node types:* `cache.m1.small` , `cache.m1.medium` , `cache.m1.large` , `cache.m1.xlarge`
     *
     * *M3 node types:* `cache.m3.medium` , `cache.m3.large` , `cache.m3.xlarge` , `cache.m3.2xlarge`
     * - Compute optimized:
     *
     * - Previous generation: (not recommended)
     *
     * *C1 node types:* `cache.c1.xlarge`
     * - Memory optimized:
     *
     * - Current generation:
     *
     * *R6gd node types:* `cache.r6gd.xlarge` , `cache.r6gd.2xlarge` , `cache.r6gd.4xlarge` , `cache.r6gd.8xlarge` , `cache.r6gd.12xlarge` , `cache.r6gd.16xlarge`
     *
     * > The `r6gd` family is available in the following regions: `us-east-2` , `us-east-1` , `us-west-2` , `us-west-1` , `eu-west-1` , `eu-central-1` , `ap-northeast-1` , `ap-southeast-1` , `ap-southeast-2` .
     *
     * *R6g node types:* `cache.r6g.large` , `cache.r6g.xlarge` , `cache.r6g.2xlarge` , `cache.r6g.4xlarge` , `cache.r6g.8xlarge` , `cache.r6g.12xlarge` , `cache.r6g.16xlarge` , `cache.r6g.24xlarge`
     *
     * *R5 node types:* `cache.r5.large` , `cache.r5.xlarge` , `cache.r5.2xlarge` , `cache.r5.4xlarge` , `cache.r5.12xlarge` , `cache.r5.24xlarge`
     *
     * *R4 node types:* `cache.r4.large` , `cache.r4.xlarge` , `cache.r4.2xlarge` , `cache.r4.4xlarge` , `cache.r4.8xlarge` , `cache.r4.16xlarge`
     * - Previous generation: (not recommended)
     *
     * *M2 node types:* `cache.m2.xlarge` , `cache.m2.2xlarge` , `cache.m2.4xlarge`
     *
     * *R3 node types:* `cache.r3.large` , `cache.r3.xlarge` , `cache.r3.2xlarge` , `cache.r3.4xlarge` , `cache.r3.8xlarge`
     *
     * For region availability, see [Supported Node Types by Region](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html#CacheNodes.SupportedTypesByRegion)
     *
     * *Additional node type info*
     *
     * - All current generation instance types are created in Amazon VPC by default.
     * - Redis append-only files (AOF) are not supported for T1 or T2 instances.
     * - Redis Multi-AZ with automatic failover is not supported on T1 instances.
     * - Redis configuration variables `appendonly` and `appendfsync` are not supported on Redis version 2.8.22 and later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachenodetype
     */
    public cacheNodeType: string;

    /**
     * The name of the cache engine to be used for this cluster.
     *
     * Valid values for this parameter are: `memcached` | `redis`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engine
     */
    public engine: string;

    /**
     * The number of cache nodes that the cache cluster should have.
     *
     * > However, if the `PreferredAvailabilityZone` and `PreferredAvailabilityZones` properties were not previously specified and you don't specify any new values, an update requires [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-numcachenodes
     */
    public numCacheNodes: number;

    /**
     * If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next minor version upgrade campaign. This parameter is disabled for previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-autominorversionupgrade
     */
    public autoMinorVersionUpgrade: boolean | cdk.IResolvable | undefined;

    /**
     * Specifies whether the nodes in this Memcached cluster are created in a single Availability Zone or created across multiple Availability Zones in the cluster's region.
     *
     * This parameter is only supported for Memcached clusters.
     *
     * If the `AZMode` and `PreferredAvailabilityZones` are not specified, ElastiCache assumes `single-az` mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-azmode
     */
    public azMode: string | undefined;

    /**
     * The name of the parameter group to associate with this cluster. If this argument is omitted, the default parameter group for the specified engine is used. You cannot use any parameter group which has `cluster-enabled='yes'` when creating a cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cacheparametergroupname
     */
    public cacheParameterGroupName: string | undefined;

    /**
     * A list of security group names to associate with this cluster.
     *
     * Use this parameter only when you are creating a cluster outside of an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesecuritygroupnames
     */
    public cacheSecurityGroupNames: string[] | undefined;

    /**
     * The name of the subnet group to be used for the cluster.
     *
     * Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * > If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see [AWS::ElastiCache::SubnetGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-subnetgroup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-cachesubnetgroupname
     */
    public cacheSubnetGroupName: string | undefined;

    /**
     * A name for the cache cluster. If you don't specify a name, AWSCloudFormation generates a unique physical ID and uses that ID for the cache cluster. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * The name must contain 1 to 50 alphanumeric characters or hyphens. The name must start with a letter and cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-clustername
     */
    public clusterName: string | undefined;

    /**
     * The version number of the cache engine to be used for this cluster. To view the supported cache engine versions, use the DescribeCacheEngineVersions operation.
     *
     * *Important:* You can upgrade to a newer engine version (see [Selecting a Cache Engine and Version](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SelectEngine.html#VersionManagement) ), but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * The network type you choose when modifying a cluster, either `ipv4` | `ipv6` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-ipdiscovery
     */
    public ipDiscovery: string | undefined;

    /**
     * Specifies the destination, format and type of the logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-logdeliveryconfigurations
     */
    public logDeliveryConfigurations: Array<CfnCacheCluster.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Must be either `ipv4` | `ipv6` | `dual_stack` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-networktype
     */
    public networkType: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.
     *
     * > The Amazon SNS topic owner must be the same as the cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-notificationtopicarn
     */
    public notificationTopicArn: string | undefined;

    /**
     * The port number on which each of the cache nodes accepts connections.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-port
     */
    public port: number | undefined;

    /**
     * The EC2 Availability Zone in which the cluster is created.
     *
     * All nodes belonging to this cluster are placed in the preferred Availability Zone. If you want to create your nodes across multiple Availability Zones, use `PreferredAvailabilityZones` .
     *
     * Default: System chosen Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzone
     */
    public preferredAvailabilityZone: string | undefined;

    /**
     * A list of the Availability Zones in which cache nodes are created. The order of the zones in the list is not important.
     *
     * This option is only supported on Memcached.
     *
     * > If you are creating your cluster in an Amazon VPC (recommended) you can only locate nodes in Availability Zones that are associated with the subnets in the selected subnet group.
     * >
     * > The number of Availability Zones listed must equal the value of `NumCacheNodes` .
     *
     * If you want all the nodes in the same Availability Zone, use `PreferredAvailabilityZone` instead, or repeat the Availability Zone multiple times in the list.
     *
     * Default: System chosen Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredavailabilityzones
     */
    public preferredAvailabilityZones: string[] | undefined;

    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for `ddd` are:
     *
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period.
     *
     * Valid values for `ddd` are:
     *
     * - `sun`
     * - `mon`
     * - `tue`
     * - `wed`
     * - `thu`
     * - `fri`
     * - `sat`
     *
     * Example: `sun:23:00-mon:01:30`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * A single-element string list containing an Amazon Resource Name (ARN) that uniquely identifies a Redis RDB snapshot file stored in Amazon S3. The snapshot file is used to populate the node group (shard). The Amazon S3 object name in the ARN cannot contain any commas.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * Example of an Amazon S3 ARN: `arn:aws:s3:::my_bucket/snapshot1.rdb`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotarns
     */
    public snapshotArns: string[] | undefined;

    /**
     * The name of a Redis snapshot from which to restore data into the new node group (shard). The snapshot status changes to `restoring` while the new node group (shard) is being created.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotname
     */
    public snapshotName: string | undefined;

    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set `SnapshotRetentionLimit` to 5, a snapshot taken today is retained for 5 days before being deleted.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * Default: 0 (i.e., automatic backups are disabled for this cache cluster).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotretentionlimit
     */
    public snapshotRetentionLimit: number | undefined;

    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard).
     *
     * Example: `05:00-09:00`
     *
     * If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     *
     * > This parameter is only valid if the `Engine` parameter is `redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-snapshotwindow
     */
    public snapshotWindow: string | undefined;

    /**
     * A list of tags to be added to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A flag that enables in-transit encryption when set to true.
     *
     * Only available when creating a cache cluster in an Amazon VPC using Memcached version 1.6.12 or later.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-transitencryptionenabled
     */
    public transitEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * One or more VPC security groups associated with the cluster.
     *
     * Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html#cfn-elasticache-cachecluster-vpcsecuritygroupids
     */
    public vpcSecurityGroupIds: string[] | undefined;

    /**
     * Create a new `AWS::ElastiCache::CacheCluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCacheClusterProps) {
        super(scope, id, { type: CfnCacheCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'cacheNodeType', this);
        cdk.requireProperty(props, 'engine', this);
        cdk.requireProperty(props, 'numCacheNodes', this);
        this.attrConfigurationEndpointAddress = cdk.Token.asString(this.getAtt('ConfigurationEndpoint.Address', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationEndpointPort = cdk.Token.asString(this.getAtt('ConfigurationEndpoint.Port', cdk.ResolutionTypeHint.STRING));
        this.attrRedisEndpointAddress = cdk.Token.asString(this.getAtt('RedisEndpoint.Address', cdk.ResolutionTypeHint.STRING));
        this.attrRedisEndpointPort = cdk.Token.asString(this.getAtt('RedisEndpoint.Port', cdk.ResolutionTypeHint.STRING));

        this.cacheNodeType = props.cacheNodeType;
        this.engine = props.engine;
        this.numCacheNodes = props.numCacheNodes;
        this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
        this.azMode = props.azMode;
        this.cacheParameterGroupName = props.cacheParameterGroupName;
        this.cacheSecurityGroupNames = props.cacheSecurityGroupNames;
        this.cacheSubnetGroupName = props.cacheSubnetGroupName;
        this.clusterName = props.clusterName;
        this.engineVersion = props.engineVersion;
        this.ipDiscovery = props.ipDiscovery;
        this.logDeliveryConfigurations = props.logDeliveryConfigurations;
        this.networkType = props.networkType;
        this.notificationTopicArn = props.notificationTopicArn;
        this.port = props.port;
        this.preferredAvailabilityZone = props.preferredAvailabilityZone;
        this.preferredAvailabilityZones = props.preferredAvailabilityZones;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.snapshotArns = props.snapshotArns;
        this.snapshotName = props.snapshotName;
        this.snapshotRetentionLimit = props.snapshotRetentionLimit;
        this.snapshotWindow = props.snapshotWindow;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElastiCache::CacheCluster", props.tags, { tagPropertyName: 'tags' });
        this.transitEncryptionEnabled = props.transitEncryptionEnabled;
        this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::ElastiCache::CacheCluster\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCacheCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cacheNodeType: this.cacheNodeType,
            engine: this.engine,
            numCacheNodes: this.numCacheNodes,
            autoMinorVersionUpgrade: this.autoMinorVersionUpgrade,
            azMode: this.azMode,
            cacheParameterGroupName: this.cacheParameterGroupName,
            cacheSecurityGroupNames: this.cacheSecurityGroupNames,
            cacheSubnetGroupName: this.cacheSubnetGroupName,
            clusterName: this.clusterName,
            engineVersion: this.engineVersion,
            ipDiscovery: this.ipDiscovery,
            logDeliveryConfigurations: this.logDeliveryConfigurations,
            networkType: this.networkType,
            notificationTopicArn: this.notificationTopicArn,
            port: this.port,
            preferredAvailabilityZone: this.preferredAvailabilityZone,
            preferredAvailabilityZones: this.preferredAvailabilityZones,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            snapshotArns: this.snapshotArns,
            snapshotName: this.snapshotName,
            snapshotRetentionLimit: this.snapshotRetentionLimit,
            snapshotWindow: this.snapshotWindow,
            tags: this.tags.renderTags(),
            transitEncryptionEnabled: this.transitEncryptionEnabled,
            vpcSecurityGroupIds: this.vpcSecurityGroupIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCacheClusterPropsToCloudFormation(props);
    }
}

export namespace CfnCacheCluster {
    /**
     * Configuration details of a CloudWatch Logs destination. Note that this field is marked as required but only if CloudWatch Logs was chosen as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-cloudwatchlogsdestinationdetails.html
     */
    export interface CloudWatchLogsDestinationDetailsProperty {
        /**
         * The name of the CloudWatch Logs log group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-cloudwatchlogsdestinationdetails.html#cfn-elasticache-cachecluster-cloudwatchlogsdestinationdetails-loggroup
         */
        readonly logGroup: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCacheCluster_CloudWatchLogsDestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroup', cdk.requiredValidator)(properties.logGroup));
    errors.collect(cdk.propertyValidator('logGroup', cdk.validateString)(properties.logGroup));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsDestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.CloudWatchLogsDestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.CloudWatchLogsDestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnCacheClusterCloudWatchLogsDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCacheCluster_CloudWatchLogsDestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        LogGroup: cdk.stringToCloudFormation(properties.logGroup),
    };
}

// @ts-ignore TS6133
function CfnCacheClusterCloudWatchLogsDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCacheCluster.CloudWatchLogsDestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCacheCluster.CloudWatchLogsDestinationDetailsProperty>();
    ret.addPropertyResult('logGroup', 'LogGroup', cfn_parse.FromCloudFormation.getString(properties.LogGroup));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCacheCluster {
    /**
     * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-destinationdetails.html
     */
    export interface DestinationDetailsProperty {
        /**
         * The configuration details of the CloudWatch Logs destination. Note that this field is marked as required but only if CloudWatch Logs was chosen as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-destinationdetails.html#cfn-elasticache-cachecluster-destinationdetails-cloudwatchlogsdetails
         */
        readonly cloudWatchLogsDetails?: CfnCacheCluster.CloudWatchLogsDestinationDetailsProperty | cdk.IResolvable;
        /**
         * The configuration details of the Kinesis Data Firehose destination. Note that this field is marked as required but only if Kinesis Data Firehose was chosen as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-destinationdetails.html#cfn-elasticache-cachecluster-destinationdetails-kinesisfirehosedetails
         */
        readonly kinesisFirehoseDetails?: CfnCacheCluster.KinesisFirehoseDestinationDetailsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCacheCluster_DestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsDetails', CfnCacheCluster_CloudWatchLogsDestinationDetailsPropertyValidator)(properties.cloudWatchLogsDetails));
    errors.collect(cdk.propertyValidator('kinesisFirehoseDetails', CfnCacheCluster_KinesisFirehoseDestinationDetailsPropertyValidator)(properties.kinesisFirehoseDetails));
    return errors.wrap('supplied properties not correct for "DestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.DestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `DestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.DestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnCacheClusterDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCacheCluster_DestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsDetails: cfnCacheClusterCloudWatchLogsDestinationDetailsPropertyToCloudFormation(properties.cloudWatchLogsDetails),
        KinesisFirehoseDetails: cfnCacheClusterKinesisFirehoseDestinationDetailsPropertyToCloudFormation(properties.kinesisFirehoseDetails),
    };
}

// @ts-ignore TS6133
function CfnCacheClusterDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCacheCluster.DestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCacheCluster.DestinationDetailsProperty>();
    ret.addPropertyResult('cloudWatchLogsDetails', 'CloudWatchLogsDetails', properties.CloudWatchLogsDetails != null ? CfnCacheClusterCloudWatchLogsDestinationDetailsPropertyFromCloudFormation(properties.CloudWatchLogsDetails) : undefined);
    ret.addPropertyResult('kinesisFirehoseDetails', 'KinesisFirehoseDetails', properties.KinesisFirehoseDetails != null ? CfnCacheClusterKinesisFirehoseDestinationDetailsPropertyFromCloudFormation(properties.KinesisFirehoseDetails) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCacheCluster {
    /**
     * The configuration details of the Kinesis Data Firehose destination. Note that this field is marked as required but only if Kinesis Data Firehose was chosen as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-kinesisfirehosedestinationdetails.html
     */
    export interface KinesisFirehoseDestinationDetailsProperty {
        /**
         * The name of the Kinesis Data Firehose delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-kinesisfirehosedestinationdetails.html#cfn-elasticache-cachecluster-kinesisfirehosedestinationdetails-deliverystream
         */
        readonly deliveryStream: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCacheCluster_KinesisFirehoseDestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryStream', cdk.requiredValidator)(properties.deliveryStream));
    errors.collect(cdk.propertyValidator('deliveryStream', cdk.validateString)(properties.deliveryStream));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseDestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.KinesisFirehoseDestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.KinesisFirehoseDestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnCacheClusterKinesisFirehoseDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCacheCluster_KinesisFirehoseDestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        DeliveryStream: cdk.stringToCloudFormation(properties.deliveryStream),
    };
}

// @ts-ignore TS6133
function CfnCacheClusterKinesisFirehoseDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCacheCluster.KinesisFirehoseDestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCacheCluster.KinesisFirehoseDestinationDetailsProperty>();
    ret.addPropertyResult('deliveryStream', 'DeliveryStream', cfn_parse.FromCloudFormation.getString(properties.DeliveryStream));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCacheCluster {
    /**
     * Specifies the destination, format and type of the logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-logdeliveryconfigurationrequest.html
     */
    export interface LogDeliveryConfigurationRequestProperty {
        /**
         * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-logdeliveryconfigurationrequest.html#cfn-elasticache-cachecluster-logdeliveryconfigurationrequest-destinationdetails
         */
        readonly destinationDetails: CfnCacheCluster.DestinationDetailsProperty | cdk.IResolvable;
        /**
         * Specify either CloudWatch Logs or Kinesis Data Firehose as the destination type. Valid values are either `cloudwatch-logs` or `kinesis-firehose` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-logdeliveryconfigurationrequest.html#cfn-elasticache-cachecluster-logdeliveryconfigurationrequest-destinationtype
         */
        readonly destinationType: string;
        /**
         * Valid values are either `json` or `text` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-logdeliveryconfigurationrequest.html#cfn-elasticache-cachecluster-logdeliveryconfigurationrequest-logformat
         */
        readonly logFormat: string;
        /**
         * Valid value is either `slow-log` , which refers to [slow-log](https://docs.aws.amazon.com/https://redis.io/commands/slowlog) or `engine-log` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cachecluster-logdeliveryconfigurationrequest.html#cfn-elasticache-cachecluster-logdeliveryconfigurationrequest-logtype
         */
        readonly logType: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogDeliveryConfigurationRequestProperty`
 *
 * @param properties - the TypeScript properties of a `LogDeliveryConfigurationRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnCacheCluster_LogDeliveryConfigurationRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationDetails', cdk.requiredValidator)(properties.destinationDetails));
    errors.collect(cdk.propertyValidator('destinationDetails', CfnCacheCluster_DestinationDetailsPropertyValidator)(properties.destinationDetails));
    errors.collect(cdk.propertyValidator('destinationType', cdk.requiredValidator)(properties.destinationType));
    errors.collect(cdk.propertyValidator('destinationType', cdk.validateString)(properties.destinationType));
    errors.collect(cdk.propertyValidator('logFormat', cdk.requiredValidator)(properties.logFormat));
    errors.collect(cdk.propertyValidator('logFormat', cdk.validateString)(properties.logFormat));
    errors.collect(cdk.propertyValidator('logType', cdk.requiredValidator)(properties.logType));
    errors.collect(cdk.propertyValidator('logType', cdk.validateString)(properties.logType));
    return errors.wrap('supplied properties not correct for "LogDeliveryConfigurationRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.LogDeliveryConfigurationRequest` resource
 *
 * @param properties - the TypeScript properties of a `LogDeliveryConfigurationRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::CacheCluster.LogDeliveryConfigurationRequest` resource.
 */
// @ts-ignore TS6133
function cfnCacheClusterLogDeliveryConfigurationRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCacheCluster_LogDeliveryConfigurationRequestPropertyValidator(properties).assertSuccess();
    return {
        DestinationDetails: cfnCacheClusterDestinationDetailsPropertyToCloudFormation(properties.destinationDetails),
        DestinationType: cdk.stringToCloudFormation(properties.destinationType),
        LogFormat: cdk.stringToCloudFormation(properties.logFormat),
        LogType: cdk.stringToCloudFormation(properties.logType),
    };
}

// @ts-ignore TS6133
function CfnCacheClusterLogDeliveryConfigurationRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCacheCluster.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCacheCluster.LogDeliveryConfigurationRequestProperty>();
    ret.addPropertyResult('destinationDetails', 'DestinationDetails', CfnCacheClusterDestinationDetailsPropertyFromCloudFormation(properties.DestinationDetails));
    ret.addPropertyResult('destinationType', 'DestinationType', cfn_parse.FromCloudFormation.getString(properties.DestinationType));
    ret.addPropertyResult('logFormat', 'LogFormat', cfn_parse.FromCloudFormation.getString(properties.LogFormat));
    ret.addPropertyResult('logType', 'LogType', cfn_parse.FromCloudFormation.getString(properties.LogType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnGlobalReplicationGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html
 */
export interface CfnGlobalReplicationGroupProps {

    /**
     * The replication groups that comprise the Global datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-members
     */
    readonly members: Array<CfnGlobalReplicationGroup.GlobalReplicationGroupMemberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.
     *
     * `AutomaticFailoverEnabled` must be enabled for Redis (cluster mode enabled) replication groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-automaticfailoverenabled
     */
    readonly automaticFailoverEnabled?: boolean | cdk.IResolvable;

    /**
     * The cache node type of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-cachenodetype
     */
    readonly cacheNodeType?: string;

    /**
     * The name of the cache parameter group to use with the Global datastore. It must be compatible with the major engine version used by the Global datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-cacheparametergroupname
     */
    readonly cacheParameterGroupName?: string;

    /**
     * The Elasticache Redis engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-engineversion
     */
    readonly engineVersion?: string;

    /**
     * The number of node groups that comprise the Global Datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalnodegroupcount
     */
    readonly globalNodeGroupCount?: number;

    /**
     * The optional description of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupdescription
     */
    readonly globalReplicationGroupDescription?: string;

    /**
     * The suffix name of a Global Datastore. The suffix guarantees uniqueness of the Global Datastore name across multiple regions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupidsuffix
     */
    readonly globalReplicationGroupIdSuffix?: string;

    /**
     * The Regions that comprise the Global Datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-regionalconfigurations
     */
    readonly regionalConfigurations?: Array<CfnGlobalReplicationGroup.RegionalConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGlobalReplicationGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGlobalReplicationGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnGlobalReplicationGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automaticFailoverEnabled', cdk.validateBoolean)(properties.automaticFailoverEnabled));
    errors.collect(cdk.propertyValidator('cacheNodeType', cdk.validateString)(properties.cacheNodeType));
    errors.collect(cdk.propertyValidator('cacheParameterGroupName', cdk.validateString)(properties.cacheParameterGroupName));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('globalNodeGroupCount', cdk.validateNumber)(properties.globalNodeGroupCount));
    errors.collect(cdk.propertyValidator('globalReplicationGroupDescription', cdk.validateString)(properties.globalReplicationGroupDescription));
    errors.collect(cdk.propertyValidator('globalReplicationGroupIdSuffix', cdk.validateString)(properties.globalReplicationGroupIdSuffix));
    errors.collect(cdk.propertyValidator('members', cdk.requiredValidator)(properties.members));
    errors.collect(cdk.propertyValidator('members', cdk.listValidator(CfnGlobalReplicationGroup_GlobalReplicationGroupMemberPropertyValidator))(properties.members));
    errors.collect(cdk.propertyValidator('regionalConfigurations', cdk.listValidator(CfnGlobalReplicationGroup_RegionalConfigurationPropertyValidator))(properties.regionalConfigurations));
    return errors.wrap('supplied properties not correct for "CfnGlobalReplicationGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnGlobalReplicationGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup` resource.
 */
// @ts-ignore TS6133
function cfnGlobalReplicationGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalReplicationGroupPropsValidator(properties).assertSuccess();
    return {
        Members: cdk.listMapper(cfnGlobalReplicationGroupGlobalReplicationGroupMemberPropertyToCloudFormation)(properties.members),
        AutomaticFailoverEnabled: cdk.booleanToCloudFormation(properties.automaticFailoverEnabled),
        CacheNodeType: cdk.stringToCloudFormation(properties.cacheNodeType),
        CacheParameterGroupName: cdk.stringToCloudFormation(properties.cacheParameterGroupName),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        GlobalNodeGroupCount: cdk.numberToCloudFormation(properties.globalNodeGroupCount),
        GlobalReplicationGroupDescription: cdk.stringToCloudFormation(properties.globalReplicationGroupDescription),
        GlobalReplicationGroupIdSuffix: cdk.stringToCloudFormation(properties.globalReplicationGroupIdSuffix),
        RegionalConfigurations: cdk.listMapper(cfnGlobalReplicationGroupRegionalConfigurationPropertyToCloudFormation)(properties.regionalConfigurations),
    };
}

// @ts-ignore TS6133
function CfnGlobalReplicationGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalReplicationGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalReplicationGroupProps>();
    ret.addPropertyResult('members', 'Members', cfn_parse.FromCloudFormation.getArray(CfnGlobalReplicationGroupGlobalReplicationGroupMemberPropertyFromCloudFormation)(properties.Members));
    ret.addPropertyResult('automaticFailoverEnabled', 'AutomaticFailoverEnabled', properties.AutomaticFailoverEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutomaticFailoverEnabled) : undefined);
    ret.addPropertyResult('cacheNodeType', 'CacheNodeType', properties.CacheNodeType != null ? cfn_parse.FromCloudFormation.getString(properties.CacheNodeType) : undefined);
    ret.addPropertyResult('cacheParameterGroupName', 'CacheParameterGroupName', properties.CacheParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheParameterGroupName) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('globalNodeGroupCount', 'GlobalNodeGroupCount', properties.GlobalNodeGroupCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.GlobalNodeGroupCount) : undefined);
    ret.addPropertyResult('globalReplicationGroupDescription', 'GlobalReplicationGroupDescription', properties.GlobalReplicationGroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalReplicationGroupDescription) : undefined);
    ret.addPropertyResult('globalReplicationGroupIdSuffix', 'GlobalReplicationGroupIdSuffix', properties.GlobalReplicationGroupIdSuffix != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalReplicationGroupIdSuffix) : undefined);
    ret.addPropertyResult('regionalConfigurations', 'RegionalConfigurations', properties.RegionalConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnGlobalReplicationGroupRegionalConfigurationPropertyFromCloudFormation)(properties.RegionalConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::GlobalReplicationGroup`
 *
 * Consists of a primary cluster that accepts writes and an associated secondary cluster that resides in a different Amazon region. The secondary cluster accepts only reads. The primary cluster automatically replicates updates to the secondary cluster.
 *
 * - The *GlobalReplicationGroupIdSuffix* represents the name of the Global datastore, which is what you use to associate a secondary cluster.
 *
 * @cloudformationResource AWS::ElastiCache::GlobalReplicationGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html
 */
export class CfnGlobalReplicationGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::GlobalReplicationGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGlobalReplicationGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGlobalReplicationGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGlobalReplicationGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID used to associate a secondary cluster to the Global Replication Group.
     * @cloudformationAttribute GlobalReplicationGroupId
     */
    public readonly attrGlobalReplicationGroupId: string;

    /**
     * The status of the Global Datastore. Can be `Creating` , `Modifying` , `Available` , `Deleting` or `Primary-Only` . Primary-only status indicates the global datastore contains only a primary cluster. Either all secondary clusters are deleted or not successfully created.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The replication groups that comprise the Global datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-members
     */
    public members: Array<CfnGlobalReplicationGroup.GlobalReplicationGroupMemberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.
     *
     * `AutomaticFailoverEnabled` must be enabled for Redis (cluster mode enabled) replication groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-automaticfailoverenabled
     */
    public automaticFailoverEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The cache node type of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-cachenodetype
     */
    public cacheNodeType: string | undefined;

    /**
     * The name of the cache parameter group to use with the Global datastore. It must be compatible with the major engine version used by the Global datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-cacheparametergroupname
     */
    public cacheParameterGroupName: string | undefined;

    /**
     * The Elasticache Redis engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * The number of node groups that comprise the Global Datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalnodegroupcount
     */
    public globalNodeGroupCount: number | undefined;

    /**
     * The optional description of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupdescription
     */
    public globalReplicationGroupDescription: string | undefined;

    /**
     * The suffix name of a Global Datastore. The suffix guarantees uniqueness of the Global Datastore name across multiple regions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupidsuffix
     */
    public globalReplicationGroupIdSuffix: string | undefined;

    /**
     * The Regions that comprise the Global Datastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-globalreplicationgroup.html#cfn-elasticache-globalreplicationgroup-regionalconfigurations
     */
    public regionalConfigurations: Array<CfnGlobalReplicationGroup.RegionalConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ElastiCache::GlobalReplicationGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGlobalReplicationGroupProps) {
        super(scope, id, { type: CfnGlobalReplicationGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'members', this);
        this.attrGlobalReplicationGroupId = cdk.Token.asString(this.getAtt('GlobalReplicationGroupId', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.members = props.members;
        this.automaticFailoverEnabled = props.automaticFailoverEnabled;
        this.cacheNodeType = props.cacheNodeType;
        this.cacheParameterGroupName = props.cacheParameterGroupName;
        this.engineVersion = props.engineVersion;
        this.globalNodeGroupCount = props.globalNodeGroupCount;
        this.globalReplicationGroupDescription = props.globalReplicationGroupDescription;
        this.globalReplicationGroupIdSuffix = props.globalReplicationGroupIdSuffix;
        this.regionalConfigurations = props.regionalConfigurations;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGlobalReplicationGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            members: this.members,
            automaticFailoverEnabled: this.automaticFailoverEnabled,
            cacheNodeType: this.cacheNodeType,
            cacheParameterGroupName: this.cacheParameterGroupName,
            engineVersion: this.engineVersion,
            globalNodeGroupCount: this.globalNodeGroupCount,
            globalReplicationGroupDescription: this.globalReplicationGroupDescription,
            globalReplicationGroupIdSuffix: this.globalReplicationGroupIdSuffix,
            regionalConfigurations: this.regionalConfigurations,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGlobalReplicationGroupPropsToCloudFormation(props);
    }
}

export namespace CfnGlobalReplicationGroup {
    /**
     * A member of a Global datastore. It contains the Replication Group Id, the Amazon region and the role of the replication group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-globalreplicationgroupmember.html
     */
    export interface GlobalReplicationGroupMemberProperty {
        /**
         * The replication group id of the Global datastore member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-globalreplicationgroupmember.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupmember-replicationgroupid
         */
        readonly replicationGroupId?: string;
        /**
         * The Amazon region of the Global datastore member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-globalreplicationgroupmember.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupmember-replicationgroupregion
         */
        readonly replicationGroupRegion?: string;
        /**
         * Indicates the role of the replication group, `PRIMARY` or `SECONDARY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-globalreplicationgroupmember.html#cfn-elasticache-globalreplicationgroup-globalreplicationgroupmember-role
         */
        readonly role?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GlobalReplicationGroupMemberProperty`
 *
 * @param properties - the TypeScript properties of a `GlobalReplicationGroupMemberProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalReplicationGroup_GlobalReplicationGroupMemberPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicationGroupId', cdk.validateString)(properties.replicationGroupId));
    errors.collect(cdk.propertyValidator('replicationGroupRegion', cdk.validateString)(properties.replicationGroupRegion));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    return errors.wrap('supplied properties not correct for "GlobalReplicationGroupMemberProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.GlobalReplicationGroupMember` resource
 *
 * @param properties - the TypeScript properties of a `GlobalReplicationGroupMemberProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.GlobalReplicationGroupMember` resource.
 */
// @ts-ignore TS6133
function cfnGlobalReplicationGroupGlobalReplicationGroupMemberPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalReplicationGroup_GlobalReplicationGroupMemberPropertyValidator(properties).assertSuccess();
    return {
        ReplicationGroupId: cdk.stringToCloudFormation(properties.replicationGroupId),
        ReplicationGroupRegion: cdk.stringToCloudFormation(properties.replicationGroupRegion),
        Role: cdk.stringToCloudFormation(properties.role),
    };
}

// @ts-ignore TS6133
function CfnGlobalReplicationGroupGlobalReplicationGroupMemberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalReplicationGroup.GlobalReplicationGroupMemberProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalReplicationGroup.GlobalReplicationGroupMemberProperty>();
    ret.addPropertyResult('replicationGroupId', 'ReplicationGroupId', properties.ReplicationGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupId) : undefined);
    ret.addPropertyResult('replicationGroupRegion', 'ReplicationGroupRegion', properties.ReplicationGroupRegion != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupRegion) : undefined);
    ret.addPropertyResult('role', 'Role', properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalReplicationGroup {
    /**
     * A list of the replication groups
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-regionalconfiguration.html
     */
    export interface RegionalConfigurationProperty {
        /**
         * The name of the secondary cluster
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-regionalconfiguration.html#cfn-elasticache-globalreplicationgroup-regionalconfiguration-replicationgroupid
         */
        readonly replicationGroupId?: string;
        /**
         * The Amazon region where the cluster is stored
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-regionalconfiguration.html#cfn-elasticache-globalreplicationgroup-regionalconfiguration-replicationgroupregion
         */
        readonly replicationGroupRegion?: string;
        /**
         * A list of PreferredAvailabilityZones objects that specifies the configuration of a node group in the resharded cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-regionalconfiguration.html#cfn-elasticache-globalreplicationgroup-regionalconfiguration-reshardingconfigurations
         */
        readonly reshardingConfigurations?: Array<CfnGlobalReplicationGroup.ReshardingConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RegionalConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RegionalConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalReplicationGroup_RegionalConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicationGroupId', cdk.validateString)(properties.replicationGroupId));
    errors.collect(cdk.propertyValidator('replicationGroupRegion', cdk.validateString)(properties.replicationGroupRegion));
    errors.collect(cdk.propertyValidator('reshardingConfigurations', cdk.listValidator(CfnGlobalReplicationGroup_ReshardingConfigurationPropertyValidator))(properties.reshardingConfigurations));
    return errors.wrap('supplied properties not correct for "RegionalConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.RegionalConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RegionalConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.RegionalConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnGlobalReplicationGroupRegionalConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalReplicationGroup_RegionalConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ReplicationGroupId: cdk.stringToCloudFormation(properties.replicationGroupId),
        ReplicationGroupRegion: cdk.stringToCloudFormation(properties.replicationGroupRegion),
        ReshardingConfigurations: cdk.listMapper(cfnGlobalReplicationGroupReshardingConfigurationPropertyToCloudFormation)(properties.reshardingConfigurations),
    };
}

// @ts-ignore TS6133
function CfnGlobalReplicationGroupRegionalConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalReplicationGroup.RegionalConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalReplicationGroup.RegionalConfigurationProperty>();
    ret.addPropertyResult('replicationGroupId', 'ReplicationGroupId', properties.ReplicationGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupId) : undefined);
    ret.addPropertyResult('replicationGroupRegion', 'ReplicationGroupRegion', properties.ReplicationGroupRegion != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupRegion) : undefined);
    ret.addPropertyResult('reshardingConfigurations', 'ReshardingConfigurations', properties.ReshardingConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnGlobalReplicationGroupReshardingConfigurationPropertyFromCloudFormation)(properties.ReshardingConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalReplicationGroup {
    /**
     * A list of `PreferredAvailabilityZones` objects that specifies the configuration of a node group in the resharded cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-reshardingconfiguration.html
     */
    export interface ReshardingConfigurationProperty {
        /**
         * Either the ElastiCache for Redis supplied 4-digit id or a user supplied id for the node group these configuration values apply to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-reshardingconfiguration.html#cfn-elasticache-globalreplicationgroup-reshardingconfiguration-nodegroupid
         */
        readonly nodeGroupId?: string;
        /**
         * A list of preferred availability zones for the nodes in this cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-globalreplicationgroup-reshardingconfiguration.html#cfn-elasticache-globalreplicationgroup-reshardingconfiguration-preferredavailabilityzones
         */
        readonly preferredAvailabilityZones?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ReshardingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReshardingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalReplicationGroup_ReshardingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nodeGroupId', cdk.validateString)(properties.nodeGroupId));
    errors.collect(cdk.propertyValidator('preferredAvailabilityZones', cdk.listValidator(cdk.validateString))(properties.preferredAvailabilityZones));
    return errors.wrap('supplied properties not correct for "ReshardingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.ReshardingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ReshardingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::GlobalReplicationGroup.ReshardingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnGlobalReplicationGroupReshardingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalReplicationGroup_ReshardingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        NodeGroupId: cdk.stringToCloudFormation(properties.nodeGroupId),
        PreferredAvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.preferredAvailabilityZones),
    };
}

// @ts-ignore TS6133
function CfnGlobalReplicationGroupReshardingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalReplicationGroup.ReshardingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalReplicationGroup.ReshardingConfigurationProperty>();
    ret.addPropertyResult('nodeGroupId', 'NodeGroupId', properties.NodeGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.NodeGroupId) : undefined);
    ret.addPropertyResult('preferredAvailabilityZones', 'PreferredAvailabilityZones', properties.PreferredAvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PreferredAvailabilityZones) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnParameterGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html
 */
export interface CfnParameterGroupProps {

    /**
     * The name of the cache parameter group family that this cache parameter group is compatible with.
     *
     * Valid values are: `memcached1.4` | `memcached1.5` | `memcached1.6` | `redis2.6` | `redis2.8` | `redis3.2` | `redis4.0` | `redis5.0` | `redis6.x` | `redis7`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-cacheparametergroupfamily
     */
    readonly cacheParameterGroupFamily: string;

    /**
     * The description for this cache parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-description
     */
    readonly description: string;

    /**
     * A comma-delimited list of parameter name/value pairs. For more information, see [ModifyCacheParameterGroup](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_ModifyCacheParameterGroup.html) in the *Amazon ElastiCache API Reference Guide* .
     *
     * For example:
     *
     * ```
     * "Properties" : { "cas_disabled" : "1", "chunk_size_growth_factor" : "1.02"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-properties
     */
    readonly properties?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * A tag that can be added to an ElastiCache parameter group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your parameter groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnParameterGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cacheParameterGroupFamily', cdk.requiredValidator)(properties.cacheParameterGroupFamily));
    errors.collect(cdk.propertyValidator('cacheParameterGroupFamily', cdk.validateString)(properties.cacheParameterGroupFamily));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('properties', cdk.hashValidator(cdk.validateString))(properties.properties));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnParameterGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ParameterGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnParameterGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ParameterGroup` resource.
 */
// @ts-ignore TS6133
function cfnParameterGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnParameterGroupPropsValidator(properties).assertSuccess();
    return {
        CacheParameterGroupFamily: cdk.stringToCloudFormation(properties.cacheParameterGroupFamily),
        Description: cdk.stringToCloudFormation(properties.description),
        Properties: cdk.hashMapper(cdk.stringToCloudFormation)(properties.properties),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnParameterGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnParameterGroupProps>();
    ret.addPropertyResult('cacheParameterGroupFamily', 'CacheParameterGroupFamily', cfn_parse.FromCloudFormation.getString(properties.CacheParameterGroupFamily));
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('properties', 'Properties', properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Properties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::ParameterGroup`
 *
 * The `AWS::ElastiCache::ParameterGroup` type creates a new cache parameter group. Cache parameter groups control the parameters for a cache cluster.
 *
 * @cloudformationResource AWS::ElastiCache::ParameterGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html
 */
export class CfnParameterGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::ParameterGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnParameterGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnParameterGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnParameterGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the cache parameter group family that this cache parameter group is compatible with.
     *
     * Valid values are: `memcached1.4` | `memcached1.5` | `memcached1.6` | `redis2.6` | `redis2.8` | `redis3.2` | `redis4.0` | `redis5.0` | `redis6.x` | `redis7`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-cacheparametergroupfamily
     */
    public cacheParameterGroupFamily: string;

    /**
     * The description for this cache parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-description
     */
    public description: string;

    /**
     * A comma-delimited list of parameter name/value pairs. For more information, see [ModifyCacheParameterGroup](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_ModifyCacheParameterGroup.html) in the *Amazon ElastiCache API Reference Guide* .
     *
     * For example:
     *
     * ```
     * "Properties" : { "cas_disabled" : "1", "chunk_size_growth_factor" : "1.02"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-properties
     */
    public properties: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * A tag that can be added to an ElastiCache parameter group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your parameter groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-parameter-group.html#cfn-elasticache-parametergroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ElastiCache::ParameterGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnParameterGroupProps) {
        super(scope, id, { type: CfnParameterGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'cacheParameterGroupFamily', this);
        cdk.requireProperty(props, 'description', this);

        this.cacheParameterGroupFamily = props.cacheParameterGroupFamily;
        this.description = props.description;
        this.properties = props.properties;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElastiCache::ParameterGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnParameterGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cacheParameterGroupFamily: this.cacheParameterGroupFamily,
            description: this.description,
            properties: this.properties,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnParameterGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReplicationGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html
 */
export interface CfnReplicationGroupProps {

    /**
     * A user-created description for the replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicationgroupdescription
     */
    readonly replicationGroupDescription: string;

    /**
     * A flag that enables encryption at rest when set to `true` .
     *
     * You cannot modify the value of `AtRestEncryptionEnabled` after the replication group is created. To enable encryption at rest on a replication group you must set `AtRestEncryptionEnabled` to `true` when you create the replication group.
     *
     * *Required:* Only available when creating a replication group in an Amazon VPC using redis version `3.2.6` or `4.x` onward.
     *
     * Default: `false`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-atrestencryptionenabled
     */
    readonly atRestEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * *Reserved parameter.* The password used to access a password protected server.
     *
     * `AuthToken` can be specified only on replication groups where `TransitEncryptionEnabled` is `true` . For more information, see [Authenticating Users with the Redis AUTH Command](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth.html) .
     *
     * > For HIPAA compliance, you must specify `TransitEncryptionEnabled` as `true` , an `AuthToken` , and a `CacheSubnetGroup` .
     *
     * Password constraints:
     *
     * - Must be only printable ASCII characters.
     * - Must be at least 16 characters and no more than 128 characters in length.
     * - Nonalphanumeric characters are restricted to (!, &, #, $, ^, <, >, -, ).
     *
     * For more information, see [AUTH password](https://docs.aws.amazon.com/http://redis.io/commands/AUTH) at http://redis.io/commands/AUTH.
     *
     * > If ADDING the AuthToken, update requires [Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-authtoken
     */
    readonly authToken?: string;

    /**
     * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.
     *
     * `AutomaticFailoverEnabled` must be enabled for Redis (cluster mode enabled) replication groups.
     *
     * Default: false
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-automaticfailoverenabled
     */
    readonly automaticFailoverEnabled?: boolean | cdk.IResolvable;

    /**
     * If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next minor version upgrade campaign. This parameter is disabled for previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-autominorversionupgrade
     */
    readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

    /**
     * The compute and memory capacity of the nodes in the node group (shard).
     *
     * The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.
     *
     * - General purpose:
     *
     * - Current generation:
     *
     * *M6g node types:* `cache.m6g.large` , `cache.m6g.xlarge` , `cache.m6g.2xlarge` , `cache.m6g.4xlarge` , `cache.m6g.12xlarge` , `cache.m6g.24xlarge`
     *
     * *M5 node types:* `cache.m5.large` , `cache.m5.xlarge` , `cache.m5.2xlarge` , `cache.m5.4xlarge` , `cache.m5.12xlarge` , `cache.m5.24xlarge`
     *
     * *M4 node types:* `cache.m4.large` , `cache.m4.xlarge` , `cache.m4.2xlarge` , `cache.m4.4xlarge` , `cache.m4.10xlarge`
     *
     * *T4g node types:* `cache.t4g.micro` , `cache.t4g.small` , `cache.t4g.medium`
     *
     * *T3 node types:* `cache.t3.micro` , `cache.t3.small` , `cache.t3.medium`
     *
     * *T2 node types:* `cache.t2.micro` , `cache.t2.small` , `cache.t2.medium`
     * - Previous generation: (not recommended)
     *
     * *T1 node types:* `cache.t1.micro`
     *
     * *M1 node types:* `cache.m1.small` , `cache.m1.medium` , `cache.m1.large` , `cache.m1.xlarge`
     *
     * *M3 node types:* `cache.m3.medium` , `cache.m3.large` , `cache.m3.xlarge` , `cache.m3.2xlarge`
     * - Compute optimized:
     *
     * - Previous generation: (not recommended)
     *
     * *C1 node types:* `cache.c1.xlarge`
     * - Memory optimized:
     *
     * - Current generation:
     *
     * *R6gd node types:* `cache.r6gd.xlarge` , `cache.r6gd.2xlarge` , `cache.r6gd.4xlarge` , `cache.r6gd.8xlarge` , `cache.r6gd.12xlarge` , `cache.r6gd.16xlarge`
     *
     * > The `r6gd` family is available in the following regions: `us-east-2` , `us-east-1` , `us-west-2` , `us-west-1` , `eu-west-1` , `eu-central-1` , `ap-northeast-1` , `ap-southeast-1` , `ap-southeast-2` .
     *
     * *R6g node types:* `cache.r6g.large` , `cache.r6g.xlarge` , `cache.r6g.2xlarge` , `cache.r6g.4xlarge` , `cache.r6g.12xlarge` , `cache.r6g.24xlarge`
     *
     * *R5 node types:* `cache.r5.large` , `cache.r5.xlarge` , `cache.r5.2xlarge` , `cache.r5.4xlarge` , `cache.r5.12xlarge` , `cache.r5.24xlarge`
     *
     * *R4 node types:* `cache.r4.large` , `cache.r4.xlarge` , `cache.r4.2xlarge` , `cache.r4.4xlarge` , `cache.r4.8xlarge` , `cache.r4.16xlarge`
     * - Previous generation: (not recommended)
     *
     * *M2 node types:* `cache.m2.xlarge` , `cache.m2.2xlarge` , `cache.m2.4xlarge`
     *
     * *R3 node types:* `cache.r3.large` , `cache.r3.xlarge` , `cache.r3.2xlarge` , `cache.r3.4xlarge` , `cache.r3.8xlarge`
     *
     * For region availability, see [Supported Node Types by Amazon Region](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html#CacheNodes.SupportedTypesByRegion)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachenodetype
     */
    readonly cacheNodeType?: string;

    /**
     * The name of the parameter group to associate with this replication group. If this argument is omitted, the default cache parameter group for the specified engine is used.
     *
     * If you are running Redis version 3.2.4 or later, only one node group (shard), and want to use a default parameter group, we recommend that you specify the parameter group by name.
     *
     * - To create a Redis (cluster mode disabled) replication group, use `CacheParameterGroupName=default.redis3.2` .
     * - To create a Redis (cluster mode enabled) replication group, use `CacheParameterGroupName=default.redis3.2.cluster.on` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cacheparametergroupname
     */
    readonly cacheParameterGroupName?: string;

    /**
     * A list of cache security group names to associate with this replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachesecuritygroupnames
     */
    readonly cacheSecurityGroupNames?: string[];

    /**
     * The name of the cache subnet group to be used for the replication group.
     *
     * > If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see [AWS::ElastiCache::SubnetGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-subnetgroup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachesubnetgroupname
     */
    readonly cacheSubnetGroupName?: string;

    /**
     * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see [Data tiering](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/data-tiering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-datatieringenabled
     */
    readonly dataTieringEnabled?: boolean | cdk.IResolvable;

    /**
     * The name of the cache engine to be used for the clusters in this replication group. The value must be set to `Redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-engine
     */
    readonly engine?: string;

    /**
     * The version number of the cache engine to be used for the clusters in this replication group. To view the supported cache engine versions, use the `DescribeCacheEngineVersions` operation.
     *
     * *Important:* You can upgrade to a newer engine version (see [Selecting a Cache Engine and Version](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SelectEngine.html#VersionManagement) ) in the *ElastiCache User Guide* , but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-engineversion
     */
    readonly engineVersion?: string;

    /**
     * The name of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-globalreplicationgroupid
     */
    readonly globalReplicationGroupId?: string;

    /**
     * The network type you choose when creating a replication group, either `ipv4` | `ipv6` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-ipdiscovery
     */
    readonly ipDiscovery?: string;

    /**
     * The ID of the KMS key used to encrypt the disk on the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Specifies the destination, format and type of the logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-logdeliveryconfigurations
     */
    readonly logDeliveryConfigurations?: Array<CfnReplicationGroup.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A flag indicating if you have Multi-AZ enabled to enhance fault tolerance. For more information, see [Minimizing Downtime: Multi-AZ](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/AutoFailover.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-multiazenabled
     */
    readonly multiAzEnabled?: boolean | cdk.IResolvable;

    /**
     * Must be either `ipv4` | `ipv6` | `dual_stack` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-networktype
     */
    readonly networkType?: string;

    /**
     * `NodeGroupConfiguration` is a property of the `AWS::ElastiCache::ReplicationGroup` resource that configures an Amazon ElastiCache (ElastiCache) Redis cluster node group.
     *
     * If you set [UseOnlineResharding](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-useonlineresharding) to `true` , you can update `NodeGroupConfiguration` without interruption. When `UseOnlineResharding` is set to `false` , or is not specified, updating `NodeGroupConfiguration` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-nodegroupconfiguration
     */
    readonly nodeGroupConfiguration?: Array<CfnReplicationGroup.NodeGroupConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.
     *
     * > The Amazon SNS topic owner must be the same as the cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-notificationtopicarn
     */
    readonly notificationTopicArn?: string;

    /**
     * The number of clusters this replication group initially has.
     *
     * This parameter is not used if there is more than one node group (shard). You should use `ReplicasPerNodeGroup` instead.
     *
     * If `AutomaticFailoverEnabled` is `true` , the value of this parameter must be at least 2. If `AutomaticFailoverEnabled` is `false` you can omit this parameter (it will default to 1), or you can explicitly set it to a value between 2 and 6.
     *
     * The maximum permitted value for `NumCacheClusters` is 6 (1 primary plus 5 replicas).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-numcacheclusters
     */
    readonly numCacheClusters?: number;

    /**
     * An optional parameter that specifies the number of node groups (shards) for this Redis (cluster mode enabled) replication group. For Redis (cluster mode disabled) either omit this parameter or set it to 1.
     *
     * If you set [UseOnlineResharding](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-useonlineresharding) to `true` , you can update `NumNodeGroups` without interruption. When `UseOnlineResharding` is set to `false` , or is not specified, updating `NumNodeGroups` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * Default: 1
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-numnodegroups
     */
    readonly numNodeGroups?: number;

    /**
     * The port number on which each member of the replication group accepts connections.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-port
     */
    readonly port?: number;

    /**
     * A list of EC2 Availability Zones in which the replication group's clusters are created. The order of the Availability Zones in the list is the order in which clusters are allocated. The primary cluster is created in the first AZ in the list.
     *
     * This parameter is not used if there is more than one node group (shard). You should use `NodeGroupConfiguration` instead.
     *
     * > If you are creating your replication group in an Amazon VPC (recommended), you can only locate clusters in Availability Zones associated with the subnets in the selected subnet group.
     * >
     * > The number of Availability Zones listed must equal the value of `NumCacheClusters` .
     *
     * Default: system chosen Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-preferredcacheclusterazs
     */
    readonly preferredCacheClusterAZs?: string[];

    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period.
     *
     * Valid values for `ddd` are:
     *
     * - `sun`
     * - `mon`
     * - `tue`
     * - `wed`
     * - `thu`
     * - `fri`
     * - `sat`
     *
     * Example: `sun:23:00-mon:01:30`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * The identifier of the cluster that serves as the primary for this replication group. This cluster must already exist and have a status of `available` .
     *
     * This parameter is not required if `NumCacheClusters` , `NumNodeGroups` , or `ReplicasPerNodeGroup` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-primaryclusterid
     */
    readonly primaryClusterId?: string;

    /**
     * An optional parameter that specifies the number of replica nodes in each node group (shard). Valid values are 0 to 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicaspernodegroup
     */
    readonly replicasPerNodeGroup?: number;

    /**
     * The replication group identifier. This parameter is stored as a lowercase string.
     *
     * Constraints:
     *
     * - A name must contain from 1 to 40 alphanumeric characters or hyphens.
     * - The first character must be a letter.
     * - A name cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicationgroupid
     */
    readonly replicationGroupId?: string;

    /**
     * One or more Amazon VPC security groups associated with this replication group.
     *
     * Use this parameter only when you are creating a replication group in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * A list of Amazon Resource Names (ARN) that uniquely identify the Redis RDB snapshot files stored in Amazon S3. The snapshot files are used to populate the new replication group. The Amazon S3 object name in the ARN cannot contain any commas. The new replication group will have the number of node groups (console: shards) specified by the parameter *NumNodeGroups* or the number of node groups configured by *NodeGroupConfiguration* regardless of the number of ARNs specified here.
     *
     * Example of an Amazon S3 ARN: `arn:aws:s3:::my_bucket/snapshot1.rdb`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotarns
     */
    readonly snapshotArns?: string[];

    /**
     * The name of a snapshot from which to restore data into the new replication group. The snapshot status changes to `restoring` while the new replication group is being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotname
     */
    readonly snapshotName?: string;

    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set `SnapshotRetentionLimit` to 5, a snapshot that was taken today is retained for 5 days before being deleted.
     *
     * Default: 0 (i.e., automatic backups are disabled for this cluster).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotretentionlimit
     */
    readonly snapshotRetentionLimit?: number;

    /**
     * The cluster ID that is used as the daily snapshot source for the replication group. This parameter cannot be set for Redis (cluster mode enabled) replication groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshottingclusterid
     */
    readonly snapshottingClusterId?: string;

    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard).
     *
     * Example: `05:00-09:00`
     *
     * If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotwindow
     */
    readonly snapshotWindow?: string;

    /**
     * A list of tags to be added to this resource. Tags are comma-separated key,value pairs (e.g. Key= `myKey` , Value= `myKeyValue` . You can include multiple tags as shown following: Key= `myKey` , Value= `myKeyValue` Key= `mySecondKey` , Value= `mySecondKeyValue` . Tags on replication groups will be replicated to all nodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A flag that enables in-transit encryption when set to `true` .
     *
     * You cannot modify the value of `TransitEncryptionEnabled` after the cluster is created. To enable in-transit encryption on a cluster you must set `TransitEncryptionEnabled` to `true` when you create a cluster.
     *
     * This parameter is valid only if the `Engine` parameter is `redis` , the `EngineVersion` parameter is `3.2.6` or `4.x` onward, and the cluster is being created in an Amazon VPC.
     *
     * If you enable in-transit encryption, you must also specify a value for `CacheSubnetGroup` .
     *
     * *Required:* Only available when creating a replication group in an Amazon VPC using redis version `3.2.6` or `4.x` onward.
     *
     * Default: `false`
     *
     * > For HIPAA compliance, you must specify `TransitEncryptionEnabled` as `true` , an `AuthToken` , and a `CacheSubnetGroup` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-transitencryptionenabled
     */
    readonly transitEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * The ID of user group to associate with the replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-usergroupids
     */
    readonly userGroupIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnReplicationGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('atRestEncryptionEnabled', cdk.validateBoolean)(properties.atRestEncryptionEnabled));
    errors.collect(cdk.propertyValidator('authToken', cdk.validateString)(properties.authToken));
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('automaticFailoverEnabled', cdk.validateBoolean)(properties.automaticFailoverEnabled));
    errors.collect(cdk.propertyValidator('cacheNodeType', cdk.validateString)(properties.cacheNodeType));
    errors.collect(cdk.propertyValidator('cacheParameterGroupName', cdk.validateString)(properties.cacheParameterGroupName));
    errors.collect(cdk.propertyValidator('cacheSecurityGroupNames', cdk.listValidator(cdk.validateString))(properties.cacheSecurityGroupNames));
    errors.collect(cdk.propertyValidator('cacheSubnetGroupName', cdk.validateString)(properties.cacheSubnetGroupName));
    errors.collect(cdk.propertyValidator('dataTieringEnabled', cdk.validateBoolean)(properties.dataTieringEnabled));
    errors.collect(cdk.propertyValidator('engine', cdk.validateString)(properties.engine));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('globalReplicationGroupId', cdk.validateString)(properties.globalReplicationGroupId));
    errors.collect(cdk.propertyValidator('ipDiscovery', cdk.validateString)(properties.ipDiscovery));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('logDeliveryConfigurations', cdk.listValidator(CfnReplicationGroup_LogDeliveryConfigurationRequestPropertyValidator))(properties.logDeliveryConfigurations));
    errors.collect(cdk.propertyValidator('multiAzEnabled', cdk.validateBoolean)(properties.multiAzEnabled));
    errors.collect(cdk.propertyValidator('networkType', cdk.validateString)(properties.networkType));
    errors.collect(cdk.propertyValidator('nodeGroupConfiguration', cdk.listValidator(CfnReplicationGroup_NodeGroupConfigurationPropertyValidator))(properties.nodeGroupConfiguration));
    errors.collect(cdk.propertyValidator('notificationTopicArn', cdk.validateString)(properties.notificationTopicArn));
    errors.collect(cdk.propertyValidator('numCacheClusters', cdk.validateNumber)(properties.numCacheClusters));
    errors.collect(cdk.propertyValidator('numNodeGroups', cdk.validateNumber)(properties.numNodeGroups));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('preferredCacheClusterAZs', cdk.listValidator(cdk.validateString))(properties.preferredCacheClusterAZs));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('primaryClusterId', cdk.validateString)(properties.primaryClusterId));
    errors.collect(cdk.propertyValidator('replicasPerNodeGroup', cdk.validateNumber)(properties.replicasPerNodeGroup));
    errors.collect(cdk.propertyValidator('replicationGroupDescription', cdk.requiredValidator)(properties.replicationGroupDescription));
    errors.collect(cdk.propertyValidator('replicationGroupDescription', cdk.validateString)(properties.replicationGroupDescription));
    errors.collect(cdk.propertyValidator('replicationGroupId', cdk.validateString)(properties.replicationGroupId));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('snapshotArns', cdk.listValidator(cdk.validateString))(properties.snapshotArns));
    errors.collect(cdk.propertyValidator('snapshotName', cdk.validateString)(properties.snapshotName));
    errors.collect(cdk.propertyValidator('snapshotRetentionLimit', cdk.validateNumber)(properties.snapshotRetentionLimit));
    errors.collect(cdk.propertyValidator('snapshotWindow', cdk.validateString)(properties.snapshotWindow));
    errors.collect(cdk.propertyValidator('snapshottingClusterId', cdk.validateString)(properties.snapshottingClusterId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('transitEncryptionEnabled', cdk.validateBoolean)(properties.transitEncryptionEnabled));
    errors.collect(cdk.propertyValidator('userGroupIds', cdk.listValidator(cdk.validateString))(properties.userGroupIds));
    return errors.wrap('supplied properties not correct for "CfnReplicationGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroupPropsValidator(properties).assertSuccess();
    return {
        ReplicationGroupDescription: cdk.stringToCloudFormation(properties.replicationGroupDescription),
        AtRestEncryptionEnabled: cdk.booleanToCloudFormation(properties.atRestEncryptionEnabled),
        AuthToken: cdk.stringToCloudFormation(properties.authToken),
        AutomaticFailoverEnabled: cdk.booleanToCloudFormation(properties.automaticFailoverEnabled),
        AutoMinorVersionUpgrade: cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
        CacheNodeType: cdk.stringToCloudFormation(properties.cacheNodeType),
        CacheParameterGroupName: cdk.stringToCloudFormation(properties.cacheParameterGroupName),
        CacheSecurityGroupNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.cacheSecurityGroupNames),
        CacheSubnetGroupName: cdk.stringToCloudFormation(properties.cacheSubnetGroupName),
        DataTieringEnabled: cdk.booleanToCloudFormation(properties.dataTieringEnabled),
        Engine: cdk.stringToCloudFormation(properties.engine),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        GlobalReplicationGroupId: cdk.stringToCloudFormation(properties.globalReplicationGroupId),
        IpDiscovery: cdk.stringToCloudFormation(properties.ipDiscovery),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LogDeliveryConfigurations: cdk.listMapper(cfnReplicationGroupLogDeliveryConfigurationRequestPropertyToCloudFormation)(properties.logDeliveryConfigurations),
        MultiAZEnabled: cdk.booleanToCloudFormation(properties.multiAzEnabled),
        NetworkType: cdk.stringToCloudFormation(properties.networkType),
        NodeGroupConfiguration: cdk.listMapper(cfnReplicationGroupNodeGroupConfigurationPropertyToCloudFormation)(properties.nodeGroupConfiguration),
        NotificationTopicArn: cdk.stringToCloudFormation(properties.notificationTopicArn),
        NumCacheClusters: cdk.numberToCloudFormation(properties.numCacheClusters),
        NumNodeGroups: cdk.numberToCloudFormation(properties.numNodeGroups),
        Port: cdk.numberToCloudFormation(properties.port),
        PreferredCacheClusterAZs: cdk.listMapper(cdk.stringToCloudFormation)(properties.preferredCacheClusterAZs),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        PrimaryClusterId: cdk.stringToCloudFormation(properties.primaryClusterId),
        ReplicasPerNodeGroup: cdk.numberToCloudFormation(properties.replicasPerNodeGroup),
        ReplicationGroupId: cdk.stringToCloudFormation(properties.replicationGroupId),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SnapshotArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.snapshotArns),
        SnapshotName: cdk.stringToCloudFormation(properties.snapshotName),
        SnapshotRetentionLimit: cdk.numberToCloudFormation(properties.snapshotRetentionLimit),
        SnapshottingClusterId: cdk.stringToCloudFormation(properties.snapshottingClusterId),
        SnapshotWindow: cdk.stringToCloudFormation(properties.snapshotWindow),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TransitEncryptionEnabled: cdk.booleanToCloudFormation(properties.transitEncryptionEnabled),
        UserGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.userGroupIds),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroupProps>();
    ret.addPropertyResult('replicationGroupDescription', 'ReplicationGroupDescription', cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupDescription));
    ret.addPropertyResult('atRestEncryptionEnabled', 'AtRestEncryptionEnabled', properties.AtRestEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AtRestEncryptionEnabled) : undefined);
    ret.addPropertyResult('authToken', 'AuthToken', properties.AuthToken != null ? cfn_parse.FromCloudFormation.getString(properties.AuthToken) : undefined);
    ret.addPropertyResult('automaticFailoverEnabled', 'AutomaticFailoverEnabled', properties.AutomaticFailoverEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutomaticFailoverEnabled) : undefined);
    ret.addPropertyResult('autoMinorVersionUpgrade', 'AutoMinorVersionUpgrade', properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined);
    ret.addPropertyResult('cacheNodeType', 'CacheNodeType', properties.CacheNodeType != null ? cfn_parse.FromCloudFormation.getString(properties.CacheNodeType) : undefined);
    ret.addPropertyResult('cacheParameterGroupName', 'CacheParameterGroupName', properties.CacheParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheParameterGroupName) : undefined);
    ret.addPropertyResult('cacheSecurityGroupNames', 'CacheSecurityGroupNames', properties.CacheSecurityGroupNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CacheSecurityGroupNames) : undefined);
    ret.addPropertyResult('cacheSubnetGroupName', 'CacheSubnetGroupName', properties.CacheSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheSubnetGroupName) : undefined);
    ret.addPropertyResult('dataTieringEnabled', 'DataTieringEnabled', properties.DataTieringEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTieringEnabled) : undefined);
    ret.addPropertyResult('engine', 'Engine', properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('globalReplicationGroupId', 'GlobalReplicationGroupId', properties.GlobalReplicationGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalReplicationGroupId) : undefined);
    ret.addPropertyResult('ipDiscovery', 'IpDiscovery', properties.IpDiscovery != null ? cfn_parse.FromCloudFormation.getString(properties.IpDiscovery) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('logDeliveryConfigurations', 'LogDeliveryConfigurations', properties.LogDeliveryConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationGroupLogDeliveryConfigurationRequestPropertyFromCloudFormation)(properties.LogDeliveryConfigurations) : undefined);
    ret.addPropertyResult('multiAzEnabled', 'MultiAZEnabled', properties.MultiAZEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiAZEnabled) : undefined);
    ret.addPropertyResult('networkType', 'NetworkType', properties.NetworkType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkType) : undefined);
    ret.addPropertyResult('nodeGroupConfiguration', 'NodeGroupConfiguration', properties.NodeGroupConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationGroupNodeGroupConfigurationPropertyFromCloudFormation)(properties.NodeGroupConfiguration) : undefined);
    ret.addPropertyResult('notificationTopicArn', 'NotificationTopicArn', properties.NotificationTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTopicArn) : undefined);
    ret.addPropertyResult('numCacheClusters', 'NumCacheClusters', properties.NumCacheClusters != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumCacheClusters) : undefined);
    ret.addPropertyResult('numNodeGroups', 'NumNodeGroups', properties.NumNodeGroups != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumNodeGroups) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('preferredCacheClusterAZs', 'PreferredCacheClusterAZs', properties.PreferredCacheClusterAZs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PreferredCacheClusterAZs) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('primaryClusterId', 'PrimaryClusterId', properties.PrimaryClusterId != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryClusterId) : undefined);
    ret.addPropertyResult('replicasPerNodeGroup', 'ReplicasPerNodeGroup', properties.ReplicasPerNodeGroup != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicasPerNodeGroup) : undefined);
    ret.addPropertyResult('replicationGroupId', 'ReplicationGroupId', properties.ReplicationGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationGroupId) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('snapshotArns', 'SnapshotArns', properties.SnapshotArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SnapshotArns) : undefined);
    ret.addPropertyResult('snapshotName', 'SnapshotName', properties.SnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotName) : undefined);
    ret.addPropertyResult('snapshotRetentionLimit', 'SnapshotRetentionLimit', properties.SnapshotRetentionLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.SnapshotRetentionLimit) : undefined);
    ret.addPropertyResult('snapshottingClusterId', 'SnapshottingClusterId', properties.SnapshottingClusterId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshottingClusterId) : undefined);
    ret.addPropertyResult('snapshotWindow', 'SnapshotWindow', properties.SnapshotWindow != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotWindow) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('transitEncryptionEnabled', 'TransitEncryptionEnabled', properties.TransitEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransitEncryptionEnabled) : undefined);
    ret.addPropertyResult('userGroupIds', 'UserGroupIds', properties.UserGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.UserGroupIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::ReplicationGroup`
 *
 * The `AWS::ElastiCache::ReplicationGroup` resource creates an Amazon ElastiCache Redis replication group. A Redis (cluster mode disabled) replication group is a collection of cache clusters, where one of the clusters is a primary read-write cluster and the others are read-only replicas.
 *
 * A Redis (cluster mode enabled) cluster is comprised of from 1 to 90 shards (API/CLI: node groups). Each shard has a primary node and up to 5 read-only replica nodes. The configuration can range from 90 shards and 0 replicas to 15 shards and 5 replicas, which is the maximum number or replicas allowed.
 *
 * The node or shard limit can be increased to a maximum of 500 per cluster if the Redis engine version is 5.0.6 or higher. For example, you can choose to configure a 500 node cluster that ranges between 83 shards (one primary and 5 replicas per shard) and 500 shards (single primary and no replicas). Make sure there are enough available IP addresses to accommodate the increase. Common pitfalls include the subnets in the subnet group have too small a CIDR range or the subnets are shared and heavily used by other clusters. For more information, see [Creating a Subnet Group](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SubnetGroups.Creating.html) . For versions below 5.0.6, the limit is 250 per cluster.
 *
 * To request a limit increase, see [Amazon Service Limits](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html) and choose the limit type *Nodes per cluster per instance type* .
 *
 * @cloudformationResource AWS::ElastiCache::ReplicationGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html
 */
export class CfnReplicationGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::ReplicationGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The DNS hostname of the cache node.
     *
     * > Redis (cluster mode disabled) replication groups don't have this attribute. Therefore, `Fn::GetAtt` returns a value for this attribute only if the replication group is clustered. Otherwise, `Fn::GetAtt` fails. For Redis (cluster mode disabled) replication groups, use the `PrimaryEndpoint` or `ReadEndpoint` attributes.
     * @cloudformationAttribute ConfigurationEndPoint.Address
     */
    public readonly attrConfigurationEndPointAddress: string;

    /**
     * The port number that the cache engine is listening on.
     * @cloudformationAttribute ConfigurationEndPoint.Port
     */
    public readonly attrConfigurationEndPointPort: string;

    /**
     * The DNS address of the primary read-write cache node.
     * @cloudformationAttribute PrimaryEndPoint.Address
     */
    public readonly attrPrimaryEndPointAddress: string;

    /**
     * The number of the port that the primary read-write cache engine is listening on.
     * @cloudformationAttribute PrimaryEndPoint.Port
     */
    public readonly attrPrimaryEndPointPort: string;

    /**
     * A string with a list of endpoints for the primary and read-only replicas. The order of the addresses maps to the order of the ports from the `ReadEndPoint.Ports` attribute.
     * @cloudformationAttribute ReadEndPoint.Addresses
     */
    public readonly attrReadEndPointAddresses: string;

    /**
     * A string with a list of endpoints for the read-only replicas. The order of the addresses maps to the order of the ports from the `ReadEndPoint.Ports` attribute.
     * @cloudformationAttribute ReadEndPoint.Addresses.List
     */
    public readonly attrReadEndPointAddressesList: string[];

    /**
     * A string with a list of ports for the read-only replicas. The order of the ports maps to the order of the addresses from the `ReadEndPoint.Addresses` attribute.
     * @cloudformationAttribute ReadEndPoint.Ports
     */
    public readonly attrReadEndPointPorts: string;

    /**
     * A string with a list of ports for the read-only replicas. The order of the ports maps to the order of the addresses from the ReadEndPoint.Addresses attribute.
     * @cloudformationAttribute ReadEndPoint.Ports.List
     */
    public readonly attrReadEndPointPortsList: string[];

    /**
     * The address of the reader endpoint.
     * @cloudformationAttribute ReaderEndPoint.Address
     */
    public readonly attrReaderEndPointAddress: string;

    /**
     * The port used by the reader endpoint.
     * @cloudformationAttribute ReaderEndPoint.Port
     */
    public readonly attrReaderEndPointPort: string;

    /**
     * A user-created description for the replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicationgroupdescription
     */
    public replicationGroupDescription: string;

    /**
     * A flag that enables encryption at rest when set to `true` .
     *
     * You cannot modify the value of `AtRestEncryptionEnabled` after the replication group is created. To enable encryption at rest on a replication group you must set `AtRestEncryptionEnabled` to `true` when you create the replication group.
     *
     * *Required:* Only available when creating a replication group in an Amazon VPC using redis version `3.2.6` or `4.x` onward.
     *
     * Default: `false`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-atrestencryptionenabled
     */
    public atRestEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * *Reserved parameter.* The password used to access a password protected server.
     *
     * `AuthToken` can be specified only on replication groups where `TransitEncryptionEnabled` is `true` . For more information, see [Authenticating Users with the Redis AUTH Command](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth.html) .
     *
     * > For HIPAA compliance, you must specify `TransitEncryptionEnabled` as `true` , an `AuthToken` , and a `CacheSubnetGroup` .
     *
     * Password constraints:
     *
     * - Must be only printable ASCII characters.
     * - Must be at least 16 characters and no more than 128 characters in length.
     * - Nonalphanumeric characters are restricted to (!, &, #, $, ^, <, >, -, ).
     *
     * For more information, see [AUTH password](https://docs.aws.amazon.com/http://redis.io/commands/AUTH) at http://redis.io/commands/AUTH.
     *
     * > If ADDING the AuthToken, update requires [Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-authtoken
     */
    public authToken: string | undefined;

    /**
     * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.
     *
     * `AutomaticFailoverEnabled` must be enabled for Redis (cluster mode enabled) replication groups.
     *
     * Default: false
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-automaticfailoverenabled
     */
    public automaticFailoverEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next minor version upgrade campaign. This parameter is disabled for previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-autominorversionupgrade
     */
    public autoMinorVersionUpgrade: boolean | cdk.IResolvable | undefined;

    /**
     * The compute and memory capacity of the nodes in the node group (shard).
     *
     * The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.
     *
     * - General purpose:
     *
     * - Current generation:
     *
     * *M6g node types:* `cache.m6g.large` , `cache.m6g.xlarge` , `cache.m6g.2xlarge` , `cache.m6g.4xlarge` , `cache.m6g.12xlarge` , `cache.m6g.24xlarge`
     *
     * *M5 node types:* `cache.m5.large` , `cache.m5.xlarge` , `cache.m5.2xlarge` , `cache.m5.4xlarge` , `cache.m5.12xlarge` , `cache.m5.24xlarge`
     *
     * *M4 node types:* `cache.m4.large` , `cache.m4.xlarge` , `cache.m4.2xlarge` , `cache.m4.4xlarge` , `cache.m4.10xlarge`
     *
     * *T4g node types:* `cache.t4g.micro` , `cache.t4g.small` , `cache.t4g.medium`
     *
     * *T3 node types:* `cache.t3.micro` , `cache.t3.small` , `cache.t3.medium`
     *
     * *T2 node types:* `cache.t2.micro` , `cache.t2.small` , `cache.t2.medium`
     * - Previous generation: (not recommended)
     *
     * *T1 node types:* `cache.t1.micro`
     *
     * *M1 node types:* `cache.m1.small` , `cache.m1.medium` , `cache.m1.large` , `cache.m1.xlarge`
     *
     * *M3 node types:* `cache.m3.medium` , `cache.m3.large` , `cache.m3.xlarge` , `cache.m3.2xlarge`
     * - Compute optimized:
     *
     * - Previous generation: (not recommended)
     *
     * *C1 node types:* `cache.c1.xlarge`
     * - Memory optimized:
     *
     * - Current generation:
     *
     * *R6gd node types:* `cache.r6gd.xlarge` , `cache.r6gd.2xlarge` , `cache.r6gd.4xlarge` , `cache.r6gd.8xlarge` , `cache.r6gd.12xlarge` , `cache.r6gd.16xlarge`
     *
     * > The `r6gd` family is available in the following regions: `us-east-2` , `us-east-1` , `us-west-2` , `us-west-1` , `eu-west-1` , `eu-central-1` , `ap-northeast-1` , `ap-southeast-1` , `ap-southeast-2` .
     *
     * *R6g node types:* `cache.r6g.large` , `cache.r6g.xlarge` , `cache.r6g.2xlarge` , `cache.r6g.4xlarge` , `cache.r6g.12xlarge` , `cache.r6g.24xlarge`
     *
     * *R5 node types:* `cache.r5.large` , `cache.r5.xlarge` , `cache.r5.2xlarge` , `cache.r5.4xlarge` , `cache.r5.12xlarge` , `cache.r5.24xlarge`
     *
     * *R4 node types:* `cache.r4.large` , `cache.r4.xlarge` , `cache.r4.2xlarge` , `cache.r4.4xlarge` , `cache.r4.8xlarge` , `cache.r4.16xlarge`
     * - Previous generation: (not recommended)
     *
     * *M2 node types:* `cache.m2.xlarge` , `cache.m2.2xlarge` , `cache.m2.4xlarge`
     *
     * *R3 node types:* `cache.r3.large` , `cache.r3.xlarge` , `cache.r3.2xlarge` , `cache.r3.4xlarge` , `cache.r3.8xlarge`
     *
     * For region availability, see [Supported Node Types by Amazon Region](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html#CacheNodes.SupportedTypesByRegion)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachenodetype
     */
    public cacheNodeType: string | undefined;

    /**
     * The name of the parameter group to associate with this replication group. If this argument is omitted, the default cache parameter group for the specified engine is used.
     *
     * If you are running Redis version 3.2.4 or later, only one node group (shard), and want to use a default parameter group, we recommend that you specify the parameter group by name.
     *
     * - To create a Redis (cluster mode disabled) replication group, use `CacheParameterGroupName=default.redis3.2` .
     * - To create a Redis (cluster mode enabled) replication group, use `CacheParameterGroupName=default.redis3.2.cluster.on` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cacheparametergroupname
     */
    public cacheParameterGroupName: string | undefined;

    /**
     * A list of cache security group names to associate with this replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachesecuritygroupnames
     */
    public cacheSecurityGroupNames: string[] | undefined;

    /**
     * The name of the cache subnet group to be used for the replication group.
     *
     * > If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see [AWS::ElastiCache::SubnetGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-subnetgroup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-cachesubnetgroupname
     */
    public cacheSubnetGroupName: string | undefined;

    /**
     * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see [Data tiering](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/data-tiering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-datatieringenabled
     */
    public dataTieringEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The name of the cache engine to be used for the clusters in this replication group. The value must be set to `Redis` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-engine
     */
    public engine: string | undefined;

    /**
     * The version number of the cache engine to be used for the clusters in this replication group. To view the supported cache engine versions, use the `DescribeCacheEngineVersions` operation.
     *
     * *Important:* You can upgrade to a newer engine version (see [Selecting a Cache Engine and Version](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SelectEngine.html#VersionManagement) ) in the *ElastiCache User Guide* , but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * The name of the Global datastore
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-globalreplicationgroupid
     */
    public globalReplicationGroupId: string | undefined;

    /**
     * The network type you choose when creating a replication group, either `ipv4` | `ipv6` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-ipdiscovery
     */
    public ipDiscovery: string | undefined;

    /**
     * The ID of the KMS key used to encrypt the disk on the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Specifies the destination, format and type of the logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-logdeliveryconfigurations
     */
    public logDeliveryConfigurations: Array<CfnReplicationGroup.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A flag indicating if you have Multi-AZ enabled to enhance fault tolerance. For more information, see [Minimizing Downtime: Multi-AZ](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/AutoFailover.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-multiazenabled
     */
    public multiAzEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Must be either `ipv4` | `ipv6` | `dual_stack` . IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the [Nitro system](https://docs.aws.amazon.com/https://aws.amazon.com/ec2/nitro/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-networktype
     */
    public networkType: string | undefined;

    /**
     * `NodeGroupConfiguration` is a property of the `AWS::ElastiCache::ReplicationGroup` resource that configures an Amazon ElastiCache (ElastiCache) Redis cluster node group.
     *
     * If you set [UseOnlineResharding](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-useonlineresharding) to `true` , you can update `NodeGroupConfiguration` without interruption. When `UseOnlineResharding` is set to `false` , or is not specified, updating `NodeGroupConfiguration` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-nodegroupconfiguration
     */
    public nodeGroupConfiguration: Array<CfnReplicationGroup.NodeGroupConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.
     *
     * > The Amazon SNS topic owner must be the same as the cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-notificationtopicarn
     */
    public notificationTopicArn: string | undefined;

    /**
     * The number of clusters this replication group initially has.
     *
     * This parameter is not used if there is more than one node group (shard). You should use `ReplicasPerNodeGroup` instead.
     *
     * If `AutomaticFailoverEnabled` is `true` , the value of this parameter must be at least 2. If `AutomaticFailoverEnabled` is `false` you can omit this parameter (it will default to 1), or you can explicitly set it to a value between 2 and 6.
     *
     * The maximum permitted value for `NumCacheClusters` is 6 (1 primary plus 5 replicas).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-numcacheclusters
     */
    public numCacheClusters: number | undefined;

    /**
     * An optional parameter that specifies the number of node groups (shards) for this Redis (cluster mode enabled) replication group. For Redis (cluster mode disabled) either omit this parameter or set it to 1.
     *
     * If you set [UseOnlineResharding](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-useonlineresharding) to `true` , you can update `NumNodeGroups` without interruption. When `UseOnlineResharding` is set to `false` , or is not specified, updating `NumNodeGroups` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
     *
     * Default: 1
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-numnodegroups
     */
    public numNodeGroups: number | undefined;

    /**
     * The port number on which each member of the replication group accepts connections.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-port
     */
    public port: number | undefined;

    /**
     * A list of EC2 Availability Zones in which the replication group's clusters are created. The order of the Availability Zones in the list is the order in which clusters are allocated. The primary cluster is created in the first AZ in the list.
     *
     * This parameter is not used if there is more than one node group (shard). You should use `NodeGroupConfiguration` instead.
     *
     * > If you are creating your replication group in an Amazon VPC (recommended), you can only locate clusters in Availability Zones associated with the subnets in the selected subnet group.
     * >
     * > The number of Availability Zones listed must equal the value of `NumCacheClusters` .
     *
     * Default: system chosen Availability Zones.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-preferredcacheclusterazs
     */
    public preferredCacheClusterAZs: string[] | undefined;

    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period.
     *
     * Valid values for `ddd` are:
     *
     * - `sun`
     * - `mon`
     * - `tue`
     * - `wed`
     * - `thu`
     * - `fri`
     * - `sat`
     *
     * Example: `sun:23:00-mon:01:30`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * The identifier of the cluster that serves as the primary for this replication group. This cluster must already exist and have a status of `available` .
     *
     * This parameter is not required if `NumCacheClusters` , `NumNodeGroups` , or `ReplicasPerNodeGroup` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-primaryclusterid
     */
    public primaryClusterId: string | undefined;

    /**
     * An optional parameter that specifies the number of replica nodes in each node group (shard). Valid values are 0 to 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicaspernodegroup
     */
    public replicasPerNodeGroup: number | undefined;

    /**
     * The replication group identifier. This parameter is stored as a lowercase string.
     *
     * Constraints:
     *
     * - A name must contain from 1 to 40 alphanumeric characters or hyphens.
     * - The first character must be a letter.
     * - A name cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-replicationgroupid
     */
    public replicationGroupId: string | undefined;

    /**
     * One or more Amazon VPC security groups associated with this replication group.
     *
     * Use this parameter only when you are creating a replication group in an Amazon Virtual Private Cloud (Amazon VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * A list of Amazon Resource Names (ARN) that uniquely identify the Redis RDB snapshot files stored in Amazon S3. The snapshot files are used to populate the new replication group. The Amazon S3 object name in the ARN cannot contain any commas. The new replication group will have the number of node groups (console: shards) specified by the parameter *NumNodeGroups* or the number of node groups configured by *NodeGroupConfiguration* regardless of the number of ARNs specified here.
     *
     * Example of an Amazon S3 ARN: `arn:aws:s3:::my_bucket/snapshot1.rdb`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotarns
     */
    public snapshotArns: string[] | undefined;

    /**
     * The name of a snapshot from which to restore data into the new replication group. The snapshot status changes to `restoring` while the new replication group is being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotname
     */
    public snapshotName: string | undefined;

    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set `SnapshotRetentionLimit` to 5, a snapshot that was taken today is retained for 5 days before being deleted.
     *
     * Default: 0 (i.e., automatic backups are disabled for this cluster).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotretentionlimit
     */
    public snapshotRetentionLimit: number | undefined;

    /**
     * The cluster ID that is used as the daily snapshot source for the replication group. This parameter cannot be set for Redis (cluster mode enabled) replication groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshottingclusterid
     */
    public snapshottingClusterId: string | undefined;

    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard).
     *
     * Example: `05:00-09:00`
     *
     * If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-snapshotwindow
     */
    public snapshotWindow: string | undefined;

    /**
     * A list of tags to be added to this resource. Tags are comma-separated key,value pairs (e.g. Key= `myKey` , Value= `myKeyValue` . You can include multiple tags as shown following: Key= `myKey` , Value= `myKeyValue` Key= `mySecondKey` , Value= `mySecondKeyValue` . Tags on replication groups will be replicated to all nodes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A flag that enables in-transit encryption when set to `true` .
     *
     * You cannot modify the value of `TransitEncryptionEnabled` after the cluster is created. To enable in-transit encryption on a cluster you must set `TransitEncryptionEnabled` to `true` when you create a cluster.
     *
     * This parameter is valid only if the `Engine` parameter is `redis` , the `EngineVersion` parameter is `3.2.6` or `4.x` onward, and the cluster is being created in an Amazon VPC.
     *
     * If you enable in-transit encryption, you must also specify a value for `CacheSubnetGroup` .
     *
     * *Required:* Only available when creating a replication group in an Amazon VPC using redis version `3.2.6` or `4.x` onward.
     *
     * Default: `false`
     *
     * > For HIPAA compliance, you must specify `TransitEncryptionEnabled` as `true` , an `AuthToken` , and a `CacheSubnetGroup` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-transitencryptionenabled
     */
    public transitEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The ID of user group to associate with the replication group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-replicationgroup.html#cfn-elasticache-replicationgroup-usergroupids
     */
    public userGroupIds: string[] | undefined;

    /**
     * Create a new `AWS::ElastiCache::ReplicationGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationGroupProps) {
        super(scope, id, { type: CfnReplicationGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'replicationGroupDescription', this);
        this.attrConfigurationEndPointAddress = cdk.Token.asString(this.getAtt('ConfigurationEndPoint.Address', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationEndPointPort = cdk.Token.asString(this.getAtt('ConfigurationEndPoint.Port', cdk.ResolutionTypeHint.STRING));
        this.attrPrimaryEndPointAddress = cdk.Token.asString(this.getAtt('PrimaryEndPoint.Address', cdk.ResolutionTypeHint.STRING));
        this.attrPrimaryEndPointPort = cdk.Token.asString(this.getAtt('PrimaryEndPoint.Port', cdk.ResolutionTypeHint.STRING));
        this.attrReadEndPointAddresses = cdk.Token.asString(this.getAtt('ReadEndPoint.Addresses', cdk.ResolutionTypeHint.STRING));
        this.attrReadEndPointAddressesList = cdk.Token.asList(this.getAtt('ReadEndPoint.Addresses.List', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrReadEndPointPorts = cdk.Token.asString(this.getAtt('ReadEndPoint.Ports', cdk.ResolutionTypeHint.STRING));
        this.attrReadEndPointPortsList = cdk.Token.asList(this.getAtt('ReadEndPoint.Ports.List', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrReaderEndPointAddress = cdk.Token.asString(this.getAtt('ReaderEndPoint.Address', cdk.ResolutionTypeHint.STRING));
        this.attrReaderEndPointPort = cdk.Token.asString(this.getAtt('ReaderEndPoint.Port', cdk.ResolutionTypeHint.STRING));

        this.replicationGroupDescription = props.replicationGroupDescription;
        this.atRestEncryptionEnabled = props.atRestEncryptionEnabled;
        this.authToken = props.authToken;
        this.automaticFailoverEnabled = props.automaticFailoverEnabled;
        this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
        this.cacheNodeType = props.cacheNodeType;
        this.cacheParameterGroupName = props.cacheParameterGroupName;
        this.cacheSecurityGroupNames = props.cacheSecurityGroupNames;
        this.cacheSubnetGroupName = props.cacheSubnetGroupName;
        this.dataTieringEnabled = props.dataTieringEnabled;
        this.engine = props.engine;
        this.engineVersion = props.engineVersion;
        this.globalReplicationGroupId = props.globalReplicationGroupId;
        this.ipDiscovery = props.ipDiscovery;
        this.kmsKeyId = props.kmsKeyId;
        this.logDeliveryConfigurations = props.logDeliveryConfigurations;
        this.multiAzEnabled = props.multiAzEnabled;
        this.networkType = props.networkType;
        this.nodeGroupConfiguration = props.nodeGroupConfiguration;
        this.notificationTopicArn = props.notificationTopicArn;
        this.numCacheClusters = props.numCacheClusters;
        this.numNodeGroups = props.numNodeGroups;
        this.port = props.port;
        this.preferredCacheClusterAZs = props.preferredCacheClusterAZs;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.primaryClusterId = props.primaryClusterId;
        this.replicasPerNodeGroup = props.replicasPerNodeGroup;
        this.replicationGroupId = props.replicationGroupId;
        this.securityGroupIds = props.securityGroupIds;
        this.snapshotArns = props.snapshotArns;
        this.snapshotName = props.snapshotName;
        this.snapshotRetentionLimit = props.snapshotRetentionLimit;
        this.snapshottingClusterId = props.snapshottingClusterId;
        this.snapshotWindow = props.snapshotWindow;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElastiCache::ReplicationGroup", props.tags, { tagPropertyName: 'tags' });
        this.transitEncryptionEnabled = props.transitEncryptionEnabled;
        this.userGroupIds = props.userGroupIds;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::ElastiCache::ReplicationGroup\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            replicationGroupDescription: this.replicationGroupDescription,
            atRestEncryptionEnabled: this.atRestEncryptionEnabled,
            authToken: this.authToken,
            automaticFailoverEnabled: this.automaticFailoverEnabled,
            autoMinorVersionUpgrade: this.autoMinorVersionUpgrade,
            cacheNodeType: this.cacheNodeType,
            cacheParameterGroupName: this.cacheParameterGroupName,
            cacheSecurityGroupNames: this.cacheSecurityGroupNames,
            cacheSubnetGroupName: this.cacheSubnetGroupName,
            dataTieringEnabled: this.dataTieringEnabled,
            engine: this.engine,
            engineVersion: this.engineVersion,
            globalReplicationGroupId: this.globalReplicationGroupId,
            ipDiscovery: this.ipDiscovery,
            kmsKeyId: this.kmsKeyId,
            logDeliveryConfigurations: this.logDeliveryConfigurations,
            multiAzEnabled: this.multiAzEnabled,
            networkType: this.networkType,
            nodeGroupConfiguration: this.nodeGroupConfiguration,
            notificationTopicArn: this.notificationTopicArn,
            numCacheClusters: this.numCacheClusters,
            numNodeGroups: this.numNodeGroups,
            port: this.port,
            preferredCacheClusterAZs: this.preferredCacheClusterAZs,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            primaryClusterId: this.primaryClusterId,
            replicasPerNodeGroup: this.replicasPerNodeGroup,
            replicationGroupId: this.replicationGroupId,
            securityGroupIds: this.securityGroupIds,
            snapshotArns: this.snapshotArns,
            snapshotName: this.snapshotName,
            snapshotRetentionLimit: this.snapshotRetentionLimit,
            snapshottingClusterId: this.snapshottingClusterId,
            snapshotWindow: this.snapshotWindow,
            tags: this.tags.renderTags(),
            transitEncryptionEnabled: this.transitEncryptionEnabled,
            userGroupIds: this.userGroupIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationGroupPropsToCloudFormation(props);
    }
}

export namespace CfnReplicationGroup {
    /**
     * The configuration details of the CloudWatch Logs destination. Note that this field is marked as required but only if CloudWatch Logs was chosen as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-cloudwatchlogsdestinationdetails.html
     */
    export interface CloudWatchLogsDestinationDetailsProperty {
        /**
         * The name of the CloudWatch Logs log group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-cloudwatchlogsdestinationdetails.html#cfn-elasticache-replicationgroup-cloudwatchlogsdestinationdetails-loggroup
         */
        readonly logGroup: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroup_CloudWatchLogsDestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroup', cdk.requiredValidator)(properties.logGroup));
    errors.collect(cdk.propertyValidator('logGroup', cdk.validateString)(properties.logGroup));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsDestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.CloudWatchLogsDestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsDestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.CloudWatchLogsDestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupCloudWatchLogsDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroup_CloudWatchLogsDestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        LogGroup: cdk.stringToCloudFormation(properties.logGroup),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupCloudWatchLogsDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroup.CloudWatchLogsDestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroup.CloudWatchLogsDestinationDetailsProperty>();
    ret.addPropertyResult('logGroup', 'LogGroup', cfn_parse.FromCloudFormation.getString(properties.LogGroup));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationGroup {
    /**
     * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-destinationdetails.html
     */
    export interface DestinationDetailsProperty {
        /**
         * The configuration details of the CloudWatch Logs destination. Note that this field is marked as required but only if CloudWatch Logs was chosen as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-destinationdetails.html#cfn-elasticache-replicationgroup-destinationdetails-cloudwatchlogsdetails
         */
        readonly cloudWatchLogsDetails?: CfnReplicationGroup.CloudWatchLogsDestinationDetailsProperty | cdk.IResolvable;
        /**
         * The configuration details of the Kinesis Data Firehose destination. Note that this field is marked as required but only if Kinesis Data Firehose was chosen as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-destinationdetails.html#cfn-elasticache-replicationgroup-destinationdetails-kinesisfirehosedetails
         */
        readonly kinesisFirehoseDetails?: CfnReplicationGroup.KinesisFirehoseDestinationDetailsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroup_DestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsDetails', CfnReplicationGroup_CloudWatchLogsDestinationDetailsPropertyValidator)(properties.cloudWatchLogsDetails));
    errors.collect(cdk.propertyValidator('kinesisFirehoseDetails', CfnReplicationGroup_KinesisFirehoseDestinationDetailsPropertyValidator)(properties.kinesisFirehoseDetails));
    return errors.wrap('supplied properties not correct for "DestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.DestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `DestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.DestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroup_DestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsDetails: cfnReplicationGroupCloudWatchLogsDestinationDetailsPropertyToCloudFormation(properties.cloudWatchLogsDetails),
        KinesisFirehoseDetails: cfnReplicationGroupKinesisFirehoseDestinationDetailsPropertyToCloudFormation(properties.kinesisFirehoseDetails),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroup.DestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroup.DestinationDetailsProperty>();
    ret.addPropertyResult('cloudWatchLogsDetails', 'CloudWatchLogsDetails', properties.CloudWatchLogsDetails != null ? CfnReplicationGroupCloudWatchLogsDestinationDetailsPropertyFromCloudFormation(properties.CloudWatchLogsDetails) : undefined);
    ret.addPropertyResult('kinesisFirehoseDetails', 'KinesisFirehoseDetails', properties.KinesisFirehoseDetails != null ? CfnReplicationGroupKinesisFirehoseDestinationDetailsPropertyFromCloudFormation(properties.KinesisFirehoseDetails) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationGroup {
    /**
     * The configuration details of the Kinesis Data Firehose destination. Note that this field is marked as required but only if Kinesis Data Firehose was chosen as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-kinesisfirehosedestinationdetails.html
     */
    export interface KinesisFirehoseDestinationDetailsProperty {
        /**
         * The name of the Kinesis Data Firehose delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-kinesisfirehosedestinationdetails.html#cfn-elasticache-replicationgroup-kinesisfirehosedestinationdetails-deliverystream
         */
        readonly deliveryStream: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroup_KinesisFirehoseDestinationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryStream', cdk.requiredValidator)(properties.deliveryStream));
    errors.collect(cdk.propertyValidator('deliveryStream', cdk.validateString)(properties.deliveryStream));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseDestinationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.KinesisFirehoseDestinationDetails` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.KinesisFirehoseDestinationDetails` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupKinesisFirehoseDestinationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroup_KinesisFirehoseDestinationDetailsPropertyValidator(properties).assertSuccess();
    return {
        DeliveryStream: cdk.stringToCloudFormation(properties.deliveryStream),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupKinesisFirehoseDestinationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroup.KinesisFirehoseDestinationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroup.KinesisFirehoseDestinationDetailsProperty>();
    ret.addPropertyResult('deliveryStream', 'DeliveryStream', cfn_parse.FromCloudFormation.getString(properties.DeliveryStream));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationGroup {
    /**
     * Specifies the destination, format and type of the logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-logdeliveryconfigurationrequest.html
     */
    export interface LogDeliveryConfigurationRequestProperty {
        /**
         * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-logdeliveryconfigurationrequest.html#cfn-elasticache-replicationgroup-logdeliveryconfigurationrequest-destinationdetails
         */
        readonly destinationDetails: CfnReplicationGroup.DestinationDetailsProperty | cdk.IResolvable;
        /**
         * Specify either CloudWatch Logs or Kinesis Data Firehose as the destination type. Valid values are either `cloudwatch-logs` or `kinesis-firehose` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-logdeliveryconfigurationrequest.html#cfn-elasticache-replicationgroup-logdeliveryconfigurationrequest-destinationtype
         */
        readonly destinationType: string;
        /**
         * Valid values are either `json` or `text` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-logdeliveryconfigurationrequest.html#cfn-elasticache-replicationgroup-logdeliveryconfigurationrequest-logformat
         */
        readonly logFormat: string;
        /**
         * Valid value is either `slow-log` , which refers to [slow-log](https://docs.aws.amazon.com/https://redis.io/commands/slowlog) or `engine-log` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-logdeliveryconfigurationrequest.html#cfn-elasticache-replicationgroup-logdeliveryconfigurationrequest-logtype
         */
        readonly logType: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogDeliveryConfigurationRequestProperty`
 *
 * @param properties - the TypeScript properties of a `LogDeliveryConfigurationRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroup_LogDeliveryConfigurationRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationDetails', cdk.requiredValidator)(properties.destinationDetails));
    errors.collect(cdk.propertyValidator('destinationDetails', CfnReplicationGroup_DestinationDetailsPropertyValidator)(properties.destinationDetails));
    errors.collect(cdk.propertyValidator('destinationType', cdk.requiredValidator)(properties.destinationType));
    errors.collect(cdk.propertyValidator('destinationType', cdk.validateString)(properties.destinationType));
    errors.collect(cdk.propertyValidator('logFormat', cdk.requiredValidator)(properties.logFormat));
    errors.collect(cdk.propertyValidator('logFormat', cdk.validateString)(properties.logFormat));
    errors.collect(cdk.propertyValidator('logType', cdk.requiredValidator)(properties.logType));
    errors.collect(cdk.propertyValidator('logType', cdk.validateString)(properties.logType));
    return errors.wrap('supplied properties not correct for "LogDeliveryConfigurationRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.LogDeliveryConfigurationRequest` resource
 *
 * @param properties - the TypeScript properties of a `LogDeliveryConfigurationRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.LogDeliveryConfigurationRequest` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupLogDeliveryConfigurationRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroup_LogDeliveryConfigurationRequestPropertyValidator(properties).assertSuccess();
    return {
        DestinationDetails: cfnReplicationGroupDestinationDetailsPropertyToCloudFormation(properties.destinationDetails),
        DestinationType: cdk.stringToCloudFormation(properties.destinationType),
        LogFormat: cdk.stringToCloudFormation(properties.logFormat),
        LogType: cdk.stringToCloudFormation(properties.logType),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupLogDeliveryConfigurationRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroup.LogDeliveryConfigurationRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroup.LogDeliveryConfigurationRequestProperty>();
    ret.addPropertyResult('destinationDetails', 'DestinationDetails', CfnReplicationGroupDestinationDetailsPropertyFromCloudFormation(properties.DestinationDetails));
    ret.addPropertyResult('destinationType', 'DestinationType', cfn_parse.FromCloudFormation.getString(properties.DestinationType));
    ret.addPropertyResult('logFormat', 'LogFormat', cfn_parse.FromCloudFormation.getString(properties.LogFormat));
    ret.addPropertyResult('logType', 'LogType', cfn_parse.FromCloudFormation.getString(properties.LogType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationGroup {
    /**
     * `NodeGroupConfiguration` is a property of the `AWS::ElastiCache::ReplicationGroup` resource that configures an Amazon ElastiCache (ElastiCache) Redis cluster node group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html
     */
    export interface NodeGroupConfigurationProperty {
        /**
         * Either the ElastiCache for Redis supplied 4-digit id or a user supplied id for the node group these configuration values apply to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-nodegroupid
         */
        readonly nodeGroupId?: string;
        /**
         * The Availability Zone where the primary node of this node group (shard) is launched.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-primaryavailabilityzone
         */
        readonly primaryAvailabilityZone?: string;
        /**
         * A list of Availability Zones to be used for the read replicas. The number of Availability Zones in this list must match the value of `ReplicaCount` or `ReplicasPerNodeGroup` if not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-replicaavailabilityzones
         */
        readonly replicaAvailabilityZones?: string[];
        /**
         * The number of read replica nodes in this node group (shard).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-replicacount
         */
        readonly replicaCount?: number;
        /**
         * A string of comma-separated values where the first set of values are the slot numbers (zero based), and the second set of values are the keyspaces for each slot. The following example specifies three slots (numbered 0, 1, and 2): `0,1,2,0-4999,5000-9999,10000-16,383` .
         *
         * If you don't specify a value, ElastiCache allocates keys equally among each slot.
         *
         * When you use an `UseOnlineResharding` update policy to update the number of node groups without interruption, ElastiCache evenly distributes the keyspaces between the specified number of slots. This cannot be updated later. Therefore, after updating the number of node groups in this way, you should remove the value specified for the `Slots` property of each `NodeGroupConfiguration` from the stack template, as it no longer reflects the actual values in each node group. For more information, see [UseOnlineResharding Policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-useonlineresharding) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-replicationgroup-nodegroupconfiguration.html#cfn-elasticache-replicationgroup-nodegroupconfiguration-slots
         */
        readonly slots?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NodeGroupConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NodeGroupConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationGroup_NodeGroupConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nodeGroupId', cdk.validateString)(properties.nodeGroupId));
    errors.collect(cdk.propertyValidator('primaryAvailabilityZone', cdk.validateString)(properties.primaryAvailabilityZone));
    errors.collect(cdk.propertyValidator('replicaAvailabilityZones', cdk.listValidator(cdk.validateString))(properties.replicaAvailabilityZones));
    errors.collect(cdk.propertyValidator('replicaCount', cdk.validateNumber)(properties.replicaCount));
    errors.collect(cdk.propertyValidator('slots', cdk.validateString)(properties.slots));
    return errors.wrap('supplied properties not correct for "NodeGroupConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.NodeGroupConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NodeGroupConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::ReplicationGroup.NodeGroupConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnReplicationGroupNodeGroupConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationGroup_NodeGroupConfigurationPropertyValidator(properties).assertSuccess();
    return {
        NodeGroupId: cdk.stringToCloudFormation(properties.nodeGroupId),
        PrimaryAvailabilityZone: cdk.stringToCloudFormation(properties.primaryAvailabilityZone),
        ReplicaAvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.replicaAvailabilityZones),
        ReplicaCount: cdk.numberToCloudFormation(properties.replicaCount),
        Slots: cdk.stringToCloudFormation(properties.slots),
    };
}

// @ts-ignore TS6133
function CfnReplicationGroupNodeGroupConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationGroup.NodeGroupConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationGroup.NodeGroupConfigurationProperty>();
    ret.addPropertyResult('nodeGroupId', 'NodeGroupId', properties.NodeGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.NodeGroupId) : undefined);
    ret.addPropertyResult('primaryAvailabilityZone', 'PrimaryAvailabilityZone', properties.PrimaryAvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryAvailabilityZone) : undefined);
    ret.addPropertyResult('replicaAvailabilityZones', 'ReplicaAvailabilityZones', properties.ReplicaAvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ReplicaAvailabilityZones) : undefined);
    ret.addPropertyResult('replicaCount', 'ReplicaCount', properties.ReplicaCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicaCount) : undefined);
    ret.addPropertyResult('slots', 'Slots', properties.Slots != null ? cfn_parse.FromCloudFormation.getString(properties.Slots) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSecurityGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html
 */
export interface CfnSecurityGroupProps {

    /**
     * A description for the cache security group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html#cfn-elasticache-securitygroup-description
     */
    readonly description: string;

    /**
     * A tag that can be added to an ElastiCache security group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your security groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html#cfn-elasticache-securitygroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSecurityGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnSecurityGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSecurityGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::SecurityGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnSecurityGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::SecurityGroup` resource.
 */
// @ts-ignore TS6133
function cfnSecurityGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityGroupPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSecurityGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityGroupProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::SecurityGroup`
 *
 * The `AWS::ElastiCache::SecurityGroup` resource creates a cache security group. For more information about cache security groups, go to [CacheSecurityGroups](https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/VPCs.html) in the *Amazon ElastiCache User Guide* or go to [CreateCacheSecurityGroup](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_CreateCacheSecurityGroup.html) in the *Amazon ElastiCache API Reference Guide* .
 *
 * For more information, see [CreateCacheSubnetGroup](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_CreateCacheSubnetGroup.html) .
 *
 * @cloudformationResource AWS::ElastiCache::SecurityGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html
 */
export class CfnSecurityGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::SecurityGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSecurityGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSecurityGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A description for the cache security group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html#cfn-elasticache-securitygroup-description
     */
    public description: string;

    /**
     * A tag that can be added to an ElastiCache security group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your security groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group.html#cfn-elasticache-securitygroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ElastiCache::SecurityGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSecurityGroupProps) {
        super(scope, id, { type: CfnSecurityGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);

        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElastiCache::SecurityGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSecurityGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSecurityGroupIngress`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html
 */
export interface CfnSecurityGroupIngressProps {

    /**
     * The name of the Cache Security Group to authorize.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-cachesecuritygroupname
     */
    readonly cacheSecurityGroupName: string;

    /**
     * Name of the EC2 Security Group to include in the authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-ec2securitygroupname
     */
    readonly ec2SecurityGroupName: string;

    /**
     * Specifies the Amazon Account ID of the owner of the EC2 security group specified in the EC2SecurityGroupName property. The Amazon access key ID is not an acceptable value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-ec2securitygroupownerid
     */
    readonly ec2SecurityGroupOwnerId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityGroupIngressProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityGroupIngressProps`
 *
 * @returns the result of the validation.
 */
function CfnSecurityGroupIngressPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cacheSecurityGroupName', cdk.requiredValidator)(properties.cacheSecurityGroupName));
    errors.collect(cdk.propertyValidator('cacheSecurityGroupName', cdk.validateString)(properties.cacheSecurityGroupName));
    errors.collect(cdk.propertyValidator('ec2SecurityGroupName', cdk.requiredValidator)(properties.ec2SecurityGroupName));
    errors.collect(cdk.propertyValidator('ec2SecurityGroupName', cdk.validateString)(properties.ec2SecurityGroupName));
    errors.collect(cdk.propertyValidator('ec2SecurityGroupOwnerId', cdk.validateString)(properties.ec2SecurityGroupOwnerId));
    return errors.wrap('supplied properties not correct for "CfnSecurityGroupIngressProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::SecurityGroupIngress` resource
 *
 * @param properties - the TypeScript properties of a `CfnSecurityGroupIngressProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::SecurityGroupIngress` resource.
 */
// @ts-ignore TS6133
function cfnSecurityGroupIngressPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityGroupIngressPropsValidator(properties).assertSuccess();
    return {
        CacheSecurityGroupName: cdk.stringToCloudFormation(properties.cacheSecurityGroupName),
        EC2SecurityGroupName: cdk.stringToCloudFormation(properties.ec2SecurityGroupName),
        EC2SecurityGroupOwnerId: cdk.stringToCloudFormation(properties.ec2SecurityGroupOwnerId),
    };
}

// @ts-ignore TS6133
function CfnSecurityGroupIngressPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityGroupIngressProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityGroupIngressProps>();
    ret.addPropertyResult('cacheSecurityGroupName', 'CacheSecurityGroupName', cfn_parse.FromCloudFormation.getString(properties.CacheSecurityGroupName));
    ret.addPropertyResult('ec2SecurityGroupName', 'EC2SecurityGroupName', cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupName));
    ret.addPropertyResult('ec2SecurityGroupOwnerId', 'EC2SecurityGroupOwnerId', properties.EC2SecurityGroupOwnerId != null ? cfn_parse.FromCloudFormation.getString(properties.EC2SecurityGroupOwnerId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::SecurityGroupIngress`
 *
 * The AWS::ElastiCache::SecurityGroupIngress type authorizes ingress to a cache security group from hosts in specified Amazon EC2 security groups. For more information about ElastiCache security group ingress, go to [AuthorizeCacheSecurityGroupIngress](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_AuthorizeCacheSecurityGroupIngress.html) in the *Amazon ElastiCache API Reference Guide* .
 *
 * > Updates are not supported.
 *
 * @cloudformationResource AWS::ElastiCache::SecurityGroupIngress
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html
 */
export class CfnSecurityGroupIngress extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::SecurityGroupIngress";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityGroupIngress {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSecurityGroupIngressPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSecurityGroupIngress(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Cache Security Group to authorize.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-cachesecuritygroupname
     */
    public cacheSecurityGroupName: string;

    /**
     * Name of the EC2 Security Group to include in the authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-ec2securitygroupname
     */
    public ec2SecurityGroupName: string;

    /**
     * Specifies the Amazon Account ID of the owner of the EC2 security group specified in the EC2SecurityGroupName property. The Amazon access key ID is not an acceptable value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-security-group-ingress.html#cfn-elasticache-securitygroupingress-ec2securitygroupownerid
     */
    public ec2SecurityGroupOwnerId: string | undefined;

    /**
     * Create a new `AWS::ElastiCache::SecurityGroupIngress`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSecurityGroupIngressProps) {
        super(scope, id, { type: CfnSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'cacheSecurityGroupName', this);
        cdk.requireProperty(props, 'ec2SecurityGroupName', this);

        this.cacheSecurityGroupName = props.cacheSecurityGroupName;
        this.ec2SecurityGroupName = props.ec2SecurityGroupName;
        this.ec2SecurityGroupOwnerId = props.ec2SecurityGroupOwnerId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityGroupIngress.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cacheSecurityGroupName: this.cacheSecurityGroupName,
            ec2SecurityGroupName: this.ec2SecurityGroupName,
            ec2SecurityGroupOwnerId: this.ec2SecurityGroupOwnerId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSecurityGroupIngressPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSubnetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html
 */
export interface CfnSubnetGroupProps {

    /**
     * The description for the cache subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-description
     */
    readonly description: string;

    /**
     * The EC2 subnet IDs for the cache subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The name for the cache subnet group. This value is stored as a lowercase string.
     *
     * Constraints: Must contain no more than 255 alphanumeric characters or hyphens.
     *
     * Example: `mysubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-cachesubnetgroupname
     */
    readonly cacheSubnetGroupName?: string;

    /**
     * A tag that can be added to an ElastiCache subnet group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your subnet groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cacheSubnetGroupName', cdk.validateString)(properties.cacheSubnetGroupName));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSubnetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::SubnetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnSubnetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::SubnetGroup` resource.
 */
// @ts-ignore TS6133
function cfnSubnetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSubnetGroupPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        CacheSubnetGroupName: cdk.stringToCloudFormation(properties.cacheSubnetGroupName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubnetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubnetGroupProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('cacheSubnetGroupName', 'CacheSubnetGroupName', properties.CacheSubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CacheSubnetGroupName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::SubnetGroup`
 *
 * Creates a cache subnet group. For more information about cache subnet groups, go to Cache Subnet Groups in the *Amazon ElastiCache User Guide* or go to [CreateCacheSubnetGroup](https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_CreateCacheSubnetGroup.html) in the *Amazon ElastiCache API Reference Guide* .
 *
 * @cloudformationResource AWS::ElastiCache::SubnetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html
 */
export class CfnSubnetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::SubnetGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubnetGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSubnetGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSubnetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The description for the cache subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-description
     */
    public description: string;

    /**
     * The EC2 subnet IDs for the cache subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-subnetids
     */
    public subnetIds: string[];

    /**
     * The name for the cache subnet group. This value is stored as a lowercase string.
     *
     * Constraints: Must contain no more than 255 alphanumeric characters or hyphens.
     *
     * Example: `mysubnetgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-cachesubnetgroupname
     */
    public cacheSubnetGroupName: string | undefined;

    /**
     * A tag that can be added to an ElastiCache subnet group. Tags are composed of a Key/Value pair. You can use tags to categorize and track all your subnet groups. A tag with a null Value is permitted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-subnetgroup.html#cfn-elasticache-subnetgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ElastiCache::SubnetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSubnetGroupProps) {
        super(scope, id, { type: CfnSubnetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'subnetIds', this);

        this.description = props.description;
        this.subnetIds = props.subnetIds;
        this.cacheSubnetGroupName = props.cacheSubnetGroupName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElastiCache::SubnetGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubnetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            subnetIds: this.subnetIds,
            cacheSubnetGroupName: this.cacheSubnetGroupName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSubnetGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html
 */
export interface CfnUserProps {

    /**
     * The current supported value is redis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-engine
     */
    readonly engine: string;

    /**
     * The ID of the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-userid
     */
    readonly userId: string;

    /**
     * The username of the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-username
     */
    readonly userName: string;

    /**
     * Access permissions string used for this user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-accessstring
     */
    readonly accessString?: string;

    /**
     * Specifies the authentication mode to use. Below is an example of the possible JSON values:
     *
     * ```
     * { Type: <iam | no-password-required | password> Passwords: ["*****", "******"] // If Type is password.
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-authenticationmode
     */
    readonly authenticationMode?: any | cdk.IResolvable;

    /**
     * Indicates a password is not required for this user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-nopasswordrequired
     */
    readonly noPasswordRequired?: boolean | cdk.IResolvable;

    /**
     * Passwords used for this user. You can create up to two passwords for each user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-passwords
     */
    readonly passwords?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessString', cdk.validateString)(properties.accessString));
    errors.collect(cdk.propertyValidator('authenticationMode', cdk.validateObject)(properties.authenticationMode));
    errors.collect(cdk.propertyValidator('engine', cdk.requiredValidator)(properties.engine));
    errors.collect(cdk.propertyValidator('engine', cdk.validateString)(properties.engine));
    errors.collect(cdk.propertyValidator('noPasswordRequired', cdk.validateBoolean)(properties.noPasswordRequired));
    errors.collect(cdk.propertyValidator('passwords', cdk.listValidator(cdk.validateString))(properties.passwords));
    errors.collect(cdk.propertyValidator('userId', cdk.requiredValidator)(properties.userId));
    errors.collect(cdk.propertyValidator('userId', cdk.validateString)(properties.userId));
    errors.collect(cdk.propertyValidator('userName', cdk.requiredValidator)(properties.userName));
    errors.collect(cdk.propertyValidator('userName', cdk.validateString)(properties.userName));
    return errors.wrap('supplied properties not correct for "CfnUserProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::User` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::User` resource.
 */
// @ts-ignore TS6133
function cfnUserPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserPropsValidator(properties).assertSuccess();
    return {
        Engine: cdk.stringToCloudFormation(properties.engine),
        UserId: cdk.stringToCloudFormation(properties.userId),
        UserName: cdk.stringToCloudFormation(properties.userName),
        AccessString: cdk.stringToCloudFormation(properties.accessString),
        AuthenticationMode: cdk.objectToCloudFormation(properties.authenticationMode),
        NoPasswordRequired: cdk.booleanToCloudFormation(properties.noPasswordRequired),
        Passwords: cdk.listMapper(cdk.stringToCloudFormation)(properties.passwords),
    };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
    ret.addPropertyResult('engine', 'Engine', cfn_parse.FromCloudFormation.getString(properties.Engine));
    ret.addPropertyResult('userId', 'UserId', cfn_parse.FromCloudFormation.getString(properties.UserId));
    ret.addPropertyResult('userName', 'UserName', cfn_parse.FromCloudFormation.getString(properties.UserName));
    ret.addPropertyResult('accessString', 'AccessString', properties.AccessString != null ? cfn_parse.FromCloudFormation.getString(properties.AccessString) : undefined);
    ret.addPropertyResult('authenticationMode', 'AuthenticationMode', properties.AuthenticationMode != null ? cfn_parse.FromCloudFormation.getAny(properties.AuthenticationMode) : undefined);
    ret.addPropertyResult('noPasswordRequired', 'NoPasswordRequired', properties.NoPasswordRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoPasswordRequired) : undefined);
    ret.addPropertyResult('passwords', 'Passwords', properties.Passwords != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Passwords) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::User`
 *
 * For Redis engine version 6.0 onwards: Creates a Redis user. For more information, see [Using Role Based Access Control (RBAC)](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Clusters.RBAC.html) .
 *
 * @cloudformationResource AWS::ElastiCache::User
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::User";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUser(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the user.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Indicates the user status. Can be "active", "modifying" or "deleting".
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The current supported value is redis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-engine
     */
    public engine: string;

    /**
     * The ID of the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-userid
     */
    public userId: string;

    /**
     * The username of the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-username
     */
    public userName: string;

    /**
     * Access permissions string used for this user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-accessstring
     */
    public accessString: string | undefined;

    /**
     * Specifies the authentication mode to use. Below is an example of the possible JSON values:
     *
     * ```
     * { Type: <iam | no-password-required | password> Passwords: ["*****", "******"] // If Type is password.
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-authenticationmode
     */
    public authenticationMode: any | cdk.IResolvable | undefined;

    /**
     * Indicates a password is not required for this user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-nopasswordrequired
     */
    public noPasswordRequired: boolean | cdk.IResolvable | undefined;

    /**
     * Passwords used for this user. You can create up to two passwords for each user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html#cfn-elasticache-user-passwords
     */
    public passwords: string[] | undefined;

    /**
     * Create a new `AWS::ElastiCache::User`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
        super(scope, id, { type: CfnUser.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'engine', this);
        cdk.requireProperty(props, 'userId', this);
        cdk.requireProperty(props, 'userName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.engine = props.engine;
        this.userId = props.userId;
        this.userName = props.userName;
        this.accessString = props.accessString;
        this.authenticationMode = props.authenticationMode;
        this.noPasswordRequired = props.noPasswordRequired;
        this.passwords = props.passwords;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            engine: this.engine,
            userId: this.userId,
            userName: this.userName,
            accessString: this.accessString,
            authenticationMode: this.authenticationMode,
            noPasswordRequired: this.noPasswordRequired,
            passwords: this.passwords,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserPropsToCloudFormation(props);
    }
}

export namespace CfnUser {
    /**
     * Specifies the authentication mode to use.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-user-authenticationmode.html
     */
    export interface AuthenticationModeProperty {
        /**
         * Specifies the passwords to use for authentication if `Type` is set to `password` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-user-authenticationmode.html#cfn-elasticache-user-authenticationmode-passwords
         */
        readonly passwords?: string[];
        /**
         * Specifies the authentication type. Possible options are IAM authentication, password and no password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-user-authenticationmode.html#cfn-elasticache-user-authenticationmode-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuthenticationModeProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticationModeProperty`
 *
 * @returns the result of the validation.
 */
function CfnUser_AuthenticationModePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('passwords', cdk.listValidator(cdk.validateString))(properties.passwords));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "AuthenticationModeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::User.AuthenticationMode` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticationModeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::User.AuthenticationMode` resource.
 */
// @ts-ignore TS6133
function cfnUserAuthenticationModePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUser_AuthenticationModePropertyValidator(properties).assertSuccess();
    return {
        Passwords: cdk.listMapper(cdk.stringToCloudFormation)(properties.passwords),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnUserAuthenticationModePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.AuthenticationModeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.AuthenticationModeProperty>();
    ret.addPropertyResult('passwords', 'Passwords', properties.Passwords != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Passwords) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnUserGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html
 */
export interface CfnUserGroupProps {

    /**
     * The current supported value is redis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-engine
     */
    readonly engine: string;

    /**
     * The ID of the user group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-usergroupid
     */
    readonly userGroupId: string;

    /**
     * The list of user IDs that belong to the user group. A user named `default` must be included.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-userids
     */
    readonly userIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnUserGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnUserGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('engine', cdk.requiredValidator)(properties.engine));
    errors.collect(cdk.propertyValidator('engine', cdk.validateString)(properties.engine));
    errors.collect(cdk.propertyValidator('userGroupId', cdk.requiredValidator)(properties.userGroupId));
    errors.collect(cdk.propertyValidator('userGroupId', cdk.validateString)(properties.userGroupId));
    errors.collect(cdk.propertyValidator('userIds', cdk.listValidator(cdk.validateString))(properties.userIds));
    return errors.wrap('supplied properties not correct for "CfnUserGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElastiCache::UserGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElastiCache::UserGroup` resource.
 */
// @ts-ignore TS6133
function cfnUserGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserGroupPropsValidator(properties).assertSuccess();
    return {
        Engine: cdk.stringToCloudFormation(properties.engine),
        UserGroupId: cdk.stringToCloudFormation(properties.userGroupId),
        UserIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.userIds),
    };
}

// @ts-ignore TS6133
function CfnUserGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserGroupProps>();
    ret.addPropertyResult('engine', 'Engine', cfn_parse.FromCloudFormation.getString(properties.Engine));
    ret.addPropertyResult('userGroupId', 'UserGroupId', cfn_parse.FromCloudFormation.getString(properties.UserGroupId));
    ret.addPropertyResult('userIds', 'UserIds', properties.UserIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.UserIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElastiCache::UserGroup`
 *
 * For Redis engine version 6.0 onwards: Creates a Redis user group. For more information, see [Using Role Based Access Control (RBAC)](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Clusters.RBAC.html)
 *
 * @cloudformationResource AWS::ElastiCache::UserGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html
 */
export class CfnUserGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElastiCache::UserGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUserGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the user group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Indicates user group status. Can be "creating", "active", "modifying", "deleting".
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The current supported value is redis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-engine
     */
    public engine: string;

    /**
     * The ID of the user group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-usergroupid
     */
    public userGroupId: string;

    /**
     * The list of user IDs that belong to the user group. A user named `default` must be included.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-usergroup.html#cfn-elasticache-usergroup-userids
     */
    public userIds: string[] | undefined;

    /**
     * Create a new `AWS::ElastiCache::UserGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserGroupProps) {
        super(scope, id, { type: CfnUserGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'engine', this);
        cdk.requireProperty(props, 'userGroupId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.engine = props.engine;
        this.userGroupId = props.userGroupId;
        this.userIds = props.userIds;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            engine: this.engine,
            userGroupId: this.userGroupId,
            userIds: this.userIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserGroupPropsToCloudFormation(props);
    }
}
