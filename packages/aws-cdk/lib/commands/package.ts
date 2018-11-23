import cxapi = require('@aws-cdk/cx-api');
import path = require('path');
import process = require('process');
import yargs = require('yargs');
import { SDK } from '../api';
import { AppStacks } from '../api/cxapp/stacks';
import { print, warning } from '../logging';
import { Configuration, Settings } from '../settings';
import { CloudAssembly} from '../util/cloud-assembly';

export const command = 'package';
export const describe = 'Package a CDK Application to a Cloud Assembly';
export const builder: yargs.CommandBuilder = {
  out: {
    type: 'string',
    desc: 'The file to output the Cloud Assembly to',
    default: 'assembly.cloud',
  }
};

export async function handler(argv: yargs.Arguments): Promise<number> {
  const configuration = await new Configuration(_argumentsToSettings(argv)).load();
  const appStacks = new AppStacks(argv, configuration, new SDK({
    profile: argv.profile,
    proxyAddress: argv.proxy,
    ec2creds: argv.ec2creds,
  }));
  const outFile = path.resolve(process.cwd(), argv.out);
  await _createCloudAssembly(await appStacks.synthesizeStacks(), outFile);
  print(outFile);
  return 0;
}

function _argumentsToSettings(argv: yargs.Arguments) {
  const context: any = {};

  // Turn list of KEY=VALUE strings into an object
  for (const assignment of (argv.context || [])) {
    const parts = assignment.split('=', 2);
    if (parts.length === 2) {
      if (parts[0].match(/^aws:.+/)) {
        throw new Error(`User-provided context cannot use keys prefixed with 'aws:', but ${parts[0]} was provided.`);
      }
      context[parts[0]] = parts[1];
    } else {
      warning('Context argument is not an assignment (key=value): %s', assignment);
    }
  }

  return new Settings({
    app: argv.app,
    context,
    toolkitStackName: argv.toolkitStackName,
    versionReporting: argv.versionReporting,
    pathMetadata: argv.pathMetadata,
  });
}

async function _createCloudAssembly(synth: cxapi.SynthesizeResponse, outFile: string): Promise<void> {
  return new Promise<void>(async (ok, ko) => {
    const cloudAssembly = new CloudAssembly(outFile);
    cloudAssembly.on('close', ok);
    cloudAssembly.on('error', ko);

    for (const stack of synth.stacks) {
      cloudAssembly.addStack(stack);
    }

    cloudAssembly.finalize();
  });
}
