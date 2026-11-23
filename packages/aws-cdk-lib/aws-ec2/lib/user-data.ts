import { OperatingSystemType } from './machine-image';
import { normalizeEc2LaunchV2Value, renderEc2LaunchV2Yaml } from './private/ec2launch-v2-yaml';
import type { IBucketRef } from '../../aws-s3';
import type { Resource, CfnResource } from '../../core';
import { Fn, Stack, Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import { posixShellEscape, posixShellEscapeMinimal, powershellEscape, powershellEscapeMinimal } from '../../core/lib/private/shell-escape';

/**
 * Options when constructing UserData for Linux
 */
export interface LinuxUserDataOptions {
  /**
   * Shebang for the UserData script
   *
   * @default "#!/bin/bash"
   */
  readonly shebang?: string;
}

/**
 * Options when constructing UserData for Windows
 */
export interface WindowsUserDataOptions {
  /**
   * Set to true to set this userdata to persist through an instance reboot; allowing
   * it to run on every instance start.
   * By default, UserData is run only once during the first instance launch.
   *
   * For more information, see:
   * https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/
   * https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-windows-user-data.html#user-data-scripts
   *
   * @default false
   */
  readonly persist?: boolean;
}

/**
 * Options when downloading files from S3
 */
export interface S3DownloadOptions {

  /**
   * Name of the S3 bucket to download from
   */
  readonly bucket: IBucketRef;

  /**
   * The key of the file to download
   */
  readonly bucketKey: string;

  /**
   * The name of the local file.
   *
   * @default Linux   - /tmp/bucketKey
   *          Windows - %TEMP%/bucketKey
   */
  readonly localFile?: string;

  /**
   * The region of the S3 Bucket (needed for access via VPC Gateway)
   * @default none
   */
  readonly region?: string;

}

/**
 * Options when executing a file.
 */
export interface ExecuteFileOptions {

  /**
   * The path to the file.
   */
  readonly filePath: string;

  /**
   * The arguments to be passed to the file.
   *
   * @default No arguments are passed to the file.
   */
  readonly arguments?: string;

}

/**
 * Instance User Data
 */
export abstract class UserData {
  /**
   * Create a userdata object for Linux hosts
   */
  public static forLinux(options: LinuxUserDataOptions = {}): UserData {
    return new LinuxUserData(options);
  }

  /**
   * Create a userdata object for Windows hosts
   */
  public static forWindows(options: WindowsUserDataOptions = {}): UserData {
    return new WindowsUserData(options);
  }

  /**
   * Create a userdata object for Windows hosts using the EC2Launch v2 YAML format
   *
   * Commands added with `addCommands()` and the other `add*Command()` methods
   * are run as a single PowerShell script. Other EC2Launch v2 tasks can be
   * added with `addTask()`.
   *
   * Requires an AMI that runs the EC2Launch v2 agent, version 2.0.1245 or
   * later. AWS Windows Server 2022 and later AMIs include it by default; for
   * Windows Server 2016 and 2019 use the AMIs whose names start with
   * `EC2LaunchV2-Windows_Server-`. Launch agents older than EC2Launch v2
   * do not understand this format and ignore the user data.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-settings.html#ec2launch-v2-schema-user-data
   */
  public static forWindowsEc2LaunchV2(options: Ec2LaunchV2UserDataOptions = {}): Ec2LaunchV2UserData {
    return new Ec2LaunchV2UserData(options);
  }

  /**
   * Create a userdata object with custom content
   */
  public static custom(content: string): UserData {
    const userData = new CustomUserData();
    userData.addCommands(content);
    return userData;
  }

  public static forOperatingSystem(os: OperatingSystemType): UserData {
    switch (os) {
      case OperatingSystemType.LINUX: return UserData.forLinux();
      case OperatingSystemType.WINDOWS: return UserData.forWindows();
      case OperatingSystemType.UNKNOWN: throw new UnscopedValidationError(lit`CannotDetermineUserData`, 'Cannot determine UserData for unknown operating system type');
    }
  }

  /**
   * Add one or more commands to the user data
   */
  public abstract addCommands(...commands: string[]): void;

  /**
   * Add one or more commands to the user data that will run when the script exits.
   */
  public abstract addOnExitCommands(...commands: string[]): void;

  /**
   * Render the UserData for use in a construct
   */
  public abstract render(): string;

  /**
   * Adds commands to download a file from S3
   *
   * @returns: The local path that the file will be downloaded to
   */
  public abstract addS3DownloadCommand(params: S3DownloadOptions): string;

  /**
   * Adds commands to execute a file
   */
  public abstract addExecuteFileCommand( params: ExecuteFileOptions): void;

  /**
   * Adds a command which will send a cfn-signal when the user data script ends
   */
  public abstract addSignalOnExitCommand( resource: Resource ): void;
}

/**
 * Linux Instance User Data
 */
class LinuxUserData extends UserData {
  private readonly lines: string[] = [];
  private readonly onExitLines: string[] = [];

  constructor(private readonly props: LinuxUserDataOptions = {}) {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addOnExitCommands(...commands: string[]) {
    this.onExitLines.push(...commands);
  }

  public render(): string {
    const shebang = this.props.shebang ?? '#!/bin/bash';
    return [shebang, ...(this.renderOnExitLines()), ...this.lines].join('\n');
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    const s3Path = `s3://${params.bucket.bucketRef.bucketName}/${params.bucketKey}`;
    const localPath = ( params.localFile && params.localFile.length !== 0 ) ? params.localFile : `/tmp/${ params.bucketKey }`;
    this.addCommands(
      `mkdir -p $(dirname ${posixShellEscape(localPath)})`,
      `aws s3 cp ${posixShellEscape(s3Path)} ${posixShellEscape(localPath)}` + (params.region !== undefined ? ` --region ${posixShellEscapeMinimal(params.region)}` : ''),
    );

    return localPath;
  }

  public addExecuteFileCommand( params: ExecuteFileOptions): void {
    this.addCommands(
      'set -e',
      `chmod +x ${posixShellEscape(params.filePath)}`,
      `${posixShellEscape(params.filePath)} ${params.arguments ?? ''}`.trim(),
    );
  }

  public addSignalOnExitCommand( resource: Resource ): void {
    const stack = Stack.of(resource);
    const resourceID = (resource.node.defaultChild as CfnResource).logicalId;
    // An unresolved region is the AWS::Region pseudo parameter, which is always shell-safe; quoting it would change existing user data
    const region = Token.isUnresolved(stack.region) ? stack.region : posixShellEscapeMinimal(stack.region);
    this.addOnExitCommands(`/opt/aws/bin/cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${region} -e $exitCode || echo 'Failed to send Cloudformation Signal'`);
  }

  private renderOnExitLines(): string[] {
    if ( this.onExitLines.length > 0 ) {
      return ['function exitTrap(){', 'exitCode=$?', ...this.onExitLines, '}', 'trap exitTrap EXIT'];
    }
    return [];
  }
}

/**
 * Windows Instance User Data
 */
class WindowsUserData extends UserData {
  private readonly lines: string[] = [];
  private readonly onExitLines: string[] = [];

  constructor(private readonly props: WindowsUserDataOptions = {}) {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addOnExitCommands(...commands: string[]) {
    this.onExitLines.push(...commands);
  }

  public render(): string {
    return `<powershell>${
      [...(this.renderOnExitLines()),
        ...this.lines,
        ...( this.onExitLines.length > 0 ? ['throw "Success"'] : [] )].join('\n')
    }</powershell>${(this.props.persist ?? false) ? '<persist>true</persist>' : ''}`;
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    const download = powershellS3DownloadCommands(params);
    this.addCommands(...download.commands);
    return download.localPath;
  }

  public addExecuteFileCommand( params: ExecuteFileOptions): void {
    this.addCommands(...powershellExecuteFileCommands(params));
  }

  public addSignalOnExitCommand( resource: Resource ): void {
    this.addOnExitCommands(powershellSignalCommand(resource));
  }

  private renderOnExitLines(): string[] {
    if ( this.onExitLines.length > 0 ) {
      return ['trap {', '$success=($PSItem.Exception.Message -eq "Success")', ...this.onExitLines, 'break', '}'];
    }
    return [];
  }
}

/**
 * PowerShell commands that download a file from S3, shared by the Windows user data flavors
 */
function powershellS3DownloadCommands(params: S3DownloadOptions): { localPath: string; commands: string[] } {
  const localPath = ( params.localFile && params.localFile.length !== 0 ) ? params.localFile : `C:/temp/${ params.bucketKey }`;
  return {
    localPath,
    commands: [
      `mkdir (Split-Path -Path ${powershellEscape(localPath)} ) -ea 0`,
      `Read-S3Object -BucketName ${powershellEscape(params.bucket.bucketRef.bucketName)} -key ${powershellEscape(params.bucketKey)} -file ${powershellEscape(localPath)} -ErrorAction Stop` + (params.region !== undefined ? ` -Region ${powershellEscapeMinimal(params.region)}` : ''),
    ],
  };
}

/**
 * PowerShell commands that execute a file, shared by the Windows user data flavors
 */
function powershellExecuteFileCommands(params: ExecuteFileOptions): string[] {
  return [
    `&${powershellEscape(params.filePath)} ${params.arguments ?? ''}`.trim(),
    `if (!$?) { Write-Error ${powershellEscape(`Failed to execute the file "${params.filePath}"`)} -ErrorAction Stop }`,
  ];
}

/**
 * PowerShell command that sends a CloudFormation signal based on the `$success` variable
 */
function powershellSignalCommand(resource: Resource): string {
  const stack = Stack.of(resource);
  const resourceID = (resource.node.defaultChild as CfnResource).logicalId;
  return `cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} --success ($success.ToString().ToLower())`;
}

/**
 * Custom Instance User Data
 */
class CustomUserData extends UserData {
  private readonly lines: string[] = [];

  constructor() {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addOnExitCommands(): void {
    throw new UnscopedValidationError(lit`CustomUserDataDoesNotSupportAddOnExitCommands`, 'CustomUserData does not support addOnExitCommands, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public render(): string {
    return this.lines.join('\n');
  }

  public addS3DownloadCommand(): string {
    throw new UnscopedValidationError(lit`CustomUserDataDoesNotSupportAddS3DownloadCommand`, 'CustomUserData does not support addS3DownloadCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public addExecuteFileCommand(): void {
    throw new UnscopedValidationError(lit`CustomUserDataDoesNotSupportAddExecuteFileCommand`, 'CustomUserData does not support addExecuteFileCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public addSignalOnExitCommand(): void {
    throw new UnscopedValidationError(lit`CustomUserDataDoesNotSupportAddSignalOnExitCommand`, 'CustomUserData does not support addSignalOnExitCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }
}

/**
 * How often an EC2Launch v2 task runs
 */
export enum Ec2LaunchV2Frequency {
  /**
   * Run only on the first boot of the instance
   */
  ONCE = 'once',

  /**
   * Run on every boot of the instance
   */
  ALWAYS = 'always',
}

/**
 * The account that EC2Launch v2 runs a script as
 */
export enum Ec2LaunchV2RunAs {
  /**
   * The local system account
   */
  LOCAL_SYSTEM = 'localSystem',

  /**
   * The local administrator account
   */
  ADMIN = 'admin',
}

/**
 * The partition type that the EC2Launch v2 `initializeVolume` task creates
 */
export enum Ec2LaunchV2PartitionType {
  /**
   * Master boot record
   */
  MBR = 'mbr',

  /**
   * GUID partition table
   */
  GPT = 'gpt',
}

/**
 * An instance attribute that the EC2Launch v2 `setWallpaper` task can display
 */
export class Ec2LaunchV2WallpaperAttribute {
  /** The processor architecture */
  public static readonly ARCHITECTURE = new Ec2LaunchV2WallpaperAttribute('architecture');

  /** The Availability Zone */
  public static readonly AVAILABILITY_ZONE = new Ec2LaunchV2WallpaperAttribute('availabilityZone');

  /** The host name */
  public static readonly HOST_NAME = new Ec2LaunchV2WallpaperAttribute('hostName');

  /** The instance ID */
  public static readonly INSTANCE_ID = new Ec2LaunchV2WallpaperAttribute('instanceId');

  /** The instance size */
  public static readonly INSTANCE_SIZE = new Ec2LaunchV2WallpaperAttribute('instanceSize');

  /** The private IPv4 address */
  public static readonly PRIVATE_IP_ADDRESS = new Ec2LaunchV2WallpaperAttribute('privateIpAddress');

  /** The public IPv4 address */
  public static readonly PUBLIC_IP_ADDRESS = new Ec2LaunchV2WallpaperAttribute('publicIpAddress');

  /** The IPv6 address */
  public static readonly IPV6_ADDRESS = new Ec2LaunchV2WallpaperAttribute('ipv6Address');

  /**
   * An attribute not listed above, for example one added by a later version of EC2Launch v2
   *
   * @param name the name of the attribute, as used in the `attributes` input of the `setWallpaper` task
   */
  public static of(name: string): Ec2LaunchV2WallpaperAttribute {
    return new Ec2LaunchV2WallpaperAttribute(name);
  }

  /**
   * @param name the name of the attribute, as used in the `attributes` input of the `setWallpaper` task
   */
  private constructor(public readonly name: string) {}
}

/**
 * Options for how EC2Launch v2 runs a script
 */
export interface Ec2LaunchV2ScriptOptions {
  /**
   * How often the script runs
   *
   * @default Ec2LaunchV2Frequency.ONCE
   */
  readonly frequency?: Ec2LaunchV2Frequency;

  /**
   * The account the script runs as
   *
   * @default Ec2LaunchV2RunAs.LOCAL_SYSTEM
   */
  readonly runAs?: Ec2LaunchV2RunAs;

  /**
   * Whether to run the script concurrently with other tasks
   *
   * When `true`, the exit code of the script (including `3010`, which
   * requests a reboot) is ignored, and later scripts, including the one that
   * sends a signal added with `addSignalOnExitCommand()`, do not wait for it.
   *
   * @default false
   */
  readonly detach?: boolean;
}

/**
 * Options for how EC2Launch v2 runs a PowerShell script
 */
export interface Ec2LaunchV2PowerShellOptions extends Ec2LaunchV2ScriptOptions {
  /**
   * Arguments passed to PowerShell (not to the script itself)
   *
   * @default - EC2Launch v2 passes `-ExecutionPolicy Unrestricted`
   */
  readonly arguments?: string[];
}

/**
 * Options when constructing UserData for Windows using the EC2Launch v2 format
 *
 * These options apply to the PowerShell script made up of the commands added
 * with `addCommands()` and the other `add*Command()` methods.
 */
export interface Ec2LaunchV2UserDataOptions extends Ec2LaunchV2PowerShellOptions {
}

/**
 * Options for a PowerShell script run by the EC2Launch v2 `executeScript` task
 */
export interface Ec2LaunchV2PowerShellScriptOptions extends Ec2LaunchV2PowerShellOptions {
  /**
   * The content of the script
   */
  readonly content: string;
}

/**
 * Options for a batch script run by the EC2Launch v2 `executeScript` task
 */
export interface Ec2LaunchV2BatchScriptOptions extends Ec2LaunchV2ScriptOptions {
  /**
   * The content of the script
   */
  readonly content: string;
}

/**
 * Options for the EC2Launch v2 `executeProgram` task
 */
export interface Ec2LaunchV2ExecuteProgramOptions {
  /**
   * The path of the executable to run
   */
  readonly path: string;

  /**
   * Arguments passed to the program
   *
   * @default - no arguments
   */
  readonly arguments?: string[];

  /**
   * How often the program runs
   *
   * @default Ec2LaunchV2Frequency.ONCE
   */
  readonly frequency?: Ec2LaunchV2Frequency;
}

/**
 * Options for the EC2Launch v2 `writeFile` task
 */
export interface Ec2LaunchV2WriteFileOptions {
  /**
   * The path of the file to write
   *
   * EC2Launch v2 does not load user data that writes to a path under
   * `C:\Windows`.
   */
  readonly destination: string;

  /**
   * The text to write to the file
   */
  readonly content: string;

  /**
   * How often the file is written
   *
   * @default Ec2LaunchV2Frequency.ONCE
   */
  readonly frequency?: Ec2LaunchV2Frequency;
}

/**
 * A device for the EC2Launch v2 `initializeVolume` task to initialize
 */
export interface Ec2LaunchV2VolumeDevice {
  /**
   * The device name, as specified when the volume was attached
   *
   * For example `xvdb`, `xvdf` or `/dev/nvme0n1`.
   */
  readonly device: string;

  /**
   * The drive letter to assign to the volume
   *
   * @default - Windows assigns a drive letter
   */
  readonly letter?: string;

  /**
   * The volume label
   *
   * @default - no label, or `Temporary Storage Z` for instance store volumes
   */
  readonly name?: string;

  /**
   * The partition type to create
   *
   * @default - MBR for volumes smaller than 2 TB, GPT otherwise
   */
  readonly partition?: Ec2LaunchV2PartitionType;
}

/**
 * Options for the EC2Launch v2 `initializeVolume` task
 */
export interface Ec2LaunchV2InitializeVolumeOptions {
  /**
   * The devices to initialize
   *
   * @default - all empty volumes attached to the instance are initialized
   */
  readonly devices?: Ec2LaunchV2VolumeDevice[];
}

/**
 * Options for the EC2Launch v2 `setHostName` task
 */
export interface Ec2LaunchV2HostNameOptions {
  /**
   * The host name to set
   *
   * At most 15 characters, containing only letters, digits and hyphens,
   * and not only digits.
   *
   * @default - a host name derived from the private IPv4 address
   */
  readonly hostName?: string;

  /**
   * Whether the instance may reboot when the host name is changed
   *
   * @default false
   */
  readonly reboot?: boolean;
}

/**
 * The instance tags that the EC2Launch v2 `setWallpaper` task displays
 */
export class Ec2LaunchV2WallpaperTags {
  /**
   * Display all instance tags
   */
  public static all(): Ec2LaunchV2WallpaperTags {
    return new Ec2LaunchV2WallpaperTags('AllTags');
  }

  /**
   * Display the instance tags with the given names
   */
  public static of(...tagNames: string[]): Ec2LaunchV2WallpaperTags {
    if (tagNames.length === 0) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2WallpaperTagsEmpty`, 'at least one tag name must be given, use Ec2LaunchV2WallpaperTags.all() to display all tags');
    }
    return new Ec2LaunchV2WallpaperTags(tagNames);
  }

  /** @internal */
  public readonly _value: string | string[];

  private constructor(value: string | string[]) {
    this._value = value;
  }
}

/**
 * Options for the EC2Launch v2 `setWallpaper` task
 */
export interface Ec2LaunchV2WallpaperOptions {
  /**
   * The path of a local .jpg file to use as wallpaper background
   *
   * @default 'C:\\ProgramData\\Amazon\\EC2Launch\\wallpaper\\Ec2Wallpaper.jpg'
   */
  readonly path?: string;

  /**
   * The instance attributes to display on the wallpaper
   *
   * @default - no attributes
   */
  readonly attributes?: Ec2LaunchV2WallpaperAttribute[];

  /**
   * The instance tags to display on the wallpaper
   *
   * Requires instance tags in instance metadata to be enabled.
   *
   * @default - no tags
   */
  readonly instanceTags?: Ec2LaunchV2WallpaperTags;
}

/**
 * Options for the EC2Launch v2 `sysprep` task
 */
export interface Ec2LaunchV2SysprepOptions {
  /**
   * Whether to clean the instance logs before running Sysprep
   *
   * @default false
   */
  readonly clean?: boolean;

  /**
   * Whether to shut down the instance after running Sysprep
   *
   * @default false
   */
  readonly shutdown?: boolean;
}

/**
 * A task for EC2Launch v2 to run as part of user data
 *
 * The factory methods cover the tasks that EC2Launch v2 allows in the
 * `UserData` stage. Use `Ec2LaunchV2Task.custom()` for tasks not covered here.
 *
 * Each factory method is named after the task it produces, except
 * `hostName()` (the `setHostName` task) and `wallpaper()` (the `setWallpaper`
 * task): jsii does not allow method names starting with `set` that take one
 * argument, as they conflict with Java property setters.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html
 */
export class Ec2LaunchV2Task {
  /**
   * Run a PowerShell script (the `executeScript` task)
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-executescript
   */
  public static executePowerShell(options: Ec2LaunchV2PowerShellScriptOptions): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('executeScript', [renderEc2LaunchV2Script(options, 'powershell', options.content, options.arguments)]);
  }

  /**
   * Run a batch (cmd.exe) script (the `executeScript` task)
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-executescript
   */
  public static executeBatch(options: Ec2LaunchV2BatchScriptOptions): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('executeScript', [renderEc2LaunchV2Script(options, 'batch', options.content, undefined)]);
  }

  /**
   * Run an executable
   *
   * The program always runs as the local system account.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-executeprogram
   */
  public static executeProgram(options: Ec2LaunchV2ExecuteProgramOptions): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('executeProgram', [{
      frequency: options.frequency ?? Ec2LaunchV2Frequency.ONCE,
      path: options.path,
      arguments: options.arguments,
      runAs: Ec2LaunchV2RunAs.LOCAL_SYSTEM,
    }]);
  }

  /**
   * Write a file
   *
   * EC2Launch v2 (tested with version 2.5.2) does not load user data that
   * writes to a path under `C:\Windows`, so such destinations are rejected.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2-launch-v2-writefile
   */
  public static writeFile(options: Ec2LaunchV2WriteFileOptions): Ec2LaunchV2Task {
    // EC2Launch v2 matches the path case-insensitively, and with either kind of slash
    if (!Token.isUnresolved(options.destination) && /^c:[\\/]+windows(?:[\\/]|$)/i.test(options.destination)) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2WriteFileWindowsDirectory`, `destination must not be under C:\\Windows, EC2Launch v2 does not load user data that writes there, got ${JSON.stringify(options.destination)}`);
    }
    return new Ec2LaunchV2Task('writeFile', [{
      frequency: options.frequency ?? Ec2LaunchV2Frequency.ONCE,
      destination: options.destination,
      content: options.content,
    }]);
  }

  /**
   * Initialize, partition and format empty volumes attached to the instance
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-initializevolume
   */
  public static initializeVolume(options: Ec2LaunchV2InitializeVolumeOptions = {}): Ec2LaunchV2Task {
    const devices = options.devices;
    if (devices === undefined) {
      return new Ec2LaunchV2Task('initializeVolume', { initialize: 'all' });
    }
    if (devices.length === 0) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2InitializeVolumeNoDevices`, 'devices must not be empty, omit devices to initialize all empty volumes');
    }
    for (const device of devices) {
      if (device.letter !== undefined && !Token.isUnresolved(device.letter) && !/^[A-Za-z]$/.test(device.letter)) {
        throw new UnscopedValidationError(lit`Ec2LaunchV2InvalidDriveLetter`, `drive letter must be a single letter, got ${JSON.stringify(device.letter)}`);
      }
    }
    return new Ec2LaunchV2Task('initializeVolume', {
      initialize: 'devices',
      devices: devices.map(d => ({ device: d.device, name: d.name, letter: d.letter, partition: d.partition })),
    });
  }

  /**
   * Set the host name of the instance (the `setHostName` task)
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-sethostname
   */
  public static hostName(options: Ec2LaunchV2HostNameOptions = {}): Ec2LaunchV2Task {
    const hostName = options.hostName;
    if (hostName !== undefined && !Token.isUnresolved(hostName)
      && (hostName.length > 15 || !/^[A-Za-z0-9-]+$/.test(hostName) || /^[0-9]+$/.test(hostName))) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2InvalidHostName`, `host name must be at most 15 characters, contain only letters, digits and hyphens, and not only digits, got ${JSON.stringify(hostName)}`);
    }
    return new Ec2LaunchV2Task('setHostName', { hostName, reboot: options.reboot ?? false });
  }

  /**
   * Set a wallpaper that displays instance information (the `setWallpaper` task)
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-setwallpaper
   */
  public static wallpaper(options: Ec2LaunchV2WallpaperOptions = {}): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('setWallpaper', {
      path: options.path ?? 'C:\\ProgramData\\Amazon\\EC2Launch\\wallpaper\\Ec2Wallpaper.jpg',
      attributes: options.attributes?.map(attribute => attribute.name),
      instanceTags: options.instanceTags?._value,
    });
  }

  /**
   * Run Sysprep after all other tasks have completed
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-task-sysprep
   */
  public static sysprep(options: Ec2LaunchV2SysprepOptions = {}): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('sysprep', { clean: options.clean ?? false, shutdown: options.shutdown ?? false });
  }

  /**
   * Enable jumbo frames (9001 MTU) on the network adapter
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-enablejumboframes
   */
  public static enableJumboFrames(): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('enableJumboFrames', undefined);
  }

  /**
   * Enable OpenSSH and add the instance key pair's public key to the authorized keys
   *
   * Requires Windows Server 2019 or later.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-enableopenssh
   */
  public static enableOpenSsh(): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('enableOpenSsh', undefined);
  }

  /**
   * Optimize ENA settings for the instance type
   *
   * This might reboot the instance.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-optimizeena
   */
  public static optimizeEna(): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('optimizeEna', undefined);
  }

  /**
   * Start the Systems Manager agent service
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-task-definitions.html#ec2launch-v2-startssm
   */
  public static startSsm(): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task('startSsm', undefined);
  }

  /**
   * A task not otherwise supported by this class
   *
   * `inputs` is rendered into the YAML document unchanged, except that
   * properties set to `undefined` are omitted, and tokens are rendered as
   * strings. Lists cannot be tokens, and strings containing tokens follow the
   * same single-line rules as other task inputs (see the module README).
   * If `inputs` is a list, adding the same task again appends to that list,
   * like `executeScript`, `executeProgram` and `writeFile`.
   *
   * @param taskName the name of the task, for example `executeScript`
   * @param inputs the inputs of the task, or omit for a task without inputs
   */
  public static custom(taskName: string, inputs?: any): Ec2LaunchV2Task {
    return new Ec2LaunchV2Task(taskName, inputs);
  }

  /**
   * The name of the task
   */
  public readonly taskName: string;

  /** @internal */
  public readonly _inputs: any;

  private constructor(taskName: string, inputs: any) {
    this.taskName = taskName;
    this._inputs = normalizeEc2LaunchV2Value(inputs);
  }
}

/**
 * Render a single `executeScript` input
 */
function renderEc2LaunchV2Script(options: Ec2LaunchV2ScriptOptions, type: 'powershell' | 'batch', content: string, args: string[] | undefined) {
  return {
    frequency: options.frequency ?? Ec2LaunchV2Frequency.ONCE,
    type,
    runAs: options.runAs ?? Ec2LaunchV2RunAs.LOCAL_SYSTEM,
    detach: options.detach,
    arguments: args,
    content,
  };
}

/**
 * The EC2Launch v2 task that runs the commands added with `addCommands()`
 */
const COMMAND_SCRIPT_TASK = 'executeScript';

/**
 * Windows Instance User Data in the EC2Launch v2 YAML format
 *
 * EC2Launch v2 allows each task only once in user data. Tasks run in the order
 * they were first added, except that the `executeScript` task, which runs all
 * scripts, runs after all other tasks. The commands added with `addCommands()`
 * and the other `add*Command()` methods form a single PowerShell script, the
 * last input of that task, so a CloudFormation signal added with
 * `addSignalOnExitCommand()` is sent after all other tasks have run, as with
 * `UserData.forWindows()`. Scripts added with `detach: true` are the
 * exception: they run concurrently, so the signal does not wait for them to
 * finish. EC2Launch v2 always runs `sysprep` last.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2launch-v2-settings.html#ec2launch-v2-schema-user-data
 */
export class Ec2LaunchV2UserData extends UserData {
  private readonly lines: string[] = [];
  private readonly onExitLines: string[] = [];
  /**
   * Task inputs by task name, in the order the tasks were first added
   */
  private readonly tasks = new Map<string, any>();
  private hasCommandScript = false;

  constructor(private readonly options: Ec2LaunchV2UserDataOptions = {}) {
    super();
  }

  /**
   * Add an EC2Launch v2 task to the user data
   *
   * Adding a task whose inputs are a list (`executeScript`, `executeProgram`,
   * `writeFile`) again appends to its inputs. Adding a task without inputs again has no
   * effect. Adding any other task again throws an error.
   */
  public addTask(task: Ec2LaunchV2Task): void {
    this.mergeTask(task.taskName, task._inputs);
  }

  public addCommands(...commands: string[]): void {
    this.ensureCommandScript();
    this.lines.push(...commands);
  }

  public addOnExitCommands(...commands: string[]): void {
    this.ensureCommandScript();
    this.onExitLines.push(...commands);
  }

  public render(): string {
    const tasks: any[] = [];
    const addRendered = (task: string, inputs: any) => {
      if (Array.isArray(inputs)) {
        const rendered = inputs.filter(input => input !== undefined);
        if (rendered.length > 0) {
          tasks.push({ task, inputs: rendered });
        }
      } else {
        tasks.push(inputs === undefined ? { task } : { task, inputs });
      }
    };
    for (const [task, inputs] of this.tasks) {
      if (task !== COMMAND_SCRIPT_TASK) {
        addRendered(task, inputs);
      }
    }
    // Scripts run after all other tasks, and the command script, which may
    // send the CloudFormation signal, is the last of them
    if (this.tasks.has(COMMAND_SCRIPT_TASK)) {
      const scripts = this.tasks.get(COMMAND_SCRIPT_TASK);
      addRendered(COMMAND_SCRIPT_TASK, Array.isArray(scripts)
        ? [...scripts, ...(this.hasCommandScript ? [this.renderCommandScript()] : [])]
        : scripts);
    }
    return renderEc2LaunchV2Yaml({ version: 1.1, tasks });
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    const download = powershellS3DownloadCommands(params);
    this.addCommands(...download.commands);
    return download.localPath;
  }

  public addExecuteFileCommand(params: ExecuteFileOptions): void {
    this.addCommands(...powershellExecuteFileCommands(params));
  }

  public addSignalOnExitCommand(resource: Resource): void {
    this.addOnExitCommands(powershellSignalCommand(resource));
  }

  private ensureCommandScript() {
    if (!this.hasCommandScript) {
      // Registers the task, or fails if it was added with inputs that are not a list
      this.mergeTask(COMMAND_SCRIPT_TASK, []);
      this.hasCommandScript = true;
    }
  }

  private renderCommandScript() {
    if (this.lines.length === 0 && this.onExitLines.length === 0) {
      return undefined;
    }
    // On-exit commands run when the commands complete or throw, but not on an
    // explicit `exit`: that may be a failure, or `exit 3010`, which makes
    // EC2Launch v2 reboot and run the script again.
    const content = this.onExitLines.length === 0
      ? this.lines
      : [
        '$success = $true',
        '$finished = $false',
        'try {',
        ...this.lines,
        '$finished = $true',
        '} catch {',
        '$success = $false',
        '$finished = $true',
        'throw',
        '} finally {',
        'if ($finished) {',
        ...this.onExitLines,
        '}',
        '}',
      ];
    return renderEc2LaunchV2Script(this.options, 'powershell', content.join('\n'), this.options.arguments);
  }

  private mergeTask(task: string, inputs: any) {
    if (!this.tasks.has(task)) {
      this.tasks.set(task, Array.isArray(inputs) ? [...inputs] : inputs);
      return;
    }
    const existing = this.tasks.get(task);
    if (Array.isArray(existing) && Array.isArray(inputs)) {
      existing.push(...inputs);
    } else if (existing !== undefined || inputs !== undefined) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2DuplicateTask`, `task ${JSON.stringify(task)} has already been added, EC2Launch v2 allows each task only once in user data`);
    }
  }
}

/**
 * Options when creating `MultipartBody`.
 */
export interface MultipartBodyOptions {

  /**
   * `Content-Type` header of this part.
   *
   * Some examples of content types:
   * * `text/x-shellscript; charset="utf-8"` (shell script)
   * * `text/cloud-boothook; charset="utf-8"` (shell script executed during boot phase)
   *
   * For Linux shell scripts use `text/x-shellscript`.
   */
  readonly contentType: string;

  /**
   * `Content-Transfer-Encoding` header specifying part encoding.
   *
   * @default undefined - body is not encoded
   */
  readonly transferEncoding?: string;

  /**
   * The body of message.
   *
   * @default undefined - body will not be added to part
   */
  readonly body?: string;
}

/**
 * The base class for all classes which can be used as `MultipartUserData`.
 */
export abstract class MultipartBody {
  /**
   * Content type for shell scripts
   */
  public static readonly SHELL_SCRIPT = 'text/x-shellscript; charset="utf-8"';

  /**
   * Content type for boot hooks
   */
  public static readonly CLOUD_BOOTHOOK = 'text/cloud-boothook; charset="utf-8"';

  /**
   * Constructs the new `MultipartBody` wrapping existing `UserData`. Modification to `UserData` are reflected
   * in subsequent renders of the part.
   *
   * For more information about content types see `MultipartBodyOptions.contentType`.
   *
   * @param userData user data to wrap into body part
   * @param contentType optional content type, if default one should not be used
   */
  public static fromUserData(userData: UserData, contentType?: string): MultipartBody {
    return new MultipartBodyUserDataWrapper(userData, contentType);
  }

  /**
   * Constructs the raw `MultipartBody` using specified body, content type and transfer encoding.
   *
   * When transfer encoding is specified (typically as Base64), it's caller responsibility to convert body to
   * Base64 either by wrapping with `Fn.base64` or by converting it by other converters.
   */
  public static fromRawBody(opts: MultipartBodyOptions): MultipartBody {
    return new MultipartBodyRaw(opts);
  }

  public constructor() {
  }

  /**
   * Render body part as the string.
   *
   * Subclasses should not add leading nor trailing new line characters (\r \n)
   */
  public abstract renderBodyPart(): string[];
}

/**
 * The raw part of multi-part user data, which can be added to `MultipartUserData`.
 */
class MultipartBodyRaw extends MultipartBody {
  public constructor(private readonly props: MultipartBodyOptions) {
    super();
  }

  /**
   * Render body part as the string.
   */
  public renderBodyPart(): string[] {
    const result: string[] = [];

    result.push(`Content-Type: ${this.props.contentType}`);

    if (this.props.transferEncoding != null) {
      result.push(`Content-Transfer-Encoding: ${this.props.transferEncoding}`);
    }
    // One line free after separator
    result.push('');

    if (this.props.body != null) {
      result.push(this.props.body);
      // The new line added after join will be consumed by encapsulating or closing boundary
    }

    return result;
  }
}

/**
 * Wrapper for `UserData`.
 */
class MultipartBodyUserDataWrapper extends MultipartBody {
  private readonly contentType: string;

  public constructor(private readonly userData: UserData, contentType?: string) {
    super();

    this.contentType = contentType || MultipartBody.SHELL_SCRIPT;
  }

  /**
   * Render body part as the string.
   */
  public renderBodyPart(): string[] {
    const result: string[] = [];

    result.push(`Content-Type: ${this.contentType}`);
    result.push('Content-Transfer-Encoding: base64');
    result.push('');
    result.push(Fn.base64(this.userData.render()));

    return result;
  }
}

/**
 * Options for creating `MultipartUserData`
 */
export interface MultipartUserDataOptions {
  /**
   * The string used to separate parts in multipart user data archive (it's like MIME boundary).
   *
   * This string should contain [a-zA-Z0-9()+,-./:=?] characters only, and should not be present in any part, or in text content of archive.
   *
   * @default `+AWS+CDK+User+Data+Separator==`
   */
  readonly partsSeparator?: string;
}

/**
 * Mime multipart user data.
 *
 * This class represents MIME multipart user data, as described in.
 * [Specifying Multiple User Data Blocks Using a MIME Multi Part Archive](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bootstrap_container_instance.html#multi-part_user_data)
 *
 */
export class MultipartUserData extends UserData {
  private static readonly USE_PART_ERROR = 'MultipartUserData only supports this operation if it has a default UserData. Call addUserDataPart with makeDefault=true.';
  private static readonly BOUNDRY_PATTERN = '[^a-zA-Z0-9()+,-./:=?]';

  private parts: MultipartBody[] = [];

  private opts: MultipartUserDataOptions;

  private defaultUserData?: UserData;

  constructor(opts?: MultipartUserDataOptions) {
    super();

    let partsSeparator: string;

    // Validate separator
    if (opts?.partsSeparator != null) {
      if (new RegExp(MultipartUserData.BOUNDRY_PATTERN).test(opts!.partsSeparator)) {
        throw new UnscopedValidationError(lit`InvalidCharactersInSeparator`, `Invalid characters in separator. Separator has to match pattern ${MultipartUserData.BOUNDRY_PATTERN}`);
      } else {
        partsSeparator = opts!.partsSeparator;
      }
    } else {
      partsSeparator = '+AWS+CDK+User+Data+Separator==';
    }

    this.opts = {
      partsSeparator: partsSeparator,
    };
  }

  /**
   * Adds a part to the list of parts.
   */
  public addPart(part: MultipartBody) {
    this.parts.push(part);
  }

  /**
   * Adds a multipart part based on a UserData object.
   *
   * If `makeDefault` is true, then the UserData added by this method
   * will also be the target of calls to the `add*Command` methods on
   * this MultipartUserData object.
   *
   * If `makeDefault` is false, then this is the same as calling:
   *
   * ```ts
   * declare const multiPart: ec2.MultipartUserData;
   * declare const userData: ec2.UserData;
   * declare const contentType: string;
   *
   * multiPart.addPart(ec2.MultipartBody.fromUserData(userData, contentType));
   * ```
   *
   * An undefined `makeDefault` defaults to either:
   * - `true` if no default UserData has been set yet; or
   * - `false` if there is no default UserData set.
   */
  public addUserDataPart(userData: UserData, contentType?: string, makeDefault?: boolean) {
    this.addPart(MultipartBody.fromUserData(userData, contentType));
    makeDefault = makeDefault ?? (this.defaultUserData === undefined ? true : false);
    if (makeDefault) {
      this.defaultUserData = userData;
    }
  }

  public render(): string {
    const boundary = this.opts.partsSeparator;
    // Now build final MIME archive - there are few changes from MIME message which are accepted by cloud-init:
    // - MIME RFC uses CRLF to separate lines - cloud-init is fine with LF \n only
    // Note: new lines matters, matters a lot.
    var resultArchive = new Array<string>();
    resultArchive.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    resultArchive.push('MIME-Version: 1.0');

    // Add new line, the next one will be boundary (encapsulating or closing)
    // so this line will count into it.
    resultArchive.push('');

    // Add parts - each part starts with boundary
    this.parts.forEach(part => {
      resultArchive.push(`--${boundary}`);
      resultArchive.push(...part.renderBodyPart());
    });

    // Add closing boundary
    resultArchive.push(`--${boundary}--`);
    resultArchive.push(''); // Force new line at the end

    return resultArchive.join('\n');
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    if (this.defaultUserData) {
      return this.defaultUserData.addS3DownloadCommand(params);
    } else {
      throw new UnscopedValidationError(lit`MultipartUserDataRequiresDefaultUserData`, MultipartUserData.USE_PART_ERROR);
    }
  }

  public addExecuteFileCommand(params: ExecuteFileOptions): void {
    if (this.defaultUserData) {
      this.defaultUserData.addExecuteFileCommand(params);
    } else {
      throw new UnscopedValidationError(lit`MultipartUserDataRequiresDefaultUserData`, MultipartUserData.USE_PART_ERROR);
    }
  }

  public addSignalOnExitCommand(resource: Resource): void {
    if (this.defaultUserData) {
      this.defaultUserData.addSignalOnExitCommand(resource);
    } else {
      throw new UnscopedValidationError(lit`MultipartUserDataRequiresDefaultUserData`, MultipartUserData.USE_PART_ERROR);
    }
  }

  public addCommands(...commands: string[]): void {
    if (this.defaultUserData) {
      this.defaultUserData.addCommands(...commands);
    } else {
      throw new UnscopedValidationError(lit`MultipartUserDataRequiresDefaultUserData`, MultipartUserData.USE_PART_ERROR);
    }
  }

  public addOnExitCommands(...commands: string[]): void {
    if (this.defaultUserData) {
      this.defaultUserData.addOnExitCommands(...commands);
    } else {
      throw new UnscopedValidationError(lit`MultipartUserDataRequiresDefaultUserData`, MultipartUserData.USE_PART_ERROR);
    }
  }
}
