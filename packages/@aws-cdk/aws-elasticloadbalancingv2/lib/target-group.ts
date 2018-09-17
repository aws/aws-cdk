import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, TargetGroupArn, TargetGroupFullName, TargetGroupName } from './elasticloadbalancingv2.generated';
import { TargetGroupRef } from './target-group-ref';
import { Protocol } from './types';
import { Attributes, determineProtocolAndPort, renderAttributes } from './util';

export interface TargetGroupProps {
    /**
     * The approximate number of seconds between health checks for an individual target.
     *
     * @default 30
     */
    healthCheckIntervalSecs?: number;

    /**
     * The ping path destination where Elastic Load Balancing sends health check requests.
     *
     * @default /
     */
    healthCheckPath?: string;

    /**
     * The port that the load balancer uses when performing health checks on the targets.
     *
     * @default 'traffic-port'
     */
    healthCheckPort?: string;

    /**
     * The protocol the load balancer uses when performing health checks on targets.
     *
     * The TCP protocol is supported only if the protocol of the target group
     * is TCP.
     *
     * @default HTTP for ALBs, TCP for NLBs
     */
    healthCheckProtocol?: Protocol;

    /**
     * The amount of time, in seconds, during which no response from a target means a failed health check.
     *
     * For Application Load Balancers, the range is 2–60 seconds and the
     * default is 5 seconds. For Network Load Balancers, this is 10 seconds for
     * TCP and HTTPS health checks and 6 seconds for HTTP health checks.
     *
     * @default 5 for ALBs, 10 or 6 for NLBs
     */
    healthCheckTimeoutSeconds?: number;

    /**
     * The number of consecutive health checks successes required before considering an unhealthy target healthy.
     *
     * For Application Load Balancers, the default is 5. For Network Load Balancers, the default is 3.
     *
     * @default 5 for ALBs, 3 for NLBs
     */
    healthyThresholdCount?: number;

    /**
     * The number of consecutive health check failures required before considering a target unhealthy.
     *
     * For Application Load Balancers, the default is 2. For Network Load
     * Balancers, this value must be the same as the healthy threshold count.
     *
     * @default 2
     */
    unhealthyThresholdCount?: number;

    /**
     * HTTP code to use when checking for a successful response from a target.
     *
     * For Application Load Balancers, you can specify values between 200 and
     * 499, and the default value is 200. You can specify multiple values (for
     * example, "200,202") or a range of values (for example, "200-299").
     */
    healthyHttpCodes?: string;

    /**
     * The name of the target group.
     *
     * This name must be unique per region per account, can have a maximum of
     * 32 characters, must contain only alphanumeric characters or hyphens, and
     * must not begin or end with a hyphen.
     *
     * @default Automatically generated
     */
    targetGroupName?: string,

    /**
     * The port on which the targets receive traffic.
     *
     * This port is used unless you specify a port override when registering the target.
     *
     * @default Determined from Protocol if known.
     */
    port?: number;

    /**
     * The protocol to use for routing traffic to the targets.
     *
     * For Application Load Balancers, the supported protocols are HTTP and
     * HTTPS. For Network Load Balancers, the supported protocol is TCP.
     *
     * @default Determined from Port if known.
     */
    protocol?: Protocol;

    /**
     * The targets to add to this target group.
     *
     * Can be `Instance`, `IPAddress`, or any self-registering load balancing
     * target. If you use either `Instance` or `IPAddress` as targets, all
     * target must be of the same type.
     */
    targets?: ILoadBalancerTarget[];

    /**
     * The virtual private cloud (VPC).
     */
    vpc: ec2.VpcNetwork;

    /**
     * The amount of time for Elastic Load Balancing to wait before deregistering a target.
     *
     * The range is 0–3600 seconds.
     *
     * @default 300
     */
    deregistrationDelaySec?: number;

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
}

/**
 * Define the target of a load balancer
 */
export class TargetGroup extends TargetGroupRef {
    public readonly targetGroupArn: TargetGroupArn;
    public readonly targetGroupFullName: TargetGroupFullName;
    public readonly targetGroupName: TargetGroupName;

    private readonly attributes: Attributes = {};
    private readonly targetsJson = new Array<any>();
    private targetType?: TargetType;

    constructor(parent: cdk.Construct, id: string, props: TargetGroupProps) {
        super(parent, id);

        if (props.deregistrationDelaySec !== undefined) {
            this.setAttribute('deregistration_delay.timeout_seconds', props.deregistrationDelaySec.toString());
        }
        if (props.slowStartSec !== undefined) {
            this.setAttribute('slow_start.duration_seconds', props.slowStartSec.toString());
        }
        if (props.stickinessCookieDurationSec !== undefined) {
            this.setAttribute('stickiness.enabled', 'true');
            this.setAttribute('stickiness.type', 'lb_cookie');
            this.setAttribute('stickiness.lb_cookie.duration_seconds', props.stickinessCookieDurationSec.toString());
        }

        const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

        const resource = new cloudformation.TargetGroupResource(this, 'Resource', {
            targetGroupName: props.targetGroupName,
            protocol,
            port,
            targetGroupAttributes: new cdk.Token(() => renderAttributes(this.attributes)),
            targetType: new cdk.Token(() => this.targetType),
            targets: new cdk.Token(() => this.targetsJson),
            vpcId: props.vpc.vpcId,

            // HEALTH CHECK
            healthCheckIntervalSeconds: props.healthCheckIntervalSecs,
            healthCheckPath: props.healthCheckPath,
            healthCheckPort: props.healthCheckPort,
            healthCheckProtocol: props.healthCheckProtocol,
            healthCheckTimeoutSeconds: props.healthCheckTimeoutSeconds,
            healthyThresholdCount: props.healthyThresholdCount,
            matcher: props.healthyHttpCodes === undefined ? undefined : {
                httpCode: props.healthyHttpCodes
            },
        });

        this.targetGroupArn = resource.ref;
        this.targetGroupFullName = resource.targetGroupFullName;
        this.targetGroupName = resource.targetGroupName;

        (props.targets || []).forEach(this.addTarget.bind(this));
    }

    /**
     * Set a non-standard attribute on the target group
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
     */
    public setAttribute(key: string, value: string | undefined) {
        this.attributes[key] = value;
    }

    /**
     * Register the given load balancing target as part of this group
     */
    public addTarget(target: ILoadBalancerTarget) {
        const ret = target.attachToELBv2TargetGroup(this);
        if ((ret.targetType === TargetType.SelfRegistering) !== (ret.targetJson === undefined)) {
            throw new Error('Load balancing target should specify targetJson if and only if TargetType is not SelfRegistering');
        }
        if (ret.targetType !== TargetType.SelfRegistering) {
            if (this.targetType !== undefined && this.targetType !== ret.targetType) {
                throw new Error(`Already have a of type '${this.targetType}', adding '${ret.targetType}'; make all targets the same type.`);
            }
            this.targetType = ret.targetType;
        }

        if (ret.targetJson) {
            this.targetsJson.push(ret.targetJson);
        }
    }
}

/**
 * How to interpret the load balancing target identifiers
 */
export enum TargetType {
    /**
     * Targets identified by instance ID
     */
    Instance = 'instance',

    /**
     * Targets identified by IP address
     */
    Ip = 'ip',

    /**
     * A target that will register itself with the target group
     */
    SelfRegistering = 'self-registering',
}

/**
 * Interface that is going to be implemented by constructs that you can load balance to
 */
export interface ILoadBalancerTarget {
    /**
     * Attach load-balanced target to a TargetGroup
     *
     * May return JSON to directly add to the [Targets] list, or return undefined
     * if the target will register itself with the load balancer.
     */
    attachToELBv2TargetGroup(targetGroup: TargetGroupRef): LoadBalancerTargetProps;
}

/**
 * Result of attaching a target to load balancer
 */
export interface LoadBalancerTargetProps {
    /**
     * What kind of target this is
     */
    targetType: TargetType;

    /**
     * JSON representing the target's direct addition to the TargetGroup list
     */
    targetJson?: any;
}

/**
 * Properties for a load balancer target
 */
export interface TargetProps {
    /**
     * @default Automatic
     */
    availabilityZone?: string;

    /**
     * The ID of the target.
     *
     * If the target type of the target group is instance, specify an instance
     * ID. If the target type is ip, specify an IP address.
     */
    id: string;

    /**
     * Override the default port on which the target is listening
     */
    port?: number;
}

/**
 * An EC2 instance that is the target for load balancing
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can connect to the instance.
 */
export class Instance implements ILoadBalancerTarget {
    /**
     * Create a new Instance target
     *
     * @param instanceId Instance ID of the instance to register to
     * @param port Override the default port for the target group
     */
    constructor(private readonly instanceId: string, private readonly port?: number) {
    }

    public attachToELBv2TargetGroup(_targetGroup: TargetGroupRef): LoadBalancerTargetProps {
        return {
            targetType: TargetType.Instance,
            targetJson: { id: this.instanceId, port: this.port }
        };
    }
}

/**
 * An IP address that is a target for load balancing.
 *
 * Specify IP addresses from the subnets of the virtual private cloud (VPC) for
 * the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and
 * 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify
 * publicly routable IP addresses.
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can send packets to the IP address.
 */
export class IPAddress implements ILoadBalancerTarget {
    /**
     * Create a new IPAddress target
     *
     * The availabilityZone parameter determines whether the target receives
     * traffic from the load balancer nodes in the specified Availability Zone
     * or from all enabled Availability Zones for the load balancer.
     *
     * This parameter is not supported if the target type of the target group
     * is instance. If the IP address is in a subnet of the VPC for the target
     * group, the Availability Zone is automatically detected and this
     * parameter is optional. If the IP address is outside the VPC, this
     * parameter is required.
     *
     * With an Application Load Balancer, if the IP address is outside the VPC
     * for the target group, the only supported value is all.
     *
     * Default is automatic.
     *
     * @param ipAddress The IP Address to load balance to
     * @param port Override the group's default port
     * @param availabilityZone Availability zone to send traffic from
     */
    constructor(private readonly ipAddress: string, private readonly port?: number, private readonly availabilityZone?: string) {
    }

    public attachToELBv2TargetGroup(_targetGroup: TargetGroupRef): LoadBalancerTargetProps {
        return {
            targetType: TargetType.Ip,
            targetJson: { id: this.ipAddress, port: this.port, availabilityZone: this.availabilityZone }
        };
    }
}