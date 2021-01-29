import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDistribution } from './cloudfront.generated';
import { HttpVersion, IDistribution, LambdaEdgeEventType, OriginProtocolPolicy, PriceClass, ViewerProtocolPolicy, SSLMethod, SecurityPolicyProtocol } from './distribution';
import { GeoRestriction } from './geo-restriction';
import { IOriginAccessIdentity } from './origin-access-identity';

/**
 * HTTP status code to failover to second origin
 */
export enum FailoverStatusCode {
  /**
   * Forbidden (403)
   */
  FORBIDDEN = 403,

  /**
   * Not found (404)
   */
  NOT_FOUND = 404,

  /**
   * Internal Server Error (500)
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * Bad Gateway (502)
   */
  BAD_GATEWAY = 502,

  /**
   * Service Unavailable (503)
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * Gateway Timeout (504)
   */
  GATEWAY_TIMEOUT = 504,
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

// Subset of SourceConfiguration for rendering properties internally
interface SourceConfigurationRender {
  readonly connectionAttempts?: number;
  readonly connectionTimeout?: cdk.Duration;
  readonly s3OriginSource?: S3OriginConfig;
  readonly customOriginSource?: CustomOriginConfig;
  readonly originPath?: string;
  readonly originHeaders?: { [key: string]: string };
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
   * The number of times that CloudFront attempts to connect to the origin.
   * You can specify 1, 2, or 3 as the number of attempts.
   *
   * @default 3
   */
  readonly connectionAttempts?: number;

  /**
   * The number of seconds that CloudFront waits when trying to establish a connection to the origin.
   * You can specify a number of seconds between 1 and 10 (inclusive).
   *
   * @default cdk.Duration.seconds(10)
   */
  readonly connectionTimeout?: cdk.Duration;

  /**
   * An s3 origin source - if you're using s3 for your assets
   */
  readonly s3OriginSource?: S3OriginConfig;

  /**
   * A custom origin source - for all non-s3 sources.
   */
  readonly customOriginSource?: CustomOriginConfig;

  /**
   * An s3 origin source for failover in case the s3OriginSource returns invalid status code
   *
   * @default - no failover configuration
   */
  readonly failoverS3OriginSource?: S3OriginConfig;

  /**
   * A custom origin source for failover in case the s3OriginSource returns invalid status code
   *
   * @default - no failover configuration
   */
  readonly failoverCustomOriginSource?: CustomOriginConfig;

  /**
   * HTTP status code to failover to second origin
   *
   * @default [500, 502, 503, 504]
   */
  readonly failoverCriteriaStatusCodes?: FailoverStatusCode[];

  /**
   * The behaviors associated with this source.
   * At least one (default) behavior must be included.
   */
  readonly behaviors: Behavior[];

  /**
   * The relative path to the origin root to use for sources.
   *
   * @default /
   * @deprecated Use originPath on s3OriginSource or customOriginSource
   */
  readonly originPath?: string;

  /**
   * Any additional headers to pass to the origin
   *
   * @default - No additional headers are passed.
   * @deprecated Use originHeaders on s3OriginSource or customOriginSource
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
   * @default OriginSslPolicy.TLS_V1_2
   */
  readonly allowedOriginSSLVersions?: OriginSslPolicy[];

  /**
   * The relative path to the origin root to use for sources.
   *
   * @default /
   */
  readonly originPath?: string;

  /**
   * Any additional headers to pass to the origin
   *
   * @default - No additional headers are passed.
   */
  readonly originHeaders?: { [key: string]: string };
}

export enum OriginSslPolicy {
  SSL_V3 = 'SSLv3',
  TLS_V1 = 'TLSv1',
  TLS_V1_1 = 'TLSv1.1',
  TLS_V1_2 = 'TLSv1.2',
}

/**
 * S3 origin configuration for CloudFront
 */
export interface S3OriginConfig {
  /**
   * The source bucket to serve content from
   */
  readonly s3BucketSource: s3.IBucket;

  /**
   * The optional Origin Access Identity of the origin identity cloudfront will use when calling your s3 bucket.
   *
   * @default No Origin Access Identity which requires the S3 bucket to be public accessible
   */
  readonly originAccessIdentity?: IOriginAccessIdentity;

  /**
   * The relative path to the origin root to use for sources.
   *
   * @default /
   */
  readonly originPath?: string;

  /**
   * Any additional headers to pass to the origin
   *
   * @default - No additional headers are passed.
   */
  readonly originHeaders?: { [key: string]: string };
}

/**
 * An enum for the supported methods to a CloudFront distribution.
 */
export enum CloudFrontAllowedMethods {
  GET_HEAD = 'GH',
  GET_HEAD_OPTIONS = 'GHO',
  ALL = 'ALL'
}

/**
 * Enums for the methods CloudFront can cache.
 */
export enum CloudFrontAllowedCachedMethods {
  GET_HEAD = 'GH',
  GET_HEAD_OPTIONS = 'GHO',
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

  /**
   * Allows a Lambda function to have read access to the body content.
   * Only valid for "request" event types (`ORIGIN_REQUEST` or `VIEWER_REQUEST`).
   * See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-include-body-access.html
   *
   * @default false
   */
  readonly includeBody?: boolean;
}

export interface ViewerCertificateOptions {
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

  /**
   * Domain names on the certificate (both main domain name and Subject Alternative names)
   */
  readonly aliases?: string[];
}

/**
 * Viewer certificate configuration class
 */
export class ViewerCertificate {
  /**
   * Generate an AWS Certificate Manager (ACM) viewer certificate configuration
   *
   * @param certificate AWS Certificate Manager (ACM) certificate.
   *                    Your certificate must be located in the us-east-1 (US East (N. Virginia)) region to be accessed by CloudFront
   * @param options certificate configuration options
   */
  public static fromAcmCertificate(certificate: certificatemanager.ICertificate, options: ViewerCertificateOptions = {}) {
    const {
      sslMethod: sslSupportMethod = SSLMethod.SNI,
      securityPolicy: minimumProtocolVersion,
      aliases,
    } = options;

    return new ViewerCertificate({
      acmCertificateArn: certificate.certificateArn, sslSupportMethod, minimumProtocolVersion,
    }, aliases);
  }

  /**
   * Generate an IAM viewer certificate configuration
   *
   * @param iamCertificateId Identifier of the IAM certificate
   * @param options certificate configuration options
   */
  public static fromIamCertificate(iamCertificateId: string, options: ViewerCertificateOptions = {}) {
    const {
      sslMethod: sslSupportMethod = SSLMethod.SNI,
      securityPolicy: minimumProtocolVersion,
      aliases,
    } = options;

    return new ViewerCertificate({
      iamCertificateId, sslSupportMethod, minimumProtocolVersion,
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
  public static fromCloudFrontDefaultCertificate(...aliases: string[]) {
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
   * @default PriceClass.PRICE_CLASS_100 the cheapest option for CloudFront is picked by default.
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
   *
   * To specify a web ACL created using the latest version of AWS WAF, use the ACL ARN, for example
   * `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a`.
   *
   * To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a`.
   *
   * @see https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.
   *
   * @default - No AWS Web Application Firewall web access control list (web ACL).
   */
  readonly webACLId?: string;

  /**
   * Specifies whether you want viewers to use HTTP or HTTPS to request your objects,
   * whether you're using an alternate domain name with HTTPS, and if so,
   * if you're using AWS Certificate Manager (ACM) or a third-party certificate authority.
   *
   * @default ViewerCertificate.fromCloudFrontDefaultCertificate()
   *
   * @see https://aws.amazon.com/premiumsupport/knowledge-center/custom-ssl-certificate-cloudfront/
   */
  readonly viewerCertificate?: ViewerCertificate;

  /**
   * Controls the countries in which your content is distributed.
   *
   * @default No geo restriction
   */
  readonly geoRestriction?: GeoRestriction;
}

/**
 * Internal only - just adds the originId string to the Behavior
 */
interface BehaviorWithOrigin extends Behavior {
  readonly targetOriginId: string;
}

/**
 * Attributes used to import a Distribution.
 */
export interface CloudFrontWebDistributionAttributes {
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
 * @resource AWS::CloudFront::Distribution
 */
export class CloudFrontWebDistribution extends cdk.Resource implements IDistribution {

  /**
   * Creates a construct that represents an external (imported) distribution.
   */
  public static fromDistributionAttributes(scope: Construct, id: string, attrs: CloudFrontWebDistributionAttributes): IDistribution {
    return new class extends cdk.Resource implements IDistribution {
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

  /**
   * The logging bucket for this CloudFront distribution.
   * If logging is not enabled for this distribution - this property will be undefined.
   */
  public readonly loggingBucket?: s3.IBucket;

  /**
   * The domain name created by CloudFront for this distribution.
   * If you are using aliases for your distribution, this is the domainName your DNS records should point to.
   * (In Route53, you could create an ALIAS record to this value, for example.)
   *
   * @deprecated - Use `distributionDomainName` instead.
   */
  public readonly domainName: string;

  /**
   * The domain name created by CloudFront for this distribution.
   * If you are using aliases for your distribution, this is the domainName your DNS records should point to.
   * (In Route53, you could create an ALIAS record to this value, for example.)
   */
  public readonly distributionDomainName: string;

  /**
   * The distribution ID for this distribution.
   */
  public readonly distributionId: string;

  /**
   * Maps our methods to the string arrays they are
   */
  private readonly METHOD_LOOKUP_MAP = {
    GH: ['GET', 'HEAD'],
    GHO: ['GET', 'HEAD', 'OPTIONS'],
    ALL: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
  };

  /**
   * Maps for which SecurityPolicyProtocol are available to which SSLMethods
   */
  private readonly VALID_SSL_PROTOCOLS: { [method in SSLMethod]: string[] } = {
    [SSLMethod.SNI]: [
      SecurityPolicyProtocol.TLS_V1, SecurityPolicyProtocol.TLS_V1_1_2016,
      SecurityPolicyProtocol.TLS_V1_2016, SecurityPolicyProtocol.TLS_V1_2_2018,
      SecurityPolicyProtocol.TLS_V1_2_2019,
    ],
    [SSLMethod.VIP]: [SecurityPolicyProtocol.SSL_V3, SecurityPolicyProtocol.TLS_V1],
  };

  constructor(scope: Construct, id: string, props: CloudFrontWebDistributionProps) {
    super(scope, id);

    let distributionConfig: CfnDistribution.DistributionConfigProperty = {
      comment: props.comment,
      enabled: true,
      defaultRootObject: props.defaultRootObject !== undefined ? props.defaultRootObject : 'index.html',
      httpVersion: props.httpVersion || HttpVersion.HTTP2,
      priceClass: props.priceClass || PriceClass.PRICE_CLASS_100,
      ipv6Enabled: (props.enableIpV6 !== undefined) ? props.enableIpV6 : true,
      // eslint-disable-next-line max-len
      customErrorResponses: props.errorConfigurations, // TODO: validation : https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customerrorresponse.html#cfn-cloudfront-distribution-customerrorresponse-errorcachingminttl
      webAclId: props.webACLId,
    };

    const behaviors: BehaviorWithOrigin[] = [];

    const origins: CfnDistribution.OriginProperty[] = [];

    const originGroups: CfnDistribution.OriginGroupProperty[] = [];

    let originIndex = 1;
    for (const originConfig of props.originConfigs) {
      let originId = `origin${originIndex}`;
      const originProperty = this.toOriginProperty(originConfig, originId);

      if (originConfig.failoverCustomOriginSource || originConfig.failoverS3OriginSource) {
        const originSecondaryId = `originSecondary${originIndex}`;
        const originSecondaryProperty = this.toOriginProperty(
          {
            s3OriginSource: originConfig.failoverS3OriginSource,
            customOriginSource: originConfig.failoverCustomOriginSource,
            originPath: originConfig.originPath,
            originHeaders: originConfig.originHeaders,
          },
          originSecondaryId,
        );
        const originGroupsId = `OriginGroup${originIndex}`;
        const failoverCodes = originConfig.failoverCriteriaStatusCodes ?? [500, 502, 503, 504];
        originGroups.push({
          id: originGroupsId,
          members: {
            items: [{ originId }, { originId: originSecondaryId }],
            quantity: 2,
          },
          failoverCriteria: {
            statusCodes: {
              items: failoverCodes,
              quantity: failoverCodes.length,
            },
          },
        });
        originId = originGroupsId;
        origins.push(originSecondaryProperty);
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
    const originGroupsDistConfig =
      originGroups.length > 0
        ? {
          items: originGroups,
          quantity: originGroups.length,
        }
        : undefined;
    distributionConfig = {
      ...distributionConfig,
      origins,
      originGroups: originGroupsDistConfig,
    };

    const defaultBehaviors = behaviors.filter(behavior => behavior.isDefaultBehavior);
    if (defaultBehaviors.length !== 1) {
      throw new Error('There can only be one default behavior across all sources. [ One default behavior per distribution ].');
    }

    distributionConfig = { ...distributionConfig, defaultCacheBehavior: this.toBehavior(defaultBehaviors[0], props.viewerProtocolPolicy) };

    const otherBehaviors: CfnDistribution.CacheBehaviorProperty[] = [];
    for (const behavior of behaviors.filter(b => !b.isDefaultBehavior)) {
      if (!behavior.pathPattern) {
        throw new Error('pathPattern is required for all non-default behaviors');
      }
      otherBehaviors.push(this.toBehavior(behavior, props.viewerProtocolPolicy) as CfnDistribution.CacheBehaviorProperty);
    }

    distributionConfig = { ...distributionConfig, cacheBehaviors: otherBehaviors.length > 0 ? otherBehaviors : undefined };

    if (props.aliasConfiguration && props.viewerCertificate) {
      throw new Error([
        'You cannot set both aliasConfiguration and viewerCertificate properties.',
        'Please only use viewerCertificate, as aliasConfiguration is deprecated.',
      ].join(' '));
    }

    let _viewerCertificate = props.viewerCertificate;
    if (props.aliasConfiguration) {
      const { acmCertRef, securityPolicy, sslMethod, names: aliases } = props.aliasConfiguration;

      _viewerCertificate = ViewerCertificate.fromAcmCertificate(
        certificatemanager.Certificate.fromCertificateArn(this, 'AliasConfigurationCert', acmCertRef),
        { securityPolicy, sslMethod, aliases },
      );
    }

    if (_viewerCertificate) {
      const { props: viewerCertificate, aliases } = _viewerCertificate;
      Object.assign(distributionConfig, { aliases, viewerCertificate });

      const { minimumProtocolVersion, sslSupportMethod } = viewerCertificate;

      if (minimumProtocolVersion != null && sslSupportMethod != null) {
        const validProtocols = this.VALID_SSL_PROTOCOLS[sslSupportMethod as SSLMethod];

        if (validProtocols.indexOf(minimumProtocolVersion.toString()) === -1) {
          // eslint-disable-next-line max-len
          throw new Error(`${minimumProtocolVersion} is not compabtible with sslMethod ${sslSupportMethod}.\n\tValid Protocols are: ${validProtocols.join(', ')}`);
        }
      }
    } else {
      distributionConfig = {
        ...distributionConfig,
        viewerCertificate: { cloudFrontDefaultCertificate: true },
      };
    }

    if (props.loggingConfig) {
      this.loggingBucket = props.loggingConfig.bucket || new s3.Bucket(this, 'LoggingBucket');
      distributionConfig = {
        ...distributionConfig,
        logging: {
          bucket: this.loggingBucket.bucketRegionalDomainName,
          includeCookies: props.loggingConfig.includeCookies || false,
          prefix: props.loggingConfig.prefix,
        },
      };
    }

    if (props.geoRestriction) {
      distributionConfig = {
        ...distributionConfig,
        restrictions: {
          geoRestriction: {
            restrictionType: props.geoRestriction.restrictionType,
            locations: props.geoRestriction.locations,
          },
        },
      };
    }

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig });
    this.node.defaultChild = distribution;
    this.domainName = distribution.attrDomainName;
    this.distributionDomainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;
  }

  private toBehavior(input: BehaviorWithOrigin, protoPolicy?: ViewerProtocolPolicy) {
    let toReturn = {
      allowedMethods: this.METHOD_LOOKUP_MAP[input.allowedMethods || CloudFrontAllowedMethods.GET_HEAD],
      cachedMethods: this.METHOD_LOOKUP_MAP[input.cachedMethods || CloudFrontAllowedCachedMethods.GET_HEAD],
      compress: input.compress !== false,
      defaultTtl: input.defaultTtl && input.defaultTtl.toSeconds(),
      forwardedValues: input.forwardedValues || { queryString: false, cookies: { forward: 'none' } },
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
      const includeBodyEventTypes = [LambdaEdgeEventType.ORIGIN_REQUEST, LambdaEdgeEventType.VIEWER_REQUEST];
      if (input.lambdaFunctionAssociations.some(fna => fna.includeBody && !includeBodyEventTypes.includes(fna.eventType))) {
        throw new Error('\'includeBody\' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types.');
      }

      toReturn = Object.assign(toReturn, {
        lambdaFunctionAssociations: input.lambdaFunctionAssociations
          .map(fna => ({
            eventType: fna.eventType,
            lambdaFunctionArn: fna.lambdaFunction && fna.lambdaFunction.edgeArn,
            includeBody: fna.includeBody,
          })),
      });

      // allow edgelambda.amazonaws.com to assume the functions' execution role.
      for (const a of input.lambdaFunctionAssociations) {
        if (a.lambdaFunction.role && a.lambdaFunction.role instanceof iam.Role && a.lambdaFunction.role.assumeRolePolicy) {
          a.lambdaFunction.role.assumeRolePolicy.addStatements(new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            principals: [new iam.ServicePrincipal('edgelambda.amazonaws.com')],
          }));
        }
      }
    }
    return toReturn;
  }

  private toOriginProperty(originConfig: SourceConfigurationRender, originId: string): CfnDistribution.OriginProperty {
    if (
      !originConfig.s3OriginSource &&
      !originConfig.customOriginSource
    ) {
      throw new Error(
        'There must be at least one origin source - either an s3OriginSource, a customOriginSource',
      );
    }
    if (originConfig.customOriginSource && originConfig.s3OriginSource) {
      throw new Error(
        'There cannot be both an s3OriginSource and a customOriginSource in the same SourceConfiguration.',
      );
    }

    if ([
      originConfig.originHeaders,
      originConfig.s3OriginSource?.originHeaders,
      originConfig.customOriginSource?.originHeaders,
    ].filter(x => x).length > 1) {
      throw new Error('Only one originHeaders field allowed across origin and failover origins');
    }

    if ([
      originConfig.originPath,
      originConfig.s3OriginSource?.originPath,
      originConfig.customOriginSource?.originPath,
    ].filter(x => x).length > 1) {
      throw new Error('Only one originPath field allowed across origin and failover origins');
    }

    const headers = originConfig.originHeaders ?? originConfig.s3OriginSource?.originHeaders ?? originConfig.customOriginSource?.originHeaders;

    const originHeaders: CfnDistribution.OriginCustomHeaderProperty[] = [];
    if (headers) {
      Object.keys(headers).forEach((key) => {
        const oHeader: CfnDistribution.OriginCustomHeaderProperty = {
          headerName: key,
          headerValue: headers[key],
        };
        originHeaders.push(oHeader);
      });
    }

    let s3OriginConfig: CfnDistribution.S3OriginConfigProperty | undefined;
    if (originConfig.s3OriginSource) {
      // first case for backwards compatibility
      if (originConfig.s3OriginSource.originAccessIdentity) {
        // grant CloudFront OriginAccessIdentity read access to S3 bucket
        originConfig.s3OriginSource.s3BucketSource.grantRead(
          originConfig.s3OriginSource.originAccessIdentity,
        );

        s3OriginConfig = {
          originAccessIdentity: `origin-access-identity/cloudfront/${originConfig.s3OriginSource.originAccessIdentity.originAccessIdentityName}`,
        };
      } else {
        s3OriginConfig = {};
      }
    }

    const connectionAttempts = originConfig.connectionAttempts ?? 3;
    if (connectionAttempts < 1 || 3 < connectionAttempts || !Number.isInteger(connectionAttempts)) {
      throw new Error('connectionAttempts: You can specify 1, 2, or 3 as the number of attempts.');
    }

    const connectionTimeout = (originConfig.connectionTimeout || cdk.Duration.seconds(10)).toSeconds();
    if (connectionTimeout < 1 || 10 < connectionTimeout || !Number.isInteger(connectionTimeout)) {
      throw new Error('connectionTimeout: You can specify a number of seconds between 1 and 10 (inclusive).');
    }

    const originProperty: CfnDistribution.OriginProperty = {
      id: originId,
      domainName: originConfig.s3OriginSource
        ? originConfig.s3OriginSource.s3BucketSource.bucketRegionalDomainName
        : originConfig.customOriginSource!.domainName,
      originPath: originConfig.originPath ?? originConfig.customOriginSource?.originPath ?? originConfig.s3OriginSource?.originPath,
      originCustomHeaders:
          originHeaders.length > 0 ? originHeaders : undefined,
      s3OriginConfig,
      customOriginConfig: originConfig.customOriginSource
        ? {
          httpPort: originConfig.customOriginSource.httpPort || 80,
          httpsPort: originConfig.customOriginSource.httpsPort || 443,
          originKeepaliveTimeout:
                (originConfig.customOriginSource.originKeepaliveTimeout &&
                  originConfig.customOriginSource.originKeepaliveTimeout.toSeconds()) ||
                5,
          originReadTimeout:
                (originConfig.customOriginSource.originReadTimeout &&
                  originConfig.customOriginSource.originReadTimeout.toSeconds()) ||
                30,
          originProtocolPolicy:
                originConfig.customOriginSource.originProtocolPolicy ||
                OriginProtocolPolicy.HTTPS_ONLY,
          originSslProtocols: originConfig.customOriginSource
            .allowedOriginSSLVersions || [OriginSslPolicy.TLS_V1_2],
        }
        : undefined,
      connectionAttempts,
      connectionTimeout,
    };

    return originProperty;
  }
}
