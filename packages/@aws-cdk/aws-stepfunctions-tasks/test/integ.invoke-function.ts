import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import { Code, Function, Runtime } from '../../aws-lambda/lib';
import tasks = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const handler = new Function(stack, 'Handler', {
  code: Code.asset(path.join(__dirname, 'my-lambda-handler')),
  handler: 'index.main',
  runtime: Runtime.Python36
});

const submitJob = new sfn.Task(stack, 'Invoke Handler', {
  task: new tasks.InvokeFunction(handler),
});

const callbackHandler = new Function(stack, 'CallbackHandler', {
  code: Code.asset(path.join(__dirname, 'my-lambda-handler')),
  handler: 'index.main',
  runtime: Runtime.Python36
});

const taskTokenHandler = new sfn.Task(stack, 'Invoke Handler with task token', {
  task: new tasks.RunLambdaTask(callbackHandler, {
    waitForTaskToken: true,
    payload: {
      token: sfn.Context.taskToken
    }
  }),
  inputPath: '$.guid',
  resultPath: '$.status',
});

const isComplete = new sfn.Choice(stack, 'Job Complete?');
const jobFailed = new sfn.Fail(stack, 'Job Failed', {
  cause: 'AWS Batch Job Failed',
  error: 'DescribeJob returned FAILED',
});
const finalStatus = new sfn.Pass(stack, 'Final step');

const chain = sfn.Chain
  .start(submitJob)
  .next(taskTokenHandler)
  .next(isComplete
    .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
    .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
  );

new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30)
});

app.run();
