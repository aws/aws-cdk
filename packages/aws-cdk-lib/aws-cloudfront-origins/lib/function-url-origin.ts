import { validateSecondsInRangeOrUndefined } from './private/utils';
import * as cloudfront from '../../aws-cloudfront';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';

/**
 * Properties for a Lambda Function URL Origin.
 */
export interface FunctionUrlOriginProps extends cloudfront.OriginProps {
  /**
   * Specifies how long, in seconds, CloudFront waits for a response from the origin.
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
 * An Origin for a Lambda Function URL.
 */
export class FunctionUrlOrigin extends cloudfront.OriginBase {
  constructor(lambdaFunctionUrl: lambda.IFunctionUrl, private readonly props: FunctionUrlOriginProps = {}) {
    // Lambda Function URL is of the form 'https://<lambda-id>.lambda-url.<region>.on.aws/'
    // No need to split URL as we do with REST API, the entire URL is needed
    const domainName = cdk.Fn.select(2, cdk.Fn.split('/', lambdaFunctionUrl.url));
    super(domainName, props);

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
    };
  }
}