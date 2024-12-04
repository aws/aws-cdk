import { TestFunction } from './test-function';
import { Template, Match } from '../../assertions';
import { SecurityGroup, SubnetType, Vpc } from '../../aws-ec2';
import { Key } from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import { Bucket } from '../../aws-s3';
import { Secret } from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as sources from '../lib';

describe('KafkaEventSource', () => {
  describe('msk', () => {
    test('default', () => {
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
    test('with secret', () => {
      // GIVEN
      const stack = new cdk.Stack();
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
  });
});
