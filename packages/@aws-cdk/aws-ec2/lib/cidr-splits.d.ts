/**
 * Return the splits necessary to allocate the given sequence of cidrs in the given order
 *
 * The entire block is of size 'rootNetmask', and subsequent blocks will be allocated
 * from it sized according to the sizes in the 'netmasks' array.
 *
 * The return value is a list of `CidrSplit` objects, which represent
 * invocations of a pair of `Fn.select(Fn.cidr(...))` operations.
 *
 * Strategy: walk through the IP block space, clipping to the next possible
 * start of a block of the given size, then allocate it. Here is an unrealistic
 * example (with a weird ordering of the netmasks to show how clipping and hence
 * space wasting plays out in practice):
 *
 *                               root space  /16
 * ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
 * │                                                                                              │
 *   A  /21             B  /19
 * ┌───┬───┬───┬───┬───────────────┬───────────────┬───┬───────────┬───────────────┬──────────────┐
 * │ A │ A │ A │###│       B       │       B       │ A │###########│       B       │     ....     │
 * └───┴───┴───┴───┴───────────────┴───────────────┴───┴───────────┴───────────────┴──────────────┘
 *              ^^^______ wasted space _________________^^^^^^
 */
export declare function calculateCidrSplits(rootNetmask: number, netmasks: number[]): CidrSplit[];
/**
 * A representation of a pair of `Fn.select(Fn.cidr())` invocations
 */
export interface CidrSplit {
    /**
     * The netmask of this block size
     *
     * This is the inverse number of what you need to pass to Fn.cidr (pass `32 -
     * netmask` to Fn.cidr)`.
     */
    readonly netmask: number;
    /**
     * How many parts the mask needs to be split into
     */
    readonly count: number;
    /**
     * What subnet index to select from the split
     */
    readonly index: number;
}
