"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceleratorSecurityGroupPeer = void 0;
const ec2 = require("@aws-cdk/aws-ec2");
const custom_resources_1 = require("@aws-cdk/custom-resources");
/**
 * The security group used by a Global Accelerator to send traffic to resources in a VPC.
 */
class AcceleratorSecurityGroupPeer {
    constructor(securityGroupId) {
        this.securityGroupId = securityGroupId;
        this.canInlineRule = false;
        this.connections = new ec2.Connections({ peer: this });
        this.uniqueId = 'GlobalAcceleratorGroup';
    }
    /**
     * Lookup the Global Accelerator security group at CloudFormation deployment time.
     *
     * As of this writing, Global Accelerators (AGA) create a single security group per VPC. AGA security groups are shared
     * by all AGAs in an account. Additionally, there is no CloudFormation mechanism to reference the AGA security groups.
     *
     * This makes creating security group rules which allow traffic from an AGA complicated in CDK. This lookup will identify
     * the AGA security group for a given VPC at CloudFormation deployment time, and lets you create rules for traffic from AGA
     * to other resources created by CDK.
     */
    static fromVpc(scope, id, vpc, endpointGroup) {
        // The security group name is always 'GlobalAccelerator'
        const globalAcceleratorSGName = 'GlobalAccelerator';
        // How to reference the security group name in the response from EC2
        const ec2ResponseSGIdField = 'SecurityGroups.0.GroupId';
        // The AWS Custom Resource that make a call to EC2 to get the security group ID, for the given VPC
        const lookupAcceleratorSGCustomResource = new custom_resources_1.AwsCustomResource(scope, id + 'CustomResource', {
            onCreate: {
                service: 'EC2',
                action: 'describeSecurityGroups',
                parameters: {
                    Filters: [
                        {
                            Name: 'group-name',
                            Values: [
                                globalAcceleratorSGName,
                            ],
                        },
                        {
                            Name: 'vpc-id',
                            Values: [
                                vpc.vpcId,
                            ],
                        },
                    ],
                },
                // We get back a list of responses, but the list should be of length 0 or 1
                // Getting no response means no resources have been linked to the AGA
                physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse(ec2ResponseSGIdField),
            },
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
            // APIs are available in 2.1055.0
            installLatestAwsSdk: false,
        });
        // We add a dependency on the endpoint group, guaranteeing that CloudFormation won't
        // try and look up the SG before AGA creates it. The SG is created when a VPC resource
        // is associated with an AGA
        lookupAcceleratorSGCustomResource.node.addDependency(endpointGroup.node.defaultChild);
        // Look up the security group ID
        return new AcceleratorSecurityGroupPeer(lookupAcceleratorSGCustomResource.getResponseField(ec2ResponseSGIdField));
    }
    toIngressRuleConfig() {
        return { sourceSecurityGroupId: this.securityGroupId };
    }
    toEgressRuleConfig() {
        return { destinationSecurityGroupId: this.securityGroupId };
    }
}
exports.AcceleratorSecurityGroupPeer = AcceleratorSecurityGroupPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2FjY2VsZXJhdG9yLXNlY3VyaXR5LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2FjY2VsZXJhdG9yLXNlY3VyaXR5LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF3QztBQUd4QyxnRUFBMkc7QUFJM0c7O0dBRUc7QUFDSCxNQUFhLDRCQUE0QjtJQWdFdkMsWUFBcUMsZUFBdUI7UUFBdkIsb0JBQWUsR0FBZixlQUFlLENBQVE7UUFKNUMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIsZ0JBQVcsR0FBb0IsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkUsYUFBUSxHQUFXLHdCQUF3QixDQUFDO0tBRzNEO0lBaEVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsR0FBYSxFQUFFLGFBQTRCO1FBRTdGLHdEQUF3RDtRQUN4RCxNQUFNLHVCQUF1QixHQUFHLG1CQUFtQixDQUFDO1FBRXBELG9FQUFvRTtRQUNwRSxNQUFNLG9CQUFvQixHQUFHLDBCQUEwQixDQUFDO1FBRXhELGtHQUFrRztRQUNsRyxNQUFNLGlDQUFpQyxHQUFHLElBQUksb0NBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxnQkFBZ0IsRUFBRTtZQUM1RixRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFLHdCQUF3QjtnQkFDaEMsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRTt3QkFDUDs0QkFDRSxJQUFJLEVBQUUsWUFBWTs0QkFDbEIsTUFBTSxFQUFFO2dDQUNOLHVCQUF1Qjs2QkFDeEI7eUJBQ0Y7d0JBQ0Q7NEJBQ0UsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsTUFBTSxFQUFFO2dDQUNOLEdBQUcsQ0FBQyxLQUFLOzZCQUNWO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELDJFQUEyRTtnQkFDM0UscUVBQXFFO2dCQUNyRSxrQkFBa0IsRUFBRSxxQ0FBa0IsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7YUFDMUU7WUFDRCxNQUFNLEVBQUUsMENBQXVCLENBQUMsWUFBWSxDQUFDO2dCQUMzQyxTQUFTLEVBQUUsMENBQXVCLENBQUMsWUFBWTthQUNoRCxDQUFDO1lBQ0YsaUNBQWlDO1lBQ2pDLG1CQUFtQixFQUFFLEtBQUs7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsb0ZBQW9GO1FBQ3BGLHNGQUFzRjtRQUN0Riw0QkFBNEI7UUFDNUIsaUNBQWlDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQTJCLENBQUMsQ0FBQztRQUVyRyxnQ0FBZ0M7UUFDaEMsT0FBTyxJQUFJLDRCQUE0QixDQUFDLGlDQUFpQyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztLQUNuSDtJQVNNLG1CQUFtQjtRQUN4QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0tBQ3hEO0lBRU0sa0JBQWtCO1FBQ3ZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDN0Q7Q0FDRjtBQTFFRCxvRUEwRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5cbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3ksIFBoeXNpY2FsUmVzb3VyY2VJZCB9IGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBFbmRwb2ludEdyb3VwIH0gZnJvbSAnLi4vbGliJztcblxuLyoqXG4gKiBUaGUgc2VjdXJpdHkgZ3JvdXAgdXNlZCBieSBhIEdsb2JhbCBBY2NlbGVyYXRvciB0byBzZW5kIHRyYWZmaWMgdG8gcmVzb3VyY2VzIGluIGEgVlBDLlxuICovXG5leHBvcnQgY2xhc3MgQWNjZWxlcmF0b3JTZWN1cml0eUdyb3VwUGVlciBpbXBsZW1lbnRzIGVjMi5JUGVlciB7XG4gIC8qKlxuICAgKiBMb29rdXAgdGhlIEdsb2JhbCBBY2NlbGVyYXRvciBzZWN1cml0eSBncm91cCBhdCBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHRpbWUuXG4gICAqXG4gICAqIEFzIG9mIHRoaXMgd3JpdGluZywgR2xvYmFsIEFjY2VsZXJhdG9ycyAoQUdBKSBjcmVhdGUgYSBzaW5nbGUgc2VjdXJpdHkgZ3JvdXAgcGVyIFZQQy4gQUdBIHNlY3VyaXR5IGdyb3VwcyBhcmUgc2hhcmVkXG4gICAqIGJ5IGFsbCBBR0FzIGluIGFuIGFjY291bnQuIEFkZGl0aW9uYWxseSwgdGhlcmUgaXMgbm8gQ2xvdWRGb3JtYXRpb24gbWVjaGFuaXNtIHRvIHJlZmVyZW5jZSB0aGUgQUdBIHNlY3VyaXR5IGdyb3Vwcy5cbiAgICpcbiAgICogVGhpcyBtYWtlcyBjcmVhdGluZyBzZWN1cml0eSBncm91cCBydWxlcyB3aGljaCBhbGxvdyB0cmFmZmljIGZyb20gYW4gQUdBIGNvbXBsaWNhdGVkIGluIENESy4gVGhpcyBsb29rdXAgd2lsbCBpZGVudGlmeVxuICAgKiB0aGUgQUdBIHNlY3VyaXR5IGdyb3VwIGZvciBhIGdpdmVuIFZQQyBhdCBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHRpbWUsIGFuZCBsZXRzIHlvdSBjcmVhdGUgcnVsZXMgZm9yIHRyYWZmaWMgZnJvbSBBR0FcbiAgICogdG8gb3RoZXIgcmVzb3VyY2VzIGNyZWF0ZWQgYnkgQ0RLLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVnBjKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHZwYzogZWMyLklWcGMsIGVuZHBvaW50R3JvdXA6IEVuZHBvaW50R3JvdXApIHtcblxuICAgIC8vIFRoZSBzZWN1cml0eSBncm91cCBuYW1lIGlzIGFsd2F5cyAnR2xvYmFsQWNjZWxlcmF0b3InXG4gICAgY29uc3QgZ2xvYmFsQWNjZWxlcmF0b3JTR05hbWUgPSAnR2xvYmFsQWNjZWxlcmF0b3InO1xuXG4gICAgLy8gSG93IHRvIHJlZmVyZW5jZSB0aGUgc2VjdXJpdHkgZ3JvdXAgbmFtZSBpbiB0aGUgcmVzcG9uc2UgZnJvbSBFQzJcbiAgICBjb25zdCBlYzJSZXNwb25zZVNHSWRGaWVsZCA9ICdTZWN1cml0eUdyb3Vwcy4wLkdyb3VwSWQnO1xuXG4gICAgLy8gVGhlIEFXUyBDdXN0b20gUmVzb3VyY2UgdGhhdCBtYWtlIGEgY2FsbCB0byBFQzIgdG8gZ2V0IHRoZSBzZWN1cml0eSBncm91cCBJRCwgZm9yIHRoZSBnaXZlbiBWUENcbiAgICBjb25zdCBsb29rdXBBY2NlbGVyYXRvclNHQ3VzdG9tUmVzb3VyY2UgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc2NvcGUsIGlkICsgJ0N1c3RvbVJlc291cmNlJywge1xuICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgc2VydmljZTogJ0VDMicsXG4gICAgICAgIGFjdGlvbjogJ2Rlc2NyaWJlU2VjdXJpdHlHcm91cHMnLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgRmlsdGVyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnZ3JvdXAtbmFtZScsXG4gICAgICAgICAgICAgIFZhbHVlczogW1xuICAgICAgICAgICAgICAgIGdsb2JhbEFjY2VsZXJhdG9yU0dOYW1lLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ3ZwYy1pZCcsXG4gICAgICAgICAgICAgIFZhbHVlczogW1xuICAgICAgICAgICAgICAgIHZwYy52cGNJZCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gV2UgZ2V0IGJhY2sgYSBsaXN0IG9mIHJlc3BvbnNlcywgYnV0IHRoZSBsaXN0IHNob3VsZCBiZSBvZiBsZW5ndGggMCBvciAxXG4gICAgICAgIC8vIEdldHRpbmcgbm8gcmVzcG9uc2UgbWVhbnMgbm8gcmVzb3VyY2VzIGhhdmUgYmVlbiBsaW5rZWQgdG8gdGhlIEFHQVxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoZWMyUmVzcG9uc2VTR0lkRmllbGQpLFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UsXG4gICAgICB9KSxcbiAgICAgIC8vIEFQSXMgYXJlIGF2YWlsYWJsZSBpbiAyLjEwNTUuMFxuICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXZSBhZGQgYSBkZXBlbmRlbmN5IG9uIHRoZSBlbmRwb2ludCBncm91cCwgZ3VhcmFudGVlaW5nIHRoYXQgQ2xvdWRGb3JtYXRpb24gd29uJ3RcbiAgICAvLyB0cnkgYW5kIGxvb2sgdXAgdGhlIFNHIGJlZm9yZSBBR0EgY3JlYXRlcyBpdC4gVGhlIFNHIGlzIGNyZWF0ZWQgd2hlbiBhIFZQQyByZXNvdXJjZVxuICAgIC8vIGlzIGFzc29jaWF0ZWQgd2l0aCBhbiBBR0FcbiAgICBsb29rdXBBY2NlbGVyYXRvclNHQ3VzdG9tUmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGVuZHBvaW50R3JvdXAubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpO1xuXG4gICAgLy8gTG9vayB1cCB0aGUgc2VjdXJpdHkgZ3JvdXAgSURcbiAgICByZXR1cm4gbmV3IEFjY2VsZXJhdG9yU2VjdXJpdHlHcm91cFBlZXIobG9va3VwQWNjZWxlcmF0b3JTR0N1c3RvbVJlc291cmNlLmdldFJlc3BvbnNlRmllbGQoZWMyUmVzcG9uc2VTR0lkRmllbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjYW5JbmxpbmVSdWxlID0gZmFsc2U7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7IHBlZXI6IHRoaXMgfSk7XG4gIHB1YmxpYyByZWFkb25seSB1bmlxdWVJZDogc3RyaW5nID0gJ0dsb2JhbEFjY2VsZXJhdG9yR3JvdXAnO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZykge1xuICB9XG5cbiAgcHVibGljIHRvSW5ncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBzb3VyY2VTZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkIH07XG4gIH1cblxuICBwdWJsaWMgdG9FZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgZGVzdGluYXRpb25TZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkIH07XG4gIH1cbn1cbiJdfQ==