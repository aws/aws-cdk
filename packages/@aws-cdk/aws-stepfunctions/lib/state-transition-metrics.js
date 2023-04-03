"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateTransitionMetric = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
/**
 * Metrics on the rate limiting performed on state machine execution.
 *
 * These rate limits are shared across all state machines.
 */
class StateTransitionMetric {
    /**
     * Return the given named metric for the service's state transition metrics
     *
     * @default average over 5 minutes
     */
    static metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensionsMap: { ServiceMetric: 'StateTransition' },
            ...props,
        });
    }
    /**
     * Metric for the number of available state transitions.
     *
     * @default average over 5 minutes
     */
    static metricProvisionedBucketSize(props) {
        return StateTransitionMetric.metric('ProvisionedBucketSize', props);
    }
    /**
     * Metric for the provisioned steady-state execution rate
     *
     * @default average over 5 minutes
     */
    static metricProvisionedRefillRate(props) {
        return StateTransitionMetric.metric('ProvisionedRefillRate', props);
    }
    /**
     * Metric for the number of available state transitions per second
     *
     * @default average over 5 minutes
     */
    static metricConsumedCapacity(props) {
        return StateTransitionMetric.metric('ConsumedCapacity', props);
    }
    /**
     * Metric for the number of throttled state transitions
     *
     * @default sum over 5 minutes
     */
    static metricThrottledEvents(props) {
        return StateTransitionMetric.metric('ThrottledEvents', { statistic: 'sum', ...props });
    }
}
exports.StateTransitionMetric = StateTransitionMetric;
_a = JSII_RTTI_SYMBOL_1;
StateTransitionMetric[_a] = { fqn: "@aws-cdk/aws-stepfunctions.StateTransitionMetric", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtdHJhbnNpdGlvbi1tZXRyaWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGUtdHJhbnNpdGlvbi1tZXRyaWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQXNEO0FBRXREOzs7O0dBSUc7QUFDSCxNQUFhLHFCQUFxQjtJQUNoQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFrQixFQUFFLEtBQWdDO1FBQ3ZFLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQzNCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVU7WUFDVixhQUFhLEVBQUUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUU7WUFDbkQsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLDJCQUEyQixDQUFDLEtBQWdDO1FBQ3hFLE9BQU8scUJBQXFCLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3JFO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFnQztRQUN4RSxPQUFPLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyRTtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsc0JBQXNCLENBQUMsS0FBZ0M7UUFDbkUsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDaEU7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQWdDO1FBQ2xFLE9BQU8scUJBQXFCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDeEY7O0FBakRILHNEQWtEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuXG4vKipcbiAqIE1ldHJpY3Mgb24gdGhlIHJhdGUgbGltaXRpbmcgcGVyZm9ybWVkIG9uIHN0YXRlIG1hY2hpbmUgZXhlY3V0aW9uLlxuICpcbiAqIFRoZXNlIHJhdGUgbGltaXRzIGFyZSBzaGFyZWQgYWNyb3NzIGFsbCBzdGF0ZSBtYWNoaW5lcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlVHJhbnNpdGlvbk1ldHJpYyB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhlIHNlcnZpY2UncyBzdGF0ZSB0cmFuc2l0aW9uIG1ldHJpY3NcbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHsgU2VydmljZU1ldHJpYzogJ1N0YXRlVHJhbnNpdGlvbicgfSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBhdmFpbGFibGUgc3RhdGUgdHJhbnNpdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljUHJvdmlzaW9uZWRCdWNrZXRTaXplKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBTdGF0ZVRyYW5zaXRpb25NZXRyaWMubWV0cmljKCdQcm92aXNpb25lZEJ1Y2tldFNpemUnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgcHJvdmlzaW9uZWQgc3RlYWR5LXN0YXRlIGV4ZWN1dGlvbiByYXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljUHJvdmlzaW9uZWRSZWZpbGxSYXRlKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBTdGF0ZVRyYW5zaXRpb25NZXRyaWMubWV0cmljKCdQcm92aXNpb25lZFJlZmlsbFJhdGUnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGF2YWlsYWJsZSBzdGF0ZSB0cmFuc2l0aW9ucyBwZXIgc2Vjb25kXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQ29uc3VtZWRDYXBhY2l0eShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gU3RhdGVUcmFuc2l0aW9uTWV0cmljLm1ldHJpYygnQ29uc3VtZWRDYXBhY2l0eScsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGhyb3R0bGVkIHN0YXRlIHRyYW5zaXRpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZXRyaWNUaHJvdHRsZWRFdmVudHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIFN0YXRlVHJhbnNpdGlvbk1ldHJpYy5tZXRyaWMoJ1Rocm90dGxlZEV2ZW50cycsIHsgc3RhdGlzdGljOiAnc3VtJywgLi4ucHJvcHMgfSk7XG4gIH1cbn1cbiJdfQ==