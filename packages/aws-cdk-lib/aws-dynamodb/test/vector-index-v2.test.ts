import { Match, Template } from '../../assertions';
import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { App, Lazy, Stack } from '../../core';
import {
  AttributeType,
  Billing,
  Capacity,
  ProjectionType,
  SearchSchemaElementType,
  TableEncryptionV2,
  TableV2,
  VectorDistanceFunction,
} from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
});

// `count` INLINE_FILTER search schema elements named filter0, filter1, and so on.
function inlineFilters(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    attribute: { name: `filter${i}`, type: AttributeType.STRING },
    type: SearchSchemaElementType.INLINE_FILTER,
  }));
}

test('addVectorIndex renders VectorIndexes into the global table', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      { attribute: { name: 'year', type: AttributeType.NUMBER }, type: SearchSchemaElementType.INLINE_FILTER },
    ],
    projectionType: ProjectionType.ALL,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [
      {
        IndexName: 'vectorIndex',
        VectorAttribute: { AttributeName: 'embedding' },
        Dimensions: 128,
        DistanceFunction: 'COSINE',
        Projection: { ProjectionType: 'ALL' },
        SearchSchema: [
          { AttributeName: 'category', SearchSchemaElementType: 'HASH' },
          { AttributeName: 'year', SearchSchemaElementType: 'INLINE_FILTER' },
        ],
      },
    ],
  });
});

test('vector indexes can be provided via props', () => {
  new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    vectorIndexes: [{
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 64,
      distanceFunction: VectorDistanceFunction.EUCLIDEAN,
    }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Projection: { ProjectionType: 'ALL' }, SearchSchema: Match.absent() })],
  });
});

test('search schema attributes are added to attribute definitions, vector attribute is not', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 64,
    distanceFunction: VectorDistanceFunction.DOT_PRODUCT,
    searchSchema: [{ attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    AttributeDefinitions: Match.arrayWith([
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
    ]),
  });
  const table1 = Object.values(Template.fromStack(stack).findResources('AWS::DynamoDB::GlobalTable'))[0];
  const attrNames = table1.Properties.AttributeDefinitions.map((d: any) => d.AttributeName);
  expect(attrNames).not.toContain('embedding');
});

test('throws when the table is not in PAY_PER_REQUEST billing mode', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    billing: Billing.provisioned({
      readCapacity: Capacity.fixed(5),
      writeCapacity: Capacity.autoscaled({ maxCapacity: 10 }),
    }),
  });

  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow('vector index "vectorIndex" requires PAY_PER_REQUEST billing mode, got "PROVISIONED" (set billing: Billing.onDemand() on the table)');
});

test.each([1, 4096])('accepts dimensions %d at the boundary', (dimensions) => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Dimensions: dimensions })],
  });
});

test.each([-1, 0, 4097])('throws when dimensions %d is out of range', (dimensions) => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(`vector index "vectorIndex" has dimensions ${dimensions} (use an integer from 1 to 4096)`);
});

test('throws when a vector index name collides with a GSI name', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addGlobalSecondaryIndex({
    indexName: 'shared',
    partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
  });

  expect(() => table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/Duplicate secondary index name, shared/);
});

test('INCLUDE projection renders its nonKeyAttributes', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });

  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    projectionType: ProjectionType.INCLUDE,
    nonKeyAttributes: ['title', 'price'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [
      Match.objectLike({
        IndexName: 'vectorIndex',
        Projection: { ProjectionType: 'INCLUDE', NonKeyAttributes: ['title', 'price'] },
      }),
    ],
  });
});

test('vector index INCLUDE attributes count toward the limit of 100 projected attributes', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
  })).toThrow("The maximum number of 'nonKeyAttributes' across all secondary indexes is 100");
});

test('throws when INCLUDE projection has no nonKeyAttributes', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    projectionType: ProjectionType.INCLUDE,
  })).toThrow(/[Nn]on-key attributes should be specified/);
});

test('throws when a GSI name collides with a vector index name', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  expect(() => table.addGlobalSecondaryIndex({
    indexName: 'shared',
    partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
  })).toThrow(/Duplicate secondary index name, shared/);
});

test('throws when a vector index name collides with another vector index name', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
  })).toThrow(/Duplicate secondary index name, shared/);
});

test('throws when a vector index name collides with an LSI name', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    sortKey: { name: 'sk', type: AttributeType.STRING },
    localSecondaryIndexes: [{
      indexName: 'shared',
      sortKey: { name: 'lsiSk', type: AttributeType.NUMBER },
    }],
  });

  expect(() => table.addVectorIndex({
    indexName: 'shared',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/Duplicate secondary index name, shared/);
});

test('throws when an LSI name collides with a vector index name', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    sortKey: { name: 'sk', type: AttributeType.STRING },
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
  })).toThrow(/Duplicate secondary index name, shared/);
});

test('multiple vector indexes render on the same table', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [
      Match.objectLike({ IndexName: 'vi1', Dimensions: 128 }),
      Match.objectLike({ IndexName: 'vi2', Dimensions: 256 }),
    ],
  });
});

test('vector index without a search schema on the imperative path renders no SearchSchema', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 256,
    distanceFunction: VectorDistanceFunction.DOT_PRODUCT,
    projectionType: ProjectionType.KEYS_ONLY,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Projection: { ProjectionType: 'KEYS_ONLY' }, SearchSchema: Match.absent() })],
  });
});

test('search schema with only INLINE_FILTER elements renders', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
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

test('on-demand billing with maximum throughput permits a vector index', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    billing: Billing.onDemand({
      maxReadRequestUnits: 100,
      maxWriteRequestUnits: 50,
    }),
  });
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    BillingMode: 'PAY_PER_REQUEST',
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex' })],
  });
});

test.each([2.5, NaN])('throws when dimensions %d is not an integer', (dimensions) => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(`vector index "vectorIndex" has dimensions ${dimensions} (use an integer from 1 to 4096)`);
});

test('tokenized dimensions is not validated at synth and resolves in the template', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: Lazy.number({ produce: () => 128 }),
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vectorIndex', Dimensions: 128 })],
  });
});

test('throws when a search schema attribute conflicts with an existing attribute type', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
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

  test('grants SearchVectors on the index resources in each replica region', () => {
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-west-2' }, { region: 'eu-west-1' }],
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grants.vectorSearch(role);

    const regionalIndexArn = (region: string) => ({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, `:dynamodb:${region}:123456789012:table/`, { Ref: 'TableCD117FA1' }, '/index/*']],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: [
              { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['TableCD117FA1', 'Arn'] }, '/index/*']] },
              regionalIndexArn('us-west-2'),
              regionalIndexArn('eu-west-1'),
            ],
          },
        ],
      },
    });
  });

  test('grants SearchVectors on the index resources and key of one replica through replica(region)', () => {
    const key = new kms.Key(stack, 'Key');
    const replicaKeyArn = 'arn:aws:kms:us-west-2:123456789012:key/11111111-2222-3333-4444-555555555555';
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(key, { 'us-west-2': replicaKeyArn }),
      replicas: [{ region: 'us-west-2' }],
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.replica('us-west-2').grants.vectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kms:Decrypt', 'kms:DescribeKey'],
            Effect: 'Allow',
            Resource: replicaKeyArn,
          },
          {
            Action: 'dynamodb:SearchVectors',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:', { Ref: 'AWS::Partition' }, ':dynamodb:us-west-2:123456789012:table/', { Ref: 'TableCD117FA1' }, '/index/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grantFullAccess covers the index resources of a table whose only index is a vector index', () => {
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });

    table.grants.vectorSearch(new iam.AccountPrincipal('222222222222'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        Match.objectLike({
          Region: 'us-east-1',
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
        }),
      ],
    });
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('grants SearchVectors to a role imported from another account through the table resource policy', () => {
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
    table.addVectorIndex({
      indexName: 'vectorIndex',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });

    table.grants.vectorSearch(iam.Role.fromRoleArn(stack, 'RemoteRole', 'arn:aws:iam::222222222222:role/Remote'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        Match.objectLike({
          Region: 'us-east-1',
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
        }),
      ],
    });
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('also grants read access to a customer-managed KMS key', () => {
    const key = new kms.Key(stack, 'Key');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(key),
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
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
          }),
        ]),
      },
    });
  });

  test('throws when the grantee is a ServicePrincipal', () => {
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [],
  })).toThrow('vector index "vectorIndex" has an empty search schema (omit searchSchema or add at least one element)');
});

// Table acknowledges CloudFormation-Validate rule E3039 for search schema
// attribute definitions. TableV2 does not, because the rule reports no finding
// for AWS::DynamoDB::GlobalTable. This test fails if a later version of the
// validation engine reports E3039 for a TableV2 search schema.
test('search schema attributes produce no E3039 finding on the global table', () => {
  const reportApp = new App({ postCliContext: AssemblyValidationReport.APP_CONTEXT });
  const reportStack = new Stack(reportApp, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  const table = new TableV2(reportStack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
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
