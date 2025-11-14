import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
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
        .with(new s3Mixins.EnableVersioning())
        .with(new s3Mixins.AutoDeleteObjects());

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
    });

    test('returns the same construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const result = bucket.with(new s3Mixins.EnableVersioning());

      expect(result).toBe(bucket);
    });

    test('throws when mixin does not support construct', () => {
      const topic = new sns.Topic(stack, 'Topic');

      expect(() => {
        topic.with(new s3Mixins.EnableVersioning());
      }).toThrow();
    });
  });
});
