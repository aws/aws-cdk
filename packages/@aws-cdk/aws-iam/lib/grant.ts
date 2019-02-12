import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from "./policy-document";
import { IPrincipal } from "./principals";

/**
 * Properties for a grant operation
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
   * If we wanted to add to the resource policy but there is no resource, ignore the error.
   *
   * @default false
   */
  skipResourcePolicy?: boolean;

  /**
   * Construct to report warnings on in case grant could not be registered
   *
   * @default resource
   */
  scope?: cdk.IConstruct;
}

export class Permissions {
  /**
   * Helper function to implement grants.
   *
   * The pattern is the same every time. We try to add to the principal
   * first, then add to the resource afterwards.
   */
  public static grant(options: GrantOptions): GrantResult {
    let addedToPrincipal = false;
    let addedToResource = false;

    const scope = options.scope || options.resource;
    if (!scope) {
      throw new Error(`Either 'scope' or 'resource' must be supplied.`);
    }

    // One-iteration loop to be able to skip to end of function easily
    do {
      if (!options.principal) {
        // tslint:disable-next-line:max-line-length
        scope.node.addWarning(`Could not add grant for '${options.actions}' on '${options.resourceArns}' because the principal was not available. Add the permissions by hand.`);
        break;
      }

      addedToPrincipal = options.principal.addToPolicy(new PolicyStatement()
        .addActions(...options.actions)
        .addResources(...options.resourceArns));

      if (addedToPrincipal || options.skipResourcePolicy) { break; }

      if (!options.resource) {
        throw new Error('Could not add permissions to Principal without policy, and resource does not have policy either. Grant to a Role instead.');
      }

      options.resource.addToResourcePolicy(new PolicyStatement()
        .addActions(...options.actions)
        .addResources(...(options.resourceSelfArns || options.resourceArns))
        .addPrincipal(options.principal));
      addedToResource = true;

    } while (false);

    return { addedToPrincipal, addedToResource };
  }
}

/**
 * The result of the grant() operation
 */
export interface GrantResult {
  /**
   * The grant was added to the principal's policy
   */
  addedToPrincipal: boolean;

  /**
   * The grant was added to the resource policy
   */
  addedToResource: boolean;
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