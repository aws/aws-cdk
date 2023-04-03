"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationListenerRule = exports.ContentType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const application_listener_action_1 = require("./application-listener-action");
const elasticloadbalancingv2_generated_1 = require("../elasticloadbalancingv2.generated");
/**
 * The content type for a fixed response
 * @deprecated superceded by `FixedResponseOptions`.
 */
var ContentType;
(function (ContentType) {
    ContentType["TEXT_PLAIN"] = "text/plain";
    ContentType["TEXT_CSS"] = "text/css";
    ContentType["TEXT_HTML"] = "text/html";
    ContentType["APPLICATION_JAVASCRIPT"] = "application/javascript";
    ContentType["APPLICATION_JSON"] = "application/json";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
/**
 * Define a new listener rule
 */
class ApplicationListenerRule extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.legacyConditions = {};
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationListenerRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApplicationListenerRule);
            }
            throw error;
        }
        this.conditions = props.conditions || [];
        const hasPathPatterns = props.pathPatterns || props.pathPattern;
        if (this.conditions.length === 0 && !props.hostHeader && !hasPathPatterns) {
            throw new Error('At least one of \'conditions\', \'hostHeader\', \'pathPattern\' or \'pathPatterns\' is required when defining a load balancing rule.');
        }
        const possibleActions = ['action', 'targetGroups', 'fixedResponse', 'redirectResponse'];
        const providedActions = possibleActions.filter(action => props[action] !== undefined);
        if (providedActions.length > 1) {
            throw new Error(`'${providedActions}' specified together, specify only one`);
        }
        if (!cdk.Token.isUnresolved(props.priority) && props.priority <= 0) {
            throw new Error('Priority must have value greater than or equal to 1');
        }
        this.listener = props.listener;
        const resource = new elasticloadbalancingv2_generated_1.CfnListenerRule(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            priority: props.priority,
            conditions: cdk.Lazy.any({ produce: () => this.renderConditions() }),
            actions: cdk.Lazy.any({ produce: () => this.action ? this.action.renderActions() : [] }),
        });
        if (props.hostHeader) {
            this.setCondition('host-header', [props.hostHeader]);
        }
        if (hasPathPatterns) {
            if (props.pathPattern && props.pathPatterns) {
                throw new Error('Both `pathPatterns` and `pathPattern` are specified, specify only one');
            }
            const pathPattern = props.pathPattern ? [props.pathPattern] : props.pathPatterns;
            this.setCondition('path-pattern', pathPattern);
        }
        if (props.action) {
            this.configureAction(props.action);
        }
        (props.targetGroups || []).forEach((group) => {
            this.configureAction(application_listener_action_1.ListenerAction.forward([group]));
        });
        if (props.fixedResponse) {
            this.addFixedResponse(props.fixedResponse);
        }
        else if (props.redirectResponse) {
            this.addRedirectResponse(props.redirectResponse);
        }
        this.listenerRuleArn = resource.ref;
        this.node.addValidation({ validate: () => this.validateListenerRule() });
    }
    /**
     * Add a non-standard condition to this rule
     *
     * If the condition conflicts with an already set condition, it will be overwritten by the one you specified.
     *
     * @deprecated use `addCondition` instead.
     */
    setCondition(field, values) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerRule#setCondition", "use `addCondition` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.setCondition);
            }
            throw error;
        }
        if (values === undefined) {
            delete this.legacyConditions[field];
            return;
        }
        this.legacyConditions[field] = values;
    }
    /**
     * Add a non-standard condition to this rule
     */
    addCondition(condition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ListenerCondition(condition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCondition);
            }
            throw error;
        }
        this.conditions.push(condition);
    }
    /**
     * Configure the action to perform for this rule
     */
    configureAction(action) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ListenerAction(action);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureAction);
            }
            throw error;
        }
        // It might make sense to 'throw' here.
        //
        // However, programs may already exist out there which configured an action twice,
        // in which case the second action accidentally overwrite the initial action, and in some
        // way ended up with a program that did what the author intended. If we were to add throw now,
        // the previously working program would be broken.
        //
        // Instead, signal this through a warning.
        // @deprecate: upon the next major version bump, replace this with a `throw`
        if (this.action) {
            cdk.Annotations.of(this).addWarning('An Action already existed on this ListenerRule and was replaced. Configure exactly one default Action.');
        }
        action.bind(this, this.listener, this);
        this.action = action;
    }
    /**
     * Add a TargetGroup to load balance to
     *
     * @deprecated Use configureAction instead
     */
    addTargetGroup(targetGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerRule#addTargetGroup", "Use configureAction instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationTargetGroup(targetGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargetGroup);
            }
            throw error;
        }
        this.configureAction(application_listener_action_1.ListenerAction.forward([targetGroup]));
    }
    /**
     * Add a fixed response
     *
     * @deprecated Use configureAction instead
     */
    addFixedResponse(fixedResponse) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerRule#addFixedResponse", "Use configureAction instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_FixedResponse(fixedResponse);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFixedResponse);
            }
            throw error;
        }
        validateFixedResponse(fixedResponse);
        this.configureAction(application_listener_action_1.ListenerAction.fixedResponse(cdk.Token.asNumber(fixedResponse.statusCode), {
            contentType: fixedResponse.contentType,
            messageBody: fixedResponse.messageBody,
        }));
    }
    /**
     * Add a redirect response
     *
     * @deprecated Use configureAction instead
     */
    addRedirectResponse(redirectResponse) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerRule#addRedirectResponse", "Use configureAction instead");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_RedirectResponse(redirectResponse);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRedirectResponse);
            }
            throw error;
        }
        validateRedirectResponse(redirectResponse);
        this.configureAction(application_listener_action_1.ListenerAction.redirect({
            host: redirectResponse.host,
            path: redirectResponse.path,
            permanent: redirectResponse.statusCode === 'HTTP_301',
            port: redirectResponse.port,
            protocol: redirectResponse.protocol,
            query: redirectResponse.query,
        }));
    }
    /**
     * Validate the rule
     */
    validateListenerRule() {
        if (this.action === undefined) {
            return ['Listener rule needs at least one action'];
        }
        const legacyConditionFields = Object.keys(this.legacyConditions);
        if (legacyConditionFields.length === 0 && this.conditions.length === 0) {
            return ['Listener rule needs at least one condition'];
        }
        return [];
    }
    /**
     * Render the conditions for this rule
     */
    renderConditions() {
        const legacyConditions = Object.entries(this.legacyConditions).map(([field, values]) => {
            return { field, values };
        });
        const conditions = this.conditions.map(condition => condition.renderRawCondition());
        return [
            ...legacyConditions,
            ...conditions,
        ];
    }
}
exports.ApplicationListenerRule = ApplicationListenerRule;
_a = JSII_RTTI_SYMBOL_1;
ApplicationListenerRule[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerRule", version: "0.0.0" };
/**
 * Validate the status code and message body of a fixed response
 * @internal
 * @deprecated
 */
function validateFixedResponse(fixedResponse) {
    if (fixedResponse.statusCode && !/^(2|4|5)\d\d$/.test(fixedResponse.statusCode)) {
        throw new Error('`statusCode` must be 2XX, 4XX or 5XX.');
    }
    if (fixedResponse.messageBody && fixedResponse.messageBody.length > 1024) {
        throw new Error('`messageBody` cannot have more than 1024 characters.');
    }
}
/**
 * Validate the status code and message body of a redirect response
 * @internal
 * @deprecated
 */
function validateRedirectResponse(redirectResponse) {
    if (redirectResponse.protocol && !/^(HTTPS?|#\{protocol\})$/i.test(redirectResponse.protocol)) {
        throw new Error('`protocol` must be HTTP, HTTPS, or #{protocol}.');
    }
    if (!redirectResponse.statusCode || !/^HTTP_30[12]$/.test(redirectResponse.statusCode)) {
        throw new Error('`statusCode` must be HTTP_301 or HTTP_302.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbGlzdGVuZXItcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLWxpc3RlbmVyLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUF1QztBQUV2QywrRUFBK0Q7QUFHL0QsMEZBQXNFO0FBNEd0RTs7O0dBR0c7QUFDSCxJQUFZLFdBTVg7QUFORCxXQUFZLFdBQVc7SUFDckIsd0NBQXlCLENBQUE7SUFDekIsb0NBQXFCLENBQUE7SUFDckIsc0NBQXVCLENBQUE7SUFDdkIsZ0VBQWlELENBQUE7SUFDakQsb0RBQXFDLENBQUE7QUFDdkMsQ0FBQyxFQU5XLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTXRCO0FBd0VEOztHQUVHO0FBQ0gsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQVlwRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFORixxQkFBZ0IsR0FBOEIsRUFBRSxDQUFDOzs7Ozs7K0NBUHZELHVCQUF1Qjs7OztRQWVoQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBRXpDLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNoRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzSUFBc0ksQ0FBQyxDQUFDO1NBQ3pKO1FBRUQsTUFBTSxlQUFlLEdBQThDLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuSSxNQUFNLGVBQWUsR0FBRyxlQUFlLENB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QUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0tBQy9EO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUFwcGxpY2F0aW9uTGlzdGVuZXIgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWxpc3RlbmVyJztcbmltcG9ydCB7IExpc3RlbmVyQWN0aW9uIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1saXN0ZW5lci1hY3Rpb24nO1xuaW1wb3J0IHsgSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAgfSBmcm9tICcuL2FwcGxpY2F0aW9uLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBMaXN0ZW5lckNvbmRpdGlvbiB9IGZyb20gJy4vY29uZGl0aW9ucyc7XG5pbXBvcnQgeyBDZm5MaXN0ZW5lclJ1bGUgfSBmcm9tICcuLi9lbGFzdGljbG9hZGJhbGFuY2luZ3YyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJTGlzdGVuZXJBY3Rpb24gfSBmcm9tICcuLi9zaGFyZWQvbGlzdGVuZXItYWN0aW9uJztcblxuLyoqXG4gKiBCYXNpYyBwcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIHJ1bGUgb24gYSBsaXN0ZW5lclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VBcHBsaWNhdGlvbkxpc3RlbmVyUnVsZVByb3BzIHtcbiAgLyoqXG4gICAqIFByaW9yaXR5IG9mIHRoZSBydWxlXG4gICAqXG4gICAqIFRoZSBydWxlIHdpdGggdGhlIGxvd2VzdCBwcmlvcml0eSB3aWxsIGJlIHVzZWQgZm9yIGV2ZXJ5IHJlcXVlc3QuXG4gICAqXG4gICAqIFByaW9yaXRpZXMgbXVzdCBiZSB1bmlxdWUuXG4gICAqL1xuICByZWFkb25seSBwcmlvcml0eTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUYXJnZXQgZ3JvdXBzIHRvIGZvcndhcmQgcmVxdWVzdHMgdG8uXG4gICAqXG4gICAqIE9ubHkgb25lIG9mIGBhY3Rpb25gLCBgZml4ZWRSZXNwb25zZWAsIGByZWRpcmVjdFJlc3BvbnNlYCBvciBgdGFyZ2V0R3JvdXBzYCBjYW4gYmUgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBJbXBsaWVzIGEgYGZvcndhcmRgIGFjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB0YXJnZXQgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXBzPzogSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXBbXTtcblxuICAvKipcbiAgICogQWN0aW9uIHRvIHBlcmZvcm0gd2hlbiByZXF1ZXN0cyBhcmUgcmVjZWl2ZWRcbiAgICpcbiAgICogT25seSBvbmUgb2YgYGFjdGlvbmAsIGBmaXhlZFJlc3BvbnNlYCwgYHJlZGlyZWN0UmVzcG9uc2VgIG9yIGB0YXJnZXRHcm91cHNgIGNhbiBiZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWN0aW9uXG4gICAqL1xuICByZWFkb25seSBhY3Rpb24/OiBMaXN0ZW5lckFjdGlvbjtcblxuICAvKipcbiAgICogRml4ZWQgcmVzcG9uc2UgdG8gcmV0dXJuLlxuICAgKlxuICAgKiBPbmx5IG9uZSBvZiBgYWN0aW9uYCwgYGZpeGVkUmVzcG9uc2VgLCBgcmVkaXJlY3RSZXNwb25zZWAgb3IgYHRhcmdldEdyb3Vwc2AgY2FuIGJlIHNwZWNpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaXhlZCByZXNwb25zZS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhY3Rpb25gIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBmaXhlZFJlc3BvbnNlPzogRml4ZWRSZXNwb25zZTtcblxuICAvKipcbiAgICogUmVkaXJlY3QgcmVzcG9uc2UgdG8gcmV0dXJuLlxuICAgKlxuICAgKiBPbmx5IG9uZSBvZiBgYWN0aW9uYCwgYGZpeGVkUmVzcG9uc2VgLCBgcmVkaXJlY3RSZXNwb25zZWAgb3IgYHRhcmdldEdyb3Vwc2AgY2FuIGJlIHNwZWNpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByZWRpcmVjdCByZXNwb25zZS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhY3Rpb25gIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSByZWRpcmVjdFJlc3BvbnNlPzogUmVkaXJlY3RSZXNwb25zZTtcblxuICAvKipcbiAgICogUnVsZSBhcHBsaWVzIGlmIG1hdGNoZXMgdGhlIGNvbmRpdGlvbnMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNsb2FkYmFsYW5jaW5nL2xhdGVzdC9hcHBsaWNhdGlvbi9sb2FkLWJhbGFuY2VyLWxpc3RlbmVycy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uZGl0aW9ucy5cbiAgICovXG4gIHJlYWRvbmx5IGNvbmRpdGlvbnM/OiBMaXN0ZW5lckNvbmRpdGlvbltdO1xuXG4gIC8qKlxuICAgKiBSdWxlIGFwcGxpZXMgaWYgdGhlIHJlcXVlc3RlZCBob3N0IG1hdGNoZXMgdGhlIGluZGljYXRlZCBob3N0XG4gICAqXG4gICAqIE1heSBjb250YWluIHVwIHRvIHRocmVlICcqJyB3aWxkY2FyZHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNsb2FkYmFsYW5jaW5nL2xhdGVzdC9hcHBsaWNhdGlvbi9sb2FkLWJhbGFuY2VyLWxpc3RlbmVycy5odG1sI2hvc3QtY29uZGl0aW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGhvc3QgY29uZGl0aW9uLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGNvbmRpdGlvbnNgIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBob3N0SGVhZGVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSdWxlIGFwcGxpZXMgaWYgdGhlIHJlcXVlc3RlZCBwYXRoIG1hdGNoZXMgdGhlIGdpdmVuIHBhdGggcGF0dGVyblxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNwYXRoLWNvbmRpdGlvbnNcbiAgICogQGRlZmF1bHQgLSBObyBwYXRoIGNvbmRpdGlvbi5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBjb25kaXRpb25zYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aFBhdHRlcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJ1bGUgYXBwbGllcyBpZiB0aGUgcmVxdWVzdGVkIHBhdGggbWF0Y2hlcyBhbnkgb2YgdGhlIGdpdmVuIHBhdHRlcm5zLlxuICAgKlxuICAgKiBQYXRocyBtYXkgY29udGFpbiB1cCB0byB0aHJlZSAnKicgd2lsZGNhcmRzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNwYXRoLWNvbmRpdGlvbnNcbiAgICogQGRlZmF1bHQgLSBObyBwYXRoIGNvbmRpdGlvbnMuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY29uZGl0aW9uc2AgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHBhdGhQYXR0ZXJucz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgbGlzdGVuZXIgcnVsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlUHJvcHMgZXh0ZW5kcyBCYXNlQXBwbGljYXRpb25MaXN0ZW5lclJ1bGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbGlzdGVuZXIgdG8gYXR0YWNoIHRoZSBydWxlIHRvXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lcjogSUFwcGxpY2F0aW9uTGlzdGVuZXI7XG59XG5cbi8qKlxuICogVGhlIGNvbnRlbnQgdHlwZSBmb3IgYSBmaXhlZCByZXNwb25zZVxuICogQGRlcHJlY2F0ZWQgc3VwZXJjZWRlZCBieSBgRml4ZWRSZXNwb25zZU9wdGlvbnNgLlxuICovXG5leHBvcnQgZW51bSBDb250ZW50VHlwZSB7XG4gIFRFWFRfUExBSU4gPSAndGV4dC9wbGFpbicsXG4gIFRFWFRfQ1NTID0gJ3RleHQvY3NzJyxcbiAgVEVYVF9IVE1MID0gJ3RleHQvaHRtbCcsXG4gIEFQUExJQ0FUSU9OX0pBVkFTQ1JJUFQgPSAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXG4gIEFQUExJQ0FUSU9OX0pTT04gPSAnYXBwbGljYXRpb24vanNvbidcbn1cblxuLyoqXG4gKiBBIGZpeGVkIHJlc3BvbnNlXG4gKiBAZGVwcmVjYXRlZCBzdXBlcmNlZGVkIGJ5IGBMaXN0ZW5lckFjdGlvbi5maXhlZFJlc3BvbnNlKClgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpeGVkUmVzcG9uc2Uge1xuICAvKipcbiAgICogVGhlIEhUVFAgcmVzcG9uc2UgY29kZSAoMlhYLCA0WFggb3IgNVhYKVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdHVzQ29kZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudCB0eXBlXG4gICAqXG4gICAqIEBkZWZhdWx0IHRleHQvcGxhaW5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRUeXBlPzogQ29udGVudFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXNzYWdlXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIG1lc3NhZ2VcbiAgICovXG4gIHJlYWRvbmx5IG1lc3NhZ2VCb2R5Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgcmVkaXJlY3QgcmVzcG9uc2VcbiAqIEBkZXByZWNhdGVkIHN1cGVyY2VkZWQgYnkgYExpc3RlbmVyQWN0aW9uLnJlZGlyZWN0KClgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZGlyZWN0UmVzcG9uc2Uge1xuICAvKipcbiAgICogVGhlIGhvc3RuYW1lLiBUaGlzIGNvbXBvbmVudCBpcyBub3QgcGVyY2VudC1lbmNvZGVkLiBUaGUgaG9zdG5hbWUgY2FuIGNvbnRhaW4gI3tob3N0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgb3JpZ2luIGhvc3Qgb2YgcmVxdWVzdFxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBhYnNvbHV0ZSBwYXRoLCBzdGFydGluZyB3aXRoIHRoZSBsZWFkaW5nIFwiL1wiLiBUaGlzIGNvbXBvbmVudCBpcyBub3QgcGVyY2VudC1lbmNvZGVkLlxuICAgKiBUaGUgcGF0aCBjYW4gY29udGFpbiAje2hvc3R9LCAje3BhdGh9LCBhbmQgI3twb3J0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgb3JpZ2luIHBhdGggb2YgcmVxdWVzdFxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBwb3J0LiBZb3UgY2FuIHNwZWNpZnkgYSB2YWx1ZSBmcm9tIDEgdG8gNjU1MzUgb3IgI3twb3J0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgb3JpZ2luIHBvcnQgb2YgcmVxdWVzdFxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbC4gWW91IGNhbiBzcGVjaWZ5IEhUVFAsIEhUVFBTLCBvciAje3Byb3RvY29sfS4gWW91IGNhbiByZWRpcmVjdCBIVFRQIHRvIEhUVFAsXG4gICAqIEhUVFAgdG8gSFRUUFMsIGFuZCBIVFRQUyB0byBIVFRQUy4gWW91IGNhbm5vdCByZWRpcmVjdCBIVFRQUyB0byBIVFRQLlxuICAgKlxuICAgKiBAZGVmYXVsdCBvcmlnaW4gcHJvdG9jb2wgb2YgcmVxdWVzdFxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcXVlcnkgcGFyYW1ldGVycywgVVJMLWVuY29kZWQgd2hlbiBuZWNlc3NhcnksIGJ1dCBub3QgcGVyY2VudC1lbmNvZGVkLlxuICAgKiBEbyBub3QgaW5jbHVkZSB0aGUgbGVhZGluZyBcIj9cIiwgYXMgaXQgaXMgYXV0b21hdGljYWxseSBhZGRlZC5cbiAgICogWW91IGNhbiBzcGVjaWZ5IGFueSBvZiB0aGUgcmVzZXJ2ZWQga2V5d29yZHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IG9yaWdpbiBxdWVyeSBzdHJpbmcgb2YgcmVxdWVzdFxuICAgKi9cbiAgcmVhZG9ubHkgcXVlcnk/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgSFRUUCByZWRpcmVjdCBjb2RlIChIVFRQXzMwMSBvciBIVFRQXzMwMilcbiAgICovXG4gIHJlYWRvbmx5IHN0YXR1c0NvZGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBuZXcgbGlzdGVuZXIgcnVsZVxuICovXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25MaXN0ZW5lclJ1bGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIHJ1bGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsaXN0ZW5lclJ1bGVBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGNvbmRpdGlvbnM6IExpc3RlbmVyQ29uZGl0aW9uW107XG4gIHByaXZhdGUgcmVhZG9ubHkgbGVnYWN5Q29uZGl0aW9uczoge1trZXk6IHN0cmluZ106IHN0cmluZ1tdfSA9IHt9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXI6IElBcHBsaWNhdGlvbkxpc3RlbmVyO1xuICBwcml2YXRlIGFjdGlvbj86IElMaXN0ZW5lckFjdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBwbGljYXRpb25MaXN0ZW5lclJ1bGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmNvbmRpdGlvbnMgPSBwcm9wcy5jb25kaXRpb25zIHx8IFtdO1xuXG4gICAgY29uc3QgaGFzUGF0aFBhdHRlcm5zID0gcHJvcHMucGF0aFBhdHRlcm5zIHx8IHByb3BzLnBhdGhQYXR0ZXJuO1xuICAgIGlmICh0aGlzLmNvbmRpdGlvbnMubGVuZ3RoID09PSAwICYmICFwcm9wcy5ob3N0SGVhZGVyICYmICFoYXNQYXRoUGF0dGVybnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIFxcJ2NvbmRpdGlvbnNcXCcsIFxcJ2hvc3RIZWFkZXJcXCcsIFxcJ3BhdGhQYXR0ZXJuXFwnIG9yIFxcJ3BhdGhQYXR0ZXJuc1xcJyBpcyByZXF1aXJlZCB3aGVuIGRlZmluaW5nIGEgbG9hZCBiYWxhbmNpbmcgcnVsZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwb3NzaWJsZUFjdGlvbnM6IEFycmF5PGtleW9mIEFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlUHJvcHM+ID0gWydhY3Rpb24nLCAndGFyZ2V0R3JvdXBzJywgJ2ZpeGVkUmVzcG9uc2UnLCAncmVkaXJlY3RSZXNwb25zZSddO1xuICAgIGNvbnN0IHByb3ZpZGVkQWN0aW9ucyA9IHBvc3NpYmxlQWN0aW9ucy5maWx0ZXIoYWN0aW9uID0+IHByb3BzW2FjdGlvbl0gIT09IHVuZGVmaW5lZCk7XG4gICAgaWYgKHByb3ZpZGVkQWN0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke3Byb3ZpZGVkQWN0aW9uc30nIHNwZWNpZmllZCB0b2dldGhlciwgc3BlY2lmeSBvbmx5IG9uZWApO1xuICAgIH1cblxuICAgIGlmICghY2RrLlRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5wcmlvcml0eSkgJiYgcHJvcHMucHJpb3JpdHkgPD0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcmlvcml0eSBtdXN0IGhhdmUgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEnKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gcHJvcHMubGlzdGVuZXI7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5MaXN0ZW5lclJ1bGUodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbGlzdGVuZXJBcm46IHByb3BzLmxpc3RlbmVyLmxpc3RlbmVyQXJuLFxuICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgY29uZGl0aW9uczogY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJDb25kaXRpb25zKCkgfSksXG4gICAgICBhY3Rpb25zOiBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmFjdGlvbiA/IHRoaXMuYWN0aW9uLnJlbmRlckFjdGlvbnMoKSA6IFtdIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmhvc3RIZWFkZXIpIHtcbiAgICAgIHRoaXMuc2V0Q29uZGl0aW9uKCdob3N0LWhlYWRlcicsIFtwcm9wcy5ob3N0SGVhZGVyXSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc1BhdGhQYXR0ZXJucykge1xuICAgICAgaWYgKHByb3BzLnBhdGhQYXR0ZXJuICYmIHByb3BzLnBhdGhQYXR0ZXJucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGggYHBhdGhQYXR0ZXJuc2AgYW5kIGBwYXRoUGF0dGVybmAgYXJlIHNwZWNpZmllZCwgc3BlY2lmeSBvbmx5IG9uZScpO1xuICAgICAgfVxuICAgICAgY29uc3QgcGF0aFBhdHRlcm4gPSBwcm9wcy5wYXRoUGF0dGVybiA/IFtwcm9wcy5wYXRoUGF0dGVybl0gOiBwcm9wcy5wYXRoUGF0dGVybnM7XG4gICAgICB0aGlzLnNldENvbmRpdGlvbigncGF0aC1wYXR0ZXJuJywgcGF0aFBhdHRlcm4pO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5hY3Rpb24pIHtcbiAgICAgIHRoaXMuY29uZmlndXJlQWN0aW9uKHByb3BzLmFjdGlvbik7XG4gICAgfVxuXG4gICAgKHByb3BzLnRhcmdldEdyb3VwcyB8fCBbXSkuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgIHRoaXMuY29uZmlndXJlQWN0aW9uKExpc3RlbmVyQWN0aW9uLmZvcndhcmQoW2dyb3VwXSkpO1xuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmZpeGVkUmVzcG9uc2UpIHtcbiAgICAgIHRoaXMuYWRkRml4ZWRSZXNwb25zZShwcm9wcy5maXhlZFJlc3BvbnNlKTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLnJlZGlyZWN0UmVzcG9uc2UpIHtcbiAgICAgIHRoaXMuYWRkUmVkaXJlY3RSZXNwb25zZShwcm9wcy5yZWRpcmVjdFJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyUnVsZUFybiA9IHJlc291cmNlLnJlZjtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVMaXN0ZW5lclJ1bGUoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBub24tc3RhbmRhcmQgY29uZGl0aW9uIHRvIHRoaXMgcnVsZVxuICAgKlxuICAgKiBJZiB0aGUgY29uZGl0aW9uIGNvbmZsaWN0cyB3aXRoIGFuIGFscmVhZHkgc2V0IGNvbmRpdGlvbiwgaXQgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGUgb25lIHlvdSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYWRkQ29uZGl0aW9uYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHNldENvbmRpdGlvbihmaWVsZDogc3RyaW5nLCB2YWx1ZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKHZhbHVlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWxldGUgdGhpcy5sZWdhY3lDb25kaXRpb25zW2ZpZWxkXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxlZ2FjeUNvbmRpdGlvbnNbZmllbGRdID0gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5vbi1zdGFuZGFyZCBjb25kaXRpb24gdG8gdGhpcyBydWxlXG4gICAqL1xuICBwdWJsaWMgYWRkQ29uZGl0aW9uKGNvbmRpdGlvbjogTGlzdGVuZXJDb25kaXRpb24pIHtcbiAgICB0aGlzLmNvbmRpdGlvbnMucHVzaChjb25kaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aW9uIHRvIHBlcmZvcm0gZm9yIHRoaXMgcnVsZVxuICAgKi9cbiAgcHVibGljIGNvbmZpZ3VyZUFjdGlvbihhY3Rpb246IExpc3RlbmVyQWN0aW9uKSB7XG4gICAgLy8gSXQgbWlnaHQgbWFrZSBzZW5zZSB0byAndGhyb3cnIGhlcmUuXG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCBwcm9ncmFtcyBtYXkgYWxyZWFkeSBleGlzdCBvdXQgdGhlcmUgd2hpY2ggY29uZmlndXJlZCBhbiBhY3Rpb24gdHdpY2UsXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB0aGUgc2Vjb25kIGFjdGlvbiBhY2NpZGVudGFsbHkgb3ZlcndyaXRlIHRoZSBpbml0aWFsIGFjdGlvbiwgYW5kIGluIHNvbWVcbiAgICAvLyB3YXkgZW5kZWQgdXAgd2l0aCBhIHByb2dyYW0gdGhhdCBkaWQgd2hhdCB0aGUgYXV0aG9yIGludGVuZGVkLiBJZiB3ZSB3ZXJlIHRvIGFkZCB0aHJvdyBub3csXG4gICAgLy8gdGhlIHByZXZpb3VzbHkgd29ya2luZyBwcm9ncmFtIHdvdWxkIGJlIGJyb2tlbi5cbiAgICAvL1xuICAgIC8vIEluc3RlYWQsIHNpZ25hbCB0aGlzIHRocm91Z2ggYSB3YXJuaW5nLlxuICAgIC8vIEBkZXByZWNhdGU6IHVwb24gdGhlIG5leHQgbWFqb3IgdmVyc2lvbiBidW1wLCByZXBsYWNlIHRoaXMgd2l0aCBhIGB0aHJvd2BcbiAgICBpZiAodGhpcy5hY3Rpb24pIHtcbiAgICAgIGNkay5Bbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCdBbiBBY3Rpb24gYWxyZWFkeSBleGlzdGVkIG9uIHRoaXMgTGlzdGVuZXJSdWxlIGFuZCB3YXMgcmVwbGFjZWQuIENvbmZpZ3VyZSBleGFjdGx5IG9uZSBkZWZhdWx0IEFjdGlvbi4nKTtcbiAgICB9XG5cbiAgICBhY3Rpb24uYmluZCh0aGlzLCB0aGlzLmxpc3RlbmVyLCB0aGlzKTtcbiAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBUYXJnZXRHcm91cCB0byBsb2FkIGJhbGFuY2UgdG9cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGNvbmZpZ3VyZUFjdGlvbiBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgYWRkVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwKSB7XG4gICAgdGhpcy5jb25maWd1cmVBY3Rpb24oTGlzdGVuZXJBY3Rpb24uZm9yd2FyZChbdGFyZ2V0R3JvdXBdKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZml4ZWQgcmVzcG9uc2VcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGNvbmZpZ3VyZUFjdGlvbiBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgYWRkRml4ZWRSZXNwb25zZShmaXhlZFJlc3BvbnNlOiBGaXhlZFJlc3BvbnNlKSB7XG4gICAgdmFsaWRhdGVGaXhlZFJlc3BvbnNlKGZpeGVkUmVzcG9uc2UpO1xuXG4gICAgdGhpcy5jb25maWd1cmVBY3Rpb24oTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZShjZGsuVG9rZW4uYXNOdW1iZXIoZml4ZWRSZXNwb25zZS5zdGF0dXNDb2RlKSwge1xuICAgICAgY29udGVudFR5cGU6IGZpeGVkUmVzcG9uc2UuY29udGVudFR5cGUsXG4gICAgICBtZXNzYWdlQm9keTogZml4ZWRSZXNwb25zZS5tZXNzYWdlQm9keSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVkaXJlY3QgcmVzcG9uc2VcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGNvbmZpZ3VyZUFjdGlvbiBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgYWRkUmVkaXJlY3RSZXNwb25zZShyZWRpcmVjdFJlc3BvbnNlOiBSZWRpcmVjdFJlc3BvbnNlKSB7XG4gICAgdmFsaWRhdGVSZWRpcmVjdFJlc3BvbnNlKHJlZGlyZWN0UmVzcG9uc2UpO1xuXG4gICAgdGhpcy5jb25maWd1cmVBY3Rpb24oTGlzdGVuZXJBY3Rpb24ucmVkaXJlY3Qoe1xuICAgICAgaG9zdDogcmVkaXJlY3RSZXNwb25zZS5ob3N0LFxuICAgICAgcGF0aDogcmVkaXJlY3RSZXNwb25zZS5wYXRoLFxuICAgICAgcGVybWFuZW50OiByZWRpcmVjdFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09ICdIVFRQXzMwMScsXG4gICAgICBwb3J0OiByZWRpcmVjdFJlc3BvbnNlLnBvcnQsXG4gICAgICBwcm90b2NvbDogcmVkaXJlY3RSZXNwb25zZS5wcm90b2NvbCxcbiAgICAgIHF1ZXJ5OiByZWRpcmVjdFJlc3BvbnNlLnF1ZXJ5LFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGUgcnVsZVxuICAgKi9cbiAgcHJpdmF0ZSB2YWxpZGF0ZUxpc3RlbmVyUnVsZSgpIHtcbiAgICBpZiAodGhpcy5hY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFsnTGlzdGVuZXIgcnVsZSBuZWVkcyBhdCBsZWFzdCBvbmUgYWN0aW9uJ107XG4gICAgfVxuXG4gICAgY29uc3QgbGVnYWN5Q29uZGl0aW9uRmllbGRzID0gT2JqZWN0LmtleXModGhpcy5sZWdhY3lDb25kaXRpb25zKTtcbiAgICBpZiAobGVnYWN5Q29uZGl0aW9uRmllbGRzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmNvbmRpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gWydMaXN0ZW5lciBydWxlIG5lZWRzIGF0IGxlYXN0IG9uZSBjb25kaXRpb24nXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjb25kaXRpb25zIGZvciB0aGlzIHJ1bGVcbiAgICovXG4gIHByaXZhdGUgcmVuZGVyQ29uZGl0aW9ucygpOiBhbnkge1xuICAgIGNvbnN0IGxlZ2FjeUNvbmRpdGlvbnMgPSBPYmplY3QuZW50cmllcyh0aGlzLmxlZ2FjeUNvbmRpdGlvbnMpLm1hcCgoW2ZpZWxkLCB2YWx1ZXNdKSA9PiB7XG4gICAgICByZXR1cm4geyBmaWVsZCwgdmFsdWVzIH07XG4gICAgfSk7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IHRoaXMuY29uZGl0aW9ucy5tYXAoY29uZGl0aW9uID0+IGNvbmRpdGlvbi5yZW5kZXJSYXdDb25kaXRpb24oKSk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgLi4ubGVnYWN5Q29uZGl0aW9ucyxcbiAgICAgIC4uLmNvbmRpdGlvbnMsXG4gICAgXTtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBzdGF0dXMgY29kZSBhbmQgbWVzc2FnZSBib2R5IG9mIGEgZml4ZWQgcmVzcG9uc2VcbiAqIEBpbnRlcm5hbFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGaXhlZFJlc3BvbnNlKGZpeGVkUmVzcG9uc2U6IEZpeGVkUmVzcG9uc2UpIHtcbiAgaWYgKGZpeGVkUmVzcG9uc2Uuc3RhdHVzQ29kZSAmJiAhL14oMnw0fDUpXFxkXFxkJC8udGVzdChmaXhlZFJlc3BvbnNlLnN0YXR1c0NvZGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgc3RhdHVzQ29kZWAgbXVzdCBiZSAyWFgsIDRYWCBvciA1WFguJyk7XG4gIH1cblxuICBpZiAoZml4ZWRSZXNwb25zZS5tZXNzYWdlQm9keSAmJiBmaXhlZFJlc3BvbnNlLm1lc3NhZ2VCb2R5Lmxlbmd0aCA+IDEwMjQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BtZXNzYWdlQm9keWAgY2Fubm90IGhhdmUgbW9yZSB0aGFuIDEwMjQgY2hhcmFjdGVycy4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBzdGF0dXMgY29kZSBhbmQgbWVzc2FnZSBib2R5IG9mIGEgcmVkaXJlY3QgcmVzcG9uc2VcbiAqIEBpbnRlcm5hbFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVSZWRpcmVjdFJlc3BvbnNlKHJlZGlyZWN0UmVzcG9uc2U6IFJlZGlyZWN0UmVzcG9uc2UpIHtcbiAgaWYgKHJlZGlyZWN0UmVzcG9uc2UucHJvdG9jb2wgJiYgIS9eKEhUVFBTP3wjXFx7cHJvdG9jb2xcXH0pJC9pLnRlc3QocmVkaXJlY3RSZXNwb25zZS5wcm90b2NvbCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bwcm90b2NvbGAgbXVzdCBiZSBIVFRQLCBIVFRQUywgb3IgI3twcm90b2NvbH0uJyk7XG4gIH1cblxuICBpZiAoIXJlZGlyZWN0UmVzcG9uc2Uuc3RhdHVzQ29kZSB8fCAhL15IVFRQXzMwWzEyXSQvLnRlc3QocmVkaXJlY3RSZXNwb25zZS5zdGF0dXNDb2RlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYHN0YXR1c0NvZGVgIG11c3QgYmUgSFRUUF8zMDEgb3IgSFRUUF8zMDIuJyk7XG4gIH1cbn1cbiJdfQ==