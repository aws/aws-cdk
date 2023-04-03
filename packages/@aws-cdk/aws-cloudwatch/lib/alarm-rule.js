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
exports.AlarmRule = AlarmRule;
_a = JSII_RTTI_SYMBOL_1;
AlarmRule[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmRule", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7O0dBRUc7QUFDSCxJQUFZLFVBaUJYO0FBakJELFdBQVksVUFBVTtJQUVwQjs7T0FFRztJQUNILDZCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILHVCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHFEQUF1QyxDQUFBO0FBRXpDLENBQUMsRUFqQlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFpQnJCO0FBRUQ7O0dBRUc7QUFDSCxJQUFLLFFBTUo7QUFORCxXQUFLLFFBQVE7SUFFWCx1QkFBVyxDQUFBO0lBQ1gscUJBQVMsQ0FBQTtJQUNULHVCQUFXLENBQUE7QUFFYixDQUFDLEVBTkksUUFBUSxLQUFSLFFBQVEsUUFNWjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxTQUFTO0lBRXBCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBc0I7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztLQUMvQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBc0I7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztLQUM5QztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQW1COzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSTtZQUNGLGVBQWU7Z0JBQ3BCLE9BQU8sU0FBUyxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQztZQUNoRCxDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBYztRQUN0QyxPQUFPLElBQUk7WUFDRixlQUFlO2dCQUNwQixPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDMUMsQ0FBQztTQUNGLENBQUM7S0FDSDtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFhLEVBQUUsVUFBc0I7Ozs7Ozs7Ozs7O1FBQzNELE9BQU8sSUFBSTtZQUNGLGVBQWU7Z0JBQ3BCLE9BQU8sR0FBRyxVQUFVLEtBQUssS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDO1lBQzlDLENBQUM7U0FDRixDQUFDO0tBQ0g7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFpQjtRQUN4QyxPQUFPLElBQUk7WUFDRixlQUFlO2dCQUNwQixPQUFPLFNBQVMsQ0FBQztZQUNuQixDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFrQixFQUFFLEdBQUcsUUFBc0I7UUFDakUsT0FBTyxJQUFJO1lBQ0YsZUFBZTtnQkFDcEIsTUFBTSxVQUFVLEdBQUcsUUFBUTtxQkFDeEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztxQkFDOUMsSUFBSSxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDekIsT0FBTyxJQUFJLFVBQVUsR0FBRyxDQUFDO1lBQzNCLENBQUM7U0FDRixDQUFDO0tBQ0g7O0FBbEZILDhCQW1GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBbGFybSwgSUFsYXJtUnVsZSB9IGZyb20gJy4vYWxhcm0tYmFzZSc7XG5cbi8qKlxuICogRW51bWVyYXRpb24gaW5kaWNhdGVzIHN0YXRlIG9mIEFsYXJtIHVzZWQgaW4gYnVpbGRpbmcgQWxhcm0gUnVsZS5cbiAqL1xuZXhwb3J0IGVudW0gQWxhcm1TdGF0ZSB7XG5cbiAgLyoqXG4gICAqIFN0YXRlIGluZGljYXRlcyByZXNvdXJjZSBpcyBpbiBBTEFSTVxuICAgKi9cbiAgQUxBUk0gPSAnQUxBUk0nLFxuXG4gIC8qKlxuICAgKiBTdGF0ZSBpbmRpY2F0ZXMgcmVzb3VyY2UgaXMgbm90IGluIEFMQVJNXG4gICAqL1xuICBPSyA9ICdPSycsXG5cbiAgLyoqXG4gICAqIFN0YXRlIGluZGljYXRlcyB0aGVyZSBpcyBub3QgZW5vdWdoIGRhdGEgdG8gZGV0ZXJtaW5lIGlzIHJlc291cmNlIGlzIGluIEFMQVJNXG4gICAqL1xuICBJTlNVRkZJQ0lFTlRfREFUQSA9ICdJTlNVRkZJQ0lFTlRfREFUQScsXG5cbn1cblxuLyoqXG4gKiBFbnVtZXJhdGlvbiBvZiBzdXBwb3J0ZWQgQ29tcG9zaXRlIEFsYXJtcyBvcGVyYXRvcnMuXG4gKi9cbmVudW0gT3BlcmF0b3Ige1xuXG4gIEFORCA9ICdBTkQnLFxuICBPUiA9ICdPUicsXG4gIE5PVCA9ICdOT1QnLFxuXG59XG5cbi8qKlxuICogQ2xhc3Mgd2l0aCBzdGF0aWMgZnVuY3Rpb25zIHRvIGJ1aWxkIEFsYXJtUnVsZSBmb3IgQ29tcG9zaXRlIEFsYXJtcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFsYXJtUnVsZSB7XG5cbiAgLyoqXG4gICAqIGZ1bmN0aW9uIHRvIGpvaW4gYWxsIHByb3ZpZGVkIEFsYXJtUnVsZXMgd2l0aCBBTkQgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBvcGVyYW5kcyBJQWxhcm1SdWxlcyB0byBiZSBqb2luZWQgd2l0aCBBTkQgb3BlcmF0b3IuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbE9mKC4uLm9wZXJhbmRzOiBJQWxhcm1SdWxlW10pOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5jb25jYXQoT3BlcmF0b3IuQU5ELCAuLi5vcGVyYW5kcyk7XG4gIH1cblxuICAvKipcbiAgICogZnVuY3Rpb24gdG8gam9pbiBhbGwgcHJvdmlkZWQgQWxhcm1SdWxlcyB3aXRoIE9SIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gb3BlcmFuZHMgSUFsYXJtUnVsZXMgdG8gYmUgam9pbmVkIHdpdGggT1Igb3BlcmF0b3IuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueU9mKC4uLm9wZXJhbmRzOiBJQWxhcm1SdWxlW10pOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5jb25jYXQoT3BlcmF0b3IuT1IsIC4uLm9wZXJhbmRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBmdW5jdGlvbiB0byB3cmFwIHByb3ZpZGVkIEFsYXJtUnVsZSBpbiBOT1Qgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBvcGVyYW5kIElBbGFybVJ1bGUgdG8gYmUgd3JhcHBlZCBpbiBOT1Qgb3BlcmF0b3IuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdChvcGVyYW5kOiBJQWxhcm1SdWxlKTogSUFsYXJtUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBpbXBsZW1lbnRzIElBbGFybVJ1bGUge1xuICAgICAgcHVibGljIHJlbmRlckFsYXJtUnVsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYChOT1QgKCR7b3BlcmFuZC5yZW5kZXJBbGFybVJ1bGUoKX0pKWA7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBmdW5jdGlvbiB0byBidWlsZCBUUlVFL0ZBTFNFIGludGVudCBmb3IgUnVsZSBFeHByZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgYm9vbGVhbiB2YWx1ZSB0byBiZSB1c2VkIGluIHJ1bGUgZXhwcmVzc2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJvb2xlYW4odmFsdWU6IGJvb2xlYW4pOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGltcGxlbWVudHMgSUFsYXJtUnVsZSB7XG4gICAgICBwdWJsaWMgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHtTdHJpbmcodmFsdWUpLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIGZ1bmN0aW9uIHRvIGJ1aWxkIFJ1bGUgRXhwcmVzc2lvbiBmb3IgZ2l2ZW4gSUFsYXJtIGFuZCBBbGFybVN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gYWxhcm0gSUFsYXJtIHRvIGJlIHVzZWQgaW4gUnVsZSBFeHByZXNzaW9uLlxuICAgKiBAcGFyYW0gYWxhcm1TdGF0ZSBBbGFybVN0YXRlIHRvIGJlIHVzZWQgaW4gUnVsZSBFeHByZXNzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWxhcm0oYWxhcm06IElBbGFybSwgYWxhcm1TdGF0ZTogQWxhcm1TdGF0ZSk6IElBbGFybVJ1bGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgaW1wbGVtZW50cyBJQWxhcm1SdWxlIHtcbiAgICAgIHB1YmxpYyByZW5kZXJBbGFybVJ1bGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke2FsYXJtU3RhdGV9KFwiJHthbGFybS5hbGFybUFybn1cIilgO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogZnVuY3Rpb24gdG8gYnVpbGQgUnVsZSBFeHByZXNzaW9uIGZvciBnaXZlbiBBbGFybSBSdWxlIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIGFsYXJtUnVsZSBzdHJpbmcgdG8gYmUgdXNlZCBpbiBSdWxlIEV4cHJlc3Npb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcoYWxhcm1SdWxlOiBzdHJpbmcpOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGltcGxlbWVudHMgSUFsYXJtUnVsZSB7XG4gICAgICBwdWJsaWMgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBhbGFybVJ1bGU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNvbmNhdChvcGVyYXRvcjogT3BlcmF0b3IsIC4uLm9wZXJhbmRzOiBJQWxhcm1SdWxlW10pOiBJQWxhcm1SdWxlIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGltcGxlbWVudHMgSUFsYXJtUnVsZSB7XG4gICAgICBwdWJsaWMgcmVuZGVyQWxhcm1SdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBvcGVyYW5kc1xuICAgICAgICAgIC5tYXAob3BlcmFuZCA9PiBgJHtvcGVyYW5kLnJlbmRlckFsYXJtUnVsZSgpfWApXG4gICAgICAgICAgLmpvaW4oYCAke29wZXJhdG9yfSBgKTtcbiAgICAgICAgcmV0dXJuIGAoJHtleHByZXNzaW9ufSlgO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiJdfQ==