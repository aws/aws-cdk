import fs = require('fs');
import path = require('path');

import { ArtifactType } from '@aws-cdk/cx-api';
import { CfnResource, Construct, IConstruct, ISynthesisSession } from '../index';

const FILE_PATH = 'tree.json';

/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 * @experimental
 */
export class TreeMetadata extends Construct {
  constructor(scope: Construct) {
    super(scope, 'Tree');
  }

  protected synthesize(session: ISynthesisSession) {
    const lookup: { [path: string]: Node } = { };

    const visit = (construct: IConstruct): Node => {
      const children = construct.node.children.map(visit);
      const childrenMap = children.reduce((map, child) => Object.assign(map, { [child.id]: child }), {});
      const node: Node = {
        id: construct.node.id || 'App',
        path: construct.node.path,
        type: this.inferType(construct),
        properties: this.inferProperties(construct),
        children: children.length === 0 ? undefined : childrenMap,
      };

      lookup[node.path] = node;

      return node;
    };

    const tree = {
      version: 'tree-0.1',
      tree: visit(this.node.root),
    };

    const builder = session.assembly;
    fs.writeFileSync(path.join(builder.outdir, FILE_PATH), JSON.stringify(tree, undefined, 2), { encoding: 'utf-8' });

    builder.addArtifact('Tree', {
      type: ArtifactType.CDK_TREE,
      properties: {
        file: FILE_PATH
      }
    });
  }

  private inferType(construct: IConstruct): Type | undefined {
    if (CfnResource.isCfnResource(construct)) {
      return {
        cfnResourceType: (construct as CfnResource).cfnResourceType
      };
    }
    return undefined;
  }

  private inferProperties(construct: IConstruct): { [key: string]: any } | undefined {
    if (CfnResource.isCfnResource(construct)) {
      return (construct as any).cfnProperties;
    } else {
      return undefined;
    }
  }
}

interface Node {
  id: string;
  path: string;
  type?: Type;
  properties?: { [key: string]: any };
  children?: { [key: string]: Node };
}

interface Type {
  cfnResourceType?: string;
}