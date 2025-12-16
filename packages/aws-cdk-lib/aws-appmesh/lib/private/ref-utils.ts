import { IVirtualGatewayRef, IVirtualRouterRef } from '../../../interfaces/generated/aws-appmesh-interfaces.generated';
import { IVirtualGateway } from '../virtual-gateway';
import { IVirtualRouter } from '../virtual-router';

/**
 * Convert a VirtualGateway reference to a full VirtualGateway interface
 */
export function toIVirtualGateway(virtualGateway: IVirtualGatewayRef): IVirtualGateway {
  // Check if it's already a full IVirtualGateway
  if ('mesh' in virtualGateway && 'virtualGatewayName' in virtualGateway) {
    return virtualGateway as IVirtualGateway;
  }

  throw new TypeError(`'virtualGateway' instance should implement IVirtualGateway, but doesn't: ${virtualGateway.constructor.name}`);
}

/**
 * Convert a VirtualRouter reference to a full VirtualRouter interface
 */
export function toIVirtualRouter(virtualRouter: IVirtualRouterRef): IVirtualRouter {
  // Check if it's already a full IVirtualRouter
  if ('mesh' in virtualRouter && 'virtualRouterName' in virtualRouter) {
    return virtualRouter as IVirtualRouter;
  }

  throw new TypeError(`'virtualRouter' instance should implement IVirtualRouter, but doesn't: ${virtualRouter.constructor.name}`);
}
