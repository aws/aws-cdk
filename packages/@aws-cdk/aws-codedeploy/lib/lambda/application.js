"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaApplication = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const codedeploy_generated_1 = require("../codedeploy.generated");
const utils_1 = require("../private/utils");
/**
 * A CodeDeploy Application that deploys to an AWS Lambda function.
 *
 * @resource AWS::CodeDeploy::Application
 */
class LambdaApplication extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.applicationName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_LambdaApplicationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaApplication);
            }
            throw error;
        }
        const resource = new codedeploy_generated_1.CfnApplication(this, 'Resource', {
            applicationName: this.physicalName,
            computePlatform: 'Lambda',
        });
        this.applicationName = this.getResourceNameAttribute(resource.ref);
        this.applicationArn = this.getResourceArnAttribute(utils_1.arnForApplication(core_1.Stack.of(this), resource.ref), {
            service: 'codedeploy',
            resource: 'application',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.node.addValidation({ validate: () => utils_1.validateName('Application', this.physicalName) });
    }
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromLambdaApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param lambdaApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromLambdaApplicationName(scope, id, lambdaApplicationName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = utils_1.arnForApplication(core_1.Stack.of(scope), lambdaApplicationName);
                this.applicationName = lambdaApplicationName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param lambdaApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromLambdaApplicationArn(scope, id, lambdaApplicationArn) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = lambdaApplicationArn;
                this.applicationName = core_1.Arn.split(lambdaApplicationArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '<invalid arn>';
            }
        }(scope, id, { environmentFromArn: lambdaApplicationArn });
    }
}
exports.LambdaApplication = LambdaApplication;
_a = JSII_RTTI_SYMBOL_1;
LambdaApplication[_a] = { fqn: "@aws-cdk/aws-codedeploy.LambdaApplication", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMkU7QUFFM0Usa0VBQXlEO0FBQ3pELDRDQUFtRTtBQWdDbkU7Ozs7R0FJRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsZUFBUTtJQXVDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFnQyxFQUFFO1FBQzFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQzs7Ozs7OytDQTFDTSxpQkFBaUI7Ozs7UUE0QzFCLE1BQU0sUUFBUSxHQUFHLElBQUkscUNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUNsQyxlQUFlLEVBQUUsUUFBUTtTQUMxQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMseUJBQWlCLENBQUMsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbEcsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBWSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzdGO0lBekREOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUscUJBQTZCO1FBQ2pHLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNTLG1CQUFjLEdBQUcseUJBQWlCLENBQUMsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUMzRSxvQkFBZSxHQUFHLHFCQUFxQixDQUFDO1lBQ2pELENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxvQkFBNEI7UUFDL0YsT0FBTyxJQUFJLEtBQU0sU0FBUSxlQUFRO1lBQXRCOztnQkFDRixtQkFBYyxHQUFHLG9CQUFvQixDQUFDO2dCQUN0QyxvQkFBZSxHQUFHLFVBQUcsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksSUFBSSxlQUFlLENBQUM7WUFDMUgsQ0FBQztTQUFBLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztLQUM1RDs7QUFsQ0gsOENBMkRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjaywgQXJuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vY29kZWRlcGxveS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgYXJuRm9yQXBwbGljYXRpb24sIHZhbGlkYXRlTmFtZSB9IGZyb20gJy4uL3ByaXZhdGUvdXRpbHMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSByZWZlcmVuY2UgdG8gYSBDb2RlRGVwbG95IEFwcGxpY2F0aW9uIGRlcGxveWluZyB0byBBV1MgTGFtYmRhLlxuICpcbiAqIElmIHlvdSdyZSBtYW5hZ2luZyB0aGUgQXBwbGljYXRpb24gYWxvbmdzaWRlIHRoZSByZXN0IG9mIHlvdXIgQ0RLIHJlc291cmNlcyxcbiAqIHVzZSB0aGUgYExhbWJkYUFwcGxpY2F0aW9uYCBjbGFzcy5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byByZWZlcmVuY2UgYW4gYWxyZWFkeSBleGlzdGluZyBBcHBsaWNhdGlvbixcbiAqIG9yIG9uZSBkZWZpbmVkIGluIGEgZGlmZmVyZW50IENESyBTdGFjayxcbiAqIHVzZSB0aGUgYExhbWJkYUFwcGxpY2F0aW9uI2Zyb21MYW1iZGFBcHBsaWNhdGlvbk5hbWVgIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTGFtYmRhQXBwbGljYXRpb24gZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKiogQGF0dHJpYnV0ZSAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgTGFtYmRhQXBwbGljYXRpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYUFwcGxpY2F0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIHBoeXNpY2FsLCBodW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSBDb2RlRGVwbG95IEFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhbiBhdXRvLWdlbmVyYXRlZCBuYW1lIHdpbGwgYmUgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25OYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgQ29kZURlcGxveSBBcHBsaWNhdGlvbiB0aGF0IGRlcGxveXMgdG8gYW4gQVdTIExhbWJkYSBmdW5jdGlvbi5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpDb2RlRGVwbG95OjpBcHBsaWNhdGlvblxuICovXG5leHBvcnQgY2xhc3MgTGFtYmRhQXBwbGljYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMYW1iZGFBcHBsaWNhdGlvbiB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gQXBwbGljYXRpb24gZGVmaW5lZCBlaXRoZXIgb3V0c2lkZSB0aGUgQ0RLLCBvciBpbiBhIGRpZmZlcmVudCBDREsgU3RhY2suXG4gICAqXG4gICAqIFRoZSBBcHBsaWNhdGlvbidzIGFjY291bnQgYW5kIHJlZ2lvbiBhcmUgYXNzdW1lZCB0byBiZSB0aGUgc2FtZSBhcyB0aGUgc3RhY2sgaXQgaXMgYmVpbmcgaW1wb3J0ZWRcbiAgICogaW50by4gSWYgbm90LCB1c2UgYGZyb21MYW1iZGFBcHBsaWNhdGlvbkFybmAuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCBmb3IgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCB0aGUgbG9naWNhbCBJRCBvZiB0aGlzIG5ldyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGxhbWJkYUFwcGxpY2F0aW9uTmFtZSB0aGUgbmFtZSBvZiB0aGUgYXBwbGljYXRpb24gdG8gaW1wb3J0XG4gICAqIEByZXR1cm5zIGEgQ29uc3RydWN0IHJlcHJlc2VudGluZyBhIHJlZmVyZW5jZSB0byBhbiBleGlzdGluZyBBcHBsaWNhdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTGFtYmRhQXBwbGljYXRpb25OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxhbWJkYUFwcGxpY2F0aW9uTmFtZTogc3RyaW5nKTogSUxhbWJkYUFwcGxpY2F0aW9uIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMYW1iZGFBcHBsaWNhdGlvbiB7XG4gICAgICBwdWJsaWMgYXBwbGljYXRpb25Bcm4gPSBhcm5Gb3JBcHBsaWNhdGlvbihTdGFjay5vZihzY29wZSksIGxhbWJkYUFwcGxpY2F0aW9uTmFtZSk7XG4gICAgICBwdWJsaWMgYXBwbGljYXRpb25OYW1lID0gbGFtYmRhQXBwbGljYXRpb25OYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIEFwcGxpY2F0aW9uIGRlZmluZWQgZWl0aGVyIG91dHNpZGUgdGhlIENESywgb3IgaW4gYSBkaWZmZXJlbnQgQ0RLIFN0YWNrLCBieSBBUk4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCBmb3IgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCB0aGUgbG9naWNhbCBJRCBvZiB0aGlzIG5ldyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGxhbWJkYUFwcGxpY2F0aW9uQXJuIHRoZSBBUk4gb2YgdGhlIGFwcGxpY2F0aW9uIHRvIGltcG9ydFxuICAgKiBAcmV0dXJucyBhIENvbnN0cnVjdCByZXByZXNlbnRpbmcgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgQXBwbGljYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxhbWJkYUFwcGxpY2F0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxhbWJkYUFwcGxpY2F0aW9uQXJuOiBzdHJpbmcpOiBJTGFtYmRhQXBwbGljYXRpb24ge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMYW1iZGFBcHBsaWNhdGlvbiB7XG4gICAgICBwdWJsaWMgYXBwbGljYXRpb25Bcm4gPSBsYW1iZGFBcHBsaWNhdGlvbkFybjtcbiAgICAgIHB1YmxpYyBhcHBsaWNhdGlvbk5hbWUgPSBBcm4uc3BsaXQobGFtYmRhQXBwbGljYXRpb25Bcm4sIEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUgPz8gJzxpbnZhbGlkIGFybj4nO1xuICAgIH0oc2NvcGUsIGlkLCB7IGVudmlyb25tZW50RnJvbUFybjogbGFtYmRhQXBwbGljYXRpb25Bcm4gfSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb25Bcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYW1iZGFBcHBsaWNhdGlvblByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYXBwbGljYXRpb25OYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuQXBwbGljYXRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXBwbGljYXRpb25OYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGNvbXB1dGVQbGF0Zm9ybTogJ0xhbWJkYScsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgdGhpcy5hcHBsaWNhdGlvbkFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUoYXJuRm9yQXBwbGljYXRpb24oU3RhY2sub2YodGhpcyksIHJlc291cmNlLnJlZiksIHtcbiAgICAgIHNlcnZpY2U6ICdjb2RlZGVwbG95JyxcbiAgICAgIHJlc291cmNlOiAnYXBwbGljYXRpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB2YWxpZGF0ZU5hbWUoJ0FwcGxpY2F0aW9uJywgdGhpcy5waHlzaWNhbE5hbWUpIH0pO1xuICB9XG59XG4iXX0=