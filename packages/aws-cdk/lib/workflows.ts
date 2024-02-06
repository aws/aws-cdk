
import '@jsii/check-node/run';
import { Environment } from '@aws-cdk/cx-api';
import { DefaultSelection, ExtendedStackSelection, StackCollection } from './api/cxapp/cloud-assembly';
import { ILock } from './api/util/rwlock';
import { CdkToolkit } from './cdk-toolkit';
import { SdkProvider } from '../lib/api/aws-auth';
import { CloudExecutable } from '../lib/api/cxapp/cloud-executable';
import { execProgram } from '../lib/api/cxapp/exec';
import { Deployments } from '../lib/api/deployments';
import { ToolkitInfo } from '../lib/api/toolkit-info';
import { Command, Configuration } from '../lib/settings';

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
      _: options.arguments._ as [Command, ...string[]],
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

export interface ListWorkflowOptions {
  readonly selectors: string[];
}

export type DependencyDetails = {
  id: string;
  dependencies: DependencyDetails[];
};

export type StackDetails = {
  id: string;
  name: string;
  environment: Environment;
  dependencies: DependencyDetails[];
};

export async function listWorkflow(toolkit: CdkToolkit, options: ListWorkflowOptions): Promise<string> {
  const assembly = await toolkit.assembly();

  const stacks = await assembly.selectStacks({
    patterns: options.selectors,
  }, {
    extend: ExtendedStackSelection.Upstream,
    defaultBehavior: DefaultSelection.AllStacks,
  });

  toolkit.validateStacksSelected(stacks, options.selectors);
  toolkit.validateStacks(stacks);

  function calculateStackDependencies(collectionOfStacks: StackCollection): StackDetails[] {
    const allData: StackDetails[] = [];

    for (const stack of collectionOfStacks.stackArtifacts) {
      const data: StackDetails = {
        id: stack.id,
        name: stack.stackName,
        environment: stack.environment,
        dependencies: [],
      };

      for (const dependencyId of stack.dependencies.map(x => x.manifest.displayName ?? x.id)) {
        if (dependencyId.includes('.assets')) {
          continue;
        }

        const depStack = assembly.stackById(dependencyId);

        if (depStack.stackCount > 1) {
          throw new Error(`This command requires exactly one stack and we matched more than one: ${depStack.stackIds}`);
        }

        if (depStack.stackArtifacts[0].dependencies.length > 0 &&
          depStack.stackArtifacts[0].dependencies.filter((dep) => !(dep.manifest.displayName ?? dep.id).includes('.assets')).length > 0) {

          const stackWithDeps = calculateStackDependencies(depStack);

          for (const stackDetail of stackWithDeps) {
            data.dependencies.push({
              id: stackDetail.id,
              dependencies: stackDetail.dependencies,
            });
          }
        } else {
          data.dependencies?.push({
            id: depStack.stackArtifacts[0].id,
            dependencies: [],
          });
        }
      }

      allData.push(data);
    }

    return allData;
  }

  const result = calculateStackDependencies(stacks);

  // StackDetails[] as serialized output
  return JSON.stringify(result);
}