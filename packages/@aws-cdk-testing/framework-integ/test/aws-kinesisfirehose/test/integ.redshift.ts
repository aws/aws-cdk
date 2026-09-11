#!/usr/bin/env node
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-redshift');

const intermediateBucket = new s3.Bucket(stack, 'IntermediateBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// A secret holding the Redshift `username` and `password`. Firehose retrieves it at runtime.
const secret = new Secret(stack, 'RedshiftSecret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: 'firehose' }),
    generateStringKey: 'password',
    excludeCharacters: '"@/\\',
  },
});

new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.RedshiftDestination(intermediateBucket, {
    clusterJdbcUrl: 'jdbc:redshift://cluster.abc123.us-east-1.redshift.amazonaws.com:5439/dev',
    copyCommand: {
      tableName: 'firehose_test_table',
      copyOptions: "json 'auto'",
    },
    secret,
    retryDuration: cdk.Duration.minutes(30),
    s3Backup: {
      mode: firehose.BackupMode.ALL,
    },
  }),
});

new IntegTest(app, 'integ-tests', {
  testCases: [stack],
  regions: ['us-east-1'],
});
