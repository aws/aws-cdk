import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, Aws, Stack, Token } from '../lib';

nodeunitShim({
  'By default, environment region and account are not defined and resolve to intrinsics'(test: Test) {
    const stack = new Stack();
    test.ok(Token.isUnresolved(stack.account));
    test.ok(Token.isUnresolved(stack.region));
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
    'if "env" is not specified, it implies account/region agnostic'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack');

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });
      test.deepEqual(app.synth().getStackByName(stack.stackName).environment, {
        account: 'unknown-account',
        region: 'unknown-region',
        name: 'aws://unknown-account/unknown-region',
      });

      test.done();
    },

    'only region is set'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', { env: { region: 'explicit-region' } });

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), 'explicit-region');
      test.deepEqual(app.synth().getStackByName(stack.stackName).environment, {
        account: 'unknown-account',
        region: 'explicit-region',
        name: 'aws://unknown-account/explicit-region',
      });

      test.done();
    },

    'both "region" and "account" are set'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', {
        env: {
          account: 'explicit-account',
          region: 'explicit-region',
        },
      });

      // THEN
      test.deepEqual(stack.resolve(stack.account), 'explicit-account');
      test.deepEqual(stack.resolve(stack.region), 'explicit-region');
      test.deepEqual(app.synth().getStackByName(stack.stackName).environment, {
        account: 'explicit-account',
        region: 'explicit-region',
        name: 'aws://explicit-account/explicit-region',
      });

      test.done();
    },

    'token-account and token-region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', {
        env: {
          account: Aws.ACCOUNT_ID,
          region: Aws.REGION,
        },
      });

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), { Ref: 'AWS::Region' });
      test.deepEqual(app.synth().getStackByName(stack.stackName).environment, {
        account: 'unknown-account',
        region: 'unknown-region',
        name: 'aws://unknown-account/unknown-region',
      });

      test.done();
    },

    'token-account explicit region'(test: Test) {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', {
        env: {
          account: Aws.ACCOUNT_ID,
          region: 'us-east-2',
        },
      });

      // THEN
      test.deepEqual(stack.resolve(stack.account), { Ref: 'AWS::AccountId' });
      test.deepEqual(stack.resolve(stack.region), 'us-east-2');
      test.deepEqual(app.synth().getStackByName(stack.stackName).environment, {
        account: 'unknown-account',
        region: 'us-east-2',
        name: 'aws://unknown-account/us-east-2',
      });

      test.done();
    },
  },
});
