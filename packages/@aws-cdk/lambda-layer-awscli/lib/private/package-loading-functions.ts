import * as childproc from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as semver from 'semver';

export function _tryLoadPackage(packageName: string, targetVersion: string, logs: string[]): any {
  let availableVersion;
  let assetPackagePath;
  try {
    assetPackagePath = require.resolve(`${packageName}`);
  } catch (e) {
    logs.push(`require.resolve('${packageName}') failed`);
    const eAsError = e as Error;
    if (eAsError?.stack) {
      logs.push(eAsError.stack);
    }
    return;
  }
  availableVersion = requireWrapper(path.join(assetPackagePath, '../../package.json'), logs).version;

  if (semver.satisfies(availableVersion, targetVersion)) {
    logs.push(`${packageName} already installed with correct version: ${availableVersion}.`);
    const result = requireWrapper(packageName, logs);
    if (result) {
      logs.push(`Successfully loaded ${packageName} from pre-installed packages.`);
      return result;
    }
  } else {
    logs.push(`${packageName} already installed with incorrect version: ${availableVersion}. Target version was: ${targetVersion}.`);
  }
}

export function _downloadPackage(packageName: string, packageNpmTarPrefix: string, targetVersion: string, logs: string[]): string | undefined {
  const cdkHomeDir = cxapi.cdkHomeDir();
  const downloadDir = path.join(cdkHomeDir, 'npm-cache');
  const downloadPath = path.join(downloadDir, `${packageNpmTarPrefix}${targetVersion}.tgz`);

  if (fs.existsSync(downloadPath)) {
    logs.push(`Using package archive already available at location: ${downloadPath}`);
    return downloadPath;
  }
  logs.push(`Downloading package using npm pack to: ${downloadDir}`);
  fs.mkdirSync(downloadDir);
  childproc.execSync(`npm pack ${packageName}@${targetVersion} -q`, {
    cwd: downloadDir,
  });
  if (fs.existsSync(downloadPath)) {
    logs.push('Successfully downloaded using npm pack.');
    return downloadPath;
  }

  logs.push('Failed to download using npm pack.');
  return undefined;
}

export function requireWrapper(id: string, logs: string[]): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const result = require(id);
    if (result) {
      logs.push(`require('${id}') succeeded.`);
    }
    return result;
  } catch (e) {
    logs.push(`require('${id}') failed.`);
    const eAsError = e as Error;
    if (eAsError?.stack) {
      logs.push(eAsError.stack);
    }
  }
}

export function installAndLoadPackage(packageName: string, from: string, logs: string[]): any {
  const installDir = findInstallDir();
  if (!installDir) {
    logs.push('Unable to find an install directory. require.main.paths[0] is undefined.');
    return;
  }
  logs.push(`Installing from: ${from} to: ${installDir}`);
  childproc.execSync(`npm install ${from} --no-save --prefix ${installDir} -q`);
  return requireWrapper(path.join(installDir, 'node_modules', packageName, 'lib/index.js'), logs);
}

export function findInstallDir(): string | undefined {
  if (!require.main?.paths) {
    return undefined;
  }
  return require.main.paths[0];
}