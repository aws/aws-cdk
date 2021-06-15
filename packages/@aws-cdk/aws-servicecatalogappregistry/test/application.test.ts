import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

describe('Application', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('default application creation', () => {
    new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyApplication5C63EC1D: {
          Type: 'AWS::ServiceCatalogAppRegistry::Application',
          Properties: {
            Name: 'testApplication',
          },
        },
      },
    });
  }),

  test('application with explicit description', () => {
    const description = 'my test application description';
    new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
      description: description,
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalogAppRegistry::Application', {
      Description: description,
    });
  }),

  test('application with application tags', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
    });

    cdk.Tags.of(application).add('key1', 'value1');
    cdk.Tags.of(application).add('key2', 'value2');

    expect(stack).toHaveResourceLike('AWS::ServiceCatalogAppRegistry::Application', {
      Tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });
  }),

  test('for an application imported by ARN', () => {
    const application = appreg.Application.fromApplicationArn(stack, 'MyApplication',
      'arn:aws:servicecatalog:us-east-1:123456789012:/applications/0aqmvxvgmry0ecc4mjhwypun6i');

    expect(application.applicationId).toEqual('0aqmvxvgmry0ecc4mjhwypun6i');
  }),

  test('fails for application imported by ARN missing applicationId', () => {
    expect(() => {
      appreg.Application.fromApplicationArn(stack, 'MyApplication',
        'arn:aws:servicecatalog:us-east-1:123456789012:/applications/');
    }).toThrow(/Malformed ARN, cannot determine application ID from:/);
  });
});

