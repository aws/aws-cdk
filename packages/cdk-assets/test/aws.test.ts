import { DefaultAwsClient } from '../lib/aws';

test('Can get credentials from profile', async () => {
  let client = new DefaultAwsClient('default');
  let options = (client as any).awsOptions({ region: 'us-east-1' });
  await expect(options.credentials).not.toBeNull();
});

test('Can get credentials from environment variables', async () => {
  process.env.AWS_ACCESS_KEY_ID='12345';
  process.env.AWS_SECRET_ACCESS_KEY='xyz';
  process.env.AWS_SESSION_TOKEN='12345xyz';
  let client = new DefaultAwsClient();
  let options = await (client as any).awsOptions({ region: 'us-east-1' });
  await expect(options.credentials).not.toBeNull();
  await expect(options.credentials.accessKeyId).toBe('12345');
  await expect(options.credentials.secretAccessKey).toBe('xyz');
  await expect(options.credentials.sessionToken).toBe('12345xyz');
});