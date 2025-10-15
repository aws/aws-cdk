import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import {
  Mixins,
  ConstructSelector,
} from '../lib/core';
import {
  EncryptionAtRest,
  EnableVersioning,
} from '../lib/mixins';

describe('Integration Tests', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('selective application with multiple selectors', () => {
    const prodBucket = new s3.CfnBucket(stack, 'ProdBucket');
    const devBucket = new s3.CfnBucket(stack, 'DevBucket');
    const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');

    // Apply encryption only to production buckets
    Mixins.of(
      stack,
      ConstructSelector.byId(/.*Prod.*/),
    ).apply(new EncryptionAtRest());

    // Apply versioning to all S3 buckets
    Mixins.of(
      stack,
      ConstructSelector.resourcesOfType(s3.CfnBucket),
    ).apply(new EnableVersioning());

    // Verify encryption only applied to prod bucket
    expect(prodBucket.bucketEncryption).toBeDefined();
    expect(devBucket.bucketEncryption).toBeUndefined();
    expect((logGroup as any).kmsKeyId).toBeUndefined();

    // Verify versioning applied to both buckets
    expect((prodBucket.versioningConfiguration as any)?.status).toBe('Enabled');
    expect((devBucket.versioningConfiguration as any)?.status).toBe('Enabled');
    expect((logGroup as any).versioningConfiguration).toBeUndefined();
  });

  test('chained mixin application', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket1');

    Mixins.of(bucket)
      .apply(new EncryptionAtRest())
      .apply(new EnableVersioning());

    expect(bucket.bucketEncryption).toBeDefined();
    expect((bucket.versioningConfiguration as any)?.status).toBe('Enabled');
  });
});
