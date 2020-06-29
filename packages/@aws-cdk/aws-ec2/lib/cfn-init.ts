import { Construct } from '@aws-cdk/core';
import * as s3_assets from '@aws-cdk/aws-s3-assets';

/**
 * Configuration to apply to an EC2 instance on startup
 */
export abstract class CloudFormationInit {
  /**
   * A simple config with a single configset
   */
  public static simpleConfig(...elements: InitElement[]): CloudFormationInit {
  }

  /**
   * A CloudFormation with multiple configsets
   *
   * Use this if you need to customize order between configsets.
   */
  public static withConfigSets(props: ConfigSetProps): CloudFormationInit {
  }
}

/**
 * Options for CloudFormationInit.withConfigSets
 */
export interface ConfigSetProps {
  /**
   * The definitions of each config set
   */
  configSets: Record<string, string[]>;

  /**
   * The sets of configs to pick from
   */
  configs: Record<string, InitElement[]>;
}


/**
 * Base class for all CloudFormation Init elements
 */
export abstract class InitElement {
}

/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
  /**
   * Identifier key for this command
   *
   * You can use this to order commands, or to restart a service after this
   * command runs.
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
   * If the test passes (exits with error code 0), the command is run.
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
  }

  /**
   * Run a command from an argv array
   *
   * You do not need to escape space characters or enclose command parameters in quotes.
   */
  public static argvCommand(argv: string[], options: InitCommandOptions = {}): InitCommand {
  }

  protected constructor() {
    super();
  }
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
  public static fromName(groupName: string, gid: number): InitGroup {
  }

  protected constructor() {
    super();
  }
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
  }

  protected constructor() {
    super();
  }
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
}

export interface InitServiceOptions {
  /**
   * Name of the service to start or stop
   */
  readonly serviceName: string;

  /**
   * Enable or disable this service
   *
   * Set to true to ensure that the service will be started automatically upon boot.
   *
   * Set to false to ensure that the service will not be started automatically upon boot.
   *
   * @default - No changes to the state of the service
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

export class InitSource {
}