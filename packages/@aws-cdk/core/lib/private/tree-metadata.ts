import fs = require('fs');
import path = require('path');

import { ArtifactType } from '@aws-cdk/cx-api';
import { Construct, IConstruct, ISynthesisSession } from '../construct';
import { IInspectable, TreeInspector } from "../tree";

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
        children: children.length === 0 ? undefined : childrenMap,
        attributes: this.inferAttributes(construct)
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

  private inferAttributes(construct: IConstruct): { [key: string]: any } | undefined {
    // check if a construct implements IInspectable
    function canInspect(inspectable: any): inspectable is IInspectable {
      return (inspectable as IInspectable).inspect !== undefined;
    }

    const inspector = new TreeInspector();

    // get attributes from the inspector
    if (canInspect(construct)) {
      construct.inspect(inspector);
      return inspector.attributes;
    }
    return undefined;
  }
}

interface Node {
  id: string;
  path: string;
  children?: { [key: string]: Node };
  attributes?: { [key: string]: any };
}