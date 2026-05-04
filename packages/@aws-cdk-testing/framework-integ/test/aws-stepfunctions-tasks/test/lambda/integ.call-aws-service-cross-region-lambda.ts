import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/**
 * This test verifies that CallAwsServiceCrossRegion correctly invokes a Lambda
 * function and properly serializes the response as JSON (not as a byte array).
 * See https://github.com/aws/aws-cdk/issues/34768
 *
 * The state machine uses CallAwsServiceCrossRegion with an explicit region
 * parameter, which exercises the cross-region code path and verifies proper
 * response deserialization.
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'aws-sfn-call-aws-service-cross-region-lambda');

// Target Lambda function
const targetLambda = new lambda.Function(stack, 'TargetLambda', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
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
});

// Invoke Lambda using CallAwsServiceCrossRegion (exercises cross-region code path)
// The region is set to us-east-1 explicitly to exercise the cross-region
// serialization logic, which is where the byte array bug manifests.
const crossRegionInvokeTask = tasks.CallAwsServiceCrossRegion.jsonata(
  stack, 'CrossRegionLambdaInvoke', {
    service: 'lambda',
    action: 'invoke',
    region: 'us-east-1',
    parameters: {
      FunctionName: targetLambda.functionArn,
      Payload: JSON.stringify({ hello: 'world' }),
    },
    iamResources: [targetLambda.functionArn],
    iamAction: 'lambda:InvokeFunction',
  },
);

const stateMachine = new sfn.StateMachine(stack, 'TestStateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(crossRegionInvokeTask),
  timeout: cdk.Duration.minutes(5),
});

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// Start the Step Functions execution
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

const executionArn = res.getAttString('executionArn');

// Verify execution succeeds and output contains proper JSON (not byte array)
integ.assertions
  .awsApiCall('StepFunctions', 'describeExecution', {
    executionArn,
  })
  .expect(ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(10),
  })
  .expect(ExpectedResult.objectLike({
    output: Match.stringLikeRegexp(
      '.*"statusCode":200.*"status":"success".*"message":"Hello from target Lambda".*',
    ),
  }));
