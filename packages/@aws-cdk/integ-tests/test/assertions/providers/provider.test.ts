import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AssertionsProvider } from '../../../lib/assertions';

describe('AssertionProvider', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = new AssertionsProvider(stack, 'AssertionProvider');

    // THEN
    expect(stack.resolve(provider.serviceToken)).toEqual({ 'Fn::GetAtt': ['SingletonFunction1488541a7b23466481b69b4408076b81HandlerCD40AE9F', 'Arn'] });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Timeout: 120,
    });
  });

  describe('addPolicyStatementForSdkCall', () => {
    test('default', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      provider.addPolicyStatementFromSdkCall('MyService', 'myApi');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Statement: [
                {
                  Action: ['myservice:MyApi'],
                  Resource: ['*'],
                  Effect: 'Allow',
                },
              ],
            },
          },
        ],
      });
    });

    test('multiple calls', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      provider.addPolicyStatementFromSdkCall('MyService', 'myApi');
      provider.addPolicyStatementFromSdkCall('MyService2', 'myApi2');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Statement: [
                {
                  Action: ['myservice:MyApi'],
                  Resource: ['*'],
                  Effect: 'Allow',
                },
                {
                  Action: ['myservice2:MyApi2'],
                  Resource: ['*'],
                  Effect: 'Allow',
                },
              ],
            },
          },
        ],
      });
    });

    test('multiple providers, 1 resource', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      const provider2 = new AssertionsProvider(stack, 'AssertionsProvider2');
      provider.addPolicyStatementFromSdkCall('MyService', 'myApi');
      provider2.addPolicyStatementFromSdkCall('MyService2', 'myApi2');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Statement: [
                {
                  Action: ['myservice:MyApi'],
                  Resource: ['*'],
                  Effect: 'Allow',
                },
                {
                  Action: ['myservice2:MyApi2'],
                  Resource: ['*'],
                  Effect: 'Allow',
                },
              ],
            },
          },
        ],
      });
    });

    test('prefix different from service name', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      provider.addPolicyStatementFromSdkCall('applicationautoscaling', 'myApi');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Statement: [
                {
                  Action: ['application-autoscaling:MyApi'],
                  Effect: 'Allow',
                  Resource: ['*'],
                },
              ],
            },
          },
        ],
      });
    });
  });

  describe('encode', () => {
    test('booleans', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      const encoded = provider.encode({
        Key1: true,
        Key2: false,
      });

      // THEN
      expect(encoded).toEqual({
        Key1: 'TRUE:BOOLEAN',
        Key2: 'FALSE:BOOLEAN',
      });
    });

    test('all other values return as usual', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');
      const encoded = provider.encode({
        Key1: 'foo',
        Key2: 30,
        Key3: ['hello', 'world'],
      });

      // THEN
      expect(encoded).toEqual({
        Key1: 'foo',
        Key2: 30,
        Key3: ['hello', 'world'],
      });
    });

    test('nullish', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const provider = new AssertionsProvider(stack, 'AssertionsProvider');

      // THEN
      expect(provider.encode(undefined)).toBeUndefined();
      expect(provider.encode(null)).toBeNull();
      expect(provider.encode({})).toEqual({});
    });
  });
});
