import { Construct } from '@aws-cdk/core';

import { IApi } from '../api';
import { Integration, IntegrationOptions, IntegrationType, WebSocketApiIntegrationOptions } from '../integration';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from '../integration-response';

/**
 * Defines the properties required for defining an Api Gateway V2 Mock Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface BaseMockIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Mock Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface MockIntegrationOptions extends IntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Mock Integration.
 */
export interface MockIntegrationProps extends MockIntegrationOptions {
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
export interface WebSocketApiMockIntegrationOptions extends WebSocketApiIntegrationOptions, BaseMockIntegrationOptions {
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class MockIntegration extends Construct {
  /**
   * L1 Integration construct
   */
  public readonly resource: Integration;

  constructor(scope: Construct, id: string, props: MockIntegrationProps) {
    super(scope, id);
    this.resource = new Integration(this, 'Default', {
      ...props,
      type: IntegrationType.MOCK,
      uri: '',
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