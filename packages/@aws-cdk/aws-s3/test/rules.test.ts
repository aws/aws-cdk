import { Template } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
import { Bucket, StorageClass } from '../lib';

describe('rules', () => {
  test('Bucket with expiration days', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(30),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationInDays: 30,
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Can use addLifecycleRule() to add a lifecycle rule', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addLifecycleRule({
      expiration: Duration.days(30),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationInDays: 30,
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Bucket with expiration date', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expirationDate: new Date('2018-01-01'),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpirationDate: '2018-01-01T00:00:00',
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Bucket with transition rule', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          Transitions: [{
            StorageClass: 'GLACIER',
            TransitionInDays: 30,
          }],
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Noncurrent rule on nonversioned bucket fails', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Fail because of lack of versioning
    expect(() => {
      new Bucket(stack, 'Bucket1', {
        lifecycleRules: [{
          noncurrentVersionExpiration: Duration.days(10),
        }],
      });
    }).toThrow();

    // WHEN: Succeeds because versioning is enabled
    new Bucket(stack, 'Bucket2', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
      }],
    });
  });

  test('Bucket with expiredObjectDeleteMarker', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expiredObjectDeleteMarker: true,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ExpiredObjectDeleteMarker: true,
          Status: 'Enabled',
        }],
      },
    });
  });
});
