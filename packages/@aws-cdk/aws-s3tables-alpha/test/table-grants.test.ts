import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';
import * as perms from '../lib/permissions';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('Table grant methods', () => {
  const TABLE_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TablePolicy';
  const PRINCIPAL = 's3.amazonaws.com';
  const EXISTING_ROLE_ARN = 'arn:aws:iam::123456789012:role/existing-role';
  // Extract single length array to string
  const TABLE_READ_ACCESS = perms.TABLE_READ_ACCESS[0];

  let stack: core.Stack;
  let tableBucket: s3tables.TableBucket;
  let namespace: s3tables.Namespace;
  let table: s3tables.Table;
  let role: iam.Role;
  let importedRole: iam.IRole;
  let user: iam.User;

  beforeEach(() => {
    stack = new core.Stack();
    tableBucket = new s3tables.TableBucket(stack, 'TestTableBucket', {
      tableBucketName: 'test-table-bucket',
    });
    namespace = new s3tables.Namespace(stack, 'TestNamespace', {
      tableBucket,
      namespaceName: 'test_namespace',
    });
    table = new s3tables.Table(stack, 'TestTable', {
      tableName: 'test_table',
      namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
    });
    role = new iam.Role(stack, 'TestRole', { assumedBy: new iam.ServicePrincipal('sample') });
    user = new iam.User(stack, 'TestUser');
    importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', EXISTING_ROLE_ARN);
  });

  describe('grantRead', () => {
    it('provides read permissions to the table', () => {
      table.grantRead(new iam.ServicePrincipal(PRINCIPAL));
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': TABLE_READ_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      table.grantRead(role);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': TABLE_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      table.grantRead(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': TABLE_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      table.grantRead(importedRole);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': TABLE_READ_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': TABLE_READ_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'AWS': EXISTING_ROLE_ARN,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });
  });

  describe('grantWrite', () => {
    it('provides write permissions to the table', () => {
      table.grantWrite(new iam.ServicePrincipal(PRINCIPAL));
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      table.grantWrite(role);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      table.grantWrite(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      table.grantWrite(importedRole);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'AWS': EXISTING_ROLE_ARN,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });
  });

  describe('grantReadWrite', () => {
    it('provides read & write permissions to the table', () => {
      table.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL));
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'Service': PRINCIPAL,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });

    it('creates IAM policies for a role', () => {
      table.grantReadWrite(role);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for a user', () => {
      table.grantReadWrite(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 0);
    });

    it('creates IAM policies for an imported role', () => {
      table.grantReadWrite(importedRole);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': perms.TABLE_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
          'Version': '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': perms.TABLE_READ_WRITE_ACCESS,
              'Effect': 'Allow',
              'Principal': {
                'AWS': EXISTING_ROLE_ARN,
              },
              'Resource': { 'Fn::GetAtt': ['TestTableE9CAAD86', 'TableARN'] },
            },
          ],
        },
      });
    });
  });
});
