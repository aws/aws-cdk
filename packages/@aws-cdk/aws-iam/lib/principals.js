"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConditionObject = exports.CompositePrincipal = exports.StarPrincipal = exports.Anyone = exports.AnyPrincipal = exports.AccountRootPrincipal = exports.SamlConsolePrincipal = exports.SamlPrincipal = exports.OpenIdConnectPrincipal = exports.WebIdentityPrincipal = exports.FederatedPrincipal = exports.CanonicalUserPrincipal = exports.OrganizationPrincipal = exports.ServicePrincipal = exports.AccountPrincipal = exports.ArnPrincipal = exports.PrincipalPolicyFragment = exports.SessionTagsPrincipal = exports.PrincipalWithConditions = exports.PrincipalBase = exports.ComparablePrincipal = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const region_info_1 = require("@aws-cdk/region-info");
const policy_statement_1 = require("./policy-statement");
const assume_role_policy_1 = require("./private/assume-role-policy");
const util_1 = require("./private/util");
/**
 * Helper class for working with `IComparablePrincipal`s
 */
class ComparablePrincipal {
    /**
     * Whether or not the given principal is a comparable principal
     */
    static isComparablePrincipal(x) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(x);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.isComparablePrincipal);
            }
            throw error;
        }
        return 'dedupeString' in x;
    }
    /**
     * Return the dedupeString of the given principal, if available
     */
    static dedupeStringFor(x) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(x);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.dedupeStringFor);
            }
            throw error;
        }
        return ComparablePrincipal.isComparablePrincipal(x) ? x.dedupeString() : undefined;
    }
}
exports.ComparablePrincipal = ComparablePrincipal;
_a = JSII_RTTI_SYMBOL_1;
ComparablePrincipal[_a] = { fqn: "@aws-cdk/aws-iam.ComparablePrincipal", version: "0.0.0" };
/**
 * Base class for policy principals
 */
class PrincipalBase {
    constructor() {
        this.grantPrincipal = this;
        this.principalAccount = undefined;
        /**
         * When this Principal is used in an AssumeRole policy, the action to use.
         */
        this.assumeRoleAction = 'sts:AssumeRole';
    }
    addToPolicy(statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPolicy);
            }
            throw error;
        }
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
    addToPrincipalPolicy(_statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(_statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipalPolicy);
            }
            throw error;
        }
        // This base class is used for non-identity principals. None of them
        // have a PolicyDocument to add to.
        return { statementAdded: false };
    }
    addToAssumeRolePolicy(document) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyDocument(document);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToAssumeRolePolicy);
            }
            throw error;
        }
        // Default implementation of this protocol, compatible with the legacy behavior
        document.addStatements(new policy_statement_1.PolicyStatement({
            actions: [this.assumeRoleAction],
            principals: [this],
        }));
    }
    toString() {
        // This is a first pass to make the object readable. Descendant principals
        // should return something nicer.
        return JSON.stringify(this.policyFragment.principalJson);
    }
    /**
     * JSON-ify the principal
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
        // Have to implement toJSON() because the default will lead to infinite recursion.
        return this.policyFragment.principalJson;
    }
    /**
     * Returns a new PrincipalWithConditions using this principal as the base, with the
     * passed conditions added.
     *
     * When there is a value for the same operator and key in both the principal and the
     * conditions parameter, the value from the conditions parameter will be used.
     *
     * @returns a new PrincipalWithConditions object.
     */
    withConditions(conditions) {
        return new PrincipalWithConditions(this, conditions);
    }
    /**
     * Returns a new principal using this principal as the base, with session tags enabled.
     *
     * @returns a new SessionTagsPrincipal object.
     */
    withSessionTags() {
        return new SessionTagsPrincipal(this);
    }
}
exports.PrincipalBase = PrincipalBase;
_b = JSII_RTTI_SYMBOL_1;
PrincipalBase[_b] = { fqn: "@aws-cdk/aws-iam.PrincipalBase", version: "0.0.0" };
/**
 * Base class for Principals that wrap other principals
 */
class PrincipalAdapter extends PrincipalBase {
    constructor(wrapped) {
        super();
        this.wrapped = wrapped;
        this.assumeRoleAction = this.wrapped.assumeRoleAction;
        this.principalAccount = this.wrapped.principalAccount;
    }
    get policyFragment() { return this.wrapped.policyFragment; }
    addToPolicy(statement) {
        return this.wrapped.addToPolicy(statement);
    }
    addToPrincipalPolicy(statement) {
        return this.wrapped.addToPrincipalPolicy(statement);
    }
    /**
     * Append the given string to the wrapped principal's dedupe string (if available)
     */
    appendDedupe(append) {
        const inner = ComparablePrincipal.dedupeStringFor(this.wrapped);
        return inner !== undefined ? `${this.constructor.name}:${inner}:${append}` : undefined;
    }
}
/**
 * An IAM principal with additional conditions specifying when the policy is in effect.
 *
 * For more information about conditions, see:
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html
 */
class PrincipalWithConditions extends PrincipalAdapter {
    constructor(principal, conditions) {
        super(principal);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(principal);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrincipalWithConditions);
            }
            throw error;
        }
        this.additionalConditions = conditions;
    }
    /**
     * Add a condition to the principal
     */
    addCondition(key, value) {
        validateConditionObject(value);
        const existingValue = this.additionalConditions[key];
        if (!existingValue) {
            this.additionalConditions[key] = value;
            return;
        }
        validateConditionObject(existingValue);
        this.additionalConditions[key] = { ...existingValue, ...value };
    }
    /**
     * Adds multiple conditions to the principal
     *
     * Values from the conditions parameter will overwrite existing values with the same operator
     * and key.
     */
    addConditions(conditions) {
        Object.entries(conditions).forEach(([key, value]) => {
            this.addCondition(key, value);
        });
    }
    /**
     * The conditions under which the policy is in effect.
     * See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    get conditions() {
        return this.mergeConditions(this.wrapped.policyFragment.conditions, this.additionalConditions);
    }
    get policyFragment() {
        return new PrincipalPolicyFragment(this.wrapped.policyFragment.principalJson, this.conditions);
    }
    toString() {
        return this.wrapped.toString();
    }
    /**
     * JSON-ify the principal
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
        // Have to implement toJSON() because the default will lead to infinite recursion.
        return this.policyFragment.principalJson;
    }
    dedupeString() {
        return this.appendDedupe(JSON.stringify(this.conditions));
    }
    mergeConditions(principalConditions, additionalConditions) {
        const mergedConditions = {};
        Object.entries(principalConditions).forEach(([operator, condition]) => {
            mergedConditions[operator] = condition;
        });
        Object.entries(additionalConditions).forEach(([operator, condition]) => {
            // merge the conditions if one of the additional conditions uses an
            // operator that's already used by the principal's conditions merge the
            // inner structure.
            const existing = mergedConditions[operator];
            if (!existing) {
                mergedConditions[operator] = condition;
                return; // continue
            }
            // if either the existing condition or the new one contain unresolved
            // tokens, fail the merge. this is as far as we go at this point.
            if (cdk.Token.isUnresolved(condition) || cdk.Token.isUnresolved(existing)) {
                throw new Error(`multiple "${operator}" conditions cannot be merged if one of them contains an unresolved token`);
            }
            validateConditionObject(existing);
            validateConditionObject(condition);
            mergedConditions[operator] = { ...existing, ...condition };
        });
        return mergedConditions;
    }
}
exports.PrincipalWithConditions = PrincipalWithConditions;
_c = JSII_RTTI_SYMBOL_1;
PrincipalWithConditions[_c] = { fqn: "@aws-cdk/aws-iam.PrincipalWithConditions", version: "0.0.0" };
/**
 * Enables session tags on role assumptions from a principal
 *
 * For more information on session tags, see:
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html
 */
class SessionTagsPrincipal extends PrincipalAdapter {
    constructor(principal) {
        super(principal);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(principal);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SessionTagsPrincipal);
            }
            throw error;
        }
    }
    addToAssumeRolePolicy(doc) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyDocument(doc);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToAssumeRolePolicy);
            }
            throw error;
        }
        // Lazy import to avoid circular import dependencies during startup
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const adapter = require('./private/policydoc-adapter');
        assume_role_policy_1.defaultAddPrincipalToAssumeRole(this.wrapped, new adapter.MutatingPolicyDocumentAdapter(doc, (statement) => {
            statement.addActions('sts:TagSession');
            return statement;
        }));
    }
    dedupeString() {
        return this.appendDedupe('');
    }
}
exports.SessionTagsPrincipal = SessionTagsPrincipal;
_d = JSII_RTTI_SYMBOL_1;
SessionTagsPrincipal[_d] = { fqn: "@aws-cdk/aws-iam.SessionTagsPrincipal", version: "0.0.0" };
/**
 * A collection of the fields in a PolicyStatement that can be used to identify a principal.
 *
 * This consists of the JSON used in the "Principal" field, and optionally a
 * set of "Condition"s that need to be applied to the policy.
 *
 * Generally, a principal looks like:
 *
 *     { '<TYPE>': ['ID', 'ID', ...] }
 *
 * And this is also the type of the field `principalJson`.  However, there is a
 * special type of principal that is just the string '*', which is treated
 * differently by some services. To represent that principal, `principalJson`
 * should contain `{ 'LiteralString': ['*'] }`.
 */
class PrincipalPolicyFragment {
    /**
     *
     * @param principalJson JSON of the "Principal" section in a policy statement
     * @param conditions conditions that need to be applied to this policy
     */
    constructor(principalJson, 
    /**
     * The conditions under which the policy is in effect.
     * See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    conditions = {}) {
        this.principalJson = principalJson;
        this.conditions = conditions;
    }
}
exports.PrincipalPolicyFragment = PrincipalPolicyFragment;
_e = JSII_RTTI_SYMBOL_1;
PrincipalPolicyFragment[_e] = { fqn: "@aws-cdk/aws-iam.PrincipalPolicyFragment", version: "0.0.0" };
/**
 * Specify a principal by the Amazon Resource Name (ARN).
 * You can specify AWS accounts, IAM users, Federated SAML users, IAM roles, and specific assumed-role sessions.
 * You cannot specify IAM groups or instance profiles as principals
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
 */
class ArnPrincipal extends PrincipalBase {
    /**
     *
     * @param arn Amazon Resource Name (ARN) of the principal entity (i.e. arn:aws:iam::123456789012:user/user-name)
     */
    constructor(arn) {
        super();
        this.arn = arn;
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ AWS: [this.arn] });
    }
    toString() {
        return `ArnPrincipal(${this.arn})`;
    }
    /**
     * A convenience method for adding a condition that the principal is part of the specified
     * AWS Organization.
     */
    inOrganization(organizationId) {
        return this.withConditions({
            StringEquals: {
                'aws:PrincipalOrgID': organizationId,
            },
        });
    }
    dedupeString() {
        return `ArnPrincipal:${this.arn}`;
    }
}
exports.ArnPrincipal = ArnPrincipal;
_f = JSII_RTTI_SYMBOL_1;
ArnPrincipal[_f] = { fqn: "@aws-cdk/aws-iam.ArnPrincipal", version: "0.0.0" };
/**
 * Specify AWS account ID as the principal entity in a policy to delegate authority to the account.
 */
class AccountPrincipal extends ArnPrincipal {
    /**
     *
     * @param accountId AWS account ID (i.e. '123456789012')
     */
    constructor(accountId) {
        super(new StackDependentToken(stack => `arn:${stack.partition}:iam::${accountId}:root`).toString());
        this.accountId = accountId;
        if (!cdk.Token.isUnresolved(accountId) && typeof accountId !== 'string') {
            throw new Error('accountId should be of type string');
        }
        this.principalAccount = accountId;
    }
    toString() {
        return `AccountPrincipal(${this.accountId})`;
    }
}
exports.AccountPrincipal = AccountPrincipal;
_g = JSII_RTTI_SYMBOL_1;
AccountPrincipal[_g] = { fqn: "@aws-cdk/aws-iam.AccountPrincipal", version: "0.0.0" };
/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
class ServicePrincipal extends PrincipalBase {
    /**
     * Reference an AWS service, optionally in a given region
     *
     * @param service AWS service (i.e. sqs.amazonaws.com)
     */
    constructor(service, opts = {}) {
        super();
        this.service = service;
        this.opts = opts;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_ServicePrincipalOpts(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServicePrincipal);
            }
            throw error;
        }
    }
    /**
     * Translate the given service principal name based on the region it's used in.
     *
     * For example, for Chinese regions this may (depending on whether that's necessary
     * for the given service principal) append `.cn` to the name.
     *
     * The `region-info` module is used to obtain this information.
     *
     * @example
     * const principalName = iam.ServicePrincipal.servicePrincipalName('ec2.amazonaws.com');
     */
    static servicePrincipalName(service) {
        return new ServicePrincipalToken(service, {}).toString();
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({
            Service: [new ServicePrincipalToken(this.service, this.opts).toString()],
        }, this.opts.conditions);
    }
    toString() {
        return `ServicePrincipal(${this.service})`;
    }
    dedupeString() {
        return `ServicePrincipal:${this.service}:${JSON.stringify(this.opts)}`;
    }
}
exports.ServicePrincipal = ServicePrincipal;
_h = JSII_RTTI_SYMBOL_1;
ServicePrincipal[_h] = { fqn: "@aws-cdk/aws-iam.ServicePrincipal", version: "0.0.0" };
/**
 * A principal that represents an AWS Organization
 */
class OrganizationPrincipal extends PrincipalBase {
    /**
     *
     * @param organizationId The unique identifier (ID) of an organization (i.e. o-12345abcde)
     */
    constructor(organizationId) {
        super();
        this.organizationId = organizationId;
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ AWS: ['*'] }, { StringEquals: { 'aws:PrincipalOrgID': this.organizationId } });
    }
    toString() {
        return `OrganizationPrincipal(${this.organizationId})`;
    }
    dedupeString() {
        return `OrganizationPrincipal:${this.organizationId}`;
    }
}
exports.OrganizationPrincipal = OrganizationPrincipal;
_j = JSII_RTTI_SYMBOL_1;
OrganizationPrincipal[_j] = { fqn: "@aws-cdk/aws-iam.OrganizationPrincipal", version: "0.0.0" };
/**
 * A policy principal for canonicalUserIds - useful for S3 bucket policies that use
 * Origin Access identities.
 *
 * See https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html
 *
 * and
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 *
 * for more details.
 *
 */
class CanonicalUserPrincipal extends PrincipalBase {
    /**
     *
     * @param canonicalUserId unique identifier assigned by AWS for every account.
     *   root user and IAM users for an account all see the same ID.
     *   (i.e. 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be)
     */
    constructor(canonicalUserId) {
        super();
        this.canonicalUserId = canonicalUserId;
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ CanonicalUser: [this.canonicalUserId] });
    }
    toString() {
        return `CanonicalUserPrincipal(${this.canonicalUserId})`;
    }
    dedupeString() {
        return `CanonicalUserPrincipal:${this.canonicalUserId}`;
    }
}
exports.CanonicalUserPrincipal = CanonicalUserPrincipal;
_k = JSII_RTTI_SYMBOL_1;
CanonicalUserPrincipal[_k] = { fqn: "@aws-cdk/aws-iam.CanonicalUserPrincipal", version: "0.0.0" };
/**
 * Principal entity that represents a federated identity provider such as Amazon Cognito,
 * that can be used to provide temporary security credentials to users who have been authenticated.
 * Additional condition keys are available when the temporary security credentials are used to make a request.
 * You can use these keys to write policies that limit the access of federated users.
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html#condition-keys-wif
 */
class FederatedPrincipal extends PrincipalBase {
    /**
     *
     * @param federated federated identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito)
     * @param sessionTags Whether to enable session tagging (see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html)
     */
    constructor(federated, conditions = {}, assumeRoleAction = 'sts:AssumeRole') {
        super();
        this.federated = federated;
        this.conditions = conditions;
        this.assumeRoleAction = assumeRoleAction;
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
    }
    toString() {
        return `FederatedPrincipal(${this.federated})`;
    }
    dedupeString() {
        return `FederatedPrincipal:${this.federated}:${this.assumeRoleAction}:${JSON.stringify(this.conditions)}`;
    }
}
exports.FederatedPrincipal = FederatedPrincipal;
_l = JSII_RTTI_SYMBOL_1;
FederatedPrincipal[_l] = { fqn: "@aws-cdk/aws-iam.FederatedPrincipal", version: "0.0.0" };
/**
 * A principal that represents a federated identity provider as Web Identity such as Cognito, Amazon,
 * Facebook, Google, etc.
 */
class WebIdentityPrincipal extends FederatedPrincipal {
    /**
     *
     * @param identityProvider identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito)
     * @param conditions The conditions under which the policy is in effect.
     *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     * @param sessionTags Whether to enable session tagging (see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html)
     */
    constructor(identityProvider, conditions = {}) {
        super(identityProvider, conditions ?? {}, 'sts:AssumeRoleWithWebIdentity');
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
    }
    toString() {
        return `WebIdentityPrincipal(${this.federated})`;
    }
}
exports.WebIdentityPrincipal = WebIdentityPrincipal;
_m = JSII_RTTI_SYMBOL_1;
WebIdentityPrincipal[_m] = { fqn: "@aws-cdk/aws-iam.WebIdentityPrincipal", version: "0.0.0" };
/**
 * A principal that represents a federated identity provider as from a OpenID Connect provider.
 */
class OpenIdConnectPrincipal extends WebIdentityPrincipal {
    /**
     *
     * @param openIdConnectProvider OpenID Connect provider
     * @param conditions The conditions under which the policy is in effect.
     *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    constructor(openIdConnectProvider, conditions = {}) {
        super(openIdConnectProvider.openIdConnectProviderArn, conditions ?? {});
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IOpenIdConnectProvider(openIdConnectProvider);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, OpenIdConnectPrincipal);
            }
            throw error;
        }
    }
    get policyFragment() {
        return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
    }
    toString() {
        return `OpenIdConnectPrincipal(${this.federated})`;
    }
}
exports.OpenIdConnectPrincipal = OpenIdConnectPrincipal;
_o = JSII_RTTI_SYMBOL_1;
OpenIdConnectPrincipal[_o] = { fqn: "@aws-cdk/aws-iam.OpenIdConnectPrincipal", version: "0.0.0" };
/**
 * Principal entity that represents a SAML federated identity provider
 */
class SamlPrincipal extends FederatedPrincipal {
    constructor(samlProvider, conditions) {
        super(samlProvider.samlProviderArn, conditions, 'sts:AssumeRoleWithSAML');
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_ISamlProvider(samlProvider);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SamlPrincipal);
            }
            throw error;
        }
    }
    toString() {
        return `SamlPrincipal(${this.federated})`;
    }
}
exports.SamlPrincipal = SamlPrincipal;
_p = JSII_RTTI_SYMBOL_1;
SamlPrincipal[_p] = { fqn: "@aws-cdk/aws-iam.SamlPrincipal", version: "0.0.0" };
/**
 * Principal entity that represents a SAML federated identity provider for
 * programmatic and AWS Management Console access.
 */
class SamlConsolePrincipal extends SamlPrincipal {
    constructor(samlProvider, conditions = {}) {
        super(samlProvider, {
            ...conditions,
            StringEquals: {
                'SAML:aud': cdk.Aws.PARTITION === 'aws-cn' ? 'https://signin.amazonaws.cn/saml' : 'https://signin.aws.amazon.com/saml',
            },
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_ISamlProvider(samlProvider);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SamlConsolePrincipal);
            }
            throw error;
        }
    }
    toString() {
        return `SamlConsolePrincipal(${this.federated})`;
    }
}
exports.SamlConsolePrincipal = SamlConsolePrincipal;
_q = JSII_RTTI_SYMBOL_1;
SamlConsolePrincipal[_q] = { fqn: "@aws-cdk/aws-iam.SamlConsolePrincipal", version: "0.0.0" };
/**
 * Use the AWS account into which a stack is deployed as the principal entity in a policy
 */
class AccountRootPrincipal extends AccountPrincipal {
    constructor() {
        super(new StackDependentToken(stack => stack.account).toString());
    }
    toString() {
        return 'AccountRootPrincipal()';
    }
}
exports.AccountRootPrincipal = AccountRootPrincipal;
_r = JSII_RTTI_SYMBOL_1;
AccountRootPrincipal[_r] = { fqn: "@aws-cdk/aws-iam.AccountRootPrincipal", version: "0.0.0" };
/**
 * A principal representing all AWS identities in all accounts
 *
 * Some services behave differently when you specify `Principal: '*'`
 * or `Principal: { AWS: "*" }` in their resource policy.
 *
 * `AnyPrincipal` renders to `Principal: { AWS: "*" }`. This is correct
 * most of the time, but in cases where you need the other principal,
 * use `StarPrincipal` instead.
 */
class AnyPrincipal extends ArnPrincipal {
    constructor() {
        super('*');
    }
    toString() {
        return 'AnyPrincipal()';
    }
}
exports.AnyPrincipal = AnyPrincipal;
_s = JSII_RTTI_SYMBOL_1;
AnyPrincipal[_s] = { fqn: "@aws-cdk/aws-iam.AnyPrincipal", version: "0.0.0" };
/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
class Anyone extends AnyPrincipal {
}
exports.Anyone = Anyone;
_t = JSII_RTTI_SYMBOL_1;
Anyone[_t] = { fqn: "@aws-cdk/aws-iam.Anyone", version: "0.0.0" };
/**
 * A principal that uses a literal '*' in the IAM JSON language
 *
 * Some services behave differently when you specify `Principal: "*"`
 * or `Principal: { AWS: "*" }` in their resource policy.
 *
 * `StarPrincipal` renders to `Principal: *`. Most of the time, you
 * should use `AnyPrincipal` instead.
 */
class StarPrincipal extends PrincipalBase {
    constructor() {
        super(...arguments);
        this.policyFragment = {
            principalJson: { [util_1.LITERAL_STRING_KEY]: ['*'] },
            conditions: {},
        };
    }
    toString() {
        return 'StarPrincipal()';
    }
    dedupeString() {
        return 'StarPrincipal';
    }
}
exports.StarPrincipal = StarPrincipal;
_u = JSII_RTTI_SYMBOL_1;
StarPrincipal[_u] = { fqn: "@aws-cdk/aws-iam.StarPrincipal", version: "0.0.0" };
/**
 * Represents a principal that has multiple types of principals. A composite principal cannot
 * have conditions. i.e. multiple ServicePrincipals that form a composite principal
 */
class CompositePrincipal extends PrincipalBase {
    constructor(...principals) {
        super();
        this.principals = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(principals);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CompositePrincipal);
            }
            throw error;
        }
        if (principals.length === 0) {
            throw new Error('CompositePrincipals must be constructed with at least 1 Principal but none were passed.');
        }
        this.assumeRoleAction = principals[0].assumeRoleAction;
        this.addPrincipals(...principals);
    }
    /**
     * Adds IAM principals to the composite principal. Composite principals cannot have
     * conditions.
     *
     * @param principals IAM principals that will be added to the composite principal
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
        this.principals.push(...principals);
        return this;
    }
    addToAssumeRolePolicy(doc) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyDocument(doc);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToAssumeRolePolicy);
            }
            throw error;
        }
        for (const p of this.principals) {
            assume_role_policy_1.defaultAddPrincipalToAssumeRole(p, doc);
        }
    }
    get policyFragment() {
        // We only have a problem with conditions if we are trying to render composite
        // princpals into a single statement (which is when `policyFragment` would get called)
        for (const p of this.principals) {
            const fragment = p.policyFragment;
            if (fragment.conditions && Object.keys(fragment.conditions).length > 0) {
                throw new Error('Components of a CompositePrincipal must not have conditions. ' +
                    `Tried to add the following fragment: ${JSON.stringify(fragment)}`);
            }
        }
        const principalJson = {};
        for (const p of this.principals) {
            util_1.mergePrincipal(principalJson, p.policyFragment.principalJson);
        }
        return new PrincipalPolicyFragment(principalJson);
    }
    toString() {
        return `CompositePrincipal(${this.principals})`;
    }
    dedupeString() {
        const inner = this.principals.map(ComparablePrincipal.dedupeStringFor);
        if (inner.some(x => x === undefined)) {
            return undefined;
        }
        return `CompositePrincipal[${inner.join(',')}]`;
    }
}
exports.CompositePrincipal = CompositePrincipal;
_v = JSII_RTTI_SYMBOL_1;
CompositePrincipal[_v] = { fqn: "@aws-cdk/aws-iam.CompositePrincipal", version: "0.0.0" };
/**
 * A lazy token that requires an instance of Stack to evaluate
 */
class StackDependentToken {
    constructor(fn) {
        this.fn = fn;
        this.creationStack = cdk.captureStackTrace();
    }
    resolve(context) {
        return this.fn(cdk.Stack.of(context.scope));
    }
    toString() {
        return cdk.Token.asString(this);
    }
    /**
     * JSON-ify the token
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
        return '<unresolved-token>';
    }
}
class ServicePrincipalToken {
    constructor(service, opts) {
        this.service = service;
        this.opts = opts;
        this.creationStack = cdk.captureStackTrace();
    }
    resolve(ctx) {
        return cdk.FeatureFlags.of(ctx.scope).isEnabled(cxapi.IAM_STANDARDIZED_SERVICE_PRINCIPALS)
            ? this.newStandardizedBehavior(ctx)
            : this.legacyBehavior(ctx);
    }
    /**
     * Return the global (original) service principal, and a second one if region is given and points to an opt-in region
     */
    newStandardizedBehavior(ctx) {
        const stack = cdk.Stack.of(ctx.scope);
        if (this.opts.region &&
            !cdk.Token.isUnresolved(this.opts.region) &&
            stack.region !== this.opts.region &&
            region_info_1.RegionInfo.get(this.opts.region).isOptInRegion) {
            return this.service.replace(/\.amazonaws\.com$/, `.${this.opts.region}.amazonaws.com`);
        }
        return this.service;
    }
    /**
     * Do a single lookup
     */
    legacyBehavior(ctx) {
        if (this.opts.region) {
            // Special case, handle it separately to not break legacy behavior.
            return region_info_1.RegionInfo.get(this.opts.region).servicePrincipal(this.service) ??
                region_info_1.Default.servicePrincipal(this.service, this.opts.region, cdk.Aws.URL_SUFFIX);
        }
        const stack = cdk.Stack.of(ctx.scope);
        return stack.regionalFact(region_info_1.FactName.servicePrincipal(this.service), region_info_1.Default.servicePrincipal(this.service, stack.region, cdk.Aws.URL_SUFFIX));
    }
    toString() {
        return cdk.Token.asString(this, {
            displayHint: this.service,
        });
    }
    /**
     * JSON-ify the token
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
        return `<${this.service}>`;
    }
}
/**
 * Validate that the given value is a valid Condition object
 *
 * The type of `Condition` should have been different, but it's too late for that.
 *
 * Also, the IAM library relies on being able to pass in a `CfnJson` instance for
 * a `Condition`.
 */
function validateConditionObject(x) {
    if (!x || typeof x !== 'object' || Array.isArray(x)) {
        throw new Error('A Condition should be represented as a map of operator to value');
    }
}
exports.validateConditionObject = validateConditionObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbmNpcGFscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaW5jaXBhbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxzREFBcUU7QUFJckUseURBQTRFO0FBQzVFLHFFQUErRTtBQUMvRSx5Q0FBb0U7QUFnRnBFOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFDOUI7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBYTs7Ozs7Ozs7OztRQUMvQyxPQUFPLGNBQWMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBYTs7Ozs7Ozs7OztRQUN6QyxPQUFPLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUNwRjs7QUFiSCxrREFjQzs7O0FBdUNEOztHQUVHO0FBQ0gsTUFBc0IsYUFBYTtJQUFuQztRQUNrQixtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsU0FBUyxDQUFDO1FBT2pFOztXQUVHO1FBQ2EscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7S0E4RDdEO0lBNURRLFdBQVcsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDNUQ7SUFFTSxvQkFBb0IsQ0FBQyxVQUEyQjs7Ozs7Ozs7OztRQUNyRCxvRUFBb0U7UUFDcEUsbUNBQW1DO1FBQ25DLE9BQU8sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUM7S0FDbEM7SUFFTSxxQkFBcUIsQ0FBQyxRQUF3Qjs7Ozs7Ozs7OztRQUNuRCwrRUFBK0U7UUFDL0UsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGtDQUFl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LGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3BFLHFCQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FDdkIsc0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQ3ZDLHFCQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQ3pFLENBQUM7S0FDSDtJQUVNLFFBQVE7UUFDYixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUM5QixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDMUIsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUM7S0FDNUI7Q0FDRjtBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQix1QkFBdUIsQ0FBQyxDQUFVO0lBQ2hELElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO0tBQ3BGO0FBQ0gsQ0FBQztBQUpELDBEQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IERlZmF1bHQsIEZhY3ROYW1lLCBSZWdpb25JbmZvIH0gZnJvbSAnQGF3cy1jZGsvcmVnaW9uLWluZm8nO1xuaW1wb3J0IHsgSURlcGVuZGFibGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElPcGVuSWRDb25uZWN0UHJvdmlkZXIgfSBmcm9tICcuL29pZGMtcHJvdmlkZXInO1xuaW1wb3J0IHsgUG9saWN5RG9jdW1lbnQgfSBmcm9tICcuL3BvbGljeS1kb2N1bWVudCc7XG5pbXBvcnQgeyBDb25kaXRpb24sIENvbmRpdGlvbnMsIFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBkZWZhdWx0QWRkUHJpbmNpcGFsVG9Bc3N1bWVSb2xlIH0gZnJvbSAnLi9wcml2YXRlL2Fzc3VtZS1yb2xlLXBvbGljeSc7XG5pbXBvcnQgeyBMSVRFUkFMX1NUUklOR19LRVksIG1lcmdlUHJpbmNpcGFsIH0gZnJvbSAnLi9wcml2YXRlL3V0aWwnO1xuaW1wb3J0IHsgSVNhbWxQcm92aWRlciB9IGZyb20gJy4vc2FtbC1wcm92aWRlcic7XG5cbi8qKlxuICogQW55IG9iamVjdCB0aGF0IGhhcyBhbiBhc3NvY2lhdGVkIHByaW5jaXBhbCB0aGF0IGEgcGVybWlzc2lvbiBjYW4gYmUgZ3JhbnRlZCB0b1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElHcmFudGFibGUge1xuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0byBncmFudCBwZXJtaXNzaW9ucyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGxvZ2ljYWwgSUFNIHByaW5jaXBhbC5cbiAqXG4gKiBBbiBJUHJpbmNpcGFsIGRlc2NyaWJlcyBhIGxvZ2ljYWwgZW50aXR5IHRoYXQgY2FuIHBlcmZvcm0gQVdTIEFQSSBjYWxsc1xuICogYWdhaW5zdCBzZXRzIG9mIHJlc291cmNlcywgb3B0aW9uYWxseSB1bmRlciBjZXJ0YWluIGNvbmRpdGlvbnMuXG4gKlxuICogRXhhbXBsZXMgb2Ygc2ltcGxlIHByaW5jaXBhbHMgYXJlIElBTSBvYmplY3RzIHRoYXQgeW91IGNyZWF0ZSwgc3VjaFxuICogYXMgVXNlcnMgb3IgUm9sZXMuXG4gKlxuICogQW4gZXhhbXBsZSBvZiBhIG1vcmUgY29tcGxleCBwcmluY2lwYWxzIGlzIGEgYFNlcnZpY2VQcmluY2lwYWxgIChzdWNoIGFzXG4gKiBgbmV3IFNlcnZpY2VQcmluY2lwYWwoXCJzbnMuYW1hem9uYXdzLmNvbVwiKWAsIHdoaWNoIHJlcHJlc2VudHMgdGhlIFNpbXBsZVxuICogTm90aWZpY2F0aW9ucyBTZXJ2aWNlKS5cbiAqXG4gKiBBIHNpbmdsZSBsb2dpY2FsIFByaW5jaXBhbCBtYXkgYWxzbyBtYXAgdG8gYSBzZXQgb2YgcGh5c2ljYWwgcHJpbmNpcGFscy5cbiAqIEZvciBleGFtcGxlLCBgbmV3IE9yZ2FuaXphdGlvblByaW5jaXBhbCgnby0xMjM0JylgIHJlcHJlc2VudHMgYWxsXG4gKiBpZGVudGl0aWVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlIGdpdmVuIEFXUyBPcmdhbml6YXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVByaW5jaXBhbCBleHRlbmRzIElHcmFudGFibGUge1xuICAvKipcbiAgICogV2hlbiB0aGlzIFByaW5jaXBhbCBpcyB1c2VkIGluIGFuIEFzc3VtZVJvbGUgcG9saWN5LCB0aGUgYWN0aW9uIHRvIHVzZS5cbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBwb2xpY3kgZnJhZ21lbnQgdGhhdCBpZGVudGlmaWVzIHRoaXMgcHJpbmNpcGFsIGluIGEgUG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgSUQgb2YgdGhpcyBwcmluY2lwYWwuXG4gICAqIENhbiBiZSB1bmRlZmluZWQgd2hlbiB0aGUgYWNjb3VudCBpcyBub3Qga25vd25cbiAgICogKGZvciBleGFtcGxlLCBmb3Igc2VydmljZSBwcmluY2lwYWxzKS5cbiAgICogQ2FuIGJlIGEgVG9rZW4gLSBpbiB0aGF0IGNhc2UsXG4gICAqIGl0J3MgYXNzdW1lZCB0byBiZSBBV1M6OkFjY291bnRJZC5cbiAgICovXG4gIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZCB0byB0aGUgcG9saWN5IG9mIHRoaXMgcHJpbmNpcGFsLlxuICAgKlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzdGF0ZW1lbnQgd2FzIGFkZGVkLCBmYWxzZSBpZiB0aGUgcHJpbmNpcGFsIGluXG4gICAqIHF1ZXN0aW9uIGRvZXMgbm90IGhhdmUgYSBwb2xpY3kgZG9jdW1lbnQgdG8gYWRkIHRoZSBzdGF0ZW1lbnQgdG8uXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYWRkVG9QcmluY2lwYWxQb2xpY3lgIGluc3RlYWQuXG4gICAqL1xuICBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFkZCB0byB0aGUgcG9saWN5IG9mIHRoaXMgcHJpbmNpcGFsLlxuICAgKi9cbiAgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHByaW5jaXBhbHMgdGhhdCBjYW4gYmUgY29tcGFyZWQuXG4gKlxuICogVGhpcyBvbmx5IG5lZWRzIHRvIGJlIGltcGxlbWVudGVkIGZvciBwcmluY2lwYWxzIHRoYXQgY291bGQgcG90ZW50aWFsbHkgYmUgdmFsdWUtZXF1YWwuXG4gKiBJZGVudGl0eS1lcXVhbCBwcmluY2lwYWxzIHdpbGwgYmUgaGFuZGxlZCBjb3JyZWN0bHkgYnkgZGVmYXVsdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29tcGFyYWJsZVByaW5jaXBhbCBleHRlbmRzIElQcmluY2lwYWwge1xuICAvKipcbiAgICogUmV0dXJuIGEgc3RyaW5nIGZvcm1hdCBvZiB0aGlzIHByaW5jaXBhbCB3aGljaCBzaG91bGQgYmUgaWRlbnRpY2FsIGlmIHRoZSB0d29cbiAgICogcHJpbmNpcGFscyBhcmUgdGhlIHNhbWUuXG4gICAqL1xuICBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3Igd29ya2luZyB3aXRoIGBJQ29tcGFyYWJsZVByaW5jaXBhbGBzXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wYXJhYmxlUHJpbmNpcGFsIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBwcmluY2lwYWwgaXMgYSBjb21wYXJhYmxlIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NvbXBhcmFibGVQcmluY2lwYWwoeDogSVByaW5jaXBhbCk6IHggaXMgSUNvbXBhcmFibGVQcmluY2lwYWwge1xuICAgIHJldHVybiAnZGVkdXBlU3RyaW5nJyBpbiB4O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGVkdXBlU3RyaW5nIG9mIHRoZSBnaXZlbiBwcmluY2lwYWwsIGlmIGF2YWlsYWJsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkZWR1cGVTdHJpbmdGb3IoeDogSVByaW5jaXBhbCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIENvbXBhcmFibGVQcmluY2lwYWwuaXNDb21wYXJhYmxlUHJpbmNpcGFsKHgpID8geC5kZWR1cGVTdHJpbmcoKSA6IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEEgdHlwZSBvZiBwcmluY2lwYWwgdGhhdCBoYXMgbW9yZSBjb250cm9sIG92ZXIgaXRzIG93biByZXByZXNlbnRhdGlvbiBpbiBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnRzXG4gKlxuICogTW9yZSBjb21wbGV4IHR5cGVzIG9mIGlkZW50aXR5IHByb3ZpZGVycyBuZWVkIG1vcmUgY29udHJvbCBvdmVyIFJvbGUncyBwb2xpY3kgZG9jdW1lbnRzXG4gKiB0aGFuIHNpbXBseSBgeyBFZmZlY3Q6ICdBbGxvdycsIEFjdGlvbjogJ0Fzc3VtZVJvbGUnLCBQcmluY2lwYWw6IDxXaGF0ZXZlcj4gfWAuXG4gKlxuICogSWYgdGhhdCBjb250cm9sIGlzIG5lY2Vzc2FyeSwgdGhleSBjYW4gaW1wbGVtZW50IGBJQXNzdW1lUm9sZVByaW5jaXBhbGAgdG8gZ2V0IGZ1bGxcbiAqIGFjY2VzcyB0byBhIFJvbGUncyBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFzc3VtZVJvbGVQcmluY2lwYWwgZXh0ZW5kcyBJUHJpbmNpcGFsIHtcbiAgLyoqXG4gICAqIEFkZCB0aGUgcHJpbmNpcGFsIHRvIHRoZSBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnRcbiAgICpcbiAgICogQWRkIHRoZSBzdGF0ZW1lbnRzIHRvIHRoZSBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQgbmVjZXNzYXJ5IHRvIGdpdmUgdGhpcyBwcmluY2lwYWxcbiAgICogcGVybWlzc2lvbnMgdG8gYXNzdW1lIHRoZSBnaXZlbiByb2xlLlxuICAgKi9cbiAgYWRkVG9Bc3N1bWVSb2xlUG9saWN5KGRvY3VtZW50OiBQb2xpY3lEb2N1bWVudCk6IHZvaWQ7XG59XG5cbi8qKlxuICogUmVzdWx0IG9mIGNhbGxpbmcgYGFkZFRvUHJpbmNpcGFsUG9saWN5YFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHN0YXRlbWVudCB3YXMgYWRkZWQgdG8gdGhlIGlkZW50aXR5J3MgcG9saWNpZXMuXG4gICAqXG4gICAqL1xuICByZWFkb25seSBzdGF0ZW1lbnRBZGRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVwZW5kYWJsZSB3aGljaCBhbGxvd3MgZGVwZW5kaW5nIG9uIHRoZSBwb2xpY3kgY2hhbmdlIGJlaW5nIGFwcGxpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZXF1aXJlZCBpZiBgc3RhdGVtZW50QWRkZWRgIGlzIHRydWUuXG4gICAqL1xuICByZWFkb25seSBwb2xpY3lEZXBlbmRhYmxlPzogSURlcGVuZGFibGU7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgcG9saWN5IHByaW5jaXBhbHNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByaW5jaXBhbEJhc2UgaW1wbGVtZW50cyBJQXNzdW1lUm9sZVByaW5jaXBhbCwgSUNvbXBhcmFibGVQcmluY2lwYWwge1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWwgPSB0aGlzO1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHBvbGljeSBmcmFnbWVudCB0aGF0IGlkZW50aWZpZXMgdGhpcyBwcmluY2lwYWwgaW4gYSBQb2xpY3kuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50O1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgUHJpbmNpcGFsIGlzIHVzZWQgaW4gYW4gQXNzdW1lUm9sZSBwb2xpY3ksIHRoZSBhY3Rpb24gdG8gdXNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZyA9ICdzdHM6QXNzdW1lUm9sZSc7XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShfc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgLy8gVGhpcyBiYXNlIGNsYXNzIGlzIHVzZWQgZm9yIG5vbi1pZGVudGl0eSBwcmluY2lwYWxzLiBOb25lIG9mIHRoZW1cbiAgICAvLyBoYXZlIGEgUG9saWN5RG9jdW1lbnQgdG8gYWRkIHRvLlxuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9O1xuICB9XG5cbiAgcHVibGljIGFkZFRvQXNzdW1lUm9sZVBvbGljeShkb2N1bWVudDogUG9saWN5RG9jdW1lbnQpOiB2b2lkIHtcbiAgICAvLyBEZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgcHJvdG9jb2wsIGNvbXBhdGlibGUgd2l0aCB0aGUgbGVnYWN5IGJlaGF2aW9yXG4gICAgZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFt0aGlzLmFzc3VtZVJvbGVBY3Rpb25dLFxuICAgICAgcHJpbmNpcGFsczogW3RoaXNdLFxuICAgIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAvLyBUaGlzIGlzIGEgZmlyc3QgcGFzcyB0byBtYWtlIHRoZSBvYmplY3QgcmVhZGFibGUuIERlc2NlbmRhbnQgcHJpbmNpcGFsc1xuICAgIC8vIHNob3VsZCByZXR1cm4gc29tZXRoaW5nIG5pY2VyLlxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEpTT04taWZ5IHRoZSBwcmluY2lwYWxcbiAgICpcbiAgICogVXNlZCB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIC8vIEhhdmUgdG8gaW1wbGVtZW50IHRvSlNPTigpIGJlY2F1c2UgdGhlIGRlZmF1bHQgd2lsbCBsZWFkIHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICByZXR1cm4gdGhpcy5wb2xpY3lGcmFnbWVudC5wcmluY2lwYWxKc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMgdXNpbmcgdGhpcyBwcmluY2lwYWwgYXMgdGhlIGJhc2UsIHdpdGggdGhlXG4gICAqIHBhc3NlZCBjb25kaXRpb25zIGFkZGVkLlxuICAgKlxuICAgKiBXaGVuIHRoZXJlIGlzIGEgdmFsdWUgZm9yIHRoZSBzYW1lIG9wZXJhdG9yIGFuZCBrZXkgaW4gYm90aCB0aGUgcHJpbmNpcGFsIGFuZCB0aGVcbiAgICogY29uZGl0aW9ucyBwYXJhbWV0ZXIsIHRoZSB2YWx1ZSBmcm9tIHRoZSBjb25kaXRpb25zIHBhcmFtZXRlciB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IFByaW5jaXBhbFdpdGhDb25kaXRpb25zIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyB3aXRoQ29uZGl0aW9ucyhjb25kaXRpb25zOiBDb25kaXRpb25zKTogUHJpbmNpcGFsQmFzZSB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyh0aGlzLCBjb25kaXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHByaW5jaXBhbCB1c2luZyB0aGlzIHByaW5jaXBhbCBhcyB0aGUgYmFzZSwgd2l0aCBzZXNzaW9uIHRhZ3MgZW5hYmxlZC5cbiAgICpcbiAgICogQHJldHVybnMgYSBuZXcgU2Vzc2lvblRhZ3NQcmluY2lwYWwgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIHdpdGhTZXNzaW9uVGFncygpOiBQcmluY2lwYWxCYXNlIHtcbiAgICByZXR1cm4gbmV3IFNlc3Npb25UYWdzUHJpbmNpcGFsKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIG9yIG5vdCB0aGlzIHByaW5jaXBhbCBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBQcmluY2lwYWxzIHRoYXQgd3JhcCBvdGhlciBwcmluY2lwYWxzXG4gKi9cbmFic3RyYWN0IGNsYXNzIFByaW5jaXBhbEFkYXB0ZXIgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb24gPSB0aGlzLndyYXBwZWQuYXNzdW1lUm9sZUFjdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQgPSB0aGlzLndyYXBwZWQucHJpbmNpcGFsQWNjb3VudDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgd3JhcHBlZDogSVByaW5jaXBhbCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHsgcmV0dXJuIHRoaXMud3JhcHBlZC5wb2xpY3lGcmFnbWVudDsgfVxuXG4gIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlZC5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICB9XG4gIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWQuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgd3JhcHBlZCBwcmluY2lwYWwncyBkZWR1cGUgc3RyaW5nIChpZiBhdmFpbGFibGUpXG4gICAqL1xuICBwcm90ZWN0ZWQgYXBwZW5kRGVkdXBlKGFwcGVuZDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBpbm5lciA9IENvbXBhcmFibGVQcmluY2lwYWwuZGVkdXBlU3RyaW5nRm9yKHRoaXMud3JhcHBlZCk7XG4gICAgcmV0dXJuIGlubmVyICE9PSB1bmRlZmluZWQgPyBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiR7aW5uZXJ9OiR7YXBwZW5kfWAgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBJQU0gcHJpbmNpcGFsIHdpdGggYWRkaXRpb25hbCBjb25kaXRpb25zIHNwZWNpZnlpbmcgd2hlbiB0aGUgcG9saWN5IGlzIGluIGVmZmVjdC5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBjb25kaXRpb25zLCBzZWU6XG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBleHRlbmRzIFByaW5jaXBhbEFkYXB0ZXIge1xuICBwcml2YXRlIGFkZGl0aW9uYWxDb25kaXRpb25zOiBDb25kaXRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHByaW5jaXBhbDogSVByaW5jaXBhbCwgY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIHN1cGVyKHByaW5jaXBhbCk7XG4gICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZGl0aW9uIHRvIHRoZSBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBhZGRDb25kaXRpb24oa2V5OiBzdHJpbmcsIHZhbHVlOiBDb25kaXRpb24pIHtcbiAgICB2YWxpZGF0ZUNvbmRpdGlvbk9iamVjdCh2YWx1ZSk7XG5cbiAgICBjb25zdCBleGlzdGluZ1ZhbHVlID0gdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldO1xuICAgIGlmICghZXhpc3RpbmdWYWx1ZSkge1xuICAgICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldID0gdmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGV4aXN0aW5nVmFsdWUpO1xuXG4gICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldID0geyAuLi5leGlzdGluZ1ZhbHVlLCAuLi52YWx1ZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgbXVsdGlwbGUgY29uZGl0aW9ucyB0byB0aGUgcHJpbmNpcGFsXG4gICAqXG4gICAqIFZhbHVlcyBmcm9tIHRoZSBjb25kaXRpb25zIHBhcmFtZXRlciB3aWxsIG92ZXJ3cml0ZSBleGlzdGluZyB2YWx1ZXMgd2l0aCB0aGUgc2FtZSBvcGVyYXRvclxuICAgKiBhbmQga2V5LlxuICAgKi9cbiAgcHVibGljIGFkZENvbmRpdGlvbnMoY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIE9iamVjdC5lbnRyaWVzKGNvbmRpdGlvbnMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgdGhpcy5hZGRDb25kaXRpb24oa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqIFNlZSBbdGhlIElBTSBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sKS5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29uZGl0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZUNvbmRpdGlvbnModGhpcy53cmFwcGVkLnBvbGljeUZyYWdtZW50LmNvbmRpdGlvbnMsIHRoaXMuYWRkaXRpb25hbENvbmRpdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCh0aGlzLndyYXBwZWQucG9saWN5RnJhZ21lbnQucHJpbmNpcGFsSnNvbiwgdGhpcy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVkLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogSlNPTi1pZnkgdGhlIHByaW5jaXBhbFxuICAgKlxuICAgKiBVc2VkIHdoZW4gSlNPTi5zdHJpbmdpZnkoKSBpcyBjYWxsZWRcbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgLy8gSGF2ZSB0byBpbXBsZW1lbnQgdG9KU09OKCkgYmVjYXVzZSB0aGUgZGVmYXVsdCB3aWxsIGxlYWQgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgIHJldHVybiB0aGlzLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb247XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kRGVkdXBlKEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZGl0aW9ucykpO1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZUNvbmRpdGlvbnMocHJpbmNpcGFsQ29uZGl0aW9uczogQ29uZGl0aW9ucywgYWRkaXRpb25hbENvbmRpdGlvbnM6IENvbmRpdGlvbnMpOiBDb25kaXRpb25zIHtcbiAgICBjb25zdCBtZXJnZWRDb25kaXRpb25zOiBDb25kaXRpb25zID0ge307XG4gICAgT2JqZWN0LmVudHJpZXMocHJpbmNpcGFsQ29uZGl0aW9ucykuZm9yRWFjaCgoW29wZXJhdG9yLCBjb25kaXRpb25dKSA9PiB7XG4gICAgICBtZXJnZWRDb25kaXRpb25zW29wZXJhdG9yXSA9IGNvbmRpdGlvbjtcbiAgICB9KTtcblxuICAgIE9iamVjdC5lbnRyaWVzKGFkZGl0aW9uYWxDb25kaXRpb25zKS5mb3JFYWNoKChbb3BlcmF0b3IsIGNvbmRpdGlvbl0pID0+IHtcbiAgICAgIC8vIG1lcmdlIHRoZSBjb25kaXRpb25zIGlmIG9uZSBvZiB0aGUgYWRkaXRpb25hbCBjb25kaXRpb25zIHVzZXMgYW5cbiAgICAgIC8vIG9wZXJhdG9yIHRoYXQncyBhbHJlYWR5IHVzZWQgYnkgdGhlIHByaW5jaXBhbCdzIGNvbmRpdGlvbnMgbWVyZ2UgdGhlXG4gICAgICAvLyBpbm5lciBzdHJ1Y3R1cmUuXG4gICAgICBjb25zdCBleGlzdGluZyA9IG1lcmdlZENvbmRpdGlvbnNbb3BlcmF0b3JdO1xuICAgICAgaWYgKCFleGlzdGluZykge1xuICAgICAgICBtZXJnZWRDb25kaXRpb25zW29wZXJhdG9yXSA9IGNvbmRpdGlvbjtcbiAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBlaXRoZXIgdGhlIGV4aXN0aW5nIGNvbmRpdGlvbiBvciB0aGUgbmV3IG9uZSBjb250YWluIHVucmVzb2x2ZWRcbiAgICAgIC8vIHRva2VucywgZmFpbCB0aGUgbWVyZ2UuIHRoaXMgaXMgYXMgZmFyIGFzIHdlIGdvIGF0IHRoaXMgcG9pbnQuXG4gICAgICBpZiAoY2RrLlRva2VuLmlzVW5yZXNvbHZlZChjb25kaXRpb24pIHx8IGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoZXhpc3RpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbXVsdGlwbGUgXCIke29wZXJhdG9yfVwiIGNvbmRpdGlvbnMgY2Fubm90IGJlIG1lcmdlZCBpZiBvbmUgb2YgdGhlbSBjb250YWlucyBhbiB1bnJlc29sdmVkIHRva2VuYCk7XG4gICAgICB9XG5cbiAgICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGV4aXN0aW5nKTtcbiAgICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGNvbmRpdGlvbik7XG5cbiAgICAgIG1lcmdlZENvbmRpdGlvbnNbb3BlcmF0b3JdID0geyAuLi5leGlzdGluZywgLi4uY29uZGl0aW9uIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lcmdlZENvbmRpdGlvbnM7XG4gIH1cbn1cblxuLyoqXG4gKiBFbmFibGVzIHNlc3Npb24gdGFncyBvbiByb2xlIGFzc3VtcHRpb25zIGZyb20gYSBwcmluY2lwYWxcbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBzZXNzaW9uIHRhZ3MsIHNlZTpcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvblRhZ3NQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxBZGFwdGVyIHtcbiAgY29uc3RydWN0b3IocHJpbmNpcGFsOiBJUHJpbmNpcGFsKSB7XG4gICAgc3VwZXIocHJpbmNpcGFsKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb0Fzc3VtZVJvbGVQb2xpY3koZG9jOiBQb2xpY3lEb2N1bWVudCkge1xuICAgIC8vIExhenkgaW1wb3J0IHRvIGF2b2lkIGNpcmN1bGFyIGltcG9ydCBkZXBlbmRlbmNpZXMgZHVyaW5nIHN0YXJ0dXBcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgYWRhcHRlcjogdHlwZW9mIGltcG9ydCgnLi9wcml2YXRlL3BvbGljeWRvYy1hZGFwdGVyJykgPSByZXF1aXJlKCcuL3ByaXZhdGUvcG9saWN5ZG9jLWFkYXB0ZXInKTtcblxuICAgIGRlZmF1bHRBZGRQcmluY2lwYWxUb0Fzc3VtZVJvbGUodGhpcy53cmFwcGVkLCBuZXcgYWRhcHRlci5NdXRhdGluZ1BvbGljeURvY3VtZW50QWRhcHRlcihkb2MsIChzdGF0ZW1lbnQpID0+IHtcbiAgICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKCdzdHM6VGFnU2Vzc2lvbicpO1xuICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kRGVkdXBlKCcnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiB0aGUgZmllbGRzIGluIGEgUG9saWN5U3RhdGVtZW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gaWRlbnRpZnkgYSBwcmluY2lwYWwuXG4gKlxuICogVGhpcyBjb25zaXN0cyBvZiB0aGUgSlNPTiB1c2VkIGluIHRoZSBcIlByaW5jaXBhbFwiIGZpZWxkLCBhbmQgb3B0aW9uYWxseSBhXG4gKiBzZXQgb2YgXCJDb25kaXRpb25cInMgdGhhdCBuZWVkIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHBvbGljeS5cbiAqXG4gKiBHZW5lcmFsbHksIGEgcHJpbmNpcGFsIGxvb2tzIGxpa2U6XG4gKlxuICogICAgIHsgJzxUWVBFPic6IFsnSUQnLCAnSUQnLCAuLi5dIH1cbiAqXG4gKiBBbmQgdGhpcyBpcyBhbHNvIHRoZSB0eXBlIG9mIHRoZSBmaWVsZCBgcHJpbmNpcGFsSnNvbmAuICBIb3dldmVyLCB0aGVyZSBpcyBhXG4gKiBzcGVjaWFsIHR5cGUgb2YgcHJpbmNpcGFsIHRoYXQgaXMganVzdCB0aGUgc3RyaW5nICcqJywgd2hpY2ggaXMgdHJlYXRlZFxuICogZGlmZmVyZW50bHkgYnkgc29tZSBzZXJ2aWNlcy4gVG8gcmVwcmVzZW50IHRoYXQgcHJpbmNpcGFsLCBgcHJpbmNpcGFsSnNvbmBcbiAqIHNob3VsZCBjb250YWluIGB7ICdMaXRlcmFsU3RyaW5nJzogWycqJ10gfWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcHJpbmNpcGFsSnNvbiBKU09OIG9mIHRoZSBcIlByaW5jaXBhbFwiIHNlY3Rpb24gaW4gYSBwb2xpY3kgc3RhdGVtZW50XG4gICAqIEBwYXJhbSBjb25kaXRpb25zIGNvbmRpdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGFwcGxpZWQgdG8gdGhpcyBwb2xpY3lcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxKc29uOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZ1tdIH0sXG4gICAgLyoqXG4gICAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAgICogU2VlIFt0aGUgSUFNIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfY29uZGl0aW9uLmh0bWwpLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30pIHtcbiAgfVxufVxuXG4vKipcbiAqIFNwZWNpZnkgYSBwcmluY2lwYWwgYnkgdGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pLlxuICogWW91IGNhbiBzcGVjaWZ5IEFXUyBhY2NvdW50cywgSUFNIHVzZXJzLCBGZWRlcmF0ZWQgU0FNTCB1c2VycywgSUFNIHJvbGVzLCBhbmQgc3BlY2lmaWMgYXNzdW1lZC1yb2xlIHNlc3Npb25zLlxuICogWW91IGNhbm5vdCBzcGVjaWZ5IElBTSBncm91cHMgb3IgaW5zdGFuY2UgcHJvZmlsZXMgYXMgcHJpbmNpcGFsc1xuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19wcmluY2lwYWwuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQXJuUHJpbmNpcGFsIGV4dGVuZHMgUHJpbmNpcGFsQmFzZSB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBwcmluY2lwYWwgZW50aXR5IChpLmUuIGFybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6dXNlci91c2VyLW5hbWUpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCh7IEFXUzogW3RoaXMuYXJuXSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEFyblByaW5jaXBhbCgke3RoaXMuYXJufSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBhZGRpbmcgYSBjb25kaXRpb24gdGhhdCB0aGUgcHJpbmNpcGFsIGlzIHBhcnQgb2YgdGhlIHNwZWNpZmllZFxuICAgKiBBV1MgT3JnYW5pemF0aW9uLlxuICAgKi9cbiAgcHVibGljIGluT3JnYW5pemF0aW9uKG9yZ2FuaXphdGlvbklkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoQ29uZGl0aW9ucyh7XG4gICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgJ2F3czpQcmluY2lwYWxPcmdJRCc6IG9yZ2FuaXphdGlvbklkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYEFyblByaW5jaXBhbDoke3RoaXMuYXJufWA7XG4gIH1cbn1cblxuLyoqXG4gKiBTcGVjaWZ5IEFXUyBhY2NvdW50IElEIGFzIHRoZSBwcmluY2lwYWwgZW50aXR5IGluIGEgcG9saWN5IHRvIGRlbGVnYXRlIGF1dGhvcml0eSB0byB0aGUgYWNjb3VudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjY291bnRQcmluY2lwYWwgZXh0ZW5kcyBBcm5QcmluY2lwYWwge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gYWNjb3VudElkIEFXUyBhY2NvdW50IElEIChpLmUuICcxMjM0NTY3ODkwMTInKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjY291bnRJZDogYW55KSB7XG4gICAgc3VwZXIobmV3IFN0YWNrRGVwZW5kZW50VG9rZW4oc3RhY2sgPT4gYGFybjoke3N0YWNrLnBhcnRpdGlvbn06aWFtOjoke2FjY291bnRJZH06cm9vdGApLnRvU3RyaW5nKCkpO1xuICAgIGlmICghY2RrLlRva2VuLmlzVW5yZXNvbHZlZChhY2NvdW50SWQpICYmIHR5cGVvZiBhY2NvdW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjY291bnRJZCBzaG91bGQgYmUgb2YgdHlwZSBzdHJpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5wcmluY2lwYWxBY2NvdW50ID0gYWNjb3VudElkO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQWNjb3VudFByaW5jaXBhbCgke3RoaXMuYWNjb3VudElkfSlgO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYSBzZXJ2aWNlIHByaW5jaXBhbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUHJpbmNpcGFsT3B0cyB7XG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIGluIHdoaWNoIHlvdSB3YW50IHRvIHJlZmVyZW5jZSB0aGUgc2VydmljZVxuICAgKlxuICAgKiBUaGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGZvciAqY3Jvc3MtcmVnaW9uKiByZWZlcmVuY2VzIHRvICpvcHQtaW4qIHJlZ2lvbnMuIEluIHRob3NlXG4gICAqIGNhc2VzLCB0aGUgcmVnaW9uIG5hbWUgbmVlZHMgdG8gYmUgaW5jbHVkZWQgdG8gcmVmZXJlbmNlIHRoZSBjb3JyZWN0IHNlcnZpY2UgcHJpbmNpcGFsLlxuICAgKiBJbiBhbGwgb3RoZXIgY2FzZXMsIHRoZSBnbG9iYWwgc2VydmljZSBwcmluY2lwYWwgbmFtZSBpcyBzdWZmaWNpZW50LlxuICAgKlxuICAgKiBUaGlzIGZpZWxkIGJlaGF2ZXMgZGlmZmVyZW50bHkgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGBAYXdzLWNkay9hd3MtaWFtOnN0YW5kYXJkaXplZFNlcnZpY2VQcmluY2lwYWxzYFxuICAgKiBmbGFnIGlzIHNldCBvciBub3Q6XG4gICAqXG4gICAqIC0gSWYgdGhlIGZsYWcgaXMgc2V0LCB0aGUgaW5wdXQgc2VydmljZSBwcmluY2lwYWwgaXMgYXNzdW1lZCB0byBiZSBvZiB0aGUgZm9ybSBgU0VSVklDRS5hbWF6b25hd3MuY29tYC5cbiAgICogICBUaGF0IHZhbHVlIHdpbGwgYWx3YXlzIGJlIHJldHVybmVkLCB1bmxlc3MgdGhlIGdpdmVuIHJlZ2lvbiBpcyBhbiBvcHQtaW4gcmVnaW9uIGFuZCB0aGUgc2VydmljZVxuICAgKiAgIHByaW5jaXBhbCBpcyByZW5kZXJlZCBpbiBhIHN0YWNrIGluIGEgZGlmZmVyZW50IHJlZ2lvbiwgaW4gd2hpY2ggY2FzZSBgU0VSVklDRS5SRUdJT04uYW1hem9uYXdzLmNvbWBcbiAgICogICB3aWxsIGJlIHJlbmRlcmVkLiBVbmRlciB0aGlzIHJlZ2ltZSwgdGhlcmUgaXMgbm8gZG93bnNpZGUgdG8gYWx3YXlzIHNwZWNpZnlpbmcgdGhlIHJlZ2lvbiBwcm9wZXJ0eTpcbiAgICogICBpdCB3aWxsIGJlIHJlbmRlcmVkIG9ubHkgaWYgbmVjZXNzYXJ5LlxuICAgKiAtIElmIHRoZSBmbGFnIGlzIG5vdCBzZXQsIHRoZSBzZXJ2aWNlIHByaW5jaXBhbCB3aWxsIHJlc29sdmUgdG8gYSBzaW5nbGUgcHJpbmNpcGFsXG4gICAqICAgd2hvc2UgbmFtZSBjb21lcyBmcm9tIHRoZSBgQGF3cy1jZGsvcmVnaW9uLWluZm9gIHBhY2thZ2UsIHVzaW5nIHRoZSByZWdpb24gdG8gb3ZlcnJpZGVcbiAgICogICB0aGUgc3RhY2sgcmVnaW9uLiBJZiB0aGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBzZXJ2aWNlIHByaW5jaXBhbCBpbiB0aGUgZGF0YWJhc2UsLCB0aGUgaW5wdXRcbiAgICogICBzZXJ2aWNlIG5hbWUgaXMgcmV0dXJuZWQgbGl0ZXJhbGx5LiBUaGlzIGlzIGxlZ2FjeSBiZWhhdmlvciBhbmQgaXMgbm90IHJlY29tbWVuZGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSByZXNvbHZpbmcgU3RhY2sncyByZWdpb24uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgY29uZGl0aW9ucyB0byBhZGQgdG8gdGhlIFNlcnZpY2UgUHJpbmNpcGFsXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uZGl0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9ucz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogQW4gSUFNIHByaW5jaXBhbCB0aGF0IHJlcHJlc2VudHMgYW4gQVdTIHNlcnZpY2UgKGkuZS4gc3FzLmFtYXpvbmF3cy5jb20pLlxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZVByaW5jaXBhbCBleHRlbmRzIFByaW5jaXBhbEJhc2Uge1xuICAvKipcbiAgICogVHJhbnNsYXRlIHRoZSBnaXZlbiBzZXJ2aWNlIHByaW5jaXBhbCBuYW1lIGJhc2VkIG9uIHRoZSByZWdpb24gaXQncyB1c2VkIGluLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgZm9yIENoaW5lc2UgcmVnaW9ucyB0aGlzIG1heSAoZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhhdCdzIG5lY2Vzc2FyeVxuICAgKiBmb3IgdGhlIGdpdmVuIHNlcnZpY2UgcHJpbmNpcGFsKSBhcHBlbmQgYC5jbmAgdG8gdGhlIG5hbWUuXG4gICAqXG4gICAqIFRoZSBgcmVnaW9uLWluZm9gIG1vZHVsZSBpcyB1c2VkIHRvIG9idGFpbiB0aGlzIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBwcmluY2lwYWxOYW1lID0gaWFtLlNlcnZpY2VQcmluY2lwYWwuc2VydmljZVByaW5jaXBhbE5hbWUoJ2VjMi5hbWF6b25hd3MuY29tJyk7XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlcnZpY2VQcmluY2lwYWxOYW1lKHNlcnZpY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4oc2VydmljZSwge30pLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVmZXJlbmNlIGFuIEFXUyBzZXJ2aWNlLCBvcHRpb25hbGx5IGluIGEgZ2l2ZW4gcmVnaW9uXG4gICAqXG4gICAqIEBwYXJhbSBzZXJ2aWNlIEFXUyBzZXJ2aWNlIChpLmUuIHNxcy5hbWF6b25hd3MuY29tKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRzOiBTZXJ2aWNlUHJpbmNpcGFsT3B0cyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQoe1xuICAgICAgU2VydmljZTogW25ldyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4odGhpcy5zZXJ2aWNlLCB0aGlzLm9wdHMpLnRvU3RyaW5nKCldLFxuICAgIH0sIHRoaXMub3B0cy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFNlcnZpY2VQcmluY2lwYWwoJHt0aGlzLnNlcnZpY2V9KWA7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGBTZXJ2aWNlUHJpbmNpcGFsOiR7dGhpcy5zZXJ2aWNlfToke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9YDtcbiAgfVxufVxuXG4vKipcbiAqIEEgcHJpbmNpcGFsIHRoYXQgcmVwcmVzZW50cyBhbiBBV1MgT3JnYW5pemF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBPcmdhbml6YXRpb25QcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcmdhbml6YXRpb25JZCBUaGUgdW5pcXVlIGlkZW50aWZpZXIgKElEKSBvZiBhbiBvcmdhbml6YXRpb24gKGkuZS4gby0xMjM0NWFiY2RlKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG9yZ2FuaXphdGlvbklkOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudChcbiAgICAgIHsgQVdTOiBbJyonXSB9LFxuICAgICAgeyBTdHJpbmdFcXVhbHM6IHsgJ2F3czpQcmluY2lwYWxPcmdJRCc6IHRoaXMub3JnYW5pemF0aW9uSWQgfSB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBPcmdhbml6YXRpb25QcmluY2lwYWwoJHt0aGlzLm9yZ2FuaXphdGlvbklkfSlgO1xuICB9XG5cbiAgcHVibGljIGRlZHVwZVN0cmluZygpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBgT3JnYW5pemF0aW9uUHJpbmNpcGFsOiR7dGhpcy5vcmdhbml6YXRpb25JZH1gO1xuICB9XG59XG5cbi8qKlxuICogQSBwb2xpY3kgcHJpbmNpcGFsIGZvciBjYW5vbmljYWxVc2VySWRzIC0gdXNlZnVsIGZvciBTMyBidWNrZXQgcG9saWNpZXMgdGhhdCB1c2VcbiAqIE9yaWdpbiBBY2Nlc3MgaWRlbnRpdGllcy5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2dlbmVyYWwvbGF0ZXN0L2dyL2FjY3QtaWRlbnRpZmllcnMuaHRtbFxuICpcbiAqIGFuZFxuICpcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9wcml2YXRlLWNvbnRlbnQtcmVzdHJpY3RpbmctYWNjZXNzLXRvLXMzLmh0bWxcbiAqXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENhbm9uaWNhbFVzZXJQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBjYW5vbmljYWxVc2VySWQgdW5pcXVlIGlkZW50aWZpZXIgYXNzaWduZWQgYnkgQVdTIGZvciBldmVyeSBhY2NvdW50LlxuICAgKiAgIHJvb3QgdXNlciBhbmQgSUFNIHVzZXJzIGZvciBhbiBhY2NvdW50IGFsbCBzZWUgdGhlIHNhbWUgSUQuXG4gICAqICAgKGkuZS4gNzlhNTlkZjkwMGI5NDllNTVkOTZhMWU2OThmYmFjZWRmZDZlMDlkOThlYWNmOGY4ZDUyMThlN2NkNDdlZjJiZSlcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYW5vbmljYWxVc2VySWQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgQ2Fub25pY2FsVXNlcjogW3RoaXMuY2Fub25pY2FsVXNlcklkXSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJHt0aGlzLmNhbm9uaWNhbFVzZXJJZH0pYDtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYENhbm9uaWNhbFVzZXJQcmluY2lwYWw6JHt0aGlzLmNhbm9uaWNhbFVzZXJJZH1gO1xuICB9XG59XG5cbi8qKlxuICogUHJpbmNpcGFsIGVudGl0eSB0aGF0IHJlcHJlc2VudHMgYSBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXIgc3VjaCBhcyBBbWF6b24gQ29nbml0byxcbiAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0ZW1wb3Jhcnkgc2VjdXJpdHkgY3JlZGVudGlhbHMgdG8gdXNlcnMgd2hvIGhhdmUgYmVlbiBhdXRoZW50aWNhdGVkLlxuICogQWRkaXRpb25hbCBjb25kaXRpb24ga2V5cyBhcmUgYXZhaWxhYmxlIHdoZW4gdGhlIHRlbXBvcmFyeSBzZWN1cml0eSBjcmVkZW50aWFscyBhcmUgdXNlZCB0byBtYWtlIGEgcmVxdWVzdC5cbiAqIFlvdSBjYW4gdXNlIHRoZXNlIGtleXMgdG8gd3JpdGUgcG9saWNpZXMgdGhhdCBsaW1pdCB0aGUgYWNjZXNzIG9mIGZlZGVyYXRlZCB1c2Vycy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfaWFtLWNvbmRpdGlvbi1rZXlzLmh0bWwjY29uZGl0aW9uLWtleXMtd2lmXG4gKi9cbmV4cG9ydCBjbGFzcyBGZWRlcmF0ZWRQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19jb25kaXRpb24uaHRtbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbnM6IENvbmRpdGlvbnM7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBmZWRlcmF0ZWQgZmVkZXJhdGVkIGlkZW50aXR5IHByb3ZpZGVyIChpLmUuICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nIGZvciB1c2VycyBhdXRoZW50aWNhdGVkIHRocm91Z2ggQ29nbml0bylcbiAgICogQHBhcmFtIHNlc3Npb25UYWdzIFdoZXRoZXIgdG8gZW5hYmxlIHNlc3Npb24gdGFnZ2luZyAoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbClcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBmZWRlcmF0ZWQ6IHN0cmluZyxcbiAgICBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30sXG4gICAgYXNzdW1lUm9sZUFjdGlvbjogc3RyaW5nID0gJ3N0czpBc3N1bWVSb2xlJykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zO1xuICAgIHRoaXMuYXNzdW1lUm9sZUFjdGlvbiA9IGFzc3VtZVJvbGVBY3Rpb247XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgRmVkZXJhdGVkOiBbdGhpcy5mZWRlcmF0ZWRdIH0sIHRoaXMuY29uZGl0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBGZWRlcmF0ZWRQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYEZlZGVyYXRlZFByaW5jaXBhbDoke3RoaXMuZmVkZXJhdGVkfToke3RoaXMuYXNzdW1lUm9sZUFjdGlvbn06JHtKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmRpdGlvbnMpfWA7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHByaW5jaXBhbCB0aGF0IHJlcHJlc2VudHMgYSBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXIgYXMgV2ViIElkZW50aXR5IHN1Y2ggYXMgQ29nbml0bywgQW1hem9uLFxuICogRmFjZWJvb2ssIEdvb2dsZSwgZXRjLlxuICovXG5leHBvcnQgY2xhc3MgV2ViSWRlbnRpdHlQcmluY2lwYWwgZXh0ZW5kcyBGZWRlcmF0ZWRQcmluY2lwYWwge1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHlQcm92aWRlciBpZGVudGl0eSBwcm92aWRlciAoaS5lLiAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJyBmb3IgdXNlcnMgYXV0aGVudGljYXRlZCB0aHJvdWdoIENvZ25pdG8pXG4gICAqIEBwYXJhbSBjb25kaXRpb25zIFRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHRoZSBwb2xpY3kgaXMgaW4gZWZmZWN0LlxuICAgKiAgIFNlZSBbdGhlIElBTSBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sKS5cbiAgICogQHBhcmFtIHNlc3Npb25UYWdzIFdoZXRoZXIgdG8gZW5hYmxlIHNlc3Npb24gdGFnZ2luZyAoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbClcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkZW50aXR5UHJvdmlkZXI6IHN0cmluZywgY29uZGl0aW9uczogQ29uZGl0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoaWRlbnRpdHlQcm92aWRlciwgY29uZGl0aW9ucyA/PyB7fSwgJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5Jyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgRmVkZXJhdGVkOiBbdGhpcy5mZWRlcmF0ZWRdIH0sIHRoaXMuY29uZGl0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBXZWJJZGVudGl0eVByaW5jaXBhbCgke3RoaXMuZmVkZXJhdGVkfSlgO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgdGhhdCByZXByZXNlbnRzIGEgZmVkZXJhdGVkIGlkZW50aXR5IHByb3ZpZGVyIGFzIGZyb20gYSBPcGVuSUQgQ29ubmVjdCBwcm92aWRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIE9wZW5JZENvbm5lY3RQcmluY2lwYWwgZXh0ZW5kcyBXZWJJZGVudGl0eVByaW5jaXBhbCB7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcGVuSWRDb25uZWN0UHJvdmlkZXIgT3BlbklEIENvbm5lY3QgcHJvdmlkZXJcbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqICAgU2VlIFt0aGUgSUFNIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfY29uZGl0aW9uLmh0bWwpLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3BlbklkQ29ubmVjdFByb3ZpZGVyOiBJT3BlbklkQ29ubmVjdFByb3ZpZGVyLCBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcGVuSWRDb25uZWN0UHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuLCBjb25kaXRpb25zID8/IHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQoeyBGZWRlcmF0ZWQ6IFt0aGlzLmZlZGVyYXRlZF0gfSwgdGhpcy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYE9wZW5JZENvbm5lY3RQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxufVxuXG4vKipcbiAqIFByaW5jaXBhbCBlbnRpdHkgdGhhdCByZXByZXNlbnRzIGEgU0FNTCBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFNhbWxQcmluY2lwYWwgZXh0ZW5kcyBGZWRlcmF0ZWRQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcihzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIGNvbmRpdGlvbnM6IENvbmRpdGlvbnMpIHtcbiAgICBzdXBlcihzYW1sUHJvdmlkZXIuc2FtbFByb3ZpZGVyQXJuLCBjb25kaXRpb25zLCAnc3RzOkFzc3VtZVJvbGVXaXRoU0FNTCcpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU2FtbFByaW5jaXBhbCgke3RoaXMuZmVkZXJhdGVkfSlgO1xuICB9XG59XG5cbi8qKlxuICogUHJpbmNpcGFsIGVudGl0eSB0aGF0IHJlcHJlc2VudHMgYSBTQU1MIGZlZGVyYXRlZCBpZGVudGl0eSBwcm92aWRlciBmb3JcbiAqIHByb2dyYW1tYXRpYyBhbmQgQVdTIE1hbmFnZW1lbnQgQ29uc29sZSBhY2Nlc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBTYW1sQ29uc29sZVByaW5jaXBhbCBleHRlbmRzIFNhbWxQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcihzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIGNvbmRpdGlvbnM6IENvbmRpdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHNhbWxQcm92aWRlciwge1xuICAgICAgLi4uY29uZGl0aW9ucyxcbiAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAnU0FNTDphdWQnOiBjZGsuQXdzLlBBUlRJVElPTj09PSdhd3MtY24nPyAnaHR0cHM6Ly9zaWduaW4uYW1hem9uYXdzLmNuL3NhbWwnOiAnaHR0cHM6Ly9zaWduaW4uYXdzLmFtYXpvbi5jb20vc2FtbCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU2FtbENvbnNvbGVQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxufVxuXG4vKipcbiAqIFVzZSB0aGUgQVdTIGFjY291bnQgaW50byB3aGljaCBhIHN0YWNrIGlzIGRlcGxveWVkIGFzIHRoZSBwcmluY2lwYWwgZW50aXR5IGluIGEgcG9saWN5XG4gKi9cbmV4cG9ydCBjbGFzcyBBY2NvdW50Um9vdFByaW5jaXBhbCBleHRlbmRzIEFjY291bnRQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihuZXcgU3RhY2tEZXBlbmRlbnRUb2tlbihzdGFjayA9PiBzdGFjay5hY2NvdW50KS50b1N0cmluZygpKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0FjY291bnRSb290UHJpbmNpcGFsKCknO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgcmVwcmVzZW50aW5nIGFsbCBBV1MgaWRlbnRpdGllcyBpbiBhbGwgYWNjb3VudHNcbiAqXG4gKiBTb21lIHNlcnZpY2VzIGJlaGF2ZSBkaWZmZXJlbnRseSB3aGVuIHlvdSBzcGVjaWZ5IGBQcmluY2lwYWw6ICcqJ2BcbiAqIG9yIGBQcmluY2lwYWw6IHsgQVdTOiBcIipcIiB9YCBpbiB0aGVpciByZXNvdXJjZSBwb2xpY3kuXG4gKlxuICogYEFueVByaW5jaXBhbGAgcmVuZGVycyB0byBgUHJpbmNpcGFsOiB7IEFXUzogXCIqXCIgfWAuIFRoaXMgaXMgY29ycmVjdFxuICogbW9zdCBvZiB0aGUgdGltZSwgYnV0IGluIGNhc2VzIHdoZXJlIHlvdSBuZWVkIHRoZSBvdGhlciBwcmluY2lwYWwsXG4gKiB1c2UgYFN0YXJQcmluY2lwYWxgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbnlQcmluY2lwYWwgZXh0ZW5kcyBBcm5QcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignKicpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQW55UHJpbmNpcGFsKCknO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgcmVwcmVzZW50aW5nIGFsbCBpZGVudGl0aWVzIGluIGFsbCBhY2NvdW50c1xuICogQGRlcHJlY2F0ZWQgdXNlIGBBbnlQcmluY2lwYWxgXG4gKi9cbmV4cG9ydCBjbGFzcyBBbnlvbmUgZXh0ZW5kcyBBbnlQcmluY2lwYWwgeyB9XG5cbi8qKlxuICogQSBwcmluY2lwYWwgdGhhdCB1c2VzIGEgbGl0ZXJhbCAnKicgaW4gdGhlIElBTSBKU09OIGxhbmd1YWdlXG4gKlxuICogU29tZSBzZXJ2aWNlcyBiZWhhdmUgZGlmZmVyZW50bHkgd2hlbiB5b3Ugc3BlY2lmeSBgUHJpbmNpcGFsOiBcIipcImBcbiAqIG9yIGBQcmluY2lwYWw6IHsgQVdTOiBcIipcIiB9YCBpbiB0aGVpciByZXNvdXJjZSBwb2xpY3kuXG4gKlxuICogYFN0YXJQcmluY2lwYWxgIHJlbmRlcnMgdG8gYFByaW5jaXBhbDogKmAuIE1vc3Qgb2YgdGhlIHRpbWUsIHlvdVxuICogc2hvdWxkIHVzZSBgQW55UHJpbmNpcGFsYCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgU3RhclByaW5jaXBhbCBleHRlbmRzIFByaW5jaXBhbEJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50ID0ge1xuICAgIHByaW5jaXBhbEpzb246IHsgW0xJVEVSQUxfU1RSSU5HX0tFWV06IFsnKiddIH0sXG4gICAgY29uZGl0aW9uczoge30sXG4gIH07XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnU3RhclByaW5jaXBhbCgpJztcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gJ1N0YXJQcmluY2lwYWwnO1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHByaW5jaXBhbCB0aGF0IGhhcyBtdWx0aXBsZSB0eXBlcyBvZiBwcmluY2lwYWxzLiBBIGNvbXBvc2l0ZSBwcmluY2lwYWwgY2Fubm90XG4gKiBoYXZlIGNvbmRpdGlvbnMuIGkuZS4gbXVsdGlwbGUgU2VydmljZVByaW5jaXBhbHMgdGhhdCBmb3JtIGEgY29tcG9zaXRlIHByaW5jaXBhbFxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlUHJpbmNpcGFsIGV4dGVuZHMgUHJpbmNpcGFsQmFzZSB7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJpbmNpcGFscyA9IG5ldyBBcnJheTxJUHJpbmNpcGFsPigpO1xuXG4gIGNvbnN0cnVjdG9yKC4uLnByaW5jaXBhbHM6IElQcmluY2lwYWxbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKHByaW5jaXBhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvc2l0ZVByaW5jaXBhbHMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB3aXRoIGF0IGxlYXN0IDEgUHJpbmNpcGFsIGJ1dCBub25lIHdlcmUgcGFzc2VkLicpO1xuICAgIH1cbiAgICB0aGlzLmFzc3VtZVJvbGVBY3Rpb24gPSBwcmluY2lwYWxzWzBdLmFzc3VtZVJvbGVBY3Rpb247XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKC4uLnByaW5jaXBhbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgSUFNIHByaW5jaXBhbHMgdG8gdGhlIGNvbXBvc2l0ZSBwcmluY2lwYWwuIENvbXBvc2l0ZSBwcmluY2lwYWxzIGNhbm5vdCBoYXZlXG4gICAqIGNvbmRpdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBwcmluY2lwYWxzIElBTSBwcmluY2lwYWxzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgY29tcG9zaXRlIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGFkZFByaW5jaXBhbHMoLi4ucHJpbmNpcGFsczogSVByaW5jaXBhbFtdKTogdGhpcyB7XG4gICAgdGhpcy5wcmluY2lwYWxzLnB1c2goLi4ucHJpbmNpcGFscyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Bc3N1bWVSb2xlUG9saWN5KGRvYzogUG9saWN5RG9jdW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBkZWZhdWx0QWRkUHJpbmNpcGFsVG9Bc3N1bWVSb2xlKHAsIGRvYyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgLy8gV2Ugb25seSBoYXZlIGEgcHJvYmxlbSB3aXRoIGNvbmRpdGlvbnMgaWYgd2UgYXJlIHRyeWluZyB0byByZW5kZXIgY29tcG9zaXRlXG4gICAgLy8gcHJpbmNwYWxzIGludG8gYSBzaW5nbGUgc3RhdGVtZW50ICh3aGljaCBpcyB3aGVuIGBwb2xpY3lGcmFnbWVudGAgd291bGQgZ2V0IGNhbGxlZClcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBjb25zdCBmcmFnbWVudCA9IHAucG9saWN5RnJhZ21lbnQ7XG4gICAgICBpZiAoZnJhZ21lbnQuY29uZGl0aW9ucyAmJiBPYmplY3Qua2V5cyhmcmFnbWVudC5jb25kaXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQ29tcG9uZW50cyBvZiBhIENvbXBvc2l0ZVByaW5jaXBhbCBtdXN0IG5vdCBoYXZlIGNvbmRpdGlvbnMuICcgK1xuICAgICAgICAgIGBUcmllZCB0byBhZGQgdGhlIGZvbGxvd2luZyBmcmFnbWVudDogJHtKU09OLnN0cmluZ2lmeShmcmFnbWVudCl9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJpbmNpcGFsSnNvbjogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBtZXJnZVByaW5jaXBhbChwcmluY2lwYWxKc29uLCBwLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb24pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQocHJpbmNpcGFsSnNvbik7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBDb21wb3NpdGVQcmluY2lwYWwoJHt0aGlzLnByaW5jaXBhbHN9KWA7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgaW5uZXIgPSB0aGlzLnByaW5jaXBhbHMubWFwKENvbXBhcmFibGVQcmluY2lwYWwuZGVkdXBlU3RyaW5nRm9yKTtcbiAgICBpZiAoaW5uZXIuc29tZSh4ID0+IHggPT09IHVuZGVmaW5lZCkpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiBgQ29tcG9zaXRlUHJpbmNpcGFsWyR7aW5uZXIuam9pbignLCcpfV1gO1xuICB9XG59XG5cbi8qKlxuICogQSBsYXp5IHRva2VuIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgU3RhY2sgdG8gZXZhbHVhdGVcbiAqL1xuY2xhc3MgU3RhY2tEZXBlbmRlbnRUb2tlbiBpbXBsZW1lbnRzIGNkay5JUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmbjogKHN0YWNrOiBjZGsuU3RhY2spID0+IGFueSkge1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNkay5jYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLmZuKGNkay5TdGFjay5vZihjb250ZXh0LnNjb3BlKSk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKU09OLWlmeSB0aGUgdG9rZW5cbiAgICpcbiAgICogVXNlZCB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiAnPHVucmVzb2x2ZWQtdG9rZW4+JztcbiAgfVxufVxuXG5jbGFzcyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4gaW1wbGVtZW50cyBjZGsuSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0czogU2VydmljZVByaW5jaXBhbE9wdHMpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjZGsuY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGN0eDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIHJldHVybiBjZGsuRmVhdHVyZUZsYWdzLm9mKGN0eC5zY29wZSkuaXNFbmFibGVkKGN4YXBpLklBTV9TVEFOREFSRElaRURfU0VSVklDRV9QUklOQ0lQQUxTKVxuICAgICAgPyB0aGlzLm5ld1N0YW5kYXJkaXplZEJlaGF2aW9yKGN0eClcbiAgICAgIDogdGhpcy5sZWdhY3lCZWhhdmlvcihjdHgpO1xuXG4gICAgLy8gVGhlIGNvcnJlY3QgYmVoYXZpb3IgaXMgdG8gYWx3YXlzIHVzZSB0aGUgZ2xvYmFsIHNlcnZpY2UgcHJpbmNpcGFsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnbG9iYWwgKG9yaWdpbmFsKSBzZXJ2aWNlIHByaW5jaXBhbCwgYW5kIGEgc2Vjb25kIG9uZSBpZiByZWdpb24gaXMgZ2l2ZW4gYW5kIHBvaW50cyB0byBhbiBvcHQtaW4gcmVnaW9uXG4gICAqL1xuICBwcml2YXRlIG5ld1N0YW5kYXJkaXplZEJlaGF2aW9yKGN0eDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnN0IHN0YWNrID0gY2RrLlN0YWNrLm9mKGN0eC5zY29wZSk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5vcHRzLnJlZ2lvbiAmJlxuICAgICAgIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQodGhpcy5vcHRzLnJlZ2lvbikgJiZcbiAgICAgIHN0YWNrLnJlZ2lvbiAhPT0gdGhpcy5vcHRzLnJlZ2lvbiAmJlxuICAgICAgUmVnaW9uSW5mby5nZXQodGhpcy5vcHRzLnJlZ2lvbikuaXNPcHRJblJlZ2lvblxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VydmljZS5yZXBsYWNlKC9cXC5hbWF6b25hd3NcXC5jb20kLywgYC4ke3RoaXMub3B0cy5yZWdpb259LmFtYXpvbmF3cy5jb21gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhIHNpbmdsZSBsb29rdXBcbiAgICovXG4gIHByaXZhdGUgbGVnYWN5QmVoYXZpb3IoY3R4OiBjZGsuSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5yZWdpb24pIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSwgaGFuZGxlIGl0IHNlcGFyYXRlbHkgdG8gbm90IGJyZWFrIGxlZ2FjeSBiZWhhdmlvci5cbiAgICAgIHJldHVybiBSZWdpb25JbmZvLmdldCh0aGlzLm9wdHMucmVnaW9uKS5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSkgPz9cbiAgICAgICAgRGVmYXVsdC5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSwgdGhpcy5vcHRzLnJlZ2lvbiwgY2RrLkF3cy5VUkxfU1VGRklYKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IGNkay5TdGFjay5vZihjdHguc2NvcGUpO1xuICAgIHJldHVybiBzdGFjay5yZWdpb25hbEZhY3QoXG4gICAgICBGYWN0TmFtZS5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSksXG4gICAgICBEZWZhdWx0LnNlcnZpY2VQcmluY2lwYWwodGhpcy5zZXJ2aWNlLCBzdGFjay5yZWdpb24sIGNkay5Bd3MuVVJMX1NVRkZJWCksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMsIHtcbiAgICAgIGRpc3BsYXlIaW50OiB0aGlzLnNlcnZpY2UsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSlNPTi1pZnkgdGhlIHRva2VuXG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gYDwke3RoaXMuc2VydmljZX0+YDtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoYXQgdGhlIGdpdmVuIHZhbHVlIGlzIGEgdmFsaWQgQ29uZGl0aW9uIG9iamVjdFxuICpcbiAqIFRoZSB0eXBlIG9mIGBDb25kaXRpb25gIHNob3VsZCBoYXZlIGJlZW4gZGlmZmVyZW50LCBidXQgaXQncyB0b28gbGF0ZSBmb3IgdGhhdC5cbiAqXG4gKiBBbHNvLCB0aGUgSUFNIGxpYnJhcnkgcmVsaWVzIG9uIGJlaW5nIGFibGUgdG8gcGFzcyBpbiBhIGBDZm5Kc29uYCBpbnN0YW5jZSBmb3JcbiAqIGEgYENvbmRpdGlvbmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNvbmRpdGlvbk9iamVjdCh4OiB1bmtub3duKTogYXNzZXJ0cyB4IGlzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBIENvbmRpdGlvbiBzaG91bGQgYmUgcmVwcmVzZW50ZWQgYXMgYSBtYXAgb2Ygb3BlcmF0b3IgdG8gdmFsdWUnKTtcbiAgfVxufVxuIl19