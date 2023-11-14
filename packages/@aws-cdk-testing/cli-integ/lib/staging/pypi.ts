/* eslint-disable no-console */
import * as path from 'path';
import { LoginInformation } from './codeartifact';
import { parallelShell } from './parallel-shell';
import { UsageDir } from './usage-dir';
import { writeFile } from '../files';
import { shell } from '../shell';

export async function pypiLogin(login: LoginInformation, usageDir: UsageDir) {
  // Write pip config file and set environment var
  await writeFile(path.join(usageDir.directory, 'pip.conf'), [
    '[global]',
    `index-url = https://aws:${login.authToken}@${login.pypiEndpoint.replace(/^https:\/\//, '')}simple/`,
  ].join('\n'));
  await usageDir.addToEnv({
    PIP_CONFIG_FILE: `${usageDir.directory}/pip.conf`,
  });
}

export async function uploadPythonPackages(packages: string[], login: LoginInformation) {
  await shell(['pip', 'install', 'twine'], { show: 'error' });

  // Even though twine supports uploading all packages in one go, we have to upload them
  // individually since CodeArtifact does not support Twine's `--skip-existing`. Fun beans.
  await parallelShell(packages, async (pkg, output) => {
    console.log(`⏳ ${pkg}`);

    await shell(['twine', 'upload', '--verbose', pkg], {
      modEnv: {
        TWINE_USERNAME: 'aws',
        TWINE_PASSWORD: login.authToken,
        TWINE_REPOSITORY_URL: login.pypiEndpoint,
      },
      show: 'error',
      output,
    });

    console.log(`✅ ${pkg}`);
  }, (pkg, output) => {
    if (output.toString().includes('This package is configured to block new versions') || output.toString().includes('409 Conflict')) {
      console.log(`❌ ${pkg}: already exists. Skipped.`);
      return 'skip';
    }
    if (output.includes('429 Too Many Requests ')) {
      console.log(`♻️ ${pkg}: 429 Too Many Requests. Retrying.`);
      return 'retry';
    }
    return 'fail';
  });
}