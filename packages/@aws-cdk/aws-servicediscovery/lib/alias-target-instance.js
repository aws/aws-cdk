"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasTargetInstance = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const instance_1 = require("./instance");
const namespace_1 = require("./namespace");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Instance that uses Route 53 Alias record type. Currently, the only resource types supported are Elastic Load
 * Balancers.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
class AliasTargetInstance extends instance_1.InstanceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_AliasTargetInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AliasTargetInstance);
            }
            throw error;
        }
        if (props.service.namespace.type === namespace_1.NamespaceType.HTTP) {
            throw new Error('Namespace associated with Service must be a DNS Namespace.');
        }
        // Should already be enforced when creating service, but validates if service is not instantiated with #createService
        const dnsRecordType = props.service.dnsRecordType;
        if (dnsRecordType !== service_1.DnsRecordType.A
            && dnsRecordType !== service_1.DnsRecordType.AAAA
            && dnsRecordType !== service_1.DnsRecordType.A_AAAA) {
            throw new Error('Service must use `A` or `AAAA` records to register an AliasRecordTarget.');
        }
        if (props.service.routingPolicy !== service_1.RoutingPolicy.WEIGHTED) {
            throw new Error('Service must use `WEIGHTED` routing policy.');
        }
        const resource = new servicediscovery_generated_1.CfnInstance(this, 'Resource', {
            instanceAttributes: {
                AWS_ALIAS_DNS_NAME: props.dnsName,
                ...props.customAttributes,
            },
            instanceId: props.instanceId || core_1.Names.uniqueId(this),
            serviceId: props.service.serviceId,
        });
        this.service = props.service;
        this.instanceId = resource.ref;
        this.dnsName = props.dnsName;
    }
}
exports.AliasTargetInstance = AliasTargetInstance;
_a = JSII_RTTI_SYMBOL_1;
AliasTargetInstance[_a] = { fqn: "@aws-cdk/aws-servicediscovery.AliasTargetInstance", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMtdGFyZ2V0LWluc3RhbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxpYXMtdGFyZ2V0LWluc3RhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzQztBQUV0Qyx5Q0FBNkQ7QUFDN0QsMkNBQTRDO0FBQzVDLHVDQUFtRTtBQUNuRSw2RUFBMkQ7QUFpQjNEOzs7OztHQUtHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSx1QkFBWTtJQWdCbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBakJSLG1CQUFtQjs7OztRQW1CNUIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUsseUJBQWEsQ0FBQyxJQUFJLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQscUhBQXFIO1FBQ3JILE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ2xELElBQUksYUFBYSxLQUFLLHVCQUFhLENBQUMsQ0FBQztlQUNoQyxhQUFhLEtBQUssdUJBQWEsQ0FBQyxJQUFJO2VBQ3BDLGFBQWEsS0FBSyx1QkFBYSxDQUFDLE1BQU0sRUFBRTtZQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxLQUFLLHVCQUFhLENBQUMsUUFBUSxFQUFFO1lBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNoRTtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksd0NBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGtCQUFrQixFQUFFO2dCQUNsQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDakMsR0FBRyxLQUFLLENBQUMsZ0JBQWdCO2FBQzFCO1lBQ0QsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDcEQsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztTQUNuQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztLQUM5Qjs7QUEvQ0gsa0RBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmFtZXMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZUluc3RhbmNlUHJvcHMsIEluc3RhbmNlQmFzZSB9IGZyb20gJy4vaW5zdGFuY2UnO1xuaW1wb3J0IHsgTmFtZXNwYWNlVHlwZSB9IGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCB7IERuc1JlY29yZFR5cGUsIElTZXJ2aWNlLCBSb3V0aW5nUG9saWN5IH0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IENmbkluc3RhbmNlIH0gZnJvbSAnLi9zZXJ2aWNlZGlzY292ZXJ5LmdlbmVyYXRlZCc7XG5cbi8qXG4gKiBQcm9wZXJ0aWVzIGZvciBhbiBBbGlhc1RhcmdldEluc3RhbmNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxpYXNUYXJnZXRJbnN0YW5jZVByb3BzIGV4dGVuZHMgQmFzZUluc3RhbmNlUHJvcHMge1xuICAvKipcbiAgICogRE5TIG5hbWUgb2YgdGhlIHRhcmdldFxuICAgKi9cbiAgcmVhZG9ubHkgZG5zTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRtYXAgc2VydmljZSB0aGlzIHJlc291cmNlIGlzIHJlZ2lzdGVyZWQgdG8uXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBJU2VydmljZTtcbn1cblxuLyoqXG4gKiBJbnN0YW5jZSB0aGF0IHVzZXMgUm91dGUgNTMgQWxpYXMgcmVjb3JkIHR5cGUuIEN1cnJlbnRseSwgdGhlIG9ubHkgcmVzb3VyY2UgdHlwZXMgc3VwcG9ydGVkIGFyZSBFbGFzdGljIExvYWRcbiAqIEJhbGFuY2Vycy5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpJbnN0YW5jZVxuICovXG5leHBvcnQgY2xhc3MgQWxpYXNUYXJnZXRJbnN0YW5jZSBleHRlbmRzIEluc3RhbmNlQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRtYXAgc2VydmljZSB0byB3aGljaCB0aGUgaW5zdGFuY2UgaXMgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlOiBJU2VydmljZTtcblxuICAvKipcbiAgICogVGhlIFJvdXRlNTMgRE5TIG5hbWUgb2YgdGhlIGFsaWFzIHRhcmdldFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRuc05hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQWxpYXNUYXJnZXRJbnN0YW5jZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5zZXJ2aWNlLm5hbWVzcGFjZS50eXBlID09PSBOYW1lc3BhY2VUeXBlLkhUVFApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmFtZXNwYWNlIGFzc29jaWF0ZWQgd2l0aCBTZXJ2aWNlIG11c3QgYmUgYSBETlMgTmFtZXNwYWNlLicpO1xuICAgIH1cblxuICAgIC8vIFNob3VsZCBhbHJlYWR5IGJlIGVuZm9yY2VkIHdoZW4gY3JlYXRpbmcgc2VydmljZSwgYnV0IHZhbGlkYXRlcyBpZiBzZXJ2aWNlIGlzIG5vdCBpbnN0YW50aWF0ZWQgd2l0aCAjY3JlYXRlU2VydmljZVxuICAgIGNvbnN0IGRuc1JlY29yZFR5cGUgPSBwcm9wcy5zZXJ2aWNlLmRuc1JlY29yZFR5cGU7XG4gICAgaWYgKGRuc1JlY29yZFR5cGUgIT09IERuc1JlY29yZFR5cGUuQVxuICAgICAgJiYgZG5zUmVjb3JkVHlwZSAhPT0gRG5zUmVjb3JkVHlwZS5BQUFBXG4gICAgICAmJiBkbnNSZWNvcmRUeXBlICE9PSBEbnNSZWNvcmRUeXBlLkFfQUFBQSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2aWNlIG11c3QgdXNlIGBBYCBvciBgQUFBQWAgcmVjb3JkcyB0byByZWdpc3RlciBhbiBBbGlhc1JlY29yZFRhcmdldC4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VydmljZS5yb3V0aW5nUG9saWN5ICE9PSBSb3V0aW5nUG9saWN5LldFSUdIVEVEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlcnZpY2UgbXVzdCB1c2UgYFdFSUdIVEVEYCByb3V0aW5nIHBvbGljeS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5JbnN0YW5jZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBpbnN0YW5jZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgQVdTX0FMSUFTX0ROU19OQU1FOiBwcm9wcy5kbnNOYW1lLFxuICAgICAgICAuLi5wcm9wcy5jdXN0b21BdHRyaWJ1dGVzLFxuICAgICAgfSxcbiAgICAgIGluc3RhbmNlSWQ6IHByb3BzLmluc3RhbmNlSWQgfHwgTmFtZXMudW5pcXVlSWQodGhpcyksXG4gICAgICBzZXJ2aWNlSWQ6IHByb3BzLnNlcnZpY2Uuc2VydmljZUlkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2aWNlID0gcHJvcHMuc2VydmljZTtcbiAgICB0aGlzLmluc3RhbmNlSWQgPSByZXNvdXJjZS5yZWY7XG4gICAgdGhpcy5kbnNOYW1lID0gcHJvcHMuZG5zTmFtZTtcbiAgfVxufVxuIl19