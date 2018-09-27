import cdk = require('@aws-cdk/cdk');

/**
 * Describe startup configuration for EC2 instances
 */
export class CloudFormationInit extends cdk.Construct {
    /**
     * Logical ID of the Init resource
     */
    public readonly initResourceId: string;

    private readonly configs: {[name: string]: InitConfig} = {};
    private readonly configSets: {[name: string]: string[]} = {};

    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        const resource = new cdk.Resource(this, 'Resource', {
            // I know this thing says it lives in the AWS::CloudFormation namespace,
            // but it really doesn't make sense there.
            type: 'AWS::CloudFormation::Init',
            properties: new cdk.Token(() => this.render),
        });

        this.initResourceId = resource.logicalId;
    }

    public addConfig(configName: string, ...configSets: string[]): InitConfig {
        const config = new InitConfig();
        this.configs[configName] = config;

        this.addToConfigSets(configSets, configName);

        return config;
    }

    private addToConfigSets(configSets: string[], configName: string) {
        if (configSets.length === 0) { configSets = ['default']; }
        for (const configSet of configSets) {
            if (!(configSet in this.configSets)) { this.configSets[configSet] = []; }

            this.configSets[configSet].push(configName);
        }
    }

    private render() {
        return {};
    }
}

/**
 * A single config
 */
export class InitConfig {
    private readonly commands: {[key: string]: InitCommand} = {};
    private readonly files: {[fileName: string]: InitFile} = {};
    private readonly groups: {[groupName: string]: InitGroup} = {};
    private readonly users: {[userName: string]: InitUser} = {};
    private readonly packages: {[pkgType: string]: {[name: string]: PackageVersion}} = {};

    public addCommand(name: string, command: InitCommand) {
        this.commands[name] = command;
    }

    public addFile(fileName: string, file: InitFile) {
        this.files[fileName] = file;
    }

    public addGroup(groupName: string, group: InitGroup = {}) {
        this.groups[groupName] = group;
    }

    public addUser(userName: string, user: InitUser = {}) {
        this.users[userName] = user;
    }

    public addPackage(type: PackageType, name: string, version: PackageVersion = {}) {
        if (!(type in this.packages)) { this.packages[type] = {}; }
        this.packages[type][name] = version;
    }
}

export interface InitCommand {
    /**
     * The command to run as a shell command.
     *
     * Exactly one of 'shellCommand' and 'command' must be specified.
     */
    shellCommand?: string;

    /**
     * The command to run as the binary path and arguments.
     *
     * If you use this form, you do not have to quote command-line arguments.
     *
     * Exactly one of 'shellCommand' and 'command' must be specified.
     */
    command?: string[];

    /**
     * Completely replace the environment to run this command in
     *
     * @default Inherit environment
     */
    env?: {[key: string]: string};

    /**
     * Working directory
     *
     * @default Current working directory
     */
    cwd?: string;

    /**
     * Run this command first, and only run command if this command exits with 0
     *
     * @default No Test
     */
    test?: string;

    /**
     * Continue even if the command fails
     *
     * @default false
     */
    ignoreErrors?: boolean;

    /**
     * Wait after the command (in case it causes a reboot)
     *
     * Windows only. Can be a number of seconds, or the word "forever" in
     * which case the computer MUST reboot for the script to continue.
     *
     * @default 60
     */
    waitAfterCompletionSeconds?: string;
}

export interface InitFile {
    /**
     * URL to load the contents from
     */
    sourceUrl?: string;

    /**
     * File contents or symlink source location
     */
    content?: string;

    /**
     * JSON object which should be the content of the file
     *
     * May contain CloudFormation intrinsics.
     */
    contentObject?: object;

    /**
     * Encoding format.
     *
     * Only used if content is given.
     */
    encoding?: Encoding;

    /**
     * Name of the group owner of the file
     *
     * Not on Windows.
     */
    group?: string;

    /**
     * Name of the user owner of the file
     *
     * Not on Windows.
     */
    user?: string;

    /**
     * Octal representation of file permissions
     *
     * Not on Windows.
     */
    mode?: string;
}

export interface InitGroup {
    /**
     * GID of the group
     *
     * @default Automatic
     */
    groupId?: number;
}

export interface InitUser {
    /**
     * UID of the user
     *
     * @default Automatic
     */
    userId?: number;

    groups?: string[];

    homeDir?: string;
}

export enum Encoding {
    Plain = 'plain',
    Base64 = 'base64'
}

export enum PackageType {
    Rpm = 'rpm',
    Yum = 'yum',
    Apt = 'apt',
    RubyGems = 'rubygems',
    Python = 'python',
}

export interface PackageVersion {
    version?: string;

    versions?: string[];
}