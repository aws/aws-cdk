import { IConstruct } from '../core/construct';

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * The type of Aspect
   */
  readonly type: string;

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

  private readonly visitedBy: {[id: string]: boolean} = {};

  /**
   * The visit function is invoked during synthesis for each aspect
   *
   * The visit function will visit each child node in the construct tree. Each
   * Node will only be visited once.
   */
  public visit(construct: IConstruct): void {
    if (this.visitedBy[construct.node.uniqueId] === true) {
      return;
    }
    this.visitedBy[construct.node.uniqueId] = true;
    this.visitAction(construct);
    for (const child of construct.node.children) {
      // recurse through all children
      this.visit(child);
    }
  }

  /**
   * This is the function concrete Aspects should implement
   *
   * The ``visit()`` function will call this method to invoke the customized
   * apsect actions.
   */
  protected abstract visitAction(construct: IConstruct): void;
}
