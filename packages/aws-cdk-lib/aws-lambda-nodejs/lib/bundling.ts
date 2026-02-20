import * as os from 'os';
import * as path from 'path';
import type { IConstruct } from 'constructs';
import { PackageInstallation } from './package-installation';
import { LockFile, PackageManager } from './package-manager';
import type { BundlingOptions } from './types';
import { OutputFormat, SourceMapMode } from './types';
import { exec, execDirect, extractDependencies, findUp, getTsconfigCompilerOptions, isSdkV2Runtime, shellEscapeForBundlingCommand } from './util';
import type { Architecture, AssetCode } from '../../aws-lambda';
import { Code, Runtime } from '../../aws-lambda';
import * as cdk from '../../core';
import { ValidationError } from '../../core';
import { LAMBDA_NODEJS_SDK_V3_EXCLUDE_SMITHY_PACKAGES } from '../../cx-api';

const ESBUILD_MAJOR_VERSION = '0';
const ESBUILD_DEFAULT_VERSION = '0.21';

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
  readonly preCompilation?: boolean;

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
  public static bundle(scope: IConstruct, options: BundlingProps): AssetCode {
    return Code.fromAsset(options.projectRoot, {
      assetHash: options.assetHash,
      assetHashType: options.assetHash ? cdk.AssetHashType.CUSTOM : cdk.AssetHashType.OUTPUT,
      bundling: new Bundling(scope, options),
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
  public readonly entrypoint?: string[];
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

  constructor(scope: IConstruct, private readonly props: BundlingProps) {
    this.packageManager = PackageManager.fromLockFile(props.depsLockFilePath, props.logLevel);

    Bundling.esbuildInstallation = Bundling.esbuildInstallation ?? PackageInstallation.detect('esbuild');
    Bundling.tscInstallation = Bundling.tscInstallation ?? PackageInstallation.detect('typescript');

    this.projectRoot = props.projectRoot;
    this.relativeEntryPath = path.relative(this.projectRoot, path.resolve(props.entry));
    this.relativeDepsLockFilePath = path.relative(this.projectRoot, path.resolve(props.depsLockFilePath));

    if (this.relativeDepsLockFilePath.includes('..')) {
      throw new ValidationError(`Expected depsLockFilePath: ${props.depsLockFilePath} to be under projectRoot: ${this.projectRoot} (${this.relativeDepsLockFilePath})`, scope);
    }

    if (props.tsconfig) {
      this.relativeTsconfigPath = path.relative(this.projectRoot, path.resolve(props.tsconfig));
    }

    if (props.preCompilation && !/\.tsx?$/.test(props.entry)) {
      throw new ValidationError('preCompilation can only be used with typescript files', scope);
    }

    if (props.format === OutputFormat.ESM && !isEsmRuntime(props.runtime)) {
      throw new ValidationError(`ECMAScript module output format is not supported by the ${props.runtime.name} runtime`, scope);
    }

    /**
     * For Lambda runtime that uses AWS SDK v3, we need to remove both `aws-sdk/*` modules
     * and `smithy/*` modules to prevent version mismatches. Hide it behind feature flag
     * to make sure no breaking change is introduced.
     *
     * Issue reference: https://github.com/aws/aws-cdk/issues/31610#issuecomment-2389983347
     */
    const sdkV3Externals = cdk.FeatureFlags.of(scope).isEnabled(LAMBDA_NODEJS_SDK_V3_EXCLUDE_SMITHY_PACKAGES) ?
      ['@aws-sdk/*', '@smithy/*'] : ['@aws-sdk/*'];
    // Modules to externalize when using a constant known version of the runtime.
    // Mark aws-sdk as external by default (available in the runtime)
    const isV2Runtime = isSdkV2Runtime(props.runtime);
    const versionedExternals = isV2Runtime ? ['aws-sdk'] : sdkV3Externals;
    // Don't automatically externalize any dependencies when using a `latest` runtime which may
    // update versions in the future.
    // Don't automatically externalize aws sdk if `bundleAwsSDK` is true so it can be
    // include in the bundle asset
    const defaultExternals = props.runtime?.isVariable || props.bundleAwsSDK ? [] : versionedExternals;

    const externals = props.externalModules ?? defaultExternals;

    // warn users if they are using a runtime that does not support sdk v2
    // and the sdk is not explicitly bundled
    if (externals.length && isV2Runtime) {
      cdk.Annotations.of(scope).addWarningV2('aws-cdk-lib/aws-lambda-nodejs:runtimeUpdateSdkV2Breakage', 'Be aware that the NodeJS runtime of Node 16 will be deprecated by Lambda on June 12, 2024. Lambda runtimes Node 18 and higher include SDKv3 and not SDKv2. Updating your Lambda runtime will require bundling the SDK, or updating all SDK calls in your handler code to use SDKv3 (which is not a trivial update). Please account for this added complexity and update as soon as possible.');
    }

    // Warn users if they are trying to rely on global versions of the SDK that aren't available in
    // their environment.
    if (isV2Runtime && externals.some((pkgName) => pkgName.startsWith('@aws-sdk/'))) {
      cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-lambda-nodejs:sdkV3NotInRuntime', 'If you are relying on AWS SDK v3 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 18 or higher.');
    } else if (!isV2Runtime && externals.includes('aws-sdk')) {
      cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-lambda-nodejs:sdkV2NotInRuntime', 'If you are relying on AWS SDK v2 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 16 or lower.');
    }

    // Warn users if they are using a runtime that may change and are excluding any dependencies from
    // bundling.
    if (externals.length && props.runtime?.isVariable) {
      cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-lambda-nodejs:variableRuntimeExternals', 'When using NODEJS_LATEST the runtime version may change as new runtimes are released, this may affect the availability of packages shipped with the environment. Ensure that any external dependencies are available through layers or specify a specific runtime version.');
    }

    this.externals = [
      ...externals,
      ...props.nodeModules ?? [], // Mark the modules that we are going to install as externals also
    ];

    // Docker bundling
    const shouldBuildImage = props.forceDockerBundling || !Bundling.esbuildInstallation;
    this.image = shouldBuildImage ? props.dockerImage ?? cdk.DockerImage.fromBuild(path.join(__dirname, '..', 'lib'),
      {
        buildArgs: {
          ...props.buildArgs ?? {},
          // If runtime isn't passed use regional default, lowest common denominator is node18
          IMAGE: props.runtime.bundlingImage.image,
          ESBUILD_VERSION: props.esbuildVersion ?? ESBUILD_DEFAULT_VERSION,
        },
        platform: props.architecture.dockerPlatform,
        network: props.network,
      })
      : cdk.DockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const bundlingCommand = this.createBundlingCommand(scope, {
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
      this.local = this.getLocalBundlingProvider(scope);
    }
  }

  /**
   * Creates a shell command string for Docker bundling.
   *
   * This method produces a shell command string that Docker executes via `bash -c`.
   * All user-provided values (externalModules, define, loader, inject, esbuildArgs) are
   * shell-escaped using shellEscapeForBundlingCommand() to ensure proper quoting.
   *
   * For local bundling, we use a different approach - see getLocalBundlingProvider().
   */
  private createBundlingCommand(scope: IConstruct, options: BundlingCommandOptions): string {
    const pathJoin = osPathJoin(options.osPlatform);
    let relativeEntryPath = pathJoin(options.inputDir, this.relativeEntryPath);
    let tscCommand = '';

    if (this.props.preCompilation) {
      const tsconfig = this.props.tsconfig ?? findUp('tsconfig.json', path.dirname(this.props.entry));
      if (!tsconfig) {
        throw new ValidationError('Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`', scope);
      }
      const compilerOptions = getTsconfigCompilerOptions(tsconfig);
      tscCommand = `${options.tscRunner} "${relativeEntryPath}" ${compilerOptions}`;
      relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, '.js$1');
    }

    // Build esbuild arguments as a clean array, then shell-escape each for the command string
    const esbuildArgs = this.buildEsbuildArgs(scope, {
      ...options,
      entryPath: relativeEntryPath,
    });

    // Shell-escape each argument for safe interpolation into the bash command string
    // This ensures proper quoting of user-provided bundling options
    const escapedEsbuildCommand = [options.esbuildRunner, ...esbuildArgs]
      .map(arg => shellEscapeForBundlingCommand(arg, options.osPlatform))
      .join(' ');

    let depsCommand = '';
    if (this.props.nodeModules) {
      // Find 'package.json' closest to entry folder, we are going to extract the
      // modules versions from it.
      const pkgPath = findUp('package.json', path.dirname(this.props.entry));
      if (!pkgPath) {
        throw new ValidationError('Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.', scope);
      }

      // Determine dependencies versions, lock file and installer
      const dependencies = extractDependencies(pkgPath, this.props.nodeModules);
      const osCommand = new OsCommand(options.osPlatform);

      const lockFilePath = pathJoin(options.inputDir, this.relativeDepsLockFilePath ?? this.packageManager.lockFile);

      const isPnpm = this.packageManager.lockFile === LockFile.PNPM;
      const isBun = this.packageManager.lockFile === LockFile.BUN_LOCK || this.packageManager.lockFile === LockFile.BUN;

      // Create dummy package.json, copy lock file if any and then install
      depsCommand = chain([
        isPnpm ? osCommand.write(pathJoin(options.outputDir, 'pnpm-workspace.yaml'), ''): '', // Ensure node_modules directory is installed locally by creating local 'pnpm-workspace.yaml' file
        osCommand.writeJson(pathJoin(options.outputDir, 'package.json'), { dependencies }),
        osCommand.copy(lockFilePath, pathJoin(options.outputDir, this.packageManager.lockFile)),
        osCommand.changeDirectory(options.outputDir),
        this.packageManager.installCommand.join(' '),
        isPnpm ? osCommand.remove(pathJoin(options.outputDir, 'node_modules', '.modules.yaml'), true) : '', // Remove '.modules.yaml' file which changes on each deployment
        isBun ? osCommand.removeDir(pathJoin(options.outputDir, 'node_modules', '.cache')) : '', // Remove node_modules/.cache folder since you can't disable its creation
      ]);
    }

    return chain([
      ...this.props.commandHooks?.beforeBundling(options.inputDir, options.outputDir) ?? [],
      tscCommand,
      escapedEsbuildCommand,
      ...(this.props.nodeModules && this.props.commandHooks?.beforeInstall(options.inputDir, options.outputDir)) ?? [],
      depsCommand,
      ...this.props.commandHooks?.afterBundling(options.inputDir, options.outputDir) ?? [],
    ]);
  }

  /**
   * Builds an array of esbuild CLI arguments WITHOUT shell escaping.
   *
   * This method returns raw argument values. The caller is responsible for:
   * - Shell-escaping when building a command string (Docker bundling)
   * - Passing directly to spawnSync without shell (local bundling)
   *
   * This separation allows us to:
   * 1. Reuse the argument construction logic
   * 2. Apply appropriate escaping based on execution context
   *
   * @returns Array of esbuild CLI arguments (e.g., ['--bundle', 'entry.ts', '--external:aws-sdk'])
   */
  private buildEsbuildArgs(scope: IConstruct, options: EsbuildArgsOptions): string[] {
    const pathJoin = osPathJoin(options.osPlatform);

    const loaders = Object.entries(this.props.loader ?? {});
    const defines = Object.entries(this.props.define ?? {});

    if (this.props.sourceMap === false && this.props.sourceMapMode) {
      throw new ValidationError('sourceMapMode cannot be used when sourceMap is false', scope);
    }

    const sourceMapEnabled = this.props.sourceMapMode ?? this.props.sourceMap;
    const sourceMapMode = this.props.sourceMapMode ?? SourceMapMode.DEFAULT;
    const sourceMapValue = sourceMapMode === SourceMapMode.DEFAULT ? '' : `=${this.props.sourceMapMode}`;
    const sourcesContent = this.props.sourcesContent ?? true;

    const outFile = this.props.format === OutputFormat.ESM ? 'index.mjs' : 'index.js';

    // Build the arguments array - NO shell escaping here, just raw values
    // The caller will either shell-escape (Docker) or pass directly to spawnSync (local)
    const args: string[] = [
      '--bundle', options.entryPath,
      `--target=${this.props.target ?? toTarget(scope, this.props.runtime)}`,
      '--platform=node',
      ...this.props.format ? [`--format=${this.props.format}`] : [],
      `--outfile=${pathJoin(options.outputDir, outFile)}`,
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
      ...this.props.mainFields ? [`--main-fields=${this.props.mainFields.join(',')}`] : [],
      ...this.props.inject ? this.props.inject.map(i => `--inject:${i}`) : [],
      ...this.props.esbuildArgs ? toCliArgs(this.props.esbuildArgs) : [],
    ];

    return args;
  }

  /**
   * Creates a local bundling provider that executes esbuild directly via spawnSync
   * with an array of arguments, bypassing shell interpretation.
   *
   * Previous approach:
   *   exec('bash', ['-c', commandString])  // Shell interprets metacharacters
   *
   * Current approach:
   *   execDirect(esbuildBinary, argsArray)  // No shell, args passed directly
   *
   * The key insight is that spawnSync with shell=false passes each array element
   * as a separate argument to the process. Shell metacharacters like &, ;, |, etc.
   * are treated as literal characters, not command separators.
   *
   * We still use shell execution for:
   * - commandHooks (user-defined shell commands - intentionally shell-interpreted)
   * - tsc preCompilation (compiler options from tsconfig)
   * - deps installation (package manager commands)
   *
   * Only esbuild invocation uses direct execution because it receives
   * user-provided bundling options.
   */
  private getLocalBundlingProvider(scope: IConstruct): cdk.ILocalBundling {
    const osPlatform = os.platform();
    const environment = this.props.environment ?? {};
    const cwd = this.projectRoot;

    // Capture 'this' for use in the closure
    const bundlingInstance = this;

    return {
      tryBundle(outputDir: string) {
        if (!Bundling.esbuildInstallation) {
          process.stderr.write('esbuild cannot run locally. Switching to Docker bundling.\n');
          return false;
        }

        if (!Bundling.esbuildInstallation.version.startsWith(`${ESBUILD_MAJOR_VERSION}.`)) {
          throw new ValidationError(`Expected esbuild version ${ESBUILD_MAJOR_VERSION}.x but got ${Bundling.esbuildInstallation.version}`, scope);
        }

        const pathJoin = osPathJoin(osPlatform);
        let relativeEntryPath = pathJoin(bundlingInstance.projectRoot, bundlingInstance.relativeEntryPath);

        // ============================================================
        // PHASE 1: Pre-esbuild commands (hooks, tsc) - run via shell
        // These are either user-defined hooks (intentionally shell) or
        // compiler invocations.
        // ============================================================
        const preCommands: string[] = [
          ...bundlingInstance.props.commandHooks?.beforeBundling(bundlingInstance.projectRoot, outputDir) ?? [],
        ];

        // Handle TypeScript pre-compilation if enabled
        if (bundlingInstance.props.preCompilation) {
          const tsconfig = bundlingInstance.props.tsconfig ?? findUp('tsconfig.json', path.dirname(bundlingInstance.props.entry));
          if (!tsconfig) {
            throw new ValidationError('Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`', scope);
          }
          const compilerOptions = getTsconfigCompilerOptions(tsconfig);
          const tscRunner = Bundling.tscInstallation?.isLocal
            ? bundlingInstance.packageManager.runBinCommand('tsc')
            : 'tsc';
          preCommands.push(`${tscRunner} "${relativeEntryPath}" ${compilerOptions}`);
          relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, '.js$1');
        }

        // Execute pre-commands via shell if any exist
        if (preCommands.length > 0) {
          exec(
            osPlatform === 'win32' ? 'cmd' : 'bash',
            [osPlatform === 'win32' ? '/c' : '-c', chain(preCommands)],
            {
              env: { ...process.env, ...environment },
              stdio: ['ignore', process.stderr, 'inherit'],
              cwd,
              windowsVerbatimArguments: osPlatform === 'win32',
            },
          );
        }

        // ============================================================
        // PHASE 2: esbuild execution - run directly without shell
        // User-provided bundling options are passed as array elements
        // to spawnSync, bypassing shell interpretation entirely.
        // ============================================================
        const esbuildArgs = bundlingInstance.buildEsbuildArgs(scope, {
          inputDir: bundlingInstance.projectRoot,
          outputDir,
          osPlatform,
          entryPath: relativeEntryPath,
        });

        // Get the esbuild command as an array for direct execution
        const esbuildCommandArray = Bundling.esbuildInstallation.isLocal
          ? bundlingInstance.packageManager.runBinCommandAsArray('esbuild')
          : ['esbuild'];

        // Execute esbuild directly - args are passed without shell interpretation
        execDirect(
          esbuildCommandArray[0],
          [...esbuildCommandArray.slice(1), ...esbuildArgs],
          {
            env: { ...process.env, ...environment },
            stdio: ['ignore', process.stderr, 'inherit'],
            cwd,
          },
        );

        // ============================================================
        // PHASE 3: Post-esbuild commands (deps, hooks) - run via shell
        // These are trusted package manager commands and user-defined hooks.
        // ============================================================
        const postCommands: string[] = [];

        // Handle node_modules installation if configured
        if (bundlingInstance.props.nodeModules) {
          const pkgPath = findUp('package.json', path.dirname(bundlingInstance.props.entry));
          if (!pkgPath) {
            throw new ValidationError('Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.', scope);
          }

          const dependencies = extractDependencies(pkgPath, bundlingInstance.props.nodeModules);
          const osCommand = new OsCommand(osPlatform);
          const lockFilePath = pathJoin(
            bundlingInstance.projectRoot,
            bundlingInstance.relativeDepsLockFilePath ?? bundlingInstance.packageManager.lockFile,
          );

          const isPnpm = bundlingInstance.packageManager.lockFile === LockFile.PNPM;
          const isBun = bundlingInstance.packageManager.lockFile === LockFile.BUN_LOCK ||
                        bundlingInstance.packageManager.lockFile === LockFile.BUN;

          // Add beforeInstall hooks if any
          if (bundlingInstance.props.commandHooks?.beforeInstall) {
            postCommands.push(...bundlingInstance.props.commandHooks.beforeInstall(bundlingInstance.projectRoot, outputDir));
          }

          // Add deps installation commands
          postCommands.push(...[
            isPnpm ? osCommand.write(pathJoin(outputDir, 'pnpm-workspace.yaml'), '') : '',
            osCommand.writeJson(pathJoin(outputDir, 'package.json'), { dependencies }),
            osCommand.copy(lockFilePath, pathJoin(outputDir, bundlingInstance.packageManager.lockFile)),
            osCommand.changeDirectory(outputDir),
            bundlingInstance.packageManager.installCommand.join(' '),
            isPnpm ? osCommand.remove(pathJoin(outputDir, 'node_modules', '.modules.yaml'), true) : '',
            isBun ? osCommand.removeDir(pathJoin(outputDir, 'node_modules', '.cache')) : '',
          ].filter(cmd => cmd));
        }

        // Add afterBundling hooks
        if (bundlingInstance.props.commandHooks?.afterBundling) {
          postCommands.push(...bundlingInstance.props.commandHooks.afterBundling(bundlingInstance.projectRoot, outputDir));
        }

        // Execute post-commands via shell if any exist
        if (postCommands.length > 0) {
          exec(
            osPlatform === 'win32' ? 'cmd' : 'bash',
            [osPlatform === 'win32' ? '/c' : '-c', chain(postCommands)],
            {
              env: { ...process.env, ...environment },
              stdio: ['ignore', process.stderr, 'inherit'],
              cwd,
              windowsVerbatimArguments: osPlatform === 'win32',
            },
          );
        }

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
 * Options for building esbuild arguments
 */
interface EsbuildArgsOptions {
  readonly inputDir: string;
  readonly outputDir: string;
  readonly osPlatform: NodeJS.Platform;
  /** The entry file path (may be modified if preCompilation changes .ts to .js) */
  readonly entryPath: string;
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

  public remove(filePath: string, force: boolean = false): string {
    if (this.osPlatform === 'win32') {
      return `del "${filePath}"`;
    }

    const opts = force ? ['-f'] : [];
    return `rm ${opts.join(' ')} "${filePath}"`;
  }

  public removeDir(dir: string): string {
    if (this.osPlatform === 'win32') {
      return `rmdir /s /q "${dir}"`;
    }

    return `rm -rf "${dir}"`;
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
function toTarget(scope: IConstruct, runtime: Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new ValidationError('Cannot extract version from runtime.', scope);
  }

  return `node${match[1]}`;
}

/**
 * Converts esbuildArgs to an array of CLI arguments without shell quoting.
 *
 * The caller is responsible for either:
 * - Shell-escaping when building a command string (Docker bundling)
 * - Passing directly to spawnSync without shell (local bundling)
 *
 * @param esbuildArgs - Object mapping CLI flags to values
 * @returns Array of CLI arguments (e.g., ['--log-limit=0', '--splitting'])
 */
function toCliArgs(esbuildArgs: { [key: string]: string | boolean }): string[] {
  const args: string[] = [];
  const reSpecifiedKeys = ['--alias', '--drop', '--pure', '--log-override', '--out-extension'];

  for (const [key, value] of Object.entries(esbuildArgs)) {
    if (value === true || value === '') {
      // Boolean flag or empty string - just the key
      args.push(key);
    } else if (reSpecifiedKeys.includes(key)) {
      // Keys that can be specified multiple times use colon syntax
      args.push(`${key}:${value}`);
    } else if (value) {
      // Standard key=value format
      args.push(`${key}=${value}`);
    }
  }

  return args;
}

/**
 * Detect if a given Node.js runtime supports ESM (ECMAScript modules)
 */
function isEsmRuntime(runtime: Runtime): boolean {
  const unsupportedRuntimes = [
    Runtime.NODEJS,
    Runtime.NODEJS_4_3,
    Runtime.NODEJS_6_10,
    Runtime.NODEJS_8_10,
    Runtime.NODEJS_10_X,
    Runtime.NODEJS_12_X,
  ];

  return !unsupportedRuntimes.some((r) => {return r.family === runtime.family && r.name === runtime.name;});
}
