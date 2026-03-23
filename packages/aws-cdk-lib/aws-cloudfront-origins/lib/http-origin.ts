import { validateSecondsInRangeOrUndefined } from './private/utils';
import * as cloudfront from '../../aws-cloudfront';
import type * as cdk from '../../core';
import { UnscopedValidationError } from '../../core';

/**
 * Properties for an Origin backed by an S3 website-configured bucket, load balancer, or custom HTTP server.
 */
export interface HttpOriginProps extends cloudfront.OriginProps {
  /**
   * Specifies the protocol (HTTP or HTTPS) that CloudFront uses to connect to the origin.
   *
   * @default OriginProtocolPolicy.HTTPS_ONLY
   */
  readonly protocolPolicy?: cloudfront.OriginProtocolPolicy;

  /**
   * The SSL versions to use when interacting with the origin.
   *
   * @default OriginSslPolicy.TLS_V1_2
   */
  readonly originSslProtocols?: cloudfront.OriginSslPolicy[];

  /**
   * The HTTP port that CloudFront uses to connect to the origin.
   *
   * @default 80
   */
  readonly httpPort?: number;

  /**
   * The HTTPS port that CloudFront uses to connect to the origin.
   *
   * @default 443
   */
  readonly httpsPort?: number;

  /**
   * Specifies how long, in seconds, CloudFront waits for a response from the origin, also known as the origin response timeout.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(30)
   */
  readonly readTimeout?: cdk.Duration;

  /**
   * Specifies how long, in seconds, CloudFront persists its connection to the origin.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(5)
   */
  readonly keepaliveTimeout?: cdk.Duration;

  /**
   * Specifies which IP protocol CloudFront uses when connecting to your origin.
   *
   * If your origin uses both IPv4 and IPv6 protocols, you can choose dualstack to help optimize reliability.
   *
   * @default undefined - AWS Cloudfront default is IPv4
   */
  readonly ipAddressType?: cloudfront.OriginIpAddressType;

  /**
   * Configures mutual TLS (mTLS) authentication between CloudFront and your origin server.
   *
   * When specified, CloudFront uses the provided client certificate from ACM
   * to authenticate with the origin using mutual TLS.
   *
   * @default - no mutual TLS authentication
   */
  readonly originMtlsConfig?: cloudfront.OriginMtlsConfig;
}

/**
 * An Origin for an HTTP server or S3 bucket configured for website hosting.
 */
export class HttpOrigin extends cloudfront.OriginBase {
  constructor(domainName: string, private readonly props: HttpOriginProps = {}) {
    super(domainName, props);

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
    this.validateResponseCompletionTimeoutWithReadTimeout(props.responseCompletionTimeout, props.readTimeout);

    if (props.originMtlsConfig && props.protocolPolicy === cloudfront.OriginProtocolPolicy.HTTP_ONLY) {
      throw new UnscopedValidationError(
        'OriginMtlsConfigRequiresHttps',
        'originMtlsConfig requires a TLS connection to the origin, but protocolPolicy is set to HTTP_ONLY. Use HTTPS_ONLY or MATCH_VIEWER instead.',
      );
    }
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: this.props.originSslProtocols ?? [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: this.props.protocolPolicy ?? cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      httpPort: this.props.httpPort,
      httpsPort: this.props.httpsPort,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
      ipAddressType: this.props.ipAddressType,
      // certificateRef.certificateId returns the certificate ARN via CertificateBase
      originMtlsConfig: this.props.originMtlsConfig
        ? { clientCertificateArn: this.props.originMtlsConfig.clientCertificate.certificateRef.certificateId }
        : undefined,
    };
  }
}
