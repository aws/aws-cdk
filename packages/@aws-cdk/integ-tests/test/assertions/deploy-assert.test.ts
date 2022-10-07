import { Template } from '@aws-cdk/assertions';
import { App, CustomResource, Stack } from '@aws-cdk/core';
import { ActualResult, ExpectedResult, InvocationType, LogType } from '../../lib/assertions';
import { DeployAssert } from '../../lib/assertions/private/deploy-assert';
import { IntegTest } from '../../lib/test-case';

describe('DeployAssert', () => {

  test('of', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new DeployAssert(app);
    expect(() => {
      DeployAssert.of(stack);
    }).not.toThrow();
  });

  test('throws if no DeployAssert', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
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
      const template = Template.fromStack(deployAssert.scope);
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
      deplossert.expect(
        'MyAssertion',
        ExpectedResult.stringLikeRegexp('foo'),
        ActualResult.fromAwsApiCall(query, 'att'),
      );

      // THEN
      const template = Template.fromStack(deplossert.scope);
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
      deplossert.expect(
        'MyAssertion',
        ExpectedResult.objectLike({ foo: 'bar' }),
        ActualResult.fromAwsApiCall(query, 'att'),
      );

      // THEN
      const template = Template.fromStack(deplossert.scope);
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
      Template.fromStack(deplossert.scope).hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
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
      const template = Template.fromStack(deplossert.scope);
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi1', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi2', 1);
    });

    test('custom resource type length is truncated when greater than 60 characters', () => {
      // GIVEN
      const app = new App();

      // WHEN
      const deplossert = new DeployAssert(app);
      deplossert.awsApiCall('Pangram', 'TheQuickBrownFoxJumpsOverTheLazyDog');

      // THEN
      const truncatedType = 'Custom::DeployAssert@SdkCallPangramTheQuickBrownFoxJumpsOver';
      expect(truncatedType.length).toEqual(60);

      const template = Template.fromStack(deplossert.scope);
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.resourceCountIs(truncatedType, 1);
    });
  });
});

describe('User provided assertions stack', () => {
  test('Same stack for integration test and assertions', () => {
    //GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    // WHEN
    const cr = new CustomResource(stack, 'cr', { resourceType: 'Custom::Bar', serviceToken: 'foo' });
    const integ = new IntegTest(app, 'integ', {
      testCases: [stack],
      assertionStack: stack,
    });
    integ.assertions.awsApiCall('Service', 'Api', { Reference: cr.ref });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::DeployAssert@SdkCallServiceApi', 1);
    template.resourceCountIs('Custom::Bar', 1);
  });

  test('Different stack for integration test and assertions', () => {
    //GIVEN
    const app = new App();
    const integStack = new Stack(app, 'TestStack');
    const assertionStack = new Stack(app, 'AssertionsStack');
    const integ = new IntegTest(app, 'integ', {
      testCases: [integStack],
      assertionStack: assertionStack,
    });

    // WHEN
    const cr = new CustomResource(integStack, 'cr', { resourceType: 'Custom::Bar', serviceToken: 'foo' });
    integ.assertions.awsApiCall('Service', 'Api', { Reference: cr.ref });

    // THEN
    const integTemplate = Template.fromStack(integStack);
    const assertionTemplate = Template.fromStack(assertionStack);
    integTemplate.resourceCountIs('Custom::Bar', 1);
    assertionTemplate.resourceCountIs('Custom::DeployAssert@SdkCallServiceApi', 1);
  });

  test('not throw when environment matches', () => {
    //GIVEN
    const app = new App();
    const env = { region: 'us-west-2' };
    const integStack = new Stack(app, 'IntegStack', { env: env });
    const assertionStack = new Stack(app, 'AssertionsStack', { env: env });
    const cr = new CustomResource(integStack, 'cr', { serviceToken: 'foo' });
    const integ = new IntegTest(app, 'integ', {
      testCases: [integStack],
      assertionStack: assertionStack,
    });
    integ.assertions.awsApiCall('Service', 'api', { Reference: cr.getAttString('bar') });

    // WHEN
    expect(() => {
      // THEN
      app.synth();
    }).not.toThrow(/only supported for stacks deployed to the same environment/);
  });
});
