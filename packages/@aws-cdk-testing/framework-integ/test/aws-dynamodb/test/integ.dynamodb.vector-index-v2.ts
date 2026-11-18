import * as path from 'path';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const indexName = 'SimilarItems';
const dimensions = 128;

class TestStack extends Stack {
  public readonly searcherFunctionName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.TableV2(this, 'VectorTable', {
      tableName: 'aws-cdk-dynamodb-vector-index-v2-integ',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    table.addVectorIndex({
      indexName,
      vectorAttribute: 'embedding',
      dimensions,
      distanceFunction: dynamodb.VectorDistanceFunction.COSINE,
      searchSchema: [
        { attribute: { name: 'category', type: dynamodb.AttributeType.STRING }, type: dynamodb.SearchSchemaElementType.HASH },
        { attribute: { name: 'year', type: dynamodb.AttributeType.NUMBER }, type: dynamodb.SearchSchemaElementType.INLINE_FILTER },
      ],
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // The function gets SearchVectors only through grants.vectorSearch().
    const searcher = new lambda.Function(this, 'VectorSearcher', {
      runtime: lambda.Runtime.PYTHON_3_14,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'vector-search-handler')),
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: table.tableName,
        INDEX_NAME: indexName,
        DIMENSIONS: String(dimensions),
        HASH_ATTRIBUTE: 'category',
        HASH_VALUE: 'books',
      },
    });
    table.grants.vectorSearch(searcher);

    this.searcherFunctionName = searcher.functionName;
  }
}

const stack = new TestStack(app, 'aws-cdk-dynamodb-vector-index-v2');

const integ = new IntegTest(app, 'dynamodb-vector-index-v2-test', {
  testCases: [stack],
});

// SearchVectors fails if the grant is missing, or if the vector index does
// not exist or is not ACTIVE. The invoke is retried for up to 5 minutes in
// case the index becomes ACTIVE after the stack finishes deploying.
integ.assertions.invokeFunction({
  functionName: stack.searcherFunctionName,
}).expect(ExpectedResult.objectLike({
  Payload: Match.serializedJson({ status_code: 200 }),
})).waitForAssertions({
  totalTimeout: Duration.minutes(5),
  interval: Duration.seconds(15),
});
