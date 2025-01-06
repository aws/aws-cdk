import { Construct, IConstruct } from 'constructs';
import { IApplicationListener } from './application-listener';
import { IApplicationTargetGroup } from './application-target-group';
import { Port } from '../../../aws-ec2';
import { Duration, SecretValue, Token, Tokenization } from '../../../core';
import { CfnListener, CfnListenerRule } from '../elasticloadbalancingv2.generated';
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
export class ListenerAction implements IListenerAction {
  /**
   * Authenticate using an identity provider (IdP) that is compliant with OpenID Connect (OIDC)
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#oidc-requirements
   */
  public static authenticateOidc(options: AuthenticateOidcOptions): ListenerAction {
    return new AuthenticateOidcAction(options);
  }

  /**
   * Forward to one or more Target Groups
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
   */
  public static forward(targetGroups: IApplicationTargetGroup[], options: ForwardOptions = {}): ListenerAction {
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

    return ListenerAction.weightedForward(targetGroups.map(g => ({ targetGroup: g, weight: 1 })), options);
  }

  /**
   * Forward to one or more Target Groups which are weighted differently
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
   */
  public static weightedForward(targetGroups: WeightedTargetGroup[], options: ForwardOptions = {}): ListenerAction {
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
  public static fixedResponse(statusCode: number, options: FixedResponseOptions = {}): ListenerAction {
    return new ListenerAction({
      type: 'fixed-response',
      fixedResponseConfig: {
        statusCode: Tokenization.stringifyNumber(statusCode),
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
  public static redirect(options: RedirectOptions): ListenerAction {
    if ([options.host, options.path, options.port, options.protocol, options.query].findIndex(x => x !== undefined) === -1) {
      throw new Error('To prevent redirect loops, set at least one of \'protocol\', \'host\', \'port\', \'path\', or \'query\'.');
    }
    if (options.path && !Token.isUnresolved(options.path) && !options.path.startsWith('/')) {
      throw new Error(`Redirect path must start with a \'/\', got: ${options.path}`);
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
   * If set, it is preferred as Action for the `ListenerRule`.
   * This is necessary if `CfnListener.ActionProperty` and `CfnListenerRule.ActionProperty`
   * have different structures.
   */
  private _actionJson?: CfnListenerRule.ActionProperty;

  /**
   * Create an instance of ListenerAction
   *
   * The default class should be good enough for most cases and
   * should be created by using one of the static factory functions,
   * but allow overriding to make sure we allow flexibility for the future.
   */
  protected constructor(private readonly defaultActionJson: CfnListener.ActionProperty, protected readonly next?: ListenerAction) {
  }

  /**
   * Render the listener rule actions in this chain
   */
  public renderRuleActions(): CfnListenerRule.ActionProperty[] {
    const actionJson = this._actionJson ?? this.defaultActionJson as CfnListenerRule.ActionProperty;
    return this._renumber([actionJson, ...this.next?.renderRuleActions() ?? []]);
  }

  /**
   * Render the listener default actions in this chain
   */
  public renderActions(): CfnListener.ActionProperty[] {
    return this._renumber([this.defaultActionJson, ...this.next?.renderActions() ?? []]);
  }

  /**
   * Called when the action is being used in a listener
   */
  public bind(scope: Construct, listener: IApplicationListener, associatingConstruct?: IConstruct) {
    this.next?.bind(scope, listener, associatingConstruct);
  }

  private _renumber<ActionProperty extends CfnListener.ActionProperty | CfnListenerRule.ActionProperty = CfnListener.ActionProperty>
  (actions: ActionProperty[]): ActionProperty[] {
    if (actions.length < 2) { return actions; }

    return actions.map((action, i) => ({ ...action, order: i + 1 }));
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
  protected renumber(actions: CfnListener.ActionProperty[]): CfnListener.ActionProperty[] {
    return this._renumber(actions);
  }

  /**
   * Sets the Action for the `ListenerRule`.
   * This method is required to set a dedicated Action to a `ListenerRule`
   * when the Action for the `CfnListener` and the Action for the `CfnListenerRule`
   * have different structures. (e.g. `AuthenticateOidcConfig`)
   * @param actionJson Action for `ListenerRule`
   */
  protected addRuleAction(actionJson: CfnListenerRule.ActionProperty) {
    if (this._actionJson) {
      throw new Error('rule action is already set');
    }
    this._actionJson = actionJson;
  }
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

  /**
   * Allow HTTPS outbound traffic to communicate with the IdP.
   *
   * Set this property to false if the IP address used for the IdP endpoint is identifiable
   * and you want to control outbound traffic.
   * Then allow HTTPS outbound traffic to the IdP's IP address using the listener's `connections` property.
   *
   * @default true
   * @see https://repost.aws/knowledge-center/elb-configure-authentication-alb
   */
  readonly allowHttpsOutbound?: boolean;
}

/**
 * What to do with unauthenticated requests
 */
export enum UnauthenticatedAction {
  /**
   * Return an HTTP 401 Unauthorized error.
   */
  DENY = 'deny',

  /**
   * Allow the request to be forwarded to the target.
   */
  ALLOW = 'allow',

  /**
   * Redirect the request to the IdP authorization endpoint.
   */
  AUTHENTICATE = 'authenticate',
}

/**
 * Listener Action that calls "registerListener" on TargetGroups
 */
class TargetGroupListenerAction extends ListenerAction {
  constructor(private readonly targetGroups: IApplicationTargetGroup[], defaultActionJson: CfnListener.ActionProperty) {
    super(defaultActionJson);
  }

  public bind(_scope: Construct, listener: IApplicationListener, associatingConstruct?: IConstruct) {
    for (const tg of this.targetGroups) {
      tg.registerListener(listener, associatingConstruct);
    }
  }
}

/**
 * A Listener Action to authenticate with OIDC
 */
class AuthenticateOidcAction extends ListenerAction {
  private readonly allowHttpsOutbound: boolean;

  constructor(options: AuthenticateOidcOptions) {
    const defaultActionConfig: CfnListener.AuthenticateOidcConfigProperty = {
      authorizationEndpoint: options.authorizationEndpoint,
      clientId: options.clientId,
      clientSecret: options.clientSecret.unsafeUnwrap(), // Safe usage
      issuer: options.issuer,
      tokenEndpoint: options.tokenEndpoint,
      userInfoEndpoint: options.userInfoEndpoint,
      authenticationRequestExtraParams: options.authenticationRequestExtraParams,
      onUnauthenticatedRequest: options.onUnauthenticatedRequest,
      scope: options.scope,
      sessionCookieName: options.sessionCookieName,
      sessionTimeout: options.sessionTimeout?.toSeconds().toString(),
    };
    super({
      type: 'authenticate-oidc',
      authenticateOidcConfig: defaultActionConfig,
    }, options.next);

    this.allowHttpsOutbound = options.allowHttpsOutbound ?? true;
    this.addRuleAction({
      type: 'authenticate-oidc',
      authenticateOidcConfig: {
        ...defaultActionConfig,
        sessionTimeout: options.sessionTimeout?.toSeconds(),
      },
    });
  }
  public bind(scope: Construct, listener: IApplicationListener, associatingConstruct?: IConstruct | undefined): void {
    super.bind(scope, listener, associatingConstruct);

    if (!this.allowHttpsOutbound) return;
    listener.connections.allowToAnyIpv4(Port.tcp(443), 'Allow to IdP endpoint');
  }
}
