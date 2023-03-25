import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { validateSecondsInRangeOrUndefined } from './private/utils';

/**
 * Properties for an Origin for an API Gateway REST API.
 */
export interface RestApiOriginProps extends cloudfront.OriginProps {
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
 * An Origin for an API Gateway REST API.
 */
export class RestApiOrigin extends cloudfront.OriginBase {

  constructor(restApi: apigateway.RestApi, private readonly props: RestApiOriginProps = {}) {
    // urlForPath() is of the form 'https://<rest-api-id>.execute-api.<region>.amazonaws.com/<stage>'
    // Splitting on '/' gives: ['https', '', '<rest-api-id>.execute-api.<region>.amazonaws.com', '<stage>']
    // The element at index 2 is the domain name, the element at index 3 is the stage name
    super(cdk.Fn.select(2, cdk.Fn.split('/', restApi.url)), {
      originPath: props.originPath ?? `/${cdk.Fn.select(3, cdk.Fn.split('/', restApi.url))}`,
      ...props,
    });

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
