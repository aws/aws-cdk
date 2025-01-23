import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler'), {
        include: ['index.py'],
      }),
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: 'index.main',
    });

    this.functionName = fn.functionName;
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-asset-include');

const integ = new IntegTest(app, 'cdk-integ-asset-include-test', {
  testCases: [stack],
});

const invoke = integ.assertions.invokeFunction({
  functionName: stack.functionName,
});
invoke.expect(ExpectedResult.objectLike({
  Payload: '{"message": "Hello, world!"}',
}));
