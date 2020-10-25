#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as codeartifact from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codeartifact');

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
new codeartifact.Repository(stack, 'repository', {
  repositoryName: 'repository',
  domain: domain,
});

app.synth();