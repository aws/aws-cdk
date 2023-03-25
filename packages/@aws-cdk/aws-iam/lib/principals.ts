import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Default, FactName, RegionInfo } from '@aws-cdk/region-info';
import { IDependable } from 'constructs';
import { IOpenIdConnectProvider } from './oidc-provider';
import { PolicyDocument } from './policy-document';
import { Condition, Conditions, PolicyStatement } from './policy-statement';
import { defaultAddPrincipalToAssumeRole } from './private/assume-role-policy';
import { LITERAL_STRING_KEY, mergePrincipal } from './private/util';
import { ISamlProvider } from './saml-provider';

/**
 * Any object that has an associated principal that a permission can be granted to
 */
export interface IGrantable {
  /**
   * The principal to grant permissions to
   */
  readonly grantPrincipal: IPrincipal;
}

/**
 * Represents a logical IAM principal.
 *
 * An IPrincipal describes a logical entity that can perform AWS API calls
 * against sets of resources, optionally under certain conditions.
 *
 * Examples of simple principals are IAM objects that you create, such
 * as Users or Roles.
 *
 * An example of a more complex principals is a `ServicePrincipal` (such as
 * `new ServicePrincipal("sns.amazonaws.com")`, which represents the Simple
 * Notifications Service).
 *
 * A single logical Principal may also map to a set of physical principals.
 * For example, `new OrganizationPrincipal('o-1234')` represents all
 * identities that are part of the given AWS Organization.
 */
export interface IPrincipal extends IGrantable {
  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  readonly assumeRoleAction: string;

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  readonly policyFragment: PrincipalPolicyFragment;

  /**
   * The AWS account ID of this principal.
   * Can be undefined when the account is not known
   * (for example, for service principals).
   * Can be a Token - in that case,
   * it's assumed to be AWS::AccountId.
   */
  readonly principalAccount?: string;

  /**
   * Add to the policy of this principal.
   *
   * @returns true if the statement was added, false if the principal in
   * question does not have a policy document to add the statement to.
   *
   * @deprecated Use `addToPrincipalPolicy` instead.
   */
  addToPolicy(statement: PolicyStatement): boolean;

  /**
   * Add to the policy of this principal.
   */
  addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
}

/**
 * Interface for principals that can be compared.
 *
 * This only needs to be implemented for principals that could potentially be value-equal.
 * Identity-equal principals will be handled correctly by default.
 */
export interface IComparablePrincipal extends IPrincipal {
  /**
   * Return a string format of this principal which should be identical if the two
   * principals are the same.
   */
  dedupeString(): string | undefined;
}

/**
 * Helper class for working with `IComparablePrincipal`s
 */
export class ComparablePrincipal {
  /**
   * Whether or not the given principal is a comparable principal
   */
  public static isComparablePrincipal(x: IPrincipal): x is IComparablePrincipal {
    return 'dedupeString' in x;
  }

  /**
   * Return the dedupeString of the given principal, if available
   */
  public static dedupeStringFor(x: IPrincipal): string | undefined {
    return ComparablePrincipal.isComparablePrincipal(x) ? x.dedupeString() : undefined;
  }
}

/**
 * A type of principal that has more control over its own representation in AssumeRolePolicyDocuments
 *
 * More complex types of identity providers need more control over Role's policy documents
 * than simply `{ Effect: 'Allow', Action: 'AssumeRole', Principal: <Whatever> }`.
 *
 * If that control is necessary, they can implement `IAssumeRolePrincipal` to get full
 * access to a Role's AssumeRolePolicyDocument.
 */
export interface IAssumeRolePrincipal extends IPrincipal {
  /**
   * Add the principal to the AssumeRolePolicyDocument
   *
   * Add the statements to the AssumeRolePolicyDocument necessary to give this principal
   * permissions to assume the given role.
   */
  addToAssumeRolePolicy(document: PolicyDocument): void;
}

/**
 * Result of calling `addToPrincipalPolicy`
 */
export interface AddToPrincipalPolicyResult {
  /**
   * Whether the statement was added to the identity's policies.
   *
   */
  readonly statementAdded: boolean;

  /**
   * Dependable which allows depending on the policy change being applied
   *
   * @default - Required if `statementAdded` is true.
   */
  readonly policyDependable?: IDependable;
}

/**
 * Base class for policy principals
 */
export abstract class PrincipalBase implements IAssumeRolePrincipal, IComparablePrincipal {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly principalAccount: string | undefined = undefined;

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  public abstract readonly policyFragment: PrincipalPolicyFragment;

  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  public readonly assumeRoleAction: string = 'sts:AssumeRole';

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }

  public addToPrincipalPolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult {
    // This base class is used for non-identity principals. None of them
    // have a PolicyDocument to add to.
    return { statementAdded: false };
  }

  public addToAssumeRolePolicy(document: PolicyDocument): void {
    // Default implementation of this protocol, compatible with the legacy behavior
    document.addStatements(new PolicyStatement({
      actions: [this.assumeRoleAction],
      principals: [this],
    }));
  }

  public toString() {
    // This is a first pass to make the object readable. Descendant principals
    // should return something nicer.
    return JSON.stringify(this.policyFragment.principalJson);
  }

  /**
   * JSON-ify the principal
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
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
  public withConditions(conditions: Conditions): PrincipalBase {
    return new PrincipalWithConditions(this, conditions);
  }

  /**
   * Returns a new principal using this principal as the base, with session tags enabled.
   *
   * @returns a new SessionTagsPrincipal object.
   */
  public withSessionTags(): PrincipalBase {
    return new SessionTagsPrincipal(this);
  }

  /**
   * Return whether or not this principal is equal to the given principal
   */
  public abstract dedupeString(): string | undefined;
}

/**
 * Base class for Principals that wrap other principals
 */
abstract class PrincipalAdapter extends PrincipalBase {
  public readonly assumeRoleAction = this.wrapped.assumeRoleAction;
  public readonly principalAccount = this.wrapped.principalAccount;

  constructor(protected readonly wrapped: IPrincipal) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment { return this.wrapped.policyFragment; }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.wrapped.addToPolicy(statement);
  }
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    return this.wrapped.addToPrincipalPolicy(statement);
  }

  /**
   * Append the given string to the wrapped principal's dedupe string (if available)
   */
  protected appendDedupe(append: string): string | undefined {
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
export class PrincipalWithConditions extends PrincipalAdapter {
  private additionalConditions: Conditions;

  constructor(principal: IPrincipal, conditions: Conditions) {
    super(principal);
    this.additionalConditions = conditions;
  }

  /**
   * Add a condition to the principal
   */
  public addCondition(key: string, value: Condition) {
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
  public addConditions(conditions: Conditions) {
    Object.entries(conditions).forEach(([key, value]) => {
      this.addCondition(key, value);
    });
  }

  /**
   * The conditions under which the policy is in effect.
   * See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
   */
  public get conditions() {
    return this.mergeConditions(this.wrapped.policyFragment.conditions, this.additionalConditions);
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment(this.wrapped.policyFragment.principalJson, this.conditions);
  }

  public toString() {
    return this.wrapped.toString();
  }

  /**
   * JSON-ify the principal
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    // Have to implement toJSON() because the default will lead to infinite recursion.
    return this.policyFragment.principalJson;
  }

  public dedupeString(): string | undefined {
    return this.appendDedupe(JSON.stringify(this.conditions));
  }

  private mergeConditions(principalConditions: Conditions, additionalConditions: Conditions): Conditions {
    const mergedConditions: Conditions = {};
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

/**
 * Enables session tags on role assumptions from a principal
 *
 * For more information on session tags, see:
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html
 */
export class SessionTagsPrincipal extends PrincipalAdapter {
  constructor(principal: IPrincipal) {
    super(principal);
  }

  public addToAssumeRolePolicy(doc: PolicyDocument) {
    // Lazy import to avoid circular import dependencies during startup

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const adapter: typeof import('./private/policydoc-adapter') = require('./private/policydoc-adapter');

    defaultAddPrincipalToAssumeRole(this.wrapped, new adapter.MutatingPolicyDocumentAdapter(doc, (statement) => {
      statement.addActions('sts:TagSession');
      return statement;
    }));
  }

  public dedupeString(): string | undefined {
    return this.appendDedupe('');
  }
}

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
export class PrincipalPolicyFragment {
  /**
   *
   * @param principalJson JSON of the "Principal" section in a policy statement
   * @param conditions conditions that need to be applied to this policy
   */
  constructor(
    public readonly principalJson: { [key: string]: string[] },
    /**
     * The conditions under which the policy is in effect.
     * See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
     */
    public readonly conditions: Conditions = {}) {
  }
}

/**
 * Specify a principal by the Amazon Resource Name (ARN).
 * You can specify AWS accounts, IAM users, Federated SAML users, IAM roles, and specific assumed-role sessions.
 * You cannot specify IAM groups or instance profiles as principals
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
 */
export class ArnPrincipal extends PrincipalBase {
  /**
   *
   * @param arn Amazon Resource Name (ARN) of the principal entity (i.e. arn:aws:iam::123456789012:user/user-name)
   */
  constructor(public readonly arn: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ AWS: [this.arn] });
  }

  public toString() {
    return `ArnPrincipal(${this.arn})`;
  }

  /**
   * A convenience method for adding a condition that the principal is part of the specified
   * AWS Organization.
   */
  public inOrganization(organizationId: string) {
    return this.withConditions({
      StringEquals: {
        'aws:PrincipalOrgID': organizationId,
      },
    });
  }

  public dedupeString(): string | undefined {
    return `ArnPrincipal:${this.arn}`;
  }
}

/**
 * Specify AWS account ID as the principal entity in a policy to delegate authority to the account.
 */
export class AccountPrincipal extends ArnPrincipal {
  public readonly principalAccount: string | undefined;

  /**
   *
   * @param accountId AWS account ID (i.e. '123456789012')
   */
  constructor(public readonly accountId: any) {
    super(new StackDependentToken(stack => `arn:${stack.partition}:iam::${accountId}:root`).toString());
    if (!cdk.Token.isUnresolved(accountId) && typeof accountId !== 'string') {
      throw new Error('accountId should be of type string');
    }
    this.principalAccount = accountId;
  }

  public toString() {
    return `AccountPrincipal(${this.accountId})`;
  }
}

/**
 * Options for a service principal.
 */
export interface ServicePrincipalOpts {
  /**
   * The region in which you want to reference the service
   *
   * This is only necessary for *cross-region* references to *opt-in* regions. In those
   * cases, the region name needs to be included to reference the correct service principal.
   * In all other cases, the global service principal name is sufficient.
   *
   * This field behaves differently depending on whether the `@aws-cdk/aws-iam:standardizedServicePrincipals`
   * flag is set or not:
   *
   * - If the flag is set, the input service principal is assumed to be of the form `SERVICE.amazonaws.com`.
   *   That value will always be returned, unless the given region is an opt-in region and the service
   *   principal is rendered in a stack in a different region, in which case `SERVICE.REGION.amazonaws.com`
   *   will be rendered. Under this regime, there is no downside to always specifying the region property:
   *   it will be rendered only if necessary.
   * - If the flag is not set, the service principal will resolve to a single principal
   *   whose name comes from the `@aws-cdk/region-info` package, using the region to override
   *   the stack region. If there is no entry for this service principal in the database,, the input
   *   service name is returned literally. This is legacy behavior and is not recommended.
   *
   * @default - the resolving Stack's region.
   */
  readonly region?: string;

  /**
   * Additional conditions to add to the Service Principal
   *
   * @default - No conditions
   */
  readonly conditions?: { [key: string]: any };
}

/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
export class ServicePrincipal extends PrincipalBase {
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
  public static servicePrincipalName(service: string): string {
    return new ServicePrincipalToken(service, {}).toString();
  }

  /**
   * Reference an AWS service, optionally in a given region
   *
   * @param service AWS service (i.e. sqs.amazonaws.com)
   */
  constructor(public readonly service: string, private readonly opts: ServicePrincipalOpts = {}) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({
      Service: [new ServicePrincipalToken(this.service, this.opts).toString()],
    }, this.opts.conditions);
  }

  public toString() {
    return `ServicePrincipal(${this.service})`;
  }

  public dedupeString(): string | undefined {
    return `ServicePrincipal:${this.service}:${JSON.stringify(this.opts)}`;
  }
}

/**
 * A principal that represents an AWS Organization
 */
export class OrganizationPrincipal extends PrincipalBase {
  /**
   *
   * @param organizationId The unique identifier (ID) of an organization (i.e. o-12345abcde)
   */
  constructor(public readonly organizationId: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment(
      { AWS: ['*'] },
      { StringEquals: { 'aws:PrincipalOrgID': this.organizationId } },
    );
  }

  public toString() {
    return `OrganizationPrincipal(${this.organizationId})`;
  }

  public dedupeString(): string | undefined {
    return `OrganizationPrincipal:${this.organizationId}`;
  }
}

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
export class CanonicalUserPrincipal extends PrincipalBase {
  /**
   *
   * @param canonicalUserId unique identifier assigned by AWS for every account.
   *   root user and IAM users for an account all see the same ID.
   *   (i.e. 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be)
   */
  constructor(public readonly canonicalUserId: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ CanonicalUser: [this.canonicalUserId] });
  }

  public toString() {
    return `CanonicalUserPrincipal(${this.canonicalUserId})`;
  }

  public dedupeString(): string | undefined {
    return `CanonicalUserPrincipal:${this.canonicalUserId}`;
  }
}

/**
 * Principal entity that represents a federated identity provider such as Amazon Cognito,
 * that can be used to provide temporary security credentials to users who have been authenticated.
 * Additional condition keys are available when the temporary security credentials are used to make a request.
 * You can use these keys to write policies that limit the access of federated users.
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html#condition-keys-wif
 */
export class FederatedPrincipal extends PrincipalBase {
  public readonly assumeRoleAction: string;

  /**
   * The conditions under which the policy is in effect.
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html
   */
  public readonly conditions: Conditions;

  /**
   *
   * @param federated federated identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito)
   * @param sessionTags Whether to enable session tagging (see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html)
   */
  constructor(
    public readonly federated: string,
    conditions: Conditions = {},
    assumeRoleAction: string = 'sts:AssumeRole') {
    super();

    this.conditions = conditions;
    this.assumeRoleAction = assumeRoleAction;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
  }

  public toString() {
    return `FederatedPrincipal(${this.federated})`;
  }

  public dedupeString(): string | undefined {
    return `FederatedPrincipal:${this.federated}:${this.assumeRoleAction}:${JSON.stringify(this.conditions)}`;
  }
}

/**
 * A principal that represents a federated identity provider as Web Identity such as Cognito, Amazon,
 * Facebook, Google, etc.
 */
export class WebIdentityPrincipal extends FederatedPrincipal {

  /**
   *
   * @param identityProvider identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito)
   * @param conditions The conditions under which the policy is in effect.
   *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
   * @param sessionTags Whether to enable session tagging (see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html)
   */
  constructor(identityProvider: string, conditions: Conditions = {}) {
    super(identityProvider, conditions ?? {}, 'sts:AssumeRoleWithWebIdentity');
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
  }

  public toString() {
    return `WebIdentityPrincipal(${this.federated})`;
  }
}

/**
 * A principal that represents a federated identity provider as from a OpenID Connect provider.
 */
export class OpenIdConnectPrincipal extends WebIdentityPrincipal {

  /**
   *
   * @param openIdConnectProvider OpenID Connect provider
   * @param conditions The conditions under which the policy is in effect.
   *   See [the IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html).
   */
  constructor(openIdConnectProvider: IOpenIdConnectProvider, conditions: Conditions = {}) {
    super(openIdConnectProvider.openIdConnectProviderArn, conditions ?? {});
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [this.federated] }, this.conditions);
  }

  public toString() {
    return `OpenIdConnectPrincipal(${this.federated})`;
  }
}

/**
 * Principal entity that represents a SAML federated identity provider
 */
export class SamlPrincipal extends FederatedPrincipal {
  constructor(samlProvider: ISamlProvider, conditions: Conditions) {
    super(samlProvider.samlProviderArn, conditions, 'sts:AssumeRoleWithSAML');
  }

  public toString() {
    return `SamlPrincipal(${this.federated})`;
  }
}

/**
 * Principal entity that represents a SAML federated identity provider for
 * programmatic and AWS Management Console access.
 */
export class SamlConsolePrincipal extends SamlPrincipal {
  constructor(samlProvider: ISamlProvider, conditions: Conditions = {}) {
    super(samlProvider, {
      ...conditions,
      StringEquals: {
        'SAML:aud': cdk.Aws.PARTITION==='aws-cn'? 'https://signin.amazonaws.cn/saml': 'https://signin.aws.amazon.com/saml',
      },
    });
  }

  public toString() {
    return `SamlConsolePrincipal(${this.federated})`;
  }
}

/**
 * Use the AWS account into which a stack is deployed as the principal entity in a policy
 */
export class AccountRootPrincipal extends AccountPrincipal {
  constructor() {
    super(new StackDependentToken(stack => stack.account).toString());
  }

  public toString() {
    return 'AccountRootPrincipal()';
  }
}

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
export class AnyPrincipal extends ArnPrincipal {
  constructor() {
    super('*');
  }

  public toString() {
    return 'AnyPrincipal()';
  }
}

/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
export class Anyone extends AnyPrincipal { }

/**
 * A principal that uses a literal '*' in the IAM JSON language
 *
 * Some services behave differently when you specify `Principal: "*"`
 * or `Principal: { AWS: "*" }` in their resource policy.
 *
 * `StarPrincipal` renders to `Principal: *`. Most of the time, you
 * should use `AnyPrincipal` instead.
 */
export class StarPrincipal extends PrincipalBase {
  public readonly policyFragment: PrincipalPolicyFragment = {
    principalJson: { [LITERAL_STRING_KEY]: ['*'] },
    conditions: {},
  };

  public toString() {
    return 'StarPrincipal()';
  }

  public dedupeString(): string | undefined {
    return 'StarPrincipal';
  }
}

/**
 * Represents a principal that has multiple types of principals. A composite principal cannot
 * have conditions. i.e. multiple ServicePrincipals that form a composite principal
 */
export class CompositePrincipal extends PrincipalBase {
  public readonly assumeRoleAction: string;
  private readonly principals = new Array<IPrincipal>();

  constructor(...principals: IPrincipal[]) {
    super();
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
  public addPrincipals(...principals: IPrincipal[]): this {
    this.principals.push(...principals);
    return this;
  }

  public addToAssumeRolePolicy(doc: PolicyDocument) {
    for (const p of this.principals) {
      defaultAddPrincipalToAssumeRole(p, doc);
    }
  }

  public get policyFragment(): PrincipalPolicyFragment {
    // We only have a problem with conditions if we are trying to render composite
    // princpals into a single statement (which is when `policyFragment` would get called)
    for (const p of this.principals) {
      const fragment = p.policyFragment;
      if (fragment.conditions && Object.keys(fragment.conditions).length > 0) {
        throw new Error(
          'Components of a CompositePrincipal must not have conditions. ' +
          `Tried to add the following fragment: ${JSON.stringify(fragment)}`);
      }
    }

    const principalJson: { [key: string]: string[] } = {};

    for (const p of this.principals) {
      mergePrincipal(principalJson, p.policyFragment.principalJson);
    }

    return new PrincipalPolicyFragment(principalJson);
  }

  public toString() {
    return `CompositePrincipal(${this.principals})`;
  }

  public dedupeString(): string | undefined {
    const inner = this.principals.map(ComparablePrincipal.dedupeStringFor);
    if (inner.some(x => x === undefined)) { return undefined; }
    return `CompositePrincipal[${inner.join(',')}]`;
  }
}

/**
 * A lazy token that requires an instance of Stack to evaluate
 */
class StackDependentToken implements cdk.IResolvable {
  public readonly creationStack: string[];
  constructor(private readonly fn: (stack: cdk.Stack) => any) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(context: cdk.IResolveContext) {
    return this.fn(cdk.Stack.of(context.scope));
  }

  public toString() {
    return cdk.Token.asString(this);
  }

  /**
   * JSON-ify the token
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    return '<unresolved-token>';
  }
}

class ServicePrincipalToken implements cdk.IResolvable {
  public readonly creationStack: string[];
  constructor(
    private readonly service: string,
    private readonly opts: ServicePrincipalOpts) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(ctx: cdk.IResolveContext) {
    return cdk.FeatureFlags.of(ctx.scope).isEnabled(cxapi.IAM_STANDARDIZED_SERVICE_PRINCIPALS)
      ? this.newStandardizedBehavior(ctx)
      : this.legacyBehavior(ctx);

    // The correct behavior is to always use the global service principal
  }

  /**
   * Return the global (original) service principal, and a second one if region is given and points to an opt-in region
   */
  private newStandardizedBehavior(ctx: cdk.IResolveContext) {
    const stack = cdk.Stack.of(ctx.scope);
    if (
      this.opts.region &&
      !cdk.Token.isUnresolved(this.opts.region) &&
      stack.region !== this.opts.region &&
      RegionInfo.get(this.opts.region).isOptInRegion
    ) {
      return this.service.replace(/\.amazonaws\.com$/, `.${this.opts.region}.amazonaws.com`);
    }
    return this.service;
  }

  /**
   * Do a single lookup
   */
  private legacyBehavior(ctx: cdk.IResolveContext) {
    if (this.opts.region) {
      // Special case, handle it separately to not break legacy behavior.
      return RegionInfo.get(this.opts.region).servicePrincipal(this.service) ??
        Default.servicePrincipal(this.service, this.opts.region, cdk.Aws.URL_SUFFIX);
    }

    const stack = cdk.Stack.of(ctx.scope);
    return stack.regionalFact(
      FactName.servicePrincipal(this.service),
      Default.servicePrincipal(this.service, stack.region, cdk.Aws.URL_SUFFIX),
    );
  }

  public toString() {
    return cdk.Token.asString(this, {
      displayHint: this.service,
    });
  }

  /**
   * JSON-ify the token
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
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
export function validateConditionObject(x: unknown): asserts x is Record<string, unknown> {
  if (!x || typeof x !== 'object' || Array.isArray(x)) {
    throw new Error('A Condition should be represented as a map of operator to value');
  }
}
