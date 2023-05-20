import * as vpclattice from './index';

/**
 * Properties to Create A HeaderMatch
 */
export interface HeaderMatch {
  /**
  * the name of the header to match
  */
  headername: string,
  /**
  * Should the match be case sensitive?
  * @default true
  */
  caseSensitive?: boolean,
  /**
  * Type of match to make
  */
  matchOperator: vpclattice.MatchOperator,
  /**
  * Value to match against
  */
  matchValue: string,
}

/**
 * Properties to create a PathMatch
 */
export interface PathMatch {
  /**
	 * Should the match be case sensitive?
	 * @default true
	 */
  caseSensitive?: boolean,
  /**
	 * Type of match to make
	 */
  pathMatchType: vpclattice.PathMatchType,
  /**
	 * Value to match against
	 */
  matchValue: string,
}

/**
 * Properties to create a Method Match
 */
export interface MethodMatch {
  /**
	 * An Http Method eg GET, POST, PUT, DELETE
	 */
  httpMethod: vpclattice.HTTPMethods
}
