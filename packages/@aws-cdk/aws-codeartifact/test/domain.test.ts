import '@aws-cdk/assert/jest';
import { AccountRootPrincipal, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
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
  expect(() => Domain.fromDomainArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id::domain')).toThrow(/'DomainName' is required and cannot be empty/);
});

test('Create Domain w/ encryption', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain', domainEncryptionKey: Key.fromKeyArn(stack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab') });

  expect(domain.domainName).toBe('ExampleDomain');
});

test('Create Domain w/ principal', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain', principal: new AccountRootPrincipal() });

  expect(domain.domainName).toBe('ExampleDomain');
});

test('Create Domain w/ policy', () => {
  const stack = new Stack();

  const p = new PolicyDocument();

  p.addStatements(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['codeartifact:DescribePackageVersion'],
  }));

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain', policyDocument: p });

  expect(domain.domainName).toBe('ExampleDomain');
});

function createDomain(stack: Stack) {
  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain' });
  return { domain };
}
