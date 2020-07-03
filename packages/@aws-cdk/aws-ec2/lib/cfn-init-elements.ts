import * as fs from 'fs';
import * as iam from '@aws-cdk/aws-iam';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, Duration } from '@aws-cdk/core';

/**
 * Defines whether this Init template will is being rendered for Windows or Linux-based systems.
 */
export enum InitRenderPlatform {
  /**
   * Render the config for a Windows platform
   */
  WINDOWS = 'WINDOWS',

  /**
   * Render the config for a Linux platform
   */
  LINUX = 'LINUX',
}

/**
 * The type of the init element.
 */
export enum InitElementType {
  /**
   * A package
   */
  PACKAGE = 'PACKAGE',

  /**
   * A group
   */
  GROUP = 'GROUP',

  /**
   * A user
   */
  USER = 'USER',

  /**
   * A source
   */
  SOURCE = 'SOURCE',

  /**
   * A file
   */
  FILE = 'FILE',

  /**
   * A command
   */
  COMMAND = 'COMMAND',

  /**
   * A service
   */
  SERVICE = 'SERVICE',
}

/**
 * An object that represents reasons to restart an InitService
 *
 * Pass an instance of this object to all the `InitFile`, `InitCommand`,
 * `InitSource` and `InitPackage` objects that you want to restart
 * a service, and finally to the `InitService` itself as well.
 */
export class InitServiceRestartHandle {
  private readonly commands = new Array<string>();
  private readonly files = new Array<string>();
  private readonly sources = new Array<string>();
  private readonly packages: Record<string, string[]> = {};

  /**
   * Add a command key to the restart set
   */
  public addCommand(key: string) {
    return this.commands.push(key);
  }

  /**
   * Add a file key to the restart set
   */
  public addFile(key: string) {
    return this.files.push(key);
  }

  /**
   * Add a source key to the restart set
   */
  public addSource(key: string) {
    return this.sources.push(key);
  }

  /**
   * Add a package key to the restart set
   */
  public addPackage(packageType: string, key: string) {
    if (!this.packages[packageType]) {
      this.packages[packageType] = [];
    }
    this.packages[packageType].push(key);
  }

  /**
   * Render the restart handles for use in an InitService declaration
   */
  public renderRestartHandles(): any {
    const nonEmpty = <A>(x: A[]) => x.length > 0 ? x : undefined;

    return {
      commands: nonEmpty(this.commands),
      files: nonEmpty(this.files),
      packages: Object.keys(this.packages).length > 0 ? this.packages : undefined,
      sources: nonEmpty(this.sources),
    };
  }
}

/**
 * Context options passed when an InitElement is being rendered
 */
export interface InitRenderOptions {
  /**
   * Which OS platform (Linux, Windows) are we rendering for. Impacts
   * which config types are available and how they are rendered.
   */
  readonly platform: InitRenderPlatform;

  /**
   * Ordered index of current element type. Primarily used to auto-generate
   * command keys and retain ordering.
   */
  readonly index: number;
}

/**
 * Context information passed when an InitElement is being consumed
 */
export interface InitBindOptions {
  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;
}

/**
 * Base class for all CloudFormation Init elements
 */
export abstract class InitElement {

  /**
   * Returns the init element type for this element.
   */
  public abstract readonly elementType: InitElementType;

  /**
   * Render the CloudFormation representation of this init element.
   *
   * Should return an object with a single key: `{ key: { ...details... }}`
   *
   * @param options
   */
  public abstract renderElement(options: InitRenderOptions): Record<string, any>;

  /**
   * Called when the Init config is being consumed.
   */
  public bind(_scope: Construct, _options: InitBindOptions): void {
    // Default is no-op
  }
}

/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
  /**
   * Identifier key for this command
   *
   * You can use this to order commands.
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
   * @default Duration.seconds(60)
   */
  readonly waitAfterCompletion?: Duration;

  /**
   * Restart the given service(s) after this command has run
   *
   * @default - Do not restart any service
   */
  readonly serviceHandles?: InitServiceRestartHandle[];
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
    if (argv.length == 0) {
      throw new Error('Cannot define argvCommand with an empty arguments');
    }
    return new InitCommand(argv, options);
  }

  public readonly elementType = InitElementType.COMMAND;

  protected constructor(private readonly command: any, private readonly options: InitCommandOptions) {
    super();

    if (typeof this.command !== 'string' && !(Array.isArray(command) && command.every(s => typeof s === 'string'))) {
      throw new Error('\'command\' must be either a string or an array of strings');
    }
  }

  public renderElement(renderOptions: InitRenderOptions): Record<string, any> {
    const commandKey = this.options.key || `${renderOptions.index}`.padStart(3, '0'); // 001, 005, etc.

    if (renderOptions.platform !== InitRenderPlatform.WINDOWS && this.options.waitAfterCompletion !== undefined) {
      throw new Error(`Command '${this.command}': 'waitAfterCompletion' is only valid for Windows systems.`);
    }

    // FIXME: Side effects in a render function... :(
    for (const handle of this.options.serviceHandles ?? []) {
      handle.addCommand(commandKey);
    }

    return {
      [commandKey]: {
        command: this.command,
        env: this.options.env,
        cwd: this.options.cwd,
        test: this.options.test,
        ignoreErrors: this.options.ignoreErrors,
        waitAfterCompletion: this.options.waitAfterCompletion?.toSeconds(),
      },
    };
  }

}

/**
 * The content can be either inline in the template or the content can be
 * pulled from a URL.
 */
export interface InitFileOptions {
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

  /**
   * True if the inlined content (from a string or file) should be treated as base64 encoded.
   * Only applicable for inlined string and file content.
   *
   * @default false
   */
  readonly base64Encoded?: boolean;

  /**
   * Restart the given service after this file has been written
   *
   * @default - Do not restart any service
   */
  readonly serviceHandles?: InitServiceRestartHandle[];
}

/**
 * Create files on the EC2 instance.
 */
export class InitFile extends InitElement {

  /**
   * Use a literal string as the file content
   */
  public static fromString(fileName: string, content: string, options: InitFileOptions = {}): InitFile {
    return new InitFile(fileName, content, options, true);
  }

  /**
   * Write a symlink with the given symlink target
   */
  public static symlink(fileName: string, target: string, options: InitFileOptions = {}): InitFile {
    const { mode, ...otherOptions } = options;
    if (mode && mode.slice(0, 3) !== '120') {
      throw new Error('File mode for symlinks must begin with 120XXX');
    }
    return new InitFile(fileName, target, { mode: (mode || '120644'), ...otherOptions }, true);
  }

  /**
   * Use a JSON-compatible object as the file content, write it to a JSON file.
   *
   * May contain tokens.
   */
  public static fromObject(fileName: string, obj: Record<string, any>, options: InitFileOptions = {}): InitFile {
    class InitFileObject extends InitFile {
      public renderElement(renderOptions: InitRenderOptions): Record<string, any> {
        return {
          [fileName]: {
            content: obj,
            ...this.renderOptions(options, renderOptions),
          },
        };
      }
    }
    return new InitFileObject(fileName, '', options);
  }

  /**
   * Read a file from disk and use its contents
   *
   * The file will be embedded in the template, so care should be taken to not
   * exceed the template size.
   *
   * If options.base64encoded is set to true, this will base64-encode the file's contents.
   */
  public static fromFileInline(targetFileName: string, sourceFileName: string, options: InitFileOptions = {}): InitFile {
    const encoding = options.base64Encoded ? 'base64' : 'utf8';
    const fileContents = fs.readFileSync(sourceFileName).toString(encoding);
    return new InitFile(targetFileName, fileContents, options, true);
  }

  /**
   * Create an asset from the given file and use that
   *
   * This is appropriate for files that are too large to embed into the template.
   */
  public static fromFileAsset(_targetFileName: string, _sourceFileName: string, _options: InitFileOptions = {}): InitFile {
    // TODO - No scope here, so can't create the Asset directly. Need to delay creation until bind() is called,
    // or find some other clever solution if we're going to support this.
    throw new Error('Not implemented.');
  }

  /**
   * Download from a URL at instance startup time
   */
  public static fromUrl(fileName: string, url: string, options: InitFileOptions = {}): InitFile {
    return new InitFile(fileName, url, options, false);
  }

  /**
   * Use a file from an asset at instance startup time
   */
  public static fromAsset(targetFileName: string, asset: s3_assets.Asset, options: InitFileOptions = {}): InitFile {
    class InitFileAsset extends InitFile {
      constructor() {
        super(targetFileName, asset.httpUrl, options, false);
      }

      public bind(_scope: Construct, _bindOptions: InitBindOptions) {
        // FIXME
        throw new Error('Not implemented.');
      }
    }
    return new InitFileAsset();
  }

  public readonly elementType = InitElementType.FILE;

  private readonly fileName: string;
  private readonly content: string;
  private readonly options: InitFileOptions;
  private readonly isInlineContent: boolean;

  protected constructor(fileName: string, content: string, options: InitFileOptions, isInlineContent: boolean = true) {
    super();

    this.fileName = fileName;
    this.content = content;
    this.options = options;
    this.isInlineContent = isInlineContent;
  }

  public renderElement(renderOptions: InitRenderOptions): Record<string, any> {
    // FIXME: Side effects in a render function... :(
    for (const handle of this.options.serviceHandles ?? []) {
      handle.addFile(this.fileName);
    }

    return {
      [this.fileName]: {
        ...this.renderContentOrSource(),
        ...this.renderOptions(this.options, renderOptions),
      },
    };
  }

  private renderContentOrSource(): Record<string, any> {
    return this.isInlineContent ? {
      content: this.content,
      encoding: this.options.base64Encoded ? 'base64' : 'plain',
    } : {
      source: this.content,
    };
  }

  private renderOptions(fileOptions: InitFileOptions, renderOptions: InitRenderOptions): Record<string, any> {
    if (renderOptions.platform === InitRenderPlatform.WINDOWS) {
      if (fileOptions.group || fileOptions.owner || fileOptions.mode) {
        throw new Error('Owner, group, and mode options not supported for Windows.');
      }
      return {};
    }

    return {
      mode: fileOptions.mode || '000644',
      owner: fileOptions.owner || 'root',
      group: fileOptions.group || 'root',
    };
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

  public readonly elementType = InitElementType.GROUP;

  protected constructor(private groupName: string, private groupId?: number) {
    super();
  }

  public renderElement(options: InitRenderOptions): Record<string, any> {
    if (options.platform === InitRenderPlatform.WINDOWS) {
      throw new Error('Init groups are not supported on Windows');
    }

    return {
      [this.groupName]: this.groupId !== undefined ? { gid: this.groupId } : {},
    };
  }

}

/**
 * Optional parameters used when creating a user
 */
interface InitUserOptions {
  /**
   * The user's home directory.
   */
  readonly homeDir?: string;

  /**
   * A user ID. The creation process fails if the user name exists with a different user ID.
   * If the user ID is already assigned to an existing user the operating system may
   * reject the creation request.
   */
  readonly userId?: number;

  /**
   * A list of group names. The user will be added to each group in the list.
   */
  readonly groups?: string[];
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
  public static fromName(userName: string, options: InitUserOptions = {}): InitUser {
    return new InitUser(userName, options);
  }

  public readonly elementType = InitElementType.USER;

  protected constructor(private readonly userName: string, private readonly userOptions: InitUserOptions) {
    super();
  }

  public renderElement(options: InitRenderOptions): Record<string, any> {
    if (options.platform === InitRenderPlatform.WINDOWS) {
      throw new Error('Init users are not supported on Windows');
    }

    return {
      [this.userName]: {
        uid: this.userOptions.userId,
        groups: this.userOptions.groups,
        homeDir: this.userOptions.homeDir,
      },
    };
  }
}

/**
 * Options for InitPackage.rpm/InitPackage.msi
 */
export interface LocationPackageOptions {
  /**
   * Identifier key for this package
   *
   * You can use this to order package installs.
   *
   * @default - Automatically generated
   */
  readonly key?: string;

  /**
   * Restart the given service after this command has run
   *
   * @default - Do not restart any service
   */
  readonly serviceHandles?: InitServiceRestartHandle[];
}

/**
 * Options for InitPackage.yum/apt/rubyGem/python
 */
export interface NamedPackageOptions {
  /**
   * Specify the versions to install
   *
   * @default - Install the latest version
   */
  readonly version?: string[];

  /**
   * Restart the given services after this command has run
   *
   * @default - Do not restart any service
   */
  readonly serviceHandles?: InitServiceRestartHandle[];
}

/**
 * A package to be installed during cfn-init time
 */
export class InitPackage extends InitElement {
  /**
   * Install an RPM from an HTTP URL or a location on disk
   */
  public static rpm(location: string, options: LocationPackageOptions = {}): InitPackage {
    return new InitPackage('rpm', [location], options.key, options.serviceHandles);
  }

  /**
   * Install a package using Yum
   */
  public static yum(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('yum', options.version ?? [], packageName, options.serviceHandles);
  }

  /**
   * Install a package from RubyGems
   */
  public static rubyGem(gemName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('rubygems', options.version ?? [], gemName, options.serviceHandles);
  }

  /**
   * Install a package from PyPI
   */
  public static python(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('python', options.version ?? [], packageName, options.serviceHandles);
  }

  /**
   * Install a package using APT
   */
  public static apt(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('apt', options.version ?? [], packageName, options.serviceHandles);
  }

  /**
   * Install an MSI package from an HTTP URL or a location on disk
   */
  public static msi(location: string, options: LocationPackageOptions = {}): InitPackage {
    return new InitPackage('msi', [location], options.key, options.serviceHandles);
  }

  public readonly elementType = InitElementType.PACKAGE;

  protected constructor(
    private readonly type: string,
    private readonly versions: string[],
    private readonly packageName?: string,
    private readonly serviceHandles?: InitServiceRestartHandle[],
  ) {
    super();
  }

  public renderElement(options: InitRenderOptions): Record<string, any> {
    if ((this.type === 'msi') !== (options.platform === InitRenderPlatform.WINDOWS)) {
      if (this.type === 'msi') {
        throw new Error('MSI installers are only supported on Windows systems.');
      } else {
        throw new Error('Windows only supports the MSI package type');
      }
    }

    if (!this.packageName && !['rpm', 'msi'].includes(this.type)) {
      throw new Error('Package name must be specified for all package types besides RPM and MSI.');
    }

    const packageName = this.packageName || `${options.index}`.padStart(3, '0');

    for (const handle of this.serviceHandles ?? []) {
      handle.addPackage(this.type, packageName);
    }

    return {
      [this.type]: {
        [packageName]: this.versions,
      },
    };
  }
}

/**
 * Options for an InitService
 */
export interface InitServiceOptions {
  /**
   * Enable or disable this service
   *
   * Set to true to ensure that the service will be started automatically upon boot.
   *
   * Set to false to ensure that the service will not be started automatically upon boot.
   *
   * @default - true if used in `InitService.enable()`, no change to service
   * state if used in `InitService.fromOptions()`.
   */
  readonly enabled?: boolean;

  /**
   * Make sure this service is running or not running after cfn-init finishes.
   *
   * Set to true to ensure that the service is running after cfn-init finishes.
   *
   * Set to false to ensure that the service is not running after cfn-init finishes.
   *
   * @default - same value as `enabled`.
   */
  readonly ensureRunning?: boolean;

  /**
   * Restart service when the actions registered into the restartHandle have been performed
   *
   * Register actions into the restartHandle by passing it to `InitFile`, `InitCommand`,
   * `InitPackage` and `InitSource` objects.
   *
   * @default - No files trigger restart
   */
  readonly restartHandle?: InitServiceRestartHandle;
}

/**
 * A services that be enabled, disabled or restarted when the instance is launched.
 */
export class InitService extends InitElement {
  /**
   * Enable and start the given service, optionally restarting it
   */
  public static enable(serviceName: string, options: InitServiceOptions = {}): InitService {
    const { enabled, ensureRunning, ...otherOptions } = options;
    return new InitService(serviceName, {
      enabled: enabled ?? true,
      ensureRunning: ensureRunning ?? enabled ?? true,
      ...otherOptions,
    });
  }

  /**
   * Disable and stop the given service
   */
  public static disable(serviceName: string): InitService {
    return new InitService(serviceName, { enabled: false, ensureRunning: false });
  }

  /**
   * Create a service restart definition from the given options, not imposing any defaults.
   *
   * @param serviceName the name of the service to restart
   * @param options service options
   */
  public static fromOptions(serviceName: string, options: InitServiceOptions = {}): InitService {
    return new InitService(serviceName, options);
  }

  public readonly elementType = InitElementType.SERVICE;

  protected constructor(private readonly serviceName: string, private readonly serviceOptions: InitServiceOptions) {
    super();
  }

  public renderElement(options: InitRenderOptions): Record<string, any> {
    const serviceManager = options.platform === InitRenderPlatform.LINUX ? 'sysvinit' : 'windows';

    return {
      [serviceManager]: {
        [this.serviceName]: {
          enabled: this.serviceOptions.enabled,
          ensureRunning: this.serviceOptions.ensureRunning,
          ...this.serviceOptions.restartHandle?.renderRestartHandles(),
        },
      },
    };
  }

}

/**
 * Extract an archive into a directory
 */
export class InitSource extends InitElement {
  /**
   * Retrieve a URL and extract it into the given directory
   */
  public static fromUrl(targetDirectory: string, url: string, options: InitSourceOptions = {}): InitSource {
    return new InitSource(targetDirectory, url, undefined, options.serviceHandles);
  }

  /**
   * Extract a GitHub branch into a given directory
   */
  public static fromGitHub(targetDirectory: string, owner: string, repo: string, refSpec?: string, options: InitSourceOptions = {}): InitSource {
    return InitSource.fromUrl(targetDirectory, `https://github.com/${owner}/${repo}/tarball/${refSpec ?? 'master'}`, options);
  }

  /**
   * Extract an archive stored in an S3 bucket into the given directory
   */
  public static fromS3Object(targetDirectory: string, bucket: s3.IBucket, key: string, options: InitSourceOptions = {}) {
    return InitSource.fromUrl(targetDirectory, bucket.urlForObject(key), options);
  }

  /**
   * Create an asset from the given directory and use that
   */
  public static fromDirectoryAsset(_targetDirectory: string, _sourceDirectory: string, _options: InitSourceOptions = {}): InitSource {
    // TODO - No scope here, so can't create the Asset directly. Need to delay creation until bind() is called,
    // or find some other clever solution if we're going to support this.
    throw new Error('Not implemented');
  }

  /**
   * Extract a diretory from an existing directory asset
   */
  public static fromAsset(targetDirectory: string, asset: s3_assets.Asset, options: InitSourceOptions = {}): InitSource {
    return new InitSource(targetDirectory, asset.httpUrl, asset, options.serviceHandles);
  }

  public readonly elementType = InitElementType.SOURCE;

  private constructor(
    private readonly targetDirectory: string,
    private readonly url: string,
    private readonly asset?: s3_assets.Asset,
    private readonly serviceHandles?: InitServiceRestartHandle[],
  ) {
    super();
  }

  public renderElement(_options: InitRenderOptions): Record<string, any> {
    // Side effect and all that
    for (const handle of this.serviceHandles ?? []) {
      handle.addSource(this.targetDirectory);
    }

    return {
      [this.targetDirectory]: this.url,
    };
  }

  public bind(_scope: Construct, _options: InitBindOptions): void {
    if (this.asset === undefined) { return; }
    throw new Error('Not yet implemented');
  }
}

/**
 * Additional options for an InitSource
 */
export interface InitSourceOptions {

  /**
   * Restart the given services after this archive has been extracted
   *
   * @default - Do not restart any service
   */
  readonly serviceHandles?: InitServiceRestartHandle[];
}