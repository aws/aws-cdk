import { Match, Template } from '../../assertions';
import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as iam from '../../aws-iam';
import { App, Lazy, Stack } from '../../core';
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
  })).toThrow(/can only be used with PAY_PER_REQUEST billing mode/);
});

test.each([0, 4097])('throws when dimensions %d is out of range', (dimensions) => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/must be an integer between 1 and 4096/);
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

test('throws when dimensions is not an integer', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 2.5,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/must be an integer between 1 and 4096/);
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
      Match.objectLike({ IndexName: 'vi1', Dimensions: 128 }),
      Match.objectLike({ IndexName: 'vi2', Dimensions: 256 }),
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
  })).toThrow(/Duplicate search schema attribute name, category/);
});

test('throws when search schema contains more than one HASH element', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      { attribute: { name: 'region', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
    ],
  })).toThrow(/At most one HASH search schema element is allowed/);
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

  test('grants SearchVectors to a principal in another account through the table resource policy', () => {
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
});

test('throws when search schema is an empty array', () => {
  const table = newTable();
  expect(() => table.addVectorIndex({
    indexName: 'vectorIndex',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [],
  })).toThrow(/must contain at least one element when provided/);
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
});
