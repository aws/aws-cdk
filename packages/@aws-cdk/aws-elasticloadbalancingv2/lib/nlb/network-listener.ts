import cdk = require('@aws-cdk/cdk');
import { BaseListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { Protocol, SslPolicy } from '../shared/enums';
import { INetworkLoadBalancer } from './network-load-balancer';
import { INetworkLoadBalancerTarget, INetworkTargetGroup, NetworkTargetGroup } from './network-target-group';

/**
 * Basic properties for a Network Listener
 */
export interface BaseNetworkListenerProps {
  /**
   * The port on which the listener listens for requests.
   */
  readonly port: number;

  /**
   * Default target groups to load balance to
   *
   * @default None
   */
  readonly defaultTargetGroups?: INetworkTargetGroup[];

  /**
   * Protocol for listener, expects TCP or TLS
   */
  protocol?: Protocol;

  /**
   * Certificate list of ACM cert ARNs
   */
  certificates?: INetworkListenerCertificateProps[];

  /**
   * SSL Policy to use for the listener
   */
  sslPolicy?: SslPolicy;
}

/**
 * Properties for adding a certificate to a listener
 */
export interface INetworkListenerCertificateProps {
  /**
   * Certificate ARN from ACM
   */
  certificateArn: string
}

/**
 * Properties for a Network Listener attached to a Load Balancer
 */
export interface NetworkListenerProps extends BaseNetworkListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  readonly loadBalancer: INetworkLoadBalancer;
}

/**
 * Define a Network Listener
 */
export class NetworkListener extends BaseListener implements INetworkListener {
  /**
   * Import an existing listener
   */
  public static import(scope: cdk.Construct, id: string, props: NetworkListenerImportProps): INetworkListener {
    return new ImportedNetworkListener(scope, id, props);
  }

  /**
   * The load balancer this listener is attached to
   */
  private readonly loadBalancer: INetworkLoadBalancer;

  /**
   * Protocol assigned to listener
   */
  private readonly protocol: Protocol;

  /**
   * Certificates array
   */
  private readonly certificates?: INetworkListenerCertificateProps[];

  constructor(scope: cdk.Construct, id: string, props: NetworkListenerProps) {
    super(scope, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      protocol: props.protocol || Protocol.Tcp,
      port: props.port,
      sslPolicy: props.sslPolicy,
      certificates: props.certificates
    });

    this.protocol = props.protocol || Protocol.Tcp;
    // this.sslPolicy = props.sslPolicy;
    this.certificates = props.certificates;

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
      targetGroup.registerListener(this);
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
  public export(): NetworkListenerImportProps {
    return {
      listenerArn: new cdk.CfnOutput(this, 'ListenerArn', { value: this.listenerArn }).makeImportValue().toString()
    };
  }

  protected validate(): string[] {
    const errors: string[] = [];

    if ([Protocol.Tcp, Protocol.Tls].indexOf(this.protocol) === -1) {
      errors.push(`The protocol must be either ${Protocol.Tcp} or ${Protocol.Tls}. Found ${this.protocol}`);
    }

    const certs = this.certificates || [];

    if (this.protocol === Protocol.Tls && (certs.length === 0 || certs.filter(v => {
      return v.certificateArn == null;
    }).length > 0)) {
      errors.push(`When the protocol is set to TLS, you must specify certificates`);
    }

    return errors;
  }
}

/**
 * Properties to reference an existing listener
 */
export interface INetworkListener extends cdk.IConstruct {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;

  /**
   * Export this listener
   */
  export(): NetworkListenerImportProps;
}

/**
 * Properties to reference an existing listener
 */
export interface NetworkListenerImportProps {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;
}

/**
 * An imported Network Listener
 */
class ImportedNetworkListener extends cdk.Construct implements INetworkListener {
  /**
   * ARN of the listener
   */
  public readonly listenerArn: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: NetworkListenerImportProps) {
    super(scope, id);

    this.listenerArn = props.listenerArn;
  }

  public export() {
    return this.props;
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
  readonly port: number;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   */
  readonly targets?: INetworkLoadBalancerTarget[];

  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of
   * 32 characters, must contain only alphanumeric characters or hyphens, and
   * must not begin or end with a hyphen.
   *
   * @default Automatically generated
   */
  readonly targetGroupName?: string;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0-3600 seconds.
   *
   * @default 300
   */
  readonly deregistrationDelaySec?: number;

  /**
   * Indicates whether Proxy Protocol version 2 is enabled.
   *
   * @default false
   */
  readonly proxyProtocolV2?: boolean;

  /**
   * Health check configuration
   *
   * @default No health check
   */
  readonly healthCheck?: HealthCheck;
}
