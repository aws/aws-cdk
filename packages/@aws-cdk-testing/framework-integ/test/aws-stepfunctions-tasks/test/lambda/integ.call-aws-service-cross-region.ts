import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  public readonly stateMachine: sfn.StateMachine;
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

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
      resultPath: '$.createTable',
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
      resultPath: '$.putItem',
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
      resultPath: '$.deleteTable',
    });

    putItem.next(deleteTable);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: createTable.next(poll),
    });
  }
}

const app = new cdk.App();
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
  totalTimeout: cdk.Duration.seconds(10),
  interval: cdk.Duration.seconds(3),
});

app.synth();
