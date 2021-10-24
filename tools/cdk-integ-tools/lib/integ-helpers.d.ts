export declare class IntegrationTests {
    private readonly directory;
    constructor(directory: string);
    fromCliArgs(tests?: string[]): Promise<IntegrationTest[]>;
    discover(): Promise<IntegrationTest[]>;
    request(files: string[]): Promise<IntegrationTest[]>;
    private readTree;
}
export interface SynthOptions {
    readonly context?: Record<string, any>;
    readonly env?: Record<string, string>;
}
export declare class IntegrationTest {
    private readonly directory;
    readonly name: string;
    readonly expectedFileName: string;
    private readonly expectedFilePath;
    private readonly cdkContextPath;
    private readonly sourceFilePath;
    constructor(directory: string, name: string);
    /**
     * Do a CDK synth, mimicking the CLI (without actually using it)
     *
     * The CLI has a pretty slow startup time because of all the modules it needs to load,
     * and we are running this in a tight loop. Bypass it to be quicker!
     *
     * Return the "main" template or a concatenation of all listed templates in the pragma
     */
    cdkSynthFast(options?: SynthOptions): Promise<any>;
    /**
     * Invoke the CDK CLI with some options
     */
    invokeCli(args: string[], options?: {
        json?: boolean;
        context?: any;
        verbose?: boolean;
        env?: any;
    }): Promise<any>;
    hasExpected(): boolean;
    /**
     * Returns the single test stack to use.
     *
     * If the test has a single stack, it will be chosen. Otherwise a pragma is expected within the
     * test file the name of the stack:
     *
     * @example
     *
     *    /// !cdk-integ <stack-name>
     *
     */
    determineTestStack(): Promise<string[]>;
    readExpected(): Promise<any>;
    writeExpected(actual: any): Promise<void>;
    /**
     * Return the non-stack pragmas
     *
     * These are all pragmas that start with "pragma:".
     *
     * For backwards compatibility reasons, all pragmas that DON'T start with this
     * string are considered to be stack names.
     */
    pragmas(): Promise<string[]>;
    private writeCdkContext;
    private cleanupTemporaryFiles;
    /**
     * Reads stack names from the "!cdk-integ" pragma.
     *
     * Every word that's NOT prefixed by "pragma:" is considered a stack name.
     *
     * @example
     *
     *    /// !cdk-integ <stack-name>
     */
    private readStackPragma;
    /**
     * Read arbitrary cdk-integ pragma directives
     *
     * Reads the test source file and looks for the "!cdk-integ" pragma. If it exists, returns it's
     * contents. This allows integ tests to supply custom command line arguments to "cdk deploy" and "cdk synth".
     *
     * @example
     *
     *    /// !cdk-integ [...]
     */
    private readIntegPragma;
}
export declare const DEFAULT_SYNTH_OPTIONS: {
    context: {
        "aws:cdk:availability-zones:fallback": string[];
        'availability-zones:account=12345678:region=test-region': string[];
        'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region': string;
        'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region': string;
        'ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region': string;
        'ami:account=12345678:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=test-region': string;
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': {
            vpcId: string;
            subnetGroups: {
                type: string;
                name: string;
                subnets: {
                    subnetId: string;
                    availabilityZone: string;
                    routeTableId: string;
                }[];
            }[];
        };
    };
    env: {
        CDK_INTEG_ACCOUNT: string;
        CDK_INTEG_REGION: string;
    };
};
