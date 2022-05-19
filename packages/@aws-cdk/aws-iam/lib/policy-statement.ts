import * as cdk from '@aws-cdk/core';
import { IConstruct } from '@aws-cdk/core';
import { Group } from './group';
import {
  AccountPrincipal, AccountRootPrincipal, AnyPrincipal, ArnPrincipal, CanonicalUserPrincipal,
  FederatedPrincipal, IPrincipal, PrincipalBase, PrincipalPolicyFragment, ServicePrincipal, ServicePrincipalOpts,
} from './principals';
import { normalizeStatement } from './private/postprocess-policy-document';
import { LITERAL_STRING_KEY, mergePrincipal, sum } from './util';

const ensureArrayOrUndefined = (field: any) => {
  if (field === undefined) {
    return undefined;
  }
  if (typeof (field) !== 'string' && !Array.isArray(field)) {
    throw new Error('Fields must be either a string or an array of strings');
  }
  if (Array.isArray(field) && !!field.find((f: any) => typeof (f) !== 'string')) {
    throw new Error('Fields must be either a string or an array of strings');
  }
  return Array.isArray(field) ? field : [field];
};

/**
 * An estimate on how long ARNs typically are
 *
 * This is used to decide when to start splitting statements into new Managed Policies.
 * Because we often can't know the length of an ARN (it may be a token and only
 * available at deployment time) we'll have to estimate it.
 *
 * The estimate can be overridden by setting the `@aws-cdk/aws-iam.arnSizeEstimate` context key.
 */
const DEFAULT_ARN_SIZE_ESTIMATE = 150;

/**
 * Context key which can be used to override the estimated length of unresolved ARNs.
 */
const ARN_SIZE_ESTIMATE_CONTEXT_KEY = '@aws-cdk/aws-iam.arnSizeEstimate';

/**
 * Represents a statement in an IAM policy document.
 */
export class PolicyStatement {

  /**
   * Creates a new PolicyStatement based on the object provided.
   * This will accept an object created from the `.toJSON()` call
   * @param obj the PolicyStatement in object form.
   */
  public static fromJson(obj: any) {
    const ret = new PolicyStatement({
      sid: obj.Sid,
      actions: ensureArrayOrUndefined(obj.Action),
      resources: ensureArrayOrUndefined(obj.Resource),
      conditions: obj.Condition,
      effect: obj.Effect,
      notActions: ensureArrayOrUndefined(obj.NotAction),
      notResources: ensureArrayOrUndefined(obj.NotResource),
      principals: obj.Principal ? [new JsonPrincipal(obj.Principal)] : undefined,
      notPrincipals: obj.NotPrincipal ? [new JsonPrincipal(obj.NotPrincipal)] : undefined,
    });

    // validate that the PolicyStatement has the correct shape
    const errors = ret.validateForAnyPolicy();
    if (errors.length > 0) {
      throw new Error('Incorrect Policy Statement: ' + errors.join('\n'));
    }

    return ret;
  }

  /**
   * Statement ID for this statement
   */
  public sid?: string;

  /**
   * Whether to allow or deny the actions in this statement
   */
  public effect: Effect;

  private readonly _action = new Array<string>();
  private readonly _notAction = new Array<string>();
  private readonly _principal: { [key: string]: any[] } = {};
  private readonly _notPrincipal: { [key: string]: any[] } = {};
  private readonly _resource = new Array<string>();
  private readonly _notResource = new Array<string>();
  private readonly _condition: { [key: string]: any } = { };
  private principalConditionsJson?: string;

  // Hold on to those principals
  private readonly _principals = new Array<IPrincipal>();
  private readonly _notPrincipals = new Array<IPrincipal>();

  constructor(props: PolicyStatementProps = {}) {
    // Validate actions
    for (const action of [...props.actions || [], ...props.notActions || []]) {

      if (!/^(\*|[a-zA-Z0-9-]+:[a-zA-Z0-9*]+)$/.test(action) && !cdk.Token.isUnresolved(action)) {
        throw new Error(`Action '${action}' is invalid. An action string consists of a service namespace, a colon, and the name of an action. Action names can include wildcards.`);
      }
    }

    this.sid = props.sid;
    this.effect = props.effect || Effect.ALLOW;

    this.addActions(...props.actions || []);
    this.addNotActions(...props.notActions || []);
    this.addPrincipals(...props.principals || []);
    this.addNotPrincipals(...props.notPrincipals || []);
    this.addResources(...props.resources || []);
    this.addNotResources(...props.notResources || []);
    if (props.conditions !== undefined) {
      this.addConditions(props.conditions);
    }
  }

  //
  // Actions
  //

  /**
   * Specify allowed actions into the "Action" section of the policy statement.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html
   *
   * @param actions actions that will be allowed.
   */
  public addActions(...actions: string[]) {
    if (actions.length > 0 && this._notAction.length > 0) {
      throw new Error('Cannot add \'Actions\' to policy statement if \'NotActions\' have been added');
    }
    this._action.push(...actions);
  }

  /**
   * Explicitly allow all actions except the specified list of actions into the "NotAction" section
   * of the policy document.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notaction.html
   *
   * @param notActions actions that will be denied. All other actions will be permitted.
   */
  public addNotActions(...notActions: string[]) {
    if (notActions.length > 0 && this._action.length > 0) {
      throw new Error('Cannot add \'NotActions\' to policy statement if \'Actions\' have been added');
    }
    this._notAction.push(...notActions);
  }

  //
  // Principal
  //

  /**
   * Indicates if this permission has a "Principal" section.
   */
  public get hasPrincipal() {
    return this._principals.length + this._notPrincipals.length > 0;
  }

  /**
   * Adds principals to the "Principal" section of a policy statement.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
   *
   * @param principals IAM principals that will be added
   */
  public addPrincipals(...principals: IPrincipal[]) {
    this._principals.push(...principals);
    if (Object.keys(principals).length > 0 && Object.keys(this._notPrincipal).length > 0) {
      throw new Error('Cannot add \'Principals\' to policy statement if \'NotPrincipals\' have been added');
    }
    for (const principal of principals) {
      this.validatePolicyPrincipal(principal);
      const fragment = principal.policyFragment;
      mergePrincipal(this._principal, fragment.principalJson);
      this.addPrincipalConditions(fragment.conditions);
    }
  }

  /**
   * Specify principals that is not allowed or denied access to the "NotPrincipal" section of
   * a policy statement.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notprincipal.html
   *
   * @param notPrincipals IAM principals that will be denied access
   */
  public addNotPrincipals(...notPrincipals: IPrincipal[]) {
    this._notPrincipals.push(...notPrincipals);
    if (Object.keys(notPrincipals).length > 0 && Object.keys(this._principal).length > 0) {
      throw new Error('Cannot add \'NotPrincipals\' to policy statement if \'Principals\' have been added');
    }
    for (const notPrincipal of notPrincipals) {
      this.validatePolicyPrincipal(notPrincipal);
      const fragment = notPrincipal.policyFragment;
      mergePrincipal(this._notPrincipal, fragment.principalJson);
      this.addPrincipalConditions(fragment.conditions);
    }
  }

  private validatePolicyPrincipal(principal: IPrincipal) {
    if (principal instanceof Group) {
      throw new Error('Cannot use an IAM Group as the \'Principal\' or \'NotPrincipal\' in an IAM Policy');
    }
  }

  /**
   * Specify AWS account ID as the principal entity to the "Principal" section of a policy statement.
   */
  public addAwsAccountPrincipal(accountId: string) {
    this.addPrincipals(new AccountPrincipal(accountId));
  }

  /**
   * Specify a principal using the ARN  identifier of the principal.
   * You cannot specify IAM groups and instance profiles as principals.
   *
   * @param arn ARN identifier of AWS account, IAM user, or IAM role (i.e. arn:aws:iam::123456789012:user/user-name)
   */
  public addArnPrincipal(arn: string) {
    this.addPrincipals(new ArnPrincipal(arn));
  }

  /**
   * Adds a service principal to this policy statement.
   *
   * @param service the service name for which a service principal is requested (e.g: `s3.amazonaws.com`).
   * @param opts    options for adding the service principal (such as specifying a principal in a different region)
   */
  public addServicePrincipal(service: string, opts?: ServicePrincipalOpts) {
    this.addPrincipals(new ServicePrincipal(service, opts));
  }

  /**
   * Adds a federated identity provider such as Amazon Cognito to this policy statement.
   *
   * @param federated federated identity provider (i.e. 'cognito-identity.amazonaws.com')
   * @param conditions The conditions under which the policy is in effect.
   *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
   */
  public addFederatedPrincipal(federated: any, conditions: Conditions) {
    this.addPrincipals(new FederatedPrincipal(federated, conditions));
  }

  /**
   * Adds an AWS account root user principal to this policy statement
   */
  public addAccountRootPrincipal() {
    this.addPrincipals(new AccountRootPrincipal());
  }

  /**
   * Adds a canonical user ID principal to this policy document
   *
   * @param canonicalUserId unique identifier assigned by AWS for every account
   */
  public addCanonicalUserPrincipal(canonicalUserId: string) {
    this.addPrincipals(new CanonicalUserPrincipal(canonicalUserId));
  }

  /**
   * Adds all identities in all accounts ("*") to this policy statement
   */
  public addAnyPrincipal() {
    this.addPrincipals(new AnyPrincipal());
  }

  //
  // Resources
  //

  /**
   * Specify resources that this policy statement applies into the "Resource" section of
   * this policy statement.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html
   *
   * @param arns Amazon Resource Names (ARNs) of the resources that this policy statement applies to
   */
  public addResources(...arns: string[]) {
    if (arns.length > 0 && this._notResource.length > 0) {
      throw new Error('Cannot add \'Resources\' to policy statement if \'NotResources\' have been added');
    }
    this._resource.push(...arns);
  }

  /**
   * Specify resources that this policy statement will not apply to in the "NotResource" section
   * of this policy statement. All resources except the specified list will be matched.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notresource.html
   *
   * @param arns Amazon Resource Names (ARNs) of the resources that this policy statement does not apply to
   */
  public addNotResources(...arns: string[]) {
    if (arns.length > 0 && this._resource.length > 0) {
      throw new Error('Cannot add \'NotResources\' to policy statement if \'Resources\' have been added');
    }
    this._notResource.push(...arns);
  }

  /**
   * Adds a ``"*"`` resource to this statement.
   */
  public addAllResources() {
    this.addResources('*');
  }

  /**
   * Indicates if this permission has at least one resource associated with it.
   */
  public get hasResource() {
    return this._resource && this._resource.length > 0;
  }

  //
  // Condition
  //

  /**
   * Add a condition to the Policy
   *
   * If multiple calls are made to add a condition with the same operator and field, only
   * the last one wins. For example:
   *
   * ```ts
   * declare const stmt: iam.PolicyStatement;
   *
   * stmt.addCondition('StringEquals', { 'aws:SomeField': '1' });
   * stmt.addCondition('StringEquals', { 'aws:SomeField': '2' });
   * ```
   *
   * Will end up with the single condition `StringEquals: { 'aws:SomeField': '2' }`.
   *
   * If you meant to add a condition to say that the field can be *either* `1` or `2`, write
   * this:
   *
   * ```ts
   * declare const stmt: iam.PolicyStatement;
   *
   * stmt.addCondition('StringEquals', { 'aws:SomeField': ['1', '2'] });
   * ```
   */
  public addCondition(key: string, value: Condition) {
    const existingValue = this._condition[key];
    this._condition[key] = existingValue ? { ...existingValue, ...value } : value;
  }

  /**
   * Add multiple conditions to the Policy
   *
   * See the `addCondition` function for a caveat on calling this method multiple times.
   */
  public addConditions(conditions: Conditions) {
    Object.keys(conditions).map(key => {
      this.addCondition(key, conditions[key]);
    });
  }

  /**
   * Add a condition that limits to a given account
   *
   * This method can only be called once: subsequent calls will overwrite earlier calls.
   */
  public addAccountCondition(accountId: string) {
    this.addCondition('StringEquals', { 'sts:ExternalId': accountId });
  }

  /**
   * Create a new `PolicyStatement` with the same exact properties
   * as this one, except for the overrides
   */
  public copy(overrides: PolicyStatementProps = {}) {
    return new PolicyStatement({
      sid: overrides.sid ?? this.sid,
      effect: overrides.effect ?? this.effect,
      actions: overrides.actions ?? this.actions,
      notActions: overrides.notActions ?? this.notActions,

      principals: overrides.principals ?? this.principals,
      notPrincipals: overrides.notPrincipals ?? this.notPrincipals,

      resources: overrides.resources ?? this.resources,
      notResources: overrides.notResources ?? this.notResources,

      conditions: overrides.conditions ?? this.conditions,
    });
  }

  /**
   * JSON-ify the policy statement
   *
   * Used when JSON.stringify() is called
   */
  public toStatementJson(): any {
    return normalizeStatement({
      Action: this._action,
      NotAction: this._notAction,
      Condition: this._condition,
      Effect: this.effect,
      Principal: this._principal,
      NotPrincipal: this._notPrincipal,
      Resource: this._resource,
      NotResource: this._notResource,
      Sid: this.sid,
    });
  }

  /**
   * String representation of this policy statement
   */
  public toString() {
    return cdk.Token.asString(this, {
      displayHint: 'PolicyStatement',
    });
  }

  /**
   * JSON-ify the statement
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    return this.toStatementJson();
  }

  /**
   * Add a principal's conditions
   *
   * For convenience, principals have been modeled as both a principal
   * and a set of conditions. This makes it possible to have a single
   * object represent e.g. an "SNS Topic" (SNS service principal + aws:SourcArn
   * condition) or an Organization member (* + aws:OrgId condition).
   *
   * However, when using multiple principals in the same policy statement,
   * they must all have the same conditions or the OR samentics
   * implied by a list of principals cannot be guaranteed (user needs to
   * add multiple statements in that case).
   */
  private addPrincipalConditions(conditions: Conditions) {
    // Stringifying the conditions is an easy way to do deep equality
    const theseConditions = JSON.stringify(conditions);
    if (this.principalConditionsJson === undefined) {
      // First principal, anything goes
      this.principalConditionsJson = theseConditions;
    } else {
      if (this.principalConditionsJson !== theseConditions) {
        throw new Error(`All principals in a PolicyStatement must have the same Conditions (got '${this.principalConditionsJson}' and '${theseConditions}'). Use multiple statements instead.`);
      }
    }
    this.addConditions(conditions);
  }

  /**
   * Validate that the policy statement satisfies base requirements for a policy.
   *
   * @returns An array of validation error messages, or an empty array if the statement is valid.
   */
  public validateForAnyPolicy(): string[] {
    const errors = new Array<string>();
    if (this._action.length === 0 && this._notAction.length === 0) {
      errors.push('A PolicyStatement must specify at least one \'action\' or \'notAction\'.');
    }
    return errors;
  }

  /**
   * Validate that the policy statement satisfies all requirements for a resource-based policy.
   *
   * @returns An array of validation error messages, or an empty array if the statement is valid.
   */
  public validateForResourcePolicy(): string[] {
    const errors = this.validateForAnyPolicy();
    if (Object.keys(this._principal).length === 0 && Object.keys(this._notPrincipal).length === 0) {
      errors.push('A PolicyStatement used in a resource-based policy must specify at least one IAM principal.');
    }
    return errors;
  }

  /**
   * Validate that the policy statement satisfies all requirements for an identity-based policy.
   *
   * @returns An array of validation error messages, or an empty array if the statement is valid.
   */
  public validateForIdentityPolicy(): string[] {
    const errors = this.validateForAnyPolicy();
    if (Object.keys(this._principal).length > 0 || Object.keys(this._notPrincipal).length > 0) {
      errors.push('A PolicyStatement used in an identity-based policy cannot specify any IAM principals.');
    }
    if (Object.keys(this._resource).length === 0 && Object.keys(this._notResource).length === 0) {
      errors.push('A PolicyStatement used in an identity-based policy must specify at least one resource.');
    }
    return errors;
  }

  /**
   * The Actions added to this statement
   */
  public get actions() {
    return [...this._action];
  }

  /**
   * The NotActions added to this statement
   */
  public get notActions() {
    return [...this._notAction];
  }

  /**
   * The Principals added to this statement
   */
  public get principals(): IPrincipal[] {
    return [...this._principals];
  }

  /**
   * The NotPrincipals added to this statement
   */
  public get notPrincipals(): IPrincipal[] {
    return [...this._notPrincipals];
  }

  /**
   * The Resources added to this statement
   */
  public get resources() {
    return [...this._resource];
  }

  /**
   * The NotResources added to this statement
   */
  public get notResources() {
    return [...this._notResource];
  }

  /**
   * The conditions added to this statement
   */
  public get conditions(): any {
    return { ...this._condition };
  }

  /**
   * Estimate the size of this policy statement
   *
   * By necessity, this will not be accurate. We'll do our best to overestimate
   * so we won't have nasty surprises.
   *
   * @internal
   */
  public _estimateSize(options: EstimateSizeOptions): number {
    let ret = 0;

    const { actionEstimate, arnEstimate } = options;

    ret += `"Effect": "${this.effect}",`.length;

    count('Action', this.actions, actionEstimate);
    count('NotAction', this.notActions, actionEstimate);
    count('Resource', this.resources, arnEstimate);
    count('NotResource', this.notResources, arnEstimate);

    ret += this.principals.length * arnEstimate;
    ret += this.notPrincipals.length * arnEstimate;

    ret += JSON.stringify(this.conditions).length;
    return ret;

    function count(key: string, values: string[], tokenSize: number) {
      if (values.length > 0) {
        ret += key.length + 5 /* quotes, colon, brackets */ +
          sum(values.map(v => (cdk.Token.isUnresolved(v) ? tokenSize : v.length) + 3 /* quotes, separator */));
      }
    }
  }
}

/**
 * The Effect element of an IAM policy
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html
 */
export enum Effect {
  /**
   * Allows access to a resource in an IAM policy statement. By default, access to resources are denied.
   */
  ALLOW = 'Allow',

  /**
   * Explicitly deny access to a resource. By default, all requests are denied implicitly.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
   */
  DENY = 'Deny',
}

/**
 * Condition for when an IAM policy is in effect. Maps from the keys in a request's context to
 * a string value or array of string values. See the Conditions interface for more details.
 */
export type Condition = any;

// NOTE! We'd ideally like to type this as `Record<string, any>`, because the
// API expects a map which can take either strings or lists of strings.
//
// However, if we were to change this right now, the Java bindings for CDK would
// emit a type of `Map<String, Object>`, but the most common types people would
// instantiate would be an `ImmutableMap<String, String>` which would not be
// assignable to `Map<String, Object>`. The types don't have a built-in notion
// of co-contravariance, you have to indicate that on the type. So jsii would first
// need to emit the type as `Map<String, ? extends Object>`.
//
// Feature request in https://github.com/aws/jsii/issues/1517

/**
 * Conditions for when an IAM Policy is in effect, specified in the following structure:
 *
 * `{ "Operator": { "keyInRequestContext": "value" } }`
 *
 * The value can be either a single string value or an array of string values.
 *
 * For more information, including which operators are supported, see [the IAM
 * documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
 */
export type Conditions = Record<string, Condition>;

/**
 * Interface for creating a policy statement
 */
export interface PolicyStatementProps {
  /**
   * The Sid (statement ID) is an optional identifier that you provide for the
   * policy statement. You can assign a Sid value to each statement in a
   * statement array. In services that let you specify an ID element, such as
   * SQS and SNS, the Sid value is just a sub-ID of the policy document's ID. In
   * IAM, the Sid value must be unique within a JSON policy.
   *
   * @default - no sid
   */
  readonly sid?: string;

  /**
   * List of actions to add to the statement
   *
   * @default - no actions
   */
  readonly actions?: string[];

  /**
   * List of not actions to add to the statement
   *
   * @default - no not-actions
   */
  readonly notActions?: string[];

  /**
   * List of principals to add to the statement
   *
   * @default - no principals
   */
  readonly principals?: IPrincipal[];

  /**
   * List of not principals to add to the statement
   *
   * @default - no not principals
   */
  readonly notPrincipals?: IPrincipal[];

  /**
   * Resource ARNs to add to the statement
   *
   * @default - no resources
   */
  readonly resources?: string[];

  /**
   * NotResource ARNs to add to the statement
   *
   * @default - no not-resources
   */
  readonly notResources?: string[];

  /**
   * Conditions to add to the statement
   *
   * @default - no condition
   */
  readonly conditions?: {[key: string]: any};

  /**
   * Whether to allow or deny the actions in this statement
   *
   * @default Effect.ALLOW
   */
  readonly effect?: Effect;
}

class JsonPrincipal extends PrincipalBase {
  public readonly policyFragment: PrincipalPolicyFragment;

  constructor(json: any = { }) {
    super();

    // special case: if principal is a string, turn it into a "LiteralString" principal,
    // so we render the exact same string back out.
    if (typeof(json) === 'string') {
      json = { [LITERAL_STRING_KEY]: [json] };
    }
    if (typeof(json) !== 'object') {
      throw new Error(`JSON IAM principal should be an object, got ${JSON.stringify(json)}`);
    }

    this.policyFragment = {
      principalJson: json,
      conditions: {},
    };
  }

  public dedupeString(): string | undefined {
    return JSON.stringify(this.policyFragment);
  }
}

/**
 * Options for _estimateSize
 *
 * These can optionally come from context, but it's too expensive to look
 * them up every time so we bundle them into a struct first.
 *
 * @internal
 */
export interface EstimateSizeOptions {
  /**
   * Estimated size of an unresolved ARN
   */
  readonly arnEstimate: number;

  /**
   * Estimated size of an unresolved action
   */
  readonly actionEstimate: number;
}

/**
 * Derive the size estimation options from context
 *
 * @internal
 */
export function deriveEstimateSizeOptions(scope: IConstruct): EstimateSizeOptions {
  const actionEstimate = 20;
  const arnEstimate = scope.node.tryGetContext(ARN_SIZE_ESTIMATE_CONTEXT_KEY) ?? DEFAULT_ARN_SIZE_ESTIMATE;
  if (typeof arnEstimate !== 'number') {
    throw new Error(`Context value ${ARN_SIZE_ESTIMATE_CONTEXT_KEY} should be a number, got ${JSON.stringify(arnEstimate)}`);
  }

  return { actionEstimate, arnEstimate };
}