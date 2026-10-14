import type { Construct } from 'constructs';
import type { ApplicationLogLevel, SystemLogLevel } from './function';
import {
  CfnNetworkConnector,
  CfnWebFunction,
  CfnWebFunctionRevision,
  CfnWebFunctionEndpoint,
} from './lambda.generated';
import type { IWebFunctionEndpointRef, IWebFunctionRef, WebFunctionEndpointReference, WebFunctionReference } from './lambda.generated';
import { NetworkConnectorComputeType } from './network-connector';
import type { INetworkConnector } from './network-connector';
import type { WebFunctionCode } from './webfunction-code';
import { WebFunctionGrants } from './webfunction-grants';
import type {
  WebFunctionRuntime,
} from './webfunction-runtime';
import * as iam from '../../aws-iam';
import type * as kms from '../../aws-kms';
import { KeyGrants } from '../../aws-kms';
import type * as logs from '../../aws-logs';
import type { Duration, IResource } from '../../core';
import { Annotations, ArnFormat, Names, PhysicalName, Resource, Stack, Token } from '../../core';
import { UnscopedValidationError, ValidationError } from '../../core/lib/errors';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The endpoint type for a WebFunction endpoint.
 */
export enum WebFunctionEndpointType {
  /**
   * Single-region endpoint deployed in the stack's region only.
   * The function is accessible from a URL in this region.
   */
  HOME_REGION = 'HomeRegion',
  /**
   * Multi-region endpoint with managed latency-based routing.
   * The function is replicated to the specified replica regions
   * and users are routed to the nearest region.
   * Requires `replicaRegions` to be specified.
   */
  MULTI_REGION = 'MultiRegion',
  /**
   * Per-region endpoint: a separate regional endpoint is exposed for each
   * replica region (no managed cross-region routing).
   * Requires `replicaRegions` to be specified.
   */
  PER_REGION = 'PerRegion',
}
/**
 * Authentication type for WebFunction domain configuration
 */
export enum WebFunctionAuthType {
  /**
   * Authentication is managed by the application itself.
   * The Lambda service will not enforce authentication; ensure your handler code validates every request.
   */
  APPLICATION_MANAGED = 'ApplicationManaged',
  /** Authentication using AWS IAM */
  IAM_AUTH = 'IamAuth',
}

/**
 * Predefined region groups for use with WebFunctionReplicaRegions
 */
export class WebFunctionRegions {
  /** US regions */
  static readonly US: string[] = Object.freeze(['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2']) as string[];

  /** European regions */
  static readonly EU: string[] = Object.freeze([
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'eu-central-1',
    'eu-north-1',
  ]) as string[];

  /** Asia Pacific regions */
  static readonly AP: string[] = Object.freeze([
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-northeast-1',
    'ap-southeast-1',
    'ap-southeast-2',
  ]) as string[];

  /** Canada regions */
  static readonly CA: string[] = Object.freeze(['ca-central-1']) as string[];

  /** South America regions */
  static readonly SA: string[] = Object.freeze(['sa-east-1']) as string[];

  /** All default regions (17 regions enabled by default) */
  static readonly ALL_DEFAULT_REGIONS: string[] = Object.freeze([
    ...WebFunctionRegions.US,
    ...WebFunctionRegions.EU,
    ...WebFunctionRegions.AP,
    ...WebFunctionRegions.CA,
    ...WebFunctionRegions.SA,
  ]) as string[];

  /**
   * Sparse global coverage — 7 regions across North America, Europe, Asia Pacific and
   * South America. Use when you need worldwide presence with minimal region count.
   */
  static readonly SPARSE_GLOBAL: string[] = Object.freeze([
    'us-east-1',
    'eu-west-1',
    'ap-northeast-1',
    'eu-central-1',
    'ap-southeast-2',
    'sa-east-1',
    'ap-southeast-1',
  ]) as string[];

  /**
   * High-traffic regions only — US, Europe, and Asia Pacific (6 regions).
   * Use when most of your users are in these areas and you don't need
   * South America or Oceania coverage.
   */
  static readonly MAJOR_REGIONS: string[] = Object.freeze([
    'us-east-1',
    'us-west-2',
    'eu-west-1',
    'eu-central-1',
    'ap-northeast-1',
    'ap-southeast-1',
  ]) as string[];
}

/**
 * Represents a set of replica regions for a WebFunction.
 *
 * Build one with `WebFunctionReplicaRegions.of(included, excluded?)`, passing `WebFunctionRegions.*`
 * group constants (or explicit region arrays) for the regions to include and,
 * optionally, a set to exclude.
 *
 * @example
 * // Include all default regions except the EU group
 * lambda.WebFunctionReplicaRegions.of(lambda.WebFunctionRegions.ALL_DEFAULT_REGIONS, lambda.WebFunctionRegions.EU)
 *
 * @example
 * // Include explicit regions
 * lambda.WebFunctionReplicaRegions.of(['us-east-1', 'eu-west-1'])
 *
 * @example
 * // Combine multiple groups by spreading them
 * lambda.WebFunctionReplicaRegions.of([...lambda.WebFunctionRegions.US, ...lambda.WebFunctionRegions.EU])
 */
export class WebFunctionReplicaRegions {
  /**
   * Create a set of replica regions from an `included` list, with an optional
   * `excluded` list removed from it. Both accept `WebFunctionRegions.*` group constants or
   * explicit region arrays; spread multiple groups into a single array to
   * combine them (e.g. `[...WebFunctionRegions.US, ...WebFunctionRegions.EU]`).
   *
   * `included` may be a deploy-time list (for example `CfnParameter.valueAsList`),
   * in which case it is passed through unchanged. Exclusion is computed at synth
   * time and therefore requires concrete region strings in both lists.
   */
  public static of(included: string[], excluded?: string[]): WebFunctionReplicaRegions {
    return new WebFunctionReplicaRegions(included, excluded ?? []);
  }

  private constructor(
    private readonly included: string[],
    private readonly excluded: string[],
  ) {}

  /**
   * Resolves the final, de-duplicated list of replica regions (included minus excluded).
   */
  public resolve(): string[] {
    if (this.excluded.length === 0) {
      return Token.isUnresolved(this.included) ? this.included : [...new Set(this.included)];
    }
    if (hasTokens(this.included) || hasTokens(this.excluded)) {
      throw new UnscopedValidationError(
        lit`WebFunctionReplicaRegionsUnresolvedExclusion`,
        'Excluding replica regions requires concrete region strings in both lists; a deploy-time value cannot be filtered at synth time',
      );
    }
    const excludedSet = new Set(this.excluded);
    return [...new Set(this.included)].filter((r) => !excludedSet.has(r));
  }
}

/**
 * The compute types an owned connector was created for, read from its L1.
 *
 * `undefined` when they cannot be known at synthesis: an imported connector, or a
 * configuration that is (or contains) a token.
 */
function connectorComputeTypes(connector: INetworkConnector): string[] | undefined {
  const cfn = connector.node.defaultChild;
  if (!CfnNetworkConnector.isCfnNetworkConnector(cfn)) {
    return undefined;
  }
  const config = cfn.configuration;
  if (!Token.isResolved(config)) {
    return undefined;
  }
  const vpcEgress = config.vpcEgressConfiguration;
  if (!Token.isResolved(vpcEgress)) {
    return undefined;
  }
  const types = vpcEgress.associatedComputeResourceTypes;
  return hasTokens(types) ? undefined : types;
}

/** A list token has `length === 1`, so both the list and its elements must be checked. */
function hasTokens(list: string[]): boolean {
  return Token.isUnresolved(list) || list.some((r) => Token.isUnresolved(r));
}

/**
 * The top-level stack a stack is nested in, or the stack itself.
 *
 * CDK passes references within one top-level stack through nested-stack parameters and
 * outputs, and creates an Export only between different top-level stacks.
 */
function topLevelStack(stack: Stack): Stack {
  let current = stack;
  while (current.nestedStackParent !== undefined) {
    current = current.nestedStackParent;
  }
  return current;
}

/**
 * The names the service accepts for a WebFunction and for its endpoint.
 *
 * Both are validated with the same rule: 2–64 characters of letters, numbers, hyphens and
 * underscores, starting and ending with a letter or number.
 */
const RESOURCE_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}[a-zA-Z0-9]$/;

function validateResourceName(name: string, label: string, scope: Construct): void {
  if (!RESOURCE_NAME_REGEX.test(name)) {
    throw new ValidationError(lit`WebFunctionNameInvalid`,
      `${label} '${name}' must be 2 to 64 characters of letters, numbers, hyphens or underscores, ` +
      'starting and ending with a letter or number.', scope);
  }
}

/**
 * Properties for defining a `WebFunction`.
 */
export interface WebFunctionProps {
  /**
   * The name of the WebFunction.
   *
   * Must be 2 to 64 characters of letters, numbers, hyphens or underscores, starting and
   * ending with a letter or number.
   *
   * @default - A unique name is generated by CDK.
   */
  readonly webFunctionName?: string;

  /**
   * A description of the WebFunction revision.
   *
   * Must be 256 characters or fewer.
   *
   * @default - No description.
   */
  readonly revisionDescription?: string;

  /**
   * The deployment package for the WebFunction.
   */
  readonly code: WebFunctionCode;

  /**
   * The runtime environment for the WebFunction.
   */
  readonly runtime: WebFunctionRuntime;

  /**
   * The entry file the runtime executes, relative to the root of the deployment
   * package.
   *
   * Only supported for Node.js runtimes. When set, it is passed to the runtime via the reserved
   * `AWS_LAMBDA_NODEJS_ENTRYPOINT` environment variable. Do not set that
   * variable through `environment` as well.
   *
   * @default 'index.js'
   */
  readonly entryPoint?: string;

  /**
   * The IAM execution role for the WebFunction.
   *
   * @default - A new role with `AWSLambdaBasicExecutionRole` is created.
   */
  readonly role?: iam.IRoleRef & iam.IGrantable;

  /**
   * The network connector that gives the function egress into a VPC.
   *
   * The revision pins to the connector's latest version at the time it is created. For a
   * connector defined in the same stack, every update to the connector therefore replaces the
   * revision as part of that deployment, and traffic moves to the new version with it. To hold
   * the function on a fixed version instead — or to use a connector from another stack, whose
   * changing version cannot be exported — import the version with
   * `NetworkConnector.fromNetworkConnectorVersionArn()`.
   *
   * The connector must have been created for `NetworkConnectorComputeType.WEB_FUNCTION`.
   *
   * The full `INetworkConnector` is required (rather than a ref) because the revision pins to
   * `latestVersionArn`, which `INetworkConnectorRef` does not carry.
   *
   * [disable-awslint:prefer-ref-interface]
   *
   * @default - no VPC egress
   */
  readonly egressNetworkConnector?: INetworkConnector;

  /**
   * Key-value pairs of environment variables to pass to the WebFunction.
   *
   * @default - No environment variables.
   */
  readonly environment?: Record<string, string>;

  /**
   * The KMS key used to encrypt environment variables.
   *
   * The Lambda service principal is granted the key usage it needs to encrypt
   * and decrypt the revision's environment variables.
   *
   * @default - AWS managed key.
   */
  readonly kmsKey?: kms.IKeyRef;

  /**
   * The minimum log level for application logs (logs emitted by your code, e.g.
   * `console.log()`, `console.warn()`). Only logs at this level or above will
   * be captured in CloudWatch.
   *
   * For example, setting this to `INFO` will capture `console.info()` and
   * `console.warn()` but filter out `console.debug()`.
   *
   * @default - No application log level filtering.
   */
  readonly applicationLogLevel?: ApplicationLogLevel;

  /**
   * The minimum log level for system logs (logs emitted by the Lambda runtime,
   * e.g. start/end/report lines and runtime errors). Only logs at this level
   * or above will be captured in CloudWatch.
   *
   * @default - No system log level filtering.
   */
  readonly systemLogLevel?: SystemLogLevel;

  /**
   * The CloudWatch log group to send logs to.
   *
   * @default - the Lambda service's default log group
   */
  readonly logGroup?: logs.ILogGroupRef;

  /**
   * The function execution time (in seconds) after which the WebFunction is terminated.
   *
   * Must be an integer between 3 and 900 seconds.
   *
   * @default Duration.seconds(30)
   */
  readonly timeout?: Duration;

  /**
   * The maximum number of concurrent requests handled by a single execution environment.
   *
   * Must be an integer between 1 and 128. When omitted, nothing is sent and the service
   * applies its default.
   *
   * @default - the service default of 64 is applied
   */
  readonly maxConcurrencyPerEnvironment?: number;

  /**
   * The name of the WebFunction endpoint.
   *
   * Must be 2 to 64 characters of letters, numbers, hyphens or underscores, starting and
   * ending with a letter or number.
   *
   * Changing this property replaces the endpoint, which yields a new `domainName`.
   * Because `endpointType` and `replicaRegions` also replace the endpoint, this
   * name must be changed together with them; CloudFormation cannot replace a
   * resource that keeps the same name, so the deployment fails otherwise.
   *
   * @default 'prod'
   */
  readonly endpointName?: string;

  /**
   * The endpoint type for the WebFunction.
   *
   * This property and `replicaRegions` are intentionally modeled as flat,
   * independent props (rather than a factory or nested object) for consistency
   * with the rest of the WebFunction API. Their mutual constraint is validated
   * at synth time: the regional types (`WebFunctionEndpointType.MULTI_REGION` and
   * `WebFunctionEndpointType.PER_REGION`) require `replicaRegions` to resolve to a non-empty
   * set, and `WebFunctionEndpointType.HOME_REGION` (the default) must not be combined with
   * `replicaRegions`.
   *
   * Changing this property replaces the endpoint, which yields a new `domainName`,
   * and requires changing `endpointName` at the same time.
   *
   * @default WebFunctionEndpointType.HOME_REGION
   */
  readonly endpointType?: WebFunctionEndpointType;

  /**
   * The authentication type for the WebFunction endpoint.
   *
   * There is no default: you must choose explicitly so an endpoint is never accidentally public or
   * accidentally locked down. Specify `WebFunctionAuthType.IAM_AUTH` (Lambda authorizes requests with SigV4/IAM)
   * or `WebFunctionAuthType.APPLICATION_MANAGED` (the endpoint is public and your function handles authorization).
   */
  readonly authType: WebFunctionAuthType;

  /**
   * The replica regions for a regional WebFunction deployment.
   *
   * Only valid with the regional endpoint types (`WebFunctionEndpointType.MULTI_REGION` and
   * `WebFunctionEndpointType.PER_REGION`), where it is required and must resolve to a
   * non-empty set of regions. Must be omitted for `WebFunctionEndpointType.HOME_REGION`.
   * This constraint is validated at synth time (see `endpointType`).
   *
   * Changing the set of regions replaces the endpoint, which yields a new
   * `domainName`, and requires changing `endpointName` at the same time.
   *
   * The stack's own region always serves traffic, whether or not it is listed here.
   *
   * @default - No replica regions (home region only).
   */
  readonly replicaRegions?: WebFunctionReplicaRegions;

  /**
   * A description of the endpoint.
   *
   * Up to 256 characters.
   *
   * @default - No description.
   */
  readonly endpointDescription?: string;

  /**
   * The maximum number of concurrent execution environments for the endpoint.
   *
   * This is an optional cap on top of your account's vCPU quota, not a reservation:
   * it further constrains how far the endpoint scales. Must be 2 or greater.
   *
   * @default - Scaling is limited only by your account's vCPU quota.
   */
  readonly maxEnvironments?: number;

  /**
   * The maximum request rate per second for the endpoint, up to 10000.
   *
   * This is an optional cap on top of your account's rate limit quota. Specify 0 to
   * reject all new requests.
   *
   * The service accepts only certain values: 0, 100 through 1000 in increments of 100,
   * and 2000 through 10000 in increments of 1000. Which of those are available varies by
   * Region, and an unsupported value is rejected at deploy time with the values that
   * Region does accept. Only the lower bound is checked at synth, since the schema
   * declares nothing more.
   *
   * @default - The request rate is limited only by your account's rate limit quota.
   */
  readonly rateLimit?: number;
}

/**
 * Represents a WebFunction resource, either created in this stack or imported.
 */
export interface IWebFunction extends IResource, IWebFunctionRef, IWebFunctionEndpointRef, iam.IGrantable {
  /**
   * The ARN of the WebFunction.
   *
   * @attribute
   */
  readonly webFunctionArn: string;

  /**
   * The ARN of the WebFunction endpoint.
   *
   * For an imported WebFunction this is only available if `endpointName` was passed to
   * `WebFunction.fromWebFunctionAttributes()`; otherwise reading it throws.
   *
   * @attribute
   */
  readonly endpointArn: string;

  /**
   * The execution role of the WebFunction.
   *
   * Undefined for an imported WebFunction.
   */
  readonly role?: iam.IRoleRef;

  /**
   * Grant methods for the WebFunction's endpoint.
   */
  readonly grants: WebFunctionGrants;

  /**
   * Adds a statement to the WebFunction's execution role.
   *
   * For an imported WebFunction the role is unknown, so this adds a warning asking for the
   * permission to be granted manually instead.
   */
  addToRolePolicy(statement: iam.PolicyStatement): void;
}

/**
 * Attributes for importing an existing WebFunction.
 */
export interface WebFunctionAttributes {
  /** The ARN of the WebFunction. */
  readonly webFunctionArn: string;

  /**
   * The name of the WebFunction's endpoint.
   *
   * Required to reference the endpoint, for example to call `grants.invoke()`.
   *
   * @default - the endpoint cannot be referenced
   */
  readonly endpointName?: string;
}

/**
 * Base class for WebFunction, shared between real and imported instances.
 */
export abstract class WebFunctionBase extends Resource implements IWebFunction {
  /** The ARN of the WebFunction. */
  public abstract readonly webFunctionArn: string;

  /** The ARN of the WebFunction endpoint. */
  public abstract readonly endpointArn: string;

  /** The execution role of the WebFunction. Undefined for an imported WebFunction. */
  public abstract readonly role?: iam.IRoleRef;

  /** The principal to grant permissions to. */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /** Grant methods for the WebFunction's endpoint. */
  public readonly grants: WebFunctionGrants = WebFunctionGrants.fromWebFunctionEndpoint(this);

  /**
   * Adds a statement to the WebFunction's execution role.
   *
   * For an imported WebFunction the role is unknown, so this adds a warning asking for the
   * permission to be granted manually instead.
   */
  public addToRolePolicy(statement: iam.PolicyStatement): void {
    this.grantPrincipal.addToPrincipalPolicy(statement);
  }

  public get webFunctionRef(): WebFunctionReference {
    return { functionArn: this.webFunctionArn };
  }

  public get webFunctionEndpointRef(): WebFunctionEndpointReference {
    return { endpointArn: this.endpointArn };
  }
}

/**
 * A Lambda WebFunction L2 construct.
 *
 * Creates a WebFunction with a revision and endpoint for serving HTTP traffic.
 */
@propertyInjectable
export class WebFunction extends WebFunctionBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-lambda.WebFunction';

  /**
   * Import an existing WebFunction by its ARN.
   */
  public static fromWebFunctionArn(scope: Construct, id: string, webFunctionArn: string): IWebFunction {
    return WebFunction.fromWebFunctionAttributes(scope, id, { webFunctionArn });
  }

  /**
   * Import an existing WebFunction by its attributes.
   */
  public static fromWebFunctionAttributes(scope: Construct, id: string, attrs: WebFunctionAttributes): IWebFunction {
    const arn = attrs.webFunctionArn;
    const endpointName = attrs.endpointName;

    class Import extends WebFunctionBase {
      public readonly webFunctionArn = arn;
      public get endpointArn(): string {
        if (endpointName === undefined) {
          throw new ValidationError(lit`WebFunctionImportedWithoutEndpoint`,
            'This WebFunction was imported without an endpoint name. Pass `endpointName` to ' +
            '`WebFunction.fromWebFunctionAttributes()` to reference its endpoint.', this);
        }
        return `${arn}/endpoint/${endpointName}`;
      }
      public readonly role = undefined;
      public readonly grantPrincipal: iam.IPrincipal = new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id, {
      environmentFromArn: arn,
    });
  }

  /**
   * The ARN of the WebFunction.
   *
   * @attribute
   */
  @memoizedGetter
  public get webFunctionArn(): string {
    return this.getResourceArnAttribute(this.resource.attrFunctionArn, {
      service: 'lambda',
      resource: 'web-function',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * The name of the WebFunction.
   *
   * @attribute
   */
  public readonly webFunctionName: string;

  /**
   * The execution role of the WebFunction: the one passed in `role`, or the one created
   * for it.
   */
  public readonly role?: iam.IRoleRef;

  /** The principal to grant permissions to: the execution role. */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The domain name of the WebFunction endpoint — the host clients send
   * requests to.
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * The ARN of the WebFunction endpoint.
   *
   * @attribute
   */
  public readonly endpointArn: string;

  /**
   * The ARN of the WebFunction revision created by this construct.
   *
   * @attribute
   */
  public readonly revisionArn: string;

  /**
   * The ID of the WebFunction revision created by this construct.
   *
   * @attribute
   */
  public readonly revisionId: string;

  /** The underlying L1 CfnWebFunction resource. Use for escape hatches. */
  public readonly resource: CfnWebFunction;
  /** The underlying L1 CfnWebFunctionRevision resource. Use for escape hatches. */
  public readonly resourceRevision: CfnWebFunctionRevision;
  /** The underlying L1 CfnWebFunctionEndpoint resource. Use for escape hatches. */
  public readonly resourceEndpoint: CfnWebFunctionEndpoint;

  constructor(scope: Construct, id: string, props: WebFunctionProps) {
    super(scope, id, {
      physicalName: props.webFunctionName ?? PhysicalName.GENERATE_IF_NEEDED,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // WebFunction's FunctionName is required in CFN. If the user didn't provide
    // a name, generate one deterministically using the framework's standard mechanism.
    const functionName = props.webFunctionName !== undefined
      ? this.physicalName
      : this.generatePhysicalName();

    if (props.webFunctionName !== undefined && !Token.isUnresolved(props.webFunctionName)) {
      validateResourceName(props.webFunctionName, 'Function name', this);
    }
    if (props.endpointName !== undefined && !Token.isUnresolved(props.endpointName)) {
      validateResourceName(props.endpointName, 'Endpoint name', this);
    }

    if (
      props.revisionDescription &&
      !Token.isUnresolved(props.revisionDescription)
    ) {
      if (props.revisionDescription.length > 256) {
        throw new ValidationError(
          lit`WebFunctionDescriptionTooLong`,
          `Function description cannot be longer than 256 characters. Function description currently has ${props.revisionDescription.length} characters.`,
          this,
        );
      }
    }

    if (
      props.endpointDescription &&
      !Token.isUnresolved(props.endpointDescription) &&
      props.endpointDescription.length > 256
    ) {
      throw new ValidationError(
        lit`WebFunctionEndpointDescriptionTooLong`,
        `Endpoint description cannot be longer than 256 characters. Endpoint description currently has ${props.endpointDescription.length} characters.`,
        this,
      );
    }

    if (props.timeout !== undefined) {
      const timeoutSeconds = props.timeout.toSeconds({ integral: false });
      if (
        !Token.isUnresolved(timeoutSeconds) &&
        (timeoutSeconds < 3 || timeoutSeconds > 900 || !Number.isInteger(timeoutSeconds))
      ) {
        throw new ValidationError(
          lit`WebFunctionTimeoutOutOfRange`,
          `Timeout must be an integer between 3 and 900 seconds, got ${timeoutSeconds}`,
          this,
        );
      }
    }

    const maxConcurrency = props.maxConcurrencyPerEnvironment;
    if (
      maxConcurrency !== undefined &&
      !Token.isUnresolved(maxConcurrency) &&
      (maxConcurrency < 1 || maxConcurrency > 128 || !Number.isInteger(maxConcurrency))
    ) {
      throw new ValidationError(
        lit`WebFunctionMaxConcurrencyPerEnvironmentOutOfRange`,
        `maxConcurrencyPerEnvironment must be an integer between 1 and 128, got ${maxConcurrency}`,
        this,
      );
    }

    // Validate endpoint type and replica regions
    // `endpointType` and `replicaRegions` are intentionally kept as flat,
    // independent props (a documented deviation from DESIGN_GUIDELINES "flat"
    // guidance) for API consistency. Their mutual constraint is enforced here
    // at synth time rather than made unrepresentable via a factory/subtype.
    const endpointType = props.endpointType ?? WebFunctionEndpointType.HOME_REGION;
    // MULTI_REGION and PER_REGION are both regional endpoint types: they serve the
    // replica regions and require `replicaRegions`. HOME_REGION must not set it.
    const isRegional = endpointType === WebFunctionEndpointType.MULTI_REGION || endpointType === WebFunctionEndpointType.PER_REGION;
    if (endpointType === WebFunctionEndpointType.HOME_REGION && props.replicaRegions) {
      throw new ValidationError(
        lit`WebFunctionHomeRegionWithReplicaRegions`,
        'replicaRegions cannot be specified when endpointType is HOME_REGION. Use MULTI_REGION or PER_REGION for multi-region deployments',
        this,
      );
    }
    if (isRegional && !props.replicaRegions) {
      throw new ValidationError(
        lit`WebFunctionRegionalEndpointWithoutReplicaRegions`,
        `replicaRegions must be specified when endpointType is ${endpointType}`,
        this,
      );
    }

    // The schema declares a lower bound for both of these but no upper bound, so only the
    // lower bound is enforced here. An over-large value is left to the service to reject.
    const maxEnvironments = props.maxEnvironments;
    if (
      maxEnvironments !== undefined &&
      !Token.isUnresolved(maxEnvironments) &&
      (maxEnvironments < 2 || !Number.isInteger(maxEnvironments))
    ) {
      throw new ValidationError(
        lit`WebFunctionMaxEnvironmentsOutOfRange`,
        `maxEnvironments must be an integer of 2 or greater, got ${maxEnvironments}`,
        this,
      );
    }

    const rateLimit = props.rateLimit;
    if (
      rateLimit !== undefined &&
      !Token.isUnresolved(rateLimit) &&
      (rateLimit < 0 || !Number.isInteger(rateLimit))
    ) {
      throw new ValidationError(
        lit`WebFunctionRateLimitOutOfRange`,
        `rateLimit must be an integer of 0 or greater, got ${rateLimit}`,
        this,
      );
    }

    // Set up the execution role
    const role = props.role ?? this.createDefaultRole();
    this.role = role;
    this.grantPrincipal = role.grantPrincipal;

    // Bind the code to get S3 location. The ARN is built from the name because
    // the L1 does not exist yet; it lets the code scope its read policy to this function.
    const codeConfig = props.code.bind(this, {
      webFunctionArn: Stack.of(this).formatArn({
        service: 'lambda',
        resource: 'web-function',
        resourceName: functionName,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      }),
    });

    // Prepare environment variables
    const environment = { ...props.environment };

    // `entryPoint` is surfaced to the runtime through the reserved
    // AWS_LAMBDA_NODEJS_ENTRYPOINT env var. Reject setting it both ways.
    if (props.entryPoint !== undefined) {
      const runtimeName = props.runtime.name;
      if (!Token.isUnresolved(runtimeName) && !runtimeName.startsWith('nodejs')) {
        throw new ValidationError(
          lit`WebFunctionEntryPointRequiresNode`,
          `entryPoint is only supported for Node.js runtimes, got '${runtimeName}'`,
          this,
        );
      }
      if (environment.AWS_LAMBDA_NODEJS_ENTRYPOINT !== undefined) {
        throw new ValidationError(
          lit`WebFunctionEntryPointConflict`,
          'entryPoint cannot be used together with an AWS_LAMBDA_NODEJS_ENTRYPOINT environment variable; set only one',
          this,
        );
      }
      environment.AWS_LAMBDA_NODEJS_ENTRYPOINT = props.entryPoint;
    }

    // Resolve regions configuration
    const regions = this.resolveRegions(props.replicaRegions);

    if (isRegional && regions !== undefined && !Token.isUnresolved(regions) && regions.length === 0) {
      throw new ValidationError(
        lit`WebFunctionRegionalEndpointEmptyRegions`,
        `replicaRegions resolved to an empty list. A ${endpointType} endpoint requires at least one region`,
        this,
      );
    }

    // Create the CloudFormation resource
    this.resource = new CfnWebFunction(this, 'Function', {
      functionName: functionName,
    });

    this.resourceRevision = new CfnWebFunctionRevision(this, 'Revision', {
      functionName: this.resource.ref,
      description: props.revisionDescription,
      buildConfig: {
        codeConfig: {
          s3Object: {
            bucket: codeConfig.s3Location.bucketName,
            key: codeConfig.s3Location.objectKey,
            versionId: codeConfig.s3Location.objectVersion,
          },
        },
        runtimeConfig: {
          runtime: props.runtime.name,
        },
      },
      serviceConfig: {
        executionRoleArn: role.roleRef.roleArn,
        environmentVariables:
          Object.keys(environment).length > 0 ? environment : undefined,
        telemetryConfig: this.createTelemetryConfig(props),
        timeoutSeconds: props.timeout?.toSeconds() ?? 30,
        maxConcurrencyPerEnvironment: props.maxConcurrencyPerEnvironment,
        egressNetworkConnectorArn: this.resolveEgressNetworkConnectorArn(props.egressNetworkConnector),
      },
      kmsKeyArn: props.kmsKey !== undefined ? this.resolveKmsKeyArn(props.kmsKey) : undefined,
    });

    if (props.kmsKey !== undefined) {
      this.grantServiceKeyUsage(props.kmsKey);
    }

    if (props.authType === WebFunctionAuthType.APPLICATION_MANAGED) {
      Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-lambda:webFunctionPublicEndpoint',
        'WebFunction endpoint uses APPLICATION_MANAGED auth. The Lambda service will not enforce authentication; ensure your handler code validates every request.',
      );
    }

    this.resourceEndpoint = new CfnWebFunctionEndpoint(this, 'Endpoint', {
      functionName: this.resource.ref,
      endpointName: props.endpointName ?? 'prod',
      endpointType: props.endpointType ?? WebFunctionEndpointType.HOME_REGION,
      authType: props.authType,
      revisionWeights: [
        {
          revisionId: this.resourceRevision.getAtt('RevisionId').toString(),
          weight: 100,
        },
      ],
      regions: regions, // note: regional (MULTI_REGION / PER_REGION) property only
      description: props.endpointDescription,
      // Only emit the wrapper objects when their single member is set, so that an
      // unconfigured endpoint keeps the service defaults instead of sending empty structs.
      scalingConfig: props.maxEnvironments !== undefined
        ? { maxEnvironments: props.maxEnvironments }
        : undefined,
      throttleConfig: props.rateLimit !== undefined
        ? { rateLimit: props.rateLimit }
        : undefined,
    });

    this.resourceRevision.addResourceDependency(this.resource);
    this.resourceEndpoint.addResourceDependency(this.resource);
    this.resourceEndpoint.addResourceDependency(this.resourceRevision);

    // Bind the code to the resource
    props.code.bindToResource(this.resourceRevision);

    this.webFunctionName = functionName;
    this.domainName = this.resourceEndpoint.attrDomainName;
    this.endpointArn = this.resourceEndpoint.attrEndpointArn;
    this.revisionArn = this.resourceRevision.attrRevisionArn;
    this.revisionId = this.resourceRevision.attrRevisionId;
  }

  /**
   * Override to use Names.uniqueResourceName which doesn't require resolved
   * region/account — necessary because FunctionName is CFN-required and must
   * be generated even for env-agnostic stacks.
   */
  protected generatePhysicalName(): string {
    return Names.uniqueResourceName(this, { maxLength: 40 });
  }

  /**
   * Create a default execution role for the WebFunction
   */
  private createDefaultRole(): iam.IRole {
    return new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });
  }

  /**
   * Create telemetry configuration from props
   */
  private createTelemetryConfig(
    props: WebFunctionProps,
  ): CfnWebFunctionRevision.TelemetryConfigProperty | undefined {
    if (
      !props.applicationLogLevel &&
      !props.systemLogLevel &&
      !props.logGroup
    ) {
      return undefined;
    }

    return {
      loggingConfig: {
        applicationLogLevel: props.applicationLogLevel,
        systemLogLevel: props.systemLogLevel,
        logGroup: props.logGroup?.logGroupRef.logGroupName,
      },
    };
  }

  /**
   * Resolve regions configuration to a string array by applying includes and excludes.
   */
  private resolveRegions(
    replicaRegions?: WebFunctionReplicaRegions,
  ): string[] | undefined {
    if (!replicaRegions) {
      return undefined;
    }
    return replicaRegions.resolve();
  }

  /**
   * The version ARN the revision pins to, or undefined without a connector.
   *
   * A connector defined in another stack is refused. Its latest version ARN would cross the
   * stack boundary as an Export, and CloudFormation does not let an Export change value while
   * another stack imports it — so the first update to the connector would fail to deploy. A
   * nested stack and its parents pass values through parameters and outputs rather than
   * Exports, so connectors within one top-level stack are fine. A connector imported by
   * version ARN carries no Export and is fine from anywhere.
   */
  private resolveEgressNetworkConnectorArn(connector?: INetworkConnector): string | undefined {
    if (connector === undefined) {
      return undefined;
    }
    if (Resource.isOwnedResource(connector) && topLevelStack(Stack.of(connector)) !== topLevelStack(Stack.of(this))) {
      throw new ValidationError(lit`WebFunctionNetworkConnectorInOtherStack`,
        `The network connector '${connector.node.path}' is defined in stack '${Stack.of(connector).node.path}', ` +
        `but this WebFunction is in '${Stack.of(this).node.path}'. Its latest version ARN changes on every update ` +
        'and cannot be exported across stacks. Define the connector in this stack, or import a fixed version ' +
        'from a literal ARN string with NetworkConnector.fromNetworkConnectorVersionArn().', this);
    }
    // A connector serves one compute type. For one defined in this app the type is in its L1,
    // so a mismatch fails here instead of at deployment; an import carries no configuration
    // and is left to the service.
    const computeTypes = connectorComputeTypes(connector);
    if (computeTypes !== undefined && !computeTypes.includes(NetworkConnectorComputeType.WEB_FUNCTION)) {
      throw new ValidationError(lit`WebFunctionNetworkConnectorComputeType`,
        `The network connector '${connector.node.path}' was created for ${computeTypes.join(', ')}, but a ` +
        'WebFunction needs one created for NetworkConnectorComputeType.WEB_FUNCTION.', this);
    }
    return connector.latestVersionArn;
  }

  /**
   * The ARN of the key passed as `kmsKey`.
   *
   * A KMS alias also implements `IKeyRef`, but its `keyRef.keyArn` is the alias ARN, which
   * `KmsKeyArn` does not accept. It is refused rather than resolved to its target key: an
   * imported alias has no known target, and the revision pins one key while an alias can be
   * repointed.
   */
  private resolveKmsKeyArn(key: kms.IKeyRef): string {
    if ('aliasName' in key) {
      throw new ValidationError(lit`WebFunctionKmsKeyIsAlias`,
        `kmsKey must be a KMS key, not an alias ('${key.node.path}'). Pass the key itself.`, this);
    }
    const keyArn = key.keyRef.keyArn;
    if (!Token.isUnresolved(keyArn) && !keyArn.includes(':key/')) {
      throw new ValidationError(lit`WebFunctionKmsKeyArnInvalid`,
        `kmsKey must be a KMS key ARN containing ':key/', got '${keyArn}'.`, this);
    }
    return keyArn;
  }

  /**
   * Let the Lambda service use the customer-managed key for this revision's
   * environment variables. These are the only KMS operations the service
   * performs on the key when creating a revision.
   *
   * Scoped with `aws:SourceAccount` so another account cannot induce the service to use
   * this key on its behalf, and with `aws:SourceArn` so the service may only use it on
   * behalf of a WebFunction revision — not any other Lambda-service action in the account.
   * The ARN is an account-wide wildcard over every WebFunction's revisions rather than this
   * function's concrete ARN on purpose: a concrete per-function condition would make every
   * function's statement distinct, so a key shared by many functions would accumulate one
   * statement each and grow the key policy toward its size limit. The wildcard keeps the
   * condition identical across functions, so the grants still collapse to a single statement.
   */
  private grantServiceKeyUsage(key: kms.IKeyRef): void {
    KeyGrants.fromKey(key).actions(
      new iam.ServicePrincipal('lambda.amazonaws.com', {
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(this).account,
          },
          ArnLike: {
            'aws:SourceArn': Stack.of(this).formatArn({
              service: 'lambda',
              resource: 'web-function',
              resourceName: '*/revision/*',
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            }),
          },
        },
      }),
      'kms:Decrypt',
      'kms:GenerateDataKey',
      'kms:DescribeKey',
    );

    if (!Resource.isOwnedResource(key)) {
      Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-lambda:webFunctionImportedEnvVarKmsKey',
        'Cannot grant the Lambda service principal usage of the imported KMS key passed as `kmsKey`. ' +
        'Grant lambda.amazonaws.com kms:Decrypt, kms:GenerateDataKey and kms:DescribeKey ' +
        'on the key policy manually.',
      );
    }
  }
}
