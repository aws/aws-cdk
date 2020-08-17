import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PackageJsonManager } from './package-json-manager';
import { exec, findUp } from './util';

/**
 * Base options for Parcel bundling
 */
export interface ParcelBaseOptions {
  /**
   * Whether to minify files when bundling.
   *
   * @default false
   */
  readonly minify?: boolean;

  /**
   * Whether to include source maps when bundling.
   *
   * @default false
   */
  readonly sourceMaps?: boolean;

  /**
   * The cache directory (relative to the project root)
   *
   * Parcel uses a filesystem cache for fast rebuilds.
   *
   * @default - `.parcel-cache` in the working directory
   */
  readonly cacheDir?: string;

  /**
   * The root of the project. This will be used as the source for the volume
   * mounted in the Docker container. If you specify this prop, ensure that
   * this path includes `entry` and any module/dependencies used by your
   * function otherwise bundling will not be possible.
   *
   * @default - the closest path containing a .git folder
   */
  readonly projectRoot?: string;

  /**
   * Environment variables defined when Parcel runs.
   *
   * @default - no environment variables are defined.
   */
  readonly parcelEnvironment?: { [key: string]: string; };

  /**
   * A list of modules that should be considered as externals (already available
   * in the runtime).
   *
   * @default ['aws-sdk']
   */
  readonly externalModules?: string[];

  /**
   * A list of modules that should be installed instead of bundled. Modules are
   * installed in a Lambda compatible environnment.
   *
   * @default - all modules are bundled
   */
  readonly nodeModules?: string[];

  /**
   * The version of Parcel to use.
   *
   * @default - 2.0.0-beta.1
   */
  readonly parcelVersion?: string;

  /**
   * Build arguments to pass when building the bundling image.
   *
   * @default - no build arguments are passed
   */
  readonly buildArgs?: { [key:string] : string };

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible. This is useful when installing node modules with
   * native dependencies.
   *
   * @default false
   */
  readonly forceDockerBundling?: boolean;
}

/**
 * Options for Parcel bundling
 */
export interface ParcelOptions extends ParcelBaseOptions {
  /**
   * Entry file
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;
}

/**
 * Bundling
 */
export class Bundling {
  /**
   * Parcel bundled Lambda asset code
   */
  public static parcel(options: ParcelOptions): lambda.AssetCode {
    // Find project root
    const projectRoot = options.projectRoot ?? findUp(`.git${path.sep}`);
    if (!projectRoot) {
      throw new Error('Cannot find project root. Please specify it with `projectRoot`.');
    }
    const relativeEntryPath = path.relative(projectRoot, path.resolve(options.entry));

    const packageJsonManager = new PackageJsonManager(path.dirname(options.entry));

    // Collect external and install modules
    let includeNodeModules: { [key: string]: boolean } | undefined;
    let dependencies: { [key: string]: string } | undefined;
    const externalModules = options.externalModules ?? ['aws-sdk'];
    if (externalModules || options.nodeModules) {
      const modules = [...externalModules, ...options.nodeModules ?? []];
      includeNodeModules = {};
      for (const mod of modules) {
        includeNodeModules[mod] = false;
      }
      if (options.nodeModules) {
        dependencies = packageJsonManager.getVersions(options.nodeModules);
      }
    }

    let installer = Installer.NPM;
    let lockFile: LockFile | undefined;
    if (dependencies) {
      // Use npm unless we have a yarn.lock.
      if (fs.existsSync(path.join(projectRoot, LockFile.YARN))) {
        installer = Installer.YARN;
        lockFile = LockFile.YARN;
      } else if (fs.existsSync(path.join(projectRoot, LockFile.NPM))) {
        lockFile = LockFile.NPM;
      }
    }


    // Configure target in package.json for Parcel
    packageJsonManager.update({
      targets: {
        'cdk-lambda': {
          context: 'node',
          includeNodeModules: includeNodeModules ?? true,
          sourceMap: options.sourceMaps ?? false,
          minify: options.minify ?? false,
          engines: {
            node: `>= ${runtimeVersion(options.runtime)}`,
          },
        },
      },
    });

    // Local
    let localBundler: cdk.ILocalBundling | undefined;
    if (!options.forceDockerBundling) {
      localBundler = new LocalBundler({
        projectRoot,
        relativeEntryPath,
        parcelOptions: options,
        dependencies,
        installer,
        lockFile,
      });
    }

    // Docker
    const dockerBundler = new DockerBundler({
      relativeEntryPath,
      parcelOptions: options,
      dependencies,
      installer,
      lockFile,
    });

    return lambda.Code.fromAsset(projectRoot, {
      assetHashType: cdk.AssetHashType.BUNDLE,
      bundling: {
        local: localBundler,
        ...dockerBundler.bundlingOptions,
      },
    });
  }
}

interface BundlerProps {
  relativeEntryPath: string;
  parcelOptions: ParcelOptions;
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
class LocalBundler implements cdk.ILocalBundling {
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
      outputDir,
      dependencies: this.props.dependencies,
      installer: this.props.installer,
      lockFile: this.props.lockFile,
      parcelOptions: this.props.parcelOptions,
    });

    exec('bash', ['-c', localCommand], {
      env: { ...process.env, ...this.props.parcelOptions.parcelEnvironment ?? {} },
      stdio: [ // show output
        'ignore', // ignore stdio
        process.stderr, // redirect stdout to stderr
        'inherit', // inherit stderr
      ],
    });
    return true;
  }
}

/**
 * Docker bundler
 */
class DockerBundler {
  public readonly bundlingOptions: cdk.BundlingOptions;

  constructor(props: BundlerProps) {
    const image = LocalBundler.runsLocally && !props.parcelOptions.forceDockerBundling // Do not build an entire image if we run locally
      ? cdk.BundlingDockerImage.fromRegistry('dummy')
      : cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../parcel'), {
        buildArgs: {
          ...props.parcelOptions.buildArgs ?? {},
          IMAGE: props.parcelOptions.runtime.bundlingDockerImage.image,
          PARCEL_VERSION: props.parcelOptions.parcelVersion ?? '2.0.0-beta.1',
        },
      });

    const command = createBundlingCommand({
      projectRoot: cdk.AssetStaging.BUNDLING_INPUT_DIR, // project root is mounted at /asset-input
      relativeEntryPath: props.relativeEntryPath,
      outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
      installer: props.installer,
      lockFile: props.lockFile,
      dependencies: props.dependencies,
      parcelOptions: props.parcelOptions,
    });

    this.bundlingOptions = {
      image,
      command: ['bash', '-c', command],
      environment: props.parcelOptions.parcelEnvironment,
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
  const distFile = path.basename(options.parcelOptions.entry).replace(/\.ts$/, '.js');
  const parcelCommand: string = chain([
    [
      '$(node -p "require.resolve(\'parcel\')")', // Parcel is not globally installed, find its "bin"
      'build', entryPath.replace(/\\/g, '/'), // Always use POSIX paths in the container
      '--target', 'cdk-lambda',
      '--dist-dir', options.outputDir, // Output bundle in outputDir (will have the same name as the entry)
      '--no-autoinstall',
      '--no-scope-hoist',
      ...options.parcelOptions.cacheDir
        ? ['--cache-dir', path.join(options.projectRoot, options.parcelOptions.cacheDir)]
        : [],
    ].join(' '),
    // Always rename dist file to index.js because Lambda doesn't support filenames
    // with multiple dots and we can end up with multiple dots when using automatic
    // entry lookup
    distFile !== 'index.js' ? `mv ${options.outputDir}/${distFile} ${options.outputDir}/index.js` : '',
  ]);

  let depsCommand = '';
  if (options.dependencies) {
    // create dummy package.json, move lock file and then install
    depsCommand = chain([
      `echo '${JSON.stringify({ dependencies: options.dependencies })}' > ${options.outputDir}/package.json`,
      options.lockFile ? `cp ${options.projectRoot}/${options.lockFile} ${options.outputDir}/${options.lockFile}` : '',
      `cd ${options.outputDir}`,
      `${options.installer} install`,
    ]);
  }

  return chain([parcelCommand, depsCommand]);
}

enum Installer {
  NPM = 'npm',
  YARN = 'yarn',
}

enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock'
}

function runtimeVersion(runtime: lambda.Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return match[1];
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
