import '@jsii/check-node/run';
import { SdkProvider } from '../../lib/api/aws-auth';
import { CloudExecutable } from '../../lib/api/cxapp/cloud-executable';
import { execProgram } from '../../lib/api/cxapp/exec';
import { Deployments } from '../../lib/api/deployments';
import { ToolkitInfo } from '../../lib/api/toolkit-info';
import { CdkToolkit } from '../../lib/cdk-toolkit';
import { Command, Configuration } from '../../lib/settings';
import { ILock } from '../api/util/rwlock';

export interface InitOptions {
  trace?: boolean;
  verbose?: number;
  ignoreErrors?: boolean;
  strict?: boolean;
  ec2creds?: boolean;
  proxy?: string;
  caBundlePath?: string;
  arguments: { [key: string]: any };
}

export async function init(options: InitOptions): Promise<CdkToolkit> {
  // Configuration
  const configuration = new Configuration({
    commandLineArguments: {
      ...options,
      _: options.arguments._ as [Command, ...string[]], // TypeScript at its best
    },
  });
  await configuration.load();

  // SDKProvider
  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: configuration.settings.get(['profile']),
    ec2creds: options.ec2creds ?? false,
    httpOptions: {
      proxyAddress: options.proxy,
      caBundlePath: options.caBundlePath,
    },
  });

  // CloudExecutable
  let outDirLock: ILock | undefined;
  const cloudExecutable = new CloudExecutable({
    configuration,
    sdkProvider,
    // options.synthesizer in cli.ts. Do not see it being used in any reference, dead code?
    synthesizer: (async (aws, config) => {
      // Invoke 'execProgram', and copy the lock for the directory in the global
      // variable here. It will be released when the CLI exits. Locks are not re-entrant
      // so release it if we have to synthesize more than once (because of context lookups).
      await outDirLock?.release();
      const { assembly, lock } = await execProgram(aws, config);
      outDirLock = lock;
      return assembly;
    }),
  });

  // CloudFormation
  const toolkitStackName: string = ToolkitInfo.determineName(configuration.settings.get(['toolkitStackName']));
  const cloudFormation = new Deployments({ sdkProvider, toolkitStackName });

  // CdkToolkit
  const toolkit = new CdkToolkit({
    cloudExecutable,
    deployments: cloudFormation,
    verbose: options.trace || (options.verbose ? options.verbose > 0: false),
    ignoreErrors: options.ignoreErrors ?? false,
    strict: options.strict ?? false,
    configuration,
    sdkProvider,
  });

  return toolkit;
}