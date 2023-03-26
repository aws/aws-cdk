// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:50.524Z","fingerprint":"n64Trw4kZ9zt/SY/Vpn37oSIeDfPlcwUjs+M8ZAy3gE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html
 */
export interface CfnClusterProps {

    /**
     * A valid Amazon Resource Name (ARN) that identifies an IAM role. At runtime, DAX will assume this role and use the role's permissions to access DynamoDB on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-iamrolearn
     */
    readonly iamRoleArn: string;

    /**
     * The node type for the nodes in the cluster. (All nodes in a DAX cluster are of the same type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-nodetype
     */
    readonly nodeType: string;

    /**
     * The number of nodes in the DAX cluster. A replication factor of 1 will create a single-node cluster, without any read replicas. For additional fault tolerance, you can create a multiple node cluster with one or more read replicas. To do this, set `ReplicationFactor` to a number between 3 (one primary and two read replicas) and 10 (one primary and nine read replicas). `If the AvailabilityZones` parameter is provided, its length must equal the `ReplicationFactor` .
     *
     * > AWS recommends that you have at least two read replicas per cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-replicationfactor
     */
    readonly replicationFactor: number;

    /**
     * The Availability Zones (AZs) in which the cluster nodes will reside after the cluster has been created or updated. If provided, the length of this list must equal the `ReplicationFactor` parameter. If you omit this parameter, DAX will spread the nodes across Availability Zones for the highest availability.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-availabilityzones
     */
    readonly availabilityZones?: string[];

    /**
     * The encryption type of the cluster's endpoint. Available values are:
     *
     * - `NONE` - The cluster's endpoint will be unencrypted.
     * - `TLS` - The cluster's endpoint will be encrypted with Transport Layer Security, and will provide an x509 certificate for authentication.
     *
     * The default value is `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clusterendpointencryptiontype
     */
    readonly clusterEndpointEncryptionType?: string;

    /**
     * The name of the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clustername
     */
    readonly clusterName?: string;

    /**
     * The description of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-description
     */
    readonly description?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications will be sent.
     *
     * > The Amazon SNS topic owner must be same as the DAX cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-notificationtopicarn
     */
    readonly notificationTopicArn?: string;

    /**
     * The parameter group to be associated with the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-parametergroupname
     */
    readonly parameterGroupName?: string;

    /**
     * A range of time when maintenance of DAX cluster software will be performed. For example: `sun:01:00-sun:09:00` . Cluster maintenance normally takes less than 30 minutes, and is performed automatically within the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * A list of security group IDs to be assigned to each node in the DAX cluster. (Each of the security group ID is system-generated.)
     *
     * If this parameter is not specified, DAX assigns the default VPC security group to each node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * Represents the settings used to enable server-side encryption on the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-ssespecification
     */
    readonly sseSpecification?: CfnCluster.SSESpecificationProperty | cdk.IResolvable;

    /**
     * The name of the subnet group to be used for the replication group.
     *
     * > DAX clusters can only run in an Amazon VPC environment. All of the subnets that you specify in a subnet group must exist in the same VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-subnetgroupname
     */
    readonly subnetGroupName?: string;

    /**
     * A set of tags to associate with the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-tags
     */
    readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZones', cdk.listValidator(cdk.validateString))(properties.availabilityZones));
    errors.collect(cdk.propertyValidator('clusterEndpointEncryptionType', cdk.validateString)(properties.clusterEndpointEncryptionType));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.requiredValidator)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.validateString)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('nodeType', cdk.requiredValidator)(properties.nodeType));
    errors.collect(cdk.propertyValidator('nodeType', cdk.validateString)(properties.nodeType));
    errors.collect(cdk.propertyValidator('notificationTopicArn', cdk.validateString)(properties.notificationTopicArn));
    errors.collect(cdk.propertyValidator('parameterGroupName', cdk.validateString)(properties.parameterGroupName));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('replicationFactor', cdk.requiredValidator)(properties.replicationFactor));
    errors.collect(cdk.propertyValidator('replicationFactor', cdk.validateNumber)(properties.replicationFactor));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnCluster_SSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetGroupName', cdk.validateString)(properties.subnetGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DAX::Cluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DAX::Cluster` resource.
 */
// @ts-ignore TS6133
function cfnClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnClusterPropsValidator(properties).assertSuccess();
    return {
        IAMRoleARN: cdk.stringToCloudFormation(properties.iamRoleArn),
        NodeType: cdk.stringToCloudFormation(properties.nodeType),
        ReplicationFactor: cdk.numberToCloudFormation(properties.replicationFactor),
        AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
        ClusterEndpointEncryptionType: cdk.stringToCloudFormation(properties.clusterEndpointEncryptionType),
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        Description: cdk.stringToCloudFormation(properties.description),
        NotificationTopicARN: cdk.stringToCloudFormation(properties.notificationTopicArn),
        ParameterGroupName: cdk.stringToCloudFormation(properties.parameterGroupName),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SSESpecification: cfnClusterSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        SubnetGroupName: cdk.stringToCloudFormation(properties.subnetGroupName),
        Tags: cdk.objectToCloudFormation(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
    ret.addPropertyResult('iamRoleArn', 'IAMRoleARN', cfn_parse.FromCloudFormation.getString(properties.IAMRoleARN));
    ret.addPropertyResult('nodeType', 'NodeType', cfn_parse.FromCloudFormation.getString(properties.NodeType));
    ret.addPropertyResult('replicationFactor', 'ReplicationFactor', cfn_parse.FromCloudFormation.getNumber(properties.ReplicationFactor));
    ret.addPropertyResult('availabilityZones', 'AvailabilityZones', properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AvailabilityZones) : undefined);
    ret.addPropertyResult('clusterEndpointEncryptionType', 'ClusterEndpointEncryptionType', properties.ClusterEndpointEncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterEndpointEncryptionType) : undefined);
    ret.addPropertyResult('clusterName', 'ClusterName', properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('notificationTopicArn', 'NotificationTopicARN', properties.NotificationTopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTopicARN) : undefined);
    ret.addPropertyResult('parameterGroupName', 'ParameterGroupName', properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('sseSpecification', 'SSESpecification', properties.SSESpecification != null ? CfnClusterSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined);
    ret.addPropertyResult('subnetGroupName', 'SubnetGroupName', properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DAX::Cluster`
 *
 * Creates a DAX cluster. All nodes in the cluster run the same DAX caching software.
 *
 * @cloudformationResource AWS::DAX::Cluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DAX::Cluster";

    /**
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
        const ret = new CfnCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the ARN of the DAX cluster. For example:
     *
     * `{ "Fn::GetAtt": [" MyDAXCluster ", "Arn"] }`
     *
     * Returns a value similar to the following:
     *
     * `arn:aws:dax:us-east-1:111122223333:cache/MyDAXCluster`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the endpoint of the DAX cluster. For example:
     *
     * `{ "Fn::GetAtt": [" MyDAXCluster ", "ClusterDiscoveryEndpoint"] }`
     *
     * Returns a value similar to the following:
     *
     * `mydaxcluster.0h3d6x.clustercfg.dax.use1.cache.amazonaws.com:8111`
     * @cloudformationAttribute ClusterDiscoveryEndpoint
     */
    public readonly attrClusterDiscoveryEndpoint: string;

    /**
     * Returns the endpoint URL of the DAX cluster.
     * @cloudformationAttribute ClusterDiscoveryEndpointURL
     */
    public readonly attrClusterDiscoveryEndpointUrl: string;

    /**
     * A valid Amazon Resource Name (ARN) that identifies an IAM role. At runtime, DAX will assume this role and use the role's permissions to access DynamoDB on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-iamrolearn
     */
    public iamRoleArn: string;

    /**
     * The node type for the nodes in the cluster. (All nodes in a DAX cluster are of the same type.)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-nodetype
     */
    public nodeType: string;

    /**
     * The number of nodes in the DAX cluster. A replication factor of 1 will create a single-node cluster, without any read replicas. For additional fault tolerance, you can create a multiple node cluster with one or more read replicas. To do this, set `ReplicationFactor` to a number between 3 (one primary and two read replicas) and 10 (one primary and nine read replicas). `If the AvailabilityZones` parameter is provided, its length must equal the `ReplicationFactor` .
     *
     * > AWS recommends that you have at least two read replicas per cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-replicationfactor
     */
    public replicationFactor: number;

    /**
     * The Availability Zones (AZs) in which the cluster nodes will reside after the cluster has been created or updated. If provided, the length of this list must equal the `ReplicationFactor` parameter. If you omit this parameter, DAX will spread the nodes across Availability Zones for the highest availability.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-availabilityzones
     */
    public availabilityZones: string[] | undefined;

    /**
     * The encryption type of the cluster's endpoint. Available values are:
     *
     * - `NONE` - The cluster's endpoint will be unencrypted.
     * - `TLS` - The cluster's endpoint will be encrypted with Transport Layer Security, and will provide an x509 certificate for authentication.
     *
     * The default value is `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clusterendpointencryptiontype
     */
    public clusterEndpointEncryptionType: string | undefined;

    /**
     * The name of the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clustername
     */
    public clusterName: string | undefined;

    /**
     * The description of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-description
     */
    public description: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications will be sent.
     *
     * > The Amazon SNS topic owner must be same as the DAX cluster owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-notificationtopicarn
     */
    public notificationTopicArn: string | undefined;

    /**
     * The parameter group to be associated with the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-parametergroupname
     */
    public parameterGroupName: string | undefined;

    /**
     * A range of time when maintenance of DAX cluster software will be performed. For example: `sun:01:00-sun:09:00` . Cluster maintenance normally takes less than 30 minutes, and is performed automatically within the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * A list of security group IDs to be assigned to each node in the DAX cluster. (Each of the security group ID is system-generated.)
     *
     * If this parameter is not specified, DAX assigns the default VPC security group to each node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * Represents the settings used to enable server-side encryption on the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-ssespecification
     */
    public sseSpecification: CfnCluster.SSESpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The name of the subnet group to be used for the replication group.
     *
     * > DAX clusters can only run in an Amazon VPC environment. All of the subnets that you specify in a subnet group must exist in the same VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-subnetgroupname
     */
    public subnetGroupName: string | undefined;

    /**
     * A set of tags to associate with the DAX cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DAX::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
        super(scope, id, { type: CfnCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'iamRoleArn', this);
        cdk.requireProperty(props, 'nodeType', this);
        cdk.requireProperty(props, 'replicationFactor', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrClusterDiscoveryEndpoint = cdk.Token.asString(this.getAtt('ClusterDiscoveryEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrClusterDiscoveryEndpointUrl = cdk.Token.asString(this.getAtt('ClusterDiscoveryEndpointURL', cdk.ResolutionTypeHint.STRING));

        this.iamRoleArn = props.iamRoleArn;
        this.nodeType = props.nodeType;
        this.replicationFactor = props.replicationFactor;
        this.availabilityZones = props.availabilityZones;
        this.clusterEndpointEncryptionType = props.clusterEndpointEncryptionType;
        this.clusterName = props.clusterName;
        this.description = props.description;
        this.notificationTopicArn = props.notificationTopicArn;
        this.parameterGroupName = props.parameterGroupName;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.securityGroupIds = props.securityGroupIds;
        this.sseSpecification = props.sseSpecification;
        this.subnetGroupName = props.subnetGroupName;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::DAX::Cluster", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            iamRoleArn: this.iamRoleArn,
            nodeType: this.nodeType,
            replicationFactor: this.replicationFactor,
            availabilityZones: this.availabilityZones,
            clusterEndpointEncryptionType: this.clusterEndpointEncryptionType,
            clusterName: this.clusterName,
            description: this.description,
            notificationTopicArn: this.notificationTopicArn,
            parameterGroupName: this.parameterGroupName,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            securityGroupIds: this.securityGroupIds,
            sseSpecification: this.sseSpecification,
            subnetGroupName: this.subnetGroupName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnClusterPropsToCloudFormation(props);
    }
}

export namespace CfnCluster {
    /**
     * Represents the settings used to enable server-side encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dax-cluster-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * Indicates whether server-side encryption is enabled (true) or disabled (false) on the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dax-cluster-ssespecification.html#cfn-dax-cluster-ssespecification-sseenabled
         */
        readonly sseEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_SSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.validateBoolean)(properties.sseEnabled));
    return errors.wrap('supplied properties not correct for "SSESpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DAX::Cluster.SSESpecification` resource
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DAX::Cluster.SSESpecification` resource.
 */
// @ts-ignore TS6133
function cfnClusterSSESpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
    };
}

// @ts-ignore TS6133
function CfnClusterSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.SSESpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SSESpecificationProperty>();
    ret.addPropertyResult('sseEnabled', 'SSEEnabled', properties.SSEEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnParameterGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html
 */
export interface CfnParameterGroupProps {

    /**
     * A description of the parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-description
     */
    readonly description?: string;

    /**
     * The name of the parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parametergroupname
     */
    readonly parameterGroupName?: string;

    /**
     * An array of name-value pairs for the parameters in the group. Each element in the array represents a single parameter.
     *
     * > `record-ttl-millis` and `query-ttl-millis` are the only supported parameter names. For more details, see [Configuring TTL Settings](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.cluster-management.html#DAX.cluster-management.custom-settings.ttl) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parameternamevalues
     */
    readonly parameterNameValues?: any | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('parameterGroupName', cdk.validateString)(properties.parameterGroupName));
    errors.collect(cdk.propertyValidator('parameterNameValues', cdk.validateObject)(properties.parameterNameValues));
    return errors.wrap('supplied properties not correct for "CfnParameterGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DAX::ParameterGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnParameterGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DAX::ParameterGroup` resource.
 */
// @ts-ignore TS6133
function cfnParameterGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnParameterGroupPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        ParameterGroupName: cdk.stringToCloudFormation(properties.parameterGroupName),
        ParameterNameValues: cdk.objectToCloudFormation(properties.parameterNameValues),
    };
}

// @ts-ignore TS6133
function CfnParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnParameterGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnParameterGroupProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('parameterGroupName', 'ParameterGroupName', properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined);
    ret.addPropertyResult('parameterNameValues', 'ParameterNameValues', properties.ParameterNameValues != null ? cfn_parse.FromCloudFormation.getAny(properties.ParameterNameValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DAX::ParameterGroup`
 *
 * A named set of parameters that are applied to all of the nodes in a DAX cluster.
 *
 * @cloudformationResource AWS::DAX::ParameterGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html
 */
export class CfnParameterGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DAX::ParameterGroup";

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
     * A description of the parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-description
     */
    public description: string | undefined;

    /**
     * The name of the parameter group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parametergroupname
     */
    public parameterGroupName: string | undefined;

    /**
     * An array of name-value pairs for the parameters in the group. Each element in the array represents a single parameter.
     *
     * > `record-ttl-millis` and `query-ttl-millis` are the only supported parameter names. For more details, see [Configuring TTL Settings](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.cluster-management.html#DAX.cluster-management.custom-settings.ttl) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parameternamevalues
     */
    public parameterNameValues: any | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::DAX::ParameterGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnParameterGroupProps = {}) {
        super(scope, id, { type: CfnParameterGroup.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.description = props.description;
        this.parameterGroupName = props.parameterGroupName;
        this.parameterNameValues = props.parameterNameValues;
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
            description: this.description,
            parameterGroupName: this.parameterGroupName,
            parameterNameValues: this.parameterNameValues,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnParameterGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSubnetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html
 */
export interface CfnSubnetGroupProps {

    /**
     * A list of VPC subnet IDs for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The description of the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-description
     */
    readonly description?: string;

    /**
     * The name of the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetgroupname
     */
    readonly subnetGroupName?: string;
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
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('subnetGroupName', cdk.validateString)(properties.subnetGroupName));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "CfnSubnetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DAX::SubnetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnSubnetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DAX::SubnetGroup` resource.
 */
// @ts-ignore TS6133
function cfnSubnetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSubnetGroupPropsValidator(properties).assertSuccess();
    return {
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        Description: cdk.stringToCloudFormation(properties.description),
        SubnetGroupName: cdk.stringToCloudFormation(properties.subnetGroupName),
    };
}

// @ts-ignore TS6133
function CfnSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubnetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubnetGroupProps>();
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('subnetGroupName', 'SubnetGroupName', properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DAX::SubnetGroup`
 *
 * Creates a new subnet group.
 *
 * @cloudformationResource AWS::DAX::SubnetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html
 */
export class CfnSubnetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DAX::SubnetGroup";

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
     * A list of VPC subnet IDs for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetids
     */
    public subnetIds: string[];

    /**
     * The description of the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-description
     */
    public description: string | undefined;

    /**
     * The name of the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetgroupname
     */
    public subnetGroupName: string | undefined;

    /**
     * Create a new `AWS::DAX::SubnetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSubnetGroupProps) {
        super(scope, id, { type: CfnSubnetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'subnetIds', this);

        this.subnetIds = props.subnetIds;
        this.description = props.description;
        this.subnetGroupName = props.subnetGroupName;
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
            subnetIds: this.subnetIds,
            description: this.description,
            subnetGroupName: this.subnetGroupName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSubnetGroupPropsToCloudFormation(props);
    }
}
