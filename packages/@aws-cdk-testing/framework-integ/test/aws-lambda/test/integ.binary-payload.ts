import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new App();
const stack = new Stack(app, 'IntegBinaryPayload');

const fn = new Function(stack, 'fn', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: Code.fromInline(`
    exports.handler = async (event) => {
      return event;
    };
  `),
});

const buf = Buffer.from(JSON.stringify({ name: 'world' }));
const data = new Uint8Array(
  buf.buffer,
  buf.byteOffset,
  buf.byteLength / Uint8Array.BYTES_PER_ELEMENT,
);

const testCase = new IntegTest(app, 'integ-test', {
  testCases: [stack],
});

const invoke = testCase.assertions.awsApiCall('Lambda', 'invoke', {
  FunctionName: fn.functionName,
  InvocationType: 'RequestResponse',
  Payload: data,
});

invoke.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource: ['*'],
});

invoke.expect(ExpectedResult.objectLike({ Payload: { name: 'world' } }));