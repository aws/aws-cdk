import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
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

const inputString = JSON.stringify({ name: 'world' });
const buf = Buffer.from(inputString);
const data = new Uint8Array(
  buf.buffer,
  buf.byteOffset,
  buf.byteLength / Uint8Array.BYTES_PER_ELEMENT,
);

const testCase = new IntegTest(app, 'integ-test', {
  testCases: [stack],
});

const invokeWithByteArray = testCase.assertions.awsApiCall('Lambda', 'invoke', {
  FunctionName: fn.functionName,
  InvocationType: 'RequestResponse',
  Payload: data,
});

invokeWithByteArray.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource: ['*'],
});

const invokeWithString = testCase.assertions.awsApiCall('Lambda', 'invoke', {
  FunctionName: fn.functionName,
  InvocationType: 'RequestResponse',
  Payload: inputString,
});

invokeWithString.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource: ['*'],
});

// Expect the same behaviour, regardless of whether the input is a string or a byte array
invokeWithByteArray.expect(ExpectedResult.objectLike({ Payload: { name: 'world' } }));
invokeWithString.expect(ExpectedResult.objectLike({ Payload: { name: 'world' } }));

