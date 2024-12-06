import { parallelPromises } from './parallel';
import { WorkNode, DeploymentState, StackNode, AssetBuildNode, AssetPublishNode } from './work-graph-types';
import { debug, trace } from '../logging';

export type Concurrency = number | Record<WorkNode['type'], number>;

export class WorkGraph {
  public readonly nodes: Record<string, WorkNode>;
  private readonly readyPool: Array<WorkNode> = [];
  private readonly lazyDependencies = new Map<string, string[]>();
  public error?: Error;

  public constructor(nodes: Record<string, WorkNode> = {}) {
    this.nodes = { ...nodes };
  }

  public addNodes(...nodes: WorkNode[]) {
    for (const node of nodes) {
      if (this.nodes[node.id]) {
        throw new Error(`Duplicate use of node id: ${node.id}`);
      }

      const ld = this.lazyDependencies.get(node.id);
      if (ld) {
        for (const x of ld) {
          node.dependencies.add(x);
        }
        this.lazyDependencies.delete(node.id);
      }

      this.nodes[node.id] = node;
    }
  }

  public removeNode(nodeId: string | WorkNode) {
    const id = typeof nodeId === 'string' ? nodeId : nodeId.id;
    const removedNode = this.nodes[id];

    this.lazyDependencies.delete(id);
    delete this.nodes[id];

    if (removedNode) {
      for (const node of Object.values(this.nodes)) {
        node.dependencies.delete(removedNode.id);
      }
    }
  }

  /**
   * Return all nodes of a given type
   */
  public nodesOfType<T extends WorkNode['type']>(type: T): Extract<WorkNode, { type: T }>[] {
    return Object.values(this.nodes).filter(n => n.type === type) as any;
  }

  /**
   * Return all nodes that depend on a given node
   */
  public dependees(nodeId: string | WorkNode) {
    const id = typeof nodeId === 'string' ? nodeId : nodeId.id;
    return Object.values(this.nodes).filter(n => n.dependencies.has(id));
  }

  /**
   * Add a dependency, that may come before or after the nodes involved
   */
  public addDependency(fromId: string, toId: string) {
    const node = this.nodes[fromId];
    if (node) {
      node.dependencies.add(toId);
      return;
    }
    let lazyDeps = this.lazyDependencies.get(fromId);
    if (!lazyDeps) {
      lazyDeps = [];
      this.lazyDependencies.set(fromId, lazyDeps);
    }
    lazyDeps.push(toId);
  }

  public tryGetNode(id: string): WorkNode | undefined {
    return this.nodes[id];
  }

  public node(id: string) {
    const ret = this.nodes[id];
    if (!ret) {
      throw new Error(`No node with id ${id} among ${Object.keys(this.nodes)}`);
    }
    return ret;
  }

  public absorb(graph: WorkGraph) {
    this.addNodes(...Object.values(graph.nodes));
  }

  private hasFailed(): boolean {
    return Object.values(this.nodes).some((n) => n.deploymentState === DeploymentState.FAILED);
  }

  public doParallel(concurrency: Concurrency, actions: WorkGraphActions) {
    return this.forAllArtifacts(concurrency, async (x: WorkNode) => {
      switch (x.type) {
        case 'stack':
          await actions.deployStack(x);
          break;
        case 'asset-build':
          await actions.buildAsset(x);
          break;
        case 'asset-publish':
          await actions.publishAsset(x);
          break;
      }
    });
  }

  /**
   * Return the set of unblocked nodes
   */
  public ready(): ReadonlyArray<WorkNode> {
    this.updateReadyPool();
    return this.readyPool;
  }

  private forAllArtifacts(n: Concurrency, fn: (x: WorkNode) => Promise<void>): Promise<void> {
    const graph = this;

    // If 'n' is a number, we limit all concurrency equally (effectively we will be using totalMax)
    // If 'n' is a record, we limit each job independently (effectively we will be using max)
    const max: Record<WorkNode['type'], number> = typeof n === 'number' ?
      {
        'asset-build': n,
        'asset-publish': n,
        'stack': n,
      } : n;
    const totalMax = typeof n === 'number' ? n : sum(Object.values(n));

    return new Promise((ok, fail) => {
      let active: Record<WorkNode['type'], number> = {
        'asset-build': 0,
        'asset-publish': 0,
        'stack': 0,
      };
      function totalActive() {
        return sum(Object.values(active));
      }

      start();

      function start() {
        graph.updateReadyPool();

        for (let i = 0; i < graph.readyPool.length; ) {
          const node = graph.readyPool[i];

          if (active[node.type] < max[node.type] && totalActive() < totalMax) {
            graph.readyPool.splice(i, 1);
            startOne(node);
          } else {
            i += 1;
          }
        }

        if (totalActive() === 0) {
          if (graph.done()) {
            ok();
          }
          // wait for other active deploys to finish before failing
          if (graph.hasFailed()) {
            fail(graph.error);
          }
        }
      }

      function startOne(x: WorkNode) {
        x.deploymentState = DeploymentState.DEPLOYING;
        active[x.type]++;
        void fn(x)
          .finally(() => {
            active[x.type]--;
          })
          .then(() => {
            graph.deployed(x);
            start();
          }).catch((err) => {
            // By recording the failure immediately as the queued task exits, we prevent the next
            // queued task from starting.
            graph.failed(x, err);
            start();
          });
      }
    });
  }

  private done(): boolean {
    return Object.values(this.nodes).every((n) => DeploymentState.COMPLETED === n.deploymentState);
  }

  private deployed(node: WorkNode) {
    node.deploymentState = DeploymentState.COMPLETED;
  }

  private failed(node: WorkNode, error?: Error) {
    this.error = error;
    node.deploymentState = DeploymentState.FAILED;
    this.skipRest();
    this.readyPool.splice(0);
  }

  public toString() {
    return [
      'digraph D {',
      ...Object.entries(this.nodes).flatMap(([id, node]) => renderNode(id, node)),
      '}',
    ].join('\n');

    function renderNode(id: string, node: WorkNode): string[] {
      const ret = [];
      if (node.deploymentState === DeploymentState.COMPLETED) {
        ret.push(`  ${gv(id, { style: 'filled', fillcolor: 'yellow', comment: node.note })};`);
      } else {
        ret.push(`  ${gv(id, { comment: node.note })};`);
      }
      for (const dep of node.dependencies) {
        ret.push(`  ${gv(id)} -> ${gv(dep)};`);
      }
      return ret;
    }

  }

  /**
   * Ensure all dependencies actually exist. This protects against scenarios such as the following:
   * StackA depends on StackB, but StackB is not selected to deploy. The dependency is redundant
   * and will be dropped.
   * This assumes the manifest comes uncorrupted so we will not fail if a dependency is not found.
   */
  public removeUnavailableDependencies() {
    for (const node of Object.values(this.nodes)) {
      const removeDeps = Array.from(node.dependencies).filter((dep) => this.nodes[dep] === undefined);

      removeDeps.forEach((d) => {
        node.dependencies.delete(d);
      });
    }
  }

  /**
   * Remove all asset publishing steps for assets that are already published, and then build
   * that aren't used anymore.
   *
   * Do this in parallel, because there may be a lot of assets in an application (seen in practice: >100 assets)
   */
  public async removeUnnecessaryAssets(isUnnecessary: (x: AssetPublishNode) => Promise<boolean>) {
    debug('Checking for previously published assets');

    const publishes = this.nodesOfType('asset-publish');

    const classifiedNodes = await parallelPromises(
      8,
      publishes.map((assetNode) => async() => [assetNode, await isUnnecessary(assetNode)] as const));

    const alreadyPublished = classifiedNodes.filter(([_, unnecessary]) => unnecessary).map(([assetNode, _]) => assetNode);
    for (const assetNode of alreadyPublished) {
      this.removeNode(assetNode);
    }

    debug(`${publishes.length} total assets, ${publishes.length - alreadyPublished.length} still need to be published`);

    // Now also remove any asset build steps that don't have any dependencies on them anymore
    const unusedBuilds = this.nodesOfType('asset-build').filter(build => this.dependees(build).length === 0);
    for (const unusedBuild of unusedBuilds) {
      this.removeNode(unusedBuild);
    }
  }

  private updateReadyPool() {
    const activeCount = Object.values(this.nodes).filter((x) => x.deploymentState === DeploymentState.DEPLOYING).length;
    const pendingCount = Object.values(this.nodes).filter((x) => x.deploymentState === DeploymentState.PENDING).length;

    const newlyReady = Object.values(this.nodes).filter((x) =>
      x.deploymentState === DeploymentState.PENDING &&
      Array.from(x.dependencies).every((id) => this.node(id).deploymentState === DeploymentState.COMPLETED));

    // Add newly available nodes to the ready pool
    for (const node of newlyReady) {
      node.deploymentState = DeploymentState.QUEUED;
      this.readyPool.push(node);
    }

    // Remove nodes from the ready pool that have already started deploying
    retainOnly(this.readyPool, (node) => node.deploymentState === DeploymentState.QUEUED);

    // Sort by reverse priority
    this.readyPool.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    if (this.readyPool.length === 0 && activeCount === 0 && pendingCount > 0) {
      const cycle = this.findCycle() ?? ['No cycle found!'];
      trace(`Cycle ${cycle.join(' -> ')} in graph ${this}`);
      throw new Error(`Unable to make progress anymore, dependency cycle between remaining artifacts: ${cycle.join(' -> ')} (run with -vv for full graph)`);
    }
  }

  private skipRest() {
    for (const node of Object.values(this.nodes)) {
      if ([DeploymentState.QUEUED, DeploymentState.PENDING].includes(node.deploymentState)) {
        node.deploymentState = DeploymentState.SKIPPED;
      }
    }
  }

  /**
   * Find cycles in a graph
   *
   * Not the fastest, but effective and should be rare
   */
  public findCycle(): string[] | undefined {
    const seen = new Set<string>();
    const self = this;
    for (const nodeId of Object.keys(this.nodes)) {
      const cycle = recurse(nodeId, [nodeId]);
      if (cycle) { return cycle; }
    }
    return undefined;

    function recurse(nodeId: string, path: string[]): string[] | undefined {
      if (seen.has(nodeId)) {
        return undefined;
      }
      try {
        for (const dep of self.nodes[nodeId].dependencies ?? []) {
          const index = path.indexOf(dep);
          if (index > -1) {
            return [...path.slice(index), dep];
          }

          const cycle = recurse(dep, [...path, dep]);
          if (cycle) { return cycle; }
        }

        return undefined;
      } finally {
        seen.add(nodeId);
      }
    }
  }

  /**
   * Whether the `end` node is reachable from the `start` node, following the dependency arrows
   */
  public reachable(start: string, end: string): boolean {
    const seen = new Set<string>();
    const self = this;
    return recurse(start);

    function recurse(current: string) {
      if (seen.has(current)) {
        return false;
      }
      seen.add(current);

      if (current === end) {
        return true;
      }
      for (const dep of self.nodes[current].dependencies) {
        if (recurse(dep)) {
          return true;
        }
      }
      return false;
    }
  }
}

export interface WorkGraphActions {
  deployStack: (stackNode: StackNode) => Promise<void>;
  buildAsset: (assetNode: AssetBuildNode) => Promise<void>;
  publishAsset: (assetNode: AssetPublishNode) => Promise<void>;
}

function sum(xs: number[]) {
  let ret = 0;
  for (const x of xs) {
    ret += x;
  }
  return ret;
}

function retainOnly<A>(xs: A[], pred: (x: A) => boolean) {
  xs.splice(0, xs.length, ...xs.filter(pred));
}

function gv(id: string, attrs?: Record<string, string | undefined>) {
  const attrString = Object.entries(attrs ?? {}).flatMap(([k, v]) => v !== undefined ? [`${k}="${v}"`] : []).join(',');

  return attrString ? `"${simplifyId(id)}" [${attrString}]` : `"${simplifyId(id)}"`;
}

function simplifyId(id: string) {
  return id.replace(/([0-9a-f]{6})[0-9a-f]{6,}/g, '$1');
}
