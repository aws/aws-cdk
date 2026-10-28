import type { Construct } from 'constructs';
import { CfnWebFunctionEndpoint } from './lambda.generated';
import type { IWebFunctionEndpointRef, IWebFunctionRef, WebFunctionEndpointReference } from './lambda.generated';
import { endpointShapeHash, hasTokens, validateResourceName } from './private/webfunction-util';
import { WebFunctionEndpointGrants } from './webfunction-endpoint-grants';
import * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import { Annotations, Fn, Names, Resource, Stack, Token } from '../../core';
import { UnscopedValidationError, ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The endpoint type for a WebFunction endpoint.
 *
 * Choose it with `WebFunctionEndpointLocation` when defining an endpoint.
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
   */
  MULTI_REGION = 'MultiRegion',
  /**
   * Per-region endpoint: a separate regional endpoint is exposed for each
   * replica region (no managed cross-region routing).
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
  /**
   * Authentication using AWS IAM.
   *
   * Requests must be signed with SigV4 and carry the `X-Amz-Content-SHA256` header, also for a
   * request without a body. A `MULTI_REGION` endpoint is signed with SigV4a, for the Region set `*`.
   */
  IAM_AUTH = 'IamAuth',
}

/**
 * Predefined region groups for use with WebFunctionReplicaRegions
 *
 * Group membership is fixed by the installed version of `aws-cdk-lib`. A region launched
 * after that version only appears in a group once you upgrade `aws-cdk-lib`, and nothing
 * reports it in the meantime. The same applies when you exclude regions from a group: "all
 * regions except X" built that way does not include a newly launched region either. To cover
 * one, upgrade `aws-cdk-lib` or list the regions explicitly; explicit lists are unaffected.
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

  /** All regions in the groups above */
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
   *
   * A `WebFunctionRegions` group contributes the regions it lists in the installed version of
   * `aws-cdk-lib`, so regions launched later are not included until you upgrade it.
   */
  public static of(included: string[], excluded?: string[]): WebFunctionReplicaRegions {
    return new WebFunctionReplicaRegions(included, excluded ?? []);
  }

  private constructor(
    private readonly included: string[],
    private readonly excluded: string[],
  ) {}

  /**
   * The final, de-duplicated list of replica regions (included minus excluded).
   *
   * Not named `resolve`: CDK treats any object with a `resolve` method as a token.
   *
   * @internal
   */
  public _toRegionList(): string[] {
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
 * Where a WebFunction endpoint serves traffic.
 *
 * A regional location carries its replica Regions, and a home-Region one has none, so a
 * combination the service rejects cannot be expressed.
 */
export class WebFunctionEndpointLocation {
  /**
   * Serve from the stack's Region only, under one regional domain name.
   */
  public static homeRegion(): WebFunctionEndpointLocation {
    return new WebFunctionEndpointLocation(WebFunctionEndpointType.HOME_REGION);
  }

  /**
   * Serve from the stack's Region and the replica Regions under one global domain name, with
   * requests routed to the nearest Region.
   *
   * The stack's own Region always serves traffic, whether or not it is listed. `replicaRegions`
   * must resolve to at least one Region. Changing the set of Regions replaces the endpoint; a
   * deploy-time list (for example from a `CfnParameter`) cannot feed the default endpoint
   * name, so changing its value at deployment also needs a new `endpointName`.
   */
  public static multiRegion(replicaRegions: WebFunctionReplicaRegions): WebFunctionEndpointLocation {
    return new WebFunctionEndpointLocation(WebFunctionEndpointType.MULTI_REGION, replicaRegions);
  }

  /**
   * Serve from the stack's Region and the replica Regions, with a separate domain name in each
   * Region and no managed routing between them.
   *
   * The same rules for `replicaRegions` apply as for `multiRegion()`.
   */
  public static perRegion(replicaRegions: WebFunctionReplicaRegions): WebFunctionEndpointLocation {
    return new WebFunctionEndpointLocation(WebFunctionEndpointType.PER_REGION, replicaRegions);
  }

  /** The endpoint type this location maps to. */
  public readonly endpointType: WebFunctionEndpointType;

  /** The replica Regions, for a regional location. */
  public readonly replicaRegions?: WebFunctionReplicaRegions;

  private constructor(endpointType: WebFunctionEndpointType, replicaRegions?: WebFunctionReplicaRegions) {
    this.endpointType = endpointType;
    this.replicaRegions = replicaRegions;
  }
}

/**
 * Settings of a WebFunction endpoint other than its auth type.
 *
 * Used for the endpoint a WebFunction creates for itself, whose auth type is set by
 * `WebFunctionProps.defaultEndpointAuth`.
 */
export interface WebFunctionDefaultEndpointOptions {
  /**
   * The name of the WebFunction endpoint.
   *
   * Must be 2 to 64 characters of letters, numbers, hyphens or underscores, starting and
   * ending with a letter or number.
   *
   * Changing this property replaces the endpoint, which yields a new `domainName`.
   *
   * `endpointLocation` also replaces the endpoint when it changes, and CloudFormation cannot
   * replace a resource that keeps its name. Without this property the name is derived from the
   * location, so that works. With it, change the name together with the location, or the
   * deployment fails.
   *
   * @default - for the endpoint a WebFunction creates, `prod` in the home Region and, for a
   * regional endpoint, `prod-` followed by a hash of its location; for any other endpoint, a
   * name derived from its construct path and location
   */
  readonly endpointName?: string;

  /**
   * Where the endpoint serves traffic: the home Region only, or a set of replica Regions.
   *
   * Changing it replaces the endpoint, which yields a new `domainName`. If you set
   * `endpointName`, change it at the same time.
   *
   * @default WebFunctionEndpointLocation.homeRegion()
   */
  readonly endpointLocation?: WebFunctionEndpointLocation;

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
 * Settings of a WebFunction endpoint.
 */
export interface WebFunctionEndpointOptions extends WebFunctionDefaultEndpointOptions {
  /**
   * The authentication type for the WebFunction endpoint.
   *
   * There is no default: you must choose explicitly so an endpoint is never accidentally public or
   * accidentally locked down. Specify `WebFunctionAuthType.IAM_AUTH` (Lambda authorizes requests with SigV4/IAM)
   * or `WebFunctionAuthType.APPLICATION_MANAGED` (the endpoint is public and your function handles authorization).
   *
   * With `IAM_AUTH`, requests must be signed with SigV4 and carry the `X-Amz-Content-SHA256`
   * header, also for a request without a body; without it the endpoint returns 403 even for a
   * valid signature. A `MULTI_REGION` endpoint is signed with SigV4a, for the Region set `*`.
   */
  readonly authType: WebFunctionAuthType;
}

/**
 * How a WebFunction endpoint splits its traffic between revisions.
 */
export class WebFunctionTraffic {
  /**
   * Send all of the endpoint's traffic to one revision.
   *
   * @param revisionId the ID of the revision. For a `WebFunction` defined in this app, use its
   * `revisionId`.
   */
  public static single(revisionId: string): WebFunctionTraffic {
    return new WebFunctionTraffic([{ revisionId, weight: 100 }]);
  }

  private constructor(private readonly weights: CfnWebFunctionEndpoint.RevisionWeightProperty[]) {}

  /**
   * The endpoint's `RevisionWeights`.
   *
   * @internal
   */
  public _toRevisionWeights(): CfnWebFunctionEndpoint.RevisionWeightProperty[] {
    return this.weights;
  }
}

/**
 * Properties for defining a `WebFunctionEndpoint`.
 */
export interface WebFunctionEndpointProps extends WebFunctionEndpointOptions {
  /**
   * The WebFunction the endpoint serves.
   */
  readonly webFunction: IWebFunctionRef;

  /**
   * The revisions that receive the endpoint's traffic.
   *
   * For a `WebFunction` defined in this app, `WebFunction.addEndpoint()` sets this to the
   * function's revision.
   */
  readonly traffic: WebFunctionTraffic;
}

/**
 * Represents a WebFunction endpoint, either created in this stack or imported.
 */
export interface IWebFunctionEndpoint extends IResource, IWebFunctionEndpointRef, iam.IResourceWithPolicyV2 {
  /**
   * The ARN of the endpoint.
   *
   * @attribute
   */
  readonly endpointArn: string;

  /**
   * The domain name of the endpoint: the host clients send requests to.
   *
   * For a `PER_REGION` endpoint this is the home Region's domain name.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The ARN of the WebFunction the endpoint serves.
   *
   * @attribute
   */
  readonly webFunctionArn: string;

  /**
   * The endpoint type.
   */
  readonly endpointType: WebFunctionEndpointType;

  /**
   * Grant methods for the endpoint.
   */
  readonly grants: WebFunctionEndpointGrants;
}

/**
 * Attributes for importing an existing WebFunction endpoint.
 */
export interface WebFunctionEndpointAttributes {
  /**
   * The ARN of the endpoint, `arn:<partition>:lambda:<region>:<account>:web-function/<function>/endpoint/<endpoint>`.
   */
  readonly endpointArn: string;

  /**
   * The domain name of the endpoint.
   *
   * The service assigns it, so it cannot be derived from the ARN.
   */
  readonly domainName: string;

  /**
   * The endpoint type.
   */
  readonly endpointType: WebFunctionEndpointType;
}

/**
 * Base class for WebFunctionEndpoint, shared between real and imported instances.
 */
export abstract class WebFunctionEndpointBase extends Resource implements IWebFunctionEndpoint {
  public abstract readonly endpointArn: string;
  public abstract readonly domainName: string;
  public abstract readonly webFunctionArn: string;
  public abstract readonly endpointType: WebFunctionEndpointType;

  /** Grant methods for the endpoint. */
  public readonly grants: WebFunctionEndpointGrants = WebFunctionEndpointGrants.fromWebFunctionEndpoint(this);

  /**
   * The WebFunction whose resource-based policy holds statements about this endpoint, when it
   * is defined in this app.
   *
   * @internal
   */
  protected _resourcePolicyTarget?: iam.IResourceWithPolicyV2;

  /**
   * Adds a statement to the resource-based policy of the WebFunction the endpoint serves.
   *
   * Only an endpoint created for a `WebFunction` defined in this app can do so, since a web
   * function has a single policy; otherwise this adds a warning and returns
   * `statementAdded: false`.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this._resourcePolicyTarget) {
      Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-lambda:webFunctionEndpointResourcePolicyNotModified',
        'The resource-based policy of the WebFunction this endpoint serves cannot be added to from ' +
        'here, because the function is not defined in this app. Add this statement where the ' +
        `function is defined: ${JSON.stringify(statement.toStatementJson())}`,
      );
      return { statementAdded: false };
    }
    return this._resourcePolicyTarget.addToResourcePolicy(statement);
  }

  /**
   * The ARN that names this endpoint in the resource-based policy of its WebFunction.
   *
   * @internal
   */
  public _arnForResourcePolicy(): string {
    return this.endpointArn;
  }

  public get webFunctionEndpointRef(): WebFunctionEndpointReference {
    return { endpointArn: this.endpointArn };
  }
}

/**
 * The ARN of the function an endpoint ARN belongs to.
 *
 * The endpoint ARN is the function ARN followed by `/endpoint/<name>`.
 */
function functionArnOfEndpoint(endpointArn: string): string {
  if (!Token.isUnresolved(endpointArn)) {
    return endpointArn.split('/endpoint/')[0];
  }
  return Fn.select(0, Fn.split('/endpoint/', endpointArn));
}

/**
 * An endpoint of a Lambda WebFunction: a domain that serves HTTP traffic for one of the
 * function's revisions.
 *
 * A `WebFunction` creates one, `fn.endpoint`. Create more with `fn.addEndpoint()`, for example
 * to serve the same function with a different auth type or endpoint type.
 */
@propertyInjectable
export class WebFunctionEndpoint extends WebFunctionEndpointBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-lambda.WebFunctionEndpoint';

  /**
   * Import an existing WebFunction endpoint by its attributes.
   */
  public static fromWebFunctionEndpointAttributes(
    scope: Construct,
    id: string,
    attrs: WebFunctionEndpointAttributes,
  ): IWebFunctionEndpoint {
    class Import extends WebFunctionEndpointBase {
      public readonly endpointArn = attrs.endpointArn;
      public readonly domainName = attrs.domainName;
      public readonly webFunctionArn = functionArnOfEndpoint(attrs.endpointArn);
      public readonly endpointType = attrs.endpointType;
    }
    return new Import(scope, id, { environmentFromArn: attrs.endpointArn });
  }

  /**
   * The ARN of the endpoint.
   *
   * @attribute
   */
  public readonly endpointArn: string;

  /**
   * The domain name of the endpoint: the host clients send requests to.
   *
   * For a `PER_REGION` endpoint this is the home Region's domain name.
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * The ARN of the WebFunction the endpoint serves.
   *
   * @attribute
   */
  public readonly webFunctionArn: string;

  /** The endpoint type. */
  public readonly endpointType: WebFunctionEndpointType;

  /** The underlying L1 CfnWebFunctionEndpoint resource. Use for escape hatches. */
  public readonly resource: CfnWebFunctionEndpoint;

  /**
   * Set when the function is in another stack. The policy statement then names the endpoint by
   * the function's ARN and the endpoint name: the endpoint's own ARN attribute would make the
   * function's stack depend on this one, which already depends on it.
   */
  private readonly crossStackPolicyArn?: { readonly webFunctionArn: string; readonly endpointName: string };

  constructor(scope: Construct, id: string, props: WebFunctionEndpointProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.endpointName !== undefined && !Token.isUnresolved(props.endpointName)) {
      validateResourceName(props.endpointName, 'Endpoint name', this);
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

    const location = props.endpointLocation ?? WebFunctionEndpointLocation.homeRegion();
    const endpointType = location.endpointType;

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

    const regions = location.replicaRegions?._toRegionList();
    if (regions !== undefined && !Token.isUnresolved(regions) && regions.length === 0) {
      throw new ValidationError(
        lit`WebFunctionRegionalEndpointEmptyRegions`,
        `replicaRegions resolved to an empty list. A ${endpointType} endpoint requires at least one region`,
        this,
      );
    }

    if (props.authType === WebFunctionAuthType.APPLICATION_MANAGED) {
      Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-lambda:webFunctionPublicEndpoint',
        'WebFunction endpoint uses APPLICATION_MANAGED auth. The Lambda service will not enforce authentication; ensure your handler code validates every request.',
      );
    }

    // Named 'Default' rather than 'Resource': CDK leaves a 'Default' child out of the logical
    // ID, so the endpoint a WebFunction creates keeps the logical ID it had when the
    // WebFunction created the L1 directly. A changed logical ID would replace the endpoint and
    // give it a new domain name.
    const endpointName = props.endpointName ?? this.defaultEndpointName(endpointType, regions);
    this.resource = new CfnWebFunctionEndpoint(this, 'Default', {
      functionName: props.webFunction.webFunctionRef.functionName,
      endpointName,
      endpointType,
      authType: props.authType,
      revisionWeights: props.traffic._toRevisionWeights(),
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

    if (iam.GrantableResources.isResourceWithPolicy(props.webFunction)) {
      this._resourcePolicyTarget = props.webFunction;
      if (Stack.of(props.webFunction) !== Stack.of(this)) {
        this.crossStackPolicyArn = { webFunctionArn: props.webFunction.webFunctionRef.functionArn, endpointName };
      }
    }

    this.endpointArn = this.resource.attrEndpointArn;
    this.domainName = this.resource.attrDomainName;
    this.webFunctionArn = this.resource.attrFunctionArn;
    this.endpointType = endpointType;
  }

  /** @internal */
  public _arnForResourcePolicy(): string {
    if (!this.crossStackPolicyArn) {
      return this.endpointArn;
    }
    const { webFunctionArn, endpointName } = this.crossStackPolicyArn;
    if (Token.isUnresolved(endpointName)) {
      throw new ValidationError(lit`WebFunctionEndpointCrossStackGrantName`,
        'Cannot grant on an endpoint in a different stack from its WebFunction when the endpoint name is ' +
        'a deploy-time value: the grant goes into the function\'s resource-based policy, which names the ' +
        'endpoint by its name. Use a literal endpointName, or define the endpoint in the function\'s stack.', this);
    }
    return `${webFunctionArn}/endpoint/${endpointName}`;
  }

  /**
   * The endpoint name used when none is given.
   *
   * The name is create-only, and so are the endpoint type and regions, so changing either of
   * those replaces the endpoint. CloudFormation cannot replace a resource under the same name,
   * so the name is derived from them: whatever replaces the endpoint also renames it.
   *
   * The endpoint a WebFunction creates for itself is named `prod` in the common case, a
   * home-Region endpoint. Any other endpoint is named after its construct path, so several
   * endpoints of one function do not collide.
   */
  private defaultEndpointName(endpointType: WebFunctionEndpointType, regions: string[] | undefined): string {
    return `${Names.uniqueResourceName(this, { maxLength: 55 })}-${endpointShapeHash(this, endpointType, regions)}`;
  }
}

