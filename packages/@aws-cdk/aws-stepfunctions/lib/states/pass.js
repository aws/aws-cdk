"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pass = exports.Result = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const chain_1 = require("../chain");
const fields_1 = require("../fields");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
/**
 * The result of a Pass operation
 */
class Result {
    /**
     *
     * @param value result of the Pass operation
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * The result of the operation is a string
     */
    static fromString(value) {
        return new Result(value);
    }
    /**
     * The result of the operation is a number
     */
    static fromNumber(value) {
        return new Result(value);
    }
    /**
     * The result of the operation is a boolean
     */
    static fromBoolean(value) {
        return new Result(value);
    }
    /**
     * The result of the operation is an object
     */
    static fromObject(value) {
        return new Result(value);
    }
    /**
     * The result of the operation is an array
     */
    static fromArray(value) {
        return new Result(value);
    }
}
exports.Result = Result;
_a = JSII_RTTI_SYMBOL_1;
Result[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Result", version: "0.0.0" };
/**
 * Define a Pass in the state machine
 *
 * A Pass state can be used to transform the current execution's state.
 */
class Pass extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_PassProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Pass);
            }
            throw error;
        }
        this.result = props.result;
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
            Type: state_type_1.StateType.PASS,
            Comment: this.comment,
            Result: this.result?.value,
            ResultPath: state_1.renderJsonPath(this.resultPath),
            ...this.renderInputOutput(),
            ...this.renderParameters(),
            ...this.renderNextEnd(),
        };
    }
    /**
     * Render Parameters in ASL JSON format
     */
    renderParameters() {
        return fields_1.FieldUtils.renderObject({
            Parameters: this.parameters,
        });
    }
}
exports.Pass = Pass;
_b = JSII_RTTI_SYMBOL_1;
Pass[_b] = { fqn: "@aws-cdk/aws-stepfunctions.Pass", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0NBQWlDO0FBQ2pDLHNDQUF1QztBQUV2QyxxREFBaUQ7QUFDakQsbUNBQWdEO0FBRWhEOztHQUVHO0FBQ0gsTUFBYSxNQUFNO0lBb0NqQjs7O09BR0c7SUFDSCxZQUFzQyxLQUFVO1FBQVYsVUFBSyxHQUFMLEtBQUssQ0FBSztLQUMvQztJQXhDRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBYTtRQUNwQyxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQWE7UUFDcEMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFjO1FBQ3RDLE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBMkI7UUFDbEQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFZO1FBQ2xDLE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUI7O0FBbENILHdCQTBDQzs7O0FBK0REOzs7O0dBSUc7QUFDSCxNQUFhLElBQUssU0FBUSxhQUFLO0lBSzdCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBbUIsRUFBRTtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQU5mLElBQUk7Ozs7UUFRYixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsSUFBZ0I7Ozs7Ozs7Ozs7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuQztJQUVEOztPQUVHO0lBQ0ksV0FBVztRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLHNCQUFTLENBQUMsSUFBSTtZQUNwQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSztZQUMxQixVQUFVLEVBQUUsc0JBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzNDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUN4QixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNLLGdCQUFnQjtRQUN0QixPQUFPLG1CQUFVLENBQUMsWUFBWSxDQUFDO1lBQzdCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7S0FDSjs7QUExQ0gsb0JBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDaGFpbiB9IGZyb20gJy4uL2NoYWluJztcbmltcG9ydCB7IEZpZWxkVXRpbHMgfSBmcm9tICcuLi9maWVsZHMnO1xuaW1wb3J0IHsgSUNoYWluYWJsZSwgSU5leHRhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3RhdGVUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3N0YXRlLXR5cGUnO1xuaW1wb3J0IHsgcmVuZGVySnNvblBhdGgsIFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XG5cbi8qKlxuICogVGhlIHJlc3VsdCBvZiBhIFBhc3Mgb3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uIGlzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IFJlc3VsdCB7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXN1bHQgb2YgdGhlIG9wZXJhdGlvbiBpcyBhIG51bWJlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTnVtYmVyKHZhbHVlOiBudW1iZXIpOiBSZXN1bHQge1xuICAgIHJldHVybiBuZXcgUmVzdWx0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzdWx0IG9mIHRoZSBvcGVyYXRpb24gaXMgYSBib29sZWFuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Cb29sZWFuKHZhbHVlOiBib29sZWFuKTogUmVzdWx0IHtcbiAgICByZXR1cm4gbmV3IFJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uIGlzIGFuIG9iamVjdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT2JqZWN0KHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSk6IFJlc3VsdCB7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXN1bHQgb2YgdGhlIG9wZXJhdGlvbiBpcyBhbiBhcnJheVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXJyYXkodmFsdWU6IGFueVtdKTogUmVzdWx0IHtcbiAgICByZXR1cm4gbmV3IFJlc3VsdCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHJlc3VsdCBvZiB0aGUgUGFzcyBvcGVyYXRpb25cbiAgICovXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueSkge1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBQYXNzIHN0YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFzc1Byb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSlNPTlBhdGggZXhwcmVzc2lvbiB0byBpbmRpY2F0ZSB3aGVyZSB0byBpbmplY3QgdGhlIHN0YXRlJ3Mgb3V0cHV0XG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHN0YXRlJ3NcbiAgICogaW5wdXQgdG8gYmVjb21lIGl0cyBvdXRwdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0ICRcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIGdpdmVuLCB0cmVhdCBhcyB0aGUgcmVzdWx0IG9mIHRoaXMgb3BlcmF0aW9uXG4gICAqXG4gICAqIENhbiBiZSB1c2VkIHRvIGluamVjdCBvciByZXBsYWNlIHRoZSBjdXJyZW50IGV4ZWN1dGlvbiBzdGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gaW5qZWN0ZWQgcmVzdWx0XG4gICAqL1xuICByZWFkb25seSByZXN1bHQ/OiBSZXN1bHQ7XG5cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgcGFzcyBhIGNvbGxlY3Rpb24gb2Yga2V5LXZhbHVlIHBhaXJzLCBlaXRoZXIgc3RhdGljIHZhbHVlcyBvciBKU09OUGF0aCBleHByZXNzaW9ucyB0aGF0IHNlbGVjdCBmcm9tIHRoZSBpbnB1dC5cbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2lucHV0LW91dHB1dC1pbnB1dHBhdGgtcGFyYW1zLmh0bWwjaW5wdXQtb3V0cHV0LXBhcmFtZXRlcnNcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIERlZmluZSBhIFBhc3MgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBBIFBhc3Mgc3RhdGUgY2FuIGJlIHVzZWQgdG8gdHJhbnNmb3JtIHRoZSBjdXJyZW50IGV4ZWN1dGlvbidzIHN0YXRlLlxuICovXG5leHBvcnQgY2xhc3MgUGFzcyBleHRlbmRzIFN0YXRlIGltcGxlbWVudHMgSU5leHRhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW107XG5cbiAgcHJpdmF0ZSByZWFkb25seSByZXN1bHQ/OiBSZXN1bHQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFBhc3NQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLnJlc3VsdCA9IHByb3BzLnJlc3VsdDtcbiAgICB0aGlzLmVuZFN0YXRlcyA9IFt0aGlzXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb250aW51ZSBub3JtYWwgZXhlY3V0aW9uIHdpdGggdGhlIGdpdmVuIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgbmV4dChuZXh0OiBJQ2hhaW5hYmxlKTogQ2hhaW4ge1xuICAgIHN1cGVyLm1ha2VOZXh0KG5leHQuc3RhcnRTdGF0ZSk7XG4gICAgcmV0dXJuIENoYWluLnNlcXVlbmNlKHRoaXMsIG5leHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuUEFTUyxcbiAgICAgIENvbW1lbnQ6IHRoaXMuY29tbWVudCxcbiAgICAgIFJlc3VsdDogdGhpcy5yZXN1bHQ/LnZhbHVlLFxuICAgICAgUmVzdWx0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5yZXN1bHRQYXRoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVySW5wdXRPdXRwdXQoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyUGFyYW1ldGVycygpLFxuICAgICAgLi4udGhpcy5yZW5kZXJOZXh0RW5kKCksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgUGFyYW1ldGVycyBpbiBBU0wgSlNPTiBmb3JtYXRcbiAgICovXG4gIHByaXZhdGUgcmVuZGVyUGFyYW1ldGVycygpOiBhbnkge1xuICAgIHJldHVybiBGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBQYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==