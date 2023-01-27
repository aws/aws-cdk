import * as os from 'os';
import * as path from 'path';
import { Architecture, AssetCode, Code, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PackageInstallation } from './package-installation';
import { LockFile, PackageManager } from './package-manager';
import { BundlingOptions, OutputFormat, SourceMapMode } from './types';
import { exec, extractDependencies, findUp, getTsconfigCompilerOptions } from './util';

const ESBUILD_MAJOR_VERSION = '0';

/**
 * Bundling properties
 */
export interface BundlingProps extends BundlingOptions {
  /**
   * Path to lock file
   */
  readonly depsLockFilePath: string;

  /**
   * Entry file
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: Runtime;

  /**
   * The system architecture of the lambda function
   */
  readonly architecture: Architecture;

  /**
   * Path to project root
   */
  readonly projectRoot: string;

  /**
   * Run compilation using `tsc` before bundling
   */
  readonly preCompilation?: boolean

  /**
   * Which option to use to copy the source files to the docker container and output files back
   * @default - BundlingFileAccess.BIND_MOUNT
   */
  readonly bundlingFileAccess?: cdk.BundlingFileAccess;
}

/**
 * Bundling with esbuild
 */
export class Bundling implements cdk.BundlingOptions {
  /**
   * esbuild bundled Lambda asset code
   */
  public static bundle(options: BundlingProps): AssetCode {
    return Code.fromAsset(options.projectRoot, {
      assetHash: options.assetHash,
      assetHashType: options.assetHash ? cdk.AssetHashType.CUSTOM : cdk.AssetHashType.OUTPUT,
      bundling: new Bundling(options),
    });
  }

  public static clearEsbuildInstallationCache(): void {
    this.esbuildInstallation = undefined;
  }

  public static clearTscInstallationCache(): void {
    this.tscInstallation = undefined;
  }

  private static esbuildInstallation?: PackageInstallation;
  private static tscInstallation?: PackageInstallation;

  // Core bundling options
  public readonly image: cdk.DockerImage;
  public readonly entrypoint?: string[]
  public readonly command: string[];
  public readonly volumes?: cdk.DockerVolume[];
  public readonly volumesFrom?: string[];
  public readonly environment?: { [key: string]: string };
  public readonly workingDirectory: string;
  public readonly user?: string;
  public readonly securityOpt?: string;
  public readonly network?: string;
  public readonly local?: cdk.ILocalBundling;
  public readonly bundlingFileAccess?: cdk.BundlingFileAccess;

  private readonly projectRoot: string;
  private readonly relativeEntryPath: string;
  private readonly relativeTsconfigPath?: string;
  private readonly relativeDepsLockFilePath: string;
  private readonly externals: string[];
  private readonly packageManager: PackageManager;

  constructor(private readonly props: BundlingProps) {
    this.packageManager = PackageManager.fromLockFile(props.depsLockFilePath, props.logLevel);

    Bundling.esbuildInstallation = Bundling.esbuildInstallation ?? PackageInstallation.detect('esbuild');
    Bundling.tscInstallation = Bundling.tscInstallation ?? PackageInstallation.detect('typescript');

    this.projectRoot = props.projectRoot;
    this.relativeEntryPath = path.relative(this.projectRoot, path.resolve(props.entry));
    this.relativeDepsLockFilePath = path.relative(this.projectRoot, path.resolve(props.depsLockFilePath));

    if (this.relativeDepsLockFilePath.includes('..')) {
      throw new Error(`Expected depsLockFilePath: ${props.depsLockFilePath} to be under projectRoot: ${this.projectRoot} (${this.relativeDepsLockFilePath})`);
    }

    if (props.tsconfig) {
      this.relativeTsconfigPath = path.relative(this.projectRoot, path.resolve(props.tsconfig));
    }

    if (props.preCompilation && !/\.tsx?$/.test(props.entry)) {
      throw new Error('preCompilation can only be used with typescript files');
    }

    if (props.format === OutputFormat.ESM
        && (props.runtime === Runtime.NODEJS_10_X || props.runtime === Runtime.NODEJS_12_X)) {
      throw new Error(`ECMAScript module output format is not supported by the ${props.runtime.name} runtime`);
    }

    this.externals = [
      ...props.externalModules ?? (isSdkV2Runtime(props.runtime) ? ['aws-sdk'] : ['@aws-sdk/*']), // Mark aws-sdk as external by default (available in the runtime)
      ...props.nodeModules ?? [], // Mark the modules that we are going to install as externals also
    ];

    // Docker bundling
    const shouldBuildImage = props.forceDockerBundling || !Bundling.esbuildInstallation;
    this.image = shouldBuildImage ? props.dockerImage ?? cdk.DockerImage.fromBuild(path.join(__dirname, '../lib'),
      {
        buildArgs: {
          ...props.buildArgs ?? {},
          IMAGE: props.runtime.bundlingImage.image,
          ESBUILD_VERSION: props.esbuildVersion ?? ESBUILD_MAJOR_VERSION,
        },
        platform: props.architecture.dockerPlatform,
      })
      : cdk.DockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const bundlingCommand = this.createBundlingCommand({
      inputDir: cdk.AssetStaging.BUNDLING_INPUT_DIR,
      outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
      esbuildRunner: 'esbuild', // esbuild is installed globally in the docker image
      tscRunner: 'tsc', // tsc is installed globally in the docker image
      osPlatform: 'linux', // linux docker image
    });
    this.command = props.command ?? ['bash', '-c', bundlingCommand];
    this.environment = props.environment;
    // Bundling sets the working directory to cdk.AssetStaging.BUNDLING_INPUT_DIR
    // and we want to force npx to use the globally installed esbuild.
    this.workingDirectory = props.workingDirectory ?? '/';
    this.entrypoint = props.entrypoint;
    this.volumes = props.volumes;
    this.volumesFrom = props.volumesFrom;
    this.user = props.user;
    this.securityOpt = props.securityOpt;
    this.network = props.network;
    this.bundlingFileAccess = props.bundlingFileAccess;

    // Local bundling
    if (!props.forceDockerBundling) { // only if Docker is not forced
      this.local = this.getLocalBundlingProvider();
    }
  }

  private createBundlingCommand(options: BundlingCommandOptions): string {
    const pathJoin = osPathJoin(options.osPlatform);
    let relativeEntryPath = pathJoin(options.inputDir, this.relativeEntryPath);
    let tscCommand = '';

    if (this.props.preCompilation) {
      const tsconfig = this.props.tsconfig ?? findUp('tsconfig.json', path.dirname(this.props.entry));
      if (!tsconfig) {
        throw new Error('Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`');
      }
      const compilerOptions = getTsconfigCompilerOptions(tsconfig);
      tscCommand = `${options.tscRunner} "${relativeEntryPath}" ${compilerOptions}`;
      relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, '.js$1');
    }

    const loaders = Object.entries(this.props.loader ?? {});
    const defines = Object.entries(this.props.define ?? {});

    if (this.props.sourceMap === false && this.props.sourceMapMode) {
      throw new Error('sourceMapMode cannot be used when sourceMap is false');
    }

    const sourceMapEnabled = this.props.sourceMapMode ?? this.props.sourceMap;
    const sourceMapMode = this.props.sourceMapMode ?? SourceMapMode.DEFAULT;
    const sourceMapValue = sourceMapMode === SourceMapMode.DEFAULT ? '' : `=${this.props.sourceMapMode}`;
    const sourcesContent = this.props.sourcesContent ?? true;

    const outFile = this.props.format === OutputFormat.ESM ? 'index.mjs' : 'index.js';
    const esbuildCommand: string[] = [
      options.esbuildRunner,
      '--bundle', `"${relativeEntryPath}"`,
      `--target=${this.props.target ?? toTarget(this.props.runtime)}`,
      '--platform=node',
      ...this.props.format ? [`--format=${this.props.format}`] : [],
      `--outfile="${pathJoin(options.outputDir, outFile)}"`,
      ...this.props.minify ? ['--minify'] : [],
      ...sourceMapEnabled ? [`--sourcemap${sourceMapValue}`] : [],
      ...sourcesContent ? [] : [`--sources-content=${sourcesContent}`],
      ...this.externals.map(external => `--external:${external}`),
      ...loaders.map(([ext, name]) => `--loader:${ext}=${name}`),
      ...defines.map(([key, value]) => `--define:${key}=${JSON.stringify(value)}`),
      ...this.props.logLevel ? [`--log-level=${this.props.logLevel}`] : [],
      ...this.props.keepNames ? ['--keep-names'] : [],
      ...this.relativeTsconfigPath ? [`--tsconfig=${pathJoin(options.inputDir, this.relativeTsconfigPath)}`] : [],
      ...this.props.metafile ? [`--metafile=${pathJoin(options.outputDir, 'index.meta.json')}`] : [],
      ...this.props.banner ? [`--banner:js=${JSON.stringify(this.props.banner)}`] : [],
      ...this.props.footer ? [`--footer:js=${JSON.stringify(this.props.footer)}`] : [],
      ...this.props.charset ? [`--charset=${this.props.charset}`] : [],
      ...this.props.mainFields ? [`--main-fields=${this.props.mainFields.join(',')}`] : [],
      ...this.props.inject ? this.props.inject.map(i => `--inject:${i}`) : [],
      ...this.props.esbuildArgs ? [toCliArgs(this.props.esbuildArgs)] : [],
    ];

    let depsCommand = '';
    if (this.props.nodeModules) {
      // Find 'package.json' closest to entry folder, we are going to extract the
      // modules versions from it.
      const pkgPath = findUp('package.json', path.dirname(this.props.entry));
      if (!pkgPath) {
        throw new Error('Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.');
      }

      // Determine dependencies versions, lock file and installer
      const dependencies = extractDependencies(pkgPath, this.props.nodeModules);
      const osCommand = new OsCommand(options.osPlatform);

      const lockFilePath = pathJoin(options.inputDir, this.relativeDepsLockFilePath ?? this.packageManager.lockFile);

      const isPnpm = this.packageManager.lockFile === LockFile.PNPM;

      // Create dummy package.json, copy lock file if any and then install
      depsCommand = chain([
        isPnpm ? osCommand.write(pathJoin(options.outputDir, 'pnpm-workspace.yaml'), ''): '', // Ensure node_modules directory is installed locally by creating local 'pnpm-workspace.yaml' file
        osCommand.writeJson(pathJoin(options.outputDir, 'package.json'), { dependencies }),
        osCommand.copy(lockFilePath, pathJoin(options.outputDir, this.packageManager.lockFile)),
        osCommand.changeDirectory(options.outputDir),
        this.packageManager.installCommand.join(' '),
        isPnpm ? osCommand.remove(pathJoin(options.outputDir, 'node_modules', '.modules.yaml')) : '', // Remove '.modules.yaml' file which changes on each deployment
      ]);
    }

    return chain([
      ...this.props.commandHooks?.beforeBundling(options.inputDir, options.outputDir) ?? [],
      tscCommand,
      esbuildCommand.join(' '),
      ...(this.props.nodeModules && this.props.commandHooks?.beforeInstall(options.inputDir, options.outputDir)) ?? [],
      depsCommand,
      ...this.props.commandHooks?.afterBundling(options.inputDir, options.outputDir) ?? [],
    ]);
  }

  private getLocalBundlingProvider(): cdk.ILocalBundling {
    const osPlatform = os.platform();
    const createLocalCommand = (outputDir: string, esbuild: PackageInstallation, tsc?: PackageInstallation) => this.createBundlingCommand({
      inputDir: this.projectRoot,
      outputDir,
      esbuildRunner: esbuild.isLocal ? this.packageManager.runBinCommand('esbuild') : 'esbuild',
      tscRunner: tsc && (tsc.isLocal ? this.packageManager.runBinCommand('tsc') : 'tsc'),
      osPlatform,
    });
    const environment = this.props.environment ?? {};
    const cwd = this.projectRoot;

    return {
      tryBundle(outputDir: string) {
        if (!Bundling.esbuildInstallation) {
          process.stderr.write('esbuild cannot run locally. Switching to Docker bundling.\n');
          return false;
        }

        if (!Bundling.esbuildInstallation.version.startsWith(`${ESBUILD_MAJOR_VERSION}.`)) {
          throw new Error(`Expected esbuild version ${ESBUILD_MAJOR_VERSION}.x but got ${Bundling.esbuildInstallation.version}`);
        }

        const localCommand = createLocalCommand(outputDir, Bundling.esbuildInstallation, Bundling.tscInstallation);

        exec(
          osPlatform === 'win32' ? 'cmd' : 'bash',
          [
            osPlatform === 'win32' ? '/c' : '-c',
            localCommand,
          ],
          {
            env: { ...process.env, ...environment },
            stdio: [ // show output
              'ignore', // ignore stdio
              process.stderr, // redirect stdout to stderr
              'inherit', // inherit stderr
            ],
            cwd,
            windowsVerbatimArguments: osPlatform === 'win32',
          });

        return true;
      },
    };
  }
}

interface BundlingCommandOptions {
  readonly inputDir: string;
  readonly outputDir: string;
  readonly esbuildRunner: string;
  readonly tscRunner?: string;
  readonly osPlatform: NodeJS.Platform;
}

/**
 * OS agnostic command
 */
class OsCommand {
  constructor(private readonly osPlatform: NodeJS.Platform) {}

  public write(filePath: string, data: string): string {
    if (this.osPlatform === 'win32') {
      if (!data) { // if `data` is empty, echo a blank line, otherwise the file will contain a `^` character
        return `echo. > "${filePath}"`;
      }
      return `echo ^${data}^ > "${filePath}"`;
    }

    return `echo '${data}' > "${filePath}"`;
  }

  public writeJson(filePath: string, data: any): string {
    const stringifiedData = JSON.stringify(data);
    return this.write(filePath, stringifiedData);
  }

  public copy(src: string, dest: string): string {
    if (this.osPlatform === 'win32') {
      return `copy "${src}" "${dest}"`;
    }

    return `cp "${src}" "${dest}"`;
  }

  public changeDirectory(dir: string): string {
    return `cd "${dir}"`;
  }

  public remove(filePath: string): string {
    if (this.osPlatform === 'win32') {
      return `del "${filePath}"`;
    }

    return `rm "${filePath}"`;
  }
}

/**
 * Chain commands
 */
function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}

/**
 * Platform specific path join
 */
function osPathJoin(platform: NodeJS.Platform) {
  return function(...paths: string[]): string {
    const joined = path.join(...paths);
    // If we are on win32 but need posix style paths
    if (os.platform() === 'win32' && platform !== 'win32') {
      return joined.replace(/\\/g, '/');
    }
    return joined;
  };
}

/**
 * Converts a runtime to an esbuild node target
 */
function toTarget(runtime: Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return `node${match[1]}`;
}

function toCliArgs(esbuildArgs: { [key: string]: string | boolean }): string {
  const args = [];

  for (const [key, value] of Object.entries(esbuildArgs)) {
    if (value === true || value === '') {
      args.push(key);
    } else if (value) {
      args.push(`${key}="${value}"`);
    }
  }

  return args.join(' ');
}

function isSdkV2Runtime(runtime: Runtime): boolean {
  const sdkV2RuntimeList = [
    Runtime.NODEJS,
    Runtime.NODEJS_4_3,
    Runtime.NODEJS_6_10,
    Runtime.NODEJS_8_10,
    Runtime.NODEJS_10_X,
    Runtime.NODEJS_12_X,
    Runtime.NODEJS_14_X,
    Runtime.NODEJS_16_X,
  ];
  return sdkV2RuntimeList.some((r) => {return r.family === runtime.family && r.name === runtime.name;});
}
