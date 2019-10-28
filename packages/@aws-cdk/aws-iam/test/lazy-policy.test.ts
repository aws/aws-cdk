import '@aws-cdk/assert/jest';
import { CfnResource, Stack } from '@aws-cdk/core';
import { LazyPolicy } from '../lib/lazy-policy';

// tslint:disable:object-literal-key-quotes

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('dependency on empty LazyPolicy never materializes', () => {
  const pol = new LazyPolicy(stack, 'Pol');

  const res = new CfnResource(stack, 'Resource', {
    type: 'Some::Resource',
  });

  res.node.addDependency(pol);

  expect(stack).toMatchTemplate({
    Resources: {
      Resource: {
        Type: 'Some::Resource',
      }
    }
  });
});
