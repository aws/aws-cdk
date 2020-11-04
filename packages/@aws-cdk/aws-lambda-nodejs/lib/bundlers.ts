import { spawnSync } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { exec } from './util';

const ESBUILD_VERSION = '0';

interface BundlerProps {
  relativeEntryPath: string;
  minify?: boolean;
  sourceMap?: boolean;
  target?: string;
  environment?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  externals?: string[];
  installer: Installer;
  lockFile?: LockFile;
}

interface LocalBundlerProps extends BundlerProps {
  projectRoot: string;
}

/**
 * Local esbuild bundler
 */
export class LocalBundler implements cdk.ILocalBundling {
  public static get runsLocally(): boolean {
    if (LocalBundler._runsLocally !== undefined) {
      return LocalBundler._runsLocally;
    }
    try {
      const esbuild = spawnSync('npx', ['--no-install', 'esbuild', '--version']);
      const version = esbuild.stdout.toString().trim();
      LocalBundler._runsLocally = new RegExp(`^${ESBUILD_VERSION}`).test(version); // Cache result to avoid unnecessary spawns
      if (!LocalBundler._runsLocally) {
        process.stderr.write(`Incorrect esbuild version detected: ${version} <> ${ESBUILD_VERSION}. Switching to Docker bundling.\n`);
      }
      return LocalBundler._runsLocally;
    } catch (err) {
      return false;
    }
  }

  public static clearRunsLocallyCache(): void { // for tests
    LocalBundler._runsLocally = undefined;
  }

  private static _runsLocally?: boolean;

  constructor(private readonly props: LocalBundlerProps) {}

  public tryBundle(outputDir: string) {
    if (!LocalBundler.runsLocally) {
      return false;
    }

    const localCommand = createBundlingCommand({
      ...this.props,
      outputDir,
      forcePosixPath: os.platform() !== 'win32',
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
  esbuildVersion?: string;
}

/**
 * Docker bundler
 */
export class DockerBundler {
  public readonly bundlingOptions: cdk.BundlingOptions;

  constructor(props: DockerBundlerProps) {
    const image = props.buildImage
      ? props.bundlingDockerImage ?? cdk.BundlingDockerImage.fromAsset(path.join(__dirname, '../lib'), {
        buildArgs: {
          ...props.buildArgs ?? {},
          IMAGE: props.runtime.bundlingDockerImage.image,
          ESBUILD_VERSION: props.esbuildVersion ?? ESBUILD_VERSION,
        },
      })
      : cdk.BundlingDockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const command = createBundlingCommand({
      ...props,
      projectRoot: cdk.AssetStaging.BUNDLING_INPUT_DIR, // project root is mounted at /asset-input
      outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
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
  forcePosixPath?: boolean;
  outputDir: string;
}

/**
 * Generates bundling command
 */
function createBundlingCommand(options: BundlingCommandOptions): string {
  let entryPath = path.join(options.projectRoot, options.relativeEntryPath);

  if (options.forcePosixPath ?? true) {
    entryPath = entryPath.replace(/\\/g, '/');
  }

  const esbuildCommand: string = [
    'npx',
    'esbuild',
    '--bundle', entryPath,
    `--target=${options.target ?? 'es2017'}`,
    '--platform=node',
    `--outfile=${options.outputDir}/index.js`,
    ...options.minify
      ? ['--minify']
      : [],
    ...options.sourceMap
      ? ['--sourcemap']
      : '',
    ...options.externals
      ? options.externals.map(external => `--external:${external}`)
      : [],
  ].join(' ');

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

  return chain([esbuildCommand, depsCommand]);
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
