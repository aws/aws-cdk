import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct, Duration } from '@aws-cdk/core';
import * as fs from 'fs';

/**
 * Defines whether this Init template will is being rendered for Windows or Linux-based systems.
 */
export enum InitPlatform {
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
 * Context information passed when an InitElement is being consumed
 */
export interface InitBindOptions {
  /**
   * Scope in which to define any resources, if necessary.
   */
  readonly scope: Construct;

  /**
   * Which OS platform (Linux, Windows) the init block will be for.
   * Impacts which config types are available and how they are created.
   */
  readonly platform: InitPlatform;

  /**
   * Ordered index of current element type. Primarily used to auto-generate
   * command keys and retain ordering.
   */
  readonly index: number;

  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;
}

/**
 * A return type for a configured InitElement. Both its CloudFormation representation, and any
 * additional metadata needed to create the CloudFormation:Init.
 */
export interface InitElementConfig {
  /**
   * The CloudFormation representation of the configuration of an InitElement.
   */
  readonly config: Record<string, any>;

  /**
   * Optional set of S3 bucket names that must get a AWS::CloudFormation::Authentication reference to access.
   *
   * @default No buckets are associated with the config
   */
  readonly authBucketNames?: string[];
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
   * Called when the Init config is being consumed. Renders the CloudFormation
   * representation of this init element, and calculates any authentication
   * properties needed, if any.
   *
   * @param options bind options for the element.
   */
  public abstract bind(options: InitBindOptions): InitElementConfig;

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
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
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
    if (argv.length === 0) {
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

  public bind(options: InitBindOptions): InitElementConfig {
    const commandKey = this.options.key || `${options.index}`.padStart(3, '0'); // 001, 005, etc.

    if (options.platform !== InitPlatform.WINDOWS && this.options.waitAfterCompletion !== undefined) {
      throw new Error(`Command '${this.command}': 'waitAfterCompletion' is only valid for Windows systems.`);
    }

    // FIXME: Side effects in a render function... :(
    for (const handle of this.options.serviceRestartHandles ?? []) {
      handle.addCommand(commandKey);
    }

    return {
      config: {
        [commandKey]: {
          command: this.command,
          env: this.options.env,
          cwd: this.options.cwd,
          test: this.options.test,
          ignoreErrors: this.options.ignoreErrors,
          waitAfterCompletion: this.options.waitAfterCompletion?.toSeconds(),
        },
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
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
}

/**
 * Additional options for creating an InitFile from an asset.
 */
export interface InitFileAssetOptions extends InitFileOptions, s3_assets.AssetOptions {
}

/**
 * Create files on the EC2 instance.
 */
export abstract class InitFile extends InitElement {

  /**
   * Use a literal string as the file content
   */
  public static fromString(fileName: string, content: string, options: InitFileOptions = {}): InitFile {
    return new class extends InitFile {
      protected renderContentOrSource(): Record<string, any> {
        return {
          content,
          encoding: this.options.base64Encoded ? 'base64' : 'plain',
        };
      }
    }(fileName, options);
  }

  /**
   * Write a symlink with the given symlink target
   */
  public static symlink(fileName: string, target: string, options: InitFileOptions = {}): InitFile {
    const { mode, ...otherOptions } = options;
    if (mode && mode.slice(0, 3) !== '120') {
      throw new Error('File mode for symlinks must begin with 120XXX');
    }
    return InitFile.fromString(fileName, target, { mode: (mode || '120644'), ...otherOptions });
  }

  /**
   * Use a JSON-compatible object as the file content, write it to a JSON file.
   *
   * May contain tokens.
   */
  public static fromObject(fileName: string, obj: Record<string, any>, options: InitFileOptions = {}): InitFile {
    return new class extends InitFile {
      protected renderContentOrSource(): Record<string, any> {
        return { content: obj };
      }
    }(fileName, options);
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
    return InitFile.fromString(targetFileName, fileContents, options);
  }

  /**
   * Download from a URL at instance startup time
   */
  public static fromUrl(fileName: string, url: string, options: InitFileOptions = {}): InitFile {
    return new class extends InitFile {
      protected renderContentOrSource(): Record<string, any> {
        return { source: url };
      }
    }(fileName, options);
  }

  /**
   * Download a file from an S3 bucket
   */
  public static fromS3Object(fileName: string, bucket: s3.IBucket, key: string, options: InitFileOptions = {}): InitFile {
    return new class extends InitFile {
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        bucket.grantRead(bindOptions.instanceRole, key);
        return super.bind(bindOptions);
      }
      protected renderContentOrSource(): Record<string, any> {
        return { source: bucket.urlForObject(key) };
      }
      protected renderAuthBucketNames(): string[] { return [ bucket.bucketName ]; }
    }(fileName, options);
  }

  /**
   * Create an asset from the given file and use that
   *
   * This is appropriate for files that are too large to embed into the template.
   */
  public static fromAsset(targetFileName: string, path: string, options: InitFileAssetOptions = {}): InitFile {
    return new class extends InitFile {
      private asset!: s3_assets.Asset;
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        this.asset = new s3_assets.Asset(bindOptions.scope, 'InitFileAsset', {
          path,
          ...options,
        });
        this.asset.grantRead(bindOptions.instanceRole);
        return super.bind(bindOptions);
      }
      protected renderContentOrSource(): Record<string, any> {
        return { source: this.asset.httpUrl };
      }
      protected renderAuthBucketNames(): string[] {
        return [ this.asset.s3BucketName ];
      }
    }(targetFileName, options);
  }

  /**
   * Use a file from an asset at instance startup time
   */
  public static fromExistingAsset(targetFileName: string, asset: s3_assets.Asset, options: InitFileOptions = {}): InitFile {
    return new class extends InitFile {
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        asset.grantRead(bindOptions.instanceRole);
        return super.bind(bindOptions);
      }
      protected renderContentOrSource(): Record<string, any> {
        return { source: asset.httpUrl };
      }
      protected renderAuthBucketNames(): string[] {
        return [ asset.s3BucketName ];
      }
    }(targetFileName, options);
  }

  public readonly elementType = InitElementType.FILE;

  protected constructor(private readonly fileName: string, private readonly options: InitFileOptions) {
    super();
  }

  public bind(bindOptions: InitBindOptions): InitElementConfig {
    // Side effects in a render function... :(
    for (const handle of this.options.serviceRestartHandles ?? []) {
      handle.addFile(this.fileName);
    }

    return {
      config: {
        [this.fileName]: {
          ...this.renderContentOrSource(),
          ...this.renderFileOptions(this.options, bindOptions.platform),
        },
      },
      authBucketNames: this.renderAuthBucketNames(),
    };
  }

  protected abstract renderContentOrSource(): Record<string, any>;

  protected renderAuthBucketNames(): string[] | undefined {
    // Default no-op
    return undefined;
  }

  private renderFileOptions(fileOptions: InitFileOptions, platform: InitPlatform): Record<string, any> {
    if (platform === InitPlatform.WINDOWS) {
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

  public bind(options: InitBindOptions): InitElementConfig {
    if (options.platform === InitPlatform.WINDOWS) {
      throw new Error('Init groups are not supported on Windows');
    }

    return {
      config: {
        [this.groupName]: this.groupId !== undefined ? { gid: this.groupId } : {},
      },
    };
  }

}

/**
 * Optional parameters used when creating a user
 */
export interface InitUserOptions {
  /**
   * The user's home directory.
   *
   * @default assigned by the OS
   */
  readonly homeDir?: string;

  /**
   * A user ID. The creation process fails if the user name exists with a different user ID.
   * If the user ID is already assigned to an existing user the operating system may
   * reject the creation request.
   *
   * @default assigned by the OS
   */
  readonly userId?: number;

  /**
   * A list of group names. The user will be added to each group in the list.
   *
   * @default the user is not associated with any groups.
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

  public bind(options: InitBindOptions): InitElementConfig {
    if (options.platform === InitPlatform.WINDOWS) {
      throw new Error('Init users are not supported on Windows');
    }

    return {
      config: {
        [this.userName]: {
          uid: this.userOptions.userId,
          groups: this.userOptions.groups,
          homeDir: this.userOptions.homeDir,
        },
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
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
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
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
}

/**
 * A package to be installed during cfn-init time
 */
export class InitPackage extends InitElement {
  /**
   * Install an RPM from an HTTP URL or a location on disk
   */
  public static rpm(location: string, options: LocationPackageOptions = {}): InitPackage {
    return new InitPackage('rpm', [location], options.key, options.serviceRestartHandles);
  }

  /**
   * Install a package using Yum
   */
  public static yum(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('yum', options.version ?? [], packageName, options.serviceRestartHandles);
  }

  /**
   * Install a package from RubyGems
   */
  public static rubyGem(gemName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('rubygems', options.version ?? [], gemName, options.serviceRestartHandles);
  }

  /**
   * Install a package from PyPI
   */
  public static python(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('python', options.version ?? [], packageName, options.serviceRestartHandles);
  }

  /**
   * Install a package using APT
   */
  public static apt(packageName: string, options: NamedPackageOptions = {}): InitPackage {
    return new InitPackage('apt', options.version ?? [], packageName, options.serviceRestartHandles);
  }

  /**
   * Install an MSI package from an HTTP URL or a location on disk
   */
  public static msi(location: string, options: LocationPackageOptions = {}): InitPackage {
    return new InitPackage('msi', [location], options.key, options.serviceRestartHandles);
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

  public bind(options: InitBindOptions): InitElementConfig {
    if ((this.type === 'msi') !== (options.platform === InitPlatform.WINDOWS)) {
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
      config: {
        [this.type]: {
          [packageName]: this.versions,
        },
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
  readonly serviceRestartHandle?: InitServiceRestartHandle;
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

  public bind(options: InitBindOptions): InitElementConfig {
    const serviceManager = options.platform === InitPlatform.LINUX ? 'sysvinit' : 'windows';

    return {
      config: {
        [serviceManager]: {
          [this.serviceName]: {
            enabled: this.serviceOptions.enabled,
            ensureRunning: this.serviceOptions.ensureRunning,
            ...this.serviceOptions.serviceRestartHandle?.renderRestartHandles(),
          },
        },
      },
    };
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
  readonly serviceRestartHandles?: InitServiceRestartHandle[];
}

/**
 * Additional options for an InitSource that builds an asset from local files.
 */
export interface InitSourceAssetOptions extends InitSourceOptions, s3_assets.AssetOptions {

}

/**
 * Extract an archive into a directory
 */
export abstract class InitSource extends InitElement {
  /**
   * Retrieve a URL and extract it into the given directory
   */
  public static fromUrl(targetDirectory: string, url: string, options: InitSourceOptions = {}): InitSource {
    return new class extends InitSource {
      protected renderUrl(): string { return url; }
    }(targetDirectory, options.serviceRestartHandles);
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
  public static fromS3Object(targetDirectory: string, bucket: s3.IBucket, key: string, options: InitSourceOptions = {}): InitSource {
    return new class extends InitSource {
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        bucket.grantRead(bindOptions.instanceRole, key);
        return super.bind(bindOptions);
      }
      protected renderUrl(): string { return bucket.urlForObject(key); }
      protected renderAuthBucketNames(): string[] { return [ bucket.bucketName ]; }
    }(targetDirectory, options.serviceRestartHandles);
  }

  /**
   * Create an InitSource from an asset created from the given path.
   */
  public static fromAsset(targetDirectory: string, path: string, options: InitSourceAssetOptions = {}): InitSource {
    return new class extends InitSource {
      private asset!: s3_assets.Asset;
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        this.asset = new s3_assets.Asset(bindOptions.scope, 'InitSourceAsset', {
          path,
          ...options,
        });
        this.asset.grantRead(bindOptions.instanceRole);
        return super.bind(bindOptions);
      }
      protected renderUrl(): string { return this.asset.httpUrl; }
      protected renderAuthBucketNames(): string[] { return [ this.asset.s3BucketName ]; }
    }(targetDirectory, options.serviceRestartHandles);
  }

  /**
   * Extract a directory from an existing directory asset.
   */
  public static fromExistingAsset(targetDirectory: string, asset: s3_assets.Asset, options: InitSourceOptions = {}): InitSource {
    return new class extends InitSource {
      public bind(bindOptions: InitBindOptions): InitElementConfig {
        asset.grantRead(bindOptions.instanceRole);
        return super.bind(bindOptions);
      }
      protected renderUrl(): string { return asset.s3ObjectUrl; }
      protected renderAuthBucketNames(): string[] { return [ asset.s3BucketName ]; }
    }(targetDirectory, options.serviceRestartHandles);
  }

  public readonly elementType = InitElementType.SOURCE;

  protected constructor(private readonly targetDirectory: string, private readonly serviceHandles?: InitServiceRestartHandle[]) {
    super();
  }

  public bind(_options: InitBindOptions): InitElementConfig {
    // Side effect and all that
    for (const handle of this.serviceHandles ?? []) {
      handle.addSource(this.targetDirectory);
    }

    return {
      config: { [this.targetDirectory]: this.renderUrl() },
      authBucketNames: this.renderAuthBucketNames(),
    };
  }

  protected abstract renderUrl(): string;

  protected renderAuthBucketNames(): string[] | undefined {
    // Default no-op
    return undefined;
  }
}
