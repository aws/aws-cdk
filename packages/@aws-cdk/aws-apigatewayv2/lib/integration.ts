import { Construct, IResource, Resource } from '@aws-cdk/core';
import { IHttpApi } from './api';
import { CfnIntegration } from './apigatewayv2.generated';
import { Route } from './route';

/**
 * Represents an integration to a HTTP API Route.
 */
export interface IIntegration extends IResource {
  /**
   * The resource ID of the integration
   * @attribute
   */
  readonly integrationId: string;
}

/**
 * Supported integration types
 */
export enum IntegrationType {
  AWS_PROXY = 'AWS_PROXY',
  HTTP_PROXY = 'HTTP_PROXY',
}

/**
 * The integration properties
 */
export interface IntegrationProps {
  /**
   * API ID
   */
  readonly httpApi: IHttpApi;
  /**
   * integration type
   */
  readonly integrationType: IntegrationType;
  /**
   * integration URI
   */
  readonly integrationUri: string;
}

/**
 * The integration resource for HTTP API
 */
export class Integration extends Resource implements IResource {
  /**
   * import from integration ID
   */
  public static fromIntegrationId(scope: Construct, id: string, integrationId: string): IIntegration {
    class Import extends Resource implements IIntegration {
      public readonly integrationId = integrationId;
    }

    return new Import(scope, id);
  }

  public readonly integrationId: string;

  constructor(scope: Construct, id: string, props: IntegrationProps) {
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

export interface IRouteIntegration {
  bind(route: Route): RouteIntegrationConfig;
}

export interface RouteIntegrationConfig {
  readonly type: IntegrationType;

  readonly uri: string;
}