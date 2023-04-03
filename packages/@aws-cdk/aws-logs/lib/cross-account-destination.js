"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossAccountDestination = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const logs_generated_1 = require("./logs.generated");
/**
 * A new CloudWatch Logs Destination for use in cross-account scenarios
 *
 * CrossAccountDestinations are used to subscribe a Kinesis stream in a
 * different account to a CloudWatch Subscription.
 *
 * Consumers will hardly ever need to use this class. Instead, directly
 * subscribe a Kinesis stream using the integration class in the
 * `@aws-cdk/aws-logs-destinations` package; if necessary, a
 * `CrossAccountDestination` will be created automatically.
 *
 * @resource AWS::Logs::Destination
 */
class CrossAccountDestination extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.destinationName ||
                // In the underlying model, the name is not optional, but we make it so anyway.
                cdk.Lazy.string({ produce: () => this.generateUniqueName() }),
        });
        /**
         * Policy object of this CrossAccountDestination object
         */
        this.policyDocument = new iam.PolicyDocument();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_CrossAccountDestinationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CrossAccountDestination);
            }
            throw error;
        }
        this.resource = new logs_generated_1.CfnDestination(this, 'Resource', {
            destinationName: this.physicalName,
            // Must be stringified policy
            destinationPolicy: this.lazyStringifiedPolicyDocument(),
            roleArn: props.role.roleArn,
            targetArn: props.targetArn,
        });
        this.destinationArn = this.getResourceArnAttribute(this.resource.attrArn, {
            service: 'logs',
            resource: 'destination',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.destinationName = this.getResourceNameAttribute(this.resource.ref);
    }
    addToPolicy(statement) {
        this.policyDocument.addStatements(statement);
    }
    bind(_scope, _sourceLogGroup) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_ILogGroup(_sourceLogGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return { arn: this.destinationArn };
    }
    /**
     * Generate a unique Destination name in case the user didn't supply one
     */
    generateUniqueName() {
        // Combination of stack name and LogicalID, which are guaranteed to be unique.
        return cdk.Stack.of(this).stackName + '-' + this.resource.logicalId;
    }
    /**
     * Return a stringified JSON version of the PolicyDocument
     */
    lazyStringifiedPolicyDocument() {
        return cdk.Lazy.string({
            produce: () => this.policyDocument.isEmpty ? '' : cdk.Stack.of(this).toJsonString(this.policyDocument),
        });
    }
}
exports.CrossAccountDestination = CrossAccountDestination;
_a = JSII_RTTI_SYMBOL_1;
CrossAccountDestination[_a] = { fqn: "@aws-cdk/aws-logs.CrossAccountDestination", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtYWNjb3VudC1kZXN0aW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLWFjY291bnQtZGVzdGluYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx3Q0FBMEM7QUFHMUMscURBQWtEO0FBMkJsRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBdUJ2RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUNqQywrRUFBK0U7Z0JBQy9FLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBM0JMOztXQUVHO1FBQ2EsbUJBQWMsR0FBdUIsSUFBSSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7Ozs7OzsrQ0FKbkUsdUJBQXVCOzs7O1FBOEJoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBYTtZQUNuQyw2QkFBNkI7WUFDN0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLDZCQUE2QixFQUFFO1lBQ3ZELE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87WUFDM0IsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3hFLE9BQU8sRUFBRSxNQUFNO1lBQ2YsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3pFO0lBRU0sV0FBVyxDQUFDLFNBQThCO1FBQy9DLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlDO0lBRU0sSUFBSSxDQUFDLE1BQWlCLEVBQUUsZUFBMEI7Ozs7Ozs7Ozs7UUFDdkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDckM7SUFFRDs7T0FFRztJQUNLLGtCQUFrQjtRQUN4Qiw4RUFBOEU7UUFDOUUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQ3JFO0lBRUQ7O09BRUc7SUFDSyw2QkFBNkI7UUFDbkMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNyQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ1osSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDMUYsQ0FBQyxDQUFDO0tBQ0o7O0FBdkVILDBEQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFybkZvcm1hdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTG9nR3JvdXAgfSBmcm9tICcuL2xvZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5EZXN0aW5hdGlvbiB9IGZyb20gJy4vbG9ncy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUxvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uLCBMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbkNvbmZpZyB9IGZyb20gJy4vc3Vic2NyaXB0aW9uLWZpbHRlcic7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBDcm9zc0FjY291bnREZXN0aW5hdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzQWNjb3VudERlc3RpbmF0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBkZXN0aW5hdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYXNzdW1lIHRoYXQgZ3JhbnRzIHBlcm1pc3Npb25zIHRvIHdyaXRlIHRvICd0YXJnZXQnLlxuICAgKlxuICAgKiBUaGUgcm9sZSBtdXN0IGJlIGFzc3VtYWJsZSBieSAnbG9ncy57UkVHSU9OfS5hbWF6b25hd3MuY29tJy5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIGxvZyBkZXN0aW5hdGlvbiB0YXJnZXQncyBBUk5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldEFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgbmV3IENsb3VkV2F0Y2ggTG9ncyBEZXN0aW5hdGlvbiBmb3IgdXNlIGluIGNyb3NzLWFjY291bnQgc2NlbmFyaW9zXG4gKlxuICogQ3Jvc3NBY2NvdW50RGVzdGluYXRpb25zIGFyZSB1c2VkIHRvIHN1YnNjcmliZSBhIEtpbmVzaXMgc3RyZWFtIGluIGFcbiAqIGRpZmZlcmVudCBhY2NvdW50IHRvIGEgQ2xvdWRXYXRjaCBTdWJzY3JpcHRpb24uXG4gKlxuICogQ29uc3VtZXJzIHdpbGwgaGFyZGx5IGV2ZXIgbmVlZCB0byB1c2UgdGhpcyBjbGFzcy4gSW5zdGVhZCwgZGlyZWN0bHlcbiAqIHN1YnNjcmliZSBhIEtpbmVzaXMgc3RyZWFtIHVzaW5nIHRoZSBpbnRlZ3JhdGlvbiBjbGFzcyBpbiB0aGVcbiAqIGBAYXdzLWNkay9hd3MtbG9ncy1kZXN0aW5hdGlvbnNgIHBhY2thZ2U7IGlmIG5lY2Vzc2FyeSwgYVxuICogYENyb3NzQWNjb3VudERlc3RpbmF0aW9uYCB3aWxsIGJlIGNyZWF0ZWQgYXV0b21hdGljYWxseS5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpMb2dzOjpEZXN0aW5hdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb24gZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBJTG9nU3Vic2NyaXB0aW9uRGVzdGluYXRpb24ge1xuICAvKipcbiAgICogUG9saWN5IG9iamVjdCBvZiB0aGlzIENyb3NzQWNjb3VudERlc3RpbmF0aW9uIG9iamVjdFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBvbGljeURvY3VtZW50OiBpYW0uUG9saWN5RG9jdW1lbnQgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb24gb2JqZWN0XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXN0aW5hdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIENyb3NzQWNjb3VudERlc3RpbmF0aW9uIG9iamVjdFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzdGluYXRpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlubmVyIHJlc291cmNlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlOiBDZm5EZXN0aW5hdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3Jvc3NBY2NvdW50RGVzdGluYXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5kZXN0aW5hdGlvbk5hbWUgfHxcbiAgICAgICAgLy8gSW4gdGhlIHVuZGVybHlpbmcgbW9kZWwsIHRoZSBuYW1lIGlzIG5vdCBvcHRpb25hbCwgYnV0IHdlIG1ha2UgaXQgc28gYW55d2F5LlxuICAgICAgICBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmdlbmVyYXRlVW5pcXVlTmFtZSgpIH0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNvdXJjZSA9IG5ldyBDZm5EZXN0aW5hdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IHRoaXMucGh5c2ljYWxOYW1lISxcbiAgICAgIC8vIE11c3QgYmUgc3RyaW5naWZpZWQgcG9saWN5XG4gICAgICBkZXN0aW5hdGlvblBvbGljeTogdGhpcy5sYXp5U3RyaW5naWZpZWRQb2xpY3lEb2N1bWVudCgpLFxuICAgICAgcm9sZUFybjogcHJvcHMucm9sZS5yb2xlQXJuLFxuICAgICAgdGFyZ2V0QXJuOiBwcm9wcy50YXJnZXRBcm4sXG4gICAgfSk7XG5cbiAgICB0aGlzLmRlc3RpbmF0aW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZSh0aGlzLnJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnZGVzdGluYXRpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbk5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZSh0aGlzLnJlc291cmNlLnJlZik7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5wb2xpY3lEb2N1bWVudC5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX3NvdXJjZUxvZ0dyb3VwOiBJTG9nR3JvdXApOiBMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbkNvbmZpZyB7XG4gICAgcmV0dXJuIHsgYXJuOiB0aGlzLmRlc3RpbmF0aW9uQXJuIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSB1bmlxdWUgRGVzdGluYXRpb24gbmFtZSBpbiBjYXNlIHRoZSB1c2VyIGRpZG4ndCBzdXBwbHkgb25lXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlVW5pcXVlTmFtZSgpOiBzdHJpbmcge1xuICAgIC8vIENvbWJpbmF0aW9uIG9mIHN0YWNrIG5hbWUgYW5kIExvZ2ljYWxJRCwgd2hpY2ggYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlLlxuICAgIHJldHVybiBjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lICsgJy0nICsgdGhpcy5yZXNvdXJjZS5sb2dpY2FsSWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgc3RyaW5naWZpZWQgSlNPTiB2ZXJzaW9uIG9mIHRoZSBQb2xpY3lEb2N1bWVudFxuICAgKi9cbiAgcHJpdmF0ZSBsYXp5U3RyaW5naWZpZWRQb2xpY3lEb2N1bWVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjZGsuTGF6eS5zdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT5cbiAgICAgICAgdGhpcy5wb2xpY3lEb2N1bWVudC5pc0VtcHR5ID8gJycgOiBjZGsuU3RhY2sub2YodGhpcykudG9Kc29uU3RyaW5nKHRoaXMucG9saWN5RG9jdW1lbnQpLFxuICAgIH0pO1xuICB9XG59XG4iXX0=