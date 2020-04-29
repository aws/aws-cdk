import { Construct, Resource } from '@aws-cdk/core';
import { CfnIntegration } from '../apigatewayv2.generated';
import { IIntegration } from '../common';
import { IHttpApi } from './api';
import { IHttpRoute } from './route';

/**
 * Supported integration types
 */
export enum HttpIntegrationType {
  /**
   * Integration type is a Lambda proxy
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   */
  LAMBDA_PROXY = 'AWS_PROXY',
  /**
   * Integration type is an HTTP proxy
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   */
  HTTP_PROXY = 'HTTP_PROXY',

  /**
   * Private integrations.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-private.html
   */
  PRIVATE = 'HTTP_PROXY',
}

/**
 * The integration properties
 */
export interface HttpIntegrationProps {
  /**
   * API ID
   */
  readonly httpApi: IHttpApi;
  /**
   * integration type
   */
  readonly integrationType: HttpIntegrationType;
  /**
   * integration URI
   */
  readonly integrationUri: string;
}

/**
 * The integration for an API route.
 * @resource AWS::ApiGatewayV2::Integration
 */
export class HttpIntegration extends Resource implements IIntegration {
  /**
   * Import an existing integration using integration id
   */
  public static fromIntegrationId(scope: Construct, id: string, integrationId: string): IIntegration {
    class Import extends Resource implements IIntegration {
      public readonly integrationId = integrationId;
    }

    return new Import(scope, id);
  }

  public readonly integrationId: string;

  constructor(scope: Construct, id: string, props: HttpIntegrationProps) {
    super(scope, id);
    const integ = new CfnIntegration(this, 'Resource', {
      apiId: props.httpApi.httpApiId,
      integrationType: props.integrationType,
      integrationUri: props.integrationUri,
      payloadFormatVersion: '1.0',
    });
    this.integrationId = integ.ref;
  }
}

/**
 * The interface that various route integration classes will inherit.
 */
export interface IHttpRouteIntegration {
  /**
   * Bind this integration to the route.
   */
  bind(route: IHttpRoute): HttpRouteIntegrationConfig;
}

/**
 * Config returned back as a result of the bind.
 */
export interface HttpRouteIntegrationConfig {
  /**
   * Integration type.
   */
  readonly type: HttpIntegrationType;

  /**
   * Integration URI
   */
  readonly uri: string;
}