import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Code, Function, determineLatestNodeRuntime } from 'aws-cdk-lib/aws-lambda';

const app = new App();
const stack = new Stack(app, 'aws-cdk-lambda-determine-latest-runtime');

const fn = new Function(stack, 'LatestNodeRuntime', {
  code: Code.fromInline(`
    exports.handler = async () => {
      return {
        statusCode: 200,
        body: process.version
      };
    };
  `),
  handler: 'index.handler',
  runtime: determineLatestNodeRuntime(stack),
});

const test = new integ.IntegTest(app, 'lambda-determine-latest-runtime', {
  testCases: [stack],
});

// Assert that the function was created with nodejs22.x runtime
const getFunction = test.assertions.awsApiCall('Lambda', 'getFunction', {
  FunctionName: fn.functionName,
});

getFunction.assertAtPath('Configuration.Runtime', integ.ExpectedResult.stringLikeRegexp('nodejs22.x'));
