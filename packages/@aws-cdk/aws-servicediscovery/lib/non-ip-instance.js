"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonIpInstance = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const instance_1 = require("./instance");
const utils_1 = require("./private/utils");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Instance accessible using values other than an IP address or a domain name (CNAME).
 * Specify the other values in Custom attributes.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
class NonIpInstance extends instance_1.InstanceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_NonIpInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NonIpInstance);
            }
            throw error;
        }
        const discoveryType = props.service.discoveryType || utils_1.defaultDiscoveryType(props.service.namespace);
        if (discoveryType !== service_1.DiscoveryType.API) {
            throw new Error('This type of instance can only be registered for HTTP namespaces.');
        }
        if (props.customAttributes === undefined || Object.keys(props.customAttributes).length === 0) {
            throw new Error('You must specify at least one custom attribute for this instance type.');
        }
        const resource = new servicediscovery_generated_1.CfnInstance(this, 'Resource', {
            instanceId: props.instanceId || this.uniqueInstanceId(),
            serviceId: props.service.serviceId,
            instanceAttributes: {
                ...props.customAttributes,
            },
        });
        this.service = props.service;
        this.instanceId = resource.ref;
    }
}
exports.NonIpInstance = NonIpInstance;
_a = JSII_RTTI_SYMBOL_1;
NonIpInstance[_a] = { fqn: "@aws-cdk/aws-servicediscovery.NonIpInstance", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uLWlwLWluc3RhbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9uLWlwLWluc3RhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHlDQUE2RDtBQUM3RCwyQ0FBdUQ7QUFDdkQsdUNBQW9EO0FBQ3BELDZFQUEyRDtBQWUzRDs7Ozs7R0FLRztBQUNILE1BQWEsYUFBYyxTQUFRLHVCQUFZO0lBVzdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVpSLGFBQWE7Ozs7UUFjdEIsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksNEJBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRyxJQUFJLGFBQWEsS0FBSyx1QkFBYSxDQUFDLEdBQUcsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7U0FDdEY7UUFFRCxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzVGLE1BQU0sSUFBSSxLQUFLLENBQUMsd0VBQXdFLENBQUMsQ0FBQztTQUMzRjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksd0NBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2RCxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ2xDLGtCQUFrQixFQUFFO2dCQUNsQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0I7YUFDMUI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0tBQ2hDOztBQWpDSCxzQ0FrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VJbnN0YW5jZVByb3BzLCBJbnN0YW5jZUJhc2UgfSBmcm9tICcuL2luc3RhbmNlJztcbmltcG9ydCB7IGRlZmF1bHREaXNjb3ZlcnlUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3V0aWxzJztcbmltcG9ydCB7IElTZXJ2aWNlLCBEaXNjb3ZlcnlUeXBlIH0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IENmbkluc3RhbmNlIH0gZnJvbSAnLi9zZXJ2aWNlZGlzY292ZXJ5LmdlbmVyYXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9uSXBJbnN0YW5jZUJhc2VQcm9wcyBleHRlbmRzIEJhc2VJbnN0YW5jZVByb3BzIHtcbn1cblxuLypcbiAqIFByb3BlcnRpZXMgZm9yIGEgTm9uSXBJbnN0YW5jZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vbklwSW5zdGFuY2VQcm9wcyBleHRlbmRzIE5vbklwSW5zdGFuY2VCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIENsb3VkbWFwIHNlcnZpY2UgdGhpcyByZXNvdXJjZSBpcyByZWdpc3RlcmVkIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZTogSVNlcnZpY2U7XG59XG5cbi8qKlxuICogSW5zdGFuY2UgYWNjZXNzaWJsZSB1c2luZyB2YWx1ZXMgb3RoZXIgdGhhbiBhbiBJUCBhZGRyZXNzIG9yIGEgZG9tYWluIG5hbWUgKENOQU1FKS5cbiAqIFNwZWNpZnkgdGhlIG90aGVyIHZhbHVlcyBpbiBDdXN0b20gYXR0cmlidXRlcy5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpJbnN0YW5jZVxuICovXG5leHBvcnQgY2xhc3MgTm9uSXBJbnN0YW5jZSBleHRlbmRzIEluc3RhbmNlQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRtYXAgc2VydmljZSB0byB3aGljaCB0aGUgaW5zdGFuY2UgaXMgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlOiBJU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTm9uSXBJbnN0YW5jZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGRpc2NvdmVyeVR5cGUgPSBwcm9wcy5zZXJ2aWNlLmRpc2NvdmVyeVR5cGUgfHwgZGVmYXVsdERpc2NvdmVyeVR5cGUocHJvcHMuc2VydmljZS5uYW1lc3BhY2UpO1xuICAgIGlmIChkaXNjb3ZlcnlUeXBlICE9PSBEaXNjb3ZlcnlUeXBlLkFQSSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHR5cGUgb2YgaW5zdGFuY2UgY2FuIG9ubHkgYmUgcmVnaXN0ZXJlZCBmb3IgSFRUUCBuYW1lc3BhY2VzLicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jdXN0b21BdHRyaWJ1dGVzID09PSB1bmRlZmluZWQgfHwgT2JqZWN0LmtleXMocHJvcHMuY3VzdG9tQXR0cmlidXRlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIGN1c3RvbSBhdHRyaWJ1dGUgZm9yIHRoaXMgaW5zdGFuY2UgdHlwZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5JbnN0YW5jZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBpbnN0YW5jZUlkOiBwcm9wcy5pbnN0YW5jZUlkIHx8IHRoaXMudW5pcXVlSW5zdGFuY2VJZCgpLFxuICAgICAgc2VydmljZUlkOiBwcm9wcy5zZXJ2aWNlLnNlcnZpY2VJZCxcbiAgICAgIGluc3RhbmNlQXR0cmlidXRlczoge1xuICAgICAgICAuLi5wcm9wcy5jdXN0b21BdHRyaWJ1dGVzLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VydmljZSA9IHByb3BzLnNlcnZpY2U7XG4gICAgdGhpcy5pbnN0YW5jZUlkID0gcmVzb3VyY2UucmVmO1xuICB9XG59XG4iXX0=