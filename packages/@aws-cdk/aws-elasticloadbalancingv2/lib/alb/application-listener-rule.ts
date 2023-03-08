import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplicationListener } from './application-listener';
import { ListenerAction } from './application-listener-action';
import { IApplicationTargetGroup } from './application-target-group';
import { ListenerCondition } from './conditions';
import { CfnListenerRule } from '../elasticloadbalancingv2.generated';
import { IListenerAction } from '../shared/listener-action';

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
export enum ContentType {
  TEXT_PLAIN = 'text/plain',
  TEXT_CSS = 'text/css',
  TEXT_HTML = 'text/html',
  APPLICATION_JAVASCRIPT = 'application/javascript',
  APPLICATION_JSON = 'application/json'
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
export class ApplicationListenerRule extends Construct {
  /**
   * The ARN of this rule
   */
  public readonly listenerRuleArn: string;

  private readonly conditions: ListenerCondition[];
  private readonly legacyConditions: {[key: string]: string[]} = {};

  private readonly listener: IApplicationListener;
  private action?: IListenerAction;

  constructor(scope: Construct, id: string, props: ApplicationListenerRuleProps) {
    super(scope, id);

    this.conditions = props.conditions || [];

    const hasPathPatterns = props.pathPatterns || props.pathPattern;
    if (this.conditions.length === 0 && !props.hostHeader && !hasPathPatterns) {
      throw new Error('At least one of \'conditions\', \'hostHeader\', \'pathPattern\' or \'pathPatterns\' is required when defining a load balancing rule.');
    }

    const possibleActions: Array<keyof ApplicationListenerRuleProps> = ['action', 'targetGroups', 'fixedResponse', 'redirectResponse'];
    const providedActions = possibleActions.filter(action => props[action] !== undefined);
    if (providedActions.length > 1) {
      throw new Error(`'${providedActions}' specified together, specify only one`);
    }

    if (!cdk.Token.isUnresolved(props.priority) && props.priority <= 0) {
      throw new Error('Priority must have value greater than or equal to 1');
    }

    this.listener = props.listener;

    const resource = new CfnListenerRule(this, 'Resource', {
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
      this.configureAction(ListenerAction.forward([group]));
    });

    if (props.fixedResponse) {
      this.addFixedResponse(props.fixedResponse);
    } else if (props.redirectResponse) {
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
  public setCondition(field: string, values: string[] | undefined) {
    if (values === undefined) {
      delete this.legacyConditions[field];
      return;
    }

    this.legacyConditions[field] = values;
  }

  /**
   * Add a non-standard condition to this rule
   */
  public addCondition(condition: ListenerCondition) {
    this.conditions.push(condition);
  }

  /**
   * Configure the action to perform for this rule
   */
  public configureAction(action: ListenerAction) {
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
  public addTargetGroup(targetGroup: IApplicationTargetGroup) {
    this.configureAction(ListenerAction.forward([targetGroup]));
  }

  /**
   * Add a fixed response
   *
   * @deprecated Use configureAction instead
   */
  public addFixedResponse(fixedResponse: FixedResponse) {
    validateFixedResponse(fixedResponse);

    this.configureAction(ListenerAction.fixedResponse(cdk.Token.asNumber(fixedResponse.statusCode), {
      contentType: fixedResponse.contentType,
      messageBody: fixedResponse.messageBody,
    }));
  }

  /**
   * Add a redirect response
   *
   * @deprecated Use configureAction instead
   */
  public addRedirectResponse(redirectResponse: RedirectResponse) {
    validateRedirectResponse(redirectResponse);

    this.configureAction(ListenerAction.redirect({
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
  private validateListenerRule() {
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
  private renderConditions(): any {
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

/**
 * Validate the status code and message body of a fixed response
 * @internal
 * @deprecated
 */
function validateFixedResponse(fixedResponse: FixedResponse) {
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
function validateRedirectResponse(redirectResponse: RedirectResponse) {
  if (redirectResponse.protocol && !/^(HTTPS?|#\{protocol\})$/i.test(redirectResponse.protocol)) {
    throw new Error('`protocol` must be HTTP, HTTPS, or #{protocol}.');
  }

  if (!redirectResponse.statusCode || !/^HTTP_30[12]$/.test(redirectResponse.statusCode)) {
    throw new Error('`statusCode` must be HTTP_301 or HTTP_302.');
  }
}
