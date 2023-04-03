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
_a = JSII_RTTI_SYMBOL_1;
AccessKey[_a] = { fqn: "@aws-cdk/aws-iam.AccessKey", version: "0.0.0" };
exports.AccessKey = AccessKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY2Vzcy1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQWlFO0FBRWpFLG1EQUErQztBQUcvQzs7R0FFRztBQUNILElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUN6Qjs7T0FFRztJQUNILG9DQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsd0NBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQVZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVTFCO0FBc0REOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBUTtJQUlyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXFCO1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FMUixTQUFTOzs7O1FBTWxCLE1BQU0sU0FBUyxHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDN0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFFakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBVyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3JGOzs7O0FBZlUsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIFJlc291cmNlLCBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5BY2Nlc3NLZXkgfSBmcm9tICcuL2lhbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVVzZXIgfSBmcm9tICcuL3VzZXInO1xuXG4vKipcbiAqIFZhbGlkIHN0YXR1c2VzIGZvciBhbiBJQU0gQWNjZXNzIEtleS5cbiAqL1xuZXhwb3J0IGVudW0gQWNjZXNzS2V5U3RhdHVzIHtcbiAgLyoqXG4gICAqIEFuIGFjdGl2ZSBhY2Nlc3Mga2V5LiBBbiBhY3RpdmUga2V5IGNhbiBiZSB1c2VkIHRvIG1ha2UgQVBJIGNhbGxzLlxuICAgKi9cbiAgQUNUSVZFID0gJ0FjdGl2ZScsXG5cbiAgLyoqXG4gICAqIEFuIGluYWN0aXZlIGFjY2VzcyBrZXkuIEFuIGluYWN0aXZlIGtleSBjYW5ub3QgYmUgdXNlZCB0byBtYWtlIEFQSSBjYWxscy5cbiAgICovXG4gIElOQUNUSVZFID0gJ0luYWN0aXZlJ1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gSUFNIEFjY2VzcyBLZXkuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfY3JlZGVudGlhbHNfYWNjZXNzLWtleXMuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBY2Nlc3NLZXkgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFjY2VzcyBLZXkgSUQuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0tleUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBTZWNyZXQgQWNjZXNzIEtleS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0QWNjZXNzS2V5OiBTZWNyZXRWYWx1ZTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhbiBJQU0gYWNjZXNzIGtleS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY2Nlc3NLZXlQcm9wcyB7XG4gIC8qKlxuICAgKiBBIENsb3VkRm9ybWF0aW9uLXNwZWNpZmljIHZhbHVlIHRoYXQgc2lnbmlmaWVzIHRoZSBhY2Nlc3Mga2V5IHNob3VsZCBiZVxuICAgKiByZXBsYWNlZC9yb3RhdGVkLiBUaGlzIHZhbHVlIGNhbiBvbmx5IGJlIGluY3JlbWVudGVkLiBJbmNyZW1lbnRpbmcgdGhpc1xuICAgKiB2YWx1ZSB3aWxsIGNhdXNlIENsb3VkRm9ybWF0aW9uIHRvIHJlcGxhY2UgdGhlIEFjY2VzcyBLZXkgcmVzb3VyY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc2VyaWFsIHZhbHVlXG4gICAqL1xuICByZWFkb25seSBzZXJpYWw/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0dXMgb2YgdGhlIGFjY2VzcyBrZXkuIEFuIEFjdGl2ZSBhY2Nlc3Mga2V5IGlzIGFsbG93ZWQgdG8gYmUgdXNlZFxuICAgKiB0byBtYWtlIEFQSSBjYWxsczsgQW4gSW5hY3RpdmUga2V5IGNhbm5vdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgYWNjZXNzIGtleSBpcyBhY3RpdmVcbiAgICovXG4gIHJlYWRvbmx5IHN0YXR1cz86IEFjY2Vzc0tleVN0YXR1cztcblxuICAvKipcbiAgICogVGhlIElBTSB1c2VyIHRoaXMga2V5IHdpbGwgYmVsb25nIHRvLlxuICAgKlxuICAgKiBDaGFuZ2luZyB0aGlzIHZhbHVlIHdpbGwgcmVzdWx0IGluIHRoZSBhY2Nlc3Mga2V5IGJlaW5nIGRlbGV0ZWQgYW5kIGEgbmV3XG4gICAqIGFjY2VzcyBrZXkgKHdpdGggYSBkaWZmZXJlbnQgSUQgYW5kIHNlY3JldCB2YWx1ZSkgYmVpbmcgYXNzaWduZWQgdG8gdGhlIG5ld1xuICAgKiB1c2VyLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlcjogSVVzZXI7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbmV3IElBTSBBY2Nlc3MgS2V5LlxuICovXG5leHBvcnQgY2xhc3MgQWNjZXNzS2V5IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQWNjZXNzS2V5IHtcbiAgcHVibGljIHJlYWRvbmx5IGFjY2Vzc0tleUlkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzZWNyZXRBY2Nlc3NLZXk6IFNlY3JldFZhbHVlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBY2Nlc3NLZXlQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3QgYWNjZXNzS2V5ID0gbmV3IENmbkFjY2Vzc0tleSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyTmFtZTogcHJvcHMudXNlci51c2VyTmFtZSxcbiAgICAgIHNlcmlhbDogcHJvcHMuc2VyaWFsLFxuICAgICAgc3RhdHVzOiBwcm9wcy5zdGF0dXMsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFjY2Vzc0tleUlkID0gYWNjZXNzS2V5LnJlZjtcblxuICAgIHRoaXMuc2VjcmV0QWNjZXNzS2V5ID0gU2VjcmV0VmFsdWUucmVzb3VyY2VBdHRyaWJ1dGUoYWNjZXNzS2V5LmF0dHJTZWNyZXRBY2Nlc3NLZXkpO1xuICB9XG59XG4iXX0=