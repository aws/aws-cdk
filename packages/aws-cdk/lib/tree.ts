import * as path from 'path';
import { CloudAssembly } from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { trace } from './logging';

/**
 * Source information on a construct (class fqn and version)
 */
export interface ConstructInfo {
  readonly fqn: string;
  readonly version: string;
}

/**
 * A node in the construct tree.
 */
export interface ConstructTreeNode {
  readonly id: string;
  readonly path: string;
  readonly children?: { [key: string]: ConstructTreeNode };
  readonly attributes?: { [key: string]: any };

  /**
   * Information on the construct class that led to this node, if available
   */
  readonly constructInfo?: ConstructInfo;
}

export function some(node: ConstructTreeNode, predicate: (n: ConstructTreeNode) => boolean): boolean {
  return node != null && (predicate(node) || findInChildren());

  function findInChildren(): boolean {
    if (node.children == null) { return false; }

    for (const name in node.children) {
      if (some(node.children[name], predicate)) {
        return true;
      }
    }
    return false;
  }
}

export function loadTree(assembly: CloudAssembly) {
  try {
    const outdir = assembly.directory;
    const fileName = assembly.tree()?.file;
    return fileName ? fs.readJSONSync(path.join(outdir, fileName)).tree : {};
  } catch (e) {
    trace(`Failed to get tree.json file: ${e}. Proceeding with empty tree.`);
    return {};
  }
}

export function loadTreeFromDir(outdir: string) {
  try {
    return fs.readJSONSync(path.join(outdir, 'tree.json')).tree;
  } catch (e) {
    trace(`Failed to get tree.json file: ${e}. Proceeding with empty tree.`);
    return {};
  }
}
