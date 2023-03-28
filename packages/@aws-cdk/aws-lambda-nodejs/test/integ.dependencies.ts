/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This function uses aws-sdk but it will not be included
    new lambda.NodejsFunction(this, 'external', {
      entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
      runtime: Runtime.NODEJS_16_X,
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

const app = new App();
<<<<<<< HEAD
new TestStack(app, 'cdk-integ-lambda-nodejs-dependencies');
=======
const sdkV2testCase = new SdkV2TestStack(app, 'cdk-integ-lambda-nodejs-dependencies');
const sdkV3testCase = new SdkV3TestStack(app, 'cdk-integ-lambda-nodejs-dependencies-for-sdk-v3');

const integ = new IntegTest(app, 'LambdaDependencies', {
  testCases: [sdkV2testCase, sdkV3testCase],
});

for (const testCase of [sdkV2testCase, sdkV3testCase]) {
  const response = integ.assertions.invokeFunction({
    functionName: testCase.lambdaFunction.functionName,
  });
  response.expect(ExpectedResult.objectLike({
    // expect invoking without error
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
    Payload: 'null',
  }));
}

>>>>>>> b1c9ab2348 (fix(lambda-nodejs): pnpm no longer supports nodejs14.x (#24821))
app.synth();
