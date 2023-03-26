"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachineFragment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const chain_1 = require("./chain");
const parallel_1 = require("./states/parallel");
const state_1 = require("./states/state");
/**
 * Base class for reusable state machine fragments
 */
class StateMachineFragment extends constructs_1.Construct {
    get id() {
        return this.node.id;
    }
    /**
     * Prefix the IDs of all states in this state machine fragment
     *
     * Use this to avoid multiple copies of the state machine all having the
     * same state IDs.
     *
     * @param prefix The prefix to add. Will use construct ID by default.
     */
    prefixStates(prefix) {
        state_1.State.prefixStates(this, prefix || `${this.id}: `);
        return this;
    }
    /**
     * Wrap all states in this state machine fragment up into a single state.
     *
     * This can be used to add retry or error handling onto this state
     * machine fragment.
     *
     * Be aware that this changes the result of the inner state machine
     * to be an array with the result of the state machine in it. Adjust
     * your paths accordingly. For example, change 'outputPath' to
     * '$[0]'.
     */
    toSingleState(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_SingleStateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toSingleState);
            }
            throw error;
        }
        const stateId = options.stateId || this.id;
        this.prefixStates(options.prefixStates || `${stateId}: `);
        return new parallel_1.Parallel(this, stateId, options).branch(this);
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
        return chain_1.Chain.start(this).next(next);
    }
}
exports.StateMachineFragment = StateMachineFragment;
_a = JSII_RTTI_SYMBOL_1;
StateMachineFragment[_a] = { fqn: "@aws-cdk/aws-stepfunctions.StateMachineFragment", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS1mcmFnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlLW1hY2hpbmUtZnJhZ21lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkNBQXVDO0FBQ3ZDLG1DQUFnQztBQUNoQyxnREFBNEQ7QUFDNUQsMENBQXVDO0FBR3ZDOztHQUVHO0FBQ0gsTUFBc0Isb0JBQXFCLFNBQVEsc0JBQVM7SUFXMUQsSUFBVyxFQUFFO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztLQUNyQjtJQUVEOzs7Ozs7O09BT0c7SUFDSSxZQUFZLENBQUMsTUFBZTtRQUNqQyxhQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLGFBQWEsQ0FBQyxVQUE4QixFQUFFOzs7Ozs7Ozs7O1FBQ25ELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDO1FBRTFELE9BQU8sSUFBSSxtQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFEO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsSUFBZ0I7Ozs7Ozs7Ozs7UUFDMUIsT0FBTyxhQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQzs7QUFuREgsb0RBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDaGFpbiB9IGZyb20gJy4vY2hhaW4nO1xuaW1wb3J0IHsgUGFyYWxsZWwsIFBhcmFsbGVsUHJvcHMgfSBmcm9tICcuL3N0YXRlcy9wYXJhbGxlbCc7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vc3RhdGVzL3N0YXRlJztcbmltcG9ydCB7IElDaGFpbmFibGUsIElOZXh0YWJsZSB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHJldXNhYmxlIHN0YXRlIG1hY2hpbmUgZnJhZ21lbnRzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGF0ZU1hY2hpbmVGcmFnbWVudCBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElDaGFpbmFibGUge1xuICAvKipcbiAgICogVGhlIHN0YXJ0IHN0YXRlIG9mIHRoaXMgc3RhdGUgbWFjaGluZSBmcmFnbWVudFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHN0YXJ0U3RhdGU6IFN0YXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGVzIHRvIGNoYWluIG9udG8gaWYgdGhpcyBmcmFnbWVudCBpcyB1c2VkXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXTtcblxuICBwdWJsaWMgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGUuaWQ7XG4gIH1cblxuICAvKipcbiAgICogUHJlZml4IHRoZSBJRHMgb2YgYWxsIHN0YXRlcyBpbiB0aGlzIHN0YXRlIG1hY2hpbmUgZnJhZ21lbnRcbiAgICpcbiAgICogVXNlIHRoaXMgdG8gYXZvaWQgbXVsdGlwbGUgY29waWVzIG9mIHRoZSBzdGF0ZSBtYWNoaW5lIGFsbCBoYXZpbmcgdGhlXG4gICAqIHNhbWUgc3RhdGUgSURzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJlZml4IFRoZSBwcmVmaXggdG8gYWRkLiBXaWxsIHVzZSBjb25zdHJ1Y3QgSUQgYnkgZGVmYXVsdC5cbiAgICovXG4gIHB1YmxpYyBwcmVmaXhTdGF0ZXMocHJlZml4Pzogc3RyaW5nKTogU3RhdGVNYWNoaW5lRnJhZ21lbnQge1xuICAgIFN0YXRlLnByZWZpeFN0YXRlcyh0aGlzLCBwcmVmaXggfHwgYCR7dGhpcy5pZH06IGApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgYWxsIHN0YXRlcyBpbiB0aGlzIHN0YXRlIG1hY2hpbmUgZnJhZ21lbnQgdXAgaW50byBhIHNpbmdsZSBzdGF0ZS5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGQgcmV0cnkgb3IgZXJyb3IgaGFuZGxpbmcgb250byB0aGlzIHN0YXRlXG4gICAqIG1hY2hpbmUgZnJhZ21lbnQuXG4gICAqXG4gICAqIEJlIGF3YXJlIHRoYXQgdGhpcyBjaGFuZ2VzIHRoZSByZXN1bHQgb2YgdGhlIGlubmVyIHN0YXRlIG1hY2hpbmVcbiAgICogdG8gYmUgYW4gYXJyYXkgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBzdGF0ZSBtYWNoaW5lIGluIGl0LiBBZGp1c3RcbiAgICogeW91ciBwYXRocyBhY2NvcmRpbmdseS4gRm9yIGV4YW1wbGUsIGNoYW5nZSAnb3V0cHV0UGF0aCcgdG9cbiAgICogJyRbMF0nLlxuICAgKi9cbiAgcHVibGljIHRvU2luZ2xlU3RhdGUob3B0aW9uczogU2luZ2xlU3RhdGVPcHRpb25zID0ge30pOiBQYXJhbGxlbCB7XG4gICAgY29uc3Qgc3RhdGVJZCA9IG9wdGlvbnMuc3RhdGVJZCB8fCB0aGlzLmlkO1xuICAgIHRoaXMucHJlZml4U3RhdGVzKG9wdGlvbnMucHJlZml4U3RhdGVzIHx8IGAke3N0YXRlSWR9OiBgKTtcblxuICAgIHJldHVybiBuZXcgUGFyYWxsZWwodGhpcywgc3RhdGVJZCwgb3B0aW9ucykuYnJhbmNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnRpbnVlIG5vcm1hbCBleGVjdXRpb24gd2l0aCB0aGUgZ2l2ZW4gc3RhdGVcbiAgICovXG4gIHB1YmxpYyBuZXh0KG5leHQ6IElDaGFpbmFibGUpIHtcbiAgICByZXR1cm4gQ2hhaW4uc3RhcnQodGhpcykubmV4dChuZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIGEgc2luZ2xlIHN0YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlU3RhdGVPcHRpb25zIGV4dGVuZHMgUGFyYWxsZWxQcm9wcyB7XG4gIC8qKlxuICAgKiBJRCBvZiBuZXdseSBjcmVhdGVkIGNvbnRhaW5pbmcgc3RhdGVcbiAgICpcbiAgICogQGRlZmF1bHQgQ29uc3RydWN0IElEIG9mIHRoZSBTdGF0ZU1hY2hpbmVGcmFnbWVudFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVJZD86IHN0cmluZztcblxuICAvKipcbiAgICogU3RyaW5nIHRvIHByZWZpeCBhbGwgc3RhdGVJZHMgaW4gdGhlIHN0YXRlIG1hY2hpbmUgd2l0aFxuICAgKlxuICAgKiBAZGVmYXVsdCBzdGF0ZUlkXG4gICAqL1xuICByZWFkb25seSBwcmVmaXhTdGF0ZXM/OiBzdHJpbmc7XG59XG4iXX0=