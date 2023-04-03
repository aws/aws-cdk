import { IConstruct } from 'constructs';
import { IPrincipal, ServicePrincipalOpts } from './principals';
/**
 * Represents a statement in an IAM policy document.
 */
export declare class PolicyStatement {
    /**
     * Creates a new PolicyStatement based on the object provided.
     * This will accept an object created from the `.toJSON()` call
     * @param obj the PolicyStatement in object form.
     */
    static fromJson(obj: any): PolicyStatement;
    private readonly _action;
    private readonly _notAction;
    private readonly _principal;
    private readonly _notPrincipal;
    private readonly _resource;
    private readonly _notResource;
    private readonly _condition;
    private _sid?;
    private _effect;
    private principalConditionsJson?;
    private readonly _principals;
    private readonly _notPrincipals;
    private _frozen;
    constructor(props?: PolicyStatementProps);
    /**
     * Statement ID for this statement
     */
    get sid(): string | undefined;
    /**
     * Set Statement ID for this statement
     */
    set sid(sid: string | undefined);
    /**
     * Whether to allow or deny the actions in this statement
     */
    get effect(): Effect;
    /**
     * Set effect for this statement
     */
    set effect(effect: Effect);
    /**
     * Specify allowed actions into the "Action" section of the policy statement.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html
     *
     * @param actions actions that will be allowed.
     */
    addActions(...actions: string[]): void;
    /**
     * Explicitly allow all actions except the specified list of actions into the "NotAction" section
     * of the policy document.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notaction.html
     *
     * @param notActions actions that will be denied. All other actions will be permitted.
     */
    addNotActions(...notActions: string[]): void;
    /**
     * Indicates if this permission has a "Principal" section.
     */
    get hasPrincipal(): boolean;
    /**
     * Adds principals to the "Principal" section of a policy statement.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
     *
     * @param principals IAM principals that will be added
     */
    addPrincipals(...principals: IPrincipal[]): void;
    /**
     * Specify principals that is not allowed or denied access to the "NotPrincipal" section of
     * a policy statement.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notprincipal.html
     *
     * @param notPrincipals IAM principals that will be denied access
     */
    addNotPrincipals(...notPrincipals: IPrincipal[]): void;
    private validatePolicyActions;
    private validatePolicyPrincipal;
    /**
     * Specify AWS account ID as the principal entity to the "Principal" section of a policy statement.
     */
    addAwsAccountPrincipal(accountId: string): void;
    /**
     * Specify a principal using the ARN  identifier of the principal.
     * You cannot specify IAM groups and instance profiles as principals.
     *
     * @param arn ARN identifier of AWS account, IAM user, or IAM role (i.e. arn:aws:iam::123456789012:user/user-name)
     */
    addArnPrincipal(arn: string): void;
    /**
     * Adds a service principal to this policy statement.
     *
     * @param service the service name for which a service principal is requested (e.g: `s3.amazonaws.com`).
     * @param opts    options for adding the service principal (such as specifying a principal in a different region)
     */
    addServicePrincipal(service: string, opts?: ServicePrincipalOpts): void;
    /**
     * Adds a federated identity provider such as Amazon Cognito to this policy statement.
     *
     * @param federated federated identity provider (i.e. 'cognito-identity.amazonaws.com')
     * @param conditions The conditions under which the policy is in effect.
     *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    addFederatedPrincipal(federated: any, conditions: Conditions): void;
    /**
     * Adds an AWS account root user principal to this policy statement
     */
    addAccountRootPrincipal(): void;
    /**
     * Adds a canonical user ID principal to this policy document
     *
     * @param canonicalUserId unique identifier assigned by AWS for every account
     */
    addCanonicalUserPrincipal(canonicalUserId: string): void;
    /**
     * Adds all identities in all accounts ("*") to this policy statement
     */
    addAnyPrincipal(): void;
    /**
     * Specify resources that this policy statement applies into the "Resource" section of
     * this policy statement.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html
     *
     * @param arns Amazon Resource Names (ARNs) of the resources that this policy statement applies to
     */
    addResources(...arns: string[]): void;
    /**
     * Specify resources that this policy statement will not apply to in the "NotResource" section
     * of this policy statement. All resources except the specified list will be matched.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notresource.html
     *
     * @param arns Amazon Resource Names (ARNs) of the resources that this policy statement does not apply to
     */
    addNotResources(...arns: string[]): void;
    /**
     * Adds a ``"*"`` resource to this statement.
     */
    addAllResources(): void;
    /**
     * Indicates if this permission has at least one resource associated with it.
     */
    get hasResource(): boolean;
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
    addCondition(key: string, value: Condition): void;
    /**
     * Add multiple conditions to the Policy
     *
     * See the `addCondition` function for a caveat on calling this method multiple times.
     */
    addConditions(conditions: Conditions): void;
    /**
     * Add a condition that limits to a given account
     *
     * This method can only be called once: subsequent calls will overwrite earlier calls.
     */
    addAccountCondition(accountId: string): void;
    /**
     * Create a new `PolicyStatement` with the same exact properties
     * as this one, except for the overrides
     */
    copy(overrides?: PolicyStatementProps): PolicyStatement;
    /**
     * JSON-ify the policy statement
     *
     * Used when JSON.stringify() is called
     */
    toStatementJson(): any;
    /**
     * String representation of this policy statement
     */
    toString(): string;
    /**
     * JSON-ify the statement
     *
     * Used when JSON.stringify() is called
     */
    toJSON(): any;
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
    private addPrincipalConditions;
    /**
     * Validate that the policy statement satisfies base requirements for a policy.
     *
     * @returns An array of validation error messages, or an empty array if the statement is valid.
     */
    validateForAnyPolicy(): string[];
    /**
     * Validate that the policy statement satisfies all requirements for a resource-based policy.
     *
     * @returns An array of validation error messages, or an empty array if the statement is valid.
     */
    validateForResourcePolicy(): string[];
    /**
     * Validate that the policy statement satisfies all requirements for an identity-based policy.
     *
     * @returns An array of validation error messages, or an empty array if the statement is valid.
     */
    validateForIdentityPolicy(): string[];
    /**
     * The Actions added to this statement
     */
    get actions(): string[];
    /**
     * The NotActions added to this statement
     */
    get notActions(): string[];
    /**
     * The Principals added to this statement
     */
    get principals(): IPrincipal[];
    /**
     * The NotPrincipals added to this statement
     */
    get notPrincipals(): IPrincipal[];
    /**
     * The Resources added to this statement
     */
    get resources(): string[];
    /**
     * The NotResources added to this statement
     */
    get notResources(): string[];
    /**
     * The conditions added to this statement
     */
    get conditions(): any;
    /**
     * Make the PolicyStatement immutable
     *
     * After calling this, any of the `addXxx()` methods will throw an exception.
     *
     * Libraries that lazily generate statement bodies can override this method to
     * fill the actual PolicyStatement fields. Be aware that this method may be called
     * multiple times.
     */
    freeze(): PolicyStatement;
    /**
     * Whether the PolicyStatement has been frozen
     *
     * The statement object is frozen when `freeze()` is called.
     */
    get frozen(): boolean;
    /**
     * Estimate the size of this policy statement
     *
     * By necessity, this will not be accurate. We'll do our best to overestimate
     * so we won't have nasty surprises.
     *
     * @internal
     */
    _estimateSize(options: EstimateSizeOptions): number;
    /**
     * Throw an exception when the object is frozen
     */
    private assertNotFrozen;
}
/**
 * The Effect element of an IAM policy
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html
 */
export declare enum Effect {
    /**
     * Allows access to a resource in an IAM policy statement. By default, access to resources are denied.
     */
    ALLOW = "Allow",
    /**
     * Explicitly deny access to a resource. By default, all requests are denied implicitly.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
     */
    DENY = "Deny"
}
/**
 * Condition for when an IAM policy is in effect. Maps from the keys in a request's context to
 * a string value or array of string values. See the Conditions interface for more details.
 */
export declare type Condition = unknown;
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
export declare type Conditions = Record<string, Condition>;
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
    readonly conditions?: {
        [key: string]: any;
    };
    /**
     * Whether to allow or deny the actions in this statement
     *
     * @default Effect.ALLOW
     */
    readonly effect?: Effect;
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
export declare function deriveEstimateSizeOptions(scope: IConstruct): EstimateSizeOptions;
