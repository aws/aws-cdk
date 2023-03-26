// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:23.994Z","fingerprint":"xs6IY0uniLbG3WMFduu//S7CyjHUMhvLzNXeJgX6pcw="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDatabase`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html
 */
export interface CfnDatabaseProps {

    /**
     * The name of the Timestream database.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-databasename
     */
    readonly databaseName?: string;

    /**
     * The identifier of the AWS KMS key used to encrypt the data stored in the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The tags to add to the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDatabaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the result of the validation.
 */
function CfnDatabasePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDatabaseProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Database` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Database` resource.
 */
// @ts-ignore TS6133
function cfnDatabasePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatabasePropsValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDatabasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabaseProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabaseProps>();
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Timestream::Database`
 *
 * Creates a new Timestream database. If the AWS KMS key is not specified, the database will be encrypted with a Timestream managed AWS KMS key located in your account. Refer to [AWS managed AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-managed-cmk) for more info. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-db.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Database
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html
 */
export class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::Database";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatabasePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDatabase(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The `arn` of the database.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the Timestream database.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-databasename
     */
    public databaseName: string | undefined;

    /**
     * The identifier of the AWS KMS key used to encrypt the data stored in the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The tags to add to the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Timestream::Database`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatabaseProps = {}) {
        super(scope, id, { type: CfnDatabase.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.databaseName = props.databaseName;
        this.kmsKeyId = props.kmsKeyId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::Database", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatabase.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            databaseName: this.databaseName,
            kmsKeyId: this.kmsKeyId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatabasePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnScheduledQuery`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html
 */
export interface CfnScheduledQueryProps {

    /**
     * Configuration for error reporting. Error reports will be generated when a problem is encountered when writing the query results.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-errorreportconfiguration
     */
    readonly errorReportConfiguration: CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable;

    /**
     * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-notificationconfiguration
     */
    readonly notificationConfiguration: CfnScheduledQuery.NotificationConfigurationProperty | cdk.IResolvable;

    /**
     * The query string to run. Parameter names can be specified in the query string `@` character followed by an identifier. The named Parameter `@scheduled_runtime` is reserved and can be used in the query to get the time at which the query is scheduled to run.
     *
     * The timestamp calculated according to the ScheduleConfiguration parameter, will be the value of `@scheduled_runtime` paramater for each query run. For example, consider an instance of a scheduled query executing on 2021-12-01 00:00:00. For this instance, the `@scheduled_runtime` parameter is initialized to the timestamp 2021-12-01 00:00:00 when invoking the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-querystring
     */
    readonly queryString: string;

    /**
     * Schedule configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduleconfiguration
     */
    readonly scheduleConfiguration: CfnScheduledQuery.ScheduleConfigurationProperty | cdk.IResolvable;

    /**
     * The ARN for the IAM role that Timestream will assume when running the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryexecutionrolearn
     */
    readonly scheduledQueryExecutionRoleArn: string;

    /**
     * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result. Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.
     *
     * - If CreateScheduledQuery is called without a `ClientToken` , the Query SDK generates a `ClientToken` on your behalf.
     * - After 8 hours, any request with the same `ClientToken` is treated as a new request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-clienttoken
     */
    readonly clientToken?: string;

    /**
     * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with *alias/*
     *
     * If ErrorReportConfiguration uses `SSE_KMS` as encryption type, the same KmsKeyId is used to encrypt the error report at rest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * A name for the query. Scheduled query names must be unique within each Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryname
     */
    readonly scheduledQueryName?: string;

    /**
     * A list of key-value pairs to label the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Scheduled query target store configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-targetconfiguration
     */
    readonly targetConfiguration?: CfnScheduledQuery.TargetConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnScheduledQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduledQueryProps`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQueryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientToken', cdk.validateString)(properties.clientToken));
    errors.collect(cdk.propertyValidator('errorReportConfiguration', cdk.requiredValidator)(properties.errorReportConfiguration));
    errors.collect(cdk.propertyValidator('errorReportConfiguration', CfnScheduledQuery_ErrorReportConfigurationPropertyValidator)(properties.errorReportConfiguration));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('notificationConfiguration', cdk.requiredValidator)(properties.notificationConfiguration));
    errors.collect(cdk.propertyValidator('notificationConfiguration', CfnScheduledQuery_NotificationConfigurationPropertyValidator)(properties.notificationConfiguration));
    errors.collect(cdk.propertyValidator('queryString', cdk.requiredValidator)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateString)(properties.queryString));
    errors.collect(cdk.propertyValidator('scheduleConfiguration', cdk.requiredValidator)(properties.scheduleConfiguration));
    errors.collect(cdk.propertyValidator('scheduleConfiguration', CfnScheduledQuery_ScheduleConfigurationPropertyValidator)(properties.scheduleConfiguration));
    errors.collect(cdk.propertyValidator('scheduledQueryExecutionRoleArn', cdk.requiredValidator)(properties.scheduledQueryExecutionRoleArn));
    errors.collect(cdk.propertyValidator('scheduledQueryExecutionRoleArn', cdk.validateString)(properties.scheduledQueryExecutionRoleArn));
    errors.collect(cdk.propertyValidator('scheduledQueryName', cdk.validateString)(properties.scheduledQueryName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetConfiguration', CfnScheduledQuery_TargetConfigurationPropertyValidator)(properties.targetConfiguration));
    return errors.wrap('supplied properties not correct for "CfnScheduledQueryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery` resource
 *
 * @param properties - the TypeScript properties of a `CfnScheduledQueryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQueryPropsValidator(properties).assertSuccess();
    return {
        ErrorReportConfiguration: cfnScheduledQueryErrorReportConfigurationPropertyToCloudFormation(properties.errorReportConfiguration),
        NotificationConfiguration: cfnScheduledQueryNotificationConfigurationPropertyToCloudFormation(properties.notificationConfiguration),
        QueryString: cdk.stringToCloudFormation(properties.queryString),
        ScheduleConfiguration: cfnScheduledQueryScheduleConfigurationPropertyToCloudFormation(properties.scheduleConfiguration),
        ScheduledQueryExecutionRoleArn: cdk.stringToCloudFormation(properties.scheduledQueryExecutionRoleArn),
        ClientToken: cdk.stringToCloudFormation(properties.clientToken),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        ScheduledQueryName: cdk.stringToCloudFormation(properties.scheduledQueryName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TargetConfiguration: cfnScheduledQueryTargetConfigurationPropertyToCloudFormation(properties.targetConfiguration),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQueryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQueryProps>();
    ret.addPropertyResult('errorReportConfiguration', 'ErrorReportConfiguration', CfnScheduledQueryErrorReportConfigurationPropertyFromCloudFormation(properties.ErrorReportConfiguration));
    ret.addPropertyResult('notificationConfiguration', 'NotificationConfiguration', CfnScheduledQueryNotificationConfigurationPropertyFromCloudFormation(properties.NotificationConfiguration));
    ret.addPropertyResult('queryString', 'QueryString', cfn_parse.FromCloudFormation.getString(properties.QueryString));
    ret.addPropertyResult('scheduleConfiguration', 'ScheduleConfiguration', CfnScheduledQueryScheduleConfigurationPropertyFromCloudFormation(properties.ScheduleConfiguration));
    ret.addPropertyResult('scheduledQueryExecutionRoleArn', 'ScheduledQueryExecutionRoleArn', cfn_parse.FromCloudFormation.getString(properties.ScheduledQueryExecutionRoleArn));
    ret.addPropertyResult('clientToken', 'ClientToken', properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('scheduledQueryName', 'ScheduledQueryName', properties.ScheduledQueryName != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledQueryName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('targetConfiguration', 'TargetConfiguration', properties.TargetConfiguration != null ? CfnScheduledQueryTargetConfigurationPropertyFromCloudFormation(properties.TargetConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Timestream::ScheduledQuery`
 *
 * Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the `ScheduledQueryExecutionRoleArn` parameter to run the query. You can use the `NotificationConfiguration` parameter to configure notification for your scheduled query operations.
 *
 * @cloudformationResource AWS::Timestream::ScheduledQuery
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html
 */
export class CfnScheduledQuery extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::ScheduledQuery";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledQuery {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnScheduledQueryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnScheduledQuery(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The `ARN` of the scheduled query.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The scheduled query error reporting configuration.
     * @cloudformationAttribute SQErrorReportConfiguration
     */
    public readonly attrSqErrorReportConfiguration: string;

    /**
     * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
     * @cloudformationAttribute SQKmsKeyId
     */
    public readonly attrSqKmsKeyId: string;

    /**
     * The scheduled query name.
     * @cloudformationAttribute SQName
     */
    public readonly attrSqName: string;

    /**
     * The scheduled query notification configuration.
     * @cloudformationAttribute SQNotificationConfiguration
     */
    public readonly attrSqNotificationConfiguration: string;

    /**
     * The scheduled query string..
     * @cloudformationAttribute SQQueryString
     */
    public readonly attrSqQueryString: string;

    /**
     * The scheduled query schedule configuration.
     * @cloudformationAttribute SQScheduleConfiguration
     */
    public readonly attrSqScheduleConfiguration: string;

    /**
     * The ARN of the IAM role that will be used by Timestream to run the query.
     * @cloudformationAttribute SQScheduledQueryExecutionRoleArn
     */
    public readonly attrSqScheduledQueryExecutionRoleArn: string;

    /**
     * The configuration for query output.
     * @cloudformationAttribute SQTargetConfiguration
     */
    public readonly attrSqTargetConfiguration: string;

    /**
     * Configuration for error reporting. Error reports will be generated when a problem is encountered when writing the query results.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-errorreportconfiguration
     */
    public errorReportConfiguration: CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable;

    /**
     * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-notificationconfiguration
     */
    public notificationConfiguration: CfnScheduledQuery.NotificationConfigurationProperty | cdk.IResolvable;

    /**
     * The query string to run. Parameter names can be specified in the query string `@` character followed by an identifier. The named Parameter `@scheduled_runtime` is reserved and can be used in the query to get the time at which the query is scheduled to run.
     *
     * The timestamp calculated according to the ScheduleConfiguration parameter, will be the value of `@scheduled_runtime` paramater for each query run. For example, consider an instance of a scheduled query executing on 2021-12-01 00:00:00. For this instance, the `@scheduled_runtime` parameter is initialized to the timestamp 2021-12-01 00:00:00 when invoking the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-querystring
     */
    public queryString: string;

    /**
     * Schedule configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduleconfiguration
     */
    public scheduleConfiguration: CfnScheduledQuery.ScheduleConfigurationProperty | cdk.IResolvable;

    /**
     * The ARN for the IAM role that Timestream will assume when running the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryexecutionrolearn
     */
    public scheduledQueryExecutionRoleArn: string;

    /**
     * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result. Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.
     *
     * - If CreateScheduledQuery is called without a `ClientToken` , the Query SDK generates a `ClientToken` on your behalf.
     * - After 8 hours, any request with the same `ClientToken` is treated as a new request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-clienttoken
     */
    public clientToken: string | undefined;

    /**
     * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with *alias/*
     *
     * If ErrorReportConfiguration uses `SSE_KMS` as encryption type, the same KmsKeyId is used to encrypt the error report at rest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * A name for the query. Scheduled query names must be unique within each Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryname
     */
    public scheduledQueryName: string | undefined;

    /**
     * A list of key-value pairs to label the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Scheduled query target store configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-targetconfiguration
     */
    public targetConfiguration: CfnScheduledQuery.TargetConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Timestream::ScheduledQuery`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScheduledQueryProps) {
        super(scope, id, { type: CfnScheduledQuery.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'errorReportConfiguration', this);
        cdk.requireProperty(props, 'notificationConfiguration', this);
        cdk.requireProperty(props, 'queryString', this);
        cdk.requireProperty(props, 'scheduleConfiguration', this);
        cdk.requireProperty(props, 'scheduledQueryExecutionRoleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrSqErrorReportConfiguration = cdk.Token.asString(this.getAtt('SQErrorReportConfiguration', cdk.ResolutionTypeHint.STRING));
        this.attrSqKmsKeyId = cdk.Token.asString(this.getAtt('SQKmsKeyId', cdk.ResolutionTypeHint.STRING));
        this.attrSqName = cdk.Token.asString(this.getAtt('SQName', cdk.ResolutionTypeHint.STRING));
        this.attrSqNotificationConfiguration = cdk.Token.asString(this.getAtt('SQNotificationConfiguration', cdk.ResolutionTypeHint.STRING));
        this.attrSqQueryString = cdk.Token.asString(this.getAtt('SQQueryString', cdk.ResolutionTypeHint.STRING));
        this.attrSqScheduleConfiguration = cdk.Token.asString(this.getAtt('SQScheduleConfiguration', cdk.ResolutionTypeHint.STRING));
        this.attrSqScheduledQueryExecutionRoleArn = cdk.Token.asString(this.getAtt('SQScheduledQueryExecutionRoleArn', cdk.ResolutionTypeHint.STRING));
        this.attrSqTargetConfiguration = cdk.Token.asString(this.getAtt('SQTargetConfiguration', cdk.ResolutionTypeHint.STRING));

        this.errorReportConfiguration = props.errorReportConfiguration;
        this.notificationConfiguration = props.notificationConfiguration;
        this.queryString = props.queryString;
        this.scheduleConfiguration = props.scheduleConfiguration;
        this.scheduledQueryExecutionRoleArn = props.scheduledQueryExecutionRoleArn;
        this.clientToken = props.clientToken;
        this.kmsKeyId = props.kmsKeyId;
        this.scheduledQueryName = props.scheduledQueryName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::ScheduledQuery", props.tags, { tagPropertyName: 'tags' });
        this.targetConfiguration = props.targetConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduledQuery.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            errorReportConfiguration: this.errorReportConfiguration,
            notificationConfiguration: this.notificationConfiguration,
            queryString: this.queryString,
            scheduleConfiguration: this.scheduleConfiguration,
            scheduledQueryExecutionRoleArn: this.scheduledQueryExecutionRoleArn,
            clientToken: this.clientToken,
            kmsKeyId: this.kmsKeyId,
            scheduledQueryName: this.scheduledQueryName,
            tags: this.tags.renderTags(),
            targetConfiguration: this.targetConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnScheduledQueryPropsToCloudFormation(props);
    }
}

export namespace CfnScheduledQuery {
    /**
     * This type is used to map column(s) from the query result to a dimension in the destination table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html
     */
    export interface DimensionMappingProperty {
        /**
         * Type for the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html#cfn-timestream-scheduledquery-dimensionmapping-dimensionvaluetype
         */
        readonly dimensionValueType: string;
        /**
         * Column name from query result.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html#cfn-timestream-scheduledquery-dimensionmapping-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionMappingProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_DimensionMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionValueType', cdk.requiredValidator)(properties.dimensionValueType));
    errors.collect(cdk.propertyValidator('dimensionValueType', cdk.validateString)(properties.dimensionValueType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DimensionMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.DimensionMapping` resource
 *
 * @param properties - the TypeScript properties of a `DimensionMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.DimensionMapping` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryDimensionMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_DimensionMappingPropertyValidator(properties).assertSuccess();
    return {
        DimensionValueType: cdk.stringToCloudFormation(properties.dimensionValueType),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryDimensionMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.DimensionMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.DimensionMappingProperty>();
    ret.addPropertyResult('dimensionValueType', 'DimensionValueType', cfn_parse.FromCloudFormation.getString(properties.DimensionValueType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Configuration required for error reporting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html
     */
    export interface ErrorReportConfigurationProperty {
        /**
         * The S3 configuration for the error reports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html#cfn-timestream-scheduledquery-errorreportconfiguration-s3configuration
         */
        readonly s3Configuration: CfnScheduledQuery.S3ConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ErrorReportConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorReportConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_ErrorReportConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Configuration', cdk.requiredValidator)(properties.s3Configuration));
    errors.collect(cdk.propertyValidator('s3Configuration', CfnScheduledQuery_S3ConfigurationPropertyValidator)(properties.s3Configuration));
    return errors.wrap('supplied properties not correct for "ErrorReportConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.ErrorReportConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ErrorReportConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.ErrorReportConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryErrorReportConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_ErrorReportConfigurationPropertyValidator(properties).assertSuccess();
    return {
        S3Configuration: cfnScheduledQueryS3ConfigurationPropertyToCloudFormation(properties.s3Configuration),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryErrorReportConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.ErrorReportConfigurationProperty>();
    ret.addPropertyResult('s3Configuration', 'S3Configuration', CfnScheduledQueryS3ConfigurationPropertyFromCloudFormation(properties.S3Configuration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * MixedMeasureMappings are mappings that can be used to ingest data into a mixture of narrow and multi measures in the derived table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html
     */
    export interface MixedMeasureMappingProperty {
        /**
         * Refers to the value of measure_name in a result row. This field is required if MeasureNameColumn is provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-measurename
         */
        readonly measureName?: string;
        /**
         * Type of the value that is to be read from sourceColumn. If the mapping is for MULTI, use MeasureValueType.MULTI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-measurevaluetype
         */
        readonly measureValueType: string;
        /**
         * Required when measureValueType is MULTI. Attribute mappings for MULTI value measures.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-multimeasureattributemappings
         */
        readonly multiMeasureAttributeMappings?: Array<CfnScheduledQuery.MultiMeasureAttributeMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * This field refers to the source column from which measure-value is to be read for result materialization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-sourcecolumn
         */
        readonly sourceColumn?: string;
        /**
         * Target measure name to be used. If not provided, the target measure name by default would be measure-name if provided, or sourceColumn otherwise.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-targetmeasurename
         */
        readonly targetMeasureName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MixedMeasureMappingProperty`
 *
 * @param properties - the TypeScript properties of a `MixedMeasureMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_MixedMeasureMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('measureName', cdk.validateString)(properties.measureName));
    errors.collect(cdk.propertyValidator('measureValueType', cdk.requiredValidator)(properties.measureValueType));
    errors.collect(cdk.propertyValidator('measureValueType', cdk.validateString)(properties.measureValueType));
    errors.collect(cdk.propertyValidator('multiMeasureAttributeMappings', cdk.listValidator(CfnScheduledQuery_MultiMeasureAttributeMappingPropertyValidator))(properties.multiMeasureAttributeMappings));
    errors.collect(cdk.propertyValidator('sourceColumn', cdk.validateString)(properties.sourceColumn));
    errors.collect(cdk.propertyValidator('targetMeasureName', cdk.validateString)(properties.targetMeasureName));
    return errors.wrap('supplied properties not correct for "MixedMeasureMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MixedMeasureMapping` resource
 *
 * @param properties - the TypeScript properties of a `MixedMeasureMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MixedMeasureMapping` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryMixedMeasureMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_MixedMeasureMappingPropertyValidator(properties).assertSuccess();
    return {
        MeasureName: cdk.stringToCloudFormation(properties.measureName),
        MeasureValueType: cdk.stringToCloudFormation(properties.measureValueType),
        MultiMeasureAttributeMappings: cdk.listMapper(cfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation)(properties.multiMeasureAttributeMappings),
        SourceColumn: cdk.stringToCloudFormation(properties.sourceColumn),
        TargetMeasureName: cdk.stringToCloudFormation(properties.targetMeasureName),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryMixedMeasureMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.MixedMeasureMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MixedMeasureMappingProperty>();
    ret.addPropertyResult('measureName', 'MeasureName', properties.MeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureName) : undefined);
    ret.addPropertyResult('measureValueType', 'MeasureValueType', cfn_parse.FromCloudFormation.getString(properties.MeasureValueType));
    ret.addPropertyResult('multiMeasureAttributeMappings', 'MultiMeasureAttributeMappings', properties.MultiMeasureAttributeMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation)(properties.MultiMeasureAttributeMappings) : undefined);
    ret.addPropertyResult('sourceColumn', 'SourceColumn', properties.SourceColumn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn) : undefined);
    ret.addPropertyResult('targetMeasureName', 'TargetMeasureName', properties.TargetMeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMeasureName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Attribute mapping for MULTI value measures.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html
     */
    export interface MultiMeasureAttributeMappingProperty {
        /**
         * Type of the attribute to be read from the source column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-measurevaluetype
         */
        readonly measureValueType: string;
        /**
         * Source column from where the attribute value is to be read.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-sourcecolumn
         */
        readonly sourceColumn: string;
        /**
         * Custom name to be used for attribute name in derived table. If not provided, source column name would be used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-targetmultimeasureattributename
         */
        readonly targetMultiMeasureAttributeName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MultiMeasureAttributeMappingProperty`
 *
 * @param properties - the TypeScript properties of a `MultiMeasureAttributeMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_MultiMeasureAttributeMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('measureValueType', cdk.requiredValidator)(properties.measureValueType));
    errors.collect(cdk.propertyValidator('measureValueType', cdk.validateString)(properties.measureValueType));
    errors.collect(cdk.propertyValidator('sourceColumn', cdk.requiredValidator)(properties.sourceColumn));
    errors.collect(cdk.propertyValidator('sourceColumn', cdk.validateString)(properties.sourceColumn));
    errors.collect(cdk.propertyValidator('targetMultiMeasureAttributeName', cdk.validateString)(properties.targetMultiMeasureAttributeName));
    return errors.wrap('supplied properties not correct for "MultiMeasureAttributeMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MultiMeasureAttributeMapping` resource
 *
 * @param properties - the TypeScript properties of a `MultiMeasureAttributeMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MultiMeasureAttributeMapping` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_MultiMeasureAttributeMappingPropertyValidator(properties).assertSuccess();
    return {
        MeasureValueType: cdk.stringToCloudFormation(properties.measureValueType),
        SourceColumn: cdk.stringToCloudFormation(properties.sourceColumn),
        TargetMultiMeasureAttributeName: cdk.stringToCloudFormation(properties.targetMultiMeasureAttributeName),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.MultiMeasureAttributeMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MultiMeasureAttributeMappingProperty>();
    ret.addPropertyResult('measureValueType', 'MeasureValueType', cfn_parse.FromCloudFormation.getString(properties.MeasureValueType));
    ret.addPropertyResult('sourceColumn', 'SourceColumn', cfn_parse.FromCloudFormation.getString(properties.SourceColumn));
    ret.addPropertyResult('targetMultiMeasureAttributeName', 'TargetMultiMeasureAttributeName', properties.TargetMultiMeasureAttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMultiMeasureAttributeName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Only one of MixedMeasureMappings or MultiMeasureMappings is to be provided. MultiMeasureMappings can be used to ingest data as multi measures in the derived table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html
     */
    export interface MultiMeasureMappingsProperty {
        /**
         * Required. Attribute mappings to be used for mapping query results to ingest data for multi-measure attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html#cfn-timestream-scheduledquery-multimeasuremappings-multimeasureattributemappings
         */
        readonly multiMeasureAttributeMappings: Array<CfnScheduledQuery.MultiMeasureAttributeMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the target multi-measure name in the derived table. This input is required when measureNameColumn is not provided. If MeasureNameColumn is provided, then value from that column will be used as multi-measure name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html#cfn-timestream-scheduledquery-multimeasuremappings-targetmultimeasurename
         */
        readonly targetMultiMeasureName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MultiMeasureMappingsProperty`
 *
 * @param properties - the TypeScript properties of a `MultiMeasureMappingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_MultiMeasureMappingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('multiMeasureAttributeMappings', cdk.requiredValidator)(properties.multiMeasureAttributeMappings));
    errors.collect(cdk.propertyValidator('multiMeasureAttributeMappings', cdk.listValidator(CfnScheduledQuery_MultiMeasureAttributeMappingPropertyValidator))(properties.multiMeasureAttributeMappings));
    errors.collect(cdk.propertyValidator('targetMultiMeasureName', cdk.validateString)(properties.targetMultiMeasureName));
    return errors.wrap('supplied properties not correct for "MultiMeasureMappingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MultiMeasureMappings` resource
 *
 * @param properties - the TypeScript properties of a `MultiMeasureMappingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.MultiMeasureMappings` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryMultiMeasureMappingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_MultiMeasureMappingsPropertyValidator(properties).assertSuccess();
    return {
        MultiMeasureAttributeMappings: cdk.listMapper(cfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation)(properties.multiMeasureAttributeMappings),
        TargetMultiMeasureName: cdk.stringToCloudFormation(properties.targetMultiMeasureName),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureMappingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.MultiMeasureMappingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MultiMeasureMappingsProperty>();
    ret.addPropertyResult('multiMeasureAttributeMappings', 'MultiMeasureAttributeMappings', cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation)(properties.MultiMeasureAttributeMappings));
    ret.addPropertyResult('targetMultiMeasureName', 'TargetMultiMeasureName', properties.TargetMultiMeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMultiMeasureName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Notification configuration for a scheduled query. A notification is sent by Timestream when a scheduled query is created, its state is updated or when it is deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html
     */
    export interface NotificationConfigurationProperty {
        /**
         * Details on SNS configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html#cfn-timestream-scheduledquery-notificationconfiguration-snsconfiguration
         */
        readonly snsConfiguration: CfnScheduledQuery.SnsConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_NotificationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snsConfiguration', cdk.requiredValidator)(properties.snsConfiguration));
    errors.collect(cdk.propertyValidator('snsConfiguration', CfnScheduledQuery_SnsConfigurationPropertyValidator)(properties.snsConfiguration));
    return errors.wrap('supplied properties not correct for "NotificationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.NotificationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.NotificationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryNotificationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_NotificationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SnsConfiguration: cfnScheduledQuerySnsConfigurationPropertyToCloudFormation(properties.snsConfiguration),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryNotificationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.NotificationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.NotificationConfigurationProperty>();
    ret.addPropertyResult('snsConfiguration', 'SnsConfiguration', CfnScheduledQuerySnsConfigurationPropertyFromCloudFormation(properties.SnsConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Details on S3 location for error reports that result from running a query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html
     */
    export interface S3ConfigurationProperty {
        /**
         * Name of the S3 bucket under which error reports will be created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-bucketname
         */
        readonly bucketName: string;
        /**
         * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-encryptionoption
         */
        readonly encryptionOption?: string;
        /**
         * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-objectkeyprefix
         */
        readonly objectKeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_S3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('encryptionOption', cdk.validateString)(properties.encryptionOption));
    errors.collect(cdk.propertyValidator('objectKeyPrefix', cdk.validateString)(properties.objectKeyPrefix));
    return errors.wrap('supplied properties not correct for "S3ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.S3Configuration` resource
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.S3Configuration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryS3ConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_S3ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        EncryptionOption: cdk.stringToCloudFormation(properties.encryptionOption),
        ObjectKeyPrefix: cdk.stringToCloudFormation(properties.objectKeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.S3ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.S3ConfigurationProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('encryptionOption', 'EncryptionOption', properties.EncryptionOption != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionOption) : undefined);
    ret.addPropertyResult('objectKeyPrefix', 'ObjectKeyPrefix', properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Configuration of the schedule of the query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html
     */
    export interface ScheduleConfigurationProperty {
        /**
         * An expression that denotes when to trigger the scheduled query run. This can be a cron expression or a rate expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html#cfn-timestream-scheduledquery-scheduleconfiguration-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_ScheduleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    return errors.wrap('supplied properties not correct for "ScheduleConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.ScheduleConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.ScheduleConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryScheduleConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_ScheduleConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryScheduleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.ScheduleConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.ScheduleConfigurationProperty>();
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Details on SNS that are required to send the notification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html
     */
    export interface SnsConfigurationProperty {
        /**
         * SNS topic ARN that the scheduled query status notifications will be sent to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html#cfn-timestream-scheduledquery-snsconfiguration-topicarn
         */
        readonly topicArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SnsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_SnsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topicArn', cdk.requiredValidator)(properties.topicArn));
    errors.collect(cdk.propertyValidator('topicArn', cdk.validateString)(properties.topicArn));
    return errors.wrap('supplied properties not correct for "SnsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.SnsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SnsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.SnsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQuerySnsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_SnsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        TopicArn: cdk.stringToCloudFormation(properties.topicArn),
    };
}

// @ts-ignore TS6133
function CfnScheduledQuerySnsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.SnsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.SnsConfigurationProperty>();
    ret.addPropertyResult('topicArn', 'TopicArn', cfn_parse.FromCloudFormation.getString(properties.TopicArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Configuration used for writing the output of a query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html
     */
    export interface TargetConfigurationProperty {
        /**
         * Configuration needed to write data into the Timestream database and table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html#cfn-timestream-scheduledquery-targetconfiguration-timestreamconfiguration
         */
        readonly timestreamConfiguration: CfnScheduledQuery.TimestreamConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TargetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_TargetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('timestreamConfiguration', cdk.requiredValidator)(properties.timestreamConfiguration));
    errors.collect(cdk.propertyValidator('timestreamConfiguration', CfnScheduledQuery_TimestreamConfigurationPropertyValidator)(properties.timestreamConfiguration));
    return errors.wrap('supplied properties not correct for "TargetConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.TargetConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TargetConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.TargetConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryTargetConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_TargetConfigurationPropertyValidator(properties).assertSuccess();
    return {
        TimestreamConfiguration: cfnScheduledQueryTimestreamConfigurationPropertyToCloudFormation(properties.timestreamConfiguration),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryTargetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.TargetConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.TargetConfigurationProperty>();
    ret.addPropertyResult('timestreamConfiguration', 'TimestreamConfiguration', CfnScheduledQueryTimestreamConfigurationPropertyFromCloudFormation(properties.TimestreamConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnScheduledQuery {
    /**
     * Configuration to write data into Timestream database and table. This configuration allows the user to map the query result select columns into the destination table columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html
     */
    export interface TimestreamConfigurationProperty {
        /**
         * Name of Timestream database to which the query result will be written.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-databasename
         */
        readonly databaseName: string;
        /**
         * This is to allow mapping column(s) from the query result to the dimension in the destination table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-dimensionmappings
         */
        readonly dimensionMappings: Array<CfnScheduledQuery.DimensionMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Name of the measure column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-measurenamecolumn
         */
        readonly measureNameColumn?: string;
        /**
         * Specifies how to map measures to multi-measure records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-mixedmeasuremappings
         */
        readonly mixedMeasureMappings?: Array<CfnScheduledQuery.MixedMeasureMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Multi-measure mappings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-multimeasuremappings
         */
        readonly multiMeasureMappings?: CfnScheduledQuery.MultiMeasureMappingsProperty | cdk.IResolvable;
        /**
         * Name of Timestream table that the query result will be written to. The table should be within the same database that is provided in Timestream configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-tablename
         */
        readonly tableName: string;
        /**
         * Column from query result that should be used as the time column in destination table. Column type for this should be TIMESTAMP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-timecolumn
         */
        readonly timeColumn: string;
    }
}

/**
 * Determine whether the given properties match those of a `TimestreamConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnScheduledQuery_TimestreamConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('dimensionMappings', cdk.requiredValidator)(properties.dimensionMappings));
    errors.collect(cdk.propertyValidator('dimensionMappings', cdk.listValidator(CfnScheduledQuery_DimensionMappingPropertyValidator))(properties.dimensionMappings));
    errors.collect(cdk.propertyValidator('measureNameColumn', cdk.validateString)(properties.measureNameColumn));
    errors.collect(cdk.propertyValidator('mixedMeasureMappings', cdk.listValidator(CfnScheduledQuery_MixedMeasureMappingPropertyValidator))(properties.mixedMeasureMappings));
    errors.collect(cdk.propertyValidator('multiMeasureMappings', CfnScheduledQuery_MultiMeasureMappingsPropertyValidator)(properties.multiMeasureMappings));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('timeColumn', cdk.requiredValidator)(properties.timeColumn));
    errors.collect(cdk.propertyValidator('timeColumn', cdk.validateString)(properties.timeColumn));
    return errors.wrap('supplied properties not correct for "TimestreamConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.TimestreamConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TimestreamConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::ScheduledQuery.TimestreamConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduledQueryTimestreamConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduledQuery_TimestreamConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DimensionMappings: cdk.listMapper(cfnScheduledQueryDimensionMappingPropertyToCloudFormation)(properties.dimensionMappings),
        MeasureNameColumn: cdk.stringToCloudFormation(properties.measureNameColumn),
        MixedMeasureMappings: cdk.listMapper(cfnScheduledQueryMixedMeasureMappingPropertyToCloudFormation)(properties.mixedMeasureMappings),
        MultiMeasureMappings: cfnScheduledQueryMultiMeasureMappingsPropertyToCloudFormation(properties.multiMeasureMappings),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        TimeColumn: cdk.stringToCloudFormation(properties.timeColumn),
    };
}

// @ts-ignore TS6133
function CfnScheduledQueryTimestreamConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.TimestreamConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.TimestreamConfigurationProperty>();
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('dimensionMappings', 'DimensionMappings', cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryDimensionMappingPropertyFromCloudFormation)(properties.DimensionMappings));
    ret.addPropertyResult('measureNameColumn', 'MeasureNameColumn', properties.MeasureNameColumn != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureNameColumn) : undefined);
    ret.addPropertyResult('mixedMeasureMappings', 'MixedMeasureMappings', properties.MixedMeasureMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMixedMeasureMappingPropertyFromCloudFormation)(properties.MixedMeasureMappings) : undefined);
    ret.addPropertyResult('multiMeasureMappings', 'MultiMeasureMappings', properties.MultiMeasureMappings != null ? CfnScheduledQueryMultiMeasureMappingsPropertyFromCloudFormation(properties.MultiMeasureMappings) : undefined);
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addPropertyResult('timeColumn', 'TimeColumn', cfn_parse.FromCloudFormation.getString(properties.TimeColumn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html
 */
export interface CfnTableProps {

    /**
     * The name of the Timestream database that contains this table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-databasename
     */
    readonly databaseName: string;

    /**
     * Contains properties to set on the table when enabling magnetic store writes.
     *
     * This object has the following attributes:
     *
     * - *EnableMagneticStoreWrites* : A `boolean` flag to enable magnetic store writes.
     * - *MagneticStoreRejectedDataLocation* : The location to write error reports for records rejected, asynchronously, during magnetic store writes. Only `S3Configuration` objects are allowed. The `S3Configuration` object has the following attributes:
     *
     * - *BucketName* : The name of the S3 bucket.
     * - *EncryptionOption* : The encryption option for the S3 location. Valid values are S3 server-side encryption with an S3 managed key ( `SSE_S3` ) or AWS managed key ( `SSE_KMS` ).
     * - *KmsKeyId* : The AWS KMS key ID to use when encrypting with an AWS managed key.
     * - *ObjectKeyPrefix* : The prefix to use option for the objects stored in S3.
     *
     * Both `BucketName` and `EncryptionOption` are *required* when `S3Configuration` is specified. If you specify `SSE_KMS` as your `EncryptionOption` then `KmsKeyId` is *required* .
     *
     * `EnableMagneticStoreWrites` attribute is *required* when `MagneticStoreWriteProperties` is specified. `MagneticStoreRejectedDataLocation` attribute is *required* when `EnableMagneticStoreWrites` is set to `true` .
     *
     * See the following examples:
     *
     * *JSON*
     *
     * ```json
     * { "Type" : AWS::Timestream::Table", "Properties":{ "DatabaseName":"TestDatabase", "TableName":"TestTable", "MagneticStoreWriteProperties":{ "EnableMagneticStoreWrites":true, "MagneticStoreRejectedDataLocation":{ "S3Configuration":{ "BucketName":"testbucket", "EncryptionOption":"SSE_KMS", "KmsKeyId":"1234abcd-12ab-34cd-56ef-1234567890ab", "ObjectKeyPrefix":"prefix" } } } }
     * }
     * ```
     *
     * *YAML*
     *
     * ```
     * Type: AWS::Timestream::Table
     * DependsOn: TestDatabase
     * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" MagneticStoreWriteProperties: EnableMagneticStoreWrites: true MagneticStoreRejectedDataLocation: S3Configuration: BucketName: "testbucket" EncryptionOption: "SSE_KMS" KmsKeyId: "1234abcd-12ab-34cd-56ef-1234567890ab" ObjectKeyPrefix: "prefix"
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-magneticstorewriteproperties
     */
    readonly magneticStoreWriteProperties?: any | cdk.IResolvable;

    /**
     * The retention duration for the memory store and magnetic store. This object has the following attributes:
     *
     * - *MemoryStoreRetentionPeriodInHours* : Retention duration for memory store, in hours.
     * - *MagneticStoreRetentionPeriodInDays* : Retention duration for magnetic store, in days.
     *
     * Both attributes are of type `string` . Both attributes are *required* when `RetentionProperties` is specified.
     *
     * See the following examples:
     *
     * *JSON*
     *
     * `{ "Type" : AWS::Timestream::Table", "Properties" : { "DatabaseName" : "TestDatabase", "TableName" : "TestTable", "RetentionProperties" : { "MemoryStoreRetentionPeriodInHours": "24", "MagneticStoreRetentionPeriodInDays": "7" } } }`
     *
     * *YAML*
     *
     * ```
     * Type: AWS::Timestream::Table
     * DependsOn: TestDatabase
     * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" RetentionProperties: MemoryStoreRetentionPeriodInHours: "24" MagneticStoreRetentionPeriodInDays: "7"
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-retentionproperties
     */
    readonly retentionProperties?: any | cdk.IResolvable;

    /**
     * The name of the Timestream table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tablename
     */
    readonly tableName?: string;

    /**
     * The tags to add to the table
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
function CfnTablePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('magneticStoreWriteProperties', cdk.validateObject)(properties.magneticStoreWriteProperties));
    errors.collect(cdk.propertyValidator('retentionProperties', cdk.validateObject)(properties.retentionProperties));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnTableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Table` resource
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Table` resource.
 */
// @ts-ignore TS6133
function cfnTablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTablePropsValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        MagneticStoreWriteProperties: cdk.objectToCloudFormation(properties.magneticStoreWriteProperties),
        RetentionProperties: cdk.objectToCloudFormation(properties.retentionProperties),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('magneticStoreWriteProperties', 'MagneticStoreWriteProperties', properties.MagneticStoreWriteProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.MagneticStoreWriteProperties) : undefined);
    ret.addPropertyResult('retentionProperties', 'RetentionProperties', properties.RetentionProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.RetentionProperties) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Timestream::Table`
 *
 * The CreateTable operation adds a new table to an existing database in your account. In an AWS account, table names must be at least unique within each Region if they are in the same database. You may have identical table names in the same Region if the tables are in separate databases. While creating the table, you must specify the table name, database name, and the retention properties. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-table.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Table
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::Table";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTablePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTable(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The `arn` of the table.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the table.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The name of the Timestream database that contains this table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-databasename
     */
    public databaseName: string;

    /**
     * Contains properties to set on the table when enabling magnetic store writes.
     *
     * This object has the following attributes:
     *
     * - *EnableMagneticStoreWrites* : A `boolean` flag to enable magnetic store writes.
     * - *MagneticStoreRejectedDataLocation* : The location to write error reports for records rejected, asynchronously, during magnetic store writes. Only `S3Configuration` objects are allowed. The `S3Configuration` object has the following attributes:
     *
     * - *BucketName* : The name of the S3 bucket.
     * - *EncryptionOption* : The encryption option for the S3 location. Valid values are S3 server-side encryption with an S3 managed key ( `SSE_S3` ) or AWS managed key ( `SSE_KMS` ).
     * - *KmsKeyId* : The AWS KMS key ID to use when encrypting with an AWS managed key.
     * - *ObjectKeyPrefix* : The prefix to use option for the objects stored in S3.
     *
     * Both `BucketName` and `EncryptionOption` are *required* when `S3Configuration` is specified. If you specify `SSE_KMS` as your `EncryptionOption` then `KmsKeyId` is *required* .
     *
     * `EnableMagneticStoreWrites` attribute is *required* when `MagneticStoreWriteProperties` is specified. `MagneticStoreRejectedDataLocation` attribute is *required* when `EnableMagneticStoreWrites` is set to `true` .
     *
     * See the following examples:
     *
     * *JSON*
     *
     * ```json
     * { "Type" : AWS::Timestream::Table", "Properties":{ "DatabaseName":"TestDatabase", "TableName":"TestTable", "MagneticStoreWriteProperties":{ "EnableMagneticStoreWrites":true, "MagneticStoreRejectedDataLocation":{ "S3Configuration":{ "BucketName":"testbucket", "EncryptionOption":"SSE_KMS", "KmsKeyId":"1234abcd-12ab-34cd-56ef-1234567890ab", "ObjectKeyPrefix":"prefix" } } } }
     * }
     * ```
     *
     * *YAML*
     *
     * ```
     * Type: AWS::Timestream::Table
     * DependsOn: TestDatabase
     * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" MagneticStoreWriteProperties: EnableMagneticStoreWrites: true MagneticStoreRejectedDataLocation: S3Configuration: BucketName: "testbucket" EncryptionOption: "SSE_KMS" KmsKeyId: "1234abcd-12ab-34cd-56ef-1234567890ab" ObjectKeyPrefix: "prefix"
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-magneticstorewriteproperties
     */
    public magneticStoreWriteProperties: any | cdk.IResolvable | undefined;

    /**
     * The retention duration for the memory store and magnetic store. This object has the following attributes:
     *
     * - *MemoryStoreRetentionPeriodInHours* : Retention duration for memory store, in hours.
     * - *MagneticStoreRetentionPeriodInDays* : Retention duration for magnetic store, in days.
     *
     * Both attributes are of type `string` . Both attributes are *required* when `RetentionProperties` is specified.
     *
     * See the following examples:
     *
     * *JSON*
     *
     * `{ "Type" : AWS::Timestream::Table", "Properties" : { "DatabaseName" : "TestDatabase", "TableName" : "TestTable", "RetentionProperties" : { "MemoryStoreRetentionPeriodInHours": "24", "MagneticStoreRetentionPeriodInDays": "7" } } }`
     *
     * *YAML*
     *
     * ```
     * Type: AWS::Timestream::Table
     * DependsOn: TestDatabase
     * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" RetentionProperties: MemoryStoreRetentionPeriodInHours: "24" MagneticStoreRetentionPeriodInDays: "7"
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-retentionproperties
     */
    public retentionProperties: any | cdk.IResolvable | undefined;

    /**
     * The name of the Timestream table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tablename
     */
    public tableName: string | undefined;

    /**
     * The tags to add to the table
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Timestream::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
        super(scope, id, { type: CfnTable.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'databaseName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.databaseName = props.databaseName;
        this.magneticStoreWriteProperties = props.magneticStoreWriteProperties;
        this.retentionProperties = props.retentionProperties;
        this.tableName = props.tableName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::Table", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            databaseName: this.databaseName,
            magneticStoreWriteProperties: this.magneticStoreWriteProperties,
            retentionProperties: this.retentionProperties,
            tableName: this.tableName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTablePropsToCloudFormation(props);
    }
}

export namespace CfnTable {
    /**
     * The location to write error reports for records rejected, asynchronously, during magnetic store writes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html
     */
    export interface MagneticStoreRejectedDataLocationProperty {
        /**
         * Configuration of an S3 location to write error reports for records rejected, asynchronously, during magnetic store writes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html#cfn-timestream-table-magneticstorerejecteddatalocation-s3configuration
         */
        readonly s3Configuration?: CfnTable.S3ConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MagneticStoreRejectedDataLocationProperty`
 *
 * @param properties - the TypeScript properties of a `MagneticStoreRejectedDataLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_MagneticStoreRejectedDataLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Configuration', CfnTable_S3ConfigurationPropertyValidator)(properties.s3Configuration));
    return errors.wrap('supplied properties not correct for "MagneticStoreRejectedDataLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Table.MagneticStoreRejectedDataLocation` resource
 *
 * @param properties - the TypeScript properties of a `MagneticStoreRejectedDataLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Table.MagneticStoreRejectedDataLocation` resource.
 */
// @ts-ignore TS6133
function cfnTableMagneticStoreRejectedDataLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_MagneticStoreRejectedDataLocationPropertyValidator(properties).assertSuccess();
    return {
        S3Configuration: cfnTableS3ConfigurationPropertyToCloudFormation(properties.s3Configuration),
    };
}

// @ts-ignore TS6133
function CfnTableMagneticStoreRejectedDataLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.MagneticStoreRejectedDataLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.MagneticStoreRejectedDataLocationProperty>();
    ret.addPropertyResult('s3Configuration', 'S3Configuration', properties.S3Configuration != null ? CfnTableS3ConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The set of properties on a table for configuring magnetic store writes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html
     */
    export interface MagneticStoreWritePropertiesProperty {
        /**
         * A flag to enable magnetic store writes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html#cfn-timestream-table-magneticstorewriteproperties-enablemagneticstorewrites
         */
        readonly enableMagneticStoreWrites: boolean | cdk.IResolvable;
        /**
         * The location to write error reports for records rejected asynchronously during magnetic store writes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html#cfn-timestream-table-magneticstorewriteproperties-magneticstorerejecteddatalocation
         */
        readonly magneticStoreRejectedDataLocation?: CfnTable.MagneticStoreRejectedDataLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MagneticStoreWritePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MagneticStoreWritePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_MagneticStoreWritePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enableMagneticStoreWrites', cdk.requiredValidator)(properties.enableMagneticStoreWrites));
    errors.collect(cdk.propertyValidator('enableMagneticStoreWrites', cdk.validateBoolean)(properties.enableMagneticStoreWrites));
    errors.collect(cdk.propertyValidator('magneticStoreRejectedDataLocation', CfnTable_MagneticStoreRejectedDataLocationPropertyValidator)(properties.magneticStoreRejectedDataLocation));
    return errors.wrap('supplied properties not correct for "MagneticStoreWritePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Table.MagneticStoreWriteProperties` resource
 *
 * @param properties - the TypeScript properties of a `MagneticStoreWritePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Table.MagneticStoreWriteProperties` resource.
 */
// @ts-ignore TS6133
function cfnTableMagneticStoreWritePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_MagneticStoreWritePropertiesPropertyValidator(properties).assertSuccess();
    return {
        EnableMagneticStoreWrites: cdk.booleanToCloudFormation(properties.enableMagneticStoreWrites),
        MagneticStoreRejectedDataLocation: cfnTableMagneticStoreRejectedDataLocationPropertyToCloudFormation(properties.magneticStoreRejectedDataLocation),
    };
}

// @ts-ignore TS6133
function CfnTableMagneticStoreWritePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.MagneticStoreWritePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.MagneticStoreWritePropertiesProperty>();
    ret.addPropertyResult('enableMagneticStoreWrites', 'EnableMagneticStoreWrites', cfn_parse.FromCloudFormation.getBoolean(properties.EnableMagneticStoreWrites));
    ret.addPropertyResult('magneticStoreRejectedDataLocation', 'MagneticStoreRejectedDataLocation', properties.MagneticStoreRejectedDataLocation != null ? CfnTableMagneticStoreRejectedDataLocationPropertyFromCloudFormation(properties.MagneticStoreRejectedDataLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Retention properties contain the duration for which your time-series data must be stored in the magnetic store and the memory store.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html
     */
    export interface RetentionPropertiesProperty {
        /**
         * The duration for which data must be stored in the magnetic store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html#cfn-timestream-table-retentionproperties-magneticstoreretentionperiodindays
         */
        readonly magneticStoreRetentionPeriodInDays?: string;
        /**
         * The duration for which data must be stored in the memory store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html#cfn-timestream-table-retentionproperties-memorystoreretentionperiodinhours
         */
        readonly memoryStoreRetentionPeriodInHours?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RetentionPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_RetentionPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('magneticStoreRetentionPeriodInDays', cdk.validateString)(properties.magneticStoreRetentionPeriodInDays));
    errors.collect(cdk.propertyValidator('memoryStoreRetentionPeriodInHours', cdk.validateString)(properties.memoryStoreRetentionPeriodInHours));
    return errors.wrap('supplied properties not correct for "RetentionPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Table.RetentionProperties` resource
 *
 * @param properties - the TypeScript properties of a `RetentionPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Table.RetentionProperties` resource.
 */
// @ts-ignore TS6133
function cfnTableRetentionPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_RetentionPropertiesPropertyValidator(properties).assertSuccess();
    return {
        MagneticStoreRetentionPeriodInDays: cdk.stringToCloudFormation(properties.magneticStoreRetentionPeriodInDays),
        MemoryStoreRetentionPeriodInHours: cdk.stringToCloudFormation(properties.memoryStoreRetentionPeriodInHours),
    };
}

// @ts-ignore TS6133
function CfnTableRetentionPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.RetentionPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.RetentionPropertiesProperty>();
    ret.addPropertyResult('magneticStoreRetentionPeriodInDays', 'MagneticStoreRetentionPeriodInDays', properties.MagneticStoreRetentionPeriodInDays != null ? cfn_parse.FromCloudFormation.getString(properties.MagneticStoreRetentionPeriodInDays) : undefined);
    ret.addPropertyResult('memoryStoreRetentionPeriodInHours', 'MemoryStoreRetentionPeriodInHours', properties.MemoryStoreRetentionPeriodInHours != null ? cfn_parse.FromCloudFormation.getString(properties.MemoryStoreRetentionPeriodInHours) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The configuration that specifies an S3 location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html
     */
    export interface S3ConfigurationProperty {
        /**
         * The bucket name of the customer S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-bucketname
         */
        readonly bucketName: string;
        /**
         * The encryption option for the customer S3 location. Options are S3 server-side encryption with an S3 managed key or AWS managed key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-encryptionoption
         */
        readonly encryptionOption: string;
        /**
         * The AWS KMS key ID for the customer S3 location when encrypting with an AWS managed key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The object key preview for the customer S3 location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-objectkeyprefix
         */
        readonly objectKeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_S3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('encryptionOption', cdk.requiredValidator)(properties.encryptionOption));
    errors.collect(cdk.propertyValidator('encryptionOption', cdk.validateString)(properties.encryptionOption));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('objectKeyPrefix', cdk.validateString)(properties.objectKeyPrefix));
    return errors.wrap('supplied properties not correct for "S3ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Timestream::Table.S3Configuration` resource
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Timestream::Table.S3Configuration` resource.
 */
// @ts-ignore TS6133
function cfnTableS3ConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_S3ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        EncryptionOption: cdk.stringToCloudFormation(properties.encryptionOption),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        ObjectKeyPrefix: cdk.stringToCloudFormation(properties.objectKeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnTableS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.S3ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.S3ConfigurationProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('encryptionOption', 'EncryptionOption', cfn_parse.FromCloudFormation.getString(properties.EncryptionOption));
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('objectKeyPrefix', 'ObjectKeyPrefix', properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
