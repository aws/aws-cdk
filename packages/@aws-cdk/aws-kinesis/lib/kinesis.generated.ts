// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:53:40.103Z","fingerprint":"FW/Zx0UY/fwNUHmOrhjB7jbiFUj3/jHSqNq2Am/eq5Y="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnStream`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html
 */
export interface CfnStreamProps {

    /**
     * The name of the Kinesis stream. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the stream name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-name
     */
    readonly name?: string;

    /**
     * The number of hours for the data records that are stored in shards to remain accessible. The default value is 24. For more information about the stream retention period, see [Changing the Data Retention Period](https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html) in the Amazon Kinesis Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-retentionperiodhours
     */
    readonly retentionPeriodHours?: number;

    /**
     * The number of shards that the stream uses. For greater provisioned throughput, increase the number of shards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-shardcount
     */
    readonly shardCount?: number;

    /**
     * When specified, enables or updates server-side encryption using an AWS KMS key for a specified stream. Removing this property from your stack template and updating your stack disables encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streamencryption
     */
    readonly streamEncryption?: CfnStream.StreamEncryptionProperty | cdk.IResolvable;

    /**
     * Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streammodedetails
     */
    readonly streamModeDetails?: CfnStream.StreamModeDetailsProperty | cdk.IResolvable;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the Kinesis stream. For information about constraints for this property, see [Tag Restrictions](https://docs.aws.amazon.com/streams/latest/dev/tagging.html#tagging-restrictions) in the *Amazon Kinesis Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamProps`
 *
 * @returns the result of the validation.
 */
function CfnStreamPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('retentionPeriodHours', cdk.validateNumber)(properties.retentionPeriodHours));
    errors.collect(cdk.propertyValidator('shardCount', cdk.validateNumber)(properties.shardCount));
    errors.collect(cdk.propertyValidator('streamEncryption', CfnStream_StreamEncryptionPropertyValidator)(properties.streamEncryption));
    errors.collect(cdk.propertyValidator('streamModeDetails', CfnStream_StreamModeDetailsPropertyValidator)(properties.streamModeDetails));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStreamProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Kinesis::Stream` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Kinesis::Stream` resource.
 */
// @ts-ignore TS6133
function cfnStreamPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        RetentionPeriodHours: cdk.numberToCloudFormation(properties.retentionPeriodHours),
        ShardCount: cdk.numberToCloudFormation(properties.shardCount),
        StreamEncryption: cfnStreamStreamEncryptionPropertyToCloudFormation(properties.streamEncryption),
        StreamModeDetails: cfnStreamStreamModeDetailsPropertyToCloudFormation(properties.streamModeDetails),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProps>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('retentionPeriodHours', 'RetentionPeriodHours', properties.RetentionPeriodHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionPeriodHours) : undefined);
    ret.addPropertyResult('shardCount', 'ShardCount', properties.ShardCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShardCount) : undefined);
    ret.addPropertyResult('streamEncryption', 'StreamEncryption', properties.StreamEncryption != null ? CfnStreamStreamEncryptionPropertyFromCloudFormation(properties.StreamEncryption) : undefined);
    ret.addPropertyResult('streamModeDetails', 'StreamModeDetails', properties.StreamModeDetails != null ? CfnStreamStreamModeDetailsPropertyFromCloudFormation(properties.StreamModeDetails) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Kinesis::Stream`
 *
 * Creates a Kinesis stream that captures and transports data records that are emitted from data sources. For information about creating streams, see [CreateStream](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_CreateStream.html) in the Amazon Kinesis API Reference.
 *
 * @cloudformationResource AWS::Kinesis::Stream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html
 */
export class CfnStream extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Kinesis::Stream";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStream {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStreamPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStream(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon resource name (ARN) of the Kinesis stream, such as `arn:aws:kinesis:us-east-2:123456789012:stream/mystream` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the Kinesis stream. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the stream name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-name
     */
    public name: string | undefined;

    /**
     * The number of hours for the data records that are stored in shards to remain accessible. The default value is 24. For more information about the stream retention period, see [Changing the Data Retention Period](https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html) in the Amazon Kinesis Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-retentionperiodhours
     */
    public retentionPeriodHours: number | undefined;

    /**
     * The number of shards that the stream uses. For greater provisioned throughput, increase the number of shards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-shardcount
     */
    public shardCount: number | undefined;

    /**
     * When specified, enables or updates server-side encryption using an AWS KMS key for a specified stream. Removing this property from your stack template and updating your stack disables encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streamencryption
     */
    public streamEncryption: CfnStream.StreamEncryptionProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streammodedetails
     */
    public streamModeDetails: CfnStream.StreamModeDetailsProperty | cdk.IResolvable | undefined;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the Kinesis stream. For information about constraints for this property, see [Tag Restrictions](https://docs.aws.amazon.com/streams/latest/dev/tagging.html#tagging-restrictions) in the *Amazon Kinesis Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Kinesis::Stream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamProps = {}) {
        super(scope, id, { type: CfnStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.retentionPeriodHours = props.retentionPeriodHours;
        this.shardCount = props.shardCount;
        this.streamEncryption = props.streamEncryption;
        this.streamModeDetails = props.streamModeDetails;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Kinesis::Stream", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStream.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            retentionPeriodHours: this.retentionPeriodHours,
            shardCount: this.shardCount,
            streamEncryption: this.streamEncryption,
            streamModeDetails: this.streamModeDetails,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamPropsToCloudFormation(props);
    }
}

export namespace CfnStream {
    /**
     * Enables or updates server-side encryption using an AWS KMS key for a specified stream.
     *
     * > When invoking this API, you must use either the `StreamARN` or the `StreamName` parameter, or both. It is recommended that you use the `StreamARN` input parameter when you invoke this API.
     *
     * Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to `UPDATING` . After the update is complete, Kinesis Data Streams sets the status of the stream back to `ACTIVE` . Updating or applying encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is `UPDATING` . Once the status of the stream is `ACTIVE` , encryption begins for records written to the stream.
     *
     * API Limits: You can successfully apply a new AWS KMS key for server-side encryption 25 times in a rolling 24-hour period.
     *
     * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status before all records written to the stream are encrypted. After you enable encryption, you can verify that encryption is applied by inspecting the API response from `PutRecord` or `PutRecords` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html
     */
    export interface StreamEncryptionProperty {
        /**
         * The encryption type to use. The only valid value is `KMS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-encryptiontype
         */
        readonly encryptionType: string;
        /**
         * The GUID for the customer-managed AWS KMS key to use for encryption. This value can be a globally unique identifier, a fully specified Amazon Resource Name (ARN) to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias `aws/kinesis` .
         *
         * - Key ARN example: `arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`
         * - Alias ARN example: `arn:aws:kms:us-east-1:123456789012:alias/MyAliasName`
         * - Globally unique key ID example: `12345678-1234-1234-1234-123456789012`
         * - Alias name example: `alias/MyAliasName`
         * - Master key owned by Kinesis Data Streams: `alias/aws/kinesis`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-keyid
         */
        readonly keyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnStream_StreamEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionType', cdk.requiredValidator)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('keyId', cdk.requiredValidator)(properties.keyId));
    errors.collect(cdk.propertyValidator('keyId', cdk.validateString)(properties.keyId));
    return errors.wrap('supplied properties not correct for "StreamEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Kinesis::Stream.StreamEncryption` resource
 *
 * @param properties - the TypeScript properties of a `StreamEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Kinesis::Stream.StreamEncryption` resource.
 */
// @ts-ignore TS6133
function cfnStreamStreamEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStream_StreamEncryptionPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        KeyId: cdk.stringToCloudFormation(properties.keyId),
    };
}

// @ts-ignore TS6133
function CfnStreamStreamEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStream.StreamEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.StreamEncryptionProperty>();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addPropertyResult('keyId', 'KeyId', cfn_parse.FromCloudFormation.getString(properties.KeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStream {
    /**
     * Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streammodedetails.html
     */
    export interface StreamModeDetailsProperty {
        /**
         * Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streammodedetails.html#cfn-kinesis-stream-streammodedetails-streammode
         */
        readonly streamMode: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamModeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `StreamModeDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStream_StreamModeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamMode', cdk.requiredValidator)(properties.streamMode));
    errors.collect(cdk.propertyValidator('streamMode', cdk.validateString)(properties.streamMode));
    return errors.wrap('supplied properties not correct for "StreamModeDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Kinesis::Stream.StreamModeDetails` resource
 *
 * @param properties - the TypeScript properties of a `StreamModeDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Kinesis::Stream.StreamModeDetails` resource.
 */
// @ts-ignore TS6133
function cfnStreamStreamModeDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStream_StreamModeDetailsPropertyValidator(properties).assertSuccess();
    return {
        StreamMode: cdk.stringToCloudFormation(properties.streamMode),
    };
}

// @ts-ignore TS6133
function CfnStreamStreamModeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStream.StreamModeDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.StreamModeDetailsProperty>();
    ret.addPropertyResult('streamMode', 'StreamMode', cfn_parse.FromCloudFormation.getString(properties.StreamMode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStreamConsumer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html
 */
export interface CfnStreamConsumerProps {

    /**
     * The name of the consumer is something you choose when you register the consumer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-consumername
     */
    readonly consumerName: string;

    /**
     * The ARN of the stream with which you registered the consumer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-streamarn
     */
    readonly streamArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnStreamConsumerProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamConsumerProps`
 *
 * @returns the result of the validation.
 */
function CfnStreamConsumerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('consumerName', cdk.requiredValidator)(properties.consumerName));
    errors.collect(cdk.propertyValidator('consumerName', cdk.validateString)(properties.consumerName));
    errors.collect(cdk.propertyValidator('streamArn', cdk.requiredValidator)(properties.streamArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "CfnStreamConsumerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Kinesis::StreamConsumer` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamConsumerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Kinesis::StreamConsumer` resource.
 */
// @ts-ignore TS6133
function cfnStreamConsumerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamConsumerPropsValidator(properties).assertSuccess();
    return {
        ConsumerName: cdk.stringToCloudFormation(properties.consumerName),
        StreamARN: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnStreamConsumerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamConsumerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamConsumerProps>();
    ret.addPropertyResult('consumerName', 'ConsumerName', cfn_parse.FromCloudFormation.getString(properties.ConsumerName));
    ret.addPropertyResult('streamArn', 'StreamARN', cfn_parse.FromCloudFormation.getString(properties.StreamARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Kinesis::StreamConsumer`
 *
 * Use the AWS CloudFormation `AWS::Kinesis::StreamConsumer` resource to register a consumer with a Kinesis data stream. The consumer you register can then call [SubscribeToShard](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_SubscribeToShard.html) to receive data from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every shard you subscribe to. This rate is unaffected by the total number of consumers that read from the same stream.
 *
 * You can register up to five consumers per stream. However, you can request a limit increase using the [Kinesis Data Streams limits form](https://docs.aws.amazon.com/support/v1?#/) . A given consumer can only be registered with one stream at a time.
 *
 * For more information, see [Using Consumers with Enhanced Fan-Out](https://docs.aws.amazon.com/streams/latest/dev/introduction-to-enhanced-consumers.html) .
 *
 * @cloudformationResource AWS::Kinesis::StreamConsumer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html
 */
export class CfnStreamConsumer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Kinesis::StreamConsumer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamConsumer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStreamConsumerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStreamConsumer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * When you register a consumer, Kinesis Data Streams generates an ARN for it. You need this ARN to be able to call [SubscribeToShard](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_SubscribeToShard.html) .
     *
     * If you delete a consumer and then create a new one with the same name, it won't have the same ARN. That's because consumer ARNs contain the creation timestamp. This is important to keep in mind if you have IAM policies that reference consumer ARNs.
     * @cloudformationAttribute ConsumerARN
     */
    public readonly attrConsumerArn: string;

    /**
     * The time at which the consumer was created.
     * @cloudformationAttribute ConsumerCreationTimestamp
     */
    public readonly attrConsumerCreationTimestamp: string;

    /**
     * The name you gave the consumer when you registered it.
     * @cloudformationAttribute ConsumerName
     */
    public readonly attrConsumerName: string;

    /**
     * A consumer can't read data while in the `CREATING` or `DELETING` states.
     * @cloudformationAttribute ConsumerStatus
     */
    public readonly attrConsumerStatus: string;

    /**
     * The ARN of the data stream with which the consumer is registered.
     * @cloudformationAttribute StreamARN
     */
    public readonly attrStreamArn: string;

    /**
     * The name of the consumer is something you choose when you register the consumer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-consumername
     */
    public consumerName: string;

    /**
     * The ARN of the stream with which you registered the consumer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-streamarn
     */
    public streamArn: string;

    /**
     * Create a new `AWS::Kinesis::StreamConsumer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamConsumerProps) {
        super(scope, id, { type: CfnStreamConsumer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'consumerName', this);
        cdk.requireProperty(props, 'streamArn', this);
        this.attrConsumerArn = cdk.Token.asString(this.getAtt('ConsumerARN', cdk.ResolutionTypeHint.STRING));
        this.attrConsumerCreationTimestamp = cdk.Token.asString(this.getAtt('ConsumerCreationTimestamp', cdk.ResolutionTypeHint.STRING));
        this.attrConsumerName = cdk.Token.asString(this.getAtt('ConsumerName', cdk.ResolutionTypeHint.STRING));
        this.attrConsumerStatus = cdk.Token.asString(this.getAtt('ConsumerStatus', cdk.ResolutionTypeHint.STRING));
        this.attrStreamArn = cdk.Token.asString(this.getAtt('StreamARN', cdk.ResolutionTypeHint.STRING));

        this.consumerName = props.consumerName;
        this.streamArn = props.streamArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamConsumer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            consumerName: this.consumerName,
            streamArn: this.streamArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamConsumerPropsToCloudFormation(props);
    }
}
