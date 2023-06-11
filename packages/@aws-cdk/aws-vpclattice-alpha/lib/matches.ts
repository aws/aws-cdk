import {
  MatchOperator,
  PathMatchType,
  HTTPMethods,
}
  from './index';
/**
 * An HTTPMatch for creating rules
 * At least one of headermatch, method or patchmatches must be created
 */
export interface HTTPMatch {

  /**
  * Properties to Create A HeaderMatch
  * @default no header match
  */
  headerMatches?: HeaderMatch[] | undefined;
  /**
   * Method to match against
   */
  method?: HTTPMethods | undefined;
  /**
   * Properties to Create A PathMatch
   * @default no path match
   */
  pathMatches?: PathMatch | undefined;
}

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
  readonly matchOperator: MatchOperator,
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
   * @default PathMatchType.EXACT
	 */
  readonly pathMatchType?: PathMatchType,
  /**
	 * Value to match against
	 */
  readonly path: string,
}

/**
 * Properties to create a Method Match
 */
export interface MethodMatch {
  /**
	 * An Http Method eg GET, POST, PUT, DELETE
	 */
  readonly httpMethod: HTTPMethods
}
