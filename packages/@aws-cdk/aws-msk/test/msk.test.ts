import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import {
  Cluster,
  ClientBrokerEncryption,
  ClusterMonitoringLevel,
  KafkaVersion,
} from '../lib';

test('Snapshot test with all values set', () => {
  const stack = testStack();
  const vpc = ec2.Vpc.fromLookup(stack, 'vpc', { isDefault: true });

  const cluster = new Cluster(stack, 'kafka', {
    clusterName: 'test-cluster',
    kafkaVersion: KafkaVersion.of('2.4.1'),
    brokerNodeGroupProps: {
      vpc,
      securityGroups: [
        ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg1', 'sg-123'),
        ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg2', 'sg-456'),
      ],
      storageInfo: {
        ebsStorageInfo: {
          volumeSize: 100,
          kmsKey: kms.Key.fromKeyArn(
            stack,
            'kms',
            'arn:aws:kms:us-east-1:111122223333:key/1234abc',
          ),
        },
      },
    },
    encryptionInTransitConfig: {
      clientBroker: ClientBrokerEncryption.TLS,
      certificateAuthorityArns: [
        'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
      ],
    },
    monitoringConfiguration: {
      enableJmxExporter: true,
      enablePrometheusNodeExporter: true,
      clusterMonitoringLevel: ClusterMonitoringLevel.PER_TOPIC_PER_BROKER,
    },
    brokerLoggingConfiguration: {
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

function testStack() {
  const stack = new core.Stack(undefined, undefined, {
    env: { account: '1234567890', region: 'us-west-2' },
  });

  stack.node.setContext('availability-zones:1234567890:us-west-2', [
    'us-west-2a',
    'us-west-2b',
  ]);
  return stack;
}
