import type { Construct } from 'constructs';
import {
  BackupMode,
  Compression,
  type CommonDestinationProps,
  type CommonDestinationS3Props,
} from './common';
import type {
  DestinationBindOptions,
  DestinationConfig,
  IDestination,
} from './destination';
import type { CfnDeliveryStream } from './kinesisfirehose.generated';
import {
  createBackupConfig,
  createBufferingHints,
  createEncryptionConfig,
  createLoggingOptions,
  createProcessingConfig,
} from './private/helpers';
import * as iam from '../../aws-iam';
import type * as s3 from '../../aws-s3';
import type { ISecret } from '../../aws-secretsmanager';
import * as cdk from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * The Amazon Redshift `COPY` command that Amazon Data Firehose uses to load data
 * into the cluster from the intermediate S3 bucket.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html
 */
export interface RedshiftCopyCommand {
  /**
   * The name of the target table.
   *
   * The table must already exist in the database.
   */
  readonly tableName: string;

  /**
   * A list of column names to load data into.
   *
   * @default - all columns of the target table are used, in table order.
   */
  readonly columns?: string[];

  /**
   * Optional parameters to use with the Amazon Redshift `COPY` command.
   *
   * For examples, see the `CopyOptions` content for the
   * [CopyCommand](https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html)
   * data type in the Amazon Data Firehose API Reference.
   *
   * @default - no copy options.
   */
  readonly copyOptions?: string;
}

/**
 * Amazon Redshift cluster credentials passed inline to Amazon Data Firehose.
 *
 * Prefer supplying credentials through AWS Secrets Manager (`RedshiftDestinationProps.secret`)
 * so that Firehose retrieves them at runtime instead of rendering the password into the
 * CloudFormation template.
 */
export interface RedshiftUser {
  /**
   * The Amazon Redshift user that has permission to access the Amazon Redshift cluster.
   *
   * This user must have `INSERT` privileges for copying data from the intermediate S3 bucket
   * to the cluster.
   */
  readonly username: string;

  /**
   * The password for the Amazon Redshift user.
   *
   * This value is rendered into the CloudFormation template. Prefer supplying credentials via
   * `RedshiftDestinationProps.secret` to avoid this.
   */
  readonly password: cdk.SecretValue;
}

/**
 * Props for defining an Amazon Redshift destination of an Amazon Data Firehose delivery stream.
 */
export interface RedshiftDestinationProps extends CommonDestinationProps, CommonDestinationS3Props {
  /**
   * The connection string that Amazon Data Firehose uses to connect to the Amazon Redshift cluster.
   *
   * @example 'jdbc:redshift://cluster.abc123.us-east-1.redshift.amazonaws.com:5439/dev'
   */
  readonly clusterJdbcUrl: string;

  /**
   * Configures the Amazon Redshift `COPY` command that Firehose uses to load data into the
   * cluster from the intermediate S3 bucket.
   */
  readonly copyCommand: RedshiftCopyCommand;

  /**
   * The credentials that Amazon Data Firehose retrieves from AWS Secrets Manager to authenticate
   * with the Amazon Redshift cluster.
   *
   * The secret must contain the `username` and `password` for the Redshift user. When set, Firehose
   * fetches the credentials at runtime rather than rendering them into the template, and this takes
   * precedence over `user`. Exactly one of `secret` or `user` must be provided.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/dev/using-the-console.html#using-the-console-secretsmanager
   * @default - credentials are taken from `user`.
   */
  readonly secret?: ISecret;

  /**
   * The Amazon Redshift cluster credentials passed inline.
   *
   * Exactly one of `secret` or `user` must be provided. Prefer `secret` so that the password is
   * not rendered into the CloudFormation template.
   *
   * @default - credentials are taken from `secret`.
   */
  readonly user?: RedshiftUser;

  /**
   * The length of time during which Firehose retries delivery to Amazon Redshift after a failure.
   *
   * Minimum: Duration.seconds(0)
   * Maximum: Duration.seconds(7200)
   *
   * @default Duration.seconds(3600)
   */
  readonly retryDuration?: cdk.Duration;
}

/**
 * An Amazon Redshift destination for data from an Amazon Data Firehose delivery stream.
 *
 * Firehose delivers data to Amazon Redshift by first staging the records in an intermediate S3
 * bucket and then issuing an Amazon Redshift `COPY` command to load the data into the cluster.
 */
export class RedshiftDestination implements IDestination {
  /**
   * @param intermediateBucket The S3 bucket where Firehose first delivers data before issuing the
   * `COPY` command to load it into the Amazon Redshift cluster.
   * @param props The configuration for the Amazon Redshift destination.
   */
  constructor(
    private readonly intermediateBucket: s3.IBucket,
    private readonly props: RedshiftDestinationProps,
  ) {
    if ((props.secret === undefined) === (props.user === undefined)) {
      throw new cdk.UnscopedValidationError(lit`RedshiftCredentialsRequired`, "Exactly one of 'secret' or 'user' must be provided for a Redshift destination.");
    }

    if (props.compression === Compression.SNAPPY || props.compression === Compression.ZIP) {
      throw new cdk.UnscopedValidationError(lit`RedshiftCompressionNotSupported`, 'The SNAPPY and ZIP compression formats are not supported for Redshift destinations because they are not supported by the Amazon Redshift COPY command.');
    }

    if (props.s3Backup?.mode === BackupMode.FAILED) {
      throw new cdk.UnscopedValidationError(lit`RedshiftBackupModeFailedNotSupported`, 'Redshift destinations do not support BackupMode.FAILED; only full backup (BackupMode.ALL) is supported.');
    }
  }

  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'Redshift Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const bucketGrant = this.intermediateBucket.grantReadWrite(role);

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'RedshiftDestination',
    }) ?? {};

    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};

    if (this.props.secret) {
      this.props.secret.grantRead(role);
    }

    if (this.props.retryDuration) {
      const durationInSeconds = this.props.retryDuration.toSeconds();
      if (!cdk.Token.isUnresolved(durationInSeconds) && (durationInSeconds < 0 || durationInSeconds > 7200)) {
        throw new cdk.ValidationError(lit`RedshiftRetryDurationInvalid`, `Retry duration must be between 0 and 7200 seconds, got ${durationInSeconds} seconds.`, scope);
      }
    }

    const s3Configuration: CfnDeliveryStream.S3DestinationConfigurationProperty = {
      bucketArn: this.intermediateBucket.bucketArn,
      roleArn: role.roleArn,
      bufferingHints: createBufferingHints(scope, this.props.bufferingInterval, this.props.bufferingSize),
      compressionFormat: this.props.compression?.value,
      encryptionConfiguration: createEncryptionConfig(role, this.props.encryptionKey),
      prefix: this.props.dataOutputPrefix,
      errorOutputPrefix: this.props.errorOutputPrefix,
    };

    return {
      redshiftDestinationConfiguration: {
        clusterJdbcurl: this.props.clusterJdbcUrl,
        copyCommand: {
          dataTableName: this.props.copyCommand.tableName,
          ...(this.props.copyCommand.columns && {
            dataTableColumns: this.props.copyCommand.columns.join(','),
          }),
          copyOptions: this.props.copyCommand.copyOptions,
        },
        ...(this.props.user && {
          username: this.props.user.username,
          password: this.props.user.password.unsafeUnwrap(),
        }),
        ...(this.props.secret && {
          secretsManagerConfiguration: {
            enabled: true,
            secretArn: this.props.secret.secretArn,
            roleArn: role.roleArn,
          },
        }),
        roleArn: role.roleArn,
        s3Configuration,
        ...(this.props.retryDuration && {
          retryOptions: {
            durationInSeconds: this.props.retryDuration.toSeconds(),
          },
        }),
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, this.props, { role }),
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
      },
      dependables: [bucketGrant, ...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }

  private getS3BackupMode(): string | undefined {
    return this.props.s3Backup?.bucket || this.props.s3Backup?.mode === BackupMode.ALL
      ? 'Enabled'
      : undefined;
  }
}
