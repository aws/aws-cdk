import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from "./policy-document";
import { IPrincipal } from "./principals";

/**
 * Options for a grant operation
 */
export interface GrantOptions {
  /**
   * The principal to grant to
   *
   * @default No work is done
   */
  principal: IPrincipal | undefined;

  /**
   * The actions to grant
   */
  actions: string[];

  /**
   * The resource ARNs to grant to
   */
  resourceArns: string[];

  /**
   * Adder to the resource policy
   *
   * Either 'scope' or 'resource' must be supplied.
   *
   * An error will be thrown if the policy could not be added to the principal,
   * no resource is supplied given and `skipResourcePolicy` is false.
   */
  resource?: IResourceWithPolicy;

  /**
   * When referring to the resource in a resource policy, use this as ARN.
   *
   * (Depending on the resource type, this needs to be '*' in a resource policy).
   *
   * @default Same as regular resource ARNs
   */
  resourceSelfArns?: string[];

  /**
   * Construct to report warnings on in case grant could not be registered
   *
   * @default resource
   */
  scope?: cdk.IConstruct;
}

/**
 * Options for a tryGrant operation
 */
export interface TryGrantOnIdentityOptions {
  /**
   * The principal to grant to
   *
   * @default No work is done
   */
  principal: IPrincipal | undefined;

  /**
   * The actions to grant
   */
  actions: string[];

  /**
   * The resource ARNs to grant to
   */
  resourceArns: string[];

  /**
   * Construct to report warnings on in case grant could not be registered
   */
  scope: cdk.IConstruct;
}

/**
 * Options for a grant operation to both identity and resource
 */
export interface GrantOnIdentityAndResourceOptions {
  /**
   * The principal to grant to
   *
   * @default No work is done
   */
  principal: IPrincipal | undefined;

  /**
   * The actions to grant
   */
  actions: string[];

  /**
   * The resource ARNs to grant to
   */
  resourceArns: string[];

  /**
   * Adder to the resource policy
   *
   * Either 'scope' or 'resource' must be supplied.
   *
   * An error will be thrown if the policy could not be added to the principal,
   * no resource is supplied given and `skipResourcePolicy` is false.
   */
  resource: IResourceWithPolicy;

  /**
   * When referring to the resource in a resource policy, use this as ARN.
   *
   * (Depending on the resource type, this needs to be '*' in a resource policy).
   *
   * @default Same as regular resource ARNs
   */
  resourceSelfArns?: string[];
}

export class Permissions {
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
  public static grant(options: GrantOptions): GrantResult {
    const scope = options.scope || options.resource;
    if (!scope) {
      throw new Error(`Either 'scope' or 'resource' must be supplied.`);
    }

    const result = Permissions.tryGrantOnPrincipal({
      actions: options.actions,
      principal: options.principal,
      resourceArns: options.resourceArns,
      scope
    });

    if (result.addedToPrincipal || result.principalMissing) { return result; }

    if (!options.resource) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Neither principal (${options.principal}) nor resource (${scope}) allow adding to policy. Grant to a Role instead.`);
    }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...(options.resourceSelfArns || options.resourceArns))
      .addPrincipal(options.principal!);

    options.resource.addToResourcePolicy(statement);

    return grantResult({ addedToResource: true, statement });
  }

  /**
   * Try to grant the given permissions to the given principal
   *
   * Absence of a principal leads to a warning, but failing to add
   * the permissions to a present principal is not an error.
   */
  public static tryGrantOnPrincipal(options: TryGrantOnIdentityOptions): GrantResult {
    if (!options.principal) {
      // tslint:disable-next-line:max-line-length
      options.scope.node.addWarning(`Could not add grant for '${options.actions}' on '${options.resourceArns}' because the principal was not available. Add the permissions by hand.`);
      return grantResult({ principalMissing: true });
    }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...options.resourceArns);

    const addedToPrincipal = options.principal.addToPolicy(statement);

    return grantResult({ addedToPrincipal, statement: addedToPrincipal ? statement : undefined });
  }

  /**
   * Add a grant both on the principal and on the resource
   *
   * As long as any principal is given, granting on the pricipal may fail (in
   * case of a non-identity principal), but granting on the resource will
   * always be done.
   *
   * Statement will be the resource statement.
   */
  public static grantOnPrincipalAndResource(options: GrantOnIdentityAndResourceOptions): GrantResult {
    const result = Permissions.tryGrantOnPrincipal({
      actions: options.actions,
      principal: options.principal,
      resourceArns: options.resourceArns,
      scope: options.resource
    });

    if (result.principalMissing) { return result; }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...(options.resourceSelfArns || options.resourceArns))
      .addPrincipal(options.principal!);

    options.resource.addToResourcePolicy(statement);

    return grantResult({ addedToPrincipal: result.addedToPrincipal, addedToResource: true, statement });
  }
}

/**
 * The result of the grant() operation
 *
 * This class is not instantiable by consumers on purpose, so that they will be
 * required to call the Permissions.grant() functions.
 */
export class GrantResult {
  /**
   * There was no principal to add the permissions to
   */
  public readonly principalMissing: boolean;

  /**
   * The grant was added to the principal's policy
   */
  public readonly addedToPrincipal: boolean;

  /**
   * The grant was added to the resource policy
   */
  public readonly addedToResource: boolean;

  /**
   * The policy statement that was created for this permission
   *
   * Can be accessed to (e.g.) add additional conditions to the statement.
   *
   * Only set if either addedToPrincipal or addedToResource are true.
   */
  public readonly statement?: PolicyStatement;

  /**
   * Private member to make it impossible to construct object literals that structurally match this type
   */
  private readonly _isGrantResult = true;

  private constructor(props: GrantResultProps) {
    this.principalMissing = !!props.principalMissing;
    this.addedToPrincipal = !!props.addedToPrincipal;
    this.addedToResource = !!props.addedToResource;
    this.statement = props.statement;
    Array.isArray(this._isGrantResult);
  }
}

/**
 * Instantiate a grantResult (which is normally not instantiable)
 */
function grantResult(props: GrantResultProps): GrantResult {
  return Reflect.construct(GrantResult, [props]);
}

interface GrantResultProps {
  principalMissing?: boolean;
  addedToPrincipal?: boolean;
  addedToResource?: boolean;
  statement?: PolicyStatement;
}

/**
 * A resource with a resource policy that can be added to
 */
export interface IResourceWithPolicy extends cdk.IConstruct {
  /**
   * Add a statement to the resource's resource policy
   */
  addToResourcePolicy(statement: PolicyStatement): void;
}