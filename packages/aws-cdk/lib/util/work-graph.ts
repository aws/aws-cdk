import * as cxapi from '@aws-cdk/cx-api';

enum WorkType {
  STACK_DEPLOY = 'stack-deploy',
  ASSET_BUILD = 'asset-build',
  ASSET_PUBLISH = 'asset-publish',
};

interface WorkNode {
  readonly id: string;
  readonly type: WorkType;
  readonly dependencies: string[];
}

export class WorkGraph {
  public static fromCloudArtifacts(artifacts: cxapi.CloudArtifact[]) {
    const graph = new WorkGraph();
    // eslint-disable-next-line no-console
    console.log('artifacts', artifacts);
    for (const artifact of artifacts) {
      if (cxapi.AssetManifestArtifact.isAssetManifestArtifact(artifact)) {
        const buildNode = {
          id: `${artifact.id}-build`,
          type: WorkType.ASSET_BUILD,
          dependencies: getDepIds(artifact.dependencies),
        };
        graph.addNode(buildNode);
        graph.addNode({
          id: `${artifact.id}-publish`,
          type: WorkType.ASSET_PUBLISH,
          dependencies: [buildNode.id],
        });
      } else {
        graph.addNode({
          id: artifact.id,
          type: WorkType.STACK_DEPLOY,
          dependencies: getDepIds(artifact.dependencies),
        });
      }
    }

    return graph;

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

  public constructor(nodes: Record<string, WorkNode> = {}) {
    this.nodes = nodes;
  }

  public addNode(node: WorkNode) {
    this.nodes[node.id] = node;
  }

  public toString() {
    const n = [];
    for (const [id, node] of Object.entries(this.nodes)) {
      n.push([id, node.type, node.dependencies]);
    }
    return n;
  }
}
