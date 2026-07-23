import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable @stylistic/quote-props */

describe('TableBucket', () => {
  const TABLE_BUCKET_CFN_RESOURCE = 'AWS::S3Tables::TableBucket';
  const TABLE_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TableBucketPolicy';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    const DEFAULT_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'example-table-bucket',
    };
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', DEFAULT_PROPS);
    });

    test(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    test('with tableBucketName property', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': DEFAULT_PROPS.tableBucketName,
      });
    });

    test('returns true from addToResourcePolicy', () => {
      const result = tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3tables:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toBe(true);
    });

    test('has removalPolicy set to "Retain"', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Retain',
      });
    });
  });

  describe('created with unreferenced file removal properties', () => {
    const TABLE_BUCKET_PROPS: s3tables.TableBucketProps = {
      account: '0123456789012',
      region: 'us-west-2',
      tableBucketName: 'example-table-bucket',
      unreferencedFileRemoval: {
        noncurrentDays: 10,
        unreferencedDays: 10,
        status: s3tables.UnreferencedFileRemovalStatus.ENABLED,
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    };
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', TABLE_BUCKET_PROPS);
    });

    test(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      tableBucket;
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    test('has UnreferencedFileRemoval properties', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_PROPS.tableBucketName,
        'UnreferencedFileRemoval': {
          'NoncurrentDays': TABLE_BUCKET_PROPS.unreferencedFileRemoval?.noncurrentDays,
          'Status': TABLE_BUCKET_PROPS.unreferencedFileRemoval?.status,
          'UnreferencedDays': TABLE_BUCKET_PROPS.unreferencedFileRemoval?.unreferencedDays,
        },
      });
    });

    test('has removalPolicy set to "Delete"', () => {
      Template.fromStack(stack).hasResource(TABLE_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });
  });

  describe('defined with resource policy', () => {
    const DEFAULT_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'example-table-bucket',
    };
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', DEFAULT_PROPS);
      tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3tables:*'],
        resources: ['*'],
      }));
    });

    test('resourcePolicy contains statement', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': 's3tables:*',
              'Effect': 'Allow',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('calling multiple times appends statements', () => {
      tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.DENY,
        resources: ['*'],
      }));
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': 's3tables:*',
              'Effect': 'Allow',
              'Resource': '*',
            },
            {
              'Action': 's3:*',
              'Effect': 'Deny',
              'Resource': '*',
            },
          ],
        },
      });
    });
  });

  describe('import existing table bucket with name', () => {
    const BUCKET_PROPS = {
      tableBucketName: 'example-table-bucket',
    };
    let tableBucket: s3tables.ITableBucket;

    beforeEach(() => {
      tableBucket = s3tables.TableBucket.fromTableBucketAttributes(stack, 'ExampleTableBucket', BUCKET_PROPS);
    });

    test('has the same name as it was imported with', () => {
      expect(tableBucket.tableBucketName).toEqual(BUCKET_PROPS.tableBucketName);
      tableBucket.grantRead(new iam.ServicePrincipal(''), '*');
    });

    test('renders the correct ARN for Example Resource', () => {
      const arn = stack.resolve(tableBucket.tableBucketArn);
      expect(arn).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { 'Ref': 'AWS::Partition' },
          ':s3tables:',
          { 'Ref': 'AWS::Region' },
          ':',
          { 'Ref': 'AWS::AccountId' },
          `:bucket/${BUCKET_PROPS.tableBucketName}`,
        ]],
      });
    });

    test('returns false from addToResourcePolicy', () => {
      const result = tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3tables:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toEqual(false);
    });
  });

  describe('import existing table bucket with arn', () => {
    const BUCKET_NAME = 'test-bucket';
    const ACCOUNT_ID = '123456789012';
    const REGION = 'us-west-2';
    const BUCKET_ARN = `arn:aws:s3tables:${REGION}:${ACCOUNT_ID}:bucket/${BUCKET_NAME}`;
    let tableBucket: s3tables.ITableBucket;

    beforeEach(() => {
      tableBucket = s3tables.TableBucket.fromTableBucketArn(stack, 'ExampleTableBucket', BUCKET_ARN);
    });

    test('has the same name as it was imported with', () => {
      expect(tableBucket.tableBucketName).toEqual(BUCKET_NAME);
    });

    test('has the same region as it was imported with', () => {
      expect(tableBucket.region).toEqual(REGION);
    });

    test('has the same account as it was imported with', () => {
      expect(tableBucket.account).toEqual(ACCOUNT_ID);
    });

    test('returns false from addToResourcePolicy', () => {
      const result = tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3tables:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toEqual(false);
    });
  });

  describe('import existing table bucket with name, region and account', () => {
    const BUCKET_PROPS = {
      tableBucketName: 'example-table-bucket',
      region: 'us-east-2',
      account: '123456789012',
    };
    let tableBucket: s3tables.ITableBucket;

    beforeEach(() => {
      tableBucket = s3tables.TableBucket.fromTableBucketAttributes(stack, 'ExampleTableBucket', BUCKET_PROPS);
    });

    test('has the same name as it was imported with', () => {
      expect(tableBucket.tableBucketName).toEqual(BUCKET_PROPS.tableBucketName);
    });

    test('has the same account as it was imported with', () => {
      expect(tableBucket.account).toEqual(BUCKET_PROPS.account);
    });

    test('has the same region as it was imported with', () => {
      expect(tableBucket.region).toEqual(BUCKET_PROPS.region);
    });

    test('renders the correct ARN for Example Resource', () => {
      const arn = stack.resolve(tableBucket.tableBucketArn);
      expect(arn).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { 'Ref': 'AWS::Partition' },
          `:s3tables:${BUCKET_PROPS.region}:${BUCKET_PROPS.account}:bucket/${BUCKET_PROPS.tableBucketName}`,
        ]],
      });
    });

    test('returns false from addToResourcePolicy', () => {
      const result = tableBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3tables:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toEqual(false);
      Template.fromStack(stack).resourceCountIs('AWS::S3Tables::TableBucketPolicy', 0);
    });
  });

  describe('created with request metrics enabled', () => {
    const TABLE_BUCKET_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'metrics-enabled-bucket',
      requestMetricsStatus: s3tables.RequestMetricsStatus.ENABLED,
    };

    beforeEach(() => {
      new s3tables.TableBucket(stack, 'MetricsEnabledBucket', TABLE_BUCKET_PROPS);
    });

    test(`creates a ${TABLE_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_CFN_RESOURCE, 1);
    });

    test('has MetricsConfiguration with Enabled status', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_PROPS.tableBucketName,
        'MetricsConfiguration': {
          'Status': 'Enabled',
        },
      });
    });
  });

  describe('created with request metrics disabled', () => {
    const TABLE_BUCKET_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'metrics-disabled-bucket',
      requestMetricsStatus: s3tables.RequestMetricsStatus.DISABLED,
    };

    beforeEach(() => {
      new s3tables.TableBucket(stack, 'MetricsDisabledBucket', TABLE_BUCKET_PROPS);
    });

    test('has MetricsConfiguration with Disabled status', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        'TableBucketName': TABLE_BUCKET_PROPS.tableBucketName,
        'MetricsConfiguration': {
          'Status': 'Disabled',
        },
      });
    });
  });

  describe('created without request metrics configuration', () => {
    const TABLE_BUCKET_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'no-metrics-bucket',
    };

    beforeEach(() => {
      new s3tables.TableBucket(stack, 'NoMetricsBucket', TABLE_BUCKET_PROPS);
    });

    test('does not have MetricsConfiguration property', () => {
      const template = Template.fromStack(stack);
      const resources = template.findResources(TABLE_BUCKET_CFN_RESOURCE);
      const resourceKey = Object.keys(resources)[0];
      expect(resources[resourceKey].Properties.MetricsConfiguration).toBeUndefined();
    });
  });

  describe('validateUnreferencedFileRemoval', () => {
    it('should not throw error when unreferencedFileRemovalProperty is undefined', () => {
      expect(() => s3tables.TableBucket.validateUnreferencedFileRemoval(undefined)).not.toThrow();
    });

    it('should not throw error for valid property values', () => {
      const validProperty = {
        noncurrentDays: 1,
        unreferencedDays: 1,
        status: s3tables.UnreferencedFileRemovalStatus.ENABLED,
      };
      expect(() => s3tables.TableBucket.validateUnreferencedFileRemoval(validProperty)).not.toThrow();
    });

    it('should throw error when noncurrentDays is less than 1', () => {
      const invalidProperty = {
        noncurrentDays: 0,
        unreferencedDays: 1,
        status: s3tables.UnreferencedFileRemovalStatus.ENABLED,
      };
      expect(() => s3tables.TableBucket.validateUnreferencedFileRemoval(invalidProperty))
        .toThrow(
          /noncurrentDays must be at least 1/,
        );
    });

    it('should throw error when unreferencedDays is less than 1', () => {
      const invalidProperty = {
        noncurrentDays: 1,
        unreferencedDays: 0,
        status: s3tables.UnreferencedFileRemovalStatus.ENABLED,
      };
      expect(() => s3tables.TableBucket.validateUnreferencedFileRemoval(invalidProperty))
        .toThrow(
          /unreferencedDays must be at least 1/,
        );
    });

    it('should not throw error when optional fields are undefined', () => {
      const partialProperty = {};
      expect(() => s3tables.TableBucket.validateUnreferencedFileRemoval(partialProperty)).not.toThrow();
    });
  });

  describe('validateBucketName', () => {
    it('should accept valid bucket names', () => {
      const validNames = [
        'my-bucket-123',
        'test-bucket',
        'abc',
        'a'.repeat(63),
        '123-bucket',
      ];

      validNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).not.toThrow();
      });
    });

    it('should skip validation for unresolved tokens', () => {
      const isUnresolved = core.Token.isUnresolved;
      core.Token.isUnresolved = jest.fn().mockReturnValue(true);
      expect(() => s3tables.TableBucket.validateTableBucketName('unresolved')).not.toThrow();
      // Cleanup
      core.Token.isUnresolved = isUnresolved;
    });

    it('should skip validation for undefined name', () => {
      expect(() => s3tables.TableBucket.validateTableBucketName(undefined)).not.toThrow();
    });

    it('should reject bucket names that are too short', () => {
      expect(() => s3tables.TableBucket.validateTableBucketName('XX')).toThrow(
        /Bucket name must be at least 3/,
      );
    });

    it('should reject bucket names that are too long', () => {
      const longName = 'a'.repeat(64);
      expect(() => s3tables.TableBucket.validateTableBucketName(longName)).toThrow(
        /no more than 63 characters/,
      );
    });

    it('should reject bucket names with illegal characters', () => {
      const invalidNames = [
        'My-Bucket', // uppercase
        'bucket!123', // special character
        'bucket.123', // period
        'bucket_123', // underscore
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must only contain lowercase characters, numbers, and hyphens/,
        );
      });
    });

    it('should reject bucket names that start with invalid characters', () => {
      const invalidNames = [
        '-bucket',
        '.bucket',
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must start with a lowercase letter or number/,
        );
      });
    });

    it('should reject bucket names that end with invalid characters', () => {
      const invalidNames = [
        'bucket-',
        'bucket.',
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must end with a lowercase letter or number/,
        );
      });
    });

    it('should include the invalid bucket name in the error message', () => {
      const invalidName = 'Invalid-Bucket!';
      expect(() => s3tables.TableBucket.validateTableBucketName(invalidName)).toThrow(
        /Invalid-Bucket!/,
      );
    });

    it('should handle empty bucket names', () => {
      expect(() => s3tables.TableBucket.validateTableBucketName('')).toThrow(
        /Bucket name must be at least 3/,
      );
    });
  });

  describe('tagging', () => {
    test('implements ITaggableV2', () => {
      const tableBucket = new s3tables.TableBucket(stack, 'TaggedBucket', {
        tableBucketName: 'tagged-bucket',
      });
      expect(core.TagManager.of(tableBucket)).toBeDefined();
    });

    test('tags are applied to the table bucket', () => {
      const tableBucket = new s3tables.TableBucket(stack, 'TaggedBucket', {
        tableBucketName: 'tagged-bucket',
      });

      core.Tags.of(tableBucket).add('Environment', 'Production');
      core.Tags.of(tableBucket).add('Team', 'DataEng');

      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        Tags: Match.arrayWith([
          Match.objectLike({ Key: 'Environment', Value: 'Production' }),
          Match.objectLike({ Key: 'Team', Value: 'DataEng' }),
        ]),
      });
    });

    test('stack-level tags propagate to table bucket', () => {
      new s3tables.TableBucket(stack, 'TaggedBucket', {
        tableBucketName: 'tagged-bucket',
      });

      core.Tags.of(stack).add('StackTag', 'Propagated');

      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        Tags: Match.arrayWith([
          Match.objectLike({ Key: 'StackTag', Value: 'Propagated' }),
        ]),
      });
    });
  });

  describe('replication', () => {
    const DEST_ARN = 'arn:aws:s3tables:us-west-2:111111111111:bucket/dest-bucket';

    test('does not emit ReplicationConfiguration when props are omitted', () => {
      new s3tables.TableBucket(stack, 'NoRepl', {
        tableBucketName: 'no-repl-src',
      });

      const resources = Template.fromStack(stack).findResources(TABLE_BUCKET_CFN_RESOURCE);
      const key = Object.keys(resources)[0];
      expect(resources[key].Properties.ReplicationConfiguration).toBeUndefined();
    });

    test('emits ReplicationConfiguration with auto-created role when destinations are specified', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::IAM::Role', 1);
      template.hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        ReplicationConfiguration: Match.objectLike({
          Role: Match.objectLike({
            'Fn::GetAtt': [Match.stringLikeRegexp('SrcReplicationRole.*'), 'Arn'],
          }),
          Rules: [
            {
              Destinations: [
                { DestinationTableBucketARN: DEST_ARN },
              ],
            },
          ],
        }),
      });
    });

    test('auto-created role trusts replication.s3tables.amazonaws.com with SourceAccount and SourceArn conditions', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: Match.objectLike({
          Statement: [
            Match.objectLike({
              Effect: 'Allow',
              Action: 'sts:AssumeRole',
              Principal: { Service: 'replication.s3tables.amazonaws.com' },
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': { Ref: 'AWS::AccountId' },
                },
                ArnLike: {
                  'aws:SourceArn': Match.objectLike({
                    'Fn::Join': Match.arrayWith([
                      Match.arrayWith([':s3tables:']),
                    ]),
                  }),
                },
              },
            }),
          ],
        }),
      });
    });

    test('auto-created role has scoped source bucket + table actions', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3tables:ListTables',
              Effect: 'Allow',
            }),
            Match.objectLike({
              Action: [
                's3tables:GetTable',
                's3tables:GetTableMetadataLocation',
                's3tables:GetTableMaintenanceConfiguration',
                's3tables:GetTableData',
              ],
              Effect: 'Allow',
            }),
          ]),
        }),
      });
    });

    test('auto-created role has scoped destination bucket + table actions', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: [
                's3tables:CreateNamespace',
                's3tables:CreateTable',
              ],
              Effect: 'Allow',
              Resource: DEST_ARN,
            }),
            Match.objectLike({
              Action: [
                's3tables:GetTableData',
                's3tables:PutTableData',
                's3tables:UpdateTableMetadataLocation',
                's3tables:PutTableMaintenanceConfiguration',
              ],
              Effect: 'Allow',
              Resource: `${DEST_ARN}/table/*`,
            }),
          ]),
        }),
      });
    });

    test('user-supplied replicationRole is used verbatim and no role is created', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      const userRole = iam.Role.fromRoleArn(stack, 'UserRole', 'arn:aws:iam::123456789012:role/custom-replication-role');

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
        replicationRole: userRole,
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::IAM::Role', 0);
      template.hasResourceProperties(TABLE_BUCKET_CFN_RESOURCE, {
        ReplicationConfiguration: Match.objectLike({
          Role: 'arn:aws:iam::123456789012:role/custom-replication-role',
        }),
      });
    });

    test.each([1, 2, 3, 5])('supports %d destination(s)', (count) => {
      const destinations = Array.from({ length: count }, (_, i) =>
        s3tables.TableBucket.fromTableBucketArn(stack, `Dest${i}`, `arn:aws:s3tables:us-west-2:111111111111:bucket/dest-${i}`),
      );

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: destinations,
      });

      const resources = Template.fromStack(stack).findResources(TABLE_BUCKET_CFN_RESOURCE);
      const key = Object.keys(resources).find(k => k.startsWith('Src'))!;
      const dests = resources[key].Properties.ReplicationConfiguration.Rules[0].Destinations;
      expect(dests).toHaveLength(count);
    });

    test.each([6, 10])('fails when more than 5 destinations are specified (%d)', (count) => {
      const destinations = Array.from({ length: count }, (_, i) =>
        s3tables.TableBucket.fromTableBucketArn(stack, `Dest${i}`, `arn:aws:s3tables:us-west-2:111111111111:bucket/dest-${i}`),
      );

      expect(() => new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: destinations,
      })).toThrow(`replicationDestinations may have at most 5 entries, got ${count}`);
    });

    test('fails when replicationRole is set without replicationDestinations', () => {
      const userRole = iam.Role.fromRoleArn(stack, 'UserRole', 'arn:aws:iam::123456789012:role/custom-replication-role');

      expect(() => new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationRole: userRole,
      })).toThrow('cannot specify replicationRole when replicationDestinations is empty');
    });

    test('fails when replicationDestinations is an empty array and replicationRole is set', () => {
      const userRole = iam.Role.fromRoleArn(stack, 'UserRole', 'arn:aws:iam::123456789012:role/custom-replication-role');

      expect(() => new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [],
        replicationRole: userRole,
      })).toThrow('cannot specify replicationRole when replicationDestinations is empty');
    });

    test('grants kms:Decrypt, kms:GenerateDataKey on source KMS key when source is KMS-encrypted', () => {
      const sourceKey = new kms.Key(stack, 'SourceKey');
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        encryption: s3tables.TableBucketEncryption.KMS,
        encryptionKey: sourceKey,
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
              Effect: 'Allow',
              Resource: Match.objectLike({
                'Fn::GetAtt': [Match.stringLikeRegexp('SourceKey.*'), 'Arn'],
              }),
            }),
          ]),
        }),
      });
    });

    test('grants kms:Encrypt, kms:Decrypt, kms:GenerateDataKey on destination KMS key when destination exposes encryptionKey', () => {
      const destKey = new kms.Key(stack, 'DestKey');
      const destination = s3tables.TableBucket.fromTableBucketAttributes(stack, 'Dest', {
        tableBucketArn: DEST_ARN,
        encryptionKey: destKey,
      });

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: [
                'kms:Encrypt',
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
              Effect: 'Allow',
              Resource: Match.objectLike({
                'Fn::GetAtt': [Match.stringLikeRegexp('DestKey.*'), 'Arn'],
              }),
            }),
          ]),
        }),
      });
    });

    test('emits info annotation when a destination is in a different account', () => {
      const app = new core.App();
      const envStack = new core.Stack(app, 'EnvStack', {
        env: { account: '111111111111', region: 'us-east-1' },
      });
      const destination = s3tables.TableBucket.fromTableBucketAttributes(envStack, 'DestCross', {
        account: '234567890123',
        region: 'us-east-1',
        tableBucketName: 'dest-cross',
      });

      new s3tables.TableBucket(envStack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Annotations.fromStack(envStack).hasInfo(
        '*',
        Match.stringLikeRegexp('Cross-account S3 Tables replication detected.*'),
      );
    });

    test('does not emit info annotation when all destinations are in the same account', () => {
      const app = new core.App();
      const envStack = new core.Stack(app, 'EnvStack', {
        env: { account: '111111111111', region: 'us-east-1' },
      });
      const destination = s3tables.TableBucket.fromTableBucketArn(envStack, 'Dest', DEST_ARN);

      new s3tables.TableBucket(envStack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      const infos = Annotations.fromStack(envStack).findInfo('*', Match.stringLikeRegexp('Cross-account.*'));
      expect(infos).toHaveLength(0);
    });

    test('adds replication role to source KMS key policy (not just IAM identity policy)', () => {
      const sourceKey = new kms.Key(stack, 'SourceKey');
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        encryption: s3tables.TableBucketEncryption.KMS,
        encryptionKey: sourceKey,
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'AllowS3TablesReplicationRoleSource',
              Effect: 'Allow',
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
            }),
          ]),
        }),
      });
    });

    test('adds replication role to destination KMS key policy (not just IAM identity policy)', () => {
      const destKey = new kms.Key(stack, 'DestKey');
      const destination = s3tables.TableBucket.fromTableBucketAttributes(stack, 'Dest', {
        tableBucketArn: DEST_ARN,
        encryptionKey: destKey,
      });

      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'AllowS3TablesReplicationRoleDestination',
              Effect: 'Allow',
              Action: [
                'kms:Encrypt',
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
            }),
          ]),
        }),
      });
    });

    test('generated role name is not hard-coded', () => {
      const destination = s3tables.TableBucket.fromTableBucketArn(stack, 'Dest', DEST_ARN);
      new s3tables.TableBucket(stack, 'Src', {
        tableBucketName: 'repl-src',
        replicationDestinations: [destination],
      });

      const resources = Template.fromStack(stack).findResources('AWS::IAM::Role');
      const key = Object.keys(resources)[0];
      expect(resources[key].Properties.RoleName).toBeUndefined();
    });
  });
});
