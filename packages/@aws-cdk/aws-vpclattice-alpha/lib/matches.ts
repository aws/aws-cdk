import * as vpclattice from './index';

/**
 * Properties to Create A HeaderMatch
 */
export interface HeaderMatch {
  /**
  * the name of the header to match
  */
  readonly headername: string,
  /**
  * Should the match be case sensitive?
  * @default true
  */
  readonly caseSensitive?: boolean,
  /**
  * Type of match to make
  */
  readonly matchOperator: vpclattice.MatchOperator,
  /**
  * Value to match against
  */
  readonly matchValue: string,
}

/**
 * Properties to create a PathMatch
 */
export interface PathMatch {
  /**
	 * Should the match be case sensitive?
	 * @default true
	 */
  readonly caseSensitive?: boolean,
  /**
	 * Type of match to make
   * @default vpcLattice.PathMatchType.EXACT
	 */
  readonly pathMatchType?: vpclattice.PathMatchType,
  /**
	 * Value to match against
	 */
  readonly path: string,
}

/**
 * Properties to create a Method Match
 */
// export interface MethodMatch {
//   /**
// 	 * An Http Method eg GET, POST, PUT, DELETE
// 	 */
//   readonly httpMethod: vpclattice.HTTPMethods
// }
