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
export declare class CfnAsset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::Asset";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAsset;
    /**
     * The Amazon Resource Name (ARN) for the asset. You can get this from the response to any request to the asset.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time that the asset was initially submitted for ingest.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     *
     * @cloudformationAttribute EgressEndpoints
     */
    readonly attrEgressEndpoints: cdk.IResolvable;
    /**
     * Unique identifier that you assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-id
     */
    id: string;
    /**
     * The ID of the packaging group associated with this asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-packaginggroupid
     */
    packagingGroupId: string;
    /**
     * The ARN for the source content in Amazon S3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcearn
     */
    sourceArn: string;
    /**
     * The ARN for the IAM role that provides AWS Elemental MediaPackage access to the Amazon S3 bucket where the source content is stored. Valid format: arn:aws:iam::{accountID}:role/{name}
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcerolearn
     */
    sourceRoleArn: string;
    /**
     * Unique identifier for this asset, as it's configured in the key provider service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-resourceid
     */
    resourceId: string | undefined;
    /**
     * The tags to assign to the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::MediaPackage::Asset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssetProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnAsset {
    /**
     * The playback endpoint for a packaging configuration on an asset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html
     */
    interface EgressEndpointProperty {
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
export declare class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::Channel";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel;
    /**
     * The channel's unique system-generated resource name, based on the AWS record.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Unique identifier that you assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-id
     */
    id: string;
    /**
     * Any descriptive information that you want to add to the channel for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-description
     */
    description: string | undefined;
    /**
     * Configures egress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-egressaccesslogs
     */
    egressAccessLogs: CfnChannel.LogConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::MediaPackage::Channel.HlsIngest`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-hlsingest
     */
    hlsIngest: CfnChannel.HlsIngestProperty | cdk.IResolvable | undefined;
    /**
     * Configures ingress access logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-ingressaccesslogs
     */
    ingressAccessLogs: CfnChannel.LogConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The tags to assign to the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::MediaPackage::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnChannelProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnChannel {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html
     */
    interface HlsIngestProperty {
        /**
         * `CfnChannel.HlsIngestProperty.ingestEndpoints`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html#cfn-mediapackage-channel-hlsingest-ingestendpoints
         */
        readonly ingestEndpoints?: Array<CfnChannel.IngestEndpointProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html
     */
    interface IngestEndpointProperty {
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
export declare namespace CfnChannel {
    /**
     * The access log configuration parameters for your channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html
     */
    interface LogConfigurationProperty {
        /**
         * Sets a custom Amazon CloudWatch log group name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html#cfn-mediapackage-channel-logconfiguration-loggroupname
         */
        readonly logGroupName?: string;
    }
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
export declare class CfnOriginEndpoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::OriginEndpoint";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginEndpoint;
    /**
     * The endpoint's unique system-generated resource name, based on the AWS record.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * URL for the key provider’s key retrieval API endpoint. Must start with https://.
     * @cloudformationAttribute Url
     */
    readonly attrUrl: string;
    /**
     * The ID of the channel associated with this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-channelid
     */
    channelId: string;
    /**
     * The manifest ID is required and must be unique within the OriginEndpoint. The ID can't be changed after the endpoint is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-id
     */
    id: string;
    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-authorization
     */
    authorization: CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable | undefined;
    /**
     * Parameters for Common Media Application Format (CMAF) packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-cmafpackage
     */
    cmafPackage: CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable | undefined;
    /**
     * Parameters for DASH packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-dashpackage
     */
    dashPackage: CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable | undefined;
    /**
     * Any descriptive information that you want to add to the endpoint for future identification purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-description
     */
    description: string | undefined;
    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-hlspackage
     */
    hlsPackage: CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable | undefined;
    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-manifestname
     */
    manifestName: string | undefined;
    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-msspackage
     */
    mssPackage: CfnOriginEndpoint.MssPackageProperty | cdk.IResolvable | undefined;
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
    origination: string | undefined;
    /**
     * Maximum duration (seconds) of content to retain for startover playback. Omit this attribute or enter `0` to indicate that startover playback is disabled for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-startoverwindowseconds
     */
    startoverWindowSeconds: number | undefined;
    /**
     * The tags to assign to the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Minimum duration (seconds) of delay to enforce on the playback of live content. Omit this attribute or enter `0` to indicate that there is no time delay in effect for this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-timedelayseconds
     */
    timeDelaySeconds: number | undefined;
    /**
     * The IP addresses that can access this endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-whitelist
     */
    whitelist: string[] | undefined;
    /**
     * Create a new `AWS::MediaPackage::OriginEndpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOriginEndpointProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnOriginEndpoint {
    /**
     * Parameters for enabling CDN authorization on the endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html
     */
    interface AuthorizationProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html
     */
    interface CmafEncryptionProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Parameters for Common Media Application Format (CMAF) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html
     */
    interface CmafPackageProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html
     */
    interface DashEncryptionProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Parameters for DASH packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html
     */
    interface DashPackageProperty {
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
export declare namespace CfnOriginEndpoint {
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
    interface EncryptionContractConfigurationProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html
     */
    interface HlsEncryptionProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * An HTTP Live Streaming (HLS) manifest configuration on a CMAF endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html
     */
    interface HlsManifestProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Parameters for Apple HLS packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html
     */
    interface HlsPackageProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html
     */
    interface MssEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html#cfn-mediapackage-originendpoint-mssencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnOriginEndpoint.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}
export declare namespace CfnOriginEndpoint {
    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html
     */
    interface MssPackageProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Keyprovider settings for DRM.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html
     */
    interface SpekeKeyProviderProperty {
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
export declare namespace CfnOriginEndpoint {
    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html
     */
    interface StreamSelectionProperty {
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
export declare class CfnPackagingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::PackagingConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingConfiguration;
    /**
     * The Amazon Resource Name (ARN) for the packaging configuration. You can get this from the response to any request to the packaging configuration.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Unique identifier that you assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-id
     */
    id: string;
    /**
     * The ID of the packaging group associated with this packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-packaginggroupid
     */
    packagingGroupId: string;
    /**
     * Parameters for CMAF packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-cmafpackage
     */
    cmafPackage: CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable | undefined;
    /**
     * Parameters for DASH-ISO packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-dashpackage
     */
    dashPackage: CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable | undefined;
    /**
     * Parameters for Apple HLS packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-hlspackage
     */
    hlsPackage: CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable | undefined;
    /**
     * Parameters for Microsoft Smooth Streaming packaging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-msspackage
     */
    mssPackage: CfnPackagingConfiguration.MssPackageProperty | cdk.IResolvable | undefined;
    /**
     * The tags to assign to the packaging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::MediaPackage::PackagingConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackagingConfigurationProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html
     */
    interface CmafEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html#cfn-mediapackage-packagingconfiguration-cmafencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Common Media Application Format (CMAF) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html
     */
    interface CmafPackageProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html
     */
    interface DashEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html#cfn-mediapackage-packagingconfiguration-dashencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a DASH manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html
     */
    interface DashManifestProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Dynamic Adaptive Streaming over HTTP (DASH) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html
     */
    interface DashPackageProperty {
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
export declare namespace CfnPackagingConfiguration {
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
    interface EncryptionContractConfigurationProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html
     */
    interface HlsEncryptionProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for an HLS manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html
     */
    interface HlsManifestProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses HTTP Live Streaming (HLS) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html
     */
    interface HlsPackageProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Holds encryption information so that access to the content can be controlled by a DRM solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html
     */
    interface MssEncryptionProperty {
        /**
         * Parameters for the SPEKE key provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html#cfn-mediapackage-packagingconfiguration-mssencryption-spekekeyprovider
         */
        readonly spekeKeyProvider: CfnPackagingConfiguration.SpekeKeyProviderProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a Microsoft Smooth manifest.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html
     */
    interface MssManifestProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Parameters for a packaging configuration that uses Microsoft Smooth Streaming (MSS) packaging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html
     */
    interface MssPackageProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * A configuration for accessing an external Secure Packager and Encoder Key Exchange (SPEKE) service that provides encryption keys.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html
     */
    interface SpekeKeyProviderProperty {
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
export declare namespace CfnPackagingConfiguration {
    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html
     */
    interface StreamSelectionProperty {
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
export declare class CfnPackagingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaPackage::PackagingGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingGroup;
    /**
     * The Amazon Resource Name (ARN) for the packaging group. You can get this from the response to any request to the packaging group.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The URL for the assets in the PackagingGroup.
     * @cloudformationAttribute DomainName
     */
    readonly attrDomainName: string;
    /**
     * Unique identifier that you assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-id
     */
    id: string;
    /**
     * Parameters for CDN authorization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-authorization
     */
    authorization: CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable | undefined;
    /**
     * The configuration parameters for egress access logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-egressaccesslogs
     */
    egressAccessLogs: CfnPackagingGroup.LogConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The tags to assign to the packaging group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::MediaPackage::PackagingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackagingGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnPackagingGroup {
    /**
     * Parameters for enabling CDN authorization.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html
     */
    interface AuthorizationProperty {
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
export declare namespace CfnPackagingGroup {
    /**
     * Sets a custom Amazon CloudWatch log group name for egress logs. If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html
     */
    interface LogConfigurationProperty {
        /**
         * Sets a custom Amazon CloudWatch log group name for egress logs. If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html#cfn-mediapackage-packaginggroup-logconfiguration-loggroupname
         */
        readonly logGroupName?: string;
    }
}
