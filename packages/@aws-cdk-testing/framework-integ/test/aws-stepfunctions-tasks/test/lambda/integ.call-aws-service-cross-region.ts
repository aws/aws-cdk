import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  public readonly stateMachine: sfn.StateMachine;
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    // Create a state machine that creates a DynamoDB table in a foreign region, puts an item, and deletes the table

    const targetRegion = 'eu-west-1';
    const tableName = `TestTable${cdk.Stack.of(this).stackName}`;
    const tableArn =
    cdk.Stack.of(this).formatArn({
      service: 'dynamodb',
      resource: 'table',
      resourceName: tableName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
      region: targetRegion,
    });

    const createTable = new tasks.CallAwsServiceCrossRegion(this, 'CreateTable', {
      service: 'dynamodb',
      action: 'createTable',
      parameters: {
        TableName: tableName,
        AttributeDefinitions: [
          {
            AttributeName: 'PK',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'PK',
            KeyType: 'HASH',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      },
      iamResources: ['*'],
      region: targetRegion,
      resultPath: sfn.JsonPath.DISCARD,
    });

    const pollTable = new tasks.CallAwsServiceCrossRegion(this, 'DescribeTable', {
      service: 'dynamodb',
      action: 'describeTable',
      parameters: {
        TableName: tableName,
      },
      iamResources: [tableArn],
      region: targetRegion,
      resultPath: '$.polling',
    });

    const putItem = new tasks.CallAwsServiceCrossRegion(this, 'PutItem', {
      service: 'dynamodb',
      action: 'putItem',
      parameters: {
        TableName: tableName,
        Item: {
          PK: { S: 'id' },
          data: { S: 'some data' },
        },
      },
      iamResources: [tableArn],
      region: targetRegion,
      resultPath: sfn.JsonPath.DISCARD,
    });

    const isAvailable = new sfn.Choice(this, 'IsTableAvailable?');
    const condition1 = sfn.Condition.stringEquals('$.polling.Table.TableStatus', 'ACTIVE');
    const waitPolling = new sfn.Wait(this, 'Wait Polling', {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(5)),
    });
    const poll = pollTable.next(
      isAvailable
        .when(condition1, putItem) //
        .otherwise(waitPolling.next(pollTable)),
    );

    const deleteTable = new tasks.CallAwsServiceCrossRegion(this, 'DeleteTable', {
      service: 'dynamodb',
      action: 'deleteTable',
      parameters: {
        TableName: tableName,
      },
      iamResources: [tableArn],
      region: targetRegion,
      resultPath: sfn.JsonPath.DISCARD,
    });
    putItem.next(deleteTable);

    // listApplications just to test same-region API call
    const listApplications = new tasks.CallAwsServiceCrossRegion(this, 'ListApplications', {
      service: 'appconfig',
      action: 'listApplications',
      iamResources: ['*'],
      region: cdk.Stack.of(this).region,
      parameters: {
        MaxResults: 1,
      },
      resultPath: '$.listApplications',
    });
    deleteTable.next(listApplications);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: createTable.next(poll),
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new TestStack(app, 'aws-stepfunctions-aws-sdk-integ');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn,
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(10),
});

app.synth();
