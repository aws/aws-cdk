/* eslint-disable no-console */
import { WorkNode, DeploymentState, StackNode, AssetBuildNode, AssetPublishNode } from './work-graph-types';

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
        node.dependencies.push(...ld);
        this.lazyDependencies.delete(node.id);
      }

      this.nodes[node.id] = node;
    }
  }

  /**
   * Add a dependency, that may come before or after the nodes involved
   */
  public addDependency(fromId: string, toId: string) {
    const node = this.nodes[fromId];
    if (node) {
      node.dependencies.push(toId);
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

  public next(): WorkNode | undefined {
    this.updateReadyPool();
    if (this.readyPool.length > 0) {
      const node = this.readyPool.shift()!;
      // we experienced a failed deployment elsewhere
      if (node.deploymentState !== DeploymentState.QUEUED) { return undefined; }
      node.deploymentState = DeploymentState.DEPLOYING;
      return node;
    }
    return undefined;
  }

  public doParallel(concurrency: number, actions: WorkGraphActions) {
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

  private forAllArtifacts(n: number, fn: (x: WorkNode) => Promise<void>): Promise<void> {
    const graph = this;

    return new Promise((ok, fail) => {
      let active = 0;

      start();

      function start() {
        while (graph.hasNext() && active < n) {
          startOne(graph.next()!);
        }

        if (graph.done() && active === 0) {
          ok();
        }

        // wait for other active deploys to finish before failing
        if (graph.hasFailed() && active === 0) {
          fail(graph.error);
        }
      }

      function startOne(x: WorkNode) {
        active++;
        void fn(x).then(() => {
          active--;
          graph.deployed(x);
          start();
        }).catch((err) => {
          active--;
          // By recording the failure immediately as the queued task exits, we prevent the next
          // queued task from starting.
          graph.failed(x, err);
          start();
        });
      }
    });
  }

  private done(): boolean {
    return Object.values(this.nodes).every((n) => [DeploymentState.COMPLETED, DeploymentState.DEPLOYING].includes(n.deploymentState));
  }

  private deployed(node: WorkNode) {
    node.deploymentState = DeploymentState.COMPLETED;
  }

  private failed(node: WorkNode, error?: Error) {
    this.error = error;
    node.deploymentState = DeploymentState.FAILED;
    this.skipRest();
  }

  public toString() {
    return Object.entries(this.nodes).map(([id, node]) =>
      `${id} -> ${node.type} ${node.deploymentState} ${node.dependencies}`,
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
        const i = node.dependencies.indexOf(d);
        node.dependencies.splice(i, 1);
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
          if (node.dependencies.every((id) => this.node(id).deploymentState === DeploymentState.COMPLETED)) {
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