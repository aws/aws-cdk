import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the number 42
 */
class CallDynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const TABLE_NAME = 'Messages';
    const MESSAGE_ID = '1234';
    const firstNumber = 18;
    const secondNumber = 24;

    const table = new ddb.Table(this, 'Messages', {
      tableName: TABLE_NAME,
      partitionKey: {
        name: 'MessageId',
        type: ddb.AttributeType.STRING,
      },
      readCapacity: 10,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const putItemTask = new tasks.DynamoPutItem(this, 'PutItem', {
      item: {
        MessageId: tasks.DynamoAttributeValue.fromString(MESSAGE_ID),
        Text: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.bar')),
        TotalCount: tasks.DynamoAttributeValue.fromNumber(firstNumber),
        Activated: tasks.DynamoAttributeValue.booleanFromJsonPath(sfn.JsonPath.stringAt('$.foo')),
        List: tasks.DynamoAttributeValue.listFromJsonPath(sfn.JsonPath.stringAt('$.list')),
      },
      table,
    });

    const getItemTaskAfterPut = new tasks.DynamoGetItem(this, 'GetItemAfterPut', {
      key: { MessageId: tasks.DynamoAttributeValue.fromString(MESSAGE_ID) },
      table,
    });

    const updateItemTask = new tasks.DynamoUpdateItem(this, 'UpdateItem', {
      key: { MessageId: tasks.DynamoAttributeValue.fromString(MESSAGE_ID) },
      table,
      expressionAttributeValues: {
        ':val': tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt('$.Item.TotalCount.N')),
        ':rand': tasks.DynamoAttributeValue.fromNumber(secondNumber),
      },
      updateExpression: 'SET TotalCount = :val + :rand',
    });

    const getItemTaskAfterUpdate = new tasks.DynamoGetItem(this, 'GetItemAfterUpdate', {
      key: { MessageId: tasks.DynamoAttributeValue.fromString(MESSAGE_ID) },
      table,
      outputPath: sfn.JsonPath.stringAt('$.Item.TotalCount.N'),
    });

    const deleteItemTask = new tasks.DynamoDeleteItem(this, 'DeleteItem', {
      key: { MessageId: tasks.DynamoAttributeValue.fromString(MESSAGE_ID) },
      table,
      resultPath: sfn.JsonPath.DISCARD,
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    })
      .next(putItemTask)
      .next(getItemTaskAfterPut)
      .next(updateItemTask)
      .next(getItemTaskAfterUpdate)
      .next(deleteItemTask);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new CallDynamoDBStack(app, 'aws-stepfunctions-integ');
app.synth();
