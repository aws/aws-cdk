import { IResource } from '../../../core';
import { IRouteRef } from '../apigatewayv2.generated';

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
