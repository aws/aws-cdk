import cdk = require('@aws-cdk/cdk');
import { BaseTargetGroup, BaseTargetGroupProps, ITargetGroup, LoadBalancerTargetProps, TargetGroupRefProps } from '../shared/base-target-group';
import { Protocol } from '../shared/enums';
import { BaseImportedTargetGroup } from '../shared/imported';

/**
 * Properties for a new Network Target Group
 */
export interface NetworkTargetGroupProps extends BaseTargetGroupProps {
  /**
   * The port on which the listener listens for requests.
   */
  port: number;

  /**
   * Indicates whether Proxy Protocol version 2 is enabled.
   *
   * @default false
   */
  proxyProtocolV2?: boolean;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   */
  targets?: INetworkLoadBalancerTarget[];
}

/**
 * Define a Network Target Group
 */
export class NetworkTargetGroup extends BaseTargetGroup {
  /**
   * Import an existing listener
   */
  public static import(parent: cdk.Construct, id: string, props: TargetGroupRefProps): INetworkTargetGroup {
    return new ImportedNetworkTargetGroup(parent, id, props);
  }

  constructor(parent: cdk.Construct, id: string, props: NetworkTargetGroupProps) {
    super(parent, id, props, {
      protocol: Protocol.Tcp,
      port: props.port,
    });

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
}

/**
 * A network target group
 */
// tslint:disable-next-line:no-empty-interface
export interface INetworkTargetGroup extends ITargetGroup {
}

/**
 * An imported network target group
 */
class ImportedNetworkTargetGroup extends BaseImportedTargetGroup implements INetworkTargetGroup {
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
  attachToNetworkTargetGroup(targetGroup: NetworkTargetGroup): LoadBalancerTargetProps;
}
