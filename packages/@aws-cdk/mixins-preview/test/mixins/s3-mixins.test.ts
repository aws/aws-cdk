import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AutoDeleteObjects, EnableVersioning } from '../../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('S3 Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('AutoDeleteObjects', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new AutoDeleteObjects();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      expect(bucket.node.metadata.find(m => m.type === 'autoDeleteObjects')).toBeDefined();
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new AutoDeleteObjects();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('EnableVersioning', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new EnableVersioning();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new EnableVersioning();

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
