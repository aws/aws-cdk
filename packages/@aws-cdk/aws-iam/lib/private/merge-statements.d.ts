import { IConstruct } from 'constructs';
import { PolicyStatement } from '../policy-statement';
/**
 * Options for the mergeStatement command
 */
export interface MergeStatementOptions {
    /**
     * Scope to derive configuration flags from
     */
    readonly scope: IConstruct;
    /**
     * Do not merge statements if the result would be bigger than MAX_MERGE_SIZE
     *
     * @default false
     */
    readonly limitSize?: boolean;
    /**
     * Merge statements if they can be combined to produce the same effects.
     *
     * If false, statements are only merged if they are exactly equal.
     *
     * @default true
     */
    readonly mergeIfCombinable?: boolean;
}
/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 *
 * We compare and merge all pairs of statements (O(N^2) complexity), opportunistically
 * merging them. This is not guaranteed to produce the optimal output, but it's probably
 * Good Enough(tm). If it merges anything, it's at least going to produce a smaller output
 * than the input.
 */
export declare function mergeStatements(statements: PolicyStatement[], options: MergeStatementOptions): MergeStatementResult;
export interface MergeStatementResult {
    /**
     * The list of maximally merged statements
     */
    readonly mergedStatements: PolicyStatement[];
    /**
     * Mapping of old to new statements
     */
    readonly originsMap: Map<PolicyStatement, PolicyStatement[]>;
}
