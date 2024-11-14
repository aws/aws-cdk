import { AwsCliCompatible } from '../../../lib/api/aws-auth/awscli-compatible';

describe('Session token', () => {
  beforeEach(() => {
    process.env.AWS_ACCESS_KEY_ID = 'foo';
    process.env.AWS_SECRET_ACCESS_KEY = 'bar';
  });

  test('does not mess up with session token env variables if they are undefined', async () => {
    // Making sure these variables are not defined
    delete process.env.AWS_SESSION_TOKEN;
    delete process.env.AMAZON_SESSION_TOKEN;

    await AwsCliCompatible.credentialChainBuilder();

    expect(process.env.AWS_SESSION_TOKEN).toBeUndefined();
  });

  test('preserves AWS_SESSION_TOKEN if it is defined', async () => {
    process.env.AWS_SESSION_TOKEN = 'aaa';
    delete process.env.AMAZON_SESSION_TOKEN;

    await AwsCliCompatible.credentialChainBuilder();

    expect(process.env.AWS_SESSION_TOKEN).toEqual('aaa');
  });

  test('assigns AWS_SESSION_TOKEN if it is not defined but AMAZON_SESSION_TOKEN is', async () => {
    delete process.env.AWS_SESSION_TOKEN;
    process.env.AMAZON_SESSION_TOKEN = 'aaa';

    await AwsCliCompatible.credentialChainBuilder();

    expect(process.env.AWS_SESSION_TOKEN).toEqual('aaa');
  });

  test('preserves AWS_SESSION_TOKEN if both are defined', async () => {
    process.env.AWS_SESSION_TOKEN = 'aaa';
    process.env.AMAZON_SESSION_TOKEN = 'bbb';

    await AwsCliCompatible.credentialChainBuilder();

    expect(process.env.AWS_SESSION_TOKEN).toEqual('aaa');
  });
});