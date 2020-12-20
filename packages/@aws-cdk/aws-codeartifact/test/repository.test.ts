import '@aws-cdk/assert/jest';
import * as cdkassert from '@aws-cdk/assert';
import { AccountRootPrincipal, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Domain, Repository, ExternalConnection } from '../lib';

test('Domain w/ Repository', () => {
  const stack = new Stack();

  const { domain, repo } = createDomainAndRepo(stack);

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: domain.domainName,
  }));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo.repositoryName,
  }));
});

test('Domain w/ Repository and policy document', () => {
  const stack = new Stack();

  const p = new PolicyDocument();

  p.addStatements(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['codeartifact:DescribePackageVersion'],
  }));

  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo = new Repository(stack, 'repository-1', { repositoryName: 'example-repo', domain: domain, policyDocument: p });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: domain.domainName,
  }));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo.repositoryName,
  }));
});

test('Domain w/ 2 Repositories via constructor, w/ upstream, and external connection', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo1 = new Repository(stack, 'repository-1', { repositoryName: 'example-repo-1', domain: domain, externalConnections: [ExternalConnection.NPM] });
  new Repository(stack, 'repository-2', { repositoryName: 'example-repo-2', domain: domain, upstreams: [repo1] });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: domain.domainName,
  }));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo1.repositoryName,
    DomainName: stack.resolve(domain.domainNameAttr),
  }));


  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo1.repositoryName,
    DomainName: stack.resolve(domain.domainNameAttr),
  }));
});

test('Domain w/ 2 Repositories via addRepositories, w/ upstream, and external connection', () => {
  const stack = new Stack();

  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo1 = new Repository(stack, 'repository-1', { repositoryName: 'example-repo-1', domain: domain });
  const repo2 = new Repository(stack, 'repository-2', { repositoryName: 'example-repo-2', domain: domain });

  repo1.withExternalConnections(ExternalConnection.NPM);
  repo2.withUpstream(repo1);

  domain.addRepositories(repo1, repo2);

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Domain', {
    DomainName: domain.domainName,
  }));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo1.repositoryName,
    DomainName: stack.resolve(domain.domainNameAttr),
  }));


  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::CodeArtifact::Repository', {
    RepositoryName: repo1.repositoryName,
    DomainName: stack.resolve(domain.domainNameAttr),
  }));
});

test('Repository from ARN', () => {
  const stack = new Stack();

  const repo = Repository.fromRepositoryArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id:123456789012:repository/my-domain/my-repo');
  expect(repo.repositoryName).toBe('my-repo');
});

test('Repository from ARN w/ out repository name nor account id', () => {
  const stack = new Stack();

  expect(() => Repository.fromRepositoryArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id::repository')).toThrow(/'RepositoryName' is required and cannot be empty/);
});

test('Repository from ARN w/ Grant No-ops', () => {
  const stack = new Stack();

  const repo = Repository.fromRepositoryArn(stack, 'repo-from-arn', 'arn:aws:codeartifact:region-id:123456789012:repository/my-domain/my-repo');
  expect(repo.repositoryName).toBe('my-repo');

  repo.grantRead(new AccountRootPrincipal());
  repo.grantWrite(new AccountRootPrincipal());
  repo.grantReadWrite(new AccountRootPrincipal());
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


test('Grant AccountRootPrincipal delete on repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);
  repo.allowDeleteFromRepository(new AccountRootPrincipal());
});

test('Event rule for Repository', () => {
  const stack = new Stack();
  const { repo } = createDomainAndRepo(stack);

  repo.onPackageVersionStateChange('subscription', {});
});

test('Repository description too long', () => {
  const description : string[] = [];
  for (let i = 0; i <= 2001; i++) {
    description.push('a');
  }

  const stack = new Stack();
  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });

  expect(() => {
    new Repository(stack, 'repository-1', { repositoryName: 'example-repo-1', domain: domain, description: description.join('') });
  }).toThrow('Description: must match pattern \\P{C}+. Must match rules from https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-description');
});

test('Repository invalid domain name length', () => {
  const domainName : string[] = [];
  for (let i = 0; i <= 51; i++) {
    domainName.push('a');
  }

  const stack = new Stack();
  expect(() => {
    const domain = new Domain(stack, 'domain', { domainName: domainName.join('') });
    new Repository(stack, 'repository-1', { repositoryName: 'example-repo-1', domain: domain });
  }).toThrow(/DomainName: must be less than 50 characters long./);
});

test('Repository invalid RepositoryName length', () => {
  const respoName : string[] = [];
  for (let i = 0; i <= 100; i++) {
    respoName.push('a');
  }

  const stack = new Stack();
  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });

  expect(() => {
    new Repository(stack, 'repository-1', { repositoryName: respoName.join(''), domain: domain });
  }).toThrow('RepositoryName: must be less than 100 characters long. Must match rules from https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname');
});

test('Repository invalid RepositoryName pattern', () => {
  const stack = new Stack();
  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });

  expect(() => {
    new Repository(stack, 'repository-1', { repositoryName: '@@@@@', domain: domain });
  }).toThrow('RepositoryName: must match pattern [A-Za-z0-9][A-Za-z0-9._\\-]{1,99}. Must match rules from https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname');
});

function createDomainAndRepo(stack: Stack) {
  const domain = new Domain(stack, 'domain', { domainName: 'example-domain' });
  const repo = new Repository(stack, 'repository', {
    repositoryName: 'example-repo',
    domain: domain,
  });

  return { domain, repo };
}
