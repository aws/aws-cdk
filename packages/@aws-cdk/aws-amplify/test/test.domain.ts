import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
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
  }
};