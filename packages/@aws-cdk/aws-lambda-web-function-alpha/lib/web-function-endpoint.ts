import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnWebFunctionEndpoint, CfnWebFunctionRevision } from 'aws-cdk-lib/aws-lambda';
import type { IWebFunctionEndpointRef, WebFunctionEndpointReference } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import { WebFunctionValidationError } from './private/errors';
import type { IWebFunction } from './web-function';

/**
 * An HTTPS endpoint of a Lambda Web Function
 */
export interface IWebFunctionEndpoint extends cdk.IResource, IWebFunctionEndpointRef {
  /**
   * The ARN of the endpoint
   *
   * @attribute
   */
  readonly endpointArn: string;

  /**
   * The name of the endpoint
   *
   * @attribute
   */
  readonly endpointName: string;

  /**
   * Grants on this endpoint
   */
  readonly grants: WebFunctionEndpointGrants;
}

/**
 * Attributes of an existing Web Function endpoint
 */
export interface WebFunctionEndpointAttributes {
  /**
   * The ARN of the endpoint
   */
  readonly endpointArn: string;

  /**
   * The name of the endpoint
   */
  readonly endpointName: string;
}

/**
 * The type of a web function endpoint, which determines where it is reachable
 */
export enum WebFunctionEndpointType {
  /**
   * The endpoint is served from the home Region of the web function
   */
  HOME_REGION = 'HomeRegion',

  /**
   * The endpoint is served from several Regions behind a global domain name
   */
  MULTI_REGION = 'MultiRegion',

  /**
   * The endpoint is served from each of the configured Regions
   */
  PER_REGION = 'PerRegion',
}

/**
 * The authentication type of a web function endpoint
 */
export enum WebFunctionAuthType {
  /**
   * The application authenticates requests itself
   */
  APPLICATION_MANAGED = 'ApplicationManaged',

  /**
   * Requests must be signed with IAM credentials
   */
  IAM_AUTH = 'IamAuth',
}

/**
 * A weighted route from an endpoint to a revision of a web function
 */
export interface WebFunctionRevisionWeight {
  /**
   * The ID of the revision
   */
  readonly revisionId: string;

  /**
   * The share of traffic sent to the revision, from 0 to 100
   */
  readonly weight: number;
}

/**
 * Properties for a Web Function endpoint
 */
export interface WebFunctionEndpointProps {
  /**
   * The web function that the endpoint exposes
   */
  // Not a Ref interface: the default route needs the revision ID, which a reference does not carry
  readonly webFunction: IWebFunction;

  /**
   * The name of the endpoint.
   *
   * @default - a name is generated
   */
  readonly webFunctionEndpointName?: string;

  /**
   * A description of the endpoint.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The type of the endpoint.
   *
   * @default WebFunctionEndpointType.HOME_REGION
   */
  readonly endpointType?: WebFunctionEndpointType;

  /**
   * The authentication type of the endpoint. There is no default, so making an endpoint public
   * (`APPLICATION_MANAGED`) is always an explicit choice.
   */
  readonly authType: WebFunctionAuthType;

  /**
   * How traffic is split across revisions. Either one entry with a weight of 100, or two entries
   * whose weights sum to 100.
   *
   * @default - 100% of traffic to the revision of `webFunction`
   */
  readonly revisionWeights?: WebFunctionRevisionWeight[];

  /**
   * The Regions the endpoint is served from.
   *
   * @default - the service default
   */
  readonly regions?: string[];

  /**
   * The maximum number of concurrent execution environments the endpoint can use, in addition to
   * the account vCPU quota.
   *
   * @default - limited only by the account vCPU quota
   */
  readonly maxEnvironments?: number;

  /**
   * The maximum request rate per second the endpoint accepts, in each Region, in addition to the
   * account rate limit quota.
   *
   * Values up to 1000 must be a multiple of 100, and values above 1000 must be a multiple of 1000.
   * A value of 0 blocks all traffic.
   *
   * @default - limited only by the account rate limit quota
   */
  readonly rateLimit?: number;
}

/**
 * An HTTPS endpoint that routes traffic to the revisions of a `WebFunction`
 *
 * @resource AWS::Lambda::WebFunctionEndpoint
 *
 * @example
 * import * as path from 'path';
 * import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';
 *
 * const fn = new WebFunction(this, 'WebFunction', {
 *   code: WebFunctionCode.fromAsset(path.join(__dirname, 'app')),
 * });
 *
 * new WebFunctionEndpoint(this, 'Endpoint', {
 *   webFunction: fn,
 *   authType: WebFunctionAuthType.APPLICATION_MANAGED,
 *   rateLimit: 100,
 * });
 */
export class WebFunctionEndpoint extends cdk.Resource implements IWebFunctionEndpoint {
  /**
   * Imports an existing web function endpoint from its attributes
   *
   * @param scope the construct scope
   * @param id the construct ID
   * @param attrs the attributes of the existing endpoint
   */
  public static fromWebFunctionEndpointAttributes(scope: Construct, id: string, attrs: WebFunctionEndpointAttributes): IWebFunctionEndpoint {
    return new ImportedWebFunctionEndpoint(scope, id, attrs);
  }

  /**
   * The ARN of the endpoint
   */
  public readonly endpointArn: string;

  /**
   * The name of the endpoint
   */
  public readonly endpointName: string;

  /**
   * The domain name of the endpoint
   */
  public readonly domainName: string;

  /**
   * A reference to this endpoint, for use in other constructs
   */
  public get webFunctionEndpointRef(): WebFunctionEndpointReference {
    return { endpointArn: this.endpointArn };
  }

  /**
   * The underlying `AWS::Lambda::WebFunctionEndpoint` resource
   */
  public readonly cfnEndpoint: CfnWebFunctionEndpoint;

  constructor(scope: Construct, id: string, props: WebFunctionEndpointProps) {
    super(scope, id, { physicalName: props.webFunctionEndpointName });

    // The name is required by CloudFormation. Names.uniqueResourceName does not need a Region,
    // so the name can be generated in environment-agnostic stacks as well
    this.endpointName = props.webFunctionEndpointName ?? cdk.Names.uniqueResourceName(this, { maxLength: 64, separator: '-' });

    const revisionWeights = props.revisionWeights ?? [
      { revisionId: props.webFunction.revisionId, weight: 100 },
    ];
    validateRevisionWeights(revisionWeights);
    if (props.regions !== undefined && props.regions.length === 0) {
      throw new WebFunctionValidationError('regions must contain at least one Region when specified');
    }
    if (props.maxEnvironments !== undefined && !cdk.Token.isUnresolved(props.maxEnvironments)
      && (!Number.isInteger(props.maxEnvironments) || props.maxEnvironments < 2 || props.maxEnvironments > 10000)) {
      throw new WebFunctionValidationError(`maxEnvironments must be an integer from 2 to 10000, got ${props.maxEnvironments}`);
    }
    if (props.rateLimit !== undefined && !cdk.Token.isUnresolved(props.rateLimit) && !isValidRateLimit(props.rateLimit)) {
      throw new WebFunctionValidationError(
        `rateLimit must be 0 to 10000: a multiple of 100 up to 1000, then a multiple of 1000, got ${props.rateLimit}`,
      );
    }

    // Egress through a network connector is only supported with HomeRegion endpoints
    const endpointType = props.endpointType ?? WebFunctionEndpointType.HOME_REGION;
    this.node.addValidation({
      validate: () => (endpointType !== WebFunctionEndpointType.HOME_REGION && webFunctionHasEgress(props.webFunction)
        ? [`egress through a network connector requires a ${WebFunctionEndpointType.HOME_REGION} endpoint, got ${endpointType}`]
        : []),
    });

    this.cfnEndpoint = new CfnWebFunctionEndpoint(this, 'Resource', {
      functionName: props.webFunction.functionName,
      endpointName: this.endpointName,
      description: props.description,
      endpointType: props.endpointType ?? WebFunctionEndpointType.HOME_REGION,
      authType: props.authType,
      revisionWeights: revisionWeights.map((rw) => ({ revisionId: rw.revisionId, weight: rw.weight })),
      regions: props.regions,
      scalingConfig: props.maxEnvironments !== undefined ? { maxEnvironments: props.maxEnvironments } : undefined,
      throttleConfig: props.rateLimit !== undefined ? { rateLimit: props.rateLimit } : undefined,
    });
    // The endpoint routes to the function, so it is created after the function
    this.node.addDependency(props.webFunction);

    this.endpointArn = this.cfnEndpoint.attrEndpointArn;
    this.domainName = this.cfnEndpoint.attrDomainName;
  }

  /**
   * Grants on this endpoint
   */
  public get grants(): WebFunctionEndpointGrants {
    return WebFunctionEndpointGrants.fromEndpoint(this);
  }
}

/**
 * Checks a rate limit: 0 to 10000, a multiple of 100 up to 1000, and a multiple of 1000 above that
 */
function isValidRateLimit(rateLimit: number): boolean {
  if (!Number.isInteger(rateLimit) || rateLimit < 0 || rateLimit > 10000) {
    return false;
  }
  return rateLimit <= 1000 ? rateLimit % 100 === 0 : rateLimit % 1000 === 0;
}

/**
 * Validates the traffic split: one revision at 100%, or two revisions summing to 100%
 */
function validateRevisionWeights(weights: WebFunctionRevisionWeight[]) {
  if (weights.length < 1 || weights.length > 2) {
    throw new WebFunctionValidationError(`revisionWeights must contain 1 or 2 entries, got ${weights.length}`);
  }
  for (const rw of weights) {
    if (!cdk.Token.isUnresolved(rw.weight) && (!Number.isInteger(rw.weight) || rw.weight < 0 || rw.weight > 100)) {
      throw new WebFunctionValidationError(`revision weight must be an integer from 0 to 100, got ${rw.weight}`);
    }
  }
  if (weights.length === 1 && !cdk.Token.isUnresolved(weights[0].weight) && weights[0].weight !== 100) {
    throw new WebFunctionValidationError(`a single revision must have a weight of 100, got ${weights[0].weight}`);
  }
  if (weights.length === 2 && weights.every((rw) => !cdk.Token.isUnresolved(rw.weight))) {
    const sum = weights[0].weight + weights[1].weight;
    if (sum !== 100) {
      throw new WebFunctionValidationError(`revision weights must sum to 100, got ${sum}`);
    }
  }
}

/**
 * Grants on a web function endpoint
 */
export class WebFunctionEndpointGrants {
  /**
   * Creates grants for an endpoint
   *
   * @param endpoint the endpoint to grant on
   */
  public static fromEndpoint(endpoint: IWebFunctionEndpoint): WebFunctionEndpointGrants {
    return new WebFunctionEndpointGrants(endpoint);
  }

  private constructor(private readonly endpoint: IWebFunctionEndpoint) {}

  /**
   * Grants a principal permission to invoke the endpoint. Applies to endpoints with the
   * `IamAuth` authentication type.
   *
   * The grant is added to the principal's identity policy. Callers in another account also need
   * a resource-based policy on the web function, which this construct does not manage.
   *
   * @param grantee the principal to grant
   */
  public invoke(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['lambda:InvokeWebFunctionEndpoint'],
      resourceArns: [this.endpoint.endpointArn],
    });
  }
}

/**
 * An endpoint that exists outside this stack
 */
class ImportedWebFunctionEndpoint extends cdk.Resource implements IWebFunctionEndpoint {
  public readonly endpointArn: string;
  public readonly endpointName: string;

  constructor(scope: Construct, id: string, attrs: WebFunctionEndpointAttributes) {
    super(scope, id, { environmentFromArn: attrs.endpointArn });
    this.endpointArn = attrs.endpointArn;
    this.endpointName = attrs.endpointName;
  }

  public get webFunctionEndpointRef(): WebFunctionEndpointReference {
    return { endpointArn: this.endpointArn };
  }

  public get grants(): WebFunctionEndpointGrants {
    return WebFunctionEndpointGrants.fromEndpoint(this);
  }
}

/**
 * Whether a web function's revision has VPC egress. Only a web function defined in this app can be inspected.
 */
function webFunctionHasEgress(webFunction: IWebFunction): boolean {
  const revision = webFunction.node.tryFindChild('Revision');
  if (!revision || !CfnWebFunctionRevision.isCfnWebFunctionRevision(revision)) {
    return false;
  }
  const serviceConfig = revision.serviceConfig as CfnWebFunctionRevision.ServiceConfigProperty;
  return serviceConfig?.egressNetworkConnectorArn !== undefined;
}
