import { AwsCliCompatible } from '../../../lib/api/aws-auth/awscli-compatible';

test('does not mess up with session token env variables if they are undefined', async () => {
  process.env.AWS_ACCESS_KEY_ID = 'foo';
  process.env.SECRET_ACCESS_KEY = 'bar';

  // Making sure these variables are not defined
  delete process.env.AWS_SESSION_TOKEN;
  delete process.env.AMAZON_SESSION_TOKEN;

  await AwsCliCompatible.credentialChainBuilder();

  expect(process.env.AWS_SESSION_TOKEN).toBeUndefined();
});

test('preserves session token env variables if they are defined', async () => {
  process.env.AWS_ACCESS_KEY_ID = 'foo';
  process.env.SECRET_ACCESS_KEY = 'bar';

  process.env.AWS_SESSION_TOKEN = 'aaa';
  process.env.AMAZON_SESSION_TOKEN = 'bbb';

  await AwsCliCompatible.credentialChainBuilder();

  expect(process.env.AWS_SESSION_TOKEN).toEqual('aaa');
});