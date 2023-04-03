import { Construct } from 'constructs';
import { ISynthesisSession } from '../stack-synthesizers';
/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 */
export declare class TreeMetadata extends Construct {
    constructor(scope: Construct);
    /**
     * Create tree.json
     * @internal
     */
    _synthesizeTree(session: ISynthesisSession): void;
    private synthAttributes;
}
