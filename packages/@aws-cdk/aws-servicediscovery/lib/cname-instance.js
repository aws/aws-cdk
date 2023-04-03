"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CnameInstance = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const instance_1 = require("./instance");
const namespace_1 = require("./namespace");
const service_1 = require("./service");
const servicediscovery_generated_1 = require("./servicediscovery.generated");
/**
 * Instance that is accessible using a domain name (CNAME).
 * @resource AWS::ServiceDiscovery::Instance
 */
class CnameInstance extends instance_1.InstanceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_servicediscovery_CnameInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CnameInstance);
            }
            throw error;
        }
        if (props.service.namespace.type === namespace_1.NamespaceType.HTTP) {
            throw new Error('Namespace associated with Service must be a DNS Namespace.');
        }
        if (props.service.dnsRecordType !== service_1.DnsRecordType.CNAME) {
            throw new Error('A `CnameIntance` can only be used with a service using a `CNAME` record.');
        }
        const resource = new servicediscovery_generated_1.CfnInstance(this, 'Resource', {
            instanceId: props.instanceId || this.uniqueInstanceId(),
            serviceId: props.service.serviceId,
            instanceAttributes: {
                AWS_INSTANCE_CNAME: props.instanceCname,
                ...props.customAttributes,
            },
        });
        this.service = props.service;
        this.instanceId = resource.ref;
        this.cname = props.instanceCname;
    }
}
exports.CnameInstance = CnameInstance;
_a = JSII_RTTI_SYMBOL_1;
CnameInstance[_a] = { fqn: "@aws-cdk/aws-servicediscovery.CnameInstance", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY25hbWUtaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbmFtZS1pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx5Q0FBNkQ7QUFDN0QsMkNBQTRDO0FBQzVDLHVDQUFvRDtBQUNwRCw2RUFBMkQ7QUF3QjNEOzs7R0FHRztBQUNILE1BQWEsYUFBYyxTQUFRLHVCQUFZO0lBZ0I3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FqQlIsYUFBYTs7OztRQW1CdEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUsseUJBQWEsQ0FBQyxJQUFJLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsS0FBSyx1QkFBYSxDQUFDLEtBQUssRUFBRTtZQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLHdDQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkQsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNsQyxrQkFBa0IsRUFBRTtnQkFDbEIsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGFBQWE7Z0JBQ3ZDLEdBQUcsS0FBSyxDQUFDLGdCQUFnQjthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0tBQ2xDOztBQXZDSCxzQ0F3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VJbnN0YW5jZVByb3BzLCBJbnN0YW5jZUJhc2UgfSBmcm9tICcuL2luc3RhbmNlJztcbmltcG9ydCB7IE5hbWVzcGFjZVR5cGUgfSBmcm9tICcuL25hbWVzcGFjZSc7XG5pbXBvcnQgeyBEbnNSZWNvcmRUeXBlLCBJU2VydmljZSB9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQgeyBDZm5JbnN0YW5jZSB9IGZyb20gJy4vc2VydmljZWRpc2NvdmVyeS5nZW5lcmF0ZWQnO1xuXG4vKlxuICogUHJvcGVydGllcyBmb3IgYSBDbmFtZUluc3RhbmNlIHVzZWQgZm9yIHNlcnZpY2UjcmVnaXN0ZXJDbmFtZUluc3RhbmNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ25hbWVJbnN0YW5jZUJhc2VQcm9wcyBleHRlbmRzIEJhc2VJbnN0YW5jZVByb3BzIHtcbiAgLyoqXG4gICAqIElmIHRoZSBzZXJ2aWNlIGNvbmZpZ3VyYXRpb24gaW5jbHVkZXMgYSBDTkFNRSByZWNvcmQsIHRoZSBkb21haW4gbmFtZSB0aGF0IHlvdSB3YW50IFJvdXRlIDUzIHRvXG4gICAqIHJldHVybiBpbiByZXNwb25zZSB0byBETlMgcXVlcmllcywgZm9yIGV4YW1wbGUsIGV4YW1wbGUuY29tLiBUaGlzIHZhbHVlIGlzIHJlcXVpcmVkIGlmIHRoZVxuICAgKiBzZXJ2aWNlIHNwZWNpZmllZCBieSBTZXJ2aWNlSWQgaW5jbHVkZXMgc2V0dGluZ3MgZm9yIGFuIENOQU1FIHJlY29yZC5cbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlQ25hbWU6IHN0cmluZztcbn1cblxuLypcbiAqIFByb3BlcnRpZXMgZm9yIGEgQ25hbWVJbnN0YW5jZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENuYW1lSW5zdGFuY2VQcm9wcyBleHRlbmRzIENuYW1lSW5zdGFuY2VCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIENsb3VkbWFwIHNlcnZpY2UgdGhpcyByZXNvdXJjZSBpcyByZWdpc3RlcmVkIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZTogSVNlcnZpY2U7XG59XG5cbi8qKlxuICogSW5zdGFuY2UgdGhhdCBpcyBhY2Nlc3NpYmxlIHVzaW5nIGEgZG9tYWluIG5hbWUgKENOQU1FKS5cbiAqIEByZXNvdXJjZSBBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6Okluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBDbmFtZUluc3RhbmNlIGV4dGVuZHMgSW5zdGFuY2VCYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbnN0YW5jZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZG1hcCBzZXJ2aWNlIHRvIHdoaWNoIHRoZSBpbnN0YW5jZSBpcyByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2U6IElTZXJ2aWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgcmV0dXJuZWQgYnkgRE5TIHF1ZXJpZXMgZm9yIHRoZSBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENuYW1lSW5zdGFuY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMuc2VydmljZS5uYW1lc3BhY2UudHlwZSA9PT0gTmFtZXNwYWNlVHlwZS5IVFRQKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05hbWVzcGFjZSBhc3NvY2lhdGVkIHdpdGggU2VydmljZSBtdXN0IGJlIGEgRE5TIE5hbWVzcGFjZS4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VydmljZS5kbnNSZWNvcmRUeXBlICE9PSBEbnNSZWNvcmRUeXBlLkNOQU1FKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgYENuYW1lSW50YW5jZWAgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIGEgc2VydmljZSB1c2luZyBhIGBDTkFNRWAgcmVjb3JkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkluc3RhbmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGluc3RhbmNlSWQ6IHByb3BzLmluc3RhbmNlSWQgfHwgdGhpcy51bmlxdWVJbnN0YW5jZUlkKCksXG4gICAgICBzZXJ2aWNlSWQ6IHByb3BzLnNlcnZpY2Uuc2VydmljZUlkLFxuICAgICAgaW5zdGFuY2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgIEFXU19JTlNUQU5DRV9DTkFNRTogcHJvcHMuaW5zdGFuY2VDbmFtZSxcbiAgICAgICAgLi4ucHJvcHMuY3VzdG9tQXR0cmlidXRlcyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnNlcnZpY2UgPSBwcm9wcy5zZXJ2aWNlO1xuICAgIHRoaXMuaW5zdGFuY2VJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmNuYW1lID0gcHJvcHMuaW5zdGFuY2VDbmFtZTtcbiAgfVxufVxuIl19