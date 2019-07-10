import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { App, Branch } from '../lib';

export = {
  'Test Basic Branch Resource'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    new Branch(stack, 'AmpBranch', {
      app,
      branchName: 'master'
    });

    expect(stack).to(haveResource('AWS::Amplify::App'));
    expect(stack).to(haveResource('AWS::Amplify::Branch'));

    test.done();
  },

  'Test Environment Variables'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    const branch = new Branch(stack, 'AmpBranch', {
      app,
      branchName: 'master'
    });

    branch.addEnvironmentVariable('foo', 'foo');

    expect(stack).to(haveResourceLike('AWS::Amplify::Branch', {
      EnvironmentVariables: [
        { Name: 'foo', Value: 'foo' }
      ]
    }));

    test.done();
  },

  'Test Basic Auth'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    const branch = new Branch(stack, 'AmpBranch', {
      app,
      branchName: 'master'
    });

    branch.setBasicAuth('foo', 'foo');

    expect(stack).to(haveResourceLike('AWS::Amplify::Branch', {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Password: 'foo',
        Username: 'foo'
      }
    }));

    test.done();
  }
};