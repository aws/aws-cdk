import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as redshift from '@aws-cdk/aws-redshift';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as dests from '../lib';

describe('redshift destination', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  let table: redshift.ITable;
  const databaseName = 'databaseName';

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
    cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      publiclyAccessible: true,
    });
    const databaseProps = {
      cluster,
      databaseName,
    };
    table = new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
    });
  });

  it('produces config when minimally specified', () => {
    const destination = new dests.RedshiftTable(table);

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destinations: [destination],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      RedshiftDestinationConfiguration: {
        ClusterJDBCURL: {
          'Fn::Join': [
            '',
            [
              'jdbc:redshift://',
              {
                'Fn::GetAtt': [
                  'ClusterEB0386A7',
                  'Endpoint.Address',
                ],
              },
              ':',
              {
                'Fn::GetAtt': [
                  'ClusterEB0386A7',
                  'Endpoint.Port',
                ],
              },
              '/databaseName',
            ],
          ],
        },
        CopyCommand: {
          DataTableName: { 'Fn::GetAtt': ['Table7ABB320E', 'tableName'] },
          DataTableColumns: 'col1,col2',
        },
        Username: {
          'Fn::GetAtt': [
            'DeliveryStreamRedshiftUser8004061B',
            'username',
          ],
        },
        Password: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              { Ref: 'DeliveryStreamRedshiftUserSecretAttachment4F3C6465' },
              ':SecretString:password::}}',
            ],
          ],
        },
        RoleARN: { 'Fn::GetAtt': ['DeliveryStreamRedshiftDestinationRole4E4B5469', 'Arn'] },
        S3Configuration: {
          BucketARN: { 'Fn::GetAtt': ['DeliveryStreamIntermediateBucket96CB3206', 'Arn'] },
          RoleARN: { 'Fn::GetAtt': ['DeliveryStreamRedshiftDestinationRole4E4B5469', 'Arn'] },
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      IamRoles: [{ 'Fn::GetAtt': ['DeliveryStreamIntermediateBucketRedshiftAccessRole5B43F237', 'Arn'] }],
    });
  });

  it('produces config when fully specified', () => {
    const processorFunctionArn = 'arn:aws:lambda:xx-west-1:111122223333:function:my-function';
    const processorFunction = lambda.Function.fromFunctionAttributes(stack, 'Processor', {
      functionArn: processorFunctionArn,
      sameEnvironment: true,
    });
    const destinationRoleArn = 'arn:aws:iam::111122223333:role/manual-destination-role';
    const destinationRole = iam.Role.fromRoleArn(stack, 'Redshift Destination Role', destinationRoleArn);
    const destination = new dests.RedshiftTable(table, {
      copyOptions: 'json \'auto\'',
      role: destinationRole,
      retryTimeout: cdk.Duration.minutes(2),
      bufferingInterval: cdk.Duration.minutes(1),
      bufferingSize: cdk.Size.mebibytes(1),
      compression: dests.Compression.GZIP,
      logging: true,
      processor: new firehose.LambdaFunctionProcessor(processorFunction),
      s3Backup: {
        mode: dests.BackupMode.ALL,
      },
    });

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destinations: [destination],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      RedshiftDestinationConfiguration: {
        ClusterJDBCURL: {
          'Fn::Join': [
            '',
            [
              'jdbc:redshift://',
              {
                'Fn::GetAtt': [
                  'ClusterEB0386A7',
                  'Endpoint.Address',
                ],
              },
              ':',
              {
                'Fn::GetAtt': [
                  'ClusterEB0386A7',
                  'Endpoint.Port',
                ],
              },
              '/databaseName',
            ],
          ],
        },
        CopyCommand: {
          CopyOptions: 'json \'auto\' gzip',
          DataTableName: { 'Fn::GetAtt': ['Table7ABB320E', 'tableName'] },
          DataTableColumns: 'col1,col2',
        },
        Username: {
          'Fn::GetAtt': [
            'DeliveryStreamRedshiftUser8004061B',
            'username',
          ],
        },
        Password: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              { Ref: 'DeliveryStreamRedshiftUserSecretAttachment4F3C6465' },
              ':SecretString:password::}}',
            ],
          ],
        },
        RoleARN: destinationRoleArn,
        S3Configuration: {
          BucketARN: { 'Fn::GetAtt': ['DeliveryStreamIntermediateBucket96CB3206', 'Arn'] },
          RoleARN: destinationRoleArn,
          CompressionFormat: 'GZIP',
          BufferingHints: {
            IntervalInSeconds: 60,
            SizeInMBs: 1,
          },
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: { Ref: 'DeliveryStreamLogGroup9D8FA3BB' },
            LogStreamName: { Ref: 'DeliveryStreamLogGroupIntermediateS36D6EECFE' },
          },
        },
        S3BackupMode: 'Enabled',
        S3BackupConfiguration: {
          BucketARN: { 'Fn::GetAtt': ['DeliveryStreamBackupBucket0C646C83', 'Arn'] },
          RoleARN: destinationRoleArn,
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: { Ref: 'DeliveryStreamLogGroup9D8FA3BB' },
            LogStreamName: { Ref: 'DeliveryStreamLogGroupS3BackupD5DF41B2' },
          },
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: { Ref: 'DeliveryStreamLogGroup9D8FA3BB' },
          LogStreamName: { Ref: 'DeliveryStreamLogGroupRedshift84E27601' },
        },
        ProcessingConfiguration: {
          Enabled: true,
          Processors: [{
            Parameters: [
              { ParameterName: 'RoleArn', ParameterValue: destinationRoleArn },
              { ParameterName: 'LambdaArn', ParameterValue: processorFunctionArn },
            ],
            Type: 'Lambda',
          }],
        },
        RetryOptions: {
          DurationInSeconds: 120,
        },
      },
    });
  });

  describe('public cluster', () => {
    it('throws error if cluster not publicly accessible', () => {
      cluster = new redshift.Cluster(stack, 'Cluster Not Publicly Accessible', {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        masterUser: {
          masterUsername: 'admin',
        },
        publiclyAccessible: false,
      });
      table = new redshift.Table(stack, 'Table Not Publicly Accessible', {
        cluster,
        databaseName,
        tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
      });

      expect(() => new dests.RedshiftTable(table)).toThrowError('Redshift cluster used as delivery stream destination is not publicly accessible');
    });

    it('throws error if cluster not in public subnet', () => {
      cluster = new redshift.Cluster(stack, 'Cluster Not Publicly Accessible', {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE,
        },
        masterUser: {
          masterUsername: 'admin',
        },
        publiclyAccessible: true,
      });
      table = new redshift.Table(stack, 'Table Not Publicly Accessible', {
        cluster,
        databaseName,
        tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
      });

      expect(() => new dests.RedshiftTable(table)).toThrowError('Redshift cluster used as delivery stream destination is not located in a public subnet');
    });
  });

  it('uses provided intermediate bucket and access role', () => {
    const intermediateBucket = s3.Bucket.fromBucketName(stack, 'Manual Intermediate Bucket', 'manual-intermediate-bucket');
    const intermediateBucketAccessRole = iam.Role.fromRoleArn(stack, 'Manual Intermediate Bucket Access Role', 'arn:aws:iam::111122223333:role/manual-intermediate-access-role');
    const destination = new dests.RedshiftTable(table, {
      intermediateBucket: intermediateBucket,
      bucketAccessRole: intermediateBucketAccessRole,
    });

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destinations: [destination],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      RedshiftDestinationConfiguration: {
        S3Configuration: {
          BucketARN: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':s3:::manual-intermediate-bucket',
              ],
            ],
          },
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      IamRoles: Match.absentProperty(),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::manual-intermediate-bucket',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::manual-intermediate-bucket/*',
                  ],
                ],
              },
            ],
          },
        ],
      },
      Roles: ['manual-intermediate-access-role'],
    });
  });

  it('validates retryTimeout', () => {
    expect(() => new dests.RedshiftTable(table, {
      retryTimeout: cdk.Duration.hours(3),
    })).toThrowError(/Retry timeout must be less than 7,200 seconds/);
  });

  it('validates compression', () => {
    expect(() => new dests.RedshiftTable(table, {
      compression: dests.Compression.SNAPPY,
    })).toThrowError(/Redshift delivery stream destination does not support .* compression/);
    expect(() => new dests.RedshiftTable(table, {
      compression: dests.Compression.HADOOP_SNAPPY,
    })).toThrowError(/Redshift delivery stream destination does not support .* compression/);
    expect(() => new dests.RedshiftTable(table, {
      compression: dests.Compression.ZIP,
    })).toThrowError(/Redshift delivery stream destination does not support .* compression/);
  });

  describe('logging', () => {
    it('creates resources and configuration by default', () => {
      const destination = new dests.RedshiftTable(table);

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 2);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: { Ref: 'DeliveryStreamLogGroupA92E8EA0' },
            LogStreamName: { Ref: 'DeliveryStreamLogGroupRedshift67DE3657' },
          },
        },
      });
    });

    it('does not create resources or configuration if disabled', () => {
      const destination = new dests.RedshiftTable(table, {
        logging: false,
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          CloudWatchLoggingOptions: Match.absentProperty(),
        },
      });
    });

    it('uses provided log group', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');
      const destination = new dests.RedshiftTable(table, {
        logGroup,
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: stack.resolve(logGroup.logGroupName),
            LogStreamName: { Ref: 'LogGroupRedshift4ADB569B' },
          },
        },
      });
    });

    it('throws error if logging disabled but log group provided', () => {
      const destination = new dests.RedshiftTable(table, {
        logging: false,
        logGroup: new logs.LogGroup(stack, 'Log Group'),
      });

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      })).toThrowError('logging cannot be set to false when logGroup is provided');
    });

    it('grants log group write permissions to destination role', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');
      const destinationRole = new iam.Role(stack, 'Redshift Destination Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      const destination = new dests.RedshiftTable(table, {
        logGroup,
        role: destinationRole,
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: stack.resolve(logGroup.logGroupArn),
          }]),
        },
      });
    });
  });

  describe('processing configuration', () => {
    let destinationRole: iam.Role;
    let lambdaFunction: lambda.Function;
    let basicLambdaProcessor: firehose.LambdaFunctionProcessor;
    let destinationWithBasicLambdaProcessor: dests.RedshiftTable;

    beforeEach(() => {
      destinationRole = new iam.Role(stack, 'Redshift Destination Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      lambdaFunction = new lambda.Function(stack, 'DataProcessorFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'bar',
      });
      basicLambdaProcessor = new firehose.LambdaFunctionProcessor(lambdaFunction);
      destinationWithBasicLambdaProcessor = new dests.RedshiftTable(table, {
        role: destinationRole,
        processor: basicLambdaProcessor,
      });
    });

    it('creates configuration for LambdaFunctionProcessor', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destinationWithBasicLambdaProcessor],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          ProcessingConfiguration: {
            Enabled: true,
            Processors: [{
              Type: 'Lambda',
              Parameters: [
                {
                  ParameterName: 'RoleArn',
                  ParameterValue: stack.resolve(destinationRole.roleArn),
                },
                {
                  ParameterName: 'LambdaArn',
                  ParameterValue: stack.resolve(lambdaFunction.functionArn),
                },
              ],
            }],
          },
        },
      });
    });

    it('set all optional parameters', () => {
      const processor = new firehose.LambdaFunctionProcessor(lambdaFunction, {
        bufferInterval: cdk.Duration.minutes(1),
        bufferSize: cdk.Size.mebibytes(1),
        retries: 5,
      });
      const destination = new dests.RedshiftTable(table, {
        role: destinationRole,
        processor: processor,
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          ProcessingConfiguration: {
            Enabled: true,
            Processors: [{
              Type: 'Lambda',
              Parameters: [
                {
                  ParameterName: 'RoleArn',
                  ParameterValue: stack.resolve(destinationRole.roleArn),
                },
                {
                  ParameterName: 'LambdaArn',
                  ParameterValue: stack.resolve(lambdaFunction.functionArn),
                },
                {
                  ParameterName: 'BufferIntervalInSeconds',
                  ParameterValue: '60',
                },
                {
                  ParameterName: 'BufferSizeInMBs',
                  ParameterValue: '1',
                },
                {
                  ParameterName: 'NumberOfRetries',
                  ParameterValue: '5',
                },
              ],
            }],
          },
        },
      });
    });

    it('grants invoke access to the lambda function and delivery stream depends on grant', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destinationWithBasicLambdaProcessor],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'RedshiftDestinationRoleDefaultPolicyB29BE586',
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: stack.resolve(lambdaFunction.functionArn),
          }]),
        },
      });
      Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
        DependsOn: ['RedshiftDestinationRoleDefaultPolicyB29BE586'],
      });
    });
  });

  describe('s3 backup configuration', () => {
    let destinationRole: iam.Role;

    beforeEach(() => {
      destinationRole = new iam.Role(stack, 'Redshift Destination Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
    });

    it('set backupMode to ALL creates resources', () => {
      const destination = new dests.RedshiftTable(table, {
        role: destinationRole,
        s3Backup: {
          mode: dests.BackupMode.ALL,
          logging: false,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: Match.objectLike({
          S3BackupConfiguration: {
            BucketARN: { 'Fn::GetAtt': ['DeliveryStreamBackupBucket48C8465F', 'Arn'] },
            RoleARN: stack.resolve(destinationRole.roleArn),
          },
          S3BackupMode: 'Enabled',
        }),
      });
    });

    it('sets backup configuration if backup bucket provided', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const destination = new dests.RedshiftTable(table, {
        role: destinationRole,
        s3Backup: {
          bucket: backupBucket,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: Match.objectLike({
          S3BackupConfiguration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: { Ref: 'DeliveryStreamLogGroupA92E8EA0' },
              LogStreamName: { Ref: 'DeliveryStreamLogGroupS3BackupD848C05F' },
            },
            RoleARN: stack.resolve(destinationRole.roleArn),
          },
          S3BackupMode: 'Enabled',
        }),
      });
    });

    it('throws error if backup mode set to FAILED', () => {
      expect(() => new dests.RedshiftTable(table, {
        s3Backup: {
          mode: dests.BackupMode.FAILED,
        },
      })).toThrowError(/Redshift delivery stream destination does not support .* backup mode/);
    });

    it('sets full backup configuration', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const key = new kms.Key(stack, 'Key');
      const logGroup = new logs.LogGroup(stack, 'BackupLogGroup');
      const destination = new dests.RedshiftTable(table, {
        role: destinationRole,
        s3Backup: {
          mode: dests.BackupMode.ALL,
          bucket: backupBucket,
          dataOutputPrefix: 'myBackupPrefix',
          errorOutputPrefix: 'myBackupErrorPrefix',
          bufferingSize: cdk.Size.mebibytes(1),
          bufferingInterval: cdk.Duration.minutes(1),
          compression: dests.Compression.ZIP,
          encryptionKey: key,
          logging: true,
          logGroup: logGroup,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: Match.objectLike({
          S3BackupConfiguration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: stack.resolve(logGroup.logGroupName),
              LogStreamName: { Ref: 'BackupLogGroupS3BackupA7B3FB1E' },
            },
            RoleARN: stack.resolve(destinationRole.roleArn),
            EncryptionConfiguration: {
              KMSEncryptionConfig: {
                AWSKMSKeyARN: stack.resolve(key.keyArn),
              },
            },
            Prefix: 'myBackupPrefix',
            ErrorOutputPrefix: 'myBackupErrorPrefix',
            BufferingHints: {},
            CompressionFormat: 'ZIP',
          },
          S3BackupMode: 'Enabled',
        }),
      });
    });
  });

  describe('buffering', () => {
    it('does not create configuration by default', () => {
      const destination = new dests.RedshiftTable(table);

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          CloudWatchLoggingOptions: {
            BufferingHints: Match.absentProperty(),
          },
        },
      });
    });

    it('creates configuration when interval and size provided', () => {
      const destination = new dests.RedshiftTable(table, {
        bufferingInterval: cdk.Duration.minutes(1),
        bufferingSize: cdk.Size.mebibytes(1),
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          S3Configuration: {
            BufferingHints: {
              IntervalInSeconds: 60,
              SizeInMBs: 1,
            },
          },
        },
      });
    });

    it('validates bufferingInterval', () => {
      const smallDestination = new dests.RedshiftTable(table, {
        bufferingInterval: cdk.Duration.seconds(30),
        bufferingSize: cdk.Size.mebibytes(1),
      });
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [smallDestination],
      })).toThrowError(/Buffering interval must be between 60 and 900 seconds. Buffering interval provided was .* seconds./);

      const largeDestination = new dests.RedshiftTable(table, {
        bufferingInterval: cdk.Duration.seconds(30),
        bufferingSize: cdk.Size.mebibytes(1),
      });
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [largeDestination],
      })).toThrowError(/Buffering interval must be between 60 and 900 seconds. Buffering interval provided was .* seconds./);
    });

    it('validates bufferingSize', () => {
      const smallDestination = new dests.RedshiftTable(table, {
        bufferingInterval: cdk.Duration.minutes(1),
        bufferingSize: cdk.Size.mebibytes(0),
      });
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [smallDestination],
      })).toThrowError(/Buffering size must be between 1 and 128 MiBs. Buffering size provided was .* MiBs./);

      const largeDestination = new dests.RedshiftTable(table, {
        bufferingInterval: cdk.Duration.minutes(1),
        bufferingSize: cdk.Size.mebibytes(256),
      });
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destinations: [largeDestination],
      })).toThrowError(/Buffering size must be between 1 and 128 MiBs. Buffering size provided was .* MiBs./);
    });
  });

  describe('destination encryption', () => {
    it('creates configuration', () => {
      const key = new kms.Key(stack, 'Key');
      const destination = new dests.RedshiftTable(table, {
        encryptionKey: key,
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          S3Configuration: {
            EncryptionConfiguration: {
              KMSEncryptionConfig: {
                AWSKMSKeyARN: stack.resolve(key.keyArn),
              },
            },
          },
        },
      });
    });


    it('grants encrypt/decrypt access to the destination encryptionKey', () => {
      const key = new kms.Key(stack, 'Key');
      const destinationRole = new iam.Role(stack, 'Redshift Destination Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      const destination = new dests.RedshiftTable(table, {
        encryptionKey: key,
        role: destinationRole,
      });

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: [
              'kms:Decrypt',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: stack.resolve(key.keyArn),
          }]),
        },
      });
    });
  });

  describe('redshift user', () => {
    it('grants insert privileges on table', () => {
      const destination = new dests.RedshiftTable(table);

      new firehose.DeliveryStream(stack, 'Delivery Stream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        handler: 'user-table-privileges',
        username: {
          'Fn::GetAtt': [
            'DeliveryStreamRedshiftUser8004061B',
            'username',
          ],
        },
        tablePrivileges: [{
          tableName: {
            'Fn::GetAtt': [
              'Table7ABB320E',
              'tableName',
            ],
          },
          actions: ['INSERT'],
        }],
      });
    });

    it('uses user if provided', () => {
      const user = new redshift.User(stack, 'User', {
        cluster,
        databaseName,
      });
      const destination = new dests.RedshiftTable(table, {
        user,
      });

      new firehose.DeliveryStream(stack, 'Delivery Stream', {
        destinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        RedshiftDestinationConfiguration: {
          Username: stack.resolve(user.username),
        },
      });
    });

    it('throws if provided user and table from different cluster or database', () => {
      expect(() => new dests.RedshiftTable(table, {
        user: new redshift.User(stack, 'User Different Cluster', {
          cluster: new redshift.Cluster(stack, 'Different Cluster', {
            vpc,
            masterUser: {
              masterUsername: 'admin',
            },
          }),
          databaseName,
        }),
      })).toThrowError('Provided Redshift user must be located in the same Redshift cluster and database as the table');
      expect(() => new dests.RedshiftTable(table, {
        user: new redshift.User(stack, 'User Different Database', {
          cluster,
          databaseName: 'differentDatabase',
        }),
      })).toThrowError('Provided Redshift user must be located in the same Redshift cluster and database as the table');
    });
  });
});
