import { Construct } from 'constructs';
import { IApplicationListener } from './application-listener';
import { ListenerAction } from './application-listener-action';
import { IApplicationTargetGroup } from './application-target-group';
import { ListenerCondition } from './conditions';
/**
 * Basic properties for defining a rule on a listener
 */
export interface BaseApplicationListenerRuleProps {
    /**
     * Priority of the rule
     *
     * The rule with the lowest priority will be used for every request.
     *
     * Priorities must be unique.
     */
    readonly priority: number;
    /**
     * Target groups to forward requests to.
     *
     * Only one of `action`, `fixedResponse`, `redirectResponse` or `targetGroups` can be specified.
     *
     * Implies a `forward` action.
     *
     * @default - No target groups.
     */
    readonly targetGroups?: IApplicationTargetGroup[];
    /**
     * Action to perform when requests are received
     *
     * Only one of `action`, `fixedResponse`, `redirectResponse` or `targetGroups` can be specified.
     *
     * @default - No action
     */
    readonly action?: ListenerAction;
    /**
     * Fixed response to return.
     *
     * Only one of `action`, `fixedResponse`, `redirectResponse` or `targetGroups` can be specified.
     *
     * @default - No fixed response.
     * @deprecated Use `action` instead.
     */
    readonly fixedResponse?: FixedResponse;
    /**
     * Redirect response to return.
     *
     * Only one of `action`, `fixedResponse`, `redirectResponse` or `targetGroups` can be specified.
     *
     * @default - No redirect response.
     * @deprecated Use `action` instead.
     */
    readonly redirectResponse?: RedirectResponse;
    /**
     * Rule applies if matches the conditions.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
     *
     * @default - No conditions.
     */
    readonly conditions?: ListenerCondition[];
    /**
     * Rule applies if the requested host matches the indicated host
     *
     * May contain up to three '*' wildcards.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
     *
     * @default - No host condition.
     * @deprecated Use `conditions` instead.
     */
    readonly hostHeader?: string;
    /**
     * Rule applies if the requested path matches the given path pattern
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
     * @default - No path condition.
     * @deprecated Use `conditions` instead.
     */
    readonly pathPattern?: string;
    /**
     * Rule applies if the requested path matches any of the given patterns.
     *
     * Paths may contain up to three '*' wildcards.
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
     * @default - No path conditions.
     * @deprecated Use `conditions` instead.
     */
    readonly pathPatterns?: string[];
}
/**
 * Properties for defining a listener rule
 */
export interface ApplicationListenerRuleProps extends BaseApplicationListenerRuleProps {
    /**
     * The listener to attach the rule to
     */
    readonly listener: IApplicationListener;
}
/**
 * The content type for a fixed response
 * @deprecated superceded by `FixedResponseOptions`.
 */
export declare enum ContentType {
    TEXT_PLAIN = "text/plain",
    TEXT_CSS = "text/css",
    TEXT_HTML = "text/html",
    APPLICATION_JAVASCRIPT = "application/javascript",
    APPLICATION_JSON = "application/json"
}
/**
 * A fixed response
 * @deprecated superceded by `ListenerAction.fixedResponse()`.
 */
export interface FixedResponse {
    /**
     * The HTTP response code (2XX, 4XX or 5XX)
     */
    readonly statusCode: string;
    /**
     * The content type
     *
     * @default text/plain
     */
    readonly contentType?: ContentType;
    /**
     * The message
     *
     * @default no message
     */
    readonly messageBody?: string;
}
/**
 * A redirect response
 * @deprecated superceded by `ListenerAction.redirect()`.
 */
export interface RedirectResponse {
    /**
     * The hostname. This component is not percent-encoded. The hostname can contain #{host}.
     *
     * @default origin host of request
     */
    readonly host?: string;
    /**
     * The absolute path, starting with the leading "/". This component is not percent-encoded.
     * The path can contain #{host}, #{path}, and #{port}.
     *
     * @default origin path of request
     */
    readonly path?: string;
    /**
     * The port. You can specify a value from 1 to 65535 or #{port}.
     *
     * @default origin port of request
     */
    readonly port?: string;
    /**
     * The protocol. You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP,
     * HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
     *
     * @default origin protocol of request
     */
    readonly protocol?: string;
    /**
     * The query parameters, URL-encoded when necessary, but not percent-encoded.
     * Do not include the leading "?", as it is automatically added.
     * You can specify any of the reserved keywords.
     *
     * @default origin query string of request
     */
    readonly query?: string;
    /**
     * The HTTP redirect code (HTTP_301 or HTTP_302)
     */
    readonly statusCode: string;
}
/**
 * Define a new listener rule
 */
export declare class ApplicationListenerRule extends Construct {
    /**
     * The ARN of this rule
     */
    readonly listenerRuleArn: string;
    private readonly conditions;
    private readonly legacyConditions;
    private readonly listener;
    private action?;
    constructor(scope: Construct, id: string, props: ApplicationListenerRuleProps);
    /**
     * Add a non-standard condition to this rule
     *
     * If the condition conflicts with an already set condition, it will be overwritten by the one you specified.
     *
     * @deprecated use `addCondition` instead.
     */
    setCondition(field: string, values: string[] | undefined): void;
    /**
     * Add a non-standard condition to this rule
     */
    addCondition(condition: ListenerCondition): void;
    /**
     * Configure the action to perform for this rule
     */
    configureAction(action: ListenerAction): void;
    /**
     * Add a TargetGroup to load balance to
     *
     * @deprecated Use configureAction instead
     */
    addTargetGroup(targetGroup: IApplicationTargetGroup): void;
    /**
     * Add a fixed response
     *
     * @deprecated Use configureAction instead
     */
    addFixedResponse(fixedResponse: FixedResponse): void;
    /**
     * Add a redirect response
     *
     * @deprecated Use configureAction instead
     */
    addRedirectResponse(redirectResponse: RedirectResponse): void;
    /**
     * Validate the rule
     */
    private validateListenerRule;
    /**
     * Render the conditions for this rule
     */
    private renderConditions;
}
