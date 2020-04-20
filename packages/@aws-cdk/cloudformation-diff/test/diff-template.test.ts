import { diffTemplate, ResourceImpact } from '../lib/diff-template';

const POLICY_DOCUMENT = { foo: 'Bar' }; // Obviously a fake one!
const BUCKET_POLICY_RESOURCE = {
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    PolicyDocument: POLICY_DOCUMENT,
    Bucket: { Ref: 'BucketResource' },
  },
};

test('when there is no difference', () => {
  const bucketName = 'ShineyBucketName';
  const currentTemplate = {
    Resources: {
      BucketPolicyResource: BUCKET_POLICY_RESOURCE,
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
        },
      },
    },
  };
  // Making a JSON-clone, because === is cheating!
  const newTemplate = JSON.parse(JSON.stringify(currentTemplate));

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(0);
});

test('when a resource is created', () => {
  const currentTemplate = { Resources: {} };

  const newTemplate = { Resources: { BucketResource: { Type: 'AWS::S3::Bucket' } } };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.isAddition).toBeTruthy();
  expect(difference?.newResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.changeImpact).toBe(ResourceImpact.WILL_CREATE);
});

test('when a resource is deleted (no DeletionPolicy)', () => {
  const currentTemplate = {
    Resources: {
      BucketResource: { Type: 'AWS::S3::Bucket' },
      BucketPolicyResource: BUCKET_POLICY_RESOURCE,
    },
  };

  const newTemplate = {
    Resources: {
      BucketResource: { Type: 'AWS::S3::Bucket' },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketPolicyResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.isRemoval).toBeTruthy();
  expect(difference?.oldResourceType).toEqual('AWS::S3::BucketPolicy');
  expect(difference?.changeImpact).toBe(ResourceImpact.WILL_DESTROY);
});

test('when a resource is deleted (DeletionPolicy=Retain)', () => {
  const currentTemplate = {
    Resources: {
      BucketResource: { Type: 'AWS::S3::Bucket' },
      BucketPolicyResource: {
        Type: 'AWS::S3::BucketPolicy',
        DeletionPolicy: 'Retain',
        Properties: {
          PolicyDocument: POLICY_DOCUMENT,
          Bucket: { Ref: 'BucketResource' },
        },
      },
    },
  };

  const newTemplate = {
    Resources: { BucketResource: { Type: 'AWS::S3::Bucket' } },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketPolicyResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.isRemoval).toBeTruthy();
  expect(difference?.oldResourceType).toEqual('AWS::S3::BucketPolicy');
  expect(difference?.changeImpact).toBe(ResourceImpact.WILL_ORPHAN);
});

test('when a property changes', () => {
  const bucketName = 'ShineyBucketName';
  const currentTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
        },
      },
    },
  };

  const newBucketName = `${bucketName}-v2`;
  const newTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: newBucketName,
        },
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.oldResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.propertyUpdates).toEqual({
    BucketName: { oldValue: bucketName, newValue: newBucketName, changeImpact: ResourceImpact.WILL_REPLACE, isDifferent: true },
  });
});

test('change in dependencies counts as a simple update', () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource'],
      },
    },
  };

  // WHEN
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource', 'SomeOtherResource'],
      },
    },
  };
  const differences = diffTemplate(currentTemplate, newTemplate);

  // THEN
  expect(differences.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference?.changeImpact).toBe(ResourceImpact.WILL_UPDATE);
});

test('when a property is deleted', () => {
  const bucketName = 'ShineyBucketName';
  const currentTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
        },
      },
    },
  };

  const newTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.oldResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.propertyUpdates).toEqual({
    BucketName: { oldValue: bucketName, newValue: undefined, changeImpact: ResourceImpact.WILL_REPLACE, isDifferent: true },
  });
});

test('when a property is added', () => {
  const bucketName = 'ShineyBucketName';
  const currentTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
      },
    },
  };

  const newTemplate = {
    Resources: {
      QueueResource: {
        Type: 'AWS::SQS::Queue',
      },
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
        },
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.oldResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.propertyUpdates).toEqual({
    BucketName: { oldValue: undefined, newValue: bucketName, changeImpact: ResourceImpact.WILL_REPLACE, isDifferent: true },
  });
});

test('when a resource type changed', () => {
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::IAM::Policy',
        Properties: {
          PolicyName: 'PolicyName',
        },
      },
    },
  };

  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'BucketName',
        },
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBe(undefined);
  expect(difference?.oldResourceType).toEqual('AWS::IAM::Policy');
  expect(difference?.newResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.changeImpact).toBe(ResourceImpact.WILL_REPLACE);
});

test('resource replacement is tracked through references', () => {
  // If a resource is replaced, then that change shows that references are
  // going to change. This may lead to replacement of downstream resources
  // if the reference is used in an immutable property, and so on.

  // GIVEN
  const currentTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: { BucketName: 'Name1' }, // Immutable prop
      },
      Queue: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: { Ref: 'Bucket' }}, // Immutable prop
      },
      Topic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: { Ref: 'Queue' }}, // Immutable prop
      },
    },
  };

  // WHEN
  const newTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: { BucketName: 'Name2' },
      },
      Queue: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: { Ref: 'Bucket' }},
      },
      Topic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: { Ref: 'Queue' }},
      },
    },
  };
  const differences = diffTemplate(currentTemplate, newTemplate);

  // THEN
  expect(differences.resources.differenceCount).toBe(3);
});
