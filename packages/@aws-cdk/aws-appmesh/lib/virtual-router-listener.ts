import * as cdk from '@aws-cdk/core';
import { CfnVirtualRouter } from './appmesh.generated';
import { Protocol } from './shared-interfaces';

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
   */
  public static http(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.HTTP, port);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualRouter
   */
  public static http2(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.HTTP2, port);
  }

  /**
   * Returns a GRPC Listener for a VirtualRouter
   */
  public static grpc(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.GRPC, port);
  }

  /**
   * Returns a TCP Listener for a VirtualRouter
   */
  public static tcp(port?: number): VirtualRouterListener {
    return new VirtualRouterListenerImpl(Protocol.TCP, port);
  }

  /**
   * Protocol the listener implements
   */
  public abstract readonly protocol: Protocol;

  /**
   * Port to listen for connections on
   *
   * @default - defaults to port 8080
   */
  public abstract readonly port: number;

  /**
   * Called when the VirtualRouterListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public abstract bind(scope: cdk.Construct): VirtualRouterListenerConfig;
}

class VirtualRouterListenerImpl extends VirtualRouterListener {
  /**
   * Protocol the listener implements
   */
  public readonly protocol: Protocol;

  /**
   * Port to listen for connections on
   */
  public readonly port: number;

  constructor(protocol: Protocol, port?: number) {
    super();
    this.protocol = protocol;
    this.port = port ? port : 8080;
  }

  bind(_scope: cdk.Construct): VirtualRouterListenerConfig {
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
