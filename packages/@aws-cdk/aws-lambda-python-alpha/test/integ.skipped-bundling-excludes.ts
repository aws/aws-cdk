import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { BUNDLING_STACKS } from 'aws-cdk-lib/cx-api';
import { PythonFunction } from '../lib';

// This dependency-free handler can run directly from staged source. Force the
// unselected-stack path even when the integration runner selects this stack.
const app = new App({ postCliContext: { [BUNDLING_STACKS]: [] } });
const stack = new Stack(app, 'python-skipped-bundling-excludes');
const handler = new PythonFunction(stack, 'Handler', {
  entry: path.join(__dirname, 'lambda-handler-skipped-excludes'),
  runtime: Runtime.PYTHON_3_12,
  bundling: { assetExcludes: ['excluded-metadata'] },
});

const test = new IntegTest(app, 'SkippedBundlingExcludes', { testCases: [stack] });
test.assertions.invokeFunction({ functionName: handler.functionName })
  .expect(ExpectedResult.objectLike({ Payload: '"metadata excluded"' }));
