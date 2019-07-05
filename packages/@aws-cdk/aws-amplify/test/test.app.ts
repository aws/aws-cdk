import { expect, haveResource } from '@aws-cdk/assert';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { App } from '../lib';

export = {
  'Test Import Resource'(test: Test) {
    const appId = 'a1b2c3';
    const stack = new Stack();
    const app = App.fromAppId(stack, 'AmpApp', appId);

    if (app.appId !== appId) {
      test.ok(false, `App IDs don't match`);
    }

    test.done();
  },

  'Test Basic App Resource'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
        name: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    expect(stack).to(haveResource('AWS::Amplify::App'));

    test.done();
  },

  'Test IAM Role Generation'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
      name: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      buildSpec: 'foo'
    });

    expect(stack).to(haveResource('AWS::IAM::Role'));

    test.done();
  },

  'Test Manual IAM Role'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      name: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      buildSpec: 'foo'
    });

    app.addServiceRole(new Role(stack, 'role', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com')
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    test.done();
  }
};