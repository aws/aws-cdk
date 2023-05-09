/* eslint-disable no-console */
import { WorkNode, DeploymentState, StackNode, AssetBuildNode, AssetPublishNode, WorkType } from './work-graph-types';

export class WorkGraph {
  public readonly nodes: Record<string, WorkNode>;
  private readonly readyPool: Array<WorkNode> = [];
  public error?: Error;

  public constructor(nodes: Record<string, WorkNode> = {}) {
    this.nodes = nodes;
  }

  public addNodes(...nodes: WorkNode[]) {
    for (const node of nodes) {
      this.nodes[node.id] = node;
    }
  }

  public done(): boolean {
    return Object.values(this.nodes).every((n) => [DeploymentState.COMPLETED, DeploymentState.DEPLOYING].includes(n.deploymentState));
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
        case WorkType.STACK_DEPLOY:
          await actions.deployStack(x);
          break;
        case WorkType.ASSET_BUILD:
          await actions.buildAsset(x);
          break;
        case WorkType.ASSET_PUBLISH:
          await actions.publishAsset(x);
          break;
      }
    });
  }

  private forAllArtifacts(n: number, fn: (x: WorkNode) => Promise<void>): Promise<void> {
    const graph = this;

    console.log('forallartiacts');
    return new Promise((ok, fail) => {
      let active = 0;

      start();

      function start() {
        console.log('start');
        while (graph.hasNext() && active < n) {
          console.log('startingone');
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
        console.log('startOne');
        active++;
        void fn(x).then(() => {
          console.log('fn finised');
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

  public deployed(node: WorkNode) {
    node.deploymentState = DeploymentState.COMPLETED;
  }

  public failed(node: WorkNode, error?: Error) {
    console.log('managing failure');
    this.error = error;
    node.deploymentState = DeploymentState.FAILED;
    this.skipRest();
  }

  public toString() {
    const n = [];
    for (const [id, node] of Object.entries(this.nodes)) {
      n.push([id, node.type, node.dependencies]);
    }
    return n;
  }

  private updateReadyPool() {
    for (const node of Object.values(this.nodes)) {
      if (node.deploymentState === DeploymentState.PENDING &&
        (node.dependencies.length === 0 || node.dependencies.every((id) => this.nodes[id].deploymentState === 'completed'))) {
        node.deploymentState = DeploymentState.QUEUED;
        this.readyPool.push(node);
      }
    }
    for (let i = 0; i < this.readyPool.length; i++) {
      const node = this.readyPool[i];
      if (node.deploymentState !== DeploymentState.QUEUED) {
        this.readyPool.splice(i, 1);
      }
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

interface WorkGraphActions {
  deployStack: (stackNode: StackNode) => Promise<void>;
  buildAsset: (assetNode: AssetBuildNode) => Promise<void>;
  publishAsset: (assetNode: AssetPublishNode) => Promise<void>;
}