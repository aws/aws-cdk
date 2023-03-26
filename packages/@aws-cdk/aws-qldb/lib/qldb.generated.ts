// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:45.397Z","fingerprint":"Q7TX7UYKGCKD8Tbys8xc6wKS8haFvyDOur1zS2IuMx0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnLedger`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html
 */
export interface CfnLedgerProps {

    /**
     * The permissions mode to assign to the ledger that you want to create. This parameter can have one of the following values:
     *
     * - `ALLOW_ALL` : A legacy permissions mode that enables access control with API-level granularity for ledgers.
     *
     * This mode allows users who have the `SendCommand` API permission for this ledger to run all PartiQL commands (hence, `ALLOW_ALL` ) on any tables in the specified ledger. This mode disregards any table-level or command-level IAM permissions policies that you create for the ledger.
     * - `STANDARD` : ( *Recommended* ) A permissions mode that enables access control with finer granularity for ledgers, tables, and PartiQL commands.
     *
     * By default, this mode denies all user requests to run any PartiQL commands on any tables in this ledger. To allow PartiQL commands to run, you must create IAM permissions policies for specific table resources and PartiQL actions, in addition to the `SendCommand` API permission for the ledger. For information, see [Getting started with the standard permissions mode](https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started-standard-mode.html) in the *Amazon QLDB Developer Guide* .
     *
     * > We strongly recommend using the `STANDARD` permissions mode to maximize the security of your ledger data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-permissionsmode
     */
    readonly permissionsMode: string;

    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled ( `true` ) by default.
     *
     * If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the `UpdateLedger` operation to set this parameter to `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-deletionprotection
     */
    readonly deletionProtection?: boolean | cdk.IResolvable;

    /**
     * The key in AWS Key Management Service ( AWS KMS ) to use for encryption of data at rest in the ledger. For more information, see [Encryption at rest](https://docs.aws.amazon.com/qldb/latest/developerguide/encryption-at-rest.html) in the *Amazon QLDB Developer Guide* .
     *
     * Use one of the following options to specify this parameter:
     *
     * - `AWS_OWNED_KMS_KEY` : Use an AWS KMS key that is owned and managed by AWS on your behalf.
     * - *Undefined* : By default, use an AWS owned KMS key.
     * - *A valid symmetric customer managed KMS key* : Use the specified symmetric encryption KMS key in your account that you create, own, and manage.
     *
     * Amazon QLDB does not support asymmetric keys. For more information, see [Using symmetric and asymmetric keys](https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
     *
     * To specify a customer managed KMS key, you can use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. When using an alias name, prefix it with `"alias/"` . To specify a key in a different AWS account , you must use the key ARN or alias ARN.
     *
     * For example:
     *
     * - Key ID: `1234abcd-12ab-34cd-56ef-1234567890ab`
     * - Key ARN: `arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
     * - Alias name: `alias/ExampleAlias`
     * - Alias ARN: `arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`
     *
     * For more information, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) in the *AWS Key Management Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-kmskey
     */
    readonly kmsKey?: string;

    /**
     * The name of the ledger that you want to create. The name must be unique among all of the ledgers in your AWS account in the current Region.
     *
     * Naming constraints for ledger names are defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-name
     */
    readonly name?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLedgerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLedgerProps`
 *
 * @returns the result of the validation.
 */
function CfnLedgerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deletionProtection', cdk.validateBoolean)(properties.deletionProtection));
    errors.collect(cdk.propertyValidator('kmsKey', cdk.validateString)(properties.kmsKey));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissionsMode', cdk.requiredValidator)(properties.permissionsMode));
    errors.collect(cdk.propertyValidator('permissionsMode', cdk.validateString)(properties.permissionsMode));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLedgerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QLDB::Ledger` resource
 *
 * @param properties - the TypeScript properties of a `CfnLedgerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QLDB::Ledger` resource.
 */
// @ts-ignore TS6133
function cfnLedgerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLedgerPropsValidator(properties).assertSuccess();
    return {
        PermissionsMode: cdk.stringToCloudFormation(properties.permissionsMode),
        DeletionProtection: cdk.booleanToCloudFormation(properties.deletionProtection),
        KmsKey: cdk.stringToCloudFormation(properties.kmsKey),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLedgerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLedgerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLedgerProps>();
    ret.addPropertyResult('permissionsMode', 'PermissionsMode', cfn_parse.FromCloudFormation.getString(properties.PermissionsMode));
    ret.addPropertyResult('deletionProtection', 'DeletionProtection', properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined);
    ret.addPropertyResult('kmsKey', 'KmsKey', properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QLDB::Ledger`
 *
 * The `AWS::QLDB::Ledger` resource specifies a new Amazon Quantum Ledger Database (Amazon QLDB) ledger in your AWS account . Amazon QLDB is a fully managed ledger database that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority. You can use QLDB to track all application data changes, and maintain a complete and verifiable history of changes over time.
 *
 * For more information, see [CreateLedger](https://docs.aws.amazon.com/qldb/latest/developerguide/API_CreateLedger.html) in the *Amazon QLDB API Reference* .
 *
 * @cloudformationResource AWS::QLDB::Ledger
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html
 */
export class CfnLedger extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QLDB::Ledger";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLedger {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLedgerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLedger(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The permissions mode to assign to the ledger that you want to create. This parameter can have one of the following values:
     *
     * - `ALLOW_ALL` : A legacy permissions mode that enables access control with API-level granularity for ledgers.
     *
     * This mode allows users who have the `SendCommand` API permission for this ledger to run all PartiQL commands (hence, `ALLOW_ALL` ) on any tables in the specified ledger. This mode disregards any table-level or command-level IAM permissions policies that you create for the ledger.
     * - `STANDARD` : ( *Recommended* ) A permissions mode that enables access control with finer granularity for ledgers, tables, and PartiQL commands.
     *
     * By default, this mode denies all user requests to run any PartiQL commands on any tables in this ledger. To allow PartiQL commands to run, you must create IAM permissions policies for specific table resources and PartiQL actions, in addition to the `SendCommand` API permission for the ledger. For information, see [Getting started with the standard permissions mode](https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started-standard-mode.html) in the *Amazon QLDB Developer Guide* .
     *
     * > We strongly recommend using the `STANDARD` permissions mode to maximize the security of your ledger data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-permissionsmode
     */
    public permissionsMode: string;

    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled ( `true` ) by default.
     *
     * If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the `UpdateLedger` operation to set this parameter to `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-deletionprotection
     */
    public deletionProtection: boolean | cdk.IResolvable | undefined;

    /**
     * The key in AWS Key Management Service ( AWS KMS ) to use for encryption of data at rest in the ledger. For more information, see [Encryption at rest](https://docs.aws.amazon.com/qldb/latest/developerguide/encryption-at-rest.html) in the *Amazon QLDB Developer Guide* .
     *
     * Use one of the following options to specify this parameter:
     *
     * - `AWS_OWNED_KMS_KEY` : Use an AWS KMS key that is owned and managed by AWS on your behalf.
     * - *Undefined* : By default, use an AWS owned KMS key.
     * - *A valid symmetric customer managed KMS key* : Use the specified symmetric encryption KMS key in your account that you create, own, and manage.
     *
     * Amazon QLDB does not support asymmetric keys. For more information, see [Using symmetric and asymmetric keys](https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
     *
     * To specify a customer managed KMS key, you can use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. When using an alias name, prefix it with `"alias/"` . To specify a key in a different AWS account , you must use the key ARN or alias ARN.
     *
     * For example:
     *
     * - Key ID: `1234abcd-12ab-34cd-56ef-1234567890ab`
     * - Key ARN: `arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
     * - Alias name: `alias/ExampleAlias`
     * - Alias ARN: `arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`
     *
     * For more information, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) in the *AWS Key Management Service Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-kmskey
     */
    public kmsKey: string | undefined;

    /**
     * The name of the ledger that you want to create. The name must be unique among all of the ledgers in your AWS account in the current Region.
     *
     * Naming constraints for ledger names are defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-name
     */
    public name: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::QLDB::Ledger`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLedgerProps) {
        super(scope, id, { type: CfnLedger.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'permissionsMode', this);

        this.permissionsMode = props.permissionsMode;
        this.deletionProtection = props.deletionProtection;
        this.kmsKey = props.kmsKey;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QLDB::Ledger", props.tags, { tagPropertyName: 'tags' });
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::QLDB::Ledger\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLedger.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            permissionsMode: this.permissionsMode,
            deletionProtection: this.deletionProtection,
            kmsKey: this.kmsKey,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLedgerPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStream`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html
 */
export interface CfnStreamProps {

    /**
     * The inclusive start date and time from which to start streaming journal data. This parameter must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
     *
     * The `InclusiveStartTime` cannot be in the future and must be before `ExclusiveEndTime` .
     *
     * If you provide an `InclusiveStartTime` that is before the ledger's `CreationDateTime` , QLDB effectively defaults it to the ledger's `CreationDateTime` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-inclusivestarttime
     */
    readonly inclusiveStartTime: string;

    /**
     * The configuration settings of the Kinesis Data Streams destination for your stream request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-kinesisconfiguration
     */
    readonly kinesisConfiguration: CfnStream.KinesisConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the ledger.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-ledgername
     */
    readonly ledgerName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource.
     *
     * To pass a role to QLDB when requesting a journal stream, you must have permissions to perform the `iam:PassRole` action on the IAM role resource. This is required for all journal stream requests.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-rolearn
     */
    readonly roleArn: string;

    /**
     * The name that you want to assign to the QLDB journal stream. User-defined names can help identify and indicate the purpose of a stream.
     *
     * Your stream name must be unique among other *active* streams for a given ledger. Stream names have the same naming constraints as ledger names, as defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-streamname
     */
    readonly streamName: string;

    /**
     * The exclusive date and time that specifies when the stream ends. If you don't define this parameter, the stream runs indefinitely until you cancel it.
     *
     * The `ExclusiveEndTime` must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-exclusiveendtime
     */
    readonly exclusiveEndTime?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-tags
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
    errors.collect(cdk.propertyValidator('exclusiveEndTime', cdk.validateString)(properties.exclusiveEndTime));
    errors.collect(cdk.propertyValidator('inclusiveStartTime', cdk.requiredValidator)(properties.inclusiveStartTime));
    errors.collect(cdk.propertyValidator('inclusiveStartTime', cdk.validateString)(properties.inclusiveStartTime));
    errors.collect(cdk.propertyValidator('kinesisConfiguration', cdk.requiredValidator)(properties.kinesisConfiguration));
    errors.collect(cdk.propertyValidator('kinesisConfiguration', CfnStream_KinesisConfigurationPropertyValidator)(properties.kinesisConfiguration));
    errors.collect(cdk.propertyValidator('ledgerName', cdk.requiredValidator)(properties.ledgerName));
    errors.collect(cdk.propertyValidator('ledgerName', cdk.validateString)(properties.ledgerName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('streamName', cdk.requiredValidator)(properties.streamName));
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStreamProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QLDB::Stream` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QLDB::Stream` resource.
 */
// @ts-ignore TS6133
function cfnStreamPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamPropsValidator(properties).assertSuccess();
    return {
        InclusiveStartTime: cdk.stringToCloudFormation(properties.inclusiveStartTime),
        KinesisConfiguration: cfnStreamKinesisConfigurationPropertyToCloudFormation(properties.kinesisConfiguration),
        LedgerName: cdk.stringToCloudFormation(properties.ledgerName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        StreamName: cdk.stringToCloudFormation(properties.streamName),
        ExclusiveEndTime: cdk.stringToCloudFormation(properties.exclusiveEndTime),
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
    ret.addPropertyResult('inclusiveStartTime', 'InclusiveStartTime', cfn_parse.FromCloudFormation.getString(properties.InclusiveStartTime));
    ret.addPropertyResult('kinesisConfiguration', 'KinesisConfiguration', CfnStreamKinesisConfigurationPropertyFromCloudFormation(properties.KinesisConfiguration));
    ret.addPropertyResult('ledgerName', 'LedgerName', cfn_parse.FromCloudFormation.getString(properties.LedgerName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('streamName', 'StreamName', cfn_parse.FromCloudFormation.getString(properties.StreamName));
    ret.addPropertyResult('exclusiveEndTime', 'ExclusiveEndTime', properties.ExclusiveEndTime != null ? cfn_parse.FromCloudFormation.getString(properties.ExclusiveEndTime) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QLDB::Stream`
 *
 * The `AWS::QLDB::Stream` resource specifies a journal stream for a given Amazon Quantum Ledger Database (Amazon QLDB) ledger. The stream captures every document revision that is committed to the ledger's journal and delivers the data to a specified Amazon Kinesis Data Streams resource.
 *
 * For more information, see [StreamJournalToKinesis](https://docs.aws.amazon.com/qldb/latest/developerguide/API_StreamJournalToKinesis.html) in the *Amazon QLDB API Reference* .
 *
 * @cloudformationResource AWS::QLDB::Stream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html
 */
export class CfnStream extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QLDB::Stream";

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
     * The Amazon Resource Name (ARN) of the QLDB journal stream. For example: `arn:aws:qldb:us-east-1:123456789012:stream/exampleLedger/IiPT4brpZCqCq3f4MTHbYy` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique ID that QLDB assigns to each QLDB journal stream. For example: `IiPT4brpZCqCq3f4MTHbYy` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The inclusive start date and time from which to start streaming journal data. This parameter must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
     *
     * The `InclusiveStartTime` cannot be in the future and must be before `ExclusiveEndTime` .
     *
     * If you provide an `InclusiveStartTime` that is before the ledger's `CreationDateTime` , QLDB effectively defaults it to the ledger's `CreationDateTime` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-inclusivestarttime
     */
    public inclusiveStartTime: string;

    /**
     * The configuration settings of the Kinesis Data Streams destination for your stream request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-kinesisconfiguration
     */
    public kinesisConfiguration: CfnStream.KinesisConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the ledger.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-ledgername
     */
    public ledgerName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource.
     *
     * To pass a role to QLDB when requesting a journal stream, you must have permissions to perform the `iam:PassRole` action on the IAM role resource. This is required for all journal stream requests.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-rolearn
     */
    public roleArn: string;

    /**
     * The name that you want to assign to the QLDB journal stream. User-defined names can help identify and indicate the purpose of a stream.
     *
     * Your stream name must be unique among other *active* streams for a given ledger. Stream names have the same naming constraints as ledger names, as defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-streamname
     */
    public streamName: string;

    /**
     * The exclusive date and time that specifies when the stream ends. If you don't define this parameter, the stream runs indefinitely until you cancel it.
     *
     * The `ExclusiveEndTime` must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-exclusiveendtime
     */
    public exclusiveEndTime: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::QLDB::Stream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamProps) {
        super(scope, id, { type: CfnStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'inclusiveStartTime', this);
        cdk.requireProperty(props, 'kinesisConfiguration', this);
        cdk.requireProperty(props, 'ledgerName', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'streamName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.inclusiveStartTime = props.inclusiveStartTime;
        this.kinesisConfiguration = props.kinesisConfiguration;
        this.ledgerName = props.ledgerName;
        this.roleArn = props.roleArn;
        this.streamName = props.streamName;
        this.exclusiveEndTime = props.exclusiveEndTime;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QLDB::Stream", props.tags, { tagPropertyName: 'tags' });
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
            inclusiveStartTime: this.inclusiveStartTime,
            kinesisConfiguration: this.kinesisConfiguration,
            ledgerName: this.ledgerName,
            roleArn: this.roleArn,
            streamName: this.streamName,
            exclusiveEndTime: this.exclusiveEndTime,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamPropsToCloudFormation(props);
    }
}

export namespace CfnStream {
    /**
     * The configuration settings of the Amazon Kinesis Data Streams destination for an Amazon QLDB journal stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html
     */
    export interface KinesisConfigurationProperty {
        /**
         * Enables QLDB to publish multiple data records in a single Kinesis Data Streams record, increasing the number of records sent per API call.
         *
         * *This option is enabled by default.* Record aggregation has important implications for processing records and requires de-aggregation in your stream consumer. To learn more, see [KPL Key Concepts](https://docs.aws.amazon.com/streams/latest/dev/kinesis-kpl-concepts.html) and [Consumer De-aggregation](https://docs.aws.amazon.com/streams/latest/dev/kinesis-kpl-consumer-deaggregation.html) in the *Amazon Kinesis Data Streams Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html#cfn-qldb-stream-kinesisconfiguration-aggregationenabled
         */
        readonly aggregationEnabled?: boolean | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the Kinesis Data Streams resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html#cfn-qldb-stream-kinesisconfiguration-streamarn
         */
        readonly streamArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStream_KinesisConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aggregationEnabled', cdk.validateBoolean)(properties.aggregationEnabled));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "KinesisConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QLDB::Stream.KinesisConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `KinesisConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QLDB::Stream.KinesisConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStreamKinesisConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStream_KinesisConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AggregationEnabled: cdk.booleanToCloudFormation(properties.aggregationEnabled),
        StreamArn: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnStreamKinesisConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStream.KinesisConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.KinesisConfigurationProperty>();
    ret.addPropertyResult('aggregationEnabled', 'AggregationEnabled', properties.AggregationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AggregationEnabled) : undefined);
    ret.addPropertyResult('streamArn', 'StreamArn', properties.StreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.StreamArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
