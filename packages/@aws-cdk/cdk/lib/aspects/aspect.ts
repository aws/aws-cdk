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
 * TODO: description
 */
export abstract class Aspect implements IAspect {
  public abstract readonly type: string;
  private readonly visitedBy: {[id: string]: boolean} = {};

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

  protected abstract visitAction(construct: IConstruct): void;
}
