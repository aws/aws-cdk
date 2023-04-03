import { Duration, SecretValue } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { IApplicationListener } from './application-listener';
import { IApplicationTargetGroup } from './application-target-group';
import { CfnListener } from '../elasticloadbalancingv2.generated';
import { IListenerAction } from '../shared/listener-action';
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
export declare class ListenerAction implements IListenerAction {
    private readonly actionJson;
    protected readonly next?: ListenerAction | undefined;
    /**
     * Authenticate using an identity provider (IdP) that is compliant with OpenID Connect (OIDC)
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#oidc-requirements
     */
    static authenticateOidc(options: AuthenticateOidcOptions): ListenerAction;
    /**
     * Forward to one or more Target Groups
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
     */
    static forward(targetGroups: IApplicationTargetGroup[], options?: ForwardOptions): ListenerAction;
    /**
     * Forward to one or more Target Groups which are weighted differently
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
     */
    static weightedForward(targetGroups: WeightedTargetGroup[], options?: ForwardOptions): ListenerAction;
    /**
     * Return a fixed response
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#fixed-response-actions
     */
    static fixedResponse(statusCode: number, options?: FixedResponseOptions): ListenerAction;
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
    static redirect(options: RedirectOptions): ListenerAction;
    /**
     * Create an instance of ListenerAction
     *
     * The default class should be good enough for most cases and
     * should be created by using one of the static factory functions,
     * but allow overriding to make sure we allow flexibility for the future.
     */
    protected constructor(actionJson: CfnListener.ActionProperty, next?: ListenerAction | undefined);
    /**
     * Render the actions in this chain
     */
    renderActions(): CfnListener.ActionProperty[];
    /**
     * Called when the action is being used in a listener
     */
    bind(scope: Construct, listener: IApplicationListener, associatingConstruct?: IConstruct): void;
    /**
     * Renumber the "order" fields in the actions array.
     *
     * We don't number for 0 or 1 elements, but otherwise number them 1...#actions
     * so ELB knows about the right order.
     *
     * Do this in `ListenerAction` instead of in `Listener` so that we give
     * users the opportunity to override by subclassing and overriding `renderActions`.
     */
    protected renumber(actions: CfnListener.ActionProperty[]): CfnListener.ActionProperty[];
}
/**
 * Options for `ListenerAction.forward()`
 */
export interface ForwardOptions {
    /**
     * For how long clients should be directed to the same target group
     *
     * Range between 1 second and 7 days.
     *
     * @default - No stickiness
     */
    readonly stickinessDuration?: Duration;
}
/**
 * A Target Group and weight combination
 */
export interface WeightedTargetGroup {
    /**
     * The target group
     */
    readonly targetGroup: IApplicationTargetGroup;
    /**
     * The target group's weight
     *
     * Range is [0..1000).
     *
     * @default 1
     */
    readonly weight?: number;
}
/**
 * Options for `ListenerAction.fixedResponse()`
 */
export interface FixedResponseOptions {
    /**
     * Content Type of the response
     *
     * Valid Values: text/plain | text/css | text/html | application/javascript | application/json
     *
     * @default - Automatically determined
     */
    readonly contentType?: string;
    /**
     * The response body
     *
     * @default - No body
     */
    readonly messageBody?: string;
}
/**
 * Options for `ListenerAction.redirect()`
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
 */
export interface RedirectOptions {
    /**
     * The hostname.
     *
     * This component is not percent-encoded. The hostname can contain #{host}.
     *
     * @default - No change
     */
    readonly host?: string;
    /**
     * The absolute path, starting with the leading "/".
     *
     * This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
     *
     * @default - No change
     */
    readonly path?: string;
    /**
     * The port.
     *
     * You can specify a value from 1 to 65535 or #{port}.
     *
     * @default - No change
     */
    readonly port?: string;
    /**
     * The protocol.
     *
     * You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
     *
     * @default - No change
     */
    readonly protocol?: string;
    /**
     * The query parameters, URL-encoded when necessary, but not percent-encoded.
     *
     * Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
     *
     * @default - No change
     */
    readonly query?: string;
    /**
     * The HTTP redirect code.
     *
     * The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
     *
     * @default false
     */
    readonly permanent?: boolean;
}
/**
 * Options for `ListenerAction.authenciateOidc()`
 */
export interface AuthenticateOidcOptions {
    /**
     * What action to execute next
     */
    readonly next: ListenerAction;
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     *
     * @default - No extra parameters
     */
    readonly authenticationRequestExtraParams?: Record<string, string>;
    /**
     * The authorization endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    readonly authorizationEndpoint: string;
    /**
     * The OAuth 2.0 client identifier.
     */
    readonly clientId: string;
    /**
     * The OAuth 2.0 client secret.
     */
    readonly clientSecret: SecretValue;
    /**
     * The OIDC issuer identifier of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    readonly issuer: string;
    /**
     * The behavior if the user is not authenticated.
     *
     * @default UnauthenticatedAction.AUTHENTICATE
     */
    readonly onUnauthenticatedRequest?: UnauthenticatedAction;
    /**
     * The set of user claims to be requested from the IdP.
     *
     * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     *
     * @default "openid"
     */
    readonly scope?: string;
    /**
     * The name of the cookie used to maintain session information.
     *
     * @default "AWSELBAuthSessionCookie"
     */
    readonly sessionCookieName?: string;
    /**
     * The maximum duration of the authentication session.
     *
     * @default Duration.days(7)
     */
    readonly sessionTimeout?: Duration;
    /**
     * The token endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    readonly tokenEndpoint: string;
    /**
     * The user info endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    readonly userInfoEndpoint: string;
}
/**
 * What to do with unauthenticated requests
 */
export declare enum UnauthenticatedAction {
    /**
     * Return an HTTP 401 Unauthorized error.
     */
    DENY = "deny",
    /**
     * Allow the request to be forwarded to the target.
     */
    ALLOW = "allow",
    /**
     * Redirect the request to the IdP authorization endpoint.
     */
    AUTHENTICATE = "authenticate"
}
