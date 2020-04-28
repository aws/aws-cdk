import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { IntegrationType, IRouteIntegration, RouteIntegrationConfig } from '../integration';
import { Route } from '../route';

/**
 * Lambda Proxy integration properties
 */
export interface LambdaProxyIntegrationProps {
  /**
   * The Lambda function for this integration.
   */
  readonly handler: IFunction

  /**
   * Version of the payload sent to the lambda handler.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default '2.0'
   */
  readonly payloadFormatVersion?: string;
}

/**
 * The Lambda Proxy integration resource for HTTP API
 */
export class LambdaProxyIntegration implements IRouteIntegration {

  constructor(private readonly props: LambdaProxyIntegrationProps) {
  }

  public bind(route: Route): RouteIntegrationConfig {
    this.props.handler.addPermission(`${route.node.uniqueId}-Permission`, {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: Stack.of(route).formatArn({
        service: 'execute-api',
        resource: route.httpApi.httpApiId,
        resourceName: `*/*${route.path ?? ''}`, // empty string in the case of the catch-all route $default
      }),
    });

    return {
      type: IntegrationType.AWS_PROXY,
      uri: this.props.handler.functionArn,
    };
  }
}