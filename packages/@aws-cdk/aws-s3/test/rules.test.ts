import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Duration, Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { Bucket, StorageClass } from '../lib';

nodeunitShim({
  'Bucket with expiration days'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(30),
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationInDays: 30,
          Status: 'Enabled',
        }],
      },
    }));

    test.done();
  },

  'Can use addLifecycleRule() to add a lifecycle rule'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addLifecycleRule({
      expiration: Duration.days(30),
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationInDays: 30,
          Status: 'Enabled',
        }],
      },
    }));

    test.done();
  },

  'Bucket with expiration date'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expirationDate: new Date('2018-01-01'),
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationDate: '2018-01-01T00:00:00',
          Status: 'Enabled',
        }],
      },
    }));

    test.done();
  },

  'Bucket with transition rule'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        transitions: [{
          storageClass: StorageClass.GLACIER,
          transitionAfter: Duration.days(30),
        }],
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          Transitions: [{
            StorageClass: 'GLACIER',
            TransitionInDays: 30,
          }],
          Status: 'Enabled',
        }],
      },
    }));

    test.done();
  },

  'Noncurrent rule on nonversioned bucket fails'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN: Fail because of lack of versioning
    test.throws(() => {
      new Bucket(stack, 'Bucket1', {
        lifecycleRules: [{
          noncurrentVersionExpiration: Duration.days(10),
        }],
      });
    });

    // WHEN: Succeeds because versioning is enabled
    new Bucket(stack, 'Bucket2', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
      }],
    });

    test.done();
  },
});
