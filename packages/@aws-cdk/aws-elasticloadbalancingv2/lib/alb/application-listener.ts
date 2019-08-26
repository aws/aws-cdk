import ec2 = require('@aws-cdk/aws-ec2');
import { Construct, Duration, IResource, Lazy, Resource } from '@aws-cdk/core';
import { BaseListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { ApplicationProtocol, SslPolicy } from '../shared/enums';
import { determineProtocolAndPort } from '../shared/util';
import { ApplicationListenerCertificate } from './application-listener-certificate';
import { ApplicationListenerRule, FixedResponse, validateFixedResponse } from './application-listener-rule';
import { IApplicationLoadBalancer } from './application-load-balancer';
import { ApplicationTargetGroup, IApplicationLoadBalancerTarget, IApplicationTargetGroup } from './application-target-group';

/**
 * Basic properties for an ApplicationListener
 */
export interface BaseApplicationListenerProps {
  /**
   * The protocol to use
   *
   * @default - Determined from port if known.
   */
  readonly protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default - Determined from protocol if known.
   */
  readonly port?: number;

  /**
   * The certificates to use on this listener
   *
   * @default - No certificates.
   */
  readonly certificateArns?: string[];

  /**
   * The security policy that defines which ciphers and protocols are supported.
   *
   * @default - The current predefined security policy.
   */
  readonly sslPolicy?: SslPolicy;

  /**
   * Default target groups to load balance to
   *
   * @default - None.
   */
  readonly defaultTargetGroups?: IApplicationTargetGroup[];

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
  readonly open?: boolean;
}

/**
 * Properties for defining a standalone ApplicationListener
 */
export interface ApplicationListenerProps extends BaseApplicationListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  readonly loadBalancer: IApplicationLoadBalancer;
}

/**
 * Define an ApplicationListener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export class ApplicationListener extends BaseListener implements IApplicationListener {
  /**
   * Import an existing listener
   */
  public static fromApplicationListenerAttributes(scope: Construct, id: string, attrs: ApplicationListenerAttributes): IApplicationListener {
    return new ImportedApplicationListener(scope, id, attrs);
  }

  /**
   * Manage connections to this ApplicationListener
   */
  public readonly connections: ec2.Connections;

  /**
   * Load balancer this listener is associated with
   */
  public readonly loadBalancer: IApplicationLoadBalancer;

  /**
   * ARNs of certificates added to this listener
   */
  private readonly certificateArns: string[];

  /**
   * Listener protocol for this listener.
   */
  private readonly protocol: ApplicationProtocol;

  constructor(scope: Construct, id: string, props: ApplicationListenerProps) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);
    if (protocol === undefined || port === undefined) {
      throw new Error(`At least one of 'port' or 'protocol' is required`);
    }

    super(scope, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      certificates: Lazy.anyValue({ produce: () => this.certificateArns.map(certificateArn => ({ certificateArn })) }, { omitEmptyArray: true}),
      protocol,
      port,
      sslPolicy: props.sslPolicy,
    });

    this.loadBalancer = props.loadBalancer;
    this.protocol = protocol;
    this.certificateArns = [];
    this.certificateArns.push(...(props.certificateArns || []));

    // This listener edits the securitygroup of the load balancer,
    // but adds its own default port.
    this.connections = new ec2.Connections({
      securityGroups: props.loadBalancer.connections.securityGroups,
      defaultPort: ec2.Port.tcp(port),
    });

    (props.defaultTargetGroups || []).forEach(this.addDefaultTargetGroup.bind(this));

    if (props.open !== false) {
      this.connections.allowDefaultPortFrom(ec2.Peer.anyIpv4(), `Allow from anyone on port ${port}`);
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
    checkAddRuleProps(props);

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
      deregistrationDelay: props.deregistrationDelay,
      healthCheck: props.healthCheck,
      port: props.port,
      protocol: props.protocol,
      slowStart: props.slowStart,
      stickinessCookieDuration: props.stickinessCookieDuration,
      targetGroupName: props.targetGroupName,
      targets: props.targets,
      vpc: this.loadBalancer.vpc
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
   * Add a fixed response
   */
  public addFixedResponse(id: string, props: AddFixedResponseProps) {
    checkAddRuleProps(props);

    const fixedResponse: FixedResponse = {
      statusCode: props.statusCode,
      contentType: props.contentType,
      messageBody: props.messageBody
    };

    validateFixedResponse(fixedResponse);

    if (props.priority) {
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        priority: props.priority,
        fixedResponse,
        ...props
      });
    } else {
      this._addDefaultAction({
        fixedResponseConfig: fixedResponse,
        type: 'fixed-response'
      });
    }
  }

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void {
    this.connections.allowTo(connectable, portRange, 'Load balancer to target');
  }

  /**
   * Validate this listener.
   */
  protected validate(): string[] {
    const errors = super.validate();
    if (this.protocol === ApplicationProtocol.HTTPS && this.certificateArns.length === 0) {
      errors.push('HTTPS Listener needs at least one certificate (call addCertificateArns)');
    }
    return errors;
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
export interface IApplicationListener extends IResource, ec2.IConnectable {
  /**
   * ARN of the listener
   * @attribute
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
  registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void;
}

/**
 * Properties to reference an existing listener
 */
export interface ApplicationListenerAttributes {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;

  /**
   * Security group ID of the load balancer this listener is associated with
   */
  readonly securityGroupId: string;

  /**
   * The default port on which this listener is listening
   */
  readonly defaultPort?: number;

  /**
   * Whether the security group allows all outbound traffic or not
   *
   * Unless set to `false`, no egress rules will be added to the security group.
   *
   * @default true
   */
  readonly securityGroupAllowsAllOutbound?: boolean;
}

class ImportedApplicationListener extends Resource implements IApplicationListener {
  public readonly connections: ec2.Connections;

  /**
   * ARN of the listener
   */
  public readonly listenerArn: string;

  constructor(scope: Construct, id: string, props: ApplicationListenerAttributes) {
    super(scope, id);

    this.listenerArn = props.listenerArn;

    const defaultPort = props.defaultPort !== undefined ? ec2.Port.tcp(props.defaultPort) : undefined;

    this.connections = new ec2.Connections({
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', props.securityGroupId, {
        allowAllOutbound: props.securityGroupAllowsAllOutbound
      })],
      defaultPort,
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
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void {
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
  readonly priority?: number;

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
  readonly hostHeader?: string;

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
  readonly pathPattern?: string;
}

/**
 * Properties for adding a new target group to a listener
 */
export interface AddApplicationTargetGroupsProps extends AddRuleProps {
  /**
   * Target groups to forward requests to
   */
  readonly targetGroups: IApplicationTargetGroup[];
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
  readonly protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  readonly port?: number;

  /**
   * The time period during which the load balancer sends a newly registered
   * target a linearly increasing share of the traffic to the target group.
   *
   * The range is 30-900 seconds (15 minutes).
   *
   * @default 0
   */
  readonly slowStart?: Duration;

  /**
   * The stickiness cookie expiration period.
   *
   * Setting this value enables load balancer stickiness.
   *
   * After this period, the cookie is considered stale. The minimum value is
   * 1 second and the maximum value is 7 days (604800 seconds).
   *
   * @default Duration.days(1)
   */
  readonly stickinessCookieDuration?: Duration;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. All target must be of the same type.
   */
  readonly targets?: IApplicationLoadBalancerTarget[];

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
   * @default Duration.minutes(5)
   */
  readonly deregistrationDelay?: Duration;

  /**
   * Health check configuration
   *
   * @default No health check
   */
  readonly healthCheck?: HealthCheck;
}

/**
 * Properties for adding a fixed response to a listener
 */
export interface AddFixedResponseProps extends AddRuleProps, FixedResponse {
}

function checkAddRuleProps(props: AddRuleProps) {
  if ((props.hostHeader !== undefined || props.pathPattern !== undefined) !== (props.priority !== undefined)) {
    throw new Error(`Setting 'pathPattern' or 'hostHeader' also requires 'priority', and vice versa`);
  }
}
