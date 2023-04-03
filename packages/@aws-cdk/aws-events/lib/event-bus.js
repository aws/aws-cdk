"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusPolicy = exports.EventBus = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const archive_1 = require("./archive");
const events_generated_1 = require("./events.generated");
class EventBusBase extends core_1.Resource {
    archive(id, props) {
        return new archive_1.Archive(this, id, {
            sourceEventBus: this,
            description: props.description || `Event Archive for ${this.eventBusName} Event Bus`,
            eventPattern: props.eventPattern,
            retention: props.retention,
            archiveName: props.archiveName,
        });
    }
    grantPutEventsTo(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['events:PutEvents'],
            resourceArns: [this.eventBusArn],
        });
    }
}
/**
 * Define an EventBridge EventBus
 *
 * @resource AWS::Events::EventBus
 */
class EventBus extends EventBusBase {
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param eventBusArn ARN of imported event bus
     */
    static fromEventBusArn(scope, id, eventBusArn) {
        const parts = core_1.Stack.of(scope).splitArn(eventBusArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        return new ImportedEventBus(scope, id, {
            eventBusArn: eventBusArn,
            eventBusName: parts.resourceName || '',
            eventBusPolicy: '',
        });
    }
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param eventBusName Name of imported event bus
     */
    static fromEventBusName(scope, id, eventBusName) {
        const eventBusArn = core_1.Stack.of(scope).formatArn({
            resource: 'event-bus',
            service: 'events',
            resourceName: eventBusName,
        });
        return EventBus.fromEventBusAttributes(scope, id, {
            eventBusName: eventBusName,
            eventBusArn: eventBusArn,
            eventBusPolicy: '',
        });
    }
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param attrs Imported event bus properties
     */
    static fromEventBusAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_EventBusAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEventBusAttributes);
            }
            throw error;
        }
        return new ImportedEventBus(scope, id, attrs);
    }
    /**
     * Permits an IAM Principal to send custom events to EventBridge
     * so that they can be matched to rules.
     *
     * @param grantee The principal (no-op if undefined)
     * @deprecated use grantAllPutEvents instead
     */
    static grantPutEvents(grantee) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-events.EventBus#grantPutEvents", "use grantAllPutEvents instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grantPutEvents);
            }
            throw error;
        }
        // It's currently not possible to restrict PutEvents to specific resources.
        // See https://docs.aws.amazon.com/eventbridge/latest/userguide/permissions-reference-eventbridge.html
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['events:PutEvents'],
            resourceArns: ['*'],
        });
    }
    /**
     * Permits an IAM Principal to send custom events to EventBridge
     * so that they can be matched to rules.
     *
     * @param grantee The principal (no-op if undefined)
     */
    static grantAllPutEvents(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['events:PutEvents'],
            resourceArns: ['*'],
        });
    }
    static eventBusProps(defaultEventBusName, props = {}) {
        const { eventBusName, eventSourceName } = props;
        const eventBusNameRegex = /^[\/\.\-_A-Za-z0-9]{1,256}$/;
        if (eventBusName !== undefined && eventSourceName !== undefined) {
            throw new Error('\'eventBusName\' and \'eventSourceName\' cannot both be provided');
        }
        if (eventBusName !== undefined) {
            if (!core_1.Token.isUnresolved(eventBusName)) {
                if (eventBusName === 'default') {
                    throw new Error('\'eventBusName\' must not be \'default\'');
                }
                else if (eventBusName.indexOf('/') > -1) {
                    throw new Error('\'eventBusName\' must not contain \'/\'');
                }
                else if (!eventBusNameRegex.test(eventBusName)) {
                    throw new Error(`'eventBusName' must satisfy: ${eventBusNameRegex}`);
                }
            }
            return { eventBusName };
        }
        if (eventSourceName !== undefined) {
            if (!core_1.Token.isUnresolved(eventSourceName)) {
                // Ex: aws.partner/PartnerName/acct1/repo1
                const eventSourceNameRegex = /^aws\.partner(\/[\.\-_A-Za-z0-9]+){2,}$/;
                if (!eventSourceNameRegex.test(eventSourceName)) {
                    throw new Error(`'eventSourceName' must satisfy: ${eventSourceNameRegex}`);
                }
                else if (!eventBusNameRegex.test(eventSourceName)) {
                    throw new Error(`'eventSourceName' must satisfy: ${eventBusNameRegex}`);
                }
            }
            return { eventBusName: eventSourceName, eventSourceName };
        }
        return { eventBusName: defaultEventBusName };
    }
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_EventBusProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EventBus);
            }
            throw error;
        }
        const { eventBusName, eventSourceName } = EventBus.eventBusProps(core_1.Lazy.string({ produce: () => core_1.Names.uniqueId(this) }), props);
        super(scope, id, { physicalName: eventBusName });
        const eventBus = new events_generated_1.CfnEventBus(this, 'Resource', {
            name: this.physicalName,
            eventSourceName,
        });
        this.eventBusArn = this.getResourceArnAttribute(eventBus.attrArn, {
            service: 'events',
            resource: 'event-bus',
            resourceName: eventBus.name,
        });
        this.eventBusName = this.getResourceNameAttribute(eventBus.ref);
        this.eventBusPolicy = eventBus.attrPolicy;
        this.eventSourceName = eventBus.eventSourceName;
    }
    /**
     * Adds a statement to the IAM resource policy associated with this event bus.
     */
    addToResourcePolicy(statement) {
        if (statement.sid == null) {
            throw new Error('Event Bus policy statements must have a sid');
        }
        if (this.policy) {
            // The policy can contain only one statement
            return { statementAdded: false };
        }
        this.policy = new EventBusPolicy(this, 'Policy', {
            eventBus: this,
            statement: statement.toJSON(),
            statementId: statement.sid,
        });
        return { statementAdded: true, policyDependable: this.policy };
    }
}
_a = JSII_RTTI_SYMBOL_1;
EventBus[_a] = { fqn: "@aws-cdk/aws-events.EventBus", version: "0.0.0" };
exports.EventBus = EventBus;
class ImportedEventBus extends EventBusBase {
    constructor(scope, id, attrs) {
        const arnParts = core_1.Stack.of(scope).splitArn(attrs.eventBusArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        super(scope, id, {
            account: arnParts.account,
            region: arnParts.region,
        });
        this.eventBusArn = attrs.eventBusArn;
        this.eventBusName = attrs.eventBusName;
        this.eventBusPolicy = attrs.eventBusPolicy;
        this.eventSourceName = attrs.eventSourceName;
    }
}
/**
 * The policy for an Event Bus
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
class EventBusPolicy extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_EventBusPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EventBusPolicy);
            }
            throw error;
        }
        new events_generated_1.CfnEventBusPolicy(this, 'Resource', {
            statementId: props.statementId,
            statement: props.statement,
            eventBusName: props.eventBus.eventBusName,
        });
    }
}
_b = JSII_RTTI_SYMBOL_1;
EventBusPolicy[_b] = { fqn: "@aws-cdk/aws-events.EventBusPolicy", version: "0.0.0" };
exports.EventBusPolicy = EventBusPolicy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtYnVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnQtYnVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBMEY7QUFFMUYsdUNBQXNEO0FBQ3RELHlEQUFvRTtBQWdIcEUsTUFBZSxZQUFhLFNBQVEsZUFBUTtJQXNCbkMsT0FBTyxDQUFDLEVBQVUsRUFBRSxLQUF1QjtRQUNoRCxPQUFPLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLHFCQUFxQixJQUFJLENBQUMsWUFBWSxZQUFZO1lBQ3BGLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDMUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztLQUNKO0lBRU0sZ0JBQWdCLENBQUMsT0FBdUI7UUFDN0MsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDN0IsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNqQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsUUFBUyxTQUFRLFlBQVk7SUFFeEM7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFdBQW1CO1FBQzdFLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFbkYsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDckMs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QUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7UUFDM0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0tBQzlDO0NBQ0Y7QUF1QkQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEsY0FBZSxTQUFRLGVBQVE7SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsY0FBYzs7OztRQUl2QixJQUFJLG9DQUFpQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFZO1lBQy9CLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixZQUFZLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZO1NBQzFDLENBQUMsQ0FBQztLQUNKOzs7O0FBVFUsd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIElSZXNvdXJjZSwgTGF6eSwgTmFtZXMsIFJlc291cmNlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXJjaGl2ZSwgQmFzZUFyY2hpdmVQcm9wcyB9IGZyb20gJy4vYXJjaGl2ZSc7XG5pbXBvcnQgeyBDZm5FdmVudEJ1cywgQ2ZuRXZlbnRCdXNQb2xpY3kgfSBmcm9tICcuL2V2ZW50cy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIEludGVyZmFjZSB3aGljaCBhbGwgRXZlbnRCdXMgYmFzZWQgY2xhc3NlcyBNVVNUIGltcGxlbWVudFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElFdmVudEJ1cyBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgSUQgb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZXZlbnRzLWV2ZW50YnVzLmh0bWwjY2ZuLWV2ZW50cy1ldmVudGJ1cy1uYW1lXG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNBcm4tZm46OmdldGF0dFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXNBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEpTT04gcG9saWN5IG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI1BvbGljeS1mbjo6Z2V0YXR0XG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c1BvbGljeTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFydG5lciBldmVudCBzb3VyY2UgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI2Nmbi1ldmVudHMtZXZlbnRidXMtZXZlbnRzb3VyY2VuYW1lXG4gICAqL1xuICByZWFkb25seSBldmVudFNvdXJjZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFdmVudEJyaWRnZSBhcmNoaXZlIHRvIHNlbmQgZXZlbnRzIHRvLlxuICAgKiBXaGVuIHlvdSBjcmVhdGUgYW4gYXJjaGl2ZSwgaW5jb21pbmcgZXZlbnRzIG1pZ2h0IG5vdCBpbW1lZGlhdGVseSBzdGFydCBiZWluZyBzZW50IHRvIHRoZSBhcmNoaXZlLlxuICAgKiBBbGxvdyBhIHNob3J0IHBlcmlvZCBvZiB0aW1lIGZvciBjaGFuZ2VzIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBvZiB0aGUgYXJjaGl2ZVxuICAgKi9cbiAgYXJjaGl2ZShpZDogc3RyaW5nLCBwcm9wczogQmFzZUFyY2hpdmVQcm9wcyk6IEFyY2hpdmU7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBhbiBJQU0gUHJpbmNpcGFsIHRvIHNlbmQgY3VzdG9tIGV2ZW50cyB0byB0aGUgZXZlbnRCdXNcbiAgICogc28gdGhhdCB0aGV5IGNhbiBiZSBtYXRjaGVkIHRvIHJ1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBUaGUgcHJpbmNpcGFsIChuby1vcCBpZiB1bmRlZmluZWQpXG4gICAqL1xuICBncmFudFB1dEV2ZW50c1RvKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gZGVmaW5lIGFuIGV2ZW50IGJ1c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnVzUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IGJ1cyB5b3UgYXJlIGNyZWF0aW5nXG4gICAqIE5vdGU6IElmICdldmVudFNvdXJjZU5hbWUnIGlzIHBhc3NlZCBpbiwgeW91IGNhbm5vdCBzZXQgdGhpc1xuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZXZlbnRzLWV2ZW50YnVzLmh0bWwjY2ZuLWV2ZW50cy1ldmVudGJ1cy1uYW1lXG4gICAqIEBkZWZhdWx0IC0gYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXNOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFydG5lciBldmVudCBzb3VyY2UgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICogTm90ZTogSWYgJ2V2ZW50QnVzTmFtZScgaXMgcGFzc2VkIGluLCB5b3UgY2Fubm90IHNldCB0aGlzXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNjZm4tZXZlbnRzLWV2ZW50YnVzLWV2ZW50c291cmNlbmFtZVxuICAgKiBAZGVmYXVsdCAtIG5vIHBhcnRuZXIgZXZlbnQgc291cmNlXG4gICAqL1xuICByZWFkb25seSBldmVudFNvdXJjZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHdpdGggcHJvcGVydGllcyBuZWNlc3NhcnkgdG8gaW1wb3J0IGEgcmV1c2FibGUgRXZlbnRCdXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudEJ1c0F0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIElEIG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNjZm4tZXZlbnRzLWV2ZW50YnVzLW5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50QnVzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNBcm4tZm46OmdldGF0dFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXNBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEpTT04gcG9saWN5IG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNQb2xpY3ktZm46OmdldGF0dFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXNQb2xpY3k6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhcnRuZXIgZXZlbnQgc291cmNlIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNjZm4tZXZlbnRzLWV2ZW50YnVzLWV2ZW50c291cmNlbmFtZVxuICAgKiBAZGVmYXVsdCAtIG5vIHBhcnRuZXIgZXZlbnQgc291cmNlXG4gICAqL1xuICByZWFkb25seSBldmVudFNvdXJjZU5hbWU/OiBzdHJpbmc7XG59XG5cbmFic3RyYWN0IGNsYXNzIEV2ZW50QnVzQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUV2ZW50QnVzIHtcbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBJRCBvZiB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGV2ZW50QnVzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBldmVudCBidXMsIHN1Y2ggYXM6XG4gICAqIGFybjphd3M6ZXZlbnRzOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZXZlbnQtYnVzL2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGV2ZW50QnVzQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgZm9yIHRoZSBldmVudCBidXMgaW4gSlNPTiBmb3JtLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGV2ZW50QnVzUG9saWN5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwYXJ0bmVyIGV2ZW50IHNvdXJjZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcblxuICBwdWJsaWMgYXJjaGl2ZShpZDogc3RyaW5nLCBwcm9wczogQmFzZUFyY2hpdmVQcm9wcyk6IEFyY2hpdmUge1xuICAgIHJldHVybiBuZXcgQXJjaGl2ZSh0aGlzLCBpZCwge1xuICAgICAgc291cmNlRXZlbnRCdXM6IHRoaXMsXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24gfHwgYEV2ZW50IEFyY2hpdmUgZm9yICR7dGhpcy5ldmVudEJ1c05hbWV9IEV2ZW50IEJ1c2AsXG4gICAgICBldmVudFBhdHRlcm46IHByb3BzLmV2ZW50UGF0dGVybixcbiAgICAgIHJldGVudGlvbjogcHJvcHMucmV0ZW50aW9uLFxuICAgICAgYXJjaGl2ZU5hbWU6IHByb3BzLmFyY2hpdmVOYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdyYW50UHV0RXZlbnRzVG8oZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5ldmVudEJ1c0Fybl0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYW4gRXZlbnRCcmlkZ2UgRXZlbnRCdXNcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFdmVudHM6OkV2ZW50QnVzXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50QnVzQmFzZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBldmVudCBidXMgcmVzb3VyY2VcbiAgICogQHBhcmFtIHNjb3BlIFBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIENvbnN0cnVjdCBJRFxuICAgKiBAcGFyYW0gZXZlbnRCdXNBcm4gQVJOIG9mIGltcG9ydGVkIGV2ZW50IGJ1c1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRXZlbnRCdXNBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZXZlbnRCdXNBcm46IHN0cmluZyk6IElFdmVudEJ1cyB7XG4gICAgY29uc3QgcGFydHMgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oZXZlbnRCdXNBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcblxuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRFdmVudEJ1cyhzY29wZSwgaWQsIHtcbiAgICAgIGV2ZW50QnVzQXJuOiBldmVudEJ1c0FybixcbiAgICAgIGV2ZW50QnVzTmFtZTogcGFydHMucmVzb3VyY2VOYW1lIHx8ICcnLFxuICAgICAgZXZlbnRCdXNQb2xpY3k6ICcnLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBldmVudCBidXMgcmVzb3VyY2VcbiAgICogQHBhcmFtIHNjb3BlIFBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIENvbnN0cnVjdCBJRFxuICAgKiBAcGFyYW0gZXZlbnRCdXNOYW1lIE5hbWUgb2YgaW1wb3J0ZWQgZXZlbnQgYnVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FdmVudEJ1c05hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZXZlbnRCdXNOYW1lOiBzdHJpbmcpOiBJRXZlbnRCdXMge1xuICAgIGNvbnN0IGV2ZW50QnVzQXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICByZXNvdXJjZTogJ2V2ZW50LWJ1cycsXG4gICAgICBzZXJ2aWNlOiAnZXZlbnRzJyxcbiAgICAgIHJlc291cmNlTmFtZTogZXZlbnRCdXNOYW1lLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEV2ZW50QnVzLmZyb21FdmVudEJ1c0F0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7XG4gICAgICBldmVudEJ1c05hbWU6IGV2ZW50QnVzTmFtZSxcbiAgICAgIGV2ZW50QnVzQXJuOiBldmVudEJ1c0FybixcbiAgICAgIGV2ZW50QnVzUG9saWN5OiAnJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqIEBwYXJhbSBzY29wZSBQYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBDb25zdHJ1Y3QgSURcbiAgICogQHBhcmFtIGF0dHJzIEltcG9ydGVkIGV2ZW50IGJ1cyBwcm9wZXJ0aWVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FdmVudEJ1c0F0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEV2ZW50QnVzQXR0cmlidXRlcyk6IElFdmVudEJ1cyB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZEV2ZW50QnVzKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcm1pdHMgYW4gSUFNIFByaW5jaXBhbCB0byBzZW5kIGN1c3RvbSBldmVudHMgdG8gRXZlbnRCcmlkZ2VcbiAgICogc28gdGhhdCB0aGV5IGNhbiBiZSBtYXRjaGVkIHRvIHJ1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBUaGUgcHJpbmNpcGFsIChuby1vcCBpZiB1bmRlZmluZWQpXG4gICAqIEBkZXByZWNhdGVkIHVzZSBncmFudEFsbFB1dEV2ZW50cyBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdyYW50UHV0RXZlbnRzKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICAvLyBJdCdzIGN1cnJlbnRseSBub3QgcG9zc2libGUgdG8gcmVzdHJpY3QgUHV0RXZlbnRzIHRvIHNwZWNpZmljIHJlc291cmNlcy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2V2ZW50YnJpZGdlL2xhdGVzdC91c2VyZ3VpZGUvcGVybWlzc2lvbnMtcmVmZXJlbmNlLWV2ZW50YnJpZGdlLmh0bWxcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ2V2ZW50czpQdXRFdmVudHMnXSxcbiAgICAgIHJlc291cmNlQXJuczogWycqJ10sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWl0cyBhbiBJQU0gUHJpbmNpcGFsIHRvIHNlbmQgY3VzdG9tIGV2ZW50cyB0byBFdmVudEJyaWRnZVxuICAgKiBzbyB0aGF0IHRoZXkgY2FuIGJlIG1hdGNoZWQgdG8gcnVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBwcmluY2lwYWwgKG5vLW9wIGlmIHVuZGVmaW5lZClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ3JhbnRBbGxQdXRFdmVudHMoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGV2ZW50QnVzUHJvcHMoZGVmYXVsdEV2ZW50QnVzTmFtZTogc3RyaW5nLCBwcm9wczogRXZlbnRCdXNQcm9wcyA9IHt9KSB7XG4gICAgY29uc3QgeyBldmVudEJ1c05hbWUsIGV2ZW50U291cmNlTmFtZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgZXZlbnRCdXNOYW1lUmVnZXggPSAvXltcXC9cXC5cXC1fQS1aYS16MC05XXsxLDI1Nn0kLztcblxuICAgIGlmIChldmVudEJ1c05hbWUgIT09IHVuZGVmaW5lZCAmJiBldmVudFNvdXJjZU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnXFwnZXZlbnRCdXNOYW1lXFwnIGFuZCBcXCdldmVudFNvdXJjZU5hbWVcXCcgY2Fubm90IGJvdGggYmUgcHJvdmlkZWQnLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnRCdXNOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGV2ZW50QnVzTmFtZSkpIHtcbiAgICAgICAgaWYgKGV2ZW50QnVzTmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ1xcJ2V2ZW50QnVzTmFtZVxcJyBtdXN0IG5vdCBiZSBcXCdkZWZhdWx0XFwnJyxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50QnVzTmFtZS5pbmRleE9mKCcvJykgPiAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdcXCdldmVudEJ1c05hbWVcXCcgbXVzdCBub3QgY29udGFpbiBcXCcvXFwnJyxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCFldmVudEJ1c05hbWVSZWdleC50ZXN0KGV2ZW50QnVzTmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgJ2V2ZW50QnVzTmFtZScgbXVzdCBzYXRpc2Z5OiAke2V2ZW50QnVzTmFtZVJlZ2V4fWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgZXZlbnRCdXNOYW1lIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50U291cmNlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChldmVudFNvdXJjZU5hbWUpKSB7XG4gICAgICAgIC8vIEV4OiBhd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMVxuICAgICAgICBjb25zdCBldmVudFNvdXJjZU5hbWVSZWdleCA9IC9eYXdzXFwucGFydG5lcihcXC9bXFwuXFwtX0EtWmEtejAtOV0rKXsyLH0kLztcbiAgICAgICAgaWYgKCFldmVudFNvdXJjZU5hbWVSZWdleC50ZXN0KGV2ZW50U291cmNlTmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgJ2V2ZW50U291cmNlTmFtZScgbXVzdCBzYXRpc2Z5OiAke2V2ZW50U291cmNlTmFtZVJlZ2V4fWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICghZXZlbnRCdXNOYW1lUmVnZXgudGVzdChldmVudFNvdXJjZU5hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYCdldmVudFNvdXJjZU5hbWUnIG11c3Qgc2F0aXNmeTogJHtldmVudEJ1c05hbWVSZWdleH1gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGV2ZW50QnVzTmFtZTogZXZlbnRTb3VyY2VOYW1lLCBldmVudFNvdXJjZU5hbWUgfTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBldmVudEJ1c05hbWU6IGRlZmF1bHRFdmVudEJ1c05hbWUgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgSUQgb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBldmVudEJ1c05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgZXZlbnQgYnVzLCBzdWNoIGFzOlxuICAgKiBhcm46YXdzOmV2ZW50czp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOmV2ZW50LWJ1cy9hd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBldmVudEJ1c0Fybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IGZvciB0aGUgZXZlbnQgYnVzIGluIEpTT04gZm9ybS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBldmVudEJ1c1BvbGljeTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcGFydG5lciBldmVudCBzb3VyY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBldmVudFNvdXJjZU5hbWU/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBwb2xpY3k/OiBFdmVudEJ1c1BvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IEV2ZW50QnVzUHJvcHMpIHtcbiAgICBjb25zdCB7IGV2ZW50QnVzTmFtZSwgZXZlbnRTb3VyY2VOYW1lIH0gPSBFdmVudEJ1cy5ldmVudEJ1c1Byb3BzKFxuICAgICAgTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBOYW1lcy51bmlxdWVJZCh0aGlzKSB9KSxcbiAgICAgIHByb3BzLFxuICAgICk7XG5cbiAgICBzdXBlcihzY29wZSwgaWQsIHsgcGh5c2ljYWxOYW1lOiBldmVudEJ1c05hbWUgfSk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBDZm5FdmVudEJ1cyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGV2ZW50U291cmNlTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRCdXNBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKGV2ZW50QnVzLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdldmVudHMnLFxuICAgICAgcmVzb3VyY2U6ICdldmVudC1idXMnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBldmVudEJ1cy5uYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEJ1c05hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShldmVudEJ1cy5yZWYpO1xuICAgIHRoaXMuZXZlbnRCdXNQb2xpY3kgPSBldmVudEJ1cy5hdHRyUG9saWN5O1xuICAgIHRoaXMuZXZlbnRTb3VyY2VOYW1lID0gZXZlbnRCdXMuZXZlbnRTb3VyY2VOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIElBTSByZXNvdXJjZSBwb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgYnVzLlxuICAgKi9cbiAgcHVibGljIGFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQge1xuICAgIGlmIChzdGF0ZW1lbnQuc2lkID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgQnVzIHBvbGljeSBzdGF0ZW1lbnRzIG11c3QgaGF2ZSBhIHNpZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBvbGljeSkge1xuICAgICAgLy8gVGhlIHBvbGljeSBjYW4gY29udGFpbiBvbmx5IG9uZSBzdGF0ZW1lbnRcbiAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIHRoaXMucG9saWN5ID0gbmV3IEV2ZW50QnVzUG9saWN5KHRoaXMsICdQb2xpY3knLCB7XG4gICAgICBldmVudEJ1czogdGhpcyxcbiAgICAgIHN0YXRlbWVudDogc3RhdGVtZW50LnRvSlNPTigpLFxuICAgICAgc3RhdGVtZW50SWQ6IHN0YXRlbWVudC5zaWQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5wb2xpY3kgfTtcbiAgfVxufVxuXG5jbGFzcyBJbXBvcnRlZEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRCdXNCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBldmVudEJ1c05hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzUG9saWN5OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBldmVudFNvdXJjZU5hbWU/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEV2ZW50QnVzQXR0cmlidXRlcykge1xuICAgIGNvbnN0IGFyblBhcnRzID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGF0dHJzLmV2ZW50QnVzQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBhY2NvdW50OiBhcm5QYXJ0cy5hY2NvdW50LFxuICAgICAgcmVnaW9uOiBhcm5QYXJ0cy5yZWdpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50QnVzQXJuID0gYXR0cnMuZXZlbnRCdXNBcm47XG4gICAgdGhpcy5ldmVudEJ1c05hbWUgPSBhdHRycy5ldmVudEJ1c05hbWU7XG4gICAgdGhpcy5ldmVudEJ1c1BvbGljeSA9IGF0dHJzLmV2ZW50QnVzUG9saWN5O1xuICAgIHRoaXMuZXZlbnRTb3VyY2VOYW1lID0gYXR0cnMuZXZlbnRTb3VyY2VOYW1lO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBhc3NvY2lhdGUgRXZlbnQgQnVzZXMgd2l0aCBhIHBvbGljeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnVzUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIGV2ZW50IGJ1cyB0byB3aGljaCB0aGUgcG9saWN5IGFwcGxpZXNcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50QnVzOiBJRXZlbnRCdXM7XG5cbiAgLyoqXG4gICAqIEFuIElBTSBQb2xpY3kgU3RhdGVtZW50IHRvIGFwcGx5IHRvIHRoZSBFdmVudCBCdXNcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudDtcblxuICAvKipcbiAgICogQW4gaWRlbnRpZmllciBzdHJpbmcgZm9yIHRoZSBleHRlcm5hbCBhY2NvdW50IHRoYXRcbiAgICogeW91IGFyZSBncmFudGluZyBwZXJtaXNzaW9ucyB0by5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlbWVudElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIHBvbGljeSBmb3IgYW4gRXZlbnQgQnVzXG4gKlxuICogUG9saWNpZXMgZGVmaW5lIHRoZSBvcGVyYXRpb25zIHRoYXQgYXJlIGFsbG93ZWQgb24gdGhpcyByZXNvdXJjZS5cbiAqXG4gKiBZb3UgYWxtb3N0IG5ldmVyIG5lZWQgdG8gZGVmaW5lIHRoaXMgY29uc3RydWN0IGRpcmVjdGx5LlxuICpcbiAqIEFsbCBBV1MgcmVzb3VyY2VzIHRoYXQgc3VwcG9ydCByZXNvdXJjZSBwb2xpY2llcyBoYXZlIGEgbWV0aG9kIGNhbGxlZFxuICogYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAsIHdoaWNoIHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYSBuZXcgcmVzb3VyY2VcbiAqIHBvbGljeSBpZiBvbmUgZG9lc24ndCBleGlzdCB5ZXQsIG90aGVyd2lzZSBpdCB3aWxsIGFkZCB0byB0aGUgZXhpc3RpbmdcbiAqIHBvbGljeS5cbiAqXG4gKiBQcmVmZXIgdG8gdXNlIGBhZGRUb1Jlc291cmNlUG9saWN5KClgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEJ1c1BvbGljeSBleHRlbmRzIFJlc291cmNlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEV2ZW50QnVzUG9saWN5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IENmbkV2ZW50QnVzUG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHN0YXRlbWVudElkOiBwcm9wcy5zdGF0ZW1lbnRJZCEsXG4gICAgICBzdGF0ZW1lbnQ6IHByb3BzLnN0YXRlbWVudCxcbiAgICAgIGV2ZW50QnVzTmFtZTogcHJvcHMuZXZlbnRCdXMuZXZlbnRCdXNOYW1lLFxuICAgIH0pO1xuICB9XG59Il19