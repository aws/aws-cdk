import { StringSpecializer } from 'aws-cdk-lib/core/lib/helpers-internal';
/**
 * Bootstrapped role specifier. These roles must exist already.
 * This class does not create new IAM Roles.
 */
export declare class BootstrapRole {
    private readonly roleArn;
    /**
     * Use the currently assumed role/credentials
     */
    static cliCredentials(): BootstrapRole;
    /**
     * Specify an existing IAM Role to assume
     */
    static fromRoleArn(arn: string): BootstrapRole;
    private static CLI_CREDS;
    private constructor();
    /**
     * Whether or not this is object was created using BootstrapRole.cliCredentials()
     */
    isCliCredentials(): boolean;
    /**
     * @internal
     */
    _arnForCloudFormation(): string | undefined;
    /**
     * @internal
     */
    _arnForCloudAssembly(): string | undefined;
    /**
     * @internal
     */
    _specialize(spec: StringSpecializer): BootstrapRole;
}
/**
 * Roles that are bootstrapped to your account.
 */
export interface BootstrapRoles {
    /**
     * CloudFormation Execution Role
     *
     * @default - use bootstrapped role
     */
    readonly cloudFormationExecutionRole?: BootstrapRole;
    /**
     * Deployment Action Role
     *
     * @default - use boostrapped role
     */
    readonly deploymentRole?: BootstrapRole;
    /**
     * Lookup Role
     *
     * @default - use bootstrapped role
     */
    readonly lookupRole?: BootstrapRole;
}
/**
 * Roles that are included in the Staging Stack
 * (for access to Staging Resources)
 */
export interface StagingRoles {
    /**
     * File Asset Publishing Role
     *
     * @default - staging stack creates a file asset publishing role
     */
    readonly fileAssetPublishingRole?: BootstrapRole;
    /**
     * Docker Asset Publishing Role
     *
     * @default - staging stack creates a docker asset publishing role
     */
    readonly dockerAssetPublishingRole?: BootstrapRole;
}
