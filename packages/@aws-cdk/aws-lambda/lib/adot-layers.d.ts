import { IConstruct } from 'constructs';
import { Architecture } from './architecture';
import { IFunction } from './function-base';
/**
 * The type of ADOT Lambda layer
 */
declare enum AdotLambdaLayerType {
    /**
     * The Lambda layer for ADOT Java instrumentation library. This layer only auto-instruments AWS
     * SDK libraries.
     */
    JAVA_SDK = "JAVA_SDK",
    /**
     * The Lambda layer for ADOT Java Auto-Instrumentation Agent. This layer automatically instruments
     * a large number of libraries and frameworks out of the box and has notable impact on startup
     * performance.
     */
    JAVA_AUTO_INSTRUMENTATION = "JAVA_AUTO_INSTRUMENTATION",
    /**
     * The Lambda layer for ADOT Collector, OpenTelemetry for JavaScript and supported libraries.
     */
    JAVASCRIPT_SDK = "JAVASCRIPT_SDK",
    /**
     * The Lambda layer for ADOT Collector, OpenTelemetry for Python and supported libraries.
     */
    PYTHON_SDK = "PYTHON_SDK",
    /**
     * The generic Lambda layer that contains only ADOT Collector, used for manual instrumentation
     * use cases (such as Go or DotNet runtimes).
     */
    GENERIC = "GENERIC"
}
/**
 * Config returned from `AdotLambdaLayerVersion._bind`
 */
interface AdotLambdaLayerBindConfig {
    /**
     * ARN of the ADOT Lambda layer version
     */
    readonly arn: string;
}
/**
 * Properties for an ADOT instrumentation in Lambda
 */
export interface AdotInstrumentationConfig {
    /**
     * The ADOT Lambda layer.
     */
    readonly layerVersion: AdotLayerVersion;
    /**
     * The startup script to run, see ADOT documentation to pick the right script for your use case: https://aws-otel.github.io/docs/getting-started/lambda
     */
    readonly execWrapper: AdotLambdaExecWrapper;
}
/**
 * An ADOT Lambda layer version that's specific to a lambda layer type and an architecture.
 */
export declare abstract class AdotLayerVersion {
    /**
     * The ADOT Lambda layer for Java SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaSdkLayerVersion(version: AdotLambdaLayerJavaSdkVersion): AdotLayerVersion;
    /**
     * The ADOT Lambda layer for Java auto instrumentation
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaAutoInstrumentationLayerVersion(version: AdotLambdaLayerJavaAutoInstrumentationVersion): AdotLayerVersion;
    /**
     * The ADOT Lambda layer for JavaScript SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaScriptSdkLayerVersion(version: AdotLambdaLayerJavaScriptSdkVersion): AdotLayerVersion;
    /**
     * The ADOT Lambda layer for Python SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromPythonSdkLayerVersion(version: AdotLambdaLayerPythonSdkVersion): AdotLayerVersion;
    /**
     * The ADOT Lambda layer for generic use cases
     *
     * @param version The version of the Lambda layer to use
     */
    static fromGenericLayerVersion(version: AdotLambdaLayerGenericVersion): AdotLayerVersion;
    private static fromAdotVersion;
    /**
     * Produce a `AdotLambdaLayerBindConfig` instance from this `AdotLayerVersion` instance.
     *
     * @internal
     */
    abstract _bind(_function: IFunction): AdotLambdaLayerBindConfig;
}
/**
 * The wrapper script to be used for the Lambda function in order to enable auto instrumentation
 * with ADOT.
 */
export declare enum AdotLambdaExecWrapper {
    /**
     * Wrapping regular Lambda handlers.
     */
    REGULAR_HANDLER = "/opt/otel-handler",
    /**
     * Wrapping regular handlers (implementing RequestHandler) proxied through API Gateway, enabling
     * HTTP context propagation.
     */
    PROXY_HANDLER = "/opt/otel-proxy-handler",
    /**
     * Wrapping streaming handlers (implementing RequestStreamHandler), enabling HTTP context
     * propagation for HTTP requests.
     */
    STREAM_HANDLER = "/opt/otel-stream-handler"
}
declare abstract class AdotLambdaLayerVersion {
    protected readonly type: AdotLambdaLayerType;
    protected readonly version: string;
    protected constructor(type: AdotLambdaLayerType, version: string);
    /**
     * The ARN of the Lambda layer
     *
     * @param scope The binding scope. Usually this is the stack where the Lambda layer is bound to
     * @param architecture The architecture of the Lambda layer (either X86_64 or ARM_64)
     */
    layerArn(scope: IConstruct, architecture: Architecture): string;
}
/**
 * The collection of versions of the ADOT Lambda Layer for Java SDK
 */
export declare class AdotLambdaLayerJavaSdkVersion extends AdotLambdaLayerVersion {
    protected readonly layerVersion: string;
    /**
     * The latest layer version available in this CDK version. New versions could
     * introduce incompatible changes. Make sure to test them before deploying to production.
     */
    static readonly LATEST: AdotLambdaLayerJavaSdkVersion;
    /**
     * Version 1.19.0
     */
    static readonly V1_19_0: AdotLambdaLayerJavaSdkVersion;
    private constructor();
}
/**
 * The collection of versions of the ADOT Lambda Layer for Java auto-instrumentation
 */
export declare class AdotLambdaLayerJavaAutoInstrumentationVersion extends AdotLambdaLayerVersion {
    protected readonly layerVersion: string;
    /**
     * The latest layer version available in this CDK version. New versions could
     * introduce incompatible changes. Make sure to test them before deploying to production.
     */
    static readonly LATEST: AdotLambdaLayerJavaAutoInstrumentationVersion;
    /**
     * Version 1.19.2
     */
    static readonly V1_19_2: AdotLambdaLayerJavaAutoInstrumentationVersion;
    private constructor();
}
/**
 * The collection of versions of the ADOT Lambda Layer for Python SDK
 */
export declare class AdotLambdaLayerPythonSdkVersion extends AdotLambdaLayerVersion {
    protected readonly layerVersion: string;
    /**
     * The latest layer version available in this CDK version. New versions could
     * introduce incompatible changes. Make sure to test them before deploying to production.
     */
    static readonly LATEST: AdotLambdaLayerPythonSdkVersion;
    /**
     * Version 1.13.0
     */
    static readonly V1_13_0: AdotLambdaLayerPythonSdkVersion;
    private constructor();
}
/**
 * The collection of versions of the ADOT Lambda Layer for JavaScript SDK
 */
export declare class AdotLambdaLayerJavaScriptSdkVersion extends AdotLambdaLayerVersion {
    protected readonly layerVersion: string;
    /**
     * The latest layer version available in this CDK version. New versions could
     * introduce incompatible changes. Make sure to test them before deploying to production.
     */
    static readonly LATEST: AdotLambdaLayerJavaScriptSdkVersion;
    /**
     * Version 1.7.0
     */
    static readonly V1_7_0: AdotLambdaLayerJavaScriptSdkVersion;
    private constructor();
}
/**
 * The collection of versions of the ADOT Lambda Layer for generic purpose
 */
export declare class AdotLambdaLayerGenericVersion extends AdotLambdaLayerVersion {
    protected readonly layerVersion: string;
    /**
     * The latest layer version available in this CDK version. New versions could
     * introduce incompatible changes. Make sure to test them before deploying to production.
     */
    static readonly LATEST: AdotLambdaLayerGenericVersion;
    /**
     * Version 0.62.1
     */
    static readonly V0_62_1: AdotLambdaLayerGenericVersion;
    private constructor();
}
export {};
