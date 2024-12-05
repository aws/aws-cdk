import * as os from 'os';
import * as path from 'path';
import { LogLevel } from './types';

interface PackageManagerProps {
  readonly lockFile: string;
  readonly installCommand: string[];
  readonly runCommand: string[];
  readonly argsSeparator?: string;
}

export enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock',
  BUN = 'bun.lockb',
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
        return new PackageManager({
          lockFile: LockFile.BUN,
          installCommand: logLevel && logLevel !== LogLevel.INFO ? ['bun', 'install', '--frozen-lockfile', '--backend', 'copyfile', '--silent'] : ['bun', 'install', '--frozen-lockfile', '--backend', 'copyfile'],
          runCommand: ['bun', 'run'],
        });
      default:
        return new PackageManager({
          lockFile: LockFile.NPM,
          installCommand: logLevel ? ['npm', 'ci', '--loglevel', logLevel] : ['npm', 'ci'],
          runCommand: ['npx', '--no-install'],
        });
    }
  }

  public readonly lockFile: string;
  public readonly installCommand: string[];
  public readonly runCommand: string[];
  public readonly argsSeparator?: string;

  constructor(props: PackageManagerProps) {
    this.lockFile = props.lockFile;
    this.installCommand = props.installCommand;
    this.runCommand = props.runCommand;
    this.argsSeparator = props.argsSeparator;
  }

  public runBinCommand(bin: string): string {
    const [runCommand, ...runArgs] = this.runCommand;
    return [
      os.platform() === 'win32' ? `${runCommand}.cmd` : runCommand,
      ...runArgs,
      ...(this.argsSeparator ? [this.argsSeparator] : []),
      bin,
    ].join(' ');
  }
}
