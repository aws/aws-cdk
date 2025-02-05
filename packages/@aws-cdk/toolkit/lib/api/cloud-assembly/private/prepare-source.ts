import * as os from 'node:os';
import * as path from 'node:path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { lte } from 'semver';
import { prepareDefaultEnvironment as oldPrepare, prepareContext, spaceAvailableForContext, Settings, loadTree, some, splitBySize, versionNumber } from '../../../api/aws-cdk';
import { ToolkitServices } from '../../../toolkit/private';
import { ToolkitError } from '../../errors';
import { ActionAwareIoHost, asLogger, error } from '../../io/private';
import type { AppSynthOptions } from '../source-builder';

export { guessExecutable } from '../../../api/aws-cdk';

type Env = { [key: string]: string };
type Context = { [key: string]: any };

/**
 * Turn the given optional output directory into a fixed output directory
 */
export function determineOutputDirectory(outdir?: string) {
  return outdir ?? fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'cdk.out'));
}

/**
 * If we don't have region/account defined in context, we fall back to the default SDK behavior
 * where region is retrieved from ~/.aws/config and account is based on default credentials provider
 * chain and then STS is queried.
 *
 * This is done opportunistically: for example, if we can't access STS for some reason or the region
 * is not configured, the context value will be 'null' and there could failures down the line. In
 * some cases, synthesis does not require region/account information at all, so that might be perfectly
 * fine in certain scenarios.
 *
 * @param context The context key/value bash.
 */
export async function prepareDefaultEnvironment(services: ToolkitServices, props: { outdir?: string } = {}): Promise<Env> {
  const logFn = asLogger(services.ioHost, 'ASSEMBLY').debug;
  const env = await oldPrepare(services.sdkProvider, logFn);

  if (props.outdir) {
    env[cxapi.OUTDIR_ENV] = props.outdir;
    await logFn('outdir:', props.outdir);
  }

  // CLI version information
  env[cxapi.CLI_ASM_VERSION_ENV] = cxschema.Manifest.version();
  env[cxapi.CLI_VERSION_ENV] = versionNumber();

  await logFn('env:', env);
  return env;
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
export async function withContext<T>(
  inputContext: Context,
  env: Env,
  synthOpts: AppSynthOptions = {},
  block: (env: Env, context: Context) => Promise<T>,
) {
  const context = await prepareContext(synthOptsDefaults(synthOpts), inputContext, env);
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

/**
 * Checks if a given assembly supports context overflow, warn otherwise.
 *
 * @param assembly the assembly to check
 */
export async function checkContextOverflowSupport(assembly: cxapi.CloudAssembly, ioHost: ActionAwareIoHost): Promise<void> {
  const logFn = asLogger(ioHost, 'ASSEMBLY').warn;
  const tree = loadTree(assembly);
  const frameworkDoesNotSupportContextOverflow = some(tree, node => {
    const fqn = node.constructInfo?.fqn;
    const version = node.constructInfo?.version;
    return (fqn === 'aws-cdk-lib.App' && version != null && lte(version, '2.38.0')) // v2
    || fqn === '@aws-cdk/core.App'; // v1
  });

  // We're dealing with an old version of the framework here. It is unaware of the temporary
  // file, which means that it will ignore the context overflow.
  if (frameworkDoesNotSupportContextOverflow) {
    await logFn('Part of the context could not be sent to the application. Please update the AWS CDK library to the latest version.');
  }
}

/**
 * Safely create an assembly from a cloud assembly directory
 */
export async function assemblyFromDirectory(assemblyDir: string, ioHost: ActionAwareIoHost) {
  try {
    const assembly = new cxapi.CloudAssembly(assemblyDir, {
      // We sort as we deploy
      topoSort: false,
    });
    await checkContextOverflowSupport(assembly, ioHost);
    return assembly;
  } catch (err: any) {
    if (err.message.includes(cxschema.VERSION_MISMATCH)) {
      // this means the CLI version is too old.
      // we instruct the user to upgrade.
      const message = 'This AWS CDK Toolkit is not compatible with the AWS CDK library used by your application. Please upgrade to the latest version.';
      await ioHost.notify(error(message, 'CDK_ASSEMBLY_E1111', { error: err.message }));
      throw new ToolkitError(`${message}\n(${err.message}`);
    }
    throw err;
  }
}

function synthOptsDefaults(synthOpts: AppSynthOptions = {}): Settings {
  return new Settings({
    debug: false,
    pathMetadata: true,
    versionReporting: true,
    assetMetadata: true,
    assetStaging: true,
    ...synthOpts,
  }, true);
}
