import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from './policy-document';
import { mergePrincipal } from './util';

/**
 * Represents an IAM principal.
 *
 * An IAM principal is any object that can have
 */
export interface IPrincipal {
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
   * @returns true if the policy was added, false if the policy could not be added
   */
  addToPolicy(statement: PolicyStatement): boolean;
}

/**
 * Base class for policy principals
 */
export abstract class PrincipalBase implements IPrincipal {
  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  public assumeRoleAction: string = 'sts:AssumeRole';

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  public abstract policyFragment: PrincipalPolicyFragment;

  public addToPolicy(_statement: PolicyStatement): boolean {
    // None of these have a policy to add to
    return false;
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
}

export class AccountPrincipal extends ArnPrincipal {
  constructor(public readonly accountId: any) {
    super(new StackDependentToken(stack => `arn:${stack.partition}:iam::${accountId}:root`).toString());
  }
}

/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
export class ServicePrincipal extends PrincipalBase {
  constructor(public readonly service: string) {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Service: [ this.service ] });
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
}

export class FederatedPrincipal extends PrincipalBase {
  constructor(
    public readonly federated: string,
    public readonly conditions: {[key: string]: any},
    public assumeRoleAction: string = 'sts:AssumeRole') {
    super();
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [ this.federated ] }, this.conditions);
  }
}

export class AccountRootPrincipal extends AccountPrincipal {
  constructor() {
    super(new StackDependentToken(stack => stack.accountId).toString());
  }
}

/**
 * A principal representing all identities in all accounts
 */
export class AnyPrincipal extends ArnPrincipal {
  constructor() {
    super('*');
  }
}

/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
export class Anyone extends AnyPrincipal { }

export class CompositePrincipal extends PrincipalBase {
  private readonly principals = new Array<PrincipalBase>();

  constructor(principal: PrincipalBase, ...additionalPrincipals: PrincipalBase[]) {
    super();
    this.assumeRoleAction = principal.assumeRoleAction;
    this.addPrincipals(principal);
    this.addPrincipals(...additionalPrincipals);
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
}

/**
 * A lazy token that requires an instance of Stack to evaluate
 */
class StackDependentToken extends cdk.Token {
  constructor(private readonly fn: (stack: cdk.Stack) => any) {
    super();
  }

  public resolve(context: cdk.ResolveContext) {
    const stack = cdk.Stack.find(context.scope);
    return this.fn(stack);
  }
}