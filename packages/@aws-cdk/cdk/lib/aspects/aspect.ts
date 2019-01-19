import { IConstruct } from '../core/construct';

export enum AspectVisitType {
  /**
   * The aspect will visit each Construct only once
   */
  Single = 'Single',

  /**
   * The aspect will visit each contruct as manay times as invoked
   */
  Multiple = 'Multiple'
}

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * Aspects invocation pattern
   */
  readonly visitType: AspectVisitType;
  /**
   * All aspects can visit a IConstruct
   */
  visit(node: IConstruct): void;
}
