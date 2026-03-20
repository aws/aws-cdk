import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { IConstruct } from 'constructs';
import { PackageInstallation } from './package-installation';
import { LockFile, PackageManager } from './package-manager';
import type { BundlingOptions } from './types';
import { OutputFormat, SourceMapMode } from './types';
import { exec, extractDependencies, findUp, getTsconfigCompilerOptions, getTsconfigCompilerOptionsArray, isSdkV2Runtime } from './util';
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
      throw new ValidationError('ExpectedDepsLockFilePath', `Expected depsLockFilePath: ${props.depsLockFilePath} to be under projectRoot: ${this.projectRoot} (${this.relativeDepsLockFilePath})`, scope);
    }

    if (props.tsconfig) {
      this.relativeTsconfigPath = path.relative(this.projectRoot, path.resolve(props.tsconfig));
    }

    if (props.preCompilation && !/\.tsx?$/.test(props.entry)) {
      throw new ValidationError('PreCompilationTypescriptFiles', 'preCompilation can only be used with typescript files', scope);
    }

    if (props.format === OutputFormat.ESM && !isEsmRuntime(props.runtime)) {
      throw new ValidationError('ScriptModuleOutputFormatSupported', `ECMAScript module output format is not supported by the ${props.runtime.name} runtime`, scope);
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

  private createBundlingCommand(scope: IConstruct, options: BundlingCommandOptions): string {
    const pathJoin = osPathJoin(options.osPlatform);
    let relativeEntryPath = pathJoin(options.inputDir, this.relativeEntryPath);
    let tscCommand = '';

    if (this.props.preCompilation) {
      const tsconfig = this.props.tsconfig ?? findUp('tsconfig.json', path.dirname(this.props.entry));
      if (!tsconfig) {
        throw new ValidationError('CannotFindTsconfigJsonPre', 'Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`', scope);
      }
      const compilerOptions = getTsconfigCompilerOptions(tsconfig);
      tscCommand = `${options.tscRunner} "${relativeEntryPath}" ${compilerOptions}`;
      relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, '.js$1');
    }

    const loaders = Object.entries(this.props.loader ?? {});
    const defines = Object.entries(this.props.define ?? {});

    if (this.props.sourceMap === false && this.props.sourceMapMode) {
      throw new ValidationError('SourceMapModeCannotSource', 'sourceMapMode cannot be used when sourceMap is false', scope);
    }

    const sourceMapEnabled = this.props.sourceMapMode ?? this.props.sourceMap;
    const sourceMapMode = this.props.sourceMapMode ?? SourceMapMode.DEFAULT;
    const sourceMapValue = sourceMapMode === SourceMapMode.DEFAULT ? '' : `=${this.props.sourceMapMode}`;
    const sourcesContent = this.props.sourcesContent ?? true;

    const outFile = this.props.format === OutputFormat.ESM ? 'index.mjs' : 'index.js';
    const esbuildCommand: string[] = [
      options.esbuildRunner,
      '--bundle', `"${relativeEntryPath}"`,
      `--target=${this.props.target ?? toTarget(scope, this.props.runtime)}`,
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
      ...this.relativeTsconfigPath ? [`--tsconfig="${pathJoin(options.inputDir, this.relativeTsconfigPath)}"`] : [],
      ...this.props.metafile ? [`--metafile="${pathJoin(options.outputDir, 'index.meta.json')}"`] : [],
      ...this.props.banner ? [`--banner:js=${JSON.stringify(this.props.banner)}`] : [],
      ...this.props.footer ? [`--footer:js=${JSON.stringify(this.props.footer)}`] : [],
      ...this.props.mainFields ? [`--main-fields=${this.props.mainFields.join(',')}`] : [],
      ...this.props.inject ? this.props.inject.map(i => `--inject:"${i}"`) : [],
      ...this.props.esbuildArgs ? [toCliArgs(this.props.esbuildArgs)] : [],
    ];

    let depsCommand = '';
    if (this.props.nodeModules) {
      // Find 'package.json' closest to entry folder, we are going to extract the
      // modules versions from it.
      const pkgPath = findUp('package.json', path.dirname(this.props.entry));
      if (!pkgPath) {
        throw new ValidationError('CannotFindPackageJsonProject', 'Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.', scope);
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
      esbuildCommand.join(' '),
      ...(this.props.nodeModules && this.props.commandHooks?.beforeInstall(options.inputDir, options.outputDir)) ?? [],
      depsCommand,
      ...this.props.commandHooks?.afterBundling(options.inputDir, options.outputDir) ?? [],
    ]);
  }

  private getLocalBundlingProvider(scope: IConstruct): cdk.ILocalBundling {
    const osPlatform = os.platform();
    const environment = this.props.environment ?? {};
    const cwd = this.projectRoot;
    const createSteps = (outputDir: string, esbuild: PackageInstallation, tsc?: PackageInstallation) =>
      this.createLocalBundlingSteps(scope, outputDir, esbuild, tsc);

    return {
      tryBundle(outputDir: string) {
        if (!Bundling.esbuildInstallation) {
          process.stderr.write('esbuild cannot run locally. Switching to Docker bundling.\n');
          return false;
        }

        if (!Bundling.esbuildInstallation.version.startsWith(`${ESBUILD_MAJOR_VERSION}.`)) {
          throw new ValidationError('ExpectedEsbuildVersion', `Expected esbuild version ${ESBUILD_MAJOR_VERSION}.x but got ${Bundling.esbuildInstallation.version}`, scope);
        }

        const execOptions = {
          env: { ...process.env, ...environment },
          stdio: [
            'ignore', // ignore stdio
            process.stderr, // redirect stdout to stderr
            'inherit', // inherit stderr
          ] as ['ignore', NodeJS.WriteStream, 'inherit'],
          cwd,
        };

        const steps = createSteps(outputDir, Bundling.esbuildInstallation, Bundling.tscInstallation);
        for (const step of steps) {
          switch (step.type) {
            case 'shell':
              for (const cmd of step.commands) {
                exec(
                  osPlatform === 'win32' ? (process.env.COMSPEC ?? 'cmd') : 'bash',
                  [osPlatform === 'win32' ? '/c' : '-c', cmd],
                  { ...execOptions, windowsVerbatimArguments: osPlatform === 'win32' },
                );
              }
              break;
            case 'spawn':
              exec(step.command[0], step.command.slice(1), {
                ...execOptions,
                cwd: step.cwd ?? cwd,
              });
              break;
            case 'callback':
              step.operation();
              break;
          }
        }

        return true;
      },
    };
  }

  /**
   * Creates structured bundling steps for local execution via direct spawn (no shell).
   */
  private createLocalBundlingSteps(
    scope: IConstruct,
    outputDir: string,
    esbuild: PackageInstallation,
    tsc?: PackageInstallation,
  ): BundlingStep[] {
    const steps: BundlingStep[] = [];

    let relativeEntryPath = path.join(this.projectRoot, this.relativeEntryPath);

    // Before bundling hooks
    const beforeBundling = this.props.commandHooks?.beforeBundling(this.projectRoot, outputDir) ?? [];
    if (beforeBundling.length) {
      steps.push({ type: 'shell', commands: beforeBundling });
    }

    // Pre-compilation with tsc
    if (this.props.preCompilation) {
      const tsconfig = this.props.tsconfig ?? findUp('tsconfig.json', path.dirname(this.props.entry));
      if (!tsconfig) {
        throw new ValidationError('CannotFindTsconfigJsonPre', 'Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`', scope);
      }
      const compilerOptionsArray = getTsconfigCompilerOptionsArray(tsconfig);
      const tscRunner = tsc && (tsc.isLocal ? this.packageManager.runBinCommand('tsc') : ['tsc']);
      if (tscRunner) {
        steps.push({ type: 'spawn', command: [...tscRunner, relativeEntryPath, ...compilerOptionsArray] });
      }
      relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, '.js$1');
    }

    // Esbuild
    const esbuildRunner = esbuild.isLocal ? this.packageManager.runBinCommand('esbuild') : ['esbuild'];

    if (this.props.sourceMap === false && this.props.sourceMapMode) {
      throw new ValidationError('SourceMapModeCannotSource', 'sourceMapMode cannot be used when sourceMap is false', scope);
    }

    const sourceMapEnabled = this.props.sourceMapMode ?? this.props.sourceMap;
    const sourceMapMode = this.props.sourceMapMode ?? SourceMapMode.DEFAULT;
    const sourceMapValue = sourceMapMode === SourceMapMode.DEFAULT ? '' : `=${this.props.sourceMapMode}`;
    const sourcesContent = this.props.sourcesContent ?? true;

    const outFile = this.props.format === OutputFormat.ESM ? 'index.mjs' : 'index.js';
    const loaders = Object.entries(this.props.loader ?? {});
    const defines = Object.entries(this.props.define ?? {});

    const esbuildArgs: string[] = [
      '--bundle', relativeEntryPath,
      `--target=${this.props.target ?? toTarget(scope, this.props.runtime)}`,
      '--platform=node',
      ...this.props.format ? [`--format=${this.props.format}`] : [],
      `--outfile=${path.join(outputDir, outFile)}`,
      ...this.props.minify ? ['--minify'] : [],
      ...sourceMapEnabled ? [`--sourcemap${sourceMapValue}`] : [],
      ...sourcesContent ? [] : [`--sources-content=${sourcesContent}`],
      ...this.externals.map(external => `--external:${external}`),
      ...loaders.map(([ext, name]) => `--loader:${ext}=${name}`),
      ...defines.map(([key, value]) => `--define:${key}=${value}`),
      ...this.props.logLevel ? [`--log-level=${this.props.logLevel}`] : [],
      ...this.props.keepNames ? ['--keep-names'] : [],
      ...this.relativeTsconfigPath ? [`--tsconfig=${path.join(this.projectRoot, this.relativeTsconfigPath)}`] : [],
      ...this.props.metafile ? [`--metafile=${path.join(outputDir, 'index.meta.json')}`] : [],
      ...this.props.banner ? [`--banner:js=${this.props.banner}`] : [],
      ...this.props.footer ? [`--footer:js=${this.props.footer}`] : [],
      ...this.props.mainFields ? [`--main-fields=${this.props.mainFields.join(',')}`] : [],
      ...this.props.inject ? this.props.inject.map(i => `--inject:${i}`) : [],
      ...this.props.esbuildArgs ? toCliArgsArray(this.props.esbuildArgs) : [],
    ];

    steps.push({ type: 'spawn', command: [...esbuildRunner, ...esbuildArgs] });

    // Node modules installation
    if (this.props.nodeModules) {
      const pkgPath = findUp('package.json', path.dirname(this.props.entry));
      if (!pkgPath) {
        throw new ValidationError('CannotFindPackageJsonProject', 'Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.', scope);
      }

      // Before install hooks
      const beforeInstall = this.props.commandHooks?.beforeInstall(this.projectRoot, outputDir) ?? [];
      if (beforeInstall.length) {
        steps.push({ type: 'shell', commands: beforeInstall });
      }

      const dependencies = extractDependencies(pkgPath, this.props.nodeModules);
      const lockFilePath = path.join(this.projectRoot, this.relativeDepsLockFilePath ?? this.packageManager.lockFile);
      const isPnpm = this.packageManager.lockFile === LockFile.PNPM;
      const isBun = this.packageManager.lockFile === LockFile.BUN_LOCK || this.packageManager.lockFile === LockFile.BUN;

      steps.push({
        type: 'callback',
        operation: () => {
          if (isPnpm) {
            fs.writeFileSync(path.join(outputDir, 'pnpm-workspace.yaml'), '');
          }
          fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify({ dependencies }));
          fs.copyFileSync(lockFilePath, path.join(outputDir, this.packageManager.lockFile));
        },
      });

      steps.push({ type: 'spawn', command: [...this.packageManager.installCommand], cwd: outputDir });

      if (isPnpm || isBun) {
        steps.push({
          type: 'callback',
          operation: () => {
            if (isPnpm) {
              const modulesYaml = path.join(outputDir, 'node_modules', '.modules.yaml');
              if (fs.existsSync(modulesYaml)) {
                fs.rmSync(modulesYaml, { force: true });
              }
            }
            if (isBun) {
              const cacheDir = path.join(outputDir, 'node_modules', '.cache');
              if (fs.existsSync(cacheDir)) {
                fs.rmSync(cacheDir, { recursive: true, force: true });
              }
            }
          },
        });
      }
    }

    // After bundling hooks
    const afterBundling = this.props.commandHooks?.afterBundling(this.projectRoot, outputDir) ?? [];
    if (afterBundling.length) {
      steps.push({ type: 'shell', commands: afterBundling });
    }

    return steps;
  }
}

/**
 * A single step in the local bundling process.
 */
type BundlingStep =
  | { type: 'shell'; commands: string[] }
  | { type: 'spawn'; command: string[]; cwd?: string }
  | { type: 'callback'; operation: () => void };

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
    throw new ValidationError('CannotExtractVersionRuntime', 'Cannot extract version from runtime.', scope);
  }

  return `node${match[1]}`;
}

function toCliArgs(esbuildArgs: { [key: string]: string | boolean }): string {
  const args = new Array<string>();
  const reSpecifiedKeys = ['--alias', '--drop', '--pure', '--log-override', '--out-extension'];

  for (const [key, value] of Object.entries(esbuildArgs)) {
    if (value === true || value === '') {
      args.push(key);
    } else if (reSpecifiedKeys.includes(key)) {
      args.push(`${key}:"${value}"`);
    } else if (value) {
      args.push(`${key}="${value}"`);
    }
  }

  return args.join(' ');
}

/**
 * Converts esbuild args to an array of CLI arguments for direct spawn (no shell quoting).
 */
function toCliArgsArray(esbuildArgs: { [key: string]: string | boolean }): string[] {
  const args: string[] = [];
  const reSpecifiedKeys = ['--alias', '--drop', '--pure', '--log-override', '--out-extension'];

  for (const [key, value] of Object.entries(esbuildArgs)) {
    if (value === true || value === '') {
      args.push(key);
    } else if (reSpecifiedKeys.includes(key)) {
      args.push(`${key}:${value}`);
    } else if (value) {
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
