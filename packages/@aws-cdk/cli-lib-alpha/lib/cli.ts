// eslint-disable-next-line import/no-extraneous-dependencies
import { exec as runCli } from 'aws-cdk/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createAssembly, prepareContext, prepareDefaultEnvironment } from 'aws-cdk/lib/api/cxapp/exec';
import { SharedOptions, DeployOptions, DestroyOptions, BootstrapOptions, SynthOptions, ListOptions, StackActivityProgress, HotswapMode } from './commands';

/**
 * AWS CDK CLI operations
 */
export interface IAwsCdkCli {
  /**
   * cdk list
   */
  list(options?: ListOptions): Promise<void>;

  /**
   * cdk synth
   */
  synth(options?: SynthOptions): Promise<void>;

  /**
   * cdk bootstrap
   */
  bootstrap(options?: BootstrapOptions): Promise<void>;

  /**
   * cdk deploy
   */
  deploy(options?: DeployOptions): Promise<void>;

  /**
   * cdk destroy
   */
  destroy(options?: DestroyOptions): Promise<void>;
}

/**
 * Configuration for creating a CLI from an AWS CDK App directory
 */
export interface CdkAppDirectoryProps {
  /**
   * Command-line for executing your app or a cloud assembly directory
   * e.g. "node bin/my-app.js"
   * or
   * "cdk.out"
   *
   * @default - read from cdk.json
   */
  readonly app?: string

  /**
   * Emits the synthesized cloud assembly into a directory
   *
   * @default cdk.out
   */
  readonly output?: string;
}

/**
 * A class returning the path to a Cloud Assembly Directory when its `produce` method is invoked with the current context
 *
 * AWS CDK apps might need to be synthesized multiple times with additional context values before they are ready.
 * When running the CLI from inside a directory, this is implemented by invoking the app multiple times.
 * Here the `produce()` method provides this multi-pass ability.
 */
export interface ICloudAssemblyDirectoryProducer {
  /**
   * The working directory used to run the Cloud Assembly from.
   * This is were a `cdk.context.json` files will be written.
   *
   * @default - current working directory
   */
  workingDirectory?: string;

  /**
   * Synthesize a Cloud Assembly directory for a given context.
   *
   * For all features to work correctly, `cdk.App()` must be instantiated with the received context values in the method body.
   * Usually obtained similar to this:
   * ```ts fixture=imports
   * class MyProducer implements ICloudAssemblyDirectoryProducer {
   *   async produce(context: Record<string, any>) {
   *     const app = new cdk.App({ context });
   *     // create stacks here
   *     return app.synth().directory;
   *   }
   * }
   * ```
   */
  produce(context: Record<string, any>): Promise<string>
}

/**
 * Provides a programmatic interface for interacting with the AWS CDK CLI
 */
export class AwsCdkCli implements IAwsCdkCli {
  /**
   * Create the CLI from a directory containing an AWS CDK app
   * @param directory the directory of the AWS CDK app. Defaults to the current working directory.
   * @param props additional configuration properties
   * @returns an instance of `AwsCdkCli`
   */
  public static fromCdkAppDirectory(directory?: string, props: CdkAppDirectoryProps = {}) {
    return new AwsCdkCli(async (args) => changeDir(
      () => {
        if (props.app) {
          args.push('--app', props.app);
        }
        if (props.output) {
          args.push('--output', props.output);
        }

        return runCli(args);
      },
      directory,
    ));
  }

  /**
   * Create the CLI from a CloudAssemblyDirectoryProducer
   */
  public static fromCloudAssemblyDirectoryProducer(producer: ICloudAssemblyDirectoryProducer) {
    return new AwsCdkCli(async (args) => changeDir(
      () => runCli(args, async (sdk, config) => {
        const env = await prepareDefaultEnvironment(sdk);
        const context = await prepareContext(config, env);

        return withEnv(async() => createAssembly(await producer.produce(context)), env);
      }),
      producer.workingDirectory,
    ));
  }

  private constructor(
    private readonly cli: (args: string[]) => Promise<number | void>,
  ) {}

  /**
   * Execute the CLI with a list of arguments
   */
  private async exec(args: string[]) {
    return this.cli(args);
  }

  /**
   * cdk list
   */
  public async list(options: ListOptions = {}) {
    const listCommandArgs: string[] = [
      ...renderBooleanArg('long', options.long),
      ...this.createDefaultArguments(options),
    ];

    await this.exec(['ls', ...listCommandArgs]);
  }

  /**
   * cdk synth
   */
  public async synth(options: SynthOptions = {}) {
    const synthCommandArgs: string[] = [
      ...renderBooleanArg('validation', options.validation),
      ...renderBooleanArg('quiet', options.quiet),
      ...renderBooleanArg('exclusively', options.exclusively),
      ...this.createDefaultArguments(options),
    ];

    await this.exec(['synth', ...synthCommandArgs]);
  }

  /**
   * cdk bootstrap
   */
  public async bootstrap(options: BootstrapOptions = {}) {
    const bootstrapCommandArgs: string[] = [
      ...renderBooleanArg('force', options.force),
      ...renderBooleanArg('show-template', options.showTemplate),
      ...renderBooleanArg('terminationProtection', options.terminationProtection),
      ...renderBooleanArg('example-permissions-boundary', options.examplePermissionsBoundary),
      ...renderBooleanArg('terminationProtection', options.usePreviousParameters),
      ...renderBooleanArg('execute', options.execute),
      ...options.toolkitStackName ? ['--toolkit-stack-name', options.toolkitStackName] : [],
      ...options.bootstrapBucketName ? ['--bootstrap-bucket-name', options.bootstrapBucketName] : [],
      ...options.cfnExecutionPolicy ? ['--cloudformation-execution-policies', options.cfnExecutionPolicy] : [],
      ...options.template ? ['--template', options.template] : [],
      ...options.customPermissionsBoundary ? ['--custom-permissions-boundary', options.customPermissionsBoundary] : [],
      ...options.qualifier ? ['--qualifier', options.qualifier] : [],
      ...options.trust ? ['--qualifier', options.trust] : [],
      ...options.trustForLookup ? ['--qualifier', options.trustForLookup] : [],
      ...options.bootstrapKmsKeyId ? ['--bootstrap-kms-key-id', options.bootstrapKmsKeyId] : [],
      ...options.bootstrapCustomerKey ? ['--bootstrap-customer-key', options.bootstrapCustomerKey] : [],
      ...options.publicAccessBlockConfiguration ? ['--public-access-block-configuration', options.publicAccessBlockConfiguration] : [],
      ...this.createDefaultArguments(options),
    ];

    await this.exec(['bootstrap', ...bootstrapCommandArgs]);
  }

  /**
   * cdk deploy
   */
  public async deploy(options: DeployOptions = {}) {
    const deployCommandArgs: string[] = [
      ...renderBooleanArg('ci', options.ci),
      ...renderBooleanArg('execute', options.execute),
      ...renderBooleanArg('exclusively', options.exclusively),
      ...renderBooleanArg('force', options.force),
      ...renderBooleanArg('previous-parameters', options.usePreviousParameters),
      ...renderBooleanArg('rollback', options.rollback),
      ...renderBooleanArg('staging', options.staging),
      ...renderBooleanArg('asset-parallelism', options.assetParallelism),
      ...renderBooleanArg('asset-prebuild', options.assetPrebuild),
      ...renderNumberArg('concurrency', options.concurrency),
      ...renderHotswapArg(options.hotswap),
      ...options.reuseAssets ? renderArrayArg('--reuse-assets', options.reuseAssets) : [],
      ...options.notificationArns ? renderArrayArg('--notification-arns', options.notificationArns) : [],
      ...options.parameters ? renderMapArrayArg('--parameters', options.parameters) : [],
      ...options.outputsFile ? ['--outputs-file', options.outputsFile] : [],
      ...options.requireApproval ? ['--require-approval', options.requireApproval] : [],
      ...options.changeSetName ? ['--change-set-name', options.changeSetName] : [],
      ...options.toolkitStackName ? ['--toolkit-stack-name', options.toolkitStackName] : [],
      ...options.progress ? ['--progress', options.progress] : ['--progress', StackActivityProgress.EVENTS],
      ...this.createDefaultArguments(options),
    ];

    await this.exec(['deploy', ...deployCommandArgs]);
  }

  /**
   * cdk destroy
   */
  public async destroy(options: DestroyOptions = {}) {
    const destroyCommandArgs: string[] = [
      ...options.requireApproval ? [] : ['--force'],
      ...renderBooleanArg('exclusively', options.exclusively),
      ...this.createDefaultArguments(options),
    ];

    await this.exec(['destroy', ...destroyCommandArgs]);
  }

  /**
   * Configure default arguments shared by all commands
   */
  private createDefaultArguments(options: SharedOptions): string[] {
    const stacks = options.stacks ?? ['--all'];
    return [
      ...renderBooleanArg('strict', options.strict),
      ...renderBooleanArg('trace', options.trace),
      ...renderBooleanArg('lookups', options.lookups),
      ...renderBooleanArg('ignore-errors', options.ignoreErrors),
      ...renderBooleanArg('json', options.json),
      ...renderBooleanArg('verbose', options.verbose),
      ...renderBooleanArg('debug', options.debug),
      ...renderBooleanArg('ec2creds', options.ec2Creds),
      ...renderBooleanArg('version-reporting', options.versionReporting),
      ...renderBooleanArg('path-metadata', options.pathMetadata),
      ...renderBooleanArg('asset-metadata', options.assetMetadata),
      ...renderBooleanArg('notices', options.notices),
      ...renderBooleanArg('color', options.color ?? (process.env.NO_COLOR ? false : undefined)),
      ...options.context ? renderMapArrayArg('--context', options.context) : [],
      ...options.profile ? ['--profile', options.profile] : [],
      ...options.proxy ? ['--proxy', options.proxy] : [],
      ...options.caBundlePath ? ['--ca-bundle-path', options.caBundlePath] : [],
      ...options.roleArn ? ['--role-arn', options.roleArn] : [],
      ...stacks,
    ];
  }
}

function renderHotswapArg(hotswapMode: HotswapMode | undefined): string[] {
  switch (hotswapMode) {
    case HotswapMode.FALL_BACK:
      return ['--hotswap-fallback'];
    case HotswapMode.HOTSWAP_ONLY:
      return ['--hotswap'];
    default:
      return [];
  }
}

function renderMapArrayArg(flag: string, parameters: { [name: string]: string | undefined }): string[] {
  const params: string[] = [];
  for (const [key, value] of Object.entries(parameters)) {
    params.push(`${key}=${value}`);
  }
  return renderArrayArg(flag, params);
}

function renderArrayArg(flag: string, values?: string[]): string[] {
  let args: string[] = [];
  for (const value of values ?? []) {
    args.push(flag, value);
  }
  return args;
}

function renderBooleanArg(arg: string, value?: boolean): string[] {
  if (value) {
    return [`--${arg}`];
  } else if (value === undefined) {
    return [];
  } else {
    return [`--no-${arg}`];
  }
}

function renderNumberArg(arg: string, value?: number): string[] {
  if (typeof value === 'undefined') {
    return [];
  }

  return [`--${arg}`, value.toString(10)];
}

/**
 * Run code from a different working directory
 */
async function changeDir(block: () => Promise<any>, workingDir?: string) {
  const originalWorkingDir = process.cwd();
  try {
    if (workingDir) {
      process.chdir(workingDir);
    }

    return await block();

  } finally {
    if (workingDir) {
      process.chdir(originalWorkingDir);
    }
  }
}

/**
 * Run code with additional environment variables
 */
async function withEnv(block: () => Promise<any>, env: Record<string, string> = {}) {
  const originalEnv = process.env;
  try {
    process.env = {
      ...originalEnv,
      ...env,
    };

    return await block();

  } finally {
    process.env = originalEnv;
  }
}
