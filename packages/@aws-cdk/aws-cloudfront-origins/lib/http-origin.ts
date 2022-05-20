import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { validateSecondsInRangeOrUndefined } from './private/utils';

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
}

/**
 * An Origin for an HTTP server or S3 bucket configured for website hosting.
 */
export class HttpOrigin extends cloudfront.OriginBase {

  constructor(domainName: string, private readonly props: HttpOriginProps = {}) {
    super(domainName, props);

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: this.props.originSslProtocols ?? [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: this.props.protocolPolicy ?? cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      httpPort: this.props.httpPort,
      httpsPort: this.props.httpsPort,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
    };
  }
}
