import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'VectorTable', {
      tableName: 'aws-cdk-dynamodb-vector-index-integ',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    table.addVectorIndex({
      indexName: 'SimilarItems',
      vectorAttribute: 'embedding',
      dimensions: 128,
      distanceFunction: dynamodb.VectorDistanceFunction.COSINE,
      searchSchema: [
        { attribute: { name: 'category', type: dynamodb.AttributeType.STRING }, type: dynamodb.SearchSchemaElementType.HASH },
        { attribute: { name: 'year', type: dynamodb.AttributeType.NUMBER }, type: dynamodb.SearchSchemaElementType.INLINE_FILTER },
      ],
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.tableName = table.tableName;
  }
}

// Vector indexes are a preview feature currently available only in eu-north-1.
const stack = new TestStack(app, 'aws-cdk-dynamodb-vector-index', {
  env: { region: 'eu-north-1' },
});

const integ = new IntegTest(app, 'dynamodb-vector-index-test', {
  testCases: [stack],
});

// Verify the table (with its vector index) was created and is ACTIVE.
integ.assertions.awsApiCall('DynamoDB', 'describeTable', {
  TableName: stack.tableName,
}).expect(ExpectedResult.objectLike({
  Table: {
    TableStatus: 'ACTIVE',
  },
}));
