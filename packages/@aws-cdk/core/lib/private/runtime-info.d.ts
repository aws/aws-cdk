import { IConstruct } from 'constructs';
import { Stack } from '../stack';
/**
 * Source information on a construct (class fqn and version)
 */
export interface ConstructInfo {
    readonly fqn: string;
    readonly version: string;
}
export declare function constructInfoFromConstruct(construct: IConstruct): ConstructInfo | undefined;
/**
 * For a given stack, walks the tree and finds the runtime info for all constructs within the tree.
 * Returns the unique list of construct info present in the stack,
 * as long as the construct fully-qualified names match the defined allow list.
 */
export declare function constructInfoFromStack(stack: Stack): ConstructInfo[];
