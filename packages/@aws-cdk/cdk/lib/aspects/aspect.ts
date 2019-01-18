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
  visitTree(node: IConstruct): void;
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
  public visitTree(construct: IConstruct): void {
    for (const child of construct.node.findAll()) {
      if (this.visitedBy[child.node.uniqueId] === true) {
        return;
      }
      this.visitedBy[child.node.uniqueId] = true;
      this.visit(child);
    }
  }

  /**
   * This is the function concrete Aspects should implement
   *
   * The ``visit()`` function will call this method to invoke the customized
   * apsect actions.
   */
  protected abstract visit(construct: IConstruct): void;
}
