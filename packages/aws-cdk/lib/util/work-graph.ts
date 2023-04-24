/* eslint-disable no-console */
import * as cxapi from '@aws-cdk/cx-api';

export enum WorkType {
  STACK_DEPLOY = 'stack-deploy',
  ASSET_BUILD = 'asset-build',
  ASSET_PUBLISH = 'asset-publish',
};

export enum DeploymentState {
  PENDING = 'pending',
  QUEUED = 'queued',
  DEPLOYING = 'deploying',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
};

export interface WorkNode {
  readonly id: string;
  readonly type: WorkType;
  readonly dependencies: string[];
  readonly artifact: cxapi.CloudArtifact;
  readonly stack: cxapi.CloudFormationStackArtifact;
  deploymentState: DeploymentState;
}

export class WorkGraph {
  public static fromCloudArtifacts(artifacts: cxapi.CloudArtifact[]) {
    const graph = new WorkGraph();

    // Associated stack will be lazily added for Assets
    const graphNodes: Omit<WorkNode, 'stack'>[] = [];
    const associatedStacks: Record<string, cxapi.CloudFormationStackArtifact> = {};

    for (const artifact of artifacts) {
      if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
        const buildNode = {
          id: `${artifact.id}-build`,
          type: WorkType.ASSET_BUILD,
          dependencies: getDepIds(artifact.dependencies),
          artifact,
          deploymentState: DeploymentState.PENDING,
        };
        graphNodes.push(buildNode);
        graphNodes.push({
          id: `${artifact.id}-publish`,
          type: WorkType.ASSET_PUBLISH,
          dependencies: [buildNode.id],
          artifact,
          deploymentState: DeploymentState.PENDING,
        });
      } else if (cxapi.CloudFormationStackArtifact.isCloudFormationStackArtifact(artifact)) {
        graphNodes.push({
          id: artifact.id,
          type: WorkType.STACK_DEPLOY,
          dependencies: getDepIds(artifact.dependencies),
          artifact,
          deploymentState: DeploymentState.PENDING,
        });
        updateAssociatedStacks(artifact);
      }
    }

    // post-process stacks associated with each nodes because we only know
    // we have this information after all artifacts have been processed.
    const finalGraphNodes: WorkNode[] = [];
    for (const node of graphNodes) {
      const stack = associatedStacks[node.id];
      if (!stack) {
        throw new Error(`No stack associated with ${node.id} artifact. Something in the source code or asset manifest is wrong.`);
      }
      finalGraphNodes.push({
        ...node,
        stack,
      });
    }

    graph.addNodes(...finalGraphNodes);

    // Ensure all dependencies actually exist. This protects against scenarios such as the following:
    // StackA depends on StackB, but StackB is not selected to deploy. The dependency is redundant
    // and will be dropped.
    for (const node of Object.values(graph.nodes)) {
      if (node.type !== WorkType.STACK_DEPLOY) { continue; }
      const removeDeps = [];
      for (const dep of node.dependencies) {
        if (graph.nodes[dep] === undefined) {
          removeDeps.push(dep);
        }
      }
      removeDeps.forEach((d) => {
        const i = node.dependencies.indexOf(d);
        node.dependencies.splice(i, 1);
      });
    }

    return graph;

    function updateAssociatedStacks(stack: cxapi.CloudFormationStackArtifact) {
      const assetArtifacts = stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact);
      for (const art of assetArtifacts) {
        associatedStacks[`${art.id}-publish`] = stack;
        associatedStacks[`${art.id}-build`] = stack;
      }
      associatedStacks[stack.id] = stack;
    }

    function getDepIds(deps: cxapi.CloudArtifact[]): string[] {
      const ids = [];
      for (const artifact of deps) {
        if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
          // Depend on only the publish step. The publish step will depend on the build step on its own.
          ids.push(`${artifact.id}-publish`);
        } else {
          ids.push(artifact.id);
        }
      }
      return ids;
    }
  }

  private readonly nodes: Record<string, WorkNode>;
  private readonly readyPool: Array<WorkNode> = [];
  public error?: Error;

  private constructor(nodes: Record<string, WorkNode> = {}) {
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
