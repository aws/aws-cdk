
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
import { Arguments, Configuration } from '../lib/settings';

/**
 * Options for initializing the CDK Toolkit
 */
export interface InitOptions {
  /**
   * Print trace for stack warnings
   */
  readonly trace?: boolean;
  /**
   * Show debug logs (specify multiple times to increase verbosity)
   *
   * @default false
   */
  readonly verbose?: number;
  /**
   * Ignores synthesis errors, which will likely produce an invalid output
   *
   * @default false
   */
  readonly ignoreErrors?: boolean;
  /**
   * To not filter out AWS::CDK::Metadata resources or mangled non-ASCII characters
   *
   * @default false
   */
  readonly strict?: boolean;
  /**
   * Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status
   */
  readonly ec2creds?: boolean;
  /**
   * Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified
   */
  readonly proxy?: string;
  /**
   * Path to CA certificate to use when validating HTTPS requests. Will read from AWS_CA_BUNDLE environment variable if not specified
   */
  readonly caBundlePath?: string;
  /**
   * Key-Value pair for additional cli arguments for toolkit initialization
   */
  readonly cliArgs?: Arguments;
}

/**
 * To initialize CDK Toolkit
 *
 * @param options cdk toolkit initialization options
 * @returns cdk toolkit instance
 */
export async function init(options: InitOptions): Promise<CdkToolkit> {
  // Configuration
  const configuration = new Configuration({
    commandLineArguments: options.cliArgs,
  });
  await configuration.load();

  // SDKProvider
  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: configuration.settings.get(['profile']),
    ec2creds: options.ec2creds,
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

/**
 * Options for List Workflow
 */
export interface ListWorkflowOptions {
  /**
   * Stacks to list
   *
   * @default - All stacks are listed
   */
  readonly selectors: string[];
}

/**
 * Type to store stack dependencies recursively
 */
export type DependencyDetails = {
  id: string;
  dependencies: DependencyDetails[];
};

/**
 * Type to store stack and their dependencies
 */
export type StackDetails = {
  id: string;
  name: string;
  environment: Environment;
  dependencies: DependencyDetails[];
};

/**
 * List workflow
 *
 * @param toolkit cdk toolkit
 * @param options list workflow options
 * @returns serialized output of StackDetails[]
 */
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

      for (const dependencyId of stack.dependencies.map(x => x.id)) {
        if (dependencyId.includes('.assets')) {
          continue;
        }

        const depStack = assembly.stackById(dependencyId);

        if (depStack.stackArtifacts[0].dependencies.length > 0 &&
          depStack.stackArtifacts[0].dependencies.filter((dep) => !(dep.id).includes('.assets')).length > 0) {

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

  return JSON.stringify(result);
}