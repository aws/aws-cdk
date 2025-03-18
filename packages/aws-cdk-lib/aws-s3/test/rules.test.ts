import { Template } from '../../assertions';
import { App, Duration, Stack } from '../../core';
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

  test('ExpiredObjectDeleteMarker cannot be specified with ExpirationInDays.', () => {
    const stack = new Stack();
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(30),
        expiredObjectDeleteMarker: true,
      }],
    });

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow('ExpiredObjectDeleteMarker cannot be specified with expiration, ExpirationDate, or TagFilters.');
  });

  test('ExpiredObjectDeleteMarker cannot be specified with ExpirationDate.', () => {
    const stack = new Stack();
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        expirationDate: new Date('2018-01-01'),
        expiredObjectDeleteMarker: true,
      }],
    });

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow('ExpiredObjectDeleteMarker cannot be specified with expiration, ExpirationDate, or TagFilters.');
  });

  test('ExpiredObjectDeleteMarker cannot be specified with TagFilters.', () => {
    const stack = new Stack();
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        tagFilters: [
          { Key: 'tagname1', Value: 'tagvalue1' },
          { Key: 'tagname2', Value: 'tagvalue2' },
        ],
        expiredObjectDeleteMarker: true,
      }],
    });

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow('ExpiredObjectDeleteMarker cannot be specified with expiration, ExpirationDate, or TagFilters.');
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
          ExpirationDate: '2018-01-01T00:00:00Z',
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

  test('Noncurrent transition rule with versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain available
    new Bucket(stack, 'Bucket1', {
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

  test('Noncurrent transition rule without versions to retain', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN: Noncurrent version to retain not set
    new Bucket(stack, 'Bucket1', {
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
        expiration: Duration.days(30),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: [{
          ObjectSizeLessThan: 0,
          ObjectSizeGreaterThan: 0,
          ExpirationInDays: 30,
          Status: 'Enabled',
        }],
      },
    });
  });

  test('throws when neither transitionDate nor transitionAfter is specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        transitions: [{
          storageClass: StorageClass.GLACIER,
        }],
      }],
    });

    // THEN
    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow('Exactly one of transitionDate or transitionAfter must be specified in lifecycle rule transition');
  });

  test('throws when both transitionDate and transitionAfter are specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      lifecycleRules: [{
        transitions: [{
          storageClass: StorageClass.GLACIER,
          transitionDate: new Date('2023-01-01'),
          transitionAfter: Duration.days(30),
        }],
      }],
    });

    // THEN
    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow('Exactly one of transitionDate or transitionAfter must be specified in lifecycle rule transition');
  });

  describe('required properties for rules', () => {
    test('throw if there is a rule doesn\'t have required properties', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            objectSizeLessThan: 300000,
            objectSizeGreaterThan: 200000,
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/All rules for `lifecycleRules` must have at least one of the following properties: `abortIncompleteMultipartUploadAfter`, `expiration`, `expirationDate`, `expiredObjectDeleteMarker`, `noncurrentVersionExpiration`, `noncurrentVersionsToRetain`, `noncurrentVersionTransitions`, or `transitions`/);
    });

    test('throw if there are a valid rule and a rule that doesn\'t have required properties.', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            abortIncompleteMultipartUploadAfter: Duration.days(365),
          },
          {
            objectSizeLessThan: 300000,
            objectSizeGreaterThan: 200000,
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/All rules for `lifecycleRules` must have at least one of the following properties: `abortIncompleteMultipartUploadAfter`, `expiration`, `expirationDate`, `expiredObjectDeleteMarker`, `noncurrentVersionExpiration`, `noncurrentVersionsToRetain`, `noncurrentVersionTransitions`, or `transitions`/);
    });

    test('don\'t throw with abortIncompleteMultipartUploadAfter', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            abortIncompleteMultipartUploadAfter: Duration.days(365),
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with expiration', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            expiration: Duration.days(365),
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with expirationDate', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            expirationDate: new Date('2024-01-01'),
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with expiredObjectDeleteMarker', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            expiredObjectDeleteMarker: true,
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with noncurrentVersionExpiration', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            noncurrentVersionExpiration: Duration.days(365),
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with noncurrentVersionsToRetain', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            noncurrentVersionsToRetain: 10,
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with noncurrentVersionTransitions', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            noncurrentVersionTransitions: [
              {
                storageClass: StorageClass.GLACIER_INSTANT_RETRIEVAL,
                transitionAfter: Duration.days(10),
                noncurrentVersionsToRetain: 1,
              },
            ],
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });

    test('don\'t throw with transitions', () => {
      const stack = new Stack();
      new Bucket(stack, 'MyBucket', {
        lifecycleRules: [
          {
            transitions: [{
              storageClass: StorageClass.GLACIER,
              transitionAfter: Duration.days(30),
            }],
          },
        ],
      });
      expect(() => {
        Template.fromStack(stack);
      }).not.toThrow();
    });
  });
});
