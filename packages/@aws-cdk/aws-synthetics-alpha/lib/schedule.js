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
        return new Schedule('rate(0 minutes)');
    }
    /**
     * Construct a schedule from a literal schedule expression. The expression must be in a `rate(number units)` format.
     * For example, `Schedule.expression('rate(10 minutes)')`
     *
     * @param expression The expression to use.
     */
    static expression(expression) {
        return new Schedule(expression);
    }
    /**
     * Construct a schedule from an interval. Allowed values: 0 (for a single run) or between 1 and 60 minutes.
     * To specify a single run, you can use `Schedule.once()`.
     *
     * @param interval The interval at which to run the canary
     */
    static rate(interval) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7R0FFRztBQUNILE1BQWEsUUFBUTtJQUVuQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU8sSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN4QztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFrQjtRQUN6QyxPQUFPLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQWtCO1FBQ25DLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQyxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxPQUFPLFdBQVcsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQW9COzs7Ozs7Ozs7O1FBQ3JDLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFM0Msa0ZBQWtGO1FBQ2xGLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9DLHdDQUF3QztRQUN4QyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7UUFFakIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxRQUFRLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztLQUNuRjtJQUVEO0lBQ0U7O09BRUc7SUFDYSxnQkFBd0I7UUFBeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO0tBQUk7O0FBakVoRCw0QkFrRUM7OztBQStDRCxTQUFTLFFBQVEsQ0FBQyxDQUFxQixFQUFFLEdBQVc7SUFDbEQsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuXG4vKipcbiAqIFNjaGVkdWxlIGZvciBjYW5hcnkgcnVuc1xuICovXG5leHBvcnQgY2xhc3MgU2NoZWR1bGUge1xuXG4gIC8qKlxuICAgKiBUaGUgY2FuYXJ5IHdpbGwgYmUgZXhlY3V0ZWQgb25jZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb25jZSgpOiBTY2hlZHVsZSB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZSgncmF0ZSgwIG1pbnV0ZXMpJyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgc2NoZWR1bGUgZnJvbSBhIGxpdGVyYWwgc2NoZWR1bGUgZXhwcmVzc2lvbi4gVGhlIGV4cHJlc3Npb24gbXVzdCBiZSBpbiBhIGByYXRlKG51bWJlciB1bml0cylgIGZvcm1hdC5cbiAgICogRm9yIGV4YW1wbGUsIGBTY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEwIG1pbnV0ZXMpJylgXG4gICAqXG4gICAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpOiBTY2hlZHVsZSB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZShleHByZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBzY2hlZHVsZSBmcm9tIGFuIGludGVydmFsLiBBbGxvd2VkIHZhbHVlczogMCAoZm9yIGEgc2luZ2xlIHJ1bikgb3IgYmV0d2VlbiAxIGFuZCA2MCBtaW51dGVzLlxuICAgKiBUbyBzcGVjaWZ5IGEgc2luZ2xlIHJ1biwgeW91IGNhbiB1c2UgYFNjaGVkdWxlLm9uY2UoKWAuXG4gICAqXG4gICAqIEBwYXJhbSBpbnRlcnZhbCBUaGUgaW50ZXJ2YWwgYXQgd2hpY2ggdG8gcnVuIHRoZSBjYW5hcnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmF0ZShpbnRlcnZhbDogRHVyYXRpb24pOiBTY2hlZHVsZSB7XG4gICAgY29uc3QgbWludXRlcyA9IGludGVydmFsLnRvTWludXRlcygpO1xuICAgIGlmIChtaW51dGVzID4gNjApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NoZWR1bGUgZHVyYXRpb24gbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDYwIG1pbnV0ZXMnKTtcbiAgICB9XG4gICAgaWYgKG1pbnV0ZXMgPT09IDApIHtcbiAgICAgIHJldHVybiBTY2hlZHVsZS5vbmNlKCk7XG4gICAgfVxuICAgIGlmIChtaW51dGVzID09PSAxKSB7XG4gICAgICByZXR1cm4gbmV3IFNjaGVkdWxlKCdyYXRlKDEgbWludXRlKScpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNjaGVkdWxlKGByYXRlKCR7bWludXRlc30gbWludXRlcylgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzY2hlZHVsZSBmcm9tIGEgc2V0IG9mIGNyb24gZmllbGRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNyb24ob3B0aW9uczogQ3Jvbk9wdGlvbnMpOiBTY2hlZHVsZSB7XG4gICAgaWYgKG9wdGlvbnMud2Vla0RheSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHN1cHBseSBib3RoIFxcJ2RheVxcJyBhbmQgXFwnd2Vla0RheVxcJywgdXNlIGF0IG1vc3Qgb25lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbWludXRlID0gZmFsbGJhY2sob3B0aW9ucy5taW51dGUsICcqJyk7XG4gICAgY29uc3QgaG91ciA9IGZhbGxiYWNrKG9wdGlvbnMuaG91ciwgJyonKTtcbiAgICBjb25zdCBtb250aCA9IGZhbGxiYWNrKG9wdGlvbnMubW9udGgsICcqJyk7XG5cbiAgICAvLyBXZWVrZGF5IGRlZmF1bHRzIHRvICc/JyBpZiBub3Qgc3VwcGxpZWQuIElmIGl0IGlzIHN1cHBsaWVkLCBkYXkgbXVzdCBiZWNvbWUgJz8nXG4gICAgY29uc3QgZGF5ID0gZmFsbGJhY2sob3B0aW9ucy5kYXksIG9wdGlvbnMud2Vla0RheSAhPT0gdW5kZWZpbmVkID8gJz8nIDogJyonKTtcbiAgICBjb25zdCB3ZWVrRGF5ID0gZmFsbGJhY2sob3B0aW9ucy53ZWVrRGF5LCAnPycpO1xuXG4gICAgLy8gJyonIGlzIG9ubHkgYWxsb3dlZCBpbiB0aGUgeWVhciBmaWVsZFxuICAgIGNvbnN0IHllYXIgPSAnKic7XG5cbiAgICByZXR1cm4gbmV3IFNjaGVkdWxlKGBjcm9uKCR7bWludXRlfSAke2hvdXJ9ICR7ZGF5fSAke21vbnRofSAke3dlZWtEYXl9ICR7eWVhcn0pYCk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIFRoZSBTY2hlZHVsZSBleHByZXNzaW9uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGV4cHJlc3Npb25TdHJpbmc6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSBhIGNyb24gZXhwcmVzc2lvblxuICpcbiAqIEFsbCBmaWVsZHMgYXJlIHN0cmluZ3Mgc28geW91IGNhbiB1c2UgY29tcGxleCBleHByZXNzaW9ucy4gQWJzZW5jZSBvZlxuICogYSBmaWVsZCBpbXBsaWVzICcqJyBvciAnPycsIHdoaWNoZXZlciBvbmUgaXMgYXBwcm9wcmlhdGUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9DbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfY3Jvbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG1pbnV0ZSB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgbWludXRlXG4gICAqL1xuICByZWFkb25seSBtaW51dGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBob3VyIHRvIHJ1biB0aGlzIHJ1bGUgYXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFdmVyeSBob3VyXG4gICAqL1xuICByZWFkb25seSBob3VyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IG9mIHRoZSBtb250aCB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXZlcnkgZGF5IG9mIHRoZSBtb250aFxuICAgKi9cbiAgcmVhZG9ubHkgZGF5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdG8gcnVuIHRoaXMgcnVsZSBhdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV2ZXJ5IG1vbnRoXG4gICAqL1xuICByZWFkb25seSBtb250aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRheSBvZiB0aGUgd2VlayB0byBydW4gdGhpcyBydWxlIGF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQW55IGRheSBvZiB0aGUgd2Vla1xuICAgKi9cbiAgcmVhZG9ubHkgd2Vla0RheT86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZmFsbGJhY2soeDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkZWY6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB4ID8/IGRlZjtcbn1cbiJdfQ==