import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnPropertiesMixin } from '../../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('Generic Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('CfnPropertiesMixin', () => {
    test('applies arbitrary properties', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new CfnPropertiesMixin({
        customProperty: 'customValue',
      });

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      expect((bucket as any).customProperty).toBe('customValue');
    });

    test('does not support non-CfnResource constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new CfnPropertiesMixin({});

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
