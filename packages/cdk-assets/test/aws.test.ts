
import { DefaultAwsClient } from '../lib/aws';

const _ENV = process.env;

beforeEach(() => {
  process.env= Object.assign({}, _ENV);
});


test('Can get credentials from profile', async () => {
  let client = new DefaultAwsClient('default');
  let options = await (client as any).awsOptions({ region: 'us-east-1' });
  await expect(options.credentials).not.toBeNull();
  await expect(options.credentials.constructor.name).toBe('SharedIniFileCredentials');
});

test('Can get credentials from environment variables', async () => {
  process.env.AWS_ACCESS_KEY_ID='12345';
  process.env.AWS_SECRET_ACCESS_KEY='xyz';
  process.env.AWS_SESSION_TOKEN='12345xyz';
  let client = new DefaultAwsClient();
  let options = await (client as any).awsOptions({ region: 'us-east-1' });
  await expect(options.credentials).not.toBeNull();
  await expect(options.credentials.constructor.name).toBe('EnvironmentCredentials');
  await expect(options.credentials.accessKeyId).toBe('12345');
  await expect(options.credentials.secretAccessKey).toBe('xyz');
  await expect(options.credentials.sessionToken).toBe('12345xyz');

});


test('Can get credentials when AWS_PROFILE is set', async () => {
  process.env.AWS_PROFILE='default';
  let client = new DefaultAwsClient();
  let options = await (client as any).awsOptions({ region: 'us-east-1' });
  await expect(options.credentials).not.toBeNull();
  await expect(options.credentials.constructor.name).toBe('SharedIniFileCredentials');
});
