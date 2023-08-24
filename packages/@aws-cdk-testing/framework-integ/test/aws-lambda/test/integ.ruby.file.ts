import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  public readonly functionName: string;
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'MyRubyLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'rubyhandler')),
      handler: 'index.main',
      runtime: lambda.Runtime.RUBY_3_2,
    });

    this.functionName = fn.functionName;
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'lambda-test-assets-file');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

const invoke = integ.assertions.invokeFunction({
  functionName: stack.functionName,
});
invoke.expect(ExpectedResult.objectLike({
  Payload: '{"statusCode":200,"body":"\\"Hello from Lambda!\\""}',
}));

app.synth();
