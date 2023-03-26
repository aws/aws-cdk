import * as iam from '@aws-cdk/aws-iam';
import { CfnResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { InitElement } from './cfn-init-elements';
import { OperatingSystemType } from './machine-image';
import { InitElementConfig } from './private/cfn-init-internal';
import { UserData } from './user-data';
/**
 * A CloudFormation-init configuration
 */
export declare class CloudFormationInit {
    /**
     * Build a new config from a set of Init Elements
     */
    static fromElements(...elements: InitElement[]): CloudFormationInit;
    /**
     * Use an existing InitConfig object as the default and only config
     */
    static fromConfig(config: InitConfig): CloudFormationInit;
    /**
     * Build a CloudFormationInit from config sets
     */
    static fromConfigSets(props: ConfigSetProps): CloudFormationInit;
    private readonly _configSets;
    private readonly _configs;
    private constructor();
    /**
     * Add a config with the given name to this CloudFormationInit object
     */
    addConfig(configName: string, config: InitConfig): void;
    /**
     * Add a config set with the given name to this CloudFormationInit object
     *
     * The new configset will reference the given configs in the given order.
     */
    addConfigSet(configSetName: string, configNames?: string[]): void;
    /**
     * Attach the CloudFormation Init config to the given resource
     *
     * As an app builder, use `instance.applyCloudFormationInit()` or
     * `autoScalingGroup.applyCloudFormationInit()` to trigger this method.
     *
     * This method does the following:
     *
     * - Renders the `AWS::CloudFormation::Init` object to the given resource's
     *   metadata, potentially adding a `AWS::CloudFormation::Authentication` object
     *   next to it if required.
     * - Updates the instance role policy to be able to call the APIs required for
     *   `cfn-init` and `cfn-signal` to work, and potentially add permissions to download
     *   referenced asset and bucket resources.
     * - Updates the given UserData with commands to execute the `cfn-init` script.
     */
    attach(attachedResource: CfnResource, attachOptions: AttachInitOptions): void;
    private bind;
}
/**
 * A collection of configuration elements
 */
export declare class InitConfig {
    private readonly elements;
    constructor(elements: InitElement[]);
    /**
     * Whether this configset has elements or not
     */
    isEmpty(): boolean;
    /**
     * Add one or more elements to the config
     */
    add(...elements: InitElement[]): void;
    /**
     * Called when the config is applied to an instance.
     * Creates the CloudFormation representation of the Init config and handles any permissions and assets.
     * @internal
     */
    _bind(scope: Construct, options: AttachInitOptions): InitElementConfig;
    private bindForType;
    private initPlatformFromOSType;
}
/**
 * Options for CloudFormationInit.withConfigSets
 */
export interface ConfigSetProps {
    /**
     * The definitions of each config set
     */
    readonly configSets: Record<string, string[]>;
    /**
     * The sets of configs to pick from
     */
    readonly configs: Record<string, InitConfig>;
}
/**
 * Options for attaching a CloudFormationInit to a resource
 */
export interface AttachInitOptions {
    /**
     * Instance role of the consuming instance or fleet
     */
    readonly instanceRole: iam.IRole;
    /**
     * Include --url argument when running cfn-init and cfn-signal commands
     *
     * This will be the cloudformation endpoint in the deployed region
     * e.g. https://cloudformation.us-east-1.amazonaws.com
     *
     * @default false
     */
    readonly includeUrl?: boolean;
    /**
     * Include --role argument when running cfn-init and cfn-signal commands
     *
     * This will be the IAM instance profile attached to the EC2 instance
     *
     * @default false
     */
    readonly includeRole?: boolean;
    /**
     * OS Platform the init config will be used for
     */
    readonly platform: OperatingSystemType;
    /**
     * UserData to add commands to
     */
    readonly userData: UserData;
    /**
     * ConfigSet to activate
     *
     * @default ['default']
     */
    readonly configSets?: string[];
    /**
     * Whether to embed a hash into the userData
     *
     * If `true` (the default), a hash of the config will be embedded into the
     * UserData, so that if the config changes, the UserData changes and
     * the instance will be replaced.
     *
     * If `false`, no such hash will be embedded, and if the CloudFormation Init
     * config changes nothing will happen to the running instance.
     *
     * @default true
     */
    readonly embedFingerprint?: boolean;
    /**
     * Print the results of running cfn-init to the Instance System Log
     *
     * By default, the output of running cfn-init is written to a log file
     * on the instance. Set this to `true` to print it to the System Log
     * (visible from the EC2 Console), `false` to not print it.
     *
     * (Be aware that the system log is refreshed at certain points in
     * time of the instance life cycle, and successful execution may
     * not always show up).
     *
     * @default true
     */
    readonly printLog?: boolean;
    /**
     * Don't fail the instance creation when cfn-init fails
     *
     * You can use this to prevent CloudFormation from rolling back when
     * instances fail to start up, to help in debugging.
     *
     * @default false
     */
    readonly ignoreFailures?: boolean;
    /**
     * When provided, signals this resource instead of the attached resource
     *
     * You can use this to support signaling LaunchTemplate while attaching AutoScalingGroup
     *
     * @default - if this property is undefined cfn-signal signals the attached resource
     */
    readonly signalResource?: CfnResource;
}
