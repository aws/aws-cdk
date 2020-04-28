import { Construct } from '@aws-cdk/core';

import { IApi } from '../api';
import { HttpApiIntegrationMethod, HttpApiIntegrationOptions, Integration, IntegrationOptions, IntegrationType, WebSocketApiIntegrationOptions } from '../integration';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from '../integration-response';

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface BaseServiceIntegrationOptions {
  /**
   * The ARN of the target service for this integration
   */
  readonly arn: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface ServiceIntegrationOptions extends IntegrationOptions, BaseServiceIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 */
export interface ServiceIntegrationProps extends ServiceIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;

  /**
   * Defines the api for this integration.
   */
  readonly api: IApi;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface HttpApiServiceIntegrationOptions extends HttpApiIntegrationOptions, BaseServiceIntegrationOptions {
  /**
   * Specifies the integration's HTTP method type.
   *
   * @default - 'ANY'
   */
  readonly integrationMethod?: HttpApiIntegrationMethod | string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketApiServiceIntegrationOptions extends WebSocketApiIntegrationOptions, BaseServiceIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class ServiceIntegration extends Construct {
  /**
   * L1 Integration construct
   */
  public readonly resource: Integration;

  constructor(scope: Construct, id: string, props: ServiceIntegrationProps) {
    super(scope, id);
    this.resource = new Integration(this, 'Default', {
      ...props,
      type: props.proxy ? IntegrationType.AWS_PROXY : IntegrationType.AWS,
      uri: props.arn,
    });
  }

  /**
   * Creates a new response for this integration.
   *
   * @param key the key (predefined or not) that will select this response
   * @param props the properties for this response
   */
  public addResponse(key: KnownIntegrationResponseKey | string, props?: IntegrationResponseOptions): IntegrationResponse {
    return this.resource.addResponse(key, props);
  }
}