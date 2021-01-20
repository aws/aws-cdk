import { IBucket } from '@aws-cdk/aws-s3';
import { CfnElement, Fn, Resource, Stack } from '@aws-cdk/core';
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
    const shebang = this.props.shebang ?? '#!/bin/bash';
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

/**
 * Suggested content types, however any value is allowed.
 */
export type MultipartContentType = 'text/x-shellscript; charset="utf-8"' | 'text/cloud-boothook; charset="utf-8"' | string;

/**
 * Options when creating `MultipartUserDataPart`.
 */
export interface MultipartUserDataPartOptions {

  /**
   * `Content-Type` header of this part.
   *
   * For Linux shell scripts use `text/x-shellscript`
   */
  readonly contentType: MultipartContentType;

  /**
   * `Content-Transfer-Encoding` header specifying part encoding.
   *
   * @default undefined - don't add this header
   */
  readonly transferEncoding?: string;
}

/**
 * Options when creating `MultipartUserDataPart`.
 */
export interface MultipartUserDataPartOptionsWithBody extends MultipartUserDataPartOptions {
  /**
   * The body of message.
   *
   * @default undefined - body will not be added to part
   */
  readonly body?: string,
}

/**
 * Options when creating `MultipartUserDataPartWrapper`.
 */
export interface MultipartUserDataPartWrapperOptions {
  /**
   * `Content-Type` header of this part.
   *
   * For Linux shell scripts typically it's `text/x-shellscript`.
   *
   * @default 'text/x-shellscript; charset="utf-8"'
   */
  readonly contentType?: MultipartContentType;
}

/**
 * Interface representing part of `MultipartUserData` user data.
 */
export interface IMultipart {
  /**
   * The body of this MIME part.
   */
  readonly body: string | undefined;

  /**
   * `Content-Type` header of this part.
   */
  readonly contentType: string;

  /**
   * `Content-Transfer-Encoding` header specifying part encoding.
   *
   * @default undefined - don't add this header
   */
  readonly transferEncoding?: string;
}

/**
 * The base class for all classes which can be used as {@link MultipartUserData}.
 */
export abstract class MultipartUserDataPart implements IMultipart {

  /**
   * Constructs the new `MultipartUserDataPart` wrapping existing `UserData`. Modification to `UserData` are reflected
   * in subsequent renders of the part.
   *
   * For more information about content types see `MultipartUserDataPartOptionsWithBody`
   */
  public static fromUserData(userData: UserData, opts?: MultipartUserDataPartWrapperOptions): MultipartUserDataPart {
    opts = opts || {};
    return new MultipartUserDataPartWrapper(userData, opts);
  }

  /**
   * Constructs the raw `MultipartUserDataPart` using specified body, content type and transfer encoding.
   *
   * When transfer encoding is specified (typically as Base64), it's caller responsibility to convert body to
   * Base64 either by wrapping with `Fn.base64` or by converting it by other converters.
   */
  public static fromRawBody(opts: MultipartUserDataPartOptionsWithBody): MultipartUserDataPart {
    return new MultipartUserDataPartRaw(opts);
  }

  protected static readonly DEFAULT_CONTENT_TYPE = 'text/x-shellscript; charset="utf-8"';

  /** The body of this MIME part. */
  public abstract get body(): string | undefined;

  /** `Content-Type` header of this part */
  public readonly contentType: string;

  /**
   * `Content-Transfer-Encoding` header specifying part encoding.
   *
   * @default undefined - don't add this header
   */
  public readonly transferEncoding?: string;

  public constructor(props: MultipartUserDataPartOptions) {
    this.contentType = props.contentType;
    this.transferEncoding = props.transferEncoding;
  }
}

/**
 * The raw part of multi-part user data, which can be added to {@link MultipartUserData}.
 */
class MultipartUserDataPartRaw extends MultipartUserDataPart {
  private _body : string | undefined;

  public constructor(props: MultipartUserDataPartOptionsWithBody) {
    super(props);
    this._body = props.body;
  }

  public get body(): string | undefined {
    return this._body;
  }
}

/**
 * Wrapper for `UserData`.
 */
class MultipartUserDataPartWrapper extends MultipartUserDataPart {
  public constructor(public readonly userData: UserData, opts: MultipartUserDataPartWrapperOptions) {
    super({
      contentType: opts.contentType || MultipartUserDataPart.DEFAULT_CONTENT_TYPE,
      // Force Base64 in case userData will contain UTF-8 characters
      transferEncoding: 'base64',
    });
  }

  public get body(): string {
    // Wrap rendered user data with Base64 function, in case data contains tokens
    return Fn.base64(this.userData.render());
  }
}

/**
 * Options for creating {@link MultipartUserData}
 */
export interface MultipartUserDataOptions {
  /**
   * The string used to separate parts in multipart user data archive (it's like MIME boundary).
   *
   * This string should contain [a-zA-Z0-9] characters only, and should not be present in any part, or in text content of archive.
   */
  readonly partsSeparator: string;
}

/**
 * Mime multipart user data.
 *
 * This class represents MIME multipart user data, as described in.
 * [Specifying Multiple User Data Blocks Using a MIME Multi Part Archive](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bootstrap_container_instance.html#multi-part_user_data)
 *
 */
export class MultipartUserData extends UserData {
  private static readonly USE_PART_ERROR = 'MultipartUserData does not support this operation. Please add part using addPart.';

  private parts: IMultipart[] = [];

  private opts: MultipartUserDataOptions;

  constructor(opts: MultipartUserDataOptions) {
    super();

    this.opts = {
      ...opts,
    };
  }
  /**
   * Adds existing `UserData`. Modification to `UserData` are reflected in subsequent renders of the part.
   *
   * For more information about content types see `MultipartUserDataPartOptionsWithBody`
   */
  public addUserDataPart(userData: UserData, opts?: MultipartUserDataPartWrapperOptions): this {
    this.parts.push(MultipartUserDataPart.fromUserData(userData, opts));

    return this;
  }

  /**
   * Adds the 'raw' part using provided options.
   */
  public addPart(opts: MultipartUserDataPartOptionsWithBody): this {
    this.parts.push(MultipartUserDataPart.fromRawBody(opts));

    return this;
  }

  public render(): string {
    const boundary = this.opts.partsSeparator;

    // Now build final MIME archive - there are few changes from MIME message which are accepted by cloud-init:
    // - MIME RFC uses CRLF to separate lines - cloud-init is fine with LF \n only
    var resultArchive = `Content-Type: multipart/mixed; boundary="${boundary}"\n`;
    resultArchive = resultArchive + 'MIME-Version: 1.0\n';

    // Add parts - each part starts with boundary
    this.parts.forEach(part => {
      resultArchive = resultArchive + '\n--' + boundary + '\n' + 'Content-Type: ' + part.contentType + '\n';

      if (part.transferEncoding != null) {
        resultArchive = resultArchive + `Content-Transfer-Encoding: ${part.transferEncoding}\n`;
      }

      if (part.body != null) {
        resultArchive = resultArchive + '\n' + part.body;
      }
    });

    // Add closing boundary
    resultArchive = resultArchive + `\n--${boundary}--\n`;

    return resultArchive;
  }

  public addS3DownloadCommand(_params: S3DownloadOptions): string {
    throw new Error(MultipartUserData.USE_PART_ERROR);
  }

  public addExecuteFileCommand(_params: ExecuteFileOptions): void {
    throw new Error(MultipartUserData.USE_PART_ERROR);
  }

  public addSignalOnExitCommand(_resource: Resource): void {
    throw new Error(MultipartUserData.USE_PART_ERROR);
  }

  public addCommands(..._commands: string[]): void {
    throw new Error(MultipartUserData.USE_PART_ERROR);
  }

  public addOnExitCommands(..._commands: string[]): void {
    throw new Error(MultipartUserData.USE_PART_ERROR);
  }
}
