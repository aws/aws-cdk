/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { cedarActionUid, cedarAttrPath, cedarEntityId, cedarLong, cedarPath, cedarString } from './cedar-encoding';
import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';

/**
 * Effect of a policy statement, whether it permits or forbids the action.
 */
export enum PolicyEffect {
  /**
   * Permit the action when the statement matches and its conditions hold.
   *
   * Multiple permit statements can apply, and any matching permit grants access.
   */
  PERMIT = 'permit',

  /**
   * Forbid the action when the statement matches and its conditions hold.
   *
   * A forbid always takes precedence over any permit.
   */
  FORBID = 'forbid',
}

/**
 * The right-hand operand of a condition. Modelling this as a typed union means an
 * operand can only be produced through one of these shapes, so a caller value can
 * never reach the generated policy without first passing through the encoder in
 * `ConditionExpression.toCedar()`. Kept internal, so jsii never sees it.
 */
type CedarOperand =
  | { readonly kind: 'literal'; readonly value: string | number | boolean }
  | { readonly kind: 'set'; readonly members: (string | number)[] }
  | { readonly kind: 'ip'; readonly cidr: string };

/**
 * How a condition renders around its operand. Kept internal, so jsii never sees it.
 * - `infix`: `${lhs} ${symbol} ${operand}` (==, !=, <, <=, >, >=)
 * - `method`: `${lhs}.${name}(${operand})` (isInRange, contains)
 * - `setContains`: `${operand}.contains(${lhs})` (scalar set membership)
 */
type ConditionRender =
  | { readonly kind: 'infix'; readonly symbol: string }
  | { readonly kind: 'method'; readonly name: string }
  | { readonly kind: 'setContains' };

/**
 * A single condition expression in Cedar policy language.
 */
class ConditionExpression {
  constructor(
    private readonly lhs: string,
    private readonly render: ConditionRender,
    private readonly operand: CedarOperand,
  ) {}

  public toCedar(): string {
    const operand = this.operandToCedar();
    switch (this.render.kind) {
      case 'infix':
        return `${this.lhs} ${this.render.symbol} ${operand}`;
      case 'method':
        return `${this.lhs}.${this.render.name}(${operand})`;
      case 'setContains':
        // Cedar `contains` is a set method: `[set].contains(element)`.
        return `${operand}.contains(${this.lhs})`;
    }
  }

  private operandToCedar(): string {
    switch (this.operand.kind) {
      case 'literal':
        return this.literalToCedar(this.operand.value, 'condition value');
      case 'set':
        return `[${this.operand.members.map((m) => this.literalToCedar(m, 'set member')).join(', ')}]`;
      case 'ip':
        return `ip(${cedarString(this.operand.cidr, 'ipRange')})`;
    }
  }

  private literalToCedar(value: string | number | boolean, field: string): string {
    if (typeof value === 'string') {
      return cedarString(value, field);
    }
    if (typeof value === 'number') {
      return cedarLong(value, field);
    }
    return value ? 'true' : 'false';
  }
}

/**
 * One node of a condition tree: either a comparison, or a group of conditions
 * joined by a single boolean operator. Kept internal, so jsii never sees it.
 */
type ConditionNode =
  | {
    readonly kind: 'leaf';
    readonly attribute: PolicyAttribute;
    readonly render: ConditionRender;
    readonly operand: CedarOperand;
  }
  | {
    readonly kind: 'group';
    readonly operator: '&&' | '||';
    readonly members: PolicyCondition[];
  };

/**
 * An attribute of the request that a condition can compare against.
 *
 * Cedar exposes three sources of attributes. Which one you want depends on where the
 * value comes from: the caller, the thing being accessed, or the request environment.
 *
 * @example
 * import { PolicyAttribute } from 'aws-cdk-lib/aws-bedrockagentcore';
 *
 * PolicyAttribute.principal('department'); // principal.department
 * PolicyAttribute.resource('confidential'); // resource.confidential
 * PolicyAttribute.context('sourceIp'); // context.sourceIp
 */
export class PolicyAttribute {
  /**
   * An attribute of the principal, meaning the authenticated user or service making
   * the request. For example `username`, `department` or `groups`.
   *
   * @param attribute - The attribute name
   */
  public static principal(attribute: string): PolicyAttribute {
    return new PolicyAttribute('principal', attribute);
  }

  /**
   * An attribute of the resource being accessed. For example `owner` or
   * `classification`.
   *
   * @param attribute - The attribute name
   */
  public static resource(attribute: string): PolicyAttribute {
    return new PolicyAttribute('resource', attribute);
  }

  /**
   * An attribute of the request context, meaning the request environment rather than
   * either entity. For example `sourceIp`, `environment` or `timestamp`.
   *
   * @param attribute - The attribute name
   */
  public static context(attribute: string): PolicyAttribute {
    return new PolicyAttribute('context', attribute);
  }

  private constructor(
    private readonly source: string,
    private readonly attribute: string,
  ) {}

  /**
   * Render this attribute as a Cedar attribute path.
   * @internal
   */
  public _toCedar(): string {
    return cedarAttrPath(this.source, this.attribute);
  }
}

/**
 * A condition on a policy statement.
 *
 * A condition compares a request attribute against a value. Conditions are grouped
 * into the `when` and `unless` clauses of a statement, where the members of a clause
 * must all hold.
 *
 * Comparisons are named for the type of value they accept, so each one takes a
 * concrete type rather than a union. Use `allOf` and `anyOf` to build a nested
 * boolean expression, which also makes the grouping explicit in the generated Cedar.
 *
 * @example
 * import { PolicyAttribute, PolicyCondition } from 'aws-cdk-lib/aws-bedrockagentcore';
 *
 * // principal.department == "Engineering"
 * PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering');
 *
 * // (principal.department == "Engineering" || principal.department == "Support")
 * PolicyCondition.anyOf([
 *   PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
 *   PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Support'),
 * ]);
 */
export class PolicyCondition {
  /**
   * The attribute equals a string value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static stringEquals(attribute: PolicyAttribute, value: string): PolicyCondition {
    return PolicyCondition.infix(attribute, '==', { kind: 'literal', value });
  }

  /**
   * The attribute does not equal a string value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static stringNotEquals(attribute: PolicyAttribute, value: string): PolicyCondition {
    return PolicyCondition.infix(attribute, '!=', { kind: 'literal', value });
  }

  /**
   * The attribute equals a number value.
   *
   * Cedar whole numbers are 64-bit signed integers, so the value must be an integer.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberEquals(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '==', { kind: 'literal', value });
  }

  /**
   * The attribute does not equal a number value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberNotEquals(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '!=', { kind: 'literal', value });
  }

  /**
   * The attribute is less than a number value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberLessThan(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '<', { kind: 'literal', value });
  }

  /**
   * The attribute is less than or equal to a number value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberLessThanOrEquals(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '<=', { kind: 'literal', value });
  }

  /**
   * The attribute is greater than a number value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberGreaterThan(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '>', { kind: 'literal', value });
  }

  /**
   * The attribute is greater than or equal to a number value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static numberGreaterThanOrEquals(attribute: PolicyAttribute, value: number): PolicyCondition {
    return PolicyCondition.infix(attribute, '>=', { kind: 'literal', value });
  }

  /**
   * The attribute equals a boolean value.
   *
   * @param attribute - The attribute to compare
   * @param value - The value to compare against
   */
  public static booleanEquals(attribute: PolicyAttribute, value: boolean): PolicyCondition {
    return PolicyCondition.infix(attribute, '==', { kind: 'literal', value });
  }

  /**
   * The attribute is an IP address inside the given CIDR range.
   *
   * @param attribute - The attribute holding an IP address
   * @param cidr - The range in CIDR notation, for example '192.168.1.0/24'
   */
  public static ipInRange(attribute: PolicyAttribute, cidr: string): PolicyCondition {
    return new PolicyCondition({
      kind: 'leaf',
      attribute,
      render: { kind: 'method', name: 'isInRange' },
      operand: { kind: 'ip', cidr },
    });
  }

  /**
   * The attribute is a set that contains the given value.
   *
   * Use this when the attribute itself holds a set, for example `principal.groups`.
   * To test a scalar attribute against a list of allowed values, use `stringIn` or
   * `numberIn` instead.
   *
   * @param attribute - The attribute holding a set
   * @param value - The member to look for
   */
  public static setContains(attribute: PolicyAttribute, value: string): PolicyCondition {
    return new PolicyCondition({
      kind: 'leaf',
      attribute,
      render: { kind: 'method', name: 'contains' },
      operand: { kind: 'literal', value },
    });
  }

  /**
   * The attribute is one of the given string values.
   *
   * @param attribute - The attribute to compare
   * @param values - The allowed values, at least one
   */
  public static stringIn(attribute: PolicyAttribute, values: string[]): PolicyCondition {
    return PolicyCondition.memberOf(attribute, values);
  }

  /**
   * The attribute is one of the given number values.
   *
   * @param attribute - The attribute to compare
   * @param values - The allowed values, at least one
   */
  public static numberIn(attribute: PolicyAttribute, values: number[]): PolicyCondition {
    return PolicyCondition.memberOf(attribute, values);
  }

  /**
   * All of the given conditions must hold.
   *
   * Renders as a parenthesised `&&` group, so it can be nested inside `anyOf`
   * without relying on operator precedence.
   *
   * @param conditions - The conditions to combine, at least one
   */
  public static allOf(conditions: PolicyCondition[]): PolicyCondition {
    return PolicyCondition.group(conditions, '&&', 'allOf');
  }

  /**
   * At least one of the given conditions must hold.
   *
   * Renders as a parenthesised `||` group, so it can be nested inside `allOf` or
   * combined with the surrounding clause without relying on operator precedence.
   *
   * @param conditions - The conditions to combine, at least one
   */
  public static anyOf(conditions: PolicyCondition[]): PolicyCondition {
    return PolicyCondition.group(conditions, '||', 'anyOf');
  }

  private static infix(attribute: PolicyAttribute, symbol: string, operand: CedarOperand): PolicyCondition {
    return new PolicyCondition({ kind: 'leaf', attribute, render: { kind: 'infix', symbol }, operand });
  }

  private static memberOf(attribute: PolicyAttribute, members: (string | number)[]): PolicyCondition {
    if (members.length === 0) {
      throw new UnscopedValidationError(lit`AtLeastOneValue`, 'At least one value must be specified');
    }
    return new PolicyCondition({
      kind: 'leaf',
      attribute,
      render: { kind: 'setContains' },
      operand: { kind: 'set', members },
    });
  }

  private static group(conditions: PolicyCondition[], operator: '&&' | '||', method: string): PolicyCondition {
    if (conditions.length === 0) {
      throw new UnscopedValidationError(
        lit`AtLeastOneCondition`,
        `At least one condition must be specified for ${method}()`,
      );
    }
    return new PolicyCondition({ kind: 'group', operator, members: conditions });
  }

  private constructor(private readonly node: ConditionNode) {}

  /**
   * Render this condition as a Cedar expression.
   * @internal
   */
  public _toCedar(): string {
    if (this.node.kind === 'leaf') {
      return new ConditionExpression(this.node.attribute._toCedar(), this.node.render, this.node.operand).toCedar();
    }

    const members = this.node.members.map((member) => member._toCedar());
    // A single member needs no grouping, and parenthesising it would only add noise.
    return members.length === 1 ? members[0] : `(${members.join(` ${this.node.operator} `)})`;
  }
}

/**
 * The principal a policy statement applies to.
 *
 * @example
 * import { PolicyPrincipal } from 'aws-cdk-lib/aws-bedrockagentcore';
 *
 * PolicyPrincipal.any(); // principal
 * PolicyPrincipal.entityType('AgentCore::OAuthUser'); // principal is AgentCore::OAuthUser
 * PolicyPrincipal.entity('AgentCore::OAuthUser', 'user123'); // principal == AgentCore::OAuthUser::"user123"
 * PolicyPrincipal.inGroup('AgentCore::OAuthGroup', 'admins'); // principal in AgentCore::OAuthGroup::"admins"
 */
export class PolicyPrincipal {
  /**
   * Any principal, whoever the caller is.
   */
  public static any(): PolicyPrincipal {
    return new PolicyPrincipal();
  }

  /**
   * Any principal of the given entity type.
   *
   * @param entityType - The entity type, for example 'AgentCore::OAuthUser'
   */
  public static entityType(entityType: string): PolicyPrincipal {
    return new PolicyPrincipal({ entityType });
  }

  /**
   * One specific principal.
   *
   * @param entityType - The entity type, for example 'AgentCore::OAuthUser'
   * @param entityId - The entity identifier
   */
  public static entity(entityType: string, entityId: string): PolicyPrincipal {
    return new PolicyPrincipal({ entityType, entityId });
  }

  /**
   * Any principal that is a member of the given group.
   *
   * @param groupType - The group entity type, for example 'AgentCore::OAuthGroup'
   * @param groupId - The group identifier
   */
  public static inGroup(groupType: string, groupId: string): PolicyPrincipal {
    return new PolicyPrincipal({ memberOf: { entityType: groupType, entityId: groupId } });
  }

  private constructor(
    private readonly config?: {
      readonly entityType?: string;
      readonly entityId?: string;
      readonly memberOf?: { readonly entityType: string; readonly entityId: string };
    },
  ) {}

  /**
   * Render this principal as a Cedar principal scope.
   * @internal
   */
  public _toCedar(): string {
    if (!this.config) {
      return 'principal';
    }

    if (this.config.memberOf) {
      const { entityType, entityId } = this.config.memberOf;
      return `principal in ${cedarPath(entityType, 'principal group type')}::${cedarEntityId(entityId, 'group id')}`;
    }

    const entityType = cedarPath(this.config.entityType!, 'principal type');
    if (this.config.entityId === undefined) {
      return `principal is ${entityType}`;
    }
    // An explicit empty id is rejected by cedarEntityId, which points the caller at
    // entityType() rather than silently widening the scope of the statement.
    const entityId = cedarEntityId(this.config.entityId, 'principal id', 'Use entityType() to match any entity of the type.');
    return `principal == ${entityType}::${entityId}`;
  }
}

/**
 * The action a policy statement applies to.
 *
 * @example
 * import { PolicyAction } from 'aws-cdk-lib/aws-bedrockagentcore';
 *
 * PolicyAction.any(); // action
 * PolicyAction.one('AgentCore::Action::GetGateway'); // action == AgentCore::Action::"GetGateway"
 * PolicyAction.anyOf([ // action in [AgentCore::Action::"GetGateway", AgentCore::Action::"ListGateways"]
 *   'AgentCore::Action::GetGateway',
 *   'AgentCore::Action::ListGateways',
 * ]);
 */
export class PolicyAction {
  /**
   * Any action.
   */
  public static any(): PolicyAction {
    return new PolicyAction();
  }

  /**
   * One specific action.
   *
   * @param action - The action name, for example 'AgentCore::Action::GetGateway'
   */
  public static one(action: string): PolicyAction {
    return PolicyAction.anyOf([action]);
  }

  /**
   * Any one of the given actions.
   *
   * @param actions - The action names, at least one
   */
  public static anyOf(actions: string[]): PolicyAction {
    if (actions.length === 0) {
      throw new UnscopedValidationError(lit`AtLeastOneAction`, 'At least one action must be specified');
    }
    return new PolicyAction(actions);
  }

  private constructor(private readonly actions?: string[]) {}

  /**
   * Render this action as a Cedar action scope.
   * @internal
   */
  public _toCedar(): string {
    if (!this.actions) {
      return 'action';
    }
    if (this.actions.length === 1) {
      return `action == ${cedarActionUid(this.actions[0])}`;
    }
    return `action in [${this.actions.map((action) => cedarActionUid(action)).join(', ')}]`;
  }
}

/**
 * The resource a policy statement applies to.
 *
 * AgentCore rejects a policy whose resource is an unconstrained wildcard, so a
 * statement must name either a resource type or a specific resource.
 *
 * @example
 * import { PolicyResource } from 'aws-cdk-lib/aws-bedrockagentcore';
 * declare const gatewayArn: string;
 *
 * PolicyResource.anyOfType('AgentCore::Gateway'); // resource is AgentCore::Gateway
 * PolicyResource.instance('AgentCore::Gateway', gatewayArn); // resource == AgentCore::Gateway::"<arn>"
 */
export class PolicyResource {
  /**
   * Any resource of the given entity type.
   *
   * @param entityType - The entity type, for example 'AgentCore::Gateway'
   */
  public static anyOfType(entityType: string): PolicyResource {
    return new PolicyResource(entityType);
  }

  /**
   * One specific resource.
   *
   * AgentCore requires a specific resource when the statement names specific
   * actions rather than any action.
   *
   * @param entityType - The entity type, for example 'AgentCore::Gateway'
   * @param entityArn - The resource ARN or identifier
   */
  public static instance(entityType: string, entityArn: string): PolicyResource {
    return new PolicyResource(entityType, entityArn);
  }

  private constructor(
    private readonly entityType: string,
    private readonly entityArn?: string,
  ) {}

  /**
   * Render this resource as a Cedar resource scope.
   * @internal
   */
  public _toCedar(): string {
    const entityType = cedarPath(this.entityType, 'resource type');
    if (this.entityArn === undefined) {
      return `resource is ${entityType}`;
    }
    return `resource == ${entityType}::${cedarEntityId(this.entityArn, 'resource id')}`;
  }
}

/**
 * Properties for a policy statement.
 */
export interface PolicyStatementProps {
  /**
   * Whether the statement permits or forbids the action.
   */
  readonly effect: PolicyEffect;

  /**
   * The principal the statement applies to.
   */
  readonly principal: PolicyPrincipal;

  /**
   * The action the statement applies to.
   */
  readonly action: PolicyAction;

  /**
   * The resource the statement applies to.
   */
  readonly resource: PolicyResource;

  /**
   * Conditions that must all hold for the statement to apply.
   *
   * Use `PolicyCondition.anyOf()` for a member that only needs one of several
   * conditions to hold.
   *
   * @default - the statement applies whenever its principal, action and resource match
   */
  readonly when?: PolicyCondition[];

  /**
   * Conditions that must not hold for the statement to apply.
   *
   * @default - no exclusions
   */
  readonly unless?: PolicyCondition[];
}

/**
 * A Cedar authorization policy statement.
 *
 * A statement names the principal, action and resource it applies to, and optionally
 * conditions that narrow it further. All three parts are required, so a statement is
 * complete as soon as it is constructed.
 *
 * @example
 * import { Policy, PolicyEngine, PolicyEffect, PolicyStatement, PolicyPrincipal, PolicyAction, PolicyResource } from 'aws-cdk-lib/aws-bedrockagentcore';
 * declare const engine: PolicyEngine;
 *
 * // Example 1: permit any principal to take any action on any gateway
 * new Policy(this, 'AllowAll', {
 *   policyEngine: engine,
 *   statement: new PolicyStatement({
 *     effect: PolicyEffect.PERMIT,
 *     principal: PolicyPrincipal.any(),
 *     action: PolicyAction.any(),
 *     resource: PolicyResource.anyOfType('AgentCore::Gateway'),
 *   }),
 * });
 *
 * // Generated Cedar:
 * // permit(
 * //   principal,
 * //   action,
 * //   resource is AgentCore::Gateway
 * // );
 *
 * @example
 * import { Policy, PolicyEngine, PolicyEffect, PolicyStatement, PolicyPrincipal, PolicyAction, PolicyResource } from 'aws-cdk-lib/aws-bedrockagentcore';
 * declare const engine: PolicyEngine;
 * declare const gatewayArn: string;
 *
 * // Example 2: permit a group to take specific actions on one gateway
 * new Policy(this, 'AllowSpecificActions', {
 *   policyEngine: engine,
 *   statement: new PolicyStatement({
 *     effect: PolicyEffect.PERMIT,
 *     principal: PolicyPrincipal.inGroup('Group', 'Engineers'),
 *     action: PolicyAction.anyOf([
 *       'AgentCore::Action::exampleaction1',
 *       'AgentCore::Action::exampleaction2',
 *     ]),
 *     resource: PolicyResource.instance('AgentCore::Gateway', gatewayArn),
 *   }),
 * });
 *
 * // Generated Cedar:
 * // permit(
 * //   principal in Group::"Engineers",
 * //   action in [AgentCore::Action::"exampleaction1", AgentCore::Action::"exampleaction2"],
 * //   resource == AgentCore::Gateway::"arn:aws:bedrock:us-east-1:123:gateway/gw-123"
 * // );
 *
 * @example
 * import { Policy, PolicyEngine, PolicyEffect, PolicyStatement, PolicyPrincipal, PolicyAction, PolicyResource, PolicyAttribute, PolicyCondition } from 'aws-cdk-lib/aws-bedrockagentcore';
 * declare const engine: PolicyEngine;
 *
 * // Example 3: conditions, with an exclusion
 * new Policy(this, 'ConditionalPolicy', {
 *   policyEngine: engine,
 *   statement: new PolicyStatement({
 *     effect: PolicyEffect.PERMIT,
 *     principal: PolicyPrincipal.any(),
 *     action: PolicyAction.any(),
 *     resource: PolicyResource.anyOfType('AgentCore::Gateway'),
 *     when: [
 *       PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
 *       PolicyCondition.ipInRange(PolicyAttribute.context('sourceIp'), '192.168.1.0/24'),
 *     ],
 *     unless: [
 *       PolicyCondition.booleanEquals(PolicyAttribute.principal('suspended'), true),
 *     ],
 *   }),
 * });
 *
 * // Generated Cedar:
 * // permit(
 * //   principal,
 * //   action,
 * //   resource is AgentCore::Gateway
 * // )
 * // when {
 * //   principal.department == "Engineering" && context.sourceIp.isInRange(ip("192.168.1.0/24"))
 * // }
 * // unless {
 * //   principal.suspended == true
 * // };
 *
 * @example
 * import { Policy, PolicyEngine, PolicyStatement } from 'aws-cdk-lib/aws-bedrockagentcore';
 * declare const engine: PolicyEngine;
 *
 * // Example 4: raw Cedar, for features the API does not model
 * new Policy(this, 'CustomPolicy', {
 *   policyEngine: engine,
 *   definition: 'permit(principal, action, resource) when { context.custom > 10 };',
 * });
 *
 * // Or using fromCedar():
 * new Policy(this, 'ImportedPolicy', {
 *   policyEngine: engine,
 *   statement: PolicyStatement.fromCedar(
 *     'forbid(principal, action, resource) when { resource.confidential == true };'
 *   ),
 * });
 */
export class PolicyStatement {
  /**
   * Create a statement from raw Cedar source.
   *
   * Use this for Cedar features this API does not model, or to migrate an existing
   * policy.
   *
   * The source is used exactly as given. This method does not escape, quote, or
   * validate it, so it is treated as trusted input and you own its correctness and
   * its safety. Do not build the string by joining values that come from outside
   * your application: a value containing a double quote can close a string literal
   * early and add policy statements you did not write. Pass such values through
   * `PolicyCondition` and the principal, action and resource factories instead,
   * which reject that case at synthesis time. Service-side validation does not help,
   * because an injected policy is still valid Cedar.
   *
   * @param cedarStatement - Complete Cedar policy statement
   */
  public static fromCedar(cedarStatement: string): PolicyStatement {
    // The scope properties are required for a modelled statement but unused for raw
    // Cedar, which `toCedar()` returns verbatim. They are filled in with the widest
    // values so that this factory can go through the public constructor.
    const statement = new PolicyStatement({
      effect: PolicyEffect.PERMIT,
      principal: PolicyPrincipal.any(),
      action: PolicyAction.any(),
      resource: PolicyResource.anyOfType('AgentCore::Gateway'),
    });
    statement.rawCedar = cedarStatement.trim();
    return statement;
  }

  private rawCedar?: string;

  public constructor(private readonly props: PolicyStatementProps) {}

  /**
   * Generate the Cedar policy statement string.
   *
   * This is called internally by the Policy construct.
   *
   * @returns Valid Cedar policy statement
   */
  public toCedar(): string {
    if (this.rawCedar) {
      return this.rawCedar;
    }

    let cedar = `${this.props.effect}(\n`;
    cedar += `  ${this.props.principal._toCedar()},\n`;
    cedar += `  ${this.props.action._toCedar()},\n`;
    cedar += `  ${this.props.resource._toCedar()}\n`;
    cedar += ')';

    const when = renderClause(this.props.when);
    if (when) {
      cedar += `\nwhen {\n  ${when}\n}`;
    }

    const unless = renderClause(this.props.unless);
    if (unless) {
      cedar += `\nunless {\n  ${unless}\n}`;
    }

    return `${cedar};`;
  }
}

/**
 * Render the members of a `when` or `unless` clause. Members of a clause must all
 * hold, so they are joined with `&&`. A member that is itself a group carries its own
 * parentheses, which is what keeps the grouping unambiguous.
 */
function renderClause(conditions?: PolicyCondition[]): string | undefined {
  if (!conditions || conditions.length === 0) {
    return undefined;
  }
  return conditions.map((condition) => condition._toCedar()).join(' && ');
}
