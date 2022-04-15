import { Template } from '@aws-cdk/assertions';
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

  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Function', {
    CodeUri: {
      Bucket: 'my-bucket',
      Key: 'my-key',
    },
    Handler: 'index.handler',
    Runtime: 'nodejs-12.x',
    Policies: ['AWSLambdaExecute'],
  });
});

test('has the correct deployment preference hooks structure', () => {
  const stack = new cdk.Stack();

  new sam.CfnFunction(stack, 'MyFunction', {
    deploymentPreference: {
      enabled: true,
      type: 'AllAtOnce',
      hooks: {
        preTraffic: 'pre-traffic-hook-arn',
        postTraffic: 'post-traffic-hook-arn',
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Function', {
    DeploymentPreference: {
      Enabled: true,
      Type: 'AllAtOnce',
      Hooks: {
        PreTraffic: 'pre-traffic-hook-arn',
        PostTraffic: 'post-traffic-hook-arn',
      },
    },
  });
});
