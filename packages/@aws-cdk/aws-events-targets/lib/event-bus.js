"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Notify an existing Event Bus of an event
 */
class EventBus {
    constructor(eventBus, props = {}) {
        this.eventBus = eventBus;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_EventBusProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EventBus);
            }
            throw error;
        }
    }
    bind(rule, _id) {
        const role = this.props.role ?? util_1.singletonEventRole(rule);
        role.addToPrincipalPolicy(this.putEventStatement());
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
        }
        return {
            arn: this.eventBus.eventBusArn,
            deadLetterConfig: this.props.deadLetterQueue ? { arn: this.props.deadLetterQueue?.queueArn } : undefined,
            role,
        };
    }
    putEventStatement() {
        return new iam.PolicyStatement({
            actions: ['events:PutEvents'],
            resources: [this.eventBus.eventBusArn],
        });
    }
}
exports.EventBus = EventBus;
_a = JSII_RTTI_SYMBOL_1;
EventBus[_a] = { fqn: "@aws-cdk/aws-events-targets.EventBus", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtYnVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnQtYnVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUV4QyxpQ0FBZ0Y7QUE0QmhGOztHQUVHO0FBQ0gsTUFBYSxRQUFRO0lBQ25CLFlBQTZCLFFBQTBCLEVBQW1CLFFBQXVCLEVBQUU7UUFBdEUsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBb0I7Ozs7OzsrQ0FEeEYsUUFBUTs7OztLQUNxRjtJQUV4RyxJQUFJLENBQUMsSUFBa0IsRUFBRSxHQUFZO1FBQ25DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLHlCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBRXBELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDOUIseUNBQWtDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPO1lBQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVztZQUM5QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDeEcsSUFBSTtTQUNMLENBQUM7S0FDSDtJQUVPLGlCQUFpQjtRQUN2QixPQUFPLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUM3QixPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM3QixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztTQUN2QyxDQUFDLENBQUM7S0FDSjs7QUF2QkgsNEJBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0IHsgc2luZ2xldG9uRXZlbnRSb2xlLCBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5IH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgYW4gRXZlbnQgQnVzIGV2ZW50XG4gKlxuICogQ2Fubm90IGV4dGVuZCBUYXJnZXRCYXNlUHJvcHMuIFJldHJ5IHBvbGljeSBpcyBub3Qgc3VwcG9ydGVkIGZvciBFdmVudCBidXMgdGFyZ2V0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudEJ1c1Byb3BzIHtcbiAgLyoqXG4gICAqIFJvbGUgdG8gYmUgdXNlZCB0byBwdWJsaXNoIHRoZSBldmVudFxuICAgKlxuICAgKiBAZGVmYXVsdCBhIG5ldyByb2xlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgU1FTIHF1ZXVlIHRvIGJlIHVzZWQgYXMgZGVhZExldHRlclF1ZXVlLlxuICAgKiBDaGVjayBvdXQgdGhlIFtjb25zaWRlcmF0aW9ucyBmb3IgdXNpbmcgYSBkZWFkLWxldHRlciBxdWV1ZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2V2ZW50YnJpZGdlL2xhdGVzdC91c2VyZ3VpZGUvcnVsZS1kbHEuaHRtbCNkbHEtY29uc2lkZXJhdGlvbnMpLlxuICAgKlxuICAgKiBUaGUgZXZlbnRzIG5vdCBzdWNjZXNzZnVsbHkgZGVsaXZlcmVkIGFyZSBhdXRvbWF0aWNhbGx5IHJldHJpZWQgZm9yIGEgc3BlY2lmaWVkIHBlcmlvZCBvZiB0aW1lLFxuICAgKiBkZXBlbmRpbmcgb24gdGhlIHJldHJ5IHBvbGljeSBvZiB0aGUgdGFyZ2V0LlxuICAgKiBJZiBhbiBldmVudCBpcyBub3QgZGVsaXZlcmVkIGJlZm9yZSBhbGwgcmV0cnkgYXR0ZW1wdHMgYXJlIGV4aGF1c3RlZCwgaXQgd2lsbCBiZSBzZW50IHRvIHRoZSBkZWFkIGxldHRlciBxdWV1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBkZWFkLWxldHRlciBxdWV1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVhZExldHRlclF1ZXVlPzogc3FzLklRdWV1ZTtcbn1cblxuLyoqXG4gKiBOb3RpZnkgYW4gZXhpc3RpbmcgRXZlbnQgQnVzIG9mIGFuIGV2ZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZXZlbnRCdXM6IGV2ZW50cy5JRXZlbnRCdXMsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEV2ZW50QnVzUHJvcHMgPSB7fSkgeyB9XG5cbiAgYmluZChydWxlOiBldmVudHMuSVJ1bGUsIF9pZD86IHN0cmluZyk6IGV2ZW50cy5SdWxlVGFyZ2V0Q29uZmlnIHtcbiAgICBjb25zdCByb2xlID0gdGhpcy5wcm9wcy5yb2xlID8/IHNpbmdsZXRvbkV2ZW50Um9sZShydWxlKTtcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHRoaXMucHV0RXZlbnRTdGF0ZW1lbnQoKSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUpIHtcbiAgICAgIGFkZFRvRGVhZExldHRlclF1ZXVlUmVzb3VyY2VQb2xpY3kocnVsZSwgdGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhcm46IHRoaXMuZXZlbnRCdXMuZXZlbnRCdXNBcm4sXG4gICAgICBkZWFkTGV0dGVyQ29uZmlnOiB0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZSA/IHsgYXJuOiB0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZT8ucXVldWVBcm4gfSA6IHVuZGVmaW5lZCxcbiAgICAgIHJvbGUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcHV0RXZlbnRTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5ldmVudEJ1cy5ldmVudEJ1c0Fybl0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==