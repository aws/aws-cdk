import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LAMBDA_NODEJS_USE_LATEST_RUNTIME } from 'aws-cdk-lib/cx-api';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  public lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(LAMBDA_NODEJS_USE_LATEST_RUNTIME, false);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'latest', {
      entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
      bundling: {
        minify: true,
        nodeModules: ['delay'],
        forceDockerBundling: true,
      },
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

const response = integ.assertions.invokeFunction({
  functionName: stack.lambdaFunction.functionName,
});

response.expect(ExpectedResult.objectLike({
  // expect invoking without error
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
}));
