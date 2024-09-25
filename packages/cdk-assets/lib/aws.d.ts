/**
 * AWS SDK operations required by Asset Publishing
 */
export interface IAws {
    discoverPartition(): Promise<string>;
    discoverDefaultRegion(): Promise<string>;
    discoverCurrentAccount(): Promise<Account>;
    discoverTargetAccount(options: ClientOptions): Promise<Account>;
    s3Client(options: ClientOptions): Promise<AWS.S3>;
    ecrClient(options: ClientOptions): Promise<AWS.ECR>;
    secretsManagerClient(options: ClientOptions): Promise<AWS.SecretsManager>;
}
export interface ClientOptions {
    region?: string;
    assumeRoleArn?: string;
    assumeRoleExternalId?: string;
    quiet?: boolean;
}
/**
 * An AWS account
 *
 * An AWS account always exists in only one partition. Usually we don't care about
 * the partition, but when we need to form ARNs we do.
 */
export interface Account {
    /**
     * The account number
     */
    readonly accountId: string;
    /**
     * The partition ('aws' or 'aws-cn' or otherwise)
     */
    readonly partition: string;
}
/**
 * AWS client using the AWS SDK for JS with no special configuration
 */
export declare class DefaultAwsClient implements IAws {
    private readonly AWS;
    private account?;
    constructor(profile?: string);
    s3Client(options: ClientOptions): Promise<import("aws-sdk").S3>;
    ecrClient(options: ClientOptions): Promise<import("aws-sdk").ECR>;
    secretsManagerClient(options: ClientOptions): Promise<import("aws-sdk").SecretsManager>;
    discoverPartition(): Promise<string>;
    discoverDefaultRegion(): Promise<string>;
    discoverCurrentAccount(): Promise<Account>;
    discoverTargetAccount(options: ClientOptions): Promise<Account>;
    private awsOptions;
    /**
     * Explicit manual AssumeRole call
     *
     * Necessary since I can't seem to get the built-in support for ChainableTemporaryCredentials to work.
     *
     * It needs an explicit configuration of `masterCredentials`, we need to put
     * a `DefaultCredentialProverChain()` in there but that is not possible.
     */
    private assumeRole;
}
