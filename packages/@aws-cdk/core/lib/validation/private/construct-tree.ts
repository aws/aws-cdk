import { Construct, IConstruct } from 'constructs';
import { CfnResource } from '../../cfn-resource';
import { TreeMetadata, Node } from '../../private/tree-metadata';
import { Stack } from '../../stack';

export interface ConstructTrace {
  readonly id: string;
  readonly path: string;
  readonly parent?: ConstructTrace;
  readonly library?: string;
  readonly libraryVersion?: string;
  readonly location?: string;
}

/**
 * Utility class to help accessing information on constructs in the
 * construct tree. This can be created once and shared between
 * all the validation plugin executions.
 */
export class ConstructTree {
  /**
   * A cache of the ConstructTrace by node.path. Each construct
   */
  private readonly _traceCache = new Map<string, ConstructTrace>();
  private readonly _constructByPath = new Map<string, Construct>();
  private readonly _constructByResourceName = new Map<string, Construct>();
  private readonly treeMetadata: TreeMetadata;

  constructor(
    private readonly root: IConstruct,
  ) {
    this.treeMetadata = this.root.node.tryFindChild('Tree') as TreeMetadata;
    this._constructByPath.set(this.root.node.path, root);
    // do this once at the start so we don't have to traverse
    // the entire tree everytime we want to find a nested node
    this.root.node.findAll().forEach(child => {
      this._constructByPath.set(child.node.path, child);
      const defaultChild = child.node.defaultChild;
      if (defaultChild && CfnResource.isCfnResource(defaultChild)) {
        this._constructByResourceName.set(Stack.of(child).resolve(defaultChild.logicalId), child);
      }
    });
  }

  /**
   * Get a ConstructTrace from the cache for a given construct
   *
   * @param constructPath construct path
   * @returns ConstructTrace if available
   */
  public getTraceFromCache(constructPath: string): ConstructTrace | undefined {
    return this._traceCache.get(constructPath);
  }

  /**
   * Add a ConstructTrace for a specific construct to the trace cache
   *
   * @param constructPath construct path
   * @param trace the ConstructTrace
   */
  public setTraceCache(constructPath: string, trace: ConstructTrace): void {
    this._traceCache.set(constructPath, trace);
  }

  /**
   * Get a specific node in the tree by construct path
   *
   * @param path the construct path of the node to return
   * @returns the TreeMetadata Node
   */
  public getTreeNode(path: string): Node | undefined {
    return this.treeMetadata.getTreeNode(path);
  }

  /**
   * Get a specific Construct by the node.addr
   *
   * @param path the node.addr of the construct
   * @returns the Construct
   */
  public getConstructByPath(path: string): Construct | undefined {
    return this._constructByPath.get(path);
  }

  /**
   * Get a specific Construct by the CfnResource name. This will
   * be the construct.node.defaultChild with the given name
   *
   * @param resourceName the name of the CfnResource
   * @returns the Construct
   */
  public getConstructByResourceName(resourceName: string): Construct | undefined {
    return this._constructByResourceName.get(resourceName);
  }
}
