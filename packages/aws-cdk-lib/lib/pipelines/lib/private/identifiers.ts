import * as crypto from 'crypto';
import { StackDeployment } from '../blueprint/stack-deployment';
import { GraphNode } from '../helpers-internal/graph';

export function hash<A>(obj: A) {
  const d = crypto.createHash('sha256');
  d.update(JSON.stringify(obj));
  return d.digest('hex');
}

export function actionName<A>(node: GraphNode<A>, parent: GraphNode<A>) {
  const names = node.ancestorPath(parent).map(n => n.id).map(sanitizeName);

  // Something slightly complicated here:
  //
  // Because we'll have structured action names like:
  //
  //     'VeryLongStackName.Prepare', 'VeryLongStackName.Deploy'
  //
  // it would be shitty if cut and hashed them differently:
  //
  //     'VeryLongSAAAAA.Prepare', 'VeryLonBBBBBme.Deploy'
  //
  // wouldn't sort and comprehend nicely. We will therefore trim each component individually.
  const totalMax = 100; // Max length of everything

  // No need to do anything
  if (names.join('.').length <= totalMax) {
    return names.join('.');
  }

  const componentMin = 15; // Can't really go shorter than this, becomes unreadable
  const dots = names.length - 1;
  const maxLength = Math.max(componentMin, Math.floor((totalMax - dots) / names.length));
  const trimmedNames = names.map(name => limitIdentifierLength(name, maxLength));

  return limitIdentifierLength(trimmedNames.join('.'), totalMax); // Final trim in case we couldn't make it
}

export function stackVariableNamespace(stack: StackDeployment) {
  return limitIdentifierLength(stack.stackArtifactId, 100);
}

function sanitizeName(x: string): string {
  return x.replace(/[^A-Za-z0-9.@\-_]/g, '_');
}


/**
 * Makes sure the given identifier length does not exceed N characters
 *
 * Replaces characters in the middle (to leave the start and end identifiable) and replaces
 * them with a hash to prevent collissions.
 */
export function limitIdentifierLength(s: string, n: number): string {
  if (s.length <= n) { return s; }
  const h = hash(s).slice(0, 8);
  const mid = Math.floor((n - h.length) / 2);

  return s.slice(0, mid) + h + s.slice(-mid);
}
