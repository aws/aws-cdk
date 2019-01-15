import cxapi = require('@aws-cdk/cx-api');
import childProcess = require('child_process');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import semver = require('semver');
import { debug } from '../../logging';
import { DEFAULTS, PER_USER_DEFAULTS, Settings } from '../../settings';
import { SDK } from '../util/sdk';

/** Invokes the cloud executable and returns JSON output */
export async function execProgram(aws: SDK, config: Settings): Promise<cxapi.SynthesizeResponse> {
  const env: { [key: string]: string } = { };

  const context = config.get(['context']);
  await populateDefaultEnvironmentIfNeeded(aws, context);

  let pathMetadata: boolean = config.get(['pathMetadata']);
  if (pathMetadata === undefined) {
      pathMetadata = true; // defaults to true
  }

  if (pathMetadata) {
    context[cxapi.PATH_METADATA_ENABLE_CONTEXT] = true;
  }

  let assetMetadata: boolean = config.get(['assetMetadata']);
  if (assetMetadata === undefined) {
    assetMetadata = true; // defaults to true
  }

  if (assetMetadata) {
    context[cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT] = true;
  }

  debug('context:', context);

  env[cxapi.CONTEXT_ENV] = JSON.stringify(context);

  const app = config.get(['app']);
  if (!app) {
    throw new Error(`--app is required either in command-line, in ${DEFAULTS} or in ${PER_USER_DEFAULTS}`);
  }

  const commandLine = await guessExecutable(appToArray(app));

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk'));
  debug('outdir:', outdir);
  env[cxapi.OUTDIR_ENV] = outdir;

  try {
    const outfile = await exec();
    debug('outfile:', outfile);
    if (!(await fs.pathExists(outfile))) {
      throw new Error(`Unable to find output file ${outfile}; are you calling app.run()?`);
    }

    const response = await fs.readJson(outfile);
    debug(response);
    return versionCheckResponse(response);
  } finally {
    debug('Removing outdir', outdir);
    await fs.remove(outdir);
  }

  async function exec() {
    return new Promise<string>((ok, fail) => {
      // We use a slightly lower-level interface to:
      //
      // - Pass arguments in an array instead of a string, to get around a
      //   number of quoting issues introduced by the intermediate shell layer
      //   (which would be different between Linux and Windows).
      //
      // - Inherit stderr from controlling terminal. We don't use the captured value
      //   anway, and if the subprocess is printing to it for debugging purposes the
      //   user gets to see it sooner. Plus, capturing doesn't interact nicely with some
      //   processes like Maven.
      const proc = childProcess.spawn(commandLine[0], commandLine.slice(1), {
        stdio: ['ignore', 'inherit', 'inherit'],
        detached: false,
        shell: true,
        env: {
          ...process.env,
          ...env
        }
      });

      proc.on('error', fail);

      proc.on('exit', code => {
        if (code === 0) {
          return ok(path.join(outdir, cxapi.OUTFILE_NAME));
        } else {
          return fail(new Error(`Subprocess exited with error ${code}`));
        }
      });
    });
  }
}

/**
 * Look at the type of response we get and upgrade it to the latest expected version
 */
function versionCheckResponse(response: cxapi.SynthesizeResponse): cxapi.SynthesizeResponse {
  if (!response.version) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`CDK Framework >= ${cxapi.PROTO_RESPONSE_VERSION} is required in order to interact with this version of the Toolkit.`);
  }

  const frameworkVersion = semver.coerce(response.version);
  const toolkitVersion = semver.coerce(cxapi.PROTO_RESPONSE_VERSION);

  // Should not happen, but I don't trust this library 100% either, so let's check for it to be safe
  if (!frameworkVersion || !toolkitVersion) { throw new Error('SemVer library could not parse versions'); }

  if (semver.gt(frameworkVersion, toolkitVersion)) {
    throw new Error(`CDK Toolkit >= ${response.version} is required in order to interact with this program.`);
  }

  if (semver.lt(frameworkVersion, toolkitVersion)) {
    // Toolkit protocol is newer than the framework version, and we KNOW the
    // version. This is a scenario in which we could potentially do some
    // upgrading of the response in the future.
    //
    // For now though, we simply reject old responses.
    throw new Error(`CDK Framework >= ${cxapi.PROTO_RESPONSE_VERSION} is required in order to interact with this version of the Toolkit.`);
  }

  return response;
}

/**
 * If we don't have region/account defined in context, we fall back to the default SDK behavior
 * where region is retreived from ~/.aws/config and account is based on default credentials provider
 * chain and then STS is queried.
 *
 * This is done opportunistically: for example, if we can't acccess STS for some reason or the region
 * is not configured, the context value will be 'null' and there could failures down the line. In
 * some cases, synthesis does not require region/account information at all, so that might be perfectly
 * fine in certain scenarios.
 *
 * @param context The context key/value bash.
 */
async function populateDefaultEnvironmentIfNeeded(aws: SDK, context: any) {
  if (!(cxapi.DEFAULT_REGION_CONTEXT_KEY in context)) {
    context[cxapi.DEFAULT_REGION_CONTEXT_KEY] = await aws.defaultRegion();
    debug(`Setting "${cxapi.DEFAULT_REGION_CONTEXT_KEY}" context to`, context[cxapi.DEFAULT_REGION_CONTEXT_KEY]);
  }

  if (!(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY in context)) {
    context[cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY] = await aws.defaultAccount();
    debug(`Setting "${cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY}" context to`, context[cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY]);
  }
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
 * Direct execution of a YAML file, assume that we're deploying an Applet
 */
function executeApplet(appletFile: string): string[] {
    const appletBinary = path.resolve(require.resolve('@aws-cdk/applet-js'));
    return [process.execPath, appletBinary, appletFile];
}

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
  ['.yml', executeApplet],
  ['.yaml', executeApplet],
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
async function guessExecutable(commandLine: string[]) {
  if (commandLine.length === 1) {
    const fstat = await fs.stat(commandLine[0]);
    // tslint:disable-next-line:no-bitwise
    const isExecutable = (fstat.mode & fs.constants.X_OK) !== 0;
    const isWindows = process.platform === "win32";

    const handler = EXTENSION_MAP.get(path.extname(commandLine[0]));
    if (handler && (!isExecutable || isWindows)) {
      return handler(commandLine[0]);
    }
  }
  return commandLine;
}
