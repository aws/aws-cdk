"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTargetGroup = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const cdk = require("@aws-cdk/core");
const base_target_group_1 = require("../shared/base-target-group");
const enums_1 = require("../shared/enums");
const imported_1 = require("../shared/imported");
const util_1 = require("../shared/util");
/**
 * The metrics for a network load balancer.
 */
class NetworkTargetGroupMetrics {
    constructor(scope, targetGroupFullName, loadBalancerFullName) {
        this.scope = scope;
        this.targetGroupFullName = targetGroupFullName;
        this.loadBalancerFullName = loadBalancerFullName;
    }
    custom(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/NetworkELB',
            metricName,
            dimensionsMap: { LoadBalancer: this.loadBalancerFullName, TargetGroup: this.targetGroupFullName },
            ...props,
        }).attachTo(this.scope);
    }
    healthyHostCount(props) {
        return this.custom('HealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
    unHealthyHostCount(props) {
        return this.custom('UnHealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
}
/**
 * Define a Network Target Group
 */
class NetworkTargetGroup extends base_target_group_1.TargetGroupBase {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkTargetGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkTargetGroup);
            }
            throw error;
        }
        const proto = props.protocol || enums_1.Protocol.TCP;
        util_1.validateNetworkProtocol(proto);
        super(scope, id, props, {
            protocol: proto,
            port: props.port,
        });
        this.listeners = [];
        if (props.proxyProtocolV2 != null) {
            this.setAttribute('proxy_protocol_v2.enabled', props.proxyProtocolV2 ? 'true' : 'false');
        }
        if (props.preserveClientIp !== undefined) {
            this.setAttribute('preserve_client_ip.enabled', props.preserveClientIp ? 'true' : 'false');
        }
        if (props.connectionTermination !== undefined) {
            this.setAttribute('deregistration_delay.connection_termination.enabled', props.connectionTermination ? 'true' : 'false');
        }
        this.addTarget(...(props.targets || []));
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
        return new ImportedNetworkTargetGroup(scope, id, attrs);
    }
    /**
     * Import an existing listener
     *
     * @deprecated Use `fromTargetGroupAttributes` instead
     */
    static import(scope, id, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkTargetGroup#import", "Use `fromTargetGroupAttributes` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_TargetGroupImportProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.import);
            }
            throw error;
        }
        return NetworkTargetGroup.fromTargetGroupAttributes(scope, id, props);
    }
    get metrics() {
        if (!this._metrics) {
            this._metrics = new NetworkTargetGroupMetrics(this, this.targetGroupFullName, this.firstLoadBalancerFullName);
        }
        return this._metrics;
    }
    /**
     * Add a load balancing target to this target group
     */
    addTarget(...targets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkLoadBalancerTarget(targets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTarget);
            }
            throw error;
        }
        for (const target of targets) {
            const result = target.attachToNetworkTargetGroup(this);
            this.addLoadBalancerTarget(result);
        }
    }
    /**
     * Register a listener that is load balancing to this target group.
     *
     * Don't call this directly. It will be called by listeners.
     */
    registerListener(listener) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkListener(listener);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerListener);
            }
            throw error;
        }
        this.loadBalancerAttachedDependencies.add(listener);
        this.listeners.push(listener);
    }
    /**
     * The number of targets that are considered healthy.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead
     */
    metricHealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkTargetGroup#metricHealthyHostCount", "Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead");
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
     * The number of targets that are considered unhealthy.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead
     */
    metricUnHealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkTargetGroup#metricUnHealthyHostCount", "Use ``NetworkTargetGroup.metrics.healthyHostCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricUnHealthyHostCount);
            }
            throw error;
        }
        return this.metrics.unHealthyHostCount(props);
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
    validateTargetGroup() {
        const ret = super.validateTargetGroup();
        const healthCheck = this.healthCheck || {};
        const lowHealthCheckInterval = 5;
        const highHealthCheckInterval = 300;
        if (healthCheck.interval) {
            const seconds = healthCheck.interval.toSeconds();
            if (!cdk.Token.isUnresolved(seconds) && (seconds < lowHealthCheckInterval || seconds > highHealthCheckInterval)) {
                ret.push(`Health check interval '${seconds}' not supported. Must be between ${lowHealthCheckInterval} and ${highHealthCheckInterval}.`);
            }
        }
        if (healthCheck.healthyThresholdCount) {
            const thresholdCount = healthCheck.healthyThresholdCount;
            if (thresholdCount < 2 || thresholdCount > 10) {
                ret.push(`Healthy Threshold Count '${thresholdCount}' not supported. Must be a number between 2 and 10.`);
            }
        }
        if (healthCheck.unhealthyThresholdCount) {
            const thresholdCount = healthCheck.unhealthyThresholdCount;
            if (thresholdCount < 2 || thresholdCount > 10) {
                ret.push(`Unhealthy Threshold Count '${thresholdCount}' not supported. Must be a number between 2 and 10.`);
            }
        }
        if (healthCheck.healthyThresholdCount && healthCheck.unhealthyThresholdCount &&
            healthCheck.healthyThresholdCount !== healthCheck.unhealthyThresholdCount) {
            ret.push([
                `Healthy and Unhealthy Threshold Counts must be the same: ${healthCheck.healthyThresholdCount}`,
                `is not equal to ${healthCheck.unhealthyThresholdCount}.`,
            ].join(' '));
        }
        if (!healthCheck.protocol) {
            return ret;
        }
        if (!NLB_HEALTH_CHECK_PROTOCOLS.includes(healthCheck.protocol)) {
            ret.push(`Health check protocol '${healthCheck.protocol}' is not supported. Must be one of [${NLB_HEALTH_CHECK_PROTOCOLS.join(', ')}]`);
        }
        if (healthCheck.path && !NLB_PATH_HEALTH_CHECK_PROTOCOLS.includes(healthCheck.protocol)) {
            ret.push([
                `'${healthCheck.protocol}' health checks do not support the path property.`,
                `Must be one of [${NLB_PATH_HEALTH_CHECK_PROTOCOLS.join(', ')}]`,
            ].join(' '));
        }
        if (healthCheck.timeout && healthCheck.timeout.toSeconds() !== NLB_HEALTH_CHECK_TIMEOUTS[healthCheck.protocol]) {
            ret.push([
                'Custom health check timeouts are not supported for Network Load Balancer health checks.',
                `Expected ${NLB_HEALTH_CHECK_TIMEOUTS[healthCheck.protocol]} seconds for ${healthCheck.protocol}, got ${healthCheck.timeout.toSeconds()}`,
            ].join(' '));
        }
        return ret;
    }
}
exports.NetworkTargetGroup = NetworkTargetGroup;
_a = JSII_RTTI_SYMBOL_1;
NetworkTargetGroup[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.NetworkTargetGroup", version: "0.0.0" };
/**
 * An imported network target group
 */
class ImportedNetworkTargetGroup extends imported_1.ImportedTargetGroupBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        if (this.loadBalancerArns != cdk.Aws.NO_VALUE) {
            const targetGroupFullName = util_1.parseTargetGroupFullName(this.targetGroupArn);
            const firstLoadBalancerFullName = util_1.parseLoadBalancerFullName(this.loadBalancerArns);
            this._metrics = new NetworkTargetGroupMetrics(this, targetGroupFullName, firstLoadBalancerFullName);
        }
    }
    get metrics() {
        if (!this._metrics) {
            throw new Error('The imported NetworkTargetGroup needs the associated NetworkLoadBalancer to be able to provide metrics. ' +
                'Please specify the ARN value when importing it.');
        }
        return this._metrics;
    }
    registerListener(_listener) {
    }
    addTarget(...targets) {
        for (const target of targets) {
            const result = target.attachToNetworkTargetGroup(this);
            if (result.targetJson !== undefined) {
                throw new Error('Cannot add a non-self registering target to an imported TargetGroup. Create a new TargetGroup instead.');
            }
        }
    }
}
const NLB_HEALTH_CHECK_PROTOCOLS = [enums_1.Protocol.HTTP, enums_1.Protocol.HTTPS, enums_1.Protocol.TCP];
const NLB_PATH_HEALTH_CHECK_PROTOCOLS = [enums_1.Protocol.HTTP, enums_1.Protocol.HTTPS];
const NLB_HEALTH_CHECK_TIMEOUTS = {
    [enums_1.Protocol.HTTP]: 6,
    [enums_1.Protocol.HTTPS]: 10,
    [enums_1.Protocol.TCP]: 10,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay10YXJnZXQtZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLXRhcmdldC1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQscUNBQXFDO0FBR3JDLG1FQUdxQztBQUNyQywyQ0FBMkM7QUFDM0MsaURBQTZEO0FBQzdELHlDQUE4RztBQWdGOUc7O0dBRUc7QUFDSCxNQUFNLHlCQUF5QjtJQUs3QixZQUFtQixLQUFnQixFQUFFLG1CQUEyQixFQUFFLG9CQUE0QjtRQUM1RixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7UUFDL0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0tBQ2xEO0lBRU0sTUFBTSxDQUFDLFVBQWtCLEVBQUUsS0FBZ0M7UUFDaEUsT0FBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDM0IsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixVQUFVO1lBQ1YsYUFBYSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ2pHLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pCO0lBRU0sZ0JBQWdCLENBQUMsS0FBZ0M7UUFDdEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JDLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKO0lBRU0sa0JBQWtCLENBQUMsS0FBZ0M7UUFDeEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztL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QUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQ2IsMEdBQTBHO2dCQUMxRyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCO0lBRU0sZ0JBQWdCLENBQUMsU0FBMkI7S0FFbEQ7SUFFTSxTQUFTLENBQUMsR0FBRyxPQUFxQztRQUN2RCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUM1QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3R0FBd0csQ0FBQyxDQUFDO2FBQzNIO1NBQ0Y7S0FDRjtDQUNGO0FBZUQsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLGdCQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFRLENBQUMsS0FBSyxFQUFFLGdCQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakYsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLGdCQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEUsTUFBTSx5QkFBeUIsR0FBd0M7SUFDckUsQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbEIsQ0FBQyxnQkFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7SUFDcEIsQ0FBQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7Q0FDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTmV0d29ya0xpc3RlbmVyIH0gZnJvbSAnLi9uZXR3b3JrLWxpc3RlbmVyJztcbmltcG9ydCB7XG4gIEJhc2VUYXJnZXRHcm91cFByb3BzLCBIZWFsdGhDaGVjaywgSVRhcmdldEdyb3VwLCBsb2FkQmFsYW5jZXJOYW1lRnJvbUxpc3RlbmVyQXJuLCBMb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyxcbiAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzLCBUYXJnZXRHcm91cEJhc2UsIFRhcmdldEdyb3VwSW1wb3J0UHJvcHMsXG59IGZyb20gJy4uL3NoYXJlZC9iYXNlLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gJy4uL3NoYXJlZC9lbnVtcyc7XG5pbXBvcnQgeyBJbXBvcnRlZFRhcmdldEdyb3VwQmFzZSB9IGZyb20gJy4uL3NoYXJlZC9pbXBvcnRlZCc7XG5pbXBvcnQgeyBwYXJzZUxvYWRCYWxhbmNlckZ1bGxOYW1lLCBwYXJzZVRhcmdldEdyb3VwRnVsbE5hbWUsIHZhbGlkYXRlTmV0d29ya1Byb3RvY29sIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IE5ldHdvcmsgVGFyZ2V0IEdyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya1RhcmdldEdyb3VwUHJvcHMgZXh0ZW5kcyBCYXNlVGFyZ2V0R3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcG9ydCBvbiB3aGljaCB0aGUgbGlzdGVuZXIgbGlzdGVucyBmb3IgcmVxdWVzdHMuXG4gICAqL1xuICByZWFkb25seSBwb3J0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFByb3RvY29sIGZvciB0YXJnZXQgZ3JvdXAsIGV4cGVjdHMgVENQLCBUTFMsIFVEUCwgb3IgVENQX1VEUC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUQ1BcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIFByb3h5IFByb3RvY29sIHZlcnNpb24gMiBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJveHlQcm90b2NvbFYyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgY2xpZW50IElQIHByZXNlcnZhdGlvbiBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZSBpZiB0aGUgdGFyZ2V0IGdyb3VwIHR5cGUgaXMgSVAgYWRkcmVzcyBhbmQgdGhlXG4gICAqIHRhcmdldCBncm91cCBwcm90b2NvbCBpcyBUQ1Agb3IgVExTLiBPdGhlcndpc2UsIHRydWUuXG4gICAqL1xuICByZWFkb25seSBwcmVzZXJ2ZUNsaWVudElwPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHRhcmdldHMgdG8gYWRkIHRvIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBDYW4gYmUgYEluc3RhbmNlYCwgYElQQWRkcmVzc2AsIG9yIGFueSBzZWxmLXJlZ2lzdGVyaW5nIGxvYWQgYmFsYW5jaW5nXG4gICAqIHRhcmdldC4gSWYgeW91IHVzZSBlaXRoZXIgYEluc3RhbmNlYCBvciBgSVBBZGRyZXNzYCBhcyB0YXJnZXRzLCBhbGxcbiAgICogdGFyZ2V0IG11c3QgYmUgb2YgdGhlIHNhbWUgdHlwZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB0YXJnZXRzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0cz86IElOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0W107XG5cbiAgLyoqXG4gICAqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBsb2FkIGJhbGFuY2VyIHRlcm1pbmF0ZXMgY29ubmVjdGlvbnMgYXRcbiAgICogdGhlIGVuZCBvZiB0aGUgZGVyZWdpc3RyYXRpb24gdGltZW91dC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNvbm5lY3Rpb25UZXJtaW5hdGlvbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29udGFpbnMgYWxsIG1ldHJpY3MgZm9yIGEgVGFyZ2V0IEdyb3VwIG9mIGEgTmV0d29yayBMb2FkIEJhbGFuY2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrVGFyZ2V0R3JvdXBNZXRyaWNzIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIE5ldHdvcmsgVGFyZ2V0IEdyb3VwXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGN1c3RvbShtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdGFyZ2V0cyB0aGF0IGFyZSBjb25zaWRlcmVkIGhlYWx0aHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0YXJnZXRzIHRoYXQgYXJlIGNvbnNpZGVyZWQgdW5oZWFsdGh5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICB1bkhlYWx0aHlIb3N0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbn1cblxuLyoqXG4gKiBUaGUgbWV0cmljcyBmb3IgYSBuZXR3b3JrIGxvYWQgYmFsYW5jZXIuXG4gKi9cbmNsYXNzIE5ldHdvcmtUYXJnZXRHcm91cE1ldHJpY3MgaW1wbGVtZW50cyBJTmV0d29ya1RhcmdldEdyb3VwTWV0cmljcyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IENvbnN0cnVjdDtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHRhcmdldEdyb3VwRnVsbE5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgdGFyZ2V0R3JvdXBGdWxsTmFtZTogc3RyaW5nLCBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMudGFyZ2V0R3JvdXBGdWxsTmFtZSA9IHRhcmdldEdyb3VwRnVsbE5hbWU7XG4gICAgdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSA9IGxvYWRCYWxhbmNlckZ1bGxOYW1lO1xuICB9XG5cbiAgcHVibGljIGN1c3RvbShtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHsgTG9hZEJhbGFuY2VyOiB0aGlzLmxvYWRCYWxhbmNlckZ1bGxOYW1lLCBUYXJnZXRHcm91cDogdGhpcy50YXJnZXRHcm91cEZ1bGxOYW1lIH0sXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzLnNjb3BlKTtcbiAgfVxuXG4gIHB1YmxpYyBoZWFsdGh5SG9zdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnSGVhbHRoeUhvc3RDb3VudCcsIHtcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5IZWFsdGh5SG9zdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VzdG9tKCdVbkhlYWx0aHlIb3N0Q291bnQnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogRGVmaW5lIGEgTmV0d29yayBUYXJnZXQgR3JvdXBcbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtUYXJnZXRHcm91cCBleHRlbmRzIFRhcmdldEdyb3VwQmFzZSBpbXBsZW1lbnRzIElOZXR3b3JrVGFyZ2V0R3JvdXAge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHRhcmdldCBncm91cFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBUYXJnZXRHcm91cEF0dHJpYnV0ZXMpOiBJTmV0d29ya1RhcmdldEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkTmV0d29ya1RhcmdldEdyb3VwKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBsaXN0ZW5lclxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXNgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW1wb3J0KHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBUYXJnZXRHcm91cEltcG9ydFByb3BzKTogSU5ldHdvcmtUYXJnZXRHcm91cCB7XG4gICAgcmV0dXJuIE5ldHdvcmtUYXJnZXRHcm91cC5mcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBsaXN0ZW5lcnM6IElOZXR3b3JrTGlzdGVuZXJbXTtcbiAgcHJpdmF0ZSBfbWV0cmljcz86IElOZXR3b3JrVGFyZ2V0R3JvdXBNZXRyaWNzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrVGFyZ2V0R3JvdXBQcm9wcykge1xuICAgIGNvbnN0IHByb3RvID0gcHJvcHMucHJvdG9jb2wgfHwgUHJvdG9jb2wuVENQO1xuICAgIHZhbGlkYXRlTmV0d29ya1Byb3RvY29sKHByb3RvKTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMsIHtcbiAgICAgIHByb3RvY29sOiBwcm90byxcbiAgICAgIHBvcnQ6IHByb3BzLnBvcnQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuXG4gICAgaWYgKHByb3BzLnByb3h5UHJvdG9jb2xWMiAhPSBudWxsKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncHJveHlfcHJvdG9jb2xfdjIuZW5hYmxlZCcsIHByb3BzLnByb3h5UHJvdG9jb2xWMiA/ICd0cnVlJyA6ICdmYWxzZScpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5wcmVzZXJ2ZUNsaWVudElwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZV9jbGllbnRfaXAuZW5hYmxlZCcsIHByb3BzLnByZXNlcnZlQ2xpZW50SXAgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmNvbm5lY3Rpb25UZXJtaW5hdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGVyZWdpc3RyYXRpb25fZGVsYXkuY29ubmVjdGlvbl90ZXJtaW5hdGlvbi5lbmFibGVkJywgcHJvcHMuY29ubmVjdGlvblRlcm1pbmF0aW9uID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgfVxuICAgIHRoaXMuYWRkVGFyZ2V0KC4uLihwcm9wcy50YXJnZXRzIHx8IFtdKSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBnZXQgbWV0cmljcygpOiBJTmV0d29ya1RhcmdldEdyb3VwTWV0cmljcyB7XG4gICAgaWYgKCF0aGlzLl9tZXRyaWNzKSB7XG4gICAgICB0aGlzLl9tZXRyaWNzID0gbmV3IE5ldHdvcmtUYXJnZXRHcm91cE1ldHJpY3ModGhpcywgdGhpcy50YXJnZXRHcm91cEZ1bGxOYW1lLCB0aGlzLmZpcnN0TG9hZEJhbGFuY2VyRnVsbE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWV0cmljcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsb2FkIGJhbGFuY2luZyB0YXJnZXQgdG8gdGhpcyB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhZGRUYXJnZXQoLi4udGFyZ2V0czogSU5ldHdvcmtMb2FkQmFsYW5jZXJUYXJnZXRbXSkge1xuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5hdHRhY2hUb05ldHdvcmtUYXJnZXRHcm91cCh0aGlzKTtcbiAgICAgIHRoaXMuYWRkTG9hZEJhbGFuY2VyVGFyZ2V0KHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgdGhhdCBpcyBsb2FkIGJhbGFuY2luZyB0byB0aGlzIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCB3aWxsIGJlIGNhbGxlZCBieSBsaXN0ZW5lcnMuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lcjogSU5ldHdvcmtMaXN0ZW5lcikge1xuICAgIHRoaXMubG9hZEJhbGFuY2VyQXR0YWNoZWREZXBlbmRlbmNpZXMuYWRkKGxpc3RlbmVyKTtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhcmdldHMgdGhhdCBhcmUgY29uc2lkZXJlZCBoZWFsdGh5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYE5ldHdvcmtUYXJnZXRHcm91cC5tZXRyaWNzLmhlYWx0aHlIb3N0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSGVhbHRoeUhvc3RDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MuaGVhbHRoeUhvc3RDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0YXJnZXRzIHRoYXQgYXJlIGNvbnNpZGVyZWQgdW5oZWFsdGh5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYE5ldHdvcmtUYXJnZXRHcm91cC5tZXRyaWNzLmhlYWx0aHlIb3N0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVW5IZWFsdGh5SG9zdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy51bkhlYWx0aHlIb3N0Q291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bGwgbmFtZSBvZiBmaXJzdCBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICBwdWJsaWMgZ2V0IGZpcnN0TG9hZEJhbGFuY2VyRnVsbE5hbWUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBUYXJnZXRHcm91cCBuZWVkcyB0byBiZSBhdHRhY2hlZCB0byBhIExvYWRCYWxhbmNlciBiZWZvcmUgeW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kJyk7XG4gICAgfVxuICAgIHJldHVybiBsb2FkQmFsYW5jZXJOYW1lRnJvbUxpc3RlbmVyQXJuKHRoaXMubGlzdGVuZXJzWzBdLmxpc3RlbmVyQXJuKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVRhcmdldEdyb3VwKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXQgPSBzdXBlci52YWxpZGF0ZVRhcmdldEdyb3VwKCk7XG5cbiAgICBjb25zdCBoZWFsdGhDaGVjazogSGVhbHRoQ2hlY2sgPSB0aGlzLmhlYWx0aENoZWNrIHx8IHt9O1xuXG4gICAgY29uc3QgbG93SGVhbHRoQ2hlY2tJbnRlcnZhbCA9IDU7XG4gICAgY29uc3QgaGlnaEhlYWx0aENoZWNrSW50ZXJ2YWwgPSAzMDA7XG4gICAgaWYgKGhlYWx0aENoZWNrLmludGVydmFsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gaGVhbHRoQ2hlY2suaW50ZXJ2YWwudG9TZWNvbmRzKCk7XG4gICAgICBpZiAoIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoc2Vjb25kcykgJiYgKHNlY29uZHMgPCBsb3dIZWFsdGhDaGVja0ludGVydmFsIHx8IHNlY29uZHMgPiBoaWdoSGVhbHRoQ2hlY2tJbnRlcnZhbCkpIHtcbiAgICAgICAgcmV0LnB1c2goYEhlYWx0aCBjaGVjayBpbnRlcnZhbCAnJHtzZWNvbmRzfScgbm90IHN1cHBvcnRlZC4gTXVzdCBiZSBiZXR3ZWVuICR7bG93SGVhbHRoQ2hlY2tJbnRlcnZhbH0gYW5kICR7aGlnaEhlYWx0aENoZWNrSW50ZXJ2YWx9LmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoZWFsdGhDaGVjay5oZWFsdGh5VGhyZXNob2xkQ291bnQpIHtcbiAgICAgIGNvbnN0IHRocmVzaG9sZENvdW50ID0gaGVhbHRoQ2hlY2suaGVhbHRoeVRocmVzaG9sZENvdW50O1xuICAgICAgaWYgKHRocmVzaG9sZENvdW50IDwgMiB8fCB0aHJlc2hvbGRDb3VudCA+IDEwKSB7XG4gICAgICAgIHJldC5wdXNoKGBIZWFsdGh5IFRocmVzaG9sZCBDb3VudCAnJHt0aHJlc2hvbGRDb3VudH0nIG5vdCBzdXBwb3J0ZWQuIE11c3QgYmUgYSBudW1iZXIgYmV0d2VlbiAyIGFuZCAxMC5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGVhbHRoQ2hlY2sudW5oZWFsdGh5VGhyZXNob2xkQ291bnQpIHtcbiAgICAgIGNvbnN0IHRocmVzaG9sZENvdW50ID0gaGVhbHRoQ2hlY2sudW5oZWFsdGh5VGhyZXNob2xkQ291bnQ7XG4gICAgICBpZiAodGhyZXNob2xkQ291bnQgPCAyIHx8IHRocmVzaG9sZENvdW50ID4gMTApIHtcbiAgICAgICAgcmV0LnB1c2goYFVuaGVhbHRoeSBUaHJlc2hvbGQgQ291bnQgJyR7dGhyZXNob2xkQ291bnR9JyBub3Qgc3VwcG9ydGVkLiBNdXN0IGJlIGEgbnVtYmVyIGJldHdlZW4gMiBhbmQgMTAuYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhlYWx0aENoZWNrLmhlYWx0aHlUaHJlc2hvbGRDb3VudCAmJiBoZWFsdGhDaGVjay51bmhlYWx0aHlUaHJlc2hvbGRDb3VudCAmJlxuICAgICAgaGVhbHRoQ2hlY2suaGVhbHRoeVRocmVzaG9sZENvdW50ICE9PSBoZWFsdGhDaGVjay51bmhlYWx0aHlUaHJlc2hvbGRDb3VudCkge1xuICAgICAgcmV0LnB1c2goW1xuICAgICAgICBgSGVhbHRoeSBhbmQgVW5oZWFsdGh5IFRocmVzaG9sZCBDb3VudHMgbXVzdCBiZSB0aGUgc2FtZTogJHtoZWFsdGhDaGVjay5oZWFsdGh5VGhyZXNob2xkQ291bnR9YCxcbiAgICAgICAgYGlzIG5vdCBlcXVhbCB0byAke2hlYWx0aENoZWNrLnVuaGVhbHRoeVRocmVzaG9sZENvdW50fS5gLFxuICAgICAgXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIGlmICghaGVhbHRoQ2hlY2sucHJvdG9jb2wpIHtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgaWYgKCFOTEJfSEVBTFRIX0NIRUNLX1BST1RPQ09MUy5pbmNsdWRlcyhoZWFsdGhDaGVjay5wcm90b2NvbCkpIHtcbiAgICAgIHJldC5wdXNoKGBIZWFsdGggY2hlY2sgcHJvdG9jb2wgJyR7aGVhbHRoQ2hlY2sucHJvdG9jb2x9JyBpcyBub3Qgc3VwcG9ydGVkLiBNdXN0IGJlIG9uZSBvZiBbJHtOTEJfSEVBTFRIX0NIRUNLX1BST1RPQ09MUy5qb2luKCcsICcpfV1gKTtcbiAgICB9XG4gICAgaWYgKGhlYWx0aENoZWNrLnBhdGggJiYgIU5MQl9QQVRIX0hFQUxUSF9DSEVDS19QUk9UT0NPTFMuaW5jbHVkZXMoaGVhbHRoQ2hlY2sucHJvdG9jb2wpKSB7XG4gICAgICByZXQucHVzaChbXG4gICAgICAgIGAnJHtoZWFsdGhDaGVjay5wcm90b2NvbH0nIGhlYWx0aCBjaGVja3MgZG8gbm90IHN1cHBvcnQgdGhlIHBhdGggcHJvcGVydHkuYCxcbiAgICAgICAgYE11c3QgYmUgb25lIG9mIFske05MQl9QQVRIX0hFQUxUSF9DSEVDS19QUk9UT0NPTFMuam9pbignLCAnKX1dYCxcbiAgICAgIF0uam9pbignICcpKTtcbiAgICB9XG4gICAgaWYgKGhlYWx0aENoZWNrLnRpbWVvdXQgJiYgaGVhbHRoQ2hlY2sudGltZW91dC50b1NlY29uZHMoKSAhPT0gTkxCX0hFQUxUSF9DSEVDS19USU1FT1VUU1toZWFsdGhDaGVjay5wcm90b2NvbF0pIHtcbiAgICAgIHJldC5wdXNoKFtcbiAgICAgICAgJ0N1c3RvbSBoZWFsdGggY2hlY2sgdGltZW91dHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIE5ldHdvcmsgTG9hZCBCYWxhbmNlciBoZWFsdGggY2hlY2tzLicsXG4gICAgICAgIGBFeHBlY3RlZCAke05MQl9IRUFMVEhfQ0hFQ0tfVElNRU9VVFNbaGVhbHRoQ2hlY2sucHJvdG9jb2xdfSBzZWNvbmRzIGZvciAke2hlYWx0aENoZWNrLnByb3RvY29sfSwgZ290ICR7aGVhbHRoQ2hlY2sudGltZW91dC50b1NlY29uZHMoKX1gLFxuICAgICAgXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIG5ldHdvcmsgdGFyZ2V0IGdyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5ldHdvcmtUYXJnZXRHcm91cCBleHRlbmRzIElUYXJnZXRHcm91cCB7XG4gIC8qKlxuICAgKiBBbGwgbWV0cmljcyBhdmFpbGFibGUgZm9yIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljczogSU5ldHdvcmtUYXJnZXRHcm91cE1ldHJpY3M7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgdGhhdCBpcyBsb2FkIGJhbGFuY2luZyB0byB0aGlzIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCB3aWxsIGJlIGNhbGxlZCBieSBsaXN0ZW5lcnMuXG4gICAqL1xuICByZWdpc3Rlckxpc3RlbmVyKGxpc3RlbmVyOiBJTmV0d29ya0xpc3RlbmVyKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkIGEgbG9hZCBiYWxhbmNpbmcgdGFyZ2V0IHRvIHRoaXMgdGFyZ2V0IGdyb3VwXG4gICAqL1xuICBhZGRUYXJnZXQoLi4udGFyZ2V0czogSU5ldHdvcmtMb2FkQmFsYW5jZXJUYXJnZXRbXSk6IHZvaWQ7XG59XG5cbi8qKlxuICogQW4gaW1wb3J0ZWQgbmV0d29yayB0YXJnZXQgZ3JvdXBcbiAqL1xuY2xhc3MgSW1wb3J0ZWROZXR3b3JrVGFyZ2V0R3JvdXAgZXh0ZW5kcyBJbXBvcnRlZFRhcmdldEdyb3VwQmFzZSBpbXBsZW1lbnRzIElOZXR3b3JrVGFyZ2V0R3JvdXAge1xuICBwcml2YXRlIHJlYWRvbmx5IF9tZXRyaWNzPzogSU5ldHdvcmtUYXJnZXRHcm91cE1ldHJpY3M7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBUYXJnZXRHcm91cEltcG9ydFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgaWYgKHRoaXMubG9hZEJhbGFuY2VyQXJucyAhPSBjZGsuQXdzLk5PX1ZBTFVFKSB7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cEZ1bGxOYW1lID0gcGFyc2VUYXJnZXRHcm91cEZ1bGxOYW1lKHRoaXMudGFyZ2V0R3JvdXBBcm4pO1xuICAgICAgY29uc3QgZmlyc3RMb2FkQmFsYW5jZXJGdWxsTmFtZSA9IHBhcnNlTG9hZEJhbGFuY2VyRnVsbE5hbWUodGhpcy5sb2FkQmFsYW5jZXJBcm5zKTtcbiAgICAgIHRoaXMuX21ldHJpY3MgPSBuZXcgTmV0d29ya1RhcmdldEdyb3VwTWV0cmljcyh0aGlzLCB0YXJnZXRHcm91cEZ1bGxOYW1lLCBmaXJzdExvYWRCYWxhbmNlckZ1bGxOYW1lKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IG1ldHJpY3MoKTogSU5ldHdvcmtUYXJnZXRHcm91cE1ldHJpY3Mge1xuICAgIGlmICghdGhpcy5fbWV0cmljcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGltcG9ydGVkIE5ldHdvcmtUYXJnZXRHcm91cCBuZWVkcyB0aGUgYXNzb2NpYXRlZCBOZXR3b3JrTG9hZEJhbGFuY2VyIHRvIGJlIGFibGUgdG8gcHJvdmlkZSBtZXRyaWNzLiAnICtcbiAgICAgICAgJ1BsZWFzZSBzcGVjaWZ5IHRoZSBBUk4gdmFsdWUgd2hlbiBpbXBvcnRpbmcgaXQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNzO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTGlzdGVuZXIoX2xpc3RlbmVyOiBJTmV0d29ya0xpc3RlbmVyKSB7XG4gICAgLy8gTm90aGluZyB0byBkbywgd2Uga25vdyBub3RoaW5nIG9mIG91ciBtZW1iZXJzXG4gIH1cblxuICBwdWJsaWMgYWRkVGFyZ2V0KC4uLnRhcmdldHM6IElOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0W10pIHtcbiAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0YXJnZXQuYXR0YWNoVG9OZXR3b3JrVGFyZ2V0R3JvdXAodGhpcyk7XG4gICAgICBpZiAocmVzdWx0LnRhcmdldEpzb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgYSBub24tc2VsZiByZWdpc3RlcmluZyB0YXJnZXQgdG8gYW4gaW1wb3J0ZWQgVGFyZ2V0R3JvdXAuIENyZWF0ZSBhIG5ldyBUYXJnZXRHcm91cCBpbnN0ZWFkLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29uc3RydWN0cyB0aGF0IGNhbiBiZSB0YXJnZXRzIG9mIGFuIG5ldHdvcmsgbG9hZCBiYWxhbmNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0IHtcbiAgLyoqXG4gICAqIEF0dGFjaCBsb2FkLWJhbGFuY2VkIHRhcmdldCB0byBhIFRhcmdldEdyb3VwXG4gICAqXG4gICAqIE1heSByZXR1cm4gSlNPTiB0byBkaXJlY3RseSBhZGQgdG8gdGhlIFtUYXJnZXRzXSBsaXN0LCBvciByZXR1cm4gdW5kZWZpbmVkXG4gICAqIGlmIHRoZSB0YXJnZXQgd2lsbCByZWdpc3RlciBpdHNlbGYgd2l0aCB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIGF0dGFjaFRvTmV0d29ya1RhcmdldEdyb3VwKHRhcmdldEdyb3VwOiBJTmV0d29ya1RhcmdldEdyb3VwKTogTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHM7XG59XG5cbmNvbnN0IE5MQl9IRUFMVEhfQ0hFQ0tfUFJPVE9DT0xTID0gW1Byb3RvY29sLkhUVFAsIFByb3RvY29sLkhUVFBTLCBQcm90b2NvbC5UQ1BdO1xuY29uc3QgTkxCX1BBVEhfSEVBTFRIX0NIRUNLX1BST1RPQ09MUyA9IFtQcm90b2NvbC5IVFRQLCBQcm90b2NvbC5IVFRQU107XG5jb25zdCBOTEJfSEVBTFRIX0NIRUNLX1RJTUVPVVRTOiB7IFtwcm90b2NvbCBpbiBQcm90b2NvbF0/OiBudW1iZXIgfSA9IHtcbiAgW1Byb3RvY29sLkhUVFBdOiA2LFxuICBbUHJvdG9jb2wuSFRUUFNdOiAxMCxcbiAgW1Byb3RvY29sLlRDUF06IDEwLFxufTtcbiJdfQ==