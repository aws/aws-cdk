"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSource = exports.InitService = exports.InitPackage = exports.InitUser = exports.InitGroup = exports.InitFile = exports.InitCommand = exports.InitCommandWaitDuration = exports.InitElement = exports.InitServiceRestartHandle = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const cfn_init_internal_1 = require("./private/cfn-init-internal");
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
class InitServiceRestartHandle {
    constructor() {
        this.commands = new Array();
        this.files = new Array();
        this.sources = new Array();
        this.packages = {};
    }
    /**
     * Add a command key to the restart set
     * @internal
     */
    _addCommand(key) {
        return this.commands.push(key);
    }
    /**
     * Add a file key to the restart set
     * @internal
     */
    _addFile(key) {
        return this.files.push(key);
    }
    /**
     * Add a source key to the restart set
     * @internal
     */
    _addSource(key) {
        return this.sources.push(key);
    }
    /**
     * Add a package key to the restart set
     * @internal
     */
    _addPackage(packageType, key) {
        if (!this.packages[packageType]) {
            this.packages[packageType] = [];
        }
        this.packages[packageType].push(key);
    }
    /**
     * Render the restart handles for use in an InitService declaration
     * @internal
     */
    _renderRestartHandles() {
        const nonEmpty = (x) => x.length > 0 ? x : undefined;
        return {
            commands: nonEmpty(this.commands),
            files: nonEmpty(this.files),
            packages: Object.keys(this.packages).length > 0 ? this.packages : undefined,
            sources: nonEmpty(this.sources),
        };
    }
}
exports.InitServiceRestartHandle = InitServiceRestartHandle;
_a = JSII_RTTI_SYMBOL_1;
InitServiceRestartHandle[_a] = { fqn: "@aws-cdk/aws-ec2.InitServiceRestartHandle", version: "0.0.0" };
/**
 * Base class for all CloudFormation Init elements
 */
class InitElement {
}
exports.InitElement = InitElement;
_b = JSII_RTTI_SYMBOL_1;
InitElement[_b] = { fqn: "@aws-cdk/aws-ec2.InitElement", version: "0.0.0" };
/**
 * Represents a duration to wait after a command has finished, in case of a reboot (Windows only).
 */
class InitCommandWaitDuration {
    /** Wait for a specified duration after a command. */
    static of(duration) {
        return new class extends InitCommandWaitDuration {
            /** @internal */
            _render() { return duration.toSeconds(); }
        }();
    }
    /** Do not wait for this command. */
    static none() {
        return InitCommandWaitDuration.of(core_1.Duration.seconds(0));
    }
    /** cfn-init will exit and resume only after a reboot. */
    static forever() {
        return new class extends InitCommandWaitDuration {
            /** @internal */
            _render() { return 'forever'; }
        }();
    }
}
exports.InitCommandWaitDuration = InitCommandWaitDuration;
_c = JSII_RTTI_SYMBOL_1;
InitCommandWaitDuration[_c] = { fqn: "@aws-cdk/aws-ec2.InitCommandWaitDuration", version: "0.0.0" };
/**
 * Command to execute on the instance
 */
class InitCommand extends InitElement {
    constructor(command, options) {
        super();
        this.command = command;
        this.options = options;
        this.elementType = cfn_init_internal_1.InitElementType.COMMAND.toString();
    }
    /**
     * Run a shell command
     *
     * Remember that some characters like `&`, `|`, `;`, `>` etc. have special meaning in a shell and
     * need to be preceded by a `\` if you want to treat them as part of a filename.
     */
    static shellCommand(shellCommand, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitCommandOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.shellCommand);
            }
            throw error;
        }
        return new InitCommand(shellCommand, options);
    }
    /**
     * Run a command from an argv array
     *
     * You do not need to escape space characters or enclose command parameters in quotes.
     */
    static argvCommand(argv, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitCommandOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.argvCommand);
            }
            throw error;
        }
        if (argv.length === 0) {
            throw new Error('Cannot define argvCommand with an empty arguments');
        }
        return new InitCommand(argv, options);
    }
    /** @internal */
    _bind(options) {
        const commandKey = this.options.key || `${options.index}`.padStart(3, '0'); // 001, 005, etc.
        if (options.platform !== cfn_init_internal_1.InitPlatform.WINDOWS && this.options.waitAfterCompletion !== undefined) {
            throw new Error(`Command '${this.command}': 'waitAfterCompletion' is only valid for Windows systems.`);
        }
        for (const handle of this.options.serviceRestartHandles ?? []) {
            handle._addCommand(commandKey);
        }
        return {
            config: {
                [commandKey]: {
                    command: this.command,
                    env: this.options.env,
                    cwd: this.options.cwd,
                    test: this.options.testCmd,
                    ignoreErrors: this.options.ignoreErrors,
                    waitAfterCompletion: this.options.waitAfterCompletion?._render(),
                },
            },
        };
    }
}
exports.InitCommand = InitCommand;
_d = JSII_RTTI_SYMBOL_1;
InitCommand[_d] = { fqn: "@aws-cdk/aws-ec2.InitCommand", version: "0.0.0" };
/**
 * Create files on the EC2 instance.
 */
class InitFile extends InitElement {
    constructor(fileName, options) {
        super();
        this.fileName = fileName;
        this.options = options;
        this.elementType = cfn_init_internal_1.InitElementType.FILE.toString();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, InitFile);
            }
            throw error;
        }
    }
    /**
     * Use a literal string as the file content
     */
    static fromString(fileName, content, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromString);
            }
            throw error;
        }
        if (!content) {
            throw new Error(`InitFile ${fileName}: cannot create empty file. Please supply at least one character of content.`);
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        content,
                        encoding: this.options.base64Encoded ? 'base64' : 'plain',
                    }),
                };
            }
        }(fileName, options);
    }
    /**
     * Write a symlink with the given symlink target
     */
    static symlink(fileName, target, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.symlink);
            }
            throw error;
        }
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
    static fromObject(fileName, obj, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromObject);
            }
            throw error;
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        content: obj,
                    }),
                };
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
    static fromFileInline(targetFileName, sourceFileName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFileInline);
            }
            throw error;
        }
        const encoding = options.base64Encoded ? 'base64' : 'utf8';
        const fileContents = fs.readFileSync(sourceFileName).toString(encoding);
        return InitFile.fromString(targetFileName, fileContents, options);
    }
    /**
     * Download from a URL at instance startup time
     */
    static fromUrl(fileName, url, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromUrl);
            }
            throw error;
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        source: url,
                    }),
                };
            }
        }(fileName, options);
    }
    /**
     * Download a file from an S3 bucket at instance startup time
     */
    static fromS3Object(fileName, bucket, key, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromS3Object);
            }
            throw error;
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                bucket.grantRead(bindOptions.instanceRole, key);
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        source: bucket.urlForObject(key),
                    }),
                    authentication: standardS3Auth(bindOptions.instanceRole, bucket.bucketName),
                };
            }
        }(fileName, options);
    }
    /**
     * Create an asset from the given file
     *
     * This is appropriate for files that are too large to embed into the template.
     */
    static fromAsset(targetFileName, path, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileAssetOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                const asset = new s3_assets.Asset(bindOptions.scope, `${targetFileName}Asset`, {
                    path,
                    ...options,
                });
                asset.grantRead(bindOptions.instanceRole);
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        source: asset.httpUrl,
                    }),
                    authentication: standardS3Auth(bindOptions.instanceRole, asset.s3BucketName),
                    assetHash: asset.assetHash,
                };
            }
        }(targetFileName, options);
    }
    /**
     * Use a file from an asset at instance startup time
     */
    static fromExistingAsset(targetFileName, asset, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExistingAsset);
            }
            throw error;
        }
        return new class extends InitFile {
            _doBind(bindOptions) {
                asset.grantRead(bindOptions.instanceRole);
                return {
                    config: this._standardConfig(options, bindOptions.platform, {
                        source: asset.httpUrl,
                    }),
                    authentication: standardS3Auth(bindOptions.instanceRole, asset.s3BucketName),
                    assetHash: asset.assetHash,
                };
            }
        }(targetFileName, options);
    }
    /** @internal */
    _bind(bindOptions) {
        for (const handle of this.options.serviceRestartHandles ?? []) {
            handle._addFile(this.fileName);
        }
        return this._doBind(bindOptions);
    }
    /**
     * Render the standard config block, given content vars
     * @internal
     */
    _standardConfig(fileOptions, platform, contentVars) {
        if (platform === cfn_init_internal_1.InitPlatform.WINDOWS) {
            if (fileOptions.group || fileOptions.owner || fileOptions.mode) {
                throw new Error('Owner, group, and mode options not supported for Windows.');
            }
            return {
                [this.fileName]: { ...contentVars },
            };
        }
        return {
            [this.fileName]: {
                ...contentVars,
                mode: fileOptions.mode || '000644',
                owner: fileOptions.owner || 'root',
                group: fileOptions.group || 'root',
            },
        };
    }
}
exports.InitFile = InitFile;
_e = JSII_RTTI_SYMBOL_1;
InitFile[_e] = { fqn: "@aws-cdk/aws-ec2.InitFile", version: "0.0.0" };
/**
 * Create Linux/UNIX groups and assign group IDs.
 *
 * Not supported for Windows systems.
 */
class InitGroup extends InitElement {
    constructor(groupName, groupId) {
        super();
        this.groupName = groupName;
        this.groupId = groupId;
        this.elementType = cfn_init_internal_1.InitElementType.GROUP.toString();
    }
    /**
     * Create a group from its name, and optionally, group id
     */
    static fromName(groupName, groupId) {
        return new InitGroup(groupName, groupId);
    }
    /** @internal */
    _bind(options) {
        if (options.platform === cfn_init_internal_1.InitPlatform.WINDOWS) {
            throw new Error('Init groups are not supported on Windows');
        }
        return {
            config: {
                [this.groupName]: this.groupId !== undefined ? { gid: this.groupId } : {},
            },
        };
    }
}
exports.InitGroup = InitGroup;
_f = JSII_RTTI_SYMBOL_1;
InitGroup[_f] = { fqn: "@aws-cdk/aws-ec2.InitGroup", version: "0.0.0" };
/**
 * Create Linux/UNIX users and to assign user IDs.
 *
 * Users are created as non-interactive system users with a shell of
 * /sbin/nologin. This is by design and cannot be modified.
 *
 * Not supported for Windows systems.
 */
class InitUser extends InitElement {
    constructor(userName, userOptions) {
        super();
        this.userName = userName;
        this.userOptions = userOptions;
        this.elementType = cfn_init_internal_1.InitElementType.USER.toString();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitUserOptions(userOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, InitUser);
            }
            throw error;
        }
    }
    /**
     * Create a user from user name.
     */
    static fromName(userName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitUserOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromName);
            }
            throw error;
        }
        return new InitUser(userName, options);
    }
    /** @internal */
    _bind(options) {
        if (options.platform === cfn_init_internal_1.InitPlatform.WINDOWS) {
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
exports.InitUser = InitUser;
_g = JSII_RTTI_SYMBOL_1;
InitUser[_g] = { fqn: "@aws-cdk/aws-ec2.InitUser", version: "0.0.0" };
/**
 * A package to be installed during cfn-init time
 */
class InitPackage extends InitElement {
    constructor(type, versions, packageName, serviceHandles) {
        super();
        this.type = type;
        this.versions = versions;
        this.packageName = packageName;
        this.serviceHandles = serviceHandles;
        this.elementType = cfn_init_internal_1.InitElementType.PACKAGE.toString();
    }
    /**
     * Install an RPM from an HTTP URL or a location on disk
     */
    static rpm(location, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LocationPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.rpm);
            }
            throw error;
        }
        return new InitPackage('rpm', [location], options.key, options.serviceRestartHandles);
    }
    /**
     * Install a package using Yum
     */
    static yum(packageName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NamedPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.yum);
            }
            throw error;
        }
        return new InitPackage('yum', options.version ?? [], packageName, options.serviceRestartHandles);
    }
    /**
     * Install a package from RubyGems
     */
    static rubyGem(gemName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NamedPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.rubyGem);
            }
            throw error;
        }
        return new InitPackage('rubygems', options.version ?? [], gemName, options.serviceRestartHandles);
    }
    /**
     * Install a package from PyPI
     */
    static python(packageName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NamedPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.python);
            }
            throw error;
        }
        return new InitPackage('python', options.version ?? [], packageName, options.serviceRestartHandles);
    }
    /**
     * Install a package using APT
     */
    static apt(packageName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NamedPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.apt);
            }
            throw error;
        }
        return new InitPackage('apt', options.version ?? [], packageName, options.serviceRestartHandles);
    }
    /**
     * Install an MSI package from an HTTP URL or a location on disk
     */
    static msi(location, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LocationPackageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.msi);
            }
            throw error;
        }
        // The MSI package version must be a string, not an array.
        return new class extends InitPackage {
            renderPackageVersions() { return location; }
        }('msi', [location], options.key, options.serviceRestartHandles);
    }
    /** @internal */
    _bind(options) {
        if ((this.type === 'msi') !== (options.platform === cfn_init_internal_1.InitPlatform.WINDOWS)) {
            if (this.type === 'msi') {
                throw new Error('MSI installers are only supported on Windows systems.');
            }
            else {
                throw new Error('Windows only supports the MSI package type');
            }
        }
        if (!this.packageName && !['rpm', 'msi'].includes(this.type)) {
            throw new Error('Package name must be specified for all package types besides RPM and MSI.');
        }
        const packageName = this.packageName || `${options.index}`.padStart(3, '0');
        for (const handle of this.serviceHandles ?? []) {
            handle._addPackage(this.type, packageName);
        }
        return {
            config: {
                [this.type]: {
                    [packageName]: this.renderPackageVersions(),
                },
            },
        };
    }
    renderPackageVersions() {
        return this.versions;
    }
}
exports.InitPackage = InitPackage;
_h = JSII_RTTI_SYMBOL_1;
InitPackage[_h] = { fqn: "@aws-cdk/aws-ec2.InitPackage", version: "0.0.0" };
/**
 * A services that be enabled, disabled or restarted when the instance is launched.
 */
class InitService extends InitElement {
    constructor(serviceName, serviceOptions) {
        super();
        this.serviceName = serviceName;
        this.serviceOptions = serviceOptions;
        this.elementType = cfn_init_internal_1.InitElementType.SERVICE.toString();
    }
    /**
     * Enable and start the given service, optionally restarting it
     */
    static enable(serviceName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitServiceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.enable);
            }
            throw error;
        }
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
    static disable(serviceName) {
        return new InitService(serviceName, { enabled: false, ensureRunning: false });
    }
    /** @internal */
    _bind(options) {
        const serviceManager = options.platform === cfn_init_internal_1.InitPlatform.LINUX ? 'sysvinit' : 'windows';
        return {
            config: {
                [serviceManager]: {
                    [this.serviceName]: {
                        enabled: this.serviceOptions.enabled,
                        ensureRunning: this.serviceOptions.ensureRunning,
                        ...this.serviceOptions.serviceRestartHandle?._renderRestartHandles(),
                    },
                },
            },
        };
    }
}
exports.InitService = InitService;
_j = JSII_RTTI_SYMBOL_1;
InitService[_j] = { fqn: "@aws-cdk/aws-ec2.InitService", version: "0.0.0" };
/**
 * Extract an archive into a directory
 */
class InitSource extends InitElement {
    constructor(targetDirectory, serviceHandles) {
        super();
        this.targetDirectory = targetDirectory;
        this.serviceHandles = serviceHandles;
        this.elementType = cfn_init_internal_1.InitElementType.SOURCE.toString();
    }
    /**
     * Retrieve a URL and extract it into the given directory
     */
    static fromUrl(targetDirectory, url, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitSourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromUrl);
            }
            throw error;
        }
        return new class extends InitSource {
            _doBind() {
                return {
                    config: { [this.targetDirectory]: url },
                };
            }
        }(targetDirectory, options.serviceRestartHandles);
    }
    /**
     * Extract a GitHub branch into a given directory
     */
    static fromGitHub(targetDirectory, owner, repo, refSpec, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitSourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromGitHub);
            }
            throw error;
        }
        return InitSource.fromUrl(targetDirectory, `https://github.com/${owner}/${repo}/tarball/${refSpec ?? 'master'}`, options);
    }
    /**
     * Extract an archive stored in an S3 bucket into the given directory
     */
    static fromS3Object(targetDirectory, bucket, key, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitSourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromS3Object);
            }
            throw error;
        }
        return new class extends InitSource {
            _doBind(bindOptions) {
                bucket.grantRead(bindOptions.instanceRole, key);
                return {
                    config: { [this.targetDirectory]: bucket.urlForObject(key) },
                    authentication: standardS3Auth(bindOptions.instanceRole, bucket.bucketName),
                };
            }
        }(targetDirectory, options.serviceRestartHandles);
    }
    /**
     * Create an InitSource from an asset created from the given path.
     */
    static fromAsset(targetDirectory, path, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitSourceAssetOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
        return new class extends InitSource {
            _doBind(bindOptions) {
                const asset = new s3_assets.Asset(bindOptions.scope, `${targetDirectory}Asset`, {
                    path,
                    ...bindOptions,
                });
                asset.grantRead(bindOptions.instanceRole);
                return {
                    config: { [this.targetDirectory]: asset.httpUrl },
                    authentication: standardS3Auth(bindOptions.instanceRole, asset.s3BucketName),
                    assetHash: asset.assetHash,
                };
            }
        }(targetDirectory, options.serviceRestartHandles);
    }
    /**
     * Extract a directory from an existing directory asset.
     */
    static fromExistingAsset(targetDirectory, asset, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InitSourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExistingAsset);
            }
            throw error;
        }
        return new class extends InitSource {
            _doBind(bindOptions) {
                asset.grantRead(bindOptions.instanceRole);
                return {
                    config: { [this.targetDirectory]: asset.httpUrl },
                    authentication: standardS3Auth(bindOptions.instanceRole, asset.s3BucketName),
                    assetHash: asset.assetHash,
                };
            }
        }(targetDirectory, options.serviceRestartHandles);
    }
    /** @internal */
    _bind(options) {
        for (const handle of this.serviceHandles ?? []) {
            handle._addSource(this.targetDirectory);
        }
        // Delegate actual bind to subclasses
        return this._doBind(options);
    }
}
exports.InitSource = InitSource;
_k = JSII_RTTI_SYMBOL_1;
InitSource[_k] = { fqn: "@aws-cdk/aws-ec2.InitSource", version: "0.0.0" };
/**
 * Render a standard S3 auth block for use in AWS::CloudFormation::Authentication
 *
 * This block is the same every time (modulo bucket name), so it has the same
 * key every time so the blocks are merged into one in the final render.
 */
function standardS3Auth(role, bucketName) {
    return {
        S3AccessCreds: {
            type: 'S3',
            roleName: role.roleName,
            buckets: [bucketName],
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQtZWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taW5pdC1lbGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFHekIsb0RBQW9EO0FBQ3BELHdDQUF5QztBQUN6QyxtRUFBZ0g7QUFFaEg7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILE1BQWEsd0JBQXdCO0lBQXJDO1FBQ21CLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzVCLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzlCLGFBQVEsR0FBNkIsRUFBRSxDQUFDO0tBbUQxRDtJQWpEQzs7O09BR0c7SUFDSSxXQUFXLENBQUMsR0FBVztRQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7OztPQUdHO0lBQ0ksUUFBUSxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM3QjtJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxHQUFXO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRDs7O09BR0c7SUFDSSxXQUFXLENBQUMsV0FBbUIsRUFBRSxHQUFXO1FBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEM7SUFFRDs7O09BR0c7SUFDSSxxQkFBcUI7UUFD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LE9BQU8sQ0FBQyxDQUFDO0tBQzlCOztBQXpGSCxnQ0FtR0M7OztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxjQUFjLENBQUMsSUFBZSxFQUFFLFVBQWtCO0lBQ3pELE9BQU87UUFDTCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDdEI7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM19hc3NldHMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW5pdEJpbmRPcHRpb25zLCBJbml0RWxlbWVudENvbmZpZywgSW5pdEVsZW1lbnRUeXBlLCBJbml0UGxhdGZvcm0gfSBmcm9tICcuL3ByaXZhdGUvY2ZuLWluaXQtaW50ZXJuYWwnO1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgcmVhc29ucyB0byByZXN0YXJ0IGFuIEluaXRTZXJ2aWNlXG4gKlxuICogUGFzcyBhbiBpbnN0YW5jZSBvZiB0aGlzIG9iamVjdCB0byB0aGUgYEluaXRGaWxlYCwgYEluaXRDb21tYW5kYCxcbiAqIGBJbml0U291cmNlYCBhbmQgYEluaXRQYWNrYWdlYCBvYmplY3RzLCBhbmQgZmluYWxseSB0byBhbiBgSW5pdFNlcnZpY2VgXG4gKiBpdHNlbGYgdG8gY2F1c2UgdGhlIGFjdGlvbnMgKGZpbGVzLCBjb21tYW5kcywgc291cmNlcywgYW5kIHBhY2thZ2VzKVxuICogdG8gdHJpZ2dlciBhIHJlc3RhcnQgb2YgdGhlIHNlcnZpY2UuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBmb2xsb3dpbmcgd2lsbCBydW4gYSBjdXN0b20gY29tbWFuZCB0byBpbnN0YWxsIE5naW54LFxuICogYW5kIHRyaWdnZXIgdGhlIG5naW54IHNlcnZpY2UgdG8gYmUgcmVzdGFydGVkIGFmdGVyIHRoZSBjb21tYW5kIGhhcyBydW4uXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGhhbmRsZSA9IG5ldyBlYzIuSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlKCk7XG4gKiBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAqICAgZWMyLkluaXRDb21tYW5kLnNoZWxsQ29tbWFuZCgnL3Vzci9iaW4vY3VzdG9tLW5naW54LWluc3RhbGwuc2gnLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlczogW2hhbmRsZV0gfSksXG4gKiAgIGVjMi5Jbml0U2VydmljZS5lbmFibGUoJ25naW54JywgeyBzZXJ2aWNlUmVzdGFydEhhbmRsZTogaGFuZGxlIH0pLFxuICogKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb21tYW5kcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZmlsZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHNvdXJjZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHBhY2thZ2VzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcblxuICAvKipcbiAgICogQWRkIGEgY29tbWFuZCBrZXkgdG8gdGhlIHJlc3RhcnQgc2V0XG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hZGRDb21tYW5kKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZHMucHVzaChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZpbGUga2V5IHRvIHRoZSByZXN0YXJ0IHNldFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkRmlsZShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmZpbGVzLnB1c2goa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzb3VyY2Uga2V5IHRvIHRoZSByZXN0YXJ0IHNldFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkU291cmNlKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlcy5wdXNoKGtleSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcGFja2FnZSBrZXkgdG8gdGhlIHJlc3RhcnQgc2V0XG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hZGRQYWNrYWdlKHBhY2thZ2VUeXBlOiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnBhY2thZ2VzW3BhY2thZ2VUeXBlXSkge1xuICAgICAgdGhpcy5wYWNrYWdlc1twYWNrYWdlVHlwZV0gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5wYWNrYWdlc1twYWNrYWdlVHlwZV0ucHVzaChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgcmVzdGFydCBoYW5kbGVzIGZvciB1c2UgaW4gYW4gSW5pdFNlcnZpY2UgZGVjbGFyYXRpb25cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3JlbmRlclJlc3RhcnRIYW5kbGVzKCk6IGFueSB7XG4gICAgY29uc3Qgbm9uRW1wdHkgPSA8QT4oeDogQVtdKSA9PiB4Lmxlbmd0aCA+IDAgPyB4IDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1hbmRzOiBub25FbXB0eSh0aGlzLmNvbW1hbmRzKSxcbiAgICAgIGZpbGVzOiBub25FbXB0eSh0aGlzLmZpbGVzKSxcbiAgICAgIHBhY2thZ2VzOiBPYmplY3Qua2V5cyh0aGlzLnBhY2thZ2VzKS5sZW5ndGggPiAwID8gdGhpcy5wYWNrYWdlcyA6IHVuZGVmaW5lZCxcbiAgICAgIHNvdXJjZXM6IG5vbkVtcHR5KHRoaXMuc291cmNlcyksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBDbG91ZEZvcm1hdGlvbiBJbml0IGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbml0RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluaXQgZWxlbWVudCB0eXBlIGZvciB0aGlzIGVsZW1lbnQuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZWxlbWVudFR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEluaXQgY29uZmlnIGlzIGJlaW5nIGNvbnN1bWVkLiBSZW5kZXJzIHRoZSBDbG91ZEZvcm1hdGlvblxuICAgKiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGluaXQgZWxlbWVudCwgYW5kIGNhbGN1bGF0ZXMgYW55IGF1dGhlbnRpY2F0aW9uXG4gICAqIHByb3BlcnRpZXMgbmVlZGVkLCBpZiBhbnkuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIGJpbmQgb3B0aW9ucyBmb3IgdGhlIGVsZW1lbnQuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9iaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnO1xuXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgSW5pdENvbW1hbmRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0Q29tbWFuZE9wdGlvbnMge1xuICAvKipcbiAgICogSWRlbnRpZmllciBrZXkgZm9yIHRoaXMgY29tbWFuZFxuICAgKlxuICAgKiBDb21tYW5kcyBhcmUgZXhlY3V0ZWQgaW4gbGV4aWNvZ3JhcGhpY2FsIG9yZGVyIG9mIHRoZWlyIGtleSBuYW1lcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBiYXNlZCBvbiBpbmRleFxuICAgKi9cbiAgcmVhZG9ubHkga2V5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXRzIGVudmlyb25tZW50IHZhcmlhYmxlcyBmb3IgdGhlIGNvbW1hbmQuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgb3ZlcndyaXRlcywgcmF0aGVyIHRoYW4gYXBwZW5kcywgdGhlIGV4aXN0aW5nIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZSBjdXJyZW50IGVudmlyb25tZW50XG4gICAqL1xuICByZWFkb25seSBlbnY/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBUaGUgd29ya2luZyBkaXJlY3RvcnlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2UgZGVmYXVsdCB3b3JraW5nIGRpcmVjdG9yeVxuICAgKi9cbiAgcmVhZG9ubHkgY3dkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb21tYW5kIHRvIGRldGVybWluZSB3aGV0aGVyIHRoaXMgY29tbWFuZCBzaG91bGQgYmUgcnVuXG4gICAqXG4gICAqIElmIHRoZSB0ZXN0IHBhc3NlcyAoZXhpdHMgd2l0aCBlcnJvciBjb2RlIG9mIDApLCB0aGUgY29tbWFuZCBpcyBydW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWx3YXlzIHJ1biB0aGUgY29tbWFuZFxuICAgKi9cbiAgcmVhZG9ubHkgdGVzdENtZD86IHN0cmluZztcblxuICAvKipcbiAgICogQ29udGludWUgcnVubmluZyBpZiB0aGlzIGNvbW1hbmQgZmFpbHNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZUVycm9ycz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkdXJhdGlvbiB0byB3YWl0IGFmdGVyIGEgY29tbWFuZCBoYXMgZmluaXNoZWQgaW4gY2FzZSB0aGUgY29tbWFuZCBjYXVzZXMgYSByZWJvb3QuXG4gICAqXG4gICAqIFNldCB0aGlzIHZhbHVlIHRvIGBJbml0Q29tbWFuZFdhaXREdXJhdGlvbi5ub25lKClgIGlmIHlvdSBkbyBub3Qgd2FudCB0byB3YWl0IGZvciBldmVyeSBjb21tYW5kO1xuICAgKiBgSW5pdENvbW1hbmRXYWl0RHVyYXRpb24uZm9yZXZlcigpYCBkaXJlY3RzIGNmbi1pbml0IHRvIGV4aXQgYW5kIHJlc3VtZSBvbmx5IGFmdGVyIHRoZSByZWJvb3QgaXMgY29tcGxldGUuXG4gICAqXG4gICAqIEZvciBXaW5kb3dzIHN5c3RlbXMgb25seS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSA2MCBzZWNvbmRzXG4gICAqL1xuICByZWFkb25seSB3YWl0QWZ0ZXJDb21wbGV0aW9uPzogSW5pdENvbW1hbmRXYWl0RHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIGdpdmVuIHNlcnZpY2UocykgYWZ0ZXIgdGhpcyBjb21tYW5kIGhhcyBydW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3QgcmVzdGFydCBhbnkgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJlc3RhcnRIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW107XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGR1cmF0aW9uIHRvIHdhaXQgYWZ0ZXIgYSBjb21tYW5kIGhhcyBmaW5pc2hlZCwgaW4gY2FzZSBvZiBhIHJlYm9vdCAoV2luZG93cyBvbmx5KS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluaXRDb21tYW5kV2FpdER1cmF0aW9uIHtcbiAgLyoqIFdhaXQgZm9yIGEgc3BlY2lmaWVkIGR1cmF0aW9uIGFmdGVyIGEgY29tbWFuZC4gKi9cbiAgcHVibGljIHN0YXRpYyBvZihkdXJhdGlvbjogRHVyYXRpb24pOiBJbml0Q29tbWFuZFdhaXREdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRDb21tYW5kV2FpdER1cmF0aW9uIHtcbiAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgIHB1YmxpYyBfcmVuZGVyKCkgeyByZXR1cm4gZHVyYXRpb24udG9TZWNvbmRzKCk7IH1cbiAgICB9KCk7XG4gIH1cblxuICAvKiogRG8gbm90IHdhaXQgZm9yIHRoaXMgY29tbWFuZC4gKi9cbiAgcHVibGljIHN0YXRpYyBub25lKCk6IEluaXRDb21tYW5kV2FpdER1cmF0aW9uIHtcbiAgICByZXR1cm4gSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ub2YoRHVyYXRpb24uc2Vjb25kcygwKSk7XG4gIH1cblxuICAvKiogY2ZuLWluaXQgd2lsbCBleGl0IGFuZCByZXN1bWUgb25seSBhZnRlciBhIHJlYm9vdC4gKi9cbiAgcHVibGljIHN0YXRpYyBmb3JldmVyKCk6IEluaXRDb21tYW5kV2FpdER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ge1xuICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgcHVibGljIF9yZW5kZXIoKSB7IHJldHVybiAnZm9yZXZlcic7IH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRvIGEgQ2xvdWRGb3JtYXRpb24gdmFsdWUuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9yZW5kZXIoKTogYW55O1xufVxuXG4vKipcbiAqIENvbW1hbmQgdG8gZXhlY3V0ZSBvbiB0aGUgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRDb21tYW5kIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuICAvKipcbiAgICogUnVuIGEgc2hlbGwgY29tbWFuZFxuICAgKlxuICAgKiBSZW1lbWJlciB0aGF0IHNvbWUgY2hhcmFjdGVycyBsaWtlIGAmYCwgYHxgLCBgO2AsIGA+YCBldGMuIGhhdmUgc3BlY2lhbCBtZWFuaW5nIGluIGEgc2hlbGwgYW5kXG4gICAqIG5lZWQgdG8gYmUgcHJlY2VkZWQgYnkgYSBgXFxgIGlmIHlvdSB3YW50IHRvIHRyZWF0IHRoZW0gYXMgcGFydCBvZiBhIGZpbGVuYW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzaGVsbENvbW1hbmQoc2hlbGxDb21tYW5kOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRDb21tYW5kT3B0aW9ucyA9IHt9KTogSW5pdENvbW1hbmQge1xuICAgIHJldHVybiBuZXcgSW5pdENvbW1hbmQoc2hlbGxDb21tYW5kLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW4gYSBjb21tYW5kIGZyb20gYW4gYXJndiBhcnJheVxuICAgKlxuICAgKiBZb3UgZG8gbm90IG5lZWQgdG8gZXNjYXBlIHNwYWNlIGNoYXJhY3RlcnMgb3IgZW5jbG9zZSBjb21tYW5kIHBhcmFtZXRlcnMgaW4gcXVvdGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcmd2Q29tbWFuZChhcmd2OiBzdHJpbmdbXSwgb3B0aW9uczogSW5pdENvbW1hbmRPcHRpb25zID0ge30pOiBJbml0Q29tbWFuZCB7XG4gICAgaWYgKGFyZ3YubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWZpbmUgYXJndkNvbW1hbmQgd2l0aCBhbiBlbXB0eSBhcmd1bWVudHMnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbml0Q29tbWFuZChhcmd2LCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBlbGVtZW50VHlwZSA9IEluaXRFbGVtZW50VHlwZS5DT01NQU5ELnRvU3RyaW5nKCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbW1hbmQ6IHN0cmluZ1tdIHwgc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IEluaXRDb21tYW5kT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgY29uc3QgY29tbWFuZEtleSA9IHRoaXMub3B0aW9ucy5rZXkgfHwgYCR7b3B0aW9ucy5pbmRleH1gLnBhZFN0YXJ0KDMsICcwJyk7IC8vIDAwMSwgMDA1LCBldGMuXG5cbiAgICBpZiAob3B0aW9ucy5wbGF0Zm9ybSAhPT0gSW5pdFBsYXRmb3JtLldJTkRPV1MgJiYgdGhpcy5vcHRpb25zLndhaXRBZnRlckNvbXBsZXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21tYW5kICcke3RoaXMuY29tbWFuZH0nOiAnd2FpdEFmdGVyQ29tcGxldGlvbicgaXMgb25seSB2YWxpZCBmb3IgV2luZG93cyBzeXN0ZW1zLmApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlIG9mIHRoaXMub3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMgPz8gW10pIHtcbiAgICAgIGhhbmRsZS5fYWRkQ29tbWFuZChjb21tYW5kS2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIFtjb21tYW5kS2V5XToge1xuICAgICAgICAgIGNvbW1hbmQ6IHRoaXMuY29tbWFuZCxcbiAgICAgICAgICBlbnY6IHRoaXMub3B0aW9ucy5lbnYsXG4gICAgICAgICAgY3dkOiB0aGlzLm9wdGlvbnMuY3dkLFxuICAgICAgICAgIHRlc3Q6IHRoaXMub3B0aW9ucy50ZXN0Q21kLFxuICAgICAgICAgIGlnbm9yZUVycm9yczogdGhpcy5vcHRpb25zLmlnbm9yZUVycm9ycyxcbiAgICAgICAgICB3YWl0QWZ0ZXJDb21wbGV0aW9uOiB0aGlzLm9wdGlvbnMud2FpdEFmdGVyQ29tcGxldGlvbj8uX3JlbmRlcigpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBJbml0RmlsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluaXRGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgb3duaW5nIGdyb3VwIGZvciB0aGlzIGZpbGUuXG4gICAqXG4gICAqIE5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5cbiAgICpcbiAgICogQGRlZmF1bHQgJ3Jvb3QnXG4gICAqL1xuICByZWFkb25seSBncm91cD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG93bmluZyB1c2VyIGZvciB0aGlzIGZpbGUuXG4gICAqXG4gICAqIE5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5cbiAgICpcbiAgICogQGRlZmF1bHQgJ3Jvb3QnXG4gICAqL1xuICByZWFkb25seSBvd25lcj86IHN0cmluZztcblxuICAvKipcbiAgICogQSBzaXgtZGlnaXQgb2N0YWwgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSBtb2RlIGZvciB0aGlzIGZpbGUuXG4gICAqXG4gICAqIFVzZSB0aGUgZmlyc3QgdGhyZWUgZGlnaXRzIGZvciBzeW1saW5rcyBhbmQgdGhlIGxhc3QgdGhyZWUgZGlnaXRzIGZvclxuICAgKiBzZXR0aW5nIHBlcm1pc3Npb25zLiBUbyBjcmVhdGUgYSBzeW1saW5rLCBzcGVjaWZ5IDEyMHh4eCwgd2hlcmUgeHh4XG4gICAqIGRlZmluZXMgdGhlIHBlcm1pc3Npb25zIG9mIHRoZSB0YXJnZXQgZmlsZS4gVG8gc3BlY2lmeSBwZXJtaXNzaW9ucyBmb3IgYVxuICAgKiBmaWxlLCB1c2UgdGhlIGxhc3QgdGhyZWUgZGlnaXRzLCBzdWNoIGFzIDAwMDY0NC5cbiAgICpcbiAgICogTm90IHN1cHBvcnRlZCBmb3IgV2luZG93cyBzeXN0ZW1zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnMDAwNjQ0J1xuICAgKi9cbiAgcmVhZG9ubHkgbW9kZT86IHN0cmluZztcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgaW5saW5lZCBjb250ZW50IChmcm9tIGEgc3RyaW5nIG9yIGZpbGUpIHNob3VsZCBiZSB0cmVhdGVkIGFzIGJhc2U2NCBlbmNvZGVkLlxuICAgKiBPbmx5IGFwcGxpY2FibGUgZm9yIGlubGluZWQgc3RyaW5nIGFuZCBmaWxlIGNvbnRlbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBiYXNlNjRFbmNvZGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgZ2l2ZW4gc2VydmljZSBhZnRlciB0aGlzIGZpbGUgaGFzIGJlZW4gd3JpdHRlblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCByZXN0YXJ0IGFueSBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlUmVzdGFydEhhbmRsZXM/OiBJbml0U2VydmljZVJlc3RhcnRIYW5kbGVbXTtcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIGNyZWF0aW5nIGFuIEluaXRGaWxlIGZyb20gYW4gYXNzZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5pdEZpbGVBc3NldE9wdGlvbnMgZXh0ZW5kcyBJbml0RmlsZU9wdGlvbnMsIHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMge1xufVxuXG4vKipcbiAqIENyZWF0ZSBmaWxlcyBvbiB0aGUgRUMyIGluc3RhbmNlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5pdEZpbGUgZXh0ZW5kcyBJbml0RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIFVzZSBhIGxpdGVyYWwgc3RyaW5nIGFzIHRoZSBmaWxlIGNvbnRlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyhmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIG9wdGlvbnM6IEluaXRGaWxlT3B0aW9ucyA9IHt9KTogSW5pdEZpbGUge1xuICAgIGlmICghY29udGVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbml0RmlsZSAke2ZpbGVOYW1lfTogY2Fubm90IGNyZWF0ZSBlbXB0eSBmaWxlLiBQbGVhc2Ugc3VwcGx5IGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXIgb2YgY29udGVudC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRGaWxlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHRoaXMuX3N0YW5kYXJkQ29uZmlnKG9wdGlvbnMsIGJpbmRPcHRpb25zLnBsYXRmb3JtLCB7XG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHRoaXMub3B0aW9ucy5iYXNlNjRFbmNvZGVkID8gJ2Jhc2U2NCcgOiAncGxhaW4nLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0oZmlsZU5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgc3ltbGluayB3aXRoIHRoZSBnaXZlbiBzeW1saW5rIHRhcmdldFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzeW1saW5rKGZpbGVOYW1lOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCBvcHRpb25zOiBJbml0RmlsZU9wdGlvbnMgPSB7fSk6IEluaXRGaWxlIHtcbiAgICBjb25zdCB7IG1vZGUsIC4uLm90aGVyT3B0aW9ucyB9ID0gb3B0aW9ucztcbiAgICBpZiAobW9kZSAmJiBtb2RlLnNsaWNlKDAsIDMpICE9PSAnMTIwJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIG1vZGUgZm9yIHN5bWxpbmtzIG11c3QgYmVnaW4gd2l0aCAxMjBYWFgnKTtcbiAgICB9XG4gICAgcmV0dXJuIEluaXRGaWxlLmZyb21TdHJpbmcoZmlsZU5hbWUsIHRhcmdldCwgeyBtb2RlOiAobW9kZSB8fCAnMTIwNjQ0JyksIC4uLm90aGVyT3B0aW9ucyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYSBKU09OLWNvbXBhdGlibGUgb2JqZWN0IGFzIHRoZSBmaWxlIGNvbnRlbnQsIHdyaXRlIGl0IHRvIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBNYXkgY29udGFpbiB0b2tlbnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21PYmplY3QoZmlsZU5hbWU6IHN0cmluZywgb2JqOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRpb25zOiBJbml0RmlsZU9wdGlvbnMgPSB7fSk6IEluaXRGaWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdEZpbGUge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoYmluZE9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogdGhpcy5fc3RhbmRhcmRDb25maWcob3B0aW9ucywgYmluZE9wdGlvbnMucGxhdGZvcm0sIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IG9iaixcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KGZpbGVOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgZmlsZSBmcm9tIGRpc2sgYW5kIHVzZSBpdHMgY29udGVudHNcbiAgICpcbiAgICogVGhlIGZpbGUgd2lsbCBiZSBlbWJlZGRlZCBpbiB0aGUgdGVtcGxhdGUsIHNvIGNhcmUgc2hvdWxkIGJlIHRha2VuIHRvIG5vdFxuICAgKiBleGNlZWQgdGhlIHRlbXBsYXRlIHNpemUuXG4gICAqXG4gICAqIElmIG9wdGlvbnMuYmFzZTY0ZW5jb2RlZCBpcyBzZXQgdG8gdHJ1ZSwgdGhpcyB3aWxsIGJhc2U2NC1lbmNvZGUgdGhlIGZpbGUncyBjb250ZW50cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUZpbGVJbmxpbmUodGFyZ2V0RmlsZU5hbWU6IHN0cmluZywgc291cmNlRmlsZU5hbWU6IHN0cmluZywgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBvcHRpb25zLmJhc2U2NEVuY29kZWQgPyAnYmFzZTY0JyA6ICd1dGY4JztcbiAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRmlsZU5hbWUpLnRvU3RyaW5nKGVuY29kaW5nKTtcbiAgICByZXR1cm4gSW5pdEZpbGUuZnJvbVN0cmluZyh0YXJnZXRGaWxlTmFtZSwgZmlsZUNvbnRlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBmcm9tIGEgVVJMIGF0IGluc3RhbmNlIHN0YXJ0dXAgdGltZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVXJsKGZpbGVOYW1lOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvcHRpb25zOiBJbml0RmlsZU9wdGlvbnMgPSB7fSk6IEluaXRGaWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdEZpbGUge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoYmluZE9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogdGhpcy5fc3RhbmRhcmRDb25maWcob3B0aW9ucywgYmluZE9wdGlvbnMucGxhdGZvcm0sIHtcbiAgICAgICAgICAgIHNvdXJjZTogdXJsLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0oZmlsZU5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIGEgZmlsZSBmcm9tIGFuIFMzIGJ1Y2tldCBhdCBpbnN0YW5jZSBzdGFydHVwIHRpbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVMzT2JqZWN0KGZpbGVOYW1lOiBzdHJpbmcsIGJ1Y2tldDogczMuSUJ1Y2tldCwga2V5OiBzdHJpbmcsIG9wdGlvbnM6IEluaXRGaWxlT3B0aW9ucyA9IHt9KTogSW5pdEZpbGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0RmlsZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIGJ1Y2tldC5ncmFudFJlYWQoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlLCBrZXkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogdGhpcy5fc3RhbmRhcmRDb25maWcob3B0aW9ucywgYmluZE9wdGlvbnMucGxhdGZvcm0sIHtcbiAgICAgICAgICAgIHNvdXJjZTogYnVja2V0LnVybEZvck9iamVjdChrZXkpLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzdGFuZGFyZFMzQXV0aChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGJ1Y2tldC5idWNrZXROYW1lKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KGZpbGVOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYXNzZXQgZnJvbSB0aGUgZ2l2ZW4gZmlsZVxuICAgKlxuICAgKiBUaGlzIGlzIGFwcHJvcHJpYXRlIGZvciBmaWxlcyB0aGF0IGFyZSB0b28gbGFyZ2UgdG8gZW1iZWQgaW50byB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldCh0YXJnZXRGaWxlTmFtZTogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRGaWxlQXNzZXRPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRGaWxlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgYXNzZXQgPSBuZXcgczNfYXNzZXRzLkFzc2V0KGJpbmRPcHRpb25zLnNjb3BlLCBgJHt0YXJnZXRGaWxlTmFtZX1Bc3NldGAsIHtcbiAgICAgICAgICBwYXRoLFxuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NldC5ncmFudFJlYWQoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogdGhpcy5fc3RhbmRhcmRDb25maWcob3B0aW9ucywgYmluZE9wdGlvbnMucGxhdGZvcm0sIHtcbiAgICAgICAgICAgIHNvdXJjZTogYXNzZXQuaHR0cFVybCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhdXRoZW50aWNhdGlvbjogc3RhbmRhcmRTM0F1dGgoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlLCBhc3NldC5zM0J1Y2tldE5hbWUpLFxuICAgICAgICAgIGFzc2V0SGFzaDogYXNzZXQuYXNzZXRIYXNoLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0odGFyZ2V0RmlsZU5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhIGZpbGUgZnJvbSBhbiBhc3NldCBhdCBpbnN0YW5jZSBzdGFydHVwIHRpbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUV4aXN0aW5nQXNzZXQodGFyZ2V0RmlsZU5hbWU6IHN0cmluZywgYXNzZXQ6IHMzX2Fzc2V0cy5Bc3NldCwgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRGaWxlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgYXNzZXQuZ3JhbnRSZWFkKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29uZmlnOiB0aGlzLl9zdGFuZGFyZENvbmZpZyhvcHRpb25zLCBiaW5kT3B0aW9ucy5wbGF0Zm9ybSwge1xuICAgICAgICAgICAgc291cmNlOiBhc3NldC5odHRwVXJsLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzdGFuZGFyZFMzQXV0aChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGFzc2V0LnMzQnVja2V0TmFtZSksXG4gICAgICAgICAgYXNzZXRIYXNoOiBhc3NldC5hc3NldEhhc2gsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSh0YXJnZXRGaWxlTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFR5cGUgPSBJbml0RWxlbWVudFR5cGUuRklMRS50b1N0cmluZygpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZpbGVOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9iaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgZm9yIChjb25zdCBoYW5kbGUgb2YgdGhpcy5vcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyA/PyBbXSkge1xuICAgICAgaGFuZGxlLl9hZGRGaWxlKHRoaXMuZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9kb0JpbmQoYmluZE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIGFjdHVhbCBiaW5kIGFuZCByZW5kZXJcbiAgICpcbiAgICogVGhpcyBpcyBpbiBhIHNlY29uZCBtZXRob2Qgc28gdGhlIHN1cGVyY2xhc3MgY2FuIGd1YXJhbnRlZSB0aGF0XG4gICAqIHRoZSBjb21tb24gd29yayBvZiByZWdpc3RlcmluZyBpbnRvIHNlcnZpY2VIYW5kbGVzIGNhbm5vdCBiZSBmb3Jnb3R0ZW4uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9kb0JpbmQob3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWc7XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgc3RhbmRhcmQgY29uZmlnIGJsb2NrLCBnaXZlbiBjb250ZW50IHZhcnNcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX3N0YW5kYXJkQ29uZmlnKGZpbGVPcHRpb25zOiBJbml0RmlsZU9wdGlvbnMsIHBsYXRmb3JtOiBJbml0UGxhdGZvcm0sIGNvbnRlbnRWYXJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgaWYgKHBsYXRmb3JtID09PSBJbml0UGxhdGZvcm0uV0lORE9XUykge1xuICAgICAgaWYgKGZpbGVPcHRpb25zLmdyb3VwIHx8IGZpbGVPcHRpb25zLm93bmVyIHx8IGZpbGVPcHRpb25zLm1vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPd25lciwgZ3JvdXAsIGFuZCBtb2RlIG9wdGlvbnMgbm90IHN1cHBvcnRlZCBmb3IgV2luZG93cy4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFt0aGlzLmZpbGVOYW1lXTogeyAuLi5jb250ZW50VmFycyB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMuZmlsZU5hbWVdOiB7XG4gICAgICAgIC4uLmNvbnRlbnRWYXJzLFxuICAgICAgICBtb2RlOiBmaWxlT3B0aW9ucy5tb2RlIHx8ICcwMDA2NDQnLFxuICAgICAgICBvd25lcjogZmlsZU9wdGlvbnMub3duZXIgfHwgJ3Jvb3QnLFxuICAgICAgICBncm91cDogZmlsZU9wdGlvbnMuZ3JvdXAgfHwgJ3Jvb3QnLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIExpbnV4L1VOSVggZ3JvdXBzIGFuZCBhc3NpZ24gZ3JvdXAgSURzLlxuICpcbiAqIE5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRHcm91cCBleHRlbmRzIEluaXRFbGVtZW50IHtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgZ3JvdXAgZnJvbSBpdHMgbmFtZSwgYW5kIG9wdGlvbmFsbHksIGdyb3VwIGlkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21OYW1lKGdyb3VwTmFtZTogc3RyaW5nLCBncm91cElkPzogbnVtYmVyKTogSW5pdEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEluaXRHcm91cChncm91cE5hbWUsIGdyb3VwSWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLkdST1VQLnRvU3RyaW5nKCk7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3JvdXBOYW1lOiBzdHJpbmcsIHByaXZhdGUgZ3JvdXBJZD86IG51bWJlcikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgaWYgKG9wdGlvbnMucGxhdGZvcm0gPT09IEluaXRQbGF0Zm9ybS5XSU5ET1dTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luaXQgZ3JvdXBzIGFyZSBub3Qgc3VwcG9ydGVkIG9uIFdpbmRvd3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIFt0aGlzLmdyb3VwTmFtZV06IHRoaXMuZ3JvdXBJZCAhPT0gdW5kZWZpbmVkID8geyBnaWQ6IHRoaXMuZ3JvdXBJZCB9IDoge30sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxufVxuXG4vKipcbiAqIE9wdGlvbmFsIHBhcmFtZXRlcnMgdXNlZCB3aGVuIGNyZWF0aW5nIGEgdXNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluaXRVc2VyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIGhvbWUgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBhc3NpZ25lZCBieSB0aGUgT1NcbiAgICovXG4gIHJlYWRvbmx5IGhvbWVEaXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgdXNlciBJRC4gVGhlIGNyZWF0aW9uIHByb2Nlc3MgZmFpbHMgaWYgdGhlIHVzZXIgbmFtZSBleGlzdHMgd2l0aCBhIGRpZmZlcmVudCB1c2VyIElELlxuICAgKiBJZiB0aGUgdXNlciBJRCBpcyBhbHJlYWR5IGFzc2lnbmVkIHRvIGFuIGV4aXN0aW5nIHVzZXIgdGhlIG9wZXJhdGluZyBzeXN0ZW0gbWF5XG4gICAqIHJlamVjdCB0aGUgY3JlYXRpb24gcmVxdWVzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgYXNzaWduZWQgYnkgdGhlIE9TXG4gICAqL1xuICByZWFkb25seSB1c2VySWQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBncm91cCBuYW1lcy4gVGhlIHVzZXIgd2lsbCBiZSBhZGRlZCB0byBlYWNoIGdyb3VwIGluIHRoZSBsaXN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgdXNlciBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGFueSBncm91cHMuXG4gICAqL1xuICByZWFkb25seSBncm91cHM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgTGludXgvVU5JWCB1c2VycyBhbmQgdG8gYXNzaWduIHVzZXIgSURzLlxuICpcbiAqIFVzZXJzIGFyZSBjcmVhdGVkIGFzIG5vbi1pbnRlcmFjdGl2ZSBzeXN0ZW0gdXNlcnMgd2l0aCBhIHNoZWxsIG9mXG4gKiAvc2Jpbi9ub2xvZ2luLiBUaGlzIGlzIGJ5IGRlc2lnbiBhbmQgY2Fubm90IGJlIG1vZGlmaWVkLlxuICpcbiAqIE5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRVc2VyIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuICAvKipcbiAgICogQ3JlYXRlIGEgdXNlciBmcm9tIHVzZXIgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5hbWUodXNlck5hbWU6IHN0cmluZywgb3B0aW9uczogSW5pdFVzZXJPcHRpb25zID0ge30pOiBJbml0VXNlciB7XG4gICAgcmV0dXJuIG5ldyBJbml0VXNlcih1c2VyTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFR5cGUgPSBJbml0RWxlbWVudFR5cGUuVVNFUi50b1N0cmluZygpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHVzZXJOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgdXNlck9wdGlvbnM6IEluaXRVc2VyT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgaWYgKG9wdGlvbnMucGxhdGZvcm0gPT09IEluaXRQbGF0Zm9ybS5XSU5ET1dTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luaXQgdXNlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgb24gV2luZG93cycpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgW3RoaXMudXNlck5hbWVdOiB7XG4gICAgICAgICAgdWlkOiB0aGlzLnVzZXJPcHRpb25zLnVzZXJJZCxcbiAgICAgICAgICBncm91cHM6IHRoaXMudXNlck9wdGlvbnMuZ3JvdXBzLFxuICAgICAgICAgIGhvbWVEaXI6IHRoaXMudXNlck9wdGlvbnMuaG9tZURpcixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIEluaXRQYWNrYWdlLnJwbS9Jbml0UGFja2FnZS5tc2lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhdGlvblBhY2thZ2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIElkZW50aWZpZXIga2V5IGZvciB0aGlzIHBhY2thZ2VcbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhpcyB0byBvcmRlciBwYWNrYWdlIGluc3RhbGxzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkXG4gICAqL1xuICByZWFkb25seSBrZXk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIGdpdmVuIHNlcnZpY2UgYWZ0ZXIgdGhpcyBjb21tYW5kIGhhcyBydW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3QgcmVzdGFydCBhbnkgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJlc3RhcnRIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW107XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgSW5pdFBhY2thZ2UueXVtL2FwdC9ydWJ5R2VtL3B5dGhvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVkUGFja2FnZU9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgdmVyc2lvbnMgdG8gaW5zdGFsbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEluc3RhbGwgdGhlIGxhdGVzdCB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIGdpdmVuIHNlcnZpY2VzIGFmdGVyIHRoaXMgY29tbWFuZCBoYXMgcnVuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHJlc3RhcnQgYW55IHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VSZXN0YXJ0SGFuZGxlcz86IEluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZVtdO1xufVxuXG4vKipcbiAqIEEgcGFja2FnZSB0byBiZSBpbnN0YWxsZWQgZHVyaW5nIGNmbi1pbml0IHRpbWVcbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRQYWNrYWdlIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuICAvKipcbiAgICogSW5zdGFsbCBhbiBSUE0gZnJvbSBhbiBIVFRQIFVSTCBvciBhIGxvY2F0aW9uIG9uIGRpc2tcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcnBtKGxvY2F0aW9uOiBzdHJpbmcsIG9wdGlvbnM6IExvY2F0aW9uUGFja2FnZU9wdGlvbnMgPSB7fSk6IEluaXRQYWNrYWdlIHtcbiAgICByZXR1cm4gbmV3IEluaXRQYWNrYWdlKCdycG0nLCBbbG9jYXRpb25dLCBvcHRpb25zLmtleSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbGwgYSBwYWNrYWdlIHVzaW5nIFl1bVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB5dW0ocGFja2FnZU5hbWU6IHN0cmluZywgb3B0aW9uczogTmFtZWRQYWNrYWdlT3B0aW9ucyA9IHt9KTogSW5pdFBhY2thZ2Uge1xuICAgIHJldHVybiBuZXcgSW5pdFBhY2thZ2UoJ3l1bScsIG9wdGlvbnMudmVyc2lvbiA/PyBbXSwgcGFja2FnZU5hbWUsIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGEgcGFja2FnZSBmcm9tIFJ1YnlHZW1zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJ1YnlHZW0oZ2VtTmFtZTogc3RyaW5nLCBvcHRpb25zOiBOYW1lZFBhY2thZ2VPcHRpb25zID0ge30pOiBJbml0UGFja2FnZSB7XG4gICAgcmV0dXJuIG5ldyBJbml0UGFja2FnZSgncnVieWdlbXMnLCBvcHRpb25zLnZlcnNpb24gPz8gW10sIGdlbU5hbWUsIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGEgcGFja2FnZSBmcm9tIFB5UElcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcHl0aG9uKHBhY2thZ2VOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IE5hbWVkUGFja2FnZU9wdGlvbnMgPSB7fSk6IEluaXRQYWNrYWdlIHtcbiAgICByZXR1cm4gbmV3IEluaXRQYWNrYWdlKCdweXRob24nLCBvcHRpb25zLnZlcnNpb24gPz8gW10sIHBhY2thZ2VOYW1lLCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFsbCBhIHBhY2thZ2UgdXNpbmcgQVBUXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFwdChwYWNrYWdlTmFtZTogc3RyaW5nLCBvcHRpb25zOiBOYW1lZFBhY2thZ2VPcHRpb25zID0ge30pOiBJbml0UGFja2FnZSB7XG4gICAgcmV0dXJuIG5ldyBJbml0UGFja2FnZSgnYXB0Jywgb3B0aW9ucy52ZXJzaW9uID8/IFtdLCBwYWNrYWdlTmFtZSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbGwgYW4gTVNJIHBhY2thZ2UgZnJvbSBhbiBIVFRQIFVSTCBvciBhIGxvY2F0aW9uIG9uIGRpc2tcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbXNpKGxvY2F0aW9uOiBzdHJpbmcsIG9wdGlvbnM6IExvY2F0aW9uUGFja2FnZU9wdGlvbnMgPSB7fSk6IEluaXRQYWNrYWdlIHtcbiAgICAvLyBUaGUgTVNJIHBhY2thZ2UgdmVyc2lvbiBtdXN0IGJlIGEgc3RyaW5nLCBub3QgYW4gYXJyYXkuXG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRQYWNrYWdlIHtcbiAgICAgIHByb3RlY3RlZCByZW5kZXJQYWNrYWdlVmVyc2lvbnMoKSB7IHJldHVybiBsb2NhdGlvbjsgfVxuICAgIH0oJ21zaScsIFtsb2NhdGlvbl0sIG9wdGlvbnMua2V5LCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFR5cGUgPSBJbml0RWxlbWVudFR5cGUuUEFDS0FHRS50b1N0cmluZygpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHR5cGU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZlcnNpb25zOiBzdHJpbmdbXSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhY2thZ2VOYW1lPzogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZUhhbmRsZXM/OiBJbml0U2VydmljZVJlc3RhcnRIYW5kbGVbXSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9iaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnIHtcbiAgICBpZiAoKHRoaXMudHlwZSA9PT0gJ21zaScpICE9PSAob3B0aW9ucy5wbGF0Zm9ybSA9PT0gSW5pdFBsYXRmb3JtLldJTkRPV1MpKSB7XG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbXNpJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01TSSBpbnN0YWxsZXJzIGFyZSBvbmx5IHN1cHBvcnRlZCBvbiBXaW5kb3dzIHN5c3RlbXMuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpbmRvd3Mgb25seSBzdXBwb3J0cyB0aGUgTVNJIHBhY2thZ2UgdHlwZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5wYWNrYWdlTmFtZSAmJiAhWydycG0nLCAnbXNpJ10uaW5jbHVkZXModGhpcy50eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYWNrYWdlIG5hbWUgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGFsbCBwYWNrYWdlIHR5cGVzIGJlc2lkZXMgUlBNIGFuZCBNU0kuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZU5hbWUgPSB0aGlzLnBhY2thZ2VOYW1lIHx8IGAke29wdGlvbnMuaW5kZXh9YC5wYWRTdGFydCgzLCAnMCcpO1xuXG4gICAgZm9yIChjb25zdCBoYW5kbGUgb2YgdGhpcy5zZXJ2aWNlSGFuZGxlcyA/PyBbXSkge1xuICAgICAgaGFuZGxlLl9hZGRQYWNrYWdlKHRoaXMudHlwZSwgcGFja2FnZU5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgW3RoaXMudHlwZV06IHtcbiAgICAgICAgICBbcGFja2FnZU5hbWVdOiB0aGlzLnJlbmRlclBhY2thZ2VWZXJzaW9ucygpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlclBhY2thZ2VWZXJzaW9ucygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb25zO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYW4gSW5pdFNlcnZpY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0U2VydmljZU9wdGlvbnMge1xuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgdGhpcyBzZXJ2aWNlXG4gICAqXG4gICAqIFNldCB0byB0cnVlIHRvIGVuc3VyZSB0aGF0IHRoZSBzZXJ2aWNlIHdpbGwgYmUgc3RhcnRlZCBhdXRvbWF0aWNhbGx5IHVwb24gYm9vdC5cbiAgICpcbiAgICogU2V0IHRvIGZhbHNlIHRvIGVuc3VyZSB0aGF0IHRoZSBzZXJ2aWNlIHdpbGwgbm90IGJlIHN0YXJ0ZWQgYXV0b21hdGljYWxseSB1cG9uIGJvb3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdHJ1ZSBpZiB1c2VkIGluIGBJbml0U2VydmljZS5lbmFibGUoKWAsIG5vIGNoYW5nZSB0byBzZXJ2aWNlXG4gICAqIHN0YXRlIGlmIHVzZWQgaW4gYEluaXRTZXJ2aWNlLmZyb21PcHRpb25zKClgLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE1ha2Ugc3VyZSB0aGlzIHNlcnZpY2UgaXMgcnVubmluZyBvciBub3QgcnVubmluZyBhZnRlciBjZm4taW5pdCBmaW5pc2hlcy5cbiAgICpcbiAgICogU2V0IHRvIHRydWUgdG8gZW5zdXJlIHRoYXQgdGhlIHNlcnZpY2UgaXMgcnVubmluZyBhZnRlciBjZm4taW5pdCBmaW5pc2hlcy5cbiAgICpcbiAgICogU2V0IHRvIGZhbHNlIHRvIGVuc3VyZSB0aGF0IHRoZSBzZXJ2aWNlIGlzIG5vdCBydW5uaW5nIGFmdGVyIGNmbi1pbml0IGZpbmlzaGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHNhbWUgdmFsdWUgYXMgYGVuYWJsZWRgLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5zdXJlUnVubmluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgc2VydmljZSB3aGVuIHRoZSBhY3Rpb25zIHJlZ2lzdGVyZWQgaW50byB0aGUgcmVzdGFydEhhbmRsZSBoYXZlIGJlZW4gcGVyZm9ybWVkXG4gICAqXG4gICAqIFJlZ2lzdGVyIGFjdGlvbnMgaW50byB0aGUgcmVzdGFydEhhbmRsZSBieSBwYXNzaW5nIGl0IHRvIGBJbml0RmlsZWAsIGBJbml0Q29tbWFuZGAsXG4gICAqIGBJbml0UGFja2FnZWAgYW5kIGBJbml0U291cmNlYCBvYmplY3RzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbGVzIHRyaWdnZXIgcmVzdGFydFxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJlc3RhcnRIYW5kbGU/OiBJbml0U2VydmljZVJlc3RhcnRIYW5kbGU7XG59XG5cbi8qKlxuICogQSBzZXJ2aWNlcyB0aGF0IGJlIGVuYWJsZWQsIGRpc2FibGVkIG9yIHJlc3RhcnRlZCB3aGVuIHRoZSBpbnN0YW5jZSBpcyBsYXVuY2hlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRTZXJ2aWNlIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuICAvKipcbiAgICogRW5hYmxlIGFuZCBzdGFydCB0aGUgZ2l2ZW4gc2VydmljZSwgb3B0aW9uYWxseSByZXN0YXJ0aW5nIGl0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGVuYWJsZShzZXJ2aWNlTmFtZTogc3RyaW5nLCBvcHRpb25zOiBJbml0U2VydmljZU9wdGlvbnMgPSB7fSk6IEluaXRTZXJ2aWNlIHtcbiAgICBjb25zdCB7IGVuYWJsZWQsIGVuc3VyZVJ1bm5pbmcsIC4uLm90aGVyT3B0aW9ucyB9ID0gb3B0aW9ucztcbiAgICByZXR1cm4gbmV3IEluaXRTZXJ2aWNlKHNlcnZpY2VOYW1lLCB7XG4gICAgICBlbmFibGVkOiBlbmFibGVkID8/IHRydWUsXG4gICAgICBlbnN1cmVSdW5uaW5nOiBlbnN1cmVSdW5uaW5nID8/IGVuYWJsZWQgPz8gdHJ1ZSxcbiAgICAgIC4uLm90aGVyT3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIGFuZCBzdG9wIHRoZSBnaXZlbiBzZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGRpc2FibGUoc2VydmljZU5hbWU6IHN0cmluZyk6IEluaXRTZXJ2aWNlIHtcbiAgICByZXR1cm4gbmV3IEluaXRTZXJ2aWNlKHNlcnZpY2VOYW1lLCB7IGVuYWJsZWQ6IGZhbHNlLCBlbnN1cmVSdW5uaW5nOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBlbGVtZW50VHlwZSA9IEluaXRFbGVtZW50VHlwZS5TRVJWSUNFLnRvU3RyaW5nKCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZU9wdGlvbnM6IEluaXRTZXJ2aWNlT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgY29uc3Qgc2VydmljZU1hbmFnZXIgPSBvcHRpb25zLnBsYXRmb3JtID09PSBJbml0UGxhdGZvcm0uTElOVVggPyAnc3lzdmluaXQnIDogJ3dpbmRvd3MnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBbc2VydmljZU1hbmFnZXJdOiB7XG4gICAgICAgICAgW3RoaXMuc2VydmljZU5hbWVdOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLnNlcnZpY2VPcHRpb25zLmVuYWJsZWQsXG4gICAgICAgICAgICBlbnN1cmVSdW5uaW5nOiB0aGlzLnNlcnZpY2VPcHRpb25zLmVuc3VyZVJ1bm5pbmcsXG4gICAgICAgICAgICAuLi50aGlzLnNlcnZpY2VPcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlPy5fcmVuZGVyUmVzdGFydEhhbmRsZXMoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIGFuIEluaXRTb3VyY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0U291cmNlT3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIGdpdmVuIHNlcnZpY2VzIGFmdGVyIHRoaXMgYXJjaGl2ZSBoYXMgYmVlbiBleHRyYWN0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3QgcmVzdGFydCBhbnkgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJlc3RhcnRIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW107XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBvcHRpb25zIGZvciBhbiBJbml0U291cmNlIHRoYXQgYnVpbGRzIGFuIGFzc2V0IGZyb20gbG9jYWwgZmlsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5pdFNvdXJjZUFzc2V0T3B0aW9ucyBleHRlbmRzIEluaXRTb3VyY2VPcHRpb25zLCBzM19hc3NldHMuQXNzZXRPcHRpb25zIHtcblxufVxuXG4vKipcbiAqIEV4dHJhY3QgYW4gYXJjaGl2ZSBpbnRvIGEgZGlyZWN0b3J5XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbml0U291cmNlIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuICAvKipcbiAgICogUmV0cmlldmUgYSBVUkwgYW5kIGV4dHJhY3QgaXQgaW50byB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21VcmwodGFyZ2V0RGlyZWN0b3J5OiBzdHJpbmcsIHVybDogc3RyaW5nLCBvcHRpb25zOiBJbml0U291cmNlT3B0aW9ucyA9IHt9KTogSW5pdFNvdXJjZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRTb3VyY2Uge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29uZmlnOiB7IFt0aGlzLnRhcmdldERpcmVjdG9yeV06IHVybCB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0odGFyZ2V0RGlyZWN0b3J5LCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBhIEdpdEh1YiBicmFuY2ggaW50byBhIGdpdmVuIGRpcmVjdG9yeVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tR2l0SHViKHRhcmdldERpcmVjdG9yeTogc3RyaW5nLCBvd25lcjogc3RyaW5nLCByZXBvOiBzdHJpbmcsIHJlZlNwZWM/OiBzdHJpbmcsIG9wdGlvbnM6IEluaXRTb3VyY2VPcHRpb25zID0ge30pOiBJbml0U291cmNlIHtcbiAgICByZXR1cm4gSW5pdFNvdXJjZS5mcm9tVXJsKHRhcmdldERpcmVjdG9yeSwgYGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L3RhcmJhbGwvJHtyZWZTcGVjID8/ICdtYXN0ZXInfWAsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYW4gYXJjaGl2ZSBzdG9yZWQgaW4gYW4gUzMgYnVja2V0IGludG8gdGhlIGdpdmVuIGRpcmVjdG9yeVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUzNPYmplY3QodGFyZ2V0RGlyZWN0b3J5OiBzdHJpbmcsIGJ1Y2tldDogczMuSUJ1Y2tldCwga2V5OiBzdHJpbmcsIG9wdGlvbnM6IEluaXRTb3VyY2VPcHRpb25zID0ge30pOiBJbml0U291cmNlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdFNvdXJjZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIGJ1Y2tldC5ncmFudFJlYWQoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlLCBrZXkpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29uZmlnOiB7IFt0aGlzLnRhcmdldERpcmVjdG9yeV06IGJ1Y2tldC51cmxGb3JPYmplY3Qoa2V5KSB9LFxuICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzdGFuZGFyZFMzQXV0aChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGJ1Y2tldC5idWNrZXROYW1lKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KHRhcmdldERpcmVjdG9yeSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBJbml0U291cmNlIGZyb20gYW4gYXNzZXQgY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBwYXRoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQodGFyZ2V0RGlyZWN0b3J5OiBzdHJpbmcsIHBhdGg6IHN0cmluZywgb3B0aW9uczogSW5pdFNvdXJjZUFzc2V0T3B0aW9ucyA9IHt9KTogSW5pdFNvdXJjZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRTb3VyY2Uge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoYmluZE9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucykge1xuICAgICAgICBjb25zdCBhc3NldCA9IG5ldyBzM19hc3NldHMuQXNzZXQoYmluZE9wdGlvbnMuc2NvcGUsIGAke3RhcmdldERpcmVjdG9yeX1Bc3NldGAsIHtcbiAgICAgICAgICBwYXRoLFxuICAgICAgICAgIC4uLmJpbmRPcHRpb25zLFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXQuZ3JhbnRSZWFkKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHsgW3RoaXMudGFyZ2V0RGlyZWN0b3J5XTogYXNzZXQuaHR0cFVybCB9LFxuICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzdGFuZGFyZFMzQXV0aChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGFzc2V0LnMzQnVja2V0TmFtZSksXG4gICAgICAgICAgYXNzZXRIYXNoOiBhc3NldC5hc3NldEhhc2gsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSh0YXJnZXREaXJlY3RvcnksIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGEgZGlyZWN0b3J5IGZyb20gYW4gZXhpc3RpbmcgZGlyZWN0b3J5IGFzc2V0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRXhpc3RpbmdBc3NldCh0YXJnZXREaXJlY3Rvcnk6IHN0cmluZywgYXNzZXQ6IHMzX2Fzc2V0cy5Bc3NldCwgb3B0aW9uczogSW5pdFNvdXJjZU9wdGlvbnMgPSB7fSk6IEluaXRTb3VyY2Uge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0U291cmNlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgYXNzZXQuZ3JhbnRSZWFkKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHsgW3RoaXMudGFyZ2V0RGlyZWN0b3J5XTogYXNzZXQuaHR0cFVybCB9LFxuICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBzdGFuZGFyZFMzQXV0aChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGFzc2V0LnMzQnVja2V0TmFtZSksXG4gICAgICAgICAgYXNzZXRIYXNoOiBhc3NldC5hc3NldEhhc2gsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSh0YXJnZXREaXJlY3RvcnksIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBlbGVtZW50VHlwZSA9IEluaXRFbGVtZW50VHlwZS5TT1VSQ0UudG9TdHJpbmcoKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0YXJnZXREaXJlY3Rvcnk6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlSGFuZGxlcz86IEluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9iaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZSBvZiB0aGlzLnNlcnZpY2VIYW5kbGVzID8/IFtdKSB7XG4gICAgICBoYW5kbGUuX2FkZFNvdXJjZSh0aGlzLnRhcmdldERpcmVjdG9yeSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZWdhdGUgYWN0dWFsIGJpbmQgdG8gc3ViY2xhc3Nlc1xuICAgIHJldHVybiB0aGlzLl9kb0JpbmQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgYWN0dWFsIGJpbmQgYW5kIHJlbmRlclxuICAgKlxuICAgKiBUaGlzIGlzIGluIGEgc2Vjb25kIG1ldGhvZCBzbyB0aGUgc3VwZXJjbGFzcyBjYW4gZ3VhcmFudGVlIHRoYXRcbiAgICogdGhlIGNvbW1vbiB3b3JrIG9mIHJlZ2lzdGVyaW5nIGludG8gc2VydmljZUhhbmRsZXMgY2Fubm90IGJlIGZvcmdvdHRlbi5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2RvQmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZztcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBzdGFuZGFyZCBTMyBhdXRoIGJsb2NrIGZvciB1c2UgaW4gQVdTOjpDbG91ZEZvcm1hdGlvbjo6QXV0aGVudGljYXRpb25cbiAqXG4gKiBUaGlzIGJsb2NrIGlzIHRoZSBzYW1lIGV2ZXJ5IHRpbWUgKG1vZHVsbyBidWNrZXQgbmFtZSksIHNvIGl0IGhhcyB0aGUgc2FtZVxuICoga2V5IGV2ZXJ5IHRpbWUgc28gdGhlIGJsb2NrcyBhcmUgbWVyZ2VkIGludG8gb25lIGluIHRoZSBmaW5hbCByZW5kZXIuXG4gKi9cbmZ1bmN0aW9uIHN0YW5kYXJkUzNBdXRoKHJvbGU6IGlhbS5JUm9sZSwgYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiB7XG4gICAgUzNBY2Nlc3NDcmVkczoge1xuICAgICAgdHlwZTogJ1MzJyxcbiAgICAgIHJvbGVOYW1lOiByb2xlLnJvbGVOYW1lLFxuICAgICAgYnVja2V0czogW2J1Y2tldE5hbWVdLFxuICAgIH0sXG4gIH07XG59XG4iXX0=