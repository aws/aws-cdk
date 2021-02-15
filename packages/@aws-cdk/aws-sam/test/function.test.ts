import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as sam from '../lib';

test("correctly chooses a string array from the type unions of the 'policies' property", () => {
  const stack = new cdk.Stack();

  new sam.CfnFunction(stack, 'MyFunction', {
    codeUri: {
      bucket: 'my-bucket',
      key: 'my-key',
    },
    runtime: 'nodejs-12.x',
    handler: 'index.handler',
    policies: ['AWSLambdaExecute'],
  });

  expect(stack).toHaveResourceLike('AWS::Serverless::Function', {
    CodeUri: {
      Bucket: 'my-bucket',
      Key: 'my-key',
    },
    Handler: 'index.handler',
    Runtime: 'nodejs-12.x',
    Policies: ['AWSLambdaExecute'],
  });
});
