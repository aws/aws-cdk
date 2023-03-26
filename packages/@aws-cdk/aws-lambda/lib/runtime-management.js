"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeManagementMode = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Specify the runtime update mode.
 */
class RuntimeManagementMode {
    constructor(mode, arn) {
        this.mode = mode;
        this.arn = arn;
        if (arn) {
            this.runtimeManagementConfig = {
                runtimeVersionArn: arn,
                updateRuntimeOn: mode,
            };
        }
        else {
            this.runtimeManagementConfig = {
                updateRuntimeOn: mode,
            };
        }
    }
    /**
     * You specify a runtime version in your function configuration.
     * The function uses this runtime version indefinitely.
     * In the rare case in which a new runtime version is incompatible with an existing function,
     * you can use this mode to roll back your function to an earlier runtime version.
     */
    static manual(arn) {
        return new RuntimeManagementMode('Manual', arn);
    }
}
exports.RuntimeManagementMode = RuntimeManagementMode;
_a = JSII_RTTI_SYMBOL_1;
RuntimeManagementMode[_a] = { fqn: "@aws-cdk/aws-lambda.RuntimeManagementMode", version: "0.0.0" };
/**
 * Automatically update to the most recent and secure runtime version using Two-phase runtime version rollout.
 * We recommend this mode for most customers so that you always benefit from runtime updates.
 */
RuntimeManagementMode.AUTO = new RuntimeManagementMode('Auto');
/**
 * When you update your function, Lambda updates the runtime of your function to the most recent and secure runtime version.
 * This approach synchronizes runtime updates with function deployments,
 * giving you control over when Lambda applies runtime updates.
 * With this mode, you can detect and mitigate rare runtime update incompatibilities early.
 * When using this mode, you must regularly update your functions to keep their runtime up to date.
 */
RuntimeManagementMode.FUNCTION_UPDATE = new RuntimeManagementMode('FunctionUpdate');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1tYW5hZ2VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVudGltZS1tYW5hZ2VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUE7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQTZCaEMsWUFBc0MsSUFBWSxFQUFrQixHQUFZO1FBQTFDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBa0IsUUFBRyxHQUFILEdBQUcsQ0FBUztRQUM5RSxJQUFJLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyx1QkFBdUIsR0FBRztnQkFDN0IsaUJBQWlCLEVBQUUsR0FBRztnQkFDdEIsZUFBZSxFQUFFLElBQUk7YUFDdEIsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsdUJBQXVCLEdBQUc7Z0JBQzdCLGVBQWUsRUFBRSxJQUFJO2FBQ3RCLENBQUM7U0FDSDtLQUNGO0lBMUJEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFXO1FBQzlCLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDakQ7O0FBdEJILHNEQXlDQzs7O0FBeENDOzs7R0FHRztBQUNvQiwwQkFBSSxHQUFHLElBQUkscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEU7Ozs7OztHQU1HO0FBQ29CLHFDQUFlLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuRnVuY3Rpb24gfSBmcm9tICcuL2xhbWJkYS5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFNwZWNpZnkgdGhlIHJ1bnRpbWUgdXBkYXRlIG1vZGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW50aW1lTWFuYWdlbWVudE1vZGUge1xuICAvKipcbiAgICogQXV0b21hdGljYWxseSB1cGRhdGUgdG8gdGhlIG1vc3QgcmVjZW50IGFuZCBzZWN1cmUgcnVudGltZSB2ZXJzaW9uIHVzaW5nIFR3by1waGFzZSBydW50aW1lIHZlcnNpb24gcm9sbG91dC5cbiAgICogV2UgcmVjb21tZW5kIHRoaXMgbW9kZSBmb3IgbW9zdCBjdXN0b21lcnMgc28gdGhhdCB5b3UgYWx3YXlzIGJlbmVmaXQgZnJvbSBydW50aW1lIHVwZGF0ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFVVE8gPSBuZXcgUnVudGltZU1hbmFnZW1lbnRNb2RlKCdBdXRvJyk7XG4gIC8qKlxuICAgKiBXaGVuIHlvdSB1cGRhdGUgeW91ciBmdW5jdGlvbiwgTGFtYmRhIHVwZGF0ZXMgdGhlIHJ1bnRpbWUgb2YgeW91ciBmdW5jdGlvbiB0byB0aGUgbW9zdCByZWNlbnQgYW5kIHNlY3VyZSBydW50aW1lIHZlcnNpb24uXG4gICAqIFRoaXMgYXBwcm9hY2ggc3luY2hyb25pemVzIHJ1bnRpbWUgdXBkYXRlcyB3aXRoIGZ1bmN0aW9uIGRlcGxveW1lbnRzLFxuICAgKiBnaXZpbmcgeW91IGNvbnRyb2wgb3ZlciB3aGVuIExhbWJkYSBhcHBsaWVzIHJ1bnRpbWUgdXBkYXRlcy5cbiAgICogV2l0aCB0aGlzIG1vZGUsIHlvdSBjYW4gZGV0ZWN0IGFuZCBtaXRpZ2F0ZSByYXJlIHJ1bnRpbWUgdXBkYXRlIGluY29tcGF0aWJpbGl0aWVzIGVhcmx5LlxuICAgKiBXaGVuIHVzaW5nIHRoaXMgbW9kZSwgeW91IG11c3QgcmVndWxhcmx5IHVwZGF0ZSB5b3VyIGZ1bmN0aW9ucyB0byBrZWVwIHRoZWlyIHJ1bnRpbWUgdXAgdG8gZGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRlVOQ1RJT05fVVBEQVRFID0gbmV3IFJ1bnRpbWVNYW5hZ2VtZW50TW9kZSgnRnVuY3Rpb25VcGRhdGUnKTtcbiAgLyoqXG4gICAqIFlvdSBzcGVjaWZ5IGEgcnVudGltZSB2ZXJzaW9uIGluIHlvdXIgZnVuY3Rpb24gY29uZmlndXJhdGlvbi5cbiAgICogVGhlIGZ1bmN0aW9uIHVzZXMgdGhpcyBydW50aW1lIHZlcnNpb24gaW5kZWZpbml0ZWx5LlxuICAgKiBJbiB0aGUgcmFyZSBjYXNlIGluIHdoaWNoIGEgbmV3IHJ1bnRpbWUgdmVyc2lvbiBpcyBpbmNvbXBhdGlibGUgd2l0aCBhbiBleGlzdGluZyBmdW5jdGlvbixcbiAgICogeW91IGNhbiB1c2UgdGhpcyBtb2RlIHRvIHJvbGwgYmFjayB5b3VyIGZ1bmN0aW9uIHRvIGFuIGVhcmxpZXIgcnVudGltZSB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYW51YWwoYXJuOiBzdHJpbmcpOiBSdW50aW1lTWFuYWdlbWVudE1vZGUge1xuICAgIHJldHVybiBuZXcgUnVudGltZU1hbmFnZW1lbnRNb2RlKCdNYW51YWwnLCBhcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxhbWJkYS1mdW5jdGlvbi1ydW50aW1lbWFuYWdlbWVudGNvbmZpZy5odG1sXG4gICAqL1xuICByZWFkb25seSBydW50aW1lTWFuYWdlbWVudENvbmZpZzogQ2ZuRnVuY3Rpb24uUnVudGltZU1hbmFnZW1lbnRDb25maWdQcm9wZXJ0eTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1vZGU6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGFybj86IHN0cmluZykge1xuICAgIGlmIChhcm4pIHtcbiAgICAgIHRoaXMucnVudGltZU1hbmFnZW1lbnRDb25maWcgPSB7XG4gICAgICAgIHJ1bnRpbWVWZXJzaW9uQXJuOiBhcm4sXG4gICAgICAgIHVwZGF0ZVJ1bnRpbWVPbjogbW9kZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVudGltZU1hbmFnZW1lbnRDb25maWcgPSB7XG4gICAgICAgIHVwZGF0ZVJ1bnRpbWVPbjogbW9kZSxcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG4iXX0=