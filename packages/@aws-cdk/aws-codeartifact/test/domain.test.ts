import '@aws-cdk/assert/jest';
import * as cdkassert from '@aws-cdk/assert';
import { AccountRootPrincipal, PolicyDocument, PolicyStatement, Effect, AccountPrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { Stack } from '@aws-cdk/core';
import { Domain } from '../lib';

test('Create Domain', () => {
  const stack = new Stack();

  createDomain(stack);

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: 'ExampleDomain',
  }));
});

test('Create Domain via id', () => {
  const stack = new Stack();

  new Domain(stack, 'ExampleDomain');

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: 'ExampleDomain',
  }));
});

test('Domain from ARN', () => {
  const stack = new Stack();

  const domain = Domain.fromDomainArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id:123456789012:domain/my-domain');
  expect(domain.domainName?.toString()).toBe('my-domain');
});


test('Domain from ARN w/ out domain name nor account id', () => {
  const stack = new Stack();
  expect(() => Domain.fromDomainArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id::domain')).toThrow(/Domain name is required as a resource name with the ARN/);
});

test('Create Domain w/ encryption', () => {
  const stack = new Stack();
  const key = kms.Key.fromKeyArn(stack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab');

  new Domain(stack, 'domain', { domainName: 'ExampleDomain', domainEncryptionKey: key });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: 'ExampleDomain',
    EncryptionKey: key.keyId,
  }));
});

test('Create Domain w/ principal', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain', principal: new AccountRootPrincipal() });
  expect(domain.domainName).toBe('ExampleDomain');
});


test('Create Domain w/ principal grant', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'ExampleDomain', principal: new AccountRootPrincipal() });
  const self = new AccountPrincipal('123456789012');
  let g = domain.grantCreate(self);
  expect(g.success).toBeTruthy();

  g = domain.grantLogin(self);
  expect(g.success).toBeTruthy();

  g = domain.grantRead(self);
  expect(g.success).toBeTruthy();

  g = domain.grantDefaultPolicy(self);
  expect(g.success).toBeTruthy();

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
