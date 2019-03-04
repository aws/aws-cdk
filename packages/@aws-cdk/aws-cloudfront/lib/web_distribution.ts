import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { CfnCloudFrontOriginAccessIdentity, CfnDistribution } from './cloudfront.generated';

export enum HttpVersion {
  HTTP1_1 = "http1.1",
  HTTP2 = "http2"
}

/**
 * The price class determines how many edge locations CloudFront will use for your distribution.
 */
export enum PriceClass {
  PriceClass100 = "PriceClass_100",
  PriceClass200 = "PriceClass_200",
  PriceClassAll = "PriceClass_All"
}

/**
 * How HTTPs should be handled with your distribution.
 */
export enum ViewerProtocolPolicy {
  HTTPSOnly = "https-only",
  RedirectToHTTPS = "redirect-to-https",
  AllowAll = "allow-all"
}

/**
 * Configuration for custom domain names
 *
 * CloudFront can use a custom domain that you provide instead of a
 * "cloudfront.net" domain. To use this feature you must provide the list of
 * additional domains, and the ACM Certificate that CloudFront should use for
 * these additional domains.
 */
export interface AliasConfiguration {
  /**
   * ARN of an AWS Certificate Manager (ACM) certificate.
   */
  readonly acmCertRef: string;

  /**
   * Domain names on the certificate
   *
   * Both main domain name and Subject Alternative Names.
   */
  readonly names: string[];

  /**
   * How CloudFront should serve HTTPS requests.
   *
   * See the notes on SSLMethod if you wish to use other SSL termination types.
   *
   * @default SNI
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_ViewerCertificate.html
   */
  readonly sslMethod?: SSLMethod;

  /**
   * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
   *
   * CloudFront serves your objects only to browsers or devices that support at
   * least the SSL version that you specify.
   *
   * @default securityPolicy: SSLv3 if sslMethod VIP, TLSv1 if sslMethod SNI
   */
  readonly securityPolicy?: SecurityPolicyProtocol;
}

/**
 * The SSL method CloudFront will use for your distribution.
 *
 * Server Name Indication (SNI) - is an extension to the TLS computer networking protocol by which a client indicates
 *  which hostname it is attempting to connect to at the start of the handshaking process. This allows a server to present
 *  multiple certificates on the same IP address and TCP port number and hence allows multiple secure (HTTPS) websites
 * (or any other service over TLS) to be served by the same IP address without requiring all those sites to use the same certificate.
 *
 * CloudFront can use SNI to host multiple distributions on the same IP - which a large majority of clients will support.
 *
 * If your clients cannot support SNI however - CloudFront can use dedicated IPs for your distribution - but there is a prorated monthly charge for
 * using this feature. By default, we use SNI - but you can optionally enable dedicated IPs (VIP).
 *
 * See the CloudFront SSL for more details about pricing : https://aws.amazon.com/cloudfront/custom-ssl-domains/
 *
 */
export enum SSLMethod {
  SNI = "sni-only",
  VIP = "vip"
}

/**
 * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
 * CloudFront serves your objects only to browsers or devices that support at least the SSL version that you specify.
 */
export enum SecurityPolicyProtocol {
  SSLv3 = "SSLv3",
  TLSv1 = "TLSv1",
  TLSv1_2016 = "TLSv1_2016",
  TLSv1_1_2016 = "TLSv1.1_2016",
  TLSv1_2_2018 = "TLSv1.2_2018"
}

/**
 * Logging configuration for incoming requests
 */
export interface LoggingConfiguration {
  /**
   * Bucket to log requests to
   *
   * @default A logging bucket is automatically created
   */
  readonly bucket?: s3.IBucket,

  /**
   * Whether to include the cookies in the logs
   *
   * @default false
   */
  readonly includeCookies?: boolean,

  /**
   * Where in the bucket to store logs
   *
   * @default No prefix
   */
  readonly prefix?: string
}

/**
 * A source configuration is a wrapper for CloudFront origins and behaviors.
 * An origin is what CloudFront will "be in front of" - that is, CloudFront will pull it's assets from an origin.
 *
 * If you're using s3 as a source - pass the `s3Origin` property, otherwise, pass the `customOriginSource` property.
 *
 * One or the other must be passed, and it is invalid to pass both in the same SourceConfiguration.
 */
export interface SourceConfiguration {
  /**
   * An s3 origin source - if you're using s3 for your assets
   */
  readonly s3OriginSource?: S3OriginConfig

  /**
   * A custom origin source - for all non-s3 sources.
   */
  readonly customOriginSource?: CustomOriginConfig,

  /**
   * The behaviors associated with this source.
   * At least one (default) behavior must be included.
   */
  readonly behaviors: Behavior[];

  /**
   * The relative path to the origin root to use for sources.
   *
   * @default /
   */
  readonly originPath?: string,

  /**
   * Any additional headers to pass to the origin
   *
   * @default no additional headers are passed
   */
  readonly originHeaders?: { [key: string]: string };
}

/**
 * A custom origin configuration
 */
export interface CustomOriginConfig {
  /**
   * The domain name of the custom origin. Should not include the path - that should be in the parent SourceConfiguration
   */
  readonly domainName: string,

  /**
   * The origin HTTP port
   *
   * @default 80
   */
  readonly httpPort?: number,

  /**
   * The origin HTTPS port
   *
   * @default 443
   */
  readonly httpsPort?: number,

  /**
   * The keep alive timeout when making calls in seconds.
   *
   * @default: 5 seconds
   */
  readonly originKeepaliveTimeoutSeconds?: number,

  /**
   * The protocol (http or https) policy to use when interacting with the origin.
   *
   * @default: HttpsOnly
   */
  readonly originProtocolPolicy?: OriginProtocolPolicy,

  /**
   * The read timeout when calling the origin in seconds
   *
   * @default 30 seconds
   */
  readonly originReadTimeoutSeconds?: number

  /**
   * The SSL versions to use when interacting with the origin.
   *
   * @default [TLSv1_2]
   */
  readonly allowedOriginSSLVersions?: OriginSslPolicy[];

}

export enum OriginSslPolicy {
  SSLv3 = "SSLv3",
  TLSv1 = "TLSv1",
  TLSv1_1 = "TLSv1.1",
  TLSv1_2 = "TLSv1.2",
}

export enum OriginProtocolPolicy {
  HttpOnly = "http-only",
  MatchViewer = "match-viewer",
  HttpsOnly = "https-only",
}

export interface S3OriginConfig {
  /**
   * The source bucket to serve content from
   */
  readonly s3BucketSource: s3.IBucket,

  /**
   * The optional origin identity cloudfront will use when calling your s3 bucket.
   */
  readonly originAccessIdentity?: CfnCloudFrontOriginAccessIdentity
}

/**
 * An enum for the supported methods to a CloudFront distribution.
 */
export enum CloudFrontAllowedMethods {
  GET_HEAD = "GH",
  GET_HEAD_OPTIONS = "GHO",
  ALL = "ALL"
}

/**
 * Enums for the methods CloudFront can cache.
 */
export enum CloudFrontAllowedCachedMethods {
  GET_HEAD = "GH",
  GET_HEAD_OPTIONS = "GHO",
}

/**
 * A CloudFront behavior wrapper.
 */
export interface Behavior {

  /**
   * If CloudFront should automatically compress some content types.
   *
   * @default true
   */
  compress?: boolean;

  /**
   * If this behavior is the default behavior for the distribution.
   *
   * You must specify exactly one default distribution per CloudFront distribution.
   * The default behavior is allowed to omit the "path" property.
   */
  isDefaultBehavior?: boolean;

  /**
   * Trusted signers is how CloudFront allows you to serve private content.
   * The signers are the account IDs that are allowed to sign cookies/presigned URLs for this distribution.
   *
   * If you pass a non empty value, all requests for this behavior must be signed (no public access will be allowed)
   */
  trustedSigners?: string[];

  /**
   *
   * The default amount of time CloudFront will cache an object.
   *
   * This value applies only when your custom origin does not add HTTP headers,
   * such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects.
   * @default 86400 (1 day)
   *
   */
  defaultTtlSeconds?: number;

  /**
   * The method this CloudFront distribution responds do.
   *
   * @default GET_HEAD
   */
  allowedMethods?: CloudFrontAllowedMethods;

  /**
   * The path this behavior responds to.
   * Required for all non-default behaviors. (The default behavior implicitly has "*" as the path pattern. )
   *
   */
  pathPattern?: string;

  /**
   * Which methods are cached by CloudFront by default.
   *
   * @default GET_HEAD
   */
  cachedMethods?: CloudFrontAllowedCachedMethods;

  /**
   * The values CloudFront will forward to the origin when making a request.
   *
   * @default none (no cookies - no headers)
   *
   */
  forwardedValues?: CfnDistribution.ForwardedValuesProperty;

  /**
   * The minimum amount of time that you want objects to stay in the cache
   * before CloudFront queries your origin.
   */
  minTtlSeconds?: number;

  /**
   * The max amount of time you want objects to stay in the cache
   * before CloudFront queries your origin.
   *
   * @default 31536000 (one year)
   */
  maxTtlSeconds?: number;

}

export interface ErrorConfiguration {
  /**
   * The error code matched from the origin
   */
  originErrorCode: number,
  /**
   * The error code that is sent to the caller.
   */
  respondWithErrorCode: number,
  /**
   * The path to service instead
   */
  respondWithPage: string,
  /**
   * How long before this error is retried.
   */
  cacheTtl?: number
}

export interface CloudFrontWebDistributionProps {

  /**
   * AliasConfiguration is used to configured CloudFront to respond to requests on custom domain names.
   *
   * @default none
   */
  aliasConfiguration?: AliasConfiguration;

  /**
   * A comment for this distribution in the cloud front console.
   */
  comment?: string;

  /**
   * The default object to serve.
   *
   * @default "index.html"
   */
  defaultRootObject?: string;

  /**
   * If your distribution should have IPv6 enabled.
   *
   * @default true
   */
  enableIpV6?: boolean;

  /**
   * The max supported HTTP Versions.
   *
   * @default HttpVersion.HTTP2
   */
  httpVersion?: HttpVersion;

  /**
   * The price class for the distribution (this impacts how many locations CloudFront uses for your distribution, and billing)
   *
   * @default PriceClass_100: the cheapest option for CloudFront is picked by default.
   */
  priceClass?: PriceClass;

  /**
   * The default viewer policy for incoming clients.
   *
   * @default RedirectToHTTPs
   */
  viewerProtocolPolicy?: ViewerProtocolPolicy;

  /**
   * The origin configurations for this distribution. Behaviors are a part of the origin.
   */
  originConfigs: SourceConfiguration[];

  /**
   * Optional - if we should enable logging.
   * You can pass an empty object ({}) to have us auto create a bucket for logging.
   * Omission of this property indicates no logging is to be enabled.
   *
   * @default: no logging is enabled by default.
   */
  loggingConfig?: LoggingConfiguration;

  /**
   * How CloudFront should handle requests that are no successful (eg PageNotFound)
   */
  errorConfigurations?: CfnDistribution.CustomErrorResponseProperty[];

  /**
   * Optional AWS WAF WebACL to associate with this CloudFront distribution
   */
  webACLId?: string;

}

/**
 * Internal only - just adds the originId string to the Behavior
 */
interface BehaviorWithOrigin extends Behavior {
  targetOriginId: string;
}

/**
 * Amazon CloudFront is a global content delivery network (CDN) service that securely delivers data, videos,
 * applications, and APIs to your viewers with low latency and high transfer speeds.
 * CloudFront fronts user provided content and caches it at edge locations across the world.
 *
 * Here's how you can use this construct:
 *
 * ```ts
 * import { CloudFront } from '@aws-cdk/aws-cloudfront'
 *
 * const sourceBucket = new Bucket(this, 'Bucket');
 *
 * const distribution = new CloudFrontDistribution(this, 'MyDistribution', {
 *  originConfigs: [
 *    {
 *      s3OriginSource: {
 *      s3BucketSource: sourceBucket
 *      },
 *      behaviors : [ {isDefaultBehavior}]
 *    }
 *  ]
 * });
 * ```
 *
 * This will create a CloudFront distribution that uses your S3Bucket as it's origin.
 *
 * You can customize the distribution using additional properties from the CloudFrontWebDistributionProps interface.
 *
 *
 */
export class CloudFrontWebDistribution extends cdk.Construct implements route53.IAliasRecordTarget {

  /**
   * The hosted zone Id if using an alias record in Route53.
   * This value never changes.
   */
  public readonly aliasHostedZoneId: string = "Z2FDTNDATAQYW2";

  /**
   * The logging bucket for this CloudFront distribution.
   * If logging is not enabled for this distribution - this property will be undefined.
   */
  public readonly loggingBucket?: s3.IBucket;

  /**
   * The domain name created by CloudFront for this distribution.
   * If you are using aliases for your distribution, this is the domainName your DNS records should point to.
   * (In Route53, you could create an ALIAS record to this value, for example. )
   */
  public readonly domainName: string;

  /**
   * The distribution ID for this distribution.
   */
  public readonly distributionId: string;

  /**
   * Maps our methods to the string arrays they are
   */
  private readonly METHOD_LOOKUP_MAP = {
    GH: ["GET", "HEAD"],
    GHO: ["GET", "HEAD", "OPTIONS"],
    ALL: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
  };

  /**
   * Maps for which SecurityPolicyProtocol are available to which SSLMethods
   */
  private readonly VALID_SSL_PROTOCOLS: { [key: string]: string[] } = {
    "sni-only": [
      SecurityPolicyProtocol.TLSv1, SecurityPolicyProtocol.TLSv1_1_2016,
      SecurityPolicyProtocol.TLSv1_2016, SecurityPolicyProtocol.TLSv1_2_2018
    ],
    "vip": [SecurityPolicyProtocol.SSLv3, SecurityPolicyProtocol.TLSv1],
  };

  constructor(scope: cdk.Construct, id: string, props: CloudFrontWebDistributionProps) {
    super(scope, id);

    const distributionConfig: CfnDistribution.DistributionConfigProperty = {
      comment: props.comment,
      enabled: true,
      defaultRootObject: props.defaultRootObject !== undefined ? props.defaultRootObject : "index.html",
      httpVersion: props.httpVersion || HttpVersion.HTTP2,
      priceClass: props.priceClass || PriceClass.PriceClass100,
      ipv6Enabled: (props.enableIpV6 !== undefined) ? props.enableIpV6 : true,
      // tslint:disable-next-line:max-line-length
      customErrorResponses: props.errorConfigurations, // TODO: validation : https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcachingminttl
      webAclId: props.webACLId,
    };

    const behaviors: BehaviorWithOrigin[] = [];

    const origins: CfnDistribution.OriginProperty[] = [];

    let originIndex = 1;
    for (const originConfig of props.originConfigs) {
      const originId = `origin${originIndex}`;
      if (!originConfig.s3OriginSource && !originConfig.customOriginSource) {
        throw new Error("There must be at least one origin source - either an s3OriginSource or a customOriginSource");
      }
      if (originConfig.customOriginSource && originConfig.s3OriginSource) {
        throw new Error("There cannot be both an s3OriginSource and a customOriginSource in the same SourceConfiguration.");
      }

      const originHeaders: CfnDistribution.OriginCustomHeaderProperty[] = [];
      if (originConfig.originHeaders) {
        Object.keys(originConfig.originHeaders).forEach(key => {
          const oHeader: CfnDistribution.OriginCustomHeaderProperty = {
            headerName: key,
            headerValue: originConfig.originHeaders![key]
          };
          originHeaders.push(oHeader);
        });
      }

      const originProperty: CfnDistribution.OriginProperty = {
        id: originId,
        domainName: originConfig.s3OriginSource ?
          originConfig.s3OriginSource.s3BucketSource.domainName :
          originConfig.customOriginSource!.domainName,
        originPath: originConfig.originPath,
        originCustomHeaders: originHeaders.length > 0 ? originHeaders : undefined,
      };

      if (originConfig.s3OriginSource && originConfig.s3OriginSource.originAccessIdentity) {
        originProperty.s3OriginConfig = {
          originAccessIdentity: `origin-access-identity/cloudfront/${originConfig.s3OriginSource.originAccessIdentity.ref}`
        };
      } else if (originConfig.s3OriginSource) {
        originProperty.s3OriginConfig = {};
      }

      if (originConfig.customOriginSource) {
        originProperty.customOriginConfig = {
          httpPort: originConfig.customOriginSource.httpPort || 80,
          httpsPort: originConfig.customOriginSource.httpsPort || 443,
          originKeepaliveTimeout: originConfig.customOriginSource.originKeepaliveTimeoutSeconds || 5,
          originReadTimeout: originConfig.customOriginSource.originReadTimeoutSeconds || 30,
          originProtocolPolicy: originConfig.customOriginSource.originProtocolPolicy || OriginProtocolPolicy.HttpsOnly,
          originSslProtocols: originConfig.customOriginSource.allowedOriginSSLVersions || [OriginSslPolicy.TLSv1_2]
        };
      }
      for (const behavior of originConfig.behaviors) {
        behaviors.push({ ...behavior, targetOriginId: originId });
      }
      origins.push(originProperty);
      originIndex++;
    }

    origins.forEach(origin => {
      if (!origin.s3OriginConfig && !origin.customOriginConfig) {
        throw new Error(`Origin ${origin.domainName} is missing either S3OriginConfig or CustomOriginConfig. At least 1 must be specified.`);
      }
    });
    distributionConfig.origins = origins;

    const defaultBehaviors = behaviors.filter(behavior => behavior.isDefaultBehavior);
    if (defaultBehaviors.length !== 1) {
      throw new Error("There can only be one default behavior across all sources. [ One default behavior per distribution ].");
    }
    distributionConfig.defaultCacheBehavior = this.toBehavior(defaultBehaviors[0]);
    const otherBehaviors: CfnDistribution.CacheBehaviorProperty[] = [];
    for (const behavior of behaviors.filter(b => !b.isDefaultBehavior)) {
      if (!behavior.pathPattern) {
        throw new Error("pathPattern is required for all non-default behaviors");
      }
      otherBehaviors.push(this.toBehavior(behavior) as CfnDistribution.CacheBehaviorProperty);
    }
    distributionConfig.cacheBehaviors = otherBehaviors;

    if (props.aliasConfiguration) {
      distributionConfig.aliases = props.aliasConfiguration.names;
      distributionConfig.viewerCertificate = {
        acmCertificateArn: props.aliasConfiguration.acmCertRef,
        sslSupportMethod: props.aliasConfiguration.sslMethod || SSLMethod.SNI,
        minimumProtocolVersion: props.aliasConfiguration.securityPolicy
      };

      if (distributionConfig.viewerCertificate.minimumProtocolVersion !== undefined) {
        const validProtocols = this.VALID_SSL_PROTOCOLS[distributionConfig.viewerCertificate.sslSupportMethod!.toString()];

        if (validProtocols === undefined) {
          throw new Error(`Invalid sslMethod. ${distributionConfig.viewerCertificate.sslSupportMethod!.toString()} is not fully implemented yet.`);
        }

        if (validProtocols.indexOf(distributionConfig.viewerCertificate.minimumProtocolVersion.toString()) === -1) {
          // tslint:disable-next-line:max-line-length
          throw new Error(`${distributionConfig.viewerCertificate.minimumProtocolVersion} is not compabtible with sslMethod ${distributionConfig.viewerCertificate.sslSupportMethod}.\n\tValid Protocols are: ${validProtocols.join(", ")}`);
        }
      }
    } else {
      distributionConfig.viewerCertificate = {
        cloudFrontDefaultCertificate: true
      };
    }

    if (props.loggingConfig) {
      this.loggingBucket = props.loggingConfig.bucket || new s3.Bucket(this, `LoggingBucket`);
      distributionConfig.logging = {
        bucket: this.loggingBucket.domainName,
        includeCookies: props.loggingConfig.includeCookies || false,
        prefix: props.loggingConfig.prefix
      };
    }

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig });
    this.domainName = distribution.distributionDomainName;
    this.distributionId = distribution.distributionId;
  }

  public asAliasRecordTarget(): route53.AliasRecordTargetProps {
    return {
      hostedZoneId: this.aliasHostedZoneId,
      dnsName: this.domainName
    };
  }

  private toBehavior(input: BehaviorWithOrigin, protoPolicy?: ViewerProtocolPolicy) {
    let toReturn = {
      allowedMethods: this.METHOD_LOOKUP_MAP[input.allowedMethods || CloudFrontAllowedMethods.GET_HEAD],
      cachedMethods: this.METHOD_LOOKUP_MAP[input.cachedMethods || CloudFrontAllowedCachedMethods.GET_HEAD],
      compress: input.compress,
      defaultTtl: input.defaultTtlSeconds,
      forwardedValues: input.forwardedValues || { queryString: false, cookies: { forward: "none" } },
      maxTtl: input.maxTtlSeconds,
      minTtl: input.minTtlSeconds,
      trustedSigners: input.trustedSigners,
      targetOriginId: input.targetOriginId,
      viewerProtocolPolicy: protoPolicy || ViewerProtocolPolicy.RedirectToHTTPS,
    };
    if (!input.isDefaultBehavior) {
      toReturn = Object.assign(toReturn, { pathPattern: input.pathPattern });
    }
    return toReturn;
  }
}
