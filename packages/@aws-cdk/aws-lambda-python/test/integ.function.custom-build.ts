import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, DockerImage, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler-custom-build');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: entry,
      bundling: { image: DockerImage.fromBuild(path.join(entry)) },
      runtime: Runtime.PYTHON_3_8,
    });
    this.functionName = fn.functionName;
  }
}

const app = new App();
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
app.synth();
