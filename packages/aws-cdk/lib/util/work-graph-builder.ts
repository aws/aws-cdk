import * as cxapi from '@aws-cdk/cx-api';
import { AssetManifest, IManifestEntry } from 'cdk-assets';
import { WorkGraph } from './work-graph';
import { DeploymentState, AssetBuildNode, WorkNode } from './work-graph-types';

export class WorkGraphBuilder {
  /**
   * Default priorities for nodes
   *
   * Assets builds have higher priority than the other two operations, to make good on our promise that
   * '--prebuild-assets' will actually do assets before stacks (if it can). Unfortunately it is the
   * default :(
   *
   * But between stack dependencies and publish dependencies, stack dependencies go first
   */
  public static PRIORITIES: Record<WorkNode['type'], number> = {
    'asset-build': 10,
    'asset-publish': 0,
    'stack': 5,
  };
  private readonly graph = new WorkGraph();

  constructor(private readonly prebuildAssets: boolean, private readonly idPrefix = '') { }

  private addStack(artifact: cxapi.CloudFormationStackArtifact) {
    this.graph.addNodes({
      type: 'stack',
      id: `${this.idPrefix}${artifact.id}`,
      dependencies: new Set(this.getDepIds(onlyStacks(artifact.dependencies))),
      stack: artifact,
      deploymentState: DeploymentState.PENDING,
      priority: WorkGraphBuilder.PRIORITIES.stack,
    });
  }

  /**
   * Oof, see this parameter list
   */
  // eslint-disable-next-line max-len
  private addAsset(parentStack: cxapi.CloudFormationStackArtifact, assetArtifact: cxapi.AssetManifestArtifact, assetManifest: AssetManifest, asset: IManifestEntry) {
    // Just the artifact identifier
    const assetId = asset.id.assetId;
    // Unique per destination where the artifact needs to go
    const assetDestinationId = `${asset.id}`;

    const buildId = `${this.idPrefix}${assetId}-build`;
    const publishNodeId = `${this.idPrefix}${assetDestinationId}-publish`;

    // Build node only gets added once because they are all the same
    if (!this.graph.tryGetNode(buildId)) {
      const node: AssetBuildNode = {
        type: 'asset-build',
        id: buildId,
        dependencies: new Set([
          ...this.getDepIds(assetArtifact.dependencies),
          // If we disable prebuild, then assets inherit (stack) dependencies from their parent stack
          ...!this.prebuildAssets ? this.getDepIds(onlyStacks(parentStack.dependencies)) : [],
        ]),
        parentStack,
        assetManifestArtifact: assetArtifact,
        assetManifest,
        asset,
        deploymentState: DeploymentState.PENDING,
        priority: WorkGraphBuilder.PRIORITIES['asset-build'],
      };
      this.graph.addNodes(node);
    }

    const publishNode = this.graph.tryGetNode(publishNodeId);
    if (!publishNode) {
      this.graph.addNodes({
        type: 'asset-publish',
        id: publishNodeId,
        dependencies: new Set([
          buildId,
        ]),
        parentStack,
        assetManifestArtifact: assetArtifact,
        assetManifest,
        asset,
        deploymentState: DeploymentState.PENDING,
        priority: WorkGraphBuilder.PRIORITIES['asset-publish'],
      });
    }

    for (const inheritedDep of this.getDepIds(onlyStacks(parentStack.dependencies))) {
      // The asset publish step also depends on the stacks that the parent depends on.
      // This is purely cosmetic: if we don't do this, the progress printing of asset publishing
      // is going to interfere with the progress bar of the stack deployment. We could remove this
      // for overall faster deployments if we ever have a better method of progress displaying.
      // Note: this may introduce a cycle if one of the parent's dependencies is another stack that
      // depends on this asset. To workaround this we remove these cycles once all nodes have
      // been added to the graph.
      this.graph.addDependency(publishNodeId, inheritedDep);
    }

    // This will work whether the stack node has been added yet or not
    this.graph.addDependency(`${this.idPrefix}${parentStack.id}`, publishNodeId);
  }

  public build(artifacts: cxapi.CloudArtifact[]): WorkGraph {
    const parentStacks = stacksFromAssets(artifacts);

    for (const artifact of artifacts) {
      if (cxapi.CloudFormationStackArtifact.isCloudFormationStackArtifact(artifact)) {
        this.addStack(artifact);
      } else if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
        const manifest = AssetManifest.fromFile(artifact.file);

        for (const entry of manifest.entries) {
          const parentStack = parentStacks.get(artifact);
          if (parentStack === undefined) {
            throw new Error('Found an asset manifest that is not associated with a stack');
          }
          this.addAsset(parentStack, artifact, manifest, entry);
        }
      } else if (cxapi.NestedCloudAssemblyArtifact.isNestedCloudAssemblyArtifact(artifact)) {
        const assembly = new cxapi.CloudAssembly(artifact.fullPath, { topoSort: false });
        const nestedGraph = new WorkGraphBuilder(this.prebuildAssets, `${this.idPrefix}${artifact.id}.`).build(assembly.artifacts);
        this.graph.absorb(nestedGraph);
      } else {
        // Ignore whatever else
      }
    }

    this.graph.removeUnavailableDependencies();

    // Remove any potentially introduced cycles between asset publishing and the stacks that depend on them.
    this.removeStackPublishCycles();

    return this.graph;
  }

  private getDepIds(deps: cxapi.CloudArtifact[]): string[] {
    const ids = [];
    for (const artifact of deps) {
      if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
        // Depend on only the publish step. The publish step will depend on the build step on its own.
        ids.push(`${this.idPrefix}${artifact.id}-publish`);
      } else {
        ids.push(`${this.idPrefix}${artifact.id}`);
      }
    }
    return ids;
  }

  /**
   * We may have accidentally introduced cycles in an attempt to make the messages printed to the
   * console not interfere with each other too much. Remove them again.
   */
  private removeStackPublishCycles() {
    const publishSteps = this.graph.nodesOfType('asset-publish');
    for (const publishStep of publishSteps) {
      for (const dep of publishStep.dependencies) {
        if (this.graph.reachable(dep, publishStep.id)) {
          publishStep.dependencies.delete(dep);
        }
      }
    }
  }
}

function stacksFromAssets(artifacts: cxapi.CloudArtifact[]) {
  const ret = new Map<cxapi.AssetManifestArtifact, cxapi.CloudFormationStackArtifact>();
  for (const stack of artifacts.filter(cxapi.CloudFormationStackArtifact.isCloudFormationStackArtifact)) {
    const assetArtifacts = stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact);
    for (const art of assetArtifacts) {
      ret.set(art, stack);
    }
  }

  return ret;
}

function onlyStacks(artifacts: cxapi.CloudArtifact[]) {
  return artifacts.filter(cxapi.CloudFormationStackArtifact.isCloudFormationStackArtifact);
}