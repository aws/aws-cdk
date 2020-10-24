import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { Domain } from '../lib';

test('Create Domain', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain' });

  expect(domain.domainName).toBe('ExampleDomain');
});