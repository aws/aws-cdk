import { CfnElement, Resource, Stack } from "@aws-cdk/core";
import { OperatingSystemType } from "./machine-image";

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
export interface S3DownloadAndExecuteOptions {

  /**
   * Name of the bucket to download from
   */
  readonly bucketName: string;

  /**
   * The key of the file to download
   */
  readonly bucketKey: string;

  /**
   * The name of the local file.
   *
   * @default Linux   - ~/bucketKey
   *          Windows - %TEMP%/bucketKey
   */
  readonly localFile?: string;

  /**
   * The arguments to be used when executing the file
   *
   * @default no arguments.
   */
  readonly arguments?: string[]
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
   * Adds a command to download a file from S3
   */
  public abstract addDownloadAndExecuteS3FileCommand(params: S3DownloadAndExecuteOptions): void;

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
  private readonly functionsAdded = new Set<string>();

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

  public addDownloadAndExecuteS3FileCommand( params: S3DownloadAndExecuteOptions ): void {
    if (!this.functionsAdded.has('download_and_execute_s3_file')) {
      this.addCommands("download_and_execute_s3_file () {\n" +
          "local s3Path=$1;\n" +
          "local path=$2;\n" +
          "shift;shift;\n" +
          "echo \"Downloading file ${s3Path} to ${path}\";\n" +
          "mkdir -p $(dirname ${path}) ;\n" +
          "aws s3 cp ${s3Path} ${path};\n" +
          "if [ $? -ne 0 ]; then exit 1;fi;\n" +
          "chmod +x ${path};\n" +
          "if [ $? -ne 0 ]; then exit 1;fi;\n" +
          "${path} \"$@\"\n" +
          "if [ $? -ne 0 ]; then exit 1;fi;\n" +
          "}");
      this.functionsAdded.add('download_and_execute_s3_file');
    }
    let argumentStr = "";
    if ( params.arguments && params.arguments.length > 0 ) {
      argumentStr = params.arguments.map(x => this.posixEscape(x)).join(' ');
    }

    const localPath = (params.localFile && params.localFile.length !== 0) ? params.localFile : `/tmp/${ params.bucketKey }`;

    this.addCommands(`download_and_execute_s3_file \"s3://${params.bucketName}/${params.bucketKey}\" \"${localPath}\" ${argumentStr}` );
  }

  public addSignalOnExitCommand( resource: Resource ): void {
    const stack = Stack.of(resource);
    const resourceID = stack.getLogicalId(resource.node.defaultChild as CfnElement);
    this.addOnExitCommands(`/opt/aws/bin/cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} -e $exitCode || echo "Failed to send Cloudformation Signal"`);
  }

  private renderOnExitLines(): string[] {
    if ( this.onExitLines.length > 0 ) {
      return [ 'function exitTrap(){', 'exitCode=$?', ...this.onExitLines, '}', 'trap exitTrap EXIT' ];
    }
    return [];
  }

  /**
   * Escape a shell argument for POSIX shells
   *
   */
  private posixEscape(x: string) {
    // Turn ' -> '"'"'
    x = x.replace("'", "'\"'\"'");
    return `'${x}'`;
  }

}

/**
 * Windows Instance User Data
 */
class WindowsUserData extends UserData {
  private readonly lines: string[] = [];
  private readonly onExitLines: string[] = [];
  private readonly functionsAdded = new Set<string>();

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
      ...( this.onExitLines.length > 0 ? ['throw "Success"'] : [] )
    ].join('\n')
    }</powershell>`;
  }

  public addDownloadAndExecuteS3FileCommand( params: S3DownloadAndExecuteOptions ): void {
    if (!this.functionsAdded.has('download_and_execute_s3_file')) {
      this.addCommands("function download_and_execute_s3_file{\n" +
        "Param(\n" +
        "  [Parameter(Mandatory=$True)]\n" +
        "  $bucketName,\n" +
        "  [Parameter(Mandatory=$True)]\n" +
        "  $bucketKey,\n" +
        "  [Parameter(Mandatory=$True)]\n" +
        "  $localFile,\n" +
        "  [parameter(mandatory=$false,ValueFromRemainingArguments=$true)]\n" +
        "  $arguments\n" +
        ")\n" +
        "mkdir (Split-Path -Path $localFile ) -ea 0\n" +
        "Read-S3Object -BucketName $bucketName -key $bucketKey -file $localFile -ErrorAction Stop\n" +
        "&\"$localFile\" @arguments\n" +
        "if (!$?) { Write-Error 'Failed to execute file' -ErrorAction Stop }\n" +
        "}");
      this.functionsAdded.add('download_and_execute_s3_file');
    }

    const args = [
        params.bucketName,
        params.bucketKey,
        params.localFile || "C:/temp/" + params.bucketKey,
    ];
    if ( params.arguments ) {
      args.push(...params.arguments);
    }

    this.addCommands(`download_and_execute_s3_file ${ args.map(x => `'${x}'` ).join(' ') }` );
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
  private readonly onExitLines: string[] = [];

  constructor() {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addOnExitCommands(...commands: string[]): void {
    this.onExitLines.push(...commands);
  }

  public render(): string {
    return [...this.lines, ...this.onExitLines].join('\n');
  }

  public addDownloadAndExecuteS3FileCommand(): void {
    throw new Error("Method not implemented.");
  }

  public addSignalOnExitCommand( ): void {
    throw new Error("Method not implemented.");
  }
}