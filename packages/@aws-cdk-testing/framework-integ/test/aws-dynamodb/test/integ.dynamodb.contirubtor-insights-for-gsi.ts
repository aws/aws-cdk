import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Attribute, AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// CDK parameters
const STACK_NAME = 'aws-cdk-dynamodb-contributor-insights-for-gsi';

// DynamoDB table parameters
const TABLE = 'TableWithGlobalSecondaryIndex';
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.STRING };

// DynamoDB global secondary index parameters
const GSI_TEST_CASE_1 = 'GSI-ContributorInsightsEnabled';
const GSI_TEST_CASE_2 = 'GSI-ContributorInsightsDisabled';
const GSI_PARTITION_KEY: Attribute = { name: 'gsiHashKey', type: AttributeType.STRING };

const app = new App();

const stack = new Stack(app, STACK_NAME);

const table = new Table(stack, TABLE, {
  partitionKey: TABLE_PARTITION_KEY,
  removalPolicy: RemovalPolicy.DESTROY,
});

table.addGlobalSecondaryIndex({
  contributorInsightsSpecification: {
    enabled: true,
  },
  indexName: GSI_TEST_CASE_1,
  partitionKey: GSI_PARTITION_KEY,
});
table.addGlobalSecondaryIndex({
  contributorInsightsSpecification: {
    enabled: false,
  },
  indexName: GSI_TEST_CASE_2,
  partitionKey: GSI_PARTITION_KEY,
});

new IntegTest(app, 'aws-cdk-dynamodb-contributor-insights-for-gsi-test', {
  testCases: [stack],
});
