import { addAll, extract, flatMap } from '../_util';
import { CommandImage } from '../image';
import { topoSort } from './toposort';

export abstract class ExecutionNode {
  public readonly dependencies: ExecutionNode[] = [];
  private _parentGraph?: ExecutionGraph;

  constructor(public readonly name: string) {
  }

  public dependOn(...dependencies: ExecutionNode[]) {
    this.dependencies.push(...dependencies);
  }

  public get parentGraph() {
    return this._parentGraph;
  }

  /**
   * @internal
   */
  public _setParentGraph(parentGraph: ExecutionGraph) {
    if (this._parentGraph) {
      throw new Error('Node already has a parent');
    }
    this._parentGraph = parentGraph;
  }

  public toString() {
    return `Node(${this.name})`;
  }
}

export class ExecutionGraph extends ExecutionNode {
  private readonly nodes = new Set<ExecutionNode>();
  constructor(name: string, nodes?: ExecutionNode[]) {
    super(name);
    if (nodes) {
      this.add(...nodes);
    }
  }

  public contains(node: ExecutionNode) {
    return this.nodes.has(node);
  }

  public add(...nodes: ExecutionNode[]) {
    for (const node of nodes) {
      node._setParentGraph(this);
      this.nodes.add(node);
    }
  }

  public absorb(other: ExecutionGraph) {
    this.add(...other.nodes);
  }

  /**
   * Return topologically sorted tranches of nodes at this graph level
   */
  public sortedChildren(): ExecutionNode[][] {
    // Project dependencies to current children
    const projectedDependencies = projectDependencies(this.deepDependencies(), (node) => {
      while (!this.nodes.has(node) && node.parentGraph) {
        node = node.parentGraph;
      }
      return this.nodes.has(node) ? [node] : [];
    });

    return topoSort(this.nodes, projectedDependencies);
  }

  /**
   * Return a topologically sorted list of non-Graph nodes in the entire subgraph
   */
  public sortedLeaves(): ExecutionNode[][] {
    // Project dependencies to leaf nodes
    const descendantsMap = new Map<ExecutionNode, ExecutionNode[]>();
    findDescendants(this);

    function findDescendants(node: ExecutionNode): ExecutionNode[] {
      const ret: ExecutionNode[] = [];

      if (node instanceof ExecutionGraph) {
        for (const child of node.nodes) {
          ret.push(...findDescendants(child));
        }
      } else {
        ret.push(node);
      }

      descendantsMap.set(node, ret);
      return ret;
    }

    const projectedDependencies = projectDependencies(this.deepDependencies(), (node) => descendantsMap.get(node) ?? []);
    return topoSort(this.nodes, projectedDependencies);
  }

  /**
   * Return the union of all dependencies of the descendants of this graph
   */
  private deepDependencies() {
    const ret = new Map<ExecutionNode, Set<ExecutionNode>>();
    for (const node of this.nodes) {
      recurse(node);
    }
    return ret;

    function recurse(node: ExecutionNode) {
      let deps = ret.get(node);
      if (!deps) {
        ret.set(node, deps = new Set());
      }
      for (let dep of node.dependencies) {
        deps.add(dep);
      }
      if (node instanceof ExecutionGraph) {
        for (const child of node.nodes) {
          recurse(child);
        }
      }
    }
  }
}

export class ExecutionPipeline extends ExecutionGraph {
  public readonly sourceArtifacts: ExecutionArtifact[] = [];
  private _cloudAssemblyArtifact?: ExecutionArtifact;

  constructor() {
    super('Pipeline');
  }

  public addSourceArtifact(artifact: ExecutionArtifact) {
    this.sourceArtifacts.push(artifact);
  }

  public get cloudAssemblyArtifact() {
    if (!this._cloudAssemblyArtifact) {
      throw new Error('No cloud assembly artifact produced');
    }
    return this._cloudAssemblyArtifact;
  }

  public setCloudAssemblyArtifact(artifact: ExecutionArtifact) {
    this._cloudAssemblyArtifact = artifact;
  }
}

export class ExecutionAction extends ExecutionNode {
}

export interface ShellCommandArtifact {
  readonly directory: string;
  readonly artifact: ExecutionArtifact;
}

export interface ShellCommandActionProps {
  readonly installCommands?: string[];
  readonly buildCommands?: string[];
  readonly testCommands?: string[];
  readonly image?: CommandImage;
  readonly buildsDockerImages?: boolean;
  readonly testReports?: boolean;
  readonly subdirectory?: string;
  readonly environmentVariables?: Record<string, string>;
  readonly inputArtifacts?: ShellCommandArtifact[];
  readonly outputDirectories?: ShellCommandArtifact[];
}

export class ShellCommandAction extends ExecutionAction {
  constructor(name: string, public readonly props: ShellCommandActionProps) {
    super(name);
  }
}

export class ExecutionArtifact {
  constructor(public readonly name: string, public readonly producedBy: ExecutionAction) {
  }
}

/**
 * Dependency map of nodes in this graph, taking into account dependencies between nodes in subgraphs
 *
 * Guaranteed to return an entry in the map for every node in the current graph.
 */
function projectDependencies(dependencies: Map<ExecutionNode, Set<ExecutionNode>>, project: (x: ExecutionNode) => ExecutionNode[]) {
  // Project keys
  for (const node of dependencies.keys()) {
    const projectedNodes = project(node);
    if (projectedNodes.length === 1 && projectedNodes[0] === node) { continue; } // Nothing to do, just for efficiency

    const deps = extract(dependencies, node)!;
    for (const projectedNode of projectedNodes) {
      addAll(dependencies.get(projectedNode)!, deps);
    }
  }

  // Project values
  for (const [node, deps] of dependencies.entries()) {
    dependencies.set(node, new Set(flatMap(deps, project)));
  }

  return dependencies;
}

/**
 * Returns the graph node that's shared between these nodes
 */
export function commonAncestor(xs: Iterable<ExecutionNode>) {
  const paths = new Array<ExecutionNode[]>();
  for (const x of xs) {
    paths.push(rootPath(x));
  }

  // Remove the first element of every path as long as the 2nd elements are all
  // the same -- this leaves the shared element in first place.
  while (paths.every(path => paths[0].length >= 2 && path.length >= 2 && path[1] === paths[0][1])) {
    for (const path of paths) {
      path.shift();
    }
  }

  // If any of the paths are left with 1 element, there's no shared parent.
  if (paths.some(path => path.length < 2)) {
    throw new Error('Could not determine a shared parent between nodes');
  }

  return paths[0][0];
}

export function ancestorPath(x: ExecutionNode, upTo: ExecutionNode): ExecutionNode[]  {
  const ret = [x];
  while (x.parentGraph && x.parentGraph !== upTo) {
    x = x.parentGraph;
    ret.unshift(x);
  }
  return ret;
}

function rootPath(x: ExecutionNode): ExecutionNode[] {
  const ret = [x];
  while (x.parentGraph) {
    x = x.parentGraph;
    ret.unshift(x);
  }
  return ret;
}

export * from './source-actions';