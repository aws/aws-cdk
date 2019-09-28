import cdk = require('@aws-cdk/core');
import { BaseTargetGroupProps, ITargetGroup, loadBalancerNameFromListenerArn, LoadBalancerTargetProps,
         TargetGroupBase, TargetGroupImportProps } from '../shared/base-target-group';
import { Protocol } from '../shared/enums';
import { ImportedTargetGroupBase } from '../shared/imported';
import { INetworkListener } from './network-listener';

/**
 * Properties for a new Network Target Group
 */
export interface NetworkTargetGroupProps extends BaseTargetGroupProps {
  /**
   * The port on which the listener listens for requests.
   */
  readonly port: number;

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
  public static import(scope: cdk.Construct, id: string, props: TargetGroupImportProps): INetworkTargetGroup {
    return new ImportedNetworkTargetGroup(scope, id, props);
  }

  private readonly listeners: INetworkListener[];

  constructor(scope: cdk.Construct, id: string, props: NetworkTargetGroupProps) {
    super(scope, id, props, {
      protocol: Protocol.TCP,
      port: props.port,
    });

    this.listeners = [];

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

    const allowedIntervals = [10, 30];
    if (this.healthCheck && this.healthCheck.interval) {
      const seconds = this.healthCheck.interval.toSeconds();
      if (!allowedIntervals.includes(seconds)) {
        ret.push(`Health check interval '${seconds}' not supported. Must be one of the following values '${allowedIntervals.join(',')}'.`)
      }
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
  public registerListener(_listener: INetworkListener) {
    // Nothing to do, we know nothing of our members
  }
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
