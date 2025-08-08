import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';
import * as perms from '../lib/permissions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { singletonOrArr as stringIfSingle } from './test-utils';

const TABLE_BUCKET_CFN_RESOURCE = 'AWS::S3Tables::TableBucket';
const TABLE_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TableBucketPolicy';
const KMS_KEY_CFN_RESOURCE = 'AWS::KMS::Key';
const PRINCIPAL = 's3.amazonaws.com';
const TABLE_BUCKET_ARN_SUB = { 'Fn::GetAtt': ['ExampleTableBucket9B5A2796', 'TableBucketARN'] };
const TABLE_UUID = 'example-table-uuid';
const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';
const TABLE_BUCKET_NAME = 'example-table-bucket';
const getResourcesWithTablesArn = (tableId: string) => [
  TABLE_BUCKET_ARN_SUB,
  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${tableId}`]] },
];
const RESOURCES_WITH_TABLE_ARN = getResourcesWithTablesArn(TABLE_UUID);
const RESOURCES_WITH_WILDCARD = getResourcesWithTablesArn('*');

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('TableBucket with encryption', () => {
  let stack: core.Stack;
  let tableBucket: s3tables.TableBucket;
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

  /**
   * Templatizes grant tests across different test suites.
   *
   * @param withKMS whether to test for KMS policies
   * @param keyName physical name of the KMS key to verify against
   */
  const grantTests = ({ withKMS, keyName }: { withKMS : boolean; keyName?: string }) => {
    enum GrantType { READ = 'read', WRITE = 'write', READ_WRITE = 'read & write' }

    const grantPermissions = (bucket: s3tables.TableBucket, grantType: GrantType, principal: iam.IGrantable, tableId: string) => {
      switch (grantType) {
        case GrantType.READ:
          bucket.grantRead(principal, tableId);
          return;
        case GrantType.WRITE:
          bucket.grantWrite(principal, tableId);
          return;
        case GrantType.READ_WRITE:
          bucket.grantReadWrite(principal, tableId);
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
        actions: stringIfSingle(perms.TABLE_BUCKET_READ_ACCESS),
        keyActions: stringIfSingle(perms.KEY_READ_ACCESS),
      },
      {
        category: 'grantWrite',
        grantType: GrantType.WRITE,
        actions: stringIfSingle(perms.TABLE_BUCKET_WRITE_ACCESS),
        keyActions: stringIfSingle(perms.KEY_WRITE_ACCESS),
      },
      {
        category: 'grantReadWrite',
        grantType: GrantType.READ_WRITE,
        actions: stringIfSingle(perms.TABLE_BUCKET_READ_WRITE_ACCESS),
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

        it(`provides ${grantType} permissions to the bucket ${withKMS && 'and key'}`, () => {
          grantPermissions(tableBucket, grantType, new iam.ServicePrincipal(PRINCIPAL), '*');
          Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
            'ResourcePolicy': {
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

        it(`provides ${grantType} permissions for a specific table ${withKMS && 'and key'}`, () => {
          grantPermissions(tableBucket, grantType, new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
          Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
            'ResourcePolicy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': PRINCIPAL,
                  },
                  'Resource': RESOURCES_WITH_TABLE_ARN,
                },
              ],
            },
          });
          verifyKeyPolicies();
        });

        const expectedStatements : any = [{
          'Action': actions,
          'Effect': 'Allow',
          'Resource': RESOURCES_WITH_TABLE_ARN,
        }];
        if (withKMS) {
          expectedStatements.push({
            'Action': keyActions,
            'Effect': 'Allow',
            'Resource': { 'Fn::GetAtt': [keyName, 'Arn'] },
          });
        }

        it(`creates ${grantType} IAM policies for a role ${withKMS && 'and key'}`, () => {
          grantPermissions(tableBucket, grantType, role, TABLE_UUID);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`creates ${grantType} IAM policies for a user ${withKMS && 'and key'}`, () => {
          grantPermissions(tableBucket, grantType, user, TABLE_UUID);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
        });

        it(`creates ${grantType} IAM policies for an imported role ${withKMS && 'and key'}`, () => {
          grantPermissions(tableBucket, grantType, importedRole, TABLE_UUID);
          Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
              'Statement': expectedStatements,
              'Version': '2012-10-17',
            },
          });
          Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
            'ResourcePolicy': {
              'Statement': [
                {
                  'Action': actions,
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': EXISTING_ROLE_ARN,
                  },
                  'Resource': RESOURCES_WITH_TABLE_ARN,
                },
              ],
            },
          });
        });
      });
    });
  };

  describe('with encryptionType undefined and encryptionKey provided', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      userKey = new kms.Key(stack, 'ExampleKey', {});
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', {
        account: '0123456789012',
        region: 'us-west-2',
        tableBucketName: TABLE_BUCKET_NAME,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    it(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    it('has encryption configuration', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_NAME,
        'EncryptionConfiguration': {
          'KMSKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SSEAlgorithm': 'aws:kms',
        },
      });
    });

    it('has removalPolicy set to Delete', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });

    grantTests({ withKMS: true, keyName });
  });

  describe('with encryptionType KMS and no encryptionKey provided', () => {
    const keyName = 'ExampleTableBucketKey99B1A8DA';

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', {
        account: '0123456789012',
        region: 'us-west-2',
        tableBucketName: TABLE_BUCKET_NAME,
        encryption: s3tables.TableBucketEncryption.KMS,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    it(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    it(`creates a ${KMS_KEY_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(KMS_KEY_CFN_RESOURCE, 1);
    });

    it('has encryption configuration', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_NAME,
        'EncryptionConfiguration': {
          'KMSKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SSEAlgorithm': 'aws:kms',
        },
      });
    });

    it('has removalPolicy set to Delete', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });

    it('key allowlists S3Tables maintenance SP', () => {
      Template.fromStack(stack).hasResourceProperties(KMS_KEY_CFN_RESOURCE, {
        'KeyPolicy': {
          'Statement': Match.arrayWith([
            {
              'Sid': 'AllowS3TablesMaintenanceAccess',
              'Action': [
                'kms:GenerateDataKey',
                'kms:Decrypt',
              ],
              'Effect': 'Allow',
              'Principal': {
                'Service': 'maintenance.s3tables.amazonaws.com',
              },
              'Resource': '*',
              'Condition': {
                'StringLike': {
                  'kms:EncryptionContext:aws:s3:arn': {
                    'Fn::Join': ['',
                      [
                        'arn:',
                        { 'Ref': 'AWS::Partition' },
                        ':s3tables:',
                        { 'Ref': 'AWS::Region' },
                        ':',
                        { 'Ref': 'AWS::AccountId' },
                        `:bucket/${TABLE_BUCKET_NAME}/*`,
                      ]],
                  },
                },
              },
            },
          ]),
        },
      });
    });

    grantTests({ withKMS: true, keyName });
  });

  describe('with encryptionType KMS and user-defined encryptionKey', () => {
    const keyName = 'ExampleKey469AF2A8';

    beforeEach(() => {
      userKey = new kms.Key(stack, 'ExampleKey', {});
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', {
        account: '0123456789012',
        region: 'us-west-2',
        tableBucketName: TABLE_BUCKET_NAME,
        encryption: s3tables.TableBucketEncryption.KMS,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    it(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    it('has encryption configuration', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_NAME,
        'EncryptionConfiguration': {
          'KMSKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SSEAlgorithm': 'aws:kms',
        },
      });
    });

    it('has removalPolicy set to Delete', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });

    grantTests({ withKMS: true, keyName });
  });

  describe('with encryptionType S3_MANAGED and no encryptionKey provided', () => {
    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', {
        account: '0123456789012',
        region: 'us-west-2',
        tableBucketName: TABLE_BUCKET_NAME,
        encryption: s3tables.TableBucketEncryption.S3_MANAGED,
        removalPolicy: core.RemovalPolicy.DESTROY,
      });
    });

    it(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    it('has encryption configuration', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_NAME,
        'EncryptionConfiguration': {
          'SSEAlgorithm': 'AES256',
        },
      });
    });

    it('has removalPolicy set to Delete', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });

    grantTests({ withKMS: false });
  });

  describe('with encryptionType S3_MANAGED and user-defined encryptionKey', () => {
    it('throws a validation error in the constructor', () => {
      userKey = new kms.Key(stack, 'ExampleKey', {});
      expect(() => new s3tables.TableBucket(stack, 'ExampleTableBucket', {
        account: '0123456789012',
        region: 'us-west-2',
        tableBucketName: TABLE_BUCKET_NAME,
        encryption: s3tables.TableBucketEncryption.S3_MANAGED,
        encryptionKey: userKey,
        removalPolicy: core.RemovalPolicy.DESTROY,
      })).toThrow();
    });
  });
});
