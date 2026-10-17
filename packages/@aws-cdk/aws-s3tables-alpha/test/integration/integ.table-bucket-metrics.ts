import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test stack for table bucket with request metrics enabled
 */
class MetricsEnabledTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'MetricsEnabledBucket', {
      tableBucketName: 'metrics-enabled-test-bucket',
      requestMetricsStatus: s3tables.RequestMetricsStatus.ENABLED,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const metricsEnabledTestStack = new MetricsEnabledTestStack(app, 'MetricsEnabledTestStack');

new IntegTest(app, 'TableBucketMetricsIntegTest', {
  testCases: [metricsEnabledTestStack],
});

// Note: GetTableBucketMetricsConfigurationCommand is not yet available in the SDK
// The deployment itself verifies the MetricsConfiguration property works

app.synth();
