import * as path from 'path';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as events from 'aws-cdk-lib/aws-events';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { password, username } from './my-lambda-handler';

/*
 * Creates an API Gateway instance with a GET method and mock integration,
 * secured with basic auth. It then creates a matching Connection and uses it
 * in a state machine with a task state to invoke the endpoint.
 *
 * Stack verification steps :
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> : should return status as SUCCEEDED
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-http-invoke-integ');

const authorizerHandler = new lambda.NodejsFunction(stack, 'AuthorizerHandler', {
  entry: path.resolve(__dirname, 'my-lambda-handler', 'index.ts'),
  handler: 'handler',
});

const authorizer = new apigateway.TokenAuthorizer(stack, 'Authorizer', {
  handler: authorizerHandler,
  identitySource: 'method.request.header.Authorization',
  resultsCacheTtl: cdk.Duration.seconds(0),
});

const api = new apigateway.RestApi(stack, 'IntegRestApi');

api.root.addResource('test').addMethod(
  'GET',
  new apigateway.MockIntegration({
    integrationResponses: [
      {
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({ message: 'Hello, tester!' }),
        },
      },
    ],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      'application/json': '{ "statusCode": 200 }',
    },
  }),
  {
    authorizer,
    methodResponses: [
      {
        statusCode: '200',
      },
    ],
  },
);

const connection = new events.Connection(stack, 'Connection', {
  authorization: events.Authorization.basic(username, cdk.SecretValue.unsafePlainText(password)),
});

const httpInvokeTask = tasks.HttpInvoke.jsonata(stack, 'Invoke HTTP Endpoint', {
  apiRoot: api.urlForPath('/'),
  apiEndpoint: sfn.TaskInput.fromText('{% $states.input.apiEndpoint %}'),
  connection,
  method: sfn.TaskInput.fromText('GET'),
  outputs: {
    ResponseBody: '{% $states.result.ResponseBody %}',
  },
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: httpInvokeTask,
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'HttpInvokeTest', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'StartExecution', {
  stateMachineArn: sm.stateMachineArn,
  input: JSON.stringify({
    apiEndpoint: '/test',
  }),
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'DescribeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: JSON.stringify({
    ResponseBody: {
      message: 'Hello, tester!',
    },
  }),
}));

app.synth();
