"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpInstance = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const instance_1 = require("./instance");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Instance that is accessible using an IP address.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
class IpInstance extends instance_1.InstanceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_IpInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, IpInstance);
            }
            throw error;
        }
        const dnsRecordType = props.service.dnsRecordType;
        if (dnsRecordType === service_1.DnsRecordType.CNAME) {
            throw new Error('Service must support `A`, `AAAA` or `SRV` records to register this instance type.');
        }
        if (dnsRecordType === service_1.DnsRecordType.SRV) {
            if (!props.port) {
                throw new Error('A `port` must be specified for a service using a `SRV` record.');
            }
            if (!props.ipv4 && !props.ipv6) {
                throw new Error('At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record.');
            }
        }
        if (!props.ipv4 && (dnsRecordType === service_1.DnsRecordType.A || dnsRecordType === service_1.DnsRecordType.A_AAAA)) {
            throw new Error('An `ipv4` must be specified for a service using a `A` record.');
        }
        if (!props.ipv6 &&
            (dnsRecordType === service_1.DnsRecordType.AAAA || dnsRecordType === service_1.DnsRecordType.A_AAAA)) {
            throw new Error('An `ipv6` must be specified for a service using a `AAAA` record.');
        }
        const port = props.port || 80;
        const resource = new servicediscovery_generated_1.CfnInstance(this, 'Resource', {
            instanceAttributes: {
                AWS_INSTANCE_IPV4: props.ipv4,
                AWS_INSTANCE_IPV6: props.ipv6,
                AWS_INSTANCE_PORT: port.toString(),
                ...props.customAttributes,
            },
            instanceId: props.instanceId || this.uniqueInstanceId(),
            serviceId: props.service.serviceId,
        });
        this.service = props.service;
        this.instanceId = resource.ref;
        this.ipv4 = props.ipv4 || '';
        this.ipv6 = props.ipv6 || '';
        this.port = port;
    }
}
exports.IpInstance = IpInstance;
_a = JSII_RTTI_SYMBOL_1;
IpInstance[_a] = { fqn: "@aws-cdk/aws-servicediscovery.IpInstance", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAtaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC1pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx5Q0FBNkQ7QUFDN0QsdUNBQW9EO0FBQ3BELDZFQUEyRDtBQTBDM0Q7Ozs7R0FJRztBQUNILE1BQWEsVUFBVyxTQUFRLHVCQUFZO0lBMEIxQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0EzQlIsVUFBVTs7OztRQTRCbkIsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFFbEQsSUFBSSxhQUFhLEtBQUssdUJBQWEsQ0FBQyxLQUFLLEVBQUU7WUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1NBQ3RHO1FBQ0QsSUFBSSxhQUFhLEtBQUssdUJBQWEsQ0FBQyxHQUFHLEVBQUU7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO2FBQ25GO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLGlGQUFpRixDQUFDLENBQUM7YUFDcEc7U0FDRjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLHVCQUFhLENBQUMsQ0FBQyxJQUFJLGFBQWEsS0FBSyx1QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2hHLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUNsRjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNiLENBQUMsYUFBYSxLQUFLLHVCQUFhLENBQUMsSUFBSSxJQUFJLGFBQWEsS0FBSyx1QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xGLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztTQUNyRjtRQUVELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRTlCLE1BQU0sUUFBUSxHQUFHLElBQUksd0NBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGtCQUFrQixFQUFFO2dCQUNsQixpQkFBaUIsRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDN0IsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQzdCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLEdBQUcsS0FBSyxDQUFDLGdCQUFnQjthQUMxQjtZQUNELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2RCxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOztBQXRFSCxnQ0F1RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VJbnN0YW5jZVByb3BzLCBJbnN0YW5jZUJhc2UgfSBmcm9tICcuL2luc3RhbmNlJztcbmltcG9ydCB7IERuc1JlY29yZFR5cGUsIElTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IENmbkluc3RhbmNlIH0gZnJvbSAnLi9zZXJ2aWNlZGlzY292ZXJ5LmdlbmVyYXRlZCc7XG5cbi8qXG4gKiBQcm9wZXJ0aWVzIGZvciBhIElwSW5zdGFuY2UgdXNlZCBmb3Igc2VydmljZSNyZWdpc3RlcklwSW5zdGFuY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJcEluc3RhbmNlQmFzZVByb3BzIGV4dGVuZHMgQmFzZUluc3RhbmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHBvcnQgb24gdGhlIGVuZHBvaW50IHRoYXQgeW91IHdhbnQgQVdTIENsb3VkIE1hcCB0byBwZXJmb3JtIGhlYWx0aCBjaGVja3Mgb24uIFRoaXMgdmFsdWUgaXMgYWxzbyB1c2VkIGZvclxuICAgKiB0aGUgcG9ydCB2YWx1ZSBpbiBhbiBTUlYgcmVjb3JkIGlmIHRoZSBzZXJ2aWNlIHRoYXQgeW91IHNwZWNpZnkgaW5jbHVkZXMgYW4gU1JWIHJlY29yZC4gWW91IGNhbiBhbHNvIHNwZWNpZnkgYVxuICAgKiBkZWZhdWx0IHBvcnQgdGhhdCBpcyBhcHBsaWVkIHRvIGFsbCBpbnN0YW5jZXMgaW4gdGhlIFNlcnZpY2UgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqICBJZiB0aGUgc2VydmljZSB0aGF0IHlvdSBzcGVjaWZ5IGNvbnRhaW5zIGEgdGVtcGxhdGUgZm9yIGFuIEEgcmVjb3JkLCB0aGUgSVB2NCBhZGRyZXNzIHRoYXQgeW91IHdhbnQgQVdTIENsb3VkXG4gICAqICBNYXAgdG8gdXNlIGZvciB0aGUgdmFsdWUgb2YgdGhlIEEgcmVjb3JkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBpcHY0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiAgSWYgdGhlIHNlcnZpY2UgdGhhdCB5b3Ugc3BlY2lmeSBjb250YWlucyBhIHRlbXBsYXRlIGZvciBhbiBBQUFBIHJlY29yZCwgdGhlIElQdjYgYWRkcmVzcyB0aGF0IHlvdSB3YW50IEFXUyBDbG91ZFxuICAgKiAgTWFwIHRvIHVzZSBmb3IgdGhlIHZhbHVlIG9mIHRoZSBBQUFBIHJlY29yZC5cbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgaXB2Nj86IHN0cmluZztcbn1cblxuLypcbiAqIFByb3BlcnRpZXMgZm9yIGFuIElwSW5zdGFuY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJcEluc3RhbmNlUHJvcHMgZXh0ZW5kcyBJcEluc3RhbmNlQmFzZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZG1hcCBzZXJ2aWNlIHRoaXMgcmVzb3VyY2UgaXMgcmVnaXN0ZXJlZCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2U6IElTZXJ2aWNlO1xufVxuXG4vKipcbiAqIEluc3RhbmNlIHRoYXQgaXMgYWNjZXNzaWJsZSB1c2luZyBhbiBJUCBhZGRyZXNzLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6Okluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBJcEluc3RhbmNlIGV4dGVuZHMgSW5zdGFuY2VCYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbnN0YW5jZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZG1hcCBzZXJ2aWNlIHRvIHdoaWNoIHRoZSBpbnN0YW5jZSBpcyByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2U6IElTZXJ2aWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgSXB2NCBhZGRyZXNzIG9mIHRoZSBpbnN0YW5jZSwgb3IgYmxhbmsgc3RyaW5nIGlmIG5vbmUgYXZhaWxhYmxlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXB2NDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSXB2NiBhZGRyZXNzIG9mIHRoZSBpbnN0YW5jZSwgb3IgYmxhbmsgc3RyaW5nIGlmIG5vbmUgYXZhaWxhYmxlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXB2Njogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZXhwb3NlZCBwb3J0IG9mIHRoZSBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBvcnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSXBJbnN0YW5jZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCBkbnNSZWNvcmRUeXBlID0gcHJvcHMuc2VydmljZS5kbnNSZWNvcmRUeXBlO1xuXG4gICAgaWYgKGRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQ05BTUUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmljZSBtdXN0IHN1cHBvcnQgYEFgLCBgQUFBQWAgb3IgYFNSVmAgcmVjb3JkcyB0byByZWdpc3RlciB0aGlzIGluc3RhbmNlIHR5cGUuJyk7XG4gICAgfVxuICAgIGlmIChkbnNSZWNvcmRUeXBlID09PSBEbnNSZWNvcmRUeXBlLlNSVikge1xuICAgICAgaWYgKCFwcm9wcy5wb3J0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQSBgcG9ydGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgc2VydmljZSB1c2luZyBhIGBTUlZgIHJlY29yZC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcm9wcy5pcHY0ICYmICFwcm9wcy5pcHY2KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3QgYGlwdjRgIG9yIGBpcHY2YCBtdXN0IGJlIHNwZWNpZmllZCBmb3IgYSBzZXJ2aWNlIHVzaW5nIGEgYFNSVmAgcmVjb3JkLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHJvcHMuaXB2NCAmJiAoZG5zUmVjb3JkVHlwZSA9PT0gRG5zUmVjb3JkVHlwZS5BIHx8IGRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQV9BQUFBKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBgaXB2NGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgc2VydmljZSB1c2luZyBhIGBBYCByZWNvcmQuJyk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcy5pcHY2ICYmXG4gICAgICAoZG5zUmVjb3JkVHlwZSA9PT0gRG5zUmVjb3JkVHlwZS5BQUFBIHx8IGRuc1JlY29yZFR5cGUgPT09IERuc1JlY29yZFR5cGUuQV9BQUFBKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBgaXB2NmAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgc2VydmljZSB1c2luZyBhIGBBQUFBYCByZWNvcmQuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcG9ydCA9IHByb3BzLnBvcnQgfHwgODA7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5JbnN0YW5jZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBpbnN0YW5jZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgQVdTX0lOU1RBTkNFX0lQVjQ6IHByb3BzLmlwdjQsXG4gICAgICAgIEFXU19JTlNUQU5DRV9JUFY2OiBwcm9wcy5pcHY2LFxuICAgICAgICBBV1NfSU5TVEFOQ0VfUE9SVDogcG9ydC50b1N0cmluZygpLFxuICAgICAgICAuLi5wcm9wcy5jdXN0b21BdHRyaWJ1dGVzLFxuICAgICAgfSxcbiAgICAgIGluc3RhbmNlSWQ6IHByb3BzLmluc3RhbmNlSWQgfHwgdGhpcy51bmlxdWVJbnN0YW5jZUlkKCksXG4gICAgICBzZXJ2aWNlSWQ6IHByb3BzLnNlcnZpY2Uuc2VydmljZUlkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2aWNlID0gcHJvcHMuc2VydmljZTtcbiAgICB0aGlzLmluc3RhbmNlSWQgPSByZXNvdXJjZS5yZWY7XG4gICAgdGhpcy5pcHY0ID0gcHJvcHMuaXB2NCB8fCAnJztcbiAgICB0aGlzLmlwdjYgPSBwcm9wcy5pcHY2IHx8ICcnO1xuICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gIH1cbn1cbiJdfQ==