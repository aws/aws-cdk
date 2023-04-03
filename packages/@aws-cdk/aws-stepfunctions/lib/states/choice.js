"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Choice = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
const chain_1 = require("../chain");
/**
 * Define a Choice in the state machine
 *
 * A choice state can be used to make decisions based on the execution
 * state.
 */
class Choice extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.endStates = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_ChoiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Choice);
            }
            throw error;
        }
    }
    /**
     * If the given condition matches, continue execution with the given state
     */
    when(condition, next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_Condition(condition);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.when);
            }
            throw error;
        }
        super.addChoice(condition, next.startState);
        return this;
    }
    /**
     * If none of the given conditions match, continue execution with the given state
     *
     * If no conditions match and no otherwise() has been given, an execution
     * error will be raised.
     */
    otherwise(def) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(def);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.otherwise);
            }
            throw error;
        }
        super.makeDefault(def.startState);
        return this;
    }
    /**
     * Return a Chain that contains all reachable end states from this Choice
     *
     * Use this to combine all possible choice paths back.
     */
    afterwards(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_AfterwardsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.afterwards);
            }
            throw error;
        }
        const endStates = state_1.State.filterNextables(state_1.State.findReachableEndStates(this, { includeErrorHandlers: options.includeErrorHandlers }));
        if (options.includeOtherwise && this.defaultChoice) {
            throw new Error(`'includeOtherwise' set but Choice state ${this.stateId} already has an 'otherwise' transition`);
        }
        if (options.includeOtherwise) {
            endStates.push(new DefaultAsNext(this));
        }
        return chain_1.Chain.custom(this, endStates, this);
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.CHOICE,
            Comment: this.comment,
            ...this.renderInputOutput(),
            ...this.renderChoices(),
        };
    }
}
exports.Choice = Choice;
_a = JSII_RTTI_SYMBOL_1;
Choice[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Choice", version: "0.0.0" };
/**
 * Adapter to make the .otherwise() transition settable through .next()
 */
class DefaultAsNext {
    constructor(choice) {
        this.choice = choice;
    }
    next(state) {
        this.choice.otherwise(state);
        return chain_1.Chain.sequence(this.choice, state);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvaWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hvaWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHFEQUFpRDtBQUNqRCxtQ0FBZ0M7QUFDaEMsb0NBQWlDO0FBb0NqQzs7Ozs7R0FLRztBQUNILE1BQWEsTUFBTyxTQUFRLGFBQUs7SUFHL0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFxQixFQUFFO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSFYsY0FBUyxHQUFnQixFQUFFLENBQUM7Ozs7OzsrQ0FEakMsTUFBTTs7OztLQUtoQjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLFNBQW9CLEVBQUUsSUFBZ0I7Ozs7Ozs7Ozs7O1FBQ2hELEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7O09BS0c7SUFDSSxTQUFTLENBQUMsR0FBZTs7Ozs7Ozs7OztRQUM5QixLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7T0FJRztJQUNJLFVBQVUsQ0FBQyxVQUE2QixFQUFFOzs7Ozs7Ozs7O1FBQy9DLE1BQU0sU0FBUyxHQUFHLGFBQUssQ0FBQyxlQUFlLENBQUMsYUFBSyxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwSSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLElBQUksQ0FBQyxPQUFPLHdDQUF3QyxDQUFDLENBQUM7U0FDbEg7UUFDRCxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLGFBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QztJQUVEOztPQUVHO0lBQ0ksV0FBVztRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLHNCQUFTLENBQUMsTUFBTTtZQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1NBQ3hCLENBQUM7S0FDSDs7QUFwREgsd0JBcURDOzs7QUEyQkQ7O0dBRUc7QUFDSCxNQUFNLGFBQWE7SUFDakIsWUFBNkIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7S0FDMUM7SUFFTSxJQUFJLENBQUMsS0FBaUI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDM0M7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU3RhdGVUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3N0YXRlLXR5cGUnO1xuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnLi4vY2hhaW4nO1xuaW1wb3J0IHsgQ29uZGl0aW9uIH0gZnJvbSAnLi4vY29uZGl0aW9uJztcbmltcG9ydCB7IElDaGFpbmFibGUsIElOZXh0YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIENob2ljZSBzdGF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENob2ljZVByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIERJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBDaG9pY2UgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBBIGNob2ljZSBzdGF0ZSBjYW4gYmUgdXNlZCB0byBtYWtlIGRlY2lzaW9ucyBiYXNlZCBvbiB0aGUgZXhlY3V0aW9uXG4gKiBzdGF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENob2ljZSBleHRlbmRzIFN0YXRlIHtcbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2hvaWNlUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBnaXZlbiBjb25kaXRpb24gbWF0Y2hlcywgY29udGludWUgZXhlY3V0aW9uIHdpdGggdGhlIGdpdmVuIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgd2hlbihjb25kaXRpb246IENvbmRpdGlvbiwgbmV4dDogSUNoYWluYWJsZSk6IENob2ljZSB7XG4gICAgc3VwZXIuYWRkQ2hvaWNlKGNvbmRpdGlvbiwgbmV4dC5zdGFydFN0YXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBub25lIG9mIHRoZSBnaXZlbiBjb25kaXRpb25zIG1hdGNoLCBjb250aW51ZSBleGVjdXRpb24gd2l0aCB0aGUgZ2l2ZW4gc3RhdGVcbiAgICpcbiAgICogSWYgbm8gY29uZGl0aW9ucyBtYXRjaCBhbmQgbm8gb3RoZXJ3aXNlKCkgaGFzIGJlZW4gZ2l2ZW4sIGFuIGV4ZWN1dGlvblxuICAgKiBlcnJvciB3aWxsIGJlIHJhaXNlZC5cbiAgICovXG4gIHB1YmxpYyBvdGhlcndpc2UoZGVmOiBJQ2hhaW5hYmxlKTogQ2hvaWNlIHtcbiAgICBzdXBlci5tYWtlRGVmYXVsdChkZWYuc3RhcnRTdGF0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgQ2hhaW4gdGhhdCBjb250YWlucyBhbGwgcmVhY2hhYmxlIGVuZCBzdGF0ZXMgZnJvbSB0aGlzIENob2ljZVxuICAgKlxuICAgKiBVc2UgdGhpcyB0byBjb21iaW5lIGFsbCBwb3NzaWJsZSBjaG9pY2UgcGF0aHMgYmFjay5cbiAgICovXG4gIHB1YmxpYyBhZnRlcndhcmRzKG9wdGlvbnM6IEFmdGVyd2FyZHNPcHRpb25zID0ge30pOiBDaGFpbiB7XG4gICAgY29uc3QgZW5kU3RhdGVzID0gU3RhdGUuZmlsdGVyTmV4dGFibGVzKFN0YXRlLmZpbmRSZWFjaGFibGVFbmRTdGF0ZXModGhpcywgeyBpbmNsdWRlRXJyb3JIYW5kbGVyczogb3B0aW9ucy5pbmNsdWRlRXJyb3JIYW5kbGVycyB9KSk7XG4gICAgaWYgKG9wdGlvbnMuaW5jbHVkZU90aGVyd2lzZSAmJiB0aGlzLmRlZmF1bHRDaG9pY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJ2luY2x1ZGVPdGhlcndpc2UnIHNldCBidXQgQ2hvaWNlIHN0YXRlICR7dGhpcy5zdGF0ZUlkfSBhbHJlYWR5IGhhcyBhbiAnb3RoZXJ3aXNlJyB0cmFuc2l0aW9uYCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmluY2x1ZGVPdGhlcndpc2UpIHtcbiAgICAgIGVuZFN0YXRlcy5wdXNoKG5ldyBEZWZhdWx0QXNOZXh0KHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIENoYWluLmN1c3RvbSh0aGlzLCBlbmRTdGF0ZXMsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuQ0hPSUNFLFxuICAgICAgQ29tbWVudDogdGhpcy5jb21tZW50LFxuICAgICAgLi4udGhpcy5yZW5kZXJJbnB1dE91dHB1dCgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJDaG9pY2VzKCksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHNlbGVjdGluZyB0aGUgY2hvaWNlIHBhdGhzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWZ0ZXJ3YXJkc09wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0byBpbmNsdWRlIGVycm9yIGhhbmRsaW5nIHN0YXRlc1xuICAgKlxuICAgKiBJZiB0aGlzIGlzIHRydWUsIGFsbCBzdGF0ZXMgd2hpY2ggYXJlIGVycm9yIGhhbmRsZXJzIChhZGRlZCB0aHJvdWdoICdvbkVycm9yJylcbiAgICogYW5kIHN0YXRlcyByZWFjaGFibGUgdmlhIGVycm9yIGhhbmRsZXJzIHdpbGwgYmUgaW5jbHVkZWQgYXMgd2VsbC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVFcnJvckhhbmRsZXJzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBpbmNsdWRlIHRoZSBkZWZhdWx0L290aGVyd2lzZSB0cmFuc2l0aW9uIGZvciB0aGUgY3VycmVudCBDaG9pY2Ugc3RhdGVcbiAgICpcbiAgICogSWYgdGhpcyBpcyB0cnVlIGFuZCB0aGUgY3VycmVudCBDaG9pY2UgZG9lcyBub3QgaGF2ZSBhIGRlZmF1bHQgb3V0Z29pbmdcbiAgICogdHJhbnNpdGlvbiwgb25lIHdpbGwgYmUgYWRkZWQgaW5jbHVkZWQgd2hlbiAubmV4dCgpIGlzIGNhbGxlZCBvbiB0aGUgY2hhaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlT3RoZXJ3aXNlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBZGFwdGVyIHRvIG1ha2UgdGhlIC5vdGhlcndpc2UoKSB0cmFuc2l0aW9uIHNldHRhYmxlIHRocm91Z2ggLm5leHQoKVxuICovXG5jbGFzcyBEZWZhdWx0QXNOZXh0IGltcGxlbWVudHMgSU5leHRhYmxlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjaG9pY2U6IENob2ljZSkge1xuICB9XG5cbiAgcHVibGljIG5leHQoc3RhdGU6IElDaGFpbmFibGUpOiBDaGFpbiB7XG4gICAgdGhpcy5jaG9pY2Uub3RoZXJ3aXNlKHN0YXRlKTtcbiAgICByZXR1cm4gQ2hhaW4uc2VxdWVuY2UodGhpcy5jaG9pY2UsIHN0YXRlKTtcbiAgfVxufVxuIl19