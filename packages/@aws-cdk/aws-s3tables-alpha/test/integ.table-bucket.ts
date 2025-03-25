import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Snapshot test for table bucket with default parameters
 */
class DefaultTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'DefaultBucket', {
      tableBucketName: 'default-table-bucket',
      // we don't want to leave trash in the account after running the deployment of this
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

/**
 * Snapshot test for table bucket with optional parameters
 */
class OptionsTestStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'BucketWithOptions', {
      tableBucketName: 'table-bucket-with-options',
      account: props?.env?.account,
      region: props?.env?.region,
      unreferencedFileRemoval: {
        noncurrentDays: 20,
        status: s3tables.UnreferencedFileRemovalStatus.DISABLED,
        unreferencedDays: 20,
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3tables:*'],
      resources: ['*'],
      principals: [
        new iam.ServicePrincipal('s3.amazonaws.com'),
      ],
    });
    this.tableBucket.addToResourcePolicy(policy);
    this.tableBucket.grantRead(new iam.ServicePrincipal('s3.amazonaws.com'));
    this.tableBucket.grantWrite(new iam.ServicePrincipal('s3.amazonaws.com'));
    this.tableBucket.grantReadWrite(new iam.ServicePrincipal('s3.amazonaws.com'));
  }
}

const app = new core.App();

const defaultBucketTest = new DefaultTestStack(app, 'DefaultTestStack');
const bucketWithOptionsTest = new OptionsTestStack(app, 'OptionsTestStack');

new IntegTest(app, 'TableBucketIntegTest', {
  testCases: [defaultBucketTest, bucketWithOptionsTest],
});

app.synth();
