"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Schedule for canary runs
 */
class Schedule {
    /**
     * The canary will be executed once.
     */
    static once() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Schedule#once", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.once);
            }
            throw error;
        }
        return new Schedule('rate(0 minutes)');
    }
    /**
     * Construct a schedule from a literal schedule expression. The expression must be in a `rate(number units)` format.
     * For example, `Schedule.expression('rate(10 minutes)')`
     *
     * @param expression The expression to use.
     */
    static expression(expression) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Schedule#expression", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.expression);
            }
            throw error;
        }
        return new Schedule(expression);
    }
    /**
     * Construct a schedule from an interval. Allowed values: 0 (for a single run) or between 1 and 60 minutes.
     * To specify a single run, you can use `Schedule.once()`.
     *
     * @param interval The interval at which to run the canary
     */
    static rate(interval) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Schedule#rate", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.rate);
            }
            throw error;
        }
        const minutes = interval.toMinutes();
        if (minutes > 60) {
            throw new Error('Schedule duration must be between 1 and 60 minutes');
        }
        if (minutes === 0) {
            return Schedule.once();
        }
        if (minutes === 1) {
            return new Schedule('rate(1 minute)');
        }
        return new Schedule(`rate(${minutes} minutes)`);
    }
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Schedule#cron", "");
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_CronOptions(options);
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
        // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
        const day = fallback(options.day, options.weekDay !== undefined ? '?' : '*');
        const weekDay = fallback(options.weekDay, '?');
        // '*' is only allowed in the year field
        const year = '*';
        return new Schedule(`cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`);
    }
    constructor(
    /**
     * The Schedule expression
     */
    expressionString) {
        this.expressionString = expressionString;
    }
}
exports.Schedule = Schedule;
_a = JSII_RTTI_SYMBOL_1;
Schedule[_a] = { fqn: "@aws-cdk/aws-synthetics-alpha.Schedule", version: "0.0.0" };
function fallback(x, def) {
    return x ?? def;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7R0FFRztBQUNILE1BQWEsUUFBUTtJQUVuQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJOzs7Ozs7Ozs7O1FBQ2hCLE9BQU8sSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN4QztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFrQjs7Ozs7Ozs7OztRQUN6QyxPQUFPLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQWtCOzs7Ozs7Ozs7O1FBQ25DLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQyxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxPQUFPLFdBQVcsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQW9COzs7Ozs7Ozs7OztRQUNyQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUNoRjtRQUVELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTNDLGtGQUFrRjtRQUNsRixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQyx3Q0FBd0M7UUFDeEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBRWpCLE9BQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7S0FDbkY7SUFFRDtJQUNFOztPQUVHO0lBQ2EsZ0JBQXdCO1FBQXhCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtLQUFJOztBQWpFaEQsNEJBa0VDOzs7QUErQ0QsU0FBUyxRQUFRLENBQUMsQ0FBcUIsRUFBRSxHQUFXO0lBQ2xELE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcblxuLyoqXG4gKiBTY2hlZHVsZSBmb3IgY2FuYXJ5IHJ1bnNcbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVkdWxlIHtcblxuICAvKipcbiAgICogVGhlIGNhbmFyeSB3aWxsIGJlIGV4ZWN1dGVkIG9uY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9uY2UoKTogU2NoZWR1bGUge1xuICAgIHJldHVybiBuZXcgU2NoZWR1bGUoJ3JhdGUoMCBtaW51dGVzKScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIHNjaGVkdWxlIGZyb20gYSBsaXRlcmFsIHNjaGVkdWxlIGV4cHJlc3Npb24uIFRoZSBleHByZXNzaW9uIG11c3QgYmUgaW4gYSBgcmF0ZShudW1iZXIgdW5pdHMpYCBmb3JtYXQuXG4gICAqIEZvciBleGFtcGxlLCBgU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxMCBtaW51dGVzKScpYFxuICAgKlxuICAgKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byB1c2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKTogU2NoZWR1bGUge1xuICAgIHJldHVybiBuZXcgU2NoZWR1bGUoZXhwcmVzc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgc2NoZWR1bGUgZnJvbSBhbiBpbnRlcnZhbC4gQWxsb3dlZCB2YWx1ZXM6IDAgKGZvciBhIHNpbmdsZSBydW4pIG9yIGJldHdlZW4gMSBhbmQgNjAgbWludXRlcy5cbiAgICogVG8gc3BlY2lmeSBhIHNpbmdsZSBydW4sIHlvdSBjYW4gdXNlIGBTY2hlZHVsZS5vbmNlKClgLlxuICAgKlxuICAgKiBAcGFyYW0gaW50ZXJ2YWwgVGhlIGludGVydmFsIGF0IHdoaWNoIHRvIHJ1biB0aGUgY2FuYXJ5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJhdGUoaW50ZXJ2YWw6IER1cmF0aW9uKTogU2NoZWR1bGUge1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBpbnRlcnZhbC50b01pbnV0ZXMoKTtcbiAgICBpZiAobWludXRlcyA+IDYwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjaGVkdWxlIGR1cmF0aW9uIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA2MCBtaW51dGVzJyk7XG4gICAgfVxuICAgIGlmIChtaW51dGVzID09PSAwKSB7XG4gICAgICByZXR1cm4gU2NoZWR1bGUub25jZSgpO1xuICAgIH1cbiAgICBpZiAobWludXRlcyA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5ldyBTY2hlZHVsZSgncmF0ZSgxIG1pbnV0ZSknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZShgcmF0ZSgke21pbnV0ZXN9IG1pbnV0ZXMpYCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgc2NoZWR1bGUgZnJvbSBhIHNldCBvZiBjcm9uIGZpZWxkc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcm9uKG9wdGlvbnM6IENyb25PcHRpb25zKTogU2NoZWR1bGUge1xuICAgIGlmIChvcHRpb25zLndlZWtEYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmRheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzdXBwbHkgYm90aCBcXCdkYXlcXCcgYW5kIFxcJ3dlZWtEYXlcXCcsIHVzZSBhdCBtb3N0IG9uZScpO1xuICAgIH1cblxuICAgIGNvbnN0IG1pbnV0ZSA9IGZhbGxiYWNrKG9wdGlvbnMubWludXRlLCAnKicpO1xuICAgIGNvbnN0IGhvdXIgPSBmYWxsYmFjayhvcHRpb25zLmhvdXIsICcqJyk7XG4gICAgY29uc3QgbW9udGggPSBmYWxsYmFjayhvcHRpb25zLm1vbnRoLCAnKicpO1xuXG4gICAgLy8gV2Vla2RheSBkZWZhdWx0cyB0byAnPycgaWYgbm90IHN1cHBsaWVkLiBJZiBpdCBpcyBzdXBwbGllZCwgZGF5IG11c3QgYmVjb21lICc/J1xuICAgIGNvbnN0IGRheSA9IGZhbGxiYWNrKG9wdGlvbnMuZGF5LCBvcHRpb25zLndlZWtEYXkgIT09IHVuZGVmaW5lZCA/ICc/JyA6ICcqJyk7XG4gICAgY29uc3Qgd2Vla0RheSA9IGZhbGxiYWNrKG9wdGlvbnMud2Vla0RheSwgJz8nKTtcblxuICAgIC8vICcqJyBpcyBvbmx5IGFsbG93ZWQgaW4gdGhlIHllYXIgZmllbGRcbiAgICBjb25zdCB5ZWFyID0gJyonO1xuXG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZShgY3Jvbigke21pbnV0ZX0gJHtob3VyfSAke2RheX0gJHttb250aH0gJHt3ZWVrRGF5fSAke3llYXJ9KWApO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAvKipcbiAgICAgKiBUaGUgU2NoZWR1bGUgZXhwcmVzc2lvblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBleHByZXNzaW9uU3RyaW5nOiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBjb25maWd1cmUgYSBjcm9uIGV4cHJlc3Npb25cbiAqXG4gKiBBbGwgZmllbGRzIGFyZSBzdHJpbmdzIHNvIHlvdSBjYW4gdXNlIGNvbXBsZXggZXhwcmVzc2lvbnMuIEFic2VuY2Ugb2ZcbiAqIGEgZmllbGQgaW1wbGllcyAnKicgb3IgJz8nLCB3aGljaGV2ZXIgb25lIGlzIGFwcHJvcHJpYXRlLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX2Nyb24uaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENyb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtaW51dGUgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IG1pbnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbWludXRlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaG91ciB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgaG91clxuICAgKi9cbiAgcmVhZG9ubHkgaG91cj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRheSBvZiB0aGUgbW9udGggdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IGRheSBvZiB0aGUgbW9udGhcbiAgICovXG4gIHJlYWRvbmx5IGRheT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1vbnRoIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBtb250aFxuICAgKi9cbiAgcmVhZG9ubHkgbW9udGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgb2YgdGhlIHdlZWsgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFueSBkYXkgb2YgdGhlIHdlZWtcbiAgICovXG4gIHJlYWRvbmx5IHdlZWtEYXk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGZhbGxiYWNrKHg6IHN0cmluZyB8IHVuZGVmaW5lZCwgZGVmOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4geCA/PyBkZWY7XG59XG4iXX0=