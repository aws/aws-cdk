"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolState = exports.WarmPool = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const autoscaling_generated_1 = require("./autoscaling.generated");
/**
 * Define a warm pool
 */
class WarmPool extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: core_1.Lazy.string({ produce: () => core_1.Names.uniqueId(this) }),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_WarmPoolProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, WarmPool);
            }
            throw error;
        }
        if (props.maxGroupPreparedCapacity && props.maxGroupPreparedCapacity < -1) {
            throw new Error('\'maxGroupPreparedCapacity\' parameter should be greater than or equal to -1');
        }
        if (props.minSize && props.minSize < 0) {
            throw new Error('\'minSize\' parameter should be greater than or equal to 0');
        }
        new autoscaling_generated_1.CfnWarmPool(this, 'Resource', {
            autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
            instanceReusePolicy: props.reuseOnScaleIn !== undefined ? {
                reuseOnScaleIn: props.reuseOnScaleIn,
            } : undefined,
            maxGroupPreparedCapacity: props.maxGroupPreparedCapacity,
            minSize: props.minSize,
            poolState: props.poolState,
        });
    }
}
exports.WarmPool = WarmPool;
_a = JSII_RTTI_SYMBOL_1;
WarmPool[_a] = { fqn: "@aws-cdk/aws-autoscaling.WarmPool", version: "0.0.0" };
/**
 * The instance state in the warm pool
 */
var PoolState;
(function (PoolState) {
    /**
     * Hibernated
     *
     * To use this state, prerequisites must be in place.
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html
     */
    PoolState["HIBERNATED"] = "Hibernated";
    /**
     * Running
     */
    PoolState["RUNNING"] = "Running";
    /**
     * Stopped
     */
    PoolState["STOPPED"] = "Stopped";
})(PoolState = exports.PoolState || (exports.PoolState = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FybS1wb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2FybS1wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzRDtBQUd0RCxtRUFBc0Q7QUFrRHREOztHQUVHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsZUFBUTtJQUNwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ25FLENBQUMsQ0FBQzs7Ozs7OytDQUpNLFFBQVE7Ozs7UUFNakIsSUFBSSxLQUFLLENBQUMsd0JBQXdCLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3pFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztTQUNqRztRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7U0FDL0U7UUFFRCxJQUFJLG1DQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CO1lBQ2pFLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO2FBQ3JDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDYix3QkFBd0IsRUFBRSxLQUFLLENBQUMsd0JBQXdCO1lBQ3hELE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7U0FDM0IsQ0FBQyxDQUFDO0tBQ0o7O0FBdkJILDRCQXdCQzs7O0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFNBa0JYO0FBbEJELFdBQVksU0FBUztJQUNuQjs7Ozs7T0FLRztJQUNILHNDQUF5QixDQUFBO0lBRXpCOztPQUVHO0lBQ0gsZ0NBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCxnQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBbEJXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBa0JwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhenksIE5hbWVzLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQXV0b1NjYWxpbmdHcm91cCB9IGZyb20gJy4vYXV0by1zY2FsaW5nLWdyb3VwJztcbmltcG9ydCB7IENmbldhcm1Qb29sIH0gZnJvbSAnLi9hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgd2FybSBwb29sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2FybVBvb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGluc3RhbmNlcyBpbiB0aGUgQXV0byBTY2FsaW5nIGdyb3VwIGNhbiBiZSByZXR1cm5lZCB0byB0aGUgd2FybSBwb29sIG9uIHNjYWxlIGluLlxuICAgKlxuICAgKiBJZiB0aGUgdmFsdWUgaXMgbm90IHNwZWNpZmllZCwgaW5zdGFuY2VzIGluIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgd2lsbCBiZSB0ZXJtaW5hdGVkXG4gICAqIHdoZW4gdGhlIGdyb3VwIHNjYWxlcyBpbi5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJldXNlT25TY2FsZUluPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IGFyZSBhbGxvd2VkIHRvIGJlIGluIHRoZSB3YXJtIHBvb2xcbiAgICogb3IgaW4gYW55IHN0YXRlIGV4Y2VwdCBUZXJtaW5hdGVkIGZvciB0aGUgQXV0byBTY2FsaW5nIGdyb3VwLlxuICAgKlxuICAgKiBJZiB0aGUgdmFsdWUgaXMgbm90IHNwZWNpZmllZCwgQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgbGF1bmNoZXMgYW5kIG1haW50YWluc1xuICAgKiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBncm91cCdzIG1heGltdW0gY2FwYWNpdHkgYW5kIGl0cyBkZXNpcmVkIGNhcGFjaXR5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG1heCBzaXplIG9mIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXBcbiAgICovXG4gIHJlYWRvbmx5IG1heEdyb3VwUHJlcGFyZWRDYXBhY2l0eT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBpbnN0YW5jZXMgdG8gbWFpbnRhaW4gaW4gdGhlIHdhcm0gcG9vbC5cbiAgICpcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgcmVhZG9ubHkgbWluU2l6ZT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBzdGF0ZSB0byB0cmFuc2l0aW9uIHRvIGFmdGVyIHRoZSBsaWZlY3ljbGUgYWN0aW9ucyBhcmUgY29tcGxldGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBvb2xTdGF0ZS5TVE9QUEVEXG4gICAqL1xuICByZWFkb25seSBwb29sU3RhdGU/OiBQb29sU3RhdGU7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSB3YXJtIHBvb2xcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXYXJtUG9vbFByb3BzIGV4dGVuZHMgV2FybVBvb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgdG8gYWRkIHRoZSB3YXJtIHBvb2wgdG8uXG4gICAqL1xuICByZWFkb25seSBhdXRvU2NhbGluZ0dyb3VwOiBJQXV0b1NjYWxpbmdHcm91cDtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSB3YXJtIHBvb2xcbiAqL1xuZXhwb3J0IGNsYXNzIFdhcm1Qb29sIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogV2FybVBvb2xQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IE5hbWVzLnVuaXF1ZUlkKHRoaXMpIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLm1heEdyb3VwUHJlcGFyZWRDYXBhY2l0eSAmJiBwcm9wcy5tYXhHcm91cFByZXBhcmVkQ2FwYWNpdHkgPCAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcXCdtYXhHcm91cFByZXBhcmVkQ2FwYWNpdHlcXCcgcGFyYW1ldGVyIHNob3VsZCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gLTEnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMubWluU2l6ZSAmJiBwcm9wcy5taW5TaXplIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcXCdtaW5TaXplXFwnIHBhcmFtZXRlciBzaG91bGQgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAnKTtcbiAgICB9XG5cbiAgICBuZXcgQ2ZuV2FybVBvb2wodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cE5hbWU6IHByb3BzLmF1dG9TY2FsaW5nR3JvdXAuYXV0b1NjYWxpbmdHcm91cE5hbWUsXG4gICAgICBpbnN0YW5jZVJldXNlUG9saWN5OiBwcm9wcy5yZXVzZU9uU2NhbGVJbiAhPT0gdW5kZWZpbmVkID8ge1xuICAgICAgICByZXVzZU9uU2NhbGVJbjogcHJvcHMucmV1c2VPblNjYWxlSW4sXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgbWF4R3JvdXBQcmVwYXJlZENhcGFjaXR5OiBwcm9wcy5tYXhHcm91cFByZXBhcmVkQ2FwYWNpdHksXG4gICAgICBtaW5TaXplOiBwcm9wcy5taW5TaXplLFxuICAgICAgcG9vbFN0YXRlOiBwcm9wcy5wb29sU3RhdGUsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW5zdGFuY2Ugc3RhdGUgaW4gdGhlIHdhcm0gcG9vbFxuICovXG5leHBvcnQgZW51bSBQb29sU3RhdGUge1xuICAvKipcbiAgICogSGliZXJuYXRlZFxuICAgKlxuICAgKiBUbyB1c2UgdGhpcyBzdGF0ZSwgcHJlcmVxdWlzaXRlcyBtdXN0IGJlIGluIHBsYWNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9oaWJlcm5hdGluZy1wcmVyZXF1aXNpdGVzLmh0bWxcbiAgICovXG4gIEhJQkVSTkFURUQgPSAnSGliZXJuYXRlZCcsXG5cbiAgLyoqXG4gICAqIFJ1bm5pbmdcbiAgICovXG4gIFJVTk5JTkcgPSAnUnVubmluZycsXG5cbiAgLyoqXG4gICAqIFN0b3BwZWRcbiAgICovXG4gIFNUT1BQRUQgPSAnU3RvcHBlZCcsXG59XG4iXX0=