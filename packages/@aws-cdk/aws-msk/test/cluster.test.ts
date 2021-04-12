import { ResourcePart, SynthUtils } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';

import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import * as msk from '../lib';

/* eslint-disable quote-props */
describe('MSK Cluster', () => {
  let stack: core.Stack;
  let vpc: ec2.IVpc;

  beforeEach(() => {
    stack = new core.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('created with default properties', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      vpc,
    });

    expect(stack).toHaveResourceLike(
      'AWS::MSK::Cluster',
      {
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
      ResourcePart.CompleteDefinition,
    );
    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      KafkaVersion: '2.2.1',
    });
    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      EncryptionInfo: {
        EncryptionInTransit: { ClientBroker: 'TLS', InCluster: true },
      },
    });
    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      NumberOfBrokerNodes: 1,
    });
    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      BrokerNodeGroupInfo: {
        StorageInfo: { EBSStorageInfo: { VolumeSize: 1000 } },
      },
    });
    expect(stack).toHaveResource('AWS::EC2::SecurityGroup');
    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      BrokerNodeGroupInfo: {
        SecurityGroups: [
          {
            'Fn::GetAtt': ['ClusterSecurityGroup0921994B', 'GroupId'],
          },
        ],
      },
    });
  });

  describe('created with authentication enabled', () => {
    describe('with tls auth', () => {
      test('fails if client broker encryption is set to plaintext', () => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.PLAINTEXT,
          },
          clientAuthentication: msk.ClientAuthentication.tls({
            certificateAuthorityArns: [
              'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
            ],
          }),
        });

        const synthedStack = SynthUtils.synthesize(stack);
        const meta = synthedStack.findMetadataByType('aws:cdk:error');
        expect(meta[0].data).toEqual(
          'To enable client authentication, you must enabled TLS-encrypted traffic between clients and brokers.',
        );
      });
    });

    describe('with sasl/scram auth', () => {
      test('fails if tls encryption is set to plaintext', () => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.PLAINTEXT,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            scram: true,
          }),
        });
        const synthedStack = SynthUtils.synthesize(stack);
        const meta = synthedStack.findMetadataByType('aws:cdk:error');
        expect(meta[0].data).toEqual(
          'To enable client authentication, you must enabled TLS-encrypted traffic between clients and brokers.',
        );
      });

      test('fails if tls encryption is set to tls and plaintext', () => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.TLS_PLAINTEXT,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            scram: true,
          }),
        });
        const synthedStack = SynthUtils.synthesize(stack);
        const meta = synthedStack.findMetadataByType('aws:cdk:error');
        expect(meta[0].data).toEqual(
          'To enable SASL/SCRAM authentication, you must only allow TLS-encrypted traffic between clients and brokers.',
        );
      });
    });

    describe('creates a customer master key', () => {
      beforeEach(() => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.TLS,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            scram: true,
          }),
        });
      });

      test('with alias msk/sasl/scram', () => {
        expect(stack).toHaveResourceLike('AWS::KMS::Alias', {
          AliasName: 'alias/msk/sasl/scram',
        });
      });

      test('with a policy allowing the secrets manager service to use the key', () => {
        expect(stack).toHaveResourceLike('AWS::KMS::Key', {
          KeyPolicy: {
            Statement: [
              {
                Action: [
                  'kms:Create*',
                  'kms:Describe*',
                  'kms:Enable*',
                  'kms:List*',
                  'kms:Put*',
                  'kms:Update*',
                  'kms:Revoke*',
                  'kms:Disable*',
                  'kms:Get*',
                  'kms:Delete*',
                  'kms:ScheduleKeyDeletion',
                  'kms:CancelKeyDeletion',
                  'kms:GenerateDataKey',
                  'kms:TagResource',
                  'kms:UntagResource',
                ],
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':root',
                      ],
                    ],
                  },
                },
                Resource: '*',
              },
              {
                Action: [
                  'kms:Encrypt',
                  'kms:Decrypt',
                  'kms:ReEncrypt*',
                  'kms:GenerateDataKey*',
                  'kms:CreateGrant',
                  'kms:DescribeKey',
                ],
                Condition: {
                  StringEquals: {
                    'kms:ViaService': {
                      'Fn::Join': [
                        '',
                        [
                          'secretsmanager.',
                          {
                            Ref: 'AWS::Region',
                          },
                          '.amazonaws.com',
                        ],
                      ],
                    },
                    'kms:CallerAccount': {
                      Ref: 'AWS::AccountId',
                    },
                  },
                },
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ],
          },
        });
      });
    });
  });

  describe('created with an instance type set', () => {
    test('prefixes instance type with "kafka"', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.M5,
          ec2.InstanceSize.XLARGE,
        ),
      });

      expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
        BrokerNodeGroupInfo: { InstanceType: 'kafka.m5.xlarge' },
      });
    });
  });

  test('prefixes instance type with "kafka"', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M5,
        ec2.InstanceSize.XLARGE,
      ),
    });

    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      BrokerNodeGroupInfo: { InstanceType: 'kafka.m5.xlarge' },
    });
  });

  describe('created with logging enabled', () => {
    test('log group is set', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        logging: {
          cloudwatchLogGroup: new logs.LogGroup(stack, 'LogGroup'),
        },
      });

      expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
        LoggingInfo: {
          BrokerLogs: {
            CloudWatchLogs: {
              Enabled: true,
              LogGroup: {
                Ref: 'LogGroupF5B46931',
              },
            },
          },
        },
      });
    });

    test('s3 bucket is set', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        logging: {
          s3: { bucket: new s3.Bucket(stack, 'Bucket') },
        },
      });

      expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
        LoggingInfo: {
          BrokerLogs: {
            S3: {
              Bucket: {
                Ref: 'Bucket83908E77',
              },
              Enabled: true,
            },
          },
        },
      });
    });

    test('firehose delivery stream is set', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        logging: {
          firehoseDeliveryStreamArn:
            'arn:aws:firehose:us-west-2:111111111111:deliverystream/a-stream',
        },
      });

      expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
        LoggingInfo: {
          BrokerLogs: {
            Firehose: {
              DeliveryStream:
                'arn:aws:firehose:us-west-2:111111111111:deliverystream/a-stream',
              Enabled: true,
            },
          },
        },
      });
    });
  });

  describe('ebs volume size is within bounds', () => {
    test('exceeds max', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        ebsStorageInfo: { volumeSize: 16385 },
      });

      const synthedStack = SynthUtils.synthesize(stack);
      const meta = synthedStack.findMetadataByType('aws:cdk:error');
      expect(meta[0].data).toEqual(
        'EBS volume size should be in the range 1-16384',
      );
    });

    test('below minimum', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        vpc,
        ebsStorageInfo: { volumeSize: 0 },
      });

      const synthedStack = SynthUtils.synthesize(stack);
      const meta = synthedStack.findMetadataByType('aws:cdk:error');
      expect(meta[0].data).toEqual(
        'EBS volume size should be in the range 1-16384',
      );
    });
  });

  test('create an encrypted cluster with a custom KMS key', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      vpc,
      ebsStorageInfo: { encryptionKey: new kms.Key(stack, 'Key') },
    });

    expect(stack).toHaveResourceLike('AWS::MSK::Cluster', {
      EncryptionInfo: {
        EncryptionAtRest: {
          DataVolumeKMSKeyId: {
            Ref: 'Key961B73FD',
          },
        },
      },
    });
  });

  describe('importing an existing cluster with an ARN', () => {
    const clusterArn =
      'arn:aws:kafka:us-west-2:111111111111:cluster/a-cluster/11111111-1111-1111-1111-111111111111-1';
    let cluster: msk.ICluster;

    beforeEach(() => {
      cluster = msk.Cluster.fromClusterArn(stack, 'Cluster', clusterArn);
    });
    test('cluster name is set', () => {
      expect(cluster.clusterName).toEqual('a-cluster');
    });

    test('cluster arn is set', () => {
      expect(cluster.clusterArn).toEqual(clusterArn);
    });
  });

  test('Snapshot test with all values set', () => {
    const cluster = new msk.Cluster(stack, 'kafka', {
      clusterName: 'test-cluster',
      kafkaVersion: msk.KafkaVersion.of('2.4.1'),
      vpc,
      securityGroups: [
        ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg1', 'sg-123'),
        ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg2', 'sg-456'),
      ],
      ebsStorageInfo: {
        volumeSize: 100,
        encryptionKey: kms.Key.fromKeyArn(
          stack,
          'kms',
          'arn:aws:kms:us-east-1:111122223333:key/1234abc',
        ),
      },
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.tls({
        certificateAuthorityArns: [
          'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
        ],
      }),
      monitoring: {
        enablePrometheusJmxExporter: true,
        enablePrometheusNodeExporter: true,
        clusterMonitoringLevel: msk.ClusterMonitoringLevel.PER_TOPIC_PER_BROKER,
      },
      logging: {
        s3: {
          bucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'a-bucket'),
        },
        cloudwatchLogGroup: logs.LogGroup.fromLogGroupName(
          stack,
          'LogGroup',
          'a-log-group',
        ),
        firehoseDeliveryStreamArn:
          'arn:aws:firehose:us-west-2:123456790:deliverystream/a-delivery-stream',
      },
    });

    cluster.connections.allowFrom(
      ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg3', 'sg-3'),
      ec2.Port.tcp(2181),
    );

    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

