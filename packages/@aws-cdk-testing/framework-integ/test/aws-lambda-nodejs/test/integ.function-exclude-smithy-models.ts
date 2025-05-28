import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LAMBDA_NODEJS_SDK_V3_EXCLUDE_SMITHY_PACKAGES } from 'aws-cdk-lib/cx-api';

class TestStack extends Stack {
  public lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'NodeJsFunction', {
      entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
      runtime: Runtime.NODEJS_18_X,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [LAMBDA_NODEJS_SDK_V3_EXCLUDE_SMITHY_PACKAGES]: true,
  },
});
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-18-exclude-smithy');
new IntegTest(app, 'NodeJsFunctionExcludeSmithyInteg', {
  testCases: [stack],
  diffAssets: true,
});

