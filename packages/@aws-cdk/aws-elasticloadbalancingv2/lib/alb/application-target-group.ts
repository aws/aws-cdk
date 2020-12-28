import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Annotations, Duration } from '@aws-cdk/core';
import { IConstruct, Construct } from 'constructs';
import { ApplicationELBMetrics } from '../elasticloadbalancingv2-canned-metrics.generated';
import {
  BaseTargetGroupProps, ITargetGroup, loadBalancerNameFromListenerArn, LoadBalancerTargetProps,
  TargetGroupAttributes, TargetGroupBase, TargetGroupImportProps,
} from '../shared/base-target-group';
import { ApplicationProtocol, Protocol, TargetType } from '../shared/enums';
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
   * @default - Determined from port if known, optional for Lambda targets.
   */
  readonly protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default - Determined from protocol if known, optional for Lambda targets.
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
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   *
   * @default - No targets.
   */
  readonly targets?: IApplicationLoadBalancerTarget[];
}

/**
 * Define an Application Target Group
 */
export class ApplicationTargetGroup extends TargetGroupBase implements IApplicationTargetGroup {
  /**
   * Import an existing target group
   */
  public static fromTargetGroupAttributes(scope: Construct, id: string, attrs: TargetGroupAttributes): IApplicationTargetGroup {
    return new ImportedApplicationTargetGroup(scope, id, attrs);
  }

  /**
   * Import an existing target group
   *
   * @deprecated Use `fromTargetGroupAttributes` instead
   */
  public static import(scope: Construct, id: string, props: TargetGroupImportProps): IApplicationTargetGroup {
    return ApplicationTargetGroup.fromTargetGroupAttributes(scope, id, props);
  }

  private readonly connectableMembers: ConnectableMember[];
  private readonly listeners: IApplicationListener[];
  private readonly protocol?: ApplicationProtocol;
  private readonly port?: number;

  constructor(scope: Construct, id: string, props: ApplicationTargetGroupProps = {}) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);
    super(scope, id, { ...props }, {
      protocol,
      port,
    });

    this.protocol = protocol;
    this.port = port;

    this.connectableMembers = [];
    this.listeners = [];

    if (props) {
      if (props.slowStart !== undefined) {
        this.setAttribute('slow_start.duration_seconds', props.slowStart.toSeconds().toString());
      }
      if (props.stickinessCookieDuration !== undefined) {
        this.enableCookieStickiness(props.stickinessCookieDuration);
      }
      this.addTarget(...(props.targets || []));
    }
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
  public enableCookieStickiness(duration: Duration) {
    this.setAttribute('stickiness.enabled', 'true');
    this.setAttribute('stickiness.type', 'lb_cookie');
    this.setAttribute('stickiness.lb_cookie.duration_seconds', duration.toSeconds().toString());
  }

  /**
   * Register a connectable as a member of this target group.
   *
   * Don't call this directly. It will be called by load balancing targets.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange?: ec2.Port) {
    portRange = portRange || ec2.Port.tcp(this.defaultPort);

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
  public registerListener(listener: IApplicationListener, associatingConstruct?: IConstruct) {
    // Notify this listener of all connectables that we know about.
    // Then remember for new connectables that might get added later.
    for (const member of this.connectableMembers) {
      listener.registerConnectable(member.connectable, member.portRange);
    }
    this.listeners.push(listener);
    this.loadBalancerAttachedDependencies.add(associatingConstruct ?? listener);
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
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName,
      dimensions: {
        TargetGroup: this.targetGroupFullName,
        LoadBalancer: this.firstLoadBalancerFullName,
      },
      ...props,
    }).attachTo(this);
  }

  /**
   * The number of IPv6 requests received by the target group
   *
   * @default Sum over 5 minutes
   */
  public metricIpv6RequestCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.iPv6RequestCountSum, props);
  }

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCount(props?: cloudwatch.MetricOptions) {
    return this.cannedMetric(ApplicationELBMetrics.requestCountSum, props);
  }

  /**
   * The number of healthy hosts in the target group
   *
   * @default Average over 5 minutes
   */
  public metricHealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('HealthyHostCount', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of unhealthy hosts in the target group
   *
   * @default Average over 5 minutes
   */
  public metricUnhealthyHostCount(props?: cloudwatch.MetricOptions) {
    return this.metric('UnHealthyHostCount', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets in this target group.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The average number of requests received by each target in a target group.
   *
   * The only valid statistic is Sum. Note that this represents the average not the sum.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCountPerTarget(props?: cloudwatch.MetricOptions) {
    return this.metric('RequestCountPerTarget', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetConnectionErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetConnectionErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   */
  public metricTargetResponseTime(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetResponseTime', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetTLSNegotiationErrorCount(props?: cloudwatch.MetricOptions) {
    return this.metric('TargetTLSNegotiationErrorCount', {
      statistic: 'Sum',
      ...props,
    });
  }

  protected validateTargetGroup(): string[] {
    const ret = super.validateTargetGroup();

    if (this.targetType !== undefined && this.targetType !== TargetType.LAMBDA
      && (this.protocol === undefined || this.port === undefined)) {
      ret.push('At least one of \'port\' or \'protocol\' is required for a non-Lambda TargetGroup');
    }

    if (this.healthCheck && this.healthCheck.protocol && !ALB_HEALTH_CHECK_PROTOCOLS.includes(this.healthCheck.protocol)) {
      ret.push([
        `Health check protocol '${this.healthCheck.protocol}' is not supported. `,
        `Must be one of [${ALB_HEALTH_CHECK_PROTOCOLS.join(', ')}]`,
      ].join(''));
    }

    return ret;
  }

  private cannedMetric(
    fn: (dims: { LoadBalancer: string, TargetGroup: string }) => cloudwatch.MetricProps,
    props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      ...fn({
        LoadBalancer: this.firstLoadBalancerFullName,
        TargetGroup: this.targetGroupFullName,
      }),
      ...props,
    }).attachTo(this);
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
  portRange: ec2.Port;
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
  registerListener(listener: IApplicationListener, associatingConstruct?: IConstruct): void;

  /**
   * Register a connectable as a member of this target group.
   *
   * Don't call this directly. It will be called by load balancing targets.
   */
  registerConnectable(connectable: ec2.IConnectable, portRange?: ec2.Port): void;

  /**
   * Add a load balancing target to this target group
   */
  addTarget(...targets: IApplicationLoadBalancerTarget[]): void;
}

/**
 * An imported application target group
 */
class ImportedApplicationTargetGroup extends ImportedTargetGroupBase implements IApplicationTargetGroup {
  public registerListener(_listener: IApplicationListener, _associatingConstruct?: IConstruct) {
    // Nothing to do, we know nothing of our members
    Annotations.of(this).addWarning('Cannot register listener on imported target group -- security groups might need to be updated manually');
  }

  public registerConnectable(_connectable: ec2.IConnectable, _portRange?: ec2.Port | undefined): void {
    Annotations.of(this).addWarning('Cannot register connectable on imported target group -- security groups might need to be updated manually');
  }

  public addTarget(...targets: IApplicationLoadBalancerTarget[]) {
    for (const target of targets) {
      const result = target.attachToApplicationTargetGroup(this);

      if (result.targetJson !== undefined) {
        throw new Error('Cannot add a non-self registering target to an imported TargetGroup. Create a new TargetGroup instead.');
      }
    }
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
  attachToApplicationTargetGroup(targetGroup: IApplicationTargetGroup): LoadBalancerTargetProps;
}

const ALB_HEALTH_CHECK_PROTOCOLS = [Protocol.HTTP, Protocol.HTTPS];
