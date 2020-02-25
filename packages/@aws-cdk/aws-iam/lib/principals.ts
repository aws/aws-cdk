import * as cdk from '@aws-cdk/core';
import { Default, RegionInfo } from '@aws-cdk/region-info';
import { PolicyStatement } from './policy-statement';
import { mergePrincipal } from './util';

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
   * Add to the policy of this principal.
   *
   * @returns true if the statement was added, false if the principal in
   * question does not have a policy document to add the statement to.
   */
  addToPolicy(statement: PolicyStatement): boolean;
}

/**
 * Base class for policy principals
 */
export abstract class PrincipalBase implements IPrincipal {
  public readonly grantPrincipal: IPrincipal = this;

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  public abstract readonly policyFragment: PrincipalPolicyFragment;

  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  public readonly assumeRoleAction: string = 'sts:AssumeRole';

  public addToPolicy(_statement: PolicyStatement): boolean {
    // This base class is used for non-identity principals. None of them
    // have a PolicyDocument to add to.
    return false;
  }

  public toString() {
    // This is a first pass to make the object readable. Descendant principals
    // should return something nicer.
    return JSON.stringify(this.policyFragment.principalJson);
  }

  public toJSON() {
    // Have to implement toJSON() because the default will lead to infinite recursion.
    return this.policyFragment.principalJson;
  }
}

/**
 * A collection of the fields in a PolicyStatement that can be used to identify a principal.
 *
 * This consists of the JSON used in the "Principal" field, and optionally a
 * set of "Condition"s that need to be applied to the policy.
 */
export class PrincipalPolicyFragment {
  constructor(
    public readonly principalJson: { [key: string]: string[] },
    public readonly conditions: { [key: string]: any } = { }) {
  }
}

export class ArnPrincipal extends PrincipalBase {
  constructor(public readonly arn: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ AWS: [ this.arn ] });
  }

  public toString() {
    return `ArnPrincipal(${this.arn})`;
  }
}

export class AccountPrincipal extends ArnPrincipal {
  constructor(public readonly accountId: any) {
    super(new StackDependentToken(stack => `arn:${stack.partition}:iam::${accountId}:root`).toString());
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
   * The region in which the service is operating.
   *
   * @default the current Stack's region.
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
  constructor(public readonly service: string, private readonly opts: ServicePrincipalOpts = {}) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({
      Service: [
        new ServicePrincipalToken(this.service, this.opts).toString()
      ]
    }, this.opts.conditions);
  }

  public toString() {
    return `ServicePrincipal(${this.service})`;
  }
}

/**
 * A principal that represents an AWS Organization
 */
export class OrganizationPrincipal extends PrincipalBase {
  constructor(public readonly organizationId: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment(
      { AWS: ['*'] },
      { StringEquals: { 'aws:PrincipalOrgID': this.organizationId } }
    );
  }

  public toString() {
    return `OrganizationPrincipal(${this.organizationId})`;
  }
}

/**
 * A policy prinicipal for canonicalUserIds - useful for S3 bucket policies that use
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
  constructor(public readonly canonicalUserId: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ CanonicalUser: [ this.canonicalUserId ] });
  }

  public toString() {
    return `CanonicalUserPrincipal(${this.canonicalUserId})`;
  }
}

export class FederatedPrincipal extends PrincipalBase {
  public readonly assumeRoleAction: string;

  constructor(
    public readonly federated: string,
    public readonly conditions: {[key: string]: any},
    assumeRoleAction: string = 'sts:AssumeRole') {
    super();

    this.assumeRoleAction = assumeRoleAction;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [ this.federated ] }, this.conditions);
  }

  public toString() {
    return `FederatedPrincipal(${this.federated})`;
  }
}

export class AccountRootPrincipal extends AccountPrincipal {
  constructor() {
    super(new StackDependentToken(stack => stack.account).toString());
  }

  public toString() {
    return `AccountRootPrincipal()`;
  }
}

/**
 * A principal representing all identities in all accounts
 */
export class AnyPrincipal extends ArnPrincipal {
  constructor() {
    super('*');
  }

  public toString() {
    return `AnyPrincipal()`;
  }
}

/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
export class Anyone extends AnyPrincipal { }

export class CompositePrincipal extends PrincipalBase {
  public readonly assumeRoleAction: string;
  private readonly principals = new Array<PrincipalBase>();

  constructor(...principals: PrincipalBase[]) {
    super();
    if (principals.length === 0) {
      throw new Error('CompositePrincipals must be constructed with at least 1 Principal but none were passed.');
    }
    this.assumeRoleAction = principals[0].assumeRoleAction;
    this.addPrincipals(...principals);
  }

  public addPrincipals(...principals: PrincipalBase[]): this {
    for (const p of principals) {
      if (p.assumeRoleAction !== this.assumeRoleAction) {
        throw new Error(
          `Cannot add multiple principals with different "assumeRoleAction". ` +
          `Expecting "${this.assumeRoleAction}", got "${p.assumeRoleAction}"`);
      }

      const fragment = p.policyFragment;
      if (fragment.conditions && Object.keys(fragment.conditions).length > 0) {
        throw new Error(
          `Components of a CompositePrincipal must not have conditions. ` +
          `Tried to add the following fragment: ${JSON.stringify(fragment)}`);
      }

      this.principals.push(p);
    }

    return this;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    const principalJson: { [key: string]: string[] } = { };

    for (const p of this.principals) {
      mergePrincipal(principalJson, p.policyFragment.principalJson);
    }

    return new PrincipalPolicyFragment(principalJson);
  }

  public toString() {
    return `CompositePrincipal(${this.principals})`;
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

  public toJSON() {
    return `<unresolved-token>`;
  }
}

class ServicePrincipalToken implements cdk.IResolvable {
  public readonly creationStack: string[];
  constructor(private readonly service: string,
              private readonly opts: ServicePrincipalOpts) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(ctx: cdk.IResolveContext) {
    const region = this.opts.region || cdk.Stack.of(ctx.scope).region;
    const fact = RegionInfo.get(region).servicePrincipal(this.service);
    return fact || Default.servicePrincipal(this.service, region, cdk.Aws.URL_SUFFIX);
  }

  public toString() {
    return cdk.Token.asString(this, {
      displayHint: this.service
    });
  }

  public toJSON() {
    return `<${this.service}>`;
  }
}
