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
 * base-image tiers and both architectures:
 *
 *   AL2 (manylinux2014 only): python3.10, python3.11
 *   AL2023 (manylinux_2_28 with manylinux2014 fallback): python3.12, python3.13, python3.14
 *
 * Also includes a manyLinuxTags override case to verify the tag-priority path
 * works end-to-end.
 *
 * Host requirements: `python3` or `python` (with pip) on PATH.
 *
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

interface MatrixEntry {
  readonly id: string;
  readonly runtime: Runtime;
  readonly architecture: Architecture;
  readonly manyLinuxTags?: string[];
}

class TestStack extends Stack {
  public readonly functionNames: string[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler');

    const matrix: MatrixEntry[] = [
      // AL2 tier (manylinux2014)
      { id: 'al2-py310-x86_64', runtime: Runtime.PYTHON_3_10, architecture: Architecture.X86_64 },
      { id: 'al2-py310-arm64', runtime: Runtime.PYTHON_3_10, architecture: Architecture.ARM_64 },
      { id: 'al2-py311-x86_64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.X86_64 },
      { id: 'al2-py311-arm64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.ARM_64 },

      // AL2023 tier (manylinux_2_28 falling back to manylinux2014)
      { id: 'al2023-py312-x86_64', runtime: Runtime.PYTHON_3_12, architecture: Architecture.X86_64 },
      { id: 'al2023-py312-arm64', runtime: Runtime.PYTHON_3_12, architecture: Architecture.ARM_64 },
      { id: 'al2023-py313-x86_64', runtime: Runtime.PYTHON_3_13, architecture: Architecture.X86_64 },
      { id: 'al2023-py313-arm64', runtime: Runtime.PYTHON_3_13, architecture: Architecture.ARM_64 },
      { id: 'al2023-py314-x86_64', runtime: Runtime.PYTHON_3_14, architecture: Architecture.X86_64 },
      { id: 'al2023-py314-arm64', runtime: Runtime.PYTHON_3_14, architecture: Architecture.ARM_64 },

      // Explicit manyLinuxTags override — verifies tag priority / fallback
      // (musllinux tried first, manylinux wheels picked up as fallback).
      {
        id: 'tags-override-musl-first',
        runtime: Runtime.PYTHON_3_12,
        architecture: Architecture.ARM_64,
        manyLinuxTags: ['musllinux_1_2_aarch64', 'manylinux_2_28_aarch64'],
      },
    ];

    for (const { id: fnId, runtime, architecture, manyLinuxTags } of matrix) {
      const fn = new lambda.PythonFunction(this, `local-${fnId}`, {
        entry,
        runtime,
        architecture,
        bundling: {
          local: true,
          ...(manyLinuxTags ? { manyLinuxTags } : {}),
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
