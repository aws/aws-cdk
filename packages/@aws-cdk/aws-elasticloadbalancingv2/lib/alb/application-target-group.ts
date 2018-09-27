import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseTargetGroup, BaseTargetGroupProps, ITargetGroup, LoadBalancerTargetProps, TargetGroupRefProps } from '../shared/base-target-group';
import { ApplicationProtocol } from '../shared/enums';
import { BaseImportedTargetGroup } from '../shared/imported';
import { determineProtocolAndPort } from '../shared/util';
import { IApplicationListener } from './application-listener';

/**
 * Properties for defining an Application Target Group
 */
export interface ApplicationTargetGroupProps extends BaseTargetGroupProps {
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
}

/**
 * Define an Application Target Group
 */
export class ApplicationTargetGroup extends BaseTargetGroup {
  /**
   * Import an existing target group
   */
  public static import(parent: cdk.Construct, id: string, props: TargetGroupRefProps): IApplicationTargetGroup {
    return new ImportedApplicationTargetGroup(parent, id, props);
  }

  private readonly connectableMembers: ConnectableMember[];
  private readonly listeners: IApplicationListener[];

  constructor(parent: cdk.Construct, id: string, props: ApplicationTargetGroupProps) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

    super(parent, id, props, {
      protocol,
      port,
    });

    this.connectableMembers = [];
    this.listeners = [];

    if (props.slowStartSec !== undefined) {
      this.setAttribute('slow_start.duration_seconds', props.slowStartSec.toString());
    }
    if (props.stickinessCookieDurationSec !== undefined) {
      this.enableCookieStickiness(props.stickinessCookieDurationSec);
    }

    this.addTarget(...(props.targets || []));
  }

  /**
   * Add a load balancing target to this target group
   */
  public addTarget(...targets: IApplicationLoadBalancerTarget[]) {
    for (const target of targets) {
      const result = target.attachToApplicationTargetGroup(this);
      this.addLoadBalancerTarget(result);
    }
  }

  /**
   * Enable sticky routing via a cookie to members of this target group
   */
  public enableCookieStickiness(durationSec: number) {
    this.setAttribute('stickiness.enabled', 'true');
    this.setAttribute('stickiness.type', 'lb_cookie');
    this.setAttribute('stickiness.lb_cookie.duration_seconds', durationSec.toString());
  }

  /**
   * Register a connectable as a member of this target group.
   *
   * Don't call this directly. It will be called by load balancing targets.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange?: ec2.IPortRange) {
    if (portRange === undefined) {
      if (cdk.unresolved(this.defaultPort)) {
        portRange = new ec2.TcpPortFromAttribute(this.defaultPort);
      } else {
        portRange = new ec2.TcpPort(parseInt(this.defaultPort, 10));
      }
    }

    // Notify all listeners that we already know about of this new connectable.
    // Then remember for new listeners that might get added later.
    this.connectableMembers.push({ connectable, portRange });
    for (const listener of this.listeners) {
      listener.registerConnectable(connectable, portRange);
    }
  }

  /**
   * Register a listener that is load balancing to this target group.
   *
   * Don't call this directly. It will be called by listeners.
   */
  public registerListener(listener: IApplicationListener) {
    // Notify this listener of all connectables that we know about.
    // Then remember for new connectables that might get added later.
    for (const member of this.connectableMembers) {
      listener.registerConnectable(member.connectable, member.portRange);
    }
    this.listeners.push(listener);
  }
}

/**
 * A connectable member of a target group
 */
interface ConnectableMember {
  /**
   * The connectable member
   */
  connectable: ec2.IConnectable;

  /**
   * The port (range) the member is listening on
   */
  portRange: ec2.IPortRange;
}

/**
 * A Target Group for Application Load Balancers
 */
export interface IApplicationTargetGroup extends ITargetGroup {
  /**
   * Register a listener that is load balancing to this target group.
   *
   * Don't call this directly. It will be called by listeners.
   */
  registerListener(listener: IApplicationListener): void;
}

/**
 * An imported application target group
 */
class ImportedApplicationTargetGroup extends BaseImportedTargetGroup implements IApplicationTargetGroup {
  public registerListener(_listener: IApplicationListener) {
    // Nothing to do, we know nothing of our members
  }
}

/**
 * Interface for constructs that can be targets of an application load balancer
 */
export interface IApplicationLoadBalancerTarget {
  /**
   * Attach load-balanced target to a TargetGroup
   *
   * May return JSON to directly add to the [Targets] list, or return undefined
   * if the target will register itself with the load balancer.
   */
  attachToApplicationTargetGroup(targetGroup: ApplicationTargetGroup): LoadBalancerTargetProps;
}
