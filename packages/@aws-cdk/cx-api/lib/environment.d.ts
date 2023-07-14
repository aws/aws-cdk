/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
    /** The arbitrary name of this environment (user-set, or at least user-meaningful) */
    readonly name: string;
    /** The AWS account this environment deploys into */
    readonly account: string;
    /** The AWS region name where this environment deploys into */
    readonly region: string;
}
export declare const UNKNOWN_ACCOUNT = "unknown-account";
export declare const UNKNOWN_REGION = "unknown-region";
export declare class EnvironmentUtils {
    static parse(environment: string): Environment;
    /**
     * Build an environment object from an account and region
     */
    static make(account: string, region: string): Environment;
    /**
     * Format an environment string from an account and region
     */
    static format(account: string, region: string): string;
}
