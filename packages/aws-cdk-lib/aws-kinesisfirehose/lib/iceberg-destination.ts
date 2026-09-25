import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { createBackupConfig, createBufferingHints, createLoggingOptions, createProcessingConfig } from './private/helpers';
import * as cdk from '../../core';
import { Duration, Size, UnscopedValidationError } from '../../core';

/**
 * Configuration describing where the destination Apache Iceberg Tables are persisted.
 */
export interface CatalogConfiguration {
  /**
   * Glue Catalog ARN.
   *
   * Specifies the Glue catalog ARN identifier of the destination Apache Iceberg Tables.
   * Format: arn:aws:glue:region:account-id:catalog
   *
   * @default - No catalog ARN specified. At least one of catalogArn or warehouseLocation must be provided.
   */
  readonly catalogArn?: string;

  /**
   * Warehouse location for Apache Iceberg tables.
   *
   * The S3 path where Iceberg table data will be stored.
   * Required when schema evolution or table creation is enabled.
   *
   * @default - No warehouse location specified
   */
  readonly warehouseLocation?: string;
}

/**
 * Partition field configuration for Apache Iceberg tables.
 */
export interface PartitionField {
  /**
   * The column name to be configured in partition spec.
   */
  readonly sourceName: string;
}

/**
 * Partition specification for Apache Iceberg tables.
 */
export interface PartitionSpec {
  /**
   * List of identity transforms that performs an identity transformation.
   * The transform takes the source value and does not modify it.
   *
   * @default - No identity transforms
   */
  readonly identity?: PartitionField[];
}

/**
 * Configuration for a destination Apache Iceberg table.
 */
export interface DestinationTableConfiguration {
  /**
   * The name of the Apache Iceberg database.
   */
  readonly databaseName: string;

  /**
   * The name of the Apache Iceberg table.
   */
  readonly tableName: string;

  /**
   * A list of unique keys for a given Apache Iceberg table.
   *
   * Firehose will use these for running Create, Update, or Delete operations on the given Iceberg table.
   *
   * @default - INSERT operations only
   */
  readonly uniqueKeys?: string[];

  /**
   * The table specific S3 error output prefix.
   *
   * All the errors that occurred while delivering to this table will be prefixed with this value in S3 destination.
   *
   * @default - Uses the default error output prefix
   */
  readonly s3ErrorOutputPrefix?: string;

  /**
   * The partition spec configuration for a table that is used by automatic table creation.
   *
   * @default - No partition spec
   */
  readonly partitionSpec?: PartitionSpec;
}

/**
 * Properties for defining an Iceberg destination for a Kinesis Data Firehose delivery stream.
 */
export interface IcebergDestinationProps extends CommonDestinationProps {
  /**
   * Configuration describing where the destination Apache Iceberg Tables are persisted.
   *
   * At least one of catalogArn or warehouseLocation should be specified.
   */
  readonly catalogConfiguration: CatalogConfiguration;

  /**
   * List of destination table configurations.
   *
   * Firehose uses these to deliver data to Apache Iceberg Tables.
   * Firehose will write data with insert if table specific configuration is not provided here.
   *
   * @default - Data will be written with INSERT operations only
   */
  readonly destinationTableConfigurations?: DestinationTableConfiguration[];

  /**
   * Whether all incoming data for this delivery stream will be append only (inserts only and not for updates and deletes).
   *
   * If you set this value to true, Firehose automatically increases the throughput limit of a stream
   * based on the throttling levels of the stream. If you set this parameter to true for a stream with
   * updates and deletes, you will see out of order delivery.
   *
   * @default false
   */
  readonly appendOnly?: boolean;

  /**
   * The length of time that Firehose buffers incoming data before delivering it to the destination.
   *
   * Minimum: Duration.seconds(0)
   * Maximum: Duration.seconds(900)
   *
   * @default Duration.seconds(300)
   */
  readonly bufferingInterval?: Duration;

  /**
   * The size of the buffer that Firehose uses for incoming data before delivering it to the destination.
   *
   * Minimum: Size.mebibytes(1)
   * Maximum: Size.mebibytes(128)
   *
   * @default Size.mebibytes(5)
   */
  readonly bufferingSize?: Size;

  /**
   * The retry duration after a delivery failure.
   *
   * Minimum: Duration.seconds(0)
   * Maximum: Duration.seconds(7200)
   *
   * @default Duration.seconds(3600)
   */
  readonly retryDuration?: Duration;

  /**
   * Enable automatic schema evolution.
   *
   * When enabled, Firehose can automatically evolve the schema of the Iceberg table
   * to accommodate new fields in the incoming data.
   *
   * Note: This feature is only available for DatabaseAsSourceStream and is in preview.
   * It may not work with standard delivery streams.
   *
   * @default false
   */
  readonly schemaEvolutionEnabled?: boolean;

  /**
   * Enable automatic table creation.
   *
   * When enabled, Firehose can automatically create Iceberg tables if they don't exist.
   * Requires warehouseLocation to be specified in catalogConfiguration.
   *
   * Note: This feature is only available for DatabaseAsSourceStream and is in preview.
   * It may not work with standard delivery streams.
   *
   * @default false
   */
  readonly tableCreationEnabled?: boolean;
}

/**
 * An Apache Iceberg destination for data from a Kinesis Data Firehose delivery stream.
 */
export class IcebergDestination implements IDestination {
  private static readonly MIN_BUFFERING_INTERVAL_SECONDS = 0;
  private static readonly MAX_BUFFERING_INTERVAL_SECONDS = 900;
  private static readonly MIN_BUFFERING_SIZE_MIB = 1;
  private static readonly MAX_BUFFERING_SIZE_MIB = 128;
  private static readonly MIN_RETRY_DURATION_SECONDS = 0;
  private static readonly MAX_RETRY_DURATION_SECONDS = 7200;

  constructor(
    private readonly bucket: s3.IBucket,
    private readonly props: IcebergDestinationProps,
  ) {
    // Validate that at least one catalog configuration is provided
    if (!props.catalogConfiguration.catalogArn && !props.catalogConfiguration.warehouseLocation) {
      throw new UnscopedValidationError('IcebergDestination requires at least one of catalogConfiguration.catalogArn or catalogConfiguration.warehouseLocation to be specified');
    }

    // Validate S3 backup mode - Iceberg only supports FAILED mode
    if (this.props.s3Backup?.mode === BackupMode.ALL) {
      throw new UnscopedValidationError('Iceberg destinations only support BackupMode.FAILED for S3 backup');
    }

    // Validate that warehouseLocation is provided when schema evolution or table creation is enabled
    if ((props.schemaEvolutionEnabled || props.tableCreationEnabled) && !props.catalogConfiguration.warehouseLocation) {
      throw new UnscopedValidationError('catalogConfiguration.warehouseLocation is required when schemaEvolutionEnabled or tableCreationEnabled is true');
    }

    this.validateBufferingInterval();
    this.validateBufferingSize();
    this.validateRetryDuration();
  }

  private validateBufferingInterval(): void {
    const bufferingInterval = this.props.bufferingInterval;
    if (bufferingInterval === undefined || cdk.Token.isUnresolved(bufferingInterval)) {
      return;
    }

    const seconds = bufferingInterval.toSeconds();
    if (seconds < IcebergDestination.MIN_BUFFERING_INTERVAL_SECONDS || seconds > IcebergDestination.MAX_BUFFERING_INTERVAL_SECONDS) {
      throw new UnscopedValidationError(
        `\`bufferingInterval\` must be between ${IcebergDestination.MIN_BUFFERING_INTERVAL_SECONDS} and ${IcebergDestination.MAX_BUFFERING_INTERVAL_SECONDS} seconds, got ${seconds} seconds.`,
      );
    }
  }

  private validateBufferingSize(): void {
    const bufferingSize = this.props.bufferingSize;
    if (bufferingSize === undefined || cdk.Token.isUnresolved(bufferingSize)) {
      return;
    }

    const sizeInMiB = bufferingSize.toMebibytes();
    if (sizeInMiB < IcebergDestination.MIN_BUFFERING_SIZE_MIB || sizeInMiB > IcebergDestination.MAX_BUFFERING_SIZE_MIB) {
      throw new UnscopedValidationError(
        `\`bufferingSize\` must be between ${IcebergDestination.MIN_BUFFERING_SIZE_MIB} and ${IcebergDestination.MAX_BUFFERING_SIZE_MIB} MiB, got ${sizeInMiB} MiB.`,
      );
    }
  }

  private validateRetryDuration(): void {
    const retryDuration = this.props.retryDuration;
    if (retryDuration === undefined || cdk.Token.isUnresolved(retryDuration)) {
      return;
    }

    const seconds = retryDuration.toSeconds();
    if (seconds < IcebergDestination.MIN_RETRY_DURATION_SECONDS || seconds > IcebergDestination.MAX_RETRY_DURATION_SECONDS) {
      throw new UnscopedValidationError(
        `\`retryDuration\` must be between ${IcebergDestination.MIN_RETRY_DURATION_SECONDS} and ${IcebergDestination.MAX_RETRY_DURATION_SECONDS} seconds, got ${seconds} seconds.`,
      );
    }
  }

  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    // Create or use provided IAM role
    const role = this.props.role ?? new iam.Role(scope, 'Iceberg Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    // Grant S3 permissions
    const bucketGrant = this.bucket.grantReadWrite(role);

    // Grant Glue Catalog permissions
    // Permissions are needed for both catalogArn and warehouseLocation configurations
    // See: https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-s3-tables
    const catalogArn = this.props.catalogConfiguration.catalogArn;
    const actions = [
      'glue:GetDatabase',
      'glue:GetTable',
      'glue:UpdateTable',
    ];

    // Add CreateTable permission if table creation is enabled
    if (this.props.tableCreationEnabled) {
      actions.push('glue:CreateTable');
    }

    // Build specific resource ARNs based on destination table configurations
    const resources: string[] = [];
    const stack = cdk.Stack.of(scope);

    // Determine region and account from catalogArn or use stack defaults
    const region = catalogArn ? cdk.Arn.split(catalogArn, cdk.ArnFormat.COLON_RESOURCE_NAME).region : stack.region;
    const account = catalogArn ? cdk.Arn.split(catalogArn, cdk.ArnFormat.COLON_RESOURCE_NAME).account : stack.account;

    // Add catalog resource
    resources.push(stack.formatArn({
      service: 'glue',
      resource: 'catalog',
      region,
      account,
    }));

    // Add specific database and table resources if configurations are provided
    if (this.props.destinationTableConfigurations && this.props.destinationTableConfigurations.length > 0) {
      const databases = new Set<string>();
      const tables = new Set<string>();

      for (const config of this.props.destinationTableConfigurations) {
        databases.add(config.databaseName);
        tables.add(`${config.databaseName}/${config.tableName}`);
      }

      for (const dbName of databases) {
        resources.push(stack.formatArn({
          service: 'glue',
          resource: 'database',
          resourceName: dbName,
          region,
          account,
        }));
      }

      for (const tablePath of tables) {
        resources.push(stack.formatArn({
          service: 'glue',
          resource: 'table',
          resourceName: tablePath,
          region,
          account,
        }));
      }
    } else {
      // If no specific table configurations are provided, grant access to all databases and tables
      resources.push(stack.formatArn({
        service: 'glue',
        resource: 'database',
        resourceName: '*',
        region,
        account,
      }));
      resources.push(stack.formatArn({
        service: 'glue',
        resource: 'table',
        resourceName: '*/*',
        region,
        account,
      }));
    }

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions,
      resources,
    }));

    // Create logging configuration
    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'IcebergDestination',
    }) ?? {};

    // Create backup configuration
    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};

    // Create processing configuration
    const processingConfig = createProcessingConfig(scope, role, this.props.processors);

    // Create buffering hints
    const bufferingHints = createBufferingHints(
      scope,
      this.props.bufferingInterval,
      this.props.bufferingSize,
    );

    // Build destination table configuration list
    const destinationTableConfigurationList = this.props.destinationTableConfigurations?.map(config => ({
      destinationDatabaseName: config.databaseName,
      destinationTableName: config.tableName,
      uniqueKeys: config.uniqueKeys,
      s3ErrorOutputPrefix: config.s3ErrorOutputPrefix,
      partitionSpec: config.partitionSpec ? {
        identity: config.partitionSpec.identity?.map(field => ({
          sourceName: field.sourceName,
        })),
      } : undefined,
    }));

    // Build retry options
    const retryOptions = this.props.retryDuration ? {
      durationInSeconds: this.props.retryDuration.toSeconds(),
    } : undefined;

    return {
      icebergDestinationConfiguration: {
        catalogConfiguration: {
          catalogArn: this.props.catalogConfiguration.catalogArn,
          warehouseLocation: this.props.catalogConfiguration.warehouseLocation,
        },
        roleArn: role.roleArn,
        s3Configuration: backupConfig ?? {
          bucketArn: this.bucket.bucketArn,
          roleArn: role.roleArn,
          bufferingHints,
        },
        // Iceberg destinations only support FailedDataOnly mode.
        // When a bucket is specified without an explicit mode, default to FailedDataOnly.
        s3BackupMode: this.props.s3Backup?.bucket || this.props.s3Backup?.mode === BackupMode.FAILED ? 'FailedDataOnly': undefined,
        appendOnly: this.props.appendOnly,
        bufferingHints,
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: processingConfig,
        destinationTableConfigurationList,
        retryOptions,
        schemaEvolutionConfiguration: this.props.schemaEvolutionEnabled ? {
          enabled: true,
        } : undefined,
        tableCreationConfiguration: this.props.tableCreationEnabled ? {
          enabled: true,
        } : undefined,
      },
      dependables: [bucketGrant, ...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }
}
