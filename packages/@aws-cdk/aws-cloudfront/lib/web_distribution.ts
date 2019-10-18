import certificatemanager = require('@aws-cdk/aws-certificatemanager');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { CfnDistribution } from './cloudfront.generated';
import { IDistribution } from './distribution';

export enum HttpVersion {
  HTTP1_1 = "http1.1",
  HTTP2 = "http2"
}

/**
 * The price class determines how many edge locations CloudFront will use for your distribution.
 */
export enum PriceClass {
  PRICE_CLASS_100 = "PriceClass_100",
  PRICE_CLASS_200 = "PriceClass_200",
  PRICE_CLASS_ALL = "PriceClass_All"
}

/**
 * How HTTPs should be handled with your distribution.
 */
export enum ViewerProtocolPolicy {
  HTTPS_ONLY = "https-only",
  REDIRECT_TO_HTTPS = "redirect-to-https",
  ALLOW_ALL = "allow-all"
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
   * @default SSLMethod.SNI
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_ViewerCertificate.html
   */
  readonly sslMethod?: SSLMethod;

  /**
   * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
   *
   * CloudFront serves your objects only to browsers or devices that support at
   * least the SSL version that you specify.
   *
   * @default - SSLv3 if sslMethod VIP, TLSv1 if sslMethod SNI
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
  SSL_V3 = "SSLv3",
  TLS_V1 = "TLSv1",
  TLS_V1_2016 = "TLSv1_2016",
  TLS_V1_1_2016 = "TLSv1.1_2016",
  TLS_V1_2_2018 = "TLSv1.2_2018"
}

/**
 * Logging configuration for incoming requests
 */
export interface LoggingConfiguration {
  /**
   * Bucket to log requests to
   *
   * @default - A logging bucket is automatically created.
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
   * @default - No prefix.
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
   * @default - No additional headers are passed.
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
   * @default Duration.seconds(5)
   */
  readonly originKeepaliveTimeout?: cdk.Duration,

  /**
   * The protocol (http or https) policy to use when interacting with the origin.
   *
   * @default OriginProtocolPolicy.HttpsOnly
   */
  readonly originProtocolPolicy?: OriginProtocolPolicy,

  /**
   * The read timeout when calling the origin in seconds
   *
   * @default Duration.seconds(30)
   */
  readonly originReadTimeout?: cdk.Duration

  /**
   * The SSL versions to use when interacting with the origin.
   *
   * @default OriginSslPolicy.TLSv1_2
   */
  readonly allowedOriginSSLVersions?: OriginSslPolicy[];

}

export enum OriginSslPolicy {
  SSL_V3 = "SSLv3",
  TLS_V1 = "TLSv1",
  TLS_V1_1 = "TLSv1.1",
  TLS_V1_2 = "TLSv1.2",
}

export enum OriginProtocolPolicy {
  HTTP_ONLY = "http-only",
  MATCH_VIEWER = "match-viewer",
  HTTPS_ONLY = "https-only",
}

export interface S3OriginConfig {
  /**
   * The source bucket to serve content from
   */
  readonly s3BucketSource: s3.IBucket;

  /**
   * The optional ID of the origin identity cloudfront will use when calling your s3 bucket.
   */
  readonly originAccessIdentityId?: string;
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
  readonly compress?: boolean;

  /**
   * If this behavior is the default behavior for the distribution.
   *
   * You must specify exactly one default distribution per CloudFront distribution.
   * The default behavior is allowed to omit the "path" property.
   */
  readonly isDefaultBehavior?: boolean;

  /**
   * Trusted signers is how CloudFront allows you to serve private content.
   * The signers are the account IDs that are allowed to sign cookies/presigned URLs for this distribution.
   *
   * If you pass a non empty value, all requests for this behavior must be signed (no public access will be allowed)
   */
  readonly trustedSigners?: string[];

  /**
   *
   * The default amount of time CloudFront will cache an object.
   *
   * This value applies only when your custom origin does not add HTTP headers,
   * such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects.
   * @default 86400 (1 day)
   *
   */
  readonly defaultTtl?: cdk.Duration;

  /**
   * The method this CloudFront distribution responds do.
   *
   * @default GET_HEAD
   */
  readonly allowedMethods?: CloudFrontAllowedMethods;

  /**
   * The path this behavior responds to.
   * Required for all non-default behaviors. (The default behavior implicitly has "*" as the path pattern. )
   *
   */
  readonly pathPattern?: string;

  /**
   * Which methods are cached by CloudFront by default.
   *
   * @default GET_HEAD
   */
  readonly cachedMethods?: CloudFrontAllowedCachedMethods;

  /**
   * The values CloudFront will forward to the origin when making a request.
   *
   * @default none (no cookies - no headers)
   *
   */
  readonly forwardedValues?: CfnDistribution.ForwardedValuesProperty;

  /**
   * The minimum amount of time that you want objects to stay in the cache
   * before CloudFront queries your origin.
   */
  readonly minTtl?: cdk.Duration;

  /**
   * The max amount of time you want objects to stay in the cache
   * before CloudFront queries your origin.
   *
   * @default Duration.seconds(31536000) (one year)
   */
  readonly maxTtl?: cdk.Duration;

  /**
   * Declares associated lambda@edge functions for this distribution behaviour.
   *
   * @default No lambda function associated
   */
  readonly lambdaFunctionAssociations?: LambdaFunctionAssociation[];

}

export interface LambdaFunctionAssociation {

  /**
   * The lambda event type defines at which event the lambda
   * is called during the request lifecycle
   */
  readonly eventType: LambdaEdgeEventType;

  /**
   * A version of the lambda to associate
   */
  readonly lambdaFunction: lambda.IVersion;
}

export enum LambdaEdgeEventType {
  /**
   * The origin-request specifies the request to the
   * origin location (e.g. S3)
   */
  ORIGIN_REQUEST = "origin-request",
  /**
   * The origin-response specifies the response from the
   * origin location (e.g. S3)
   */
  ORIGIN_RESPONSE = "origin-response",
  /**
   * The viewer-request specifies the incoming request
   */
  VIEWER_REQUEST = "viewer-request",
  /**
   * The viewer-response specifies the outgoing reponse
   */
  VIEWER_RESPONSE = "viewer-response",
}

interface ViewerCertificateBaseCertficateOptions {
  /**
   * How CloudFront should serve HTTPS requests.
   *
   * See the notes on SSLMethod if you wish to use other SSL termination types.
   *
   * @default SSLMethod.SNI
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_ViewerCertificate.html
   */
  readonly sslMethod?: SSLMethod;

  /**
   * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
   *
   * CloudFront serves your objects only to browsers or devices that support at
   * least the SSL version that you specify.
   *
   * @default - SSLv3 if sslMethod VIP, TLSv1 if sslMethod SNI
   */
  readonly securityPolicy?: SecurityPolicyProtocol;
}

export interface ViewerCertificateAcmCertficateOptions extends ViewerCertificateBaseCertficateOptions {
  /**
   * AWS Certificate Manager (ACM) certificate.
   *
   * Your certificate must be located in the us-east-1 (US East (N. Virginia)) region to be accessed by CloudFront
   */
  readonly certificate: certificatemanager.ICertificate;
}

export interface ViewerCertificateIamCertficateOptions extends ViewerCertificateBaseCertficateOptions {
  /**
   * Identifier of the IAM certificate.
   */
  readonly certificateId: string;
}

/**
 * Viewer certificate configuration class
 */
export class ViewerCertificate {
  /**
   * Generate an AWS Certificate Manager (ACM) viewer certificate configuration
   *
   * @param options ACM certificate configuration options
   * @param aliases Domain names on the certificate (both main domain name and Subject Alternative names)
   */
  public static acmCertificate(options: ViewerCertificateAcmCertficateOptions, ...aliases: string[]) {
    const {
       certificate,
       sslMethod: sslSupportMethod = SSLMethod.SNI,
       securityPolicy: minimumProtocolVersion
    } = options;

    const certificateRegion = certificatemanager.getCertificateRegion(certificate);

    if (certificateRegion && !cdk.Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
      throw new Error(`acmCertificate certficate must be in the us-east-1 region, got ${certificateRegion}`);
    }

    return new ViewerCertificate({
      acmCertificateArn: certificate.certificateArn, sslSupportMethod, minimumProtocolVersion
    }, aliases);
  }

  /**
   * Generate an IAM viewer certificate configuration
   *
   * @param options IAM certificate configuration options
   * @param aliases Domain names on the certificate (both main domain name and Subject Alternative names)
   */
  public static iamCertificate(options: ViewerCertificateIamCertficateOptions, ...aliases: string[]) {
    const {
      certificateId: iamCertificateId,
      sslMethod: sslSupportMethod = SSLMethod.SNI,
      securityPolicy: minimumProtocolVersion
    } = options;

    return new ViewerCertificate({
      iamCertificateId, sslSupportMethod, minimumProtocolVersion
    }, aliases);
  }

  /**
   * Generate a viewer certifcate configuration using
   * the CloudFront default certificate (e.g. d111111abcdef8.cloudfront.net)
   * and a {@link SecurityPolicyProtocol.TLS_V1} security policy.
   *
   * @param aliases Alternative CNAME aliases
   *                You also must create a CNAME record with your DNS service to route queries
   */
  public static cloudFrontDefaultCertificate(...aliases: string[]) {
    return new ViewerCertificate({ cloudFrontDefaultCertificate: true }, aliases);
  }

  private constructor(
    public readonly props: CfnDistribution.ViewerCertificateProperty,
    public readonly aliases: string[] = []) { }
}

export interface CloudFrontWebDistributionProps {

  /**
   * AliasConfiguration is used to configured CloudFront to respond to requests on custom domain names.
   *
   * @default - None.
   * @deprecated see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate}
   */
  readonly aliasConfiguration?: AliasConfiguration;

  /**
   * A comment for this distribution in the CloudFront console.
   *
   * @default - No comment is added to distribution.
   */
  readonly comment?: string;

  /**
   * The default object to serve.
   *
   * @default - "index.html" is served.
   */
  readonly defaultRootObject?: string;

  /**
   * If your distribution should have IPv6 enabled.
   *
   * @default true
   */
  readonly enableIpV6?: boolean;

  /**
   * The max supported HTTP Versions.
   *
   * @default HttpVersion.HTTP2
   */
  readonly httpVersion?: HttpVersion;

  /**
   * The price class for the distribution (this impacts how many locations CloudFront uses for your distribution, and billing)
   *
   * @default PriceClass.PriceClass100 the cheapest option for CloudFront is picked by default.
   */
  readonly priceClass?: PriceClass;

  /**
   * The default viewer policy for incoming clients.
   *
   * @default RedirectToHTTPs
   */
  readonly viewerProtocolPolicy?: ViewerProtocolPolicy;

  /**
   * The origin configurations for this distribution. Behaviors are a part of the origin.
   */
  readonly originConfigs: SourceConfiguration[];

  /**
   * Optional - if we should enable logging.
   * You can pass an empty object ({}) to have us auto create a bucket for logging.
   * Omission of this property indicates no logging is to be enabled.
   *
   * @default - no logging is enabled by default.
   */
  readonly loggingConfig?: LoggingConfiguration;

  /**
   * How CloudFront should handle requests that are not successful (eg PageNotFound)
   *
   * By default, CloudFront does not replace HTTP status codes in the 4xx and 5xx range
   * with custom error messages. CloudFront does not cache HTTP status codes.
   *
   * @default - No custom error configuration.
   */
  readonly errorConfigurations?: CfnDistribution.CustomErrorResponseProperty[];

  /**
   * Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.
   * @see https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
   *
   * @default - No AWS Web Application Firewall web access control list (web ACL).
   */
  readonly webACLId?: string;

  /**
   * Specifies whether you want viewers to use HTTP or HTTPS to request your objects,
   * whether you're using an alternate domain name with HTTPS, and if so,
   * if you're using AWS Certificate Manager (ACM) or a third-party certificate authority.
   *
   * @default ViewerCertificate.cloudFrontDefaultCertificate()
   *
   * @see https://aws.amazon.com/premiumsupport/knowledge-center/custom-ssl-certificate-cloudfront/
   */
  readonly viewerCertificate?: ViewerCertificate;
}

/**
 * Internal only - just adds the originId string to the Behavior
 */
interface BehaviorWithOrigin extends Behavior {
  readonly targetOriginId: string;
}

/**
 * Amazon CloudFront is a global content delivery network (CDN) service that securely delivers data, videos,
 * applications, and APIs to your viewers with low latency and high transfer speeds.
 * CloudFront fronts user provided content and caches it at edge locations across the world.
 *
 * Here's how you can use this construct:
 *
 * ```ts
 * import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'
 *
 * const sourceBucket = new Bucket(this, 'Bucket');
 *
 * const distribution = new CloudFrontWebDistribution(this, 'MyDistribution', {
 *  originConfigs: [
 *    {
 *      s3OriginSource: {
 *      s3BucketSource: sourceBucket
 *      },
 *      behaviors : [ {isDefaultBehavior: true}]
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
export class CloudFrontWebDistribution extends cdk.Construct implements IDistribution {
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
  private readonly VALID_SSL_PROTOCOLS: { [method in SSLMethod]: string[] } = {
    [SSLMethod.SNI]: [
      SecurityPolicyProtocol.TLS_V1, SecurityPolicyProtocol.TLS_V1_1_2016,
      SecurityPolicyProtocol.TLS_V1_2016, SecurityPolicyProtocol.TLS_V1_2_2018
    ],
    [SSLMethod.VIP]: [SecurityPolicyProtocol.SSL_V3, SecurityPolicyProtocol.TLS_V1],
  };

  constructor(scope: cdk.Construct, id: string, props: CloudFrontWebDistributionProps) {
    super(scope, id);

    let distributionConfig: CfnDistribution.DistributionConfigProperty = {
      comment: props.comment,
      enabled: true,
      defaultRootObject: props.defaultRootObject !== undefined ? props.defaultRootObject : "index.html",
      httpVersion: props.httpVersion || HttpVersion.HTTP2,
      priceClass: props.priceClass || PriceClass.PRICE_CLASS_100,
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
        domainName: originConfig.s3OriginSource
          ? originConfig.s3OriginSource.s3BucketSource.bucketRegionalDomainName
          : originConfig.customOriginSource!.domainName,
        originPath: originConfig.originPath,
        originCustomHeaders: originHeaders.length > 0 ? originHeaders : undefined,
        s3OriginConfig: originConfig.s3OriginSource && originConfig.s3OriginSource.originAccessIdentityId
          ? { originAccessIdentity: `origin-access-identity/cloudfront/${originConfig.s3OriginSource.originAccessIdentityId}` }
          : originConfig.s3OriginSource
          ? { }
          : undefined,
        customOriginConfig: originConfig.customOriginSource
          ? {
            httpPort: originConfig.customOriginSource.httpPort || 80,
            httpsPort: originConfig.customOriginSource.httpsPort || 443,
            originKeepaliveTimeout: originConfig.customOriginSource.originKeepaliveTimeout
              && originConfig.customOriginSource.originKeepaliveTimeout.toSeconds() || 5,
            originReadTimeout: originConfig.customOriginSource.originReadTimeout
              && originConfig.customOriginSource.originReadTimeout.toSeconds() || 30,
            originProtocolPolicy: originConfig.customOriginSource.originProtocolPolicy || OriginProtocolPolicy.HTTPS_ONLY,
            originSslProtocols: originConfig.customOriginSource.allowedOriginSSLVersions || [OriginSslPolicy.TLS_V1_2]
          }
          : undefined
      };

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
    distributionConfig = {
      ...distributionConfig,
      origins
    };

    const defaultBehaviors = behaviors.filter(behavior => behavior.isDefaultBehavior);
    if (defaultBehaviors.length !== 1) {
      throw new Error("There can only be one default behavior across all sources. [ One default behavior per distribution ].");
    }

    distributionConfig = { ...distributionConfig, defaultCacheBehavior: this.toBehavior(defaultBehaviors[0], props.viewerProtocolPolicy) };

    const otherBehaviors: CfnDistribution.CacheBehaviorProperty[] = [];
    for (const behavior of behaviors.filter(b => !b.isDefaultBehavior)) {
      if (!behavior.pathPattern) {
        throw new Error("pathPattern is required for all non-default behaviors");
      }
      otherBehaviors.push(this.toBehavior(behavior, props.viewerProtocolPolicy) as CfnDistribution.CacheBehaviorProperty);
    }

    distributionConfig = { ...distributionConfig, cacheBehaviors: otherBehaviors.length > 0 ? otherBehaviors : undefined };

    if (props.aliasConfiguration && props.viewerCertificate) {
      throw new Error([
        'You cannot set both aliasConfiguration and viewerCertificate properties.',
        'Please only use viewerCertificate, as aliasConfiguration is deprecated.'
      ].join(' '));
    }

    let _viewerCertificate = props.viewerCertificate;
    if (props.aliasConfiguration) {
      const {acmCertRef, securityPolicy, sslMethod, names} = props.aliasConfiguration;

      _viewerCertificate = ViewerCertificate.acmCertificate({
        certificate: certificatemanager.Certificate.fromCertificateArn(scope, 'AliasConfigurationCert', acmCertRef),
        securityPolicy,
        sslMethod
      }, ...names);
    }

    if (_viewerCertificate) {
      const {props: viewerCertificate, aliases} = _viewerCertificate;
      Object.assign(distributionConfig, {aliases, viewerCertificate});

      const {minimumProtocolVersion, sslSupportMethod} = viewerCertificate;

      if (minimumProtocolVersion != null && sslSupportMethod != null) {
        const validProtocols = this.VALID_SSL_PROTOCOLS[sslSupportMethod as SSLMethod];

        if (validProtocols.indexOf(minimumProtocolVersion.toString()) === -1) {
          // tslint:disable-next-line:max-line-length
          throw new Error(`${minimumProtocolVersion} is not compabtible with sslMethod ${sslSupportMethod}.\n\tValid Protocols are: ${validProtocols.join(", ")}`);
        }
      }
    } else {
      distributionConfig = { ...distributionConfig,
        viewerCertificate: { cloudFrontDefaultCertificate: true }
      };
    }

    if (props.loggingConfig) {
      this.loggingBucket = props.loggingConfig.bucket || new s3.Bucket(this, `LoggingBucket`);
      distributionConfig = {
        ...distributionConfig,
        logging: {
          bucket: this.loggingBucket.bucketRegionalDomainName,
          includeCookies: props.loggingConfig.includeCookies || false,
          prefix: props.loggingConfig.prefix
        }
      };
    }

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig });
    this.node.defaultChild = distribution;
    this.domainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;
  }

  private toBehavior(input: BehaviorWithOrigin, protoPolicy?: ViewerProtocolPolicy) {
    let toReturn = {
      allowedMethods: this.METHOD_LOOKUP_MAP[input.allowedMethods || CloudFrontAllowedMethods.GET_HEAD],
      cachedMethods: this.METHOD_LOOKUP_MAP[input.cachedMethods || CloudFrontAllowedCachedMethods.GET_HEAD],
      compress: input.compress !== false,
      defaultTtl: input.defaultTtl && input.defaultTtl.toSeconds(),
      forwardedValues: input.forwardedValues || { queryString: false, cookies: { forward: "none" } },
      maxTtl: input.maxTtl && input.maxTtl.toSeconds(),
      minTtl: input.minTtl && input.minTtl.toSeconds(),
      trustedSigners: input.trustedSigners,
      targetOriginId: input.targetOriginId,
      viewerProtocolPolicy: protoPolicy || ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    };
    if (!input.isDefaultBehavior) {
      toReturn = Object.assign(toReturn, { pathPattern: input.pathPattern });
    }
    if (input.lambdaFunctionAssociations) {
      toReturn = Object.assign(toReturn, {
        lambdaFunctionAssociations: input.lambdaFunctionAssociations
          .map(fna => ({
            eventType: fna.eventType,
            lambdaFunctionArn: fna.lambdaFunction && fna.lambdaFunction.functionArn,
          }))
      });
    }
    return toReturn;
  }
}
