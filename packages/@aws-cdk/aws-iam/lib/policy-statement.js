"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveEstimateSizeOptions = exports.Effect = exports.PolicyStatement = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const group_1 = require("./group");
const principals_1 = require("./principals");
const postprocess_policy_document_1 = require("./private/postprocess-policy-document");
const util_1 = require("./private/util");
const ensureArrayOrUndefined = (field) => {
    if (field === undefined) {
        return undefined;
    }
    if (typeof (field) !== 'string' && !Array.isArray(field)) {
        throw new Error('Fields must be either a string or an array of strings');
    }
    if (Array.isArray(field) && !!field.find((f) => typeof (f) !== 'string')) {
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
class PolicyStatement {
    /**
     * Creates a new PolicyStatement based on the object provided.
     * This will accept an object created from the `.toJSON()` call
     * @param obj the PolicyStatement in object form.
     */
    static fromJson(obj) {
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
    constructor(props = {}) {
        this._action = new OrderedSet();
        this._notAction = new OrderedSet();
        this._principal = {};
        this._notPrincipal = {};
        this._resource = new OrderedSet();
        this._notResource = new OrderedSet();
        this._condition = {};
        // Hold on to those principals
        this._principals = new OrderedSet();
        this._notPrincipals = new OrderedSet();
        this._frozen = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatementProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PolicyStatement);
            }
            throw error;
        }
        this._sid = props.sid;
        this._effect = props.effect || Effect.ALLOW;
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
    /**
     * Statement ID for this statement
     */
    get sid() {
        return this._sid;
    }
    /**
     * Set Statement ID for this statement
     */
    set sid(sid) {
        this.assertNotFrozen('sid');
        this._sid = sid;
    }
    /**
     * Whether to allow or deny the actions in this statement
     */
    get effect() {
        return this._effect;
    }
    /**
     * Set effect for this statement
     */
    set effect(effect) {
        this.assertNotFrozen('effect');
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
    addActions(...actions) {
        this.assertNotFrozen('addActions');
        if (actions.length > 0 && this._notAction.length > 0) {
            throw new Error('Cannot add \'Actions\' to policy statement if \'NotActions\' have been added');
        }
        this.validatePolicyActions(actions);
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
    addNotActions(...notActions) {
        this.assertNotFrozen('addNotActions');
        if (notActions.length > 0 && this._action.length > 0) {
            throw new Error('Cannot add \'NotActions\' to policy statement if \'Actions\' have been added');
        }
        this.validatePolicyActions(notActions);
        this._notAction.push(...notActions);
    }
    //
    // Principal
    //
    /**
     * Indicates if this permission has a "Principal" section.
     */
    get hasPrincipal() {
        return this._principals.length + this._notPrincipals.length > 0;
    }
    /**
     * Adds principals to the "Principal" section of a policy statement.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
     *
     * @param principals IAM principals that will be added
     */
    addPrincipals(...principals) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(principals);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPrincipals);
            }
            throw error;
        }
        this.assertNotFrozen('addPrincipals');
        if (principals.length > 0 && this._notPrincipals.length > 0) {
            throw new Error('Cannot add \'Principals\' to policy statement if \'NotPrincipals\' have been added');
        }
        for (const principal of principals) {
            this.validatePolicyPrincipal(principal);
        }
        const added = this._principals.push(...principals);
        for (const principal of added) {
            const fragment = principal.policyFragment;
            (0, util_1.mergePrincipal)(this._principal, fragment.principalJson);
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
    addNotPrincipals(...notPrincipals) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(notPrincipals);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addNotPrincipals);
            }
            throw error;
        }
        this.assertNotFrozen('addNotPrincipals');
        if (notPrincipals.length > 0 && this._principals.length > 0) {
            throw new Error('Cannot add \'NotPrincipals\' to policy statement if \'Principals\' have been added');
        }
        for (const notPrincipal of notPrincipals) {
            this.validatePolicyPrincipal(notPrincipal);
        }
        const added = this._notPrincipals.push(...notPrincipals);
        for (const notPrincipal of added) {
            const fragment = notPrincipal.policyFragment;
            (0, util_1.mergePrincipal)(this._notPrincipal, fragment.principalJson);
            this.addPrincipalConditions(fragment.conditions);
        }
    }
    validatePolicyActions(actions) {
        // In case of an unresolved list of actions return early
        if (cdk.Token.isUnresolved(actions))
            return;
        for (const action of actions || []) {
            if (!cdk.Token.isUnresolved(action) && !/^(\*|[a-zA-Z0-9-]+:[a-zA-Z0-9*]+)$/.test(action)) {
                throw new Error(`Action '${action}' is invalid. An action string consists of a service namespace, a colon, and the name of an action. Action names can include wildcards.`);
            }
        }
    }
    validatePolicyPrincipal(principal) {
        if (principal instanceof group_1.Group) {
            throw new Error('Cannot use an IAM Group as the \'Principal\' or \'NotPrincipal\' in an IAM Policy');
        }
    }
    /**
     * Specify AWS account ID as the principal entity to the "Principal" section of a policy statement.
     */
    addAwsAccountPrincipal(accountId) {
        this.addPrincipals(new principals_1.AccountPrincipal(accountId));
    }
    /**
     * Specify a principal using the ARN  identifier of the principal.
     * You cannot specify IAM groups and instance profiles as principals.
     *
     * @param arn ARN identifier of AWS account, IAM user, or IAM role (i.e. arn:aws:iam::123456789012:user/user-name)
     */
    addArnPrincipal(arn) {
        this.addPrincipals(new principals_1.ArnPrincipal(arn));
    }
    /**
     * Adds a service principal to this policy statement.
     *
     * @param service the service name for which a service principal is requested (e.g: `s3.amazonaws.com`).
     * @param opts    options for adding the service principal (such as specifying a principal in a different region)
     */
    addServicePrincipal(service, opts) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_ServicePrincipalOpts(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addServicePrincipal);
            }
            throw error;
        }
        this.addPrincipals(new principals_1.ServicePrincipal(service, opts));
    }
    /**
     * Adds a federated identity provider such as Amazon Cognito to this policy statement.
     *
     * @param federated federated identity provider (i.e. 'cognito-identity.amazonaws.com')
     * @param conditions The conditions under which the policy is in effect.
     *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    addFederatedPrincipal(federated, conditions) {
        this.addPrincipals(new principals_1.FederatedPrincipal(federated, conditions));
    }
    /**
     * Adds an AWS account root user principal to this policy statement
     */
    addAccountRootPrincipal() {
        this.addPrincipals(new principals_1.AccountRootPrincipal());
    }
    /**
     * Adds a canonical user ID principal to this policy document
     *
     * @param canonicalUserId unique identifier assigned by AWS for every account
     */
    addCanonicalUserPrincipal(canonicalUserId) {
        this.addPrincipals(new principals_1.CanonicalUserPrincipal(canonicalUserId));
    }
    /**
     * Adds all identities in all accounts ("*") to this policy statement
     */
    addAnyPrincipal() {
        this.addPrincipals(new principals_1.AnyPrincipal());
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
    addResources(...arns) {
        this.assertNotFrozen('addResources');
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
    addNotResources(...arns) {
        this.assertNotFrozen('addNotResources');
        if (arns.length > 0 && this._resource.length > 0) {
            throw new Error('Cannot add \'NotResources\' to policy statement if \'Resources\' have been added');
        }
        this._notResource.push(...arns);
    }
    /**
     * Adds a ``"*"`` resource to this statement.
     */
    addAllResources() {
        this.addResources('*');
    }
    /**
     * Indicates if this permission has at least one resource associated with it.
     */
    get hasResource() {
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
    addCondition(key, value) {
        this.assertNotFrozen('addCondition');
        (0, principals_1.validateConditionObject)(value);
        const existingValue = this._condition[key];
        this._condition[key] = existingValue ? { ...existingValue, ...value } : value;
    }
    /**
     * Add multiple conditions to the Policy
     *
     * See the `addCondition` function for a caveat on calling this method multiple times.
     */
    addConditions(conditions) {
        Object.keys(conditions).map(key => {
            this.addCondition(key, conditions[key]);
        });
    }
    /**
     * Add a condition that limits to a given account
     *
     * This method can only be called once: subsequent calls will overwrite earlier calls.
     */
    addAccountCondition(accountId) {
        this.addCondition('StringEquals', { 'sts:ExternalId': accountId });
    }
    /**
     * Create a new `PolicyStatement` with the same exact properties
     * as this one, except for the overrides
     */
    copy(overrides = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatementProps(overrides);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.copy);
            }
            throw error;
        }
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
    toStatementJson() {
        return (0, postprocess_policy_document_1.normalizeStatement)({
            Action: this._action.direct(),
            NotAction: this._notAction.direct(),
            Condition: this._condition,
            Effect: this.effect,
            Principal: this._principal,
            NotPrincipal: this._notPrincipal,
            Resource: this._resource.direct(),
            NotResource: this._notResource.direct(),
            Sid: this.sid,
        });
    }
    /**
     * String representation of this policy statement
     */
    toString() {
        return cdk.Token.asString(this, {
            displayHint: 'PolicyStatement',
        });
    }
    /**
     * JSON-ify the statement
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
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
    addPrincipalConditions(conditions) {
        // Stringifying the conditions is an easy way to do deep equality
        const theseConditions = JSON.stringify(conditions);
        if (this.principalConditionsJson === undefined) {
            // First principal, anything goes
            this.principalConditionsJson = theseConditions;
        }
        else {
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
    validateForAnyPolicy() {
        const errors = new Array();
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
    validateForResourcePolicy() {
        const errors = this.validateForAnyPolicy();
        if (this._principals.length === 0 && this._notPrincipals.length === 0) {
            errors.push('A PolicyStatement used in a resource-based policy must specify at least one IAM principal.');
        }
        return errors;
    }
    /**
     * Validate that the policy statement satisfies all requirements for an identity-based policy.
     *
     * @returns An array of validation error messages, or an empty array if the statement is valid.
     */
    validateForIdentityPolicy() {
        const errors = this.validateForAnyPolicy();
        if (this._principals.length > 0 || this._notPrincipals.length > 0) {
            errors.push('A PolicyStatement used in an identity-based policy cannot specify any IAM principals.');
        }
        if (this._resource.length === 0 && this._notResource.length === 0) {
            errors.push('A PolicyStatement used in an identity-based policy must specify at least one resource.');
        }
        return errors;
    }
    /**
     * The Actions added to this statement
     */
    get actions() {
        return this._action.copy();
    }
    /**
     * The NotActions added to this statement
     */
    get notActions() {
        return this._notAction.copy();
    }
    /**
     * The Principals added to this statement
     */
    get principals() {
        return this._principals.copy();
    }
    /**
     * The NotPrincipals added to this statement
     */
    get notPrincipals() {
        return this._notPrincipals.copy();
    }
    /**
     * The Resources added to this statement
     */
    get resources() {
        return this._resource.copy();
    }
    /**
     * The NotResources added to this statement
     */
    get notResources() {
        return this._notResource.copy();
    }
    /**
     * The conditions added to this statement
     */
    get conditions() {
        return { ...this._condition };
    }
    /**
     * Make the PolicyStatement immutable
     *
     * After calling this, any of the `addXxx()` methods will throw an exception.
     *
     * Libraries that lazily generate statement bodies can override this method to
     * fill the actual PolicyStatement fields. Be aware that this method may be called
     * multiple times.
     */
    freeze() {
        this._frozen = true;
        return this;
    }
    /**
     * Whether the PolicyStatement has been frozen
     *
     * The statement object is frozen when `freeze()` is called.
     */
    get frozen() {
        return this._frozen;
    }
    /**
     * Estimate the size of this policy statement
     *
     * By necessity, this will not be accurate. We'll do our best to overestimate
     * so we won't have nasty surprises.
     *
     * @internal
     */
    _estimateSize(options) {
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
        function count(key, values, tokenSize) {
            if (values.length > 0) {
                ret += key.length + 5 /* quotes, colon, brackets */ +
                    (0, util_1.sum)(values.map(v => (cdk.Token.isUnresolved(v) ? tokenSize : v.length) + 3 /* quotes, separator */));
            }
        }
    }
    /**
     * Throw an exception when the object is frozen
     */
    assertNotFrozen(method) {
        if (this._frozen) {
            throw new Error(`${method}: freeze() has been called on this PolicyStatement previously, so it can no longer be modified`);
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
PolicyStatement[_a] = { fqn: "@aws-cdk/aws-iam.PolicyStatement", version: "0.0.0" };
exports.PolicyStatement = PolicyStatement;
/**
 * The Effect element of an IAM policy
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html
 */
var Effect;
(function (Effect) {
    /**
     * Allows access to a resource in an IAM policy statement. By default, access to resources are denied.
     */
    Effect["ALLOW"] = "Allow";
    /**
     * Explicitly deny access to a resource. By default, all requests are denied implicitly.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
     */
    Effect["DENY"] = "Deny";
})(Effect = exports.Effect || (exports.Effect = {}));
class JsonPrincipal extends principals_1.PrincipalBase {
    constructor(json = {}) {
        super();
        // special case: if principal is a string, turn it into a "LiteralString" principal,
        // so we render the exact same string back out.
        if (typeof (json) === 'string') {
            json = { [util_1.LITERAL_STRING_KEY]: [json] };
        }
        if (typeof (json) !== 'object') {
            throw new Error(`JSON IAM principal should be an object, got ${JSON.stringify(json)}`);
        }
        this.policyFragment = {
            principalJson: json,
            conditions: {},
        };
    }
    dedupeString() {
        return JSON.stringify(this.policyFragment);
    }
}
/**
 * Derive the size estimation options from context
 *
 * @internal
 */
function deriveEstimateSizeOptions(scope) {
    const actionEstimate = 20;
    const arnEstimate = scope.node.tryGetContext(ARN_SIZE_ESTIMATE_CONTEXT_KEY) ?? DEFAULT_ARN_SIZE_ESTIMATE;
    if (typeof arnEstimate !== 'number') {
        throw new Error(`Context value ${ARN_SIZE_ESTIMATE_CONTEXT_KEY} should be a number, got ${JSON.stringify(arnEstimate)}`);
    }
    return { actionEstimate, arnEstimate };
}
exports.deriveEstimateSizeOptions = deriveEstimateSizeOptions;
/**
 * A class that behaves both as a set and an array
 *
 * Used for the elements of a PolicyStatement. In practice they behave as sets,
 * but we have thousands of snapshot tests in existence that will rely on a
 * particular order so we can't just change the type to `Set<>` wholesale without
 * causing a lot of churn.
 */
class OrderedSet {
    constructor() {
        this.set = new Set();
        this.array = new Array();
    }
    /**
     * Add new elements to the set
     *
     * @param xs the elements to be added
     *
     * @returns the elements actually added
     */
    push(...xs) {
        const ret = new Array();
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
    get length() {
        return this.array.length;
    }
    copy() {
        return [...this.array];
    }
    /**
     * Direct (read-only) access to the underlying array
     *
     * (Saves a copy)
     */
    direct() {
        return this.array;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LXN0YXRlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvbGljeS1zdGF0ZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBRXJDLG1DQUFnQztBQUNoQyw2Q0FHc0I7QUFDdEIsdUZBQTJFO0FBQzNFLHlDQUF5RTtBQUV6RSxNQUFNLHNCQUFzQixHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7SUFDNUMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7S0FDMUU7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsRUFBRTtRQUM3RSxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7S0FDMUU7SUFDRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7R0FRRztBQUNILE1BQU0seUJBQXlCLEdBQUcsR0FBRyxDQUFDO0FBRXRDOztHQUVHO0FBQ0gsTUFBTSw2QkFBNkIsR0FBRyxrQ0FBa0MsQ0FBQztBQUV6RTs7R0FFRztBQUNILE1BQWEsZUFBZTtJQUUxQjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFRO1FBQzdCLE1BQU0sR0FB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b3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICcuL2dyb3VwJztcbmltcG9ydCB7XG4gIEFjY291bnRQcmluY2lwYWwsIEFjY291bnRSb290UHJpbmNpcGFsLCBBbnlQcmluY2lwYWwsIEFyblByaW5jaXBhbCwgQ2Fub25pY2FsVXNlclByaW5jaXBhbCxcbiAgRmVkZXJhdGVkUHJpbmNpcGFsLCBJUHJpbmNpcGFsLCBQcmluY2lwYWxCYXNlLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCwgU2VydmljZVByaW5jaXBhbCwgU2VydmljZVByaW5jaXBhbE9wdHMsIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0LFxufSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgbm9ybWFsaXplU3RhdGVtZW50IH0gZnJvbSAnLi9wcml2YXRlL3Bvc3Rwcm9jZXNzLXBvbGljeS1kb2N1bWVudCc7XG5pbXBvcnQgeyBMSVRFUkFMX1NUUklOR19LRVksIG1lcmdlUHJpbmNpcGFsLCBzdW0gfSBmcm9tICcuL3ByaXZhdGUvdXRpbCc7XG5cbmNvbnN0IGVuc3VyZUFycmF5T3JVbmRlZmluZWQgPSAoZmllbGQ6IGFueSkgPT4ge1xuICBpZiAoZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiAoZmllbGQpICE9PSAnc3RyaW5nJyAmJiAhQXJyYXkuaXNBcnJheShmaWVsZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpZWxkcyBtdXN0IGJlIGVpdGhlciBhIHN0cmluZyBvciBhbiBhcnJheSBvZiBzdHJpbmdzJyk7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoZmllbGQpICYmICEhZmllbGQuZmluZCgoZjogYW55KSA9PiB0eXBlb2YgKGYpICE9PSAnc3RyaW5nJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpZWxkcyBtdXN0IGJlIGVpdGhlciBhIHN0cmluZyBvciBhbiBhcnJheSBvZiBzdHJpbmdzJyk7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZmllbGQpID8gZmllbGQgOiBbZmllbGRdO1xufTtcblxuLyoqXG4gKiBBbiBlc3RpbWF0ZSBvbiBob3cgbG9uZyBBUk5zIHR5cGljYWxseSBhcmVcbiAqXG4gKiBUaGlzIGlzIHVzZWQgdG8gZGVjaWRlIHdoZW4gdG8gc3RhcnQgc3BsaXR0aW5nIHN0YXRlbWVudHMgaW50byBuZXcgTWFuYWdlZCBQb2xpY2llcy5cbiAqIEJlY2F1c2Ugd2Ugb2Z0ZW4gY2FuJ3Qga25vdyB0aGUgbGVuZ3RoIG9mIGFuIEFSTiAoaXQgbWF5IGJlIGEgdG9rZW4gYW5kIG9ubHlcbiAqIGF2YWlsYWJsZSBhdCBkZXBsb3ltZW50IHRpbWUpIHdlJ2xsIGhhdmUgdG8gZXN0aW1hdGUgaXQuXG4gKlxuICogVGhlIGVzdGltYXRlIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNldHRpbmcgdGhlIGBAYXdzLWNkay9hd3MtaWFtLmFyblNpemVFc3RpbWF0ZWAgY29udGV4dCBrZXkuXG4gKi9cbmNvbnN0IERFRkFVTFRfQVJOX1NJWkVfRVNUSU1BVEUgPSAxNTA7XG5cbi8qKlxuICogQ29udGV4dCBrZXkgd2hpY2ggY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGVzdGltYXRlZCBsZW5ndGggb2YgdW5yZXNvbHZlZCBBUk5zLlxuICovXG5jb25zdCBBUk5fU0laRV9FU1RJTUFURV9DT05URVhUX0tFWSA9ICdAYXdzLWNkay9hd3MtaWFtLmFyblNpemVFc3RpbWF0ZSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHN0YXRlbWVudCBpbiBhbiBJQU0gcG9saWN5IGRvY3VtZW50LlxuICovXG5leHBvcnQgY2xhc3MgUG9saWN5U3RhdGVtZW50IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBQb2xpY3lTdGF0ZW1lbnQgYmFzZWQgb24gdGhlIG9iamVjdCBwcm92aWRlZC5cbiAgICogVGhpcyB3aWxsIGFjY2VwdCBhbiBvYmplY3QgY3JlYXRlZCBmcm9tIHRoZSBgLnRvSlNPTigpYCBjYWxsXG4gICAqIEBwYXJhbSBvYmogdGhlIFBvbGljeVN0YXRlbWVudCBpbiBvYmplY3QgZm9ybS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUpzb24ob2JqOiBhbnkpIHtcbiAgICBjb25zdCByZXQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHNpZDogb2JqLlNpZCxcbiAgICAgIGFjdGlvbnM6IGVuc3VyZUFycmF5T3JVbmRlZmluZWQob2JqLkFjdGlvbiksXG4gICAgICByZXNvdXJjZXM6IGVuc3VyZUFycmF5T3JVbmRlZmluZWQob2JqLlJlc291cmNlKSxcbiAgICAgIGNvbmRpdGlvbnM6IG9iai5Db25kaXRpb24sXG4gICAgICBlZmZlY3Q6IG9iai5FZmZlY3QsXG4gICAgICBub3RBY3Rpb25zOiBlbnN1cmVBcnJheU9yVW5kZWZpbmVkKG9iai5Ob3RBY3Rpb24pLFxuICAgICAgbm90UmVzb3VyY2VzOiBlbnN1cmVBcnJheU9yVW5kZWZpbmVkKG9iai5Ob3RSZXNvdXJjZSksXG4gICAgICBwcmluY2lwYWxzOiBvYmouUHJpbmNpcGFsID8gW25ldyBKc29uUHJpbmNpcGFsKG9iai5QcmluY2lwYWwpXSA6IHVuZGVmaW5lZCxcbiAgICAgIG5vdFByaW5jaXBhbHM6IG9iai5Ob3RQcmluY2lwYWwgPyBbbmV3IEpzb25QcmluY2lwYWwob2JqLk5vdFByaW5jaXBhbCldIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgLy8gdmFsaWRhdGUgdGhhdCB0aGUgUG9saWN5U3RhdGVtZW50IGhhcyB0aGUgY29ycmVjdCBzaGFwZVxuICAgIGNvbnN0IGVycm9ycyA9IHJldC52YWxpZGF0ZUZvckFueVBvbGljeSgpO1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgUG9saWN5IFN0YXRlbWVudDogJyArIGVycm9ycy5qb2luKCdcXG4nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FjdGlvbiA9IG5ldyBPcmRlcmVkU2V0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbm90QWN0aW9uID0gbmV3IE9yZGVyZWRTZXQ8c3RyaW5nPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wcmluY2lwYWw6IHsgW2tleTogc3RyaW5nXTogYW55W10gfSA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IF9ub3RQcmluY2lwYWw6IHsgW2tleTogc3RyaW5nXTogYW55W10gfSA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZXNvdXJjZSA9IG5ldyBPcmRlcmVkU2V0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbm90UmVzb3VyY2UgPSBuZXcgT3JkZXJlZFNldDxzdHJpbmc+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbmRpdGlvbjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHsgfTtcbiAgcHJpdmF0ZSBfc2lkPzogc3RyaW5nO1xuICBwcml2YXRlIF9lZmZlY3Q6IEVmZmVjdDtcbiAgcHJpdmF0ZSBwcmluY2lwYWxDb25kaXRpb25zSnNvbj86IHN0cmluZztcblxuICAvLyBIb2xkIG9uIHRvIHRob3NlIHByaW5jaXBhbHNcbiAgcHJpdmF0ZSByZWFkb25seSBfcHJpbmNpcGFscyA9IG5ldyBPcmRlcmVkU2V0PElQcmluY2lwYWw+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX25vdFByaW5jaXBhbHMgPSBuZXcgT3JkZXJlZFNldDxJUHJpbmNpcGFsPigpO1xuICBwcml2YXRlIF9mcm96ZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUG9saWN5U3RhdGVtZW50UHJvcHMgPSB7fSkge1xuICAgIHRoaXMuX3NpZCA9IHByb3BzLnNpZDtcbiAgICB0aGlzLl9lZmZlY3QgPSBwcm9wcy5lZmZlY3QgfHwgRWZmZWN0LkFMTE9XO1xuXG4gICAgdGhpcy5hZGRBY3Rpb25zKC4uLnByb3BzLmFjdGlvbnMgfHwgW10pO1xuICAgIHRoaXMuYWRkTm90QWN0aW9ucyguLi5wcm9wcy5ub3RBY3Rpb25zIHx8IFtdKTtcbiAgICB0aGlzLmFkZFByaW5jaXBhbHMoLi4ucHJvcHMucHJpbmNpcGFscyB8fCBbXSk7XG4gICAgdGhpcy5hZGROb3RQcmluY2lwYWxzKC4uLnByb3BzLm5vdFByaW5jaXBhbHMgfHwgW10pO1xuICAgIHRoaXMuYWRkUmVzb3VyY2VzKC4uLnByb3BzLnJlc291cmNlcyB8fCBbXSk7XG4gICAgdGhpcy5hZGROb3RSZXNvdXJjZXMoLi4ucHJvcHMubm90UmVzb3VyY2VzIHx8IFtdKTtcbiAgICBpZiAocHJvcHMuY29uZGl0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFkZENvbmRpdGlvbnMocHJvcHMuY29uZGl0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRlbWVudCBJRCBmb3IgdGhpcyBzdGF0ZW1lbnRcbiAgICovXG4gIHB1YmxpYyBnZXQgc2lkKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgU3RhdGVtZW50IElEIGZvciB0aGlzIHN0YXRlbWVudFxuICAgKi9cbiAgcHVibGljIHNldCBzaWQoc2lkOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmFzc2VydE5vdEZyb3plbignc2lkJyk7XG4gICAgdGhpcy5fc2lkID0gc2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYWxsb3cgb3IgZGVueSB0aGUgYWN0aW9ucyBpbiB0aGlzIHN0YXRlbWVudFxuICAgKi9cbiAgcHVibGljIGdldCBlZmZlY3QoKTogRWZmZWN0IHtcbiAgICByZXR1cm4gdGhpcy5fZWZmZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBlZmZlY3QgZm9yIHRoaXMgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgc2V0IGVmZmVjdChlZmZlY3Q6IEVmZmVjdCkge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdlZmZlY3QnKTtcbiAgICB0aGlzLl9lZmZlY3QgPSBlZmZlY3Q7XG4gIH1cblxuICAvL1xuICAvLyBBY3Rpb25zXG4gIC8vXG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgYWxsb3dlZCBhY3Rpb25zIGludG8gdGhlIFwiQWN0aW9uXCIgc2VjdGlvbiBvZiB0aGUgcG9saWN5IHN0YXRlbWVudC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2FjdGlvbi5odG1sXG4gICAqXG4gICAqIEBwYXJhbSBhY3Rpb25zIGFjdGlvbnMgdGhhdCB3aWxsIGJlIGFsbG93ZWQuXG4gICAqL1xuICBwdWJsaWMgYWRkQWN0aW9ucyguLi5hY3Rpb25zOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdhZGRBY3Rpb25zJyk7XG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoID4gMCAmJiB0aGlzLl9ub3RBY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIFxcJ0FjdGlvbnNcXCcgdG8gcG9saWN5IHN0YXRlbWVudCBpZiBcXCdOb3RBY3Rpb25zXFwnIGhhdmUgYmVlbiBhZGRlZCcpO1xuICAgIH1cbiAgICB0aGlzLnZhbGlkYXRlUG9saWN5QWN0aW9ucyhhY3Rpb25zKTtcbiAgICB0aGlzLl9hY3Rpb24ucHVzaCguLi5hY3Rpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBsaWNpdGx5IGFsbG93IGFsbCBhY3Rpb25zIGV4Y2VwdCB0aGUgc3BlY2lmaWVkIGxpc3Qgb2YgYWN0aW9ucyBpbnRvIHRoZSBcIk5vdEFjdGlvblwiIHNlY3Rpb25cbiAgICogb2YgdGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX25vdGFjdGlvbi5odG1sXG4gICAqXG4gICAqIEBwYXJhbSBub3RBY3Rpb25zIGFjdGlvbnMgdGhhdCB3aWxsIGJlIGRlbmllZC4gQWxsIG90aGVyIGFjdGlvbnMgd2lsbCBiZSBwZXJtaXR0ZWQuXG4gICAqL1xuICBwdWJsaWMgYWRkTm90QWN0aW9ucyguLi5ub3RBY3Rpb25zOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdhZGROb3RBY3Rpb25zJyk7XG4gICAgaWYgKG5vdEFjdGlvbnMubGVuZ3RoID4gMCAmJiB0aGlzLl9hY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIFxcJ05vdEFjdGlvbnNcXCcgdG8gcG9saWN5IHN0YXRlbWVudCBpZiBcXCdBY3Rpb25zXFwnIGhhdmUgYmVlbiBhZGRlZCcpO1xuICAgIH1cbiAgICB0aGlzLnZhbGlkYXRlUG9saWN5QWN0aW9ucyhub3RBY3Rpb25zKTtcbiAgICB0aGlzLl9ub3RBY3Rpb24ucHVzaCguLi5ub3RBY3Rpb25zKTtcbiAgfVxuXG4gIC8vXG4gIC8vIFByaW5jaXBhbFxuICAvL1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBwZXJtaXNzaW9uIGhhcyBhIFwiUHJpbmNpcGFsXCIgc2VjdGlvbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgaGFzUHJpbmNpcGFsKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmluY2lwYWxzLmxlbmd0aCArIHRoaXMuX25vdFByaW5jaXBhbHMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHByaW5jaXBhbHMgdG8gdGhlIFwiUHJpbmNpcGFsXCIgc2VjdGlvbiBvZiBhIHBvbGljeSBzdGF0ZW1lbnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19wcmluY2lwYWwuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gcHJpbmNpcGFscyBJQU0gcHJpbmNpcGFscyB0aGF0IHdpbGwgYmUgYWRkZWRcbiAgICovXG4gIHB1YmxpYyBhZGRQcmluY2lwYWxzKC4uLnByaW5jaXBhbHM6IElQcmluY2lwYWxbXSkge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdhZGRQcmluY2lwYWxzJyk7XG4gICAgaWYgKHByaW5jaXBhbHMubGVuZ3RoID4gMCAmJiB0aGlzLl9ub3RQcmluY2lwYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBcXCdQcmluY2lwYWxzXFwnIHRvIHBvbGljeSBzdGF0ZW1lbnQgaWYgXFwnTm90UHJpbmNpcGFsc1xcJyBoYXZlIGJlZW4gYWRkZWQnKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBwcmluY2lwYWwgb2YgcHJpbmNpcGFscykge1xuICAgICAgdGhpcy52YWxpZGF0ZVBvbGljeVByaW5jaXBhbChwcmluY2lwYWwpO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZGVkID0gdGhpcy5fcHJpbmNpcGFscy5wdXNoKC4uLnByaW5jaXBhbHMpO1xuICAgIGZvciAoY29uc3QgcHJpbmNpcGFsIG9mIGFkZGVkKSB7XG4gICAgICBjb25zdCBmcmFnbWVudCA9IHByaW5jaXBhbC5wb2xpY3lGcmFnbWVudDtcbiAgICAgIG1lcmdlUHJpbmNpcGFsKHRoaXMuX3ByaW5jaXBhbCwgZnJhZ21lbnQucHJpbmNpcGFsSnNvbik7XG4gICAgICB0aGlzLmFkZFByaW5jaXBhbENvbmRpdGlvbnMoZnJhZ21lbnQuY29uZGl0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgcHJpbmNpcGFscyB0aGF0IGlzIG5vdCBhbGxvd2VkIG9yIGRlbmllZCBhY2Nlc3MgdG8gdGhlIFwiTm90UHJpbmNpcGFsXCIgc2VjdGlvbiBvZlxuICAgKiBhIHBvbGljeSBzdGF0ZW1lbnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19ub3RwcmluY2lwYWwuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gbm90UHJpbmNpcGFscyBJQU0gcHJpbmNpcGFscyB0aGF0IHdpbGwgYmUgZGVuaWVkIGFjY2Vzc1xuICAgKi9cbiAgcHVibGljIGFkZE5vdFByaW5jaXBhbHMoLi4ubm90UHJpbmNpcGFsczogSVByaW5jaXBhbFtdKSB7XG4gICAgdGhpcy5hc3NlcnROb3RGcm96ZW4oJ2FkZE5vdFByaW5jaXBhbHMnKTtcbiAgICBpZiAobm90UHJpbmNpcGFscy5sZW5ndGggPiAwICYmIHRoaXMuX3ByaW5jaXBhbHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIFxcJ05vdFByaW5jaXBhbHNcXCcgdG8gcG9saWN5IHN0YXRlbWVudCBpZiBcXCdQcmluY2lwYWxzXFwnIGhhdmUgYmVlbiBhZGRlZCcpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG5vdFByaW5jaXBhbCBvZiBub3RQcmluY2lwYWxzKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlUG9saWN5UHJpbmNpcGFsKG5vdFByaW5jaXBhbCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkZWQgPSB0aGlzLl9ub3RQcmluY2lwYWxzLnB1c2goLi4ubm90UHJpbmNpcGFscyk7XG4gICAgZm9yIChjb25zdCBub3RQcmluY2lwYWwgb2YgYWRkZWQpIHtcbiAgICAgIGNvbnN0IGZyYWdtZW50ID0gbm90UHJpbmNpcGFsLnBvbGljeUZyYWdtZW50O1xuICAgICAgbWVyZ2VQcmluY2lwYWwodGhpcy5fbm90UHJpbmNpcGFsLCBmcmFnbWVudC5wcmluY2lwYWxKc29uKTtcbiAgICAgIHRoaXMuYWRkUHJpbmNpcGFsQ29uZGl0aW9ucyhmcmFnbWVudC5jb25kaXRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUG9saWN5QWN0aW9ucyhhY3Rpb25zOiBzdHJpbmdbXSkge1xuICAgIC8vIEluIGNhc2Ugb2YgYW4gdW5yZXNvbHZlZCBsaXN0IG9mIGFjdGlvbnMgcmV0dXJuIGVhcmx5XG4gICAgaWYgKGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoYWN0aW9ucykpIHJldHVybjtcbiAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiBhY3Rpb25zIHx8IFtdKSB7XG4gICAgICBpZiAoIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoYWN0aW9uKSAmJiAhL14oXFwqfFthLXpBLVowLTktXSs6W2EtekEtWjAtOSpdKykkLy50ZXN0KGFjdGlvbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY3Rpb24gJyR7YWN0aW9ufScgaXMgaW52YWxpZC4gQW4gYWN0aW9uIHN0cmluZyBjb25zaXN0cyBvZiBhIHNlcnZpY2UgbmFtZXNwYWNlLCBhIGNvbG9uLCBhbmQgdGhlIG5hbWUgb2YgYW4gYWN0aW9uLiBBY3Rpb24gbmFtZXMgY2FuIGluY2x1ZGUgd2lsZGNhcmRzLmApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVQb2xpY3lQcmluY2lwYWwocHJpbmNpcGFsOiBJUHJpbmNpcGFsKSB7XG4gICAgaWYgKHByaW5jaXBhbCBpbnN0YW5jZW9mIEdyb3VwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYW4gSUFNIEdyb3VwIGFzIHRoZSBcXCdQcmluY2lwYWxcXCcgb3IgXFwnTm90UHJpbmNpcGFsXFwnIGluIGFuIElBTSBQb2xpY3knKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmeSBBV1MgYWNjb3VudCBJRCBhcyB0aGUgcHJpbmNpcGFsIGVudGl0eSB0byB0aGUgXCJQcmluY2lwYWxcIiBzZWN0aW9uIG9mIGEgcG9saWN5IHN0YXRlbWVudC5cbiAgICovXG4gIHB1YmxpYyBhZGRBd3NBY2NvdW50UHJpbmNpcGFsKGFjY291bnRJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKG5ldyBBY2NvdW50UHJpbmNpcGFsKGFjY291bnRJZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgYSBwcmluY2lwYWwgdXNpbmcgdGhlIEFSTiAgaWRlbnRpZmllciBvZiB0aGUgcHJpbmNpcGFsLlxuICAgKiBZb3UgY2Fubm90IHNwZWNpZnkgSUFNIGdyb3VwcyBhbmQgaW5zdGFuY2UgcHJvZmlsZXMgYXMgcHJpbmNpcGFscy5cbiAgICpcbiAgICogQHBhcmFtIGFybiBBUk4gaWRlbnRpZmllciBvZiBBV1MgYWNjb3VudCwgSUFNIHVzZXIsIG9yIElBTSByb2xlIChpLmUuIGFybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6dXNlci91c2VyLW5hbWUpXG4gICAqL1xuICBwdWJsaWMgYWRkQXJuUHJpbmNpcGFsKGFybjogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKG5ldyBBcm5QcmluY2lwYWwoYXJuKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHNlcnZpY2UgcHJpbmNpcGFsIHRvIHRoaXMgcG9saWN5IHN0YXRlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHNlcnZpY2UgdGhlIHNlcnZpY2UgbmFtZSBmb3Igd2hpY2ggYSBzZXJ2aWNlIHByaW5jaXBhbCBpcyByZXF1ZXN0ZWQgKGUuZzogYHMzLmFtYXpvbmF3cy5jb21gKS5cbiAgICogQHBhcmFtIG9wdHMgICAgb3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBzZXJ2aWNlIHByaW5jaXBhbCAoc3VjaCBhcyBzcGVjaWZ5aW5nIGEgcHJpbmNpcGFsIGluIGEgZGlmZmVyZW50IHJlZ2lvbilcbiAgICovXG4gIHB1YmxpYyBhZGRTZXJ2aWNlUHJpbmNpcGFsKHNlcnZpY2U6IHN0cmluZywgb3B0cz86IFNlcnZpY2VQcmluY2lwYWxPcHRzKSB7XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKG5ldyBTZXJ2aWNlUHJpbmNpcGFsKHNlcnZpY2UsIG9wdHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZmVkZXJhdGVkIGlkZW50aXR5IHByb3ZpZGVyIHN1Y2ggYXMgQW1hem9uIENvZ25pdG8gdG8gdGhpcyBwb2xpY3kgc3RhdGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZmVkZXJhdGVkIGZlZGVyYXRlZCBpZGVudGl0eSBwcm92aWRlciAoaS5lLiAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJylcbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqICAgU2VlIFt0aGUgSUFNIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfY29uZGl0aW9uLmh0bWwpLlxuICAgKi9cbiAgcHVibGljIGFkZEZlZGVyYXRlZFByaW5jaXBhbChmZWRlcmF0ZWQ6IGFueSwgY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIHRoaXMuYWRkUHJpbmNpcGFscyhuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKGZlZGVyYXRlZCwgY29uZGl0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gQVdTIGFjY291bnQgcm9vdCB1c2VyIHByaW5jaXBhbCB0byB0aGlzIHBvbGljeSBzdGF0ZW1lbnRcbiAgICovXG4gIHB1YmxpYyBhZGRBY2NvdW50Um9vdFByaW5jaXBhbCgpIHtcbiAgICB0aGlzLmFkZFByaW5jaXBhbHMobmV3IEFjY291bnRSb290UHJpbmNpcGFsKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjYW5vbmljYWwgdXNlciBJRCBwcmluY2lwYWwgdG8gdGhpcyBwb2xpY3kgZG9jdW1lbnRcbiAgICpcbiAgICogQHBhcmFtIGNhbm9uaWNhbFVzZXJJZCB1bmlxdWUgaWRlbnRpZmllciBhc3NpZ25lZCBieSBBV1MgZm9yIGV2ZXJ5IGFjY291bnRcbiAgICovXG4gIHB1YmxpYyBhZGRDYW5vbmljYWxVc2VyUHJpbmNpcGFsKGNhbm9uaWNhbFVzZXJJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKG5ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKGNhbm9uaWNhbFVzZXJJZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYWxsIGlkZW50aXRpZXMgaW4gYWxsIGFjY291bnRzIChcIipcIikgdG8gdGhpcyBwb2xpY3kgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgYWRkQW55UHJpbmNpcGFsKCkge1xuICAgIHRoaXMuYWRkUHJpbmNpcGFscyhuZXcgQW55UHJpbmNpcGFsKCkpO1xuICB9XG5cbiAgLy9cbiAgLy8gUmVzb3VyY2VzXG4gIC8vXG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgcmVzb3VyY2VzIHRoYXQgdGhpcyBwb2xpY3kgc3RhdGVtZW50IGFwcGxpZXMgaW50byB0aGUgXCJSZXNvdXJjZVwiIHNlY3Rpb24gb2ZcbiAgICogdGhpcyBwb2xpY3kgc3RhdGVtZW50LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfcmVzb3VyY2UuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gYXJucyBBbWF6b24gUmVzb3VyY2UgTmFtZXMgKEFSTnMpIG9mIHRoZSByZXNvdXJjZXMgdGhhdCB0aGlzIHBvbGljeSBzdGF0ZW1lbnQgYXBwbGllcyB0b1xuICAgKi9cbiAgcHVibGljIGFkZFJlc291cmNlcyguLi5hcm5zOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdhZGRSZXNvdXJjZXMnKTtcbiAgICBpZiAoYXJucy5sZW5ndGggPiAwICYmIHRoaXMuX25vdFJlc291cmNlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBcXCdSZXNvdXJjZXNcXCcgdG8gcG9saWN5IHN0YXRlbWVudCBpZiBcXCdOb3RSZXNvdXJjZXNcXCcgaGF2ZSBiZWVuIGFkZGVkJyk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc291cmNlLnB1c2goLi4uYXJucyk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmeSByZXNvdXJjZXMgdGhhdCB0aGlzIHBvbGljeSBzdGF0ZW1lbnQgd2lsbCBub3QgYXBwbHkgdG8gaW4gdGhlIFwiTm90UmVzb3VyY2VcIiBzZWN0aW9uXG4gICAqIG9mIHRoaXMgcG9saWN5IHN0YXRlbWVudC4gQWxsIHJlc291cmNlcyBleGNlcHQgdGhlIHNwZWNpZmllZCBsaXN0IHdpbGwgYmUgbWF0Y2hlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX25vdHJlc291cmNlLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIGFybnMgQW1hem9uIFJlc291cmNlIE5hbWVzIChBUk5zKSBvZiB0aGUgcmVzb3VyY2VzIHRoYXQgdGhpcyBwb2xpY3kgc3RhdGVtZW50IGRvZXMgbm90IGFwcGx5IHRvXG4gICAqL1xuICBwdWJsaWMgYWRkTm90UmVzb3VyY2VzKC4uLmFybnM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5hc3NlcnROb3RGcm96ZW4oJ2FkZE5vdFJlc291cmNlcycpO1xuICAgIGlmIChhcm5zLmxlbmd0aCA+IDAgJiYgdGhpcy5fcmVzb3VyY2UubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIFxcJ05vdFJlc291cmNlc1xcJyB0byBwb2xpY3kgc3RhdGVtZW50IGlmIFxcJ1Jlc291cmNlc1xcJyBoYXZlIGJlZW4gYWRkZWQnKTtcbiAgICB9XG4gICAgdGhpcy5fbm90UmVzb3VyY2UucHVzaCguLi5hcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYGBcIipcImBgIHJlc291cmNlIHRvIHRoaXMgc3RhdGVtZW50LlxuICAgKi9cbiAgcHVibGljIGFkZEFsbFJlc291cmNlcygpIHtcbiAgICB0aGlzLmFkZFJlc291cmNlcygnKicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGlzIHBlcm1pc3Npb24gaGFzIGF0IGxlYXN0IG9uZSByZXNvdXJjZSBhc3NvY2lhdGVkIHdpdGggaXQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGhhc1Jlc291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZSAmJiB0aGlzLl9yZXNvdXJjZS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLy9cbiAgLy8gQ29uZGl0aW9uXG4gIC8vXG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbmRpdGlvbiB0byB0aGUgUG9saWN5XG4gICAqXG4gICAqIElmIG11bHRpcGxlIGNhbGxzIGFyZSBtYWRlIHRvIGFkZCBhIGNvbmRpdGlvbiB3aXRoIHRoZSBzYW1lIG9wZXJhdG9yIGFuZCBmaWVsZCwgb25seVxuICAgKiB0aGUgbGFzdCBvbmUgd2lucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGRlY2xhcmUgY29uc3Qgc3RtdDogaWFtLlBvbGljeVN0YXRlbWVudDtcbiAgICpcbiAgICogc3RtdC5hZGRDb25kaXRpb24oJ1N0cmluZ0VxdWFscycsIHsgJ2F3czpTb21lRmllbGQnOiAnMScgfSk7XG4gICAqIHN0bXQuYWRkQ29uZGl0aW9uKCdTdHJpbmdFcXVhbHMnLCB7ICdhd3M6U29tZUZpZWxkJzogJzInIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogV2lsbCBlbmQgdXAgd2l0aCB0aGUgc2luZ2xlIGNvbmRpdGlvbiBgU3RyaW5nRXF1YWxzOiB7ICdhd3M6U29tZUZpZWxkJzogJzInIH1gLlxuICAgKlxuICAgKiBJZiB5b3UgbWVhbnQgdG8gYWRkIGEgY29uZGl0aW9uIHRvIHNheSB0aGF0IHRoZSBmaWVsZCBjYW4gYmUgKmVpdGhlciogYDFgIG9yIGAyYCwgd3JpdGVcbiAgICogdGhpczpcbiAgICpcbiAgICogYGBgdHNcbiAgICogZGVjbGFyZSBjb25zdCBzdG10OiBpYW0uUG9saWN5U3RhdGVtZW50O1xuICAgKlxuICAgKiBzdG10LmFkZENvbmRpdGlvbignU3RyaW5nRXF1YWxzJywgeyAnYXdzOlNvbWVGaWVsZCc6IFsnMScsICcyJ10gfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGFkZENvbmRpdGlvbihrZXk6IHN0cmluZywgdmFsdWU6IENvbmRpdGlvbikge1xuICAgIHRoaXMuYXNzZXJ0Tm90RnJvemVuKCdhZGRDb25kaXRpb24nKTtcbiAgICB2YWxpZGF0ZUNvbmRpdGlvbk9iamVjdCh2YWx1ZSk7XG5cbiAgICBjb25zdCBleGlzdGluZ1ZhbHVlID0gdGhpcy5fY29uZGl0aW9uW2tleV07XG4gICAgdGhpcy5fY29uZGl0aW9uW2tleV0gPSBleGlzdGluZ1ZhbHVlID8geyAuLi5leGlzdGluZ1ZhbHVlLCAuLi52YWx1ZSB9IDogdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGNvbmRpdGlvbnMgdG8gdGhlIFBvbGljeVxuICAgKlxuICAgKiBTZWUgdGhlIGBhZGRDb25kaXRpb25gIGZ1bmN0aW9uIGZvciBhIGNhdmVhdCBvbiBjYWxsaW5nIHRoaXMgbWV0aG9kIG11bHRpcGxlIHRpbWVzLlxuICAgKi9cbiAgcHVibGljIGFkZENvbmRpdGlvbnMoY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIE9iamVjdC5rZXlzKGNvbmRpdGlvbnMpLm1hcChrZXkgPT4ge1xuICAgICAgdGhpcy5hZGRDb25kaXRpb24oa2V5LCBjb25kaXRpb25zW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbmRpdGlvbiB0aGF0IGxpbWl0cyB0byBhIGdpdmVuIGFjY291bnRcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIG9ubHkgYmUgY2FsbGVkIG9uY2U6IHN1YnNlcXVlbnQgY2FsbHMgd2lsbCBvdmVyd3JpdGUgZWFybGllciBjYWxscy5cbiAgICovXG4gIHB1YmxpYyBhZGRBY2NvdW50Q29uZGl0aW9uKGFjY291bnRJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRDb25kaXRpb24oJ1N0cmluZ0VxdWFscycsIHsgJ3N0czpFeHRlcm5hbElkJzogYWNjb3VudElkIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgUG9saWN5U3RhdGVtZW50YCB3aXRoIHRoZSBzYW1lIGV4YWN0IHByb3BlcnRpZXNcbiAgICogYXMgdGhpcyBvbmUsIGV4Y2VwdCBmb3IgdGhlIG92ZXJyaWRlc1xuICAgKi9cbiAgcHVibGljIGNvcHkob3ZlcnJpZGVzOiBQb2xpY3lTdGF0ZW1lbnRQcm9wcyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgc2lkOiBvdmVycmlkZXMuc2lkID8/IHRoaXMuc2lkLFxuICAgICAgZWZmZWN0OiBvdmVycmlkZXMuZWZmZWN0ID8/IHRoaXMuZWZmZWN0LFxuICAgICAgYWN0aW9uczogb3ZlcnJpZGVzLmFjdGlvbnMgPz8gdGhpcy5hY3Rpb25zLFxuICAgICAgbm90QWN0aW9uczogb3ZlcnJpZGVzLm5vdEFjdGlvbnMgPz8gdGhpcy5ub3RBY3Rpb25zLFxuXG4gICAgICBwcmluY2lwYWxzOiBvdmVycmlkZXMucHJpbmNpcGFscyA/PyB0aGlzLnByaW5jaXBhbHMsXG4gICAgICBub3RQcmluY2lwYWxzOiBvdmVycmlkZXMubm90UHJpbmNpcGFscyA/PyB0aGlzLm5vdFByaW5jaXBhbHMsXG5cbiAgICAgIHJlc291cmNlczogb3ZlcnJpZGVzLnJlc291cmNlcyA/PyB0aGlzLnJlc291cmNlcyxcbiAgICAgIG5vdFJlc291cmNlczogb3ZlcnJpZGVzLm5vdFJlc291cmNlcyA/PyB0aGlzLm5vdFJlc291cmNlcyxcblxuICAgICAgY29uZGl0aW9uczogb3ZlcnJpZGVzLmNvbmRpdGlvbnMgPz8gdGhpcy5jb25kaXRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEpTT04taWZ5IHRoZSBwb2xpY3kgc3RhdGVtZW50XG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvU3RhdGVtZW50SnNvbigpOiBhbnkge1xuICAgIHJldHVybiBub3JtYWxpemVTdGF0ZW1lbnQoe1xuICAgICAgQWN0aW9uOiB0aGlzLl9hY3Rpb24uZGlyZWN0KCksXG4gICAgICBOb3RBY3Rpb246IHRoaXMuX25vdEFjdGlvbi5kaXJlY3QoKSxcbiAgICAgIENvbmRpdGlvbjogdGhpcy5fY29uZGl0aW9uLFxuICAgICAgRWZmZWN0OiB0aGlzLmVmZmVjdCxcbiAgICAgIFByaW5jaXBhbDogdGhpcy5fcHJpbmNpcGFsLFxuICAgICAgTm90UHJpbmNpcGFsOiB0aGlzLl9ub3RQcmluY2lwYWwsXG4gICAgICBSZXNvdXJjZTogdGhpcy5fcmVzb3VyY2UuZGlyZWN0KCksXG4gICAgICBOb3RSZXNvdXJjZTogdGhpcy5fbm90UmVzb3VyY2UuZGlyZWN0KCksXG4gICAgICBTaWQ6IHRoaXMuc2lkLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHBvbGljeSBzdGF0ZW1lbnRcbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMsIHtcbiAgICAgIGRpc3BsYXlIaW50OiAnUG9saWN5U3RhdGVtZW50JyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKU09OLWlmeSB0aGUgc3RhdGVtZW50XG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0YXRlbWVudEpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBwcmluY2lwYWwncyBjb25kaXRpb25zXG4gICAqXG4gICAqIEZvciBjb252ZW5pZW5jZSwgcHJpbmNpcGFscyBoYXZlIGJlZW4gbW9kZWxlZCBhcyBib3RoIGEgcHJpbmNpcGFsXG4gICAqIGFuZCBhIHNldCBvZiBjb25kaXRpb25zLiBUaGlzIG1ha2VzIGl0IHBvc3NpYmxlIHRvIGhhdmUgYSBzaW5nbGVcbiAgICogb2JqZWN0IHJlcHJlc2VudCBlLmcuIGFuIFwiU05TIFRvcGljXCIgKFNOUyBzZXJ2aWNlIHByaW5jaXBhbCArIGF3czpTb3VyY0FyblxuICAgKiBjb25kaXRpb24pIG9yIGFuIE9yZ2FuaXphdGlvbiBtZW1iZXIgKCogKyBhd3M6T3JnSWQgY29uZGl0aW9uKS5cbiAgICpcbiAgICogSG93ZXZlciwgd2hlbiB1c2luZyBtdWx0aXBsZSBwcmluY2lwYWxzIGluIHRoZSBzYW1lIHBvbGljeSBzdGF0ZW1lbnQsXG4gICAqIHRoZXkgbXVzdCBhbGwgaGF2ZSB0aGUgc2FtZSBjb25kaXRpb25zIG9yIHRoZSBPUiBzYW1lbnRpY3NcbiAgICogaW1wbGllZCBieSBhIGxpc3Qgb2YgcHJpbmNpcGFscyBjYW5ub3QgYmUgZ3VhcmFudGVlZCAodXNlciBuZWVkcyB0b1xuICAgKiBhZGQgbXVsdGlwbGUgc3RhdGVtZW50cyBpbiB0aGF0IGNhc2UpLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGRQcmluY2lwYWxDb25kaXRpb25zKGNvbmRpdGlvbnM6IENvbmRpdGlvbnMpIHtcbiAgICAvLyBTdHJpbmdpZnlpbmcgdGhlIGNvbmRpdGlvbnMgaXMgYW4gZWFzeSB3YXkgdG8gZG8gZGVlcCBlcXVhbGl0eVxuICAgIGNvbnN0IHRoZXNlQ29uZGl0aW9ucyA9IEpTT04uc3RyaW5naWZ5KGNvbmRpdGlvbnMpO1xuICAgIGlmICh0aGlzLnByaW5jaXBhbENvbmRpdGlvbnNKc29uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEZpcnN0IHByaW5jaXBhbCwgYW55dGhpbmcgZ29lc1xuICAgICAgdGhpcy5wcmluY2lwYWxDb25kaXRpb25zSnNvbiA9IHRoZXNlQ29uZGl0aW9ucztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJpbmNpcGFsQ29uZGl0aW9uc0pzb24gIT09IHRoZXNlQ29uZGl0aW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFsbCBwcmluY2lwYWxzIGluIGEgUG9saWN5U3RhdGVtZW50IG11c3QgaGF2ZSB0aGUgc2FtZSBDb25kaXRpb25zIChnb3QgJyR7dGhpcy5wcmluY2lwYWxDb25kaXRpb25zSnNvbn0nIGFuZCAnJHt0aGVzZUNvbmRpdGlvbnN9JykuIFVzZSBtdWx0aXBsZSBzdGF0ZW1lbnRzIGluc3RlYWQuYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkQ29uZGl0aW9ucyhjb25kaXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHRoZSBwb2xpY3kgc3RhdGVtZW50IHNhdGlzZmllcyBiYXNlIHJlcXVpcmVtZW50cyBmb3IgYSBwb2xpY3kuXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIG9yIGFuIGVtcHR5IGFycmF5IGlmIHRoZSBzdGF0ZW1lbnQgaXMgdmFsaWQuXG4gICAqL1xuICBwdWJsaWMgdmFsaWRhdGVGb3JBbnlQb2xpY3koKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgaWYgKHRoaXMuX2FjdGlvbi5sZW5ndGggPT09IDAgJiYgdGhpcy5fbm90QWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZXJyb3JzLnB1c2goJ0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHRoZSBwb2xpY3kgc3RhdGVtZW50IHNhdGlzZmllcyBhbGwgcmVxdWlyZW1lbnRzIGZvciBhIHJlc291cmNlLWJhc2VkIHBvbGljeS5cbiAgICpcbiAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcywgb3IgYW4gZW1wdHkgYXJyYXkgaWYgdGhlIHN0YXRlbWVudCBpcyB2YWxpZC5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBlcnJvcnMgPSB0aGlzLnZhbGlkYXRlRm9yQW55UG9saWN5KCk7XG4gICAgaWYgKHRoaXMuX3ByaW5jaXBhbHMubGVuZ3RoID09PSAwICYmIHRoaXMuX25vdFByaW5jaXBhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwuJyk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCB0aGUgcG9saWN5IHN0YXRlbWVudCBzYXRpc2ZpZXMgYWxsIHJlcXVpcmVtZW50cyBmb3IgYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5LlxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzLCBvciBhbiBlbXB0eSBhcnJheSBpZiB0aGUgc3RhdGVtZW50IGlzIHZhbGlkLlxuICAgKi9cbiAgcHVibGljIHZhbGlkYXRlRm9ySWRlbnRpdHlQb2xpY3koKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IHRoaXMudmFsaWRhdGVGb3JBbnlQb2xpY3koKTtcbiAgICBpZiAodGhpcy5fcHJpbmNpcGFscy5sZW5ndGggPiAwIHx8IHRoaXMuX25vdFByaW5jaXBhbHMubGVuZ3RoID4gMCkge1xuICAgICAgZXJyb3JzLnB1c2goJ0EgUG9saWN5U3RhdGVtZW50IHVzZWQgaW4gYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5IGNhbm5vdCBzcGVjaWZ5IGFueSBJQU0gcHJpbmNpcGFscy4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3Jlc291cmNlLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9ub3RSZXNvdXJjZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGVycm9ycy5wdXNoKCdBIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIHJlc291cmNlLicpO1xuICAgIH1cbiAgICByZXR1cm4gZXJyb3JzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBY3Rpb25zIGFkZGVkIHRvIHRoaXMgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgZ2V0IGFjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGlvbi5jb3B5KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIE5vdEFjdGlvbnMgYWRkZWQgdG8gdGhpcyBzdGF0ZW1lbnRcbiAgICovXG4gIHB1YmxpYyBnZXQgbm90QWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbm90QWN0aW9uLmNvcHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgUHJpbmNpcGFscyBhZGRlZCB0byB0aGlzIHN0YXRlbWVudFxuICAgKi9cbiAgcHVibGljIGdldCBwcmluY2lwYWxzKCk6IElQcmluY2lwYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW5jaXBhbHMuY29weSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBOb3RQcmluY2lwYWxzIGFkZGVkIHRvIHRoaXMgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgZ2V0IG5vdFByaW5jaXBhbHMoKTogSVByaW5jaXBhbFtdIHtcbiAgICByZXR1cm4gdGhpcy5fbm90UHJpbmNpcGFscy5jb3B5KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIFJlc291cmNlcyBhZGRlZCB0byB0aGlzIHN0YXRlbWVudFxuICAgKi9cbiAgcHVibGljIGdldCByZXNvdXJjZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlLmNvcHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgTm90UmVzb3VyY2VzIGFkZGVkIHRvIHRoaXMgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgZ2V0IG5vdFJlc291cmNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fbm90UmVzb3VyY2UuY29weSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjb25kaXRpb25zIGFkZGVkIHRvIHRoaXMgc3RhdGVtZW50XG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbmRpdGlvbnMoKTogYW55IHtcbiAgICByZXR1cm4geyAuLi50aGlzLl9jb25kaXRpb24gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHRoZSBQb2xpY3lTdGF0ZW1lbnQgaW1tdXRhYmxlXG4gICAqXG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcywgYW55IG9mIHRoZSBgYWRkWHh4KClgIG1ldGhvZHMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24uXG4gICAqXG4gICAqIExpYnJhcmllcyB0aGF0IGxhemlseSBnZW5lcmF0ZSBzdGF0ZW1lbnQgYm9kaWVzIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0b1xuICAgKiBmaWxsIHRoZSBhY3R1YWwgUG9saWN5U3RhdGVtZW50IGZpZWxkcy4gQmUgYXdhcmUgdGhhdCB0aGlzIG1ldGhvZCBtYXkgYmUgY2FsbGVkXG4gICAqIG11bHRpcGxlIHRpbWVzLlxuICAgKi9cbiAgcHVibGljIGZyZWV6ZSgpOiBQb2xpY3lTdGF0ZW1lbnQge1xuICAgIHRoaXMuX2Zyb3plbiA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgUG9saWN5U3RhdGVtZW50IGhhcyBiZWVuIGZyb3plblxuICAgKlxuICAgKiBUaGUgc3RhdGVtZW50IG9iamVjdCBpcyBmcm96ZW4gd2hlbiBgZnJlZXplKClgIGlzIGNhbGxlZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgZnJvemVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mcm96ZW47XG4gIH1cblxuICAvKipcbiAgICogRXN0aW1hdGUgdGhlIHNpemUgb2YgdGhpcyBwb2xpY3kgc3RhdGVtZW50XG4gICAqXG4gICAqIEJ5IG5lY2Vzc2l0eSwgdGhpcyB3aWxsIG5vdCBiZSBhY2N1cmF0ZS4gV2UnbGwgZG8gb3VyIGJlc3QgdG8gb3ZlcmVzdGltYXRlXG4gICAqIHNvIHdlIHdvbid0IGhhdmUgbmFzdHkgc3VycHJpc2VzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfZXN0aW1hdGVTaXplKG9wdGlvbnM6IEVzdGltYXRlU2l6ZU9wdGlvbnMpOiBudW1iZXIge1xuICAgIGxldCByZXQgPSAwO1xuXG4gICAgY29uc3QgeyBhY3Rpb25Fc3RpbWF0ZSwgYXJuRXN0aW1hdGUgfSA9IG9wdGlvbnM7XG5cbiAgICByZXQgKz0gYFwiRWZmZWN0XCI6IFwiJHt0aGlzLmVmZmVjdH1cIixgLmxlbmd0aDtcblxuICAgIGNvdW50KCdBY3Rpb24nLCB0aGlzLmFjdGlvbnMsIGFjdGlvbkVzdGltYXRlKTtcbiAgICBjb3VudCgnTm90QWN0aW9uJywgdGhpcy5ub3RBY3Rpb25zLCBhY3Rpb25Fc3RpbWF0ZSk7XG4gICAgY291bnQoJ1Jlc291cmNlJywgdGhpcy5yZXNvdXJjZXMsIGFybkVzdGltYXRlKTtcbiAgICBjb3VudCgnTm90UmVzb3VyY2UnLCB0aGlzLm5vdFJlc291cmNlcywgYXJuRXN0aW1hdGUpO1xuXG4gICAgcmV0ICs9IHRoaXMucHJpbmNpcGFscy5sZW5ndGggKiBhcm5Fc3RpbWF0ZTtcbiAgICByZXQgKz0gdGhpcy5ub3RQcmluY2lwYWxzLmxlbmd0aCAqIGFybkVzdGltYXRlO1xuXG4gICAgcmV0ICs9IEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZGl0aW9ucykubGVuZ3RoO1xuICAgIHJldHVybiByZXQ7XG5cbiAgICBmdW5jdGlvbiBjb3VudChrZXk6IHN0cmluZywgdmFsdWVzOiBzdHJpbmdbXSwgdG9rZW5TaXplOiBudW1iZXIpIHtcbiAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXQgKz0ga2V5Lmxlbmd0aCArIDUgLyogcXVvdGVzLCBjb2xvbiwgYnJhY2tldHMgKi8gK1xuICAgICAgICAgIHN1bSh2YWx1ZXMubWFwKHYgPT4gKGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQodikgPyB0b2tlblNpemUgOiB2Lmxlbmd0aCkgKyAzIC8qIHF1b3Rlcywgc2VwYXJhdG9yICovKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93IGFuIGV4Y2VwdGlvbiB3aGVuIHRoZSBvYmplY3QgaXMgZnJvemVuXG4gICAqL1xuICBwcml2YXRlIGFzc2VydE5vdEZyb3plbihtZXRob2Q6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9mcm96ZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHttZXRob2R9OiBmcmVlemUoKSBoYXMgYmVlbiBjYWxsZWQgb24gdGhpcyBQb2xpY3lTdGF0ZW1lbnQgcHJldmlvdXNseSwgc28gaXQgY2FuIG5vIGxvbmdlciBiZSBtb2RpZmllZGApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoZSBFZmZlY3QgZWxlbWVudCBvZiBhbiBJQU0gcG9saWN5XG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2VmZmVjdC5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIEVmZmVjdCB7XG4gIC8qKlxuICAgKiBBbGxvd3MgYWNjZXNzIHRvIGEgcmVzb3VyY2UgaW4gYW4gSUFNIHBvbGljeSBzdGF0ZW1lbnQuIEJ5IGRlZmF1bHQsIGFjY2VzcyB0byByZXNvdXJjZXMgYXJlIGRlbmllZC5cbiAgICovXG4gIEFMTE9XID0gJ0FsbG93JyxcblxuICAvKipcbiAgICogRXhwbGljaXRseSBkZW55IGFjY2VzcyB0byBhIHJlc291cmNlLiBCeSBkZWZhdWx0LCBhbGwgcmVxdWVzdHMgYXJlIGRlbmllZCBpbXBsaWNpdGx5LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZXZhbHVhdGlvbi1sb2dpYy5odG1sXG4gICAqL1xuICBERU5ZID0gJ0RlbnknLFxufVxuXG4vKipcbiAqIENvbmRpdGlvbiBmb3Igd2hlbiBhbiBJQU0gcG9saWN5IGlzIGluIGVmZmVjdC4gTWFwcyBmcm9tIHRoZSBrZXlzIGluIGEgcmVxdWVzdCdzIGNvbnRleHQgdG9cbiAqIGEgc3RyaW5nIHZhbHVlIG9yIGFycmF5IG9mIHN0cmluZyB2YWx1ZXMuIFNlZSB0aGUgQ29uZGl0aW9ucyBpbnRlcmZhY2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuZXhwb3J0IHR5cGUgQ29uZGl0aW9uID0gdW5rbm93bjtcblxuLy8gTk9URSEgV2Ugd291bGQgaGF2ZSBsaWtlZCB0byBoYXZlIHR5cGVkIHRoaXMgYXMgYFJlY29yZDxzdHJpbmcsIHVua25vd24+YCwgYnV0IGluIHNvbWUgcGxhY2VzXG4vLyBvZiB0aGUgY29kZSB3ZSBhcmUgYXNzdW1pbmcgd2UgY2FuIHBhc3MgYSBgQ2ZuSnNvbmAgb2JqZWN0IGludG8gd2hlcmUgYSBgQ29uZGl0aW9uYCBpcyBleHBlY3RlZCxcbi8vIGFuZCB0aGF0IHdvdWxkbid0IHR5cGVjaGVjayBhbnltb3JlLlxuLy9cbi8vIE5lZWRzIHRvIGJlIGB1bmtub3duYCBpbnN0ZWFkIG9mIGBhbnlgIHNvIHRoYXQgdGhlIHR5cGUgb2YgYENvbmRpdGlvbnNgIGlzXG4vLyBgUmVjb3JkPHN0cmluZywgdW5rbm93bj5gOyBpZiBpdCBoYWQgYmVlbiBgUmVjb3JkPHN0cmluZywgYW55PmAsIFR5cGVTY3JpcHQgd291bGQgaGF2ZSBhbGxvd2VkXG4vLyBwYXNzaW5nIGFuIGFycmF5IGludG8gYGNvbmRpdGlvbnNgIGFyZ3VtZW50cyAod2hlcmUgaXQgbmVlZHMgdG8gYmUgYSBtYXApLlxuXG4vKipcbiAqIENvbmRpdGlvbnMgZm9yIHdoZW4gYW4gSUFNIFBvbGljeSBpcyBpbiBlZmZlY3QsIHNwZWNpZmllZCBpbiB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqXG4gKiBgeyBcIk9wZXJhdG9yXCI6IHsgXCJrZXlJblJlcXVlc3RDb250ZXh0XCI6IFwidmFsdWVcIiB9IH1gXG4gKlxuICogVGhlIHZhbHVlIGNhbiBiZSBlaXRoZXIgYSBzaW5nbGUgc3RyaW5nIHZhbHVlIG9yIGFuIGFycmF5IG9mIHN0cmluZyB2YWx1ZXMuXG4gKlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIGluY2x1ZGluZyB3aGljaCBvcGVyYXRvcnMgYXJlIHN1cHBvcnRlZCwgc2VlIFt0aGUgSUFNXG4gKiBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sKS5cbiAqL1xuZXhwb3J0IHR5cGUgQ29uZGl0aW9ucyA9IFJlY29yZDxzdHJpbmcsIENvbmRpdGlvbj47XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjcmVhdGluZyBhIHBvbGljeSBzdGF0ZW1lbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb2xpY3lTdGF0ZW1lbnRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgU2lkIChzdGF0ZW1lbnQgSUQpIGlzIGFuIG9wdGlvbmFsIGlkZW50aWZpZXIgdGhhdCB5b3UgcHJvdmlkZSBmb3IgdGhlXG4gICAqIHBvbGljeSBzdGF0ZW1lbnQuIFlvdSBjYW4gYXNzaWduIGEgU2lkIHZhbHVlIHRvIGVhY2ggc3RhdGVtZW50IGluIGFcbiAgICogc3RhdGVtZW50IGFycmF5LiBJbiBzZXJ2aWNlcyB0aGF0IGxldCB5b3Ugc3BlY2lmeSBhbiBJRCBlbGVtZW50LCBzdWNoIGFzXG4gICAqIFNRUyBhbmQgU05TLCB0aGUgU2lkIHZhbHVlIGlzIGp1c3QgYSBzdWItSUQgb2YgdGhlIHBvbGljeSBkb2N1bWVudCdzIElELiBJblxuICAgKiBJQU0sIHRoZSBTaWQgdmFsdWUgbXVzdCBiZSB1bmlxdWUgd2l0aGluIGEgSlNPTiBwb2xpY3kuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2lkXG4gICAqL1xuICByZWFkb25seSBzaWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgYWN0aW9ucyB0byBhZGQgdG8gdGhlIHN0YXRlbWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFjdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBub3QgYWN0aW9ucyB0byBhZGQgdG8gdGhlIHN0YXRlbWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG5vdC1hY3Rpb25zXG4gICAqL1xuICByZWFkb25seSBub3RBY3Rpb25zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgcHJpbmNpcGFscyB0byBhZGQgdG8gdGhlIHN0YXRlbWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHByaW5jaXBhbHNcbiAgICovXG4gIHJlYWRvbmx5IHByaW5jaXBhbHM/OiBJUHJpbmNpcGFsW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2Ygbm90IHByaW5jaXBhbHMgdG8gYWRkIHRvIHRoZSBzdGF0ZW1lbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBub3QgcHJpbmNpcGFsc1xuICAgKi9cbiAgcmVhZG9ubHkgbm90UHJpbmNpcGFscz86IElQcmluY2lwYWxbXTtcblxuICAvKipcbiAgICogUmVzb3VyY2UgQVJOcyB0byBhZGQgdG8gdGhlIHN0YXRlbWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHJlc291cmNlc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIE5vdFJlc291cmNlIEFSTnMgdG8gYWRkIHRvIHRoZSBzdGF0ZW1lbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBub3QtcmVzb3VyY2VzXG4gICAqL1xuICByZWFkb25seSBub3RSZXNvdXJjZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQ29uZGl0aW9ucyB0byBhZGQgdG8gdGhlIHN0YXRlbWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbmRpdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9ucz86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFsbG93IG9yIGRlbnkgdGhlIGFjdGlvbnMgaW4gdGhpcyBzdGF0ZW1lbnRcbiAgICpcbiAgICogQGRlZmF1bHQgRWZmZWN0LkFMTE9XXG4gICAqL1xuICByZWFkb25seSBlZmZlY3Q/OiBFZmZlY3Q7XG59XG5cbmNsYXNzIEpzb25QcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudDtcblxuICBjb25zdHJ1Y3Rvcihqc29uOiBhbnkgPSB7IH0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gc3BlY2lhbCBjYXNlOiBpZiBwcmluY2lwYWwgaXMgYSBzdHJpbmcsIHR1cm4gaXQgaW50byBhIFwiTGl0ZXJhbFN0cmluZ1wiIHByaW5jaXBhbCxcbiAgICAvLyBzbyB3ZSByZW5kZXIgdGhlIGV4YWN0IHNhbWUgc3RyaW5nIGJhY2sgb3V0LlxuICAgIGlmICh0eXBlb2YoanNvbikgPT09ICdzdHJpbmcnKSB7XG4gICAgICBqc29uID0geyBbTElURVJBTF9TVFJJTkdfS0VZXTogW2pzb25dIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YoanNvbikgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEpTT04gSUFNIHByaW5jaXBhbCBzaG91bGQgYmUgYW4gb2JqZWN0LCBnb3QgJHtKU09OLnN0cmluZ2lmeShqc29uKX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnBvbGljeUZyYWdtZW50ID0ge1xuICAgICAgcHJpbmNpcGFsSnNvbjoganNvbixcbiAgICAgIGNvbmRpdGlvbnM6IHt9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMucG9saWN5RnJhZ21lbnQpO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgX2VzdGltYXRlU2l6ZVxuICpcbiAqIFRoZXNlIGNhbiBvcHRpb25hbGx5IGNvbWUgZnJvbSBjb250ZXh0LCBidXQgaXQncyB0b28gZXhwZW5zaXZlIHRvIGxvb2tcbiAqIHRoZW0gdXAgZXZlcnkgdGltZSBzbyB3ZSBidW5kbGUgdGhlbSBpbnRvIGEgc3RydWN0IGZpcnN0LlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVzdGltYXRlU2l6ZU9wdGlvbnMge1xuICAvKipcbiAgICogRXN0aW1hdGVkIHNpemUgb2YgYW4gdW5yZXNvbHZlZCBBUk5cbiAgICovXG4gIHJlYWRvbmx5IGFybkVzdGltYXRlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEVzdGltYXRlZCBzaXplIG9mIGFuIHVucmVzb2x2ZWQgYWN0aW9uXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25Fc3RpbWF0ZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIERlcml2ZSB0aGUgc2l6ZSBlc3RpbWF0aW9uIG9wdGlvbnMgZnJvbSBjb250ZXh0XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVFc3RpbWF0ZVNpemVPcHRpb25zKHNjb3BlOiBJQ29uc3RydWN0KTogRXN0aW1hdGVTaXplT3B0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbkVzdGltYXRlID0gMjA7XG4gIGNvbnN0IGFybkVzdGltYXRlID0gc2NvcGUubm9kZS50cnlHZXRDb250ZXh0KEFSTl9TSVpFX0VTVElNQVRFX0NPTlRFWFRfS0VZKSA/PyBERUZBVUxUX0FSTl9TSVpFX0VTVElNQVRFO1xuICBpZiAodHlwZW9mIGFybkVzdGltYXRlICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ29udGV4dCB2YWx1ZSAke0FSTl9TSVpFX0VTVElNQVRFX0NPTlRFWFRfS0VZfSBzaG91bGQgYmUgYSBudW1iZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KGFybkVzdGltYXRlKX1gKTtcbiAgfVxuXG4gIHJldHVybiB7IGFjdGlvbkVzdGltYXRlLCBhcm5Fc3RpbWF0ZSB9O1xufVxuXG4vKipcbiAqIEEgY2xhc3MgdGhhdCBiZWhhdmVzIGJvdGggYXMgYSBzZXQgYW5kIGFuIGFycmF5XG4gKlxuICogVXNlZCBmb3IgdGhlIGVsZW1lbnRzIG9mIGEgUG9saWN5U3RhdGVtZW50LiBJbiBwcmFjdGljZSB0aGV5IGJlaGF2ZSBhcyBzZXRzLFxuICogYnV0IHdlIGhhdmUgdGhvdXNhbmRzIG9mIHNuYXBzaG90IHRlc3RzIGluIGV4aXN0ZW5jZSB0aGF0IHdpbGwgcmVseSBvbiBhXG4gKiBwYXJ0aWN1bGFyIG9yZGVyIHNvIHdlIGNhbid0IGp1c3QgY2hhbmdlIHRoZSB0eXBlIHRvIGBTZXQ8PmAgd2hvbGVzYWxlIHdpdGhvdXRcbiAqIGNhdXNpbmcgYSBsb3Qgb2YgY2h1cm4uXG4gKi9cbmNsYXNzIE9yZGVyZWRTZXQ8QT4ge1xuICBwcml2YXRlIHJlYWRvbmx5IHNldCA9IG5ldyBTZXQ8QT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhcnJheSA9IG5ldyBBcnJheTxBPigpO1xuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnRzIHRvIHRoZSBzZXRcbiAgICpcbiAgICogQHBhcmFtIHhzIHRoZSBlbGVtZW50cyB0byBiZSBhZGRlZFxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgZWxlbWVudHMgYWN0dWFsbHkgYWRkZWRcbiAgICovXG4gIHB1YmxpYyBwdXNoKC4uLnhzOiByZWFkb25seSBBW10pOiBBW10ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheTxBPigpO1xuICAgIGZvciAoY29uc3QgeCBvZiB4cykge1xuICAgICAgaWYgKHRoaXMuc2V0Lmhhcyh4KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0LmFkZCh4KTtcbiAgICAgIHRoaXMuYXJyYXkucHVzaCh4KTtcbiAgICAgIHJldC5wdXNoKHgpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGNvcHkoKTogQVtdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuYXJyYXldO1xuICB9XG5cbiAgLyoqXG4gICAqIERpcmVjdCAocmVhZC1vbmx5KSBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgYXJyYXlcbiAgICpcbiAgICogKFNhdmVzIGEgY29weSlcbiAgICovXG4gIHB1YmxpYyBkaXJlY3QoKTogcmVhZG9ubHkgQVtdIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheTtcbiAgfVxufVxuIl19