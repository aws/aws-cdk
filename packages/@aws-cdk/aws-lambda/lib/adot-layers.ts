import { RegionInfo } from '@aws-cdk/region-info';
import { IConstruct } from 'constructs';
import { Architecture } from './architecture';
import { IFunction } from './function-base';
import { Stack } from '../../core/lib/stack';
import { Token } from '../../core/lib/token';
import { FactName } from '../../region-info/lib/fact';

/**
 * The type of ADOT Lambda layer
 */
enum AdotLambdaLayerType {
  /**
   * The Lambda layer for ADOT Java instrumentation library. This layer only auto-instruments AWS
   * SDK libraries.
   */
  JAVA_SDK = 'JAVA_SDK',

  /**
   * The Lambda layer for ADOT Java Auto-Instrumentation Agent. This layer automatically instruments
   * a large number of libraries and frameworks out of the box and has notable impact on startup
   * performance.
   */
  JAVA_AUTO_INSTRUMENTATION = 'JAVA_AUTO_INSTRUMENTATION',

  /**
   * The Lambda layer for ADOT Collector, OpenTelemetry for JavaScript and supported libraries.
   */
  JAVASCRIPT_SDK = 'JAVASCRIPT_SDK',

  /**
   * The Lambda layer for ADOT Collector, OpenTelemetry for Python and supported libraries.
   */
  PYTHON_SDK = 'PYTHON_SDK',

  /**
   * The generic Lambda layer that contains only ADOT Collector, used for manual instrumentation
   * use cases (such as Go or DotNet runtimes).
   */
  GENERIC = 'GENERIC',
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
 * Return the ARN of an ADOT Lambda layer given its properties. If the region name is unknown
 * at synthesis time, it will generate a map in the CloudFormation template and perform the look
 * up at deployment time.
 *
 * @param scope the parent Construct that will use the imported layer.
 * @param type the type of the ADOT Lambda layer
 * @param version The version of the ADOT Lambda layer
 * @param architecture the architecture of the Lambda layer ('amd64' or 'arm64')
 */
function getLayerArn(scope: IConstruct, type: string, version: string, architecture: string): string {
  const scopeStack = Stack.of(scope);
  const region = scopeStack.region;

  // Region is defined, look up the arn, or throw an error if the version isn't supported by a region
  if (region !== undefined && !Token.isUnresolved(region)) {
    const arn = RegionInfo.get(region).adotLambdaLayerArn(type, version, architecture);
    if (arn === undefined) {
      throw new Error(
        `Could not find the ARN information for the ADOT Lambda Layer of type ${type} and version ${version} in ${region}`,
      );
    }
    return arn;
  }

  // Otherwise, need to add a mapping to be looked up at deployment time
  return scopeStack.regionalFact(FactName.adotLambdaLayer(type, version, architecture));
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
export abstract class AdotLayerVersion {
  /**
   * The ADOT Lambda layer for Java SDK
   *
   * @param version The version of the Lambda layer to use
   */
  public static fromJavaSdkLayerVersion(version: AdotLambdaLayerJavaSdkVersion): AdotLayerVersion {
    return AdotLayerVersion.fromAdotVersion(version);
  }

  /**
   * The ADOT Lambda layer for Java auto instrumentation
   *
   * @param version The version of the Lambda layer to use
   */
  public static fromJavaAutoInstrumentationLayerVersion(
    version: AdotLambdaLayerJavaAutoInstrumentationVersion,
  ): AdotLayerVersion {
    return AdotLayerVersion.fromAdotVersion(version);
  }

  /**
   * The ADOT Lambda layer for JavaScript SDK
   *
   * @param version The version of the Lambda layer to use
   */
  public static fromJavaScriptSdkLayerVersion(version: AdotLambdaLayerJavaScriptSdkVersion): AdotLayerVersion {
    return AdotLayerVersion.fromAdotVersion(version);
  }

  /**
   * The ADOT Lambda layer for Python SDK
   *
   * @param version The version of the Lambda layer to use
   */
  public static fromPythonSdkLayerVersion(version: AdotLambdaLayerPythonSdkVersion): AdotLayerVersion {
    return AdotLayerVersion.fromAdotVersion(version);
  }

  /**
   * The ADOT Lambda layer for generic use cases
   *
   * @param version The version of the Lambda layer to use
   */
  public static fromGenericLayerVersion(version: AdotLambdaLayerGenericVersion): AdotLayerVersion {
    return AdotLayerVersion.fromAdotVersion(version);
  }

  private static fromAdotVersion(adotVersion: AdotLambdaLayerVersion): AdotLayerVersion {
    return new (class extends AdotLayerVersion {
      _bind(_function: IFunction): AdotLambdaLayerBindConfig {
        return {
          arn: adotVersion.layerArn(_function.stack, _function.architecture),
        };
      }
    })();
  }

  /**
   * Produce a `AdotLambdaLayerBindConfig` instance from this `AdotLayerVersion` instance.
   *
   * @internal
   */
  public abstract _bind(_function: IFunction): AdotLambdaLayerBindConfig;
}

/**
 * The wrapper script to be used for the Lambda function in order to enable auto instrumentation
 * with ADOT.
 */
export enum AdotLambdaExecWrapper {
  /**
   * Wrapping regular Lambda handlers.
   */
  REGULAR_HANDLER = '/opt/otel-handler',

  /**
   * Wrapping regular handlers (implementing RequestHandler) proxied through API Gateway, enabling
   * HTTP context propagation.
   */
  PROXY_HANDLER = '/opt/otel-proxy-handler',

  /**
   * Wrapping streaming handlers (implementing RequestStreamHandler), enabling HTTP context
   * propagation for HTTP requests.
   */
  STREAM_HANDLER = '/opt/otel-stream-handler',
}

abstract class AdotLambdaLayerVersion {
  protected constructor(protected readonly type: AdotLambdaLayerType, protected readonly version: string) {}

  /**
   * The ARN of the Lambda layer
   *
   * @param scope The binding scope. Usually this is the stack where the Lambda layer is bound to
   * @param architecture The architecture of the Lambda layer (either X86_64 or ARM_64)
   */
  public layerArn(scope: IConstruct, architecture: Architecture): string {
    return getLayerArn(scope, this.type, this.version, architecture.name);
  }
}

/**
 * The collection of versions of the ADOT Lambda Layer for Java SDK
 */
export class AdotLambdaLayerJavaSdkVersion extends AdotLambdaLayerVersion {
  /**
   * The latest layer version available in this CDK version. New versions could
   * introduce incompatible changes. Make sure to test them before deploying to production.
   */
  public static readonly LATEST = new AdotLambdaLayerJavaSdkVersion('1.19.0');

  /**
   * Version 1.19.0
   */
  public static readonly V1_19_0 = new AdotLambdaLayerJavaSdkVersion('1.19.0');

  private constructor(protected readonly layerVersion: string) {
    super(AdotLambdaLayerType.JAVA_SDK, layerVersion);
  }
}

/**
 * The collection of versions of the ADOT Lambda Layer for Java auto-instrumentation
 */
export class AdotLambdaLayerJavaAutoInstrumentationVersion extends AdotLambdaLayerVersion {
  /**
   * The latest layer version available in this CDK version. New versions could
   * introduce incompatible changes. Make sure to test them before deploying to production.
   */
  public static readonly LATEST = new AdotLambdaLayerJavaAutoInstrumentationVersion('1.19.2');

  /**
   * Version 1.19.2
   */
  public static readonly V1_19_2 = new AdotLambdaLayerJavaAutoInstrumentationVersion('1.19.2');

  private constructor(protected readonly layerVersion: string) {
    super(AdotLambdaLayerType.JAVA_AUTO_INSTRUMENTATION, layerVersion);
  }
}

/**
 * The collection of versions of the ADOT Lambda Layer for Python SDK
 */
export class AdotLambdaLayerPythonSdkVersion extends AdotLambdaLayerVersion {
  /**
   * The latest layer version available in this CDK version. New versions could
   * introduce incompatible changes. Make sure to test them before deploying to production.
   */
  public static readonly LATEST = new AdotLambdaLayerPythonSdkVersion('1.13.0');

  /**
   * Version 1.13.0
   */
  public static readonly V1_13_0 = new AdotLambdaLayerPythonSdkVersion('1.13.0');

  private constructor(protected readonly layerVersion: string) {
    super(AdotLambdaLayerType.PYTHON_SDK, layerVersion);
  }
}

/**
 * The collection of versions of the ADOT Lambda Layer for JavaScript SDK
 */
export class AdotLambdaLayerJavaScriptSdkVersion extends AdotLambdaLayerVersion {
  /**
   * The latest layer version available in this CDK version. New versions could
   * introduce incompatible changes. Make sure to test them before deploying to production.
   */
  public static readonly LATEST = new AdotLambdaLayerJavaScriptSdkVersion('1.7.0');

  /**
   * Version 1.7.0
   */
  public static readonly V1_7_0 = new AdotLambdaLayerJavaScriptSdkVersion('1.7.0');

  private constructor(protected readonly layerVersion: string) {
    super(AdotLambdaLayerType.JAVASCRIPT_SDK, layerVersion);
  }
}

/**
 * The collection of versions of the ADOT Lambda Layer for generic purpose
 */
export class AdotLambdaLayerGenericVersion extends AdotLambdaLayerVersion {
  /**
   * The latest layer version available in this CDK version. New versions could
   * introduce incompatible changes. Make sure to test them before deploying to production.
   */
  public static readonly LATEST = new AdotLambdaLayerGenericVersion('0.62.1');

  /**
   * Version 0.62.1
   */
  public static readonly V0_62_1 = new AdotLambdaLayerGenericVersion('0.62.1');

  private constructor(protected readonly layerVersion: string) {
    super(AdotLambdaLayerType.GENERIC, layerVersion);
  }
}
