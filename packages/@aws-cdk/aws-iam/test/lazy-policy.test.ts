import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { CfnResource, Stack } from '@aws-cdk/core';
import { PolicyStatement, User } from '../lib';
import { LazyPolicy } from '../lib/lazy-policy';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('dependency on empty LazyPolicy never materializes', () => {
  // GIVEN
  const pol = new LazyPolicy(stack, 'Pol');

  const res = new CfnResource(stack, 'Resource', {
    type: 'Some::Resource',
  });

  // WHEN
  res.node.addDependency(pol);

  // THEN
  expect(stack).toMatchTemplate({
    Resources: {
      Resource: {
        Type: 'Some::Resource',
      }
    }
  });
});

test('dependency on attached and non-empty LazyPolicy can be taken', () => {
  // GIVEN
  const pol = new LazyPolicy(stack, 'Pol');
  pol.addStatements(new PolicyStatement({
    actions: ['s3:*'],
    resources: ['*'],
  }));
  pol.attachToUser(new User(stack, 'User'));

  const res = new CfnResource(stack, 'Resource', {
    type: 'Some::Resource',
  });

  // WHEN
  res.node.addDependency(pol);

  // THEN
  expect(stack).toHaveResource("Some::Resource", {
    Type: "Some::Resource",
    DependsOn: [ "Pol0FE9AD5D" ]
  }, ResourcePart.CompleteDefinition);
});
