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
exports.EventBus = EventBus;
_a = JSII_RTTI_SYMBOL_1;
EventBus[_a] = { fqn: "@aws-cdk/aws-events.EventBus", version: "0.0.0" };
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
exports.EventBusPolicy = EventBusPolicy;
_b = JSII_RTTI_SYMBOL_1;
EventBusPolicy[_b] = { fqn: "@aws-cdk/aws-events.EventBusPolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtYnVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnQtYnVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBMEY7QUFFMUYsdUNBQXNEO0FBQ3RELHlEQUFvRTtBQWdIcEUsTUFBZSxZQUFhLFNBQVEsZUFBUTtJQXNCbkMsT0FBTyxDQUFDLEVBQVUsRUFBRSxLQUF1QjtRQUNoRCxPQUFPLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLHFCQUFxQixJQUFJLENBQUMsWUFBWSxZQUFZO1lBQ3BGLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDMUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztLQUNKO0lBRU0sZ0JBQWdCLENBQUMsT0FBdUI7UUFDN0MsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDN0IsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNqQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsUUFBUyxTQUFRLFlBQVk7SUF1SnhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7Ozs7OzsrQ0F2SnBELFFBQVE7Ozs7UUF3SmpCLE1BQU0sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDOUQsV0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDcEQsS0FBSyxD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TUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztLQUM5QztDQUNGO0FBdUJEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxlQUFRO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQUZSLGNBQWM7Ozs7UUFJdkIsSUFBSSxvQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBWTtZQUMvQixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDMUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWTtTQUMxQyxDQUFDLENBQUM7S0FDSjs7QUFUSCx3Q0FVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEFybkZvcm1hdCwgSVJlc291cmNlLCBMYXp5LCBOYW1lcywgUmVzb3VyY2UsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcmNoaXZlLCBCYXNlQXJjaGl2ZVByb3BzIH0gZnJvbSAnLi9hcmNoaXZlJztcbmltcG9ydCB7IENmbkV2ZW50QnVzLCBDZm5FdmVudEJ1c1BvbGljeSB9IGZyb20gJy4vZXZlbnRzLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIHdoaWNoIGFsbCBFdmVudEJ1cyBiYXNlZCBjbGFzc2VzIE1VU1QgaW1wbGVtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUV2ZW50QnVzIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBJRCBvZiB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNjZm4tZXZlbnRzLWV2ZW50YnVzLW5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50QnVzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI0Fybi1mbjo6Z2V0YXR0XG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c0Fybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSlNPTiBwb2xpY3kgb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZXZlbnRzLWV2ZW50YnVzLmh0bWwjUG9saWN5LWZuOjpnZXRhdHRcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50QnVzUG9saWN5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJ0bmVyIGV2ZW50IHNvdXJjZSB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZXZlbnRzLWV2ZW50YnVzLmh0bWwjY2ZuLWV2ZW50cy1ldmVudGJ1cy1ldmVudHNvdXJjZW5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEV2ZW50QnJpZGdlIGFyY2hpdmUgdG8gc2VuZCBldmVudHMgdG8uXG4gICAqIFdoZW4geW91IGNyZWF0ZSBhbiBhcmNoaXZlLCBpbmNvbWluZyBldmVudHMgbWlnaHQgbm90IGltbWVkaWF0ZWx5IHN0YXJ0IGJlaW5nIHNlbnQgdG8gdGhlIGFyY2hpdmUuXG4gICAqIEFsbG93IGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgZm9yIGNoYW5nZXMgdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIG9mIHRoZSBhcmNoaXZlXG4gICAqL1xuICBhcmNoaXZlKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNlQXJjaGl2ZVByb3BzKTogQXJjaGl2ZTtcblxuICAvKipcbiAgICogR3JhbnRzIGFuIElBTSBQcmluY2lwYWwgdG8gc2VuZCBjdXN0b20gZXZlbnRzIHRvIHRoZSBldmVudEJ1c1xuICAgKiBzbyB0aGF0IHRoZXkgY2FuIGJlIG1hdGNoZWQgdG8gcnVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBwcmluY2lwYWwgKG5vLW9wIGlmIHVuZGVmaW5lZClcbiAgICovXG4gIGdyYW50UHV0RXZlbnRzVG8oZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBkZWZpbmUgYW4gZXZlbnQgYnVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgYnVzIHlvdSBhcmUgY3JlYXRpbmdcbiAgICogTm90ZTogSWYgJ2V2ZW50U291cmNlTmFtZScgaXMgcGFzc2VkIGluLCB5b3UgY2Fubm90IHNldCB0aGlzXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1ldmVudHMtZXZlbnRidXMuaHRtbCNjZm4tZXZlbnRzLWV2ZW50YnVzLW5hbWVcbiAgICogQGRlZmF1bHQgLSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c05hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJ0bmVyIGV2ZW50IHNvdXJjZSB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKiBOb3RlOiBJZiAnZXZlbnRCdXNOYW1lJyBpcyBwYXNzZWQgaW4sIHlvdSBjYW5ub3Qgc2V0IHRoaXNcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI2Nmbi1ldmVudHMtZXZlbnRidXMtZXZlbnRzb3VyY2VuYW1lXG4gICAqIEBkZWZhdWx0IC0gbm8gcGFydG5lciBldmVudCBzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2Ugd2l0aCBwcm9wZXJ0aWVzIG5lY2Vzc2FyeSB0byBpbXBvcnQgYSByZXVzYWJsZSBFdmVudEJ1c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QnVzQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgSUQgb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI2Nmbi1ldmVudHMtZXZlbnRidXMtbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI0Fybi1mbjo6Z2V0YXR0XG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c0Fybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSlNPTiBwb2xpY3kgb2YgdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI1BvbGljeS1mbjo6Z2V0YXR0XG4gICAqL1xuICByZWFkb25seSBldmVudEJ1c1BvbGljeTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFydG5lciBldmVudCBzb3VyY2UgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBldmVudCBidXMgcmVzb3VyY2VcbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWV2ZW50cy1ldmVudGJ1cy5odG1sI2Nmbi1ldmVudHMtZXZlbnRidXMtZXZlbnRzb3VyY2VuYW1lXG4gICAqIEBkZWZhdWx0IC0gbm8gcGFydG5lciBldmVudCBzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcbn1cblxuYWJzdHJhY3QgY2xhc3MgRXZlbnRCdXNCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRXZlbnRCdXMge1xuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIElEIG9mIHRoaXMgZXZlbnQgYnVzIHJlc291cmNlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnRCdXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGV2ZW50IGJ1cywgc3VjaCBhczpcbiAgICogYXJuOmF3czpldmVudHM6dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpldmVudC1idXMvYXdzLnBhcnRuZXIvUGFydG5lck5hbWUvYWNjdDEvcmVwbzEuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnRCdXNBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBvbGljeSBmb3IgdGhlIGV2ZW50IGJ1cyBpbiBKU09OIGZvcm0uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnRCdXNQb2xpY3k6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHBhcnRuZXIgZXZlbnQgc291cmNlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnRTb3VyY2VOYW1lPzogc3RyaW5nO1xuXG4gIHB1YmxpYyBhcmNoaXZlKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNlQXJjaGl2ZVByb3BzKTogQXJjaGl2ZSB7XG4gICAgcmV0dXJuIG5ldyBBcmNoaXZlKHRoaXMsIGlkLCB7XG4gICAgICBzb3VyY2VFdmVudEJ1czogdGhpcyxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbiB8fCBgRXZlbnQgQXJjaGl2ZSBmb3IgJHt0aGlzLmV2ZW50QnVzTmFtZX0gRXZlbnQgQnVzYCxcbiAgICAgIGV2ZW50UGF0dGVybjogcHJvcHMuZXZlbnRQYXR0ZXJuLFxuICAgICAgcmV0ZW50aW9uOiBwcm9wcy5yZXRlbnRpb24sXG4gICAgICBhcmNoaXZlTmFtZTogcHJvcHMuYXJjaGl2ZU5hbWUsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRQdXRFdmVudHNUbyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydldmVudHM6UHV0RXZlbnRzJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmV2ZW50QnVzQXJuXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhbiBFdmVudEJyaWRnZSBFdmVudEJ1c1xuICpcbiAqIEByZXNvdXJjZSBBV1M6OkV2ZW50czo6RXZlbnRCdXNcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRCdXNCYXNlIHtcblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKiBAcGFyYW0gc2NvcGUgUGFyZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgQ29uc3RydWN0IElEXG4gICAqIEBwYXJhbSBldmVudEJ1c0FybiBBUk4gb2YgaW1wb3J0ZWQgZXZlbnQgYnVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FdmVudEJ1c0FybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBldmVudEJ1c0Fybjogc3RyaW5nKTogSUV2ZW50QnVzIHtcbiAgICBjb25zdCBwYXJ0cyA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihldmVudEJ1c0FybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZEV2ZW50QnVzKHNjb3BlLCBpZCwge1xuICAgICAgZXZlbnRCdXNBcm46IGV2ZW50QnVzQXJuLFxuICAgICAgZXZlbnRCdXNOYW1lOiBwYXJ0cy5yZXNvdXJjZU5hbWUgfHwgJycsXG4gICAgICBldmVudEJ1c1BvbGljeTogJycsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKiBAcGFyYW0gc2NvcGUgUGFyZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgQ29uc3RydWN0IElEXG4gICAqIEBwYXJhbSBldmVudEJ1c05hbWUgTmFtZSBvZiBpbXBvcnRlZCBldmVudCBidXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUV2ZW50QnVzTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBldmVudEJ1c05hbWU6IHN0cmluZyk6IElFdmVudEJ1cyB7XG4gICAgY29uc3QgZXZlbnRCdXNBcm4gPSBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgIHJlc291cmNlOiAnZXZlbnQtYnVzJyxcbiAgICAgIHNlcnZpY2U6ICdldmVudHMnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBldmVudEJ1c05hbWUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXR0cmlidXRlcyhzY29wZSwgaWQsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogZXZlbnRCdXNOYW1lLFxuICAgICAgZXZlbnRCdXNBcm46IGV2ZW50QnVzQXJuLFxuICAgICAgZXZlbnRCdXNQb2xpY3k6ICcnLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBldmVudCBidXMgcmVzb3VyY2VcbiAgICogQHBhcmFtIHNjb3BlIFBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIENvbnN0cnVjdCBJRFxuICAgKiBAcGFyYW0gYXR0cnMgSW1wb3J0ZWQgZXZlbnQgYnVzIHByb3BlcnRpZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUV2ZW50QnVzQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogRXZlbnRCdXNBdHRyaWJ1dGVzKTogSUV2ZW50QnVzIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkRXZlbnRCdXMoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWl0cyBhbiBJQU0gUHJpbmNpcGFsIHRvIHNlbmQgY3VzdG9tIGV2ZW50cyB0byBFdmVudEJyaWRnZVxuICAgKiBzbyB0aGF0IHRoZXkgY2FuIGJlIG1hdGNoZWQgdG8gcnVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBwcmluY2lwYWwgKG5vLW9wIGlmIHVuZGVmaW5lZClcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGdyYW50QWxsUHV0RXZlbnRzIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ3JhbnRQdXRFdmVudHMoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIC8vIEl0J3MgY3VycmVudGx5IG5vdCBwb3NzaWJsZSB0byByZXN0cmljdCBQdXRFdmVudHMgdG8gc3BlY2lmaWMgcmVzb3VyY2VzLlxuICAgIC8vIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZXZlbnRicmlkZ2UvbGF0ZXN0L3VzZXJndWlkZS9wZXJtaXNzaW9ucy1yZWZlcmVuY2UtZXZlbnRicmlkZ2UuaHRtbFxuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJtaXRzIGFuIElBTSBQcmluY2lwYWwgdG8gc2VuZCBjdXN0b20gZXZlbnRzIHRvIEV2ZW50QnJpZGdlXG4gICAqIHNvIHRoYXQgdGhleSBjYW4gYmUgbWF0Y2hlZCB0byBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgVGhlIHByaW5jaXBhbCAobm8tb3AgaWYgdW5kZWZpbmVkKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBncmFudEFsbFB1dEV2ZW50cyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydldmVudHM6UHV0RXZlbnRzJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZXZlbnRCdXNQcm9wcyhkZWZhdWx0RXZlbnRCdXNOYW1lOiBzdHJpbmcsIHByb3BzOiBFdmVudEJ1c1Byb3BzID0ge30pIHtcbiAgICBjb25zdCB7IGV2ZW50QnVzTmFtZSwgZXZlbnRTb3VyY2VOYW1lIH0gPSBwcm9wcztcbiAgICBjb25zdCBldmVudEJ1c05hbWVSZWdleCA9IC9eW1xcL1xcLlxcLV9BLVphLXowLTldezEsMjU2fSQvO1xuXG4gICAgaWYgKGV2ZW50QnVzTmFtZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50U291cmNlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdcXCdldmVudEJ1c05hbWVcXCcgYW5kIFxcJ2V2ZW50U291cmNlTmFtZVxcJyBjYW5ub3QgYm90aCBiZSBwcm92aWRlZCcsXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChldmVudEJ1c05hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoZXZlbnRCdXNOYW1lKSkge1xuICAgICAgICBpZiAoZXZlbnRCdXNOYW1lID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnXFwnZXZlbnRCdXNOYW1lXFwnIG11c3Qgbm90IGJlIFxcJ2RlZmF1bHRcXCcnLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRCdXNOYW1lLmluZGV4T2YoJy8nKSA+IC0xKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ1xcJ2V2ZW50QnVzTmFtZVxcJyBtdXN0IG5vdCBjb250YWluIFxcJy9cXCcnLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWV2ZW50QnVzTmFtZVJlZ2V4LnRlc3QoZXZlbnRCdXNOYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGAnZXZlbnRCdXNOYW1lJyBtdXN0IHNhdGlzZnk6ICR7ZXZlbnRCdXNOYW1lUmVnZXh9YCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBldmVudEJ1c05hbWUgfTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnRTb3VyY2VOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGV2ZW50U291cmNlTmFtZSkpIHtcbiAgICAgICAgLy8gRXg6IGF3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xXG4gICAgICAgIGNvbnN0IGV2ZW50U291cmNlTmFtZVJlZ2V4ID0gL15hd3NcXC5wYXJ0bmVyKFxcL1tcXC5cXC1fQS1aYS16MC05XSspezIsfSQvO1xuICAgICAgICBpZiAoIWV2ZW50U291cmNlTmFtZVJlZ2V4LnRlc3QoZXZlbnRTb3VyY2VOYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGAnZXZlbnRTb3VyY2VOYW1lJyBtdXN0IHNhdGlzZnk6ICR7ZXZlbnRTb3VyY2VOYW1lUmVnZXh9YCxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCFldmVudEJ1c05hbWVSZWdleC50ZXN0KGV2ZW50U291cmNlTmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgJ2V2ZW50U291cmNlTmFtZScgbXVzdCBzYXRpc2Z5OiAke2V2ZW50QnVzTmFtZVJlZ2V4fWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgZXZlbnRCdXNOYW1lOiBldmVudFNvdXJjZU5hbWUsIGV2ZW50U291cmNlTmFtZSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IGV2ZW50QnVzTmFtZTogZGVmYXVsdEV2ZW50QnVzTmFtZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBJRCBvZiB0aGlzIGV2ZW50IGJ1cyByZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBldmVudCBidXMsIHN1Y2ggYXM6XG4gICAqIGFybjphd3M6ZXZlbnRzOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZXZlbnQtYnVzL2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgZm9yIHRoZSBldmVudCBidXMgaW4gSlNPTiBmb3JtLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzUG9saWN5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwYXJ0bmVyIGV2ZW50IHNvdXJjZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcblxuICBwcml2YXRlIHBvbGljeT86IEV2ZW50QnVzUG9saWN5O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogRXZlbnRCdXNQcm9wcykge1xuICAgIGNvbnN0IHsgZXZlbnRCdXNOYW1lLCBldmVudFNvdXJjZU5hbWUgfSA9IEV2ZW50QnVzLmV2ZW50QnVzUHJvcHMoXG4gICAgICBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IE5hbWVzLnVuaXF1ZUlkKHRoaXMpIH0pLFxuICAgICAgcHJvcHMsXG4gICAgKTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyBwaHlzaWNhbE5hbWU6IGV2ZW50QnVzTmFtZSB9KTtcblxuICAgIGNvbnN0IGV2ZW50QnVzID0gbmV3IENmbkV2ZW50QnVzKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgZXZlbnRTb3VyY2VOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEJ1c0FybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUoZXZlbnRCdXMuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2V2ZW50cycsXG4gICAgICByZXNvdXJjZTogJ2V2ZW50LWJ1cycsXG4gICAgICByZXNvdXJjZU5hbWU6IGV2ZW50QnVzLm5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50QnVzTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGV2ZW50QnVzLnJlZik7XG4gICAgdGhpcy5ldmVudEJ1c1BvbGljeSA9IGV2ZW50QnVzLmF0dHJQb2xpY3k7XG4gICAgdGhpcy5ldmVudFNvdXJjZU5hbWUgPSBldmVudEJ1cy5ldmVudFNvdXJjZU5hbWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgSUFNIHJlc291cmNlIHBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCBidXMuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgaWYgKHN0YXRlbWVudC5zaWQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBCdXMgcG9saWN5IHN0YXRlbWVudHMgbXVzdCBoYXZlIGEgc2lkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9saWN5KSB7XG4gICAgICAvLyBUaGUgcG9saWN5IGNhbiBjb250YWluIG9ubHkgb25lIHN0YXRlbWVudFxuICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgdGhpcy5wb2xpY3kgPSBuZXcgRXZlbnRCdXNQb2xpY3kodGhpcywgJ1BvbGljeScsIHtcbiAgICAgIGV2ZW50QnVzOiB0aGlzLFxuICAgICAgc3RhdGVtZW50OiBzdGF0ZW1lbnQudG9KU09OKCksXG4gICAgICBzdGF0ZW1lbnRJZDogc3RhdGVtZW50LnNpZCxcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICB9XG59XG5cbmNsYXNzIEltcG9ydGVkRXZlbnRCdXMgZXh0ZW5kcyBFdmVudEJ1c0Jhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRCdXNBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRCdXNQb2xpY3k6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50U291cmNlTmFtZT86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogRXZlbnRCdXNBdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXJuUGFydHMgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oYXR0cnMuZXZlbnRCdXNBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGFjY291bnQ6IGFyblBhcnRzLmFjY291bnQsXG4gICAgICByZWdpb246IGFyblBhcnRzLnJlZ2lvbixcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRCdXNBcm4gPSBhdHRycy5ldmVudEJ1c0FybjtcbiAgICB0aGlzLmV2ZW50QnVzTmFtZSA9IGF0dHJzLmV2ZW50QnVzTmFtZTtcbiAgICB0aGlzLmV2ZW50QnVzUG9saWN5ID0gYXR0cnMuZXZlbnRCdXNQb2xpY3k7XG4gICAgdGhpcy5ldmVudFNvdXJjZU5hbWUgPSBhdHRycy5ldmVudFNvdXJjZU5hbWU7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGFzc29jaWF0ZSBFdmVudCBCdXNlcyB3aXRoIGEgcG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCdXNQb2xpY3lQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgYnVzIHRvIHdoaWNoIHRoZSBwb2xpY3kgYXBwbGllc1xuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRCdXM6IElFdmVudEJ1cztcblxuICAvKipcbiAgICogQW4gSUFNIFBvbGljeSBTdGF0ZW1lbnQgdG8gYXBwbHkgdG8gdGhlIEV2ZW50IEJ1c1xuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50O1xuXG4gIC8qKlxuICAgKiBBbiBpZGVudGlmaWVyIHN0cmluZyBmb3IgdGhlIGV4dGVybmFsIGFjY291bnQgdGhhdFxuICAgKiB5b3UgYXJlIGdyYW50aW5nIHBlcm1pc3Npb25zIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50SWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgcG9saWN5IGZvciBhbiBFdmVudCBCdXNcbiAqXG4gKiBQb2xpY2llcyBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIFlvdSBhbG1vc3QgbmV2ZXIgbmVlZCB0byBkZWZpbmUgdGhpcyBjb25zdHJ1Y3QgZGlyZWN0bHkuXG4gKlxuICogQWxsIEFXUyByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHJlc291cmNlIHBvbGljaWVzIGhhdmUgYSBtZXRob2QgY2FsbGVkXG4gKiBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCwgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIG5ldyByZXNvdXJjZVxuICogcG9saWN5IGlmIG9uZSBkb2Vzbid0IGV4aXN0IHlldCwgb3RoZXJ3aXNlIGl0IHdpbGwgYWRkIHRvIHRoZSBleGlzdGluZ1xuICogcG9saWN5LlxuICpcbiAqIFByZWZlciB0byB1c2UgYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50QnVzUG9saWN5IGV4dGVuZHMgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRXZlbnRCdXNQb2xpY3lQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgQ2ZuRXZlbnRCdXNQb2xpY3kodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc3RhdGVtZW50SWQ6IHByb3BzLnN0YXRlbWVudElkISxcbiAgICAgIHN0YXRlbWVudDogcHJvcHMuc3RhdGVtZW50LFxuICAgICAgZXZlbnRCdXNOYW1lOiBwcm9wcy5ldmVudEJ1cy5ldmVudEJ1c05hbWUsXG4gICAgfSk7XG4gIH1cbn0iXX0=