"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationListener = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const application_listener_action_1 = require("./application-listener-action");
const application_listener_certificate_1 = require("./application-listener-certificate");
const application_listener_rule_1 = require("./application-listener-rule");
const application_target_group_1 = require("./application-target-group");
const base_listener_1 = require("../shared/base-listener");
const enums_1 = require("../shared/enums");
const listener_certificate_1 = require("../shared/listener-certificate");
const util_1 = require("../shared/util");
/**
 * Define an ApplicationListener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
class ApplicationListener extends base_listener_1.BaseListener {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApplicationListener);
            }
            throw error;
        }
        const [protocol, port] = util_1.determineProtocolAndPort(props.protocol, props.port);
        if (protocol === undefined || port === undefined) {
            throw new Error('At least one of \'port\' or \'protocol\' is required');
        }
        super(scope, id, {
            loadBalancerArn: props.loadBalancer.loadBalancerArn,
            certificates: core_1.Lazy.any({ produce: () => this.certificateArns.map(certificateArn => ({ certificateArn })) }, { omitEmptyArray: true }),
            protocol,
            port,
            sslPolicy: props.sslPolicy,
        });
        this.loadBalancer = props.loadBalancer;
        this.protocol = protocol;
        this.certificateArns = [];
        // Attach certificates
        if (props.certificateArns && props.certificateArns.length > 0) {
            this.addCertificateArns('ListenerCertificate', props.certificateArns);
        }
        if (props.certificates && props.certificates.length > 0) {
            this.addCertificates('DefaultCertificates', props.certificates);
        }
        // This listener edits the securitygroup of the load balancer,
        // but adds its own default port.
        this.connections = new ec2.Connections({
            securityGroups: props.loadBalancer.connections.securityGroups,
            defaultPort: ec2.Port.tcp(port),
        });
        if (props.defaultAction && props.defaultTargetGroups) {
            throw new Error('Specify at most one of \'defaultAction\' and \'defaultTargetGroups\'');
        }
        if (props.defaultAction) {
            this.setDefaultAction(props.defaultAction);
        }
        if (props.defaultTargetGroups) {
            this.setDefaultAction(application_listener_action_1.ListenerAction.forward(props.defaultTargetGroups));
        }
        if (props.open !== false) {
            this.connections.allowDefaultPortFrom(ec2.Peer.anyIpv4(), `Allow from anyone on port ${port}`);
            if (this.loadBalancer.ipAddressType === enums_1.IpAddressType.DUAL_STACK) {
                this.connections.allowDefaultPortFrom(ec2.Peer.anyIpv6(), `Allow from anyone on port ${port}`);
            }
        }
    }
    /**
     * Look up an ApplicationListener.
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationListenerLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        if (core_1.Token.isUnresolved(options.listenerArn)) {
            throw new Error('All arguments to look up a load balancer listener must be concrete (no Tokens)');
        }
        let listenerProtocol;
        switch (options.listenerProtocol) {
            case enums_1.ApplicationProtocol.HTTP:
                listenerProtocol = cxschema.LoadBalancerListenerProtocol.HTTP;
                break;
            case enums_1.ApplicationProtocol.HTTPS:
                listenerProtocol = cxschema.LoadBalancerListenerProtocol.HTTPS;
                break;
        }
        const props = base_listener_1.BaseListener._queryContextProvider(scope, {
            userOptions: options,
            loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
            listenerArn: options.listenerArn,
            listenerProtocol,
        });
        return new LookedUpApplicationListener(scope, id, props);
    }
    /**
     * Import an existing listener
     */
    static fromApplicationListenerAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationListenerAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromApplicationListenerAttributes);
            }
            throw error;
        }
        return new ImportedApplicationListener(scope, id, attrs);
    }
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates ApplicationListenerCertificates
     * resources since cloudformation requires the certificates array on the
     * listener resource to have a length of 1.
     *
     * @deprecated Use `addCertificates` instead.
     */
    addCertificateArns(id, arns) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListener#addCertificateArns", "Use `addCertificates` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCertificateArns);
            }
            throw error;
        }
        this.addCertificates(id, arns.map(listener_certificate_1.ListenerCertificate.fromArn));
    }
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates ApplicationListenerCertificates
     * resources since cloudformation requires the certificates array on the
     * listener resource to have a length of 1.
     */
    addCertificates(id, certificates) {
        const additionalCerts = [...certificates];
        if (this.certificateArns.length === 0 && additionalCerts.length > 0) {
            const first = additionalCerts.splice(0, 1)[0];
            this.certificateArns.push(first.certificateArn);
        }
        // Only one certificate can be specified per resource, even though
        // `certificates` is of type Array
        for (let i = 0; i < additionalCerts.length; i++) {
            new application_listener_certificate_1.ApplicationListenerCertificate(this, `${id}${i + 1}`, {
                listener: this,
                certificates: [additionalCerts[i]],
            });
        }
    }
    /**
     * Perform the given default action on incoming requests
     *
     * This allows full control of the default action of the load balancer,
     * including Action chaining, fixed responses and redirect responses. See
     * the `ListenerAction` class for all options.
     *
     * It's possible to add routing conditions to the Action added in this way.
     * At least one Action must be added without conditions (which becomes the
     * default Action).
     */
    addAction(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddApplicationActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAction);
            }
            throw error;
        }
        checkAddRuleProps(props);
        if (props.priority !== undefined) {
            // New rule
            //
            // TargetGroup.registerListener is called inside ApplicationListenerRule.
            new application_listener_rule_1.ApplicationListenerRule(this, id + 'Rule', {
                listener: this,
                priority: props.priority,
                ...props,
            });
        }
        else {
            // New default target with these targetgroups
            this.setDefaultAction(props.action);
        }
    }
    /**
     * Load balance incoming requests to the given target groups.
     *
     * All target groups will be load balanced to with equal weight and without
     * stickiness. For a more complex configuration than that, use `addAction()`.
     *
     * It's possible to add routing conditions to the TargetGroups added in this
     * way. At least one TargetGroup must be added without conditions (which will
     * become the default Action for this listener).
     */
    addTargetGroups(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddApplicationTargetGroupsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargetGroups);
            }
            throw error;
        }
        checkAddRuleProps(props);
        if (props.priority !== undefined) {
            // New rule
            //
            // TargetGroup.registerListener is called inside ApplicationListenerRule.
            new application_listener_rule_1.ApplicationListenerRule(this, id + 'Rule', {
                listener: this,
                priority: props.priority,
                ...props,
            });
        }
        else {
            // New default target with these targetgroups
            this.setDefaultAction(application_listener_action_1.ListenerAction.forward(props.targetGroups));
        }
    }
    /**
     * Load balance incoming requests to the given load balancing targets.
     *
     * This method implicitly creates an ApplicationTargetGroup for the targets
     * involved, and a 'forward' action to route traffic to the given TargetGroup.
     *
     * If you want more control over the precise setup, create the TargetGroup
     * and use `addAction` yourself.
     *
     * It's possible to add conditions to the targets added in this way. At least
     * one set of targets must be added without conditions.
     *
     * @returns The newly created target group
     */
    addTargets(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddApplicationTargetsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargets);
            }
            throw error;
        }
        if (!this.loadBalancer.vpc) {
            // eslint-disable-next-line max-len
            throw new Error('Can only call addTargets() when using a constructed Load Balancer or an imported Load Balancer with specified vpc; construct a new TargetGroup and use addTargetGroup');
        }
        const group = new application_target_group_1.ApplicationTargetGroup(this, id + 'Group', {
            vpc: this.loadBalancer.vpc,
            ...props,
        });
        this.addTargetGroups(id, {
            targetGroups: [group],
            ...props,
        });
        return group;
    }
    /**
     * Add a fixed response
     *
     * @deprecated Use `addAction()` instead
     */
    addFixedResponse(id, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListener#addFixedResponse", "Use `addAction()` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddFixedResponseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFixedResponse);
            }
            throw error;
        }
        checkAddRuleProps(props);
        const fixedResponse = {
            statusCode: props.statusCode,
            contentType: props.contentType,
            messageBody: props.messageBody,
        };
        /**
         * NOTE - Copy/pasted from `application-listener-rule.ts#validateFixedResponse`.
         * This was previously a deprecated, exported function, which caused issues with jsii's strip-deprecated functionality.
         * Inlining the duplication functionality in v2 only (for now).
         */
        if (fixedResponse.statusCode && !/^(2|4|5)\d\d$/.test(fixedResponse.statusCode)) {
            throw new Error('`statusCode` must be 2XX, 4XX or 5XX.');
        }
        if (fixedResponse.messageBody && fixedResponse.messageBody.length > 1024) {
            throw new Error('`messageBody` cannot have more than 1024 characters.');
        }
        if (props.priority) {
            new application_listener_rule_1.ApplicationListenerRule(this, id + 'Rule', {
                listener: this,
                priority: props.priority,
                fixedResponse,
                ...props,
            });
        }
        else {
            this.setDefaultAction(application_listener_action_1.ListenerAction.fixedResponse(core_1.Token.asNumber(props.statusCode), {
                contentType: props.contentType,
                messageBody: props.messageBody,
            }));
        }
    }
    /**
     * Add a redirect response
     *
     * @deprecated Use `addAction()` instead
     */
    addRedirectResponse(id, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListener#addRedirectResponse", "Use `addAction()` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddRedirectResponseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRedirectResponse);
            }
            throw error;
        }
        checkAddRuleProps(props);
        const redirectResponse = {
            host: props.host,
            path: props.path,
            port: props.port,
            protocol: props.protocol,
            query: props.query,
            statusCode: props.statusCode,
        };
        /**
         * NOTE - Copy/pasted from `application-listener-rule.ts#validateRedirectResponse`.
         * This was previously a deprecated, exported function, which caused issues with jsii's strip-deprecated functionality.
         * Inlining the duplication functionality in v2 only (for now).
         */
        if (redirectResponse.protocol && !/^(HTTPS?|#\{protocol\})$/i.test(redirectResponse.protocol)) {
            throw new Error('`protocol` must be HTTP, HTTPS, or #{protocol}.');
        }
        if (!redirectResponse.statusCode || !/^HTTP_30[12]$/.test(redirectResponse.statusCode)) {
            throw new Error('`statusCode` must be HTTP_301 or HTTP_302.');
        }
        if (props.priority) {
            new application_listener_rule_1.ApplicationListenerRule(this, id + 'Rule', {
                listener: this,
                priority: props.priority,
                redirectResponse,
                ...props,
            });
        }
        else {
            this.setDefaultAction(application_listener_action_1.ListenerAction.redirect({
                host: props.host,
                path: props.path,
                port: props.port,
                protocol: props.protocol,
                query: props.query,
                permanent: props.statusCode === 'HTTP_301',
            }));
        }
    }
    /**
     * Register that a connectable that has been added to this load balancer.
     *
     * Don't call this directly. It is called by ApplicationTargetGroup.
     */
    registerConnectable(connectable, portRange) {
        connectable.connections.allowFrom(this.loadBalancer, portRange, 'Load balancer to target');
    }
    /**
     * Validate this listener.
     */
    validateListener() {
        const errors = super.validateListener();
        if (this.protocol === enums_1.ApplicationProtocol.HTTPS && this.certificateArns.length === 0) {
            errors.push('HTTPS Listener needs at least one certificate (call addCertificates)');
        }
        return errors;
    }
    /**
     * Wrapper for _setDefaultAction which does a type-safe bind
     */
    setDefaultAction(action) {
        action.bind(this, this);
        this._setDefaultAction(action);
    }
}
exports.ApplicationListener = ApplicationListener;
_a = JSII_RTTI_SYMBOL_1;
ApplicationListener[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ApplicationListener", version: "0.0.0" };
class ExternalApplicationListener extends core_1.Resource {
    constructor(scope, id) {
        super(scope, id);
    }
    /**
     * Register that a connectable that has been added to this load balancer.
     *
     * Don't call this directly. It is called by ApplicationTargetGroup.
     */
    registerConnectable(connectable, portRange) {
        this.connections.allowTo(connectable, portRange, 'Load balancer to target');
    }
    /**
     * Add one or more certificates to this listener.
     * @deprecated use `addCertificates()`
     */
    addCertificateArns(id, arns) {
        this.addCertificates(id, arns.map(listener_certificate_1.ListenerCertificate.fromArn));
    }
    /**
     * Add one or more certificates to this listener.
     */
    addCertificates(id, certificates) {
        new application_listener_certificate_1.ApplicationListenerCertificate(this, id, {
            listener: this,
            certificates,
        });
    }
    /**
     * Load balance incoming requests to the given target groups.
     *
     * It's possible to add conditions to the TargetGroups added in this way.
     * At least one TargetGroup must be added without conditions.
     */
    addTargetGroups(id, props) {
        checkAddRuleProps(props);
        if (props.priority !== undefined) {
            // New rule
            new application_listener_rule_1.ApplicationListenerRule(this, id, {
                listener: this,
                priority: props.priority,
                ...props,
            });
        }
        else {
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
    addTargets(_id, _props) {
        // eslint-disable-next-line max-len
        throw new Error('Can only call addTargets() when using a constructed ApplicationListener; construct a new TargetGroup and use addTargetGroup.');
    }
    /**
     * Perform the given action on incoming requests
     *
     * This allows full control of the default action of the load balancer,
     * including Action chaining, fixed responses and redirect responses. See
     * the `ListenerAction` class for all options.
     *
     * It's possible to add routing conditions to the Action added in this way.
     *
     * It is not possible to add a default action to an imported IApplicationListener.
     * In order to add actions to an imported IApplicationListener a `priority`
     * must be provided.
     */
    addAction(id, props) {
        checkAddRuleProps(props);
        if (props.priority !== undefined) {
            // New rule
            //
            // TargetGroup.registerListener is called inside ApplicationListenerRule.
            new application_listener_rule_1.ApplicationListenerRule(this, id + 'Rule', {
                listener: this,
                priority: props.priority,
                ...props,
            });
        }
        else {
            throw new Error('priority must be set for actions added to an imported listener');
        }
    }
}
/**
 * An imported application listener.
 */
class ImportedApplicationListener extends ExternalApplicationListener {
    constructor(scope, id, props) {
        super(scope, id);
        this.listenerArn = props.listenerArn;
        const defaultPort = props.defaultPort !== undefined ? ec2.Port.tcp(props.defaultPort) : undefined;
        this.connections = new ec2.Connections({
            securityGroups: [props.securityGroup],
            defaultPort,
        });
    }
}
class LookedUpApplicationListener extends ExternalApplicationListener {
    constructor(scope, id, props) {
        super(scope, id);
        this.listenerArn = props.listenerArn;
        this.connections = new ec2.Connections({
            defaultPort: ec2.Port.tcp(props.listenerPort),
        });
        for (const securityGroupId of props.securityGroupIds) {
            const securityGroup = ec2.SecurityGroup.fromLookupById(this, `SecurityGroup-${securityGroupId}`, securityGroupId);
            this.connections.addSecurityGroup(securityGroup);
        }
    }
}
function checkAddRuleProps(props) {
    const conditionsCount = props.conditions?.length || 0;
    const hasAnyConditions = conditionsCount !== 0 ||
        props.hostHeader !== undefined || props.pathPattern !== undefined || props.pathPatterns !== undefined;
    const hasPriority = props.priority !== undefined;
    if (hasAnyConditions !== hasPriority) {
        throw new Error('Setting \'conditions\', \'pathPattern\' or \'hostHeader\' also requires \'priority\', and vice versa');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi1saXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsMkRBQTJEO0FBQzNELHdDQUFnRTtBQUdoRSwrRUFBK0Q7QUFDL0QseUZBQW9GO0FBQ3BGLDJFQUF1RztBQUV2Ryx5RUFBNkg7QUFFN0gsMkRBQTZGO0FBRTdGLDJDQUFtSjtBQUNuSix5RUFBMkY7QUFDM0YseUNBQTBEO0FBZ0gxRDs7OztHQUlHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSw0QkFBWTtJQW9EbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjs7Ozs7OytDQXBEOUQsbUJBQW1COzs7O1FBcUQ1QixNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLCtCQUF3QixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlFLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUN6RTtRQUVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsZUFBZSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsZUFBZTtZQUNuRCxZQUFZLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUNySSxRQUFRO1lBQ1IsSUFBSTtZQUNKLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztTQUMzQixDQUFDLENB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QUssV0FBVyxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0dBQXNHLENBQUMsQ0FBQztLQUN6SDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgRHVyYXRpb24sIExhenksIFJlc291cmNlLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTGlzdGVuZXJBY3Rpb24gfSBmcm9tICcuL2FwcGxpY2F0aW9uLWxpc3RlbmVyLWFjdGlvbic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkxpc3RlbmVyQ2VydGlmaWNhdGUgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWxpc3RlbmVyLWNlcnRpZmljYXRlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlLCBGaXhlZFJlc3BvbnNlLCBSZWRpcmVjdFJlc3BvbnNlIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1saXN0ZW5lci1ydWxlJztcbmltcG9ydCB7IElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciB9IGZyb20gJy4vYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvblRhcmdldEdyb3VwLCBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXQsIElBcHBsaWNhdGlvblRhcmdldEdyb3VwIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi10YXJnZXQtZ3JvdXAnO1xuaW1wb3J0IHsgTGlzdGVuZXJDb25kaXRpb24gfSBmcm9tICcuL2NvbmRpdGlvbnMnO1xuaW1wb3J0IHsgQmFzZUxpc3RlbmVyLCBCYXNlTGlzdGVuZXJMb29rdXBPcHRpb25zLCBJTGlzdGVuZXIgfSBmcm9tICcuLi9zaGFyZWQvYmFzZS1saXN0ZW5lcic7XG5pbXBvcnQgeyBIZWFsdGhDaGVjayB9IGZyb20gJy4uL3NoYXJlZC9iYXNlLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvblByb3RvY29sLCBBcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbiwgVGFyZ2V0R3JvdXBMb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZSwgSXBBZGRyZXNzVHlwZSwgU3NsUG9saWN5IH0gZnJvbSAnLi4vc2hhcmVkL2VudW1zJztcbmltcG9ydCB7IElMaXN0ZW5lckNlcnRpZmljYXRlLCBMaXN0ZW5lckNlcnRpZmljYXRlIH0gZnJvbSAnLi4vc2hhcmVkL2xpc3RlbmVyLWNlcnRpZmljYXRlJztcbmltcG9ydCB7IGRldGVybWluZVByb3RvY29sQW5kUG9ydCB9IGZyb20gJy4uL3NoYXJlZC91dGlsJztcblxuLyoqXG4gKiBCYXNpYyBwcm9wZXJ0aWVzIGZvciBhbiBBcHBsaWNhdGlvbkxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZUFwcGxpY2F0aW9uTGlzdGVuZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcHJvdG9jb2wgdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGV0ZXJtaW5lZCBmcm9tIHBvcnQgaWYga25vd24uXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IG9uIHdoaWNoIHRoZSBsaXN0ZW5lciBsaXN0ZW5zIGZvciByZXF1ZXN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZXRlcm1pbmVkIGZyb20gcHJvdG9jb2wgaWYga25vd24uXG4gICAqL1xuICByZWFkb25seSBwb3J0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGVzIHRvIHVzZSBvbiB0aGlzIGxpc3RlbmVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY2VydGlmaWNhdGVzLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBjZXJ0aWZpY2F0ZXNgIHByb3BlcnR5IGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlQXJucz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDZXJ0aWZpY2F0ZSBsaXN0IG9mIEFDTSBjZXJ0IEFSTnMuIFlvdSBtdXN0IHByb3ZpZGUgZXhhY3RseSBvbmUgY2VydGlmaWNhdGUgaWYgdGhlIGxpc3RlbmVyIHByb3RvY29sIGlzIEhUVFBTIG9yIFRMUy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjZXJ0aWZpY2F0ZXMuXG4gICAqL1xuICByZWFkb25seSBjZXJ0aWZpY2F0ZXM/OiBJTGlzdGVuZXJDZXJ0aWZpY2F0ZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgcG9saWN5IHRoYXQgZGVmaW5lcyB3aGljaCBjaXBoZXJzIGFuZCBwcm90b2NvbHMgYXJlIHN1cHBvcnRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgY3VycmVudCBwcmVkZWZpbmVkIHNlY3VyaXR5IHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IHNzbFBvbGljeT86IFNzbFBvbGljeTtcblxuICAvKipcbiAgICogRGVmYXVsdCB0YXJnZXQgZ3JvdXBzIHRvIGxvYWQgYmFsYW5jZSB0b1xuICAgKlxuICAgKiBBbGwgdGFyZ2V0IGdyb3VwcyB3aWxsIGJlIGxvYWQgYmFsYW5jZWQgdG8gd2l0aCBlcXVhbCB3ZWlnaHQgYW5kIHdpdGhvdXRcbiAgICogc3RpY2tpbmVzcy4gRm9yIGEgbW9yZSBjb21wbGV4IGNvbmZpZ3VyYXRpb24gdGhhbiB0aGF0LCB1c2VcbiAgICogZWl0aGVyIGBkZWZhdWx0QWN0aW9uYCBvciBgYWRkQWN0aW9uKClgLlxuICAgKlxuICAgKiBDYW5ub3QgYmUgc3BlY2lmaWVkIHRvZ2V0aGVyIHdpdGggYGRlZmF1bHRBY3Rpb25gLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0VGFyZ2V0R3JvdXBzPzogSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXBbXTtcblxuICAvKipcbiAgICogRGVmYXVsdCBhY3Rpb24gdG8gdGFrZSBmb3IgcmVxdWVzdHMgdG8gdGhpcyBsaXN0ZW5lclxuICAgKlxuICAgKiBUaGlzIGFsbG93cyBmdWxsIGNvbnRyb2wgb2YgdGhlIGRlZmF1bHQgYWN0aW9uIG9mIHRoZSBsb2FkIGJhbGFuY2VyLFxuICAgKiBpbmNsdWRpbmcgQWN0aW9uIGNoYWluaW5nLCBmaXhlZCByZXNwb25zZXMgYW5kIHJlZGlyZWN0IHJlc3BvbnNlcy5cbiAgICpcbiAgICogU2VlIHRoZSBgTGlzdGVuZXJBY3Rpb25gIGNsYXNzIGZvciBhbGwgb3B0aW9ucy5cbiAgICpcbiAgICogQ2Fubm90IGJlIHNwZWNpZmllZCB0b2dldGhlciB3aXRoIGBkZWZhdWx0VGFyZ2V0R3JvdXBzYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdEFjdGlvbj86IExpc3RlbmVyQWN0aW9uO1xuXG4gIC8qKlxuICAgKiBBbGxvdyBhbnlvbmUgdG8gY29ubmVjdCB0byB0aGUgbG9hZCBiYWxhbmNlciBvbiB0aGUgbGlzdGVuZXIgcG9ydFxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNwZWNpZmllZCwgdGhlIGxvYWQgYmFsYW5jZXIgd2lsbCBiZSBvcGVuZWQgdXAgdG8gYW55b25lIHdobyBjYW4gcmVhY2ggaXQuXG4gICAqIEZvciBpbnRlcm5hbCBsb2FkIGJhbGFuY2VycyB0aGlzIGlzIGFueW9uZSBpbiB0aGUgc2FtZSBWUEMuIEZvciBwdWJsaWMgbG9hZFxuICAgKiBiYWxhbmNlcnMsIHRoaXMgaXMgYW55b25lIG9uIHRoZSBpbnRlcm5ldC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gYmUgbW9yZSBzZWxlY3RpdmUgYWJvdXQgd2hvIGNhbiBhY2Nlc3MgdGhpcyBsb2FkXG4gICAqIGJhbGFuY2VyLCBzZXQgdGhpcyB0byBgZmFsc2VgIGFuZCB1c2UgdGhlIGxpc3RlbmVyJ3MgYGNvbm5lY3Rpb25zYFxuICAgKiBvYmplY3QgdG8gc2VsZWN0aXZlbHkgZ3JhbnQgYWNjZXNzIHRvIHRoZSBsb2FkIGJhbGFuY2VyIG9uIHRoZSBsaXN0ZW5lciBwb3J0LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBvcGVuPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIHN0YW5kYWxvbmUgQXBwbGljYXRpb25MaXN0ZW5lclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcGxpY2F0aW9uTGlzdGVuZXJQcm9wcyBleHRlbmRzIEJhc2VBcHBsaWNhdGlvbkxpc3RlbmVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGxvYWQgYmFsYW5jZXIgdG8gYXR0YWNoIHRoaXMgbGlzdGVuZXIgdG9cbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlcjogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIEFwcGxpY2F0aW9uTGlzdGVuZXIgbG9va3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25MaXN0ZW5lckxvb2t1cE9wdGlvbnMgZXh0ZW5kcyBCYXNlTGlzdGVuZXJMb29rdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgbGlzdGVuZXIgdG8gbG9vayB1cFxuICAgKiBAZGVmYXVsdCAtIGRvZXMgbm90IGZpbHRlciBieSBsaXN0ZW5lciBhcm5cbiAgICovXG4gIHJlYWRvbmx5IGxpc3RlbmVyQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGaWx0ZXIgbGlzdGVuZXJzIGJ5IGxpc3RlbmVyIHByb3RvY29sXG4gICAqIEBkZWZhdWx0IC0gZG9lcyBub3QgZmlsdGVyIGJ5IGxpc3RlbmVyIHByb3RvY29sXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lclByb3RvY29sPzogQXBwbGljYXRpb25Qcm90b2NvbDtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYW4gQXBwbGljYXRpb25MaXN0ZW5lclxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkxpc3RlbmVyIGV4dGVuZHMgQmFzZUxpc3RlbmVyIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uTGlzdGVuZXIge1xuICAvKipcbiAgICogTG9vayB1cCBhbiBBcHBsaWNhdGlvbkxpc3RlbmVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTG9va3VwKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IEFwcGxpY2F0aW9uTGlzdGVuZXJMb29rdXBPcHRpb25zKTogSUFwcGxpY2F0aW9uTGlzdGVuZXIge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQob3B0aW9ucy5saXN0ZW5lckFybikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWxsIGFyZ3VtZW50cyB0byBsb29rIHVwIGEgbG9hZCBiYWxhbmNlciBsaXN0ZW5lciBtdXN0IGJlIGNvbmNyZXRlIChubyBUb2tlbnMpJyk7XG4gICAgfVxuXG4gICAgbGV0IGxpc3RlbmVyUHJvdG9jb2w6IGN4c2NoZW1hLkxvYWRCYWxhbmNlckxpc3RlbmVyUHJvdG9jb2wgfCB1bmRlZmluZWQ7XG4gICAgc3dpdGNoIChvcHRpb25zLmxpc3RlbmVyUHJvdG9jb2wpIHtcbiAgICAgIGNhc2UgQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQOiBsaXN0ZW5lclByb3RvY29sID0gY3hzY2hlbWEuTG9hZEJhbGFuY2VyTGlzdGVuZXJQcm90b2NvbC5IVFRQOyBicmVhaztcbiAgICAgIGNhc2UgQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUzogbGlzdGVuZXJQcm90b2NvbCA9IGN4c2NoZW1hLkxvYWRCYWxhbmNlckxpc3RlbmVyUHJvdG9jb2wuSFRUUFM7IGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BzID0gQmFzZUxpc3RlbmVyLl9xdWVyeUNvbnRleHRQcm92aWRlcihzY29wZSwge1xuICAgICAgdXNlck9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICBsb2FkQmFsYW5jZXJUeXBlOiBjeHNjaGVtYS5Mb2FkQmFsYW5jZXJUeXBlLkFQUExJQ0FUSU9OLFxuICAgICAgbGlzdGVuZXJBcm46IG9wdGlvbnMubGlzdGVuZXJBcm4sXG4gICAgICBsaXN0ZW5lclByb3RvY29sLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBMb29rZWRVcEFwcGxpY2F0aW9uTGlzdGVuZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGxpc3RlbmVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BcHBsaWNhdGlvbkxpc3RlbmVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMpOiBJQXBwbGljYXRpb25MaXN0ZW5lciB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZEFwcGxpY2F0aW9uTGlzdGVuZXIoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKipcbiAgICogTWFuYWdlIGNvbm5lY3Rpb25zIHRvIHRoaXMgQXBwbGljYXRpb25MaXN0ZW5lclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBlYzIuQ29ubmVjdGlvbnM7XG5cbiAgLyoqXG4gICAqIExvYWQgYmFsYW5jZXIgdGhpcyBsaXN0ZW5lciBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2FkQmFsYW5jZXI6IElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcjtcblxuICAvKipcbiAgICogQVJOcyBvZiBjZXJ0aWZpY2F0ZXMgYWRkZWQgdG8gdGhpcyBsaXN0ZW5lclxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBjZXJ0aWZpY2F0ZUFybnM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBwcm90b2NvbCBmb3IgdGhpcyBsaXN0ZW5lci5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2w7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFwcGxpY2F0aW9uTGlzdGVuZXJQcm9wcykge1xuICAgIGNvbnN0IFtwcm90b2NvbCwgcG9ydF0gPSBkZXRlcm1pbmVQcm90b2NvbEFuZFBvcnQocHJvcHMucHJvdG9jb2wsIHByb3BzLnBvcnQpO1xuICAgIGlmIChwcm90b2NvbCA9PT0gdW5kZWZpbmVkIHx8IHBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgb2YgXFwncG9ydFxcJyBvciBcXCdwcm90b2NvbFxcJyBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgbG9hZEJhbGFuY2VyQXJuOiBwcm9wcy5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyQXJuLFxuICAgICAgY2VydGlmaWNhdGVzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY2VydGlmaWNhdGVBcm5zLm1hcChjZXJ0aWZpY2F0ZUFybiA9PiAoeyBjZXJ0aWZpY2F0ZUFybiB9KSkgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIHByb3RvY29sLFxuICAgICAgcG9ydCxcbiAgICAgIHNzbFBvbGljeTogcHJvcHMuc3NsUG9saWN5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5sb2FkQmFsYW5jZXIgPSBwcm9wcy5sb2FkQmFsYW5jZXI7XG4gICAgdGhpcy5wcm90b2NvbCA9IHByb3RvY29sO1xuICAgIHRoaXMuY2VydGlmaWNhdGVBcm5zID0gW107XG5cbiAgICAvLyBBdHRhY2ggY2VydGlmaWNhdGVzXG4gICAgaWYgKHByb3BzLmNlcnRpZmljYXRlQXJucyAmJiBwcm9wcy5jZXJ0aWZpY2F0ZUFybnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5hZGRDZXJ0aWZpY2F0ZUFybnMoJ0xpc3RlbmVyQ2VydGlmaWNhdGUnLCBwcm9wcy5jZXJ0aWZpY2F0ZUFybnMpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuY2VydGlmaWNhdGVzICYmIHByb3BzLmNlcnRpZmljYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmFkZENlcnRpZmljYXRlcygnRGVmYXVsdENlcnRpZmljYXRlcycsIHByb3BzLmNlcnRpZmljYXRlcyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBsaXN0ZW5lciBlZGl0cyB0aGUgc2VjdXJpdHlncm91cCBvZiB0aGUgbG9hZCBiYWxhbmNlcixcbiAgICAvLyBidXQgYWRkcyBpdHMgb3duIGRlZmF1bHQgcG9ydC5cbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICBzZWN1cml0eUdyb3VwczogcHJvcHMubG9hZEJhbGFuY2VyLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLFxuICAgICAgZGVmYXVsdFBvcnQ6IGVjMi5Qb3J0LnRjcChwb3J0KSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5kZWZhdWx0QWN0aW9uICYmIHByb3BzLmRlZmF1bHRUYXJnZXRHcm91cHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmeSBhdCBtb3N0IG9uZSBvZiBcXCdkZWZhdWx0QWN0aW9uXFwnIGFuZCBcXCdkZWZhdWx0VGFyZ2V0R3JvdXBzXFwnJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmRlZmF1bHRBY3Rpb24pIHtcbiAgICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihwcm9wcy5kZWZhdWx0QWN0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZGVmYXVsdFRhcmdldEdyb3Vwcykge1xuICAgICAgdGhpcy5zZXREZWZhdWx0QWN0aW9uKExpc3RlbmVyQWN0aW9uLmZvcndhcmQocHJvcHMuZGVmYXVsdFRhcmdldEdyb3VwcykpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5vcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbShlYzIuUGVlci5hbnlJcHY0KCksIGBBbGxvdyBmcm9tIGFueW9uZSBvbiBwb3J0ICR7cG9ydH1gKTtcbiAgICAgIGlmICh0aGlzLmxvYWRCYWxhbmNlci5pcEFkZHJlc3NUeXBlID09PSBJcEFkZHJlc3NUeXBlLkRVQUxfU1RBQ0spIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbShlYzIuUGVlci5hbnlJcHY2KCksIGBBbGxvdyBmcm9tIGFueW9uZSBvbiBwb3J0ICR7cG9ydH1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9uZSBvciBtb3JlIGNlcnRpZmljYXRlcyB0byB0aGlzIGxpc3RlbmVyLlxuICAgKlxuICAgKiBBZnRlciB0aGUgZmlyc3QgY2VydGlmaWNhdGUsIHRoaXMgY3JlYXRlcyBBcHBsaWNhdGlvbkxpc3RlbmVyQ2VydGlmaWNhdGVzXG4gICAqIHJlc291cmNlcyBzaW5jZSBjbG91ZGZvcm1hdGlvbiByZXF1aXJlcyB0aGUgY2VydGlmaWNhdGVzIGFycmF5IG9uIHRoZVxuICAgKiBsaXN0ZW5lciByZXNvdXJjZSB0byBoYXZlIGEgbGVuZ3RoIG9mIDEuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYWRkQ2VydGlmaWNhdGVzYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIGFkZENlcnRpZmljYXRlQXJucyhpZDogc3RyaW5nLCBhcm5zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuYWRkQ2VydGlmaWNhdGVzKGlkLCBhcm5zLm1hcChMaXN0ZW5lckNlcnRpZmljYXRlLmZyb21Bcm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb25lIG9yIG1vcmUgY2VydGlmaWNhdGVzIHRvIHRoaXMgbGlzdGVuZXIuXG4gICAqXG4gICAqIEFmdGVyIHRoZSBmaXJzdCBjZXJ0aWZpY2F0ZSwgdGhpcyBjcmVhdGVzIEFwcGxpY2F0aW9uTGlzdGVuZXJDZXJ0aWZpY2F0ZXNcbiAgICogcmVzb3VyY2VzIHNpbmNlIGNsb3VkZm9ybWF0aW9uIHJlcXVpcmVzIHRoZSBjZXJ0aWZpY2F0ZXMgYXJyYXkgb24gdGhlXG4gICAqIGxpc3RlbmVyIHJlc291cmNlIHRvIGhhdmUgYSBsZW5ndGggb2YgMS5cbiAgICovXG4gIHB1YmxpYyBhZGRDZXJ0aWZpY2F0ZXMoaWQ6IHN0cmluZywgY2VydGlmaWNhdGVzOiBJTGlzdGVuZXJDZXJ0aWZpY2F0ZVtdKTogdm9pZCB7XG4gICAgY29uc3QgYWRkaXRpb25hbENlcnRzID0gWy4uLmNlcnRpZmljYXRlc107XG5cbiAgICBpZiAodGhpcy5jZXJ0aWZpY2F0ZUFybnMubGVuZ3RoID09PSAwICYmIGFkZGl0aW9uYWxDZXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IGFkZGl0aW9uYWxDZXJ0cy5zcGxpY2UoMCwgMSlbMF07XG4gICAgICB0aGlzLmNlcnRpZmljYXRlQXJucy5wdXNoKGZpcnN0LmNlcnRpZmljYXRlQXJuKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IG9uZSBjZXJ0aWZpY2F0ZSBjYW4gYmUgc3BlY2lmaWVkIHBlciByZXNvdXJjZSwgZXZlbiB0aG91Z2hcbiAgICAvLyBgY2VydGlmaWNhdGVzYCBpcyBvZiB0eXBlIEFycmF5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRpdGlvbmFsQ2VydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG5ldyBBcHBsaWNhdGlvbkxpc3RlbmVyQ2VydGlmaWNhdGUodGhpcywgYCR7aWR9JHtpICsgMX1gLCB7XG4gICAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgICBjZXJ0aWZpY2F0ZXM6IFthZGRpdGlvbmFsQ2VydHNbaV1dLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIGdpdmVuIGRlZmF1bHQgYWN0aW9uIG9uIGluY29taW5nIHJlcXVlc3RzXG4gICAqXG4gICAqIFRoaXMgYWxsb3dzIGZ1bGwgY29udHJvbCBvZiB0aGUgZGVmYXVsdCBhY3Rpb24gb2YgdGhlIGxvYWQgYmFsYW5jZXIsXG4gICAqIGluY2x1ZGluZyBBY3Rpb24gY2hhaW5pbmcsIGZpeGVkIHJlc3BvbnNlcyBhbmQgcmVkaXJlY3QgcmVzcG9uc2VzLiBTZWVcbiAgICogdGhlIGBMaXN0ZW5lckFjdGlvbmAgY2xhc3MgZm9yIGFsbCBvcHRpb25zLlxuICAgKlxuICAgKiBJdCdzIHBvc3NpYmxlIHRvIGFkZCByb3V0aW5nIGNvbmRpdGlvbnMgdG8gdGhlIEFjdGlvbiBhZGRlZCBpbiB0aGlzIHdheS5cbiAgICogQXQgbGVhc3Qgb25lIEFjdGlvbiBtdXN0IGJlIGFkZGVkIHdpdGhvdXQgY29uZGl0aW9ucyAod2hpY2ggYmVjb21lcyB0aGVcbiAgICogZGVmYXVsdCBBY3Rpb24pLlxuICAgKi9cbiAgcHVibGljIGFkZEFjdGlvbihpZDogc3RyaW5nLCBwcm9wczogQWRkQXBwbGljYXRpb25BY3Rpb25Qcm9wcyk6IHZvaWQge1xuICAgIGNoZWNrQWRkUnVsZVByb3BzKHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBOZXcgcnVsZVxuICAgICAgLy9cbiAgICAgIC8vIFRhcmdldEdyb3VwLnJlZ2lzdGVyTGlzdGVuZXIgaXMgY2FsbGVkIGluc2lkZSBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZS5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZSh0aGlzLCBpZCArICdSdWxlJywge1xuICAgICAgICBsaXN0ZW5lcjogdGhpcyxcbiAgICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgICAuLi5wcm9wcyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZXcgZGVmYXVsdCB0YXJnZXQgd2l0aCB0aGVzZSB0YXJnZXRncm91cHNcbiAgICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihwcm9wcy5hY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGJhbGFuY2UgaW5jb21pbmcgcmVxdWVzdHMgdG8gdGhlIGdpdmVuIHRhcmdldCBncm91cHMuXG4gICAqXG4gICAqIEFsbCB0YXJnZXQgZ3JvdXBzIHdpbGwgYmUgbG9hZCBiYWxhbmNlZCB0byB3aXRoIGVxdWFsIHdlaWdodCBhbmQgd2l0aG91dFxuICAgKiBzdGlja2luZXNzLiBGb3IgYSBtb3JlIGNvbXBsZXggY29uZmlndXJhdGlvbiB0aGFuIHRoYXQsIHVzZSBgYWRkQWN0aW9uKClgLlxuICAgKlxuICAgKiBJdCdzIHBvc3NpYmxlIHRvIGFkZCByb3V0aW5nIGNvbmRpdGlvbnMgdG8gdGhlIFRhcmdldEdyb3VwcyBhZGRlZCBpbiB0aGlzXG4gICAqIHdheS4gQXQgbGVhc3Qgb25lIFRhcmdldEdyb3VwIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zICh3aGljaCB3aWxsXG4gICAqIGJlY29tZSB0aGUgZGVmYXVsdCBBY3Rpb24gZm9yIHRoaXMgbGlzdGVuZXIpLlxuICAgKi9cbiAgcHVibGljIGFkZFRhcmdldEdyb3VwcyhpZDogc3RyaW5nLCBwcm9wczogQWRkQXBwbGljYXRpb25UYXJnZXRHcm91cHNQcm9wcyk6IHZvaWQge1xuICAgIGNoZWNrQWRkUnVsZVByb3BzKHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBOZXcgcnVsZVxuICAgICAgLy9cbiAgICAgIC8vIFRhcmdldEdyb3VwLnJlZ2lzdGVyTGlzdGVuZXIgaXMgY2FsbGVkIGluc2lkZSBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZS5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZSh0aGlzLCBpZCArICdSdWxlJywge1xuICAgICAgICBsaXN0ZW5lcjogdGhpcyxcbiAgICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgICAuLi5wcm9wcyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZXcgZGVmYXVsdCB0YXJnZXQgd2l0aCB0aGVzZSB0YXJnZXRncm91cHNcbiAgICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihMaXN0ZW5lckFjdGlvbi5mb3J3YXJkKHByb3BzLnRhcmdldEdyb3VwcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGJhbGFuY2UgaW5jb21pbmcgcmVxdWVzdHMgdG8gdGhlIGdpdmVuIGxvYWQgYmFsYW5jaW5nIHRhcmdldHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGltcGxpY2l0bHkgY3JlYXRlcyBhbiBBcHBsaWNhdGlvblRhcmdldEdyb3VwIGZvciB0aGUgdGFyZ2V0c1xuICAgKiBpbnZvbHZlZCwgYW5kIGEgJ2ZvcndhcmQnIGFjdGlvbiB0byByb3V0ZSB0cmFmZmljIHRvIHRoZSBnaXZlbiBUYXJnZXRHcm91cC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgdGhlIHByZWNpc2Ugc2V0dXAsIGNyZWF0ZSB0aGUgVGFyZ2V0R3JvdXBcbiAgICogYW5kIHVzZSBgYWRkQWN0aW9uYCB5b3Vyc2VsZi5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgY29uZGl0aW9ucyB0byB0aGUgdGFyZ2V0cyBhZGRlZCBpbiB0aGlzIHdheS4gQXQgbGVhc3RcbiAgICogb25lIHNldCBvZiB0YXJnZXRzIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhZGRUYXJnZXRzKGlkOiBzdHJpbmcsIHByb3BzOiBBZGRBcHBsaWNhdGlvblRhcmdldHNQcm9wcyk6IEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAge1xuICAgIGlmICghdGhpcy5sb2FkQmFsYW5jZXIudnBjKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gb25seSBjYWxsIGFkZFRhcmdldHMoKSB3aGVuIHVzaW5nIGEgY29uc3RydWN0ZWQgTG9hZCBCYWxhbmNlciBvciBhbiBpbXBvcnRlZCBMb2FkIEJhbGFuY2VyIHdpdGggc3BlY2lmaWVkIHZwYzsgY29uc3RydWN0IGEgbmV3IFRhcmdldEdyb3VwIGFuZCB1c2UgYWRkVGFyZ2V0R3JvdXAnKTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cCA9IG5ldyBBcHBsaWNhdGlvblRhcmdldEdyb3VwKHRoaXMsIGlkICsgJ0dyb3VwJywge1xuICAgICAgdnBjOiB0aGlzLmxvYWRCYWxhbmNlci52cGMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkVGFyZ2V0R3JvdXBzKGlkLCB7XG4gICAgICB0YXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcblxuICAgIHJldHVybiBncm91cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBmaXhlZCByZXNwb25zZVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGFkZEFjdGlvbigpYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgYWRkRml4ZWRSZXNwb25zZShpZDogc3RyaW5nLCBwcm9wczogQWRkRml4ZWRSZXNwb25zZVByb3BzKSB7XG4gICAgY2hlY2tBZGRSdWxlUHJvcHMocHJvcHMpO1xuXG4gICAgY29uc3QgZml4ZWRSZXNwb25zZTogRml4ZWRSZXNwb25zZSA9IHtcbiAgICAgIHN0YXR1c0NvZGU6IHByb3BzLnN0YXR1c0NvZGUsXG4gICAgICBjb250ZW50VHlwZTogcHJvcHMuY29udGVudFR5cGUsXG4gICAgICBtZXNzYWdlQm9keTogcHJvcHMubWVzc2FnZUJvZHksXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE5PVEUgLSBDb3B5L3Bhc3RlZCBmcm9tIGBhcHBsaWNhdGlvbi1saXN0ZW5lci1ydWxlLnRzI3ZhbGlkYXRlRml4ZWRSZXNwb25zZWAuXG4gICAgICogVGhpcyB3YXMgcHJldmlvdXNseSBhIGRlcHJlY2F0ZWQsIGV4cG9ydGVkIGZ1bmN0aW9uLCB3aGljaCBjYXVzZWQgaXNzdWVzIHdpdGgganNpaSdzIHN0cmlwLWRlcHJlY2F0ZWQgZnVuY3Rpb25hbGl0eS5cbiAgICAgKiBJbmxpbmluZyB0aGUgZHVwbGljYXRpb24gZnVuY3Rpb25hbGl0eSBpbiB2MiBvbmx5IChmb3Igbm93KS5cbiAgICAgKi9cbiAgICBpZiAoZml4ZWRSZXNwb25zZS5zdGF0dXNDb2RlICYmICEvXigyfDR8NSlcXGRcXGQkLy50ZXN0KGZpeGVkUmVzcG9uc2Uuc3RhdHVzQ29kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHN0YXR1c0NvZGVgIG11c3QgYmUgMlhYLCA0WFggb3IgNVhYLicpO1xuICAgIH1cblxuICAgIGlmIChmaXhlZFJlc3BvbnNlLm1lc3NhZ2VCb2R5ICYmIGZpeGVkUmVzcG9uc2UubWVzc2FnZUJvZHkubGVuZ3RoID4gMTAyNCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbWVzc2FnZUJvZHlgIGNhbm5vdCBoYXZlIG1vcmUgdGhhbiAxMDI0IGNoYXJhY3RlcnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnByaW9yaXR5KSB7XG4gICAgICBuZXcgQXBwbGljYXRpb25MaXN0ZW5lclJ1bGUodGhpcywgaWQgKyAnUnVsZScsIHtcbiAgICAgICAgbGlzdGVuZXI6IHRoaXMsXG4gICAgICAgIHByaW9yaXR5OiBwcm9wcy5wcmlvcml0eSxcbiAgICAgICAgZml4ZWRSZXNwb25zZSxcbiAgICAgICAgLi4ucHJvcHMsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXREZWZhdWx0QWN0aW9uKExpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoVG9rZW4uYXNOdW1iZXIocHJvcHMuc3RhdHVzQ29kZSksIHtcbiAgICAgICAgY29udGVudFR5cGU6IHByb3BzLmNvbnRlbnRUeXBlLFxuICAgICAgICBtZXNzYWdlQm9keTogcHJvcHMubWVzc2FnZUJvZHksXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlZGlyZWN0IHJlc3BvbnNlXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYWRkQWN0aW9uKClgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhZGRSZWRpcmVjdFJlc3BvbnNlKGlkOiBzdHJpbmcsIHByb3BzOiBBZGRSZWRpcmVjdFJlc3BvbnNlUHJvcHMpIHtcbiAgICBjaGVja0FkZFJ1bGVQcm9wcyhwcm9wcyk7XG4gICAgY29uc3QgcmVkaXJlY3RSZXNwb25zZSA9IHtcbiAgICAgIGhvc3Q6IHByb3BzLmhvc3QsXG4gICAgICBwYXRoOiBwcm9wcy5wYXRoLFxuICAgICAgcG9ydDogcHJvcHMucG9ydCxcbiAgICAgIHByb3RvY29sOiBwcm9wcy5wcm90b2NvbCxcbiAgICAgIHF1ZXJ5OiBwcm9wcy5xdWVyeSxcbiAgICAgIHN0YXR1c0NvZGU6IHByb3BzLnN0YXR1c0NvZGUsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE5PVEUgLSBDb3B5L3Bhc3RlZCBmcm9tIGBhcHBsaWNhdGlvbi1saXN0ZW5lci1ydWxlLnRzI3ZhbGlkYXRlUmVkaXJlY3RSZXNwb25zZWAuXG4gICAgICogVGhpcyB3YXMgcHJldmlvdXNseSBhIGRlcHJlY2F0ZWQsIGV4cG9ydGVkIGZ1bmN0aW9uLCB3aGljaCBjYXVzZWQgaXNzdWVzIHdpdGgganNpaSdzIHN0cmlwLWRlcHJlY2F0ZWQgZnVuY3Rpb25hbGl0eS5cbiAgICAgKiBJbmxpbmluZyB0aGUgZHVwbGljYXRpb24gZnVuY3Rpb25hbGl0eSBpbiB2MiBvbmx5IChmb3Igbm93KS5cbiAgICAgKi9cbiAgICBpZiAocmVkaXJlY3RSZXNwb25zZS5wcm90b2NvbCAmJiAhL14oSFRUUFM/fCNcXHtwcm90b2NvbFxcfSkkL2kudGVzdChyZWRpcmVjdFJlc3BvbnNlLnByb3RvY29sKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgcHJvdG9jb2xgIG11c3QgYmUgSFRUUCwgSFRUUFMsIG9yICN7cHJvdG9jb2x9LicpO1xuICAgIH1cblxuICAgIGlmICghcmVkaXJlY3RSZXNwb25zZS5zdGF0dXNDb2RlIHx8ICEvXkhUVFBfMzBbMTJdJC8udGVzdChyZWRpcmVjdFJlc3BvbnNlLnN0YXR1c0NvZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzdGF0dXNDb2RlYCBtdXN0IGJlIEhUVFBfMzAxIG9yIEhUVFBfMzAyLicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5wcmlvcml0eSkge1xuICAgICAgbmV3IEFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHRoaXMsIGlkICsgJ1J1bGUnLCB7XG4gICAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgICBwcmlvcml0eTogcHJvcHMucHJpb3JpdHksXG4gICAgICAgIHJlZGlyZWN0UmVzcG9uc2UsXG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihMaXN0ZW5lckFjdGlvbi5yZWRpcmVjdCh7XG4gICAgICAgIGhvc3Q6IHByb3BzLmhvc3QsXG4gICAgICAgIHBhdGg6IHByb3BzLnBhdGgsXG4gICAgICAgIHBvcnQ6IHByb3BzLnBvcnQsXG4gICAgICAgIHByb3RvY29sOiBwcm9wcy5wcm90b2NvbCxcbiAgICAgICAgcXVlcnk6IHByb3BzLnF1ZXJ5LFxuICAgICAgICBwZXJtYW5lbnQ6IHByb3BzLnN0YXR1c0NvZGUgPT09ICdIVFRQXzMwMScsXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoYXQgYSBjb25uZWN0YWJsZSB0aGF0IGhhcyBiZWVuIGFkZGVkIHRvIHRoaXMgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCBpcyBjYWxsZWQgYnkgQXBwbGljYXRpb25UYXJnZXRHcm91cC5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckNvbm5lY3RhYmxlKGNvbm5lY3RhYmxlOiBlYzIuSUNvbm5lY3RhYmxlLCBwb3J0UmFuZ2U6IGVjMi5Qb3J0KTogdm9pZCB7XG4gICAgY29ubmVjdGFibGUuY29ubmVjdGlvbnMuYWxsb3dGcm9tKHRoaXMubG9hZEJhbGFuY2VyLCBwb3J0UmFuZ2UsICdMb2FkIGJhbGFuY2VyIHRvIHRhcmdldCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoaXMgbGlzdGVuZXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVMaXN0ZW5lcigpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZXJyb3JzID0gc3VwZXIudmFsaWRhdGVMaXN0ZW5lcigpO1xuICAgIGlmICh0aGlzLnByb3RvY29sID09PSBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTICYmIHRoaXMuY2VydGlmaWNhdGVBcm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZXJyb3JzLnB1c2goJ0hUVFBTIExpc3RlbmVyIG5lZWRzIGF0IGxlYXN0IG9uZSBjZXJ0aWZpY2F0ZSAoY2FsbCBhZGRDZXJ0aWZpY2F0ZXMpJyk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3IgX3NldERlZmF1bHRBY3Rpb24gd2hpY2ggZG9lcyBhIHR5cGUtc2FmZSBiaW5kXG4gICAqL1xuICBwcml2YXRlIHNldERlZmF1bHRBY3Rpb24oYWN0aW9uOiBMaXN0ZW5lckFjdGlvbikge1xuICAgIGFjdGlvbi5iaW5kKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY3Rpb24oYWN0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gcmVmZXJlbmNlIGFuIGV4aXN0aW5nIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGxpY2F0aW9uTGlzdGVuZXIgZXh0ZW5kcyBJTGlzdGVuZXIsIGVjMi5JQ29ubmVjdGFibGUge1xuICAvKipcbiAgICogQWRkIG9uZSBvciBtb3JlIGNlcnRpZmljYXRlcyB0byB0aGlzIGxpc3RlbmVyLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGFkZENlcnRpZmljYXRlcygpYFxuICAgKi9cbiAgYWRkQ2VydGlmaWNhdGVBcm5zKGlkOiBzdHJpbmcsIGFybnM6IHN0cmluZ1tdKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkIG9uZSBvciBtb3JlIGNlcnRpZmljYXRlcyB0byB0aGlzIGxpc3RlbmVyLlxuICAgKi9cbiAgYWRkQ2VydGlmaWNhdGVzKGlkOiBzdHJpbmcsIGNlcnRpZmljYXRlczogSUxpc3RlbmVyQ2VydGlmaWNhdGVbXSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIExvYWQgYmFsYW5jZSBpbmNvbWluZyByZXF1ZXN0cyB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGdyb3Vwcy5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgY29uZGl0aW9ucyB0byB0aGUgVGFyZ2V0R3JvdXBzIGFkZGVkIGluIHRoaXMgd2F5LlxuICAgKiBBdCBsZWFzdCBvbmUgVGFyZ2V0R3JvdXAgbXVzdCBiZSBhZGRlZCB3aXRob3V0IGNvbmRpdGlvbnMuXG4gICAqL1xuICBhZGRUYXJnZXRHcm91cHMoaWQ6IHN0cmluZywgcHJvcHM6IEFkZEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXBzUHJvcHMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBMb2FkIGJhbGFuY2UgaW5jb21pbmcgcmVxdWVzdHMgdG8gdGhlIGdpdmVuIGxvYWQgYmFsYW5jaW5nIHRhcmdldHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGltcGxpY2l0bHkgY3JlYXRlcyBhbiBBcHBsaWNhdGlvblRhcmdldEdyb3VwIGZvciB0aGUgdGFyZ2V0c1xuICAgKiBpbnZvbHZlZC5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgY29uZGl0aW9ucyB0byB0aGUgdGFyZ2V0cyBhZGRlZCBpbiB0aGlzIHdheS4gQXQgbGVhc3RcbiAgICogb25lIHNldCBvZiB0YXJnZXRzIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIGFkZFRhcmdldHMoaWQ6IHN0cmluZywgcHJvcHM6IEFkZEFwcGxpY2F0aW9uVGFyZ2V0c1Byb3BzKTogQXBwbGljYXRpb25UYXJnZXRHcm91cDtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhhdCBhIGNvbm5lY3RhYmxlIHRoYXQgaGFzIGJlZW4gYWRkZWQgdG8gdGhpcyBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMgZGlyZWN0bHkuIEl0IGlzIGNhbGxlZCBieSBBcHBsaWNhdGlvblRhcmdldEdyb3VwLlxuICAgKi9cbiAgcmVnaXN0ZXJDb25uZWN0YWJsZShjb25uZWN0YWJsZTogZWMyLklDb25uZWN0YWJsZSwgcG9ydFJhbmdlOiBlYzIuUG9ydCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIGdpdmVuIGFjdGlvbiBvbiBpbmNvbWluZyByZXF1ZXN0c1xuICAgKlxuICAgKiBUaGlzIGFsbG93cyBmdWxsIGNvbnRyb2wgb2YgdGhlIGRlZmF1bHQgYWN0aW9uIG9mIHRoZSBsb2FkIGJhbGFuY2VyLFxuICAgKiBpbmNsdWRpbmcgQWN0aW9uIGNoYWluaW5nLCBmaXhlZCByZXNwb25zZXMgYW5kIHJlZGlyZWN0IHJlc3BvbnNlcy4gU2VlXG4gICAqIHRoZSBgTGlzdGVuZXJBY3Rpb25gIGNsYXNzIGZvciBhbGwgb3B0aW9ucy5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgcm91dGluZyBjb25kaXRpb25zIHRvIHRoZSBBY3Rpb24gYWRkZWQgaW4gdGhpcyB3YXkuXG4gICAqXG4gICAqIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBhZGQgYSBkZWZhdWx0IGFjdGlvbiB0byBhbiBpbXBvcnRlZCBJQXBwbGljYXRpb25MaXN0ZW5lci5cbiAgICogSW4gb3JkZXIgdG8gYWRkIGFjdGlvbnMgdG8gYW4gaW1wb3J0ZWQgSUFwcGxpY2F0aW9uTGlzdGVuZXIgYSBgcHJpb3JpdHlgXG4gICAqIG11c3QgYmUgcHJvdmlkZWQuXG4gICAqL1xuICBhZGRBY3Rpb24oaWQ6IHN0cmluZywgcHJvcHM6IEFkZEFwcGxpY2F0aW9uQWN0aW9uUHJvcHMpOiB2b2lkO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gcmVmZXJlbmNlIGFuIGV4aXN0aW5nIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogQVJOIG9mIHRoZSBsaXN0ZW5lclxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogU2VjdXJpdHkgZ3JvdXAgb2YgdGhlIGxvYWQgYmFsYW5jZXIgdGhpcyBsaXN0ZW5lciBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgcG9ydCBvbiB3aGljaCB0aGlzIGxpc3RlbmVyIGlzIGxpc3RlbmluZ1xuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGltcG9ydGVkIHNlY3VyaXR5IGdyb3VwIGFsbG93cyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBvciBub3Qgd2hlblxuICAgKiBpbXBvcnRlZCB1c2luZyBgc2VjdXJpdHlHcm91cElkYFxuICAgKlxuICAgKiBVbmxlc3Mgc2V0IHRvIGBmYWxzZWAsIG5vIGVncmVzcyBydWxlcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBzZWN1cml0eSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHNlY3VyaXR5R3JvdXBgIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBBbGxvd3NBbGxPdXRib3VuZD86IGJvb2xlYW47XG59XG5cbmFic3RyYWN0IGNsYXNzIEV4dGVybmFsQXBwbGljYXRpb25MaXN0ZW5lciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uTGlzdGVuZXIge1xuICAvKipcbiAgICogQ29ubmVjdGlvbnMgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBlYzIuQ29ubmVjdGlvbnM7XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBsaXN0ZW5lckFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoYXQgYSBjb25uZWN0YWJsZSB0aGF0IGhhcyBiZWVuIGFkZGVkIHRvIHRoaXMgbG9hZCBiYWxhbmNlci5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LiBJdCBpcyBjYWxsZWQgYnkgQXBwbGljYXRpb25UYXJnZXRHcm91cC5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckNvbm5lY3RhYmxlKGNvbm5lY3RhYmxlOiBlYzIuSUNvbm5lY3RhYmxlLCBwb3J0UmFuZ2U6IGVjMi5Qb3J0KTogdm9pZCB7XG4gICAgdGhpcy5jb25uZWN0aW9ucy5hbGxvd1RvKGNvbm5lY3RhYmxlLCBwb3J0UmFuZ2UsICdMb2FkIGJhbGFuY2VyIHRvIHRhcmdldCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvbmUgb3IgbW9yZSBjZXJ0aWZpY2F0ZXMgdG8gdGhpcyBsaXN0ZW5lci5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBhZGRDZXJ0aWZpY2F0ZXMoKWBcbiAgICovXG4gIHB1YmxpYyBhZGRDZXJ0aWZpY2F0ZUFybnMoaWQ6IHN0cmluZywgYXJuczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLmFkZENlcnRpZmljYXRlcyhpZCwgYXJucy5tYXAoTGlzdGVuZXJDZXJ0aWZpY2F0ZS5mcm9tQXJuKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9uZSBvciBtb3JlIGNlcnRpZmljYXRlcyB0byB0aGlzIGxpc3RlbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZENlcnRpZmljYXRlcyhpZDogc3RyaW5nLCBjZXJ0aWZpY2F0ZXM6IElMaXN0ZW5lckNlcnRpZmljYXRlW10pOiB2b2lkIHtcbiAgICBuZXcgQXBwbGljYXRpb25MaXN0ZW5lckNlcnRpZmljYXRlKHRoaXMsIGlkLCB7XG4gICAgICBsaXN0ZW5lcjogdGhpcyxcbiAgICAgIGNlcnRpZmljYXRlcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGJhbGFuY2UgaW5jb21pbmcgcmVxdWVzdHMgdG8gdGhlIGdpdmVuIHRhcmdldCBncm91cHMuXG4gICAqXG4gICAqIEl0J3MgcG9zc2libGUgdG8gYWRkIGNvbmRpdGlvbnMgdG8gdGhlIFRhcmdldEdyb3VwcyBhZGRlZCBpbiB0aGlzIHdheS5cbiAgICogQXQgbGVhc3Qgb25lIFRhcmdldEdyb3VwIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zLlxuICAgKi9cbiAgcHVibGljIGFkZFRhcmdldEdyb3VwcyhpZDogc3RyaW5nLCBwcm9wczogQWRkQXBwbGljYXRpb25UYXJnZXRHcm91cHNQcm9wcyk6IHZvaWQge1xuICAgIGNoZWNrQWRkUnVsZVByb3BzKHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBOZXcgcnVsZVxuICAgICAgbmV3IEFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHRoaXMsIGlkLCB7XG4gICAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgICBwcmlvcml0eTogcHJvcHMucHJpb3JpdHksXG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBkZWZhdWx0IFRhcmdldCBHcm91cHMgdG8gaW1wb3J0ZWQgQXBwbGljYXRpb25MaXN0ZW5lcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGJhbGFuY2UgaW5jb21pbmcgcmVxdWVzdHMgdG8gdGhlIGdpdmVuIGxvYWQgYmFsYW5jaW5nIHRhcmdldHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGltcGxpY2l0bHkgY3JlYXRlcyBhbiBBcHBsaWNhdGlvblRhcmdldEdyb3VwIGZvciB0aGUgdGFyZ2V0c1xuICAgKiBpbnZvbHZlZC5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgY29uZGl0aW9ucyB0byB0aGUgdGFyZ2V0cyBhZGRlZCBpbiB0aGlzIHdheS4gQXQgbGVhc3RcbiAgICogb25lIHNldCBvZiB0YXJnZXRzIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhZGRUYXJnZXRzKF9pZDogc3RyaW5nLCBfcHJvcHM6IEFkZEFwcGxpY2F0aW9uVGFyZ2V0c1Byb3BzKTogQXBwbGljYXRpb25UYXJnZXRHcm91cCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBvbmx5IGNhbGwgYWRkVGFyZ2V0cygpIHdoZW4gdXNpbmcgYSBjb25zdHJ1Y3RlZCBBcHBsaWNhdGlvbkxpc3RlbmVyOyBjb25zdHJ1Y3QgYSBuZXcgVGFyZ2V0R3JvdXAgYW5kIHVzZSBhZGRUYXJnZXRHcm91cC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSBnaXZlbiBhY3Rpb24gb24gaW5jb21pbmcgcmVxdWVzdHNcbiAgICpcbiAgICogVGhpcyBhbGxvd3MgZnVsbCBjb250cm9sIG9mIHRoZSBkZWZhdWx0IGFjdGlvbiBvZiB0aGUgbG9hZCBiYWxhbmNlcixcbiAgICogaW5jbHVkaW5nIEFjdGlvbiBjaGFpbmluZywgZml4ZWQgcmVzcG9uc2VzIGFuZCByZWRpcmVjdCByZXNwb25zZXMuIFNlZVxuICAgKiB0aGUgYExpc3RlbmVyQWN0aW9uYCBjbGFzcyBmb3IgYWxsIG9wdGlvbnMuXG4gICAqXG4gICAqIEl0J3MgcG9zc2libGUgdG8gYWRkIHJvdXRpbmcgY29uZGl0aW9ucyB0byB0aGUgQWN0aW9uIGFkZGVkIGluIHRoaXMgd2F5LlxuICAgKlxuICAgKiBJdCBpcyBub3QgcG9zc2libGUgdG8gYWRkIGEgZGVmYXVsdCBhY3Rpb24gdG8gYW4gaW1wb3J0ZWQgSUFwcGxpY2F0aW9uTGlzdGVuZXIuXG4gICAqIEluIG9yZGVyIHRvIGFkZCBhY3Rpb25zIHRvIGFuIGltcG9ydGVkIElBcHBsaWNhdGlvbkxpc3RlbmVyIGEgYHByaW9yaXR5YFxuICAgKiBtdXN0IGJlIHByb3ZpZGVkLlxuICAgKi9cbiAgcHVibGljIGFkZEFjdGlvbihpZDogc3RyaW5nLCBwcm9wczogQWRkQXBwbGljYXRpb25BY3Rpb25Qcm9wcyk6IHZvaWQge1xuICAgIGNoZWNrQWRkUnVsZVByb3BzKHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBOZXcgcnVsZVxuICAgICAgLy9cbiAgICAgIC8vIFRhcmdldEdyb3VwLnJlZ2lzdGVyTGlzdGVuZXIgaXMgY2FsbGVkIGluc2lkZSBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZS5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZSh0aGlzLCBpZCArICdSdWxlJywge1xuICAgICAgICBsaXN0ZW5lcjogdGhpcyxcbiAgICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgICAuLi5wcm9wcyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ByaW9yaXR5IG11c3QgYmUgc2V0IGZvciBhY3Rpb25zIGFkZGVkIHRvIGFuIGltcG9ydGVkIGxpc3RlbmVyJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQW4gaW1wb3J0ZWQgYXBwbGljYXRpb24gbGlzdGVuZXIuXG4gKi9cbmNsYXNzIEltcG9ydGVkQXBwbGljYXRpb25MaXN0ZW5lciBleHRlbmRzIEV4dGVybmFsQXBwbGljYXRpb25MaXN0ZW5lciB7XG4gIHB1YmxpYyByZWFkb25seSBsaXN0ZW5lckFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5saXN0ZW5lckFybiA9IHByb3BzLmxpc3RlbmVyQXJuO1xuICAgIGNvbnN0IGRlZmF1bHRQb3J0ID0gcHJvcHMuZGVmYXVsdFBvcnQgIT09IHVuZGVmaW5lZCA/IGVjMi5Qb3J0LnRjcChwcm9wcy5kZWZhdWx0UG9ydCkgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICBzZWN1cml0eUdyb3VwczogW3Byb3BzLnNlY3VyaXR5R3JvdXBdLFxuICAgICAgZGVmYXVsdFBvcnQsXG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTG9va2VkVXBBcHBsaWNhdGlvbkxpc3RlbmVyIGV4dGVuZHMgRXh0ZXJuYWxBcHBsaWNhdGlvbkxpc3RlbmVyIHtcbiAgcHVibGljIHJlYWRvbmx5IGxpc3RlbmVyQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjeGFwaS5Mb2FkQmFsYW5jZXJMaXN0ZW5lckNvbnRleHRSZXNwb25zZSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmxpc3RlbmVyQXJuID0gcHJvcHMubGlzdGVuZXJBcm47XG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgICAgZGVmYXVsdFBvcnQ6IGVjMi5Qb3J0LnRjcChwcm9wcy5saXN0ZW5lclBvcnQpLFxuICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBzZWN1cml0eUdyb3VwSWQgb2YgcHJvcHMuc2VjdXJpdHlHcm91cElkcykge1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21Mb29rdXBCeUlkKHRoaXMsIGBTZWN1cml0eUdyb3VwLSR7c2VjdXJpdHlHcm91cElkfWAsIHNlY3VyaXR5R3JvdXBJZCk7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAoc2VjdXJpdHlHcm91cCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgY29uZGl0aW9uYWwgbG9hZCBiYWxhbmNpbmcgcnVsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkZFJ1bGVQcm9wcyB7XG4gIC8qKlxuICAgKiBQcmlvcml0eSBvZiB0aGlzIHRhcmdldCBncm91cFxuICAgKlxuICAgKiBUaGUgcnVsZSB3aXRoIHRoZSBsb3dlc3QgcHJpb3JpdHkgd2lsbCBiZSB1c2VkIGZvciBldmVyeSByZXF1ZXN0LlxuICAgKiBJZiBwcmlvcml0eSBpcyBub3QgZ2l2ZW4sIHRoZXNlIHRhcmdldCBncm91cHMgd2lsbCBiZSBhZGRlZCBhc1xuICAgKiBkZWZhdWx0cywgYW5kIG11c3Qgbm90IGhhdmUgY29uZGl0aW9ucy5cbiAgICpcbiAgICogUHJpb3JpdGllcyBtdXN0IGJlIHVuaXF1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgVGFyZ2V0IGdyb3VwcyBhcmUgdXNlZCBhcyBkZWZhdWx0c1xuICAgKi9cbiAgcmVhZG9ubHkgcHJpb3JpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJ1bGUgYXBwbGllcyBpZiBtYXRjaGVzIHRoZSBjb25kaXRpb25zLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbmRpdGlvbnMuXG4gICAqL1xuICByZWFkb25seSBjb25kaXRpb25zPzogTGlzdGVuZXJDb25kaXRpb25bXTtcblxuICAvKipcbiAgICogUnVsZSBhcHBsaWVzIGlmIHRoZSByZXF1ZXN0ZWQgaG9zdCBtYXRjaGVzIHRoZSBpbmRpY2F0ZWQgaG9zdFxuICAgKlxuICAgKiBNYXkgY29udGFpbiB1cCB0byB0aHJlZSAnKicgd2lsZGNhcmRzLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHByaW9yaXR5IGlzIHNldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL2xvYWQtYmFsYW5jZXItbGlzdGVuZXJzLmh0bWwjaG9zdC1jb25kaXRpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGhvc3QgY29uZGl0aW9uXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY29uZGl0aW9uc2AgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IGhvc3RIZWFkZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJ1bGUgYXBwbGllcyBpZiB0aGUgcmVxdWVzdGVkIHBhdGggbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aCBwYXR0ZXJuXG4gICAqXG4gICAqIE1heSBjb250YWluIHVwIHRvIHRocmVlICcqJyB3aWxkY2FyZHMuXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoYXQgcHJpb3JpdHkgaXMgc2V0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNwYXRoLWNvbmRpdGlvbnNcbiAgICogQGRlZmF1bHQgTm8gcGF0aCBjb25kaXRpb25cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBjb25kaXRpb25zYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aFBhdHRlcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJ1bGUgYXBwbGllcyBpZiB0aGUgcmVxdWVzdGVkIHBhdGggbWF0Y2hlcyBhbnkgb2YgdGhlIGdpdmVuIHBhdHRlcm5zLlxuICAgKlxuICAgKiBNYXkgY29udGFpbiB1cCB0byB0aHJlZSAnKicgd2lsZGNhcmRzLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHByaW9yaXR5IGlzIHNldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL2xvYWQtYmFsYW5jZXItbGlzdGVuZXJzLmh0bWwjcGF0aC1jb25kaXRpb25zXG4gICAqIEBkZWZhdWx0IC0gTm8gcGF0aCBjb25kaXRpb24uXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY29uZGl0aW9uc2AgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHBhdGhQYXR0ZXJucz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFkZGluZyBhIG5ldyB0YXJnZXQgZ3JvdXAgdG8gYSBsaXN0ZW5lclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkZEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXBzUHJvcHMgZXh0ZW5kcyBBZGRSdWxlUHJvcHMge1xuICAvKipcbiAgICogVGFyZ2V0IGdyb3VwcyB0byBmb3J3YXJkIHJlcXVlc3RzIHRvXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRHcm91cHM6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgbmV3IGFjdGlvbiB0byBhIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkQXBwbGljYXRpb25BY3Rpb25Qcm9wcyBleHRlbmRzIEFkZFJ1bGVQcm9wcyB7XG4gIC8qKlxuICAgKiBBY3Rpb24gdG8gcGVyZm9ybVxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uOiBMaXN0ZW5lckFjdGlvbjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhZGRpbmcgbmV3IHRhcmdldHMgdG8gYSBsaXN0ZW5lclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkZEFwcGxpY2F0aW9uVGFyZ2V0c1Byb3BzIGV4dGVuZHMgQWRkUnVsZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgRGV0ZXJtaW5lZCBmcm9tIHBvcnQgaWYga25vd25cbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogQXBwbGljYXRpb25Qcm90b2NvbDtcblxuICAvKipcbiAgICogVGhlIHByb3RvY29sIHZlcnNpb24gdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IEFwcGxpY2F0aW9uUHJvdG9jb2xWZXJzaW9uLkhUVFAxXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbFZlcnNpb24/OiBBcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIHBvcnQgb24gd2hpY2ggdGhlIGxpc3RlbmVyIGxpc3RlbnMgZm9yIHJlcXVlc3RzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZXRlcm1pbmVkIGZyb20gcHJvdG9jb2wgaWYga25vd25cbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHBlcmlvZCBkdXJpbmcgd2hpY2ggdGhlIGxvYWQgYmFsYW5jZXIgc2VuZHMgYSBuZXdseSByZWdpc3RlcmVkXG4gICAqIHRhcmdldCBhIGxpbmVhcmx5IGluY3JlYXNpbmcgc2hhcmUgb2YgdGhlIHRyYWZmaWMgdG8gdGhlIHRhcmdldCBncm91cC5cbiAgICpcbiAgICogVGhlIHJhbmdlIGlzIDMwLTkwMCBzZWNvbmRzICgxNSBtaW51dGVzKS5cbiAgICpcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgcmVhZG9ubHkgc2xvd1N0YXJ0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBzdGlja2luZXNzIGNvb2tpZSBleHBpcmF0aW9uIHBlcmlvZC5cbiAgICpcbiAgICogU2V0dGluZyB0aGlzIHZhbHVlIGVuYWJsZXMgbG9hZCBiYWxhbmNlciBzdGlja2luZXNzLlxuICAgKlxuICAgKiBBZnRlciB0aGlzIHBlcmlvZCwgdGhlIGNvb2tpZSBpcyBjb25zaWRlcmVkIHN0YWxlLiBUaGUgbWluaW11bSB2YWx1ZSBpc1xuICAgKiAxIHNlY29uZCBhbmQgdGhlIG1heGltdW0gdmFsdWUgaXMgNyBkYXlzICg2MDQ4MDAgc2Vjb25kcykuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN0aWNraW5lc3MgZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IHN0aWNraW5lc3NDb29raWVEdXJhdGlvbj86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBhbiBhcHBsaWNhdGlvbi1iYXNlZCBzdGlja2luZXNzIGNvb2tpZS5cbiAgICpcbiAgICogTmFtZXMgdGhhdCBzdGFydCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJlZml4ZXMgYXJlIG5vdCBhbGxvd2VkOiBBV1NBTEIsIEFXU0FMQkFQUCxcbiAgICogYW5kIEFXU0FMQlRHOyB0aGV5J3JlIHJlc2VydmVkIGZvciB1c2UgYnkgdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIE5vdGU6IGBzdGlja2luZXNzQ29va2llTmFtZWAgcGFyYW1ldGVyIGRlcGVuZHMgb24gdGhlIHByZXNlbmNlIG9mIGBzdGlja2luZXNzQ29va2llRHVyYXRpb25gIHBhcmFtZXRlci5cbiAgICogSWYgYHN0aWNraW5lc3NDb29raWVEdXJhdGlvbmAgaXMgbm90IHNldCwgYHN0aWNraW5lc3NDb29raWVOYW1lYCB3aWxsIGJlIG9taXR0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgYHN0aWNraW5lc3NDb29raWVEdXJhdGlvbmAgaXMgc2V0LCBhIGxvYWQtYmFsYW5jZXIgZ2VuZXJhdGVkIGNvb2tpZSBpcyB1c2VkLiBPdGhlcndpc2UsIG5vIHN0aWNraW5lc3MgaXMgZGVmaW5lZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL3N0aWNreS1zZXNzaW9ucy5odG1sXG4gICAqL1xuICByZWFkb25seSBzdGlja2luZXNzQ29va2llTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRhcmdldHMgdG8gYWRkIHRvIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBDYW4gYmUgYEluc3RhbmNlYCwgYElQQWRkcmVzc2AsIG9yIGFueSBzZWxmLXJlZ2lzdGVyaW5nIGxvYWQgYmFsYW5jaW5nXG4gICAqIHRhcmdldC4gQWxsIHRhcmdldCBtdXN0IGJlIG9mIHRoZSBzYW1lIHR5cGUuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRzPzogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyVGFyZ2V0W107XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbmFtZSBtdXN0IGJlIHVuaXF1ZSBwZXIgcmVnaW9uIHBlciBhY2NvdW50LCBjYW4gaGF2ZSBhIG1heGltdW0gb2ZcbiAgICogMzIgY2hhcmFjdGVycywgbXVzdCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgb3IgaHlwaGVucywgYW5kXG4gICAqIG11c3Qgbm90IGJlZ2luIG9yIGVuZCB3aXRoIGEgaHlwaGVuLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgZm9yIEVsYXN0aWMgTG9hZCBCYWxhbmNpbmcgdG8gd2FpdCBiZWZvcmUgZGVyZWdpc3RlcmluZyBhIHRhcmdldC5cbiAgICpcbiAgICogVGhlIHJhbmdlIGlzIDAtMzYwMCBzZWNvbmRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSBkZXJlZ2lzdHJhdGlvbkRlbGF5PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIEhlYWx0aCBjaGVjayBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggcHJvcGVydHkgaW4gdGhpcyBjb25maWd1cmF0aW9uIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlIHRhcmdldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi10YXJnZXRncm91cC5odG1sI2F3cy1yZXNvdXJjZS1lbGFzdGljbG9hZGJhbGFuY2luZ3YyLXRhcmdldGdyb3VwLXByb3BlcnRpZXNcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrPzogSGVhbHRoQ2hlY2s7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2FkIGJhbGFuY2luZyBhbGdvcml0aG0gdG8gc2VsZWN0IHRhcmdldHMgZm9yIHJvdXRpbmcgcmVxdWVzdHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHJvdW5kX3JvYmluLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2luZ0FsZ29yaXRobVR5cGU/OiBUYXJnZXRHcm91cExvYWRCYWxhbmNpbmdBbGdvcml0aG1UeXBlO1xuXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgZml4ZWQgcmVzcG9uc2UgdG8gYSBsaXN0ZW5lclxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgQXBwbGljYXRpb25MaXN0ZW5lci5hZGRBY3Rpb25gIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkRml4ZWRSZXNwb25zZVByb3BzIGV4dGVuZHMgQWRkUnVsZVByb3BzLCBGaXhlZFJlc3BvbnNlIHtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhZGRpbmcgYSByZWRpcmVjdCByZXNwb25zZSB0byBhIGxpc3RlbmVyXG4gKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBBcHBsaWNhdGlvbkxpc3RlbmVyLmFkZEFjdGlvbmAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRSZWRpcmVjdFJlc3BvbnNlUHJvcHMgZXh0ZW5kcyBBZGRSdWxlUHJvcHMsIFJlZGlyZWN0UmVzcG9uc2Uge1xufVxuXG5mdW5jdGlvbiBjaGVja0FkZFJ1bGVQcm9wcyhwcm9wczogQWRkUnVsZVByb3BzKSB7XG4gIGNvbnN0IGNvbmRpdGlvbnNDb3VudCA9IHByb3BzLmNvbmRpdGlvbnM/Lmxlbmd0aCB8fCAwO1xuICBjb25zdCBoYXNBbnlDb25kaXRpb25zID0gY29uZGl0aW9uc0NvdW50ICE9PSAwIHx8XG4gICAgcHJvcHMuaG9zdEhlYWRlciAhPT0gdW5kZWZpbmVkIHx8IHByb3BzLnBhdGhQYXR0ZXJuICE9PSB1bmRlZmluZWQgfHwgcHJvcHMucGF0aFBhdHRlcm5zICE9PSB1bmRlZmluZWQ7XG4gIGNvbnN0IGhhc1ByaW9yaXR5ID0gcHJvcHMucHJpb3JpdHkgIT09IHVuZGVmaW5lZDtcbiAgaWYgKGhhc0FueUNvbmRpdGlvbnMgIT09IGhhc1ByaW9yaXR5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ2NvbmRpdGlvbnNcXCcsIFxcJ3BhdGhQYXR0ZXJuXFwnIG9yIFxcJ2hvc3RIZWFkZXJcXCcgYWxzbyByZXF1aXJlcyBcXCdwcmlvcml0eVxcJywgYW5kIHZpY2UgdmVyc2EnKTtcbiAgfVxufVxuIl19