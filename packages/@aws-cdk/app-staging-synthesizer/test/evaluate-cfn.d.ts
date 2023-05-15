/**
 * Simple function to evaluate CloudFormation intrinsics.
 *
 * Note that this function is not production quality, it exists to support tests.
 */
export declare function evaluateCFN(object: any, context?: {
    [key: string]: string;
}): any;
