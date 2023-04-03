"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * The base class for Alarm and CompositeAlarm resources.
 */
class AlarmBase extends core_1.Resource {
    /**
     * AlarmRule indicating ALARM state for Alarm.
     */
    renderAlarmRule() {
        return `ALARM("${this.alarmArn}")`;
    }
    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addAlarmAction(...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmAction(actions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAlarmAction);
            }
            throw error;
        }
        if (this.alarmActionArns === undefined) {
            this.alarmActionArns = [];
        }
        this.alarmActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
    }
    /**
     * Trigger this action if there is insufficient data to evaluate the alarm
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addInsufficientDataAction(...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmAction(actions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addInsufficientDataAction);
            }
            throw error;
        }
        if (this.insufficientDataActionArns === undefined) {
            this.insufficientDataActionArns = [];
        }
        this.insufficientDataActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
    }
    /**
     * Trigger this action if the alarm returns from breaching state into ok state
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addOkAction(...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmAction(actions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addOkAction);
            }
            throw error;
        }
        if (this.okActionArns === undefined) {
            this.okActionArns = [];
        }
        this.okActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
    }
}
exports.AlarmBase = AlarmBase;
_a = JSII_RTTI_SYMBOL_1;
AlarmBase[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmBase", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW9EO0FBa0NwRDs7R0FFRztBQUNILE1BQXNCLFNBQVUsU0FBUSxlQUFRO0lBWTlDOztPQUVHO0lBQ0ksZUFBZTtRQUNwQixPQUFPLFVBQVUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO0tBQ3BDO0lBRUQ7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxHQUFHLE9BQXVCOzs7Ozs7Ozs7O1FBQzlDLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0tBQ25GO0lBRUQ7Ozs7T0FJRztJQUNJLHlCQUF5QixDQUFDLEdBQUcsT0FBdUI7Ozs7Ozs7Ozs7UUFDekQsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEtBQUssU0FBUyxFQUFFO1lBQ2pELElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLENBQUM7U0FDdEM7UUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDOUY7SUFFRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUFDLEdBQUcsT0FBdUI7Ozs7Ozs7Ozs7UUFDM0MsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDaEY7O0FBeERILDhCQTBEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElBbGFybUFjdGlvbiB9IGZyb20gJy4vYWxhcm0tYWN0aW9uJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIEFsYXJtIFJ1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFsYXJtUnVsZSB7XG5cbiAgLyoqXG4gICAqIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24gb2YgQWxhcm0gUnVsZSB0byBiZSB1c2VkIHdoZW4gYnVpbGRpbmcgdGhlIENvbXBvc2l0ZSBBbGFybSByZXNvdXJjZS5cbiAgICovXG4gIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmc7XG5cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRXYXRjaCBBbGFybVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBbGFybSBleHRlbmRzIElBbGFybVJ1bGUsIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBBbGFybSBBUk4gKGkuZS4gYXJuOmF3czpjbG91ZHdhdGNoOjxyZWdpb24+OjxhY2NvdW50LWlkPjphbGFybTpGb28pXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGFsYXJtXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBBbGFybSBhbmQgQ29tcG9zaXRlQWxhcm0gcmVzb3VyY2VzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWxhcm1CYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQWxhcm0ge1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxhcm1Bcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGFsYXJtTmFtZTogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBhbGFybUFjdGlvbkFybnM/OiBzdHJpbmdbXTtcbiAgcHJvdGVjdGVkIGluc3VmZmljaWVudERhdGFBY3Rpb25Bcm5zPzogc3RyaW5nW107XG4gIHByb3RlY3RlZCBva0FjdGlvbkFybnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQWxhcm1SdWxlIGluZGljYXRpbmcgQUxBUk0gc3RhdGUgZm9yIEFsYXJtLlxuICAgKi9cbiAgcHVibGljIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgQUxBUk0oXCIke3RoaXMuYWxhcm1Bcm59XCIpYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHRoaXMgYWN0aW9uIGlmIHRoZSBhbGFybSBmaXJlc1xuICAgKlxuICAgKiBUeXBpY2FsbHkgdGhlIEFSTiBvZiBhbiBTTlMgdG9waWMgb3IgQVJOIG9mIGFuIEF1dG9TY2FsaW5nIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyBhZGRBbGFybUFjdGlvbiguLi5hY3Rpb25zOiBJQWxhcm1BY3Rpb25bXSkge1xuICAgIGlmICh0aGlzLmFsYXJtQWN0aW9uQXJucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFsYXJtQWN0aW9uQXJucyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuYWxhcm1BY3Rpb25Bcm5zLnB1c2goLi4uYWN0aW9ucy5tYXAoYSA9PiBhLmJpbmQodGhpcywgdGhpcykuYWxhcm1BY3Rpb25Bcm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHRoaXMgYWN0aW9uIGlmIHRoZXJlIGlzIGluc3VmZmljaWVudCBkYXRhIHRvIGV2YWx1YXRlIHRoZSBhbGFybVxuICAgKlxuICAgKiBUeXBpY2FsbHkgdGhlIEFSTiBvZiBhbiBTTlMgdG9waWMgb3IgQVJOIG9mIGFuIEF1dG9TY2FsaW5nIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyBhZGRJbnN1ZmZpY2llbnREYXRhQWN0aW9uKC4uLmFjdGlvbnM6IElBbGFybUFjdGlvbltdKSB7XG4gICAgaWYgKHRoaXMuaW5zdWZmaWNpZW50RGF0YUFjdGlvbkFybnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5pbnN1ZmZpY2llbnREYXRhQWN0aW9uQXJucyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuaW5zdWZmaWNpZW50RGF0YUFjdGlvbkFybnMucHVzaCguLi5hY3Rpb25zLm1hcChhID0+IGEuYmluZCh0aGlzLCB0aGlzKS5hbGFybUFjdGlvbkFybikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgdGhpcyBhY3Rpb24gaWYgdGhlIGFsYXJtIHJldHVybnMgZnJvbSBicmVhY2hpbmcgc3RhdGUgaW50byBvayBzdGF0ZVxuICAgKlxuICAgKiBUeXBpY2FsbHkgdGhlIEFSTiBvZiBhbiBTTlMgdG9waWMgb3IgQVJOIG9mIGFuIEF1dG9TY2FsaW5nIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyBhZGRPa0FjdGlvbiguLi5hY3Rpb25zOiBJQWxhcm1BY3Rpb25bXSkge1xuICAgIGlmICh0aGlzLm9rQWN0aW9uQXJucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9rQWN0aW9uQXJucyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMub2tBY3Rpb25Bcm5zLnB1c2goLi4uYWN0aW9ucy5tYXAoYSA9PiBhLmJpbmQodGhpcywgdGhpcykuYWxhcm1BY3Rpb25Bcm4pKTtcbiAgfVxuXG59XG4iXX0=