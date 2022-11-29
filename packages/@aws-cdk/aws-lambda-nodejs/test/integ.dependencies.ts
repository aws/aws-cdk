import * as path from 'path';
import { Runtime, IFunction } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class SdkV2TestStack extends Stack {
  public lambdaFunction: IFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This function uses aws-sdk but it will not be included
    this.lambdaFunction = new lambda.NodejsFunction(this, 'external', {
      entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        // Will be installed, not bundled
        // (delay is a zero dependency package and its version is fixed
        // in the package.json to ensure a stable hash for this integ test)
        nodeModules: ['delay'],
        forceDockerBundling: true,
      },
    });
  }
}

class SdkV3TestStack extends Stack {
  public lambdaFunction: IFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This function uses @aws-sdk/* but it will not be included
    this.lambdaFunction = new lambda.NodejsFunction(this, 'external-sdk-v3', {
      entry: path.join(__dirname, 'integ-handlers/dependencies-sdk-v3.ts'),
      runtime: Runtime.NODEJS_18_X,
    });
  }
}

const app = new App();
const sdkV2testCase = new SdkV2TestStack(app, 'cdk-integ-lambda-nodejs-dependencies');
const sdkV3testCase = new SdkV3TestStack(app, 'cdk-integ-lambda-nodejs-dependencies-for-sdk-v3');

const integ = new IntegTest(app, 'LambdaDependencies', {
  testCases: [sdkV2testCase, sdkV3testCase],
});

for (const testCase of [sdkV2testCase, sdkV3testCase]) {
  const response = integ.assertions.invokeFunction({
    functionName: testCase.lambdaFunction.functionName,
  });
  response.expect(ExpectedResult.exact({
    // expect invoking without error
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
    Payload: 'null',
  }));
}

app.synth();
