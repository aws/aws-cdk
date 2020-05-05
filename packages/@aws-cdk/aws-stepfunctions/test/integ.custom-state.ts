import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-custom-state-integ');

const finalStatus = new sfn.Pass(stack, 'final step');

const stateJson = {
  Type: 'Task',
  Resource: 'arn:aws:states:::dynamodb:putItem',
  Parameters: {
    TableName: 'my-cool-table',
    Item: {
      id: {
        S: 'my-entry',
      },
    },
  },
  ResultPath: null,
  Next: finalStatus.id,
};

const custom = new sfn.CustomState(stack, 'my custom task', {
  stateJson,
});

const chain = sfn.Chain.start(custom).next(finalStatus);

new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

app.synth();
