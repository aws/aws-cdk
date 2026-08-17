import { Match, Template } from '../../assertions';
import { App, Lazy, Stack, Validations } from '../../core';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
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

// VectorIndexes is a preview property not yet in the public CloudFormation schema, so
// the built-in CloudFormation-Validate plugin flags it (F3002). Acknowledge it scoped
// to the table construct only, so unrelated schema regressions are not masked.
// TODO: remove once VectorIndexes is public in the CloudFormation schema.
function ackVectorIndexPreview(table: TableV2): TableV2 {
  Validations.of(table).acknowledge(
    { id: 'CloudFormation-Validate::F3002', reason: 'VectorIndexes is a preview property not yet in the public CloudFormation schema' },
  );
  return table;
}

test('addVectorIndex renders VectorIndexes into the global table', () => {
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));

  table.addVectorIndex({
    indexName: 'vi',
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
        IndexName: 'vi',
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
  ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    vectorIndexes: [{
      indexName: 'vi',
      vectorAttribute: 'embedding',
      dimensions: 64,
      distanceFunction: VectorDistanceFunction.EUCLIDEAN,
    }],
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vi', SearchSchema: Match.absent() })],
  });
});

test('search schema attributes are added to attribute definitions, vector attribute is not', () => {
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));
  table.addVectorIndex({
    indexName: 'vi',
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
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/can only be used with PAY_PER_REQUEST billing mode/);
});

test.each([0, 4097])('throws when dimensions %d is out of range', (dimensions) => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/must be an integer between 1 and 4096/);
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

test('throws when INCLUDE projection has no nonKeyAttributes', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
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

test('multiple vector indexes render on the same table', () => {
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));
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
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));
  table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 256,
    distanceFunction: VectorDistanceFunction.DOT_PRODUCT,
    projectionType: ProjectionType.KEYS_ONLY,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vi', SearchSchema: Match.absent() })],
  });
});

test('search schema with only INLINE_FILTER elements renders', () => {
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));
  table.addVectorIndex({
    indexName: 'vi',
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
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    billing: Billing.onDemand({
      maxReadRequestUnits: 100,
      maxWriteRequestUnits: 50,
    }),
  }));
  table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    BillingMode: 'PAY_PER_REQUEST',
    VectorIndexes: [Match.objectLike({ IndexName: 'vi' })],
  });
});

test('throws when dimensions is not an integer', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 2.5,
    distanceFunction: VectorDistanceFunction.COSINE,
  })).toThrow(/must be an integer between 1 and 4096/);
});

test('tokenized dimensions is not validated at synth and resolves in the template', () => {
  const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  }));
  table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: Lazy.number({ produce: () => 128 }),
    distanceFunction: VectorDistanceFunction.COSINE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    VectorIndexes: [Match.objectLike({ IndexName: 'vi', Dimensions: 128 })],
  });
});

test('throws when a search schema attribute conflicts with an existing attribute type', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
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
    indexName: 'vi',
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
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [
      { attribute: { name: 'category', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
      { attribute: { name: 'region', type: AttributeType.STRING }, type: SearchSchemaElementType.HASH },
    ],
  })).toThrow(/At most one HASH search schema element is allowed/);
});

describe('grantVectorSearch', () => {
  test('grants SearchVectors on the index resources only', () => {
    const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    }));
    table.addVectorIndex({
      indexName: 'vi',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grantVectorSearch(role);

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

  test('grantReadData does not include SearchVectors', () => {
    const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    }));
    table.addVectorIndex({
      indexName: 'vi',
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

  test('also grants read access to a customer-managed KMS key', () => {
    const key = new kms.Key(stack, 'Key');
    const table = ackVectorIndexPreview(new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(key),
    }));
    table.addVectorIndex({
      indexName: 'vi',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: VectorDistanceFunction.COSINE,
    });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') });

    table.grantVectorSearch(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['kms:Decrypt']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });
});

test('throws when search schema is an empty array', () => {
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
  });
  expect(() => table.addVectorIndex({
    indexName: 'vi',
    vectorAttribute: 'embedding',
    dimensions: 128,
    distanceFunction: VectorDistanceFunction.COSINE,
    searchSchema: [],
  })).toThrow(/must contain at least one element when provided/);
});
