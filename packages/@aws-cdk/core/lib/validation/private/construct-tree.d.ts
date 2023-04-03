import { Construct, IConstruct } from 'constructs';
import { Node } from '../../private/tree-metadata';
/**
 * A construct centric view of a stack trace
 */
export interface ConstructTrace {
    /**
     * The construct node id
     */
    readonly id: string;
    /**
     * The construct path
     */
    readonly path: string;
    /**
     * The construct trace for the next construct
     * in the trace tree
     *
     * @default - undefined if this is the last construct in the tree
     */
    readonly child?: ConstructTrace;
    /**
     * The name of the construct
     *
     * This will be equal to the fqn so will also include
     * library information
     *
     * @default - undefined if this is a locally defined construct
     */
    readonly construct?: string;
    /**
     * The version of the library the construct comes from
     *
     * @default - undefined if this is a locally defined construct
     */
    readonly libraryVersion?: string;
    /**
     * If `CDK_DEBUG` is set to true, then this will show
     * the line from the stack trace that contains the location
     * in the source file where the construct is defined.
     *
     * If `CDK_DEBUG` is not set then this will instruct the user
     * to run with `--debug` if they would like the location
     *
     * @default - undefined if the construct comes from a library
     * and the location would point to node_modules
     */
    readonly location?: string;
}
/**
 * Utility class to help accessing information on constructs in the
 * construct tree. This can be created once and shared between
 * all the validation plugin executions.
 */
export declare class ConstructTree {
    private readonly root;
    /**
     * A cache of the ConstructTrace by node.path. Each construct
     */
    private readonly _traceCache;
    private readonly _constructByPath;
    private readonly _constructByTemplatePathAndLogicalId;
    private readonly treeMetadata;
    constructor(root: IConstruct);
    private setLogicalId;
    /**
     * Get the stack trace from the construct node metadata.
     * The stack trace only gets recorded if the node is a `CfnResource`,
     * but the stack trace will have entries for all types of parent construct
     * scopes
     */
    private getTraceMetadata;
    /**
     * Get a ConstructTrace from the cache for a given construct
     *
     * Construct the stack trace of constructs. This will start with the
     * root of the tree and go down to the construct that has the violation
     */
    getTrace(node: Node, locations?: string[]): ConstructTrace | undefined;
    /**
     * Each node will only have a single child so just
     * return that
     */
    private getChild;
    /**
     * Get the size of a Node
     */
    private nodeSize;
    /**
     * Get a specific node in the tree by construct path
     *
     * @param path the construct path of the node to return
     * @returns the TreeMetadata Node
     */
    getTreeNode(path: string): Node | undefined;
    /**
     * Get a specific Construct by the node.addr
     *
     * @param path the node.addr of the construct
     * @returns the Construct
     */
    getConstructByPath(path: string): Construct | undefined;
    /**
     * Get a specific Construct by the CfnResource logical ID. This will
     * be the construct.node.defaultChild with the given ID
     *
     * @param logicalId the ID of the CfnResource
     * @returns the Construct
     */
    getConstructByLogicalId(templateFile: string, logicalId: string): Construct | undefined;
}
