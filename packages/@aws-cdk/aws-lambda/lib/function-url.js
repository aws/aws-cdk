"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionUrl = exports.HttpMethod = exports.FunctionUrlAuthType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lambda_generated_1 = require("./lambda.generated");
/**
 * The auth types for a function url
 */
var FunctionUrlAuthType;
(function (FunctionUrlAuthType) {
    /**
     * Restrict access to authenticated IAM users only
     */
    FunctionUrlAuthType["AWS_IAM"] = "AWS_IAM";
    /**
     * Bypass IAM authentication to create a public endpoint
     */
    FunctionUrlAuthType["NONE"] = "NONE";
})(FunctionUrlAuthType = exports.FunctionUrlAuthType || (exports.FunctionUrlAuthType = {}));
/**
 * All http request methods
 */
var HttpMethod;
(function (HttpMethod) {
    /**
     * The GET method requests a representation of the specified resource.
     */
    HttpMethod["GET"] = "GET";
    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    HttpMethod["PUT"] = "PUT";
    /**
     * The HEAD method asks for a response identical to that of a GET request, but without the response body.
     */
    HttpMethod["HEAD"] = "HEAD";
    /**
     * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    HttpMethod["POST"] = "POST";
    /**
     * The DELETE method deletes the specified resource.
     */
    HttpMethod["DELETE"] = "DELETE";
    /**
     * The PATCH method applies partial modifications to a resource.
     */
    HttpMethod["PATCH"] = "PATCH";
    /**
     * The OPTIONS method describes the communication options for the target resource.
     */
    HttpMethod["OPTIONS"] = "OPTIONS";
    /**
     * The wildcard entry to allow all methods.
     */
    HttpMethod["ALL"] = "*";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
/**
 * Defines a Lambda function url
 *
 * @resource AWS::Lambda::Url
 */
class FunctionUrl extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_FunctionUrlProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FunctionUrl);
            }
            throw error;
        }
        if (this.instanceOfVersion(props.function)) {
            throw new Error('FunctionUrl cannot be used with a Version');
        }
        // If the target function is an alias, then it must be configured using the underlying function
        // ARN, and the alias name as a qualifier.
        const { targetFunction, alias } = this.instanceOfAlias(props.function)
            ? { targetFunction: props.function.version.lambda, alias: props.function }
            : { targetFunction: props.function, alias: undefined };
        const resource = new lambda_generated_1.CfnUrl(this, 'Resource', {
            authType: props.authType ?? FunctionUrlAuthType.AWS_IAM,
            cors: props.cors ? this.renderCors(props.cors) : undefined,
            targetFunctionArn: targetFunction.functionArn,
            qualifier: alias?.aliasName,
        });
        // The aliasName is a required physical name, so using it does not imply a dependency, so we
        // must "manually" register the dependency, or else CFN may attempt to use before it exists.
        if (alias?.node.defaultChild != null) {
            resource.node.addDependency(alias.node.defaultChild);
        }
        this.url = resource.attrFunctionUrl;
        this.functionArn = resource.attrFunctionArn;
        this.function = props.function;
        if (props.authType === FunctionUrlAuthType.NONE) {
            props.function.addPermission('invoke-function-url', {
                principal: new iam.AnyPrincipal(),
                action: 'lambda:InvokeFunctionUrl',
                functionUrlAuthType: props.authType,
            });
        }
    }
    grantInvokeUrl(grantee) {
        return this.function.grantInvokeUrl(grantee);
    }
    instanceOfVersion(fn) {
        return 'version' in fn && !this.instanceOfAlias(fn);
    }
    instanceOfAlias(fn) {
        return 'aliasName' in fn;
    }
    renderCors(cors) {
        return {
            allowCredentials: cors.allowCredentials,
            allowHeaders: cors.allowedHeaders,
            allowMethods: cors.allowedMethods ?? [HttpMethod.ALL],
            allowOrigins: cors.allowedOrigins,
            exposeHeaders: cors.exposedHeaders,
            maxAge: cors.maxAge?.toSeconds(),
        };
    }
}
exports.FunctionUrl = FunctionUrl;
_a = JSII_RTTI_SYMBOL_1;
FunctionUrl[_a] = { fqn: "@aws-cdk/aws-lambda.FunctionUrl", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tdXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnVuY3Rpb24tdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBOEQ7QUFLOUQseURBQTRDO0FBRTVDOztHQUVHO0FBQ0gsSUFBWSxtQkFVWDtBQVZELFdBQVksbUJBQW1CO0lBQzdCOztPQUVHO0lBQ0gsMENBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCxvQ0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQVZXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBVTlCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFVBaUNYO0FBakNELFdBQVksVUFBVTtJQUNwQjs7T0FFRztJQUNILHlCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILHlCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILDJCQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILDJCQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILCtCQUFpQixDQUFBO0lBQ2pCOztPQUVHO0lBQ0gsNkJBQWUsQ0FBQTtJQUNmOztPQUVHO0lBQ0gsaUNBQW1CLENBQUE7SUFDbkI7O09BRUc7SUFDSCx1QkFBUyxDQUFBO0FBQ1gsQ0FBQyxFQWpDVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQWlDckI7QUF1R0Q7Ozs7R0FJRztBQUNILE1BQWEsV0FBWSxTQUFRLGVBQVE7SUFhdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBZFIsV0FBVzs7OztRQWdCcEIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUM5RDtRQUVELCtGQUErRjtRQUMvRiwwQ0FBMEM7UUFDMUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDcEUsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUMxRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFFekQsTUFBTSxRQUFRLEdBQVcsSUFBSSx5QkFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksbUJBQW1CLENBQUMsT0FBTztZQUN2RCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDMUQsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLFdBQVc7WUFDN0MsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTO1NBQzVCLENBQUMsQ0FBQztRQUNILDRGQUE0RjtRQUM1Riw0RkFBNEY7UUFDNUYsSUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7WUFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN0RDtRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUU7WUFDL0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUU7Z0JBQ2xELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pDLE1BQU0sRUFBRSwwQkFBMEI7Z0JBQ2xDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxRQUFRO2FBQ3BDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7SUFFTSxjQUFjLENBQUMsT0FBdUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5QztJQUVPLGlCQUFpQixDQUFDLEVBQWE7UUFDckMsT0FBTyxTQUFTLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyRDtJQUVPLGVBQWUsQ0FBQyxFQUFhO1FBQ25DLE9BQU8sV0FBVyxJQUFJLEVBQUUsQ0FBQztLQUMxQjtJQUVPLFVBQVUsQ0FBQyxJQUE0QjtRQUM3QyxPQUFPO1lBQ0wsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDakMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYztZQUNqQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO1NBQ2pDLENBQUM7S0FDSDs7QUF4RUgsa0NBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgRHVyYXRpb24sIElSZXNvdXJjZSwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUFsaWFzIH0gZnJvbSAnLi9hbGlhcyc7XG5pbXBvcnQgeyBJRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9uLWJhc2UnO1xuaW1wb3J0IHsgSVZlcnNpb24gfSBmcm9tICcuL2xhbWJkYS12ZXJzaW9uJztcbmltcG9ydCB7IENmblVybCB9IGZyb20gJy4vbGFtYmRhLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogVGhlIGF1dGggdHlwZXMgZm9yIGEgZnVuY3Rpb24gdXJsXG4gKi9cbmV4cG9ydCBlbnVtIEZ1bmN0aW9uVXJsQXV0aFR5cGUge1xuICAvKipcbiAgICogUmVzdHJpY3QgYWNjZXNzIHRvIGF1dGhlbnRpY2F0ZWQgSUFNIHVzZXJzIG9ubHlcbiAgICovXG4gIEFXU19JQU0gPSAnQVdTX0lBTScsXG5cbiAgLyoqXG4gICAqIEJ5cGFzcyBJQU0gYXV0aGVudGljYXRpb24gdG8gY3JlYXRlIGEgcHVibGljIGVuZHBvaW50XG4gICAqL1xuICBOT05FID0gJ05PTkUnLFxufVxuXG4vKipcbiAqIEFsbCBodHRwIHJlcXVlc3QgbWV0aG9kc1xuICovXG5leHBvcnQgZW51bSBIdHRwTWV0aG9kIHtcbiAgLyoqXG4gICAqIFRoZSBHRVQgbWV0aG9kIHJlcXVlc3RzIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNwZWNpZmllZCByZXNvdXJjZS5cbiAgICovXG4gIEdFVCA9ICdHRVQnLFxuICAvKipcbiAgICogVGhlIFBVVCBtZXRob2QgcmVwbGFjZXMgYWxsIGN1cnJlbnQgcmVwcmVzZW50YXRpb25zIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2Ugd2l0aCB0aGUgcmVxdWVzdCBwYXlsb2FkLlxuICAgKi9cbiAgUFVUID0gJ1BVVCcsXG4gIC8qKlxuICAgKiBUaGUgSEVBRCBtZXRob2QgYXNrcyBmb3IgYSByZXNwb25zZSBpZGVudGljYWwgdG8gdGhhdCBvZiBhIEdFVCByZXF1ZXN0LCBidXQgd2l0aG91dCB0aGUgcmVzcG9uc2UgYm9keS5cbiAgICovXG4gIEhFQUQgPSAnSEVBRCcsXG4gIC8qKlxuICAgKiBUaGUgUE9TVCBtZXRob2QgaXMgdXNlZCB0byBzdWJtaXQgYW4gZW50aXR5IHRvIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UsIG9mdGVuIGNhdXNpbmcgYSBjaGFuZ2UgaW4gc3RhdGUgb3Igc2lkZSBlZmZlY3RzIG9uIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBQT1NUID0gJ1BPU1QnLFxuICAvKipcbiAgICogVGhlIERFTEVURSBtZXRob2QgZGVsZXRlcyB0aGUgc3BlY2lmaWVkIHJlc291cmNlLlxuICAgKi9cbiAgREVMRVRFID0gJ0RFTEVURScsXG4gIC8qKlxuICAgKiBUaGUgUEFUQ0ggbWV0aG9kIGFwcGxpZXMgcGFydGlhbCBtb2RpZmljYXRpb25zIHRvIGEgcmVzb3VyY2UuXG4gICAqL1xuICBQQVRDSCA9ICdQQVRDSCcsXG4gIC8qKlxuICAgKiBUaGUgT1BUSU9OUyBtZXRob2QgZGVzY3JpYmVzIHRoZSBjb21tdW5pY2F0aW9uIG9wdGlvbnMgZm9yIHRoZSB0YXJnZXQgcmVzb3VyY2UuXG4gICAqL1xuICBPUFRJT05TID0gJ09QVElPTlMnLFxuICAvKipcbiAgICogVGhlIHdpbGRjYXJkIGVudHJ5IHRvIGFsbG93IGFsbCBtZXRob2RzLlxuICAgKi9cbiAgQUxMID0gJyonLFxufVxuXG4vKipcbiAqIFNwZWNpZmllcyBhIGNyb3NzLW9yaWdpbiBhY2Nlc3MgcHJvcGVydHkgZm9yIGEgZnVuY3Rpb24gVVJMXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25VcmxDb3JzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFsbG93IGNvb2tpZXMgb3Igb3RoZXIgY3JlZGVudGlhbHMgaW4gcmVxdWVzdHMgdG8geW91ciBmdW5jdGlvbiBVUkwuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhbGxvd0NyZWRlbnRpYWxzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSGVhZGVycyB0aGF0IGFyZSBzcGVjaWZpZWQgaW4gdGhlIEFjY2Vzcy1Db250cm9sLVJlcXVlc3QtSGVhZGVycyBoZWFkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGVhZGVycyBhbGxvd2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZEhlYWRlcnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQW4gSFRUUCBtZXRob2QgdGhhdCB5b3UgYWxsb3cgdGhlIG9yaWdpbiB0byBleGVjdXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFtIdHRwTWV0aG9kLkFMTF1cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRNZXRob2RzPzogSHR0cE1ldGhvZFtdO1xuXG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSBvcmlnaW5zIHlvdSB3YW50IGN1c3RvbWVycyB0byBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgYnVja2V0IGZyb20uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gb3JpZ2lucyBhbGxvd2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZE9yaWdpbnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogT25lIG9yIG1vcmUgaGVhZGVycyBpbiB0aGUgcmVzcG9uc2UgdGhhdCB5b3Ugd2FudCBjdXN0b21lcnMgdG8gYmUgYWJsZSB0byBhY2Nlc3MgZnJvbSB0aGVpciBhcHBsaWNhdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGVhZGVycyBleHBvc2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgZXhwb3NlZEhlYWRlcnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIHRpbWUgaW4gc2Vjb25kcyB0aGF0IHlvdXIgYnJvd3NlciBpcyB0byBjYWNoZSB0aGUgcHJlZmxpZ2h0IHJlc3BvbnNlIGZvciB0aGUgc3BlY2lmaWVkIHJlc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEJyb3dzZXIgZGVmYXVsdCBvZiA1IHNlY29uZHMuXG4gICAqL1xuICByZWFkb25seSBtYXhBZ2U/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBBIExhbWJkYSBmdW5jdGlvbiBVcmxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRnVuY3Rpb25VcmwgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIHVybCBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAYXR0cmlidXRlIEZ1bmN0aW9uVXJsXG4gICAqL1xuICByZWFkb25seSB1cmw6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgZnVuY3Rpb24gdGhpcyBVUkwgcmVmZXJzIHRvXG4gICAqXG4gICAqIEBhdHRyaWJ1dGUgRnVuY3Rpb25Bcm5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBpbnZva2UgdGhpcyBMYW1iZGEgRnVuY3Rpb24gVVJMXG4gICAqL1xuICBncmFudEludm9rZVVybChpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBhZGQgYSB1cmwgdG8gYSBMYW1iZGEgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvblVybE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgYXV0aGVudGljYXRpb24gdGhhdCB5b3VyIGZ1bmN0aW9uIFVSTCB1c2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBGdW5jdGlvblVybEF1dGhUeXBlLkFXU19JQU1cbiAgICovXG4gIHJlYWRvbmx5IGF1dGhUeXBlPzogRnVuY3Rpb25VcmxBdXRoVHlwZTtcblxuICAvKipcbiAgICogVGhlIGNyb3NzLW9yaWdpbiByZXNvdXJjZSBzaGFyaW5nIChDT1JTKSBzZXR0aW5ncyBmb3IgeW91ciBmdW5jdGlvbiBVUkwuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gQ09SUyBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ycz86IEZ1bmN0aW9uVXJsQ29yc09wdGlvbnM7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBGdW5jdGlvblVybFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uVXJsUHJvcHMgZXh0ZW5kcyBGdW5jdGlvblVybE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRvIHdoaWNoIHRoaXMgdXJsIHJlZmVycy5cbiAgICogSXQgY2FuIGFsc28gYmUgYW4gYEFsaWFzYCBidXQgbm90IGEgYFZlcnNpb25gLlxuICAgKi9cbiAgcmVhZG9ubHkgZnVuY3Rpb246IElGdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGEgTGFtYmRhIGZ1bmN0aW9uIHVybFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkxhbWJkYTo6VXJsXG4gKi9cbmV4cG9ydCBjbGFzcyBGdW5jdGlvblVybCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUZ1bmN0aW9uVXJsIHtcbiAgLyoqXG4gICAqIFRoZSB1cmwgb2YgdGhlIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1cmw6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgZnVuY3Rpb24gdGhpcyBVUkwgcmVmZXJzIHRvXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGZ1bmN0aW9uOiBJRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZ1bmN0aW9uVXJsUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2VPZlZlcnNpb24ocHJvcHMuZnVuY3Rpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9uVXJsIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBWZXJzaW9uJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRhcmdldCBmdW5jdGlvbiBpcyBhbiBhbGlhcywgdGhlbiBpdCBtdXN0IGJlIGNvbmZpZ3VyZWQgdXNpbmcgdGhlIHVuZGVybHlpbmcgZnVuY3Rpb25cbiAgICAvLyBBUk4sIGFuZCB0aGUgYWxpYXMgbmFtZSBhcyBhIHF1YWxpZmllci5cbiAgICBjb25zdCB7IHRhcmdldEZ1bmN0aW9uLCBhbGlhcyB9ID0gdGhpcy5pbnN0YW5jZU9mQWxpYXMocHJvcHMuZnVuY3Rpb24pXG4gICAgICA/IHsgdGFyZ2V0RnVuY3Rpb246IHByb3BzLmZ1bmN0aW9uLnZlcnNpb24ubGFtYmRhLCBhbGlhczogcHJvcHMuZnVuY3Rpb24gfVxuICAgICAgOiB7IHRhcmdldEZ1bmN0aW9uOiBwcm9wcy5mdW5jdGlvbiwgYWxpYXM6IHVuZGVmaW5lZCB9O1xuXG4gICAgY29uc3QgcmVzb3VyY2U6IENmblVybCA9IG5ldyBDZm5VcmwodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXV0aFR5cGU6IHByb3BzLmF1dGhUeXBlID8/IEZ1bmN0aW9uVXJsQXV0aFR5cGUuQVdTX0lBTSxcbiAgICAgIGNvcnM6IHByb3BzLmNvcnMgPyB0aGlzLnJlbmRlckNvcnMocHJvcHMuY29ycykgOiB1bmRlZmluZWQsXG4gICAgICB0YXJnZXRGdW5jdGlvbkFybjogdGFyZ2V0RnVuY3Rpb24uZnVuY3Rpb25Bcm4sXG4gICAgICBxdWFsaWZpZXI6IGFsaWFzPy5hbGlhc05hbWUsXG4gICAgfSk7XG4gICAgLy8gVGhlIGFsaWFzTmFtZSBpcyBhIHJlcXVpcmVkIHBoeXNpY2FsIG5hbWUsIHNvIHVzaW5nIGl0IGRvZXMgbm90IGltcGx5IGEgZGVwZW5kZW5jeSwgc28gd2VcbiAgICAvLyBtdXN0IFwibWFudWFsbHlcIiByZWdpc3RlciB0aGUgZGVwZW5kZW5jeSwgb3IgZWxzZSBDRk4gbWF5IGF0dGVtcHQgdG8gdXNlIGJlZm9yZSBpdCBleGlzdHMuXG4gICAgaWYgKGFsaWFzPy5ub2RlLmRlZmF1bHRDaGlsZCAhPSBudWxsKSB7XG4gICAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koYWxpYXMubm9kZS5kZWZhdWx0Q2hpbGQpO1xuICAgIH1cblxuICAgIHRoaXMudXJsID0gcmVzb3VyY2UuYXR0ckZ1bmN0aW9uVXJsO1xuICAgIHRoaXMuZnVuY3Rpb25Bcm4gPSByZXNvdXJjZS5hdHRyRnVuY3Rpb25Bcm47XG4gICAgdGhpcy5mdW5jdGlvbiA9IHByb3BzLmZ1bmN0aW9uO1xuXG4gICAgaWYgKHByb3BzLmF1dGhUeXBlID09PSBGdW5jdGlvblVybEF1dGhUeXBlLk5PTkUpIHtcbiAgICAgIHByb3BzLmZ1bmN0aW9uLmFkZFBlcm1pc3Npb24oJ2ludm9rZS1mdW5jdGlvbi11cmwnLCB7XG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICAgICAgYWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uVXJsJyxcbiAgICAgICAgZnVuY3Rpb25VcmxBdXRoVHlwZTogcHJvcHMuYXV0aFR5cGUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRJbnZva2VVcmwoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmZ1bmN0aW9uLmdyYW50SW52b2tlVXJsKGdyYW50ZWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnN0YW5jZU9mVmVyc2lvbihmbjogSUZ1bmN0aW9uKTogZm4gaXMgSVZlcnNpb24ge1xuICAgIHJldHVybiAndmVyc2lvbicgaW4gZm4gJiYgIXRoaXMuaW5zdGFuY2VPZkFsaWFzKGZuKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zdGFuY2VPZkFsaWFzKGZuOiBJRnVuY3Rpb24pOiBmbiBpcyBJQWxpYXMge1xuICAgIHJldHVybiAnYWxpYXNOYW1lJyBpbiBmbjtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ29ycyhjb3JzOiBGdW5jdGlvblVybENvcnNPcHRpb25zKTogQ2ZuVXJsLkNvcnNQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbG93Q3JlZGVudGlhbHM6IGNvcnMuYWxsb3dDcmVkZW50aWFscyxcbiAgICAgIGFsbG93SGVhZGVyczogY29ycy5hbGxvd2VkSGVhZGVycyxcbiAgICAgIGFsbG93TWV0aG9kczogY29ycy5hbGxvd2VkTWV0aG9kcyA/PyBbSHR0cE1ldGhvZC5BTExdLFxuICAgICAgYWxsb3dPcmlnaW5zOiBjb3JzLmFsbG93ZWRPcmlnaW5zLFxuICAgICAgZXhwb3NlSGVhZGVyczogY29ycy5leHBvc2VkSGVhZGVycyxcbiAgICAgIG1heEFnZTogY29ycy5tYXhBZ2U/LnRvU2Vjb25kcygpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==