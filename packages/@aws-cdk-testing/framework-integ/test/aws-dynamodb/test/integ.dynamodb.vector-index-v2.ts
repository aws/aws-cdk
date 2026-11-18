import * as path from 'path';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const indexName = 'SimilarItems';
const dimensions = 128;

class TestStack extends Stack {
  public readonly searcherFunctionNames: string[];

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

    const searcherProps = {
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
    };

    // This function gets SearchVectors only through grants.vectorSearch(),
    // which adds the statement to the function role's identity policy.
    const searcher = new lambda.Function(this, 'VectorSearcher', searcherProps);
    table.grants.vectorSearch(searcher);

    // This function gets SearchVectors only through the table's resource
    // policy. The grant goes to an immutable reference to its role with
    // addGrantsToResources set. So CDK leaves the role's identity policy alone
    // and adds the statement to the resource policy of the primary replica.
    const policySearcherRole = new iam.Role(this, 'PolicySearcherRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });
    const policySearcher = new lambda.Function(this, 'PolicySearcher', { ...searcherProps, role: policySearcherRole });
    table.grants.vectorSearch(iam.Role.fromRoleArn(this, 'PolicySearcherRoleRef', policySearcherRole.roleArn, {
      mutable: false,
      addGrantsToResources: true,
    }));

    this.searcherFunctionNames = [searcher.functionName, policySearcher.functionName];
  }
}

const stack = new TestStack(app, 'aws-cdk-dynamodb-vector-index-v2');

const integ = new IntegTest(app, 'dynamodb-vector-index-v2-test', {
  testCases: [stack],
});

// SearchVectors fails if the grant is missing, or if the vector index does
// not exist or is not ACTIVE. Each invoke is retried for up to 5 minutes in
// case the index becomes ACTIVE after the stack finishes deploying.
for (const functionName of stack.searcherFunctionNames) {
  integ.assertions.invokeFunction({
    functionName,
  }).expect(ExpectedResult.objectLike({
    Payload: Match.serializedJson({ status_code: 200 }),
  })).waitForAssertions({
    totalTimeout: Duration.minutes(5),
    interval: Duration.seconds(15),
  });
}
