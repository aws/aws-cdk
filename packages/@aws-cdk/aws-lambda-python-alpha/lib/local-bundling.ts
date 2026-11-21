import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem, SymlinkFollowMode, UnscopedValidationError } from 'aws-cdk-lib';
import type { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import type * as cdk from 'aws-cdk-lib/core';
import { lit, profileSpan } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Packaging } from './packaging';
import { DependenciesFile } from './packaging';
import { defaultPlatformTags, runtimeToPythonVersion } from './platform';
import type { ICommandHooks } from './types';
import { runCommand } from './util';

const PYTHON_CANDIDATES = ['python3', 'python'] as const;

let cachedPython: string | undefined;

export interface LocalBundlingProps {
  readonly entry: string;
  readonly runtime: Runtime;
  readonly architecture: Architecture;
  readonly packaging: Packaging;
  readonly excludes: string[];
  readonly outputPathSuffix?: string;
  readonly platformTags?: string[];
  readonly commandHooks?: ICommandHooks;
  readonly environment?: { [key: string]: string };
}

export class LocalBundling implements cdk.ILocalBundling {
  private readonly pipArgs: string[];

  constructor(private readonly props: LocalBundlingProps) {
    const pythonVersion = runtimeToPythonVersion(props.runtime);
    const abiTag = `cp${pythonVersion.replace('.', '')}`;
    const tags = props.platformTags ?? defaultPlatformTags(props.runtime, props.architecture);
    this.pipArgs = [
      ...tags.flatMap((tag) => ['--platform', tag]),
      '--python-version', pythonVersion,
      '--only-binary=:all:',
      '--implementation', 'cp',
      '--abi', abiTag,
    ];
  }

  public toJSON() {
    // AssetStaging hashes the serialized bundler. Leave out the absolute entry
    // path and keep options that can change the staged files.
    const { packaging, excludes, outputPathSuffix } = this.props;
    return { packaging, excludes, outputPathSuffix, pipArgs: this.pipArgs };
  }

  public tryBundle(outputDir: string): boolean {
    using _span = profileSpan('PythonFunction#tryBundle', { telemetry: true });
    const { entry, packaging, excludes, commandHooks } = this.props;
    const osPlatform = os.platform();
    const targetDir = path.resolve(outputDir, this.props.outputPathSuffix ?? '');
    const relative = path.relative(outputDir, targetDir);
    if (path.isAbsolute(relative) || relative === '..' || relative.startsWith('..' + path.sep)) {
      throw new UnscopedValidationError(
        lit`OutputPathSuffixEscapesOutputDir`,
        'outputPathSuffix should not escape the local bundling output directory.',
      );
    }

    if (packaging.exportCommand && osPlatform === 'win32') {
      throw new UnscopedValidationError(
        lit`PythonLocalBundlingWindowsExportUnsupported`,
        'Local bundling on Windows does not support pipenv/poetry/uv projects — their export commands require a POSIX shell. Use Docker bundling, or generate a requirements.txt manually.',
      );
    }

    const env = this.props.environment && { ...process.env, ...this.props.environment };
    const python = resolvePython(env);

    fs.mkdirSync(targetDir, { recursive: true });
    FileSystem.copyDirectory(entry, targetDir, {
      exclude: excludes,
      follow: SymlinkFollowMode.ALWAYS,
    });

    this.runHookCommands(commandHooks?.beforeBundling(entry, targetDir), targetDir, osPlatform, env);

    if (packaging.exportCommand) {
      this.runShellCommand(packaging.exportCommand, targetDir, osPlatform, env);
    }

    if (packaging.dependenciesFile !== DependenciesFile.NONE) {
      runCommand(
        python,
        ['-m', 'pip', 'install', '-r', DependenciesFile.PIP, '--target', targetDir, ...this.pipArgs],
        { cwd: targetDir, stdio: 'pipe', env },
      );
    }

    this.runHookCommands(commandHooks?.afterBundling(entry, targetDir), targetDir, osPlatform, env);

    return true;
  }

  private runHookCommands(
    commands: string[] | undefined,
    cwd: string,
    osPlatform: NodeJS.Platform,
    env: NodeJS.ProcessEnv | undefined,
  ): void {
    if (!commands) {
      return;
    }
    const nonEmpty = commands.filter((c) => c !== '');
    if (nonEmpty.length === 0) {
      return;
    }
    this.runShellCommand(nonEmpty.join(' && '), cwd, osPlatform, env);
  }

  private runShellCommand(command: string, cwd: string, osPlatform: NodeJS.Platform, env: NodeJS.ProcessEnv | undefined): void {
    const isWindows = osPlatform === 'win32';
    runCommand(
      isWindows ? 'cmd' : 'bash',
      [isWindows ? '/c' : '-c', command],
      {
        cwd,
        stdio: 'pipe',
        env,
        windowsVerbatimArguments: isWindows,
      },
    );
  }
}

function resolvePython(env: NodeJS.ProcessEnv | undefined): string {
  if (env === undefined && cachedPython) {
    return cachedPython;
  }
  const errors: string[] = [];
  for (const candidate of PYTHON_CANDIDATES) {
    try {
      runCommand(candidate, ['-m', 'pip', '--version'], { stdio: 'pipe', env });
      if (env === undefined) {
        cachedPython = candidate;
      }
      return candidate;
    } catch (err) {
      errors.push(`${candidate}: ${(err as Error).message}`);
    }
  }
  throw new UnscopedValidationError(
    lit`PythonLocalBundlingPythonMissing`,
    `Local bundling requires 'python3' or 'python' (with pip) on PATH. Tried both:\n${errors.join('\n')}`,
  );
}

/** @internal */
export function _resetPythonCache(): void {
  cachedPython = undefined;
}
