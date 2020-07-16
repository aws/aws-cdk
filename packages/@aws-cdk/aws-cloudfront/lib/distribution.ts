import * as acm from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Lazy, Resource, Stack, Token, Duration } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';
import { Origin } from './origin';
import { CacheBehavior } from './private/cache-behavior';

/**
 * Interface for CloudFront distributions
 */
export interface IDistribution extends IResource {
  /**
   * The domain name of the Distribution, such as d111111abcdef8.cloudfront.net.
   *
   * @attribute
   * @deprecated - Use `distributionDomainName` instead.
   */
  readonly domainName: string;

  /**
   * The domain name of the Distribution, such as d111111abcdef8.cloudfront.net.
   *
   * @attribute
   */
  readonly distributionDomainName: string;

  /**
   * The distribution ID for this distribution.
   *
   * @attribute
   */
  readonly distributionId: string;
}

/**
 * Attributes used to import a Distribution.
 *
 * @experimental
 */
export interface DistributionAttributes {
  /**
   * The generated domain name of the Distribution, such as d111111abcdef8.cloudfront.net.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The distribution ID for this distribution.
   *
   * @attribute
   */
  readonly distributionId: string;
}

/**
 * Properties for a Distribution
 *
 * @experimental
 */
export interface DistributionProps {
  /**
   * The default behavior for the distribution.
   */
  readonly defaultBehavior: BehaviorOptions;

  /**
   * Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.
   *
   * @default - no additional behaviors are added.
   */
  readonly additionalBehaviors?: Record<string, BehaviorOptions>;

  /**
   * A certificate to associate with the distribution. The certificate must be located in N. Virginia (us-east-1).
   *
   * @default - the CloudFront wildcard certificate (*.cloudfront.net) will be used.
   */
  readonly certificate?: acm.ICertificate;

  /**
   * The price class that corresponds with the maximum price that you want to pay for CloudFront service.
   * If you specify PriceClass_All, CloudFront responds to requests for your objects from all CloudFront edge locations.
   * If you specify a price class other than PriceClass_All, CloudFront serves your objects from the CloudFront edge location
   * that has the lowest latency among the edge locations in your price class.
   *
   * @default PriceClass.PRICE_CLASS_ALL
   */
  readonly priceClass?: PriceClass;

  /**
   * How CloudFront should handle requests that are not successful (e.g., PageNotFound).
   *
   * @default - No custom error responses.
   */
  readonly errorResponses?: ErrorResponse[];
}

/**
 * A CloudFront distribution with associated origin(s) and caching behavior(s).
 *
 * @experimental
 */
export class Distribution extends Resource implements IDistribution {

  /**
   * Creates a Distribution construct that represents an external (imported) distribution.
   */
  public static fromDistributionAttributes(scope: Construct, id: string, attrs: DistributionAttributes): IDistribution {
    return new class extends Resource implements IDistribution {
      public readonly domainName: string;
      public readonly distributionDomainName: string;
      public readonly distributionId: string;

      constructor() {
        super(scope, id);
        this.domainName = attrs.domainName;
        this.distributionDomainName = attrs.domainName;
        this.distributionId = attrs.distributionId;
      }
    }();
  }

  public readonly domainName: string;
  public readonly distributionDomainName: string;
  public readonly distributionId: string;

  private readonly defaultBehavior: CacheBehavior;
  private readonly additionalBehaviors: CacheBehavior[] = [];
  private readonly origins: Set<Origin> = new Set<Origin>();

  private readonly errorResponses: ErrorResponse[];
  private readonly certificate?: acm.ICertificate;

  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    if (props.certificate) {
      const certificateRegion = Stack.of(this).parseArn(props.certificate.certificateArn).region;
      if (!Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
        throw new Error('Distribution certificates must be in the us-east-1 region and the certificate you provided is in $Region.');
      }
    }

    this.defaultBehavior = new CacheBehavior({ pathPattern: '*', ...props.defaultBehavior });
    this.addOrigin(this.defaultBehavior.origin);
    if (props.additionalBehaviors) {
      Object.entries(props.additionalBehaviors).forEach(([pathPattern, behaviorOptions]) => {
        this.addBehavior(pathPattern, behaviorOptions.origin, behaviorOptions);
      });
    }

    this.certificate = props.certificate;
    this.errorResponses = props.errorResponses ?? [];

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig: {
      enabled: true,
      origins: Lazy.anyValue({ produce: () => this.renderOrigins() }),
      defaultCacheBehavior: this.defaultBehavior._renderBehavior(),
      cacheBehaviors: Lazy.anyValue({ produce: () => this.renderCacheBehaviors() }),
      viewerCertificate: this.certificate ? { acmCertificateArn: this.certificate.certificateArn } : undefined,
      customErrorResponses: this.renderErrorResponses(),
      priceClass: props.priceClass ?? undefined,
    } });

    this.domainName = distribution.attrDomainName;
    this.distributionDomainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;
  }

  /**
   * Adds a new behavior to this distribution for the given pathPattern.
   *
   * @param pathPattern the path pattern (e.g., 'images/*') that specifies which requests to apply the behavior to.
   * @param behaviorOptions the options for the behavior at this path.
   */
  public addBehavior(pathPattern: string, origin: Origin, behaviorOptions: AddBehaviorOptions = {}) {
    if (pathPattern === '*') {
      throw new Error('Only the default behavior can have a path pattern of \'*\'');
    }
    this.additionalBehaviors.push(new CacheBehavior({ pathPattern, origin, ...behaviorOptions }));
    this.addOrigin(origin);
  }

  private addOrigin(origin: Origin) {
    if (!this.origins.has(origin)) {
      this.origins.add(origin);
      origin._bind(this, { originIndex: this.origins.size });
    }
  }

  private renderOrigins(): CfnDistribution.OriginProperty[] {
    const renderedOrigins: CfnDistribution.OriginProperty[] = [];
    this.origins.forEach(origin => renderedOrigins.push(origin._renderOrigin()));
    return renderedOrigins;
  }

  private renderCacheBehaviors(): CfnDistribution.CacheBehaviorProperty[] | undefined {
    if (this.additionalBehaviors.length === 0) { return undefined; }
    return this.additionalBehaviors.map(behavior => behavior._renderBehavior());
  }

  private renderErrorResponses(): CfnDistribution.CustomErrorResponseProperty[] | undefined {
    if (this.errorResponses.length === 0) { return undefined; }
    function validateCustomErrorResponse(errorResponse: ErrorResponse) {
      if (errorResponse.responsePagePath && !errorResponse.responseHttpStatus) {
        throw new Error('\'responseCode\' must be provided if \'responsePagePath\' is defined');
      }
      if (!errorResponse.responseHttpStatus && !errorResponse.ttl) {
        throw new Error('A custom error response without either a \'responseCode\' or \'errorCachingMinTtl\' is not valid.');
      }
    }
    this.errorResponses.forEach(e => validateCustomErrorResponse(e));

    return this.errorResponses.map(errorConfig => {
      return {
        errorCachingMinTtl: errorConfig.ttl?.toSeconds(),
        errorCode: errorConfig.httpStatus,
        responseCode: errorConfig.responseHttpStatus,
        responsePagePath: errorConfig.responsePagePath,
      };
    });
  }

}

/**
 * The price class determines how many edge locations CloudFront will use for your distribution.
 * See https://aws.amazon.com/cloudfront/pricing/ for full list of supported regions.
 */
export enum PriceClass {
  /** USA, Canada, Europe, & Israel */
  PRICE_CLASS_100 = 'PriceClass_100',
  /** PRICE_CLASS_100 + South Africa, Kenya, Middle East, Japan, Singapore, South Korea, Taiwan, Hong Kong, & Philippines */
  PRICE_CLASS_200 = 'PriceClass_200',
  /** All locations */
  PRICE_CLASS_ALL = 'PriceClass_All'
}

/**
 * How HTTPs should be handled with your distribution.
 */
export enum ViewerProtocolPolicy {
  /** HTTPS only */
  HTTPS_ONLY = 'https-only',
  /** Will redirect HTTP requests to HTTPS */
  REDIRECT_TO_HTTPS = 'redirect-to-https',
  /** Both HTTP and HTTPS supported */
  ALLOW_ALL = 'allow-all'
}

/**
 * Defines what protocols CloudFront will use to connect to an origin.
 */
export enum OriginProtocolPolicy {
  /** Connect on HTTP only */
  HTTP_ONLY = 'http-only',
  /** Connect with the same protocol as the viewer */
  MATCH_VIEWER = 'match-viewer',
  /** Connect on HTTPS only */
  HTTPS_ONLY = 'https-only',
}

/**
 * The HTTP methods that the Behavior will accept requests on.
 */
export class AllowedMethods {
  /** HEAD and GET */
  public static readonly ALLOW_GET_HEAD = new AllowedMethods(['GET', 'HEAD']);
  /** HEAD, GET, and OPTIONS */
  public static readonly ALLOW_GET_HEAD_OPTIONS = new AllowedMethods(['GET', 'HEAD', 'OPTIONS']);
  /** All supported HTTP methods */
  public static readonly ALLOW_ALL = new AllowedMethods(['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE']);

  /** HTTP methods supported */
  public readonly methods: string[];

  private constructor(methods: string[]) { this.methods = methods; }
}

/**
 * Options for configuring custom error responses.
 *
 * @experimental
 */
export interface ErrorResponse {
  /**
   * The minimum amount of time, in seconds, that you want CloudFront to cache the HTTP status code specified in ErrorCode.
   *
   * @default - the default caching TTL behavior applies
   */
  readonly ttl?: Duration;
  /**
   * The HTTP status code for which you want to specify a custom error page and/or a caching duration.
   */
  readonly httpStatus: number;
  /**
   * The HTTP status code that you want CloudFront to return to the viewer along with the custom error page.
   *
   * If you specify a value for `responseHttpStatus`, you must also specify a value for `responsePagePath`.
   *
   * @default - not set, the error code will be returned as the response code.
   */
  readonly responseHttpStatus?: number;
  /**
   * The path to the custom error page that you want CloudFront to return to a viewer when your origin returns the
   * `httpStatus`, for example, /4xx-errors/403-forbidden.html
   *
   * @default - the default CloudFront response is shown.
   */
  readonly responsePagePath?: string;
}

/**
 * Options for adding a new behavior to a Distribution.
 *
 * @experimental
 */
export interface AddBehaviorOptions {
  /**
   * HTTP methods to allow for this behavior.
   *
   * @default - GET and HEAD
   */
  readonly allowedMethods?: AllowedMethods;

  /**
   * Whether CloudFront will forward query strings to the origin.
   * If this is set to true, CloudFront will forward all query parameters to the origin, and cache
   * based on all parameters. See `forwardQueryStringCacheKeys` for a way to limit the query parameters
   * CloudFront caches on.
   *
   * @default false
   */
  readonly forwardQueryString?: boolean;

  /**
   * A set of query string parameter names to use for caching if `forwardQueryString` is set to true.
   *
   * @default []
   */
  readonly forwardQueryStringCacheKeys?: string[];
}

/**
 * Options for creating a new behavior.
 *
 * @experimental
 */
export interface BehaviorOptions extends AddBehaviorOptions {
  /**
   * The origin that you want CloudFront to route requests to when they match this behavior.
   */
  readonly origin: Origin;
}
