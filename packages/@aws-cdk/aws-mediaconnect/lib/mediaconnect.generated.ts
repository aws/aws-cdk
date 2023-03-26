// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:12.645Z","fingerprint":"20KM9kL+xl9txWRcWEgZ3oeSxoQqxYqHE6ZI/sqD6OQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnFlow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html
 */
export interface CfnFlowProps {

    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-name
     */
    readonly name: string;

    /**
     * The settings for the source that you want to use for the new flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-source
     */
    readonly source: CfnFlow.SourceProperty | cdk.IResolvable;

    /**
     * The Availability Zone that you want to create the flow in. These options are limited to the Availability Zones within the current AWS Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The settings for source failover.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-sourcefailoverconfig
     */
    readonly sourceFailoverConfig?: CfnFlow.FailoverConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFlowProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', CfnFlow_SourcePropertyValidator)(properties.source));
    errors.collect(cdk.propertyValidator('sourceFailoverConfig', CfnFlow_FailoverConfigPropertyValidator)(properties.sourceFailoverConfig));
    return errors.wrap('supplied properties not correct for "CfnFlowProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::Flow` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::Flow` resource.
 */
// @ts-ignore TS6133
function cfnFlowPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Source: cfnFlowSourcePropertyToCloudFormation(properties.source),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        SourceFailoverConfig: cfnFlowFailoverConfigPropertyToCloudFormation(properties.sourceFailoverConfig),
    };
}

// @ts-ignore TS6133
function CfnFlowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('source', 'Source', CfnFlowSourcePropertyFromCloudFormation(properties.Source));
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('sourceFailoverConfig', 'SourceFailoverConfig', properties.SourceFailoverConfig != null ? CfnFlowFailoverConfigPropertyFromCloudFormation(properties.SourceFailoverConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaConnect::Flow`
 *
 * The AWS::MediaConnect::Flow resource defines a connection between one or more video sources and one or more outputs. For each flow, you specify the transport protocol to use, encryption information, and details for any outputs or entitlements that you want. AWS Elemental MediaConnect returns an ingest endpoint where you can send your live video as a single unicast stream. The service replicates and distributes the video to every output that you specify, whether inside or outside the AWS Cloud. You can also set up entitlements on a flow to allow other AWS accounts to access your content.
 *
 * @cloudformationResource AWS::MediaConnect::Flow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html
 */
export class CfnFlow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaConnect::Flow";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlow {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlow(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the flow.
     * @cloudformationAttribute FlowArn
     */
    public readonly attrFlowArn: string;

    /**
     * The Availability Zone that the flow was created in. These options are limited to the Availability Zones within the current AWS Region.
     * @cloudformationAttribute FlowAvailabilityZone
     */
    public readonly attrFlowAvailabilityZone: string;

    /**
     * The IP address that the flow listens on for incoming content.
     * @cloudformationAttribute Source.IngestIp
     */
    public readonly attrSourceIngestIp: string;

    /**
     * The ARN of the source.
     * @cloudformationAttribute Source.SourceArn
     */
    public readonly attrSourceSourceArn: string;

    /**
     * The port that the flow will be listening on for incoming content.
     * @cloudformationAttribute Source.SourceIngestPort
     */
    public readonly attrSourceSourceIngestPort: string;

    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-name
     */
    public name: string;

    /**
     * The settings for the source that you want to use for the new flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-source
     */
    public source: CfnFlow.SourceProperty | cdk.IResolvable;

    /**
     * The Availability Zone that you want to create the flow in. These options are limited to the Availability Zones within the current AWS Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * The settings for source failover.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-sourcefailoverconfig
     */
    public sourceFailoverConfig: CfnFlow.FailoverConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::MediaConnect::Flow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowProps) {
        super(scope, id, { type: CfnFlow.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'source', this);
        this.attrFlowArn = cdk.Token.asString(this.getAtt('FlowArn', cdk.ResolutionTypeHint.STRING));
        this.attrFlowAvailabilityZone = cdk.Token.asString(this.getAtt('FlowAvailabilityZone', cdk.ResolutionTypeHint.STRING));
        this.attrSourceIngestIp = cdk.Token.asString(this.getAtt('Source.IngestIp', cdk.ResolutionTypeHint.STRING));
        this.attrSourceSourceArn = cdk.Token.asString(this.getAtt('Source.SourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrSourceSourceIngestPort = cdk.Token.asString(this.getAtt('Source.SourceIngestPort', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.source = props.source;
        this.availabilityZone = props.availabilityZone;
        this.sourceFailoverConfig = props.sourceFailoverConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlow.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            source: this.source,
            availabilityZone: this.availabilityZone,
            sourceFailoverConfig: this.sourceFailoverConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowPropsToCloudFormation(props);
    }
}

export namespace CfnFlow {
    /**
     * Information about the encryption of the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html
     */
    export interface EncryptionProperty {
        /**
         * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-algorithm
         */
        readonly algorithm?: string;
        /**
         * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content. This parameter is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-deviceid
         */
        readonly deviceId?: string;
        /**
         * The type of key that is used for the encryption. If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-keytype
         */
        readonly keyType?: string;
        /**
         * The AWS Region that the API Gateway proxy endpoint was created in. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-region
         */
        readonly region?: string;
        /**
         * An identifier for the content. The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-resourceid
         */
        readonly resourceId?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-rolearn
         */
        readonly roleArn: string;
        /**
         * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-secretarn
         */
        readonly secretArn?: string;
        /**
         * The URL from the API Gateway proxy that you set up to talk to your key server. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlow_EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithm', cdk.validateString)(properties.algorithm));
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "EncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.Encryption` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.Encryption` resource.
 */
// @ts-ignore TS6133
function cfnFlowEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlow_EncryptionPropertyValidator(properties).assertSuccess();
    return {
        Algorithm: cdk.stringToCloudFormation(properties.algorithm),
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
        Region: cdk.stringToCloudFormation(properties.region),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnFlowEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.EncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.EncryptionProperty>();
    ret.addPropertyResult('algorithm', 'Algorithm', properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined);
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('deviceId', 'DeviceId', properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretArn', 'SecretArn', properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFlow {
    /**
     * The settings for source failover.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html
     */
    export interface FailoverConfigProperty {
        /**
         * The type of failover you choose for this flow. MERGE combines the source streams into a single stream, allowing graceful recovery from any single-source loss. FAILOVER allows switching between different streams.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-failovermode
         */
        readonly failoverMode?: string;
        /**
         * The size of the buffer (delay) that the service maintains. A larger buffer means a longer delay in transmitting the stream, but more room for error correction. A smaller buffer means a shorter delay, but less room for error correction. You can choose a value from 100-500 ms. If you keep this field blank, the service uses the default value of 200 ms. This setting only applies when Failover Mode is set to MERGE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-recoverywindow
         */
        readonly recoveryWindow?: number;
        /**
         * The priority you want to assign to a source. You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-sourcepriority
         */
        readonly sourcePriority?: CfnFlow.SourcePriorityProperty | cdk.IResolvable;
        /**
         * The state of source failover on the flow. If the state is disabled, the flow can have only one source. If the state is enabled, the flow can have one or two sources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-state
         */
        readonly state?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FailoverConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlow_FailoverConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('failoverMode', cdk.validateString)(properties.failoverMode));
    errors.collect(cdk.propertyValidator('recoveryWindow', cdk.validateNumber)(properties.recoveryWindow));
    errors.collect(cdk.propertyValidator('sourcePriority', CfnFlow_SourcePriorityPropertyValidator)(properties.sourcePriority));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    return errors.wrap('supplied properties not correct for "FailoverConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.FailoverConfig` resource
 *
 * @param properties - the TypeScript properties of a `FailoverConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.FailoverConfig` resource.
 */
// @ts-ignore TS6133
function cfnFlowFailoverConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlow_FailoverConfigPropertyValidator(properties).assertSuccess();
    return {
        FailoverMode: cdk.stringToCloudFormation(properties.failoverMode),
        RecoveryWindow: cdk.numberToCloudFormation(properties.recoveryWindow),
        SourcePriority: cfnFlowSourcePriorityPropertyToCloudFormation(properties.sourcePriority),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnFlowFailoverConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.FailoverConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.FailoverConfigProperty>();
    ret.addPropertyResult('failoverMode', 'FailoverMode', properties.FailoverMode != null ? cfn_parse.FromCloudFormation.getString(properties.FailoverMode) : undefined);
    ret.addPropertyResult('recoveryWindow', 'RecoveryWindow', properties.RecoveryWindow != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecoveryWindow) : undefined);
    ret.addPropertyResult('sourcePriority', 'SourcePriority', properties.SourcePriority != null ? CfnFlowSourcePriorityPropertyFromCloudFormation(properties.SourcePriority) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFlow {
    /**
     * The details of the sources of the flow.
     *
     * If you are creating a flow with a VPC source, you must first create the flow with a temporary standard source by doing the following:
     *
     * - Use CloudFormation to create a flow with a standard source that uses the flow’s public IP address.
     * - Use CloudFormation to create the VPC interface to add to this flow. This can also be done as part of the previous step.
     * - After CloudFormation has created the flow and the VPC interface, update the source to point to the VPC interface that you created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html
     */
    export interface SourceProperty {
        /**
         * The type of encryption that is used on the content ingested from the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-decryption
         */
        readonly decryption?: CfnFlow.EncryptionProperty | cdk.IResolvable;
        /**
         * A description of the source. This description is not visible outside of the current AWS account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-description
         */
        readonly description?: string;
        /**
         * The ARN of the entitlement that allows you to subscribe to content that comes from another AWS account. The entitlement is set by the content originator and the ARN is generated as part of the originator’s flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-entitlementarn
         */
        readonly entitlementArn?: string;
        /**
         * The IP address that the flow listens on for incoming content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-ingestip
         */
        readonly ingestIp?: string;
        /**
         * The port that the flow listens on for incoming content. If the protocol of the source is Zixi, the port must be set to 2088.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-ingestport
         */
        readonly ingestPort?: number;
        /**
         * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-maxbitrate
         */
        readonly maxBitrate?: number;
        /**
         * The maximum latency in milliseconds for a RIST or Zixi-based source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-maxlatency
         */
        readonly maxLatency?: number;
        /**
         * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-minlatency
         */
        readonly minLatency?: number;
        /**
         * The name of the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-name
         */
        readonly name?: string;
        /**
         * The protocol that is used by the source. AWS CloudFormation does not currently support CDI or ST 2110 JPEG XS source protocols.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-protocol
         */
        readonly protocol?: string;
        /**
         * The port that the flow uses to send outbound requests to initiate connection with the sender.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sendercontrolport
         */
        readonly senderControlPort?: number;
        /**
         * The IP address that the flow communicates with to initiate connection with the sender.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-senderipaddress
         */
        readonly senderIpAddress?: string;
        /**
         * The ARN of the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcearn
         */
        readonly sourceArn?: string;
        /**
         * The port that the flow will be listening on for incoming content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourceingestport
         */
        readonly sourceIngestPort?: string;
        /**
         * Source IP or domain name for SRT-caller protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcelisteneraddress
         */
        readonly sourceListenerAddress?: string;
        /**
         * Source port for SRT-caller protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcelistenerport
         */
        readonly sourceListenerPort?: number;
        /**
         * The stream ID that you want to use for the transport. This parameter applies only to Zixi-based streams.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-streamid
         */
        readonly streamId?: string;
        /**
         * The name of the VPC interface that the source content comes from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-vpcinterfacename
         */
        readonly vpcInterfaceName?: string;
        /**
         * The range of IP addresses that are allowed to contribute content to your source. Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-whitelistcidr
         */
        readonly whitelistCidr?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlow_SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('decryption', CfnFlow_EncryptionPropertyValidator)(properties.decryption));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('entitlementArn', cdk.validateString)(properties.entitlementArn));
    errors.collect(cdk.propertyValidator('ingestIp', cdk.validateString)(properties.ingestIp));
    errors.collect(cdk.propertyValidator('ingestPort', cdk.validateNumber)(properties.ingestPort));
    errors.collect(cdk.propertyValidator('maxBitrate', cdk.validateNumber)(properties.maxBitrate));
    errors.collect(cdk.propertyValidator('maxLatency', cdk.validateNumber)(properties.maxLatency));
    errors.collect(cdk.propertyValidator('minLatency', cdk.validateNumber)(properties.minLatency));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('senderControlPort', cdk.validateNumber)(properties.senderControlPort));
    errors.collect(cdk.propertyValidator('senderIpAddress', cdk.validateString)(properties.senderIpAddress));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.validateString)(properties.sourceArn));
    errors.collect(cdk.propertyValidator('sourceIngestPort', cdk.validateString)(properties.sourceIngestPort));
    errors.collect(cdk.propertyValidator('sourceListenerAddress', cdk.validateString)(properties.sourceListenerAddress));
    errors.collect(cdk.propertyValidator('sourceListenerPort', cdk.validateNumber)(properties.sourceListenerPort));
    errors.collect(cdk.propertyValidator('streamId', cdk.validateString)(properties.streamId));
    errors.collect(cdk.propertyValidator('vpcInterfaceName', cdk.validateString)(properties.vpcInterfaceName));
    errors.collect(cdk.propertyValidator('whitelistCidr', cdk.validateString)(properties.whitelistCidr));
    return errors.wrap('supplied properties not correct for "SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.Source` resource
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.Source` resource.
 */
// @ts-ignore TS6133
function cfnFlowSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlow_SourcePropertyValidator(properties).assertSuccess();
    return {
        Decryption: cfnFlowEncryptionPropertyToCloudFormation(properties.decryption),
        Description: cdk.stringToCloudFormation(properties.description),
        EntitlementArn: cdk.stringToCloudFormation(properties.entitlementArn),
        IngestIp: cdk.stringToCloudFormation(properties.ingestIp),
        IngestPort: cdk.numberToCloudFormation(properties.ingestPort),
        MaxBitrate: cdk.numberToCloudFormation(properties.maxBitrate),
        MaxLatency: cdk.numberToCloudFormation(properties.maxLatency),
        MinLatency: cdk.numberToCloudFormation(properties.minLatency),
        Name: cdk.stringToCloudFormation(properties.name),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        SenderControlPort: cdk.numberToCloudFormation(properties.senderControlPort),
        SenderIpAddress: cdk.stringToCloudFormation(properties.senderIpAddress),
        SourceArn: cdk.stringToCloudFormation(properties.sourceArn),
        SourceIngestPort: cdk.stringToCloudFormation(properties.sourceIngestPort),
        SourceListenerAddress: cdk.stringToCloudFormation(properties.sourceListenerAddress),
        SourceListenerPort: cdk.numberToCloudFormation(properties.sourceListenerPort),
        StreamId: cdk.stringToCloudFormation(properties.streamId),
        VpcInterfaceName: cdk.stringToCloudFormation(properties.vpcInterfaceName),
        WhitelistCidr: cdk.stringToCloudFormation(properties.whitelistCidr),
    };
}

// @ts-ignore TS6133
function CfnFlowSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourceProperty>();
    ret.addPropertyResult('decryption', 'Decryption', properties.Decryption != null ? CfnFlowEncryptionPropertyFromCloudFormation(properties.Decryption) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('entitlementArn', 'EntitlementArn', properties.EntitlementArn != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementArn) : undefined);
    ret.addPropertyResult('ingestIp', 'IngestIp', properties.IngestIp != null ? cfn_parse.FromCloudFormation.getString(properties.IngestIp) : undefined);
    ret.addPropertyResult('ingestPort', 'IngestPort', properties.IngestPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngestPort) : undefined);
    ret.addPropertyResult('maxBitrate', 'MaxBitrate', properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined);
    ret.addPropertyResult('maxLatency', 'MaxLatency', properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined);
    ret.addPropertyResult('minLatency', 'MinLatency', properties.MinLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinLatency) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('senderControlPort', 'SenderControlPort', properties.SenderControlPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SenderControlPort) : undefined);
    ret.addPropertyResult('senderIpAddress', 'SenderIpAddress', properties.SenderIpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SenderIpAddress) : undefined);
    ret.addPropertyResult('sourceArn', 'SourceArn', properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined);
    ret.addPropertyResult('sourceIngestPort', 'SourceIngestPort', properties.SourceIngestPort != null ? cfn_parse.FromCloudFormation.getString(properties.SourceIngestPort) : undefined);
    ret.addPropertyResult('sourceListenerAddress', 'SourceListenerAddress', properties.SourceListenerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SourceListenerAddress) : undefined);
    ret.addPropertyResult('sourceListenerPort', 'SourceListenerPort', properties.SourceListenerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SourceListenerPort) : undefined);
    ret.addPropertyResult('streamId', 'StreamId', properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined);
    ret.addPropertyResult('vpcInterfaceName', 'VpcInterfaceName', properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined);
    ret.addPropertyResult('whitelistCidr', 'WhitelistCidr', properties.WhitelistCidr != null ? cfn_parse.FromCloudFormation.getString(properties.WhitelistCidr) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFlow {
    /**
     * The priority you want to assign to a source. You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-sourcepriority.html
     */
    export interface SourcePriorityProperty {
        /**
         * The name of the source you choose as the primary source for this flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-sourcepriority.html#cfn-mediaconnect-flow-sourcepriority-primarysource
         */
        readonly primarySource: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourcePriorityProperty`
 *
 * @param properties - the TypeScript properties of a `SourcePriorityProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlow_SourcePriorityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('primarySource', cdk.requiredValidator)(properties.primarySource));
    errors.collect(cdk.propertyValidator('primarySource', cdk.validateString)(properties.primarySource));
    return errors.wrap('supplied properties not correct for "SourcePriorityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.SourcePriority` resource
 *
 * @param properties - the TypeScript properties of a `SourcePriorityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::Flow.SourcePriority` resource.
 */
// @ts-ignore TS6133
function cfnFlowSourcePriorityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlow_SourcePriorityPropertyValidator(properties).assertSuccess();
    return {
        PrimarySource: cdk.stringToCloudFormation(properties.primarySource),
    };
}

// @ts-ignore TS6133
function CfnFlowSourcePriorityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.SourcePriorityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourcePriorityProperty>();
    ret.addPropertyResult('primarySource', 'PrimarySource', cfn_parse.FromCloudFormation.getString(properties.PrimarySource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFlowEntitlement`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html
 */
export interface CfnFlowEntitlementProps {

    /**
     * A description of the entitlement. This description appears only on the MediaConnect console and is not visible outside of the current AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-description
     */
    readonly description: string;

    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-flowarn
     */
    readonly flowArn: string;

    /**
     * The name of the entitlement. This value must be unique within the current flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-name
     */
    readonly name: string;

    /**
     * The AWS account IDs that you want to share your content with. The receiving accounts (subscribers) will be allowed to create their own flows using your content as the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-subscribers
     */
    readonly subscribers: string[];

    /**
     * The percentage of the entitlement data transfer fee that you want the subscriber to be responsible for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-datatransfersubscriberfeepercent
     */
    readonly dataTransferSubscriberFeePercent?: number;

    /**
     * The type of encryption that MediaConnect will use on the output that is associated with the entitlement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-encryption
     */
    readonly encryption?: CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable;

    /**
     * An indication of whether the new entitlement should be enabled or disabled as soon as it is created. If you don’t specify the entitlementStatus field in your request, MediaConnect sets it to ENABLED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-entitlementstatus
     */
    readonly entitlementStatus?: string;
}

/**
 * Determine whether the given properties match those of a `CfnFlowEntitlementProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowEntitlementProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowEntitlementPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataTransferSubscriberFeePercent', cdk.validateNumber)(properties.dataTransferSubscriberFeePercent));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('encryption', CfnFlowEntitlement_EncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('entitlementStatus', cdk.validateString)(properties.entitlementStatus));
    errors.collect(cdk.propertyValidator('flowArn', cdk.requiredValidator)(properties.flowArn));
    errors.collect(cdk.propertyValidator('flowArn', cdk.validateString)(properties.flowArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('subscribers', cdk.requiredValidator)(properties.subscribers));
    errors.collect(cdk.propertyValidator('subscribers', cdk.listValidator(cdk.validateString))(properties.subscribers));
    return errors.wrap('supplied properties not correct for "CfnFlowEntitlementProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowEntitlement` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowEntitlementProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowEntitlement` resource.
 */
// @ts-ignore TS6133
function cfnFlowEntitlementPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowEntitlementPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        FlowArn: cdk.stringToCloudFormation(properties.flowArn),
        Name: cdk.stringToCloudFormation(properties.name),
        Subscribers: cdk.listMapper(cdk.stringToCloudFormation)(properties.subscribers),
        DataTransferSubscriberFeePercent: cdk.numberToCloudFormation(properties.dataTransferSubscriberFeePercent),
        Encryption: cfnFlowEntitlementEncryptionPropertyToCloudFormation(properties.encryption),
        EntitlementStatus: cdk.stringToCloudFormation(properties.entitlementStatus),
    };
}

// @ts-ignore TS6133
function CfnFlowEntitlementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowEntitlementProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowEntitlementProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('flowArn', 'FlowArn', cfn_parse.FromCloudFormation.getString(properties.FlowArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('subscribers', 'Subscribers', cfn_parse.FromCloudFormation.getStringArray(properties.Subscribers));
    ret.addPropertyResult('dataTransferSubscriberFeePercent', 'DataTransferSubscriberFeePercent', properties.DataTransferSubscriberFeePercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.DataTransferSubscriberFeePercent) : undefined);
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnFlowEntitlementEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('entitlementStatus', 'EntitlementStatus', properties.EntitlementStatus != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementStatus) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaConnect::FlowEntitlement`
 *
 * The AWS::MediaConnect::FlowEntitlement resource defines the permission that an AWS account grants to another AWS account to allow access to the content in a specific AWS Elemental MediaConnect flow. The content originator grants an entitlement to a specific AWS account (the subscriber). When an entitlement is granted, the subscriber can create a flow using the originator's flow as the source. Each flow can have up to 50 entitlements.
 *
 * @cloudformationResource AWS::MediaConnect::FlowEntitlement
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html
 */
export class CfnFlowEntitlement extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaConnect::FlowEntitlement";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowEntitlement {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowEntitlementPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlowEntitlement(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The entitlement ARN.
     * @cloudformationAttribute EntitlementArn
     */
    public readonly attrEntitlementArn: string;

    /**
     * A description of the entitlement. This description appears only on the MediaConnect console and is not visible outside of the current AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-description
     */
    public description: string;

    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-flowarn
     */
    public flowArn: string;

    /**
     * The name of the entitlement. This value must be unique within the current flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-name
     */
    public name: string;

    /**
     * The AWS account IDs that you want to share your content with. The receiving accounts (subscribers) will be allowed to create their own flows using your content as the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-subscribers
     */
    public subscribers: string[];

    /**
     * The percentage of the entitlement data transfer fee that you want the subscriber to be responsible for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-datatransfersubscriberfeepercent
     */
    public dataTransferSubscriberFeePercent: number | undefined;

    /**
     * The type of encryption that MediaConnect will use on the output that is associated with the entitlement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-encryption
     */
    public encryption: CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable | undefined;

    /**
     * An indication of whether the new entitlement should be enabled or disabled as soon as it is created. If you don’t specify the entitlementStatus field in your request, MediaConnect sets it to ENABLED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-entitlementstatus
     */
    public entitlementStatus: string | undefined;

    /**
     * Create a new `AWS::MediaConnect::FlowEntitlement`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowEntitlementProps) {
        super(scope, id, { type: CfnFlowEntitlement.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'flowArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'subscribers', this);
        this.attrEntitlementArn = cdk.Token.asString(this.getAtt('EntitlementArn', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.flowArn = props.flowArn;
        this.name = props.name;
        this.subscribers = props.subscribers;
        this.dataTransferSubscriberFeePercent = props.dataTransferSubscriberFeePercent;
        this.encryption = props.encryption;
        this.entitlementStatus = props.entitlementStatus;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowEntitlement.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            flowArn: this.flowArn,
            name: this.name,
            subscribers: this.subscribers,
            dataTransferSubscriberFeePercent: this.dataTransferSubscriberFeePercent,
            encryption: this.encryption,
            entitlementStatus: this.entitlementStatus,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowEntitlementPropsToCloudFormation(props);
    }
}

export namespace CfnFlowEntitlement {
    /**
     * Information about the encryption of the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html
     */
    export interface EncryptionProperty {
        /**
         * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-algorithm
         */
        readonly algorithm: string;
        /**
         * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content. This parameter is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-deviceid
         */
        readonly deviceId?: string;
        /**
         * The type of key that is used for the encryption. If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-keytype
         */
        readonly keyType?: string;
        /**
         * The AWS Region that the API Gateway proxy endpoint was created in. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-region
         */
        readonly region?: string;
        /**
         * An identifier for the content. The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-resourceid
         */
        readonly resourceId?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-rolearn
         */
        readonly roleArn: string;
        /**
         * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-secretarn
         */
        readonly secretArn?: string;
        /**
         * The URL from the API Gateway proxy that you set up to talk to your key server. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlowEntitlement_EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithm', cdk.requiredValidator)(properties.algorithm));
    errors.collect(cdk.propertyValidator('algorithm', cdk.validateString)(properties.algorithm));
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "EncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowEntitlement.Encryption` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowEntitlement.Encryption` resource.
 */
// @ts-ignore TS6133
function cfnFlowEntitlementEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowEntitlement_EncryptionPropertyValidator(properties).assertSuccess();
    return {
        Algorithm: cdk.stringToCloudFormation(properties.algorithm),
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
        Region: cdk.stringToCloudFormation(properties.region),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnFlowEntitlementEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowEntitlement.EncryptionProperty>();
    ret.addPropertyResult('algorithm', 'Algorithm', cfn_parse.FromCloudFormation.getString(properties.Algorithm));
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('deviceId', 'DeviceId', properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretArn', 'SecretArn', properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFlowOutput`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html
 */
export interface CfnFlowOutputProps {

    /**
     * The Amazon Resource Name (ARN) of the flow this output is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-flowarn
     */
    readonly flowArn: string;

    /**
     * The protocol to use for the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-protocol
     */
    readonly protocol: string;

    /**
     * The range of IP addresses that are allowed to initiate output requests to this flow. Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-cidrallowlist
     */
    readonly cidrAllowList?: string[];

    /**
     * A description of the output. This description is not visible outside of the current AWS account even if the account grants entitlements to other accounts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-description
     */
    readonly description?: string;

    /**
     * The IP address where you want to send the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-destination
     */
    readonly destination?: string;

    /**
     * The encryption credentials that you want to use for the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-encryption
     */
    readonly encryption?: CfnFlowOutput.EncryptionProperty | cdk.IResolvable;

    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-maxlatency
     */
    readonly maxLatency?: number;

    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-minlatency
     */
    readonly minLatency?: number;

    /**
     * The name of the VPC interface.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-name
     */
    readonly name?: string;

    /**
     * The port to use when MediaConnect distributes content to the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-port
     */
    readonly port?: number;

    /**
     * The identifier that is assigned to the Zixi receiver. This parameter applies only to outputs that use Zixi pull.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-remoteid
     */
    readonly remoteId?: string;

    /**
     * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-smoothinglatency
     */
    readonly smoothingLatency?: number;

    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-streamid
     */
    readonly streamId?: string;

    /**
     * The VPC interface that you want to send your output to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-vpcinterfaceattachment
     */
    readonly vpcInterfaceAttachment?: CfnFlowOutput.VpcInterfaceAttachmentProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFlowOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowOutputProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowOutputPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cidrAllowList', cdk.listValidator(cdk.validateString))(properties.cidrAllowList));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('encryption', CfnFlowOutput_EncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('flowArn', cdk.requiredValidator)(properties.flowArn));
    errors.collect(cdk.propertyValidator('flowArn', cdk.validateString)(properties.flowArn));
    errors.collect(cdk.propertyValidator('maxLatency', cdk.validateNumber)(properties.maxLatency));
    errors.collect(cdk.propertyValidator('minLatency', cdk.validateNumber)(properties.minLatency));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('remoteId', cdk.validateString)(properties.remoteId));
    errors.collect(cdk.propertyValidator('smoothingLatency', cdk.validateNumber)(properties.smoothingLatency));
    errors.collect(cdk.propertyValidator('streamId', cdk.validateString)(properties.streamId));
    errors.collect(cdk.propertyValidator('vpcInterfaceAttachment', CfnFlowOutput_VpcInterfaceAttachmentPropertyValidator)(properties.vpcInterfaceAttachment));
    return errors.wrap('supplied properties not correct for "CfnFlowOutputProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowOutputProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput` resource.
 */
// @ts-ignore TS6133
function cfnFlowOutputPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowOutputPropsValidator(properties).assertSuccess();
    return {
        FlowArn: cdk.stringToCloudFormation(properties.flowArn),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        CidrAllowList: cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrAllowList),
        Description: cdk.stringToCloudFormation(properties.description),
        Destination: cdk.stringToCloudFormation(properties.destination),
        Encryption: cfnFlowOutputEncryptionPropertyToCloudFormation(properties.encryption),
        MaxLatency: cdk.numberToCloudFormation(properties.maxLatency),
        MinLatency: cdk.numberToCloudFormation(properties.minLatency),
        Name: cdk.stringToCloudFormation(properties.name),
        Port: cdk.numberToCloudFormation(properties.port),
        RemoteId: cdk.stringToCloudFormation(properties.remoteId),
        SmoothingLatency: cdk.numberToCloudFormation(properties.smoothingLatency),
        StreamId: cdk.stringToCloudFormation(properties.streamId),
        VpcInterfaceAttachment: cfnFlowOutputVpcInterfaceAttachmentPropertyToCloudFormation(properties.vpcInterfaceAttachment),
    };
}

// @ts-ignore TS6133
function CfnFlowOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowOutputProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutputProps>();
    ret.addPropertyResult('flowArn', 'FlowArn', cfn_parse.FromCloudFormation.getString(properties.FlowArn));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('cidrAllowList', 'CidrAllowList', properties.CidrAllowList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CidrAllowList) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined);
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnFlowOutputEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('maxLatency', 'MaxLatency', properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined);
    ret.addPropertyResult('minLatency', 'MinLatency', properties.MinLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinLatency) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('remoteId', 'RemoteId', properties.RemoteId != null ? cfn_parse.FromCloudFormation.getString(properties.RemoteId) : undefined);
    ret.addPropertyResult('smoothingLatency', 'SmoothingLatency', properties.SmoothingLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.SmoothingLatency) : undefined);
    ret.addPropertyResult('streamId', 'StreamId', properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined);
    ret.addPropertyResult('vpcInterfaceAttachment', 'VpcInterfaceAttachment', properties.VpcInterfaceAttachment != null ? CfnFlowOutputVpcInterfaceAttachmentPropertyFromCloudFormation(properties.VpcInterfaceAttachment) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaConnect::FlowOutput`
 *
 * The AWS::MediaConnect::FlowOutput resource defines the destination address, protocol, and port that AWS Elemental MediaConnect sends the ingested video to. Each flow can have up to 50 outputs. An output can have the same protocol or a different protocol from the source. The following protocols are supported: RIST, RTP, RTP-FEC, SRT-listener, SRT-caller, Zixi pull, Zixi push, and Fujitsu-QoS. CDI and ST 2110 JPEG XS protocols are not currently supported by AWS CloudFormation.
 *
 * @cloudformationResource AWS::MediaConnect::FlowOutput
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html
 */
export class CfnFlowOutput extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaConnect::FlowOutput";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowOutput {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowOutputPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlowOutput(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the output.
     * @cloudformationAttribute OutputArn
     */
    public readonly attrOutputArn: string;

    /**
     * The Amazon Resource Name (ARN) of the flow this output is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-flowarn
     */
    public flowArn: string;

    /**
     * The protocol to use for the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-protocol
     */
    public protocol: string;

    /**
     * The range of IP addresses that are allowed to initiate output requests to this flow. Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-cidrallowlist
     */
    public cidrAllowList: string[] | undefined;

    /**
     * A description of the output. This description is not visible outside of the current AWS account even if the account grants entitlements to other accounts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-description
     */
    public description: string | undefined;

    /**
     * The IP address where you want to send the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-destination
     */
    public destination: string | undefined;

    /**
     * The encryption credentials that you want to use for the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-encryption
     */
    public encryption: CfnFlowOutput.EncryptionProperty | cdk.IResolvable | undefined;

    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-maxlatency
     */
    public maxLatency: number | undefined;

    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-minlatency
     */
    public minLatency: number | undefined;

    /**
     * The name of the VPC interface.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-name
     */
    public name: string | undefined;

    /**
     * The port to use when MediaConnect distributes content to the output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-port
     */
    public port: number | undefined;

    /**
     * The identifier that is assigned to the Zixi receiver. This parameter applies only to outputs that use Zixi pull.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-remoteid
     */
    public remoteId: string | undefined;

    /**
     * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-smoothinglatency
     */
    public smoothingLatency: number | undefined;

    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-streamid
     */
    public streamId: string | undefined;

    /**
     * The VPC interface that you want to send your output to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-vpcinterfaceattachment
     */
    public vpcInterfaceAttachment: CfnFlowOutput.VpcInterfaceAttachmentProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::MediaConnect::FlowOutput`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowOutputProps) {
        super(scope, id, { type: CfnFlowOutput.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'flowArn', this);
        cdk.requireProperty(props, 'protocol', this);
        this.attrOutputArn = cdk.Token.asString(this.getAtt('OutputArn', cdk.ResolutionTypeHint.STRING));

        this.flowArn = props.flowArn;
        this.protocol = props.protocol;
        this.cidrAllowList = props.cidrAllowList;
        this.description = props.description;
        this.destination = props.destination;
        this.encryption = props.encryption;
        this.maxLatency = props.maxLatency;
        this.minLatency = props.minLatency;
        this.name = props.name;
        this.port = props.port;
        this.remoteId = props.remoteId;
        this.smoothingLatency = props.smoothingLatency;
        this.streamId = props.streamId;
        this.vpcInterfaceAttachment = props.vpcInterfaceAttachment;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowOutput.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            flowArn: this.flowArn,
            protocol: this.protocol,
            cidrAllowList: this.cidrAllowList,
            description: this.description,
            destination: this.destination,
            encryption: this.encryption,
            maxLatency: this.maxLatency,
            minLatency: this.minLatency,
            name: this.name,
            port: this.port,
            remoteId: this.remoteId,
            smoothingLatency: this.smoothingLatency,
            streamId: this.streamId,
            vpcInterfaceAttachment: this.vpcInterfaceAttachment,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowOutputPropsToCloudFormation(props);
    }
}

export namespace CfnFlowOutput {
    /**
     * Information about the encryption of the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html
     */
    export interface EncryptionProperty {
        /**
         * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-algorithm
         */
        readonly algorithm?: string;
        /**
         * The type of key that is used for the encryption. If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-keytype
         */
        readonly keyType?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-rolearn
         */
        readonly roleArn: string;
        /**
         * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-secretarn
         */
        readonly secretArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlowOutput_EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithm', cdk.validateString)(properties.algorithm));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.requiredValidator)(properties.secretArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    return errors.wrap('supplied properties not correct for "EncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput.Encryption` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput.Encryption` resource.
 */
// @ts-ignore TS6133
function cfnFlowOutputEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowOutput_EncryptionPropertyValidator(properties).assertSuccess();
    return {
        Algorithm: cdk.stringToCloudFormation(properties.algorithm),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
    };
}

// @ts-ignore TS6133
function CfnFlowOutputEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowOutput.EncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutput.EncryptionProperty>();
    ret.addPropertyResult('algorithm', 'Algorithm', properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretArn', 'SecretArn', cfn_parse.FromCloudFormation.getString(properties.SecretArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFlowOutput {
    /**
     * The VPC interface that you want to send your output to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-vpcinterfaceattachment.html
     */
    export interface VpcInterfaceAttachmentProperty {
        /**
         * The name of the VPC interface that you want to send your output to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-vpcinterfaceattachment.html#cfn-mediaconnect-flowoutput-vpcinterfaceattachment-vpcinterfacename
         */
        readonly vpcInterfaceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlowOutput_VpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('vpcInterfaceName', cdk.validateString)(properties.vpcInterfaceName));
    return errors.wrap('supplied properties not correct for "VpcInterfaceAttachmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput.VpcInterfaceAttachment` resource
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowOutput.VpcInterfaceAttachment` resource.
 */
// @ts-ignore TS6133
function cfnFlowOutputVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowOutput_VpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
    return {
        VpcInterfaceName: cdk.stringToCloudFormation(properties.vpcInterfaceName),
    };
}

// @ts-ignore TS6133
function CfnFlowOutputVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowOutput.VpcInterfaceAttachmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutput.VpcInterfaceAttachmentProperty>();
    ret.addPropertyResult('vpcInterfaceName', 'VpcInterfaceName', properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFlowSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html
 */
export interface CfnFlowSourceProps {

    /**
     * A description of the source. This description is not visible outside of the current AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-description
     */
    readonly description: string;

    /**
     * The name of the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-name
     */
    readonly name: string;

    /**
     * The type of encryption that is used on the content ingested from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-decryption
     */
    readonly decryption?: CfnFlowSource.EncryptionProperty | cdk.IResolvable;

    /**
     * The ARN of the entitlement that allows you to subscribe to the flow. The entitlement is set by the content originator, and the ARN is generated as part of the originator's flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-entitlementarn
     */
    readonly entitlementArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the flow this source is connected to. The flow must have Failover enabled to add an additional source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-flowarn
     */
    readonly flowArn?: string;

    /**
     * The port that the flow listens on for incoming content. If the protocol of the source is Zixi, the port must be set to 2088.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-ingestport
     */
    readonly ingestPort?: number;

    /**
     * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxbitrate
     */
    readonly maxBitrate?: number;

    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxlatency
     */
    readonly maxLatency?: number;

    /**
     * The protocol that the source uses to deliver the content to MediaConnect. Adding additional sources to an existing flow requires Failover to be enabled. When you enable Failover, the additional source must use the same protocol as the existing source. Only the following protocols support failover: Zixi-push, RTP-FEC, RTP, and RIST.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-protocol
     */
    readonly protocol?: string;

    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-streamid
     */
    readonly streamId?: string;

    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;

    /**
     * The range of IP addresses that are allowed to contribute content to your source. Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-whitelistcidr
     */
    readonly whitelistCidr?: string;
}

/**
 * Determine whether the given properties match those of a `CfnFlowSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowSourceProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowSourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('decryption', CfnFlowSource_EncryptionPropertyValidator)(properties.decryption));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('entitlementArn', cdk.validateString)(properties.entitlementArn));
    errors.collect(cdk.propertyValidator('flowArn', cdk.validateString)(properties.flowArn));
    errors.collect(cdk.propertyValidator('ingestPort', cdk.validateNumber)(properties.ingestPort));
    errors.collect(cdk.propertyValidator('maxBitrate', cdk.validateNumber)(properties.maxBitrate));
    errors.collect(cdk.propertyValidator('maxLatency', cdk.validateNumber)(properties.maxLatency));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('streamId', cdk.validateString)(properties.streamId));
    errors.collect(cdk.propertyValidator('vpcInterfaceName', cdk.validateString)(properties.vpcInterfaceName));
    errors.collect(cdk.propertyValidator('whitelistCidr', cdk.validateString)(properties.whitelistCidr));
    return errors.wrap('supplied properties not correct for "CfnFlowSourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowSource` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowSourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowSource` resource.
 */
// @ts-ignore TS6133
function cfnFlowSourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowSourcePropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Decryption: cfnFlowSourceEncryptionPropertyToCloudFormation(properties.decryption),
        EntitlementArn: cdk.stringToCloudFormation(properties.entitlementArn),
        FlowArn: cdk.stringToCloudFormation(properties.flowArn),
        IngestPort: cdk.numberToCloudFormation(properties.ingestPort),
        MaxBitrate: cdk.numberToCloudFormation(properties.maxBitrate),
        MaxLatency: cdk.numberToCloudFormation(properties.maxLatency),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        StreamId: cdk.stringToCloudFormation(properties.streamId),
        VpcInterfaceName: cdk.stringToCloudFormation(properties.vpcInterfaceName),
        WhitelistCidr: cdk.stringToCloudFormation(properties.whitelistCidr),
    };
}

// @ts-ignore TS6133
function CfnFlowSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowSourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSourceProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('decryption', 'Decryption', properties.Decryption != null ? CfnFlowSourceEncryptionPropertyFromCloudFormation(properties.Decryption) : undefined);
    ret.addPropertyResult('entitlementArn', 'EntitlementArn', properties.EntitlementArn != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementArn) : undefined);
    ret.addPropertyResult('flowArn', 'FlowArn', properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined);
    ret.addPropertyResult('ingestPort', 'IngestPort', properties.IngestPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngestPort) : undefined);
    ret.addPropertyResult('maxBitrate', 'MaxBitrate', properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined);
    ret.addPropertyResult('maxLatency', 'MaxLatency', properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('streamId', 'StreamId', properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined);
    ret.addPropertyResult('vpcInterfaceName', 'VpcInterfaceName', properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined);
    ret.addPropertyResult('whitelistCidr', 'WhitelistCidr', properties.WhitelistCidr != null ? cfn_parse.FromCloudFormation.getString(properties.WhitelistCidr) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaConnect::FlowSource`
 *
 * The AWS::MediaConnect::FlowSource resource is used to add additional sources to an existing flow. Adding an additional source requires Failover to be enabled. When you enable Failover, the additional source must use the same protocol as the existing source. A source is the external video content that includes configuration information (encryption and source type) and a network address. Each flow has at least one source. A standard source comes from a source other than another AWS Elemental MediaConnect flow, such as an on-premises encoder.
 *
 * @cloudformationResource AWS::MediaConnect::FlowSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html
 */
export class CfnFlowSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaConnect::FlowSource";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowSource {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowSourcePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlowSource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The IP address that the flow listens on for incoming content.
     * @cloudformationAttribute IngestIp
     */
    public readonly attrIngestIp: string;

    /**
     * The ARN of the source.
     * @cloudformationAttribute SourceArn
     */
    public readonly attrSourceArn: string;

    /**
     *
     * @cloudformationAttribute SourceIngestPort
     */
    public readonly attrSourceIngestPort: string;

    /**
     * A description of the source. This description is not visible outside of the current AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-description
     */
    public description: string;

    /**
     * The name of the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-name
     */
    public name: string;

    /**
     * The type of encryption that is used on the content ingested from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-decryption
     */
    public decryption: CfnFlowSource.EncryptionProperty | cdk.IResolvable | undefined;

    /**
     * The ARN of the entitlement that allows you to subscribe to the flow. The entitlement is set by the content originator, and the ARN is generated as part of the originator's flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-entitlementarn
     */
    public entitlementArn: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the flow this source is connected to. The flow must have Failover enabled to add an additional source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-flowarn
     */
    public flowArn: string | undefined;

    /**
     * The port that the flow listens on for incoming content. If the protocol of the source is Zixi, the port must be set to 2088.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-ingestport
     */
    public ingestPort: number | undefined;

    /**
     * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxbitrate
     */
    public maxBitrate: number | undefined;

    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxlatency
     */
    public maxLatency: number | undefined;

    /**
     * The protocol that the source uses to deliver the content to MediaConnect. Adding additional sources to an existing flow requires Failover to be enabled. When you enable Failover, the additional source must use the same protocol as the existing source. Only the following protocols support failover: Zixi-push, RTP-FEC, RTP, and RIST.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-protocol
     */
    public protocol: string | undefined;

    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-streamid
     */
    public streamId: string | undefined;

    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-vpcinterfacename
     */
    public vpcInterfaceName: string | undefined;

    /**
     * The range of IP addresses that are allowed to contribute content to your source. Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-whitelistcidr
     */
    public whitelistCidr: string | undefined;

    /**
     * Create a new `AWS::MediaConnect::FlowSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowSourceProps) {
        super(scope, id, { type: CfnFlowSource.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'name', this);
        this.attrIngestIp = cdk.Token.asString(this.getAtt('IngestIp', cdk.ResolutionTypeHint.STRING));
        this.attrSourceArn = cdk.Token.asString(this.getAtt('SourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrSourceIngestPort = cdk.Token.asString(this.getAtt('SourceIngestPort', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.name = props.name;
        this.decryption = props.decryption;
        this.entitlementArn = props.entitlementArn;
        this.flowArn = props.flowArn;
        this.ingestPort = props.ingestPort;
        this.maxBitrate = props.maxBitrate;
        this.maxLatency = props.maxLatency;
        this.protocol = props.protocol;
        this.streamId = props.streamId;
        this.vpcInterfaceName = props.vpcInterfaceName;
        this.whitelistCidr = props.whitelistCidr;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowSource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            name: this.name,
            decryption: this.decryption,
            entitlementArn: this.entitlementArn,
            flowArn: this.flowArn,
            ingestPort: this.ingestPort,
            maxBitrate: this.maxBitrate,
            maxLatency: this.maxLatency,
            protocol: this.protocol,
            streamId: this.streamId,
            vpcInterfaceName: this.vpcInterfaceName,
            whitelistCidr: this.whitelistCidr,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowSourcePropsToCloudFormation(props);
    }
}

export namespace CfnFlowSource {
    /**
     * Information about the encryption of the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html
     */
    export interface EncryptionProperty {
        /**
         * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-algorithm
         */
        readonly algorithm: string;
        /**
         * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content. This parameter is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-constantinitializationvector
         */
        readonly constantInitializationVector?: string;
        /**
         * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-deviceid
         */
        readonly deviceId?: string;
        /**
         * The type of key that is used for the encryption. If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-keytype
         */
        readonly keyType?: string;
        /**
         * The AWS Region that the API Gateway proxy endpoint was created in. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-region
         */
        readonly region?: string;
        /**
         * An identifier for the content. The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-resourceid
         */
        readonly resourceId?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-rolearn
         */
        readonly roleArn: string;
        /**
         * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-secretarn
         */
        readonly secretArn?: string;
        /**
         * The URL from the API Gateway proxy that you set up to talk to your key server. This parameter is required for SPEKE encryption and is not valid for static key encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlowSource_EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithm', cdk.requiredValidator)(properties.algorithm));
    errors.collect(cdk.propertyValidator('algorithm', cdk.validateString)(properties.algorithm));
    errors.collect(cdk.propertyValidator('constantInitializationVector', cdk.validateString)(properties.constantInitializationVector));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "EncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowSource.Encryption` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowSource.Encryption` resource.
 */
// @ts-ignore TS6133
function cfnFlowSourceEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowSource_EncryptionPropertyValidator(properties).assertSuccess();
    return {
        Algorithm: cdk.stringToCloudFormation(properties.algorithm),
        ConstantInitializationVector: cdk.stringToCloudFormation(properties.constantInitializationVector),
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
        Region: cdk.stringToCloudFormation(properties.region),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnFlowSourceEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowSource.EncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSource.EncryptionProperty>();
    ret.addPropertyResult('algorithm', 'Algorithm', cfn_parse.FromCloudFormation.getString(properties.Algorithm));
    ret.addPropertyResult('constantInitializationVector', 'ConstantInitializationVector', properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined);
    ret.addPropertyResult('deviceId', 'DeviceId', properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretArn', 'SecretArn', properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFlowVpcInterface`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html
 */
export interface CfnFlowVpcInterfaceProps {

    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-flowarn
     */
    readonly flowArn: string;

    /**
     * The name of the VPC Interface. This value must be unique within the current flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created when you set up MediaConnect as a trusted service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-rolearn
     */
    readonly roleArn: string;

    /**
     * The VPC security groups that you want MediaConnect to use for your VPC configuration. You must include at least one security group in the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-securitygroupids
     */
    readonly securityGroupIds: string[];

    /**
     * The subnet IDs that you want to use for your VPC interface.
     *
     * A range of IP addresses in your VPC. When you create your VPC, you specify a range of IPv4 addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16. This is the primary CIDR block for your VPC. When you create a subnet for your VPC, you specify the CIDR block for the subnet, which is a subset of the VPC CIDR block.
     *
     * The subnets that you use across all VPC interfaces on the flow must be in the same Availability Zone as the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-subnetid
     */
    readonly subnetId: string;
}

/**
 * Determine whether the given properties match those of a `CfnFlowVpcInterfaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowVpcInterfaceProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowVpcInterfacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('flowArn', cdk.requiredValidator)(properties.flowArn));
    errors.collect(cdk.propertyValidator('flowArn', cdk.validateString)(properties.flowArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.requiredValidator)(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetId', cdk.requiredValidator)(properties.subnetId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    return errors.wrap('supplied properties not correct for "CfnFlowVpcInterfaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaConnect::FlowVpcInterface` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowVpcInterfaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaConnect::FlowVpcInterface` resource.
 */
// @ts-ignore TS6133
function cfnFlowVpcInterfacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowVpcInterfacePropsValidator(properties).assertSuccess();
    return {
        FlowArn: cdk.stringToCloudFormation(properties.flowArn),
        Name: cdk.stringToCloudFormation(properties.name),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
    };
}

// @ts-ignore TS6133
function CfnFlowVpcInterfacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowVpcInterfaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowVpcInterfaceProps>();
    ret.addPropertyResult('flowArn', 'FlowArn', cfn_parse.FromCloudFormation.getString(properties.FlowArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds));
    ret.addPropertyResult('subnetId', 'SubnetId', cfn_parse.FromCloudFormation.getString(properties.SubnetId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaConnect::FlowVpcInterface`
 *
 * The AWS::MediaConnect::FlowVpcInterface resource is a connection between your AWS Elemental MediaConnect flow and a virtual private cloud (VPC) that you created using the Amazon Virtual Private Cloud service.
 *
 * To avoid streaming your content over the public internet, you can add up to two VPC interfaces to your flow and use those connections to transfer content between your VPC and MediaConnect.
 *
 * You can update an existing flow to add a VPC interface. If you haven’t created the flow yet, you must create the flow with a temporary standard source by doing the following:
 *
 * - Use CloudFormation to create a flow with a standard source that uses to the flow’s public IP address.
 * - Use CloudFormation to create a VPC interface to add to this flow. This can also be done as part of the previous step.
 * - After CloudFormation has created the flow and the VPC interface, update the source to point to the VPC interface that you created.
 *
 * @cloudformationResource AWS::MediaConnect::FlowVpcInterface
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html
 */
export class CfnFlowVpcInterface extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaConnect::FlowVpcInterface";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowVpcInterface {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowVpcInterfacePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlowVpcInterface(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The IDs of the network interfaces that MediaConnect created in your account.
     * @cloudformationAttribute NetworkInterfaceIds
     */
    public readonly attrNetworkInterfaceIds: string[];

    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-flowarn
     */
    public flowArn: string;

    /**
     * The name of the VPC Interface. This value must be unique within the current flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created when you set up MediaConnect as a trusted service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-rolearn
     */
    public roleArn: string;

    /**
     * The VPC security groups that you want MediaConnect to use for your VPC configuration. You must include at least one security group in the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-securitygroupids
     */
    public securityGroupIds: string[];

    /**
     * The subnet IDs that you want to use for your VPC interface.
     *
     * A range of IP addresses in your VPC. When you create your VPC, you specify a range of IPv4 addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16. This is the primary CIDR block for your VPC. When you create a subnet for your VPC, you specify the CIDR block for the subnet, which is a subset of the VPC CIDR block.
     *
     * The subnets that you use across all VPC interfaces on the flow must be in the same Availability Zone as the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-subnetid
     */
    public subnetId: string;

    /**
     * Create a new `AWS::MediaConnect::FlowVpcInterface`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowVpcInterfaceProps) {
        super(scope, id, { type: CfnFlowVpcInterface.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'flowArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'securityGroupIds', this);
        cdk.requireProperty(props, 'subnetId', this);
        this.attrNetworkInterfaceIds = cdk.Token.asList(this.getAtt('NetworkInterfaceIds', cdk.ResolutionTypeHint.STRING_LIST));

        this.flowArn = props.flowArn;
        this.name = props.name;
        this.roleArn = props.roleArn;
        this.securityGroupIds = props.securityGroupIds;
        this.subnetId = props.subnetId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowVpcInterface.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            flowArn: this.flowArn,
            name: this.name,
            roleArn: this.roleArn,
            securityGroupIds: this.securityGroupIds,
            subnetId: this.subnetId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowVpcInterfacePropsToCloudFormation(props);
    }
}
