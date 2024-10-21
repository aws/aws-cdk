import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from '../lib';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly lambdaFunction: IFunction
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction = new lambda.GoFunction(this, 'go-handler-docker', {
      entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
      runtime: Runtime.PROVIDED_AL2023,
      bundling: {
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-golang-provided-al2023');

const integTest = new integ.IntegTest(app, 'lambda-go-runtime', {
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

