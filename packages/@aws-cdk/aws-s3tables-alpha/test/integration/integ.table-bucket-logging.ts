import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test stack for a table bucket that delivers server access logs to a general purpose bucket
 */
class TableBucketLoggingTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const logBucket = new s3.Bucket(this, 'LogBucket', {
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.tableBucket = new s3tables.TableBucket(this, 'LoggedTableBucket', {
      tableBucketName: 'logging-integ-test',
      loggingConfiguration: {
        targetBucket: logBucket,
        targetPrefix: 'logs/',
        targetObjectKeyFormat: s3tables.TargetObjectKeyFormat.partitionedPrefix(s3tables.PartitionDateSource.DELIVERY_TIME),
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const loggingStack = new TableBucketLoggingTestStack(app, 'TableBucketLoggingTestStack');

new IntegTest(app, 'TableBucketLoggingIntegTest', {
  testCases: [loggingStack],
});

app.synth();
