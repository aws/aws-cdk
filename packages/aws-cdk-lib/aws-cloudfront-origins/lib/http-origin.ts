import { validateSecondsInRangeOrUndefined } from './private/utils';
import * as cloudfront from '../../aws-cloudfront';
import type * as cdk from '../../core';
import { Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

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

    if (props.httpPort !== undefined && !Token.isUnresolved(props.httpPort) &&
        (!Number.isInteger(props.httpPort) || props.httpPort < 1 || props.httpPort > 65535)) {
      throw new UnscopedValidationError(lit`HttpPortMustBeInRange`, `'httpPort' must be an integer between 1 and 65535 (inclusive); received ${props.httpPort}.`);
    }
    if (props.httpsPort !== undefined && !Token.isUnresolved(props.httpsPort) &&
        (!Number.isInteger(props.httpsPort) || props.httpsPort < 1 || props.httpsPort > 65535)) {
      throw new UnscopedValidationError(lit`HttpsPortMustBeInRange`, `'httpsPort' must be an integer between 1 and 65535 (inclusive); received ${props.httpsPort}.`);
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
    };
  }
}
