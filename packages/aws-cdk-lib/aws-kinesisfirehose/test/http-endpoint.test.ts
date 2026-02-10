import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as secrets from '../../aws-secretsmanager';
import * as firehose from '../lib';

describe('HTTP endpoint destination', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    destinationRole = new iam.Role(stack, 'Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });

  it('configures with default configurations', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.HttpEndpoint({
        url: 'https://example.com/',
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      HttpEndpointDestinationConfiguration: {
        CloudWatchLoggingOptions: {
          Enabled: true,
        },
        EndpointConfiguration: {
          Url: 'https://example.com/',
        },
        S3BackupMode: 'FailedDataOnly',
        S3Configuration: {
          BucketARN: { 'Fn::GetAtt': ['DeliveryStreamBackupBucket48C8465F', 'Arn'] },
          RoleARN: { 'Fn::GetAtt': ['DeliveryStreamHttpEndpointDestinationRole6013E317', 'Arn'] },
        },
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 2);
  });

  it('configures with fully provided configurations', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.HttpEndpoint({
        url: 'https://example.com/',
        name: 'MyEndpointName',
        accessKey: 'my-access-key',
        parameters: {
          'my-header-name1': 'my-header-value1',
          'my-header-name2': 'my-header-value2',
        },
        contentEncoding: firehose.ContentEncoding.GZIP,
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      HttpEndpointDestinationConfiguration: {
        CloudWatchLoggingOptions: {
          Enabled: true,
        },
        EndpointConfiguration: {
          Url: 'https://example.com/',
          Name: 'MyEndpointName',
          AccessKey: 'my-access-key',
        },
        RequestConfiguration: {
          CommonAttributes: [
            { AttributeName: 'my-header-name1', AttributeValue: 'my-header-value1' },
            { AttributeName: 'my-header-name2', AttributeValue: 'my-header-value2' },
          ],
          ContentEncoding: 'GZIP',
        },
        S3BackupMode: 'FailedDataOnly',
        S3Configuration: {
          BucketARN: { 'Fn::GetAtt': ['DeliveryStreamBackupBucket48C8465F', 'Arn'] },
          RoleARN: { 'Fn::GetAtt': ['DeliveryStreamHttpEndpointDestinationRole6013E317', 'Arn'] },
        },
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 2);
  });

  describe('logging', () => {
    it('creates resources and configuration by default', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({ url: 'https://example.com/' }),
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 2);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
          },
        },
      });
    });

    it('does not create resources or configuration if disabled', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          loggingConfig: new firehose.DisableLogging(),
        }),
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          CloudWatchLoggingOptions: Match.absent(),
        },
      });
    });

    it('uses provided log group', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com',
          loggingConfig: new firehose.EnableLogging(logGroup),
        }),
      });

      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 2);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          CloudWatchLoggingOptions: {
            Enabled: true,
            LogGroupName: stack.resolve(logGroup.logGroupName),
          },
        },
      });
    });

    it('grants log group write permissions to destination role', () => {
      const logGroup = new logs.LogGroup(stack, 'Log Group');

      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          loggingConfig: new firehose.EnableLogging(logGroup),
          role: destinationRole,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: stack.resolve(logGroup.logGroupArn),
            },
          ]),
        },
      });
    });

    it('log group grants are depended on by delivery stream', () => {
      const logGroup = logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'evergreen');
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        loggingConfig: new firehose.EnableLogging(logGroup),
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'DeliveryStreamHttpEndpointDestinationRoleDefaultPolicy44226229',
        Roles: [{ Ref: 'DeliveryStreamHttpEndpointDestinationRole6013E317' }],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
              Effect: 'Allow',
              Resource: stack.resolve(logGroup.logGroupArn),
            },
          ]),
        },
      });
      Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
        DependsOn: ['DeliveryStreamHttpEndpointDestinationRoleDefaultPolicy44226229'],
      });
    });
  });

  describe('processing configuration', () => {
    let lambdaFunction: lambda.IFunction;
    let basicLambdaProcessor: firehose.LambdaFunctionProcessor;
    let destinationWithBasicLambdaProcessor: firehose.HttpEndpoint;

    beforeEach(() => {
      lambdaFunction = new lambda.Function(stack, 'DataProcessorFunction', {
        runtime: lambda.Runtime.NODEJS_LATEST,
        code: lambda.Code.fromInline('foo'),
        handler: 'bar',
      });
      basicLambdaProcessor = new firehose.LambdaFunctionProcessor(lambdaFunction);
      destinationWithBasicLambdaProcessor = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        role: destinationRole,
        processors: [basicLambdaProcessor],
      });
    });

    it('creates configuration for LambdaFunctionProcessor', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destinationWithBasicLambdaProcessor,
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
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
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        role: destinationRole,
        processors: [processor],
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
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
        destination: destinationWithBasicLambdaProcessor,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'DestinationRoleDefaultPolicy1185C75D',
        Roles: [stack.resolve(destinationRole.roleName)],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: 'lambda:InvokeFunction',
              Effect: 'Allow',
              Resource: [
                stack.resolve(lambdaFunction.functionArn),
                { 'Fn::Join': ['', [stack.resolve(lambdaFunction.functionArn), ':*']] },
              ],
            },
          ]),
        },
      });
      Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
        DependsOn: ['DestinationRoleDefaultPolicy1185C75D'],
      });
    });
  });

  describe('buffering', () => {
    it('creates configuration when interval and size provided', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(1),
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          BufferingHints: {
            IntervalInSeconds: 60,
            SizeInMBs: 1,
          },
        },
      });
    });

    it('validates bufferingInterval', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          bufferingInterval: cdk.Duration.minutes(16),
          bufferingSize: cdk.Size.mebibytes(1),
        }),
      })).toThrow('Buffering interval must be less than 900 seconds. Buffering interval provided was 960 seconds.');
    });

    it('validates bufferingSize', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(0),
        }),
      })).toThrow('Buffering size must be between 1 and 128 MiBs. Buffering size provided was 0 MiBs');

      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream2', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          bufferingInterval: cdk.Duration.minutes(1),
          bufferingSize: cdk.Size.mebibytes(256),
        }),
      })).toThrow('Buffering size must be between 1 and 128 MiBs. Buffering size provided was 256 MiBs');
    });
  });

  describe('retry options', () => {
    it('creates configuration with retryDuration', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.minutes(60),
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          RetryOptions: {
            DurationInSeconds: 3600,
          },
        },
      });
    });

    it('validates retryDuration', () => {
      expect(() => new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.seconds(7201),
        }),
      })).toThrow('Retry duration must be less than or equal to 7200 seconds, got 7201.');
    });
  });

  describe('secrets manager configuration', () => {
    it('creates configuration with secret', () => {
      const secret = new secrets.Secret(stack, 'Secret');
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.minutes(60),
          secretsManager: { secret },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          SecretsManagerConfiguration: {
            Enabled: true,
            SecretARN: { Ref: 'SecretA720EF05' },
          },
        },
      });
    });

    it('grants read access to the destination role', () => {
      const secret = new secrets.Secret(stack, 'Secret');
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.minutes(60),
          secretsManager: { secret },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'DeliveryStreamHttpEndpointDestinationRoleDefaultPolicy44226229',
        Roles: [{ Ref: 'DeliveryStreamHttpEndpointDestinationRole6013E317' }],
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
              Resource: { Ref: 'SecretA720EF05' },
            },
          ]),
        },
      });
    });

    it('creates configuration with secret and role', () => {
      const secret = new secrets.Secret(stack, 'Secret');
      const secretRole = new iam.Role(stack, 'SecretRole', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.minutes(60),
          secretsManager: { secret, role: secretRole },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          SecretsManagerConfiguration: {
            Enabled: true,
            SecretARN: { Ref: 'SecretA720EF05' },
            RoleARN: { 'Fn::GetAtt': ['SecretRoleFBF7332D', 'Arn'] },
          },
        },
      });
    });

    it('creates configuration with secret manager disabled', () => {
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: new firehose.HttpEndpoint({
          url: 'https://example.com/',
          retryDuration: cdk.Duration.minutes(60),
          secretsManager: { enabled: false },
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          SecretsManagerConfiguration: {
            Enabled: false,
          },
        },
      });
    });

    it('throws when secret and access key are both specified', () => {
      const secret = new secrets.Secret(stack, 'Secret');
      expect(() => {
        new firehose.DeliveryStream(stack, 'DeliveryStream', {
          destination: new firehose.HttpEndpoint({
            url: 'https://example.com/',
            accessKey: 'my-access-key',
            retryDuration: cdk.Duration.minutes(60),
            secretsManager: { secret },
          }),
        });
      }).toThrow("You can specify either 'accessKey' or 'secretsManager.secrets', not both.");
    });
  });

  describe('s3 backup configuration', () => {
    it('set backupMode to ALL creates resources', () => {
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        s3Backup: {
          mode: firehose.BackupMode.ALL,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          S3BackupMode: 'AllData',
          S3Configuration: {
            CloudWatchLoggingOptions: {
              Enabled: true,
            },
            RoleARN: { 'Fn::GetAtt': ['DeliveryStreamHttpEndpointDestinationRole6013E317', 'Arn'] },
          },
        },
      });
    });

    it('set backupMode to FAILED creates resources', () => {
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        s3Backup: {
          mode: firehose.BackupMode.FAILED,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          S3BackupMode: 'FailedDataOnly',
          S3Configuration: {
            CloudWatchLoggingOptions: {
              Enabled: true,
            },
            RoleARN: { 'Fn::GetAtt': ['DeliveryStreamHttpEndpointDestinationRole6013E317', 'Arn'] },
          },
        },
      });
    });

    it('sets backup configuration if backup bucket provided', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        s3Backup: {
          bucket: backupBucket,
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          S3BackupMode: 'FailedDataOnly',
          S3Configuration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
            },
            RoleARN: { 'Fn::GetAtt': ['DeliveryStreamHttpEndpointDestinationRole6013E317', 'Arn'] },
          },
        },
      });
    });

    it('sets full backup configuration', () => {
      const backupBucket = new s3.Bucket(stack, 'MyBackupBucket');
      const key = new kms.Key(stack, 'Key');
      const logGroup = new logs.LogGroup(stack, 'BackupLogGroup');
      const destination = new firehose.HttpEndpoint({
        url: 'https://example.com/',
        role: destinationRole,
        s3Backup: {
          mode: firehose.BackupMode.ALL,
          bucket: backupBucket,
          dataOutputPrefix: 'myBackupPrefix',
          errorOutputPrefix: 'myBackupErrorPrefix',
          bufferingSize: cdk.Size.mebibytes(1),
          bufferingInterval: cdk.Duration.minutes(1),
          compression: firehose.Compression.ZIP,
          encryptionKey: key,
          loggingConfig: new firehose.EnableLogging(logGroup),
        },
      });
      new firehose.DeliveryStream(stack, 'DeliveryStream', {
        destination: destination,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
        HttpEndpointDestinationConfiguration: {
          S3BackupMode: 'AllData',
          S3Configuration: {
            BucketARN: stack.resolve(backupBucket.bucketArn),
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: stack.resolve(logGroup.logGroupName),
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
        },
      });
    });
  });
});
