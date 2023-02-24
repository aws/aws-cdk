import * as fs from 'fs';
import * as path from 'path';

import { ArtifactType } from '@aws-cdk/cloud-assembly-schema';
import { Construct, IConstruct } from 'constructs';
import { ConstructInfo, constructInfoFromConstruct } from './runtime-info';
import { Annotations } from '../annotations';
import { Stack } from '../stack';
import { ISynthesisSession } from '../stack-synthesizers';
import { IInspectable, TreeInspector } from '../tree';

const FILE_PATH = 'tree.json';

/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 */
export class TreeMetadata extends Construct {
  constructor(scope: Construct) {
    super(scope, 'Tree');
  }

  /**
   * Create tree.json
   * @internal
   */
  public _synthesizeTree(session: ISynthesisSession) {
    const lookup: { [path: string]: Node } = { };

    const visit = (construct: IConstruct): Node => {
      const children = construct.node.children.map((c) => {
        try {
          return visit(c);
        } catch (e) {
          Annotations.of(this).addWarning(`Failed to render tree metadata for node [${c.node.id}]. Reason: ${e}`);
          return undefined;
        }
      });
      const childrenMap = children
        .filter((child) => child !== undefined)
        .reduce((map, child) => Object.assign(map, { [child!.id]: child }), {});

      const node: Node = {
        id: construct.node.id || 'App',
        path: construct.node.path,
        children: Object.keys(childrenMap).length === 0 ? undefined : childrenMap,
        attributes: this.synthAttributes(construct),
        constructInfo: constructInfoFromConstruct(construct),
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
        file: FILE_PATH,
      },
    });
  }

  private synthAttributes(construct: IConstruct): { [key: string]: any } | undefined {
    // check if a construct implements IInspectable
    function canInspect(inspectable: any): inspectable is IInspectable {
      return inspectable.inspect !== undefined;
    }

    const inspector = new TreeInspector();

    // get attributes from the inspector
    if (canInspect(construct)) {
      construct.inspect(inspector);
      return Stack.of(construct).resolve(inspector.attributes);
    }
    return undefined;
  }
}

interface Node {
  readonly id: string;
  readonly path: string;
  readonly children?: { [key: string]: Node };
  readonly attributes?: { [key: string]: any };

  /**
   * Information on the construct class that led to this node, if available
   */
  readonly constructInfo?: ConstructInfo;
}
