import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  public lambdaFunctions: IFunction[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const runtimes: Runtime[]= [
      Runtime.NODEJS_18_X, Runtime.NODEJS_20_X, Runtime.NODEJS_LATEST, Runtime.NODEJS_22_X,
    ];

    runtimes.forEach((runtime, index) => {
      this.lambdaFunctions.push(new lambda.NodejsFunction(this, `func-${runtime.name}-${index}`, {
        entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
        runtime: runtime,
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: lambda.SourceMapMode.BOTH,
        },
      }));
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-latest');
const integ = new IntegTest(app, 'LambdaNodeJsLatestInteg', {
  testCases: [stack],
  diffAssets: true,
});

stack.lambdaFunctions.forEach(func=> {
  const response = integ.assertions.invokeFunction({
    functionName: func.functionName,
  });

  response.expect(ExpectedResult.objectLike({
    // expect invoking without error
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
  }));
});
