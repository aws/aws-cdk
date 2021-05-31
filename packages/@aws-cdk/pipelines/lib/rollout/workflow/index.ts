import { addAll, extract, flatMap, flatten } from '../_util';
import { topoSort } from './toposort';


/**
 * Role of this node in the workflow
 *
 * This is to distinguish the function of multiple nodes of the
 * same type (primarily multiple Workflows and ShellActions).
 */
export enum WorkflowRole {
  ROOT,
  GROUP,
  GENERIC,
  BUILD,
  DEPLOY_STACK,
  DEPLOY_STAGE,
  PUBLISH_ASSET,
  PREPARE_CHANGESET,
  EXECUTE_CHANGESET,
}

export interface WorkflowNodeProps {
  /**
   * Optional role for the workflow node
   *
   * @default WorkflowRole.GENERIC
   */
  readonly role?: WorkflowRole;
}
export abstract class WorkflowNode {
  public readonly dependencies: WorkflowNode[] = [];
  public readonly role: WorkflowRole;
  private _parentGraph?: Workflow;

  constructor(public readonly name: string, props: WorkflowNodeProps={}) {
    this.role = props.role ?? WorkflowRole.GENERIC;
  }

  public dependOn(...dependencies: WorkflowNode[]) {
    if (dependencies.includes(this)) {
      throw new Error(`Cannot add dependency on self: ${this}`);
    }
    this.dependencies.push(...dependencies);
  }

  public get parentGraph() {
    return this._parentGraph;
  }

  /**
   * @internal
   */
  public _setParentGraph(parentGraph: Workflow) {
    if (this._parentGraph) {
      throw new Error('Node already has a parent');
    }
    this._parentGraph = parentGraph;
  }

  public toString() {
    return `${this.constructor.name}(${this.name})`;
  }
}

export interface WorkflowProps extends WorkflowNodeProps{
  /**
   * Initial nodes in the workflow
   */
  readonly nodes?: WorkflowNode[];
}

export class Workflow extends WorkflowNode {
  private readonly nodes = new Set<WorkflowNode>();

  constructor(name: string, props: WorkflowProps={}) {
    super(name, props);

    if (props.nodes) {
      this.add(...props.nodes);
    }
  }

  public tryGetChild(name: string) {
    for (const n of this.nodes) {
      if (n.name === name) { return n; }
    }
    return undefined;
  }

  public contains(node: WorkflowNode) {
    return this.nodes.has(node);
  }

  public add(...nodes: Array<WorkflowNode>) {
    for (const node of nodes) {
      node._setParentGraph(this);
      this.nodes.add(node);
    }
  }

  public absorb(other: Workflow) {
    this.add(...other.nodes);
  }

  /**
   * Return topologically sorted tranches of nodes at this graph level
   */
  public sortedChildren(): WorkflowNode[][] {
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
  public sortedLeaves(): WorkflowNode[][] {
    // Project dependencies to leaf nodes
    const descendantsMap = new Map<WorkflowNode, WorkflowNode[]>();
    findDescendants(this);

    function findDescendants(node: WorkflowNode): WorkflowNode[] {
      const ret: WorkflowNode[] = [];

      if (node instanceof Workflow) {
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
    return topoSort(new Set(projectedDependencies.keys()), projectedDependencies);
  }

  public consoleLog(indent: number = 0) {
    // eslint-disable-next-line no-console
    console.log(' '.repeat(indent) + this + depString(this));
    for (const node of this.nodes) {
      if (node instanceof Workflow) {
        node.consoleLog(indent + 2);
      } else {
        // eslint-disable-next-line no-console
        console.log(' '.repeat(indent + 2) + node + depString(node));
      }
    }

    function depString(node: WorkflowNode) {
      if (node.dependencies.length > 0) {
        return ` -> ${Array.from(node.dependencies).join(', ')}`;
      }
      return '';
    }
  }

  /**
   * Return the union of all dependencies of the descendants of this graph
   */
  private deepDependencies() {
    const ret = new Map<WorkflowNode, Set<WorkflowNode>>();
    for (const node of this.nodes) {
      recurse(node);
    }
    return ret;

    function recurse(node: WorkflowNode) {
      let deps = ret.get(node);
      if (!deps) {
        ret.set(node, deps = new Set());
      }
      for (let dep of node.dependencies) {
        deps.add(dep);
      }
      if (node instanceof Workflow) {
        for (const child of node.nodes) {
          recurse(child);
        }
      }
    }
  }
}

export class RolloutWorkflow extends Workflow {
  public readonly sourceStage = new Workflow('Source');
  public readonly buildStage = new Workflow('Synth');
  private _cloudAssemblyArtifact?: WorkflowArtifact;

  constructor() {
    super('Pipeline', { role: WorkflowRole.ROOT });
    this.add(this.sourceStage);
    this.add(this.buildStage);
  }

  /**
   * Return sorted list of non-predefined stages
   */
  public get sortedAdditionalStages() {
    return Array.from(flatten(this.sortedChildren())).filter(n => n !== this.sourceStage && n !== this.buildStage);
  }

  public get cloudAssemblyArtifact() {
    if (!this._cloudAssemblyArtifact) {
      throw new Error('No cloud assembly artifact produced');
    }
    return this._cloudAssemblyArtifact;
  }

  public recordCloudAssemblyArtifact(artifact: WorkflowArtifact) {
    this._cloudAssemblyArtifact = artifact;
  }
}

export class WorkflowAction extends WorkflowNode {
}

export class WorkflowArtifact {
  private _producer?: WorkflowNode;

  constructor(public readonly name: string, producer?: WorkflowNode) {
    this._producer = producer;
  }

  public get producer() {
    if (!this._producer) {
      throw new Error(`Artifact '${this.name}' doesn\'t have a producer; call 'artifact.producedBy()'`);
    }
    return this._producer;
  }

  public producedBy(producer?: WorkflowNode) {
    if (this._producer) {
      throw new Error(`Artifact '${this.name}' already has a producer (${this._producer}) while setting producer: ${producer}`);
    }
    this._producer = producer;
  }
}

/**
 * Dependency map of nodes in this graph, taking into account dependencies between nodes in subgraphs
 *
 * Guaranteed to return an entry in the map for every node in the current graph.
 */
function projectDependencies(dependencies: Map<WorkflowNode, Set<WorkflowNode>>, project: (x: WorkflowNode) => WorkflowNode[]) {
  // Project keys
  for (const node of dependencies.keys()) {
    const projectedNodes = project(node);
    if (projectedNodes.length === 1 && projectedNodes[0] === node) { continue; } // Nothing to do, just for efficiency

    const deps = extract(dependencies, node)!;
    for (const projectedNode of projectedNodes) {
      addAll(dependencies.get(projectedNode)!, deps);
    }
  }

  // Project values. Ignore self-dependencies, they were just between nodes that were collapsed into the same node.
  for (const [node, deps] of dependencies.entries()) {
    const depset = new Set(flatMap(deps, project));
    depset.delete(node);
    dependencies.set(node, depset);
  }

  return dependencies;
}

/**
 * Returns the graph node that's shared between these nodes
 */
export function commonAncestor(xs: Iterable<WorkflowNode>) {
  const paths = new Array<WorkflowNode[]>();
  for (const x of xs) {
    paths.push(rootPath(x));
  }

  if (paths.length === 0) {
    throw new Error('Cannot find common ancestor between an empty set of nodes');
  }
  if (paths.length === 1) {
    const path = paths[0];

    if (path.length < 2) {
      throw new Error(`Cannot find ancestor of node without ancestor: ${path[0]}`);
    }
    return path[path.length - 2];
  }

  const originalPaths = [...paths];

  // Remove the first element of every path as long as the 2nd elements are all
  // the same -- this leaves the shared element in first place.
  //
  //   A, B, C, 1, 2    }---> C
  //   A, B, C, 3       }
  while (paths.every(path => paths[0].length >= 2 && path.length >= 2 && path[1] === paths[0][1])) {
    for (const path of paths) {
      path.shift();
    }
  }

  // If any of the paths are left with 1 element, there's no shared parent.
  if (paths.some(path => path.length < 2)) {
    throw new Error(`Could not determine a shared parent between nodes: ${originalPaths.map(nodes => nodes.map(n => n.name).join('/'))}`);
  }

  return paths[0][0];
}

export function ancestorPath(x: WorkflowNode, upTo: WorkflowNode): WorkflowNode[] {
  const ret = [x];
  while (x.parentGraph && x.parentGraph !== upTo) {
    x = x.parentGraph;
    ret.unshift(x);
  }
  return ret;
}

function rootPath(x: WorkflowNode): WorkflowNode[] {
  const ret = [x];
  while (x.parentGraph) {
    x = x.parentGraph;
    ret.unshift(x);
  }
  return ret;
}

export function isWorkflow(x: WorkflowNode): x is Workflow {
  return x instanceof Workflow;
}

// eslint-disable-next-line import/order
export * from './shell-action';
export * from './cloudformation-actions';
export * from './manual-approval-action';
