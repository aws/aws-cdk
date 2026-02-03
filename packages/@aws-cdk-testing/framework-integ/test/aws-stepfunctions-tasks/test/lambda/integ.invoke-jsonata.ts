import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

/*
 * Creates a state machine with a task state to invoke a Lambda function
 * The state machine creates a couple of Lambdas that pass results forward
 * and into a Choice state that validates the output.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-lambda-invoke-jsonata-integ');

const submitJobLambda = new Function(stack, 'submitJobLambda', {
  code: Code.fromInline(`exports.handler = async (event, context) => {
        return {
          statusCode: '200',
          body: 'hello, world!',
          ...event,
        };
      };`),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

const submitJob = LambdaInvoke.jsonata(stack, 'Invoke Handler', {
  lambdaFunction: submitJobLambda,
  payload: sfn.TaskInput.fromObject({
    execId: '{% $states.context.Execution.Id %}',
    execInput: '{% $states.context.Execution.Input %}',
    execName: '{% $states.context.Execution.Name %}',
    execRoleArn: '{% $states.context.Execution.RoleArn %}',
    execStartTime: '{% $states.context.Execution.StartTime %}',
    stateEnteredTime: '{% $states.context.State.EnteredTime %}',
    stateName: '{% $states.context.State.Name %}',
    stateRetryCount: '{% $states.context.State.RetryCount %}',
    stateMachineId: '{% $states.context.StateMachine.Id %}',
    stateMachineName: '{% $states.context.StateMachine.Name %}',
  }),
  outputs: '{% $states.result.Payload %}',
});

const checkJobStateLambda = new Function(stack, 'checkJobStateLambda', {
  code: Code.fromInline(`exports.handler = async function(event, context) {
        const expectedFields = [
          'execId', 'execInput', 'execName', 'execRoleArn',
          'execStartTime', 'stateEnteredTime', 'stateName',
          'stateRetryCount', 'stateMachineId', 'stateMachineName',
        ];
        const fieldsAreSet = expectedFields.every(field => event[field] !== undefined);
        return {
          status: event.statusCode === '200' && fieldsAreSet ? 'SUCCEEDED' : 'FAILED'
        };
  };`),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

const checkJobState = LambdaInvoke.jsonata(stack, 'Check the job state', {
  lambdaFunction: checkJobStateLambda,
  outputs: {
    status: '{% $states.result.Payload.status %}',
  },
});

const isComplete = sfn.Choice.jsonata(stack, 'Job Complete?');
const jobFailed = sfn.Fail.jsonata(stack, 'Job Failed', {
  cause: 'Job Failed',
  error: 'Received a status that was not 200',
});
const finalStatus = sfn.Pass.jsonata(stack, 'Final step');

const chain = sfn.Chain.start(submitJob)
  .next(checkJobState)
  .next(
    isComplete
      .when(sfn.Condition.jsonata("{% $states.input.status = 'FAILED' %}"), jobFailed)
      .when(sfn.Condition.jsonata("{% $states.input.status = 'SUCCEEDED' %}"), finalStatus),
  );

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('@aws-sdk/client-sfn', 'StartExecution', {
  stateMachineArn: sm.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions.awsApiCall('@aws-sdk/client-sfn', 'DescribeExecution', {
  executionArn,
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(10),
  interval: cdk.Duration.seconds(3),
});

app.synth();
