"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationTargetGroup = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const elasticloadbalancingv2_canned_metrics_generated_1 = require("../elasticloadbalancingv2-canned-metrics.generated");
const base_target_group_1 = require("../shared/base-target-group");
const enums_1 = require("../shared/enums");
const imported_1 = require("../shared/imported");
const util_1 = require("../shared/util");
/**
 * The metrics for a Application Load Balancer.
 */
class ApplicationTargetGroupMetrics {
    constructor(scope, targetGroupFullName, loadBalancerFullName) {
        this.scope = scope;
        this.targetGroupFullName = targetGroupFullName;
        this.loadBalancerFullName = loadBalancerFullName;
    }
    custom(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ApplicationELB',
            metricName,
            dimensionsMap: {
                TargetGroup: this.targetGroupFullName,
                LoadBalancer: this.loadBalancerFullName,
            },
            ...props,
        }).attachTo(this.scope);
    }
    ipv6RequestCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.iPv6RequestCountSum, props);
    }
    requestCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.requestCountSum, props);
    }
    healthyHostCount(props) {
        return this.custom('HealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
    unhealthyHostCount(props) {
        return this.custom('UnHealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
    httpCodeTarget(code, props) {
        return this.custom(code, {
            statistic: 'Sum',
            ...props,
        });
    }
    requestCountPerTarget(props) {
        return this.custom('RequestCountPerTarget', {
            statistic: 'Sum',
            ...props,
        });
    }
    targetConnectionErrorCount(props) {
        return this.custom('TargetConnectionErrorCount', {
            statistic: 'Sum',
            ...props,
        });
    }
    targetResponseTime(props) {
        return this.custom('TargetResponseTime', {
            statistic: 'Average',
            ...props,
        });
    }
    targetTLSNegotiationErrorCount(props) {
        return this.custom('TargetTLSNegotiationErrorCount', {
            statistic: 'Sum',
            ...props,
        });
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({
                LoadBalancer: this.loadBalancerFullName,
                TargetGroup: this.targetGroupFullName,
            }),
            ...props,
        }).attachTo(this.scope);
    }
}
/**
 * Define an Application Target Group
 */
class ApplicationTargetGroup extends base_target_group_1.TargetGroupBase {
    constructor(scope, id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationTargetGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApplicationTargetGroup);
            }
            throw error;
        }
        const [protocol, port] = util_1.determineProtocolAndPort(props.protocol, props.port);
        const { protocolVersion } = props;
        super(scope, id, { ...props }, {
            protocol,
            protocolVersion,
            port,
        });
        this.protocol = protocol;
        this.port = port;
        // this.targetType is lazy
        this.node.addValidation({
            validate: () => {
                if (this.targetType === enums_1.TargetType.LAMBDA && (this.port || this.protocol)) {
                    return ['port/protocol should not be specified for Lambda targets'];
                }
                else {
                    return [];
                }
            },
        });
        this.connectableMembers = [];
        this.listeners = [];
        if (props) {
            if (props.slowStart !== undefined) {
                if (props.slowStart.toSeconds() < 30 || props.slowStart.toSeconds() > 900) {
                    throw new Error('Slow start duration value must be between 30 and 900 seconds.');
                }
                this.setAttribute('slow_start.duration_seconds', props.slowStart.toSeconds().toString());
            }
            if (props.stickinessCookieDuration) {
                this.enableCookieStickiness(props.stickinessCookieDuration, props.stickinessCookieName);
            }
            else {
                this.setAttribute('stickiness.enabled', 'false');
            }
            if (props.loadBalancingAlgorithmType) {
                this.setAttribute('load_balancing.algorithm.type', props.loadBalancingAlgorithmType);
            }
            this.addTarget(...(props.targets || []));
        }
    }
    /**
     * Import an existing target group
     */
    static fromTargetGroupAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_TargetGroupAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromTargetGroupAttributes);
            }
            throw error;
        }
        return new ImportedApplicationTargetGroup(scope, id, attrs);
    }
    /**
     * Import an existing target group
     *
     * @deprecated Use `fromTargetGroupAttributes` instead
     */
    static import(scope, id, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#import", "Use `fromTargetGroupAttributes` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_TargetGroupImportProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.import);
            }
            throw error;
        }
        return ApplicationTargetGroup.fromTargetGroupAttributes(scope, id, props);
    }
    get metrics() {
        if (!this._metrics) {
            this._metrics = new ApplicationTargetGroupMetrics(this, this.targetGroupFullName, this.firstLoadBalancerFullName);
        }
        return this._metrics;
    }
    /**
     * Add a load balancing target to this target group
     */
    addTarget(...targets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationLoadBalancerTarget(targets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTarget);
            }
            throw error;
        }
        for (const target of targets) {
            const result = target.attachToApplicationTargetGroup(this);
            this.addLoadBalancerTarget(result);
        }
        if (this.targetType === enums_1.TargetType.LAMBDA) {
            this.setAttribute('stickiness.enabled', undefined);
        }
    }
    /**
     * Enable sticky routing via a cookie to members of this target group.
     *
     * Note: If the `cookieName` parameter is set, application-based stickiness will be applied,
     * otherwise it defaults to duration-based stickiness attributes (`lb_cookie`).
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html
     */
    enableCookieStickiness(duration, cookieName) {
        if (duration.toSeconds() < 1 || duration.toSeconds() > 604800) {
            throw new Error('Stickiness cookie duration value must be between 1 second and 7 days (604800 seconds).');
        }
        if (cookieName !== undefined) {
            if (!core_1.Token.isUnresolved(cookieName) && (cookieName.startsWith('AWSALB') || cookieName.startsWith('AWSALBAPP') || cookieName.startsWith('AWSALBTG'))) {
                throw new Error('App cookie names that start with the following prefixes are not allowed: AWSALB, AWSALBAPP, and AWSALBTG; they\'re reserved for use by the load balancer.');
            }
            if (cookieName === '') {
                throw new Error('App cookie name cannot be an empty string.');
            }
        }
        this.setAttribute('stickiness.enabled', 'true');
        if (cookieName) {
            this.setAttribute('stickiness.type', 'app_cookie');
            this.setAttribute('stickiness.app_cookie.cookie_name', cookieName);
            this.setAttribute('stickiness.app_cookie.duration_seconds', duration.toSeconds().toString());
        }
        else {
            this.setAttribute('stickiness.type', 'lb_cookie');
            this.setAttribute('stickiness.lb_cookie.duration_seconds', duration.toSeconds().toString());
        }
    }
    /**
     * Register a connectable as a member of this target group.
     *
     * Don't call this directly. It will be called by load balancing targets.
     */
    registerConnectable(connectable, portRange) {
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
    registerListener(listener, associatingConstruct) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationListener(listener);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerListener);
            }
            throw error;
        }
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
    get firstLoadBalancerFullName() {
        if (this.listeners.length === 0) {
            throw new Error('The TargetGroup needs to be attached to a LoadBalancer before you can call this method');
        }
        return base_target_group_1.loadBalancerNameFromListenerArn(this.listeners[0].listenerArn);
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
    metric(metricName, props) {
        return this.metrics.custom(metricName, props);
    }
    /**
     * The number of IPv6 requests received by the target group
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.ipv6RequestCount`` instead
     */
    metricIpv6RequestCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricIpv6RequestCount", "Use ``ApplicationTargetGroup.metrics.ipv6RequestCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricIpv6RequestCount);
            }
            throw error;
        }
        return this.metrics.ipv6RequestCount(props);
    }
    /**
     * The number of requests processed over IPv4 and IPv6.
     *
     * This count includes only the requests with a response generated by a target of the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.requestCount`` instead
     */
    metricRequestCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricRequestCount", "Use ``ApplicationTargetGroup.metrics.requestCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricRequestCount);
            }
            throw error;
        }
        return this.metrics.requestCount(props);
    }
    /**
     * The number of healthy hosts in the target group
     *
     * @default Average over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.healthyHostCount`` instead
     */
    metricHealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricHealthyHostCount", "Use ``ApplicationTargetGroup.metrics.healthyHostCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHealthyHostCount);
            }
            throw error;
        }
        return this.metrics.healthyHostCount(props);
    }
    /**
     * The number of unhealthy hosts in the target group
     *
     * @default Average over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.unhealthyHostCount`` instead
     */
    metricUnhealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricUnhealthyHostCount", "Use ``ApplicationTargetGroup.metrics.unhealthyHostCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricUnhealthyHostCount);
            }
            throw error;
        }
        return this.metrics.unhealthyHostCount(props);
    }
    /**
     * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets in this target group.
     *
     * This does not include any response codes generated by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.httpCodeTarget`` instead
     */
    metricHttpCodeTarget(code, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricHttpCodeTarget", "Use ``ApplicationTargetGroup.metrics.httpCodeTarget`` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_HttpCodeTarget(code);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHttpCodeTarget);
            }
            throw error;
        }
        return this.metrics.httpCodeTarget(code, props);
    }
    /**
     * The average number of requests received by each target in a target group.
     *
     * The only valid statistic is Sum. Note that this represents the average not the sum.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.ipv6RequestCount`` instead
     */
    metricRequestCountPerTarget(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricRequestCountPerTarget", "Use ``ApplicationTargetGroup.metrics.ipv6RequestCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricRequestCountPerTarget);
            }
            throw error;
        }
        return this.metrics.requestCountPerTarget(props);
    }
    /**
     * The number of connections that were not successfully established between the load balancer and target.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.targetConnectionErrorCount`` instead
     */
    metricTargetConnectionErrorCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricTargetConnectionErrorCount", "Use ``ApplicationTargetGroup.metrics.targetConnectionErrorCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTargetConnectionErrorCount);
            }
            throw error;
        }
        return this.metrics.targetConnectionErrorCount(props);
    }
    /**
     * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.targetResponseTime`` instead
     */
    metricTargetResponseTime(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricTargetResponseTime", "Use ``ApplicationTargetGroup.metrics.targetResponseTime`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTargetResponseTime);
            }
            throw error;
        }
        return this.metrics.targetResponseTime(props);
    }
    /**
     * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
     *
     * Possible causes include a mismatch of ciphers or protocols.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationTargetGroup.metrics.tlsNegotiationErrorCount`` instead
     */
    metricTargetTLSNegotiationErrorCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup#metricTargetTLSNegotiationErrorCount", "Use ``ApplicationTargetGroup.metrics.tlsNegotiationErrorCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTargetTLSNegotiationErrorCount);
            }
            throw error;
        }
        return this.metrics.targetTLSNegotiationErrorCount(props);
    }
    validateTargetGroup() {
        const ret = super.validateTargetGroup();
        if (this.targetType !== undefined && this.targetType !== enums_1.TargetType.LAMBDA
            && (this.protocol === undefined || this.port === undefined)) {
            ret.push('At least one of \'port\' or \'protocol\' is required for a non-Lambda TargetGroup');
        }
        if (this.healthCheck) {
            if (this.healthCheck.interval && this.healthCheck.timeout &&
                this.healthCheck.interval.toMilliseconds() <= this.healthCheck.timeout.toMilliseconds()) {
                ret.push(`Healthcheck interval ${this.healthCheck.interval.toHumanString()} must be greater than the timeout ${this.healthCheck.timeout.toHumanString()}`);
            }
            if (this.healthCheck.protocol) {
                if (!ALB_HEALTH_CHECK_PROTOCOLS.includes(this.healthCheck.protocol)) {
                    ret.push([
                        `Health check protocol '${this.healthCheck.protocol}' is not supported. `,
                        `Must be one of [${ALB_HEALTH_CHECK_PROTOCOLS.join(', ')}]`,
                    ].join(''));
                }
            }
        }
        return ret;
    }
}
exports.ApplicationTargetGroup = ApplicationTargetGroup;
_a = JSII_RTTI_SYMBOL_1;
ApplicationTargetGroup[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ApplicationTargetGroup", version: "0.0.0" };
/**
 * An imported application target group
 */
class ImportedApplicationTargetGroup extends imported_1.ImportedTargetGroupBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        if (this.loadBalancerArns != core_1.Aws.NO_VALUE) {
            const targetGroupFullName = util_1.parseTargetGroupFullName(this.targetGroupArn);
            const firstLoadBalancerFullName = util_1.parseLoadBalancerFullName(this.loadBalancerArns);
            this._metrics = new ApplicationTargetGroupMetrics(this, targetGroupFullName, firstLoadBalancerFullName);
        }
    }
    registerListener(_listener, _associatingConstruct) {
        // Nothing to do, we know nothing of our members
        core_1.Annotations.of(this).addWarning('Cannot register listener on imported target group -- security groups might need to be updated manually');
    }
    registerConnectable(_connectable, _portRange) {
        core_1.Annotations.of(this).addWarning('Cannot register connectable on imported target group -- security groups might need to be updated manually');
    }
    addTarget(...targets) {
        for (const target of targets) {
            const result = target.attachToApplicationTargetGroup(this);
            if (result.targetJson !== undefined) {
                throw new Error('Cannot add a non-self registering target to an imported TargetGroup. Create a new TargetGroup instead.');
            }
        }
    }
    get metrics() {
        if (!this._metrics) {
            throw new Error('The imported ApplicationTargetGroup needs the associated ApplicationBalancer to be able to provide metrics. ' +
                'Please specify the ARN value when importing it.');
        }
        return this._metrics;
    }
}
const ALB_HEALTH_CHECK_PROTOCOLS = [enums_1.Protocol.HTTP, enums_1.Protocol.HTTPS];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tdGFyZ2V0LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwbGljYXRpb24tdGFyZ2V0LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQWtFO0FBSWxFLHdIQUEyRjtBQUMzRixtRUFHcUM7QUFDckMsMkNBQStJO0FBQy9JLGlEQUE2RDtBQUM3RCx5Q0FBK0c7QUF1Sy9HOztHQUVHO0FBQ0gsTUFBTSw2QkFBNkI7SUFLakMsWUFBbUIsS0FBZ0IsRUFBRSxtQkFBMkIsRUFBRSxvQkFBNEI7UUFDNUYsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQy9DLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztLQUNsRDtJQUVNLE1BQU0sQ0FBQyxVQUFrQixFQUFFLEtBQWdDO1FBQ2hFLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQzNCLFNBQVMsRUFBRSxvQkFBb0I7WUFDL0IsVUFBVTtZQUNWLGFBQWEsRUFBRTtnQkFDYixXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtnQkFDckMsWUFBWSxFQUFFLElBQUksQ0FBQyxvQkFBb0I7YUFDeEM7WUFDRCxHQUFHLEtBQUs7U0FDVCxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6QjtJQUdNLGdCQUFnQixDQUFDLEtBQWdDO1FBQ3RELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyx1RUFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RTtJQUVNLFlBQVksQ0FBQyxLQUFnQztRQUNsRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsdUVBQXFCLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3hFO0lBRU0sZ0JBQWdC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LElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQ2IsOEdBQThHO2dCQUM5RyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCO0NBQ0Y7QUFlRCxNQUFNLDBCQUEwQixHQUFHLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXdzLCBBbm5vdGF0aW9ucywgRHVyYXRpb24sIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0LCBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElBcHBsaWNhdGlvbkxpc3RlbmVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1saXN0ZW5lcic7XG5pbXBvcnQgeyBIdHRwQ29kZVRhcmdldCB9IGZyb20gJy4vYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkVMQk1ldHJpY3MgfSBmcm9tICcuLi9lbGFzdGljbG9hZGJhbGFuY2luZ3YyLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZCc7XG5pbXBvcnQge1xuICBCYXNlVGFyZ2V0R3JvdXBQcm9wcywgSVRhcmdldEdyb3VwLCBsb2FkQmFsYW5jZXJOYW1lRnJvbUxpc3RlbmVyQXJuLCBMb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyxcbiAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzLCBUYXJnZXRHcm91cEJhc2UsIFRhcmdldEdyb3VwSW1wb3J0UHJvcHMsXG59IGZyb20gJy4uL3NoYXJlZC9iYXNlLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvblByb3RvY29sLCBBcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbiwgUHJvdG9jb2wsIFRhcmdldFR5cGUsIFRhcmdldEdyb3VwTG9hZEJhbGFuY2luZ0FsZ29yaXRobVR5cGUgfSBmcm9tICcuLi9zaGFyZWQvZW51bXMnO1xuaW1wb3J0IHsgSW1wb3J0ZWRUYXJnZXRHcm91cEJhc2UgfSBmcm9tICcuLi9zaGFyZWQvaW1wb3J0ZWQnO1xuaW1wb3J0IHsgZGV0ZXJtaW5lUHJvdG9jb2xBbmRQb3J0LCBwYXJzZUxvYWRCYWxhbmNlckZ1bGxOYW1lLCBwYXJzZVRhcmdldEdyb3VwRnVsbE5hbWUgfSBmcm9tICcuLi9zaGFyZWQvdXRpbCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYW4gQXBwbGljYXRpb24gVGFyZ2V0IEdyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25UYXJnZXRHcm91cFByb3BzIGV4dGVuZHMgQmFzZVRhcmdldEdyb3VwUHJvcHMge1xuICAvKipcbiAgICogVGhlIHByb3RvY29sIHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERldGVybWluZWQgZnJvbSBwb3J0IGlmIGtub3duLCBvcHRpb25hbCBmb3IgTGFtYmRhIHRhcmdldHMuXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCB2ZXJzaW9uIHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBBcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbi5IVFRQMVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2xWZXJzaW9uPzogQXBwbGljYXRpb25Qcm90b2NvbFZlcnNpb247XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IG9uIHdoaWNoIHRoZSBsaXN0ZW5lciBsaXN0ZW5zIGZvciByZXF1ZXN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZXRlcm1pbmVkIGZyb20gcHJvdG9jb2wgaWYga25vd24sIG9wdGlvbmFsIGZvciBMYW1iZGEgdGFyZ2V0cy5cbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHBlcmlvZCBkdXJpbmcgd2hpY2ggdGhlIGxvYWQgYmFsYW5jZXIgc2VuZHMgYSBuZXdseSByZWdpc3RlcmVkXG4gICAqIHRhcmdldCBhIGxpbmVhcmx5IGluY3JlYXNpbmcgc2hhcmUgb2YgdGhlIHRyYWZmaWMgdG8gdGhlIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogVGhlIHJhbmdlIGlzIDMwLTkwMCBzZWNvbmRzICgxNSBtaW51dGVzKS5cbiAgICpcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgcmVhZG9ubHkgc2xvd1N0YXJ0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBzdGlja2luZXNzIGNvb2tpZSBleHBpcmF0aW9uIHBlcmlvZC5cbiAgICpcbiAgICogU2V0dGluZyB0aGlzIHZhbHVlIGVuYWJsZXMgbG9hZCBiYWxhbmNlciBzdGlja2luZXNzLlxuICAgKlxuICAgKiBBZnRlciB0aGlzIHBlcmlvZCwgdGhlIGNvb2tpZSBpcyBjb25zaWRlcmVkIHN0YWxlLiBUaGUgbWluaW11bSB2YWx1ZSBpc1xuICAgKiAxIHNlY29uZCBhbmQgdGhlIG1heGltdW0gdmFsdWUgaXMgNyBkYXlzICg2MDQ4MDAgc2Vjb25kcykuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmRheXMoMSlcbiAgICovXG4gIHJlYWRvbmx5IHN0aWNraW5lc3NDb29raWVEdXJhdGlvbj86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBhbiBhcHBsaWNhdGlvbi1iYXNlZCBzdGlja2luZXNzIGNvb2tpZS5cbiAgICpcbiAgICogTmFtZXMgdGhhdCBzdGFydCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJlZml4ZXMgYXJlIG5vdCBhbGxvd2VkOiBBV1NBTEIsIEFXU0FMQkFQUCxcbiAgICogYW5kIEFXU0FMQlRHOyB0aGV5J3JlIHJlc2VydmVkIGZvciB1c2UgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIE5vdGU6IGBzdGlja2luZXNzQ29va2llTmFtZWAgcGFyYW1ldGVyIGRlcGVuZHMgb24gdGhlIHByZXNlbmNlIG9mIGBzdGlja2luZXNzQ29va2llRHVyYXRpb25gIHBhcmFtZXRlci5cbiAgICogSWYgYHN0aWNraW5lc3NDb29raWVEdXJhdGlvbmAgaXMgbm90IHNldCwgYHN0aWNraW5lc3NDb29raWVOYW1lYCB3aWxsIGJlIG9taXR0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgYHN0aWNraW5lc3NDb29raWVEdXJhdGlvbmAgaXMgc2V0LCBhIGxvYWQtYmFsYW5jZXIgZ2VuZXJhdGVkIGNvb2tpZSBpcyB1c2VkLiBPdGhlcndpc2UsIG5vIHN0aWNraW5lc3MgaXMgZGVmaW5lZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL3N0aWNreS1zZXNzaW9ucy5odG1sXG4gICAqL1xuICByZWFkb25seSBzdGlja2luZXNzQ29va2llTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvYWQgYmFsYW5jaW5nIGFsZ29yaXRobSB0byBzZWxlY3QgdGFyZ2V0cyBmb3Igcm91dGluZyByZXF1ZXN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgVGFyZ2V0R3JvdXBMb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZS5ST1VORF9ST0JJTlxuICAgKi9cbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2luZ0FsZ29yaXRobVR5cGU/OiBUYXJnZXRHcm91cExvYWRCYWxhbmNpbmdBbGdvcml0aG1UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0cyB0byBhZGQgdG8gdGhpcyB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIENhbiBiZSBgSW5zdGFuY2VgLCBgSVBBZGRyZXNzYCwgb3IgYW55IHNlbGYtcmVnaXN0ZXJpbmcgbG9hZCBiYWxhbmNpbmdcbiAgICogdGFyZ2V0LiBJZiB5b3UgdXNlIGVpdGhlciBgSW5zdGFuY2VgIG9yIGBJUEFkZHJlc3NgIGFzIHRhcmdldHMsIGFsbFxuICAgKiB0YXJnZXQgbXVzdCBiZSBvZiB0aGUgc2FtZSB0eXBlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHRhcmdldHMuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRzPzogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyVGFyZ2V0W107XG59XG5cbi8qKlxuICogQ29udGFpbnMgYWxsIG1ldHJpY3MgZm9yIGEgVGFyZ2V0IEdyb3VwIG9mIGEgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25UYXJnZXRHcm91cE1ldHJpY3Mge1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgTmV0d29yayBUYXJnZXQgR3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgY3VzdG9tKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIElQdjYgcmVxdWVzdHMgcmVjZWl2ZWQgYnkgdGhlIHRhcmdldCBncm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGlwdjZSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZXF1ZXN0cyBwcm9jZXNzZWQgb3ZlciBJUHY0IGFuZCBJUHY2LlxuICAgKlxuICAgKiBUaGlzIGNvdW50IGluY2x1ZGVzIG9ubHkgdGhlIHJlcXVlc3RzIHdpdGggYSByZXNwb25zZSBnZW5lcmF0ZWQgYnkgYSB0YXJnZXQgb2YgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcmVxdWVzdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgaGVhbHRoeSBob3N0cyBpbiB0aGUgdGFyZ2V0IGdyb3VwXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB1bmhlYWx0aHkgaG9zdHMgaW4gdGhlIHRhcmdldCBncm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICB1bmhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDJ4eC8zeHgvNHh4LzV4eCByZXNwb25zZSBjb2RlcyBnZW5lcmF0ZWQgYnkgYWxsIHRhcmdldHMgaW4gdGhpcyB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgZG9lcyBub3QgaW5jbHVkZSBhbnkgcmVzcG9uc2UgY29kZXMgZ2VuZXJhdGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGh0dHBDb2RlVGFyZ2V0KGNvZGU6IEh0dHBDb2RlVGFyZ2V0LCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgYXZlcmFnZSBudW1iZXIgb2YgcmVxdWVzdHMgcmVjZWl2ZWQgYnkgZWFjaCB0YXJnZXQgaW4gYSB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIFRoZSBvbmx5IHZhbGlkIHN0YXRpc3RpYyBpcyBTdW0uIE5vdGUgdGhhdCB0aGlzIHJlcHJlc2VudHMgdGhlIGF2ZXJhZ2Ugbm90IHRoZSBzdW0uXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcmVxdWVzdENvdW50UGVyVGFyZ2V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgY29ubmVjdGlvbnMgdGhhdCB3ZXJlIG5vdCBzdWNjZXNzZnVsbHkgZXN0YWJsaXNoZWQgYmV0d2VlbiB0aGUgbG9hZCBiYWxhbmNlciBhbmQgdGFyZ2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHRhcmdldENvbm5lY3Rpb25FcnJvckNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGVsYXBzZWQsIGluIHNlY29uZHMsIGFmdGVyIHRoZSByZXF1ZXN0IGxlYXZlcyB0aGUgbG9hZCBiYWxhbmNlciB1bnRpbCBhIHJlc3BvbnNlIGZyb20gdGhlIHRhcmdldCBpcyByZWNlaXZlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgdGFyZ2V0UmVzcG9uc2VUaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgVExTIGNvbm5lY3Rpb25zIGluaXRpYXRlZCBieSB0aGUgbG9hZCBiYWxhbmNlciB0aGF0IGRpZCBub3QgZXN0YWJsaXNoIGEgc2Vzc2lvbiB3aXRoIHRoZSB0YXJnZXQuXG4gICAqXG4gICAqIFBvc3NpYmxlIGNhdXNlcyBpbmNsdWRlIGEgbWlzbWF0Y2ggb2YgY2lwaGVycyBvciBwcm90b2NvbHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgdGFyZ2V0VExTTmVnb3RpYXRpb25FcnJvckNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG59XG5cblxuLyoqXG4gKiBUaGUgbWV0cmljcyBmb3IgYSBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyLlxuICovXG5jbGFzcyBBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcyBpbXBsZW1lbnRzIElBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IENvbnN0cnVjdDtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHRhcmdldEdyb3VwRnVsbE5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgdGFyZ2V0R3JvdXBGdWxsTmFtZTogc3RyaW5nLCBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMudGFyZ2V0R3JvdXBGdWxsTmFtZSA9IHRhcmdldEdyb3VwRnVsbE5hbWU7XG4gICAgdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSA9IGxvYWRCYWxhbmNlckZ1bGxOYW1lO1xuICB9XG5cbiAgcHVibGljIGN1c3RvbShtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB7XG4gICAgICAgIFRhcmdldEdyb3VwOiB0aGlzLnRhcmdldEdyb3VwRnVsbE5hbWUsXG4gICAgICAgIExvYWRCYWxhbmNlcjogdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSxcbiAgICAgIH0sXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzLnNjb3BlKTtcbiAgfVxuXG5cbiAgcHVibGljIGlwdjZSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBwbGljYXRpb25FTEJNZXRyaWNzLmlQdjZSZXF1ZXN0Q291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyByZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBwbGljYXRpb25FTEJNZXRyaWNzLnJlcXVlc3RDb3VudFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgcHVibGljIGhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ0hlYWx0aHlIb3N0Q291bnQnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVuaGVhbHRoeUhvc3RDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnVW5IZWFsdGh5SG9zdENvdW50Jywge1xuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBodHRwQ29kZVRhcmdldChjb2RlOiBIdHRwQ29kZVRhcmdldCwgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oY29kZSwge1xuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlcXVlc3RDb3VudFBlclRhcmdldChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnUmVxdWVzdENvdW50UGVyVGFyZ2V0Jywge1xuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRhcmdldENvbm5lY3Rpb25FcnJvckNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VzdG9tKCdUYXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudCcsIHtcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0YXJnZXRSZXNwb25zZVRpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ1RhcmdldFJlc3BvbnNlVGltZScsIHtcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdGFyZ2V0VExTTmVnb3RpYXRpb25FcnJvckNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VzdG9tKCdUYXJnZXRUTFNOZWdvdGlhdGlvbkVycm9yQ291bnQnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSkgPT4gY2xvdWR3YXRjaC5NZXRyaWNQcm9wcyxcbiAgICBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIC4uLmZuKHtcbiAgICAgICAgTG9hZEJhbGFuY2VyOiB0aGlzLmxvYWRCYWxhbmNlckZ1bGxOYW1lLFxuICAgICAgICBUYXJnZXRHcm91cDogdGhpcy50YXJnZXRHcm91cEZ1bGxOYW1lLFxuICAgICAgfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzLnNjb3BlKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhbiBBcHBsaWNhdGlvbiBUYXJnZXQgR3JvdXBcbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAgZXh0ZW5kcyBUYXJnZXRHcm91cEJhc2UgaW1wbGVtZW50cyBJQXBwbGljYXRpb25UYXJnZXRHcm91cCB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgdGFyZ2V0IGdyb3VwXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFRhcmdldEdyb3VwQXR0cmlidXRlcyk6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkQXBwbGljYXRpb25UYXJnZXRHcm91cChzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgdGFyZ2V0IGdyb3VwXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlc2AgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbXBvcnQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFRhcmdldEdyb3VwSW1wb3J0UHJvcHMpOiBJQXBwbGljYXRpb25UYXJnZXRHcm91cCB7XG4gICAgcmV0dXJuIEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzY29wZSwgaWQsIHByb3BzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgY29ubmVjdGFibGVNZW1iZXJzOiBDb25uZWN0YWJsZU1lbWJlcltdO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpc3RlbmVyczogSUFwcGxpY2F0aW9uTGlzdGVuZXJbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm90b2NvbD86IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG4gIHByaXZhdGUgcmVhZG9ubHkgcG9ydD86IG51bWJlcjtcbiAgcHJpdmF0ZSBfbWV0cmljcz86IElBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBwbGljYXRpb25UYXJnZXRHcm91cFByb3BzID0ge30pIHtcbiAgICBjb25zdCBbcHJvdG9jb2wsIHBvcnRdID0gZGV0ZXJtaW5lUHJvdG9jb2xBbmRQb3J0KHByb3BzLnByb3RvY29sLCBwcm9wcy5wb3J0KTtcbiAgICBjb25zdCB7IHByb3RvY29sVmVyc2lvbiB9ID0gcHJvcHM7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IC4uLnByb3BzIH0sIHtcbiAgICAgIHByb3RvY29sLFxuICAgICAgcHJvdG9jb2xWZXJzaW9uLFxuICAgICAgcG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbDtcbiAgICB0aGlzLnBvcnQgPSBwb3J0O1xuXG4gICAgLy8gdGhpcy50YXJnZXRUeXBlIGlzIGxhenlcbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7XG4gICAgICB2YWxpZGF0ZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy50YXJnZXRUeXBlID09PSBUYXJnZXRUeXBlLkxBTUJEQSAmJiAodGhpcy5wb3J0IHx8IHRoaXMucHJvdG9jb2wpKSB7XG4gICAgICAgICAgcmV0dXJuIFsncG9ydC9wcm90b2NvbCBzaG91bGQgbm90IGJlIHNwZWNpZmllZCBmb3IgTGFtYmRhIHRhcmdldHMnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbm5lY3RhYmxlTWVtYmVycyA9IFtdO1xuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGlmIChwcm9wcy5zbG93U3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocHJvcHMuc2xvd1N0YXJ0LnRvU2Vjb25kcygpIDwgMzAgfHwgcHJvcHMuc2xvd1N0YXJ0LnRvU2Vjb25kcygpID4gOTAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTbG93IHN0YXJ0IGR1cmF0aW9uIHZhbHVlIG11c3QgYmUgYmV0d2VlbiAzMCBhbmQgOTAwIHNlY29uZHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Nsb3dfc3RhcnQuZHVyYXRpb25fc2Vjb25kcycsIHByb3BzLnNsb3dTdGFydC50b1NlY29uZHMoKS50b1N0cmluZygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLnN0aWNraW5lc3NDb29raWVEdXJhdGlvbikge1xuICAgICAgICB0aGlzLmVuYWJsZUNvb2tpZVN0aWNraW5lc3MocHJvcHMuc3RpY2tpbmVzc0Nvb2tpZUR1cmF0aW9uLCBwcm9wcy5zdGlja2luZXNzQ29va2llTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc3RpY2tpbmVzcy5lbmFibGVkJywgJ2ZhbHNlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5sb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbG9hZF9iYWxhbmNpbmcuYWxnb3JpdGhtLnR5cGUnLCBwcm9wcy5sb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmFkZFRhcmdldCguLi4ocHJvcHMudGFyZ2V0cyB8fCBbXSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgbWV0cmljcygpOiBJQXBwbGljYXRpb25UYXJnZXRHcm91cE1ldHJpY3Mge1xuICAgIGlmICghdGhpcy5fbWV0cmljcykge1xuICAgICAgdGhpcy5fbWV0cmljcyA9IG5ldyBBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcyh0aGlzLCB0aGlzLnRhcmdldEdyb3VwRnVsbE5hbWUsIHRoaXMuZmlyc3RMb2FkQmFsYW5jZXJGdWxsTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxvYWQgYmFsYW5jaW5nIHRhcmdldCB0byB0aGlzIHRhcmdldCBncm91cFxuICAgKi9cbiAgcHVibGljIGFkZFRhcmdldCguLi50YXJnZXRzOiBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXRbXSkge1xuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5hdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGhpcyk7XG4gICAgICB0aGlzLmFkZExvYWRCYWxhbmNlclRhcmdldChyZXN1bHQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhcmdldFR5cGUgPT09IFRhcmdldFR5cGUuTEFNQkRBKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc3RpY2tpbmVzcy5lbmFibGVkJywgdW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIHN0aWNreSByb3V0aW5nIHZpYSBhIGNvb2tpZSB0byBtZW1iZXJzIG9mIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBOb3RlOiBJZiB0aGUgYGNvb2tpZU5hbWVgIHBhcmFtZXRlciBpcyBzZXQsIGFwcGxpY2F0aW9uLWJhc2VkIHN0aWNraW5lc3Mgd2lsbCBiZSBhcHBsaWVkLFxuICAgKiBvdGhlcndpc2UgaXQgZGVmYXVsdHMgdG8gZHVyYXRpb24tYmFzZWQgc3RpY2tpbmVzcyBhdHRyaWJ1dGVzIChgbGJfY29va2llYCkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNsb2FkYmFsYW5jaW5nL2xhdGVzdC9hcHBsaWNhdGlvbi9zdGlja3ktc2Vzc2lvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIGVuYWJsZUNvb2tpZVN0aWNraW5lc3MoZHVyYXRpb246IER1cmF0aW9uLCBjb29raWVOYW1lPzogc3RyaW5nKSB7XG4gICAgaWYgKGR1cmF0aW9uLnRvU2Vjb25kcygpIDwgMSB8fCBkdXJhdGlvbi50b1NlY29uZHMoKSA+IDYwNDgwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGlja2luZXNzIGNvb2tpZSBkdXJhdGlvbiB2YWx1ZSBtdXN0IGJlIGJldHdlZW4gMSBzZWNvbmQgYW5kIDcgZGF5cyAoNjA0ODAwIHNlY29uZHMpLicpO1xuICAgIH1cbiAgICBpZiAoY29va2llTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChjb29raWVOYW1lKSAmJiAoY29va2llTmFtZS5zdGFydHNXaXRoKCdBV1NBTEInKSB8fCBjb29raWVOYW1lLnN0YXJ0c1dpdGgoJ0FXU0FMQkFQUCcpIHx8IGNvb2tpZU5hbWUuc3RhcnRzV2l0aCgnQVdTQUxCVEcnKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcHAgY29va2llIG5hbWVzIHRoYXQgc3RhcnQgd2l0aCB0aGUgZm9sbG93aW5nIHByZWZpeGVzIGFyZSBub3QgYWxsb3dlZDogQVdTQUxCLCBBV1NBTEJBUFAsIGFuZCBBV1NBTEJURzsgdGhleVxcJ3JlIHJlc2VydmVkIGZvciB1c2UgYnkgdGhlIGxvYWQgYmFsYW5jZXIuJyk7XG4gICAgICB9XG4gICAgICBpZiAoY29va2llTmFtZSA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcHAgY29va2llIG5hbWUgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZy4nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3N0aWNraW5lc3MuZW5hYmxlZCcsICd0cnVlJyk7XG4gICAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzdGlja2luZXNzLnR5cGUnLCAnYXBwX2Nvb2tpZScpO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3N0aWNraW5lc3MuYXBwX2Nvb2tpZS5jb29raWVfbmFtZScsIGNvb2tpZU5hbWUpO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3N0aWNraW5lc3MuYXBwX2Nvb2tpZS5kdXJhdGlvbl9zZWNvbmRzJywgZHVyYXRpb24udG9TZWNvbmRzKCkudG9TdHJpbmcoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzdGlja2luZXNzLnR5cGUnLCAnbGJfY29va2llJyk7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc3RpY2tpbmVzcy5sYl9jb29raWUuZHVyYXRpb25fc2Vjb25kcycsIGR1cmF0aW9uLnRvU2Vjb25kcygpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNvbm5lY3RhYmxlIGFzIGEgbWVtYmVyIG9mIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMgZGlyZWN0bHkuIEl0IHdpbGwgYmUgY2FsbGVkIGJ5IGxvYWQgYmFsYW5jaW5nIHRhcmdldHMuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJDb25uZWN0YWJsZShjb25uZWN0YWJsZTogZWMyLklDb25uZWN0YWJsZSwgcG9ydFJhbmdlPzogZWMyLlBvcnQpIHtcbiAgICBwb3J0UmFuZ2UgPSBwb3J0UmFuZ2UgfHwgZWMyLlBvcnQudGNwKHRoaXMuZGVmYXVsdFBvcnQpO1xuXG4gICAgLy8gTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCB3ZSBhbHJlYWR5IGtub3cgYWJvdXQgb2YgdGhpcyBuZXcgY29ubmVjdGFibGUuXG4gICAgLy8gVGhlbiByZW1lbWJlciBmb3IgbmV3IGxpc3RlbmVycyB0aGF0IG1pZ2h0IGdldCBhZGRlZCBsYXRlci5cbiAgICB0aGlzLmNvbm5lY3RhYmxlTWVtYmVycy5wdXNoKHsgY29ubmVjdGFibGUsIHBvcnRSYW5nZSB9KTtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5yZWdpc3RlckNvbm5lY3RhYmxlKGNvbm5lY3RhYmxlLCBwb3J0UmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIHRoYXQgaXMgbG9hZCBiYWxhbmNpbmcgdG8gdGhpcyB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBkaXJlY3RseS4gSXQgd2lsbCBiZSBjYWxsZWQgYnkgbGlzdGVuZXJzLlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyTGlzdGVuZXIobGlzdGVuZXI6IElBcHBsaWNhdGlvbkxpc3RlbmVyLCBhc3NvY2lhdGluZ0NvbnN0cnVjdD86IElDb25zdHJ1Y3QpIHtcbiAgICAvLyBOb3RpZnkgdGhpcyBsaXN0ZW5lciBvZiBhbGwgY29ubmVjdGFibGVzIHRoYXQgd2Uga25vdyBhYm91dC5cbiAgICAvLyBUaGVuIHJlbWVtYmVyIGZvciBuZXcgY29ubmVjdGFibGVzIHRoYXQgbWlnaHQgZ2V0IGFkZGVkIGxhdGVyLlxuICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHRoaXMuY29ubmVjdGFibGVNZW1iZXJzKSB7XG4gICAgICBsaXN0ZW5lci5yZWdpc3RlckNvbm5lY3RhYmxlKG1lbWJlci5jb25uZWN0YWJsZSwgbWVtYmVyLnBvcnRSYW5nZSk7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyQXR0YWNoZWREZXBlbmRlbmNpZXMuYWRkKGFzc29jaWF0aW5nQ29uc3RydWN0ID8/IGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdWxsIG5hbWUgb2YgZmlyc3QgbG9hZCBiYWxhbmNlclxuICAgKi9cbiAgcHVibGljIGdldCBmaXJzdExvYWRCYWxhbmNlckZ1bGxOYW1lKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgVGFyZ2V0R3JvdXAgbmVlZHMgdG8gYmUgYXR0YWNoZWQgdG8gYSBMb2FkQmFsYW5jZXIgYmVmb3JlIHlvdSBjYW4gY2FsbCB0aGlzIG1ldGhvZCcpO1xuICAgIH1cbiAgICByZXR1cm4gbG9hZEJhbGFuY2VyTmFtZUZyb21MaXN0ZW5lckFybih0aGlzLmxpc3RlbmVyc1swXS5saXN0ZW5lckFybik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciBUYXJnZXQgR3JvdXBcbiAgICpcbiAgICogUmV0dXJucyB0aGUgbWV0cmljIGZvciB0aGlzIHRhcmdldCBncm91cCBmcm9tIHRoZSBwb2ludCBvZiB2aWV3IG9mIHRoZSBmaXJzdFxuICAgKiBsb2FkIGJhbGFuY2VyIGxvYWQgYmFsYW5jaW5nIHRvIGl0LiBJZiB5b3UgaGF2ZSBtdWx0aXBsZSBsb2FkIGJhbGFuY2VycyBsb2FkXG4gICAqIHNlbmRpbmcgdHJhZmZpYyB0byB0aGUgc2FtZSB0YXJnZXQgZ3JvdXAsIHlvdSB3aWxsIGhhdmUgdG8gb3ZlcnJpZGUgdGhlIGRpbWVuc2lvbnNcbiAgICogb24gdGhpcyBtZXRyaWMuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmN1c3RvbShtZXRyaWNOYW1lLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBJUHY2IHJlcXVlc3RzIHJlY2VpdmVkIGJ5IHRoZSB0YXJnZXQgZ3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAubWV0cmljcy5pcHY2UmVxdWVzdENvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY0lwdjZSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmlwdjZSZXF1ZXN0Q291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcmVxdWVzdHMgcHJvY2Vzc2VkIG92ZXIgSVB2NCBhbmQgSVB2Ni5cbiAgICpcbiAgICogVGhpcyBjb3VudCBpbmNsdWRlcyBvbmx5IHRoZSByZXF1ZXN0cyB3aXRoIGEgcmVzcG9uc2UgZ2VuZXJhdGVkIGJ5IGEgdGFyZ2V0IG9mIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25UYXJnZXRHcm91cC5tZXRyaWNzLnJlcXVlc3RDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnJlcXVlc3RDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBoZWFsdGh5IGhvc3RzIGluIHRoZSB0YXJnZXQgZ3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvblRhcmdldEdyb3VwLm1ldHJpY3MuaGVhbHRoeUhvc3RDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIZWFsdGh5SG9zdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5oZWFsdGh5SG9zdENvdW50KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHVuaGVhbHRoeSBob3N0cyBpbiB0aGUgdGFyZ2V0IGdyb3VwXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25UYXJnZXRHcm91cC5tZXRyaWNzLnVuaGVhbHRoeUhvc3RDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNVbmhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnVuaGVhbHRoeUhvc3RDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDJ4eC8zeHgvNHh4LzV4eCByZXNwb25zZSBjb2RlcyBnZW5lcmF0ZWQgYnkgYWxsIHRhcmdldHMgaW4gdGhpcyB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgZG9lcyBub3QgaW5jbHVkZSBhbnkgcmVzcG9uc2UgY29kZXMgZ2VuZXJhdGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25UYXJnZXRHcm91cC5tZXRyaWNzLmh0dHBDb2RlVGFyZ2V0YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY0h0dHBDb2RlVGFyZ2V0KGNvZGU6IEh0dHBDb2RlVGFyZ2V0LCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MuaHR0cENvZGVUYXJnZXQoY29kZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhdmVyYWdlIG51bWJlciBvZiByZXF1ZXN0cyByZWNlaXZlZCBieSBlYWNoIHRhcmdldCBpbiBhIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogVGhlIG9ubHkgdmFsaWQgc3RhdGlzdGljIGlzIFN1bS4gTm90ZSB0aGF0IHRoaXMgcmVwcmVzZW50cyB0aGUgYXZlcmFnZSBub3QgdGhlIHN1bS5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAubWV0cmljcy5pcHY2UmVxdWVzdENvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY1JlcXVlc3RDb3VudFBlclRhcmdldChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MucmVxdWVzdENvdW50UGVyVGFyZ2V0KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNvbm5lY3Rpb25zIHRoYXQgd2VyZSBub3Qgc3VjY2Vzc2Z1bGx5IGVzdGFibGlzaGVkIGJldHdlZW4gdGhlIGxvYWQgYmFsYW5jZXIgYW5kIHRhcmdldC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAubWV0cmljcy50YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUYXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGVsYXBzZWQsIGluIHNlY29uZHMsIGFmdGVyIHRoZSByZXF1ZXN0IGxlYXZlcyB0aGUgbG9hZCBiYWxhbmNlciB1bnRpbCBhIHJlc3BvbnNlIGZyb20gdGhlIHRhcmdldCBpcyByZWNlaXZlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvblRhcmdldEdyb3VwLm1ldHJpY3MudGFyZ2V0UmVzcG9uc2VUaW1lYGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY1RhcmdldFJlc3BvbnNlVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGFyZ2V0UmVzcG9uc2VUaW1lKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIFRMUyBjb25uZWN0aW9ucyBpbml0aWF0ZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIgdGhhdCBkaWQgbm90IGVzdGFibGlzaCBhIHNlc3Npb24gd2l0aCB0aGUgdGFyZ2V0LlxuICAgKlxuICAgKiBQb3NzaWJsZSBjYXVzZXMgaW5jbHVkZSBhIG1pc21hdGNoIG9mIGNpcGhlcnMgb3IgcHJvdG9jb2xzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25UYXJnZXRHcm91cC5tZXRyaWNzLnRsc05lZ290aWF0aW9uRXJyb3JDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUYXJnZXRUTFNOZWdvdGlhdGlvbkVycm9yQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnRhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudChwcm9wcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmFsaWRhdGVUYXJnZXRHcm91cCgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmV0ID0gc3VwZXIudmFsaWRhdGVUYXJnZXRHcm91cCgpO1xuXG4gICAgaWYgKHRoaXMudGFyZ2V0VHlwZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0VHlwZSAhPT0gVGFyZ2V0VHlwZS5MQU1CREFcbiAgICAgICYmICh0aGlzLnByb3RvY29sID09PSB1bmRlZmluZWQgfHwgdGhpcy5wb3J0ID09PSB1bmRlZmluZWQpKSB7XG4gICAgICByZXQucHVzaCgnQXQgbGVhc3Qgb25lIG9mIFxcJ3BvcnRcXCcgb3IgXFwncHJvdG9jb2xcXCcgaXMgcmVxdWlyZWQgZm9yIGEgbm9uLUxhbWJkYSBUYXJnZXRHcm91cCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhlYWx0aENoZWNrKSB7XG4gICAgICBpZiAodGhpcy5oZWFsdGhDaGVjay5pbnRlcnZhbCAmJiB0aGlzLmhlYWx0aENoZWNrLnRpbWVvdXQgJiZcbiAgICAgICAgdGhpcy5oZWFsdGhDaGVjay5pbnRlcnZhbC50b01pbGxpc2Vjb25kcygpIDw9IHRoaXMuaGVhbHRoQ2hlY2sudGltZW91dC50b01pbGxpc2Vjb25kcygpKSB7XG4gICAgICAgIHJldC5wdXNoKGBIZWFsdGhjaGVjayBpbnRlcnZhbCAke3RoaXMuaGVhbHRoQ2hlY2suaW50ZXJ2YWwudG9IdW1hblN0cmluZygpfSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB0aGUgdGltZW91dCAke3RoaXMuaGVhbHRoQ2hlY2sudGltZW91dC50b0h1bWFuU3RyaW5nKCl9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhlYWx0aENoZWNrLnByb3RvY29sKSB7XG4gICAgICAgIGlmICghQUxCX0hFQUxUSF9DSEVDS19QUk9UT0NPTFMuaW5jbHVkZXModGhpcy5oZWFsdGhDaGVjay5wcm90b2NvbCkpIHtcbiAgICAgICAgICByZXQucHVzaChbXG4gICAgICAgICAgICBgSGVhbHRoIGNoZWNrIHByb3RvY29sICcke3RoaXMuaGVhbHRoQ2hlY2sucHJvdG9jb2x9JyBpcyBub3Qgc3VwcG9ydGVkLiBgLFxuICAgICAgICAgICAgYE11c3QgYmUgb25lIG9mIFske0FMQl9IRUFMVEhfQ0hFQ0tfUFJPVE9DT0xTLmpvaW4oJywgJyl9XWAsXG4gICAgICAgICAgXS5qb2luKCcnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbi8qKlxuICogQSBjb25uZWN0YWJsZSBtZW1iZXIgb2YgYSB0YXJnZXQgZ3JvdXBcbiAqL1xuaW50ZXJmYWNlIENvbm5lY3RhYmxlTWVtYmVyIHtcbiAgLyoqXG4gICAqIFRoZSBjb25uZWN0YWJsZSBtZW1iZXJcbiAgICovXG4gIGNvbm5lY3RhYmxlOiBlYzIuSUNvbm5lY3RhYmxlO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9ydCAocmFuZ2UpIHRoZSBtZW1iZXIgaXMgbGlzdGVuaW5nIG9uXG4gICAqL1xuICBwb3J0UmFuZ2U6IGVjMi5Qb3J0O1xufVxuXG4vKipcbiAqIEEgVGFyZ2V0IEdyb3VwIGZvciBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvblRhcmdldEdyb3VwIGV4dGVuZHMgSVRhcmdldEdyb3VwIHtcbiAgLyoqXG4gICAqIEFsbCBtZXRyaWNzIGF2YWlsYWJsZSBmb3IgdGhpcyB0YXJnZXQgZ3JvdXAuXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNzOiBJQXBwbGljYXRpb25UYXJnZXRHcm91cE1ldHJpY3M7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgdGhhdCBpcyBsb2FkIGJhbGFuY2luZyB0byB0aGlzIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCB3aWxsIGJlIGNhbGxlZCBieSBsaXN0ZW5lcnMuXG4gICAqL1xuICByZWdpc3Rlckxpc3RlbmVyKGxpc3RlbmVyOiBJQXBwbGljYXRpb25MaXN0ZW5lciwgYXNzb2NpYXRpbmdDb25zdHJ1Y3Q/OiBJQ29uc3RydWN0KTogdm9pZDtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjb25uZWN0YWJsZSBhcyBhIG1lbWJlciBvZiB0aGlzIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCB3aWxsIGJlIGNhbGxlZCBieSBsb2FkIGJhbGFuY2luZyB0YXJnZXRzLlxuICAgKi9cbiAgcmVnaXN0ZXJDb25uZWN0YWJsZShjb25uZWN0YWJsZTogZWMyLklDb25uZWN0YWJsZSwgcG9ydFJhbmdlPzogZWMyLlBvcnQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBsb2FkIGJhbGFuY2luZyB0YXJnZXQgdG8gdGhpcyB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIGFkZFRhcmdldCguLi50YXJnZXRzOiBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXRbXSk6IHZvaWQ7XG59XG5cbi8qKlxuICogQW4gaW1wb3J0ZWQgYXBwbGljYXRpb24gdGFyZ2V0IGdyb3VwXG4gKi9cbmNsYXNzIEltcG9ydGVkQXBwbGljYXRpb25UYXJnZXRHcm91cCBleHRlbmRzIEltcG9ydGVkVGFyZ2V0R3JvdXBCYXNlIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAge1xuICBwcml2YXRlIHJlYWRvbmx5IF9tZXRyaWNzPzogSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXBNZXRyaWNzO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgaWYgKHRoaXMubG9hZEJhbGFuY2VyQXJucyAhPSBBd3MuTk9fVkFMVUUpIHtcbiAgICAgIGNvbnN0IHRhcmdldEdyb3VwRnVsbE5hbWUgPSBwYXJzZVRhcmdldEdyb3VwRnVsbE5hbWUodGhpcy50YXJnZXRHcm91cEFybik7XG4gICAgICBjb25zdCBmaXJzdExvYWRCYWxhbmNlckZ1bGxOYW1lID0gcGFyc2VMb2FkQmFsYW5jZXJGdWxsTmFtZSh0aGlzLmxvYWRCYWxhbmNlckFybnMpO1xuICAgICAgdGhpcy5fbWV0cmljcyA9IG5ldyBBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcyh0aGlzLCB0YXJnZXRHcm91cEZ1bGxOYW1lLCBmaXJzdExvYWRCYWxhbmNlckZ1bGxOYW1lKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJMaXN0ZW5lcihfbGlzdGVuZXI6IElBcHBsaWNhdGlvbkxpc3RlbmVyLCBfYXNzb2NpYXRpbmdDb25zdHJ1Y3Q/OiBJQ29uc3RydWN0KSB7XG4gICAgLy8gTm90aGluZyB0byBkbywgd2Uga25vdyBub3RoaW5nIG9mIG91ciBtZW1iZXJzXG4gICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnQ2Fubm90IHJlZ2lzdGVyIGxpc3RlbmVyIG9uIGltcG9ydGVkIHRhcmdldCBncm91cCAtLSBzZWN1cml0eSBncm91cHMgbWlnaHQgbmVlZCB0byBiZSB1cGRhdGVkIG1hbnVhbGx5Jyk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDb25uZWN0YWJsZShfY29ubmVjdGFibGU6IGVjMi5JQ29ubmVjdGFibGUsIF9wb3J0UmFuZ2U/OiBlYzIuUG9ydCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ0Nhbm5vdCByZWdpc3RlciBjb25uZWN0YWJsZSBvbiBpbXBvcnRlZCB0YXJnZXQgZ3JvdXAgLS0gc2VjdXJpdHkgZ3JvdXBzIG1pZ2h0IG5lZWQgdG8gYmUgdXBkYXRlZCBtYW51YWxseScpO1xuICB9XG5cbiAgcHVibGljIGFkZFRhcmdldCguLi50YXJnZXRzOiBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXRbXSkge1xuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5hdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGhpcyk7XG5cbiAgICAgIGlmIChyZXN1bHQudGFyZ2V0SnNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBhIG5vbi1zZWxmIHJlZ2lzdGVyaW5nIHRhcmdldCB0byBhbiBpbXBvcnRlZCBUYXJnZXRHcm91cC4gQ3JlYXRlIGEgbmV3IFRhcmdldEdyb3VwIGluc3RlYWQuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBtZXRyaWNzKCk6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwTWV0cmljcyB7XG4gICAgaWYgKCF0aGlzLl9tZXRyaWNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgaW1wb3J0ZWQgQXBwbGljYXRpb25UYXJnZXRHcm91cCBuZWVkcyB0aGUgYXNzb2NpYXRlZCBBcHBsaWNhdGlvbkJhbGFuY2VyIHRvIGJlIGFibGUgdG8gcHJvdmlkZSBtZXRyaWNzLiAnICtcbiAgICAgICAgJ1BsZWFzZSBzcGVjaWZ5IHRoZSBBUk4gdmFsdWUgd2hlbiBpbXBvcnRpbmcgaXQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNzO1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25zdHJ1Y3RzIHRoYXQgY2FuIGJlIHRhcmdldHMgb2YgYW4gYXBwbGljYXRpb24gbG9hZCBiYWxhbmNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclRhcmdldCB7XG4gIC8qKlxuICAgKiBBdHRhY2ggbG9hZC1iYWxhbmNlZCB0YXJnZXQgdG8gYSBUYXJnZXRHcm91cFxuICAgKlxuICAgKiBNYXkgcmV0dXJuIEpTT04gdG8gZGlyZWN0bHkgYWRkIHRvIHRoZSBbVGFyZ2V0c10gbGlzdCwgb3IgcmV0dXJuIHVuZGVmaW5lZFxuICAgKiBpZiB0aGUgdGFyZ2V0IHdpbGwgcmVnaXN0ZXIgaXRzZWxmIHdpdGggdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwKTogTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHM7XG59XG5cbmNvbnN0IEFMQl9IRUFMVEhfQ0hFQ0tfUFJPVE9DT0xTID0gW1Byb3RvY29sLkhUVFAsIFByb3RvY29sLkhUVFBTXTtcbiJdfQ==