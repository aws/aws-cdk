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
_a = JSII_RTTI_SYMBOL_1;
AlarmBase[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmBase", version: "0.0.0" };
exports.AlarmBase = AlarmBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW9EO0FBa0NwRDs7R0FFRztBQUNILE1BQXNCLFNBQVUsU0FBUSxlQUFRO0lBWTlDOztPQUVHO0lBQ0ksZUFBZTtRQUNwQixPQUFPLFVBQVUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO0tBQ3BDO0lBRUQ7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxHQUFHLE9BQXVCOzs7Ozs7Ozs7O1FBQzlDLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0tBQ25GO0lBRUQ7Ozs7T0FJRztJQUNJLHlCQUF5QixDQUFDLEdBQUcsT0FBdUI7Ozs7Ozs7Ozs7UUFDekQsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEtBQUssU0FBUyxFQUFFO1lBQ2pELElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLENBQUM7U0FDdEM7UUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDOUY7SUFFRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUFDLEdBQUcsT0FBdUI7Ozs7Ozs7Ozs7UUFDM0MsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDaEY7Ozs7QUF4RG1CLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUFsYXJtQWN0aW9uIH0gZnJvbSAnLi9hbGFybS1hY3Rpb24nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgQWxhcm0gUnVsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQWxhcm1SdWxlIHtcblxuICAvKipcbiAgICogc2VyaWFsaXplZCByZXByZXNlbnRhdGlvbiBvZiBBbGFybSBSdWxlIHRvIGJlIHVzZWQgd2hlbiBidWlsZGluZyB0aGUgQ29tcG9zaXRlIEFsYXJtIHJlc291cmNlLlxuICAgKi9cbiAgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZztcblxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDbG91ZFdhdGNoIEFsYXJtXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFsYXJtIGV4dGVuZHMgSUFsYXJtUnVsZSwgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIEFsYXJtIEFSTiAoaS5lLiBhcm46YXdzOmNsb3Vkd2F0Y2g6PHJlZ2lvbj46PGFjY291bnQtaWQ+OmFsYXJtOkZvbylcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxhcm1Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgYWxhcm1cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxhcm1OYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgY2xhc3MgZm9yIEFsYXJtIGFuZCBDb21wb3NpdGVBbGFybSByZXNvdXJjZXMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbGFybUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBbGFybSB7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhbGFybUFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxhcm1OYW1lOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGFsYXJtQWN0aW9uQXJucz86IHN0cmluZ1tdO1xuICBwcm90ZWN0ZWQgaW5zdWZmaWNpZW50RGF0YUFjdGlvbkFybnM/OiBzdHJpbmdbXTtcbiAgcHJvdGVjdGVkIG9rQWN0aW9uQXJucz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBbGFybVJ1bGUgaW5kaWNhdGluZyBBTEFSTSBzdGF0ZSBmb3IgQWxhcm0uXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBBTEFSTShcIiR7dGhpcy5hbGFybUFybn1cIilgO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgdGhpcyBhY3Rpb24gaWYgdGhlIGFsYXJtIGZpcmVzXG4gICAqXG4gICAqIFR5cGljYWxseSB0aGUgQVJOIG9mIGFuIFNOUyB0b3BpYyBvciBBUk4gb2YgYW4gQXV0b1NjYWxpbmcgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIGFkZEFsYXJtQWN0aW9uKC4uLmFjdGlvbnM6IElBbGFybUFjdGlvbltdKSB7XG4gICAgaWYgKHRoaXMuYWxhcm1BY3Rpb25Bcm5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuYWxhcm1BY3Rpb25Bcm5zID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5hbGFybUFjdGlvbkFybnMucHVzaCguLi5hY3Rpb25zLm1hcChhID0+IGEuYmluZCh0aGlzLCB0aGlzKS5hbGFybUFjdGlvbkFybikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgdGhpcyBhY3Rpb24gaWYgdGhlcmUgaXMgaW5zdWZmaWNpZW50IGRhdGEgdG8gZXZhbHVhdGUgdGhlIGFsYXJtXG4gICAqXG4gICAqIFR5cGljYWxseSB0aGUgQVJOIG9mIGFuIFNOUyB0b3BpYyBvciBBUk4gb2YgYW4gQXV0b1NjYWxpbmcgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIGFkZEluc3VmZmljaWVudERhdGFBY3Rpb24oLi4uYWN0aW9uczogSUFsYXJtQWN0aW9uW10pIHtcbiAgICBpZiAodGhpcy5pbnN1ZmZpY2llbnREYXRhQWN0aW9uQXJucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmluc3VmZmljaWVudERhdGFBY3Rpb25Bcm5zID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5pbnN1ZmZpY2llbnREYXRhQWN0aW9uQXJucy5wdXNoKC4uLmFjdGlvbnMubWFwKGEgPT4gYS5iaW5kKHRoaXMsIHRoaXMpLmFsYXJtQWN0aW9uQXJuKSk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciB0aGlzIGFjdGlvbiBpZiB0aGUgYWxhcm0gcmV0dXJucyBmcm9tIGJyZWFjaGluZyBzdGF0ZSBpbnRvIG9rIHN0YXRlXG4gICAqXG4gICAqIFR5cGljYWxseSB0aGUgQVJOIG9mIGFuIFNOUyB0b3BpYyBvciBBUk4gb2YgYW4gQXV0b1NjYWxpbmcgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIGFkZE9rQWN0aW9uKC4uLmFjdGlvbnM6IElBbGFybUFjdGlvbltdKSB7XG4gICAgaWYgKHRoaXMub2tBY3Rpb25Bcm5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub2tBY3Rpb25Bcm5zID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5va0FjdGlvbkFybnMucHVzaCguLi5hY3Rpb25zLm1hcChhID0+IGEuYmluZCh0aGlzLCB0aGlzKS5hbGFybUFjdGlvbkFybikpO1xuICB9XG5cbn1cbiJdfQ==