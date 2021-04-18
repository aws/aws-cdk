import { arrayWith, expect, haveResource } from '@aws-cdk/assert-internal';
import { SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import * as msk from '@aws-cdk/aws-msk';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as sources from '../lib';
import { TestFunction } from './test-function';

export = {
  'msk': {
    'default'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fn = new TestFunction(stack, 'Fn');
      const cluster = msk.Cluster.fromClusterArn(stack, 'Cluster', 'some-arn');
      const kafkaTopic = 'some-topic';
      const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

      // WHEN
      fn.addEventSource(new sources.ManagedKafkaEventSource(
        {
          cluster: cluster,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
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
              Resource: cluster.clusterArn,
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
      }));

      expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
        EventSourceArn: cluster.clusterArn,
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
      }));

      test.done();
    },
  },

  'self managed kafka': {
    'default'(test: Test) {
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
      expect(stack).to(haveResource('AWS::IAM::Policy', {
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
      }));

      expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
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
      }));

      test.done();
    },

    VPC: {
      'correctly rendered in the stack'(test: Test) {
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
            vpcSubnets: { subnetType: SubnetType.PRIVATE },
            securityGroup: sg,
          }));

        // THEN
        expect(stack).to(haveResource('AWS::IAM::Policy', {
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
        }));

        expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
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
        }));

        test.done();
      },
      'setting vpc requires vpcSubnets to be set'(test: Test) {
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
        const bootstrapServers = ['kafka-broker:9092'];
        const vpc = new Vpc(stack, 'Vpc');

        test.throws(() => {
          fn.addEventSource(new sources.SelfManagedKafkaEventSource(
            {
              bootstrapServers: bootstrapServers,
              topic: kafkaTopic,
              secret: secret,
              startingPosition: lambda.StartingPosition.TRIM_HORIZON,
              vpc: vpc,
              securityGroup: SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789'),

            }));
        }, /vpcSubnets must be set/);

        test.done();
      },

      'setting vpc requires securityGroup to be set'(test: Test) {
        const stack = new cdk.Stack();
        const fn = new TestFunction(stack, 'Fn');
        const kafkaTopic = 'some-topic';
        const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
        const bootstrapServers = ['kafka-broker:9092'];
        const vpc = new Vpc(stack, 'Vpc');

        test.throws(() => {
          fn.addEventSource(new sources.SelfManagedKafkaEventSource(
            {
              bootstrapServers: bootstrapServers,
              topic: kafkaTopic,
              secret: secret,
              startingPosition: lambda.StartingPosition.TRIM_HORIZON,
              vpc: vpc,
              vpcSubnets: { subnetType: SubnetType.PRIVATE },
            }));
        }, /securityGroup must be set/);

        test.done();
      },
    },

    'using SCRAM-SHA-256'(test: Test) {
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
          vpcSubnets: { subnetType: SubnetType.PRIVATE },
          securityGroup: sg,
          authenticationMethod: sources.AuthenticationMethod.SASL_SCRAM_256_AUTH,
        }));

      expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
        SourceAccessConfigurations: arrayWith(
          {
            Type: 'SASL_SCRAM_256_AUTH',
            URI: {
              Ref: 'SecretA720EF05',
            },
          },
        ),
      }));

      test.done();
    },
  },

}
