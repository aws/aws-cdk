import 'source-map-support/register';

import { Test } from 'nodeunit';
import { diffTemplate, ResourceImpact } from '../lib/diff-template';

const POLICY_DOCUMENT = { foo: 'Bar' }; // Obviously a fake one!
const BUCKET_POLICY_RESOURCE = {
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    PolicyDocument: POLICY_DOCUMENT,
    Bucket: { Ref: 'BucketResource' }
  }
};

exports.diffTemplate = {
  'when there is no difference': (test: Test) => {
    const bucketName = 'ShineyBucketName';
    const currentTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: bucketName
          }
        }
      }
    };
    // Making a JSON-clone, because === is cheating!
    const newTemplate = JSON.parse(JSON.stringify(currentTemplate));

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.deepEqual(differences.count, 0, 'returns an empty diff');
    test.done();
  },

  'when a resource is created': (test: Test) => {
    const currentTemplate = { Resources: {} };

    const newTemplate = { Resources: { BucketResource: { Type: 'AWS::S3::Bucket' } } };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketResource logical ID');
    test.ok(difference && difference.isAddition, 'the difference reflects there was no such resource before');
    test.deepEqual(difference && difference.resourceType, 'AWS::S3::Bucket', 'the difference reports the resource type');
    test.equal(difference && difference.changeImpact, ResourceImpact.WILL_CREATE, 'the difference reflects that a new resource will be created');
    test.done();
  },

  'when a resource is deleted (no DeletionPolicy)': (test: Test) => {
    const currentTemplate = {
      Resources: {
        BucketResource: { Type: 'AWS::S3::Bucket' },
        BucketPolicyResource: BUCKET_POLICY_RESOURCE
      }
    };

    const newTemplate = {
      Resources: {
        BucketResource: { Type: 'AWS::S3::Bucket' }
      }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketPolicyResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketPolicyResource logical ID');
    test.ok(difference && difference.isRemoval, 'the difference reflects there is no such resource after');
    test.deepEqual(difference && difference.resourceType, 'AWS::S3::BucketPolicy', 'the difference reports the resource type');
    test.equal(difference && difference.changeImpact, ResourceImpact.WILL_DESTROY, 'the difference reflects that the resource will be deleted');
    test.done();
  },

  'when a resource is deleted (DeletionPolicy=Retain)': (test: Test) => {
    const currentTemplate = {
      Resources: {
        BucketResource: { Type: 'AWS::S3::Bucket' },
        BucketPolicyResource: {
          Type: 'AWS::S3::BucketPolicy',
          DeletionPolicy: 'Retain',
          Properties: {
            PolicyDocument: POLICY_DOCUMENT,
            Bucket: { Ref: 'BucketResource' }
          }
        }
      }
    };

    const newTemplate = {
      Resources: { BucketResource: { Type: 'AWS::S3::Bucket' } }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketPolicyResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketPolicyResource logical ID');
    test.ok(difference && difference.isRemoval, 'the difference reflects there is no such resource after');
    test.deepEqual(difference && difference.resourceType, 'AWS::S3::BucketPolicy', 'the difference reports the resource type');
    test.equal(difference && difference.changeImpact, ResourceImpact.WILL_ORPHAN, 'the difference reflects that the resource will be orphaned');
    test.done();
  },

  'when a property changes': (test: Test) => {
    const bucketName = 'ShineyBucketName';
    const currentTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: bucketName
          }
        }
      }
    };

    const newBucketName = `${bucketName}-v2`;
    const newTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: newBucketName
          }
        }
      }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketResource logical ID');
    test.equal(difference && difference.resourceType, 'AWS::S3::Bucket', 'the difference reports the resource type');
    test.deepEqual(difference && difference.propertyChanges,
             { BucketName: { oldValue: bucketName, newValue: newBucketName, changeImpact: ResourceImpact.WILL_REPLACE } },
             'the difference reports property-level changes');
    test.done();
  },

  'when a property is deleted': (test: Test) => {
    const bucketName = 'ShineyBucketName';
    const currentTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: bucketName
          }
        }
      }
    };

    const newTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket'
        }
      }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketResource logical ID');
    test.equal(difference && difference.resourceType, 'AWS::S3::Bucket', 'the difference reports the resource type');
    test.deepEqual(difference && difference.propertyChanges,
             { BucketName: { oldValue: bucketName, newValue: undefined, changeImpact: ResourceImpact.WILL_REPLACE } },
             'the difference reports property-level changes');
    test.done();
  },

  'when a property is added': (test: Test) => {
    const bucketName = 'ShineyBucketName';
    const currentTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket'
        }
      }
    };

    const newTemplate = {
      Resources: {
        BucketPolicyResource: BUCKET_POLICY_RESOURCE,
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: bucketName
          }
        }
      }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketResource logical ID');
    test.equal(difference && difference.resourceType, 'AWS::S3::Bucket', 'the difference reports the resource type');
    test.deepEqual(difference && difference.propertyChanges,
             { BucketName: { oldValue: undefined, newValue: bucketName, changeImpact: ResourceImpact.WILL_REPLACE } },
             'the difference reports property-level changes');
    test.done();
  },

  'when a resource type changed': (test: Test) => {
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyName: 'PolicyName'
          }
        }
      }
    };

    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: 'BucketName'
          }
        }
      }
    };

    const differences = diffTemplate(currentTemplate, newTemplate);
    test.equal(differences.count, 1, 'returns a single difference');
    test.equal(differences.resources.count, 1, 'the difference is in the Resources section');
    const difference = differences.resources.changes.BucketResource;
    test.notStrictEqual(difference, undefined, 'the difference is on the BucketResource logical ID');
    test.deepEqual(difference && difference.resourceType,
             { oldType: 'AWS::IAM::Policy', newType: 'AWS::S3::Bucket' },
             'the difference reflects the type change');
    test.equal(difference && difference.changeImpact, ResourceImpact.WILL_REPLACE, 'the difference reflects that the resource will be replaced');
    test.done();
  }
};
