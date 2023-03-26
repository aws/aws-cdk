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
 * A CloudFormation `AWS::Timestream::Database`
 *
 * Creates a new Timestream database. If the AWS KMS key is not specified, the database will be encrypted with a Timestream managed AWS KMS key located in your account. Refer to [AWS managed AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-managed-cmk) for more info. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-db.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Database
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html
 */
export declare class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::Database";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase;
    /**
     * The `arn` of the database.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the Timestream database.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-databasename
     */
    databaseName: string | undefined;
    /**
     * The identifier of the AWS KMS key used to encrypt the data stored in the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * The tags to add to the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Timestream::Database`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnDatabaseProps);
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
 * A CloudFormation `AWS::Timestream::ScheduledQuery`
 *
 * Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the `ScheduledQueryExecutionRoleArn` parameter to run the query. You can use the `NotificationConfiguration` parameter to configure notification for your scheduled query operations.
 *
 * @cloudformationResource AWS::Timestream::ScheduledQuery
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html
 */
export declare class CfnScheduledQuery extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::ScheduledQuery";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledQuery;
    /**
     * The `ARN` of the scheduled query.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The scheduled query error reporting configuration.
     * @cloudformationAttribute SQErrorReportConfiguration
     */
    readonly attrSqErrorReportConfiguration: string;
    /**
     * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
     * @cloudformationAttribute SQKmsKeyId
     */
    readonly attrSqKmsKeyId: string;
    /**
     * The scheduled query name.
     * @cloudformationAttribute SQName
     */
    readonly attrSqName: string;
    /**
     * The scheduled query notification configuration.
     * @cloudformationAttribute SQNotificationConfiguration
     */
    readonly attrSqNotificationConfiguration: string;
    /**
     * The scheduled query string..
     * @cloudformationAttribute SQQueryString
     */
    readonly attrSqQueryString: string;
    /**
     * The scheduled query schedule configuration.
     * @cloudformationAttribute SQScheduleConfiguration
     */
    readonly attrSqScheduleConfiguration: string;
    /**
     * The ARN of the IAM role that will be used by Timestream to run the query.
     * @cloudformationAttribute SQScheduledQueryExecutionRoleArn
     */
    readonly attrSqScheduledQueryExecutionRoleArn: string;
    /**
     * The configuration for query output.
     * @cloudformationAttribute SQTargetConfiguration
     */
    readonly attrSqTargetConfiguration: string;
    /**
     * Configuration for error reporting. Error reports will be generated when a problem is encountered when writing the query results.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-errorreportconfiguration
     */
    errorReportConfiguration: CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable;
    /**
     * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-notificationconfiguration
     */
    notificationConfiguration: CfnScheduledQuery.NotificationConfigurationProperty | cdk.IResolvable;
    /**
     * The query string to run. Parameter names can be specified in the query string `@` character followed by an identifier. The named Parameter `@scheduled_runtime` is reserved and can be used in the query to get the time at which the query is scheduled to run.
     *
     * The timestamp calculated according to the ScheduleConfiguration parameter, will be the value of `@scheduled_runtime` paramater for each query run. For example, consider an instance of a scheduled query executing on 2021-12-01 00:00:00. For this instance, the `@scheduled_runtime` parameter is initialized to the timestamp 2021-12-01 00:00:00 when invoking the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-querystring
     */
    queryString: string;
    /**
     * Schedule configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduleconfiguration
     */
    scheduleConfiguration: CfnScheduledQuery.ScheduleConfigurationProperty | cdk.IResolvable;
    /**
     * The ARN for the IAM role that Timestream will assume when running the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryexecutionrolearn
     */
    scheduledQueryExecutionRoleArn: string;
    /**
     * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result. Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.
     *
     * - If CreateScheduledQuery is called without a `ClientToken` , the Query SDK generates a `ClientToken` on your behalf.
     * - After 8 hours, any request with the same `ClientToken` is treated as a new request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-clienttoken
     */
    clientToken: string | undefined;
    /**
     * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with *alias/*
     *
     * If ErrorReportConfiguration uses `SSE_KMS` as encryption type, the same KmsKeyId is used to encrypt the error report at rest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * A name for the query. Scheduled query names must be unique within each Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryname
     */
    scheduledQueryName: string | undefined;
    /**
     * A list of key-value pairs to label the scheduled query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Scheduled query target store configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-targetconfiguration
     */
    targetConfiguration: CfnScheduledQuery.TargetConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Timestream::ScheduledQuery`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScheduledQueryProps);
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
export declare namespace CfnScheduledQuery {
    /**
     * This type is used to map column(s) from the query result to a dimension in the destination table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html
     */
    interface DimensionMappingProperty {
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
export declare namespace CfnScheduledQuery {
    /**
     * Configuration required for error reporting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html
     */
    interface ErrorReportConfigurationProperty {
        /**
         * The S3 configuration for the error reports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html#cfn-timestream-scheduledquery-errorreportconfiguration-s3configuration
         */
        readonly s3Configuration: CfnScheduledQuery.S3ConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnScheduledQuery {
    /**
     * MixedMeasureMappings are mappings that can be used to ingest data into a mixture of narrow and multi measures in the derived table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html
     */
    interface MixedMeasureMappingProperty {
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
export declare namespace CfnScheduledQuery {
    /**
     * Attribute mapping for MULTI value measures.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html
     */
    interface MultiMeasureAttributeMappingProperty {
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
export declare namespace CfnScheduledQuery {
    /**
     * Only one of MixedMeasureMappings or MultiMeasureMappings is to be provided. MultiMeasureMappings can be used to ingest data as multi measures in the derived table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html
     */
    interface MultiMeasureMappingsProperty {
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
export declare namespace CfnScheduledQuery {
    /**
     * Notification configuration for a scheduled query. A notification is sent by Timestream when a scheduled query is created, its state is updated or when it is deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html
     */
    interface NotificationConfigurationProperty {
        /**
         * Details on SNS configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html#cfn-timestream-scheduledquery-notificationconfiguration-snsconfiguration
         */
        readonly snsConfiguration: CfnScheduledQuery.SnsConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnScheduledQuery {
    /**
     * Details on S3 location for error reports that result from running a query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html
     */
    interface S3ConfigurationProperty {
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
export declare namespace CfnScheduledQuery {
    /**
     * Configuration of the schedule of the query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html
     */
    interface ScheduleConfigurationProperty {
        /**
         * An expression that denotes when to trigger the scheduled query run. This can be a cron expression or a rate expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html#cfn-timestream-scheduledquery-scheduleconfiguration-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}
export declare namespace CfnScheduledQuery {
    /**
     * Details on SNS that are required to send the notification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html
     */
    interface SnsConfigurationProperty {
        /**
         * SNS topic ARN that the scheduled query status notifications will be sent to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html#cfn-timestream-scheduledquery-snsconfiguration-topicarn
         */
        readonly topicArn: string;
    }
}
export declare namespace CfnScheduledQuery {
    /**
     * Configuration used for writing the output of a query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html
     */
    interface TargetConfigurationProperty {
        /**
         * Configuration needed to write data into the Timestream database and table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html#cfn-timestream-scheduledquery-targetconfiguration-timestreamconfiguration
         */
        readonly timestreamConfiguration: CfnScheduledQuery.TimestreamConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnScheduledQuery {
    /**
     * Configuration to write data into Timestream database and table. This configuration allows the user to map the query result select columns into the destination table columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html
     */
    interface TimestreamConfigurationProperty {
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
 * A CloudFormation `AWS::Timestream::Table`
 *
 * The CreateTable operation adds a new table to an existing database in your account. In an AWS account, table names must be at least unique within each Region if they are in the same database. You may have identical table names in the same Region if the tables are in separate databases. While creating the table, you must specify the table name, database name, and the retention properties. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-table.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Table
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html
 */
export declare class CfnTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Timestream::Table";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable;
    /**
     * The `arn` of the table.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the table.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The name of the Timestream database that contains this table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-databasename
     */
    databaseName: string;
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
    magneticStoreWriteProperties: any | cdk.IResolvable | undefined;
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
    retentionProperties: any | cdk.IResolvable | undefined;
    /**
     * The name of the Timestream table.
     *
     * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tablename
     */
    tableName: string | undefined;
    /**
     * The tags to add to the table
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Timestream::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableProps);
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
export declare namespace CfnTable {
    /**
     * The location to write error reports for records rejected, asynchronously, during magnetic store writes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html
     */
    interface MagneticStoreRejectedDataLocationProperty {
        /**
         * Configuration of an S3 location to write error reports for records rejected, asynchronously, during magnetic store writes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html#cfn-timestream-table-magneticstorerejecteddatalocation-s3configuration
         */
        readonly s3Configuration?: CfnTable.S3ConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTable {
    /**
     * The set of properties on a table for configuring magnetic store writes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html
     */
    interface MagneticStoreWritePropertiesProperty {
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
export declare namespace CfnTable {
    /**
     * Retention properties contain the duration for which your time-series data must be stored in the magnetic store and the memory store.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html
     */
    interface RetentionPropertiesProperty {
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
export declare namespace CfnTable {
    /**
     * The configuration that specifies an S3 location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html
     */
    interface S3ConfigurationProperty {
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
