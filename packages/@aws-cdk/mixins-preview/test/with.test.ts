import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import '../lib/with';
import * as s3Mixins from '../lib/services/aws-s3/mixins';

describe('Mixin Extensions', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('.with() method', () => {
    test('can chain multiple mixins', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket')
        .with(new s3Mixins.BucketVersioning())
        .with(new s3Mixins.AutoDeleteObjects());

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
    });

    test('can apply multiple mixins', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket')
        .with(new s3Mixins.BucketVersioning(), new s3Mixins.AutoDeleteObjects());

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
    });

    test('returns the same construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const result = bucket.with(new s3Mixins.BucketVersioning());

      expect(result).toBe(bucket);
    });
  });
});
