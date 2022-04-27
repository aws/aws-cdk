import { Template } from '@aws-cdk/assertions';
// import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { IAssertion, DeployAssert } from '../../lib/assertions';

describe('DeployAssert', () => {
  describe('ResultsCollection', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');

      // WHEN
      new DeployAssert(stack);


      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('Custom::DeployAssert@ResultsCollection', 1);

      template.hasOutput('Results', {});
    });

    test('assertion results are part of the output', () => {
      // GIVEN
      class MyAssertion implements IAssertion {
        public readonly result: string;
        constructor(result: string) {
          this.result = result;
        }
      }

      const app = new App();
      const stack = new Stack(app, 'MyStack');

      // WHEN
      const deployAssert = new DeployAssert(stack);
      deployAssert.registerAssertion(
        new MyAssertion('MyAssertion1Result'),
      );
      deployAssert.registerAssertion(
        new MyAssertion('MyAssertion2Result'),
      );


      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::DeployAssert@ResultsCollection', {
        assertionResults: ['MyAssertion1Result', 'MyAssertion2Result'],
      });
    });
  });

  describe('queryAws', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app);

      // WHEN
      const deplossert = new DeployAssert(stack);
      deplossert.queryAws({
        service: 'MyService',
        api: 'MyApi',
      });


      // THEN
      Template.fromStack(stack).hasResourceProperties('Custom::DeployAssert@SdkCallMyServiceMyApi', {
        api: 'MyApi',
        service: 'MyService',
      });
    });

    test('multiple queries can be configured', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app);

      // WHEN
      const deplossert = new DeployAssert(stack);
      deplossert.queryAws({
        service: 'MyService',
        api: 'MyApi1',
      });
      deplossert.queryAws({
        service: 'MyService',
        api: 'MyApi2',
      });


      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi1', 1);
      template.resourceCountIs('Custom::DeployAssert@SdkCallMyServiceMyApi2', 1);
    });
  });
});
