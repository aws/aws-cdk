import { IRole, UnknownPrincipal } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EncryptionOptions } from './enums';
import { CfnScheduledQuery } from './timestream.generated';

/**
 * Scheduled Query Interface
 */
export interface IScheduledQuery extends IResource {
  /**
   * The ARN of the scheduled query.
   *
   * @attribute
   */
  readonly scheduledQueryArn: string

  /**
   * The scheduled query error reporting configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqErrorReportConfiguration: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   *
   * @attribute
   */
  readonly scheduledQuerySqKmsKeyId: string

  /**
   * The scheduled query name.
   *
   * @attribute
   */
  readonly scheduledQuerySqName: string

  /**
   * The scheduled query notification configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqNotificationConfiguration: string

  /**
   * The scheduled query string.
   *
   * @attribute
   */
  readonly scheduledQuerySqQueryString: string

  /**
   * The scheduled query schedule configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqScheduleConfiguration: string

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   *
   * @attribute
   */
  readonly scheduledQuerySqScheduledQueryExecutionRoleArn: string

  /**
   * The configuration for query output.
   *
   * @attribute
   */
  readonly scheduledQuerySqTargetConfiguration: string
}


abstract class ScheduledQueryBase extends Resource implements IScheduledQuery {

  /**
   * References a scheduled query object via its ARN
   *
   * @param scope CDK construct
   * @param id The ID of the construct
   * @param scheduledQueryArn The table ARN to reference
   * @returns Table construct
   */
  public static fromScheduledQueryArn(scope: Construct, id: string, scheduledQueryArn: string): IScheduledQuery {
    class Import extends ScheduledQueryBase {
      public readonly scheduledQueryArn = scheduledQueryArn;
      public readonly scheduledQuerySqName = this.physicalName
      public readonly scheduledQuerySqScheduledQueryExecutionRoleArn: string = this.scheduledQuerySqScheduledQueryExecutionRoleArn
      public readonly scheduledQuerySqErrorReportConfiguration: string = this.scheduledQuerySqErrorReportConfiguration
      public readonly scheduledQuerySqKmsKeyId: string = this.scheduledQuerySqKmsKeyId
      public readonly scheduledQuerySqNotificationConfiguration: string = this.scheduledQuerySqNotificationConfiguration
      public readonly scheduledQuerySqQueryString: string = this.scheduledQuerySqQueryString
      public readonly scheduledQuerySqScheduleConfiguration: string = this.scheduledQuerySqScheduleConfiguration
      public readonly scheduledQuerySqTargetConfiguration: string = this.scheduledQuerySqTargetConfiguration
      public readonly grantPrincipal = new UnknownPrincipal({ resource: this });
    }
    return new Import(scope, id, {
      environmentFromArn: scheduledQueryArn,
    });
  }

  /**
   * The ARN of the scheduled query.
   */
  abstract readonly scheduledQueryArn: string

  /**
   * The scheduled query error reporting configuration.
   */
  abstract readonly scheduledQuerySqErrorReportConfiguration: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   */
  abstract readonly scheduledQuerySqKmsKeyId: string

  /**
   * The scheduled query name.
   */
  abstract readonly scheduledQuerySqName: string

  /**
   * The scheduled query notification configuration.
   */
  abstract readonly scheduledQuerySqNotificationConfiguration: string

  /**
   * The scheduled query string.
   */
  abstract readonly scheduledQuerySqQueryString: string

  /**
   * The scheduled query schedule configuration.
   */
  abstract readonly scheduledQuerySqScheduleConfiguration: string

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   */
  abstract readonly scheduledQuerySqScheduledQueryExecutionRoleArn: string

  /**
   * The configuration for query output.
   */
  abstract readonly scheduledQuerySqTargetConfiguration: string


}

/**
 * Details on S3 location for error reports that result from running a query.
 */
export interface S3Configuration {
  /**
   *  Name of the S3 bucket under which error reports will be created.
   */
  readonly bucketName: string

  /**
   * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
   */
  readonly encryptionOption: EncryptionOptions

  /**
   * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
   */
  readonly objectKeyPrefix: string
}

/**
 * Configuration required for error reporting.
 */
export interface ErrorReportConfiguration {
  /**
    * The S3 configuration for the error reports.
    */
  readonly s3Configuration: S3Configuration
}

/**
 * Details on SNS that are required to send the notification.
 */
export interface SnsConfiguration {
  /**
   * SNS topic ARN that the scheduled query status notifications will be sent to.
   */
  readonly topicArn: string
}

/**
 * Notification configuration for a scheduled query. A notification is sent by Timestream when a scheduled query is created, its state is updated or when it is deleted.
 */
export interface NotificationConfiguration {
  /**
   * Details on SNS configuration.
   */
  readonly snsConfiguration: SnsConfiguration
}

/**
 * Configuration of the schedule of the query.
 */
export interface ScheduleConfiguration {
  /**
    * Configuration of the schedule of the query.
    */
  readonly scheduleExpression: string
}

/**
 * This type is used to map column(s) from the query result to a dimension in the destination table.
 */
export interface DimensionMapping {
  /**
   * Type for the dimension.
   */
  readonly dimensionValueType: string

  /**
   * Column name from query result.
   */
  readonly name: string
}

/**
 * Attribute mapping for MULTI value measures.
 */
export interface MultiMeasureAttributeMappings {
  /**
   * Type of the attribute to be read from the source column.
   */
  readonly measureValueType: string

  /**
   * Source column from where the attribute value is to be read.
   */
  readonly sourceColumn: string

  /**
   * Custom name to be used for attribute name in derived table. If not provided, source column name would be used.
   *
   * @default None
   */
  readonly targetMultiMeasureAttributeName?: string
}

/**
 * MixedMeasureMappings are mappings that can be used to ingest data into a mixture of narrow and multi measures in the derived table.
 */
export interface MixedMeasureMappings {
  /**
   * Refers to the value of measure_name in a result row. This field is required if MeasureNameColumn is provided.
   *
   * @default None
   */
  readonly measureName?: string

  /**
   * Type of the value that is to be read from sourceColumn. If the mapping is for MULTI, use MeasureValueType.MULTI.
   */
  readonly measureValueType: string

  /**
   * Required when measureValueType is MULTI. Attribute mappings for MULTI value measures.
   *
   * @default None
   */
  readonly multiMeasureAttributeMappings?: MultiMeasureAttributeMappings[]

  /**
   * This field refers to the source column from which measure-value is to be read for result materialization.
   *
   * @default None
   */
  readonly sourceColumn: string

  /**
   * Target measure name to be used. If not provided, the target measure name by default would be measure-name if provided, or sourceColumn otherwise.
   *
   * @default None
   */
  readonly targetMeasureName: string
}

/**
 * Only one of MixedMeasureMappings or MultiMeasureMappings is to be provided. MultiMeasureMappings can be used to ingest data as multi measures in the derived table.
 */
export interface MultiMeasureMappings {
  /**
   * Required. Attribute mappings to be used for mapping query results to ingest data for multi-measure attributes.
   */
  readonly multiMeasureAttributeMappings: MultiMeasureAttributeMappings[]

  /**
   * The name of the target multi-measure name in the derived table. This input is required when measureNameColumn is not provided. If MeasureNameColumn is provided, then value from that column will be used as multi-measure name.
   */
  readonly targetMultiMeasureName: string
}


/**
 * Configuration to write data into Timestream database and table. This configuration allows the user to map the query result select columns into the destination table columns.
 */
export interface TimestreamConfiguration {
  /**
   * Name of Timestream database to which the query result will be written.
   */
  readonly databaseName: string

  /**
   * This is to allow mapping column(s) from the query result to the dimension in the destination table.
   */
  readonly dimensionMappings: DimensionMapping[]

  /**
   * Name of the measure column.
   *
   * @default None
   */
  readonly measureNameColumn?: string

  /**
   * Specifies how to map measures to multi-measure records.
   *
   * @default None
   */
  readonly mixedMeasureMappings?: MixedMeasureMappings[]

  /**
   * Multi-measure mappings.
   *
   * @default None
   */
  readonly multiMeasureMappings?: MultiMeasureMappings

  /**
   * Name of Timestream table that the query result will be written to. The table should be within the same database that is provided in Timestream configuration.
   */
  readonly tableName: string

  /**
   * Column from query result that should be used as the time column in destination table. Column type for this should be TIMESTAMP.
   */
  readonly timeColumn: string
}

/**
 * Configuration used for writing the output of a query.
 */
export interface TargetConfiguration {
  /**
   * Configuration needed to write data into the Timestream database and table.
   */
  readonly timestreamConfiguration: TimestreamConfiguration
}

/**
 * Scheduled Query Properties
 */
export interface ScheduledQueryProps {
  /**
   * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result. Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.
   *
   * @default None
   */
  readonly clientToken?: string

  /**
   * Configuration for error reporting. Error reports will be generated when a problem is encountered when writing the query results.
   */
  readonly errorReportConfiguration: ErrorReportConfiguration

  /**
   * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with alias/
   *
   * @default None
   */
  readonly kmsKey?: IKey

  /**
   * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
   */
  readonly notificationConfiguration: NotificationConfiguration

  /**
   * The query string to run. Parameter names can be specified in the query string @ character followed by an identifier. The named Parameter @scheduled_runtime is reserved and can be used in the query to get the time at which the query is scheduled to run.
   */
  readonly queryString: string

  /**
   * Schedule configuration.
   */
  readonly scheduleConfiguration: ScheduleConfiguration

  /**
   * The ARN for the IAM role that Timestream will assume when running the scheduled query.
   */
  readonly scheduledQueryExecutionRole: IRole

  /**
   * A name for the query. Scheduled query names must be unique within each Region.
   */
  readonly scheduledQueryName: string

  /**
   * Scheduled query target store configuration.
   */
  readonly targetConfiguration: TargetConfiguration
}


/**
 *  Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the ScheduledQueryExecutionRoleArn parameter to run the query. You can use the NotificationConfiguration parameter to configure notification for your scheduled query operations.
 */
export class ScheduledQuery extends ScheduledQueryBase {
  /**
   * The ARN of the scheduled query.
   *
   * @attribute
   */
  readonly scheduledQueryArn: string

  /**
   * The scheduled query error reporting configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqErrorReportConfiguration: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   *
   * @attribute
   */
  readonly scheduledQuerySqKmsKeyId: string

  /**
   * The scheduled query name.
   *
   * @attribute
   */
  readonly scheduledQuerySqName: string

  /**
   * The scheduled query notification configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqNotificationConfiguration: string

  /**
   * The scheduled query string.
   *
   * @attribute
   */
  readonly scheduledQuerySqQueryString: string

  /**
   * The scheduled query schedule configuration.
   *
   * @attribute
   */
  readonly scheduledQuerySqScheduleConfiguration: string

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   *
   * @attribute
   */
  readonly scheduledQuerySqScheduledQueryExecutionRoleArn: string

  /**
   * The configuration for query output.
   *
   * @attribute
   */
  readonly scheduledQuerySqTargetConfiguration: string

  constructor(scope: Construct, id: string, props: ScheduledQueryProps) {
    super(scope, id, {
      physicalName: props.scheduledQueryName,
    });

    const resource = new CfnScheduledQuery(this, 'Resource', {
      clientToken: props.clientToken,
      errorReportConfiguration: props.errorReportConfiguration,
      kmsKeyId: props.kmsKey?.keyId,
      notificationConfiguration: props.notificationConfiguration,
      queryString: props.queryString,
      scheduleConfiguration: props.scheduleConfiguration,
      scheduledQueryExecutionRoleArn: props.scheduledQueryExecutionRole.roleArn,
      scheduledQueryName: props.scheduledQueryName,
      targetConfiguration: props.targetConfiguration,
    });

    this.scheduledQueryArn = resource.attrArn;
    this.scheduledQuerySqErrorReportConfiguration = resource.attrSqErrorReportConfiguration;
    this.scheduledQuerySqKmsKeyId = resource.attrSqKmsKeyId;
    this.scheduledQuerySqName = resource.attrSqName;
    this.scheduledQuerySqNotificationConfiguration = resource.attrSqNotificationConfiguration;
    this.scheduledQuerySqQueryString = resource.attrSqQueryString;
    this.scheduledQuerySqScheduleConfiguration = resource.attrSqScheduleConfiguration;
    this.scheduledQuerySqScheduledQueryExecutionRoleArn = resource.attrSqScheduledQueryExecutionRoleArn;
    this.scheduledQuerySqTargetConfiguration = resource.attrSqTargetConfiguration;
  }
}