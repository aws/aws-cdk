import type { Construct } from 'constructs';
import type { IDomainNameRef, IRestApiRef } from './apigateway.generated';
import { RestApiBase } from './restapi';
import type { Stage } from './stage';
import * as apigwv2 from '../../aws-apigatewayv2';
import { Resource, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Routing rule priority. Lower values are evaluated first.
 * Must be in range 0–999999.
 */
const PRIORITY_MIN = 0;
const PRIORITY_MAX = 999999;

/**
 * Header name max length and allowed pattern per AWS routing rules restrictions.
 * Allowed: a-z, A-Z, 0-9, and *?-!#$%&'.^_`|~
 */
const HEADER_NAME_MAX_LEN = 40;
const HEADER_NAME_PATTERN = /^[a-zA-Z0-9*?\-!#$%&'.^_`|~]+$/;

/**
 * Header value glob max length. Allowed: a-z, A-Z, 0-9, and *?-!#$%&'.^_`|~
 */
const VALUE_GLOB_MAX_LEN = 128;

/**
 * Condition for matching a request in a routing rule.
 * You can specify base paths, headers, or both (AND logic).
 */
export interface RoutingRuleCondition {
  /**
   * Base path(s) to match. Request path must match one of these (case-sensitive).
   * Each base path is a single path segment (e.g. 'users', 'orders').
   */
  readonly basePaths?: string[];

  /**
   * Header condition(s). Request must match at least one of these (anyOf).
   * Header names are case-insensitive; value globs are case-sensitive.
   */
  readonly headers?: RoutingRuleHeaderCondition[];
}

/**
 * A header name and value glob to match in a routing rule condition.
 */
export interface RoutingRuleHeaderCondition {
  /**
   * Case-insensitive header name. Max 40 chars; allowed: a-z, A-Z, 0-9, *?-!#$%&'.^_`|~
   */
  readonly header: string;

  /**
   * Case-sensitive glob for the header value. Max 128 chars.
   * Supports *prefix*, *suffix*, *infix* style wildcards.
   */
  readonly valueGlob: string;
}

/**
 * Action for a routing rule: invoke a REST API stage.
 */
export interface RoutingRuleAction {
  /**
   * The REST API to invoke.
   */
  readonly restApi: IRestApiRef;

  /**
   * The stage to invoke. If omitted, uses the API's deployment stage.
   */
  readonly stage?: Stage;

  /**
   * When true, API Gateway strips the matched base path before forwarding to the target API.
   * @default false
   */
  readonly stripBasePath?: boolean;
}

/**
 * Options for adding a routing rule to a domain via DomainName.addRoutingRule().
 */
export interface AddRoutingRuleOptions {
  /**
   * Priority (0–999999). Lower values are evaluated first.
   */
  readonly priority: number;

  /**
   * Conditions that must match for this rule to apply.
   * Omit or pass empty for a catch-all rule.
   */
  readonly conditions?: RoutingRuleCondition;

  /**
   * Action to perform when the rule matches.
   */
  readonly action: RoutingRuleAction;
}

export interface RoutingRuleProps {
  /**
   * The domain name (or reference) this rule is attached to.
   */
  readonly domainName: IDomainNameRef;

  /**
   * Priority (0–999999). Lower values are evaluated first.
   */
  readonly priority: number;

  /**
   * Conditions that must match for this rule to apply.
   * Omit or pass empty for a catch-all rule.
   */
  readonly conditions?: RoutingRuleCondition;

  /**
   * Action to perform when the rule matches.
   */
  readonly action: RoutingRuleAction;
}

function validatePriority(priority: number, scope: Construct): void {
  if (Token.isUnresolved(priority)) return;
  if (typeof priority !== 'number' || priority < PRIORITY_MIN || priority > PRIORITY_MAX) {
    throw new ValidationError(
      `Routing rule priority must be between ${PRIORITY_MIN} and ${PRIORITY_MAX}, got: ${priority}`,
      scope,
    );
  }
}

function validateHeaderCondition(h: RoutingRuleHeaderCondition, scope: Construct): void {
  if (Token.isUnresolved(h.header) || Token.isUnresolved(h.valueGlob)) return;
  if (h.header.length > HEADER_NAME_MAX_LEN) {
    throw new ValidationError(
      `Routing rule header name must be at most ${HEADER_NAME_MAX_LEN} characters, got: ${h.header.length}`,
      scope,
    );
  }
  if (!HEADER_NAME_PATTERN.test(h.header)) {
    throw new ValidationError(
      'Routing rule header name may only contain a-z, A-Z, 0-9, and *?-!#$%&\'.^_`|~, got: ' + h.header,
      scope,
    );
  }
  if (h.valueGlob.length > VALUE_GLOB_MAX_LEN) {
    throw new ValidationError(
      `Routing rule header valueGlob must be at most ${VALUE_GLOB_MAX_LEN} characters, got: ${h.valueGlob.length}`,
      scope,
    );
  }
}

function validateConditions(conditions: RoutingRuleCondition | undefined, scope: Construct): void {
  if (!conditions) return;
  if (conditions.headers) {
    if (conditions.headers.length > 2) {
      throw new ValidationError('Routing rule may have at most 2 matchHeaders conditions', scope);
    }
    conditions.headers.forEach((h) => validateHeaderCondition(h, scope));
  }
}

/**
 * L2 construct for an API Gateway routing rule on a custom domain.
 * Routes traffic to a REST API stage when conditions (base path and/or headers) match.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-routing-rules-use.html
 */
@propertyInjectable
export class RoutingRule extends Resource {
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigateway.RoutingRule';

  constructor(scope: Construct, id: string, props: RoutingRuleProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    validatePriority(props.priority, this);
    validateConditions(props.conditions, this);

    const domainNameArn = props.domainName.domainNameRef.domainNameArn;
    const restApi = props.action.restApi;
    const stage = props.action.stage ?? (restApi instanceof RestApiBase ? restApi.deploymentStage : undefined);
    if (!stage) {
      throw new ValidationError(
        'Routing rule action must specify a stage or use a RestApi with a deployment stage',
        this,
      );
    }

    // One condition object can have both matchBasePaths and matchHeaders (AND logic).
    const conditionList: apigwv2.CfnRoutingRule.ConditionProperty[] = [
      {
        ...(props.conditions?.basePaths?.length
          ? { matchBasePaths: { anyOf: props.conditions.basePaths } }
          : {}),
        ...(props.conditions?.headers?.length
          ? {
            matchHeaders: {
              anyOf: props.conditions.headers.map((h) => ({ header: h.header, valueGlob: h.valueGlob })),
            },
          }
          : {}),
      },
    ];

    new apigwv2.CfnRoutingRule(this, 'Resource', {
      domainNameArn,
      priority: props.priority,
      conditions: conditionList,
      actions: [
        {
          invokeApi: {
            apiId: restApi.restApiRef.restApiId,
            stage: stage.stageRef.stageName,
            stripBasePath: props.action.stripBasePath ?? false,
          },
        },
      ],
    });
  }
}
