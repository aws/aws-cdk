import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  public lambdaFunctions: IFunction[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const runtimes: Runtime[]= [
      Runtime.NODEJS_18_X, Runtime.NODEJS_20_X, Runtime.NODEJS_LATEST, Runtime.NODEJS_22_X,
    ];

    const uniqueRuntimes: Runtime[] = runtimes.filter((value, index, array) => array.findIndex(value1 => value1.runtimeEquals(value)) === index);

    uniqueRuntimes.forEach((runtime) => {
      this.lambdaFunctions.push(new lambdaNodeJs.NodejsFunction(this, `func-${runtime.name}`, {
        entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
        runtime: runtime,
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: lambdaNodeJs.SourceMapMode.BOTH,
        },
      }));
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
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
