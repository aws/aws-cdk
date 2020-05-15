import * as cdk from '@aws-cdk/core';
import { CfnListenerRule } from '../elasticloadbalancingv2.generated';
import { IApplicationListener } from './application-listener';
import { IApplicationTargetGroup } from './application-target-group';

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
   * Target groups to forward requests to. Only one of `fixedResponse`, `redirectResponse` or
   * `targetGroups` can be specified.
   *
   * @default - No target groups.
   */
  readonly targetGroups?: IApplicationTargetGroup[];

  /**
   * Fixed response to return. Only one of `fixedResponse`, `redirectResponse` or
   * `targetGroups` can be specified.
   *
   * @default - No fixed response.
   */
  readonly fixedResponse?: FixedResponse;

  /**
   * Redirect response to return. Only one of `fixedResponse`, `redirectResponse` or
   * `targetGroups` can be specified.
   *
   * @default - No redirect response.
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
 */
export enum ContentType {
  TEXT_PLAIN = 'text/plain',
  TEXT_CSS = 'text/css',
  TEXT_HTML =  'text/html',
  APPLICATION_JAVASCRIPT = 'application/javascript',
  APPLICATION_JSON = 'application/json'
}

/**
 * A fixed response
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
 * Interface for a listener rule condition
 */
export abstract class ListenerCondition {
  /**
   * Create a host-header listener rule condition
   *
   * @param values Hosts for host headers
   */
  public static hostHeaders(values: string[]): ListenerCondition {
    return new HostHeaderListenerCondition(values);
  }

  /**
   * Create a http-header listener rule condition
   *
   * @param name HTTP header name
   * @param values HTTP header values
   */
  public static httpHeader(name: string, values: string[]): ListenerCondition {
    return new HttpHeaderListenerCondition(name, values);
  }

  /**
   * Create a http-request-method listener rule condition
   *
   * @param values HTTP request methods
   */
  public static httpRequestMethods(values: string[]): ListenerCondition {
    return new HttpRequestMethodListenerCondition(values);
  }

  /**
   * Create a path-pattern listener rule condition
   *
   * @param values Path patterns
   */
  public static pathPatterns(values: string[]): ListenerCondition {
    return new PathPatternListenerCondition(values);
  }

  /**
   * Create a query-string listener rule condition
   *
   * @param values Query string key/value pairs
   */
  public static queryStrings(values: QueryStringCondition[]): ListenerCondition {
    return new QueryStringListenerCondition(values);
  }

  /**
   * Create a source-ip listener rule condition
   *
   * @param values Source ips
   */
  public static sourceIps(values: string[]): ListenerCondition {
    return new SourceIpListenerCondition(values);
  }

  /**
   * Listener condition field type
   */
  public readonly abstract field: string;

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public abstract renderRawCondition(): any;
}

/**
 * Properties for the key/value pair of the query string
 */
export interface QueryStringCondition {
  /**
   * The query string key for the condition
   *
   * @default - Any key can be matched.
   */
  readonly key?: string;

  /**
   * The query string value for the condition
   */
  readonly value: string;
}

/**
 * Host header config of the listener rule condition
 */
class HostHeaderListenerCondition extends ListenerCondition {
  public readonly field = 'host-header';

  constructor(public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      hostHeaderConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * HTTP header config of the listener rule condition
 */
class HttpHeaderListenerCondition extends ListenerCondition {
  public readonly field = 'http-header';

  constructor(public readonly name: string, public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      httpHeaderConfig: {
        httpHeaderName: this.name,
        values: this.values,
      },
    };
  }
}

/**
 * HTTP reqeust method config of the listener rule condition
 */
class HttpRequestMethodListenerCondition extends ListenerCondition {
  public readonly field = 'http-request-method';

  constructor(public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      httpRequestMethodConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Path pattern config of the listener rule condition
 */
class PathPatternListenerCondition extends ListenerCondition {
  public readonly field = 'path-pattern';

  constructor(public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      pathPatternConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Query string config of the listener rule condition
 */
class QueryStringListenerCondition extends ListenerCondition {
  public readonly field = 'query-string';

  constructor(public readonly values: QueryStringCondition[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      queryStringConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Source ip config of the listener rule condition
 */
class SourceIpListenerCondition extends ListenerCondition {
  public readonly field = 'source-ip';

  constructor(public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: this.field,
      sourceIpConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Define a new listener rule
 */
export class ApplicationListenerRule extends cdk.Construct {
  /**
   * The ARN of this rule
   */
  public readonly listenerRuleArn: string;

  private readonly conditions: ListenerCondition[];
  private readonly legacyConditions: {[key: string]: string[]} = {};

  private readonly actions: any[] = [];
  private readonly listener: IApplicationListener;

  constructor(scope: cdk.Construct, id: string, props: ApplicationListenerRuleProps) {
    super(scope, id);

    this.conditions = props.conditions || [];

    const hasPathPatterns = props.pathPatterns || props.pathPattern;
    if (this.conditions.length === 0 && !props.hostHeader && !hasPathPatterns) {
      throw new Error('At least one of \'conditions\', \'hostHeader\', \'pathPattern\' or \'pathPatterns\' is required when defining a load balancing rule.');
    }

    const possibleActions: Array<keyof ApplicationListenerRuleProps> = ['targetGroups', 'fixedResponse', 'redirectResponse'];
    const providedActions = possibleActions.filter(action => props[action] !== undefined);
    if (providedActions.length > 1) {
      throw new Error(`'${providedActions}' specified together, specify only one`);
    }

    if (props.priority <= 0) {
      throw new Error('Priority must have value greater than or equal to 1');
    }

    this.listener = props.listener;

    const resource = new CfnListenerRule(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      priority: props.priority,
      conditions: cdk.Lazy.anyValue({ produce: () => this.renderConditions() }),
      actions: cdk.Lazy.anyValue({ produce: () => this.actions }),
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

    (props.targetGroups || []).forEach(this.addTargetGroup.bind(this));

    if (props.fixedResponse) {
      this.addFixedResponse(props.fixedResponse);
    } else if (props.redirectResponse) {
      this.addRedirectResponse(props.redirectResponse);
    }

    this.listenerRuleArn = resource.ref;
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
   *
   * If the condition conflicts with an already set condition, it will be overwritten by the one you specified.
   */
  public addCondition(condition: ListenerCondition) {
    this.conditions.push(condition);
  }

  /**
   * Add a TargetGroup to load balance to
   */
  public addTargetGroup(targetGroup: IApplicationTargetGroup) {
    this.actions.push({
      targetGroupArn: targetGroup.targetGroupArn,
      type: 'forward',
    });
    targetGroup.registerListener(this.listener, this);
  }

  /**
   * Add a fixed response
   */
  public addFixedResponse(fixedResponse: FixedResponse) {
    validateFixedResponse(fixedResponse);

    this.actions.push({
      fixedResponseConfig: fixedResponse,
      type: 'fixed-response',
    });
  }

  /**
   * Add a redirect response
   */
  public addRedirectResponse(redirectResponse: RedirectResponse) {
    validateRedirectResponse(redirectResponse);

    this.actions.push({
      redirectConfig: redirectResponse,
      type: 'redirect',
    });
  }

  /**
   * Validate the rule
   */
  protected validate() {
    if (this.actions.length === 0) {
      return ['Listener rule needs at least one action'];
    }

    const legacyConditionFields = Object.keys(this.legacyConditions);
    const conditionFields = this.conditions.map(condition => condition.field);
    if (legacyConditionFields.length === 0 && conditionFields.length === 0) {
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
 *
 * @internal
 */
export function validateFixedResponse(fixedResponse: FixedResponse) {
  if (fixedResponse.statusCode && !/^(2|4|5)\d\d$/.test(fixedResponse.statusCode)) {
    throw new Error('`statusCode` must be 2XX, 4XX or 5XX.');
  }

  if (fixedResponse.messageBody && fixedResponse.messageBody.length > 1024) {
    throw new Error('`messageBody` cannot have more than 1024 characters.');
  }
}

/**
 * Validate the status code and message body of a redirect response
 *
 * @internal
 */
export function validateRedirectResponse(redirectResponse: RedirectResponse) {
  if (redirectResponse.protocol && !/^(HTTPS?|#\{protocol\})$/i.test(redirectResponse.protocol)) {
    throw new Error('`protocol` must be HTTP, HTTPS, or #{protocol}.');
  }

  if (!redirectResponse.statusCode || !/^HTTP_30[12]$/.test(redirectResponse.statusCode)) {
    throw new Error('`statusCode` must be HTTP_301 or HTTP_302.');
  }
}
