"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckType = exports.RoutingPolicy = exports.DnsRecordType = exports.DiscoveryType = exports.Service = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const alias_target_instance_1 = require("./alias-target-instance");
const cname_instance_1 = require("./cname-instance");
const ip_instance_1 = require("./ip-instance");
const namespace_1 = require("./namespace");
const non_ip_instance_1 = require("./non-ip-instance");
const utils_1 = require("./private/utils");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
class ServiceBase extends core_1.Resource {
}
/**
 * Define a CloudMap Service
 */
class Service extends ServiceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_ServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Service);
            }
            throw error;
        }
        const namespaceType = props.namespace.type;
        const discoveryType = props.discoveryType || utils_1.defaultDiscoveryType(props.namespace);
        if (namespaceType == namespace_1.NamespaceType.HTTP && discoveryType == DiscoveryType.DNS_AND_API) {
            throw new Error('Cannot specify `discoveryType` of DNS_AND_API when using an HTTP namespace.');
        }
        // Validations
        if (discoveryType === DiscoveryType.API &&
            (props.routingPolicy || props.dnsRecordType)) {
            throw new Error('Cannot specify `routingPolicy` or `dnsRecord` when using an HTTP namespace.');
        }
        if (props.healthCheck && props.customHealthCheck) {
            throw new Error('Cannot specify both `healthCheckConfig` and `healthCheckCustomConfig`.');
        }
        if (namespaceType === namespace_1.NamespaceType.DNS_PRIVATE && props.healthCheck) {
            throw new Error('Cannot specify `healthCheckConfig` for a Private DNS namespace.');
        }
        if (props.routingPolicy === RoutingPolicy.MULTIVALUE
            && props.dnsRecordType === DnsRecordType.CNAME) {
            throw new Error('Cannot use `CNAME` record when routing policy is `Multivalue`.');
        }
        // Additional validation for eventual attachment of LBs
        // The same validation happens later on during the actual attachment
        // of LBs, but we need the property for the correct configuration of
        // routingPolicy anyway, so might as well do the validation as well.
        if (props.routingPolicy === RoutingPolicy.MULTIVALUE
            && props.loadBalancer) {
            throw new Error('Cannot register loadbalancers when routing policy is `Multivalue`.');
        }
        if (props.healthCheck
            && props.healthCheck.type === HealthCheckType.TCP
            && props.healthCheck.resourcePath) {
            throw new Error('Cannot specify `resourcePath` when using a `TCP` health check.');
        }
        // Set defaults where necessary
        const routingPolicy = (props.dnsRecordType === DnsRecordType.CNAME) || props.loadBalancer
            ? RoutingPolicy.WEIGHTED
            : RoutingPolicy.MULTIVALUE;
        const dnsRecordType = props.dnsRecordType || DnsRecordType.A;
        if (props.loadBalancer
            && (!(dnsRecordType === DnsRecordType.A
                || dnsRecordType === DnsRecordType.AAAA
                || dnsRecordType === DnsRecordType.A_AAAA))) {
            throw new Error('Must support `A` or `AAAA` records to register loadbalancers.');
        }
        const dnsConfig = discoveryType === DiscoveryType.API
            ? undefined
            : {
                dnsRecords: renderDnsRecords(dnsRecordType, props.dnsTtl),
                namespaceId: props.namespace.namespaceId,
                routingPolicy,
            };
        const healthCheckConfigDefaults = {
            type: HealthCheckType.HTTP,
            failureThreshold: 1,
            resourcePath: props.healthCheck && props.healthCheck.type !== HealthCheckType.TCP
                ? '/'
                : undefined,
        };
        const healthCheckConfig = props.healthCheck && { ...healthCheckConfigDefaults, ...props.healthCheck };
        const healthCheckCustomConfig = props.customHealthCheck;
        // Create service
        const service = new servicediscovery_generated_1.CfnService(this, 'Resource', {
            name: props.name,
            description: props.description,
            dnsConfig,
            healthCheckConfig,
            healthCheckCustomConfig,
            namespaceId: props.namespace.namespaceId,
            type: props.discoveryType == DiscoveryType.API ? 'HTTP' : undefined,
        });
        this.serviceName = service.attrName;
        this.serviceArn = service.attrArn;
        this.serviceId = service.attrId;
        this.namespace = props.namespace;
        this.dnsRecordType = dnsRecordType;
        this.routingPolicy = routingPolicy;
        this.discoveryType = discoveryType;
    }
    static fromServiceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_ServiceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromServiceAttributes);
            }
            throw error;
        }
        class Import extends ServiceBase {
            constructor() {
                super(...arguments);
                this.namespace = attrs.namespace;
                this.serviceId = attrs.serviceId;
                this.serviceArn = attrs.serviceArn;
                this.dnsRecordType = attrs.dnsRecordType;
                this.routingPolicy = attrs.routingPolicy;
                this.serviceName = attrs.serviceName;
                this.discoveryType = attrs.discoveryType || utils_1.defaultDiscoveryType(attrs.namespace);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Registers an ELB as a new instance with unique name instanceId in this service.
     */
    registerLoadBalancer(id, loadBalancer, customAttributes) {
        return new alias_target_instance_1.AliasTargetInstance(this, id, {
            service: this,
            dnsName: loadBalancer.loadBalancerDnsName,
            customAttributes,
        });
    }
    /**
     * Registers a resource that is accessible using values other than an IP address or a domain name (CNAME).
     */
    registerNonIpInstance(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_NonIpInstanceBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerNonIpInstance);
            }
            throw error;
        }
        return new non_ip_instance_1.NonIpInstance(this, id, {
            service: this,
            ...props,
        });
    }
    /**
     * Registers a resource that is accessible using an IP address.
     */
    registerIpInstance(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_IpInstanceBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerIpInstance);
            }
            throw error;
        }
        return new ip_instance_1.IpInstance(this, id, {
            service: this,
            ...props,
        });
    }
    /**
     * Registers a resource that is accessible using a CNAME.
     */
    registerCnameInstance(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_CnameInstanceBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerCnameInstance);
            }
            throw error;
        }
        return new cname_instance_1.CnameInstance(this, id, {
            service: this,
            ...props,
        });
    }
}
exports.Service = Service;
_a = JSII_RTTI_SYMBOL_1;
Service[_a] = { fqn: "@aws-cdk/aws-servicediscovery.Service", version: "0.0.0" };
function renderDnsRecords(dnsRecordType, dnsTtl = core_1.Duration.minutes(1)) {
    const ttl = dnsTtl.toSeconds();
    if (dnsRecordType === DnsRecordType.A_AAAA) {
        return [{
                type: DnsRecordType.A,
                ttl,
            }, {
                type: DnsRecordType.AAAA,
                ttl,
            }];
    }
    else {
        return [{ type: dnsRecordType, ttl }];
    }
}
/**
 * Specifies information about the discovery type of a service
 */
var DiscoveryType;
(function (DiscoveryType) {
    /**
     * Instances are discoverable via API only
     */
    DiscoveryType["API"] = "API";
    /**
     * Instances are discoverable via DNS or API
     */
    DiscoveryType["DNS_AND_API"] = "DNS_AND_API";
})(DiscoveryType = exports.DiscoveryType || (exports.DiscoveryType = {}));
var DnsRecordType;
(function (DnsRecordType) {
    /**
     * An A record
     */
    DnsRecordType["A"] = "A";
    /**
     * An AAAA record
     */
    DnsRecordType["AAAA"] = "AAAA";
    /**
     * Both an A and AAAA record
     */
    DnsRecordType["A_AAAA"] = "A, AAAA";
    /**
     * A Srv record
     */
    DnsRecordType["SRV"] = "SRV";
    /**
     * A CNAME record
     */
    DnsRecordType["CNAME"] = "CNAME";
})(DnsRecordType = exports.DnsRecordType || (exports.DnsRecordType = {}));
var RoutingPolicy;
(function (RoutingPolicy) {
    /**
     * Route 53 returns the applicable value from one randomly selected instance from among the instances that you
     * registered using the same service.
     */
    RoutingPolicy["WEIGHTED"] = "WEIGHTED";
    /**
     * If you define a health check for the service and the health check is healthy, Route 53 returns the applicable value
     * for up to eight instances.
     */
    RoutingPolicy["MULTIVALUE"] = "MULTIVALUE";
})(RoutingPolicy = exports.RoutingPolicy || (exports.RoutingPolicy = {}));
var HealthCheckType;
(function (HealthCheckType) {
    /**
     * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP
     * status code of 200 or greater and less than 400.
     */
    HealthCheckType["HTTP"] = "HTTP";
    /**
     * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an
     * HTTP status code of 200 or greater and less than 400.  If you specify HTTPS for the value of Type, the endpoint
     * must support TLS v1.0 or later.
     */
    HealthCheckType["HTTPS"] = "HTTPS";
    /**
     * Route 53 tries to establish a TCP connection.
     * If you specify TCP for Type, don't specify a value for ResourcePath.
     */
    HealthCheckType["TCP"] = "TCP";
})(HealthCheckType = exports.HealthCheckType || (exports.HealthCheckType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQThEO0FBRTlELG1FQUE4RDtBQUM5RCxxREFBeUU7QUFFekUsK0NBQWdFO0FBQ2hFLDJDQUF3RDtBQUN4RCx1REFBMEU7QUFDMUUsMkNBQXVEO0FBQ3ZELDZFQUEwRDtBQXNJMUQsTUFBZSxXQUFZLFNBQVEsZUFBUTtDQVExQztBQVlEOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsV0FBVztJQW1EdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBcERSLE9BQU87Ozs7UUFzRGhCLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzNDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksNEJBQW9CLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5GLElBQUksYUFBYSxJQUFJLHlCQUFhLENBQUMsSUFBSSxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFO1lBQ3JGLE1BQU0sSUFBSSxLQUFLLENBQ2IsNkVBQTZFLENBQzlFLENBQUM7U0FDSDtRQUVELGNBQWM7UUFDZCxJQUNFLGFBQWEsS0FBSyxhQUFhLENBQUMsR0FBRztZQUNuQyxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUM1QztZQUNBLE1BQU0sSUFBSSxLQUFLLENBQ2IsNkVBQTZFLENBQzlFLENBQUM7U0FDSDtRQUVELElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO1NBQzNGO1FBRUQsSUFBSSxhQUFhLEtBQUsseUJB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QyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUN2QztBQUNILENBQUM7QUE0Q0Q7O0dBRUc7QUFDSCxJQUFZLGFBU1g7QUFURCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBQ1g7O09BRUc7SUFDSCw0Q0FBMkIsQ0FBQTtBQUM3QixDQUFDLEVBVFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFTeEI7QUFFRCxJQUFZLGFBeUJYO0FBekJELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILHdCQUFPLENBQUE7SUFFUDs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILG1DQUFrQixDQUFBO0lBRWxCOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsZ0NBQWUsQ0FBQTtBQUNqQixDQUFDLEVBekJXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBeUJ4QjtBQUVELElBQVksYUFZWDtBQVpELFdBQVksYUFBYTtJQUN2Qjs7O09BR0c7SUFDSCxzQ0FBcUIsQ0FBQTtJQUVyQjs7O09BR0c7SUFDSCwwQ0FBeUIsQ0FBQTtBQUMzQixDQUFDLEVBWlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFZeEI7QUFFRCxJQUFZLGVBbUJYO0FBbkJELFdBQVksZUFBZTtJQUN6Qjs7O09BR0c7SUFDSCxnQ0FBYSxDQUFBO0lBRWI7Ozs7T0FJRztJQUNILGtDQUFlLENBQUE7SUFFZjs7O09BR0c7SUFDSCw4QkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQW5CVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQW1CMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBEdXJhdGlvbiwgSVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbGlhc1RhcmdldEluc3RhbmNlIH0gZnJvbSAnLi9hbGlhcy10YXJnZXQtaW5zdGFuY2UnO1xuaW1wb3J0IHsgQ25hbWVJbnN0YW5jZSwgQ25hbWVJbnN0YW5jZUJhc2VQcm9wcyB9IGZyb20gJy4vY25hbWUtaW5zdGFuY2UnO1xuaW1wb3J0IHsgSUluc3RhbmNlIH0gZnJvbSAnLi9pbnN0YW5jZSc7XG5pbXBvcnQgeyBJcEluc3RhbmNlLCBJcEluc3RhbmNlQmFzZVByb3BzIH0gZnJvbSAnLi9pcC1pbnN0YW5jZSc7XG5pbXBvcnQgeyBJTmFtZXNwYWNlLCBOYW1lc3BhY2VUeXBlIH0gZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHsgTm9uSXBJbnN0YW5jZSwgTm9uSXBJbnN0YW5jZUJhc2VQcm9wcyB9IGZyb20gJy4vbm9uLWlwLWluc3RhbmNlJztcbmltcG9ydCB7IGRlZmF1bHREaXNjb3ZlcnlUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3V0aWxzJztcbmltcG9ydCB7IENmblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VkaXNjb3ZlcnkuZ2VuZXJhdGVkJztcblxuZXhwb3J0IGludGVyZmFjZSBJU2VydmljZSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBDbG91ZG1hcCBTZXJ2aWNlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiAgVGhlIG5hbWVzcGFjZSBmb3IgdGhlIENsb3VkbWFwIFNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2U6IElOYW1lc3BhY2U7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgbmFtZXNwYWNlIHRoYXQgeW91IHdhbnQgdG8gdXNlIGZvciBETlMgY29uZmlndXJhdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBcm4gb2YgdGhlIG5hbWVzcGFjZSB0aGF0IHlvdSB3YW50IHRvIHVzZSBmb3IgRE5TIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIERuc1JlY29yZFR5cGUgdXNlZCBieSB0aGUgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgZG5zUmVjb3JkVHlwZTogRG5zUmVjb3JkVHlwZTtcblxuICAvKipcbiAgICogVGhlIFJvdXRpbmcgUG9saWN5IHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IHJvdXRpbmdQb2xpY3k6IFJvdXRpbmdQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXNjb3ZlcnkgdHlwZSB1c2VkIGJ5IHRoZSBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBkaXNjb3ZlcnlUeXBlOiBEaXNjb3ZlcnlUeXBlO1xufVxuXG4vKipcbiAqIEJhc2ljIHByb3BzIG5lZWRlZCB0byBjcmVhdGUgYSBzZXJ2aWNlIGluIGEgZ2l2ZW4gbmFtZXNwYWNlLiBVc2VkIGJ5IEh0dHBOYW1lc3BhY2UuY3JlYXRlU2VydmljZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VTZXJ2aWNlUHJvcHMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgU2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgQ2xvdWRGb3JtYXRpb24tZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXR0aW5ncyBmb3IgYW4gb3B0aW9uYWwgaGVhbHRoIGNoZWNrLiAgSWYgeW91IHNwZWNpZnkgaGVhbHRoIGNoZWNrIHNldHRpbmdzLCBBV1MgQ2xvdWQgTWFwIGFzc29jaWF0ZXMgdGhlIGhlYWx0aFxuICAgKiBjaGVjayB3aXRoIHRoZSByZWNvcmRzIHRoYXQgeW91IHNwZWNpZnkgaW4gRG5zQ29uZmlnLiBPbmx5IG9uZSBvZiBoZWFsdGhDaGVja0NvbmZpZyBvciBoZWFsdGhDaGVja0N1c3RvbUNvbmZpZyBjYW5cbiAgICogYmUgc3BlY2lmaWVkLiBOb3QgdmFsaWQgZm9yIFByaXZhdGVEbnNOYW1lc3BhY2VzLiBJZiB5b3UgdXNlIGhlYWx0aENoZWNrLCB5b3UgY2FuIG9ubHkgcmVnaXN0ZXIgSVAgaW5zdGFuY2VzIHRvXG4gICAqIHRoaXMgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2s/OiBIZWFsdGhDaGVja0NvbmZpZztcblxuICAvKipcbiAgICogU3RydWN0dXJlIGNvbnRhaW5pbmcgZmFpbHVyZSB0aHJlc2hvbGQgZm9yIGEgY3VzdG9tIGhlYWx0aCBjaGVja2VyLlxuICAgKiBPbmx5IG9uZSBvZiBoZWFsdGhDaGVja0NvbmZpZyBvciBoZWFsdGhDaGVja0N1c3RvbUNvbmZpZyBjYW4gYmUgc3BlY2lmaWVkLlxuICAgKiBTZWU6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jbG91ZC1tYXAvbGF0ZXN0L2FwaS9BUElfSGVhbHRoQ2hlY2tDdXN0b21Db25maWcuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBjdXN0b21IZWFsdGhDaGVjaz86IEhlYWx0aENoZWNrQ3VzdG9tQ29uZmlnO1xufVxuXG4vKipcbiAqIFNlcnZpY2UgcHJvcHMgbmVlZGVkIHRvIGNyZWF0ZSBhIHNlcnZpY2UgaW4gYSBnaXZlbiBuYW1lc3BhY2UuIFVzZWQgYnkgY3JlYXRlU2VydmljZSgpIGZvciBQcml2YXRlRG5zTmFtZXNwYWNlIGFuZFxuICogUHVibGljRG5zTmFtZXNwYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG5zU2VydmljZVByb3BzIGV4dGVuZHMgQmFzZVNlcnZpY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBDb250cm9scyBob3cgaW5zdGFuY2VzIHdpdGhpbiB0aGlzIHNlcnZpY2UgY2FuIGJlIGRpc2NvdmVyZWRcbiAgICpcbiAgICogQGRlZmF1bHQgRE5TX0FORF9BUElcbiAgICovXG4gIHJlYWRvbmx5IGRpc2NvdmVyeVR5cGU/OiBEaXNjb3ZlcnlUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgRE5TIHR5cGUgb2YgdGhlIHJlY29yZCB0aGF0IHlvdSB3YW50IEFXUyBDbG91ZCBNYXAgdG8gY3JlYXRlLiBTdXBwb3J0ZWQgcmVjb3JkIHR5cGVzXG4gICAqIGluY2x1ZGUgQSwgQUFBQSwgQSBhbmQgQUFBQSAoQV9BQUFBKSwgQ05BTUUsIGFuZCBTUlYuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFcbiAgICovXG4gIHJlYWRvbmx5IGRuc1JlY29yZFR5cGU/OiBEbnNSZWNvcmRUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHRpbWUsIGluIHNlY29uZHMsIHRoYXQgeW91IHdhbnQgRE5TIHJlc29sdmVycyB0byBjYWNoZSB0aGUgc2V0dGluZ3MgZm9yIHRoaXNcbiAgICogcmVjb3JkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDEpXG4gICAqL1xuICByZWFkb25seSBkbnNUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHJvdXRpbmcgcG9saWN5IHRoYXQgeW91IHdhbnQgdG8gYXBwbHkgdG8gYWxsIEROUyByZWNvcmRzIHRoYXQgQVdTIENsb3VkIE1hcCBjcmVhdGVzIHdoZW4geW91XG4gICAqIHJlZ2lzdGVyIGFuIGluc3RhbmNlIGFuZCBzcGVjaWZ5IHRoaXMgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgV0VJR0hURUQgZm9yIENOQU1FIHJlY29yZHMgYW5kIHdoZW4gbG9hZEJhbGFuY2VyIGlzIHRydWUsIE1VTFRJVkFMVUUgb3RoZXJ3aXNlXG4gICAqL1xuICByZWFkb25seSByb3V0aW5nUG9saWN5PzogUm91dGluZ1BvbGljeTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhpcyBzZXJ2aWNlIHdpbGwgaGF2ZSBhbiBFbGFzdGljIExvYWRCYWxhbmNlciByZWdpc3RlcmVkIHRvIGl0IGFzIGFuIEFsaWFzVGFyZ2V0SW5zdGFuY2UuXG4gICAqXG4gICAqIFNldHRpbmcgdGhpcyB0byBgdHJ1ZWAgY29ycmVjdGx5IGNvbmZpZ3VyZXMgdGhlIGByb3V0aW5nUG9saWN5YFxuICAgKiBhbmQgcGVyZm9ybXMgc29tZSBhZGRpdGlvbmFsIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBsb2FkQmFsYW5jZXI/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VQcm9wcyBleHRlbmRzIERuc1NlcnZpY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZXNwYWNlIHRoYXQgeW91IHdhbnQgdG8gdXNlIGZvciBETlMgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzcGFjZTogSU5hbWVzcGFjZTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgU2VydmljZUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTZXJ2aWNlIHtcbiAgcHVibGljIGFic3RyYWN0IG5hbWVzcGFjZTogSU5hbWVzcGFjZTtcbiAgcHVibGljIGFic3RyYWN0IHNlcnZpY2VJZDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3Qgc2VydmljZUFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgZG5zUmVjb3JkVHlwZTogRG5zUmVjb3JkVHlwZTtcbiAgcHVibGljIGFic3RyYWN0IHJvdXRpbmdQb2xpY3k6IFJvdXRpbmdQb2xpY3k7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgZGlzY292ZXJ5VHlwZTogRGlzY292ZXJ5VHlwZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlQXR0cmlidXRlcyB7XG4gIHJlYWRvbmx5IG5hbWVzcGFjZTogSU5hbWVzcGFjZTtcbiAgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2VydmljZUlkOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlcnZpY2VBcm46IHN0cmluZztcbiAgcmVhZG9ubHkgZG5zUmVjb3JkVHlwZTogRG5zUmVjb3JkVHlwZTtcbiAgcmVhZG9ubHkgcm91dGluZ1BvbGljeTogUm91dGluZ1BvbGljeTtcbiAgcmVhZG9ubHkgZGlzY292ZXJ5VHlwZT86IERpc2NvdmVyeVR5cGU7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgQ2xvdWRNYXAgU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIFNlcnZpY2VCYXNlIHtcblxuICBwdWJsaWMgc3RhdGljIGZyb21TZXJ2aWNlQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogU2VydmljZUF0dHJpYnV0ZXMpOiBJU2VydmljZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgU2VydmljZUJhc2Uge1xuICAgICAgcHVibGljIG5hbWVzcGFjZTogSU5hbWVzcGFjZSA9IGF0dHJzLm5hbWVzcGFjZTtcbiAgICAgIHB1YmxpYyBzZXJ2aWNlSWQgPSBhdHRycy5zZXJ2aWNlSWQ7XG4gICAgICBwdWJsaWMgc2VydmljZUFybiA9IGF0dHJzLnNlcnZpY2VBcm47XG4gICAgICBwdWJsaWMgZG5zUmVjb3JkVHlwZSA9IGF0dHJzLmRuc1JlY29yZFR5cGU7XG4gICAgICBwdWJsaWMgcm91dGluZ1BvbGljeSA9IGF0dHJzLnJvdXRpbmdQb2xpY3k7XG4gICAgICBwdWJsaWMgc2VydmljZU5hbWUgPSBhdHRycy5zZXJ2aWNlTmFtZTtcbiAgICAgIHB1YmxpYyBkaXNjb3ZlcnlUeXBlID0gYXR0cnMuZGlzY292ZXJ5VHlwZSB8fCBkZWZhdWx0RGlzY292ZXJ5VHlwZShhdHRycy5uYW1lc3BhY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgQ2xvdWRtYXAgU2VydmljZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiAgVGhlIG5hbWVzcGFjZSBmb3IgdGhlIENsb3VkbWFwIFNlcnZpY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlOiBJTmFtZXNwYWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIG5hbWVzcGFjZSB0aGF0IHlvdSB3YW50IHRvIHVzZSBmb3IgRE5TIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBcm4gb2YgdGhlIG5hbWVzcGFjZSB0aGF0IHlvdSB3YW50IHRvIHVzZSBmb3IgRE5TIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRG5zUmVjb3JkVHlwZSB1c2VkIGJ5IHRoZSBzZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG5zUmVjb3JkVHlwZTogRG5zUmVjb3JkVHlwZTtcblxuICAvKipcbiAgICogVGhlIFJvdXRpbmcgUG9saWN5IHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb3V0aW5nUG9saWN5OiBSb3V0aW5nUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUaGUgZGlzY292ZXJ5IHR5cGUgdXNlZCBieSB0aGlzIHNlcnZpY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGlzY292ZXJ5VHlwZTogRGlzY292ZXJ5VHlwZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2VydmljZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZVR5cGUgPSBwcm9wcy5uYW1lc3BhY2UudHlwZTtcbiAgICBjb25zdCBkaXNjb3ZlcnlUeXBlID0gcHJvcHMuZGlzY292ZXJ5VHlwZSB8fCBkZWZhdWx0RGlzY292ZXJ5VHlwZShwcm9wcy5uYW1lc3BhY2UpO1xuXG4gICAgaWYgKG5hbWVzcGFjZVR5cGUgPT0gTmFtZXNwYWNlVHlwZS5IVFRQICYmIGRpc2NvdmVyeVR5cGUgPT0gRGlzY292ZXJ5VHlwZS5ETlNfQU5EX0FQSSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IHNwZWNpZnkgYGRpc2NvdmVyeVR5cGVgIG9mIEROU19BTkRfQVBJIHdoZW4gdXNpbmcgYW4gSFRUUCBuYW1lc3BhY2UuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVmFsaWRhdGlvbnNcbiAgICBpZiAoXG4gICAgICBkaXNjb3ZlcnlUeXBlID09PSBEaXNjb3ZlcnlUeXBlLkFQSSAmJlxuICAgICAgKHByb3BzLnJvdXRpbmdQb2xpY3kgfHwgcHJvcHMuZG5zUmVjb3JkVHlwZSlcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzcGVjaWZ5IGByb3V0aW5nUG9saWN5YCBvciBgZG5zUmVjb3JkYCB3aGVuIHVzaW5nIGFuIEhUVFAgbmFtZXNwYWNlLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5oZWFsdGhDaGVjayAmJiBwcm9wcy5jdXN0b21IZWFsdGhDaGVjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBib3RoIGBoZWFsdGhDaGVja0NvbmZpZ2AgYW5kIGBoZWFsdGhDaGVja0N1c3RvbUNvbmZpZ2AuJyk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZVR5cGUgPT09IE5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUgJiYgcHJvcHMuaGVhbHRoQ2hlY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgYGhlYWx0aENoZWNrQ29uZmlnYCBmb3IgYSBQcml2YXRlIEROUyBuYW1lc3BhY2UuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnJvdXRpbmdQb2xpY3kgPT09IFJvdXRpbmdQb2xpY3kuTVVMVElWQUxVRVxuICAgICAgICAmJiBwcm9wcy5kbnNSZWNvcmRUeXBlID09PSBEbnNSZWNvcmRUeXBlLkNOQU1FKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYENOQU1FYCByZWNvcmQgd2hlbiByb3V0aW5nIHBvbGljeSBpcyBgTXVsdGl2YWx1ZWAuJyk7XG4gICAgfVxuXG4gICAgLy8gQWRkaXRpb25hbCB2YWxpZGF0aW9uIGZvciBldmVudHVhbCBhdHRhY2htZW50IG9mIExCc1xuICAgIC8vIFRoZSBzYW1lIHZhbGlkYXRpb24gaGFwcGVucyBsYXRlciBvbiBkdXJpbmcgdGhlIGFjdHVhbCBhdHRhY2htZW50XG4gICAgLy8gb2YgTEJzLCBidXQgd2UgbmVlZCB0aGUgcHJvcGVydHkgZm9yIHRoZSBjb3JyZWN0IGNvbmZpZ3VyYXRpb24gb2ZcbiAgICAvLyByb3V0aW5nUG9saWN5IGFueXdheSwgc28gbWlnaHQgYXMgd2VsbCBkbyB0aGUgdmFsaWRhdGlvbiBhcyB3ZWxsLlxuICAgIGlmIChwcm9wcy5yb3V0aW5nUG9saWN5ID09PSBSb3V0aW5nUG9saWN5Lk1VTFRJVkFMVUVcbiAgICAgICAgJiYgcHJvcHMubG9hZEJhbGFuY2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZWdpc3RlciBsb2FkYmFsYW5jZXJzIHdoZW4gcm91dGluZyBwb2xpY3kgaXMgYE11bHRpdmFsdWVgLicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5oZWFsdGhDaGVja1xuICAgICAgICAmJiBwcm9wcy5oZWFsdGhDaGVjay50eXBlID09PSBIZWFsdGhDaGVja1R5cGUuVENQXG4gICAgICAgICYmIHByb3BzLmhlYWx0aENoZWNrLnJlc291cmNlUGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBgcmVzb3VyY2VQYXRoYCB3aGVuIHVzaW5nIGEgYFRDUGAgaGVhbHRoIGNoZWNrLicpO1xuICAgIH1cblxuICAgIC8vIFNldCBkZWZhdWx0cyB3aGVyZSBuZWNlc3NhcnlcbiAgICBjb25zdCByb3V0aW5nUG9saWN5ID0gKHByb3BzLmRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQ05BTUUpIHx8IHByb3BzLmxvYWRCYWxhbmNlclxuICAgICAgPyBSb3V0aW5nUG9saWN5LldFSUdIVEVEXG4gICAgICA6IFJvdXRpbmdQb2xpY3kuTVVMVElWQUxVRTtcblxuICAgIGNvbnN0IGRuc1JlY29yZFR5cGUgPSBwcm9wcy5kbnNSZWNvcmRUeXBlIHx8IERuc1JlY29yZFR5cGUuQTtcblxuICAgIGlmIChwcm9wcy5sb2FkQmFsYW5jZXJcbiAgICAgICYmICghKGRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQVxuICAgICAgICB8fCBkbnNSZWNvcmRUeXBlID09PSBEbnNSZWNvcmRUeXBlLkFBQUFcbiAgICAgICAgfHwgZG5zUmVjb3JkVHlwZSA9PT0gRG5zUmVjb3JkVHlwZS5BX0FBQUEpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN1cHBvcnQgYEFgIG9yIGBBQUFBYCByZWNvcmRzIHRvIHJlZ2lzdGVyIGxvYWRiYWxhbmNlcnMuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZG5zQ29uZmlnOiBDZm5TZXJ2aWNlLkRuc0NvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkID1cbiAgICAgIGRpc2NvdmVyeVR5cGUgPT09IERpc2NvdmVyeVR5cGUuQVBJXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDoge1xuICAgICAgICAgIGRuc1JlY29yZHM6IHJlbmRlckRuc1JlY29yZHMoZG5zUmVjb3JkVHlwZSwgcHJvcHMuZG5zVHRsKSxcbiAgICAgICAgICBuYW1lc3BhY2VJZDogcHJvcHMubmFtZXNwYWNlLm5hbWVzcGFjZUlkLFxuICAgICAgICAgIHJvdXRpbmdQb2xpY3ksXG4gICAgICAgIH07XG5cbiAgICBjb25zdCBoZWFsdGhDaGVja0NvbmZpZ0RlZmF1bHRzID0ge1xuICAgICAgdHlwZTogSGVhbHRoQ2hlY2tUeXBlLkhUVFAsXG4gICAgICBmYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgcmVzb3VyY2VQYXRoOiBwcm9wcy5oZWFsdGhDaGVjayAmJiBwcm9wcy5oZWFsdGhDaGVjay50eXBlICE9PSBIZWFsdGhDaGVja1R5cGUuVENQXG4gICAgICAgID8gJy8nXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICBjb25zdCBoZWFsdGhDaGVja0NvbmZpZyA9IHByb3BzLmhlYWx0aENoZWNrICYmIHsgLi4uaGVhbHRoQ2hlY2tDb25maWdEZWZhdWx0cywgLi4ucHJvcHMuaGVhbHRoQ2hlY2sgfTtcbiAgICBjb25zdCBoZWFsdGhDaGVja0N1c3RvbUNvbmZpZyA9IHByb3BzLmN1c3RvbUhlYWx0aENoZWNrO1xuXG4gICAgLy8gQ3JlYXRlIHNlcnZpY2VcbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IENmblNlcnZpY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIGRuc0NvbmZpZyxcbiAgICAgIGhlYWx0aENoZWNrQ29uZmlnLFxuICAgICAgaGVhbHRoQ2hlY2tDdXN0b21Db25maWcsXG4gICAgICBuYW1lc3BhY2VJZDogcHJvcHMubmFtZXNwYWNlLm5hbWVzcGFjZUlkLFxuICAgICAgdHlwZTogcHJvcHMuZGlzY292ZXJ5VHlwZSA9PSBEaXNjb3ZlcnlUeXBlLkFQSSA/ICdIVFRQJyA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlLmF0dHJOYW1lO1xuICAgIHRoaXMuc2VydmljZUFybiA9IHNlcnZpY2UuYXR0ckFybjtcbiAgICB0aGlzLnNlcnZpY2VJZCA9IHNlcnZpY2UuYXR0cklkO1xuICAgIHRoaXMubmFtZXNwYWNlID0gcHJvcHMubmFtZXNwYWNlO1xuICAgIHRoaXMuZG5zUmVjb3JkVHlwZSA9IGRuc1JlY29yZFR5cGU7XG4gICAgdGhpcy5yb3V0aW5nUG9saWN5ID0gcm91dGluZ1BvbGljeTtcbiAgICB0aGlzLmRpc2NvdmVyeVR5cGUgPSBkaXNjb3ZlcnlUeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBFTEIgYXMgYSBuZXcgaW5zdGFuY2Ugd2l0aCB1bmlxdWUgbmFtZSBpbnN0YW5jZUlkIGluIHRoaXMgc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckxvYWRCYWxhbmNlcihpZDogc3RyaW5nLCBsb2FkQmFsYW5jZXI6IGVsYnYyLklMb2FkQmFsYW5jZXJWMiwgY3VzdG9tQXR0cmlidXRlcz86IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogSUluc3RhbmNlIHtcbiAgICByZXR1cm4gbmV3IEFsaWFzVGFyZ2V0SW5zdGFuY2UodGhpcywgaWQsIHtcbiAgICAgIHNlcnZpY2U6IHRoaXMsXG4gICAgICBkbnNOYW1lOiBsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyRG5zTmFtZSxcbiAgICAgIGN1c3RvbUF0dHJpYnV0ZXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcmVzb3VyY2UgdGhhdCBpcyBhY2Nlc3NpYmxlIHVzaW5nIHZhbHVlcyBvdGhlciB0aGFuIGFuIElQIGFkZHJlc3Mgb3IgYSBkb21haW4gbmFtZSAoQ05BTUUpLlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyTm9uSXBJbnN0YW5jZShpZDogc3RyaW5nLCBwcm9wczogTm9uSXBJbnN0YW5jZUJhc2VQcm9wcyk6IElJbnN0YW5jZSB7XG4gICAgcmV0dXJuIG5ldyBOb25JcEluc3RhbmNlKHRoaXMsIGlkLCB7XG4gICAgICBzZXJ2aWNlOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcmVzb3VyY2UgdGhhdCBpcyBhY2Nlc3NpYmxlIHVzaW5nIGFuIElQIGFkZHJlc3MuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJJcEluc3RhbmNlKGlkOiBzdHJpbmcsIHByb3BzOiBJcEluc3RhbmNlQmFzZVByb3BzKTogSUluc3RhbmNlIHtcbiAgICByZXR1cm4gbmV3IElwSW5zdGFuY2UodGhpcywgaWQsIHtcbiAgICAgIHNlcnZpY2U6IHRoaXMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSByZXNvdXJjZSB0aGF0IGlzIGFjY2Vzc2libGUgdXNpbmcgYSBDTkFNRS5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckNuYW1lSW5zdGFuY2UoaWQ6IHN0cmluZywgcHJvcHM6IENuYW1lSW5zdGFuY2VCYXNlUHJvcHMpOiBJSW5zdGFuY2Uge1xuICAgIHJldHVybiBuZXcgQ25hbWVJbnN0YW5jZSh0aGlzLCBpZCwge1xuICAgICAgc2VydmljZTogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckRuc1JlY29yZHMoZG5zUmVjb3JkVHlwZTogRG5zUmVjb3JkVHlwZSwgZG5zVHRsOiBEdXJhdGlvbiA9IER1cmF0aW9uLm1pbnV0ZXMoMSkpOiBDZm5TZXJ2aWNlLkRuc1JlY29yZFByb3BlcnR5W10ge1xuICBjb25zdCB0dGwgPSBkbnNUdGwudG9TZWNvbmRzKCk7XG5cbiAgaWYgKGRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQV9BQUFBKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiBEbnNSZWNvcmRUeXBlLkEsXG4gICAgICB0dGwsXG4gICAgfSwge1xuICAgICAgdHlwZTogRG5zUmVjb3JkVHlwZS5BQUFBLFxuICAgICAgdHRsLFxuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbeyB0eXBlOiBkbnNSZWNvcmRUeXBlLCB0dGwgfV07XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR0aW5ncyBmb3IgYW4gb3B0aW9uYWwgQW1hem9uIFJvdXRlIDUzIGhlYWx0aCBjaGVjay4gSWYgeW91IHNwZWNpZnkgc2V0dGluZ3MgZm9yIGEgaGVhbHRoIGNoZWNrLCBBV1MgQ2xvdWQgTWFwXG4gKiBhc3NvY2lhdGVzIHRoZSBoZWFsdGggY2hlY2sgd2l0aCBhbGwgdGhlIHJlY29yZHMgdGhhdCB5b3Ugc3BlY2lmeSBpbiBEbnNDb25maWcuIE9ubHkgdmFsaWQgd2l0aCBhIFB1YmxpY0Ruc05hbWVzcGFjZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIZWFsdGhDaGVja0NvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBoZWFsdGggY2hlY2sgdGhhdCB5b3Ugd2FudCB0byBjcmVhdGUsIHdoaWNoIGluZGljYXRlcyBob3cgUm91dGUgNTMgZGV0ZXJtaW5lcyB3aGV0aGVyIGFuIGVuZHBvaW50IGlzXG4gICAqIGhlYWx0aHkuIENhbm5vdCBiZSBtb2RpZmllZCBvbmNlIGNyZWF0ZWQuIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIEhUVFAsIEhUVFBTLCBhbmQgVENQLlxuICAgKlxuICAgKiBAZGVmYXVsdCBIVFRQXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogSGVhbHRoQ2hlY2tUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0aGF0IHlvdSB3YW50IFJvdXRlIDUzIHRvIHJlcXVlc3Qgd2hlbiBwZXJmb3JtaW5nIGhlYWx0aCBjaGVja3MuIERvIG5vdCB1c2Ugd2hlbiBoZWFsdGggY2hlY2sgdHlwZSBpcyBUQ1AuXG4gICAqXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNvbnNlY3V0aXZlIGhlYWx0aCBjaGVja3MgdGhhdCBhbiBlbmRwb2ludCBtdXN0IHBhc3Mgb3IgZmFpbCBmb3IgUm91dGUgNTMgdG8gY2hhbmdlIHRoZSBjdXJyZW50XG4gICAqIHN0YXR1cyBvZiB0aGUgZW5kcG9pbnQgZnJvbSB1bmhlYWx0aHkgdG8gaGVhbHRoeSBvciB2aWNlIHZlcnNhLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSBmYWlsdXJlVGhyZXNob2xkPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNwZWNpZmllcyBpbmZvcm1hdGlvbiBhYm91dCBhbiBvcHRpb25hbCBjdXN0b20gaGVhbHRoIGNoZWNrLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhlYWx0aENoZWNrQ3VzdG9tQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgMzAtc2Vjb25kIGludGVydmFscyB0aGF0IHlvdSB3YW50IENsb3VkIE1hcCB0byB3YWl0IGFmdGVyIHJlY2VpdmluZyBhblxuICAgKiBVcGRhdGVJbnN0YW5jZUN1c3RvbUhlYWx0aFN0YXR1cyByZXF1ZXN0IGJlZm9yZSBpdCBjaGFuZ2VzIHRoZSBoZWFsdGggc3RhdHVzIG9mIGEgc2VydmljZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgZmFpbHVyZVRocmVzaG9sZD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTcGVjaWZpZXMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGRpc2NvdmVyeSB0eXBlIG9mIGEgc2VydmljZVxuICovXG5leHBvcnQgZW51bSBEaXNjb3ZlcnlUeXBlIHtcbiAgLyoqXG4gICAqIEluc3RhbmNlcyBhcmUgZGlzY292ZXJhYmxlIHZpYSBBUEkgb25seVxuICAgKi9cbiAgQVBJID0gJ0FQSScsXG4gIC8qKlxuICAgKiBJbnN0YW5jZXMgYXJlIGRpc2NvdmVyYWJsZSB2aWEgRE5TIG9yIEFQSVxuICAgKi9cbiAgRE5TX0FORF9BUEkgPSAnRE5TX0FORF9BUEknXG59XG5cbmV4cG9ydCBlbnVtIERuc1JlY29yZFR5cGUge1xuICAvKipcbiAgICogQW4gQSByZWNvcmRcbiAgICovXG4gIEEgPSAnQScsXG5cbiAgLyoqXG4gICAqIEFuIEFBQUEgcmVjb3JkXG4gICAqL1xuICBBQUFBID0gJ0FBQUEnLFxuXG4gIC8qKlxuICAgKiBCb3RoIGFuIEEgYW5kIEFBQUEgcmVjb3JkXG4gICAqL1xuICBBX0FBQUEgPSAnQSwgQUFBQScsXG5cbiAgLyoqXG4gICAqIEEgU3J2IHJlY29yZFxuICAgKi9cbiAgU1JWID0gJ1NSVicsXG5cbiAgLyoqXG4gICAqIEEgQ05BTUUgcmVjb3JkXG4gICAqL1xuICBDTkFNRSA9ICdDTkFNRScsXG59XG5cbmV4cG9ydCBlbnVtIFJvdXRpbmdQb2xpY3kge1xuICAvKipcbiAgICogUm91dGUgNTMgcmV0dXJucyB0aGUgYXBwbGljYWJsZSB2YWx1ZSBmcm9tIG9uZSByYW5kb21seSBzZWxlY3RlZCBpbnN0YW5jZSBmcm9tIGFtb25nIHRoZSBpbnN0YW5jZXMgdGhhdCB5b3VcbiAgICogcmVnaXN0ZXJlZCB1c2luZyB0aGUgc2FtZSBzZXJ2aWNlLlxuICAgKi9cbiAgV0VJR0hURUQgPSAnV0VJR0hURUQnLFxuXG4gIC8qKlxuICAgKiBJZiB5b3UgZGVmaW5lIGEgaGVhbHRoIGNoZWNrIGZvciB0aGUgc2VydmljZSBhbmQgdGhlIGhlYWx0aCBjaGVjayBpcyBoZWFsdGh5LCBSb3V0ZSA1MyByZXR1cm5zIHRoZSBhcHBsaWNhYmxlIHZhbHVlXG4gICAqIGZvciB1cCB0byBlaWdodCBpbnN0YW5jZXMuXG4gICAqL1xuICBNVUxUSVZBTFVFID0gJ01VTFRJVkFMVUUnLFxufVxuXG5leHBvcnQgZW51bSBIZWFsdGhDaGVja1R5cGUge1xuICAvKipcbiAgICogUm91dGUgNTMgdHJpZXMgdG8gZXN0YWJsaXNoIGEgVENQIGNvbm5lY3Rpb24uIElmIHN1Y2Nlc3NmdWwsIFJvdXRlIDUzIHN1Ym1pdHMgYW4gSFRUUCByZXF1ZXN0IGFuZCB3YWl0cyBmb3IgYW4gSFRUUFxuICAgKiBzdGF0dXMgY29kZSBvZiAyMDAgb3IgZ3JlYXRlciBhbmQgbGVzcyB0aGFuIDQwMC5cbiAgICovXG4gIEhUVFAgPSAnSFRUUCcsXG5cbiAgLyoqXG4gICAqIFJvdXRlIDUzIHRyaWVzIHRvIGVzdGFibGlzaCBhIFRDUCBjb25uZWN0aW9uLiBJZiBzdWNjZXNzZnVsLCBSb3V0ZSA1MyBzdWJtaXRzIGFuIEhUVFBTIHJlcXVlc3QgYW5kIHdhaXRzIGZvciBhblxuICAgKiBIVFRQIHN0YXR1cyBjb2RlIG9mIDIwMCBvciBncmVhdGVyIGFuZCBsZXNzIHRoYW4gNDAwLiAgSWYgeW91IHNwZWNpZnkgSFRUUFMgZm9yIHRoZSB2YWx1ZSBvZiBUeXBlLCB0aGUgZW5kcG9pbnRcbiAgICogbXVzdCBzdXBwb3J0IFRMUyB2MS4wIG9yIGxhdGVyLlxuICAgKi9cbiAgSFRUUFMgPSAnSFRUUFMnLFxuXG4gIC8qKlxuICAgKiBSb3V0ZSA1MyB0cmllcyB0byBlc3RhYmxpc2ggYSBUQ1AgY29ubmVjdGlvbi5cbiAgICogSWYgeW91IHNwZWNpZnkgVENQIGZvciBUeXBlLCBkb24ndCBzcGVjaWZ5IGEgdmFsdWUgZm9yIFJlc291cmNlUGF0aC5cbiAgICovXG4gIFRDUCA9ICdUQ1AnLFxufVxuIl19