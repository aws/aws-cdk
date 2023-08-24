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
export class ConstructTree {
  /**
   * A cache of the ConstructTrace by node.path. Each construct
   */
  private readonly _traceCache = new Map<string, ConstructTrace>();
  private readonly _constructByPath = new Map<string, Construct>();
  private readonly _constructByTemplatePathAndLogicalId = new Map<string, Map<string, Construct>>();
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
        const stack = Stack.of(defaultChild);
        const logicalId = stack.resolve(defaultChild.logicalId);
        this.setLogicalId(stack, logicalId, child);
      }
    });

    // Another pass to include all the L1s that haven't been added yet
    this.root.node.findAll().forEach(child => {
      if (CfnResource.isCfnResource(child)) {
        const stack = Stack.of(child);
        const logicalId = Stack.of(child).resolve(child.logicalId);
        this.setLogicalId(stack, logicalId, child);
      }
    });
  }

  private setLogicalId(stack: Stack, logicalId: string, child: Construct) {
    if (!this._constructByTemplatePathAndLogicalId.has(stack.templateFile)) {
      this._constructByTemplatePathAndLogicalId.set(stack.templateFile, new Map([[logicalId, child]]));
    } else {
      this._constructByTemplatePathAndLogicalId.get(stack.templateFile)?.set(logicalId, child);
    }
  }

  /**
   * Get the stack trace from the construct node metadata.
   * The stack trace only gets recorded if the node is a `CfnResource`,
   * but the stack trace will have entries for all types of parent construct
   * scopes
   */
  private getTraceMetadata(size: number, node?: Node): string[] {
    if (node) {
      const construct = this.getConstructByPath(node.path);
      if (construct) {
        let trace;
        if (CfnResource.isCfnResource(construct)) {
          trace = construct.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
        } else {
          trace = construct.node.defaultChild?.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
        }
        // take just the items we need and reverse it since we are
        // displaying the trace bottom up
        return Object.create(trace.slice(0, size));
      }
    }
    return [];
  }

  /**
   * Only the `CfnResource` constructs contain the trace information
   * So we need to go down the tree and find that resource (its always the last one)
   *
   * @param node Node the entire tree where the bottom is the violating resource
   * @return Node the bottom of the tree which will be the violating resource
   */
  private getNodeWithTrace(node: Node): Node {
    if (node.children) {
      return this.getNodeWithTrace(this.getChild(node.children));
    }
    return node;
  }

  /**
   * @param node - the root node of the tree
   * @returns the terminal node in the tree
   */
  private lastChild(node: Node): Node {
    if (node.children) {
      return this.lastChild(this.getChild(node.children));
    }
    return node;
  }

  /**
   * Get a ConstructTrace from the cache for a given construct
   *
   * Construct the stack trace of constructs. This will start with the
   * root of the tree and go down to the construct that has the violation
   */
  public getTrace(node: Node, locations?: string[]): ConstructTrace | undefined {
    const lastChild = this.lastChild(node);
    const trace = this._traceCache.get(lastChild.path);
    if (trace) {
      return trace;
    }

    const size = this.nodeSize(node);

    const nodeWithTrace = this.getNodeWithTrace(node);
    const metadata = (locations ?? this.getTraceMetadata(size, nodeWithTrace));
    const thisLocation = metadata.pop();

    const constructTrace: ConstructTrace = {
      id: node.id,
      path: node.path,
      // the "child" trace will be the "parent" node
      // since we are going bottom up
      child: node.children
        ? this.getTrace(this.getChild(node.children), metadata)
        : undefined,
      construct: node.constructInfo?.fqn,
      libraryVersion: node.constructInfo?.version,
      location: thisLocation ?? "Run with '--debug' to include location info",
    };
    // set the cache for the last child path. If the last child path is different then
    // we have a different tree and need to retrieve the trace again
    this._traceCache.set(lastChild.path, constructTrace);
    return constructTrace;
  }

  /**
   * Each node will only have a single child so just
   * return that
   */
  private getChild(children: { [key: string]: Node }): Node {
    return Object.values(children)[0];
  }

  /**
   * Get the size of a Node, i.e. how many levels is it
   */
  private nodeSize(node: Node): number {
    let size = 1;
    if (!node.children) {
      return size;
    }
    let children: Node | undefined = this.getChild(node.children);
    do {
      size++;
      children = children.children
        ? this.getChild(children.children)
        : undefined;
    } while (children);

    return size;
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
  public getConstructByLogicalId(templateFile: string, logicalId: string): Construct | undefined {
    return this._constructByTemplatePathAndLogicalId.get(templateFile)?.get(logicalId);
  }
}
