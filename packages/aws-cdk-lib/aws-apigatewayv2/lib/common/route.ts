import type { IResource } from '../../../core';
import type { IRouteRef } from '../apigatewayv2.generated';

/**
 * Represents a route.
 */
export interface IRoute extends IResource, IRouteRef {
  /**
   * Id of the Route
   * @attribute
   */
  readonly routeId: string;
}
