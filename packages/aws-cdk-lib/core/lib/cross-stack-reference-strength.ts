import type { IConstruct } from 'constructs';
import * as cxapi from '../../cx-api';

/**
 * Controls how cross-stack references to a resource are resolved.
 */
export enum ReferenceStrength {
  /**
   * Strong reference: uses CloudFormation Export/Import (same region)
   * or ExportWriter/ExportReader custom resources (cross-region).
   *
   * The producing stack cannot be deleted while consumers exist.
   */
  STRONG = 'strong',

  /**
   * Weak reference: uses Fn::GetStackOutput to read an output directly
   * from the producing stack.
   *
   * The producing stack or resource can be deleted independently of consumers.
   * This will cause infrastructure in consuming stacks to temporarily reference a nonexistant
   * resource until the consumers are updated as well, causing any accesses in that time
   * frame to fail.
   *
   * Strong references prevent this.
   */
  WEAK = 'weak',

  /**
   * Both strong and weak mechanisms are created (transitional state).
   *
   * Use this when migrating from strong to weak. The producer keeps the
   * strong-side artifacts and also adds a plain Output. The consumer
   * switches to Fn::GetStackOutput.
   */
  BOTH = 'both',
}

/**
 * Manages cross-stack reference settings for a construct.
 */
export class CrossStackReferences {
  /**
   * Returns a `CrossStackReferences` object for the given construct.
   *
   * @param scope The construct to configure.
   */
  public static of(scope: IConstruct): CrossStackReferences {
    return new CrossStackReferences(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  /**
   * Set the cross-stack reference strength for this construct.
   *
   * When set, any cross-stack reference to this construct will use the specified
   * mechanism instead of the global default. This is useful for selectively
   * weakening specific references to avoid the "deadly embrace" problem without
   * changing the app-wide default.
   *
   * @param value - The reference strength to use.
   */
  public strength(value: ReferenceStrength): void {
    this.scope.node.setContext(cxapi.DEFAULT_CROSS_STACK_REFERENCES, value);
  }
}
