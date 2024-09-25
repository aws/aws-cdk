import { Logger } from './shell';
import { IAws } from '../aws';
export interface DockerCredentials {
    readonly Username: string;
    readonly Secret: string;
}
export interface DockerCredentialsConfig {
    readonly version: string;
    readonly domainCredentials: Record<string, DockerDomainCredentialSource>;
}
export interface DockerDomainCredentialSource {
    readonly secretsManagerSecretId?: string;
    readonly secretsUsernameField?: string;
    readonly secretsPasswordField?: string;
    readonly ecrRepository?: boolean;
    readonly assumeRoleArn?: string;
}
/** Returns the presumed location of the CDK Docker credentials config file */
export declare function cdkCredentialsConfigFile(): string;
/** Loads and parses the CDK Docker credentials configuration, if it exists. */
export declare function cdkCredentialsConfig(): DockerCredentialsConfig | undefined;
/** Fetches login credentials from the configured source (e.g., SecretsManager, ECR) */
export declare function fetchDockerLoginCredentials(aws: IAws, config: DockerCredentialsConfig, endpoint: string): Promise<{
    Username: any;
    Secret: any;
}>;
export declare function obtainEcrCredentials(ecr: AWS.ECR, logger?: Logger): Promise<{
    username: string;
    password: string;
    endpoint: string;
}>;
