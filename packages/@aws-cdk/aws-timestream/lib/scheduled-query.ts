import { Schedule } from '@aws-cdk/aws-events';
import { IRole, UnknownPrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { Bucket, IBucket } from '@aws-cdk/aws-s3';
import { ITopic } from '@aws-cdk/aws-sns';
import { ArnFormat, IResolvable, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EncryptionOptions } from './enums';
import { ITable } from './table';
import { CfnScheduledQuery, CfnScheduledQueryProps } from './timestream.generated';

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
  *  Name of the S3 bucket under which error reports will be created.
  */
  readonly errorReportBucket?: IBucket

  /**
   * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
   * @default SSE_S3
   */
  readonly errorReportEncryptionOption?: EncryptionOptions

  /**
   * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
   * @default "timestream-errors/"
   */
  readonly errorReportObjectKeyPrefix?: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   *
   * @attribute
   */
  readonly kmsKey?: IKey

  /**
   * The scheduled query name.
   *
   * @attribute
   */
  readonly name: string|IResolvable

  /**
   * SNS topic that the scheduled query status notifications will be sent to.
   *
   * @attribute
   */
  readonly notificationTopic: ITopic

  /**
   * The scheduled query string.
   *
   * @attribute
   */
  readonly queryString: string

  /**
   * The scheduled query schedule configuration.
   *
   * @attribute
   */
  readonly schedule: Schedule

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   *
   * @attribute
   */
  readonly executionRole: IRole

  /**
   * The configuration for query output.
   *
   * @attribute
   */
  readonly targetConfiguration?: TargetConfiguration
}


abstract class ScheduledQueryBase extends Resource implements IScheduledQuery {

  /**
   * References a scheduled query object via its ARN
   *
   * @param scope CDK construct
   * @param id The ID of the construct
   * @param scheduledQueryArn The scheduledQuery ARN to reference
   * @returns ScheduledQuery construct
   */
  public static fromScheduledQueryArn(scope: Construct, id: string, scheduledQueryArn: string): IScheduledQuery {
    class Import extends ScheduledQueryBase {
      public readonly scheduledQueryArn = scheduledQueryArn;
      public readonly name = Stack.of(scope).splitArn(scheduledQueryArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName || this.physicalName
      public readonly executionRole: IRole = this.executionRole|| 'dummy-value'
      public readonly errorReportBucket?: IBucket = this.errorReportBucket
      public readonly errorReportEncryptionOption?: EncryptionOptions = this.errorReportEncryptionOption
      public readonly errorReportObjectKeyPrefix?: string = this.errorReportObjectKeyPrefix
      public readonly kmsKey: IKey = this.kmsKey
      public readonly notificationTopic: ITopic = this.notificationTopic
      public readonly queryString: string = this.queryString
      public readonly schedule: Schedule = this.schedule
      public readonly targetConfiguration: TargetConfiguration = this.targetConfiguration
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
   *  Name of the S3 bucket under which error reports will be created.
   */
  abstract readonly errorReportBucket?: IBucket

  /**
       * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
       * @default SSE_S3
       */
  abstract readonly errorReportEncryptionOption?: EncryptionOptions

  /**
       * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
       * @default "timestream-errors/"
       */
  abstract readonly errorReportObjectKeyPrefix?: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   */
  abstract readonly kmsKey?: IKey

  /**
   * The scheduled query name.
   */
  abstract readonly name: string|IResolvable

  /**
   * SNS topic that the scheduled query status notifications will be sent to.
   */
  abstract readonly notificationTopic: ITopic

  /**
   * The scheduled query string.
   */
  abstract readonly queryString: string

  /**
   * The  query schedule
   */
  abstract readonly schedule: Schedule

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   */
  abstract readonly executionRole: IRole

  /**
   * The configuration for query output.
   */
  abstract readonly targetConfiguration?: TargetConfiguration


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
export interface TargetConfiguration {

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
  readonly table: ITable

  /**
   * Column from query result that should be used as the time column in destination table. Column type for this should be TIMESTAMP.
   */
  readonly timeColumn: string
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
   *  Name of the S3 bucket under which error reports will be created.
   *  @default autogenerated Bucket
   */
  readonly errorReportBucket?: IBucket

  /**
    * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
    * @default SSE_S3
    */
  readonly errorReportEncryptionOption?: EncryptionOptions

  /**
    * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
    * @default "timestream-errors/"
    */
  readonly errorReportObjectKeyPrefix?: string

  /**
   * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with alias/
   *
   * @default None
   */
  readonly kmsKey?: IKey

  /**
   * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
   */
  readonly notificationTopic: ITopic

  /**
   * The query string to run. Parameter names can be specified in the query string @ character followed by an identifier. The named Parameter @scheduled_runtime is reserved and can be used in the query to get the time at which the query is scheduled to run.
   */
  readonly queryString: string

  /**
   * Schedule configuration.
   */
  readonly schedule: Schedule

  /**
   * The ARN for the IAM role that Timestream will assume when running the scheduled query.
   * @default autogenerated
   */
  readonly executionRole?: IRole

  /**
   * A name for the query. Scheduled query names must be unique within each Region.
   * @default autogenerated
   */
  readonly scheduledQueryName?: string

  /**
   * Scheduled query target store configuration.
   * @default none, supports reading queries only
   */
  readonly targetConfiguration?: TargetConfiguration

  /**
   * Table the query reads from. If not set, assumes target and source are identical
   * @default targetConfiguration.table
   */
  readonly sourceTable?: ITable;
}


/**
 *  Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the executionRole (or the autogenerated role) parameter to run the query. You can use the NotificationConfiguration parameter to configure notification for your scheduled query operations.
 */
export class ScheduledQuery extends ScheduledQueryBase {
  /**
   * The ARN of the scheduled query.
   *
   * @attribute
   */
  readonly scheduledQueryArn: string

  /**
   *  Name of the S3 bucket under which error reports will be created.
   * @attribute
   */
  readonly errorReportBucket?: IBucket

  /**
       * Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default.
       * @attribute
       */
  readonly errorReportEncryptionOption?: EncryptionOptions

  /**
       * Prefix for the error report key. Timestream by default adds the following prefix to the error report path.
       * @attribute
       */
  readonly errorReportObjectKeyPrefix?: string

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   *
   * @attribute
   */
  readonly kmsKey?: IKey

  /**
   * The scheduled query name.
   *
   * @attribute
   */
  readonly name: string|IResolvable

  /**
   * The scheduled query notification configuration.
   *
   * @attribute
   */
  readonly notificationTopic: ITopic

  /**
   * The scheduled query string.
   *
   * @attribute
   */
  readonly queryString: string

  /**
   * The scheduled query schedule configuration.
   *
   * @attribute
   */
  readonly schedule: Schedule

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   *
   * @attribute
   */
  readonly executionRole: IRole

  /**
   * The configuration for query output.
   *
   * @attribute
   */
  readonly targetConfiguration?: TargetConfiguration

  constructor(scope: Construct, id: string, props: ScheduledQueryProps) {
    super(scope, id, {
      physicalName: props.scheduledQueryName || `SQ-${Stack.of(scope).region}-${scope.node.id}`,
    });

    let scheduledQueryExecutionRole = props.executionRole;

    if (!scheduledQueryExecutionRole) {
      const role = new Role(this, 'TimeStreamScheduledQueryRole', {
        assumedBy: new ServicePrincipal('timestream.amazonaws.com'),
      });
      props.notificationTopic.grantPublish(role);
      props.targetConfiguration?.table.grantReadWrite(role);
      props.errorReportBucket?.grantReadWrite(role);
      props.sourceTable?.grantRead(role);


      if (!props.sourceTable && !props.targetConfiguration?.table) {
        throw new Error('Neither sourceTable nor TargetConfiguration are set, cannot determine correct permissions, please supply scheduledQueryExecutionRole');
      }

      scheduledQueryExecutionRole = role;
    }

    let cfnScheduledQueryProps: CfnScheduledQueryProps = {
      errorReportConfiguration: {
        s3Configuration: {
          bucketName: props.errorReportBucket?.bucketName || 'placeholder',
        },
      },
      clientToken: props.clientToken,
      kmsKeyId: props.kmsKey?.keyId,
      notificationConfiguration: { snsConfiguration: { topicArn: props.notificationTopic.topicArn } },
      queryString: props.queryString,
      scheduleConfiguration: { scheduleExpression: props.schedule.expressionString },
      scheduledQueryExecutionRoleArn: scheduledQueryExecutionRole.roleArn,
      scheduledQueryName: props.scheduledQueryName || `SQ-${Stack.of(scope).region}-${scope.node.id}`,
    };

    if (!props.errorReportBucket && (props.errorReportEncryptionOption || props.errorReportObjectKeyPrefix)) {
      throw new Error('errorReportBucket not set.');
    }

    if (props.errorReportBucket?.bucketName) {
      (cfnScheduledQueryProps.errorReportConfiguration as any) = {
        s3Configuration: {
          bucketName: props.errorReportBucket?.bucketName,
          encryptionOption: props.errorReportEncryptionOption || EncryptionOptions.SSE_S3,
          objectKeyPrefix: props.errorReportObjectKeyPrefix || 'timestream-errors/',
        },
      };
      this.errorReportBucket = props.errorReportBucket;
      this.errorReportEncryptionOption = props.errorReportEncryptionOption || EncryptionOptions.SSE_S3;
      this.errorReportObjectKeyPrefix = props.errorReportObjectKeyPrefix || 'timestream-errors/';
    } else {
      this.errorReportBucket = new Bucket(scope, 'ErrorReportBucket');
      this.errorReportEncryptionOption = props.errorReportEncryptionOption || EncryptionOptions.SSE_S3;
      this.errorReportObjectKeyPrefix = props.errorReportObjectKeyPrefix || 'timestream-errors/';
      (cfnScheduledQueryProps.errorReportConfiguration as any) = {
        s3Configuration: {
          bucketName: this.errorReportBucket.bucketName,
          encryptionOption: this.errorReportEncryptionOption,
          objectKeyPrefix: this.errorReportObjectKeyPrefix,
        },
      };
    }


    if (props.targetConfiguration) {
      (cfnScheduledQueryProps.targetConfiguration as any) = {
        timestreamConfiguration: {
          databaseName: props.targetConfiguration!.table.databaseName,
          tableName: props.targetConfiguration!.table.tableName,
          dimensionMappings: props.targetConfiguration!.dimensionMappings,
          measureNameColumn: props.targetConfiguration?.measureNameColumn,
          mixedMeasureMappings: props.targetConfiguration?.mixedMeasureMappings,
          multiMeasureMappings: props.targetConfiguration?.multiMeasureMappings,
          timeColumn: props.targetConfiguration!.timeColumn,
        },
      };
    }


    const resource = new CfnScheduledQuery(this, 'ScheduledQuery', cfnScheduledQueryProps);

    this.scheduledQueryArn = resource.attrArn;
    this.kmsKey = props.kmsKey;
    this.name = this.physicalName;
    this.schedule = props.schedule;
    this.executionRole = scheduledQueryExecutionRole;

    this.notificationTopic = props.notificationTopic;
    this.queryString = props.queryString;
    this.targetConfiguration = props.targetConfiguration;
  }
}