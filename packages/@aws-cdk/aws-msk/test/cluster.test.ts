import { Template } from '@aws-cdk/assertions';
import * as acmpca from '@aws-cdk/aws-acmpca';
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
    const app = new core.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new core.Stack(app);
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('created with default properties', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      kafkaVersion: msk.KafkaVersion.V2_6_1,
      vpc,
    });

    Template.fromStack(stack).hasResource(
      'AWS::MSK::Cluster',
      {
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
    );
    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
      KafkaVersion: '2.6.1',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
      EncryptionInfo: {
        EncryptionInTransit: { ClientBroker: 'TLS', InCluster: true },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
      NumberOfBrokerNodes: 2,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
      BrokerNodeGroupInfo: {
        StorageInfo: { EBSStorageInfo: { VolumeSize: 1000 } },
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
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
        expect(
          () =>
            new msk.Cluster(stack, 'Cluster', {
              clusterName: 'cluster',
              kafkaVersion: msk.KafkaVersion.V2_6_1,
              vpc,
              encryptionInTransit: {
                clientBroker: msk.ClientBrokerEncryption.PLAINTEXT,
              },
              clientAuthentication: msk.ClientAuthentication.tls({
                certificateAuthorities: [
                  acmpca.CertificateAuthority.fromCertificateAuthorityArn(
                    stack,
                    'CertificateAuthority',
                    'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
                  ),
                ],
              }),
            }),
        ).toThrow(
          'To enable client authentication, you must enabled TLS-encrypted traffic between clients and brokers.',
        );
      });
    });

    describe('with sasl/scram auth', () => {
      test('fails if tls encryption is set to plaintext', () => {
        expect(() => new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          kafkaVersion: msk.KafkaVersion.V2_6_1,
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.PLAINTEXT,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            scram: true,
          }),
        }),
        ).toThrow(
          'To enable client authentication, you must enabled TLS-encrypted traffic between clients and brokers.',
        );
      });

      test('fails if tls encryption is set to tls and plaintext', () => {
        expect(
          () =>
            new msk.Cluster(stack, 'Cluster', {
              clusterName: 'cluster',
              kafkaVersion: msk.KafkaVersion.V2_6_1,
              vpc,
              encryptionInTransit: {
                clientBroker: msk.ClientBrokerEncryption.TLS_PLAINTEXT,
              },
              clientAuthentication: msk.ClientAuthentication.sasl({
                scram: true,
              }),
            }),
        ).toThrow(
          'To enable SASL/SCRAM or IAM authentication, you must only allow TLS-encrypted traffic between clients and brokers.',
        );
      });
    });

    describe('with sasl/iam auth', () => {
      test('iam enabled is true', () => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          kafkaVersion: msk.KafkaVersion.V2_6_1,
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.TLS,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            iam: true,
          }),
        });
        Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
          ClientAuthentication: {
            Sasl: { Iam: { Enabled: true } },
          },
        });
      });
      test('fails if tls encryption is set to plaintext', () => {
        expect(
          () =>
            new msk.Cluster(stack, 'Cluster', {
              clusterName: 'cluster',
              kafkaVersion: msk.KafkaVersion.V2_6_1,
              vpc,
              encryptionInTransit: {
                clientBroker: msk.ClientBrokerEncryption.PLAINTEXT,
              },
              clientAuthentication: msk.ClientAuthentication.sasl({
                iam: true,
              }),
            }),
        ).toThrow(
          'To enable client authentication, you must enabled TLS-encrypted traffic between clients and brokers.',
        );
      });

      test('fails if tls encryption is set to tls and plaintext', () => {
        expect(
          () =>
            new msk.Cluster(stack, 'Cluster', {
              clusterName: 'cluster',
              kafkaVersion: msk.KafkaVersion.V2_6_1,
              vpc,
              encryptionInTransit: {
                clientBroker: msk.ClientBrokerEncryption.TLS_PLAINTEXT,
              },
              clientAuthentication: msk.ClientAuthentication.sasl({
                iam: true,
              }),
            }),
        ).toThrow(
          'To enable SASL/SCRAM or IAM authentication, you must only allow TLS-encrypted traffic between clients and brokers.',
        );
      });
    });

    describe('with sasl/iam auth and tls', () => {
      test('Snapshot test with all values set (iam/sasl)', () => {
        const cluster = new msk.Cluster(stack, 'kafka', {
          clusterName: 'test-cluster',
          kafkaVersion: msk.KafkaVersion.V2_6_1,
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
          clientAuthentication: msk.ClientAuthentication.saslTls({
            iam: true,
            certificateAuthorities: [
              acmpca.CertificateAuthority.fromCertificateAuthorityArn(
                stack,
                'CertificateAuthority',
                'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
              ),
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
            firehoseDeliveryStreamName: 'a-delivery-stream',
          },
        });

        cluster.connections.allowFrom(
          ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg3', 'sg-3'),
          ec2.Port.tcp(2181),
        );

        // THEN
        expect(Template.fromStack(stack)).toMatchSnapshot();
      });
    });

    describe('creates a customer master key', () => {
      beforeEach(() => {
        new msk.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
          kafkaVersion: msk.KafkaVersion.V2_6_1,
          vpc,
          encryptionInTransit: {
            clientBroker: msk.ClientBrokerEncryption.TLS,
          },
          clientAuthentication: msk.ClientAuthentication.sasl({
            scram: true,
          }),
        });
      });

      test('with alias msk/${clusterName}/sasl/scram', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
          AliasName: 'alias/msk/cluster/sasl/scram',
        });
      });

      test('with a policy allowing the secrets manager service to use the key', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
          KeyPolicy: {
            'Statement': [
              {
                'Action': 'kms:*',
                'Effect': 'Allow',
                'Principal': {
                  'AWS': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          'Ref': 'AWS::Partition',
                        },
                        ':iam::',
                        {
                          'Ref': 'AWS::AccountId',
                        },
                        ':root',
                      ],
                    ],
                  },
                },
                'Resource': '*',
              },
              {
                'Action': [
                  'kms:Encrypt',
                  'kms:Decrypt',
                  'kms:ReEncrypt*',
                  'kms:GenerateDataKey*',
                  'kms:CreateGrant',
                  'kms:DescribeKey',
                ],
                'Condition': {
                  'StringEquals': {
                    'kms:ViaService': {
                      'Fn::Join': [
                        '',
                        [
                          'secretsmanager.',
                          {
                            'Ref': 'AWS::Region',
                          },
                          '.amazonaws.com',
                        ],
                      ],
                    },
                    'kms:CallerAccount': {
                      'Ref': 'AWS::AccountId',
                    },
                  },
                },
                Effect: 'Allow',
                Principal: { AWS: '*' },
                Resource: '*',
                Sid: 'Allow access through AWS Secrets Manager for all principals in the account that are authorized to use AWS Secrets Manager',
              },
            ],
            'Version': '2012-10-17',
          },
        });
      });
    });

    test('fails if more than one authentication method is enabled', () => {
      expect(
        () =>
          new msk.Cluster(stack, 'Cluster', {
            clusterName: 'cluster',
            kafkaVersion: msk.KafkaVersion.V2_6_1,
            vpc,
            encryptionInTransit: {
              clientBroker: msk.ClientBrokerEncryption.TLS,
            },
            clientAuthentication: msk.ClientAuthentication.sasl({
              iam: true,
              scram: true,
            }),
          }),
      ).toThrow('Only one client authentication method can be enabled.');
    });
  });

  describe('created with an instance type set', () => {
    test('prefixes instance type with "kafka"', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.M5,
          ec2.InstanceSize.XLARGE,
        ),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
        BrokerNodeGroupInfo: { InstanceType: 'kafka.m5.xlarge' },
      });
    });
  });

  test('prefixes instance type with "kafka"', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      kafkaVersion: msk.KafkaVersion.V2_6_1,
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M5,
        ec2.InstanceSize.XLARGE,
      ),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
      BrokerNodeGroupInfo: { InstanceType: 'kafka.m5.xlarge' },
    });
  });

  describe('created with logging enabled', () => {
    test('log group is set', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        logging: {
          cloudwatchLogGroup: new logs.LogGroup(stack, 'LogGroup'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
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
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        logging: {
          s3: { bucket: new s3.Bucket(stack, 'Bucket') },
        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
      Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
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

    test('feature flag @aws-cdk/aws-s3:defaultBucketPolicy', () => {
      const localStack = new core.Stack();
      localStack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
      new msk.Cluster(localStack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc: new ec2.Vpc(localStack, 'Vpc'),
        logging: {
          s3: { bucket: new s3.Bucket(localStack, 'Bucket') },
        },
      });

      Template.fromStack(localStack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  's3:x-amz-acl': 'bucket-owner-full-control',
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':logs:',
                        {
                          Ref: 'AWS::Region',
                        },
                        ':',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/AWSLogs/',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    '/*',
                  ],
                ],
              },
            },
            {
              Action: [
                's3:GetBucketAcl',
                's3:ListBucket',
              ],
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':logs:',
                        {
                          Ref: 'AWS::Region',
                        },
                        ':',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            },
          ],
        },
      });
    });

    test('firehose delivery stream is set', () => {
      new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        logging: {
          firehoseDeliveryStreamName: 'a-stream',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
        LoggingInfo: {
          BrokerLogs: {
            Firehose: {
              DeliveryStream: 'a-stream',
              Enabled: true,
            },
          },
        },
      });
    });
  });

  describe('ebs volume size is within bounds', () => {
    test('exceeds max', () => {
      expect(() => new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        ebsStorageInfo: { volumeSize: 16385 },
      })).toThrow(
        'EBS volume size should be in the range 1-16384',
      );
    });

    test('below minimum', () => {
      expect(() => new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        ebsStorageInfo: { volumeSize: 0 },
      })).toThrow(
        'EBS volume size should be in the range 1-16384',
      );
    });
  });

  test('create an encrypted cluster with a custom KMS key', () => {
    new msk.Cluster(stack, 'Cluster', {
      clusterName: 'cluster',
      kafkaVersion: msk.KafkaVersion.V2_6_1,
      vpc,
      ebsStorageInfo: { encryptionKey: new kms.Key(stack, 'Key') },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::MSK::Cluster', {
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
      kafkaVersion: msk.KafkaVersion.V2_6_1,
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
        certificateAuthorities: [
          acmpca.CertificateAuthority.fromCertificateAuthorityArn(
            stack,
            'CertificateAuthority',
            'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
          ),
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
        firehoseDeliveryStreamName: 'a-delivery-stream',
      },
    });

    cluster.connections.allowFrom(
      ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg3', 'sg-3'),
      ec2.Port.tcp(2181),
    );

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  describe('when creating sasl/scram users', () => {
    test('fails if sasl/scram not enabled', () => {
      const cluster = new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
      });

      expect(() => cluster.addUser('my-user')).toThrow(
        'Cannot create users if an authentication KMS key has not been created/provided.',
      );
    });

    test('creates a secret with the secret name prefixed with AmazonMSK_', () => {
      const cluster = new msk.Cluster(stack, 'Cluster', {
        clusterName: 'cluster',
        kafkaVersion: msk.KafkaVersion.V2_6_1,
        vpc,
        clientAuthentication: msk.ClientAuthentication.sasl({
          scram: true,
        }),
      });

      const username = 'my-user';
      cluster.addUser(username);

      Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        'Name': {
          'Fn::Join': [
            '',
            [
              'AmazonMSK_',
              {
                'Fn::Select': [
                  1,
                  {
                    'Fn::Split': [
                      '/',
                      {
                        'Ref': 'ClusterEB0386A7',
                      },
                    ],
                  },
                ],
              },
              '_my-user',
            ],
          ],
        },
      });
    });
  });
});

