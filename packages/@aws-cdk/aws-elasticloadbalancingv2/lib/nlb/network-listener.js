"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkListener = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const network_listener_action_1 = require("./network-listener-action");
const network_listener_certificate_1 = require("./network-listener-certificate");
const network_target_group_1 = require("./network-target-group");
const base_listener_1 = require("../shared/base-listener");
const enums_1 = require("../shared/enums");
const util_1 = require("../shared/util");
/**
 * Define a Network Listener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
class NetworkListener extends base_listener_1.BaseListener {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkListener);
            }
            throw error;
        }
        const certs = props.certificates || [];
        const proto = props.protocol || (certs.length > 0 ? enums_1.Protocol.TLS : enums_1.Protocol.TCP);
        util_1.validateNetworkProtocol(proto);
        if (proto === enums_1.Protocol.TLS && certs.filter(v => v != null).length === 0) {
            throw new Error('When the protocol is set to TLS, you must specify certificates');
        }
        if (proto !== enums_1.Protocol.TLS && certs.length > 0) {
            throw new Error('Protocol must be TLS when certificates have been specified');
        }
        if (proto !== enums_1.Protocol.TLS && props.alpnPolicy) {
            throw new Error('Protocol must be TLS when alpnPolicy have been specified');
        }
        super(scope, id, {
            loadBalancerArn: props.loadBalancer.loadBalancerArn,
            protocol: proto,
            port: props.port,
            sslPolicy: props.sslPolicy,
            certificates: core_1.Lazy.any({ produce: () => this.certificateArns.map(certificateArn => ({ certificateArn })) }, { omitEmptyArray: true }),
            alpnPolicy: props.alpnPolicy ? [props.alpnPolicy] : undefined,
        });
        this.certificateArns = [];
        this.loadBalancer = props.loadBalancer;
        this.protocol = proto;
        if (certs.length > 0) {
            this.addCertificates('DefaultCertificates', certs);
        }
        if (props.defaultAction && props.defaultTargetGroups) {
            throw new Error('Specify at most one of \'defaultAction\' and \'defaultTargetGroups\'');
        }
        if (props.defaultAction) {
            this.setDefaultAction(props.defaultAction);
        }
        if (props.defaultTargetGroups) {
            this.setDefaultAction(network_listener_action_1.NetworkListenerAction.forward(props.defaultTargetGroups));
        }
    }
    /**
     * Looks up a network listener
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkListenerLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        let listenerProtocol;
        if (options.listenerProtocol) {
            util_1.validateNetworkProtocol(options.listenerProtocol);
            switch (options.listenerProtocol) {
                case enums_1.Protocol.TCP:
                    listenerProtocol = cxschema.LoadBalancerListenerProtocol.TCP;
                    break;
                case enums_1.Protocol.UDP:
                    listenerProtocol = cxschema.LoadBalancerListenerProtocol.UDP;
                    break;
                case enums_1.Protocol.TCP_UDP:
                    listenerProtocol = cxschema.LoadBalancerListenerProtocol.TCP_UDP;
                    break;
                case enums_1.Protocol.TLS:
                    listenerProtocol = cxschema.LoadBalancerListenerProtocol.TLS;
                    break;
            }
        }
        const props = base_listener_1.BaseListener._queryContextProvider(scope, {
            userOptions: options,
            listenerProtocol: listenerProtocol,
            loadBalancerType: cxschema.LoadBalancerType.NETWORK,
        });
        class LookedUp extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.listenerArn = props.listenerArn;
            }
        }
        return new LookedUp(scope, id);
    }
    /**
     * Import an existing listener
     */
    static fromNetworkListenerArn(scope, id, networkListenerArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.listenerArn = networkListenerArn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add one or more certificates to this listener.
     *
     * After the first certificate, this creates NetworkListenerCertificates
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
            new network_listener_certificate_1.NetworkListenerCertificate(this, `${id}${i + 1}`, {
                listener: this,
                certificates: [additionalCerts[i]],
            });
        }
    }
    /**
     * Load balance incoming requests to the given target groups.
     *
     * All target groups will be load balanced to with equal weight and without
     * stickiness. For a more complex configuration than that, use `addAction()`.
     */
    addTargetGroups(_id, ...targetGroups) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkTargetGroup(targetGroups);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargetGroups);
            }
            throw error;
        }
        this.setDefaultAction(network_listener_action_1.NetworkListenerAction.forward(targetGroups));
    }
    /**
     * Perform the given Action on incoming requests
     *
     * This allows full control of the default Action of the load balancer,
     * including weighted forwarding. See the `NetworkListenerAction` class for
     * all options.
     */
    addAction(_id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddNetworkActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAction);
            }
            throw error;
        }
        this.setDefaultAction(props.action);
    }
    /**
     * Load balance incoming requests to the given load balancing targets.
     *
     * This method implicitly creates a NetworkTargetGroup for the targets
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
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AddNetworkTargetsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargets);
            }
            throw error;
        }
        if (!this.loadBalancer.vpc) {
            // eslint-disable-next-line max-len
            throw new Error('Can only call addTargets() when using a constructed Load Balancer or imported Load Balancer with specified VPC; construct a new TargetGroup and use addTargetGroup');
        }
        const group = new network_target_group_1.NetworkTargetGroup(this, id + 'Group', {
            deregistrationDelay: props.deregistrationDelay,
            healthCheck: props.healthCheck,
            port: props.port,
            protocol: props.protocol ?? this.protocol,
            proxyProtocolV2: props.proxyProtocolV2,
            preserveClientIp: props.preserveClientIp,
            targetGroupName: props.targetGroupName,
            targets: props.targets,
            vpc: this.loadBalancer.vpc,
        });
        this.addTargetGroups(id, group);
        return group;
    }
    /**
     * Wrapper for _setDefaultAction which does a type-safe bind
     */
    setDefaultAction(action) {
        action.bind(this, this);
        this._setDefaultAction(action);
    }
}
exports.NetworkListener = NetworkListener;
_a = JSII_RTTI_SYMBOL_1;
NetworkListener[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.NetworkListener", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1saXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstbGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkRBQTJEO0FBQzNELHdDQUF5RDtBQUV6RCx1RUFBa0U7QUFDbEUsaUZBQTRFO0FBRTVFLGlFQUE2RztBQUM3RywyREFBNkY7QUFFN0YsMkNBQWtFO0FBRWxFLHlDQUF5RDtBQXFHekQ7Ozs7R0FJRztBQUNILE1BQWEsZUFBZ0IsU0FBUSw0QkFBWTtJQXdEL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjs7Ozs7OytDQXhEMUQsZUFBZTs7OztRQXlEeEIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7UUFDdkMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqRiw4QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQixJQUFJLEtBQUssS0FBSyxnQkFBUSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1NBQ25GO1FBRUQsSUFBSSxLQUFLLEtBQUssZ0JBQVEsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsSUFBSSxLQUFLLEtBQUssZ0JBQVEsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFD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QztLQUNkO0lBRUQ7O09BRUc7SUFDSyxnQkFBZ0IsQ0FBQyxNQUE2QjtRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7O0FBOUxILDBDQStMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgUmVzb3VyY2UsIExhenkgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTmV0d29ya0xpc3RlbmVyQWN0aW9uIH0gZnJvbSAnLi9uZXR3b3JrLWxpc3RlbmVyLWFjdGlvbic7XG5pbXBvcnQgeyBOZXR3b3JrTGlzdGVuZXJDZXJ0aWZpY2F0ZSB9IGZyb20gJy4vbmV0d29yay1saXN0ZW5lci1jZXJ0aWZpY2F0ZSc7XG5pbXBvcnQgeyBJTmV0d29ya0xvYWRCYWxhbmNlciB9IGZyb20gJy4vbmV0d29yay1sb2FkLWJhbGFuY2VyJztcbmltcG9ydCB7IElOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0LCBJTmV0d29ya1RhcmdldEdyb3VwLCBOZXR3b3JrVGFyZ2V0R3JvdXAgfSBmcm9tICcuL25ldHdvcmstdGFyZ2V0LWdyb3VwJztcbmltcG9ydCB7IEJhc2VMaXN0ZW5lciwgQmFzZUxpc3RlbmVyTG9va3VwT3B0aW9ucywgSUxpc3RlbmVyIH0gZnJvbSAnLi4vc2hhcmVkL2Jhc2UtbGlzdGVuZXInO1xuaW1wb3J0IHsgSGVhbHRoQ2hlY2sgfSBmcm9tICcuLi9zaGFyZWQvYmFzZS10YXJnZXQtZ3JvdXAnO1xuaW1wb3J0IHsgQWxwblBvbGljeSwgUHJvdG9jb2wsIFNzbFBvbGljeSB9IGZyb20gJy4uL3NoYXJlZC9lbnVtcyc7XG5pbXBvcnQgeyBJTGlzdGVuZXJDZXJ0aWZpY2F0ZSB9IGZyb20gJy4uL3NoYXJlZC9saXN0ZW5lci1jZXJ0aWZpY2F0ZSc7XG5pbXBvcnQgeyB2YWxpZGF0ZU5ldHdvcmtQcm90b2NvbCB9IGZyb20gJy4uL3NoYXJlZC91dGlsJztcblxuLyoqXG4gKiBCYXNpYyBwcm9wZXJ0aWVzIGZvciBhIE5ldHdvcmsgTGlzdGVuZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYXNlTmV0d29ya0xpc3RlbmVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIHBvcnQgb24gd2hpY2ggdGhlIGxpc3RlbmVyIGxpc3RlbnMgZm9yIHJlcXVlc3RzLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRhcmdldCBncm91cHMgdG8gbG9hZCBiYWxhbmNlIHRvXG4gICAqXG4gICAqIEFsbCB0YXJnZXQgZ3JvdXBzIHdpbGwgYmUgbG9hZCBiYWxhbmNlZCB0byB3aXRoIGVxdWFsIHdlaWdodCBhbmQgd2l0aG91dFxuICAgKiBzdGlja2luZXNzLiBGb3IgYSBtb3JlIGNvbXBsZXggY29uZmlndXJhdGlvbiB0aGFuIHRoYXQsIHVzZVxuICAgKiBlaXRoZXIgYGRlZmF1bHRBY3Rpb25gIG9yIGBhZGRBY3Rpb24oKWAuXG4gICAqXG4gICAqIENhbm5vdCBiZSBzcGVjaWZpZWQgdG9nZXRoZXIgd2l0aCBgZGVmYXVsdEFjdGlvbmAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRUYXJnZXRHcm91cHM/OiBJTmV0d29ya1RhcmdldEdyb3VwW107XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgYWN0aW9uIHRvIHRha2UgZm9yIHJlcXVlc3RzIHRvIHRoaXMgbGlzdGVuZXJcbiAgICpcbiAgICogVGhpcyBhbGxvd3MgZnVsbCBjb250cm9sIG9mIHRoZSBkZWZhdWx0IEFjdGlvbiBvZiB0aGUgbG9hZCBiYWxhbmNlcixcbiAgICogaW5jbHVkaW5nIHdlaWdodGVkIGZvcndhcmRpbmcuIFNlZSB0aGUgYE5ldHdvcmtMaXN0ZW5lckFjdGlvbmAgY2xhc3MgZm9yXG4gICAqIGFsbCBvcHRpb25zLlxuICAgKlxuICAgKiBDYW5ub3QgYmUgc3BlY2lmaWVkIHRvZ2V0aGVyIHdpdGggYGRlZmF1bHRUYXJnZXRHcm91cHNgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0QWN0aW9uPzogTmV0d29ya0xpc3RlbmVyQWN0aW9uO1xuXG4gIC8qKlxuICAgKiBQcm90b2NvbCBmb3IgbGlzdGVuZXIsIGV4cGVjdHMgVENQLCBUTFMsIFVEUCwgb3IgVENQX1VEUC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUTFMgaWYgY2VydGlmaWNhdGVzIGFyZSBwcm92aWRlZC4gVENQIG90aGVyd2lzZS5cbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIENlcnRpZmljYXRlIGxpc3Qgb2YgQUNNIGNlcnQgQVJOcy4gWW91IG11c3QgcHJvdmlkZSBleGFjdGx5IG9uZSBjZXJ0aWZpY2F0ZSBpZiB0aGUgbGlzdGVuZXIgcHJvdG9jb2wgaXMgSFRUUFMgb3IgVExTLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNlcnRpZmljYXRlcy5cbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlcz86IElMaXN0ZW5lckNlcnRpZmljYXRlW107XG5cbiAgLyoqXG4gICAqIFNTTCBQb2xpY3lcbiAgICpcbiAgICogQGRlZmF1bHQgLSBDdXJyZW50IHByZWRlZmluZWQgc2VjdXJpdHkgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgc3NsUG9saWN5PzogU3NsUG9saWN5O1xuXG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uLUxheWVyIFByb3RvY29sIE5lZ290aWF0aW9uIChBTFBOKSBpcyBhIFRMUyBleHRlbnNpb24gdGhhdCBpcyBzZW50IG9uIHRoZSBpbml0aWFsIFRMUyBoYW5kc2hha2UgaGVsbG8gbWVzc2FnZXMuXG4gICAqIEFMUE4gZW5hYmxlcyB0aGUgYXBwbGljYXRpb24gbGF5ZXIgdG8gbmVnb3RpYXRlIHdoaWNoIHByb3RvY29scyBzaG91bGQgYmUgdXNlZCBvdmVyIGEgc2VjdXJlIGNvbm5lY3Rpb24sIHN1Y2ggYXMgSFRUUC8xIGFuZCBIVFRQLzIuXG4gICAqXG4gICAqIENhbiBvbmx5IGJlIHNwZWNpZmllZCB0b2dldGhlciB3aXRoIFByb3RvY29sIFRMUy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBhbHBuUG9saWN5PzogQWxwblBvbGljeTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhZGRpbmcgYSBjZXJ0aWZpY2F0ZSB0byBhIGxpc3RlbmVyXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgSUxpc3RlbmVyQ2VydGlmaWNhdGUgaW5zdGVhZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrTGlzdGVuZXJDZXJ0aWZpY2F0ZVByb3BzIGV4dGVuZHMgSUxpc3RlbmVyQ2VydGlmaWNhdGUge1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTmV0d29yayBMaXN0ZW5lciBhdHRhY2hlZCB0byBhIExvYWQgQmFsYW5jZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrTGlzdGVuZXJQcm9wcyBleHRlbmRzIEJhc2VOZXR3b3JrTGlzdGVuZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbG9hZCBiYWxhbmNlciB0byBhdHRhY2ggdGhpcyBsaXN0ZW5lciB0b1xuICAgKi9cbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2VyOiBJTmV0d29ya0xvYWRCYWxhbmNlcjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBsb29raW5nIHVwIGEgbmV0d29yayBsaXN0ZW5lci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrTGlzdGVuZXJMb29rdXBPcHRpb25zIGV4dGVuZHMgQmFzZUxpc3RlbmVyTG9va3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBQcm90b2NvbCBvZiB0aGUgbGlzdGVuZXIgcG9ydFxuICAgKiBAZGVmYXVsdCAtIGxpc3RlbmVyIGlzIG5vdCBmaWx0ZXJlZCBieSBwcm90b2NvbFxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJQcm90b2NvbD86IFByb3RvY29sO1xufVxuXG4vKipcbiAqIERlZmluZSBhIE5ldHdvcmsgTGlzdGVuZXJcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0xpc3RlbmVyIGV4dGVuZHMgQmFzZUxpc3RlbmVyIGltcGxlbWVudHMgSU5ldHdvcmtMaXN0ZW5lciB7XG4gIC8qKlxuICAgKiBMb29rcyB1cCBhIG5ldHdvcmsgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBOZXR3b3JrTGlzdGVuZXJMb29rdXBPcHRpb25zKTogSU5ldHdvcmtMaXN0ZW5lciB7XG4gICAgbGV0IGxpc3RlbmVyUHJvdG9jb2w6IGN4c2NoZW1hLkxvYWRCYWxhbmNlckxpc3RlbmVyUHJvdG9jb2wgfCB1bmRlZmluZWQ7XG4gICAgaWYgKG9wdGlvbnMubGlzdGVuZXJQcm90b2NvbCkge1xuICAgICAgdmFsaWRhdGVOZXR3b3JrUHJvdG9jb2wob3B0aW9ucy5saXN0ZW5lclByb3RvY29sKTtcblxuICAgICAgc3dpdGNoIChvcHRpb25zLmxpc3RlbmVyUHJvdG9jb2wpIHtcbiAgICAgICAgY2FzZSBQcm90b2NvbC5UQ1A6IGxpc3RlbmVyUHJvdG9jb2wgPSBjeHNjaGVtYS5Mb2FkQmFsYW5jZXJMaXN0ZW5lclByb3RvY29sLlRDUDsgYnJlYWs7XG4gICAgICAgIGNhc2UgUHJvdG9jb2wuVURQOiBsaXN0ZW5lclByb3RvY29sID0gY3hzY2hlbWEuTG9hZEJhbGFuY2VyTGlzdGVuZXJQcm90b2NvbC5VRFA7IGJyZWFrO1xuICAgICAgICBjYXNlIFByb3RvY29sLlRDUF9VRFA6IGxpc3RlbmVyUHJvdG9jb2wgPSBjeHNjaGVtYS5Mb2FkQmFsYW5jZXJMaXN0ZW5lclByb3RvY29sLlRDUF9VRFA7IGJyZWFrO1xuICAgICAgICBjYXNlIFByb3RvY29sLlRMUzogbGlzdGVuZXJQcm90b2NvbCA9IGN4c2NoZW1hLkxvYWRCYWxhbmNlckxpc3RlbmVyUHJvdG9jb2wuVExTOyBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwcm9wcyA9IEJhc2VMaXN0ZW5lci5fcXVlcnlDb250ZXh0UHJvdmlkZXIoc2NvcGUsIHtcbiAgICAgIHVzZXJPcHRpb25zOiBvcHRpb25zLFxuICAgICAgbGlzdGVuZXJQcm90b2NvbDogbGlzdGVuZXJQcm90b2NvbCxcbiAgICAgIGxvYWRCYWxhbmNlclR5cGU6IGN4c2NoZW1hLkxvYWRCYWxhbmNlclR5cGUuTkVUV09SSyxcbiAgICB9KTtcblxuICAgIGNsYXNzIExvb2tlZFVwIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTmV0d29ya0xpc3RlbmVyIHtcbiAgICAgIHB1YmxpYyBsaXN0ZW5lckFybiA9IHByb3BzLmxpc3RlbmVyQXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTG9va2VkVXAoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5ldHdvcmtMaXN0ZW5lckFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBuZXR3b3JrTGlzdGVuZXJBcm46IHN0cmluZyk6IElOZXR3b3JrTGlzdGVuZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSU5ldHdvcmtMaXN0ZW5lciB7XG4gICAgICBwdWJsaWMgbGlzdGVuZXJBcm4gPSBuZXR3b3JrTGlzdGVuZXJBcm47XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbG9hZCBiYWxhbmNlciB0aGlzIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9hZEJhbGFuY2VyOiBJTmV0d29ya0xvYWRCYWxhbmNlcjtcblxuICAvKipcbiAgICogQVJOcyBvZiBjZXJ0aWZpY2F0ZXMgYWRkZWQgdG8gdGhpcyBsaXN0ZW5lclxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBjZXJ0aWZpY2F0ZUFybnM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiB0aGUgcHJvdG9jb2wgb2YgdGhlIGxpc3RlbmVyXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3RvY29sOiBQcm90b2NvbDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya0xpc3RlbmVyUHJvcHMpIHtcbiAgICBjb25zdCBjZXJ0cyA9IHByb3BzLmNlcnRpZmljYXRlcyB8fCBbXTtcbiAgICBjb25zdCBwcm90byA9IHByb3BzLnByb3RvY29sIHx8IChjZXJ0cy5sZW5ndGggPiAwID8gUHJvdG9jb2wuVExTIDogUHJvdG9jb2wuVENQKTtcblxuICAgIHZhbGlkYXRlTmV0d29ya1Byb3RvY29sKHByb3RvKTtcblxuICAgIGlmIChwcm90byA9PT0gUHJvdG9jb2wuVExTICYmIGNlcnRzLmZpbHRlcih2ID0+IHYgIT0gbnVsbCkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1doZW4gdGhlIHByb3RvY29sIGlzIHNldCB0byBUTFMsIHlvdSBtdXN0IHNwZWNpZnkgY2VydGlmaWNhdGVzJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3RvICE9PSBQcm90b2NvbC5UTFMgJiYgY2VydHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm90b2NvbCBtdXN0IGJlIFRMUyB3aGVuIGNlcnRpZmljYXRlcyBoYXZlIGJlZW4gc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3RvICE9PSBQcm90b2NvbC5UTFMgJiYgcHJvcHMuYWxwblBvbGljeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm90b2NvbCBtdXN0IGJlIFRMUyB3aGVuIGFscG5Qb2xpY3kgaGF2ZSBiZWVuIHNwZWNpZmllZCcpO1xuICAgIH1cblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgbG9hZEJhbGFuY2VyQXJuOiBwcm9wcy5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyQXJuLFxuICAgICAgcHJvdG9jb2w6IHByb3RvLFxuICAgICAgcG9ydDogcHJvcHMucG9ydCxcbiAgICAgIHNzbFBvbGljeTogcHJvcHMuc3NsUG9saWN5LFxuICAgICAgY2VydGlmaWNhdGVzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY2VydGlmaWNhdGVBcm5zLm1hcChjZXJ0aWZpY2F0ZUFybiA9PiAoeyBjZXJ0aWZpY2F0ZUFybiB9KSkgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIGFscG5Qb2xpY3k6IHByb3BzLmFscG5Qb2xpY3kgPyBbcHJvcHMuYWxwblBvbGljeV0gOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNlcnRpZmljYXRlQXJucyA9IFtdO1xuICAgIHRoaXMubG9hZEJhbGFuY2VyID0gcHJvcHMubG9hZEJhbGFuY2VyO1xuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90bztcblxuICAgIGlmIChjZXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmFkZENlcnRpZmljYXRlcygnRGVmYXVsdENlcnRpZmljYXRlcycsIGNlcnRzKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmRlZmF1bHRBY3Rpb24gJiYgcHJvcHMuZGVmYXVsdFRhcmdldEdyb3Vwcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZ5IGF0IG1vc3Qgb25lIG9mIFxcJ2RlZmF1bHRBY3Rpb25cXCcgYW5kIFxcJ2RlZmF1bHRUYXJnZXRHcm91cHNcXCcnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZGVmYXVsdEFjdGlvbikge1xuICAgICAgdGhpcy5zZXREZWZhdWx0QWN0aW9uKHByb3BzLmRlZmF1bHRBY3Rpb24pO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5kZWZhdWx0VGFyZ2V0R3JvdXBzKSB7XG4gICAgICB0aGlzLnNldERlZmF1bHRBY3Rpb24oTmV0d29ya0xpc3RlbmVyQWN0aW9uLmZvcndhcmQocHJvcHMuZGVmYXVsdFRhcmdldEdyb3VwcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb25lIG9yIG1vcmUgY2VydGlmaWNhdGVzIHRvIHRoaXMgbGlzdGVuZXIuXG4gICAqXG4gICAqIEFmdGVyIHRoZSBmaXJzdCBjZXJ0aWZpY2F0ZSwgdGhpcyBjcmVhdGVzIE5ldHdvcmtMaXN0ZW5lckNlcnRpZmljYXRlc1xuICAgKiByZXNvdXJjZXMgc2luY2UgY2xvdWRmb3JtYXRpb24gcmVxdWlyZXMgdGhlIGNlcnRpZmljYXRlcyBhcnJheSBvbiB0aGVcbiAgICogbGlzdGVuZXIgcmVzb3VyY2UgdG8gaGF2ZSBhIGxlbmd0aCBvZiAxLlxuICAgKi9cbiAgcHVibGljIGFkZENlcnRpZmljYXRlcyhpZDogc3RyaW5nLCBjZXJ0aWZpY2F0ZXM6IElMaXN0ZW5lckNlcnRpZmljYXRlW10pOiB2b2lkIHtcbiAgICBjb25zdCBhZGRpdGlvbmFsQ2VydHMgPSBbLi4uY2VydGlmaWNhdGVzXTtcbiAgICBpZiAodGhpcy5jZXJ0aWZpY2F0ZUFybnMubGVuZ3RoID09PSAwICYmIGFkZGl0aW9uYWxDZXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IGFkZGl0aW9uYWxDZXJ0cy5zcGxpY2UoMCwgMSlbMF07XG4gICAgICB0aGlzLmNlcnRpZmljYXRlQXJucy5wdXNoKGZpcnN0LmNlcnRpZmljYXRlQXJuKTtcbiAgICB9XG4gICAgLy8gT25seSBvbmUgY2VydGlmaWNhdGUgY2FuIGJlIHNwZWNpZmllZCBwZXIgcmVzb3VyY2UsIGV2ZW4gdGhvdWdoXG4gICAgLy8gYGNlcnRpZmljYXRlc2AgaXMgb2YgdHlwZSBBcnJheVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkaXRpb25hbENlcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBuZXcgTmV0d29ya0xpc3RlbmVyQ2VydGlmaWNhdGUodGhpcywgYCR7aWR9JHtpICsgMX1gLCB7XG4gICAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgICBjZXJ0aWZpY2F0ZXM6IFthZGRpdGlvbmFsQ2VydHNbaV1dLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYmFsYW5jZSBpbmNvbWluZyByZXF1ZXN0cyB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGdyb3Vwcy5cbiAgICpcbiAgICogQWxsIHRhcmdldCBncm91cHMgd2lsbCBiZSBsb2FkIGJhbGFuY2VkIHRvIHdpdGggZXF1YWwgd2VpZ2h0IGFuZCB3aXRob3V0XG4gICAqIHN0aWNraW5lc3MuIEZvciBhIG1vcmUgY29tcGxleCBjb25maWd1cmF0aW9uIHRoYW4gdGhhdCwgdXNlIGBhZGRBY3Rpb24oKWAuXG4gICAqL1xuICBwdWJsaWMgYWRkVGFyZ2V0R3JvdXBzKF9pZDogc3RyaW5nLCAuLi50YXJnZXRHcm91cHM6IElOZXR3b3JrVGFyZ2V0R3JvdXBbXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihOZXR3b3JrTGlzdGVuZXJBY3Rpb24uZm9yd2FyZCh0YXJnZXRHcm91cHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSBnaXZlbiBBY3Rpb24gb24gaW5jb21pbmcgcmVxdWVzdHNcbiAgICpcbiAgICogVGhpcyBhbGxvd3MgZnVsbCBjb250cm9sIG9mIHRoZSBkZWZhdWx0IEFjdGlvbiBvZiB0aGUgbG9hZCBiYWxhbmNlcixcbiAgICogaW5jbHVkaW5nIHdlaWdodGVkIGZvcndhcmRpbmcuIFNlZSB0aGUgYE5ldHdvcmtMaXN0ZW5lckFjdGlvbmAgY2xhc3MgZm9yXG4gICAqIGFsbCBvcHRpb25zLlxuICAgKi9cbiAgcHVibGljIGFkZEFjdGlvbihfaWQ6IHN0cmluZywgcHJvcHM6IEFkZE5ldHdvcmtBY3Rpb25Qcm9wcyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RGVmYXVsdEFjdGlvbihwcm9wcy5hY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYmFsYW5jZSBpbmNvbWluZyByZXF1ZXN0cyB0byB0aGUgZ2l2ZW4gbG9hZCBiYWxhbmNpbmcgdGFyZ2V0cy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaW1wbGljaXRseSBjcmVhdGVzIGEgTmV0d29ya1RhcmdldEdyb3VwIGZvciB0aGUgdGFyZ2V0c1xuICAgKiBpbnZvbHZlZCwgYW5kIGEgJ2ZvcndhcmQnIGFjdGlvbiB0byByb3V0ZSB0cmFmZmljIHRvIHRoZSBnaXZlbiBUYXJnZXRHcm91cC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgdGhlIHByZWNpc2Ugc2V0dXAsIGNyZWF0ZSB0aGUgVGFyZ2V0R3JvdXBcbiAgICogYW5kIHVzZSBgYWRkQWN0aW9uYCB5b3Vyc2VsZi5cbiAgICpcbiAgICogSXQncyBwb3NzaWJsZSB0byBhZGQgY29uZGl0aW9ucyB0byB0aGUgdGFyZ2V0cyBhZGRlZCBpbiB0aGlzIHdheS4gQXQgbGVhc3RcbiAgICogb25lIHNldCBvZiB0YXJnZXRzIG11c3QgYmUgYWRkZWQgd2l0aG91dCBjb25kaXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhZGRUYXJnZXRzKGlkOiBzdHJpbmcsIHByb3BzOiBBZGROZXR3b3JrVGFyZ2V0c1Byb3BzKTogTmV0d29ya1RhcmdldEdyb3VwIHtcbiAgICBpZiAoIXRoaXMubG9hZEJhbGFuY2VyLnZwYykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG9ubHkgY2FsbCBhZGRUYXJnZXRzKCkgd2hlbiB1c2luZyBhIGNvbnN0cnVjdGVkIExvYWQgQmFsYW5jZXIgb3IgaW1wb3J0ZWQgTG9hZCBCYWxhbmNlciB3aXRoIHNwZWNpZmllZCBWUEM7IGNvbnN0cnVjdCBhIG5ldyBUYXJnZXRHcm91cCBhbmQgdXNlIGFkZFRhcmdldEdyb3VwJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgTmV0d29ya1RhcmdldEdyb3VwKHRoaXMsIGlkICsgJ0dyb3VwJywge1xuICAgICAgZGVyZWdpc3RyYXRpb25EZWxheTogcHJvcHMuZGVyZWdpc3RyYXRpb25EZWxheSxcbiAgICAgIGhlYWx0aENoZWNrOiBwcm9wcy5oZWFsdGhDaGVjayxcbiAgICAgIHBvcnQ6IHByb3BzLnBvcnQsXG4gICAgICBwcm90b2NvbDogcHJvcHMucHJvdG9jb2wgPz8gdGhpcy5wcm90b2NvbCxcbiAgICAgIHByb3h5UHJvdG9jb2xWMjogcHJvcHMucHJveHlQcm90b2NvbFYyLFxuICAgICAgcHJlc2VydmVDbGllbnRJcDogcHJvcHMucHJlc2VydmVDbGllbnRJcCxcbiAgICAgIHRhcmdldEdyb3VwTmFtZTogcHJvcHMudGFyZ2V0R3JvdXBOYW1lLFxuICAgICAgdGFyZ2V0czogcHJvcHMudGFyZ2V0cyxcbiAgICAgIHZwYzogdGhpcy5sb2FkQmFsYW5jZXIudnBjLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRUYXJnZXRHcm91cHMoaWQsIGdyb3VwKTtcblxuICAgIHJldHVybiBncm91cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciBfc2V0RGVmYXVsdEFjdGlvbiB3aGljaCBkb2VzIGEgdHlwZS1zYWZlIGJpbmRcbiAgICovXG4gIHByaXZhdGUgc2V0RGVmYXVsdEFjdGlvbihhY3Rpb246IE5ldHdvcmtMaXN0ZW5lckFjdGlvbikge1xuICAgIGFjdGlvbi5iaW5kKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY3Rpb24oYWN0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gcmVmZXJlbmNlIGFuIGV4aXN0aW5nIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5ldHdvcmtMaXN0ZW5lciBleHRlbmRzIElMaXN0ZW5lciB7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgbmV3IGFjdGlvbiB0byBhIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkTmV0d29ya0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIEFjdGlvbiB0byBwZXJmb3JtXG4gICAqL1xuICByZWFkb25seSBhY3Rpb246IE5ldHdvcmtMaXN0ZW5lckFjdGlvbjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhZGRpbmcgbmV3IG5ldHdvcmsgdGFyZ2V0cyB0byBhIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkTmV0d29ya1RhcmdldHNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcG9ydCBvbiB3aGljaCB0aGUgbGlzdGVuZXIgbGlzdGVucyBmb3IgcmVxdWVzdHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IERldGVybWluZWQgZnJvbSBwcm90b2NvbCBpZiBrbm93blxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBQcm90b2NvbCBmb3IgdGFyZ2V0IGdyb3VwLCBleHBlY3RzIFRDUCwgVExTLCBVRFAsIG9yIFRDUF9VRFAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaW5oZXJpdHMgdGhlIHByb3RvY29sIG9mIHRoZSBsaXN0ZW5lclxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBQcm90b2NvbDtcblxuICAvKipcbiAgICogVGhlIHRhcmdldHMgdG8gYWRkIHRvIHRoaXMgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBDYW4gYmUgYEluc3RhbmNlYCwgYElQQWRkcmVzc2AsIG9yIGFueSBzZWxmLXJlZ2lzdGVyaW5nIGxvYWQgYmFsYW5jaW5nXG4gICAqIHRhcmdldC4gSWYgeW91IHVzZSBlaXRoZXIgYEluc3RhbmNlYCBvciBgSVBBZGRyZXNzYCBhcyB0YXJnZXRzLCBhbGxcbiAgICogdGFyZ2V0IG11c3QgYmUgb2YgdGhlIHNhbWUgdHlwZS5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldHM/OiBJTmV0d29ya0xvYWRCYWxhbmNlclRhcmdldFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IGdyb3VwLlxuICAgKlxuICAgKiBUaGlzIG5hbWUgbXVzdCBiZSB1bmlxdWUgcGVyIHJlZ2lvbiBwZXIgYWNjb3VudCwgY2FuIGhhdmUgYSBtYXhpbXVtIG9mXG4gICAqIDMyIGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIG9yIGh5cGhlbnMsIGFuZFxuICAgKiBtdXN0IG5vdCBiZWdpbiBvciBlbmQgd2l0aCBhIGh5cGhlbi5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldEdyb3VwTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiB0aW1lIGZvciBFbGFzdGljIExvYWQgQmFsYW5jaW5nIHRvIHdhaXQgYmVmb3JlIGRlcmVnaXN0ZXJpbmcgYSB0YXJnZXQuXG4gICAqXG4gICAqIFRoZSByYW5nZSBpcyAwLTM2MDAgc2Vjb25kcy5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgZGVyZWdpc3RyYXRpb25EZWxheT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBQcm94eSBQcm90b2NvbCB2ZXJzaW9uIDIgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByb3h5UHJvdG9jb2xWMj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGNsaWVudCBJUCBwcmVzZXJ2YXRpb24gaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2UgaWYgdGhlIHRhcmdldCBncm91cCB0eXBlIGlzIElQIGFkZHJlc3MgYW5kIHRoZVxuICAgKiB0YXJnZXQgZ3JvdXAgcHJvdG9jb2wgaXMgVENQIG9yIFRMUy4gT3RoZXJ3aXNlLCB0cnVlLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJlc2VydmVDbGllbnRJcD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEhlYWx0aCBjaGVjayBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggcHJvcGVydHkgaW4gdGhpcyBjb25maWd1cmF0aW9uIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlIHRhcmdldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi10YXJnZXRncm91cC5odG1sI2F3cy1yZXNvdXJjZS1lbGFzdGljbG9hZGJhbGFuY2luZ3YyLXRhcmdldGdyb3VwLXByb3BlcnRpZXNcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrPzogSGVhbHRoQ2hlY2s7XG59XG4iXX0=