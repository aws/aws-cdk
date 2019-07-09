import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { ConstructNode, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { App, Domain } from '../lib';

export = {
  'Test Basic Domain Resource'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
        name: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    new Domain(stack, 'AmpDomain', {
      app,
      domainName: 'foo.com',
      subdomainSettings: [
        {
          prefix: '/',
          branchName: 'master'
        }
      ]
    });

    expect(stack).to(haveResource('AWS::Amplify::App'));
    expect(stack).to(haveResource('AWS::Amplify::Domain'));

    test.done();
  },

  'Test Empty Subdomain Domain Resource'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
        name: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    const domain = new Domain(stack, 'AmpDomain', {
      app,
      domainName: 'foo.com'
    });

    const errors = ConstructNode.validate(domain.node);

    test.strictEqual(1, errors.length);
    test.strictEqual('You must specify subdomain settings', errors[0].message);

    test.done();
  },

  'Test Subdomain Domain Resource'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
        name: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    const domain = new Domain(stack, 'AmpDomain', {
      app,
      domainName: 'foo.com'
    });

    domain.addSubdomainSettings('/', 'master');

    expect(stack).to(haveResourceLike('AWS::Amplify::Domain', {
      SubDomainSettings: [
        {
          Prefix: '/',
          BranchName: 'master'
        }
      ]
    }));

    test.done();
  }
};