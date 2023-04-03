"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * Schedule for scheduled event rules
 *
 * Note that rates cannot be defined in fractions of minutes.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html
 */
class Schedule {
    /**
     * Construct a schedule from a literal schedule expression
     *
     * @param expression The expression to use. Must be in a format that EventBridge will recognize
     */
    static expression(expression) {
        return new LiteralSchedule(expression);
    }
    /**
     * Construct a schedule from an interval and a time unit
     *
     * Rates may be defined with any unit of time, but when converted into minutes, the duration must be a positive whole number of minutes.
     */
    static rate(duration) {
        if (duration.isUnresolved()) {
            const validDurationUnit = ['minute', 'minutes', 'hour', 'hours', 'day', 'days'];
            if (validDurationUnit.indexOf(duration.unitLabel()) === -1) {
                throw new Error("Allowed units for scheduling are: 'minute', 'minutes', 'hour', 'hours', 'day', 'days'");
            }
            return new LiteralSchedule(`rate(${duration.formatTokenToNumber()})`);
        }
        if (duration.toMinutes() === 0) {
            throw new Error('Duration cannot be 0');
        }
        let rate = maybeRate(duration.toDays({ integral: false }), 'day');
        if (rate === undefined) {
            rate = maybeRate(duration.toHours({ integral: false }), 'hour');
        }
        if (rate === undefined) {
            rate = makeRate(duration.toMinutes({ integral: true }), 'minute');
        }
        return new LiteralSchedule(rate);
    }
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_CronOptions(options);
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
        const year = fallback(options.year, '*');
        // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
        const day = fallback(options.day, options.weekDay !== undefined ? '?' : '*');
        const weekDay = fallback(options.weekDay, '?');
        return new class extends Schedule {
            constructor() {
                super(...arguments);
                this.expressionString = `cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`;
            }
            _bind(scope) {
                if (!options.minute) {
                    core_1.Annotations.of(scope).addWarning('cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
                }
                return new LiteralSchedule(this.expressionString);
            }
        };
    }
    constructor() { }
}
_a = JSII_RTTI_SYMBOL_1;
Schedule[_a] = { fqn: "@aws-cdk/aws-events.Schedule", version: "0.0.0" };
exports.Schedule = Schedule;
class LiteralSchedule extends Schedule {
    constructor(expressionString) {
        super();
        this.expressionString = expressionString;
    }
    _bind() { }
}
function fallback(x, def) {
    return x ?? def;
}
/**
 * Return the rate if the rate is whole number
 */
function maybeRate(interval, singular) {
    if (interval === 0 || !Number.isInteger(interval)) {
        return undefined;
    }
    return makeRate(interval, singular);
}
/**
 * Return 'rate(${interval} ${singular}(s))` for the interval
 */
function makeRate(interval, singular) {
    return interval === 1 ? `rate(1 ${singular})` : `rate(${interval} ${singular}s)`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBc0Q7QUFHdEQ7Ozs7OztHQU1HO0FBQ0gsTUFBc0IsUUFBUTtJQUM1Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFrQjtRQUN6QyxPQUFPLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3hDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBa0I7UUFDbkMsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEYsSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsdUZBQXVGLENBQUMsQ0FBQzthQUMxRztZQUNELE9BQU8sSUFBSSxlQUFlLENBQUMsUUFBUSxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDdkU7UUFDRCxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUs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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIFNjaGVkdWxlIGZvciBzY2hlZHVsZWQgZXZlbnQgcnVsZXNcbiAqXG4gKiBOb3RlIHRoYXQgcmF0ZXMgY2Fubm90IGJlIGRlZmluZWQgaW4gZnJhY3Rpb25zIG9mIG1pbnV0ZXMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZXZlbnRicmlkZ2UvbGF0ZXN0L3VzZXJndWlkZS9zY2hlZHVsZWQtZXZlbnRzLmh0bWxcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjaGVkdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIHNjaGVkdWxlIGZyb20gYSBsaXRlcmFsIHNjaGVkdWxlIGV4cHJlc3Npb25cbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gdXNlLiBNdXN0IGJlIGluIGEgZm9ybWF0IHRoYXQgRXZlbnRCcmlkZ2Ugd2lsbCByZWNvZ25pemVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpOiBTY2hlZHVsZSB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsU2NoZWR1bGUoZXhwcmVzc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgc2NoZWR1bGUgZnJvbSBhbiBpbnRlcnZhbCBhbmQgYSB0aW1lIHVuaXRcbiAgICpcbiAgICogUmF0ZXMgbWF5IGJlIGRlZmluZWQgd2l0aCBhbnkgdW5pdCBvZiB0aW1lLCBidXQgd2hlbiBjb252ZXJ0ZWQgaW50byBtaW51dGVzLCB0aGUgZHVyYXRpb24gbXVzdCBiZSBhIHBvc2l0aXZlIHdob2xlIG51bWJlciBvZiBtaW51dGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByYXRlKGR1cmF0aW9uOiBEdXJhdGlvbik6IFNjaGVkdWxlIHtcbiAgICBpZiAoZHVyYXRpb24uaXNVbnJlc29sdmVkKCkpIHtcbiAgICAgIGNvbnN0IHZhbGlkRHVyYXRpb25Vbml0ID0gWydtaW51dGUnLCAnbWludXRlcycsICdob3VyJywgJ2hvdXJzJywgJ2RheScsICdkYXlzJ107XG4gICAgICBpZiAodmFsaWREdXJhdGlvblVuaXQuaW5kZXhPZihkdXJhdGlvbi51bml0TGFiZWwoKSkgPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbG93ZWQgdW5pdHMgZm9yIHNjaGVkdWxpbmcgYXJlOiAnbWludXRlJywgJ21pbnV0ZXMnLCAnaG91cicsICdob3VycycsICdkYXknLCAnZGF5cydcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IExpdGVyYWxTY2hlZHVsZShgcmF0ZSgke2R1cmF0aW9uLmZvcm1hdFRva2VuVG9OdW1iZXIoKX0pYCk7XG4gICAgfVxuICAgIGlmIChkdXJhdGlvbi50b01pbnV0ZXMoKSA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEdXJhdGlvbiBjYW5ub3QgYmUgMCcpO1xuICAgIH1cblxuICAgIGxldCByYXRlID0gbWF5YmVSYXRlKGR1cmF0aW9uLnRvRGF5cyh7IGludGVncmFsOiBmYWxzZSB9KSwgJ2RheScpO1xuICAgIGlmIChyYXRlID09PSB1bmRlZmluZWQpIHsgcmF0ZSA9IG1heWJlUmF0ZShkdXJhdGlvbi50b0hvdXJzKHsgaW50ZWdyYWw6IGZhbHNlIH0pLCAnaG91cicpOyB9XG4gICAgaWYgKHJhdGUgPT09IHVuZGVmaW5lZCkgeyByYXRlID0gbWFrZVJhdGUoZHVyYXRpb24udG9NaW51dGVzKHsgaW50ZWdyYWw6IHRydWUgfSksICdtaW51dGUnKTsgfVxuICAgIHJldHVybiBuZXcgTGl0ZXJhbFNjaGVkdWxlKHJhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNjaGVkdWxlIGZyb20gYSBzZXQgb2YgY3JvbiBmaWVsZHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3JvbihvcHRpb25zOiBDcm9uT3B0aW9ucyk6IFNjaGVkdWxlIHtcbiAgICBpZiAob3B0aW9ucy53ZWVrRGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5kYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3VwcGx5IGJvdGggXFwnZGF5XFwnIGFuZCBcXCd3ZWVrRGF5XFwnLCB1c2UgYXQgbW9zdCBvbmUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBtaW51dGUgPSBmYWxsYmFjayhvcHRpb25zLm1pbnV0ZSwgJyonKTtcbiAgICBjb25zdCBob3VyID0gZmFsbGJhY2sob3B0aW9ucy5ob3VyLCAnKicpO1xuICAgIGNvbnN0IG1vbnRoID0gZmFsbGJhY2sob3B0aW9ucy5tb250aCwgJyonKTtcbiAgICBjb25zdCB5ZWFyID0gZmFsbGJhY2sob3B0aW9ucy55ZWFyLCAnKicpO1xuXG4gICAgLy8gV2Vla2RheSBkZWZhdWx0cyB0byAnPycgaWYgbm90IHN1cHBsaWVkLiBJZiBpdCBpcyBzdXBwbGllZCwgZGF5IG11c3QgYmVjb21lICc/J1xuICAgIGNvbnN0IGRheSA9IGZhbGxiYWNrKG9wdGlvbnMuZGF5LCBvcHRpb25zLndlZWtEYXkgIT09IHVuZGVmaW5lZCA/ICc/JyA6ICcqJyk7XG4gICAgY29uc3Qgd2Vla0RheSA9IGZhbGxiYWNrKG9wdGlvbnMud2Vla0RheSwgJz8nKTtcblxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBTY2hlZHVsZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZXhwcmVzc2lvblN0cmluZzogc3RyaW5nID0gYGNyb24oJHttaW51dGV9ICR7aG91cn0gJHtkYXl9ICR7bW9udGh9ICR7d2Vla0RheX0gJHt5ZWFyfSlgO1xuICAgICAgcHVibGljIF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLm1pbnV0ZSkge1xuICAgICAgICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGRXYXJuaW5nKCdjcm9uOiBJZiB5b3UgZG9uXFwndCBwYXNzIFxcJ21pbnV0ZVxcJywgYnkgZGVmYXVsdCB0aGUgZXZlbnQgcnVucyBldmVyeSBtaW51dGUuIFBhc3MgXFwnbWludXRlOiBcXCcqXFwnXFwnIGlmIHRoYXRcXCdzIHdoYXQgeW91IGludGVuZCwgb3IgXFwnbWludXRlOiAwXFwnIHRvIHJ1biBvbmNlIHBlciBob3VyIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsU2NoZWR1bGUodGhpcy5leHByZXNzaW9uU3RyaW5nKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBleHByZXNzaW9uIGZvciB0aGlzIHNjaGVkdWxlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXhwcmVzc2lvblN0cmluZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiB2b2lkO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY29uZmlndXJlIGEgY3JvbiBleHByZXNzaW9uXG4gKlxuICogQWxsIGZpZWxkcyBhcmUgc3RyaW5ncyBzbyB5b3UgY2FuIHVzZSBjb21wbGV4IGV4cHJlc3Npb25zLiBBYnNlbmNlIG9mXG4gKiBhIGZpZWxkIGltcGxpZXMgJyonIG9yICc/Jywgd2hpY2hldmVyIG9uZSBpcyBhcHByb3ByaWF0ZS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9ldmVudGJyaWRnZS9sYXRlc3QvdXNlcmd1aWRlL3NjaGVkdWxlZC1ldmVudHMuaHRtbCNjcm9uLWV4cHJlc3Npb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG1pbnV0ZSB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgbWludXRlXG4gICAqL1xuICByZWFkb25seSBtaW51dGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBob3VyIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBob3VyXG4gICAqL1xuICByZWFkb25seSBob3VyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IG9mIHRoZSBtb250aCB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgZGF5IG9mIHRoZSBtb250aFxuICAgKi9cbiAgcmVhZG9ubHkgZGF5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IG1vbnRoXG4gICAqL1xuICByZWFkb25seSBtb250aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHllYXIgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IHllYXJcbiAgICovXG4gIHJlYWRvbmx5IHllYXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgb2YgdGhlIHdlZWsgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFueSBkYXkgb2YgdGhlIHdlZWtcbiAgICovXG4gIHJlYWRvbmx5IHdlZWtEYXk/OiBzdHJpbmc7XG59XG5cbmNsYXNzIExpdGVyYWxTY2hlZHVsZSBleHRlbmRzIFNjaGVkdWxlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGV4cHJlc3Npb25TdHJpbmc6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgX2JpbmQoKSB7fVxufVxuXG5mdW5jdGlvbiBmYWxsYmFjazxUPih4OiBUIHwgdW5kZWZpbmVkLCBkZWY6IFQpOiBUIHtcbiAgcmV0dXJuIHggPz8gZGVmO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcmF0ZSBpZiB0aGUgcmF0ZSBpcyB3aG9sZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gbWF5YmVSYXRlKGludGVydmFsOiBudW1iZXIsIHNpbmd1bGFyOiBzdHJpbmcpIHtcbiAgaWYgKGludGVydmFsID09PSAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGludGVydmFsKSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gIHJldHVybiBtYWtlUmF0ZShpbnRlcnZhbCwgc2luZ3VsYXIpO1xufVxuXG4vKipcbiAqIFJldHVybiAncmF0ZSgke2ludGVydmFsfSAke3Npbmd1bGFyfShzKSlgIGZvciB0aGUgaW50ZXJ2YWxcbiAqL1xuZnVuY3Rpb24gbWFrZVJhdGUoaW50ZXJ2YWw6IG51bWJlciwgc2luZ3VsYXI6IHN0cmluZykge1xuICByZXR1cm4gaW50ZXJ2YWwgPT09IDEgPyBgcmF0ZSgxICR7c2luZ3VsYXJ9KWAgOiBgcmF0ZSgke2ludGVydmFsfSAke3Npbmd1bGFyfXMpYDtcbn1cbiJdfQ==