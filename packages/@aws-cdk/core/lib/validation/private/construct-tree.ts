import { Construct, IConstruct } from 'constructs';
import { App } from '../../app';
import { CfnResource } from '../../cfn-resource';
import { TreeMetadata, Node } from '../../private/tree-metadata';
import { Stack } from '../../stack';

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
   * The name of the library the construct comes from
   *
   * @default - undefined if this is a locally defined construct
   */
  readonly library?: string;

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
export class ConstructTree {
  /**
   * A cache of the ConstructTrace by node.path. Each construct
   */
  private readonly _traceCache = new Map<string, ConstructTrace>();
  private readonly _constructByPath = new Map<string, Construct>();
  private readonly _constructByLogicalId = new Map<string, Construct>();
  private readonly treeMetadata: TreeMetadata;

  constructor(
    private readonly root: IConstruct,
  ) {
    if (App.isApp(this.root)) {
      this.treeMetadata = this.root.node.tryFindChild('Tree') as TreeMetadata;
    } else {
      this.treeMetadata = App.of(this.root)?.node.tryFindChild('Tree') as TreeMetadata;
    }
    this._constructByPath.set(this.root.node.path, root);
    // do this once at the start so we don't have to traverse
    // the entire tree everytime we want to find a nested node
    this.root.node.findAll().forEach(child => {
      this._constructByPath.set(child.node.path, child);
      const defaultChild = child.node.defaultChild;
      if (defaultChild && CfnResource.isCfnResource(defaultChild)) {
        this._constructByLogicalId.set(Stack.of(child).resolve(defaultChild.logicalId), child);
      }
    });

    // Another pass to include all the L1s that haven't been added yet
    this.root.node.findAll().forEach(child => {
      if (CfnResource.isCfnResource(child)) {
        const logicalId = Stack.of(child).resolve(child.logicalId);
        if (!this._constructByLogicalId.has(logicalId)) {
          this._constructByLogicalId.set(logicalId, child);
        }
      }
    });
  }

  /**
   * Get a ConstructTrace from the cache for a given construct
   *
   * @param constructPath construct path
   * @returns ConstructTrace if available
   */
  public getTrace(constructPath: string, trace?: ConstructTrace): ConstructTrace | undefined {
    const constructTrace = this._traceCache.get(constructPath);
    if (!constructTrace && trace) {
      this._traceCache.set(constructPath, trace);
    }
    return constructTrace ?? trace;
  }

  /**
   * Get a specific node in the tree by construct path
   *
   * @param path the construct path of the node to return
   * @returns the TreeMetadata Node
   */
  public getTreeNode(path: string): Node | undefined {
    return this.treeMetadata._getNodeBranch(path);
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
   * Get a specific Construct by the CfnResource logical ID. This will
   * be the construct.node.defaultChild with the given ID
   *
   * @param logicalId the ID of the CfnResource
   * @returns the Construct
   */
  public getConstructByLogicalId(logicalId: string): Construct | undefined {
    return this._constructByLogicalId.get(logicalId);
  }
}
