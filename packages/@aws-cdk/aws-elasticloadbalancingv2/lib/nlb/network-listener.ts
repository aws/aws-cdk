import cdk = require('@aws-cdk/cdk');
import { BaseListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { Protocol } from '../shared/enums';
import { INetworkLoadBalancer } from './network-load-balancer';
import { INetworkLoadBalancerTarget, INetworkTargetGroup, NetworkTargetGroup } from './network-target-group';

/**
 * Basic properties for a Network Listener
 */
export interface BaseNetworkListenerProps {
  /**
   * The port on which the listener listens for requests.
   */
  port: number;

  /**
   * Default target groups to load balance to
   *
   * @default None
   */
  defaultTargetGroups?: INetworkTargetGroup[];
}

/**
 * Properties for a Network Listener attached to a Load Balancer
 */
export interface NetworkListenerProps extends BaseNetworkListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  loadBalancer: INetworkLoadBalancer;
}

/**
 * Define a Network Listener
 */
export class NetworkListener extends BaseListener implements INetworkListener {
  /**
   * Import an existing listener
   */
  public static import(parent: cdk.Construct, id: string, props: NetworkListenerRefProps): INetworkListener {
    return new ImportedNetworkListener(parent, id, props);
  }

  /**
   * The load balancer this listener is attached to
   */
  private readonly loadBalancer: INetworkLoadBalancer;

  constructor(parent: cdk.Construct, id: string, props: NetworkListenerProps) {
    super(parent, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      protocol: Protocol.Tcp,
      port: props.port,
    });

    this.loadBalancer = props.loadBalancer;

    (props.defaultTargetGroups || []).forEach(this._addDefaultTargetGroup.bind(this));
  }

  /**
   * Load balance incoming requests to the given target groups.
   */
  public addTargetGroups(_id: string, ...targetGroups: INetworkTargetGroup[]): void {
    // New default target(s)
    for (const targetGroup of targetGroups) {
      this._addDefaultTargetGroup(targetGroup);
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * @returns The newly created target group
   */
  public addTargets(id: string, props: AddNetworkTargetsProps): NetworkTargetGroup {
    if (!this.loadBalancer.vpc) {
      // tslint:disable-next-line:max-line-length
      throw new Error('Can only call addTargets() when using a constructed Load Balancer; construct a new TargetGroup and use addTargetGroup');
    }

    const group = new NetworkTargetGroup(this, id + 'Group', {
      deregistrationDelaySec: props.deregistrationDelaySec,
      healthCheck: props.healthCheck,
      port: props.port,
      proxyProtocolV2: props.proxyProtocolV2,
      targetGroupName: props.targetGroupName,
      targets: props.targets,
      vpc: this.loadBalancer.vpc,
    });

    this.addTargetGroups(id, group);

    return group;
  }

  /**
   * Export this listener
   */
  public export(): NetworkListenerRefProps {
    return {
      listenerArn: new cdk.Output(this, 'ListenerArn', { value: this.listenerArn }).makeImportValue().toString()
    };
  }

}

/**
 * Properties to reference an existing listener
 */
export interface INetworkListener {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;
}

/**
 * Properties to reference an existing listener
 */
export interface NetworkListenerRefProps {
  /**
   * ARN of the listener
   */
  listenerArn: string;
}

/**
 * An imported Network Listener
 */
class ImportedNetworkListener extends cdk.Construct implements INetworkListener {
  /**
   * ARN of the listener
   */
  public readonly listenerArn: string;

  constructor(parent: cdk.Construct, id: string, props: NetworkListenerRefProps) {
    super(parent, id);

    this.listenerArn = props.listenerArn;
  }
}

/**
 * Properties for adding new network targets to a listener
 */
export interface AddNetworkTargetsProps {
  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  port: number;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   */
  targets?: INetworkLoadBalancerTarget[];

  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of
   * 32 characters, must contain only alphanumeric characters or hyphens, and
   * must not begin or end with a hyphen.
   *
   * @default Automatically generated
   */
  targetGroupName?: string;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0–3600 seconds.
   *
   * @default 300
   */
  deregistrationDelaySec?: number;

  /**
   * Indicates whether Proxy Protocol version 2 is enabled.
   *
   * @default false
   */
  proxyProtocolV2?: boolean;

  /**
   * Health check configuration
   *
   * @default No health check
   */
  healthCheck?: HealthCheck;
}
