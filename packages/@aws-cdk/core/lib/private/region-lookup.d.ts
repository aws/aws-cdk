import { Stack } from '../stack';
/**
 * Make sure a CfnMapping exists in the given stack with the lookup values for the given fact
 *
 * Add to an existing CfnMapping if possible.
 */
export declare function deployTimeLookup(stack: Stack, factName: string, lookupMap: Record<string, string>, defaultValue?: string): string;
