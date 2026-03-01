import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import {
  Mixins,
  ConstructSelector,
} from 'aws-cdk-lib/core';
import * as s3Mixins from '../../lib/services/aws-s3/mixins';

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
      ConstructSelector.byId('*Prod*'),
    ).apply(new s3Mixins.AutoDeleteObjects());

    // Apply versioning to all S3 buckets
    Mixins.of(
      stack,
      ConstructSelector.resourcesOfType(s3.CfnBucket.CFN_RESOURCE_TYPE_NAME),
    ).apply(new s3Mixins.BucketVersioning());

    // Verify auto-delete only applied to prod bucket
    const template = Template.fromStack(stack);
    const resources = template.findResources('Custom::S3AutoDeleteObjects');
    expect(Object.keys(resources).length).toBe(1);
    expect(resources[Object.keys(resources)[0]].Properties.BucketName.Ref).toBe('ProdBucket');

    // Verify versioning applied to both buckets
    expect((prodBucket.versioningConfiguration as any)?.status).toBe('Enabled');
    expect((devBucket.versioningConfiguration as any)?.status).toBe('Enabled');
    expect((logGroup as any).versioningConfiguration).toBeUndefined();
  });

  test('chained mixin application', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket1');

    Mixins.of(bucket)
      .apply(new s3Mixins.AutoDeleteObjects())
      .apply(new s3Mixins.BucketVersioning());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
      BucketName: { Ref: 'Bucket1' },
    });
    expect((bucket.versioningConfiguration as any)?.status).toBe('Enabled');
  });
});
