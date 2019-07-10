import { countResources, expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
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
        appName: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    expect(stack).to(haveResource('AWS::Amplify::App'));

    test.done();
  },

  'Test Multiple App Resource'(test: Test) {
    const stack = new Stack();
    new App(stack, 'OtherAmpApp', {
        appName: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk-mirror'
  });

    expect(stack).to(countResources('AWS::Amplify::App', 2));

    test.done();
  },

  'Test IAM Role Generation'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      buildSpec: 'foo'
    });

    expect(stack).to(haveResource('AWS::IAM::Role'));

    test.done();
  },

  'Test Manual IAM Role'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      buildSpec: 'foo'
    });

    app.addServiceRole(new Role(stack, 'role', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com')
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    test.done();
  },

  'Test Environment Variables'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.addEnvironmentVariable('foo', 'foo');

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      EnvironmentVariables: [
        { Name: 'foo', Value: 'foo' }
      ]
    }));

    test.done();
  },

  'Test Basic Auth for App'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.setBasicAuth('foo', 'foo');

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Password: 'foo',
        Username: 'foo'
      }
    }));

    test.done();
  }
};