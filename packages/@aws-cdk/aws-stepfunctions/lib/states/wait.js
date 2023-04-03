"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wait = exports.WaitTime = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
const chain_1 = require("../chain");
/**
 * Represents the Wait state which delays a state machine from continuing for a specified time
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-wait-state.html
 */
class WaitTime {
    constructor(json) {
        this.json = json;
    }
    /**
     * Wait a fixed amount of time.
     */
    static duration(duration) { return new WaitTime({ Seconds: duration.toSeconds() }); }
    /**
     * Wait until the given ISO8601 timestamp
     *
     * Example value: `2016-03-14T01:59:00Z`
     */
    static timestamp(timestamp) { return new WaitTime({ Timestamp: timestamp }); }
    /**
     * Wait for a number of seconds stored in the state object.
     *
     * Example value: `$.waitSeconds`
     */
    static secondsPath(path) { return new WaitTime({ SecondsPath: path }); }
    /**
     * Wait until a timestamp found in the state object.
     *
     * Example value: `$.waitTimestamp`
     */
    static timestampPath(path) { return new WaitTime({ TimestampPath: path }); }
    /**
     * @internal
     */
    get _json() {
        return this.json;
    }
}
exports.WaitTime = WaitTime;
_a = JSII_RTTI_SYMBOL_1;
WaitTime[_a] = { fqn: "@aws-cdk/aws-stepfunctions.WaitTime", version: "0.0.0" };
/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
class Wait extends state_1.State {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_WaitProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Wait);
            }
            throw error;
        }
        this.time = props.time;
        this.endStates = [this];
    }
    /**
     * Continue normal execution with the given state
     */
    next(next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.next);
            }
            throw error;
        }
        super.makeNext(next.startState);
        return chain_1.Chain.sequence(this, next);
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.WAIT,
            Comment: this.comment,
            ...this.time._json,
            ...this.renderNextEnd(),
        };
    }
}
exports.Wait = Wait;
_b = JSII_RTTI_SYMBOL_1;
Wait[_b] = { fqn: "@aws-cdk/aws-stepfunctions.Wait", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEscURBQWlEO0FBQ2pELG1DQUFnQztBQUNoQyxvQ0FBaUM7QUFHakM7OztHQUdHO0FBQ0gsTUFBYSxRQUFRO0lBMkJuQixZQUFxQyxJQUFTO1FBQVQsU0FBSSxHQUFKLElBQUksQ0FBSztLQUFLO0lBMUJuRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBc0IsSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUUxRzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFpQixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBRTdGOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQVksSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRTtJQUV2Rjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFJM0Y7O09BRUc7SUFDSCxJQUFXLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDbEI7O0FBbENILDRCQW1DQzs7O0FBbUJEOzs7O0dBSUc7QUFDSCxNQUFhLElBQUssU0FBUSxhQUFLO0lBSzdCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBZ0I7UUFDeEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0FOZixJQUFJOzs7O1FBUWIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLElBQWdCOzs7Ozs7Ozs7O1FBQzFCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkM7SUFFRDs7T0FFRztJQUNJLFdBQVc7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxzQkFBUyxDQUFDLElBQUk7WUFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUN4QixDQUFDO0tBQ0g7O0FBOUJILG9CQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU3RhdGVUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3N0YXRlLXR5cGUnO1xuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnLi4vY2hhaW4nO1xuaW1wb3J0IHsgSUNoYWluYWJsZSwgSU5leHRhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIFdhaXQgc3RhdGUgd2hpY2ggZGVsYXlzIGEgc3RhdGUgbWFjaGluZSBmcm9tIGNvbnRpbnVpbmcgZm9yIGEgc3BlY2lmaWVkIHRpbWVcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLXdhaXQtc3RhdGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgV2FpdFRpbWUge1xuICAvKipcbiAgICogV2FpdCBhIGZpeGVkIGFtb3VudCBvZiB0aW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkdXJhdGlvbihkdXJhdGlvbjogY2RrLkR1cmF0aW9uKSB7IHJldHVybiBuZXcgV2FpdFRpbWUoeyBTZWNvbmRzOiBkdXJhdGlvbi50b1NlY29uZHMoKSB9KTsgfVxuXG4gIC8qKlxuICAgKiBXYWl0IHVudGlsIHRoZSBnaXZlbiBJU084NjAxIHRpbWVzdGFtcFxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgMjAxNi0wMy0xNFQwMTo1OTowMFpgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcCh0aW1lc3RhbXA6IHN0cmluZykgeyByZXR1cm4gbmV3IFdhaXRUaW1lKHsgVGltZXN0YW1wOiB0aW1lc3RhbXAgfSk7IH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgYSBudW1iZXIgb2Ygc2Vjb25kcyBzdG9yZWQgaW4gdGhlIHN0YXRlIG9iamVjdC5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYCQud2FpdFNlY29uZHNgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlY29uZHNQYXRoKHBhdGg6IHN0cmluZykgeyByZXR1cm4gbmV3IFdhaXRUaW1lKHsgU2Vjb25kc1BhdGg6IHBhdGggfSk7IH1cblxuICAvKipcbiAgICogV2FpdCB1bnRpbCBhIHRpbWVzdGFtcCBmb3VuZCBpbiB0aGUgc3RhdGUgb2JqZWN0LlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgJC53YWl0VGltZXN0YW1wYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0aW1lc3RhbXBQYXRoKHBhdGg6IHN0cmluZykgeyByZXR1cm4gbmV3IFdhaXRUaW1lKHsgVGltZXN0YW1wUGF0aDogcGF0aCB9KTsgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBqc29uOiBhbnkpIHsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBnZXQgX2pzb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbjtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgV2FpdCBzdGF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFdhaXRQcm9wcyB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBkZXNjcmlwdGlvbiBmb3IgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBjb21tZW50XG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXYWl0IGR1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdGltZTogV2FpdFRpbWU7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgV2FpdCBzdGF0ZSBpbiB0aGUgc3RhdGUgbWFjaGluZVxuICpcbiAqIEEgV2FpdCBzdGF0ZSBjYW4gYmUgdXNlZCB0byBkZWxheSBleGVjdXRpb24gb2YgdGhlIHN0YXRlIG1hY2hpbmUgZm9yIGEgd2hpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBXYWl0IGV4dGVuZHMgU3RhdGUgaW1wbGVtZW50cyBJTmV4dGFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHRpbWU6IFdhaXRUaW1lO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBXYWl0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMudGltZSA9IHByb3BzLnRpbWU7XG4gICAgdGhpcy5lbmRTdGF0ZXMgPSBbdGhpc107XG4gIH1cblxuICAvKipcbiAgICogQ29udGludWUgbm9ybWFsIGV4ZWN1dGlvbiB3aXRoIHRoZSBnaXZlbiBzdGF0ZVxuICAgKi9cbiAgcHVibGljIG5leHQobmV4dDogSUNoYWluYWJsZSk6IENoYWluIHtcbiAgICBzdXBlci5tYWtlTmV4dChuZXh0LnN0YXJ0U3RhdGUpO1xuICAgIHJldHVybiBDaGFpbi5zZXF1ZW5jZSh0aGlzLCBuZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIEFtYXpvbiBTdGF0ZXMgTGFuZ3VhZ2Ugb2JqZWN0IGZvciB0aGlzIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgdG9TdGF0ZUpzb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgVHlwZTogU3RhdGVUeXBlLldBSVQsXG4gICAgICBDb21tZW50OiB0aGlzLmNvbW1lbnQsXG4gICAgICAuLi50aGlzLnRpbWUuX2pzb24sXG4gICAgICAuLi50aGlzLnJlbmRlck5leHRFbmQoKSxcbiAgICB9O1xuICB9XG59XG4iXX0=