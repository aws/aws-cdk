import { RegionInfo } from '@aws-cdk/region-info';
import { IConstruct } from 'constructs';
import { Stack } from '../../core/lib/stack';
import { Token } from '../../core/lib/token';
import { FactName } from '../../region-info/lib/fact';
import { Function } from './function';

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
 * Config returned from {@link AdotLambdaLayerVersion._bind}
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
  readonly layerConfig: AdotLambdaLayerConfig;

  /**
   * The startup script to run, see ADOT documentation to pick the right script for your use case: https://aws-otel.github.io/docs/getting-started/lambda
   */
  readonly execWrapper: AdotLambdaExecWrapper;
}

/**
 * The configuration interface of a ADOT Lambda layer
 */
export abstract class AdotLambdaLayerConfig {
  /**
   * Returns the arn of the ADOT Lambda layer based on the given configurations
   * @internal
   */
  abstract _bind(fn: Function): AdotLambdaLayerBindConfig;
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

/**
 * A version of the ADOT Lambda Layer
 */
abstract class AdotLambdaLayerVersion extends AdotLambdaLayerConfig {
  /**
   * @param version either "LATEST" or the version string of the layer version (such as "1.19.0")The version of the ADOT Lambda layer
   */
  protected constructor(private readonly type: AdotLambdaLayerType, private readonly version: string) {
    super();
  }

  /**
   * Returns the arn of the ADOT Lambda layer based on the given configurations (ADOT type,
   * version, and the Lambda function's architecture).
   * @internal
   */
  public _bind(fn: Function): AdotLambdaLayerBindConfig {
    return {
      arn: getLayerArn(fn.stack, this.type, this.version, fn.architecture.name),
    };
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

  private constructor(version: string) {
    super(AdotLambdaLayerType.JAVA_SDK, version);
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

  private constructor(version: string) {
    super(AdotLambdaLayerType.JAVA_AUTO_INSTRUMENTATION, version);
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

  private constructor(version: string) {
    super(AdotLambdaLayerType.PYTHON_SDK, version);
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

  private constructor(version: string) {
    super(AdotLambdaLayerType.JAVASCRIPT_SDK, version);
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

  private constructor(version: string) {
    super(AdotLambdaLayerType.GENERIC, version);
  }
}
