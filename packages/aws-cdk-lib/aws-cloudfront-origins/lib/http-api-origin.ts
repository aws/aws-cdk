import { validateSecondsInRangeOrUndefined } from './private/utils';
import type * as apigatewayv2 from '../../aws-apigatewayv2';
import * as cloudfront from '../../aws-cloudfront';
import * as cdk from '../../core';

/**
 * Properties for an Origin for an API Gateway HTTP API.
 */
export interface HttpApiOriginProps extends cloudfront.OriginProps {
  /**
   * The HTTP stage to use as the origin.
   *
   * When not specified, the HTTP API's default stage is used.
   * If the HTTP API does not have a default stage (i.e., `createDefaultStage: false`),
   * this property must be provided.
   *
   * @default - the HTTP API's default stage
   */
  readonly stage?: apigatewayv2.IHttpStage;

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
 * An Origin for an API Gateway HTTP API.
 */
export class HttpApiOrigin extends cloudfront.OriginBase {
  constructor(httpApi: apigatewayv2.IHttpApi, private readonly props: HttpApiOriginProps = {}) {
    const stage = props.stage ?? httpApi.defaultStage;

    if (!stage) {
      throw new cdk.UnscopedValidationError(
        'An explicit stage must be provided when the HTTP API does not have a default stage. ' +
        'Use the \'stage\' property to specify the stage.',
      );
    }

    // Build the domain name directly from the API ID, region, and URL suffix.
    // We cannot use stage.url (throws for imported stages) or httpApi.apiEndpoint
    // (throws when disableExecuteApiEndpoint is true, or when imported without apiEndpoint).
    // apiId is always available (required for both concrete and imported APIs), and the
    // execute-api domain format is fixed, so direct construction is safe.
    //
    // If the HTTP API has disableExecuteApiEndpoint set to true, the execute-api
    // endpoint will return 403. This is the same limitation as RestApiOrigin.
    // IHttpApi does not expose disableExecuteApiEndpoint, so we cannot guard against it here.
    const s = cdk.Stack.of(httpApi);
    const domainName = `${httpApi.apiId}.execute-api.${s.region}.${s.urlSuffix}`;

    // For the $default stage, there is no path segment, so originPath should not be set.
    // For custom stages, originPath is '/<stage-name>' to route to the correct stage.
    const isDefaultStage = stage.stageName === '$default';
    const originPath = props.originPath ?? (isDefaultStage ? undefined : `/${stage.stageName}`);

    super(domainName, {
      originPath,
      ...props,
    });

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
    this.validateResponseCompletionTimeoutWithReadTimeout(props.responseCompletionTimeout, props.readTimeout);
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
      ipAddressType: this.props.ipAddressType,
    };
  }
}
