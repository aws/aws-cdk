#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as codeartifact from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codeartifact-upstream');

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain-upstream' });
const upstream = new codeartifact.Repository(stack, 'repository', {
  repositoryName: 'repository',
  domain: domain,
  externalConnections: [codeartifact.ExternalConnection.NPM],
});

new codeartifact.Repository(stack, 'sub-repository', {
  repositoryName: 'sub-repository',
  domain: domain,
  upstreams: [upstream],
});
app.synth();