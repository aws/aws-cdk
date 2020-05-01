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
   * Rule applies if the requested host matches the indicated host
   *
   * May contain up to three '*' wildcards.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
   *
   * @default - No host condition.
   */
  readonly hostHeader?: string;

  /**
   * Rule applies if the requested path matches the given path pattern
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   * @default - No path condition.
   * @deprecated Use `pathPatterns` instead.
   */
  readonly pathPattern?: string;

  /**
   * Rule applies if the requested path matches any of the given patterns.
   *
   * Paths may contain up to three '*' wildcards.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   * @default - No path conditions.
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
 * Properties for a raw Cfn listener rule condition
 */
export interface RawListenerRuleConditionProps {
  readonly [key: string]: any;
}

/**
 * Interface for a listener rule condition
 */
export interface IListenerRuleCondition {
  /**
   * Listener condition field type
   */
  readonly field: string;

  /**
   * Render the raw Cfn listener rule condition object.
   */
  renderRawCondition(): RawListenerRuleConditionProps;
}

/**
 * Properties for the key/value pair of the query string
 */
export interface QueryStringConditionProps {
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
export class HostHeaderListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: host-header
   */
  public readonly field = 'host-header';

  /**
   * Create a host-header listener rule condition
   *
   * @param values Hosts for host headers
   */
  constructor(public readonly values: string[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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
export class HttpHeaderListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: http-header
   */
  public readonly field = 'http-header';

  /**
   * Create a http-header listener rule condition
   *
   * @param name HTTP header name
   * @param values HTTP header values
   */
  constructor(public readonly name: string, public readonly values: string[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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
export class HttpRequestMethodListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: http-request-method
   */
  public readonly field = 'http-request-method';

  /**
   * Create a http-request-method listener rule condition
   *
   * @param values HTTP request methods
   */
  constructor(public readonly values: string[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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
export class PathPatternListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: path-pattern
   */
  public readonly field = 'path-pattern';

  /**
   * Create a path-pattern listener rule condition
   *
   * @param values Path patterns
   */
  constructor(public readonly values: string[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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
export class QueryStringListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: query-string
   */
  public readonly field = 'query-string';

  /**
   * Create a query-string listener rule condition
   *
   * @param values Query string key/value pairs
   */
  constructor(public readonly values: QueryStringConditionProps[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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
export class SourceIpListenerRuleCondition implements IListenerRuleCondition {
  /**
   * Listener condition field type: source-ip
   */
  public readonly field = 'source-ip';

  /**
   * Create a source-ip listener rule condition
   *
   * @param values Source ips
   */
  constructor(public readonly values: string[]) {
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public renderRawCondition(): RawListenerRuleConditionProps {
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

  private readonly conditions: {[key: string]: IListenerRuleCondition} = {};

  private readonly actions: any[] = [];
  private readonly listener: IApplicationListener;

  constructor(scope: cdk.Construct, id: string, props: ApplicationListenerRuleProps) {
    super(scope, id);

    const hasPathPatterns = props.pathPatterns || props.pathPattern;
    if (!props.hostHeader && !hasPathPatterns) {
      throw new Error('At least one of \'hostHeader\', \'pathPattern\' or \'pathPatterns\' is required when defining a load balancing rule.');
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
      this.addCondition(new HostHeaderListenerRuleCondition([props.hostHeader]));
    }

    if (hasPathPatterns) {
      if (props.pathPattern && props.pathPatterns) {
        throw new Error('Both `pathPatterns` and `pathPattern` are specified, specify only one');
      }
      const pathPattern = props.pathPattern ? [props.pathPattern] : props.pathPatterns!;
      this.addCondition(new PathPatternListenerRuleCondition(pathPattern));
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
      this.removeCondition(field);
      return;
    }

    const condition = this.createConditionObject(field, values);
    this.addCondition(condition);
  }

  /**
   * Add a non-standard condition to this rule
   *
   * If the condition conflicts with an already set condition, it will be overwritten by the one you specified.
   */
  public addCondition(condition: IListenerRuleCondition) {
    this.conditions[condition.field] = condition;
  }

  /**
   * Remove a non-standard condition to this rule
   */
  public removeCondition(field: string): void {
    delete this.conditions[field];
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
    if (Object.keys(this.conditions).length === 0) {
      throw ['Listener rule needs at least one condition'];
    }
    return [];
  }

  /**
   * Create a new listener rule condition object to migrate from old interface
   */
  private createConditionObject(field: string, values: string[]) {
    switch (field) {
      case 'host-header':
        return new HostHeaderListenerRuleCondition(values);
      case 'http-request-method':
        return new HttpRequestMethodListenerRuleCondition(values);
      case 'path-pattern':
        return new PathPatternListenerRuleCondition(values);
      case 'source-ip':
        return new SourceIpListenerRuleCondition(values);
      default:
        throw new Error(`Must specify ${field} as condition object`);
    }
  }

  /**
   * Render the conditions for this rule
   */
  private renderConditions(): RawListenerRuleConditionProps[] {
    return Object.values(this.conditions).map(condition => condition.renderRawCondition());
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
