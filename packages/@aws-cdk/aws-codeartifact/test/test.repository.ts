import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { Domain, Repository } from '../lib';

test('Create Domain w/ Repository', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain' });
  const repo = new Repository(stack, 'repository', {
    name: 'example-repo',
    domain: domain,
  });

  expect(domain.domainName).toBe('ExampleDomain');
  expect(repo.repositoryName).toBe('example-repo');
});