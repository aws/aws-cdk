import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

/**
 * Pre verification steps:
 * * aws dynamodb create-table --table-name Messages --key-schema AttributeName=MessageId,KeyType=HASH \
 * * --attribute-definitions AttributeName=MessageId,AttributeType=S \
 * * --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5
 */

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'output': should return the number 42
 */

/**
 * Post verification steps:
 * * aws dynamodb delete-table --table-name Messages
 */

class CallDynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const TABLE_NAME = 'Messages';
    const MESSAGE_ID = '1234';
    const firstNumber = 18;
    const secondNumber = 24;

    const putItemTask = new sfn.Task(this, 'PutItem', {
      task: tasks.CallDynamoDB.putItem({
        item: {
          MessageId: new tasks.DynamoAttributeValue().withS(MESSAGE_ID),
          Text: new tasks.DynamoAttributeValue().withS(
            sfn.Data.stringAt('$.bar')
          ),
          TotalCount: new tasks.DynamoAttributeValue().withN(`${firstNumber}`)
        },
        tableName: TABLE_NAME
      })
    });

    const getItemTaskAfterPut = new sfn.Task(this, 'GetItemAfterPut', {
      task: tasks.CallDynamoDB.getItem({
        partitionKey: {
          name: 'MessageId',
          value: new tasks.DynamoAttributeValue().withS(MESSAGE_ID)
        },
        tableName: TABLE_NAME
      })
    });

    const updateItemTask = new sfn.Task(this, 'UpdateItem', {
      task: tasks.CallDynamoDB.updateItem({
        partitionKey: {
          name: 'MessageId',
          value: new tasks.DynamoAttributeValue().withS(MESSAGE_ID)
        },
        tableName: TABLE_NAME,
        expressionAttributeValues: {
          ':val': new tasks.DynamoAttributeValue().withN(
            sfn.Data.stringAt('$.Item.TotalCount.N')
          ),
          ':rand': new tasks.DynamoAttributeValue().withN(`${secondNumber}`)
        },
        updateExpression: 'SET TotalCount = :val + :rand'
      })
    });

    const getItemTaskAfterUpdate = new sfn.Task(this, 'GetItemAfterUpdate', {
      task: tasks.CallDynamoDB.getItem({
        partitionKey: {
          name: 'MessageId',
          value: new tasks.DynamoAttributeValue().withS(MESSAGE_ID)
        },
        tableName: TABLE_NAME
      }),
      outputPath: sfn.Data.stringAt('$.Item.TotalCount.N')
    });

    const deleteItemTask = new sfn.Task(this, 'DeleteItem', {
      task: tasks.CallDynamoDB.deleteItem({
        partitionKey: {
          name: 'MessageId',
          value: new tasks.DynamoAttributeValue().withS(MESSAGE_ID)
        },
        tableName: TABLE_NAME
      }),
      resultPath: 'DISCARD'
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' })
    })
      .next(putItemTask)
      .next(getItemTaskAfterPut)
      .next(updateItemTask)
      .next(getItemTaskAfterUpdate)
      .next(deleteItemTask);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn
    });
  }
}

const app = new cdk.App();
new CallDynamoDBStack(app, 'aws-stepfunctions-integ');
app.synth();
