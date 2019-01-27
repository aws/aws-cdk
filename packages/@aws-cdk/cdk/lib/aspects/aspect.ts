import { IConstruct } from '../core/construct';

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * All aspects can visit a IConstruct
   */
  visit(node: IConstruct): void;
}
