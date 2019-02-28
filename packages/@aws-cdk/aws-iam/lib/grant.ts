import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from "./policy-document";
import { IPrincipal } from "./principals";

/**
 * Basic options for a grant operation
 */
export interface CommonGrantOptions {
  /**
   * The principal to grant to
   *
   * @default No work is done
   */
  principal?: IPrincipal;

  /**
   * The actions to grant
   */
  actions: string[];

  /**
   * The resource ARNs to grant to
   */
  resourceArns: string[];
}

/**
 * Options for a grant operation
 */
export interface GrantWithResourceOptions extends CommonGrantOptions {
  /**
   * The resource with a resource policy
   *
   * The statement will be added to the resource policy if it couldn't be
   * added to the principal policy.
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

/**
 * Options for a grant operation that only applies to principals
 */
export interface GrantOnPrincipalOptions extends CommonGrantOptions {
  /**
   * Construct to report warnings on in case grant could not be registered
   */
  scope?: cdk.IConstruct;
}

/**
 * Options for a grant operation to both identity and resource
 */
export interface GrantOnPrincipalAndResourceOptions extends CommonGrantOptions {
  /**
   * The resource with a resource policy
   *
   * The statement will always be added to the resource policy.
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
  public static grantWithResource(options: GrantWithResourceOptions): Grant {
    const result = Permissions.grantOnPrincipal({
      ...options,
      scope: options.resource
    });

    if (result.success) { return result; }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...(options.resourceSelfArns || options.resourceArns))
      .addPrincipal(options.principal!);

    options.resource.addToResourcePolicy(statement);

    return grantResult({ addedToResource: true, statement, options });
  }

  /**
   * Try to grant the given permissions to the given principal
   *
   * Absence of a principal leads to a warning, but failing to add
   * the permissions to a present principal is not an error.
   */
  public static grantOnPrincipal(options: GrantOnPrincipalOptions): Grant {
    if (!options.principal) {
      if (options.scope) {
        // tslint:disable-next-line:max-line-length
        options.scope.node.addWarning(`Could not add grant for '${options.actions}' on '${options.resourceArns}' because the principal was not available. Add the permissions by hand.`);
      }
      return grantResult({ principalMissing: true, options });
    }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...options.resourceArns);

    const addedToPrincipal = options.principal.addToPolicy(statement);

    return grantResult({ addedToPrincipal, statement: addedToPrincipal ? statement : undefined, options });
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
  public static grantOnPrincipalAndResource(options: GrantOnPrincipalAndResourceOptions): Grant {
    const result = Permissions.grantOnPrincipal({
      ...options,
      scope: options.resource,
    });

    if (result.principalMissing) { return result; }

    const statement = new PolicyStatement()
      .addActions(...options.actions)
      .addResources(...(options.resourceSelfArns || options.resourceArns))
      .addPrincipal(options.principal!);

    options.resource.addToResourcePolicy(statement);

    return grantResult({ addedToPrincipal: result.addedToPrincipal, addedToResource: true, statement, options });
  }
}

/**
 * The result of the grant() operation
 *
 * This class is not instantiable by consumers on purpose, so that they will be
 * required to call the Permissions.grant() functions.
 */
export class Grant {
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
   * The options originally used to set this result
   *
   * Private member doubles as a way to make it impossible for an object literal to
   * be structurally the same as this class.
   */
  private readonly options: CommonGrantOptions;

  private constructor(props: GrantProps) {
    this.options = props.options;
    this.principalMissing = !!props.principalMissing;
    this.addedToPrincipal = !!props.addedToPrincipal;
    this.addedToResource = !!props.addedToResource;
    this.statement = props.statement;
  }

  /**
   * Whether the grant operation was successful
   */
  public get success(): boolean {
    return this.principalMissing || this.addedToPrincipal || this.addedToResource;
  }

  /**
   * Throw an error if this grant wasn't successful
   */
  public assertSuccess(): void {
    if (!this.success) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`${describeGrant(this.options)} could not be added on either identity or resource policy.`);
    }
  }
}

function describeGrant(options: CommonGrantOptions) {
  return `Permissions for '${options.principal}' to call '${options.actions}' on '${options.resourceArns}'`;
}

/**
 * Instantiate a grantResult (which is normally not instantiable)
 */
function grantResult(props: GrantProps): Grant {
  return Reflect.construct(Grant, [props]);
}

interface GrantProps {
  options: CommonGrantOptions;
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