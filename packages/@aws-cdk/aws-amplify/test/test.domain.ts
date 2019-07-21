import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Construct, ConstructNode, IPostProcessor, IResolveContext, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { App, Domain, SubdomainSettings, SubdomainSettingsResolver } from '../lib';

export = {
  'Test Basic Domain Resource'(test: Test) {
    const stack = new Stack();
    const app = new App(stack, 'AmpApp', {
      appName: 'foo',
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
        appName: 'foo',
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
        appName: 'foo',
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
  },

  'Test Subdomain Resolver: Empty'(test: Test) {
    const ssr = new SubdomainSettingsResolver();

    test.equals(ssr.isEmpty(), true, 'No values stored');
    test.equals(ssr.count(), 0, 'Empty');
    test.done();
  },

  'Test Subdomain Resolver: Values'(test: Test) {
    const stack = new Stack();
    const context: IResolveContext = {
      scope: new Construct(stack, 'stack'),

      registerPostProcessor(_pp: IPostProcessor) {
        return;
      },

      resolve(): any {
        return undefined;
      }
    };

    const ssr = new SubdomainSettingsResolver();
    const sub: SubdomainSettings = {
      branchName: 'foo',
      prefix: '/'
    };

    ssr.addSubdomains(sub);

    test.equals(ssr.count(), 1, 'Has value');
    test.deepEqual(ssr.resolve(context), [sub]);
    test.done();
  },

  'Test Env Var Resolver: Multi Values'(test: Test) {
    const stack = new Stack();
    const context: IResolveContext = {
      scope: new Construct(stack, 'stack'),

      registerPostProcessor(_pp: IPostProcessor) {
        return;
      },

      resolve(): any {
        return undefined;
      }
    };

    const ssr = new SubdomainSettingsResolver();

    const first = {
      branchName: 'foo',
      prefix: '/foo'
    };

    const second = {
      branchName: 'bar',
      prefix: '/bar'
    };

    ssr.addSubdomains(first, second);

    test.equals(ssr.count(), 2, 'Has values');
    test.deepEqual(ssr.resolve(context), [first, second], 'Resolve');
    test.done();
  }
};