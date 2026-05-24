import * as path from 'path';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { BundlerType } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const projectRoot = path.join(__dirname, 'integ-handlers/rolldown');

class TestStack extends Stack {
  public readonly lambdaFunction: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.NodejsFunction(this, 'rolldown-handler', {
      entry: path.join(projectRoot, 'handler.ts'),
      projectRoot,
      depsLockFilePath: path.join(projectRoot, 'yarn.lock'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        bundler: BundlerType.ROLLDOWN,
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
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-rolldown');

const integ = new IntegTest(app, 'LambdaNodeJsRolldownInteg', {
  testCases: [stack],
});

const response = integ.assertions.invokeFunction({
  functionName: stack.lambdaFunction.functionName,
});
response.expect(ExpectedResult.objectLike({
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
}));

app.synth();
