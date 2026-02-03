/// !cdk-integ *
import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class Ruby32Stack extends cdk.Stack {
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

class Ruby33Stack extends cdk.Stack {
  public readonly functionName: string;
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'MyRuby33Lambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'rubyhandler')),
      handler: 'index.main',
      runtime: lambda.Runtime.RUBY_3_3,
    });

    this.functionName = fn.functionName;
  }
}

class Ruby34Stack extends cdk.Stack {
  public readonly functionName: string;
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'MyRuby34Lambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'rubyhandler')),
      handler: 'index.main',
      runtime: lambda.Runtime.RUBY_3_4,
    });

    this.functionName = fn.functionName;
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const ruby32Stack = new Ruby32Stack(app, 'lambda-test-assets-file-for-ruby32');
const ruby33Stack = new Ruby33Stack(app, 'lambda-test-assets-file-for-ruby33');
const ruby34Stack = new Ruby34Stack(app, 'lambda-test-assets-file-for-ruby34');

const integ = new IntegTest(app, 'RubyRuntimeTest', {
  testCases: [ruby32Stack, ruby33Stack, ruby34Stack],
});
for (const stack of [ruby32Stack, ruby33Stack, ruby34Stack]) {
  const invoke = integ.assertions.invokeFunction({
    functionName: stack.functionName,
  });

  invoke.expect(ExpectedResult.objectLike({
    Payload: '{"statusCode":200,"body":"\\"Hello from Lambda!\\""}',
  }));
}

app.synth();
