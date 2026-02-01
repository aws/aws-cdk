import { Construct } from 'constructs';
import { ICachePolicy } from './cache-policy';
import { CfnDistribution, CfnMonitoringSubscription } from './cloudfront.generated';
import { HttpVersion, ViewerProtocolPolicy, SSLMethod, SecurityPolicyProtocol, AllowedMethods, CachedMethods, ErrorResponse, EdgeLambda, TenantConfigProps } from './distribution';
import { FunctionAssociation } from './function';
import { GeoRestriction } from './geo-restriction';
import { IKeyGroup } from './key-group';
import { IOrigin, OriginBindConfig, OriginBindOptions, OriginSelectionCriteria } from './origin';
import { IOriginRequestPolicy } from './origin-request-policy';
import { CacheBehavior } from './private/cache-behavior';
import { formatDistributionArn, grant } from './private/utils';
import { IRealtimeLogConfig } from './realtime-log-config';
import { IResponseHeadersPolicy } from './response-headers-policy';
import * as acm from '../../aws-certificatemanager';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token, Names, FeatureFlags, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 } from '../../cx-api';
/**
 * Interface for CloudFront Multi-Tenant Distributions
 */
export interface IMTDistribution extends IResource {
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

  /**
   * The distribution ARN for this distribution.
   *
   * @attribute
   */
  readonly distributionArn: string;

  /**
   * Adds an IAM policy statement associated with this distribution to an IAM
   * principal's policy.
   *
   * @param identity The principal
   * @param actions The set of actions to allow (i.e. "cloudfront:ListInvalidations")
   */
  grant(identity: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant to create invalidations for this bucket to an IAM principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantCreateInvalidation(identity: iam.IGrantable): iam.Grant;
}

/**
 * Attributes used to import a Multi-Tenant Distribution.
 */
export interface MTDistributionAttributes {
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

interface BoundOrigin extends OriginBindOptions, OriginBindConfig {
  readonly origin: IOrigin;
  readonly originGroupId?: string;
}

/**
 * Properties for a Multi-tenant Distribution
 */
export interface MTDistributionProps {
  /**
   * The default behavior for the distribution.
   */
  readonly defaultBehavior: MTDBehaviorOptions;

  /**
   * Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.
   *
   * @default - no additional behaviors are added.
   */
  readonly additionalBehaviors?: Record<string, MTDBehaviorOptions>;

  /**
   * A certificate to associate with the distribution. The certificate must be located in N. Virginia (us-east-1).
   *
   * @default - the CloudFront wildcard certificate (*.cloudfront.net) will be used.
   */
  readonly certificate?: acm.ICertificate;

  /**
   * Any comments you want to include about the distribution.
   *
   * @default - no comment
   */
  readonly comment?: string;

  /**
   * The object that you want CloudFront to request from your origin (for example, index.html)
   * when a viewer requests the root URL for your distribution. If no default object is set, the
   * request goes to the origin's root (e.g., example.com/).
   *
   * @default - no default root object
   */
  readonly defaultRootObject?: string;

  /**
   * Enable or disable the distribution.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Enable access logging for the distribution.
   *
   * @default - false, unless `logBucket` is specified.
   */
  readonly enableLogging?: boolean;

  /**
   * Controls the countries in which your content is distributed.
   *
   * @default - No geographic restrictions
   */
  readonly geoRestriction?: GeoRestriction;

  /**
   * Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.
   *
   * For viewers and CloudFront to use HTTP/2, viewers must support TLS 1.2 or later, and must support server name identification (SNI).
   *
   * @default HttpVersion.HTTP2
   */
  readonly httpVersion?: HttpVersion;

  /**
   * The Amazon S3 bucket to store the access logs in.
   * Make sure to set `objectOwnership` to `s3.ObjectOwnership.OBJECT_WRITER` in your custom bucket.
   *
   * @default - A bucket is created if `enableLogging` is true
   */
  readonly logBucket?: s3.IBucket;

  /**
   * Specifies whether you want CloudFront to include cookies in access logs
   *
   * @default false
   */
  readonly logIncludesCookies?: boolean;

  /**
   * An optional string that you want CloudFront to prefix to the access log filenames for this distribution.
   *
   * @default - no prefix
   */
  readonly logFilePrefix?: string;

  /**
   * Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.
   *
   * To specify a web ACL created using the latest version of AWS WAF, use the ACL ARN, for example
   * `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a`.
   * To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a`.
   *
   * @see https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.
   *
   * @default - No AWS Web Application Firewall web access control list (web ACL).
   */
  readonly webAclId?: string;

  /**
   * How CloudFront should handle requests that are not successful (e.g., PageNotFound).
   *
   * @default - No custom error responses.
   */
  readonly errorResponses?: ErrorResponse[];

  /**
   * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
   *
   * CloudFront serves your objects only to browsers or devices that support at
   * least the SSL version that you specify.
   *
   * @default - SecurityPolicyProtocol.TLS_V1_2_2021 if the '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021' feature flag is set; otherwise, SecurityPolicyProtocol.TLS_V1_2_2019.
   */
  readonly minimumProtocolVersion?: SecurityPolicyProtocol;

  /**
   * The SSL method CloudFront will use for your distribution.
   *
   * Server Name Indication (SNI) - is an extension to the TLS computer networking protocol by which a client indicates
   * which hostname it is attempting to connect to at the start of the handshaking process. This allows a server to present
   * multiple certificates on the same IP address and TCP port number and hence allows multiple secure (HTTPS) websites
   * (or any other service over TLS) to be served by the same IP address without requiring all those sites to use the same certificate.
   *
   * CloudFront can use SNI to host multiple distributions on the same IP - which a large majority of clients will support.
   *
   * If your clients cannot support SNI however - CloudFront can use dedicated IPs for your distribution - but there is a prorated monthly charge for
   * using this feature. By default, we use SNI - but you can optionally enable dedicated IPs (VIP).
   *
   * See the CloudFront SSL for more details about pricing : https://aws.amazon.com/cloudfront/custom-ssl-domains/
   *
   * @default SSLMethod.SNI
   */
  readonly sslSupportMethod?: SSLMethod;

  /**
   * Whether to enable additional CloudWatch metrics.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html
   *
   * @default false
   */
  readonly publishAdditionalMetrics?: boolean;

  /**
   * Configuration for a distribution tenant.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-cloudfront-distribution-tenantconfig.html
   *
   * @default - No special tenant configurations (undefined).
   */
  readonly tenantConfig?: TenantConfigProps;
}

/**
 * A CloudFront distribution with associated origin(s) and caching behavior(s).
 * @resource AWS::CloudFront::Distribution
 */
@propertyInjectable
export class MTDistribution extends Resource implements IMTDistribution {
  /**
   * Uniquely identifies this class.
   * UPDATE WITH PROPER LINK
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudfront.Distribution';

  /**
   * Creates a Distribution construct that represents an external (imported) distribution.
   */
  public static fromMTDistributionAttributes(scope: Construct, id: string, attrs: MTDistributionAttributes): IMTDistribution {
    return new class extends Resource implements IMTDistribution {
      public readonly domainName: string;
      public readonly distributionDomainName: string;
      public readonly distributionId: string;

      constructor() {
        super(scope, id);
        this.domainName = attrs.domainName;
        this.distributionDomainName = attrs.domainName;
        this.distributionId = attrs.distributionId;
      }

      public get distributionArn(): string {
        return formatDistributionArn(this);
      }
      public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
        return grant(this, grantee, ...actions);
      }
      public grantCreateInvalidation(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, 'cloudfront:CreateInvalidation');
      }
    }();
  }

  public readonly domainName: string;
  public readonly distributionDomainName: string;
  public readonly distributionId: string;

  private readonly httpVersion: HttpVersion;
  private readonly defaultBehavior: CacheBehavior;
  private readonly additionalBehaviors: CacheBehavior[] = [];
  private readonly boundOrigins: BoundOrigin[] = [];
  private readonly originGroups: CfnDistribution.OriginGroupProperty[] = [];

  private readonly errorResponses: ErrorResponse[];
  private readonly certificate?: acm.ICertificate;
  private readonly publishAdditionalMetrics?: boolean;
  private webAclId?: string;

  constructor(scope: Construct, id: string, props: MTDistributionProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.certificate) {
      const certificateRegion = Stack.of(this).splitArn(props.certificate.certificateArn, ArnFormat.SLASH_RESOURCE_NAME).region;
      if (!Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
        throw new ValidationError(`Distribution certificates must be in the us-east-1 region and the certificate you provided is in ${certificateRegion}.`, this);
      }
    }

    this.httpVersion = props.httpVersion ?? HttpVersion.HTTP2;
    this.validateGrpc(props.defaultBehavior);

    const originId = this.addOrigin(props.defaultBehavior.origin);
    this.defaultBehavior = new CacheBehavior(originId, { pathPattern: '*', ...props.defaultBehavior });
    if (props.additionalBehaviors) {
      Object.entries(props.additionalBehaviors).forEach(([pathPattern, behaviorOptions]) => {
        this.addBehavior(pathPattern, behaviorOptions.origin, behaviorOptions);
      });
    }

    if (props.webAclId) {
      this.validateWebAclId(props.webAclId);
      this.webAclId = props.webAclId;
    }

    this.certificate = props.certificate;
    this.errorResponses = props.errorResponses ?? [];
    this.publishAdditionalMetrics = props.publishAdditionalMetrics;

    // Comments have an undocumented limit of 128 characters
    const trimmedComment =
      props.comment && props.comment.length > 128
        ? `${props.comment.slice(0, 128 - 3)}...`
        : props.comment;

    this.validateSslMethod(props.sslSupportMethod);

    const distribution = new CfnDistribution(this, 'Resource', {
      distributionConfig: {
        enabled: props.enabled ?? true,
        origins: Lazy.any({ produce: () => this.renderOrigins() }),
        originGroups: Lazy.any({ produce: () => this.renderOriginGroups() }),
        defaultCacheBehavior: this.defaultBehavior._renderBehavior(),
        cacheBehaviors: Lazy.any({ produce: () => this.renderCacheBehaviors() }),
        comment: trimmedComment,
        customErrorResponses: this.renderErrorResponses(),
        defaultRootObject: props.defaultRootObject,
        httpVersion: this.httpVersion,
        ipv6Enabled: undefined,
        logging: this.renderLogging(props),
        restrictions: this.renderRestrictions(props.geoRestriction),
        viewerCertificate: this.certificate ? this.renderViewerCertificate(this.certificate,
          props.minimumProtocolVersion, props.sslSupportMethod) : undefined,
        webAclId: Lazy.string({ produce: () => this.webAclId }),
        connectionMode: 'tenant-only',
        tenantConfig: props.tenantConfig ?? undefined,
      },
    });

    this.domainName = distribution.attrDomainName;
    this.distributionDomainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;

    if (props.publishAdditionalMetrics) {
      new CfnMonitoringSubscription(this, 'MonitoringSubscription', {
        distributionId: this.distributionId,
        monitoringSubscription: {
          realtimeMetricsSubscriptionConfig: {
            realtimeMetricsSubscriptionStatus: 'Enabled',
          },
        },
      });
    }
  }

  public get distributionArn(): string {
    return formatDistributionArn(this);
  }

  /**
   * Return the given named metric for this Distribution
   */
  @MethodMetadata()
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/CloudFront',
      metricName,
      dimensionsMap: { DistributionId: this.distributionId },
      ...props,
    });
  }

  /**
   * Metric for the total number of viewer requests received by CloudFront, for all HTTP methods and for both HTTP and HTTPS requests.
   *
   * @default - sum over 5 minutes
   */
  @MethodMetadata()
  public metricRequests(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('Requests', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the total number of bytes that viewers uploaded to your origin with CloudFront, using POST and PUT requests.
   *
   * @default - sum over 5 minutes
   */
  @MethodMetadata()
  public metricBytesUploaded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('BytesUploaded', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the total number of bytes downloaded by viewers for GET, HEAD, and OPTIONS requests.
   *
   * @default - sum over 5 minutes
   */
  @MethodMetadata()
  public metricBytesDownloaded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('BytesDownloaded', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 4xx or 5xx.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metricTotalErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('TotalErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 4xx.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric4xxErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('4xxErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 5xx.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric5xxErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('5xxErrorRate', props);
  }

  /**
   * Metric for the total time spent from when CloudFront receives a request to when it starts providing a response to the network (not the viewer),
   * for requests that are served from the origin, not the CloudFront cache.
   *
   * This is also known as first byte latency, or time-to-first-byte.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metricOriginLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('Origin latency metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('OriginLatency', props);
  }

  /**
   * Metric for the percentage of all cacheable requests for which CloudFront served the content from its cache.
   *
   * HTTP POST and PUT requests, and errors, are not considered cacheable requests.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metricCacheHitRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('Cache hit rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('CacheHitRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 401.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric401ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('401 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('401ErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 403.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric403ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('403 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('403ErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 404.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric404ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('404 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('404ErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 502.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric502ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('502 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('502ErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 503.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric503ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('503 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('503ErrorRate', props);
  }

  /**
   * Metric for the percentage of all viewer requests for which the response's HTTP status code is 504.
   *
   * To obtain this metric, you need to set `publishAdditionalMetrics` to `true`.
   *
   * @default - average over 5 minutes
   */
  @MethodMetadata()
  public metric504ErrorRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (this.publishAdditionalMetrics !== true) {
      throw new ValidationError('504 error rate metric is only available if \'publishAdditionalMetrics\' is set \'true\'', this);
    }
    return this.metric('504ErrorRate', props);
  }

  /**
   * Adds a new behavior to this distribution for the given pathPattern.
   *
   * @param pathPattern the path pattern (e.g., 'images/*') that specifies which requests to apply the behavior to.
   * @param origin the origin to use for this behavior
   * @param behaviorOptions the options for the behavior at this path.
   */
  @MethodMetadata()
  public addBehavior(pathPattern: string, origin: IOrigin, behaviorOptions: MTDAddBehaviorOptions = {}) {
    if (pathPattern === '*') {
      throw new ValidationError('Only the default behavior can have a path pattern of \'*\'', this);
    }
    this.validateGrpc(behaviorOptions);
    const originId = this.addOrigin(origin);
    this.additionalBehaviors.push(new CacheBehavior(originId, { pathPattern, ...behaviorOptions }));
  }

  /**
   * Adds an IAM policy statement associated with this distribution to an IAM
   * principal's policy.
   *
   * @param identity The principal
   * @param actions The set of actions to allow (i.e. "cloudfront:ListInvalidations")
   */
  @MethodMetadata()
  public grant(identity: iam.IGrantable, ...actions: string[]): iam.Grant {
    return grant(this, identity, ...actions);
  }

  /**
   * Grant to create invalidations for this bucket to an IAM principal (Role/Group/User).
   *
   * @param identity The principal
   */
  @MethodMetadata()
  public grantCreateInvalidation(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, 'cloudfront:CreateInvalidation');
  }

  /**
   * Attach WAF WebACL to this CloudFront distribution
   *
   * WebACL must be in the us-east-1 region
   *
   * @param webAclId The WAF WebACL to associate with this distribution
   */
  @MethodMetadata()
  public attachWebAclId(webAclId: string) {
    if (this.webAclId) {
      throw new ValidationError('A WebACL has already been attached to this distribution', this);
    }
    this.validateWebAclId(webAclId);
    this.webAclId = webAclId;
  }

  private validateWebAclId(webAclId: string) {
    if (Token.isUnresolved(webAclId)) {
      // Cannot validate unresolved tokens or non-string values at synth-time.
      return;
    }
    if (webAclId.startsWith('arn:')) {
      const webAclRegion = Stack.of(this).splitArn(webAclId, ArnFormat.SLASH_RESOURCE_NAME).region;
      if (!Token.isUnresolved(webAclRegion) && webAclRegion !== 'us-east-1') {
        throw new ValidationError(`WebACL for CloudFront distributions must be created in the us-east-1 region; received ${webAclRegion}`, this);
      }
    } else {
      // WAF V2 Ids will always start with "arn:aws:wafv2:" unlike WAF Classic Ids
      throw new ValidationError('Invalid ACL ID, please verify your web ACL is supported by multi-tenant distributions', this);
    }
  }

  private addOrigin(origin: IOrigin, isFailoverOrigin: boolean = false): string {
    const ORIGIN_ID_MAX_LENGTH = 128;

    const existingOrigin = this.boundOrigins.find(boundOrigin => boundOrigin.origin === origin);
    if (existingOrigin) {
      return existingOrigin.originGroupId ?? existingOrigin.originId;
    } else {
      const originIndex = this.boundOrigins.length + 1;
      const scope = new Construct(this, `Origin${originIndex}`);
      const generatedId = Names.uniqueId(scope).slice(-ORIGIN_ID_MAX_LENGTH);
      const distributionId = this.distributionId;
      const originBindConfig = origin.bind(scope, { originId: generatedId, distributionId: Lazy.string({ produce: () => this.distributionId }) });
      const originId = originBindConfig.originProperty?.id ?? generatedId;
      const duplicateId = this.boundOrigins.find(boundOrigin => boundOrigin.originProperty?.id === originBindConfig.originProperty?.id);
      if (duplicateId) {
        throw new ValidationError(`Origin with id ${duplicateId.originProperty?.id} already exists. OriginIds must be unique within a distribution`, this);
      }
      if (!originBindConfig.failoverConfig) {
        this.boundOrigins.push({ origin, originId, distributionId, ...originBindConfig });
      } else {
        if (isFailoverOrigin) {
          throw new ValidationError('An Origin cannot use an Origin with its own failover configuration as its fallback origin!', this);
        }
        const groupIndex = this.originGroups.length + 1;
        const originGroupId = Names.uniqueId(new Construct(this, `OriginGroup${groupIndex}`)).slice(-ORIGIN_ID_MAX_LENGTH);
        this.boundOrigins.push({ origin, originId, distributionId, originGroupId, ...originBindConfig });

        const failoverOriginId = this.addOrigin(originBindConfig.failoverConfig.failoverOrigin, true);
        this.addOriginGroup(
          originGroupId,
          originBindConfig.failoverConfig.statusCodes,
          originId,
          failoverOriginId,
          originBindConfig.selectionCriteria,
        );
        return originGroupId;
      }
      return originBindConfig.originProperty?.id ?? originId;
    }
  }

  private addOriginGroup(
    originGroupId: string,
    statusCodes: number[] | undefined,
    originId: string,
    failoverOriginId: string,
    selectionCriteria: OriginSelectionCriteria | undefined,
  ): void {
    statusCodes = statusCodes ?? [500, 502, 503, 504];
    if (statusCodes.length === 0) {
      throw new ValidationError('fallbackStatusCodes cannot be empty', this);
    }
    this.originGroups.push({
      failoverCriteria: {
        statusCodes: {
          items: statusCodes,
          quantity: statusCodes.length,
        },
      },
      id: originGroupId,
      members: {
        items: [
          { originId },
          { originId: failoverOriginId },
        ],
        quantity: 2,
      },
      selectionCriteria,
    });
  }

  private renderOrigins(): CfnDistribution.OriginProperty[] {
    const renderedOrigins: CfnDistribution.OriginProperty[] = [];
    this.boundOrigins.forEach(boundOrigin => {
      if (boundOrigin.originProperty) {
        renderedOrigins.push(boundOrigin.originProperty);
      }
    });
    return renderedOrigins;
  }

  private renderOriginGroups(): CfnDistribution.OriginGroupsProperty | undefined {
    return this.originGroups.length === 0
      ? undefined
      : {
        items: this.originGroups,
        quantity: this.originGroups.length,
      };
  }

  private renderCacheBehaviors(): CfnDistribution.CacheBehaviorProperty[] | undefined {
    if (this.additionalBehaviors.length === 0) { return undefined; }
    return this.additionalBehaviors.map(behavior => behavior._renderBehavior());
  }

  private renderErrorResponses(): CfnDistribution.CustomErrorResponseProperty[] | undefined {
    if (this.errorResponses.length === 0) { return undefined; }

    return this.errorResponses.map(errorConfig => {
      if (!errorConfig.responseHttpStatus && !errorConfig.ttl && !errorConfig.responsePagePath) {
        throw new ValidationError('A custom error response without either a \'responseHttpStatus\', \'ttl\' or \'responsePagePath\' is not valid.', this);
      }

      return {
        errorCachingMinTtl: errorConfig.ttl?.toSeconds(),
        errorCode: errorConfig.httpStatus,
        responseCode: errorConfig.responsePagePath
          ? errorConfig.responseHttpStatus ?? errorConfig.httpStatus
          : errorConfig.responseHttpStatus,
        responsePagePath: errorConfig.responsePagePath,
      };
    });
  }

  private renderLogging(props: MTDistributionProps): CfnDistribution.LoggingProperty | undefined {
    if (!props.enableLogging && !props.logBucket) { return undefined; }
    if (props.enableLogging === false && props.logBucket) {
      throw new ValidationError('Explicitly disabled logging but provided a logging bucket.', this);
    }

    const bucket = props.logBucket ?? new s3.Bucket(this, 'LoggingBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      // We need set objectOwnership to OBJECT_WRITER to enable ACL, which is disabled by default.
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
    });
    return {
      bucket: bucket.bucketRegionalDomainName,
      includeCookies: props.logIncludesCookies,
      prefix: props.logFilePrefix,
    };
  }

  private renderRestrictions(geoRestriction?: GeoRestriction) {
    return geoRestriction ? {
      geoRestriction: {
        restrictionType: geoRestriction.restrictionType,
        locations: geoRestriction.locations,
      },
    } : undefined;
  }

  private renderViewerCertificate(certificate: acm.ICertificate,
    minimumProtocolVersionProp?: SecurityPolicyProtocol, sslSupportMethodProp?: SSLMethod): CfnDistribution.ViewerCertificateProperty {
    const defaultVersion = FeatureFlags.of(this).isEnabled(CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021)
      ? SecurityPolicyProtocol.TLS_V1_2_2021 : SecurityPolicyProtocol.TLS_V1_2_2019;
    const minimumProtocolVersion = minimumProtocolVersionProp ?? defaultVersion;
    const sslSupportMethod = sslSupportMethodProp ?? SSLMethod.SNI;

    return {
      acmCertificateArn: certificate.certificateArn,
      minimumProtocolVersion: minimumProtocolVersion,
      sslSupportMethod: sslSupportMethod,
    };
  }

  private validateGrpc(behaviorOptions: MTDAddBehaviorOptions) {
    if (!behaviorOptions.enableGrpc) {
      return;
    }
    const validHttpVersions = [HttpVersion.HTTP2, HttpVersion.HTTP2_AND_3];
    if (!validHttpVersions.includes(this.httpVersion)) {
      throw new ValidationError(`'httpVersion' must be ${validHttpVersions.join(' or ')} if 'enableGrpc' in 'defaultBehavior' or 'additionalBehaviors' is true, got ${this.httpVersion}`, this);
    }
  }

  private validateSslMethod(sslMethod: SSLMethod | undefined) {
    if (sslMethod == SSLMethod.VIP) {
      throw new ValidationError( 'invalid SSL Method', this);
    }
  }
}

/**
 * Options for adding a new behavior to a Multi-Tenant Distribution.
 */
export interface MTDAddBehaviorOptions {
  /**
   * HTTP methods to allow for this behavior.
   *
   * @default AllowedMethods.ALLOW_GET_HEAD
   */
  readonly allowedMethods?: AllowedMethods;

  /**
   * HTTP methods to cache for this behavior.
   *
   * @default CachedMethods.CACHE_GET_HEAD
   */
  readonly cachedMethods?: CachedMethods;

  /**
   * The cache policy for this behavior. The cache policy determines what values are included in the cache key,
   * and the time-to-live (TTL) values for the cache.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html.
   * @default CachePolicy.CACHING_OPTIMIZED
   */
  readonly cachePolicy?: ICachePolicy;

  /**
   * Whether you want CloudFront to automatically compress certain files for this cache behavior.
   * See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html#compressed-content-cloudfront-file-types
   * for file types CloudFront will compress.
   *
   * @default true
   */
  readonly compress?: boolean;

  /**
   * The origin request policy for this behavior. The origin request policy determines which values (e.g., headers, cookies)
   * are included in requests that CloudFront sends to the origin.
   *
   * @default - none
   */
  readonly originRequestPolicy?: IOriginRequestPolicy;

  /**
   * The real-time log configuration to be attached to this cache behavior.
   *
   * @default - none
   */
  readonly realtimeLogConfig?: IRealtimeLogConfig;

  /**
   * The response headers policy for this behavior. The response headers policy determines which headers are included in responses
   *
   * @default - none
   */
  readonly responseHeadersPolicy?: IResponseHeadersPolicy;

  /**
   * The protocol that viewers can use to access the files controlled by this behavior.
   *
   * @default ViewerProtocolPolicy.ALLOW_ALL
   */
  readonly viewerProtocolPolicy?: ViewerProtocolPolicy;

  /**
   * The CloudFront functions to invoke before serving the contents.
   *
   * @default - no functions will be invoked
   */
  readonly functionAssociations?: FunctionAssociation[];

  /**
   * The Lambda@Edge functions to invoke before serving the contents.
   *
   * @default - no Lambda functions will be invoked
   * @see https://aws.amazon.com/lambda/edge
   */
  readonly edgeLambdas?: EdgeLambda[];

  /**
   * A list of Key Groups that CloudFront can use to validate signed URLs or signed cookies.
   *
   * @default - no KeyGroups are associated with cache behavior
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html
   */
  readonly trustedKeyGroups?: IKeyGroup[];

  /**
   * Enables your CloudFront distribution to receive gRPC requests and to proxy them directly to your origins.
   *
   * If the `enableGrpc` is set to true, the following restrictions apply:
   * - The `allowedMethods` property must be `AllowedMethods.ALLOW_ALL` to include POST method because gRPC only supports POST method.
   * - The `httpVersion` property must be `HttpVersion.HTTP2` or `HttpVersion.HTTP2_AND_3` because gRPC only supports versions including HTTP/2.
   * - The `edgeLambdas` property can't be specified because gRPC is not supported with Lambda@Edge.
   *
   * @default false
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-using-grpc.html
   */
  readonly enableGrpc?: boolean;
}

/**
 * Options for creating a new behavior.
 */
export interface MTDBehaviorOptions extends MTDAddBehaviorOptions {
  /**
   * The origin that you want CloudFront to route requests to when they match this behavior.
   */
  readonly origin: IOrigin;
}
