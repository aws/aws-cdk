import type { Construct } from 'constructs';
import type { IDomainNameRef } from './apigateway.generated';
import { RestApiBase } from './restapi';
import type { IRestApi } from './restapi';
import type { IStage } from './stage';
import * as apigwv2 from '../../aws-apigatewayv2';
import type { IResource } from '../../core';
import { Resource, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { aws_apigatewayv2 } from '../../interfaces';

/**
 * How a custom domain routes requests: base path mappings, routing rules, or both.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/set-routing-mode.html
 */
export enum RoutingMode {
  /**
   * Base path mappings only (default). Routing rules cannot be added.
   */
  BASE_PATH_MAPPING_ONLY = 'BASE_PATH_MAPPING_ONLY',

  /**
   * Routing rules only. Base path mappings cannot be added.
   */
  ROUTING_RULE_ONLY = 'ROUTING_RULE_ONLY',

  /**
   * Routing rules are evaluated first, then base path and API mappings.
   *
   * Both `addRoutingRule()` and `addApiMapping()` / `addBasePathMapping()` can be used.
   */
  ROUTING_RULE_THEN_BASE_PATH_MAPPING = 'ROUTING_RULE_THEN_BASE_PATH_MAPPING',
}

/**
 * A header condition to match against an incoming request.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html
 */
export interface RoutingRuleHeaderMatch {
  /**
   * The header name to match (case insensitive).
   */
  readonly header: string;

  /**
   * The glob value to match against the header value (case sensitive).
   *
   * Wildcards are supported as `*prefix`, `suffix*`, or `*infix*`.
   */
  readonly valueGlob: string;
}

/**
 * The conditions to match against an incoming request.
 *
 * A base path and header conditions are combined with AND. A rule with no
 * conditions is a catch-all.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html
 */
export interface RoutingRuleConditions {
  /**
   * The base path to match (case sensitive). Only one base path per rule.
   *
   * @default - no base path condition
   */
  readonly basePath?: string;

  /**
   * The headers to match. Up to two, combined with AND.
   *
   * @default - no header condition
   */
  readonly headers?: RoutingRuleHeaderMatch[];
}

/**
 * The action to perform when a rule's conditions match: invoke a REST API stage.
 */
export interface RoutingRuleAction {
  /**
   * The target REST API to invoke. Must be in the same account as the domain.
   *
   * [disable-awslint:ref-via-interface]
   * [disable-awslint:prefer-ref-interface]
   */
  readonly restApi: IRestApi;

  /**
   * The stage of the target REST API to invoke.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - the deployment stage of the target REST API
   */
  readonly stage?: IStage;

  /**
   * Strip the matched base path before forwarding to the target API.
   *
   * Requires a `basePath` condition.
   *
   * @default false
   */
  readonly stripBasePath?: boolean;
}

/**
 * Options for adding a routing rule to a domain name.
 */
export interface RoutingRuleOptions {
  /**
   * Evaluation order, from lowest to highest. Must be unique across rules,
   * between 1 and 1,000,000.
   */
  readonly priority: number;

  /**
   * The action to perform when the conditions match.
   */
  readonly action: RoutingRuleAction;

  /**
   * The conditions to match. Omit for a catch-all rule.
   *
   * @default - no conditions (catch-all rule)
   */
  readonly conditions?: RoutingRuleConditions;
}

/**
 * Properties for a `RoutingRule`.
 */
export interface RoutingRuleProps extends RoutingRuleOptions {
  /**
   * The domain name to associate with this routing rule.
   */
  readonly domainName: IDomainNameRef;
}

const MIN_PRIORITY = 1;
const MAX_PRIORITY = 1_000_000;
const MAX_HEADER_CONDITIONS = 2;
const MAX_HEADER_NAME_LENGTH = 40;
const MAX_HEADER_GLOB_LENGTH = 128;
// Max total length (incl. wildcards) of an infix-match glob. Not in the API reference,
// which documents only the 128-char value glob limit; the 40-char infix cap was observed
// against the service (a 41-char infix glob is rejected).
const MAX_INFIX_GLOB_LENGTH = 40;
const MAX_BASE_PATH_LENGTH = 128;

/**
 * Header names that are not supported as routing rule conditions.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html#rest-api-routing-rules-restrictions
 */
const RESTRICTED_HEADER_EXACT = [
  'authorization',
  'connection',
  'content-encoding',
  'content-length',
  'content-location',
  'forwarded',
  'keep-alive',
  'origin',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'x-apigw-api-id',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-restapi',
  'via',
];

/**
 * Header name prefixes that are not supported as routing rule conditions.
 */
const RESTRICTED_HEADER_PREFIXES = [
  'access-control-',
  'apigw-',
  'x-amz-',
  'x-amzn-',
];

// '*' is allowed in header names: the service accepts it despite the docs.
const HEADER_NAME_PATTERN = /^[a-zA-Z0-9*?\-!#$%&'.^_`|~]+$/;
const HEADER_GLOB_PATTERN = /^[a-zA-Z0-9*?\-!#$%&'.^_`|~]+$/;
const BASE_PATH_PATTERN = /^[a-zA-Z0-9$\-_.+!*'()/]+$/;

const ROUTING_RULE_SYMBOL = Symbol.for('@aws-cdk/aws-apigateway.RoutingRule');

/**
 * Represents a routing rule.
 */
export interface IRoutingRule extends IResource, aws_apigatewayv2.IRoutingRuleRef {
  /**
   * The ARN of this routing rule.
   *
   * @attribute
   */
  readonly routingRuleArn: string;
}

/**
 * A routing rule for a custom domain name.
 *
 * Routes traffic from a single custom domain to multiple REST APIs based on request
 * path or headers. Only supported for `REGIONAL` endpoints with a `routingMode` of
 * `ROUTING_RULE_ONLY` or `ROUTING_RULE_THEN_BASE_PATH_MAPPING`.
 *
 * Prefer `DomainName.addRoutingRule()` unless the domain is imported.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html
 * @resource AWS::ApiGatewayV2::RoutingRule
 */
@propertyInjectable
export class RoutingRule extends Resource implements IRoutingRule {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigateway.RoutingRule';

  /**
   * Returns whether the given object is a `RoutingRule`.
   */
  public static isRoutingRule(x: any): x is RoutingRule {
    return x !== null && typeof x === 'object' && ROUTING_RULE_SYMBOL in x;
  }

  /**
   * The ARN of this routing rule.
   *
   * @attribute
   */
  public readonly routingRuleArn: string;

  public readonly routingRuleRef: aws_apigatewayv2.RoutingRuleReference;

  constructor(scope: Construct, id: string, props: RoutingRuleProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    Object.defineProperty(this, ROUTING_RULE_SYMBOL, { value: true });

    this.validatePriority(props.priority);
    const conditions = this.renderConditions(props.conditions);

    // stripBasePath is only valid with a base path condition.
    if (props.action.stripBasePath && props.conditions?.basePath === undefined) {
      throw new ValidationError(
        lit`RoutingRuleStripBasePathRequiresBasePath`,
        'stripBasePath can only be set when the routing rule has a basePath condition',
        this,
      );
    }

    const stage = props.action.stage
      ?? (props.action.restApi instanceof RestApiBase ? props.action.restApi.deploymentStage : undefined);
    if (!stage) {
      throw new ValidationError(
        lit`RoutingRuleStageRequired`,
        'a stage must be provided in the routing rule action when the target restApi does not have a deployment stage',
        this,
      );
    }

    const resource = new apigwv2.CfnRoutingRule(this, 'Resource', {
      domainNameArn: props.domainName.domainNameRef.domainNameArn,
      priority: props.priority,
      conditions,
      actions: [{
        invokeApi: {
          apiId: props.action.restApi.restApiId,
          stage: stage.stageName,
          stripBasePath: props.action.stripBasePath,
        },
      }],
    });

    this.routingRuleArn = resource.attrRoutingRuleArn;
    this.routingRuleRef = resource.routingRuleRef;
  }

  private validatePriority(priority: number): void {
    if (Token.isUnresolved(priority)) {
      return;
    }
    if (!Number.isInteger(priority) || priority < MIN_PRIORITY || priority > MAX_PRIORITY) {
      throw new ValidationError(
        lit`RoutingRuleInvalidPriority`,
        `priority must be an integer between ${MIN_PRIORITY} and ${MAX_PRIORITY}, got: ${JSON.stringify(priority)}`,
        this,
      );
    }
  }

  private renderConditions(conditions?: RoutingRuleConditions): apigwv2.CfnRoutingRule.ConditionProperty[] {
    if (!conditions) {
      return [];
    }

    const rendered: apigwv2.CfnRoutingRule.ConditionProperty[] = [];

    if (conditions.basePath !== undefined) {
      this.validateBasePath(conditions.basePath);
      rendered.push({ matchBasePaths: { anyOf: [conditions.basePath] } });
    }

    if (conditions.headers && conditions.headers.length > 0) {
      if (conditions.headers.length > MAX_HEADER_CONDITIONS) {
        throw new ValidationError(
          lit`RoutingRuleTooManyHeaders`,
          `a routing rule condition supports at most ${MAX_HEADER_CONDITIONS} header conditions, got: ${conditions.headers.length}`,
          this,
        );
      }
      for (const header of conditions.headers) {
        this.validateHeader(header);
      }
      rendered.push({
        matchHeaders: {
          anyOf: conditions.headers.map(h => ({ header: h.header, valueGlob: h.valueGlob })),
        },
      });
    }

    return rendered;
  }

  private validateBasePath(basePath: string): void {
    if (Token.isUnresolved(basePath)) {
      return;
    }
    if (basePath.length === 0) {
      throw new ValidationError(
        lit`RoutingRuleBasePathRequired`,
        'a base path condition cannot be empty',
        this,
      );
    }
    if (basePath.length >= MAX_BASE_PATH_LENGTH) {
      throw new ValidationError(
        lit`RoutingRuleBasePathTooLong`,
        `a base path condition must be less than ${MAX_BASE_PATH_LENGTH} characters, got: ${JSON.stringify(basePath)}`,
        this,
      );
    }
    if (basePath.includes('\\')) {
      throw new ValidationError(
        lit`RoutingRuleBasePathBackslash`,
        `a base path condition cannot contain a backslash, got: ${JSON.stringify(basePath)}`,
        this,
      );
    }
    if (!BASE_PATH_PATTERN.test(basePath)) {
      throw new ValidationError(
        lit`RoutingRuleBasePathInvalidCharacters`,
        `a base path condition may only contain letters, numbers, and the characters "$-_.+!*'()/", got: ${JSON.stringify(basePath)}`,
        this,
      );
    }
  }

  private validateHeader(header: RoutingRuleHeaderMatch): void {
    this.validateHeaderName(header.header);
    this.validateHeaderGlob(header.valueGlob);
  }

  private validateHeaderName(name: string): void {
    if (Token.isUnresolved(name)) {
      return;
    }
    if (name.length === 0) {
      throw new ValidationError(
        lit`RoutingRuleHeaderNameRequired`,
        'a header name cannot be empty',
        this,
      );
    }
    if (name.length >= MAX_HEADER_NAME_LENGTH) {
      throw new ValidationError(
        lit`RoutingRuleHeaderNameTooLong`,
        `a header name must be less than ${MAX_HEADER_NAME_LENGTH} characters, got: ${JSON.stringify(name)}`,
        this,
      );
    }
    if (!HEADER_NAME_PATTERN.test(name)) {
      throw new ValidationError(
        lit`RoutingRuleHeaderNameInvalidCharacters`,
        `a header name may only contain letters, numbers, and the characters "*?-!#$%&'.^_\`|~", got: ${JSON.stringify(name)}`,
        this,
      );
    }

    const lower = name.toLowerCase();
    if (RESTRICTED_HEADER_EXACT.includes(lower) || RESTRICTED_HEADER_PREFIXES.some(prefix => lower.startsWith(prefix))) {
      throw new ValidationError(
        lit`RoutingRuleHeaderNameRestricted`,
        `header ${JSON.stringify(name)} is not supported as a routing rule condition. ` +
        'See: https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html#rest-api-routing-rules-restrictions',
        this,
      );
    }
  }

  private validateHeaderGlob(glob: string): void {
    if (Token.isUnresolved(glob)) {
      return;
    }
    if (glob.length === 0) {
      throw new ValidationError(
        lit`RoutingRuleHeaderGlobRequired`,
        'a header glob value cannot be empty',
        this,
      );
    }
    if (glob.length >= MAX_HEADER_GLOB_LENGTH) {
      throw new ValidationError(
        lit`RoutingRuleHeaderGlobTooLong`,
        `a header glob value must be less than ${MAX_HEADER_GLOB_LENGTH} characters, got: ${JSON.stringify(glob)}`,
        this,
      );
    }
    if (!HEADER_GLOB_PATTERN.test(glob)) {
      throw new ValidationError(
        lit`RoutingRuleHeaderGlobInvalidCharacters`,
        `a header glob value may only contain letters, numbers, and the characters "*?-!#$%&'.^_\`|~", got: ${JSON.stringify(glob)}`,
        this,
      );
    }

    // A wildcard is only allowed as a prefix match (*match), suffix match (match*),
    // or infix match (*match*). It cannot appear in the middle of the value.
    const wildcardCount = (glob.match(/\*/g) ?? []).length;
    if (wildcardCount > 0) {
      const isPrefixMatch = glob.startsWith('*') && wildcardCount === 1;
      const isSuffixMatch = glob.endsWith('*') && wildcardCount === 1;
      const isInfixMatch = glob.startsWith('*') && glob.endsWith('*') && wildcardCount === 2 && glob.length > 2;
      if (!isPrefixMatch && !isSuffixMatch && !isInfixMatch) {
        throw new ValidationError(
          lit`RoutingRuleHeaderGlobInvalidWildcard`,
          `a header glob value may only use a wildcard as "*prefix-match", "suffix-match*", or "*infix*-match", got: ${JSON.stringify(glob)}`,
          this,
        );
      }
      if (isInfixMatch) {
        if (glob.length > MAX_INFIX_GLOB_LENGTH) {
          throw new ValidationError(
            lit`RoutingRuleHeaderInfixGlobTooLong`,
            `a header glob value for an infix match must be at most ${MAX_INFIX_GLOB_LENGTH} characters, got: ${JSON.stringify(glob)}`,
            this,
          );
        }
      }
    }
  }
}
