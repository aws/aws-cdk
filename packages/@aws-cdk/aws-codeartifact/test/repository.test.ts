import '@aws-cdk/assert/jest';
import { AccountRootPrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Domain, Repository, ExternalConnection } from '../lib';

test('Domain w/ Repository', () => {
  const stack = new Stack();

  const { domain, repo } = createDomainAndRepo(stack);

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Repository from ARN', () => {
  const stack = new Stack();

  const repo = Repository.fromRepositoryArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id:123456789012:repository/my-domain/my-repo');
  expect(repo.repositoryName).toBe('my-repo');
});

test('Repository from ARN w/ out repository name nor account id', () => {
  const stack = new Stack();

  const repo = Repository.fromRepositoryArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id::repository');
  expect(repo.repositoryName).toBe('');
  expect(repo.repositoryDomainName).toBe('');
  expect(repo.repositoryDomainOwner).toBe('');
});

test('Grant AccountRootPrincipal read on Repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);
  repo.grantRead(new AccountRootPrincipal());
});

test('Grant AccountRootPrincipal read/write on Repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);
  repo.grantReadWrite(new AccountRootPrincipal());
});

test('Grant AccountRootPrincipal write on Repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);
  repo.grantWrite(new AccountRootPrincipal());
});

test('Repository w/ Upstream', () => {
  const stack = new Stack();


  const { domain, repo } = createDomainAndRepo(stack);

  const upstreamRepo = new Repository(stack, 'upstream-repository', {
    repositoryName: 'upstream-example-repo',
    domainName: domain.domainName,
  });

  repo.withUpstream(upstreamRepo);

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Repository w/ External Connection via constructor', () => {
  const stack = new Stack();
  const { domain, repo } = createDomainAndRepo(stack);

  repo.withExternalConnections(ExternalConnection.NPM);

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Repository w/ Empty External Connection via constructor withExternalConnections', () => {
  const stack = new Stack();
  const { domain, repo } = createDomainAndRepo(stack);

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Repository w/ External Connection calling withExternalConnections', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo = new Repository(stack, 'repository', {
    repositoryName: 'example-repo',
    domainName: domain.domainName,
  });

  repo.withExternalConnections(ExternalConnection.NPM);

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Repository w/ Empty External Connection calling withExternalConnections', () => {
  const stack = new Stack();
  const { domain, repo } = createDomainAndRepo(stack);
  repo.withExternalConnections();

  expect(domain.domainName).toBe('example-domain');
  expect(repo.repositoryName).toBe('example-repo');
});

test('Event rule for Repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);

  repo.onPackageVersionStateChange('subscription', {});
});

function createDomainAndRepo(stack: Stack) {
  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo = new Repository(stack, 'repository', {
    repositoryName: 'example-repo',
    domainName: domain.domainName,
  });

  return { domain, repo };
}
