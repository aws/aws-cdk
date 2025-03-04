// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly functionName1: string;
  public readonly functionName2: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn1 = new lambda.PythonFunction(this, 'my_handler-nobody-user', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_13,
      bundling: {
        user: 'nobody',
      },
    });

    const fn2 = new lambda.PythonFunction(this, 'my_handler-root-user', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_13,
      bundling: {
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
    this.functionName1 = fn1.functionName;
    this.functionName2 = fn2.functionName;

    new CfnOutput(this, 'Function1Arn', {
      value: fn1.functionArn,
    });

    new CfnOutput(this, 'Function2Arn', {
      value: fn2.functionArn,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-lambda-python-bundling-user');
const integ = new IntegTest(app, 'lambda-python-bundling-user', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke1 = integ.assertions.invokeFunction({
  functionName: testCase.functionName1,
});

invoke1.expect(ExpectedResult.objectLike({
  Payload: '200',
}));

const invoke2 = integ.assertions.invokeFunction({
  functionName: testCase.functionName1,
});

invoke2.expect(ExpectedResult.objectLike({
  Payload: '200',
}));

app.synth();
