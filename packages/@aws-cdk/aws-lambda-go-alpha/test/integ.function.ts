import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly lambdaFunction: IFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // assert that beforeBundling/afterBundling are called only once
    let beforeBundlingCallCount = 0;
    let afterBundlingCallCount = 0;

    this.lambdaFunction = new lambda.GoFunction(this, 'go-handler-docker', {
      entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
      bundling: {
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
        commandHooks: {
          beforeBundling() {
            if (1 < beforeBundlingCallCount) {
              throw new Error('afterBundling should called only once');
            }
            beforeBundlingCallCount++;
            return [];
          },
          afterBundling() {
            if (1 < afterBundlingCallCount) {
              throw new Error('afterBundling should called only once');
            }
            afterBundlingCallCount++;
            return [];
          },
        },
      },
    });
  }
}

const app = new App();
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
