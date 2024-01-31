import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Stack verification steps :
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> : should return status as SUCCEEDED
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-http-invoke-integ');

const connection = new events.Connection(stack, 'Connection', {
  authorization: events.Authorization.basic('username', cdk.SecretValue.unsafePlainText('password')),
  connectionName: 'integConnection',
});

const httpInvokeTask = new tasks.HttpInvoke(stack, 'Invoke HTTP Endpoint', {
  apiEndpoint: 'https://api.example.com',
  body: JSON.stringify({ foo: 'bar' }),
  connection,
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  queryStringParameters: { id: '123' },
  urlEncodeBody: true,
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: httpInvokeTask,
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'HttpInvokeTest', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution  
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
}));

app.synth();
