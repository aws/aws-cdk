import { IConstruct } from '../core/construct';

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * All aspects can visit by IConstructs
   */
  visit(node: IConstruct): void;
}

/**
 * The representation of an Apect
 */
export abstract class Aspect implements IAspect {
  /**
   * The type of the aspect
   */
  public abstract readonly type: string;

  /**
   * This is the function concrete Aspects should implement
   *
   * The ``visit()`` function will call this method to invoke the customized
   * apsect actions.
   */
  public abstract visit(construct: IConstruct): void;
}
