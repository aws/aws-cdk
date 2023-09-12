"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseJobDefinitionProperties = exports.JobDefinitionBase = exports.Reason = exports.Action = exports.RetryStrategy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
/**
 * Define how Jobs using this JobDefinition respond to different exit conditions
 */
class RetryStrategy {
    /**
     * Create a new RetryStrategy
     */
    static of(action, on) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Action(action);
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Reason(on);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.of);
            }
            throw error;
        }
        return new RetryStrategy(action, on);
    }
    constructor(action, on) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Action(action);
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Reason(on);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RetryStrategy);
            }
            throw error;
        }
        this.action = action;
        this.on = on;
    }
}
exports.RetryStrategy = RetryStrategy;
_a = JSII_RTTI_SYMBOL_1;
RetryStrategy[_a] = { fqn: "@aws-cdk/aws-batch-alpha.RetryStrategy", version: "0.0.0" };
/**
 * The Action to take when all specified conditions in a RetryStrategy are met
 */
var Action;
(function (Action) {
    /**
     * The job will not retry
     */
    Action["EXIT"] = "EXIT";
    /**
     * The job will retry. It can be retried up to the number of times specified in `retryAttempts`.
     */
    Action["RETRY"] = "RETRY";
})(Action || (exports.Action = Action = {}));
/**
 * Common job exit reasons
 */
class Reason {
    /**
     * A custom Reason that can match on multiple conditions.
     * Note that all specified conditions must be met for this reason to match.
     */
    static custom(customReasonProps) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_CustomReason(customReasonProps);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.custom);
            }
            throw error;
        }
        return customReasonProps;
    }
}
exports.Reason = Reason;
_b = JSII_RTTI_SYMBOL_1;
Reason[_b] = { fqn: "@aws-cdk/aws-batch-alpha.Reason", version: "0.0.0" };
/**
 * Will match any non-zero exit code
 */
Reason.NON_ZERO_EXIT_CODE = {
    onExitCode: '*',
};
/**
 * Will only match if the Docker container could not be pulled
 */
Reason.CANNOT_PULL_CONTAINER = {
    onReason: 'CannotPullContainerError:*',
};
/**
 * Will only match if the Spot instance executing the job was reclaimed
 */
Reason.SPOT_INSTANCE_RECLAIMED = {
    onStatusReason: 'Host EC2*',
};
/**
 * Abstract base class for JobDefinitions
 *
 * @internal
 */
class JobDefinitionBase extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props?.jobDefinitionName,
        });
        this.parameters = props?.parameters;
        this.retryAttempts = props?.retryAttempts;
        this.retryStrategies = props?.retryStrategies ?? [];
        this.schedulingPriority = props?.schedulingPriority;
        this.timeout = props?.timeout;
    }
    addRetryStrategy(strategy) {
        this.retryStrategies.push(strategy);
    }
}
exports.JobDefinitionBase = JobDefinitionBase;
/**
 * @internal
 */
function baseJobDefinitionProperties(baseJobDefinition) {
    return {
        parameters: baseJobDefinition.parameters,
        retryStrategy: {
            attempts: baseJobDefinition.retryAttempts,
            evaluateOnExit: core_1.Lazy.any({
                produce: () => {
                    if (baseJobDefinition.retryStrategies.length === 0) {
                        return undefined;
                    }
                    return baseJobDefinition.retryStrategies.map((strategy) => {
                        return {
                            action: strategy.action,
                            ...strategy.on,
                        };
                    });
                },
            }),
        },
        schedulingPriority: baseJobDefinition.schedulingPriority,
        timeout: {
            attemptDurationSeconds: baseJobDefinition.timeout?.toSeconds(),
        },
        type: 'dummy',
    };
}
exports.baseJobDefinitionProperties = baseJobDefinitionProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLWRlZmluaXRpb24tYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi1kZWZpbml0aW9uLWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkNBQXVFO0FBZ0l2RTs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUN4Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQVU7Ozs7Ozs7Ozs7O1FBQ3pDLE9BQU8sSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3RDO0lBWUQsWUFBWSxNQUFjLEVBQUUsRUFBVTs7Ozs7OzsrQ0FsQjNCLGFBQWE7Ozs7UUFtQnRCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0tBQ2Q7O0FBckJILHNDQXNCQzs7O0FBRUQ7O0dBRUc7QUFDSCxJQUFZLE1BU1g7QUFURCxXQUFZLE1BQU07SUFDaEI7O09BRUc7SUFDSCx1QkFBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCx5QkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFUVyxNQUFNLHNCQUFOLE1BQU0sUUFTakI7QUE4QkQ7O0dBRUc7QUFDSCxNQUFhLE1BQU07SUFzQmpCOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQStCOzs7Ozs7Ozs7O1FBQzNDLE9BQU8saUJBQWlCLENBQUM7S0FDMUI7O0FBNUJILHdCQTZCQzs7O0FBNUJDOztHQUVHO0FBQ2EseUJBQWtCLEdBQVc7SUFDM0MsVUFBVSxFQUFFLEdBQUc7Q0FDaEIsQ0FBQztBQUVGOztHQUVHO0FBQ2EsNEJBQXFCLEdBQVc7SUFDOUMsUUFBUSxFQUFFLDRCQUE0QjtDQUN2QyxDQUFBO0FBRUQ7O0dBRUc7QUFDYSw4QkFBdUIsR0FBVztJQUNoRCxjQUFjLEVBQUUsV0FBVztDQUM1QixDQUFBO0FBV0g7Ozs7R0FJRztBQUNILE1BQXNCLGlCQUFrQixTQUFRLGVBQVE7SUFVdEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLEVBQUUsaUJBQWlCO1NBQ3ZDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxFQUFFLFVBQVUsQ0FBQztRQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssRUFBRSxhQUFhLENBQUM7UUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLEVBQUUsZUFBZSxJQUFJLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxFQUFFLGtCQUFrQixDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLE9BQU8sQ0FBQztLQUMvQjtJQUVELGdCQUFnQixDQUFDLFFBQXVCO1FBQ3RDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JDO0NBQ0Y7QUF6QkQsOENBeUJDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQiwyQkFBMkIsQ0FBQyxpQkFBb0M7SUFDOUUsT0FBTztRQUNMLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVO1FBQ3hDLGFBQWEsRUFBRTtZQUNiLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxhQUFhO1lBQ3pDLGNBQWMsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDO2dCQUN2QixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLElBQUksaUJBQWlCLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ2xELE9BQU8sU0FBUyxDQUFDO3FCQUNsQjtvQkFDRCxPQUFPLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDeEQsT0FBTzs0QkFDTCxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07NEJBQ3ZCLEdBQUcsUUFBUSxDQUFDLEVBQUU7eUJBQ2YsQ0FBQztvQkFDSixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2FBQ0YsQ0FBQztTQUNIO1FBQ0Qsa0JBQWtCLEVBQUUsaUJBQWlCLENBQUMsa0JBQWtCO1FBQ3hELE9BQU8sRUFBRTtZQUNQLHNCQUFzQixFQUFFLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7U0FDL0Q7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkLENBQUM7QUFDSixDQUFDO0FBekJELGtFQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBJUmVzb3VyY2UsIExhenksIFJlc291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkpvYkRlZmluaXRpb25Qcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEpvYkRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJSm9iRGVmaW5pdGlvbiBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgam9iIGRlZmluaXRpb25cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGpvYiBkZWZpbml0aW9uXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGpvYkRlZmluaXRpb25OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoZSBjb250YWluZXJcbiAgICogVGhlc2UgcGFyYW1ldGVycyBjYW4gYmUgcmVmZXJlbmNlZCBpbiB0aGUgYGNvbW1hbmRgIHRoYXRcbiAgICogeW91IGdpdmUgdG8gdGhlIGNvbnRhaW5lclxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9iYXRjaC9sYXRlc3QvdXNlcmd1aWRlL2pvYl9kZWZpbml0aW9uX3BhcmFtZXRlcnMuaHRtbCNwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiB7IFtrZXk6c3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmV0cnkgYSBqb2IuXG4gICAqIFRoZSBqb2IgaXMgcmV0cmllZCBvbiBmYWlsdXJlIHRoZSBzYW1lIG51bWJlciBvZiBhdHRlbXB0cyBhcyB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IHJldHJ5QXR0ZW1wdHM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIHJldHJ5IGJlaGF2aW9yIGZvciB0aGlzIGpvYlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGBSZXRyeVN0cmF0ZWd5YFxuICAgKi9cbiAgcmVhZG9ubHkgcmV0cnlTdHJhdGVnaWVzOiBSZXRyeVN0cmF0ZWd5W107XG5cbiAgLyoqXG4gICAqIFRoZSBwcmlvcml0eSBvZiB0aGlzIEpvYi4gT25seSB1c2VkIGluIEZhaXJzaGFyZSBTY2hlZHVsaW5nXG4gICAqIHRvIGRlY2lkZSB3aGljaCBqb2IgdG8gcnVuIGZpcnN0IHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGpvYnNcbiAgICogd2l0aCB0aGUgc2FtZSBzaGFyZSBpZGVudGlmaWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBzY2hlZHVsaW5nUHJpb3JpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lb3V0IHRpbWUgZm9yIGpvYnMgdGhhdCBhcmUgc3VibWl0dGVkIHdpdGggdGhpcyBqb2IgZGVmaW5pdGlvbi5cbiAgICogQWZ0ZXIgdGhlIGFtb3VudCBvZiB0aW1lIHlvdSBzcGVjaWZ5IHBhc3NlcyxcbiAgICogQmF0Y2ggdGVybWluYXRlcyB5b3VyIGpvYnMgaWYgdGhleSBhcmVuJ3QgZmluaXNoZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdGltZW91dFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBSZXRyeVN0cmF0ZWd5IHRvIHRoaXMgSm9iRGVmaW5pdGlvblxuICAgKi9cbiAgYWRkUmV0cnlTdHJhdGVneShzdHJhdGVneTogUmV0cnlTdHJhdGVneSk6IHZvaWQ7XG59XG5cbi8qKlxuICogUHJvcHMgY29tbW9uIHRvIGFsbCBKb2JEZWZpbml0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEpvYkRlZmluaXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGpvYiBkZWZpbml0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIGJ5IENsb3VkRm9ybWF0aW9uXG4gICAqL1xuICByZWFkb25seSBqb2JEZWZpbml0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgcGFyYW1ldGVycyBwYXNzZWQgdG8gdGhlIGNvbnRhaW5lclxuICAgKiBUaGVzZSBwYXJhbWV0ZXJzIGNhbiBiZSByZWZlcmVuY2VkIGluIHRoZSBgY29tbWFuZGAgdGhhdFxuICAgKiB5b3UgZ2l2ZSB0byB0aGUgY29udGFpbmVyXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvam9iX2RlZmluaXRpb25fcGFyYW1ldGVycy5odG1sI3BhcmFtZXRlcnNcbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IHsgW2tleTpzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0aW1lcyB0byByZXRyeSBhIGpvYi5cbiAgICogVGhlIGpvYiBpcyByZXRyaWVkIG9uIGZhaWx1cmUgdGhlIHNhbWUgbnVtYmVyIG9mIGF0dGVtcHRzIGFzIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgcmV0cnlBdHRlbXB0cz86IG51bWJlcjtcblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgcmV0cnkgYmVoYXZpb3IgZm9yIHRoaXMgam9iXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYFJldHJ5U3RyYXRlZ3lgXG4gICAqL1xuICByZWFkb25seSByZXRyeVN0cmF0ZWdpZXM/OiBSZXRyeVN0cmF0ZWd5W107XG5cbiAgLyoqXG4gICAqIFRoZSBwcmlvcml0eSBvZiB0aGlzIEpvYi4gT25seSB1c2VkIGluIEZhaXJzaGFyZSBTY2hlZHVsaW5nXG4gICAqIHRvIGRlY2lkZSB3aGljaCBqb2IgdG8gcnVuIGZpcnN0IHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGpvYnNcbiAgICogd2l0aCB0aGUgc2FtZSBzaGFyZSBpZGVudGlmaWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBzY2hlZHVsaW5nUHJpb3JpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lb3V0IHRpbWUgZm9yIGpvYnMgdGhhdCBhcmUgc3VibWl0dGVkIHdpdGggdGhpcyBqb2IgZGVmaW5pdGlvbi5cbiAgICogQWZ0ZXIgdGhlIGFtb3VudCBvZiB0aW1lIHlvdSBzcGVjaWZ5IHBhc3NlcyxcbiAgICogQmF0Y2ggdGVybWluYXRlcyB5b3VyIGpvYnMgaWYgdGhleSBhcmVuJ3QgZmluaXNoZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdGltZW91dFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIERlZmluZSBob3cgSm9icyB1c2luZyB0aGlzIEpvYkRlZmluaXRpb24gcmVzcG9uZCB0byBkaWZmZXJlbnQgZXhpdCBjb25kaXRpb25zXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXRyeVN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBSZXRyeVN0cmF0ZWd5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9mKGFjdGlvbjogQWN0aW9uLCBvbjogUmVhc29uKSB7XG4gICAgcmV0dXJuIG5ldyBSZXRyeVN0cmF0ZWd5KGFjdGlvbiwgb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhY3Rpb24gdG8gdGFrZSB3aGVuIHRoZSBqb2IgZXhpdHMgd2l0aCB0aGUgUmVhc29uIHNwZWNpZmllZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFjdGlvbjogQWN0aW9uO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgam9iIGV4aXRzIHdpdGggdGhpcyBSZWFzb24gaXQgd2lsbCB0cmlnZ2VyIHRoZSBzcGVjaWZpZWQgQWN0aW9uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgb246IFJlYXNvbjtcblxuICBjb25zdHJ1Y3RvcihhY3Rpb246IEFjdGlvbiwgb246IFJlYXNvbikge1xuICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgIHRoaXMub24gPSBvbjtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBBY3Rpb24gdG8gdGFrZSB3aGVuIGFsbCBzcGVjaWZpZWQgY29uZGl0aW9ucyBpbiBhIFJldHJ5U3RyYXRlZ3kgYXJlIG1ldFxuICovXG5leHBvcnQgZW51bSBBY3Rpb24ge1xuICAvKipcbiAgICogVGhlIGpvYiB3aWxsIG5vdCByZXRyeVxuICAgKi9cbiAgRVhJVCA9ICdFWElUJyxcbiAgLyoqXG4gICAqIFRoZSBqb2Igd2lsbCByZXRyeS4gSXQgY2FuIGJlIHJldHJpZWQgdXAgdG8gdGhlIG51bWJlciBvZiB0aW1lcyBzcGVjaWZpZWQgaW4gYHJldHJ5QXR0ZW1wdHNgLlxuICAgKi9cbiAgUkVUUlkgPSAnUkVUUlknLFxufVxuXG4vKipcbiAqIFRoZSBjb3JyZXNwb25kaW5nIEFjdGlvbiB3aWxsIG9ubHkgYmUgdGFrZW4gaWYgKmFsbCogb2YgdGhlIGNvbmRpdGlvbnMgc3BlY2lmaWVkIGhlcmUgYXJlIG1ldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21SZWFzb24ge1xuICAvKipcbiAgICogQSBnbG9iIHN0cmluZyB0aGF0IHdpbGwgbWF0Y2ggb24gdGhlIGpvYiBleGl0IGNvZGUuIEZvciBleGFtcGxlLCBgJzQwKidgIHdpbGwgbWF0Y2ggNDAwLCA0MDQsIDQwMTIzNDU2Nzg5MDEyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gd2lsbCBub3QgbWF0Y2ggb24gdGhlIGV4aXQgY29kZVxuICAgKi9cbiAgcmVhZG9ubHkgb25FeGl0Q29kZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBnbG9iIHN0cmluZyB0aGF0IHdpbGwgbWF0Y2ggb24gdGhlIHN0YXR1c1JlYXNvbiByZXR1cm5lZCBieSB0aGUgZXhpdGluZyBqb2IuXG4gICAqIEZvciBleGFtcGxlLCBgJ0hvc3QgRUMyKidgIGluZGljYXRlcyB0aGF0IHRoZSBzcG90IGluc3RhbmNlIGhhcyBiZWVuIHJlY2xhaW1lZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB3aWxsIG5vdCBtYXRjaCBvbiB0aGUgc3RhdHVzIHJlYXNvblxuICAgKi9cbiAgcmVhZG9ubHkgb25TdGF0dXNSZWFzb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZ2xvYiBzdHJpbmcgdGhhdCB3aWxsIG1hdGNoIG9uIHRoZSByZWFzb24gcmV0dXJuZWQgYnkgdGhlIGV4aXRpbmcgam9iXG4gICAqIEZvciBleGFtcGxlLCBgJ0Nhbm5vdFB1bGxDb250YWluZXJFcnJvcionYCBpbmRpY2F0ZXMgdGhhdCBjb250YWluZXIgbmVlZGVkIHRvIHN0YXJ0IHRoZSBqb2IgY291bGQgbm90IGJlIHB1bGxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB3aWxsIG5vdCBtYXRjaCBvbiB0aGUgcmVhc29uXG4gICAqL1xuICByZWFkb25seSBvblJlYXNvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb21tb24gam9iIGV4aXQgcmVhc29uc1xuICovXG5leHBvcnQgY2xhc3MgUmVhc29uIHtcbiAgLyoqXG4gICAqIFdpbGwgbWF0Y2ggYW55IG5vbi16ZXJvIGV4aXQgY29kZVxuICAgKi9cbiAgc3RhdGljIHJlYWRvbmx5IE5PTl9aRVJPX0VYSVRfQ09ERTogUmVhc29uID0ge1xuICAgIG9uRXhpdENvZGU6ICcqJyxcbiAgfTtcblxuICAvKipcbiAgICogV2lsbCBvbmx5IG1hdGNoIGlmIHRoZSBEb2NrZXIgY29udGFpbmVyIGNvdWxkIG5vdCBiZSBwdWxsZWRcbiAgICovXG4gIHN0YXRpYyByZWFkb25seSBDQU5OT1RfUFVMTF9DT05UQUlORVI6IFJlYXNvbiA9IHtcbiAgICBvblJlYXNvbjogJ0Nhbm5vdFB1bGxDb250YWluZXJFcnJvcjoqJyxcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIG9ubHkgbWF0Y2ggaWYgdGhlIFNwb3QgaW5zdGFuY2UgZXhlY3V0aW5nIHRoZSBqb2Igd2FzIHJlY2xhaW1lZFxuICAgKi9cbiAgc3RhdGljIHJlYWRvbmx5IFNQT1RfSU5TVEFOQ0VfUkVDTEFJTUVEOiBSZWFzb24gPSB7XG4gICAgb25TdGF0dXNSZWFzb246ICdIb3N0IEVDMionLFxuICB9XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIFJlYXNvbiB0aGF0IGNhbiBtYXRjaCBvbiBtdWx0aXBsZSBjb25kaXRpb25zLlxuICAgKiBOb3RlIHRoYXQgYWxsIHNwZWNpZmllZCBjb25kaXRpb25zIG11c3QgYmUgbWV0IGZvciB0aGlzIHJlYXNvbiB0byBtYXRjaC5cbiAgICovXG4gIHN0YXRpYyBjdXN0b20oY3VzdG9tUmVhc29uUHJvcHM6IEN1c3RvbVJlYXNvbik6IFJlYXNvbiB7XG4gICAgcmV0dXJuIGN1c3RvbVJlYXNvblByb3BzO1xuICB9XG59XG5cbi8qKlxuICogQWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgSm9iRGVmaW5pdGlvbnNcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEpvYkRlZmluaXRpb25CYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJSm9iRGVmaW5pdGlvbiB7XG4gIHB1YmxpYyByZWFkb25seSBhYnN0cmFjdCBqb2JEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhYnN0cmFjdCBqb2JEZWZpbml0aW9uTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJzPzogeyBba2V5OnN0cmluZ106IGFueSB9O1xuICBwdWJsaWMgcmVhZG9ubHkgcmV0cnlBdHRlbXB0cz86IG51bWJlcjtcbiAgcHVibGljIHJlYWRvbmx5IHJldHJ5U3RyYXRlZ2llczogUmV0cnlTdHJhdGVneVtdO1xuICBwdWJsaWMgcmVhZG9ubHkgc2NoZWR1bGluZ1ByaW9yaXR5PzogbnVtYmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogSm9iRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzPy5qb2JEZWZpbml0aW9uTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMucGFyYW1ldGVycyA9IHByb3BzPy5wYXJhbWV0ZXJzO1xuICAgIHRoaXMucmV0cnlBdHRlbXB0cyA9IHByb3BzPy5yZXRyeUF0dGVtcHRzO1xuICAgIHRoaXMucmV0cnlTdHJhdGVnaWVzID0gcHJvcHM/LnJldHJ5U3RyYXRlZ2llcyA/PyBbXTtcbiAgICB0aGlzLnNjaGVkdWxpbmdQcmlvcml0eSA9IHByb3BzPy5zY2hlZHVsaW5nUHJpb3JpdHk7XG4gICAgdGhpcy50aW1lb3V0ID0gcHJvcHM/LnRpbWVvdXQ7XG4gIH1cblxuICBhZGRSZXRyeVN0cmF0ZWd5KHN0cmF0ZWd5OiBSZXRyeVN0cmF0ZWd5KTogdm9pZCB7XG4gICAgdGhpcy5yZXRyeVN0cmF0ZWdpZXMucHVzaChzdHJhdGVneSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2VKb2JEZWZpbml0aW9uUHJvcGVydGllcyhiYXNlSm9iRGVmaW5pdGlvbjogSm9iRGVmaW5pdGlvbkJhc2UpOiBDZm5Kb2JEZWZpbml0aW9uUHJvcHMge1xuICByZXR1cm4ge1xuICAgIHBhcmFtZXRlcnM6IGJhc2VKb2JEZWZpbml0aW9uLnBhcmFtZXRlcnMsXG4gICAgcmV0cnlTdHJhdGVneToge1xuICAgICAgYXR0ZW1wdHM6IGJhc2VKb2JEZWZpbml0aW9uLnJldHJ5QXR0ZW1wdHMsXG4gICAgICBldmFsdWF0ZU9uRXhpdDogTGF6eS5hbnkoe1xuICAgICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKGJhc2VKb2JEZWZpbml0aW9uLnJldHJ5U3RyYXRlZ2llcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBiYXNlSm9iRGVmaW5pdGlvbi5yZXRyeVN0cmF0ZWdpZXMubWFwKChzdHJhdGVneSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgYWN0aW9uOiBzdHJhdGVneS5hY3Rpb24sXG4gICAgICAgICAgICAgIC4uLnN0cmF0ZWd5Lm9uLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gICAgc2NoZWR1bGluZ1ByaW9yaXR5OiBiYXNlSm9iRGVmaW5pdGlvbi5zY2hlZHVsaW5nUHJpb3JpdHksXG4gICAgdGltZW91dDoge1xuICAgICAgYXR0ZW1wdER1cmF0aW9uU2Vjb25kczogYmFzZUpvYkRlZmluaXRpb24udGltZW91dD8udG9TZWNvbmRzKCksXG4gICAgfSxcbiAgICB0eXBlOiAnZHVtbXknLFxuICB9O1xufVxuIl19