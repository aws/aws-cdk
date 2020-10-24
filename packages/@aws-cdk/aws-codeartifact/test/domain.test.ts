import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { Domain } from '../lib';

test('Create Domain', () => {
  const stack = new Stack();

  const { domain } = createDomain(stack);

  expect(domain.domainName).toBe('ExampleDomain');
});

test('Domain from ARN', () => {
  const stack = new Stack();

  const domain = Domain.fromDomainArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id:123456789012:domain/my-domain');
  expect(domain.domainName).toBe('my-domain');
});

test('Domain from ARN w/ out domain name nor account id', () => {
  const stack = new Stack();

  const domain = Domain.fromDomainArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id::domain');
  expect(domain.domainName).toBe('');
  expect(domain.domainOwner).toBe('');
});

function createDomain(stack: Stack) {
  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain' });
  return { domain };
}
