import colors = require('colors/safe');
import process = require('process');
import yargs = require('yargs');
import { print } from '../../lib/logging';
import { VERSION } from '../../lib/version';
import { CommandOptions } from '../command-api';

export const command = 'doctor';
export const describe = 'Check your set-up for potential problems';
export const builder = {};

export function handler(args: yargs.Arguments) {
  args.commandHandler = realHandler;
}

export async function realHandler(_options: CommandOptions): Promise<number> {
  let exitStatus: number = 0;
  for (const verification of verifications) {
    if (!await verification()) {
      exitStatus = -1;
    }
  }
  return exitStatus;
}

const verifications: Array<() => boolean | Promise<boolean>> = [
  displayVersionInformation,
  displayAwsEnvironmentVariables
];

// ### Verifications ###

function displayVersionInformation() {
  print(`ℹ️ CDK Version: ${colors.green(VERSION)}`);
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
    print(`  - ${colors.blue(key)} = ${colors.green(process.env[key]!)}`);
  }
  return true;
}
