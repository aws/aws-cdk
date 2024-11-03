import { DeliveryStream, DestinationBindOptions, DestinationConfig, IDestination } from '@aws-cdk/aws-kinesisfirehose-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { TestEnrichment, TestSource, TestSourceWithDeadLetterTarget, TestTarget } from './test-classes';
import { CloudwatchLogsLogDestination, DesiredState, FirehoseLogDestination, IEnrichment, ISource, ITarget, IncludeExecutionData, LogLevel, Pipe, S3LogDestination, S3OutputFormat } from '../lib';

describe('Pipe', () => {
  let stack: Stack;
  const source = new TestSource();
  const target = new TestTarget();

  beforeEach(() => {
    jest.resetAllMocks();
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('is present with props', () => {
    // WHEN
    new Pipe(stack, 'TestPipe', {
      pipeName: 'TestPipe',
      description: 'test description',
      desiredState: DesiredState.RUNNING,
      tags: {
        key: 'value',
      },
      source,
      target,
    });
    const template = Template.fromStack(stack);

    // THEN
    template.resourceCountIs('AWS::Pipes::Pipe', 1);
    expect(template).toMatchSnapshot();
  });

  test('fromPipeName', () => {
    // WHEN
    const pipe = Pipe.fromPipeName(stack, 'TestPipe', 'TestPipe');

    // THEN
    expect(pipe.pipeName).toEqual('TestPipe');
    expect(pipe.pipeArn).toEqual('arn:aws:pipes:us-east-1:123456789012:pipe/TestPipe');
    expect(pipe.pipeRole.roleArn).toEqual(expect.stringContaining('role/TestPipe'));
  });

  describe('source', () => {
    it('should grant read permissions to the source', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(source.grantRead).toHaveBeenCalled();
      expect(source.grantRead).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass parameters and arn', () => {
      // GIVEN
      const sourceWithParameters: ISource =new TestSource({
        sqsQueueParameters: {
          batchSize: 2,
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithParameters,
        target,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Source: 'source-arn',
          SourceParameters: {
            SqsQueueParameters: {
              BatchSize: 2,
            },
          },
        },
      },
      );

    });

    it('should add filter criteria to the source parameters', () => {
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        filter: {
          filters: [
            {
              pattern: 'filter-pattern',
            },
          ],
        },
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          SourceParameters: {
            FilterCriteria: {
              Filters: [
                {
                  Pattern: 'filter-pattern',
                },
              ],
            },
          },
        },
      },
      );

    });
    it('should merge filter criteria and source parameters', () => {
      // GIVEN
      const sourceWithParameters: ISource =new TestSource({
        sqsQueueParameters: {
          batchSize: 2,
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithParameters,
        target,
        filter: {
          filters: [
            {
              pattern: 'filter-pattern',
            },
          ],
        },
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          SourceParameters: {
            SqsQueueParameters: {
              BatchSize: 2,
            },
            FilterCriteria: {
              Filters: [
                {
                  Pattern: 'filter-pattern',
                },
              ],
            },
          },
        },
      },
      );

    });

    test('grantPush is called for sources with an SNS topic DLQ', () => {
      // WHEN
      const topic = new Topic(stack, 'MyTopic');
      const sourceWithDeadLetterTarget = new TestSourceWithDeadLetterTarget(topic);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithDeadLetterTarget,
        target,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: 'sns:Publish',
              Resource: {
                Ref: 'MyTopic86869434',
              },
            }],
          },
        },
      });
    });

    test('grantPush is called for sources with an SQS queue DLQ', () => {
      // WHEN
      const queue = new Queue(stack, 'MyQueue');
      const sourceWithDeadLetterTarget = new TestSourceWithDeadLetterTarget(queue);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithDeadLetterTarget,
        target,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                'sqs:SendMessage',
                'sqs:GetQueueAttributes',
                'sqs:GetQueueUrl',
              ],
              Resource: {
                'Fn::GetAtt': [
                  'MyQueueE6CA6235',
                  'Arn',
                ],
              },
            }],
          },
        },
      });
    });
  });

  describe('target', () => {

    it('should grant push permissions to the target', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(target.grantPush).toHaveBeenCalled();
      expect(target.grantPush).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass parameters and arn', () => {
      // GIVEN
      const targetWithParameters: ITarget = new TestTarget({
        sqsQueueParameters: {
          messageGroupId: 'message-group-id',
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target: targetWithParameters,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Target: 'target-arn',
          TargetParameters: {
            SqsQueueParameters: {
              MessageGroupId: 'message-group-id',
            },
          },
        },
      },
      );
    });
  });

  describe('enrichment', () => {
    const enrichment = new TestEnrichment();

    it('should grant invoke permissions to the enrichment', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment,
      });

      // THEN
      expect(enrichment.grantInvoke).toHaveBeenCalled();
      expect(enrichment.grantInvoke).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass enrichment parameters', () => {
      // GIVEN
      const enrichmentWithParameters =new TestEnrichment({
        inputTemplate: 'input-template',
        // inputTransformation: { bind: () => 'input-template' },
      } );

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment: enrichmentWithParameters,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Enrichment: 'enrichment-arn',
          EnrichmentParameters: {
            InputTemplate: 'input-template',
          },
        },
      },
      );
    });
  });

  describe('role', () => {
    it('should create a role', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBeInstanceOf(Role);
    });

    it('should use the provided role', () => {
      // GIVEN
      const enrichment: IEnrichment = new TestEnrichment();

      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });

      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        enrichment,
        target,
        role,
      });

      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
      expect(source.grantRead).toHaveBeenCalledWith(role);
      expect(target.grantPush).toHaveBeenCalledWith(role);
      expect(enrichment.grantInvoke).toHaveBeenCalledWith(role);

    });

    it('should call grant on the provided role', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        role,
      });
      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
    });

    it('should use the imported role', () => {
      // GIVEN
      const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/Role');
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        role,
      });
      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
      expect(source.grantRead).toHaveBeenCalledWith(role);
      expect(target.grantPush).toHaveBeenCalledWith(role);
    });
  });

  describe('logs', () => {
    it('should pass along cloudwatch logs log configuration', () => {
      // WHEN
      const logGroup = new LogGroup(stack, 'LogGroup');
      const cwlLogDestination = new CloudwatchLogsLogDestination(logGroup);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.INFO,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [cwlLogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            CloudwatchLogsLogDestination: {
              LogGroupArn: {
                'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'],
              },
            },
            Level: 'INFO',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to log group with pipe role', () => {
      // WHEN
      const logGroup = new LogGroup(stack, 'LogGroup');
      const cwlLogDestination = new CloudwatchLogsLogDestination(logGroup);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logDestinations: [cwlLogDestination],
      });

      const template = Template.fromStack(stack);

      // ASSERT
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Resource: {
                'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'],
              },
            }],
          },
        },
      });
    });

    it('should pass along s3 log configuration', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({
        bucket,
        prefix: 'mike',
        outputFormat: S3OutputFormat.W3C,
      });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            S3LogDestination: {
              BucketName: {
                Ref: 'LogBucketCC3B17E8',
              },
              BucketOwner: stack.account,
              Prefix: 'mike',
              OutputFormat: 'w3c',
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should pass along s3 log configuration for cross-account bucket', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({
        bucket,
        bucketOwner: '111111111111',
        prefix: 'mike',
        outputFormat: S3OutputFormat.JSON,
      });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            S3LogDestination: {
              BucketName: {
                Ref: 'LogBucketCC3B17E8',
              },
              BucketOwner: '111111111111',
              Prefix: 'mike',
              OutputFormat: 'json',
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to S3 bucket with pipe role', () => {
      // WHEN
      const bucket = new Bucket(stack, 'LogBucket');
      const s3LogDestination = new S3LogDestination({ bucket });

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logDestinations: [s3LogDestination],
      });

      const template = Template.fromStack(stack);

      // ASSERT
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Resource: [
                { 'Fn::GetAtt': ['LogBucketCC3B17E8', 'Arn'] },
                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['LogBucketCC3B17E8', 'Arn'] }, '/*']] },
              ],
            }],
          },
        },
      });
    });

    it('should pass along firehose log configuration', () => {
      // WHEN
      const firehoseBucket = new Bucket(stack, 'FirehoseBucket');
      const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('firehose.amazonaws.com') });

      const mockS3Destination: IDestination = {
        bind(_scope: Construct, _options: DestinationBindOptions): DestinationConfig {
          const bucketGrant = firehoseBucket.grantReadWrite(role);
          return {
            extendedS3DestinationConfiguration: {
              bucketArn: firehoseBucket.bucketArn,
              roleArn: role.roleArn,
            },
            dependables: [bucketGrant],
          };
        },
      };

      const deliveryStream = new DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
        destination: mockS3Destination,
      });

      const firehoseDestination = new FirehoseLogDestination(deliveryStream);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [firehoseDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            FirehoseLogDestination: {
              DeliveryStreamArn: {
                'Fn::GetAtt': ['DeliveryStreamNoSourceOrEncryptionKey0E4AAB82', 'Arn'],
              },
            },
            Level: 'ERROR',
            IncludeExecutionData: ['ALL'],
          },
        },
      });
    });

    it('should allow write to firehose stream', () => {
      // WHEN
      const firehoseBucket = new Bucket(stack, 'FirehoseBucket');
      const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('firehose.amazonaws.com') });

      const mockS3Destination: IDestination = {
        bind(_scope: Construct, _options: DestinationBindOptions): DestinationConfig {
          const bucketGrant = firehoseBucket.grantReadWrite(role);
          return {
            extendedS3DestinationConfiguration: {
              bucketArn: firehoseBucket.bucketArn,
              roleArn: role.roleArn,
            },
            dependables: [bucketGrant],
          };
        },
      };

      const deliveryStream = new DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
        destination: mockS3Destination,
      });

      const firehoseDestination = new FirehoseLogDestination(deliveryStream);

      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.ERROR,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [firehoseDestination],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::IAM::Policy', {
        Properties: {
          Roles: [{
            Ref: 'TestPipeRole0FD00B2B',
          }],
          PolicyDocument: {
            Statement: [{
              Action: [
                'firehose:PutRecord',
                'firehose:PutRecordBatch',
              ],
              Resource: {
                'Fn::GetAtt': ['DeliveryStreamNoSourceOrEncryptionKey0E4AAB82', 'Arn'],
              },
            }],
          },
        },
      });
    });
  });
});
