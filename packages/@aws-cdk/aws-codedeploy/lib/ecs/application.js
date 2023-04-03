"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsApplication = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const codedeploy_generated_1 = require("../codedeploy.generated");
const utils_1 = require("../private/utils");
/**
 * A CodeDeploy Application that deploys to an Amazon ECS service.
 *
 * @resource AWS::CodeDeploy::Application
 */
class EcsApplication extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.applicationName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_EcsApplicationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsApplication);
            }
            throw error;
        }
        const resource = new codedeploy_generated_1.CfnApplication(this, 'Resource', {
            applicationName: this.physicalName,
            computePlatform: 'ECS',
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
     * Import an Application defined either outside the CDK, or in a different CDK Stack.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromEcsApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param ecsApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromEcsApplicationName(scope, id, ecsApplicationName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = utils_1.arnForApplication(core_1.Stack.of(scope), ecsApplicationName);
                this.applicationName = ecsApplicationName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param ecsApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromEcsApplicationArn(scope, id, ecsApplicationArn) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.applicationArn = ecsApplicationArn;
                this.applicationName = core_1.Arn.split(ecsApplicationArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '<invalid arn>';
            }
        }(scope, id, { environmentFromArn: ecsApplicationArn });
    }
}
exports.EcsApplication = EcsApplication;
_a = JSII_RTTI_SYMBOL_1;
EcsApplication[_a] = { fqn: "@aws-cdk/aws-codedeploy.EcsApplication", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMkU7QUFFM0Usa0VBQXlEO0FBQ3pELDRDQUFtRTtBQWdDbkU7Ozs7R0FJRztBQUNILE1BQWEsY0FBZSxTQUFRLGVBQVE7SUF1QzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBNkIsRUFBRTtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsZUFBZTtTQUNwQyxDQUFDLENBQUM7Ozs7OzsrQ0ExQ00sY0FBYzs7OztRQTRDdkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQ0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsZUFBZSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ2xDLGVBQWUsRUFBRSxLQUFLO1NBQ3ZCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyx5QkFBaUIsQ0FBQyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuRyxPQUFPLEVBQUUsWUFBWTtZQUNyQixRQUFRLEVBQUUsYUFBYTtZQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1NBQ3pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLG9CQUFZLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0Y7SUF6REQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxrQkFBMEI7UUFDM0YsTUFBTSxNQUFPLFNBQVEsZUFBUTtZQUE3Qjs7Z0JBQ1MsbUJBQWMsR0FBRyx5QkFBaUIsQ0FBQyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3hFLG9CQUFlLEdBQUcsa0JBQWtCLENBQUM7WUFDOUMsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGlCQUF5QjtRQUN6RixPQUFPLElBQUksS0FBTSxTQUFRLGVBQVE7WUFBdEI7O2dCQUNGLG1CQUFjLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ25DLG9CQUFlLEdBQUcsVUFBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxJQUFJLGVBQWUsQ0FBQztZQUN2SCxDQUFDO1NBQUEsQ0FBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0tBQzFEOztBQWxDSCx3Q0EyREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIElSZXNvdXJjZSwgUmVzb3VyY2UsIFN0YWNrLCBBcm4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQXBwbGljYXRpb24gfSBmcm9tICcuLi9jb2RlZGVwbG95LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBhcm5Gb3JBcHBsaWNhdGlvbiwgdmFsaWRhdGVOYW1lIH0gZnJvbSAnLi4vcHJpdmF0ZS91dGlscyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHJlZmVyZW5jZSB0byBhIENvZGVEZXBsb3kgQXBwbGljYXRpb24gZGVwbG95aW5nIHRvIEFtYXpvbiBFQ1MuXG4gKlxuICogSWYgeW91J3JlIG1hbmFnaW5nIHRoZSBBcHBsaWNhdGlvbiBhbG9uZ3NpZGUgdGhlIHJlc3Qgb2YgeW91ciBDREsgcmVzb3VyY2VzLFxuICogdXNlIHRoZSBgRWNzQXBwbGljYXRpb25gIGNsYXNzLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIHJlZmVyZW5jZSBhbiBhbHJlYWR5IGV4aXN0aW5nIEFwcGxpY2F0aW9uLFxuICogb3Igb25lIGRlZmluZWQgaW4gYSBkaWZmZXJlbnQgQ0RLIFN0YWNrLFxuICogdXNlIHRoZSBgRWNzQXBwbGljYXRpb24jZnJvbUVjc0FwcGxpY2F0aW9uTmFtZWAgbWV0aG9kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElFY3NBcHBsaWNhdGlvbiBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25OYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBFY3NBcHBsaWNhdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzQXBwbGljYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwsIGh1bWFuLXJlYWRhYmxlIG5hbWUgb2YgdGhlIENvZGVEZXBsb3kgQXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGFuIGF1dG8tZ2VuZXJhdGVkIG5hbWUgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBDb2RlRGVwbG95IEFwcGxpY2F0aW9uIHRoYXQgZGVwbG95cyB0byBhbiBBbWF6b24gRUNTIHNlcnZpY2UuXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q29kZURlcGxveTo6QXBwbGljYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEVjc0FwcGxpY2F0aW9uIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRWNzQXBwbGljYXRpb24ge1xuICAvKipcbiAgICogSW1wb3J0IGFuIEFwcGxpY2F0aW9uIGRlZmluZWQgZWl0aGVyIG91dHNpZGUgdGhlIENESywgb3IgaW4gYSBkaWZmZXJlbnQgQ0RLIFN0YWNrLlxuICAgKlxuICAgKiBUaGUgQXBwbGljYXRpb24ncyBhY2NvdW50IGFuZCByZWdpb24gYXJlIGFzc3VtZWQgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIHN0YWNrIGl0IGlzIGJlaW5nIGltcG9ydGVkXG4gICAqIGludG8uIElmIG5vdCwgdXNlIGBmcm9tRWNzQXBwbGljYXRpb25Bcm5gLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgbmV3IENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgdGhlIGxvZ2ljYWwgSUQgb2YgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBlY3NBcHBsaWNhdGlvbk5hbWUgdGhlIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uIHRvIGltcG9ydFxuICAgKiBAcmV0dXJucyBhIENvbnN0cnVjdCByZXByZXNlbnRpbmcgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgQXBwbGljYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjc0FwcGxpY2F0aW9uTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBlY3NBcHBsaWNhdGlvbk5hbWU6IHN0cmluZyk6IElFY3NBcHBsaWNhdGlvbiB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRWNzQXBwbGljYXRpb24ge1xuICAgICAgcHVibGljIGFwcGxpY2F0aW9uQXJuID0gYXJuRm9yQXBwbGljYXRpb24oU3RhY2sub2Yoc2NvcGUpLCBlY3NBcHBsaWNhdGlvbk5hbWUpO1xuICAgICAgcHVibGljIGFwcGxpY2F0aW9uTmFtZSA9IGVjc0FwcGxpY2F0aW9uTmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBBcHBsaWNhdGlvbiBkZWZpbmVkIGVpdGhlciBvdXRzaWRlIHRoZSBDREssIG9yIGluIGEgZGlmZmVyZW50IENESyBTdGFjaywgYnkgQVJOLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHBhcmVudCBDb25zdHJ1Y3QgZm9yIHRoaXMgbmV3IENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgdGhlIGxvZ2ljYWwgSUQgb2YgdGhpcyBuZXcgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBlY3NBcHBsaWNhdGlvbkFybiB0aGUgQVJOIG9mIHRoZSBhcHBsaWNhdGlvbiB0byBpbXBvcnRcbiAgICogQHJldHVybnMgYSBDb25zdHJ1Y3QgcmVwcmVzZW50aW5nIGEgcmVmZXJlbmNlIHRvIGFuIGV4aXN0aW5nIEFwcGxpY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FY3NBcHBsaWNhdGlvbkFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBlY3NBcHBsaWNhdGlvbkFybjogc3RyaW5nKTogSUVjc0FwcGxpY2F0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRWNzQXBwbGljYXRpb24ge1xuICAgICAgcHVibGljIGFwcGxpY2F0aW9uQXJuID0gZWNzQXBwbGljYXRpb25Bcm47XG4gICAgICBwdWJsaWMgYXBwbGljYXRpb25OYW1lID0gQXJuLnNwbGl0KGVjc0FwcGxpY2F0aW9uQXJuLCBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lID8/ICc8aW52YWxpZCBhcm4+JztcbiAgICB9IChzY29wZSwgaWQsIHsgZW52aXJvbm1lbnRGcm9tQXJuOiBlY3NBcHBsaWNhdGlvbkFybiB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb25OYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVjc0FwcGxpY2F0aW9uUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5hcHBsaWNhdGlvbk5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5BcHBsaWNhdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhcHBsaWNhdGlvbk5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgY29tcHV0ZVBsYXRmb3JtOiAnRUNTJyxcbiAgICB9KTtcblxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLmFwcGxpY2F0aW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShhcm5Gb3JBcHBsaWNhdGlvbihTdGFjay5vZihzY29wZSksIHJlc291cmNlLnJlZiksIHtcbiAgICAgIHNlcnZpY2U6ICdjb2RlZGVwbG95JyxcbiAgICAgIHJlc291cmNlOiAnYXBwbGljYXRpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB2YWxpZGF0ZU5hbWUoJ0FwcGxpY2F0aW9uJywgdGhpcy5waHlzaWNhbE5hbWUpIH0pO1xuICB9XG59XG4iXX0=