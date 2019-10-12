import cdk = require('@aws-cdk/core');
import { BaseTargetGroupProps, HealthCheck, ITargetGroup, loadBalancerNameFromListenerArn, LoadBalancerTargetProps,
         TargetGroupBase, TargetGroupImportProps } from '../shared/base-target-group';
import { Protocol } from '../shared/enums';
import { ImportedTargetGroupBase } from '../shared/imported';
import { INetworkListener } from './network-listener';

/**
 * Properties for a new Network Target Group
 */
export interface NetworkTargetGroupProps extends BaseTargetGroupProps {
  /**
   * The protocol on which the container listens for requests.
   */
  readonly protocol: Protocol;

  /**
   * The port on which the container listens for requests.
   * @deprecated Use `containerPort` instead
   * @default - containerPort or port required
   */
  readonly port?: number;

  /**
   * TODO: Remove port and make containerPort not optional in v2.0
   */
  /**
   * The port on which the container listens for requests.
   * @default - containerPort or port required
   */
  readonly containerPort?: number;

  /**
   * Indicates whether Proxy Protocol version 2 is enabled.
   *
   * @default false
   */
  readonly proxyProtocolV2?: boolean;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   *
   * @default - No targets.
   */
  readonly targets?: INetworkLoadBalancerTarget[];
}

/**
 * Define a Network Target Group
 */
export class NetworkTargetGroup extends TargetGroupBase implements INetworkTargetGroup {
  /**
   * Import an existing listener
   */
  public static import(scope: cdk.Construct, id: string, props: NetworkTargetGroupImportProps): INetworkTargetGroup {
    return new ImportedNetworkTargetGroup(scope, id, props);
  }

  /**
   * Default protocol configured for members of this target group
   */
  public readonly defaultProtocol: Protocol;

  private readonly listeners: INetworkListener[];

  constructor(scope: cdk.Construct, id: string, props: NetworkTargetGroupProps) {
    const containerPort = props.containerPort || props.port;
    if (!containerPort) {
      throw new Error('Missing containerPort - The port on which the container listens is required when adding a target.');
    }

    super(scope, id, props, {
      protocol: props.protocol,
      port: containerPort,
    });

    this.listeners = [];
    this.defaultProtocol = props.protocol;

    if (props.proxyProtocolV2) {
      this.setAttribute('proxy_protocol_v2.enabled', 'true');
    }

    this.addTarget(...(props.targets || []));
  }

  /**
   * Add a load balancing target to this target group
   */
  public addTarget(...targets: INetworkLoadBalancerTarget[]) {
    for (const target of targets) {
      const result = target.attachToNetworkTargetGroup(this);
      this.addLoadBalancerTarget(result);
    }
  }

  /**
   * Register a listener that is load balancing to this target group.
   *
   * Don't call this directly. It will be called by listeners.
   */
  public registerListener(listener: INetworkListener) {
    this.loadBalancerAttachedDependencies.add(listener);
    this.listeners.push(listener);
  }

  /**
   * Full name of first load balancer
   */
  public get firstLoadBalancerFullName(): string {
    if (this.listeners.length === 0) {
      throw new Error('The TargetGroup needs to be attached to a LoadBalancer before you can call this method');
    }
    return loadBalancerNameFromListenerArn(this.listeners[0].listenerArn);
  }

  protected validate(): string[]  {
    const ret = super.validate();

    const healthCheck: HealthCheck = this.healthCheck || {};

    const allowedIntervals = [10, 30];
    if (healthCheck.interval) {
      const seconds = healthCheck.interval.toSeconds();
      if (!cdk.Token.isUnresolved(seconds) && !allowedIntervals.includes(seconds)) {
        ret.push(`Health check interval '${seconds}' not supported. Must be one of the following values '${allowedIntervals.join(',')}'.`);
      }
    }
    if (healthCheck.path) {
      ret.push('Health check paths are not supported for Network Load Balancer health checks');
    }
    if (healthCheck.protocol && !NLB_HEALTH_CHECK_PROTOCOLS.includes(healthCheck.protocol)) {
      ret.push(`Health check protocol '${healthCheck.protocol}' is not supported. Must be one of [${NLB_HEALTH_CHECK_PROTOCOLS.join(', ')}]`);
    }
    if (healthCheck.timeout) {
      ret.push('Custom health check timeouts are not supported for Network Load Balancer health checks');
    }

    return ret;
  }
}

/**
 * A network target group
 */
// tslint:disable-next-line:no-empty-interface
export interface INetworkTargetGroup extends ITargetGroup {
  /**
   * Default protocol configured for members of this target group
   */
  readonly defaultProtocol: Protocol;

  /**
   * Register a listener that is load balancing to this target group.
   *
   * Don't call this directly. It will be called by listeners.
   */
  registerListener(listener: INetworkListener): void;
}

/**
 * An imported network target group
 */
class ImportedNetworkTargetGroup extends ImportedTargetGroupBase implements INetworkTargetGroup {

  /**
   * Default protocol configured for members of this target group
   */
  public readonly defaultProtocol: Protocol;

  constructor(scope: cdk.Construct, id: string, props: NetworkTargetGroupImportProps) {
    super(scope, id, props);
    this.defaultProtocol = props.defaultProtocol;
  }

  public registerListener(_listener: INetworkListener) {
    // Nothing to do, we know nothing of our members
  }
}

export interface NetworkTargetGroupImportProps extends TargetGroupImportProps {
  /**
   * Default protocol configured for members of this target group
   */
  readonly defaultProtocol: Protocol;
}

/**
 * Interface for constructs that can be targets of an network load balancer
 */
export interface INetworkLoadBalancerTarget {
  /**
   * Attach load-balanced target to a TargetGroup
   *
   * May return JSON to directly add to the [Targets] list, or return undefined
   * if the target will register itself with the load balancer.
   */
  attachToNetworkTargetGroup(targetGroup: INetworkTargetGroup): LoadBalancerTargetProps;
}

const NLB_HEALTH_CHECK_PROTOCOLS = [Protocol.HTTP, Protocol.HTTPS, Protocol.TCP];