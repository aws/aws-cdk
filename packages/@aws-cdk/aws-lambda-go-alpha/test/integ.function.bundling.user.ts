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
  public readonly lambdaFunction_1: IFunction;
  public readonly lambdaFunction_2: IFunction;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaFunction_1 = new lambda.GoFunction(this, 'go-handler-docker-nobody-user', {
      entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
      bundling: {
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
        user: 'nobody',
      },
    });

    this.lambdaFunction_2 = new lambda.GoFunction(this, 'go-handler-docker-root-user', {
      entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
      bundling: {
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
        user: 'root',
        commandHooks: {
          beforeBundling(_inputDir: string, _outputDir: string): string[] {
            return [
              'echo "some content" >> /etc/environment', // Can only be run by root user
            ];
          },
          afterBundling: function (_inputDir: string, _outputDir: string): string[] {
            return [];
          },
        },
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-golang');

const integTest = new integ.IntegTest(app, 'cdk-integ-lambda-golang-bundling-user-test', {
  testCases: [stack],
});

const response1 = integTest.assertions.invokeFunction({
  functionName: stack.lambdaFunction_1.functionName,
});

const response2 = integTest.assertions.invokeFunction({
  functionName: stack.lambdaFunction_2.functionName,
});

response1.expect(integ.ExpectedResult.objectLike({
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '256',
}));

response2.expect(integ.ExpectedResult.objectLike({
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '256',
}));
