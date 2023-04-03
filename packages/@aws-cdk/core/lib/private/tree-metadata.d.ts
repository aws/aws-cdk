import { Construct } from 'constructs';
import { ConstructInfo } from './runtime-info';
import { ISynthesisSession } from '../stack-synthesizers';
/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 */
export declare class TreeMetadata extends Construct {
    private _tree?;
    constructor(scope: Construct);
    /**
     * Create tree.json
     * @internal
     */
    _synthesizeTree(session: ISynthesisSession): void;
    /**
     * This gets a specific "branch" of the tree for a given construct path.
     * It will return the root Node of the tree with non-relevant branches filtered
     * out (i.e. node children that don't traverse to the given construct path)
     *
     * @internal
     */
    _getNodeBranch(constructPath: string): Node | undefined;
    private synthAttributes;
}
export interface Node {
    readonly id: string;
    readonly path: string;
    readonly parent?: Node;
    readonly children?: {
        [key: string]: Node;
    };
    readonly attributes?: {
        [key: string]: any;
    };
    /**
     * Information on the construct class that led to this node, if available
     */
    readonly constructInfo?: ConstructInfo;
}
