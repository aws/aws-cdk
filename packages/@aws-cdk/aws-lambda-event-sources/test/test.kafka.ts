import { expect, haveResource } from '@aws-cdk/assert';
import { SecurityGroup, Subnet } from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as sources from '../lib';
import { TestFunction } from './test-function';

export = {
  'MSK: sufficiently complex example'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const clusterArn = 'some-arn';
    const kafkaTopic = 'some-topic';
    const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

    // WHEN
    fn.addEventSource(new sources.ManagedKafkaEventSource(
      {
        clusterArn: clusterArn,
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
    }));

    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
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
    }));

    test.done();
  },

  'self managed Kafka: sufficiently complex example'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const kafkaTopic = 'some-topic';
    const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
    const bootstrapServers = ['kafka-broker:9092'];
    const subnet = Subnet.fromSubnetId(stack, 'Subnet', 'subnet-0011001100');
    const sg = SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-0123456789');

    // WHEN
    fn.addEventSource(new sources.SelfManagedKafkaEventSource(
      {
        bootstrapServers: bootstrapServers,
        topic: kafkaTopic,
        secret: secret,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        subnets: [subnet],
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
          URI: 'subnet-0011001100',
        },
      ],
    }));

    test.done();
  },

  'self managed Kafka in VPC: subnet and securityGroup must be set together'(test: Test) {
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const kafkaTopic = 'some-topic';
    const secret = new Secret(stack, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });
    const bootstrapServers = ['kafka-broker:9092'];
    const subnet = Subnet.fromSubnetId(stack, 'Subnet', 'subnet-0011001100');

    test.throws(() => {
      fn.addEventSource(new sources.SelfManagedKafkaEventSource(
        {
          bootstrapServers: bootstrapServers,
          topic: kafkaTopic,
          secret: secret,
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          subnets: [subnet],
        }));
    }, /both subnets and securityGroup must be set/);

    test.done();
  },

}
