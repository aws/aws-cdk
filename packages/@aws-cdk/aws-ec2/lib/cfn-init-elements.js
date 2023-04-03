"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceManager = exports.InitSource = exports.InitService = exports.InitPackage = exports.InitUser = exports.InitGroup = exports.InitFile = exports.InitCommand = exports.InitCommandWaitDuration = exports.InitElement = exports.InitServiceRestartHandle = void 0;
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
_a = JSII_RTTI_SYMBOL_1;
InitServiceRestartHandle[_a] = { fqn: "@aws-cdk/aws-ec2.InitServiceRestartHandle", version: "0.0.0" };
exports.InitServiceRestartHandle = InitServiceRestartHandle;
/**
 * Base class for all CloudFormation Init elements
 */
class InitElement {
}
_b = JSII_RTTI_SYMBOL_1;
InitElement[_b] = { fqn: "@aws-cdk/aws-ec2.InitElement", version: "0.0.0" };
exports.InitElement = InitElement;
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
_c = JSII_RTTI_SYMBOL_1;
InitCommandWaitDuration[_c] = { fqn: "@aws-cdk/aws-ec2.InitCommandWaitDuration", version: "0.0.0" };
exports.InitCommandWaitDuration = InitCommandWaitDuration;
/**
 * Command to execute on the instance
 */
class InitCommand extends InitElement {
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
    constructor(command, options) {
        super();
        this.command = command;
        this.options = options;
        this.elementType = cfn_init_internal_1.InitElementType.COMMAND.toString();
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
_d = JSII_RTTI_SYMBOL_1;
InitCommand[_d] = { fqn: "@aws-cdk/aws-ec2.InitCommand", version: "0.0.0" };
exports.InitCommand = InitCommand;
/**
 * Create files on the EC2 instance.
 */
class InitFile extends InitElement {
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
_e = JSII_RTTI_SYMBOL_1;
InitFile[_e] = { fqn: "@aws-cdk/aws-ec2.InitFile", version: "0.0.0" };
exports.InitFile = InitFile;
/**
 * Create Linux/UNIX groups and assign group IDs.
 *
 * Not supported for Windows systems.
 */
class InitGroup extends InitElement {
    /**
     * Create a group from its name, and optionally, group id
     */
    static fromName(groupName, groupId) {
        return new InitGroup(groupName, groupId);
    }
    constructor(groupName, groupId) {
        super();
        this.groupName = groupName;
        this.groupId = groupId;
        this.elementType = cfn_init_internal_1.InitElementType.GROUP.toString();
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
_f = JSII_RTTI_SYMBOL_1;
InitGroup[_f] = { fqn: "@aws-cdk/aws-ec2.InitGroup", version: "0.0.0" };
exports.InitGroup = InitGroup;
/**
 * Create Linux/UNIX users and to assign user IDs.
 *
 * Users are created as non-interactive system users with a shell of
 * /sbin/nologin. This is by design and cannot be modified.
 *
 * Not supported for Windows systems.
 */
class InitUser extends InitElement {
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
_g = JSII_RTTI_SYMBOL_1;
InitUser[_g] = { fqn: "@aws-cdk/aws-ec2.InitUser", version: "0.0.0" };
exports.InitUser = InitUser;
/**
 * A package to be installed during cfn-init time
 */
class InitPackage extends InitElement {
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
    constructor(type, versions, packageName, serviceHandles) {
        super();
        this.type = type;
        this.versions = versions;
        this.packageName = packageName;
        this.serviceHandles = serviceHandles;
        this.elementType = cfn_init_internal_1.InitElementType.PACKAGE.toString();
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
_h = JSII_RTTI_SYMBOL_1;
InitPackage[_h] = { fqn: "@aws-cdk/aws-ec2.InitPackage", version: "0.0.0" };
exports.InitPackage = InitPackage;
/**
 * A services that be enabled, disabled or restarted when the instance is launched.
 */
class InitService extends InitElement {
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
    /**
     * Install a systemd-compatible config file for the given service
     *
     * This is a helper function to create a simple systemd configuration
     * file that will allow running a service on the machine using `InitService.enable()`.
     *
     * Systemd allows many configuration options; this function does not pretend
     * to expose all of them. If you need advanced configuration options, you
     * can use `InitFile` to create exactly the configuration file you need
     * at `/etc/systemd/system/${serviceName}.service`.
     */
    static systemdConfigFile(serviceName, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SystemdConfigFileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.systemdConfigFile);
            }
            throw error;
        }
        if (!options.command.startsWith('/')) {
            throw new Error(`SystemD executables must use an absolute path, got '${options.command}'`);
        }
        const lines = [
            '[Unit]',
            ...(options.description ? [`Description=${options.description}`] : []),
            ...(options.afterNetwork ?? true ? ['After=network.target'] : []),
            '[Service]',
            `ExecStart=${options.command}`,
            ...(options.cwd ? [`WorkingDirectory=${options.cwd}`] : []),
            ...(options.user ? [`User=${options.user}`] : []),
            ...(options.group ? [`Group=${options.user}`] : []),
            ...(options.keepRunning ?? true ? ['Restart=always'] : []),
            '[Install]',
            'WantedBy=multi-user.target',
        ];
        return InitFile.fromString(`/etc/systemd/system/${serviceName}.service`, lines.join('\n'));
    }
    constructor(serviceName, serviceOptions) {
        super();
        this.serviceName = serviceName;
        this.serviceOptions = serviceOptions;
        this.elementType = cfn_init_internal_1.InitElementType.SERVICE.toString();
    }
    /** @internal */
    _bind(options) {
        const serviceManager = this.serviceOptions.serviceManager
            ?? (options.platform === cfn_init_internal_1.InitPlatform.LINUX ? ServiceManager.SYSVINIT : ServiceManager.WINDOWS);
        return {
            config: {
                [serviceManagerToString(serviceManager)]: {
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
_j = JSII_RTTI_SYMBOL_1;
InitService[_j] = { fqn: "@aws-cdk/aws-ec2.InitService", version: "0.0.0" };
exports.InitService = InitService;
/**
 * Extract an archive into a directory
 */
class InitSource extends InitElement {
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
    constructor(targetDirectory, serviceHandles) {
        super();
        this.targetDirectory = targetDirectory;
        this.serviceHandles = serviceHandles;
        this.elementType = cfn_init_internal_1.InitElementType.SOURCE.toString();
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
_k = JSII_RTTI_SYMBOL_1;
InitSource[_k] = { fqn: "@aws-cdk/aws-ec2.InitSource", version: "0.0.0" };
exports.InitSource = InitSource;
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
/**
 * The service manager that will be used by InitServices
 *
 * The value needs to match the service manager used by your operating
 * system.
 */
var ServiceManager;
(function (ServiceManager) {
    /**
     * Use SysVinit
     *
     * This is the default for Linux systems.
     */
    ServiceManager[ServiceManager["SYSVINIT"] = 0] = "SYSVINIT";
    /**
     * Use Windows
     *
     * This is the default for Windows systems.
     */
    ServiceManager[ServiceManager["WINDOWS"] = 1] = "WINDOWS";
    /**
     * Use systemd
     */
    ServiceManager[ServiceManager["SYSTEMD"] = 2] = "SYSTEMD";
})(ServiceManager = exports.ServiceManager || (exports.ServiceManager = {}));
function serviceManagerToString(x) {
    switch (x) {
        case ServiceManager.SYSTEMD: return 'systemd';
        case ServiceManager.SYSVINIT: return 'sysvinit';
        case ServiceManager.WINDOWS: return 'windows';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQtZWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taW5pdC1lbGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFHekIsb0RBQW9EO0FBQ3BELHdDQUF5QztBQUN6QyxtRUFBZ0g7QUFFaEg7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILE1BQWEsd0JBQXdCO0lBQXJDO1FBQ21CLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzVCLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQzlCLGFBQVEsR0FBNkIsRUFBRSxDQUFDO0tBbUQxRDtJQWpEQzs7O09BR0c7SUFDSSxXQUFXLENBQUMsR0FBVztRQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7OztPQUdHO0lBQ0ksUUFBUSxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM3QjtJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxHQUFXO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRDs7O09BR0c7SUFDSSxXQUFXLENBQUMsV0FBbUIsRUFBRSxHQUFXO1FBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEM7SUFFRDs7O09BR0c7SUFDSSxxQkFBcUI7UUFD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LENBQUM7S0FJL0Q7SUFFRCxnQkFBZ0I7SUFDVCxLQUFLLENBQUMsT0FBd0I7UUFDbkMsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsRUFBRTtZQUM5QyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN6QztRQUVELHFDQUFxQztRQUNyQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDOUI7Ozs7QUF6Rm1CLGdDQUFVO0FBcUdoQzs7Ozs7R0FLRztBQUNILFNBQVMsY0FBYyxDQUFDLElBQWUsRUFBRSxVQUFrQjtJQUN6RCxPQUFPO1FBQ0wsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLElBQUk7WUFDVixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO1NBQ3RCO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILElBQVksY0FtQlg7QUFuQkQsV0FBWSxjQUFjO0lBQ3hCOzs7O09BSUc7SUFDSCwyREFBUSxDQUFBO0lBRVI7Ozs7T0FJRztJQUNILHlEQUFPLENBQUE7SUFFUDs7T0FFRztJQUNILHlEQUFPLENBQUE7QUFDVCxDQUFDLEVBbkJXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBbUJ6QjtBQUVELFNBQVMsc0JBQXNCLENBQUMsQ0FBaUI7SUFDL0MsUUFBUSxDQUFDLEVBQUU7UUFDVCxLQUFLLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQztRQUM5QyxLQUFLLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FBQztRQUNoRCxLQUFLLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQztLQUMvQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNfYXNzZXRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEluaXRCaW5kT3B0aW9ucywgSW5pdEVsZW1lbnRDb25maWcsIEluaXRFbGVtZW50VHlwZSwgSW5pdFBsYXRmb3JtIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1pbml0LWludGVybmFsJztcblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHJlYXNvbnMgdG8gcmVzdGFydCBhbiBJbml0U2VydmljZVxuICpcbiAqIFBhc3MgYW4gaW5zdGFuY2Ugb2YgdGhpcyBvYmplY3QgdG8gdGhlIGBJbml0RmlsZWAsIGBJbml0Q29tbWFuZGAsXG4gKiBgSW5pdFNvdXJjZWAgYW5kIGBJbml0UGFja2FnZWAgb2JqZWN0cywgYW5kIGZpbmFsbHkgdG8gYW4gYEluaXRTZXJ2aWNlYFxuICogaXRzZWxmIHRvIGNhdXNlIHRoZSBhY3Rpb25zIChmaWxlcywgY29tbWFuZHMsIHNvdXJjZXMsIGFuZCBwYWNrYWdlcylcbiAqIHRvIHRyaWdnZXIgYSByZXN0YXJ0IG9mIHRoZSBzZXJ2aWNlLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nIHdpbGwgcnVuIGEgY3VzdG9tIGNvbW1hbmQgdG8gaW5zdGFsbCBOZ2lueCxcbiAqIGFuZCB0cmlnZ2VyIHRoZSBuZ2lueCBzZXJ2aWNlIHRvIGJlIHJlc3RhcnRlZCBhZnRlciB0aGUgY29tbWFuZCBoYXMgcnVuLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBoYW5kbGUgPSBuZXcgZWMyLkluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZSgpO1xuICogZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tRWxlbWVudHMoXG4gKiAgIGVjMi5Jbml0Q29tbWFuZC5zaGVsbENvbW1hbmQoJy91c3IvYmluL2N1c3RvbS1uZ2lueC1pbnN0YWxsLnNoJywgeyBzZXJ2aWNlUmVzdGFydEhhbmRsZXM6IFtoYW5kbGVdIH0pLFxuICogICBlYzIuSW5pdFNlcnZpY2UuZW5hYmxlKCduZ2lueCcsIHsgc2VydmljZVJlc3RhcnRIYW5kbGU6IGhhbmRsZSB9KSxcbiAqICk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29tbWFuZHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGZpbGVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBzb3VyY2VzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBwYWNrYWdlczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge307XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbW1hbmQga2V5IHRvIHRoZSByZXN0YXJ0IHNldFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkQ29tbWFuZChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNvbW1hbmRzLnB1c2goa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBmaWxlIGtleSB0byB0aGUgcmVzdGFydCBzZXRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2FkZEZpbGUoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlcy5wdXNoKGtleSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc291cmNlIGtleSB0byB0aGUgcmVzdGFydCBzZXRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2FkZFNvdXJjZShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZXMucHVzaChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBhY2thZ2Uga2V5IHRvIHRoZSByZXN0YXJ0IHNldFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkUGFja2FnZShwYWNrYWdlVHlwZTogc3RyaW5nLCBrZXk6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5wYWNrYWdlc1twYWNrYWdlVHlwZV0pIHtcbiAgICAgIHRoaXMucGFja2FnZXNbcGFja2FnZVR5cGVdID0gW107XG4gICAgfVxuICAgIHRoaXMucGFja2FnZXNbcGFja2FnZVR5cGVdLnB1c2goa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHJlc3RhcnQgaGFuZGxlcyBmb3IgdXNlIGluIGFuIEluaXRTZXJ2aWNlIGRlY2xhcmF0aW9uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9yZW5kZXJSZXN0YXJ0SGFuZGxlcygpOiBhbnkge1xuICAgIGNvbnN0IG5vbkVtcHR5ID0gPEE+KHg6IEFbXSkgPT4geC5sZW5ndGggPiAwID8geCA6IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiB7XG4gICAgICBjb21tYW5kczogbm9uRW1wdHkodGhpcy5jb21tYW5kcyksXG4gICAgICBmaWxlczogbm9uRW1wdHkodGhpcy5maWxlcyksXG4gICAgICBwYWNrYWdlczogT2JqZWN0LmtleXModGhpcy5wYWNrYWdlcykubGVuZ3RoID4gMCA/IHRoaXMucGFja2FnZXMgOiB1bmRlZmluZWQsXG4gICAgICBzb3VyY2VzOiBub25FbXB0eSh0aGlzLnNvdXJjZXMpLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgQ2xvdWRGb3JtYXRpb24gSW5pdCBlbGVtZW50c1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5pdEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbml0IGVsZW1lbnQgdHlwZSBmb3IgdGhpcyBlbGVtZW50LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnRUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBJbml0IGNvbmZpZyBpcyBiZWluZyBjb25zdW1lZC4gUmVuZGVycyB0aGUgQ2xvdWRGb3JtYXRpb25cbiAgICogcmVwcmVzZW50YXRpb24gb2YgdGhpcyBpbml0IGVsZW1lbnQsIGFuZCBjYWxjdWxhdGVzIGFueSBhdXRoZW50aWNhdGlvblxuICAgKiBwcm9wZXJ0aWVzIG5lZWRlZCwgaWYgYW55LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBiaW5kIG9wdGlvbnMgZm9yIHRoZSBlbGVtZW50LlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZztcblxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIEluaXRDb21tYW5kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5pdENvbW1hbmRPcHRpb25zIHtcbiAgLyoqXG4gICAqIElkZW50aWZpZXIga2V5IGZvciB0aGlzIGNvbW1hbmRcbiAgICpcbiAgICogQ29tbWFuZHMgYXJlIGV4ZWN1dGVkIGluIGxleGljb2dyYXBoaWNhbCBvcmRlciBvZiB0aGVpciBrZXkgbmFtZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYmFzZWQgb24gaW5kZXhcbiAgICovXG4gIHJlYWRvbmx5IGtleT86IHN0cmluZztcblxuICAvKipcbiAgICogU2V0cyBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZm9yIHRoZSBjb21tYW5kLlxuICAgKlxuICAgKiBUaGlzIHByb3BlcnR5IG92ZXJ3cml0ZXMsIHJhdGhlciB0aGFuIGFwcGVuZHMsIHRoZSBleGlzdGluZyBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2UgY3VycmVudCBlbnZpcm9ubWVudFxuICAgKi9cbiAgcmVhZG9ubHkgZW52PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAvKipcbiAgICogVGhlIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlIGRlZmF1bHQgd29ya2luZyBkaXJlY3RvcnlcbiAgICovXG4gIHJlYWRvbmx5IGN3ZD86IHN0cmluZztcblxuICAvKipcbiAgICogQ29tbWFuZCB0byBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGNvbW1hbmQgc2hvdWxkIGJlIHJ1blxuICAgKlxuICAgKiBJZiB0aGUgdGVzdCBwYXNzZXMgKGV4aXRzIHdpdGggZXJyb3IgY29kZSBvZiAwKSwgdGhlIGNvbW1hbmQgaXMgcnVuLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsd2F5cyBydW4gdGhlIGNvbW1hbmRcbiAgICovXG4gIHJlYWRvbmx5IHRlc3RDbWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnRpbnVlIHJ1bm5pbmcgaWYgdGhpcyBjb21tYW5kIGZhaWxzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpZ25vcmVFcnJvcnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZHVyYXRpb24gdG8gd2FpdCBhZnRlciBhIGNvbW1hbmQgaGFzIGZpbmlzaGVkIGluIGNhc2UgdGhlIGNvbW1hbmQgY2F1c2VzIGEgcmVib290LlxuICAgKlxuICAgKiBTZXQgdGhpcyB2YWx1ZSB0byBgSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ubm9uZSgpYCBpZiB5b3UgZG8gbm90IHdhbnQgdG8gd2FpdCBmb3IgZXZlcnkgY29tbWFuZDtcbiAgICogYEluaXRDb21tYW5kV2FpdER1cmF0aW9uLmZvcmV2ZXIoKWAgZGlyZWN0cyBjZm4taW5pdCB0byBleGl0IGFuZCByZXN1bWUgb25seSBhZnRlciB0aGUgcmVib290IGlzIGNvbXBsZXRlLlxuICAgKlxuICAgKiBGb3IgV2luZG93cyBzeXN0ZW1zIG9ubHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gNjAgc2Vjb25kc1xuICAgKi9cbiAgcmVhZG9ubHkgd2FpdEFmdGVyQ29tcGxldGlvbj86IEluaXRDb21tYW5kV2FpdER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBnaXZlbiBzZXJ2aWNlKHMpIGFmdGVyIHRoaXMgY29tbWFuZCBoYXMgcnVuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHJlc3RhcnQgYW55IHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VSZXN0YXJ0SGFuZGxlcz86IEluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZVtdO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkdXJhdGlvbiB0byB3YWl0IGFmdGVyIGEgY29tbWFuZCBoYXMgZmluaXNoZWQsIGluIGNhc2Ugb2YgYSByZWJvb3QgKFdpbmRvd3Mgb25seSkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbml0Q29tbWFuZFdhaXREdXJhdGlvbiB7XG4gIC8qKiBXYWl0IGZvciBhIHNwZWNpZmllZCBkdXJhdGlvbiBhZnRlciBhIGNvbW1hbmQuICovXG4gIHB1YmxpYyBzdGF0aWMgb2YoZHVyYXRpb246IER1cmF0aW9uKTogSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0Q29tbWFuZFdhaXREdXJhdGlvbiB7XG4gICAgICAvKiogQGludGVybmFsICovXG4gICAgICBwdWJsaWMgX3JlbmRlcigpIHsgcmV0dXJuIGR1cmF0aW9uLnRvU2Vjb25kcygpOyB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqIERvIG5vdCB3YWl0IGZvciB0aGlzIGNvbW1hbmQuICovXG4gIHB1YmxpYyBzdGF0aWMgbm9uZSgpOiBJbml0Q29tbWFuZFdhaXREdXJhdGlvbiB7XG4gICAgcmV0dXJuIEluaXRDb21tYW5kV2FpdER1cmF0aW9uLm9mKER1cmF0aW9uLnNlY29uZHMoMCkpO1xuICB9XG5cbiAgLyoqIGNmbi1pbml0IHdpbGwgZXhpdCBhbmQgcmVzdW1lIG9ubHkgYWZ0ZXIgYSByZWJvb3QuICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yZXZlcigpOiBJbml0Q29tbWFuZFdhaXREdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRDb21tYW5kV2FpdER1cmF0aW9uIHtcbiAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgIHB1YmxpYyBfcmVuZGVyKCkgeyByZXR1cm4gJ2ZvcmV2ZXInOyB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0byBhIENsb3VkRm9ybWF0aW9uIHZhbHVlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfcmVuZGVyKCk6IGFueTtcbn1cblxuLyoqXG4gKiBDb21tYW5kIHRvIGV4ZWN1dGUgb24gdGhlIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBJbml0Q29tbWFuZCBleHRlbmRzIEluaXRFbGVtZW50IHtcbiAgLyoqXG4gICAqIFJ1biBhIHNoZWxsIGNvbW1hbmRcbiAgICpcbiAgICogUmVtZW1iZXIgdGhhdCBzb21lIGNoYXJhY3RlcnMgbGlrZSBgJmAsIGB8YCwgYDtgLCBgPmAgZXRjLiBoYXZlIHNwZWNpYWwgbWVhbmluZyBpbiBhIHNoZWxsIGFuZFxuICAgKiBuZWVkIHRvIGJlIHByZWNlZGVkIGJ5IGEgYFxcYCBpZiB5b3Ugd2FudCB0byB0cmVhdCB0aGVtIGFzIHBhcnQgb2YgYSBmaWxlbmFtZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2hlbGxDb21tYW5kKHNoZWxsQ29tbWFuZDogc3RyaW5nLCBvcHRpb25zOiBJbml0Q29tbWFuZE9wdGlvbnMgPSB7fSk6IEluaXRDb21tYW5kIHtcbiAgICByZXR1cm4gbmV3IEluaXRDb21tYW5kKHNoZWxsQ29tbWFuZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUnVuIGEgY29tbWFuZCBmcm9tIGFuIGFyZ3YgYXJyYXlcbiAgICpcbiAgICogWW91IGRvIG5vdCBuZWVkIHRvIGVzY2FwZSBzcGFjZSBjaGFyYWN0ZXJzIG9yIGVuY2xvc2UgY29tbWFuZCBwYXJhbWV0ZXJzIGluIHF1b3Rlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXJndkNvbW1hbmQoYXJndjogc3RyaW5nW10sIG9wdGlvbnM6IEluaXRDb21tYW5kT3B0aW9ucyA9IHt9KTogSW5pdENvbW1hbmQge1xuICAgIGlmIChhcmd2Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVmaW5lIGFyZ3ZDb21tYW5kIHdpdGggYW4gZW1wdHkgYXJndW1lbnRzJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW5pdENvbW1hbmQoYXJndiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFR5cGUgPSBJbml0RWxlbWVudFR5cGUuQ09NTUFORC50b1N0cmluZygpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb21tYW5kOiBzdHJpbmdbXSB8IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBJbml0Q29tbWFuZE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX2JpbmQob3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWcge1xuICAgIGNvbnN0IGNvbW1hbmRLZXkgPSB0aGlzLm9wdGlvbnMua2V5IHx8IGAke29wdGlvbnMuaW5kZXh9YC5wYWRTdGFydCgzLCAnMCcpOyAvLyAwMDEsIDAwNSwgZXRjLlxuXG4gICAgaWYgKG9wdGlvbnMucGxhdGZvcm0gIT09IEluaXRQbGF0Zm9ybS5XSU5ET1dTICYmIHRoaXMub3B0aW9ucy53YWl0QWZ0ZXJDb21wbGV0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tbWFuZCAnJHt0aGlzLmNvbW1hbmR9JzogJ3dhaXRBZnRlckNvbXBsZXRpb24nIGlzIG9ubHkgdmFsaWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5gKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGhhbmRsZSBvZiB0aGlzLm9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzID8/IFtdKSB7XG4gICAgICBoYW5kbGUuX2FkZENvbW1hbmQoY29tbWFuZEtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBbY29tbWFuZEtleV06IHtcbiAgICAgICAgICBjb21tYW5kOiB0aGlzLmNvbW1hbmQsXG4gICAgICAgICAgZW52OiB0aGlzLm9wdGlvbnMuZW52LFxuICAgICAgICAgIGN3ZDogdGhpcy5vcHRpb25zLmN3ZCxcbiAgICAgICAgICB0ZXN0OiB0aGlzLm9wdGlvbnMudGVzdENtZCxcbiAgICAgICAgICBpZ25vcmVFcnJvcnM6IHRoaXMub3B0aW9ucy5pZ25vcmVFcnJvcnMsXG4gICAgICAgICAgd2FpdEFmdGVyQ29tcGxldGlvbjogdGhpcy5vcHRpb25zLndhaXRBZnRlckNvbXBsZXRpb24/Ll9yZW5kZXIoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgSW5pdEZpbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0RmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG93bmluZyBncm91cCBmb3IgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBOb3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzIHN5c3RlbXMuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdyb290J1xuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXA/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBvd25pbmcgdXNlciBmb3IgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBOb3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzIHN5c3RlbXMuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdyb290J1xuICAgKi9cbiAgcmVhZG9ubHkgb3duZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgc2l4LWRpZ2l0IG9jdGFsIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgbW9kZSBmb3IgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBVc2UgdGhlIGZpcnN0IHRocmVlIGRpZ2l0cyBmb3Igc3ltbGlua3MgYW5kIHRoZSBsYXN0IHRocmVlIGRpZ2l0cyBmb3JcbiAgICogc2V0dGluZyBwZXJtaXNzaW9ucy4gVG8gY3JlYXRlIGEgc3ltbGluaywgc3BlY2lmeSAxMjB4eHgsIHdoZXJlIHh4eFxuICAgKiBkZWZpbmVzIHRoZSBwZXJtaXNzaW9ucyBvZiB0aGUgdGFyZ2V0IGZpbGUuIFRvIHNwZWNpZnkgcGVybWlzc2lvbnMgZm9yIGFcbiAgICogZmlsZSwgdXNlIHRoZSBsYXN0IHRocmVlIGRpZ2l0cywgc3VjaCBhcyAwMDA2NDQuXG4gICAqXG4gICAqIE5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3Mgc3lzdGVtcy5cbiAgICpcbiAgICogQGRlZmF1bHQgJzAwMDY0NCdcbiAgICovXG4gIHJlYWRvbmx5IG1vZGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGlubGluZWQgY29udGVudCAoZnJvbSBhIHN0cmluZyBvciBmaWxlKSBzaG91bGQgYmUgdHJlYXRlZCBhcyBiYXNlNjQgZW5jb2RlZC5cbiAgICogT25seSBhcHBsaWNhYmxlIGZvciBpbmxpbmVkIHN0cmluZyBhbmQgZmlsZSBjb250ZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYmFzZTY0RW5jb2RlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIGdpdmVuIHNlcnZpY2UgYWZ0ZXIgdGhpcyBmaWxlIGhhcyBiZWVuIHdyaXR0ZW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3QgcmVzdGFydCBhbnkgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJlc3RhcnRIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW107XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBvcHRpb25zIGZvciBjcmVhdGluZyBhbiBJbml0RmlsZSBmcm9tIGFuIGFzc2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluaXRGaWxlQXNzZXRPcHRpb25zIGV4dGVuZHMgSW5pdEZpbGVPcHRpb25zLCBzM19hc3NldHMuQXNzZXRPcHRpb25zIHtcbn1cblxuLyoqXG4gKiBDcmVhdGUgZmlsZXMgb24gdGhlIEVDMiBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluaXRGaWxlIGV4dGVuZHMgSW5pdEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBVc2UgYSBsaXRlcmFsIHN0cmluZyBhcyB0aGUgZmlsZSBjb250ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcoZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBvcHRpb25zOiBJbml0RmlsZU9wdGlvbnMgPSB7fSk6IEluaXRGaWxlIHtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5pdEZpbGUgJHtmaWxlTmFtZX06IGNhbm5vdCBjcmVhdGUgZW1wdHkgZmlsZS4gUGxlYXNlIHN1cHBseSBhdCBsZWFzdCBvbmUgY2hhcmFjdGVyIG9mIGNvbnRlbnQuYCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0RmlsZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29uZmlnOiB0aGlzLl9zdGFuZGFyZENvbmZpZyhvcHRpb25zLCBiaW5kT3B0aW9ucy5wbGF0Zm9ybSwge1xuICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgIGVuY29kaW5nOiB0aGlzLm9wdGlvbnMuYmFzZTY0RW5jb2RlZCA/ICdiYXNlNjQnIDogJ3BsYWluJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KGZpbGVOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhIHN5bWxpbmsgd2l0aCB0aGUgZ2l2ZW4gc3ltbGluayB0YXJnZXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3ltbGluayhmaWxlTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgY29uc3QgeyBtb2RlLCAuLi5vdGhlck9wdGlvbnMgfSA9IG9wdGlvbnM7XG4gICAgaWYgKG1vZGUgJiYgbW9kZS5zbGljZSgwLCAzKSAhPT0gJzEyMCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBtb2RlIGZvciBzeW1saW5rcyBtdXN0IGJlZ2luIHdpdGggMTIwWFhYJyk7XG4gICAgfVxuICAgIHJldHVybiBJbml0RmlsZS5mcm9tU3RyaW5nKGZpbGVOYW1lLCB0YXJnZXQsIHsgbW9kZTogKG1vZGUgfHwgJzEyMDY0NCcpLCAuLi5vdGhlck9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgSlNPTi1jb21wYXRpYmxlIG9iamVjdCBhcyB0aGUgZmlsZSBjb250ZW50LCB3cml0ZSBpdCB0byBhIEpTT04gZmlsZS5cbiAgICpcbiAgICogTWF5IGNvbnRhaW4gdG9rZW5zLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT2JqZWN0KGZpbGVOYW1lOiBzdHJpbmcsIG9iajogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRGaWxlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHRoaXMuX3N0YW5kYXJkQ29uZmlnKG9wdGlvbnMsIGJpbmRPcHRpb25zLnBsYXRmb3JtLCB7XG4gICAgICAgICAgICBjb250ZW50OiBvYmosXG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfShmaWxlTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhIGZpbGUgZnJvbSBkaXNrIGFuZCB1c2UgaXRzIGNvbnRlbnRzXG4gICAqXG4gICAqIFRoZSBmaWxlIHdpbGwgYmUgZW1iZWRkZWQgaW4gdGhlIHRlbXBsYXRlLCBzbyBjYXJlIHNob3VsZCBiZSB0YWtlbiB0byBub3RcbiAgICogZXhjZWVkIHRoZSB0ZW1wbGF0ZSBzaXplLlxuICAgKlxuICAgKiBJZiBvcHRpb25zLmJhc2U2NGVuY29kZWQgaXMgc2V0IHRvIHRydWUsIHRoaXMgd2lsbCBiYXNlNjQtZW5jb2RlIHRoZSBmaWxlJ3MgY29udGVudHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GaWxlSW5saW5lKHRhcmdldEZpbGVOYW1lOiBzdHJpbmcsIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRGaWxlT3B0aW9ucyA9IHt9KTogSW5pdEZpbGUge1xuICAgIGNvbnN0IGVuY29kaW5nID0gb3B0aW9ucy5iYXNlNjRFbmNvZGVkID8gJ2Jhc2U2NCcgOiAndXRmOCc7XG4gICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZUZpbGVOYW1lKS50b1N0cmluZyhlbmNvZGluZyk7XG4gICAgcmV0dXJuIEluaXRGaWxlLmZyb21TdHJpbmcodGFyZ2V0RmlsZU5hbWUsIGZpbGVDb250ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgZnJvbSBhIFVSTCBhdCBpbnN0YW5jZSBzdGFydHVwIHRpbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVybChmaWxlTmFtZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb3B0aW9uczogSW5pdEZpbGVPcHRpb25zID0ge30pOiBJbml0RmlsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRGaWxlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHRoaXMuX3N0YW5kYXJkQ29uZmlnKG9wdGlvbnMsIGJpbmRPcHRpb25zLnBsYXRmb3JtLCB7XG4gICAgICAgICAgICBzb3VyY2U6IHVybCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KGZpbGVOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBhIGZpbGUgZnJvbSBhbiBTMyBidWNrZXQgYXQgaW5zdGFuY2Ugc3RhcnR1cCB0aW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TM09iamVjdChmaWxlTmFtZTogc3RyaW5nLCBidWNrZXQ6IHMzLklCdWNrZXQsIGtleTogc3RyaW5nLCBvcHRpb25zOiBJbml0RmlsZU9wdGlvbnMgPSB7fSk6IEluaXRGaWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdEZpbGUge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoYmluZE9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucykge1xuICAgICAgICBidWNrZXQuZ3JhbnRSZWFkKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSwga2V5KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHRoaXMuX3N0YW5kYXJkQ29uZmlnKG9wdGlvbnMsIGJpbmRPcHRpb25zLnBsYXRmb3JtLCB7XG4gICAgICAgICAgICBzb3VyY2U6IGJ1Y2tldC51cmxGb3JPYmplY3Qoa2V5KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhdXRoZW50aWNhdGlvbjogc3RhbmRhcmRTM0F1dGgoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlLCBidWNrZXQuYnVja2V0TmFtZSksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfShmaWxlTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGFzc2V0IGZyb20gdGhlIGdpdmVuIGZpbGVcbiAgICpcbiAgICogVGhpcyBpcyBhcHByb3ByaWF0ZSBmb3IgZmlsZXMgdGhhdCBhcmUgdG9vIGxhcmdlIHRvIGVtYmVkIGludG8gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQodGFyZ2V0RmlsZU5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nLCBvcHRpb25zOiBJbml0RmlsZUFzc2V0T3B0aW9ucyA9IHt9KTogSW5pdEZpbGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0RmlsZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGFzc2V0ID0gbmV3IHMzX2Fzc2V0cy5Bc3NldChiaW5kT3B0aW9ucy5zY29wZSwgYCR7dGFyZ2V0RmlsZU5hbWV9QXNzZXRgLCB7XG4gICAgICAgICAgcGF0aCxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXQuZ3JhbnRSZWFkKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHRoaXMuX3N0YW5kYXJkQ29uZmlnKG9wdGlvbnMsIGJpbmRPcHRpb25zLnBsYXRmb3JtLCB7XG4gICAgICAgICAgICBzb3VyY2U6IGFzc2V0Lmh0dHBVcmwsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgYXV0aGVudGljYXRpb246IHN0YW5kYXJkUzNBdXRoKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSwgYXNzZXQuczNCdWNrZXROYW1lKSxcbiAgICAgICAgICBhc3NldEhhc2g6IGFzc2V0LmFzc2V0SGFzaCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KHRhcmdldEZpbGVOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYSBmaWxlIGZyb20gYW4gYXNzZXQgYXQgaW5zdGFuY2Ugc3RhcnR1cCB0aW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeGlzdGluZ0Fzc2V0KHRhcmdldEZpbGVOYW1lOiBzdHJpbmcsIGFzc2V0OiBzM19hc3NldHMuQXNzZXQsIG9wdGlvbnM6IEluaXRGaWxlT3B0aW9ucyA9IHt9KTogSW5pdEZpbGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0RmlsZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIGFzc2V0LmdyYW50UmVhZChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogdGhpcy5fc3RhbmRhcmRDb25maWcob3B0aW9ucywgYmluZE9wdGlvbnMucGxhdGZvcm0sIHtcbiAgICAgICAgICAgIHNvdXJjZTogYXNzZXQuaHR0cFVybCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhdXRoZW50aWNhdGlvbjogc3RhbmRhcmRTM0F1dGgoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlLCBhc3NldC5zM0J1Y2tldE5hbWUpLFxuICAgICAgICAgIGFzc2V0SGFzaDogYXNzZXQuYXNzZXRIYXNoLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0odGFyZ2V0RmlsZU5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLkZJTEUudG9TdHJpbmcoKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmaWxlTmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IEluaXRGaWxlT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWcge1xuICAgIGZvciAoY29uc3QgaGFuZGxlIG9mIHRoaXMub3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMgPz8gW10pIHtcbiAgICAgIGhhbmRsZS5fYWRkRmlsZSh0aGlzLmZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZG9CaW5kKGJpbmRPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSBhY3R1YWwgYmluZCBhbmQgcmVuZGVyXG4gICAqXG4gICAqIFRoaXMgaXMgaW4gYSBzZWNvbmQgbWV0aG9kIHNvIHRoZSBzdXBlcmNsYXNzIGNhbiBndWFyYW50ZWUgdGhhdFxuICAgKiB0aGUgY29tbW9uIHdvcmsgb2YgcmVnaXN0ZXJpbmcgaW50byBzZXJ2aWNlSGFuZGxlcyBjYW5ub3QgYmUgZm9yZ290dGVuLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZG9CaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHN0YW5kYXJkIGNvbmZpZyBibG9jaywgZ2l2ZW4gY29udGVudCB2YXJzXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9zdGFuZGFyZENvbmZpZyhmaWxlT3B0aW9uczogSW5pdEZpbGVPcHRpb25zLCBwbGF0Zm9ybTogSW5pdFBsYXRmb3JtLCBjb250ZW50VmFyczogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gSW5pdFBsYXRmb3JtLldJTkRPV1MpIHtcbiAgICAgIGlmIChmaWxlT3B0aW9ucy5ncm91cCB8fCBmaWxlT3B0aW9ucy5vd25lciB8fCBmaWxlT3B0aW9ucy5tb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT3duZXIsIGdyb3VwLCBhbmQgbW9kZSBvcHRpb25zIG5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3MuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBbdGhpcy5maWxlTmFtZV06IHsgLi4uY29udGVudFZhcnMgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmZpbGVOYW1lXToge1xuICAgICAgICAuLi5jb250ZW50VmFycyxcbiAgICAgICAgbW9kZTogZmlsZU9wdGlvbnMubW9kZSB8fCAnMDAwNjQ0JyxcbiAgICAgICAgb3duZXI6IGZpbGVPcHRpb25zLm93bmVyIHx8ICdyb290JyxcbiAgICAgICAgZ3JvdXA6IGZpbGVPcHRpb25zLmdyb3VwIHx8ICdyb290JyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBMaW51eC9VTklYIGdyb3VwcyBhbmQgYXNzaWduIGdyb3VwIElEcy5cbiAqXG4gKiBOb3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzIHN5c3RlbXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbml0R3JvdXAgZXh0ZW5kcyBJbml0RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGdyb3VwIGZyb20gaXRzIG5hbWUsIGFuZCBvcHRpb25hbGx5LCBncm91cCBpZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTmFtZShncm91cE5hbWU6IHN0cmluZywgZ3JvdXBJZD86IG51bWJlcik6IEluaXRHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBJbml0R3JvdXAoZ3JvdXBOYW1lLCBncm91cElkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBlbGVtZW50VHlwZSA9IEluaXRFbGVtZW50VHlwZS5HUk9VUC50b1N0cmluZygpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyb3VwTmFtZTogc3RyaW5nLCBwcml2YXRlIGdyb3VwSWQ/OiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX2JpbmQob3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWcge1xuICAgIGlmIChvcHRpb25zLnBsYXRmb3JtID09PSBJbml0UGxhdGZvcm0uV0lORE9XUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbml0IGdyb3VwcyBhcmUgbm90IHN1cHBvcnRlZCBvbiBXaW5kb3dzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBbdGhpcy5ncm91cE5hbWVdOiB0aGlzLmdyb3VwSWQgIT09IHVuZGVmaW5lZCA/IHsgZ2lkOiB0aGlzLmdyb3VwSWQgfSA6IHt9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbn1cblxuLyoqXG4gKiBPcHRpb25hbCBwYXJhbWV0ZXJzIHVzZWQgd2hlbiBjcmVhdGluZyBhIHVzZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0VXNlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHVzZXIncyBob21lIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQGRlZmF1bHQgYXNzaWduZWQgYnkgdGhlIE9TXG4gICAqL1xuICByZWFkb25seSBob21lRGlyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHVzZXIgSUQuIFRoZSBjcmVhdGlvbiBwcm9jZXNzIGZhaWxzIGlmIHRoZSB1c2VyIG5hbWUgZXhpc3RzIHdpdGggYSBkaWZmZXJlbnQgdXNlciBJRC5cbiAgICogSWYgdGhlIHVzZXIgSUQgaXMgYWxyZWFkeSBhc3NpZ25lZCB0byBhbiBleGlzdGluZyB1c2VyIHRoZSBvcGVyYXRpbmcgc3lzdGVtIG1heVxuICAgKiByZWplY3QgdGhlIGNyZWF0aW9uIHJlcXVlc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IGFzc2lnbmVkIGJ5IHRoZSBPU1xuICAgKi9cbiAgcmVhZG9ubHkgdXNlcklkPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgZ3JvdXAgbmFtZXMuIFRoZSB1c2VyIHdpbGwgYmUgYWRkZWQgdG8gZWFjaCBncm91cCBpbiB0aGUgbGlzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIHVzZXIgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhbnkgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogQ3JlYXRlIExpbnV4L1VOSVggdXNlcnMgYW5kIHRvIGFzc2lnbiB1c2VyIElEcy5cbiAqXG4gKiBVc2VycyBhcmUgY3JlYXRlZCBhcyBub24taW50ZXJhY3RpdmUgc3lzdGVtIHVzZXJzIHdpdGggYSBzaGVsbCBvZlxuICogL3NiaW4vbm9sb2dpbi4gVGhpcyBpcyBieSBkZXNpZ24gYW5kIGNhbm5vdCBiZSBtb2RpZmllZC5cbiAqXG4gKiBOb3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzIHN5c3RlbXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbml0VXNlciBleHRlbmRzIEluaXRFbGVtZW50IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIHVzZXIgZnJvbSB1c2VyIG5hbWUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21OYW1lKHVzZXJOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRVc2VyT3B0aW9ucyA9IHt9KTogSW5pdFVzZXIge1xuICAgIHJldHVybiBuZXcgSW5pdFVzZXIodXNlck5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLlVTRVIudG9TdHJpbmcoKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB1c2VyTmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHVzZXJPcHRpb25zOiBJbml0VXNlck9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX2JpbmQob3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWcge1xuICAgIGlmIChvcHRpb25zLnBsYXRmb3JtID09PSBJbml0UGxhdGZvcm0uV0lORE9XUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbml0IHVzZXJzIGFyZSBub3Qgc3VwcG9ydGVkIG9uIFdpbmRvd3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIFt0aGlzLnVzZXJOYW1lXToge1xuICAgICAgICAgIHVpZDogdGhpcy51c2VyT3B0aW9ucy51c2VySWQsXG4gICAgICAgICAgZ3JvdXBzOiB0aGlzLnVzZXJPcHRpb25zLmdyb3VwcyxcbiAgICAgICAgICBob21lRGlyOiB0aGlzLnVzZXJPcHRpb25zLmhvbWVEaXIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBJbml0UGFja2FnZS5ycG0vSW5pdFBhY2thZ2UubXNpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYXRpb25QYWNrYWdlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBJZGVudGlmaWVyIGtleSBmb3IgdGhpcyBwYWNrYWdlXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgdG8gb3JkZXIgcGFja2FnZSBpbnN0YWxscy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkga2V5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBnaXZlbiBzZXJ2aWNlIGFmdGVyIHRoaXMgY29tbWFuZCBoYXMgcnVuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHJlc3RhcnQgYW55IHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VSZXN0YXJ0SGFuZGxlcz86IEluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZVtdO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIEluaXRQYWNrYWdlLnl1bS9hcHQvcnVieUdlbS9weXRob25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOYW1lZFBhY2thZ2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHZlcnNpb25zIHRvIGluc3RhbGxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBJbnN0YWxsIHRoZSBsYXRlc3QgdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBnaXZlbiBzZXJ2aWNlcyBhZnRlciB0aGlzIGNvbW1hbmQgaGFzIHJ1blxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCByZXN0YXJ0IGFueSBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlUmVzdGFydEhhbmRsZXM/OiBJbml0U2VydmljZVJlc3RhcnRIYW5kbGVbXTtcbn1cblxuLyoqXG4gKiBBIHBhY2thZ2UgdG8gYmUgaW5zdGFsbGVkIGR1cmluZyBjZm4taW5pdCB0aW1lXG4gKi9cbmV4cG9ydCBjbGFzcyBJbml0UGFja2FnZSBleHRlbmRzIEluaXRFbGVtZW50IHtcbiAgLyoqXG4gICAqIEluc3RhbGwgYW4gUlBNIGZyb20gYW4gSFRUUCBVUkwgb3IgYSBsb2NhdGlvbiBvbiBkaXNrXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJwbShsb2NhdGlvbjogc3RyaW5nLCBvcHRpb25zOiBMb2NhdGlvblBhY2thZ2VPcHRpb25zID0ge30pOiBJbml0UGFja2FnZSB7XG4gICAgcmV0dXJuIG5ldyBJbml0UGFja2FnZSgncnBtJywgW2xvY2F0aW9uXSwgb3B0aW9ucy5rZXksIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGEgcGFja2FnZSB1c2luZyBZdW1cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgeXVtKHBhY2thZ2VOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IE5hbWVkUGFja2FnZU9wdGlvbnMgPSB7fSk6IEluaXRQYWNrYWdlIHtcbiAgICByZXR1cm4gbmV3IEluaXRQYWNrYWdlKCd5dW0nLCBvcHRpb25zLnZlcnNpb24gPz8gW10sIHBhY2thZ2VOYW1lLCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFsbCBhIHBhY2thZ2UgZnJvbSBSdWJ5R2Vtc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBydWJ5R2VtKGdlbU5hbWU6IHN0cmluZywgb3B0aW9uczogTmFtZWRQYWNrYWdlT3B0aW9ucyA9IHt9KTogSW5pdFBhY2thZ2Uge1xuICAgIHJldHVybiBuZXcgSW5pdFBhY2thZ2UoJ3J1YnlnZW1zJywgb3B0aW9ucy52ZXJzaW9uID8/IFtdLCBnZW1OYW1lLCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFsbCBhIHBhY2thZ2UgZnJvbSBQeVBJXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHB5dGhvbihwYWNrYWdlTmFtZTogc3RyaW5nLCBvcHRpb25zOiBOYW1lZFBhY2thZ2VPcHRpb25zID0ge30pOiBJbml0UGFja2FnZSB7XG4gICAgcmV0dXJuIG5ldyBJbml0UGFja2FnZSgncHl0aG9uJywgb3B0aW9ucy52ZXJzaW9uID8/IFtdLCBwYWNrYWdlTmFtZSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbGwgYSBwYWNrYWdlIHVzaW5nIEFQVFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcHQocGFja2FnZU5hbWU6IHN0cmluZywgb3B0aW9uczogTmFtZWRQYWNrYWdlT3B0aW9ucyA9IHt9KTogSW5pdFBhY2thZ2Uge1xuICAgIHJldHVybiBuZXcgSW5pdFBhY2thZ2UoJ2FwdCcsIG9wdGlvbnMudmVyc2lvbiA/PyBbXSwgcGFja2FnZU5hbWUsIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGFuIE1TSSBwYWNrYWdlIGZyb20gYW4gSFRUUCBVUkwgb3IgYSBsb2NhdGlvbiBvbiBkaXNrXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1zaShsb2NhdGlvbjogc3RyaW5nLCBvcHRpb25zOiBMb2NhdGlvblBhY2thZ2VPcHRpb25zID0ge30pOiBJbml0UGFja2FnZSB7XG4gICAgLy8gVGhlIE1TSSBwYWNrYWdlIHZlcnNpb24gbXVzdCBiZSBhIHN0cmluZywgbm90IGFuIGFycmF5LlxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0UGFja2FnZSB7XG4gICAgICBwcm90ZWN0ZWQgcmVuZGVyUGFja2FnZVZlcnNpb25zKCkgeyByZXR1cm4gbG9jYXRpb247IH1cbiAgICB9KCdtc2knLCBbbG9jYXRpb25dLCBvcHRpb25zLmtleSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLlBBQ0tBR0UudG9TdHJpbmcoKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSB0eXBlOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSB2ZXJzaW9uczogc3RyaW5nW10sXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYWNrYWdlTmFtZT86IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW10sXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfYmluZChvcHRpb25zOiBJbml0QmluZE9wdGlvbnMpOiBJbml0RWxlbWVudENvbmZpZyB7XG4gICAgaWYgKCh0aGlzLnR5cGUgPT09ICdtc2knKSAhPT0gKG9wdGlvbnMucGxhdGZvcm0gPT09IEluaXRQbGF0Zm9ybS5XSU5ET1dTKSkge1xuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21zaScpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNU0kgaW5zdGFsbGVycyBhcmUgb25seSBzdXBwb3J0ZWQgb24gV2luZG93cyBzeXN0ZW1zLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaW5kb3dzIG9ubHkgc3VwcG9ydHMgdGhlIE1TSSBwYWNrYWdlIHR5cGUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFja2FnZU5hbWUgJiYgIVsncnBtJywgJ21zaSddLmluY2x1ZGVzKHRoaXMudHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFja2FnZSBuYW1lIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhbGwgcGFja2FnZSB0eXBlcyBiZXNpZGVzIFJQTSBhbmQgTVNJLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gdGhpcy5wYWNrYWdlTmFtZSB8fCBgJHtvcHRpb25zLmluZGV4fWAucGFkU3RhcnQoMywgJzAnKTtcblxuICAgIGZvciAoY29uc3QgaGFuZGxlIG9mIHRoaXMuc2VydmljZUhhbmRsZXMgPz8gW10pIHtcbiAgICAgIGhhbmRsZS5fYWRkUGFja2FnZSh0aGlzLnR5cGUsIHBhY2thZ2VOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIFt0aGlzLnR5cGVdOiB7XG4gICAgICAgICAgW3BhY2thZ2VOYW1lXTogdGhpcy5yZW5kZXJQYWNrYWdlVmVyc2lvbnMoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJQYWNrYWdlVmVyc2lvbnMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9ucztcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGFuIEluaXRTZXJ2aWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5pdFNlcnZpY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIEVuYWJsZSBvciBkaXNhYmxlIHRoaXMgc2VydmljZVxuICAgKlxuICAgKiBTZXQgdG8gdHJ1ZSB0byBlbnN1cmUgdGhhdCB0aGUgc2VydmljZSB3aWxsIGJlIHN0YXJ0ZWQgYXV0b21hdGljYWxseSB1cG9uIGJvb3QuXG4gICAqXG4gICAqIFNldCB0byBmYWxzZSB0byBlbnN1cmUgdGhhdCB0aGUgc2VydmljZSB3aWxsIG5vdCBiZSBzdGFydGVkIGF1dG9tYXRpY2FsbHkgdXBvbiBib290LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRydWUgaWYgdXNlZCBpbiBgSW5pdFNlcnZpY2UuZW5hYmxlKClgLCBubyBjaGFuZ2UgdG8gc2VydmljZVxuICAgKiBzdGF0ZSBpZiB1c2VkIGluIGBJbml0U2VydmljZS5mcm9tT3B0aW9ucygpYC5cbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNYWtlIHN1cmUgdGhpcyBzZXJ2aWNlIGlzIHJ1bm5pbmcgb3Igbm90IHJ1bm5pbmcgYWZ0ZXIgY2ZuLWluaXQgZmluaXNoZXMuXG4gICAqXG4gICAqIFNldCB0byB0cnVlIHRvIGVuc3VyZSB0aGF0IHRoZSBzZXJ2aWNlIGlzIHJ1bm5pbmcgYWZ0ZXIgY2ZuLWluaXQgZmluaXNoZXMuXG4gICAqXG4gICAqIFNldCB0byBmYWxzZSB0byBlbnN1cmUgdGhhdCB0aGUgc2VydmljZSBpcyBub3QgcnVubmluZyBhZnRlciBjZm4taW5pdCBmaW5pc2hlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1lIHZhbHVlIGFzIGBlbmFibGVkYC5cbiAgICovXG4gIHJlYWRvbmx5IGVuc3VyZVJ1bm5pbmc/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHNlcnZpY2Ugd2hlbiB0aGUgYWN0aW9ucyByZWdpc3RlcmVkIGludG8gdGhlIHJlc3RhcnRIYW5kbGUgaGF2ZSBiZWVuIHBlcmZvcm1lZFxuICAgKlxuICAgKiBSZWdpc3RlciBhY3Rpb25zIGludG8gdGhlIHJlc3RhcnRIYW5kbGUgYnkgcGFzc2luZyBpdCB0byBgSW5pdEZpbGVgLCBgSW5pdENvbW1hbmRgLFxuICAgKiBgSW5pdFBhY2thZ2VgIGFuZCBgSW5pdFNvdXJjZWAgb2JqZWN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWxlcyB0cmlnZ2VyIHJlc3RhcnRcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VSZXN0YXJ0SGFuZGxlPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlO1xuXG4gIC8qKlxuICAgKiBXaGF0IHNlcnZpY2UgbWFuYWdlciB0byB1c2VcbiAgICpcbiAgICogVGhpcyBuZWVkcyB0byBtYXRjaCB0aGUgYWN0dWFsIHNlcnZpY2UgbWFuYWdlciBvbiB5b3VyIE9wZXJhdGluZyBTeXN0ZW0uXG4gICAqIEZvciBleGFtcGxlLCBBbWF6b24gTGludXggMSB1c2VzIFN5c1Zpbml0LCBidXQgQW1hem9uIExpbnV4IDIgdXNlcyBTeXN0ZW1kLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTZXJ2aWNlTWFuYWdlci5TWVNWSU5JVCBmb3IgTGludXggaW1hZ2VzLCBTZXJ2aWNlTWFuYWdlci5XSU5ET1dTIGZvciBXaW5kb3dzIGltYWdlc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZU1hbmFnZXI/OiBTZXJ2aWNlTWFuYWdlcjtcbn1cblxuLyoqXG4gKiBBIHNlcnZpY2VzIHRoYXQgYmUgZW5hYmxlZCwgZGlzYWJsZWQgb3IgcmVzdGFydGVkIHdoZW4gdGhlIGluc3RhbmNlIGlzIGxhdW5jaGVkLlxuICovXG5leHBvcnQgY2xhc3MgSW5pdFNlcnZpY2UgZXh0ZW5kcyBJbml0RWxlbWVudCB7XG4gIC8qKlxuICAgKiBFbmFibGUgYW5kIHN0YXJ0IHRoZSBnaXZlbiBzZXJ2aWNlLCBvcHRpb25hbGx5IHJlc3RhcnRpbmcgaXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZW5hYmxlKHNlcnZpY2VOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRTZXJ2aWNlT3B0aW9ucyA9IHt9KTogSW5pdFNlcnZpY2Uge1xuICAgIGNvbnN0IHsgZW5hYmxlZCwgZW5zdXJlUnVubmluZywgLi4ub3RoZXJPcHRpb25zIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiBuZXcgSW5pdFNlcnZpY2Uoc2VydmljZU5hbWUsIHtcbiAgICAgIGVuYWJsZWQ6IGVuYWJsZWQgPz8gdHJ1ZSxcbiAgICAgIGVuc3VyZVJ1bm5pbmc6IGVuc3VyZVJ1bm5pbmcgPz8gZW5hYmxlZCA/PyB0cnVlLFxuICAgICAgLi4ub3RoZXJPcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGUgYW5kIHN0b3AgdGhlIGdpdmVuIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGlzYWJsZShzZXJ2aWNlTmFtZTogc3RyaW5nKTogSW5pdFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgSW5pdFNlcnZpY2Uoc2VydmljZU5hbWUsIHsgZW5hYmxlZDogZmFsc2UsIGVuc3VyZVJ1bm5pbmc6IGZhbHNlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbGwgYSBzeXN0ZW1kLWNvbXBhdGlibGUgY29uZmlnIGZpbGUgZm9yIHRoZSBnaXZlbiBzZXJ2aWNlXG4gICAqXG4gICAqIFRoaXMgaXMgYSBoZWxwZXIgZnVuY3Rpb24gdG8gY3JlYXRlIGEgc2ltcGxlIHN5c3RlbWQgY29uZmlndXJhdGlvblxuICAgKiBmaWxlIHRoYXQgd2lsbCBhbGxvdyBydW5uaW5nIGEgc2VydmljZSBvbiB0aGUgbWFjaGluZSB1c2luZyBgSW5pdFNlcnZpY2UuZW5hYmxlKClgLlxuICAgKlxuICAgKiBTeXN0ZW1kIGFsbG93cyBtYW55IGNvbmZpZ3VyYXRpb24gb3B0aW9uczsgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBwcmV0ZW5kXG4gICAqIHRvIGV4cG9zZSBhbGwgb2YgdGhlbS4gSWYgeW91IG5lZWQgYWR2YW5jZWQgY29uZmlndXJhdGlvbiBvcHRpb25zLCB5b3VcbiAgICogY2FuIHVzZSBgSW5pdEZpbGVgIHRvIGNyZWF0ZSBleGFjdGx5IHRoZSBjb25maWd1cmF0aW9uIGZpbGUgeW91IG5lZWRcbiAgICogYXQgYC9ldGMvc3lzdGVtZC9zeXN0ZW0vJHtzZXJ2aWNlTmFtZX0uc2VydmljZWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN5c3RlbWRDb25maWdGaWxlKHNlcnZpY2VOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFN5c3RlbWRDb25maWdGaWxlT3B0aW9ucyk6IEluaXRGaWxlIHtcbiAgICBpZiAoIW9wdGlvbnMuY29tbWFuZC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3lzdGVtRCBleGVjdXRhYmxlcyBtdXN0IHVzZSBhbiBhYnNvbHV0ZSBwYXRoLCBnb3QgJyR7b3B0aW9ucy5jb21tYW5kfSdgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IFtcbiAgICAgICdbVW5pdF0nLFxuICAgICAgLi4uKG9wdGlvbnMuZGVzY3JpcHRpb24gPyBbYERlc2NyaXB0aW9uPSR7b3B0aW9ucy5kZXNjcmlwdGlvbn1gXSA6IFtdKSxcbiAgICAgIC4uLihvcHRpb25zLmFmdGVyTmV0d29yayA/PyB0cnVlID8gWydBZnRlcj1uZXR3b3JrLnRhcmdldCddIDogW10pLFxuICAgICAgJ1tTZXJ2aWNlXScsXG4gICAgICBgRXhlY1N0YXJ0PSR7b3B0aW9ucy5jb21tYW5kfWAsXG4gICAgICAuLi4ob3B0aW9ucy5jd2QgPyBbYFdvcmtpbmdEaXJlY3Rvcnk9JHtvcHRpb25zLmN3ZH1gXSA6IFtdKSxcbiAgICAgIC4uLihvcHRpb25zLnVzZXIgPyBbYFVzZXI9JHtvcHRpb25zLnVzZXJ9YF0gOiBbXSksXG4gICAgICAuLi4ob3B0aW9ucy5ncm91cCA/IFtgR3JvdXA9JHtvcHRpb25zLnVzZXJ9YF0gOiBbXSksXG4gICAgICAuLi4ob3B0aW9ucy5rZWVwUnVubmluZyA/PyB0cnVlID8gWydSZXN0YXJ0PWFsd2F5cyddIDogW10pLFxuICAgICAgJ1tJbnN0YWxsXScsXG4gICAgICAnV2FudGVkQnk9bXVsdGktdXNlci50YXJnZXQnLFxuICAgIF07XG5cbiAgICByZXR1cm4gSW5pdEZpbGUuZnJvbVN0cmluZyhgL2V0Yy9zeXN0ZW1kL3N5c3RlbS8ke3NlcnZpY2VOYW1lfS5zZXJ2aWNlYCwgbGluZXMuam9pbignXFxuJykpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLlNFUlZJQ0UudG9TdHJpbmcoKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlT3B0aW9uczogSW5pdFNlcnZpY2VPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9iaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnIHtcbiAgICBjb25zdCBzZXJ2aWNlTWFuYWdlciA9IHRoaXMuc2VydmljZU9wdGlvbnMuc2VydmljZU1hbmFnZXJcbiAgICAgPz8gKG9wdGlvbnMucGxhdGZvcm0gPT09IEluaXRQbGF0Zm9ybS5MSU5VWCA/IFNlcnZpY2VNYW5hZ2VyLlNZU1ZJTklUIDogU2VydmljZU1hbmFnZXIuV0lORE9XUyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIFtzZXJ2aWNlTWFuYWdlclRvU3RyaW5nKHNlcnZpY2VNYW5hZ2VyKV06IHtcbiAgICAgICAgICBbdGhpcy5zZXJ2aWNlTmFtZV06IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRoaXMuc2VydmljZU9wdGlvbnMuZW5hYmxlZCxcbiAgICAgICAgICAgIGVuc3VyZVJ1bm5pbmc6IHRoaXMuc2VydmljZU9wdGlvbnMuZW5zdXJlUnVubmluZyxcbiAgICAgICAgICAgIC4uLnRoaXMuc2VydmljZU9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGU/Ll9yZW5kZXJSZXN0YXJ0SGFuZGxlcygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgYW4gSW5pdFNvdXJjZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluaXRTb3VyY2VPcHRpb25zIHtcblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgZ2l2ZW4gc2VydmljZXMgYWZ0ZXIgdGhpcyBhcmNoaXZlIGhhcyBiZWVuIGV4dHJhY3RlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCByZXN0YXJ0IGFueSBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlUmVzdGFydEhhbmRsZXM/OiBJbml0U2VydmljZVJlc3RhcnRIYW5kbGVbXTtcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIGFuIEluaXRTb3VyY2UgdGhhdCBidWlsZHMgYW4gYXNzZXQgZnJvbSBsb2NhbCBmaWxlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbml0U291cmNlQXNzZXRPcHRpb25zIGV4dGVuZHMgSW5pdFNvdXJjZU9wdGlvbnMsIHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMge1xuXG59XG5cbi8qKlxuICogRXh0cmFjdCBhbiBhcmNoaXZlIGludG8gYSBkaXJlY3RvcnlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluaXRTb3VyY2UgZXh0ZW5kcyBJbml0RWxlbWVudCB7XG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIFVSTCBhbmQgZXh0cmFjdCBpdCBpbnRvIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVybCh0YXJnZXREaXJlY3Rvcnk6IHN0cmluZywgdXJsOiBzdHJpbmcsIG9wdGlvbnM6IEluaXRTb3VyY2VPcHRpb25zID0ge30pOiBJbml0U291cmNlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdFNvdXJjZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHsgW3RoaXMudGFyZ2V0RGlyZWN0b3J5XTogdXJsIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSh0YXJnZXREaXJlY3RvcnksIG9wdGlvbnMuc2VydmljZVJlc3RhcnRIYW5kbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGEgR2l0SHViIGJyYW5jaCBpbnRvIGEgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21HaXRIdWIodGFyZ2V0RGlyZWN0b3J5OiBzdHJpbmcsIG93bmVyOiBzdHJpbmcsIHJlcG86IHN0cmluZywgcmVmU3BlYz86IHN0cmluZywgb3B0aW9uczogSW5pdFNvdXJjZU9wdGlvbnMgPSB7fSk6IEluaXRTb3VyY2Uge1xuICAgIHJldHVybiBJbml0U291cmNlLmZyb21VcmwodGFyZ2V0RGlyZWN0b3J5LCBgaHR0cHM6Ly9naXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30vdGFyYmFsbC8ke3JlZlNwZWMgPz8gJ21hc3Rlcid9YCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBhbiBhcmNoaXZlIHN0b3JlZCBpbiBhbiBTMyBidWNrZXQgaW50byB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TM09iamVjdCh0YXJnZXREaXJlY3Rvcnk6IHN0cmluZywgYnVja2V0OiBzMy5JQnVja2V0LCBrZXk6IHN0cmluZywgb3B0aW9uczogSW5pdFNvdXJjZU9wdGlvbnMgPSB7fSk6IEluaXRTb3VyY2Uge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBJbml0U291cmNlIHtcbiAgICAgIHByb3RlY3RlZCBfZG9CaW5kKGJpbmRPcHRpb25zOiBJbml0QmluZE9wdGlvbnMpIHtcbiAgICAgICAgYnVja2V0LmdyYW50UmVhZChiaW5kT3B0aW9ucy5pbnN0YW5jZVJvbGUsIGtleSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb25maWc6IHsgW3RoaXMudGFyZ2V0RGlyZWN0b3J5XTogYnVja2V0LnVybEZvck9iamVjdChrZXkpIH0sXG4gICAgICAgICAgYXV0aGVudGljYXRpb246IHN0YW5kYXJkUzNBdXRoKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSwgYnVja2V0LmJ1Y2tldE5hbWUpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0odGFyZ2V0RGlyZWN0b3J5LCBvcHRpb25zLnNlcnZpY2VSZXN0YXJ0SGFuZGxlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEluaXRTb3VyY2UgZnJvbSBhbiBhc3NldCBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIHBhdGguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldCh0YXJnZXREaXJlY3Rvcnk6IHN0cmluZywgcGF0aDogc3RyaW5nLCBvcHRpb25zOiBJbml0U291cmNlQXNzZXRPcHRpb25zID0ge30pOiBJbml0U291cmNlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSW5pdFNvdXJjZSB7XG4gICAgICBwcm90ZWN0ZWQgX2RvQmluZChiaW5kT3B0aW9uczogSW5pdEJpbmRPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGFzc2V0ID0gbmV3IHMzX2Fzc2V0cy5Bc3NldChiaW5kT3B0aW9ucy5zY29wZSwgYCR7dGFyZ2V0RGlyZWN0b3J5fUFzc2V0YCwge1xuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgLi4uYmluZE9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NldC5ncmFudFJlYWQoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogeyBbdGhpcy50YXJnZXREaXJlY3RvcnldOiBhc3NldC5odHRwVXJsIH0sXG4gICAgICAgICAgYXV0aGVudGljYXRpb246IHN0YW5kYXJkUzNBdXRoKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSwgYXNzZXQuczNCdWNrZXROYW1lKSxcbiAgICAgICAgICBhc3NldEhhc2g6IGFzc2V0LmFzc2V0SGFzaCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KHRhcmdldERpcmVjdG9yeSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYSBkaXJlY3RvcnkgZnJvbSBhbiBleGlzdGluZyBkaXJlY3RvcnkgYXNzZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeGlzdGluZ0Fzc2V0KHRhcmdldERpcmVjdG9yeTogc3RyaW5nLCBhc3NldDogczNfYXNzZXRzLkFzc2V0LCBvcHRpb25zOiBJbml0U291cmNlT3B0aW9ucyA9IHt9KTogSW5pdFNvdXJjZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEluaXRTb3VyY2Uge1xuICAgICAgcHJvdGVjdGVkIF9kb0JpbmQoYmluZE9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucykge1xuICAgICAgICBhc3NldC5ncmFudFJlYWQoYmluZE9wdGlvbnMuaW5zdGFuY2VSb2xlKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbmZpZzogeyBbdGhpcy50YXJnZXREaXJlY3RvcnldOiBhc3NldC5odHRwVXJsIH0sXG4gICAgICAgICAgYXV0aGVudGljYXRpb246IHN0YW5kYXJkUzNBdXRoKGJpbmRPcHRpb25zLmluc3RhbmNlUm9sZSwgYXNzZXQuczNCdWNrZXROYW1lKSxcbiAgICAgICAgICBhc3NldEhhc2g6IGFzc2V0LmFzc2V0SGFzaCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KHRhcmdldERpcmVjdG9yeSwgb3B0aW9ucy5zZXJ2aWNlUmVzdGFydEhhbmRsZXMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnRUeXBlID0gSW5pdEVsZW1lbnRUeXBlLlNPVVJDRS50b1N0cmluZygpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRhcmdldERpcmVjdG9yeTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VIYW5kbGVzPzogSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX2JpbmQob3B0aW9uczogSW5pdEJpbmRPcHRpb25zKTogSW5pdEVsZW1lbnRDb25maWcge1xuICAgIGZvciAoY29uc3QgaGFuZGxlIG9mIHRoaXMuc2VydmljZUhhbmRsZXMgPz8gW10pIHtcbiAgICAgIGhhbmRsZS5fYWRkU291cmNlKHRoaXMudGFyZ2V0RGlyZWN0b3J5KTtcbiAgICB9XG5cbiAgICAvLyBEZWxlZ2F0ZSBhY3R1YWwgYmluZCB0byBzdWJjbGFzc2VzXG4gICAgcmV0dXJuIHRoaXMuX2RvQmluZChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSBhY3R1YWwgYmluZCBhbmQgcmVuZGVyXG4gICAqXG4gICAqIFRoaXMgaXMgaW4gYSBzZWNvbmQgbWV0aG9kIHNvIHRoZSBzdXBlcmNsYXNzIGNhbiBndWFyYW50ZWUgdGhhdFxuICAgKiB0aGUgY29tbW9uIHdvcmsgb2YgcmVnaXN0ZXJpbmcgaW50byBzZXJ2aWNlSGFuZGxlcyBjYW5ub3QgYmUgZm9yZ290dGVuLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZG9CaW5kKG9wdGlvbnM6IEluaXRCaW5kT3B0aW9ucyk6IEluaXRFbGVtZW50Q29uZmlnO1xufVxuXG4vKipcbiAqIFJlbmRlciBhIHN0YW5kYXJkIFMzIGF1dGggYmxvY2sgZm9yIHVzZSBpbiBBV1M6OkNsb3VkRm9ybWF0aW9uOjpBdXRoZW50aWNhdGlvblxuICpcbiAqIFRoaXMgYmxvY2sgaXMgdGhlIHNhbWUgZXZlcnkgdGltZSAobW9kdWxvIGJ1Y2tldCBuYW1lKSwgc28gaXQgaGFzIHRoZSBzYW1lXG4gKiBrZXkgZXZlcnkgdGltZSBzbyB0aGUgYmxvY2tzIGFyZSBtZXJnZWQgaW50byBvbmUgaW4gdGhlIGZpbmFsIHJlbmRlci5cbiAqL1xuZnVuY3Rpb24gc3RhbmRhcmRTM0F1dGgocm9sZTogaWFtLklSb2xlLCBidWNrZXROYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICBTM0FjY2Vzc0NyZWRzOiB7XG4gICAgICB0eXBlOiAnUzMnLFxuICAgICAgcm9sZU5hbWU6IHJvbGUucm9sZU5hbWUsXG4gICAgICBidWNrZXRzOiBbYnVja2V0TmFtZV0sXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgc2VydmljZSBtYW5hZ2VyIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IEluaXRTZXJ2aWNlc1xuICpcbiAqIFRoZSB2YWx1ZSBuZWVkcyB0byBtYXRjaCB0aGUgc2VydmljZSBtYW5hZ2VyIHVzZWQgYnkgeW91ciBvcGVyYXRpbmdcbiAqIHN5c3RlbS5cbiAqL1xuZXhwb3J0IGVudW0gU2VydmljZU1hbmFnZXIge1xuICAvKipcbiAgICogVXNlIFN5c1Zpbml0XG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgZm9yIExpbnV4IHN5c3RlbXMuXG4gICAqL1xuICBTWVNWSU5JVCxcblxuICAvKipcbiAgICogVXNlIFdpbmRvd3NcbiAgICpcbiAgICogVGhpcyBpcyB0aGUgZGVmYXVsdCBmb3IgV2luZG93cyBzeXN0ZW1zLlxuICAgKi9cbiAgV0lORE9XUyxcblxuICAvKipcbiAgICogVXNlIHN5c3RlbWRcbiAgICovXG4gIFNZU1RFTUQsXG59XG5cbmZ1bmN0aW9uIHNlcnZpY2VNYW5hZ2VyVG9TdHJpbmcoeDogU2VydmljZU1hbmFnZXIpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHgpIHtcbiAgICBjYXNlIFNlcnZpY2VNYW5hZ2VyLlNZU1RFTUQ6IHJldHVybiAnc3lzdGVtZCc7XG4gICAgY2FzZSBTZXJ2aWNlTWFuYWdlci5TWVNWSU5JVDogcmV0dXJuICdzeXN2aW5pdCc7XG4gICAgY2FzZSBTZXJ2aWNlTWFuYWdlci5XSU5ET1dTOiByZXR1cm4gJ3dpbmRvd3MnO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgYSBTeXN0ZW1EIGNvbmZpZ3VyYXRpb24gZmlsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN5c3RlbWRDb25maWdGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY29tbWFuZCB0byBydW4gdG8gc3RhcnQgdGhpcyBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBjb21tYW5kOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB3b3JraW5nIGRpcmVjdG9yeSBmb3IgdGhlIGNvbW1hbmRcbiAgICpcbiAgICogQGRlZmF1bHQgUm9vdCBkaXJlY3Rvcnkgb3IgaG9tZSBkaXJlY3Rvcnkgb2Ygc3BlY2lmaWVkIHVzZXJcbiAgICovXG4gIHJlYWRvbmx5IGN3ZD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGlzIHNlcnZpY2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyIHRvIGV4ZWN1dGUgdGhlIHByb2Nlc3MgdW5kZXJcbiAgICpcbiAgICogQGRlZmF1bHQgcm9vdFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGdyb3VwIHRvIGV4ZWN1dGUgdGhlIHByb2Nlc3MgdW5kZXJcbiAgICpcbiAgICogQGRlZmF1bHQgcm9vdFxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXA/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIHByb2Nlc3MgcnVubmluZyBhbGwgdGhlIHRpbWVcbiAgICpcbiAgICogUmVzdGFydHMgdGhlIHByb2Nlc3Mgd2hlbiBpdCBleGl0cyBmb3IgYW55IHJlYXNvbiBvdGhlclxuICAgKiB0aGFuIHRoZSBtYWNoaW5lIHNodXR0aW5nIGRvd24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGtlZXBSdW5uaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZpY2UgYWZ0ZXIgdGhlIG5ldHdvcmtpbmcgcGFydCBvZiB0aGUgT1MgY29tZXMgdXBcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJOZXR3b3JrPzogYm9vbGVhbjtcbn0iXX0=