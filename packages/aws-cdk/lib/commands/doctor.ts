import * as process from 'process';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { print } from '../../lib/logging';
import * as version from '../../lib/version';
import { CommandOptions } from '../command-api';

export async function realHandler(_options: CommandOptions): Promise<number> {
  let exitStatus: number = 0;
  for (const verification of verifications) {
    if (!await verification()) {
      exitStatus = -1;
    }
  }
  await version.displayVersionMessage();
  return exitStatus;
}

const verifications: Array<() => boolean | Promise<boolean>> = [
  displayVersionInformation,
  displayAwsEnvironmentVariables,
  displayCdkEnvironmentVariables,
];

// ### Verifications ###

function displayVersionInformation() {
  print(`ℹ️ CDK Version: ${chalk.green(version.DISPLAY_VERSION)}`);
  return true;
}

function displayAwsEnvironmentVariables() {
  const keys = Object.keys(process.env).filter(s => s.startsWith('AWS_'));
  if (keys.length === 0) {
    print('ℹ️ No AWS environment variables');
    return true;
  }
  print('ℹ️ AWS environment variables:');
  for (const key of keys) {
    print(`  - ${chalk.blue(key)} = ${chalk.green(anonymizeAwsVariable(key, process.env[key]!))}`);
  }
  return true;
}

function displayCdkEnvironmentVariables() {
  const keys = Object.keys(process.env).filter(s => s.startsWith('CDK_'));
  if (keys.length === 0) {
    print('ℹ️ No CDK environment variables');
    return true;
  }
  print('ℹ️ CDK environment variables:');
  let healthy = true;
  for (const key of keys.sort()) {
    if (key === cxapi.CONTEXT_ENV || key === cxapi.CONTEXT_LOCATION_ENV || key === cxapi.OUTDIR_ENV) {
      print(`  - ${chalk.red(key)} = ${chalk.green(process.env[key]!)} (⚠️ reserved for use by the CDK toolkit)`);
      healthy = false;
    } else {
      print(`  - ${chalk.blue(key)} = ${chalk.green(process.env[key]!)}`);
    }
  }
  return healthy;
}

function anonymizeAwsVariable(name: string, value: string) {
  if (name === 'AWS_ACCESS_KEY_ID') { return value.slice(0, 4) + '<redacted>'; } // Show ASIA/AKIA key type, but hide identifier
  if (name === 'AWS_SECRET_ACCESS_KEY' || name === 'AWS_SESSION_TOKEN' || name === 'AWS_SECURITY_TOKEN') { return '<redacted>'; }
  return value;
}
