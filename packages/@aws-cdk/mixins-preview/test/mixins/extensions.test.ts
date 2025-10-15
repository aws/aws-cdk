import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { wrap } from '../../lib/extensions';
import * as s3Mixins from '../../lib/services/aws-s3/mixins';

describe('Mixin Extensions', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('MixinWrapper', () => {
    test('can chain multiple mixins', () => {
      const bucket = wrap(new s3.CfnBucket(stack, 'Bucket'))
        .with(new s3Mixins.EnableVersioning())
        .with(new s3Mixins.AutoDeleteObjects())
        .unwrap() as s3.CfnBucket;

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
      expect(bucket.node.metadata.find(m => m.type === 'autoDeleteObjects')).toBeDefined();
    });

    test('unwrap returns the original construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const wrapped = wrap(bucket);

      expect(wrapped.unwrap()).toBe(bucket);
    });
  });
});
