import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

class TestStack extends cdk.Stack {
  public readonly stateMachine: sfn.StateMachine;
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);
    // Create a target Lambda function that returns JSON response
    const targetLambda = new lambda.Function(this, 'TargetLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Target Lambda received event:', JSON.stringify(event, null, 2));
          
          // Return a JSON response that should be properly serialized
          return {
            statusCode: 200,
            body: {
              status: 'success',
              message: 'Hello from target Lambda',
              receivedData: event
            }
          };
        };
      `),
      description: 'Target Lambda function for CallAwsServiceCrossRegion testing',
    });

    // Create a cross-region Lambda invoke task using CallAwsServiceCrossRegion
    const crossRegionInvokeTask = tasks.CallAwsServiceCrossRegion.jsonata(this, 'CrossRegionLambdaInvoke', {
      service: 'lambda',
      action: 'invoke',
      region: 'us-east-1',
      parameters: {
        FunctionName: targetLambda.functionArn,
        Payload: JSON.stringify({
          hello: 'world',
          testData: 'reproduction',
        }),
      },
      iamResources: [targetLambda.functionArn],
      iamAction: 'lambda:InvokeFunction',
    });

    // Create a Step Functions state machine to execute the cross-region task
    this.stateMachine = new sfn.StateMachine(this, 'TestStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(crossRegionInvokeTask),
      timeout: cdk.Duration.minutes(5),
      comment: 'State machine to reproduce issue 34768 - CallAwsServiceCrossRegion byte array bug',
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new TestStack(app, 'aws-stepfunctions-call-aws-service-cross-region-lambda-integ');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// Start the Step Functions execution
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});

const executionArn = res.getAttString('executionArn');

// Describe the execution to see the output
const describe = integ.assertions
  .awsApiCall('StepFunctions', 'describeExecution', {
    executionArn,
  })
  .expect(ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(10),
  });

// Verify that the output contains the expected Lambda response structure as JSON
// This ensures the response is properly serialized as JSON, not as byte array
describe.expect(ExpectedResult.objectLike({
  output: Match.stringLikeRegexp('.*"statusCode":200.*"status":"success".*"message":"Hello from target Lambda".*'),
}));

app.synth();
