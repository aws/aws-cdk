import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, DockerImage, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler-custom-build');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: entry,
      bundling: {
        image: DockerImage.fromBuild(path.join(entry), {
          network: 'default',
        }),
      },
      runtime: Runtime.PYTHON_3_13,
    });
    this.functionName = fn.functionName;
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'cdk-integ-lambda-custom-build');
const integ = new IntegTest(app, 'lambda-python-custom-build', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
