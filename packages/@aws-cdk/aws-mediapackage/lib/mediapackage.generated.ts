// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:18.655Z","fingerprint":"74NseLybfAx/sFRl4g096k64zQAMp+MkmXVS7VqexDg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAsset`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html
 */
export interface CfnAssetProps {

    /**
     * Unique identifier that you assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-id
     */
    readonly id: string;

    /**
     * The ID of the packaging group associated with this asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-packaginggroupid
     */
    readonly packagingGroupId: string;

    /**
     * The ARN for the source content in Amazon S3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcearn
     */
    readonly sourceArn: string;

    /**
     * The ARN for the IAM role that provides AWS Elemental MediaPackage access to the Amazon S3 bucket where the source content is stored. Valid format: arn:aws:iam::{accountID}:role/{name}
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcerolearn
     */
    readonly sourceRoleArn: string;

    /**
     * Unique identifier for this asset, as it's configured in the key provider service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-resourceid
     */
    readonly resourceId?: string;

    /**
     * The tags to assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the result of the validation.
 */
function CfnAssetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('packagingGroupId', cdk.requiredValidator)(properties.packagingGroupId));
    errors.collect(cdk.propertyValidator('packagingGroupId', cdk.validateString)(properties.packagingGroupId));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.requiredValidator)(properties.sourceArn));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.validateString)(properties.sourceArn));
    errors.collect(cdk.propertyValidator('sourceRoleArn', cdk.requiredValidator)(properties.sourceRoleArn));
    errors.collect(cdk.propertyValidator('sourceRoleArn', cdk.validateString)(properties.sourceRoleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAssetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Asset` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Asset` resource.
 */
// @ts-ignore TS6133
function cfnAssetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetPropsValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        PackagingGroupId: cdk.stringToCloudFormation(properties.packagingGroupId),
        SourceArn: cdk.stringToCloudFormation(properties.sourceArn),
        SourceRoleArn: cdk.stringToCloudFormation(properties.sourceRoleArn),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetProps>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('packagingGroupId', 'PackagingGroupId', cfn_parse.FromCloudFormation.getString(properties.PackagingGroupId));
    ret.addPropertyResult('sourceArn', 'SourceArn', cfn_parse.FromCloudFormation.getString(properties.SourceArn));
    ret.addPropertyResult('sourceRoleArn', 'SourceRoleArn', cfn_parse.FromCloudFormation.getString(properties.SourceRoleArn));
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaPackage::Asset`
 *
 * Creates an asset to ingest VOD content.
 *
 * After it's created, the asset starts ingesting content and generates playback URLs for the packaging configurations associated with it. When ingest is complete, downstream devices use the appropriate URL to request VOD content from AWS Elemental MediaPackage .
 *
 * @cloudformationResource AWS::MediaPackage::Asset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html
 */
export class CfnAsset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::Asset";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAsset {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAsset(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the asset. You can get this from the response to any request to the asset.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time that the asset was initially submitted for ingest.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     *
     * @cloudformationAttribute EgressEndpoints
     */
    public readonly attrEgressEndpoints: cdk.IResolvable;

    /**
     * Unique identifier that you assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-id
     */
    public id: string;

    /**
     * The ID of the packaging group associated with this asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-packaginggroupid
     */
    public packagingGroupId: string;

    /**
     * The ARN for the source content in Amazon S3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcearn
     */
    public sourceArn: string;

    /**
     * The ARN for the IAM role that provides AWS Elemental MediaPackage access to the Amazon S3 bucket where the source content is stored. Valid format: arn:aws:iam::{accountID}:role/{name}
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcerolearn
     */
    public sourceRoleArn: string;

    /**
     * Unique identifier for this asset, as it's configured in the key provider service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-resourceid
     */
    public resourceId: string | undefined;

    /**
     * The tags to assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::MediaPackage::Asset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssetProps) {
        super(scope, id, { type: CfnAsset.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'id', this);
        cdk.requireProperty(props, 'packagingGroupId', this);
        cdk.requireProperty(props, 'sourceArn', this);
        cdk.requireProperty(props, 'sourceRoleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEgressEndpoints = this.getAtt('EgressEndpoints', cdk.ResolutionTypeHint.STRING);

        this.id = props.id;
        this.packagingGroupId = props.packagingGroupId;
        this.sourceArn = props.sourceArn;
        this.sourceRoleArn = props.sourceRoleArn;
        this.resourceId = props.resourceId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::Asset", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAsset.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            id: this.id,
            packagingGroupId: this.packagingGroupId,
            sourceArn: this.sourceArn,
            sourceRoleArn: this.sourceRoleArn,
            resourceId: this.resourceId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssetPropsToCloudFormation(props);
    }
}

export namespace CfnAsset {
    /**
     * The playback endpoint for a packaging configuration on an asset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html
     */
    export interface EgressEndpointProperty {
        /**
         * The ID of a packaging configuration that's applied to this asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html#cfn-mediapackage-asset-egressendpoint-packagingconfigurationid
         */
        readonly packagingConfigurationId: string;
        /**
         * The URL that's used to request content from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html#cfn-mediapackage-asset-egressendpoint-url
         */
        readonly url: string;
    }
}

/**
 * Determine whether the given properties match those of a `EgressEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EgressEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnAsset_EgressEndpointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('packagingConfigurationId', cdk.requiredValidator)(properties.packagingConfigurationId));
    errors.collect(cdk.propertyValidator('packagingConfigurationId', cdk.validateString)(properties.packagingConfigurationId));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "EgressEndpointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Asset.EgressEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `EgressEndpointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Asset.EgressEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnAssetEgressEndpointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAsset_EgressEndpointPropertyValidator(properties).assertSuccess();
    return {
        PackagingConfigurationId: cdk.stringToCloudFormation(properties.packagingConfigurationId),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnAssetEgressEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.EgressEndpointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.EgressEndpointProperty>();
    ret.addPropertyResult('packagingConfigurationId', 'PackagingConfigurationId', cfn_parse.FromCloudFormation.getString(properties.PackagingConfigurationId));
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html
 */
export interface CfnChannelProps {

    /**
     * Unique identifier that you assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-id
     */
    readonly id: string;

    /**
     * Any descriptive information that you want to add to the channel for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-description
     */
    readonly description?: string;

    /**
     * Configures egress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-egressaccesslogs
     */
    readonly egressAccessLogs?: CfnChannel.LogConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::MediaPackage::Channel.HlsIngest`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-hlsingest
     */
    readonly hlsIngest?: CfnChannel.HlsIngestProperty | cdk.IResolvable;

    /**
     * Configures ingress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-ingressaccesslogs
     */
    readonly ingressAccessLogs?: CfnChannel.LogConfigurationProperty | cdk.IResolvable;

    /**
     * The tags to assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('egressAccessLogs', CfnChannel_LogConfigurationPropertyValidator)(properties.egressAccessLogs));
    errors.collect(cdk.propertyValidator('hlsIngest', CfnChannel_HlsIngestPropertyValidator)(properties.hlsIngest));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('ingressAccessLogs', CfnChannel_LogConfigurationPropertyValidator)(properties.ingressAccessLogs));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Channel` resource
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Channel` resource.
 */
// @ts-ignore TS6133
function cfnChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannelPropsValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Description: cdk.stringToCloudFormation(properties.description),
        EgressAccessLogs: cfnChannelLogConfigurationPropertyToCloudFormation(properties.egressAccessLogs),
        HlsIngest: cfnChannelHlsIngestPropertyToCloudFormation(properties.hlsIngest),
        IngressAccessLogs: cfnChannelLogConfigurationPropertyToCloudFormation(properties.ingressAccessLogs),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelProps>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('egressAccessLogs', 'EgressAccessLogs', properties.EgressAccessLogs != null ? CfnChannelLogConfigurationPropertyFromCloudFormation(properties.EgressAccessLogs) : undefined);
    ret.addPropertyResult('hlsIngest', 'HlsIngest', properties.HlsIngest != null ? CfnChannelHlsIngestPropertyFromCloudFormation(properties.HlsIngest) : undefined);
    ret.addPropertyResult('ingressAccessLogs', 'IngressAccessLogs', properties.IngressAccessLogs != null ? CfnChannelLogConfigurationPropertyFromCloudFormation(properties.IngressAccessLogs) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaPackage::Channel`
 *
 * Creates a channel to receive content.
 *
 * After it's created, a channel provides static input URLs. These URLs remain the same throughout the lifetime of the channel, regardless of any failures or upgrades that might occur. Use these URLs to configure the outputs of your upstream encoder.
 *
 * @cloudformationResource AWS::MediaPackage::Channel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::Channel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The channel's unique system-generated resource name, based on the AWS record.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Unique identifier that you assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-id
     */
    public id: string;

    /**
     * Any descriptive information that you want to add to the channel for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-description
     */
    public description: string | undefined;

    /**
     * Configures egress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-egressaccesslogs
     */
    public egressAccessLogs: CfnChannel.LogConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::MediaPackage::Channel.HlsIngest`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-hlsingest
     */
    public hlsIngest: CfnChannel.HlsIngestProperty | cdk.IResolvable | undefined;

    /**
     * Configures ingress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-ingressaccesslogs
     */
    public ingressAccessLogs: CfnChannel.LogConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags to assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::MediaPackage::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnChannelProps) {
        super(scope, id, { type: CfnChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'id', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.id = props.id;
        this.description = props.description;
        this.egressAccessLogs = props.egressAccessLogs;
        this.hlsIngest = props.hlsIngest;
        this.ingressAccessLogs = props.ingressAccessLogs;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::Channel", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            id: this.id,
            description: this.description,
            egressAccessLogs: this.egressAccessLogs,
            hlsIngest: this.hlsIngest,
            ingressAccessLogs: this.ingressAccessLogs,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnChannelPropsToCloudFormation(props);
    }
}

export namespace CfnChannel {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html
     */
    export interface HlsIngestProperty {
        /**
         * `CfnChannel.HlsIngestProperty.ingestEndpoints`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html#cfn-mediapackage-channel-hlsingest-ingestendpoints
         */
        readonly ingestEndpoints?: Array<CfnChannel.IngestEndpointProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsIngestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsIngestProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsIngestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ingestEndpoints', cdk.listValidator(CfnChannel_IngestEndpointPropertyValidator))(properties.ingestEndpoints));
    return errors.wrap('supplied properties not correct for "HlsIngestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.HlsIngest` resource
 *
 * @param properties - the TypeScript properties of a `HlsIngestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.HlsIngest` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsIngestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsIngestPropertyValidator(properties).assertSuccess();
    return {
        ingestEndpoints: cdk.listMapper(cfnChannelIngestEndpointPropertyToCloudFormation)(properties.ingestEndpoints),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsIngestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsIngestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsIngestProperty>();
    ret.addPropertyResult('ingestEndpoints', 'ingestEndpoints', properties.ingestEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelIngestEndpointPropertyFromCloudFormation)(properties.ingestEndpoints) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html
     */
    export interface IngestEndpointProperty {
        /**
         * `CfnChannel.IngestEndpointProperty.Id`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-id
         */
        readonly id: string;
        /**
         * `CfnChannel.IngestEndpointProperty.Password`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-password
         */
        readonly password: string;
        /**
         * `CfnChannel.IngestEndpointProperty.Url`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-url
         */
        readonly url: string;
        /**
         * `CfnChannel.IngestEndpointProperty.Username`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-username
         */
        readonly username: string;
    }
}

/**
 * Determine whether the given properties match those of a `IngestEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `IngestEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_IngestEndpointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('password', cdk.requiredValidator)(properties.password));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('username', cdk.requiredValidator)(properties.username));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "IngestEndpointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.IngestEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `IngestEndpointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.IngestEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnChannelIngestEndpointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_IngestEndpointPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Password: cdk.stringToCloudFormation(properties.password),
        Url: cdk.stringToCloudFormation(properties.url),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnChannelIngestEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.IngestEndpointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.IngestEndpointProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('password', 'Password', cfn_parse.FromCloudFormation.getString(properties.Password));
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addPropertyResult('username', 'Username', cfn_parse.FromCloudFormation.getString(properties.Username));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The access log configuration parameters for your channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html
     */
    export interface LogConfigurationProperty {
        /**
         * Sets a custom Amazon CloudWatch log group name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html#cfn-mediapackage-channel-logconfiguration-loggroupname
         */
        readonly logGroupName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_LogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    return errors.wrap('supplied properties not correct for "LogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.LogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::Channel.LogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnChannelLogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_LogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
    };
}

// @ts-ignore TS6133
function CfnChannelLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.LogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.LogConfigurationProperty>();
    ret.addPropertyResult('logGroupName', 'LogGroupName', properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnOriginEndpoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html
 */
export interface CfnOriginEndpointProps {

    /**
     * The ID of the channel associated with this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-channelid
     */
    readonly channelId: string;

    /**
     * The manifest ID is required and must be unique within the OriginEndpoint. The ID can't be changed after the endpoint is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-id
     */
    readonly id: string;

    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-authorization
     */
    readonly authorization?: CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable;

    /**
     * Parameters for Common Media Application Format (CMAF) packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-cmafpackage
     */
    readonly cmafPackage?: CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable;

    /**
     * Parameters for DASH packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-dashpackage
     */
    readonly dashPackage?: CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable;

    /**
     * Any descriptive information that you want to add to the endpoint for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-description
     */
    readonly description?: string;

    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-hlspackage
     */
    readonly hlsPackage?: CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable;

    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-manifestname
     */
    readonly manifestName?: string;

    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-msspackage
     */
    readonly mssPackage?: CfnOriginEndpoint.MssPackageProperty | cdk.IResolvable;

    /**
     * Controls video origination from this endpoint.
     *
     * Valid values:
     *
     * - `ALLOW` - enables this endpoint to serve content to requesting devices.
     * - `DENY` - prevents this endpoint from serving content. Denying origination is helpful for harvesting live-to-VOD assets. For more information about harvesting and origination, see [Live-to-VOD Requirements](https://docs.aws.amazon.com/mediapackage/latest/ug/ltov-reqmts.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-origination
     */
    readonly origination?: string;

    /**
     * Maximum duration (seconds) of content to retain for startover playback. Omit this attribute or enter `0` to indicate that startover playback is disabled for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-startoverwindowseconds
     */
    readonly startoverWindowSeconds?: number;

    /**
     * The tags to assign to the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Minimum duration (seconds) of delay to enforce on the playback of live content. Omit this attribute or enter `0` to indicate that there is no time delay in effect for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-timedelayseconds
     */
    readonly timeDelaySeconds?: number;

    /**
     * The IP addresses that can access this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-whitelist
     */
    readonly whitelist?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnOriginEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginEndpointProps`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorization', CfnOriginEndpoint_AuthorizationPropertyValidator)(properties.authorization));
    errors.collect(cdk.propertyValidator('channelId', cdk.requiredValidator)(properties.channelId));
    errors.collect(cdk.propertyValidator('channelId', cdk.validateString)(properties.channelId));
    errors.collect(cdk.propertyValidator('cmafPackage', CfnOriginEndpoint_CmafPackagePropertyValidator)(properties.cmafPackage));
    errors.collect(cdk.propertyValidator('dashPackage', CfnOriginEndpoint_DashPackagePropertyValidator)(properties.dashPackage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('hlsPackage', CfnOriginEndpoint_HlsPackagePropertyValidator)(properties.hlsPackage));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('manifestName', cdk.validateString)(properties.manifestName));
    errors.collect(cdk.propertyValidator('mssPackage', CfnOriginEndpoint_MssPackagePropertyValidator)(properties.mssPackage));
    errors.collect(cdk.propertyValidator('origination', cdk.validateString)(properties.origination));
    errors.collect(cdk.propertyValidator('startoverWindowSeconds', cdk.validateNumber)(properties.startoverWindowSeconds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('timeDelaySeconds', cdk.validateNumber)(properties.timeDelaySeconds));
    errors.collect(cdk.propertyValidator('whitelist', cdk.listValidator(cdk.validateString))(properties.whitelist));
    return errors.wrap('supplied properties not correct for "CfnOriginEndpointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnOriginEndpointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpointPropsValidator(properties).assertSuccess();
    return {
        ChannelId: cdk.stringToCloudFormation(properties.channelId),
        Id: cdk.stringToCloudFormation(properties.id),
        Authorization: cfnOriginEndpointAuthorizationPropertyToCloudFormation(properties.authorization),
        CmafPackage: cfnOriginEndpointCmafPackagePropertyToCloudFormation(properties.cmafPackage),
        DashPackage: cfnOriginEndpointDashPackagePropertyToCloudFormation(properties.dashPackage),
        Description: cdk.stringToCloudFormation(properties.description),
        HlsPackage: cfnOriginEndpointHlsPackagePropertyToCloudFormation(properties.hlsPackage),
        ManifestName: cdk.stringToCloudFormation(properties.manifestName),
        MssPackage: cfnOriginEndpointMssPackagePropertyToCloudFormation(properties.mssPackage),
        Origination: cdk.stringToCloudFormation(properties.origination),
        StartoverWindowSeconds: cdk.numberToCloudFormation(properties.startoverWindowSeconds),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TimeDelaySeconds: cdk.numberToCloudFormation(properties.timeDelaySeconds),
        Whitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.whitelist),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpointProps>();
    ret.addPropertyResult('channelId', 'ChannelId', cfn_parse.FromCloudFormation.getString(properties.ChannelId));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('authorization', 'Authorization', properties.Authorization != null ? CfnOriginEndpointAuthorizationPropertyFromCloudFormation(properties.Authorization) : undefined);
    ret.addPropertyResult('cmafPackage', 'CmafPackage', properties.CmafPackage != null ? CfnOriginEndpointCmafPackagePropertyFromCloudFormation(properties.CmafPackage) : undefined);
    ret.addPropertyResult('dashPackage', 'DashPackage', properties.DashPackage != null ? CfnOriginEndpointDashPackagePropertyFromCloudFormation(properties.DashPackage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('hlsPackage', 'HlsPackage', properties.HlsPackage != null ? CfnOriginEndpointHlsPackagePropertyFromCloudFormation(properties.HlsPackage) : undefined);
    ret.addPropertyResult('manifestName', 'ManifestName', properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined);
    ret.addPropertyResult('mssPackage', 'MssPackage', properties.MssPackage != null ? CfnOriginEndpointMssPackagePropertyFromCloudFormation(properties.MssPackage) : undefined);
    ret.addPropertyResult('origination', 'Origination', properties.Origination != null ? cfn_parse.FromCloudFormation.getString(properties.Origination) : undefined);
    ret.addPropertyResult('startoverWindowSeconds', 'StartoverWindowSeconds', properties.StartoverWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartoverWindowSeconds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('timeDelaySeconds', 'TimeDelaySeconds', properties.TimeDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeDelaySeconds) : undefined);
    ret.addPropertyResult('whitelist', 'Whitelist', properties.Whitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Whitelist) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaPackage::OriginEndpoint`
 *
 * Create an endpoint on an AWS Elemental MediaPackage channel.
 *
 * An endpoint represents a single delivery point of a channel, and defines content output handling through various components, such as packaging protocols, DRM and encryption integration, and more.
 *
 * After it's created, an endpoint provides a fixed public URL. This URL remains the same throughout the lifetime of the endpoint, regardless of any failures or upgrades that might occur. Integrate the URL with a downstream CDN (such as Amazon CloudFront) or playback device.
 *
 * @cloudformationResource AWS::MediaPackage::OriginEndpoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html
 */
export class CfnOriginEndpoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::OriginEndpoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginEndpoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOriginEndpointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnOriginEndpoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The endpoint's unique system-generated resource name, based on the AWS record.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * URL for the key provider’s key retrieval API endpoint. Must start with https://.
     * @cloudformationAttribute Url
     */
    public readonly attrUrl: string;

    /**
     * The ID of the channel associated with this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-channelid
     */
    public channelId: string;

    /**
     * The manifest ID is required and must be unique within the OriginEndpoint. The ID can't be changed after the endpoint is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-id
     */
    public id: string;

    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-authorization
     */
    public authorization: CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable | undefined;

    /**
     * Parameters for Common Media Application Format (CMAF) packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-cmafpackage
     */
    public cmafPackage: CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable | undefined;

    /**
     * Parameters for DASH packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-dashpackage
     */
    public dashPackage: CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable | undefined;

    /**
     * Any descriptive information that you want to add to the endpoint for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-description
     */
    public description: string | undefined;

    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-hlspackage
     */
    public hlsPackage: CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable | undefined;

    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-manifestname
     */
    public manifestName: string | undefined;

    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-msspackage
     */
    public mssPackage: CfnOriginEndpoint.MssPackageProperty | cdk.IResolvable | undefined;

    /**
     * Controls video origination from this endpoint.
     *
     * Valid values:
     *
     * - `ALLOW` - enables this endpoint to serve content to requesting devices.
     * - `DENY` - prevents this endpoint from serving content. Denying origination is helpful for harvesting live-to-VOD assets. For more information about harvesting and origination, see [Live-to-VOD Requirements](https://docs.aws.amazon.com/mediapackage/latest/ug/ltov-reqmts.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-origination
     */
    public origination: string | undefined;

    /**
     * Maximum duration (seconds) of content to retain for startover playback. Omit this attribute or enter `0` to indicate that startover playback is disabled for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-startoverwindowseconds
     */
    public startoverWindowSeconds: number | undefined;

    /**
     * The tags to assign to the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Minimum duration (seconds) of delay to enforce on the playback of live content. Omit this attribute or enter `0` to indicate that there is no time delay in effect for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-timedelayseconds
     */
    public timeDelaySeconds: number | undefined;

    /**
     * The IP addresses that can access this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-whitelist
     */
    public whitelist: string[] | undefined;

    /**
     * Create a new `AWS::MediaPackage::OriginEndpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginEndpointProps) {
        super(scope, id, { type: CfnOriginEndpoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'channelId', this);
        cdk.requireProperty(props, 'id', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrUrl = cdk.Token.asString(this.getAtt('Url', cdk.ResolutionTypeHint.STRING));

        this.channelId = props.channelId;
        this.id = props.id;
        this.authorization = props.authorization;
        this.cmafPackage = props.cmafPackage;
        this.dashPackage = props.dashPackage;
        this.description = props.description;
        this.hlsPackage = props.hlsPackage;
        this.manifestName = props.manifestName;
        this.mssPackage = props.mssPackage;
        this.origination = props.origination;
        this.startoverWindowSeconds = props.startoverWindowSeconds;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::OriginEndpoint", props.tags, { tagPropertyName: 'tags' });
        this.timeDelaySeconds = props.timeDelaySeconds;
        this.whitelist = props.whitelist;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginEndpoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            channelId: this.channelId,
            id: this.id,
            authorization: this.authorization,
            cmafPackage: this.cmafPackage,
            dashPackage: this.dashPackage,
            description: this.description,
            hlsPackage: this.hlsPackage,
            manifestName: this.manifestName,
            mssPackage: this.mssPackage,
            origination: this.origination,
            startoverWindowSeconds: this.startoverWindowSeconds,
            tags: this.tags.renderTags(),
            timeDelaySeconds: this.timeDelaySeconds,
            whitelist: this.whitelist,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOriginEndpointPropsToCloudFormation(props);
    }
}

export namespace CfnOriginEndpoint {
    /**
     * Parameters for enabling CDN authorization on the endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html
     */
    export interface AuthorizationProperty {
        /**
         * The Amazon Resource Name (ARN) for the secret in AWS Secrets Manager that your Content Delivery Network (CDN) uses for authorization to access your endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html#cfn-mediapackage-originendpoint-authorization-cdnidentifiersecret
         */
        readonly cdnIdentifierSecret: string;
        /**
         * The Amazon Resource Name (ARN) for the IAM role that allows AWS Elemental MediaPackage to communicate with AWS Secrets Manager .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html#cfn-mediapackage-originendpoint-authorization-secretsrolearn
         */
        readonly secretsRoleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_AuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cdnIdentifierSecret', cdk.requiredValidator)(properties.cdnIdentifierSecret));
    errors.collect(cdk.propertyValidator('cdnIdentifierSecret', cdk.validateString)(properties.cdnIdentifierSecret));
    errors.collect(cdk.propertyValidator('secretsRoleArn', cdk.requiredValidator)(properties.secretsRoleArn));
    errors.collect(cdk.propertyValidator('secretsRoleArn', cdk.validateString)(properties.secretsRoleArn));
    return errors.wrap('supplied properties not correct for "AuthorizationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.Authorization` resource
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.Authorization` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointAuthorizationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_AuthorizationPropertyValidator(properties).assertSuccess();
    return {
        CdnIdentifierSecret: cdk.stringToCloudFormation(properties.cdnIdentifierSecret),
        SecretsRoleArn: cdk.stringToCloudFormation(properties.secretsRoleArn),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointAuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.AuthorizationProperty>();
    ret.addPropertyResult('cdnIdentifierSecret', 'CdnIdentifierSecret', cfn_parse.FromCloudFormation.getString(properties.CdnIdentifierSecret));
    ret.addPropertyResult('secretsRoleArn', 'SecretsRoleArn', cfn_parse.FromCloudFormation.getString(properties.SecretsRoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html
     */
    export interface CmafEncryptionProperty {
        /**
         * An optional 128-bit, 16-byte hex value represented by a 32-character string, used in conjunction with the key for encrypting blocks. If you don't specify a value, then AWS Elemental MediaPackage creates the constant initialization vector (IV).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * `CfnOriginEndpoint.CmafEncryptionProperty.EncryptionMethod`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-encryptionmethod
         */
        readonly encryptionMethod?: string;
        /**
         * Number of seconds before AWS Elemental MediaPackage rotates to a new key. By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-keyrotationintervalseconds
         */
        readonly keyRotationIntervalSeconds?: number;
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CmafEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_CmafEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('encryptionMethod', cdk.validateString)(properties.encryptionMethod));
    errors.collect(cdk.propertyValidator('keyRotationIntervalSeconds', cdk.validateNumber)(properties.keyRotationIntervalSeconds));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnOriginEndpoint_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "CmafEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.CmafEncryption` resource
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.CmafEncryption` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointCmafEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_CmafEncryptionPropertyValidator(properties).assertSuccess();
    return {
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        EncryptionMethod: cdk.stringToCloudFormation(properties.encryptionMethod),
        KeyRotationIntervalSeconds: cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
        SpekeKeyProvider: cfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointCmafEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.CmafEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.CmafEncryptionProperty>();
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('encryptionMethod', 'EncryptionMethod', properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined);
    ret.addPropertyResult('keyRotationIntervalSeconds', 'KeyRotationIntervalSeconds', properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined);
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Parameters for Common Media Application Format (CMAF) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html
     */
    export interface CmafPackageProperty {
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-encryption
         */
        readonly encryption?: CfnOriginEndpoint.CmafEncryptionProperty | cdk.IResolvable;
        /**
         * A list of HLS manifest configurations that are available from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-hlsmanifests
         */
        readonly hlsManifests?: Array<CfnOriginEndpoint.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Duration (in seconds) of each segment. Actual segments are rounded to the nearest multiple of the source segment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * An optional custom string that is prepended to the name of each segment. If not specified, the segment prefix defaults to the ChannelId.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-segmentprefix
         */
        readonly segmentPrefix?: string;
        /**
         * Limitations for outputs from the endpoint, based on the video bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-streamselection
         */
        readonly streamSelection?: CfnOriginEndpoint.StreamSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CmafPackageProperty`
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_CmafPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryption', CfnOriginEndpoint_CmafEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('hlsManifests', cdk.listValidator(CfnOriginEndpoint_HlsManifestPropertyValidator))(properties.hlsManifests));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('segmentPrefix', cdk.validateString)(properties.segmentPrefix));
    errors.collect(cdk.propertyValidator('streamSelection', CfnOriginEndpoint_StreamSelectionPropertyValidator)(properties.streamSelection));
    return errors.wrap('supplied properties not correct for "CmafPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.CmafPackage` resource
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.CmafPackage` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointCmafPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_CmafPackagePropertyValidator(properties).assertSuccess();
    return {
        Encryption: cfnOriginEndpointCmafEncryptionPropertyToCloudFormation(properties.encryption),
        HlsManifests: cdk.listMapper(cfnOriginEndpointHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        SegmentPrefix: cdk.stringToCloudFormation(properties.segmentPrefix),
        StreamSelection: cfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointCmafPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.CmafPackageProperty>();
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnOriginEndpointCmafEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('hlsManifests', 'HlsManifests', properties.HlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnOriginEndpointHlsManifestPropertyFromCloudFormation)(properties.HlsManifests) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('segmentPrefix', 'SegmentPrefix', properties.SegmentPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentPrefix) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html
     */
    export interface DashEncryptionProperty {
        /**
         * Number of seconds before AWS Elemental MediaPackage rotates to a new key. By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html#cfn-mediapackage-originendpoint-dashencryption-keyrotationintervalseconds
         */
        readonly keyRotationIntervalSeconds?: number;
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html#cfn-mediapackage-originendpoint-dashencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_DashEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyRotationIntervalSeconds', cdk.validateNumber)(properties.keyRotationIntervalSeconds));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnOriginEndpoint_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "DashEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.DashEncryption` resource
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.DashEncryption` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointDashEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_DashEncryptionPropertyValidator(properties).assertSuccess();
    return {
        KeyRotationIntervalSeconds: cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
        SpekeKeyProvider: cfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointDashEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.DashEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.DashEncryptionProperty>();
    ret.addPropertyResult('keyRotationIntervalSeconds', 'KeyRotationIntervalSeconds', properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined);
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Parameters for DASH packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html
     */
    export interface DashPackageProperty {
        /**
         * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
         *
         * Valid values:
         *
         * - `BREAK`
         * - `DISTRIBUTOR_ADVERTISEMENT`
         * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY` .
         * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY` .
         * - `PROVIDER_ADVERTISEMENT` .
         * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY` .
         * - `PROVIDER_PLACEMENT_OPPORTUNITY` .
         * - `SPLICE_INSERT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-adtriggers
         */
        readonly adTriggers?: string[];
        /**
         * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest. For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-adsondeliveryrestrictions
         */
        readonly adsOnDeliveryRestrictions?: string;
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-encryption
         */
        readonly encryption?: CfnOriginEndpoint.DashEncryptionProperty | cdk.IResolvable;
        /**
         * This applies only to stream sets with a single video track. When true, the stream set includes an additional I-frame trick-play only stream, along with the other tracks. If false, this extra stream is not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-includeiframeonlystream
         */
        readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;
        /**
         * Determines the position of some tags in the manifest.
         *
         * Valid values:
         *
         * - `FULL` - Elements like `SegmentTemplate` and `ContentProtection` are included in each `Representation` .
         * - `COMPACT` - Duplicate elements are combined and presented at the `AdaptationSet` level.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-manifestlayout
         */
        readonly manifestLayout?: string;
        /**
         * Time window (in seconds) contained in each manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-manifestwindowseconds
         */
        readonly manifestWindowSeconds?: number;
        /**
         * Minimum amount of content (measured in seconds) that a player must keep available in the buffer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-minbuffertimeseconds
         */
        readonly minBufferTimeSeconds?: number;
        /**
         * Minimum amount of time (in seconds) that the player should wait before requesting updates to the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-minupdateperiodseconds
         */
        readonly minUpdatePeriodSeconds?: number;
        /**
         * Controls whether AWS Elemental MediaPackage produces single-period or multi-period DASH manifests. For more information about periods, see [Multi-period DASH in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/multi-period.html) .
         *
         * Valid values:
         *
         * - `ADS` - AWS Elemental MediaPackage will produce multi-period DASH manifests. Periods are created based on the SCTE-35 ad markers present in the input manifest.
         * - *No value* - AWS Elemental MediaPackage will produce single-period DASH manifests. This is the default setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-periodtriggers
         */
        readonly periodTriggers?: string[];
        /**
         * The DASH profile for the output.
         *
         * Valid values:
         *
         * - `NONE` - The output doesn't use a DASH profile.
         * - `HBBTV_1_5` - The output is compliant with HbbTV v1.5.
         * - `DVB_DASH_2014` - The output is compliant with DVB-DASH 2014.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-profile
         */
        readonly profile?: string;
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * Determines the type of variable used in the `media` URL of the `SegmentTemplate` tag in the manifest. Also specifies if segment timeline information is included in `SegmentTimeline` or `SegmentTemplate` .
         *
         * Valid values:
         *
         * - `NUMBER_WITH_TIMELINE` - The `$Number$` variable is used in the `media` URL. The value of this variable is the sequential number of the segment. A full `SegmentTimeline` object is presented in each `SegmentTemplate` .
         * - `NUMBER_WITH_DURATION` - The `$Number$` variable is used in the `media` URL and a `duration` attribute is added to the segment template. The `SegmentTimeline` object is removed from the representation.
         * - `TIME_WITH_TIMELINE` - The `$Time$` variable is used in the `media` URL. The value of this variable is the timestamp of when the segment starts. A full `SegmentTimeline` object is presented in each `SegmentTemplate` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-segmenttemplateformat
         */
        readonly segmentTemplateFormat?: string;
        /**
         * Limitations for outputs from the endpoint, based on the video bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-streamselection
         */
        readonly streamSelection?: CfnOriginEndpoint.StreamSelectionProperty | cdk.IResolvable;
        /**
         * Amount of time (in seconds) that the player should be from the live point at the end of the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-suggestedpresentationdelayseconds
         */
        readonly suggestedPresentationDelaySeconds?: number;
        /**
         * Determines the type of UTC timing included in the DASH Media Presentation Description (MPD).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-utctiming
         */
        readonly utcTiming?: string;
        /**
         * Specifies the value attribute of the UTC timing field when utcTiming is set to HTTP-ISO or HTTP-HEAD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-utctiminguri
         */
        readonly utcTimingUri?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DashPackageProperty`
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_DashPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adTriggers', cdk.listValidator(cdk.validateString))(properties.adTriggers));
    errors.collect(cdk.propertyValidator('adsOnDeliveryRestrictions', cdk.validateString)(properties.adsOnDeliveryRestrictions));
    errors.collect(cdk.propertyValidator('encryption', CfnOriginEndpoint_DashEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('includeIframeOnlyStream', cdk.validateBoolean)(properties.includeIframeOnlyStream));
    errors.collect(cdk.propertyValidator('manifestLayout', cdk.validateString)(properties.manifestLayout));
    errors.collect(cdk.propertyValidator('manifestWindowSeconds', cdk.validateNumber)(properties.manifestWindowSeconds));
    errors.collect(cdk.propertyValidator('minBufferTimeSeconds', cdk.validateNumber)(properties.minBufferTimeSeconds));
    errors.collect(cdk.propertyValidator('minUpdatePeriodSeconds', cdk.validateNumber)(properties.minUpdatePeriodSeconds));
    errors.collect(cdk.propertyValidator('periodTriggers', cdk.listValidator(cdk.validateString))(properties.periodTriggers));
    errors.collect(cdk.propertyValidator('profile', cdk.validateString)(properties.profile));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('segmentTemplateFormat', cdk.validateString)(properties.segmentTemplateFormat));
    errors.collect(cdk.propertyValidator('streamSelection', CfnOriginEndpoint_StreamSelectionPropertyValidator)(properties.streamSelection));
    errors.collect(cdk.propertyValidator('suggestedPresentationDelaySeconds', cdk.validateNumber)(properties.suggestedPresentationDelaySeconds));
    errors.collect(cdk.propertyValidator('utcTiming', cdk.validateString)(properties.utcTiming));
    errors.collect(cdk.propertyValidator('utcTimingUri', cdk.validateString)(properties.utcTimingUri));
    return errors.wrap('supplied properties not correct for "DashPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.DashPackage` resource
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.DashPackage` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointDashPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_DashPackagePropertyValidator(properties).assertSuccess();
    return {
        AdTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
        AdsOnDeliveryRestrictions: cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
        Encryption: cfnOriginEndpointDashEncryptionPropertyToCloudFormation(properties.encryption),
        IncludeIframeOnlyStream: cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
        ManifestLayout: cdk.stringToCloudFormation(properties.manifestLayout),
        ManifestWindowSeconds: cdk.numberToCloudFormation(properties.manifestWindowSeconds),
        MinBufferTimeSeconds: cdk.numberToCloudFormation(properties.minBufferTimeSeconds),
        MinUpdatePeriodSeconds: cdk.numberToCloudFormation(properties.minUpdatePeriodSeconds),
        PeriodTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.periodTriggers),
        Profile: cdk.stringToCloudFormation(properties.profile),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        SegmentTemplateFormat: cdk.stringToCloudFormation(properties.segmentTemplateFormat),
        StreamSelection: cfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
        SuggestedPresentationDelaySeconds: cdk.numberToCloudFormation(properties.suggestedPresentationDelaySeconds),
        UtcTiming: cdk.stringToCloudFormation(properties.utcTiming),
        UtcTimingUri: cdk.stringToCloudFormation(properties.utcTimingUri),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointDashPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.DashPackageProperty>();
    ret.addPropertyResult('adTriggers', 'AdTriggers', properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdTriggers) : undefined);
    ret.addPropertyResult('adsOnDeliveryRestrictions', 'AdsOnDeliveryRestrictions', properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined);
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnOriginEndpointDashEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('includeIframeOnlyStream', 'IncludeIframeOnlyStream', properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined);
    ret.addPropertyResult('manifestLayout', 'ManifestLayout', properties.ManifestLayout != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestLayout) : undefined);
    ret.addPropertyResult('manifestWindowSeconds', 'ManifestWindowSeconds', properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined);
    ret.addPropertyResult('minBufferTimeSeconds', 'MinBufferTimeSeconds', properties.MinBufferTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinBufferTimeSeconds) : undefined);
    ret.addPropertyResult('minUpdatePeriodSeconds', 'MinUpdatePeriodSeconds', properties.MinUpdatePeriodSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinUpdatePeriodSeconds) : undefined);
    ret.addPropertyResult('periodTriggers', 'PeriodTriggers', properties.PeriodTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PeriodTriggers) : undefined);
    ret.addPropertyResult('profile', 'Profile', properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('segmentTemplateFormat', 'SegmentTemplateFormat', properties.SegmentTemplateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentTemplateFormat) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addPropertyResult('suggestedPresentationDelaySeconds', 'SuggestedPresentationDelaySeconds', properties.SuggestedPresentationDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SuggestedPresentationDelaySeconds) : undefined);
    ret.addPropertyResult('utcTiming', 'UtcTiming', properties.UtcTiming != null ? cfn_parse.FromCloudFormation.getString(properties.UtcTiming) : undefined);
    ret.addPropertyResult('utcTimingUri', 'UtcTimingUri', properties.UtcTimingUri != null ? cfn_parse.FromCloudFormation.getString(properties.UtcTimingUri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines the content keys used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use. For more information about these presets, see [SPEKE Version 2.0 Presets](https://docs.aws.amazon.com/mediapackage/latest/ug/drm-content-speke-v2-presets.html) .
     *
     * Note the following considerations when using `encryptionContractConfiguration` :
     *
     * - You can use `encryptionContractConfiguration` for DASH endpoints that use SPEKE Version 2.0. SPEKE Version 2.0 relies on the CPIX Version 2.3 specification.
     * - You cannot combine an `UNENCRYPTED` preset with `UNENCRYPTED` or `SHARED` presets across `presetSpeke20Audio` and `presetSpeke20Video` .
     * - When you use a `SHARED` preset, you must use it for both `presetSpeke20Audio` and `presetSpeke20Video` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html
     */
    export interface EncryptionContractConfigurationProperty {
        /**
         * A collection of audio encryption presets.
         *
         * Value description:
         *
         * - `PRESET-AUDIO-1` - Use one content key to encrypt all of the audio tracks in your stream.
         * - `PRESET-AUDIO-2` - Use one content key to encrypt all of the stereo audio tracks and one content key to encrypt all of the multichannel audio tracks.
         * - `PRESET-AUDIO-3` - Use one content key to encrypt all of the stereo audio tracks, one content key to encrypt all of the multichannel audio tracks with 3 to 6 channels, and one content key to encrypt all of the multichannel audio tracks with more than 6 channels.
         * - `SHARED` - Use the same content key for all of the audio and video tracks in your stream.
         * - `UNENCRYPTED` - Don't encrypt any of the audio tracks in your stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackage-originendpoint-encryptioncontractconfiguration-presetspeke20audio
         */
        readonly presetSpeke20Audio: string;
        /**
         * A collection of video encryption presets.
         *
         * Value description:
         *
         * - `PRESET-VIDEO-1` - Use one content key to encrypt all of the video tracks in your stream.
         * - `PRESET-VIDEO-2` - Use one content key to encrypt all of the SD video tracks and one content key for all HD and higher resolutions video tracks.
         * - `PRESET-VIDEO-3` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-4` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `PRESET-VIDEO-5` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `PRESET-VIDEO-6` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-7` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-8` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `SHARED` - Use the same content key for all of the video and audio tracks in your stream.
         * - `UNENCRYPTED` - Don't encrypt any of the video tracks in your stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackage-originendpoint-encryptioncontractconfiguration-presetspeke20video
         */
        readonly presetSpeke20Video: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionContractConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionContractConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_EncryptionContractConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('presetSpeke20Audio', cdk.requiredValidator)(properties.presetSpeke20Audio));
    errors.collect(cdk.propertyValidator('presetSpeke20Audio', cdk.validateString)(properties.presetSpeke20Audio));
    errors.collect(cdk.propertyValidator('presetSpeke20Video', cdk.requiredValidator)(properties.presetSpeke20Video));
    errors.collect(cdk.propertyValidator('presetSpeke20Video', cdk.validateString)(properties.presetSpeke20Video));
    return errors.wrap('supplied properties not correct for "EncryptionContractConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.EncryptionContractConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionContractConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.EncryptionContractConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointEncryptionContractConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_EncryptionContractConfigurationPropertyValidator(properties).assertSuccess();
    return {
        PresetSpeke20Audio: cdk.stringToCloudFormation(properties.presetSpeke20Audio),
        PresetSpeke20Video: cdk.stringToCloudFormation(properties.presetSpeke20Video),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointEncryptionContractConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.EncryptionContractConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.EncryptionContractConfigurationProperty>();
    ret.addPropertyResult('presetSpeke20Audio', 'PresetSpeke20Audio', cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Audio));
    ret.addPropertyResult('presetSpeke20Video', 'PresetSpeke20Video', cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Video));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html
     */
    export interface HlsEncryptionProperty {
        /**
         * A 128-bit, 16-byte hex value represented by a 32-character string, used with the key for encrypting blocks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * HLS encryption type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-encryptionmethod
         */
        readonly encryptionMethod?: string;
        /**
         * Number of seconds before AWS Elemental MediaPackage rotates to a new key. By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-keyrotationintervalseconds
         */
        readonly keyRotationIntervalSeconds?: number;
        /**
         * Repeat the `EXT-X-KEY` directive for every media segment. This might result in an increase in client requests to the DRM server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-repeatextxkey
         */
        readonly repeatExtXKey?: boolean | cdk.IResolvable;
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_HlsEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('encryptionMethod', cdk.validateString)(properties.encryptionMethod));
    errors.collect(cdk.propertyValidator('keyRotationIntervalSeconds', cdk.validateNumber)(properties.keyRotationIntervalSeconds));
    errors.collect(cdk.propertyValidator('repeatExtXKey', cdk.validateBoolean)(properties.repeatExtXKey));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnOriginEndpoint_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "HlsEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsEncryption` resource
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsEncryption` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointHlsEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_HlsEncryptionPropertyValidator(properties).assertSuccess();
    return {
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        EncryptionMethod: cdk.stringToCloudFormation(properties.encryptionMethod),
        KeyRotationIntervalSeconds: cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
        RepeatExtXKey: cdk.booleanToCloudFormation(properties.repeatExtXKey),
        SpekeKeyProvider: cfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsEncryptionProperty>();
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('encryptionMethod', 'EncryptionMethod', properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined);
    ret.addPropertyResult('keyRotationIntervalSeconds', 'KeyRotationIntervalSeconds', properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined);
    ret.addPropertyResult('repeatExtXKey', 'RepeatExtXKey', properties.RepeatExtXKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RepeatExtXKey) : undefined);
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * An HTTP Live Streaming (HLS) manifest configuration on a CMAF endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html
     */
    export interface HlsManifestProperty {
        /**
         * Controls how ad markers are included in the packaged endpoint.
         *
         * Valid values:
         *
         * - `NONE` - Omits all SCTE-35 ad markers from the output.
         * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
         * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-admarkers
         */
        readonly adMarkers?: string;
        /**
         * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
         *
         * Valid values:
         *
         * - `BREAK`
         * - `DISTRIBUTOR_ADVERTISEMENT`
         * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY`
         * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY`
         * - `PROVIDER_ADVERTISEMENT`
         * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY`
         * - `PROVIDER_PLACEMENT_OPPORTUNITY`
         * - `SPLICE_INSERT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-adtriggers
         */
        readonly adTriggers?: string[];
        /**
         * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest. For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-adsondeliveryrestrictions
         */
        readonly adsOnDeliveryRestrictions?: string;
        /**
         * The manifest ID is required and must be unique within the OriginEndpoint. The ID can't be changed after the endpoint is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-id
         */
        readonly id: string;
        /**
         * Applies to stream sets with a single video track only. When true, the stream set includes an additional I-frame only stream, along with the other tracks. If false, this extra stream is not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-includeiframeonlystream
         */
        readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;
        /**
         * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint. The manifestName on the HLSManifest object overrides the manifestName that you provided on the originEndpoint object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-manifestname
         */
        readonly manifestName?: string;
        /**
         * When specified as either `event` or `vod` , a corresponding `EXT-X-PLAYLIST-TYPE` entry is included in the media playlist. Indicates if the playlist is live-to-VOD content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-playlisttype
         */
        readonly playlistType?: string;
        /**
         * Time window (in seconds) contained in each parent manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-playlistwindowseconds
         */
        readonly playlistWindowSeconds?: number;
        /**
         * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify. Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
         *
         * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
         *
         * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-programdatetimeintervalseconds
         */
        readonly programDateTimeIntervalSeconds?: number;
        /**
         * The URL that's used to request this manifest from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsManifestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_HlsManifestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkers', cdk.validateString)(properties.adMarkers));
    errors.collect(cdk.propertyValidator('adTriggers', cdk.listValidator(cdk.validateString))(properties.adTriggers));
    errors.collect(cdk.propertyValidator('adsOnDeliveryRestrictions', cdk.validateString)(properties.adsOnDeliveryRestrictions));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('includeIframeOnlyStream', cdk.validateBoolean)(properties.includeIframeOnlyStream));
    errors.collect(cdk.propertyValidator('manifestName', cdk.validateString)(properties.manifestName));
    errors.collect(cdk.propertyValidator('playlistType', cdk.validateString)(properties.playlistType));
    errors.collect(cdk.propertyValidator('playlistWindowSeconds', cdk.validateNumber)(properties.playlistWindowSeconds));
    errors.collect(cdk.propertyValidator('programDateTimeIntervalSeconds', cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "HlsManifestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsManifest` resource
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsManifest` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointHlsManifestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_HlsManifestPropertyValidator(properties).assertSuccess();
    return {
        AdMarkers: cdk.stringToCloudFormation(properties.adMarkers),
        AdTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
        AdsOnDeliveryRestrictions: cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
        Id: cdk.stringToCloudFormation(properties.id),
        IncludeIframeOnlyStream: cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
        ManifestName: cdk.stringToCloudFormation(properties.manifestName),
        PlaylistType: cdk.stringToCloudFormation(properties.playlistType),
        PlaylistWindowSeconds: cdk.numberToCloudFormation(properties.playlistWindowSeconds),
        ProgramDateTimeIntervalSeconds: cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsManifestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsManifestProperty>();
    ret.addPropertyResult('adMarkers', 'AdMarkers', properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined);
    ret.addPropertyResult('adTriggers', 'AdTriggers', properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdTriggers) : undefined);
    ret.addPropertyResult('adsOnDeliveryRestrictions', 'AdsOnDeliveryRestrictions', properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('includeIframeOnlyStream', 'IncludeIframeOnlyStream', properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined);
    ret.addPropertyResult('manifestName', 'ManifestName', properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined);
    ret.addPropertyResult('playlistType', 'PlaylistType', properties.PlaylistType != null ? cfn_parse.FromCloudFormation.getString(properties.PlaylistType) : undefined);
    ret.addPropertyResult('playlistWindowSeconds', 'PlaylistWindowSeconds', properties.PlaylistWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PlaylistWindowSeconds) : undefined);
    ret.addPropertyResult('programDateTimeIntervalSeconds', 'ProgramDateTimeIntervalSeconds', properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Parameters for Apple HLS packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html
     */
    export interface HlsPackageProperty {
        /**
         * Controls how ad markers are included in the packaged endpoint.
         *
         * Valid values:
         *
         * - `NONE` - Omits all SCTE-35 ad markers from the output.
         * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
         * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-admarkers
         */
        readonly adMarkers?: string;
        /**
         * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
         *
         * Valid values:
         *
         * - `BREAK`
         * - `DISTRIBUTOR_ADVERTISEMENT`
         * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY`
         * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY`
         * - `PROVIDER_ADVERTISEMENT`
         * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY`
         * - `PROVIDER_PLACEMENT_OPPORTUNITY`
         * - `SPLICE_INSERT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-adtriggers
         */
        readonly adTriggers?: string[];
        /**
         * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest. For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-adsondeliveryrestrictions
         */
        readonly adsOnDeliveryRestrictions?: string;
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-encryption
         */
        readonly encryption?: CfnOriginEndpoint.HlsEncryptionProperty | cdk.IResolvable;
        /**
         * When enabled, MediaPackage passes through digital video broadcasting (DVB) subtitles into the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-includedvbsubtitles
         */
        readonly includeDvbSubtitles?: boolean | cdk.IResolvable;
        /**
         * Only applies to stream sets with a single video track. When true, the stream set includes an additional I-frame only stream, along with the other tracks. If false, this extra stream is not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-includeiframeonlystream
         */
        readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;
        /**
         * When specified as either `event` or `vod` , a corresponding `EXT-X-PLAYLIST-TYPE` entry is included in the media playlist. Indicates if the playlist is live-to-VOD content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-playlisttype
         */
        readonly playlistType?: string;
        /**
         * Time window (in seconds) contained in each parent manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-playlistwindowseconds
         */
        readonly playlistWindowSeconds?: number;
        /**
         * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify. Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
         *
         * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
         *
         * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-programdatetimeintervalseconds
         */
        readonly programDateTimeIntervalSeconds?: number;
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * Limitations for outputs from the endpoint, based on the video bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-streamselection
         */
        readonly streamSelection?: CfnOriginEndpoint.StreamSelectionProperty | cdk.IResolvable;
        /**
         * When true, AWS Elemental MediaPackage bundles all audio tracks in a rendition group. All other tracks in the stream can be used with any audio rendition from the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-useaudiorenditiongroup
         */
        readonly useAudioRenditionGroup?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsPackageProperty`
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_HlsPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkers', cdk.validateString)(properties.adMarkers));
    errors.collect(cdk.propertyValidator('adTriggers', cdk.listValidator(cdk.validateString))(properties.adTriggers));
    errors.collect(cdk.propertyValidator('adsOnDeliveryRestrictions', cdk.validateString)(properties.adsOnDeliveryRestrictions));
    errors.collect(cdk.propertyValidator('encryption', CfnOriginEndpoint_HlsEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('includeDvbSubtitles', cdk.validateBoolean)(properties.includeDvbSubtitles));
    errors.collect(cdk.propertyValidator('includeIframeOnlyStream', cdk.validateBoolean)(properties.includeIframeOnlyStream));
    errors.collect(cdk.propertyValidator('playlistType', cdk.validateString)(properties.playlistType));
    errors.collect(cdk.propertyValidator('playlistWindowSeconds', cdk.validateNumber)(properties.playlistWindowSeconds));
    errors.collect(cdk.propertyValidator('programDateTimeIntervalSeconds', cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('streamSelection', CfnOriginEndpoint_StreamSelectionPropertyValidator)(properties.streamSelection));
    errors.collect(cdk.propertyValidator('useAudioRenditionGroup', cdk.validateBoolean)(properties.useAudioRenditionGroup));
    return errors.wrap('supplied properties not correct for "HlsPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsPackage` resource
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.HlsPackage` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointHlsPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_HlsPackagePropertyValidator(properties).assertSuccess();
    return {
        AdMarkers: cdk.stringToCloudFormation(properties.adMarkers),
        AdTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
        AdsOnDeliveryRestrictions: cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
        Encryption: cfnOriginEndpointHlsEncryptionPropertyToCloudFormation(properties.encryption),
        IncludeDvbSubtitles: cdk.booleanToCloudFormation(properties.includeDvbSubtitles),
        IncludeIframeOnlyStream: cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
        PlaylistType: cdk.stringToCloudFormation(properties.playlistType),
        PlaylistWindowSeconds: cdk.numberToCloudFormation(properties.playlistWindowSeconds),
        ProgramDateTimeIntervalSeconds: cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        StreamSelection: cfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
        UseAudioRenditionGroup: cdk.booleanToCloudFormation(properties.useAudioRenditionGroup),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsPackageProperty>();
    ret.addPropertyResult('adMarkers', 'AdMarkers', properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined);
    ret.addPropertyResult('adTriggers', 'AdTriggers', properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdTriggers) : undefined);
    ret.addPropertyResult('adsOnDeliveryRestrictions', 'AdsOnDeliveryRestrictions', properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined);
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnOriginEndpointHlsEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('includeDvbSubtitles', 'IncludeDvbSubtitles', properties.IncludeDvbSubtitles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDvbSubtitles) : undefined);
    ret.addPropertyResult('includeIframeOnlyStream', 'IncludeIframeOnlyStream', properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined);
    ret.addPropertyResult('playlistType', 'PlaylistType', properties.PlaylistType != null ? cfn_parse.FromCloudFormation.getString(properties.PlaylistType) : undefined);
    ret.addPropertyResult('playlistWindowSeconds', 'PlaylistWindowSeconds', properties.PlaylistWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PlaylistWindowSeconds) : undefined);
    ret.addPropertyResult('programDateTimeIntervalSeconds', 'ProgramDateTimeIntervalSeconds', properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addPropertyResult('useAudioRenditionGroup', 'UseAudioRenditionGroup', properties.UseAudioRenditionGroup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAudioRenditionGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html
     */
    export interface MssEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html#cfn-mediapackage-originendpoint-mssencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MssEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_MssEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnOriginEndpoint_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "MssEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.MssEncryption` resource
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.MssEncryption` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointMssEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_MssEncryptionPropertyValidator(properties).assertSuccess();
    return {
        SpekeKeyProvider: cfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointMssEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.MssEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.MssEncryptionProperty>();
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html
     */
    export interface MssPackageProperty {
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-encryption
         */
        readonly encryption?: CfnOriginEndpoint.MssEncryptionProperty | cdk.IResolvable;
        /**
         * Time window (in seconds) contained in each manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-manifestwindowseconds
         */
        readonly manifestWindowSeconds?: number;
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * Limitations for outputs from the endpoint, based on the video bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-streamselection
         */
        readonly streamSelection?: CfnOriginEndpoint.StreamSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MssPackageProperty`
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_MssPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryption', CfnOriginEndpoint_MssEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('manifestWindowSeconds', cdk.validateNumber)(properties.manifestWindowSeconds));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('streamSelection', CfnOriginEndpoint_StreamSelectionPropertyValidator)(properties.streamSelection));
    return errors.wrap('supplied properties not correct for "MssPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.MssPackage` resource
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.MssPackage` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointMssPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_MssPackagePropertyValidator(properties).assertSuccess();
    return {
        Encryption: cfnOriginEndpointMssEncryptionPropertyToCloudFormation(properties.encryption),
        ManifestWindowSeconds: cdk.numberToCloudFormation(properties.manifestWindowSeconds),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        StreamSelection: cfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointMssPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.MssPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.MssPackageProperty>();
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnOriginEndpointMssEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('manifestWindowSeconds', 'ManifestWindowSeconds', properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Keyprovider settings for DRM.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html
     */
    export interface SpekeKeyProviderProperty {
        /**
         * The Amazon Resource Name (ARN) for the certificate that you imported to AWS Certificate Manager to add content key encryption to this endpoint. For this feature to work, your DRM key provider must support content key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-certificatearn
         */
        readonly certificateArn?: string;
        /**
         * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-encryptioncontractconfiguration
         */
        readonly encryptionContractConfiguration?: CfnOriginEndpoint.EncryptionContractConfigurationProperty | cdk.IResolvable;
        /**
         * Unique identifier for this endpoint, as it is configured in the key provider service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-resourceid
         */
        readonly resourceId: string;
        /**
         * The ARN for the IAM role that's granted by the key provider to provide access to the key provider API. This role must have a trust policy that allows AWS Elemental MediaPackage to assume the role, and it must have a sufficient permissions policy to allow access to the specific key retrieval URL. Valid format: arn:aws:iam::{accountID}:role/{name}
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-rolearn
         */
        readonly roleArn: string;
        /**
         * List of unique identifiers for the DRM systems to use, as defined in the CPIX specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-systemids
         */
        readonly systemIds: string[];
        /**
         * URL for the key provider’s key retrieval API endpoint. Must start with https://.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-url
         */
        readonly url: string;
    }
}

/**
 * Determine whether the given properties match those of a `SpekeKeyProviderProperty`
 *
 * @param properties - the TypeScript properties of a `SpekeKeyProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_SpekeKeyProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('encryptionContractConfiguration', CfnOriginEndpoint_EncryptionContractConfigurationPropertyValidator)(properties.encryptionContractConfiguration));
    errors.collect(cdk.propertyValidator('resourceId', cdk.requiredValidator)(properties.resourceId));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('systemIds', cdk.requiredValidator)(properties.systemIds));
    errors.collect(cdk.propertyValidator('systemIds', cdk.listValidator(cdk.validateString))(properties.systemIds));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "SpekeKeyProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.SpekeKeyProvider` resource
 *
 * @param properties - the TypeScript properties of a `SpekeKeyProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.SpekeKeyProvider` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_SpekeKeyProviderPropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        EncryptionContractConfiguration: cfnOriginEndpointEncryptionContractConfigurationPropertyToCloudFormation(properties.encryptionContractConfiguration),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SystemIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.systemIds),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.SpekeKeyProviderProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined);
    ret.addPropertyResult('encryptionContractConfiguration', 'EncryptionContractConfiguration', properties.EncryptionContractConfiguration != null ? CfnOriginEndpointEncryptionContractConfigurationPropertyFromCloudFormation(properties.EncryptionContractConfiguration) : undefined);
    ret.addPropertyResult('resourceId', 'ResourceId', cfn_parse.FromCloudFormation.getString(properties.ResourceId));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('systemIds', 'SystemIds', cfn_parse.FromCloudFormation.getStringArray(properties.SystemIds));
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOriginEndpoint {
    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html
     */
    export interface StreamSelectionProperty {
        /**
         * The upper limit of the bitrates that this endpoint serves. If the video track exceeds this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 2147483647 bits per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-maxvideobitspersecond
         */
        readonly maxVideoBitsPerSecond?: number;
        /**
         * The lower limit of the bitrates that this endpoint serves. If the video track is below this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 0 bits per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-minvideobitspersecond
         */
        readonly minVideoBitsPerSecond?: number;
        /**
         * Order in which the different video bitrates are presented to the player.
         *
         * Valid values: `ORIGINAL` , `VIDEO_BITRATE_ASCENDING` , `VIDEO_BITRATE_DESCENDING` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-streamorder
         */
        readonly streamOrder?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnOriginEndpoint_StreamSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxVideoBitsPerSecond', cdk.validateNumber)(properties.maxVideoBitsPerSecond));
    errors.collect(cdk.propertyValidator('minVideoBitsPerSecond', cdk.validateNumber)(properties.minVideoBitsPerSecond));
    errors.collect(cdk.propertyValidator('streamOrder', cdk.validateString)(properties.streamOrder));
    return errors.wrap('supplied properties not correct for "StreamSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.StreamSelection` resource
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::OriginEndpoint.StreamSelection` resource.
 */
// @ts-ignore TS6133
function cfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOriginEndpoint_StreamSelectionPropertyValidator(properties).assertSuccess();
    return {
        MaxVideoBitsPerSecond: cdk.numberToCloudFormation(properties.maxVideoBitsPerSecond),
        MinVideoBitsPerSecond: cdk.numberToCloudFormation(properties.minVideoBitsPerSecond),
        StreamOrder: cdk.stringToCloudFormation(properties.streamOrder),
    };
}

// @ts-ignore TS6133
function CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.StreamSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.StreamSelectionProperty>();
    ret.addPropertyResult('maxVideoBitsPerSecond', 'MaxVideoBitsPerSecond', properties.MaxVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVideoBitsPerSecond) : undefined);
    ret.addPropertyResult('minVideoBitsPerSecond', 'MinVideoBitsPerSecond', properties.MinVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinVideoBitsPerSecond) : undefined);
    ret.addPropertyResult('streamOrder', 'StreamOrder', properties.StreamOrder != null ? cfn_parse.FromCloudFormation.getString(properties.StreamOrder) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPackagingConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html
 */
export interface CfnPackagingConfigurationProps {

    /**
     * Unique identifier that you assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-id
     */
    readonly id: string;

    /**
     * The ID of the packaging group associated with this packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-packaginggroupid
     */
    readonly packagingGroupId: string;

    /**
     * Parameters for CMAF packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-cmafpackage
     */
    readonly cmafPackage?: CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable;

    /**
     * Parameters for DASH-ISO packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-dashpackage
     */
    readonly dashPackage?: CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable;

    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-hlspackage
     */
    readonly hlsPackage?: CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable;

    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-msspackage
     */
    readonly mssPackage?: CfnPackagingConfiguration.MssPackageProperty | cdk.IResolvable;

    /**
     * The tags to assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPackagingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackagingConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cmafPackage', CfnPackagingConfiguration_CmafPackagePropertyValidator)(properties.cmafPackage));
    errors.collect(cdk.propertyValidator('dashPackage', CfnPackagingConfiguration_DashPackagePropertyValidator)(properties.dashPackage));
    errors.collect(cdk.propertyValidator('hlsPackage', CfnPackagingConfiguration_HlsPackagePropertyValidator)(properties.hlsPackage));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('mssPackage', CfnPackagingConfiguration_MssPackagePropertyValidator)(properties.mssPackage));
    errors.collect(cdk.propertyValidator('packagingGroupId', cdk.requiredValidator)(properties.packagingGroupId));
    errors.collect(cdk.propertyValidator('packagingGroupId', cdk.validateString)(properties.packagingGroupId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPackagingConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnPackagingConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfigurationPropsValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        PackagingGroupId: cdk.stringToCloudFormation(properties.packagingGroupId),
        CmafPackage: cfnPackagingConfigurationCmafPackagePropertyToCloudFormation(properties.cmafPackage),
        DashPackage: cfnPackagingConfigurationDashPackagePropertyToCloudFormation(properties.dashPackage),
        HlsPackage: cfnPackagingConfigurationHlsPackagePropertyToCloudFormation(properties.hlsPackage),
        MssPackage: cfnPackagingConfigurationMssPackagePropertyToCloudFormation(properties.mssPackage),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfigurationProps>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('packagingGroupId', 'PackagingGroupId', cfn_parse.FromCloudFormation.getString(properties.PackagingGroupId));
    ret.addPropertyResult('cmafPackage', 'CmafPackage', properties.CmafPackage != null ? CfnPackagingConfigurationCmafPackagePropertyFromCloudFormation(properties.CmafPackage) : undefined);
    ret.addPropertyResult('dashPackage', 'DashPackage', properties.DashPackage != null ? CfnPackagingConfigurationDashPackagePropertyFromCloudFormation(properties.DashPackage) : undefined);
    ret.addPropertyResult('hlsPackage', 'HlsPackage', properties.HlsPackage != null ? CfnPackagingConfigurationHlsPackagePropertyFromCloudFormation(properties.HlsPackage) : undefined);
    ret.addPropertyResult('mssPackage', 'MssPackage', properties.MssPackage != null ? CfnPackagingConfigurationMssPackagePropertyFromCloudFormation(properties.MssPackage) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaPackage::PackagingConfiguration`
 *
 * Creates a packaging configuration in a packaging group.
 *
 * The packaging configuration represents a single delivery point for an asset. It determines the format and setting for the egressing content. Specify only one package format per configuration, such as `HlsPackage` .
 *
 * @cloudformationResource AWS::MediaPackage::PackagingConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html
 */
export class CfnPackagingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::PackagingConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPackagingConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPackagingConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the packaging configuration. You can get this from the response to any request to the packaging configuration.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Unique identifier that you assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-id
     */
    public id: string;

    /**
     * The ID of the packaging group associated with this packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-packaginggroupid
     */
    public packagingGroupId: string;

    /**
     * Parameters for CMAF packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-cmafpackage
     */
    public cmafPackage: CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable | undefined;

    /**
     * Parameters for DASH-ISO packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-dashpackage
     */
    public dashPackage: CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable | undefined;

    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-hlspackage
     */
    public hlsPackage: CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable | undefined;

    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-msspackage
     */
    public mssPackage: CfnPackagingConfiguration.MssPackageProperty | cdk.IResolvable | undefined;

    /**
     * The tags to assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::MediaPackage::PackagingConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackagingConfigurationProps) {
        super(scope, id, { type: CfnPackagingConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'id', this);
        cdk.requireProperty(props, 'packagingGroupId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.id = props.id;
        this.packagingGroupId = props.packagingGroupId;
        this.cmafPackage = props.cmafPackage;
        this.dashPackage = props.dashPackage;
        this.hlsPackage = props.hlsPackage;
        this.mssPackage = props.mssPackage;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::PackagingConfiguration", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackagingConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            id: this.id,
            packagingGroupId: this.packagingGroupId,
            cmafPackage: this.cmafPackage,
            dashPackage: this.dashPackage,
            hlsPackage: this.hlsPackage,
            mssPackage: this.mssPackage,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPackagingConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html
     */
    export interface CmafEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html#cfn-mediapackage-packagingconfiguration-cmafencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CmafEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_CmafEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "CmafEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.CmafEncryption` resource
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.CmafEncryption` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationCmafEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_CmafEncryptionPropertyValidator(properties).assertSuccess();
    return {
        SpekeKeyProvider: cfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationCmafEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.CmafEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.CmafEncryptionProperty>();
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Common Media Application Format (CMAF) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html
     */
    export interface CmafPackageProperty {
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-encryption
         */
        readonly encryption?: CfnPackagingConfiguration.CmafEncryptionProperty | cdk.IResolvable;
        /**
         * A list of HLS manifest configurations that are available from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-hlsmanifests
         */
        readonly hlsManifests: Array<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * When includeEncoderConfigurationInSegments is set to true, AWS Elemental MediaPackage places your encoder's Sequence Parameter Set (SPS), Picture Parameter Set (PPS), and Video Parameter Set (VPS) metadata in every video segment instead of in the init fragment. This lets you use different SPS/PPS/VPS settings for your assets during content playback.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-includeencoderconfigurationinsegments
         */
        readonly includeEncoderConfigurationInSegments?: boolean | cdk.IResolvable;
        /**
         * Duration (in seconds) of each segment. Actual segments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CmafPackageProperty`
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_CmafPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryption', CfnPackagingConfiguration_CmafEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('hlsManifests', cdk.requiredValidator)(properties.hlsManifests));
    errors.collect(cdk.propertyValidator('hlsManifests', cdk.listValidator(CfnPackagingConfiguration_HlsManifestPropertyValidator))(properties.hlsManifests));
    errors.collect(cdk.propertyValidator('includeEncoderConfigurationInSegments', cdk.validateBoolean)(properties.includeEncoderConfigurationInSegments));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    return errors.wrap('supplied properties not correct for "CmafPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.CmafPackage` resource
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.CmafPackage` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationCmafPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_CmafPackagePropertyValidator(properties).assertSuccess();
    return {
        Encryption: cfnPackagingConfigurationCmafEncryptionPropertyToCloudFormation(properties.encryption),
        HlsManifests: cdk.listMapper(cfnPackagingConfigurationHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
        IncludeEncoderConfigurationInSegments: cdk.booleanToCloudFormation(properties.includeEncoderConfigurationInSegments),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationCmafPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.CmafPackageProperty>();
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnPackagingConfigurationCmafEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('hlsManifests', 'HlsManifests', cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation)(properties.HlsManifests));
    ret.addPropertyResult('includeEncoderConfigurationInSegments', 'IncludeEncoderConfigurationInSegments', properties.IncludeEncoderConfigurationInSegments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeEncoderConfigurationInSegments) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html
     */
    export interface DashEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html#cfn-mediapackage-packagingconfiguration-dashencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_DashEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "DashEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashEncryption` resource
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashEncryption` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationDashEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_DashEncryptionPropertyValidator(properties).assertSuccess();
    return {
        SpekeKeyProvider: cfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashEncryptionProperty>();
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a DASH manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html
     */
    export interface DashManifestProperty {
        /**
         * Determines the position of some tags in the Media Presentation Description (MPD). When set to `FULL` , elements like `SegmentTemplate` and `ContentProtection` are included in each `Representation` . When set to `COMPACT` , duplicate elements are combined and presented at the AdaptationSet level.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-manifestlayout
         */
        readonly manifestLayout?: string;
        /**
         * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-manifestname
         */
        readonly manifestName?: string;
        /**
         * Minimum amount of content (measured in seconds) that a player must keep available in the buffer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-minbuffertimeseconds
         */
        readonly minBufferTimeSeconds?: number;
        /**
         * The DASH profile type. When set to `HBBTV_1_5` , the content is compliant with HbbTV 1.5.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-profile
         */
        readonly profile?: string;
        /**
         * The source of scte markers used.
         *
         * Value description:
         *
         * - `SEGMENTS` - The scte markers are sourced from the segments of the ingested content.
         * - `MANIFEST` - the scte markers are sourced from the manifest of the ingested content. The MANIFEST value is compatible with source HLS playlists using the SCTE-35 Enhanced syntax ( `EXT-OATCLS-SCTE35` tags). SCTE-35 Elemental and SCTE-35 Daterange syntaxes are not supported with this option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-sctemarkerssource
         */
        readonly scteMarkersSource?: string;
        /**
         * Limitations for outputs from the endpoint, based on the video bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-streamselection
         */
        readonly streamSelection?: CfnPackagingConfiguration.StreamSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashManifestProperty`
 *
 * @param properties - the TypeScript properties of a `DashManifestProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_DashManifestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifestLayout', cdk.validateString)(properties.manifestLayout));
    errors.collect(cdk.propertyValidator('manifestName', cdk.validateString)(properties.manifestName));
    errors.collect(cdk.propertyValidator('minBufferTimeSeconds', cdk.validateNumber)(properties.minBufferTimeSeconds));
    errors.collect(cdk.propertyValidator('profile', cdk.validateString)(properties.profile));
    errors.collect(cdk.propertyValidator('scteMarkersSource', cdk.validateString)(properties.scteMarkersSource));
    errors.collect(cdk.propertyValidator('streamSelection', CfnPackagingConfiguration_StreamSelectionPropertyValidator)(properties.streamSelection));
    return errors.wrap('supplied properties not correct for "DashManifestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashManifest` resource
 *
 * @param properties - the TypeScript properties of a `DashManifestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashManifest` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationDashManifestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_DashManifestPropertyValidator(properties).assertSuccess();
    return {
        ManifestLayout: cdk.stringToCloudFormation(properties.manifestLayout),
        ManifestName: cdk.stringToCloudFormation(properties.manifestName),
        MinBufferTimeSeconds: cdk.numberToCloudFormation(properties.minBufferTimeSeconds),
        Profile: cdk.stringToCloudFormation(properties.profile),
        ScteMarkersSource: cdk.stringToCloudFormation(properties.scteMarkersSource),
        StreamSelection: cfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashManifestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashManifestProperty>();
    ret.addPropertyResult('manifestLayout', 'ManifestLayout', properties.ManifestLayout != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestLayout) : undefined);
    ret.addPropertyResult('manifestName', 'ManifestName', properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined);
    ret.addPropertyResult('minBufferTimeSeconds', 'MinBufferTimeSeconds', properties.MinBufferTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinBufferTimeSeconds) : undefined);
    ret.addPropertyResult('profile', 'Profile', properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined);
    ret.addPropertyResult('scteMarkersSource', 'ScteMarkersSource', properties.ScteMarkersSource != null ? cfn_parse.FromCloudFormation.getString(properties.ScteMarkersSource) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Dynamic Adaptive Streaming over HTTP (DASH) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html
     */
    export interface DashPackageProperty {
        /**
         * A list of DASH manifest configurations that are available from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-dashmanifests
         */
        readonly dashManifests: Array<CfnPackagingConfiguration.DashManifestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-encryption
         */
        readonly encryption?: CfnPackagingConfiguration.DashEncryptionProperty | cdk.IResolvable;
        /**
         * When includeEncoderConfigurationInSegments is set to true, AWS Elemental MediaPackage places your encoder's Sequence Parameter Set (SPS), Picture Parameter Set (PPS), and Video Parameter Set (VPS) metadata in every video segment instead of in the init fragment. This lets you use different SPS/PPS/VPS settings for your assets during content playback.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-includeencoderconfigurationinsegments
         */
        readonly includeEncoderConfigurationInSegments?: boolean | cdk.IResolvable;
        /**
         * This applies only to stream sets with a single video track. When true, the stream set includes an additional I-frame trick-play only stream, along with the other tracks. If false, this extra stream is not included.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-includeiframeonlystream
         */
        readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;
        /**
         * Controls whether AWS Elemental MediaPackage produces single-period or multi-period DASH manifests. For more information about periods, see [Multi-period DASH in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/multi-period.html) .
         *
         * Valid values:
         *
         * - `ADS` - AWS Elemental MediaPackage will produce multi-period DASH manifests. Periods are created based on the SCTE-35 ad markers present in the input manifest.
         * - *No value* - AWS Elemental MediaPackage will produce single-period DASH manifests. This is the default setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-periodtriggers
         */
        readonly periodTriggers?: string[];
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source segment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * Determines the type of SegmentTemplate included in the Media Presentation Description (MPD). When set to `NUMBER_WITH_TIMELINE` , a full timeline is presented in each SegmentTemplate, with $Number$ media URLs. When set to `TIME_WITH_TIMELINE` , a full timeline is presented in each SegmentTemplate, with $Time$ media URLs. When set to `NUMBER_WITH_DURATION` , only a duration is included in each SegmentTemplate, with $Number$ media URLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-segmenttemplateformat
         */
        readonly segmentTemplateFormat?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DashPackageProperty`
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_DashPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dashManifests', cdk.requiredValidator)(properties.dashManifests));
    errors.collect(cdk.propertyValidator('dashManifests', cdk.listValidator(CfnPackagingConfiguration_DashManifestPropertyValidator))(properties.dashManifests));
    errors.collect(cdk.propertyValidator('encryption', CfnPackagingConfiguration_DashEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('includeEncoderConfigurationInSegments', cdk.validateBoolean)(properties.includeEncoderConfigurationInSegments));
    errors.collect(cdk.propertyValidator('includeIframeOnlyStream', cdk.validateBoolean)(properties.includeIframeOnlyStream));
    errors.collect(cdk.propertyValidator('periodTriggers', cdk.listValidator(cdk.validateString))(properties.periodTriggers));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('segmentTemplateFormat', cdk.validateString)(properties.segmentTemplateFormat));
    return errors.wrap('supplied properties not correct for "DashPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashPackage` resource
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.DashPackage` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationDashPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_DashPackagePropertyValidator(properties).assertSuccess();
    return {
        DashManifests: cdk.listMapper(cfnPackagingConfigurationDashManifestPropertyToCloudFormation)(properties.dashManifests),
        Encryption: cfnPackagingConfigurationDashEncryptionPropertyToCloudFormation(properties.encryption),
        IncludeEncoderConfigurationInSegments: cdk.booleanToCloudFormation(properties.includeEncoderConfigurationInSegments),
        IncludeIframeOnlyStream: cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
        PeriodTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.periodTriggers),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        SegmentTemplateFormat: cdk.stringToCloudFormation(properties.segmentTemplateFormat),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashPackageProperty>();
    ret.addPropertyResult('dashManifests', 'DashManifests', cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationDashManifestPropertyFromCloudFormation)(properties.DashManifests));
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnPackagingConfigurationDashEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('includeEncoderConfigurationInSegments', 'IncludeEncoderConfigurationInSegments', properties.IncludeEncoderConfigurationInSegments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeEncoderConfigurationInSegments) : undefined);
    ret.addPropertyResult('includeIframeOnlyStream', 'IncludeIframeOnlyStream', properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined);
    ret.addPropertyResult('periodTriggers', 'PeriodTriggers', properties.PeriodTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PeriodTriggers) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('segmentTemplateFormat', 'SegmentTemplateFormat', properties.SegmentTemplateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentTemplateFormat) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines the content keys used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use. For more information about these presets, see [SPEKE Version 2.0 Presets](https://docs.aws.amazon.com/mediapackage/latest/ug/drm-content-speke-v2-presets.html) .
     *
     * Note the following considerations when using `encryptionContractConfiguration` :
     *
     * - You can use `encryptionContractConfiguration` for DASH endpoints that use SPEKE Version 2.0. SPEKE Version 2.0 relies on the CPIX Version 2.3 specification.
     * - You cannot combine an `UNENCRYPTED` preset with `UNENCRYPTED` or `SHARED` presets across `presetSpeke20Audio` and `presetSpeke20Video` .
     * - When you use a `SHARED` preset, you must use it for both `presetSpeke20Audio` and `presetSpeke20Video` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html
     */
    export interface EncryptionContractConfigurationProperty {
        /**
         * A collection of audio encryption presets.
         *
         * Value description:
         *
         * - `PRESET-AUDIO-1` - Use one content key to encrypt all of the audio tracks in your stream.
         * - `PRESET-AUDIO-2` - Use one content key to encrypt all of the stereo audio tracks and one content key to encrypt all of the multichannel audio tracks.
         * - `PRESET-AUDIO-3` - Use one content key to encrypt all of the stereo audio tracks, one content key to encrypt all of the multichannel audio tracks with 3 to 6 channels, and one content key to encrypt all of the multichannel audio tracks with more than 6 channels.
         * - `SHARED` - Use the same content key for all of the audio and video tracks in your stream.
         * - `UNENCRYPTED` - Don't encrypt any of the audio tracks in your stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html#cfn-mediapackage-packagingconfiguration-encryptioncontractconfiguration-presetspeke20audio
         */
        readonly presetSpeke20Audio: string;
        /**
         * A collection of video encryption presets.
         *
         * Value description:
         *
         * - `PRESET-VIDEO-1` - Use one content key to encrypt all of the video tracks in your stream.
         * - `PRESET-VIDEO-2` - Use one content key to encrypt all of the SD video tracks and one content key for all HD and higher resolutions video tracks.
         * - `PRESET-VIDEO-3` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-4` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `PRESET-VIDEO-5` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `PRESET-VIDEO-6` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-7` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
         * - `PRESET-VIDEO-8` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
         * - `SHARED` - Use the same content key for all of the video and audio tracks in your stream.
         * - `UNENCRYPTED` - Don't encrypt any of the video tracks in your stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html#cfn-mediapackage-packagingconfiguration-encryptioncontractconfiguration-presetspeke20video
         */
        readonly presetSpeke20Video: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionContractConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionContractConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_EncryptionContractConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('presetSpeke20Audio', cdk.requiredValidator)(properties.presetSpeke20Audio));
    errors.collect(cdk.propertyValidator('presetSpeke20Audio', cdk.validateString)(properties.presetSpeke20Audio));
    errors.collect(cdk.propertyValidator('presetSpeke20Video', cdk.requiredValidator)(properties.presetSpeke20Video));
    errors.collect(cdk.propertyValidator('presetSpeke20Video', cdk.validateString)(properties.presetSpeke20Video));
    return errors.wrap('supplied properties not correct for "EncryptionContractConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.EncryptionContractConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionContractConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.EncryptionContractConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationEncryptionContractConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_EncryptionContractConfigurationPropertyValidator(properties).assertSuccess();
    return {
        PresetSpeke20Audio: cdk.stringToCloudFormation(properties.presetSpeke20Audio),
        PresetSpeke20Video: cdk.stringToCloudFormation(properties.presetSpeke20Video),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationEncryptionContractConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.EncryptionContractConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.EncryptionContractConfigurationProperty>();
    ret.addPropertyResult('presetSpeke20Audio', 'PresetSpeke20Audio', cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Audio));
    ret.addPropertyResult('presetSpeke20Video', 'PresetSpeke20Video', cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Video));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html
     */
    export interface HlsEncryptionProperty {
        /**
         * A 128-bit, 16-byte hex value represented by a 32-character string, used with the key for encrypting blocks. If you don't specify a constant initialization vector (IV), AWS Elemental MediaPackage periodically rotates the IV.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * HLS encryption type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-encryptionmethod
         */
        readonly encryptionMethod?: string;
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_HlsEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('encryptionMethod', cdk.validateString)(properties.encryptionMethod));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "HlsEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsEncryption` resource
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsEncryption` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationHlsEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_HlsEncryptionPropertyValidator(properties).assertSuccess();
    return {
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        EncryptionMethod: cdk.stringToCloudFormation(properties.encryptionMethod),
        SpekeKeyProvider: cfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsEncryptionProperty>();
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('encryptionMethod', 'EncryptionMethod', properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined);
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for an HLS manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html
     */
    export interface HlsManifestProperty {
        /**
         * This setting controls ad markers in the packaged content.
         *
         * Valid values:
         *
         * - `NONE` - Omits all SCTE-35 ad markers from the output.
         * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
         * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-admarkers
         */
        readonly adMarkers?: string;
        /**
         * Applies to stream sets with a single video track only. When enabled, the output includes an additional I-frame only stream, along with the other tracks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-includeiframeonlystream
         */
        readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;
        /**
         * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-manifestname
         */
        readonly manifestName?: string;
        /**
         * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify. Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
         *
         * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
         *
         * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-programdatetimeintervalseconds
         */
        readonly programDateTimeIntervalSeconds?: number;
        /**
         * Repeat the `EXT-X-KEY` directive for every media segment. This might result in an increase in client requests to the DRM server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-repeatextxkey
         */
        readonly repeatExtXKey?: boolean | cdk.IResolvable;
        /**
         * Video bitrate limitations for outputs from this packaging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-streamselection
         */
        readonly streamSelection?: CfnPackagingConfiguration.StreamSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsManifestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_HlsManifestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkers', cdk.validateString)(properties.adMarkers));
    errors.collect(cdk.propertyValidator('includeIframeOnlyStream', cdk.validateBoolean)(properties.includeIframeOnlyStream));
    errors.collect(cdk.propertyValidator('manifestName', cdk.validateString)(properties.manifestName));
    errors.collect(cdk.propertyValidator('programDateTimeIntervalSeconds', cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
    errors.collect(cdk.propertyValidator('repeatExtXKey', cdk.validateBoolean)(properties.repeatExtXKey));
    errors.collect(cdk.propertyValidator('streamSelection', CfnPackagingConfiguration_StreamSelectionPropertyValidator)(properties.streamSelection));
    return errors.wrap('supplied properties not correct for "HlsManifestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsManifest` resource
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsManifest` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationHlsManifestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_HlsManifestPropertyValidator(properties).assertSuccess();
    return {
        AdMarkers: cdk.stringToCloudFormation(properties.adMarkers),
        IncludeIframeOnlyStream: cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
        ManifestName: cdk.stringToCloudFormation(properties.manifestName),
        ProgramDateTimeIntervalSeconds: cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
        RepeatExtXKey: cdk.booleanToCloudFormation(properties.repeatExtXKey),
        StreamSelection: cfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsManifestProperty>();
    ret.addPropertyResult('adMarkers', 'AdMarkers', properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined);
    ret.addPropertyResult('includeIframeOnlyStream', 'IncludeIframeOnlyStream', properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined);
    ret.addPropertyResult('manifestName', 'ManifestName', properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined);
    ret.addPropertyResult('programDateTimeIntervalSeconds', 'ProgramDateTimeIntervalSeconds', properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined);
    ret.addPropertyResult('repeatExtXKey', 'RepeatExtXKey', properties.RepeatExtXKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RepeatExtXKey) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses HTTP Live Streaming (HLS) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html
     */
    export interface HlsPackageProperty {
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-encryption
         */
        readonly encryption?: CfnPackagingConfiguration.HlsEncryptionProperty | cdk.IResolvable;
        /**
         * A list of HLS manifest configurations that are available from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-hlsmanifests
         */
        readonly hlsManifests: Array<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * When enabled, MediaPackage passes through digital video broadcasting (DVB) subtitles into the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-includedvbsubtitles
         */
        readonly includeDvbSubtitles?: boolean | cdk.IResolvable;
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
        /**
         * When true, AWS Elemental MediaPackage bundles all audio tracks in a rendition group. All other tracks in the stream can be used with any audio rendition from the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-useaudiorenditiongroup
         */
        readonly useAudioRenditionGroup?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsPackageProperty`
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_HlsPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryption', CfnPackagingConfiguration_HlsEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('hlsManifests', cdk.requiredValidator)(properties.hlsManifests));
    errors.collect(cdk.propertyValidator('hlsManifests', cdk.listValidator(CfnPackagingConfiguration_HlsManifestPropertyValidator))(properties.hlsManifests));
    errors.collect(cdk.propertyValidator('includeDvbSubtitles', cdk.validateBoolean)(properties.includeDvbSubtitles));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    errors.collect(cdk.propertyValidator('useAudioRenditionGroup', cdk.validateBoolean)(properties.useAudioRenditionGroup));
    return errors.wrap('supplied properties not correct for "HlsPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsPackage` resource
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.HlsPackage` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationHlsPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_HlsPackagePropertyValidator(properties).assertSuccess();
    return {
        Encryption: cfnPackagingConfigurationHlsEncryptionPropertyToCloudFormation(properties.encryption),
        HlsManifests: cdk.listMapper(cfnPackagingConfigurationHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
        IncludeDvbSubtitles: cdk.booleanToCloudFormation(properties.includeDvbSubtitles),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
        UseAudioRenditionGroup: cdk.booleanToCloudFormation(properties.useAudioRenditionGroup),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsPackageProperty>();
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnPackagingConfigurationHlsEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('hlsManifests', 'HlsManifests', cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation)(properties.HlsManifests));
    ret.addPropertyResult('includeDvbSubtitles', 'IncludeDvbSubtitles', properties.IncludeDvbSubtitles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDvbSubtitles) : undefined);
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addPropertyResult('useAudioRenditionGroup', 'UseAudioRenditionGroup', properties.UseAudioRenditionGroup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAudioRenditionGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html
     */
    export interface MssEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html#cfn-mediapackage-packagingconfiguration-mssencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MssEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_MssEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spekeKeyProvider', cdk.requiredValidator)(properties.spekeKeyProvider));
    errors.collect(cdk.propertyValidator('spekeKeyProvider', CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
    return errors.wrap('supplied properties not correct for "MssEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssEncryption` resource
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssEncryption` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationMssEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_MssEncryptionPropertyValidator(properties).assertSuccess();
    return {
        SpekeKeyProvider: cfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.MssEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssEncryptionProperty>();
    ret.addPropertyResult('spekeKeyProvider', 'SpekeKeyProvider', CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a Microsoft Smooth manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html
     */
    export interface MssManifestProperty {
        /**
         * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html#cfn-mediapackage-packagingconfiguration-mssmanifest-manifestname
         */
        readonly manifestName?: string;
        /**
         * Video bitrate limitations for outputs from this packaging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html#cfn-mediapackage-packagingconfiguration-mssmanifest-streamselection
         */
        readonly streamSelection?: CfnPackagingConfiguration.StreamSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MssManifestProperty`
 *
 * @param properties - the TypeScript properties of a `MssManifestProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_MssManifestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifestName', cdk.validateString)(properties.manifestName));
    errors.collect(cdk.propertyValidator('streamSelection', CfnPackagingConfiguration_StreamSelectionPropertyValidator)(properties.streamSelection));
    return errors.wrap('supplied properties not correct for "MssManifestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssManifest` resource
 *
 * @param properties - the TypeScript properties of a `MssManifestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssManifest` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationMssManifestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_MssManifestPropertyValidator(properties).assertSuccess();
    return {
        ManifestName: cdk.stringToCloudFormation(properties.manifestName),
        StreamSelection: cfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.MssManifestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssManifestProperty>();
    ret.addPropertyResult('manifestName', 'ManifestName', properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined);
    ret.addPropertyResult('streamSelection', 'StreamSelection', properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Microsoft Smooth Streaming (MSS) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html
     */
    export interface MssPackageProperty {
        /**
         * Parameters for encrypting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-encryption
         */
        readonly encryption?: CfnPackagingConfiguration.MssEncryptionProperty | cdk.IResolvable;
        /**
         * A list of Microsoft Smooth manifest configurations that are available from this endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-mssmanifests
         */
        readonly mssManifests: Array<CfnPackagingConfiguration.MssManifestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Duration (in seconds) of each fragment. Actual fragments are rounded to the nearest multiple of the source fragment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-segmentdurationseconds
         */
        readonly segmentDurationSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `MssPackageProperty`
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_MssPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryption', CfnPackagingConfiguration_MssEncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('mssManifests', cdk.requiredValidator)(properties.mssManifests));
    errors.collect(cdk.propertyValidator('mssManifests', cdk.listValidator(CfnPackagingConfiguration_MssManifestPropertyValidator))(properties.mssManifests));
    errors.collect(cdk.propertyValidator('segmentDurationSeconds', cdk.validateNumber)(properties.segmentDurationSeconds));
    return errors.wrap('supplied properties not correct for "MssPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssPackage` resource
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.MssPackage` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationMssPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_MssPackagePropertyValidator(properties).assertSuccess();
    return {
        Encryption: cfnPackagingConfigurationMssEncryptionPropertyToCloudFormation(properties.encryption),
        MssManifests: cdk.listMapper(cfnPackagingConfigurationMssManifestPropertyToCloudFormation)(properties.mssManifests),
        SegmentDurationSeconds: cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.MssPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssPackageProperty>();
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnPackagingConfigurationMssEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('mssManifests', 'MssManifests', cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationMssManifestPropertyFromCloudFormation)(properties.MssManifests));
    ret.addPropertyResult('segmentDurationSeconds', 'SegmentDurationSeconds', properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * A configuration for accessing an external Secure Packager and Encoder Key Exchange (SPEKE) service that provides encryption keys.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html
     */
    export interface SpekeKeyProviderProperty {
        /**
         * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-encryptioncontractconfiguration
         */
        readonly encryptionContractConfiguration?: CfnPackagingConfiguration.EncryptionContractConfigurationProperty | cdk.IResolvable;
        /**
         * The ARN for the IAM role that's granted by the key provider to provide access to the key provider API. Valid format: arn:aws:iam::{accountID}:role/{name}
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-rolearn
         */
        readonly roleArn: string;
        /**
         * List of unique identifiers for the DRM systems to use, as defined in the CPIX specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-systemids
         */
        readonly systemIds: string[];
        /**
         * URL for the key provider's key retrieval API endpoint. Must start with https://.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-url
         */
        readonly url: string;
    }
}

/**
 * Determine whether the given properties match those of a `SpekeKeyProviderProperty`
 *
 * @param properties - the TypeScript properties of a `SpekeKeyProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionContractConfiguration', CfnPackagingConfiguration_EncryptionContractConfigurationPropertyValidator)(properties.encryptionContractConfiguration));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('systemIds', cdk.requiredValidator)(properties.systemIds));
    errors.collect(cdk.propertyValidator('systemIds', cdk.listValidator(cdk.validateString))(properties.systemIds));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "SpekeKeyProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.SpekeKeyProvider` resource
 *
 * @param properties - the TypeScript properties of a `SpekeKeyProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.SpekeKeyProvider` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_SpekeKeyProviderPropertyValidator(properties).assertSuccess();
    return {
        EncryptionContractConfiguration: cfnPackagingConfigurationEncryptionContractConfigurationPropertyToCloudFormation(properties.encryptionContractConfiguration),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SystemIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.systemIds),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.SpekeKeyProviderProperty>();
    ret.addPropertyResult('encryptionContractConfiguration', 'EncryptionContractConfiguration', properties.EncryptionContractConfiguration != null ? CfnPackagingConfigurationEncryptionContractConfigurationPropertyFromCloudFormation(properties.EncryptionContractConfiguration) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('systemIds', 'SystemIds', cfn_parse.FromCloudFormation.getStringArray(properties.SystemIds));
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingConfiguration {
    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html
     */
    export interface StreamSelectionProperty {
        /**
         * The upper limit of the bitrates that this endpoint serves. If the video track exceeds this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 2147483647 bits per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-maxvideobitspersecond
         */
        readonly maxVideoBitsPerSecond?: number;
        /**
         * The lower limit of the bitrates that this endpoint serves. If the video track is below this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 0 bits per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-minvideobitspersecond
         */
        readonly minVideoBitsPerSecond?: number;
        /**
         * Order in which the different video bitrates are presented to the player.
         *
         * Valid values: `ORIGINAL` , `VIDEO_BITRATE_ASCENDING` , `VIDEO_BITRATE_DESCENDING` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-streamorder
         */
        readonly streamOrder?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingConfiguration_StreamSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxVideoBitsPerSecond', cdk.validateNumber)(properties.maxVideoBitsPerSecond));
    errors.collect(cdk.propertyValidator('minVideoBitsPerSecond', cdk.validateNumber)(properties.minVideoBitsPerSecond));
    errors.collect(cdk.propertyValidator('streamOrder', cdk.validateString)(properties.streamOrder));
    return errors.wrap('supplied properties not correct for "StreamSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.StreamSelection` resource
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingConfiguration.StreamSelection` resource.
 */
// @ts-ignore TS6133
function cfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingConfiguration_StreamSelectionPropertyValidator(properties).assertSuccess();
    return {
        MaxVideoBitsPerSecond: cdk.numberToCloudFormation(properties.maxVideoBitsPerSecond),
        MinVideoBitsPerSecond: cdk.numberToCloudFormation(properties.minVideoBitsPerSecond),
        StreamOrder: cdk.stringToCloudFormation(properties.streamOrder),
    };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.StreamSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.StreamSelectionProperty>();
    ret.addPropertyResult('maxVideoBitsPerSecond', 'MaxVideoBitsPerSecond', properties.MaxVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVideoBitsPerSecond) : undefined);
    ret.addPropertyResult('minVideoBitsPerSecond', 'MinVideoBitsPerSecond', properties.MinVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinVideoBitsPerSecond) : undefined);
    ret.addPropertyResult('streamOrder', 'StreamOrder', properties.StreamOrder != null ? cfn_parse.FromCloudFormation.getString(properties.StreamOrder) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPackagingGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html
 */
export interface CfnPackagingGroupProps {

    /**
     * Unique identifier that you assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-id
     */
    readonly id: string;

    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-authorization
     */
    readonly authorization?: CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable;

    /**
     * The configuration parameters for egress access logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-egressaccesslogs
     */
    readonly egressAccessLogs?: CfnPackagingGroup.LogConfigurationProperty | cdk.IResolvable;

    /**
     * The tags to assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPackagingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackagingGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnPackagingGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorization', CfnPackagingGroup_AuthorizationPropertyValidator)(properties.authorization));
    errors.collect(cdk.propertyValidator('egressAccessLogs', CfnPackagingGroup_LogConfigurationPropertyValidator)(properties.egressAccessLogs));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPackagingGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnPackagingGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup` resource.
 */
// @ts-ignore TS6133
function cfnPackagingGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingGroupPropsValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Authorization: cfnPackagingGroupAuthorizationPropertyToCloudFormation(properties.authorization),
        EgressAccessLogs: cfnPackagingGroupLogConfigurationPropertyToCloudFormation(properties.egressAccessLogs),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPackagingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroupProps>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('authorization', 'Authorization', properties.Authorization != null ? CfnPackagingGroupAuthorizationPropertyFromCloudFormation(properties.Authorization) : undefined);
    ret.addPropertyResult('egressAccessLogs', 'EgressAccessLogs', properties.EgressAccessLogs != null ? CfnPackagingGroupLogConfigurationPropertyFromCloudFormation(properties.EgressAccessLogs) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaPackage::PackagingGroup`
 *
 * Creates a packaging group.
 *
 * The packaging group holds one or more packaging configurations. When you create an asset, you specify the packaging group associated with the asset. The asset has playback endpoints for each packaging configuration within the group.
 *
 * @cloudformationResource AWS::MediaPackage::PackagingGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html
 */
export class CfnPackagingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::PackagingGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPackagingGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPackagingGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the packaging group. You can get this from the response to any request to the packaging group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The URL for the assets in the PackagingGroup.
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * Unique identifier that you assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-id
     */
    public id: string;

    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-authorization
     */
    public authorization: CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable | undefined;

    /**
     * The configuration parameters for egress access logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-egressaccesslogs
     */
    public egressAccessLogs: CfnPackagingGroup.LogConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags to assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::MediaPackage::PackagingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackagingGroupProps) {
        super(scope, id, { type: CfnPackagingGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'id', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));

        this.id = props.id;
        this.authorization = props.authorization;
        this.egressAccessLogs = props.egressAccessLogs;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::PackagingGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackagingGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            id: this.id,
            authorization: this.authorization,
            egressAccessLogs: this.egressAccessLogs,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPackagingGroupPropsToCloudFormation(props);
    }
}

export namespace CfnPackagingGroup {
    /**
     * Parameters for enabling CDN authorization.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html
     */
    export interface AuthorizationProperty {
        /**
         * The Amazon Resource Name (ARN) for the secret in AWS Secrets Manager that is used for CDN authorization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html#cfn-mediapackage-packaginggroup-authorization-cdnidentifiersecret
         */
        readonly cdnIdentifierSecret: string;
        /**
         * The Amazon Resource Name (ARN) for the IAM role that allows AWS Elemental MediaPackage to communicate with AWS Secrets Manager .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html#cfn-mediapackage-packaginggroup-authorization-secretsrolearn
         */
        readonly secretsRoleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingGroup_AuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cdnIdentifierSecret', cdk.requiredValidator)(properties.cdnIdentifierSecret));
    errors.collect(cdk.propertyValidator('cdnIdentifierSecret', cdk.validateString)(properties.cdnIdentifierSecret));
    errors.collect(cdk.propertyValidator('secretsRoleArn', cdk.requiredValidator)(properties.secretsRoleArn));
    errors.collect(cdk.propertyValidator('secretsRoleArn', cdk.validateString)(properties.secretsRoleArn));
    return errors.wrap('supplied properties not correct for "AuthorizationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup.Authorization` resource
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup.Authorization` resource.
 */
// @ts-ignore TS6133
function cfnPackagingGroupAuthorizationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingGroup_AuthorizationPropertyValidator(properties).assertSuccess();
    return {
        CdnIdentifierSecret: cdk.stringToCloudFormation(properties.cdnIdentifierSecret),
        SecretsRoleArn: cdk.stringToCloudFormation(properties.secretsRoleArn),
    };
}

// @ts-ignore TS6133
function CfnPackagingGroupAuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroup.AuthorizationProperty>();
    ret.addPropertyResult('cdnIdentifierSecret', 'CdnIdentifierSecret', cfn_parse.FromCloudFormation.getString(properties.CdnIdentifierSecret));
    ret.addPropertyResult('secretsRoleArn', 'SecretsRoleArn', cfn_parse.FromCloudFormation.getString(properties.SecretsRoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPackagingGroup {
    /**
     * Sets a custom Amazon CloudWatch log group name for egress logs. If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html
     */
    export interface LogConfigurationProperty {
        /**
         * Sets a custom Amazon CloudWatch log group name for egress logs. If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html#cfn-mediapackage-packaginggroup-logconfiguration-loggroupname
         */
        readonly logGroupName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPackagingGroup_LogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    return errors.wrap('supplied properties not correct for "LogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup.LogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaPackage::PackagingGroup.LogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPackagingGroupLogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPackagingGroup_LogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
    };
}

// @ts-ignore TS6133
function CfnPackagingGroupLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingGroup.LogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroup.LogConfigurationProperty>();
    ret.addPropertyResult('logGroupName', 'LogGroupName', properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
