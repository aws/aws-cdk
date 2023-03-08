import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { IPackageSourceSetup, IPackageSource } from './source';
import { copyDirectoryContents } from '../files';
import { shell, rimraf, addToShellPath } from '../shell';

export class ReleasePackageSourceSetup implements IPackageSourceSetup {
  readonly name = 'release';
  readonly description = `release @ ${this.version}`;

  private tempDir?: string;

  constructor(private readonly version: string, private readonly frameworkVersion?: string) {
  }

  public async prepare(): Promise<void> {
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmpcdk'));
    fs.mkdirSync(this.tempDir, { recursive: true });

    await shell(['node', require.resolve('npm'), 'install', `aws-cdk@${this.version}`], {
      cwd: this.tempDir,
    });

    process.env.CDK_CLI_PATH = this.tempDir;
    process.env.VERSION = this.version;
    process.env.FRAMEWORK_VERSION = this.frameworkVersion ?? this.version;
  }

  public async cleanup(): Promise<void> {
    if (this.tempDir) {
      rimraf(this.tempDir);
    }
  }
}

export class ReleasePackageSource implements IPackageSource {
  private readonly cliPath: string;
  private readonly version: string;

  constructor() {
    this.cliPath = process.env.CDK_CLI_PATH!;
    this.version = process.env.VERSION!;
  }

  public async makeCliAvailable() {
    addToShellPath(path.join(this.cliPath, 'node_modules', '.bin'));
  }

  public assertJsiiPackagesAvailable() {
  }

  public async initializeDotnetPackages(currentDir: string) {
    if (process.env.CWD_FILES_DIR) {
      await copyDirectoryContents(process.env.CWD_FILES_DIR, currentDir);
    }
  }

  public majorVersion() {
    return this.version.split('.')[0] as string;
  }

  public requestedFrameworkVersion() {
    return process.env.FRAMEWORK_VERSION!;
  }

  public requestedAlphaVersion(): string {
    const frameworkVersion = this.requestedFrameworkVersion();
    if (frameworkVersion.includes('-rc.')) {
      // For a pipeline release
      return frameworkVersion.replace(/-rc\.\d+$/, '-alpha.999');
    } else {
      // For a stable release
      return `${frameworkVersion}-alpha.0`;
    }
  }
}