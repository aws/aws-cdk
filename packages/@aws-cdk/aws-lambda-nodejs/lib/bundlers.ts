import { spawnSync } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { exec } from './util';

interface BundlerProps {
  relativeEntryPath: string;
  cacheDir?: string;
  environment?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  installer: Installer;
  lockFile?: LockFile;
}

interface LocalBundlerProps extends BundlerProps {
  projectRoot: string;
}

/**
 * Local Parcel bundler
 */
export class LocalBundler implements cdk.ILocalBundling {
  public static get runsLocally(): boolean {
    if (LocalBundler._runsLocally !== undefined) {
      return LocalBundler._runsLocally;
    }
    if (os.platform() === 'win32') { // TODO: add Windows support
      return false;
    }
    try {
      const parcel = spawnSync(require.resolve('parcel'), ['--version']);
      LocalBundler._runsLocally = /^2/.test(parcel.stdout.toString().trim()); // Cache result to avoid unnecessary spawns
      return LocalBundler._runsLocally;
    } catch {
      return false;
    }
  }

  private static _runsLocally?: boolean;

  constructor(private readonly props: LocalBundlerProps) {}

  public tryBundle(outputDir: string) {
    if (!LocalBundler.runsLocally) {
      return false;
    }

    const localCommand = createBundlingCommand({
      projectRoot: this.props.projectRoot,
      relativeEntryPath: this.props.relativeEntryPath,
      cacheDir: this.props.cacheDir,
      outputDir,
      dependencies: this.props.dependencies,
      installer: this.props.installer,
      lockFile: this.props.lockFile,
    });

    exec('bash', ['-c', localCommand], {
      env: { ...process.env, ...this.props.environment ?? {} },
      stdio: [ // show output
        'ignore', // ignore stdio
        process.stderr, // redirect stdout to stderr
        'inherit', // inherit stderr
      ],
    });
    return true;
  }
}

interface DockerBundlerProps extends BundlerProps {
  buildImage?: boolean;
  buildArgs?: { [key: string]: string };
  runtime: Runtime;
  parcelVersion?: string;
}

/**
 * Docker bundler
 */
export class DockerBundler {
  public readonly bundlingOptions: cdk.BundlingOptions;

  constructor(props: DockerBundlerProps) {
    const image = props.buildImage
      ? cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../parcel'), {
        buildArgs: {
          ...props.buildArgs ?? {},
          IMAGE: props.runtime.bundlingDockerImage.image,
          PARCEL_VERSION: props.parcelVersion ?? '2.0.0-beta.1',
        },
      })
      : cdk.BundlingDockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const command = createBundlingCommand({
      projectRoot: cdk.AssetStaging.BUNDLING_INPUT_DIR, // project root is mounted at /asset-input
      relativeEntryPath: props.relativeEntryPath,
      cacheDir: props.cacheDir,
      outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
      installer: props.installer,
      lockFile: props.lockFile,
      dependencies: props.dependencies,
    });

    this.bundlingOptions = {
      image,
      command: ['bash', '-c', command],
      environment: props.environment,
      workingDirectory: path.dirname(path.join(cdk.AssetStaging.BUNDLING_INPUT_DIR, props.relativeEntryPath)),
    };
  }
}

interface BundlingCommandOptions extends LocalBundlerProps {
  outputDir: string;
}

/**
 * Generates bundling command
 */
function createBundlingCommand(options: BundlingCommandOptions): string {
  const entryPath = path.join(options.projectRoot, options.relativeEntryPath);
  const distFile = path.basename(options.relativeEntryPath).replace(/\.ts$/, '.js');
  const parcelCommand: string = chain([
    [
      '$(node -p "require.resolve(\'parcel\')")', // Parcel is not globally installed, find its "bin"
      'build', entryPath.replace(/\\/g, '/'), // Always use POSIX paths in the container
      '--target', 'cdk-lambda',
      '--dist-dir', options.outputDir, // Output bundle in outputDir (will have the same name as the entry)
      '--no-autoinstall',
      '--no-scope-hoist',
      ...options.cacheDir
        ? ['--cache-dir', path.join(options.projectRoot, options.cacheDir)]
        : [],
    ].join(' '),
    // Always rename dist file to index.js because Lambda doesn't support filenames
    // with multiple dots and we can end up with multiple dots when using automatic
    // entry lookup
    distFile !== 'index.js' ? `mv ${options.outputDir}/${distFile} ${options.outputDir}/index.js` : '',
  ]);

  let depsCommand = '';
  if (options.dependencies) {
    // create dummy package.json, copy lock file if any and then install
    depsCommand = chain([
      `echo '${JSON.stringify({ dependencies: options.dependencies })}' > ${options.outputDir}/package.json`,
      options.lockFile ? `cp ${options.projectRoot}/${options.lockFile} ${options.outputDir}/${options.lockFile}` : '',
      `cd ${options.outputDir}`,
      `${options.installer} install`,
    ]);
  }

  return chain([parcelCommand, depsCommand]);
}

export enum Installer {
  NPM = 'npm',
  YARN = 'yarn',
}

export enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock'
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
