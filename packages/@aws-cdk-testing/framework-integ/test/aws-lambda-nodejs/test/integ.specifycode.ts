import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Code, IFunction } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

class TestStack extends Stack {
  public lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This test generates a file from `integ-handlers/custom_command_input/custom_command_handler.js` and places that generated file
    // at `integ-handlers/custom_command_output/mylambdafile.js`.
    // Then mylambdafile.js is the code that's uploaded to the Lambda function.

    const pathToBuildScript = path.join(__dirname, 'integ-handlers/custom_command_input/build.sh');
    const customCommand = ['bash', pathToBuildScript];
    const outputDirectoryFromCustomCommand = path.join(__dirname, 'integ-handlers/custom_command_output');

    this.lambdaFunction = new lambda.NodejsFunction(this, 'codespecified', {
      handler: 'mylambdafile.handler',
      code: Code.fromCustomCommand(
        outputDirectoryFromCustomCommand,
        customCommand,
      ),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-codespecified');
const integ = new IntegTest(app, 'LambdaNodeJsCodeSpecified', {
  testCases: [stack],
  diffAssets: true,
});

const response = integ.assertions.invokeFunction({
  functionName: stack.lambdaFunction.functionName,
});

response.expect(ExpectedResult.objectLike({
  StatusCode: 200, // The lambda can fail to execute but still have StatusCode 200 -- so it's necessary to check that the Payload is correct.
  Payload: '"NICE"', // The generated lambda function returns text that says "NICE".
}));
