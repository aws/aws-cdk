import { Template, Match } from '@aws-cdk/assertions';
import { SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { TestFunction } from './test-function';
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
    });
  });
});
