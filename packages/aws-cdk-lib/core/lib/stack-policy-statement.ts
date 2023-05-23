/**
 * This element is required but supports only the wild card (*), which means that the policy applies to all principals.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html#protect-stack-resources-modifying
 */
const STACK_POLICY_PRINCIPAL = '*';

/**
 * Represents a Stack Policy Statement
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html#stack-policy-reference
 */
export class StackPolicyStatement {

  /**
   * Return a policy stack statement to allow any update action on all resources
   */
  public static allowAllStatement(): StackPolicyStatement {
    return new StackPolicyStatement({
      effect: Effect.ALLOW,
      actions: [UpdateAction.UPDATE],
      resources: ['*'],
    });
  }

  /**
   * Return a policy stack statement to deny any update action on all resources
   */
  public static denyAllStatement(): StackPolicyStatement {
    return new StackPolicyStatement({
      effect: Effect.DENY,
      actions: [UpdateAction.UPDATE],
      resources: ['*'],
    });
  }

  private readonly _principal = STACK_POLICY_PRINCIPAL;
  private readonly _action = new OrderedSet<UpdateAction>();
  private readonly _notAction = new OrderedSet<UpdateAction>();
  private readonly _resource = new OrderedSet<string>();
  private readonly _notResource = new OrderedSet<string>();
  private readonly _condition: { [key: string]: any } = { };
  private _effect: Effect;

  constructor(props: StackPolicyStatementProps = {}) {
    this._effect = props.effect || Effect.ALLOW;
    this.addActions(...props.actions || []);
    this.addNotActions(...props.notActions || []);
    this.addResources(...props.resources || []);
    this.addNotResources(...props.notResources || []);
    if (props.conditions !== undefined) {
      this.addConditions(props.conditions);
    }
  }

  /**
   * Whether to allow or deny the actions in this statement
   */
  public get effect(): Effect {
    return this._effect;
  }

  /**
   * Set effect for this statement
   */
  public set effect(effect: Effect) {
    this._effect = effect;
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
  public addActions(...actions: UpdateAction[]) {
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
  public addNotActions(...notActions: UpdateAction[]) {
    if (notActions.length > 0 && this._action.length > 0) {
      throw new Error('Cannot add \'NotActions\' to policy statement if \'Actions\' have been added');
    }
    this._notAction.push(...notActions);
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
    this._condition[key] = existingValue ? { ...existingValue, value } : value;
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
   * JSON-ify the policy statement
   *
   * Used when JSON.stringify() is called
   */
  public toStatementJson(): any {
    return this.normalizeStatement({
      Action: this._action.direct(),
      NotAction: this._notAction.direct(),
      Condition: this._condition,
      Effect: this.effect,
      Principal: this._principal,
      Resource: this._resource.direct(),
      NotResource: this._notResource.direct(),
    });
  }

  private normalizeStatement(s: any) {
    return noUndef({
      Action: _norm(s.Action, { unique: true }),
      NotAction: _norm(s.NotAction, { unique: true }),
      Condition: _norm(s.Condition),
      Effect: _norm(s.Effect),
      Principal: s.Principal,
      Resource: _norm(s.Resource, { unique: true }),
      NotResource: _norm(s.NotResource, { unique: true }),
    });

    function noUndef(x: any): any {
      const ret: any = {};
      for (const [key, value] of Object.entries(x)) {
        if (value !== undefined) {
          ret[key] = value;
        }
      }
      return ret;
    }
  
    function _norm(values: any, { unique = false }: { unique: boolean } = { unique: false }) {
      if (values == null) {
        return undefined;
      }
  
      if (Array.isArray(values)) {
        if (!values || values.length === 0) {
          return undefined;
        }
  
        if (values.length === 1) {
          return values[0];
        }
  
        return unique ? Array.from(new Set(values)) : values;
      }
  
      if (values && typeof(values) === 'object') {
        if (Object.keys(values).length === 0) {
          return undefined;
        }
      }
  
      return values;
    }
  }

  /**
   * The Actions added to this statement
   */
  public get actions() {
    return this._action.copy();
  }

  /**
   * The NotActions added to this statement
   */
  public get notActions() {
    return this._notAction.copy();
  }

  /**
   * The Resources added to this statement
   */
  public get resources() {
    return this._resource.copy();
  }

  /**
   * The NotResources added to this statement
   */
  public get notResources() {
    return this._notResource.copy();
  }

  /**
   * The conditions added to this statement
   */
  public get conditions(): any {
    return { ...this._condition };
  }
}

/**
 * The Effect element of stack policy
 * Determines whether the actions that you specify are denied or allowed on the resource(s) that you specify.
 *
 */
export enum Effect {
  /**
   * Allows access to a resource in an IAM policy statement. By default, access to resources are denied.
   */
  ALLOW = 'Allow',

  /**
   * Explicitly deny access to a resource. By default, all requests are denied implicitly.
   *
   */
  DENY = 'Deny',
}

/**
 * The Action element of stack policy
 *
 */
export enum UpdateAction {
  /**
   * Specifies update actions during which resources might experience no interruptions or some interruptions while changes are being applied.
   * All resources maintain their physical IDs.
   */
  UPDATE_MODIFY = 'Update:Modify',

  /**
   * Specifies update actions during which resources might experience no interruptions or some interruptions while changes are being applied.
   * All resources maintain their physical IDs.
   */
  UPDATE_REPLACE = 'Update:Replace',

  /**
   * Specifies update actions during which resources might experience no interruptions or some interruptions while changes are being applied.
   * All resources maintain their physical IDs.
   */
  UPDATE_DELETE = 'Update:Delete',

  /**
   * Specifies all update actions. The asterisk is a wild card that represents all update actions.
   *
   */
  UPDATE = 'Update:*',
}


/**
 * Condition for when an IAM policy is in effect. Maps from the keys in a request's context to
 * a string value or array of string values. See the Conditions interface for more details.
 */
export type Condition = unknown;

// NOTE! We would have liked to have typed this as `Record<string, unknown>`, but in some places
// of the code we are assuming we can pass a `CfnJson` object into where a `Condition` is expected,
// and that wouldn't typecheck anymore.
//
// Needs to be `unknown` instead of `any` so that the type of `Conditions` is
// `Record<string, unknown>`; if it had been `Record<string, any>`, TypeScript would have allowed
// passing an array into `conditions` arguments (where it needs to be a map).

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
 * Interface for creating a stack policy statement
 */
export interface StackPolicyStatementProps {
  /**
   * List of actions to add to the statement
   *
   * @default - no actions
   */
  readonly actions?: UpdateAction[];

  /**
   * List of not actions to add to the statement
   *
   * @default - no not-actions
   */
  readonly notActions?: UpdateAction[];

  /**
   * Resource logical IDs to add to the statement
   *
   * @default - no resources
   */
  readonly resources?: string[];

  /**
   * NotResource logical IDs to add to the statement
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


/**
 * A class that behaves both as a set and an array
 *
 * Used for the elements of a StackPolicyStatement. In practice they behave as sets,
 * but we have thousands of snapshot tests in existence that will rely on a
 * particular order so we can't just change the type to `Set<>` wholesale without
 * causing a lot of churn.
 */
class OrderedSet<A> {
  private readonly set = new Set<A>();
  private readonly array = new Array<A>();

  /**
   * Add new elements to the set
   *
   * @param xs the elements to be added
   *
   * @returns the elements actually added
   */
  public push(...xs: readonly A[]): A[] {
    const ret = new Array<A>();
    for (const x of xs) {
      if (this.set.has(x)) {
        continue;
      }
      this.set.add(x);
      this.array.push(x);
      ret.push(x);
    }
    return ret;
  }

  public get length() {
    return this.array.length;
  }

  public copy(): A[] {
    return [...this.array];
  }

  /**
   * Direct (read-only) access to the underlying array
   *
   * (Saves a copy)
   */
  public direct(): readonly A[] {
    return this.array;
  }
}
