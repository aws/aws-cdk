import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { AwsCliCompatible } from '../../../lib/api/aws-auth/awscli-compatible';

describe('AwsCliCompatible.region', () => {

  test('default region can be specified in config', async () => {

    const config = `
  [default]
  region=region-in-config
  `;

    await expect(region({ configFile: config })).resolves.toBe('region-in-config');
  });

  test('default region can be specified in credentials', async () => {

    const creds = `
  [default]
  region=region-in-credentials
  `;

    await expect(region({ credentialsFile: creds })).resolves.toBe('region-in-credentials');

  });

  test('profile region can be specified in config', async () => {

    const config = `
  [profile user1]
  region=region-in-config
  `;

    await expect(region({ configFile: config, profile: 'user1' })).resolves.toBe('region-in-config');

  });

  test('profile region can be specified in credentials', async () => {

    const creds = `
  [user1]
  region=region-in-credentials
  `;

    await expect(region({ credentialsFile: creds, profile: 'user1' })).resolves.toBe('region-in-credentials');

  });

  test('region from config takes precedence over region from credentials', async () => {

    const config = `
  [default]
  region=region-in-config
  `;

    const credentials = `
  [default]
  region=region-in-credentials
  `;

    await expect(region({ credentialsFile: credentials, configFile: config })).resolves.toBe('region-in-config');
  });

});

async function region(opts: {
  readonly configFile?: string;
  readonly credentialsFile?: string;
  readonly profile?: string;
}) {

  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'awscli-compatible.test'));

  try {

    if (opts.configFile) {
      const configPath = path.join(workdir, 'config');
      fs.writeFileSync(configPath, opts.configFile);
      process.env.AWS_CONFIG_FILE = configPath;
    }

    if (opts.credentialsFile) {
      const credentialsPath = path.join(workdir, 'credentials');
      fs.writeFileSync(credentialsPath, opts.credentialsFile);
      process.env.AWS_SHARED_CREDENTIALS_FILE = credentialsPath;
    }

    return await AwsCliCompatible.region(opts.profile);

  } finally {
    process.env.AWS_CONFIG_FILE = '/dev/null';
    process.env.AWS_SHARED_CREDENTIALS_FILE = '/dev/null';
    fs.removeSync(workdir);
  }
}