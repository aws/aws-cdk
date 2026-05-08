import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/**
 * This test verifies that CallAwsServiceCrossRegion correctly invokes a Lambda
 * function in a different region and properly serializes the response as JSON
 * (not as a byte array). See https://github.com/aws/aws-cdk/issues/34768
 *
 * The state machine is deployed in us-west-2 (via regions constraint) and
 * invokes a Lambda in us-east-1 using CallAwsServiceCrossRegion, exercising
 * the cross-region code path and verifying proper response deserialization.
 */

const TARGET_REGION = 'us-east-1';
const LAMBDA_FUNCTION_NAME = 'integ-cross-region-target-lambda';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

// Target Lambda stack in us-east-1 (explicit env, no cross-stack references)
const targetStack = new cdk.Stack(app, 'aws-sfn-cross-region-lambda-target', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: TARGET_REGION },
});

new lambda.Function(targetStack, 'TargetLambda', {
  functionName: LAMBDA_FUNCTION_NAME,
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

// Caller stack — no explicit env so assertions work without cross-env issues
const callerStack = new cdk.Stack(app, 'aws-sfn-call-aws-service-cross-region-lambda');

// Construct the target Lambda ARN using the known function name and target region
const targetLambdaArn = callerStack.formatArn({
  service: 'lambda',
  resource: 'function',
  resourceName: LAMBDA_FUNCTION_NAME,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
  region: TARGET_REGION,
});

const crossRegionInvokeTask = tasks.CallAwsServiceCrossRegion.jsonata(
  callerStack, 'CrossRegionLambdaInvoke', {
    service: 'lambda',
    action: 'invoke',
    region: TARGET_REGION,
    parameters: {
      FunctionName: targetLambdaArn,
      Payload: JSON.stringify({ hello: 'world' }),
    },
    iamResources: [targetLambdaArn],
    iamAction: 'lambda:InvokeFunction',
  },
);

const stateMachine = new sfn.StateMachine(callerStack, 'TestStateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(crossRegionInvokeTask),
  timeout: cdk.Duration.minutes(5),
});

// callerStack depends on targetStack being deployed first
callerStack.addDependency(targetStack);

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [callerStack],
  regions: ['us-west-2'],
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
