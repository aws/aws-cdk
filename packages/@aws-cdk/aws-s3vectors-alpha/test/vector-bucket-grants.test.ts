import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';
import { singletonOrArr as stringIfSingle } from './test-utils';
import * as perms from '../lib/permissions';

/* eslint-disable @stylistic/quote-props */

const VECTOR_BUCKET_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucket';
const VECTOR_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucketPolicy';
const KMS_KEY_CFN_RESOURCE = 'AWS::KMS::Key';
const PRINCIPAL = 'lambda.amazonaws.com';
const VECTOR_BUCKET_ARN_SUB = { 'Fn::GetAtt': ['ExampleVectorBucketC67D306D', 'VectorBucketArn'] };
const INDEX_NAME = 'example-index';
const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';
const VECTOR_BUCKET_NAME = 'example-vector-bucket';

const getResourcesWithIndexArn = (indexName: string) => [
  VECTOR_BUCKET_ARN_SUB,
  { 'Fn::Join': ['', [VECTOR_BUCKET_ARN_SUB, `/index/${indexName}`]] },
];
const RESOURCES_WITH_INDEX_ARN = getResourcesWithIndexArn(INDEX_NAME);
const RESOURCES_WITH_WILDCARD = getResourcesWithIndexArn('*');

describe('VectorBucket grants', () => {
  let stack: core.Stack;
  let vectorBucket: s3vectors.VectorBucket;
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

    const grantPermissions = (bucket: s3vectors.VectorBucket, grantType: GrantType, principal: iam.IGrantable, indexName?: string) => {
      switch (grantType) {
        case GrantType.READ:
          bucket.grantRead(principal, indexName);
          return;
        case GrantType.WRITE:
          bucket.grantWrite(principal, indexName);
          return;
        case GrantType.READ_WRITE:
          bucket.grantReadWrite(principal, indexName);
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
        actions: stringIfSingle(perms.VECTOR_BUCKET_READ_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_ACCESS),
      },
      {
        category: 'grantWrite',
        grantType: GrantType.WRITE,
        actions: stringIfSingle(perms.VECTOR_BUCKET_WRITE_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_WRITE_ACCESS),
      },
      {
        category: 'grantReadWrite',
        grantType: GrantType.READ_WRITE,
        actions: stringIfSingle(perms.VECTOR_BUCKET_READ_WRITE_ACCESS),
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

        it(`grants ${grantType} permissions via bucket policy for a service principal (wildcard index)`, () => {
          grantPermissions(vectorBucket, grantType, new iam.ServicePrincipal(PRINCIPAL), '*');
          Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
            'Policy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': PRINCIPAL,
                  },
                  'Resource': RESOURCES_WITH_WILDCARD,
                },
              ],
            },
          });
          verifyKeyPolicies();
        });

        it(`grants ${grantType} permissions via bucket policy for a service principal (default = all indexes)`, () => {
          grantPermissions(vectorBucket, grantType, new iam.ServicePrincipal(PRINCIPAL));
          Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
            'Policy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': PRINCIPAL,
                  },
                  'Resource': RESOURCES_WITH_WILDCARD,
                },
              ],
            },
          });
          verifyKeyPolicies();
        });

        it(`grants ${grantType} permissions via bucket policy for a service principal (specific index)`, () => {
          grantPermissions(vectorBucket, grantType, new iam.ServicePrincipal(PRINCIPAL), INDEX_NAME);
          Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
            'Policy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': PRINCIPAL,
                  },
                  'Resource': RESOURCES_WITH_INDEX_ARN,
                },
              ],
            },
          });
          verifyKeyPolicies();
        });

        const expectedStatements: any = [{
          'Action': actions,
          'Effect': 'Allow',
          'Resource': RESOURCES_WITH_INDEX_ARN,
        }];
        if (withKMS) {
          expectedStatements.push({
            'Action': keyActions,
            'Effect': 'Allow',
            'Resource': { 'Fn::GetAtt': [keyName, 'Arn'] },
          });
        }

        it(`attaches ${grantType} IAM policy to a role`, () => {
          grantPermissions(vectorBucket, grantType, role, INDEX_NAME);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`attaches ${grantType} IAM policy to a user`, () => {
          grantPermissions(vectorBucket, grantType, user, INDEX_NAME);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`attaches ${grantType} IAM policy to an imported role via bucket policy`, () => {
          grantPermissions(vectorBucket, grantType, importedRole, INDEX_NAME);
          Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
            'Policy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': EXISTING_ROLE_ARN,
                  },
                  'Resource': RESOURCES_WITH_INDEX_ARN,
                },
              ],
            },
          });
        });
      });
    });
  };

  describe('without KMS encryption', () => {
    beforeEach(() => {
      vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    test(`creates a ${VECTOR_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_CFN_RESOURCE, 1);
    });

    grantTests({ withKMS: false });
  });

  describe('with a customer-managed KMS key', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      userKey = new kms.Key(stack, 'ExampleKey', {});
      vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: VECTOR_BUCKET_NAME,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    grantTests({ withKMS: true, keyName });
  });
});
