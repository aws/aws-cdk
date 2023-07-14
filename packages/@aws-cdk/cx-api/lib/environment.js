"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentUtils = exports.UNKNOWN_REGION = exports.UNKNOWN_ACCOUNT = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Parser for the artifact environment field.
 *
 * Account validation is relaxed to allow account aliasing in the future.
 */
const AWS_ENV_REGEX = /aws\:\/\/([a-z0-9A-Z\-\@\.\_]+)\/([a-z\-0-9]+)/;
exports.UNKNOWN_ACCOUNT = 'unknown-account';
exports.UNKNOWN_REGION = 'unknown-region';
class EnvironmentUtils {
    static parse(environment) {
        const env = AWS_ENV_REGEX.exec(environment);
        if (!env) {
            throw new Error(`Unable to parse environment specification "${environment}". ` +
                'Expected format: aws://account/region');
        }
        const [, account, region] = env;
        if (!account || !region) {
            throw new Error(`Invalid environment specification: ${environment}`);
        }
        return { account, region, name: environment };
    }
    /**
     * Build an environment object from an account and region
     */
    static make(account, region) {
        return { account, region, name: this.format(account, region) };
    }
    /**
     * Format an environment string from an account and region
     */
    static format(account, region) {
        return `aws://${account}/${region}`;
    }
}
_a = JSII_RTTI_SYMBOL_1;
EnvironmentUtils[_a] = { fqn: "@aws-cdk/cx-api.EnvironmentUtils", version: "0.0.0" };
exports.EnvironmentUtils = EnvironmentUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7O0dBSUc7QUFDSCxNQUFNLGFBQWEsR0FBRyxnREFBZ0QsQ0FBQztBQWdCMUQsUUFBQSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDcEMsUUFBQSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7QUFFL0MsTUFBYSxnQkFBZ0I7SUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFtQjtRQUNyQyxNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixNQUFNLElBQUksS0FBSyxDQUNiLDhDQUE4QyxXQUFXLEtBQUs7Z0JBQzlELHVDQUF1QyxDQUFDLENBQUM7U0FDNUM7UUFFRCxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQztLQUMvQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFlLEVBQUUsTUFBYztRQUNoRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQztLQUNoRTtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFlLEVBQUUsTUFBYztRQUNsRCxPQUFPLFNBQVMsT0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO0tBQ3JDOzs7O0FBN0JVLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGFyc2VyIGZvciB0aGUgYXJ0aWZhY3QgZW52aXJvbm1lbnQgZmllbGQuXG4gKlxuICogQWNjb3VudCB2YWxpZGF0aW9uIGlzIHJlbGF4ZWQgdG8gYWxsb3cgYWNjb3VudCBhbGlhc2luZyBpbiB0aGUgZnV0dXJlLlxuICovXG5jb25zdCBBV1NfRU5WX1JFR0VYID0gL2F3c1xcOlxcL1xcLyhbYS16MC05QS1aXFwtXFxAXFwuXFxfXSspXFwvKFthLXpcXC0wLTldKykvO1xuXG4vKipcbiAqIE1vZGVscyBhbiBBV1MgZXhlY3V0aW9uIGVudmlyb25tZW50LCBmb3IgdXNlIHdpdGhpbiB0aGUgQ0RLIHRvb2xraXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnQge1xuICAvKiogVGhlIGFyYml0cmFyeSBuYW1lIG9mIHRoaXMgZW52aXJvbm1lbnQgKHVzZXItc2V0LCBvciBhdCBsZWFzdCB1c2VyLW1lYW5pbmdmdWwpICovXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAvKiogVGhlIEFXUyBhY2NvdW50IHRoaXMgZW52aXJvbm1lbnQgZGVwbG95cyBpbnRvICovXG4gIHJlYWRvbmx5IGFjY291bnQ6IHN0cmluZztcblxuICAvKiogVGhlIEFXUyByZWdpb24gbmFtZSB3aGVyZSB0aGlzIGVudmlyb25tZW50IGRlcGxveXMgaW50byAqL1xuICByZWFkb25seSByZWdpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFVOS05PV05fQUNDT1VOVCA9ICd1bmtub3duLWFjY291bnQnO1xuZXhwb3J0IGNvbnN0IFVOS05PV05fUkVHSU9OID0gJ3Vua25vd24tcmVnaW9uJztcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50VXRpbHMge1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGVudmlyb25tZW50OiBzdHJpbmcpOiBFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgZW52ID0gQVdTX0VOVl9SRUdFWC5leGVjKGVudmlyb25tZW50KTtcbiAgICBpZiAoIWVudikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGVudmlyb25tZW50IHNwZWNpZmljYXRpb24gXCIke2Vudmlyb25tZW50fVwiLiBgICtcbiAgICAgICAgJ0V4cGVjdGVkIGZvcm1hdDogYXdzOi8vYWNjb3VudC9yZWdpb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCBbLCBhY2NvdW50LCByZWdpb25dID0gZW52O1xuICAgIGlmICghYWNjb3VudCB8fCAhcmVnaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZW52aXJvbm1lbnQgc3BlY2lmaWNhdGlvbjogJHtlbnZpcm9ubWVudH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBhY2NvdW50LCByZWdpb24sIG5hbWU6IGVudmlyb25tZW50IH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgYW4gZW52aXJvbm1lbnQgb2JqZWN0IGZyb20gYW4gYWNjb3VudCBhbmQgcmVnaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1ha2UoYWNjb3VudDogc3RyaW5nLCByZWdpb246IHN0cmluZyk6IEVudmlyb25tZW50IHtcbiAgICByZXR1cm4geyBhY2NvdW50LCByZWdpb24sIG5hbWU6IHRoaXMuZm9ybWF0KGFjY291bnQsIHJlZ2lvbikgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgYW4gZW52aXJvbm1lbnQgc3RyaW5nIGZyb20gYW4gYWNjb3VudCBhbmQgcmVnaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvcm1hdChhY2NvdW50OiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYGF3czovLyR7YWNjb3VudH0vJHtyZWdpb259YDtcbiAgfVxufVxuIl19