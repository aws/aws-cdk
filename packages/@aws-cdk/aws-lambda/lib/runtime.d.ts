import { BundlingDockerImage, DockerImage } from '@aws-cdk/core';
export interface LambdaRuntimeProps {
    /**
     * Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.
     * @default false
     */
    readonly supportsInlineCode?: boolean;
    /**
     * The Docker image name to be used for bundling in this runtime.
     * @default - the latest docker image "amazon/public.ecr.aws/sam/build-<runtime>" from https://gallery.ecr.aws
     */
    readonly bundlingDockerImage?: string;
    /**
     * Whether this runtime is integrated with and supported for profiling using Amazon CodeGuru Profiler.
     * @default false
     */
    readonly supportsCodeGuruProfiling?: boolean;
}
export declare enum RuntimeFamily {
    NODEJS = 0,
    JAVA = 1,
    PYTHON = 2,
    DOTNET_CORE = 3,
    GO = 4,
    RUBY = 5,
    OTHER = 6
}
/**
 * Lambda function runtime environment.
 *
 * If you need to use a runtime name that doesn't exist as a static member, you
 * can instantiate a `Runtime` object, e.g: `new Runtime('nodejs99.99')`.
 */
export declare class Runtime {
    /** A list of all known `Runtime`'s. */
    static readonly ALL: Runtime[];
    /**
     * The NodeJS runtime (nodejs)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS: Runtime;
    /**
     * The NodeJS 4.3 runtime (nodejs4.3)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS_4_3: Runtime;
    /**
     * The NodeJS 6.10 runtime (nodejs6.10)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS_6_10: Runtime;
    /**
     * The NodeJS 8.10 runtime (nodejs8.10)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS_8_10: Runtime;
    /**
     * The NodeJS 10.x runtime (nodejs10.x)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS_10_X: Runtime;
    /**
     * The NodeJS 12.x runtime (nodejs12.x)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS runtime.
     */
    static readonly NODEJS_12_X: Runtime;
    /**
     * The NodeJS 14.x runtime (nodejs14.x)
     */
    static readonly NODEJS_14_X: Runtime;
    /**
     * The NodeJS 16.x runtime (nodejs16.x)
     */
    static readonly NODEJS_16_X: Runtime;
    /**
     * The NodeJS 18.x runtime (nodejs18.x) supported in all commercial regions except me-central-1, eu-central-2 and eu-south-2.
     */
    static readonly NODEJS_18_X: Runtime;
    /**
     * The Python 2.7 runtime (python2.7)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python runtime.
     */
    static readonly PYTHON_2_7: Runtime;
    /**
     * The Python 3.6 runtime (python3.6) (not recommended)
     *
     * The Python 3.6 runtime is deprecated as of July 2022.
     *
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python runtime.
     */
    static readonly PYTHON_3_6: Runtime;
    /**
     * The Python 3.7 runtime (python3.7)
     */
    static readonly PYTHON_3_7: Runtime;
    /**
     * The Python 3.8 runtime (python3.8)
     */
    static readonly PYTHON_3_8: Runtime;
    /**
     * The Python 3.9 runtime (python3.9)
     */
    static readonly PYTHON_3_9: Runtime;
    /**
     * The Java 8 runtime (java8)
     */
    static readonly JAVA_8: Runtime;
    /**
     * The Java 8 Corretto runtime (java8.al2)
     */
    static readonly JAVA_8_CORRETTO: Runtime;
    /**
     * The Java 11 runtime (java11)
     */
    static readonly JAVA_11: Runtime;
    /**
     * The .NET 6 runtime (dotnet6)
     */
    static readonly DOTNET_6: Runtime;
    /**
     * The .NET Core 1.0 runtime (dotnetcore1.0)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest .NET Core runtime.
     */
    static readonly DOTNET_CORE_1: Runtime;
    /**
     * The .NET Core 2.0 runtime (dotnetcore2.0)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest .NET Core runtime.
     */
    static readonly DOTNET_CORE_2: Runtime;
    /**
     * The .NET Core 2.1 runtime (dotnetcore2.1)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest .NET Core runtime.
     */
    static readonly DOTNET_CORE_2_1: Runtime;
    /**
     * The .NET Core 3.1 runtime (dotnetcore3.1)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest .NET Core runtime.
     */
    static readonly DOTNET_CORE_3_1: Runtime;
    /**
     * The Go 1.x runtime (go1.x)
     */
    static readonly GO_1_X: Runtime;
    /**
     * The Ruby 2.5 runtime (ruby2.5)
     * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Ruby runtime.
     */
    static readonly RUBY_2_5: Runtime;
    /**
     * The Ruby 2.7 runtime (ruby2.7)
     */
    static readonly RUBY_2_7: Runtime;
    /**
     * The custom provided runtime (provided)
     */
    static readonly PROVIDED: Runtime;
    /**
     * The custom provided runtime (provided)
     */
    static readonly PROVIDED_AL2: Runtime;
    /**
     * A special runtime entry to be used when function is using a docker image.
     */
    static readonly FROM_IMAGE: Runtime;
    /**
     * The name of this runtime, as expected by the Lambda resource.
     */
    readonly name: string;
    /**
     * Whether the ``ZipFile`` (aka inline code) property can be used with this
     * runtime.
     */
    readonly supportsInlineCode: boolean;
    /**
     * Whether this runtime is integrated with and supported for profiling using Amazon CodeGuru Profiler.
     */
    readonly supportsCodeGuruProfiling: boolean;
    /**
     * The runtime family.
     */
    readonly family?: RuntimeFamily;
    /**
     * DEPRECATED
     * @deprecated use `bundlingImage`
     */
    readonly bundlingDockerImage: BundlingDockerImage;
    /**
     * The bundling Docker image for this runtime.
     */
    readonly bundlingImage: DockerImage;
    constructor(name: string, family?: RuntimeFamily, props?: LambdaRuntimeProps);
    toString(): string;
    runtimeEquals(other: Runtime): boolean;
}
