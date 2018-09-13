import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, TargetGroupArn, TargetGroupFullName, TargetGroupName } from './elasticloadbalancingv2.generated';
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
     * The type of target that you must specify when registering targets with this target group.
     *
     * The possible values are instance (targets are specified by instance ID)
     * or ip (targets are specified by IP address). The default is instance.
     * You can't specify targets for a target group using both instance IDs and
     * IP addresses.
     *
     * If the target type is ip, specify IP addresses from the subnets of the
     * virtual private cloud (VPC) for the target group, the RFC 1918 range
     * (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range
     * (100.64.0.0/10). You can't specify publicly routable IP addresses.
     *
     * @default Instance
     */
    targetType?: TargetType;

    /**
     * The targets to add to this target group.
     */
    targets?: TargetDescription[];

    /**
     * HTTP code to use when checking for a successful response from a target.
     *
     * For Application Load Balancers, you can specify values between 200 and
     * 499, and the default value is 200. You can specify multiple values (for
     * example, "200,202") or a range of values (for example, "200-299").
     */
    healthyHttpCodes?: string;

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
     * The time period during which the load balancer sends a newly registered target a linearly increasing share of the traffic to the target group.
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

export interface TargetDescription {
    /**
     * An Availability Zone or all.
     *
     * This determines whether the target receives traffic from the load
     * balancer nodes in the specified Availability Zone or from all enabled
     * Availability Zones for the load balancer.
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
 * Define the target of a load balancer
 */
export class TargetGroup extends cdk.Construct {
    public readonly targetGroupArn: TargetGroupArn;
    public readonly targetGroupFullName: TargetGroupFullName;
    public readonly targetGroupName: TargetGroupName;

    private readonly attributes: Attributes = {};

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
            targetType: props.targetType,
            targets: props.targets,
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
    }

    /**
     * Set a non-standard attribute on the target group
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
     */
    public setAttribute(key: string, value: string | undefined) {
        this.attributes[key] = value;
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
    Ip = 'ip'
}