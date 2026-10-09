import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as secretsmanager from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as firehose from '../lib';

describe('Redshift destination', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let secret: secretsmanager.ISecret;

  const CLUSTER_JDBC_URL = 'jdbc:redshift://cluster.abc123.us-east-1.redshift.amazonaws.com:5439/dev';

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = new s3.Bucket(stack, 'Bucket');
    secret = new secretsmanager.Secret(stack, 'Secret');
  });

  const minimalProps = (): firehose.RedshiftDestinationProps => ({
    clusterJdbcUrl: CLUSTER_JDBC_URL,
    copyCommand: { tableName: 'firehose_test_table' },
    secret,
  });

  describe('rendered configuration', () => {
    it('renders the RedshiftDestinationConfiguration with defaults', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, minimalProps()),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          ClusterJDBCURL: CLUSTER_JDBC_URL,
          CopyCommand: { DataTableName: 'firehose_test_table' },
          S3Configuration: {
            BucketARN: stack.resolve(bucket.bucketArn),
          },
          CloudWatchLoggingOptions: { Enabled: true },
        },
      });
    });

    it('creates a log group and stream by default', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, minimalProps()),
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 1);
    });

    it('renders copy command options and columns', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          ...minimalProps(),
          copyCommand: {
            tableName: 'firehose_test_table',
            columns: ['col1', 'col2'],
            copyOptions: "json 'auto'",
          },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          CopyCommand: {
            DataTableName: 'firehose_test_table',
            DataTableColumns: 'col1,col2',
            CopyOptions: "json 'auto'",
          },
        },
      });
    });

    it('renders retry options', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          ...minimalProps(),
          retryDuration: cdk.Duration.seconds(1800),
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          RetryOptions: { DurationInSeconds: 1800 },
        },
      });
    });
  });

  describe('credentials', () => {
    it('wires a Secrets Manager secret and grants read', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, minimalProps()),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          SecretsManagerConfiguration: {
            Enabled: true,
            SecretARN: stack.resolve(secret.secretArn),
          },
        },
      });

      // the delivery stream role is granted read on the secret
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret']),
              Effect: 'Allow',
              Resource: stack.resolve(secret.secretArn),
            }),
          ]),
        },
      });
    });

    it('renders inline username and password', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          clusterJdbcUrl: CLUSTER_JDBC_URL,
          copyCommand: { tableName: 'firehose_test_table' },
          user: {
            username: 'firehose',
            password: cdk.SecretValue.unsafePlainText('a-password'),
          },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          Username: 'firehose',
          Password: 'a-password',
        },
      });
    });

    it('throws when neither secret nor user is provided', () => {
      expect(() => new firehose.RedshiftDestination(bucket, {
        clusterJdbcUrl: CLUSTER_JDBC_URL,
        copyCommand: { tableName: 'firehose_test_table' },
      })).toThrow(/Exactly one of 'secret' or 'user' must be provided/);
    });

    it('throws when both secret and user are provided', () => {
      expect(() => new firehose.RedshiftDestination(bucket, {
        clusterJdbcUrl: CLUSTER_JDBC_URL,
        copyCommand: { tableName: 'firehose_test_table' },
        secret,
        user: { username: 'firehose', password: cdk.SecretValue.unsafePlainText('a-password') },
      })).toThrow(/Exactly one of 'secret' or 'user' must be provided/);
    });
  });

  describe('IAM role', () => {
    it('creates a role assumable by firehose and grants read/write on the intermediate bucket', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, minimalProps()),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'sts:AssumeRole',
              Principal: { Service: 'firehose.amazonaws.com' },
            }),
          ]),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:PutObject']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    it('uses a provided role', () => {
      const role = new iam.Role(stack, 'Provided Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, { ...minimalProps(), role }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          RoleARN: stack.resolve(role.roleArn),
        },
      });
    });
  });

  describe('S3 intermediate / backup', () => {
    it('applies encryption key and buffering to the intermediate S3 configuration', () => {
      const key = new kms.Key(stack, 'Key');
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          ...minimalProps(),
          encryptionKey: key,
          bufferingInterval: cdk.Duration.seconds(60),
          bufferingSize: cdk.Size.mebibytes(10),
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          S3Configuration: {
            BufferingHints: { IntervalInSeconds: 60, SizeInMBs: 10 },
            EncryptionConfiguration: {
              KMSEncryptionConfig: { AWSKMSKeyARN: stack.resolve(key.keyArn) },
            },
          },
        },
      });
    });

    it('enables full S3 backup when a backup bucket is provided', () => {
      const backupBucket = new s3.Bucket(stack, 'BackupBucket');
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          ...minimalProps(),
          s3Backup: { bucket: backupBucket },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          S3BackupMode: 'Enabled',
          S3BackupConfiguration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
          },
        },
      });
    });

    it('throws when compression is SNAPPY (unsupported by Redshift COPY)', () => {
      expect(() => new firehose.RedshiftDestination(bucket, {
        ...minimalProps(),
        compression: firehose.Compression.SNAPPY,
      })).toThrow(/SNAPPY and ZIP compression formats are not supported/);
    });

    it('throws when s3Backup mode is FAILED', () => {
      expect(() => new firehose.RedshiftDestination(bucket, {
        ...minimalProps(),
        s3Backup: { mode: firehose.BackupMode.FAILED },
      })).toThrow(/do not support BackupMode.FAILED/);
    });
  });

  describe('validation', () => {
    it('throws when retry duration exceeds 7200 seconds', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.RedshiftDestination(bucket, {
          ...minimalProps(),
          retryDuration: cdk.Duration.seconds(7201),
        }),
      })).toThrow(/Retry duration must be between 0 and 7200 seconds/);
    });
  });
});
