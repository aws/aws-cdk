"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcEndpointServiceDomainName = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
/**
 * A Private DNS configuration for a VPC endpoint service.
 */
class VpcEndpointServiceDomainName extends constructs_1.Construct {
    // The way this class works is by using three custom resources and a TxtRecord in conjunction
    // The first custom resource tells the VPC endpoint service to use the given DNS name
    // The VPC endpoint service will then say:
    // "ok, create a TXT record using these two values to prove you own the domain"
    // The second custom resource retrieves these two values from the service
    // The TxtRecord is created from these two values
    // The third custom resource tells the VPC Endpoint Service to verify the domain ownership
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53_VpcEndpointServiceDomainNameProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, VpcEndpointServiceDomainName);
            }
            throw error;
        }
        const serviceUniqueId = core_1.Names.nodeUniqueId(props.endpointService.node);
        const serviceId = props.endpointService.vpcEndpointServiceId;
        this.domainName = props.domainName;
        // Make sure a user doesn't accidentally add multiple domains
        this.validateProps(props);
        VpcEndpointServiceDomainName.endpointServicesMap[serviceUniqueId] = this.domainName;
        VpcEndpointServiceDomainName.endpointServices.push(props.endpointService);
        // Enable Private DNS on the endpoint service and retrieve the AWS-generated configuration
        const privateDnsConfiguration = this.getPrivateDnsConfiguration(serviceUniqueId, serviceId, this.domainName);
        // Tell AWS to verify that this account owns the domain attached to the service
        this.verifyPrivateDnsConfiguration(privateDnsConfiguration, props.publicHostedZone);
        // Finally, don't do any of the above before the endpoint service is created
        this.node.addDependency(props.endpointService);
    }
    validateProps(props) {
        const serviceUniqueId = core_1.Names.nodeUniqueId(props.endpointService.node);
        if (serviceUniqueId in VpcEndpointServiceDomainName.endpointServicesMap) {
            const endpoint = VpcEndpointServiceDomainName.endpointServicesMap[serviceUniqueId];
            throw new Error(`Cannot create a VpcEndpointServiceDomainName for service ${serviceUniqueId}, another VpcEndpointServiceDomainName (${endpoint}) is already associated with it`);
        }
    }
    /**
     * Sets up Custom Resources to make AWS calls to set up Private DNS on an endpoint service,
     * returning the values to use in a TxtRecord, which AWS uses to verify domain ownership.
     */
    getPrivateDnsConfiguration(serviceUniqueId, serviceId, privateDnsName) {
        // The custom resource which tells AWS to enable Private DNS on the given service, using the given domain name
        // AWS will generate a name/value pair for use in a TxtRecord, which is used to verify domain ownership.
        const enablePrivateDnsAction = {
            service: 'EC2',
            action: 'modifyVpcEndpointServiceConfiguration',
            parameters: {
                ServiceId: serviceId,
                PrivateDnsName: privateDnsName,
            },
            physicalResourceId: custom_resources_1.PhysicalResourceId.of(serviceUniqueId),
        };
        const removePrivateDnsAction = {
            service: 'EC2',
            action: 'modifyVpcEndpointServiceConfiguration',
            parameters: {
                ServiceId: serviceId,
                RemovePrivateDnsName: true,
            },
        };
        const enable = new custom_resources_1.AwsCustomResource(this, 'EnableDns', {
            onCreate: enablePrivateDnsAction,
            onUpdate: enablePrivateDnsAction,
            onDelete: removePrivateDnsAction,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: [
                    core_1.Fn.join(':', [
                        'arn',
                        core_1.Stack.of(this).partition,
                        'ec2',
                        core_1.Stack.of(this).region,
                        core_1.Stack.of(this).account,
                        core_1.Fn.join('/', [
                            'vpc-endpoint-service',
                            serviceId,
                        ]),
                    ]),
                ],
            }),
            // APIs are available in 2.1055.0
            installLatestAwsSdk: false,
        });
        // Look up the name/value pair if the domain changes, or the service changes,
        // which would cause the values to be different. If the unique ID changes,
        // the resource may be entirely recreated, so we will need to look it up again.
        const lookup = hashcode(core_1.Names.uniqueId(this) + serviceUniqueId + privateDnsName);
        // Create the custom resource to look up the name/value pair generated by AWS
        // after the previous API call
        const retrieveNameValuePairAction = {
            service: 'EC2',
            action: 'describeVpcEndpointServiceConfigurations',
            parameters: {
                ServiceIds: [serviceId],
            },
            physicalResourceId: custom_resources_1.PhysicalResourceId.of(lookup),
        };
        const getNames = new custom_resources_1.AwsCustomResource(this, 'GetNames', {
            onCreate: retrieveNameValuePairAction,
            onUpdate: retrieveNameValuePairAction,
            // describeVpcEndpointServiceConfigurations can't take an ARN for granular permissions
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
            installLatestAwsSdk: false,
        });
        // We only want to call and get the name/value pair after we've told AWS to enable Private DNS
        // If we call before then, we'll get an empty pair of values.
        getNames.node.addDependency(enable);
        // Get the references to the name/value pair associated with the endpoint service
        const name = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Name');
        const value = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Value');
        return { name, value, serviceId };
    }
    /**
     * Creates a Route53 entry and a Custom Resource which explicitly tells AWS to verify ownership
     * of the domain name attached to an endpoint service.
     */
    verifyPrivateDnsConfiguration(config, publicHostedZone) {
        // Create the TXT record in the provided hosted zone
        const verificationRecord = new lib_1.TxtRecord(this, 'DnsVerificationRecord', {
            recordName: config.name,
            values: [config.value],
            zone: publicHostedZone,
        });
        // Tell the endpoint service to verify the domain ownership
        const startVerificationAction = {
            service: 'EC2',
            action: 'startVpcEndpointServicePrivateDnsVerification',
            parameters: {
                ServiceId: config.serviceId,
            },
            physicalResourceId: custom_resources_1.PhysicalResourceId.of(core_1.Fn.join(':', [config.name, config.value])),
        };
        const startVerification = new custom_resources_1.AwsCustomResource(this, 'StartVerification', {
            onCreate: startVerificationAction,
            onUpdate: startVerificationAction,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: [
                    core_1.Fn.join(':', [
                        'arn',
                        core_1.Stack.of(this).partition,
                        'ec2',
                        core_1.Stack.of(this).region,
                        core_1.Stack.of(this).account,
                        core_1.Fn.join('/', [
                            'vpc-endpoint-service',
                            config.serviceId,
                        ]),
                    ]),
                ],
            }),
            installLatestAwsSdk: false,
        });
        // Only verify after the record has been created
        startVerification.node.addDependency(verificationRecord);
    }
}
exports.VpcEndpointServiceDomainName = VpcEndpointServiceDomainName;
_a = JSII_RTTI_SYMBOL_1;
VpcEndpointServiceDomainName[_a] = { fqn: "@aws-cdk/aws-route53.VpcEndpointServiceDomainName", version: "0.0.0" };
// Track all domain names created, so someone doesn't accidentally associate two domains with a single service
VpcEndpointServiceDomainName.endpointServices = [];
// Track all domain names created, so someone doesn't accidentally associate two domains with a single service
VpcEndpointServiceDomainName.endpointServicesMap = {};
/**
 * Hash a string
 */
function hashcode(s) {
    return helpers_internal_1.md5hash(s);
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWVuZHBvaW50LXNlcnZpY2UtZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMtZW5kcG9pbnQtc2VydmljZS1kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBaUQ7QUFDakQseUVBQTZEO0FBQzdELGdFQUEyRztBQUMzRywyQ0FBdUM7QUFDdkMsZ0NBQXNEO0FBNEJ0RDs7R0FFRztBQUNILE1BQWEsNEJBQTZCLFNBQVEsc0JBQVM7SUFhekQsNkZBQTZGO0lBQzdGLHFGQUFxRjtJQUNyRiwwQ0FBMEM7SUFDMUMsK0VBQStFO0lBQy9FLHlFQUF5RTtJQUN6RSxpREFBaUQ7SUFDakQsMEZBQTBGO0lBQzFGLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0M7UUFDaEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXJCUiw0QkFBNEI7Ozs7UUF1QnJDLE1BQU0sZUFBZSxHQUFHLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1FBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVuQyw2REFBNkQ7UUFDN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQiw0QkFBNEIsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BGLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFMUUsMEZBQTBGO1FBQzFGLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVB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QyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3JGLENBQUM7UUFDRixNQUFNLGlCQUFpQixHQUFHLElBQUksb0NBQWlCLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQ3pFLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxNQUFNLEVBQUUsMENBQXVCLENBQUMsWUFBWSxDQUFDO2dCQUMzQyxTQUFTLEVBQUU7b0JBQ1QsU0FBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1gsS0FBSzt3QkFDTCxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVM7d0JBQ3hCLEtBQUs7d0JBQ0wsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO3dCQUNyQixZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU87d0JBQ3RCLFNBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFOzRCQUNYLHNCQUFzQjs0QkFDdEIsTUFBTSxDQUFDLFNBQVM7eUJBQ2pCLENBQUM7cUJBQ0gsQ0FBQztpQkFDSDthQUNGLENBQUM7WUFDRixtQkFBbUIsRUFBRSxLQUFLO1NBQzNCLENBQUMsQ0FBQztRQUNILGdEQUFnRDtRQUNoRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDMUQ7O0FBbkxILG9FQW9MQzs7O0FBbExDLDhHQUE4RztBQUN0Riw2Q0FBZ0IsR0FBMEIsRUFBRSxDQUFDO0FBRXJFLDhHQUE4RztBQUN0RixnREFBbUIsR0FBeUMsRUFBRSxDQUFDO0FBeUx6Rjs7R0FFRztBQUNILFNBQVMsUUFBUSxDQUFDLENBQVM7SUFDekIsT0FBTywwQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVZwY0VuZHBvaW50U2VydmljZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgRm4sIE5hbWVzLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgbWQ1aGFzaCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgQXdzQ3VzdG9tUmVzb3VyY2UsIEF3c0N1c3RvbVJlc291cmNlUG9saWN5LCBQaHlzaWNhbFJlc291cmNlSWQgfSBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSVB1YmxpY0hvc3RlZFpvbmUsIFR4dFJlY29yZCB9IGZyb20gJy4uL2xpYic7XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBjb25maWd1cmUgYSBWUEMgRW5kcG9pbnQgU2VydmljZSBkb21haW4gbmFtZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZwY0VuZHBvaW50U2VydmljZURvbWFpbk5hbWVQcm9wcyB7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgRW5kcG9pbnQgU2VydmljZSB0byBjb25maWd1cmUgUHJpdmF0ZSBETlMgZm9yXG4gICAqL1xuICByZWFkb25seSBlbmRwb2ludFNlcnZpY2U6IElWcGNFbmRwb2ludFNlcnZpY2U7XG5cbiAgLyoqXG4gICAqIFRoZSBkb21haW4gbmFtZSB0byB1c2UuXG4gICAqXG4gICAqIFRoaXMgZG9tYWluIG5hbWUgbXVzdCBiZSBvd25lZCBieSB0aGlzIGFjY291bnQgKHJlZ2lzdGVyZWQgdGhyb3VnaCBSb3V0ZTUzKSxcbiAgICogb3IgZGVsZWdhdGVkIHRvIHRoaXMgYWNjb3VudC4gRG9tYWluIG93bmVyc2hpcCB3aWxsIGJlIHZlcmlmaWVkIGJ5IEFXUyBiZWZvcmVcbiAgICogcHJpdmF0ZSBETlMgY2FuIGJlIHVzZWQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3ZwYy9sYXRlc3QvdXNlcmd1aWRlL2VuZHBvaW50LXNlcnZpY2VzLWRucy12YWxpZGF0aW9uLmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHB1YmxpYyBob3N0ZWQgem9uZSB0byB1c2UgZm9yIHRoZSBkb21haW4uXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNIb3N0ZWRab25lOiBJUHVibGljSG9zdGVkWm9uZTtcbn1cblxuLyoqXG4gKiBBIFByaXZhdGUgRE5TIGNvbmZpZ3VyYXRpb24gZm9yIGEgVlBDIGVuZHBvaW50IHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICAvLyBUcmFjayBhbGwgZG9tYWluIG5hbWVzIGNyZWF0ZWQsIHNvIHNvbWVvbmUgZG9lc24ndCBhY2NpZGVudGFsbHkgYXNzb2NpYXRlIHR3byBkb21haW5zIHdpdGggYSBzaW5nbGUgc2VydmljZVxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBlbmRwb2ludFNlcnZpY2VzOiBJVnBjRW5kcG9pbnRTZXJ2aWNlW10gPSBbXTtcblxuICAvLyBUcmFjayBhbGwgZG9tYWluIG5hbWVzIGNyZWF0ZWQsIHNvIHNvbWVvbmUgZG9lc24ndCBhY2NpZGVudGFsbHkgYXNzb2NpYXRlIHR3byBkb21haW5zIHdpdGggYSBzaW5nbGUgc2VydmljZVxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBlbmRwb2ludFNlcnZpY2VzTWFwOiB7IFtlbmRwb2ludFNlcnZpY2U6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJpdmF0ZSBETlMgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcHVibGljIGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvLyBUaGUgd2F5IHRoaXMgY2xhc3Mgd29ya3MgaXMgYnkgdXNpbmcgdGhyZWUgY3VzdG9tIHJlc291cmNlcyBhbmQgYSBUeHRSZWNvcmQgaW4gY29uanVuY3Rpb25cbiAgLy8gVGhlIGZpcnN0IGN1c3RvbSByZXNvdXJjZSB0ZWxscyB0aGUgVlBDIGVuZHBvaW50IHNlcnZpY2UgdG8gdXNlIHRoZSBnaXZlbiBETlMgbmFtZVxuICAvLyBUaGUgVlBDIGVuZHBvaW50IHNlcnZpY2Ugd2lsbCB0aGVuIHNheTpcbiAgLy8gXCJvaywgY3JlYXRlIGEgVFhUIHJlY29yZCB1c2luZyB0aGVzZSB0d28gdmFsdWVzIHRvIHByb3ZlIHlvdSBvd24gdGhlIGRvbWFpblwiXG4gIC8vIFRoZSBzZWNvbmQgY3VzdG9tIHJlc291cmNlIHJldHJpZXZlcyB0aGVzZSB0d28gdmFsdWVzIGZyb20gdGhlIHNlcnZpY2VcbiAgLy8gVGhlIFR4dFJlY29yZCBpcyBjcmVhdGVkIGZyb20gdGhlc2UgdHdvIHZhbHVlc1xuICAvLyBUaGUgdGhpcmQgY3VzdG9tIHJlc291cmNlIHRlbGxzIHRoZSBWUEMgRW5kcG9pbnQgU2VydmljZSB0byB2ZXJpZnkgdGhlIGRvbWFpbiBvd25lcnNoaXBcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZwY0VuZHBvaW50U2VydmljZURvbWFpbk5hbWVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzZXJ2aWNlVW5pcXVlSWQgPSBOYW1lcy5ub2RlVW5pcXVlSWQocHJvcHMuZW5kcG9pbnRTZXJ2aWNlLm5vZGUpO1xuICAgIGNvbnN0IHNlcnZpY2VJZCA9IHByb3BzLmVuZHBvaW50U2VydmljZS52cGNFbmRwb2ludFNlcnZpY2VJZDtcbiAgICB0aGlzLmRvbWFpbk5hbWUgPSBwcm9wcy5kb21haW5OYW1lO1xuXG4gICAgLy8gTWFrZSBzdXJlIGEgdXNlciBkb2Vzbid0IGFjY2lkZW50YWxseSBhZGQgbXVsdGlwbGUgZG9tYWluc1xuICAgIHRoaXMudmFsaWRhdGVQcm9wcyhwcm9wcyk7XG5cbiAgICBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lLmVuZHBvaW50U2VydmljZXNNYXBbc2VydmljZVVuaXF1ZUlkXSA9IHRoaXMuZG9tYWluTmFtZTtcbiAgICBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lLmVuZHBvaW50U2VydmljZXMucHVzaChwcm9wcy5lbmRwb2ludFNlcnZpY2UpO1xuXG4gICAgLy8gRW5hYmxlIFByaXZhdGUgRE5TIG9uIHRoZSBlbmRwb2ludCBzZXJ2aWNlIGFuZCByZXRyaWV2ZSB0aGUgQVdTLWdlbmVyYXRlZCBjb25maWd1cmF0aW9uXG4gICAgY29uc3QgcHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24gPSB0aGlzLmdldFByaXZhdGVEbnNDb25maWd1cmF0aW9uKHNlcnZpY2VVbmlxdWVJZCwgc2VydmljZUlkLCB0aGlzLmRvbWFpbk5hbWUpO1xuXG4gICAgLy8gVGVsbCBBV1MgdG8gdmVyaWZ5IHRoYXQgdGhpcyBhY2NvdW50IG93bnMgdGhlIGRvbWFpbiBhdHRhY2hlZCB0byB0aGUgc2VydmljZVxuICAgIHRoaXMudmVyaWZ5UHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24ocHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24sIHByb3BzLnB1YmxpY0hvc3RlZFpvbmUpO1xuXG4gICAgLy8gRmluYWxseSwgZG9uJ3QgZG8gYW55IG9mIHRoZSBhYm92ZSBiZWZvcmUgdGhlIGVuZHBvaW50IHNlcnZpY2UgaXMgY3JlYXRlZFxuICAgIHRoaXMubm9kZS5hZGREZXBlbmRlbmN5KHByb3BzLmVuZHBvaW50U2VydmljZSk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUHJvcHMocHJvcHM6IFZwY0VuZHBvaW50U2VydmljZURvbWFpbk5hbWVQcm9wcyk6IHZvaWQge1xuICAgIGNvbnN0IHNlcnZpY2VVbmlxdWVJZCA9IE5hbWVzLm5vZGVVbmlxdWVJZChwcm9wcy5lbmRwb2ludFNlcnZpY2Uubm9kZSk7XG4gICAgaWYgKHNlcnZpY2VVbmlxdWVJZCBpbiBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lLmVuZHBvaW50U2VydmljZXNNYXApIHtcbiAgICAgIGNvbnN0IGVuZHBvaW50ID0gVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZS5lbmRwb2ludFNlcnZpY2VzTWFwW3NlcnZpY2VVbmlxdWVJZF07XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBDYW5ub3QgY3JlYXRlIGEgVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZSBmb3Igc2VydmljZSAke3NlcnZpY2VVbmlxdWVJZH0sIGFub3RoZXIgVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZSAoJHtlbmRwb2ludH0pIGlzIGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIGl0YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgQ3VzdG9tIFJlc291cmNlcyB0byBtYWtlIEFXUyBjYWxscyB0byBzZXQgdXAgUHJpdmF0ZSBETlMgb24gYW4gZW5kcG9pbnQgc2VydmljZSxcbiAgICogcmV0dXJuaW5nIHRoZSB2YWx1ZXMgdG8gdXNlIGluIGEgVHh0UmVjb3JkLCB3aGljaCBBV1MgdXNlcyB0byB2ZXJpZnkgZG9tYWluIG93bmVyc2hpcC5cbiAgICovXG4gIHByaXZhdGUgZ2V0UHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24oc2VydmljZVVuaXF1ZUlkOiBzdHJpbmcsIHNlcnZpY2VJZDogc3RyaW5nLCBwcml2YXRlRG5zTmFtZTogc3RyaW5nKTogUHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24ge1xuXG4gICAgLy8gVGhlIGN1c3RvbSByZXNvdXJjZSB3aGljaCB0ZWxscyBBV1MgdG8gZW5hYmxlIFByaXZhdGUgRE5TIG9uIHRoZSBnaXZlbiBzZXJ2aWNlLCB1c2luZyB0aGUgZ2l2ZW4gZG9tYWluIG5hbWVcbiAgICAvLyBBV1Mgd2lsbCBnZW5lcmF0ZSBhIG5hbWUvdmFsdWUgcGFpciBmb3IgdXNlIGluIGEgVHh0UmVjb3JkLCB3aGljaCBpcyB1c2VkIHRvIHZlcmlmeSBkb21haW4gb3duZXJzaGlwLlxuICAgIGNvbnN0IGVuYWJsZVByaXZhdGVEbnNBY3Rpb24gPSB7XG4gICAgICBzZXJ2aWNlOiAnRUMyJyxcbiAgICAgIGFjdGlvbjogJ21vZGlmeVZwY0VuZHBvaW50U2VydmljZUNvbmZpZ3VyYXRpb24nLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBTZXJ2aWNlSWQ6IHNlcnZpY2VJZCxcbiAgICAgICAgUHJpdmF0ZURuc05hbWU6IHByaXZhdGVEbnNOYW1lLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKHNlcnZpY2VVbmlxdWVJZCksXG4gICAgfTtcbiAgICBjb25zdCByZW1vdmVQcml2YXRlRG5zQWN0aW9uID0ge1xuICAgICAgc2VydmljZTogJ0VDMicsXG4gICAgICBhY3Rpb246ICdtb2RpZnlWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9uJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgU2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgIFJlbW92ZVByaXZhdGVEbnNOYW1lOiB0cnVlLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IGVuYWJsZSA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLCAnRW5hYmxlRG5zJywge1xuICAgICAgb25DcmVhdGU6IGVuYWJsZVByaXZhdGVEbnNBY3Rpb24sXG4gICAgICBvblVwZGF0ZTogZW5hYmxlUHJpdmF0ZURuc0FjdGlvbixcbiAgICAgIG9uRGVsZXRlOiByZW1vdmVQcml2YXRlRG5zQWN0aW9uLFxuICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICBGbi5qb2luKCc6JywgW1xuICAgICAgICAgICAgJ2FybicsXG4gICAgICAgICAgICBTdGFjay5vZih0aGlzKS5wYXJ0aXRpb24sXG4gICAgICAgICAgICAnZWMyJyxcbiAgICAgICAgICAgIFN0YWNrLm9mKHRoaXMpLnJlZ2lvbixcbiAgICAgICAgICAgIFN0YWNrLm9mKHRoaXMpLmFjY291bnQsXG4gICAgICAgICAgICBGbi5qb2luKCcvJywgW1xuICAgICAgICAgICAgICAndnBjLWVuZHBvaW50LXNlcnZpY2UnLFxuICAgICAgICAgICAgICBzZXJ2aWNlSWQsXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgICAgLy8gQVBJcyBhcmUgYXZhaWxhYmxlIGluIDIuMTA1NS4wXG4gICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIExvb2sgdXAgdGhlIG5hbWUvdmFsdWUgcGFpciBpZiB0aGUgZG9tYWluIGNoYW5nZXMsIG9yIHRoZSBzZXJ2aWNlIGNoYW5nZXMsXG4gICAgLy8gd2hpY2ggd291bGQgY2F1c2UgdGhlIHZhbHVlcyB0byBiZSBkaWZmZXJlbnQuIElmIHRoZSB1bmlxdWUgSUQgY2hhbmdlcyxcbiAgICAvLyB0aGUgcmVzb3VyY2UgbWF5IGJlIGVudGlyZWx5IHJlY3JlYXRlZCwgc28gd2Ugd2lsbCBuZWVkIHRvIGxvb2sgaXQgdXAgYWdhaW4uXG4gICAgY29uc3QgbG9va3VwID0gaGFzaGNvZGUoTmFtZXMudW5pcXVlSWQodGhpcykgKyBzZXJ2aWNlVW5pcXVlSWQgKyBwcml2YXRlRG5zTmFtZSk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIGN1c3RvbSByZXNvdXJjZSB0byBsb29rIHVwIHRoZSBuYW1lL3ZhbHVlIHBhaXIgZ2VuZXJhdGVkIGJ5IEFXU1xuICAgIC8vIGFmdGVyIHRoZSBwcmV2aW91cyBBUEkgY2FsbFxuICAgIGNvbnN0IHJldHJpZXZlTmFtZVZhbHVlUGFpckFjdGlvbiA9IHtcbiAgICAgIHNlcnZpY2U6ICdFQzInLFxuICAgICAgYWN0aW9uOiAnZGVzY3JpYmVWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9ucycsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNlcnZpY2VJZHM6IFtzZXJ2aWNlSWRdLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKGxvb2t1cCksXG4gICAgfTtcbiAgICBjb25zdCBnZXROYW1lcyA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLCAnR2V0TmFtZXMnLCB7XG4gICAgICBvbkNyZWF0ZTogcmV0cmlldmVOYW1lVmFsdWVQYWlyQWN0aW9uLFxuICAgICAgb25VcGRhdGU6IHJldHJpZXZlTmFtZVZhbHVlUGFpckFjdGlvbixcbiAgICAgIC8vIGRlc2NyaWJlVnBjRW5kcG9pbnRTZXJ2aWNlQ29uZmlndXJhdGlvbnMgY2FuJ3QgdGFrZSBhbiBBUk4gZm9yIGdyYW51bGFyIHBlcm1pc3Npb25zXG4gICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7XG4gICAgICAgIHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFLFxuICAgICAgfSksXG4gICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdlIG9ubHkgd2FudCB0byBjYWxsIGFuZCBnZXQgdGhlIG5hbWUvdmFsdWUgcGFpciBhZnRlciB3ZSd2ZSB0b2xkIEFXUyB0byBlbmFibGUgUHJpdmF0ZSBETlNcbiAgICAvLyBJZiB3ZSBjYWxsIGJlZm9yZSB0aGVuLCB3ZSdsbCBnZXQgYW4gZW1wdHkgcGFpciBvZiB2YWx1ZXMuXG4gICAgZ2V0TmFtZXMubm9kZS5hZGREZXBlbmRlbmN5KGVuYWJsZSk7XG5cbiAgICAvLyBHZXQgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIG5hbWUvdmFsdWUgcGFpciBhc3NvY2lhdGVkIHdpdGggdGhlIGVuZHBvaW50IHNlcnZpY2VcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZXMuZ2V0UmVzcG9uc2VGaWVsZCgnU2VydmljZUNvbmZpZ3VyYXRpb25zLjAuUHJpdmF0ZURuc05hbWVDb25maWd1cmF0aW9uLk5hbWUnKTtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE5hbWVzLmdldFJlc3BvbnNlRmllbGQoJ1NlcnZpY2VDb25maWd1cmF0aW9ucy4wLlByaXZhdGVEbnNOYW1lQ29uZmlndXJhdGlvbi5WYWx1ZScpO1xuXG4gICAgcmV0dXJuIHsgbmFtZSwgdmFsdWUsIHNlcnZpY2VJZCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBSb3V0ZTUzIGVudHJ5IGFuZCBhIEN1c3RvbSBSZXNvdXJjZSB3aGljaCBleHBsaWNpdGx5IHRlbGxzIEFXUyB0byB2ZXJpZnkgb3duZXJzaGlwXG4gICAqIG9mIHRoZSBkb21haW4gbmFtZSBhdHRhY2hlZCB0byBhbiBlbmRwb2ludCBzZXJ2aWNlLlxuICAgKi9cbiAgcHJpdmF0ZSB2ZXJpZnlQcml2YXRlRG5zQ29uZmlndXJhdGlvbihjb25maWc6IFByaXZhdGVEbnNDb25maWd1cmF0aW9uLCBwdWJsaWNIb3N0ZWRab25lOiBJUHVibGljSG9zdGVkWm9uZSkge1xuICAgIC8vIENyZWF0ZSB0aGUgVFhUIHJlY29yZCBpbiB0aGUgcHJvdmlkZWQgaG9zdGVkIHpvbmVcbiAgICBjb25zdCB2ZXJpZmljYXRpb25SZWNvcmQgPSBuZXcgVHh0UmVjb3JkKHRoaXMsICdEbnNWZXJpZmljYXRpb25SZWNvcmQnLCB7XG4gICAgICByZWNvcmROYW1lOiBjb25maWcubmFtZSxcbiAgICAgIHZhbHVlczogW2NvbmZpZy52YWx1ZV0sXG4gICAgICB6b25lOiBwdWJsaWNIb3N0ZWRab25lLFxuICAgIH0pO1xuXG4gICAgLy8gVGVsbCB0aGUgZW5kcG9pbnQgc2VydmljZSB0byB2ZXJpZnkgdGhlIGRvbWFpbiBvd25lcnNoaXBcbiAgICBjb25zdCBzdGFydFZlcmlmaWNhdGlvbkFjdGlvbiA9IHtcbiAgICAgIHNlcnZpY2U6ICdFQzInLFxuICAgICAgYWN0aW9uOiAnc3RhcnRWcGNFbmRwb2ludFNlcnZpY2VQcml2YXRlRG5zVmVyaWZpY2F0aW9uJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgU2VydmljZUlkOiBjb25maWcuc2VydmljZUlkLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKEZuLmpvaW4oJzonLCBbY29uZmlnLm5hbWUsIGNvbmZpZy52YWx1ZV0pKSxcbiAgICB9O1xuICAgIGNvbnN0IHN0YXJ0VmVyaWZpY2F0aW9uID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHRoaXMsICdTdGFydFZlcmlmaWNhdGlvbicsIHtcbiAgICAgIG9uQ3JlYXRlOiBzdGFydFZlcmlmaWNhdGlvbkFjdGlvbixcbiAgICAgIG9uVXBkYXRlOiBzdGFydFZlcmlmaWNhdGlvbkFjdGlvbixcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgRm4uam9pbignOicsIFtcbiAgICAgICAgICAgICdhcm4nLFxuICAgICAgICAgICAgU3RhY2sub2YodGhpcykucGFydGl0aW9uLFxuICAgICAgICAgICAgJ2VjMicsXG4gICAgICAgICAgICBTdGFjay5vZih0aGlzKS5yZWdpb24sXG4gICAgICAgICAgICBTdGFjay5vZih0aGlzKS5hY2NvdW50LFxuICAgICAgICAgICAgRm4uam9pbignLycsIFtcbiAgICAgICAgICAgICAgJ3ZwYy1lbmRwb2ludC1zZXJ2aWNlJyxcbiAgICAgICAgICAgICAgY29uZmlnLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICB9KTtcbiAgICAvLyBPbmx5IHZlcmlmeSBhZnRlciB0aGUgcmVjb3JkIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICBzdGFydFZlcmlmaWNhdGlvbi5ub2RlLmFkZERlcGVuZGVuY3kodmVyaWZpY2F0aW9uUmVjb3JkKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudCB0aGUgbmFtZS92YWx1ZSBwYWlyIGFzc29jaWF0ZWQgd2l0aCBhIFByaXZhdGUgRE5TIGVuYWJsZWQgZW5kcG9pbnQgc2VydmljZVxuICovXG5pbnRlcmZhY2UgUHJpdmF0ZURuc0NvbmZpZ3VyYXRpb24ge1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlcnZpY2VJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEhhc2ggYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaGFzaGNvZGUoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG1kNWhhc2gocyk7XG59OyJdfQ==