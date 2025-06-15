// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const projectDirectory = path.join(__dirname, 'lambda-handler-project');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(projectDirectory, 'lambda'),
      runtime: Runtime.PYTHON_3_13,
      layers: [
        new lambda.PythonLayerVersion(this, 'Shared', {
          entry: path.join(projectDirectory, 'shared'),
          compatibleRuntimes: [Runtime.PYTHON_3_13],
          bundling: {
            network: 'default',
          },
        }),
      ],
    });
    this.functionName = fn.functionName;
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'cdk-integ-lambda-function-project');
const integ = new IntegTest(app, 'lambda-python-project', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
