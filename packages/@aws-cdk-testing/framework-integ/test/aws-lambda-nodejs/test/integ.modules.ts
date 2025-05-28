import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LAMBDA_NODEJS_USE_LATEST_RUNTIME } from 'aws-cdk-lib/cx-api';

class TypeScriptModuleStack extends Stack {
  public lambdaFunction: lambda.NodejsFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'mts-entry', {
      entry: path.join(__dirname, 'integ-handlers/mts-handler.mts'),
    });
  }
}
class TypeScriptCommonJsStack extends Stack {
  public lambdaFunction: lambda.NodejsFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'cts-entry', {
      entry: path.join(__dirname, 'integ-handlers/cts-handler.cts'),
    });
  }
}
class JavaScriptCommonJsStack extends Stack {
  public lambdaFunction: lambda.NodejsFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'cjs-entry', {
      entry: path.join(__dirname, 'integ-handlers/cjs-handler.cjs'),
    });
  }
}

const app = new App({
  context: {
    [LAMBDA_NODEJS_USE_LATEST_RUNTIME]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const mtsEntryTestCase = new TypeScriptModuleStack(app, 'cdk-integ-lambda-nodejs-modules-mts');
const ctsEntryTestCase = new TypeScriptCommonJsStack(app, 'cdk-integ-lambda-nodejs-modules-cts');
const cjsEntryTestCase = new JavaScriptCommonJsStack(app, 'cdk-integ-lambda-nodejs-modules-cjs');

const integ = new IntegTest(app, 'LambdaModules', {
  testCases: [mtsEntryTestCase, ctsEntryTestCase, cjsEntryTestCase],
  diffAssets: true,
});

for (const testCase of [mtsEntryTestCase, ctsEntryTestCase, cjsEntryTestCase]) {
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

app.synth();
