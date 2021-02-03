import { IBucket } from '@aws-cdk/aws-s3';
import { CfnElement, Resource, Stack } from '@aws-cdk/core';
import { OperatingSystemType } from './machine-image';

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
 * Options when downloading files from S3
 */
export interface S3DownloadOptions {

  /**
   * Name of the S3 bucket to download from
   */
  readonly bucket: IBucket;

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
  public static forWindows(): UserData {
    return new WindowsUserData();
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
      case OperatingSystemType.UNKNOWN: throw new Error('Cannot determine UserData for unknown operating system type');
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
    const shebang = this.props.shebang !== undefined ? this.props.shebang : '#!/bin/bash';
    return [shebang, ...(this.renderOnExitLines()), ...this.lines].join('\n');
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    const s3Path = `s3://${params.bucket.bucketName}/${params.bucketKey}`;
    const localPath = ( params.localFile && params.localFile.length !== 0 ) ? params.localFile : `/tmp/${ params.bucketKey }`;
    this.addCommands(
      `mkdir -p $(dirname '${localPath}')`,
      `aws s3 cp '${s3Path}' '${localPath}'`,
    );

    return localPath;
  }

  public addExecuteFileCommand( params: ExecuteFileOptions): void {
    this.addCommands(
      'set -e',
      `chmod +x '${params.filePath}'`,
      `'${params.filePath}' ${params.arguments ?? ''}`.trim(),
    );
  }

  public addSignalOnExitCommand( resource: Resource ): void {
    const stack = Stack.of(resource);
    const resourceID = stack.getLogicalId(resource.node.defaultChild as CfnElement);
    this.addOnExitCommands(`/opt/aws/bin/cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} -e $exitCode || echo 'Failed to send Cloudformation Signal'`);
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

  constructor() {
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
    }</powershell>`;
  }

  public addS3DownloadCommand(params: S3DownloadOptions): string {
    const localPath = ( params.localFile && params.localFile.length !== 0 ) ? params.localFile : `C:/temp/${ params.bucketKey }`;
    this.addCommands(
      `mkdir (Split-Path -Path '${localPath}' ) -ea 0`,
      `Read-S3Object -BucketName '${params.bucket.bucketName}' -key '${params.bucketKey}' -file '${localPath}' -ErrorAction Stop`,
    );
    return localPath;
  }

  public addExecuteFileCommand( params: ExecuteFileOptions): void {
    this.addCommands(
      `&'${params.filePath}' ${params.arguments ?? ''}`.trim(),
      `if (!$?) { Write-Error 'Failed to execute the file "${params.filePath}"' -ErrorAction Stop }`,
    );
  }

  public addSignalOnExitCommand( resource: Resource ): void {
    const stack = Stack.of(resource);
    const resourceID = stack.getLogicalId(resource.node.defaultChild as CfnElement);

    this.addOnExitCommands(`cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} --success ($success.ToString().ToLower())`);
  }

  private renderOnExitLines(): string[] {
    if ( this.onExitLines.length > 0 ) {
      return ['trap {', '$success=($PSItem.Exception.Message -eq "Success")', ...this.onExitLines, 'break', '}'];
    }
    return [];
  }
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
    throw new Error('CustomUserData does not support addOnExitCommands, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public render(): string {
    return this.lines.join('\n');
  }

  public addS3DownloadCommand(): string {
    throw new Error('CustomUserData does not support addS3DownloadCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public addExecuteFileCommand(): void {
    throw new Error('CustomUserData does not support addExecuteFileCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }

  public addSignalOnExitCommand(): void {
    throw new Error('CustomUserData does not support addSignalOnExitCommand, use UserData.forLinux() or UserData.forWindows() instead.');
  }
}
