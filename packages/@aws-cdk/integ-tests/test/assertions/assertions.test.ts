import { Template } from '@aws-cdk/assertions';
import { App, CustomResource, Stack } from '@aws-cdk/core';
import { IAssertion, DeployAssert, EqualsAssertion } from '../../lib/assertions';

describe('Assertion', () => {
  test('registration', () => {
    const app = new App();
    const stack = new Stack(app);
    const deployAssert = new DeployAssert(stack);

    class MyAssertion implements IAssertion {
      public result = 'result';
    }
    const assertion = new MyAssertion();
    deployAssert.registerAssertion(assertion);

    expect(deployAssert._assertions).toContain(assertion);
  });
});

describe('EqualsAssertion', () => {
  test('default', () => {
    const app = new App();
    const stack = new Stack(app);
    const deployAssert = new DeployAssert(stack);
    const customRes = new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'serviceToken',
    });
    deployAssert.registerAssertion(new EqualsAssertion(stack, 'MyAssertion', {
      expected: { foo: 'bar' },
      inputResource: customRes,
      inputResourceAtt: 'foo',
    }));

    Template.fromStack(stack).hasResourceProperties('Custom::DeployAssert@AssertEquals', {
      actual: {
        'Fn::GetAtt': [
          'MyCustomResource',
          'foo',
        ],
      },
      expected: {
        foo: 'bar',
      },
      assertionType: 'equals',
    });
  });
});
