import * as cdk from '@aws-cdk/core';
import { Dependable, IConstruct, IDependable } from 'constructs';
import { PolicyStatement } from './policy-statement';
import { IGrantable, IPrincipal } from './principals';

/**
 * Basic options for a grant operation
 *
 */
export interface CommonGrantOptions {
  /**
   * The principal to grant to
   *
   * @default if principal is undefined, no work is done.
   */
  readonly grantee: IGrantable;

  /**
   * The actions to grant
   */
  readonly actions: string[];

  /**
   * The resource ARNs to grant to
   */
  readonly resourceArns: string[];

  /**
   * Any conditions to attach to the grant
   *
   * @default - No conditions
   */
  readonly conditions?: Record<string, Record<string, unknown>>;
}

/**
 * Options for a grant operation
 *
 */
export interface GrantWithResourceOptions extends CommonGrantOptions {
  /**
   * The resource with a resource policy
   *
   * The statement will be added to the resource policy if it couldn't be
   * added to the principal policy.
   */
  readonly resource: IResourceWithPolicy;

  /**
   * When referring to the resource in a resource policy, use this as ARN.
   *
   * (Depending on the resource type, this needs to be '*' in a resource policy).
   *
   * @default Same as regular resource ARNs
   */
  readonly resourceSelfArns?: string[];
}

/**
 * Options for a grant operation that only applies to principals
 *
 */
export interface GrantOnPrincipalOptions extends CommonGrantOptions {
  /**
   * Construct to report warnings on in case grant could not be registered
   *
   * @default - the construct in which this construct is defined
   */
  readonly scope?: IConstruct;
}

/**
 * Options for a grant operation to both identity and resource
 *
 */
export interface GrantOnPrincipalAndResourceOptions extends CommonGrantOptions {
  /**
   * The resource with a resource policy
   *
   * The statement will always be added to the resource policy.
   */
  readonly resource: IResourceWithPolicy;

  /**
   * When referring to the resource in a resource policy, use this as ARN.
   *
   * (Depending on the resource type, this needs to be '*' in a resource policy).
   *
   * @default Same as regular resource ARNs
   */
  readonly resourceSelfArns?: string[];

  /**
   * The principal to use in the statement for the resource policy.
   *
   * @default - the principal of the grantee will be used
   */
  readonly resourcePolicyPrincipal?: IPrincipal;
}

/**
 * Result of a grant() operation
 *
 * This class is not instantiable by consumers on purpose, so that they will be
 * required to call the Grant factory functions.
 */
export class Grant implements IDependable {
  /**
   * Grant the given permissions to the principal
   *
   * The permissions will be added to the principal policy primarily, falling
   * back to the resource policy if necessary. The permissions must be granted
   * somewhere.
   *
   * - Trying to grant permissions to a principal that does not admit adding to
   *   the principal policy while not providing a resource with a resource policy
   *   is an error.
   * - Trying to grant permissions to an absent principal (possible in the
   *   case of imported resources) leads to a warning being added to the
   *   resource construct.
   */
  public static addToPrincipalOrResource(options: GrantWithResourceOptions): Grant {
    const result = Grant.addToPrincipal({
      ...options,
      scope: options.resource,
    });

    const resourceAndPrincipalAccountComparison = options.grantee.grantPrincipal.principalAccount
      ? cdk.Token.compareStrings(options.resource.env.account, options.grantee.grantPrincipal.principalAccount)
      : undefined;
    // if both accounts are tokens, we assume here they are the same
    const equalOrBothUnresolved = resourceAndPrincipalAccountComparison === cdk.TokenComparison.SAME
      || resourceAndPrincipalAccountComparison == cdk.TokenComparison.BOTH_UNRESOLVED;
    const sameAccount: boolean = resourceAndPrincipalAccountComparison
      ? equalOrBothUnresolved
      // if the principal doesn't have an account (for example, a service principal),
      // we should modify the resource's trust policy
      : false;
    // If we added to the principal AND we're in the same account, then we're done.
    // If not, it's a different account and we must also add a trust policy on the resource.
    if (result.success && sameAccount) {
      return result;
    }

    const statement = new PolicyStatement({
      actions: options.actions,
      resources: (options.resourceSelfArns || options.resourceArns),
      principals: [options.grantee!.grantPrincipal],
    });

    const resourceResult = options.resource.addToResourcePolicy(statement);

    return new Grant({
      resourceStatement: statement,
      options,
      policyDependable: resourceResult.statementAdded ? resourceResult.policyDependable ?? options.resource : undefined,
    });
  }

  /**
   * Try to grant the given permissions to the given principal
   *
   * Absence of a principal leads to a warning, but failing to add
   * the permissions to a present principal is not an error.
   */
  public static addToPrincipal(options: GrantOnPrincipalOptions): Grant {
    const statement = new PolicyStatement({
      actions: options.actions,
      resources: options.resourceArns,
      conditions: options.conditions,
    });

    const addedToPrincipal = options.grantee.grantPrincipal.addToPrincipalPolicy(statement);
    if (!addedToPrincipal.statementAdded) {
      return new Grant({ principalStatement: undefined, options });
    }

    if (!addedToPrincipal.policyDependable) {
      throw new Error('Contract violation: when Principal returns statementAdded=true, it should return a dependable');
    }

    return new Grant({ principalStatement: statement, options, policyDependable: addedToPrincipal.policyDependable });
  }

  /**
   * Add a grant both on the principal and on the resource
   *
   * As long as any principal is given, granting on the principal may fail (in
   * case of a non-identity principal), but granting on the resource will
   * never fail.
   *
   * Statement will be the resource statement.
   */
  public static addToPrincipalAndResource(options: GrantOnPrincipalAndResourceOptions): Grant {
    const result = Grant.addToPrincipal({
      ...options,
      scope: options.resource,
    });

    const statement = new PolicyStatement({
      actions: options.actions,
      resources: (options.resourceSelfArns || options.resourceArns),
      principals: [options.resourcePolicyPrincipal || options.grantee!.grantPrincipal],
    });

    const resourceResult = options.resource.addToResourcePolicy(statement);
    const resourceDependable = resourceResult.statementAdded ? resourceResult.policyDependable ?? options.resource : undefined;

    return new Grant({
      principalStatement: statement,
      resourceStatement: result.resourceStatement,
      options,
      policyDependable: resourceDependable ? new CompositeDependable(result, resourceDependable) : result,
    });
  }

  /**
   * Returns a "no-op" `Grant` object which represents a "dropped grant".
   *
   * This can be used for e.g. imported resources where you may not be able to modify
   * the resource's policy or some underlying policy which you don't know about.
   *
   * @param grantee The intended grantee
   * @param _intent The user's intent (will be ignored at the moment)
   */
  public static drop(grantee: IGrantable, _intent: string): Grant {
    return new Grant({
      options: { grantee, actions: [], resourceArns: [] },
    });
  }

  /**
   * The statement that was added to the principal's policy
   *
   * @deprecated Use `principalStatements` instead
   */
  public readonly principalStatement?: PolicyStatement;

  /**
   * The statements that were added to the principal's policy
   */
  public readonly principalStatements = new Array<PolicyStatement>();

  /**
   * The statement that was added to the resource policy
   *
   * @deprecated Use `resourceStatements` instead
   */
  public readonly resourceStatement?: PolicyStatement;

  /**
   * The statements that were added to the principal's policy
   */
  public readonly resourceStatements = new Array<PolicyStatement>();

  /**
   * The options originally used to set this result
   *
   * Private member doubles as a way to make it impossible for an object literal to
   * be structurally the same as this class.
   */
  private readonly options: CommonGrantOptions;

  private readonly dependables = new Array<IDependable>();

  private constructor(props: GrantProps) {
    this.options = props.options;
    this.principalStatement = props.principalStatement;
    this.resourceStatement = props.resourceStatement;
    if (this.principalStatement) {
      this.principalStatements.push(this.principalStatement);
    }
    if (this.resourceStatement) {
      this.resourceStatements.push(this.resourceStatement);
    }
    if (props.policyDependable) {
      this.dependables.push(props.policyDependable);
    }

    const self = this;
    Dependable.implement(this, {
      get dependencyRoots() {
        return Array.from(new Set(self.dependables.flatMap(d => Dependable.of(d).dependencyRoots)));
      },
    });
  }

  /**
   * Whether the grant operation was successful
   */
  public get success(): boolean {
    return this.principalStatement !== undefined || this.resourceStatement !== undefined;
  }

  /**
   * Throw an error if this grant wasn't successful
   */
  public assertSuccess(): void {
    if (!this.success) {
      // eslint-disable-next-line max-len
      throw new Error(`${describeGrant(this.options)} could not be added on either identity or resource policy.`);
    }
  }

  /**
   * Make sure this grant is applied before the given constructs are deployed
   *
   * The same as construct.node.addDependency(grant), but slightly nicer to read.
   */
  public applyBefore(...constructs: IConstruct[]) {
    for (const construct of constructs) {
      construct.node.addDependency(this);
    }
  }

  /**
   * Combine two grants into a new one
   */
  public combine(rhs: Grant) {
    const combinedPrinc = [...this.principalStatements, ...rhs.principalStatements];
    const combinedRes = [...this.resourceStatements, ...rhs.resourceStatements];

    const ret = new Grant({
      options: this.options,
      principalStatement: combinedPrinc[0],
      resourceStatement: combinedRes[0],
    });
    ret.principalStatements.splice(0, ret.principalStatements.length, ...combinedPrinc);
    ret.resourceStatements.splice(0, ret.resourceStatements.length, ...combinedRes);
    ret.dependables.push(...this.dependables, ...rhs.dependables);
    return ret;
  }
}

function describeGrant(options: CommonGrantOptions) {
  return `Permissions for '${options.grantee}' to call '${options.actions}' on '${options.resourceArns}'`;
}

interface GrantProps {
  readonly options: CommonGrantOptions;
  readonly principalStatement?: PolicyStatement;
  readonly resourceStatement?: PolicyStatement;

  /**
   * Constructs whose deployment applies the grant
   *
   * Used to add dependencies on grants
   */
  readonly policyDependable?: IDependable;
}

/**
 * A resource with a resource policy that can be added to
 */
export interface IResourceWithPolicy extends cdk.IResource {
  /**
   * Add a statement to the resource's resource policy
   */
  addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult;
}

/**
 * Result of calling addToResourcePolicy
 */
export interface AddToResourcePolicyResult {
  /**
   * Whether the statement was added
   */
  readonly statementAdded: boolean;

  /**
   * Dependable which allows depending on the policy change being applied
   *
   * @default - If `statementAdded` is true, the resource object itself.
   * Otherwise, no dependable.
   */
  readonly policyDependable?: IDependable;
}

/**
 * Composite dependable
 *
 * Not as simple as eagerly getting the dependency roots from the
 * inner dependables, as they may be mutable so we need to defer
 * the query.
 */
export class CompositeDependable implements IDependable {
  constructor(...dependables: IDependable[]) {
    Dependable.implement(this, {
      get dependencyRoots(): IConstruct[] {
        return Array.prototype.concat.apply([], dependables.map(d => Dependable.of(d).dependencyRoots));
      },
    });
  }
}
