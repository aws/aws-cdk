import * as childProcess from 'child_process';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { debug, warning } from '../../logging';
import { Configuration } from '../../settings';
import { ToolkitError } from '../../toolkit/error';
import { loadTree, some } from '../../tree';
import { splitBySize } from '../../util/objects';
import { versionNumber } from '../../version';
import { SdkProvider } from '../aws-auth';

interface ExecOptions {
  extraEnv?: { [key: string]: string | undefined };
  cwd?: string;
}

/**
 * Exec the CDK app command.
 */
export async function exec(commandAndArgs: string, options: ExecOptions = {}) {
  return new Promise<void>((ok, fail) => {
    // We use a slightly lower-level interface to:
    //
    // - Pass arguments in an array instead of a string, to get around a
    //   number of quoting issues introduced by the intermediate shell layer
    //   (which would be different between Linux and Windows).
    //
    // - Inherit stderr from controlling terminal. We don't use the captured value
    //   anyway, and if the subprocess is printing to it for debugging purposes the
    //   user gets to see it sooner. Plus, capturing doesn't interact nicely with some
    //   processes like Maven.
    const proc = childProcess.spawn(commandAndArgs, {
      stdio: ['ignore', 'inherit', 'inherit'],
      detached: false,
      shell: true,
      cwd: options.cwd,
      env: {
        ...process.env,
        ...(options.extraEnv ?? {}),
      },
    });

    proc.on('error', fail);

    proc.on('exit', code => {
      if (code === 0) {
        return ok();
      } else {
        debug('failed command:', commandAndArgs);
        return fail(new ToolkitError(`Subprocess exited with error ${code}`));
      }
    });
  });
}

/**
 * Creates an assembly with error handling
 */
export async function createAssembly(appDir: string) {
  try {
    const assembly = new cxapi.CloudAssembly(appDir, {
      // We sort as we deploy
      topoSort: false,
    });
    checkContextOverflowSupport(assembly);
    return assembly;

  } catch (error: any) {
    if (error.message.includes(cxschema.VERSION_MISMATCH)) {
      // this means the CLI version is too old.
      // we instruct the user to upgrade.
      throw new ToolkitError(`This CDK CLI is not compatible with the CDK library used by your application. Please upgrade the CLI to the latest version.\n(${error.message})`);
    }
    throw error;
  }
}

type Env = { [key: string]: string };
type Context = { [key: string]: any };

/**
 * If we don't have region/account defined in context, we fall back to the default SDK behavior
 * where region is retrieved from ~/.aws/config and account is based on default credentials provider
 * chain and then STS is queried.
 *
 * This is done opportunistically: for example, if we can't access STS for some reason or the region
 * is not configured, the context value will be 'null' and there could failures down the line. In
 * some cases, synthesis does not require region/account information at all, so that might be perfectly
 * fine in certain scenarios.
 */
export async function prepareDefaultEnvironment(aws: SdkProvider, props: {
  outdir?: string;
} = {}): Promise<Env> {
  const env: Env = { };

  env[cxapi.DEFAULT_REGION_ENV] = aws.defaultRegion;
  debug(`Setting "${cxapi.DEFAULT_REGION_ENV}" environment variable to`, env[cxapi.DEFAULT_REGION_ENV]);

  const accountId = (await aws.defaultAccount())?.accountId;
  if (accountId) {
    env[cxapi.DEFAULT_ACCOUNT_ENV] = accountId;
    debug(`Setting "${cxapi.DEFAULT_ACCOUNT_ENV}" environment variable to`, env[cxapi.DEFAULT_ACCOUNT_ENV]);
  }

  if (props.outdir) {
    env[cxapi.OUTDIR_ENV] = props.outdir;
    debug('outdir:', props.outdir);
  }

  // CLI version information
  env[cxapi.CLI_ASM_VERSION_ENV] = cxschema.Manifest.version();
  env[cxapi.CLI_VERSION_ENV] = versionNumber();

  debug('env:', env);
  return env;
}

/**
 * Settings related to synthesis are read from context.
 * The merging of various configuration sources like cli args or cdk.json has already happened.
 * We now need to set the final values to the context.
 */
export async function prepareContext(config: Configuration, env: Env): Promise<{ [key: string]: any }> {
  const context = config.context.all;

  const debugMode: boolean = config.settings.get(['debug']) ?? true;
  if (debugMode) {
    env.CDK_DEBUG = 'true';
  }

  const pathMetadata: boolean = config.settings.get(['pathMetadata']) ?? true;
  if (pathMetadata) {
    context[cxapi.PATH_METADATA_ENABLE_CONTEXT] = true;
  }

  const assetMetadata: boolean = config.settings.get(['assetMetadata']) ?? true;
  if (assetMetadata) {
    context[cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT] = true;
  }

  const versionReporting: boolean = config.settings.get(['versionReporting']) ?? true;
  if (versionReporting) { context[cxapi.ANALYTICS_REPORTING_ENABLED_CONTEXT] = true; }
  // We need to keep on doing this for framework version from before this flag was deprecated.
  if (!versionReporting) { context['aws:cdk:disable-version-reporting'] = true; }

  const stagingEnabled = config.settings.get(['staging']) ?? true;
  if (!stagingEnabled) {
    context[cxapi.DISABLE_ASSET_STAGING_CONTEXT] = true;
  }

  const bundlingStacks = config.settings.get(['bundlingStacks']) ?? ['**'];
  context[cxapi.BUNDLING_STACKS] = bundlingStacks;

  debug('context:', context);

  return context;
}

/**
 * Make sure the 'app' is an array
 *
 * If it's a string, split on spaces as a trivial way of tokenizing the command line.
 */
function appToArray(app: any) {
  return typeof app === 'string' ? app.split(' ') : app;
}

type CommandGenerator = (file: string) => string[];

/**
 * Execute the given file with the same 'node' process as is running the current process
 */
function executeNode(scriptFile: string): string[] {
  return [process.execPath, scriptFile];
}

/**
 * Mapping of extensions to command-line generators
 */
const EXTENSION_MAP = new Map<string, CommandGenerator>([
  ['.js', executeNode],
]);

/**
 * Guess the executable from the command-line argument
 *
 * Only do this if the file is NOT marked as executable. If it is,
 * we'll defer to the shebang inside the file itself.
 *
 * If we're on Windows, we ALWAYS take the handler, since it's hard to
 * verify if registry associations have or have not been set up for this
 * file type, so we'll assume the worst and take control.
 */
export async function guessExecutable(app: string) {
  const commandLine = appToArray(app);

  if (commandLine.length === 1) {
    let fstat;

    try {
      fstat = await fs.stat(commandLine[0]);
    } catch {
      debug(`Not a file: '${commandLine[0]}'. Using '${commandLine}' as command-line`);
      return commandLine;
    }

    // eslint-disable-next-line no-bitwise
    const isExecutable = (fstat.mode & fs.constants.X_OK) !== 0;
    const isWindows = process.platform === 'win32';

    const handler = EXTENSION_MAP.get(path.extname(commandLine[0]));
    if (handler && (!isExecutable || isWindows)) {
      return handler(commandLine[0]);
    }
  }
  return commandLine;
}

/**
 * Checks if a given assembly supports context overflow, warn otherwise.
 *
 * @param assembly the assembly to check
 */
function checkContextOverflowSupport(assembly: cxapi.CloudAssembly): void {
  const tree = loadTree(assembly);
  const frameworkDoesNotSupportContextOverflow = some(tree, node => {
    const fqn = node.constructInfo?.fqn;
    const version = node.constructInfo?.version;
    return (fqn === 'aws-cdk-lib.App' && version != null && semver.lte(version, '2.38.0')) // v2
    || fqn === '@aws-cdk/core.App'; // v1
  });

  // We're dealing with an old version of the framework here. It is unaware of the temporary
  // file, which means that it will ignore the context overflow.
  if (frameworkDoesNotSupportContextOverflow) {
    warning('Part of the context could not be sent to the application. Please update the AWS CDK library to the latest version.');
  }
}
/**
 * Calculates the available space for context in the environment
 * This is potentially to conservative, see https://github.com/aws/aws-cdk/issues/32833
 *
 * @param env the input environment to take into account
 * @param limit the OS dependent max environment size limit
 * @returns the amount of space available for the context env variable
 */
function spaceAvailableForContext(env: Env, limit: number) {
  const size = (value: string) => value != null ? Buffer.byteLength(value) : 0;

  const usedSpace = Object.entries(env)
    .map(([k, v]) => k === cxapi.CONTEXT_ENV ? size(k) : size(k) + size(v))
    .reduce((a, b) => a + b, 0);

  return Math.max(0, limit - usedSpace);
}

/**
 * Run code from a different working directory
 */
export async function changeDir<T>(block: () => Promise<T>, workingDir?: string) {
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
export async function withEnv<T>(env: Env = {}, block: () => Promise<T>) {
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

/**
 * Run code with context setup inside the environment
 */
export async function withContext<T>(env: Env, config: Configuration, block: (env: Env, context: Context) => Promise<T>) {
  const context = await prepareContext(config, env);
  let contextOverflowLocation = null;

  try {
    const envVariableSizeLimit = os.platform() === 'win32' ? 32760 : 131072;
    const [smallContext, overflow] = splitBySize(context, spaceAvailableForContext(env, envVariableSizeLimit));

    // Store the safe part in the environment variable
    env[cxapi.CONTEXT_ENV] = JSON.stringify(smallContext);

    // If there was any overflow, write it to a temporary file
    if (Object.keys(overflow ?? {}).length > 0) {
      const contextDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-context'));
      contextOverflowLocation = path.join(contextDir, 'context-overflow.json');
      fs.writeJSONSync(contextOverflowLocation, overflow);
      env[cxapi.CONTEXT_OVERFLOW_LOCATION_ENV] = contextOverflowLocation;
    }

    // call the block code with new environment
    return await block(env, context);
  } finally {
    if (contextOverflowLocation) {
      fs.removeSync(path.dirname(contextOverflowLocation));
    }
  }
}
