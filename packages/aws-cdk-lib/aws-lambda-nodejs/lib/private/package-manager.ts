import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssumptionError } from '../../../core';
import { LogLevel } from '../types';

interface PackageManagerProps {
  readonly lockFile: string;
  readonly installCommand: string[];
  readonly runCommand?: string[];
  readonly directFromSubdirectory?: string;
  readonly argsSeparator?: string;
}

export enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock',
  BUN = 'bun.lockb',
  BUN_LOCK = 'bun.lock',
  PNPM = 'pnpm-lock.yaml',
}

/**
 * A node package manager
 */
export class PackageManager {
  /**
   * Use a lock file path to determine the package manager to use. Optionally, specify a log level to
   * control its verbosity.
   * @param lockFilePath Path of the lock file
   * @param logLevel optional log level @default LogLevel.INFO
   * @returns the right PackageManager for that lock file
   */
  public static fromLockFile(lockFilePath: string, logLevel?: LogLevel): PackageManager {
    const lockFile = path.basename(lockFilePath);

    switch (lockFile) {
      case LockFile.YARN:
        // Either Yarn Classic (1.x) or Yarn Berry (2.x+)
        //
        // It is non-trivial to distinguish between Yarn Classic and Yarn Berry;
        // the easiest way is to check the metadata in the lockfile.
        //
        // - Yarn Classic: `yarn run esbuild` adds 150ms. We can try the direct execution trick though
        //   because binaries are installed to `node_modules/.bin`.
        //
        // - Yarn Berry: packages are installed off to the side; `yarn bin` gives a path to the wrapper script
        //   that won't work without the package resolution handlers being installed so we cannot do direct
        //   execution. `yarn run esbuild` adds ~500ms which is not skippable.
        //
        // In both cases: `esbuild` ships as a dispatch script to the actual runtime binary, and has a `postinstall`
        // script to swap out the dispatch script for the actual binary at install time. Neither version of yarn seems to
        // properly execute that postinstall script, which means the dispatch script adds 100ms on every invocation
        // regardless.
        const lockFileContents = fs.readFileSync(lockFilePath, 'utf-8');
        if (lockFileContents.includes('# yarn lockfile v1')) {
          // Yarn Classic
          return new PackageManager({
            lockFile: LockFile.YARN,
            installCommand: logLevel && logLevel !== LogLevel.INFO ? ['yarn', 'install', '--no-immutable', '--silent'] : ['yarn', 'install', '--no-immutable'],
            // NPM compatible, save a single yarn dispatch (~150ms)
            directFromSubdirectory: 'node_modules/.bin',
          });
        }

        // Yarn Berry
        return new PackageManager({
          lockFile: LockFile.YARN,
          installCommand: logLevel && logLevel !== LogLevel.INFO ? ['yarn', 'install', '--no-immutable', '--silent'] : ['yarn', 'install', '--no-immutable'],
          runCommand: ['yarn', 'run'],
        });
      case LockFile.PNPM:
        return new PackageManager({
          lockFile: LockFile.PNPM,
          installCommand: logLevel && logLevel !== LogLevel.INFO ? ['pnpm', 'install', '--reporter', 'silent', '--config.node-linker=hoisted', '--config.package-import-method=clone-or-copy', '--no-prefer-frozen-lockfile'] : ['pnpm', 'install', '--config.node-linker=hoisted', '--config.package-import-method=clone-or-copy', '--no-prefer-frozen-lockfile'],
          // --config.node-linker=hoisted to create flat node_modules without symlinks
          // --config.package-import-method=clone-or-copy to avoid hardlinking packages from the store
          // --no-prefer-frozen-lockfile (works the same as yarn's --no-immutable) Disable --frozen-lockfile that is enabled by default in CI environments (https://github.com/pnpm/pnpm/issues/1994).
          runCommand: ['pnpm', 'exec'],
          argsSeparator: '--',
        });
      case LockFile.BUN:
      case LockFile.BUN_LOCK:
        return new PackageManager({
          lockFile,
          // Bun's default is to not force `--frozen-lockfile`, so it's not specified here. If they ever add a
          // flag to explicitly disable it, we should add it here. https://github.com/oven-sh/bun/issues/16387
          installCommand: logLevel && logLevel !== LogLevel.INFO ? ['bun', 'install', '--backend', 'copyfile', '--silent'] : ['bun', 'install', '--backend', 'copyfile'],
          runCommand: ['bun', 'run'],
        });
      default:
        return new PackageManager({
          lockFile: LockFile.NPM,
          installCommand: logLevel ? ['npm', 'ci', '--loglevel', logLevel] : ['npm', 'ci'],
          // We could use `npx` but it adds ~400-500ms on every invocation, so do direct execution instead.
          directFromSubdirectory: 'node_modules/.bin',
        });
    }
  }

  public readonly lockFile: string;
  public readonly installCommand: string[];
  public readonly runCommand?: string[];
  public readonly directFromSubdirectory?: string;
  public readonly argsSeparator?: string;

  constructor(props: PackageManagerProps) {
    this.lockFile = props.lockFile;
    this.installCommand = props.installCommand;
    this.runCommand = props.runCommand;
    this.directFromSubdirectory = props.directFromSubdirectory;
    this.argsSeparator = props.argsSeparator;

    if (!!props.runCommand == !!props.directFromSubdirectory) {
      throw new AssumptionError('MutexArguments', 'Exactly one of runCommand and runFromSubdirectory must be supplied');
    }
  }

  public runBinCommand(bin: string): string[] {
    if (this.runCommand) {
      const [runCommand, ...runArgs] = this.runCommand;
      return [
        os.platform() === 'win32' ? `${runCommand}.cmd` : runCommand,
        ...runArgs,
        ...(this.argsSeparator ? [this.argsSeparator] : []),
        bin,
      ];
    } else {
      if (!this.directFromSubdirectory) {
        throw new AssumptionError('AlreadyValidated', 'Should have been validated in the constructor');
      }

      return [`${this.directFromSubdirectory}/${bin}`];
    }
  }
}
