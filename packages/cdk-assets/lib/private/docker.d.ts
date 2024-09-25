import { Logger } from './shell';
interface BuildOptions {
    readonly directory: string;
    /**
     * Tag the image with a given repoName:tag combination
     */
    readonly tag: string;
    readonly target?: string;
    readonly file?: string;
    readonly buildArgs?: Record<string, string>;
    readonly buildSecrets?: Record<string, string>;
    readonly buildSsh?: string;
    readonly networkMode?: string;
    readonly platform?: string;
    readonly outputs?: string[];
    readonly cacheFrom?: DockerCacheOption[];
    readonly cacheTo?: DockerCacheOption;
    readonly cacheDisabled?: boolean;
    readonly quiet?: boolean;
}
interface PushOptions {
    readonly tag: string;
    readonly quiet?: boolean;
}
export interface DockerCredentialsConfig {
    readonly version: string;
    readonly domainCredentials: Record<string, DockerDomainCredentials>;
}
export interface DockerDomainCredentials {
    readonly secretsManagerSecretId?: string;
    readonly ecrRepository?: string;
}
export interface DockerCacheOption {
    readonly type: string;
    readonly params?: {
        [key: string]: string;
    };
}
export declare class Docker {
    private readonly logger?;
    private configDir;
    constructor(logger?: Logger | undefined);
    /**
     * Whether an image with the given tag exists
     */
    exists(tag: string): Promise<boolean>;
    build(options: BuildOptions): Promise<void>;
    /**
     * Get credentials from ECR and run docker login
     */
    login(ecr: AWS.ECR): Promise<void>;
    tag(sourceTag: string, targetTag: string): Promise<void>;
    push(options: PushOptions): Promise<void>;
    /**
     * If a CDK Docker Credentials file exists, creates a new Docker config directory.
     * Sets up `docker-credential-cdk-assets` to be the credential helper for each domain in the CDK config.
     * All future commands (e.g., `build`, `push`) will use this config.
     *
     * See https://docs.docker.com/engine/reference/commandline/login/#credential-helpers for more details on cred helpers.
     *
     * @returns true if CDK config was found and configured, false otherwise
     */
    configureCdkCredentials(): boolean;
    /**
     * Removes any configured Docker config directory.
     * All future commands (e.g., `build`, `push`) will use the default config.
     *
     * This is useful after calling `configureCdkCredentials` to reset to default credentials.
     */
    resetAuthPlugins(): void;
    private execute;
    private cacheOptionToFlag;
}
export interface DockerFactoryOptions {
    readonly repoUri: string;
    readonly ecr: AWS.ECR;
    readonly logger: (m: string) => void;
}
/**
 * Helps get appropriately configured Docker instances during the container
 * image publishing process.
 */
export declare class DockerFactory {
    private enterLoggedInDestinationsCriticalSection;
    private loggedInDestinations;
    /**
     * Gets a Docker instance for building images.
     */
    forBuild(options: DockerFactoryOptions): Promise<Docker>;
    /**
     * Gets a Docker instance for pushing images to ECR.
     */
    forEcrPush(options: DockerFactoryOptions): Promise<Docker>;
    private loginOncePerDestination;
}
export {};
