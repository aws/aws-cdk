"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCodeTarget = exports.HttpCodeElb = exports.ApplicationLoadBalancer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const application_listener_1 = require("./application-listener");
const application_listener_action_1 = require("./application-listener-action");
const elasticloadbalancingv2_canned_metrics_generated_1 = require("../elasticloadbalancingv2-canned-metrics.generated");
const base_load_balancer_1 = require("../shared/base-load-balancer");
const enums_1 = require("../shared/enums");
const util_1 = require("../shared/util");
/**
 * Define an Application Load Balancer
 *
 * @resource AWS::ElasticLoadBalancingV2::LoadBalancer
 */
class ApplicationLoadBalancer extends base_load_balancer_1.BaseLoadBalancer {
    constructor(scope, id, props) {
        super(scope, id, props, {
            type: 'application',
            securityGroups: core_1.Lazy.list({ produce: () => this.connections.securityGroups.map(sg => sg.securityGroupId) }),
            ipAddressType: props.ipAddressType,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationLoadBalancerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApplicationLoadBalancer);
            }
            throw error;
        }
        this.ipAddressType = props.ipAddressType ?? enums_1.IpAddressType.IPV4;
        const securityGroups = [props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
                description: `Automatically created Security Group for ELB ${core_1.Names.uniqueId(this)}`,
                allowAllOutbound: false,
            })];
        this.connections = new ec2.Connections({ securityGroups });
        this.listeners = [];
        this.metrics = new ApplicationLoadBalancerMetrics(this, this.loadBalancerFullName);
        if (props.http2Enabled === false) {
            this.setAttribute('routing.http2.enabled', 'false');
        }
        if (props.idleTimeout !== undefined) {
            this.setAttribute('idle_timeout.timeout_seconds', props.idleTimeout.toSeconds().toString());
        }
        if (props.dropInvalidHeaderFields) {
            this.setAttribute('routing.http.drop_invalid_header_fields.enabled', 'true');
        }
        if (props.desyncMitigationMode !== undefined) {
            this.setAttribute('routing.http.desync_mitigation_mode', props.desyncMitigationMode);
        }
    }
    /**
     * Look up an application load balancer.
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationLoadBalancerLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        const props = base_load_balancer_1.BaseLoadBalancer._queryContextProvider(scope, {
            userOptions: options,
            loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        });
        return new LookedUpApplicationLoadBalancer(scope, id, props);
    }
    /**
     * Import an existing Application Load Balancer
     */
    static fromApplicationLoadBalancerAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationLoadBalancerAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromApplicationLoadBalancerAttributes);
            }
            throw error;
        }
        return new ImportedApplicationLoadBalancer(scope, id, attrs);
    }
    /**
     * Add a new listener to this load balancer
     */
    addListener(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_BaseApplicationListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addListener);
            }
            throw error;
        }
        const listener = new application_listener_1.ApplicationListener(this, id, {
            loadBalancer: this,
            ...props,
        });
        this.listeners.push(listener);
        return listener;
    }
    /**
     * Add a redirection listener to this load balancer
     */
    addRedirect(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationLoadBalancerRedirectConfig(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRedirect);
            }
            throw error;
        }
        const sourcePort = props.sourcePort ?? 80;
        const targetPort = (props.targetPort ?? 443).toString();
        return this.addListener(`Redirect${sourcePort}To${targetPort}`, {
            protocol: props.sourceProtocol ?? enums_1.ApplicationProtocol.HTTP,
            port: sourcePort,
            open: props.open ?? true,
            defaultAction: application_listener_action_1.ListenerAction.redirect({
                port: targetPort,
                protocol: props.targetProtocol ?? enums_1.ApplicationProtocol.HTTPS,
                permanent: true,
            }),
        });
    }
    /**
     * Add a security group to this load balancer
     */
    addSecurityGroup(securityGroup) {
        this.connections.addSecurityGroup(securityGroup);
    }
    /**
     * Return the given named metric for this Application Load Balancer
     *
     * @default Average over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.custom`` instead
     */
    metric(metricName, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metric", "Use ``ApplicationLoadBalancer.metrics.custom`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metric);
            }
            throw error;
        }
        return this.metrics.custom(metricName, props);
    }
    /**
     * The total number of concurrent TCP connections active from clients to the
     * load balancer and from the load balancer to targets.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.activeConnectionCount`` instead
     */
    metricActiveConnectionCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricActiveConnectionCount", "Use ``ApplicationLoadBalancer.metrics.activeConnectionCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricActiveConnectionCount);
            }
            throw error;
        }
        return this.metrics.activeConnectionCount(props);
    }
    /**
     * The number of TLS connections initiated by the client that did not
     * establish a session with the load balancer. Possible causes include a
     * mismatch of ciphers or protocols.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.clientTlsNegotiationErrorCount`` instead
     */
    metricClientTlsNegotiationErrorCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricClientTlsNegotiationErrorCount", "Use ``ApplicationLoadBalancer.metrics.clientTlsNegotiationErrorCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricClientTlsNegotiationErrorCount);
            }
            throw error;
        }
        return this.metrics.clientTlsNegotiationErrorCount(props);
    }
    /**
     * The number of load balancer capacity units (LCU) used by your load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.consumedLCUs`` instead
     */
    metricConsumedLCUs(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricConsumedLCUs", "Use ``ApplicationLoadBalancer.metrics.consumedLCUs`` instead");
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
     * The number of fixed-response actions that were successful.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.httpFixedResponseCount`` instead
     */
    metricHttpFixedResponseCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricHttpFixedResponseCount", "Use ``ApplicationLoadBalancer.metrics.httpFixedResponseCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHttpFixedResponseCount);
            }
            throw error;
        }
        return this.metrics.httpFixedResponseCount(props);
    }
    /**
     * The number of redirect actions that were successful.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.httpRedirectCount`` instead
     */
    metricHttpRedirectCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricHttpRedirectCount", "Use ``ApplicationLoadBalancer.metrics.httpRedirectCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHttpRedirectCount);
            }
            throw error;
        }
        return this.metrics.httpRedirectCount(props);
    }
    /**
     * The number of redirect actions that couldn't be completed because the URL
     * in the response location header is larger than 8K.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.httpRedirectUrlLimitExceededCount`` instead
     */
    metricHttpRedirectUrlLimitExceededCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricHttpRedirectUrlLimitExceededCount", "Use ``ApplicationLoadBalancer.metrics.httpRedirectUrlLimitExceededCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHttpRedirectUrlLimitExceededCount);
            }
            throw error;
        }
        return this.metrics.httpRedirectUrlLimitExceededCount(props);
    }
    /**
     * The number of HTTP 3xx/4xx/5xx codes that originate from the load balancer.
     *
     * This does not include any response codes generated by the targets.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.httpCodeElb`` instead
     */
    metricHttpCodeElb(code, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricHttpCodeElb", "Use ``ApplicationLoadBalancer.metrics.httpCodeElb`` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_HttpCodeElb(code);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHttpCodeElb);
            }
            throw error;
        }
        return this.metrics.httpCodeElb(code, props);
    }
    /**
     * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets
     * in the load balancer.
     *
     * This does not include any response codes generated by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.httpCodeTarget`` instead
     */
    metricHttpCodeTarget(code, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricHttpCodeTarget", "Use ``ApplicationLoadBalancer.metrics.httpCodeTarget`` instead");
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
     * The total number of bytes processed by the load balancer over IPv6.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.ipv6ProcessedBytes`` instead
     */
    metricIpv6ProcessedBytes(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricIpv6ProcessedBytes", "Use ``ApplicationLoadBalancer.metrics.ipv6ProcessedBytes`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricIpv6ProcessedBytes);
            }
            throw error;
        }
        return this.metrics.ipv6ProcessedBytes(props);
    }
    /**
     * The number of IPv6 requests received by the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.ipv6RequestCount`` instead
     */
    metricIpv6RequestCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricIpv6RequestCount", "Use ``ApplicationLoadBalancer.metrics.ipv6RequestCount`` instead");
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
     * The total number of new TCP connections established from clients to the
     * load balancer and from the load balancer to targets.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.newConnectionCount`` instead
     */
    metricNewConnectionCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricNewConnectionCount", "Use ``ApplicationLoadBalancer.metrics.newConnectionCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricNewConnectionCount);
            }
            throw error;
        }
        return this.metrics.newConnectionCount(props);
    }
    /**
     * The total number of bytes processed by the load balancer over IPv4 and IPv6.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.processedBytes`` instead
     */
    metricProcessedBytes(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricProcessedBytes", "Use ``ApplicationLoadBalancer.metrics.processedBytes`` instead");
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
     * The number of connections that were rejected because the load balancer had
     * reached its maximum number of connections.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.rejectedConnectionCount`` instead
     */
    metricRejectedConnectionCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricRejectedConnectionCount", "Use ``ApplicationLoadBalancer.metrics.rejectedConnectionCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricRejectedConnectionCount);
            }
            throw error;
        }
        return this.metrics.rejectedConnectionCount(props);
    }
    /**
     * The number of requests processed over IPv4 and IPv6.
     *
     * This count includes only the requests with a response generated by a target of the load balancer.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.requestCount`` instead
     */
    metricRequestCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricRequestCount", "Use ``ApplicationLoadBalancer.metrics.requestCount`` instead");
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
     * The number of rules processed by the load balancer given a request rate averaged over an hour.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.ruleEvaluations`` instead
     */
    metricRuleEvaluations(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricRuleEvaluations", "Use ``ApplicationLoadBalancer.metrics.ruleEvaluations`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricRuleEvaluations);
            }
            throw error;
        }
        return this.metrics.ruleEvaluations(props);
    }
    /**
     * The number of connections that were not successfully established between the load balancer and target.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.targetConnectionErrorCount`` instead
     */
    metricTargetConnectionErrorCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricTargetConnectionErrorCount", "Use ``ApplicationLoadBalancer.metrics.targetConnectionErrorCount`` instead");
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
     * @deprecated Use ``ApplicationLoadBalancer.metrics.targetResponseTime`` instead
     */
    metricTargetResponseTime(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricTargetResponseTime", "Use ``ApplicationLoadBalancer.metrics.targetResponseTime`` instead");
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
     * @deprecated Use ``ApplicationLoadBalancer.metrics.targetTLSNegotiationErrorCount`` instead
     */
    metricTargetTLSNegotiationErrorCount(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricTargetTLSNegotiationErrorCount", "Use ``ApplicationLoadBalancer.metrics.targetTLSNegotiationErrorCount`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTargetTLSNegotiationErrorCount);
            }
            throw error;
        }
        return this.metrics.targetTLSNegotiationErrorCount(props);
    }
    /**
     * The number of user authentications that could not be completed
     *
     * Because an authenticate action was misconfigured, the load balancer
     * couldn't establish a connection with the IdP, or the load balancer
     * couldn't complete the authentication flow due to an internal error.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthError`` instead
     */
    metricElbAuthError(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricElbAuthError", "Use ``ApplicationLoadBalancer.metrics.elbAuthError`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricElbAuthError);
            }
            throw error;
        }
        return this.metrics.elbAuthError(props);
    }
    /**
     * The number of user authentications that could not be completed because the
     * IdP denied access to the user or an authorization code was used more than
     * once.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthFailure`` instead
     */
    metricElbAuthFailure(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricElbAuthFailure", "Use ``ApplicationLoadBalancer.metrics.elbAuthFailure`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricElbAuthFailure);
            }
            throw error;
        }
        return this.metrics.elbAuthFailure(props);
    }
    /**
     * The time elapsed, in milliseconds, to query the IdP for the ID token and user info.
     *
     * If one or more of these operations fail, this is the time to failure.
     *
     * @default Average over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthLatency`` instead
     */
    metricElbAuthLatency(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricElbAuthLatency", "Use ``ApplicationLoadBalancer.metrics.elbAuthLatency`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricElbAuthLatency);
            }
            throw error;
        }
        return this.metrics.elbAuthLatency(props);
    }
    /**
     * The number of authenticate actions that were successful.
     *
     * This metric is incremented at the end of the authentication workflow,
     * after the load balancer has retrieved the user claims from the IdP.
     *
     * @default Sum over 5 minutes
     * @deprecated Use ``ApplicationLoadBalancer.metrics.elbAuthSuccess`` instead
     *
     */
    metricElbAuthSuccess(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer#metricElbAuthSuccess", "Use ``ApplicationLoadBalancer.metrics.elbAuthSuccess`` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricElbAuthSuccess);
            }
            throw error;
        }
        return this.metrics.elbAuthSuccess(props);
    }
}
exports.ApplicationLoadBalancer = ApplicationLoadBalancer;
_a = JSII_RTTI_SYMBOL_1;
ApplicationLoadBalancer[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ApplicationLoadBalancer", version: "0.0.0" };
class ApplicationLoadBalancerMetrics {
    constructor(scope, loadBalancerFullName) {
        this.scope = scope;
        this.loadBalancerFullName = loadBalancerFullName;
    }
    /**
     * Return the given named metric for this Application Load Balancer
     *
     * @default Average over 5 minutes
     */
    custom(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ApplicationELB',
            metricName,
            dimensionsMap: { LoadBalancer: this.loadBalancerFullName },
            ...props,
        });
    }
    activeConnectionCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.activeConnectionCountSum, props);
    }
    clientTlsNegotiationErrorCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.clientTlsNegotiationErrorCountSum, props);
    }
    consumedLCUs(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.consumedLcUsAverage, {
            statistic: 'sum',
            ...props,
        });
    }
    httpFixedResponseCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.httpFixedResponseCountSum, props);
    }
    httpRedirectCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.httpRedirectCountSum, props);
    }
    httpRedirectUrlLimitExceededCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.httpRedirectUrlLimitExceededCountSum, props);
    }
    httpCodeElb(code, props) {
        return this.custom(code, {
            statistic: 'Sum',
            ...props,
        });
    }
    httpCodeTarget(code, props) {
        return this.custom(code, {
            statistic: 'Sum',
            ...props,
        });
    }
    ipv6ProcessedBytes(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.iPv6ProcessedBytesSum, props);
    }
    ipv6RequestCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.iPv6RequestCountSum, props);
    }
    newConnectionCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.newConnectionCountSum, props);
    }
    processedBytes(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.processedBytesSum, props);
    }
    rejectedConnectionCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.rejectedConnectionCountSum, props);
    }
    requestCount(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.requestCountSum, props);
    }
    ruleEvaluations(props) {
        return this.cannedMetric(elasticloadbalancingv2_canned_metrics_generated_1.ApplicationELBMetrics.ruleEvaluationsSum, props);
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
    elbAuthError(props) {
        return this.custom('ELBAuthError', {
            statistic: 'Sum',
            ...props,
        });
    }
    elbAuthFailure(props) {
        return this.custom('ELBAuthFailure', {
            statistic: 'Sum',
            ...props,
        });
    }
    elbAuthLatency(props) {
        return this.custom('ELBAuthLatency', {
            statistic: 'Average',
            ...props,
        });
    }
    elbAuthSuccess(props) {
        return this.custom('ELBAuthSuccess', {
            statistic: 'Sum',
            ...props,
        });
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ LoadBalancer: this.loadBalancerFullName }),
            ...props,
        }).attachTo(this.scope);
    }
}
/**
 * Count of HTTP status originating from the load balancer
 *
 * This count does not include any response codes generated by the targets.
 */
var HttpCodeElb;
(function (HttpCodeElb) {
    /**
     * The number of HTTP 3XX redirection codes that originate from the load balancer.
     */
    HttpCodeElb["ELB_3XX_COUNT"] = "HTTPCode_ELB_3XX_Count";
    /**
     * The number of HTTP 4XX client error codes that originate from the load balancer.
     *
     * Client errors are generated when requests are malformed or incomplete.
     * These requests have not been received by the target. This count does not
     * include any response codes generated by the targets.
     */
    HttpCodeElb["ELB_4XX_COUNT"] = "HTTPCode_ELB_4XX_Count";
    /**
     * The number of HTTP 5XX server error codes that originate from the load balancer.
     */
    HttpCodeElb["ELB_5XX_COUNT"] = "HTTPCode_ELB_5XX_Count";
})(HttpCodeElb = exports.HttpCodeElb || (exports.HttpCodeElb = {}));
/**
 * Count of HTTP status originating from the targets
 */
var HttpCodeTarget;
(function (HttpCodeTarget) {
    /**
     * The number of 2xx response codes from targets
     */
    HttpCodeTarget["TARGET_2XX_COUNT"] = "HTTPCode_Target_2XX_Count";
    /**
     * The number of 3xx response codes from targets
     */
    HttpCodeTarget["TARGET_3XX_COUNT"] = "HTTPCode_Target_3XX_Count";
    /**
     * The number of 4xx response codes from targets
     */
    HttpCodeTarget["TARGET_4XX_COUNT"] = "HTTPCode_Target_4XX_Count";
    /**
     * The number of 5xx response codes from targets
     */
    HttpCodeTarget["TARGET_5XX_COUNT"] = "HTTPCode_Target_5XX_Count";
})(HttpCodeTarget = exports.HttpCodeTarget || (exports.HttpCodeTarget = {}));
/**
 * An ApplicationLoadBalancer that has been defined elsewhere
 */
class ImportedApplicationLoadBalancer extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            environmentFromArn: props.loadBalancerArn,
        });
        this.props = props;
        this.vpc = props.vpc;
        this.loadBalancerArn = props.loadBalancerArn;
        this.connections = new ec2.Connections({
            securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', props.securityGroupId, {
                    allowAllOutbound: props.securityGroupAllowsAllOutbound,
                })],
        });
        this.metrics = new ApplicationLoadBalancerMetrics(this, util_1.parseLoadBalancerFullName(props.loadBalancerArn));
    }
    get listeners() {
        throw Error('.listeners can only be accessed if the class was constructed as an owned, not imported, load balancer');
    }
    addListener(id, props) {
        return new application_listener_1.ApplicationListener(this, id, {
            loadBalancer: this,
            ...props,
        });
    }
    get loadBalancerCanonicalHostedZoneId() {
        if (this.props.loadBalancerCanonicalHostedZoneId) {
            return this.props.loadBalancerCanonicalHostedZoneId;
        }
        // eslint-disable-next-line max-len
        throw new Error(`'loadBalancerCanonicalHostedZoneId' was not provided when constructing Application Load Balancer ${this.node.path} from attributes`);
    }
    get loadBalancerDnsName() {
        if (this.props.loadBalancerDnsName) {
            return this.props.loadBalancerDnsName;
        }
        // eslint-disable-next-line max-len
        throw new Error(`'loadBalancerDnsName' was not provided when constructing Application Load Balancer ${this.node.path} from attributes`);
    }
}
class LookedUpApplicationLoadBalancer extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            environmentFromArn: props.loadBalancerArn,
        });
        this.loadBalancerArn = props.loadBalancerArn;
        this.loadBalancerCanonicalHostedZoneId = props.loadBalancerCanonicalHostedZoneId;
        this.loadBalancerDnsName = props.loadBalancerDnsName;
        if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.IPV4) {
            this.ipAddressType = enums_1.IpAddressType.IPV4;
        }
        else if (props.ipAddressType === cxapi.LoadBalancerIpAddressType.DUAL_STACK) {
            this.ipAddressType = enums_1.IpAddressType.DUAL_STACK;
        }
        this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
            vpcId: props.vpcId,
        });
        this.connections = new ec2.Connections();
        for (const securityGroupId of props.securityGroupIds) {
            const securityGroup = ec2.SecurityGroup.fromLookupById(this, `SecurityGroup-${securityGroupId}`, securityGroupId);
            this.connections.addSecurityGroup(securityGroup);
        }
        this.metrics = new ApplicationLoadBalancerMetrics(this, util_1.parseLoadBalancerFullName(this.loadBalancerArn));
    }
    get listeners() {
        throw Error('.listeners can only be accessed if the class was constructed as an owned, not looked up, load balancer');
    }
    addListener(id, props) {
        return new application_listener_1.ApplicationListener(this, id, {
            ...props,
            loadBalancer: this,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4QywyREFBMkQ7QUFDM0Qsd0NBQWdFO0FBQ2hFLHlDQUF5QztBQUV6QyxpRUFBMkY7QUFDM0YsK0VBQStEO0FBQy9ELHdIQUEyRjtBQUMzRixxRUFBdUk7QUFDdkksMkNBQTJGO0FBQzNGLHlDQUEyRDtBQTJEM0Q7Ozs7R0FJRztBQUNILE1BQWEsdUJBQXdCLFNBQVEscUNBQWdCO0lBMkIzRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRTtZQUN0QixJQUFJLEVBQUUsYUFBYTtZQUNuQixjQUFjLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztZQUMzRyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7U0FDbkMsQ0FBQyxDQUFDOzs7Ozs7K0NBaENNLHVCQUF1Qjs7OztRQWtDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLHFCQUFhLENBQUMsSUFBSSxDQUFDO1FBQy9ELE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtnQkFDMUYsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO2dCQUNkLFdBQVcsRUFBRSxnREFBZ0QsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMs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QUFHLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLGVBQWUsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2xILElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbEQ7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksOEJBQThCLENBQUMsSUFBSSxFQUFFLGdDQUF5QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0tBQzFHO0lBN0JELElBQVcsU0FBUztRQUNsQixNQUFNLEtBQUssQ0FBQyx3R0FBd0csQ0FBQyxDQUFDO0tBQ3ZIO0lBNkJNLFdBQVcsQ0FBQyxFQUFVLEVBQUUsS0FBbUM7UUFDaEUsT0FBTyxJQUFJLDBDQUFtQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDdkMsR0FBRyxLQUFLO1lBQ1IsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IER1cmF0aW9uLCBMYXp5LCBOYW1lcywgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uTGlzdGVuZXIsIEJhc2VBcHBsaWNhdGlvbkxpc3RlbmVyUHJvcHMgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWxpc3RlbmVyJztcbmltcG9ydCB7IExpc3RlbmVyQWN0aW9uIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1saXN0ZW5lci1hY3Rpb24nO1xuaW1wb3J0IHsgQXBwbGljYXRpb25FTEJNZXRyaWNzIH0gZnJvbSAnLi4vZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQmFzZUxvYWRCYWxhbmNlciwgQmFzZUxvYWRCYWxhbmNlckxvb2t1cE9wdGlvbnMsIEJhc2VMb2FkQmFsYW5jZXJQcm9wcywgSUxvYWRCYWxhbmNlclYyIH0gZnJvbSAnLi4vc2hhcmVkL2Jhc2UtbG9hZC1iYWxhbmNlcic7XG5pbXBvcnQgeyBJcEFkZHJlc3NUeXBlLCBBcHBsaWNhdGlvblByb3RvY29sLCBEZXN5bmNNaXRpZ2F0aW9uTW9kZSB9IGZyb20gJy4uL3NoYXJlZC9lbnVtcyc7XG5pbXBvcnQgeyBwYXJzZUxvYWRCYWxhbmNlckZ1bGxOYW1lIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclByb3BzIGV4dGVuZHMgQmFzZUxvYWRCYWxhbmNlclByb3BzIHtcbiAgLyoqXG4gICAqIFNlY3VyaXR5IGdyb3VwIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBAZGVmYXVsdCBBIHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIElQIGFkZHJlc3NlcyB0byB1c2VcbiAgICpcbiAgICogT25seSBhcHBsaWVzIHRvIGFwcGxpY2F0aW9uIGxvYWQgYmFsYW5jZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJcEFkZHJlc3NUeXBlLklwdjRcbiAgICovXG4gIHJlYWRvbmx5IGlwQWRkcmVzc1R5cGU/OiBJcEFkZHJlc3NUeXBlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBIVFRQLzIgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cDJFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGxvYWQgYmFsYW5jZXIgaWRsZSB0aW1lb3V0LCBpbiBzZWNvbmRzXG4gICAqXG4gICAqIEBkZWZhdWx0IDYwXG4gICAqL1xuICByZWFkb25seSBpZGxlVGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBIVFRQIGhlYWRlcnMgd2l0aCBpbnZhbGlkIGhlYWRlciBmaWVsZHMgYXJlIHJlbW92ZWRcbiAgICogYnkgdGhlIGxvYWQgYmFsYW5jZXIgKHRydWUpIG9yIHJvdXRlZCB0byB0YXJnZXRzIChmYWxzZSlcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGRyb3BJbnZhbGlkSGVhZGVyRmllbGRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBob3cgdGhlIGxvYWQgYmFsYW5jZXIgaGFuZGxlcyByZXF1ZXN0cyB0aGF0XG4gICAqIG1pZ2h0IHBvc2UgYSBzZWN1cml0eSByaXNrIHRvIHlvdXIgYXBwbGljYXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgRGVzeW5jTWl0aWdhdGlvbk1vZGUuREVGRU5TSVZFXG4gICAqL1xuICByZWFkb25seSBkZXN5bmNNaXRpZ2F0aW9uTW9kZT86IERlc3luY01pdGlnYXRpb25Nb2RlO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGxvb2tpbmcgdXAgYW4gQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlckxvb2t1cE9wdGlvbnMgZXh0ZW5kcyBCYXNlTG9hZEJhbGFuY2VyTG9va3VwT3B0aW9ucyB7XG59XG5cbi8qKlxuICogRGVmaW5lIGFuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXJcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIGV4dGVuZHMgQmFzZUxvYWRCYWxhbmNlciBpbXBsZW1lbnRzIElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciB7XG4gIC8qKlxuICAgKiBMb29rIHVwIGFuIGFwcGxpY2F0aW9uIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Mb29rdXAoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJMb29rdXBPcHRpb25zKTogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIHtcbiAgICBjb25zdCBwcm9wcyA9IEJhc2VMb2FkQmFsYW5jZXIuX3F1ZXJ5Q29udGV4dFByb3ZpZGVyKHNjb3BlLCB7XG4gICAgICB1c2VyT3B0aW9uczogb3B0aW9ucyxcbiAgICAgIGxvYWRCYWxhbmNlclR5cGU6IGN4c2NoZW1hLkxvYWRCYWxhbmNlclR5cGUuQVBQTElDQVRJT04sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IExvb2tlZFVwQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhcbiAgICBzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKTogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIHtcblxuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zO1xuICBwdWJsaWMgcmVhZG9ubHkgaXBBZGRyZXNzVHlwZT86IElwQWRkcmVzc1R5cGU7XG4gIHB1YmxpYyByZWFkb25seSBsaXN0ZW5lcnM6IEFwcGxpY2F0aW9uTGlzdGVuZXJbXTtcbiAgcHVibGljIHJlYWRvbmx5IG1ldHJpY3M6IElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlck1ldHJpY3M7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzLCB7XG4gICAgICB0eXBlOiAnYXBwbGljYXRpb24nLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCkgfSksXG4gICAgICBpcEFkZHJlc3NUeXBlOiBwcm9wcy5pcEFkZHJlc3NUeXBlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pcEFkZHJlc3NUeXBlID0gcHJvcHMuaXBBZGRyZXNzVHlwZSA/PyBJcEFkZHJlc3NUeXBlLklQVjQ7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cHMgPSBbcHJvcHMuc2VjdXJpdHlHcm91cCB8fCBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQXV0b21hdGljYWxseSBjcmVhdGVkIFNlY3VyaXR5IEdyb3VwIGZvciBFTEIgJHtOYW1lcy51bmlxdWVJZCh0aGlzKX1gLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgfSldO1xuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgZWMyLkNvbm5lY3Rpb25zKHsgc2VjdXJpdHlHcm91cHMgfSk7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLm1ldHJpY3MgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJNZXRyaWNzKHRoaXMsIHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUpO1xuXG4gICAgaWYgKHByb3BzLmh0dHAyRW5hYmxlZCA9PT0gZmFsc2UpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ3JvdXRpbmcuaHR0cDIuZW5hYmxlZCcsICdmYWxzZScpOyB9XG4gICAgaWYgKHByb3BzLmlkbGVUaW1lb3V0ICE9PSB1bmRlZmluZWQpIHsgdGhpcy5zZXRBdHRyaWJ1dGUoJ2lkbGVfdGltZW91dC50aW1lb3V0X3NlY29uZHMnLCBwcm9wcy5pZGxlVGltZW91dC50b1NlY29uZHMoKS50b1N0cmluZygpKTsgfVxuICAgIGlmIChwcm9wcy5kcm9wSW52YWxpZEhlYWRlckZpZWxkcykge3RoaXMuc2V0QXR0cmlidXRlKCdyb3V0aW5nLmh0dHAuZHJvcF9pbnZhbGlkX2hlYWRlcl9maWVsZHMuZW5hYmxlZCcsICd0cnVlJyk7IH1cbiAgICBpZiAocHJvcHMuZGVzeW5jTWl0aWdhdGlvbk1vZGUgIT09IHVuZGVmaW5lZCkge3RoaXMuc2V0QXR0cmlidXRlKCdyb3V0aW5nLmh0dHAuZGVzeW5jX21pdGlnYXRpb25fbW9kZScsIHByb3BzLmRlc3luY01pdGlnYXRpb25Nb2RlKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBsaXN0ZW5lciB0byB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHB1YmxpYyBhZGRMaXN0ZW5lcihpZDogc3RyaW5nLCBwcm9wczogQmFzZUFwcGxpY2F0aW9uTGlzdGVuZXJQcm9wcyk6IEFwcGxpY2F0aW9uTGlzdGVuZXIge1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbmV3IEFwcGxpY2F0aW9uTGlzdGVuZXIodGhpcywgaWQsIHtcbiAgICAgIGxvYWRCYWxhbmNlcjogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZWRpcmVjdGlvbiBsaXN0ZW5lciB0byB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHB1YmxpYyBhZGRSZWRpcmVjdChwcm9wczogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJSZWRpcmVjdENvbmZpZyA9IHt9KTogQXBwbGljYXRpb25MaXN0ZW5lciB7XG4gICAgY29uc3Qgc291cmNlUG9ydCA9IHByb3BzLnNvdXJjZVBvcnQgPz8gODA7XG4gICAgY29uc3QgdGFyZ2V0UG9ydCA9IChwcm9wcy50YXJnZXRQb3J0ID8/IDQ0MykudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihgUmVkaXJlY3Qke3NvdXJjZVBvcnR9VG8ke3RhcmdldFBvcnR9YCwge1xuICAgICAgcHJvdG9jb2w6IHByb3BzLnNvdXJjZVByb3RvY29sID8/IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgIHBvcnQ6IHNvdXJjZVBvcnQsXG4gICAgICBvcGVuOiBwcm9wcy5vcGVuID8/IHRydWUsXG4gICAgICBkZWZhdWx0QWN0aW9uOiBMaXN0ZW5lckFjdGlvbi5yZWRpcmVjdCh7XG4gICAgICAgIHBvcnQ6IHRhcmdldFBvcnQsXG4gICAgICAgIHByb3RvY29sOiBwcm9wcy50YXJnZXRQcm90b2NvbCA/PyBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTLFxuICAgICAgICBwZXJtYW5lbnQ6IHRydWUsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzZWN1cml0eSBncm91cCB0byB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHB1YmxpYyBhZGRTZWN1cml0eUdyb3VwKHNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cCkge1xuICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkU2VjdXJpdHlHcm91cChzZWN1cml0eUdyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5jdXN0b21gYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5jdXN0b20obWV0cmljTmFtZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgY29uY3VycmVudCBUQ1AgY29ubmVjdGlvbnMgYWN0aXZlIGZyb20gY2xpZW50cyB0byB0aGVcbiAgICogbG9hZCBiYWxhbmNlciBhbmQgZnJvbSB0aGUgbG9hZCBiYWxhbmNlciB0byB0YXJnZXRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5hY3RpdmVDb25uZWN0aW9uQ291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQWN0aXZlQ29ubmVjdGlvbkNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5hY3RpdmVDb25uZWN0aW9uQ291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgVExTIGNvbm5lY3Rpb25zIGluaXRpYXRlZCBieSB0aGUgY2xpZW50IHRoYXQgZGlkIG5vdFxuICAgKiBlc3RhYmxpc2ggYSBzZXNzaW9uIHdpdGggdGhlIGxvYWQgYmFsYW5jZXIuIFBvc3NpYmxlIGNhdXNlcyBpbmNsdWRlIGFcbiAgICogbWlzbWF0Y2ggb2YgY2lwaGVycyBvciBwcm90b2NvbHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLmNsaWVudFRsc05lZ290aWF0aW9uRXJyb3JDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDbGllbnRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmNsaWVudFRsc05lZ290aWF0aW9uRXJyb3JDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBsb2FkIGJhbGFuY2VyIGNhcGFjaXR5IHVuaXRzIChMQ1UpIHVzZWQgYnkgeW91ciBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5jb25zdW1lZExDVXNgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQ29uc3VtZWRMQ1VzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5jb25zdW1lZExDVXMocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgZml4ZWQtcmVzcG9uc2UgYWN0aW9ucyB0aGF0IHdlcmUgc3VjY2Vzc2Z1bC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLm1ldHJpY3MuaHR0cEZpeGVkUmVzcG9uc2VDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIdHRwRml4ZWRSZXNwb25zZUNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5odHRwRml4ZWRSZXNwb25zZUNvdW50KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHJlZGlyZWN0IGFjdGlvbnMgdGhhdCB3ZXJlIHN1Y2Nlc3NmdWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLmh0dHBSZWRpcmVjdENvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY0h0dHBSZWRpcmVjdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5odHRwUmVkaXJlY3RDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWRpcmVjdCBhY3Rpb25zIHRoYXQgY291bGRuJ3QgYmUgY29tcGxldGVkIGJlY2F1c2UgdGhlIFVSTFxuICAgKiBpbiB0aGUgcmVzcG9uc2UgbG9jYXRpb24gaGVhZGVyIGlzIGxhcmdlciB0aGFuIDhLLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5odHRwUmVkaXJlY3RVcmxMaW1pdEV4Y2VlZGVkQ291bnRgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSHR0cFJlZGlyZWN0VXJsTGltaXRFeGNlZWRlZENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5odHRwUmVkaXJlY3RVcmxMaW1pdEV4Y2VlZGVkQ291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgSFRUUCAzeHgvNHh4LzV4eCBjb2RlcyB0aGF0IG9yaWdpbmF0ZSBmcm9tIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBUaGlzIGRvZXMgbm90IGluY2x1ZGUgYW55IHJlc3BvbnNlIGNvZGVzIGdlbmVyYXRlZCBieSB0aGUgdGFyZ2V0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLm1ldHJpY3MuaHR0cENvZGVFbGJgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSHR0cENvZGVFbGIoY29kZTogSHR0cENvZGVFbGIsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5odHRwQ29kZUVsYihjb2RlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDJ4eC8zeHgvNHh4LzV4eCByZXNwb25zZSBjb2RlcyBnZW5lcmF0ZWQgYnkgYWxsIHRhcmdldHNcbiAgICogaW4gdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIFRoaXMgZG9lcyBub3QgaW5jbHVkZSBhbnkgcmVzcG9uc2UgY29kZXMgZ2VuZXJhdGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5odHRwQ29kZVRhcmdldGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIdHRwQ29kZVRhcmdldChjb2RlOiBIdHRwQ29kZVRhcmdldCwgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmh0dHBDb2RlVGFyZ2V0KGNvZGUsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIHByb2Nlc3NlZCBieSB0aGUgbG9hZCBiYWxhbmNlciBvdmVyIElQdjYuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLmlwdjZQcm9jZXNzZWRCeXRlc2BgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNJcHY2UHJvY2Vzc2VkQnl0ZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmlwdjZQcm9jZXNzZWRCeXRlcyhwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBJUHY2IHJlcXVlc3RzIHJlY2VpdmVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5pcHY2UmVxdWVzdENvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY0lwdjZSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmlwdjZSZXF1ZXN0Q291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgbmV3IFRDUCBjb25uZWN0aW9ucyBlc3RhYmxpc2hlZCBmcm9tIGNsaWVudHMgdG8gdGhlXG4gICAqIGxvYWQgYmFsYW5jZXIgYW5kIGZyb20gdGhlIGxvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLm1ldHJpY3MubmV3Q29ubmVjdGlvbkNvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY05ld0Nvbm5lY3Rpb25Db3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MubmV3Q29ubmVjdGlvbkNvdW50KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIHByb2Nlc3NlZCBieSB0aGUgbG9hZCBiYWxhbmNlciBvdmVyIElQdjQgYW5kIElQdjYuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLnByb2Nlc3NlZEJ5dGVzYGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY1Byb2Nlc3NlZEJ5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5wcm9jZXNzZWRCeXRlcyhwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBjb25uZWN0aW9ucyB0aGF0IHdlcmUgcmVqZWN0ZWQgYmVjYXVzZSB0aGUgbG9hZCBiYWxhbmNlciBoYWRcbiAgICogcmVhY2hlZCBpdHMgbWF4aW11bSBudW1iZXIgb2YgY29ubmVjdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLnJlamVjdGVkQ29ubmVjdGlvbkNvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY1JlamVjdGVkQ29ubmVjdGlvbkNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5yZWplY3RlZENvbm5lY3Rpb25Db3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZXF1ZXN0cyBwcm9jZXNzZWQgb3ZlciBJUHY0IGFuZCBJUHY2LlxuICAgKlxuICAgKiBUaGlzIGNvdW50IGluY2x1ZGVzIG9ubHkgdGhlIHJlcXVlc3RzIHdpdGggYSByZXNwb25zZSBnZW5lcmF0ZWQgYnkgYSB0YXJnZXQgb2YgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLnJlcXVlc3RDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNSZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnJlcXVlc3RDb3VudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBydWxlcyBwcm9jZXNzZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIgZ2l2ZW4gYSByZXF1ZXN0IHJhdGUgYXZlcmFnZWQgb3ZlciBhbiBob3VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5ydWxlRXZhbHVhdGlvbnNgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUnVsZUV2YWx1YXRpb25zKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5ydWxlRXZhbHVhdGlvbnMocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgY29ubmVjdGlvbnMgdGhhdCB3ZXJlIG5vdCBzdWNjZXNzZnVsbHkgZXN0YWJsaXNoZWQgYmV0d2VlbiB0aGUgbG9hZCBiYWxhbmNlciBhbmQgdGFyZ2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy50YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudGBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUYXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnQocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGVsYXBzZWQsIGluIHNlY29uZHMsIGFmdGVyIHRoZSByZXF1ZXN0IGxlYXZlcyB0aGUgbG9hZCBiYWxhbmNlciB1bnRpbCBhIHJlc3BvbnNlIGZyb20gdGhlIHRhcmdldCBpcyByZWNlaXZlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLnRhcmdldFJlc3BvbnNlVGltZWBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUYXJnZXRSZXNwb25zZVRpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLnRhcmdldFJlc3BvbnNlVGltZShwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBUTFMgY29ubmVjdGlvbnMgaW5pdGlhdGVkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyIHRoYXQgZGlkIG5vdCBlc3RhYmxpc2ggYSBzZXNzaW9uIHdpdGggdGhlIHRhcmdldC5cbiAgICpcbiAgICogUG9zc2libGUgY2F1c2VzIGluY2x1ZGUgYSBtaXNtYXRjaCBvZiBjaXBoZXJzIG9yIHByb3RvY29scy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLm1ldHJpY3MudGFyZ2V0VExTTmVnb3RpYXRpb25FcnJvckNvdW50YGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIG1ldHJpY1RhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MudGFyZ2V0VExTTmVnb3RpYXRpb25FcnJvckNvdW50KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHVzZXIgYXV0aGVudGljYXRpb25zIHRoYXQgY291bGQgbm90IGJlIGNvbXBsZXRlZFxuICAgKlxuICAgKiBCZWNhdXNlIGFuIGF1dGhlbnRpY2F0ZSBhY3Rpb24gd2FzIG1pc2NvbmZpZ3VyZWQsIHRoZSBsb2FkIGJhbGFuY2VyXG4gICAqIGNvdWxkbid0IGVzdGFibGlzaCBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgSWRQLCBvciB0aGUgbG9hZCBiYWxhbmNlclxuICAgKiBjb3VsZG4ndCBjb21wbGV0ZSB0aGUgYXV0aGVudGljYXRpb24gZmxvdyBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3IuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5tZXRyaWNzLmVsYkF1dGhFcnJvcmBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNFbGJBdXRoRXJyb3IocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmVsYkF1dGhFcnJvcihwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB1c2VyIGF1dGhlbnRpY2F0aW9ucyB0aGF0IGNvdWxkIG5vdCBiZSBjb21wbGV0ZWQgYmVjYXVzZSB0aGVcbiAgICogSWRQIGRlbmllZCBhY2Nlc3MgdG8gdGhlIHVzZXIgb3IgYW4gYXV0aG9yaXphdGlvbiBjb2RlIHdhcyB1c2VkIG1vcmUgdGhhblxuICAgKiBvbmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5lbGJBdXRoRmFpbHVyZWBgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNFbGJBdXRoRmFpbHVyZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MuZWxiQXV0aEZhaWx1cmUocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGVsYXBzZWQsIGluIG1pbGxpc2Vjb25kcywgdG8gcXVlcnkgdGhlIElkUCBmb3IgdGhlIElEIHRva2VuIGFuZCB1c2VyIGluZm8uXG4gICAqXG4gICAqIElmIG9uZSBvciBtb3JlIG9mIHRoZXNlIG9wZXJhdGlvbnMgZmFpbCwgdGhpcyBpcyB0aGUgdGltZSB0byBmYWlsdXJlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLm1ldHJpY3MuZWxiQXV0aExhdGVuY3lgYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgbWV0cmljRWxiQXV0aExhdGVuY3kocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLmVsYkF1dGhMYXRlbmN5KHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGF1dGhlbnRpY2F0ZSBhY3Rpb25zIHRoYXQgd2VyZSBzdWNjZXNzZnVsLlxuICAgKlxuICAgKiBUaGlzIG1ldHJpYyBpcyBpbmNyZW1lbnRlZCBhdCB0aGUgZW5kIG9mIHRoZSBhdXRoZW50aWNhdGlvbiB3b3JrZmxvdyxcbiAgICogYWZ0ZXIgdGhlIGxvYWQgYmFsYW5jZXIgaGFzIHJldHJpZXZlZCB0aGUgdXNlciBjbGFpbXMgZnJvbSB0aGUgSWRQLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIubWV0cmljcy5lbGJBdXRoU3VjY2Vzc2BgIGluc3RlYWRcbiAgICpcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNFbGJBdXRoU3VjY2Vzcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY3MuZWxiQXV0aFN1Y2Nlc3MocHJvcHMpO1xuICB9XG59XG5cbmNsYXNzIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyTWV0cmljcyBpbXBsZW1lbnRzIElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlck1ldHJpY3Mge1xuICBwcml2YXRlIHJlYWRvbmx5IHNjb3BlOiBDb25zdHJ1Y3Q7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9hZEJhbGFuY2VyRnVsbE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBsb2FkQmFsYW5jZXJGdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUgPSBsb2FkQmFsYW5jZXJGdWxsTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBjdXN0b20obWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uc01hcDogeyBMb2FkQmFsYW5jZXI6IHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUgfSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFjdGl2ZUNvbm5lY3Rpb25Db3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcHBsaWNhdGlvbkVMQk1ldHJpY3MuYWN0aXZlQ29ubmVjdGlvbkNvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgY2xpZW50VGxzTmVnb3RpYXRpb25FcnJvckNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5jbGllbnRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdW1lZExDVXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBwbGljYXRpb25FTEJNZXRyaWNzLmNvbnN1bWVkTGNVc0F2ZXJhZ2UsIHtcbiAgICAgIHN0YXRpc3RpYzogJ3N1bScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBodHRwRml4ZWRSZXNwb25zZUNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5odHRwRml4ZWRSZXNwb25zZUNvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgaHR0cFJlZGlyZWN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBwbGljYXRpb25FTEJNZXRyaWNzLmh0dHBSZWRpcmVjdENvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgaHR0cFJlZGlyZWN0VXJsTGltaXRFeGNlZWRlZENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5odHRwUmVkaXJlY3RVcmxMaW1pdEV4Y2VlZGVkQ291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBodHRwQ29kZUVsYihjb2RlOiBIdHRwQ29kZUVsYiwgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oY29kZSwge1xuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGh0dHBDb2RlVGFyZ2V0KGNvZGU6IEh0dHBDb2RlVGFyZ2V0LCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbShjb2RlLCB7XG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaXB2NlByb2Nlc3NlZEJ5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5pUHY2UHJvY2Vzc2VkQnl0ZXNTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBpcHY2UmVxdWVzdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5pUHY2UmVxdWVzdENvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgbmV3Q29ubmVjdGlvbkNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwcGxpY2F0aW9uRUxCTWV0cmljcy5uZXdDb25uZWN0aW9uQ291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9jZXNzZWRCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcHBsaWNhdGlvbkVMQk1ldHJpY3MucHJvY2Vzc2VkQnl0ZXNTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyByZWplY3RlZENvbm5lY3Rpb25Db3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcHBsaWNhdGlvbkVMQk1ldHJpY3MucmVqZWN0ZWRDb25uZWN0aW9uQ291bnRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyByZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBwbGljYXRpb25FTEJNZXRyaWNzLnJlcXVlc3RDb3VudFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHJ1bGVFdmFsdWF0aW9ucyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcHBsaWNhdGlvbkVMQk1ldHJpY3MucnVsZUV2YWx1YXRpb25zU3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgdGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ1RhcmdldENvbm5lY3Rpb25FcnJvckNvdW50Jywge1xuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRhcmdldFJlc3BvbnNlVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnVGFyZ2V0UmVzcG9uc2VUaW1lJywge1xuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0YXJnZXRUTFNOZWdvdGlhdGlvbkVycm9yQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ1RhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudCcsIHtcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbGJBdXRoRXJyb3IocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ0VMQkF1dGhFcnJvcicsIHtcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbGJBdXRoRmFpbHVyZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnRUxCQXV0aEZhaWx1cmUnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZWxiQXV0aExhdGVuY3kocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oJ0VMQkF1dGhMYXRlbmN5Jywge1xuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbGJBdXRoU3VjY2Vzcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbSgnRUxCQXV0aFN1Y2Nlc3MnLCB7XG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkgPT4gY2xvdWR3YXRjaC5NZXRyaWNQcm9wcyxcbiAgICBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyxcbiAgKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBMb2FkQmFsYW5jZXI6IHRoaXMubG9hZEJhbGFuY2VyRnVsbE5hbWUgfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzLnNjb3BlKTtcbiAgfVxufVxuXG4vKipcbiAqIENvdW50IG9mIEhUVFAgc3RhdHVzIG9yaWdpbmF0aW5nIGZyb20gdGhlIGxvYWQgYmFsYW5jZXJcbiAqXG4gKiBUaGlzIGNvdW50IGRvZXMgbm90IGluY2x1ZGUgYW55IHJlc3BvbnNlIGNvZGVzIGdlbmVyYXRlZCBieSB0aGUgdGFyZ2V0cy5cbiAqL1xuZXhwb3J0IGVudW0gSHR0cENvZGVFbGIge1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDNYWCByZWRpcmVjdGlvbiBjb2RlcyB0aGF0IG9yaWdpbmF0ZSBmcm9tIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKi9cbiAgRUxCXzNYWF9DT1VOVCA9ICdIVFRQQ29kZV9FTEJfM1hYX0NvdW50JyxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDRYWCBjbGllbnQgZXJyb3IgY29kZXMgdGhhdCBvcmlnaW5hdGUgZnJvbSB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQ2xpZW50IGVycm9ycyBhcmUgZ2VuZXJhdGVkIHdoZW4gcmVxdWVzdHMgYXJlIG1hbGZvcm1lZCBvciBpbmNvbXBsZXRlLlxuICAgKiBUaGVzZSByZXF1ZXN0cyBoYXZlIG5vdCBiZWVuIHJlY2VpdmVkIGJ5IHRoZSB0YXJnZXQuIFRoaXMgY291bnQgZG9lcyBub3RcbiAgICogaW5jbHVkZSBhbnkgcmVzcG9uc2UgY29kZXMgZ2VuZXJhdGVkIGJ5IHRoZSB0YXJnZXRzLlxuICAgKi9cbiAgRUxCXzRYWF9DT1VOVCA9ICdIVFRQQ29kZV9FTEJfNFhYX0NvdW50JyxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBIVFRQIDVYWCBzZXJ2ZXIgZXJyb3IgY29kZXMgdGhhdCBvcmlnaW5hdGUgZnJvbSB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIEVMQl81WFhfQ09VTlQgPSAnSFRUUENvZGVfRUxCXzVYWF9Db3VudCcsXG59XG5cbi8qKlxuICogQ291bnQgb2YgSFRUUCBzdGF0dXMgb3JpZ2luYXRpbmcgZnJvbSB0aGUgdGFyZ2V0c1xuICovXG5leHBvcnQgZW51bSBIdHRwQ29kZVRhcmdldCB7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIDJ4eCByZXNwb25zZSBjb2RlcyBmcm9tIHRhcmdldHNcbiAgICovXG4gIFRBUkdFVF8yWFhfQ09VTlQgPSAnSFRUUENvZGVfVGFyZ2V0XzJYWF9Db3VudCcsXG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgM3h4IHJlc3BvbnNlIGNvZGVzIGZyb20gdGFyZ2V0c1xuICAgKi9cbiAgVEFSR0VUXzNYWF9DT1VOVCA9ICdIVFRQQ29kZV9UYXJnZXRfM1hYX0NvdW50JyxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiA0eHggcmVzcG9uc2UgY29kZXMgZnJvbSB0YXJnZXRzXG4gICAqL1xuICBUQVJHRVRfNFhYX0NPVU5UID0gJ0hUVFBDb2RlX1RhcmdldF80WFhfQ291bnQnLFxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIDV4eCByZXNwb25zZSBjb2RlcyBmcm9tIHRhcmdldHNcbiAgICovXG4gIFRBUkdFVF81WFhfQ09VTlQgPSAnSFRUUENvZGVfVGFyZ2V0XzVYWF9Db3VudCdcbn1cblxuLyoqXG4gKiBDb250YWlucyBhbGwgbWV0cmljcyBmb3IgYW4gQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJNZXRyaWNzIHtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlclxuICAgKlxuICAgKiBAZGVmYXVsdCBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBjdXN0b20obWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGNvbmN1cnJlbnQgVENQIGNvbm5lY3Rpb25zIGFjdGl2ZSBmcm9tIGNsaWVudHMgdG8gdGhlXG4gICAqIGxvYWQgYmFsYW5jZXIgYW5kIGZyb20gdGhlIGxvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBhY3RpdmVDb25uZWN0aW9uQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBUTFMgY29ubmVjdGlvbnMgaW5pdGlhdGVkIGJ5IHRoZSBjbGllbnQgdGhhdCBkaWQgbm90XG4gICAqIGVzdGFibGlzaCBhIHNlc3Npb24gd2l0aCB0aGUgbG9hZCBiYWxhbmNlci4gUG9zc2libGUgY2F1c2VzIGluY2x1ZGUgYVxuICAgKiBtaXNtYXRjaCBvZiBjaXBoZXJzIG9yIHByb3RvY29scy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBjbGllbnRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBsb2FkIGJhbGFuY2VyIGNhcGFjaXR5IHVuaXRzIChMQ1UpIHVzZWQgYnkgeW91ciBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGNvbnN1bWVkTENVcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGZpeGVkLXJlc3BvbnNlIGFjdGlvbnMgdGhhdCB3ZXJlIHN1Y2Nlc3NmdWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgaHR0cEZpeGVkUmVzcG9uc2VDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHJlZGlyZWN0IGFjdGlvbnMgdGhhdCB3ZXJlIHN1Y2Nlc3NmdWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgaHR0cFJlZGlyZWN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWRpcmVjdCBhY3Rpb25zIHRoYXQgY291bGRuJ3QgYmUgY29tcGxldGVkIGJlY2F1c2UgdGhlIFVSTFxuICAgKiBpbiB0aGUgcmVzcG9uc2UgbG9jYXRpb24gaGVhZGVyIGlzIGxhcmdlciB0aGFuIDhLLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGh0dHBSZWRpcmVjdFVybExpbWl0RXhjZWVkZWRDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIEhUVFAgM3h4LzR4eC81eHggY29kZXMgdGhhdCBvcmlnaW5hdGUgZnJvbSB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogVGhpcyBkb2VzIG5vdCBpbmNsdWRlIGFueSByZXNwb25zZSBjb2RlcyBnZW5lcmF0ZWQgYnkgdGhlIHRhcmdldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgaHR0cENvZGVFbGIoY29kZTogSHR0cENvZGVFbGIsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgSFRUUCAyeHgvM3h4LzR4eC81eHggcmVzcG9uc2UgY29kZXMgZ2VuZXJhdGVkIGJ5IGFsbCB0YXJnZXRzXG4gICAqIGluIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBUaGlzIGRvZXMgbm90IGluY2x1ZGUgYW55IHJlc3BvbnNlIGNvZGVzIGdlbmVyYXRlZCBieSB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBodHRwQ29kZVRhcmdldChjb2RlOiBIdHRwQ29kZVRhcmdldCwgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyBwcm9jZXNzZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIgb3ZlciBJUHY2LlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIGlwdjZQcm9jZXNzZWRCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIElQdjYgcmVxdWVzdHMgcmVjZWl2ZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgaXB2NlJlcXVlc3RDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIG5ldyBUQ1AgY29ubmVjdGlvbnMgZXN0YWJsaXNoZWQgZnJvbSBjbGllbnRzIHRvIHRoZVxuICAgKiBsb2FkIGJhbGFuY2VyIGFuZCBmcm9tIHRoZSBsb2FkIGJhbGFuY2VyIHRvIHRhcmdldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbmV3Q29ubmVjdGlvbkNvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgYnl0ZXMgcHJvY2Vzc2VkIGJ5IHRoZSBsb2FkIGJhbGFuY2VyIG92ZXIgSVB2NCBhbmQgSVB2Ni5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwcm9jZXNzZWRCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNvbm5lY3Rpb25zIHRoYXQgd2VyZSByZWplY3RlZCBiZWNhdXNlIHRoZSBsb2FkIGJhbGFuY2VyIGhhZFxuICAgKiByZWFjaGVkIGl0cyBtYXhpbXVtIG51bWJlciBvZiBjb25uZWN0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICByZWplY3RlZENvbm5lY3Rpb25Db3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHJlcXVlc3RzIHByb2Nlc3NlZCBvdmVyIElQdjQgYW5kIElQdjYuXG4gICAqXG4gICAqIFRoaXMgY291bnQgaW5jbHVkZXMgb25seSB0aGUgcmVxdWVzdHMgd2l0aCBhIHJlc3BvbnNlIGdlbmVyYXRlZCBieSBhIHRhcmdldCBvZiB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICByZXF1ZXN0Q291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBydWxlcyBwcm9jZXNzZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIgZ2l2ZW4gYSByZXF1ZXN0IHJhdGUgYXZlcmFnZWQgb3ZlciBhbiBob3VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHJ1bGVFdmFsdWF0aW9ucyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNvbm5lY3Rpb25zIHRoYXQgd2VyZSBub3Qgc3VjY2Vzc2Z1bGx5IGVzdGFibGlzaGVkIGJldHdlZW4gdGhlIGxvYWQgYmFsYW5jZXIgYW5kIHRhcmdldC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICB0YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBlbGFwc2VkLCBpbiBzZWNvbmRzLCBhZnRlciB0aGUgcmVxdWVzdCBsZWF2ZXMgdGhlIGxvYWQgYmFsYW5jZXIgdW50aWwgYSByZXNwb25zZSBmcm9tIHRoZSB0YXJnZXQgaXMgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHRhcmdldFJlc3BvbnNlVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIFRMUyBjb25uZWN0aW9ucyBpbml0aWF0ZWQgYnkgdGhlIGxvYWQgYmFsYW5jZXIgdGhhdCBkaWQgbm90IGVzdGFibGlzaCBhIHNlc3Npb24gd2l0aCB0aGUgdGFyZ2V0LlxuICAgKlxuICAgKiBQb3NzaWJsZSBjYXVzZXMgaW5jbHVkZSBhIG1pc21hdGNoIG9mIGNpcGhlcnMgb3IgcHJvdG9jb2xzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHRhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHVzZXIgYXV0aGVudGljYXRpb25zIHRoYXQgY291bGQgbm90IGJlIGNvbXBsZXRlZFxuICAgKlxuICAgKiBCZWNhdXNlIGFuIGF1dGhlbnRpY2F0ZSBhY3Rpb24gd2FzIG1pc2NvbmZpZ3VyZWQsIHRoZSBsb2FkIGJhbGFuY2VyXG4gICAqIGNvdWxkbid0IGVzdGFibGlzaCBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgSWRQLCBvciB0aGUgbG9hZCBiYWxhbmNlclxuICAgKiBjb3VsZG4ndCBjb21wbGV0ZSB0aGUgYXV0aGVudGljYXRpb24gZmxvdyBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3IuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgZWxiQXV0aEVycm9yKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdXNlciBhdXRoZW50aWNhdGlvbnMgdGhhdCBjb3VsZCBub3QgYmUgY29tcGxldGVkIGJlY2F1c2UgdGhlXG4gICAqIElkUCBkZW5pZWQgYWNjZXNzIHRvIHRoZSB1c2VyIG9yIGFuIGF1dGhvcml6YXRpb24gY29kZSB3YXMgdXNlZCBtb3JlIHRoYW5cbiAgICogb25jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBlbGJBdXRoRmFpbHVyZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBlbGFwc2VkLCBpbiBtaWxsaXNlY29uZHMsIHRvIHF1ZXJ5IHRoZSBJZFAgZm9yIHRoZSBJRCB0b2tlbiBhbmQgdXNlciBpbmZvLlxuICAgKlxuICAgKiBJZiBvbmUgb3IgbW9yZSBvZiB0aGVzZSBvcGVyYXRpb25zIGZhaWwsIHRoaXMgaXMgdGhlIHRpbWUgdG8gZmFpbHVyZS5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgZWxiQXV0aExhdGVuY3kocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBhdXRoZW50aWNhdGUgYWN0aW9ucyB0aGF0IHdlcmUgc3VjY2Vzc2Z1bC5cbiAgICpcbiAgICogVGhpcyBtZXRyaWMgaXMgaW5jcmVtZW50ZWQgYXQgdGhlIGVuZCBvZiB0aGUgYXV0aGVudGljYXRpb24gd29ya2Zsb3csXG4gICAqIGFmdGVyIHRoZSBsb2FkIGJhbGFuY2VyIGhhcyByZXRyaWV2ZWQgdGhlIHVzZXIgY2xhaW1zIGZyb20gdGhlIElkUC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBlbGJBdXRoU3VjY2Vzcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xufVxuXG4vKipcbiAqIEFuIGFwcGxpY2F0aW9uIGxvYWQgYmFsYW5jZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIgZXh0ZW5kcyBJTG9hZEJhbGFuY2VyVjIsIGVjMi5JQ29ubmVjdGFibGUge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHRoaXMgbG9hZCBiYWxhbmNlciBoYXMgYmVlbiBjcmVhdGVkIGluIChpZiBhdmFpbGFibGUpLlxuICAgKiBJZiB0aGlzIGludGVyZmFjZSBpcyB0aGUgcmVzdWx0IG9mIGFuIGltcG9ydCBjYWxsIHRvIGZyb21BcHBsaWNhdGlvbkxvYWRCYWxhbmNlckF0dHJpYnV0ZXMsXG4gICAqIHRoZSB2cGMgYXR0cmlidXRlIHdpbGwgYmUgdW5kZWZpbmVkIHVubGVzcyBzcGVjaWZpZWQgaW4gdGhlIG9wdGlvbmFsIHByb3BlcnRpZXMgb2YgdGhhdCBtZXRob2QuXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcblxuICAvKipcbiAgICogVGhlIElQIEFkZHJlc3MgVHlwZSBmb3IgdGhpcyBsb2FkIGJhbGFuY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IElwQWRkcmVzc1R5cGUuSVBWNFxuICAgKi9cbiAgcmVhZG9ubHkgaXBBZGRyZXNzVHlwZT86IElwQWRkcmVzc1R5cGU7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqIFRoaXMgbGlzdCBpcyBvbmx5IHZhbGlkIGZvciBvd25lZCBjb25zdHJ1Y3RzLlxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJzOiBBcHBsaWNhdGlvbkxpc3RlbmVyW107XG5cbiAgLyoqXG4gICAqIEFsbCBtZXRyaWNzIGF2YWlsYWJsZSBmb3IgdGhpcyBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNzOiBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJNZXRyaWNzO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgbGlzdGVuZXIgdG8gdGhpcyBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICBhZGRMaXN0ZW5lcihpZDogc3RyaW5nLCBwcm9wczogQmFzZUFwcGxpY2F0aW9uTGlzdGVuZXJQcm9wcyk6IEFwcGxpY2F0aW9uTGlzdGVuZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byByZWZlcmVuY2UgYW4gZXhpc3RpbmcgbG9hZCBiYWxhbmNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIGxvYWQgYmFsYW5jZXJcbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGUgbG9hZCBiYWxhbmNlcidzIHNlY3VyaXR5IGdyb3VwXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNhbm9uaWNhbCBob3N0ZWQgem9uZSBJRCBvZiB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBXaGVuIG5vdCBwcm92aWRlZCwgTEIgY2Fubm90IGJlIHVzZWQgYXMgUm91dGU1MyBBbGlhcyB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBsb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBETlMgbmFtZSBvZiB0aGlzIGxvYWQgYmFsYW5jZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBXaGVuIG5vdCBwcm92aWRlZCwgTEIgY2Fubm90IGJlIHVzZWQgYXMgUm91dGU1MyBBbGlhcyB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBsb2FkQmFsYW5jZXJEbnNOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzZWN1cml0eSBncm91cCBhbGxvd3MgYWxsIG91dGJvdW5kIHRyYWZmaWMgb3Igbm90XG4gICAqXG4gICAqIFVubGVzcyBzZXQgdG8gYGZhbHNlYCwgbm8gZWdyZXNzIHJ1bGVzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHNlY3VyaXR5IGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwQWxsb3dzQWxsT3V0Ym91bmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHRoaXMgbG9hZCBiYWxhbmNlciBoYXMgYmVlbiBjcmVhdGVkIGluLCBpZiBhdmFpbGFibGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiB0aGUgTG9hZCBCYWxhbmNlciB3YXMgaW1wb3J0ZWQgYW5kIGEgVlBDIHdhcyBub3Qgc3BlY2lmaWVkLFxuICAgKiB0aGUgVlBDIGlzIG5vdCBhdmFpbGFibGUuXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcblxufVxuXG4vKipcbiAqIEFuIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIHRoYXQgaGFzIGJlZW4gZGVmaW5lZCBlbHNld2hlcmVcbiAqL1xuY2xhc3MgSW1wb3J0ZWRBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIHtcbiAgLyoqXG4gICAqIE1hbmFnZSBjb25uZWN0aW9ucyBmb3IgdGhpcyBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucztcblxuICAvKipcbiAgICogQVJOIG9mIHRoZSBsb2FkIGJhbGFuY2VyXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9hZEJhbGFuY2VyQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIGdldCBsaXN0ZW5lcnMoKTogQXBwbGljYXRpb25MaXN0ZW5lcltdIHtcbiAgICB0aHJvdyBFcnJvcignLmxpc3RlbmVycyBjYW4gb25seSBiZSBhY2Nlc3NlZCBpZiB0aGUgY2xhc3Mgd2FzIGNvbnN0cnVjdGVkIGFzIGFuIG93bmVkLCBub3QgaW1wb3J0ZWQsIGxvYWQgYmFsYW5jZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWUEMgb2YgdGhlIGxvYWQgYmFsYW5jZXJcbiAgICpcbiAgICogVW5kZWZpbmVkIGlmIG9wdGlvbmFsIHZwYyBpcyBub3Qgc3BlY2lmaWVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuICBwdWJsaWMgcmVhZG9ubHkgbWV0cmljczogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyTWV0cmljcztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlckF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGVudmlyb25tZW50RnJvbUFybjogcHJvcHMubG9hZEJhbGFuY2VyQXJuLFxuICAgIH0pO1xuXG4gICAgdGhpcy52cGMgPSBwcm9wcy52cGM7XG4gICAgdGhpcy5sb2FkQmFsYW5jZXJBcm4gPSBwcm9wcy5sb2FkQmFsYW5jZXJBcm47XG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgICAgc2VjdXJpdHlHcm91cHM6IFtlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsICdTZWN1cml0eUdyb3VwJywgcHJvcHMuc2VjdXJpdHlHcm91cElkLCB7XG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHByb3BzLnNlY3VyaXR5R3JvdXBBbGxvd3NBbGxPdXRib3VuZCxcbiAgICAgIH0pXSxcbiAgICB9KTtcbiAgICB0aGlzLm1ldHJpY3MgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJNZXRyaWNzKHRoaXMsIHBhcnNlTG9hZEJhbGFuY2VyRnVsbE5hbWUocHJvcHMubG9hZEJhbGFuY2VyQXJuKSk7XG4gIH1cblxuICBwdWJsaWMgYWRkTGlzdGVuZXIoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2VBcHBsaWNhdGlvbkxpc3RlbmVyUHJvcHMpOiBBcHBsaWNhdGlvbkxpc3RlbmVyIHtcbiAgICByZXR1cm4gbmV3IEFwcGxpY2F0aW9uTGlzdGVuZXIodGhpcywgaWQsIHtcbiAgICAgIGxvYWRCYWxhbmNlcjogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCBsb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5wcm9wcy5sb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQpIHsgcmV0dXJuIHRoaXMucHJvcHMubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkOyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYCdsb2FkQmFsYW5jZXJDYW5vbmljYWxIb3N0ZWRab25lSWQnIHdhcyBub3QgcHJvdmlkZWQgd2hlbiBjb25zdHJ1Y3RpbmcgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciAke3RoaXMubm9kZS5wYXRofSBmcm9tIGF0dHJpYnV0ZXNgKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbG9hZEJhbGFuY2VyRG5zTmFtZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnByb3BzLmxvYWRCYWxhbmNlckRuc05hbWUpIHsgcmV0dXJuIHRoaXMucHJvcHMubG9hZEJhbGFuY2VyRG5zTmFtZTsgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgdGhyb3cgbmV3IEVycm9yKGAnbG9hZEJhbGFuY2VyRG5zTmFtZScgd2FzIG5vdCBwcm92aWRlZCB3aGVuIGNvbnN0cnVjdGluZyBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyICR7dGhpcy5ub2RlLnBhdGh9IGZyb20gYXR0cmlidXRlc2ApO1xuICB9XG59XG5cbmNsYXNzIExvb2tlZFVwQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciB7XG4gIHB1YmxpYyByZWFkb25seSBsb2FkQmFsYW5jZXJBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgbG9hZEJhbGFuY2VyRG5zTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgaXBBZGRyZXNzVHlwZT86IElwQWRkcmVzc1R5cGU7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zO1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG4gIHB1YmxpYyByZWFkb25seSBtZXRyaWNzOiBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJNZXRyaWNzO1xuXG4gIHB1YmxpYyBnZXQgbGlzdGVuZXJzKCk6IEFwcGxpY2F0aW9uTGlzdGVuZXJbXSB7XG4gICAgdGhyb3cgRXJyb3IoJy5saXN0ZW5lcnMgY2FuIG9ubHkgYmUgYWNjZXNzZWQgaWYgdGhlIGNsYXNzIHdhcyBjb25zdHJ1Y3RlZCBhcyBhbiBvd25lZCwgbm90IGxvb2tlZCB1cCwgbG9hZCBiYWxhbmNlcicpO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGN4YXBpLkxvYWRCYWxhbmNlckNvbnRleHRSZXNwb25zZSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBwcm9wcy5sb2FkQmFsYW5jZXJBcm4sXG4gICAgfSk7XG5cbiAgICB0aGlzLmxvYWRCYWxhbmNlckFybiA9IHByb3BzLmxvYWRCYWxhbmNlckFybjtcbiAgICB0aGlzLmxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZCA9IHByb3BzLmxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZDtcbiAgICB0aGlzLmxvYWRCYWxhbmNlckRuc05hbWUgPSBwcm9wcy5sb2FkQmFsYW5jZXJEbnNOYW1lO1xuXG4gICAgaWYgKHByb3BzLmlwQWRkcmVzc1R5cGUgPT09IGN4YXBpLkxvYWRCYWxhbmNlcklwQWRkcmVzc1R5cGUuSVBWNCkge1xuICAgICAgdGhpcy5pcEFkZHJlc3NUeXBlID0gSXBBZGRyZXNzVHlwZS5JUFY0O1xuICAgIH0gZWxzZSBpZiAocHJvcHMuaXBBZGRyZXNzVHlwZSA9PT0gY3hhcGkuTG9hZEJhbGFuY2VySXBBZGRyZXNzVHlwZS5EVUFMX1NUQUNLKSB7XG4gICAgICB0aGlzLmlwQWRkcmVzc1R5cGUgPSBJcEFkZHJlc3NUeXBlLkRVQUxfU1RBQ0s7XG4gICAgfVxuXG4gICAgdGhpcy52cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgJ1ZwYycsIHtcbiAgICAgIHZwY0lkOiBwcm9wcy52cGNJZCxcbiAgICB9KTtcblxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgZWMyLkNvbm5lY3Rpb25zKCk7XG4gICAgZm9yIChjb25zdCBzZWN1cml0eUdyb3VwSWQgb2YgcHJvcHMuc2VjdXJpdHlHcm91cElkcykge1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21Mb29rdXBCeUlkKHRoaXMsIGBTZWN1cml0eUdyb3VwLSR7c2VjdXJpdHlHcm91cElkfWAsIHNlY3VyaXR5R3JvdXBJZCk7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAoc2VjdXJpdHlHcm91cCk7XG4gICAgfVxuICAgIHRoaXMubWV0cmljcyA9IG5ldyBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlck1ldHJpY3ModGhpcywgcGFyc2VMb2FkQmFsYW5jZXJGdWxsTmFtZSh0aGlzLmxvYWRCYWxhbmNlckFybikpO1xuICB9XG5cbiAgcHVibGljIGFkZExpc3RlbmVyKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNlQXBwbGljYXRpb25MaXN0ZW5lclByb3BzKTogQXBwbGljYXRpb25MaXN0ZW5lciB7XG4gICAgcmV0dXJuIG5ldyBBcHBsaWNhdGlvbkxpc3RlbmVyKHRoaXMsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGxvYWRCYWxhbmNlcjogdGhpcyxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgcmVkaXJlY3Rpb24gY29uZmlnXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJSZWRpcmVjdENvbmZpZyB7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCBvZiB0aGUgbGlzdGVuZXIgYmVpbmcgY3JlYXRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBIVFRQXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VQcm90b2NvbD86IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IG51bWJlciB0byBsaXN0ZW4gdG9cbiAgICpcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZVBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCBvZiB0aGUgcmVkaXJlY3Rpb24gdGFyZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IEhUVFBTXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRQcm90b2NvbD86IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IG51bWJlciB0byByZWRpcmVjdCB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCA0NDNcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldFBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFsbG93IGFueW9uZSB0byBjb25uZWN0IHRvIHRoaXMgbGlzdGVuZXJcbiAgICpcbiAgICogSWYgdGhpcyBpcyBzcGVjaWZpZWQsIHRoZSBsaXN0ZW5lciB3aWxsIGJlIG9wZW5lZCB1cCB0byBhbnlvbmUgd2hvIGNhbiByZWFjaCBpdC5cbiAgICogRm9yIGludGVybmFsIGxvYWQgYmFsYW5jZXJzIHRoaXMgaXMgYW55b25lIGluIHRoZSBzYW1lIFZQQy4gRm9yIHB1YmxpYyBsb2FkXG4gICAqIGJhbGFuY2VycywgdGhpcyBpcyBhbnlvbmUgb24gdGhlIGludGVybmV0LlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBiZSBtb3JlIHNlbGVjdGl2ZSBhYm91dCB3aG8gY2FuIGFjY2VzcyB0aGlzIGxvYWRcbiAgICogYmFsYW5jZXIsIHNldCB0aGlzIHRvIGBmYWxzZWAgYW5kIHVzZSB0aGUgbGlzdGVuZXIncyBgY29ubmVjdGlvbnNgXG4gICAqIG9iamVjdCB0byBzZWxlY3RpdmVseSBncmFudCBhY2Nlc3MgdG8gdGhlIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBvcGVuPzogYm9vbGVhbjtcblxufVxuIl19