import { Match, Template } from '../../assertions';
import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as iam from '../../aws-iam';
import { App, Lazy, Stack, Validations } from '../../core';
import type { CfnTable } from '../lib';
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  SearchSchemaElementType,
  Table,
  TableEncryption,
  TableGrants,
  VectorDistanceFunction,
} from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack');
});

function newTable(): Table {
  return new Table(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
  });
}

// `count` INLINE_FILTER search schema elements named filter0, filter1, and so on.
function inlineFilters(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    attribute: { name: `filter${i}`, type: AttributeType.STRING },
    type: SearchSchemaElementType.INLINE_FILTER,
  }));
}

// Index ARN of the table 'my-table' imported by name into the test stack, which sets no account or region.
const importedByNameIndexArn = {
  'Fn::Join': ['', [
    'arn:', { Ref: 'AWS::Partition' }, ':dynamodb:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':table/my-table/index/*',
  ]],
};

test('addVectorIndex renders VectorIndexes into the table', () => {
  const table = newTable();

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'partitionKey', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      { attribute: { name: 'inlineFilter1', type: AttributeType.NUMBER }, type: SearchSchemaElementType.INLINE_FILTER },
    ],
    projectionType: ProjectionType.ALL,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      {
        IndexName: 'vectorIndex',
        VectorAttribute: { AttributeName: 'embedding' },
        Dimensions: 128,
        DistanceFunction: 'COSINE',
        Projection: { ProjectionType: 'ALL' },
        SearchSchema: [
          { AttributeName: 'partitionKey', SearchSchemaElementType: 'HASH' },
          { AttributeName: 'inlineFilter1', SearchSchemaElementType: 'INLINE_FILTER' },
        ],
      },
    ],
  });
});

test('search schema attributes are added to attribute definitions, vector attribute is not', () => {
  const table = newTable();

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 64,
    distanceFunction: VectorDistanceFunction.EUCLIDEAN,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    AttributeDefinitions: Match.arrayWith([
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
    ]),
  });

  // The vector attribute must NOT appear in AttributeDefinitions (implicit type L).
  const defs = Template.fromStack(stack).findResources('AWS::DynamoDB::Table');
  const attrNames = Object.values(defs)[0].Properties.AttributeDefinitions.map((d: any) => d.AttributeName);
  expect(attrNames).not.toContain('embedding');
});

test('vector index without a search schema renders no SearchSchema', () => {
  const table = newTable();

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 256,
    distanceFunction: VectorDistanceFunction.DOT_PRODUCT,
    projectionType: ProjectionType.KEYS_ONLY,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      Match.objectLike({
        IndexName: 'vectorIndex',
        Projection: { ProjectionType: 'KEYS_ONLY' },
        SearchSchema: Match.absent(),
      }),
    ],
  });
});

test('throws when the table is not in PAY_PER_REQUEST billing mode', () => {
  const table = new Table(stack, 'Provisioned', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    billingMode: BillingMode.PROVISIONED,
    readCapacity: 5,
    writeCapacity: 5,
  });

  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow('vector index "vectorIndex" requires PAY_PER_REQUEST billing mode, got "PROVISIONED" (set billingMode: BillingMode.PAY_PER_REQUEST on the table)');
});

test('throws when the table uses the default billing mode, PROVISIONED', () => {
  const table = new Table(stack, 'DefaultBilling', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });

  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow('got "PROVISIONED" (set billingMode: BillingMode.PAY_PER_REQUEST on the table)');
});

test.each([1, 4096])('accepts dimensions %d at the boundary', (dimensions) => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Dimensions: dimensions })],
  });
});

test.each([-1, 0, 4097])('throws when dimensions %d is out of range', (dimensions) => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(`vector index "vectorIndex" has dimensions ${dimensions} (use an integer from 1 to 4096)`);
});

test('throws when a vector index name collides with a GSI name', () => {
  const table = newTable();
  table.addGlobalSecondaryIndex({
    indexName: 'shared',
    partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
  });

  expect(() => table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/duplicate index name, shared/);
});

test('throws when a GSI name collides with a vector index name', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  expect(() => table.addGlobalSecondaryIndex({
    indexName: 'shared',
    partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
  })).toThrow(/duplicate index name, shared/);
});

test('INCLUDE projection renders its nonKeyAttributes', () => {
  const table = newTable();

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    projectionType: ProjectionType.INCLUDE,
    nonKeyAttributes: ['title', 'price'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      Match.objectLike({
        IndexName: 'vectorIndex',
        Projection: { ProjectionType: 'INCLUDE', NonKeyAttributes: ['title', 'price'] },
      }),
    ],
  });
});

test('vector index INCLUDE attributes count toward the limit of 100 projected attributes', () => {
  const table = newTable();
  for (let n = 0; n < 5; n++) {
    table.addGlobalSecondaryIndex({
      indexName: `gsi${n}`,
      partitionKey: { name: 'g', type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: Array.from({ length: 20 }, (_, i) => `a${n * 20 + i}`),
    });
  }

  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    projectionType: ProjectionType.INCLUDE,
    nonKeyAttributes: ['extra'],
  })).toThrow('a maximum number of nonKeyAttributes across all of secondary indexes is 100');
});

test('throws when INCLUDE projection has no nonKeyAttributes', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    projectionType: ProjectionType.INCLUDE,
  })).toThrow(/non-key attributes should be specified/);
});

test.each([2.5, NaN])('throws when dimensions %d is not an integer', (dimensions) => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(`vector index "vectorIndex" has dimensions ${dimensions} (use an integer from 1 to 4096)`);
});

test('tokenized dimensions is not validated at synth and resolves in the template', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: Lazy.number({ produce: () => 128 }),
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Dimensions: 128 })],
  });
});

test('multiple vector indexes render on the same table', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'vi1',
    vectorAttribute: 'embedding1',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });
  table.addVectorIndex({
    indexName: 'vi2',
    vectorAttribute: 'embedding2',
    dimensions: 256,
    distanceFunction: VectorDistanceFunction.EUCLIDEAN,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      Match.objectLike({ IndexName: 'vi1', Dimensions: 128, Projection: { ProjectionType: 'ALL' } }),
      Match.objectLike({ IndexName: 'vi2', Dimensions: 256, Projection: { ProjectionType: 'ALL' } }),
    ],
  });
});

test('throws when a vector index name collides with another vector index name', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  expect(() => table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'other',
    dimensions: 64,
    distanceFunction: VectorDistanceFunction.EUCLIDEAN,
  })).toThrow(/duplicate index name, shared/);
});

test('throws when a vector index name collides with an LSI name', () => {
  const table = new Table(stack, 'SortKeyTable', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    sortKey: { name: 'sk', type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
  });
  table.addLocalSecondaryIndex({
    indexName: 'shared',
    sortKey: { name: 'lsiSk', type: AttributeType.NUMBER },
  });

  expect(() => table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/duplicate index name, shared/);
});

test('throws when an LSI name collides with a vector index name', () => {
  const table = new Table(stack, 'SortKeyTable', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    sortKey: { name: 'sk', type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
  });
  table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  expect(() => table.addLocalSecondaryIndex({
    indexName: 'shared',
    sortKey: { name: 'lsiSk', type: AttributeType.NUMBER },
  })).toThrow(/duplicate index name, shared/);
});

test('search schema with only INLINE_FILTER elements renders', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'year', type: AttributeType.NUMBER }, type: SearchSchemaElementType.INLINE_FILTER },
      { attribute: { name: 'genre', type: AttributeType.STRING }, type: SearchSchemaElementType.INLINE_FILTER },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      Match.objectLike({
        SearchSchema: [
          { AttributeName: 'year', SearchSchemaElementType: 'INLINE_FILTER' },
          { AttributeName: 'genre', SearchSchemaElementType: 'INLINE_FILTER' },
        ],
      }),
    ],
  });
});

test('throws when a search schema attribute conflicts with an existing attribute type', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'pk', type: AttributeType.NUMBER }, type: SearchSchemaElementType.INLINE_FILTER },
    ],
  })).toThrow(/Unable to specify pk as N because it was already defined as S/);
});

test('throws when search schema contains duplicate attribute names', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.INLINE_FILTER },
    ],
  })).toThrow('vector index "vectorIndex" lists the search schema attribute "category" more than once (list each attribute once)');
});

test.each([2, 3])('throws when the search schema has %d HASH elements', (count) => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: Array.from({ length: count }, (_, i) => ({
      attribute: { name: `hash${i}`, type: AttributeType.STRING },
      type: SearchSchemaElementType.HASH,
    })),
  })).toThrow(`vector index "vectorIndex" can have at most one HASH search schema element, got ${count} (keep one HASH element)`);
});

test('accepts a HASH element and 18 INLINE_FILTER elements', () => {
  const table = newTable();
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      ...inlineFilters(18),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::Table', {
    VectorIndexes: [
      Match.objectLike({
        SearchSchema: [
          { AttributeName: 'category', SearchSchemaElementType: 'HASH' },
          ...Array.from({ length: 18 }, (_, i) => ({ AttributeName: `filter${i}`, SearchSchemaElementType: 'INLINE_FILTER' })),
        ],
      }),
    ],
  });
});

test.each([19, 25])('throws when the search schema has %d INLINE_FILTER elements', (count) => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: inlineFilters(count),
  })).toThrow(`vector index "vectorIndex" can have at most 18 INLINE_FILTER search schema elements, got ${count} (remove ${count - 18} of them)`);
});

describe('grants.vectorSearch', () => {
  test('grants SearchVectors on the index resources only', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grants.vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['TableCD117FA1', 'Arn'] }, '/index/*']],
            },
          },
        ],
      },
    });
  });

  test('grants SearchVectors on the index resources in each replication region', () => {
    const replicatedStack = new Stack(app, 'ReplicatedStack', { env: { region: 'us-east-1' } });
    const table = new Table(replicatedStack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicationRegions: ['eu-west-2', 'eu-central-1'],
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(replicatedStack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grants.vectorSearch(role);

    const regionalIndexArn = (region: string) => ({
      'Fn::Join': ['', [
        'arn:', { Ref: 'AWS::Partition' }, `:dynamodb:${region}:`, { Ref: 'AWS::AccountId' }, ':table/', { Ref: 'TableCD117FA1' }, '/index/*',
      ]],
    });
    Template.fromStack(replicatedStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: [
              { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['TableCD117FA1', 'Arn'] }, '/index/*']] },
              regionalIndexArn('eu-west-2'),
              regionalIndexArn('eu-central-1'),
            ],
          },
        ],
      },
    });
  });

  test('grants SearchVectors on the index resources of a table imported by name', () => {
    const importedTable = Table.fromTableName(stack, 'ImportedTable', 'my-table');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    TableGrants.fromTable(importedTable).vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: importedByNameIndexArn,
          },
        ],
      },
    });
  });

  test('grants SearchVectors on the index resources of a table imported by ARN in another region', () => {
    const importedTable = Table.fromTableArn(stack, 'ImportedTable', 'arn:aws:dynamodb:eu-west-1:111111111111:table/my-table');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    TableGrants.fromTable(importedTable).vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: 'arn:aws:dynamodb:eu-west-1:111111111111:table/my-table/index/*',
          },
        ],
      },
    });
  });

  test('grants SearchVectors on the index resources of a table imported by name in each region passed to TableGrants.fromTable', () => {
    const importedTable = Table.fromTableName(stack, 'ImportedTable', 'my-table');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    TableGrants.fromTable(importedTable, ['us-west-2']).vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: [
              importedByNameIndexArn,
              {
                'Fn::Join': ['', [
                  'arn:', { Ref: 'AWS::Partition' }, ':dynamodb:us-west-2:', { Ref: 'AWS::AccountId' }, ':table/my-table/index/*',
                ]],
              },
            ],
          },
        ],
      },
    });
  });

  test('grantFullAccess covers the index resources of a table whose only index is a vector index', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grantFullAccess(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:*',
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': ['TableCD117FA1', 'Arn'] },
              { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['TableCD117FA1', 'Arn'] }, '/index/*']] },
            ],
          },
        ],
      },
    });
  });

  test('grantReadData does not include SearchVectors', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grantReadData(role);

    const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
    const actions = Object.values(policies).flatMap(
      (p: any) => p.Properties.PolicyDocument.Statement.flatMap((s: any) => [s.Action].flat()),
    );
    expect(actions).not.toContain('dynamodb:SearchVectors');
  });

  test('grants SearchVectors to a principal with no identity policy through the table resource policy', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });

    table.grants.vectorSearch(new iam.AccountPrincipal('222222222222'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      ResourcePolicy: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'dynamodb:SearchVectors',
              Effect: 'Allow',
              Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::222222222222:root']] } },
              Resource: '*',
            },
          ],
        },
      },
    });
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('grants SearchVectors to a role imported from another account through the table resource policy', () => {
    const accountStack = new Stack(app, 'AccountStack', { env: { account: '123456789012', region: 'us-east-1' } });
    const table = new Table(accountStack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });

    table.grants.vectorSearch(iam.Role.fromRoleArn(accountStack, 'RemoteRole', 'arn:aws:iam::222222222222:role/Remote'));

    const template = Template.fromStack(accountStack);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      ResourcePolicy: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'dynamodb:SearchVectors',
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::222222222222:role/Remote' },
              Resource: '*',
            },
          ],
        },
      },
    });
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('also grants read access to a customer-managed KMS key', () => {
    const table = new Table(stack, 'EncryptedTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.CUSTOMER_MANAGED,
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grants.vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['kms:Decrypt']),
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['EncryptedTableKey9BE7B4E0', 'Arn'] },
          }),
        ]),
      },
    });
  });

  test('throws when the grantee is a ServicePrincipal', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });

    expect(() => table.grants.vectorSearch(new iam.ServicePrincipal('bedrock.amazonaws.com')))
      .toThrow(/DynamoDB grant\* methods do not support ServicePrincipal grantees/);
  });

  test('throws when the grantee is a wrapped ServicePrincipal', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const principal = new iam.ServicePrincipal('bedrock.amazonaws.com').withConditions({
      StringEquals: { 'aws:SourceAccount': '123456789012' },
    });

    expect(() => table.grants.vectorSearch(principal))
      .toThrow(/DynamoDB grant\* methods do not support ServicePrincipal grantees/);
  });

  test.each(['dynamodb:LeadingKeys', 'dynamodb:Attributes', 'dynamodb:Select', 'dynamodb:leadingkeys'])('throws when the grantee has the condition key %s', (key) => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
    const grantee = new iam.PrincipalWithConditions(role, { 'ForAllValues:StringEquals': { [key]: ['x'] } });

    expect(() => table.grants.vectorSearch(grantee)).toThrow(`vectorSearch() does not support a grantee with the condition key ${JSON.stringify(key)}, because fine-grained access control keys are not in the SearchVectors request context (grant to the principal without this condition)`);
  });

  test('throws when an account principal has a fine-grained access control condition', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const grantee = new iam.AccountPrincipal('111122223333').withConditions({
      'ForAllValues:StringEquals': { 'dynamodb:Attributes': ['title'] },
    });

    expect(() => table.grants.vectorSearch(grantee)).toThrow(/does not support a grantee with the condition key "dynamodb:Attributes"/);
  });

  test('throws when the fine-grained access control key is not the first key of the first condition block', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
    const grantee = new iam.PrincipalWithConditions(role, {
      'StringEquals': { 'aws:SourceVpc': 'vpc-12345678' },
      'ForAllValues:StringEquals': { 'aws:PrincipalTag/team': ['a'], 'dynamodb:LeadingKeys': ['x'] },
    });

    expect(() => table.grants.vectorSearch(grantee)).toThrow(/condition key "dynamodb:LeadingKeys"/);
  });

  test('accepts a grantee whose condition block is a token', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });

    table.grants.vectorSearch(new iam.PrincipalWithConditions(role, {
      StringEquals: Lazy.any({ produce: () => ({ 'aws:SourceVpc': 'vpc-12345678' }) }),
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({ Action: 'dynamodb:SearchVectors' })]),
      },
    });
  });

  test('accepts a grantee whose conditions name no fine-grained access control key', () => {
    const table = newTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });

    table.grants.vectorSearch(new iam.PrincipalWithConditions(role, { StringEquals: { 'aws:SourceVpc': 'vpc-12345678' } }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({ Action: 'dynamodb:SearchVectors' })]),
      },
    });
  });
});

test('throws when search schema is an empty array', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [],
  })).toThrow('vector index "vectorIndex" has an empty search schema (omit searchSchema or add at least one element)');
});

// E3039 reports attribute definitions that no key schema references. DynamoDB
// requires the attributes of a vector index search schema in AttributeDefinitions,
// so Table acknowledges the rule when a vector index declares a search schema.
describe('CloudFormation-Validate E3039', () => {
  let reportApp: App;
  let reportStack: Stack;

  beforeEach(() => {
    reportApp = new App({ postCliContext: AssemblyValidationReport.APP_CONTEXT });
    reportStack = new Stack(reportApp, 'Stack');
  });

  function newReportTable(): Table {
    return new Table(reportStack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }

  test('reports an attribute definition that no key schema references', () => {
    const table = newReportTable();
    (table.node.defaultChild as CfnTable).addPropertyOverride('AttributeDefinitions', [
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'unused', AttributeType: 'S' },
    ]);

    AssemblyValidationReport.fromApp(reportApp).hasViolation({ ruleName: 'E3039' });
  });

  test('reports an unused attribute definition when the vector index has no search schema', () => {
    const table = newReportTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    (table.node.defaultChild as CfnTable).addPropertyOverride('AttributeDefinitions', [
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'unused', AttributeType: 'S' },
    ]);

    AssemblyValidationReport.fromApp(reportApp).hasViolation({ ruleName: 'E3039' });
  });

  test('does not report the attributes of a vector index search schema', () => {
    const table = newReportTable();
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
      searchSchema: [
        { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
        { attribute: { name: 'year', type: AttributeType.NUMBER }, type: SearchSchemaElementType.INLINE_FILTER },
      ],
    });

    AssemblyValidationReport.fromApp(reportApp).hasNoViolation({ ruleName: 'E3039' });
  });

  test('acknowledges E3039 once for the whole table, which also hides an unused attribute definition', () => {
    const table = newReportTable();
    for (const indexName of ['vi1', 'vi2']) {
      table.addVectorIndex({
        indexName,
        vectorAttribute: `embedding${indexName}`,
        dimensions: 128,
        distanceFunction: VectorDistanceFunction.COSINE,
        searchSchema: [{ attribute: { name: `category${indexName}`, type: AttributeType.STRING }, type: SearchSchemaElementType.HASH }],
      });
    }
    (table.node.defaultChild as CfnTable).addPropertyOverride('AttributeDefinitions', [
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'categoryvi1', AttributeType: 'S' },
      { AttributeName: 'categoryvi2', AttributeType: 'S' },
      { AttributeName: 'unused', AttributeType: 'S' },
    ]);

    // The acknowledgement covers the whole table, so the unused definition is not reported either.
    AssemblyValidationReport.fromApp(reportApp).hasNoViolation({ ruleName: 'E3039' });
    expect(table.node.metadata.filter(m => m.type === Validations.ACKNOWLEDGED_RULES_METADATA_KEY)).toHaveLength(1);
  });
});
