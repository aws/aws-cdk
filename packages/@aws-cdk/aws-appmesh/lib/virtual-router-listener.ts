import { CfnVirtualRouter } from './appmesh.generated';
import { Protocol } from './shared-interfaces';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Properties for a VirtualRouter listener
 */
export interface VirtualRouterListenerConfig {
  /**
   * Single listener config for a VirtualRouter
   */
  readonly listener: CfnVirtualRouter.VirtualRouterListenerProperty;
}

/**
 * Represents the properties needed to define listeners for a VirtualRouter
 */
export abstract class VirtualRouterListener {
  /**
   * Returns an HTTP Listener for a VirtualRouter
   *
   * @param port the optional port of the listener, 8080 by default
   */
  public static http(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.HTTP, port);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualRouter
   *
   * @param port the optional port of the listener, 8080 by default
   */
  public static http2(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.HTTP2, port);
  }

  /**
   * Returns a GRPC Listener for a VirtualRouter
   *
   * @param port the optional port of the listener, 8080 by default
   */
  public static grpc(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.GRPC, port);
  }

  /**
   * Returns a TCP Listener for a VirtualRouter
   *
   * @param port the optional port of the listener, 8080 by default
   */
  public static tcp(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.TCP, port);
  }

  /**
   * Called when the VirtualRouterListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public abstract bind(scope: Construct): VirtualRouterListenerConfig;
}

class VirtualRouterListenerImpl extends VirtualRouterListener {
  private readonly protocol: Protocol;
  private readonly port: number;

  constructor(protocol: Protocol, port?: number) {
    super();
    this.protocol = protocol;
    this.port = port ?? 8080;
  }

  bind(_scope: Construct): VirtualRouterListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: this.protocol,
        },
      },
    };
  }
}
