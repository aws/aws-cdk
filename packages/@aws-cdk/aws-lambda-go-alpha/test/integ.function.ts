import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly lambdaFunction: IFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.GoFunction(this, 'go-handler-docker', {
      entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
      bundling: {
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-lambda-golang');

const integTest = new integ.IntegTest(app, 'cdk-integ-lambda-golang-al2-integ-test', {
  testCases: [stack],
});

const response = integTest.assertions.invokeFunction({
  functionName: stack.lambdaFunction.functionName,
});

response.expect(integ.ExpectedResult.objectLike({
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '256',
}));
