import { DEFAULT_ACCOUNT_CONTEXT_KEY, DEFAULT_REGION_CONTEXT_KEY } from '@aws-cdk/cx-api';
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { App, Aws, Stack, Token } from '../lib';

export = {
  'By default, environment region and account are not defined and resolve to intrinsics'(test: Test) {
    const stack = new Stack();
    test.ok(Token.isUnresolved(stack.account));
    test.ok(Token.isUnresolved(stack.region));
    test.deepEqual(stack.resolve(stack.account), { Ref: "AWS::AccountId" });
    test.deepEqual(stack.resolve(stack.region), { Ref: "AWS::Region" });
    test.done();
  },

  'Even if account and region are set in context, stack.account and region returns Refs)'(test: Test) {
    const app = new App();

    app.node.setContext(DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
    app.node.setContext(DEFAULT_REGION_CONTEXT_KEY, 'my-default-region');

    const stack = new Stack(app, 'my-stack');

    test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
    test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });

    test.done();
  },

  'If only `env.region` or `env.account` are specified, Refs will be used for the other'(test: Test) {
    const app = new App();

    const stack1 = new Stack(app, 'S1', { env: { region: 'only-region' } });
    const stack2 = new Stack(app, 'S2', { env: { account: 'only-account' } });

    test.deepEqual(stack1.resolve(stack1.account), { Ref: 'AWS::AccountId' });
    test.deepEqual(stack1.resolve(stack1.region), 'only-region');

    test.deepEqual(stack2.resolve(stack2.account), 'only-account');
    test.deepEqual(stack2.resolve(stack2.region), { Ref: 'AWS::Region' });

    test.done();
  },

  'environment defaults': {
    'default-account-unknown-region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      app.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
      const stack = new Stack(app, 'stack');

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' }); // TODO: after we implement #2866 this should be 'my-default-account'
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'my-default-account',
        region: 'unknown-region',
        name: 'aws://my-default-account/unknown-region'
      });

      test.done();
    },

    'default-account-explicit-region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      app.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
      const stack = new Stack(app, 'stack', { env: { region: 'explicit-region' }});

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' }); // TODO: after we implement #2866 this should be 'my-default-account'
      test.deepEqual(stack.resolve(stack.region), 'explicit-region');
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'my-default-account',
        region: 'explicit-region',
        name: 'aws://my-default-account/explicit-region'
      });

      test.done();
    },

    'explicit-account-explicit-region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      app.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
      const stack = new Stack(app, 'stack', { env: {
        account: 'explicit-account',
        region: 'explicit-region'
      }});

      // THEN
      test.deepEqual(stack.resolve(stack.account), 'explicit-account');
      test.deepEqual(stack.resolve(stack.region), 'explicit-region');
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'explicit-account',
        region: 'explicit-region',
        name: 'aws://explicit-account/explicit-region'
      });

      test.done();
    },

    'default-account-default-region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      app.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
      app.node.setContext(cxapi.DEFAULT_REGION_CONTEXT_KEY, 'my-default-region');
      const stack = new Stack(app, 'stack');

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' }); // TODO: after we implement #2866 this should be 'my-default-account'
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });     // TODO: after we implement #2866 this should be 'my-default-region'
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'my-default-account',
        region: 'my-default-region',
        name: 'aws://my-default-account/my-default-region'
      });

      test.done();
    },

    'token-account-token-region-no-defaults'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      app.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
      app.node.setContext(cxapi.DEFAULT_REGION_CONTEXT_KEY, 'my-default-region');
      const stack = new Stack(app, 'stack', {
        env: {
          account: Aws.accountId,
          region: Aws.region
        }
      });

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'my-default-account',
        region: 'my-default-region',
        name: 'aws://my-default-account/my-default-region'
      });

      test.done();
    },

    'token-account-token-region-with-defaults'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', {
        env: {
          account: Aws.accountId,
          region: Aws.region
        }
      });

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });
      test.deepEqual(app.synth().getStack(stack.stackName).environment, {
        account: 'unknown-account',
        region: 'unknown-region',
        name: 'aws://unknown-account/unknown-region'
      });

      test.done();
    }


  },
};
