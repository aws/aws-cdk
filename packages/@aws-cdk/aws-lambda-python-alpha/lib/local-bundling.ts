import * as os from 'os';
import { FileSystem, SymlinkFollowMode, UnscopedValidationError } from 'aws-cdk-lib';
import type { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import type * as cdk from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Packaging } from './packaging';
import { DependenciesFile } from './packaging';
import { defaultManyLinuxTags, runtimeToPythonVersion, validateArchitecture } from './platform';
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
  readonly manyLinuxTags?: string[];
  readonly commandHooks?: ICommandHooks;
}

export class LocalBundling implements cdk.ILocalBundling {
  private readonly pipArgs: string[];

  constructor(private readonly props: LocalBundlingProps) {
    validateArchitecture(props.architecture);
    const pythonVersion = runtimeToPythonVersion(props.runtime);
    const abiTag = `cp${pythonVersion.replace('.', '')}`;
    const tags = props.manyLinuxTags ?? defaultManyLinuxTags(props.runtime, props.architecture);
    this.pipArgs = [
      ...tags.flatMap((tag) => ['--platform', tag]),
      '--python-version', pythonVersion,
      '--only-binary=:all:',
      '--implementation', 'cp',
      '--abi', abiTag,
    ];
  }

  public tryBundle(outputDir: string): boolean {
    const { entry, packaging, excludes, commandHooks } = this.props;
    const osPlatform = os.platform();

    if (packaging.exportCommand && osPlatform === 'win32') {
      throw new UnscopedValidationError(
        lit`PythonLocalBundlingWindowsExportUnsupported`,
        'Local bundling on Windows does not support pipenv/poetry/uv projects — their export commands require a POSIX shell. Use Docker bundling, or generate a requirements.txt manually.',
      );
    }

    const python = resolvePython();

    FileSystem.copyDirectory(entry, outputDir, {
      exclude: excludes,
      follow: SymlinkFollowMode.ALWAYS,
    });

    this.runHookCommands(commandHooks?.beforeBundling(entry, outputDir), outputDir, osPlatform);

    if (packaging.exportCommand) {
      this.runShellCommand(packaging.exportCommand, outputDir, osPlatform);
    }

    if (packaging.dependenciesFile !== DependenciesFile.NONE) {
      runCommand(
        python,
        ['-m', 'pip', 'install', '-r', DependenciesFile.PIP, '--target', outputDir, ...this.pipArgs],
        { cwd: outputDir, stdio: 'pipe' },
      );
    }

    this.runHookCommands(commandHooks?.afterBundling(entry, outputDir), outputDir, osPlatform);

    return true;
  }

  private runHookCommands(commands: string[] | undefined, cwd: string, osPlatform: NodeJS.Platform): void {
    if (!commands) {
      return;
    }
    const nonEmpty = commands.filter((c) => c !== '');
    if (nonEmpty.length === 0) {
      return;
    }
    this.runShellCommand(nonEmpty.join(' && '), cwd, osPlatform);
  }

  private runShellCommand(command: string, cwd: string, osPlatform: NodeJS.Platform): void {
    const isWindows = osPlatform === 'win32';
    runCommand(
      isWindows ? 'cmd' : 'bash',
      [isWindows ? '/c' : '-c', command],
      {
        cwd,
        stdio: 'pipe',
        env: process.env,
        windowsVerbatimArguments: isWindows,
      },
    );
  }
}

function resolvePython(): string {
  if (cachedPython) {
    return cachedPython;
  }
  const errors: string[] = [];
  for (const candidate of PYTHON_CANDIDATES) {
    try {
      runCommand(candidate, ['-m', 'pip', '--version'], { stdio: 'pipe' });
      cachedPython = candidate;
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
