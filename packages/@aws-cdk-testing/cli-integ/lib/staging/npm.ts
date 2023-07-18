/* eslint-disable no-console */
import * as path from 'path';
import { LoginInformation } from './codeartifact';
import { parallelShell } from './parallel-shell';
import { UsageDir } from './usage-dir';
import { updateIniKey, loadLines, writeLines } from '../files';
import { shell } from '../shell';

export async function npmLogin(login: LoginInformation, usageDir: UsageDir) {
  // Creating an ~/.npmrc that references an envvar is what you're supposed to do. (https://docs.npmjs.com/private-modules/ci-server-config)
  await writeNpmLoginToken(usageDir, login.npmEndpoint, '${NPM_TOKEN}');

  // Add variables to env file
  await usageDir.addToEnv(npmEnv(usageDir, login));
}

function npmEnv(usageDir: UsageDir, login: LoginInformation) {
  return {
    npm_config_userconfig: path.join(usageDir.directory, '.npmrc'),
    npm_config_registry: login.npmEndpoint,
    npm_config_always_auth: 'true', // Necessary for NPM 6, otherwise it will sometimes not pass the token
    NPM_TOKEN: login.authToken,
  };
}

export async function uploadNpmPackages(packages: string[], login: LoginInformation, usageDir: UsageDir) {
  await parallelShell(packages, async (pkg, output) => {
    console.log(`⏳ ${pkg}`);

    // path.resolve() is required -- if the filename ends up looking like `js/bla.tgz` then NPM thinks it's a short form GitHub name.
    await shell(['node', require.resolve('npm'), 'publish', path.resolve(pkg)], {
      modEnv: npmEnv(usageDir, login),
      show: 'error',
      output,
    });

    console.log(`✅ ${pkg}`);
  }, (pkg, output) => {
    if (output.toString().includes('code EPUBLISHCONFLICT')) {
      console.log(`❌ ${pkg}: already exists. Skipped.`);
      return 'skip';
    }
    if (output.toString().includes('code EPRIVATE')) {
      console.log(`❌ ${pkg}: is private. Skipped.`);
      return 'skip';
    }
    return 'fail';
  });
}

async function writeNpmLoginToken(usageDir: UsageDir, endpoint: string, token: string) {
  const rcFile = path.join(usageDir.directory, '.npmrc');
  const lines = await loadLines(rcFile);

  const key = `${endpoint.replace(/^https:/, '')}:_authToken`;
  updateIniKey(lines, key, token);

  await writeLines(rcFile, lines);
  return rcFile;
}

// Environment variable, .npmrc in same directory as package.json or in home dir