import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';
import * as perms from '../lib/permissions';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('Access grant methods', () => {
  const TABLE_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TableBucketPolicy';
  const PRINCIPAL = 's3.amazonaws.com';
  const DEFAULT_PROPS: s3tables.TableBucketProps = { tableBucketName: 'example-table-bucket' };
  const TABLE_BUCKET_ARN_SUB = { 'Fn::GetAtt': ['ExampleTableBucket9B5A2796', 'TableBucketARN'] };
  const TABLE_UUID = 'example-table-uuid';
  const RESOURCES_WITH_TABLE_ARN = [
    TABLE_BUCKET_ARN_SUB,
    { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
  ];
  const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';

  let stack: core.Stack;
  let tableBucket: s3tables.TableBucket;
  let role: iam.Role;
  let importedRole: iam.IRole;
  let user: iam.User;

  beforeEach(() => {
    stack = new core.Stack();
    tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', DEFAULT_PROPS);
    role = new iam.Role(stack, 'TestRole', { assumedBy: new iam.ServicePrincipal('sample') });
    user = new iam.User(stack, 'TestUser');
    importedRole = iam.Role.fromRoleArn(
      stack,
      'ImportedRole',
      EXISTING_ROLE_ARN,
    );
  });

  describe('grantRead', () => {
    it('provides read and list permissions to the bucket', () => {
      tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
        },
      });
    });

    it('provides read and list permissions for a specific table', () => {
      tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      tableBucket.grantRead(role, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      tableBucket.grantRead(user, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      tableBucket.grantRead(importedRole, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_ACCESS,
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

  describe('grantWrite', () => {
    it('provides write permissions to the bucket', () => {
      tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
        },
      });
    });

    it('provides write permissions for a specific table', () => {
      tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': [
                TABLE_BUCKET_ARN_SUB,
                { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
              ],
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      tableBucket.grantWrite(role, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      tableBucket.grantWrite(user, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      tableBucket.grantWrite(importedRole, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
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

  describe('grantReadWrite', () => {
    it('provides read & write permissions to the bucket', () => {
      tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
        },
      });
    });

    it('provides read & write permissions for a specific table', () => {
      tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': [
                TABLE_BUCKET_ARN_SUB,
                { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
              ],
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      tableBucket.grantReadWrite(role, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      tableBucket.grantReadWrite(user, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      tableBucket.grantReadWrite(importedRole, TABLE_UUID);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': RESOURCES_WITH_TABLE_ARN,
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
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
