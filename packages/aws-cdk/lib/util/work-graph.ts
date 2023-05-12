import { WorkNode, DeploymentState, StackNode, AssetBuildNode, AssetPublishNode } from './work-graph-types';

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

  public hasFailed(): boolean {
    return Object.values(this.nodes).some((n) => n.deploymentState === DeploymentState.FAILED);
  }

  public hasNext(): boolean {
    this.updateReadyPool();
    return this.readyPool.length > 0;
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
          // if (node.deploymentState !== DeploymentState.QUEUED) { continue; }

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
        void fn(x).then(() => {
          active[x.type]--;
          graph.deployed(x);
          start();
        }).catch((err) => {
          active[x.type]--;
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
    return Object.entries(this.nodes).map(([id, node]) =>
      `${id} := ${node.deploymentState} ${node.type} ${node.dependencies.size > 0 ? `(${Array.from(node.dependencies)})` : ''}`.trim(),
    ).join(', ');
  }

  /**
   * Ensure all dependencies actually exist. This protects against scenarios such as the following:
   * StackA depends on StackB, but StackB is not selected to deploy. The dependency is redundant
   * and will be dropped.
   * This assumes the manifest comes uncorrupted so we will not fail if a dependency is not found.
   */
  public removeUnavailableDependencies() {
    for (const node of Object.values(this.nodes)) {
      const removeDeps = [];
      for (const dep of node.dependencies) {
        if (this.nodes[dep] === undefined) {
          removeDeps.push(dep);
        }
      }
      removeDeps.forEach((d) => {
        node.dependencies.delete(d);
      });
    }
  }

  private updateReadyPool() {
    let activeCount = 0;
    let pendingCount = 0;
    for (const node of Object.values(this.nodes)) {
      switch (node.deploymentState) {
        case DeploymentState.DEPLOYING:
          activeCount += 1;
          break;
        case DeploymentState.PENDING:
          pendingCount += 1;
          if (Array.from(node.dependencies).every((id) => this.node(id).deploymentState === DeploymentState.COMPLETED)) {
            node.deploymentState = DeploymentState.QUEUED;
            this.readyPool.push(node);
          }
          break;
      }
    }

    for (let i = 0; i < this.readyPool.length; i++) {
      const node = this.readyPool[i];
      if (node.deploymentState !== DeploymentState.QUEUED) {
        this.readyPool.splice(i, 1);
      }
    }

    // Sort by reverse priority
    this.readyPool.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    if (this.readyPool.length === 0 && activeCount === 0 && pendingCount > 0) {
      throw new Error(`Unable to make progress anymore among: ${this}`);
    }
  }

  private skipRest() {
    for (const node of Object.values(this.nodes)) {
      if ([DeploymentState.QUEUED, DeploymentState.PENDING].includes(node.deploymentState)) {
        node.deploymentState = DeploymentState.SKIPPED;
      }
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