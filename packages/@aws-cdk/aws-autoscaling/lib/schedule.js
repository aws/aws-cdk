"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * Schedule for scheduled scaling actions
 */
class Schedule {
    constructor() { }
    /**
     * Construct a schedule from a literal schedule expression
     *
     * @param expression The expression to use. Must be in a format that AutoScaling will recognize
     * @see http://crontab.org/
     */
    static expression(expression) {
        return new LiteralSchedule(expression);
    }
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_CronOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.cron);
            }
            throw error;
        }
        if (options.weekDay !== undefined && options.day !== undefined) {
            throw new Error('Cannot supply both \'day\' and \'weekDay\', use at most one');
        }
        const minute = fallback(options.minute, '*');
        const hour = fallback(options.hour, '*');
        const month = fallback(options.month, '*');
        const day = fallback(options.day, '*');
        const weekDay = fallback(options.weekDay, '*');
        return new class extends Schedule {
            constructor() {
                super(...arguments);
                this.expressionString = `${minute} ${hour} ${day} ${month} ${weekDay}`;
            }
            _bind(scope) {
                if (!options.minute) {
                    core_1.Annotations.of(scope).addWarning('cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
                }
                return new LiteralSchedule(this.expressionString);
            }
        };
    }
}
exports.Schedule = Schedule;
_a = JSII_RTTI_SYMBOL_1;
Schedule[_a] = { fqn: "@aws-cdk/aws-autoscaling.Schedule", version: "0.0.0" };
class LiteralSchedule extends Schedule {
    constructor(expressionString) {
        super();
        this.expressionString = expressionString;
    }
    _bind() { }
}
function fallback(x, def) {
    return x === undefined ? def : x;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBNEM7QUFHNUM7O0dBRUc7QUFDSCxNQUFzQixRQUFRO0lBeUM1QixpQkFBMEI7SUF4QzFCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFrQjtRQUN6QyxPQUFPLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3hDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQW9COzs7Ozs7Ozs7O1FBQ3JDLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0MsT0FBTyxJQUFJLEtBQU0sU0FBUSxRQUFRO1lBQXRCOztnQkFDTyxxQkFBZ0IsR0FBVyxHQUFHLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQztZQU81RixDQUFDO1lBTlEsS0FBSyxDQUFDLEtBQWdCO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtvQkFDbkIsa0JBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLGdMQUFnTCxDQUFDLENBQUM7aUJBQ3BOO2dCQUNELE9BQU8sSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDcEQsQ0FBQztTQUNGLENBQUM7S0FDSDs7QUFsQ0gsNEJBZ0RDOzs7QUErQ0QsTUFBTSxlQUFnQixTQUFRLFFBQVE7SUFDcEMsWUFBNEIsZ0JBQXdCO1FBQ2xELEtBQUssRUFBRSxDQUFDO1FBRGtCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtLQUVuRDtJQUVNLEtBQUssTUFBVztDQUN4QjtBQUVELFNBQVMsUUFBUSxDQUFJLENBQWdCLEVBQUUsR0FBTTtJQUMzQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogU2NoZWR1bGUgZm9yIHNjaGVkdWxlZCBzY2FsaW5nIGFjdGlvbnNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjaGVkdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIHNjaGVkdWxlIGZyb20gYSBsaXRlcmFsIHNjaGVkdWxlIGV4cHJlc3Npb25cbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gdXNlLiBNdXN0IGJlIGluIGEgZm9ybWF0IHRoYXQgQXV0b1NjYWxpbmcgd2lsbCByZWNvZ25pemVcbiAgICogQHNlZSBodHRwOi8vY3JvbnRhYi5vcmcvXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKTogU2NoZWR1bGUge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbFNjaGVkdWxlKGV4cHJlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNjaGVkdWxlIGZyb20gYSBzZXQgb2YgY3JvbiBmaWVsZHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3JvbihvcHRpb25zOiBDcm9uT3B0aW9ucyk6IFNjaGVkdWxlIHtcbiAgICBpZiAob3B0aW9ucy53ZWVrRGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5kYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3VwcGx5IGJvdGggXFwnZGF5XFwnIGFuZCBcXCd3ZWVrRGF5XFwnLCB1c2UgYXQgbW9zdCBvbmUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBtaW51dGUgPSBmYWxsYmFjayhvcHRpb25zLm1pbnV0ZSwgJyonKTtcbiAgICBjb25zdCBob3VyID0gZmFsbGJhY2sob3B0aW9ucy5ob3VyLCAnKicpO1xuICAgIGNvbnN0IG1vbnRoID0gZmFsbGJhY2sob3B0aW9ucy5tb250aCwgJyonKTtcbiAgICBjb25zdCBkYXkgPSBmYWxsYmFjayhvcHRpb25zLmRheSwgJyonKTtcbiAgICBjb25zdCB3ZWVrRGF5ID0gZmFsbGJhY2sob3B0aW9ucy53ZWVrRGF5LCAnKicpO1xuXG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFNjaGVkdWxlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBleHByZXNzaW9uU3RyaW5nOiBzdHJpbmcgPSBgJHttaW51dGV9ICR7aG91cn0gJHtkYXl9ICR7bW9udGh9ICR7d2Vla0RheX1gO1xuICAgICAgcHVibGljIF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLm1pbnV0ZSkge1xuICAgICAgICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGRXYXJuaW5nKCdjcm9uOiBJZiB5b3UgZG9uXFwndCBwYXNzIFxcJ21pbnV0ZVxcJywgYnkgZGVmYXVsdCB0aGUgZXZlbnQgcnVucyBldmVyeSBtaW51dGUuIFBhc3MgXFwnbWludXRlOiBcXCcqXFwnXFwnIGlmIHRoYXRcXCdzIHdoYXQgeW91IGludGVuZCwgb3IgXFwnbWludXRlOiAwXFwnIHRvIHJ1biBvbmNlIHBlciBob3VyIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsU2NoZWR1bGUodGhpcy5leHByZXNzaW9uU3RyaW5nKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBleHByZXNzaW9uIGZvciB0aGlzIHNjaGVkdWxlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXhwcmVzc2lvblN0cmluZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiB2b2lkO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY29uZmlndXJlIGEgY3JvbiBleHByZXNzaW9uXG4gKlxuICogQWxsIGZpZWxkcyBhcmUgc3RyaW5ncyBzbyB5b3UgY2FuIHVzZSBjb21wbGV4IGV4cHJlc3Npb25zLiBBYnNlbmNlIG9mXG4gKiBhIGZpZWxkIGltcGxpZXMgJyonIG9yICc/Jywgd2hpY2hldmVyIG9uZSBpcyBhcHByb3ByaWF0ZS5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9jcm9udGFiLm9yZy9cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDcm9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbWludXRlIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBtaW51dGVcbiAgICovXG4gIHJlYWRvbmx5IG1pbnV0ZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhvdXIgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IGhvdXJcbiAgICovXG4gIHJlYWRvbmx5IGhvdXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgb2YgdGhlIG1vbnRoIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBkYXkgb2YgdGhlIG1vbnRoXG4gICAqL1xuICByZWFkb25seSBkYXk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgbW9udGhcbiAgICovXG4gIHJlYWRvbmx5IG1vbnRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IG9mIHRoZSB3ZWVrIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBbnkgZGF5IG9mIHRoZSB3ZWVrXG4gICAqL1xuICByZWFkb25seSB3ZWVrRGF5Pzogc3RyaW5nO1xufVxuXG5jbGFzcyBMaXRlcmFsU2NoZWR1bGUgZXh0ZW5kcyBTY2hlZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBleHByZXNzaW9uU3RyaW5nOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIF9iaW5kKCk6IHZvaWQge31cbn1cblxuZnVuY3Rpb24gZmFsbGJhY2s8VD4oeDogVCB8IHVuZGVmaW5lZCwgZGVmOiBUKTogVCB7XG4gIHJldHVybiB4ID09PSB1bmRlZmluZWQgPyBkZWYgOiB4O1xufVxuIl19