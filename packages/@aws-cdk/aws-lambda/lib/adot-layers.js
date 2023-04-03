"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdotLambdaLayerGenericVersion = exports.AdotLambdaLayerJavaScriptSdkVersion = exports.AdotLambdaLayerPythonSdkVersion = exports.AdotLambdaLayerJavaAutoInstrumentationVersion = exports.AdotLambdaLayerJavaSdkVersion = exports.AdotLambdaExecWrapper = exports.AdotLayerVersion = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const region_info_1 = require("@aws-cdk/region-info");
const stack_1 = require("../../core/lib/stack");
const token_1 = require("../../core/lib/token");
const fact_1 = require("../../region-info/lib/fact");
/**
 * The type of ADOT Lambda layer
 */
var AdotLambdaLayerType;
(function (AdotLambdaLayerType) {
    /**
     * The Lambda layer for ADOT Java instrumentation library. This layer only auto-instruments AWS
     * SDK libraries.
     */
    AdotLambdaLayerType["JAVA_SDK"] = "JAVA_SDK";
    /**
     * The Lambda layer for ADOT Java Auto-Instrumentation Agent. This layer automatically instruments
     * a large number of libraries and frameworks out of the box and has notable impact on startup
     * performance.
     */
    AdotLambdaLayerType["JAVA_AUTO_INSTRUMENTATION"] = "JAVA_AUTO_INSTRUMENTATION";
    /**
     * The Lambda layer for ADOT Collector, OpenTelemetry for JavaScript and supported libraries.
     */
    AdotLambdaLayerType["JAVASCRIPT_SDK"] = "JAVASCRIPT_SDK";
    /**
     * The Lambda layer for ADOT Collector, OpenTelemetry for Python and supported libraries.
     */
    AdotLambdaLayerType["PYTHON_SDK"] = "PYTHON_SDK";
    /**
     * The generic Lambda layer that contains only ADOT Collector, used for manual instrumentation
     * use cases (such as Go or DotNet runtimes).
     */
    AdotLambdaLayerType["GENERIC"] = "GENERIC";
})(AdotLambdaLayerType || (AdotLambdaLayerType = {}));
/**
 * Return the ARN of an ADOT Lambda layer given its properties. If the region name is unknown
 * at synthesis time, it will generate a map in the CloudFormation template and perform the look
 * up at deployment time.
 *
 * @param scope the parent Construct that will use the imported layer.
 * @param type the type of the ADOT Lambda layer
 * @param version The version of the ADOT Lambda layer
 * @param architecture the architecture of the Lambda layer ('amd64' or 'arm64')
 */
function getLayerArn(scope, type, version, architecture) {
    const scopeStack = stack_1.Stack.of(scope);
    const region = scopeStack.region;
    // Region is defined, look up the arn, or throw an error if the version isn't supported by a region
    if (region !== undefined && !token_1.Token.isUnresolved(region)) {
        const arn = region_info_1.RegionInfo.get(region).adotLambdaLayerArn(type, version, architecture);
        if (arn === undefined) {
            throw new Error(`Could not find the ARN information for the ADOT Lambda Layer of type ${type} and version ${version} in ${region}`);
        }
        return arn;
    }
    // Otherwise, need to add a mapping to be looked up at deployment time
    return scopeStack.regionalFact(fact_1.FactName.adotLambdaLayer(type, version, architecture));
}
/**
 * An ADOT Lambda layer version that's specific to a lambda layer type and an architecture.
 */
class AdotLayerVersion {
    /**
     * The ADOT Lambda layer for Java SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaSdkLayerVersion(version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AdotLambdaLayerJavaSdkVersion(version);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromJavaSdkLayerVersion);
            }
            throw error;
        }
        return AdotLayerVersion.fromAdotVersion(version);
    }
    /**
     * The ADOT Lambda layer for Java auto instrumentation
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaAutoInstrumentationLayerVersion(version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AdotLambdaLayerJavaAutoInstrumentationVersion(version);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromJavaAutoInstrumentationLayerVersion);
            }
            throw error;
        }
        return AdotLayerVersion.fromAdotVersion(version);
    }
    /**
     * The ADOT Lambda layer for JavaScript SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromJavaScriptSdkLayerVersion(version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AdotLambdaLayerJavaScriptSdkVersion(version);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromJavaScriptSdkLayerVersion);
            }
            throw error;
        }
        return AdotLayerVersion.fromAdotVersion(version);
    }
    /**
     * The ADOT Lambda layer for Python SDK
     *
     * @param version The version of the Lambda layer to use
     */
    static fromPythonSdkLayerVersion(version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AdotLambdaLayerPythonSdkVersion(version);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPythonSdkLayerVersion);
            }
            throw error;
        }
        return AdotLayerVersion.fromAdotVersion(version);
    }
    /**
     * The ADOT Lambda layer for generic use cases
     *
     * @param version The version of the Lambda layer to use
     */
    static fromGenericLayerVersion(version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AdotLambdaLayerGenericVersion(version);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromGenericLayerVersion);
            }
            throw error;
        }
        return AdotLayerVersion.fromAdotVersion(version);
    }
    static fromAdotVersion(adotVersion) {
        return new (class extends AdotLayerVersion {
            _bind(_function) {
                return {
                    arn: adotVersion.layerArn(_function.stack, _function.architecture),
                };
            }
        })();
    }
}
exports.AdotLayerVersion = AdotLayerVersion;
_a = JSII_RTTI_SYMBOL_1;
AdotLayerVersion[_a] = { fqn: "@aws-cdk/aws-lambda.AdotLayerVersion", version: "0.0.0" };
/**
 * The wrapper script to be used for the Lambda function in order to enable auto instrumentation
 * with ADOT.
 */
var AdotLambdaExecWrapper;
(function (AdotLambdaExecWrapper) {
    /**
     * Wrapping regular Lambda handlers.
     */
    AdotLambdaExecWrapper["REGULAR_HANDLER"] = "/opt/otel-handler";
    /**
     * Wrapping regular handlers (implementing RequestHandler) proxied through API Gateway, enabling
     * HTTP context propagation.
     */
    AdotLambdaExecWrapper["PROXY_HANDLER"] = "/opt/otel-proxy-handler";
    /**
     * Wrapping streaming handlers (implementing RequestStreamHandler), enabling HTTP context
     * propagation for HTTP requests.
     */
    AdotLambdaExecWrapper["STREAM_HANDLER"] = "/opt/otel-stream-handler";
})(AdotLambdaExecWrapper = exports.AdotLambdaExecWrapper || (exports.AdotLambdaExecWrapper = {}));
class AdotLambdaLayerVersion {
    constructor(type, version) {
        this.type = type;
        this.version = version;
    }
    /**
     * The ARN of the Lambda layer
     *
     * @param scope The binding scope. Usually this is the stack where the Lambda layer is bound to
     * @param architecture The architecture of the Lambda layer (either X86_64 or ARM_64)
     */
    layerArn(scope, architecture) {
        return getLayerArn(scope, this.type, this.version, architecture.name);
    }
}
/**
 * The collection of versions of the ADOT Lambda Layer for Java SDK
 */
class AdotLambdaLayerJavaSdkVersion extends AdotLambdaLayerVersion {
    constructor(layerVersion) {
        super(AdotLambdaLayerType.JAVA_SDK, layerVersion);
        this.layerVersion = layerVersion;
    }
}
exports.AdotLambdaLayerJavaSdkVersion = AdotLambdaLayerJavaSdkVersion;
_b = JSII_RTTI_SYMBOL_1;
AdotLambdaLayerJavaSdkVersion[_b] = { fqn: "@aws-cdk/aws-lambda.AdotLambdaLayerJavaSdkVersion", version: "0.0.0" };
/**
 * The latest layer version available in this CDK version. New versions could
 * introduce incompatible changes. Make sure to test them before deploying to production.
 */
AdotLambdaLayerJavaSdkVersion.LATEST = new AdotLambdaLayerJavaSdkVersion('1.19.0');
/**
 * Version 1.19.0
 */
AdotLambdaLayerJavaSdkVersion.V1_19_0 = new AdotLambdaLayerJavaSdkVersion('1.19.0');
/**
 * The collection of versions of the ADOT Lambda Layer for Java auto-instrumentation
 */
class AdotLambdaLayerJavaAutoInstrumentationVersion extends AdotLambdaLayerVersion {
    constructor(layerVersion) {
        super(AdotLambdaLayerType.JAVA_AUTO_INSTRUMENTATION, layerVersion);
        this.layerVersion = layerVersion;
    }
}
exports.AdotLambdaLayerJavaAutoInstrumentationVersion = AdotLambdaLayerJavaAutoInstrumentationVersion;
_c = JSII_RTTI_SYMBOL_1;
AdotLambdaLayerJavaAutoInstrumentationVersion[_c] = { fqn: "@aws-cdk/aws-lambda.AdotLambdaLayerJavaAutoInstrumentationVersion", version: "0.0.0" };
/**
 * The latest layer version available in this CDK version. New versions could
 * introduce incompatible changes. Make sure to test them before deploying to production.
 */
AdotLambdaLayerJavaAutoInstrumentationVersion.LATEST = new AdotLambdaLayerJavaAutoInstrumentationVersion('1.19.2');
/**
 * Version 1.19.2
 */
AdotLambdaLayerJavaAutoInstrumentationVersion.V1_19_2 = new AdotLambdaLayerJavaAutoInstrumentationVersion('1.19.2');
/**
 * The collection of versions of the ADOT Lambda Layer for Python SDK
 */
class AdotLambdaLayerPythonSdkVersion extends AdotLambdaLayerVersion {
    constructor(layerVersion) {
        super(AdotLambdaLayerType.PYTHON_SDK, layerVersion);
        this.layerVersion = layerVersion;
    }
}
exports.AdotLambdaLayerPythonSdkVersion = AdotLambdaLayerPythonSdkVersion;
_d = JSII_RTTI_SYMBOL_1;
AdotLambdaLayerPythonSdkVersion[_d] = { fqn: "@aws-cdk/aws-lambda.AdotLambdaLayerPythonSdkVersion", version: "0.0.0" };
/**
 * The latest layer version available in this CDK version. New versions could
 * introduce incompatible changes. Make sure to test them before deploying to production.
 */
AdotLambdaLayerPythonSdkVersion.LATEST = new AdotLambdaLayerPythonSdkVersion('1.13.0');
/**
 * Version 1.13.0
 */
AdotLambdaLayerPythonSdkVersion.V1_13_0 = new AdotLambdaLayerPythonSdkVersion('1.13.0');
/**
 * The collection of versions of the ADOT Lambda Layer for JavaScript SDK
 */
class AdotLambdaLayerJavaScriptSdkVersion extends AdotLambdaLayerVersion {
    constructor(layerVersion) {
        super(AdotLambdaLayerType.JAVASCRIPT_SDK, layerVersion);
        this.layerVersion = layerVersion;
    }
}
exports.AdotLambdaLayerJavaScriptSdkVersion = AdotLambdaLayerJavaScriptSdkVersion;
_e = JSII_RTTI_SYMBOL_1;
AdotLambdaLayerJavaScriptSdkVersion[_e] = { fqn: "@aws-cdk/aws-lambda.AdotLambdaLayerJavaScriptSdkVersion", version: "0.0.0" };
/**
 * The latest layer version available in this CDK version. New versions could
 * introduce incompatible changes. Make sure to test them before deploying to production.
 */
AdotLambdaLayerJavaScriptSdkVersion.LATEST = new AdotLambdaLayerJavaScriptSdkVersion('1.7.0');
/**
 * Version 1.7.0
 */
AdotLambdaLayerJavaScriptSdkVersion.V1_7_0 = new AdotLambdaLayerJavaScriptSdkVersion('1.7.0');
/**
 * The collection of versions of the ADOT Lambda Layer for generic purpose
 */
class AdotLambdaLayerGenericVersion extends AdotLambdaLayerVersion {
    constructor(layerVersion) {
        super(AdotLambdaLayerType.GENERIC, layerVersion);
        this.layerVersion = layerVersion;
    }
}
exports.AdotLambdaLayerGenericVersion = AdotLambdaLayerGenericVersion;
_f = JSII_RTTI_SYMBOL_1;
AdotLambdaLayerGenericVersion[_f] = { fqn: "@aws-cdk/aws-lambda.AdotLambdaLayerGenericVersion", version: "0.0.0" };
/**
 * The latest layer version available in this CDK version. New versions could
 * introduce incompatible changes. Make sure to test them before deploying to production.
 */
AdotLambdaLayerGenericVersion.LATEST = new AdotLambdaLayerGenericVersion('0.62.1');
/**
 * Version 0.62.1
 */
AdotLambdaLayerGenericVersion.V0_62_1 = new AdotLambdaLayerGenericVersion('0.62.1');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRvdC1sYXllcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZG90LWxheWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBa0Q7QUFJbEQsZ0RBQTZDO0FBQzdDLGdEQUE2QztBQUM3QyxxREFBc0Q7QUFFdEQ7O0dBRUc7QUFDSCxJQUFLLG1CQTZCSjtBQTdCRCxXQUFLLG1CQUFtQjtJQUN0Qjs7O09BR0c7SUFDSCw0Q0FBcUIsQ0FBQTtJQUVyQjs7OztPQUlHO0lBQ0gsOEVBQXVELENBQUE7SUFFdkQ7O09BRUc7SUFDSCx3REFBaUMsQ0FBQTtJQUVqQzs7T0FFRztJQUNILGdEQUF5QixDQUFBO0lBRXpCOzs7T0FHRztJQUNILDBDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUE3QkksbUJBQW1CLEtBQW5CLG1CQUFtQixRQTZCdkI7QUFZRDs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFTLFdBQVcsQ0FBQyxLQUFpQixFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsWUFBb0I7SUFDekYsTUFBTSxVQUFVLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBRWpDLG1HQUFtRztJQUNuRyxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxhQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3ZELE1BQU0sR0FBRyxHQUFHLHdCQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDbkYsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQ2Isd0VBQXdFLElBQUksZ0JBQWdCLE9BQU8sT0FBTyxNQUFNLEVBQUUsQ0FDbkgsQ0FBQztTQUNIO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDWjtJ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QUE2QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTVFOztHQUVHO0FBQ29CLHFDQUFPLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlZ2lvbkluZm8gfSBmcm9tICdAYXdzLWNkay9yZWdpb24taW5mbyc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcmNoaXRlY3R1cmUgfSBmcm9tICcuL2FyY2hpdGVjdHVyZSc7XG5pbXBvcnQgeyBJRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9uLWJhc2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2xpYi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4uLy4uL2NvcmUvbGliL3Rva2VuJztcbmltcG9ydCB7IEZhY3ROYW1lIH0gZnJvbSAnLi4vLi4vcmVnaW9uLWluZm8vbGliL2ZhY3QnO1xuXG4vKipcbiAqIFRoZSB0eXBlIG9mIEFET1QgTGFtYmRhIGxheWVyXG4gKi9cbmVudW0gQWRvdExhbWJkYUxheWVyVHlwZSB7XG4gIC8qKlxuICAgKiBUaGUgTGFtYmRhIGxheWVyIGZvciBBRE9UIEphdmEgaW5zdHJ1bWVudGF0aW9uIGxpYnJhcnkuIFRoaXMgbGF5ZXIgb25seSBhdXRvLWluc3RydW1lbnRzIEFXU1xuICAgKiBTREsgbGlicmFyaWVzLlxuICAgKi9cbiAgSkFWQV9TREsgPSAnSkFWQV9TREsnLFxuXG4gIC8qKlxuICAgKiBUaGUgTGFtYmRhIGxheWVyIGZvciBBRE9UIEphdmEgQXV0by1JbnN0cnVtZW50YXRpb24gQWdlbnQuIFRoaXMgbGF5ZXIgYXV0b21hdGljYWxseSBpbnN0cnVtZW50c1xuICAgKiBhIGxhcmdlIG51bWJlciBvZiBsaWJyYXJpZXMgYW5kIGZyYW1ld29ya3Mgb3V0IG9mIHRoZSBib3ggYW5kIGhhcyBub3RhYmxlIGltcGFjdCBvbiBzdGFydHVwXG4gICAqIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgSkFWQV9BVVRPX0lOU1RSVU1FTlRBVElPTiA9ICdKQVZBX0FVVE9fSU5TVFJVTUVOVEFUSU9OJyxcblxuICAvKipcbiAgICogVGhlIExhbWJkYSBsYXllciBmb3IgQURPVCBDb2xsZWN0b3IsIE9wZW5UZWxlbWV0cnkgZm9yIEphdmFTY3JpcHQgYW5kIHN1cHBvcnRlZCBsaWJyYXJpZXMuXG4gICAqL1xuICBKQVZBU0NSSVBUX1NESyA9ICdKQVZBU0NSSVBUX1NESycsXG5cbiAgLyoqXG4gICAqIFRoZSBMYW1iZGEgbGF5ZXIgZm9yIEFET1QgQ29sbGVjdG9yLCBPcGVuVGVsZW1ldHJ5IGZvciBQeXRob24gYW5kIHN1cHBvcnRlZCBsaWJyYXJpZXMuXG4gICAqL1xuICBQWVRIT05fU0RLID0gJ1BZVEhPTl9TREsnLFxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJpYyBMYW1iZGEgbGF5ZXIgdGhhdCBjb250YWlucyBvbmx5IEFET1QgQ29sbGVjdG9yLCB1c2VkIGZvciBtYW51YWwgaW5zdHJ1bWVudGF0aW9uXG4gICAqIHVzZSBjYXNlcyAoc3VjaCBhcyBHbyBvciBEb3ROZXQgcnVudGltZXMpLlxuICAgKi9cbiAgR0VORVJJQyA9ICdHRU5FUklDJyxcbn1cblxuLyoqXG4gKiBDb25maWcgcmV0dXJuZWQgZnJvbSBgQWRvdExhbWJkYUxheWVyVmVyc2lvbi5fYmluZGBcbiAqL1xuaW50ZXJmYWNlIEFkb3RMYW1iZGFMYXllckJpbmRDb25maWcge1xuICAvKipcbiAgICogQVJOIG9mIHRoZSBBRE9UIExhbWJkYSBsYXllciB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSBhcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIEFSTiBvZiBhbiBBRE9UIExhbWJkYSBsYXllciBnaXZlbiBpdHMgcHJvcGVydGllcy4gSWYgdGhlIHJlZ2lvbiBuYW1lIGlzIHVua25vd25cbiAqIGF0IHN5bnRoZXNpcyB0aW1lLCBpdCB3aWxsIGdlbmVyYXRlIGEgbWFwIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBhbmQgcGVyZm9ybSB0aGUgbG9va1xuICogdXAgYXQgZGVwbG95bWVudCB0aW1lLlxuICpcbiAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCB0aGF0IHdpbGwgdXNlIHRoZSBpbXBvcnRlZCBsYXllci5cbiAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBBRE9UIExhbWJkYSBsYXllclxuICogQHBhcmFtIHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIEFET1QgTGFtYmRhIGxheWVyXG4gKiBAcGFyYW0gYXJjaGl0ZWN0dXJlIHRoZSBhcmNoaXRlY3R1cmUgb2YgdGhlIExhbWJkYSBsYXllciAoJ2FtZDY0JyBvciAnYXJtNjQnKVxuICovXG5mdW5jdGlvbiBnZXRMYXllckFybihzY29wZTogSUNvbnN0cnVjdCwgdHlwZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIGFyY2hpdGVjdHVyZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2NvcGVTdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgY29uc3QgcmVnaW9uID0gc2NvcGVTdGFjay5yZWdpb247XG5cbiAgLy8gUmVnaW9uIGlzIGRlZmluZWQsIGxvb2sgdXAgdGhlIGFybiwgb3IgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHZlcnNpb24gaXNuJ3Qgc3VwcG9ydGVkIGJ5IGEgcmVnaW9uXG4gIGlmIChyZWdpb24gIT09IHVuZGVmaW5lZCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHJlZ2lvbikpIHtcbiAgICBjb25zdCBhcm4gPSBSZWdpb25JbmZvLmdldChyZWdpb24pLmFkb3RMYW1iZGFMYXllckFybih0eXBlLCB2ZXJzaW9uLCBhcmNoaXRlY3R1cmUpO1xuICAgIGlmIChhcm4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ291bGQgbm90IGZpbmQgdGhlIEFSTiBpbmZvcm1hdGlvbiBmb3IgdGhlIEFET1QgTGFtYmRhIExheWVyIG9mIHR5cGUgJHt0eXBlfSBhbmQgdmVyc2lvbiAke3ZlcnNpb259IGluICR7cmVnaW9ufWAsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gYXJuO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBuZWVkIHRvIGFkZCBhIG1hcHBpbmcgdG8gYmUgbG9va2VkIHVwIGF0IGRlcGxveW1lbnQgdGltZVxuICByZXR1cm4gc2NvcGVTdGFjay5yZWdpb25hbEZhY3QoRmFjdE5hbWUuYWRvdExhbWJkYUxheWVyKHR5cGUsIHZlcnNpb24sIGFyY2hpdGVjdHVyZSkpO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEFET1QgaW5zdHJ1bWVudGF0aW9uIGluIExhbWJkYVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkb3RJbnN0cnVtZW50YXRpb25Db25maWcge1xuICAvKipcbiAgICogVGhlIEFET1QgTGFtYmRhIGxheWVyLlxuICAgKi9cbiAgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uOiBBZG90TGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnR1cCBzY3JpcHQgdG8gcnVuLCBzZWUgQURPVCBkb2N1bWVudGF0aW9uIHRvIHBpY2sgdGhlIHJpZ2h0IHNjcmlwdCBmb3IgeW91ciB1c2UgY2FzZTogaHR0cHM6Ly9hd3Mtb3RlbC5naXRodWIuaW8vZG9jcy9nZXR0aW5nLXN0YXJ0ZWQvbGFtYmRhXG4gICAqL1xuICByZWFkb25seSBleGVjV3JhcHBlcjogQWRvdExhbWJkYUV4ZWNXcmFwcGVyO1xufVxuXG4vKipcbiAqIEFuIEFET1QgTGFtYmRhIGxheWVyIHZlcnNpb24gdGhhdCdzIHNwZWNpZmljIHRvIGEgbGFtYmRhIGxheWVyIHR5cGUgYW5kIGFuIGFyY2hpdGVjdHVyZS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFkb3RMYXllclZlcnNpb24ge1xuICAvKipcbiAgICogVGhlIEFET1QgTGFtYmRhIGxheWVyIGZvciBKYXZhIFNES1xuICAgKlxuICAgKiBAcGFyYW0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGUgTGFtYmRhIGxheWVyIHRvIHVzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSmF2YVNka0xheWVyVmVyc2lvbih2ZXJzaW9uOiBBZG90TGFtYmRhTGF5ZXJKYXZhU2RrVmVyc2lvbik6IEFkb3RMYXllclZlcnNpb24ge1xuICAgIHJldHVybiBBZG90TGF5ZXJWZXJzaW9uLmZyb21BZG90VmVyc2lvbih2ZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQURPVCBMYW1iZGEgbGF5ZXIgZm9yIEphdmEgYXV0byBpbnN0cnVtZW50YXRpb25cbiAgICpcbiAgICogQHBhcmFtIHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIExhbWJkYSBsYXllciB0byB1c2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUphdmFBdXRvSW5zdHJ1bWVudGF0aW9uTGF5ZXJWZXJzaW9uKFxuICAgIHZlcnNpb246IEFkb3RMYW1iZGFMYXllckphdmFBdXRvSW5zdHJ1bWVudGF0aW9uVmVyc2lvbixcbiAgKTogQWRvdExheWVyVmVyc2lvbiB7XG4gICAgcmV0dXJuIEFkb3RMYXllclZlcnNpb24uZnJvbUFkb3RWZXJzaW9uKHZlcnNpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBRE9UIExhbWJkYSBsYXllciBmb3IgSmF2YVNjcmlwdCBTREtcbiAgICpcbiAgICogQHBhcmFtIHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIExhbWJkYSBsYXllciB0byB1c2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUphdmFTY3JpcHRTZGtMYXllclZlcnNpb24odmVyc2lvbjogQWRvdExhbWJkYUxheWVySmF2YVNjcmlwdFNka1ZlcnNpb24pOiBBZG90TGF5ZXJWZXJzaW9uIHtcbiAgICByZXR1cm4gQWRvdExheWVyVmVyc2lvbi5mcm9tQWRvdFZlcnNpb24odmVyc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFET1QgTGFtYmRhIGxheWVyIGZvciBQeXRob24gU0RLXG4gICAqXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG9mIHRoZSBMYW1iZGEgbGF5ZXIgdG8gdXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21QeXRob25TZGtMYXllclZlcnNpb24odmVyc2lvbjogQWRvdExhbWJkYUxheWVyUHl0aG9uU2RrVmVyc2lvbik6IEFkb3RMYXllclZlcnNpb24ge1xuICAgIHJldHVybiBBZG90TGF5ZXJWZXJzaW9uLmZyb21BZG90VmVyc2lvbih2ZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQURPVCBMYW1iZGEgbGF5ZXIgZm9yIGdlbmVyaWMgdXNlIGNhc2VzXG4gICAqXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG9mIHRoZSBMYW1iZGEgbGF5ZXIgdG8gdXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21HZW5lcmljTGF5ZXJWZXJzaW9uKHZlcnNpb246IEFkb3RMYW1iZGFMYXllckdlbmVyaWNWZXJzaW9uKTogQWRvdExheWVyVmVyc2lvbiB7XG4gICAgcmV0dXJuIEFkb3RMYXllclZlcnNpb24uZnJvbUFkb3RWZXJzaW9uKHZlcnNpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZnJvbUFkb3RWZXJzaW9uKGFkb3RWZXJzaW9uOiBBZG90TGFtYmRhTGF5ZXJWZXJzaW9uKTogQWRvdExheWVyVmVyc2lvbiB7XG4gICAgcmV0dXJuIG5ldyAoY2xhc3MgZXh0ZW5kcyBBZG90TGF5ZXJWZXJzaW9uIHtcbiAgICAgIF9iaW5kKF9mdW5jdGlvbjogSUZ1bmN0aW9uKTogQWRvdExhbWJkYUxheWVyQmluZENvbmZpZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYXJuOiBhZG90VmVyc2lvbi5sYXllckFybihfZnVuY3Rpb24uc3RhY2ssIF9mdW5jdGlvbi5hcmNoaXRlY3R1cmUpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pKCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZSBhIGBBZG90TGFtYmRhTGF5ZXJCaW5kQ29uZmlnYCBpbnN0YW5jZSBmcm9tIHRoaXMgYEFkb3RMYXllclZlcnNpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZChfZnVuY3Rpb246IElGdW5jdGlvbik6IEFkb3RMYW1iZGFMYXllckJpbmRDb25maWc7XG59XG5cbi8qKlxuICogVGhlIHdyYXBwZXIgc2NyaXB0IHRvIGJlIHVzZWQgZm9yIHRoZSBMYW1iZGEgZnVuY3Rpb24gaW4gb3JkZXIgdG8gZW5hYmxlIGF1dG8gaW5zdHJ1bWVudGF0aW9uXG4gKiB3aXRoIEFET1QuXG4gKi9cbmV4cG9ydCBlbnVtIEFkb3RMYW1iZGFFeGVjV3JhcHBlciB7XG4gIC8qKlxuICAgKiBXcmFwcGluZyByZWd1bGFyIExhbWJkYSBoYW5kbGVycy5cbiAgICovXG4gIFJFR1VMQVJfSEFORExFUiA9ICcvb3B0L290ZWwtaGFuZGxlcicsXG5cbiAgLyoqXG4gICAqIFdyYXBwaW5nIHJlZ3VsYXIgaGFuZGxlcnMgKGltcGxlbWVudGluZyBSZXF1ZXN0SGFuZGxlcikgcHJveGllZCB0aHJvdWdoIEFQSSBHYXRld2F5LCBlbmFibGluZ1xuICAgKiBIVFRQIGNvbnRleHQgcHJvcGFnYXRpb24uXG4gICAqL1xuICBQUk9YWV9IQU5ETEVSID0gJy9vcHQvb3RlbC1wcm94eS1oYW5kbGVyJyxcblxuICAvKipcbiAgICogV3JhcHBpbmcgc3RyZWFtaW5nIGhhbmRsZXJzIChpbXBsZW1lbnRpbmcgUmVxdWVzdFN0cmVhbUhhbmRsZXIpLCBlbmFibGluZyBIVFRQIGNvbnRleHRcbiAgICogcHJvcGFnYXRpb24gZm9yIEhUVFAgcmVxdWVzdHMuXG4gICAqL1xuICBTVFJFQU1fSEFORExFUiA9ICcvb3B0L290ZWwtc3RyZWFtLWhhbmRsZXInLFxufVxuXG5hYnN0cmFjdCBjbGFzcyBBZG90TGFtYmRhTGF5ZXJWZXJzaW9uIHtcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSB0eXBlOiBBZG90TGFtYmRhTGF5ZXJUeXBlLCBwcm90ZWN0ZWQgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nKSB7fVxuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBMYW1iZGEgbGF5ZXJcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBiaW5kaW5nIHNjb3BlLiBVc3VhbGx5IHRoaXMgaXMgdGhlIHN0YWNrIHdoZXJlIHRoZSBMYW1iZGEgbGF5ZXIgaXMgYm91bmQgdG9cbiAgICogQHBhcmFtIGFyY2hpdGVjdHVyZSBUaGUgYXJjaGl0ZWN0dXJlIG9mIHRoZSBMYW1iZGEgbGF5ZXIgKGVpdGhlciBYODZfNjQgb3IgQVJNXzY0KVxuICAgKi9cbiAgcHVibGljIGxheWVyQXJuKHNjb3BlOiBJQ29uc3RydWN0LCBhcmNoaXRlY3R1cmU6IEFyY2hpdGVjdHVyZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExheWVyQXJuKHNjb3BlLCB0aGlzLnR5cGUsIHRoaXMudmVyc2lvbiwgYXJjaGl0ZWN0dXJlLm5hbWUpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGNvbGxlY3Rpb24gb2YgdmVyc2lvbnMgb2YgdGhlIEFET1QgTGFtYmRhIExheWVyIGZvciBKYXZhIFNES1xuICovXG5leHBvcnQgY2xhc3MgQWRvdExhbWJkYUxheWVySmF2YVNka1ZlcnNpb24gZXh0ZW5kcyBBZG90TGFtYmRhTGF5ZXJWZXJzaW9uIHtcbiAgLyoqXG4gICAqIFRoZSBsYXRlc3QgbGF5ZXIgdmVyc2lvbiBhdmFpbGFibGUgaW4gdGhpcyBDREsgdmVyc2lvbi4gTmV3IHZlcnNpb25zIGNvdWxkXG4gICAqIGludHJvZHVjZSBpbmNvbXBhdGlibGUgY2hhbmdlcy4gTWFrZSBzdXJlIHRvIHRlc3QgdGhlbSBiZWZvcmUgZGVwbG95aW5nIHRvIHByb2R1Y3Rpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExBVEVTVCA9IG5ldyBBZG90TGFtYmRhTGF5ZXJKYXZhU2RrVmVyc2lvbignMS4xOS4wJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4xOS4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzE5XzAgPSBuZXcgQWRvdExhbWJkYUxheWVySmF2YVNka1ZlcnNpb24oJzEuMTkuMCcpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGxheWVyVmVyc2lvbjogc3RyaW5nKSB7XG4gICAgc3VwZXIoQWRvdExhbWJkYUxheWVyVHlwZS5KQVZBX1NESywgbGF5ZXJWZXJzaW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBjb2xsZWN0aW9uIG9mIHZlcnNpb25zIG9mIHRoZSBBRE9UIExhbWJkYSBMYXllciBmb3IgSmF2YSBhdXRvLWluc3RydW1lbnRhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQWRvdExhbWJkYUxheWVySmF2YUF1dG9JbnN0cnVtZW50YXRpb25WZXJzaW9uIGV4dGVuZHMgQWRvdExhbWJkYUxheWVyVmVyc2lvbiB7XG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0IGxheWVyIHZlcnNpb24gYXZhaWxhYmxlIGluIHRoaXMgQ0RLIHZlcnNpb24uIE5ldyB2ZXJzaW9ucyBjb3VsZFxuICAgKiBpbnRyb2R1Y2UgaW5jb21wYXRpYmxlIGNoYW5nZXMuIE1ha2Ugc3VyZSB0byB0ZXN0IHRoZW0gYmVmb3JlIGRlcGxveWluZyB0byBwcm9kdWN0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBMQVRFU1QgPSBuZXcgQWRvdExhbWJkYUxheWVySmF2YUF1dG9JbnN0cnVtZW50YXRpb25WZXJzaW9uKCcxLjE5LjInKTtcblxuICAvKipcbiAgICogVmVyc2lvbiAxLjE5LjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMTlfMiA9IG5ldyBBZG90TGFtYmRhTGF5ZXJKYXZhQXV0b0luc3RydW1lbnRhdGlvblZlcnNpb24oJzEuMTkuMicpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGxheWVyVmVyc2lvbjogc3RyaW5nKSB7XG4gICAgc3VwZXIoQWRvdExhbWJkYUxheWVyVHlwZS5KQVZBX0FVVE9fSU5TVFJVTUVOVEFUSU9OLCBsYXllclZlcnNpb24pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGNvbGxlY3Rpb24gb2YgdmVyc2lvbnMgb2YgdGhlIEFET1QgTGFtYmRhIExheWVyIGZvciBQeXRob24gU0RLXG4gKi9cbmV4cG9ydCBjbGFzcyBBZG90TGFtYmRhTGF5ZXJQeXRob25TZGtWZXJzaW9uIGV4dGVuZHMgQWRvdExhbWJkYUxheWVyVmVyc2lvbiB7XG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0IGxheWVyIHZlcnNpb24gYXZhaWxhYmxlIGluIHRoaXMgQ0RLIHZlcnNpb24uIE5ldyB2ZXJzaW9ucyBjb3VsZFxuICAgKiBpbnRyb2R1Y2UgaW5jb21wYXRpYmxlIGNoYW5nZXMuIE1ha2Ugc3VyZSB0byB0ZXN0IHRoZW0gYmVmb3JlIGRlcGxveWluZyB0byBwcm9kdWN0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBMQVRFU1QgPSBuZXcgQWRvdExhbWJkYUxheWVyUHl0aG9uU2RrVmVyc2lvbignMS4xMy4wJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4xMy4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzEzXzAgPSBuZXcgQWRvdExhbWJkYUxheWVyUHl0aG9uU2RrVmVyc2lvbignMS4xMy4wJyk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBzdXBlcihBZG90TGFtYmRhTGF5ZXJUeXBlLlBZVEhPTl9TREssIGxheWVyVmVyc2lvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgY29sbGVjdGlvbiBvZiB2ZXJzaW9ucyBvZiB0aGUgQURPVCBMYW1iZGEgTGF5ZXIgZm9yIEphdmFTY3JpcHQgU0RLXG4gKi9cbmV4cG9ydCBjbGFzcyBBZG90TGFtYmRhTGF5ZXJKYXZhU2NyaXB0U2RrVmVyc2lvbiBleHRlbmRzIEFkb3RMYW1iZGFMYXllclZlcnNpb24ge1xuICAvKipcbiAgICogVGhlIGxhdGVzdCBsYXllciB2ZXJzaW9uIGF2YWlsYWJsZSBpbiB0aGlzIENESyB2ZXJzaW9uLiBOZXcgdmVyc2lvbnMgY291bGRcbiAgICogaW50cm9kdWNlIGluY29tcGF0aWJsZSBjaGFuZ2VzLiBNYWtlIHN1cmUgdG8gdGVzdCB0aGVtIGJlZm9yZSBkZXBsb3lpbmcgdG8gcHJvZHVjdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTEFURVNUID0gbmV3IEFkb3RMYW1iZGFMYXllckphdmFTY3JpcHRTZGtWZXJzaW9uKCcxLjcuMCcpO1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIDEuNy4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzdfMCA9IG5ldyBBZG90TGFtYmRhTGF5ZXJKYXZhU2NyaXB0U2RrVmVyc2lvbignMS43LjAnKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBsYXllclZlcnNpb246IHN0cmluZykge1xuICAgIHN1cGVyKEFkb3RMYW1iZGFMYXllclR5cGUuSkFWQVNDUklQVF9TREssIGxheWVyVmVyc2lvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgY29sbGVjdGlvbiBvZiB2ZXJzaW9ucyBvZiB0aGUgQURPVCBMYW1iZGEgTGF5ZXIgZm9yIGdlbmVyaWMgcHVycG9zZVxuICovXG5leHBvcnQgY2xhc3MgQWRvdExhbWJkYUxheWVyR2VuZXJpY1ZlcnNpb24gZXh0ZW5kcyBBZG90TGFtYmRhTGF5ZXJWZXJzaW9uIHtcbiAgLyoqXG4gICAqIFRoZSBsYXRlc3QgbGF5ZXIgdmVyc2lvbiBhdmFpbGFibGUgaW4gdGhpcyBDREsgdmVyc2lvbi4gTmV3IHZlcnNpb25zIGNvdWxkXG4gICAqIGludHJvZHVjZSBpbmNvbXBhdGlibGUgY2hhbmdlcy4gTWFrZSBzdXJlIHRvIHRlc3QgdGhlbSBiZWZvcmUgZGVwbG95aW5nIHRvIHByb2R1Y3Rpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExBVEVTVCA9IG5ldyBBZG90TGFtYmRhTGF5ZXJHZW5lcmljVmVyc2lvbignMC42Mi4xJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMC42Mi4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYwXzYyXzEgPSBuZXcgQWRvdExhbWJkYUxheWVyR2VuZXJpY1ZlcnNpb24oJzAuNjIuMScpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGxheWVyVmVyc2lvbjogc3RyaW5nKSB7XG4gICAgc3VwZXIoQWRvdExhbWJkYUxheWVyVHlwZS5HRU5FUklDLCBsYXllclZlcnNpb24pO1xuICB9XG59XG4iXX0=