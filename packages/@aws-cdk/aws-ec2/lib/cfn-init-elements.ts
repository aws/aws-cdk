import { Construct } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { isTagPropertyJson } from '@aws-cdk/cfnspec/lib/schema';

export enum InitRenderPlatform { WINDOWS, LINUX };
export enum InitElementType { PACKAGE, GROUP, USER, SOURCE, FILE, COMMAND, SERVICE };

export interface InitRenderOptions {
  /**
   * Which OS platform (Linux, Windows) are we rendering for. Impacts
   * which config types are available and how they are rendered.
   */
  platform: InitRenderPlatform;
  /**
   * Ordered index of current element type. Primarily used to auto-generate
   * command keys and retain ordering.
   */
  index: number;
}

/**
 * Base class for all CloudFormation Init elements
 */
export abstract class InitElement {

  /**
   * Returns the init element type for this element.
   */
  public abstract getElementType(): InitElementType;

  /**
   * Render the CloudFormation representation of this init element.
   *
   * @param options
   */
  public abstract renderElement(options: InitRenderOptions): any;

  /**
   *
   * @param scope
   */
  public abstract bind(scope: Construct): void;
}

/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
  /**
   * Identifier key for this command
   *
   * You can use this to order commands, or to reference this command in a service
   * definition to restart a service after this command runs.
   *
   * @default - Automatically generated
   */
  readonly key?: string;

  /**
   * Sets environment variables for the command.
   *
   * This property overwrites, rather than appends, the existing environment.
   *
   * @default - Use current environment
   */
  readonly env?: Record<string, string>;

  /**
   * The working directory
   *
   * @default - Use default working directory
   */
  readonly cwd?: string;

  /**
   * Command to determine whether this command should be run
   *
   * If the test passes (exits with error code or %ERRORLEVEL% of 0), the command is run.
   *
   * @default - Always run this command
   */
  readonly test?: string;

  /**
   * Continue running if this command fails
   *
   * @default false
   */
  readonly ignoreErrors?: boolean;

  /**
   * Specifies how long to wait (in seconds) after a command has finished in case the command causes a reboot.
   *
   * A value of "forever" directs cfn-init to exit and resume only after the
   * reboot is complete. Set this value to 0 if you do not want to wait for
   * every command.
   *
   * For Windows systems only.
   *
   * @default "60"
   */
  readonly waitAfterCompletion?: string;
}

/**
 * Command to execute on the instance
 */
export class InitCommand extends InitElement {
  /**
   * Run a shell command
   *
   * You must escape the string appropriately.
   */
  public static shellCommand(shellCommand: string, options: InitCommandOptions = {}): InitCommand {
    return new InitCommand(shellCommand, options);
  }

  /**
   * Run a command from an argv array
   *
   * You do not need to escape space characters or enclose command parameters in quotes.
   */
  public static argvCommand(argv: string[], options: InitCommandOptions = {}): InitCommand {
    return new InitCommand(JSON.stringify(argv), options);
  }

  protected constructor(private readonly command: string, private readonly options: InitCommandOptions) {
    super();
  }

  public getElementType(): InitElementType {
    return InitElementType.COMMAND;
  }

  public renderElement(renderOptions: InitRenderOptions): any {
    const commandKey = this.options.key || (renderOptions.index + '').padStart(3, '0'); // 001, 005, etc.

    if (renderOptions.platform === InitRenderPlatform.LINUX && this.options.waitAfterCompletion !== undefined) {
      throw new Error('waitAfterCompletion is only valid for Linux systems.');
    }

    // TODO: Is there a more idiomatic way to do this?
    const renderedCommand = {} as Record<string, any>;
    renderedCommand[commandKey] = {
      command: this.command,
      env: this.options.env,
      cwd: this.options.cwd,
      test: this.options.test,
      ignoreErrors: this.options.ignoreErrors,
      waitAfterCompletion: this.options.waitAfterCompletion,
    };

    return renderedCommand;
  }

  /**
   * No-op for Commands
   */
  public bind(_scope: Construct): void {}

}

/**
 *
 * The content can be either inline in the template or the content can be
 * pulled from a URL.
 */
export class InitFileOptions {
  /**
   * The name of the owning group for this file.
   *
   * Not supported for Windows systems.
   *
   * @default 'root'
   */
  readonly group?: string;

  /**
   * The name of the owning user for this file.
   *
   * Not supported for Windows systems.
   *
   * @default 'root'
   */
  readonly owner?: string;

  /**
   * A six-digit octal value representing the mode for this file.
   *
   * Use the first three digits for symlinks and the last three digits for
   * setting permissions. To create a symlink, specify 120xxx, where xxx
   * defines the permissions of the target file. To specify permissions for a
   * file, use the last three digits, such as 000644.
   *
   * Not supported for Windows systems.
   *
   * @default '000644'
   */
  readonly mode?: string;
}

/**
 * Create files on the EC2 instance.
 */
export class InitFile extends InitElement {
  /**
   * Use a literal string as the file content
   */
  public static fromString(fileName: string, s: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Write a symlink with the given symlink target
   */
  public static symlink(fileName: string, target: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Use a base64 string as the file content
   */
  public static fromBase64String(fileName: string, base64: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Use a JSON object as the file content, write it to a JSON file.
   *
   * May contain tokens.
   */
  public static fromJsonObject(fileName: string, obj: Record<string, any>, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Read a file from disk and use its contents
   *
   * The file will be embedded in the template, so care should be taken to not
   * exceed the template size.
   *
   * The file will be base64-encoded if it contains nonprintable characters.
   */
  public static fromFileInline(targetFileName: string, sourceFileName: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Create an asset from the given file and use that
   *
   * This is appropriate for files that are too large to embed into the template.
   */
  public static fromFileAsset(targetFileName: string, sourceFileName: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Download from a URL at instance startup time
   */
  public static fromUrl(targetFileName: string, url: string, options: InitFileOptions = {}): InitFile {
  }

  /**
   * Use a file from an asset at instance startup time
   */
  public static fromAsset(targetFileName: string, asset: s3_assets.Asset, options: InitFileOptions = {}): InitFile {
  }

  protected constructor() {
    super();
  }
}

/**
 * Create Linux/UNIX groups and to assign group IDs.
 *
 * Not supported for Windows systems.
 */
export class InitGroup extends InitElement {

  /**
   * Map a group name to a group id
   */
  public static fromName(groupName: string, groupId?: number): InitGroup {
    return new InitGroup(groupName, groupId);
  }

  protected constructor(private groupName: string, private groupId?: number) {
    super();
  }

  public getElementType(): InitElementType { return InitElementType.GROUP; }

  public renderElement(options: InitRenderOptions): any {
    if (options.platform === InitRenderPlatform.WINDOWS) {
      throw new Error('Init groups are not supported on Windows');
    }

    // TODO: Is there a more idiomatic way to do this?
    const element = {} as Record<string, any>;
    element[this.groupName] = this.groupId !== undefined ? { gid: this.groupId } : {};
    return element;
  }

  // No-op
  public bind(_scope: Construct): void {}
}

/**
 * Create Linux/UNIX users and to assign user IDs.
 *
 * Users are created as non-interactive system users with a shell of
 * /sbin/nologin. This is by design and cannot be modified.
 *
 * Not supported for Windows systems.
 */
export class InitUser extends InitElement {
  /**
   * Map a user name to a user id
   */
  public static fromName(userName: string, uid: number, groups?: string[], homeDir?: string): InitUser {
    return new InitUser(userName, uid, groups, homeDir);
  }

  private readonly userName: string;
  private readonly uid: number;
  private readonly groups?: string[];
  private readonly homeDir?: string;

  protected constructor(userName: string, uid: number, groups?: string[], homeDir?: string) {
    super();

    this.userName = userName;
    this.uid = uid;
    this.groups = groups;
    this.homeDir = homeDir;
  }

  public getElementType(): InitElementType { return InitElementType.USER; }

  public renderElement(options: InitRenderOptions): any {
    if (options.platform === InitRenderPlatform.WINDOWS) {
      throw new Error('Init users are not supported on Windows');
    }

    // TODO: Is there a more idiomatic way to do this?
    const element = {} as Record<string, any>;
    element[this.userName] = {
      uid: this.uid,
      groups: this.groups,
      homeDir: this.homeDir,
    };
    return element;
  }

  // No-op
  public bind(_scope: Construct): void {}
}

/**
 * A package to be installed during cfn-init time
 */
export class InitPackage extends InitElement {
  /**
   * Install an RPM from an HTTP URL or a location on disk
   */
  public static rpm(location: string, key?: string): InitPackage {
  }

  /**
   * Install a package using Yum
   */
  public static yum(packageName: string, ...versions: string[]): InitPackage {
  }

  /**
   * Install a package from RubyGems
   */
  public static rubyGem(gemName: string, ...versions: string[]): InitPackage {
  }

  /**
   * Install a package from PyPI
   */
  public static python(packageName: string, ...versions: string[]): InitPackage {
  }

  /**
   * Install a package using APT
   */
  public static apt(packageName: string, ...versions: string[]): InitPackage {
  }

  /**
   * Install an MSI package from an HTTP URL or a location on disk
   */
  public static msi(location: string, key?: string): InitPackage {
  }

  protected constructor() {
    super();
  }
}

/**
 * A services that be enabled, disabled or restarted when the instance is launched.
 */
export class InitService extends InitElement {
  /**
   * Enable and start the given service, optionally restarting it
   */
  public static enable(serviceName: string, options: InitServiceOptions = {}): InitService {
  }

  /**
   * Disable and stop the given service, optionally restarting it
   */
  public static disable(serviceName: string, options: InitServiceOptions = {}): InitService {
  }

  /**
   * Leave the running state of the service alone, optionally restarting it
   */
  public static restart(serviceName: string, options: InitServiceOptions = {}): InitService {
  }
}

export interface InitServiceOptions {
  /**
   * Enable or disable this service
   *
   * Set to true to ensure that the service will be started automatically upon boot.
   *
   * Set to false to ensure that the service will not be started automatically upon boot.
   *
   * @default - true if used in `InitService.enable()`, false if used in `InitService.disable()`,
   * no change to service state if used in `InitService.restart()`.
   */
  readonly enabled?: boolean;

  /**
   * Make sure this service is running or not running after cfn-init finishes.
   *
   * Set to true to ensure that the service is running after cfn-init finishes.
   *
   * Set to false to ensure that the service is not running after cfn-init finishes.
   *
   * @default - Same value as 'enabled'
   * no change to service state if used in `InitService.restart()`.
   */
  readonly ensureRunning?: boolean;

  /**
   * Restart service if cfn-init touches one of these files
   *
   * Only works for files listed in the `files` section.
   *
   * @default - No files trigger restart
   */
  readonly restartAfterFiles?: string[];

  /**
   * Restart service if cfn-init expands an archive into one of these directories.
   *
   * @default - No sources trigger restart
   */
  readonly restartAfterSources?: string[];

  /**
   * Restart service if cfn-init installs or updates one of these packages
   *
   * A map of package manager to list of package names.
   *
   * @default - No packages trigger restart
   */
  readonly restartAfterPackages?: Record<string, string[]>;

  /**
   * Restart service after cfn-init runs the given command
   *
   * Takes a list of command names.
   *
   * @default - No commands trigger restart
   */
  readonly restartAfterCommands?: string[];
}

/**
 * Extract an archive into a directory
 */
export class InitSource extends InitElement {
  /**
   * Retrieve a URL and extract it into the given directory
   */
  public static fromUrl(targetDirectory: string, url: string): InitSource {
    return new InitSource(targetDirectory, url);
  }

  /**
   * Extract a GitHub branch into a given directory
   */
  public static fromGitHub(targetDirectory: string, owner: string, repo: string, refSpec?: string): InitSource {
    return InitSource.fromUrl(targetDirectory, `https://github.com/${owner}:${repo}/tarball/${refSpec ?? 'master'}`);
  }

  /**
   * Extract an archive stored in an S3 bucket into the given directory
   */
  public static fromS3Object(targetDirectory: string, bucket: s3.IBucket, key: string) {
    return InitSource.fromUrl(targetDirectory, bucket.urlForObject(key));
  }

  /**
   * Create an asset from the given directory and use that
   */
  public static fromDirectoryAsset(targetDirectory: string, sourceDirectory: string): InitSource {
    throw new Error('Not implemented');
  }

  /**
   * Extract a diretory from an existing directory asset
   */
  public static fromAsset(targetDirectory: string, asset: s3_assets.Asset): InitSource {
    throw new Error('Not implemented');
  }

  private readonly targetDirectory: string;
  private readonly url: string;

  protected constructor(targetDirectory: string, url: string) {
    super();

    this.targetDirectory = targetDirectory;
    this.url = url;
  }

  public getElementType(): InitElementType { return InitElementType.SOURCE; }

  public renderElement(_options: InitRenderOptions): any {
    const element = {} as Record<string, any>;
    element[this.targetDirectory] = this.url;
    return element;
  }

  public bind(_scope: Construct): void {
    throw new Error('Not yet implemented');
  }
}