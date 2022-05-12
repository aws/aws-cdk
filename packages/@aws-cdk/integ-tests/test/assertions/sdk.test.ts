import { Template, Match } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { DeployAssert, SdkQuery } from '../../lib/assertions';

describe('SdkQuery', () => {
  test('default', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const deplossert = new DeployAssert(stack);

    // WHEN
    new SdkQuery(deplossert, 'SdkQuery', {
      service: 'MyService',
      api: 'MyApi',
    });


    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: Match.absent(),
    });
  });

  test('parameters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const deplossert = new DeployAssert(stack);

    // WHEN
    new SdkQuery(deplossert, 'SdkQuery', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
    });


    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
      service: 'MyService',
      api: 'MyApi',
      parameters: {
        param1: 'val1',
        param2: 2,
      },
    });
  });

  describe('assertEqual', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app);
      const deplossert = new DeployAssert(stack);

      // WHEN
      const query = new SdkQuery(deplossert, 'SdkQuery', {
        service: 'MyService',
        api: 'MyApi',
      });
      query.assertEqual({ foo: 'bar' });


      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::DeployAssert@AssertEquals', {
        expected: { foo: 'bar' },
        actual: {
          'Fn::GetAtt': [
            'DeployAssertSdkQuery94650089',
            'apiCallResponse',
          ],
        },
        assertionType: 'equals',
      });
    });

    test('multiple asserts to the same query', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app);
      const deplossert = new DeployAssert(stack);

      // WHEN
      const query = new SdkQuery(deplossert, 'SdkQuery', {
        service: 'MyService',
        api: 'MyApi',
      });
      query.assertEqual({ foo: 'bar' });
      query.assertEqual({ baz: 'zoo' });


      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('Custom::DeployAssert@AssertEquals', 2);
    });
  });
});
