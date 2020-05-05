import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { HttpIntegrationType, HttpRouteIntegrationConfig, IHttpRouteIntegration, PayloadFormatVersion } from '../integration';
import { IHttpRoute } from '../route';

/**
 * Lambda Proxy integration properties
 */
export interface LambdaProxyIntegrationProps {
  /**
   * The handler for this integration.
   */
  readonly handler: IFunction

  /**
   * Version of the payload sent to the lambda handler.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default PayloadFormatVersion.VERSION_2_0
   */
  readonly payloadFormatVersion?: PayloadFormatVersion;
}

/**
 * The Lambda Proxy integration resource for HTTP API
 */
export class LambdaProxyIntegration implements IHttpRouteIntegration {

  constructor(private readonly props: LambdaProxyIntegrationProps) {
  }

  public bind(route: IHttpRoute): HttpRouteIntegrationConfig {
    this.props.handler.addPermission(`${route.node.uniqueId}-Permission`, {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: Stack.of(route).formatArn({
        service: 'execute-api',
        resource: route.httpApi.httpApiId,
        resourceName: `*/*${route.path ?? ''}`, // empty string in the case of the catch-all route $default
      }),
    });

    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      uri: this.props.handler.functionArn,
      payloadFormatVersion: this.props.payloadFormatVersion ?? PayloadFormatVersion.VERSION_2_0,
    };
  }
}