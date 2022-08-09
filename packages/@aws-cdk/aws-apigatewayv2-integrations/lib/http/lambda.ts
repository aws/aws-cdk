import {
  HttpIntegrationType,
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  HttpRouteIntegration,
  PayloadFormatVersion,
  ParameterMapping,
} from '@aws-cdk/aws-apigatewayv2';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';

/**
 * Lambda Proxy integration properties
 */
export interface HttpLambdaIntegrationProps {
  /**
   * Version of the payload sent to the lambda handler.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default PayloadFormatVersion.VERSION_2_0
   */
  readonly payloadFormatVersion?: PayloadFormatVersion;

  /**
   * Specifies how to transform HTTP requests before sending them to the backend
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   * @default undefined requests are sent to the backend unmodified
   */
  readonly parameterMapping?: ParameterMapping;
}

/**
 * The Lambda Proxy integration resource for HTTP API
 */
export class HttpLambdaIntegration extends HttpRouteIntegration {

  private readonly _id: string;

  /**
   * @param id id of the underlying integration construct
   * @param handler the Lambda handler to integrate with
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly handler: IFunction,
    private readonly props: HttpLambdaIntegrationProps = {}) {

    super(id);
    this._id = id;
  }

  protected completeBind(options: HttpRouteIntegrationBindOptions) {
    const route = options.route;
    this.handler.addPermission(`${this._id}-Permission`, {
      scope: options.scope,
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: Stack.of(route).formatArn({
        service: 'execute-api',
        resource: route.httpApi.apiId,
        resourceName: `*/*${route.path ?? ''}`, // empty string in the case of the catch-all route $default
      }),
    });
  }

  public bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.AWS_PROXY,
      uri: this.handler.functionArn,
      payloadFormatVersion: this.props.payloadFormatVersion ?? PayloadFormatVersion.VERSION_2_0,
      parameterMapping: this.props.parameterMapping,
    };
  }
}
