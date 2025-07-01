// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<''OK'') response.json
 */

class TestStack extends Stack {
  public readonly functionNames: string[] = [];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pythonFunction39 = new lambda.PythonFunction(this, 'my_handler_inline', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_9,
    });
    this.functionNames.push(pythonFunction39.functionName);

    const pythonFunction310 = new lambda.PythonFunction(this, 'my_handler_python_310', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_10,
    });
    this.functionNames.push(pythonFunction310.functionName);

    const pythonFunction311 = new lambda.PythonFunction(this, 'my_handler_python_311', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_11,
    });
    this.functionNames.push(pythonFunction311.functionName);

    const pythonFunction39Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction39Excludes.functionName);

    const pythonFunction310Excludes = new lambda.PythonFunction(this, 'my_handler_python_310_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_10,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction310Excludes.functionName);

    const pythonFunction311Excludes = new lambda.PythonFunction(this, 'my_handler_python_311_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_11,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction311Excludes.functionName);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'integ-lambda-python-pipenv');
const integ = new IntegTest(app, 'pipenv', {
  testCases: [testCase],
  // disabling update workflow because we don't want to include the assets in the snapshot
  // python bundling changes the asset hash pretty frequently
  stackUpdateWorkflow: false,
});

testCase.functionNames.forEach(functionName => {
  const invoke = integ.assertions.invokeFunction({
    functionName: functionName,
  });

  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
});
app.synth();
