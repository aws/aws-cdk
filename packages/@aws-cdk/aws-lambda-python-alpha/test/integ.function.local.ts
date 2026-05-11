// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Exercises the local (Docker-less) bundling path across the two Lambda Python
 * base-image tiers (AL2 for 3.11, AL2023 for 3.12) and both architectures.
 *
 * Host requirements: `python` with `pip` on PATH.
 *
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly functionNames: string[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler');

    const matrix: Array<{ id: string; runtime: Runtime; architecture: Architecture }> = [
      { id: 'al2-x86_64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.X86_64 },
      { id: 'al2-arm64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.ARM_64 },
      { id: 'al2023-x86_64', runtime: Runtime.PYTHON_3_12, architecture: Architecture.X86_64 },
      { id: 'al2023-arm64', runtime: Runtime.PYTHON_3_12, architecture: Architecture.ARM_64 },
    ];

    for (const { id: fnId, runtime, architecture } of matrix) {
      const fn = new lambda.PythonFunction(this, `local-${fnId}`, {
        entry,
        runtime,
        architecture,
        bundling: {
          local: true,
        },
      });
      this.functionNames.push(fn.functionName);

      new CfnOutput(this, `LocalFunctionArn-${fnId}`, {
        value: fn.functionArn,
      });
    }
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'integ-lambda-python-function-local');
const integ = new IntegTest(app, 'lambda-python-function-local', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

testCase.functionNames.forEach(functionName => {
  const invoke = integ.assertions.invokeFunction({ functionName });
  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
});

app.synth();
