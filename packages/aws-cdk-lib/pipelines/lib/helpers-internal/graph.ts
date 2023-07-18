/**
 * A library for nested graphs
 */
import { topoSort } from './toposort';
import { addAll, extract, flatMap, isDefined } from '../private/javascript';

export interface GraphNodeProps<A> {
  readonly data?: A;
}

export class GraphNode<A> {
  public static of<A>(id: string, data: A) {
    return new GraphNode(id, { data });
  }

  public readonly dependencies: GraphNode<A>[] = [];
  public readonly data?: A;
  private _parentGraph?: Graph<A>;

  constructor(public readonly id: string, props: GraphNodeProps<A> = {}) {
    this.data = props.data;
  }

  /**
   * A graph-wide unique identifier for this node. Rendered by joining the IDs
   * of all ancestors with hyphens.
   */
  public get uniqueId(): string {
    return this.ancestorPath(this.root).map(x => x.id).join('-');
  }

  /**
   * The union of all dependencies of this node and the dependencies of all
   * parent graphs.
   */
  public get allDeps(): GraphNode<A>[] {
    const fromParent = this.parentGraph?.allDeps ?? [];
    return Array.from(new Set([...this.dependencies, ...fromParent]));
  }

  public dependOn(...dependencies: Array<GraphNode<A> | undefined>) {
    if (dependencies.includes(this)) {
      throw new Error(`Cannot add dependency on self: ${this}`);
    }
    this.dependencies.push(...dependencies.filter(isDefined));
  }

  public ancestorPath(upTo: GraphNode<A>): GraphNode<A>[] {
    let x: GraphNode<A> = this;
    const ret = [x];
    while (x.parentGraph && x.parentGraph !== upTo) {
      x = x.parentGraph;
      ret.unshift(x);
    }
    return ret;
  }

  public rootPath(): GraphNode<A>[] {
    let x: GraphNode<A> = this;
    const ret = [x];
    while (x.parentGraph) {
      x = x.parentGraph;
      ret.unshift(x);
    }
    return ret;
  }

  public get root() {
    let x: GraphNode<A> = this;
    while (x.parentGraph) {
      x = x.parentGraph;
    }
    return x;
  }

  public get rootGraph(): Graph<A> {
    const root = this.root;
    if (!(root instanceof Graph)) {
      throw new Error(`Expecting a graph as root, got: ${root}`);
    }
    return root;
  }

  public get parentGraph() {
    return this._parentGraph;
  }

  /**
   * @internal
   */
  public _setParentGraph(parentGraph: Graph<A>) {
    if (this._parentGraph) {
      throw new Error('Node already has a parent');
    }
    this._parentGraph = parentGraph;
  }

  public toString() {
    return `${this.constructor.name}(${this.id})`;
  }
}

/**
 * A dependency set that is constructed over time
 *
 * It doesn't matter in what order sources and targets for the dependency
 * relationship(s) get added. This class can serve as a synchronization
 * point if the order in which graph nodes get added to the graph is not
 * well-defined.
 *
 * You can think of a DependencyBuilder as a vertex that doesn't actually exist in the tree:
 *
 *     ┌────┐               ┌────┐
 *     │ P1 │◀─┐         ┌──│ S1 │
 *     └────┘  │   .─.   │  └────┘
 *             ├──( B )◀─┤
 *     ┌────┐  │   `─'   │  ┌────┐
 *     │ P2 │◀─┘         └──│ S2 │
 *     └────┘               └────┘
 *
 * Ultimately leads to: { S1 -> P1, S1 -> P2, S2 -> P1, S2 -> P2 }.
 */
export class DependencyBuilder<A> {
  private readonly _producers: GraphNode<A>[] = [];
  private readonly _consumers: GraphNode<A>[] = [];

  /**
   * Add a producer: make all nodes added by 'dependBy' depend on these
   */
  public dependOn(...targets: GraphNode<A>[]) {
    for (const target of targets) {
      for (const source of this._consumers) {
        source.dependOn(target);
      }
      this._producers.push(target);
    }
    return this;
  }

  /**
   * Add a consumer: make these nodes depend on all nodes added by 'dependOn'.
   */
  public dependBy(...sources: GraphNode<A>[]) {
    for (const source of sources) {
      for (const target of this._producers) {
        source.dependOn(target);
      }
      this._consumers.push(source);
    }
    return this;
  }

  /**
   * Whether there are any consumers (nodes added by 'dependBy') but no producers (nodes added by 'dependOn')
   */
  public get hasUnsatisfiedConsumers() {
    return this._consumers.length > 0 && this._producers.length === 0;
  }

  public get consumers(): ReadonlyArray<GraphNode<A>> {
    return this._consumers;
  }

  public consumersAsString() {
    return this.consumers.map(c => `${c}`).join(',');
  }
}

/**
 * A set of dependency builders identified by a given key.
 */
export class DependencyBuilders<K, A=any> {
  private readonly builders = new Map<K, DependencyBuilder<A>>();

  public for(key: K) {
    const b = this.builders.get(key);
    if (b) { return b; }
    const ret = new DependencyBuilder<A>();
    this.builders.set(key, ret);
    return ret;
  }

  /**
   * @deprecated Use 'for'
   */
  public get(key: K) {
    return this.for(key);
  }

  public unsatisfiedBuilders() {
    const ret = new Array<[K, DependencyBuilder<A>]>();

    for (const [k, builder] of this.builders.entries()) {
      if (builder.hasUnsatisfiedConsumers) {
        ret.push([k, builder]);
      }
    }

    return ret;
  }
}

export interface GraphProps<A> extends GraphNodeProps<A> {
  /**
   * Initial nodes in the workflow
   */
  readonly nodes?: GraphNode<A>[];
}

export class Graph<A> extends GraphNode<A> {
  public static override of<A, B>(id: string, data: A, nodes?: GraphNode<B>[]) {
    return new Graph<A | B>(id, { data, nodes });
  }

  private readonly children = new Map<string, GraphNode<A>>();

  constructor(name: string, props: GraphProps<A>={}) {
    super(name, props);

    if (props.nodes) {
      this.add(...props.nodes);
    }
  }

  public get nodes() {
    return new Set(this.children.values());
  }

  public tryGetChild(name: string) {
    return this.children.get(name);
  }

  public contains(node: GraphNode<A>) {
    return this.nodes.has(node);
  }

  public add(...nodes: Array<GraphNode<A>>) {
    for (const node of nodes) {
      node._setParentGraph(this);
      if (this.children.has(node.id)) {
        throw new Error(`Node with duplicate id: ${node.id}`);
      }
      this.children.set(node.id, node);
    }
  }

  public absorb(other: Graph<A>) {
    this.add(...other.nodes);
  }

  /**
   * Return topologically sorted tranches of nodes at this graph level
   */
  public sortedChildren(fail=true): GraphNode<A>[][] {
    // Project dependencies to current children
    const nodes = this.nodes;
    const projectedDependencies = projectDependencies(this.deepDependencies(), (node) => {
      while (!nodes.has(node) && node.parentGraph) {
        node = node.parentGraph;
      }
      return nodes.has(node) ? [node] : [];
    });

    return topoSort(nodes, projectedDependencies, fail);
  }

  /**
   * Return a topologically sorted list of non-Graph nodes in the entire subgraph
   */
  public sortedLeaves(): GraphNode<A>[][] {
    // Project dependencies to leaf nodes
    const descendantsMap = new Map<GraphNode<A>, GraphNode<A>[]>();
    findDescendants(this);

    function findDescendants(node: GraphNode<A>): GraphNode<A>[] {
      const ret: GraphNode<A>[] = [];

      if (node instanceof Graph) {
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

  public render() {
    const lines = new Array<string>();
    recurse(this, '', true);
    return lines.join('\n');

    function recurse(x: GraphNode<A>, indent: string, last: boolean) {
      const bullet = last ? '└─' : '├─';
      const follow = last ? '  ' : '│ ';
      lines.push(`${indent} ${bullet} ${x}${depString(x)}`);
      if (x instanceof Graph) {
        let i = 0;
        const sortedNodes = Array.prototype.concat.call([], ...x.sortedChildren(false));
        for (const child of sortedNodes) {
          recurse(child, `${indent} ${follow} `, i++ == x.nodes.size - 1);
        }
      }
    }

    function depString(node: GraphNode<A>) {
      if (node.dependencies.length > 0) {
        return ` -> ${Array.from(node.dependencies).join(', ')}`;
      }
      return '';
    }
  }

  public renderDot() {
    const lines = new Array<string>();

    lines.push('digraph G {');
    lines.push('  # Arrows represent an "unlocks" relationship (opposite of dependency). So chosen');
    lines.push('  # because the layout looks more natural that way.');
    lines.push('  # To represent subgraph dependencies, subgraphs are represented by BEGIN/END nodes.');
    lines.push('  # To render: `dot -Tsvg input.dot > graph.svg`, open in a browser.');
    lines.push('  node [shape="box"];');
    for (const child of this.nodes) {
      recurse(child);
    }
    lines.push('}');

    return lines.join('\n');

    function recurse(node: GraphNode<A>) {
      let dependencySource;

      if (node instanceof Graph) {
        lines.push(`${graphBegin(node)} [shape="cds", style="filled", fillcolor="#b7deff"];`);
        lines.push(`${graphEnd(node)} [shape="cds", style="filled", fillcolor="#b7deff"];`);
        dependencySource = graphBegin(node);
      } else {
        dependencySource = nodeLabel(node);
        lines.push(`${nodeLabel(node)};`);
      }

      for (const dep of node.dependencies) {
        const dst = dep instanceof Graph ? graphEnd(dep) : nodeLabel(dep);
        lines.push(`${dst} -> ${dependencySource};`);
      }

      if (node instanceof Graph && node.nodes.size > 0) {
        for (const child of node.nodes) {
          recurse(child);
        }

        // Add dependency arrows between the "subgraph begin" and the first rank of
        // the children, and the last rank of the children and "subgraph end" nodes.
        const sortedChildren = node.sortedChildren(false);
        for (const first of sortedChildren[0]) {
          const src = first instanceof Graph ? graphBegin(first) : nodeLabel(first);
          lines.push(`${graphBegin(node)} -> ${src};`);
        }
        for (const last of sortedChildren[sortedChildren.length - 1]) {
          const dst = last instanceof Graph ? graphEnd(last) : nodeLabel(last);
          lines.push(`${dst} -> ${graphEnd(node)};`);
        }
      }
    }

    function id(node: GraphNode<A>) {
      return node.rootPath().slice(1).map(n => n.id).join('.');
    }

    function nodeLabel(node: GraphNode<A>) {
      return `"${id(node)}"`;
    }

    function graphBegin(node: Graph<A>) {
      return `"BEGIN ${id(node)}"`;
    }

    function graphEnd(node: Graph<A>) {
      return `"END ${id(node)}"`;
    }
  }

  public consoleLog(_indent: number = 0) {
    process.stdout.write(this.render() + '\n');
  }

  /**
   * Return the union of all dependencies of the descendants of this graph
   */
  private deepDependencies() {
    const ret = new Map<GraphNode<A>, Set<GraphNode<A>>>();
    for (const node of this.nodes) {
      recurse(node);
    }
    return ret;

    function recurse(node: GraphNode<A>) {
      let deps = ret.get(node);
      if (!deps) {
        ret.set(node, deps = new Set());
      }
      for (let dep of node.dependencies) {
        deps.add(dep);
      }
      if (node instanceof Graph) {
        for (const child of node.nodes) {
          recurse(child);
        }
      }
    }
  }

  /**
   * Return all non-Graph nodes
   */
  public allLeaves(): GraphNodeCollection<A> {
    const ret: GraphNode<A>[] = [];
    recurse(this);
    return new GraphNodeCollection(ret);

    function recurse(node: GraphNode<A>) {
      if (node instanceof Graph) {
        for (const child of node.nodes) {
          recurse(child);
        }
      } else {
        ret.push(node);
      }
    }
  }
}

/**
 * A collection of graph nodes
 */
export class GraphNodeCollection<A> {
  public readonly nodes: GraphNode<A>[];

  constructor(nodes: Iterable<GraphNode<A>>) {
    this.nodes = Array.from(nodes);
  }

  /**
   * Add one or more dependencies to all nodes in the collection
   */
  public dependOn(...dependencies: Array<GraphNode<A> | undefined>) {
    for (const node of this.nodes) {
      node.dependOn(...dependencies.filter(isDefined));
    }
  }

  /**
   * Return the topographically first node in the collection
   */
  public first() {
    const nodes = new Set(this.nodes);
    const sorted = this.nodes[0].rootGraph.sortedLeaves();
    for (const tranche of sorted) {
      for (const node of tranche) {
        if (nodes.has(node)) {
          return node;
        }
      }
    }

    throw new Error(`Could not calculate first node between ${this}`);
  }

  /**
  * Returns the graph node that's shared between these nodes
  */
  public commonAncestor() {
    const paths = new Array<GraphNode<A>[]>();
    for (const x of this.nodes) {
      paths.push(x.rootPath());
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
      throw new Error(`Could not determine a shared parent between nodes: ${originalPaths.map(nodes => nodes.map(n => n.id).join('/'))}`);
    }

    return paths[0][0];
  }

  public toString() {
    return this.nodes.map(n => `${n}`).join(', ');
  }
}

/**
 * Dependency map of nodes in this graph, taking into account dependencies between nodes in subgraphs
 *
 * Guaranteed to return an entry in the map for every node in the current graph.
 */
function projectDependencies<A>(dependencies: Map<GraphNode<A>, Set<GraphNode<A>>>, project: (x: GraphNode<A>) => GraphNode<A>[]) {
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

export function isGraph<A>(x: GraphNode<A>): x is Graph<A> {
  return x instanceof Graph;
}
