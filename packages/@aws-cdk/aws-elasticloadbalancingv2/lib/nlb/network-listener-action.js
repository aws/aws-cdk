"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkListenerAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * What to do when a client makes a request to a listener
 *
 * Some actions can be combined with other ones (specifically,
 * you can perform authentication before serving the request).
 *
 * Multiple actions form a linked chain; the chain must always terminate in a
 * *(weighted)forward*, *fixedResponse* or *redirect* action.
 *
 * If an action supports chaining, the next action can be indicated
 * by passing it in the `next` property.
 */
class NetworkListenerAction {
    /**
     * Create an instance of NetworkListenerAction
     *
     * The default class should be good enough for most cases and
     * should be created by using one of the static factory functions,
     * but allow overriding to make sure we allow flexibility for the future.
     */
    constructor(actionJson, next) {
        this.actionJson = actionJson;
        this.next = next;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_CfnListener_ActionProperty(actionJson);
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkListenerAction(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkListenerAction);
            }
            throw error;
        }
    }
    /**
     * Forward to one or more Target Groups
     */
    static forward(targetGroups, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkForwardOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.forward);
            }
            throw error;
        }
        if (targetGroups.length === 0) {
            throw new Error('Need at least one targetGroup in a NetworkListenerAction.forward()');
        }
        if (targetGroups.length === 1 && options.stickinessDuration === undefined) {
            // Render a "simple" action for backwards compatibility with old templates
            return new TargetGroupListenerAction(targetGroups, {
                type: 'forward',
                targetGroupArn: targetGroups[0].targetGroupArn,
            });
        }
        return new TargetGroupListenerAction(targetGroups, {
            type: 'forward',
            forwardConfig: {
                targetGroups: targetGroups.map(g => ({ targetGroupArn: g.targetGroupArn })),
                targetGroupStickinessConfig: options.stickinessDuration ? {
                    durationSeconds: options.stickinessDuration.toSeconds(),
                    enabled: true,
                } : undefined,
            },
        });
    }
    /**
     * Forward to one or more Target Groups which are weighted differently
     */
    static weightedForward(targetGroups, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_NetworkForwardOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.weightedForward);
            }
            throw error;
        }
        if (targetGroups.length === 0) {
            throw new Error('Need at least one targetGroup in a NetworkListenerAction.weightedForward()');
        }
        return new TargetGroupListenerAction(targetGroups.map(g => g.targetGroup), {
            type: 'forward',
            forwardConfig: {
                targetGroups: targetGroups.map(g => ({ targetGroupArn: g.targetGroup.targetGroupArn, weight: g.weight })),
                targetGroupStickinessConfig: options.stickinessDuration ? {
                    durationSeconds: options.stickinessDuration.toSeconds(),
                    enabled: true,
                } : undefined,
            },
        });
    }
    /**
     * Render the actions in this chain
     */
    renderActions() {
        return this.renumber([this.actionJson, ...this.next?.renderActions() ?? []]);
    }
    /**
     * Called when the action is being used in a listener
     */
    bind(scope, listener) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkListener(listener);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        // Empty on purpose
        Array.isArray(scope);
        Array.isArray(listener);
    }
    /**
     * Renumber the "order" fields in the actions array.
     *
     * We don't number for 0 or 1 elements, but otherwise number them 1...#actions
     * so ELB knows about the right order.
     *
     * Do this in `NetworkListenerAction` instead of in `Listener` so that we give
     * users the opportunity to override by subclassing and overriding `renderActions`.
     */
    renumber(actions) {
        if (actions.length < 2) {
            return actions;
        }
        return actions.map((action, i) => ({ ...action, order: i + 1 }));
    }
}
exports.NetworkListenerAction = NetworkListenerAction;
_a = JSII_RTTI_SYMBOL_1;
NetworkListenerAction[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.NetworkListenerAction", version: "0.0.0" };
/**
 * Listener Action that calls "registerListener" on TargetGroups
 */
class TargetGroupListenerAction extends NetworkListenerAction {
    constructor(targetGroups, actionJson) {
        super(actionJson);
        this.targetGroups = targetGroups;
    }
    bind(_scope, listener) {
        for (const tg of this.targetGroups) {
            tg.registerListener(listener);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1saXN0ZW5lci1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWxpc3RlbmVyLWFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQWEscUJBQXFCO0lBZ0RoQzs7Ozs7O09BTUc7SUFDSCxZQUF1QyxVQUFzQyxFQUFxQixJQUE0QjtRQUF2RixlQUFVLEdBQVYsVUFBVSxDQUE0QjtRQUFxQixTQUFJLEdBQUosSUFBSSxDQUF3Qjs7Ozs7OzsrQ0F2RG5ILHFCQUFxQjs7OztLQXdEL0I7SUF2REQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQW1DLEVBQUUsVUFBaUMsRUFBRTs7Ozs7Ozs7OztRQUM1RixJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQztTQUN2RjtRQUNELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUN6RSwwRUFBMEU7WUFDMUUsT0FBTyxJQUFJLHlCQUF5QixDQUFDLFlBQVksRUFBRTtnQkFDakQsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQy9DLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxJQUFJLHlCQUF5QixDQUFDLFlBQVksRUFBRTtZQUNqRCxJQUFJLEVBQUUsU0FBUztZQUNmLGFBQWEsRUFBRTtnQkFDYixZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNFLDJCQUEyQixFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELGVBQWUsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO29CQUN2RCxPQUFPLEVBQUUsSUFBSTtpQkFDZCxDQUFDLENBQUMsQ0FBQyxTQUFTO2FBQ2Q7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUEwQyxFQUFFLFVBQWlDLEVBQUU7Ozs7Ozs7Ozs7UUFDM0csSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxPQUFPLElBQUkseUJBQXlCLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN6RSxJQUFJLEVBQUUsU0FBUztZQUNmLGFBQWEsRUFBRTtnQkFDYixZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RywyQkFBMkIsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxlQUFlLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRTtvQkFDdkQsT0FBTyxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUNkO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFZRDs7T0FFRztJQUNJLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5RTtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLEtBQWdCLEVBQUUsUUFBMEI7Ozs7Ozs7Ozs7UUFDdEQsbUJBQW1CO1FBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN6QjtJQUVEOzs7Ozs7OztPQVFHO0lBQ08sUUFBUSxDQUFDLE9BQXFDO1FBQ3RELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPLE9BQU8sQ0FBQztTQUFFO1FBRTNDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsRTs7QUF2Rkgsc0RBd0ZDOzs7QUFtQ0Q7O0dBRUc7QUFDSCxNQUFNLHlCQUEwQixTQUFRLHFCQUFxQjtJQUMzRCxZQUE2QixZQUFtQyxFQUFFLFVBQXNDO1FBQ3RHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQURTLGlCQUFZLEdBQVosWUFBWSxDQUF1QjtLQUUvRDtJQUVNLElBQUksQ0FBQyxNQUFpQixFQUFFLFFBQTBCO1FBQ3ZELEtBQUssTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNsQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0I7S0FDRjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSU5ldHdvcmtMaXN0ZW5lciB9IGZyb20gJy4vbmV0d29yay1saXN0ZW5lcic7XG5pbXBvcnQgeyBJTmV0d29ya1RhcmdldEdyb3VwIH0gZnJvbSAnLi9uZXR3b3JrLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBDZm5MaXN0ZW5lciB9IGZyb20gJy4uL2VsYXN0aWNsb2FkYmFsYW5jaW5ndjIuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElMaXN0ZW5lckFjdGlvbiB9IGZyb20gJy4uL3NoYXJlZC9saXN0ZW5lci1hY3Rpb24nO1xuXG4vKipcbiAqIFdoYXQgdG8gZG8gd2hlbiBhIGNsaWVudCBtYWtlcyBhIHJlcXVlc3QgdG8gYSBsaXN0ZW5lclxuICpcbiAqIFNvbWUgYWN0aW9ucyBjYW4gYmUgY29tYmluZWQgd2l0aCBvdGhlciBvbmVzIChzcGVjaWZpY2FsbHksXG4gKiB5b3UgY2FuIHBlcmZvcm0gYXV0aGVudGljYXRpb24gYmVmb3JlIHNlcnZpbmcgdGhlIHJlcXVlc3QpLlxuICpcbiAqIE11bHRpcGxlIGFjdGlvbnMgZm9ybSBhIGxpbmtlZCBjaGFpbjsgdGhlIGNoYWluIG11c3QgYWx3YXlzIHRlcm1pbmF0ZSBpbiBhXG4gKiAqKHdlaWdodGVkKWZvcndhcmQqLCAqZml4ZWRSZXNwb25zZSogb3IgKnJlZGlyZWN0KiBhY3Rpb24uXG4gKlxuICogSWYgYW4gYWN0aW9uIHN1cHBvcnRzIGNoYWluaW5nLCB0aGUgbmV4dCBhY3Rpb24gY2FuIGJlIGluZGljYXRlZFxuICogYnkgcGFzc2luZyBpdCBpbiB0aGUgYG5leHRgIHByb3BlcnR5LlxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0xpc3RlbmVyQWN0aW9uIGltcGxlbWVudHMgSUxpc3RlbmVyQWN0aW9uIHtcbiAgLyoqXG4gICAqIEZvcndhcmQgdG8gb25lIG9yIG1vcmUgVGFyZ2V0IEdyb3Vwc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3J3YXJkKHRhcmdldEdyb3VwczogSU5ldHdvcmtUYXJnZXRHcm91cFtdLCBvcHRpb25zOiBOZXR3b3JrRm9yd2FyZE9wdGlvbnMgPSB7fSk6IE5ldHdvcmtMaXN0ZW5lckFjdGlvbiB7XG4gICAgaWYgKHRhcmdldEdyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhdCBsZWFzdCBvbmUgdGFyZ2V0R3JvdXAgaW4gYSBOZXR3b3JrTGlzdGVuZXJBY3Rpb24uZm9yd2FyZCgpJyk7XG4gICAgfVxuICAgIGlmICh0YXJnZXRHcm91cHMubGVuZ3RoID09PSAxICYmIG9wdGlvbnMuc3RpY2tpbmVzc0R1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFJlbmRlciBhIFwic2ltcGxlXCIgYWN0aW9uIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIG9sZCB0ZW1wbGF0ZXNcbiAgICAgIHJldHVybiBuZXcgVGFyZ2V0R3JvdXBMaXN0ZW5lckFjdGlvbih0YXJnZXRHcm91cHMsIHtcbiAgICAgICAgdHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB0YXJnZXRHcm91cEFybjogdGFyZ2V0R3JvdXBzWzBdLnRhcmdldEdyb3VwQXJuLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUYXJnZXRHcm91cExpc3RlbmVyQWN0aW9uKHRhcmdldEdyb3Vwcywge1xuICAgICAgdHlwZTogJ2ZvcndhcmQnLFxuICAgICAgZm9yd2FyZENvbmZpZzoge1xuICAgICAgICB0YXJnZXRHcm91cHM6IHRhcmdldEdyb3Vwcy5tYXAoZyA9PiAoeyB0YXJnZXRHcm91cEFybjogZy50YXJnZXRHcm91cEFybiB9KSksXG4gICAgICAgIHRhcmdldEdyb3VwU3RpY2tpbmVzc0NvbmZpZzogb3B0aW9ucy5zdGlja2luZXNzRHVyYXRpb24gPyB7XG4gICAgICAgICAgZHVyYXRpb25TZWNvbmRzOiBvcHRpb25zLnN0aWNraW5lc3NEdXJhdGlvbi50b1NlY29uZHMoKSxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHRvIG9uZSBvciBtb3JlIFRhcmdldCBHcm91cHMgd2hpY2ggYXJlIHdlaWdodGVkIGRpZmZlcmVudGx5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdlaWdodGVkRm9yd2FyZCh0YXJnZXRHcm91cHM6IE5ldHdvcmtXZWlnaHRlZFRhcmdldEdyb3VwW10sIG9wdGlvbnM6IE5ldHdvcmtGb3J3YXJkT3B0aW9ucyA9IHt9KTogTmV0d29ya0xpc3RlbmVyQWN0aW9uIHtcbiAgICBpZiAodGFyZ2V0R3JvdXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGF0IGxlYXN0IG9uZSB0YXJnZXRHcm91cCBpbiBhIE5ldHdvcmtMaXN0ZW5lckFjdGlvbi53ZWlnaHRlZEZvcndhcmQoKScpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGFyZ2V0R3JvdXBMaXN0ZW5lckFjdGlvbih0YXJnZXRHcm91cHMubWFwKGcgPT4gZy50YXJnZXRHcm91cCksIHtcbiAgICAgIHR5cGU6ICdmb3J3YXJkJyxcbiAgICAgIGZvcndhcmRDb25maWc6IHtcbiAgICAgICAgdGFyZ2V0R3JvdXBzOiB0YXJnZXRHcm91cHMubWFwKGcgPT4gKHsgdGFyZ2V0R3JvdXBBcm46IGcudGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBBcm4sIHdlaWdodDogZy53ZWlnaHQgfSkpLFxuICAgICAgICB0YXJnZXRHcm91cFN0aWNraW5lc3NDb25maWc6IG9wdGlvbnMuc3RpY2tpbmVzc0R1cmF0aW9uID8ge1xuICAgICAgICAgIGR1cmF0aW9uU2Vjb25kczogb3B0aW9ucy5zdGlja2luZXNzRHVyYXRpb24udG9TZWNvbmRzKCksXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIE5ldHdvcmtMaXN0ZW5lckFjdGlvblxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBjbGFzcyBzaG91bGQgYmUgZ29vZCBlbm91Z2ggZm9yIG1vc3QgY2FzZXMgYW5kXG4gICAqIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHVzaW5nIG9uZSBvZiB0aGUgc3RhdGljIGZhY3RvcnkgZnVuY3Rpb25zLFxuICAgKiBidXQgYWxsb3cgb3ZlcnJpZGluZyB0byBtYWtlIHN1cmUgd2UgYWxsb3cgZmxleGliaWxpdHkgZm9yIHRoZSBmdXR1cmUuXG4gICAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhY3Rpb25Kc29uOiBDZm5MaXN0ZW5lci5BY3Rpb25Qcm9wZXJ0eSwgcHJvdGVjdGVkIHJlYWRvbmx5IG5leHQ/OiBOZXR3b3JrTGlzdGVuZXJBY3Rpb24pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFjdGlvbnMgaW4gdGhpcyBjaGFpblxuICAgKi9cbiAgcHVibGljIHJlbmRlckFjdGlvbnMoKTogQ2ZuTGlzdGVuZXIuQWN0aW9uUHJvcGVydHlbXSB7XG4gICAgcmV0dXJuIHRoaXMucmVudW1iZXIoW3RoaXMuYWN0aW9uSnNvbiwgLi4udGhpcy5uZXh0Py5yZW5kZXJBY3Rpb25zKCkgPz8gW11dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYWN0aW9uIGlzIGJlaW5nIHVzZWQgaW4gYSBsaXN0ZW5lclxuICAgKi9cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgbGlzdGVuZXI6IElOZXR3b3JrTGlzdGVuZXIpIHtcbiAgICAvLyBFbXB0eSBvbiBwdXJwb3NlXG4gICAgQXJyYXkuaXNBcnJheShzY29wZSk7XG4gICAgQXJyYXkuaXNBcnJheShsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVudW1iZXIgdGhlIFwib3JkZXJcIiBmaWVsZHMgaW4gdGhlIGFjdGlvbnMgYXJyYXkuXG4gICAqXG4gICAqIFdlIGRvbid0IG51bWJlciBmb3IgMCBvciAxIGVsZW1lbnRzLCBidXQgb3RoZXJ3aXNlIG51bWJlciB0aGVtIDEuLi4jYWN0aW9uc1xuICAgKiBzbyBFTEIga25vd3MgYWJvdXQgdGhlIHJpZ2h0IG9yZGVyLlxuICAgKlxuICAgKiBEbyB0aGlzIGluIGBOZXR3b3JrTGlzdGVuZXJBY3Rpb25gIGluc3RlYWQgb2YgaW4gYExpc3RlbmVyYCBzbyB0aGF0IHdlIGdpdmVcbiAgICogdXNlcnMgdGhlIG9wcG9ydHVuaXR5IHRvIG92ZXJyaWRlIGJ5IHN1YmNsYXNzaW5nIGFuZCBvdmVycmlkaW5nIGByZW5kZXJBY3Rpb25zYC5cbiAgICovXG4gIHByb3RlY3RlZCByZW51bWJlcihhY3Rpb25zOiBDZm5MaXN0ZW5lci5BY3Rpb25Qcm9wZXJ0eVtdKTogQ2ZuTGlzdGVuZXIuQWN0aW9uUHJvcGVydHlbXSB7XG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoIDwgMikgeyByZXR1cm4gYWN0aW9uczsgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnMubWFwKChhY3Rpb24sIGkpID0+ICh7IC4uLmFjdGlvbiwgb3JkZXI6IGkgKyAxIH0pKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBOZXR3b3JrTGlzdGVuZXJBY3Rpb24uZm9yd2FyZCgpYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtGb3J3YXJkT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBGb3IgaG93IGxvbmcgY2xpZW50cyBzaG91bGQgYmUgZGlyZWN0ZWQgdG8gdGhlIHNhbWUgdGFyZ2V0IGdyb3VwXG4gICAqXG4gICAqIFJhbmdlIGJldHdlZW4gMSBzZWNvbmQgYW5kIDcgZGF5cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdGlja2luZXNzXG4gICAqL1xuICByZWFkb25seSBzdGlja2luZXNzRHVyYXRpb24/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBBIFRhcmdldCBHcm91cCBhbmQgd2VpZ2h0IGNvbWJpbmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya1dlaWdodGVkVGFyZ2V0R3JvdXAge1xuICAvKipcbiAgICogVGhlIHRhcmdldCBncm91cFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXA6IElOZXR3b3JrVGFyZ2V0R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSB0YXJnZXQgZ3JvdXAncyB3ZWlnaHRcbiAgICpcbiAgICogUmFuZ2UgaXMgWzAuLjEwMDApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSB3ZWlnaHQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogTGlzdGVuZXIgQWN0aW9uIHRoYXQgY2FsbHMgXCJyZWdpc3Rlckxpc3RlbmVyXCIgb24gVGFyZ2V0R3JvdXBzXG4gKi9cbmNsYXNzIFRhcmdldEdyb3VwTGlzdGVuZXJBY3Rpb24gZXh0ZW5kcyBOZXR3b3JrTGlzdGVuZXJBY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRhcmdldEdyb3VwczogSU5ldHdvcmtUYXJnZXRHcm91cFtdLCBhY3Rpb25Kc29uOiBDZm5MaXN0ZW5lci5BY3Rpb25Qcm9wZXJ0eSkge1xuICAgIHN1cGVyKGFjdGlvbkpzb24pO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIGxpc3RlbmVyOiBJTmV0d29ya0xpc3RlbmVyKSB7XG4gICAgZm9yIChjb25zdCB0ZyBvZiB0aGlzLnRhcmdldEdyb3Vwcykge1xuICAgICAgdGcucmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgfVxuICB9XG59XG4iXX0=