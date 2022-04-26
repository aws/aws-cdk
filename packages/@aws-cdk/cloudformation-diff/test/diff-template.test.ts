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
        Properties: { QueueName: { Ref: 'Bucket' } }, // Immutable prop
      },
      Topic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: { Ref: 'Queue' } }, // Immutable prop
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
        Properties: { QueueName: { Ref: 'Bucket' } },
      },
      Topic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: { Ref: 'Queue' } },
      },
    },
  };
  const differences = diffTemplate(currentTemplate, newTemplate);

  // THEN
  expect(differences.resources.differenceCount).toBe(3);
});

test('adding and removing quotes from a numeric property causes no changes', () => {
  const currentTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: [
                  'GET',
                ],
                AllowedOrigins: [
                  '*',
                ],
                MaxAge: 10,
              },
            ],
          },
        },
      },
    },
  };

  const newTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: [
                  'GET',
                ],
                AllowedOrigins: [
                  '*',
                ],
                MaxAge: '10',
              },
            ],
          },
        },
      },
    },
  };
  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(0);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(0);
});

test('versions are correctly detected as not numbers', () => {
  const currentTemplate = {
    Resources: {
      ImageBuilderComponent: {
        Type: 'AWS::ImageBuilder::Component',
        Properties: {
          Platform: 'Linux',
          Version: '0.0.1',
        },
      },
    },
  };
  const newTemplate = {
    Resources: {
      ImageBuilderComponent: {
        Type: 'AWS::ImageBuilder::Component',
        Properties: {
          Platform: 'Linux',
          Version: '0.0.2',
        },
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(1);
});

test('single element arrays are equivalent to the single element in DependsOn expressions', () => {
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
        DependsOn: 'SomeResource',
      },
    },
  };

  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(0);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(0);
});

test('array equivalence is independent of element order in DependsOn expressions', () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource', 'AnotherResource'],
      },
    },
  };

  // WHEN
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['AnotherResource', 'SomeResource'],
      },
    },
  };

  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(0);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(0);
});

test('arrays of different length are considered unequal in DependsOn expressions', () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource', 'AnotherResource', 'LastResource'],
      },
    },
  };

  // WHEN
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['AnotherResource', 'SomeResource'],
      },
    },
  };

  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(1);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(1);
});

test('arrays that differ only in element order are considered unequal outside of DependsOn expressions', () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        BucketName: { 'Fn::Select': [0, ['name1', 'name2']] },
      },
    },
  };

  // WHEN
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        BucketName: { 'Fn::Select': [0, ['name2', 'name1']] },
      },
    },
  };

  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(1);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(1);
});

test('boolean properties are considered equal with their stringified counterparts', () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: 'true',
          },
        },
      },
    },
  };
  const newTemplate = {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
          },
        },
      },
    },
  };

  // WHEN
  const differences = diffTemplate(currentTemplate, newTemplate);

  // THEN
  expect(differences.differenceCount).toBe(0);
});

test('when a property changes including equivalent DependsOn', () => {
  // GIVEN
  const bucketName = 'ShineyBucketName';
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource'],
        BucketName: bucketName,
      },
    },
  };

  // WHEN
  const newBucketName = `${bucketName}-v2`;
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['SomeResource'],
        BucketName: newBucketName,
      },
    },
  };

  // THEN
  let differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.resources.differenceCount).toBe(1);

  differences = diffTemplate(newTemplate, currentTemplate);
  expect(differences.resources.differenceCount).toBe(1);
});

test.each([
  ['0.31.1-prod', '0.31.2-prod'],
  ['8.0.5.5.4-identifier', '8.0.5.5.5-identifier'],
  ['1.1.1.1', '1.1.1.2'],
  ['1.2.3', '1.2.4'],
  ['2.2.2.2', '2.2.3.2'],
  ['3.3.3.3', '3.4.3.3'],
  ['2021-10-23T06:07:08.000Z', '2021-10-23T09:10:11.123Z'],
])("reports a change when a string property with a number-like format changes from '%s' to '%s'", (oldValue, newValue) => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          Tags: [oldValue],
        },
      },
    },
  };
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          Tags: [newValue],
        },
      },
    },
  };
  // WHEN
  const differences = diffTemplate(currentTemplate, newTemplate);

  // THEN
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).not.toBeUndefined();
  expect(difference?.oldResourceType).toEqual('AWS::S3::Bucket');
  expect(difference?.propertyUpdates).toEqual({
    Tags: { oldValue: [oldValue], newValue: [newValue], changeImpact: ResourceImpact.WILL_UPDATE, isDifferent: true },
  });
});

test('when a property with a number-like format doesn\'t change', () => {
  const tags = ['0.31.1-prod', '8.0.5.5.4-identifier', '1.1.1.1', '1.2.3'];
  const currentTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          Tags: tags,
        },
      },
    },
  };
  const newTemplate = {
    Resources: {
      BucketResource: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          Tags: tags,
        },
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(0);
  expect(differences.resources.differenceCount).toBe(0);
  const difference = differences.resources.changes.BucketResource;
  expect(difference).toBeUndefined();
});

test('handles a resource changing its Type', () => {
  const currentTemplate = {
    Resources: {
      FunctionApi: {
        Type: 'AWS::Serverless::Api',
        Properties: {
          StageName: 'prod',
        },
      },
    },
  };
  const newTemplate = {
    Resources: {
      FunctionApi: {
        Type: 'AWS::ApiGateway::RestApi',
      },
    },
  };

  const differences = diffTemplate(currentTemplate, newTemplate);
  expect(differences.differenceCount).toBe(1);
  expect(differences.resources.differenceCount).toBe(1);
  const difference = differences.resources.changes.FunctionApi;
  expect(difference).toEqual({
    isAddition: false,
    isRemoval: false,
    newValue: { Type: 'AWS::ApiGateway::RestApi' },
    oldValue: { Properties: { StageName: 'prod' }, Type: 'AWS::Serverless::Api' },
    otherDiffs: {},
    propertyDiffs: {},
    resourceTypes: { newType: 'AWS::ApiGateway::RestApi', oldType: 'AWS::Serverless::Api' },
  });
});
