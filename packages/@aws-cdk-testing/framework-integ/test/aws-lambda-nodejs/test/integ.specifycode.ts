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

    const pathToBuildScript = path.join(__dirname, 'integ-handlers/build.js');
    const customCommand = ['node', pathToBuildScript];
    const outputDirectoryFromCustomCommand = path.join(__dirname, 'integ-handlers/custom_command_output');

    this.lambdaFunction = new lambda.NodejsFunction(this, 'codespecified', {
      handler: 'mylambdafile.myfunction',
      code: Code.fromCustomCommand(
        outputDirectoryFromCustomCommand,
        customCommand,
      ),
    });
  }
}

/// !cdk-integ cdk-integ-lambda-nodejs-codespecified LambdaNodeJsCodeSpecified/DefaultTest/DeployAssert
const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-codespecified');
const integ = new IntegTest(app, 'LambdaNodeJsCodeSpecified', {
  testCases: [stack],
  diffAssets: true,
});

const response = integ.assertions.invokeFunction({
  functionName: stack.lambdaFunction.functionName,
});

response.expect(ExpectedResult.objectLike({
  // expect invoking without error
  StatusCode: 200,
}));
