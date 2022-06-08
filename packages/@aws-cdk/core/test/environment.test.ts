import { App, Aws, Stack, Token } from '../lib';

describe('environment', () => {
  test('By default, environment region and account are not defined and resolve to intrinsics', () => {
    const stack = new Stack();
    expect(Token.isUnresolved(stack.account)).toEqual(true);
    expect(Token.isUnresolved(stack.region)).toEqual(true);
    expect(stack.resolve(stack.account)).toEqual({ Ref: 'AWS::AccountId' });
    expect(stack.resolve(stack.region)).toEqual({ Ref: 'AWS::Region' });

  });

  test('If only `env.region` or `env.account` are specified, Refs will be used for the other', () => {
    const app = new App();

    const stack1 = new Stack(app, 'S1', { env: { region: 'only-region' } });
    const stack2 = new Stack(app, 'S2', { env: { account: 'only-account' } });

    expect(stack1.resolve(stack1.account)).toEqual({ Ref: 'AWS::AccountId' });
    expect(stack1.resolve(stack1.region)).toEqual('only-region');

    expect(stack2.resolve(stack2.account)).toEqual('only-account');
    expect(stack2.resolve(stack2.region)).toEqual({ Ref: 'AWS::Region' });
  });

  describe('environment defaults', () => {
    test('if "env" is not specified, it implies account/region agnostic', () => {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack');

      // THEN
      expect(stack.resolve(stack.account)).toEqual({ Ref: 'AWS::AccountId' });
      expect(stack.resolve(stack.region)).toEqual({ Ref: 'AWS::Region' });
      expect(app.synth().getStackByName(stack.stackName).environment).toEqual({
        account: 'unknown-account',
        region: 'unknown-region',
        name: 'aws://unknown-account/unknown-region',
      });
    });

    test('only region is set', () => {
      // GIVEN
      const app = new App();

      // WHEN
      const stack = new Stack(app, 'stack', { env: { region: 'explicit-region' } });

      // THEN
      expect(stack.resolve(stack.account)).toEqual({ Ref: 'AWS::AccountId' });
      expect(stack.resolve(stack.region)).toEqual('explicit-region');
      expect(app.synth().getStackByName(stack.stackName).environment).toEqual({
        account: 'unknown-account',
        region: 'explicit-region',
        name: 'aws://unknown-account/explicit-region',
      });
    });

    test('both "region" and "account" are set', () => {
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
      expect(stack.resolve(stack.account)).toEqual('explicit-account');
      expect(stack.resolve(stack.region)).toEqual('explicit-region');
      expect(app.synth().getStackByName(stack.stackName).environment).toEqual({
        account: 'explicit-account',
        region: 'explicit-region',
        name: 'aws://explicit-account/explicit-region',
      });
    });

    test('token-account and token-region', () => {
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
      expect(stack.resolve(stack.account)).toEqual({ Ref: 'AWS::AccountId' });
      expect(stack.resolve(stack.region)).toEqual({ Ref: 'AWS::Region' });
      expect(app.synth().getStackByName(stack.stackName).environment).toEqual({
        account: 'unknown-account',
        region: 'unknown-region',
        name: 'aws://unknown-account/unknown-region',
      });
    });

    test('token-account explicit region', () => {
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
      expect(stack.resolve(stack.account)).toEqual({ Ref: 'AWS::AccountId' });
      expect(stack.resolve(stack.region)).toEqual('us-east-2');
      expect(app.synth().getStackByName(stack.stackName).environment).toEqual({
        account: 'unknown-account',
        region: 'us-east-2',
        name: 'aws://unknown-account/us-east-2',
      });
    });
  });
});
