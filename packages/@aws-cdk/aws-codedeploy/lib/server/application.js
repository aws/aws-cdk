"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerApplication = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const codedeploy_generated_1 = require("../codedeploy.generated");
const utils_1 = require("../private/utils");
/**
 * A CodeDeploy Application that deploys to EC2/on-premise instances.
 *
 * @resource AWS::CodeDeploy::Application
 */
class ServerApplication extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.applicationName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_ServerApplicationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServerApplication);
            }
            throw error;
        }
        const resource = new codedeploy_generated_1.CfnApplication(this, 'Resource', {
            applicationName: this.physicalName,
            computePlatform: 'Server',
        });
        this.applicationName = this.getResourceNameAttribute(resource.ref);
        this.applicationArn = this.getResourceArnAttribute(utils_1.arnForApplication(core_1.Stack.of(scope), resource.ref), {
            service: 'codedeploy',
            resource: 'application',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.node.addValidation({ validate: () => utils_1.validateName('Application', this.physicalName) });
    }
    /**
     * Import an Application defined either outside the CDK app, or in a different region.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromServerApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param serverApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromServerApplicationName(scope, id, serverApplicationName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = utils_1.arnForApplication(core_1.Stack.of(scope), serverApplicationName);
                this.applicationName = serverApplicationName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param serverApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromServerApplicationArn(scope, id, serverApplicationArn) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = serverApplicationArn;
                this.applicationName = core_1.Arn.split(serverApplicationArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '<invalid arn>';
            }
        }(scope, id, { environmentFromArn: serverApplicationArn });
    }
}
exports.ServerApplication = ServerApplication;
_a = JSII_RTTI_SYMBOL_1;
ServerApplication[_a] = { fqn: "@aws-cdk/aws-codedeploy.ServerApplication", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMkU7QUFFM0Usa0VBQXlEO0FBQ3pELDRDQUFtRTtBQWdDbkU7Ozs7R0FJRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsZUFBUTtJQXVDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFnQyxFQUFFO1FBQzFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQzs7Ozs7OytDQTFDTSxpQkFBaUI7Ozs7UUE0QzFCLE1BQU0sUUFBUSxHQUFHLElBQUkscUNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUNsQyxlQUFlLEVBQUUsUUFBUTtTQUMxQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMseUJBQWlCLENBQUMsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkcsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBWSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzdGO0lBekREOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUscUJBQTZCO1FBQ2pHLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixtQkFBYyxHQUFHLHlCQUFpQixDQUFDLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFDM0Usb0JBQWUsR0FBRyxxQkFBcUIsQ0FBQztZQUMxRCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsd0JBQXdCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsb0JBQTRCO1FBQy9GLE9BQU8sSUFBSSxLQUFNLFNBQVEsZUFBUTtZQUF0Qjs7Z0JBQ0YsbUJBQWMsR0FBRyxvQkFBb0IsQ0FBQztnQkFDdEMsb0JBQWUsR0FBRyxVQUFHLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLElBQUksZUFBZSxDQUFDO1lBQzFILENBQUM7U0FBQSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7S0FDNUQ7O0FBbENILDhDQTREQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFybkZvcm1hdCwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIEFybiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5BcHBsaWNhdGlvbiB9IGZyb20gJy4uL2NvZGVkZXBsb3kuZ2VuZXJhdGVkJztcbmltcG9ydCB7IGFybkZvckFwcGxpY2F0aW9uLCB2YWxpZGF0ZU5hbWUgfSBmcm9tICcuLi9wcml2YXRlL3V0aWxzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVmZXJlbmNlIHRvIGEgQ29kZURlcGxveSBBcHBsaWNhdGlvbiBkZXBsb3lpbmcgdG8gRUMyL29uLXByZW1pc2UgaW5zdGFuY2VzLlxuICpcbiAqIElmIHlvdSdyZSBtYW5hZ2luZyB0aGUgQXBwbGljYXRpb24gYWxvbmdzaWRlIHRoZSByZXN0IG9mIHlvdXIgQ0RLIHJlc291cmNlcyxcbiAqIHVzZSB0aGUgYFNlcnZlckFwcGxpY2F0aW9uYCBjbGFzcy5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byByZWZlcmVuY2UgYW4gYWxyZWFkeSBleGlzdGluZyBBcHBsaWNhdGlvbixcbiAqIG9yIG9uZSBkZWZpbmVkIGluIGEgZGlmZmVyZW50IENESyBTdGFjayxcbiAqIHVzZSB0aGUgYCNmcm9tU2VydmVyQXBwbGljYXRpb25OYW1lYCBtZXRob2QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNlcnZlckFwcGxpY2F0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25Bcm46IHN0cmluZztcblxuICAvKiogQGF0dHJpYnV0ZSAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYFNlcnZlckFwcGxpY2F0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2ZXJBcHBsaWNhdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCwgaHVtYW4tcmVhZGFibGUgbmFtZSBvZiB0aGUgQ29kZURlcGxveSBBcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgYW4gYXV0by1nZW5lcmF0ZWQgbmFtZSB3aWxsIGJlIHVzZWRcbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIENvZGVEZXBsb3kgQXBwbGljYXRpb24gdGhhdCBkZXBsb3lzIHRvIEVDMi9vbi1wcmVtaXNlIGluc3RhbmNlcy5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpDb2RlRGVwbG95OjpBcHBsaWNhdGlvblxuICovXG5leHBvcnQgY2xhc3MgU2VydmVyQXBwbGljYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTZXJ2ZXJBcHBsaWNhdGlvbiB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gQXBwbGljYXRpb24gZGVmaW5lZCBlaXRoZXIgb3V0c2lkZSB0aGUgQ0RLIGFwcCwgb3IgaW4gYSBkaWZmZXJlbnQgcmVnaW9uLlxuICAgKlxuICAgKiBUaGUgQXBwbGljYXRpb24ncyBhY2NvdW50IGFuZCByZWdpb24gYXJlIGFzc3VtZWQgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIHN0YWNrIGl0IGlzIGJlaW5nIGltcG9ydGVkXG4gICAqIGludG8uIElmIG5vdCwgdXNlIGBmcm9tU2VydmVyQXBwbGljYXRpb25Bcm5gLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgbmV3IENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgdGhlIGxvZ2ljYWwgSUQgb2YgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBzZXJ2ZXJBcHBsaWNhdGlvbk5hbWUgdGhlIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uIHRvIGltcG9ydFxuICAgKiBAcmV0dXJucyBhIENvbnN0cnVjdCByZXByZXNlbnRpbmcgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgQXBwbGljYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlcnZlckFwcGxpY2F0aW9uTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZXJ2ZXJBcHBsaWNhdGlvbk5hbWU6IHN0cmluZyk6IElTZXJ2ZXJBcHBsaWNhdGlvbiB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU2VydmVyQXBwbGljYXRpb24ge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uQXJuID0gYXJuRm9yQXBwbGljYXRpb24oU3RhY2sub2Yoc2NvcGUpLCBzZXJ2ZXJBcHBsaWNhdGlvbk5hbWUpO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uTmFtZSA9IHNlcnZlckFwcGxpY2F0aW9uTmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBBcHBsaWNhdGlvbiBkZWZpbmVkIGVpdGhlciBvdXRzaWRlIHRoZSBDREssIG9yIGluIGEgZGlmZmVyZW50IENESyBTdGFjaywgYnkgQVJOLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgbmV3IENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgdGhlIGxvZ2ljYWwgSUQgb2YgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBzZXJ2ZXJBcHBsaWNhdGlvbkFybiB0aGUgQVJOIG9mIHRoZSBhcHBsaWNhdGlvbiB0byBpbXBvcnRcbiAgICogQHJldHVybnMgYSBDb25zdHJ1Y3QgcmVwcmVzZW50aW5nIGEgcmVmZXJlbmNlIHRvIGFuIGV4aXN0aW5nIEFwcGxpY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZXJ2ZXJBcHBsaWNhdGlvbkFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZXJ2ZXJBcHBsaWNhdGlvbkFybjogc3RyaW5nKTogSVNlcnZlckFwcGxpY2F0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU2VydmVyQXBwbGljYXRpb24ge1xuICAgICAgcHVibGljIGFwcGxpY2F0aW9uQXJuID0gc2VydmVyQXBwbGljYXRpb25Bcm47XG4gICAgICBwdWJsaWMgYXBwbGljYXRpb25OYW1lID0gQXJuLnNwbGl0KHNlcnZlckFwcGxpY2F0aW9uQXJuLCBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lID8/ICc8aW52YWxpZCBhcm4+JztcbiAgICB9KHNjb3BlLCBpZCwgeyBlbnZpcm9ubWVudEZyb21Bcm46IHNlcnZlckFwcGxpY2F0aW9uQXJuIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2VydmVyQXBwbGljYXRpb25Qcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmFwcGxpY2F0aW9uTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkFwcGxpY2F0aW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBjb21wdXRlUGxhdGZvcm06ICdTZXJ2ZXInLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIHRoaXMuYXBwbGljYXRpb25Bcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKGFybkZvckFwcGxpY2F0aW9uKFN0YWNrLm9mKHNjb3BlKSwgcmVzb3VyY2UucmVmKSwge1xuICAgICAgc2VydmljZTogJ2NvZGVkZXBsb3knLFxuICAgICAgcmVzb3VyY2U6ICdhcHBsaWNhdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHZhbGlkYXRlTmFtZSgnQXBwbGljYXRpb24nLCB0aGlzLnBoeXNpY2FsTmFtZSkgfSk7XG4gIH1cblxufVxuIl19