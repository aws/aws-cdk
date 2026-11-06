import type { IResource } from '../../../core';
import type { IIntegrationRef } from '../apigatewayv2.generated';

/**
 * Represents an integration to an API Route.
 */
export interface IIntegration extends IResource, IIntegrationRef {
  /**
   * Id of the integration.
   * @attribute
   */
  readonly integrationId: string;
}
