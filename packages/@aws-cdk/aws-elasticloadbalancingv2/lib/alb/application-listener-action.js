"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedAction = exports.ListenerAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
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
 *
 * (Called `ListenerAction` instead of the more strictly correct
 * `ListenerAction` because this is the class most users interact
 * with, and we want to make it not too visually overwhelming).
 */
class ListenerAction {
    /**
     * Create an instance of ListenerAction
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
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ListenerAction(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ListenerAction);
            }
            throw error;
        }
    }
    /**
     * Authenticate using an identity provider (IdP) that is compliant with OpenID Connect (OIDC)
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#oidc-requirements
     */
    static authenticateOidc(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_AuthenticateOidcOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.authenticateOidc);
            }
            throw error;
        }
        return new ListenerAction({
            type: 'authenticate-oidc',
            authenticateOidcConfig: {
                authorizationEndpoint: options.authorizationEndpoint,
                clientId: options.clientId,
                clientSecret: options.clientSecret.unsafeUnwrap(),
                issuer: options.issuer,
                tokenEndpoint: options.tokenEndpoint,
                userInfoEndpoint: options.userInfoEndpoint,
                authenticationRequestExtraParams: options.authenticationRequestExtraParams,
                onUnauthenticatedRequest: options.onUnauthenticatedRequest,
                scope: options.scope,
                sessionCookieName: options.sessionCookieName,
                sessionTimeout: options.sessionTimeout?.toSeconds().toString(),
            },
        }, options.next);
    }
    /**
     * Forward to one or more Target Groups
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
     */
    static forward(targetGroups, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ForwardOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.forward);
            }
            throw error;
        }
        if (targetGroups.length === 0) {
            throw new Error('Need at least one targetGroup in a ListenerAction.forward()');
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
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
     */
    static weightedForward(targetGroups, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ForwardOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.weightedForward);
            }
            throw error;
        }
        if (targetGroups.length === 0) {
            throw new Error('Need at least one targetGroup in a ListenerAction.weightedForward()');
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
     * Return a fixed response
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#fixed-response-actions
     */
    static fixedResponse(statusCode, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_FixedResponseOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fixedResponse);
            }
            throw error;
        }
        return new ListenerAction({
            type: 'fixed-response',
            fixedResponseConfig: {
                statusCode: core_1.Tokenization.stringifyNumber(statusCode),
                contentType: options.contentType,
                messageBody: options.messageBody,
            },
        });
    }
    /**
     * Redirect to a different URI
     *
     * A URI consists of the following components:
     * protocol://hostname:port/path?query. You must modify at least one of the
     * following components to avoid a redirect loop: protocol, hostname, port, or
     * path. Any components that you do not modify retain their original values.
     *
     * You can reuse URI components using the following reserved keywords:
     *
     * - `#{protocol}`
     * - `#{host}`
     * - `#{port}`
     * - `#{path}` (the leading "/" is removed)
     * - `#{query}`
     *
     * For example, you can change the path to "/new/#{path}", the hostname to
     * "example.#{host}", or the query to "#{query}&value=xyz".
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#redirect-actions
     */
    static redirect(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_RedirectOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.redirect);
            }
            throw error;
        }
        if ([options.host, options.path, options.port, options.protocol, options.query].findIndex(x => x !== undefined) === -1) {
            throw new Error('To prevent redirect loops, set at least one of \'protocol\', \'host\', \'port\', \'path\', or \'query\'.');
        }
        return new ListenerAction({
            type: 'redirect',
            redirectConfig: {
                statusCode: options.permanent ? 'HTTP_301' : 'HTTP_302',
                host: options.host,
                path: options.path,
                port: options.port,
                protocol: options.protocol,
                query: options.query,
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
    bind(scope, listener, associatingConstruct) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationListener(listener);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        this.next?.bind(scope, listener, associatingConstruct);
    }
    /**
     * Renumber the "order" fields in the actions array.
     *
     * We don't number for 0 or 1 elements, but otherwise number them 1...#actions
     * so ELB knows about the right order.
     *
     * Do this in `ListenerAction` instead of in `Listener` so that we give
     * users the opportunity to override by subclassing and overriding `renderActions`.
     */
    renumber(actions) {
        if (actions.length < 2) {
            return actions;
        }
        return actions.map((action, i) => ({ ...action, order: i + 1 }));
    }
}
exports.ListenerAction = ListenerAction;
_a = JSII_RTTI_SYMBOL_1;
ListenerAction[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ListenerAction", version: "0.0.0" };
/**
 * What to do with unauthenticated requests
 */
var UnauthenticatedAction;
(function (UnauthenticatedAction) {
    /**
     * Return an HTTP 401 Unauthorized error.
     */
    UnauthenticatedAction["DENY"] = "deny";
    /**
     * Allow the request to be forwarded to the target.
     */
    UnauthenticatedAction["ALLOW"] = "allow";
    /**
     * Redirect the request to the IdP authorization endpoint.
     */
    UnauthenticatedAction["AUTHENTICATE"] = "authenticate";
})(UnauthenticatedAction = exports.UnauthenticatedAction || (exports.UnauthenticatedAction = {}));
/**
 * Listener Action that calls "registerListener" on TargetGroups
 */
class TargetGroupListenerAction extends ListenerAction {
    constructor(targetGroups, actionJson) {
        super(actionJson);
        this.targetGroups = targetGroups;
    }
    bind(_scope, listener, associatingConstruct) {
        for (const tg of this.targetGroups) {
            tg.registerListener(listener, associatingConstruct);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbGlzdGVuZXItYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwbGljYXRpb24tbGlzdGVuZXItYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFvRTtBQU9wRTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFhLGNBQWM7SUFtSXpCOzs7Ozs7T0FNRztJQUNILFlBQXVDLFVBQXNDLEVBQXFCLElBQXFCO1FBQWhGLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBQXFCLFNBQUksR0FBSixJQUFJLENBQWlCOzs7Ozs7OytDQTFJNUcsY0FBYzs7OztLQTJJeEI7SUExSUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFnQzs7Ozs7Ozs7OztRQUM3RCxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLElBQUksRUFBRSxtQkFBbUI7WUFDekIsc0JBQXNCLEVBQUU7Z0JBQ3RCLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxxQkFBcUI7Z0JBQ3BELFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtnQkFDMUIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFO2dCQUNqRCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLGFBQWEsRUFBRSxPQUFPLENBQUMsYUFBYTtnQkFDcEMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtnQkFDMUMsZ0NBQWdDLEVBQUUsT0FBTyxDQUFDLGdDQUFnQztnQkFDMUUsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLHdCQUF3QjtnQkFDMUQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO2dCQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCO2dCQUM1QyxjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDL0Q7U0FDRixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMs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QUFDLEVBQUUsR0FBRyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEU7O0FBeEtILHdDQXlLQzs7O0FBd05EOztHQUVHO0FBQ0gsSUFBWSxxQkFlWDtBQWZELFdBQVkscUJBQXFCO0lBQy9COztPQUVHO0lBQ0gsc0NBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsd0NBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsc0RBQTZCLENBQUE7QUFDL0IsQ0FBQyxFQWZXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBZWhDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLHlCQUEwQixTQUFRLGNBQWM7SUFDcEQsWUFBNkIsWUFBdUMsRUFBRSxVQUFzQztRQUMxRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFEUyxpQkFBWSxHQUFaLFlBQVksQ0FBMkI7S0FFbkU7SUFFTSxJQUFJLENBQUMsTUFBaUIsRUFBRSxRQUE4QixFQUFFLG9CQUFpQztRQUM5RixLQUFLLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbEMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3JEO0tBQ0Y7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBTZWNyZXRWYWx1ZSwgVG9rZW5pemF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElBcHBsaWNhdGlvbkxpc3RlbmVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1saXN0ZW5lcic7XG5pbXBvcnQgeyBJQXBwbGljYXRpb25UYXJnZXRHcm91cCB9IGZyb20gJy4vYXBwbGljYXRpb24tdGFyZ2V0LWdyb3VwJztcbmltcG9ydCB7IENmbkxpc3RlbmVyIH0gZnJvbSAnLi4vZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUxpc3RlbmVyQWN0aW9uIH0gZnJvbSAnLi4vc2hhcmVkL2xpc3RlbmVyLWFjdGlvbic7XG5cbi8qKlxuICogV2hhdCB0byBkbyB3aGVuIGEgY2xpZW50IG1ha2VzIGEgcmVxdWVzdCB0byBhIGxpc3RlbmVyXG4gKlxuICogU29tZSBhY3Rpb25zIGNhbiBiZSBjb21iaW5lZCB3aXRoIG90aGVyIG9uZXMgKHNwZWNpZmljYWxseSxcbiAqIHlvdSBjYW4gcGVyZm9ybSBhdXRoZW50aWNhdGlvbiBiZWZvcmUgc2VydmluZyB0aGUgcmVxdWVzdCkuXG4gKlxuICogTXVsdGlwbGUgYWN0aW9ucyBmb3JtIGEgbGlua2VkIGNoYWluOyB0aGUgY2hhaW4gbXVzdCBhbHdheXMgdGVybWluYXRlIGluIGFcbiAqICood2VpZ2h0ZWQpZm9yd2FyZCosICpmaXhlZFJlc3BvbnNlKiBvciAqcmVkaXJlY3QqIGFjdGlvbi5cbiAqXG4gKiBJZiBhbiBhY3Rpb24gc3VwcG9ydHMgY2hhaW5pbmcsIHRoZSBuZXh0IGFjdGlvbiBjYW4gYmUgaW5kaWNhdGVkXG4gKiBieSBwYXNzaW5nIGl0IGluIHRoZSBgbmV4dGAgcHJvcGVydHkuXG4gKlxuICogKENhbGxlZCBgTGlzdGVuZXJBY3Rpb25gIGluc3RlYWQgb2YgdGhlIG1vcmUgc3RyaWN0bHkgY29ycmVjdFxuICogYExpc3RlbmVyQWN0aW9uYCBiZWNhdXNlIHRoaXMgaXMgdGhlIGNsYXNzIG1vc3QgdXNlcnMgaW50ZXJhY3RcbiAqIHdpdGgsIGFuZCB3ZSB3YW50IHRvIG1ha2UgaXQgbm90IHRvbyB2aXN1YWxseSBvdmVyd2hlbG1pbmcpLlxuICovXG5leHBvcnQgY2xhc3MgTGlzdGVuZXJBY3Rpb24gaW1wbGVtZW50cyBJTGlzdGVuZXJBY3Rpb24ge1xuICAvKipcbiAgICogQXV0aGVudGljYXRlIHVzaW5nIGFuIGlkZW50aXR5IHByb3ZpZGVyIChJZFApIHRoYXQgaXMgY29tcGxpYW50IHdpdGggT3BlbklEIENvbm5lY3QgKE9JREMpXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNsb2FkYmFsYW5jaW5nL2xhdGVzdC9hcHBsaWNhdGlvbi9saXN0ZW5lci1hdXRoZW50aWNhdGUtdXNlcnMuaHRtbCNvaWRjLXJlcXVpcmVtZW50c1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhdXRoZW50aWNhdGVPaWRjKG9wdGlvbnM6IEF1dGhlbnRpY2F0ZU9pZGNPcHRpb25zKTogTGlzdGVuZXJBY3Rpb24ge1xuICAgIHJldHVybiBuZXcgTGlzdGVuZXJBY3Rpb24oe1xuICAgICAgdHlwZTogJ2F1dGhlbnRpY2F0ZS1vaWRjJyxcbiAgICAgIGF1dGhlbnRpY2F0ZU9pZGNDb25maWc6IHtcbiAgICAgICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiBvcHRpb25zLmF1dGhvcml6YXRpb25FbmRwb2ludCxcbiAgICAgICAgY2xpZW50SWQ6IG9wdGlvbnMuY2xpZW50SWQsXG4gICAgICAgIGNsaWVudFNlY3JldDogb3B0aW9ucy5jbGllbnRTZWNyZXQudW5zYWZlVW53cmFwKCksIC8vIFNhZmUgdXNhZ2VcbiAgICAgICAgaXNzdWVyOiBvcHRpb25zLmlzc3VlcixcbiAgICAgICAgdG9rZW5FbmRwb2ludDogb3B0aW9ucy50b2tlbkVuZHBvaW50LFxuICAgICAgICB1c2VySW5mb0VuZHBvaW50OiBvcHRpb25zLnVzZXJJbmZvRW5kcG9pbnQsXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uUmVxdWVzdEV4dHJhUGFyYW1zOiBvcHRpb25zLmF1dGhlbnRpY2F0aW9uUmVxdWVzdEV4dHJhUGFyYW1zLFxuICAgICAgICBvblVuYXV0aGVudGljYXRlZFJlcXVlc3Q6IG9wdGlvbnMub25VbmF1dGhlbnRpY2F0ZWRSZXF1ZXN0LFxuICAgICAgICBzY29wZTogb3B0aW9ucy5zY29wZSxcbiAgICAgICAgc2Vzc2lvbkNvb2tpZU5hbWU6IG9wdGlvbnMuc2Vzc2lvbkNvb2tpZU5hbWUsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiBvcHRpb25zLnNlc3Npb25UaW1lb3V0Py50b1NlY29uZHMoKS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICB9LCBvcHRpb25zLm5leHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcndhcmQgdG8gb25lIG9yIG1vcmUgVGFyZ2V0IEdyb3Vwc1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNmb3J3YXJkLWFjdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yd2FyZCh0YXJnZXRHcm91cHM6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwW10sIG9wdGlvbnM6IEZvcndhcmRPcHRpb25zID0ge30pOiBMaXN0ZW5lckFjdGlvbiB7XG4gICAgaWYgKHRhcmdldEdyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhdCBsZWFzdCBvbmUgdGFyZ2V0R3JvdXAgaW4gYSBMaXN0ZW5lckFjdGlvbi5mb3J3YXJkKCknKTtcbiAgICB9XG4gICAgaWYgKHRhcmdldEdyb3Vwcy5sZW5ndGggPT09IDEgJiYgb3B0aW9ucy5zdGlja2luZXNzRHVyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gUmVuZGVyIGEgXCJzaW1wbGVcIiBhY3Rpb24gZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggb2xkIHRlbXBsYXRlc1xuICAgICAgcmV0dXJuIG5ldyBUYXJnZXRHcm91cExpc3RlbmVyQWN0aW9uKHRhcmdldEdyb3Vwcywge1xuICAgICAgICB0eXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIHRhcmdldEdyb3VwQXJuOiB0YXJnZXRHcm91cHNbMF0udGFyZ2V0R3JvdXBBcm4sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRhcmdldEdyb3VwTGlzdGVuZXJBY3Rpb24odGFyZ2V0R3JvdXBzLCB7XG4gICAgICB0eXBlOiAnZm9yd2FyZCcsXG4gICAgICBmb3J3YXJkQ29uZmlnOiB7XG4gICAgICAgIHRhcmdldEdyb3VwczogdGFyZ2V0R3JvdXBzLm1hcChnID0+ICh7IHRhcmdldEdyb3VwQXJuOiBnLnRhcmdldEdyb3VwQXJuIH0pKSxcbiAgICAgICAgdGFyZ2V0R3JvdXBTdGlja2luZXNzQ29uZmlnOiBvcHRpb25zLnN0aWNraW5lc3NEdXJhdGlvbiA/IHtcbiAgICAgICAgICBkdXJhdGlvblNlY29uZHM6IG9wdGlvbnMuc3RpY2tpbmVzc0R1cmF0aW9uLnRvU2Vjb25kcygpLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcndhcmQgdG8gb25lIG9yIG1vcmUgVGFyZ2V0IEdyb3VwcyB3aGljaCBhcmUgd2VpZ2h0ZWQgZGlmZmVyZW50bHlcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL2xvYWQtYmFsYW5jZXItbGlzdGVuZXJzLmh0bWwjZm9yd2FyZC1hY3Rpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdlaWdodGVkRm9yd2FyZCh0YXJnZXRHcm91cHM6IFdlaWdodGVkVGFyZ2V0R3JvdXBbXSwgb3B0aW9uczogRm9yd2FyZE9wdGlvbnMgPSB7fSk6IExpc3RlbmVyQWN0aW9uIHtcbiAgICBpZiAodGFyZ2V0R3JvdXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGF0IGxlYXN0IG9uZSB0YXJnZXRHcm91cCBpbiBhIExpc3RlbmVyQWN0aW9uLndlaWdodGVkRm9yd2FyZCgpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUYXJnZXRHcm91cExpc3RlbmVyQWN0aW9uKHRhcmdldEdyb3Vwcy5tYXAoZyA9PiBnLnRhcmdldEdyb3VwKSwge1xuICAgICAgdHlwZTogJ2ZvcndhcmQnLFxuICAgICAgZm9yd2FyZENvbmZpZzoge1xuICAgICAgICB0YXJnZXRHcm91cHM6IHRhcmdldEdyb3Vwcy5tYXAoZyA9PiAoeyB0YXJnZXRHcm91cEFybjogZy50YXJnZXRHcm91cC50YXJnZXRHcm91cEFybiwgd2VpZ2h0OiBnLndlaWdodCB9KSksXG4gICAgICAgIHRhcmdldEdyb3VwU3RpY2tpbmVzc0NvbmZpZzogb3B0aW9ucy5zdGlja2luZXNzRHVyYXRpb24gPyB7XG4gICAgICAgICAgZHVyYXRpb25TZWNvbmRzOiBvcHRpb25zLnN0aWNraW5lc3NEdXJhdGlvbi50b1NlY29uZHMoKSxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBmaXhlZCByZXNwb25zZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNmaXhlZC1yZXNwb25zZS1hY3Rpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpeGVkUmVzcG9uc2Uoc3RhdHVzQ29kZTogbnVtYmVyLCBvcHRpb25zOiBGaXhlZFJlc3BvbnNlT3B0aW9ucyA9IHt9KTogTGlzdGVuZXJBY3Rpb24ge1xuICAgIHJldHVybiBuZXcgTGlzdGVuZXJBY3Rpb24oe1xuICAgICAgdHlwZTogJ2ZpeGVkLXJlc3BvbnNlJyxcbiAgICAgIGZpeGVkUmVzcG9uc2VDb25maWc6IHtcbiAgICAgICAgc3RhdHVzQ29kZTogVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcihzdGF0dXNDb2RlKSxcbiAgICAgICAgY29udGVudFR5cGU6IG9wdGlvbnMuY29udGVudFR5cGUsXG4gICAgICAgIG1lc3NhZ2VCb2R5OiBvcHRpb25zLm1lc3NhZ2VCb2R5LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWRpcmVjdCB0byBhIGRpZmZlcmVudCBVUklcbiAgICpcbiAgICogQSBVUkkgY29uc2lzdHMgb2YgdGhlIGZvbGxvd2luZyBjb21wb25lbnRzOlxuICAgKiBwcm90b2NvbDovL2hvc3RuYW1lOnBvcnQvcGF0aD9xdWVyeS4gWW91IG11c3QgbW9kaWZ5IGF0IGxlYXN0IG9uZSBvZiB0aGVcbiAgICogZm9sbG93aW5nIGNvbXBvbmVudHMgdG8gYXZvaWQgYSByZWRpcmVjdCBsb29wOiBwcm90b2NvbCwgaG9zdG5hbWUsIHBvcnQsIG9yXG4gICAqIHBhdGguIEFueSBjb21wb25lbnRzIHRoYXQgeW91IGRvIG5vdCBtb2RpZnkgcmV0YWluIHRoZWlyIG9yaWdpbmFsIHZhbHVlcy5cbiAgICpcbiAgICogWW91IGNhbiByZXVzZSBVUkkgY29tcG9uZW50cyB1c2luZyB0aGUgZm9sbG93aW5nIHJlc2VydmVkIGtleXdvcmRzOlxuICAgKlxuICAgKiAtIGAje3Byb3RvY29sfWBcbiAgICogLSBgI3tob3N0fWBcbiAgICogLSBgI3twb3J0fWBcbiAgICogLSBgI3twYXRofWAgKHRoZSBsZWFkaW5nIFwiL1wiIGlzIHJlbW92ZWQpXG4gICAqIC0gYCN7cXVlcnl9YFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgeW91IGNhbiBjaGFuZ2UgdGhlIHBhdGggdG8gXCIvbmV3LyN7cGF0aH1cIiwgdGhlIGhvc3RuYW1lIHRvXG4gICAqIFwiZXhhbXBsZS4je2hvc3R9XCIsIG9yIHRoZSBxdWVyeSB0byBcIiN7cXVlcnl9JnZhbHVlPXh5elwiLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljbG9hZGJhbGFuY2luZy9sYXRlc3QvYXBwbGljYXRpb24vbG9hZC1iYWxhbmNlci1saXN0ZW5lcnMuaHRtbCNyZWRpcmVjdC1hY3Rpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZGlyZWN0KG9wdGlvbnM6IFJlZGlyZWN0T3B0aW9ucyk6IExpc3RlbmVyQWN0aW9uIHtcbiAgICBpZiAoW29wdGlvbnMuaG9zdCwgb3B0aW9ucy5wYXRoLCBvcHRpb25zLnBvcnQsIG9wdGlvbnMucHJvdG9jb2wsIG9wdGlvbnMucXVlcnldLmZpbmRJbmRleCh4ID0+IHggIT09IHVuZGVmaW5lZCkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvIHByZXZlbnQgcmVkaXJlY3QgbG9vcHMsIHNldCBhdCBsZWFzdCBvbmUgb2YgXFwncHJvdG9jb2xcXCcsIFxcJ2hvc3RcXCcsIFxcJ3BvcnRcXCcsIFxcJ3BhdGhcXCcsIG9yIFxcJ3F1ZXJ5XFwnLicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTGlzdGVuZXJBY3Rpb24oe1xuICAgICAgdHlwZTogJ3JlZGlyZWN0JyxcbiAgICAgIHJlZGlyZWN0Q29uZmlnOiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IG9wdGlvbnMucGVybWFuZW50ID8gJ0hUVFBfMzAxJyA6ICdIVFRQXzMwMicsXG4gICAgICAgIGhvc3Q6IG9wdGlvbnMuaG9zdCxcbiAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgICAgICBwb3J0OiBvcHRpb25zLnBvcnQsXG4gICAgICAgIHByb3RvY29sOiBvcHRpb25zLnByb3RvY29sLFxuICAgICAgICBxdWVyeTogb3B0aW9ucy5xdWVyeSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIExpc3RlbmVyQWN0aW9uXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGNsYXNzIHNob3VsZCBiZSBnb29kIGVub3VnaCBmb3IgbW9zdCBjYXNlcyBhbmRcbiAgICogc2hvdWxkIGJlIGNyZWF0ZWQgYnkgdXNpbmcgb25lIG9mIHRoZSBzdGF0aWMgZmFjdG9yeSBmdW5jdGlvbnMsXG4gICAqIGJ1dCBhbGxvdyBvdmVycmlkaW5nIHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyBmbGV4aWJpbGl0eSBmb3IgdGhlIGZ1dHVyZS5cbiAgICovXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFjdGlvbkpzb246IENmbkxpc3RlbmVyLkFjdGlvblByb3BlcnR5LCBwcm90ZWN0ZWQgcmVhZG9ubHkgbmV4dD86IExpc3RlbmVyQWN0aW9uKSB7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBhY3Rpb25zIGluIHRoaXMgY2hhaW5cbiAgICovXG4gIHB1YmxpYyByZW5kZXJBY3Rpb25zKCk6IENmbkxpc3RlbmVyLkFjdGlvblByb3BlcnR5W10ge1xuICAgIHJldHVybiB0aGlzLnJlbnVtYmVyKFt0aGlzLmFjdGlvbkpzb24sIC4uLnRoaXMubmV4dD8ucmVuZGVyQWN0aW9ucygpID8/IFtdXSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGFjdGlvbiBpcyBiZWluZyB1c2VkIGluIGEgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIGxpc3RlbmVyOiBJQXBwbGljYXRpb25MaXN0ZW5lciwgYXNzb2NpYXRpbmdDb25zdHJ1Y3Q/OiBJQ29uc3RydWN0KSB7XG4gICAgdGhpcy5uZXh0Py5iaW5kKHNjb3BlLCBsaXN0ZW5lciwgYXNzb2NpYXRpbmdDb25zdHJ1Y3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbnVtYmVyIHRoZSBcIm9yZGVyXCIgZmllbGRzIGluIHRoZSBhY3Rpb25zIGFycmF5LlxuICAgKlxuICAgKiBXZSBkb24ndCBudW1iZXIgZm9yIDAgb3IgMSBlbGVtZW50cywgYnV0IG90aGVyd2lzZSBudW1iZXIgdGhlbSAxLi4uI2FjdGlvbnNcbiAgICogc28gRUxCIGtub3dzIGFib3V0IHRoZSByaWdodCBvcmRlci5cbiAgICpcbiAgICogRG8gdGhpcyBpbiBgTGlzdGVuZXJBY3Rpb25gIGluc3RlYWQgb2YgaW4gYExpc3RlbmVyYCBzbyB0aGF0IHdlIGdpdmVcbiAgICogdXNlcnMgdGhlIG9wcG9ydHVuaXR5IHRvIG92ZXJyaWRlIGJ5IHN1YmNsYXNzaW5nIGFuZCBvdmVycmlkaW5nIGByZW5kZXJBY3Rpb25zYC5cbiAgICovXG4gIHByb3RlY3RlZCByZW51bWJlcihhY3Rpb25zOiBDZm5MaXN0ZW5lci5BY3Rpb25Qcm9wZXJ0eVtdKTogQ2ZuTGlzdGVuZXIuQWN0aW9uUHJvcGVydHlbXSB7XG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoIDwgMikgeyByZXR1cm4gYWN0aW9uczsgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnMubWFwKChhY3Rpb24sIGkpID0+ICh7IC4uLmFjdGlvbiwgb3JkZXI6IGkgKyAxIH0pKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBMaXN0ZW5lckFjdGlvbi5mb3J3YXJkKClgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRm9yd2FyZE9wdGlvbnMge1xuICAvKipcbiAgICogRm9yIGhvdyBsb25nIGNsaWVudHMgc2hvdWxkIGJlIGRpcmVjdGVkIHRvIHRoZSBzYW1lIHRhcmdldCBncm91cFxuICAgKlxuICAgKiBSYW5nZSBiZXR3ZWVuIDEgc2Vjb25kIGFuZCA3IGRheXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3RpY2tpbmVzc1xuICAgKi9cbiAgcmVhZG9ubHkgc3RpY2tpbmVzc0R1cmF0aW9uPzogRHVyYXRpb247XG59XG5cbi8qKlxuICogQSBUYXJnZXQgR3JvdXAgYW5kIHdlaWdodCBjb21iaW5hdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFdlaWdodGVkVGFyZ2V0R3JvdXAge1xuICAvKipcbiAgICogVGhlIHRhcmdldCBncm91cFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXA6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IGdyb3VwJ3Mgd2VpZ2h0XG4gICAqXG4gICAqIFJhbmdlIGlzIFswLi4xMDAwKS5cbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgd2VpZ2h0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBMaXN0ZW5lckFjdGlvbi5maXhlZFJlc3BvbnNlKClgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRml4ZWRSZXNwb25zZU9wdGlvbnMge1xuICAvKipcbiAgICogQ29udGVudCBUeXBlIG9mIHRoZSByZXNwb25zZVxuICAgKlxuICAgKiBWYWxpZCBWYWx1ZXM6IHRleHQvcGxhaW4gfCB0ZXh0L2NzcyB8IHRleHQvaHRtbCB8IGFwcGxpY2F0aW9uL2phdmFzY3JpcHQgfCBhcHBsaWNhdGlvbi9qc29uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBkZXRlcm1pbmVkXG4gICAqL1xuICByZWFkb25seSBjb250ZW50VHlwZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlc3BvbnNlIGJvZHlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBib2R5XG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlQm9keT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBgTGlzdGVuZXJBY3Rpb24ucmVkaXJlY3QoKWBcbiAqXG4gKiBBIFVSSSBjb25zaXN0cyBvZiB0aGUgZm9sbG93aW5nIGNvbXBvbmVudHM6XG4gKiBwcm90b2NvbDovL2hvc3RuYW1lOnBvcnQvcGF0aD9xdWVyeS4gWW91IG11c3QgbW9kaWZ5IGF0IGxlYXN0IG9uZSBvZiB0aGVcbiAqIGZvbGxvd2luZyBjb21wb25lbnRzIHRvIGF2b2lkIGEgcmVkaXJlY3QgbG9vcDogcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0LCBvclxuICogcGF0aC4gQW55IGNvbXBvbmVudHMgdGhhdCB5b3UgZG8gbm90IG1vZGlmeSByZXRhaW4gdGhlaXIgb3JpZ2luYWwgdmFsdWVzLlxuICpcbiAqIFlvdSBjYW4gcmV1c2UgVVJJIGNvbXBvbmVudHMgdXNpbmcgdGhlIGZvbGxvd2luZyByZXNlcnZlZCBrZXl3b3JkczpcbiAqXG4gKiAtIGAje3Byb3RvY29sfWBcbiAqIC0gYCN7aG9zdH1gXG4gKiAtIGAje3BvcnR9YFxuICogLSBgI3twYXRofWAgKHRoZSBsZWFkaW5nIFwiL1wiIGlzIHJlbW92ZWQpXG4gKiAtIGAje3F1ZXJ5fWBcbiAqXG4gKiBGb3IgZXhhbXBsZSwgeW91IGNhbiBjaGFuZ2UgdGhlIHBhdGggdG8gXCIvbmV3LyN7cGF0aH1cIiwgdGhlIGhvc3RuYW1lIHRvXG4gKiBcImV4YW1wbGUuI3tob3N0fVwiLCBvciB0aGUgcXVlcnkgdG8gXCIje3F1ZXJ5fSZ2YWx1ZT14eXpcIi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWRpcmVjdE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGhvc3RuYW1lLlxuICAgKlxuICAgKiBUaGlzIGNvbXBvbmVudCBpcyBub3QgcGVyY2VudC1lbmNvZGVkLiBUaGUgaG9zdG5hbWUgY2FuIGNvbnRhaW4gI3tob3N0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjaGFuZ2VcbiAgICovXG4gIHJlYWRvbmx5IGhvc3Q/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhYnNvbHV0ZSBwYXRoLCBzdGFydGluZyB3aXRoIHRoZSBsZWFkaW5nIFwiL1wiLlxuICAgKlxuICAgKiBUaGlzIGNvbXBvbmVudCBpcyBub3QgcGVyY2VudC1lbmNvZGVkLiBUaGUgcGF0aCBjYW4gY29udGFpbiAje2hvc3R9LCAje3BhdGh9LCBhbmQgI3twb3J0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjaGFuZ2VcbiAgICovXG4gIHJlYWRvbmx5IHBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0LlxuICAgKlxuICAgKiBZb3UgY2FuIHNwZWNpZnkgYSB2YWx1ZSBmcm9tIDEgdG8gNjU1MzUgb3IgI3twb3J0fS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjaGFuZ2VcbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbC5cbiAgICpcbiAgICogWW91IGNhbiBzcGVjaWZ5IEhUVFAsIEhUVFBTLCBvciAje3Byb3RvY29sfS4gWW91IGNhbiByZWRpcmVjdCBIVFRQIHRvIEhUVFAsIEhUVFAgdG8gSFRUUFMsIGFuZCBIVFRQUyB0byBIVFRQUy4gWW91IGNhbm5vdCByZWRpcmVjdCBIVFRQUyB0byBIVFRQLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNoYW5nZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBxdWVyeSBwYXJhbWV0ZXJzLCBVUkwtZW5jb2RlZCB3aGVuIG5lY2Vzc2FyeSwgYnV0IG5vdCBwZXJjZW50LWVuY29kZWQuXG4gICAqXG4gICAqIERvIG5vdCBpbmNsdWRlIHRoZSBsZWFkaW5nIFwiP1wiLCBhcyBpdCBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkLiBZb3UgY2FuIHNwZWNpZnkgYW55IG9mIHRoZSByZXNlcnZlZCBrZXl3b3Jkcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjaGFuZ2VcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSFRUUCByZWRpcmVjdCBjb2RlLlxuICAgKlxuICAgKiBUaGUgcmVkaXJlY3QgaXMgZWl0aGVyIHBlcm1hbmVudCAoSFRUUCAzMDEpIG9yIHRlbXBvcmFyeSAoSFRUUCAzMDIpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWFuZW50PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBgTGlzdGVuZXJBY3Rpb24uYXV0aGVuY2lhdGVPaWRjKClgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aGVudGljYXRlT2lkY09wdGlvbnMge1xuICAvKipcbiAgICogV2hhdCBhY3Rpb24gdG8gZXhlY3V0ZSBuZXh0XG4gICAqL1xuICByZWFkb25seSBuZXh0OiBMaXN0ZW5lckFjdGlvbjtcblxuICAvKipcbiAgICogVGhlIHF1ZXJ5IHBhcmFtZXRlcnMgKHVwIHRvIDEwKSB0byBpbmNsdWRlIGluIHRoZSByZWRpcmVjdCByZXF1ZXN0IHRvIHRoZSBhdXRob3JpemF0aW9uIGVuZHBvaW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dHJhIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhlbnRpY2F0aW9uUmVxdWVzdEV4dHJhUGFyYW1zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAvKipcbiAgICogVGhlIGF1dGhvcml6YXRpb24gZW5kcG9pbnQgb2YgdGhlIElkUC5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGEgZnVsbCBVUkwsIGluY2x1ZGluZyB0aGUgSFRUUFMgcHJvdG9jb2wsIHRoZSBkb21haW4sIGFuZCB0aGUgcGF0aC5cbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb25FbmRwb2ludDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgT0F1dGggMi4wIGNsaWVudCBpZGVudGlmaWVyLlxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIE9BdXRoIDIuMCBjbGllbnQgc2VjcmV0LlxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50U2VjcmV0OiBTZWNyZXRWYWx1ZTtcblxuICAvKipcbiAgICogVGhlIE9JREMgaXNzdWVyIGlkZW50aWZpZXIgb2YgdGhlIElkUC5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGEgZnVsbCBVUkwsIGluY2x1ZGluZyB0aGUgSFRUUFMgcHJvdG9jb2wsIHRoZSBkb21haW4sIGFuZCB0aGUgcGF0aC5cbiAgICovXG4gIHJlYWRvbmx5IGlzc3Vlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYmVoYXZpb3IgaWYgdGhlIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFVuYXV0aGVudGljYXRlZEFjdGlvbi5BVVRIRU5USUNBVEVcbiAgICovXG4gIHJlYWRvbmx5IG9uVW5hdXRoZW50aWNhdGVkUmVxdWVzdD86IFVuYXV0aGVudGljYXRlZEFjdGlvbjtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiB1c2VyIGNsYWltcyB0byBiZSByZXF1ZXN0ZWQgZnJvbSB0aGUgSWRQLlxuICAgKlxuICAgKiBUbyB2ZXJpZnkgd2hpY2ggc2NvcGUgdmFsdWVzIHlvdXIgSWRQIHN1cHBvcnRzIGFuZCBob3cgdG8gc2VwYXJhdGUgbXVsdGlwbGUgdmFsdWVzLCBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHlvdXIgSWRQLlxuICAgKlxuICAgKiBAZGVmYXVsdCBcIm9wZW5pZFwiXG4gICAqL1xuICByZWFkb25seSBzY29wZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB1c2VkIHRvIG1haW50YWluIHNlc3Npb24gaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFwiQVdTRUxCQXV0aFNlc3Npb25Db29raWVcIlxuICAgKi9cbiAgcmVhZG9ubHkgc2Vzc2lvbkNvb2tpZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGR1cmF0aW9uIG9mIHRoZSBhdXRoZW50aWNhdGlvbiBzZXNzaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5kYXlzKDcpXG4gICAqL1xuICByZWFkb25seSBzZXNzaW9uVGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgdG9rZW4gZW5kcG9pbnQgb2YgdGhlIElkUC5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGEgZnVsbCBVUkwsIGluY2x1ZGluZyB0aGUgSFRUUFMgcHJvdG9jb2wsIHRoZSBkb21haW4sIGFuZCB0aGUgcGF0aC5cbiAgICovXG4gIHJlYWRvbmx5IHRva2VuRW5kcG9pbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHVzZXIgaW5mbyBlbmRwb2ludCBvZiB0aGUgSWRQLlxuICAgKlxuICAgKiBUaGlzIG11c3QgYmUgYSBmdWxsIFVSTCwgaW5jbHVkaW5nIHRoZSBIVFRQUyBwcm90b2NvbCwgdGhlIGRvbWFpbiwgYW5kIHRoZSBwYXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckluZm9FbmRwb2ludDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFdoYXQgdG8gZG8gd2l0aCB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdHNcbiAqL1xuZXhwb3J0IGVudW0gVW5hdXRoZW50aWNhdGVkQWN0aW9uIHtcbiAgLyoqXG4gICAqIFJldHVybiBhbiBIVFRQIDQwMSBVbmF1dGhvcml6ZWQgZXJyb3IuXG4gICAqL1xuICBERU5ZID0gJ2RlbnknLFxuXG4gIC8qKlxuICAgKiBBbGxvdyB0aGUgcmVxdWVzdCB0byBiZSBmb3J3YXJkZWQgdG8gdGhlIHRhcmdldC5cbiAgICovXG4gIEFMTE9XID0gJ2FsbG93JyxcblxuICAvKipcbiAgICogUmVkaXJlY3QgdGhlIHJlcXVlc3QgdG8gdGhlIElkUCBhdXRob3JpemF0aW9uIGVuZHBvaW50LlxuICAgKi9cbiAgQVVUSEVOVElDQVRFID0gJ2F1dGhlbnRpY2F0ZScsXG59XG5cbi8qKlxuICogTGlzdGVuZXIgQWN0aW9uIHRoYXQgY2FsbHMgXCJyZWdpc3Rlckxpc3RlbmVyXCIgb24gVGFyZ2V0R3JvdXBzXG4gKi9cbmNsYXNzIFRhcmdldEdyb3VwTGlzdGVuZXJBY3Rpb24gZXh0ZW5kcyBMaXN0ZW5lckFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdGFyZ2V0R3JvdXBzOiBJQXBwbGljYXRpb25UYXJnZXRHcm91cFtdLCBhY3Rpb25Kc29uOiBDZm5MaXN0ZW5lci5BY3Rpb25Qcm9wZXJ0eSkge1xuICAgIHN1cGVyKGFjdGlvbkpzb24pO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIGxpc3RlbmVyOiBJQXBwbGljYXRpb25MaXN0ZW5lciwgYXNzb2NpYXRpbmdDb25zdHJ1Y3Q/OiBJQ29uc3RydWN0KSB7XG4gICAgZm9yIChjb25zdCB0ZyBvZiB0aGlzLnRhcmdldEdyb3Vwcykge1xuICAgICAgdGcucmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lciwgYXNzb2NpYXRpbmdDb25zdHJ1Y3QpO1xuICAgIH1cbiAgfVxufVxuIl19