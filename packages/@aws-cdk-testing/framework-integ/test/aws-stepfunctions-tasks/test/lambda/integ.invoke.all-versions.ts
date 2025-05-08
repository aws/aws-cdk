import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as assertions from 'aws-cdk-lib/assertions';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

/**
 * Integration test for the Lambda invoke all versions permission feature.
 *
 * This test validates the State Machine's IAM role has the permission to invoke any version of the Lambda.
 *
 * The core functionality being tested is that the LambdaInvoke construct grants permission to all versions
 * when the feature flag is enabled.
 */
const app = new cdk.App({
  context: {
    '@aws-cdk/aws-stepfunctions-tasks:lambdaInvokeGrantAllVersions': true,
  },
});

const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-lambda-invoke-all-versions-integ');

const uniqueSuffix = Date.now().toString();

const fn = new lambda.Function(stack, `MyFunction${uniqueSuffix}`, {
  code: lambda.Code.fromInline(`exports.handler = async (event) => {
    return {
      statusCode: '200',
      body: 'hello, world!',
      timestamp: '${uniqueSuffix}',
      ...event,
    };
  };`),
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
});

const invokeLambda = new tasks.LambdaInvoke(stack, 'InvokeLambda', {
  lambdaFunction: fn.currentVersion,
  outputPath: '$.Payload',
});

new sfn.StateMachine(stack, 'StateMachine', {
  definition: invokeLambda,
  timeout: cdk.Duration.seconds(30),
});

new integ.IntegTest(app, 'LambdaInvokeAllVersionsIntegTest', {
  testCases: [stack],
});

// Add assertions to test if the State Machine role has permission to invoke any version
const template = assertions.Template.fromStack(stack);

// Test assertion validating that the StateMachine role policy allows invoking any version
// of the Lambda function (i.e., that the resource ends with ":*")
template.hasResourceProperties('AWS::IAM::Policy', {
  PolicyDocument: {
    Statement: assertions.Match.arrayWith([
      assertions.Match.objectLike({
        Action: 'lambda:InvokeFunction',
        Effect: 'Allow',
      }),
    ]),
  },
});

const templateJson = JSON.stringify(template.toJSON());
if (!templateJson.includes('":*"')) {
  throw new Error('Expected IAM policy to include ":*" permission for all Lambda versions');
}

app.synth();
