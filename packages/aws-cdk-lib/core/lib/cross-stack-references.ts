import type { IConstruct } from 'constructs';
import { UnscopedValidationError } from './errors';

/**
 * The mechanism used for cross-stack references.
 *
 * CloudFormation natively supports Export/Import for cross-stack references,
 * but these create "strong" references that prevent the exported value from
 * being updated while in use. SSM parameters with dynamic references provide
 * an alternative "soft" reference mechanism that allows values to be updated
 * freely.
 *
 * WARNING: Using SSM references trades "deployment failure" for potential
 * "service disruption". When a producer stack changes an exported value,
 * consumer stacks will pick up the new value on their next deployment,
 * which may cause runtime errors if the new value is incompatible.
 */
export enum CrossStackReferenceType {
  /**
   * Use CloudFormation Exports and Fn::ImportValue.
   *
   * This is the default and creates a "strong" reference that prevents
   * the producer from updating the exported value while it is in use.
   */
  CFN_EXPORTS = 'CFN_EXPORTS',

  /**
   * Use SSM Parameters and `{{resolve:ssm:...}}` dynamic references.
   *
   * This creates a "soft" reference that allows the producer to update
   * the value at any time. The consumer will pick up the new value
   * on its next deployment.
   *
   * WARNING: This trades "deployment failure" for potential "service disruption".
   */
  SSM = 'SSM',
}

const STACK_REFERENCES_SYMBOL = Symbol.for('@aws-cdk/core.StackReferences');

/**
 * Configure how cross-stack references are handled for a given scope.
 *
 * This allows controlling the mechanism used to pass values between stacks
 * at the construct scope level. The configuration applies recursively to
 * all constructs within the scope.
 */
export class StackReferences {
  /**
   * Returns the StackReferences configuration for the given scope.
   */
  public static of(scope: IConstruct): StackReferences {
    let refs = (scope as any)[STACK_REFERENCES_SYMBOL];
    if (!refs) {
      refs = new StackReferences(scope);
      Object.defineProperty(scope, STACK_REFERENCES_SYMBOL, {
        value: refs,
        configurable: false,
        enumerable: false,
      });
    }
    return refs;
  }

  /**
   * Walk up the construct tree from `scope` and return the first
   * toHere() configuration found, or undefined.
   *
   * @internal
   */
  public static _lookupToHere(scope: IConstruct): CrossStackReferenceType[] | undefined {
    let current: IConstruct | undefined = scope;
    while (current) {
      const refs = (current as any)[STACK_REFERENCES_SYMBOL] as StackReferences | undefined;
      if (refs?._toHereTypes) {
        return refs._toHereTypes;
      }
      current = current.node.scope;
    }
    return undefined;
  }

  /**
   * Walk up the construct tree from `scope` and return the first
   * fromHere() configuration found, or undefined.
   *
   * @internal
   */
  public static _lookupFromHere(scope: IConstruct): CrossStackReferenceType[] | undefined {
    let current: IConstruct | undefined = scope;
    while (current) {
      const refs = (current as any)[STACK_REFERENCES_SYMBOL] as StackReferences | undefined;
      if (refs?._fromHereTypes) {
        return refs._fromHereTypes;
      }
      current = current.node.scope;
    }
    return undefined;
  }

  private _toHereTypes?: CrossStackReferenceType[];
  private _fromHereTypes?: CrossStackReferenceType[];

  private constructor(_scope: IConstruct) {
    void(_scope);
  }

  /**
   * Configure how other stacks should reference values produced
   * by constructs within this scope.
   *
   * "toHere" means: "when other stacks reference resources inside this
   * scope, use this mechanism".
   *
   * @param types - The reference mechanism(s) to use. Specify multiple
   * types for migration (e.g., `[CFN_EXPORTS, SSM]` during migration).
   */
  public toHere(types: CrossStackReferenceType[]): void {
    if (types.length === 0) {
      throw new UnscopedValidationError('At least one CrossStackReferenceType must be specified');
    }
    this._toHereTypes = [...types];
  }

  /**
   * Configure how constructs within this scope should reference
   * values from other stacks.
   *
   * "fromHere" means: "when resources inside this scope reference
   * resources in other stacks, use this mechanism".
   *
   * @param types - The reference mechanism(s) to use. Specify multiple
   * types for migration (e.g., `[CFN_EXPORTS, SSM]` during migration).
   */
  public fromHere(types: CrossStackReferenceType[]): void {
    if (types.length === 0) {
      throw new UnscopedValidationError('At least one CrossStackReferenceType must be specified');
    }
    this._fromHereTypes = [...types];
  }
}
