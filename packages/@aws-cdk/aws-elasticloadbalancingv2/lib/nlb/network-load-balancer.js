"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkLoadBalancer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const network_listener_1 = require("./network-listener");
const elasticloadbalancingv2_canned_metrics_generated_1 = require("../elasticloadbalancingv2-canned-metrics.generated");
const base_load_balancer_1 = require("../shared/base-load-balancer");
const util_1 = require("../shared/util");
/**
 * The metrics for a network load balancer.
 */
class NetworkLoadBalancerMetrics {
    constructor(scope, loadBalancerFullName) {
        this.scope = scope;
        this.loadBalancerFullName = loadBalancerFullName;
    }
    custom(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/NetworkELB',
            metricName,
            dimensionsMap: { LoadBalancer: this.loadBalancerFullName },
            ...props,
        }).attachTo(this.scope);
    }
    activeFlowCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.activeFlowCountAverage, props);
    }
    consumedLCUs(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.consumedLcUsAverage, {
            statistic: 'Sum',
            ...props,
        });
    }
    newFlowCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.newFlowCountSum, props);
    }
    processedBytes(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.processedBytesSum, props);
    }
    tcpClientResetCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.tcpClientResetCountSum, props);
    }
    tcpElbResetCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.tcpElbResetCountSum, props);
    }
    tcpTargetResetCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.NetworkELBMetrics.tcpTargetResetCountSum, props);
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ LoadBalancer: this.loadBalancerFullName }),
            ...props,
        }).attachTo(this.scope);
    }
}
/**
 * Define a new network load balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
class NetworkLoadBalancer extends base_load_balancer_1.BaseLoadBalancer {
    constructor(scope, id, props) {
        super(scope, id, props, {
            type: 'network',
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkLoadBalancerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkLoadBalancer);
            }
            throw error;
        }
        this.metrics = new NetworkLoadBalancerMetrics(this, this.loadBalancerFullName);
        if (props.crossZoneEnabled) {
            this.setAttribute('load_balancing.cross_zone.enabled', 'true');
        }
    }
    /**
     * Looks up the network load balancer.
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkLoadBalancerLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        const props = base_load_balancer_1.BaseLoadBalancer._queryContextProvider(scope, {
            userOptions: options,
            loadBalancerType: cxschema.LoadBalancerType.NETWORK,
        });
        return new LookedUpNetworkLoadBalancer(scope, id, props);
    }
    static fromNetworkLoadBalancerAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkLoadBalancerAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromNetworkLoadBalancerAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.loadBalancerArn = attrs.loadBalancerArn;
                this.vpc = attrs.vpc;
                this.metrics = new NetworkLoadBalancerMetrics(this, util_1.parseLoadBalancerFullName(attrs.loadBalancerArn));
            }
            addListener(lid, props) {
                return new network_listener_1.NetworkListener(this, lid, {
                    loadBalancer: this,
                    ...props,
                });
            }
            get loadBalancerCanonicalHostedZoneId() {
                if (attrs.loadBalancerCanonicalHostedZoneId) {
                    return attrs.loadBalancerCanonicalHostedZoneId;
                }
                // eslint-disable-next-line max-len
                throw new Error(`'loadBalancerCanonicalHostedZoneId' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
            }
            get loadBalancerDnsName() {
                if (attrs.loadBalancerDnsName) {
                    return attrs.loadBalancerDnsName;
                }
                // eslint-disable-next-line max-len
                throw new Error(`'loadBalancerDnsName' was not provided when constructing Network Load Balancer ${this.node.path} from attributes`);
            }
        }
        return new Import(scope, id, { environmentFromArn: attrs.loadBalancerArn });
    }
    /**
     * Add a listener to this load balancer
     *
     * @returns The newly created listener
     */
    addListener(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_BaseNetworkListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addListener);
            }
            throw error;
        }
        return new network_listener_1.NetworkListener(this, id, {
            loadBalancer: this,
            ...props,
        });
    }
    /**
     * Return the given named metric for this Network Load Balancer
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.custom`` instead
     */
    metric(metricName, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metric", "Use ``NetworkLoadBalancer.metrics.custom`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metric);
            }
            throw error;
        }
        return new cloudwatch.Metric({
            namespace: 'AWS/NetworkELB',
            metricName,
            dimensions: { LoadBalancer: this.loadBalancerFullName },
            ...props,
        }).attachTo(this);
    }
    /**
     * The total number of concurrent TCP flows (or connections) from clients to targets.
     *
     * This metric includes connections in the SYN_SENT and ESTABLISHED states.
     * TCP connections are not terminated at the load balancer, so a client
     * opening a TCP connection to a target counts as a single flow.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead
     */
    metricActiveFlowCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricActiveFlowCount", "Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricActiveFlowCount);
            }
            throw error;
        }
        return this.metrics.activeFlowCount(props);
    }
    /**
     * The number of load balancer capacity units (LCU) used by your load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead
     */
    metricConsumedLCUs(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricConsumedLCUs", "Use ``NetworkLoadBalancer.metrics.activeFlowCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricConsumedLCUs);
            }
            throw error;
        }
        return this.metrics.consumedLCUs(props);
    }
    /**
     * The number of targets that are considered healthy.
     *
     * @default Average over 5 minutes
     * @deprecated use ``NetworkTargetGroup.metricHealthyHostCount`` instead
     */
    metricHealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricHealthyHostCount", "use ``NetworkTargetGroup.metricHealthyHostCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHealthyHostCount);
            }
            throw error;
        }
        return this.metric('HealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
    /**
     * The number of targets that are considered unhealthy.
     *
     * @default Average over 5 minutes
     * @deprecated use ``NetworkTargetGroup.metricUnHealthyHostCount`` instead
     */
    metricUnHealthyHostCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricUnHealthyHostCount", "use ``NetworkTargetGroup.metricUnHealthyHostCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricUnHealthyHostCount);
            }
            throw error;
        }
        return this.metric('UnHealthyHostCount', {
            statistic: 'Average',
            ...props,
        });
    }
    /**
     * The total number of new TCP flows (or connections) established from clients to targets in the time period.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.newFlowCount`` instead
     */
    metricNewFlowCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricNewFlowCount", "Use ``NetworkLoadBalancer.metrics.newFlowCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricNewFlowCount);
            }
            throw error;
        }
        return this.metrics.newFlowCount(props);
    }
    /**
     * The total number of bytes processed by the load balancer, including TCP/IP headers.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.processedBytes`` instead
     */
    metricProcessedBytes(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricProcessedBytes", "Use ``NetworkLoadBalancer.metrics.processedBytes`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricProcessedBytes);
            }
            throw error;
        }
        return this.metrics.processedBytes(props);
    }
    /**
     * The total number of reset (RST) packets sent from a client to a target.
     *
     * These resets are generated by the client and forwarded by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.tcpClientResetCount`` instead
     */
    metricTcpClientResetCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricTcpClientResetCount", "Use ``NetworkLoadBalancer.metrics.tcpClientResetCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTcpClientResetCount);
            }
            throw error;
        }
        return this.metrics.tcpClientResetCount(props);
    }
    /**
     * The total number of reset (RST) packets generated by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.tcpElbResetCount`` instead
     */
    metricTcpElbResetCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricTcpElbResetCount", "Use ``NetworkLoadBalancer.metrics.tcpElbResetCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTcpElbResetCount);
            }
            throw error;
        }
        return this.metrics.tcpElbResetCount(props);
    }
    /**
     * The total number of reset (RST) packets sent from a target to a client.
     *
     * These resets are generated by the target and forwarded by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``NetworkLoadBalancer.metrics.tcpTargetResetCount`` instead
     */
    metricTcpTargetResetCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer#metricTcpTargetResetCount", "Use ``NetworkLoadBalancer.metrics.tcpTargetResetCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTcpTargetResetCount);
            }
            throw error;
        }
        return this.metrics.tcpTargetResetCount(props);
    }
}
exports.NetworkLoadBalancer = NetworkLoadBalancer;
_a = JSII_RTTI_SYMBOL_1;
NetworkLoadBalancer[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer", version: "0.0.0" };
class LookedUpNetworkLoadBalancer extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, { environmentFromArn: props.loadBalancerArn });
        this.loadBalancerArn = props.loadBalancerArn;
        this.loadBalancerCanonicalHostedZoneId = props.loadBalancerCanonicalHostedZoneId;
        this.loadBalancerDnsName = props.loadBalancerDnsName;
        this.metrics = new NetworkLoadBalancerMetrics(this, util_1.parseLoadBalancerFullName(props.loadBalancerArn));
        this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
            vpcId: props.vpcId,
        });
    }
    addListener(lid, props) {
        return new network_listener_1.NetworkListener(this, lid, {
            loadBalancer: this,
            ...props,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1sb2FkLWJhbGFuY2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV0d29yay1sb2FkLWJhbGFuY2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsMkRBQTJEO0FBQzNELHdDQUF5QztBQUd6Qyx5REFBK0U7QUFDL0Usd0hBQXVGO0FBQ3ZGLHFFQUF1STtBQUN2SSx5Q0FBMkQ7QUFvRDNEOztHQUVHO0FBQ0gsTUFBTSwwQkFBMEI7SUFJOUIsWUFBWSxLQUFnQixFQUFFLG9CQUE0QjtRQUN4RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7S0FDbEQ7SUFFTSxNQUFNLENBQUMsVUFBa0IsRUFBRSxLQUFnQztRQUNoRSxPQUFPLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUMzQixTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVU7WUFDVixhQUFhLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzFELEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pCO0lBRU0sZUFBZSxDQUFDLEtBQWdDO1FBQ3JELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxtRUFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMzRTtJQUVNLFlBQVksQ0FBQyxLQUFnQztRQUNsRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsbUVBQWlCLENBQUMsbUJBQW1CLEVBQUU7WUFDOUQsU0FBUyxFQUFFLEtBQUs7WUFDaEIsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDO0tBQ0o7SUFFTSxZQUFZLENBQUMsS0FBZ0M7UUFDbEQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLG1FQUFpQixDQUFDLGVBQWUs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bUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRDs7QUF0TEgsa0RBdUxDOzs7QUErRkQsTUFBTSwyQkFBNEIsU0FBUSxlQUFRO0lBT2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0M7UUFDaEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFDN0MsSUFBSSxDQUFDLGlDQUFpQyxHQUFHLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQztRQUNqRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSwwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsZ0NBQXlCLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFFdEcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3pDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztTQUNuQixDQUFDLENBQUM7S0FDSjtJQUVNLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBK0I7UUFDN0QsT0FBTyxJQUFJLGtDQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNwQyxZQUFZLEVBQUUsSUFBSTtZQUNsQixHQUFHLEtBQUs7U0FDVCxDQUFDLENBQUM7S0FDSjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VOZXR3b3JrTGlzdGVuZXJQcm9wcywgTmV0d29ya0xpc3RlbmVyIH0gZnJvbSAnLi9uZXR3b3JrLWxpc3RlbmVyJztcbmltcG9ydCB7IE5ldHdvcmtFTEJNZXRyaWNzIH0gZnJvbSAnLi4vZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQmFzZUxvYWRCYWxhbmNlciwgQmFzZUxvYWRCYWxhbmNlckxvb2t1cE9wdGlvbnMsIEJhc2VMb2FkQmFsYW5jZXJQcm9wcywgSUxvYWRCYWxhbmNlclYyIH0gZnJvbSAnLi4vc2hhcmVkL2Jhc2UtbG9hZC1iYWxhbmNlcic7XG5pbXBvcnQgeyBwYXJzZUxvYWRCYWxhbmNlckZ1bGxOYW1lIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV0d29yayBsb2FkIGJhbGFuY2VyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0xvYWRCYWxhbmNlclByb3BzIGV4dGVuZHMgQmFzZUxvYWRCYWxhbmNlclByb3BzIHtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGNyb3NzLXpvbmUgbG9hZCBiYWxhbmNpbmcgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNyb3NzWm9uZUVuYWJsZWQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gcmVmZXJlbmNlIGFuIGV4aXN0aW5nIGxvYWQgYmFsYW5jZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrTG9hZEJhbGFuY2VyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2Fub25pY2FsIGhvc3RlZCB6b25lIElEIG9mIHRoaXMgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFdoZW4gbm90IHByb3ZpZGVkLCBMQiBjYW5ub3QgYmUgdXNlZCBhcyBSb3V0ZTUzIEFsaWFzIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEROUyBuYW1lIG9mIHRoaXMgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFdoZW4gbm90IHByb3ZpZGVkLCBMQiBjYW5ub3QgYmUgdXNlZCBhcyBSb3V0ZTUzIEFsaWFzIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckRuc05hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gV2hlbiBub3QgcHJvdmlkZWQsIGxpc3RlbmVycyBjYW5ub3QgYmUgY3JlYXRlZCBvbiBpbXBvcnRlZCBsb2FkXG4gICAqIGJhbGFuY2Vycy5cbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGxvb2tpbmcgdXAgYW4gTmV0d29ya0xvYWRCYWxhbmNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtMb2FkQmFsYW5jZXJMb29rdXBPcHRpb25zIGV4dGVuZHMgQmFzZUxvYWRCYWxhbmNlckxvb2t1cE9wdGlvbnMge1xufVxuXG4vKipcbiAqIFRoZSBtZXRyaWNzIGZvciBhIG5ldHdvcmsgbG9hZCBiYWxhbmNlci5cbiAqL1xuY2xhc3MgTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3MgaW1wbGVtZW50cyBJTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3Mge1xuICBwcml2YXRlIHJlYWRvbmx5IGxvYWRCYWxhbmNlckZ1bGxOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IENvbnN0cnVjdDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUgPSBsb2FkQmFsYW5jZXJGdWxsTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBjdXN0b20obWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB7IExvYWRCYWxhbmNlcjogdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcy5zY29wZSk7XG4gIH1cblxuICBwdWJsaWMgYWN0aXZlRmxvd0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKE5ldHdvcmtFTEJNZXRyaWNzLmFjdGl2ZUZsb3dDb3VudEF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdW1lZExDVXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoTmV0d29ya0VMQk1ldHJpY3MuY29uc3VtZWRMY1VzQXZlcmFnZSwge1xuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5ld0Zsb3dDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhOZXR3b3JrRUxCTWV0cmljcy5uZXdGbG93Q291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9jZXNzZWRCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhOZXR3b3JrRUxCTWV0cmljcy5wcm9jZXNzZWRCeXRlc1N1bSwgcHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHRjcENsaWVudFJlc2V0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoTmV0d29ya0VMQk1ldHJpY3MudGNwQ2xpZW50UmVzZXRDb3VudFN1bSwgcHJvcHMpO1xuICB9XG4gIHB1YmxpYyB0Y3BFbGJSZXNldENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKE5ldHdvcmtFTEJNZXRyaWNzLnRjcEVsYlJlc2V0Q291bnRTdW0sIHByb3BzKTtcbiAgfVxuICBwdWJsaWMgdGNwVGFyZ2V0UmVzZXRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhOZXR3b3JrRUxCTWV0cmljcy50Y3BUYXJnZXRSZXNldENvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkgPT4gY2xvdWR3YXRjaC5NZXRyaWNQcm9wcyxcbiAgICBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyxcbiAgKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBMb2FkQmFsYW5jZXI6IHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUgfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzLnNjb3BlKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhIG5ldyBuZXR3b3JrIGxvYWQgYmFsYW5jZXJcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXJcbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtMb2FkQmFsYW5jZXIgZXh0ZW5kcyBCYXNlTG9hZEJhbGFuY2VyIGltcGxlbWVudHMgSU5ldHdvcmtMb2FkQmFsYW5jZXIge1xuICAvKipcbiAgICogTG9va3MgdXAgdGhlIG5ldHdvcmsgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBOZXR3b3JrTG9hZEJhbGFuY2VyTG9va3VwT3B0aW9ucyk6IElOZXR3b3JrTG9hZEJhbGFuY2VyIHtcbiAgICBjb25zdCBwcm9wcyA9IEJhc2VMb2FkQmFsYW5jZXIuX3F1ZXJ5Q29udGV4dFByb3ZpZGVyKHNjb3BlLCB7XG4gICAgICB1c2VyT3B0aW9uczogb3B0aW9ucyxcbiAgICAgIGxvYWRCYWxhbmNlclR5cGU6IGN4c2NoZW1hLkxvYWRCYWxhbmNlclR5cGUuTkVUV09SSyxcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgTG9va2VkVXBOZXR3b3JrTG9hZEJhbGFuY2VyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tTmV0d29ya0xvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IE5ldHdvcmtMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKTogSU5ldHdvcmtMb2FkQmFsYW5jZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSU5ldHdvcmtMb2FkQmFsYW5jZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybiA9IGF0dHJzLmxvYWRCYWxhbmNlckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2cGM/OiBlYzIuSVZwYyA9IGF0dHJzLnZwYztcbiAgICAgIHB1YmxpYyByZWFkb25seSBtZXRyaWNzOiBJTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3MgPSBuZXcgTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3ModGhpcywgcGFyc2VMb2FkQmFsYW5jZXJGdWxsTmFtZShhdHRycy5sb2FkQmFsYW5jZXJBcm4pKTtcblxuICAgICAgcHVibGljIGFkZExpc3RlbmVyKGxpZDogc3RyaW5nLCBwcm9wczogQmFzZU5ldHdvcmtMaXN0ZW5lclByb3BzKTogTmV0d29ya0xpc3RlbmVyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOZXR3b3JrTGlzdGVuZXIodGhpcywgbGlkLCB7XG4gICAgICAgICAgbG9hZEJhbGFuY2VyOiB0aGlzLFxuICAgICAgICAgIC4uLnByb3BzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIGdldCBsb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGF0dHJzLmxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZCkgeyByZXR1cm4gYXR0cnMubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkOyB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJ2xvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZCcgd2FzIG5vdCBwcm92aWRlZCB3aGVuIGNvbnN0cnVjdGluZyBOZXR3b3JrIExvYWQgQmFsYW5jZXIgJHt0aGlzLm5vZGUucGF0aH0gZnJvbSBhdHRyaWJ1dGVzYCk7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBnZXQgbG9hZEJhbGFuY2VyRG5zTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYXR0cnMubG9hZEJhbGFuY2VyRG5zTmFtZSkgeyByZXR1cm4gYXR0cnMubG9hZEJhbGFuY2VyRG5zTmFtZTsgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCdsb2FkQmFsYW5jZXJEbnNOYW1lJyB3YXMgbm90IHByb3ZpZGVkIHdoZW4gY29uc3RydWN0aW5nIE5ldHdvcmsgTG9hZCBCYWxhbmNlciAke3RoaXMubm9kZS5wYXRofSBmcm9tIGF0dHJpYnV0ZXNgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQsIHsgZW52aXJvbm1lbnRGcm9tQXJuOiBhdHRycy5sb2FkQmFsYW5jZXJBcm4gfSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgbWV0cmljczogSU5ldHdvcmtMb2FkQmFsYW5jZXJNZXRyaWNzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrTG9hZEJhbGFuY2VyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzLCB7XG4gICAgICB0eXBlOiAnbmV0d29yaycsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1ldHJpY3MgPSBuZXcgTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3ModGhpcywgdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSk7XG4gICAgaWYgKHByb3BzLmNyb3NzWm9uZUVuYWJsZWQpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xvYWRfYmFsYW5jaW5nLmNyb3NzX3pvbmUuZW5hYmxlZCcsICd0cnVlJyk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICpcbiAgICogQHJldHVybnMgVGhlIG5ld2x5IGNyZWF0ZWQgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBhZGRMaXN0ZW5lcihpZDogc3RyaW5nLCBwcm9wczogQmFzZU5ldHdvcmtMaXN0ZW5lclByb3BzKTogTmV0d29ya0xpc3RlbmVyIHtcbiAgICByZXR1cm4gbmV3IE5ldHdvcmtMaXN0ZW5lcih0aGlzLCBpZCwge1xuICAgICAgbG9hZEJhbGFuY2VyOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgTmV0d29yayBMb2FkIEJhbGFuY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgTmV0d29ya0xvYWRCYWxhbmNlci5tZXRyaWNzLmN1c3RvbWBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogdGhpcy5sb2FkQmFsYW5jZXJGdWxsTmFtZSB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiBjb25jdXJyZW50IFRDUCBmbG93cyAob3IgY29ubmVjdGlvbnMpIGZyb20gY2xpZW50cyB0byB0YXJnZXRzLlxuICAgKlxuICAgKiBUaGlzIG1ldHJpYyBpbmNsdWRlcyBjb25uZWN0aW9ucyBpbiB0aGUgU1lOX1NFTlQgYW5kIEVTVEFCTElTSEVEIHN0YXRlcy5cbiAgICogVENQIGNvbm5lY3Rpb25zIGFyZSBub3QgdGVybWluYXRlZCBhdCB0aGUgbG9hZCBiYWxhbmNlciwgc28gYSBjbGllbnRcbiAgICogb3BlbmluZyBhIFRDUCBjb25uZWN0aW9uIHRvIGEgdGFyZ2V0IGNvdW50cyBhcyBhIHNpbmdsZSBmbG93LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYE5ldHdvcmtMb2FkQmFsYW5jZXIubWV0cmljcy5hY3RpdmVGbG93Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQWN0aXZlRmxvd0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5hY3RpdmVGbG93Q291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbG9hZCBiYWxhbmNlciBjYXBhY2l0eSB1bml0cyAoTENVKSB1c2VkIGJ5IHlvdXIgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYE5ldHdvcmtMb2FkQmFsYW5jZXIubWV0cmljcy5hY3RpdmVGbG93Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQ29uc3VtZWRMQ1VzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5jb25zdW1lZExDVXMocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdGFyZ2V0cyB0aGF0IGFyZSBjb25zaWRlcmVkIGhlYWx0aHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBgTmV0d29ya1RhcmdldEdyb3VwLm1ldHJpY0hlYWx0aHlIb3N0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSGVhbHRoeUhvc3RDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpYygnSGVhbHRoeUhvc3RDb3VudCcsIHtcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0YXJnZXRzIHRoYXQgYXJlIGNvbnNpZGVyZWQgdW5oZWFsdGh5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYE5ldHdvcmtUYXJnZXRHcm91cC5tZXRyaWNVbkhlYWx0aHlIb3N0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVW5IZWFsdGh5SG9zdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljKCdVbkhlYWx0aHlIb3N0Q291bnQnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgbmV3IFRDUCBmbG93cyAob3IgY29ubmVjdGlvbnMpIGVzdGFibGlzaGVkIGZyb20gY2xpZW50cyB0byB0YXJnZXRzIGluIHRoZSB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYE5ldHdvcmtMb2FkQmFsYW5jZXIubWV0cmljcy5uZXdGbG93Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljTmV3Rmxvd0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5uZXdGbG93Q291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgYnl0ZXMgcHJvY2Vzc2VkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLCBpbmNsdWRpbmcgVENQL0lQIGhlYWRlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBOZXR3b3JrTG9hZEJhbGFuY2VyLm1ldHJpY3MucHJvY2Vzc2VkQnl0ZXNgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUHJvY2Vzc2VkQnl0ZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnByb2Nlc3NlZEJ5dGVzKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIHJlc2V0IChSU1QpIHBhY2tldHMgc2VudCBmcm9tIGEgY2xpZW50IHRvIGEgdGFyZ2V0LlxuICAgKlxuICAgKiBUaGVzZSByZXNldHMgYXJlIGdlbmVyYXRlZCBieSB0aGUgY2xpZW50IGFuZCBmb3J3YXJkZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBOZXR3b3JrTG9hZEJhbGFuY2VyLm1ldHJpY3MudGNwQ2xpZW50UmVzZXRDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUY3BDbGllbnRSZXNldENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy50Y3BDbGllbnRSZXNldENvdW50KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIHJlc2V0IChSU1QpIHBhY2tldHMgZ2VuZXJhdGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgTmV0d29ya0xvYWRCYWxhbmNlci5tZXRyaWNzLnRjcEVsYlJlc2V0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGNwRWxiUmVzZXRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGNwRWxiUmVzZXRDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiByZXNldCAoUlNUKSBwYWNrZXRzIHNlbnQgZnJvbSBhIHRhcmdldCB0byBhIGNsaWVudC5cbiAgICpcbiAgICogVGhlc2UgcmVzZXRzIGFyZSBnZW5lcmF0ZWQgYnkgdGhlIHRhcmdldCBhbmQgZm9yd2FyZGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgTmV0d29ya0xvYWRCYWxhbmNlci5tZXRyaWNzLnRjcFRhcmdldFJlc2V0Q291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGNwVGFyZ2V0UmVzZXRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGNwVGFyZ2V0UmVzZXRDb3VudChwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb250YWlucyBhbGwgbWV0cmljcyBmb3IgYSBOZXR3b3JrIExvYWQgQmFsYW5jZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5ldHdvcmtMb2FkQmFsYW5jZXJNZXRyaWNzIHtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgTmV0d29yayBMb2FkIEJhbGFuY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGN1c3RvbShtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgY29uY3VycmVudCBUQ1AgZmxvd3MgKG9yIGNvbm5lY3Rpb25zKSBmcm9tIGNsaWVudHMgdG8gdGFyZ2V0cy5cbiAgICpcbiAgICogVGhpcyBtZXRyaWMgaW5jbHVkZXMgY29ubmVjdGlvbnMgaW4gdGhlIFNZTl9TRU5UIGFuZCBFU1RBQkxJU0hFRCBzdGF0ZXMuXG4gICAqIFRDUCBjb25uZWN0aW9ucyBhcmUgbm90IHRlcm1pbmF0ZWQgYXQgdGhlIGxvYWQgYmFsYW5jZXIsIHNvIGEgY2xpZW50XG4gICAqIG9wZW5pbmcgYSBUQ1AgY29ubmVjdGlvbiB0byBhIHRhcmdldCBjb3VudHMgYXMgYSBzaW5nbGUgZmxvdy5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgYWN0aXZlRmxvd0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbG9hZCBiYWxhbmNlciBjYXBhY2l0eSB1bml0cyAoTENVKSB1c2VkIGJ5IHlvdXIgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBjb25zdW1lZExDVXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiBuZXcgVENQIGZsb3dzIChvciBjb25uZWN0aW9ucykgZXN0YWJsaXNoZWQgZnJvbSBjbGllbnRzIHRvIHRhcmdldHMgaW4gdGhlIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG5ld0Zsb3dDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIHByb2Nlc3NlZCBieSB0aGUgbG9hZCBiYWxhbmNlciwgaW5jbHVkaW5nIFRDUC9JUCBoZWFkZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHByb2Nlc3NlZEJ5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgcmVzZXQgKFJTVCkgcGFja2V0cyBzZW50IGZyb20gYSBjbGllbnQgdG8gYSB0YXJnZXQuXG4gICAqXG4gICAqIFRoZXNlIHJlc2V0cyBhcmUgZ2VuZXJhdGVkIGJ5IHRoZSBjbGllbnQgYW5kIGZvcndhcmRlZCBieSB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICB0Y3BDbGllbnRSZXNldENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgcmVzZXQgKFJTVCkgcGFja2V0cyBnZW5lcmF0ZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgdGNwRWxiUmVzZXRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIHJlc2V0IChSU1QpIHBhY2tldHMgc2VudCBmcm9tIGEgdGFyZ2V0IHRvIGEgY2xpZW50LlxuICAgKlxuICAgKiBUaGVzZSByZXNldHMgYXJlIGdlbmVyYXRlZCBieSB0aGUgdGFyZ2V0IGFuZCBmb3J3YXJkZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgdGNwVGFyZ2V0UmVzZXRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xufVxuXG4vKipcbiAqIEEgbmV0d29yayBsb2FkIGJhbGFuY2VyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5ldHdvcmtMb2FkQmFsYW5jZXIgZXh0ZW5kcyBJTG9hZEJhbGFuY2VyVjIsIGVjMi5JVnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyIHtcblxuICAvKipcbiAgICogVGhlIFZQQyB0aGlzIGxvYWQgYmFsYW5jZXIgaGFzIGJlZW4gY3JlYXRlZCBpbiAoaWYgYXZhaWxhYmxlKVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIEFsbCBtZXRyaWNzIGF2YWlsYWJsZSBmb3IgdGhpcyBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNzOiBJTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3M7XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIHRoaXMgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCBsaXN0ZW5lclxuICAgKi9cbiAgYWRkTGlzdGVuZXIoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2VOZXR3b3JrTGlzdGVuZXJQcm9wcyk6IE5ldHdvcmtMaXN0ZW5lcjtcbn1cblxuY2xhc3MgTG9va2VkVXBOZXR3b3JrTG9hZEJhbGFuY2VyIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTmV0d29ya0xvYWRCYWxhbmNlciB7XG4gIHB1YmxpYyByZWFkb25seSBsb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGxvYWRCYWxhbmNlckRuc05hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG4gIHB1YmxpYyByZWFkb25seSBtZXRyaWNzOiBJTmV0d29ya0xvYWRCYWxhbmNlck1ldHJpY3M7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGN4YXBpLkxvYWRCYWxhbmNlckNvbnRleHRSZXNwb25zZSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyBlbnZpcm9ubWVudEZyb21Bcm46IHByb3BzLmxvYWRCYWxhbmNlckFybiB9KTtcblxuICAgIHRoaXMubG9hZEJhbGFuY2VyQXJuID0gcHJvcHMubG9hZEJhbGFuY2VyQXJuO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkID0gcHJvcHMubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyRG5zTmFtZSA9IHByb3BzLmxvYWRCYWxhbmNlckRuc05hbWU7XG4gICAgdGhpcy5tZXRyaWNzID0gbmV3IE5ldHdvcmtMb2FkQmFsYW5jZXJNZXRyaWNzKHRoaXMsIHBhcnNlTG9hZEJhbGFuY2VyRnVsbE5hbWUocHJvcHMubG9hZEJhbGFuY2VyQXJuKSk7XG5cbiAgICB0aGlzLnZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCAnVnBjJywge1xuICAgICAgdnBjSWQ6IHByb3BzLnZwY0lkLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZExpc3RlbmVyKGxpZDogc3RyaW5nLCBwcm9wczogQmFzZU5ldHdvcmtMaXN0ZW5lclByb3BzKTogTmV0d29ya0xpc3RlbmVyIHtcbiAgICByZXR1cm4gbmV3IE5ldHdvcmtMaXN0ZW5lcih0aGlzLCBsaWQsIHtcbiAgICAgIGxvYWRCYWxhbmNlcjogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=