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
 * The integration for an API route.
 * @resource AWS::ApiGatewayV2::Integration
 */
export class Integration extends Resource implements IResource {
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

/**
 * The interface that various route integration classes will inherit.
 */
export interface IRouteIntegration {
  /**
   * Bind this integration to the route.
   */
  bind(route: Route): RouteIntegrationConfig;
}

/**
 * Config returned back as a result of the bind.
 */
export interface RouteIntegrationConfig {
  /**
   * Integration type.
   */
  readonly type: IntegrationType;

  /**
   * Integration URI
   */
  readonly uri: string;
}