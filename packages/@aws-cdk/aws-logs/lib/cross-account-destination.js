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
_a = JSII_RTTI_SYMBOL_1;
CrossAccountDestination[_a] = { fqn: "@aws-cdk/aws-logs.CrossAccountDestination", version: "0.0.0" };
exports.CrossAccountDestination = CrossAccountDestination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtYWNjb3VudC1kZXN0aW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLWFjY291bnQtZGVzdGluYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx3Q0FBMEM7QUFHMUMscURBQWtEO0FBMkJsRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBdUJ2RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUNqQywrRUFBK0U7Z0JBQy9FLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBM0JMOztXQUVHO1FBQ2EsbUJBQWMsR0FBdUIsSUFBSSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7Ozs7OzsrQ0FKbkUsdUJBQXVCOzs7O1FBOEJoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBYTtZQUNuQyw2QkFBNkI7WUFDN0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLDZCQUE2QixFQUFFO1lBQ3ZELE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87WUFDM0IsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3hFLE9BQU8sRUFBRSxNQUFNO1lBQ2YsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3pFO0lBRU0sV0FBVyxDQUFDLFNBQThCO1FBQy9DLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlDO0lBRU0sSUFBSSxDQUFDLE1BQWlCLEVBQUUsZUFBMEI7Ozs7Ozs7Ozs7UUFDdkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDckM7SUFFRDs7T0FFRztJQUNLLGtCQUFrQjtRQUN4Qiw4RUFBOEU7UUFDOUUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQ3JFO0lBRUQ7O09BRUc7SUFDSyw2QkFBNkI7UUFDbkMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNyQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ1osSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDMUYsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUF2RVUsMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXJuRm9ybWF0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElMb2dHcm91cCB9IGZyb20gJy4vbG9nLWdyb3VwJztcbmltcG9ydCB7IENmbkRlc3RpbmF0aW9uIH0gZnJvbSAnLi9sb2dzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJTG9nU3Vic2NyaXB0aW9uRGVzdGluYXRpb24sIExvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uQ29uZmlnIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24tZmlsdGVyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIENyb3NzQWNjb3VudERlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgbG9nIGRlc3RpbmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgZGVzdGluYXRpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byBhc3N1bWUgdGhhdCBncmFudHMgcGVybWlzc2lvbnMgdG8gd3JpdGUgdG8gJ3RhcmdldCcuXG4gICAqXG4gICAqIFRoZSByb2xlIG11c3QgYmUgYXNzdW1hYmxlIGJ5ICdsb2dzLntSRUdJT059LmFtYXpvbmF3cy5jb20nLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9nIGRlc3RpbmF0aW9uIHRhcmdldCdzIEFSTlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0QXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBuZXcgQ2xvdWRXYXRjaCBMb2dzIERlc3RpbmF0aW9uIGZvciB1c2UgaW4gY3Jvc3MtYWNjb3VudCBzY2VuYXJpb3NcbiAqXG4gKiBDcm9zc0FjY291bnREZXN0aW5hdGlvbnMgYXJlIHVzZWQgdG8gc3Vic2NyaWJlIGEgS2luZXNpcyBzdHJlYW0gaW4gYVxuICogZGlmZmVyZW50IGFjY291bnQgdG8gYSBDbG91ZFdhdGNoIFN1YnNjcmlwdGlvbi5cbiAqXG4gKiBDb25zdW1lcnMgd2lsbCBoYXJkbHkgZXZlciBuZWVkIHRvIHVzZSB0aGlzIGNsYXNzLiBJbnN0ZWFkLCBkaXJlY3RseVxuICogc3Vic2NyaWJlIGEgS2luZXNpcyBzdHJlYW0gdXNpbmcgdGhlIGludGVncmF0aW9uIGNsYXNzIGluIHRoZVxuICogYEBhd3MtY2RrL2F3cy1sb2dzLWRlc3RpbmF0aW9uc2AgcGFja2FnZTsgaWYgbmVjZXNzYXJ5LCBhXG4gKiBgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb25gIHdpbGwgYmUgY3JlYXRlZCBhdXRvbWF0aWNhbGx5LlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkxvZ3M6OkRlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDcm9zc0FjY291bnREZXN0aW5hdGlvbiBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbiB7XG4gIC8qKlxuICAgKiBQb2xpY3kgb2JqZWN0IG9mIHRoaXMgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb24gb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5RG9jdW1lbnQ6IGlhbS5Qb2xpY3lEb2N1bWVudCA9IG5ldyBpYW0uUG9saWN5RG9jdW1lbnQoKTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBDcm9zc0FjY291bnREZXN0aW5hdGlvbiBvYmplY3RcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlc3RpbmF0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb24gb2JqZWN0XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXN0aW5hdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5uZXIgcmVzb3VyY2VcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IENmbkRlc3RpbmF0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDcm9zc0FjY291bnREZXN0aW5hdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmRlc3RpbmF0aW9uTmFtZSB8fFxuICAgICAgICAvLyBJbiB0aGUgdW5kZXJseWluZyBtb2RlbCwgdGhlIG5hbWUgaXMgbm90IG9wdGlvbmFsLCBidXQgd2UgbWFrZSBpdCBzbyBhbnl3YXkuXG4gICAgICAgIGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuZ2VuZXJhdGVVbmlxdWVOYW1lKCkgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlc291cmNlID0gbmV3IENmbkRlc3RpbmF0aW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogdGhpcy5waHlzaWNhbE5hbWUhLFxuICAgICAgLy8gTXVzdCBiZSBzdHJpbmdpZmllZCBwb2xpY3lcbiAgICAgIGRlc3RpbmF0aW9uUG9saWN5OiB0aGlzLmxhenlTdHJpbmdpZmllZFBvbGljeURvY3VtZW50KCksXG4gICAgICByb2xlQXJuOiBwcm9wcy5yb2xlLnJvbGVBcm4sXG4gICAgICB0YXJnZXRBcm46IHByb3BzLnRhcmdldEFybixcbiAgICB9KTtcblxuICAgIHRoaXMuZGVzdGluYXRpb25Bcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHRoaXMucmVzb3VyY2UuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgcmVzb3VyY2U6ICdkZXN0aW5hdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHRoaXMucmVzb3VyY2UucmVmKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLnBvbGljeURvY3VtZW50LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfc291cmNlTG9nR3JvdXA6IElMb2dHcm91cCk6IExvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4geyBhcm46IHRoaXMuZGVzdGluYXRpb25Bcm4gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIHVuaXF1ZSBEZXN0aW5hdGlvbiBuYW1lIGluIGNhc2UgdGhlIHVzZXIgZGlkbid0IHN1cHBseSBvbmVcbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVVbmlxdWVOYW1lKCk6IHN0cmluZyB7XG4gICAgLy8gQ29tYmluYXRpb24gb2Ygc3RhY2sgbmFtZSBhbmQgTG9naWNhbElELCB3aGljaCBhcmUgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUuXG4gICAgcmV0dXJuIGNkay5TdGFjay5vZih0aGlzKS5zdGFja05hbWUgKyAnLScgKyB0aGlzLnJlc291cmNlLmxvZ2ljYWxJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzdHJpbmdpZmllZCBKU09OIHZlcnNpb24gb2YgdGhlIFBvbGljeURvY3VtZW50XG4gICAqL1xuICBwcml2YXRlIGxhenlTdHJpbmdpZmllZFBvbGljeURvY3VtZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNkay5MYXp5LnN0cmluZyh7XG4gICAgICBwcm9kdWNlOiAoKSA9PlxuICAgICAgICB0aGlzLnBvbGljeURvY3VtZW50LmlzRW1wdHkgPyAnJyA6IGNkay5TdGFjay5vZih0aGlzKS50b0pzb25TdHJpbmcodGhpcy5wb2xpY3lEb2N1bWVudCksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==