"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResource = exports.CustomResourceProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core = require("@aws-cdk/core");
/**
 * Represents a provider for an AWS CloudFormation custom resources.
 *
 * @deprecated use core.CustomResource instead
 */
class CustomResourceProvider {
    /**
     * @param serviceToken the ServiceToken which contains the ARN for this provider.
     */
    constructor(serviceToken) {
        this.serviceToken = serviceToken;
    }
    /**
     * The Lambda provider that implements this custom resource.
     *
     * We recommend using a lambda.SingletonFunction for this.
     */
    static fromLambda(handler) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResourceProvider#fromLambda", "use core.CustomResource instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLambda);
            }
            throw error;
        }
        return new CustomResourceProvider(handler.functionArn);
    }
    /**
     * The SNS Topic for the provider that implements this custom resource.
     */
    static fromTopic(topic) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResourceProvider#fromTopic", "use core.CustomResource instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromTopic);
            }
            throw error;
        }
        return new CustomResourceProvider(topic.topicArn);
    }
    /**
     * Use AWS Lambda as a provider.
     * @deprecated use `fromLambda`
     */
    static lambda(handler) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResourceProvider#lambda", "use `fromLambda`");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.lambda);
        }
        throw error;
    } return this.fromLambda(handler); }
    /**
     * Use an SNS topic as the provider.
     * @deprecated use `fromTopic`
     */
    static topic(topic) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResourceProvider#topic", "use `fromTopic`");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.topic);
        }
        throw error;
    } return this.fromTopic(topic); }
    bind(_) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResourceProvider#bind", "use core.CustomResource instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return { serviceToken: this.serviceToken };
    }
}
exports.CustomResourceProvider = CustomResourceProvider;
_a = JSII_RTTI_SYMBOL_1;
CustomResourceProvider[_a] = { fqn: "@aws-cdk/aws-cloudformation.CustomResourceProvider", version: "0.0.0" };
/**
 * Deprecated.
 * @deprecated use `core.CustomResource`
 */
class CustomResource extends core.CustomResource {
    constructor(scope, id, props) {
        super(scope, id, {
            pascalCaseProperties: true,
            properties: props.properties,
            removalPolicy: props.removalPolicy,
            resourceType: props.resourceType,
            serviceToken: core.Lazy.string({ produce: () => props.provider.bind(this).serviceToken }),
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudformation.CustomResource", "use `core.CustomResource`");
            jsiiDeprecationWarnings._aws_cdk_aws_cloudformation_CustomResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CustomResource);
            }
            throw error;
        }
    }
}
exports.CustomResource = CustomResource;
_b = JSII_RTTI_SYMBOL_1;
CustomResource[_b] = { fqn: "@aws-cdk/aws-cloudformation.CustomResource", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHNDQUFzQztBQW9DdEM7Ozs7R0FJRztBQUNILE1BQWEsc0JBQXNCO0lBNkJqQzs7T0FFRztJQUNILFlBQW9DLFlBQW9CO1FBQXBCLGlCQUFZLEdBQVosWUFBWSxDQUFRO0tBQUs7SUEvQjdEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQXlCOzs7Ozs7Ozs7O1FBQ2hELE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDeEQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBaUI7Ozs7Ozs7Ozs7UUFDdkMsT0FBTyxJQUFJLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuRDtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBeUI7Ozs7Ozs7O01BQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7SUFFcEY7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFpQjs7Ozs7Ozs7TUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQU9qRSxJQUFJLENBQUMsQ0FBWTs7Ozs7Ozs7OztRQUN0QixPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUM1Qzs7QUFwQ0gsd0RBcUNDOzs7QUF5RkQ7OztHQUdHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsSUFBSSxDQUFDLGNBQWM7SUFDckQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLG9CQUFvQixFQUFFLElBQUk7WUFDMUIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzFGLENBQUMsQ0FBQzs7Ozs7OzsrQ0FSTSxjQUFjOzs7O0tBU3hCOztBQVRILHdDQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYXJiaXRyYXJ5IHByb3BlcnRpZXNcbiAqXG4gKiBAZGVwcmVjYXRlZCB0aGlzIHR5cGUgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB1c2luZyBhIGtleS12YWx1ZSB0eXBlIGRpcmVjdGx5XG4gKi9cbmV4cG9ydCB0eXBlIFByb3BlcnRpZXMgPSB7W2tleTogc3RyaW5nXTogYW55fTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlcnMuXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlZCBpbiBgSUN1c3RvbVJlc291cmNlUHJvdmlkZXJgIHdoaWNoIGlzIG5vdyBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlckNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBTTlMgdG9waWMgb3IgdGhlIEFXUyBMYW1iZGEgZnVuY3Rpb24gd2hpY2ggaW1wbGVtZW50cyB0aGlzXG4gICAqIHByb3ZpZGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVRva2VuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHByb3ZpZGVyIGZvciBhbiBBV1MgQ2xvdWRGb3JtYXRpb24gY3VzdG9tIHJlc291cmNlcy5cbiAqIEBkZXByZWNhdGVkIHVzZSBgY29yZS5JQ3VzdG9tUmVzb3VyY2VQcm92aWRlcmBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tUmVzb3VyY2VQcm92aWRlciB7XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGlzIHByb3ZpZGVyIGlzIHVzZWQgYnkgYSBgQ3VzdG9tUmVzb3VyY2VgLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHJlc291cmNlIHRoYXQgdXNlcyB0aGlzIHByb3ZpZGVyLlxuICAgKiBAcmV0dXJucyBwcm92aWRlciBjb25maWd1cmF0aW9uXG4gICAqL1xuICBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyQ29uZmlnO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwcm92aWRlciBmb3IgYW4gQVdTIENsb3VkRm9ybWF0aW9uIGN1c3RvbSByZXNvdXJjZXMuXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIGNvcmUuQ3VzdG9tUmVzb3VyY2UgaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciBpbXBsZW1lbnRzIElDdXN0b21SZXNvdXJjZVByb3ZpZGVyIHtcbiAgLyoqXG4gICAqIFRoZSBMYW1iZGEgcHJvdmlkZXIgdGhhdCBpbXBsZW1lbnRzIHRoaXMgY3VzdG9tIHJlc291cmNlLlxuICAgKlxuICAgKiBXZSByZWNvbW1lbmQgdXNpbmcgYSBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24gZm9yIHRoaXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21MYW1iZGEoaGFuZGxlcjogbGFtYmRhLklGdW5jdGlvbik6IEN1c3RvbVJlc291cmNlUHJvdmlkZXIge1xuICAgIHJldHVybiBuZXcgQ3VzdG9tUmVzb3VyY2VQcm92aWRlcihoYW5kbGVyLmZ1bmN0aW9uQXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgU05TIFRvcGljIGZvciB0aGUgcHJvdmlkZXIgdGhhdCBpbXBsZW1lbnRzIHRoaXMgY3VzdG9tIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVG9waWModG9waWM6IHNucy5JVG9waWMpOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbVJlc291cmNlUHJvdmlkZXIodG9waWMudG9waWNBcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBBV1MgTGFtYmRhIGFzIGEgcHJvdmlkZXIuXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgZnJvbUxhbWJkYWBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGFtYmRhKGhhbmRsZXI6IGxhbWJkYS5JRnVuY3Rpb24pIHsgcmV0dXJuIHRoaXMuZnJvbUxhbWJkYShoYW5kbGVyKTsgfVxuXG4gIC8qKlxuICAgKiBVc2UgYW4gU05TIHRvcGljIGFzIHRoZSBwcm92aWRlci5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBmcm9tVG9waWNgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvcGljKHRvcGljOiBzbnMuSVRvcGljKSB7IHJldHVybiB0aGlzLmZyb21Ub3BpYyh0b3BpYyk7IH1cblxuICAvKipcbiAgICogQHBhcmFtIHNlcnZpY2VUb2tlbiB0aGUgU2VydmljZVRva2VuIHdoaWNoIGNvbnRhaW5zIHRoZSBBUk4gZm9yIHRoaXMgcHJvdmlkZXIuXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzZXJ2aWNlVG9rZW46IHN0cmluZykgeyB9XG5cbiAgcHVibGljIGJpbmQoXzogQ29uc3RydWN0KTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlckNvbmZpZyB7XG4gICAgcmV0dXJuIHsgc2VydmljZVRva2VuOiB0aGlzLnNlcnZpY2VUb2tlbiB9O1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBwcm92aWRlIGEgTGFtYmRhLWJhY2tlZCBjdXN0b20gcmVzb3VyY2VcbiAqIEBkZXByZWNhdGVkIHVzZSBgY29yZS5DdXN0b21SZXNvdXJjZVByb3BzYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbVJlc291cmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHByb3ZpZGVyIHdoaWNoIGltcGxlbWVudHMgdGhlIGN1c3RvbSByZXNvdXJjZS5cbiAgICpcbiAgICogWW91IGNhbiBpbXBsZW1lbnQgYSBwcm92aWRlciBieSBsaXN0ZW5pbmcgdG8gcmF3IEFXUyBDbG91ZEZvcm1hdGlvbiBldmVudHNcbiAgICogdGhyb3VnaCBhbiBTTlMgdG9waWMgb3IgYW4gQVdTIExhbWJkYSBmdW5jdGlvbiBvciB1c2UgdGhlIENESydzIGN1c3RvbVxuICAgKiBbcmVzb3VyY2UgcHJvdmlkZXIgZnJhbWV3b3JrXSB3aGljaCBtYWtlcyBpdCBlYXNpZXIgdG8gaW1wbGVtZW50IHJvYnVzdFxuICAgKiBwcm92aWRlcnMuXG4gICAqXG4gICAqIFtyZXNvdXJjZSBwcm92aWRlciBmcmFtZXdvcmtdOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS9sYXRlc3QvZG9jcy9jdXN0b20tcmVzb3VyY2VzLXJlYWRtZS5odG1sXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGltcG9ydCAqIGFzIGN1c3RvbV9yZXNvdXJjZXMgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcyc7XG4gICAqIGltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbiAgICogaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbiAgICogZGVjbGFyZSBjb25zdCBteU9uRXZlbnRMYW1iZGE6IGxhbWJkYS5GdW5jdGlvbjtcbiAgICogZGVjbGFyZSBjb25zdCBteUlzQ29tcGxldGVMYW1iZGE6IGxhbWJkYS5GdW5jdGlvbjtcbiAgICogY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICpcbiAgICogY29uc3QgcHJvdmlkZXIgPSBuZXcgY3VzdG9tX3Jlc291cmNlcy5Qcm92aWRlcihzdGFjaywgJ215UHJvdmlkZXInLCB7XG4gICAqICAgb25FdmVudEhhbmRsZXI6IG15T25FdmVudExhbWJkYSxcbiAgICogICBpc0NvbXBsZXRlSGFuZGxlcjogbXlJc0NvbXBsZXRlTGFtYmRhLCAvLyBvcHRpb25hbFxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGltcG9ydCAqIGFzIGNsb3VkZm9ybWF0aW9uIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbic7XG4gICAqIGltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbiAgICogZGVjbGFyZSBjb25zdCBteUZ1bmN0aW9uOiBsYW1iZGEuRnVuY3Rpb247XG4gICAqXG4gICAqIC8vIGludm9rZSBhbiBBV1MgTGFtYmRhIGZ1bmN0aW9uIHdoZW4gYSBsaWZlY3ljbGUgZXZlbnQgb2NjdXJzOlxuICAgKiBjb25zdCBwcm92aWRlciA9IGNsb3VkZm9ybWF0aW9uLkN1c3RvbVJlc291cmNlUHJvdmlkZXIuZnJvbUxhbWJkYShteUZ1bmN0aW9uKTtcbiAgICogYGBgXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGltcG9ydCAqIGFzIGNsb3VkZm9ybWF0aW9uIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbic7XG4gICAqIGltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbiAgICogZGVjbGFyZSBjb25zdCBteVRvcGljOiBzbnMuVG9waWM7XG4gICAqXG4gICAqIC8vIHB1Ymxpc2ggbGlmZWN5Y2xlIGV2ZW50cyB0byBhbiBTTlMgdG9waWM6XG4gICAqIGNvbnN0IHByb3ZpZGVyID0gY2xvdWRmb3JtYXRpb24uQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5mcm9tVG9waWMobXlUb3BpYyk7XG4gICAqIGBgYFxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdmlkZXI6IElDdXN0b21SZXNvdXJjZVByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIHRvIHBhc3MgdG8gdGhlIExhbWJkYVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHByb3BlcnRpZXMuXG4gICAqL1xuICByZWFkb25seSBwcm9wZXJ0aWVzPzogUHJvcGVydGllcztcblxuICAvKipcbiAgICogRm9yIGN1c3RvbSByZXNvdXJjZXMsIHlvdSBjYW4gc3BlY2lmeSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZVxuICAgKiAodGhlIGRlZmF1bHQpIGFzIHRoZSByZXNvdXJjZSB0eXBlLCBvciB5b3UgY2FuIHNwZWNpZnkgeW91ciBvd24gcmVzb3VyY2VcbiAgICogdHlwZSBuYW1lLiBGb3IgZXhhbXBsZSwgeW91IGNhbiB1c2UgXCJDdXN0b206Ok15Q3VzdG9tUmVzb3VyY2VUeXBlTmFtZVwiLlxuICAgKlxuICAgKiBDdXN0b20gcmVzb3VyY2UgdHlwZSBuYW1lcyBtdXN0IGJlZ2luIHdpdGggXCJDdXN0b206OlwiIGFuZCBjYW4gaW5jbHVkZVxuICAgKiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBfQC0uIFlvdSBjYW4gc3BlY2lmeVxuICAgKiBhIGN1c3RvbSByZXNvdXJjZSB0eXBlIG5hbWUgdXAgdG8gYSBtYXhpbXVtIGxlbmd0aCBvZiA2MCBjaGFyYWN0ZXJzLiBZb3VcbiAgICogY2Fubm90IGNoYW5nZSB0aGUgdHlwZSBkdXJpbmcgYW4gdXBkYXRlLlxuICAgKlxuICAgKiBVc2luZyB5b3VyIG93biByZXNvdXJjZSB0eXBlIG5hbWVzIGhlbHBzIHlvdSBxdWlja2x5IGRpZmZlcmVudGlhdGUgdGhlXG4gICAqIHR5cGVzIG9mIGN1c3RvbSByZXNvdXJjZXMgaW4geW91ciBzdGFjay4gRm9yIGV4YW1wbGUsIGlmIHlvdSBoYWQgdHdvIGN1c3RvbVxuICAgKiByZXNvdXJjZXMgdGhhdCBjb25kdWN0IHR3byBkaWZmZXJlbnQgcGluZyB0ZXN0cywgeW91IGNvdWxkIG5hbWUgdGhlaXIgdHlwZVxuICAgKiBhcyBDdXN0b206OlBpbmdUZXN0ZXIgdG8gbWFrZSB0aGVtIGVhc2lseSBpZGVudGlmaWFibGUgYXMgcGluZyB0ZXN0ZXJzXG4gICAqIChpbnN0ZWFkIG9mIHVzaW5nIEFXUzo6Q2xvdWRGb3JtYXRpb246OkN1c3RvbVJlc291cmNlKS5cbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY2ZuLWN1c3RvbXJlc291cmNlLmh0bWwjYXdzLWNmbi1yZXNvdXJjZS10eXBlLW5hbWVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VUeXBlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IHRvIGFwcGx5IHdoZW4gdGhpcyByZXNvdXJjZSBpcyByZW1vdmVkIGZyb20gdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBjZGsuUmVtb3ZhbFBvbGljeS5EZXN0cm95XG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogY29yZS5SZW1vdmFsUG9saWN5O1xufVxuXG4vKipcbiAqIERlcHJlY2F0ZWQuXG4gKiBAZGVwcmVjYXRlZCB1c2UgYGNvcmUuQ3VzdG9tUmVzb3VyY2VgXG4gKi9cbmV4cG9ydCBjbGFzcyBDdXN0b21SZXNvdXJjZSBleHRlbmRzIGNvcmUuQ3VzdG9tUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGFzY2FsQ2FzZVByb3BlcnRpZXM6IHRydWUsXG4gICAgICBwcm9wZXJ0aWVzOiBwcm9wcy5wcm9wZXJ0aWVzLFxuICAgICAgcmVtb3ZhbFBvbGljeTogcHJvcHMucmVtb3ZhbFBvbGljeSxcbiAgICAgIHJlc291cmNlVHlwZTogcHJvcHMucmVzb3VyY2VUeXBlLFxuICAgICAgc2VydmljZVRva2VuOiBjb3JlLkxhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gcHJvcHMucHJvdmlkZXIuYmluZCh0aGlzKS5zZXJ2aWNlVG9rZW4gfSksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==