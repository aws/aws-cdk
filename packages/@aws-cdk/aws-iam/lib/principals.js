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
_a = JSII_RTTI_SYMBOL_1;
ComparablePrincipal[_a] = { fqn: "@aws-cdk/aws-iam.ComparablePrincipal", version: "0.0.0" };
exports.ComparablePrincipal = ComparablePrincipal;
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
_b = JSII_RTTI_SYMBOL_1;
PrincipalBase[_b] = { fqn: "@aws-cdk/aws-iam.PrincipalBase", version: "0.0.0" };
exports.PrincipalBase = PrincipalBase;
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
_c = JSII_RTTI_SYMBOL_1;
PrincipalWithConditions[_c] = { fqn: "@aws-cdk/aws-iam.PrincipalWithConditions", version: "0.0.0" };
exports.PrincipalWithConditions = PrincipalWithConditions;
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
        (0, assume_role_policy_1.defaultAddPrincipalToAssumeRole)(this.wrapped, new adapter.MutatingPolicyDocumentAdapter(doc, (statement) => {
            statement.addActions('sts:TagSession');
            return statement;
        }));
    }
    dedupeString() {
        return this.appendDedupe('');
    }
}
_d = JSII_RTTI_SYMBOL_1;
SessionTagsPrincipal[_d] = { fqn: "@aws-cdk/aws-iam.SessionTagsPrincipal", version: "0.0.0" };
exports.SessionTagsPrincipal = SessionTagsPrincipal;
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
_e = JSII_RTTI_SYMBOL_1;
PrincipalPolicyFragment[_e] = { fqn: "@aws-cdk/aws-iam.PrincipalPolicyFragment", version: "0.0.0" };
exports.PrincipalPolicyFragment = PrincipalPolicyFragment;
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
_f = JSII_RTTI_SYMBOL_1;
ArnPrincipal[_f] = { fqn: "@aws-cdk/aws-iam.ArnPrincipal", version: "0.0.0" };
exports.ArnPrincipal = ArnPrincipal;
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
_g = JSII_RTTI_SYMBOL_1;
AccountPrincipal[_g] = { fqn: "@aws-cdk/aws-iam.AccountPrincipal", version: "0.0.0" };
exports.AccountPrincipal = AccountPrincipal;
/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
class ServicePrincipal extends PrincipalBase {
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
_h = JSII_RTTI_SYMBOL_1;
ServicePrincipal[_h] = { fqn: "@aws-cdk/aws-iam.ServicePrincipal", version: "0.0.0" };
exports.ServicePrincipal = ServicePrincipal;
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
_j = JSII_RTTI_SYMBOL_1;
OrganizationPrincipal[_j] = { fqn: "@aws-cdk/aws-iam.OrganizationPrincipal", version: "0.0.0" };
exports.OrganizationPrincipal = OrganizationPrincipal;
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
_k = JSII_RTTI_SYMBOL_1;
CanonicalUserPrincipal[_k] = { fqn: "@aws-cdk/aws-iam.CanonicalUserPrincipal", version: "0.0.0" };
exports.CanonicalUserPrincipal = CanonicalUserPrincipal;
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
_l = JSII_RTTI_SYMBOL_1;
FederatedPrincipal[_l] = { fqn: "@aws-cdk/aws-iam.FederatedPrincipal", version: "0.0.0" };
exports.FederatedPrincipal = FederatedPrincipal;
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
_m = JSII_RTTI_SYMBOL_1;
WebIdentityPrincipal[_m] = { fqn: "@aws-cdk/aws-iam.WebIdentityPrincipal", version: "0.0.0" };
exports.WebIdentityPrincipal = WebIdentityPrincipal;
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
_o = JSII_RTTI_SYMBOL_1;
OpenIdConnectPrincipal[_o] = { fqn: "@aws-cdk/aws-iam.OpenIdConnectPrincipal", version: "0.0.0" };
exports.OpenIdConnectPrincipal = OpenIdConnectPrincipal;
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
_p = JSII_RTTI_SYMBOL_1;
SamlPrincipal[_p] = { fqn: "@aws-cdk/aws-iam.SamlPrincipal", version: "0.0.0" };
exports.SamlPrincipal = SamlPrincipal;
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
_q = JSII_RTTI_SYMBOL_1;
SamlConsolePrincipal[_q] = { fqn: "@aws-cdk/aws-iam.SamlConsolePrincipal", version: "0.0.0" };
exports.SamlConsolePrincipal = SamlConsolePrincipal;
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
_r = JSII_RTTI_SYMBOL_1;
AccountRootPrincipal[_r] = { fqn: "@aws-cdk/aws-iam.AccountRootPrincipal", version: "0.0.0" };
exports.AccountRootPrincipal = AccountRootPrincipal;
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
_s = JSII_RTTI_SYMBOL_1;
AnyPrincipal[_s] = { fqn: "@aws-cdk/aws-iam.AnyPrincipal", version: "0.0.0" };
exports.AnyPrincipal = AnyPrincipal;
/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
class Anyone extends AnyPrincipal {
}
_t = JSII_RTTI_SYMBOL_1;
Anyone[_t] = { fqn: "@aws-cdk/aws-iam.Anyone", version: "0.0.0" };
exports.Anyone = Anyone;
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
_u = JSII_RTTI_SYMBOL_1;
StarPrincipal[_u] = { fqn: "@aws-cdk/aws-iam.StarPrincipal", version: "0.0.0" };
exports.StarPrincipal = StarPrincipal;
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
            (0, assume_role_policy_1.defaultAddPrincipalToAssumeRole)(p, doc);
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
            (0, util_1.mergePrincipal)(principalJson, p.policyFragment.principalJson);
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
_v = JSII_RTTI_SYMBOL_1;
CompositePrincipal[_v] = { fqn: "@aws-cdk/aws-iam.CompositePrincipal", version: "0.0.0" };
exports.CompositePrincipal = CompositePrincipal;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbmNpcGFscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaW5jaXBhbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxzREFBcUU7QUFJckUseURBQTRFO0FBQzVFLHFFQUErRTtBQUMvRSx5Q0FBb0U7QUFnRnBFOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFDOUI7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBYTs7Ozs7Ozs7OztRQUMvQyxPQUFPLGNBQWMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBYTs7Ozs7Ozs7OztRQUN6QyxPQUFPLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUNwRjs7OztBQWJVLGtEQUFtQjtBQXFEaEM7O0dBRUc7QUFDSCxNQUFzQixhQUFhO0lBQW5DO1FBQ2tCLG1CQUFjLEdBQWUsSUFBSSxDQUFDO1FBQ2xDLHFCQUFnQixHQUF1QixTQUFTLENBQUM7UUFPakU7O1dBRUc7UUFDYSxxQkFBZ0IsR0FBVyxnQkFBZ0IsQ0FBQztLQThEN0Q7SUE1RFEsV0FBVyxDQUFDLFNBQTBCOzs7Ozs7Ozs7O1FBQzNDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztLQUM1RDtJQUVNLG9CQUFvQixDQUFDLFVBQTJCOzs7Ozs7Ozs7O1FBQ3JELG9FQUFvRTtRQUNwRSxtQ0FBbUM7UUFDbkMsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztLQUNsQztJQUVNLHFCQUFxQixDQUFDLFFBQXdCOzs7Ozs7Ozs7O1FBQ25ELCtFQUErRTtRQUMvRSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksa0NB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ay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBEZWZhdWx0LCBGYWN0TmFtZSwgUmVnaW9uSW5mbyB9IGZyb20gJ0Bhd3MtY2RrL3JlZ2lvbi1pbmZvJztcbmltcG9ydCB7IElEZXBlbmRhYmxlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJT3BlbklkQ29ubmVjdFByb3ZpZGVyIH0gZnJvbSAnLi9vaWRjLXByb3ZpZGVyJztcbmltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSAnLi9wb2xpY3ktZG9jdW1lbnQnO1xuaW1wb3J0IHsgQ29uZGl0aW9uLCBDb25kaXRpb25zLCBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgZGVmYXVsdEFkZFByaW5jaXBhbFRvQXNzdW1lUm9sZSB9IGZyb20gJy4vcHJpdmF0ZS9hc3N1bWUtcm9sZS1wb2xpY3knO1xuaW1wb3J0IHsgTElURVJBTF9TVFJJTkdfS0VZLCBtZXJnZVByaW5jaXBhbCB9IGZyb20gJy4vcHJpdmF0ZS91dGlsJztcbmltcG9ydCB7IElTYW1sUHJvdmlkZXIgfSBmcm9tICcuL3NhbWwtcHJvdmlkZXInO1xuXG4vKipcbiAqIEFueSBvYmplY3QgdGhhdCBoYXMgYW4gYXNzb2NpYXRlZCBwcmluY2lwYWwgdGhhdCBhIHBlcm1pc3Npb24gY2FuIGJlIGdyYW50ZWQgdG9cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBwcmluY2lwYWwgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG9cbiAgICovXG4gIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBsb2dpY2FsIElBTSBwcmluY2lwYWwuXG4gKlxuICogQW4gSVByaW5jaXBhbCBkZXNjcmliZXMgYSBsb2dpY2FsIGVudGl0eSB0aGF0IGNhbiBwZXJmb3JtIEFXUyBBUEkgY2FsbHNcbiAqIGFnYWluc3Qgc2V0cyBvZiByZXNvdXJjZXMsIG9wdGlvbmFsbHkgdW5kZXIgY2VydGFpbiBjb25kaXRpb25zLlxuICpcbiAqIEV4YW1wbGVzIG9mIHNpbXBsZSBwcmluY2lwYWxzIGFyZSBJQU0gb2JqZWN0cyB0aGF0IHlvdSBjcmVhdGUsIHN1Y2hcbiAqIGFzIFVzZXJzIG9yIFJvbGVzLlxuICpcbiAqIEFuIGV4YW1wbGUgb2YgYSBtb3JlIGNvbXBsZXggcHJpbmNpcGFscyBpcyBhIGBTZXJ2aWNlUHJpbmNpcGFsYCAoc3VjaCBhc1xuICogYG5ldyBTZXJ2aWNlUHJpbmNpcGFsKFwic25zLmFtYXpvbmF3cy5jb21cIilgLCB3aGljaCByZXByZXNlbnRzIHRoZSBTaW1wbGVcbiAqIE5vdGlmaWNhdGlvbnMgU2VydmljZSkuXG4gKlxuICogQSBzaW5nbGUgbG9naWNhbCBQcmluY2lwYWwgbWF5IGFsc28gbWFwIHRvIGEgc2V0IG9mIHBoeXNpY2FsIHByaW5jaXBhbHMuXG4gKiBGb3IgZXhhbXBsZSwgYG5ldyBPcmdhbml6YXRpb25QcmluY2lwYWwoJ28tMTIzNCcpYCByZXByZXNlbnRzIGFsbFxuICogaWRlbnRpdGllcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZSBnaXZlbiBBV1MgT3JnYW5pemF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQcmluY2lwYWwgZXh0ZW5kcyBJR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFdoZW4gdGhpcyBQcmluY2lwYWwgaXMgdXNlZCBpbiBhbiBBc3N1bWVSb2xlIHBvbGljeSwgdGhlIGFjdGlvbiB0byB1c2UuXG4gICAqL1xuICByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcG9saWN5IGZyYWdtZW50IHRoYXQgaWRlbnRpZmllcyB0aGlzIHByaW5jaXBhbCBpbiBhIFBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudDtcblxuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IElEIG9mIHRoaXMgcHJpbmNpcGFsLlxuICAgKiBDYW4gYmUgdW5kZWZpbmVkIHdoZW4gdGhlIGFjY291bnQgaXMgbm90IGtub3duXG4gICAqIChmb3IgZXhhbXBsZSwgZm9yIHNlcnZpY2UgcHJpbmNpcGFscykuXG4gICAqIENhbiBiZSBhIFRva2VuIC0gaW4gdGhhdCBjYXNlLFxuICAgKiBpdCdzIGFzc3VtZWQgdG8gYmUgQVdTOjpBY2NvdW50SWQuXG4gICAqL1xuICByZWFkb25seSBwcmluY2lwYWxBY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGQgdG8gdGhlIHBvbGljeSBvZiB0aGlzIHByaW5jaXBhbC5cbiAgICpcbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc3RhdGVtZW50IHdhcyBhZGRlZCwgZmFsc2UgaWYgdGhlIHByaW5jaXBhbCBpblxuICAgKiBxdWVzdGlvbiBkb2VzIG5vdCBoYXZlIGEgcG9saWN5IGRvY3VtZW50IHRvIGFkZCB0aGUgc3RhdGVtZW50IHRvLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGFkZFRvUHJpbmNpcGFsUG9saWN5YCBpbnN0ZWFkLlxuICAgKi9cbiAgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBZGQgdG8gdGhlIHBvbGljeSBvZiB0aGlzIHByaW5jaXBhbC5cbiAgICovXG4gIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBwcmluY2lwYWxzIHRoYXQgY2FuIGJlIGNvbXBhcmVkLlxuICpcbiAqIFRoaXMgb25seSBuZWVkcyB0byBiZSBpbXBsZW1lbnRlZCBmb3IgcHJpbmNpcGFscyB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGJlIHZhbHVlLWVxdWFsLlxuICogSWRlbnRpdHktZXF1YWwgcHJpbmNpcGFscyB3aWxsIGJlIGhhbmRsZWQgY29ycmVjdGx5IGJ5IGRlZmF1bHQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBhcmFibGVQcmluY2lwYWwgZXh0ZW5kcyBJUHJpbmNpcGFsIHtcbiAgLyoqXG4gICAqIFJldHVybiBhIHN0cmluZyBmb3JtYXQgb2YgdGhpcyBwcmluY2lwYWwgd2hpY2ggc2hvdWxkIGJlIGlkZW50aWNhbCBpZiB0aGUgdHdvXG4gICAqIHByaW5jaXBhbHMgYXJlIHRoZSBzYW1lLlxuICAgKi9cbiAgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIHdvcmtpbmcgd2l0aCBgSUNvbXBhcmFibGVQcmluY2lwYWxgc1xuICovXG5leHBvcnQgY2xhc3MgQ29tcGFyYWJsZVByaW5jaXBhbCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gcHJpbmNpcGFsIGlzIGEgY29tcGFyYWJsZSBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNDb21wYXJhYmxlUHJpbmNpcGFsKHg6IElQcmluY2lwYWwpOiB4IGlzIElDb21wYXJhYmxlUHJpbmNpcGFsIHtcbiAgICByZXR1cm4gJ2RlZHVwZVN0cmluZycgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGRlZHVwZVN0cmluZyBvZiB0aGUgZ2l2ZW4gcHJpbmNpcGFsLCBpZiBhdmFpbGFibGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGVkdXBlU3RyaW5nRm9yKHg6IElQcmluY2lwYWwpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBDb21wYXJhYmxlUHJpbmNpcGFsLmlzQ29tcGFyYWJsZVByaW5jaXBhbCh4KSA/IHguZGVkdXBlU3RyaW5nKCkgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHR5cGUgb2YgcHJpbmNpcGFsIHRoYXQgaGFzIG1vcmUgY29udHJvbCBvdmVyIGl0cyBvd24gcmVwcmVzZW50YXRpb24gaW4gQXNzdW1lUm9sZVBvbGljeURvY3VtZW50c1xuICpcbiAqIE1vcmUgY29tcGxleCB0eXBlcyBvZiBpZGVudGl0eSBwcm92aWRlcnMgbmVlZCBtb3JlIGNvbnRyb2wgb3ZlciBSb2xlJ3MgcG9saWN5IGRvY3VtZW50c1xuICogdGhhbiBzaW1wbHkgYHsgRWZmZWN0OiAnQWxsb3cnLCBBY3Rpb246ICdBc3N1bWVSb2xlJywgUHJpbmNpcGFsOiA8V2hhdGV2ZXI+IH1gLlxuICpcbiAqIElmIHRoYXQgY29udHJvbCBpcyBuZWNlc3NhcnksIHRoZXkgY2FuIGltcGxlbWVudCBgSUFzc3VtZVJvbGVQcmluY2lwYWxgIHRvIGdldCBmdWxsXG4gKiBhY2Nlc3MgdG8gYSBSb2xlJ3MgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBc3N1bWVSb2xlUHJpbmNpcGFsIGV4dGVuZHMgSVByaW5jaXBhbCB7XG4gIC8qKlxuICAgKiBBZGQgdGhlIHByaW5jaXBhbCB0byB0aGUgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50XG4gICAqXG4gICAqIEFkZCB0aGUgc3RhdGVtZW50cyB0byB0aGUgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50IG5lY2Vzc2FyeSB0byBnaXZlIHRoaXMgcHJpbmNpcGFsXG4gICAqIHBlcm1pc3Npb25zIHRvIGFzc3VtZSB0aGUgZ2l2ZW4gcm9sZS5cbiAgICovXG4gIGFkZFRvQXNzdW1lUm9sZVBvbGljeShkb2N1bWVudDogUG9saWN5RG9jdW1lbnQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFJlc3VsdCBvZiBjYWxsaW5nIGBhZGRUb1ByaW5jaXBhbFBvbGljeWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzdGF0ZW1lbnQgd2FzIGFkZGVkIHRvIHRoZSBpZGVudGl0eSdzIHBvbGljaWVzLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50QWRkZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERlcGVuZGFibGUgd2hpY2ggYWxsb3dzIGRlcGVuZGluZyBvbiB0aGUgcG9saWN5IGNoYW5nZSBiZWluZyBhcHBsaWVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmVxdWlyZWQgaWYgYHN0YXRlbWVudEFkZGVkYCBpcyB0cnVlLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5RGVwZW5kYWJsZT86IElEZXBlbmRhYmxlO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHBvbGljeSBwcmluY2lwYWxzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcmluY2lwYWxCYXNlIGltcGxlbWVudHMgSUFzc3VtZVJvbGVQcmluY2lwYWwsIElDb21wYXJhYmxlUHJpbmNpcGFsIHtcbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsID0gdGhpcztcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBwb2xpY3kgZnJhZ21lbnQgdGhhdCBpZGVudGlmaWVzIHRoaXMgcHJpbmNpcGFsIGluIGEgUG9saWN5LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudDtcblxuICAvKipcbiAgICogV2hlbiB0aGlzIFByaW5jaXBhbCBpcyB1c2VkIGluIGFuIEFzc3VtZVJvbGUgcG9saWN5LCB0aGUgYWN0aW9uIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koX3N0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIC8vIFRoaXMgYmFzZSBjbGFzcyBpcyB1c2VkIGZvciBub24taWRlbnRpdHkgcHJpbmNpcGFscy4gTm9uZSBvZiB0aGVtXG4gICAgLy8gaGF2ZSBhIFBvbGljeURvY3VtZW50IHRvIGFkZCB0by5cbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogZmFsc2UgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb0Fzc3VtZVJvbGVQb2xpY3koZG9jdW1lbnQ6IFBvbGljeURvY3VtZW50KTogdm9pZCB7XG4gICAgLy8gRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIHByb3RvY29sLCBjb21wYXRpYmxlIHdpdGggdGhlIGxlZ2FjeSBiZWhhdmlvclxuICAgIGRvY3VtZW50LmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbdGhpcy5hc3N1bWVSb2xlQWN0aW9uXSxcbiAgICAgIHByaW5jaXBhbHM6IFt0aGlzXSxcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgLy8gVGhpcyBpcyBhIGZpcnN0IHBhc3MgdG8gbWFrZSB0aGUgb2JqZWN0IHJlYWRhYmxlLiBEZXNjZW5kYW50IHByaW5jaXBhbHNcbiAgICAvLyBzaG91bGQgcmV0dXJuIHNvbWV0aGluZyBuaWNlci5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5wb2xpY3lGcmFnbWVudC5wcmluY2lwYWxKc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKU09OLWlmeSB0aGUgcHJpbmNpcGFsXG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICAvLyBIYXZlIHRvIGltcGxlbWVudCB0b0pTT04oKSBiZWNhdXNlIHRoZSBkZWZhdWx0IHdpbGwgbGVhZCB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgcmV0dXJuIHRoaXMucG9saWN5RnJhZ21lbnQucHJpbmNpcGFsSnNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IFByaW5jaXBhbFdpdGhDb25kaXRpb25zIHVzaW5nIHRoaXMgcHJpbmNpcGFsIGFzIHRoZSBiYXNlLCB3aXRoIHRoZVxuICAgKiBwYXNzZWQgY29uZGl0aW9ucyBhZGRlZC5cbiAgICpcbiAgICogV2hlbiB0aGVyZSBpcyBhIHZhbHVlIGZvciB0aGUgc2FtZSBvcGVyYXRvciBhbmQga2V5IGluIGJvdGggdGhlIHByaW5jaXBhbCBhbmQgdGhlXG4gICAqIGNvbmRpdGlvbnMgcGFyYW1ldGVyLCB0aGUgdmFsdWUgZnJvbSB0aGUgY29uZGl0aW9ucyBwYXJhbWV0ZXIgd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgd2l0aENvbmRpdGlvbnMoY29uZGl0aW9uczogQ29uZGl0aW9ucyk6IFByaW5jaXBhbEJhc2Uge1xuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsV2l0aENvbmRpdGlvbnModGhpcywgY29uZGl0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBwcmluY2lwYWwgdXNpbmcgdGhpcyBwcmluY2lwYWwgYXMgdGhlIGJhc2UsIHdpdGggc2Vzc2lvbiB0YWdzIGVuYWJsZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IFNlc3Npb25UYWdzUHJpbmNpcGFsIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyB3aXRoU2Vzc2lvblRhZ3MoKTogUHJpbmNpcGFsQmFzZSB7XG4gICAgcmV0dXJuIG5ldyBTZXNzaW9uVGFnc1ByaW5jaXBhbCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciBvciBub3QgdGhpcyBwcmluY2lwYWwgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGRlZHVwZVN0cmluZygpOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgUHJpbmNpcGFscyB0aGF0IHdyYXAgb3RoZXIgcHJpbmNpcGFsc1xuICovXG5hYnN0cmFjdCBjbGFzcyBQcmluY2lwYWxBZGFwdGVyIGV4dGVuZHMgUHJpbmNpcGFsQmFzZSB7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uID0gdGhpcy53cmFwcGVkLmFzc3VtZVJvbGVBY3Rpb247XG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxBY2NvdW50ID0gdGhpcy53cmFwcGVkLnByaW5jaXBhbEFjY291bnQ7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IHdyYXBwZWQ6IElQcmluY2lwYWwpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7IHJldHVybiB0aGlzLndyYXBwZWQucG9saWN5RnJhZ21lbnQ7IH1cblxuICBwdWJsaWMgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVkLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cbiAgcHVibGljIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWQuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgd3JhcHBlZCBwcmluY2lwYWwncyBkZWR1cGUgc3RyaW5nIChpZiBhdmFpbGFibGUpXG4gICAqL1xuICBwcm90ZWN0ZWQgYXBwZW5kRGVkdXBlKGFwcGVuZDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBpbm5lciA9IENvbXBhcmFibGVQcmluY2lwYWwuZGVkdXBlU3RyaW5nRm9yKHRoaXMud3JhcHBlZCk7XG4gICAgcmV0dXJuIGlubmVyICE9PSB1bmRlZmluZWQgPyBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiR7aW5uZXJ9OiR7YXBwZW5kfWAgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBJQU0gcHJpbmNpcGFsIHdpdGggYWRkaXRpb25hbCBjb25kaXRpb25zIHNwZWNpZnlpbmcgd2hlbiB0aGUgcG9saWN5IGlzIGluIGVmZmVjdC5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBjb25kaXRpb25zLCBzZWU6XG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBleHRlbmRzIFByaW5jaXBhbEFkYXB0ZXIge1xuICBwcml2YXRlIGFkZGl0aW9uYWxDb25kaXRpb25zOiBDb25kaXRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHByaW5jaXBhbDogSVByaW5jaXBhbCwgY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIHN1cGVyKHByaW5jaXBhbCk7XG4gICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZGl0aW9uIHRvIHRoZSBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBhZGRDb25kaXRpb24oa2V5OiBzdHJpbmcsIHZhbHVlOiBDb25kaXRpb24pIHtcbiAgICB2YWxpZGF0ZUNvbmRpdGlvbk9iamVjdCh2YWx1ZSk7XG5cbiAgICBjb25zdCBleGlzdGluZ1ZhbHVlID0gdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldO1xuICAgIGlmICghZXhpc3RpbmdWYWx1ZSkge1xuICAgICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldID0gdmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGV4aXN0aW5nVmFsdWUpO1xuXG4gICAgdGhpcy5hZGRpdGlvbmFsQ29uZGl0aW9uc1trZXldID0geyAuLi5leGlzdGluZ1ZhbHVlLCAuLi52YWx1ZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgbXVsdGlwbGUgY29uZGl0aW9ucyB0byB0aGUgcHJpbmNpcGFsXG4gICAqXG4gICAqIFZhbHVlcyBmcm9tIHRoZSBjb25kaXRpb25zIHBhcmFtZXRlciB3aWxsIG92ZXJ3cml0ZSBleGlzdGluZyB2YWx1ZXMgd2l0aCB0aGUgc2FtZSBvcGVyYXRvclxuICAgKiBhbmQga2V5LlxuICAgKi9cbiAgcHVibGljIGFkZENvbmRpdGlvbnMoY29uZGl0aW9uczogQ29uZGl0aW9ucykge1xuICAgIE9iamVjdC5lbnRyaWVzKGNvbmRpdGlvbnMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgdGhpcy5hZGRDb25kaXRpb24oa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqIFNlZSBbdGhlIElBTSBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sKS5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29uZGl0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZUNvbmRpdGlvbnModGhpcy53cmFwcGVkLnBvbGljeUZyYWdtZW50LmNvbmRpdGlvbnMsIHRoaXMuYWRkaXRpb25hbENvbmRpdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCh0aGlzLndyYXBwZWQucG9saWN5RnJhZ21lbnQucHJpbmNpcGFsSnNvbiwgdGhpcy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVkLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogSlNPTi1pZnkgdGhlIHByaW5jaXBhbFxuICAgKlxuICAgKiBVc2VkIHdoZW4gSlNPTi5zdHJpbmdpZnkoKSBpcyBjYWxsZWRcbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgLy8gSGF2ZSB0byBpbXBsZW1lbnQgdG9KU09OKCkgYmVjYXVzZSB0aGUgZGVmYXVsdCB3aWxsIGxlYWQgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgIHJldHVybiB0aGlzLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb247XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kRGVkdXBlKEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZGl0aW9ucykpO1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZUNvbmRpdGlvbnMocHJpbmNpcGFsQ29uZGl0aW9uczogQ29uZGl0aW9ucywgYWRkaXRpb25hbENvbmRpdGlvbnM6IENvbmRpdGlvbnMpOiBDb25kaXRpb25zIHtcbiAgICBjb25zdCBtZXJnZWRDb25kaXRpb25zOiBDb25kaXRpb25zID0ge307XG4gICAgT2JqZWN0LmVudHJpZXMocHJpbmNpcGFsQ29uZGl0aW9ucykuZm9yRWFjaCgoW29wZXJhdG9yLCBjb25kaXRpb25dKSA9PiB7XG4gICAgICBtZXJnZWRDb25kaXRpb25zW29wZXJhdG9yXSA9IGNvbmRpdGlvbjtcbiAgICB9KTtcblxuICAgIE9iamVjdC5lbnRyaWVzKGFkZGl0aW9uYWxDb25kaXRpb25zKS5mb3JFYWNoKChbb3BlcmF0b3IsIGNvbmRpdGlvbl0pID0+IHtcbiAgICAgIC8vIG1lcmdlIHRoZSBjb25kaXRpb25zIGlmIG9uZSBvZiB0aGUgYWRkaXRpb25hbCBjb25kaXRpb25zIHVzZXMgYW5cbiAgICAgIC8vIG9wZXJhdG9yIHRoYXQncyBhbHJlYWR5IHVzZWQgYnkgdGhlIHByaW5jaXBhbCdzIGNvbmRpdGlvbnMgbWVyZ2UgdGhlXG4gICAgICAvLyBpbm5lciBzdHJ1Y3R1cmUuXG4gICAgICBjb25zdCBleGlzdGluZyA9IG1lcmdlZENvbmRpdGlvbnNbb3BlcmF0b3JdO1xuICAgICAgaWYgKCFleGlzdGluZykge1xuICAgICAgICBtZXJnZWRDb25kaXRpb25zW29wZXJhdG9yXSA9IGNvbmRpdGlvbjtcbiAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBlaXRoZXIgdGhlIGV4aXN0aW5nIGNvbmRpdGlvbiBvciB0aGUgbmV3IG9uZSBjb250YWluIHVucmVzb2x2ZWRcbiAgICAgIC8vIHRva2VucywgZmFpbCB0aGUgbWVyZ2UuIHRoaXMgaXMgYXMgZmFyIGFzIHdlIGdvIGF0IHRoaXMgcG9pbnQuXG4gICAgICBpZiAoY2RrLlRva2VuLmlzVW5yZXNvbHZlZChjb25kaXRpb24pIHx8IGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoZXhpc3RpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbXVsdGlwbGUgXCIke29wZXJhdG9yfVwiIGNvbmRpdGlvbnMgY2Fubm90IGJlIG1lcmdlZCBpZiBvbmUgb2YgdGhlbSBjb250YWlucyBhbiB1bnJlc29sdmVkIHRva2VuYCk7XG4gICAgICB9XG5cbiAgICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGV4aXN0aW5nKTtcbiAgICAgIHZhbGlkYXRlQ29uZGl0aW9uT2JqZWN0KGNvbmRpdGlvbik7XG5cbiAgICAgIG1lcmdlZENvbmRpdGlvbnNbb3BlcmF0b3JdID0geyAuLi5leGlzdGluZywgLi4uY29uZGl0aW9uIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lcmdlZENvbmRpdGlvbnM7XG4gIH1cbn1cblxuLyoqXG4gKiBFbmFibGVzIHNlc3Npb24gdGFncyBvbiByb2xlIGFzc3VtcHRpb25zIGZyb20gYSBwcmluY2lwYWxcbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBzZXNzaW9uIHRhZ3MsIHNlZTpcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvblRhZ3NQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxBZGFwdGVyIHtcbiAgY29uc3RydWN0b3IocHJpbmNpcGFsOiBJUHJpbmNpcGFsKSB7XG4gICAgc3VwZXIocHJpbmNpcGFsKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb0Fzc3VtZVJvbGVQb2xpY3koZG9jOiBQb2xpY3lEb2N1bWVudCkge1xuICAgIC8vIExhenkgaW1wb3J0IHRvIGF2b2lkIGNpcmN1bGFyIGltcG9ydCBkZXBlbmRlbmNpZXMgZHVyaW5nIHN0YXJ0dXBcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgYWRhcHRlcjogdHlwZW9mIGltcG9ydCgnLi9wcml2YXRlL3BvbGljeWRvYy1hZGFwdGVyJykgPSByZXF1aXJlKCcuL3ByaXZhdGUvcG9saWN5ZG9jLWFkYXB0ZXInKTtcblxuICAgIGRlZmF1bHRBZGRQcmluY2lwYWxUb0Fzc3VtZVJvbGUodGhpcy53cmFwcGVkLCBuZXcgYWRhcHRlci5NdXRhdGluZ1BvbGljeURvY3VtZW50QWRhcHRlcihkb2MsIChzdGF0ZW1lbnQpID0+IHtcbiAgICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKCdzdHM6VGFnU2Vzc2lvbicpO1xuICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kRGVkdXBlKCcnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiB0aGUgZmllbGRzIGluIGEgUG9saWN5U3RhdGVtZW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gaWRlbnRpZnkgYSBwcmluY2lwYWwuXG4gKlxuICogVGhpcyBjb25zaXN0cyBvZiB0aGUgSlNPTiB1c2VkIGluIHRoZSBcIlByaW5jaXBhbFwiIGZpZWxkLCBhbmQgb3B0aW9uYWxseSBhXG4gKiBzZXQgb2YgXCJDb25kaXRpb25cInMgdGhhdCBuZWVkIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHBvbGljeS5cbiAqXG4gKiBHZW5lcmFsbHksIGEgcHJpbmNpcGFsIGxvb2tzIGxpa2U6XG4gKlxuICogICAgIHsgJzxUWVBFPic6IFsnSUQnLCAnSUQnLCAuLi5dIH1cbiAqXG4gKiBBbmQgdGhpcyBpcyBhbHNvIHRoZSB0eXBlIG9mIHRoZSBmaWVsZCBgcHJpbmNpcGFsSnNvbmAuICBIb3dldmVyLCB0aGVyZSBpcyBhXG4gKiBzcGVjaWFsIHR5cGUgb2YgcHJpbmNpcGFsIHRoYXQgaXMganVzdCB0aGUgc3RyaW5nICcqJywgd2hpY2ggaXMgdHJlYXRlZFxuICogZGlmZmVyZW50bHkgYnkgc29tZSBzZXJ2aWNlcy4gVG8gcmVwcmVzZW50IHRoYXQgcHJpbmNpcGFsLCBgcHJpbmNpcGFsSnNvbmBcbiAqIHNob3VsZCBjb250YWluIGB7ICdMaXRlcmFsU3RyaW5nJzogWycqJ10gfWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcHJpbmNpcGFsSnNvbiBKU09OIG9mIHRoZSBcIlByaW5jaXBhbFwiIHNlY3Rpb24gaW4gYSBwb2xpY3kgc3RhdGVtZW50XG4gICAqIEBwYXJhbSBjb25kaXRpb25zIGNvbmRpdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGFwcGxpZWQgdG8gdGhpcyBwb2xpY3lcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxKc29uOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZ1tdIH0sXG4gICAgLyoqXG4gICAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAgICogU2VlIFt0aGUgSUFNIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfY29uZGl0aW9uLmh0bWwpLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30pIHtcbiAgfVxufVxuXG4vKipcbiAqIFNwZWNpZnkgYSBwcmluY2lwYWwgYnkgdGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pLlxuICogWW91IGNhbiBzcGVjaWZ5IEFXUyBhY2NvdW50cywgSUFNIHVzZXJzLCBGZWRlcmF0ZWQgU0FNTCB1c2VycywgSUFNIHJvbGVzLCBhbmQgc3BlY2lmaWMgYXNzdW1lZC1yb2xlIHNlc3Npb25zLlxuICogWW91IGNhbm5vdCBzcGVjaWZ5IElBTSBncm91cHMgb3IgaW5zdGFuY2UgcHJvZmlsZXMgYXMgcHJpbmNpcGFsc1xuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19wcmluY2lwYWwuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQXJuUHJpbmNpcGFsIGV4dGVuZHMgUHJpbmNpcGFsQmFzZSB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBwcmluY2lwYWwgZW50aXR5IChpLmUuIGFybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6dXNlci91c2VyLW5hbWUpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCh7IEFXUzogW3RoaXMuYXJuXSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEFyblByaW5jaXBhbCgke3RoaXMuYXJufSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBhZGRpbmcgYSBjb25kaXRpb24gdGhhdCB0aGUgcHJpbmNpcGFsIGlzIHBhcnQgb2YgdGhlIHNwZWNpZmllZFxuICAgKiBBV1MgT3JnYW5pemF0aW9uLlxuICAgKi9cbiAgcHVibGljIGluT3JnYW5pemF0aW9uKG9yZ2FuaXphdGlvbklkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoQ29uZGl0aW9ucyh7XG4gICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgJ2F3czpQcmluY2lwYWxPcmdJRCc6IG9yZ2FuaXphdGlvbklkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYEFyblByaW5jaXBhbDoke3RoaXMuYXJufWA7XG4gIH1cbn1cblxuLyoqXG4gKiBTcGVjaWZ5IEFXUyBhY2NvdW50IElEIGFzIHRoZSBwcmluY2lwYWwgZW50aXR5IGluIGEgcG9saWN5IHRvIGRlbGVnYXRlIGF1dGhvcml0eSB0byB0aGUgYWNjb3VudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjY291bnRQcmluY2lwYWwgZXh0ZW5kcyBBcm5QcmluY2lwYWwge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gYWNjb3VudElkIEFXUyBhY2NvdW50IElEIChpLmUuICcxMjM0NTY3ODkwMTInKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjY291bnRJZDogYW55KSB7XG4gICAgc3VwZXIobmV3IFN0YWNrRGVwZW5kZW50VG9rZW4oc3RhY2sgPT4gYGFybjoke3N0YWNrLnBhcnRpdGlvbn06aWFtOjoke2FjY291bnRJZH06cm9vdGApLnRvU3RyaW5nKCkpO1xuICAgIGlmICghY2RrLlRva2VuLmlzVW5yZXNvbHZlZChhY2NvdW50SWQpICYmIHR5cGVvZiBhY2NvdW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjY291bnRJZCBzaG91bGQgYmUgb2YgdHlwZSBzdHJpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5wcmluY2lwYWxBY2NvdW50ID0gYWNjb3VudElkO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQWNjb3VudFByaW5jaXBhbCgke3RoaXMuYWNjb3VudElkfSlgO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYSBzZXJ2aWNlIHByaW5jaXBhbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUHJpbmNpcGFsT3B0cyB7XG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIGluIHdoaWNoIHlvdSB3YW50IHRvIHJlZmVyZW5jZSB0aGUgc2VydmljZVxuICAgKlxuICAgKiBUaGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGZvciAqY3Jvc3MtcmVnaW9uKiByZWZlcmVuY2VzIHRvICpvcHQtaW4qIHJlZ2lvbnMuIEluIHRob3NlXG4gICAqIGNhc2VzLCB0aGUgcmVnaW9uIG5hbWUgbmVlZHMgdG8gYmUgaW5jbHVkZWQgdG8gcmVmZXJlbmNlIHRoZSBjb3JyZWN0IHNlcnZpY2UgcHJpbmNpcGFsLlxuICAgKiBJbiBhbGwgb3RoZXIgY2FzZXMsIHRoZSBnbG9iYWwgc2VydmljZSBwcmluY2lwYWwgbmFtZSBpcyBzdWZmaWNpZW50LlxuICAgKlxuICAgKiBUaGlzIGZpZWxkIGJlaGF2ZXMgZGlmZmVyZW50bHkgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGBAYXdzLWNkay9hd3MtaWFtOnN0YW5kYXJkaXplZFNlcnZpY2VQcmluY2lwYWxzYFxuICAgKiBmbGFnIGlzIHNldCBvciBub3Q6XG4gICAqXG4gICAqIC0gSWYgdGhlIGZsYWcgaXMgc2V0LCB0aGUgaW5wdXQgc2VydmljZSBwcmluY2lwYWwgaXMgYXNzdW1lZCB0byBiZSBvZiB0aGUgZm9ybSBgU0VSVklDRS5hbWF6b25hd3MuY29tYC5cbiAgICogICBUaGF0IHZhbHVlIHdpbGwgYWx3YXlzIGJlIHJldHVybmVkLCB1bmxlc3MgdGhlIGdpdmVuIHJlZ2lvbiBpcyBhbiBvcHQtaW4gcmVnaW9uIGFuZCB0aGUgc2VydmljZVxuICAgKiAgIHByaW5jaXBhbCBpcyByZW5kZXJlZCBpbiBhIHN0YWNrIGluIGEgZGlmZmVyZW50IHJlZ2lvbiwgaW4gd2hpY2ggY2FzZSBgU0VSVklDRS5SRUdJT04uYW1hem9uYXdzLmNvbWBcbiAgICogICB3aWxsIGJlIHJlbmRlcmVkLiBVbmRlciB0aGlzIHJlZ2ltZSwgdGhlcmUgaXMgbm8gZG93bnNpZGUgdG8gYWx3YXlzIHNwZWNpZnlpbmcgdGhlIHJlZ2lvbiBwcm9wZXJ0eTpcbiAgICogICBpdCB3aWxsIGJlIHJlbmRlcmVkIG9ubHkgaWYgbmVjZXNzYXJ5LlxuICAgKiAtIElmIHRoZSBmbGFnIGlzIG5vdCBzZXQsIHRoZSBzZXJ2aWNlIHByaW5jaXBhbCB3aWxsIHJlc29sdmUgdG8gYSBzaW5nbGUgcHJpbmNpcGFsXG4gICAqICAgd2hvc2UgbmFtZSBjb21lcyBmcm9tIHRoZSBgQGF3cy1jZGsvcmVnaW9uLWluZm9gIHBhY2thZ2UsIHVzaW5nIHRoZSByZWdpb24gdG8gb3ZlcnJpZGVcbiAgICogICB0aGUgc3RhY2sgcmVnaW9uLiBJZiB0aGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBzZXJ2aWNlIHByaW5jaXBhbCBpbiB0aGUgZGF0YWJhc2UsLCB0aGUgaW5wdXRcbiAgICogICBzZXJ2aWNlIG5hbWUgaXMgcmV0dXJuZWQgbGl0ZXJhbGx5LiBUaGlzIGlzIGxlZ2FjeSBiZWhhdmlvciBhbmQgaXMgbm90IHJlY29tbWVuZGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSByZXNvbHZpbmcgU3RhY2sncyByZWdpb24uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgY29uZGl0aW9ucyB0byBhZGQgdG8gdGhlIFNlcnZpY2UgUHJpbmNpcGFsXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uZGl0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9ucz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogQW4gSUFNIHByaW5jaXBhbCB0aGF0IHJlcHJlc2VudHMgYW4gQVdTIHNlcnZpY2UgKGkuZS4gc3FzLmFtYXpvbmF3cy5jb20pLlxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZVByaW5jaXBhbCBleHRlbmRzIFByaW5jaXBhbEJhc2Uge1xuICAvKipcbiAgICogVHJhbnNsYXRlIHRoZSBnaXZlbiBzZXJ2aWNlIHByaW5jaXBhbCBuYW1lIGJhc2VkIG9uIHRoZSByZWdpb24gaXQncyB1c2VkIGluLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgZm9yIENoaW5lc2UgcmVnaW9ucyB0aGlzIG1heSAoZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhhdCdzIG5lY2Vzc2FyeVxuICAgKiBmb3IgdGhlIGdpdmVuIHNlcnZpY2UgcHJpbmNpcGFsKSBhcHBlbmQgYC5jbmAgdG8gdGhlIG5hbWUuXG4gICAqXG4gICAqIFRoZSBgcmVnaW9uLWluZm9gIG1vZHVsZSBpcyB1c2VkIHRvIG9idGFpbiB0aGlzIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBwcmluY2lwYWxOYW1lID0gaWFtLlNlcnZpY2VQcmluY2lwYWwuc2VydmljZVByaW5jaXBhbE5hbWUoJ2VjMi5hbWF6b25hd3MuY29tJyk7XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlcnZpY2VQcmluY2lwYWxOYW1lKHNlcnZpY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4oc2VydmljZSwge30pLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVmZXJlbmNlIGFuIEFXUyBzZXJ2aWNlLCBvcHRpb25hbGx5IGluIGEgZ2l2ZW4gcmVnaW9uXG4gICAqXG4gICAqIEBwYXJhbSBzZXJ2aWNlIEFXUyBzZXJ2aWNlIChpLmUuIHNxcy5hbWF6b25hd3MuY29tKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRzOiBTZXJ2aWNlUHJpbmNpcGFsT3B0cyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQoe1xuICAgICAgU2VydmljZTogW25ldyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4odGhpcy5zZXJ2aWNlLCB0aGlzLm9wdHMpLnRvU3RyaW5nKCldLFxuICAgIH0sIHRoaXMub3B0cy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFNlcnZpY2VQcmluY2lwYWwoJHt0aGlzLnNlcnZpY2V9KWA7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGBTZXJ2aWNlUHJpbmNpcGFsOiR7dGhpcy5zZXJ2aWNlfToke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9YDtcbiAgfVxufVxuXG4vKipcbiAqIEEgcHJpbmNpcGFsIHRoYXQgcmVwcmVzZW50cyBhbiBBV1MgT3JnYW5pemF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBPcmdhbml6YXRpb25QcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcmdhbml6YXRpb25JZCBUaGUgdW5pcXVlIGlkZW50aWZpZXIgKElEKSBvZiBhbiBvcmdhbml6YXRpb24gKGkuZS4gby0xMjM0NWFiY2RlKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG9yZ2FuaXphdGlvbklkOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudChcbiAgICAgIHsgQVdTOiBbJyonXSB9LFxuICAgICAgeyBTdHJpbmdFcXVhbHM6IHsgJ2F3czpQcmluY2lwYWxPcmdJRCc6IHRoaXMub3JnYW5pemF0aW9uSWQgfSB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBPcmdhbml6YXRpb25QcmluY2lwYWwoJHt0aGlzLm9yZ2FuaXphdGlvbklkfSlgO1xuICB9XG5cbiAgcHVibGljIGRlZHVwZVN0cmluZygpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBgT3JnYW5pemF0aW9uUHJpbmNpcGFsOiR7dGhpcy5vcmdhbml6YXRpb25JZH1gO1xuICB9XG59XG5cbi8qKlxuICogQSBwb2xpY3kgcHJpbmNpcGFsIGZvciBjYW5vbmljYWxVc2VySWRzIC0gdXNlZnVsIGZvciBTMyBidWNrZXQgcG9saWNpZXMgdGhhdCB1c2VcbiAqIE9yaWdpbiBBY2Nlc3MgaWRlbnRpdGllcy5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2dlbmVyYWwvbGF0ZXN0L2dyL2FjY3QtaWRlbnRpZmllcnMuaHRtbFxuICpcbiAqIGFuZFxuICpcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9wcml2YXRlLWNvbnRlbnQtcmVzdHJpY3RpbmctYWNjZXNzLXRvLXMzLmh0bWxcbiAqXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENhbm9uaWNhbFVzZXJQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBjYW5vbmljYWxVc2VySWQgdW5pcXVlIGlkZW50aWZpZXIgYXNzaWduZWQgYnkgQVdTIGZvciBldmVyeSBhY2NvdW50LlxuICAgKiAgIHJvb3QgdXNlciBhbmQgSUFNIHVzZXJzIGZvciBhbiBhY2NvdW50IGFsbCBzZWUgdGhlIHNhbWUgSUQuXG4gICAqICAgKGkuZS4gNzlhNTlkZjkwMGI5NDllNTVkOTZhMWU2OThmYmFjZWRmZDZlMDlkOThlYWNmOGY4ZDUyMThlN2NkNDdlZjJiZSlcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYW5vbmljYWxVc2VySWQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgQ2Fub25pY2FsVXNlcjogW3RoaXMuY2Fub25pY2FsVXNlcklkXSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJHt0aGlzLmNhbm9uaWNhbFVzZXJJZH0pYDtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYENhbm9uaWNhbFVzZXJQcmluY2lwYWw6JHt0aGlzLmNhbm9uaWNhbFVzZXJJZH1gO1xuICB9XG59XG5cbi8qKlxuICogUHJpbmNpcGFsIGVudGl0eSB0aGF0IHJlcHJlc2VudHMgYSBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXIgc3VjaCBhcyBBbWF6b24gQ29nbml0byxcbiAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0ZW1wb3Jhcnkgc2VjdXJpdHkgY3JlZGVudGlhbHMgdG8gdXNlcnMgd2hvIGhhdmUgYmVlbiBhdXRoZW50aWNhdGVkLlxuICogQWRkaXRpb25hbCBjb25kaXRpb24ga2V5cyBhcmUgYXZhaWxhYmxlIHdoZW4gdGhlIHRlbXBvcmFyeSBzZWN1cml0eSBjcmVkZW50aWFscyBhcmUgdXNlZCB0byBtYWtlIGEgcmVxdWVzdC5cbiAqIFlvdSBjYW4gdXNlIHRoZXNlIGtleXMgdG8gd3JpdGUgcG9saWNpZXMgdGhhdCBsaW1pdCB0aGUgYWNjZXNzIG9mIGZlZGVyYXRlZCB1c2Vycy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfaWFtLWNvbmRpdGlvbi1rZXlzLmh0bWwjY29uZGl0aW9uLWtleXMtd2lmXG4gKi9cbmV4cG9ydCBjbGFzcyBGZWRlcmF0ZWRQcmluY2lwYWwgZXh0ZW5kcyBQcmluY2lwYWxCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19jb25kaXRpb24uaHRtbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbnM6IENvbmRpdGlvbnM7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBmZWRlcmF0ZWQgZmVkZXJhdGVkIGlkZW50aXR5IHByb3ZpZGVyIChpLmUuICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nIGZvciB1c2VycyBhdXRoZW50aWNhdGVkIHRocm91Z2ggQ29nbml0bylcbiAgICogQHBhcmFtIHNlc3Npb25UYWdzIFdoZXRoZXIgdG8gZW5hYmxlIHNlc3Npb24gdGFnZ2luZyAoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbClcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBmZWRlcmF0ZWQ6IHN0cmluZyxcbiAgICBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30sXG4gICAgYXNzdW1lUm9sZUFjdGlvbjogc3RyaW5nID0gJ3N0czpBc3N1bWVSb2xlJykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zO1xuICAgIHRoaXMuYXNzdW1lUm9sZUFjdGlvbiA9IGFzc3VtZVJvbGVBY3Rpb247XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgRmVkZXJhdGVkOiBbdGhpcy5mZWRlcmF0ZWRdIH0sIHRoaXMuY29uZGl0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBGZWRlcmF0ZWRQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gYEZlZGVyYXRlZFByaW5jaXBhbDoke3RoaXMuZmVkZXJhdGVkfToke3RoaXMuYXNzdW1lUm9sZUFjdGlvbn06JHtKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmRpdGlvbnMpfWA7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHByaW5jaXBhbCB0aGF0IHJlcHJlc2VudHMgYSBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXIgYXMgV2ViIElkZW50aXR5IHN1Y2ggYXMgQ29nbml0bywgQW1hem9uLFxuICogRmFjZWJvb2ssIEdvb2dsZSwgZXRjLlxuICovXG5leHBvcnQgY2xhc3MgV2ViSWRlbnRpdHlQcmluY2lwYWwgZXh0ZW5kcyBGZWRlcmF0ZWRQcmluY2lwYWwge1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHlQcm92aWRlciBpZGVudGl0eSBwcm92aWRlciAoaS5lLiAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJyBmb3IgdXNlcnMgYXV0aGVudGljYXRlZCB0aHJvdWdoIENvZ25pdG8pXG4gICAqIEBwYXJhbSBjb25kaXRpb25zIFRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHRoZSBwb2xpY3kgaXMgaW4gZWZmZWN0LlxuICAgKiAgIFNlZSBbdGhlIElBTSBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX2NvbmRpdGlvbi5odG1sKS5cbiAgICogQHBhcmFtIHNlc3Npb25UYWdzIFdoZXRoZXIgdG8gZW5hYmxlIHNlc3Npb24gdGFnZ2luZyAoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9zZXNzaW9uLXRhZ3MuaHRtbClcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkZW50aXR5UHJvdmlkZXI6IHN0cmluZywgY29uZGl0aW9uczogQ29uZGl0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoaWRlbnRpdHlQcm92aWRlciwgY29uZGl0aW9ucyA/PyB7fSwgJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5Jyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IFByaW5jaXBhbFBvbGljeUZyYWdtZW50KHsgRmVkZXJhdGVkOiBbdGhpcy5mZWRlcmF0ZWRdIH0sIHRoaXMuY29uZGl0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBXZWJJZGVudGl0eVByaW5jaXBhbCgke3RoaXMuZmVkZXJhdGVkfSlgO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgdGhhdCByZXByZXNlbnRzIGEgZmVkZXJhdGVkIGlkZW50aXR5IHByb3ZpZGVyIGFzIGZyb20gYSBPcGVuSUQgQ29ubmVjdCBwcm92aWRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIE9wZW5JZENvbm5lY3RQcmluY2lwYWwgZXh0ZW5kcyBXZWJJZGVudGl0eVByaW5jaXBhbCB7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcGVuSWRDb25uZWN0UHJvdmlkZXIgT3BlbklEIENvbm5lY3QgcHJvdmlkZXJcbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgVGhlIGNvbmRpdGlvbnMgdW5kZXIgd2hpY2ggdGhlIHBvbGljeSBpcyBpbiBlZmZlY3QuXG4gICAqICAgU2VlIFt0aGUgSUFNIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfY29uZGl0aW9uLmh0bWwpLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3BlbklkQ29ubmVjdFByb3ZpZGVyOiBJT3BlbklkQ29ubmVjdFByb3ZpZGVyLCBjb25kaXRpb25zOiBDb25kaXRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcGVuSWRDb25uZWN0UHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuLCBjb25kaXRpb25zID8/IHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQoeyBGZWRlcmF0ZWQ6IFt0aGlzLmZlZGVyYXRlZF0gfSwgdGhpcy5jb25kaXRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYE9wZW5JZENvbm5lY3RQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxufVxuXG4vKipcbiAqIFByaW5jaXBhbCBlbnRpdHkgdGhhdCByZXByZXNlbnRzIGEgU0FNTCBmZWRlcmF0ZWQgaWRlbnRpdHkgcHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFNhbWxQcmluY2lwYWwgZXh0ZW5kcyBGZWRlcmF0ZWRQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcihzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIGNvbmRpdGlvbnM6IENvbmRpdGlvbnMpIHtcbiAgICBzdXBlcihzYW1sUHJvdmlkZXIuc2FtbFByb3ZpZGVyQXJuLCBjb25kaXRpb25zLCAnc3RzOkFzc3VtZVJvbGVXaXRoU0FNTCcpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU2FtbFByaW5jaXBhbCgke3RoaXMuZmVkZXJhdGVkfSlgO1xuICB9XG59XG5cbi8qKlxuICogUHJpbmNpcGFsIGVudGl0eSB0aGF0IHJlcHJlc2VudHMgYSBTQU1MIGZlZGVyYXRlZCBpZGVudGl0eSBwcm92aWRlciBmb3JcbiAqIHByb2dyYW1tYXRpYyBhbmQgQVdTIE1hbmFnZW1lbnQgQ29uc29sZSBhY2Nlc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBTYW1sQ29uc29sZVByaW5jaXBhbCBleHRlbmRzIFNhbWxQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcihzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIGNvbmRpdGlvbnM6IENvbmRpdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHNhbWxQcm92aWRlciwge1xuICAgICAgLi4uY29uZGl0aW9ucyxcbiAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAnU0FNTDphdWQnOiBjZGsuQXdzLlBBUlRJVElPTj09PSdhd3MtY24nPyAnaHR0cHM6Ly9zaWduaW4uYW1hem9uYXdzLmNuL3NhbWwnOiAnaHR0cHM6Ly9zaWduaW4uYXdzLmFtYXpvbi5jb20vc2FtbCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU2FtbENvbnNvbGVQcmluY2lwYWwoJHt0aGlzLmZlZGVyYXRlZH0pYDtcbiAgfVxufVxuXG4vKipcbiAqIFVzZSB0aGUgQVdTIGFjY291bnQgaW50byB3aGljaCBhIHN0YWNrIGlzIGRlcGxveWVkIGFzIHRoZSBwcmluY2lwYWwgZW50aXR5IGluIGEgcG9saWN5XG4gKi9cbmV4cG9ydCBjbGFzcyBBY2NvdW50Um9vdFByaW5jaXBhbCBleHRlbmRzIEFjY291bnRQcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihuZXcgU3RhY2tEZXBlbmRlbnRUb2tlbihzdGFjayA9PiBzdGFjay5hY2NvdW50KS50b1N0cmluZygpKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0FjY291bnRSb290UHJpbmNpcGFsKCknO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgcmVwcmVzZW50aW5nIGFsbCBBV1MgaWRlbnRpdGllcyBpbiBhbGwgYWNjb3VudHNcbiAqXG4gKiBTb21lIHNlcnZpY2VzIGJlaGF2ZSBkaWZmZXJlbnRseSB3aGVuIHlvdSBzcGVjaWZ5IGBQcmluY2lwYWw6ICcqJ2BcbiAqIG9yIGBQcmluY2lwYWw6IHsgQVdTOiBcIipcIiB9YCBpbiB0aGVpciByZXNvdXJjZSBwb2xpY3kuXG4gKlxuICogYEFueVByaW5jaXBhbGAgcmVuZGVycyB0byBgUHJpbmNpcGFsOiB7IEFXUzogXCIqXCIgfWAuIFRoaXMgaXMgY29ycmVjdFxuICogbW9zdCBvZiB0aGUgdGltZSwgYnV0IGluIGNhc2VzIHdoZXJlIHlvdSBuZWVkIHRoZSBvdGhlciBwcmluY2lwYWwsXG4gKiB1c2UgYFN0YXJQcmluY2lwYWxgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbnlQcmluY2lwYWwgZXh0ZW5kcyBBcm5QcmluY2lwYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignKicpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQW55UHJpbmNpcGFsKCknO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmluY2lwYWwgcmVwcmVzZW50aW5nIGFsbCBpZGVudGl0aWVzIGluIGFsbCBhY2NvdW50c1xuICogQGRlcHJlY2F0ZWQgdXNlIGBBbnlQcmluY2lwYWxgXG4gKi9cbmV4cG9ydCBjbGFzcyBBbnlvbmUgZXh0ZW5kcyBBbnlQcmluY2lwYWwgeyB9XG5cbi8qKlxuICogQSBwcmluY2lwYWwgdGhhdCB1c2VzIGEgbGl0ZXJhbCAnKicgaW4gdGhlIElBTSBKU09OIGxhbmd1YWdlXG4gKlxuICogU29tZSBzZXJ2aWNlcyBiZWhhdmUgZGlmZmVyZW50bHkgd2hlbiB5b3Ugc3BlY2lmeSBgUHJpbmNpcGFsOiBcIipcImBcbiAqIG9yIGBQcmluY2lwYWw6IHsgQVdTOiBcIipcIiB9YCBpbiB0aGVpciByZXNvdXJjZSBwb2xpY3kuXG4gKlxuICogYFN0YXJQcmluY2lwYWxgIHJlbmRlcnMgdG8gYFByaW5jaXBhbDogKmAuIE1vc3Qgb2YgdGhlIHRpbWUsIHlvdVxuICogc2hvdWxkIHVzZSBgQW55UHJpbmNpcGFsYCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgU3RhclByaW5jaXBhbCBleHRlbmRzIFByaW5jaXBhbEJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50ID0ge1xuICAgIHByaW5jaXBhbEpzb246IHsgW0xJVEVSQUxfU1RSSU5HX0tFWV06IFsnKiddIH0sXG4gICAgY29uZGl0aW9uczoge30sXG4gIH07XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnU3RhclByaW5jaXBhbCgpJztcbiAgfVxuXG4gIHB1YmxpYyBkZWR1cGVTdHJpbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gJ1N0YXJQcmluY2lwYWwnO1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHByaW5jaXBhbCB0aGF0IGhhcyBtdWx0aXBsZSB0eXBlcyBvZiBwcmluY2lwYWxzLiBBIGNvbXBvc2l0ZSBwcmluY2lwYWwgY2Fubm90XG4gKiBoYXZlIGNvbmRpdGlvbnMuIGkuZS4gbXVsdGlwbGUgU2VydmljZVByaW5jaXBhbHMgdGhhdCBmb3JtIGEgY29tcG9zaXRlIHByaW5jaXBhbFxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlUHJpbmNpcGFsIGV4dGVuZHMgUHJpbmNpcGFsQmFzZSB7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJpbmNpcGFscyA9IG5ldyBBcnJheTxJUHJpbmNpcGFsPigpO1xuXG4gIGNvbnN0cnVjdG9yKC4uLnByaW5jaXBhbHM6IElQcmluY2lwYWxbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKHByaW5jaXBhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvc2l0ZVByaW5jaXBhbHMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB3aXRoIGF0IGxlYXN0IDEgUHJpbmNpcGFsIGJ1dCBub25lIHdlcmUgcGFzc2VkLicpO1xuICAgIH1cbiAgICB0aGlzLmFzc3VtZVJvbGVBY3Rpb24gPSBwcmluY2lwYWxzWzBdLmFzc3VtZVJvbGVBY3Rpb247XG4gICAgdGhpcy5hZGRQcmluY2lwYWxzKC4uLnByaW5jaXBhbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgSUFNIHByaW5jaXBhbHMgdG8gdGhlIGNvbXBvc2l0ZSBwcmluY2lwYWwuIENvbXBvc2l0ZSBwcmluY2lwYWxzIGNhbm5vdCBoYXZlXG4gICAqIGNvbmRpdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBwcmluY2lwYWxzIElBTSBwcmluY2lwYWxzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgY29tcG9zaXRlIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGFkZFByaW5jaXBhbHMoLi4ucHJpbmNpcGFsczogSVByaW5jaXBhbFtdKTogdGhpcyB7XG4gICAgdGhpcy5wcmluY2lwYWxzLnB1c2goLi4ucHJpbmNpcGFscyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Bc3N1bWVSb2xlUG9saWN5KGRvYzogUG9saWN5RG9jdW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBkZWZhdWx0QWRkUHJpbmNpcGFsVG9Bc3N1bWVSb2xlKHAsIGRvYyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgLy8gV2Ugb25seSBoYXZlIGEgcHJvYmxlbSB3aXRoIGNvbmRpdGlvbnMgaWYgd2UgYXJlIHRyeWluZyB0byByZW5kZXIgY29tcG9zaXRlXG4gICAgLy8gcHJpbmNwYWxzIGludG8gYSBzaW5nbGUgc3RhdGVtZW50ICh3aGljaCBpcyB3aGVuIGBwb2xpY3lGcmFnbWVudGAgd291bGQgZ2V0IGNhbGxlZClcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBjb25zdCBmcmFnbWVudCA9IHAucG9saWN5RnJhZ21lbnQ7XG4gICAgICBpZiAoZnJhZ21lbnQuY29uZGl0aW9ucyAmJiBPYmplY3Qua2V5cyhmcmFnbWVudC5jb25kaXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQ29tcG9uZW50cyBvZiBhIENvbXBvc2l0ZVByaW5jaXBhbCBtdXN0IG5vdCBoYXZlIGNvbmRpdGlvbnMuICcgK1xuICAgICAgICAgIGBUcmllZCB0byBhZGQgdGhlIGZvbGxvd2luZyBmcmFnbWVudDogJHtKU09OLnN0cmluZ2lmeShmcmFnbWVudCl9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJpbmNpcGFsSnNvbjogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcmluY2lwYWxzKSB7XG4gICAgICBtZXJnZVByaW5jaXBhbChwcmluY2lwYWxKc29uLCBwLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb24pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQocHJpbmNpcGFsSnNvbik7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBDb21wb3NpdGVQcmluY2lwYWwoJHt0aGlzLnByaW5jaXBhbHN9KWA7XG4gIH1cblxuICBwdWJsaWMgZGVkdXBlU3RyaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgaW5uZXIgPSB0aGlzLnByaW5jaXBhbHMubWFwKENvbXBhcmFibGVQcmluY2lwYWwuZGVkdXBlU3RyaW5nRm9yKTtcbiAgICBpZiAoaW5uZXIuc29tZSh4ID0+IHggPT09IHVuZGVmaW5lZCkpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiBgQ29tcG9zaXRlUHJpbmNpcGFsWyR7aW5uZXIuam9pbignLCcpfV1gO1xuICB9XG59XG5cbi8qKlxuICogQSBsYXp5IHRva2VuIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgU3RhY2sgdG8gZXZhbHVhdGVcbiAqL1xuY2xhc3MgU3RhY2tEZXBlbmRlbnRUb2tlbiBpbXBsZW1lbnRzIGNkay5JUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmbjogKHN0YWNrOiBjZGsuU3RhY2spID0+IGFueSkge1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNkay5jYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLmZuKGNkay5TdGFjay5vZihjb250ZXh0LnNjb3BlKSk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKU09OLWlmeSB0aGUgdG9rZW5cbiAgICpcbiAgICogVXNlZCB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiAnPHVucmVzb2x2ZWQtdG9rZW4+JztcbiAgfVxufVxuXG5jbGFzcyBTZXJ2aWNlUHJpbmNpcGFsVG9rZW4gaW1wbGVtZW50cyBjZGsuSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0czogU2VydmljZVByaW5jaXBhbE9wdHMpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjZGsuY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGN0eDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIHJldHVybiBjZGsuRmVhdHVyZUZsYWdzLm9mKGN0eC5zY29wZSkuaXNFbmFibGVkKGN4YXBpLklBTV9TVEFOREFSRElaRURfU0VSVklDRV9QUklOQ0lQQUxTKVxuICAgICAgPyB0aGlzLm5ld1N0YW5kYXJkaXplZEJlaGF2aW9yKGN0eClcbiAgICAgIDogdGhpcy5sZWdhY3lCZWhhdmlvcihjdHgpO1xuXG4gICAgLy8gVGhlIGNvcnJlY3QgYmVoYXZpb3IgaXMgdG8gYWx3YXlzIHVzZSB0aGUgZ2xvYmFsIHNlcnZpY2UgcHJpbmNpcGFsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnbG9iYWwgKG9yaWdpbmFsKSBzZXJ2aWNlIHByaW5jaXBhbCwgYW5kIGEgc2Vjb25kIG9uZSBpZiByZWdpb24gaXMgZ2l2ZW4gYW5kIHBvaW50cyB0byBhbiBvcHQtaW4gcmVnaW9uXG4gICAqL1xuICBwcml2YXRlIG5ld1N0YW5kYXJkaXplZEJlaGF2aW9yKGN0eDogY2RrLklSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnN0IHN0YWNrID0gY2RrLlN0YWNrLm9mKGN0eC5zY29wZSk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5vcHRzLnJlZ2lvbiAmJlxuICAgICAgIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQodGhpcy5vcHRzLnJlZ2lvbikgJiZcbiAgICAgIHN0YWNrLnJlZ2lvbiAhPT0gdGhpcy5vcHRzLnJlZ2lvbiAmJlxuICAgICAgUmVnaW9uSW5mby5nZXQodGhpcy5vcHRzLnJlZ2lvbikuaXNPcHRJblJlZ2lvblxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VydmljZS5yZXBsYWNlKC9cXC5hbWF6b25hd3NcXC5jb20kLywgYC4ke3RoaXMub3B0cy5yZWdpb259LmFtYXpvbmF3cy5jb21gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhIHNpbmdsZSBsb29rdXBcbiAgICovXG4gIHByaXZhdGUgbGVnYWN5QmVoYXZpb3IoY3R4OiBjZGsuSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5yZWdpb24pIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSwgaGFuZGxlIGl0IHNlcGFyYXRlbHkgdG8gbm90IGJyZWFrIGxlZ2FjeSBiZWhhdmlvci5cbiAgICAgIHJldHVybiBSZWdpb25JbmZvLmdldCh0aGlzLm9wdHMucmVnaW9uKS5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSkgPz9cbiAgICAgICAgRGVmYXVsdC5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSwgdGhpcy5vcHRzLnJlZ2lvbiwgY2RrLkF3cy5VUkxfU1VGRklYKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IGNkay5TdGFjay5vZihjdHguc2NvcGUpO1xuICAgIHJldHVybiBzdGFjay5yZWdpb25hbEZhY3QoXG4gICAgICBGYWN0TmFtZS5zZXJ2aWNlUHJpbmNpcGFsKHRoaXMuc2VydmljZSksXG4gICAgICBEZWZhdWx0LnNlcnZpY2VQcmluY2lwYWwodGhpcy5zZXJ2aWNlLCBzdGFjay5yZWdpb24sIGNkay5Bd3MuVVJMX1NVRkZJWCksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMsIHtcbiAgICAgIGRpc3BsYXlIaW50OiB0aGlzLnNlcnZpY2UsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSlNPTi1pZnkgdGhlIHRva2VuXG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gYDwke3RoaXMuc2VydmljZX0+YDtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoYXQgdGhlIGdpdmVuIHZhbHVlIGlzIGEgdmFsaWQgQ29uZGl0aW9uIG9iamVjdFxuICpcbiAqIFRoZSB0eXBlIG9mIGBDb25kaXRpb25gIHNob3VsZCBoYXZlIGJlZW4gZGlmZmVyZW50LCBidXQgaXQncyB0b28gbGF0ZSBmb3IgdGhhdC5cbiAqXG4gKiBBbHNvLCB0aGUgSUFNIGxpYnJhcnkgcmVsaWVzIG9uIGJlaW5nIGFibGUgdG8gcGFzcyBpbiBhIGBDZm5Kc29uYCBpbnN0YW5jZSBmb3JcbiAqIGEgYENvbmRpdGlvbmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNvbmRpdGlvbk9iamVjdCh4OiB1bmtub3duKTogYXNzZXJ0cyB4IGlzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBIENvbmRpdGlvbiBzaG91bGQgYmUgcmVwcmVzZW50ZWQgYXMgYSBtYXAgb2Ygb3BlcmF0b3IgdG8gdmFsdWUnKTtcbiAgfVxufVxuIl19