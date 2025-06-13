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
  /**
   * The tree in this file
   */
  tree: TreeNode;
}

export interface ForestFileActual {
  version: 'forest-0.1';

  /**
   * Map of trees in the forest file
   *
   * The key is the tree ID, and the value is the tree node.
   */
  forest: Record<string, TreeNode>;
}

type TreeNode = Node | SubTreeReference;

/**
 * A reference to a node that is stored in a different tree.json file
 */
interface SubTreeReference {
  readonly id: string;
  readonly path: string;
  readonly fileName: string;
  /**
   * The ID of the tree within the forest file
   * If not provided, refers to the main tree in the file (backward compatibility)
   */
  readonly treeId?: string;
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
 *
 * Here's a sense of the numbers: a project with 277k nodes leads to an 136M JSON
 * file (490 bytes/node). We'll estimate the size of a node to be 1000 bytes.
 */
class FragmentedTreeWriter {
  /**
   * All trees in the forest
   */
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

  /**
   * Map of filename to ForestFile
   *
   * Each ForestFile can contain multiple trees
   */
  private readonly forestFiles = new Map<string, ForestFile>();

  private readonly maxNodes: number;

  private subtreeCtr = 1;
  private treeIdCtr = 1;

  constructor(private readonly outdir: string, private readonly rootFilename: string, options?: FragmentedTreeWriterOptions) {
    this.maxNodes = options?.maxNodesPerTree ?? 500_000;

    // Initialize the root forest file
    this.forestFiles.set(this.rootFilename, {
      filename: this.rootFilename,
      trees: new Map(),
      totalNodes: 0,
    });
  }

  /**
   * Write the forest to disk, return the root file name
   */
  public writeForest(): string {
    // Write each forest file
    for (const forestFile of this.forestFiles.values()) {
      // The first tree in each file is the main tree for backward compatibility
      const mainTree = forestFile.trees.values().next().value?.root;

      // Create the forest file structure
      const treeFile: TreeFile = {
        version: 'tree-0.1',
        tree: mainTree || { id: 'empty', path: '' }, // Fallback for empty files
      };

      // Add additional trees to the forest property if there are any
      if (forestFile.trees.size > 1) {
        treeFile.forest = {};

        // Skip the first tree (already in the 'tree' property)
        let isFirst = true;
        for (const [treeId, tree] of forestFile.trees.entries()) {
          if (isFirst) {
            isFirst = false;
            continue;
          }
          treeFile.forest[treeId] = tree.root;
        }
      }

      fs.writeFileSync(path.join(this.outdir, forestFile.filename), JSON.stringify(treeFile), { encoding: 'utf-8' });
    }

    return this.rootFilename;
  }

  public addNode(construct: IConstruct, parent: IConstruct | undefined, node: Node) {
    // NOTE: we could copy the 'node' object to be safe against tampering, but we trust
    // the consuming code so we know we don't need to.

    if (parent === undefined) {
      if (this.forest.length > 0) {
        throw new AssumptionError('Can only add exactly one node without a parent');
      }

      this.addNewTree(node, this.rootFilename);
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
  private addNewTree(root: Node, filename: string): Tree {
    const nodeSize = nodeCount(root);
    const treeId = `tree-${this.treeIdCtr++}`;

    // Get or create the forest file
    let forestFile = this.forestFiles.get(filename);
    if (!forestFile) {
      forestFile = {
        filename,
        trees: new Map(),
        totalNodes: 0,
      };
      this.forestFiles.set(filename, forestFile);
    }

    // If this forest file would exceed the max nodes, create a new one
    if (forestFile.totalNodes + nodeSize > this.maxNodes && forestFile.trees.size > 0) {
      const newFilename = `tree-${this.subtreeCtr++}.json`;
      forestFile = {
        filename: newFilename,
        trees: new Map(),
        totalNodes: 0,
      };
      this.forestFiles.set(newFilename, forestFile);
      filename = newFilename;
    }

    // Create the tree
    const tree: Tree = {
      root,
      filename,
      treeId: forestFile.trees.size === 0 ? undefined : treeId, // First tree in file doesn't need ID
      nodes: nodeSize,
    };

    // Add to forest file and update node count
    forestFile.trees.set(tree.treeId || 'main', tree);
    forestFile.totalNodes += nodeSize;

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
        // Special case for the root node - we can't split it further
        if (parent.id === 'App' && parent.path === '') {
          // Just add the node to the existing tree even though it's full
          setChild(parent, node);
          this.parent.set(node, parent);
          tree.nodes += 1;

          // Update the forest file's total node count
          const forestFile = this.forestFiles.get(tree.filename);
          if (forestFile) {
            forestFile.totalNodes += 1;
          }
          return;
        }
        throw new AssumptionError(`Could not find parent of ${JSON.stringify(parent)}`);
      }

      // Find a forest file that can accommodate this subtree
      // or create a new one if necessary
      tree = this.addNewTree(parent, `tree-${this.subtreeCtr++}.json`);

      // Create a reference to the subtree
      const reference: SubTreeReference = {
        id: parent.id,
        path: parent.path,
        fileName: tree.filename,
        ...(tree.treeId ? { treeId: tree.treeId } : {}),
      };

      setChild(grandParent, reference);

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

    // Update the forest file's total node count
    const forestFile = this.forestFiles.get(tree.filename);
    if (forestFile) {
      forestFile.totalNodes += 1;
    }
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
    throw new AssumptionError(`Could not find tree for node: ${JSON.stringify(node)}, tried ${tried}, ${Array.from(this.subtreeRoots).map(([k, v]) => `${k.path} => ${v.filename}`)}`);
  }
}

/**
 * A forest file containing multiple trees
 */
interface ForestFile {
  /**
   * The filename of this forest file
   */
  filename: string;

  /**
   * Map of tree ID to Tree
   * The first tree in the map is the main tree (for backward compatibility)
   */
  trees: Map<string, Tree>;

  /**
   * Total number of nodes across all trees in this forest file
   */
  totalNodes: number;
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
   * The filename that `root` will be serialized to
   */
  filename: string;

  /**
   * The ID of this tree within the forest file
   * Undefined for the main tree in a file (for backward compatibility)
   */
  treeId?: string;

  /**
   * How many nodes are in this tree already
   */
  nodes: number;
}

export function isSubtreeReference(x: TreeFile['tree'] | TreeNode): x is Extract<TreeFile['tree'], { fileName: string }> {
  return !!(x as any).fileName;
}

/**
 * Get a tree node from a forest file
 * @param file The forest file
 * @param treeId Optional tree ID within the forest
 * @returns The tree node
 */
export function getTreeFromForest(file: ForestFileActual, treeId: string): TreeNode {
  if (file.forest[treeId]) {
    return file.forest[treeId];
  }

  throw new Error(`Tree with ID ${treeId} not found in forest file`);
}

