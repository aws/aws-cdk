import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { exec, extractDependencies, findUp } from './util';

const ESBUILD_VERSION = '0';

interface EsBuildBundlerProps {
  projectRoot: string;
  entry: string;
  minify?: boolean;
  sourceMap?: boolean;
  target?: string;
  environment?: { [key: string]: string };
  externals?: string[];
  nodeModules?: string[];
  bundlingDockerImage?: cdk.BundlingDockerImage;
  buildArgs?: { [key: string]: string };
  runtime: Runtime;
  esbuildVersion?: string;
  forceDockerBundling?: boolean;
}

export class EsBuildBundler {
  /**
   * Checks whether the bundler can run locally
   */
  public static get runsLocally(): boolean {
    if (this._runsLocally !== undefined) {
      return this._runsLocally;
    }

    try {
      const esbuild = spawnSync('npx', ['--no-install', 'esbuild', '--version']);
      const version = esbuild.stdout.toString().trim();
      this._runsLocally = new RegExp(`^${ESBUILD_VERSION}`).test(version); // Cache result to avoid unnecessary spawns
      if (!this._runsLocally) {
        process.stderr.write(`Incorrect esbuild version detected: ${version} <> ${ESBUILD_VERSION}. Switching to Docker bundling.\n`);
      }
      return this._runsLocally;
    } catch (err) {
      process.stderr.write('Using Docker bundling.\n');
      return false;
    }
  }

  public static clearRunsLocallyCache(): void { // for tests
    this._runsLocally = undefined;
  }

  /** Cache for local run check */
  private static _runsLocally?: boolean;

  /** Cache for lock file */
  private static lockFile?: LockFile;

  // Core bundling options
  public readonly image: cdk.BundlingDockerImage;
  public readonly command: string[];
  public readonly environment?: { [key: string]: string };
  public readonly local?: cdk.ILocalBundling;

  private relativeEntryPath: string;

  constructor(private readonly props: EsBuildBundlerProps) {
    this.relativeEntryPath = path.relative(props.projectRoot, path.resolve(props.entry));

    const shouldBuildImage = !EsBuildBundler.runsLocally || props.forceDockerBundling;
    this.image = shouldBuildImage
      ? props.bundlingDockerImage ?? cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../lib'), {
        buildArgs: {
          ...props.buildArgs ?? {},
          IMAGE: props.runtime.bundlingDockerImage.image,
          ESBUILD_VERSION: props.esbuildVersion ?? ESBUILD_VERSION,
        },
      })
      : cdk.BundlingDockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const bundlingCommand = this.createBundlingCommand(cdk.AssetStaging.BUNDLING_INPUT_DIR, cdk.AssetStaging.BUNDLING_OUTPUT_DIR);

    this.command = ['bash', '-c', bundlingCommand];
    this.environment = props.environment;

    // Define local bundling if Docker is not forced
    if (!props.forceDockerBundling) {
      const osPlatform = os.platform();
      const createLocalCommand = (outputDir: string) => this.createBundlingCommand(props.projectRoot, outputDir, osPlatform);

      this.local = {
        tryBundle(outputDir: string) {
          if (!EsBuildBundler.runsLocally) {
            return false;
          }

          const localCommand = createLocalCommand(outputDir);

          exec(
            osPlatform === 'win32' ? 'cmd' : 'bash',
            [
              osPlatform === 'win32' ? '/c' : '-c',
              localCommand,
            ],
            {
              env: { ...process.env, ...props.environment ?? {} },
              stdio: [ // show output
                'ignore', // ignore stdio
                process.stderr, // redirect stdout to stderr
                'inherit', // inherit stderr
              ],
              cwd: path.dirname(props.entry),
            });

          return true;
        },
      };
    }
  }

  public createBundlingCommand(inputDir: string, outputDir: string, osPlatform: NodeJS.Platform = 'linux'): string {
    const pathJoin = osPathJoin(osPlatform);

    // Mark the modules that we are going to install as externals also
    const externals = [...this.props.externals ?? [], ...this.props.nodeModules ?? []];

    const esbuildCommand: string = [
      'npx', 'esbuild',
      '--bundle', pathJoin(inputDir, this.relativeEntryPath),
      `--target=${this.props.target ?? toTarget(this.props.runtime)}`,
      '--platform=node',
      `--outfile=${pathJoin(outputDir, 'index.js')}`,
      ...this.props.minify
        ? ['--minify']
        : [],
      ...this.props.sourceMap
        ? ['--sourcemap']
        : '',
      ...externals.map(external => `--external:${external}`),
    ].join(' ');

    let depsCommand = '';
    if (this.props.nodeModules) {
      // Find 'package.json' closest to entry folder, we are going to extract the
      // modules versions from it.
      const pkgPath = findUp('package.json', path.dirname(this.props.entry));
      if (!pkgPath) {
        throw new Error('Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.');
      }

      // Determine installer, lockfile and dependencies versions
      const dependencies = extractDependencies(path.join(pkgPath, 'package.json'), this.props.nodeModules);
      let installer = Installer.NPM;
      let lockFile: LockFile | undefined;

      // Use npm unless we have a yarn.lock
      if (EsBuildBundler.lockFile === LockFile.YARN || fs.existsSync(path.join(this.props.projectRoot, LockFile.YARN))) {
        installer = Installer.YARN;
        lockFile = LockFile.YARN;
      } else if (EsBuildBundler.lockFile === LockFile.NPM || fs.existsSync(path.join(this.props.projectRoot, LockFile.NPM))) {
        lockFile = LockFile.NPM;
      }

      // Cache lock file
      EsBuildBundler.lockFile = lockFile;

      const osCommandLine = new OsCommandLine(osPlatform);

      // Create dummy package.json, copy lock file if any and then install
      depsCommand = chain([
        osCommandLine.write(pathJoin(outputDir, 'package.json'), JSON.stringify({ dependencies })),
        lockFile ? osCommandLine.copy(pathJoin(inputDir, lockFile), pathJoin(outputDir, lockFile)) : '',
        osCommandLine.changeDirectory(outputDir),
        `${installer} install`,
      ]);
    }

    return chain([esbuildCommand, depsCommand]);
  }
}

export enum Installer {
  NPM = 'npm',
  YARN = 'yarn',
}

export enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock'
}

class OsCommandLine {
  constructor(private readonly osPlatform: NodeJS.Platform) {}

  public write(filePath: string, data: string): string {
    if (this.osPlatform === 'win32') {
      return `echo ^${data}^ > ${filePath}`;
    }

    return `echo '${data}' > ${filePath}`;
  }

  public copy(src: string, dest: string): string {
    if (this.osPlatform === 'win32') {
      return `copy ${src} ${dest}`;
    }

    return `cp ${src} ${dest}`;
  }

  public changeDirectory(dir: string): string {
    return `cd ${dir}`;
  }
}

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

function toTarget(runtime: Runtime): string {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    throw new Error('Cannot extract version from runtime.');
  }

  return `node${match[1]}`;
}
