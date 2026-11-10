import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App();
const stack = new Stack(app, 'RepeatedEsbuildArgs');
const fn = new NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/repeated-aliases.cjs'),
  runtime: STANDARD_NODEJS_RUNTIME,
  bundling: {
    esbuildArgs: {
      '--alias': [
        `@first=${path.join(__dirname, 'integ-handlers/util.ts')}`,
        `@second=${path.join(__dirname, 'integ-handlers/util.ts')}`,
      ],
    },
  },
});

const integ = new IntegTest(app, 'RepeatedEsbuildArgsTest', { testCases: [stack] });
integ.assertions.invokeFunction({ functionName: fn.functionName })
  .expect(ExpectedResult.objectLike({ StatusCode: 200, Payload: '18' }));
