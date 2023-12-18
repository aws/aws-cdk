/**
 * In what scenarios should the CLI ask for approval
 */
export declare enum RequireApproval {
    /**
     * Never ask for approval
     */
    NEVER = "never",
    /**
     * Prompt for approval for any type  of change to the stack
     */
    ANYCHANGE = "any-change",
    /**
     * Only prompt for approval if there are security related changes
     */
    BROADENING = "broadening"
}
/**
 * Default CDK CLI options that apply to all commands
 */
export interface DefaultCdkOptions {
    /**
     * List of stacks to deploy
     *
     * Requried if `all` is not set
     *
     * @default - []
     */
    readonly stacks?: string[];
    /**
     * Deploy all stacks
     *
     * Requried if `stacks` is not set
     *
     * @default - false
     */
    readonly all?: boolean;
    /**
     * command-line for executing your app or a cloud assembly directory
     * e.g. "node bin/my-app.js"
     * or
     * "cdk.out"
     *
     * @default - read from cdk.json
     */
    readonly app?: string;
    /**
     * Role to pass to CloudFormation for deployment
     *
     * @default - use the bootstrap cfn-exec role
     */
    readonly roleArn?: string;
    /**
     * Additional context
     *
     * @default - no additional context
     */
    readonly context?: {
        [name: string]: string;
    };
    /**
     * Print trace for stack warnings
     *
     * @default false
     */
    readonly trace?: boolean;
    /**
     * Do not construct stacks with warnings
     *
     * @default false
     */
    readonly strict?: boolean;
    /**
     * Perform context lookups.
     *
     * Synthesis fails if this is disabled and context lookups need
     * to be performed
     *
     * @default true
     */
    readonly lookups?: boolean;
    /**
      * Ignores synthesis errors, which will likely produce an invalid output
     *
     * @default false
     */
    readonly ignoreErrors?: boolean;
    /**
     * Use JSON output instead of YAML when templates are printed
     * to STDOUT
     *
     * @default false
     */
    readonly json?: boolean;
    /**
     * show debug logs
     *
     * @default false
     */
    readonly verbose?: boolean;
    /**
     * enable emission of additional debugging information, such as creation stack
     * traces of tokens
     *
     * @default false
     */
    readonly debug?: boolean;
    /**
     * Use the indicated AWS profile as the default environment
     *
     * @default - no profile is used
     */
    readonly profile?: string;
    /**
     * Use the indicated proxy. Will read from
     * HTTPS_PROXY environment if specified
     *
     * @default - no proxy
     */
    readonly proxy?: string;
    /**
     * Path to CA certificate to use when validating HTTPS
     * requests.
     *
     * @default - read from AWS_CA_BUNDLE environment variable
     */
    readonly caBundlePath?: string;
    /**
     * Force trying to fetch EC2 instance credentials
     *
     * @default - guess EC2 instance status
     */
    readonly ec2Creds?: boolean;
    /**
     * Include "AWS::CDK::Metadata" resource in synthesized templates
     *
     * @default true
     */
    readonly versionReporting?: boolean;
    /**
     * Include "aws:cdk:path" CloudFormation metadata for each resource
     *
     * @default true
     */
    readonly pathMetadata?: boolean;
    /**
     * Include "aws:asset:*" CloudFormation metadata for resources that use assets
     *
     * @default true
     */
    readonly assetMetadata?: boolean;
    /**
     * Copy assets to the output directory
     *
     * Needed for local debugging the source files with SAM CLI
     *
     * @default false
     */
    readonly staging?: boolean;
    /**
     * Emits the synthesized cloud assembly into a directory
     *
     * @default cdk.out
     */
    readonly output?: string;
    /**
     * Show relevant notices
     *
     * @default true
     */
    readonly notices?: boolean;
    /**
     * Show colors and other style from console output
     *
     * @default true
     */
    readonly color?: boolean;
}
