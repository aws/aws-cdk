import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { DeployAssert, LogType, InvocationType, ExpectedResult, ActualResult } from '../../lib/assertions';

describe('DeployAssert', () => {

  test('of', () => {
    const app = new App();
    const stack = new Stack(app);
    new DeployAssert(app);
    expect(() => {
      DeployAssert.of(stack);
    }).not.toThrow();
  });

  test('throws if no DeployAssert', () => {
    const app = new App();
    const stack = new Stack(app);
    expect(() => {
      DeployAssert.of(stack);
    }).toThrow(/No DeployAssert construct found in scopes/);
  });

  test('isDeployAssert', () => {
    const app = new App();
    const deployAssert = new DeployAssert(app);
    const isDeployAssert = DeployAssert.isDeployAssert(deployAssert);
    expect(isDeployAssert).toEqual(true);
  });

  describe('invokeFunction', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const deployAssert = new DeployAssert(app);

      // WHEN
      deployAssert.invokeFunction({
        functionName: 'my-func',
        logType: LogType.TAIL,
        payload: JSON.stringify({ key: 'val' }),
        invocationType: InvocationType.EVENT,
      });

      // THEN
      const template = Template.fromStack(Stack.of(deployAssert));
      template.hasResourceProperties('Custom::DeployAssert@SdkCallLambdainvoke', {
        service: 'Lambda',
        api: 'invoke',
        parameters: {
          FunctionName: 'my-func',
          InvocationType: 'Event',
          LogType: 'Tail',
          Payload: '{"key":"val"}',
        },
      });
    });
  });

  describe('assertions', () => {
    test('stringLike', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);
      const query = deplossert.awsApiCall('MyService', 'MyApi');

      // WHEN
      deplossert.assert(
        'MyAssertion',
        ExpectedResult.stringLikeRegexp('foo'),
        ActualResult.fromAwsApiCall(query, 'att'),
      );

      // THEN
      const template = Template.fromStack(Stack.of(deplossert));
      template.hasResourceProperties('Custom::DeployAssert@AssertEquals', {
        expected: JSON.stringify({ $StringLike: 'foo' }),
        actual: {
          'Fn::GetAtt': [
            'AwsApiCallMyServiceMyApi',
            'apiCallResponse.att',
          ],
        },
      });
    });

    test('objectLike', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);
      const query = deplossert.awsApiCall('MyService', 'MyApi');

      // WHEN
      deplossert.assert(
        'MyAssertion',
        ExpectedResult.objectLike({ foo: 'bar' }),
        ActualResult.fromAwsApiCall(query, 'att'),
      );

      // THEN
      const template = Template.fromStack(Stack.of(deplossert));
      template.hasResourceProperties('Custom::DeployAssert@AssertEquals', {
        expected: JSON.stringify({ $ObjectLike: { foo: 'bar' } }),
        actual: {
          'Fn::GetAtt': [
            'AwsApiCallMyServiceMyApi',
            'apiCallResponse.att',
          ],
        },
      });
    });
  });

  describe('awsApiCall', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const deplossert = new DeployAssert(app);

      // WHEN
      deplossert.awsApiCall('MyService', 'MyApi');


      // THEN
      Template.fromStack(Stack.of(deplossert)).hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        api: 'MyApi',
        service: 'MyService',
      });
    });

    test('multiple calls can be configured', () => {
      // GIVEN
      const app = new App();

      // WHEN
      const deplossert = new DeployAssert(app);
      deplossert.awsApiCall('MyService', 'MyApi1');
      deplossert.awsApiCall('MyService', 'MyApi2');


      // THEN
      const template = Template.fromStack(Stack.of(deplossert));
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi1', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi2', 1);
    });
  });
});
