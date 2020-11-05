import * as cdk from '@aws-cdk/core';
import { CfnVirtualRouter } from './appmesh.generated';
import { Protocol } from './shared-interfaces';

/**
 * Represents the properties needed to define Listeners for a VirtualRouter
 */
export interface RouterListenerProps {
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port?: number
}

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
  public static http(props: RouterListenerProps = {}): VirtualRouterListener {
    return new HttpVirtualRouterListener(props);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualRouter
   */
  public static http2(props: RouterListenerProps = {}): VirtualRouterListener {
    return new Http2VirtualRouterListener(props);
  }

  /**
   * Returns a GRPC Listener for a VirtualRouter
   */
  public static grpc(props: RouterListenerProps = {}): VirtualRouterListener {
    return new GrpcVirtualRouterListener(props);
  }

  /**
   * Returns a TCP Listener for a VirtualRouter
   */
  public static tcp(props: RouterListenerProps = {}): VirtualRouterListener {
    return new TcpVirtualRouterListener(props);
  }

  /**
   * Protocol the listener implements
   */
  protected abstract protocol: Protocol;

  /**
   * Port to listen for connections on
   */
  protected abstract port: number;

  /**
   * Called when the VirtualRouterListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public abstract bind(scope: cdk.Construct): VirtualRouterListenerConfig;
}

class HttpVirtualRouterListener extends VirtualRouterListener {
  /**
   * Protocol the listener implements
   */
  protected protocol: Protocol = Protocol.HTTP;
  /**
   * Port to listen for connections on
   */
  protected port: number;

  constructor(props: RouterListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
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

class Http2VirtualRouterListener extends HttpVirtualRouterListener {
  constructor(props: RouterListenerProps = {}) {
    super(props);
    this.protocol = Protocol.HTTP2;
  }
}

class GrpcVirtualRouterListener extends HttpVirtualRouterListener {
  constructor(props: RouterListenerProps = {}) {
    super(props);
    this.protocol = Protocol.GRPC;
  }
}

class TcpVirtualRouterListener extends HttpVirtualRouterListener {
  constructor(props: RouterListenerProps = {}) {
    super(props);
    this.protocol = Protocol.TCP;
  }
}
