import { MatchOperator, PathMatchType } from './index';
/**
 * Properties to Create A HeaderMatch
 */
export interface HeaderMatch {
    /**
    * the name of the header to match
    */
    readonly headername: string;
    /**
    * Should the match be case sensitive?
    * @default true
    */
    readonly caseSensitive?: boolean;
    /**
    * Type of match to make
    */
    readonly matchOperator: MatchOperator;
    /**
    * Value to match against
    */
    readonly matchValue: string;
}
/**
 * Properties to create a PathMatch
 */
export interface PathMatch {
    /**
       * Should the match be case sensitive?
       * @default true
       */
    readonly caseSensitive?: boolean;
    /**
       * Type of match to make
     * @default PathMatchType.EXACT
       */
    readonly pathMatchType?: PathMatchType;
    /**
       * Value to match against
       */
    readonly path: string;
}
/**
 * Properties to create a Method Match
 */
