/// !cdk-integ *

import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as lambda from '../lib';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-lambda-python-uv');

const functionNames = [];

const pythonFunction39 = new lambda.PythonFunction(stack, 'my_handler_inline_python_39', {
  entry: path.join(__dirname, 'lambda-handler-uv'),
  runtime: Runtime.PYTHON_3_9,
});
functionNames.push(pythonFunction39.functionName);

const pythonFunction310 = new lambda.PythonFunction(stack, 'my_handler_inline_python_310', {
  entry: path.join(__dirname, 'lambda-handler-uv'),
  runtime: Runtime.PYTHON_3_10,
  bundling: {
    assetExcludes: ['.ignorefile', '.python-version'],
  },
});
functionNames.push(pythonFunction310.functionName);

const pythonFunction311 = new lambda.PythonFunction(stack, 'my_handler_inline_python_311', {
  entry: path.join(__dirname, 'lambda-handler-uv'),
  index: 'basic.py',
  runtime: Runtime.PYTHON_3_11,
});
functionNames.push(pythonFunction311.functionName);

const pythonFunction312 = new lambda.PythonFunction(stack, 'my_handler_inline_python_312', {
  entry: path.join(__dirname, 'lambda-handler-uv'),
  runtime: Runtime.PYTHON_3_12,
});
functionNames.push(pythonFunction312.functionName);

const pythonFunction313 = new lambda.PythonFunction(stack, 'my_handler_inline_python_313', {
  entry: path.join(__dirname, 'lambda-handler-uv'),
  index: 'basic.py',
  runtime: Runtime.PYTHON_3_13,
  bundling: {
    assetExcludes: ['.ignorefile'],
  },
});
functionNames.push(pythonFunction313.functionName);

const integTest = new IntegTest(app, 'integ-lambda-python-uv-test', {
  testCases: [stack],
  // disabling update workflow because we don't want to include the assets in the snapshot
  // python bundling changes the asset hash pretty frequently
  stackUpdateWorkflow: false,
});

functionNames.forEach(functionName => {
  const invoke = integTest.assertions.invokeFunction({
    functionName: functionName,
  });

  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
});
