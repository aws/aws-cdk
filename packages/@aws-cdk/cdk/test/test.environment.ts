import { DEFAULT_ACCOUNT_CONTEXT_KEY, DEFAULT_REGION_CONTEXT_KEY } from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { App, Stack } from '../lib';

export = {
  'By default, environment region and account are not defined'(test: Test) {
    const stack = new Stack();
    test.ok(stack.env);
    test.equal(stack.env.account, null);
    test.equal(stack.env.region, null);
    test.done();
  },

  'Default account and region can be set in context (`aws:cdk:toolkit:default-account` and `aws:cdk:toolkit:default-region`)'(test: Test) {
    const app = new App();

    app.setContext(DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
    app.setContext(DEFAULT_REGION_CONTEXT_KEY, 'my-default-region');

    const stack = new Stack(app);

    test.equal(stack.env.account, 'my-default-account');
    test.equal(stack.env.region, 'my-default-region');

    test.done();
  },

  'If only `env.region` or `env.account` are specified, defaults will be used for the other'(test: Test) {
    const app = new App();

    app.setContext(DEFAULT_ACCOUNT_CONTEXT_KEY, 'my-default-account');
    app.setContext(DEFAULT_REGION_CONTEXT_KEY, 'my-default-region');

    const stack1 = new Stack(app, 'S1', { env: { region: 'only-region' } });
    const stack2 = new Stack(app, 'S2', { env: { account: 'only-account' } });

    test.equal(stack1.env.account, 'my-default-account');
    test.equal(stack1.env.region, 'only-region');

    test.equal(stack2.env.account, 'only-account');
    test.equal(stack2.env.region, 'my-default-region');

    test.done();
  },
} as any;
