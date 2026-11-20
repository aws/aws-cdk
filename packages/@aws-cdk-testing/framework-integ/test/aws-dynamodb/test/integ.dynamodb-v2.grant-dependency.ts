import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';

/*
 * A TableV2 grant that adds a statement to the resource policy can be used as a dependency.
 * Each topic depends on the table that holds the statement.
 */

const app = new App();
const stack = new Stack(app, 'aws-cdk-dynamodb-v2-grant-dependency');

// A grant to the account root goes to the table's resource policy
const table = new dynamodb.TableV2(stack, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  removalPolicy: RemovalPolicy.DESTROY,
});
const tableTopic = new sns.Topic(stack, 'TableTopic');
table.grantReadData(new iam.AccountRootPrincipal()).applyBefore(tableTopic);

// A statement added to the stream's resource policy
const streamTable = new dynamodb.TableV2(stack, 'StreamTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  dynamoStream: dynamodb.StreamViewType.NEW_IMAGE,
  removalPolicy: RemovalPolicy.DESTROY,
});
const streamTopic = new sns.Topic(stack, 'StreamTopic');
const streamResult = streamTable.addToStreamResourcePolicy(new iam.PolicyStatement({
  actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator'],
  principals: [new iam.AccountRootPrincipal()],
  resources: ['*'],
}));
streamTopic.node.addDependency(streamResult.policyDependable!);

const integ = new IntegTest(app, 'TableV2GrantDependencyIntegTest', {
  testCases: [stack],
});

const policyWithAction = (action: string) => ExpectedResult.objectLike({
  Policy: Match.serializedJson(Match.objectLike({
    Statement: Match.arrayWith([Match.objectLike({ Action: Match.arrayWith([action]) })]),
  })),
});

integ.assertions.awsApiCall('DynamoDB', 'getResourcePolicy', { ResourceArn: table.tableArn })
  .expect(policyWithAction('dynamodb:GetItem'));
integ.assertions.awsApiCall('DynamoDB', 'getResourcePolicy', { ResourceArn: streamTable.tableStreamArn })
  .expect(policyWithAction('dynamodb:GetRecords'));
