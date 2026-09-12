import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';
import { singletonOrArr as stringIfSingle } from './test-utils';
import * as perms from '../lib/permissions';

/* eslint-disable @stylistic/quote-props */

const VECTOR_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucketPolicy';
const KMS_KEY_CFN_RESOURCE = 'AWS::KMS::Key';
const INDEX_NAME = 'example-index';
const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';
const VECTOR_BUCKET_NAME = 'example-vector-bucket';
const PRINCIPAL = 'lambda.amazonaws.com';
const INDEX_ARN_REF = { 'Fn::GetAtt': ['ExampleVectorIndex0BD96B3F', 'IndexArn'] };

describe('VectorIndex grants', () => {
  let stack: core.Stack;
  let vectorIndex: s3vectors.VectorIndex;
  let role: iam.Role;
  let importedRole: iam.IRole;
  let user: iam.User;
  let userKey: kms.IKey;

  beforeEach(() => {
    stack = new core.Stack();
    role = new iam.Role(stack, 'TestRole', { assumedBy: new iam.ServicePrincipal('sample') });
    user = new iam.User(stack, 'TestUser');
    importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', EXISTING_ROLE_ARN);
  });

  const grantTests = ({ withKMS, keyName }: { withKMS: boolean; keyName?: string }) => {
    enum GrantType { READ = 'read', WRITE = 'write', READ_WRITE = 'read & write' }

    const grantPermissions = (idx: s3vectors.VectorIndex, grantType: GrantType, principal: iam.IGrantable) => {
      switch (grantType) {
        case GrantType.READ:
          idx.grantRead(principal);
          return;
        case GrantType.WRITE:
          idx.grantWrite(principal);
          return;
        case GrantType.READ_WRITE:
          idx.grantReadWrite(principal);
      }
    };

    interface TestCase {
      category: string;
      grantType: GrantType;
      actions: string | string[];
      keyActions: string | string[];
    }

    const testCases: TestCase[] = [
      {
        category: 'grantRead',
        grantType: GrantType.READ,
        actions: stringIfSingle(perms.VECTOR_INDEX_READ_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_ACCESS),
      },
      {
        category: 'grantWrite',
        grantType: GrantType.WRITE,
        actions: stringIfSingle(perms.VECTOR_INDEX_WRITE_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_WRITE_ACCESS),
      },
      {
        category: 'grantReadWrite',
        grantType: GrantType.READ_WRITE,
        actions: stringIfSingle(perms.VECTOR_INDEX_READ_WRITE_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_WRITE_ACCESS),
      },
    ];

    testCases.forEach(({ category, grantType, actions, keyActions }) => {
      describe(category, () => {
        const verifyKeyPolicies = () => {
          if (withKMS) {
            Template.fromStack(stack).hasResourceProperties(KMS_KEY_CFN_RESOURCE, {
              'KeyPolicy': {
                'Statement': Match.arrayWith([
                  {
                    'Action': keyActions,
                    'Effect': 'Allow',
                    'Principal': {
                      'Service': PRINCIPAL,
                    },
                    'Resource': '*',
                  },
                ]),
              },
            });
          }
        };

        const expectedStatements: any = [{
          'Action': actions,
          'Effect': 'Allow',
          'Resource': INDEX_ARN_REF,
        }];
        if (withKMS) {
          expectedStatements.push({
            'Action': keyActions,
            'Effect': 'Allow',
            'Resource': { 'Fn::GetAtt': [keyName, 'Arn'] },
          });
        }

        it(`attaches ${grantType} IAM policy to a role`, () => {
          grantPermissions(vectorIndex, grantType, role);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`attaches ${grantType} IAM policy to a user`, () => {
          grantPermissions(vectorIndex, grantType, user);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`attaches ${grantType} IAM policy to an imported role`, () => {
          grantPermissions(vectorIndex, grantType, importedRole);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
        });

        it(`grants ${grantType} permissions via bucket policy for a service principal`, () => {
          grantPermissions(vectorIndex, grantType, new iam.ServicePrincipal(PRINCIPAL));
          Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
            'Policy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': PRINCIPAL,
                  },
                  'Resource': INDEX_ARN_REF,
                },
              ],
            },
          });
          verifyKeyPolicies();
        });
      });
    });
  };

  describe('without KMS encryption', () => {
    beforeEach(() => {
      const vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
      vectorIndex = new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });
    });

    grantTests({ withKMS: false });
  });

  describe('with a customer-managed KMS key on the bucket', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      userKey = new kms.Key(stack, 'ExampleKey', {});
      const vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
      vectorIndex = new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });
    });

    grantTests({ withKMS: true, keyName });
  });

  describe('with an index-level KMS key overriding the bucket key', () => {
    let bucketKey: kms.IKey;
    let indexKey: kms.IKey;

    beforeEach(() => {
      bucketKey = new kms.Key(stack, 'BucketKey', {});
      const vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: bucketKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
      indexKey = new kms.Key(stack, 'IndexKey', {});
      vectorIndex = new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: indexKey,
      });
    });

    test('grantRead grants kms:Decrypt on the index key (not the bucket key)', () => {
      vectorIndex.grantRead(role);

      const indexKeyArn = stack.resolve(indexKey.keyArn);
      const bucketKeyArn = stack.resolve(bucketKey.keyArn);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': Match.arrayWith([
            {
              'Action': stringIfSingle(perms.KEY_READ_ACCESS),
              'Effect': 'Allow',
              'Resource': indexKeyArn,
            },
          ]),
        },
      });

      const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
      const statements = Object.values(policies).flatMap((p: any) => p.Properties.PolicyDocument.Statement);
      const kmsStatements = statements.filter((s: any) => Array.isArray(s.Action)
        ? s.Action.some((a: string) => a.startsWith('kms:'))
        : typeof s.Action === 'string' && s.Action.startsWith('kms:'));
      const resourcesGranted = kmsStatements.map((s: any) => JSON.stringify(s.Resource));
      expect(resourcesGranted).not.toContain(JSON.stringify(bucketKeyArn));
    });

    test('grantReadWrite grants kms actions on the index key (not the bucket key)', () => {
      vectorIndex.grantReadWrite(role);

      const indexKeyArn = stack.resolve(indexKey.keyArn);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': Match.arrayWith([
            {
              'Action': stringIfSingle(perms.KEY_READ_WRITE_ACCESS),
              'Effect': 'Allow',
              'Resource': indexKeyArn,
            },
          ]),
        },
      });
    });
  });

  describe('with an index overriding the bucket KMS key with S3_MANAGED', () => {
    let bucketKey: kms.IKey;

    beforeEach(() => {
      bucketKey = new kms.Key(stack, 'BucketKey', {});
      const vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: bucketKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
      vectorIndex = new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
      });
    });

    test('grantRead does not grant any kms permissions on the bucket key', () => {
      vectorIndex.grantRead(role);

      const bucketKeyArn = stack.resolve(bucketKey.keyArn);
      const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
      const statements = Object.values(policies).flatMap((p: any) => p.Properties.PolicyDocument.Statement);
      const kmsStatements = statements.filter((s: any) => Array.isArray(s.Action)
        ? s.Action.some((a: string) => a.startsWith('kms:'))
        : typeof s.Action === 'string' && s.Action.startsWith('kms:'));
      const resourcesGranted = kmsStatements.map((s: any) => JSON.stringify(s.Resource));
      expect(resourcesGranted).not.toContain(JSON.stringify(bucketKeyArn));
    });
  });
});
