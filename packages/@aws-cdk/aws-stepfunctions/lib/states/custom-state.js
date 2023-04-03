"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomState = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const state_1 = require("./state");
const __1 = require("..");
/**
 * State defined by supplying Amazon States Language (ASL) in the state machine.
 *
 */
class CustomState extends state_1.State {
    constructor(scope, id, props) {
        super(scope, id, {});
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_CustomStateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CustomState);
            }
            throw error;
        }
        this.endStates = [this];
        this.stateJson = props.stateJson;
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
        return __1.Chain.sequence(this, next);
    }
    /**
     * Returns the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            ...this.renderNextEnd(),
            ...this.stateJson,
        };
    }
}
exports.CustomState = CustomState;
_a = JSII_RTTI_SYMBOL_1;
CustomState[_a] = { fqn: "@aws-cdk/aws-stepfunctions.CustomState", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG1DQUFnQztBQUNoQywwQkFBMkI7QUFlM0I7OztHQUdHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsYUFBSztJQVFwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBVFosV0FBVzs7OztRQVdwQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsSUFBZ0I7Ozs7Ozs7Ozs7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsT0FBTyxTQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuQztJQUVEOztPQUVHO0lBQ0ksV0FBVztRQUNoQixPQUFPO1lBQ0wsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLEdBQUcsSUFBSSxDQUFDLFNBQVM7U0FDbEIsQ0FBQztLQUNIOztBQS9CSCxrQ0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XG5pbXBvcnQgeyBDaGFpbiB9IGZyb20gJy4uJztcbmltcG9ydCB7IElDaGFpbmFibGUsIElOZXh0YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGN1c3RvbSBzdGF0ZSBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tU3RhdGVQcm9wcyB7XG4gIC8qKlxuICAgKiBBbWF6b24gU3RhdGVzIExhbmd1YWdlIChKU09OLWJhc2VkKSBkZWZpbml0aW9uIG9mIHRoZSBzdGF0ZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29uY2VwdHMtYW1hem9uLXN0YXRlcy1sYW5ndWFnZS5odG1sXG4gICAqL1xuICByZWFkb25seSBzdGF0ZUpzb246IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogU3RhdGUgZGVmaW5lZCBieSBzdXBwbHlpbmcgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSAoQVNMKSBpbiB0aGUgc3RhdGUgbWFjaGluZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBDdXN0b21TdGF0ZSBleHRlbmRzIFN0YXRlIGltcGxlbWVudHMgSUNoYWluYWJsZSwgSU5leHRhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW107XG5cbiAgLyoqXG4gICAqIEFtYXpvbiBTdGF0ZXMgTGFuZ3VhZ2UgKEpTT04tYmFzZWQpIGRlZmluaXRpb24gb2YgdGhlIHN0YXRlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlSnNvbjogeyBba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21TdGF0ZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7fSk7XG5cbiAgICB0aGlzLmVuZFN0YXRlcyA9IFt0aGlzXTtcbiAgICB0aGlzLnN0YXRlSnNvbiA9IHByb3BzLnN0YXRlSnNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb250aW51ZSBub3JtYWwgZXhlY3V0aW9uIHdpdGggdGhlIGdpdmVuIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgbmV4dChuZXh0OiBJQ2hhaW5hYmxlKTogQ2hhaW4ge1xuICAgIHN1cGVyLm1ha2VOZXh0KG5leHQuc3RhcnRTdGF0ZSk7XG4gICAgcmV0dXJuIENoYWluLnNlcXVlbmNlKHRoaXMsIG5leHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEFtYXpvbiBTdGF0ZXMgTGFuZ3VhZ2Ugb2JqZWN0IGZvciB0aGlzIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgdG9TdGF0ZUpzb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5yZW5kZXJOZXh0RW5kKCksXG4gICAgICAuLi50aGlzLnN0YXRlSnNvbixcbiAgICB9O1xuICB9XG59XG4iXX0=