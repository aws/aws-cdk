"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKey = exports.AccessKeyStatus = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
/**
 * Valid statuses for an IAM Access Key.
 */
var AccessKeyStatus;
(function (AccessKeyStatus) {
    /**
     * An active access key. An active key can be used to make API calls.
     */
    AccessKeyStatus["ACTIVE"] = "Active";
    /**
     * An inactive access key. An inactive key cannot be used to make API calls.
     */
    AccessKeyStatus["INACTIVE"] = "Inactive";
})(AccessKeyStatus = exports.AccessKeyStatus || (exports.AccessKeyStatus = {}));
/**
 * Define a new IAM Access Key.
 */
class AccessKey extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_AccessKeyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AccessKey);
            }
            throw error;
        }
        const accessKey = new iam_generated_1.CfnAccessKey(this, 'Resource', {
            userName: props.user.userName,
            serial: props.serial,
            status: props.status,
        });
        this.accessKeyId = accessKey.ref;
        this.secretAccessKey = core_1.SecretValue.resourceAttribute(accessKey.attrSecretAccessKey);
    }
}
exports.AccessKey = AccessKey;
_a = JSII_RTTI_SYMBOL_1;
AccessKey[_a] = { fqn: "@aws-cdk/aws-iam.AccessKey", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY2Vzcy1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQWlFO0FBRWpFLG1EQUErQztBQUcvQzs7R0FFRztBQUNILElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUN6Qjs7T0FFRztJQUNILG9DQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsd0NBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQVZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVTFCO0FBc0REOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBUTtJQUlyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXFCO1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FMUixTQUFTOzs7O1FBTWxCLE1BQU0sU0FBUyxHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDN0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFFakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBVyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3JGOztBQWZILDhCQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UsIFNlY3JldFZhbHVlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkFjY2Vzc0tleSB9IGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdXNlcic7XG5cbi8qKlxuICogVmFsaWQgc3RhdHVzZXMgZm9yIGFuIElBTSBBY2Nlc3MgS2V5LlxuICovXG5leHBvcnQgZW51bSBBY2Nlc3NLZXlTdGF0dXMge1xuICAvKipcbiAgICogQW4gYWN0aXZlIGFjY2VzcyBrZXkuIEFuIGFjdGl2ZSBrZXkgY2FuIGJlIHVzZWQgdG8gbWFrZSBBUEkgY2FsbHMuXG4gICAqL1xuICBBQ1RJVkUgPSAnQWN0aXZlJyxcblxuICAvKipcbiAgICogQW4gaW5hY3RpdmUgYWNjZXNzIGtleS4gQW4gaW5hY3RpdmUga2V5IGNhbm5vdCBiZSB1c2VkIHRvIG1ha2UgQVBJIGNhbGxzLlxuICAgKi9cbiAgSU5BQ1RJVkUgPSAnSW5hY3RpdmUnXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBJQU0gQWNjZXNzIEtleS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9jcmVkZW50aWFsc19hY2Nlc3Mta2V5cy5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFjY2Vzc0tleSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgQWNjZXNzIEtleSBJRC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzS2V5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFNlY3JldCBBY2Nlc3MgS2V5LlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRBY2Nlc3NLZXk6IFNlY3JldFZhbHVlO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIElBTSBhY2Nlc3Mga2V5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjY2Vzc0tleVByb3BzIHtcbiAgLyoqXG4gICAqIEEgQ2xvdWRGb3JtYXRpb24tc3BlY2lmaWMgdmFsdWUgdGhhdCBzaWduaWZpZXMgdGhlIGFjY2VzcyBrZXkgc2hvdWxkIGJlXG4gICAqIHJlcGxhY2VkL3JvdGF0ZWQuIFRoaXMgdmFsdWUgY2FuIG9ubHkgYmUgaW5jcmVtZW50ZWQuIEluY3JlbWVudGluZyB0aGlzXG4gICAqIHZhbHVlIHdpbGwgY2F1c2UgQ2xvdWRGb3JtYXRpb24gdG8gcmVwbGFjZSB0aGUgQWNjZXNzIEtleSByZXNvdXJjZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzZXJpYWwgdmFsdWVcbiAgICovXG4gIHJlYWRvbmx5IHNlcmlhbD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHN0YXR1cyBvZiB0aGUgYWNjZXNzIGtleS4gQW4gQWN0aXZlIGFjY2VzcyBrZXkgaXMgYWxsb3dlZCB0byBiZSB1c2VkXG4gICAqIHRvIG1ha2UgQVBJIGNhbGxzOyBBbiBJbmFjdGl2ZSBrZXkgY2Fubm90LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBhY2Nlc3Mga2V5IGlzIGFjdGl2ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdHVzPzogQWNjZXNzS2V5U3RhdHVzO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHVzZXIgdGhpcyBrZXkgd2lsbCBiZWxvbmcgdG8uXG4gICAqXG4gICAqIENoYW5naW5nIHRoaXMgdmFsdWUgd2lsbCByZXN1bHQgaW4gdGhlIGFjY2VzcyBrZXkgYmVpbmcgZGVsZXRlZCBhbmQgYSBuZXdcbiAgICogYWNjZXNzIGtleSAod2l0aCBhIGRpZmZlcmVudCBJRCBhbmQgc2VjcmV0IHZhbHVlKSBiZWluZyBhc3NpZ25lZCB0byB0aGUgbmV3XG4gICAqIHVzZXIuXG4gICAqL1xuICByZWFkb25seSB1c2VyOiBJVXNlcjtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBuZXcgSUFNIEFjY2VzcyBLZXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBBY2Nlc3NLZXkgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBY2Nlc3NLZXkge1xuICBwdWJsaWMgcmVhZG9ubHkgYWNjZXNzS2V5SWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHNlY3JldEFjY2Vzc0tleTogU2VjcmV0VmFsdWU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFjY2Vzc0tleVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCBhY2Nlc3NLZXkgPSBuZXcgQ2ZuQWNjZXNzS2V5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHVzZXJOYW1lOiBwcm9wcy51c2VyLnVzZXJOYW1lLFxuICAgICAgc2VyaWFsOiBwcm9wcy5zZXJpYWwsXG4gICAgICBzdGF0dXM6IHByb3BzLnN0YXR1cyxcbiAgICB9KTtcblxuICAgIHRoaXMuYWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXkucmVmO1xuXG4gICAgdGhpcy5zZWNyZXRBY2Nlc3NLZXkgPSBTZWNyZXRWYWx1ZS5yZXNvdXJjZUF0dHJpYnV0ZShhY2Nlc3NLZXkuYXR0clNlY3JldEFjY2Vzc0tleSk7XG4gIH1cbn1cbiJdfQ==