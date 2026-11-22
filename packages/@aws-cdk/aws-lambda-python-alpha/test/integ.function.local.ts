// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import type { IApiCall } from '@aws-cdk/integ-tests-alpha';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Exercises the local (Docker-less) bundling path across the two Lambda Python
 * base-image tiers and both architectures:
 *
 *   AL2 (manylinux2014 only): python3.10, python3.11
 *   AL2023 (manylinux_2_28 with manylinux2014 fallback): python3.12, python3.13, python3.14
 *
 * The requirements.txt cases import a native extension. The arm64 Python 3.12
 * cases verify that the default tags and an explicit override select distinct
 * wheels. The lockfile cases exercise actual dependency exports and imports.
 *
 * Host requirements: Python with pip, pipenv, Poetry with its export plugin,
 * and uv on PATH. The lockfile exports require a POSIX shell.
 *
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

interface MatrixEntry {
  readonly id: string;
  readonly runtime: Runtime;
  readonly architecture: Architecture;
  readonly platformTags?: string[];
  readonly expectedWheelTag?: string;
  readonly fixture?: string;
}

class TestStack extends Stack {
  public readonly functionNames: string[] = [];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const matrix: MatrixEntry[] = [
      // AL2 tier (manylinux2014)
      { id: 'al2-py310-x86_64', runtime: Runtime.PYTHON_3_10, architecture: Architecture.X86_64 },
      { id: 'al2-py310-arm64', runtime: Runtime.PYTHON_3_10, architecture: Architecture.ARM_64 },
      { id: 'al2-py311-x86_64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.X86_64 },
      { id: 'al2-py311-arm64', runtime: Runtime.PYTHON_3_11, architecture: Architecture.ARM_64 },

      // AL2023 tier (manylinux_2_28 falling back to manylinux2014)
      { id: 'al2023-py312-x86_64', runtime: Runtime.PYTHON_3_12, architecture: Architecture.X86_64 },
      {
        id: 'al2023-py312-arm64',
        runtime: Runtime.PYTHON_3_12,
        architecture: Architecture.ARM_64,
        expectedWheelTag: 'manylinux_2_28_aarch64',
      },
      { id: 'al2023-py313-x86_64', runtime: Runtime.PYTHON_3_13, architecture: Architecture.X86_64 },
      { id: 'al2023-py313-arm64', runtime: Runtime.PYTHON_3_13, architecture: Architecture.ARM_64 },
      { id: 'al2023-py314-x86_64', runtime: Runtime.PYTHON_3_14, architecture: Architecture.X86_64 },
      { id: 'al2023-py314-arm64', runtime: Runtime.PYTHON_3_14, architecture: Architecture.ARM_64 },

      {
        id: 'tags-override-manylinux2014',
        runtime: Runtime.PYTHON_3_12,
        architecture: Architecture.ARM_64,
        platformTags: ['manylinux2014_aarch64'],
        expectedWheelTag: 'manylinux2014_aarch64',
      },
      ...['uv', 'poetry', 'pipenv'].map(tool => ({
        id: 'al2023-py312-x86_64-' + tool,
        fixture: 'lambda-handler-' + tool,
        runtime: Runtime.PYTHON_3_12,
        architecture: Architecture.X86_64,
      })),
    ];

    for (const { id: fnId, runtime, architecture, platformTags, expectedWheelTag, fixture = 'lambda-handler-native' } of matrix) {
      const fn = new lambda.PythonFunction(this, `local-${fnId}`, {
        entry: path.join(__dirname, fixture),
        runtime,
        architecture,
        environment: expectedWheelTag ? { EXPECTED_WHEEL_TAG: expectedWheelTag } : undefined,
        bundling: {
          localBundling: { platformTags },
        },
      });
      this.functionNames.push(fn.functionName);
    }

    const layer = new lambda.PythonLayerVersion(this, 'LocalNativeLayer', {
      entry: path.join(__dirname, 'lambda-handler-native'),
      compatibleRuntimes: [Runtime.PYTHON_3_12],
      bundling: { localBundling: {} },
    });
    const fn = new Function(this, 'ImportNativeLayer', {
      runtime: Runtime.PYTHON_3_12,
      handler: 'index.handler',
      layers: [layer],
      code: Code.fromInline([
        'import ujson',
        '',
        'def handler(event, context):',
        '    assert ujson.__file__.startswith("/opt/python/"), ujson.__file__',
        '    return ujson.loads("200")',
      ].join('\n')),
    });
    this.functionNames.push(fn.functionName);
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

// Invoke one function at a time to stay within the account's concurrency quota.
let previous: IApiCall | undefined;
for (const functionName of testCase.functionNames) {
  const invoke = integ.assertions.invokeFunction({ functionName });
  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
  previous?.next(invoke);
  previous = invoke;
}
