import { spawnSync } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { exec } from './util';

const PARCEL_VERSION = '2.0.0-beta.1';

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
  public static runsLocally(resolvePath: string): boolean {
    if (LocalBundler._runsLocally[resolvePath] !== undefined) {
      return LocalBundler._runsLocally[resolvePath];
    }
    if (os.platform() === 'win32') { // TODO: add Windows support
      return false;
    }
    try {
      const parcel = spawnSync(require.resolve('parcel', { paths: [resolvePath] }), ['--version']);
      const version = parcel.stdout.toString().trim();
      LocalBundler._runsLocally[resolvePath] = new RegExp(`^${PARCEL_VERSION}`).test(version); // Cache result to avoid unnecessary spawns
      if (!LocalBundler._runsLocally[resolvePath]) {
        process.stderr.write(`Incorrect parcel version detected: ${version} <> ${PARCEL_VERSION}. Switching to Docker bundling.\n`);
      }
      return LocalBundler._runsLocally[resolvePath];
    } catch (err) {
      return false;
    }
  }

  public static clearRunsLocallyCache(): void { // for tests
    LocalBundler._runsLocally = {};
  }

  private static _runsLocally: { [key: string]: boolean } = {};

  constructor(private readonly props: LocalBundlerProps) {}

  public tryBundle(outputDir: string) {
    if (!LocalBundler.runsLocally(this.props.projectRoot)) {
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
      bundlingEnvironment: BundlingEnvironment.LOCAL,
    });

    exec('bash', ['-c', localCommand], {
      env: { ...process.env, ...this.props.environment ?? {} },
      stdio: [ // show output
        'ignore', // ignore stdio
        process.stderr, // redirect stdout to stderr
        'inherit', // inherit stderr
      ],
      cwd: path.dirname(path.join(this.props.projectRoot, this.props.relativeEntryPath)),
    });
    return true;
  }
}

interface DockerBundlerProps extends BundlerProps {
  bundlingDockerImage?: cdk.BundlingDockerImage;
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
      ? props.bundlingDockerImage ?? cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../parcel'), {
        buildArgs: {
          ...props.buildArgs ?? {},
          IMAGE: props.runtime.bundlingDockerImage.image,
          PARCEL_VERSION: props.parcelVersion ?? PARCEL_VERSION,
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
      bundlingEnvironment: BundlingEnvironment.DOCKER,
    });

    this.bundlingOptions = {
      image,
      command: ['bash', '-c', command],
      environment: props.environment,
      workingDirectory: path.dirname(path.join(cdk.AssetStaging.BUNDLING_INPUT_DIR, props.relativeEntryPath)).replace(/\\/g, '/'), // Always use POSIX paths in the container,
    };
  }
}

interface BundlingCommandOptions extends LocalBundlerProps {
  outputDir: string;
  bundlingEnvironment: BundlingEnvironment;
}

enum BundlingEnvironment {
  DOCKER = 'docker',
  LOCAL = 'local',
}

/**
 * Generates bundling command
 */
function createBundlingCommand(options: BundlingCommandOptions): string {
  const entryPath = path.join(options.projectRoot, options.relativeEntryPath);
  const distFile = path.basename(options.relativeEntryPath).replace(/\.(jsx|tsx?)$/, '.js');
  const parcelResolvePath = options.bundlingEnvironment === BundlingEnvironment.DOCKER
    ? '/' // Force using parcel installed at / in the image
    : entryPath; // Look up starting from entry path

  const parcelCommand: string = chain([
    [
      `$(node -p "require.resolve(\'parcel\', { paths: ['${parcelResolvePath}'] })")`, // Parcel is not globally installed, find its "bin"
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
