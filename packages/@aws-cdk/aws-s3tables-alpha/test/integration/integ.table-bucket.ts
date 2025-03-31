import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Snapshot test for table bucket with default parameters
 */
class DefaultTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'DefaultBucket', {
      tableBucketName: 'default-test-bucket',
      // we don't want to leave trash in the account after running the deployment of this
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

/**
 * Snapshot test for table bucket with optional parameters
 */
class UnreferencedFileRemovalTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'DefaultBucket', {
      tableBucketName: 'unreferenced-file-removal-test-bucket',
      unreferencedFileRemoval: {
        noncurrentDays: 20,
        status: s3tables.UnreferencedFileRemovalStatus.DISABLED,
        unreferencedDays: 20,
      },
      // we don't want to leave trash in the account after running the deployment of this
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const defaultBucketTest = new DefaultTestStack(app, 'DefaultTestStack');
const unreferencedFileRemovalTestStack = new UnreferencedFileRemovalTestStack(app, 'UnreferencedFileRemovalTestStack');

const integ = new IntegTest(app, 'TableBucketIntegTest', {
  testCases: [defaultBucketTest, unreferencedFileRemovalTestStack],
});

// Add assertions for unreferenced file removal
const maintenanceConfiguration = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketMaintenanceConfigurationCommand', {
  tableBucketARN: unreferencedFileRemovalTestStack.tableBucket.tableBucketArn,
});

maintenanceConfiguration.expect(ExpectedResult.objectLike({
  configuration: {
    icebergUnreferencedFileRemoval: {
      status: 'disabled',
      settings: {
        icebergUnreferencedFileRemoval: {
          nonCurrentDays: 20,
          unreferencedDays: 20,
        },
      },
    },
  },
  tableBucketARN: unreferencedFileRemovalTestStack.tableBucket.tableBucketArn,
}));

app.synth();
