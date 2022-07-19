import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { LambdaInvoke } from '../../lib';


/*
 * Creates a state machine with a task state to invoke a Lambda function
 * via Alias and Version qualifiers.
 *
 * The state machine creates a couple of Lambdas that pass results forward
 * and into a Choice state that validates the output.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-lambda-invoke-integ');

const submitJobLambda = new Function(stack, 'submitJobLambda', {
  code: Code.fromInline(`exports.handler = async () => {
        return {
          statusCode: '200',
          body: 'hello, world!'
        };
      };`),
  runtime: Runtime.NODEJS_14_X,
  handler: 'index.handler',
});

const submitJob = new LambdaInvoke(stack, 'Invoke Handler', {
  lambdaFunction: submitJobLambda.currentVersion,
  outputPath: '$.Payload',
});

const checkJobStateLambda = new Function(stack, 'checkJobStateLambda', {
  code: Code.fromInline(`exports.handler = async function(event, context) {
        return {
          status: event.statusCode === '200' ? 'SUCCEEDED' : 'FAILED'
        };
  };`),
  runtime: Runtime.NODEJS_14_X,
  handler: 'index.handler',
});
const checkJobStateLambdaAlias = checkJobStateLambda.addAlias('IntegTest');

const checkJobState = new LambdaInvoke(stack, 'Check the job state', {
  lambdaFunction: checkJobStateLambdaAlias,
  resultSelector: {
    status: sfn.JsonPath.stringAt('$.Payload.status'),
  },
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

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new integ.IntegTest(app, 'StepFunctionsInvokeLambdaQualifiersTest', {
  testCases: [stack],
});

app.synth();
