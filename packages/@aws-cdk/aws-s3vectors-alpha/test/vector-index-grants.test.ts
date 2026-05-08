import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';
import { singletonOrArr as stringIfSingle } from './test-utils';
import * as perms from '../lib/permissions';

/* eslint-disable @stylistic/quote-props */

const INDEX_NAME = 'example-index';
const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';
const VECTOR_BUCKET_NAME = 'example-vector-bucket';

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
        const indexArnRef = { 'Fn::GetAtt': ['ExampleVectorIndex0BD96B3F', 'IndexArn'] };
        const expectedStatements: any = [{
          'Action': actions,
          'Effect': 'Allow',
          'Resource': indexArnRef,
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
        });

        it(`attaches ${grantType} IAM policy to a user`, () => {
          grantPermissions(vectorIndex, grantType, user);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
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
});
