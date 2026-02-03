import { TestFunction } from './test-function';
import { Template, Match } from '../../assertions';
import { SecurityGroup, SubnetType, Vpc } from '../../aws-ec2';
import { CfnRegistry } from '../../aws-glue';
import { Key } from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import { Bucket } from '../../aws-s3';
import { Secret } from '../../aws-secretsmanager';
import { Topic } from '../../aws-sns';
import { Queue } from '../../aws-sqs';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as sources from '../lib';

describe('KafkaEventSource', () => {
  describe('msk', () => {
    test('default @aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy enabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: true,
        },
      });
      const stack = new cdk.Stack(app);
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Effect: 'Allow',
              Resource: clusterArn,
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FninlinePolicyAddedToExecutionRole00AF5C038',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
      });
    });

    test('default @aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy disabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
        },
      });
      const stack = new cdk.Stack(app);
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Effect: 'Allow',
              Resource: clusterArn,
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
      });
    });

    test('with secret @aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy enabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: true,
        },
      });
      const stack = new cdk.Stack(app);
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              Effect: 'Allow',
              Resource: {
                Ref: 'SecretA720EF05',
              },
            },
            // {
            //   Action: [
            //     'kafka:DescribeCluster',
            //     'kafka:GetBootstrapBrokers',
            //     'kafka:ListScramSecrets',
            //   ],
            //   Effect: 'Allow',
            //   Resource: clusterArn,
            // },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Resource: clusterArn,
            },
          ],
        },
        PolicyName: 'FninlinePolicyAddedToExecutionRole00AF5C038',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });

    test('with secret @aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy disabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
        },
      });
      const stack = new cdk.Stack(app);
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              Effect: 'Allow',
              Resource: {
                Ref: 'SecretA720EF05',
              },
            },
            {
              Effect: 'Allow',
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Resource: clusterArn,
            },
          ],
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });

    test('with filters', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          filters: [
            lambda.FilterCriteria.filter({
              orFilter: lambda.FilterRule.or('one', 'two'),
              stringEquals: lambda.FilterRule.isEqual('test'),
            }),
            lambda.FilterCriteria.filter({
              numericEquals: lambda.FilterRule.isEqual(1),
            }),
          ],
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
            },
            {
              Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
            },
          ],
        },
      });
    });

    test('adding filter criteria encryption', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const myKey = Key.fromKeyArn(
        stack,
        'SourceBucketEncryptionKey',
        'arn:aws:kms:us-east-1:123456789012:key/<key-id>',
      );

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          filters: [
            lambda.FilterCriteria.filter({
              orFilter: lambda.FilterRule.or('one', 'two'),
              stringEquals: lambda.FilterRule.isEqual('test'),
            }),
            lambda.FilterCriteria.filter({
              numericEquals: lambda.FilterRule.isEqual(1),
            }),
          ],
          filterEncryption: myKey,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
            },
            {
              Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
            },
          ],
        },
        KmsKeyArn: 'arn:aws:kms:us-east-1:123456789012:key/<key-id>',
      });
    });

    test('adding filter criteria encryption with stack key', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const myKey = new Key(stack, 'fc-test-key-name', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        pendingWindow: cdk.Duration.days(7),
        description: 'KMS key for test fc encryption',
      });

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          filters: [
            lambda.FilterCriteria.filter({
              orFilter: lambda.FilterRule.or('one', 'two'),
              stringEquals: lambda.FilterRule.isEqual('test'),
            }),
            lambda.FilterCriteria.filter({
              numericEquals: lambda.FilterRule.isEqual(1),
            }),
          ],
          filterEncryption: myKey,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']],
                },
              },
              Resource: '*',
            },
            {
              Action: 'kms:Decrypt',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
              Resource: '*',
            },
          ],
        },
      });
    });

    test('with s3 onfailure destination', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      // WHEN
      testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });
    });

    test('with provisioned pollers', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);
      // WHEN
      testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
      });
    });

    test('maximum provisioned poller is out of limit', () => {
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      expect(() => testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 2001,
          },
        }))).toThrow(/Maximum provisioned pollers must be between 1 and 2000 inclusive/);
    });

    test('minimum provisioned poller is out of limit', () => {
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      expect(() => testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
          provisionedPollerConfig: {
            minimumPollers: 0,
            maximumPollers: 3,
          },
        }))).toThrow(/Minimum provisioned pollers must be between 1 and 200 inclusive/);
    });

    test('Minimum provisioned poller greater than maximum provisioned poller', () => {
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      expect(() => testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
          provisionedPollerConfig: {
            minimumPollers: 3,
            maximumPollers: 1,
          },
        }))).toThrow(/Minimum provisioned pollers must be less than or equal to maximum provisioned pollers/);
    });

    test('MetricsConfig validation - empty metrics array', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN & THEN
      expect(() => testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [],
        },
      }))).toThrow(/MetricsConfig must contain at least one metric type/);
    });

    test('MetricsConfig validation - valid metrics array', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN & THEN - should not throw
      expect(() => testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [lambda.MetricType.EVENT_COUNT],
        },
      }))).not.toThrow();
    });

    test('Setting startingPositionTimestamp for kafka event source ', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
        startingPositionTimestamp: 1640995200,
      }),
      );

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        StartingPosition: 'AT_TIMESTAMP',
        StartingPositionTimestamp: 1640995200,
      });
    });

    test('Setting error handling properties', () => {
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      new sources.S3OnFailureDestination(bucket);

      testLambdaFunction.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        provisionedPollerConfig: {
          minimumPollers: 1,
          maximumPollers: 3,
        },
        bisectBatchOnError: true,
        retryAttempts: 5,
        reportBatchItemFailures: true,
        maxRecordAge: cdk.Duration.hours(1),
      }),
      );

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        StartingPosition: 'TRIM_HORIZON',
        BisectBatchOnFunctionError: true,
        MaximumRetryAttempts: 5,
        FunctionResponseTypes: ['ReportBatchItemFailures'],
        MaximumRecordAgeInSeconds: 3600, // 1 hour in seconds
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
      });
    });
  });

  describe('self-managed kafka', () => {
    test('default', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              Effect: 'Allow',
              Resource: {
                Ref: 'SecretA720EF05',
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });

    test('with filters', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          filters: [
            lambda.FilterCriteria.filter({
              orFilter: lambda.FilterRule.or('one', 'two'),
              stringEquals: lambda.FilterRule.isEqual('test'),
            }),
            lambda.FilterCriteria.filter({
              numericEquals: lambda.FilterRule.isEqual(1),
            }),
          ],
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
            },
            {
              Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
            },
          ],
        },
      });
    });

    test('adding filter criteria encryption', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const myKey = Key.fromKeyArn(
        stack,
        'SourceBucketEncryptionKey',
        'arn:aws:kms:us-east-1:123456789012:key/<key-id>',
      );

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          filters: [
            lambda.FilterCriteria.filter({
              orFilter: lambda.FilterRule.or('one', 'two'),
              stringEquals: lambda.FilterRule.isEqual('test'),
            }),
            lambda.FilterCriteria.filter({
              numericEquals: lambda.FilterRule.isEqual(1),
            }),
          ],
          filterEncryption: myKey,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
            },
            {
              Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
            },
          ],
        },
        KmsKeyArn: 'arn:aws:kms:us-east-1:123456789012:key/<key-id>',
      });
    });

    test('without vpc, secret must be set', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const bootstrapServers = ['kafka-broker:9092'];

      expect(() => {
        fn.addEventSource(new sources.SelfManagedKafkaEventSource(
          {
            bootstrapServers: bootstrapServers,
            topic: kafkaTopic,
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          }));
      }).toThrow(/secret must be set/);
    });

    test('with s3 onFailure Destination', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const bootstrapServers = ['kafka-broker:9092'];
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      // WHEN
      testLambdaFunction.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' }),
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });
    });

    describe('vpc', () => {
      test('correctly rendered in the stack', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const bootstrapServers = ['kafka-broker:9092'];
        const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
        const vpc = new Vpc(stack, 'Vpc');

        // WHEN
        fn.addEventSource(new sources.SelfManagedKafkaEventSource(
          {
            bootstrapServers: bootstrapServers,
            topic: kafkaTopic,
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            vpc: vpc,
            vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
            securityGroup: sg,
          }));

        // THEN
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
        Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
          FunctionName: {
            Ref: 'Fn9270CBC0',
          },
          BatchSize: 100,
          SelfManagedEventSource: {
            Endpoints: {
              KafkaBootstrapServers: bootstrapServers,
            },
          },
          StartingPosition: 'TRIM_HORIZON',
          Topics: [
            kafkaTopic,
          ],
          SourceAccessConfigurations: [
            {
              Type: 'VPC_SECURITY_GROUP',
              URI: 'sg-0123456789',
            },
            {
              Type: 'VPC_SUBNET',
              URI: {
                Ref: 'VpcPrivateSubnet1Subnet536B997A',
              },
            },
            {
              Type: 'VPC_SUBNET',
              URI: {
                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
              },
            },
          ],
        });
      });
      test('with secret', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
        const bootstrapServers = ['kafka-broker:9092'];
        const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
        const vpc = new Vpc(stack, 'Vpc');

        // WHEN
        fn.addEventSource(new sources.SelfManagedKafkaEventSource(
          {
            bootstrapServers: bootstrapServers,
            topic: kafkaTopic,
            secret: secret,
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            vpc: vpc,
            vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
            securityGroup: sg,
          }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  'secretsmanager:GetSecretValue',
                  'secretsmanager:DescribeSecret',
                ],
                Effect: 'Allow',
                Resource: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
          Roles: [
            {
              Ref: 'FnServiceRoleB9001A96',
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
          FunctionName: {
            Ref: 'Fn9270CBC0',
          },
          BatchSize: 100,
          SelfManagedEventSource: {
            Endpoints: {
              KafkaBootstrapServers: bootstrapServers,
            },
          },
          StartingPosition: 'TRIM_HORIZON',
          Topics: [
            kafkaTopic,
          ],
          SourceAccessConfigurations: [
            {
              Type: 'SASL_SCRAM_512_AUTH',
              URI: {
                Ref: 'SecretA720EF05',
              },
            },
            {
              Type: 'VPC_SECURITY_GROUP',
              URI: 'sg-0123456789',
            },
            {
              Type: 'VPC_SUBNET',
              URI: {
                Ref: 'VpcPrivateSubnet1Subnet536B997A',
              },
            },
            {
              Type: 'VPC_SUBNET',
              URI: {
                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
              },
            },
          ],
        });
      });
      test('setting vpc requires vpcSubnets to be set', () => {
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
        const bootstrapServers = ['kafka-broker:9092'];
        const vpc = new Vpc(stack, 'Vpc');

        expect(() => {
          fn.addEventSource(new sources.SelfManagedKafkaEventSource(
            {
              bootstrapServers: bootstrapServers,
              topic: kafkaTopic,
              secret: secret,
              startingPosition: lambda.StartingPosition.TRIM_HORIZON,
              vpc: vpc,
              securityGroup: SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789'),

            }));
        }).toThrow(/vpcSubnets must be set/);
      });

      test('setting vpc requires securityGroup to be set', () => {
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
        const bootstrapServers = ['kafka-broker:9092'];
        const vpc = new Vpc(stack, 'Vpc');

        expect(() => {
          fn.addEventSource(new sources.SelfManagedKafkaEventSource(
            {
              bootstrapServers: bootstrapServers,
              topic: kafkaTopic,
              secret: secret,
              startingPosition: lambda.StartingPosition.TRIM_HORIZON,
              vpc: vpc,
              vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
            }));
        }).toThrow(/securityGroup must be set/);
      });
    });

    test('using SCRAM-SHA-256', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          authenticationMethod: sources.AuthenticationMethod.SASL_SCRAM_256_AUTH,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'SASL_SCRAM_256_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ]),
      });
    });

    test('using BASIC_AUTH', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          authenticationMethod: sources.AuthenticationMethod.BASIC_AUTH,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'BASIC_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ]),
      });
    });

    test('using CLIENT_CERTIFICATE_TLS_AUTH', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          authenticationMethod: sources.AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'CLIENT_CERTIFICATE_TLS_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ]),
      });
    });

    test('using CLIENT_CERTIFICATE_TLS_AUTH with rootCA', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const rootCACertificate = new Secret(stack, 'RootCASecret', { secretName: 'AmazonMSK_KafkaSecret_Root_CA' });
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          authenticationMethod: sources.AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
          rootCACertificate: rootCACertificate,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'CLIENT_CERTIFICATE_TLS_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
          {
            Type: 'SERVER_ROOT_CA_CERTIFICATE',
            URI: {
              Ref: 'RootCASecret21632BB9',
            },
          },
        ]),
      });
    });

    test('with rootCA', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const rootCACertificate = new Secret(stack, 'RootCASecret', { secretName: 'AmazonMSK_KafkaSecret_Root_CA' });
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          rootCACertificate: rootCACertificate,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'SERVER_ROOT_CA_CERTIFICATE',
            URI: {
              Ref: 'RootCASecret21632BB9',
            },
          },
        ]),
      });
    });

    test('rootCACertificate can be ISecret', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const mockRootCACertificateSecretArn = 'arn:aws:secretsmanager:us-east-1:012345678901:secret:mock';
      const rootCACertificate = Secret.fromSecretPartialArn(stack, 'RootCASecret', mockRootCACertificateSecretArn);
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          vpc: vpc,
          vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
          securityGroup: sg,
          rootCACertificate: rootCACertificate,
        }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: Match.arrayWith([
          {
            Type: 'SERVER_ROOT_CA_CERTIFICATE',
            URI: mockRootCACertificateSecretArn,
          },
        ]),
      });
    });

    test('consumerGroupId can be set for SelfManagedKafkaEventSource', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const consumerGroupId = 'my-consumer-group-id';
      const eventSourceMapping = new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          consumerGroupId: consumerGroupId,
        });
      // WHEN
      fn.addEventSource(eventSourceMapping);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SelfManagedKafkaEventSourceConfig: { ConsumerGroupId: consumerGroupId },
      });
    });

    test('consumerGroupId can be set for ManagedKafkaEventSource', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const consumerGroupId = 'my-consumer-group-id';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          consumerGroupId,
        });

      // WHEN
      fn.addEventSource(mskEventMapping);
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        AmazonManagedKafkaEventSourceConfig: { ConsumerGroupId: consumerGroupId },
      });
    });

    test('ManagedKafkaEventSource name conforms to construct id rules', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        });

      // WHEN
      fn.addEventSource(mskEventMapping);
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();
    });

    test('with provisioned pollers', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
        });

      // WHEN
      fn.addEventSource(mskEventMapping);
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
      });
    });

    test('maximum provisioned poller is out of limit', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      expect(() => fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 2001,
          },
        }))).toThrow(/Maximum provisioned pollers must be between 1 and 2000 inclusive/);
    });

    test('minimum provisioned poller is out of limit', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      expect(() => fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 0,
            maximumPollers: 3,
          },
        }))).toThrow(/Minimum provisioned pollers must be between 1 and 200 inclusive/);
    });

    test('Minimum provisioned poller greater than maximum provisioned poller', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      expect(() => fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 3,
            maximumPollers: 1,
          },
        }))).toThrow(/Minimum provisioned pollers must be less than or equal to maximum provisioned pollers/);
    });

    test('MetricsConfig validation - empty metrics array', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const bootstrapServers = ['kafka-broker:9092'];
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const kafkaTopic = 'some-topic';

      // WHEN & THEN
      expect(() => testLambdaFunction.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        secret,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [],
        },
      }))).toThrow(/MetricsConfig must contain at least one metric type/);
    });

    test('MetricsConfig validation - valid metrics array', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const testLambdaFunction = new TestFunction(stack, 'Fn');
      const bootstrapServers = ['kafka-broker:9092'];
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const kafkaTopic = 'some-topic';

      // WHEN & THEN - should not throw
      expect(() => testLambdaFunction.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        secret,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [lambda.MetricType.EVENT_COUNT, lambda.MetricType.ERROR_COUNT],
        },
      }))).not.toThrow();
    });

    test('Setting startingPositionTimestamp for kafka event source ', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const bootstrapServers = ['kafka-broker:9092'];
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const kafkaTopic = 'some-topic';

      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        secret: secret,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
        startingPositionTimestamp: 1640995200,
      }),
      );

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        StartingPosition: 'AT_TIMESTAMP',
        StartingPositionTimestamp: 1640995200,
      });
    });

    test('MSK with glue kafka schema registry with invalid arn', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            schemaRegistryArn: 'invalid-arn',
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      expect(() => fn.addEventSource(mskEventMapping))
        .toThrow(/schemaRegistryArn invalid-arn must match/);
    });

    test('MSK with glue kafka schema registry with no schema registry props', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      expect(() => fn.addEventSource(mskEventMapping))
        .toThrow(/one of schemaRegistryArn or schemaRegistry must be passed/);
    });

    test('MSK with confluent kafka schema registry with secret', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.ConfluentSchemaRegistry({
            schemaRegistryUri: 'https://example.com',
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            authenticationType: lambda.KafkaSchemaRegistryAccessConfigType.BASIC_AUTH,
            secret: secret,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(mskEventMapping);

      // THEN
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        AmazonManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'https://example.com',
            EventRecordFormat: 'JSON',
            AccessConfigs: [
              {
                Type: 'BASIC_AUTH',
                URI: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('MSK with glue kafka schema registry', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const glueRegistry = new CfnRegistry(stack, 'SchemaRegistry', {
        name: 'msk-test-schema-registry',
        description: 'Schema registry for SMK integration tests',
      });
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            schemaRegistry: glueRegistry,
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(mskEventMapping);

      // THEN
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'glue:GetRegistry',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
              },
            },
            {
              Action: 'glue:GetSchemaVersion',
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
                },
                {
                  'Fn::Sub': [
                    'arn:${AWS::Partition}:glue:${AWS::Region}:${AWS::AccountId}:schema/${registryName}/*',
                    { registryName: 'msk-test-schema-registry' },
                  ],
                },
              ],
            },
            {
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Effect: 'Allow',
              Resource: 'some-arn',
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        AmazonManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: {
              'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
            },
            EventRecordFormat: 'JSON',
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('MSK with glue kafka schema registry arn', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const glueRegistry = 'arn:aws:glue:us-west-2:123456789012:registry/example';
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            schemaRegistryArn: glueRegistry,
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(mskEventMapping);

      // THEN
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'glue:GetRegistry',
              Effect: 'Allow',
              Resource: 'arn:aws:glue:us-west-2:123456789012:registry/example',
            },
            {
              Action: 'glue:GetSchemaVersion',
              Effect: 'Allow',
              Resource: [
                'arn:aws:glue:us-west-2:123456789012:registry/example',
                {
                  'Fn::Sub': [
                    'arn:${AWS::Partition}:glue:${AWS::Region}:${AWS::AccountId}:schema/${registryName}/*',
                    { registryName: 'example' },
                  ],
                },
              ],
            },
            {
              Action: [
                'kafka:DescribeCluster',
                'kafka:GetBootstrapBrokers',
                'kafka:ListScramSecrets',
              ],
              Effect: 'Allow',
              Resource: 'some-arn',
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        AmazonManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'arn:aws:glue:us-west-2:123456789012:registry/example',
            EventRecordFormat: 'JSON',
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('MSK with kafka schema registry and consumer group ID', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const mskEventMapping = new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          consumerGroupId: 'my-consumer-group-id',
          schemaRegistryConfig: new sources.ConfluentSchemaRegistry({
            schemaRegistryUri: 'https://example.com',
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            authenticationType: lambda.KafkaSchemaRegistryAccessConfigType.BASIC_AUTH,
            secret: secret,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(mskEventMapping);

      // THEN
      expect(mskEventMapping.eventSourceMappingId).toBeDefined();
      expect(mskEventMapping.eventSourceMappingArn).toBeDefined();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        AmazonManagedKafkaEventSourceConfig: {
          ConsumerGroupId: 'my-consumer-group-id',
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'https://example.com',
            EventRecordFormat: 'JSON',
            AccessConfigs: [
              {
                Type: 'BASIC_AUTH',
                URI: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('SMK with confluent kafka schema registry and secret', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      const smkEventMapping = new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.ConfluentSchemaRegistry({
            schemaRegistryUri: 'https://example.com',
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            authenticationType: lambda.KafkaSchemaRegistryAccessConfigType.BASIC_AUTH,
            secret: secret,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(smkEventMapping);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        SelfManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'https://example.com',
            EventRecordFormat: 'JSON',
            AccessConfigs: [
              {
                Type: 'BASIC_AUTH',
                URI: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('SMK with glue kafka schema registry', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const glueRegistry = new CfnRegistry(stack, 'SchemaRegistry', {
        name: 'smk-test-schema-registry',
        description: 'Schema registry for SMK integration tests',
      });
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      const smkEventMapping = new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            schemaRegistry: glueRegistry,
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(smkEventMapping);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'glue:GetRegistry',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
              },
            },
            {
              Action: 'glue:GetSchemaVersion',
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
                },
                {
                  'Fn::Sub': [
                    'arn:${AWS::Partition}:glue:${AWS::Region}:${AWS::AccountId}:schema/${registryName}/*',
                    { registryName: 'smk-test-schema-registry' },
                  ],
                },
              ],
            },
            {
              Action: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              Effect: 'Allow',
              Resource: {
                Ref: 'SecretA720EF05',
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        SelfManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: {
              'Fn::GetAtt': ['SchemaRegistry', 'Arn'],
            },
            EventRecordFormat: 'JSON',
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('SMK with glue kafka schema registry arn', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const glueRegistry = 'arn:aws:glue:us-west-2:123456789012:registry/example';
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      const smkEventMapping = new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          schemaRegistryConfig: new sources.GlueSchemaRegistry({
            schemaRegistryArn: glueRegistry,
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(smkEventMapping);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'glue:GetRegistry',
              Effect: 'Allow',
              Resource: 'arn:aws:glue:us-west-2:123456789012:registry/example',
            },
            {
              Action: 'glue:GetSchemaVersion',
              Effect: 'Allow',
              Resource: [
                'arn:aws:glue:us-west-2:123456789012:registry/example',
                {
                  'Fn::Sub': [
                    'arn:${AWS::Partition}:glue:${AWS::Region}:${AWS::AccountId}:schema/${registryName}/*',
                    { registryName: 'example' },
                  ],
                },
              ],
            },
            {
              Action: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              Effect: 'Allow',
              Resource: {
                Ref: 'SecretA720EF05',
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FnServiceRoleDefaultPolicyC6A839BF',
        Roles: [
          {
            Ref: 'FnServiceRoleB9001A96',
          },
        ],
      });

      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        SelfManagedKafkaEventSourceConfig: {
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'arn:aws:glue:us-west-2:123456789012:registry/example',
            EventRecordFormat: 'JSON',
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('SMK with kafka schema registry and consumer group ID', () => {
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      const smkEventMapping = new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 3,
          },
          consumerGroupId: 'my-consumer-group-id',
          schemaRegistryConfig: new sources.ConfluentSchemaRegistry({
            schemaRegistryUri: 'https://example.com',
            eventRecordFormat: lambda.EventRecordFormat.JSON,
            authenticationType: lambda.KafkaSchemaRegistryAccessConfigType.BASIC_AUTH,
            secret: secret,
            schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
          }),
        });

      // WHEN
      fn.addEventSource(smkEventMapping);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 3,
        },
        SelfManagedKafkaEventSourceConfig: {
          ConsumerGroupId: 'my-consumer-group-id',
          SchemaRegistryConfig: {
            SchemaRegistryURI: 'https://example.com',
            EventRecordFormat: 'JSON',
            AccessConfigs: [
              {
                Type: 'BASIC_AUTH',
                URI: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            SchemaValidationConfigs: [{ Attribute: 'KEY' }],
          },
        },
      });
    });

    test('SelfManagedKafkaEventSource inherits error handling properties correctly', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers: bootstrapServers,
        topic: kafkaTopic,
        secret: secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        // Error handling properties that should be inherited from StreamEventSourceProps
        bisectBatchOnError: true,
        retryAttempts: 5,
        reportBatchItemFailures: true,
        maxRecordAge: cdk.Duration.hours(1),
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        StartingPosition: 'TRIM_HORIZON',
        Topics: [kafkaTopic],
        // Verify error handling properties are correctly mapped to CloudFormation
        BisectBatchOnFunctionError: true,
        MaximumRetryAttempts: 5,
        FunctionResponseTypes: ['ReportBatchItemFailures'],
        MaximumRecordAgeInSeconds: 3600, // 1 hour in seconds
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });
  });

  describe('PollerGroupName tests', () => {
    test('ManagedKafkaEventSource with PollerGroupName', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 2,
            maximumPollers: 5,
            pollerGroupName: 'managed-kafka-group',
          },
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        ProvisionedPollerConfig: {
          MinimumPollers: 2,
          MaximumPollers: 5,
          PollerGroupName: 'managed-kafka-group',
        },
      });
    });

    test('SelfManagedKafkaEventSource with PollerGroupName', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          provisionedPollerConfig: {
            minimumPollers: 1,
            maximumPollers: 4,
            pollerGroupName: 'self-managed-kafka-group',
          },
        }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        ProvisionedPollerConfig: {
          MinimumPollers: 1,
          MaximumPollers: 4,
          PollerGroupName: 'self-managed-kafka-group',
        },
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });
  });
});

describe('KafkaDlq integration', () => {
  describe('ManagedKafkaEventSource with KafkaDlq', () => {
    test('includes correct DestinationConfig in CloudFormation template', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [kafkaTopic],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('works with kafka:// prefix in topic name', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const kafkaDlq = new sources.KafkaDlq('kafka://failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('works with complex topic names', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const kafkaDlq = new sources.KafkaDlq('my.complex_failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://my.complex_failure-topic',
          },
        },
      });
    });
  });

  describe('SelfManagedKafkaEventSource with KafkaDlq', () => {
    test('includes correct DestinationConfig in CloudFormation template', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        StartingPosition: 'TRIM_HORIZON',
        Topics: [kafkaTopic],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });

    test('works with kafka:// prefix in topic name', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const kafkaDlq = new sources.KafkaDlq('kafka://failure-topic');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('works with VPC configuration', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const bootstrapServers = ['kafka-broker:9092'];
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');
      const vpc = new Vpc(stack, 'Vpc');
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroup: sg,
        onFailure: kafkaDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
        SourceAccessConfigurations: [
          {
            Type: 'VPC_SECURITY_GROUP',
            URI: 'sg-0123456789',
          },
          {
            Type: 'VPC_SUBNET',
            URI: {
              Ref: 'VpcPrivateSubnet1Subnet536B997A',
            },
          },
          {
            Type: 'VPC_SUBNET',
            URI: {
              Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
            },
          },
        ],
      });
    });
  });
});

describe('backwards compatibility', () => {
  describe('existing onFailure destinations continue to work', () => {
    test('ManagedKafka with S3OnFailureDestination still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: s3OnFailureDestination,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });
    });

    test('SelfManagedKafka with S3OnFailureDestination still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: s3OnFailureDestination,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });
    });

    test('multiple destination types can be used in same stack', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn1 = new TestFunction(stack, 'Fn1');
      const fn2 = new TestFunction(stack, 'Fn2');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn1.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: s3OnFailureDestination,
      }));

      fn2.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: 'another-topic',
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN
      const template = Template.fromStack(stack);

      // Should have 2 event source mappings
      template.resourceCountIs('AWS::Lambda::EventSourceMapping', 2);

      // Verify S3 destination exists
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['some-topic'],
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });

      // Verify Kafka destination exists
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['another-topic'],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('ManagedKafka with SnsDlq still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const topic = new Topic(stack, 'Topic');
      const snsDlq = new sources.SnsDlq(topic);

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: snsDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        DestinationConfig: {
          OnFailure: {
            Destination: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        },
      });
    });

    test('SelfManagedKafka with SnsDlq still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const topic = new Topic(stack, 'Topic');
      const snsDlq = new sources.SnsDlq(topic);

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: snsDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        DestinationConfig: {
          OnFailure: {
            Destination: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        },
      });
    });

    test('ManagedKafka with SqsDlq still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const queue = new Queue(stack, 'Queue');
      const sqsDlq = new sources.SqsDlq(queue);

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: sqsDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::GetAtt': ['Queue4A7E3555', 'Arn'],
            },
          },
        },
      });
    });

    test('SelfManagedKafka with SqsDlq still works', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];
      const queue = new Queue(stack, 'Queue');
      const sqsDlq = new sources.SqsDlq(queue);

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: sqsDlq,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::GetAtt': ['Queue4A7E3555', 'Arn'],
            },
          },
        },
      });
    });

    test('CloudFormation template generation works correctly for all destination types', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';

      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);
      const topic = new Topic(stack, 'Topic');
      const snsDlq = new sources.SnsDlq(topic);
      const queue = new Queue(stack, 'Queue');
      const sqsDlq = new sources.SqsDlq(queue);
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN - Add multiple event sources with different destination types
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: 'topic-with-s3',
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: s3OnFailureDestination,
      }));

      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: 'topic-with-sns',
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: snsDlq,
      }));

      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: 'topic-with-sqs',
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: sqsDlq,
      }));

      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: 'topic-with-kafka',
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
      }));

      // THEN - Verify all destinations are correctly rendered
      const template = Template.fromStack(stack);

      // Should have 4 event source mappings
      template.resourceCountIs('AWS::Lambda::EventSourceMapping', 4);

      // Verify S3 destination format
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['topic-with-s3'],
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']],
            },
          },
        },
      });

      // Verify SNS destination format
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['topic-with-sns'],
        DestinationConfig: {
          OnFailure: {
            Destination: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        },
      });

      // Verify SQS destination format
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['topic-with-sqs'],
        DestinationConfig: {
          OnFailure: {
            Destination: {
              'Fn::GetAtt': ['Queue4A7E3555', 'Arn'],
            },
          },
        },
      });

      // Verify Kafka destination format
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        Topics: ['topic-with-kafka'],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('no breaking changes to existing API surface', () => {
      // GIVEN
      const stack = new cdk.Stack();
      new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // Test that all existing destination types are still accepted by the API
      const bucket = Bucket.fromBucketName(stack, 'BucketByName', 'my-bucket');
      const s3OnFailureDestination = new sources.S3OnFailureDestination(bucket);
      const topic = new Topic(stack, 'Topic');
      const snsDlq = new sources.SnsDlq(topic);
      const queue = new Queue(stack, 'Queue');
      const sqsDlq = new sources.SqsDlq(queue);

      // WHEN - These should all compile and work without errors
      expect(() => {
        new sources.ManagedKafkaEventSource({
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
        });
      }).not.toThrow();

      expect(() => {
        new sources.ManagedKafkaEventSource({
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: snsDlq,
        });
      }).not.toThrow();

      expect(() => {
        new sources.ManagedKafkaEventSource({
          clusterArn,
          topic: kafkaTopic,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: sqsDlq,
        });
      }).not.toThrow();

      expect(() => {
        new sources.SelfManagedKafkaEventSource({
          bootstrapServers: ['kafka-broker:9092'],
          topic: kafkaTopic,
          secret: new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' }),
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: s3OnFailureDestination,
        });
      }).not.toThrow();

      expect(() => {
        new sources.SelfManagedKafkaEventSource({
          bootstrapServers: ['kafka-broker:9092'],
          topic: kafkaTopic,
          secret: new Secret(stack, 'Secret2', { secretName: 'AmazonMSK_KafkaSecret2' }),
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: snsDlq,
        });
      }).not.toThrow();

      expect(() => {
        new sources.SelfManagedKafkaEventSource({
          bootstrapServers: ['kafka-broker:9092'],
          topic: kafkaTopic,
          secret: new Secret(stack, 'Secret3', { secretName: 'AmazonMSK_KafkaSecret3' }),
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          onFailure: sqsDlq,
        });
      }).not.toThrow();

      // THEN - No exceptions should be thrown, indicating API compatibility
    });
  });
});
describe('KafkaDlq CloudFormation Template Generation', () => {
  describe('destination property mapping', () => {
    test('KafkaDlq maps correctly to DestinationConfig.OnFailure.Destination for ManagedKafka', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
      const kafkaTopic = 'test-topic';
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.LATEST,
        onFailure: kafkaDlq,
      }));

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        Topics: [kafkaTopic],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('KafkaDlq maps correctly to DestinationConfig.OnFailure.Destination for SelfManagedKafka', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'test-topic';
      const bootstrapServers = ['kafka-broker:9092'];
      const kafkaDlq = new sources.KafkaDlq('failure-topic');
      const vpc = new Vpc(stack, 'TestVpc');
      const sg = SecurityGroup.fromSecurityGroupId(stack, 'TestSG', 'sg-12345');

      // WHEN
      fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.LATEST,
        onFailure: kafkaDlq,
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroup: sg,
      }));

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        SelfManagedEventSource: {
          Endpoints: {
            KafkaBootstrapServers: bootstrapServers,
          },
        },
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        Topics: [kafkaTopic],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('kafka:// prefix is preserved in generated CloudFormation templates', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
      const kafkaTopic = 'test-topic';

      // Test with explicit kafka:// prefix
      const kafkaDlqWithPrefix = new sources.KafkaDlq('kafka://explicit-failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.LATEST,
        onFailure: kafkaDlqWithPrefix,
      }));

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://explicit-failure-topic',
          },
        },
      });
    });

    test('proper structure matches AWS Lambda EventSourceMapping schema', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
      const kafkaTopic = 'test-topic';
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.LATEST,
        onFailure: kafkaDlq,
        batchSize: 50,
        maxBatchingWindow: cdk.Duration.seconds(5),
      }));

      // THEN - Verify complete EventSourceMapping structure
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 50,
        MaximumBatchingWindowInSeconds: 5,
        StartingPosition: 'LATEST',
        Topics: [kafkaTopic],
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });

    test('KafkaDlq works alongside other EventSourceMapping properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
      const kafkaTopic = 'test-topic';
      const kafkaDlq = new sources.KafkaDlq('failure-topic');

      // WHEN - Add event source with multiple properties
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        onFailure: kafkaDlq,
        batchSize: 100,
        maxBatchingWindow: cdk.Duration.seconds(10),
        parallelizationFactor: 2,
        filters: [
          lambda.FilterCriteria.filter({
            stringEquals: lambda.FilterRule.isEqual('test'),
          }),
        ],
      } as any));

      // THEN - Verify all properties coexist properly
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        MaximumBatchingWindowInSeconds: 10,
        ParallelizationFactor: 2,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [kafkaTopic],
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"stringEquals":["test"]}',
            },
          ],
        },
        DestinationConfig: {
          OnFailure: {
            Destination: 'kafka://failure-topic',
          },
        },
      });
    });
  });
});

describe('template synthesis with various configurations', () => {
  test('CDK synthesis with topic name without kafka:// prefix', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
    const kafkaTopic = 'test-topic';
    const kafkaDlq = new sources.KafkaDlq('simple-topic-name');

    // WHEN
    fn.addEventSource(new sources.ManagedKafkaEventSource({
      clusterArn,
      topic: kafkaTopic,
      startingPosition: lambda.StartingPosition.LATEST,
      onFailure: kafkaDlq,
    }));

    // THEN - Should synthesize without errors and add kafka:// prefix
    expect(() => Template.fromStack(stack)).not.toThrow();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      DestinationConfig: {
        OnFailure: {
          Destination: 'kafka://simple-topic-name',
        },
      },
    });
  });

  test('CDK synthesis with topic name with kafka:// prefix', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
    const kafkaTopic = 'test-topic';
    const kafkaDlq = new sources.KafkaDlq('kafka://prefixed-topic-name');

    // WHEN
    fn.addEventSource(new sources.ManagedKafkaEventSource({
      clusterArn,
      topic: kafkaTopic,
      startingPosition: lambda.StartingPosition.LATEST,
      onFailure: kafkaDlq,
    }));

    // THEN - Should synthesize without errors and not duplicate prefix
    expect(() => Template.fromStack(stack)).not.toThrow();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      DestinationConfig: {
        OnFailure: {
          Destination: 'kafka://prefixed-topic-name',
        },
      },
    });
  });

  test('CDK synthesis with complex topic names', () => {
    // GIVEN
    const stack = new cdk.Stack();
    new TestFunction(stack, 'Fn');
    const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
    const kafkaTopic = 'test-topic';

    // Test various valid Kafka topic name formats
    const topicNames = [
      'app.errors.v1', // with dots
      'app_errors_v1', // with underscores
      'app-errors-v1', // with hyphens
      'MyApp123', // alphanumeric
      'kafka://pre.fixed_topic', // with prefix and mixed characters
    ];

    topicNames.forEach((topicName, index) => {
      const kafkaDlq = new sources.KafkaDlq(topicName);
      const fnName = `Fn${index}`;
      const testFn = new TestFunction(stack, fnName);

      // WHEN
      testFn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.LATEST,
        onFailure: kafkaDlq,
      }));
    });

    // THEN - Should synthesize without errors
    expect(() => Template.fromStack(stack)).not.toThrow();
    const template = Template.fromStack(stack);

    // Verify each destination is properly formatted
    const expectedDestinations = [
      'kafka://app.errors.v1',
      'kafka://app_errors_v1',
      'kafka://app-errors-v1',
      'kafka://MyApp123',
      'kafka://pre.fixed_topic', // prefix not duplicated
    ];

    expectedDestinations.forEach((expectedDestination) => {
      template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        DestinationConfig: {
          OnFailure: {
            Destination: expectedDestination,
          },
        },
      });
    });
  });

  test('no syntax errors in generated CloudFormation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
    const kafkaTopic = 'test-topic';
    const kafkaDlq = new sources.KafkaDlq('failure-topic');

    // WHEN
    fn.addEventSource(new sources.ManagedKafkaEventSource({
      clusterArn,
      topic: kafkaTopic,
      startingPosition: lambda.StartingPosition.LATEST,
      onFailure: kafkaDlq,
    }));

    // THEN - Template should be valid JSON
    const template = Template.fromStack(stack);
    const templateJson = template.toJSON();

    expect(templateJson).toBeDefined();
    expect(typeof templateJson).toBe('object');
    expect(templateJson.Resources).toBeDefined();

    // Verify the EventSourceMapping resource exists and is properly structured
    const eventSourceMappings = Object.values(templateJson.Resources).filter(
      (resource: any) => resource.Type === 'AWS::Lambda::EventSourceMapping',
    );
    expect(eventSourceMappings).toHaveLength(1);

    const mapping = eventSourceMappings[0] as any;
    expect(mapping.Properties.DestinationConfig.OnFailure.Destination).toBe('kafka://failure-topic');
  });

  test('compatibility with other event source mapping properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const clusterArn = 'arn:aws:kafka:us-east-1:123456789012:cluster/test-cluster';
    const kafkaTopic = 'test-topic';
    const kafkaDlq = new sources.KafkaDlq('failure-topic');
    const secret = new Secret(stack, 'Secret', { secretName: 'KafkaSecret' });

    // WHEN - Configure with many properties
    fn.addEventSource(new sources.ManagedKafkaEventSource({
      clusterArn,
      topic: kafkaTopic,
      startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
      startingPositionTimestamp: 1640995200,
      onFailure: kafkaDlq,
      batchSize: 200,
      maxBatchingWindow: cdk.Duration.seconds(15),
      parallelizationFactor: 5,
      secret,
      filters: [
        lambda.FilterCriteria.filter({
          stringEquals: lambda.FilterRule.isEqual('important'),
          numericEquals: lambda.FilterRule.isEqual(42),
        }),
      ],
    } as any));

    // THEN - Should synthesize without errors and include all properties
    expect(() => Template.fromStack(stack)).not.toThrow();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      EventSourceArn: clusterArn,
      Topics: [kafkaTopic],
      StartingPosition: 'AT_TIMESTAMP',
      StartingPositionTimestamp: 1640995200,
      BatchSize: 200,
      MaximumBatchingWindowInSeconds: 15,
      ParallelizationFactor: 5,
      SourceAccessConfigurations: [
        {
          Type: 'SASL_SCRAM_512_AUTH',
          URI: {
            Ref: 'SecretA720EF05',
          },
        },
      ],
      FilterCriteria: {
        Filters: [
          {
            Pattern: '{"stringEquals":["important"],"numericEquals":[{"numeric":["=",42]}]}',
          },
        ],
      },
      DestinationConfig: {
        OnFailure: {
          Destination: 'kafka://failure-topic',
        },
      },
    });
  });

  test('SelfManagedKafka with various configurations', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const kafkaTopic = 'test-topic';
    const bootstrapServers = ['broker1:9092', 'broker2:9092'];
    const kafkaDlq = new sources.KafkaDlq('self-managed-failure-topic');
    const secret = new Secret(stack, 'Secret', { secretName: 'SelfManagedKafkaSecret' });
    const vpc = new Vpc(stack, 'TestVpc');
    const sg = SecurityGroup.fromSecurityGroupId(stack, 'TestSG', 'sg-12345');

    // WHEN
    fn.addEventSource(new sources.SelfManagedKafkaEventSource({
      bootstrapServers,
      topic: kafkaTopic,
      startingPosition: lambda.StartingPosition.LATEST,
      onFailure: kafkaDlq,
      batchSize: 150,
      maxBatchingWindow: cdk.Duration.seconds(20),
      secret,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroup: sg,
      filters: [
        lambda.FilterCriteria.filter({
          stringEquals: lambda.FilterRule.isEqual('processed'),
        }),
      ],
    }));

    // THEN - Should synthesize without errors
    expect(() => Template.fromStack(stack)).not.toThrow();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      SelfManagedEventSource: {
        Endpoints: {
          KafkaBootstrapServers: bootstrapServers,
        },
      },
      Topics: [kafkaTopic],
      StartingPosition: 'LATEST',
      BatchSize: 150,
      MaximumBatchingWindowInSeconds: 20,
      FilterCriteria: {
        Filters: [
          {
            Pattern: '{"stringEquals":["processed"]}',
          },
        ],
      },
      DestinationConfig: {
        OnFailure: {
          Destination: 'kafka://self-managed-failure-topic',
        },
      },
    });
  });

  describe('LogLevel', () => {
    test('LogLevel with INFO log level for ManagedKafkaEventSource', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        logLevel: lambda.EventSourceMappingLogLevel.INFO,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        LoggingConfig: {
          SystemLogLevel: 'INFO',
        },
      });
    });

    test('MetricsConfig validation - empty metrics array for ManagedKafkaEventSource', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN & THEN
      expect(() => fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [],
        },
      }))).toThrow(/MetricsConfig must contain at least one metric type/);
    });

    test('MetricsConfig validation - empty metrics array for SelfManagedKafkaEventSource', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
      const bootstrapServers = ['kafka-broker:9092'];

      // WHEN & THEN
      expect(() => fn.addEventSource(new sources.SelfManagedKafkaEventSource({
        bootstrapServers,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        metricsConfig: {
          metrics: [],
        },
      }))).toThrow(/MetricsConfig must contain at least one metric type/);
    });

    test('MetricsConfig works with existing configurations', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 50,
        maxBatchingWindow: cdk.Duration.seconds(5),
        metricsConfig: {
          metrics: [lambda.MetricType.EVENT_COUNT, lambda.MetricType.KAFKA_METRICS],
        },
        filters: [
          lambda.FilterCriteria.filter({
            stringEquals: lambda.FilterRule.isEqual('test'),
          }),
        ],
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 50,
        MaximumBatchingWindowInSeconds: 5,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
        MetricsConfig: {
          Metrics: ['EventCount', 'KafkaMetrics'],
        },
        FilterCriteria: {
          Filters: [
            {
              Pattern: '{"stringEquals":["test"]}',
            },
          ],
        },
        SourceAccessConfigurations: [
          {
            Type: 'SASL_SCRAM_512_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
      });
    });

    test('MetricsConfig is optional and does not break existing functionality', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const clusterArn = 'some-arn';
      const kafkaTopic = 'some-topic';

      // WHEN - Create event source without MetricsConfig
      fn.addEventSource(new sources.ManagedKafkaEventSource({
        clusterArn,
        topic: kafkaTopic,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      }));

      // THEN - Should work without MetricsConfig property
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: clusterArn,
        FunctionName: {
          Ref: 'Fn9270CBC0',
        },
        BatchSize: 100,
        StartingPosition: 'TRIM_HORIZON',
        Topics: [
          kafkaTopic,
        ],
      });

      // Verify MetricsConfig is not present when not specified
      const template = Template.fromStack(stack);
      const templateJson = template.toJSON();
      const eventSourceMappingResource = Object.values(templateJson.Resources).find(
        (resource: any) => resource.Type === 'AWS::Lambda::EventSourceMapping',
      ) as any;

      expect(eventSourceMappingResource.Properties.MetricsConfig).toBeUndefined();
    });
  });
});
