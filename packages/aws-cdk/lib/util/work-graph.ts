/* eslint-disable no-console */
import * as cxapi from '@aws-cdk/cx-api';
import { WorkNode, DeploymentState, AssetBuildNode, AssetPublishNode, PartialAssetNodeOptions, StackNode } from './work-graph-types';

export class WorkGraph {
  public static fromCloudArtifacts(artifacts: cxapi.CloudArtifact[], prebuildAssets: boolean) {
    const graph = new WorkGraph();

    // Associated stack will be lazily added for Assets
    const partialAssetNodes: PartialAssetNodeOptions[] = [];
    const parentStacks: Record<string, cxapi.CloudFormationStackArtifact> = {};

    for (const artifact of artifacts) {
      if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
        partialAssetNodes.push({
          id: `${artifact.id}`,
          dependencies: getDepIds(artifact.dependencies),
          asset: artifact,
        });
      } else if (cxapi.CloudFormationStackArtifact.isCloudFormationStackArtifact(artifact)) {
        graph.addNodes(new StackNode({
          id: artifact.id,
          dependencies: getDepIds(artifact.dependencies),
          stack: artifact,
        }));
        updateParentStacks(artifact);
      } else if (cxapi.TreeCloudArtifact.isTreeCloudArtifact(artifact)) {
        // ignore tree artifacts
        continue;
      } else if (cxapi.NestedCloudAssemblyArtifact.isNestedCloudAssemblyArtifact(artifact)) {
        console.log('NESTED!!!');
        const assembly = new cxapi.CloudAssembly(artifact.fullPath);
        const nestedGraph = WorkGraph.fromCloudArtifacts(assembly.artifacts, prebuildAssets);
        graph.addNodes(...Object.values(nestedGraph.nodes));
      }
    }

    // post-process parent stacks of each asset because we only know
    // this information after all artifacts have been processed.
    for (const assetNode of partialAssetNodes) {
      const stack = parentStacks[assetNode.id];
      if (!stack) {
        throw new Error(`No stack associated with ${assetNode.id} artifact. Something in the source code or asset manifest is wrong.`);
      }
      graph.addNodes(...[
        new AssetBuildNode({
          id: `${assetNode.id}-build`,
          // If we disable prebuild, then assets inherit dependencies from their parent stack
          dependencies: assetNode.dependencies.concat(!prebuildAssets ? onlyStackDeps(graph.getNode(stack.id).dependencies) : []),
          asset: assetNode.asset,
          parentStack: stack,
        }),
        new AssetPublishNode({
          id: `${assetNode.id}-publish`,
          dependencies: [`${assetNode.id}-build`], // only depend on the build asset step
          asset: assetNode.asset,
          parentStack: stack,
        }),
      ]);
    }

    // Ensure all dependencies actually exist. This protects against scenarios such as the following:
    // StackA depends on StackB, but StackB is not selected to deploy. The dependency is redundant
    // and will be dropped.
    // This assumes the manifest comes uncorrupted so we will not fail if a dependency is not found.
    for (const node of Object.values(graph.nodes)) {
      if (node.type !== 'stack') { continue; }
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

    function updateParentStacks(stack: cxapi.CloudFormationStackArtifact) {
      const assetArtifacts = stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact);
      for (const art of assetArtifacts) {
        parentStacks[art.id] = stack;
      }
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

    function onlyStackDeps(ids: string[]): string[] {
      return ids.filter((i) => !i.endsWith('publish'));
    }
  }

  private readonly nodes: Record<string, WorkNode>;
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

  private getNode(id: string) {
    return this.nodes[id];
  }
}

