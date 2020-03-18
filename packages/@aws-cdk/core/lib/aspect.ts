import { IConstruct } from './construct-compat';

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * All aspects can visit an IConstruct
   */
  visit(node: IConstruct): void;
}
