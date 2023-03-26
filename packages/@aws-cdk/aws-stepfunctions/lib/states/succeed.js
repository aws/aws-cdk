"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Succeed = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
/**
 * Define a Succeed state in the state machine
 *
 * Reaching a Succeed state terminates the state execution in success.
 */
class Succeed extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.endStates = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_SucceedProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Succeed);
            }
            throw error;
        }
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.SUCCEED,
            Comment: this.comment,
            ...this.renderInputOutput(),
        };
    }
}
exports.Succeed = Succeed;
_a = JSII_RTTI_SYMBOL_1;
Succeed[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Succeed", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VjY2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN1Y2NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEscURBQWlEO0FBQ2pELG1DQUFnQztBQW1DaEM7Ozs7R0FJRztBQUNILE1BQWEsT0FBUSxTQUFRLGFBQUs7SUFHaEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFzQixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSFYsY0FBUyxHQUFnQixFQUFFLENBQUM7Ozs7OzsrQ0FEakMsT0FBTzs7OztLQUtqQjtJQUVEOztPQUVHO0lBQ0ksV0FBVztRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLHNCQUFTLENBQUMsT0FBTztZQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7U0FDNUIsQ0FBQztLQUNIOztBQWhCSCwwQkFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElOZXh0YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN0YXRlVHlwZSB9IGZyb20gJy4vcHJpdmF0ZS9zdGF0ZS10eXBlJztcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBTdWNjZWVkIHN0YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3VjY2VlZFByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxufVxuXG4vKipcbiAqIERlZmluZSBhIFN1Y2NlZWQgc3RhdGUgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBSZWFjaGluZyBhIFN1Y2NlZWQgc3RhdGUgdGVybWluYXRlcyB0aGUgc3RhdGUgZXhlY3V0aW9uIGluIHN1Y2Nlc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWNjZWVkIGV4dGVuZHMgU3RhdGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdWNjZWVkUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuU1VDQ0VFRCxcbiAgICAgIENvbW1lbnQ6IHRoaXMuY29tbWVudCxcbiAgICAgIC4uLnRoaXMucmVuZGVySW5wdXRPdXRwdXQoKSxcbiAgICB9O1xuICB9XG59XG4iXX0=