import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { CustomResource, Duration, SecretValue, Size, Token } from '@aws-cdk/core';
import * as customresources from '@aws-cdk/custom-resources';
import { IDeliveryStream } from '../delivery-stream';
import { BackupMode, Compression, DestinationBase, DestinationConfig, DestinationProps } from '../destination';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The Redshift user Firehose will assume to deliver data to Redshift
 */
export interface RedshiftUser {
  /**
   * Username for user that has permission to insert records into a Redshift table.
   */
  readonly username: string;

  /**
   * Password for user that has permission to insert records into a Redshift table.
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default - a Secrets Manager generated password.
   */
  readonly password?: SecretValue;

  /**
   * KMS key to encrypt the generated secret.
   *
   * @default - default master key.
   */
  readonly encryptionKey?: kms.IKey;
}

export interface RedshiftColumn {
  /**
   * The name of the column.
   */
  readonly name: string;

  /**
   * The data type of the column.
   * TODO: strongly typed
   */
  readonly dataType: string;
}

/**
 * Properties for configuring a Redshift delivery stream destination.
 */
export interface RedshiftDestinationProps extends DestinationProps {
  /**
   * The Redshift cluster to deliver data to.
   * TODO: publiclyAccessible must be set to true
   */
  readonly cluster: redshift.Cluster;

  /**
   * The cluster user that has INSERT permissions to the desired output table.
   */
  readonly user: RedshiftUser;

  /**
   * The database containing the desired output table.
   */
  readonly database: string;

  /**
   * The table that data should be inserted into.
   */
  readonly tableName: string;

  /**
   * The table columns that the source fields will be loaded into.
   */
  readonly tableColumns: RedshiftColumn[];

  /**
   * Parameters given to the COPY command that is used to move data from S3 to Redshift.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html // TODO: proper annotation
   *
   * @default '' - no extra parameters are provided to the Redshift COPY command
   */
  readonly copyOptions?: string;

  /**
   * The length of time during which Firehose retries delivery after a failure.
   *
   * TODO: valid values [0, 7200] seconds
   *
   * @default Duration.hours(1)
   */
  readonly retryTimeout?: Duration;

  /**
   * The intermediate bucket where Firehose will stage your data before COPYing it to the Redshift cluster.
   *
   * @default - a bucket will be created for you.
   */
  readonly intermediateBucket?: s3.IBucket;

  /**
   * The role that is attached to the Redshift cluster and will have permissions to access the intermediate bucket.
   *
   * If a role is provided, it must be already attached to the cluster, to avoid the 10 role per cluster limit.
   *
   * @default - a role will be created for you.
   */
  readonly bucketAccessRole?: iam.IRole;

  /**
   * The size of the buffer that Firehose uses for incoming data before delivering it to the intermediate bucket.
   *
   * TODO: valid values [60, 900] seconds
   *
   * @default Duration.seconds(60)
   */
  readonly bufferingInterval?: Duration;

  /**
   * The length of time that Firehose buffers incoming data before delivering it to the intermediate bucket.
   *
   * TODO: valid values [1, 128] MBs
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferingSize?: Size;

  /**
   * The compression that Firehose uses when delivering data to the intermediate bucket.
   *
   * TODO: Redshift COPY does not support SNAPPY or ZIP
   *
   * @default Compression.UNCOMPRESSED
   */
  readonly compression?: Compression;
}

/**
 * Redshift delivery stream destination.
 */
export class RedshiftDestination extends DestinationBase {
  protected readonly redshiftProps: RedshiftDestinationProps;

  /**
   * The secret Firehose will use to access the Redshift cluster.
   */
  public secret?: secretsmanager.ISecret;

  constructor(redshiftProps: RedshiftDestinationProps) {
    super(redshiftProps);

    this.redshiftProps = redshiftProps;

    if (this.redshiftProps.backup === BackupMode.FAILED_ONLY) {
      throw new Error(`Redshift delivery stream destination only supports ENABLED and DISABLED BackupMode, given ${this.redshiftProps.backup}`);
    }
  }

  public bind(scope: Construct, deliveryStream: IDeliveryStream): DestinationConfig {
    return {
      properties: {
        redshiftDestinationConfiguration: this.createRedshiftConfig(scope, deliveryStream),
      },
    };
  }

  private createRedshiftConfig(scope: Construct, deliveryStream: IDeliveryStream): CfnDeliveryStream.RedshiftDestinationConfigurationProperty {
    const cluster = this.redshiftProps.cluster;
    // TODO: assert cluster subnet is public
    const endpoint = cluster.clusterEndpoint;
    const jdbcUrl = `jdbc:redshift://${endpoint.hostname}:${Token.asString(endpoint.port)}/${this.redshiftProps.database}`;
    cluster.connections.allowDefaultPortFrom(deliveryStream, 'Allow incoming connections from Kinesis Data Firehose');

    const createTable = new Construct(scope, 'Redshift Table');
    const createTableHandler = new lambda.Function(createTable, 'Function', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'redshift-create-table-provider')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      environment: {
        clusterName: cluster.clusterName,
        masterSecretArn: cluster.secret?.secretArn ?? '',
        database: this.redshiftProps.database,
        tableName: this.redshiftProps.tableName,
        tableColumns: JSON.stringify(this.redshiftProps.tableColumns),
      },
    });
    createTableHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
      resources: ['*'],
    }));
    cluster.secret?.grantRead(createTableHandler);

    const createTableProvider = new customresources.Provider(createTable, 'Provider', {
      onEventHandler: createTableHandler,
    });
    new CustomResource(createTable, 'Resource', {
      serviceToken: createTableProvider.serviceToken,
    });

    const user = (() => {
      if (this.redshiftProps.user.password) {
        return {
          username: this.redshiftProps.user.username,
          password: this.redshiftProps.user.password,
        };
      } else {
        const secret = new redshift.DatabaseSecret(scope, 'Firehose User Secret', {
          username: this.redshiftProps.user.username,
          encryptionKey: this.redshiftProps.user.encryptionKey,
        });
        this.secret = secret.attach(cluster);

        const createUser = new Construct(scope, 'Firehose Redshift User');
        const createUserHandler = new lambda.Function(createUser, 'Function', {
          code: lambda.Code.fromAsset(path.join(__dirname, 'redshift-create-user-provider')),
          runtime: lambda.Runtime.NODEJS_14_X,
          handler: 'index.handler',
          environment: {
            clusterName: cluster.clusterName,
            masterSecretArn: cluster.secret?.secretArn ?? '',
            database: this.redshiftProps.database,
            userSecretArn: this.secret.secretArn,
            table: this.redshiftProps.tableName,
          },
        });
        createUserHandler.addToRolePolicy(new iam.PolicyStatement({
          actions: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
          resources: ['*'],
        }));
        cluster.secret?.grantRead(createUserHandler);
        this.secret.grantRead(createUserHandler);

        const createUserProvider = new customresources.Provider(createUser, 'Provider', {
          onEventHandler: createUserHandler,
        });
        new CustomResource(createUser, 'Resource', {
          serviceToken: createUserProvider.serviceToken,
        });

        return {
          username: this.redshiftProps.user.username,
          password: this.secret.secretValueFromJson('password'),
        };
      };
    })();

    const intermediateBucket = this.redshiftProps.intermediateBucket ?? new s3.Bucket(scope, 'Intermediate Bucket');
    intermediateBucket.grantReadWrite(deliveryStream);
    const compression = this.redshiftProps.compression;
    const intermediateS3Config: CfnDeliveryStream.S3DestinationConfigurationProperty = {
      bucketArn: intermediateBucket.bucketArn,
      roleArn: (deliveryStream.grantPrincipal as iam.Role).roleArn,
      bufferingHints: {
        intervalInSeconds: this.redshiftProps.bufferingInterval?.toSeconds(),
        sizeInMBs: this.redshiftProps.bufferingSize?.toMebibytes(),
      },
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream, 'IntermediateS3'),
      compressionFormat: compression ?? Compression.UNCOMPRESSED,
    };
    // TODO: encryptionConfiguration? why need to provide if bucket has encryption
    const bucketAccessRole = this.redshiftProps.bucketAccessRole ?? new iam.Role(scope, 'Intermediate Bucket Access Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    if (!this.redshiftProps.bucketAccessRole) {
      cluster.attachRole(bucketAccessRole);
    }
    intermediateBucket.grantRead(bucketAccessRole);

    return {
      clusterJdbcurl: jdbcUrl,
      copyCommand: {
        dataTableName: this.redshiftProps.tableName,
        dataTableColumns: this.redshiftProps.tableColumns?.map(column => column.name)?.join(),
        copyOptions: this.redshiftProps.copyOptions,
      },
      password: user.password.toString(),
      username: user.username.toString(),
      s3Configuration: intermediateS3Config,
      roleArn: (deliveryStream.grantPrincipal as iam.Role).roleArn,
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream, 'Redshift'),
      processingConfiguration: this.createProcessingConfig(deliveryStream),
      retryOptions: {
        durationInSeconds: this.redshiftProps.retryTimeout?.toSeconds(),
      },
      s3BackupConfiguration: this.createBackupConfig(scope, deliveryStream),
      s3BackupMode: (this.redshiftProps.backup === BackupMode.ENABLED) ? 'Enabled' : 'Disabled',
    };
  }
}
