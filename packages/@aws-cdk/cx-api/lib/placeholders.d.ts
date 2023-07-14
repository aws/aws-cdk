/**
 * Placeholders which can be used manifests
 *
 * These can occur both in the Asset Manifest as well as the general
 * Cloud Assembly manifest.
 */
export declare class EnvironmentPlaceholders {
    /**
     * Insert this into the destination fields to be replaced with the current region
     */
    static readonly CURRENT_REGION = "${AWS::Region}";
    /**
     * Insert this into the destination fields to be replaced with the current account
     */
    static readonly CURRENT_ACCOUNT = "${AWS::AccountId}";
    /**
     * Insert this into the destination fields to be replaced with the current partition
     */
    static readonly CURRENT_PARTITION = "${AWS::Partition}";
    /**
     * Replace the environment placeholders in all strings found in a complex object.
     *
     * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
     * (they're nominally independent tools).
     */
    static replace(object: any, values: EnvironmentPlaceholderValues): any;
    /**
     * Like 'replace', but asynchronous
     */
    static replaceAsync(object: any, provider: IEnvironmentPlaceholderProvider): Promise<any>;
    private static recurse;
}
/**
 * Return the appropriate values for the environment placeholders
 */
export interface EnvironmentPlaceholderValues {
    /**
     * Return the region
     */
    readonly region: string;
    /**
     * Return the account
     */
    readonly accountId: string;
    /**
     * Return the partition
     */
    readonly partition: string;
}
/**
 * Return the appropriate values for the environment placeholders
 */
export interface IEnvironmentPlaceholderProvider {
    /**
     * Return the region
     */
    region(): Promise<string>;
    /**
     * Return the account
     */
    accountId(): Promise<string>;
    /**
     * Return the partition
     */
    partition(): Promise<string>;
}
