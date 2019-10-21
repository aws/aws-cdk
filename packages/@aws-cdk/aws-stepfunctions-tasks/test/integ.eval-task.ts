import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const sum = new sfn.Task(stack, 'Sum', {
  task: new tasks.EvalTask({
    expression: '$.a + $.b',
  }),
  resultPath: '$.c'
});

const multiply = new sfn.Task(stack, 'Multiply', {
  task: new tasks.EvalTask({
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
