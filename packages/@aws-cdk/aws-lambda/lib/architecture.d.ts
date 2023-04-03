/**
 * Architectures supported by AWS Lambda
 */
export declare class Architecture {
    /**
     * 64 bit architecture with x86 instruction set.
     */
    static readonly X86_64: Architecture;
    /**
     * 64 bit architecture with the ARM instruction set.
     */
    static readonly ARM_64: Architecture;
    /**
     * Used to specify a custom architecture name.
     * Use this if the architecture name is not yet supported by the CDK.
     * @param name the architecture name as recognized by AWS Lambda.
     * @param [dockerPlatform=linux/amd64] the platform to use for this architecture when building with Docker
     */
    static custom(name: string, dockerPlatform?: string): Architecture;
    /**
     * The name of the architecture as recognized by the AWS Lambda service APIs.
     */
    readonly name: string;
    /**
     * The platform to use for this architecture when building with Docker.
     */
    readonly dockerPlatform: string;
    private constructor();
}
