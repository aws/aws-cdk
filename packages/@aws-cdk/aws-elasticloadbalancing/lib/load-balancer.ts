import codedeploy = require('@aws-cdk/aws-codedeploy-api');
import {
  AnyIPv4, Connections, IConnectable, IPortRange, ISecurityGroup,
  IVpcNetwork, IVpcSubnet, SecurityGroup, TcpPort  } from '@aws-cdk/aws-ec2';
import { Construct, Resource, Token } from '@aws-cdk/cdk';
import { CfnLoadBalancer } from './elasticloadbalancing.generated';

/**
 * Construction properties for a LoadBalancer
 */
export interface LoadBalancerProps {
  /**
   * VPC network of the fleet instances
   */
  readonly vpc: IVpcNetwork;

  /**
   * Whether this is an internet-facing Load Balancer
   *
   * This controls whether the LB has a public IP address assigned. It does
   * not open up the Load Balancer's security groups to public internet access.
   *
   * @default false
   */
  readonly internetFacing?: boolean;

  /**
   * What listeners to set up for the load balancer.
   *
   * Can also be added by .addListener()
   */
  readonly listeners?: LoadBalancerListener[];

  /**
   * What targets to load balance to.
   *
   * Can also be added by .addTarget()
   */
  readonly targets?: ILoadBalancerTarget[];

  /**
   * Health check settings for the load balancing targets.
   *
   * Not required but recommended.
   */
  readonly healthCheck?: HealthCheck;
}

/**
 * Describe the health check to a load balancer
 */
export interface HealthCheck {
  /**
   * What port number to health check on
   */
  readonly port: number;

  /**
   * What protocol to use for health checking
   *
   * The protocol is automatically determined from the port if it's not supplied.
   *
   * @default Automatic
   */
  readonly protocol?: LoadBalancingProtocol;

  /**
   * What path to use for HTTP or HTTPS health check (must return 200)
   *
   * For SSL and TCP health checks, accepting connections is enough to be considered
   * healthy.
   *
   * @default "/"
   */
  readonly path?: string;

  /**
   * After how many successful checks is an instance considered healthy
   *
   * @default 2
   */
  readonly healthyThreshold?: number;

  /**
   * After how many unsuccessful checks is an instance considered unhealthy
   *
   * @default 5
   */
  readonly unhealthyThreshold?: number;

  /**
   * Number of seconds between health checks
   *
   * @default 30
   */
  readonly interval?: number;

  /**
   * Health check timeout
   *
   * @default 5
   */
  readonly timeout?: number;
}

/**
 * Interface that is going to be implemented by constructs that you can load balance to
 */
export interface ILoadBalancerTarget extends IConnectable {
  /**
   * Attach load-balanced target to a classic ELB
   * @param loadBalancer [disable-awslint:ref-via-interface] The load balancer to attach the target to
   */
  attachToClassicLB(loadBalancer: LoadBalancer): void;
}

/**
 * Add a backend to the load balancer
 */
export interface LoadBalancerListener {
  /**
   * External listening port
   */
  readonly externalPort: number;

  /**
   * What public protocol to use for load balancing
   *
   * Either 'tcp', 'ssl', 'http' or 'https'.
   *
   * May be omitted if the external port is either 80 or 443.
   */
  readonly externalProtocol?: LoadBalancingProtocol;

  /**
   * Instance listening port
   *
   * Same as the externalPort if not specified.
   *
   * @default externalPort
   */
  readonly internalPort?: number;

  /**
   * What public protocol to use for load balancing
   *
   * Either 'tcp', 'ssl', 'http' or 'https'.
   *
   * May be omitted if the internal port is either 80 or 443.
   *
   * The instance protocol is 'tcp' if the front-end protocol
   * is 'tcp' or 'ssl', the instance protocol is 'http' if the
   * front-end protocol is 'https'.
   */
  readonly internalProtocol?: LoadBalancingProtocol;

  /**
   * SSL policy names
   */
  readonly policyNames?: string[];

  /**
   * ID of SSL certificate
   */
  readonly sslCertificateId?: string;

  /**
   * Allow connections to the load balancer from the given set of connection peers
   *
   * By default, connections will be allowed from anywhere. Set this to an empty list
   * to deny connections, or supply a custom list of peers to allow connections from
   * (IP ranges or security groups).
   *
   * @default Anywhere
   */
  readonly allowConnectionsFrom?: IConnectable[];
}

export enum LoadBalancingProtocol {
  Tcp = 'tcp',
  Ssl = 'ssl',
  Http = 'http',
  Https = 'https'
}

/**
 * A load balancer with a single listener
 *
 * Routes to a fleet of of instances in a VPC.
 */
export class LoadBalancer extends Resource implements IConnectable, codedeploy.ILoadBalancer {
  /**
   * Control all connections from and to this load balancer
   */
  public readonly connections: Connections;

  /**
   * An object controlling specifically the connections for each listener added to this load balancer
   */
  public readonly listenerPorts: ListenerPort[] = [];

  private readonly elb: CfnLoadBalancer;
  private readonly securityGroup: SecurityGroup;
  private readonly listeners: CfnLoadBalancer.ListenersProperty[] = [];

  private readonly instancePorts: number[] = [];
  private readonly targets: ILoadBalancerTarget[] = [];

  constructor(scope: Construct, id: string, props: LoadBalancerProps) {
    super(scope, id);

    this.securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc: props.vpc, allowAllOutbound: false });
    this.connections = new Connections({ securityGroups: [this.securityGroup] });

    // Depending on whether the ELB has public or internal IPs, pick the right backend subnets
    const subnets: IVpcSubnet[] = props.internetFacing ? props.vpc.publicSubnets : props.vpc.privateSubnets;

    this.elb = new CfnLoadBalancer(this, 'Resource', {
      securityGroups: [ this.securityGroup.securityGroupId ],
      subnets: subnets.map(s => s.subnetId),
      listeners: new Token(() => this.listeners),
      scheme: props.internetFacing ? 'internet-facing' : 'internal',
      healthCheck: props.healthCheck && healthCheckToJSON(props.healthCheck),
    });
    if (props.internetFacing) {
      this.elb.node.addDependency(...subnets.map(s => s.internetConnectivityEstablished));
    }

    ifUndefined(props.listeners, []).forEach(b => this.addListener(b));
    ifUndefined(props.targets, []).forEach(t => this.addTarget(t));
  }

  /**
   * Add a backend to the load balancer
   *
   * @returns A ListenerPort object that controls connections to the listener port
   */
  public addListener(listener: LoadBalancerListener): ListenerPort {
    const protocol = ifUndefinedLazy(listener.externalProtocol, () => wellKnownProtocol(listener.externalPort));
    const instancePort = listener.internalPort || listener.externalPort;
    const instanceProtocol = ifUndefined(listener.internalProtocol,
                 ifUndefined(tryWellKnownProtocol(instancePort),
                 isHttpProtocol(protocol) ? LoadBalancingProtocol.Http : LoadBalancingProtocol.Tcp));

    this.listeners.push({
      loadBalancerPort: listener.externalPort.toString(),
      protocol,
      instancePort: instancePort.toString(),
      instanceProtocol,
      sslCertificateId: listener.sslCertificateId,
      policyNames: listener.policyNames
    });

    const port = new ListenerPort(this.securityGroup, new TcpPort(listener.externalPort));

    // Allow connections on the public port for all supplied peers (default: everyone)
    ifUndefined(listener.allowConnectionsFrom, [new AnyIPv4()]).forEach(peer => {
      port.connections.allowDefaultPortFrom(peer, `Default rule allow on ${listener.externalPort}`);
    });

    this.newInstancePort(instancePort);

    // Keep track using array so user can get to them even if they were all supplied in the constructor
    this.listenerPorts.push(port);

    return port;
  }

  public addTarget(target: ILoadBalancerTarget) {
    target.attachToClassicLB(this);

    this.newTarget(target);
  }

  /**
   * @attribute
   */
  public get loadBalancerName() {
    return this.elb.ref;
  }

  /**
   * @attribute
   */
  public get loadBalancerCanonicalHostedZoneNameId() {
    return this.elb.loadBalancerCanonicalHostedZoneNameId;
  }

  /**
   * @attribute
   */
  public get loadBalancerCanonicalHostedZoneName() {
    return this.elb.loadBalancerCanonicalHostedZoneName;
  }

  /**
   * @attribute
   */
  public get loadBalancerDnsName() {
    return this.elb.loadBalancerDnsName;
  }

  /**
   * @attribute
   */
  public get loadBalancerSourceSecurityGroupGroupName() {
    return this.elb.loadBalancerSourceSecurityGroupGroupName;
  }

  /**
   * @attribute
   */
  public get loadBalancerSourceSecurityGroupOwnerAlias() {
    return this.elb.loadBalancerSourceSecurityGroupOwnerAlias;
  }

  public asCodeDeployLoadBalancer(): codedeploy.ILoadBalancerProps {
    return {
      generation: codedeploy.LoadBalancerGeneration.First,
      name: this.loadBalancerName,
    };
  }

  /**
   * Allow connections to all existing targets on new instance port
   */
  private newInstancePort(instancePort: number) {
    this.targets.forEach(t => this.allowTargetConnection(instancePort, t));

    // Keep track of port for future targets
    this.instancePorts.push(instancePort);
  }

  /**
   * Allow connections to target on all existing instance ports
   */
  private newTarget(target: ILoadBalancerTarget) {
    this.instancePorts.forEach(p => this.allowTargetConnection(p, target));

    // Keep track of target for future listeners.
    this.targets.push(target);
  }

  /**
   * Allow connections for a single (port, target) pair
   */
  private allowTargetConnection(instancePort: number, target: ILoadBalancerTarget) {
    this.connections.allowTo(
      target,
      new TcpPort(instancePort),
      `Port ${instancePort} LB to fleet`);
  }
}

/**
 * Reference to a listener's port just created.
 *
 * This implements IConnectable with a default port (the port that an ELB
 * listener was just created on) for a given security group so that it can be
 * conveniently used just like any Connectable. E.g:
 *
 *    const listener = elb.addListener(...);
 *
 *    listener.connections.allowDefaultPortFromAnyIPv4();
 *    // or
 *    instance.connections.allowToDefaultPort(listener);
 */
export class ListenerPort implements IConnectable {
  public readonly connections: Connections;

  constructor(securityGroup: ISecurityGroup, defaultPortRange: IPortRange) {
    this.connections = new Connections({ securityGroups: [securityGroup] , defaultPortRange });
  }
}

function wellKnownProtocol(port: number): LoadBalancingProtocol {
  const proto = tryWellKnownProtocol(port);
  if (!proto) {
    throw new Error(`Please supply protocol to go with port ${port}`);
  }
  return proto;
}

function tryWellKnownProtocol(port: number): LoadBalancingProtocol | undefined {
  if (port === 80) { return LoadBalancingProtocol.Http; }
  if (port === 443) { return LoadBalancingProtocol.Https; }
  return undefined;
}

function isHttpProtocol(proto: LoadBalancingProtocol): boolean {
  return proto === LoadBalancingProtocol.Https || proto === LoadBalancingProtocol.Http;
}

function ifUndefined<T>(x: T | undefined, def: T): T {
  return x != null ? x : def;
}

function ifUndefinedLazy<T>(x: T | undefined, def: () => T): T {
  return x != null ? x : def();
}

/**
 * Turn health check parameters into a parameter blob for the LB
 */
function healthCheckToJSON(healthCheck: HealthCheck): CfnLoadBalancer.HealthCheckProperty {
  const protocol = ifUndefined(healthCheck.protocol,
           ifUndefined(tryWellKnownProtocol(healthCheck.port),
           LoadBalancingProtocol.Tcp));

  const path = protocol === LoadBalancingProtocol.Http || protocol === LoadBalancingProtocol.Https ? ifUndefined(healthCheck.path, "/") : "";

  const target = `${protocol.toUpperCase()}:${healthCheck.port}${path}`;

  return {
    healthyThreshold: ifUndefined(healthCheck.healthyThreshold, 2).toString(),
    interval: ifUndefined(healthCheck.interval, 30).toString(),
    target,
    timeout: ifUndefined(healthCheck.timeout, 5).toString(),
    unhealthyThreshold: ifUndefined(healthCheck.unhealthyThreshold, 5).toString(),
  };
}
