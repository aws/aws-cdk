import fs = require('fs');
import path = require('path');

import { ArtifactType } from '@aws-cdk/cx-api';
import { Construct, IConstruct, ISynthesisSession } from '../construct';

const FILE_PATH = 'construct-tree-metadata.json';

/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing metadata of the `Construct`s in the construct tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 * @experimental
 */
export class ConstructTreeMetadata extends Construct {
  constructor(scope: Construct) {
    super(scope, 'ConstructTreeMetadata');
  }

  protected synthesize(session: ISynthesisSession) {
    const lookup: { [path: string]: Node } = { };

    const visit = (construct: IConstruct): Node => {
      const children = construct.node.children.map(visit);
      const node: Node = {
        id: construct.node.id || 'App',
        path: construct.node.path,
        children: children.length === 0 ? undefined : children,
      };

      lookup[node.path] = node;

      return node;
    };

    const root = visit(this.node.root);

    const builder = session.assembly;
    fs.writeFileSync(path.join(builder.outdir, FILE_PATH), JSON.stringify(root, undefined, 2), { encoding: 'utf-8' });

    builder.addArtifact('ConstructTreeMetadata', {
      type: ArtifactType.CDK_METADATA,
      properties: {
        file: FILE_PATH
      }
    });
  }
}

interface Node {
  id: string;
  path: string;
  children?: Node[];
}