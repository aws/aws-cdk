import * as os from 'os';
import * as path from 'path';

interface PackageManagerProps {
  readonly lockFile: string;
  readonly installCommand: string[];
  readonly runCommand: string[];
}

/**
 * A node package manager
 */
export class PackageManager {
  public static NPM = new PackageManager({
    lockFile: 'package-lock.json',
    installCommand: ['npm', 'install'],
    runCommand: ['npx', '--no-install'],
  });

  public static YARN = new PackageManager({
    lockFile: 'yarn.lock',
    installCommand: ['yarn', 'install'],
    runCommand: ['yarn', 'run'],
  });

  public static fromLockFile(lockFilePath: string): PackageManager {
    const lockFile = path.basename(lockFilePath);

    switch (lockFile) {
      case PackageManager.NPM.lockFile:
        return PackageManager.NPM;
      case PackageManager.YARN.lockFile:
        return PackageManager.YARN;
      default:
        return PackageManager.NPM;
    }
  }

  public readonly lockFile: string;
  public readonly installCommand: string[];
  public readonly runCommand: string[];

  constructor(props: PackageManagerProps) {
    this.lockFile = props.lockFile;
    this.installCommand = props.installCommand;
    this.runCommand = props.runCommand;
  }

  public runBinCommand(bin: string): string {
    const [runCommand, ...runArgs] = this.runCommand;
    return [
      os.platform() === 'win32' ? `${runCommand}.cmd` : runCommand,
      ...runArgs,
      bin,
    ].join(' ');
  }
}
