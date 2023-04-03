"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SfnStateMachine = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const util_1 = require("./util");
/**
 * Use a StepFunctions state machine as a target for Amazon EventBridge rules.
 */
class SfnStateMachine {
    constructor(machine, props = {}) {
        this.machine = machine;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_SfnStateMachineProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SfnStateMachine);
            }
            throw error;
        }
        // no statements are passed because we are configuring permissions by using grant* helper below
        this.role = props.role ?? util_1.singletonEventRole(machine);
        machine.grantStartExecution(this.role);
    }
    /**
     * Returns a properties that are used in an Rule to trigger this State Machine
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
     */
    bind(_rule, _id) {
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.machine.stateMachineArn,
            role: this.role,
            input: this.props.input,
            targetResource: this.machine,
        };
    }
}
exports.SfnStateMachine = SfnStateMachine;
_a = JSII_RTTI_SYMBOL_1;
SfnStateMachine[_a] = { fqn: "@aws-cdk/aws-events-targets.SfnStateMachine", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlLW1hY2hpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsaUNBQXVIO0FBcUJ2SDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQUcxQixZQUE0QixPQUEwQixFQUFtQixRQUE4QixFQUFFO1FBQTdFLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQTJCOzs7Ozs7K0NBSDlGLGVBQWU7Ozs7UUFJeEIsK0ZBQStGO1FBQy9GLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSx5QkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBRUQ7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxLQUFtQixFQUFFLEdBQVk7UUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUM5Qix5Q0FBa0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU87WUFDTCxHQUFHLDJCQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZTtZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQ3ZCLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTztTQUM3QixDQUFDO0tBQ0g7O0FBMUJILDBDQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5LCBiaW5kQmFzZVRhcmdldENvbmZpZywgc2luZ2xldG9uRXZlbnRSb2xlLCBUYXJnZXRCYXNlUHJvcHMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEN1c3RvbWl6ZSB0aGUgU3RlcCBGdW5jdGlvbnMgU3RhdGUgTWFjaGluZSB0YXJnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZm5TdGF0ZU1hY2hpbmVQcm9wcyBleHRlbmRzIFRhcmdldEJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgaW5wdXQgdG8gdGhlIHN0YXRlIG1hY2hpbmUgZXhlY3V0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBlbnRpcmUgRXZlbnRCcmlkZ2UgZXZlbnRcbiAgICovXG4gIHJlYWRvbmx5IGlucHV0PzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIHRvIGJlIGFzc3VtZWQgdG8gZXhlY3V0ZSB0aGUgU3RhdGUgTWFjaGluZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IHJvbGUgd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xufVxuXG4vKipcbiAqIFVzZSBhIFN0ZXBGdW5jdGlvbnMgc3RhdGUgbWFjaGluZSBhcyBhIHRhcmdldCBmb3IgQW1hem9uIEV2ZW50QnJpZGdlIHJ1bGVzLlxuICovXG5leHBvcnQgY2xhc3MgU2ZuU3RhdGVNYWNoaW5lIGltcGxlbWVudHMgZXZlbnRzLklSdWxlVGFyZ2V0IHtcbiAgcHJpdmF0ZSByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1hY2hpbmU6IHNmbi5JU3RhdGVNYWNoaW5lLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBTZm5TdGF0ZU1hY2hpbmVQcm9wcyA9IHt9KSB7XG4gICAgLy8gbm8gc3RhdGVtZW50cyBhcmUgcGFzc2VkIGJlY2F1c2Ugd2UgYXJlIGNvbmZpZ3VyaW5nIHBlcm1pc3Npb25zIGJ5IHVzaW5nIGdyYW50KiBoZWxwZXIgYmVsb3dcbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlID8/IHNpbmdsZXRvbkV2ZW50Um9sZShtYWNoaW5lKTtcbiAgICBtYWNoaW5lLmdyYW50U3RhcnRFeGVjdXRpb24odGhpcy5yb2xlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkIGluIGFuIFJ1bGUgdG8gdHJpZ2dlciB0aGlzIFN0YXRlIE1hY2hpbmVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZXZlbnRicmlkZ2UvbGF0ZXN0L3VzZXJndWlkZS9yZXNvdXJjZS1iYXNlZC1wb2xpY2llcy1ldmVudGJyaWRnZS5odG1sI3Nucy1wZXJtaXNzaW9uc1xuICAgKi9cbiAgcHVibGljIGJpbmQoX3J1bGU6IGV2ZW50cy5JUnVsZSwgX2lkPzogc3RyaW5nKTogZXZlbnRzLlJ1bGVUYXJnZXRDb25maWcge1xuICAgIGlmICh0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZSkge1xuICAgICAgYWRkVG9EZWFkTGV0dGVyUXVldWVSZXNvdXJjZVBvbGljeShfcnVsZSwgdGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5iaW5kQmFzZVRhcmdldENvbmZpZyh0aGlzLnByb3BzKSxcbiAgICAgIGFybjogdGhpcy5tYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICAgIHJvbGU6IHRoaXMucm9sZSxcbiAgICAgIGlucHV0OiB0aGlzLnByb3BzLmlucHV0LFxuICAgICAgdGFyZ2V0UmVzb3VyY2U6IHRoaXMubWFjaGluZSxcbiAgICB9O1xuICB9XG59XG4iXX0=