import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import { Link, Node, NodeLinks, NodeMetadata } from './model';

/**
 * @experimental
 */
export class Mirror extends cdk.Construct {
  public static readonly FileName = 'mirror.json';

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);
  }

  protected synthesize(session: cdk.ISynthesisSession) {
    const lookup: { [path: string]: Node } = { };

    const visit = (construct: cdk.IConstruct): Node => {
      const children = construct.node.children.map(visit);
      const metadata = this.renderMetadata(construct);
      const node: Node = {
        id: construct.node.id || 'App',
        path: construct.node.path,
        children: children.length === 0 ? undefined : children,
        metadata: Object.keys(metadata).length === 0 ? undefined : metadata,
      };

      lookup[node.path] = node;

      return node;
    };

    const root = visit(this.node.root);

    // add links to all nodes (in both sides of the edge).
    for (const link of this.findLinks()) {
      const sourceNode = lookup[link.sourcePath];
      const targetNode = lookup[link.targetPath];
      sourceNode.links = [ ...sourceNode.links || [], link ];
      targetNode.links = [ ...targetNode.links || [], link ];
    }

    // temporary workaround until toolkit actually retains the cloud assembly
    fs.writeFileSync(Mirror.FileName, JSON.stringify(root, undefined, 2));

    session.store.writeJson(Mirror.FileName, root);
  }

  private renderMetadata(construct: cdk.IConstruct): NodeMetadata {
    if (cdk.Resource.isResource(construct)) {
      return {
        resourceType: construct.resourceType,
        logicalId: construct.node.resolve(construct.logicalId)
      };
    }

    return {};
  }

  private findLinks(): NodeLinks {
    const links = new Array<Link>();

    for (const edge of this.node.root.node.findReferences()) {
      if (cdk.GetAtt.isGetAtt(edge.reference)) {
        links.push({
          sourcePath: edge.source.node.path,
          targetPath: edge.target.node.path,
          attribute: edge.reference.attributeName
        });
      } else if (cdk.Ref.isRef(edge.reference)) {
        links.push({
          sourcePath: edge.source.node.path,
          targetPath: edge.target.node.path
        });
      }
    }

    return links;
  }
}
