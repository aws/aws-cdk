"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fail = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
/**
 * Define a Fail state in the state machine
 *
 * Reaching a Fail state terminates the state execution in failure.
 */
class Fail extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.endStates = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_FailProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Fail);
            }
            throw error;
        }
        this.error = props.error;
        this.cause = props.cause;
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.FAIL,
            Comment: this.comment,
            Error: this.error,
            Cause: this.cause,
        };
    }
}
exports.Fail = Fail;
_a = JSII_RTTI_SYMBOL_1;
Fail[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Fail", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EscURBQWlEO0FBQ2pELG1DQUFnQztBQTZCaEM7Ozs7R0FJRztBQUNILE1BQWEsSUFBSyxTQUFRLGFBQUs7SUFNN0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFtQixFQUFFO1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBTlYsY0FBUyxHQUFnQixFQUFFLENBQUM7Ozs7OzsrQ0FEakMsSUFBSTs7OztRQVNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDMUI7SUFFRDs7T0FFRztJQUNJLFdBQVc7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxzQkFBUyxDQUFDLElBQUk7WUFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbEIsQ0FBQztLQUNIOztBQXZCSCxvQkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YXRlVHlwZSB9IGZyb20gJy4vcHJpdmF0ZS9zdGF0ZS10eXBlJztcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XG5pbXBvcnQgeyBJTmV4dGFibGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBGYWlsIHN0YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmFpbFByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEVycm9yIGNvZGUgdXNlZCB0byByZXByZXNlbnQgdGhpcyBmYWlsdXJlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGVycm9yIGNvZGVcbiAgICovXG4gIHJlYWRvbmx5IGVycm9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIGZvciB0aGUgY2F1c2Ugb2YgdGhlIGZhaWx1cmVcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGNhdXNlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmluZSBhIEZhaWwgc3RhdGUgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBSZWFjaGluZyBhIEZhaWwgc3RhdGUgdGVybWluYXRlcyB0aGUgc3RhdGUgZXhlY3V0aW9uIGluIGZhaWx1cmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBGYWlsIGV4dGVuZHMgU3RhdGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZXJyb3I/OiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2F1c2U/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZhaWxQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmVycm9yID0gcHJvcHMuZXJyb3I7XG4gICAgdGhpcy5jYXVzZSA9IHByb3BzLmNhdXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuRkFJTCxcbiAgICAgIENvbW1lbnQ6IHRoaXMuY29tbWVudCxcbiAgICAgIEVycm9yOiB0aGlzLmVycm9yLFxuICAgICAgQ2F1c2U6IHRoaXMuY2F1c2UsXG4gICAgfTtcbiAgfVxufVxuIl19