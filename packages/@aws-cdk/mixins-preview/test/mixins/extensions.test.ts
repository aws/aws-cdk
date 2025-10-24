import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  EnableVersioning,
  EncryptionAtRest,
  AutoDeleteObjects,
  withMixin,
  wrap,
} from '../../lib/mixins';

describe('Mixin Extensions', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('withMixin() helper', () => {
    test('works with CfnResource', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const result = withMixin(bucket, new EnableVersioning());

      expect(result).toBe(bucket);
      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
    });
  });

  describe('MixinWrapper', () => {
    test('can chain multiple mixins', () => {
      const bucket = wrap(new s3.CfnBucket(stack, 'Bucket'))
        .with(new EnableVersioning())
        .with(new EncryptionAtRest())
        .with(new AutoDeleteObjects())
        .unwrap() as s3.CfnBucket;

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
      expect(bucket.bucketEncryption).toBeDefined();
      expect(bucket.node.metadata.find(m => m.type === 'autoDeleteObjects')).toBeDefined();
    });

    test('unwrap returns the original construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const wrapped = wrap(bucket);

      expect(wrapped.unwrap()).toBe(bucket);
    });
  });
});
