import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Duration } from '@aws-cdk/core';
import { InitBindOptions, InitElementConfig, InitPlatform } from './private/cfn-init-internal';
/**
 * An object that represents reasons to restart an InitService
 *
 * Pass an instance of this object to the `InitFile`, `InitCommand`,
 * `InitSource` and `InitPackage` objects, and finally to an `InitService`
 * itself to cause the actions (files, commands, sources, and packages)
 * to trigger a restart of the service.
 *
 * For example, the following will run a custom command to install Nginx,
 * and trigger the nginx service to be restarted after the command has run.
 *
 * ```ts
 * const handle = new ec2.InitServiceRestartHandle();
 * ec2.CloudFormationInit.fromElements(
 *   ec2.InitCommand.shellCommand('/usr/bin/custom-nginx-install.sh', { serviceRestartHandles: [handle] }),
 *   ec2.InitService.enable('nginx', { serviceRestartHandle: handle }),
 * );
 * ```
 */
export declare class InitServiceRestartHandle {
    private readonly commands;
    private readonly files;
    private readonly sources;
    private readonly packages;
    /**
     * Add a command key to the restart set
     * @internal
     */
    _addCommand(key: string): number;
    /**
     * Add a file key to the restart set
     * @internal
     */
    _addFile(key: string): number;
    /**
     * Add a source key to the restart set
     * @internal
     */
    _addSource(key: string): number;
    /**
     * Add a package key to the restart set
     * @internal
     */
    _addPackage(packageType: string, key: string): void;
    /**
     * Render the restart handles for use in an InitService declaration
     * @internal
     */
    _renderRestartHandles(): any;
}
/**
 * Base class for all CloudFormation Init elements
 */
export declare abstract class InitElement {
    /**
     * Returns the init element type for this element.
     */
    abstract readonly elementType: string;
    /**
     * Called when the Init config is being consumed. Renders the CloudFormation
     * representation of this init element, and calculates any authentication
     * properties needed, if any.
     *
     * @param options bind options for the element.
     * @internal
     */
    abstract _bind(options: InitBindOptions): InitElementConfig;
}
/**
 * Options for InitCommand
 */
export interface InitCommandOptions {
    /**
     * Identifier key for this command
     *
     * Commands are executed in lexicographical order of their key names.
     *
     * @default - Automatically generated based on index
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
     * If the test passes (exits with error code of 0), the command is run.
     *
     * @default - Always run the command
     */
    readonly testCmd?: string;
    /**
     * Continue running if this command fails
     *
     * @default false
     */
    readonly ignoreErrors?: boolean;
    /**
     * The duration to wait after a command has finished in case the command causes a reboot.
     *
     * Set this value to `InitCommandWaitDuration.none()` if you do not want to wait for every command;
     * `InitCommandWaitDuration.forever()` directs cfn-init to exit and resume only after the reboot is complete.
     *
     * For Windows systems only.
     *
     * @default - 60 seconds
     */
    readonly waitAfterCompletion?: InitCommandWaitDuration;
    /**
     * Restart the given service(s) after this command has run
     *
     * @default - Do not restart any service
     */
    readonly serviceRestartHandles?: InitServiceRestartHandle[];
}
/**
 * Represents a duration to wait after a command has finished, in case of a reboot (Windows only).
 */
export declare abstract class InitCommandWaitDuration {
    /** Wait for a specified duration after a command. */
    static of(duration: Duration): InitCommandWaitDuration;
    /** Do not wait for this command. */
    static none(): InitCommandWaitDuration;
    /** cfn-init will exit and resume only after a reboot. */
    static forever(): InitCommandWaitDuration;
    /**
     * Render to a CloudFormation value.
     * @internal
     */
    abstract _render(): any;
}
/**
 * Command to execute on the instance
 */
export declare class InitCommand extends InitElement {
    private readonly command;
    private readonly options;
    /**
     * Run a shell command
     *
     * Remember that some characters like `&`, `|`, `;`, `>` etc. have special meaning in a shell and
     * need to be preceded by a `\` if you want to treat them as part of a filename.
     */
    static shellCommand(shellCommand: string, options?: InitCommandOptions): InitCommand;
    /**
     * Run a command from an argv array
     *
     * You do not need to escape space characters or enclose command parameters in quotes.
     */
    static argvCommand(argv: string[], options?: InitCommandOptions): InitCommand;
    readonly elementType: string;
    private constructor();
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
}
/**
 * Options for InitFile
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
export declare abstract class InitFile extends InitElement {
    private readonly fileName;
    private readonly options;
    /**
     * Use a literal string as the file content
     */
    static fromString(fileName: string, content: string, options?: InitFileOptions): InitFile;
    /**
     * Write a symlink with the given symlink target
     */
    static symlink(fileName: string, target: string, options?: InitFileOptions): InitFile;
    /**
     * Use a JSON-compatible object as the file content, write it to a JSON file.
     *
     * May contain tokens.
     */
    static fromObject(fileName: string, obj: Record<string, any>, options?: InitFileOptions): InitFile;
    /**
     * Read a file from disk and use its contents
     *
     * The file will be embedded in the template, so care should be taken to not
     * exceed the template size.
     *
     * If options.base64encoded is set to true, this will base64-encode the file's contents.
     */
    static fromFileInline(targetFileName: string, sourceFileName: string, options?: InitFileOptions): InitFile;
    /**
     * Download from a URL at instance startup time
     */
    static fromUrl(fileName: string, url: string, options?: InitFileOptions): InitFile;
    /**
     * Download a file from an S3 bucket at instance startup time
     */
    static fromS3Object(fileName: string, bucket: s3.IBucket, key: string, options?: InitFileOptions): InitFile;
    /**
     * Create an asset from the given file
     *
     * This is appropriate for files that are too large to embed into the template.
     */
    static fromAsset(targetFileName: string, path: string, options?: InitFileAssetOptions): InitFile;
    /**
     * Use a file from an asset at instance startup time
     */
    static fromExistingAsset(targetFileName: string, asset: s3_assets.Asset, options?: InitFileOptions): InitFile;
    readonly elementType: string;
    protected constructor(fileName: string, options: InitFileOptions);
    /** @internal */
    _bind(bindOptions: InitBindOptions): InitElementConfig;
    /**
     * Perform the actual bind and render
     *
     * This is in a second method so the superclass can guarantee that
     * the common work of registering into serviceHandles cannot be forgotten.
     * @internal
     */
    protected abstract _doBind(options: InitBindOptions): InitElementConfig;
    /**
     * Render the standard config block, given content vars
     * @internal
     */
    protected _standardConfig(fileOptions: InitFileOptions, platform: InitPlatform, contentVars: Record<string, any>): Record<string, any>;
}
/**
 * Create Linux/UNIX groups and assign group IDs.
 *
 * Not supported for Windows systems.
 */
export declare class InitGroup extends InitElement {
    private groupName;
    private groupId?;
    /**
     * Create a group from its name, and optionally, group id
     */
    static fromName(groupName: string, groupId?: number): InitGroup;
    readonly elementType: string;
    protected constructor(groupName: string, groupId?: number | undefined);
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
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
export declare class InitUser extends InitElement {
    private readonly userName;
    private readonly userOptions;
    /**
     * Create a user from user name.
     */
    static fromName(userName: string, options?: InitUserOptions): InitUser;
    readonly elementType: string;
    protected constructor(userName: string, userOptions: InitUserOptions);
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
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
export declare class InitPackage extends InitElement {
    private readonly type;
    private readonly versions;
    private readonly packageName?;
    private readonly serviceHandles?;
    /**
     * Install an RPM from an HTTP URL or a location on disk
     */
    static rpm(location: string, options?: LocationPackageOptions): InitPackage;
    /**
     * Install a package using Yum
     */
    static yum(packageName: string, options?: NamedPackageOptions): InitPackage;
    /**
     * Install a package from RubyGems
     */
    static rubyGem(gemName: string, options?: NamedPackageOptions): InitPackage;
    /**
     * Install a package from PyPI
     */
    static python(packageName: string, options?: NamedPackageOptions): InitPackage;
    /**
     * Install a package using APT
     */
    static apt(packageName: string, options?: NamedPackageOptions): InitPackage;
    /**
     * Install an MSI package from an HTTP URL or a location on disk
     */
    static msi(location: string, options?: LocationPackageOptions): InitPackage;
    readonly elementType: string;
    protected constructor(type: string, versions: string[], packageName?: string | undefined, serviceHandles?: InitServiceRestartHandle[] | undefined);
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
    protected renderPackageVersions(): any;
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
export declare class InitService extends InitElement {
    private readonly serviceName;
    private readonly serviceOptions;
    /**
     * Enable and start the given service, optionally restarting it
     */
    static enable(serviceName: string, options?: InitServiceOptions): InitService;
    /**
     * Disable and stop the given service
     */
    static disable(serviceName: string): InitService;
    readonly elementType: string;
    private constructor();
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
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
export declare abstract class InitSource extends InitElement {
    private readonly targetDirectory;
    private readonly serviceHandles?;
    /**
     * Retrieve a URL and extract it into the given directory
     */
    static fromUrl(targetDirectory: string, url: string, options?: InitSourceOptions): InitSource;
    /**
     * Extract a GitHub branch into a given directory
     */
    static fromGitHub(targetDirectory: string, owner: string, repo: string, refSpec?: string, options?: InitSourceOptions): InitSource;
    /**
     * Extract an archive stored in an S3 bucket into the given directory
     */
    static fromS3Object(targetDirectory: string, bucket: s3.IBucket, key: string, options?: InitSourceOptions): InitSource;
    /**
     * Create an InitSource from an asset created from the given path.
     */
    static fromAsset(targetDirectory: string, path: string, options?: InitSourceAssetOptions): InitSource;
    /**
     * Extract a directory from an existing directory asset.
     */
    static fromExistingAsset(targetDirectory: string, asset: s3_assets.Asset, options?: InitSourceOptions): InitSource;
    readonly elementType: string;
    protected constructor(targetDirectory: string, serviceHandles?: InitServiceRestartHandle[] | undefined);
    /** @internal */
    _bind(options: InitBindOptions): InitElementConfig;
    /**
     * Perform the actual bind and render
     *
     * This is in a second method so the superclass can guarantee that
     * the common work of registering into serviceHandles cannot be forgotten.
     * @internal
     */
    protected abstract _doBind(options: InitBindOptions): InitElementConfig;
}
