import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as sam from '../lib';

describe('AWS::Serverless::Api', () => {
  let stack: cdk.Stack;
  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('can be created by passing a complex type to EndpointConfiguration', () => {
    new sam.CfnApi(stack, 'Api', {
      stageName: 'prod',
      definitionBody: {
        body: 'definitionBody',
      },
      endpointConfiguration: {
        type: 'GLOBAL',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Api', {
      StageName: 'prod',
      EndpointConfiguration: {
        Type: 'GLOBAL',
      },
    });
  });

  test('can be created by passing a string to EndpointConfiguration', () => {
    new sam.CfnApi(stack, 'Api', {
      stageName: 'prod',
      definitionBody: {
        body: 'definitionBody',
      },
      endpointConfiguration: 'GLOBAL',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Api', {
      StageName: 'prod',
      EndpointConfiguration: 'GLOBAL',
    });
  });
});
