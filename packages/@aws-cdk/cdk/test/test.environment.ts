import { DEFAULT_ACCOUNT_CONTEXT_KEY, DEFAULT_REGION_CONTEXT_KEY } from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { App, Stack, Token } from '../lib';

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
};
