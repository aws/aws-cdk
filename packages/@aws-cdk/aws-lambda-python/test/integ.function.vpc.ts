// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
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

    const vpc = new Vpc(this, 'my_vpc');

    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_9,
      vpc,
    });
    this.functionName = fn.functionName;
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-lambda-python-vpc');

const integ = new IntegTest(app, 'lambda-python-vpc', {
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
