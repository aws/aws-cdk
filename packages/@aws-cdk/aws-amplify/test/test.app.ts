import { countResources, expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { App, BuildSpec } from '../lib';

export = {
  'Test Import Resource'(test: Test) {
    const appId = 'a1b2c3';
    const stack = new Stack();
    const app = App.fromAppId(stack, 'AmpApp', appId);

    test.equals(appId, app.appId, 'AppIds to match');

    test.done();
  },

  'Test Basic App Resource'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
        appName: 'foo',
        repository: 'https://github.com/awslabs/aws-cdk'
    });

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      Name: 'foo',
      Repository: 'https://github.com/awslabs/aws-cdk'
    }));

    test.done();
  },

  'Test Multiple App Resources'(test: Test) {
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
      buildSpec: BuildSpec.fromObject({version: 0.2})
    });

    expect(stack).to(haveResource('AWS::IAM::Role'));

    test.done();
  },

  'Test Manual IAM Role'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      buildSpec: BuildSpec.fromObject({version: 0.2})
    });

    const role = new Role(stack, 'role', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com')
    });

    app.addServiceRole(role);

    expect(stack).to(haveResource('AWS::IAM::Role'));
    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      IAMServiceRole: {
        'Fn::GetAtt': [ 'roleC7B7E775', 'Arn' ]
      }
    }));

    test.done();
  },

  'Test Custom Rules'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.addCustomRule('/foo', '/', '200');

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      CustomRules: [
        {
          Source: '/foo',
          Target: '/',
          Status: '200'
        }
      ]
    }));

    test.done();
  },

  'Test Init Environment Variables'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      environmentVariables: [
        {
          name: 'foo',
          value: 'foo'
        }
      ]
    });

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      EnvironmentVariables: [
        { Name: 'foo', Value: 'foo' }
      ]
    }));

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

  'Test Init Basic Auth for App'(test: Test) {
    const stack = new Stack();
    new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk',
      basicAuth: {
        enableBasicAuth: true,
        password: 'foo',
        username: 'foo'
      }
    });

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Password: 'foo',
        Username: 'foo'
      }
    }));

    test.done();
  },

  'Test Basic Auth for App'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.addBasicAuth('foo', 'foo');

    expect(stack).to(haveResourceLike('AWS::Amplify::App', {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Password: 'foo',
        Username: 'foo'
      }
    }));

    test.done();
  },

  'Test Add Domain to App'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.addDomain('AmpDomain', {
      domainName: 'example.com',
      subdomainSettings: [{
        branchName: 'master',
        prefix: '/'
      }]
    });

    expect(stack).to(haveResource('AWS::Amplify::Domain'));

    test.done();
  },

  'Test Add Branch to App'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
      repository: 'https://github.com/awslabs/aws-cdk'
    });

    app.addBranch('AmpBranch', {
      branchName: 'master'
    });

    expect(stack).to(haveResource('AWS::Amplify::Branch'));

    test.done();
  }
};