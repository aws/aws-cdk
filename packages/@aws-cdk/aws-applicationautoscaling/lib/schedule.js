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
     * @param expression The expression to use. Must be in a format that Application AutoScaling will recognize
     */
    static expression(expression) {
        return new LiteralSchedule(expression);
    }
    /**
     * Construct a schedule from an interval and a time unit
     */
    static rate(duration) {
        if (duration.isUnresolved()) {
            const validDurationUnit = ['minute', 'minutes', 'hour', 'hours', 'day', 'days'];
            if (!validDurationUnit.includes(duration.unitLabel())) {
                throw new Error("Allowed units for scheduling are: 'minute', 'minutes', 'hour', 'hours', 'day' or 'days'");
            }
            return new LiteralSchedule(`rate(${duration.formatTokenToNumber()})`);
        }
        if (duration.toSeconds() === 0) {
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
     * Construct a Schedule from a moment in time
     */
    static at(moment) {
        return new LiteralSchedule(`at(${formatISO(moment)})`);
    }
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_CronOptions(options);
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
}
exports.Schedule = Schedule;
_a = JSII_RTTI_SYMBOL_1;
Schedule[_a] = { fqn: "@aws-cdk/aws-applicationautoscaling.Schedule", version: "0.0.0" };
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
function formatISO(date) {
    if (!date) {
        return undefined;
    }
    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds());
    function pad(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBc0Q7QUFHdEQ7O0dBRUc7QUFDSCxNQUFzQixRQUFRO0lBdUU1QixpQkFBMEI7SUF0RTFCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtCO1FBQ3pDLE9BQU8sSUFBSSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDeEM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBa0I7UUFDbkMsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRTtnQkFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RkFBeUYsQ0FBQyxDQUFDO2FBQzVHO1lBQ0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxRQUFRLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN2RTtRQUNELElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDekM7UUFFRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUFFLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxL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QzVCLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdCLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQy9CLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFFbEMsU0FBUyxHQUFHLENBQUMsR0FBVztRQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUU7WUFDWixPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUM7U0FDbEI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFNBQVMsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO0lBQ25ELElBQUksUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLFNBQVMsQ0FBQztLQUFFO0lBQ3hFLE9BQU8sUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO0lBQ2xELE9BQU8sUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxRQUFRLElBQUksUUFBUSxJQUFJLENBQUM7QUFDbkYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogU2NoZWR1bGUgZm9yIHNjaGVkdWxlZCBzY2FsaW5nIGFjdGlvbnNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjaGVkdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIHNjaGVkdWxlIGZyb20gYSBsaXRlcmFsIHNjaGVkdWxlIGV4cHJlc3Npb25cbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gdXNlLiBNdXN0IGJlIGluIGEgZm9ybWF0IHRoYXQgQXBwbGljYXRpb24gQXV0b1NjYWxpbmcgd2lsbCByZWNvZ25pemVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpOiBTY2hlZHVsZSB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsU2NoZWR1bGUoZXhwcmVzc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgc2NoZWR1bGUgZnJvbSBhbiBpbnRlcnZhbCBhbmQgYSB0aW1lIHVuaXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmF0ZShkdXJhdGlvbjogRHVyYXRpb24pOiBTY2hlZHVsZSB7XG4gICAgaWYgKGR1cmF0aW9uLmlzVW5yZXNvbHZlZCgpKSB7XG4gICAgICBjb25zdCB2YWxpZER1cmF0aW9uVW5pdCA9IFsnbWludXRlJywgJ21pbnV0ZXMnLCAnaG91cicsICdob3VycycsICdkYXknLCAnZGF5cyddO1xuICAgICAgaWYgKCF2YWxpZER1cmF0aW9uVW5pdC5pbmNsdWRlcyhkdXJhdGlvbi51bml0TGFiZWwoKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxsb3dlZCB1bml0cyBmb3Igc2NoZWR1bGluZyBhcmU6ICdtaW51dGUnLCAnbWludXRlcycsICdob3VyJywgJ2hvdXJzJywgJ2RheScgb3IgJ2RheXMnXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsU2NoZWR1bGUoYHJhdGUoJHtkdXJhdGlvbi5mb3JtYXRUb2tlblRvTnVtYmVyKCl9KWApO1xuICAgIH1cbiAgICBpZiAoZHVyYXRpb24udG9TZWNvbmRzKCkgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRHVyYXRpb24gY2Fubm90IGJlIDAnKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0ZSA9IG1heWJlUmF0ZShkdXJhdGlvbi50b0RheXMoeyBpbnRlZ3JhbDogZmFsc2UgfSksICdkYXknKTtcbiAgICBpZiAocmF0ZSA9PT0gdW5kZWZpbmVkKSB7IHJhdGUgPSBtYXliZVJhdGUoZHVyYXRpb24udG9Ib3Vycyh7IGludGVncmFsOiBmYWxzZSB9KSwgJ2hvdXInKTsgfVxuICAgIGlmIChyYXRlID09PSB1bmRlZmluZWQpIHsgcmF0ZSA9IG1ha2VSYXRlKGR1cmF0aW9uLnRvTWludXRlcyh7IGludGVncmFsOiB0cnVlIH0pLCAnbWludXRlJyk7IH1cbiAgICByZXR1cm4gbmV3IExpdGVyYWxTY2hlZHVsZShyYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBTY2hlZHVsZSBmcm9tIGEgbW9tZW50IGluIHRpbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXQobW9tZW50OiBEYXRlKTogU2NoZWR1bGUge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbFNjaGVkdWxlKGBhdCgke2Zvcm1hdElTTyhtb21lbnQpfSlgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzY2hlZHVsZSBmcm9tIGEgc2V0IG9mIGNyb24gZmllbGRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNyb24ob3B0aW9uczogQ3Jvbk9wdGlvbnMpOiBTY2hlZHVsZSB7XG4gICAgaWYgKG9wdGlvbnMud2Vla0RheSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHN1cHBseSBib3RoIFxcJ2RheVxcJyBhbmQgXFwnd2Vla0RheVxcJywgdXNlIGF0IG1vc3Qgb25lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbWludXRlID0gZmFsbGJhY2sob3B0aW9ucy5taW51dGUsICcqJyk7XG4gICAgY29uc3QgaG91ciA9IGZhbGxiYWNrKG9wdGlvbnMuaG91ciwgJyonKTtcbiAgICBjb25zdCBtb250aCA9IGZhbGxiYWNrKG9wdGlvbnMubW9udGgsICcqJyk7XG4gICAgY29uc3QgeWVhciA9IGZhbGxiYWNrKG9wdGlvbnMueWVhciwgJyonKTtcblxuICAgIC8vIFdlZWtkYXkgZGVmYXVsdHMgdG8gJz8nIGlmIG5vdCBzdXBwbGllZC4gSWYgaXQgaXMgc3VwcGxpZWQsIGRheSBtdXN0IGJlY29tZSAnPydcbiAgICBjb25zdCBkYXkgPSBmYWxsYmFjayhvcHRpb25zLmRheSwgb3B0aW9ucy53ZWVrRGF5ICE9PSB1bmRlZmluZWQgPyAnPycgOiAnKicpO1xuICAgIGNvbnN0IHdlZWtEYXkgPSBmYWxsYmFjayhvcHRpb25zLndlZWtEYXksICc/Jyk7XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU2NoZWR1bGUge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGV4cHJlc3Npb25TdHJpbmc6IHN0cmluZyA9IGBjcm9uKCR7bWludXRlfSAke2hvdXJ9ICR7ZGF5fSAke21vbnRofSAke3dlZWtEYXl9ICR7eWVhcn0pYDtcbiAgICAgIHB1YmxpYyBfYmluZChzY29wZTogQ29uc3RydWN0KSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5taW51dGUpIHtcbiAgICAgICAgICBBbm5vdGF0aW9ucy5vZihzY29wZSkuYWRkV2FybmluZygnY3JvbjogSWYgeW91IGRvblxcJ3QgcGFzcyBcXCdtaW51dGVcXCcsIGJ5IGRlZmF1bHQgdGhlIGV2ZW50IHJ1bnMgZXZlcnkgbWludXRlLiBQYXNzIFxcJ21pbnV0ZTogXFwnKlxcJ1xcJyBpZiB0aGF0XFwncyB3aGF0IHlvdSBpbnRlbmQsIG9yIFxcJ21pbnV0ZTogMFxcJyB0byBydW4gb25jZSBwZXIgaG91ciBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbFNjaGVkdWxlKHRoaXMuZXhwcmVzc2lvblN0cmluZyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgZXhwcmVzc2lvbiBmb3IgdGhpcyBzY2hlZHVsZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGV4cHJlc3Npb25TdHJpbmc6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZChzY29wZTogQ29uc3RydWN0KTogdm9pZDtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSBhIGNyb24gZXhwcmVzc2lvblxuICpcbiAqIEFsbCBmaWVsZHMgYXJlIHN0cmluZ3Mgc28geW91IGNhbiB1c2UgY29tcGxleCBleHByZXNzaW9ucy4gQWJzZW5jZSBvZlxuICogYSBmaWVsZCBpbXBsaWVzICcqJyBvciAnPycsIHdoaWNoZXZlciBvbmUgaXMgYXBwcm9wcmlhdGUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvZXZlbnRzL1NjaGVkdWxlZEV2ZW50cy5odG1sI0Nyb25FeHByZXNzaW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENyb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtaW51dGUgdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IG1pbnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbWludXRlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaG91ciB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgaG91clxuICAgKi9cbiAgcmVhZG9ubHkgaG91cj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRheSBvZiB0aGUgbW9udGggdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IGRheSBvZiB0aGUgbW9udGhcbiAgICovXG4gIHJlYWRvbmx5IGRheT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1vbnRoIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBtb250aFxuICAgKi9cbiAgcmVhZG9ubHkgbW9udGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB5ZWFyIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSB5ZWFyXG4gICAqL1xuICByZWFkb25seSB5ZWFyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IG9mIHRoZSB3ZWVrIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBbnkgZGF5IG9mIHRoZSB3ZWVrXG4gICAqL1xuICByZWFkb25seSB3ZWVrRGF5Pzogc3RyaW5nO1xufVxuXG5jbGFzcyBMaXRlcmFsU2NoZWR1bGUgZXh0ZW5kcyBTY2hlZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBleHByZXNzaW9uU3RyaW5nOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIF9iaW5kKCkge31cbn1cblxuZnVuY3Rpb24gZmFsbGJhY2s8VD4oeDogVCB8IHVuZGVmaW5lZCwgZGVmOiBUKTogVCB7XG4gIHJldHVybiB4ID09PSB1bmRlZmluZWQgPyBkZWYgOiB4O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRJU08oZGF0ZT86IERhdGUpIHtcbiAgaWYgKCFkYXRlKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICByZXR1cm4gZGF0ZS5nZXRVVENGdWxsWWVhcigpICtcbiAgICAnLScgKyBwYWQoZGF0ZS5nZXRVVENNb250aCgpICsgMSkgK1xuICAgICctJyArIHBhZChkYXRlLmdldFVUQ0RhdGUoKSkgK1xuICAgICdUJyArIHBhZChkYXRlLmdldFVUQ0hvdXJzKCkpICtcbiAgICAnOicgKyBwYWQoZGF0ZS5nZXRVVENNaW51dGVzKCkpICtcbiAgICAnOicgKyBwYWQoZGF0ZS5nZXRVVENTZWNvbmRzKCkpO1xuXG4gIGZ1bmN0aW9uIHBhZChudW06IG51bWJlcikge1xuICAgIGlmIChudW0gPCAxMCkge1xuICAgICAgcmV0dXJuICcwJyArIG51bTtcbiAgICB9XG4gICAgcmV0dXJuIG51bTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcmF0ZSBpZiB0aGUgcmF0ZSBpcyB3aG9sZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gbWF5YmVSYXRlKGludGVydmFsOiBudW1iZXIsIHNpbmd1bGFyOiBzdHJpbmcpIHtcbiAgaWYgKGludGVydmFsID09PSAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGludGVydmFsKSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gIHJldHVybiBtYWtlUmF0ZShpbnRlcnZhbCwgc2luZ3VsYXIpO1xufVxuXG4vKipcbiAqIFJldHVybiAncmF0ZSgke2ludGVydmFsfSAke3Npbmd1bGFyfShzKSlgIGZvciB0aGUgaW50ZXJ2YWxcbiAqL1xuZnVuY3Rpb24gbWFrZVJhdGUoaW50ZXJ2YWw6IG51bWJlciwgc2luZ3VsYXI6IHN0cmluZykge1xuICByZXR1cm4gaW50ZXJ2YWwgPT09IDEgPyBgcmF0ZSgxICR7c2luZ3VsYXJ9KWAgOiBgcmF0ZSgke2ludGVydmFsfSAke3Npbmd1bGFyfXMpYDtcbn1cbiJdfQ==