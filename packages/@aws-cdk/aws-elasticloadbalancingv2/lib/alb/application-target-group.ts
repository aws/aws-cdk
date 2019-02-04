import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseTargetGroupProps, ITargetGroup, loadBalancerNameFromListenerArn, LoadBalancerTargetProps,
         TargetGroupBase, TargetGroupImportProps } from '../shared/base-target-group';
import { ApplicationProtocol } from '../shared/enums';
import { ImportedTargetGroupBase } from '../shared/imported';
import { determineProtocolAndPort } from '../shared/util';
import { IApplicationListener } from './application-listener';
import { HttpCodeTarget } from './application-load-balancer';

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
export class ApplicationTargetGroup extends TargetGroupBase {
  /**
   * Import an existing target group
   */
  public static import(scope: cdk.Construct, id: string, props: TargetGroupImportProps): IApplicationTargetGroup {
    return new ImportedApplicationTargetGroup(scope, id, props);
  }

  private readonly connectableMembers: ConnectableMember[];
  private readonly listeners: IApplicationListener[];

  constructor(scope: cdk.Construct, id: string, props: ApplicationTargetGroupProps) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

    super(scope, id, props, {
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
  public registerListener(listener: IApplicationListener, associatingConstruct?: cdk.IConstruct) {
    // Notify this listener of all connectables that we know about.
    // Then remember for new connectables that might get added later.
    for (const member of this.connectableMembers) {
      listener.registerConnectable(member.connectable, member.portRange);
    }
    this.listeners.push(listener);
    this.loadBalancerAttachedDependencies.add(associatingConstruct || listener);
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

  /**
   * Return the given named metric for this Application Load Balancer Target Group
   *
   * Returns the metric for this target group from the point of view of the first
   * load balancer load balancing to it. If you have multiple load balancers load
   * sending traffic to the same target group, you will have to override the dimensions
   * on this metric.
   *
   * @default Average over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName,
      dimensions: {
        TargetGroup: this.targetGroupFullName,
        LoadBalancer: this.firstLoadBalancerFullName,
      },
      ...props
    });
  }

  /**
   * The number of IPv6 requests received by the target group
   *
   * @default Sum over 5 minutes
   */
  public metricIPv6RequestCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('IPv6RequestCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('RequestCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of healthy hosts in the target group
   *
   * @default Average over 5 minutes
   */
  public metricHealthyHostCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('HealthyHostCount', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of unhealthy hosts in the target group
   *
   * @default Average over 5 minutes
   */
  public metricUnhealthyHostCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('UnhealthyHostCount', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets in this target group.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricCustomization) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The average number of requests received by each target in a target group.
   *
   * The only valid statistic is Sum. Note that this represents the average not the sum.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCountPerTarget(props?: cloudwatch.MetricCustomization) {
    return this.metric('RequestCountPerTarget', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetConnectionErrorCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetConnectionErrorCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   */
  public metricTargetResponseTime(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetResponseTime', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetTLSNegotiationErrorCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetTLSNegotiationErrorCount', {
      statistic: 'Sum',
      ...props
    });
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
  registerListener(listener: IApplicationListener, associatingConstruct?: cdk.IConstruct): void;
}

/**
 * An imported application target group
 */
class ImportedApplicationTargetGroup extends ImportedTargetGroupBase implements IApplicationTargetGroup {
  public registerListener(_listener: IApplicationListener, _associatingConstruct?: cdk.IConstruct) {
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
