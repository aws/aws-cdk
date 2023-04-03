// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-30T13:44:17.704Z","fingerprint":"yTNSrAsnfWyf1jtr58/rV6jplbHjye8cpg2CY3bHD4k="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDestination`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html
 */
export interface CfnDestinationProps {

    /**
     * The name of the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationname
     */
    readonly destinationName: string;

    /**
     * The ARN of an IAM role that permits CloudWatch Logs to send data to the specified AWS resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-rolearn
     */
    readonly roleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the physical target where the log events are delivered (for example, a Kinesis stream).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-targetarn
     */
    readonly targetArn: string;

    /**
     * An IAM policy document that governs which AWS accounts can create subscription filters against this destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationpolicy
     */
    readonly destinationPolicy?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the result of the validation.
 */
function CfnDestinationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationName', cdk.requiredValidator)(properties.destinationName));
    errors.collect(cdk.propertyValidator('destinationName', cdk.validateString)(properties.destinationName));
    errors.collect(cdk.propertyValidator('destinationPolicy', cdk.validateString)(properties.destinationPolicy));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    return errors.wrap('supplied properties not correct for "CfnDestinationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::Destination` resource
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::Destination` resource.
 */
// @ts-ignore TS6133
function cfnDestinationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDestinationPropsValidator(properties).assertSuccess();
    return {
        DestinationName: cdk.stringToCloudFormation(properties.destinationName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        DestinationPolicy: cdk.stringToCloudFormation(properties.destinationPolicy),
    };
}

// @ts-ignore TS6133
function CfnDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDestinationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDestinationProps>();
    ret.addPropertyResult('destinationName', 'DestinationName', cfn_parse.FromCloudFormation.getString(properties.DestinationName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('destinationPolicy', 'DestinationPolicy', properties.DestinationPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::Destination`
 *
 * The AWS::Logs::Destination resource specifies a CloudWatch Logs destination. A destination encapsulates a physical resource (such as an Amazon Kinesis data stream) and enables you to subscribe that resource to a stream of log events.
 *
 * @cloudformationResource AWS::Logs::Destination
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html
 */
export class CfnDestination extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::Destination";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDestination {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDestinationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDestination(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the CloudWatch Logs destination, such as `arn:aws:logs:us-west-1:123456789012:destination:MyDestination` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationname
     */
    public destinationName: string;

    /**
     * The ARN of an IAM role that permits CloudWatch Logs to send data to the specified AWS resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-rolearn
     */
    public roleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the physical target where the log events are delivered (for example, a Kinesis stream).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-targetarn
     */
    public targetArn: string;

    /**
     * An IAM policy document that governs which AWS accounts can create subscription filters against this destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationpolicy
     */
    public destinationPolicy: string | undefined;

    /**
     * Create a new `AWS::Logs::Destination`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDestinationProps) {
        super(scope, id, { type: CfnDestination.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'destinationName', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'targetArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.destinationName = props.destinationName;
        this.roleArn = props.roleArn;
        this.targetArn = props.targetArn;
        this.destinationPolicy = props.destinationPolicy;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDestination.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            destinationName: this.destinationName,
            roleArn: this.roleArn,
            targetArn: this.targetArn,
            destinationPolicy: this.destinationPolicy,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDestinationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLogGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html
 */
export interface CfnLogGroupProps {

    /**
     * Creates a data protection policy and assigns it to the log group. A data protection policy can help safeguard sensitive data that's ingested by the log group by auditing and masking the sensitive log data. When a user who does not have permission to view masked data views a log event that includes masked data, the sensitive data is replaced by asterisks.
     *
     * For more information, including a list of types of data that can be audited and masked, see [Protect sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-dataprotectionpolicy
     */
    readonly dataProtectionPolicy?: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the AWS KMS key to use when encrypting log data.
     *
     * To associate an AWS KMS key with the log group, specify the ARN of that KMS key here. If you do so, ingested data is encrypted using this key. This association is stored as long as the data encrypted with the KMS key is still within CloudWatch Logs . This enables CloudWatch Logs to decrypt this data whenever it is requested.
     *
     * If you attempt to associate a KMS key with the log group but the KMS key doesn't exist or is deactivated, you will receive an `InvalidParameterException` error.
     *
     * Log group data is always encrypted in CloudWatch Logs . If you omit this key, the encryption does not use AWS KMS . For more information, see [Encrypt log data in CloudWatch Logs using AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The name of the log group. If you don't specify a name, AWS CloudFormation generates a unique ID for the log group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * The number of days to retain the log events in the specified log group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, and 3653.
     *
     * To set a log group so that its log events do not expire, use [DeleteRetentionPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DeleteRetentionPolicy.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays
     */
    readonly retentionInDays?: number;

    /**
     * An array of key-value pairs to apply to the log group.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLogGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnLogGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataProtectionPolicy', cdk.validateObject)(properties.dataProtectionPolicy));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('retentionInDays', cdk.validateNumber)(properties.retentionInDays));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLogGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::LogGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnLogGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::LogGroup` resource.
 */
// @ts-ignore TS6133
function cfnLogGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLogGroupPropsValidator(properties).assertSuccess();
    return {
        DataProtectionPolicy: cdk.objectToCloudFormation(properties.dataProtectionPolicy),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        RetentionInDays: cdk.numberToCloudFormation(properties.retentionInDays),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLogGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogGroupProps>();
    ret.addPropertyResult('dataProtectionPolicy', 'DataProtectionPolicy', properties.DataProtectionPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataProtectionPolicy) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('logGroupName', 'LogGroupName', properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined);
    ret.addPropertyResult('retentionInDays', 'RetentionInDays', properties.RetentionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionInDays) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::LogGroup`
 *
 * The `AWS::Logs::LogGroup` resource specifies a log group. A log group defines common properties for log streams, such as their retention and access control rules. Each log stream must belong to one log group.
 *
 * You can create up to 1,000,000 log groups per Region per account. You must use the following guidelines when naming a log group:
 *
 * - Log group names must be unique within a Region for an AWS account.
 * - Log group names can be between 1 and 512 characters long.
 * - Log group names consist of the following characters: a-z, A-Z, 0-9, '_' (underscore), '-' (hyphen), '/' (forward slash), and '.' (period).
 *
 * @cloudformationResource AWS::Logs::LogGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html
 */
export class CfnLogGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLogGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLogGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the log group, such as `arn:aws:logs:us-west-1:123456789012:log-group:/mystack-testgroup-12ABC1AB12A1:*`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Creates a data protection policy and assigns it to the log group. A data protection policy can help safeguard sensitive data that's ingested by the log group by auditing and masking the sensitive log data. When a user who does not have permission to view masked data views a log event that includes masked data, the sensitive data is replaced by asterisks.
     *
     * For more information, including a list of types of data that can be audited and masked, see [Protect sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-dataprotectionpolicy
     */
    public dataProtectionPolicy: any | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the AWS KMS key to use when encrypting log data.
     *
     * To associate an AWS KMS key with the log group, specify the ARN of that KMS key here. If you do so, ingested data is encrypted using this key. This association is stored as long as the data encrypted with the KMS key is still within CloudWatch Logs . This enables CloudWatch Logs to decrypt this data whenever it is requested.
     *
     * If you attempt to associate a KMS key with the log group but the KMS key doesn't exist or is deactivated, you will receive an `InvalidParameterException` error.
     *
     * Log group data is always encrypted in CloudWatch Logs . If you omit this key, the encryption does not use AWS KMS . For more information, see [Encrypt log data in CloudWatch Logs using AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The name of the log group. If you don't specify a name, AWS CloudFormation generates a unique ID for the log group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-loggroupname
     */
    public logGroupName: string | undefined;

    /**
     * The number of days to retain the log events in the specified log group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, and 3653.
     *
     * To set a log group so that its log events do not expire, use [DeleteRetentionPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DeleteRetentionPolicy.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays
     */
    public retentionInDays: number | undefined;

    /**
     * An array of key-value pairs to apply to the log group.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Logs::LogGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLogGroupProps = {}) {
        super(scope, id, { type: CfnLogGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.dataProtectionPolicy = props.dataProtectionPolicy;
        this.kmsKeyId = props.kmsKeyId;
        this.logGroupName = props.logGroupName;
        this.retentionInDays = props.retentionInDays;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Logs::LogGroup", props.tags, { tagPropertyName: 'tags' });
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::Logs::LogGroup\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            dataProtectionPolicy: this.dataProtectionPolicy,
            kmsKeyId: this.kmsKeyId,
            logGroupName: this.logGroupName,
            retentionInDays: this.retentionInDays,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLogGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLogStream`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html
 */
export interface CfnLogStreamProps {

    /**
     * The name of the log group where the log stream is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-loggroupname
     */
    readonly logGroupName: string;

    /**
     * The name of the log stream. The name must be unique within the log group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-logstreamname
     */
    readonly logStreamName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLogStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogStreamProps`
 *
 * @returns the result of the validation.
 */
function CfnLogStreamPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logStreamName', cdk.validateString)(properties.logStreamName));
    return errors.wrap('supplied properties not correct for "CfnLogStreamProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::LogStream` resource
 *
 * @param properties - the TypeScript properties of a `CfnLogStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::LogStream` resource.
 */
// @ts-ignore TS6133
function cfnLogStreamPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLogStreamPropsValidator(properties).assertSuccess();
    return {
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        LogStreamName: cdk.stringToCloudFormation(properties.logStreamName),
    };
}

// @ts-ignore TS6133
function CfnLogStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogStreamProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogStreamProps>();
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('logStreamName', 'LogStreamName', properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::LogStream`
 *
 * The `AWS::Logs::LogStream` resource specifies an Amazon CloudWatch Logs log stream in a specific log group. A log stream represents the sequence of events coming from an application instance or resource that you are monitoring.
 *
 * There is no limit on the number of log streams that you can create for a log group.
 *
 * You must use the following guidelines when naming a log stream:
 *
 * - Log stream names must be unique within the log group.
 * - Log stream names can be between 1 and 512 characters long.
 * - The ':' (colon) and '*' (asterisk) characters are not allowed.
 *
 * @cloudformationResource AWS::Logs::LogStream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html
 */
export class CfnLogStream extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::LogStream";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogStream {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLogStreamPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLogStream(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the log group where the log stream is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-loggroupname
     */
    public logGroupName: string;

    /**
     * The name of the log stream. The name must be unique within the log group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-logstreamname
     */
    public logStreamName: string | undefined;

    /**
     * Create a new `AWS::Logs::LogStream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLogStreamProps) {
        super(scope, id, { type: CfnLogStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'logGroupName', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.logGroupName = props.logGroupName;
        this.logStreamName = props.logStreamName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogStream.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLogStreamPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnMetricFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
 */
export interface CfnMetricFilterProps {

    /**
     * A filter pattern for extracting metric data out of ingested log events. For more information, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filterpattern
     */
    readonly filterPattern: string;

    /**
     * The name of an existing log group that you want to associate with this metric filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-loggroupname
     */
    readonly logGroupName: string;

    /**
     * The metric transformations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-metrictransformations
     */
    readonly metricTransformations: Array<CfnMetricFilter.MetricTransformationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the metric filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filtername
     */
    readonly filterName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMetricFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnMetricFilterProps`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterName', cdk.validateString)(properties.filterName));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.requiredValidator)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.validateString)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('metricTransformations', cdk.requiredValidator)(properties.metricTransformations));
    errors.collect(cdk.propertyValidator('metricTransformations', cdk.listValidator(CfnMetricFilter_MetricTransformationPropertyValidator))(properties.metricTransformations));
    return errors.wrap('supplied properties not correct for "CfnMetricFilterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter` resource
 *
 * @param properties - the TypeScript properties of a `CfnMetricFilterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricFilterPropsValidator(properties).assertSuccess();
    return {
        FilterPattern: cdk.stringToCloudFormation(properties.filterPattern),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        MetricTransformations: cdk.listMapper(cfnMetricFilterMetricTransformationPropertyToCloudFormation)(properties.metricTransformations),
        FilterName: cdk.stringToCloudFormation(properties.filterName),
    };
}

// @ts-ignore TS6133
function CfnMetricFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricFilterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilterProps>();
    ret.addPropertyResult('filterPattern', 'FilterPattern', cfn_parse.FromCloudFormation.getString(properties.FilterPattern));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('metricTransformations', 'MetricTransformations', cfn_parse.FromCloudFormation.getArray(CfnMetricFilterMetricTransformationPropertyFromCloudFormation)(properties.MetricTransformations));
    ret.addPropertyResult('filterName', 'FilterName', properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::MetricFilter`
 *
 * The `AWS::Logs::MetricFilter` resource specifies a metric filter that describes how CloudWatch Logs extracts information from logs and transforms it into Amazon CloudWatch metrics. If you have multiple metric filters that are associated with a log group, all the filters are applied to the log streams in that group.
 *
 * The maximum number of metric filters that can be associated with a log group is 100.
 *
 * @cloudformationResource AWS::Logs::MetricFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
 */
export class CfnMetricFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::MetricFilter";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMetricFilter {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMetricFilterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMetricFilter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A filter pattern for extracting metric data out of ingested log events. For more information, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filterpattern
     */
    public filterPattern: string;

    /**
     * The name of an existing log group that you want to associate with this metric filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-loggroupname
     */
    public logGroupName: string;

    /**
     * The metric transformations.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-metrictransformations
     */
    public metricTransformations: Array<CfnMetricFilter.MetricTransformationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the metric filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filtername
     */
    public filterName: string | undefined;

    /**
     * Create a new `AWS::Logs::MetricFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMetricFilterProps) {
        super(scope, id, { type: CfnMetricFilter.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'filterPattern', this);
        cdk.requireProperty(props, 'logGroupName', this);
        cdk.requireProperty(props, 'metricTransformations', this);

        this.filterPattern = props.filterPattern;
        this.logGroupName = props.logGroupName;
        this.metricTransformations = props.metricTransformations;
        this.filterName = props.filterName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMetricFilter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            filterPattern: this.filterPattern,
            logGroupName: this.logGroupName,
            metricTransformations: this.metricTransformations,
            filterName: this.filterName,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMetricFilterPropsToCloudFormation(props);
    }
}

export namespace CfnMetricFilter {
    /**
     * Specifies the CloudWatch metric dimensions to publish with this metric.
     *
     * Because dimensions are part of the unique identifier for a metric, whenever a unique dimension name/value pair is extracted from your logs, you are creating a new variation of that metric.
     *
     * For more information about publishing dimensions with metrics created by metric filters, see [Publishing dimensions with metrics from values in JSON or space-delimited log events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html#logs-metric-filters-dimensions) .
     *
     * > Metrics extracted from log events are charged as custom metrics. To prevent unexpected high charges, do not specify high-cardinality fields such as `IPAddress` or `requestID` as dimensions. Each different value found for a dimension is treated as a separate metric and accrues charges as a separate custom metric.
     * >
     * > To help prevent accidental high charges, Amazon disables a metric filter if it generates 1000 different name/value pairs for the dimensions that you have specified within a certain amount of time.
     * >
     * > You can also set up a billing alarm to alert you if your charges are higher than expected. For more information, see [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html
     */
    export interface DimensionProperty {
        /**
         * The name for the CloudWatch metric dimension that the metric filter creates.
         *
         * Dimension names must contain only ASCII characters, must include at least one non-whitespace character, and cannot start with a colon (:).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html#cfn-logs-metricfilter-dimension-key
         */
        readonly key: string;
        /**
         * The log event field that will contain the value for this dimension. This dimension will only be published for a metric if the value is found in the log event. For example, `$.eventType` for JSON log events, or `$server` for space-delimited log events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html#cfn-logs-metricfilter-dimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilter_DimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricFilter_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnMetricFilterDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricFilter.DimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilter.DimensionProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMetricFilter {
    /**
     * `MetricTransformation` is a property of the `AWS::Logs::MetricFilter` resource that describes how to transform log streams into a CloudWatch metric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html
     */
    export interface MetricTransformationProperty {
        /**
         * (Optional) The value to emit when a filter pattern does not match a log event. This value can be null.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-defaultvalue
         */
        readonly defaultValue?: number;
        /**
         * The fields to use as dimensions for the metric. One metric filter can include as many as three dimensions.
         *
         * > Metrics extracted from log events are charged as custom metrics. To prevent unexpected high charges, do not specify high-cardinality fields such as `IPAddress` or `requestID` as dimensions. Each different value found for a dimension is treated as a separate metric and accrues charges as a separate custom metric.
         * >
         * > CloudWatch Logs disables a metric filter if it generates 1000 different name/value pairs for your specified dimensions within a certain amount of time. This helps to prevent accidental high charges.
         * >
         * > You can also set up a billing alarm to alert you if your charges are higher than expected. For more information, see [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-dimensions
         */
        readonly dimensions?: Array<CfnMetricFilter.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the CloudWatch metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricname
         */
        readonly metricName: string;
        /**
         * A custom namespace to contain your metric in CloudWatch. Use namespaces to group together metrics that are similar. For more information, see [Namespaces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Namespace) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricnamespace
         */
        readonly metricNamespace: string;
        /**
         * The value that is published to the CloudWatch metric. For example, if you're counting the occurrences of a particular term like `Error` , specify 1 for the metric value. If you're counting the number of bytes transferred, reference the value that is in the log event by using $. followed by the name of the field that you specified in the filter pattern, such as `$.size` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricvalue
         */
        readonly metricValue: string;
        /**
         * The unit to assign to the metric. If you omit this, the unit is set as `None` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricTransformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricFilter_MetricTransformationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateNumber)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnMetricFilter_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricNamespace', cdk.requiredValidator)(properties.metricNamespace));
    errors.collect(cdk.propertyValidator('metricNamespace', cdk.validateString)(properties.metricNamespace));
    errors.collect(cdk.propertyValidator('metricValue', cdk.requiredValidator)(properties.metricValue));
    errors.collect(cdk.propertyValidator('metricValue', cdk.validateString)(properties.metricValue));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "MetricTransformationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.MetricTransformation` resource
 *
 * @param properties - the TypeScript properties of a `MetricTransformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::MetricFilter.MetricTransformation` resource.
 */
// @ts-ignore TS6133
function cfnMetricFilterMetricTransformationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricFilter_MetricTransformationPropertyValidator(properties).assertSuccess();
    return {
        DefaultValue: cdk.numberToCloudFormation(properties.defaultValue),
        Dimensions: cdk.listMapper(cfnMetricFilterDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        MetricNamespace: cdk.stringToCloudFormation(properties.metricNamespace),
        MetricValue: cdk.stringToCloudFormation(properties.metricValue),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnMetricFilterMetricTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricFilter.MetricTransformationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilter.MetricTransformationProperty>();
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultValue) : undefined);
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricFilterDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('metricNamespace', 'MetricNamespace', cfn_parse.FromCloudFormation.getString(properties.MetricNamespace));
    ret.addPropertyResult('metricValue', 'MetricValue', cfn_parse.FromCloudFormation.getString(properties.MetricValue));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnQueryDefinition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html
 */
export interface CfnQueryDefinitionProps {

    /**
     * A name for the query definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-name
     */
    readonly name: string;

    /**
     * The query string to use for this query definition. For more information, see [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-querystring
     */
    readonly queryString: string;

    /**
     * Use this parameter if you want the query to query only certain log groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-loggroupnames
     */
    readonly logGroupNames?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnQueryDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueryDefinitionProps`
 *
 * @returns the result of the validation.
 */
function CfnQueryDefinitionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupNames', cdk.listValidator(cdk.validateString))(properties.logGroupNames));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('queryString', cdk.requiredValidator)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateString)(properties.queryString));
    return errors.wrap('supplied properties not correct for "CfnQueryDefinitionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::QueryDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CfnQueryDefinitionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::QueryDefinition` resource.
 */
// @ts-ignore TS6133
function cfnQueryDefinitionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQueryDefinitionPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        QueryString: cdk.stringToCloudFormation(properties.queryString),
        LogGroupNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.logGroupNames),
    };
}

// @ts-ignore TS6133
function CfnQueryDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueryDefinitionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueryDefinitionProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('queryString', 'QueryString', cfn_parse.FromCloudFormation.getString(properties.QueryString));
    ret.addPropertyResult('logGroupNames', 'LogGroupNames', properties.LogGroupNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.LogGroupNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::QueryDefinition`
 *
 * Creates a query definition for CloudWatch Logs Insights. For more information, see [Analyzing Log Data with CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) .
 *
 * @cloudformationResource AWS::Logs::QueryDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html
 */
export class CfnQueryDefinition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::QueryDefinition";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueryDefinition {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnQueryDefinitionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnQueryDefinition(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the query definition.
     * @cloudformationAttribute QueryDefinitionId
     */
    public readonly attrQueryDefinitionId: string;

    /**
     * A name for the query definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-name
     */
    public name: string;

    /**
     * The query string to use for this query definition. For more information, see [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-querystring
     */
    public queryString: string;

    /**
     * Use this parameter if you want the query to query only certain log groups.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-loggroupnames
     */
    public logGroupNames: string[] | undefined;

    /**
     * Create a new `AWS::Logs::QueryDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnQueryDefinitionProps) {
        super(scope, id, { type: CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'queryString', this);
        this.attrQueryDefinitionId = cdk.Token.asString(this.getAtt('QueryDefinitionId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.queryString = props.queryString;
        this.logGroupNames = props.logGroupNames;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            queryString: this.queryString,
            logGroupNames: this.logGroupNames,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnQueryDefinitionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {

    /**
     * The details of the policy. It must be formatted in JSON, and you must use backslashes to escape characters that need to be escaped in JSON strings, such as double quote marks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policydocument
     */
    readonly policyDocument: string;

    /**
     * The name of the resource policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policyname
     */
    readonly policyName: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyDocument', cdk.requiredValidator)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateString)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    return errors.wrap('supplied properties not correct for "CfnResourcePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::ResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::ResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResourcePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourcePolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyDocument: cdk.stringToCloudFormation(properties.policyDocument),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
    };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
    ret.addPropertyResult('policyDocument', 'PolicyDocument', cfn_parse.FromCloudFormation.getString(properties.PolicyDocument));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::ResourcePolicy`
 *
 * Creates or updates a resource policy that allows other AWS services to put log events to this account. An account can have up to 10 resource policies per AWS Region.
 *
 * @cloudformationResource AWS::Logs::ResourcePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::ResourcePolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourcePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The details of the policy. It must be formatted in JSON, and you must use backslashes to escape characters that need to be escaped in JSON strings, such as double quote marks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policydocument
     */
    public policyDocument: string;

    /**
     * The name of the resource policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policyname
     */
    public policyName: string;

    /**
     * Create a new `AWS::Logs::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
        super(scope, id, { type: CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policyDocument', this);
        cdk.requireProperty(props, 'policyName', this);

        this.policyDocument = props.policyDocument;
        this.policyName = props.policyName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            policyDocument: this.policyDocument,
            policyName: this.policyName,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourcePolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSubscriptionFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html
 */
export interface CfnSubscriptionFilterProps {

    /**
     * The Amazon Resource Name (ARN) of the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-destinationarn
     */
    readonly destinationArn: string;

    /**
     * The filtering expressions that restrict what gets delivered to the destination AWS resource. For more information about the filter pattern syntax, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filterpattern
     */
    readonly filterPattern: string;

    /**
     * The log group to associate with the subscription filter. All log events that are uploaded to this log group are filtered and delivered to the specified AWS resource if the filter pattern matches the log events.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-loggroupname
     */
    readonly logGroupName: string;

    /**
     * `AWS::Logs::SubscriptionFilter.Distribution`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-distribution
     */
    readonly distribution?: string;

    /**
     * The name of the subscription filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filtername
     */
    readonly filterName?: string;

    /**
     * The ARN of an IAM role that grants CloudWatch Logs permissions to deliver ingested log events to the destination stream. You don't need to provide the ARN when you are working with a logical destination for cross-account delivery.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-rolearn
     */
    readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionFilterProps`
 *
 * @returns the result of the validation.
 */
function CfnSubscriptionFilterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationArn', cdk.requiredValidator)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('distribution', cdk.validateString)(properties.distribution));
    errors.collect(cdk.propertyValidator('filterName', cdk.validateString)(properties.filterName));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.requiredValidator)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.validateString)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnSubscriptionFilterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Logs::SubscriptionFilter` resource
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionFilterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Logs::SubscriptionFilter` resource.
 */
// @ts-ignore TS6133
function cfnSubscriptionFilterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSubscriptionFilterPropsValidator(properties).assertSuccess();
    return {
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        FilterPattern: cdk.stringToCloudFormation(properties.filterPattern),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        Distribution: cdk.stringToCloudFormation(properties.distribution),
        FilterName: cdk.stringToCloudFormation(properties.filterName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnSubscriptionFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionFilterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionFilterProps>();
    ret.addPropertyResult('destinationArn', 'DestinationArn', cfn_parse.FromCloudFormation.getString(properties.DestinationArn));
    ret.addPropertyResult('filterPattern', 'FilterPattern', cfn_parse.FromCloudFormation.getString(properties.FilterPattern));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('distribution', 'Distribution', properties.Distribution != null ? cfn_parse.FromCloudFormation.getString(properties.Distribution) : undefined);
    ret.addPropertyResult('filterName', 'FilterName', properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Logs::SubscriptionFilter`
 *
 * The `AWS::Logs::SubscriptionFilter` resource specifies a subscription filter and associates it with the specified log group. Subscription filters allow you to subscribe to a real-time stream of log events and have them delivered to a specific destination. Currently, the supported destinations are:
 *
 * - An Amazon Kinesis data stream belonging to the same account as the subscription filter, for same-account delivery.
 * - A logical destination that belongs to a different account, for cross-account delivery.
 * - An Amazon Kinesis Firehose delivery stream that belongs to the same account as the subscription filter, for same-account delivery.
 * - An AWS Lambda function that belongs to the same account as the subscription filter, for same-account delivery.
 *
 * There can be as many as two subscription filters associated with a log group.
 *
 * @cloudformationResource AWS::Logs::SubscriptionFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html
 */
export class CfnSubscriptionFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Logs::SubscriptionFilter";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubscriptionFilter {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSubscriptionFilterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSubscriptionFilter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-destinationarn
     */
    public destinationArn: string;

    /**
     * The filtering expressions that restrict what gets delivered to the destination AWS resource. For more information about the filter pattern syntax, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filterpattern
     */
    public filterPattern: string;

    /**
     * The log group to associate with the subscription filter. All log events that are uploaded to this log group are filtered and delivered to the specified AWS resource if the filter pattern matches the log events.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-loggroupname
     */
    public logGroupName: string;

    /**
     * `AWS::Logs::SubscriptionFilter.Distribution`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-distribution
     */
    public distribution: string | undefined;

    /**
     * The name of the subscription filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filtername
     */
    public filterName: string | undefined;

    /**
     * The ARN of an IAM role that grants CloudWatch Logs permissions to deliver ingested log events to the destination stream. You don't need to provide the ARN when you are working with a logical destination for cross-account delivery.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Create a new `AWS::Logs::SubscriptionFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionFilterProps) {
        super(scope, id, { type: CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'destinationArn', this);
        cdk.requireProperty(props, 'filterPattern', this);
        cdk.requireProperty(props, 'logGroupName', this);

        this.destinationArn = props.destinationArn;
        this.filterPattern = props.filterPattern;
        this.logGroupName = props.logGroupName;
        this.distribution = props.distribution;
        this.filterName = props.filterName;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            destinationArn: this.destinationArn,
            filterPattern: this.filterPattern,
            logGroupName: this.logGroupName,
            distribution: this.distribution,
            filterName: this.filterName,
            roleArn: this.roleArn,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSubscriptionFilterPropsToCloudFormation(props);
    }
}
