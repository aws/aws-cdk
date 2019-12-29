import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const sum = new sfn.Task(stack, 'Sum', {
  task: new tasks.EvaluateExpression({
    expression: '$.a + $.b',
  }),
  resultPath: '$.c'
});

const multiply = new sfn.Task(stack, 'Multiply', {
  task: new tasks.EvaluateExpression({
    expression: '$.c * 2'
  }),
  resultPath: '$.waitSeconds'
});

new sfn.StateMachine(stack, 'StateMachine', {
  definition: sum
    .next(multiply)
    .next(new sfn.Wait(stack, 'Wait', {
      time: sfn.WaitTime.secondsPath('$.waitSeconds')
    })),
});

app.synth();
