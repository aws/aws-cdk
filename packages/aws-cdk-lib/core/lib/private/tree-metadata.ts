import * as fs from 'fs';
import * as path from 'path';

import { Construct, IConstruct } from 'constructs';
import { ConstructInfo, constructInfoFromConstruct } from './runtime-info';
import { ArtifactType } from '../../../cloud-assembly-schema';
import { Annotations } from '../annotations';
import { Stack } from '../stack';
import { ISynthesisSession } from '../stack-synthesizers';
import { IInspectable, TreeInspector } from '../tree';
import { iterateBfs } from './construct-iteration';
import { AssumptionError } from '../errors';

const FILE_PATH = 'tree.json';

/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 */
export class TreeMetadata extends Construct {
  constructor(scope: Construct) {
    super(scope, 'Tree');
  }

  /**
   * Create tree.json
   * @internal
   */
  public _synthesizeTree(session: ISynthesisSession) {
    // This is for testing
    const maxNodesPerTree = this.node.tryGetContext('@aws-cdk/core.TreeMetadata:maxNodes');

    const builder = session.assembly;
    const writer = new FragmentedTreeWriter(builder.outdir, FILE_PATH, { maxNodesPerTree });

    for (const { construct, parent } of iterateBfs(this.node.root)) {
      const node: Node = {
        id: construct.node.id || 'App',
        path: construct.node.path,
        constructInfo: constructInfoFromConstruct(construct),
      };
      try {
        node.attributes = this.synthAttributes(construct);
      } catch (e) {
        Annotations.of(this).addWarningV2(`@aws-cdk/core:failedToRenderTreeMetadata-${construct.node.id}`, `Failed to render tree metadata for node [${construct.node.id}]. Reason: ${e}`);
      }

      writer.addNode(construct, parent, node);
    }

    const rootFilename = writer.writeForest();

    builder.addArtifact('Tree', {
      type: ArtifactType.CDK_TREE,
      properties: {
        file: rootFilename,
      },
    });
  }

  private synthAttributes(construct: IConstruct): { [key: string]: any } | undefined {
    // check if a construct implements IInspectable
    function canInspect(inspectable: any): inspectable is IInspectable {
      return inspectable.inspect !== undefined;
    }

    const inspector = new TreeInspector();

    // get attributes from the inspector
    if (canInspect(construct)) {
      construct.inspect(inspector);
      return Stack.of(construct).resolve(inspector.attributes);
    }
    return undefined;
  }
}

/**
 * Serializable representation of a construct
 */
interface Node {
  /**
   * The construct's ID
   *
   * Even though this ID is already in the `children` map of the containing node,
   * we repeat it here.
   */
  readonly id: string;

  /**
   * The construct's path
   *
   * Even though this path can be constructed from the construct IDs of constructs
   * on the root path to this construct, we still repeat it here.
   *
   * FIXME: In a sizeable file (tested on 136MB) this takes about 20% of the
   * total size without adding any value. We should probably remove this at some
   * point.
   */
  readonly path: string;
  children?: { [key: string]: TreeNode };
  attributes?: { [key: string]: unknown };

  /**
   * Information on the construct class that led to this node, if available
   */
  constructInfo?: ConstructInfo;
}

export interface TreeFile {
  version: 'tree-0.1';
  tree: TreeNode;
}

export interface ForestFile {
  version: 'forest-0.1';
  forest: Record<string, TreeNode>;
}

type TreeNode = Node | SubTreeReference;

/**
 * A reference to a node that is stored in an entirely different tree.json file
 */
interface SubTreeReference {
  readonly id: string;
  readonly path: string;
  fileName: string;

  /**
   * If set, indicates the subtree in the forest file
   *
   * If this is set then `fileName` must point to a ForestFile, and this indicates
   * the tree inside the forest.
   */
  treeId?: string;
}

/**
 * Write the Node tree in fragments
 *
 * We can't write the entire tree file in one go, because it might exceed 512MB serialized,
 * which is the largest string size that NodeJS will work with. Anything larger than that will
 * just fail.
 *
 * To write the tree, we will do the following:
 *
 * - Iterate through the tree in a breadth-first manner, building the serializable version
 *   of the tree as we go.
 * - Once we get to a threshold of N nodes, when we try to add a new child node to the tree
 *   we will convert the prospective parent to the root of a new tree and replace it
 *   with a reference in the original tree.
 *   - Choosing this method instead of making the child a new root because we have to
 *     assume that all leaf nodes of a "full" tree will still get children added to them,
 *     and there will be C=(avg outdegree)^(tree depth) of them. Converting the existing
 *     leaves in-place to a different node type will (probably) minimally change
 *     the size of the tree, whereas adding C more children that will all become
 *     references to substrees will add an unpredictable size to the tree.
 * - Because doing this will end up with a lot of subtrees (as many as there are leaf nodes
 *   in the trees, which is degree ^ depth), writing those all to individual files creates
 *   A LOT of files which is undesirable for people looking at the directory. We will
 *   accumulate subtrees into "forest" files which each hold a set of trees, identified
 *   by a filename and a tree ID. We allocate them by first building the individual trees,
 *   then accumulating subtrees up to a node count into forests, and then writing the
 *   name of the forest file and the tree ID into the node that points to the subtree.
 *
 * Here's a sense of the numbers: a project with 277k nodes leads to an 136M JSON
 * file (490 bytes/node). We'll estimate the size of a node to be 1000 bytes.
 */
class FragmentedTreeWriter {
  /**
   * We only care about the identify of this object.
   *
   * Whatever tree in the forest is "pointed to" by this pointer is the main tree.
   */
  private readonly mainTreePointer: SubTreeReference = {
    fileName: 'yyy',
    id: 'id',
    path: 'path',
  };

  private readonly forest = new Array<Tree>();

  /**
   * Maps a Construct to its respective Node
   */
  private readonly constructMap = new Map<IConstruct, Node>();

  /**
   * Map a root Node to its containing Tree
   */
  private readonly subtreeRoots = new Map<Node, Tree>();

  /**
   * Map a Node to its parent Node
   */
  private readonly parent = new Map<Node, Node>();

  private readonly maxNodes: number;

  constructor(private readonly outdir: string, private readonly rootFilename: string, options?: FragmentedTreeWriterOptions) {
    this.maxNodes = options?.maxNodesPerTree ?? 500_000;
  }

  /**
   * Write the forest to disk, return the root file name
   */
  public writeForest(): string {
    const forestFiles = this.allocateSubTreesToForestFiles();

    // We can now write the forest files, and the main file.
    const mainTree = this.forest.find(t => t.referencingNode === this.mainTreePointer);
    if (mainTree) {
      const treeFile: TreeFile = { version: 'tree-0.1', tree: mainTree.root };
      fs.writeFileSync(path.join(this.outdir, this.rootFilename), JSON.stringify(treeFile), { encoding: 'utf-8' });
    }

    for (const forestFile of forestFiles) {
      fs.writeFileSync(path.join(this.outdir, forestFile.fileName), JSON.stringify(forestFile.file), { encoding: 'utf-8' });
    }

    return this.rootFilename;
  }

  /**
   * Find all non-main tree and combine them into forest files
   *
   * This will mutate the pointing nodes as a side effect.
   */
  private allocateSubTreesToForestFiles(): IncompleteForestFile[] {
    // First, find all non-main trees and allocate them to forests.
    const ret = new Array<IncompleteForestFile>();

    for (const tree of this.forest) {
      if (tree.referencingNode === this.mainTreePointer) {
        // Main tree, not interesting for the purposes of allocating subtrees to forests
        continue;
      }

      let targetForest: typeof ret[0];
      if (ret.length === 0 || ret[ret.length - 1].nodeCount + tree.nodes > this.maxNodes) {
        targetForest = {
          fileName: `trees-${ret.length + 1}.json`,
          file: { version: 'forest-0.1', forest: { } },
          nodeCount: 0,
        };
        ret.push(targetForest);
      } else {
        targetForest = ret[ret.length - 1];
      }

      const treeId = `t${Object.keys(targetForest.file.forest).length}`;
      targetForest.file.forest[treeId] = tree.root;
      targetForest.nodeCount += tree.nodes;
      tree.referencingNode.fileName = targetForest.fileName;
      tree.referencingNode.treeId = treeId;
    }

    return ret;
  }

  public addNode(construct: IConstruct, parent: IConstruct | undefined, node: Node) {
    // NOTE: we could copy the 'node' object to be safe against tampering, but we trust
    // the consuming code so we know we don't need to.

    if (parent === undefined) {
      if (this.forest.length > 0) {
        throw new AssumptionError('Can only add exactly one node without a parent');
      }

      this.addNewTree(node, this.mainTreePointer);
    } else {
      // There was a provision in the old code for missing parents, so we're just going to ignore it
      // if we can't find a parent.
      const parentNode = this.constructMap.get(parent);
      if (!parentNode) {
        return;
      }

      this.addToExistingTree(node, parentNode);
    }

    this.constructMap.set(construct, node);
  }

  /**
   * Add a new tree with the given Node as root
   */
  private addNewTree(root: Node, referencingNode: SubTreeReference): Tree {
    const tree: Tree = {
      root,
      referencingNode: referencingNode,
      nodes: nodeCount(root),
    };

    this.forest.push(tree);
    this.subtreeRoots.set(root, tree);

    return tree;
  }

  /**
   * Add the given node to an existing tree, potentially splitting it
   */
  private addToExistingTree(node: Node, parent: Node) {
    let tree = this.treeForNode(parent);
    if (this.isTreeFull(tree)) {
      // We need to convert the tree to a subtree. Do that by moving the prospective
      // parent to a new subtree (might also move its children), and converting the
      // parent node in the original tree to a subtreereference.
      const grandParent = this.parent.get(parent);
      if (!grandParent) {
        throw new AssumptionError(`Could not find parent of ${JSON.stringify(parent)}`);
      }

      const subtreeReference: SubTreeReference = {
        id: parent.id,
        path: parent.path,
        fileName: 'xxx', // Will be replaced later
      };

      tree = this.addNewTree(parent, subtreeReference);

      setChild(grandParent, subtreeReference);

      // To be strictly correct we should decrease the original tree's nodeCount here, because
      // we may have moved away any number of children as well. We don't do that; the tree
      // will remain 'full' and every new node added will lead to a new subtree.

      // Record the new root for this subtree
      this.subtreeRoots.set(parent, tree);
    }

    // Add into existing tree
    setChild(parent, node);
    this.parent.set(node, parent);
    tree.nodes += 1;
  }

  /**
   * Whether the given tree is full
   */
  private isTreeFull(t: Tree) {
    return t.nodes >= this.maxNodes;
  }

  /**
   * Return the Tree that contains the given Node
   */
  private treeForNode(node: Node): Tree {
    const tried = new Array<string | undefined>();

    let cur: Node | undefined = node;
    tried.push(cur.path);
    let tree = this.subtreeRoots.get(cur);
    while (!tree && cur) {
      cur = this.parent.get(cur);
      tried.push(cur?.path);
      tree = cur && this.subtreeRoots.get(cur);
    }
    if (tree) {
      return tree;
    }
    throw new AssumptionError(`Could not find tree for node: ${JSON.stringify(node)}, tried ${tried}`);
  }
}

function nodeCount(root: Node) {
  let ret = 0;
  recurse(root);
  return ret;

  function recurse(x: Node) {
    ret += 1;
    for (const child of Object.values(x.children ?? {})) {
      recurse(child);
    }
  }
}

/**
 * Add a child to a parent node
 *
 * Makes sure the 'children' array exists
 */
function setChild(parent: Node, node: TreeNode) {
  if (!parent.children) {
    parent.children = {};
  }
  parent.children[node.id] = node;
}

interface FragmentedTreeWriterOptions {
  /**
   * The maximum number of nodes per tree file
   *
   * @default 500_000
   */
  readonly maxNodesPerTree?: number;
}

interface Tree {
  /**
   * The root of this particular tree
   */
  root: Node;

  /**
   * The node that is pointing to this tree
   *
   * This may be "mainTreePointer", in which case this tree indicates the main tree.
   */
  referencingNode: SubTreeReference;

  /**
   * How many nodes are in this tree already
   */
  nodes: number;
}

interface IncompleteForestFile {
  fileName: string;
  nodeCount: number;
  file: ForestFile;
}

export function isSubtreeReference(x: TreeFile['tree']): x is Extract<TreeFile['tree'], { fileName: string }> {
  return !!(x as any).fileName;
}

