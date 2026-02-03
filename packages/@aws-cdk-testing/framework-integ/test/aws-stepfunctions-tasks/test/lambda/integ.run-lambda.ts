import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

/*
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn  <deployed state machine arn> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <from previous command> returns a status of `Succeeded`
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-run-lambda-integ');

const submitJobLambda = new Function(stack, 'submitJobLambda', {
  code: Code.fromInline(`exports.handler = async () => {
        return {
          statusCode: '200',
          body: 'hello, world!'
        };
      };`),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

const submitJob = new sfn.Task(stack, 'Invoke Handler', {
  task: new tasks.RunLambdaTask(submitJobLambda),
  outputPath: '$.Payload',
});

const checkJobStateLambda = new Function(stack, 'checkJobStateLambda', {
  code: Code.fromInline(`exports.handler = async function(event, context) {
        return {
          status: event.statusCode === '200' ? 'SUCCEEDED' : 'FAILED'
        };
  };`),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

const checkJobState = new sfn.Task(stack, 'Check the job state', {
  task: new tasks.RunLambdaTask(checkJobStateLambda),
  outputPath: '$.Payload',
});

const isComplete = new sfn.Choice(stack, 'Job Complete?');
const jobFailed = new sfn.Fail(stack, 'Job Failed', {
  cause: 'Job Failed',
  error: 'Received a status that was not 200',
});
const finalStatus = new sfn.Pass(stack, 'Final step');

const chain = sfn.Chain.start(submitJob)
  .next(checkJobState)
  .next(
    isComplete
      .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
      .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus),
  );

new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

app.synth();
