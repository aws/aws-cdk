"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmRule = exports.AlarmState = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Enumeration indicates state of Alarm used in building Alarm Rule.
 */
var AlarmState;
(function (AlarmState) {
    /**
     * State indicates resource is in ALARM
     */
    AlarmState["ALARM"] = "ALARM";
    /**
     * State indicates resource is not in ALARM
     */
    AlarmState["OK"] = "OK";
    /**
     * State indicates there is not enough data to determine is resource is in ALARM
     */
    AlarmState["INSUFFICIENT_DATA"] = "INSUFFICIENT_DATA";
})(AlarmState = exports.AlarmState || (exports.AlarmState = {}));
/**
 * Enumeration of supported Composite Alarms operators.
 */
var Operator;
(function (Operator) {
    Operator["AND"] = "AND";
    Operator["OR"] = "OR";
    Operator["NOT"] = "NOT";
})(Operator || (Operator = {}));
/**
 * Class with static functions to build AlarmRule for Composite Alarms.
 */
class AlarmRule {
    /**
     * function to join all provided AlarmRules with AND operator.
     *
     * @param operands IAlarmRules to be joined with AND operator.
     */
    static allOf(...operands) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmRule(operands);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allOf);
            }
            throw error;
        }
        return this.concat(Operator.AND, ...operands);
    }
    /**
     * function to join all provided AlarmRules with OR operator.
     *
     * @param operands IAlarmRules to be joined with OR operator.
     */
    static anyOf(...operands) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmRule(operands);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.anyOf);
            }
            throw error;
        }
        return this.concat(Operator.OR, ...operands);
    }
    /**
     * function to wrap provided AlarmRule in NOT operator.
     *
     * @param operand IAlarmRule to be wrapped in NOT operator.
     */
    static not(operand) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmRule(operand);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.not);
            }
            throw error;
        }
        return new class {
            renderAlarmRule() {
                return `(NOT (${operand.renderAlarmRule()}))`;
            }
        };
    }
    /**
     * function to build TRUE/FALSE intent for Rule Expression.
     *
     * @param value boolean value to be used in rule expression.
     */
    static fromBoolean(value) {
        return new class {
            renderAlarmRule() {
                return `${String(value).toUpperCase()}`;
            }
        };
    }
    /**
     * function to build Rule Expression for given IAlarm and AlarmState.
     *
     * @param alarm IAlarm to be used in Rule Expression.
     * @param alarmState AlarmState to be used in Rule Expression.
     */
    static fromAlarm(alarm, alarmState) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarm(alarm);
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_AlarmState(alarmState);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAlarm);
            }
            throw error;
        }
        return new class {
            renderAlarmRule() {
                return `${alarmState}("${alarm.alarmArn}")`;
            }
        };
    }
    /**
     * function to build Rule Expression for given Alarm Rule string.
     *
     * @param alarmRule string to be used in Rule Expression.
     */
    static fromString(alarmRule) {
        return new class {
            renderAlarmRule() {
                return alarmRule;
            }
        };
    }
    static concat(operator, ...operands) {
        return new class {
            renderAlarmRule() {
                const expression = operands
                    .map(operand => `${operand.renderAlarmRule()}`)
                    .join(` ${operator} `);
                return `(${expression})`;
            }
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
AlarmRule[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmRule", version: "0.0.0" };
exports.AlarmRule = AlarmRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7O0dBRUc7QUFDSCxJQUFZLFVBaUJYO0FBakJELFdBQVksVUFBVTtJQUVwQjs7T0FFRztJQUNILDZCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILHVCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHFEQUF1QyxDQUFBO0FBRXpDLENBQUMsRUFqQlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFpQnJCO0FBRUQ7O0dBRUc7QUFDSCxJQUFLLFFBTUo7QUFORCxXQUFLLFFBQVE7SUFFWCx1QkFBVyxDQUFBO0lBQ1gscUJBQVMsQ0FBQTtJQUNULHVCQUFXLENBQUE7QUFFYixDQUFDLEVBTkksUUFBUSxLQUFSLFFBQVEsUUFNWjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxTQUFTO0lBRXBCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBc0I7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztLQUMvQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBc0I7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztLQUM5QztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQW1COzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSTtZQUNGLGVBQWU7Z0JBQ3BCLE9BQU8sU0FBUyxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQztZQUNoRCxDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBYztRQUN0QyxPQUFPLElBQUk7WUFDRixlQUFlO2dCQUNwQixPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDMUMsQ0FBQztTQUNGLENBQUM7S0FDSDtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFhLEVBQUUsVUFBc0I7Ozs7Ozs7Ozs7O1FBQzNELE9BQU8sSUFBSTtZQUNGLGVBQWU7Z0JBQ3BCLE9BQU8sR0FBRyxVQUFVLEtBQUssS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDO1lBQzlDLENBQUM7U0FDRixDQUFDO0tBQ0g7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFpQjtRQUN4QyxPQUFPLElBQUk7WUFDRixlQUFlO2dCQUNwQixPQUFPLFNBQVMsQ0FBQztZQUNuQixDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFrQixFQUFFLEdBQUcsUUFBc0I7UUFDakUsT0FBTyxJQUFJO1lBQ0YsZUFBZTtnQkFDcEIsTUFBTSxVQUFVLEdBQUcsUUFBUTtxQkFDeEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztxQkFDOUMsSUFBSSxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDekIsT0FBTyxJQUFJLFVBQVUsR0FBRyxDQUFDO1lBQzNCLENBQUM7U0FDRixDQUFDO0tBQ0g7Ozs7QUFsRlUsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQWxhcm0sIElBbGFybVJ1bGUgfSBmcm9tICcuL2FsYXJtLWJhc2UnO1xuXG4vKipcbiAqIEVudW1lcmF0aW9uIGluZGljYXRlcyBzdGF0ZSBvZiBBbGFybSB1c2VkIGluIGJ1aWxkaW5nIEFsYXJtIFJ1bGUuXG4gKi9cbmV4cG9ydCBlbnVtIEFsYXJtU3RhdGUge1xuXG4gIC8qKlxuICAgKiBTdGF0ZSBpbmRpY2F0ZXMgcmVzb3VyY2UgaXMgaW4gQUxBUk1cbiAgICovXG4gIEFMQVJNID0gJ0FMQVJNJyxcblxuICAvKipcbiAgICogU3RhdGUgaW5kaWNhdGVzIHJlc291cmNlIGlzIG5vdCBpbiBBTEFSTVxuICAgKi9cbiAgT0sgPSAnT0snLFxuXG4gIC8qKlxuICAgKiBTdGF0ZSBpbmRpY2F0ZXMgdGhlcmUgaXMgbm90IGVub3VnaCBkYXRhIHRvIGRldGVybWluZSBpcyByZXNvdXJjZSBpcyBpbiBBTEFSTVxuICAgKi9cbiAgSU5TVUZGSUNJRU5UX0RBVEEgPSAnSU5TVUZGSUNJRU5UX0RBVEEnLFxuXG59XG5cbi8qKlxuICogRW51bWVyYXRpb24gb2Ygc3VwcG9ydGVkIENvbXBvc2l0ZSBBbGFybXMgb3BlcmF0b3JzLlxuICovXG5lbnVtIE9wZXJhdG9yIHtcblxuICBBTkQgPSAnQU5EJyxcbiAgT1IgPSAnT1InLFxuICBOT1QgPSAnTk9UJyxcblxufVxuXG4vKipcbiAqIENsYXNzIHdpdGggc3RhdGljIGZ1bmN0aW9ucyB0byBidWlsZCBBbGFybVJ1bGUgZm9yIENvbXBvc2l0ZSBBbGFybXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGFybVJ1bGUge1xuXG4gIC8qKlxuICAgKiBmdW5jdGlvbiB0byBqb2luIGFsbCBwcm92aWRlZCBBbGFybVJ1bGVzIHdpdGggQU5EIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gb3BlcmFuZHMgSUFsYXJtUnVsZXMgdG8gYmUgam9pbmVkIHdpdGggQU5EIG9wZXJhdG9yLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxPZiguLi5vcGVyYW5kczogSUFsYXJtUnVsZVtdKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMuY29uY2F0KE9wZXJhdG9yLkFORCwgLi4ub3BlcmFuZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGZ1bmN0aW9uIHRvIGpvaW4gYWxsIHByb3ZpZGVkIEFsYXJtUnVsZXMgd2l0aCBPUiBvcGVyYXRvci5cbiAgICpcbiAgICogQHBhcmFtIG9wZXJhbmRzIElBbGFybVJ1bGVzIHRvIGJlIGpvaW5lZCB3aXRoIE9SIG9wZXJhdG9yLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlPZiguLi5vcGVyYW5kczogSUFsYXJtUnVsZVtdKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMuY29uY2F0KE9wZXJhdG9yLk9SLCAuLi5vcGVyYW5kcyk7XG4gIH1cblxuICAvKipcbiAgICogZnVuY3Rpb24gdG8gd3JhcCBwcm92aWRlZCBBbGFybVJ1bGUgaW4gTk9UIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gb3BlcmFuZCBJQWxhcm1SdWxlIHRvIGJlIHdyYXBwZWQgaW4gTk9UIG9wZXJhdG9yLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3Qob3BlcmFuZDogSUFsYXJtUnVsZSk6IElBbGFybVJ1bGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgaW1wbGVtZW50cyBJQWxhcm1SdWxlIHtcbiAgICAgIHB1YmxpYyByZW5kZXJBbGFybVJ1bGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAoTk9UICgke29wZXJhbmQucmVuZGVyQWxhcm1SdWxlKCl9KSlgO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogZnVuY3Rpb24gdG8gYnVpbGQgVFJVRS9GQUxTRSBpbnRlbnQgZm9yIFJ1bGUgRXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIGJvb2xlYW4gdmFsdWUgdG8gYmUgdXNlZCBpbiBydWxlIGV4cHJlc3Npb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Cb29sZWFuKHZhbHVlOiBib29sZWFuKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBpbXBsZW1lbnRzIElBbGFybVJ1bGUge1xuICAgICAgcHVibGljIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7U3RyaW5nKHZhbHVlKS50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBmdW5jdGlvbiB0byBidWlsZCBSdWxlIEV4cHJlc3Npb24gZm9yIGdpdmVuIElBbGFybSBhbmQgQWxhcm1TdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIGFsYXJtIElBbGFybSB0byBiZSB1c2VkIGluIFJ1bGUgRXhwcmVzc2lvbi5cbiAgICogQHBhcmFtIGFsYXJtU3RhdGUgQWxhcm1TdGF0ZSB0byBiZSB1c2VkIGluIFJ1bGUgRXhwcmVzc2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFsYXJtKGFsYXJtOiBJQWxhcm0sIGFsYXJtU3RhdGU6IEFsYXJtU3RhdGUpOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGltcGxlbWVudHMgSUFsYXJtUnVsZSB7XG4gICAgICBwdWJsaWMgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHthbGFybVN0YXRlfShcIiR7YWxhcm0uYWxhcm1Bcm59XCIpYDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIGZ1bmN0aW9uIHRvIGJ1aWxkIFJ1bGUgRXhwcmVzc2lvbiBmb3IgZ2l2ZW4gQWxhcm0gUnVsZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBhbGFybVJ1bGUgc3RyaW5nIHRvIGJlIHVzZWQgaW4gUnVsZSBFeHByZXNzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nKGFsYXJtUnVsZTogc3RyaW5nKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBpbXBsZW1lbnRzIElBbGFybVJ1bGUge1xuICAgICAgcHVibGljIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYWxhcm1SdWxlO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjb25jYXQob3BlcmF0b3I6IE9wZXJhdG9yLCAuLi5vcGVyYW5kczogSUFsYXJtUnVsZVtdKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBpbXBsZW1lbnRzIElBbGFybVJ1bGUge1xuICAgICAgcHVibGljIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gb3BlcmFuZHNcbiAgICAgICAgICAubWFwKG9wZXJhbmQgPT4gYCR7b3BlcmFuZC5yZW5kZXJBbGFybVJ1bGUoKX1gKVxuICAgICAgICAgIC5qb2luKGAgJHtvcGVyYXRvcn0gYCk7XG4gICAgICAgIHJldHVybiBgKCR7ZXhwcmVzc2lvbn0pYDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=