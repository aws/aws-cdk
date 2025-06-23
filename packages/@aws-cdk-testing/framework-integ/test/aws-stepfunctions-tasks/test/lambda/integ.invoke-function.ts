import * as path from 'path';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const handler = new Function(stack, 'Handler', {
  code: Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
  handler: 'index.main',
  runtime: Runtime.PYTHON_3_9,
});

const submitJob = new sfn.Task(stack, 'Invoke Handler', {
  task: new tasks.InvokeFunction(handler),
});

const callbackHandler = new Function(stack, 'CallbackHandler', {
  code: Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
  handler: 'index.main',
  runtime: Runtime.PYTHON_3_9,
});

const taskTokenHandler = new sfn.Task(stack, 'Invoke Handler with task token', {
  task: new tasks.RunLambdaTask(callbackHandler, {
    integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
    payload: sfn.TaskInput.fromObject({
      token: sfn.JsonPath.taskToken,
    }),
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
    .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus),
  );

new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

app.synth();
