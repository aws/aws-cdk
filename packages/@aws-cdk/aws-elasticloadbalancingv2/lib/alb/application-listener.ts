import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { ApplicationProtocol, SslPolicy } from '../shared/enums';
import { determineProtocolAndPort } from '../shared/util';
import { ApplicationListenerCertificate } from './application-listener-certificate';
import { ApplicationListenerRule } from './application-listener-rule';
import { IApplicationLoadBalancer } from './application-load-balancer';
import { ApplicationTargetGroup, IApplicationLoadBalancerTarget, IApplicationTargetGroup } from './application-target-group';

/**
 * Basic properties for an ApplicationListener
 */
export interface BaseApplicationListenerProps {
  /**
   * The protocol to use
   *
   * @default Determined from port if known
   */
  protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  port?: number;

  /**
   * The certificates to use on this listener
   */
  certificateArns?: string[];

  /**
   * The security policy that defines which ciphers and protocols are supported.
   *
   * @default the current predefined security policy.
   */
  sslPolicy?: SslPolicy;

  /**
   * Default target groups to load balance to
   *
   * @default None
   */
  defaultTargetGroups?: IApplicationTargetGroup[];

  /**
   * Allow anyone to connect to this listener
   *
   * If this is specified, the listener will be opened up to anyone who can reach it.
   * For internal load balancers this is anyone in the same VPC. For public load
   * balancers, this is anyone on the internet.
   *
   * If you want to be more selective about who can access this load
   * balancer, set this to `false` and use the listener's `connections`
   * object to selectively grant access to the listener.
   *
   * @default true
   */
  open?: boolean;
}

/**
 * Properties for defining a standalone ApplicationListener
 */
export interface ApplicationListenerProps extends BaseApplicationListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  loadBalancer: IApplicationLoadBalancer;
}

/**
 * Define an ApplicationListener
 */
export class ApplicationListener extends BaseListener implements IApplicationListener {
  /**
   * Import an existing listener
   */
  public static import(parent: cdk.Construct, id: string, props: ApplicationListenerRefProps): IApplicationListener {
    return new ImportedApplicationListener(parent, id, props);
  }

  /**
   * Manage connections to this ApplicationListener
   */
  public readonly connections: ec2.Connections;

  /**
   * ARNs of certificates added to this listener
   */
  private readonly certificateArns: string[];

  /**
   * Load balancer this listener is associated with
   */
  private readonly loadBalancer: IApplicationLoadBalancer;

  /**
   * Listener protocol for this listener.
   */
  private readonly protocol: ApplicationProtocol;

  /**
   * The default port on which this listener is listening
   */
  private readonly defaultPort: number;

  constructor(parent: cdk.Construct, id: string, props: ApplicationListenerProps) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

    super(parent, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      certificates: new cdk.Token(() => this.certificateArns.map(certificateArn => ({ certificateArn }))),
      protocol,
      port,
      sslPolicy: props.sslPolicy,
    });

    this.loadBalancer = props.loadBalancer;
    this.protocol = protocol;
    this.certificateArns = [];
    this.certificateArns.push(...(props.certificateArns || []));
    this.defaultPort = port;

    // This listener edits the securitygroup of the load balancer,
    // but adds its own default port.
    this.connections = new ec2.Connections({
      securityGroup: props.loadBalancer.connections.securityGroup,
      defaultPortRange: new ec2.TcpPort(port),
    });

    (props.defaultTargetGroups || []).forEach(this.addDefaultTargetGroup.bind(this));

    if (props.open) {
      this.connections.allowDefaultPortFrom(new ec2.AnyIPv4(), `Allow from anyone on port ${port}`);
    }
  }

  /**
   * Add one or more certificates to this listener.
   */
  public addCertificateArns(_id: string, arns: string[]): void {
    this.certificateArns.push(...arns);
  }

  /**
   * Load balance incoming requests to the given target groups.
   *
   * It's possible to add conditions to the TargetGroups added in this way.
   * At least one TargetGroup must be added without conditions.
   */
  public addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void {
    if ((props.hostHeader !== undefined || props.pathPattern !== undefined) !== (props.priority !== undefined)) {
      throw new Error(`Setting 'pathPattern' or 'hostHeader' also requires 'priority', and vice versa`);
    }

    if (props.priority !== undefined) {
      // New rule
      //
      // TargetGroup.registerListener is called inside ApplicationListenerRule.
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        hostHeader: props.hostHeader,
        pathPattern: props.pathPattern,
        priority: props.priority,
        targetGroups: props.targetGroups
      });
    } else {
      // New default target(s)
      for (const targetGroup of props.targetGroups) {
        this.addDefaultTargetGroup(targetGroup);
      }
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  public addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup {
    if (!this.loadBalancer.vpc) {
      // tslint:disable-next-line:max-line-length
      throw new Error('Can only call addTargets() when using a constructed Load Balancer; construct a new TargetGroup and use addTargetGroup');
    }

    const group = new ApplicationTargetGroup(this, id + 'Group', {
      deregistrationDelaySec: props.deregistrationDelaySec,
      healthCheck: props.healthCheck,
      port: props.port,
      protocol: props.protocol,
      slowStartSec: props.slowStartSec,
      stickinessCookieDurationSec: props.stickinessCookieDurationSec,
      targetGroupName: props.targetGroupName,
      targets: props.targets,
      vpc: this.loadBalancer.vpc,
    });

    this.addTargetGroups(id, {
      hostHeader: props.hostHeader,
      pathPattern: props.pathPattern,
      priority: props.priority,
      targetGroups: [group],
    });

    return group;
  }

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.IPortRange): void {
    this.connections.allowTo(connectable, portRange, 'Load balancer to target');
  }

  /**
   * Validate this listener.
   */
  public validate(): string[] {
    const errors = super.validate();
    if (this.protocol === ApplicationProtocol.Https && this.certificateArns.length === 0) {
      errors.push('HTTPS Listener needs at least one certificate (call addCertificateArns)');
    }
    return errors;
  }

  /**
   * Export this listener
   */
  public export(): ApplicationListenerRefProps {
    return {
      listenerArn: new cdk.Output(this, 'ListenerArn', { value: this.listenerArn }).makeImportValue().toString(),
      securityGroupId: this.connections.securityGroup!.export().securityGroupId,
      defaultPort: new cdk.Output(this, 'Port', { value: this.defaultPort }).makeImportValue().toString(),
    };
  }

  /**
   * Add a default TargetGroup
   */
  private addDefaultTargetGroup(targetGroup: IApplicationTargetGroup) {
    this._addDefaultTargetGroup(targetGroup);
    targetGroup.registerListener(this);
  }
}

/**
 * Properties to reference an existing listener
 */
export interface IApplicationListener extends ec2.IConnectable {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;

  /**
   * Add one or more certificates to this listener.
   */
  addCertificateArns(id: string, arns: string[]): void;

  /**
   * Load balance incoming requests to the given target groups.
   *
   * It's possible to add conditions to the TargetGroups added in this way.
   * At least one TargetGroup must be added without conditions.
   */
  addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void;

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup;

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  registerConnectable(connectable: ec2.IConnectable, portRange: ec2.IPortRange): void;
}

/**
 * Properties to reference an existing listener
 */
export interface ApplicationListenerRefProps {
  /**
   * ARN of the listener
   */
  listenerArn: string;

  /**
   * Security group ID of the load balancer this listener is associated with
   */
  securityGroupId: string;

  /**
   * The default port on which this listener is listening
   */
  defaultPort?: string;
}

class ImportedApplicationListener extends cdk.Construct implements IApplicationListener {
  public readonly connections: ec2.Connections;

  /**
   * ARN of the listener
   */
  public readonly listenerArn: string;

  constructor(parent: cdk.Construct, id: string, props: ApplicationListenerRefProps) {
    super(parent, id);

    this.listenerArn = props.listenerArn;

    const defaultPortRange = props.defaultPort !== undefined ? new ec2.TcpPortFromAttribute(props.defaultPort) : undefined;

    this.connections = new ec2.Connections({
      securityGroup: ec2.SecurityGroupRef.import(this, 'SecurityGroup', { securityGroupId: props.securityGroupId }),
      defaultPortRange,
    });
  }

  /**
   * Add one or more certificates to this listener.
   */
  public addCertificateArns(id: string, arns: string[]): void {
    new ApplicationListenerCertificate(this, id, {
      listener: this,
      certificateArns: arns
    });
  }

  /**
   * Load balance incoming requests to the given target groups.
   *
   * It's possible to add conditions to the TargetGroups added in this way.
   * At least one TargetGroup must be added without conditions.
   */
  public addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void {
    if ((props.hostHeader !== undefined || props.pathPattern !== undefined) !== (props.priority !== undefined)) {
      throw new Error(`Setting 'pathPattern' or 'hostHeader' also requires 'priority', and vice versa`);
    }

    if (props.priority !== undefined) {
      // New rule
      new ApplicationListenerRule(this, id, {
        listener: this,
        hostHeader: props.hostHeader,
        pathPattern: props.pathPattern,
        priority: props.priority,
        targetGroups: props.targetGroups
      });
    } else {
      throw new Error('Cannot add default Target Groups to imported ApplicationListener');
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  public addTargets(_id: string, _props: AddApplicationTargetsProps): ApplicationTargetGroup {
    // tslint:disable-next-line:max-line-length
    throw new Error('Can only call addTargets() when using a constructed ApplicationListener; construct a new TargetGroup and use addTargetGroup.');
  }

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.IPortRange): void {
    this.connections.allowTo(connectable, portRange, 'Load balancer to target');
  }
}

/**
 * Properties for adding a conditional load balancing rule
 */
export interface AddRuleProps {
  /**
   * Priority of this target group
   *
   * The rule with the lowest priority will be used for every request.
   * If priority is not given, these target groups will be added as
   * defaults, and must not have conditions.
   *
   * Priorities must be unique.
   *
   * @default Target groups are used as defaults
   */
  priority?: number;

  /**
   * Rule applies if the requested host matches the indicated host
   *
   * May contain up to three '*' wildcards.
   *
   * Requires that priority is set.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
   *
   * @default No host condition
   */
  hostHeader?: string;

  /**
   * Rule applies if the requested path matches the given path pattern
   *
   * May contain up to three '*' wildcards.
   *
   * Requires that priority is set.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   *
   * @default No path condition
   */
  pathPattern?: string;
}

/**
 * Properties for adding a new target group to a listener
 */
export interface AddApplicationTargetGroupsProps extends AddRuleProps {
  /**
   * Target groups to forward requests to
   */
  targetGroups: IApplicationTargetGroup[];
}

/**
 * Properties for adding new targets to a listener
 */
export interface AddApplicationTargetsProps extends AddRuleProps {
  /**
   * The protocol to use
   *
   * @default Determined from port if known
   */
  protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  port?: number;

  /**
   * The time period during which the load balancer sends a newly registered
   * target a linearly increasing share of the traffic to the target group.
   *
   * The range is 30–900 seconds (15 minutes).
   *
   * @default 0
   */
  slowStartSec?: number;

  /**
   * The stickiness cookie expiration period.
   *
   * Setting this value enables load balancer stickiness.
   *
   * After this period, the cookie is considered stale. The minimum value is
   * 1 second and the maximum value is 7 days (604800 seconds).
   *
   * @default 86400 (1 day)
   */
  stickinessCookieDurationSec?: number;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   */
  targets?: IApplicationLoadBalancerTarget[];

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
   * Health check configuration
   *
   * @default No health check
   */
  healthCheck?: HealthCheck;
}
