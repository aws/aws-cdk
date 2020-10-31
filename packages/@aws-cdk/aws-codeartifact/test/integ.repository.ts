#!/usr/bin/env node
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as codeartifact from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codeartifact');

const p = new iam.PolicyDocument();
p.addStatements(new iam.PolicyStatement({
  sid: 'DomainPolicyForOrganization',
  effect: iam.Effect.ALLOW,
  actions: [
    'codeartifact:GetDomainPermissionsPolicy',
    'codeartifact:ListRepositoriesInDomain',
    'codeartifact:GetAuthorizationToken',
    'codeartifact:DescribeDomain',
    'codeartifact:CreateRepository',
    'sts:GetServiceBearerToken',
  ],
  principals: [new iam.AnyPrincipal()],
  resources: ['*'],
  conditions: {
    StringEquals: { 'aws:PrincipalOrgID': ['o-12345678910'] },
  },
}));

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain', policyDocument: p });
const upstream = new codeartifact.Repository(stack, 'repository', {
  repositoryName: 'repository',
  domain: domain,
  externalConnections: [codeartifact.ExternalConnection.NPM],
});

const subRepo = new codeartifact.Repository(stack, 'sub-repository', {
  repositoryName: 'sub-repository',
  domain: domain,
  upstreams: [upstream],
});

subRepo.allowReadFromRepository(new iam.AccountRootPrincipal());

app.synth();