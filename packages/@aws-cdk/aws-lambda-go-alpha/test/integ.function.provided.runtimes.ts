import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from '../lib';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly lambdaFunctions: IFunction[] = [];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const runtimes: Runtime[]= [
      Runtime.PROVIDED_AL2, Runtime.PROVIDED_AL2023,
    ];

    runtimes.forEach((runtime, index) => {
      this.lambdaFunctions.push(new lambda.GoFunction(this, `go-handler-${runtime.name}-${index}`, {
        entry: path.join(__dirname, 'lambda-handler-vendor', 'cmd', 'api'),
        runtime: runtime,
        bundling: {
          forcedDockerBundling: true,
          goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
        },
      }));
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-golang-provided-al2023');

const integTest = new integ.IntegTest(app, 'lambda-go-runtime', {
  testCases: [stack],
});

stack.lambdaFunctions.forEach((fn) => {
  const response = integTest.assertions.invokeFunction({
    functionName: fn.functionName,
  });
  response.expect(integ.ExpectedResult.objectLike({
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
    Payload: '256',
  }));
});
