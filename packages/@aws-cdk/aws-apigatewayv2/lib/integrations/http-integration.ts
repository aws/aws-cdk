import { Construct } from '@aws-cdk/core';

import { IApi } from '../api';
import { HttpApiIntegrationMethod, HttpApiIntegrationOptions, Integration, IntegrationOptions, IntegrationType, WebSocketApiIntegrationOptions } from '../integration';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from '../integration-response';

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface BaseHttpIntegrationOptions {
  /**
   * The HTTP URL for this integration
   */
  readonly url: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface HttpIntegrationOptions extends IntegrationOptions, BaseHttpIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 */
export interface HttpIntegrationProps extends HttpIntegrationOptions {
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
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface HttpApiHttpIntegrationOptions extends HttpApiIntegrationOptions, BaseHttpIntegrationOptions {
  /**
   * Specifies the integration's HTTP method type.
   *
   * @default - 'ANY'
   */
  readonly integrationMethod?: HttpApiIntegrationMethod | string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketApiHttpIntegrationOptions extends WebSocketApiIntegrationOptions, BaseHttpIntegrationOptions {
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
export class HttpIntegration extends Construct {
  /**
   * L1 Integration construct
   */
  public readonly resource: Integration;

  constructor(scope: Construct, id: string, props: HttpIntegrationProps) {
    super(scope, id);

    this.resource = new Integration(this, 'Default', {
      ...props,
      type: props.proxy ? IntegrationType.HTTP_PROXY : IntegrationType.HTTP,
      uri: props.url,
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