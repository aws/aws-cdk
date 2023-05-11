import * as cxapi from '@aws-cdk/cx-api';
import { AssetManifest, IManifestEntry } from 'cdk-assets';
import { WorkGraph } from './work-graph';
import { DeploymentState, AssetBuildNode } from './work-graph-types';

export class WorkGraphBuilder {
  private readonly graph = new WorkGraph();
  private readonly assetBuildNodes = new Map<string, AssetBuildNode>;

  constructor(private readonly prebuildAssets: boolean, private readonly idPrefix = '') { }

  private addStack(artifact: cxapi.CloudFormationStackArtifact) {
    this.graph.addNodes({
      type: 'stack',
      id: `${this.idPrefix}${artifact.id}`,
      dependencies: this.getDepIds(artifact.dependencies),
      stack: artifact,
      deploymentState: DeploymentState.PENDING,
    });
  }

  /**
   * Oof, see this parameter list
   */
  // eslint-disable-next-line max-len
  private addAsset(parentStack: cxapi.CloudFormationStackArtifact, assetArtifact: cxapi.AssetManifestArtifact, assetManifest: AssetManifest, asset: IManifestEntry) {
    const buildId = `${this.idPrefix}${asset.id}-build`;

    // Add the build node, but only one per "source"
    // FIXME: May need to take directory into account for this key
    const assetBuildNodeKey = JSON.stringify(asset.genericSource);
    if (!this.assetBuildNodes.has(assetBuildNodeKey)) {
      const node: AssetBuildNode = {
        type: 'asset-build',
        id: buildId,
        dependencies: [
          ...this.getDepIds(assetArtifact.dependencies),
          // If we disable prebuild, then assets inherit dependencies from their parent stack
          ...!this.prebuildAssets ? this.getDepIds(parentStack.dependencies) : [],
        ],
        parentStack,
        assetManifestArtifact: assetArtifact,
        assetManifest,
        asset,
        deploymentState: DeploymentState.PENDING,
      };
      this.assetBuildNodes.set(assetBuildNodeKey, node);
      this.graph.addNodes(node);
    }

    // Always add the publish
    const publishNodeId = `${this.idPrefix}${asset.id}-publish`;
    this.graph.addNodes({
      type: 'asset-publish',
      id: publishNodeId,
      dependencies: [buildId],
      parentStack,
      assetManifestArtifact: assetArtifact,
      assetManifest,
      asset,
      deploymentState: DeploymentState.PENDING,
    });
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
        const assembly = new cxapi.CloudAssembly(artifact.fullPath);
        // FIXME: make artifact IDs unique
        const nestedGraph = new WorkGraphBuilder(this.prebuildAssets, `${this.idPrefix}${artifact.id}.`).build(assembly.artifacts);
        this.graph.absorb(nestedGraph);
      } else {
        // Ignore whatever else
      }
    }

    this.graph.removeUnavailableDependencies();
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