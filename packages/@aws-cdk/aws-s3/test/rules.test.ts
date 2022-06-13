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

  test('Noncurrent transistion rule with versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain available
    new Bucket(stack, 'Bucket1', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
        noncurrentVersionTransitions: [
          {
            storageClass: StorageClass.GLACIER_INSTANT_RETRIEVAL,
            transitionAfter: Duration.days(10),
            noncurrentVersionsToRetain: 1,
          },
        ],
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          NoncurrentVersionExpiration: {
            NoncurrentDays: 10,
          },
          NoncurrentVersionTransitions: [
            {
              NewerNoncurrentVersions: 1,
              StorageClass: 'GLACIER_IR',
              TransitionInDays: 10,
            },
          ],
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Noncurrent transistion rule without versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain not set
    new Bucket(stack, 'Bucket1', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
        noncurrentVersionTransitions: [
          {
            storageClass: StorageClass.GLACIER_INSTANT_RETRIEVAL,
            transitionAfter: Duration.days(10),
          },
        ],
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          NoncurrentVersionExpiration: {
            NoncurrentDays: 10,
          },
          NoncurrentVersionTransitions: [
            {
              StorageClass: 'GLACIER_IR',
              TransitionInDays: 10,
            },
          ],
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Noncurrent expiration rule with versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain available
    new Bucket(stack, 'Bucket1', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
        noncurrentVersionsToRetain: 1,
        noncurrentVersionTransitions: [
          {
            storageClass: StorageClass.GLACIER_INSTANT_RETRIEVAL,
            transitionAfter: Duration.days(10),
          },
        ],
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          NoncurrentVersionExpiration: {
            NoncurrentDays: 10,
            NewerNoncurrentVersions: 1,
          },
          NoncurrentVersionTransitions: [
            {
              StorageClass: 'GLACIER_IR',
              TransitionInDays: 10,
            },
          ],
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Noncurrent expiration rule without versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain not set
    new Bucket(stack, 'Bucket1', {
      versioned: true,
      lifecycleRules: [{
        noncurrentVersionExpiration: Duration.days(10),
        noncurrentVersionTransitions: [
          {
            storageClass: StorageClass.GLACIER_INSTANT_RETRIEVAL,
            transitionAfter: Duration.days(10),
          },
        ],
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          NoncurrentVersionExpiration: {
            NoncurrentDays: 10,
          },
          NoncurrentVersionTransitions: [
            {
              StorageClass: 'GLACIER_IR',
              TransitionInDays: 10,
            },
          ],
          Status: 'Enabled',
        }],
      },
    });
  });

  test('Bucket with object size rules', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        objectSizeLessThan: 0,
        objectSizeGreaterThan: 0,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ObjectSizeLessThan: 0,
          ObjectSizeGreaterThan: 0,
          Status: 'Enabled',
        }],
      },
    });
  });
});
